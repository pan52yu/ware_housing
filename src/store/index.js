import Vue from "vue";
import Vuex from "vuex";
import { getLocal } from "@/utils/storage";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tabList: [
      { title: "工作台", path: "/dashboard" },
      ...(getLocal("tabList") || []),
    ],
    countVal: 0,
    currentIndex: "/dashboard",
  },
  mutations: {
    countVals(state) {
      state.countVal = state.tabList.length - 1;
    },
    setCurrentIndex(state, path) {
      state.currentIndex = path;
    },
    changCountVal(state, val) {
      state.countVal = val;
    },
    addTabs(state, tab) {
      if (
        tab.title &&
        state.tabList.every((item) => item.title !== tab.title)
      ) {
        state.tabList.push(tab);
      }
      state.tabList.forEach((item, index) => {
        if (item.path === tab.path) {
          state.countVal = index;
        }
      });
    },
    deleteTabs(state, i) {
      if (state.countVal === i) {
        state.countVal = state.tabList.length - 2;
      } else if (state.countVal > i) {
        state.countVal = state.countVal - 1;
      }
      state.tabList.splice(i, 1);
    },
  },
  actions: {},
  modules: {},
});
