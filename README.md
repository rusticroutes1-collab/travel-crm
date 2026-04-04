Travel CRM Project

Overview:
This is a modular Travel CRM system for managing travel operations.

Modules:
- Leads (Firebase - index.html)
- Hotels (database.html, stored in localStorage)
- Vendors (vendors.html, stored in localStorage)
- Quotations (to be built)
- Vouchers (to be built)
- Invoices (to be built)

Data Handling:
- Leads → Firebase
- Hotels → localStorage
- Vendors → localStorage

Rules:
- Prevent duplicate entries (hotel/vendor)
- Reuse functions from code.js
- Keep UI simple and consistent
- Follow same structure across modules
- Use IDs to link data (lead → quotation → voucher)

Coding Guidelines:
- Use plain JavaScript (no frameworks)
- Keep functions reusable
- Keep file structure modular
- Maintain clean naming

Goal:
Build a complete travel CRM with:
Lead → Quotation → Voucher → Invoice flow
