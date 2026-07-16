import { ConflictException } from '@nestjs/common';
import { createDecipheriv, scrypt } from 'node:crypto';
import { promisify } from 'node:util';
import { envConfig } from 'src/configs/env.config';

export async function decrypt(text: string): Promise<string> {
  const textParts = text.split(':');
  const ivHex = textParts.shift();
  const encryptedTextHex = textParts.join(':');

  if (!ivHex || !encryptedTextHex) {
    throw new ConflictException(
      'Invalid encrypted text format. Expected "iv:encryptedText"',
    );
  }

  const iv = Buffer.from(ivHex, 'hex');
  const encryptedText = Buffer.from(encryptedTextHex, 'hex');

  const key = (await promisify(scrypt)(
    envConfig.ENCRYPTION_KEY,
    envConfig.ENCRYPTION_SALT,
    32,
  )) as Buffer;
  const decipher = createDecipheriv(envConfig.ENCRYPTION_ALGORITHM, key, iv);

  const decryptedText = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final(),
  ]);

  return decryptedText.toString('utf8');
}
