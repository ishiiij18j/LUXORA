import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Truck,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Ruler,
  Mail,
  Building,
  Leaf,
  Briefcase,
  MapPin,
  Lock,
  FileText,
  Cookie,
  Check,
} from "lucide-react";
import { toast } from "sonner";

export type InfoTopic =
  | "shipping"
  | "returns"
  | "size-guide"
  | "contact"
  | "story"
  | "sustainability"
  | "careers"
  | "stores"
  | "privacy"
  | "terms"
  | "cookies"
  | "services"
  | "payments";

interface InfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic: InfoTopic;
}

export function InfoDialog({ isOpen, onClose, initialTopic }: InfoDialogProps) {
  const [topic, setTopic] = useState<InfoTopic>(initialTopic);

  // Sync initial topic when modal opens
  useEffect(() => {
    if (isOpen) {
      setTopic(initialTopic);
    }
  }, [isOpen, initialTopic]);

  // Contact form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("Private Styling Appointment");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Return portal state
  const [returnOrderId, setReturnOrderId] = useState("");
  const [returnReason, setReturnReason] = useState("Size exchange");
  const [returnStatus, setReturnStatus] = useState<string | null>(null);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    toast.success("Inquiry received. A Luxora client concierge will contact you within 4 hours.");
  };

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnOrderId.trim()) return;
    setReturnStatus(
      `Return authorization generated for ${returnOrderId.toUpperCase()}. Pre-paid DHL courier label has been sent to your email.`
    );
    toast.success("Return label generated successfully.");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-ink p-0 text-foreground sm:max-w-3xl">
        <div className="border-b border-border px-8 py-5">
          <span className="overline text-gold">House of Luxora • Milano</span>
          <DialogTitle className="mt-1 font-display text-2xl text-foreground font-light">
            Customer Care & Maison
          </DialogTitle>

          {/* Quick topic navigation */}
          <div className="mt-4 flex flex-wrap gap-2 text-[0.6875rem]">
            {[
              { id: "shipping", label: "Shipping" },
              { id: "returns", label: "Returns" },
              { id: "size-guide", label: "Size Guide" },
              { id: "contact", label: "Contact Us" },
              { id: "stores", label: "Store Locator" },
              { id: "story", label: "Our Story" },
              { id: "sustainability", label: "Sustainability" },
              { id: "careers", label: "Careers" },
              { id: "privacy", label: "Privacy & Terms" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTopic(tab.id as InfoTopic)}
                className={`border px-2.5 py-1 uppercase tracking-wider transition-colors ${
                  topic === tab.id
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-8">
          {/* SHIPPING & PAYMENT */}
          {(topic === "shipping" || topic === "payments") && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Truck className="h-6 w-6 text-gold" />
                <h3 className="font-display text-2xl">Complimentary Global Shipping & Payment</h3>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Luxora offers carbon-neutral complimentary shipping on every order worldwide. All shipments are hand-inspected, wrapped in archival tissue, and sealed in our signature noir presentation box.
              </p>

              <div className="grid gap-4 sm:grid-cols-2 pt-2">
                <div className="border border-border p-4 bg-bone/5">
                  <h4 className="font-display text-lg">Standard Delivery</h4>
                  <p className="overline text-[0.625rem] text-gold mt-1">Complimentary • 3–5 Business Days</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Direct dispatch via DHL Express or FedEx Priority. Full tracking sent upon dispatch.
                  </p>
                </div>
                <div className="border border-border p-4 bg-bone/5">
                  <h4 className="font-display text-lg">Milan Express Concierge</h4>
                  <p className="overline text-[0.625rem] text-gold mt-1">€25 • 1–2 Business Days</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Scheduled white-glove delivery by our dedicated atelier courier across Europe and key global hubs.
                  </p>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h4 className="font-display text-lg flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-gold" />
                  Accepted Payment Methods
                </h4>
                <p className="mt-2 text-xs text-muted-foreground">
                  We accept Visa, MasterCard, American Express, Apple Pay, Google Pay, and bank wire transfers for private acquisitions over €10,000. All payments are encrypted via TLS 256-bit protocol.
                </p>
              </div>
            </div>
          )}

          {/* RETURNS & EXCHANGES */}
          {topic === "returns" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <RotateCcw className="h-6 w-6 text-gold" />
                <h3 className="font-display text-2xl">30-Day Returns & Exchanges</h3>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                We accept returns and size exchanges within 30 days of delivery. Items must be in their original, unworn condition with all garment tags and packaging intact.
              </p>

              {/* Interactive Return Generator */}
              <div className="border border-border p-6 bg-bone/5 space-y-4">
                <h4 className="font-display text-lg">Initiate Return or Size Exchange</h4>
                <form onSubmit={handleReturnSubmit} className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="overline block text-[0.625rem] text-muted-foreground">
                        Order Reference ID
                      </label>
                      <input
                        type="text"
                        required
                        value={returnOrderId}
                        onChange={(e) => setReturnOrderId(e.target.value)}
                        placeholder="e.g. LX-2026-4892"
                        className="mt-1 w-full border border-border bg-ink px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="overline block text-[0.625rem] text-muted-foreground">
                        Reason for Return
                      </label>
                      <select
                        value={returnReason}
                        onChange={(e) => setReturnReason(e.target.value)}
                        className="mt-1 w-full border border-border bg-ink px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
                      >
                        <option value="Size exchange">Exchange for different size</option>
                        <option value="Styling preference">Different styling preference</option>
                        <option value="Gift exchange">Gift exchange</option>
                        <option value="Other">Other consideration</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="gold-btn">
                    Generate Prepaid Return Label
                  </button>
                </form>

                {returnStatus && (
                  <div className="rounded border border-gold/40 bg-gold/10 p-3 text-xs text-gold flex items-center gap-2">
                    <Check className="h-4 w-4 shrink-0" />
                    <span>{returnStatus}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SIZE GUIDE */}
          {topic === "size-guide" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Ruler className="h-6 w-6 text-gold" />
                <h3 className="font-display text-2xl">Atelier Size & Measurement Guide</h3>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                All Luxora pieces follow standard Italian tailoring sizing (IT). For bespoke inquiries or made-to-measure tailoring, please consult our concierge.
              </p>

              {/* Apparel Size Table */}
              <div>
                <h4 className="font-display text-lg">Women's Ready-to-Wear (cm)</h4>
                <div className="mt-3 overflow-x-auto border border-border">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="border-b border-border bg-bone/10 uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="p-3">IT Size</th>
                        <th className="p-3">EU</th>
                        <th className="p-3">UK</th>
                        <th className="p-3">US</th>
                        <th className="p-3">Bust (cm)</th>
                        <th className="p-3">Waist (cm)</th>
                        <th className="p-3">Hips (cm)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="p-3 font-semibold text-gold">36 IT</td>
                        <td className="p-3">32</td>
                        <td className="p-3">4</td>
                        <td className="p-3">0</td>
                        <td className="p-3">78–81</td>
                        <td className="p-3">58–61</td>
                        <td className="p-3">86–89</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-gold">38 IT</td>
                        <td className="p-3">34</td>
                        <td className="p-3">6</td>
                        <td className="p-3">2</td>
                        <td className="p-3">82–85</td>
                        <td className="p-3">62–65</td>
                        <td className="p-3">90–93</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-gold">40 IT</td>
                        <td className="p-3">36</td>
                        <td className="p-3">8</td>
                        <td className="p-3">4</td>
                        <td className="p-3">86–89</td>
                        <td className="p-3">66–69</td>
                        <td className="p-3">94–97</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-gold">42 IT</td>
                        <td className="p-3">38</td>
                        <td className="p-3">10</td>
                        <td className="p-3">6</td>
                        <td className="p-3">90–93</td>
                        <td className="p-3">70–73</td>
                        <td className="p-3">98–101</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-gold">44 IT</td>
                        <td className="p-3">40</td>
                        <td className="p-3">12</td>
                        <td className="p-3">8</td>
                        <td className="p-3">94–98</td>
                        <td className="p-3">74–78</td>
                        <td className="p-3">102–106</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footwear Table */}
              <div className="pt-2">
                <h4 className="font-display text-lg">Footwear Conversion</h4>
                <div className="mt-3 overflow-x-auto border border-border">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="border-b border-border bg-bone/10 uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="p-3">EU/IT</th>
                        <th className="p-3">UK</th>
                        <th className="p-3">US</th>
                        <th className="p-3">Foot Length (cm)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="p-3 font-semibold text-gold">36 EU</td>
                        <td className="p-3">3</td>
                        <td className="p-3">5.5</td>
                        <td className="p-3">23.0</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-gold">37 EU</td>
                        <td className="p-3">4</td>
                        <td className="p-3">6.5</td>
                        <td className="p-3">23.7</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-gold">38 EU</td>
                        <td className="p-3">5</td>
                        <td className="p-3">7.5</td>
                        <td className="p-3">24.4</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-gold">39 EU</td>
                        <td className="p-3">6</td>
                        <td className="p-3">8.5</td>
                        <td className="p-3">25.0</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-gold">40 EU</td>
                        <td className="p-3">7</td>
                        <td className="p-3">9.5</td>
                        <td className="p-3">25.7</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* CONTACT US */}
          {topic === "contact" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Mail className="h-6 w-6 text-gold" />
                <h3 className="font-display text-2xl">Client Concierge & Private Styling</h3>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Our Milanese client advisors are at your service for personal styling appointments, order inquiries, bespoke creations, and private showroom viewings.
              </p>

              {contactSubmitted ? (
                <div className="border border-gold/40 bg-gold/10 p-8 text-center space-y-3">
                  <Check className="mx-auto h-8 w-8 text-gold" />
                  <h4 className="font-display text-2xl text-foreground">Inquiry Received</h4>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Thank you, {contactName}. A dedicated concierge advisor will reach out to{" "}
                    <span className="text-foreground">{contactEmail}</span> shortly.
                  </p>
                  <button
                    onClick={() => setContactSubmitted(false)}
                    className="gold-btn mt-4"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="overline block text-[0.625rem] text-muted-foreground">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Contessa Beatrice"
                        className="mt-1 w-full border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="overline block text-[0.625rem] text-muted-foreground">Your Email *</label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="beatrice@domain.com"
                        className="mt-1 w-full border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="overline block text-[0.625rem] text-muted-foreground">Subject of Inquiry</label>
                    <select
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className="mt-1 w-full border border-border bg-ink px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
                    >
                      <option value="Private Styling Appointment">Private Styling Appointment</option>
                      <option value="Order & Delivery Inquiry">Order & Delivery Inquiry</option>
                      <option value="Bespoke Tailoring Request">Bespoke Tailoring Request</option>
                      <option value="Press & VIP Liaison">Press & VIP Liaison</option>
                    </select>
                  </div>

                  <div>
                    <label className="overline block text-[0.625rem] text-muted-foreground">Your Message *</label>
                    <textarea
                      required
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Please let us know your requirements or request..."
                      className="mt-1 w-full border border-border bg-transparent p-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none"
                    />
                  </div>

                  <button type="submit" className="gold-btn">
                    Transmit Inquiry to Atelier
                  </button>
                </form>
              )}
            </div>
          )}

          {/* STORE LOCATOR */}
          {topic === "stores" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-gold" />
                <h3 className="font-display text-2xl">Maison Flagships & Salons</h3>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Experience the tactile world of Luxora in person at our international boutiques.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="border border-border p-5 bg-bone/5">
                  <span className="overline text-[0.625rem] text-gold">Flagship Atelier</span>
                  <h4 className="font-display text-xl text-foreground mt-1">Milano — Montenapoleone</h4>
                  <p className="text-xs text-muted-foreground mt-2">
                    Via Montenapoleone, 18<br />
                    20121 Milano, Italy<br />
                    Tel: +39 02 8492 1093<br />
                    Mon–Sat: 10:00 – 19:30
                  </p>
                </div>

                <div className="border border-border p-5 bg-bone/5">
                  <span className="overline text-[0.625rem] text-gold">Salon Privé</span>
                  <h4 className="font-display text-xl text-foreground mt-1">Paris — Saint-Honoré</h4>
                  <p className="text-xs text-muted-foreground mt-2">
                    42 Rue du Faubourg Saint-Honoré<br />
                    75008 Paris, France<br />
                    Tel: +33 1 42 68 55 00<br />
                    Mon–Sat: 10:30 – 19:00
                  </p>
                </div>

                <div className="border border-border p-5 bg-bone/5">
                  <span className="overline text-[0.625rem] text-gold">Boutique</span>
                  <h4 className="font-display text-xl text-foreground mt-1">London — New Bond St</h4>
                  <p className="text-xs text-muted-foreground mt-2">
                    145 New Bond Street<br />
                    London W1S 2PF, United Kingdom<br />
                    Tel: +44 20 7499 8832<br />
                    Mon–Sat: 10:00 – 18:30
                  </p>
                </div>

                <div className="border border-border p-5 bg-bone/5">
                  <span className="overline text-[0.625rem] text-gold">Townhouse</span>
                  <h4 className="font-display text-xl text-foreground mt-1">New York — Madison Ave</h4>
                  <p className="text-xs text-muted-foreground mt-2">
                    784 Madison Avenue<br />
                    New York, NY 10065, USA<br />
                    Tel: +1 212 585 3200<br />
                    Mon–Sat: 11:00 – 19:00
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* OUR STORY */}
          {topic === "story" && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <Building className="h-6 w-6 text-gold" />
                <h3 className="font-display text-2xl">The House of Luxora</h3>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Founded in the heart of Milan's Quadrilatero della Moda, Luxora was born from a singular obsession: to revive the austere, statuesque elegance of golden-era Italian couture for the contemporary muse.
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Rejecting ephemeral fads, each garment is conceived as a work of wearable architecture. Our master tailors cut exclusively from small-batch fabrics sourced from historic Biella woolen mills and Como silk weavers.
              </p>
              <blockquote className="border-l-2 border-gold pl-4 italic text-sm text-foreground font-display">
                "True luxury does not clamor for attention. It enters the room with quiet majesty and lingers in memory."
              </blockquote>
            </div>
          )}

          {/* SUSTAINABILITY */}
          {topic === "sustainability" && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <Leaf className="h-6 w-6 text-gold" />
                <h3 className="font-display text-2xl">Sustainability & Longevity</h3>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                At Luxora, sustainability is not a marketing concept; it is our foundational craft principle. We create pieces engineered to endure across generations.
              </p>
              <div className="space-y-3 pt-2">
                <div className="border-b border-border/60 pb-3">
                  <h4 className="font-display text-base text-foreground">Zero Synthetic Fillers</h4>
                  <p className="text-xs text-muted-foreground">All garments are cut strictly from natural fibers: certified mulesing-free virgin wool, organic Como mulberry silk, and vegetal-tanned Tuscan leather.</p>
                </div>
                <div className="border-b border-border/60 pb-3">
                  <h4 className="font-display text-base text-foreground">Lifetime Restoration Privilege</h4>
                  <p className="text-xs text-muted-foreground">We offer lifetime repairs and reconditioning services at cost for all Luxora leather goods and tailored garments.</p>
                </div>
              </div>
            </div>
          )}

          {/* CAREERS */}
          {topic === "careers" && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <Briefcase className="h-6 w-6 text-gold" />
                <h3 className="font-display text-2xl">Maison Careers & Apprenticeships</h3>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Join a passionate family of designers, patternmakers, and client advisors committed to extraordinary craftsmanship.
              </p>
              <div className="space-y-3 pt-2">
                <div className="border border-border p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-base text-foreground">Senior Patternmaker (Tailoring)</h4>
                    <p className="text-xs text-muted-foreground">Milano Atelier • Full-time</p>
                  </div>
                  <button
                    onClick={() => {
                      setTopic("contact");
                      setContactSubject("Atelier Careers Application");
                    }}
                    className="gold-btn !py-1.5 !px-3 text-[0.625rem]"
                  >
                    Apply
                  </button>
                </div>
                <div className="border border-border p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-base text-foreground">VIP Client Advisor</h4>
                    <p className="text-xs text-muted-foreground">Paris Saint-Honoré • Full-time</p>
                  </div>
                  <button
                    onClick={() => {
                      setTopic("contact");
                      setContactSubject("Atelier Careers Application");
                    }}
                    className="gold-btn !py-1.5 !px-3 text-[0.625rem]"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PRIVACY, TERMS, COOKIES */}
          {(topic === "privacy" || topic === "terms" || topic === "cookies") && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-gold" />
                <h3 className="font-display text-2xl">Legal, Privacy & Cookie Policy</h3>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Luxora Milano S.r.l. respects your privacy and is dedicated to safeguarding personal data in compliance with the General Data Protection Regulation (GDPR) and international privacy frameworks.
              </p>
              <div className="space-y-3 text-xs text-muted-foreground">
                <p>
                  <strong className="text-foreground">Data Confidentiality:</strong> Your personal data, delivery addresses, and purchase histories are encrypted and never disclosed, sold, or shared with third-party advertisers.
                </p>
                <p>
                  <strong className="text-foreground">Cookie Preferences:</strong> We use strictly essential session cookies and performance telemetry to maintain your shopping bag and authenticated session. You can manage or disable optional analytical cookies at any time.
                </p>
              </div>
            </div>
          )}

          {/* EXCLUSIVE SERVICES */}
          {topic === "services" && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-gold" />
                <h3 className="font-display text-2xl">Exclusive Maison Services</h3>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Every patron of Luxora is entitled to personalized care from our dedicated concierge team:
              </p>
              <div className="grid gap-3 pt-2">
                <div className="border border-border p-4">
                  <h4 className="font-display text-base text-gold">Complimentary White-Glove Shipping</h4>
                  <p className="text-xs text-muted-foreground mt-1">Carbon-neutral courier delivery to over 120 countries.</p>
                </div>
                <div className="border border-border p-4">
                  <h4 className="font-display text-base text-gold">Personal Styling & Wardrobe Curation</h4>
                  <p className="text-xs text-muted-foreground mt-1">Virtual consultations or private showroom visits in Milan, Paris, London, and New York.</p>
                </div>
                <div className="border border-border p-4">
                  <h4 className="font-display text-base text-gold">Bespoke Monogramming & Alterations</h4>
                  <p className="text-xs text-muted-foreground mt-1">Complimentary hem adjustments and subtle gold-foil debossing on leather goods.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
