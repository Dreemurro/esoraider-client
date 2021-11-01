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
      <q-card bordered>
        <q-tabs v-model="currentTab" no-caps align="justify">
          <q-tab name="uptimes" label="Uptimes" />
          <q-tab name="checklist" label="Checklist">
            <template v-if="numberOfAlerts !== 0">
              <q-badge color="red" floating>{{ numberOfAlerts }}</q-badge>
            </template>
          </q-tab>
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="currentTab" keep-alive>
          <q-tab-panel name="uptimes" class="q-pa-md q-gutter-md">
            <template v-if="Object.keys(currentFight).length !== 0">
              <uptimes :fight="currentFight" @changeTarget="analysisRequest" />
            </template>
          </q-tab-panel>
          <q-tab-panel name="checklist">
            <template v-if="Object.keys(currentChecklist).length !== 0">
              <checklist :checklist="currentChecklist" />
            </template>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </template>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useMeta } from 'quasar';
import { useStore } from 'src/store';
import { AxiosError } from 'axios';
import { Fight, Rule } from 'components/models';
import Checklist from 'components/Checklist.vue';
import ErrorBanner from 'components/ErrorBanner.vue';
import Uptimes from 'components/Uptimes.vue';

export default defineComponent({
  name: 'analysis',
  components: { Checklist, ErrorBanner, Uptimes },
  setup() {
    const $store = useStore();
    const route = useRoute();

    const title = ref('');
    const error = ref({} as AxiosError);

    const globalLoading = ref(true);

    const currentTab = ref('uptimes');
    const currentFight = ref({} as Fight);
    const currentChecklist = ref([] as Rule[]);

    const logCode = <string>route.params.log;
    const fightId = Number(route.params.fight);
    const charId = Number(route.params.char);

    const numberOfAlerts = computed(() => {
      let alerts = 0;
      for (var rule of currentChecklist.value) {
        if (!rule.status) alerts++;
      }
      return alerts;
    });

    useMeta(() => {
      return {
        title: title.value,
        titleTemplate: (title) => `${title} | ESO Raider`,
      };
    });

    const analysisRequest = async (
      targetId?: number,
      targetName?: string,
      done?: (targetName: string) => void
    ) => {
      await $store.dispatch('eso/requestAnalysis', {
        log: logCode,
        fight: fightId,
        char: charId,
        target: targetId,
      });

      error.value = $store.state.eso.error;
      if (Object.keys(error.value).length !== 0) title.value = 'Error';

      if (targetId && targetName && done) done(targetName);
    };

    onMounted(async () => {
      globalLoading.value = true;

      await analysisRequest();

      if (Object.keys(error.value).length !== 0) {
        globalLoading.value = false;
        return;
      }

      currentFight.value = $store.state.eso.logs[logCode].fights[fightId];
      const report = currentFight.value.chars[charId]['Overall'].report;
      currentChecklist.value = report.checklist;

      title.value = report.char.name;
      globalLoading.value = false;
    });

    return {
      globalLoading,
      error,
      currentTab,
      currentFight,
      currentChecklist,
      analysisRequest,
      numberOfAlerts,
    };
  },
});
</script>
