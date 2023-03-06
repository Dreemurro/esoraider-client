<template>
  <q-card bordered>
    <q-item-label header>{{ groupedFights.name }}</q-item-label>

    <q-separator />

    <q-item
      v-for="fight in groupedFights.fights"
      :key="fight.id"
      :to="{ name: 'Characters', params: { fight: `${fight.id}` } }"
    >
      <q-item-section>
        <q-item-label>{{ fight.displayName }}</q-item-label>
      </q-item-section>
      <q-item-section class="col-1 items-end">
        {{ fight.duration }}
      </q-item-section>
      <q-item-section>
        <q-linear-progress :value="(100 - fight.fightPercentage) / 100" />
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { GroupedFights } from './models';

export default defineComponent({
  name: 'ZoneCard',
  props: {
    groupedFights: {
      type: Object as PropType<GroupedFights>,
      required: true,
    },
  },
});
</script>
