<template>
  <div class="phoneDial-right">
    <div
      :class="[
        phoneList.length > 0
          ? 'planTop'
          : phoneState == 0
          ? 'planTop'
          : 'planTop2',
      ]"
    >
      <div
        v-if="phoneList.length == 0"
        style="
          position: absolute;
          left: 50%;
          width: 150px;
          margin-left: -67px;
          text-align: center;
          top: 320px;
          font-weight: 500;
          font-size: 12px;
          color: rgba(202, 213, 232, 1);
        "
      >
        暂无通话队列
      </div>
      <el-scrollbar style="height: 100%">
        <div class="my-fax-list-box">
          <div
            class="threePhone-list"
            v-if="phoneState == 0"
            v-for="item in threePhoneList"
          >
            <div>
              <div
                style="
                  background: rgba(247, 248, 250, 1);
                  height: 30px;
                  padding: 5px 10px;
                "
              >
                <span style="color: rgba(0, 145, 255, 1); font-size: 12px"
                  >三方通话中</span
                >
                <span style="font-size: 12px">{{ item.time }}</span>
              </div>
              <div
                style="font-size: 12px"
                v-for="(items, indexs) in item.content"
                :key="indexs"
              >
                <div style="display: flex; padding: 10px 5px">
                  <div style="flex: 1" class="threeList-left">
                    <span class="threeNumberIndex">{{ indexs + 1 }}</span>
                  </div>
                  <div style="flex: 5">
                    <div>
                      <span style="width: 60px; display: inline-block">{{
                        items.name
                      }}</span>
                      <span style="padding-left: 15px">{{
                        items.position
                      }}</span>
                    </div>
                    <div style="padding-top: 6px">{{ items.workUnit }}</div>
                  </div>
                  <div style="flex: 3">
                    <div
                      :class="[
                        items.state == 1 || items.state == 2
                          ? 'blueSize'
                          : items.state == 0
                          ? 'yellowSize'
                          : 'redSize',
                      ]"
                    >
                      {{
                        items.state == 1
                          ? "通话中"
                          : items.state == 2
                          ? "呼叫中"
                          : items.state == 3
                          ? "呼叫失败"
                          : items.state == 0
                          ? "本人"
                          : "已挂断"
                      }}
                    </div>
                    <div style="padding-top: 6px">{{ items.number }}</div>
                  </div>
                  <div
                    style="
                      flex: 1;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                    "
                  >
                    <i
                      class="el-icon-close"
                      v-if="items.state != 0"
                      @click="closeThreeList(items, indexs)"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- bug 7309 author:hexinting date:2020-10-29 isCallState为false则表示不在通话状态，通话队列要移除该号码 -->
          <div
            class="my-fax-list1"
            v-for="(item, index) in phoneList.filter((el) => el.isCallState)"
            :key="index"
            :class="{ boderBox: changeRed == index }"
          >
            <i class="el-icon-close" @click="myDelete(index)"></i>
            <div
              class="my-fax-list1-left-box"
              @click="phoneListClick(item, index)"
            >
              <div class="my-fax-list1-right">
                <div
                  style="
                    width: 69%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    display: inline-block;
                  "
                >
                  <span>{{ item.content.name }}</span>
                  <span style="padding-left: 20px">{{
                    item.content.workUnit
                  }}</span>
                </div>
                <div style="display: inline; float: right">
                  <span
                    style="font-size: 12px"
                    :class="[item.myState == 4 ? 'redSize' : 'blueSize']"
                  >
                    {{
                      item.myState == 0
                        ? "待呼出"
                        : item.myState == 1
                        ? "通话中"
                        : item.myState == 2
                        ? "保持中"
                        : item.myState == 3
                        ? "呼叫中"
                        : item.myState == 5
                        ? "转接中"
                        : "呼叫失败"
                    }}
                  </span>
                  <span style="font-size: 12px; padding-left: 10px">{{
                    item.time
                  }}</span>
                </div>
              </div>
              <div class="my-fax-list1-right" style="padding-top: 12px">
                <span style="color: #909399; font-size: 12px">{{
                  item.content.position
                }}</span>
                <span style="float: right; font-size: 12px">{{
                  item.content.number
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <el-form
      ref="ruleForm"
      class="auto-call"
      label-width="80px"
      :model="autoCallForm"
      :rules="autoCallRules"
    >
      <el-form-item label="自动转接" prop="phone">
        <el-autocomplete
          v-model="autoCallForm.phone"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入手机号码"
          size="small"
          style="width: 184px"
          clearable
          @focus="changePhone"
          @select="handleSelect"
          @input="handleInput"
        ></el-autocomplete>
      </el-form-item>
      <el-button @click="getSeatDuty" type="primary" size="small"
        >选择</el-button
      >
      <el-tooltip :content="isAutoCall" placement="top">
        <!-- :disabled="autoCallForm.phone === ''" -->
        <el-switch
          v-model="isAutoCall"
          active-color="#0091FF"
          inactive-color="#CACACA"
          active-value="开"
          inactive-value="关"
          @change="setForwardingPhone"
        >
        </el-switch>
      </el-tooltip>
    </el-form>
    <div style="margin-top: 10px">
      <div class="cardPlan">
        <div class="flexBox">
          <el-card
            v-for="(item, index) in box"
            :style="
              item.start
                ? 'color:black;border-radius: 0;'
                : 'color:#909399;border-radius: 0;'
            "
            :shadow="showFun"
            :class="[
              item.current == 0 && item.start ? 'cardShaShow' : 'cardShaHide',
            ]"
            :key="index"
          >
            <div
              @mouseover="changeMask(item, index)"
              class="dialBox"
              @mouseleave="changeGoBack(item, index)"
              @click="chaneClick(item, index)"
            >
              <div style="padding-top: 20px">
                <div
                  style="height: 61px; width: 61px"
                  :style="{
                    backgroundImage: 'url(' + item.url + ')',
                    'background-size': '61px 61px',
                    'background-position': 'center center',
                  }"
                ></div>
                <div class="divBox">{{ item.text }}</div>
              </div>
            </div>
          </el-card>
        </div>

        <!--拨号盘-->
        <transition name="el-zoom-in-bottom">
          <div v-show="showDialPlate" class="transition-box">
            <dial-plate
              @closeModel="closeModel"
              @dialing="dialing"
            ></dial-plate>
          </div>
        </transition>

        <transition name="el-zoom-in-bottom">
          <div v-if="showAdaptor" class="transition-box">
            <through-connection-plane
              :threeCall="threeCall"
              @affirmModel="affirmModel"
              ref="throughConnection"
              @closeConnectionModel="closeConnectionModel"
            ></through-connection-plane>
          </div>
        </transition>

        <!--选择转接班次值班人员号码-->
        <transition name="el-zoom-in-bottom">
          <div
            v-show="showDutyOfficer"
            class="transition-box"
            style="padding-right: 10px"
          >
            <div class="beOnDuty">
              <div>值班员选择</div>
              <i class="el-icon-error" @click="colseDutyOfficer"></i>
            </div>
            <div style="border: 1px solid; border-top: none">
              <div class="memberSearch">
                <div>坐席值班员：</div>
                <el-col :span="13">
                  <el-autocomplete
                    class="inline-input"
                    v-model="searchKey"
                    :fetch-suggestions="filterMember"
                    placeholder="请输入姓名、号码"
                    :trigger-on-focus="false"
                    size="small"
                    @select="handleMember"
                  ></el-autocomplete>
                </el-col>
                <el-button type="primary" size="small" style="margin-left: 10px"
                @click.enter.stop="searchMember"
                  >检索</el-button
                >
              </div>
              <div>
                <div class="beOnDutyTitle">当前坐席班次值班员</div>
                <ul class="shiftPersonnel" v-if="shiftPersonnel.length > 0">
                  <li
                    class="everyShiftPersonnel"
                    v-for="item in shiftPersonnel"
                  >
                    <div class="groupName" :title="item.groupName">
                      {{ item.groupName }}
                    </div>
                    <ul class="shiftMember">
                      <li
                        class="dutys"
                        v-for="one in item.dutys"
                        :key="one.id"
                        :style="
                          one.id == transferMemberId ? slectMemberStyle : ''
                        "
                        @click="toTransfer(one)"
                        :title="one.dutyContactorName"
                      >
                        {{ one.dutyContactorName }}
                      </li>
                    </ul>
                  </li>
                </ul>

                <div v-else style="border-top: 1px solid; text-align: center">
                  暂无数据
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import dialPlate from "../../../../../components/dialPlate";
import throughConnectionPlane from "./throughConnection";
import bus from "../../../../../components/common/js/eventBus";
import mixin from "../mixin";
import { mapGetters } from "vuex";
import axios from "axios";

