import { X, ShoppingBag, Trash2, Heart } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useWishlist } from "@/lib/wishlist-store";
import { useCart } from "@/lib/cart-store";
import { formatPrice, productImages, type Product } from "@/lib/catalog";
import { toast } from "sonner";

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onOpenCart: () => void;
  onSelectProduct: (product: Product) => void;
}

export function WishlistDrawer({
  isOpen,
  onClose,
  products,
  onOpenCart,
  onSelectProduct,
}: WishlistDrawerProps) {
  const { items, count, remove, clear } = useWishlist(products);
  const { addItem } = useCart();

  const handleMoveToBag = (product: Product) => {
    addItem(product);
    remove(product.id);
    toast.success(`${product.name} moved to your shopping bag.`);
    onClose();
    onOpenCart();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col border-l border-border bg-ink p-0 text-foreground sm:max-w-md"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <SheetTitle className="font-display text-2xl tracking-wide text-foreground">
              Saved Pieces
            </SheetTitle>
            <p className="overline mt-0.5 text-xs text-muted-foreground">
              {count} {count === 1 ? "Creation" : "Creations"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {count > 0 && (
              <button
                onClick={() => {
                  clear();
                  toast.info("Wishlist cleared");
                }}
                className="overline text-[0.625rem] text-muted-foreground hover:text-destructive"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="grid h-8 w-8 place-items-center text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Close wishlist"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full border border-border bg-bone/5">
              <Heart className="h-6 w-6 text-gold" />
            </div>
            <h3 className="mt-5 font-display text-2xl text-foreground">No saved pieces</h3>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-muted-foreground">
              Curate your personal collection of Milanese luxury by selecting the heart icon on your favorite creations.
            </p>
            <button
              onClick={() => {
                onClose();
                const elem = document.getElementById("catalogue");
                elem?.scrollIntoView({ behavior: "smooth" });
              }}
              className="gold-btn mt-6"
            >
              Explore Catalogue
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="divide-y divide-border">
              {items.map((product) => {
                const image = productImages[product.image_key];
                return (
                  <div key={product.id} className="flex gap-4 py-4 first:pt-2">
                    <button
                      onClick={() => {
                        onClose();
                        onSelectProduct(product);
                      }}
                      className="relative h-28 w-24 shrink-0 overflow-hidden bg-bone text-left cursor-pointer group"
                    >
                      {image ? (
                        <img
                          src={image}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-full w-full bg-bone" />
                      )}
                    </button>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <button
                            onClick={() => {
                              onClose();
                              onSelectProduct(product);
                            }}
                            className="font-display text-base text-left text-foreground hover:text-gold transition-colors"
                          >
                            {product.name}
                          </button>
                          <button
                            onClick={() => {
                              remove(product.id);
                              toast.info(`${product.name} removed from saved pieces`);
                            }}
                            className="text-muted-foreground hover:text-destructive"
                            aria-label="Remove from wishlist"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{product.category}</p>
                        <p className="mt-2 font-sans text-sm font-medium text-foreground">
                          {formatPrice(product.price)}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() => handleMoveToBag(product)}
                          className="gold-btn w-full justify-center !py-2 !text-[0.625rem]"
                        >
                          <ShoppingBag className="h-3 w-3" />
                          Move to Bag
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
