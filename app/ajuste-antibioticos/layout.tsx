import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ajuste renal de antibióticos",
  description:
    "Resumen educativo de consideraciones de ajuste por función renal para antibióticos frecuentes en urgencias.",
};

export default function AntibioticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
