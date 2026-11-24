# Contact form setup

The Pages Function sends form submissions through Resend. The recipient and API key stay in Cloudflare runtime settings; they are not included in page HTML or the repository.

Configure these values for both Cloudflare Pages production and preview environments before deploying the form:

- `CONTACT_TO`: the private inbox that should receive messages; store it as an encrypted secret.
- `CONTACT_FROM`: a sender address on a domain verified with Resend.
- `RESEND_API_KEY`: an encrypted Pages secret.

Add values in the Pages project settings under **Settings → Variables and Secrets**, then redeploy. Keep the recipient and API key encrypted. Local static preview intentionally reports that delivery is unconfigured; use the form only after running Pages Functions locally with private development bindings.

The form includes a honeypot and field limits. These are basic spam controls, not a complete anti-abuse system. Add Turnstile or a rate-limiting control if spam becomes a problem.
