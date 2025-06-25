// src/utils/encryptionMiddleware.ts
import {decrypt, encrypt, setEncryptionKey} from "./encryption";
import {useMiddleware} from "./middleware";

export function setupEncryptionMiddleware(secretKey?: string) {
    if (!secretKey) {
        console.warn("[stomp-react-hooks] Encryption disabled: no secretKey provided.");
        return;
    }

    // Set the encryption key globally
    setEncryptionKey(secretKey);

    // Outbound: encrypt message before sending
    useMiddleware.addOutbound((msg: any) => {
        try {
            const encrypted = encrypt(msg);
            return {encrypted};
        } catch (error) {
            console.error("[encryptionMiddleware] Encryption failed:", error);
            return msg; // fallback to plain message
        }
    });

    // Inbound: decrypt incoming message if encrypted
    useMiddleware.addInbound((msg: { encrypted: string; }) => {
        if (!msg.encrypted) return msg;

        try {
            return decrypt(msg.encrypted);
        } catch (error) {
            console.error("[encryptionMiddleware] Decryption failed:", error);
            return msg; // fallback to original encrypted message
        }
    });
}
