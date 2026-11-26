import { Container } from "@/components/shared/Container";
import type { TrylistTheme } from "@/lib/theme";
import { DealTile } from "./DealTile";
import { SpotlightTile } from "./SpotlightTile";
import { TradeTile } from "./TradeTile";

// The three promo cards that used to crowd the hero: the hero's own copy + product shot, the deal
// of the week and the featured-category tile. Placed right after the first product row.
// Desktop: spotlight takes half the width, the two tiles share the rest. Below lg they stack.
export function FeatureCards({ theme }: { theme: TrylistTheme }) {
  return (
    <section className="bg-white py-10 lg:py-12">
      <Container>
        <div className="grid grid-cols-1 gap-[18px] md:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div className="md:col-span-2 lg:col-span-1">
            <SpotlightTile hero={theme.hero} />
          </div>
          <DealTile dealTile={theme.dealTile} />
          <TradeTile tradeTile={theme.tradeTile} />
        </div>
      </Container>
    </section>
  );
}
