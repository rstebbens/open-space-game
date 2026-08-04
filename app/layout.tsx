"use client";

import { LiveblocksProvider } from "@liveblocks/react";
import type { ReactNode } from "react";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const publicApiKey = process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY;

  return (
    <html lang="en">
      <body>
        {publicApiKey ? (
          <LiveblocksProvider publicApiKey={publicApiKey}>
            {children}
          </LiveblocksProvider>
        ) : (
          children
        )}
      </body>
    </html>
  );
}