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
    error::ZomeApiResult,
};
use hdk::holochain_core_types::{
    cas::content::Address, entry::Entry, dna::entry_types::Sharing, error::HolochainError, json::JsonString, hash::HashString
    validation::EntryValidationData
};

// see https://developer.holochain.org/api/0.0.8-alpha/hdk/ for info on using the hdk library

// This is a sample zome that defines an entry type "MyEntry" that can be committed to the
// agent's chain via the exposed function create_my_entry


// Entities
#[derive(Serialize, Deserialize, Debug, DefaultJson,Clone)]
pub struct Access {
    deviceId: String,
    deviceType: String,
    deviceName: String,
    publicKey: String,
    description: String,
    transactionHash: HashString,
    timeRestriction: String
    //// The following Attributes are going to be established via DHT Links and therefore declared here ////
    // owner: HashString,
    // recipient: [HashString],
    //// Token should be private and not in the DHT ////
    // token: HashString,
}

#[derive(Serialize, Deserialize, Debug, DefaultJson,Clone)]
pub struct User {
    telephoneNumber: String
}

pub fn handle_create_access(access: Access) -> ZomeApiResult<Address> {
    let access = Entry::App("access".into(), access.into());
    let address = hdk::commit_entry(&access)?;
    hdk::link_entries(&address, &hdk::AGENT_ADDRESS, "owner")?;
    Ok(address)
}

pub fn handle_send_access(access_addr: Address, recipient_addr: Address) -> ZomeApiResult<Address> {
    hdk::link_entries(&recipient_addr, &access_addr, "recipient")?;
    Ok(recipient_addr)
}

pub fn handle_get_my_accesses(address: Address) -> ZomeApiResult<Vec<Access>> {
    // try and load the list items, filter out errors and collect in a vector
    let list_accesses = hdk::get_links(&hdk::AGENT_ADDRESS, "recipient")?.addresses()
        .iter()
        .map(|item_address| {
            hdk::utils::get_as_type::<Access>(item_address.to_owned())
        })
        .filter_map(Result::ok)
        .collect::<Vec<Access>>();

    // if this was successful then return the list items
    Ok(list_accesses)
}

fn definition() -> Vec<ValidatingEntryType> {[
    entry!(
        name: "access",
        description: "the shared Access object which gets linked to all users that have been granted access to it",
        sharing: Sharing::Public,
        validation_package: || {
            hdk::ValidationPackageDefinition::Entry
        },

        validation: | _validation_data: hdk::EntryValidationData<Access>| {
            Ok(())
        }
    ),
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
]}

define_zome! {
    entries: [
       definition()
    ]

    genesis: || { Ok(()) }

    functions: [
        create_access: {
            inputs: |entry: Access|,
            outputs: |result: ZomeApiResult<Address>|,
            handler: handle_create_access
        }
        send_access: {
            inputs: |access_addr: Address, recipient_addr: Address|,
            outputs: |result: ZomeApiResult<Address>|,
            handler: handle_send_access
        }
        get_my_accesses: {
            inputs: |address: Address|,
            outputs: |result: ZomeApiResult<Option<Entry>>|,
            handler: handle_get_my_accesses
        }
    ]

    traits: {
        hc_public [create_access,send_access,get_my_accesses]
    }
}
