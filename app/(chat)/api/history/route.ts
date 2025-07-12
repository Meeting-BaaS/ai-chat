import { getAuthSession } from '@/lib/auth/session';
import type { NextRequest } from 'next/server';
import { getChatsByUserId } from '@/server/db/queries';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const requestCookies = await cookies();
  const { searchParams } = request.nextUrl;

  const limit = Number.parseInt(searchParams.get('limit') || '10');
  const startingAfter = searchParams.get('starting_after');
  const endingBefore = searchParams.get('ending_before');

  if (startingAfter && endingBefore) {
    return Response.json(
      'Only one of starting_after or ending_before can be provided!',
      { status: 400 },
    );
  }

  const session = await getAuthSession(requestCookies.toString());

  if (!session?.user?.id) {
    return Response.json('Unauthorized!', { status: 401 });
  }

  try {
    const chats = await getChatsByUserId({
      id: session.user.id,
      limit,
      startingAfter,
      endingBefore,
    });

    return Response.json(chats);
  } catch (_) {
    return Response.json('Failed to fetch chats!', { status: 500 });
  }
}
