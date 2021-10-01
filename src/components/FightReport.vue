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
import { useStore } from 'src/store';
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Buff from './Buff.vue';

export default defineComponent({
  components: { Buff },
  name: 'fight-report',
  setup() {
    const $store = useStore();
    const route = useRoute();
    const loading = ref(false);
    const report = ref({});

    const logCode = <string>route.params.log;
    const fightId = Number(route.params.fight);

    const getReport = () => {
      const fight = $store.state.eso.logs[logCode].fights[fightId];
      if (fight.report) report.value = fight.report;
    };

    const reportRequest = async () => {
      loading.value = true;
      await $store.dispatch('eso/requestFightReport', {
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
