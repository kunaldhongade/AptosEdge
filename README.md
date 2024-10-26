# 🚀 AptosEdge - Multisig Wallet on Aptos Blockchain

Welcome to **AptosEdge**, a powerful and secure multisig wallet built on the **Aptos Blockchain**. AptosEdge ensures secure collaborative fund management by requiring multiple approvals to authorize transactions. Designed for **DAOs, enterprises, and shared asset management**, the wallet supports **customizable approval thresholds, cross-chain transactions, batch processing, and recovery mechanisms**.

---

## 🔗 Links

- **Live Demo**: [AptosEdge](https://aptosedge.vercel.app)
- **Smart Contract Explorer**: [Aptos Explorer](https://explorer.aptoslabs.com/account/0x339c4c822be7e7662b1f8ec7b61e51659fae8616121c890e35ef202f5f89b739/modules/code/AptosEdgeMultisig?network=testnet)

---

## ✨ Key Features

- **Secure Admin Management**: Add, remove, and recover admins to ensure smooth wallet operation. Prevents accidental removal of the last admin.
- **Batch Transaction Execution**: Execute multiple transactions efficiently to save time and reduce gas costs.
- **Transaction Lifecycle**: Create, confirm, execute, cancel, and track transactions.
- **Meta-Confirmation**: Supports third-party confirmations for gasless transactions.
- **Transaction Expiry**: Ensures old transactions are invalidated automatically after a set duration.

---

## 📋 Prerequisites

Ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Aptos Wallet** (e.g., Petra Wallet) for blockchain interactions

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

Clone the project repository to your local machine and navigate to the project folder:

```bash
git clone https://github.com/kunaldhongade/AptosEdge.git
cd AptosEdge
```

### 2. Install Dependencies

Install the required dependencies:

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root and add the following configuration:

```bash
PROJECT_NAME=AptosEdgeMultisig
VITE_APP_NETWORK=testnet
VITE_MODULE_ADDRESS=0x339c4c822be7e7662b1f8ec7b61e51659fae8616121c890e35ef202f5f89b739
```

Replace `0xYOUR_SMART_CONTRACT_ADDRESS` with the actual deployed address.

### 4. Run the Development Server

To start the project in development mode:

```bash
npm run dev
```

Access the app at `http://localhost:5173`.

### 5. Deploy the Smart Contract

1. **Install Aptos CLI**.
2. Update **Move.toml** with your wallet address:

   ```bash
   my_addrx = "0xYOUR_ACCOUNT_ADDRESS"
   ```

3. Initialize Aptos CLI and compile the contract:

   ```bash
   aptos init
   aptos move compile
   aptos move publish
   ```

---

## 🛠 How to Use AptosEdge

### 1. Create a Multisig Wallet

Use the following command to create a multisig wallet with two admins and a threshold of two approvals:

```move
create_multisig(&signer, vector[admin1, admin2], 2);
```

### 2. Create and Confirm a Transaction

Admins can create a new transaction:

```move
create_transaction(&signer, multisig_creator, 1000, recipient_address);
```

Then confirm the transaction:

```move
confirm_transaction(&signer, multisig_creator, tx_id);
```

### 3. Execute Transactions

Admins can execute transactions after receiving sufficient confirmations:

```move
execute_transaction(&signer, multisig_creator, tx_id);
```

For batch execution:

```move
execute_batch_transactions(&signer, multisig_creator, vector[tx1, tx2, tx3]);
```

### 4. Cancel a Transaction

Cancel a pending or unexecuted transaction:

```move
cancel_transaction(&signer, multisig_creator, tx_id);
```

---

## 📊 Scripts

- **`npm run dev`**: Start the development server.

---

## 🔍 Dependencies

- **React**: UI library for building interactive interfaces
- **Aptos SDK**: Blockchain interaction library
- **Tailwind CSS**: CSS framework for responsive design
- **Petra Wallet Adapter**: Wallet integration for Aptos

---

## 📚 Available View Functions

- **Get Admins**: View the list of current admins.
- **Get Wallet Balance**: Display the wallet’s current balance.
- **Get Transaction Count**: View the number of transactions created.
- **Get Pending Transactions**: List all pending (unexecuted) transactions.
- **Check Admin Status**: Verify if an address is an admin.

---

## 🛡 Security and Transparency

- **Transaction Expiry**: Ensures stale transactions cannot be executed.
- **Batch Execution Safeguards**: Prevents duplicate execution in parallel processing.
- **Meta-Transactions**: Supports gasless transactions through third-party confirmations.

---

## 🌐 Common Issues and Solutions

1. **Wallet Not Connecting**: Ensure your Aptos wallet (e.g., Petra) is properly installed and connected.
2. **Insufficient Funds**: Ensure the wallet has enough APT tokens to complete transactions.
3. **Deployment Issues**: Use Aptos CLI to check if the smart contract was deployed correctly.

---

## 🚀 Scaling and Deployment Tips

- **Use Private RPC Providers**: Avoid public node limits by using services like **QuickNode**.
- **Implement Real-Time Updates**: Use **WebSockets** for better user experience.
- **Optimize Batch Transactions**: Minimize gas costs by grouping operations into batches.

---

## 🎉 Conclusion

**AptosEdge** offers a secure and flexible multisig wallet, designed for collaborative fund management on the Aptos blockchain. Its powerful governance tools, cross-chain readiness, and transparency features make it an ideal choice for **DAOs, enterprises, and shared asset managers**. With an intuitive interface and advanced smart contract logic, AptosEdge provides seamless, secure, and efficient asset management for the decentralized future.
