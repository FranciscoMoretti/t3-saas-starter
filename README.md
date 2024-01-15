# T3-Taxonomy

This repository combines the best of both worlds, merging the powerful features of the [taxonomy](https://github.com/shadcn-ui/taxonomy/) application with the streamlined development setup of [create-t3-app](https://github.com/t3-oss/create-t3-app). The result is a versatile and efficient project built on the T3 Stack.

## Getting Started

This project is based on the [T3 Stack](https://create.t3.gg/) and bootstrapped with `create-t3-app`. Follow the steps below to get started:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/FranciscoMoretti/t3-taxonomy.git
   ```

2. **Install Dependencies:**

   ```bash
   cd t3-taxonomy
   pnpm install
   ```

3. **Configuration:**

   Copy the `.env.example` file to `.env.local` and update the variables as needed:

   ```bash
   cp .env.example .env.local
   ```

4. **Run the Development Server:**

   ```bash
   pnpm dev
   ```

   The application will be accessible at [http://localhost:3000](http://localhost:3000).

## Features

- **T3 Stack Base:** Built on the foundation of [T3 Stack](https://create.t3.gg/) using `create-t3-app`.
- **Next.js 13 and Server Components:** Embracing the latest features for enhanced performance and flexibility.
- **Authentication:** Utilizing NextAuth.js for authentication.
- **ORM and Database:** Leveraging Prisma and hosting the database on PlanetScale.
- **UI Components:** Shadcn/ui to design your UI using Tailwind CSS and Radix UI components.
- **Documentation and Blog:** Using MDX and Contentlayer for documentation and blogging.
- **Subscriptions:** Implementing subscriptions using Stripe.
- **Validations:** Ensuring data integrity with Zod for validations.
- \*\*Written in TypeSc

## Learn More

To explore more about the T3 Stack and its components, refer to the following resources:

- [T3 Stack Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available)
- [create-t3-app GitHub Repository](https://github.com/t3-oss/create-t3-app)

## License

This project is licensed under the [MIT license](LICENSE.md).
