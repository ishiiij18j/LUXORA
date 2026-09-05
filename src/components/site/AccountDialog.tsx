import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, Package, MapPin, Sparkles, LogOut, CheckCircle2, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth-store";
import { useOrders } from "@/lib/orders-store";
import { formatPrice, productImages } from "@/lib/catalog";
import { toast } from "sonner";

interface AccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCatalogue?: () => void;
}

export function AccountDialog({ isOpen, onClose, onOpenCatalogue }: AccountDialogProps) {
  const { user, isAuthenticated, login, signUp, loginDemoUser, updateProfile, logout } = useAuth();
  const { orders } = useOrders();

  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "privileges">("orders");

  // Auth inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  // Profile inputs
  const [editName, setEditName] = useState(user?.fullName || "");
  const [editPhone, setEditPhone] = useState(user?.phone || "");
  const [street, setStreet] = useState(user?.address?.street || "");
  const [city, setCity] = useState(user?.address?.city || "");
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || "");
  const [country, setCountry] = useState(user?.address?.country || "Italy");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      toast.success(res.message);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !fullName) return;
    setLoading(true);
    const res = await signUp(email, fullName, password);
    setLoading(false);
    if (res.success) {
      toast.success(res.message);
    }
  };

  const handleDemoSignIn = () => {
    loginDemoUser();
    toast.success("Signed in as VIP Client: Beatrice De Luca");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName: editName,
      phone: editPhone,
      address: {
        street,
        city,
        postalCode,
        country,
      },
    });
    toast.success("Client profile and delivery preferences updated.");
  };

  const handleLogout = () => {
    logout();
    toast.info("You have signed out from Luxora.");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-ink p-0 text-foreground sm:max-w-2xl">
        {!isAuthenticated ? (
          /* AUTHENTICATION VIEW */
          <div>
            <div className="border-b border-border px-8 py-6 text-center">
              <span className="font-display text-2xl tracking-luxe text-foreground">LUXORA MILANO</span>
              <p className="overline mt-2 text-[0.625rem] text-gold">Client Portal & Private Salon</p>
            </div>

            <div className="p-8">
              {/* Tab Switcher */}
              <div className="flex border-b border-border text-xs">
                <button
                  type="button"
                  onClick={() => setAuthMode("login")}
                  className={`flex-1 pb-3 text-center uppercase tracking-wider transition-colors ${
                    authMode === "login"
                      ? "border-b-2 border-gold font-medium text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode("register")}
                  className={`flex-1 pb-3 text-center uppercase tracking-wider transition-colors ${
                    authMode === "register"
                      ? "border-b-2 border-gold font-medium text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Create Account
                </button>
              </div>

              {authMode === "login" ? (
                <form onSubmit={handleLogin} className="mt-6 space-y-4">
                  <div>
                    <label className="overline block text-[0.625rem] text-muted-foreground">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@luxora-milano.com"
                      className="mt-1 w-full border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="overline block text-[0.625rem] text-muted-foreground">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="mt-1 w-full border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="gold-btn mt-2 w-full justify-center"
                  >
                    {loading ? "Signing In..." : "Sign In to Client Portal"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="mt-6 space-y-4">
                  <div>
                    <label className="overline block text-[0.625rem] text-muted-foreground">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Beatrice De Luca"
                      className="mt-1 w-full border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="overline block text-[0.625rem] text-muted-foreground">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@luxora-milano.com"
                      className="mt-1 w-full border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="overline block text-[0.625rem] text-muted-foreground">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="mt-1 w-full border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="gold-btn mt-2 w-full justify-center"
                  >
                    {loading ? "Creating..." : "Join the House of Luxora"}
                  </button>
                </form>
              )}

              {/* Instant Demo Access Button */}
              <div className="mt-8 border-t border-border pt-6 text-center">
                <p className="text-xs text-muted-foreground">
                  Evaluating this boutique? Explore with our preconfigured client profile:
                </p>
                <button
                  type="button"
                  onClick={handleDemoSignIn}
                  className="hairline-btn mt-3 w-full justify-center border-gold text-gold hover:bg-gold hover:text-ink"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Instant VIP Demo Client Access
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED USER DASHBOARD */
          <div>
            {/* Header profile banner */}
            <div className="border-b border-border bg-bone/5 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold font-display text-lg">
                    {user?.fullName?.charAt(0) || "L"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <DialogTitle className="font-display text-2xl text-foreground">
                        {user?.fullName}
                      </DialogTitle>
                      {user?.isVip && (
                        <span className="rounded border border-gold/60 bg-gold/10 px-2 py-0.5 text-[0.625rem] font-medium text-gold uppercase tracking-wider">
                          VIP Client
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="mt-6 flex gap-6 text-xs">
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`flex items-center gap-1.5 pb-2 uppercase tracking-wider transition-colors ${
                    activeTab === "orders"
                      ? "border-b-2 border-gold font-medium text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Package className="h-3.5 w-3.5" />
                  Orders ({orders.length})
                </button>
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex items-center gap-1.5 pb-2 uppercase tracking-wider transition-colors ${
                    activeTab === "profile"
                      ? "border-b-2 border-gold font-medium text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <MapPin className="h-3.5 w-3.5" />
                  Saved Address
                </button>
                <button
                  onClick={() => setActiveTab("privileges")}
                  className={`flex items-center gap-1.5 pb-2 uppercase tracking-wider transition-colors ${
                    activeTab === "privileges"
                      ? "border-b-2 border-gold font-medium text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Privileges
                </button>
              </div>
            </div>

            {/* Tab content */}
            <div className="p-8">
              {/* TAB 1: ORDERS */}
              {activeTab === "orders" && (
                <div>
                  {orders.length === 0 ? (
                    <div className="py-10 text-center">
                      <Package className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-3 font-display text-xl text-foreground">No orders yet</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Your handcrafted pieces and order tracking will appear here once placed.
                      </p>
                      {onOpenCatalogue && (
                        <button
                          onClick={() => {
                            onClose();
                            onOpenCatalogue();
                          }}
                          className="gold-btn mt-5"
                        >
                          Discover Catalogue
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="border border-border p-5 transition-colors hover:border-border/80"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3 text-xs">
                            <div>
                              <span className="font-mono font-semibold text-gold">{order.id}</span>
                              <span className="text-muted-foreground ml-3">
                                {new Date(order.createdAt).toLocaleDateString("en-GB", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 rounded bg-gold/10 px-2 py-0.5 font-sans text-[0.6875rem] font-medium text-gold">
                                <CheckCircle2 className="h-3 w-3" />
                                {order.status}
                              </span>
                            </div>
                          </div>

                          {/* Items in order */}
                          <div className="divide-y divide-border/40 py-3">
                            {order.items.map((item) => {
                              const img = productImages[item.image_key];
                              return (
                                <div key={item.id} className="flex items-center gap-4 py-2.5">
                                  <div className="h-14 w-11 overflow-hidden bg-bone shrink-0">
                                    {img && (
                                      <img
                                        src={img}
                                        alt={item.name}
                                        className="h-full w-full object-cover"
                                      />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-display text-sm text-foreground">{item.name}</p>
                                    <p className="text-[0.6875rem] text-muted-foreground">
                                      Size: {item.size} • Qty: {item.quantity}
                                    </p>
                                  </div>
                                  <span className="font-sans text-xs font-medium text-foreground">
                                    {formatPrice(item.price * item.quantity)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Order Footer */}
                          <div className="border-t border-border/60 pt-3 flex items-center justify-between text-xs">
                            <div className="text-muted-foreground">
                              <span>Tracking: </span>
                              <span className="font-mono text-foreground">{order.trackingNumber}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Total: </span>
                              <span className="font-sans font-medium text-gold">{formatPrice(order.total)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: PROFILE & ADDRESS */}
              {activeTab === "profile" && (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="overline block text-[0.625rem] text-muted-foreground">Full Name</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="mt-1 w-full border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="overline block text-[0.625rem] text-muted-foreground">Phone Number</label>
                      <input
                        type="text"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="mt-1 w-full border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="overline block text-[0.625rem] text-muted-foreground">Street Address</label>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="mt-1 w-full border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="overline block text-[0.625rem] text-muted-foreground">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="mt-1 w-full border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="overline block text-[0.625rem] text-muted-foreground">Postal Code</label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="mt-1 w-full border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="overline block text-[0.625rem] text-muted-foreground">Country</label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="mt-1 w-full border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
                      />
                    </div>
                  </div>

                  <button type="submit" className="gold-btn mt-4">
                    Save Address & Preferences
                  </button>
                </form>
              )}

              {/* TAB 3: PRIVILEGES */}
              {activeTab === "privileges" && (
                <div className="space-y-4">
                  <div className="border border-gold/30 bg-gold/5 p-5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-gold" />
                      <h4 className="font-display text-lg text-gold">Milano Salone Privileges</h4>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      As an esteemed patron of Luxora, your account grants priority concierge appointments, access to bespoke trunk shows in Milan and Paris, and dedicated styling consultations.
                    </p>
                  </div>

                  <div className="grid gap-3 pt-2">
                    <div className="border border-border p-4 flex items-center justify-between">
                      <div>
                        <p className="font-display text-base">Complimentary Hemming & Fitting</p>
                        <p className="text-xs text-muted-foreground">Available at any flagship boutique</p>
                      </div>
                      <span className="overline text-[0.625rem] text-gold">Included</span>
                    </div>

                    <div className="border border-border p-4 flex items-center justify-between">
                      <div>
                        <p className="font-display text-base">Private Runway Pre-Orders</p>
                        <p className="text-xs text-muted-foreground">Reserve upcoming Spring/Summer pieces</p>
                      </div>
                      <span className="overline text-[0.625rem] text-gold">Active</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
