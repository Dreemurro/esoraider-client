<template>
  <q-page padding class="q-gutter-sm">
    <q-banner :class="$q.dark.isActive ? 'bg-blue-8' : 'bg-blue-3'">
      <template v-slot:avatar>
        <q-icon name="lightbulb" />
      </template>
      Have any suggestions (like new sets to track) or want to report bugs /
      errors? Then please join
      <a href="https://discord.gg/KP8GpascgQ">our Discord server</a>
      or message to @Dreemurro#7778 directly 👍
    </q-banner>

    <template v-if="globalLoading">
      <q-spinner size="50px" class="absolute-center" />
    </template>

    <template v-else-if="Object.keys(error).length !== 0">
      <error-banner :error="error" />
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
            label="Skills & Uptimes"
          >
            <template v-for="(skill, i) in currentAnalysis.skills" :key="i">
              <skill :skill="skill" />
            </template>
          </q-expansion-item>
        </q-card>
      </template>

      <template v-else>
        <q-banner :class="$q.dark.isActive ? 'bg-yellow-8' : 'bg-yellow-3'">
          <template v-slot:avatar>
            <q-icon name="warning_amber" />
          </template>
          Character skills were not found. This log is probably broken or there
          is nothing to track yet
        </q-banner>
      </template>

      <template v-if="Object.keys(currentAnalysis.sets).length !== 0">
        <q-card bordered>
          <q-expansion-item
            default-opened
            switch-toggle-side
            label="Sets & Uptimes"
          >
            <template v-for="(gearSet, i) in currentAnalysis.sets" :key="i">
              <gear-set :gearSet="gearSet" />
            </template>
          </q-expansion-item>
        </q-card>
      </template>

      <template v-else>
        <q-banner :class="$q.dark.isActive ? 'bg-yellow-8' : 'bg-yellow-3'">
          <template v-slot:avatar>
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
            label="Glyphs & Uptimes"
          >
            <template v-for="(glyph, i) in currentAnalysis.glyphs" :key="i">
              <glyph :glyph="glyph" />
            </template>
          </q-expansion-item>
        </q-card>
      </template>

      <template v-else>
        <q-banner :class="$q.dark.isActive ? 'bg-yellow-8' : 'bg-yellow-3'">
          <template v-slot:avatar>
            <q-icon name="warning_amber" />
          </template>
          Character glyphs were not found. This log is probably broken or there
          is nothing to track yet
        </q-banner>
      </template>
    </template>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useMeta } from 'quasar';
import { useStore } from 'src/store';
import { AxiosError } from 'axios';
import { Fight, AnalysisInfo } from 'components/models';
import ErrorBanner from 'components/ErrorBanner.vue';
import GearSet from 'components/GearSet.vue';
import Glyph from 'components/Glyph.vue';
import Skill from 'components/Skill.vue';

export default defineComponent({
  name: 'analysis',
  components: { Skill, GearSet, ErrorBanner, Glyph },
  setup() {
    interface Option {
      label: string;
      value: number[];
    }

    const $store = useStore();
    const route = useRoute();

    const title = ref('');
    const error = ref({} as AxiosError);

    const globalLoading = ref(true);
    const uptimesLoading = ref(false);

    const currentAnalysis = ref({} as AnalysisInfo);
    const currentOption = ref({} as Option);

    const logCode = <string>route.params.log;
    const fightId = Number(route.params.fight);
    const charId = Number(route.params.char);

    let options = [] as Option[];
    let currentFight = {} as Fight;

    useMeta(() => {
      return {
        title: title.value,
        titleTemplate: (title) => `${title} | ESO Raider`,
      };
    });

    const analysisRequest = async (targetId?: number[]) => {
      await $store.dispatch('eso/requestAnalysis', {
        log: logCode,
        fight: fightId,
        char: charId,
        target: targetId,
      });

      error.value = $store.state.eso.error;
      if (Object.keys(error.value).length !== 0) title.value = 'Error';
    };

    const populateTargets = () => {
      options.push({
        label: 'Overall',
        value: [0],
      });
      for (let target of currentFight.chars[charId]['Overall'].report.targets)
        options.push({
          label: target.name,
          value: target.id,
        });
    };

    const changeTarget = async (option: Option) => {
      uptimesLoading.value = true;

      if (!currentFight.chars[charId][option.label]) {
        await analysisRequest(option.value);
      }
      const report = currentFight.chars[charId][option.label].report;
      if (report) currentAnalysis.value = report;

      uptimesLoading.value = false;
    };

    onMounted(async () => {
      globalLoading.value = true;

      await analysisRequest();

      if (Object.keys(error.value).length !== 0) {
        globalLoading.value = false;
        return;
      }

      currentFight = $store.state.eso.logs[logCode].fights[fightId];

      populateTargets();
      currentOption.value = options[0];
      await changeTarget(currentOption.value);

      title.value = currentAnalysis.value.char.name;
      globalLoading.value = false;
    });

    return {
      globalLoading,
      uptimesLoading,
      currentAnalysis,
      currentOption,
      options,
      error,
      changeTarget,
    };
  },
});
</script>
