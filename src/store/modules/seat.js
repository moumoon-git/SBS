export default {
  namespaced: true,
  state: {
    seatInformation: null, // 坐席信息
  },
  mutations: {
    updateSeatInformation(state, seatInformation) {
      state.seatInformation = seatInformation;
    },
  },
};
