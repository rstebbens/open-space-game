"use client";

import { LiveblocksProvider } from "@liveblocks/react";
import type { ReactNode } from "react";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LiveblocksProvider
          publicApiKey={process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY!}
        >
          {children}
        </LiveblocksProvider>
      </body>
    </html>
  );
}