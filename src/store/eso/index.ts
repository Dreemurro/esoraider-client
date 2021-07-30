import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { EsoStateInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const EsoModule: Module<EsoStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default EsoModule;
