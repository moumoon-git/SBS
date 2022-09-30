<template>
  <div>
    <el-dialog
      append-to-body
      title="选择目标"
      :visible.sync="dialogVisible"
      width="700px"
      :close-on-click-modal="false"
    >
      <el-row>
        <el-col :span="11">
          <el-tabs
            @tab-click="msgWith"
            style="border: 1px solid #ebeef5; border-radius: 4px"
          >
            <el-tab-pane label="通讯录">
              <el-scrollbar style="height: 100%; margin: 6px">
                <sms-address-book-tree
                  style="width: 100%; height: 250px"
                  ref="smsPhoneTree"
                  :showCheckbox="smsShowCheckbox"
                  :showPhoneIcon="smsShowPhoneIcon"
                  @handleNodeClick="smsRowNodeClick"
                  @handleCheckChange="handleCheckChange"
                >
                </sms-address-book-tree>
              </el-scrollbar>
            </el-tab-pane>
            <el-tab-pane label="最近联系人">
              <el-scrollbar style="height: 100%; margin: 6px" id="dailList">
                <sms-call-log-model
                  style="width: 100%; height: 240px"
                  ref="callLogModel"
                  @callPhone="callPhone"
                >
                </sms-call-log-model>
              </el-scrollbar>
            </el-tab-pane>
            <el-tab-pane label="快捷组">
              <el-scrollbar style="height: 100%; margin: 6px">
                <sms-quick-group
                  style="width: 100%; height: 250px"
                  ref="quickGroup"
                  :quickGroupShowCheckbox="smsQuickGroupShowCheckbox"
                  :quickGroupShowPhoneIcon="smsQuickGroupShowPhoneIcon"
                  :hiide="true"
                  @quickNodeClick="quickNodeClick"
                  @handleCheckChange="handleCheckChange"
                >
                </sms-quick-group>
              </el-scrollbar>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="2">
          <el-col :span="24" style="padding-top: 90px">
            <el-row>
              <div class="arrowButton">
                <el-button
                  @click="addList"
                  type="success"
                  size="mini"
                  round
                  plain
                  class="el-icon-d-arrow-right"
                ></el-button>
              </div>
            </el-row>

            <el-row>
              <div class="arrowButton">
                <el-button
                  @click="delectList"
                  type="success"
                  size="mini"
                  round
                  plain
                  class="el-icon-d-arrow-left"
                ></el-button>
              </div>
            </el-row>
          </el-col>
        </el-col>
        <el-col :span="11">
          <div style="width: 100%">
            <div class="eventList">{{ smsSendType }}</div>
            <el-card class="box-card cardCalss" shadow="hover" id="boxCard">
              <el-row style="width: 100%; height: 240px">
                <el-col :span="24" style="padding-left: 10px">
                  <el-row>
                    <el-col :span="20">
                      <el-input
                        v-model="smSinputData"
                        placeholder="输入手机号"
                        size="small"
                      ></el-input>
                    </el-col>
                    <el-col :span="4" style="text-align: right">
                      <el-button
                        type="primary "
                        class="el-icon-plus"
                        size="small"
                        @click="pushListNumber"
                      ></el-button>
                    </el-col>
                  </el-row>

                  <el-row>
                    <div
                      style="
                        width: 100%;
                        height: 170px;
                        border: 1px solid #ddd;
                        margin-top: 15px;
                      "
                    >
                      <el-scrollbar style="height: 100%; overflow: hidden">
                        <div style="padding: 5px 15px" id="checkedList">
                          <el-checkbox-group v-model="checkedCities">
                            <el-checkbox
                              v-for="item in checkedList"
                              :label="item.id"
                              :key="item.id"
                            >
                              {{ item.label || item.mobile }}
                            </el-checkbox>
                          </el-checkbox-group>
                        </div>
                      </el-scrollbar>
                      <div style="width: 100%; height: 40px; line-height: 40px">
                        <el-col :span="12">
                          当前收件人数量:{{ numberOfRecipients }}
                        </el-col>
                        <el-col :span="12">
                          <el-button
                            type="primary"
                            size="mini"
                            @click="emptyManage"
                            >清空</el-button
                          >
                          <el-button
                            type="primary"
                            size="mini"
                            @click="selectTarget"
                            >确定</el-button
                          >
                        </el-col>
                      </div>
                    </div>
                  </el-row>
                </el-col>
              </el-row>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </el-dialog>

    <div style="margin: 10px 0">
      <div style="float: left">
        <span>短信发送记录</span>
      </div>
      <div style="float: right">
        <span>发送成功：</span
        ><span style="color: rgba(16, 217, 176, 1)">{{ smsSendOk }}</span>
        <span>发送失败：</span
        ><span style="color: rgba(255, 147, 117, 1)">{{ smsSendNot }}</span>
      </div>
      <div style="clear: both"></div>
    </div>
    <myTable
      :tableData="tableData"
      :tableColumn="tableColumn"
      :tableConfig="tableConfig"
    ></myTable>

    <el-row style="margin: 10px 0">
      <!-- <el-scrollbar style="height: 100%"> -->
      <div style="font-size: 14px">
        <el-row>
          <el-col :span="12">
            <el-row>
              <el-input
                :maxlength="500"
                clearable
                type="textarea"
                :rows="2"
                v-model="smsDialogContent"
                :autosize="{ minRows: 11, maxRows: 11 }"
                resize="none"
                show-word-limit
              >
              </el-input>
            </el-row>

            <!-- <el-row style="padding: 10px 0">
                <el-col :span="6">
                  定时发送:
                </el-col>
                <el-col :span="18">
                  <el-date-picker
                    size="mini"
                    v-model="smsTimingSend"
                    type="datetime"
                    placeholder="请选择日期时间">
                  </el-date-picker>
                </el-col>
              </el-row> -->
          </el-col>

          <el-col :span="12">
            <el-scrollbar
              style="
                height: 100%;
                border: 1px solid #ddd;
                border-radius: 5px;
                margin-left: 10px;
              "
            >
              <div style="height: 240px">
                <el-tree
                  :data="smsTreeData"
                  :props="smsTreedefaultProps"
                  @node-click="smsTreeHandleNodeClick"
                ></el-tree>
              </div>
            </el-scrollbar>
            <!-- <div style="height: 50px;line-height: 50px;width: 100%;text-align: right">
                <el-button type="primary" size="mini">发送</el-button>
              </div> -->
          </el-col>
        </el-row>
        <el-row style="margin-top: 5px; background: #f0f6ff; line-height: 28px">
          <el-col :span="4">发送目标:</el-col>
          <el-col :span="20">
            <el-input
              size="mini"
              placeholder=""
              @focus="dialogVisible = true"
              v-model="sendTarget"
            ></el-input>
          </el-col>
        </el-row>
        <el-row style="margin-top: 5px; background: #f0f6ff; line-height: 28px">
          <el-col :span="4"> 定时发送: </el-col>
          <el-col :span="8" id="selectTime">
            <el-date-picker
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              size="mini"
              v-model="smsTimingSend"
              type="datetime"
              placeholder="请选择日期时间"
            >
            </el-date-picker>
          </el-col>
          <el-col :span="6" style="text-align: center">
            <el-button type="primary" size="mini" @click="sendSmsContent"
              >发送</el-button
            >
          </el-col>
        </el-row>
      </div>
      <!-- </el-scrollbar> -->
    </el-row>
  </div>
