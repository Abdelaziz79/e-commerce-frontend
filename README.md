# TechStore - Modern E-Commerce Frontend

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

A high-performance, enterprise-grade E-Commerce frontend application. Built with **Next.js 14 App Router**, structured using a **Service-Repository pattern** via a custom API Client, and state-managed by **TanStack Query (React Query)**.

This repository contains the **Client-Side** application. It requires a compatible Backend API to function.

---

## 📑 Table of Contents

- [Features](#-features)
  - [Customer Features](#customer-features)
  - [Admin Dashboard Features](#admin-dashboard-features)
- [Architecture & Design Pattern](#-architecture--design-pattern)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Project Structure](#-project-structure)
- [Key Hooks & Data Fetching](#-key-hooks--data-fetching)
- [Deployment](#-deployment)

---

## 🚀 Features

### Customer Features

- **Authentication:** Full flow including Login, Registration, Forgot/Reset Password, and Email Verification.
- **Product Browsing:**
  - Infinite scrolling pagination.
  - Debounced global search with autocomplete suggestions.
  - Dynamic filtering (Category, Brand, Price Range, Rating, Featured, On Sale).
  - Multi-view toggle (Grid 3-col, Grid 4-col, List view) with local storage persistence.
- **Product Details:**
  - Image carousel with full-screen zoom modal.
  - Variation selection (Size, Color, Material, Style) with dynamic pricing and stock checks.
  - Related products slider.
- **Shopping Cart:**
  - Real-time stock validation (Out of Stock / Unavailable badges).
  - Automatic shipping & tax calculation hook (`useCartTotals`).
  - Discount code application with validation.
- **Checkout Process:**
  - 3-Step Flow: Shipping -> Payment -> Review.
  - Address management (Add new or select saved).
  - Order summary with live calculation updates.
- **User Dashboard:**
  - Order history with detailed status tracking.
  - Spending statistics and graphs.
  - Profile management with **Avatar Cropping** functionality.
  - Wishlist management.
  - Review management (Create, Edit, Delete reviews with multi-image upload).

### Admin Dashboard Features

- **Analytics Hub:**
  - Revenue charts (Area/Line charts using Recharts).
  - Order status distribution (Pie charts).
  - Top-selling products and geographic sales data.
  - Date range filtering (7d, 30d, 90d, 1y).
- **Product Management:**
  - Rich text description editor.
  - Multi-image upload with drag-and-drop.
  - **Variation Management:** Complex form to add/remove SKUs with specific stock/price.
  - **Stock Management:** Dedicated view for Low Stock/Out of Stock items with quick adjustment dialogs.
  - Bulk actions (Delete, Update).
- **Order Operations:**
  - Pipeline view (Pending -> Processing -> Shipped -> Delivered).
  - Add tracking numbers (Carrier, Tracking ID).
  - Manual payment confirmation.
  - Export orders to CSV.
- **User Management:**
  - Role management (Promote to Admin).
  - Ban/Suspend users with reason logging.
- **Store Settings:**
  - **Tax Engine:** Create geographic tax rules (Country/State/Zip) with priority logic.
  - **Shipping Engine:** Flat rate, Weight-based, or Price-based shipping rules.
  - **Discounts:** Create percentage or fixed amount codes with usage limits and expiration dates.
  - **General:** Toggle maintenance mode, set currency, and store details.

---

## 🏗 Architecture & Design Pattern

This project strictly separates **UI**, **Data Fetching**, and **API Logic**.

1.  **API Client Layer (`lib/apiClient.ts`):**

    - A Singleton class acting as the gateway to the backend.
    - Handles Axios instance creation, interceptors (attaching JWT tokens), and global error handling (`ApiClientError`).
    - Automatically manages `FormData` conversion for file uploads.

2.  **Custom Hooks Layer (`hooks/`):**

    - Wraps `TanStack Query` functions (`useQuery`, `useMutation`).
    - **Segregated by Domain:** `use-product-queries.ts`, `use-orders.ts`, `use-cart-favorites.ts`, etc.
    - Handles cache invalidation (e.g., adding to cart invalidates the cart query).
    - Handles optimistic updates (e.g., voting on reviews updates the UI immediately).

3.  **UI Components (`components/`):**
    - **Atomic Design:** Reusable primitives in `ui/` (Shadcn).
    - **Feature Components:** grouped by domain (e.g., `products/`, `admin/`, `cart/`).
    - Components interact _only_ with Hooks, never directly with `fetch` or `axios`.

---

## 🛠 Tech Stack

| Category        | Technology                   | Usage                                                            |
| :-------------- | :--------------------------- | :--------------------------------------------------------------- |
| **Framework**   | Next.js 14 (App Router)      | Core application structure and routing.                          |
| **Language**    | TypeScript                   | Strict type safety for API responses and Props.                  |
| **Styling**     | Tailwind CSS                 | Utility-first styling.                                           |
| **UI Library**  | Shadcn UI (Radix Primitives) | Accessible, headless UI components.                              |
| **State/Cache** | TanStack Query v5            | Server state management, caching, and background refetching.     |
| **Auth State**  | React Context + LocalStorage | JWT token management and user session sync.                      |
| **Forms**       | React Controlled Components  | Custom form logic for complex nested data (Variations/Settings). |
| **Charts**      | Recharts                     | Data visualization for Admin Dashboard.                          |
| **Image Tools** | React-Image-Crop             | Frontend image cropping for avatars.                             |
| **Feedback**    | Sonner                       | Toasts and notifications.                                        |
| **Icons**       | Lucide React                 | Consistent SVG iconography.                                      |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18.17.0 or higher.
- A running Backend API (Express/Node.js) serving the endpoints defined in `lib/apiClient.ts`.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Abdelaziz79/e-commerce-frontend.git
    cd e-commerce-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

### Environment Variables

Create a `.env.local` file in the root directory. You must configure the following:

```env
# The entry point for your Backend API (e.g., Express server)
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# The base URL where static assets/images are served from
# Used by lib/utils.ts/getImageSrc helper
NEXT_PUBLIC_IMAGE_HOST_URL=http://localhost:5000
```

3.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    Access the app at `http://localhost:3000`.

---

## 📂 Project Structure

```bash
├── app/
│   ├── (auth)/                 # Route Group: Sign-in, Register, Forgot Password
│   ├── admin/                  # Protected Admin Routes (Dashboard, Products, etc.)
│   ├── brands/                 # Brand listing and details
│   ├── cart/                   # Shopping Cart page
│   ├── categories/             # Category listing and details
│   ├── checkout/               # 3-Step Checkout Flow
│   ├── dashboard/              # Customer User Dashboard
│   ├── orders/                 # Order details and history
│   ├── products/               # Product Listing & Details [id]
│   ├── settings/               # User Profile Settings
│   └── wishlist/               # User Favorites
├── components/
│   ├── admin/                  # Admin-specific UI (Charts, Tables)
│   ├── brand/                  # Brand Cards, Filters, Modals
│   ├── cart/                   # Cart Items, Summary, Totals
│   ├── category/               # Category Grids, Modals
│   ├── checkout/               # Payment Forms, Address Selection
│   ├── dashboard/              # User Dashboard widgets
│   ├── products/               # Product Cards, Image Gallery, Variations
│   ├── reviews/                # Review Cards, Forms, Rating Stars
│   ├── settings/               # Profile Forms, Image Cropper
│   ├── shared/                 # Global Search, Pagination, Empty States
│   ├── ui/                     # Shadcn UI Primitives (Button, Input, etc.)
│   └── users/                  # User Management tables (Admin)
├── hooks/
│   ├── auth-context.tsx        # Auth Provider & Context
│   ├── use-admin-mutations.ts  # Admin user management hooks
│   ├── use-admin-products.ts   # Admin product logic aggregation
│   ├── use-brand-hooks.ts      # Brand CRUD
│   ├── use-cart-favorites.ts   # Cart & Wishlist operations
│   ├── use-cart-totals.ts      # Logic for tax/shipping calculation
│   ├── use-category-hooks.ts   # Category CRUD
│   ├── use-orders.ts           # Order creation & management
│   ├── use-product-mutations.ts# Product CUD (Create/Update/Delete)
│   ├── use-product-queries.ts  # Product Read operations
│   └── use-review-hooks.ts     # Review CRUD
├── lib/
│   ├── apiClient.ts            # Axios Instance Configuration
│   ├── apiClientError.ts       # Custom Error Class
│   ├── utils.ts                # Helper functions (CN, ImageSrc)
│   └── viewModeStorage.ts      # LocalStorage helpers for UI preferences
└── types/                      # TypeScript Interfaces (DTOs)
```

---

## 🧩 Key Hooks & Data Fetching

The application uses custom hooks to abstract complex logic. Here are the most critical ones:

### `useCartTotals`

Located in `hooks/use-cart-totals.ts`.

- **Purpose:** Orchestrates the calculation of cart totals.
- **Logic:** It debounces API calls to `/users/cart/calculate`. It automatically re-runs when a user selects a shipping address or applies a discount code. It handles specific error states for invalid coupons.

### `useAdminProducts`

Located in `hooks/use-admin-products.ts`.

- **Purpose:** A "God Hook" for the Admin Product table.
- **Logic:** Combines fetching products, stats, and low-stock data. It also exposes handlers for bulk selection, bulk deletion, and filtering, keeping the UI component clean.

### `useSearchableInfiniteAdminCategories`

Located in `hooks/use-category-hooks.ts`.

- **Purpose:** Solves the specific UI problem of selecting a category in a dropdown that supports both searching AND infinite scrolling.
- **Logic:** It merges search results with the paginated list and ensures the currently selected item is always present in the list even if it's not on the current "page".

---

## 📦 Deployment

1.  **Build the application:**

    ```bash
    npm run build
    ```

2.  **Start the production server:**
    ```bash
    npm start
    ```

### Vercel Deployment

This project is optimized for Vercel.

1.  Push code to GitHub/GitLab.
2.  Import project in Vercel.
3.  **Critical:** Add the `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_IMAGE_HOST_URL` environment variables in the Vercel dashboard.

---

## ❓ Troubleshooting

**Images are broken/not loading:**

- Check `NEXT_PUBLIC_IMAGE_HOST_URL` in `.env.local`. It must point to the base URL where your backend serves static files (e.g., `http://localhost:5000` if your image path is `/uploads/image.png`).

**API 401 Unauthorized loops:**

- The `ApiClient` class (`lib/apiClient.ts`) handles token storage. Ensure your backend returns the token in the `data.token` field during login.
- Check if `localStorage` has the `auth_token` key.

**"Hydration failed" errors:**

- This usually happens with LocalStorage access during the initial render. Ensure any component accessing `window.localStorage` uses the `useEffect` hook or the provided Storage utility classes which have `typeof window` checks.

---

**Made with ❤️ by [Abdelaziz79](https://github.com/Abdelaziz79)**

---
