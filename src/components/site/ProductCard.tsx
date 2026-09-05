import { Heart, Plus, Check } from "lucide-react";
import { formatPrice, productImages, type Product } from "@/lib/catalog";
import { useWishlist } from "@/lib/wishlist-store";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  const image = productImages[product.image_key];
  const { has, toggle } = useWishlist();
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const isFavorited = has(product.id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    const added = toggle(product.id);
    if (added) {
      toast.success(`${product.name} saved to your wishlist.`);
    } else {
      toast.info(`${product.name} removed from your wishlist.`);
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    setJustAdded(true);
    toast.success(`${product.name} added to your bag.`);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <article
      onClick={() => onSelect && onSelect(product)}
      className="group cursor-pointer text-left"
    >
      <div className="relative overflow-hidden bg-bone">
        {image ? (
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            width={800}
            height={900}
            className="aspect-[4/5] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="aspect-[4/5] w-full bg-bone" />
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={isFavorited ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className={`absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-bone-foreground/15 bg-bone/90 backdrop-blur transition-all ${
            isFavorited ? "text-gold" : "text-bone-foreground hover:text-gold"
          }`}
        >
          <Heart className={`h-3.5 w-3.5 ${isFavorited ? "fill-gold text-gold" : ""}`} />
        </button>

        {/* Add to Bag Button */}
        <button
          type="button"
          onClick={handleQuickAdd}
          aria-label={`Add ${product.name} to bag`}
          className="absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-full border border-bone-foreground/15 bg-bone/90 text-bone-foreground backdrop-blur opacity-0 transition-all duration-500 group-hover:opacity-100 hover:text-gold hover:scale-105"
        >
          {justAdded ? (
            <Check className="h-3.5 w-3.5 text-gold" />
          ) : (
            <Plus className="h-3.5 w-3.5" />
          )}
        </button>

        {/* Category Pill */}
        <span className="absolute left-3 top-3 rounded-none bg-ink/75 px-2 py-0.5 font-sans text-[0.625rem] uppercase tracking-wider text-foreground backdrop-blur opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {product.category}
        </span>
      </div>

      <h3 className="overline mt-4 font-sans text-bone-foreground group-hover:text-gold transition-colors">
        {product.name}
      </h3>
      <p className="mt-1.5 font-sans text-sm text-bone-foreground/65">
        {formatPrice(product.price)}
      </p>
    </article>
  );
}
