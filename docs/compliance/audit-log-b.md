# Consent Mechanism Audit Trail (Cookie Banner Implementation)

**Entity:** The Ship Inn (Porlock Weir) Ltd  
**Website:** theshipinnporlockweir.co.uk  
**Implementation Date:** July 12, 2026  
**Status:** Live & Compliant  

---

## 1. Compliance Principles Verified

The cookie consent mechanism implemented on this website has been built to conform to the UK GDPR and the Privacy and Electronic Communications Regulations (PECR), as updated by the Data (Use and Access) Act (DUAA).

### A. Equal Prominence / No Dark Patterns
- The banner provides two buttons of identical visual size, typeface weight, and contrast profile:
  - **Button A:** "Reject Non-Essential" (Secondary border styling matching standard UI buttons)
  - **Button B:** "Accept All" (Primary background styling matching primary UI call-to-actions)
- Both buttons have identical spacing and prominence to ensure users can choose to decline optional tracking without any frictional overhead.
- No optional tracking cookies are loaded before the user clicks "Accept All".

### B. Consent Persistence & Clear Choice
- The selection is stored in the browser's `localStorage` under the key `cookie_consent` with a value of either `'granted'` or `'denied'`.
- Consent is persistent for 1 year or until the user clears their browser cache.
- Essential session cookies (e.g. system security, anti-CSRF, or session preservation) are exempt from PECR/GDPR consent requirements and run automatically.

### C. Revocation Capability
- Users can clear their choices at any time. Clear guidance on how to do this is provided in the **Cookie Policy** page (`/cookies`).
- Opting out is as simple as opting in.

---

## 2. Technical Checklists

| Component | Code Reference | Functionality | Verified |
|-----------|----------------|---------------|:---:|
| Cookie Banner | `src/components/CookieBanner.tsx` | Bottom overlay layout, equal prominence button styles, Link to `/cookies`. | Yes |
| State Management | `src/lib/hooks/useCookieConsent.ts` | Reads/writes `cookie_consent` to `localStorage` and triggers `cookie_consent_updated` window event. | Yes |
| Script Blocker | `src/components/AnalyticsScripts.tsx` | Conditionally mounts analytic scripts only if `consent === 'granted'`. | Yes |
| Layout Registry | `src/app/(website)/layout.tsx` | Registers `AnalyticsScripts` and `CookieBanner` globally for all public sub-routes. | Yes |
