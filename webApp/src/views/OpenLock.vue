<template>
  <v-container>
    <v-layout
      text-xs-center
      wrap
      class="appView"
    >
      <v-flex class="openLockButton">
        <p class="info_hold" v-if="connected == false">Hold your phone next to a lock</p>
        <p class="info_hold" v-if="connected == true">Tap to open lock</p>

        <v-layout class="circleContainer">
          <v-flex v-show="connected == false" class="circleContainer">
            <v-icon id="circle1" class="circle" color="white" size=20vh>fas fa-circle</v-icon>
            <v-icon id="circle2" class="circle" color="white" size=14vh>fas fa-circle</v-icon>
            <v-icon id="circle3" class="circle" color="white" size=9vh>fas fa-circle</v-icon>
          </v-flex>
          <v-flex v-show="connected == true" class="circleContainer">
            <v-btn
              flat
              icon
              :ripple=false
              @click="openLock"
            >
              <v-icon color="white" size=20vh>fas fa-circle</v-icon>
              <v-icon color="black" size=10vh style="position: absolute;">fas fa-unlock-alt</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <p class="footer">Powered by YPTOKEY</p>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      stopAnimating: false,
      stopConnecting: false,
      connected: false,
      connection: null
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
      checkForLocks: async function(index) {
        if (this.$root.$data.accesses.length > 0 && this.stopConnecting == false) {
          index ++ 
          index = index < this.$root.$data.accesses.length ? index : 0
          var url = this.$root.$data.accesses[index]

          var connection = await this.tryConnect(url).catch(err => {  
            this.connection = null;
            this.connected = false;
          })

          if (connection == undefined) {
            setTimeout(() => {this.checkForLocks(index)}, 2000);
          } else {
            this.connection = connection
            this.connected = true
          }
        }
      },
      tryConnect: function (url) {
        return new Promise((resolve, reject) => {
          var connection = new WebSocket(url)

          // When the connection is open, send some data to the server
          connection.onopen = function () {
            resolve(connection)
          };

          // Log errors
          connection.onclose = (error) => {
            console.log('WebSocket Closed ');
            if (this.connected == true && this.stopConnecting == false) {
              this.connected = false
              this.connction = null
              this.checkForLocks(-1)
            }
            reject(error)
          };
        })
      },
      openLock: function () {
        console.log(this.connection)
        if (this.connection == null) {
          return
        }
        this.connection.send("{ command: 1 }")
      }
    },
    mounted: function () {
      this.startAnimating()
      this.checkForLocks(-1)
    },
    beforeRouteLeave (to, from, next) {
      // called when the route that renders this component is about to
      // be navigated away from.
      // has access to `this` component instance.
      this.stopAnimating = true
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
