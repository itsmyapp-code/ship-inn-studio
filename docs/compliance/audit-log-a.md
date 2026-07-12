# UK GDPR Article 30 / Article 24 Record of Processing Activities (ROPA)

**Entity:** The Ship Inn (Porlock Weir) Ltd  
**Address:** Porlock Weir, Minehead, Somerset, TA24 8PB  
**Data Privacy Lead:** hello@theshipinnporlockweir.co.uk  
**Date of Record:** July 12, 2026  
**Status:** Active  

---

## 1. Summary of Data Processing Activities

This record documents the web-based data processing activities conducted by The Ship Inn website in compliance with Article 24 and Article 30 of the UK General Data Protection Regulation (UK GDPR).

### Activity A: Booking Form & Guest Reservations
- **Purpose of Processing:** Processing, verifying, and completing room bookings, guest reservations, and custom requests.
- **Categories of Data Subjects:** Customers, prospective guests, and site visitors making bookings.
- **Categories of Personal Data:** Name, email address, physical address, phone number, booking dates, payment reference, and dietary or accessibility requests.
- **Lawful Basis (UK GDPR Art. 6):** Performance of a Contract (Article 6(1)(b)).
- **Retention Period:** 7 years (for statutory tax and corporate accounting compliance under UK law).

### Activity B: Customer Inquiries & Contact Forms
- **Purpose of Processing:** Responding to guest inquiries, general feedback, and booking questions submitted via the website contact form.
- **Categories of Data Subjects:** Site visitors submitting messages.
- **Categories of Personal Data:** Name, email address, message content.
- **Lawful Basis (UK GDPR Art. 6):** Legitimate Interest (Article 6(1)(f)). We have a legitimate business interest in responding to incoming customer inquiries.
- **Retention Period:** 12 months from the date of the last contact, unless deletion is requested earlier.

### Activity C: Infrastructure Diagnostics & Security Logging
- **Purpose of Processing:** System security, fraud detection, server health monitoring, infrastructure defense, and debug/fault repair.
- **Categories of Data Subjects:** All website visitors.
- **Categories of Personal Data:** IP addresses, browser user agent strings, access timestamps, visited paths, and referrer URLs.
- **Lawful Basis (UK GDPR Art. 6):** Legitimate Interest (Article 6(1)(f)). Under the Data (Use and Access) Act (DUAA), processing for the purposes of network/information security, system stability, and fault repair is recognised as a legitimate interest.
- **Retention Period:** Maximum of 90 days.

### Activity D: Anonymous Performance Analytics
- **Purpose of Processing:** Analyzing traffic flow and page interactions to improve user experience.
- **Categories of Data Subjects:** Site visitors consenting to analytics.
- **Categories of Personal Data:** Aggregated usage statistics, page views, click paths.
- **Lawful Basis (UK GDPR Art. 6):** Consent (Article 6(1)(a)).
- **Retention Period:** Session-based (no persistent cookies or user-identifiable tracking profiles are created).

---

## 2. Technical and Organisational Security Measures

The Ship Inn website operates on a modern Jamstack architecture hosted via Vercel:
- **Data in Transit:** All traffic is encrypted in transit using industry-standard TLS (HTTPS).
- **Data Minimisation:** No credit card credentials or payment details are stored or processed locally; payments are routed securely via third-party processors.
- **Access Control:** CMS administrative access (Outstatic) is restricted to authorised personnel via secure GitHub OAuth authentication.
- **Infrastructure:** Serverless functions on Vercel run in containerised environments, mitigating persistent server intrusion risks.
