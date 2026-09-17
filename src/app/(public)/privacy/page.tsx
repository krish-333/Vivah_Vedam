export default function PrivacyPage() {
  return (
    <>
      <section className="grain relative overflow-hidden bg-gradient-to-b from-[#faf6f1] to-[#f5ebe0] py-20 lg:py-28">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <p className="text-xs font-semibold tracking-widest text-terracotta-500 uppercase">
            Legal
          </p>
          <h1 className="mt-4 font-heading text-4xl font-light leading-tight tracking-tight lg:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Last updated: April 1, 2026
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="prose prose-sm prose-stone max-w-none space-y-8 text-muted-foreground [&_h2]:font-heading [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:font-heading [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_p]:leading-relaxed">
            <div>
              <h2>1. Information We Collect</h2>
              <p>
                When you create an account on VivahVedam, we collect your name,
                email address, phone number, and role (couple or vendor). For
                couples, we also collect wedding details such as date, city,
                guest count, and budget preferences. For vendors, we collect
                business information, service descriptions, pricing, and
                portfolio content.
              </p>
            </div>

            <div>
              <h2>2. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Provide and improve our wedding planning services</li>
                <li>
                  Match couples with relevant vendors based on location, budget,
                  and preferences
                </li>
                <li>
                  Process bookings and facilitate secure payments via Stripe
                </li>
                <li>Send booking confirmations, reminders, and updates</li>
                <li>
                  Enable communication between couples and vendors through our
                  messaging system
                </li>
                <li>
                  Generate your personalized wedding journey timeline and
                  milestones
                </li>
              </ul>
            </div>

            <div>
              <h2>3. Payment Security</h2>
              <p>
                All payments on VivahVedam are processed through Stripe Connect.
                We never store your full credit card details on our servers.
                Stripe is PCI DSS Level 1 certified — the highest level of
                payment security certification. Our escrow model ensures vendor
                payouts are released only after service delivery confirmation.
              </p>
            </div>

            <div>
              <h2>4. Data Sharing</h2>
              <p>
                We share your information only in limited circumstances: with
                vendors you choose to book (your name and booking details), with
                payment processors (Stripe) to complete transactions, and with
                service providers who help us operate the platform (hosting,
                analytics). We never sell your personal data to third parties.
              </p>
            </div>

            <div>
              <h2>5. Data Storage & Security</h2>
              <p>
                Your data is stored securely on our own AWS-managed PostgreSQL
                database (Amazon RDS) with encryption at rest and in transit. Access
                is restricted at the application layer so users can only reach data
                they&apos;re authorized to see. All API communications use HTTPS
                encryption.
              </p>
            </div>

            <div>
              <h2>6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Access all personal data we hold about you</li>
                <li>
                  Correct any inaccurate information in your profile or wedding
                  details
                </li>
                <li>
                  Delete your account and all associated data (subject to legal
                  retention requirements for completed transactions)
                </li>
                <li>Export your data in a portable format</li>
                <li>
                  Withdraw consent for marketing communications at any time
                </li>
              </ul>
            </div>

            <div>
              <h2>7. Cookies & Analytics</h2>
              <p>
                We use essential cookies to maintain your login session and
                preferences. We use anonymous analytics to understand how couples
                and vendors use the platform so we can improve the experience.
                You can disable non-essential cookies in your browser settings.
              </p>
            </div>

            <div>
              <h2>8. Contact Us</h2>
              <p>
                For any privacy-related questions or requests, contact our data
                protection team at{" "}
                <a
                  href="mailto:privacy@vivahvedam.com"
                  className="text-terracotta-500 underline"
                >
                  privacy@vivahvedam.com
                </a>{" "}
                or write to us at: VivahVedam, WeWork BKC, Bandra Kurla Complex,
                Mumbai 400051, India.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
