import { jwtVerify, SignJWT } from 'jose';

interface SessionPayload {
  userId: string;
  email: string;
  [key: string]: any;
}

const secretKey = process.env.JWT_SECRET || 'super-secret-key-rouji-project';
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload as SessionPayload;
  } catch (error) {
    return null;
  }
}
