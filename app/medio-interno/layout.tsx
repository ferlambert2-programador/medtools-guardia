import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medio Interno",
  description:
    "Interpretación de gasometría arterial: diagnóstico ácido-base, compensación esperada, anion gap, delta-delta, gradiente A-a, P/F e índice de oxigenación.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
