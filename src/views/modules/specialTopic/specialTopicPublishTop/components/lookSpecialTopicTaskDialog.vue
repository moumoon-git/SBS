<!--
 * @Author: yanghaohao
 * @Date: 2020-09-01 10:46:42
 * @LastEditTime: 2020-12-18 11:10:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \SBS\src\views\modules\specialTopic\specialTopicPublishTop\components\lookSpecialTopicTaskDialog.vue
-->

<template>
  <div class="publishSpecialTopicTaskDialog">
    <el-dialog
      title="查看专题任务"
      :visible.sync="dialogVisible"
      width="30%"
      @close="cancelLook()"
    >
      <div class="dialogWrapper">
        <div class="topContent">
          <div class="collectUnitWrapper">
            <div class="collectUnitTitle">采集单位：</div>
            <div class="collectUnit">{{ dataForm.platName }}</div>
          </div>
          <div class="taskWrapper">
            <div class="taskName">任务名称：</div>
            <div class="taskNameContent">{{ dataForm.taskName }}</div>
          </div>
          <div class="taskDesc">
            <div class="taskdesc">任务说明：</div>
            <div class="taskDescContent">{{ dataForm.remark }}</div>
          </div>
          <div class="specialTopicTemplate">
            <div class="specailTopic">专题模板：</div>
            <div class="specialTopicContent">{{ dataForm.templateName }}</div>
            <!-- <div class="lookButton" style="color: #0091ff; margin-left: 20px">
              查看
            </div> -->
          </div>
          <div class="deadline">
            <div class="deadlineTitle">截止时间：</div>
            <img src="~@/assets/img/car.png" alt />
            <div class="timeText">{{ dataForm.endTime }}</div>
          </div>
          <div class="confirmWrapper">
            <div class="confirm">提醒通知：</div>
            <div class="confirmText" v-if="Number(dataForm.valueSwitch)">
              已开启
            </div>
            <div class="confirmText" v-if="!Number(dataForm.valueSwitch)">
              未开启
            </div>
            <div class="imgWrapper">
              <img src="~@/assets/img/warning.png" alt />
              <div class="remark">
                注：开启提醒后，专题采集截止时间结束前，自动提醒相关平台负责人和任务负责人
              </div>
            </div>
          </div>
          <div class="confirmBefore" v-if="dataForm.valueSwitch">
            <div class="confirmTitle">提前通知：</div>
            <div class="beforeNumber">{{ dataForm.remindDay }}天</div>
          </div>
          <div class="confirmMethod" v-if="dataForm.valueSwitch">
            <div class="confirmTitle">通知方式：</div>
            <div class="confirmContent" v-if="dataForm.radio == 1">短信</div>
            <div class="confirmContent" v-if="dataForm.radio == 2">电话</div>
            <div class="confirmContent" v-if="dataForm.radio == 3">
              短信+电话
            </div>
          </div>
        </div>
        <div class="bottomContent">
          <div class="startTaskTitle">子任务：</div>
          <div style="display: flex">
            <!--切换点击样式写法
                        class="plateform-active" 
            :class="buttonType=='0'?'plateform-active':''" >-->
            <sv-button>平台</sv-button>
            <!-- <sv-button @click="showHuman()">人员</sv-button> -->
          </div>
          <div>
            <span
              v-for="(item, index) in dataForm.platformList"
              :key="index"
              style="background-color: #f4f4f4; margin-left: 10px"
              >{{ item.platformName }}</span
            >
          </div>
          <!-- <div v-if="buttonType == 1">
            <div class="leaderTitle">任务负责人:</div>
            <div class="leaderName">{{ dataForm.chargeName }}</div>
            <div class="joinerTitle">任务参与人:</div>
            <div class="joinerName">
              <span v-for="(item, index) in dataForm.joinList" :key="index">
                {{ item.name }}
              </span>
            </div>
          </div> -->
        </div>
        <div v-if="dataForm.status == 1" class="stateIcon">进行中</div>
        <div v-if="dataForm.status == 2" class="stateIcon2">已完成</div>
        <div v-if="dataForm.status == 3" class="stateIcon3">已过期</div>
      </div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="cancelLook()">取 消</el-button>
        <el-button @click="dialogVisible = false">删除</el-button>
        <el-button type="primary" @click="finishTask()">结束任务</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "publishSpecialTopicTaskDialog",
  data() {
    return {
      dialogVisible: true,
      //平台人员切换
      buttonType: "0",
      //选择平台弹窗
      platformDialogVisible: false,
      templateDialogVisible: false,
      checkModelList: [],
      //模板树控件
      treeList: [],
      treeListProps: {
        label: "name",
        children: "children"
      },
      dataForm: {
        platName:'',
        searchName: "",
        //表单数据
        taskName: "",
        remark: "",
        templateName: "",
        endTime: "",
        valueSwitch: "0",
        taskSwitch: "0",
        remindDay: "",
        status: "1",
        //通知方式
        radio: 1,
        //平台及人员信息
        platformList: [],
        // contactorId: "",
        // contactorName: "",
        // type: "",
        chargeName: "",
        joinList: [],
        platformName: ""
      },
      //此处添加表单验证规则
      dataRule: {},

      dataList: [],
      groupIds: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      //选择的数据
      dataListSelections: []
    };
  },
  methods: {
    /**
     * @description: 关闭查看弹窗
     * @param {type}
     * @return {type}
     */
    cancelLook() {
      this.$emit("cancelLook");
    },

    /**
     * @description: 从父组件获取数据并对相应变量赋值
     * @param {拿到的data数据}
     * @return {}
     */
    init(data) {
      this.dataForm.id = data.id;
      let platformName = [];
      this.$http({
        url: this.$http.adornUrl(`/fk/fkTask/info?id=${this.dataForm.id}`),
        method: "get"
      }).then(({ data }) => {
        if (data && data.code == 0) {
          this.dataForm.platName = data.data.platformName;
          this.dataForm.templateName = data.data.templateName;
          this.dataForm.platformList = data.data.platformList;
          this.dataForm.platformList.forEach(item => {
            platformName.push(item.platformName);
          });
          platformName.forEach(item => {
            this.dataForm.platformName = item + ",";
          });
          this.dataForm.platformName = this.dataForm.platformName.slice(
            0,
            this.dataForm.platformName.length - 1
          );
          console.log("this.dataForm.platformList", this.dataForm.platformList);
        } else {
          this.$message.error(data.msg);
        }
      });
      this.dataForm.taskName = data.name;
      this.dataForm.remark = data.remark;
      this.dataForm.endTime = data.endTime;
      this.dataForm.valueSwitch = data.isRemind;
      this.dataForm.taskSwitch = data.isSontask;
      this.dataForm.remindDay = data.advanceRemindDay;
      this.dataForm.radio = data.remindWay;
      this.dataForm.status = data.status;
      this.dataListSelections = data;
      // this.dataForm.chargeName = data.contactorList.contactorName;
      // this.dataForm.contactorList = data.contactorList.contactorId;
      this.dataForm.type = data.contactorList.type;
      let totalContactorList = data.contactorList;
      totalContactorList.forEach(item => {
        if (item.type == "0") {
          this.dataForm.chargeName = item.contactorName;
          // console.log("1111111111", item, this.dataForm.chargeName);
        } else if (item.type == "1") {
          this.dataForm.joinList.push({ name: item.contactorName });
        }
      });
    },
    /**
     * @description: 平台人员切换
     * @param {}
     * @return {}
     */
    showPlateform() {
      this.buttonType = "0";
    },
    showHuman() {
      this.buttonType = "1";
    },
    finishTask() {
      this.$http({
        url: this.$http.adornUrl(
          `/fk/fkTask/finishTask?id=${this.dataForm.id}`
        ),
        method: "get"
      }).then(({ data }) => {
        if (data && data.code == 0) {
          this.dialogVisible = false;
          this.$emit("refreshDataList");
        } else {
          this.$message.error(data.msg);
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.publishSpecialTopicTaskDialog {
  .el-dialog {
    .dialogWrapper {
      position: relative;
      .topContent {
        border-bottom: 1px solid #ccc;
        .collectUnitWrapper {
          display: flex;
          .collectUnitTitle {
          }

          .collectUnit {
          }
        }
        .taskWrapper {
          display: flex;
          .taskName {
          }

          input {
          }
        }

        .taskDesc {
          display: flex;
          .taskdesc {
          }

          textarea {
            height: 50px;
          }
        }

        .specialTopicTemplate {
          display: flex;
          .specailTopic {
          }

          .inputContainer {
            input {
            }

            img {
            }
          }
        }

        .deadline {
          display: flex;
          .deadlineTitle {
          }

          .timeChoose {
            .el-date-picker {
            }
          }
        }

        .confirmWrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          .confirm {
          }
          .confirmText {
          }
          .imgWrapper {
            display: flex;
            img {
              width: 20px;
              height: 20px;
            }

            .remark {
              background-color: #ccc;
            }
          }
        }
        .confirmBefore {
          display: flex;
          .confirmTitle {
          }

          input {
          }
        }

        .confirmMethod {
          display: flex;
          .confirmTitle {
          }

          .el-radio-group {
            .el-radio {
            }
          }
        }
      }
      .bottomContent {
        .startTask {
          display: flex;
          .startTaskTitle {
          }

          .switchContainer {
            input#startRemind {
              display: none;
            }
            input#startRemind:checked + .labelStyle {
              background-color: #70b603;
            }
            input#startRemind:checked + .labelStyle span.ball {
              transform: translateX(50px);
            }
            input#startRemind:checked + .labelStyle span.on {
              display: inline-block;
            }
            input#startRemind:checked + .labelStyle span.off {
              display: none;
            }
            .labelStyle {
              width: 80px;
              height: 30px;
              display: block;
              background-color: #f2f2f2;
              position: relative;
              border-radius: 30px;
              span.ball {
                position: absolute;
                display: inline-block;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background-color: #fff;
                left: 0;
                top: 0;
                transition: all 0.5s;
              }

              span.on {
                display: none;
                line-height: 30px;
                color: #fff;
                text-indent: 8px;
              }

              span.off {
                display: inline-block;
                text-indent: 32px;
                color: #ccc;
                line-height: 30px;
              }
            }
          }
        }

        .addContainer {
          .chooseItems {
            display: flex;
            .chooseItem {
              width: 80px;
              height: 30px;
              border: 1px solid #ccc;
              background-color: #fff;
              text-align: center;
              line-height: 30px;
            }
          }

          .platformSlide {
            background-color: #f2f2f2;
            height: 100px;
            .addButton {
              width: 50px;
              height: 30px;
              background-color: #fff;
              text-align: center;
            }

            .platformContainer {
              display: flex;
              .platform {
                position: relative;
                width: 80px;
                height: 30px;
                background-color: #fff;
                .platformName {
                }

                img {
                  position: absolute;
                  right: -8px;
                  top: -8px;
                  width: 20px;
                  height: 20px;
                }
              }
            }
          }

          .personSlide {
            margin-top: 8px;
            background-color: #f2f2f2;
            height: 100px;
            .taskLeader {
              display: flex;
              .leaderTitle {
              }

              .addButton {
                width: 50px;
                height: 30px;
                background-color: #fff;
                text-align: center;
              }

              .leaderContainer {
                .leaderName {
                }
              }
            }

            .taskJoiner {
              display: flex;
              .joinerTitle {
              }

              .addButton {
                width: 50px;
                height: 30px;
                background-color: #fff;
                text-align: center;
              }

              .joinerContainer {
                .joinerName {
                }
              }
            }
          }
        }
      }
      .stateIcon {
        position: absolute;
        top: 30px;
        right: 60px;
        width: 70px;
        height: 70px;
        border-radius: 50%;
        background-color: #00ff00;
        text-align: center;
        color: #ffffff;
        line-height: 70px;
        box-shadow: 0px 4px 14px 3px rgba(54, 121, 225, 0.09);
      }
      .stateIcon2 {
        position: absolute;
        top: 30px;
        right: 60px;
        width: 70px;
        height: 70px;
        border-radius: 50%;
        background-color: #409eff;
        text-align: center;
        color: #ffffff;
        line-height: 70px;
        box-shadow: 0px 4px 14px 3px rgba(54, 121, 225, 0.09);
      }
      .stateIcon3 {
        position: absolute;
        top: 30px;
        right: 60px;
        width: 70px;
        height: 70px;
        border-radius: 50%;
        background-color: #f56c6c;
        text-align: center;
        color: #ffffff;
        line-height: 70px;
        box-shadow: 0px 4px 14px 3px rgba(54, 121, 225, 0.09);
      }
    }

    span.dialog-footer {
      .el-button {
      }
    }
  }
}
</style>