export default {
  mixins: [mixin],
  name: "phoneDial",
  components: {
    dialPlate,
    throughConnectionPlane,
  },
  data() {
    // let number = (rule, value, callback) => {
    //   let num = /^1(3|4|5|6|7|8|9)\d{9}$/;
    //   let n = value.match(num);
    //   if (value =='' || value == null){
    //     callback();
    //   } else if (n == null) {
    //     callback(new Error('请输入正确的手机号码!'));
    //   }
    //   callback();
    // };
    return {
      showFun: "never",
      showDialPlate: false,
      changeRed: -1,
      toState: true, //鼠标移出时是否改变
      showAdaptor: false, // 转接弹窗
      agent_id: sessionStorage.getItem("agent_id") || "",
      showListBox: false,
      isAutoCall: "关", // 关： 关闭自动转接；开： 开启自动转接
      autoCallForm: {
        phone: "", // 自动转接号码
      },
      autoCallRules: {
        phone: [
          // 自动转接号码
          // { required: false, validator: number, trigger: 'blur' }
          {
            required: false,
          },
        ],
      },
      autoCallPhoneList: [], // 自动转接配置的电话列表
      timeout: null,
      showDutyOfficer: false, // 选择班次值班人员弹窗
      shiftPersonnel: [], // 所有班次数据
      transferMemberId: "", //转接号码
      slectMemberStyle: { "background-color": "violet" }, // 选中转接成员样式
      searchKey: "", // 搜索班次成员信息
      restaurants: [], // 所有班次中的值班员集合
      left: 0,
      width: document.body.clientWidth,
      callBack: "", // 搜索结果回调
      queryString: "", // 搜索关键字
    };
  },
  watch: {
    phoneList: {
      handler(neW, olD) {
        console.log(neW);
        if (neW.length == 0) {
          this.box[1].current = 0;
          this.box[1].start = false;
          this.box[1].url = "/static/img/phoneCallImg/callGray.png";
          if (this.phoneState == 0) {
            //等于三方就不清空
            return;
          }
          this.$store.commit("setNowSelectPhoneList", ""); //先清空
        }
      },
      deep: true,
    },

    nowSelectPhoneList: {
      handler(neW, olD) {
        if (neW !== olD) {
          console.log(neW);
          if (neW.length <= 0) {
            this.changeRed = -1;
            this.toState = true;
          }
          this.phoneList.forEach((item, index) => {
            neW.forEach((items, indexs) => {
              if (item.content.number == items.content.number) {
                this.changeRed = index;
                this.toState = false;
              }
            });
          });
        }
      },
      deep: true,
    },
    /**
     * @author hexinting
     * @lastAuthor hexinting
     * @lastDate 2020-9-27
     * @description 监听自动转接设置
     */
    autoCallSettings: {
      handler: function (newVal, oldVal) {
        console.log("监听自动转拨");
        console.log("自动转拨", newVal, oldVal);
        this.autoCallForm.phone = newVal.phone;
        this.isAutoCall = newVal.isAutoCall;
        if (
          newVal.phone !== oldVal.phone ||
          newVal.agentId !== oldVal.agentId
        ) {
          if (newVal.phone !== '') {
              this.findCallForwarding()
            }
        }
      },
      deep: true,
    },
  },
  computed: {
    ...mapGetters({
      box: "getBoxList", //获取到当前拨号盘能点击的按钮
      phoneList: "getPhoneList",
      nowSelectPhoneList: "getNowSelectPhoneList", //现在选中的通话
      conn: "getCallConn",
      phoneState: "getPhoneState", //当前通话的状态
      threePhoneList: "getThreePhoneList", //三方通话的队列
      isCallPhone: "getIsCallPhone", //电话队列的通话状态
      isPhoneCallStatus: "getIsPhoneCallStatus", //在通话中队列可不可操作
      autoCallSettings: "getAutoCallSettings", //自动转接设置
    }),
  },
  mounted() {
    this.findCallForwarding();
    // if(this.autoCallSettings.isAutoCall !== '关'){
    //     this.findCallForwarding()
    // }
    // 拉伸屏幕监听值班人员搜索下拉
    window.onresize = () => {
      document.getElementsByClassName('el-autocomplete-suggestion')[1].style.top=document.body.clientHeight*0.74+'px'
      if (this.width == document.body.clientWidth) {
        document.getElementsByClassName('el-autocomplete-suggestion')[1].style.left=document.body.clientWidth*0.845+'px'
      }else if (document.body.clientWidth>1600) {
        document.getElementsByClassName('el-autocomplete-suggestion')[1].style.left=document.body.clientWidth*0.822+'px'
      }else{
        document.getElementsByClassName('el-autocomplete-suggestion')[1].style.left=document.body.clientWidth*0.815+'px'
      }
    };
  },
  methods: {
    //通话队列
    phoneListClick(item, index) {
      console.log(item);
      let atPresentPhone = [];
      atPresentPhone.push(item); //用来存储在Vuex里面
      if (this.isCallPhone == "hangUp") {
        //未通话时，每次点击电话列表都把点击的数据放入全局, 未通话时可修改
        this.$store.commit("setNowSelectPhoneList", ""); //先清空
        this.$store.commit("setNowSelectPhoneList", atPresentPhone); //添加到现在选中的通话
        this.changeRed = index;
      }
      if (
        (this.isCallPhone == "call" || this.isCallPhone == "talking") &&
        this.isPhoneCallStatus
      ) {
        //通话中但是是转接或者三方保持都可修改
        // this.itemListPhone=atPresentPhone  //每次点击都存储起来
        this.$nextTick(() => {
          this.$refs.throughConnection.assignment(atPresentPhone);
        });
        console.log(atPresentPhone);
      }
      console.log([...this.nowSelectPhoneList]);
      let myState = false; //用来判断在保持中能不能改变拨号盘 true>= 保持 false >=没保持
      if (
        [0, 3, 4].includes(item.myState) &&
        [false].includes(item.isCallState)
      ) {
        // 0 >=待呼出 1>= 通话中  2>= 保持中 3>= 呼叫中 4>= 呼叫失败
        console.log(item.myState);
        this.toState = false;
        this.changeRed = index;
        let phoneList = [...this.phoneList];
        phoneList.forEach((items) => {
          //获取当前选中的列表是不是在保持中
          if (items.myState == 2) {
            myState = true;
          }
});
        if (!myState) {
          //把phoneList第二条变为拨号盘 ,且保持中是不能修改当前选中保存的这个区状态管理
          this.box[1].current = 0;
          this.box[1].start = true;
          this.box[1].url = "/static/img/phoneCallImg/callBlue.png";
        }      }
      if ([1, 2].includes(item.myState) && [false].includes(item.isCallState)) {
        console.log(item.myState);
        this.toState = false;
        this.changeRed = index;
        console.log("~~~~~~~~~~~~~~");
      }
    },
//鼠标移入
      changeMask(item, index) {
        if (item.start) {
          let caseData = index;
          switch (caseData) {
            case 0:
              this.box[caseData].current = 0;
              this.box[caseData].url = '/static/img/phoneCallImg/peopleBlue.png'
              break;
            case 1:
              if (this.box[caseData].text == '拨号盘') {
                this.box[caseData].current = 0;
                this.box[caseData].url = '/static/img/phoneCallImg/callBlue.png'            }
            if (this.box[caseData].text == "挂断") {
              this.box[caseData].current = 0;
              this.box[caseData].url = "/static/img/phoneCallImg/hangup.png";
            }
            break;
          case 2:
            this.box[caseData].current = 0;
            this.box[caseData].url = "/static/img/phoneCallImg/recoverBlue.png";
            break;
          case 3:
            this.box[caseData].current = 0;
            this.box[caseData].url = "/static/img/phoneCallImg/switchBlue.png";
            break;
          case 4:
            this.box[caseData].current = 0;
            this.box[caseData].url = "/static/img/phoneCallImg/phoneBlue.png";
            break;
          case 5:
            this.box[caseData].current = 0;
            this.box[caseData].url =
              "/static/img/phoneCallImg/keepCallingBlue.png";
            break;
          default:
            break;
        }
      }
    },

    //鼠标移出
    changeGoBack(item, index) {
      if (item.start) {
        if (this.toState) {
          let caseData = index;
          switch (caseData) {
            case 0:
              this.box[caseData].current = 0;
              this.box[caseData].url =
                "/static/img/phoneCallImg/peopleBlue.png";
              break;
            case 1:
              if (this.box[caseData].text == "拨号盘") {
                this.box[caseData].current = 1;
                this.box[caseData].url =
                  "/static/img/phoneCallImg/callGray.png";
              }
              if (this.box[caseData].text == "挂断") {
                this.box[caseData].current = 1;
                this.box[caseData].url = "/static/img/phoneCallImg/hangup.png";
              }
              break;
            case 2:
              this.box[caseData].current = 1;
              this.box[caseData].url =
                "/static/img/phoneCallImg/recoverGray.png";
              break;
            case 3:
              this.box[caseData].current = 1;
              this.box[caseData].url =
                "/static/img/phoneCallImg/switchGray.png";
              break;
            case 4:
              this.box[caseData].current = 1;
              this.box[caseData].url = "/static/img/phoneCallImg/phoneBlue.png";
              break;
            case 5:
              this.box[caseData].current = 1;
              this.box[caseData].url =
                "/static/img/phoneCallImg/keepCallingGray.png";
              break;
            default:
              break;
          }
        }
      }
    },

    //鼠标点击
    chaneClick(item, index) {
      //0=>三方 1=>拨号 2=>恢复 3=>转接 4=>拨号盘 5=>保持

      if (item.start) {
        if ([0].includes(index)) {
          //三方通话
          bus.$emit("threeSidesChange");
          this.threeCall = true;
          this.showAdaptor = true;
          this.$store.commit("setIsPhoneCallStatus", true); //只有通话中才能转接,提交三方能操作队列
        }

        if ([1].includes(index)) {
          //挂断
          if (item.text == "挂断") {
            this.$confirm("是否结束当前通话?", "提示", {
              confirmButtonText: "是",
              cancelButtonText: "否",
              type: "warning",
            }).then(() => {
              let self = this;
              this.$icp19.DropCall(
                Number(self.agent_id),
                Number(self.conn),
                ""
              );
            });
            return;
          }
          //呼叫
          let nowSelectPhoneList = [...this.nowSelectPhoneList];
          console.log(nowSelectPhoneList);
          this.makeCallDish(nowSelectPhoneList[0].content); //呼叫 , 因为默认存的是一条数据，取第一条就行了
        }

        //电话恢复
        if ([2].includes(index)) {
          this.$confirm("是否恢复当前通话?", "提示", {
            confirmButtonText: "是",
            cancelButtonText: "否",
            type: "warning",
          }).then(() => {
            let self = this;
            this.$icp19.AlternateCall(
              Number(self.agent_id),
              Number(self.agent_id),
              Number(self.conn)
            );
          });
        }

        //电话转接
        if ([3].includes(index)) {
          bus.$emit("transferChange");
          this.threeCall = false;
          this.showAdaptor = true;
          this.$store.commit("setIsPhoneCallStatus", true); //只有通话中才能转接,提交转接能操作队列
        }

        //拨号盘
        if ([4].includes(index)) {
          this.showDialPlate = true;
        }

        //保持
        if ([5].includes(index)) {
          this.$confirm("保持当前通话?", "提示", {
            confirmButtonText: "是",
            cancelButtonText: "否",
            type: "warning",
          })
            .then(() => {
              let self = this;
              this.$icp19.HeldCall(Number(self.agent_id), Number(self.conn));
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消",
              });
            });
        }
      }
    },

    //关闭拨号
    closeModel() {
      this.showDialPlate = false;
    },

    //号码转换,
    //注意：现在所有的号码转换都在UCS做了，EOS不用做号码转换了
    async phoneTransform(number) {
      let data = {
        number: number,
        agentId: sessionStorage.getItem("agent_id") || "",
      };
      let phoneCall = "";
      await this.$api.validateNumber(data).then((res) => {
        phoneCall = res;
      });
      return phoneCall;
    },

    //确认关闭 转接 / 三方
    affirmModel(state, speakToPeople) {
      this.$store.commit("setIsPhoneCallStatus", false); //确认转接和取消后都不可再对phoneList队列进行操作
      this.phoneTransform(speakToPeople.mobile).then((result) => {
        let self = this;
        if (!state) {
          //普通转接
          this.$icp19.TransferCallOneKey(
            Number(self.agent_id),
            speakToPeople.mobile
          );
        } else {
          //三方拨号
          this.$icp19.ThreeWayConf(
            Number(self.agent_id),
            Number(self.conn),
            speakToPeople.mobile,
            1
          );
        }
      });
      this.showAdaptor = false;
    },

    //取消关闭 转接 / 三方
    closeConnectionModel() {
      this.$store.commit("setIsPhoneCallStatus", false); //确认转接和取消后都不可再对phoneList队列进行操作
      this.showAdaptor = false;
    },

    //通话队列删除
    myDelete(index) {
      let phoneList = [...this.phoneList];
      if (phoneList[index].myState !== 0) {
        if (phoneList[index].isCallState) {
          this.$confirm("当前联系人正在通话中,该操作将关闭当前对话?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            let self = this;
            this.$icp19.DropCall(Number(self.agent_id), Number(self.conn), "");
          });
        } else {
          this.changeRed = -1;
          phoneList.splice(index, 1);
          this.$store.commit("setPhoneList", phoneList); //通话队列
        }
        // 挂断电话
        this.hangUp();
      } else {
        console.log(index);
        this.changeRed = -1;
        phoneList.splice(index, 1);
        this.$store.commit("setPhoneList", phoneList); //通话队列
      }
    },

    //拨号盘拨号
    dialing(data) {
      console.log(data);
      if (data.phoneNumber) {
        let rowNumber = {
          number: data.phoneNumber,
        };
        console.log(rowNumber);
        this.talkCall(rowNumber); //拨号盘呼叫

        this.$store.commit("setDialable", true); //通话队列
      }
    },

    //删除三方通话中的一人
    closeThreeList(item, i) {
      // console.log(item);
      // let phoneCall
      // this.$api.validateNumber(data).then(res => {
      //   phoneCall=res
      // });
      let threePhoneList = [...this.threePhoneList];
      this.phoneTransform(item.number).then((result) => {
        if (threePhoneList[0].content[i].state == 1) {
          this.$confirm("当前联系人正在通话中,该操作将关闭当前对话?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            let confId = this.$store.getters.getThreePhoneId; //获取三方通话ID

            this.$icp19.RemoveFromConfEx(
              Number(this.agent_id),
              Number(confId),
              0,
              item.number,
              1
              // result
            );
            // threePhoneList[0].content.splice(i, 1);
            // this.$store.commit("setThreePhoneList", threePhoneList);//通话队列
          });
        } else {
          let confId = this.$store.getters.getThreePhoneId; //获取三方通话ID
          this.$icp19.RemoveFromConfEx(
            Number(this.agent_id),
            Number(confId),
            0,
            item.number,
            1
            // result
          );
        }
      });
    },
    // 坐席历史呼叫转发列表
    findAppCallForwardingHistory() {
      // alert(2)
      let data = {
        agentId: sessionStorage.getItem("agent_id"),
      };
      this.$api.findAppCallForwardingHistory(data).then((res) => {
        if (res.errorcode === 0) {
          this.autoCallPhoneList = res.data;
          console.log("autoCallPhoneList", this.autoCallPhoneList);
        }
      });
    },
    /**
     * @author hexinting
     * @lastdate 2021-01-25
     * @description 查询已配置的呼叫转发号码
     */
    findCallForwarding() {
      if (sessionStorage.getItem("agent_id")) {
        // 当输入框为空时，不可打开自动转接按钮
        if(this.autoCallForm.phone===''){
          this.isAutoCall = '关'
        }
          
        // handleInput(this.autoCallForm.phone)
        let data = {
          agentId: sessionStorage.getItem("agent_id"),
        };
        this.$api.findCallForwarding(data).then((res) => {
          if (res.errorcode === 0) {
            this.findAppCallForwardingHistory();
            console.log("查询已配置的呼叫转发号码", res);
            if (res.data) {
              this.autoCallForm.phone = res.data.phone;
              this.isAutoCall = res.data.enabled === 1 ? '开' : '关'
              let autoCallSettings = {
                phone: res.data.phone,
                isAutoCall: res.data.enabled === 1 ? '开' : '关'
              };
              this.$store.commit("setAutoCallSettings", autoCallSettings);
              console.log(
                "autoCallSettings",
                autoCallSettings,
                this.$store.state.autoCallSettings
              );
            }
          }
        })
      }
    },
    /**
     * @author hexinting
     * @lastdate 2021-01-25
     * @description 传给ucs更改自动转接状态
     */
    AgentChangeStatus() {
      let agent_id = sessionStorage.getItem("agent_id");
      let status = this.isAutoCall === "开" ? 0 : 1; // 传给ucs的要跟存数据库的反着来
      let transferNum = this.autoCallForm.phone;
      this.$icp19
        .AgentChangeStatus(agent_id, status, transferNum)
        .then((res) => {
          console.log("调用ucs接口：", res);
        });
    },
    /**
     * @author hexinting
     * @lastEditor hexinting
     * @lastDate 2021-02-07
     * @description 设置坐席呼叫转发
     */
    setForwardingPhone() {
      let agentId = sessionStorage.getItem("agent_id");
      console.log("坐席", agentId);
      // 判断是否有坐席
      if (agentId === "" || agentId === undefined || agentId === null) {
        this.$message({
          message: "请先登录坐席",
          type: "success",
        });
        this.isAutoCall = "关";
        return;
      }
      // 当输入框为空时，不可打开自动转接按钮
      if(this.autoCallForm.phone===''){
        this.isAutoCall = '关';
      }

      let data = {
        phone: this.autoCallForm.phone,
        agentId: agentId,
        enabled: this.isAutoCall === "开" ? "1" : "0", // 给数据库传值 开：1；关：0
        enabledSms: 1 // 是否在转发时候发送短信通知 1：通知 0：不通知
      };
      this.$confirm('是否给该人员发送短信', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.setForwardingPhone(data).then((res) => {
          if (res.errorcode === 0) {
            let autoCallSettings = {
              phone: this.autoCallForm.phone,
              isAutoCall: this.isAutoCall,
            };
            this.$store.commit("setAutoCallSettings", autoCallSettings);
            this.findCallForwarding();
            this.$message({
              type: 'success',
              message: '发送短信成功!'
            });
          }
        });
      }).catch(() => {
        data.enabledSms = 0; // 是否在转发时候发送短信通知 1：通知 0：不通知
        this.$api.setForwardingPhone(data).then((res) => {
          if (res.errorcode === 0) {
            let autoCallSettings = {
              phone: this.autoCallForm.phone,
              isAutoCall: this.isAutoCall,
            };
            this.$store.commit("setAutoCallSettings", autoCallSettings);
            this.findCallForwarding();
          }
        });
      });
      this.AgentChangeStatus();
    },
    querySearchAsync(queryString, cb) {
      let autoCallPhoneList = [];
      this.autoCallPhoneList.forEach((item) => {
        item.value = item.phone;
        autoCallPhoneList.push(item);
      });
      var results = queryString
        ? autoCallPhoneList.filter(this.createStateFilter(queryString))
        : autoCallPhoneList;
      cb(results);
      // clearTimeout(this.timeout);
      // this.timeout = setTimeout(() => {
      //   cb(results);
      // }, 500 * Math.random());
    },
    createStateFilter(queryString) {
      return (state) => {
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleSelect(item) {
      console.log(item);
    },
    // 自动转接输入必须为数字
    handleInput(val) {
      this.autoCallForm.phone = val.replace(/[^\d]/g, "");
      console.log(this.autoCallForm.phone)
        // 当输入框为空时，关闭自动转接按钮
        if(this.autoCallForm.phone === ''){
          this.isAutoCall = '关'
          // this.setForwardingPhone()
          let autoCallSettings =  {
            phone: '',
            isAutoCall: this.isAutoCall
          }
          this.$store.commit('setAutoCallSettings', autoCallSettings)
        }
        console.log(this.isAutoCall)
    },
    changePhone() {
      console.log("phone:", this.autoCallForm.phone);
      // if (this.autoCallForm.phone === '') {
      //   this.isAutoCall = '关'
      // }
    },
    getSeatDuty() {
      this.showDutyOfficer = true;
      this.$api.getSeatDuty().then((res) => {
        if (res.errorcode === 0) {
          this.shiftPersonnel = res.data;
        }
      });
    },
    /**
     * @description: 选中需要转接的号码
     * @author: xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2020-11-05 16:05
     * @param {item} 转接成员信息
     * @return {*}
     */
    toTransfer(obj) {
      console.log("obj: ", obj);
      this.autoCallForm.phone = obj.dutyContactorMobile; // 赋值给自动转接输入框
      this.transferMemberId = obj.id;
    },
    /**
     * @description: 搜索班次值班员数据逻辑
     * @author: xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2020-11-06 14:14
     * @param {*} queryString //搜索的关键字
     * @param {*} cb //搜索的结果回调函数
     * @return {*}
     */
    filterMember(queryString, cb) {
      this.callBack = cb
      this.queryString = queryString
      var restaurants = []
      let params = {
        key: queryString,
      }
      this.$api.searchDuty(params).then((res) => {
        console.log('res: ', res);
        if (res.errorcode === 0) {
          restaurants = res.data;
          if (restaurants.length > 0) {
            // 修改符合插件的数据和自己想要的值
            restaurants.map(v=>{
              v.value = v.name + (v.groupName?' (' + v.groupName +')':v.groupName)
            })
          }
          // 调用 callback 返回建议列表的数据
          cb(restaurants);
        }
      });
    },
    /**
     * @description: 搜索结果中，选中需要转接的成员
     * @author: xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2020-11-06 10:05
     * @param {item} 转接成员信息
     * @return {*}
     */
    handleMember(item) {
      this.autoCallForm.phone = item.mobile; // 赋值给自动转接输入框
      this.transferMemberId = ""; // 清除班次列表中选中的值班员
      document.getElementsByClassName('el-autocomplete-suggestion')[1].style.display='none' // 搜索结果下拉隐藏
    },
    /**
     * @description: 检索才显示搜索结果，产生以为是点检索在搜索的
     * @author: xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2020-11-11 13:40
     * @param {*}
     * @return {*}
     */
    searchMember(){ 
      // 重新调用搜索，避免选中下拉值班员时再点搜索无数据
      this.filterMember(this.queryString,this.callBack)
      // 异步等input失焦后才修改样式，避免样式被覆盖
      setTimeout(()=>{
        document.getElementsByClassName('el-autocomplete-suggestion')[1].style.display='block'
        document.getElementsByClassName('el-autocomplete-suggestion')[1].style.position='absolute'
        document.getElementsByClassName('el-autocomplete-suggestion')[1].style.top=document.body.clientHeight*0.74+'px'
        if (this.width == document.body.clientWidth) {
        document.getElementsByClassName('el-autocomplete-suggestion')[1].style.left=document.body.clientWidth*0.845+'px'
      }else if (document.body.clientWidth>1600) {
        document.getElementsByClassName('el-autocomplete-suggestion')[1].style.left=document.body.clientWidth*0.822+'px'
      }else{
        document.getElementsByClassName('el-autocomplete-suggestion')[1].style.left=document.body.clientWidth*0.815+'px'
      }
      },800)
    },
    colseDutyOfficer(){
      this.showDutyOfficer = false
      document.getElementsByClassName('el-autocomplete-suggestion')[1].style.display='none'
    },
  },
};
</script>

