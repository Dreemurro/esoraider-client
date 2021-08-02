import { Encounter, Table, Report, AnalysisInfo } from 'src/components/models';
import { MutationTree } from 'vuex';
import { EsoStateInterface } from './state';
import _find from 'lodash/find';
import { RouteLocationNormalized } from 'vue-router';
import { AxiosError } from 'axios';

const mutation: MutationTree<EsoStateInterface> = {
  setLog(state, log: Report) {
    state.log = log;
  },
  setFightDurations(state) {
    Object.values(state.log.fights).forEach((fight) => {
      const timeDiff = fight.endTime - fight.startTime;
      fight.duration = new Date(timeDiff).toISOString().slice(14, 19);
    });
  },
  setEncounters(state, encounters: Encounter[]) {
    state.encounters.push(...encounters);
  },
  setDisplayNames(state) {
    Object.values(state.log.fights).forEach((fight) => {
      if (fight.encounterID === 0) {
        fight.displayName = 'Trash Fight';
        return;
      }
      const possibleDifficulties = _find(
        state.encounters,
        (encounter) => encounter.id === fight.encounterID
      );
      const difficultyName = _find(
        possibleDifficulties?.zone.difficulties,
        (difficulty) => difficulty.id === fight.difficulty
      )?.name;
      if (difficultyName)
        fight.displayName = `${fight.name} (${difficultyName})`;
      else fight.displayName = `${fight.name}`;
    });
  },
  setRoute(state, route: RouteLocationNormalized) {
    state.route = route;
  },
  setFight(state, fight: Table) {
    state.fight = fight;
  },
  setChar(state, char: AnalysisInfo) {
    state.char = char;
  },
  addFight(
    state,
    payload: {
      fight: Table;
      fight_id: number;
    }
  ) {
    state.fights[payload.fight_id] = payload.fight;
  },
  purgeFights(state) {
    state.fights = [] as Table[];
  },
  setError(state, error: AxiosError) {
    state.error = error;
  },
  clearError(state) {
    state.error = {} as AxiosError;
  },
};

export default mutation;
