import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("loading");
    const { error } = await supabase.from("newsletter_subscribers").insert({ email });
    if (error) {
      setStatus("error");
      setMessage(
        error.code === "23505"
          ? "This address is already on the list."
          : "Something went wrong. Please try again.",
      );
      return;
    }
    setStatus("done");
    setMessage("Welcome to Luxora. Watch your inbox for private invitations.");
    setEmail("");
  };

  return (
    <div>
      <p className="overline text-gold">Exclusive privileges</p>
      <h2 className="mt-3 font-display text-3xl leading-tight md:text-4xl">
        Letters from Luxora
      </h2>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        Early access to new arrivals, private sales and invitation-only events.
      </p>
      <form onSubmit={submit} className="mt-7 flex max-w-md flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="w-full border border-border bg-transparent px-4 py-3 font-sans text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none"
        />
        <button type="submit" disabled={status === "loading"} className="gold-btn shrink-0">
          {status === "loading" ? "Joining" : "Subscribe"}
        </button>
      </form>
      {message ? (
        <p
          className={`mt-3 font-sans text-xs ${
            status === "error" ? "text-destructive" : "text-gold"
          }`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
