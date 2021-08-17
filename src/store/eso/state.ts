import { AxiosError } from 'axios';
import { Encounter, Logs } from 'components/models';
import { RouteLocationNormalized } from 'vue-router';

export interface EsoStateInterface {
  logs: Logs;
  encounters: Encounter[];
  route: RouteLocationNormalized;
  error: AxiosError;
}

function state(): EsoStateInterface {
  return {
    logs: {} as Logs,
    encounters: [] as Encounter[],
    route: {} as RouteLocationNormalized,
    error: {} as AxiosError,
  };
}

export default state;
