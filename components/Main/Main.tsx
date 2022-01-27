import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function Main({ children, className }: Props) {
  return (
    <main className={`max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </main>
  );
}
