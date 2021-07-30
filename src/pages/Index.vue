<template>
  <q-page padding class="column justify-center bg-grey-3">
    <q-input
      filled
      v-model="logLink"
      placeholder="https://www.esologs.com/reports/..."
      label="Paste your log URL to get started"
      stack-label
      @change="parseLink"
    />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMeta } from 'quasar';

const metaData = {
  title: 'ESO Raider',
};

export default defineComponent({
  name: 'logInput',
  setup() {
    const logLink = ref('');
    const router = useRouter();
    useMeta(metaData);

    const parseLink = () => {
      const pattern =
        /^(?:.*esologs\.com\/reports\/)?(?<code>(?:a:)?[a-zA-Z0-9]{16})\/?(?:#(?=(?:.*fight=(?<fight>[^&]*))?)(?=(?:.*source=(?<source>[^&]*))?).*)?$/;
      const matched = pattern.exec(logLink.value);
      if (!matched || !matched.groups) {
        return;
      }

      const { code, fight, source } = matched.groups;
      let nextPage = '';
      if (fight && source) nextPage = `/${code}/${fight}/${source}`;
      else if (fight) nextPage = `/${code}/${fight}`;
      else nextPage = `/${code}`;

      router.push({ path: nextPage }).finally(() => {
        // do nothing
      });
    };

    return {
      logLink,
      parseLink,
    };
  },
});
</script>
