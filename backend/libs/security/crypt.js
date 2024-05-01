import crypto from 'crypto';

// Generate secret hash with crypto to use for encryption
const key = crypto
  .createHash('sha512')
  .update(process.env.NEXT_PUBLIC_ENCRYPTION_KEY)
  .digest('hex')
  .substring(0, 32)
const encryptionIV = crypto
  .createHash('sha512')
  .update(process.env.NEXT_PUBLIC_ENCRYPTION_IV_KEY)
  .digest('hex')
  .substring(0, 16);

  const encryptionMethod = "aes-256-cbc";

  // Encrypt data
export function encryptData(data) {
    const cipher = crypto.createCipheriv(encryptionMethod, key, encryptionIV)
    return Buffer.from(
      cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
    ).toString('base64') // Encrypts data and converts to hex and base64
  }
  
  // Decrypt data
  export function decryptData(encryptedData) {
    const buff = Buffer.from(encryptedData, 'base64')
    const decipher = crypto.createDecipheriv(encryptionMethod, key, encryptionIV)
    return (
      decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
      decipher.final('utf8')
    ) // Decrypts data and converts to utf8
  }