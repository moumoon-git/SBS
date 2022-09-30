<!--@author：llp-->
<template>
  <div class="icpPhoneNew">
    <div class="icpPhone-box">
      <div class="icpPhone-box-left">
        <div class="icpPhone-box-main">
          <my-phone
            v-if="changeName=='phone'"
            ref="phone"
            @closeDialog="closeDialog"
            @findCall="findCall"
          ></my-phone>
          <my-sms
            v-else-if="changeName=='IcpSms'"
            ref="sms"
            @closeDialog="closeDialog"
            @findfaxDataS="findfaxDataS"
          ></my-sms>
          <my-fax
            v-else-if="changeName=='IcpFax'"
            ref="faxgroup"
            @closeDialog="closeDialog"
            @findfaxData="findfaxData"
          ></my-fax>
          <my-meeting v-else-if="changeName=='IcpMeeting'" ref="video" @closeDialog="closeDialog"></my-meeting>
          <my-talk
            v-else-if="changeName=='IcpGroupTalk'"
            ref="talk"
            @closeDialog="closeDialog"
            @findfaxDataT="findfaxDataT"
          ></my-talk>
        </div>
      </div>
      <div class="icpPhone-box-right">
        <div class="icpPhone-nav-box">
          <div
            class="icpPhone-nav-item"
            :class="{'oy-active':changeName==item.name}"
            v-for="(item,index) in navList"
            :key="index"
            @click="changeNav(item.name)"
          >
            <div
              :class="`icpPhone-nav-img ${changeName==item.name?'icpPhone-nav-img-'+ item.name:'icpPhone-nav-img-No'+item.name}`"
            ></div>
            <div class="icpPhone-nav-titile">{{item.title}}</div>
          </div>
        </div>
        <!-- <div class="icpPhone-nav-line"></div> -->
        <phone-right v-if="changeName=='phone'" :findCallData="findCallData"></phone-right>
        <fax-right
          v-if="changeName=='IcpFax'"
          ref="IcpFaxRight"
          :isAddPhonesShow.sync="isAddPhonesShow"
        ></fax-right>
        <sms-right
          v-if="changeName=='IcpSms'"
          ref="IcpSmsRight"
          :isAddNumberShow.sync="isAddNumberShow"
          :selectContact="false"
          @showTemple="showTemple"
        ></sms-right>
        <meeting-right v-else-if="changeName=='IcpMeeting'" ref="IcpMeetingRight"></meeting-right>
        <talk-right v-else-if="changeName=='IcpGroupTalk'" ref="IcpTalkRight"></talk-right>
      </div>
    </div>
    <el-dialog
      :visible="dialogVisible"
      :title="title"
      width="480px"
      @close="closeDialogP"
      :close-on-click-modal="false"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-position="right"
        label-width="100px"
      >
        <el-form-item v-show="title=='修改分组'" label="所选分组:">
          <el-col :span="18">
            <el-input v-model="currentGroupName" disabled></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="分组名称:" prop="groupName">
          <el-col :span="18">
            <el-input v-model="ruleForm.groupName" show-word-limit maxlength="100"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="上级分组:" prop="parentName" v-show="title=='新增分组'">
          <el-col :span="18">
            <el-input v-model="ruleForm.parentName" disabled></el-input>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="cancelDialog(true)">选择</el-button>
          </el-col>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="submitForm(1)" v-show="title=='新增分组'">保存并新增</el-button>
      <el-button type="primary" @click="submitForm(2)" v-show="title=='修改分组'">保存并修改</el-button>
    </el-dialog>
    <!--内层弹窗-->
    <el-dialog
      width="400px"
      :visible.sync="innerVisible"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-row>
        <el-col :span="20">
          <el-input clearable placeholder="输入关键字搜索" v-model="filterText"></el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            style="width:100%;padding-right:0;padding-left:0;"
            @click="filterTexts"
          >搜索</el-button>
        </el-col>
      </el-row>
      <el-scrollbar>
        <el-tree
          style="height: 300px;"
          class="filter-tree"
          :data="treeData"
          :accordion="true"
          :props="defaultProps"
          :filter-node-method="filterNode"
          :default-expand-all="isExpand"
          @node-click="handleNodeClick"
          ref="tree"
          node-key="id"
          highlight-current
        ></el-tree>
      </el-scrollbar>
      <div slot="footer" style="text-align: center">
        <el-button size="mini" @click="cancelDialog(false)">取消</el-button>
        <el-button size="mini" type="primary" @click="affirmDialog">确认</el-button>
      </div>
    </el-dialog>
    <!--添加号码对话框-->
    <el-dialog :visible.sync="isAddPhonesShow" width="30%" :close-on-click-modal="false">
      <div slot="title" class="dialog-header">添加号码</div>
      <el-input
        type="textarea"
        resize="none"
        :autosize="{minRows:4,maxRows:4}"
        v-model="phonesText"
        placeholder="请输入号码，多个号码使用“，”隔开"
      ></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitClose">取 消</el-button>
        <el-button type="primary" @click="submitPhones">确 定</el-button>
      </div>
    </el-dialog>
    <!--添加号码对话框-->
    <el-dialog
      title="添加号码"
      :visible.sync="isAddNumberShow"
      :before-close="handleClose"
      width="35%"
      :close-on-click-modal="false"
      custom-class="addPhone"
    >
      <div
        v-show="showDialPlate"
        class="transition-box"
        style="display: flex;padding: 15px 20px 5px;"
      >
        <dial-plate isShowClose="true" @dialing="dialing" style="display: inline-block"></dial-plate>
        <el-input
          type="textarea"
          resize="none"
          :autosize="{minRows:11,maxRows:11}"
          v-model="phonesText1"
          placeholder="请输入号码，多个号码使用“，”隔开"
          class="dial-plate-input"
        ></el-input>
      </div>

      <div style="border-top: 1px solid #E9ECF1;padding:20px 0;">
        <el-button @click="submitClose1" size="small">取 消</el-button>
        <el-button type="primary" @click="submitPhones1" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <msg-template ref="MsgTemplate" @selectTemplate="selectTemplate"></msg-template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import myPhone from "./icpPhonePage/phone";
