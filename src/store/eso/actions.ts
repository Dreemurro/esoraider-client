import { AxiosResponse } from 'axios';
import { api } from 'boot/axios';
import { AnalysisInfo, Encounter, Report, Table } from 'components/models';
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { EsoStateInterface } from './state';
import _uniq from 'lodash/uniq';
import _map from 'lodash/map';
import _without from 'lodash/without';

const actions: ActionTree<EsoStateInterface, StateInterface> = {
  async requestLog({ dispatch, commit, state }, log: string) {
    commit('clearError');

    if (Object.keys(state.log).length !== 0 && state.log.code === log) {
      return;
    }

    try {
      const response: AxiosResponse = await api.get(`/${log}`);
      commit('purgeFights');
      commit('setLog', response.data as Report);
      commit('setFightDurations');
      await dispatch('setFightsDisplayNames');
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

    commit('setEncounters', encounters);
  },
  // TODO: Either move to server- or client-side with enums
  async setFightsDisplayNames({ dispatch, commit, state }) {
    const toExclude = [0]; // Exclude encounterID = 0, it's a trash fight
    Object.values(state.encounters).forEach((encounter) =>
      toExclude.push(encounter.id)
    );

    const uniqueEncounters = _uniq(
      _without(
        _map(state.log.fights, (fight) => fight.encounterID),
        ...toExclude
      )
    );

    await dispatch('requestEncounters', uniqueEncounters);
    commit('setDisplayNames');
  },
  async requestFight(
    { commit, dispatch, state },
    payload: {
      log: string;
      fight: string;
    }
  ) {
    commit('clearError');

    if (Object.keys(state.log).length === 0) {
      await dispatch('requestLog', payload.log);
      if (Object.keys(state.error).length !== 0) return;
    }

    // If failed to convert (i.e. fight = 'last') - take the last fight id
    let fightId = Number(payload.fight);
    if (!fightId) {
      fightId = state.log.fights[state.log.fights.length - 1].id;
    }

    if (Object.keys(state.fights).length !== 0 && state.fights[fightId]) {
      commit('setFight', state.fights[fightId]);
      return;
    }

    const fight = state.log.fights.find((fight) => fight.id === fightId);
    const startTime = fight ? fight.startTime : null;
    const endTime = fight ? fight.endTime : null;

    let path = `/${payload.log}/${fightId}`;
    if (startTime && endTime) {
      path = path.concat(`?start_time=${startTime}&end_time=${endTime}`);
    }

    try {
      const response: AxiosResponse = await api.get(path);
      commit('setFight', response.data as Table);
      commit('addFight', {
        fight: response.data as Table,
        fight_id: payload.fight,
      });
    } catch (err) {
      commit('setError', err);
    }
  },
  async requestAnalysis(
    { commit, dispatch, state },
    payload: {
      log: string;
      fight: string;
      char: number;
    }
  ) {
    commit('clearError');

    if (Object.keys(state.fight).length === 0) {
      await dispatch('requestFight', {
        log: <string>state.route.params.log,
        fight: state.route.params.fight,
      });
      if (Object.keys(state.error).length !== 0) return;
    }

    if (
      Object.keys(state.char).length !== 0 &&
      state.char.char.id === payload.char
    ) {
      return;
    }

    // If failed to convert (i.e. fight = 'last') - take the last fight id
    let fightId = Number(payload.fight);
    if (!fightId) {
      fightId = state.log.fights[state.log.fights.length - 1].id;
    }

    const fight = state.log.fights.find((fight) => fight.id === fightId);
    const startTime = fight ? fight.startTime : null;
    const endTime = fight ? fight.endTime : null;

    let path = `/${payload.log}/${fightId}/${payload.char}`;
    if (startTime && endTime) {
      path = path.concat(`?start_time=${startTime}&end_time=${endTime}`);
    }

    try {
      const response: AxiosResponse = await api.get(path);
      commit('setChar', response.data as AnalysisInfo);
    } catch (err) {
      commit('setError', err);
    }
  },
};

export default actions;
