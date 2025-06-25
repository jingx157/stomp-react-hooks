// src/utils/encryption.ts
import CryptoJS from "crypto-js";

let secretKey: string | null = null;

/**
 * Set the encryption key at runtime (e.g. from env or auth).
 */
export const setEncryptionKey = (key: string) => {
    secretKey = key;
};

/**
 * Encrypt any data to AES string.
 */
export const encrypt = (data: any): string => {
    if (!secretKey) throw new Error("Encryption key not set.");
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

/**
 * Decrypt AES string to original data.
 */
export const decrypt = (cipherText: string): any => {
    if (!secretKey) throw new Error("Encryption key not set.");
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
};
