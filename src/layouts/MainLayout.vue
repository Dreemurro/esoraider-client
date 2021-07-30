<template>
  <q-layout view="lHh Lpr lFf">
    <sidebar />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Sidebar from 'components/Sidebar.vue';

export default defineComponent({
  name: 'MainLayout',
  components: { Sidebar },
});
</script>
