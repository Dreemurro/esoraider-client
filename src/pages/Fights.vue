<template>
  <q-page padding class="q-gutter-sm">
    <template v-if="loading">
      <q-spinner size="50px" class="absolute-center" />
    </template>

    <template v-else-if="Object.keys(error).length !== 0">
      <error-banner :error="error" />
    </template>

    <template v-else>
      <q-toolbar>
        <q-space />
        <q-checkbox label="Show kills only" v-model="showKillsOnly" />
      </q-toolbar>
      <template v-if="Object.keys(displayedFights).length !== 0">
        <template v-for="fightGroup in displayedFights" :key="fightGroup.name">
          <zone-card :grouped-fights="fightGroup" />
        </template>
      </template>
      <template v-else>
        <q-banner :class="$q.dark.isActive ? 'bg-red-8' : 'bg-red-3'">
          Nothing to show here. Try unticking
          <strong>Show kills only</strong> above
        </q-banner>
      </template>
    </template>
  </q-page>
</template>

<script lang="ts">
import { AxiosError } from 'axios';
import _groupBy from 'lodash/groupBy';
import _map from 'lodash/map';
import { useMeta } from 'quasar';
import { computed, defineComponent, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { FightData, GroupedFights, Report } from 'components/models';
import ZoneCard from 'components/ZoneCard.vue';
import ErrorBanner from 'src/components/ErrorBanner.vue';
import { useESOLogsStore } from 'src/stores/esoLogs';

function grouping(fights: FightData[]): GroupedFights[] {
  const grouped: GroupedFights[] = _map(
    _groupBy(fights, (fight) => fight.gameZone.name),
    (value, key) => ({ name: key, fights: value })
  );
  return grouped;
}

export default defineComponent({
  components: { ZoneCard, ErrorBanner },
  name: 'FightsPage',
  setup() {
    const $store = useESOLogsStore();
    const title = ref('');
    const currentLog = ref({} as Report);
    const loading = ref(true);
    const showKillsOnly = ref(true);
    const error = ref({} as AxiosError);

    useMeta(() => {
      return {
        title: title.value,
        titleTemplate: (title) => `${title} | ESO Raider`,
      };
    });

    const displayedFights = computed(() => {
      if (showKillsOnly.value) {
        const killsOnly = currentLog.value.fights.filter(
          (fight) => fight.kill === true
        );
        return grouping(killsOnly);
      }

      return grouping(currentLog.value.fights);
    });

    const fightsRequest = async () => {
      const route = useRoute();

      const logCode = <string>route.params.log;
      await $store.requestLog(logCode);

      error.value = $store.error;
      if (Object.keys(error.value).length !== 0) {
        title.value = 'Error';
        loading.value = false;
        return;
      }

      const requestedLog = $store.logs[logCode].data;
      currentLog.value = requestedLog;
      title.value = requestedLog.title;
      loading.value = false;
    };

    onMounted(fightsRequest);

    return {
      currentLog,
      loading,
      showKillsOnly,
      displayedFights,
      error,
    };
  },
});
</script>
