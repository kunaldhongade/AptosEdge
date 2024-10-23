module my_addrx::MicroInsuranceSystem {
    use std::coin::{transfer};
    use std::aptos_coin::AptosCoin;
    use std::signer;
    use std::string::String;
    use std::vector;

    const ERR_POLICY_NOT_FOUND: u64 = 1;
    const ERR_NOT_CUSTOMER: u64 = 2;
    const ERR_PREMIUM_NOT_PAID: u64 = 3;
    const ERR_CLAIM_ALREADY_MADE: u64 = 4;
    const ERR_NO_POLICIES: u64 = 5;
    const ERR_ALREADY_INITIALIZED: u64 = 6;
    const ERR_CLAIM_NOT_ALLOWED: u64 = 7;
    const ERR_UNAUTHORIZED: u64 = 8;

    const Global_Policy_List: address = @sys_addrx;

    struct CustomerPolicy has key, store, copy, drop {
        customer: address,
        premium_paid: bool,
        is_claimed: bool,
        is_requested: bool,  
        is_verified: bool,    
    }

    struct Policy has key, store, copy, drop {
        id: u64,
        creator: address,  
        description: String,
        premium_amount: u64,
        yearly: bool,  // If true, this is a yearly policy; if false, it's a one-time payment.
        total_premium_collected: u64,
        max_claimable: u64,
        claimable_amount: u64,
        type_of_policy: String,  // Type of the policy (e.g., "health", "auto", etc.)
        customers: vector<CustomerPolicy>, 
    }

    struct GlobalPolicyCollection has key, store, copy, drop {
        policies: vector<Policy>,
        last_policy_id: u64,
    }

    public entry fun init_global_policy_system(account: &signer) {
        let global_address = Global_Policy_List;

        if (exists<GlobalPolicyCollection>(global_address)) {
            abort(ERR_ALREADY_INITIALIZED)
        };

        let policy_collection = GlobalPolicyCollection {
            policies: vector::empty<Policy>(),
            last_policy_id: 1000,
        };

        move_to(account, policy_collection);
    }

    public entry fun create_policy(
        account: &signer,
        description: String,
        premium_amount: u64,
        yearly: bool,
        max_claimable: u64,
        type_of_policy: String  
    ) acquires GlobalPolicyCollection {
        let global_address = Global_Policy_List;
        assert!(exists<GlobalPolicyCollection>(global_address), ERR_NO_POLICIES);

        let collection_ref = borrow_global_mut<GlobalPolicyCollection>(global_address);

        let policy_id = collection_ref.last_policy_id + 1;
        let new_policy = Policy {
            id: policy_id,
            creator: signer::address_of(account),
            description: description,
            premium_amount: premium_amount,
            yearly: yearly,
            total_premium_collected: 0,
            max_claimable: max_claimable,
            claimable_amount: max_claimable,
            type_of_policy: type_of_policy,
            customers: vector::empty<CustomerPolicy>(),
        };

        vector::push_back(&mut collection_ref.policies, new_policy);
        collection_ref.last_policy_id = policy_id;
    }

    public entry fun purchase_policy(
        account: &signer,
        policy_id: u64
    ) acquires GlobalPolicyCollection {
        let buyer = signer::address_of(account);
        let global_address = Global_Policy_List;

        assert!(exists<GlobalPolicyCollection>(global_address), ERR_NO_POLICIES);

        let collection_ref = borrow_global_mut<GlobalPolicyCollection>(global_address);
        let policies_len = vector::length(&collection_ref.policies);
        let i = 0;

        while (i < policies_len) {
            let policy_ref = vector::borrow_mut(&mut collection_ref.policies, i);
            if (policy_ref.id == policy_id) {
                let amount_to_pay = policy_ref.premium_amount;

                transfer<AptosCoin>(account, policy_ref.creator, amount_to_pay);
                policy_ref.total_premium_collected = policy_ref.total_premium_collected + amount_to_pay;
                
                let customer_policy = CustomerPolicy {
                    customer: buyer,
                    premium_paid: true,
                    is_claimed: false,
                    is_requested: false, 
                    is_verified: false,  
                };
                vector::push_back(&mut policy_ref.customers, customer_policy);
                return
            };
            i = i + 1;
        };
        abort(ERR_POLICY_NOT_FOUND)
    }

    public entry fun request_claim(
        account: &signer,
        policy_id: u64
    ) acquires GlobalPolicyCollection {
        let claimant = signer::address_of(account);
        let global_address = Global_Policy_List;

        assert!(exists<GlobalPolicyCollection>(global_address), ERR_NO_POLICIES);

        let collection_ref = borrow_global_mut<GlobalPolicyCollection>(global_address);
        let policies_len = vector::length(&collection_ref.policies);
        let i = 0;

        while (i < policies_len) {
            let policy_ref = vector::borrow_mut(&mut collection_ref.policies, i);
            if (policy_ref.id == policy_id) {
                let customers_len = vector::length(&policy_ref.customers);
                let j = 0;
                let is_customer = false;

                while (j < customers_len) {
                    let customer_policy = vector::borrow_mut(&mut policy_ref.customers, j);
                    if (customer_policy.customer == claimant) {
                        is_customer = true;
                        assert!(customer_policy.premium_paid, ERR_PREMIUM_NOT_PAID);
                        assert!(!customer_policy.is_claimed, ERR_CLAIM_ALREADY_MADE);
                        customer_policy.is_requested = true;
                        customer_policy.is_verified = false;
                        return
                    };
                    j = j + 1;
                };

                assert!(is_customer, ERR_NOT_CUSTOMER);
            };
            i = i + 1;
        };
        abort(ERR_POLICY_NOT_FOUND)
    }

    public entry fun verify_claim(
        account: &signer,
        policy_id: u64,
        customer: address
    ) acquires GlobalPolicyCollection {
        let verifier = signer::address_of(account);
        let global_address = Global_Policy_List;

        assert!(exists<GlobalPolicyCollection>(global_address), ERR_NO_POLICIES);

        let collection_ref = borrow_global_mut<GlobalPolicyCollection>(global_address);
        let policies_len = vector::length(&collection_ref.policies);
        let i = 0;

        while (i < policies_len) {
            let policy_ref = vector::borrow_mut(&mut collection_ref.policies, i);
            if (policy_ref.id == policy_id) {
                assert!(policy_ref.creator == verifier, ERR_UNAUTHORIZED);

                let customers_len = vector::length(&policy_ref.customers);
                let j = 0;

                while (j < customers_len) {
                    let customer_policy = vector::borrow_mut(&mut policy_ref.customers, j);
                    if (customer_policy.customer == customer) {
                        assert!(customer_policy.premium_paid, ERR_PREMIUM_NOT_PAID);
                        assert!(customer_policy.is_requested, ERR_CLAIM_NOT_ALLOWED);
                        assert!(!customer_policy.is_claimed, ERR_CLAIM_ALREADY_MADE);

                        customer_policy.is_verified = true;
                        return
                    };
                    j = j + 1;
                };
                abort(ERR_NOT_CUSTOMER)
            };
            i = i + 1;
        };
        abort(ERR_POLICY_NOT_FOUND)
    }

    public entry fun payout_claim(
        account: &signer,
        policy_id: u64
    ) acquires GlobalPolicyCollection {
        let global_address = Global_Policy_List;
        let creator = signer::address_of(account);

        assert!(exists<GlobalPolicyCollection>(global_address), ERR_NO_POLICIES);

        let collection_ref = borrow_global_mut<GlobalPolicyCollection>(global_address);
        let policies_len = vector::length(&collection_ref.policies);
        let i = 0;

        while (i < policies_len) {
            let policy_ref = vector::borrow_mut(&mut collection_ref.policies, i);
            if (policy_ref.id == policy_id) {
                assert!(policy_ref.creator == creator, ERR_UNAUTHORIZED);

                let customers_len = vector::length(&policy_ref.customers);
                let j = 0;

                while (j < customers_len) {
                    let customer_policy = vector::borrow_mut(&mut policy_ref.customers, j);
                    if (customer_policy.is_verified && !customer_policy.is_claimed) {
                        let claimable = policy_ref.claimable_amount;
                        transfer<AptosCoin>(account, customer_policy.customer, claimable);

                        policy_ref.claimable_amount = 0;
                        customer_policy.is_claimed = true;
                        return
                    };
                    j = j + 1;
                };
                abort(ERR_CLAIM_NOT_ALLOWED)
            };
            i = i + 1;
        };
        abort(ERR_POLICY_NOT_FOUND)
    }

    #[view]
    public fun view_all_policies(): vector<Policy> acquires GlobalPolicyCollection {
        let global_address = Global_Policy_List;
        assert!(exists<GlobalPolicyCollection>(global_address), ERR_NO_POLICIES);

        let collection_ref = borrow_global<GlobalPolicyCollection>(global_address);
        collection_ref.policies
    }

    #[view]
    public fun view_policy_by_id(policy_id: u64): Policy acquires GlobalPolicyCollection {
        let global_address = Global_Policy_List;
        assert!(exists<GlobalPolicyCollection>(global_address), ERR_NO_POLICIES);

        let collection_ref = borrow_global<GlobalPolicyCollection>(global_address);
        let policies_len = vector::length(&collection_ref.policies);
        let i = 0;
        
        while (i < policies_len) {
            let policy_ref = vector::borrow(&collection_ref.policies, i);
            if (policy_ref.id == policy_id) {
                return *policy_ref
            };
            i = i + 1;
        };
        abort(ERR_POLICY_NOT_FOUND)
    }

    #[view]
    public fun view_policies_by_creator(creator: address): vector<Policy> acquires GlobalPolicyCollection {
        let global_address = Global_Policy_List;
        assert!(exists<GlobalPolicyCollection>(global_address), ERR_NO_POLICIES);

        let collection_ref = borrow_global<GlobalPolicyCollection>(global_address);
        let result = vector::empty<Policy>();

        let policies_len = vector::length(&collection_ref.policies);
        let i = 0;

        while (i < policies_len) {
            let policy_ref = vector::borrow(&collection_ref.policies, i);
            if (policy_ref.creator == creator) {
                vector::push_back(&mut result, *policy_ref);
            };
            i = i + 1;
        };
        result
    }

    #[view]
    public fun view_policies_by_customer(customer: address): vector<Policy> acquires GlobalPolicyCollection {
        let global_address = Global_Policy_List;
        assert!(exists<GlobalPolicyCollection>(global_address), ERR_NO_POLICIES);

        let collection_ref = borrow_global<GlobalPolicyCollection>(global_address);
        let result = vector::empty<Policy>();

        let policies_len = vector::length(&collection_ref.policies);
        let i = 0;

        while (i < policies_len) {
            let policy_ref = vector::borrow(&collection_ref.policies, i);
            let customers_len = vector::length(&policy_ref.customers);
            let j = 0;

            while (j < customers_len) {
                let customer_policy = vector::borrow(&policy_ref.customers, j);
                if (customer_policy.customer == customer) {
                    vector::push_back(&mut result, *policy_ref);
                    break
                };
                j = j + 1;
            };
            i = i + 1;
        };
        result
    }
}
