# Contact form: Gmail API and Cloudflare Pages

The contact endpoint is `POST /api/contact`. It exchanges a Google OAuth refresh token for a short-lived access token, then sends the message through Gmail API `users.messages.send`. The visitor's email is used only as `Reply-To`; the receiving address and OAuth credentials stay in Cloudflare runtime secrets.

## Google Cloud setup

The isolated project for this route is **Houleb Portfolio Contact** (`houlebportfolio-contact`); the Gmail API is enabled there. The existing **Business Center** project has separate credentials and is not used by this contact form.

1. In Google Cloud, use the **Houleb Portfolio Contact** project and enable the **Gmail API**.
2. Configure the OAuth consent screen for the Google account that will send portfolio messages.
3. Create an OAuth client ID and client secret. Use an OAuth flow that can grant offline access; the runtime needs a refresh token, not a one-time access token.
4. Authorize only the `https://www.googleapis.com/auth/gmail.send` scope and obtain a refresh token for the sending account.
5. For a production portfolio, ensure the consent configuration is not left in **Testing**. Google says refresh tokens for external apps in Testing expire after seven days when non-basic scopes are requested. Complete any consent-screen verification Google requires for the way the app is used.

The planned web OAuth client is named **Portfolio Contact Gmail API** and uses Google's OAuth Playground callback (`https://developers.google.com/oauthplayground`) only to obtain the initial refresh token. Do not use the Playground for ongoing production delivery; the Pages Function exchanges the stored refresh token directly with Google's token endpoint.

Keep the client secret and refresh token private. Never paste them into chat, commit them, or place them in browser JavaScript.

## Cloudflare Pages secrets

In the Cloudflare dashboard, open the Pages project for `houlebportfolio`, then **Settings → Variables and Secrets**. Add these as encrypted secrets for each environment that should receive contact messages (Production and, if used, Preview):

| Name | Value |
| --- | --- |
| `GMAIL_OAUTH_CLIENT_ID` | Google OAuth client ID |
| `GMAIL_OAUTH_CLIENT_SECRET` | Google OAuth client secret |
| `GMAIL_OAUTH_REFRESH_TOKEN` | Offline refresh token granted to the sending Gmail account |
| `CONTACT_TO` | Private destination inbox |

Save the settings and redeploy the Pages project so the Function receives the bindings. These names are read only by `functions/api/contact.js`; they are not embedded in site HTML.

## Verify delivery

After the secrets are configured and deployed, submit the form once with a subject and message you can recognize. Confirm it arrives at the destination inbox and that Reply sends to the visitor address entered in the form. The form reports success only after Gmail accepts the send request. OAuth or Gmail failures return a generic error and do not expose provider details.

The endpoint also checks the request origin, limits message sizes, validates fields, and uses a honeypot. These are basic spam controls, not a complete anti-abuse system; add rate limiting or a challenge such as Turnstile if abuse appears.

## Local development

The static preview does not run Pages Functions. To test delivery locally, use a Pages Functions runtime such as Wrangler with local secret bindings stored outside Git. Do not put live OAuth values in committed `.dev.vars` files; add any local secret file to `.gitignore` first.
