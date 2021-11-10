<template>
  <q-page padding class="q-gutter-sm">
    <template v-if="loading">
      <q-spinner size="50px" class="absolute-center" />
    </template>

    <template v-else-if="Object.keys(error).length !== 0">
      <error-banner :error="error" />
    </template>

    <template v-else>
      <template v-if="brokenFight">
        <q-banner :class="$q.dark.isActive ? 'bg-red-8' : 'bg-red-3'">
          <template v-slot:avatar>
            <q-icon name="error_outline" />
          </template>
          This fight is broken - characters' gear/skills are not logged
        </q-banner>
      </template>

      <fight-report />

      <template v-for="(spec, i) in specs" :key="i">
        <q-card bordered>
          <q-item>
            <q-item-section avatar>
              <q-avatar square>
                <q-img :src="spec.icon" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label header>{{ spec.name }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator />

          <q-item
            v-for="(player, i) in spec.players"
            :key="i"
            :to="{ name: 'Analysis', params: { char: `${player.id}` } }"
            dense
            :disable="brokenFight"
          >
            <q-item-section avatar class="items-center justify-center">
              <q-avatar square size="sm">
                <template v-if="player.specs">
                  <q-img :src="icons[player.type][player.specs[0]]" />
                </template>
                <template v-else>
                  <q-img :src="icons[player.type].Default" />
                </template>
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ player.name }}</q-item-label>
              <template v-if="player.displayName !== 'nil'">
                <q-item-label caption>{{ player.displayName }}</q-item-label>
              </template>
            </q-item-section>
          </q-item>
        </q-card>
      </template>
    </template>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'src/store';
import { CharacterInfo } from 'components/models';
import { AxiosError } from 'axios';
import { useMeta } from 'quasar';
import ErrorBanner from 'components/ErrorBanner.vue';
import FightReport from 'components/FightReport.vue';

export default defineComponent({
  name: 'characters',
  components: { ErrorBanner, FightReport },
  setup() {
    interface Spec {
      name: string;
      icon: string;
      players: CharacterInfo[];
    }

    const $store = useStore();
    const title = ref('');
    const loading = ref(true);
    const currentFight = ref({});
    const brokenFight = ref(false);
    const error = ref({} as AxiosError);
    const specs = ref([] as Spec[]);

    useMeta(() => {
      return {
        title: title.value,
        titleTemplate: (title) => `${title} | ESO Raider`,
      };
    });

    const icons = {
      Sorcerer: {
        Tank: 'images/class/sorcerer/tank.webp',
        Healer: 'images/class/sorcerer/healer.webp',
        MagickaDPS: 'images/class/sorcerer/magdd.webp',
        StaminaDPS: 'images/class/sorcerer/stamdd.webp',
        Default: 'images/class/sorcerer/default.webp',
      },
      Nightblade: {
        Tank: 'images/class/nightblade/tank.webp',
        Healer: 'images/class/nightblade/healer.webp',
        MagickaDPS: 'images/class/nightblade/magdd.webp',
        StaminaDPS: 'images/class/nightblade/stamdd.webp',
        Default: 'images/class/nightblade/default.webp',
      },
      DragonKnight: {
        Tank: 'images/class/dragonknight/tank.webp',
        Healer: 'images/class/dragonknight/healer.webp',
        MagickaDPS: 'images/class/dragonknight/magdd.webp',
        StaminaDPS: 'images/class/dragonknight/stamdd.webp',
        Default: 'images/class/dragonknight/default.webp',
      },
      Necromancer: {
        Tank: 'images/class/necromancer/tank.webp',
        Healer: 'images/class/necromancer/healer.webp',
        MagickaDPS: 'images/class/necromancer/magdd.webp',
        StaminaDPS: 'images/class/necromancer/stamdd.webp',
        Default: 'images/class/necromancer/default.webp',
      },
      Templar: {
        Tank: 'images/class/templar/tank.webp',
        Healer: 'images/class/templar/healer.webp',
        MagickaDPS: 'images/class/templar/magdd.webp',
        StaminaDPS: 'images/class/templar/stamdd.webp',
        Default: 'images/class/templar/default.webp',
      },
      Warden: {
        Tank: 'images/class/warden/tank.webp',
        Healer: 'images/class/warden/healer.webp',
        MagickaDPS: 'images/class/warden/magdd.webp',
        StaminaDPS: 'images/class/warden/stamdd.webp',
        Default: 'images/class/warden/default.webp',
      },
    };

    const fightRequest = async () => {
      const route = useRoute();

      const logCode = <string>route.params.log;
      const fightId = Number(route.params.fight);
      await $store.dispatch('eso/requestFight', {
        log: logCode,
        fight: fightId,
      });

      error.value = $store.state.eso.error;
      if (Object.keys(error.value).length !== 0) {
        title.value = 'Error';
        loading.value = false;
        return;
      }

      const currentLog = $store.state.eso.logs[logCode];
      const requestedFight = currentLog.fights[fightId];
      currentFight.value = requestedFight;

      let fightName = currentLog.data.fights.find(
        (x) => x.id === fightId
      )?.displayName;
      title.value = fightName ? fightName : '';

      specs.value.push({
        name: 'Tanks',
        icon: 'images/role/tank.webp',
        players: requestedFight.data.playerDetails['tanks'],
      });
      specs.value.push({
        name: 'Healers',
        icon: 'images/role/healer.webp',
        players: requestedFight.data.playerDetails['healers'],
      });
      specs.value.push({
        name: 'DDs',
        icon: 'images/role/dd.webp',
        players: requestedFight.data.playerDetails['dps'],
      });

      const randomChar = requestedFight.data.playerDetails.dps[0];
      if (Object.keys(randomChar.combatantInfo).length === 0)
        brokenFight.value = true;

      loading.value = false;
    };

    onMounted(fightRequest);

    return {
      currentFight,
      loading,
      specs,
      icons,
      error,
      brokenFight,
    };
  },
});
</script>
