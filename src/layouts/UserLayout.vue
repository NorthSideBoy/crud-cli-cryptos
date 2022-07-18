<template>
    <q-layout view="lHh Lpr lff">
      <q-header class="primary">
        <q-toolbar>
          <q-toolbar-title>
            <div class="q-pt-sm">
              <img src="http://192.168.100.170:5565/file-1658102987948.png" class="shadow-4" width="260" height="30"/>
            </div>
            </q-toolbar-title>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu"/>
          <q-btn flat round dense icon="logout" color="negative"></q-btn>
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="drawer"
        show-if-above
        :width="200"
        :breakpoint="400"
      >
        <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
          <q-list padding>
            <q-item clickable v-ripple to="/" active-class="my-menu-link" exact>
              <q-item-section avatar>
                <q-icon name="home" />
              </q-item-section>

              <q-item-section>
                Inicio
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/form" active-class="my-menu-link">
              <q-item-section avatar>
                <q-icon name="send" />
              </q-item-section>

              <q-item-section>
                Registrar
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
          <div class="absolute-bottom bg-transparent">
            <q-avatar size="56px" class="q-mb-sm">
              <img src="http://192.168.100.170:5565/file-1658116817401.jpg">
            </q-avatar>
              <div class="text-weight-bold">Said Lucena</div>
            <div>@saidcito</div>
          </div>
        </q-img>
      </q-drawer>

      <q-page-container>
          <router-view></router-view>
      </q-page-container>
    </q-layout>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const drawer = ref(false)

    return {
      drawer
    }
  }
}
</script>

<style lang="scss">
  .my-menu-link
    {
      color: white;
      background: #ff6d00
    }
</style>