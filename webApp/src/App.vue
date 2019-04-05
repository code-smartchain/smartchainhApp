<template>
  <v-app>
    <v-toolbar app>
      <v-btn
        flat
        icon
        color="white"
        @click.stop="drawer = !drawer"
      >
        <v-icon size=35>menu</v-icon>
      </v-btn>
    </v-toolbar>

    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
    >
      <v-list class="pa-1">
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <v-btn
            flat
            icon
            color="black"
            @click.stop="drawer = !drawer">
              <v-icon>close</v-icon>
            </v-btn>
          </v-list-tile-avatar>

        </v-list-tile>
      </v-list>

      <v-list class="pt-0" dense>
        <v-divider></v-divider>

        <v-list-tile
          v-for="item in items"
          :key="item.title"
          @click.stop="drawer = !drawer"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

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
      drawer: null,
      items: [
        { title: 'Open Doors', icon: 'lock' }
      ]
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