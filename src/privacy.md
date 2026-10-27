# PhotoVibe — Privacy Policy

**Last updated:** 2026-10-28
**Effective:** 2026-10-28
**Contact:** support@photovibe.ai

This Privacy Policy explains what personal information PhotoVibe ("we", "us", the app `ai.photovibe.app`) collects, why we collect it, how long we keep it, and the choices you have. It applies to the PhotoVibe mobile application and the backend services it depends on.

By using PhotoVibe you agree to this policy. If you do not agree, please uninstall the app.

---

## 1. What we collect

### 1.1 Account information
You can sign up with a phone number or with an email address. Depending on which you choose we collect:
- **Phone number** — if you sign in with a one-time SMS code. The number is sent to our authentication provider (Supabase) and its SMS delivery partner solely to deliver the code and identify your account. We never see or store the code itself after it is verified.
- **Email address** — if you sign in with email; also used for account recovery.
- **Password** — only for email sign-in; stored as a salted hash by Supabase. We never see your plain-text password.
- **Display name** (optional) — shown only inside your own copy of the app.

### 1.2 Jewellery images you upload
- Images you submit for AI generation are sent to our backend, then forwarded to two third-party services (see Section 3) for processing.
- We do **not** retain the image bytes server-side after the job completes. A SHA-256 hash of the image and a metadata row (jewellery type, aspect ratio, model used, duration, status) are stored for abuse investigation and quota accounting.
- The generated result image is streamed back to your device and is **not** stored on our servers.

### 1.3 Generated content history
- PhotoVibe saves the generated image on **your device** in app-private storage so you can revisit it from the History screen. We have no copy of this image.
- Deleting an item from History also deletes the file from your device.

### 1.4 Usage data
- Per-user generation counts (a lifetime count on the free plan, a monthly count on paid plans) plus a rolling 24-hour count, used to enforce your plan's image allowance.
- If you subscribe to a paid plan, the Google Play purchase token and subscription status, so we can unlock your plan and keep it in sync with renewals and cancellations. We never see your card or UPI details; Google Play handles payment.
- Per-request structured logs (request ID, status, duration, user ID). Logs are kept for 30 days for operational debugging and abuse investigation.
- We do **not** use analytics SDKs that profile your behaviour across apps. We may add a privacy-preserving product analytics provider in the future; if we do, this policy will be updated and you will be asked to consent on next launch.

### 1.5 Crash reports
- If a crash occurs, an anonymised stack trace may be sent to our error monitoring provider (Sentry). The trace does not contain the contents of your images, your email, or your password. We strip authorization headers before sending.

### 1.6 What we do NOT collect
- Your contact list, your camera roll outside the images you explicitly pick, your location, your microphone, your other apps, your device IMEI/IMSI, your advertising ID.

---

## 2. How we use what we collect

| Purpose | Data used |
|---|---|
| Authenticate you and let you sign in | Phone number or email, hashed password or one-time code |
| Generate the jewellery photoshoots you request | Image bytes (passed through, not retained) |
| Enforce your plan's image allowance and daily cap | User ID, generation counters |
| Activate and maintain a paid subscription | Google Play purchase token, subscription status |
| Detect and prevent abuse (NSFW uploads, prompt injection, quota fraud) | Image hash, audit logs |
| Operational debugging | Request logs (30-day retention) |
| Respond to support requests | Email |

We do **not** sell your data. We do **not** share your data with advertisers or data brokers.

---

## 3. Third parties that process your data

PhotoVibe is a thin client over best-of-breed AI services. We send a minimum-necessary subset of data to each:

