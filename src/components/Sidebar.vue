<template>
  <q-drawer
    bordered
    persistent
    show-if-above
    no-swipe-open
    no-swipe-close
    no-swipe-backdrop
    class="column q-gutter-y-md"
  >
    <q-btn
      type="a"
      flat
      unelevated
      no-caps
      icon="img:icons/favicon-128x128.png"
      label="ESO Raider"
      size="xl"
      :to="{ name: 'Home' }"
    />
    <breadcrumbs />
    <q-space />
    <q-separator />
    <a href="https://discord.gg/KP8GpascgQ" class="justify-start">
        <q-icon
          name="fab fa-discord"
          size="md"
          />
    </a>
  </q-drawer>
</template>

<script>
import Breadcrumbs from './Breadcrumbs.vue';
export default {
  components: { Breadcrumbs },
  name: 'Sidebar',
};
</script>
