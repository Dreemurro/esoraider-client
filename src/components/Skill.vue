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
          <img :src="`${skill.icon}`" />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ skill.name }}</q-item-label>
      </q-item-section>
      <template v-if="skill.uptime !== null">
        <q-item-section class="col-1 items-end">
          {{ skill.uptime }}%
        </q-item-section>
        <q-item-section>
          <q-linear-progress :value="skill.uptime / 100" />
        </q-item-section>
      </template>
    </template>

    <template
      v-if="
        (skill.buffs && Object.keys(skill.buffs).length !== 0) ||
        (skill.debuffs && Object.keys(skill.debuffs).length !== 0) ||
        (skill.children && Object.keys(skill.children).length !== 0)
      "
    >
      <q-expansion-item
        dense
        dense-toggle
        switch-toggle-side
        :content-inset-level="0.5"
        label="What's being tracked"
      >
        <template v-for="(buff, i) in skill.buffs" :key="i">
          <buff :buff="buff" />
        </template>
        <template v-for="(debuff, i) in skill.debuffs" :key="i">
          <buff :buff="debuff" />
        </template>
        <template v-for="(child, i) in skill.children" :key="i">
          <buff :buff="child" />
        </template>
      </q-expansion-item>
    </template>
    <q-item-section>ADVICE HERE</q-item-section>
  </q-expansion-item>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Skill } from './models';
import Buff from './Buff.vue';
export default defineComponent({
  components: { Buff },
  props: {
    skill: {
      type: Object as PropType<Skill>,
    },
  },
});
</script>
