# 🚀 Micro-Insurance System - Frontend

Welcome to the **Micro-Insurance System** frontend, a decentralized application built on the **Aptos Blockchain**. This platform enables users to purchase micro-insurance policies, request claims, and receive payouts seamlessly through secure smart contracts. Policy creators can manage insurance policies, verify claims, and ensure quick payouts for customers.

---

## 🔗 Links

- **Live Demo**: [Micro-Insurance System](https://aptos-micro-insurance-products-orcin.vercel.app/)
- **Smart Contract Explorer**: [Aptos Explorer](https://explorer.aptoslabs.com/account/0x2abb1ab290cb828323bf6da71a3f36011d59cd7aa576474f19dbcae50521e056/modules/code/MicroInsuranceSystem?network=testnet)

---

## ✨ Key Features

- **Browse Insurance Policies**: Users can explore available policies and their details, including premiums and claim amounts.
- **Purchase Policies**: Customers can buy policies using Aptos native tokens (**APT**) via integrated wallets.
- **Submit Claim Requests**: Users can request claims on active policies when necessary.
- **Verify and Payout Claims**: Policy creators review claims and process payouts directly through the blockchain.
- **Policy Management**: Policy creators can add, manage, and verify customer policies and requests with ease.
- **Blockchain Transactions**: All policy transactions, purchases, and payouts are securely handled via smart contracts on the Aptos blockchain.

---

## 📋 Prerequisites

Ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Aptos Wallet** (e.g., **Petra Wallet**) for blockchain interactions

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

Clone the project repository to your local machine and navigate to the project folder:

```bash
cd micro-insurance-system
```

### 2. Install Dependencies

Install the required dependencies:

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root and add the following configuration:

```bash
PROJECT_NAME=MicroInsuranceSystem
VITE_APP_NETWORK=testnet
VITE_MODULE_ADDRESS=0x2abb1ab290cb828323bf6da71a3f36011d59cd7aa576474f19dbcae50521e056
```

Replace `<VITE_MODULE_ADDRESS>` with the address where your smart contract is deployed.

### 4. Run the Development Server

To start the project in development mode:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### 5. Deploy the Smart Contract

To deploy the smart contract:

1.  Install **Aptos CLI**.
2.  Update the **Move.toml** file with your wallet address:

    - Add you Wallet Address from Petra here

    ```bash
    sys_addrx = "0xca10b0176c34f9a8315589ff977645e04497814e9753d21f7d7e7c3d83aa7b57"
    ```

    - Add your Account addr here for Deployment

    ```bash
    my_addrx = "2abb1ab290cb828323bf6da71a3f36011d59cd7aa576474f19dbcae50521e056"
    ```

3.  Create your new Address for Deployment

    ```bash
    aptos init
    ```

4.  Compile and publish the contract:

    ```bash
    aptos move compile
    aptos move publish
    ```

---

## 🛠 How to Use the Platform

### 1. Connect Wallet

When the application opens, connect your Aptos wallet (e.g., Petra Wallet) to interact with the platform. This allows you to buy policies, submit claims, and receive payouts seamlessly.

### 2. Browse Insurance Policies

Navigate to the **Policies** section to view available policies. Each policy lists the following details:

- Policy description
- Premium amount
- Maximum claimable amount
- Payment type (one-time or yearly)
- Policy creator information

### 3. Purchase Policy

To buy a policy:

- Select the desired policy.
- The platform will prompt you to pay the premium in **APT** through your connected wallet.
- After purchase, the policy will be listed under **My Policies**.

### 4. Request Insurance Claim

To file a claim:

- Go to the **My Policies** section and choose the policy.
- Click on **Request Claim** to initiate the claim request.
- The claim will be sent to the policy creator for verification.

### 5. Claim Verification and Payout

For policy creators:

- Navigate to the **Manage Policies** section to review incoming claims.
- Select the relevant policy and verify the claim.
- Once verified, the payout will be automatically transferred to the customer’s wallet using the predefined claim amount.

---

## 📊 Scripts

- **`npm run dev`**: Start the development server.
- **`npm run build`**: Build the project for production.
- **`npm test`**: Run tests to ensure the project works as expected.

---

## 🔍 Dependencies

- **React**: UI library for building user interfaces
- **TypeScript**: Typed JavaScript for better development experience
- **Aptos SDK**: SDK for blockchain interaction
- **Ant Design / Tailwind CSS**: Modern and responsive UI components
- **Petra Wallet Adapter**: Wallet integration for the Aptos blockchain

---

## 📚 Available View Functions

- **View All Policies**: Lists all available insurance policies.
- **View Policies by Creator**: Displays all policies created by a specific business.
- **View User Claims**: Shows all submitted claims by a customer.
- **View Claim Requests**: Lists all pending claim requests for verification.

---

## 🛡 Security and Transparency

- **Smart Contracts**: All transactions are processed securely on the blockchain.
- **No Intermediaries**: Payments and claims are managed directly between the users and policy creators.
- **Real-Time Tracking**: Users can monitor policy purchases and claim statuses in real-time.

---

## 🌐 Common Issues and Solutions

1. **Wallet Connection Issues**: Ensure your Aptos wallet (e.g., Petra) is installed and connected.
2. **RPC Rate Limits**: Use **private RPC providers** to avoid rate-limited public nodes.
3. **Transaction Failures**: Check wallet permissions and ensure sufficient funds are available for transactions.

---

## 🚀 Scaling and Deployment

If deploying on **Vercel** or similar platforms:

- Use **third-party RPC providers** such as **Alchemy** or **QuickNode**.
- Implement **request throttling** to handle high traffic efficiently.
- Use **WebSockets** for real-time updates to improve user experience.

---

## 🎉 Conclusion

The **Micro-Insurance System** provides a decentralized and transparent way to manage insurance policies, claims, and payouts. With secure smart contracts and easy-to-use features, businesses and customers can seamlessly interact on the Aptos blockchain. This platform offers an efficient way to handle micro-insurance, ensuring trust and transparency for all participants.
