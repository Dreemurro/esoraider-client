<template>
  <q-card bordered>
    <q-expansion-item dense dense-toggle label="Important effects">
      <template v-if="Object.keys(report).length === 0">
        <q-btn
          flat
          dense
          unelevated
          no-caps
          class="full-width"
          label="Display important effects"
          :loading="loading"
          @click="reportRequest"
        />
      </template>

      <template v-else>
        <template v-if="Array.isArray(report.buffs) && report.buffs.length">
          <q-expansion-item
            dense
            dense-toggle
            expand-separator
            label="Buffs"
            :content-inset-level="0.5"
            :header-inset-level="0.5"
          >
            <q-list>
              <template v-for="(buff, i) in report.buffs" :key="i">
                <buff :buff="buff" />
              </template>
            </q-list>
          </q-expansion-item>
        </template>
        <template v-if="Array.isArray(report.debuffs) && report.debuffs.length">
          <q-expansion-item
            dense
            dense-toggle
            expand-separator
            label="Debuffs"
            :content-inset-level="0.5"
            :header-inset-level="0.5"
          >
            <q-list>
              <template v-for="(debuff, i) in report.debuffs" :key="i">
                <buff :buff="debuff" />
              </template>
            </q-list>
          </q-expansion-item>
        </template>
      </template>
    </q-expansion-item>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { useESOLogsStore } from 'src/stores/esoLogs';

import Buff from './Buff.vue';
import { AnalysisInfo } from './models';

export default defineComponent({
  components: { Buff },
  name: 'FightReport',
  setup() {
    const $store = useESOLogsStore();
    const route = useRoute();
    const loading = ref(false);
    const report = ref({} as AnalysisInfo);

    const logCode = <string>route.params.log;
    const fightId = Number(route.params.fight);

    const getReport = () => {
      const fight = $store.logs[logCode].fights[fightId];
      if (fight.report) report.value = fight.report;
    };

    const reportRequest = async () => {
      loading.value = true;
      await $store.requestFightReport({
        log: logCode,
        fight: fightId,
      });
      getReport();
      loading.value = false;
    };

    onMounted(getReport);

    return {
      loading,
      report,
      reportRequest,
    };
  },
});
</script>
