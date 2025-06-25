# stomp-react-hooks

> An advanced React STOMP WebSocket client with powerful hooks, adaptive throttling, schema validation, session recovery, and role-based authorization.

[![npm version](https://img.shields.io/npm/v/stomp-react-hooks.svg)](https://www.npmjs.com/package/stomp-react-hooks)
[![license](https://img.shields.io/npm/l/stomp-react-hooks.svg)](LICENSE)
[![downloads](https://img.shields.io/npm/dw/stomp-react-hooks.svg)](https://www.npmjs.com/package/stomp-react-hooks)

---

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Advanced Usage](#advanced-usage)
- [Middleware & Extensibility](#middleware--extensibility)
- [Session Management & Recovery](#session-management--recovery)
- [Role-Based Access Control](#role-based-access-control)
- [Adaptive Throttling](#adaptive-throttling)
- [Schema Validation](#schema-validation)
- [Offline Message Queue](#offline-message-queue)
- [Event Bus & Debugging](#event-bus--debugging)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Introduction

`stomp-react-hooks` is a cutting-edge React library designed to simplify real-time WebSocket communications using the STOMP protocol. It provides:

- Easy React hooks for managing STOMP connections and topic subscriptions
- Robust utilities for handling reconnection, offline messaging, and message buffering
- Built-in schema validation and typed message support for safer data handling
- Role and attribute-based topic authorization for secure messaging
- Adaptive throttling to optimize performance based on network conditions
- A middleware system for flexible message transformations and enhancements

---

## Features

### Powerful React Hooks

- `useStompClient`: Create and manage a STOMP client with automatic reconnects and session resume.
- `useStompTopics`: Subscribe to multiple topics easily and receive the latest messages.
- `useStompReplay`: Replay the last received message from a topic.
- `useStompStatus`: Monitor connection status in real time.
- `useStompAuth`: Helper hook for async authentication token fetching.

### Adaptive Throttling

- Automatically adjusts message processing frequency based on network speed (using Network Information API) to prevent UI congestion and improve performance.

### Session Management & Recovery

- Persist subscription state and last processed messages in local storage to seamlessly resume subscriptions after disconnects or page reloads.

### Typed & Schema-Validated Messaging

- Register JSON schemas per topic for strict message validation using Ajv.
- Blocks invalid messages and emits warnings to avoid runtime errors.

### Role-Based Access Control (RBAC)

- Define access policies with role and attribute conditions on topics.
- Secure subscriptions so only authorized roles can subscribe or publish.

### Offline Message Queueing

- Buffer outgoing messages when offline and automatically flush them once reconnected to ensure message delivery reliability.

### Middleware & Extensibility

- Flexible middleware hooks allow transforming or filtering inbound and outbound messages, enabling features like encryption, compression, or logging.

### Event Bus & Debugging

- Global event bus for listening to connection events, errors, messages, and debug logs, perfect for monitoring or integrating with analytics.

---

## Installation

```bash
npm install stomp-react-hooks
# or
yarn add stomp-react-hooks
```

Peer dependencies:

- React 17+
- @stomp/stompjs 6.1+

---

## Getting Started

```tsx
import React from "react";
import {
  useStompClient,
  useStompTopics,
  registerSchema,
} from "stomp-react-hooks";

const CHAT_TOPIC = "/app/chat/messages";

// Register schema for chat messages
registerSchema(CHAT_TOPIC, {
  type: "object",
  properties: {
    id: { type: "string" },
    user: { type: "string" },
    text: { type: "string" },
  },
  required: ["id", "user", "text"],
});

function Chat() {
  const { subscribeTyped, send, connected } = useStompClient({
    brokerURL: "ws://localhost:8080/ws",
    userRole: "user",
    enableDebug: true,
  });

  const messages = useStompTopics([CHAT_TOPIC]);

  React.useEffect(() => {
    const subscription = subscribeTyped(CHAT_TOPIC, (msg) => {
      console.log("Received message:", msg);
    });
    return () => subscription?.unsubscribe();
  }, [subscribeTyped]);

  const sendMessage = () => {
    if (!connected) return;
    send(CHAT_TOPIC, {
      id: Date.now().toString(),
      user: "user",
      text: "Hello World!",
    });
  };

  return (
    <div>
      <button onClick={sendMessage} disabled={!connected}>
        Send Message
      </button>
      <ul>
        {messages[CHAT_TOPIC]?.map((msg) => (
          <li key={msg.id}>
            <strong>{msg.user}:</strong> {msg.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## API Reference

### `useStompClient(config)`

Manage STOMP connection and subscriptions.

- `brokerURL` (string): WebSocket endpoint URL.
- `namespace` (string, optional): Topic namespace prefix (default: `'app'`).
- `userRole` (string, optional): User role for topic permission checks.
- `userAttributes` (object, optional): Attributes for fine-grained access control.
- `maxRetryAttempts` (number, optional): Max reconnect attempts (default: 5).
- `enableDebug` (boolean, optional): Enable debug logging.

Returns:

- `client`: STOMP client instance.
- `connected`: Boolean connection status.
- `subscribeTyped(topic, handler, timeoutMs?)`: Typed and schema-validated subscription method.
- `send(topic, message, headers?)`: Send messages.
- `reconnect()`: Manual reconnect trigger.

### `subscribeTyped<T>(topic, handler, timeoutMs?)`

Subscribe with typed payload validation.

- `topic`: STOMP destination.
- `handler`: Callback receiving typed message.
- `timeoutMs`: Optional auto-unsubscribe timer in ms.

Returns: Subscription object with `.unsubscribe()`.

---

## Advanced Usage

### Middleware

Register middleware to transform messages:

```ts
import { useMiddleware } from "stomp-react-hooks";

useMiddleware.addInbound((msg) => {
  // decrypt or modify incoming msg
  return msg;
});

useMiddleware.addOutbound((msg) => {
  // encrypt or log outgoing msg
  return msg;
});
```

### Session Management

The client automatically persists subscriptions and last message IDs. You can also manually save/load session with utility functions in `src/utils/sessionRecovery.ts`.

### Permissions

Define policies in `topicGuard` util or provide your own dynamic policy system for fine control over who can subscribe/publish to topics.

---

## Offline Support

Messages sent while disconnected are buffered and automatically sent when the connection is restored, ensuring no message loss.

---

## Event Bus

Listen for global events:

```ts
import { eventBus } from "stomp-react-hooks";

eventBus.on("connected", () => console.log("Connected!"));
eventBus.on("disconnected", () => console.log("Disconnected!"));
eventBus.on("message", (msg) => console.log("Message received:", msg));
eventBus.on("debug", (log) => console.debug("Debug:", log));
eventBus.on("error", (err) => console.error("Error:", err));
```

---

## Contributing

Contributions are welcome! Please open issues and submit PRs on [GitHub](https://github.com/jingx157/stomp-react-hooks).

---

## License

MIT © Jingx

---

## Contact

For support or questions, open an issue or contact [chingc035@gmail.com].
