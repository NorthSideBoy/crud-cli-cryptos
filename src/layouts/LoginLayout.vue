<template>
  <q-layout view="hHh lpR fFf">

    <q-header bordered class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
            <div class="q-pt-sm">
              <img src="http://192.168.100.170:5565/file-1658102987948.png" class="shadow-4" width="165" height="25">
            </div>
        </q-toolbar-title>
        <q-btn push icon="cloud_upload" color="orange-5" label="Registrarse" to="/register"></q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view></router-view>
    </q-page-container>

    <q-footer bordered class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div>Hecho por: Said Lucena</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>