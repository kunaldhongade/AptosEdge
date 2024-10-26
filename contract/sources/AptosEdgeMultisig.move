module my_addrx::AptosEdgeMultisig {
    use std::signer;
    use std::vector;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::{AptosCoin};
    use std::option::Option;
    use std::string::String;
    use aptos_framework::account::{Self, SignerCapability};
    use aptos_std::table;
    use std::event;
    use std::timestamp;
    
    const E_DOES_NOT_OWN_MULTISIG: u64 = 0;
    const E_CONFIRMATION_NOT_VALID: u64 = 1;
    const E_U_NOT_MULTISIG_ADMIN: u64 = 2;
    const E_NOT_ENOUGH_CONFIRMATION: u64 = 3;
    const E_RESOURCE_ACCOUNT_DOES_NOT_HAVE_ENOUGH_MONEY: u64 = 4;
    const E_ADDRESS_IS_NOT_ADMIN: u64 = 5;
    const E_TRANSACTION_EXPIRED: u64 = 6;
    
    #[event]
    struct Transaction has store, copy, drop {
        amount: u64,
        to: address,
        sender: address,
        executed: bool,
        confirmation: u64,
        expiry: u64,
    }

    struct MultiSig has key {
        signer_cap: SignerCapability,
        admins: vector<address>,
        transactions: table::Table<u64, Transaction>,
        tx_index: u64,
        confirmationNeeded: u64,
    }

    public entry fun create_multisig(acc: &signer, admins: vector<address>, confirmationNeeded: u64) {
        let acc_addr = signer::address_of(acc);
        let (_, resource_signer_cap) = account::create_resource_account(acc, b"SECRET_SEED");
        assert!(confirmationNeeded <= vector::length<address>(&admins), E_CONFIRMATION_NOT_VALID);
        move_to(acc, MultiSig {
            signer_cap: resource_signer_cap,
            admins: admins,
            transactions: table::new<u64, Transaction>(),
            tx_index: 0,
            confirmationNeeded: confirmationNeeded
        });
    }

    public entry fun add_admin(acc: &signer, admin: address) acquires MultiSig {
        let acc_addr = signer::address_of(acc);
        assert!(exists<MultiSig>(acc_addr), E_DOES_NOT_OWN_MULTISIG);

        let multi_sig = borrow_global_mut<MultiSig>(acc_addr);
        assert!(vector::contains<address>(&multi_sig.admins, &acc_addr), E_U_NOT_MULTISIG_ADMIN);
        vector::push_back<address>(&mut multi_sig.admins, admin);
    }

    public entry fun remove_admin(acc: &signer, admin: address) acquires MultiSig {
        let acc_addr = signer::address_of(acc);
        let multi_sig = borrow_global_mut<MultiSig>(acc_addr);
        assert!(vector::length(&multi_sig.admins) > 1, E_DOES_NOT_OWN_MULTISIG);
        
        let (status, admin_index) = vector::index_of<address>(&multi_sig.admins, &admin);
        assert!(status, E_ADDRESS_IS_NOT_ADMIN);
        vector::remove<address>(&mut multi_sig.admins, admin_index);
    }


    public entry fun create_transaction(
        acc: &signer,
        multisig_creator: address,
        amount: u64,
        to: address
    ) acquires MultiSig {
        let acc_addr = signer::address_of(acc);
        assert!(exists<MultiSig>(multisig_creator), E_DOES_NOT_OWN_MULTISIG);

        let multi_sig = borrow_global_mut<MultiSig>(multisig_creator);
        assert!(vector::contains<address>(&multi_sig.admins, &acc_addr), E_U_NOT_MULTISIG_ADMIN);

        let transaction = Transaction {
            amount: amount,
            sender: acc_addr,
            to: to,
            expiry: timestamp::now_seconds() + 86400,  // 1 day expiry
            executed: false,
            confirmation: 0
        };

        event::emit(transaction);

        table::add<u64, Transaction>(&mut multi_sig.transactions, multi_sig.tx_index, transaction);
        multi_sig.tx_index = multi_sig.tx_index + 1;
    }

    public entry fun confirm_transaction(acc: &signer, multisig_creator: address, tx: u64) acquires MultiSig {
        let multi_sig = borrow_global_mut<MultiSig>(multisig_creator);
        let transaction = table::borrow_mut<u64, Transaction>(&mut multi_sig.transactions, tx);
        transaction.confirmation = transaction.confirmation + 1;

        event::emit(Transaction {
            amount: transaction.amount,
            to: transaction.to,
            sender: signer::address_of(acc),
            executed: false,
            expiry: transaction.expiry,
            confirmation: transaction.confirmation
        });
}


    public entry fun execute_transaction(
        acc: &signer,
        multisig_creator: address,
        tx: u64
    ) acquires MultiSig {
        let acc_addr = signer::address_of(acc);
        assert!(exists<MultiSig>(multisig_creator), E_DOES_NOT_OWN_MULTISIG);
       

        let multi_sig = borrow_global_mut<MultiSig>(multisig_creator);
        assert!(vector::contains<address>(&multi_sig.admins, &acc_addr), E_U_NOT_MULTISIG_ADMIN);

        let transaction = table::borrow_mut<u64, Transaction>(&mut multi_sig.transactions, tx);
        assert!(transaction.confirmation >= multi_sig.confirmationNeeded, E_NOT_ENOUGH_CONFIRMATION);

        let resource_signer = account::create_signer_with_capability(&multi_sig.signer_cap);

        assert!(
            coin::balance<AptosCoin>(signer::address_of(&resource_signer)) > transaction.amount,
            E_RESOURCE_ACCOUNT_DOES_NOT_HAVE_ENOUGH_MONEY
        );

        assert!(timestamp::now_seconds() < transaction.expiry, E_TRANSACTION_EXPIRED);

        // Execute
        coin::transfer<AptosCoin>(&resource_signer, transaction.to, transaction.amount);
    }

    public entry fun execute_batch_transactions(
        acc: &signer, 
        multisig_creator: address, 
        tx_ids: vector<u64>
    ) acquires MultiSig {
        let multi_sig = borrow_global_mut<MultiSig>(multisig_creator);
        let i = 0;
        while (i < vector::length(&tx_ids)) {
            let tx = *vector::borrow(&tx_ids, i);
            let transaction = table::borrow_mut<u64, Transaction>(&mut multi_sig.transactions, tx);
            assert!(transaction.confirmation >= multi_sig.confirmationNeeded, E_NOT_ENOUGH_CONFIRMATION);
            coin::transfer<AptosCoin>(&account::create_signer_with_capability(&multi_sig.signer_cap), transaction.to, transaction.amount);
            transaction.executed = true;
            i = i + 1;
        }
    }

    public entry fun recover_admin(
        acc: &signer,
         multisig_creator: address, 
         new_admin: address
    ) acquires MultiSig {
        let multi_sig = borrow_global_mut<MultiSig>(multisig_creator);
        assert!(vector::contains<address>(&multi_sig.admins, &signer::address_of(acc)), E_U_NOT_MULTISIG_ADMIN);
        vector::push_back<address>(&mut multi_sig.admins, new_admin);
    }

    public entry fun propose_threshold_change(
        acc: &signer, 
        multisig_creator: address, 
        new_threshold: u64
    ) acquires MultiSig {
        let multi_sig = borrow_global_mut<MultiSig>(multisig_creator);
        assert!(vector::contains<address>(&multi_sig.admins, &signer::address_of(acc)), E_U_NOT_MULTISIG_ADMIN);
        assert!(new_threshold <= vector::length(&multi_sig.admins), E_CONFIRMATION_NOT_VALID);
        multi_sig.confirmationNeeded = new_threshold;
    }

    public entry fun meta_confirm_transaction(
        approver: address, 
        multisig_creator: address, 
        tx: u64
    ) acquires MultiSig {
        let multi_sig = borrow_global_mut<MultiSig>(multisig_creator);
        assert!(vector::contains<address>(&multi_sig.admins, &approver), E_U_NOT_MULTISIG_ADMIN);

        let transaction = table::borrow_mut<u64, Transaction>(&mut multi_sig.transactions, tx);
        transaction.confirmation = transaction.confirmation + 1;

        event::emit(Transaction {
            amount: transaction.amount,
            to: transaction.to,
            sender: approver,
            expiry: transaction.expiry,
            executed: transaction.executed,
            confirmation: transaction.confirmation
        });
    }

    public entry fun initiate_cross_chain_transaction(
        acc: &signer, 
        to_chain: u64, 
        to: address, 
        amount: u64
    ) acquires MultiSig {
        let acc_addr = signer::address_of(acc);
        let multi_sig = borrow_global_mut<MultiSig>(acc_addr);

        // Logic to initiate cross-chain transfer using LayerZero protocol.
        let resource_signer = account::create_signer_with_capability(&multi_sig.signer_cap);
        coin::transfer<AptosCoin>(&resource_signer, to, amount);  // Example logic, extend for LayerZero.
    }

    public entry fun cancel_transaction(acc: &signer, multisig_creator: address, tx: u64) acquires MultiSig {
        let acc_addr = signer::address_of(acc);
        let multi_sig = borrow_global_mut<MultiSig>(multisig_creator);
        assert!(vector::contains<address>(&multi_sig.admins, &acc_addr), E_U_NOT_MULTISIG_ADMIN);

        let transaction = table::borrow_mut<u64, Transaction>(&mut multi_sig.transactions, tx);
        transaction.executed = true;  // Mark as "canceled"
    }

    #[view]
    public fun get_admins(multisig_creator: address): vector<address> acquires MultiSig {
        let multi_sig = borrow_global<MultiSig>(multisig_creator);
        multi_sig.admins
    }

    #[view]
    public fun get_confirmation_threshold(multisig_creator: address): u64 acquires MultiSig {
        let multi_sig = borrow_global<MultiSig>(multisig_creator);
        multi_sig.confirmationNeeded
    }

    #[view]
    public fun get_wallet_balance(multisig_creator: address): u64 {
        coin::balance<AptosCoin>(multisig_creator)
    }

    #[view]
    public fun get_transaction_count(multisig_creator: address): u64 acquires MultiSig {
        let multi_sig = borrow_global<MultiSig>(multisig_creator);
        multi_sig.tx_index
    }

    #[view]
    public fun get_transaction_confirmation_count(multisig_creator: address, tx_id: u64): u64 acquires MultiSig {
        let multi_sig = borrow_global<MultiSig>(multisig_creator);
        let transaction = table::borrow<u64, Transaction>(&multi_sig.transactions, tx_id);
        transaction.confirmation
    }

    #[view]
    public fun is_admin(multisig_creator: address, addr: address): bool acquires MultiSig {
        let multi_sig = borrow_global<MultiSig>(multisig_creator);
        vector::contains<address>(&multi_sig.admins, &addr)
    }

    #[view]
    public fun get_pending_transactions(multisig_creator: address): vector<Transaction> acquires MultiSig {
        let multi_sig = borrow_global<MultiSig>(multisig_creator);
        let  pending_tx = vector::empty<Transaction>();
        let  i = 0;

        // Iterate through all transaction indexes
        while (i < multi_sig.tx_index) {
            if (table::contains<u64, Transaction>(&multi_sig.transactions, i)) {
                let tx = table::borrow<u64, Transaction>(&multi_sig.transactions, i);
                if (!tx.executed) {
                    vector::push_back(&mut pending_tx, *tx);
                };
            };
            i = i + 1;
        };
        pending_tx
    }

    #[view]
    public fun get_transaction_details(multisig_creator: address, tx_id: u64): Transaction acquires MultiSig {
        let multi_sig = borrow_global<MultiSig>(multisig_creator);
        
        if (table::contains<u64, Transaction>(&multi_sig.transactions, tx_id)) {
            let tx = table::borrow<u64, Transaction>(&multi_sig.transactions, tx_id);
            *tx  // Return the transaction if it exists
        } else {
            // Return a default "null" transaction if the ID doesn't exist
            Transaction {
                amount: 0,
                to: @0x0,  // Address 0 to indicate invalid
                sender: @0x0,
                executed: false,
                confirmation: 0,
                expiry: 0
            }
        }
    }
}