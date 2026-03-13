import jwt, { Algorithm } from 'jsonwebtoken';

export interface VerifyResult {
  isValid: boolean;
  error?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  decoded?: any;
}

export function verifyJWT(token: string, secret: string, algorithm: string): VerifyResult {
  try {
    if (algorithm === 'none') {
      return { isValid: false, error: 'Algorithm "none" is not secure' };
    }

    const decoded = jwt.verify(token, secret, {
      algorithms: [algorithm as Algorithm],
    });

    return { isValid: true, decoded };
  } catch (error) {
    return { isValid: false, error: (error as Error).message || 'Invalid signature' };
  }
}
