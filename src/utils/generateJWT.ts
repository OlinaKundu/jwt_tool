import jwt, { Algorithm } from 'jsonwebtoken';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function generateJWT(header: any, payload: any, secret: string, algorithm: string): string | null {
  try {
    // Handle "none" algorithm
    if (algorithm.toLowerCase() === 'none') {
      const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
      const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
      return `${encodedHeader}.${encodedPayload}.`;
    }

    // Adjust payload if exp is provided as string to number (or vice versa if needed)
    // but typically users provide valid JSON.
    
    // We override the header with the provided header, algorithm is forced by the library 
    // but we specify it in signing options to be safe
    const token = jwt.sign(payload, secret, {
      algorithm: algorithm as Algorithm,
      header: header,
    });
    
    return token;
  } catch (error) {
    console.error('Error generating token', error);
    return null;
  }
}
