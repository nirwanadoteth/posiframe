// Using standard Web Crypto API (AES-GCM)
// No external dependencies required

const SECRET_KEY =
  process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "posiframe-secure-storage-key";

const getCryptoKey = async (salt: Uint8Array): Promise<CryptoKey> => {
  const enc = new TextEncoder();

  // Import the password as a key material
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET_KEY),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  // Derive a key for use with AES-GCM
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100_000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
};

export const encryptData = async (data: string): Promise<string> => {
  try {
    const enc = new TextEncoder();

    // Generate a random salt/iv
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const key = await getCryptoKey(salt);

    const encrypted = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      enc.encode(data)
    );

    // Pack salt, iv, and ciphertext together
    const encryptedBytes = new Uint8Array(encrypted);
    const packer = new Uint8Array(
      salt.length + iv.length + encryptedBytes.length
    );
    packer.set(salt, 0);
    packer.set(iv, salt.length);
    packer.set(encryptedBytes, salt.length + iv.length);

    // Convert to base64 for storage
    return btoa(String.fromCharCode(...packer));
  } catch (error) {
    console.error("Encryption failed", error);
    return "";
  }
};

export const decryptData = async (ciphertext: string): Promise<string> => {
  try {
    // Decode base64
    const binaryString = atob(ciphertext);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Extract salt, iv, and ciphertext
    const salt = bytes.slice(0, 16);
    const iv = bytes.slice(16, 28);
    const data = bytes.slice(28);

    const key = await getCryptoKey(salt);

    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );

    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error("Decryption failed", error);
    return "";
  }
};
