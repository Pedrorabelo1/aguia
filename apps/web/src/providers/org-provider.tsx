"use client";

import { createContext, useContext } from "react";

interface OrgData {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgColor: string;
  sidebarColor: string;
  fontFamily: string;
  plan: string;
}

const OrgContext = createContext<OrgData | null>(null);

export function OrgProvider({
  org,
  children,
}: {
  org: OrgData;
  children: React.ReactNode;
}) {
  return <OrgContext.Provider value={org}>{children}</OrgContext.Provider>;
}

export function useOrg() {
  const ctx = useContext(OrgContext);
  if (!ctx) throw new Error("useOrg must be used within OrgProvider");
  return ctx;
}
