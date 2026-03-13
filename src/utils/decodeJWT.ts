export interface DecodedResult {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  header?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
  signature?: string;
  error?: string;
}

function base64UrlDecode(str: string) {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, "=");
  try {
     return decodeURIComponent(escape(atob(padded)));
  } catch {
     return atob(padded);
  }
}

export function decodeJWT(token: string): DecodedResult {
  const parts = token.split('.');
  
  if (parts.length !== 3) {
    return { error: 'Invalid JWT format. A JWT must contain header.payload.signature' };
  }

  try {
    const headerStr = base64UrlDecode(parts[0]);
    const payloadStr = base64UrlDecode(parts[1]);

    const header = JSON.parse(headerStr);
    const payload = JSON.parse(payloadStr);

    let error: string | undefined = undefined;
    
    // Check if signature is at least 256 bits long.
    // Base64URL encoding of 32 bytes (256 bits) is 43 characters long without padding.
    if (parts[2].length < 43) {
      error = 'Signature is weak (less than 256 bits).';
    }

    return {
      header,
      payload,
      signature: parts[2],
      error
    };
  } catch {
    return { error: 'Unable to decode JWT' };
  }
}
