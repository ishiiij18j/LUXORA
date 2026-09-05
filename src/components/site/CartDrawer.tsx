import { useState } from "react";
import { X, Plus, Minus, Trash2, ArrowRight, Sparkles, Check, Tag } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart-store";
import { formatPrice, productImages } from "@/lib/catalog";
import { toast } from "sonner";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout: () => void;
}

export function CartDrawer({ isOpen, onClose, onOpenCheckout }: CartDrawerProps) {
  const { items, promo, totals, count, updateQuantity, removeItem, applyPromo, removePromo } = useCart();
  const [promoInput, setPromoInput] = useState("");
  const [showPromoInput, setShowPromoInput] = useState(false);

  const handleApplyPromo = (codeToApply?: string) => {
    const code = codeToApply || promoInput;
    if (!code.trim()) return;
    const res = applyPromo(code);
    if (res.success) {
      toast.success(res.message);
      setPromoInput("");
      setShowPromoInput(false);
    } else {
      toast.error(res.message);
    }
  };

  const handleProceedCheckout = () => {
    onClose();
    onOpenCheckout();
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
              Shopping Bag
            </SheetTitle>
            <p className="overline mt-0.5 text-xs text-muted-foreground">
              {count} {count === 1 ? "Item" : "Items"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Close cart"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Compliment banner */}
        <div className="border-b border-border/60 bg-bone/5 px-6 py-2.5 text-center">
          <p className="font-sans text-[0.6875rem] uppercase tracking-wider text-gold">
            Complimentary white-glove worldwide delivery included
          </p>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full border border-border bg-bone/5">
              <Sparkles className="h-6 w-6 text-gold" />
            </div>
            <h3 className="mt-5 font-display text-2xl text-foreground">Your bag is empty</h3>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-muted-foreground">
              Discover timeless silhouettes and handcrafted Milanese essentials from our Fall/Winter '26 collection.
            </p>
            <button
              onClick={() => {
                onClose();
                const elem = document.getElementById("catalogue");
                elem?.scrollIntoView({ behavior: "smooth" });
              }}
              className="gold-btn mt-6"
            >
              Explore Collection
            </button>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="divide-y divide-border">
                {items.map((item) => {
                  const image = productImages[item.image_key];
                  return (
                    <div key={item.id} className="flex gap-4 py-4 first:pt-2">
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-bone">
                        {image ? (
                          <img
                            src={image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-bone" />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-display text-base text-foreground">
                              {item.name}
                            </h4>
                            <button
                              onClick={() => {
                                removeItem(item.id);
                                toast.info(`${item.name} removed from bag`);
                              }}
                              className="text-muted-foreground transition-colors hover:text-destructive"
                              aria-label="Remove item"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <div className="mt-1 flex flex-wrap gap-2 text-[0.6875rem] text-muted-foreground">
                            <span className="border border-border/80 px-1.5 py-0.5">
                              {item.size}
                            </span>
                            {item.color && (
                              <span className="border border-border/80 px-1.5 py-0.5">
                                {item.color}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          {/* Quantity control */}
                          <div className="flex items-center border border-border">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="grid h-7 w-7 place-items-center text-muted-foreground hover:bg-bone/5 hover:text-foreground"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="grid h-7 w-7 place-items-center text-muted-foreground hover:bg-bone/5 hover:text-foreground"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <p className="font-sans text-sm font-medium text-foreground">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Promo code area */}
              <div className="mt-4 border-t border-border pt-4">
                {promo ? (
                  <div className="flex items-center justify-between rounded border border-gold/40 bg-gold/5 px-3 py-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="h-3.5 w-3.5 text-gold" />
                      <span className="font-medium text-gold">{promo.code}</span>
                      <span className="text-muted-foreground">({promo.description})</span>
                    </div>
                    <button
                      onClick={() => {
                        removePromo();
                        toast.info("Promotional code removed");
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : showPromoInput ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. LUXORA10 or MILANO"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                        className="flex-1 border border-border bg-transparent px-3 py-2 font-sans text-xs uppercase text-foreground placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none"
                      />
                      <button
                        onClick={() => handleApplyPromo()}
                        className="border border-gold px-3 py-2 font-sans text-xs uppercase tracking-wider text-gold hover:bg-gold hover:text-ink"
                      >
                        Apply
                      </button>
                    </div>
                    <div className="flex gap-1.5 text-[0.625rem] text-muted-foreground">
                      <span>Suggestions:</span>
                      <button
                        type="button"
                        onClick={() => handleApplyPromo("LUXORA10")}
                        className="text-gold underline hover:opacity-80"
                      >
                        LUXORA10 (-10%)
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => handleApplyPromo("MILANO")}
                        className="text-gold underline hover:opacity-80"
                      >
                        MILANO (-€100)
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowPromoInput(true)}
                    className="flex items-center gap-2 text-xs text-gold/90 transition-colors hover:text-gold"
                  >
                    <Tag className="h-3 w-3" />
                    <span className="overline">Add Privilege / Promo Code</span>
                  </button>
                )}
              </div>
            </div>

            {/* Footer Summary */}
            <div className="border-t border-border bg-ink p-6">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatPrice(totals.subtotal)}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-gold">
                    <span>Privilege Discount</span>
                    <span>-{formatPrice(totals.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>Complimentary Shipping</span>
                  <span className="uppercase tracking-wider text-gold">Free</span>
                </div>
                <div className="border-t border-border pt-2 flex items-baseline justify-between text-base font-medium text-foreground">
                  <span className="font-display text-lg">Total</span>
                  <span className="font-sans text-lg text-gold">{formatPrice(totals.total)}</span>
                </div>
              </div>

              <button
                onClick={handleProceedCheckout}
                className="gold-btn mt-5 w-full justify-center"
              >
                Proceed to Checkout
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <p className="mt-2.5 text-center text-[0.625rem] uppercase tracking-wider text-muted-foreground">
                Duties & taxes included • 30-day complimentary returns
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
