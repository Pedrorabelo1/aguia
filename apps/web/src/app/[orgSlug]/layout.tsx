import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { OrgProvider } from "@/providers/org-provider";

// Mock org data for development
async function getOrgBySlug(slug: string) {
  return {
    id: "mock-org-id",
    name: slug.charAt(0).toUpperCase() + slug.slice(1),
    slug,
    logoUrl: null,
    faviconUrl: null,
    primaryColor: "#00D4AA",
    secondaryColor: "#0EA5E9",
    accentColor: "#F59E0B",
    bgColor: "#0B1120",
    sidebarColor: "#0D1526",
    fontFamily: "Inter",
    plan: "STARTER",
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;
  const org = await getOrgBySlug(orgSlug);
  return {
    title: `${org.name} - AGUIA`,
    icons: org.faviconUrl
      ? [{ rel: "icon", url: org.faviconUrl }]
      : undefined,
  };
}

export default async function OrgLayout({
  params,
  children,
}: {
  params: Promise<{ orgSlug: string }>;
  children: React.ReactNode;
}) {
  const { orgSlug } = await params;
  const org = await getOrgBySlug(orgSlug);

  const themeVars = {
    "--aguia-primary": org.primaryColor,
    "--aguia-secondary": org.secondaryColor,
    "--aguia-accent": org.accentColor,
    "--aguia-bg": org.bgColor,
    "--aguia-sidebar": org.sidebarColor,
    "--aguia-font": org.fontFamily,
  } as React.CSSProperties;

  return (
    <OrgProvider org={org}>
      <div style={themeVars} className="flex h-screen overflow-hidden font-brand">
        <Sidebar org={org} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header org={org} />
          <main className="flex-1 overflow-y-auto bg-gradient-dark p-6 scrollbar-thin">
            {children}
          </main>
        </div>
      </div>
    </OrgProvider>
  );
}
