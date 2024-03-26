

---

# Product api

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Authentication](#authentication)
- [Testing](#testing)
- [Deployment](#deployment)
- [Postman Collection](#postman-collection)



## Features

- User Account Creation
- Add to Cart
- Full Crud Operations for Product Listing
- Authentication
- Comprehensive Testing
- Deployed on AWS EC2

## Tech Stack

- Node.js (LTS version)
- TypeScript
- Mongoose ORM
- MongoDB
- Supertest (for testing)
- Express.js (for routing)

## Getting Started

### Installation

1. Clone the repository:

   ```bash
   https://github.com/owujib/backend-engineer-test
   ```

2. Navigate to the project directory:

   ```bash
   cd backend-engineer-test
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

   ```bash
    npm run build
    ```

### Configuration

1. Create a `.env` file in the project root and configure the following environment variables:

   ```env
    NODE_ENV=development
    PORT=5000
    JWT_SECRET=nasecreatooo
    DB_URL='mongodb://localhost:27017/db'
   ```

   Use `docker db`, for testing.

## Authentication

Authentication in this project Json webtokens is being used for authentication

## Testing

The application is thoroughly tested using the Supertest testing framework.

To run tests, use the following command:

```bash
npm test
```

## Deployment
I was having some critical errors uploading to render and railway.app, so I decided to create an EC2 instance for the deployment, also there was no time to set up any CI/CD pipeling I just used pm2 on my vm :)

The API is deployed on Heroku and can be accessed at [http://18.130.138.176](http://18.130.138.176).

## Postman Collection

You can find the Postman collection for testing the API at the following URL:

[Postman Collection]([https://www.postman.com/owujib/workspace/public-workspace/collection/27213384-2a055288-4d51-4a76-93af-cc77e185894f?action=share&creator=27213384&active-environment=27213384-1004accb-7085-4041-931e-b3a15b7a2678](https://www.postman.com/bold-escape-470464/workspace/mainstack-be/collection/27213384-984fe1a4-a2f5-4353-8855-e2cb3fe68c00?action=share&creator=27213384&active-environment=27213384-bcefeaaf-a8e4-4e31-8d73-2a1cf774dec8)https://www.postman.com/bold-escape-470464/workspace/mainstack-be/collection/27213384-984fe1a4-a2f5-4353-8855-e2cb3fe68c00?action=share&creator=27213384&active-environment=27213384-bcefeaaf-a8e4-4e31-8d73-2a1cf774dec8])


---
