import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { headers } from 'next/headers';
import NotFound from '@/app/not-found';
import { isbot } from 'isbot';
import './globals.css';

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
  maximumScale: 1, // Disable auto-zoom on mobile Safari
};

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono',
});

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
  const requestHeaders = await headers();
  const userAgent = requestHeaders.get('user-agent');
  // If the request is from a bot, show the not found page (Since this is a private app, we don't want bots to access it)
  // This is to prevent bots from being redirected to the auth app
  if (isbot(userAgent)) {
    return <NotFound />;
  }

  return (
    <html
      lang="en"
      // `next-themes` injects an extra classname to the body element to avoid
      // visual flicker before hydration. Hence the `suppressHydrationWarning`
      // prop is necessary to avoid the React hydration mismatch warning.
      // https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: THEME_COLOR_SCRIPT,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster position="top-center" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
