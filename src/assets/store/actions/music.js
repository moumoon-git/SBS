import icp19 from "@/assets/js/HWICP-19.0/ucsApi";

/*
 *@describe 融合通讯 电话铃声
 */
export default {
  answerCalls({ commit, state }) {
    //接听之后
    commit("setMusicState", "-2"); //关闭铃声
  },
  diaboloMusic({ commit, state }, data) {
    //话机响铃
    if (
      data.important == undefined ||
      data.important == null ||
      data.important == ""
    ) {
      commit("setMusicState", "phone1"); //一般
    } else {
      if (data.important == "general") {
        commit("setMusicState", "phone1"); //一般
      } else if (data.important == "medium") {
        commit("setMusicState", "phone2"); //中等
      } else if (data.important == "important") {
        commit("setMusicState", "phone3"); //紧急
      } else if (data.important == "leader") {
        commit("setMusicState", "phone4"); //领导
      } else {
        commit("setMusicState", "phone1"); //一般
      }
    }
  }
};