// import phoneRight from '@/view/integratedCommunication/icpPhone/icpPhonePage/phoneStep/phoneRight';
import phoneRight from "@/view/integratedCommunication/icpPhone/icpPhonePage/phoneStep/phoneDial";
import faxRight from "@/view/integratedCommunication/icpPhone/icpPhonePage/faxStep/faxRight";
import smsRight from "@/view/integratedCommunication/icpPhone/icpPhonePage/smsStep/smsRight";
import meetingRight from "@/view/integratedCommunication/icpPhone/icpPhonePage/meetingSep/meetingRight";
import talkRight from "@/view/integratedCommunication/icpPhone/icpPhonePage/talkStep/talkRight";
import mySms from "./icpPhonePage/sms";
import myFax from "./icpPhonePage/fax";
import myMeeting from "./icpPhonePage/meeting";
import myTalk from "./icpPhonePage/talk";
import treeSearch from "@/view/eventManagement/eventHistory/plan/treeSearch";
import MsgTemplate from "@/view/integratedCommunication/icpSms/informationTransmission/msgTemplate";

import dialPlate from "@/components/dialPlate";
export default {
  name: "icpPhoneNew",
  components: {
    myPhone,
    mySms,
    myFax,
    myMeeting,
    myTalk,
    treeSearch,
    phoneRight,
    faxRight,
    smsRight,
    MsgTemplate,
    meetingRight,
    talkRight,
    dialPlate
  },
  data() {
    return {
      phonesText1: "",
      phonesText: "",
      isAddPhonesShow: false,
      isAddNumberShow: false,
      findCallData: {
        name: "", //名字
        position: "",
        workUnit: "",
        mobile: "", //常用手机
        temobile: "", //手持终端
        otherTel: "", //备用手机
        officeTel: "", //办公电话
        homeTel: "", //应急电话
        otherTel2: "" //其他电话
      },
      filterText: "",
      isExpand: false,
      defaultProps: {
        children: "children",
        label: "name"
      },
      treeData: [], //上级分组列表
      innerVisible: false, //上级分组遮罩层
      currentGroupName: "", //要修改组的名称
      currentGroupParent: {},
      ruleForm: {
        groupName: "", //分组名称
        parentName: "" //上级分组
      }, //表单变量
      rules: {
        groupName: [
          {
            required: true,
            trigger: "blur",
            message: "分组名称不能为空"
          }
        ],
        parentName: [
          {
            required: true,
            trigger: "blur",
            message: "上级分组不能为空"
          }
        ]
      }, //表单验证
      dialogVisible: false,
      title: "",
      currentGroup: {}, //被选中的组
      currentGroupNameData: {}, //默认组信息
      navList: [
        {
          name: "phone",
          title: "电话"
        },
        {
          name: "IcpSms",
          title: "短信"
        },
        {
          name: "IcpFax",
          title: "传真"
        },
        {
          name: "IcpMeeting",
          title: "会议"
        },
        {
          name: "IcpGroupTalk",
          title: "对讲"
        }
      ],
      showDialPlate: true,
      isShowClose: true,

      currentParentId: "",
    };
  },
  computed: {
    ...mapGetters({
      changeName: "getIcpName", //获取当前更换页标记
      peopleList: "getFaxMember"
    })
  },
  watch: {
    filterText(val) {
      if (val == "" || val == null || val == undefined) {
        this.$refs.tree.filter(val);
      }
    }
  },
  methods: {
    showTemple(key) {
      this.$refs.MsgTemplate.closeDialog();
    },
    selectTemplate(text, id) {
      this.$refs.IcpSmsRight.selectTemplate({ text: text, id: id });
    },
    submitClose() {
      this.phonesText = "";
      this.isAddPhonesShow = false;
    },
    submitPhones() {
      if (this.phonesText.length == 0) {
        this.$message.warning("输入不能为空");
      } else {
        let data = this.phonesText.split(/[,，]/) || [];
        data = [...new Set(data)];
        let data1 = [];
        data.forEach(o => {
          if (/^(\d{3,4}-)?\d{7,8}$/.test(o)) {
            // 防止已存在的号码存进来
            let index = this.peopleList.findIndex(m => m.fax === o);
            if (index > -1) {
              setTimeout(() => {
                this.$message.error(`传真号码：${o}已在队列中`);
              }, 500);
            } else {
              data1.push(o);
            }
          } else {
            setTimeout(() => {
              this.$message.error("传真号码格式错误:" + o);
            }, 500);
          }
        });

        if (data1.length > 0) {
          this.$refs.IcpFaxRight.getfaxDataN(data1);
        }

        // if (data1.length == 0) {
        //   this.$message.warning("请输入正确的传真号码");
        // } else {
        //   this.$refs.IcpFaxRight.getfaxDataN(data1);
        // }
      }
    },
    submitClose1() {
      this.phonesText1 = "";
      this.isAddNumberShow = false;
    },
    submitPhones1() {
      if (this.phonesText1.length == 0) {
        this.$message.warning("输入不能为空");
      } else {
        let data = this.phonesText1.split(/[,，]/) || [];
        data = [...new Set(data)];
        let data1 = [];
        data.forEach(o => {
          if (/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(o)) {
            data1.push(o);
          } else {
            setTimeout(() => {
              this.$message.warning("手机号码格式错误:" + o);
            }, 500);
          }
        });

        if (data1.length == 0) {
          this.$message.warning("请输入正确的手机号码");
        } else {
          this.$refs.IcpSmsRight.getfaxDataN(data1);
        }
      }
    },
    findfaxDataS(row) {
      //  console.log(row);
      this.$refs.IcpSmsRight.getfaxData(row);
    },
    findfaxDataT(row) {
      //  console.log(row);
      this.$refs.IcpTalkRight.getfaxData(row);
    },
    findfaxData(row) {
      // console.log(row);
      this.$refs.IcpFaxRight.getfaxData(row);
    },
    findCall(row) {
      // console.log(row)
      let data = {
        id: row
      };
      this.$api.findContactorById(data).then(res => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error"
          });
          return;
        }
        this.findCallData = res.data;
      });
    },
    filterTexts() {
      this.$refs.tree.filter(this.filterText);
    },
    handleNodeClick(data, node) {
      //选择项
      // console.log(data,node)
      this.currentGroupParent = {
        groupId: data.id,
        currentGroupName: data.name
      };
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    affirmDialog() {
      //内层确认按钮
      if (this.currentGroupParent.currentGroupName) {
        this.ruleForm.parentName = this.currentGroupParent.currentGroupName;
        this.cancelDialog(false);
      } else {
        this.$message({
          message: "请选择分组!",
          type: "warning"
        });
      }
    },
    cancelDialog(key) {
      this.innerVisible = key;
    },
    handleClose(done) {
      this.phonesText1 = "";
      this.isAddNumberShow = false;
    },
    submitForm(key) {
      //key 1为新增 2为修改
      // console.log('父元素', this.treeData)
      let parentNameData = [];
      for(let i in this.treeData) {
        parentNameData.push(this.treeData[i].name);
      }
      console.log('父元素', parentNameData, this.currentGroupNameData.code);
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          if (key == 1) {
            let data = {
              name: this.ruleForm.groupName,
              code: this.currentGroupNameData.code,
              operate: 0
            };
            console.log("分组id为："+JSON.stringify(this.currentGroupParent))
            if (this.currentGroupParent.groupId) {
              data.pid = this.currentGroupParent.groupId;
            } else {
              // if(this.currentGroup.groupId){
              //      data.pid =this.currentGroup.groupId;
              // }else{
              data.pid = 0;
              // }
            }
            if (data.pid === 0 && (data.name === '未分组联系人' || data.name === parentNameData[0])) {
              this.$message({
                message: '分组不应该和主干分组重名',
                type: "error"
              });
              return;
            }
            this.$api.updateGroup(data).then(res => {
              if (res.errorcode != 0) {
                this.$message({
                  message: res.msg,
                  type: "error"
                });
                return;
              }
              console.log("新增的结果为："+JSON.stringify(res))
              this.$message({
                message: "新增成功",
                type: "success"
              });
              console.log(this.currentGroupNameData.ref)
              this.$refs[this.currentGroupNameData.ref].refreshData();
              this.currentGroupName = "";
              this.treeData = [];
              this.dialogVisible = false;
              this.currentGroupParent = {};
            });
          } else if (key == 2) {
            let data = {
              name: this.ruleForm.groupName,
              code: this.currentGroupNameData.code,
              operate: 1,
              id: this.currentGroup.groupId,
              //pid: this.currentParentId,
              pid: sessionStorage.getItem('PID')
            };
            if (data.pid === 0 && (data.name === '未分组联系人' || data.name === parentNameData[0])) {
              this.$message({
                message: '分组不应该和主干分组重名',
                type: "error"
              });
              return;
            }
            this.$api.updateGroup(data).then(res => {
              if (res.errorcode != 0) {
                this.$message({
                  message: res.msg,
                  type: "error"
                });
                return;
              }
              this.$message({
                message: "修改成功",
                type: "success"
              });
              try {
                this.ruleForm.groupName = "";
                this.$refs[this.currentGroupNameData.ref].refreshData();
                this.closeDialogP();
              } catch (err) {
                console.log(err);
              }
            });
          }
        }
      });
    },
    //a.key 遮罩层开关 formData:初始值(code:上传到那个部分phone、sms、faxgroup、VideoGroup、VideoTerminalGroup、GroupTalk,name:新增无上级选项时默认值，pid:新增无上级选项时默认值)
    //title:标题，data:当前被选中项
    closeDialogP() {
      this.$nextTick(() => {
        this.currentGroupName = "";
        this.treeData = [];
        this.currentGroupParent = {};
        this.dialogVisible = false;
        this.ruleForm.groupName = "";
        this.$refs["ruleForm"].resetFields();
      });
    },
    closeDialog(a) {
      console.log("closeDialog a.formData a", a.formData, a);
      console.log("点击新增："+JSON.stringify(a))
      if(a.parentId){
        this.currentParentId = a.parentId;
      }
      if(a.data.groupId <= 0) {
          this.dialogVisible = false
          this.$message({
              message: `${a.data.currentGroupName}下面不允许创建分组`,
              type: "warning"
          })
          return
      }
      this.dialogVisible = a.key;
      this.title = a.title ? a.title : "";
      this.currentGroup = a.key ? a.data : {};
      this.currentGroupNameData = a.formData || {};
      if (a.key) {
        this.ruleForm.parentName = a.data.currentGroupName
          ? a.data.currentGroupName
          : a.formData.name;
        this.currentGroupName = a.data.currentGroupName
          ? a.data.currentGroupName
          : "";
        this.treeData = a.treeData.filter(item => item.id !== -1) || [];
        this.currentGroupParent.groupId = a.data.groupId
        console.log("列表数据："+JSON.stringify(this.treeData))
      } else {
        this.$refs["ruleForm"].resetFields();
        this.currentGroupName = "";
        this.treeData = [];
        if (!key) {
          this.currentGroupParent = {};
        }
      }
    },
    /**
     * @lastEditor hexinting
     * @lastDate 2020-11-13
     * @description 改变融合通讯类型
     */
    changeNav(name) {
      console.log('切换：', name)
      if (this.changeName != name) {
        this.$store.commit("SET_ICPNAME", name);
      }
      // bug8097 author：hexinting date:20201113
      if (name === 'phone') {
        this.$store.commit('setSmsOrFax', 'phone')
      } else if (name === "IcpSms") {
        this.$store.commit('setSmsOrFax', 'sms')
      } else if (name === 'IcpFax') {
        this.$store.commit('setSmsOrFax', 'fax')
      }
    },

    //关闭拨号
    // closeModel() {
    //   this.showDialPlate = false
    // },

    //拨号盘拨号
    dialing(data) {
      console.log(data);
      if (data.phoneNumber) {
        let rowNumber = {
          number: data.phoneNumber
        };
        console.log(rowNumber);
        console.log(this.phonesText1);
        if (this.phonesText1.length > 0) {
          console.log("存在");
          this.phonesText1 = this.phonesText1 + "," + rowNumber.number;
        } else {
          console.log("不存在");
          this.phonesText1 = rowNumber.number;
        }
        console.log(this.phonesText1);
        // this.makeCallDish(rowNumber)  //拨号盘呼叫
      }
    }
  }
};
</script>

