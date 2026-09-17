"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@vivahvedam.com",
    href: "mailto:hello@vivahvedam.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 22 4000 5000",
    href: "tel:+912240005000",
  },
  {
    icon: MapPin,
    label: "Office",
    value: "WeWork BKC, Bandra Kurla Complex, Mumbai 400051",
    href: null,
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      {/* Hero */}
      <section className="grain relative overflow-hidden bg-gradient-to-b from-[#faf6f1] to-[#f5ebe0] py-20 lg:py-28">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <p className="text-xs font-semibold tracking-widest text-terracotta-500 uppercase">
            Get In Touch
          </p>
          <h1 className="mt-4 font-heading text-4xl font-light leading-tight tracking-tight lg:text-5xl">
            We&apos;d love to hear from you
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
            Whether you&apos;re a couple planning your wedding, a vendor looking
            to join the platform, or a partner exploring collaboration —
            we&apos;re here to help.
          </p>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Contact Info */}
            <div className="lg:col-span-2">
              <ScrollReveal>
                <h2 className="font-heading text-xl font-semibold">
                  Contact information
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Reach out via any channel. We respond within 24 hours on
                  business days.
                </p>

                <div className="mt-8 flex flex-col gap-6">
                  {contactInfo.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-terracotta-50 text-terracotta-500">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">
                            {item.label}
                          </div>
                          {item.href ? (
                            <a
                              href={item.href}
                              className="mt-0.5 text-sm text-foreground hover:text-terracotta-500"
                            >
                              {item.value}
                            </a>
                          ) : (
                            <p className="mt-0.5 text-sm text-foreground">
                              {item.value}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-10 rounded-2xl border border-border/30 bg-[#f5ebe0] p-5">
                  <h3 className="font-heading text-sm font-semibold">
                    Vendor partnerships
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Interested in listing your wedding business on VivahVedam?
                    Email us at{" "}
                    <a
                      href="mailto:vendors@vivahvedam.com"
                      className="text-terracotta-500 underline"
                    >
                      vendors@vivahvedam.com
                    </a>{" "}
                    or sign up directly on the platform.
                  </p>
                </div>
              </ScrollReveal>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <ScrollReveal delay={0.1}>
                <div className="shadow-warm rounded-2xl border border-border/30 bg-card p-6 lg:p-8">
                  {submitted ? (
                    <div className="py-12 text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage-50 text-sage-600">
                        <Send className="h-6 w-6" />
                      </div>
                      <h3 className="mt-4 font-heading text-xl font-semibold">
                        Message sent!
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Thank you for reaching out. We&apos;ll get back to you
                        within 24 hours.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <h2 className="font-heading text-xl font-semibold">
                        Send us a message
                      </h2>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label htmlFor="name">Full name</Label>
                          <Input
                            id="name"
                            placeholder="Your name"
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          placeholder="What's this about?"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us more..."
                          rows={5}
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full rounded-full bg-terracotta-500 text-white hover:bg-terracotta-600 sm:w-auto"
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Send message
                      </Button>
                    </form>
                  )}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
