import Link from "next/link";
import { Placeholder } from "@/components/shared/Placeholder";
import { slugify } from "@/lib/slug";
import type { Category } from "@/lib/products";

/** One category tile — image (or the hatch placeholder) + name + product count. Shared by the home
 * page's category carousel and the /categories landing page. */
export function CategoryTile({ category: cat, image }: { category: Category; image?: string | undefined }) {
  return (
    <Link
      href={`/products/${slugify(cat.name)}`}
      className={`flex h-full flex-col border transition-colors ${
        cat.inverted ? "border-navy bg-navy hover:border-navy" : "border-line bg-white hover:border-navy"
      }`}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="ph-light h-[96px] w-full object-cover sm:h-[118px]" />
      ) : (
        <Placeholder caption={cat.caption} dark={cat.inverted} className="h-[96px] w-full sm:h-[118px]" />
      )}
      <div className="flex flex-1 items-center justify-between gap-2 p-3.5">
        <span
          className={`font-sans text-[13px] font-extrabold leading-tight sm:text-[15px] ${
            cat.inverted ? "text-white" : "text-navy"
          }`}
        >
          {cat.name}
        </span>
        <span
          className={`flex-none font-mono text-[10px] uppercase tracking-[1.2px] ${
            cat.inverted ? "text-amber" : "text-slate"
          }`}
        >
          {cat.count}
        </span>
      </div>
    </Link>
  );
}
