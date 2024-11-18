import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liar's Bar - A Game of Chance",
  description:
    "Test your luck in this thrilling game of chance where one wrong move could be your last.",
};

export default function LiarsBarGunLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
