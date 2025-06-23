import { spotlightAnimation } from '@/lib/animations/background';
import { Button } from '@/components/ui/button';
import * as motion from 'motion/react-client';
import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="relative flex max-h-screen max-w-screen grow flex-col items-center justify-center">
      <div className="z-10 flex flex-col items-center justify-center gap-10 p-4 text-center">
        <h1 className="font-bold text-3xl">Page not found...</h1>
        <Image
          src="/not-found.svg"
          alt="Illustration showing a 404 - page not found"
          width={363}
          height={242}
          priority
        />
        <div className="max-w-4xl space-y-1 text-lg">
          <p>Looks like you found a page that doesn&apos;t yet exist.</p>
          <p>Let&apos;s get you back to something fishy!</p>
          <Button variant="link" asChild className="h-auto p-0 text-lg">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
      <motion.div
        className="-translate-1/2 absolute top-1/2 left-1/2 h-48 w-48 rounded-full blur-3xl"
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
