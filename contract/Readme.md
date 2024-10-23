# MicroInsuranceSystem Smart Contract

## Overview

This Move module provides a decentralized micro-insurance system, enabling users to purchase insurance policies, claim payouts, and manage insurance policies through smart contracts on the Aptos blockchain. The module features global storage for policies and includes essential insurance functionalities such as policy creation, premium payments, claim requests, verification, and payouts.

## Key Features

- **Global Policy Management**: Stores all policies under a single global address.
- **Policy Creation**: Allows creators to issue new policies with parameters like premium amount, policy type, and maximum claimable amount.
- **Policy Purchase**: Customers can purchase a pre-defined insurance policy by paying the specified premium.
- **Claim Process**: Insured customers can request and receive claim payouts upon verification.
- **Claim Verification**: Policy creators verify and approve customer claims.
- **Views for Policies**: Customers and creators can view policies based on ID, creator, or customer.

## Installation & Usage

### 1. Initialize Global Policy System

Before creating or managing policies, the global policy system must be initialized by invoking:

```move
init_global_policy_system(account: &signer)
```

This initializes a collection that will store all policies.

### 2. Create a New Policy

Creators can define new policies with attributes such as description, premium amount, payment frequency, and claimable limits:

```move
create_policy(
  account: &signer,
  description: String,
  premium_amount: u64,
  yearly: bool,
  max_claimable: u64,
  type_of_policy: String
)
```

### 3. Purchase a Policy

Users (customers) can purchase a policy by its unique ID. This action transfers the premium amount to the policy creator:

```move
purchase_policy(account: &signer, policy_id: u64)
```

### 4. Request a Claim

After purchasing a policy, customers can request a claim under the policy:

```move
request_claim(account: &signer, policy_id: u64)
```

### 5. Verify a Claim

The policy creator must verify and approve a claim request:

```move
verify_claim(account: &signer, policy_id: u64, customer: address)
```

### 6. Payout for a Claim

Once a claim is verified, the policy creator can initiate the payout process, transferring the claimable amount to the customer:

```move
payout_claim(account: &signer, policy_id: u64)
```

### 7. View All Policies

Retrieve a list of all policies in the system:

```move
view_all_policies(): vector<Policy>
```

### 8. View Policy by ID

Retrieve a specific policy by its ID:

```move
view_policy_by_id(policy_id: u64): Policy
```

### 9. View Policies by Creator

Retrieve all policies created by a specific creator:

```move
view_policies_by_creator(creator: address): vector<Policy>
```

### 10. View Policies by Customer

Retrieve all policies a specific customer has purchased:

```move
view_policies_by_customer(customer: address): vector<Policy>
```

## Error Codes

- `ERR_POLICY_NOT_FOUND (1)`: The specified policy does not exist.
- `ERR_NOT_CUSTOMER (2)`: The caller is not a customer of the policy.
- `ERR_PREMIUM_NOT_PAID (3)`: The premium has not been paid for the policy.
- `ERR_CLAIM_ALREADY_MADE (4)`: The claim has already been made.
- `ERR_NO_POLICIES (5)`: No policies exist in the system.
- `ERR_ALREADY_INITIALIZED (6)`: The global policy system has already been initialized.
- `ERR_CLAIM_NOT_ALLOWED (7)`: The claim is not allowed (e.g., not verified).
- `ERR_UNAUTHORIZED (8)`: The caller is not authorized to perform the action.

## Dependencies

- **AptosCoin**: The contract utilizes the native Aptos coin for premium payments and claim payouts.
- **Std Modules**: Includes standard modules like `signer`, `string`, `vector`, and `coin`.
