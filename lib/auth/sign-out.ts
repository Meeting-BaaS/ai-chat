import { getAuthAppUrl } from '@/lib/auth/auth-app-url';

/**
 * Function to sign out from auth app. Called from Client
 */
export async function signOut(): Promise<boolean> {
  try {
    const authAppUrl = getAuthAppUrl();

    const response = await fetch(`${authAppUrl}/api/auth/sign-out`, {
      method: 'POST',
      body: JSON.stringify({}),
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(
        `Sign out failed: ${response.status} ${response.statusText}`,
      );
    }

    return true;
  } catch (error) {
    console.error('Error signing out user:', error);
    return false;
  }
}
