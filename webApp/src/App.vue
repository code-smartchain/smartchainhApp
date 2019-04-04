<template>
  <v-app>
    <v-toolbar app>
      <v-btn
        flat
        icon
        color="white"
      >
        <v-icon size=35>menu</v-icon>
      </v-btn>
    </v-toolbar>

    <v-content class="appViewContainer">
      <OpenLock class="appView"/>
    </v-content>
  </v-app>
</template>

<script>
import OpenLock from './components/OpenLock'

export default {
  name: 'App',
  components: {
    OpenLock
  },
  data () {
    return {
      //
    }
  }
}
</script>

<style>
.appView {
  width: 100%;
  height: 100%;
}
.appViewContainer {
  background-color:rgb(32, 35, 37);
}
nav {
  background-color: rgb(32, 35, 37) !important;
  border-style: solid;
  border-width: 0 0 1px 0;
  border-color: white !important;
}
p {
  color: white;
  font-size: 2vh;
}
</style>