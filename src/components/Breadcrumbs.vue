<template>
  <q-list dense>
    <q-item v-for="(bc, index) in breadcrumbs" :key="index" :to="bc.link">
      <q-item-section>
        <q-item-label> {{ bc.label }} </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import { useESOLogsStore } from 'src/stores/esoLogs';
export default defineComponent({
  name: 'BreadcrumbList',
  setup() {
    const $store = useESOLogsStore();

    const breadcrumbs = computed(() => {
      // TODO: Split and move to store
      type Breadcrumb = {
        label: string;
        link: string;
      };
      let breadcrumbsArray: Breadcrumb[] = [];

      const logCode = <string>$store.route.params.log;
      const currentLog = $store.logs[logCode];
      if (logCode && currentLog) {
        const label = currentLog.data.title;
        const link = `/${logCode}`;
        breadcrumbsArray.push({ label: label, link: link });
      } else return breadcrumbsArray;

      let fightId = Number($store.route.params.fight);
      const currentFight = currentLog.fights[fightId];
      if (fightId && currentFight) {
        const fight = currentLog.data.fights.find((x) => x.id === fightId);
        const link = `/${logCode}/${fightId}`;

        let label = '';
        if (fight && fight.displayName) label = fight.displayName;

        breadcrumbsArray.push({ label: label, link: link });
      } else return breadcrumbsArray;

      let charId = Number($store.route.params.char);
      if (charId && currentFight) {
        const char = currentFight.data.composition.find((x) => x.id === charId);
        const label = char ? char.name : '';
        const link = `/${logCode}/${fightId}/${charId}`;

        breadcrumbsArray.push({ label: label, link: link });
      } else return breadcrumbsArray;

      return breadcrumbsArray;
    });

    return {
      breadcrumbs,
    };
  },
});
</script>
