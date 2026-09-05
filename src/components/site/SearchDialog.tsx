import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Search, X, ShoppingBag, ArrowRight } from "lucide-react";
import { formatPrice, productImages, type Product } from "@/lib/catalog";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

const POPULAR_SEARCHES = ["Blazer", "Leather Bag", "Satin Dress", "Pumps", "Silk Shirt", "Sunglasses"];

export function SearchDialog({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const { addItem } = useCart();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchCategory = p.category.toLowerCase().includes(q);
      const matchCollection = p.collection.toLowerCase().includes(q);
      const matchDesc = p.description?.toLowerCase().includes(q) || false;
      return matchName || matchCategory || matchCollection || matchDesc;
    });
  }, [query, products]);

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} added to your bag.`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto border-border bg-ink p-0 text-foreground sm:max-w-2xl">
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-border px-6 py-4">
          <Search className="h-5 w-5 text-gold shrink-0 mr-3" />
          <DialogTitle className="sr-only">Search Creations</DialogTitle>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search silhouettes, materials, categories..."
            className="flex-1 bg-transparent font-sans text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-muted-foreground hover:text-foreground mr-2"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="p-6">
          {!query.trim() ? (
            <div className="space-y-4">
              <span className="overline text-xs text-gold">Suggested Searches</span>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="border border-border px-3 py-1.5 font-sans text-xs text-foreground transition-colors hover:border-gold hover:text-gold"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="pt-6">
                <span className="overline text-xs text-muted-foreground">Seasonal Collections</span>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setQuery("Women")}
                    className="border border-border/70 p-4 text-left hover:border-gold transition-colors"
                  >
                    <p className="font-display text-lg">Women's Ready-to-Wear</p>
                    <span className="overline text-[0.625rem] text-gold mt-1 block">Explore</span>
                  </button>
                  <button
                    onClick={() => setQuery("Bags")}
                    className="border border-border/70 p-4 text-left hover:border-gold transition-colors"
                  >
                    <p className="font-display text-lg">Florentine Leather Bags</p>
                    <span className="overline text-[0.625rem] text-gold mt-1 block">Explore</span>
                  </button>
                </div>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-display text-xl text-foreground">No pieces match "{query}"</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Try searching for broader keywords such as "blazer", "sandals", or "silk".
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between pb-3 text-xs text-muted-foreground border-b border-border/60">
                <span>{filtered.length} {filtered.length === 1 ? "result" : "results"} found</span>
                <span className="overline text-[0.625rem] text-gold">Click to inspect</span>
              </div>
              <div className="divide-y divide-border">
                {filtered.map((product) => {
                  const image = productImages[product.image_key];
                  return (
                    <div
                      key={product.id}
                      onClick={() => {
                        onClose();
                        onSelectProduct(product);
                      }}
                      className="group flex cursor-pointer items-center justify-between py-4 transition-colors hover:bg-bone/5 px-2"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-14 overflow-hidden bg-bone shrink-0">
                          {image && (
                            <img
                              src={image}
                              alt={product.name}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-display text-base text-foreground group-hover:text-gold transition-colors">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{product.category}</p>
                          <p className="mt-1 font-sans text-xs font-medium text-foreground">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleQuickAdd(product, e)}
                          className="hairline-btn !px-3 !py-1.5 text-[0.625rem] hover:border-gold hover:text-gold"
                          title="Quick Add to Bag"
                        >
                          <ShoppingBag className="h-3 w-3" />
                          <span className="hidden sm:inline">Add</span>
                        </button>
                        <span className="text-muted-foreground group-hover:text-gold transition-colors pl-2">
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
