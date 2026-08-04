// lib/liveblocks.js
import { createClient } from "@liveblocks/client";

const publicApiKey = process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY;

export const client = publicApiKey
  ? createClient({
      publicApiKey,
    })
  : null;