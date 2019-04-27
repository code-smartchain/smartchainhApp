export default class DataController {
    constructor (api, agentId = null) {
        this.api = api
        this.agentId = agentId
    }

    post (url, params = {}) {
        // This function sends a POST request to the backend with the bearer authentication token
        return new Promise((resolve, reject) => {
            this.api.post(url, {...params})
            .then(resolve)
            .catch(reject)
        })
    }

    get (url) {
        // This function sends a GET request to the backend with the bearer authentication token
        return new Promise((resolve, reject) => {
            this.api.get(url)
            .then(resolve)
            .catch(reject)
        })
    }

    registerUser () {
        return new Promise((resolve, reject) => {
            this.get("client/new")
                .then(response => {
                    this.agentId = response.data
                    resolve(response.data)
                })
                .catch(error => {
                    this.agentId = "err"
                    reject("err")
                })
        })
    }

    getAccesses () {
        return new Promise((resolve, reject) => {
            if (this.agentId == null) {
                reject("This client is not registered at the server.")
            }
            
            this.get(`client/call/get_accesses/${this.agentId}`)
                .then(response => {
                    resolve(response.data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    }

    createAccess (parameters) {
        return new Promise((resolve, reject) => {
            if (this.agentId == null) {
                reject("This client is not registered at the server.")
            }
            
            this.post(`client/call/create_access/${this.agentId}`, parameters)
                .then(response => {
                    resolve(response.data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    }

    shareAccess (parameters) {
        return new Promise((resolve, reject) => {
            if (this.agentId == null) {
                reject("This client is not registered at the server.")
            }
            
            this.post(`client/call/send_access/${this.agentId}`, parameters)
                .then(response => {
                    resolve(response.data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    }
}