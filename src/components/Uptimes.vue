<template>
  <template v-if="globalLoading">
    <q-spinner size="50px" class="absolute-center" />
  </template>

  <template v-else>
    <q-select
      outlined
      dense
      options-dense
      label="Target"
      v-model="currentOption"
      :options="options"
      @update:model-value="changeTarget"
      :loading="uptimesLoading"
    />
    <template v-if="Object.keys(currentAnalysis.skills).length !== 0">
      <q-card bordered>
        <q-expansion-item
          default-opened
          switch-toggle-side
          expand-separator
          label="Skills"
        >
          <template v-for="(skill, i) in currentAnalysis.skills" :key="i">
            <skill :skill="skill" />
          </template>
        </q-expansion-item>
      </q-card>
    </template>

    <template v-else>
      <q-banner :class="$q.dark.isActive ? 'bg-yellow-8' : 'bg-yellow-3'">
        <template #avatar>
          <q-icon name="warning_amber" />
        </template>
        Character skills were not found. This log is probably broken or there is
        nothing to track yet
      </q-banner>
    </template>

    <template v-if="Object.keys(currentAnalysis.sets).length !== 0">
      <q-card bordered>
        <q-expansion-item
          default-opened
          switch-toggle-side
          expand-separator
          label="Sets"
        >
          <template v-for="(gearSet, i) in currentAnalysis.sets" :key="i">
            <gear-set :gear-set="gearSet" />
          </template>
        </q-expansion-item>
      </q-card>
    </template>

    <template v-else>
      <q-banner :class="$q.dark.isActive ? 'bg-yellow-8' : 'bg-yellow-3'">
        <template #avatar>
          <q-icon name="warning_amber" />
        </template>
        Character sets were not found. This log is probably broken or there is
        nothing to track yet
      </q-banner>
    </template>

    <template v-if="Object.keys(currentAnalysis.glyphs).length !== 0">
      <q-card bordered>
        <q-expansion-item
          default-opened
          switch-toggle-side
          expand-separator
          label="Glyphs"
        >
          <template v-for="(glyph, i) in currentAnalysis.glyphs" :key="i">
            <glyph :glyph="glyph" />
          </template>
        </q-expansion-item>
      </q-card>
    </template>

    <template v-else>
      <q-banner :class="$q.dark.isActive ? 'bg-yellow-8' : 'bg-yellow-3'">
        <template #avatar>
          <q-icon name="warning_amber" />
        </template>
        Character glyphs were not found. This log is probably broken or there is
        nothing to track yet
      </q-banner>
    </template>
  </template>
</template>

<script lang="ts">
import { PropType, defineComponent, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import GearSet from 'components/GearSet.vue';
import Glyph from 'components/Glyph.vue';
import { AnalysisInfo, Fight } from 'components/models';
import Skill from 'components/Skill.vue';
export default defineComponent({
  name: 'UptimesItem',
  components: { GearSet, Glyph, Skill },
  props: {
    fight: {
      type: Object as PropType<Fight>,
      required: true,
    },
  },
  emits: ['change-target'],
  setup(props, { emit }) {
    interface Option {
      label: string;
      value: number[];
    }

    const route = useRoute();

    const globalLoading = ref(true);
    const uptimesLoading = ref(false);

    const currentAnalysis = ref({} as AnalysisInfo);
    const currentOption = ref({} as Option);

    const charId = Number(route.params.char);

    let options = [] as Option[];

    const populateTargets = () => {
      options.push({
        label: 'Overall',
        value: [0],
      });
      for (let target of props.fight.chars[charId]['Overall'].report.targets)
        options.push({
          label: target.name,
          value: target.id,
        });
    };

    const changeTarget = (option: Option) => {
      uptimesLoading.value = true;

      if (!props.fight.chars[charId][option.label]) {
        emit('change-target', option.value, option.label, finalize);
      } else {
        finalize(option.label);
      }
    };

    const finalize = (option: string) => {
      const report = props.fight.chars[charId][option].report;
      if (report) currentAnalysis.value = report;

      uptimesLoading.value = false;
    };

    onMounted(() => {
      globalLoading.value = true;

      populateTargets();
      currentOption.value = options[0];
      changeTarget(currentOption.value);

      globalLoading.value = false;
    });

    return {
      globalLoading,
      uptimesLoading,
      currentAnalysis,
      currentOption,
      options,
      changeTarget,
    };
  },
});
</script>
