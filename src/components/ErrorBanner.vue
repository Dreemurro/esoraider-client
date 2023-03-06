<template>
  <q-banner :class="$q.dark.isActive ? 'bg-red-8' : 'bg-red-3'">
    <template #avatar>
      <q-icon name="error_outline"></q-icon>
    </template>
    <template v-if="error.response">
      {{ error.response.data }}
    </template>
    <template v-else>
      {{ error.message }}
    </template>
  </q-banner>
</template>

<script lang="ts">
import { AxiosError } from 'axios';
import { PropType, defineComponent } from 'vue';
export default defineComponent({
  name: 'ErrorBanner',
  props: {
    error: {
      type: Object as PropType<AxiosError>,
      required: true,
    },
  },
});
</script>
