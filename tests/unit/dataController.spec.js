import DataController from '../../src/DataController'
var sinon = require('sinon');
import { expect } from 'chai';

describe('DataController', () => {
    var stubApi = {};

    beforeEach(() => {
        stubApi = {};
        stubApi.post = function propFn() {
            return new Promise(resolve => {
                resolve(null)
            })
        };
        stubApi.get = function propFn() {
            return new Promise(resolve => {
                resolve(null)
            })
        };
    });

    it('can register a User', async () => {
        var agentAnimal = 'AgentAnimal'
        sinon.stub(stubApi, "get").withArgs("client/new").callsFake(function fakeFn() {
            return new Promise(resolve => {
                resolve({
                    data: agentAnimal
                })
            })
        });
        var datacontroller = new DataController(stubApi)
        var responseAgentAnimal = await datacontroller.registerUser()

        expect(agentAnimal).to.equal(responseAgentAnimal)
        expect(agentAnimal).to.equal(datacontroller.agentId)
    });

    it('can retrieve a list of accesses', async () => {
        var agentAnimal = 'AgentAnimal'
        var response =  { Ok: { 
            items: []
        }}

        sinon.stub(stubApi, "get").withArgs(`client/call/get_accesses/${agentAnimal}`).callsFake(function fakeFn() {
            return new Promise(resolve => {
                resolve({
                    data: response
                })
            })
        });

        var datacontroller = new DataController(stubApi,agentAnimal)
        var responseAccesses = await datacontroller.getAccesses()

        expect(response).to.equal(responseAccesses)
    });

    it('cannot retrieve accesses when user is not yet registered', async () => {
        var rejectMessage = "This client is not registered at the server."

        var datacontroller = new DataController(stubApi)
        await datacontroller.getAccesses().catch((err) => { 
            expect(rejectMessage).to.equal(err)
        });
    });

    it('can create an access', async () => {
        var agentAnimal = 'AgentAnimal'
        var response =  { Ok: { 
            addr: "linkAddr"
        }}
        var access = { 
            name: "test",
            desc: "test"
        }

        sinon.stub(stubApi, "post").withArgs(`client/call/create_access/${agentAnimal}`).callsFake(function fakeFn() {
            return new Promise(resolve => {
                resolve({
                    data: response
                })
            })
        });
        var datacontroller = new DataController(stubApi, agentAnimal)
        var responseCreating = await datacontroller.createAccess(access)

        expect(response).to.equal(responseCreating)
    });

    it('cannot create an access when user is not yet registered', async () => {
        var access = { 
            name: "test",
            desc: "test"
        }
        var rejectMessage = "This client is not registered at the server."

        var datacontroller = new DataController(stubApi)
        await datacontroller.createAccess(access).catch((err) => { 
            expect(rejectMessage).to.equal(err)
        });
    });

    it('can share an access', async () => {
        var agentAnimal = 'AgentAnimal'
        var response =  { Ok: { 
            addr: "linkAddr"
        }}
        var access = { 
            name: "test",
            desc: "test"
        }

        sinon.stub(stubApi, "post").withArgs(`client/call/send_access/${agentAnimal}`).callsFake(function fakeFn() {
            return new Promise(resolve => {
                resolve({
                    data: response
                })
            })
        });
        var datacontroller = new DataController(stubApi, agentAnimal)
        var responseSharing = await datacontroller.shareAccess(access)

        expect(response).to.equal(responseSharing)
    });

    it('cannot share an access when user is not yet registered', async () => {
        var access = { 
            name: "test",
            desc: "test"
        }
        var rejectMessage = "This client is not registered at the server."

        var datacontroller = new DataController(stubApi)
        await datacontroller.shareAccess(access).catch((err) => { 
            expect(rejectMessage).to.equal(err)
        });
    });
})