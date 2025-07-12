import { getAuthSession } from '@/lib/auth/session';
import { getSuggestionsByDocumentId } from '@/server/db/queries';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const requestCookies = await cookies();
  const { searchParams } = new URL(request.url);
  const documentId = searchParams.get('documentId');

  if (!documentId) {
    return new Response('Not Found', { status: 404 });
  }

  const session = await getAuthSession(requestCookies.toString());

  if (!session || !session.user || !session.user.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const suggestions = await getSuggestionsByDocumentId({
    documentId,
  });

  const [suggestion] = suggestions;

  if (!suggestion) {
    return Response.json([], { status: 200 });
  }

  if (suggestion.userId !== session.user.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  return Response.json(suggestions, { status: 200 });
}
