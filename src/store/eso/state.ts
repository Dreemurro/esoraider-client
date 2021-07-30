import { AxiosError } from 'axios';
import { Encounter, Table, Report, AnalysisInfo } from 'components/models';
import { RouteLocationNormalized } from 'vue-router';

export interface EsoStateInterface {
  log: Report;
  encounters: Encounter[];
  breadcrumbs: [];
  route: RouteLocationNormalized;
  fight: Table;
  fights: Record<number, Table>;
  char: AnalysisInfo;
  error: AxiosError;
}

function state(): EsoStateInterface {
  return {
    log: {} as Report,
    encounters: [] as Encounter[],
    breadcrumbs: [],
    route: {} as RouteLocationNormalized,
    fight: {} as Table,
    fights: {} as Record<number, Table>,
    char: {} as AnalysisInfo,
    error: {} as AxiosError,
  };
}

export default state;
