import { Newsletter } from "./Newsletter";
import type { InfoTopic } from "./InfoDialog";

interface FooterProps {
  onOpenInfo?: (topic: InfoTopic) => void;
}

const itemToTopicMap: Record<string, InfoTopic> = {
  "Shipping & payment": "shipping",
  "Returns & exchanges": "returns",
  "Size guide": "size-guide",
  "Contact us": "contact",
  "Our story": "story",
  Sustainability: "sustainability",
  Careers: "careers",
  "Store locator": "stores",
  "Privacy policy": "privacy",
  "Terms of use": "terms",
  "Cookie preferences": "cookies",
};

const columns = [
  {
    title: "Customer care",
    items: ["Shipping & payment", "Returns & exchanges", "Size guide", "Contact us"],
  },
  {
    title: "The house",
    items: ["Our story", "Sustainability", "Careers", "Store locator"],
  },
  {
    title: "Legal",
    items: ["Privacy policy", "Terms of use", "Cookie preferences"],
  },
];

export function Footer({ onOpenInfo }: FooterProps) {
  const handleClick = (e: React.MouseEvent, item: string) => {
    e.preventDefault();
    if (onOpenInfo && itemToTopicMap[item]) {
      onOpenInfo(itemToTopicMap[item]);
    }
  };

  return (
    <footer className="border-t border-border bg-ink">
      <div className="mx-auto max-w-[1400px] px-6 py-20">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_1fr]">
          <Newsletter />
          <div className="grid gap-10 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="overline font-sans text-foreground">{column.title}</h3>
                <ul className="mt-5 space-y-3">
                  {column.items.map((item) => (
                    <li key={item}>
                      <button
                        type="button"
                        onClick={(e) => handleClick(e, item)}
                        className="font-sans text-sm text-muted-foreground transition-colors hover:text-gold text-left cursor-pointer"
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <span className="font-display text-xl tracking-luxe">LUXORA</span>
          <p className="overline text-muted-foreground">© 2026 Luxora Milano — All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}
