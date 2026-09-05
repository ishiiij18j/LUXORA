import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";
import lookbookImg from "@/assets/lookbook.jpg";
import editorialImg from "@/assets/editorial-party.jpg";
import heroImg from "@/assets/hero.jpg";
import { formatPrice, type Product } from "@/lib/catalog";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";

interface LookbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

const LOOKS = [
  {
    id: "look-1",
    title: "Look 01 — Architectural Authority",
    subtitle: "Shot at Palazzo Serbelloni, Milano",
    image: heroImg,
    productKey: "blazer",
    description: "A dialogue between masculine tailoring and feminine grace. Double-breasted Italian virgin wool.",
  },
  {
    id: "look-2",
    title: "Look 02 — Midnight Noir",
    subtitle: "Shot at Villa Necchi Campiglio",
    image: editorialImg,
    productKey: "dress",
    description: "Liquid silk drapery illuminated by candlelight. An homage to evening intrigue.",
  },
  {
    id: "look-3",
    title: "Look 03 — Modern Monolith",
    subtitle: "Shot at Galleria Vittorio Emanuele II",
    image: lookbookImg,
    productKey: "jacket",
    description: "Full-grain calfskin with sculpted silhouette. Unapologetic modernity.",
  },
];

export function LookbookModal({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}: LookbookModalProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { addItem } = useCart();

  const currentLook = LOOKS[activeIndex];
  const featuredProduct = products.find(
    (p) => p.image_key === currentLook.productKey || p.id.includes(currentLook.productKey)
  );

  const prev = () => setActiveIndex((i) => (i === 0 ? LOOKS.length - 1 : i - 1));
  const next = () => setActiveIndex((i) => (i === LOOKS.length - 1 ? 0 : i + 1));

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto border-border bg-ink p-0 text-foreground sm:max-w-4xl">
        <div className="grid md:grid-cols-[1.2fr_1fr]">
          {/* Image & Slider */}
          <div className="relative aspect-[3/4] md:h-full bg-bone overflow-hidden">
            <img
              src={currentLook.image}
              alt={currentLook.title}
              className="h-full w-full object-cover transition-all duration-700"
            />
            {/* Nav Arrows */}
            <div className="absolute inset-x-4 bottom-4 flex justify-between">
              <button
                onClick={prev}
                className="grid h-10 w-10 place-items-center rounded-full bg-ink/70 text-foreground backdrop-blur hover:bg-ink hover:text-gold"
                aria-label="Previous Look"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                onClick={next}
                className="grid h-10 w-10 place-items-center rounded-full bg-ink/70 text-foreground backdrop-blur hover:bg-ink hover:text-gold"
                aria-label="Next Look"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Look editorial text & shoppable product card */}
          <div className="flex flex-col justify-between p-8">
            <div>
              <span className="overline text-gold">Campaign FW '26</span>
              <DialogTitle className="mt-2 font-display text-3xl text-foreground font-light">
                {currentLook.title}
              </DialogTitle>
              <p className="overline text-[0.625rem] text-muted-foreground mt-1">
                {currentLook.subtitle}
              </p>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                {currentLook.description}
              </p>

              {/* Lookbook thumbnails */}
              <div className="mt-6 flex gap-2">
                {LOOKS.map((look, idx) => (
                  <button
                    key={look.id}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-16 w-12 overflow-hidden border transition-all ${
                      activeIndex === idx ? "border-gold scale-105" : "border-border opacity-60"
                    }`}
                  >
                    <img src={look.image} alt={look.title} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Shoppable Product in this look */}
            {featuredProduct && (
              <div className="mt-8 border border-border p-4 bg-bone/5">
                <span className="overline text-[0.625rem] text-gold block">Featured In This Look</span>
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-lg text-foreground">{featuredProduct.name}</h4>
                    <p className="font-sans text-xs text-muted-foreground">
                      {formatPrice(featuredProduct.price)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        onClose();
                        onSelectProduct(featuredProduct);
                      }}
                      className="hairline-btn !px-3 !py-1.5 text-[0.625rem]"
                    >
                      View Piece
                    </button>
                    <button
                      onClick={() => {
                        addItem(featuredProduct);
                        toast.success(`${featuredProduct.name} added to your bag.`);
                      }}
                      className="gold-btn !px-3 !py-1.5 text-[0.625rem]"
                    >
                      <ShoppingBag className="h-3 w-3" />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
