import { AxiosError, AxiosResponse } from 'axios';
import _find from 'lodash/find';
import _isEqual from 'lodash/isEqual';
import _map from 'lodash/map';
import _uniq from 'lodash/uniq';
import _without from 'lodash/without';
import { defineStore } from 'pinia';
import { RouteLocationNormalized } from 'vue-router';

import { api } from 'boot/axios';
import {
  AnalysisInfo,
  Encounter,
  Logs,
  Report,
  TableData,
} from 'components/models';

export interface EsoStateInterface {
  logs: Logs;
  encounters: Encounter[];
  route: RouteLocationNormalized;
  error: AxiosError;
}

export const useESOLogsStore = defineStore('esoLogs', {
  state: (): EsoStateInterface => ({
    logs: {} as Logs,
    encounters: [] as Encounter[],
    route: {} as RouteLocationNormalized,
    error: {} as AxiosError,
  }),
  getters: {},
  actions: {
    async requestLog(log: string) {
      this.clearError();

      if (this.logs[log]) return;

      try {
        const response: AxiosResponse = await api.get(`/${log}`);
        this.addLog(response.data as Report);
        this.setFightDurations(log);
        await this.setFightsDisplayNames(log);
      } catch (err) {
        this.setError(err as AxiosError);
      }
    },
    async requestEncounters(uniqueEncounters: number[]) {
      this.clearError();
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

      this.addEncounters(encounters);
    },

    // TODO: Either move to server- or client-side with enums
    async setFightsDisplayNames(log: string) {
      const toExclude = [0]; // Exclude encounterID = 0, it's a trash fight
      Object.values(this.encounters).forEach((encounter) =>
        toExclude.push(encounter.id)
      );

      const uniqueEncounters = _uniq(
        _without(
          _map(this.logs[log].data.fights, (fight) => fight.encounterID),
          ...toExclude
        )
      );

      await this.requestEncounters(uniqueEncounters);
      this.setDisplayNames(log);
    },
    async requestFight(payload: { log: string; fight: number }) {
      this.clearError();

      let currentLog = this.logs[payload.log];
      if (!currentLog) {
        await this.requestLog(payload.log);
        if (Object.keys(this.error).length !== 0) return;
        currentLog = this.logs[payload.log];
      }

      if (currentLog.fights[payload.fight]) return;

      const path = this.generatePath({
        log: payload.log,
        fight: payload.fight,
      });

      try {
        const response: AxiosResponse = await api.get(path);
        this.addFight({
          fight: response.data as TableData,
          fightId: payload.fight,
          log: payload.log,
        });
      } catch (err) {
        this.setError(err as AxiosError);
      }
    },
    async requestFightReport(payload: { log: string; fight: number }) {
      const path = this.generatePath({
        log: payload.log,
        fight: payload.fight,
        start: 'fight',
      });

      try {
        const response: AxiosResponse = await api.get(path);
        this.addFightReport({
          report: response.data as AnalysisInfo,
          fightId: payload.fight,
          log: payload.log,
        });
      } catch (err) {
        this.setError(err as AxiosError);
      }
    },
    async requestAnalysis(payload: {
      log: string;
      fight: number;
      char: number;
      target?: number[];
    }) {
      this.clearError();

      if (
        !this.logs[payload.log] ||
        !this.logs[payload.log].fights[payload.fight]
      ) {
        await this.requestFight({
          log: payload.log,
          fight: payload.fight,
        });
        if (Object.keys(this.error).length !== 0) return;
      }

      const target = payload.target ?? [0];
      const currentLog = this.logs[payload.log];
      const char = currentLog.fights[payload.fight].chars[payload.char] ?? null;
      const charTarget = char
        ? Object.keys(char).find((key) => _isEqual(char[key].ids, target))
        : null;

      if (char && charTarget) {
        return;
      }

      const path = this.generatePath({
        log: payload.log,
        fight: payload.fight,
        char: payload.char,
        target: payload.target,
      });

      try {
        const response: AxiosResponse = await api.get(path);
        this.addChar({
          target: payload.target,
          char: response.data as AnalysisInfo,
          charId: payload.char,
          fightId: payload.fight,
          log: payload.log,
        });
      } catch (err) {
        this, this.setError(err as AxiosError);
      }
    },
    generatePath(payload: {
      log: string;
      fight?: number;
      char?: number;
      target?: number[];
      start?: string;
    }) {
      let path = payload.start ? `/${payload.start}` : '';

      path = path.concat(`/${payload.log}`);
      path = payload.fight ? path.concat(`/${payload.fight}`) : path;
      path = payload.char ? path.concat(`/${payload.char}`) : path;
      path = path.concat('?');

      if (payload.target && payload.target.length !== 0) {
        for (const t of payload.target) path = path.concat(`target=${t}&`);
      }

      const currentFight = this.logs[payload.log].data.fights.find(
        (fight) => fight.id === payload.fight
      );
      const startTime = currentFight ? currentFight.startTime : null;
      const endTime = currentFight ? currentFight.endTime : null;
      if (startTime && endTime) {
        path = path.concat(`start_time=${startTime}&end_time=${endTime}`);
      }

      return path;
    },
    addLog(log: Report) {
      this.logs[log.code] = {
        data: log,
        fights: [],
      };
    },
    addFight(payload: { fight: TableData; fightId: number; log: string }) {
      const newFight = {
        data: payload.fight,
        chars: {},
      };
      this.logs[payload.log].fights[payload.fightId] = newFight;
    },
    addFightReport(payload: {
      report: AnalysisInfo;
      fightId: number;
      log: string;
    }) {
      this.logs[payload.log].fights[payload.fightId].report = payload.report;
    },
    addChar(payload: {
      target?: number[];
      char: AnalysisInfo;
      charId: number;
      fightId: number;
      log: string;
    }) {
      const { target, char, charId, fightId, log } = payload;
      const charAnalysis = this.logs[log].fights[fightId].chars[charId];
      if (!charAnalysis) {
        this.logs[log].fights[fightId].chars[charId] = {};
      }
      const key = char.currentTarget ? char.currentTarget.name : 'Overall';
      this.logs[log].fights[fightId].chars[charId][key] = {
        ids: target ? target : [0],
        report: char,
      };
    },
    setFightDurations(log: string) {
      const currentLog = this.logs[log];
      Object.values(currentLog.data.fights).forEach((fight) => {
        const timeDiff = fight.endTime - fight.startTime;
        fight.duration = new Date(timeDiff).toISOString().slice(14, 19);
      });
    },
    addEncounters(encounters: Encounter[]) {
      this.encounters.push(...encounters);
    },
    setDisplayNames(log: string) {
      const currentLog = this.logs[log];
      Object.values(currentLog.data.fights).forEach((fight) => {
        if (fight.encounterID === 0) {
          fight.displayName = 'Trash Fight';
          return;
        }
        const possibleDifficulties = _find(
          this.encounters,
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
    setRoute(route: RouteLocationNormalized) {
      this.route = route;
    },
    setError(error: AxiosError) {
      this.error = error;
    },
    clearError() {
      this.error = {} as AxiosError;
    },
  },
});
