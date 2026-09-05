import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Truck, RotateCcw, Sparkles, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fallbackProducts, type Product } from "@/lib/catalog";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ProductCard } from "@/components/site/ProductCard";
import { CartDrawer } from "@/components/site/CartDrawer";
import { CheckoutDialog } from "@/components/site/CheckoutDialog";
import { WishlistDrawer } from "@/components/site/WishlistDrawer";
import { ProductDetailModal } from "@/components/site/ProductDetailModal";
import { SearchDialog } from "@/components/site/SearchDialog";
import { AccountDialog } from "@/components/site/AccountDialog";
import { LookbookModal } from "@/components/site/LookbookModal";
import { InfoDialog, type InfoTopic } from "@/components/site/InfoDialog";

import heroImg from "@/assets/hero.jpg";
import catWomen from "@/assets/cat-women.jpg";
import catMen from "@/assets/cat-men.jpg";
import catBags from "@/assets/cat-bags.jpg";
import catShoes from "@/assets/cat-shoes.jpg";
import editorialImg from "@/assets/editorial-party.jpg";
import lookbookImg from "@/assets/lookbook.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Luxora — Timeless Luxury Fashion, Milano" },
      {
        name: "description",
        content:
          "Luxora Milano: tailored blazers, leather bags and evening pieces in a dark, timeless aesthetic. Discover the Fall/Winter '26 collection.",
      },
      { property: "og:title", content: "Luxora — Timeless Luxury Fashion, Milano" },
      {
        property: "og:description",
        content:
          "Tailored blazers, leather bags and evening pieces, crafted for the modern muse. Shop the Fall/Winter '26 collection.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const categories = [
  { label: "Women", image: catWomen },
  { label: "Men", image: catMen },
  { label: "Bags", image: catBags },
  { label: "Shoes", image: catShoes },
];

const services = [
  {
    icon: Truck,
    topic: "shipping" as InfoTopic,
    title: "Complimentary shipping",
    copy: "Free delivery on every order, worldwide.",
  },
  {
    icon: RotateCcw,
    topic: "returns" as InfoTopic,
    title: "Easy returns",
    copy: "Returns accepted within 30 days of delivery.",
  },
  {
    icon: Sparkles,
    topic: "services" as InfoTopic,
    title: "Exclusive services",
    copy: "Personal shopping and styling, just for you.",
  },
  {
    icon: ShieldCheck,
    topic: "payments" as InfoTopic,
    title: "Secure payments",
    copy: "Every transaction is protected end to end.",
  },
];

const FILTER_TABS = ["All", "Women", "Men", "Bags", "Shoes", "Accessories"];

async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackProducts;
    }

    // Merge fallback rich metadata (details, composition, sizes, colors)
    return data.map((item) => {
      const match = fallbackProducts.find(
        (f) => f.image_key === item.image_key || f.name.toLowerCase() === item.name.toLowerCase()
      );
      return {
        ...match,
        ...item,
        sizes: match?.sizes || ["One Size"],
        colors: match?.colors || [{ name: "Noir", hex: "#111111" }],
        description: match?.description || "Handcrafted with immaculate Milanese precision.",
        composition: match?.composition,
      } as Product;
    });
  } catch {
    return fallbackProducts;
  }
}

