import { ReactNode } from "react";
import { Nav } from "./Nav";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div>
      <Nav />
      {children}
    </div>
  );
}
