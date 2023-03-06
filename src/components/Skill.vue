<template>
  <q-expansion-item
    dense
    dense-toggle
    switch-toggle-side
    expand-separator
    :content-inset-level="1"
  >
    <template #header>
      <q-item-section avatar class="items-center justify-center">
        <q-avatar square size="sm">
          <q-img :src="`${skill.icon}`" />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ skill.name }}</q-item-label>
      </q-item-section>
      <template v-if="skill.uptime !== undefined">
        <q-item-section class="col-1 items-end">
          <template v-if="skill.uptime > 100">
            <em>{{ skill.uptime }}%</em>
            <q-tooltip>
              Total number of ticks on all enemies can be higher than fight
              length
            </q-tooltip>
          </template>
          <template v-else> {{ skill.uptime }}% </template>
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
      <template v-for="(buff, i) in skill.buffs" :key="i">
        <buff :buff="buff" />
      </template>
      <template v-for="(debuff, i) in skill.debuffs" :key="i">
        <buff :buff="debuff" />
      </template>
      <template v-for="(child, i) in skill.children" :key="i">
        <buff :buff="child" />
      </template>
    </template>
    <template v-if="skill.advice">
      <q-item-section>{{ skill.advice }}</q-item-section>
    </template>
  </q-expansion-item>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Skill } from './models';
import Buff from './Buff.vue';
export default defineComponent({
  name: 'SkillItem',
  components: { Buff },
  props: {
    skill: {
      type: Object as PropType<Skill>,
      required: true,
    },
  },
});
</script>
