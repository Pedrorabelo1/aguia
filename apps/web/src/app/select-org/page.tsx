"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Org {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  primaryColor: string;
}

export default function SelectOrgPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/orgs`, {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setOrgs(data);
        setLoading(false);
        if (data.length === 1) {
          router.push(`/${data[0].slug}`);
        }
      })
      .catch(() => setLoading(false));
  }, [isLoaded, user, router]);

  if (!isLoaded || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
      </div>
    );
  }

  if (orgs.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Bem-vindo ao AGUIA</h1>
          <p className="mt-2 text-gray-600">Você ainda não faz parte de nenhuma organização.</p>
          <button
            onClick={() => router.push("/onboarding")}
            className="mt-4 rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
          >
            Criar Organização
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <h1 className="mb-6 text-center text-2xl font-bold">Selecionar Organização</h1>
        <div className="space-y-3">
          {orgs.map((org) => (
            <button
              key={org.id}
              onClick={() => router.push(`/${org.slug}`)}
              className="flex w-full items-center gap-4 rounded-lg border bg-white p-4 transition hover:shadow-md"
            >
              {org.logoUrl ? (
                <img src={org.logoUrl} alt={org.name} className="h-10 w-10 rounded-lg object-cover" />
              ) : (
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-white font-bold"
                  style={{ backgroundColor: org.primaryColor }}
                >
                  {org.name[0]}
                </div>
              )}
              <div className="text-left">
                <p className="font-semibold">{org.name}</p>
                <p className="text-sm text-gray-500">{org.slug}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
