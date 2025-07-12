'use server';
import 'server-only';
import { cookies } from 'next/headers';

export async function auth() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get('jwt')?.value;

  if (!jwt) return null;

  const apiUrl = process.env.API_SERVER_BASEURL;

  if (!apiUrl) {
    console.error(
      'API_SERVER_BASEURL is not set. Please add it to the environment configuration.',
    );
    return { jwt: null, apiKey: null };
  }

  const response = await fetch(`${apiUrl}/accounts/api_key`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `jwt=${jwt}`,
    },
  });

  if (!response.ok) return { jwt: null, apiKey: null };
  const data = (await response.json()) as {
    api_key?: string;
  };
  return { jwt, apiKey: data?.api_key ?? null };
}