<style scoped>
.flexBox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  text-decoration: none;
  margin: auto;
}

.flexBox >>> .el-card__body {
  padding: 0;
  height: 100%;
}

.cardShaShow {
  width: 128px;
  height: 148px;
  padding: 0;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 5px 12px 4px rgba(44, 45, 46, 0.16);
  cursor: pointer;
  transition: all 0.3s ease-out;
}

.cardShaShow:hover {
  transform: scale(1.05);
}

.cardShaHide {
  width: 128px;
  height: 148px;
  padding: 0;
  cursor: no-drop;
}

.cardPlan {
  width: 400px;
  height: 300px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 3px 10px 2px rgba(54, 121, 225, 0.09);
  border-radius: 3px;
  margin: auto;
  position: relative;
  overflow-y: scroll;
}

.dialBox {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.dialBox .divBox {
  padding-top: 10px;
  font-family: PingFangSC-Medium, PingFang SC;
}

.phoneDial-right {
  padding: 0 0 20px 0;
  max-height: calc(100% - 145px);
  overflow: auto;
}

.transition-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 390px;
  height: 300px;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: #fff;
}

.planTop {
  width: 390px;
  background-color: #fff;
  height: calc(100vh - 508px - 50px);
  min-height: 250px;
}

.planTop2 {
  width: 390px;
  background-color: #fff;
  height: calc(100vh - 508px - 50px);
  min-height: 250px;
  background-image: url("/static/img/nullList.png");
  background-repeat: no-repeat;
  background-size: 112px 112px;
  background-position: center center;
}

