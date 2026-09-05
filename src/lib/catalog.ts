import blazer from "@/assets/p-blazer.jpg";
import bag from "@/assets/p-bag.jpg";
import sunglasses from "@/assets/p-sunglasses.jpg";
import sandals from "@/assets/p-sandals.jpg";
import dress from "@/assets/p-dress.jpg";
import jacket from "@/assets/p-jacket.jpg";
import skirt from "@/assets/p-skirt.jpg";
import shirt from "@/assets/p-shirt.jpg";
import pumps from "@/assets/p-pumps.jpg";

export type Product = {
  id: string;
  name: string;
  price: number;
  category: "Women" | "Men" | "Bags" | "Shoes" | "Accessories" | string;
  collection: "featured" | "new" | string;
  image_key: string;
  sort_order: number;
  description?: string;
  details?: string[];
  composition?: string;
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  inStock?: boolean;
};

export const productImages: Record<string, string> = {
  blazer,
  bag,
  sunglasses,
  sandals,
  dress,
  jacket,
  skirt,
  shirt,
  pumps,
};

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);

export const fallbackProducts: Product[] = [
  {
    id: "prod-blazer",
    name: "Double-Breasted Blazer",
    price: 890,
    category: "Women",
    collection: "featured",
    image_key: "blazer",
    sort_order: 1,
    description:
      "Crafted in Biella, Northern Italy from virgin wool twill. Cut with an authoritative shoulder line, peak lapels, and horn buttons. Fully lined in silk cupro.",
    details: [
      "Structured silhouette with natural shoulder pads",
      "Hand-finished Milanese buttonholes",
      "Double back vent for effortless drape",
      "Made in Italy",
    ],
    composition: "100% Virgin Wool Twill; Lining: 100% Cupro Silk",
    sizes: ["36 IT", "38 IT", "40 IT", "42 IT", "44 IT"],
    colors: [
      { name: "Onyx Black", hex: "#121212" },
      { name: "Midnight Navy", hex: "#1a1f2c" },
    ],
    inStock: true,
  },
  {
    id: "prod-bag",
    name: "Amore Chain Bag",
    price: 2450,
    category: "Bags",
    collection: "featured",
    image_key: "bag",
    sort_order: 2,
    description:
      "Sculpted from smooth Florentine calfskin with our signature polished champagne-gold chain strap. Features dual internal compartments and magnetic lock closure.",
    details: [
      "Signature solid brass hardware in brushed champagne gold",
      "Divided interior with slip pocket and zip divider",
      "Sliding chain strap can be worn crossbody or doubled on shoulder",
      "Dimensions: 25cm x 16cm x 8cm",
      "Made in Florence, Italy",
    ],
    composition: "100% Calf Leather; Hardware: Solid Brass",
    sizes: ["One Size"],
    colors: [
      { name: "Noir", hex: "#111111" },
      { name: "Cognac", hex: "#633c1d" },
    ],
    inStock: true,
  },
  {
    id: "prod-sunglasses",
    name: "Cat-Eye Sunglasses",
    price: 320,
    category: "Accessories",
    collection: "featured",
    image_key: "sunglasses",
    sort_order: 3,
    description:
      "Hand-beveled Japanese acetate sculpted into an enigmatic sharp cat-eye silhouette. Fitted with Category 3 CR-39 lenses for 100% UVA/UVB protection.",
    details: [
      "Custom 7-barrel hinges with engraved Luxora crest",
      "Anti-reflective interior lens coating",
      "Includes structured leather protective case and cleaning cloth",
      "Handcrafted in Belluno, Italy",
    ],
    composition: "100% Handcrafted Mazzucchelli Acetate",
    sizes: ["One Size"],
    colors: [
      { name: "Obsidian", hex: "#0f0f0f" },
      { name: "Tortoiseshell", hex: "#3f2d1e" },
    ],
    inStock: true,
  },
  {
    id: "prod-sandals",
    name: "Leather Sandals",
    price: 680,
    category: "Shoes",
    collection: "featured",
    image_key: "sandals",
    sort_order: 4,
    description:
      "Minimalist strappy sandals crafted from buttery nappa leather with an architectural 75mm heel. Designed for seamless transition from day receptions to evening galas.",
    details: [
      "Square open toe with slender cross-foot straps",
      "Padded leather insole with gold-foil stamped Luxora insignia",
      "75mm sculpted heel",
      "Leather outsole with anti-slip rubber injected island",
      "Made in Italy",
    ],
    composition: "100% Lambskin Nappa; Sole: 100% Calf Leather",
    sizes: ["36 EU", "37 EU", "38 EU", "39 EU", "40 EU", "41 EU"],
    colors: [
      { name: "Black Nappa", hex: "#141414" },
      { name: "Champagne Cream", hex: "#f0eae1" },
    ],
    inStock: true,
  },
  {
    id: "prod-dress",
    name: "Draped Satin Dress",
    price: 1250,
    category: "Women",
    collection: "new",
    image_key: "dress",
    sort_order: 1,
    description:
      "A celebration of liquid architecture. Spun from heavy mulberry silk satin that cascades down the figure with asymmetrical neckline and a sensual side slit.",
    details: [
      "Bias-cut construction for flattering organic drape",
      "Concealed side zipper with hook-and-eye closure",
      "Floor-grazing maxi hemline with walking vent",
      "Dry clean only by luxury specialist",
    ],
    composition: "100% Mulberry Silk Satin (28 Momme)",
    sizes: ["36 IT", "38 IT", "40 IT", "42 IT", "44 IT"],
    colors: [
      { name: "Midnight Black", hex: "#0c0c0e" },
      { name: "Emerald Glaze", hex: "#122a22" },
    ],
    inStock: true,
  },
  {
    id: "prod-jacket",
    name: "Leather Biker Jacket",
    price: 1490,
    category: "Women",
    collection: "new",
    image_key: "jacket",
    sort_order: 2,
    description:
      "The quintessential rebel piece reimagined with Milanese couture refinement. Cut from supple drum-dyed calfskin with matte ruthenium zippers.",
    details: [
      "Asymmetric zip front with heavy-gauge ruthenium pull",
      "Action back shoulder pleats for ergonomic mobility",
      "Two zip waist pockets and interior breast pocket",
      "Silky cupro lining with custom jacquard monogram",
    ],
    composition: "100% Drum-Dyed Full Grain Calfskin",
    sizes: ["36 IT", "38 IT", "40 IT", "42 IT"],
    colors: [{ name: "Matte Black", hex: "#151515" }],
    inStock: true,
  },
  {
    id: "prod-skirt",
    name: "Pleated Mini Skirt",
    price: 590,
    category: "Women",
    collection: "new",
    image_key: "skirt",
    sort_order: 3,
    description:
      "Precision knife pleats engineered in high-twist wool crepe that hold razor-sharp lines. Features a mid-rise tailored waistband with concealed side closure.",
    details: [
      "Permanently heat-set knife pleats",
      "Clean fitted waistband with tonal satin interior binding",
      "Hits at mid-thigh",
      "Made in Italy",
    ],
    composition: "100% High-Twist Wool Crepe",
    sizes: ["36 IT", "38 IT", "40 IT", "42 IT"],
    colors: [
      { name: "Black Crepe", hex: "#111111" },
      { name: "Ivory", hex: "#f5f5f0" },
    ],
    inStock: true,
  },
  {
    id: "prod-shirt",
    name: "Silk Shirt",
    price: 750,
    category: "Men",
    collection: "new",
    image_key: "shirt",
    sort_order: 4,
    description:
      "A modern menswear staple cut with a fluid relaxed drape in Como silk twill. Features a camp collar, mother-of-pearl buttons, and French seams throughout.",
    details: [
      "Relaxed Milanese silhouette with straight hem",
      "Hand-sewn genuine Australian mother-of-pearl buttons",
      "French-seamed internal construction",
      "Dry clean recommended",
    ],
    composition: "100% Pure Silk Twill",
    sizes: ["46 IT / S", "48 IT / M", "50 IT / L", "52 IT / XL"],
    colors: [
      { name: "Jet Black", hex: "#111111" },
      { name: "Ecru Silk", hex: "#e8e4dc" },
    ],
    inStock: true,
  },
  {
    id: "prod-pumps",
    name: "Slingback Pumps",
    price: 650,
    category: "Shoes",
    collection: "new",
    image_key: "pumps",
    sort_order: 5,
    description:
      "Sharp pointed toe silhouette with an elasticated slingback strap and flared kitten heel. Crafted in glossy patent leather for magnetic evening elegance.",
    details: [
      "Pointed toe with tapered vamp",
      "55mm flared architectonic heel",
      "Cushioned memory-foam lambskin footbed",
      "Handcrafted in the Marche region, Italy",
    ],
    composition: "100% Mirror Patent Leather; Sole: 100% Italian Leather",
    sizes: ["36 EU", "37 EU", "38 EU", "39 EU", "40 EU", "41 EU"],
    colors: [
      { name: "Patent Black", hex: "#0a0a0a" },
      { name: "Rosso Milano", hex: "#5a0f18" },
    ],
    inStock: true,
  },
];

export function getProductById(id: string): Product | undefined {
  return fallbackProducts.find((p) => p.id === id || p.image_key === id);
}

export function getDefaultSizeForProduct(product: Product): string {
  if (product.sizes && product.sizes.length > 0) {
    return product.sizes[0];
  }
  if (product.category === "Shoes") return "38 EU";
  if (product.category === "Bags" || product.category === "Accessories") return "One Size";
  if (product.category === "Men") return "48 IT / M";
  return "38 IT";
}
