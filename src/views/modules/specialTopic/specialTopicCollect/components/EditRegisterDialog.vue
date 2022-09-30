<template>
  <div class="addRegisterDialog">
    <el-dialog title="编辑专题采集" :visible.sync="dialogVisible" width="1563px" :close-on-click-modal="false">
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
                  <div class="choose-box" v-for="(selectItem, selectIndex) in item2.fkSelectList"
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
                  
                >
                  <div class="choose-box" v-for="(selectItem, selectIndex) in item2.fkSelectList"
                  :key="selectIndex">
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
                <input
                  type="text"
                  value=""
                  v-model="item2.answerEntity.answer"
                />
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
                <textarea
                  name=""
                  id=""
                  cols="30"
                  rows="10"
                  v-model="item2.answerEntity.answer"
                ></textarea>
              </div>
              <div class="addressWrapper" v-else-if="item2.topicName == '说明'">
                <div class="questionTitle">
                  <span style="color: red;" v-if="item2.isAnswer == '1'"
                        >*</span
                      >{{ item2.title }}
                </div>
                <input
                  type="text"
                  value=""
                  v-model="item2.answerEntity.answer"
                />
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
                <img src="~@/assets/img/location.svg" alt="" />
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
                <sv-upload-img v-model="item2.answerEntity.answer"/>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
      <div class="buttonContainer">
        <div @click="updateRegister" class="saveButton" type="primary"
          >保存</div
        >
        <div @click="dialogVisible = false" class="cancelButton"
          >取消</div
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "addRegisterDialog",
  data() {
    return {
      dialogVisible: false,
      categoryList: [],
      templateId: 0,
      status: "1",
      selectId: -1,
    };
  },
  methods: {
    /**
     * @description: 通过模板id获得模板初始数据
     * @param {int,string} id:模板id,status:状态
     * @return {type}
     */
    init(id, status,selectId) {
      this.templateId = id;
      this.status = status;
      this.selectId = selectId
      this.$http({
        url: this.$http.adornUrl(
          `/fk/fkTemplateInstance/info?registerId=${id}`
        ),
        method: "post",
        data: this.$http.adornData({})
      }).then(({ data }) => {
        console.log("编辑登记获得的数据为", data);
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
     * @description: 更新登记保存
     * @param {type} 无
     * @return {type} 无
     */
    updateRegister() {
      var answerList = [];
      var hasContent = false
      var isContent = false
      var taskRegisterEntity = {
        id: this.templateId,
        taskId: this.selectId,
        remark: "",
        status: this.status
      };
      this.categoryList.forEach((categoryItem, index) => {
        categoryItem.questionEntityList.forEach((questionItem, index) => {
          console.log('questionItem',questionItem)
            if(questionItem.isAnswer == '1') {
               hasContent = Array.isArray(questionItem.answerEntity.answer) ? questionItem.answerEntity.answer.length == 0 : questionItem.answerEntity.answer == ''
              if(hasContent) {
                 
                 isContent = true
                 return
              }
            }
        });
      });
      if(isContent) {
        this.$message.error('有必填项还未填，无法新增')
        return
      }
      this.categoryList.forEach((categoryItem, index) => {
        categoryItem.questionEntityList.forEach((questionItem, index) => {
          if (questionItem.topicName == "多选题") {
            var answerItem = {
              questionId: questionItem.id,
              answer: questionItem.answerEntity.answer.join(",")
            };
          }else if(questionItem.topicName == "图片") {
            var answerItem = {
              questionId: questionItem.id,
              answer: JSON.stringify(questionItem.answerEntity.answer)
            };
          } else {
            var answerItem = {
              questionId: questionItem.id,
              answer: questionItem.answerEntity.answer
            };
          }
          answerList.push(answerItem);
        });
      });
      this.$http({
        url: this.$http.adornUrl(`/fk/fkTemplateInstance/update`),
        method: "post",
        data: this.$http.adornData({
          taskRegisterEntity: taskRegisterEntity,
          answerList: answerList
        })
      }).then(({ data }) => {
        console.log("编辑成功后返回的数据为", data);
        if (data && data.code === 0) {
          this.dialogVisible = false;
          this.$emit('refreshList')
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.addRegisterDialog {
  .el-dialog {
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
}
</style>