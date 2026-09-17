# Deploying Vivah Vedam to AWS (EC2 + RDS) with a GoDaddy domain

This replaces the old Vercel + Supabase setup entirely. Nothing in this stack talks
to Supabase anymore — Postgres is on RDS, auth is your own JWT/bcrypt code, and the
Next.js app runs directly on a single EC2 instance behind nginx.

Rough shape:

```
GoDaddy DNS (A record) ──> EC2 Elastic IP ──> nginx :80/:443 ──> Next.js :3000 (PM2)
                                                                        │
                                                                        ▼
                                                              RDS PostgreSQL (private)
```

Estimated cost: a `t3.micro`/`t4g.micro` EC2 + `db.t4g.micro` RDS single-AZ fits the
AWS Free Tier for the first 12 months; after that, expect roughly $15-30/month total
for this traffic level.

---

## 0. Prerequisites

- AWS account with billing set up
- Your GoDaddy domain (this guide assumes `your-domain.com`)
- This repo, pushed somewhere you can `git clone` from the EC2 box (GitHub, etc.), or
  ready to `scp` up directly
- (Optional) Google Cloud project for "Sign in with Google", Stripe account for payments

---

## 1. Create the RDS PostgreSQL database

1. **RDS console → Create database**
   - Engine: **PostgreSQL** (16.x)
   - Templates: **Free tier** (or "Production" once you outgrow it)
   - DB instance identifier: `vivah-vedam-db`
   - Master username: `vivahvedam_admin`
   - Master password: generate and save one (you'll only use it once, to create the app's own user)
   - Instance class: `db.t4g.micro` (Free Tier eligible)
   - Storage: 20 GB gp3 is plenty to start
   - **Connectivity**:
     - VPC: default (or the same VPC you'll put the EC2 instance in)
     - Public access: **No** (the app connects from inside the VPC; keeping it private is safer)
     - VPC security group: create new → name it `vivah-vedam-rds-sg`
   - Leave the rest default, create the database.
2. Wait for it to become "Available", then note the **endpoint** (something like
   `vivah-vedam-db.xxxxxxxxxx.ap-south-1.rds.amazonaws.com`).

### Lock down the RDS security group

- `vivah-vedam-rds-sg` → **Inbound rules** → add a rule:
  - Type: PostgreSQL, Port 5432, Source: the EC2 instance's security group (create the
    EC2 instance first — see step 2 — then come back and pick `vivah-vedam-ec2-sg` here)
- Do **not** open 5432 to `0.0.0.0/0`.

### Create the schema and a least-privilege app user

From your own machine (needs the RDS temporarily reachable, or do this from EC2 once
it's up — either works since they're in the same VPC):

```bash
psql "postgresql://vivahvedam_admin:<master-password>@<rds-endpoint>:5432/postgres" <<'SQL'
CREATE DATABASE vivahvedam;
CREATE USER vivahvedam_app WITH PASSWORD 'pick-a-strong-password';
GRANT ALL PRIVILEGES ON DATABASE vivahvedam TO vivahvedam_app;
SQL

psql "postgresql://vivahvedam_admin:<master-password>@<rds-endpoint>:5432/vivahvedam" \
  -f rds/001_initial_schema.sql
psql "postgresql://vivahvedam_admin:<master-password>@<rds-endpoint>:5432/vivahvedam" \
  -f rds/002_vendor_ops.sql

psql "postgresql://vivahvedam_admin:<master-password>@<rds-endpoint>:5432/vivahvedam" <<'SQL'
GRANT ALL ON ALL TABLES IN SCHEMA public TO vivahvedam_app;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO vivahvedam_app;
SQL
```

Your app's `DATABASE_URL` will be:

```
postgresql://vivahvedam_app:pick-a-strong-password@<rds-endpoint>:5432/vivahvedam
```

---

## 2. Launch the EC2 instance

