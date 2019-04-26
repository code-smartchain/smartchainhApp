<template>
  <v-container>
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
    <v-layout>
      <v-flex>
        <p class="access" v-for="access in accesses" :key="access.lock.device_id">{{access.access.device_name}}</p>
        <p class="footer">Powered by YPTOKEY</p>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      accesses: [],
      accessForm: {
        device_id: '',
        device_type: '',
        device_name: '',
        public_key: '',
        description: '',
        time_restriction: '',
      },
      accessDialog: false,
      notEmptyRule: [(v) => !!v || 'This field is required'],
      accessFormValid: false
    }),
    methods: {
      getYourAccesses: function() {
        this.$holochain.then(({callZome, close}) => {
            const params = { }

            callZome('test-instance', 'accesses', 'get_my_accesses')(params)
              .then(response => {
                console.log(response);
                let accesses = JSON.parse(response)
                this.accesses = []
                accesses.Ok.items.forEach(access => {
                  this.accesses.push(access)
                });
              })
              .catch(error => console.error(error));
          })
          .catch(error => console.error(error));
      },
      createAccess: function() {
        if (!this.$refs.accessForm.validate()) {
          return
        }
        this.$holochain.then(({callZome, close}) => {
          const params = { 
            access: this.accessForm
          }

          callZome('test-instance', 'accesses', 'create_access')(params)
            .then(jsonResponse => {
              console.log(jsonResponse)
              let response = JSON.parse(jsonResponse)
              if (response.Ok != undefined) {
                alert('Access has been created')
                this.accessDialog = false
                this.getYourAccesses()
              } else {
                alert('Error: '+ JSON.stringify(response.Err))
              }
            })
            .catch(error => {
              console.error(error)
              alert('Error: Access has not been created')
            });
        })
      }
    },
    mounted: function () {
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
</style>