</template>

<script>
import myTable from "./myTable";
import smsAddressBookTree from "@/view/eventManagement/eventRegistration/newModel/smsPhoneTree";
import smsQuickGroup from "@/view/eventManagement/eventRegistration/newModel/quickGroup";
import smsCallLogModel from "@/view/eventManagement/eventRegistration/newModel/callLogModel";

export default {
  name: "newSmsModel",
  components: {
    smsAddressBookTree,
    smsQuickGroup,
    smsCallLogModel,
    myTable,
  },
  data() {
    return {
      smsShowCheckbox: true, //通讯录子组件树显不显示复选框
      smsShowPhoneIcon: false, //通讯录子组件树显不显示电话图标
      smsQuickGroupShowCheckbox: true, //快捷组树组件是否显示复选
      smsQuickGroupShowPhoneIcon: false, //快捷组树组件是否显示电话图标
      smsSendType: "发送短信", //发送类型
      smSinputData: "", //短信名字
      numberOfRecipients: 0, //收件人数量
      checkedList: [], //多选列表循环数组
      checkedCities: [], //选中的多选
      smsDialogContent: "", //信息处理短信发送内容
      smsTimingSend: "", //短信定时发送
      smsTreeData: [], //短信内容右侧树数据
      smsTreedefaultProps: {
        children: "children",
        label: "title",
      },
      rowItemData: "", //存储tree节点点击数据
      dialogVisible: false,
      smsSendOk: 0,
      smsSendNot: 0,
      sendTarget: "",
      sendIDs: "", //发送人ID数组
      mobiles: "", //发送人号码

      tableColumn: [
        { label: "事件标题", prop: "eventName", width: 140, center: "center" },
        { label: "发送时间", prop: "sendTime", center: "center" },
        { label: "发送目标号码", prop: "call", width: 155, center: "center" },
        {
          label: "发送状态",
          prop: "improveSuccess",
          width: 110,
          center: "center",
        },
      ],
      tableConfig: {
        height: "290px",
        loading: false,
      },
      tableData: [],
      reduction: 1,
    };
  },
  mounted() {
    let data = {};
    this.$szApi.smsModelTree(data).then((res) => {
      if (res.errorcode == 0) {
        this.smsTreeData = res.data;
      } else {
        // //this.$message.error(res.msg)
      }
    });

    let smsData = {
      dtStart: this.GetDateStr(-6), //获取到七天前的日期
    };
    this.tableConfig.loading = true;
    this.$api
      .findAllSmsList(smsData)
      .then((res) => {
        if (res.errorcode == 0) {
          console.log(res.data);
          res.data.data.forEach((item, i) => {
            if (item.success == "是") {
              item.improveSuccess = "成功";
              this.smsSendOk += 1;
            } else if (item.success == "否") {
              item.improveSuccess = "失败";
              this.smsSendNot += 1;
            } else {
              item.improveSuccess = "";
            }
          });
          this.tableData = res.data.data;
        } else {
          //this.$message.error(res.msg)
        }
        this.tableConfig.loading = false;
      })
      .catch((err) => {
        this.tableConfig.loading = false;
      });
  },
  methods: {
    GetDateStr(AddDayCount) {
      let dd = new Date();
      dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
      let y = dd.getFullYear();
      let m =
        dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1; //获取当前月份的日期，不足10补0
      let d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); //获取当前几号，不足10补0
      return y + "-" + m + "-" + d;
    },
    /**
     * @lastAuthor hexinting
     * @lastDate 2020-9-29
     * @description 通讯录tree点击
     */
    smsRowNodeClick(row) {
      this.rowItemData = row;
      let treeData;
      if (row.disabled) {
        if (row.children.length == 0) {
          let data = {
            pid: row.id,
            code: "governmentAffairs", // 添加参数（根据融合通讯的来）
          };
          this.$szApi.phoneGruopList(data).then((res) => {
            if (res.errorcode == 0) {
              treeData = res.data;
              treeData.forEach((item) => {
                const newChild = {
                  label: item.label,
                  children: item.children,
                  disabled: item.disabled,
                  id: item.id,
                  mobile: item.mobile,
                  officeTel: item.officeTel,
                  otherTel: item.otherTel,
                  position: item.position,
                  temobile: item.temobile,
                  workUnit: item.workUnit,
                  fax: item.fax,
                };
                if (!row.children) {
                  this.$set(row, "children", []);
                } else {
                  row.children.push(newChild);
                }
              });
            } else {
              // //this.$message.error(res.msg)
            }
          });
        }
      }
    },
    handleCheckChange(arr) {
      this.leftTreeData = arr;
    },
    msgWith(tab) {
      //左边Tabs
      this.msgTableWith = tab.label;
      switch (tab.label) {
        case "通讯录":
          break;
        case "最近联系人":
          break;
        case "快捷组":
          break;
        default:
          break;
      }
    },
    //手动输入传真号添加
    pushListNumber() {
      let phoneCheck = /^[1][2,3,4,5,6,7,8,9][0-9]{9}$/; //手机号码校验
      if (this.smSinputData == "" || this.smSinputData == null) {
        this.$message({
          message: "请先填写手机号!",
          type: "warning",
        });
        return;
      } else if (!this.smSinputData.match(phoneCheck)) {
        this.$message({
          message: "请输入正确的手机号码!",
          type: "warning",
        });
        return;
      }
      let spliceData = this.checkedList;
      let temporaryArr = spliceData;
      //如果输入的号码存在通讯录中，则直接加载通讯录名片
      this.reduction -= 1;
      let data = {
        phoneNum: Number(this.smSinputData),
      };
      this.$api.findContactorByMobile(data).then((res) => {
        if (res.errorcode == 0) {
          if (res.data.mobile == "") {
            temporaryArr.push({
              id: this.reduction,
              label: this.smSinputData,
              mobile: this.smSinputData,
            });
          } else {
            temporaryArr.push({
              id: res.data.id,
              label: res.data.name,
              mobile: res.data.mobile,
            });
          }
        } else {
          temporaryArr.push({
            id: this.reduction,
            label: this.smSinputData,
            mobile: this.smSinputData,
          });
        }
        for (let i = 0; i < temporaryArr.length; i++) {
          //数组冒泡去重
          for (let j = i + 1; j < temporaryArr.length; j++) {
            if (temporaryArr[i].id == temporaryArr[j].id) {
              temporaryArr.splice(j, 1);
              j--;
            }
          }
        }
        this.checkedList = temporaryArr;
        this.numberOfRecipients = this.checkedList.length; //总共多少人
      });
    },
    /**
     * @lastAuthor hexinting
     * @lastDate 2020-9-29
     * @description 添加list
     */
    addList() {
      let arrObj = this.checkedList; //把多选已经有了的数据赋值过来
      let noPhoneMans = []; // 没有电话的联系人名字
      console.log(this.leftTreeData);
      this.leftTreeData.forEach((item) => {
        //再把从节点获取到的数据赋值进最后的出的数组
        if (item.mobile) {
          arrObj.push({
            id: item.id,
            label: item.label,
            mobile: item.mobile,
          });
        } else {
          noPhoneMans.push(item.label);
        }
      });
      if (noPhoneMans.length > 0) {
        // 若有联系人号码为空，给提醒
        this.$message.error(
          noPhoneMans.join(",") + "  的手机号码为空，不能添加"
        );
      }
      for (let i = 0; i < arrObj.length; i++) {
        //数组冒泡去重
        for (let j = i + 1; j < arrObj.length; j++) {
          if (arrObj[i].id == arrObj[j].id) {
            arrObj.splice(j, 1);
            j--;
          }
        }
      }
      this.checkedList = arrObj; //得到最后的结果赋值给右侧
      console.log(this.checkedList);
      this.numberOfRecipients = this.checkedList.length; //总共多少人
      this.$refs.smsPhoneTree.delectAllData(); // 清空tree勾选节点
      this.$refs.quickGroup.delectAllData(); // 清空tree勾选节点
    },
    delectList() {
      //删除list
      this.checkedList = this.checkedList.filter((items) => {
        //数组过滤
        return !this.checkedCities.includes(items.id);
      });
      this.checkedCities = [];
      this.numberOfRecipients = this.checkedList.length; //总共多少人
    },
    emptyManage() {
      //清空
      this.checkedList = [];
      this.numberOfRecipients = this.checkedList.length; //总共多少人
    },
    selectTarget() {
      console.log(this.checkedList);
      let name = "";
      let ids = "";
      let mobiles = "";
      this.checkedList.forEach((item, i) => {
        i == this.checkedList.length - 1
          ? (name += item.label)
          : (name += item.label + ",");
        i == this.checkedList.length - 1
          ? (ids += item.id)
          : (ids += item.id + ",");
        i == this.checkedList.length - 1
          ? (mobiles += item.mobile)
          : (mobiles += item.mobile + ",");
      });
      this.sendTarget = name;
      this.sendIDs = ids;
      this.mobiles = mobiles;
      this.dialogVisible = false;
    },
    smsTreeHandleNodeClick(data) {
      //右侧短信内容树点击
      this.smsDialogContent = "";
      this.smsDialogContent = data.content;
    },
    sendSmsContent() {
      let time = new Date(this.smsTimingSend).getTime();
      console.log(time);
      let json = {
        content: this.smsDialogContent,
        phoneNum: this.mobiles,
        contactorIds: this.sendIDs,
        caseId: 0,
        sendTime: time,
        eventId: 0,
      };
      let data = json;
      if (json.phoneNum == "" || json.contactorIds == "") {
        this.$message({
          message: "请选择人员或输入电话号码",
          type: "warning",
        });
        return;
      }
      if (json.content == "") {
        this.$message({
          message: "请输入短信内容",
          type: "warning",
        });
        return;
      }
      console.log(data);
      this.$api.addSmsQueue(data).then((res) => {
        if (res.errorcode == "0") {
          this.$message({
            message: "短信下发成功!",
            type: "success",
          });
        } else {
          //this.$message.error(res.msg);
        }
      });
    },
    /**
     * @lastAuthor hexinting
     * @lastDate 2020-9-29
     * @description 快捷组
     */
    quickNodeClick(row) {
      let treeData;
      if (row.disabled) {
        if (row.children.length == 0) {
          let data = {
            pid: row.id,
            code: "quick", // 添加参数（根据融合通讯的来）
          };
          this.$szApi.phoneGruopList(data).then((res) => {
            if (res.errorcode == 0) {
              treeData = res.data;
              treeData.forEach((item) => {
                let newPhoneChild = {
                  label: item.label,
                  children: item.children,
                  disabled: item.disabled,
                  id: item.id,
                  mobile: item.mobile,
                  officeTel: item.officeTel,
                  mobile2: item.mobile2,
                  position: item.position,
                  temobile: item.temobile,
                  workUnit: item.workUnit,
                };
                if (!row.children) {
                  this.$set(row, "children", []);
                } else {
                  console.log(row);
                  row.children.push(newPhoneChild);
                }
              });
            } else {
              // //this.$message.error(res.msg)
            }
          });
        }
      }
    },
    callPhone(obj) {
      this.smSinputData = obj.call;
    },

    /* smsMsgWith(tab) {
        console.log(tab);
      },
      smsEmptyManage() {

      },
      smsAddList() {

      },
      smsDelectList() {

      }, */
  },
};
</script>

<style scoped>
#dailList >>> .el-card__body {
  padding: 0;
}

#dailList >>> .el-card {
  height: 80px;
  overflow: auto;
}

.arrowButton {
  margin-bottom: 20px;
  text-align: center;
}

.eventList {
  padding: 12px 0 8px 12px;
  border: 1px solid #f0f0f0;
}
.eventList::before {
  content: "";
  display: inline-block;
  width: 2px;
  height: 13px;
  background: rgba(0, 145, 255, 1);
  margin-right: 8px;
}

#boxCard >>> .el-card__body {
  padding: 20px 20px 20px 0;
}

#checkedList >>> .el-checkbox {
  display: inline-block;
  width: 100%;
  margin-right: 0;
  text-indent: 5px;
  line-height: 35px;
  text-align: left;
}
#selectTime >>> .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
</style>
