import Link from "next/link";

const footerLinks = {
  "For Couples": [
    { href: "/venues", label: "Find Venues" },
    { href: "/services", label: "Browse Services" },
    { href: "/categories", label: "Categories" },
    { href: "/dashboard", label: "Start Planning" },
  ],
  "For Vendors": [
    { href: "/signup", label: "List Your Business" },
    { href: "/vendor", label: "Vendor Dashboard" },
    { href: "/categories", label: "Service Categories" },
  ],
  Company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy", label: "Privacy Policy" },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-[#2c2825]">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-0.5">
              <span className="font-heading text-xl font-semibold tracking-tight text-[#f5ebe0]">
                vivah
              </span>
              <span className="font-heading text-xl font-semibold tracking-tight text-terracotta-400">
                vedam
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-[#8a7968]">
              The modern wedding planning marketplace. Discover venues, hire
              professionals, and manage your entire journey — all in one
              beautiful place.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="flex flex-col gap-4">
              <h3 className="text-xs font-semibold tracking-widest text-[#a09080] uppercase">
                {title}
              </h3>
              <nav className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <Link
                    key={link.href + link.label}
                    href={link.href}
                    className="text-sm text-[#8a7968] transition-colors hover:text-[#f5ebe0]"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#3d3835] pt-8 md:flex-row">
          <p className="text-xs text-[#6a5f55]">
            &copy; {currentYear} VivahVedam. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-[#6a5f55]">
            <Link
              href="/privacy"
              className="transition-colors hover:text-[#a09080]"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-[#a09080]"
            >
              Terms
            </Link>
            <Link
              href="/contact"
              className="transition-colors hover:text-[#a09080]"
            >
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
