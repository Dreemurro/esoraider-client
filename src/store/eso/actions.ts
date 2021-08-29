import { AxiosResponse } from 'axios';
import { api } from 'boot/axios';
import { AnalysisInfo, Encounter, Report, TableData } from 'components/models';
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { EsoStateInterface } from './state';
import _uniq from 'lodash/uniq';
import _map from 'lodash/map';
import _without from 'lodash/without';

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
    Object.values(resolved).forEach((response) =>
      encounters.push(response.data)
    );

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

    const currentFight = currentLog.data.fights.find(
      (fight) => fight.id === payload.fight
    );
    const startTime = currentFight ? currentFight.startTime : null;
    const endTime = currentFight ? currentFight.endTime : null;
    let path = `/${payload.log}/${payload.fight}`;
    if (startTime && endTime) {
      path = path.concat(`?start_time=${startTime}&end_time=${endTime}`);
    }

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
    { commit, state },
    payload: {
      log: string;
      fight: number;
    }
  ) {
    const currentLog = state.logs[payload.log];
    const currentFight = currentLog.data.fights.find(
      (fight) => fight.id === payload.fight
    );
    const startTime = currentFight ? currentFight.startTime : null;
    const endTime = currentFight ? currentFight.endTime : null;
    let path = `/fight/${payload.log}/${payload.fight}`;
    if (startTime && endTime) {
      path = path.concat(`?start_time=${startTime}&end_time=${endTime}`);
    }

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

    const currentLog = state.logs[payload.log];
    if (currentLog.fights[payload.fight].chars[payload.char]) {
      return;
    }

    const currentFight = currentLog.data.fights.find(
      (fight) => fight.id === payload.fight
    );
    const startTime = currentFight ? currentFight.startTime : null;
    const endTime = currentFight ? currentFight.endTime : null;
    let path = `/${payload.log}/${payload.fight}/${payload.char}`;
    if (startTime && endTime) {
      path = path.concat(`?start_time=${startTime}&end_time=${endTime}`);
    }

    try {
      const response: AxiosResponse = await api.get(path);
      commit('addChar', {
        char: response.data as AnalysisInfo,
        charId: payload.char,
        fightId: payload.fight,
        log: payload.log,
      });
    } catch (err) {
      commit('setError', err);
    }
  },
};

export default actions;
