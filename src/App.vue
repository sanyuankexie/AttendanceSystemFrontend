<template>
  <v-app>
    <v-app-bar app dark :color="$vuetify.theme.dark?'grey darken-4':'blue lighten-3'">
      <div class="d-flex align-center">
        <v-img
          alt="kexie Logo"
          class="shrink mr-2"
          contain
          src="../public/logo.jpg"
          transition="scale-transition"
          width="40"
        />

        <v-toolbar-title>三院科协</v-toolbar-title>
      </div>

      <v-spacer></v-spacer>

      <v-app-bar-nav-icon @click="drawer = true">
        <v-icon>{{svgPath.mdiMenu}}</v-icon>
      </v-app-bar-nav-icon>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" fixed temporary>
      <v-list nav dense>
        <v-list-item-group>
          <v-list-item to="/">
            <v-list-item-icon>
              <v-icon>{{svgPath.mdiApps}}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>首页</v-list-item-title>
          </v-list-item>

          <v-list-item v-if="store.state.student.isLogin" to="/rank">
            <v-list-item-icon>
              <v-icon>{{svgPath.mdiBrightness5}}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>新人</v-list-item-title>
          </v-list-item>

          <v-list-item v-if="store.state.student.isLogin"  to="/old-man-rank">
            <v-list-item-icon>
              <v-icon>{{svgPath.mdiBrightness7}}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>老人</v-list-item-title>
          </v-list-item>

          <v-list-item v-if="store.state.student.isLogin"  to="/record">
            <v-list-item-icon>
              <v-icon>{{svgPath.mdiEmoticon}}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>记录</v-list-item-title>
          </v-list-item>

          <v-list-item v-if="store.state.student.isLogin"  to="/about">
            <v-list-item-icon>
              <v-icon>{{svgPath.mdiInformationOutline}}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>关于</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <template v-slot:append>
        <v-switch v-model="$vuetify.theme.dark" class="ml-4" label="Theme Dark"></v-switch>
      </template>
    </v-navigation-drawer>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import { mdiApps, mdiMenu, mdiInformationOutline, mdiEqualizer, mdiEmoticon, mdiBrightness7, mdiBrightness5 } from '@mdi/js'
import store from './store/store'
export default {
  data: () => ({
    store,
    svgPath: {
      mdiApps,
      mdiMenu,
      mdiInformationOutline,
      mdiEqualizer,
      mdiEmoticon,
      mdiBrightness7,
      mdiBrightness5
    },
    drawer: false
  }),
  watch: {
    '$vuetify.theme.dark': newQuestion => {
      localStorage.setItem('themeDark', newQuestion)
    }
  },
  mounted() {
    this.$vuetify.theme.dark = localStorage.getItem('themeDark') === 'true' ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}
</script>

<style>
.v-alert--prominent .v-alert__icon.v-icon svg {
  width: 32px;
  height: 32px;
}
.data-table-td-mw100 {
  min-width: 100px;
}
</style>
