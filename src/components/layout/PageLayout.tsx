import { ReactNode } from "react";

export default function PageLayout({ children }: { children: ReactNode }) {
  return (
    <main
      style={{
        position: "relative",
        zIndex: 1,
        width: "100%",
        overflowX: "hidden",
      }}
    >
      {children}
    </main>
  );
}