1. **EC2 console → Launch instance**
   - Name: `vivah-vedam-app`
   - AMI: **Ubuntu Server 24.04 LTS**
   - Instance type: `t3.micro` or `t4g.micro` (Free Tier eligible)
   - Key pair: create/download one (you'll need it to SSH in)
   - Network: same VPC as the RDS instance
   - Security group `vivah-vedam-ec2-sg`, inbound rules:
     - SSH (22) — source: **My IP** (not 0.0.0.0/0)
     - HTTP (80) — source: Anywhere (0.0.0.0/0)
     - HTTPS (443) — source: Anywhere (0.0.0.0/0)
   - Storage: 20 GB gp3 is fine
2. Launch it, then **allocate and associate an Elastic IP** to the instance (EC2 →
   Elastic IPs → Allocate → Associate). Without this, the public IP changes on every
   reboot and your DNS record would break.
3. Go back to the RDS security group (`vivah-vedam-rds-sg`) and add the inbound rule
   referencing `vivah-vedam-ec2-sg` as described in step 1, now that it exists.

---

## 3. Point your GoDaddy domain at the Elastic IP

In GoDaddy → **My Products → DNS** for your domain:

| Type | Name | Value              | TTL |
|------|------|---------------------|-----|
| A    | @    | `<your Elastic IP>` | 600 |
| A    | www  | `<your Elastic IP>` | 600 |

Remove any existing `A`/`CNAME` records on `@`/`www` that point elsewhere (e.g. old
Vercel records) — you can't have two `A` records for the same host pointing at
different IPs.

DNS propagation is usually minutes but can take up to ~24-48h. You can check with
`dig your-domain.com` or https://dnschecker.org before moving on.

---

## 4. Set up the EC2 instance

SSH in:

```bash
ssh -i your-key.pem ubuntu@<your Elastic IP>
```

Run the bootstrap script (installs Node 20, nginx, PM2, certbot, postgresql-client):

```bash
# if you've pushed this repo to GitHub already:
git clone https://github.com/<you>/vivah-vedam.git
cd vivah-vedam
bash infra/setup-ec2.sh
```

(If you haven't pushed to a git remote yet, `scp -i your-key.pem -r . ubuntu@<ip>:~/vivah-vedam`
from your local machine instead, then `cd ~/vivah-vedam && bash infra/setup-ec2.sh`.)

### Configure environment variables

```bash
cp .env.local.example .env.production.local
nano .env.production.local
```

Fill in at minimum:

```
DATABASE_URL=postgresql://vivahvedam_app:pick-a-strong-password@<rds-endpoint>:5432/vivahvedam
DATABASE_SSL=true
JWT_SECRET=<output of: openssl rand -base64 48>
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

Add Stripe keys and Google OAuth credentials if/when you use them (see §7-8).

### Install, build, and run

```bash
npm ci
npm run build
pm2 start infra/ecosystem.config.js
pm2 save
pm2 startup    # copy-paste and run the one-line command it prints
```

Check it's actually up on localhost before wiring nginx:

```bash
curl -I http://localhost:3000
```

### Wire up nginx

```bash
sudo cp infra/nginx.conf /etc/nginx/sites-available/vivah-vedam
sudo sed -i 's/your-domain.com/YOUR_ACTUAL_DOMAIN/' /etc/nginx/sites-available/vivah-vedam
sudo ln -s /etc/nginx/sites-available/vivah-vedam /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

Visit `http://your-domain.com` — you should see the app over plain HTTP once DNS has
propagated.

### Add HTTPS

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Certbot edits the nginx config to add the 443 server block and redirect HTTP→HTTPS,
and sets up auto-renewal (`sudo systemctl status certbot.timer` to confirm).

---

## 5. Seed demo data (optional)

From the EC2 instance, with `.env.production.local` in place:

```bash
export $(grep -v '^#' .env.production.local | xargs)
npm run seed:demo
```

This creates the same demo accounts as before (`priya@vivahvedam.demo`,
`rosewood@vivahvedam.demo`, etc., password `DemoPass123!`), backed by RDS now instead
of Supabase.

---

## 6. Shipping future changes

```bash
ssh -i your-key.pem ubuntu@<your Elastic IP>
cd vivah-vedam
bash infra/deploy.sh
```

This pulls, `npm ci`, rebuilds, and does a zero-downtime `pm2 reload`.

---

## 7. Stripe

Nothing about Stripe itself changes — same secret/publishable/webhook-secret keys as
before, just set in `.env.production.local` instead of Vercel's env settings. Update
the webhook endpoint URL in the Stripe dashboard to
`https://your-domain.com/api/stripe/webhook` (adjust to whatever the actual route is
in this codebase) since the old `https://vivah-vedam.vercel.app` endpoint no longer
exists.

---

## 8. Google Sign-In

If you use "Continue with Google":

1. Google Cloud Console → APIs & Services → Credentials → your OAuth client
2. **Authorized redirect URIs** → add `https://your-domain.com/api/auth/callback`
   (remove the old Supabase callback URL if one is listed)
3. Copy the Client ID/Secret into `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` in
   `.env.production.local`, then `pm2 reload vivah-vedam` to pick them up.

---

## 10. S3 bucket + IAM role for file uploads (contract PDFs, vendor logos)

Contract PDFs and vendor logo/cover uploads go to a private S3 bucket. The EC2
instance authenticates to S3 via an **IAM instance role** — no access keys are
ever stored in `.env` files or anywhere in the codebase.

### Create the bucket

1. **S3 console → Create bucket**
   - Name: `vivahvedam-uploads` (must be globally unique — add a suffix if taken)
   - Region: same region as your EC2/RDS instances
   - Block all public access: **On** (leave it fully private — the app serves files
     via short-lived signed URLs, not public links)
   - Leave versioning/encryption at their defaults (SSE-S3 is fine)
2. Create it.

### Create the IAM policy and role

1. **IAM console → Policies → Create policy** (JSON tab), scoped to just this bucket:

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
         "Resource": "arn:aws:s3:::vivahvedam-uploads/*"
       }
     ]
   }
   ```

   Name it `vivah-vedam-s3-uploads-policy`.

2. **IAM console → Roles → Create role**
   - Trusted entity type: **AWS service** → **EC2**
   - Attach the policy you just created
   - Name it `vivah-vedam-ec2-role`

### Attach the role to your EC2 instance

- **EC2 console** → select your `vivah-vedam-app` instance → **Actions → Security →
  Modify IAM role** → choose `vivah-vedam-ec2-role` → Update.

No reboot needed — the AWS SDK on the instance picks up the role automatically
via the instance metadata service.

### Configure the app

In `.env.production.local`:

```
AWS_REGION=ap-south-1
S3_UPLOADS_BUCKET=vivahvedam-uploads
```

Then `pm2 reload vivah-vedam` (or redeploy) to pick it up. Until these are set,
the app simply skips file uploads (PDF/logo fields are ignored) rather than
erroring — so you can deploy without S3 first and wire it up later.

---

## 11. Backups

RDS free-tier/single-AZ still takes automated daily snapshots by default (check
**Maintenance & backups** on the DB instance, retention is 7 days out of the box).
For anything beyond that, a manual snapshot before risky migrations is one click in
the RDS console.

---

## What's in this codebase, architecturally

- `rds/001_initial_schema.sql` — core marketplace schema (users, weddings, venues,
  services, bookings, messages, reviews, journey steps). `users` is the sole identity
  table (`password_hash` / `oauth_provider` / `oauth_id` live on it directly — there's
  no separate auth-provider table). No RLS — authorization is enforced in the
  application layer instead (every query already filters by the current user's id/role)
- `rds/002_vendor_ops.sql` — vendor profiles, contracts, and availability (weekly +
  date overrides) — see the "Vendor ops" section below
- `src/lib/db/` — a small chainable query-builder (`.from().select().eq()...`) over
  plain `pg`, used by every server component and API route
- `src/lib/auth/session.ts` — JWT (via `jose`) + bcrypt session/password handling
- `src/lib/server/auth.ts` / `route-guard.ts` — `createDbSession()`, the per-request
  "who's logged in + give me a query handle" helper every server file calls
- `src/lib/s3.ts` — S3 upload + signed-download-URL helpers, using the EC2 instance's
  IAM role (§10) rather than stored credentials
- `src/app/api/auth/{login,signup,logout,me,google,callback}` — all of auth
- `src/app/api/onboarding/{couple,vendor}` — the two onboarding forms write through
  these authenticated API routes rather than querying the database directly from
  the browser (there's no RLS to make direct browser writes safe otherwise)
- `scripts/seed-demo.mjs` — seeds demo accounts + sample data via `pg`

## Vendor ops (contracts, availability, verification)

- **Vendor side:** `/vendor/business-profile` (business details + payout/tax info +
  logo/cover upload), `/vendor/availability` (weekly default schedule + date-specific
  overrides), `/vendor/contract` (view-only — admin-managed)
- **Admin side:** `/admin/vendors` (list with verification + contract status) and
  `/admin/vendors/[id]` (approve/reject a vendor, and create/update their contract —
  commission rate, payout terms, dates, custom clauses, signed PDF upload)
- Contract PDFs are stored in S3 and served to the vendor via a short-lived signed
  URL (never a public link)
