<template>
  <v-container>
    <p v-for="access in accesses" :key="access.transaction_hash">{{access.device_name}}</p>
    <p class="footer">Powered by YPTOKEY</p>
  </v-container>
</template>

<script>
import { connect } from "@holochain/hc-web-client";
  export default {
    data: () => ({
      accesses: []
    }),
    methods: {
      getYourAccesses: function() {
        let wsUrl = this.$root.$data.wsUrl
        connect(wsUrl).then(({callZome, close}) => {
          const params = { }

          callZome('test-instance', 'accesses', 'get_my_accesses')(params)
            .then(response => {
              console.log(response);
              let accesses = JSON.parse(response)
              accesses.Ok.items.forEach(access => {
                this.accesses.push(access)
              });
            })
            .catch(error => console.error(error));
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
