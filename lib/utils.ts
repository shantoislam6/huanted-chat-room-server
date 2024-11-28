import { promises as dns } from 'node:dns';

export function delay(duration: number) {
  if (duration < 0) throw new Error('Duration must be greater than 0');
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

export function logDev(err: unknown) {
  if (Deno.env.get('MODE') === 'development') {
    console.error(err);
  }
}

export async function isEmailDnsValid(email: string): Promise<boolean> {
  const domain = email.split('@')[1];
  if (!domain) {
    throw new Error('Invalid email format');
  }
  try {
    const mxRecords = await dns.resolveMx(domain);
    return mxRecords.length > 0;
  } catch {
    return false;
  }
}
