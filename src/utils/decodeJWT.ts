import jwt from 'jsonwebtoken';

export interface DecodedJWT {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  header: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
  signature: string;
}

export function decodeJWT(token: string): DecodedJWT | null {
  try {
    // jwt.decode doesn't verify the signature, just decodes
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded) return null;

    const parts = token.split('.');
    
    return {
      header: decoded.header,
      payload: decoded.payload,
      signature: parts.length === 3 ? parts[2] : '',
    };
  } catch {
    return null;
  }
}
