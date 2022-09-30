import { mapGetters } from "vuex";
import store from "../../../../assets/store";

export default {
  data() {
    return {
      seatNumber: sessionStorage.getItem("seat"),
      agent_id: sessionStorage.getItem("agent_id") || "",
      HWICP_Version: window.g.HWICP_Version, //icp版本
      calculagraph: null, // 定时器
      IsZengChengProject: window.g.IsZengChengProject // 增城项目
    };
  },
  mounted() {},
  beforeDestroy() {},
  computed: {
    ...mapGetters({
      callIsVisible: "getCallStatus",
      isShowWind: "getIsShowWind",
      confStatus: "getConfStatus", //会议状态
      phoneList: "getPhoneList", //电话列表
      nowSelectPhoneList: "getNowSelectPhoneList", //现在选中的通话
      isCallPhone: "getIsCallPhone", //电话队列的通话状态
      conn: "getCallConn",
      phoneToPickMachine: "getPhoneToPickMachine", //话机是否处于摘机状态
      agentService: "getAgentService", // 坐席连接状态
      communicationService: "getCommunicationService", // 通讯服务状态
      makeCallMessage: 'getMakeCallMessage' // 通话成功的消息(针对优士康)
    })
  },
  watch: {
    /**
     * @author hexinting
     * @date 2020-10-29
     * @description 监听通话成功的消息
     */
    makeCallMessage: {
      handler: function (newVal, oldVal) {
        console.log('监听：makeCallMessage', newVal, oldVal)
      },
      deep: true
    }
  },
  methods: {
    /*     导出联系人模板方法 
          @author    xry
          @date  2020-9-14
    */

    handleExportm() {
      // 1.原方法
      // location.href = window.g.ApiUrl + "/eos/communication/contactor/export";
      // 2.携带验证方法
      let exportURL = `${window.g.ApiUrl}/eos/communication/contactor/export`;
      var xhr = new XMLHttpRequest();
      xhr.open("GET", exportURL, true);
      xhr.withCredentials = true;
      let token = localStorage.getItem("token");
      if (token == null) {
        token = "";
      }
      xhr.setRequestHeader("Authorization", token);
      xhr.responseType = "blob"; // 返回类型blob
      // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
      xhr.onload = function() {
        // 请求完成
        if (this.status === 200) {
          // 返回200
          var blob = this.response;
          var reader = new FileReader();
          reader.readAsDataURL(blob); // 转换为base64，可以直接放入a标签href
          reader.onload = function(e) {
            // 转换完成，创建一个a标签用于下载
            var a = document.createElement("a");
            a.download = "联系人模板.xlsx";
            a.setAttribute("target", "_blank");
            a.setAttribute("target", "_self");
            a.href = e.target.result;
            document.body.append(a); // 修复firefox中无法触发click
            console.log(a);
            a.click();
            // document.body.remove(a);
          };
        }
      };
      xhr.send();
    },
    //接听电话
    answerPhone() {
      this.$icp19.AnswerCall(Number(this.agent_id), Number(this.conn), 1);
    },
    //挂断电话
    hangUp(state) {
      console.log("-----mixins:hangUp");
      console.log("-----拒接------");
      this.$confirm("是否结束当前通话?", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      }).then(() => {
        // 先查看通话是否正常
        if (this.agent_id && this.conn) {
          this.$icp19.DropCall(Number(this.agent_id), Number(this.conn), "");
        }
        this.$store.commit("setNowSelectPhoneList", "");
        this.$store.commit("setIsMakeCallMobile", "");
        this.$store.commit("setIsCallType", "");
        this.$store.commit("setIsDialogType", "");
        this.$store.commit("setIsCallPhone", "");
      });
    },
    //添加电话到队列
    addPhoneCall(row) {
      // console.log(row);
      let content;
      if (row.number !== undefined) {
        if (row.number == "" || row.number == null) {
          this.$message.warning("当前联系人通话号码为空!");
          return;
        } else {
          content = {
            name: row.name,
            number: row.number,
            workUnit: row.workUnit,
            position: row.position,
            state: 0
          };
          //判断是否要加电话前缀
          // content.number= await this.addPhonePrefix(content.number);
        }
      } else {
        if (row.call == "" || row.call == null) {
          this.$message.warning("当前联系人通话号码为空!");
          return;
        } else {
          content = {
            name: row.oprName,
            number: row.call,
            workUnit: row.workUnit,
            position: row.position,
            state: 0
          };
          //判断是否要加电话前缀
          // content.number= await this.addPhonePrefix(content.number);
        }
      }

      let newA = false;
      this.phoneList.forEach(item => {
        if (item.content.number == content.number) {
          this.$message.warning("您已添加改成员到通话队列,不能重复添加");
          newA = true;
        }
      });
      if (newA) return;
      if (this.confStatus) {
        this.$message({
          message: "你正在会议中不可以拨打电话",
          type: "warning"
        });
        return;
      }
      let phoneList = [...this.phoneList];

      phoneList.push({
        myState: 0, // 0 >=待呼出 1>= 通话中  2>= 保持中 3>= 呼叫中 4>= 呼叫失败
        // myPhoneState:this.phoneState,
        content: content,
        time: "00:00:00",
        isCallState: true // 是否通话状态 // bug 7309 author:hexinting date:2020-10-26
      });
      this.$store.commit("setPhoneList", phoneList); //通话队列
    },
    // 通话状态确认
    confirmStatus() {
      let result = true;
      // 坐席信息
      if (this.$cookie.get('seatInformation') === 'null') {
        this.$message.warning('请先登录坐席');
      }
      // if (!sessionStorage.getItem("seat")) {
      //   this.$message.warning("请先登录坐席");
      //   result = false;
      // }
      if (!this.agentService || !this.communicationService) {
        this.$message.warning("通讯连接失败");
        result = false;
      }
      if (this.phoneToPickMachine) {
        this.$message.warning("话机处于摘机状态，请先挂机");
        result = false;
      }
      if (this.isCallPhone === "call" || this.isCallPhone === "talking") {
        this.$message.warning("正在通话中");
        result = false;
      }
      if (this.confStatus) {
        this.$message.warning("你正在会议中不可以拨打电话");
        result = false;
      }
      return result;
    },
    /**
     * @lastEditor hexinting
     * @lastEditTime 2020年12月25
     * @param {*} row 联系人数据
     * @param {*} number
     * @param {*} obj
     * @description 表格拨打电话  要添加到队列  先过滤再调用tableCall
     */
    async talkCall(row, number, obj) {
      if (!this.confirmStatus()) {
        return;
      }
      let content;
      // 最近联系人：接口返回的电话号码参数为mobile
      if (
        (row.number == "" || row.number == null) &&
        (row.call == "" || row.call == null) &&
        (row.mobile == "" || row.mobile == null)
      ) {
        this.$message.warning("当前联系人通话号码为空!");
        return;
      } else {
        let data = {
          phoneNum: row.number ? row.number : row.call ? row.call : row.mobile
        };
        var awaitRow;
        await this.$api.findContactorByMobile(data).then(res => {
          console.log(res)
          let info = res.mailContactor ? res.mailContactor : {};
          content = {
            name: info.name,
            number: data.number,
            workUnit: info.workUnit,
            position: info.position,
            state: 0,
            important:info.important,
            picture:info.picture
          };
          awaitRow = res.mailContactor;
          console.log("拨打号码", res.mailContactor, content);
        });
      }
      // 注释原因： 最近联系人接口返回的电话号码参数为mobile，以下方法缺少判断，并且冗余。 修改时间：2020年9月14日15:10:54
      // if (row.number !== undefined) {
      //   if (row.number == '' || row.number == null) {
      //     this.$message.warning("当前联系人通话号码为空!");
      //     return;
      //   } else {
      //     let data = { number: row.number };
      //     await this.$api.findContactorByMobile(data).then(res => {
      //       // console.log(res.data);
      //       let info = res.data ? res.data : {};
      //       content = {
      //         name: info.name,
      //         number: data.number,
      //         workUnit: info.workUnit,
      //         position: info.position,
      //         state: 0
      //       }
      //     });

      //   }
      // } else {
      //   if (row.call == '' || row.call == null) {
      //     this.$message.warning("当前联系人通话号码为空!");
      //     return;
      //   } else {
      //     let data = { number: row.call };
      //     await this.$api.findContactorByMobile(data).then(res => {
      //       // console.log(res.data);
      //       let info = res.data ? res.data : {};
      //       content = {
      //         name: info.name,
      //         number: data.number,
      //         workUnit: info.workUnit,
      //         position: info.position,
      //         state: 0
      //       }
      //     });
      //   }
      // }
      let mobile;
      mobile = content.number;
      if (number) mobile = number; // 当只传入号码
      // bug9749 增城项目不需要呼叫确认框 author:hexinting date:2020-12-25
      if (this.IsZengChengProject) {
        this.tableCall(mobile, content, obj, row.picture ? row : awaitRow);
      } else {
        this.$confirm("确认呼叫当前号码?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.tableCall(mobile, content, obj, row.picture ? row : awaitRow);
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消呼叫"
          });
        });
      }
    },
    /**
     * @param {type} mobile, content, obj, row
     * @return {type} return underfine
     * @descripttion: 拨打电话和拨号打电话函数
     */
    //拨号
    tableCall(mobile, content, obj, row) {
      // console.log(mobile, content);
      // this.$nextTick(() => {
      // this.$confirm("确认呼叫当前号码?", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning"
      // })
      //   .then(() => {
          let newA = false;
          this.phoneList.forEach(item => {
            if (item.content.number == content.number) {
              // this.$message.warning("您已添加改成员到通话队列,不能重复添加");
              newA = true;
            }
          });
          if (!newA) {
            let phoneList = [...this.phoneList];
            phoneList.push({
              myState: 0, // 0 >=待呼出 1>= 通话中  2>= 保持中 3>= 呼叫中 4>= 呼叫失败
              content: content,
              time: "00:00:00",
              isCallState: true // 是否通话状态 // bug 7309 author:hexinting date:2020-10-26
            });
            // console.log(keepList,'????????///////');
            this.$store.commit("setPhoneList", phoneList); //通话队列
          }
          let keepList = [];
          keepList.push({
            myState: 0, // 0 >=待呼出 1>= 通话中  2>= 保持中 3>= 呼叫中 4>= 呼叫失败
            content: content,
            time: "00:00:00",
            isCallState: false,
            picture: row.picture
          });
          this.$store.commit("setNowSelectPhoneList", ""); //先清空
          this.$store.commit("setNowSelectPhoneList", keepList); //添加到现在选中的通话
          console.log("1111");
          let self = this;
          if (self.HWICP_Version == "HWICP-19.0") {
            this.$icp19.MakeCall(
              Number(self.agent_id),
              mobile,
              self.seatNumber.toString(),
              obj
            );
            this.$store.commit("setIsMakeCallMobile", mobile); //存储当前被叫的号码
            this.$store.commit("setIsCallType", "callOut"); //电话类型改为拨出
            this.$store.commit("setIsDialogType", "small"); //small弹窗。
            this.$store.commit("setIsCallPhone", "call");
            this.$store.commit("setMakeCallMessage", null); // 拨打电话后优士康返回的回调消息
            this.isRecevieMessage(); // 监听通话是否拨出去,是否摘机 针对优士康设备限制做出的处理 author：hexinting,date:20201028
            // //呼叫中操作显示
            // let atPresentPhone= [...this.nowSelectPhoneList],phoneList= [...this.phoneList];
            // console.log(atPresentPhone, phoneList);
            // atPresentPhone.forEach((item, index)  =>{
            //   phoneList.forEach((items, indexs) =>{
            //     // if(item.content.number==items.content.number){
            //     //   this.phoneList[indexs].myState=3
            //     // }
            //     phoneList[indexs].isCallState=true //呼叫中不能再拨打其他号码
            //   })
            // })
          }
        // })
        // .catch(() => {
        //   this.$message({
        //     type: "info",
        //     message: "已取消呼叫"
        //   });
        // });
      // })
    },
    /**
      * @param {mobile: String} 呼出号码
      * @param {obj: Object}
      * @author hexinting
      * @date 2020-12-25
      * @description 呼出电话
      */
    makeCall(mobile, obj) {
      let self = this;
      if (self.HWICP_Version == "HWICP-19.0") {
        this.$icp19.MakeCall(
          Number(self.agent_id),
          mobile,
          self.seatNumber.toString(),
          obj
        );
        this.$store.commit("setIsMakeCallMobile", mobile); //存储当前被叫的号码
        this.$store.commit("setIsCallType", "callOut"); //电话类型改为拨出
        this.$store.commit("setIsDialogType", "small"); //small弹窗。
        this.$store.commit("setIsCallPhone", "call");
        this.$store.commit("setMakeCallMessage", null); // 拨打电话后优士康返回的回调消息
        this.isRecevieMessage(); // 监听通话是否拨出去,是否摘机 针对优士康设备限制做出的处理 author：hexinting,date:20201028
        // //呼叫中操作显示
        // let atPresentPhone= [...this.nowSelectPhoneList],phoneList= [...this.phoneList];
        // atPresentPhone.forEach((item, index)  =>{
        //   phoneList.forEach((items, indexs) =>{
        //     if(item.content.number==items.content.number){
        //       this.phoneList[indexs].myState=3
        //     }
        //     phoneList[indexs].isCallState=true //呼叫中不能再拨打其他号码
        //   })
        // })
      }
    },
    /**
      * @param {row: Object}
      * @param {number: Object} 呼出号码
      * @param {obj: Object}
      * @lastEditor hexinting
      * @lastDate 2020-12-25
      * @description 拨号盘拨出  不需要添加到队列（后期发现只能用在已经添加到队列里的拨号）
      */
    makeCallDish(row, number, obj) {
      if (!this.confirmStatus()) {
        return;
      }
      let mobile;
      if (row.number) {
        mobile = row.number;
      }
      if (number) mobile = number; // 当只传入号码
      // console.log(mobile)
      // this.$nextTick(() => {
      // bug9749 增城项目不需要呼叫确认框 author:hexinting date:2020-12-25
      if(this.IsZengChengProject) {
        this.makeCall(mobile, obj);
      } else {
        this.$confirm("确认呼叫当前号码?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.makeCall(mobile, obj);
            // let self = this;
            // if (self.HWICP_Version == "HWICP-19.0") {
            //   this.$icp19.MakeCall(
            //     Number(self.agent_id),
            //     mobile,
            //     self.seatNumber.toString(),
            //     obj
            //   );
            //   this.$store.commit("setIsMakeCallMobile", mobile); //存储当前被叫的号码
            //   this.$store.commit("setIsCallType", "callOut"); //电话类型改为拨出
            //   this.$store.commit("setIsDialogType", "small"); //small弹窗。
            //   this.$store.commit("setIsCallPhone", "call");
            //   this.$store.commit("setMakeCallMessage", null); // 拨打电话后优士康返回的回调消息
            //   this.isRecevieMessage(); // 监听通话是否拨出去,是否摘机 针对优士康设备限制做出的处理 author：hexinting,date:20201028
            //   // //呼叫中操作显示
            //   // let atPresentPhone= [...this.nowSelectPhoneList],phoneList= [...this.phoneList];
            //   // atPresentPhone.forEach((item, index)  =>{
            //   //   phoneList.forEach((items, indexs) =>{
            //   //     if(item.content.number==items.content.number){
            //   //       this.phoneList[indexs].myState=3
            //   //     }
            //   //     phoneList[indexs].isCallState=true //呼叫中不能再拨打其他号码
            //   //   })
            //   // })
            // }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消呼叫"
            });
          });
        // })
      }
    },
    /**
    * @description 解决摘机状态下，坐席拨打手机号码，设备限制无法返回提示的问题.如果15秒后没有收到消息，则初始化拨打电话状态(针对优士康) bug7309
    * @author hexinting
    * @date 2020-11-06
    */
    isRecevieMessage() {
      console.log('1-监听通话是否拨出去,是否摘机.判断是否有定时器')
      if (this.calculagraph) {
        console.log("2-有定时器,清除定时器")
        clearTimeout(this.calculagraph)
      }
      console.log("3-没有定时器，设置定时器")
      this.calculagraph = setTimeout(() => {
        if (!this.makeCallMessage) {
          store.commit("setNowSelectPhoneList", ''); //现在选中电话列表
          store.commit("setIsMakeCallMobile", ''); //被叫号码
          store.commit("setIsCallType", ''); // 呼叫类型
          store.commit('setIsDialogType', ''); // 弹出弹窗类型
          store.commit("setIsCallPhone", ''); // 是否正在通话
          store.commit("setPhoneList", []); // 通话队列 清除
          this.$message.error('无法呼叫，请检查设备是否正常');
          console.log('4-无法呼叫，请检查设备是否正常')
        }
      }, 15000)
    }
  }
};
