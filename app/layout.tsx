import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import { Sofia_Sans } from 'next/font/google';
import { cookies, headers } from 'next/headers';
import NotFound from '@/app/not-found';
import { isbot } from 'isbot';
import { getAuthSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { getAuthAppUrl } from '@/lib/auth/auth-app-url';
import Providers from '@/components/providers';
import LayoutRoot from '@/app/layout-root';
import './globals.css';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'BaaS Chat | Meeting BaaS',
  description:
    'Chat with our API using natural language. Send bots, debug issues, and try all functionalities from our MCP servers.',
  keywords: [
    'Meeting BaaS',
    'BaaS Chat',
    'AI Chat',
    'LLM Agent',
    'MCP',
    'meeting bot',
    'Google Meet',
    'Teams',
    'Zoom',
  ],
  authors: [{ name: 'Meeting BaaS Team' }],
  openGraph: {
    type: 'website',
    title: 'BaaS Chat | Meeting BaaS',
    description:
      'Chat with our API using natural language. Send bots, debug issues, and try all functionalities from our MCP servers.',
    siteName: 'Meeting BaaS',
    url: 'https://chat.meetingbaas.com',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Meeting BaaS Chat',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BaaS Chat | Meeting BaaS',
    description:
      'Chat with our API using natural language. Send bots, debug issues, and try all functionalities from our MCP servers.',
    images: ['/og-image.png'],
    creator: '@MeetingBaas',
    site: '@MeetingBaas',
  },
  category: 'Video Conferencing Tools',
  applicationName: 'Meeting BaaS',
  creator: 'Meeting BaaS',
  publisher: 'Meeting BaaS',
  referrer: 'origin-when-cross-origin',
  // This is a private app, so we can't index it
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export const viewport = {
  width: 'device-width',
  maximumScale: 1, // Disable auto-zoom on mobile Safari
};

const sofiaSans = Sofia_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const authAppUrl = getAuthAppUrl();

const LIGHT_THEME_COLOR = 'hsl(0 0% 100%)';
const DARK_THEME_COLOR = 'hsl(240deg 10% 3.92%)';
const THEME_COLOR_SCRIPT = `\
(function() {
  var html = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  function updateThemeColor() {
    var isDark = html.classList.contains('dark');
    meta.setAttribute('content', isDark ? '${DARK_THEME_COLOR}' : '${LIGHT_THEME_COLOR}');
  }
  var observer = new MutationObserver(updateThemeColor);
  observer.observe(html, { attributes: true, attributeFilter: ['class'] });
  updateThemeColor();
})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [requestHeaders, requestCookies] = await Promise.all([
    headers(),
    cookies(),
  ]);
  // RSCs need to pass cookies to getAuthSession
  const session = await getAuthSession(requestCookies.toString());
  const jwt = requestCookies.get('jwt')?.value || '';
  const isCollapsed = requestCookies.get('sidebar:state')?.value !== 'true';
  const userAgent = requestHeaders.get('user-agent');

  if (!session) {
    // If the request is from a bot, show the not found page (Since this is a private app, we don't want bots to access it)
    // This is to prevent bots from being redirected to the auth app
    if (isbot(userAgent)) {
      return <NotFound />;
    }
    const redirectTo = requestHeaders.get('x-redirect-to');
    const redirectionUrl = redirectTo
      ? `${authAppUrl}/sign-in?redirectTo=${redirectTo}`
      : `${authAppUrl}/sign-in`;
    redirect(redirectionUrl);
  }

  return (
    <html
      lang="en"
      // `next-themes` injects an extra classname to the body element to avoid
      // visual flicker before hydration. Hence the `suppressHydrationWarning`
      // prop is necessary to avoid the React hydration mismatch warning.
      // https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
      suppressHydrationWarning
      className={sofiaSans.className}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: THEME_COLOR_SCRIPT,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <Script
          src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
          strategy="beforeInteractive"
        />
        <Providers jwt={jwt} isCollapsed={isCollapsed} initialSession={session}>
          <LayoutRoot session={session}>{children}</LayoutRoot>
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
