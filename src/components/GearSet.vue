<template>
  <q-expansion-item
    dense
    dense-toggle
    switch-toggle-side
    expand-separator
    :content-inset-level="0.5"
  >
    <template v-slot:header>
      <q-item-section avatar class="items-center justify-center">
        <q-avatar square size="sm">
          <img :src="`${gearSet.icon}`" />
        </q-avatar>
      </q-item-section>
      <q-item-section>{{ gearSet.name }}</q-item-section>
      <template v-if="gearSet.uptime !== null">
        <q-item-section class="col-1 items-end">
          {{ gearSet.uptime }}%
        </q-item-section>
        <q-item-section>
          <q-linear-progress :value="gearSet.uptime / 100" />
        </q-item-section>
      </template>
    </template>
    <q-expansion-item
      dense
      dense-toggle
      switch-toggle-side
      :content-inset-level="0.5"
      label="What's being tracked"
    >
      <template v-for="(buff, i) in gearSet.buffs" :key="i">
        <buff :buff="buff" />
      </template>
      <template v-for="(debuff, i) in gearSet.debuffs" :key="i">
        <buff :buff="debuff" />
      </template>
    </q-expansion-item>
  </q-expansion-item>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Buff from './Buff.vue';
import { GearSet } from './models';
export default defineComponent({
  components: { Buff },
  props: {
    gearSet: {
      type: Object as PropType<GearSet>,
    },
  },
});
</script>
