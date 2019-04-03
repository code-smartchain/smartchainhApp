<template>
  <v-container style="background-color:rgb(32, 35, 37);">
    <v-layout
      text-xs-center
      wrap
      class="appView"
    >
      <v-flex class="openLockButton">
        <p>Hold your phone next to a lock</p>

        <v-layout class="circleContainer">
          <v-flex class="circleContainer">
            <v-icon id="circle1" class="circle" color="white" size=200>far fa-circle</v-icon>
            <v-icon id="circle2" class="circle" color="white" size=140>far fa-circle</v-icon>
            <v-icon id="circle3" class="circle" color="white" size=90>far fa-circle</v-icon>
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
      cOne: {
        style: {
          opacity: "0"
        }
      },
      cTwo: {},
      cThree: {},
    }),
    methods: {
      animateCircle: function (opacityOne, reverseOne, opacityTwo, reverseTwo, opacityThree, reverseThree) {
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
        var cOne = document.getElementById("circle1")
        var cTwo = document.getElementById("circle2")
        var cThree = document.getElementById("circle3")

        this.cOne = cOne
        this.cTwo = cTwo
        this.cThree = cThree

        this.animateCircle(0,false,0.33,false,0.66,false)
      }
    },
    mounted: function () {
      this.startAnimating()
    }
  }
</script>

<style>
.openLockButton {
  margin-top: 80%;
}
.circleContainer {
  height: 80%;
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
