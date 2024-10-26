# **AptosEdge: A Robust Multisig Wallet for Aptos Blockchain**

## Overview
**AptosEdge** is a highly secure, feature-rich, and efficient **multisig wallet** built on the **Aptos blockchain**. Designed for decentralized financial operations and asset management, AptosEdge enables multiple parties to collectively manage funds and approve transactions through customizable governance rules.

This wallet empowers teams, DAOs, and enterprises to manage their assets with **strong security guarantees**, **role-based access control**, and **event-driven transparency**. It also offers **batch processing**, **cross-chain functionality**, and an **expiry mechanism** to handle stale transactions effectively.

---

## **Key Features**
### 1. **Admin Management**
- **Add or remove admins** with proper permission checks.
- **Recovery mechanism** to add new admins if an admin key is lost.
- Prevents accidental removal of the last admin to avoid wallet lockout.

### 2. **Secure Transaction Lifecycle**
- **Create, confirm, execute, batch-execute, and cancel transactions.**
- Includes **transaction expiry** to prevent stale transactions.
- **Meta-confirmation** allows third-party actors to confirm transactions without the sender needing gas.

### 3. **Cross-Chain Integration (LayerZero Ready)**
- Placeholder logic for **cross-chain operations** to support multi-network fund management.

### 4. **Event Emission for Observability**
- Emits events for every critical operation (e.g., transaction creation, confirmation, and execution).
- Facilitates seamless tracking for dashboards and monitoring tools.

### 5. **Batch Execution for Efficiency**
- Supports **batch execution of multiple transactions** to reduce operational overhead and gas costs.

### 6. **Enhanced Security and Guardrails**
- **Prevents duplicate admin entries** and accidental removal of the last admin.
- **Checks for re-execution risks** in batch operations to prevent double spending.

---

## **Smart Contract Functions**
### Admin Management
- **`add_admin`**: Add a new admin to the wallet.
- **`remove_admin`**: Remove an existing admin with checks to prevent wallet lockout.
- **`recover_admin`**: Add a new admin if keys are lost.

### Transaction Handling
- **`create_transaction`**: Create a new transaction with a 24-hour expiry.
- **`confirm_transaction`**: Confirm a transaction, tracking multiple approvals.
- **`execute_transaction`**: Execute a transaction if it has sufficient confirmations.
- **`cancel_transaction`**: Mark a transaction as canceled to prevent execution.

### Meta-Confirmation and Cross-Chain Support
- **`meta_confirm_transaction`**: Allow third-party relayers to confirm transactions.
- **`initiate_cross_chain_transaction`**: Placeholder for cross-chain asset transfers using LayerZero protocol.

---

## **Usage Instructions**

### **1. Deploy the Contract**
Deploy the `AptosEdge` smart contract on the Aptos blockchain using your development environment (such as **Aptos CLI** or **Move Studio**). Ensure your wallet has the necessary permissions and gas.

### **2. Create a Multisig Wallet**
```move
create_multisig(&signer, vector[admin1, admin2], 2);
```
This command creates a wallet requiring 2 confirmations from the specified admins to execute transactions.

### **3. Create a Transaction**
```move
create_transaction(&signer, multisig_wallet_address, 1000, recipient_address);
```
Creates a transaction to transfer **1000 AptosCoin** to a recipient.

### **4. Confirm and Execute Transaction**
Admins can confirm transactions as follows:
```move
confirm_transaction(&signer, multisig_wallet_address, tx_id);
```
Once confirmed, any admin can execute the transaction:
```move
execute_transaction(&signer, multisig_wallet_address, tx_id);
```

---

## **Error Handling**
| **Error Code**                 | **Description**                                |
|--------------------------------|------------------------------------------------|
| `E_DOES_NOT_OWN_MULTISIG`      | User does not own the multisig wallet.         |
| `E_CONFIRMATION_NOT_VALID`     | Invalid number of required confirmations.      |
| `E_NOT_ENOUGH_CONFIRMATION`    | Transaction lacks sufficient confirmations.    |
| `E_RESOURCE_ACCOUNT_DOES_NOT_HAVE_ENOUGH_MONEY` | Insufficient funds for the transaction. |
| `E_TRANSACTION_EXPIRED`        | Transaction has expired and cannot be executed.|
| `E_ADDRESS_IS_NOT_ADMIN`       | Address is not a registered admin.             |

---

## **Testing and Security Recommendations**
1. **Unit Tests**: Thoroughly test each function with different scenarios (e.g., edge cases like removing admins).
2. **Audit**: Conduct a **third-party security audit** to identify and fix any vulnerabilities.
3. **Gas Optimization**: Ensure optimized gas usage, especially during batch transactions.
4. **Social Recovery**: Add a trusted set of recovery addresses for future resilience.

---

## **Future Roadmap**
- **Full Cross-Chain Integration**: Complete LayerZero or other bridge integration.
- **Social Recovery Mechanism**: Implement for admin key loss recovery.
- **UI/UX Enhancements**: Develop a web-based interface for easy wallet management.

---

## **Contributing**
We welcome contributions! Please follow these steps:
1. Fork the repository and create a new branch.
2. Make your changes and commit with clear messages.
3. Submit a pull request, ensuring all tests pass.

---

## **License**
AptosEdge is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more details.

---

## **Contact and Support**
For any issues or inquiries, please reach out through:
- **Discord**: [AptosEdge Community](#)
- **Twitter**: [@AptosEdge](#)
- **Email**: support@aptosedge.com

---

## **Acknowledgments**
Special thanks to the Aptos blockchain ecosystem and LayerZero for inspiration and support in building this project.

---

This **README** ensures a complete overview of your project, explaining its features, usage, and development flow. It is now ready for public release and contribution!