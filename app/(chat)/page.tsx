import { cookies } from 'next/headers';

import { Chat } from '@/components/chat';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import { generateUUID } from '@/lib/utils';
import { DataStreamHandler } from '@/components/data-stream-handler';

export default async function Page({
  searchParams,
}: { searchParams: Promise<{ new_chat_message: string }> }) {
  const id = generateUUID();

  const [cookieStore, reqSearchParams] = await Promise.all([
    cookies(),
    searchParams,
  ]);
  const modelIdFromCookie = cookieStore.get('chat-model');

  if (!modelIdFromCookie) {
    return (
      <>
        <Chat
          key={id}
          id={id}
          initialMessages={[]}
          selectedChatModel={DEFAULT_CHAT_MODEL}
          selectedVisibilityType="private"
          isReadonly={false}
          initialInput={reqSearchParams.new_chat_message}
        />
        <DataStreamHandler id={id} />
      </>
    );
  }

  return (
    <>
      <Chat
        key={id}
        id={id}
        initialMessages={[]}
        selectedChatModel={modelIdFromCookie.value}
        selectedVisibilityType="private"
        isReadonly={false}
        initialInput={reqSearchParams.new_chat_message}
      />
      <DataStreamHandler id={id} />
    </>
  );
}
