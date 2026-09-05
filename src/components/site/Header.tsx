import { Search, User, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { useAuth } from "@/lib/auth-store";

interface HeaderProps {
  onOpenSearch?: () => void;
  onOpenAccount?: () => void;
  onOpenWishlist?: () => void;
  onOpenCart?: () => void;
  onSelectCategory?: (category: string) => void;
}

const links = ["Women", "Men", "Bags", "Shoes", "Collections"];

export function Header({
  onOpenSearch,
  onOpenAccount,
  onOpenWishlist,
  onOpenCart,
  onSelectCategory,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { count: cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLinkClick = (link: string) => {
    setMobileMenuOpen(false);
    if (onSelectCategory) {
      onSelectCategory(link === "Collections" ? "All" : link);
    }
    const elem = document.getElementById("catalogue");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Editorial Announcement Bar */}
      <div className="bg-ink text-muted-foreground border-b border-border/40">
        <p className="overline py-2.5 text-center text-[0.6rem] tracking-widest text-gold/90">
          Complimentary shipping worldwide — Fall / Winter '26 now live
        </p>
      </div>

      {/* Main Bar */}
      <div
        className={`transition-colors duration-500 ${
          scrolled || mobileMenuOpen
            ? "bg-background/95 backdrop-blur border-b border-border shadow-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5">
          {/* Mobile hamburger button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 text-foreground/80 hover:text-gold transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden flex-1 items-center gap-8 md:flex">
            {links.map((link) => (
              <button
                key={link}
                type="button"
                onClick={() => handleLinkClick(link)}
                className="overline text-foreground/75 transition-colors hover:text-gold cursor-pointer bg-transparent border-none p-0"
              >
                {link}
              </button>
            ))}
          </nav>

          {/* Logo */}
          <a
            href="/"
            onClick={(e) => {
              if (onSelectCategory) {
                onSelectCategory("All");
              }
            }}
            className="font-display text-2xl tracking-luxe text-foreground md:flex-1 md:text-center"
          >
            LUXORA
          </a>

          {/* Action Icons */}
          <div className="flex flex-1 items-center justify-end gap-5 text-foreground/80">
            {/* Search */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="p-1 text-foreground/80 transition-colors hover:text-gold cursor-pointer"
              aria-label="Search collection"
              title="Search"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Account */}
            <button
              type="button"
              onClick={onOpenAccount}
              className="relative p-1 text-foreground/80 transition-colors hover:text-gold cursor-pointer"
              aria-label="Client Account"
              title={isAuthenticated ? `Account: ${user?.fullName}` : "Client Sign In"}
            >
              <User className="h-4 w-4" />
              {isAuthenticated && (
                <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-gold ring-2 ring-ink" />
              )}
            </button>

            {/* Wishlist */}
            <button
              type="button"
              onClick={onOpenWishlist}
              className="relative hidden p-1 text-foreground/80 transition-colors hover:text-gold cursor-pointer sm:block"
              aria-label="Saved Pieces"
              title="Saved Pieces"
            >
              <Heart className="h-4 w-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 font-sans text-[0.625rem] font-semibold text-ink">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag / Cart */}
            <button
              type="button"
              onClick={onOpenCart}
              className="relative p-1 text-foreground/80 transition-colors hover:text-gold cursor-pointer"
              aria-label="Shopping Bag"
              title="Shopping Bag"
            >
              <ShoppingBag className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 font-sans text-[0.625rem] font-semibold text-ink animate-in zoom-in-50">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-border bg-ink px-6 py-6 md:hidden animate-in slide-in-from-top-4">
            <nav className="flex flex-col space-y-4">
              {links.map((link) => (
                <button
                  key={link}
                  type="button"
                  onClick={() => handleLinkClick(link)}
                  className="overline text-left text-sm text-foreground/90 transition-colors hover:text-gold py-1"
                >
                  {link}
                </button>
              ))}
              <div className="border-t border-border pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenWishlist) onOpenWishlist();
                  }}
                  className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground hover:text-gold"
                >
                  <Heart className="h-4 w-4 text-gold" />
                  <span>Saved Pieces ({wishlistCount})</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenAccount) onOpenAccount();
                  }}
                  className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground hover:text-gold"
                >
                  <User className="h-4 w-4 text-gold" />
                  <span>{isAuthenticated ? "My Account" : "Sign In"}</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
