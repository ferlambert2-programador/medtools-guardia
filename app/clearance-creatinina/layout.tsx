import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clearance de creatinina (Cockcroft–Gault)",
  description:
    "Estima el aclaramiento de creatinina en mL/min con la fórmula de Cockcroft–Gault a partir de edad, peso, sexo y creatinina sérica.",
};

export default function ClearanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
