# 🏛️ Family ID Portal — Government of Gujarat (એક પરિવાર, એક ઓળખ)

> **One Family, One Identity** — A unified digital portal for citizens of Gujarat to create family cards, check welfare scheme eligibility with dynamic document uploads, and track applications; alongside an Officer Inspection Console for government officials to verify citizen submissions.

---

## 📌 Project Overview

The **Family ID Portal** is designed to streamline citizen access to state welfare schemes in Gujarat. It assigns a unique 12-character identifier (`GJ-2026-XXXX-XX`) to each registered family, creating a single source of truth for social security benefits, subsidies, and government verifications.

---

## 🛠️ Key Features

### 👤 Citizen Portal
- **Family Registration & Member Management**: Register family head and members with details like Aadhaar, DOB, Income, Caste, Religion, and Employment Status.
- **Automated Scheme Eligibility Engine**: Real-time evaluation of eligibility for Gujarat state schemes:
  - *Mukhyamantri Amrutam (MA) Yojana*
  - *Mukhyamantri Kisan Sahay Yojana*
  - *Vahli Dikri Yojana*
  - *Niradhar Vrudh Pension Yojana*
  - *Shramik Annapurna Yojana*
  - *Divyang Swavalamban Yojana*
  - *Gujarat Yuva Swavalamban Yojana (MYSY)*
  - *Suraksha Bima Yojana*
- **Dynamic Document Upload Checklist**: Citizens attach required verification documents (Identity Proof, Income Certificate, Caste Certificate, Bank Passbook, Land Records, etc.) when applying for schemes.
- **Live Application Tracker**: Track scheme application progress and status using unique reference IDs (`SCH-2026-XXXXXX`).

### 🛡️ Government Official Portal (`/admin`)
- **Secure Officer Authentication**: Login access for government officials (`Familyadmin` / `123456789`).
- **Application Queue & Metrics**: View total, pending, verified, and rejected applications across districts.
- **Document Inspection Console**: Inspect submitted family details and preview uploaded verification documents in an interactive modal.
- **Verdict Action Controls**: Approve / Verify applications, mark for Pending List (Under Review), Reject, or Delete invalid applications.
- **Policy Enforcement**: Complies with Gujarat Use Case #8 — Officials can inspect family data and member details *only* for families that have submitted an application for a scheme or physical verification.

---

## 🖼️ Screenshots & Interface Preview

*(Upload your preview images into `client/public/images/` to display them here)*

| Citizen Dashboard & Scheme Eligibility | Government Inspection Console |
| :---: | :---: |
| ![Citizen Dashboard](/client/public/images/dashboard_preview.png) | ![Admin Console](/client/public/images/admin_preview.png) |

| Mandatory Document Upload | Application Status Tracker |
| :---: | :---: |
| ![Document Upload](/client/public/images/document_upload_preview.png) | ![Application Tracker](/client/public/images/tracker_preview.png) |

---

## 💻 Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS, Lucide Icons, Framer Motion
- **Backend**: Node.js, Express.js, TypeScript, Mongoose
- **Database**: MongoDB Atlas
- **Package Manager**: `pnpm` (Workspace setup)

---

## 🚀 Setup & Installation Guide

Follow these steps to run the project locally on your system:

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **pnpm**: v8.0.0 or higher (or `npm`/`yarn`)
- **MongoDB Atlas** database connection string

### 2. Clone Repository
```bash
git clone https://github.com/JenishMacwan230/FamilyID.git
cd FamilyID
```

### 3. Install Dependencies
```bash
# Install root, client, and server dependencies
pnpm install
```

### 4. Configure Environment Variables
Create a `.env` file in the `server` directory:

```bash
# server/.env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

### 5. Run Development Servers
Start both backend server and frontend client concurrently:

```bash
pnpm dev
```

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **Backend API Server**: [http://localhost:5000](http://localhost:5000)
- **Government Official Portal**: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🔑 Government Official Credentials

| Role | Username | Password |
| :--- | :--- | :--- |
| **Government Official / Admin** | `Familyadmin` | `123456789` |

---

## 📜 License

This project is licensed under the MIT License — Government of Gujarat Digital Governance Initiative.
