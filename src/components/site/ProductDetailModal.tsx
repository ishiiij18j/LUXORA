import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Heart, Plus, Minus, Check, Sparkles, ShieldCheck, Ruler, Truck } from "lucide-react";
import { formatPrice, productImages, getDefaultSizeForProduct, type Product } from "@/lib/catalog";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { toast } from "sonner";

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenCart: () => void;
  onOpenSizeGuide?: () => void;
}

export function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onOpenCart,
  onOpenSizeGuide,
}: ProductDetailModalProps) {
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedSize(getDefaultSizeForProduct(product));
      setSelectedColor(product.colors?.[0]?.name || "");
      setQuantity(1);
      setIsAdded(false);
    }
  }, [product, isOpen]);

  if (!product) return null;

  const image = productImages[product.image_key];
  const isWishlisted = has(product.id);

  const handleAddToCart = () => {
    addItem(product, selectedSize, selectedColor, quantity);
    setIsAdded(true);
    toast.success(`${product.name} (${selectedSize}) added to your bag.`);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleToggleWishlist = () => {
    const favorited = toggle(product.id);
    if (favorited) {
      toast.success(`${product.name} saved to your wishlist.`);
    } else {
      toast.info(`${product.name} removed from your wishlist.`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto border-border bg-ink p-0 text-foreground sm:max-w-3xl">
        <div className="grid md:grid-cols-2">
          {/* Product Image */}
          <div className="relative aspect-[4/5] bg-bone md:h-full">
            {image ? (
              <img
                src={image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-bone" />
            )}
            <button
              onClick={handleToggleWishlist}
              className={`absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-border bg-ink/80 backdrop-blur transition-colors ${
                isWishlisted ? "text-gold" : "text-foreground hover:text-gold"
              }`}
              aria-label="Toggle wishlist"
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? "fill-gold text-gold" : ""}`} />
            </button>
          </div>

          {/* Product Details & Actions */}
          <div className="flex flex-col justify-between p-6 sm:p-8">
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="overline text-gold">{product.category}</span>
                  {product.collection && (
                    <span className="overline text-muted-foreground">
                      {product.collection === "new" ? "New Arrival" : "Iconic"}
                    </span>
                  )}
                </div>
                <DialogTitle className="mt-2 font-display text-3xl font-light text-foreground">
                  {product.name}
                </DialogTitle>
                <p className="mt-2 font-sans text-xl font-normal text-foreground">
                  {formatPrice(product.price)}
                </p>
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
              )}

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="overline text-[0.625rem] text-muted-foreground">Select Size</span>
                    {onOpenSizeGuide && (
                      <button
                        type="button"
                        onClick={onOpenSizeGuide}
                        className="flex items-center gap-1 text-[0.625rem] text-gold hover:underline"
                      >
                        <Ruler className="h-3 w-3" />
                        <span>Size Guide</span>
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-2 text-xs font-medium uppercase tracking-wider transition-all border ${
                          selectedSize === size
                            ? "border-gold bg-gold text-ink font-semibold"
                            : "border-border text-foreground hover:border-gold/60"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-2">
                  <span className="overline text-[0.625rem] text-muted-foreground">
                    Color: {selectedColor}
                  </span>
                  <div className="flex gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c.name)}
                        className={`h-6 w-6 rounded-full border-2 p-0.5 transition-all ${
                          selectedColor === c.name ? "border-gold scale-110" : "border-border"
                        }`}
                        title={c.name}
                      >
                        <span
                          className="block h-full w-full rounded-full"
                          style={{ backgroundColor: c.hex }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-2">
                <span className="overline text-[0.625rem] text-muted-foreground">Quantity</span>
                <div className="flex w-32 items-center border border-border">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="grid h-8 w-8 place-items-center text-muted-foreground hover:bg-bone/5 hover:text-foreground"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="flex-1 text-center text-xs font-medium">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="grid h-8 w-8 place-items-center text-muted-foreground hover:bg-bone/5 hover:text-foreground"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Details and Composition */}
              {product.composition && (
                <div className="border-t border-border/60 pt-3 text-[0.6875rem] text-muted-foreground">
                  <span className="font-semibold text-foreground">Composition: </span>
                  {product.composition}
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="mt-8 space-y-3 border-t border-border pt-5">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="gold-btn flex-1 justify-center"
                >
                  {isAdded ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-ink" />
                      Added to Bag
                    </>
                  ) : (
                    <>
                      <Plus className="h-3.5 w-3.5" />
                      Add to Bag • {formatPrice(product.price * quantity)}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleAddToCart();
                    onClose();
                    onOpenCart();
                  }}
                  className="hairline-btn px-4 text-xs hover:border-gold hover:text-gold"
                >
                  Buy Now
                </button>
              </div>

              {/* Assurances */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-[0.625rem] text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5 text-gold shrink-0" />
                  <span>Complimentary shipping</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-gold shrink-0" />
                  <span>30-day returns & exchange</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
