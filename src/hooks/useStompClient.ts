import {useEffect, useRef, useState} from 'react';
import {Client, IMessage, StompConfig, StompHeaders, StompSubscription} from '@stomp/stompjs';
import {eventBus} from '../utils/eventBus';
import {parseMessage} from '../utils/stompHelpers';
import {messageHistory} from '../utils/messageBuffer';
import {useMiddleware} from '../utils/middleware';
import {adaptiveThrottle} from '../utils/adaptiveThrottle';
import {validateMessage} from '../utils/schemaValidator';
import {flushOfflineQueue, storeOfflineMessage} from '../utils/offlineQueue';
import {topicGuard} from '../utils/topicGuard';

interface UseStompClientConfig extends Omit<StompConfig, 'connectHeaders'> {
    namespace?: string;
    userRole?: string;
    userAttributes?: Record<string, any>;
    maxRetryAttempts?: number;
    enableDebug?: boolean;
    connectHeaders?: StompHeaders | (() => Promise<StompHeaders>);
}

export function useStompClient(config: UseStompClientConfig) {
    const client = useRef<Client | null>(null);
    const [connected, setConnected] = useState(false);
    const activeSubscriptions = useRef<Record<string, StompSubscription & { callback: (data: any) => void }>>({});
    const retryAttempts = useRef(0);
    const messageQueue: any[] = [];
    const maxRetry = config.maxRetryAttempts ?? 5;

    const resolveTopic = (t: string) => `/${config.namespace ?? 'app'}/${t}`;

    // Helper to resolve connectHeaders whether sync or async
    const resolveConnectHeaders = async (): Promise<StompHeaders> => {
        if (!config.connectHeaders) return {};
        if (typeof config.connectHeaders === 'function') {
            return await config.connectHeaders();
        }
        return config.connectHeaders;
    };

    const reconnect = () => {
        if (retryAttempts.current >= maxRetry) return;
        const delay = Math.min(30000, Math.pow(2, retryAttempts.current) * 1000);
        retryAttempts.current += 1;
        eventBus.emit('debug', `Reconnect attempt #${retryAttempts.current} after ${delay}ms`);
        setTimeout(() => client.current?.activate(), delay);
    };

    useEffect(() => {
        let stompClient: Client;

        const init = async () => {
            const headers = await resolveConnectHeaders();

            stompClient = new Client({
                ...config,
                connectHeaders: headers,
                debug: (msg) => config.enableDebug && eventBus.emit('debug', msg),
                onConnect: () => {
                    setConnected(true);
                    retryAttempts.current = 0;
                    eventBus.emit('connected');
                    Object.keys(activeSubscriptions.current).forEach(topic => {
                        subscribeTyped(topic, activeSubscriptions.current[topic].callback);
                    });
                    flushOfflineQueue(client.current!);
                },
                onDisconnect: () => {
                    setConnected(false);
                    eventBus.emit('disconnected');
                },
                onWebSocketClose: () => reconnect(),
                onStompError: () => reconnect(),
            });

            client.current = stompClient;
            stompClient.activate();
        };

        init();

        return () => {
            stompClient?.deactivate();
        };
    }, [config.brokerURL]);

    const subscribe = (destination: string, callback: (msg: IMessage) => void) => {
        if (!client.current?.connected) return;
        const fullDest = resolveTopic(destination);

        if (config.userRole && !topicGuard(fullDest, config.userRole, config.userAttributes)) {
            eventBus.emit('debug', `Access denied to topic: ${fullDest} for role: ${config.userRole}`);
            return;
        }

        const sub = client.current.subscribe(fullDest, callback);
        activeSubscriptions.current[destination] = {...sub, callback};
        return sub;
    };

    const subscribeTyped = <T = any>(destination: string, handler: (data: T) => void, timeoutMs?: number) => {
        const sub = subscribe(destination, (message) => {
            if (!adaptiveThrottle()) return;
            const parsed = parseMessage<T>(message);
            if (!validateMessage(destination, parsed)) return;
            const processed = useMiddleware.applyInbound(parsed);
            messageHistory.push({topic: destination, data: processed});
            eventBus.emit('message', {destination, payload: processed});
            handler(processed);
        });
        if (timeoutMs && sub) {
            setTimeout(() => {
                sub.unsubscribe();
                eventBus.emit('debug', `Subscription to ${destination} auto-unsubscribed after ${timeoutMs}ms`);
            }, timeoutMs);
        }
        return sub;
    };

    const send = (destination: string, body: any, headers?: Record<string, string>) => {
        const fullDest = resolveTopic(destination);
        const processed = useMiddleware.applyOutbound(body);
        if (client.current?.connected) {
            client.current.publish({destination: fullDest, body: JSON.stringify(processed), headers});
        } else {
            storeOfflineMessage({destination: fullDest, body: JSON.stringify(processed), headers});
            messageQueue.push({destination: fullDest, body: JSON.stringify(processed), headers});
        }
    };

    useEffect(() => {
        if (connected) {
            while (messageQueue.length > 0) {
                const msg = messageQueue.shift();
                client.current?.publish(msg);
            }
        }
    }, [connected]);

    return {client: client.current, connected, subscribeTyped, send, reconnect};
}

export type {UseStompClientConfig as UseStompClientOptions};
export type UseStompClientReturn = ReturnType<typeof useStompClient>;
