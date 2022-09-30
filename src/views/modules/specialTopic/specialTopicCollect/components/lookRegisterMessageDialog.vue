<!--
 * @Author: yaoweixin
 * @Date: 2020-08-21 11:36:07
 * @LastEditors: yaoweixin
 * @LastEditTime: 2020-12-22 10:26:42
 * @Description: 查看详情弹框
 * @FilePath: \SBS\src\views\modules\specialTopic\specialTopicCollect\components\lookRegisterMessageDialog.vue
-->
<template>
  <div class="lookRegisterMessageDialog">
    <el-dialog title="查看登记信息" :visible.sync="dialogVisible" width="1563px" :close-on-click-modal="false">
      <div class="top">
        <div class="topLeft">
          <div class="topHeader">
            <div class="dataSource">
              <div class="dataSourceTitle">数据来源：</div>
              <div class="source">{{ taskEntity.platformName }}</div>
            </div>
            <div class="register">
              <div class="registerTitle">登记人：</div>
              <div class="name">{{ taskEntity.createUserName }}</div>
            </div>
            <div class="registerTime">
              <div class="registerTimeTitle">登记时间：</div>
              <div class="time">{{ taskEntity.gmtModified }}</div>
            </div>
          </div>
          <div class="topBottom">
            <div class="testStatus">
              <div class="testStatusTitle">检验状态：</div>
              <div class="status"></div>
            </div>
            <div class="remarks">
              <div class="remarkTitle">备注：</div>
              <div class="remark">{{ taskEntity.remark }}</div>
            </div>
          </div>
        </div>
        <div class="topRight">
          <div class="alreadyAppearInNewspaper">
            <el-button
              circle
              class="alreadyButton"
              v-if="taskEntity.status == '1'"
            >
              已上报
            </el-button>
            <el-button
              circle
              class="alreadyButton"
              v-if="taskEntity.status == '2'"
            >
              被驳回
            </el-button>
          </div>
          <sv-button
            v-if="taskEntity.status == '1' && lowPlatFormId == topPlatFormId"
            type="secondary"
            width="100px"
            class="reject"
            @click="openRejectDialog"
          >
            驳回
          </sv-button>
        </div>
      </div>
      <div class="centerFormWrapperContainer">
        <!-- 所有添加的类目 -->
        <div
          class="centerFormWrapper"
          v-for="(item, categoryIndex) in categoryList"
          :key="categoryIndex"
        >
          <div class="formTitleWrapper">
            <div class="formTitle">{{ item.name }}</div>
            <!-- <div class="deleteText" @click="deleteCategory(categoryIndex)">删除类目</div> -->
          </div>
          <div class="centerForm">
            <div
              class="questionSlide"
              v-for="(item2, questionIndex) in item.questionEntityList"
              :key="questionIndex"
            >
            <div class="questionBar">
                <div class="questionIndex">{{ questionIndex + 1 }}</div>
              <div class="radioWrapper" v-if="item2.topicName == '单选题'">
                <div class="questionTitle">
                  <span style="color: red;" v-if="item2.isAnswer == '1'"
                        >*</span
                      >{{ item2.title }}
                </div>
                <div
                  class="radioContent"
                 
                >
                  <div class="choose-box"  v-for="(selectItem, selectIndex) in item2.fkSelectList"
                  :key="selectIndex">
                    <input
                      type="radio"
                      :value="selectItem.id"
                      v-model="item2.answerEntity.answer"
                    />
                    <label for="selectItem.content">{{
                      selectItem.content
                    }}</label>
                  </div>
                </div>
              </div>
              <div
                class="checkboxWrapper"
                v-else-if="item2.topicName == '多选题'"
              >
                <div class="questionTitle">
                  <span style="color: red;" v-if="item2.isAnswer == '1'"
                        >*</span
                      >{{ item2.title }}
                </div>
                <div
                  class="radioContent"
                  v-for="(selectItem, selectIndex) in item2.fkSelectList"
                  :key="selectIndex"
                >
                  <div class="choose-box">
                    <input
                      type="checkbox"
                      :name="selectItem.id"
                      :value="selectItem.id"
                      v-model="item2.answerEntity.answer"
                    />
                    <label for="selectItem.content">{{
                      selectItem.content
                    }}</label>
                  </div>
                </div>
              </div>
              <div
                class="singleQuestionWrapper"
                v-else-if="item2.topicName == '简答-输入'"
              >
                <div class="questionTitle">
                  <span style="color: red;" v-if="item2.isAnswer == '1'"
                        >*</span
                      >{{ item2.title }}
                </div>
                <div>{{ item2.answerEntity.answer }}</div>
              </div>
              <div
                class="manyQuestionWrapper"
                v-else-if="item2.topicName == '简答-文本'"
              >
                <div class="questionTitle">
                  <span style="color: red;" v-if="item2.isAnswer == '1'"
                        >*</span
                      >{{ item2.title }}
                </div>
                <div>{{ item2.answerEntity.answer }}</div>
              </div>
              <div class="addressWrapper" v-else-if="item2.topicName == '说明'">
                <div class="questionTitle">
                  <span style="color: red;" v-if="item2.isAnswer == '1'"
                        >*</span
                      >{{ item2.title }}</div>
                <div>{{ item2.answerEntity.answer }}</div>
              </div>
              <div
                class="locationWrapper"
                v-else-if="item2.topicName == '地址'"
              >
                <div class="questionTitle">
                  <span style="color: red;" v-if="item2.isAnswer == '1'"
                        >*</span
                      >{{ item2.title }}
                </div>
                <div>{{ item2.answerEntity.answer }}</div>
              </div>
              <div
                class="appendixWrapper"
                v-else-if="item2.topicName == '图片'"
              >
                <div class="questionTitle">
                  <span style="color: red;" v-if="item2.isAnswer == '1'"
                        >*</span
                      >{{ item2.title }}
                </div>
                <!-- <el-upload
                  class="upload-demo"
                  action=""
                  multiple
                  :file-list="fileList"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload> -->
                <div class="imgWrapper">
                  <img v-for="(imgItem,imgIndex) in  item2.answerEntity.answer" :src="imgItem.allUrl" alt="" :key="imgIndex">
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
      <el-dialog
        title="驳回登记"
        :visible.sync="rejectdialogVisible"
        width="30%"
        append-to-body
      >
        <div class="remarkContainer">
          <div class="remarkTitle">备注：</div>
          <textarea
            name=""
            id=""
            cols="30"
            rows="10"
            v-model="remarkContent"
          ></textarea>
        </div>
        <div class="buttonWrapper">
          <div class="cancelButton" @click="quitRegister">取消</div>
          <div class="sureButton" @click="submitRejectRegister">确定</div>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "lookRegisterMessageDialog",
  data() {
    return {
      topPlatFormId: -1,//上级平台id
      lowPlatFormId: -1,//下级平台id
      remarkContent: "", //备注
      dialogVisible: false,
      rejectdialogVisible: false,
      templateId: 0, //模板id
      status: "1", //状态
      categoryList: [],
      taskEntity: {} //保存登记信息
    };
  },
  methods: {
    /**
     * @description: 驳回登记取消
     * @param {*}
     * @return {*}
     */
    quitRegister() {
      this.rejectdialogVisible = false;
    },
    /**
     * @description: 驳回登记
     * @param {*}
     * @return {*}
     */
    submitRejectRegister() {
      this.$http({
        url: this.$http.adornUrl(`/fk/fkTemplateInstance/rejectRegister`),
        method: "post",
        data: this.$http.adornData({
          id: this.templateId,
          remark: this.remarkContent,
          status: 2
        })
      }).then(({ data }) => {
        console.log("data", data);
        if (data && data.code === 0) {
          this.remarkContent = ''
          this.rejectdialogVisible = false;
          this.init(this.templateId,"2",this.topPlatFormId)
          this.$emit("submitReject")
        }
      });
    },
    /**
     * @description: 初始化查看详情数据
     * @param {int} id: 模板id
     * @return {type}
     */
    init(id, status,topPlatFormId) {
      this.templateId = id;
      this.status = status;
      this.topPlatFormId = topPlatFormId
      this.$http({
        url: this.$http.adornUrl(
          `/fk/fkTemplateInstance/info?registerId=${id}`
        ),
        method: "post",
        data: this.$http.adornData({})
      }).then(({ data }) => {
        console.log("查看登记获得的数据为", data);
        this.taskEntity = data.data.taskRegisterEntity;
        this.lowPlatFormId = this.taskEntity.nowPlatformId
        var categoryArr = data.data.templateCataInstanceEntityList;
        categoryArr.forEach((categoryItem, index) => {
          categoryItem.questionEntityList.forEach((questionItem, index) => {
            if (questionItem.answerEntity == null) {
              questionItem.answerEntity = {
                answer: ""
              };
            }
            if (questionItem.topicName === "多选题") {
              questionItem.answerEntity.answer = questionItem.answerEntity.answer.split(
                ","
              );
            }
            if (questionItem.topicName === "图片") {
              questionItem.answerEntity.answer = JSON.parse(questionItem.answerEntity.answer)
            }
          });
        });
        this.categoryList = categoryArr;
        console.log("categoryList", this.categoryList);
      });
    },
    /**
     * @description: 打开驳回弹框
     * @param {type} params
     * @return {type}
     */
    openRejectDialog() {
      this.rejectdialogVisible = true;
    }
  }
};
</script>
<style lang="less" scoped>
.lookRegisterMessageDialog {
  .el-dialog {
    .top {
      display: flex;
      background-color: #ccc;
      .topLeft {
        .topHeader {
          .dataSource {
            .dataSourceTitle {
            }

            .source {
            }
          }

          .register {
            .registerTitle {
            }

            .name {
            }
          }

          .registerTime {
            .registerTimeTitle {
            }

            .time {
            }
          }
        }

        .topBottom {
          .testStatus {
            .testStatusTitle {
            }

            .status {
            }
          }

          .remarks {
            .remarkTitle {
            }

            .remark {
            }
          }
        }
      }

      .topRight {
        display: flex;
        flex-direction: row;
        margin-left: 100px;
        .alreadyAppearInNewspaper {
          .alreadyButton {
            width: 100px;
            height: 100%;
          }
        }

        .reject {
          margin-left: 100px;
          position: relative;
          top: 40%;
        }
      }
    }

    /*表单内容 */
    .centerFormWrapperContainer {
     .centerFormWrapper {
          // border-bottom: 1px solid #ccc;
          padding-top: 18px;
          padding-left: 30px;
          padding-right: 30px;
          //盒子模型
          .formTitleWrapper {
            display: flex;
            justify-content: space-between;
            .formTitle {
              &.catActive {
                color:#0091ff;
              }
              font-size: 20px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #333333;
              cursor: pointer;
              img {
                width: 20px;
                height: 20px;
                object-fit: cover;
                margin-left: 4px;
              }
            }

            .deleteText {
              font-size: 17px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #0091ff;
              display: flex;
              align-items: center;
              img {
                width: 17px;
                height: 21px;
                object-fit: cover;
                margin-right: 6px;
              }
            }
          }
          .centerForm {
            .questionSlide {
              .questionBar {
                position: relative;
                .deleteQuestionIcon {
                  position: absolute;
                  right: 24px;
                  top: 17px;
                }
                display: flex;
                margin-top: 28px;
                width: 900px;
                background: #f9fbff;
                border-radius: 4px;

                .questionIndex {
                  flex-shrink: 0;
                  width: 25px;
                  background: #9cc6fe;
                  border-radius: 4px 0px 0px 4px;
                  font-size: 17px;
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: #ffffff;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                }

                .radioWrapper {
                  padding-bottom: 17px;
                  .questionTitle {
                    display: flex;
                    align-items: center;
                    font-size: 17px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #666666;
                    margin-top: 17px;
                    margin-left: 21px;
                  }

                  .radioContent {
                    display: flex;
                    .choose-box {
                      margin-left: 17px;
                      input#yes {
                      }

                      label {
                      }
                    }
                  }

                  .expandContainer {
                    .el-checkbox {
                      margin-left: 8px;
                    }
                  }
                }

                .checkboxWrapper {
                  padding-bottom: 17px;
                  .questionTitle {
                    display: flex;
                    align-items: center;
                    font-size: 17px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #666666;
                    margin-top: 17px;
                    margin-left: 21px;
                  }

                  .radioContent {
                    display: flex;
                    .choose-box {
                      margin-left: 17px;
                      input#selectItem.content {
                      }

                      label {
                      }
                    }
                  }

                  .expandContainer {
                    .el-checkbox {
                      margin-left: 8px;
                    }
                  }
                }

                .singleQuestionWrapper {
                  padding-bottom: 17px;
                  .questionTitle {
                    display: flex;
                    align-items: center;
                    font-size: 17px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #666666;
                    margin-top: 17px;
                    margin-left: 21px;
                  }

                  input {
                    flex-shrink: 0;
                    width: 820px;
                    height: 42px;
                    background: #ffffff;
                    border-radius: 4px;
                    border: 1px solid #dddddd;
                    margin: 7px 21px;
                  }

                  .expandContainer {
                    .el-checkbox {
                      margin-left: 8px;
                    }
                  }
                }

                .manyQuestionWrapper {
                  padding-bottom: 17px;
                  .questionTitle {
                    display: flex;
                    align-items: center;
                    font-size: 17px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #666666;
                    margin-top: 17px;
                    margin-left: 21px;
                  }

                  textarea {
                    flex-shrink: 0;
                    width: 820px;
                    height: 141px;
                    background: #ffffff;
                    border-radius: 4px;
                    border: 1px solid #dddddd;
                    margin: 7px 21px;
                  }

                  .expandContainer {
                    .el-checkbox {
                      margin-left: 8px;
                    }
                  }
                }

                .addressWrapper {
                  padding-bottom: 17px;
                  .questionTitle {
                    display: flex;
                    align-items: center;
                    font-size: 17px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #666666;
                    margin-top: 17px;
                    margin-left: 21px;
                  }

                  input {
                    flex-shrink: 0;
                    width: 820px;
                    height: 42px;
                    background: #ffffff;
                    border-radius: 4px;
                    border: 1px solid #dddddd;
                    margin: 7px 21px;
                  }

                  .expandContainer {
                    .el-checkbox {
                      margin-left: 8px;
                    }
                  }
                }

                .locationWrapper {
                  padding-bottom: 17px;
                  .questionTitle {
                    display: flex;
                    align-items: center;
                    font-size: 17px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #666666;
                    margin-top: 17px;
                    margin-left: 21px;
                  }

                  .locationWrapper {
                    width: 187px;
                    height: 42px;
                    background: #ffffff;
                    border-radius: 21px;
                    border: 1px solid #dddddd;
                    font-size: 17px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #333333;
                    box-sizing: border-box;
                    padding: 8px 30px;
                    margin-left: 21px;
                    img {
                      width: 17px;
                      height: 21px;
                      object-fit: cover;
                    }
                  }

                  .expandContainer {
                    .el-checkbox {
                      margin-left: 8px;
                    }
                  }
                }

                .appendixWrapper {
                  padding-bottom: 17px;
                  .questionTitle {
                    display: flex;
                    align-items: center;
                    font-size: 17px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #666666;
                    margin-top: 17px;
                    margin-left: 21px;
                  }
                .sv-upload-img {
                  margin-left: 17px;
                }
                  .upload-demo {
                    .uploadContainer {
                      width: 141px;
                      height: 141px;
                      background: #ffffff;
                      border: 1px solid rgba(0, 0, 0, 0.15);
                      margin-top: 14px;
                      margin-left: 22px;
                      box-sizing: border-box;
                      .addText {
                        color: #9cc6fe;
                        font-size: 40px;
                        margin-top: 30px;
                      }

                      .toast {
                        font-size: 17px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #999999;
                      }
                    }
                  }

                  .expandContainer {
                    .el-checkbox {
                      margin-left: 8px;
                    }
                  }
                }
              }
            }
          }
        }
        //盒子模型
        .buttonContainer {
          display: flex;
          justify-content: space-around;
          margin-top: 15px;
          //外观
          .cancelButton {
            cursor: pointer;
            width: 73px;
            height: 42px;
            background: #0091ff;
            border-radius: 4px;
            font-size: 17px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #ffffff;
            text-align: center;
            line-height: 42px;
          }
          //外观
          .saveButton {
            cursor: pointer;
            width: 73px;
            height: 42px;
            background: #0091ff;
            border-radius: 4px;
            font-size: 17px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #ffffff;
            text-align: center;
            line-height: 42px;
          }
        }
    }
    .el-dialog {
      .remarkContainer {
        .remarkTitle {
        }

        textarea {
        }
      }

      .buttonWrapper {
        .cancelButton {
        }

        .sureButton {
        }
      }
    }
  }
}
</style>