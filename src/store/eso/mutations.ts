import {
  Encounter,
  TableData,
  Report,
  AnalysisInfo,
} from 'src/components/models';
import { MutationTree } from 'vuex';
import { EsoStateInterface } from './state';
import _find from 'lodash/find';
import { RouteLocationNormalized } from 'vue-router';
import { AxiosError } from 'axios';

const mutation: MutationTree<EsoStateInterface> = {
  addLog(state, log: Report) {
    state.logs[log.code] = {
      data: log,
      fights: [],
    };
  },
  addFight(state, payload: { fight: TableData; fightId: number; log: string }) {
    const newFight = {
      data: payload.fight,
      chars: {},
    };
    state.logs[payload.log].fights[payload.fightId] = newFight;
  },
  addChar(
    state,
    payload: {
      char: AnalysisInfo;
      charId: number;
      fightId: number;
      log: string;
    }
  ) {
    const { char, charId, fightId, log } = payload;
    state.logs[log].fights[fightId].chars[charId] = char;
  },
  setFightDurations(state, log: string) {
    const currentLog = state.logs[log];
    Object.values(currentLog.data.fights).forEach((fight) => {
      const timeDiff = fight.endTime - fight.startTime;
      fight.duration = new Date(timeDiff).toISOString().slice(14, 19);
    });
  },
  addEncounters(state, encounters: Encounter[]) {
    state.encounters.push(...encounters);
  },
  setDisplayNames(state, log: string) {
    const currentLog = state.logs[log];
    Object.values(currentLog.data.fights).forEach((fight) => {
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
  setError(state, error: AxiosError) {
    state.error = error;
  },
  clearError(state) {
    state.error = {} as AxiosError;
  },
};

export default mutation;
