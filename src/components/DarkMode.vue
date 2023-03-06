<template>
  <q-toggle
    unchecked-icon="light_mode"
    checked-icon="dark_mode"
    v-model="state"
    @update:model-value="toggleMode"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useQuasar } from 'quasar';
export default defineComponent({
  name: 'DarkMode',
  setup() {
    const $q = useQuasar();
    const state = ref(false);

    const toggleMode = () => {
      $q.dark.toggle();
    };

    return { state, toggleMode };
  },
});
</script>