.el-icon-close {
  float: right;
  /*font-size: #333;*/
  padding-right: 10px;
  line-height: 30px;
  cursor: pointer;
}

.my-fax-list1 {
  margin: 10px;
  height: 40px;
  padding: 10px 0;
  color: #858585;
  cursor: pointer;
  border: 1px solid #eae6e6;
  border-radius: 4px;
  position: relative;
}

.my-fax-list1:hover {
  background: #f5faff;
  border-color: #9dbeff;
}

.boderBox {
  background: #f5faff;
  border-color: #9dbeff;
}

.my-fax-list1-left-box {
  display: block;
  box-sizing: border-box;
  height: 30px;
  margin-right: 35px;
}

.my-fax-list1-right {
  margin-left: 10px;
  color: #333333;
  font-size: 14px;
  line-height: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.blueSize {
  color: #0091ff;
}

.redSize {
  color: red;
}

.yellowSize {
  color: #f2b626;
}

.my-fax-list1-left {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #7bc6fe;
  text-align: center;
  line-height: 20px;
  color: #fff;
  font-size: 9px;
  float: left;
  margin: 5px 0;
}

.threePhone-list {
  margin: 10px;
  color: #858585;
  cursor: pointer;
  border: 1px solid #eae6e6;
  border-radius: 4px;
}

.threeNumberIndex {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #7bc6fe;
  text-align: center;
  line-height: 20px;
  color: #fff;
  font-size: 9px;
  float: left;
  margin: 5px 0;
}

.threeList-left {
  display: flex;
  justify-content: center;
  align-items: center;
}

.auto-call {
  height: 50px;
  width: 100%;
  background: rgba(249, 252, 255, 1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.auto-call .el-form-item {
  margin-bottom: 0;
}
</style>
<style lang="scss" scoped>
/* 自动转接选择弹窗样式 */
.beOnDuty {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: lightskyblue;
  padding: 10px 5px;
}

.memberSearch {
  display: flex;
  align-items: center;
  padding: 10px 5px;
}

.beOnDutyTitle {
  text-align: center;
  padding: 5px 0;
  border-top: 1px solid;
}

.shiftPersonnel {
  border: 1px solid;
  border-bottom: none;
  list-style: none;
  padding: 0;
  margin: 0 5px 15px;
  font-size: 14px;
  .everyShiftPersonnel {
    display: flex;
    border-bottom: 1px solid;
    height: 36px;
    box-sizing: border-box;
    .groupName {
      border-right: 1px solid;
      width: 91px;
      height: 100%;
      overflow: hidden;
      padding: 5px;
      text-align: center;
      box-sizing: border-box;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .shiftMember {
      display: flex;
      list-style: none;
      padding: 5px 0 0 8px;
      height: 100%;
      overflow-y: auto;
      box-sizing: border-box;
      flex-wrap: wrap;
      .dutys {
        border: 1px solid;
        margin: 0 7px 5px 0;
        width: 60px;
        box-sizing: border-box;
        height: 25px;
        overflow: hidden;
        padding: 0 3px 0px 5px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}

</style>
