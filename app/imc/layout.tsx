import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculadora de IMC",
  description:
    "Calcula el índice de masa corporal (IMC) en español con categorías orientativas para adultos.",
};

export default function ImcLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
