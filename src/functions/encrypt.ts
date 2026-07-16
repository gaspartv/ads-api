import { createCipheriv, randomBytes, scrypt } from 'node:crypto';
import { promisify } from 'node:util';
import { envConfig } from 'src/configs/env.config';

export async function encrypt(text: string): Promise<string> {
  const iv = randomBytes(16);

  const key = (await promisify(scrypt)(
    envConfig.ENCRYPTION_KEY,
    envConfig.ENCRYPTION_SALT,
    32,
  )) as Buffer;

  const cipher = createCipheriv(envConfig.ENCRYPTION_ALGORITHM, key, iv);

  const encryptedText = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final(),
  ]);

  return `${iv.toString('hex')}:${encryptedText.toString('hex')}`;
}