<style scoped>
>>> [role="dialog"] {
  margin: auto !important;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.my-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
}
.icpPhone-box {
  padding: 10px;
  box-sizing: border-box;
  text-align: left;
  height: calc(100vh - 100px);
}
.icpPhone-box-left {
  margin-right: 400px;
  background: #fff;
  height: 100%;
}
.icpPhone-box-main {
  height: 100%;
  overflow: auto;
  background: #ebeef5;
}
.icpPhone-box-right {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 390px;
  box-sizing: border-box;
  height: 100%;
  /* background-color:#323232; */
  /* background-image:url(../../../assets/icpImg/bjRight.png); */
  /*background: #fff;*/
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.icpPhone-nav-box {
  background-color: #fff;
  /* padding: 3px 0px; */
  font-size: 0;
  display: flex;
}
.icpPhone-nav-item {
  /*height: 75px;*/
  padding-bottom: 9px;
  display: inline-block;
  flex: 1;
  font-size: 16px;
  text-align: center;
  vertical-align: top;
  cursor: pointer;
  border-bottom: 2px solid #e3e6e7;
  color: #d7d7d7;
}
.icpPhone-nav-item.oy-active {
  /* background: #687ba0; */
  color: #666;
  border-bottom: 2px solid #3f92fe;
}
/* .icpPhone-nav-item:hover{
  background-color: rgb(159,167,188)
} */
.icpPhone-nav-line {
  margin: 0 7px;
  border-bottom: 1px solid #fff;
}

.icpPhone-nav-img {
  display: inline-block;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  margin-top: 17px;
  height: 40px;
}

.icpPhone-nav-img-Nophone {
  background-image: url(../../../assets/icpImg/NoIcpPhone.png);
  width: 26px;
  height: 26px;
}
.icpPhone-nav-img-phone {
  background-image: url(../../../assets/icpImg/IcpPhone.png);
  width: 26px;
  height: 26px;
}
.icpPhone-nav-img-NoIcpSms {
  background-image: url(../../../assets/icpImg/NoIcpSms.png);
  width: 26px;
  height: 26px;
}
.icpPhone-nav-img-IcpSms {
  background-image: url(../../../assets/icpImg/IcpSms.png);
  width: 26px;
  height: 26px;
}
.icpPhone-nav-img-NoIcpFax {
  background-image: url(../../../assets/icpImg/NoIcpFax.png);
  width: 26px;
  height: 26px;
}
.icpPhone-nav-img-IcpFax {
  background-image: url(../../../assets/icpImg/IcpFax.png);
  width: 26px;
  height: 26px;
}
.icpPhone-nav-img-NoIcpMeeting {
  background-image: url(../../../assets/icpImg/NoIcpMeeting.png);
  width: 26px;
  height: 26px;
}
.icpPhone-nav-img-IcpMeeting {
  background-image: url(../../../assets/icpImg/IcpMeeting.png);
  width: 26px;
  height: 26px;
}
.icpPhone-nav-img-NoIcpGroupTalk {
  background-image: url(../../../assets/icpImg/NoIcpGroupTalk.png);
  width: 26px;
  height: 26px;
}
.icpPhone-nav-img-IcpGroupTalk {
  background-image: url(../../../assets/icpImg/IcpGroupTalk.png);
  width: 26px;
  height: 26px;
}
.icpPhone-nav-titile {
  font-size: 14px;
  line-height: 20px;

  text-align: center;
}
.el-tree--highlight-current
  >>> .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: #c0c0c0;
}
/* 对话框头部样式 */

.dialog-header {
  margin: -20px;
  background-color: #f1f4f6;
  padding: 10px 20px;
  font-size: 14px;
  color: #333333;
  text-align: left;
}
/* 对话框底部样式 */
.dialog-footer {
  border-top: 2px solid #f2f2f2ff;
  margin: -20px;
  padding: 10px 15px;
}
/* 拨号盘输入框样式*/
.dial-plate-input {
  margin-top: 1%;
  margin-left: 5%;
}
/* 添加号码弹窗 */
.icpPhoneNew /deep/ .addPhone {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 15px 2px rgba(0, 0, 0, 0.27);
  border-radius: 5px;
}
.icpPhoneNew /deep/ .addPhone .el-dialog__header {
  background: rgba(241, 244, 246, 1);
  border-radius: 5px 5px 0px 0px;
  text-align: left;
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
}
.icpPhoneNew /deep/ .addPhone .el-dialog__header .el-dialog__title {
  font-size: 13px;
  color: #333;
}
.icpPhoneNew /deep/ .addPhone .el-dialog__header .el-dialog__headerbtn {
  top: 14px;
}
.icpPhoneNew /deep/ .addPhone .el-dialog__body {
  padding: 0;
}
</style>