function Index() {
  const { data: rawProducts = fallbackProducts } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    initialData: fallbackProducts,
  });

  // Modal dialog states
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [lookbookOpen, setLookbookOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  // Customer care & info modal state
  const [infoOpen, setInfoOpen] = useState(false);
  const [infoTopic, setInfoTopic] = useState<InfoTopic>("shipping");

  // Filter & sorting states
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"featured" | "new" | "price-asc" | "price-desc">("featured");

  const openInfo = (topic: InfoTopic) => {
    setInfoTopic(topic);
    setInfoOpen(true);
  };

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    const elem = document.getElementById("catalogue");
    elem?.scrollIntoView({ behavior: "smooth" });
  };

  // Filtered and sorted products for main catalogue
  const displayedProducts = useMemo(() => {
    let list = [...rawProducts];

    if (selectedCategory !== "All") {
      list = list.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (sortBy === "new") {
      list = list.filter((p) => p.collection === "new").concat(list.filter((p) => p.collection !== "new"));
    } else if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else {
      list.sort((a, b) => a.sort_order - b.sort_order);
    }

    return list;
  }, [rawProducts, selectedCategory, sortBy]);

  const featured = rawProducts.filter((p) => p.collection === "featured");
  const arrivals = rawProducts.filter((p) => p.collection === "new");

  return (
    <div className="min-h-screen bg-background">
      {/* Global Interactive Header */}
      <Header
        onOpenSearch={() => setSearchOpen(true)}
        onOpenAccount={() => setAccountOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
        onOpenCart={() => setCartOpen(true)}
        onSelectCategory={handleSelectCategory}
      />

      {/* Hero */}
      <section className="relative h-[92vh] min-h-[620px] w-full overflow-hidden">
        <img
          src={heroImg}
          alt="Model in a black tailored suit beside marble columns"
          width={1600}
          height={1008}
          className="absolute inset-0 h-full w-full object-cover object-[70%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-[1400px] flex-col justify-center px-6">
          <p className="overline fade-up text-gold">New collection FW '26</p>
          <h1 className="fade-up mt-6 font-display text-6xl leading-[0.95] tracking-tight sm:text-7xl md:text-8xl">
            Timeless
            <br />
            by Nature
          </h1>
          <p className="fade-up mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
            A celebration of enduring elegance, crafted for the modern muse.
          </p>
          <div className="fade-up mt-9 flex flex-wrap items-center gap-6">
            <a
              href="#catalogue"
              onClick={() => setSelectedCategory("All")}
              className="gold-btn"
            >
              Shop collection
            </a>
            <button
              type="button"
              onClick={() => setLookbookOpen(true)}
              className="overline flex items-center gap-3 text-foreground hover:text-gold cursor-pointer"
            >
              Discover campaign
              <span className="grid h-7 w-7 place-items-center rounded-full border border-current">
                <ArrowRight className="h-3 w-3" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="grid grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <button
            key={category.label}
            type="button"
            onClick={() => handleSelectCategory(category.label)}
            className="group relative h-[300px] overflow-hidden border-r border-border last:border-r-0 md:h-[380px] text-left cursor-pointer"
          >
            <img
              src={category.image}
              alt={category.label}
              loading="lazy"
              width={800}
              height={1000}
              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <h2 className="font-display text-2xl tracking-wide">{category.label}</h2>
              <span className="overline mt-2 block text-gold opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                Discover
              </span>
            </div>
          </button>
        ))}
      </section>

      {/* Featured / Main Catalogue */}
      <section id="catalogue" className="bg-bone py-24 text-bone-foreground scroll-mt-20">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="text-center">
            <p className="overline text-gold">The Collection</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">
              {selectedCategory === "All" ? "Iconic Pieces" : `${selectedCategory} Collection`}
            </h2>
          </div>

          {/* Interactive Filters and Sorting Bar */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-b border-bone-foreground/15 pb-6">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSelectedCategory(tab)}
                  className={`px-4 py-2 font-sans text-xs uppercase tracking-wider transition-colors border ${
                    selectedCategory === tab
                      ? "border-bone-foreground bg-bone-foreground text-bone font-medium"
                      : "border-bone-foreground/20 text-bone-foreground/75 hover:border-bone-foreground/60"
                  }`}
                >
                  {tab === "All" ? "All Silhouettes" : tab}
                </button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2 text-xs">
              <SlidersHorizontal className="h-3.5 w-3.5 text-bone-foreground/60" />
              <span className="overline text-[0.625rem] text-bone-foreground/60">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-bone-foreground/20 bg-transparent px-3 py-1.5 font-sans text-xs uppercase tracking-wider text-bone-foreground focus:border-bone-foreground focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured Order</option>
                <option value="new">New Arrivals First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Cards Grid */}
          {displayedProducts.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-display text-2xl text-bone-foreground">No pieces found in this category.</p>
              <button
                type="button"
                onClick={() => setSelectedCategory("All")}
                className="mt-4 inline-flex items-center justify-center border border-bone-foreground px-6 py-2.5 font-sans text-xs uppercase tracking-wider hover:bg-bone-foreground hover:text-bone transition-colors"
              >
                Reset to All Silhouettes
              </button>
            </div>
          ) : (
            <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={(p) => setDetailProduct(p)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Editorial Banner */}
      <section className="relative h-[520px] overflow-hidden">
        <img
          src={editorialImg}
          alt="Model wearing a black lace evening dress"
          loading="lazy"
          width={1408}
          height={912}
          className="absolute inset-0 h-full w-full object-cover object-[70%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-[1400px] flex-col justify-center px-6">
          <p className="overline text-gold">The party edit</p>
          <h2 className="mt-5 font-display text-5xl leading-[0.95] md:text-6xl">
            Dress to
            <br />
            Impress
          </h2>
          <p className="mt-5 max-w-sm text-sm text-muted-foreground">
            Statement pieces for unforgettable nights.
          </p>
          <button
            type="button"
            onClick={() => handleSelectCategory("Women")}
            className="gold-btn mt-8 self-start cursor-pointer"
          >
            Shop now
          </button>
        </div>
      </section>

      {/* New arrivals showcase */}
      <section className="bg-bone py-24 text-bone-foreground">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="text-center">
            <p className="overline text-gold">New arrivals</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Just In</h2>
          </div>
          <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-5">
            {arrivals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(p) => setDetailProduct(p)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Lookbook section */}
      <section id="lookbook" className="grid lg:grid-cols-2">
        <img
          src={lookbookImg}
          alt="Model in an oversized black suit in front of a stone facade"
          loading="lazy"
          width={1200}
          height={900}
          className="h-full max-h-[560px] w-full object-cover"
        />
        <div className="flex flex-col justify-center bg-bone px-6 py-20 text-bone-foreground md:px-16">
          <p className="overline text-gold">Lookbook</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Modern Icons</h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-bone-foreground/70">
            Explore the story of strength, confidence and sophistication through our
            latest editorial, shot across the marble halls of Milano.
          </p>
          <button
            type="button"
            onClick={() => setLookbookOpen(true)}
            className="overline mt-8 flex items-center gap-3 self-start text-gold hover:opacity-80 transition-opacity cursor-pointer"
          >
            Explore the lookbook
            <span className="grid h-7 w-7 place-items-center rounded-full border border-current">
              <ArrowRight className="h-3 w-3" />
            </span>
          </button>
        </div>
      </section>

      {/* Services Section with functional click triggers */}
      <section className="border-y border-border">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <button
              key={service.title}
              type="button"
              onClick={() => openInfo(service.topic)}
              className="border-r border-border px-6 py-12 text-center last:border-r-0 hover:bg-bone/5 transition-colors cursor-pointer"
            >
              <service.icon className="mx-auto h-5 w-5 text-gold" />
              <h3 className="overline mt-5 text-foreground">{service.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{service.copy}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Footer with all links wired to InfoDialog */}
      <Footer onOpenInfo={openInfo} />

      {/* ALL MODAL & SLIDE-OUT CONTAINERS */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onOpenCheckout={() => setCheckoutOpen(true)}
      />

      <CheckoutDialog
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onOrderSuccess={() => {
          // Can optionally refresh or notify
        }}
      />

      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        products={rawProducts}
        onOpenCart={() => setCartOpen(true)}
        onSelectProduct={(p) => setDetailProduct(p)}
      />

      <SearchDialog
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        products={rawProducts}
        onSelectProduct={(p) => setDetailProduct(p)}
      />

      <AccountDialog
        isOpen={accountOpen}
        onClose={() => setAccountOpen(false)}
        onOpenCatalogue={() => {
          const elem = document.getElementById("catalogue");
          elem?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      <LookbookModal
        isOpen={lookbookOpen}
        onClose={() => setLookbookOpen(false)}
        products={rawProducts}
        onSelectProduct={(p) => setDetailProduct(p)}
      />

      <ProductDetailModal
        product={detailProduct}
        isOpen={Boolean(detailProduct)}
        onClose={() => setDetailProduct(null)}
        onOpenCart={() => setCartOpen(true)}
        onOpenSizeGuide={() => openInfo("size-guide")}
      />

      <InfoDialog
        isOpen={infoOpen}
        onClose={() => setInfoOpen(false)}
        initialTopic={infoTopic}
      />
    </div>
  );
}
