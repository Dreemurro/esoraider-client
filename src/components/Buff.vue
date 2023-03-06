<template>
  <template v-if="buff.stack && buff.stack.uptimes">
    <template v-for="(stack, i) in buff.stack.uptimes" :key="i">
      <q-item dense>
        <q-item-section avatar class="items-center justify-center">
          <q-avatar square size="sm">
            <q-img :src="`${buff.icon}`" />
          </q-avatar>
        </q-item-section>
        <q-item-section>{{ buff.name }} x{{ i }}</q-item-section>
        <q-item-section class="col-1 items-end"> {{ stack }}% </q-item-section>
        <q-item-section>
          <q-linear-progress :value="stack / 100" />
        </q-item-section>
      </q-item>
    </template>
  </template>
  <template v-else>
    <q-item dense>
      <q-item-section avatar class="items-center justify-center">
        <q-avatar square size="sm">
          <q-img :src="`${buff.icon}`" />
        </q-avatar>
      </q-item-section>
      <q-item-section>{{ buff.name }}</q-item-section>
      <template v-if="buff.uptime !== undefined">
        <q-item-section class="col-1 items-end">
          {{ buff.uptime }}%
        </q-item-section>
        <q-item-section>
          <q-linear-progress :value="buff.uptime / 100" />
        </q-item-section>
      </template>
    </q-item>
  </template>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';

import { Buff } from './models';
export default defineComponent({
  name: 'BreadcrumbList',
  props: {
    buff: {
      type: Object as PropType<Buff>,
      required: true,
    },
  },
});
</script>
