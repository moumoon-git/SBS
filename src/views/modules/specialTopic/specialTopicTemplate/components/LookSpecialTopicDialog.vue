/* eslint-disable max-len */
/* eslint-disable max-len */
<!--
 * @Author: yaoweixin
 * @Date: 2020-09-04 15:55:21
 * @LastEditors: yaoweixin
 * @LastEditTime: 2020-12-18 17:55:57
 * @Description: 查看专题弹框
 * @FilePath: \SBSNEW\src\views\modules\specialTopic\specialTopicTemplate\components
 \LookSpecialTopicDialog.vue
-->
<template>
  <div class="lookSpecialTopicDialog">
    <el-dialog
      title="查看专题"
      :visible.sync="dialogVisible"
      width="1563px"
      :close-on-click-modal="false"
    >
      <div class="topForm">
        <div class="templateNameWrapper">
          <div class="templateNameTitle">
            模板名称
          </div>
          <div class="template">
            {{ templateName }}
          </div>
        </div>
        <div class="templateGroupWrapper">
          <div class="templateGroupTitle">
            模板分组
          </div>
          <div class="templateGroup">
            {{ templateGroupName }}
          </div>
        </div>
        <div class="questionDescWrapper">
          <div class="questionDescTitle">
            题型描述
          </div>
          <div class="questionDesc">
            {{ questionDesc }}
          </div>
        </div>
      </div>
      <!-- 所有添加的类目 -->
      <div
        v-for="(item, categoryIndex) in categoryList"
        :key="categoryIndex"
        class="centerFormWrapper"
      >
        <div class="formTitleWrapper">
          <div class="formTitle">
            {{ item.name }}
          </div>
          <!-- <div class="deleteText" @click="deleteCategory(item.id)">删除类目</div> -->
        </div>
        <div class="centerForm">
          <div
            v-for="(item2, questionIndex) in item.questionEntityList"
            :key="questionIndex"
            class="questionSlide"
          >
            <div class="questionBar">
              <div class="questionIndex">
                {{ questionIndex + 1 }}
              </div>
              <div
                v-if="item2.topicName === '单选题'"
                class="radioWrapper"
              >
                <div class="questionTitle">
                  <span
                    v-if="item2.isAnswer === '1'"
                    style="color: red"
                  >
                    *
                  </span>
                  {{ item2.title }}
                </div>
                <div class="radioContent">
                  <div
                    v-for="(selectItem, selectIndex) in item2.fkSelectList"
                    :key="selectIndex"
                    class="choose-box"
                  >
                    <input
                      id="yes"
                      type="radio"
                      name="choose"
                      value="selectItem.content"
                    >
                    <label for="selectItem.content">{{
                      selectItem.content
                    }}</label>
                  </div>
                </div>
                <div class="expandContainer">
                  <el-checkbox
                    :checked="item2.isView === '1'"
                    disabled
                  >
                    是否列为列表显示字段
                  </el-checkbox>

                  <el-checkbox
                    :checked="item2.isSearch === '1'"
                    disabled
                  >
                    是否列为默认检索字段
                  </el-checkbox>

                  <el-checkbox
                    :checked="item2.isCount === '1'"
                    disabled
                  >
                    是否列为统计字段
                  </el-checkbox>
                </div>
              </div>
              <div
                v-else-if="item2.topicName === '多选题'"
                class="checkboxWrapper"
              >
                <div class="questionTitle">
                  <span
                    v-if="item2.isAnswer === '1'"
                    style="color: red"
                  >
                    *
                  </span>
                  {{ item2.title }}
                </div>
                <div class="radioContent">
                  <div
                    v-for="(selectItem, selectIndex) in item2.fkSelectList"
                    :key="selectIndex"
                    class="choose-box"
                  >
                    <input
                      id="selectItem.content"
                      type="checkbox"
                      name="selectItem.content"
                    >
                    <label for="selectItem.content">{{
                      selectItem.content
                    }}</label>
                  </div>
                </div>
                <div class="expandContainer">
                  <el-checkbox
                    :checked="item2.isView === '1'"
                    disabled
                  >
                    是否列为列表显示字段
                  </el-checkbox>

                  <el-checkbox
                    :checked="item2.isSearch === '1'"
                    disabled
                  >
                    是否列为默认检索字段
                  </el-checkbox>

                  <el-checkbox
                    :checked="item2.isCount === '1'"
                    disabled
                  >
                    是否列为统计字段
                  </el-checkbox>
                </div>
              </div>
              <div
                v-else-if="item2.topicName === '简答-输入'"
                class="singleQuestionWrapper"
              >
                <div class="questionTitle">
                  <span
                    v-if="item2.isAnswer === '1'"
                    style="color: red"
                  >*
                  </span>
                  {{ item2.title }}
                </div>
                <input
                  type="text"
                  value=""
                  :placeholder="item2.remark"
                >
                <div class="expandContainer">
                  <el-checkbox
                    :checked="item2.isView === '1'"
                    disabled
                  >
                    是否列为列表显示字段
                  </el-checkbox>

                  <el-checkbox
                    :checked="item2.isSearch === '1'"
                    disabled
                  >
                    是否列为默认检索字段
                  </el-checkbox>

                  <el-checkbox
                    :checked="item2.isCount === '1'"
                    disabled
                  >
                    是否列为统计字段
                  </el-checkbox>
                </div>
              </div>
              <div
                v-else-if="item2.topicName === '简答-文本'"
                class="manyQuestionWrapper"
              >
                <div class="questionTitle">
                  <span
                    v-if="item2.isAnswer === '1'"
                    style="color: red"
                  >
                    *
                  </span>
                  {{ item2.title }}
                </div>
                <textarea
                  id=""
                  name=""
                  cols="30"
                  rows="10"
                  :placeholder="item2.remark"
                />
                <div class="expandContainer">
                  <el-checkbox
                    :checked="item2.isView === '1'"
                    disabled
                  >
                    是否列为列表显示字段
                  </el-checkbox>

                  <el-checkbox
                    :checked="item2.isSearch === '1'"
                    disabled
                  >
                    是否列为默认检索字段
                  </el-checkbox>

                  <el-checkbox
                    :checked="item2.isCount === '1'"
                    disabled
                  >
                    是否列为统计字段
                  </el-checkbox>
                </div>
              </div>
              <div
                v-else-if="item2.topicName === '说明'"
                class="addressWrapper"
              >
                <div class="questionTitle">
                  <span
                    v-if="item2.isAnswer === '1'"
                    style="color: red"
                  >
                    *
                  </span>
                  {{ item2.title }}
                </div>
                <input
                  type="text"
                  value=""
                  placeholder="请填写详细地址"
                >
                <div class="expandContainer">
                  <el-checkbox
                    :checked="item2.isView === '1'"
                    disabled
                  >
                    是否列为列表显示字段
                  </el-checkbox>

                  <el-checkbox
                    :checked="item2.isSearch === '1'"
                    disabled
                  >
                    是否列为默认检索字段
                  </el-checkbox>

                  <el-checkbox
                    :checked="item2.isCount === '1'"
                    disabled
                  >
                    是否列为统计字段
                  </el-checkbox>
                </div>
              </div>
              <div
                v-else-if="item2.topicName === '地址'"
                class="locationWrapper"
              >
                <div class="questionTitle">
                  <span
                    v-if="item2.isAnswer === '1'"
                    style="color: red"
                  >
                    *
                  </span>
                  {{ item2.title }}
                </div>
                <div class="locationWrapper">
                  <img
                    src="~@/assets/img/specialTopicImg/location.png"
                    alt=""
                  >
                  获取当前位置
                </div>
                <div class="expandContainer">
                  <el-checkbox
                    :checked="item2.isView === '1'"
                    disabled
                  >
                    是否列为列表显示字段
                  </el-checkbox>

                  <el-checkbox
                    :checked="item2.isSearch === '1'"
                    disabled
                  >
                    是否列为默认检索字段
                  </el-checkbox>

                  <el-checkbox
                    :checked="item2.isCount === '1'"
                    disabled
                  >
                    是否列为统计字段
                  </el-checkbox>
                </div>
              </div>
              <div
                v-else-if="item2.topicName === '图片'"
                class="appendixWrapper"
              >
                <div class="questionTitle">
                  <span
                    v-if="item2.isAnswer === '1'"
                    style="color: red"
                  >
                    *
                  </span>
                  {{ item2.title }}
                </div>
                <el-upload
                  class="upload-demo"
                  action=""
                  multiple
                >
                  <!-- <el-button size="small" type="primary">点击上传</el-button> -->
                  <div class="uploadContainer">
                    <div class="addText">
                      +
                    </div>
                    <div class="toast">
                      点击上传
                    </div>
                  </div>
                </el-upload>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'LookSpecialTopicDialog',
  data() {
    return {
      // 控制查看专题弹框的显示与否
      dialogVisible: false,
      // 类目列表
      categoryList: [],
      // 模板名称
      templateName: '',
      questionDesc: '',
      // 模板分组名
      templateGroupName: '',
    };
  },
  methods: {
    /**
     * @description: 重置表单数据
     * @param {}
     * @return {type} 无
     */
    resetFormData() {
      // 类目列表
      this.categoryList = [];
      // 模板名称
      this.templateName = '';
      // 题型描述
      this.questionDesc = '';
      // 模板分组名
      this.templateGroupName = '';
    },
    /**
     * @description: 初始化查看专题模板数据
     * @param {int} id:模板的id
     * @return {type} 无
     */
    init(id) {
      this.resetFormData();
      const templateId = id;
      this.$http({
        url: this.$http.adornUrl(`/fk/fkTemplate/info?id=${templateId}`),
        method: 'get',
        params: this.$http.adornParams({}),
      }).then(({ data }) => {
        if (data.code === 0) {
          this.categoryList = data.data.cataEntityList;
          this.templateName = data.data.name;
          this.questionDesc = data.data.remark;
          this.templateGroupName = data.data.groupIdString;
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.lookSpecialTopicDialog {
  .el-dialog {
    .topForm {
      border-bottom: 1px solid #f2f2f2;
      .templateNameWrapper {
        display: flex;
        font-size: 17px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        margin-bottom: 28px;
        .templateNameTitle {
          margin-right: 15px;
        }
      }

      .templateGroupWrapper {
        display: flex;
        font-size: 17px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        margin-bottom: 28px;
        .templateGroupTitle {
          margin-right: 15px;
        }
      }

      .questionDescWrapper {
        display: flex;
        font-size: 17px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        margin-bottom: 28px;
        .questionDescTitle {
          margin-right: 15px;
        }
      }
    }

    .centerFormWrapper {
      .formTitleWrapper {
        .formTitle {
          font-size: 20px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
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
                  margin-left: 8px;
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
                  margin-left: 8px;
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
  }
}
</style>
