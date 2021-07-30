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
import { useStore } from 'src/store';
import { defineComponent, computed } from 'vue';
export default defineComponent({
  name: 'breadcrumbs',
  setup() {
    const $store = useStore();

    const breadcrumbs = computed(() => {
      // TODO: Split and move to store
      let breadcrumbsArray = [];

      let log = <string>$store.state.eso.route.params.log;
      if (log && Object.keys($store.state.eso.log).length !== 0) {
        breadcrumbsArray.push({
          label: $store.state.eso.log.title,
          link: `/${log}`,
        });
      }

      let fight = Number($store.state.eso.route.params.fight);
      // If failed to convert - take the last fight id
      if (!fight && $store.state.eso.log.fights && log) {
        const len = $store.state.eso.log.fights.length;
        fight = $store.state.eso.log.fights[len - 1].id;
      }
      if (fight && Object.keys($store.state.eso.log).length !== 0)
        breadcrumbsArray.push({
          label: $store.state.eso.log.fights.find((x) => x.id === fight)
            ?.displayName,
          link: `/${log}/${fight}`,
        });

      let char = Number($store.state.eso.route.params.char);
      if (char && Object.keys($store.state.eso.fight).length !== 0)
        breadcrumbsArray.push({
          label: $store.state.eso.fight.data.composition.find(
            (x) => x.id === char
          )?.name,
          link: `/${log}/${fight}/${char}`,
        });

      return breadcrumbsArray;
    });

    return {
      breadcrumbs,
    };
  },
});
</script>
