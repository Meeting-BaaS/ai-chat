'use client';

import { spotlightAnimation } from '@/lib/animations/background';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import Image from 'next/image';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// This is a generic error message that is shown when the error is not known or has a digest string.
// Most likely, this error occurred due to cookie mismatch or internal server errors.
const genericErrorMessage =
  'There was an unknown error. Please clear the cookies and try again.';

export default function ErrorBoundary({ error }: ErrorProps) {
  useEffect(() => {
    console.error('Something went wrong', error);
  }, [error]);

  const supportEmail =
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? 'support@meetingbaas.com';

  return (
    <div className="relative flex max-h-screen max-w-screen grow flex-col items-center justify-center">
      <div className="z-10 flex flex-col items-center justify-center gap-10 p-4 text-center">
        <h1 className="font-bold text-3xl">Oops...something went wrong</h1>
        <Image
          src="/error.svg"
          alt="Illustration showing an application error state"
          width={484}
          height={127}
          priority
        />
        <div className="max-w-4xl text-lg">
          <p className="mb-1">
            {/* If there's a digest, it could be a sensitive error that took place in server components (and is already logged)
            In such a case we don't want to show the actual error message */}
            {error.digest
              ? genericErrorMessage
              : error.message || genericErrorMessage}
          </p>
          If the error persists, please contact us on{' '}
          <Button variant="link" asChild className="h-auto p-0 text-lg">
            <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
          </Button>
        </div>
      </div>
      <motion.div
        className="-translate-y-1/2 absolute top-1/2 size-64 rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(0, 219, 205, 0.3) 10%, rgba(0, 219, 205, 0.2) 80%, transparent 100%)',
        }}
        initial={{ opacity: 0 }}
        animate={spotlightAnimation}
        aria-hidden="true"
      />
    </div>
  );
}
