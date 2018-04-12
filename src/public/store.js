import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
    villagePage: {
        title: '',
        village: {}
    }
};

const mutations = {
    updatedVillage(state, villageInfo) {
        state.villagePage = villageInfo;
    },
    updatedRepair(state,repair){
        console.log(repair);
    }
};
export default new Vuex.Store({
    state,
    mutations
});