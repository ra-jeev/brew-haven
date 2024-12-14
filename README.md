# Brew Haven ☕

## Project Overview

Brew Haven is a dynamic coffee shop web application that demonstrates the use of feature flags using DevCycle. The app provides a simple customizable menu, checkout experience, and an innovative admin interface for managing feature variations and A/B testing.

## Key Features

- Home page showcasing the coffee shop
- Interactive menu display
- Dummy checkout process
- Feature flag management through DevCycle
- Admin page for feature flag control

## Technologies Used

- React
- Vite
- Shadcn UI
- DevCycle SDK
- Netlify Functions

## Prerequisites

- Node.js (recommended version 18+)
- pnpm package manager
- DevCycle account
- Netlify account and CLI (for local development and deployment)

## Environment Setup

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```
3. Rename `.env.example` to `.env` and update the following environment variables:

```bash
VITE_DEVCYCLE_CLIENT_SDK_KEY=your_client_sdk_key
DEVCYCLE_API_CLIENT_ID=your_client_id
DEVCYCLE_API_CLIENT_SECRET=your_client_secret
DEVCYCLE_PROJECT_ID=your_project_id
```

## Local Development

To run the application in development mode:

```bash
# For standard development
pnpm dev

# For testing admin page with Netlify Functions
netlify dev
```

## Deployment

The project is set up to be easily deployed on Netlify. Ensure all environment variables are correctly set in your Netlify deployment settings.

## Feature Flag Management

The application leverages DevCycle for:

- Runtime feature flags adaption using DevCycle React SDK
- Feature flags control through the admin interface using the DevCycle Management APIs

> [!NOTE]
> The admin page's management APIs are secured using Netlify Functions to protect sensitive credentials.

The application has two release type feature flags:

- Coffee Menu
  - 3 variables to control: 1. showing nutrition info, 2. enable seasonal menu, 3. enable order customization
  - 3 different variations (Basic / Standard / Seasonal) to choose from
- Payment and Ordering
  - 3 variables to control: 1. online payment, 2. loyalty points, and 3. live order tracking
  - 3 different variations (Basic / Standard / Premium) to choose from

Apart from the release type feature flags, the app also uses an A/B testing flag. This flag enables promotions for certain percentage of customers. You can set the promotion text, the discount amount/percentage, and if needed, a min cart value to avail the promotion.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
