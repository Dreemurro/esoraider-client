<template>
  <q-page padding class="q-gutter-sm bg-grey-3">
    <template v-if="loading">
      <q-spinner size="50px" class="absolute-center" />
    </template>

    <template v-else-if="Object.keys(error).length !== 0">
      <error-banner :error="error" />
    </template>

    <template v-else>
      <template v-if="Object.keys(currentChar.skills).length !== 0">
        <q-card bordered>
          <q-expansion-item
            default-opened
            switch-toggle-side
            label="Skills & Uptimes"
          >
            <template v-for="(skill, i) in currentChar.skills" :key="i">
              <skill :skill="skill" />
            </template>
          </q-expansion-item>
        </q-card>
      </template>

      <template v-else>
        <q-banner class="bg-yellow-3">
          <template v-slot:avatar>
            <q-icon name="warning_amber" />
          </template>
          Character skills were not found. This log is probably broken
        </q-banner>
      </template>

      <template v-if="Object.keys(currentChar.skills).length !== 0">
        <q-card bordered>
          <q-expansion-item
            default-opened
            switch-toggle-side
            label="Sets & Uptimes"
          >
            <template v-for="(gearSet, i) in currentChar.sets" :key="i">
              <gear-set :gearSet="gearSet" />
            </template>
          </q-expansion-item>
        </q-card>
      </template>

      <template v-else>
        <q-banner class="bg-yellow-3">
          <template v-slot:avatar>
            <q-icon name="warning_amber" />
          </template>
          Character sets were not found. This log is probably broken
        </q-banner>
      </template>

      <template v-if="Object.keys(currentChar.glyphs).length !== 0">
        <q-card bordered>
          <q-expansion-item
            default-opened
            switch-toggle-side
            label="Glyphs & Uptimes"
          >
            <template v-for="(glyph, i) in currentChar.glyphs" :key="i">
              <glyph :glyph="glyph" />
            </template>
          </q-expansion-item>
        </q-card>
      </template>
    </template>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'src/store';
import Skill from 'components/Skill.vue';
import GearSet from 'components/GearSet.vue';
import Glyph from 'src/components/Glyph.vue';
import ErrorBanner from 'components/ErrorBanner.vue';
import { AxiosError } from 'axios';
import { useMeta } from 'quasar';

export default defineComponent({
  name: 'analysis',
  components: { Skill, GearSet, ErrorBanner, Glyph },
  setup() {
    const $store = useStore();
    const title = ref('');
    const loading = ref(true);
    const currentChar = ref({});
    const error = ref({} as AxiosError);

    useMeta(() => {
      return {
        title: title.value,
        titleTemplate: (title) => `${title} | ESO Raider`,
      };
    });

    const analysisRequest = async () => {
      const route = useRoute();

      const logCode = <string>route.params.log;
      const fightId = Number(route.params.fight);
      const charId = Number(route.params.char);

      await $store.dispatch('eso/requestAnalysis', {
        log: logCode,
        fight: fightId,
        char: charId,
      });

      error.value = $store.state.eso.error;
      if (Object.keys(error.value).length !== 0) {
        title.value = 'Error';
        return;
      }

      const currentLog = $store.state.eso.logs[logCode];
      const currentFight = currentLog.fights[fightId];
      const requestedChar = currentFight.chars[charId];
      currentChar.value = requestedChar;
      title.value = requestedChar.char.name;
      loading.value = false;
    };

    onMounted(analysisRequest);

    return {
      loading,
      currentChar,
      error,
    };
  },
});
</script>
