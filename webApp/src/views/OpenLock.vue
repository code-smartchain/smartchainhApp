<template>
  <v-container>
    <v-layout
      text-xs-center
      wrap
      class="appView"
    >
      <v-flex>
        <v-btn @click.stop="createAccess">
          Create Access
        </v-btn>
      </v-flex>
      <v-flex class="openLockButton">
        <p class="info_hold">Hold your phone next to a lock</p>

        <v-layout class="circleContainer">
          <v-flex class="circleContainer">
            <v-icon id="circle1" class="circle" color="white" size=20vh>far fa-circle</v-icon>
            <v-icon id="circle2" class="circle" color="white" size=14vh>far fa-circle</v-icon>
            <v-icon id="circle3" class="circle" color="white" size=9vh>far fa-circle</v-icon>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <p class="footer">Powered by YPTOKEY</p>
  </v-container>
</template>

<script>
import { connect } from "@holochain/hc-web-client";
  export default {
    data: () => ({
      stopAnimating: false
    }),
    methods: {
      animateCircle: function (opacityOne, reverseOne, opacityTwo, reverseTwo, opacityThree, reverseThree) {
        if(this.stopAnimating == true) {
          return
        }
        
        var speed = 0.01
        
        var cOne = document.getElementById("circle1")
        var cTwo = document.getElementById("circle2")
        var cThree = document.getElementById("circle3")
        
        cOne.style.opacity = opacityOne
        cTwo.style.opacity = opacityTwo
        cThree.style.opacity = opacityThree

        let newOpacityOne = reverseOne? opacityOne - speed:opacityOne + speed
        let newOpacityTwo = reverseTwo? opacityTwo - speed:opacityTwo + speed
        let newOpacityThree = reverseThree? opacityThree - speed:opacityThree + speed

        if (newOpacityOne > 1 || newOpacityOne < 0) {
          reverseOne = !reverseOne
        }
        if (newOpacityTwo > 1 || newOpacityTwo < 0) {
          reverseTwo = !reverseTwo
        }
        if (newOpacityThree > 1 || newOpacityThree < 0) {
          reverseThree = !reverseThree
        }
        
        setTimeout(() => {this.animateCircle(newOpacityOne,reverseOne,newOpacityTwo,reverseTwo,newOpacityThree,reverseThree)}, 10);
      },
      startAnimating: function() {
        this.animateCircle(0,false,0.33,false,0.66,false)
      },
      createAccess: function() {
        let wsUrl = this.$root.$data.wsUrl
        connect(wsUrl).then(({callZome, close}) => {
          const params = { 
            access: {
              device_id: 'test device',
              device_type: 'test device type',
              device_name: 'test device name',
              public_key: 'test public key',
              description: 'test description',
              transaction_hash: this.makeid(5),
              time_restriction: '',
            }
          }

          callZome('test-instance', 'accesses', 'create_access')(params)
            .then(response => {
              console.log(response)
              alert('Access has been created')
            })
            .catch(error => {
              console.error(error)
              alert('Error: Access has not been created')
            });
        })
      },
      makeid: function (length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < length; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
      }
    },
    mounted: function () {
      this.startAnimating()
    },
    beforeRouteLeave (to, from, next) {
      // called when the route that renders this component is about to
      // be navigated away from.
      // has access to `this` component instance.
      this.stopAnimating = true
      console.log("called")
      next()
    }
  }
</script>

<style>
  .openLockButton {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 10vh;
    margin: auto;
  }
  .circleContainer {
    height: 20vh;
    position: relative;
  }
  .circle {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }
  .footer {
    position: absolute;
    bottom: 10px;
    left: 0;
    right: 0;
    text-align: center;
  }
</style>
