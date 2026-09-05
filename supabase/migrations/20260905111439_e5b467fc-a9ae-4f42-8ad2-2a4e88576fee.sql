CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric(10,2) NOT NULL,
  category text NOT NULL,
  collection text NOT NULL DEFAULT 'featured',
  image_key text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are publicly viewable" ON public.products FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.newsletter_subscribers TO anon, authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);

INSERT INTO public.products (name, price, category, collection, image_key, sort_order) VALUES
('Double-Breasted Blazer', 890, 'Women', 'featured', 'blazer', 1),
('Amore Chain Bag', 2450, 'Bags', 'featured', 'bag', 2),
('Cat-Eye Sunglasses', 320, 'Accessories', 'featured', 'sunglasses', 3),
('Leather Sandals', 680, 'Shoes', 'featured', 'sandals', 4),
('Draped Satin Dress', 1250, 'Women', 'new', 'dress', 1),
('Leather Biker Jacket', 1490, 'Women', 'new', 'jacket', 2),
('Pleated Mini Skirt', 590, 'Women', 'new', 'skirt', 3),
('Silk Shirt', 750, 'Men', 'new', 'shirt', 4),
('Slingback Pumps', 650, 'Shoes', 'new', 'pumps', 5);