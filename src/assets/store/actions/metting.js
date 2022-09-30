import icp19 from "@/assets/js/HWICP-19.0/ucsApi";

/*
 *@author cr
 *@describe 融合通讯 会议模块actions
 */
export default {
  // 会议列表移除成员
  async RemoveFromConf({ commit, groupStatusClose, state }, data) {
    let VList = [...state.ConfMemberStatus1];
    let VNList = [...state.videoNumber];
    // let index = VList.findIndex(item => item.content.call == data.number);

    // VList = VList.filter(item => {
    //   if (item.content.call != data.memberNum) return item;
    // });
    VList.forEach(item => {
      if (item.content.call == data.memberNum) item.myState = data.status;
    });

    VNList = VNList.filter(item => {
      if (item != data.number) return item;
    });
    // VNList = VNList.filter(item != data.number)
    commit("SET_COMEMBER", VList);
    commit("SET_VIDEONUMBER", VNList);
  },
  // 集群会议 关闭/初始化
  async groupStatusClose({ dispatch, commit, state }) {
    commit("setConfStatus", false);
    commit("setConfId", 0);
    commit("setGroupActive", false);
    commit("setCurrentGroupName", "");
    commit("setGroupActive", false);

    await dispatch("removeAgentForList");
  },
  // 集群会议 开始
  async groupStatusStart({ commit, state }, data) {
    commit("setConfId", data.conf_id || ""); //设置会议ID
    commit("setConfStatus", true); //设置会议状态
    commit("setCurrentGroupName", data.groupNum); //设置集群会议名
  },
  // 会议列表添加坐席
  async addAgentForList({ commit, state }, data) {
    let VList = [...state.ConfMemberStatus1];
    let VNList = [...state.videoNumber];
    // console.log('VList: ', VList);
    // let exist =  VList.filter(v=>v.)
    //添加当前坐席
    VList.push({
      myAuto: false,
      myVideo: false,
      content: {
        call: sessionStorage.getItem("seat"),
        name: "当前坐席",
        numType: "1"
      },
      name:sessionStorage.getItem("seat")
    });
    VNList.push(sessionStorage.getItem("seat"));
    commit("SET_COMEMBER", VList);
    commit("SET_VIDEONUMBER", VNList);
  },
  // 会议列表移除坐席
  async removeAgentForList({ commit, state }, data) {
    let VList = [...state.ConfMemberStatus1];
    let VNList = [...state.videoNumber];
    VList = VList.filter(item => {
      if (item.content.call != sessionStorage.getItem("seat")) return item;
    });

    VNList = VNList.filter(item => {
      if (item != sessionStorage.getItem("seat")) return item;
    });
    commit("SET_COMEMBER", VList);
    commit("SET_VIDEONUMBER", VNList);
  },
  // 成员广播/禁播
  async ConfBoardCast({ commit, state }, data) {
    let VList = [...state.ConfMemberStatus1];
    let flag = true;
    let num = 0;
    // 只设置单个人员
    if (state.boardCasdIndex !== -1) {
      flag = false;
      VList[state.boardCasdIndex].myVideo = !VList[state.boardCasdIndex]
        .myVideo;
      VList.forEach(item => {
        if (item.myVideo) {
          num++;
        }
      });
      // 每个人员状态相同的时候才会去更改大状态
      if (num == 0 || num == VList.length) {
        flag = true;
      }
    } else {
      // 设置全部人员
      VList.forEach((o, i) => {
        if (data.isCannel == 1) o.myVideo = false;
        else if (data.isCannel == 0) o.myVideo = true;
      });
    }
    commit("SET_COMEMBER", VList);
    if (flag) {
      // 设置大状态
      commit(
        "SET_Broadcast",
        data.isCannel == 1 ? false : data.isCannel == 0 ? true : false
      );
    }
  },
  // 成员禁言发言
  async operateConfMemberEx({ commit, state }, data) {
    let VList = [...state.ConfMemberStatus1];
    let turth = false;
    if (data.type == 2 || data.type == 3) {
      data.type == 2 ? true : false;
      turth == 2 ? false : true;
      let flag = false;
      let num = 0;
      VList.forEach(item => {
        if (item.content.call == data.phoneNumber) item.myAuto = data.type == 3;
      });
      VList.forEach(item => {
        if (item.myAuto) {
          num++;
        }
      });
      if (num == 0 || num == VList.length) {
        flag = true;
      }
      turth = flag ? (data.type == 2 ? false : true) : state.ConfSpeakStatus;
      console.log(state.ConfSpeakStatus);
    } else if (data.type == 5 || data.type == 6) {
      turth = data.type == 5 ? false : true;
      VList.forEach(item => {
        item.myAuto = turth;
      });
    }
    commit("SET_COMEMBER", VList);
    commit("SET_Speak", turth);
  },
  // 集群会议添加 除了集群的 其他成员
  async JoinConfEx({ commit, state }) {
    let VList = [...state.ConfMemberStatus1];
    VList.forEach(item => {
      if (
        (!item.content.hasOwnProperty("grouping") ||
          item.content.grouping != "集群分组") &&
        item.content.call != sessionStorage.getItem("seat")
      ) {
        icp19.JoinConfEx3(
          Number(sessionStorage.getItem("agent_id")),
          Number(state.confId),
          0,
          item.content.call,
          Number(item.content.numType),
          item.content.name
        );
      }
    });
    commit("SET_COMEMBER", VList);
  },
  // 初始化或设置广播参数
  async initBoardParams({ commit, state }, data) {
    if (JSON.stringify(data) !== "{}") {
      commit("setBardStatus", data.bardStatus);
      commit("setBoardCasdIndex", data.boardCasdIndex);
    } else {
      commit("setBardStatus", 1);
      commit("setBoardCasdIndex", -1);
    }
  },
  async vodiListFor({ dispatch, commit, state }, data) {
    switch (data.status) {
      case 0:
        dispatch("RemoveFromConf", data);
        break;

      default:
        let VList = [...state.ConfMemberStatus1];
        VList.forEach(item => {
          if (item.content.call == data.memberNum) item.myState = data.status;
        });
        commit("SET_COMEMBER", VList);
        break;
    }
  },
  //移除列表状态
  async delecteVodiListFor({ commit, state }) {
    let VList = [...state.ConfMemberStatus1];
    VList.forEach(item => {
      item.myState = 3; //随便写一个状态，只要不是5就行
    });
    commit("SET_COMEMBER", VList);
  }
};
