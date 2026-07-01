# Recommendation rules (PRD §14)

Pick the stack by the client's primary business type. Always: **primary + secondary + expansion + AI layer**. Never pitch everything.

| If the client is… | Primary | Secondary | Expansion | AI agents |
|---|---|---|---|---|
| **D2C Brand** (multi-channel, online sales, returns) | IMS | WMS | Order & Delivery | Order Exception, Inventory Shortfall, Daily MIS |
| **B2B Manufacturer** (production, raw materials, QC, batches) | Manufacturing Ops | IMS, WMS | Compliance | Production Planning, QC Approval, Vendor Follow-Up |
| **Food Brand / Central Kitchen** (perishable, expiry, hubs) | Central Kitchen Ops | IMS (Batch & Expiry) | Order & Delivery | Replenishment, Hub Replenishment, Production Planning |
| **Distributor / Wholesaler** (stock, landed cost) | IMS | WMS | Order & Delivery | Replenishment, Inventory Shortfall, Daily MIS |
| **Quick-Commerce** (dark stores, sub-30-min) | Order & Delivery | IMS | WMS | Order Exception, Hub Replenishment, Dispatch Exception |
| **3PL / Warehousing-Heavy** (multi-client sites) | WMS | IMS | Order & Delivery / Control Tower | PO Appointment, Dispatch Exception, Daily MIS |
| **Fleet Operator** (trucking/mobility) | Fleet | IMS | Order & Delivery | Daily MIS, Dispatch Exception |
| **ERP-Heavy Enterprise** (SAP/Oracle/Tally/Zoho…) | ERP Integration Layer | Workflow Automation, Control Tower | AI Agent Layer | ERP Action, Daily MIS, Approval Routing |

**ERP rule:** if they use any ERP, *always* add ERP-layer positioning — Hyperion sits on top of the ERP to automate execution, reporting, approvals and exceptions; it does **not** replace it.
