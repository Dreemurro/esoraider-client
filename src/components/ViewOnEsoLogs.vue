<template>
  <template v-if="link">
    <q-btn
      type="a"
      flat
      unelevated
      no-caps
      icon="img:https://assets.rpglogs.com/img/eso/favicon.png"
      label="View report on ESO Logs"
      align="left"
      :href="link"
      target="_blank"
    />
  </template>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useRoute } from 'vue-router';
export default defineComponent({
  setup() {
    const route = useRoute();
    const link = computed(() => {
      const baseURL = 'https://www.esologs.com/reports/';

      const log = <string>route.params.log;
      const fight = <string>route.params.fight;
      const char = <string>route.params.char;

      let url = '';
      if (log) url = url.concat(`${baseURL}${log}`);
      if (fight) url = url.concat(`#fight=${fight}`);
      if (char) url = url.concat(`&source=${char}`);

      return url;
    });

    return {
      link,
    };
  },
});
</script>
