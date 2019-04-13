// This test file uses the tape testing framework.
// To learn more, go here: https://github.com/substack/tape
const { Config, Scenario } = require("@holochain/holochain-nodejs")
Scenario.setTape(require("tape"))

const dnaPath = "./dist/hApp.dna.json"
const dna = Config.dna(dnaPath, "happs")
const agentAlice = Config.agent("alice")
const agentBob = Config.agent('bob')
const instanceAlice = Config.instance(agentAlice, dna)
const instanceBob = Config.instance(agentBob, dna)
const scenario = new Scenario([instanceAlice, instanceBob])

const access = { 
  access: {
    device_id: 'test device',
    device_type: 'test device type',
    device_name: 'test device name',
    public_key: 'test public key',
    description: 'test description',
    transaction_hash: '',
    time_restriction: '',
  }
}

scenario.runTape('Can create an lock', async (t, { alice }) => {
  const createResult = await alice.callSync('accesses', 'create_lock', { lock: { id: "TestLock" } })
  
  t.notEqual(createResult.Ok, undefined)
  if (createResult.Err) { console.log(createResult.Err) }
})

scenario.runTape('Can create an access', async (t, { alice }) => {
  const createResult = await alice.callSync('accesses', 'create_access', access)
  
  t.notEqual(createResult.Ok, undefined)
  if (createResult.Err) { console.log(createResult.Err) }
})

scenario.runTape('Can get a list of my accesses', async (t, { alice }) => {
  const createResult = await alice.callSync('accesses', 'create_access', access)

  const getResult = await alice.callSync('accesses', 'get_my_accesses', { })

  t.equal(getResult.Ok.items.length, 1, 'Alice should have her own Access in the shared Access list')
  if (getResult.Err) { console.log(getResult.Err) }

  const createResult2 = await alice.callSync('accesses', 'create_access', access)
  t.equal(createResult2.Err.Internal, "Lock ID exists already. Can't create a duplicate.", 'Alice cant create an access with an a already registered device id')
  
  const getResult2 = await alice.callSync('accesses', 'get_my_accesses', { })
  t.equal(getResult2.Ok.items.length, 1, 'Alice should still have only 1 entry in the shared Access list')
  if (createResult2.Err) { console.log(createResult.Err) }
})

scenario.runTape('Can share an access', async (t, { alice, bob }) => {
  const createResult = await alice.callSync('accesses', 'create_access', access)
  const accessAddr = createResult.Ok

  const shareResult = await alice.callSync('accesses', 'send_access', { access_addr: accessAddr, recipient_addr: bob.agentId})
  if (shareResult.Err) { console.log("Share: ",shareResult.Err) }

  const getResult = await bob.callSync('accesses', 'get_my_accesses', { })
  if (getResult.Err) { console.log("Get: ",getResult.Err) }

  t.equal(getResult.Ok.items.length, 1, 'Bob should have 1 shared Access in the list')
  if (createResult.Err) { console.log(createResult.Err) }
})