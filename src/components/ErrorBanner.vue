<template>
  <q-banner :class="$q.dark.isActive ? 'bg-red-8' : 'bg-red-3'">
    <template #avatar>
      <q-icon name="error_outline"></q-icon>
    </template>
    <template v-if="errorMessage">
      {{ errorMessage }}
    </template>
    <template v-else>
      {{ error.message }}
    </template>
  </q-banner>
</template>

<script lang="ts">
import { AxiosError } from 'axios';
import { PropType, defineComponent, onMounted, ref } from 'vue';
import { ErrorDetails } from './models';
export default defineComponent({
  name: 'ErrorBanner',
  props: {
    error: {
      type: Object as PropType<AxiosError>,
      required: true,
    },
  },
  setup(props) {
    const errorMessage = ref('');

    const getErrorMessage = () => {
      var errorData = props.error.response?.data as ErrorDetails;
      errorMessage.value = errorData.detail
        ? errorData.detail
        : props.error.message;
    };

    onMounted(getErrorMessage);

    return {
      errorMessage,
    };
  },
});
</script>
