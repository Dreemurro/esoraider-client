<template>
  <q-page padding class="column justify-center">
    <q-input
      filled
      v-model="logLink"
      placeholder="https://www.esologs.com/reports/..."
      label="Paste your log URL to get started"
      stack-label
      @change="parseLink"
      :loading="loading"
      :error="error"
      :error-message="errorMessage"
    />
  </q-page>
</template>

<script lang="ts">
import { useMeta } from 'quasar';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useStore } from 'src/store';

const metaData = {
  title: 'ESO Raider',
};

export default defineComponent({
  name: 'LogInput',
  setup() {
    const $store = useStore();
    const router = useRouter();
    const logLink = ref('');
    const loading = ref(false);
    const error = ref(false);
    const errorMessage = ref('');
    useMeta(metaData);

    const parseLink = async () => {
      loading.value = true;
      error.value = false;
      errorMessage.value = '';

      if (!logLink.value) {
        loading.value = false;
        return;
      }

      const pattern =
        /^(?:.*esologs\.com\/reports\/)?(?<code>(?:a:)?[a-zA-Z0-9]{16})\/?(?:#(?=(?:.*fight=(?<fight>[^&]*))?)(?=(?:.*source=(?<source>[^&]*))?).*)?$/;
      const matched = pattern.exec(logLink.value);
      if (!matched || !matched.groups) {
        loading.value = false;
        error.value = true;
        errorMessage.value =
          'The provided query does not match any of the expected formats';
        return;
      }

      let { code, fight, source } = matched.groups;

      await $store.dispatch('eso/requestLog', code);
      if (Object.keys($store.state.eso.error).length !== 0) {
        loading.value = false;
        errorMessage.value = $store.state.eso.error.response
          ? <string>$store.state.eso.error.response.data
          : $store.state.eso.error.message;
        error.value = true;
        return;
      }

      if (fight === 'last') {
        const currentLog = $store.state.eso.logs[code];
        const n_fights = currentLog.data.fights.length;
        fight = String(currentLog.data.fights[n_fights - 1].id);
      }

      let nextPage = '';
      if (fight && source) nextPage = `/${code}/${fight}/${source}`;
      else if (fight) nextPage = `/${code}/${fight}`;
      else nextPage = `/${code}`;

      await router.push({ path: nextPage });
    };

    return {
      logLink,
      loading,
      error,
      errorMessage,
      parseLink,
    };
  },
});
</script>
