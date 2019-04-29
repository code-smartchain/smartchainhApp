<template>
  <v-container>
    <v-layout>
      <v-flex>
        <v-card>
          <v-list dark>
            <v-list-tile
              class="access"
              v-for="access in accesses"
              :key="access.access.device_id"
            >
              <v-list-tile-avatar>
                <v-icon>fas fa-lock</v-icon>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title v-html="access.access.device_name"></v-list-tile-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-btn
                  flat
                  icon
                >
                  <v-icon v-if="access.owner" @click.stop="shareForm.access_addr = access.access_addr; shareForm.access_name = access.access.device_name; shareDialog = true">fas fa-share-alt</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-card>
        <p class="footer">Powered by YPTOKEY</p>
      </v-flex>
    </v-layout>
    <v-layout text-xs-center>
      <v-flex>
        <v-btn @click.stop="accessDialog = true">
          Register Lock
        </v-btn>
      </v-flex>
      <v-dialog v-model="accessDialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Register Lock</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-form ref="accessForm" v-model="accessFormValid">
                <v-layout wrap>
                  <v-flex xs12 sm6 md5>
                    <v-text-field label="Lock name" v-model="accessForm.device_name" :rules="notEmptyRule"></v-text-field>
                  </v-flex>
                  <v-spacer></v-spacer>
                  <v-flex xs12 sm6 md5>
                    <v-text-field label="Lock ID" v-model="accessForm.device_id" :rules="notEmptyRule"></v-text-field>
                  </v-flex>
                  <v-flex md12>
                    <v-text-field label="Lock description" v-model="accessForm.description" :rules="notEmptyRule"></v-text-field>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="accessDialog = false">Close</v-btn>
            <v-btn color="blue darken-1" flat @click="createAccess">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
    <v-layout text-xs-center>
      <v-dialog v-model="shareDialog" persistent max-width="300px">
        <v-card>
          <v-card-title class="customTitlePadding">
            <span class="headline">Share Lock: '{{shareForm.access_name}}'</span>
          </v-card-title>
          <v-card-text class="customPadding">
              <v-form ref="shareForm" v-model="shareFormValid">
                <v-text-field label="Agent identifier" v-model="shareForm.recipient_agent" :rules="notEmptyRule"></v-text-field>
              </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="blue darken-1" flat @click="shareDialog = false">Close</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="shareAccess">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-container>
</template>

<script>
  import DataController from '../DataController'
  export default {
    data: () => ({
      accesses: [],
      conn: {},
      accessForm: {
        device_id: '',
        device_type: '',
        device_name: '',
        public_key: '',
        description: '',
        time_restriction: '',
      },
      shareForm: {
        recipient_agent: '',
        access_addr: '',
        access_name: ''
      },
      accessDialog: false,
      shareDialog: false,
      notEmptyRule: [(v) => !!v || 'This field is required'],
      accessFormValid: false,
      shareFormValid: false
    }),
    methods: {
      getYourAccesses: function() {
        this.conn.getAccesses()
          .then((response) => {
            if (response.Ok != undefined) {
                this.accesses = []
                console.log(response.Ok.items)
                response.Ok.items.forEach(access => {
                  this.accesses.push(access)
                  this.$root.$data.accesses.push(access.lock.id)
                });
              } else {
                alert('Error: '+ JSON.stringify(response.Err))
              }
          })
          .catch(error => console.error(error));
      },
      createAccess: function() {
        if (!this.$refs.accessForm.validate()) {
          return
        }
        const params = this.accessForm

        this.conn.createAccess(params)
          .then((response) => {
            console.log(response)
            if (response.Ok != undefined) {
              this.accessDialog = false
              
              setTimeout(() => {this.getYourAccesses()}, 1000);
            } else {
              alert('Error: '+ JSON.stringify(response.Err))
            }
          })
          .catch(error => {
            console.error(error)
            alert('Error: Access has not been created')
          });
      },
      shareAccess: function() {
        if (!this.$refs.shareForm.validate()) {
          return
        }
        const params = {
          recipientAnimal: this.shareForm.recipient_agent,
          accessAddr: this.shareForm.access_addr  
        }

        this.conn.shareAccess(params)
          .then((response) => {
            console.log(response)
            if (response.Ok != undefined) {
              this.shareDialog = false
              
              setTimeout(() => {this.getYourAccesses()}, 1000);
            } else {
              alert('Error: '+ JSON.stringify(response.Err))
            }
          })
          .catch(error => {
            console.error(error)
            alert('Error: Access has not been created')
          });
      }
    },
    mounted: function () {
      this.conn = new DataController(this.$api, this.$root.$data.agentId)
      this.getYourAccesses()
    }
  }
</script>

<style>
  .footer {
    position: absolute;
    bottom: 10px;
    left: 0;
    right: 0;
    text-align: center;
  }
  .customPadding {
    padding: 10px 30px;
  }
  .customTitlePadding {
    padding: 20px 30px 0 30px;
  }
</style>
