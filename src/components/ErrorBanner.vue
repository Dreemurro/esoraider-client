<template>
  <q-banner :class="$q.dark.isActive ? 'bg-red-8' : 'bg-red-3'">
    <template v-slot:avatar>
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
import { defineComponent, PropType } from 'vue';
export default defineComponent({
  name: 'errorBanner',
  props: {
    error: {
      type: Object as PropType<AxiosError>,
    },
  },
});
</script>
