import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, ShieldCheck, Truck, CreditCard, Lock, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useOrders } from "@/lib/orders-store";
import { useAuth } from "@/lib/auth-store";
import { formatPrice, productImages } from "@/lib/catalog";
import { toast } from "sonner";

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess?: (orderId: string) => void;
}

export function CheckoutDialog({ isOpen, onClose, onOrderSuccess }: CheckoutDialogProps) {
  const { items, totals, promo, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { user } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
  const [isGift, setIsGift] = useState(false);
  const [giftNote, setGiftNote] = useState("");
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
  const [confirmedEstimatedDate, setConfirmedEstimatedDate] = useState<string>("");

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("Italy");

  // Payment form states
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-fill from user profile
  useEffect(() => {
    if (user) {
      if (user.fullName) {
        const parts = user.fullName.split(" ");
        setFirstName(parts[0] || "");
        setLastName(parts.slice(1).join(" ") || "");
        setCardName(user.fullName);
      }
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
      if (user.address) {
        setStreet(user.address.street || "");
        setApartment(user.address.apartment || "");
        setCity(user.address.city || "");
        setPostalCode(user.address.postalCode || "");
        setCountry(user.address.country || "Italy");
      }
    }
  }, [user, isOpen]);

  const shippingCost = shippingMethod === "express" ? 25 : 0;
  const finalTotal = totals.total + shippingCost;

  const handleNextToDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !street || !city || !postalCode) {
      toast.error("Please fill in all required shipping fields.");
      return;
    }
    setStep(2);
  };

  const handleNextToPayment = () => {
    setStep(3);
  };

  const handleCardNumberChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 16);
    const parts = cleaned.match(/.{1,4}/g);
    setCardNumber(parts ? parts.join(" ") : cleaned);
  };

  const handleExpiryChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 4);
    if (cleaned.length >= 3) {
      setCardExpiry(`${cleaned.slice(0, 2)}/${cleaned.slice(2)}`);
    } else {
      setCardExpiry(cleaned);
    }
  };

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardExpiry || !cardCvc || !cardName) {
      toast.error("Please enter complete payment details.");
      return;
    }

    setIsSubmitting(true);
    // Simulate brief luxury processing delay
    await new Promise((resolve) => setTimeout(resolve, 900));

    const newOrder = createOrder({
      items,
      subtotal: totals.subtotal,
      discount: totals.discount,
      promoCode: promo?.code,
      shippingMethod,
      shippingCost,
      total: finalTotal,
      shippingAddress: {
        firstName,
        lastName,
        email,
        phone,
        street,
        apartment,
        city,
        postalCode,
        country,
      },
      payment: {
        method: "card",
        cardLast4: cardNumber.replace(/\s/g, "").slice(-4) || "8841",
      },
      isGift,
      giftNote: isGift ? giftNote : undefined,
    });

    setConfirmedOrderId(newOrder.id);
    setConfirmedEstimatedDate(newOrder.estimatedDelivery);
    setIsSubmitting(false);
    clearCart();
    setStep(4);
    toast.success(`Order placed successfully! Reference: ${newOrder.id}`);
    if (onOrderSuccess) onOrderSuccess(newOrder.id);
  };

  const handleClose = () => {
    if (step === 4) {
      setStep(1);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-ink p-0 text-foreground sm:max-w-2xl">
        {/* Header */}
        <div className="border-b border-border px-6 py-5">
          <div className="flex items-center justify-between">
            <span className="font-display text-xl tracking-luxe text-foreground">LUXORA MILANO</span>
            <div className="flex items-center gap-1.5 text-xs text-gold">
              <Lock className="h-3.5 w-3.5" />
              <span className="overline text-[0.625rem]">Encrypted Checkout</span>
            </div>
          </div>

          {/* Stepper (Steps 1-3) */}
          {step < 4 && (
            <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4 text-xs">
              <div className={`flex items-center gap-2 ${step >= 1 ? "text-gold" : "text-muted-foreground"}`}>
                <span className="grid h-5 w-5 place-items-center rounded-full border border-current text-[0.6875rem]">
                  1
                </span>
                <span className="overline hidden sm:inline">Shipping</span>
              </div>
              <div className="h-px flex-1 bg-border mx-3" />
              <div className={`flex items-center gap-2 ${step >= 2 ? "text-gold" : "text-muted-foreground"}`}>
                <span className="grid h-5 w-5 place-items-center rounded-full border border-current text-[0.6875rem]">
                  2
                </span>
                <span className="overline hidden sm:inline">Delivery</span>
              </div>
              <div className="h-px flex-1 bg-border mx-3" />
              <div className={`flex items-center gap-2 ${step >= 3 ? "text-gold" : "text-muted-foreground"}`}>
                <span className="grid h-5 w-5 place-items-center rounded-full border border-current text-[0.6875rem]">
                  3
                </span>
                <span className="overline hidden sm:inline">Payment</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          {/* STEP 1: SHIPPING ADDRESS */}
          {step === 1 && (
            <form onSubmit={handleNextToDelivery} className="space-y-4">
              <div>
                <h3 className="font-display text-2xl text-foreground">Delivery Address</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Where would you like your handcrafted pieces delivered?
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="overline block text-[0.625rem] text-muted-foreground">First Name *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Beatrice"
                    className="mt-1 w-full border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="overline block text-[0.625rem] text-muted-foreground">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="De Luca"
                    className="mt-1 w-full border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="overline block text-[0.625rem] text-muted-foreground">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="beatrice@example.com"
                    className="mt-1 w-full border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="overline block text-[0.625rem] text-muted-foreground">Telephone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+39 02 8492 1093"
                    className="mt-1 w-full border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="overline block text-[0.625rem] text-muted-foreground">Street Address *</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Via Montenapoleone 18"
                  className="mt-1 w-full border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="overline block text-[0.625rem] text-muted-foreground">Apt / Suite</label>
                  <input
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    placeholder="Piano 3"
                    className="mt-1 w-full border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="col-span-1">
                  <label className="overline block text-[0.625rem] text-muted-foreground">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Milano"
                    className="mt-1 w-full border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="col-span-1">
                  <label className="overline block text-[0.625rem] text-muted-foreground">Postal Code *</label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="20121"
                    className="mt-1 w-full border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="overline block text-[0.625rem] text-muted-foreground">Country / Region</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="mt-1 w-full border border-border bg-ink px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
                >
                  <option value="Italy">Italy (Italia)</option>
                  <option value="France">France</option>
                  <option value="Monaco">Monaco</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Germany">Germany</option>
                  <option value="Switzerland">Switzerland</option>
                  <option value="United States">United States</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="Japan">Japan</option>
                </select>
              </div>

              {/* Order total preview */}
              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <div>
                  <span className="text-xs text-muted-foreground">Subtotal ({items.length} items): </span>
                  <span className="font-sans font-medium text-foreground">{formatPrice(totals.total)}</span>
                </div>
                <button type="submit" className="gold-btn">
                  Continue to Delivery
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: DELIVERY METHOD */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-2xl text-foreground">Select Delivery Service</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  All orders are packaged in our signature archival noir boxes.
                </p>
              </div>

              <div className="space-y-3">
                {/* Standard */}
                <label
                  onClick={() => setShippingMethod("standard")}
                  className={`flex cursor-pointer items-start justify-between border p-4 transition-colors ${
                    shippingMethod === "standard"
                      ? "border-gold bg-gold/5"
                      : "border-border hover:border-foreground/30"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="mt-0.5">
                      <div className={`grid h-4 w-4 place-items-center rounded-full border ${shippingMethod === "standard" ? "border-gold bg-gold" : "border-muted-foreground"}`}>
                        {shippingMethod === "standard" && <div className="h-1.5 w-1.5 rounded-full bg-ink" />}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-gold" />
                        <span className="font-medium text-sm text-foreground">
                          Complimentary White-Glove Standard
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Estimated arrival: 3–5 business days. Carbon-neutral global courier.
                      </p>
                    </div>
                  </div>
                  <span className="font-sans text-sm font-medium text-gold uppercase tracking-wider">
                    Free
                  </span>
                </label>

                {/* Express */}
                <label
                  onClick={() => setShippingMethod("express")}
                  className={`flex cursor-pointer items-start justify-between border p-4 transition-colors ${
                    shippingMethod === "express"
                      ? "border-gold bg-gold/5"
                      : "border-border hover:border-foreground/30"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="mt-0.5">
                      <div className={`grid h-4 w-4 place-items-center rounded-full border ${shippingMethod === "express" ? "border-gold bg-gold" : "border-muted-foreground"}`}>
                        {shippingMethod === "express" && <div className="h-1.5 w-1.5 rounded-full bg-ink" />}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-gold" />
                        <span className="font-medium text-sm text-foreground">
                          Milan Priority Express Concierge
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Estimated arrival: 1–2 business days. Direct dispatch with scheduled delivery slot.
                      </p>
                    </div>
                  </div>
                  <span className="font-sans text-sm font-medium text-foreground">
                    €25
                  </span>
                </label>
              </div>

              {/* Complimentary Gift Wrapping */}
              <div className="border border-border/80 p-4">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isGift}
                    onChange={(e) => setIsGift(e.target.checked)}
                    className="accent-gold h-4 w-4"
                  />
                  <div>
                    <span className="text-sm font-medium text-foreground">Complimentary Gift Packaging</span>
                    <p className="text-xs text-muted-foreground">
                      Wrapped with silk grosgrain ribbon and sealed with the golden wax seal of Luxora.
                    </p>
                  </div>
                </label>
                {isGift && (
                  <div className="mt-3 pt-3 border-t border-border/60">
                    <label className="overline block text-[0.625rem] text-muted-foreground">
                      Personalized Message Card
                    </label>
                    <textarea
                      rows={2}
                      value={giftNote}
                      onChange={(e) => setGiftNote(e.target.value)}
                      placeholder="Write your handwritten note..."
                      className="mt-1 w-full border border-border bg-transparent p-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNextToPayment}
                  className="gold-btn"
                >
                  Proceed to Payment
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT */}
          {step === 3 && (
            <form onSubmit={handleCompleteOrder} className="space-y-5">
              <div>
                <h3 className="font-display text-2xl text-foreground">Payment Details</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Transactions are encrypted end-to-end with TLS 256-bit security.
                </p>
              </div>

              {/* Order total banner */}
              <div className="flex items-center justify-between border border-gold/30 bg-gold/5 p-4">
                <div>
                  <span className="overline text-[0.625rem] text-gold">Final Payable Amount</span>
                  <p className="text-xs text-muted-foreground">Includes all duties, taxes and shipping</p>
                </div>
                <span className="font-display text-2xl text-gold">{formatPrice(finalTotal)}</span>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="overline block text-[0.625rem] text-muted-foreground">
                    Name on Card *
                  </label>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="BEATRICE DE LUCA"
                    className="mt-1 w-full border border-border bg-transparent px-3 py-2 text-sm uppercase text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="overline block text-[0.625rem] text-muted-foreground">
                    Card Number *
                  </label>
                  <div className="relative mt-1">
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => handleCardNumberChange(e.target.value)}
                      placeholder="4532 •••• •••• 8841"
                      className="w-full border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none pr-10 font-mono"
                    />
                    <CreditCard className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="overline block text-[0.625rem] text-muted-foreground">
                      Expiry Date *
                    </label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => handleExpiryChange(e.target.value)}
                      placeholder="MM/YY"
                      className="mt-1 w-full border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="overline block text-[0.625rem] text-muted-foreground">
                      Security Code (CVC) *
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      required
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="•••"
                      className="mt-1 w-full border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded border border-border/70 bg-bone/5 p-3 text-xs text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-gold shrink-0" />
                <span>
                  Demo authorization: Any 16-digit card and valid expiry date will confirm immediately.
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="gold-btn min-w-[180px] justify-center"
                >
                  {isSubmitting ? "Authorizing..." : `Authorize ${formatPrice(finalTotal)}`}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: ORDER CONFIRMED */}
          {step === 4 && (
            <div className="py-6 text-center space-y-6">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-gold bg-gold/10">
                <Check className="h-8 w-8 text-gold" />
              </div>

              <div>
                <span className="overline text-xs text-gold">Thank You</span>
                <h3 className="mt-2 font-display text-3xl text-foreground">
                  Order Confirmed
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your acquisition has been received by our Milano atelier and is being prepared with utmost care.
                </p>
              </div>

              {/* Order Reference Badge */}
              <div className="inline-block rounded border border-border bg-bone/5 px-6 py-4 text-left">
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs">
                  <div>
                    <span className="overline text-muted-foreground">Reference</span>
                    <p className="font-mono text-sm font-semibold text-gold">{confirmedOrderId}</p>
                  </div>
                  <div>
                    <span className="overline text-muted-foreground">Estimated Delivery</span>
                    <p className="font-medium text-foreground">{confirmedEstimatedDate}</p>
                  </div>
                  <div>
                    <span className="overline text-muted-foreground">Recipient</span>
                    <p className="text-foreground">{firstName} {lastName}</p>
                  </div>
                  <div>
                    <span className="overline text-muted-foreground">Delivery City</span>
                    <p className="text-foreground">{city}, {country}</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                A confirmation dispatch and digital certificate of authenticity have been sent to{" "}
                <span className="text-foreground font-medium">{email}</span>. You may track this order in your account at any time.
              </p>

              <div className="pt-2">
                <button
                  onClick={handleClose}
                  className="gold-btn mx-auto"
                >
                  Continue Exploring
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
