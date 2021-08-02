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
          <img :src="`${glyph.icon}`" />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ glyph.name }}</q-item-label>
      </q-item-section>
      <template v-if="glyph.uptime !== null">
        <q-item-section class="col-1 items-end">
          {{ glyph.uptime }}%
        </q-item-section>
        <q-item-section>
          <q-linear-progress :value="glyph.uptime / 100" />
        </q-item-section>
      </template>
    </template>

    <template
      v-if="
        (glyph.buffs && Object.keys(glyph.buffs).length !== 0) ||
        (glyph.debuffs && Object.keys(glyph.debuffs).length !== 0)
      "
    >
      <q-expansion-item
        dense
        dense-toggle
        switch-toggle-side
        :content-inset-level="0.5"
        label="What's being tracked"
      >
        <template v-for="(buff, i) in glyph.buffs" :key="i">
          <buff :buff="buff" />
        </template>
        <template v-for="(debuff, i) in glyph.debuffs" :key="i">
          <buff :buff="debuff" />
        </template>
      </q-expansion-item>
    </template>
    <template v-if="glyph.advice">
      <q-item-section>{{ glyph.advice }}</q-item-section>
    </template>
  </q-expansion-item>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Glyph } from './models';
import Buff from './Buff.vue';
export default defineComponent({
  components: { Buff },
  props: {
    glyph: {
      type: Object as PropType<Glyph>,
    },
  },
});
</script>
