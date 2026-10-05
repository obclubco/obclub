# obclub

The OB Club website ([www.obclub.co](https://www.obclub.co)): a static Next.js site hosted on GitHub Pages.

## Run locally

```bash
npm ci
npm run dev        # http://localhost:3111
npm run build      # writes the static site to out/
npm start          # serves out/ on http://localhost:3111
```

## Deploy (GitHub Pages)

Every push to `main` builds the site and publishes it with
`.github/workflows/deploy.yml`. It also rebuilds daily, so past events drop
off `/events`. Pull requests are built but not deployed.

One-time setup in the repo's **Settings**:

1. **Pages → Build and deployment → Source:** choose **GitHub Actions**.
2. **Pages → Custom domain:** enter `www.obclub.co`, then tick **Enforce HTTPS**
   once the certificate is issued. At your DNS provider, add a `CNAME` record
   for `www` pointing to `obclubco.github.io`, and `A` records for the apex
   `obclub.co` pointing to `185.199.108.153`, `185.199.109.153`,
   `185.199.110.153` and `185.199.111.153`.
3. **Secrets and variables → Actions → Variables:** add
   `NEXT_PUBLIC_FORM_ENDPOINT` (see below).

The site is built for the custom domain. Asset paths are absolute (`/obc/...`),
so it won't display correctly at `obclubco.github.io/obclub` without one.

## Forms

GitHub Pages has no server, so the contact and sign-up forms post to
[Formspree](https://formspree.io). Create a form there, then set its
endpoint (`https://formspree.io/f/<id>`) as the `NEXT_PUBLIC_FORM_ENDPOINT`
repository variable. Submissions arrive by email and in the Formspree
dashboard. Without the variable, the forms open the visitor's email app
addressed to hello@obclub.co.

## Editing content

All content lives in `lib/`: `podcast.ts`, `blog.ts`, `events.ts`, `faqs.ts`,
`partners.ts`, and stats/testimonials in `content.ts`. Edit and push to
`main` to publish. Images go in `public/obc/`.
