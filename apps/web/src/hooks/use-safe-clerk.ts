"use client";

import { useState, useEffect } from "react";

interface SafeUser {
  fullName: string | null;
  imageUrl: string | null;
}

export function useSafeUser(): { user: SafeUser | null } {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { useUser } = require("@clerk/nextjs");
    return useUser();
  } catch {
    return { user: null };
  }
}

export function useSafeClerk(): { signOut: () => void } {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { useClerk } = require("@clerk/nextjs");
    return useClerk();
  } catch {
    return { signOut: () => {} };
  }
}
