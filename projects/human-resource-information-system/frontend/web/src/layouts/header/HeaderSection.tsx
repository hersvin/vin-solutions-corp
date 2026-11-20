import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  title: string;
  children: ReactNode;
};

export function Section({ id, title, children }: SectionProps) {
  return (
    <section
      id={id}
      className="header-popover"
      role="region"
      aria-label={title}
    >
      {children}
    </section>
  );
}
