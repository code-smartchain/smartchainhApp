<template>
  <v-app>
    <v-toolbar app dark>
      <v-btn
        flat
        icon
        color="white"
        class="openNavigation"
        @click.stop="drawer = true"
      >
        <v-icon size=25>fas fa-bars</v-icon>
      </v-btn>

      <v-spacer></v-spacer>
      <v-toolbar-title>
        TEST
      </v-toolbar-title>
      <v-spacer></v-spacer>
    
      <v-toolbar-title color="white" v-if='$root.$data.agentId == ""' id="registeringString">
        Registering
        <v-progress-circular
          :indeterminate='$root.$data.agentId == ""'
          color="white"
          size="21"
          width="3"
        ></v-progress-circular>
      </v-toolbar-title>
      <v-toolbar-title color="white" v-else-if='$root.$data.agentId === "err"'>Not connected</v-toolbar-title>
      <v-toolbar-title color="white" v-else>ID: {{$root.$data.agentId}}</v-toolbar-title>
    
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
            @click.stop="drawer = false">
              <v-icon>fas fa-times</v-icon>
            </v-btn>
          </v-list-tile-avatar>

        </v-list-tile>
      </v-list>

      <v-list class="pt-0" dense>
        <v-divider></v-divider>

        <v-list-tile
          v-for="item in items"
          :key="item.title"
          @click.stop="routeTo(item.route)"
          v-bind:class="item.class"
        >
          <v-list-tile-action>
            <v-icon class="menuIcon" v-text="`$vuetify.icons.${item.icon}`"></v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-content class="appViewContainer">
      <router-view class="appView"></router-view>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      drawer: null,
      items: [
        { title: 'Open Doors', icon: 'key', route: '/', class: 'openDoors' },
        { title: 'Your Accesses', icon: 'keys', route: '/accesses', class: 'yourAccesses'}
      ]
    }
  },
  methods: {
    routeTo: function (path) {
      this.drawer = false
      this.$router.push(path)
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
.menuIcon {
  margin: 0 auto;
  height: 80%;
}
</style>