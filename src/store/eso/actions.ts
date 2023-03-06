import { AxiosResponse } from 'axios';
import { api } from 'boot/axios';
import { AnalysisInfo, Encounter, Report, TableData } from 'components/models';
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { EsoStateInterface } from './state';
import _uniq from 'lodash/uniq';
import _map from 'lodash/map';
import _without from 'lodash/without';
import _isEqual from 'lodash/isEqual';

const actions: ActionTree<EsoStateInterface, StateInterface> = {
  async requestLog({ dispatch, commit, state }, log: string) {
    commit('clearError');

    if (state.logs[log]) return;

    try {
      const response: AxiosResponse = await api.get(`/${log}`);
      commit('addLog', response.data as Report);
      commit('setFightDurations', log);
      await dispatch('setFightsDisplayNames', log);
    } catch (err) {
      commit('setError', err);
    }
  },
  async requestEncounters({ commit }, uniqueEncounters: number[]) {
    commit('clearError');
    const getEncounter = async (encounter: number) => {
      return api.get(`/encounter/${encounter}`);
    };

    const responses: Promise<AxiosResponse>[] = [];
    Object.values(uniqueEncounters).forEach((encounter) => {
      responses.push(getEncounter(encounter));
    });

    const resolved = await Promise.all(responses);
    const encounters: Encounter[] = [];
    Object.values(resolved).forEach((response) => {
      encounters.push(response.data as Encounter);
    });

    commit('addEncounters', encounters);
  },
  // TODO: Either move to server- or client-side with enums
  async setFightsDisplayNames({ dispatch, commit, state }, log: string) {
    const toExclude = [0]; // Exclude encounterID = 0, it's a trash fight
    Object.values(state.encounters).forEach((encounter) =>
      toExclude.push(encounter.id)
    );

    const uniqueEncounters = _uniq(
      _without(
        _map(state.logs[log].data.fights, (fight) => fight.encounterID),
        ...toExclude
      )
    );

    await dispatch('requestEncounters', uniqueEncounters);
    commit('setDisplayNames', log);
  },
  async requestFight(
    { commit, dispatch, state },
    payload: {
      log: string;
      fight: number;
    }
  ) {
    commit('clearError');

    let currentLog = state.logs[payload.log];
    if (!currentLog) {
      await dispatch('requestLog', payload.log);
      if (Object.keys(state.error).length !== 0) return;
      currentLog = state.logs[payload.log];
    }

    if (currentLog.fights[payload.fight]) return;

    const path = (await dispatch('generatePath', {
      log: payload.log,
      fight: payload.fight,
    })) as string;

    try {
      const response: AxiosResponse = await api.get(path);
      commit('addFight', {
        fight: response.data as TableData,
        fightId: payload.fight,
        log: payload.log,
      });
    } catch (err) {
      commit('setError', err);
    }
  },
  async requestFightReport(
    { commit, dispatch },
    payload: {
      log: string;
      fight: number;
    }
  ) {
    const path = (await dispatch('generatePath', {
      log: payload.log,
      fight: payload.fight,
      start: 'fight',
    })) as string;

    try {
      const response: AxiosResponse = await api.get(path);
      commit('addFightReport', {
        report: response.data as AnalysisInfo,
        fightId: payload.fight,
        log: payload.log,
      });
    } catch (err) {
      commit('setError', err);
    }
  },
  async requestAnalysis(
    { commit, dispatch, state },
    payload: {
      log: string;
      fight: number;
      char: number;
      target?: number[];
    }
  ) {
    commit('clearError');

    if (
      !state.logs[payload.log] ||
      !state.logs[payload.log].fights[payload.fight]
    ) {
      await dispatch('requestFight', {
        log: payload.log,
        fight: payload.fight,
      });
      if (Object.keys(state.error).length !== 0) return;
    }

    const target = payload.target ?? [0];
    const currentLog = state.logs[payload.log];
    const char = currentLog.fights[payload.fight].chars[payload.char] ?? null;
    const charTarget = char
      ? Object.keys(char).find((key) => _isEqual(char[key].ids, target))
      : null;

    if (char && charTarget) {
      return;
    }

    const path = (await dispatch('generatePath', {
      log: payload.log,
      fight: payload.fight,
      char: payload.char,
      target: payload.target,
    })) as string;

    try {
      const response: AxiosResponse = await api.get(path);
      commit('addChar', {
        target: payload.target,
        char: response.data as AnalysisInfo,
        charId: payload.char,
        fightId: payload.fight,
        log: payload.log,
      });
    } catch (err) {
      commit('setError', err);
    }
  },
  generatePath(
    { state },
    payload: {
      log: string;
      fight?: number;
      char?: number;
      target?: number[];
      start?: string;
    }
  ) {
    let path = payload.start ? `/${payload.start}` : '';

    path = path.concat(`/${payload.log}`);
    path = payload.fight ? path.concat(`/${payload.fight}`) : path;
    path = payload.char ? path.concat(`/${payload.char}`) : path;
    path = path.concat('?');

    if (payload.target && payload.target.length !== 0) {
      for (const t of payload.target) path = path.concat(`target=${t}&`);
    }

    const currentFight = state.logs[payload.log].data.fights.find(
      (fight) => fight.id === payload.fight
    );
    const startTime = currentFight ? currentFight.startTime : null;
    const endTime = currentFight ? currentFight.endTime : null;
    if (startTime && endTime) {
      path = path.concat(`start_time=${startTime}&end_time=${endTime}`);
    }

    return path;
  },
};

export default actions;
