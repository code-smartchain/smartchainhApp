#![feature(try_from)]
#[macro_use]
extern crate hdk;
extern crate serde;
#[macro_use]
extern crate serde_derive;
extern crate serde_json;
#[macro_use]
extern crate holochain_core_types_derive;

use hdk::{
    entry_definition::ValidatingEntryType,
    error::ZomeApiResult, error::ZomeApiError
};
use hdk::holochain_core_types::{
    cas::content::Address, entry::Entry, dna::entry_types::Sharing, error::HolochainError, json::JsonString, hash::HashString,
    validation::EntryValidationData
};

// see https://developer.holochain.org/api/0.0.8-alpha/hdk/ for info on using the hdk library

// This is a sample zome that defines an entry type "MyEntry" that can be committed to the
// agent's chain via the exposed function create_my_entry


// Entities
#[derive(Serialize, Deserialize, Debug, DefaultJson, Clone)]
pub struct Access {
    device_id: String,
    device_type: String,
    device_name: String,
    public_key: String,
    description: String,
    time_restriction: String
    //// The following Attributes are going to be established via DHT Links and therefore declared here ////
    // owner: HashString,
    // recipient: [HashString],
    //// Token should be private and not in the DHT ////
    // token: HashString,
}

#[derive(Serialize, Deserialize, Debug, DefaultJson, Clone)]
pub struct Lock {
    id: String
}

#[derive(Serialize, Deserialize, Debug, DefaultJson, Clone)]
pub struct User {
    telephone_number: String
}

#[derive(Serialize, Deserialize, Debug, DefaultJson, Clone)]
pub struct PublicAccess {
    access: Access,
    access_addr: Address,
    owner: bool,
    lock: Lock
}

#[derive(Serialize, Deserialize, Debug, DefaultJson)]
pub struct YourAccessesList {
    items: Vec<PublicAccess>
}

pub fn handle_create_lock(lock: Lock) -> ZomeApiResult<Address> {
    let lock_entry = Entry::App("lock".into(), lock.into());
    let address = hdk::commit_entry(&lock_entry)?;
    Ok(address)
}

pub fn handle_create_access(access: Access) -> ZomeApiResult<Address> {
    let lock_entry = Entry::App("lock".into(), Lock{ id: access.device_id.clone().into() }.into());
    let access_entry = Entry::App("access".into(), access.into());
    
    // See if the Lock Object mentioned in this Access Object has been already setup
    let interim_lock_adress = hdk::entry_address(&lock_entry)?;
    let lock = hdk::get_entry(&interim_lock_adress)?;

    if lock.is_some() == true {
        return Err(ZomeApiError::Internal("Lock ID exists already. Can't create a duplicate.".into()));
    };

    let lock_address = hdk::commit_entry(&lock_entry)?;
    let address = hdk::commit_entry(&access_entry)?;

    hdk::link_entries(&address, &hdk::AGENT_ADDRESS, "owner")?;
    hdk::link_entries(&hdk::AGENT_ADDRESS, &address, "recipient")?;
    hdk::link_entries(&address, &lock_address, "transaction")?;
    Ok(address)
}

pub fn handle_send_access(access_addr: HashString, recipient_addr: HashString) -> ZomeApiResult<Address> {
    hdk::link_entries(&recipient_addr, &access_addr, "recipient")?;
    Ok(recipient_addr)
}

pub fn handle_get_my_accesses() -> ZomeApiResult<YourAccessesList> {
    // try and load the list items, filter out errors and collect in a vector
    let list_accesses = hdk::get_links(&hdk::AGENT_ADDRESS, "recipient")?.addresses()
        .iter()
        .map(|item_address| -> ZomeApiResult<PublicAccess>{
            let access = hdk::utils::get_as_type::<Access>(item_address.to_owned()).unwrap();
            
            let owner = hdk::get_links(&item_address ,"owner").unwrap().addresses()[0].clone();
            let is_owner = &owner.to_string() == &hdk::AGENT_ADDRESS.to_string();

            let lock_address = hdk::get_links(&item_address ,"transaction").unwrap().addresses()[0].clone();
            let lock = hdk::utils::get_as_type::<Lock>(lock_address.to_owned()).unwrap();
            return Ok(PublicAccess{
                access: access,
                access_addr: item_address.to_owned(),
                owner: is_owner,
                lock: lock
            });
        })
        .filter_map(Result::ok)
        .collect::<Vec<PublicAccess>>();

    // if this was successful then return the list items
    Ok(YourAccessesList{
        items: list_accesses
    })
}

fn access_definition() -> ValidatingEntryType {
    entry!(
        name: "access",
        description: "the shared Access object which gets linked to all users that have been granted access to it",
        sharing: Sharing::Public,
        validation_package: || {
            hdk::ValidationPackageDefinition::Entry
        },

        validation: | _validation_data: hdk::EntryValidationData<Access>| {
            Ok(())
        },
        links: [
            to!(
                "%agent_id",
                tag: "owner",
                validation_package: || hdk::ValidationPackageDefinition::Entry,
                validation:  | _validation_data: hdk::LinkValidationData| {
                    Ok(())
                }
            ),
            to!(
                "lock",
                tag: "transaction",
                validation_package: || hdk::ValidationPackageDefinition::Entry,
                validation:  | _validation_data: hdk::LinkValidationData| {
                    Ok(())
                }
            ),
            from!(
                "%agent_id",
                tag: "recipient",
                validation_package: || hdk::ValidationPackageDefinition::Entry,
                validation:  | _validation_data: hdk::LinkValidationData| {
                    Ok(())
                }
            )
        ]
    )
}

fn user_definition() -> ValidatingEntryType {
    entry!(
        name: "user",
        description: "the absolute minimum of user data needed for the application",
        sharing: Sharing::Public,
        validation_package: || {
            hdk::ValidationPackageDefinition::Entry
        },

        validation: | _validation_data: hdk::EntryValidationData<User>| {
            Ok(())
        }
    )
}

fn lock_definition() -> ValidatingEntryType {
    entry!(
        name: "lock",
        description: "the lock object which must be unique accross the whole network",
        sharing: Sharing::Public,
        validation_package: || {
            hdk::ValidationPackageDefinition::Entry
        },

        validation: | _validation_data: hdk::EntryValidationData<Lock>| {
            Ok(())
        }
    )
}

define_zome! {
    entries: [
       access_definition(),
       user_definition(),
       lock_definition()
    ]

    genesis: || { Ok(()) }

    functions: [
        create_access: {
            inputs: |access: Access|,
            outputs: |result: ZomeApiResult<Address>|,
            handler: handle_create_access
        }
        send_access: {
            inputs: |access_addr: HashString, recipient_addr: HashString|,
            outputs: |result: ZomeApiResult<Address>|,
            handler: handle_send_access
        }
        get_my_accesses: {
            inputs: | |,
            outputs: |result: ZomeApiResult<YourAccessesList>|,
            handler: handle_get_my_accesses
        }
        create_lock: {
            inputs: |lock: Lock|,
            outputs: |result: ZomeApiResult<Address>|,
            handler: handle_create_lock
        }
    ]

    traits: {
        hc_public [create_access,send_access,get_my_accesses,create_lock]
    }
}