| Provider | Data sent | Purpose | Their privacy policy |
|---|---|---|---|
| **Supabase** (Tokyo region) and its SMS partner | Phone number or email, hashed password, generation counters, audit metadata | Authentication, one-time SMS codes, database | https://supabase.com/privacy |
| **Replicate** (USA) | Image bytes for the duration of a generation | AI inference (Nano Banana model, NSFW classifier) | https://replicate.com/privacy |
| **remove.bg** (Vienna, EU) | Image bytes for the duration of a background-removal call (only if the on-device model fails) | Subject cutout fallback | https://www.remove.bg/privacy |
| **Sentry** (USA, EU) | Anonymised stack traces, request IDs | Crash monitoring | https://sentry.io/privacy/ |
| **Google Play** | Standard Play Store telemetry; subscription purchase tokens | App distribution, subscription billing | https://policies.google.com/privacy |

We have **no advertising SDKs** in the app.

---

## 4. AI-generated content disclosure

Every image PhotoVibe produces is generated by an AI model. We:

- Add a visible **"AI-GENERATED"** label burned into every output image.
- Run NSFW moderation on both the image you upload AND the image the AI produces, rejecting either if it crosses the safety threshold.
- Give you an in-app **Report this image** button for outputs you believe are misleading or harmful. Reports are stored and reviewed.

AI output is best-effort, not photography. **Do not list a generated image as the actual product for sale without confirming the jewellery in the result matches the piece you uploaded.** PhotoVibe is not liable for mismatched listings.

---

## 5. How long we keep your data

| Data | Retention |
|---|---|
| Phone number or email + auth row | Until you delete your account |
| Profile, quota counters, subscription status | Until you delete your account |
| Generation audit metadata (hash + status) | 12 months, then purged |
| Reports you submitted | 24 months |
| Operational logs | 30 days |
| Sentry crash reports | 90 days |
| **Image bytes** | **Not retained** — passed through to providers, never stored on our servers |

---

## 6. Your rights

You have the right to:

- **Access** the data we hold about you — use the in-app **Settings → Email support** flow, or `GET /me/export` returns a JSON download of everything.
- **Correct** inaccurate data — email support@photovibe.ai.
- **Delete** your account and all associated data — use **Settings → Delete my account** in the app, or follow the steps at https://shanichaun348-ai.github.io/photovibe-legal/delete-account/ if you no longer have the app installed. The deletion is irreversible and removes your profile, quota counters, audit metadata, reports, and authentication row. We complete the deletion within 30 days; technical backups containing residual references may take up to 90 days to fully purge.
- **Withdraw consent** — uninstall the app and use the Delete my account flow.
- **Object to processing** or **port your data** — email support@photovibe.ai.

Residents of the EU/EEA have rights under the GDPR. Residents of California have rights under the CCPA. Indian residents have rights under the Digital Personal Data Protection Act 2023. These rights are honoured the same way for everyone: through the in-app flows above and the support email.

---

## 7. Security

- All traffic between the app and our backend uses HTTPS (TLS 1.2+). The app's network security configuration disables cleartext traffic in production.
- Authentication tokens are stored in the device's encrypted storage (Android Keystore / iOS Keychain), not in plain-text storage.
- Our backend rejects images that don't pass header validation, exceeds 8 MB, or has dimensions over 25 megapixels.
- We log redact authorization headers and secret env vars from our structured logs.

No system is 100% secure. If you discover a vulnerability please email security@photovibe.ai — we'll respond within 72 hours.

---

## 8. Children

PhotoVibe is not directed to children under the age of 13 (or under 16 in the EU). We do not knowingly collect data from anyone under those ages. If you are a parent and believe your child has signed up, email support@photovibe.ai and we will delete the account.

---

## 9. International transfers

Your data may be processed in countries other than your own (notably the USA, the EU, and Japan — see Section 3). Where required by law (e.g. for EU users) we rely on Standard Contractual Clauses with our subprocessors.

---

## 10. Changes to this policy

When we make material changes to this policy we will:
- Update the "Last updated" date at the top.
- Notify you in-app the next time you open PhotoVibe.
- Where required, ask for fresh consent before the change takes effect.

---

## 11. How to contact us

- **General privacy questions / data subject requests:** support@photovibe.ai
- **Security disclosures:** security@photovibe.ai
- **Postal address:** *[insert your registered business address before publication]*
