# stomp-react-hooks

> An advanced React STOMP WebSocket client with powerful hooks, adaptive throttling, schema validation, session
> recovery, middleware support, and role-based access control.

---

## 🌟 Features

- ✅ React Hook API**: `useStompClient`, `useStompTopics`, `useStompReplay`, `useStompStatus`
- 🔄 Adaptive Throttling**: Auto-optimizes message flow
- 🔁 Offline Queue**: Stores unsent messages when disconnected
- 🔐 Schema Validation**: Safe, typed messaging via JSON Schema
- 🔑 Role-Based Access Control**: Secure topic-level access
- 🔧 Middleware**: Modify inbound/outbound messages
- 🧠 Shared STOMP Context**: Easy access across your app
- 🧲 Event Bus**: Global connection/message listeners
- ⚡ Retry Logic**: Auto reconnect with exponential backoff

---

## 📦 Installation

```bash
npm install stomp-react-hooks
```

> Peer dependencies: `react`, `@stomp/stompjs`

---

## 🧪 Quick Start

```tsx
import React from "react";
import {
    useStompClient,
    useStompTopics,
    registerSchema,
} from "stomp-react-hooks";

const TOPIC = "/app/chat/messages";

registerSchema(TOPIC, {
    type: "object",
    properties: {
        id: {type: "string"},
        user: {type: "string"},
        text: {type: "string"}
    },
    required: ["id", "user", "text"]
});

function Chat() {
    const {connected, send, subscribeTyped} = useStompClient({
        brokerURL: "ws://localhost:8080/ws",
        enableDebug: true,
        userRole: "user"
    });

    const messages = useStompTopics([TOPIC]);

    React.useEffect(() => {
        const sub = subscribeTyped(TOPIC, (msg) => {
            console.log("Received:", msg);
        });
        return () => sub?.unsubscribe();
    }, []);

    return (
        <>
            <button onClick={() => send(TOPIC, {
                id: Date.now().toString(), user: "user", text: "Hello!"
            })}>Send
            </button>

            <ul>
                {messages[TOPIC]?.map(msg => (
                    <li key={msg.id}><b>{msg.user}:</b> {msg.text}</li>
                ))}
            </ul>
        </>
    );
}
```

---

## ⚙️ `useStompClient(config)`

Manages a STOMP connection and subscriptions.

### Options:

```ts
{
    brokerURL: string;
    namespace ? : string;
    connectHeaders ? : Record<string, string> | (() => Promise<Record<string, string>>);
    userRole ? : string;
    userAttributes ? : Record<string, any>;
    enableDebug ? : boolean;
    maxRetryAttempts ? : number;
}
```

### Returns:

- `client`: The STOMP client
- `connected`: Connection status
- `send(destination, body, headers?)`
- `subscribeTyped<T>(destination, handler, timeoutMs?)`
- `subscribe(destination, handler)`
- `reconnect()`

---

## 🧠 Shared Context Setup

```tsx
import {StompProvider, useStomp} from "stomp-react-hooks/context/StompContext";

export function App() {
    return (
        <StompProvider config={{brokerURL: "ws://localhost:8080/ws"}}>
            <Chat/>
        </StompProvider>
    );
}

function Chat() {
    const {subscribeTyped, send} = useStomp();
    // ...
}
```

---

### 🔔 `subscribe(destination, handler)`

Basic topic subscription without schema validation or parsing.

```tsx
const {subscribe} = useStomp();

subscribe("topic/my-raw-event", (msg) => {
    console.log("Raw STOMP message:", msg.body);
});
```

---

### 📦 `subscribeTyped<T>(destination, handler, timeoutMs?)`

Typed topic subscription with middleware + schema validation.

```tsx
const {subscribeTyped} = useStomp();

subscribeTyped<{ id: string; type: string }>("topic/one-dice:123", (data) => {
    console.log("Validated and typed payload:", data);
});
```

> ✅ Automatically applies middleware and schema validation if registered.

---


> ✅ Ensures clean disconnection when auth expires or the app resets.

---

---

## 🔐 Auth Header Usage

### Static Headers:

```ts
useStompClient({
    brokerURL: "ws://...",
    connectHeaders: {
        Authorization: "Bearer yourToken"
    }
});
```

### Dynamic (Async) Headers:

```ts
useStompClient({
    brokerURL: "ws://...",
    connectHeaders: async () => {
        const token = await fetch('/auth/token');
        return {Authorization: `Bearer ${token}`};
    }
});
```

---

## 🔄 Offline Support

Messages sent while disconnected are buffered and auto-flushed after reconnect:

```ts
send('/topic/chat', {msg: "Offline message"});
```

---

## ⚡ Middleware

`stomp-react-hooks` supports powerful middleware hooks that let you transform, encrypt, log, or filter messages
automatically.

### ✨ Use Case Examples:

```ts
import {useMiddleware} from "stomp-react-hooks";

useMiddleware.addInbound((msg) => {
    msg.receivedAt = Date.now();
    return msg;
});

useMiddleware.addOutbound((msg) => {
    console.debug("Sending:", msg);
    return msg;
});
```

If you want to encrypt all messages with AES, you can create a setup like this:

```ts
// index.tsx
import {setupEncryptionMiddleware} from "@/utils/encryptionMiddleware";

// Set key from .env, auth, or props
setupEncryptionMiddleware(env.SECRET_KEY);
```

---

## 📊 Event Bus

```ts
import {eventBus} from "stomp-react-hooks";

eventBus.on("connected", () => console.log("CONNECTED"));
eventBus.on("message", (msg) => console.log("MSG", msg));
eventBus.on("error", (err) => console.error("ERR", err));
```

---

## 📚 API Summary

| Hook               | Purpose                           |
|--------------------|-----------------------------------|
| `useStompClient()` | Connect, send, subscribe          |
| `useStompTopics()` | Store and retrieve topic messages |
| `useStompStatus()` | Reactively watch connection       |
| `useStompReplay()` | Replay last message               |
| `useMiddleware`    | Register transformers             |
| `registerSchema()` | Register JSON schema for topic    |

---

## 💼 Role-Based Access

Pass your user's role and optional attributes:

```ts
useStompClient({
    userRole: "admin",
    userAttributes: {team: "engineering"}
});
```

---

## 🛠 Project Structure

```text
src/
├── hooks/
│   └── useStompClient.ts
│   └── useStompTopics.ts
│   └── ...
├── context/
│   └── StompContext.tsx
├── utils/
│   └── middleware.ts
│   └── offlineQueue.ts
│   └── ...
```

---

## 🤝 Contributing

We welcome PRs and issues! Fork this repo and run:

```bash
npm install
npm run build
```

---

## 📄 License

MIT © Bros Chign (https://github.com/jingx157)

---

## 📬 Contact

For support or questions:  
📧 chingc035@gmail.com  
💬 GitHub Issues: https://github.com/jingx157/stomp-react-hooks/issues

```
