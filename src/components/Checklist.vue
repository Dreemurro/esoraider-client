<template>
  <q-card bordered>
    <q-expansion-item
      default-opened
      switch-toggle-side
      expand-separator
      label="Passives"
    >
      <template v-for="(rule, i) in checklist" :key="i">
        <q-expansion-item
          dense
          dense-toggle
          switch-toggle-side
          expand-separator
          :content-inset-level="1"
          :default-opened="!rule.status"
        >
          <template v-slot:header>
            <q-item-section avatar class="items-center justify-center">
              <q-avatar square size="sm">
                <q-img :src="`${rule.icon}`" />
              </q-avatar>
            </q-item-section>
            <q-item-section>{{ rule.name }}</q-item-section>
            <q-item-section side>
              <q-icon
                size="sm"
                :color="rule.status ? 'positive' : 'negative'"
                :name="rule.status ? 'check' : 'close'"
              />
            </q-item-section>
          </template>
          <template v-for="(item, j) in rule.passives" :key="j">
            <q-item dense>
              <q-item-section avatar class="items-center justify-center">
                <q-avatar square size="sm">
                  <q-img :src="`${item.passive.icon}`" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                {{ item.passive.name }}
              </q-item-section>
              <q-item-section side>
                <q-icon
                  :name="item.present ? 'check' : 'close'"
                  :color="item.present ? 'positive' : 'negative'"
                  size="sm"
                />
              </q-item-section>
            </q-item>
          </template>
        </q-expansion-item>
      </template>
    </q-expansion-item>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Rule } from './models';
export default defineComponent({
  name: 'checklist',
  props: {
    checklist: {
      type: Object as PropType<Rule[]>,
      required: true,
    },
  },
});
</script>
