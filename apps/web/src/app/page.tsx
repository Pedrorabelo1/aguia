import Link from "next/link";
import { AguiaLogo } from "@/components/logo";

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Background gradient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full opacity-20 blur-[120px]"
          style={{ background: "var(--aguia-primary)" }}
        />
        <div
          className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full opacity-15 blur-[120px]"
          style={{ background: "var(--aguia-secondary)" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="text-aguia-primary" style={{ filter: "drop-shadow(0 0 30px rgba(0, 212, 170, 0.3))" }}>
            <AguiaLogo size="xl" showText={false} />
          </div>
          <h1
            className="text-5xl font-bold tracking-[0.2em] text-white"
            style={{ textShadow: "0 0 40px rgba(0, 212, 170, 0.2)" }}
          >
            AGUIA
          </h1>
          <p className="text-lg text-dark-200 tracking-wide">
            Plataforma de Gestão Empresarial
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-4 mt-4">
          <Link
            href="/demo"
            className="btn-primary px-8 py-3 text-base font-semibold tracking-wide"
          >
            Acessar Plataforma
          </Link>
          <p className="text-sm text-dark-300">
            Acesse o workspace de demonstração
          </p>
        </div>

        {/* Features grid */}
        <div className="mt-12 grid grid-cols-3 gap-4 max-w-xl">
          {[
            { label: "Quadros", desc: "Organize visualmente" },
            { label: "Processos", desc: "Automatize fluxos" },
            { label: "Equipe", desc: "Gerencie times" },
          ].map((feat) => (
            <div
              key={feat.label}
              className="glass-card p-4 text-center"
            >
              <p className="text-sm font-medium text-white">{feat.label}</p>
              <p className="text-xs text-dark-300 mt-1">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
