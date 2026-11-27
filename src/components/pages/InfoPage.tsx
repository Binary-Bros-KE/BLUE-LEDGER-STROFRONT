import type { ReactNode } from "react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { Container } from "@/components/shared/Container";

/** A plain content page (contact, policies): the same cream header band as the product listing, then
 * readable body copy. Sections are passed in as children; use InfoSection for each block. */
export function InfoPage({ title, intro, children }: { title: string; intro?: string; children: ReactNode }) {
  return (
    <>
      <div className="border-b border-line bg-cream">
        <Container className="py-10">
          <Breadcrumb trail={[{ label: "Home", href: "/" }, { label: title }]} />
          <h1 className="mt-3 font-sans text-[28px] font-black leading-[1.05] tracking-[-1px] text-navy sm:text-[36px] lg:text-[44px]">
            {title}
          </h1>
          {intro ? <p className="mt-3 max-w-[680px] text-[15px] leading-[1.6] text-slate">{intro}</p> : null}
        </Container>
      </div>
      <section className="bg-white py-10 lg:py-14">
        <Container>
          <div className="flex max-w-[760px] flex-col gap-9">{children}</div>
        </Container>
      </section>
    </>
  );
}

export function InfoSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="font-sans text-[19px] font-black text-navy">{heading}</h2>
      <div className="mt-3 flex flex-col gap-3 text-[15px] leading-[1.7] text-slate [&_a]:font-semibold [&_a]:text-blue [&_a:hover]:underline">
        {children}
      </div>
    </div>
  );
}
