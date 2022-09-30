<!--
 * @Author: yaoweixin
 * @Date: 2020-08-16 16:14:13
 * @LastEditors: yaoweixin
 * @LastEditTime: 2020-12-18 17:59:48
 * @Description: 编辑专题弹框
 * @FilePath: \SBSNEW\src\views\modules\specialTopic
 \specialTopicTemplate\components\editSpecialTopicDialog.vue
-->
<template>
  <div
    class="addSpecialTopicDialog"
  >
    <el-dialog
      title="编辑专题"
      :visible.sync="dialogVisible"
      width="1563px"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div class="dialogWrapper">
        <!-- 左侧部分 -->
        <div class="left">
          <div class="mainContent">
            <div
              class="mainButton"
              @click="openAddCategoryDialog"
            >
              + 新增类目
            </div>
            <div
              class="itemWrapper"
              :class="{ itemActive: itemIndex === 1 }"
              @click="addQuestion(1)"
            >
              <img
                v-if="itemIndex === 1"
                src="~@/assets/img/specialTopicImg/singleChooseActive.png"
                alt=""
              >
              <img
                v-else
                src="~@/assets/img/specialTopicImg/singleChoose.png"
                alt=""
              >
              <div class="itemTitle">
                单选框
              </div>
            </div>
            <div
              class="itemWrapper"
              :class="{ itemActive: itemIndex === 2 }"
              @click="addQuestion(2)"
            >
              <img
                v-if="itemIndex === 2"
                src="~@/assets/img/specialTopicImg/manyChooseActive.png"
                alt=""
              >
              <img
                v-else
                src="~@/assets/img/specialTopicImg/manyChoose.png"
                alt=""
              >
              <div class="itemTitle">
                多选项
              </div>
            </div>
            <div
              :class="{ itemActive: itemIndex === 3 }"
              class="itemWrapper"
              @click="addQuestion(3)"
            >
              <img
                v-if="itemIndex === 3"
                src="~@/assets/img/specialTopicImg/singleQuestionActive.png"
                alt=""
              >
              <img
                v-else
                src="~@/assets/img/specialTopicImg/singleQuestion.png"
                alt=""
              >
              <div class="itemTitle">
                问答题（单行）
              </div>
            </div>
            <div
              :class="{ itemActive: itemIndex === 4 }"
              class="itemWrapper"
              @click="addQuestion(4)"
            >
              <img
                v-if="itemIndex === 4"
                src="~@/assets/img/specialTopicImg/manyQuestionActive.png"
                alt=""
              >
              <img
                v-else
                src="~@/assets/img/specialTopicImg/manyQuestion.png"
                alt=""
              >
              <div class="itemTitle">
                问答题（多行）
              </div>
            </div>
            <div
              class="itemWrapper"
              :class="{ itemActive: itemIndex === 5 }"
              @click="addQuestion(5)"
            >
              <img
                v-if="itemIndex === 5"
                src="~@/assets/img/specialTopicImg/addressActive.png"
                alt=""
              >
              <img
                v-else
                src="~@/assets/img/specialTopicImg/address.png"
                alt=""
              >
              <div class="itemTitle">
                地址
              </div>
            </div>
            <div
              class="itemWrapper"
              :class="{ itemActive: itemIndex === 6 }"
              @click="addQuestion(6)"
            >
              <img
                v-if="itemIndex === 6"
                src="~@/assets/img/specialTopicImg/locationActive.png"
                alt=""
              >
              <img
                v-else
                src="~@/assets/img/specialTopicImg/location.png"
                alt=""
              >
              <div class="itemTitle">
                定位
              </div>
            </div>
            <div
              class="itemWrapper"
              :class="{ itemActive: itemIndex === 7 }"
              @click="addQuestion(7)"
            >
              <img
                v-if="itemIndex === 7"
                src="~@/assets/img/specialTopicImg/fileActive.png"
                alt=""
              >
              <img
                v-else
                src="~@/assets/img/specialTopicImg/file.png"
                alt=""
              >
              <div class="itemTitle">
                附件
              </div>
            </div>
          </div>
        </div>
        <!-- 中间部分 -->
        <div class="center">
          <div class="topForm">
            <el-form
              ref="form"
              :model="form"
              label-width="80px"
            >
              <el-form-item
                label="模板名称:"
                class="formItem"
              >
                <el-input
                  v-model="form.name"
                  class="formInput"
                />
              </el-form-item>
              <el-form-item
                label="题型描述"
                class="formItem"
              >
                <el-input
                  v-model="form.desc"
                  type="textarea"
                  class="textareaStyle"
                />
              </el-form-item>
              <el-form-item
                label="模板分组"
                class="formItem"
              >
                <div
                  class="inputContainer"
                  @click.prevent="openTemplateGroupDialog"
                >
                  <img
                    src="~@/assets/img/specialTopicImg/expand.png"
                    alt=""
                  >
                  <input
                    v-model="templateGroupNode.name"
                    type="text"
                    readonly
                    class="inputStyle"
                  >
                </div>
              </el-form-item>
            </el-form>
          </div>
          <div
            v-for="(item, categoryIndex) in categoryList"
            :key="categoryIndex"
            class="centerFormWrapper"
          >
            <div class="formTitleWrapper">
              <div
                :class="{catActive: catIndex == categoryIndex}"
                class="formTitle"
                @click="chooseCat(item,categoryIndex)"
              >
                {{ item.name }}
                <img
                  src="~@/assets/img/specialTopicImg/titleDesc.png"
                  alt=""
                  @click="editCategory(item, categoryIndex)"
                >
              </div>
              <div
                class="deleteText"
                @click="deleteCategory(item.id)"
              >
                <img
                  src="~@/assets/img/specialTopicImg/deleteCategory.png"
                  alt=""
                >
                删除类目
              </div>
            </div>
            <div class="centerForm">
              <div
                v-for="(item2, questionIndex) in item.questionEntityList"
                :key="questionIndex"
                class="questionSlide"
              >
                <div
                  v-if="item2.topicName === '单选题'"
                  class="questionBar"
                  @click="enterQuestionDetail(1, item2.id)"
                >
                  <div class="questionIndex">
                    {{ questionIndex + 1 }}
                  </div>
                  <div class="radioWrapper">
                    <div
                      class="questionTitle"
                    >
                      <span
                        v-if="item2.isAnswer === '1'"
                        style="color: red;"
                      >
                        *
                      </span>{{ item2.title }}
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
                        @change="
                          val => {
                            changeState1(val, item2);
                          }
                        "
                      >
                        是否列为列表显示字段
                      </el-checkbox>
                      <el-checkbox
                        :checked="item2.isSearch === '1'"
                        @change="
                          val => {
                            changeState2(val, item2);
                          }
                        "
                      >
                        是否列为默认检索字段
                      </el-checkbox>

                      <el-checkbox
                        :checked="item2.isCount === '1'"
                        @change="
                          val => {
                            changeState3(val, item2);
                          }
                        "
                      >
                        是否列为统计字段
                      </el-checkbox>
                    </div>
                  </div>
                  <img
                    v-show="item2.id == trueQuestionId"
                    src="~@/assets/img/specialTopicImg/deleteQuestion.png"
                    alt=""
                    class="deleteQuestionIcon"
                    @click="deleteQuestion(item2.id)"
                  >
                </div>
                <div
                  v-else-if="item2.topicName === '多选题'"
                  class="questionBar"
                  @click="enterQuestionDetail(2, item2.id)"
                >
                  <div class="questionIndex">
                    {{ questionIndex + 1 }}
                  </div>
                  <div
                    class="checkboxWrapper"
                  >
                    <div
                      class="questionTitle"
                    >
                      <span
                        v-if="item2.isAnswer === '1'"
                        style="color: red;"
                      >*
                      </span>{{ item2.title }}
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
                        @change="
                          val => {
                            changeState1(val, item2);
                          }"
                      >
                        是否列为列表显示字段
                      </el-checkbox>

                      <el-checkbox
                        :checked="item2.isSearch === '1'"
                        @change="
                          val => {
                            changeState2(val, item2);
                          }
                        "
                      >
                        是否列为默认检索字段
                      </el-checkbox>

                      <el-checkbox
                        :checked="item2.isCount === '1'"
                        @change="
                          val => {
                            changeState3(val, item2);
                          }
                        "
                      >
                        是否列为统计字段
                      </el-checkbox>
                    </div>
                  </div>
                  <img
                    v-show="item2.id == trueQuestionId"
                    src="~@/assets/img/specialTopicImg/deleteQuestion.png"
                    alt=""
                    class="deleteQuestionIcon"
                    @click="deleteQuestion(item2.id)"
                  >
                </div>
                <div
                  v-else-if="item2.topicName === '简答-输入'"
                  class="questionBar"
                  @click="enterQuestionDetail(3, item2.id)"
                >
                  <div class="questionIndex">
                    {{ questionIndex + 1 }}
                  </div>
                  <div
                    class="singleQuestionWrapper"
                  >
                    <div
                      class="questionTitle"
                    >
                      <span
                        v-if="item2.isAnswer === '1'"
                        style="color: red;"
                      >
                        *
                      </span>{{ item2.title }}
                    </div>
                    <input
                      type="text"
                      value=""
                      :placeholder="item2.remark"
                    >
                    <div class="expandContainer">
                      <el-checkbox
                        :checked="item2.isView === '1'"
                        @change="
                          val => {
                            changeState1(val, item2);
                          }
                        "
                      >
                        是否列为列表显示字段
                      </el-checkbox>
                      <el-checkbox
                        :checked="item2.isSearch === '1'"
                        @change="
                          val => {
                            changeState2(val, item2);
                          }
                        "
                      >
                        是否列为默认检索字段
                      </el-checkbox>
                      <el-checkbox
                        :checked="item2.isCount === '1'"
                        @change="
                          val => {
                            changeState3(val, item2);
                          }
                        "
                      >
                        是否列为统计字段
                      </el-checkbox>
                    </div>
                  </div>
                  <img
                    v-show="item2.id == trueQuestionId"
                    src="~@/assets/img/specialTopicImg/deleteQuestion.png"
                    alt=""
                    class="deleteQuestionIcon"
                    @click="deleteQuestion(item2.id)"
                  >
                </div>
                <div
                  v-else-if="item2.topicName === '简答-文本'"
                  class="questionBar"
                  @click="enterQuestionDetail(4, item2.id)"
                >
                  <div class="questionIndex">
                    {{ questionIndex + 1 }}
                  </div>
                  <div
                    class="manyQuestionWrapper"
                  >
                    <div
                      class="questionTitle"
                    >
                      <span
                        v-if="item2.isAnswer === '1'"
                        style="color: red;"
                      >
                        *
                      </span>{{ item2.title }}
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
                        @change="
                          val => {
                            changeState1(val, item2);
                          }
                        "
                      >
                        是否列为列表显示字段
                      </el-checkbox>
                      <el-checkbox
                        :checked="item2.isSearch === '1'"
                        @change="
                          val => {
                            changeState2(val, item2);
                          }
                        "
                      >
                        是否列为默认检索字段
                      </el-checkbox>
                      <el-checkbox
                        :checked="item2.isCount === '1'"
                        @change="
                          val => {
                            changeState3(val, item2);
                          }
                        "
                      >
                        是否列为统计字段
                      </el-checkbox>
                    </div>
                  </div>
                  <img
                    v-show="item2.id == trueQuestionId"
                    src="~@/assets/img/specialTopicImg/deleteQuestion.png"
                    alt=""
                    class="deleteQuestionIcon"
                    @click="deleteQuestion(item2.id)"
                  >
                </div>
                <div
                  v-else-if="item2.topicName === '说明'"
                  class="questionBar"
                  @click="enterQuestionDetail(5, item2.id)"
                >
                  <div class="questionIndex">
                    {{ questionIndex + 1 }}
                  </div>
                  <div
                    class="addressWrapper"
                  >
                    <div
                      class="questionTitle"
                    >
                      <span
                        v-if="item2.isAnswer === '1'"
                        style="color: red;"
                      >
                        *
                      </span>{{ item2.title }}
                    </div>
                    <input
                      type="text"
                      value=""
                      placeholder="请填写详细地址"
                    >
                    <div class="expandContainer">
                      <el-checkbox
                        :checked="item2.isView === '1'"
                        @change="
                          val => {
                            changeState1(val, item2);
                          }
                        "
                      >
                        是否列为列表显示字段
                      </el-checkbox>
                      <el-checkbox
                        :checked="item2.isSearch === '1'"
                        @change="
                          val => {
                            changeState2(val, item2);
                          }
                        "
                      >
                        是否列为默认检索字段
                      </el-checkbox>
                      <el-checkbox
                        :checked="item2.isCount === '1'"
                        @change="
                          val => {
                            changeState3(val, item2);
                          }
                        "
                      >
                        是否列为统计字段
                      </el-checkbox>
                    </div>
                  </div>
                  <img
                    v-show="item2.id == trueQuestionId"
                    src="~@/assets/img/specialTopicImg/deleteQuestion.png"
                    alt=""
                    class="deleteQuestionIcon"
                    @click="deleteQuestion(item2.id)"
                  >
                </div>
                <div
                  v-else-if="item2.topicName === '地址'"
                  class="questionBar"
                  @click="enterQuestionDetail(6, item2.id)"
                >
                  <div class="questionIndex">
                    {{ questionIndex + 1 }}
                  </div>
                  <div
                    class="locationWrapper"
                  >
                    <div
                      class="questionTitle"
                    >
                      <span
                        v-if="item2.isAnswer === '1'"
                        style="color: red;"
                      >
                        *
                      </span>{{ item2.title }}
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
                        @change="
                          val => {
                            changeState1(val, item2);
                          }
                        "
                      >
                        是否列为列表显示字段
                      </el-checkbox>
                      <el-checkbox
                        :checked="item2.isSearch === '1'"
                        @change="
                          val => {
                            changeState2(val, item2);
                          }
                        "
                      >
                        是否列为默认检索字段
                      </el-checkbox>
                      <el-checkbox
                        :checked="item2.isCount === '1'"
                        @change="
                          val => {
                            changeState3(val, item2);
                          }
                        "
                      >
                        是否列为统计字段
                      </el-checkbox>
                    </div>
                  </div>
                  <img
                    v-show="item2.id == trueQuestionId"
                    src="~@/assets/img/specialTopicImg/deleteQuestion.png"
                    alt=""
                    class="deleteQuestionIcon"
                    @click="deleteQuestion(item2.id)"
                  >
                </div>
                <div
                  v-else-if="item2.topicName === '图片'"
                  class="questionBar"
                  @click="enterQuestionDetail(7, item2.id)"
                >
                  <div class="questionIndex">
                    {{ questionIndex + 1 }}
                  </div>
                  <div
                    class="appendixWrapper"
                  >
                    <div
                      class="questionTitle"
                    >
                      <span
                        v-if="item2.isAnswer === '1'"
                        style="color: red;"
                      >
                        *
                      </span>{{ item2.title }}
                    </div>
                    <el-upload
                      class="upload-demo"
                      action=""
                      multiple
                      :file-list="fileList"
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
                    <!-- <div class="expandContainer">
                      <el-checkbox
                        @change="
                          val => {
                            changeState1(val, item2);
                          }
                        "
                        :checked="item2.isView == '1'"
                        >是否列为列表显示字段</el-checkbox
                      >

                      <el-checkbox
                        @change="
                          val => {
                            changeState2(val, item2);
                          }
                        "
                        :checked="item2.isSearch == '1'"
                        >是否列为默认检索字段</el-checkbox
                      >

                      <el-checkbox
                        @change="
                          val => {
                            changeState3(val, item2);
                          }
                        "
                        :checked="item2.isCount == '1'"
                        >是否列为统计字段</el-checkbox
                      >
                    </div> -->
                  </div>
                  <img
                    v-show="item2.id == trueQuestionId"
                    src="~@/assets/img/specialTopicImg/deleteQuestion.png"
                    alt=""
                    class="deleteQuestionIcon"
                    @click="deleteQuestion(item2.id)"
                  >
                </div>
              </div>
            </div>
          </div>
          <!-- 保存取消按钮 -->
          <div class="buttonContainer">
            <div
              class="cancelButton"
              @click="returnTemplate"
            >
              返回
            </div>
            <div
              class="saveButton"
              @click="updateTemplate"
            >
              保存
            </div>
          </div>
        </div>
        <!-- 右侧点击选项展示部分,根据选项不同展示不同的部分 -->
        <template v-if="mark === 1">
          <!--单选项-->
          <div
            v-if="questionId === 1"
            class="right"
          >
            <div class="rightHeader">
              <div class="bar" />
              <div class="rightTitle">
                单选框
              </div>
            </div>
            <div class="inputContainer">
              <div class="inputTitle">
                标题&nbsp;&nbsp;
                <span
                  style="font-size: 17px;font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: #999999;"
                >
                  最多20字
                </span>
              </div>
              <input
                v-model="radioTitile"
                type="text"
                value=""
                placeholder="请输入标题名称"
              >
            </div>
            <div class="itemTitle">
              选项
            </div>
            <div class="inputSlideContainer">
              <div
                v-for="(item, index) in selectList"
                :key="index"
                class="inputSlide"
              >
                <img
                  src="~@/assets/img/specialTopicImg/drag.png"
                  alt=""
                >
                <input
                  v-model="item.content"
                  type="text"
                  value=""
                >
                <img
                  class="deleteIcon"
                  src="~@/assets/img/specialTopicImg/deleteItem.png"
                  alt=""
                  @click="deleteRadioContent(index)"
                >
              </div>
            </div>
            <div class="addItemContainer">
              <div
                class="addItemTitle"
                @click="addRadioContent"
              >
                + 添加选项
              </div>
              <div class="requireTitle">
                必填
              </div>
              <div style="margin-top: 10px;margin-left: 14px;">
                <input
                  id="male"
                  v-model="onOrOff"
                  type="checkbox"
                  class="checkBoxButton"
                  name="sex"
                >
                <label
                  for="male"
                  class="buttonLabel"
                />
              </div>
            </div>
            <div
              class="addButton"
              @click="confirmAdd(1)"
            >
              添加
            </div>
          </div>
          <!-- 多选项 -->
          <div
            v-else-if="questionId === 2"
            class="right2"
          >
            <div class="rightHeader">
              <div class="bar" />
              <div class="rightTitle">
                多选项
              </div>
            </div>
            <div class="inputContainer">
              <div class="inputTitle">
                标题&nbsp;&nbsp;
                <span
                  style="font-size: 17px;font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;color: #999999;"
                >
                  最多20字
                </span>
              </div>
              <input
                v-model="checkBoxTitle"
                type="text"
                value=""
                placeholder="请输入标题名称"
              >
            </div>
            <div class="itemTitle">
              选项
            </div>
            <div class="inputSlideContainer">
              <div
                v-for="(item, index) in manySelectList"
                :key="index"
                class="inputSlide"
              >
                <img
                  src="~@/assets/img/specialTopicImg/drag.png"
                  alt=""
                >
                <input
                  v-model="item.content"
                  type="text"
                  value=""
                >
                <img
                  class="deleteIcon"
                  src="~@/assets/img/specialTopicImg/deleteItem.png"
                  alt=""
                  @click="deleteCheckboxContent(index)"
                >
              </div>
            </div>
            <div class="addItemContainer">
              <!-- <div class="addItemHeader">添加补充选项</div> -->
              <div
                class="addItemTitle"
                @click="addCheckboxContent"
              >
                + 添加选项
              </div>
              <div class="requireTitle">
                必填
              </div>
              <div style="margin-top: 10px;">
                <input
                  id="male"
                  v-model="onOrOff2"
                  type="checkbox"
                  class="checkBoxButton"
                  name="sex"
                >
                <label
                  for="male"
                  class="buttonLabel"
                />
              </div>
            </div>
            <div
              class="addButton"
              @click="confirmAdd(2)"
            >
              添加
            </div>
          </div>
          <!-- 问答题（单行) -->
          <div
            v-else-if="questionId === 3"
            class="right3"
          >
            <div class="rightHeader">
              <div class="bar" />
              <div class="rightTitle">
                单行输入框
              </div>
            </div>
            <div class="inputContainer">
              <div class="inputTitle">
                标题&nbsp;&nbsp;
                <span
                  style="font-size: 17px;font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;color: #999999;"
                >
                  最多20字
                </span>
              </div>
              <input
                v-model="singleAnswerTitle"
                type="text"
                value=""
              >
            </div>
            <div class="inputContainer">
              <div class="inputTitle">
                提示文字&nbsp;&nbsp;
                <span
                  style="font-size: 17px;font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;color: #999999;"
                >
                  最多30字
                </span>
              </div>
              <input
                v-model="singleAnswerTitlePlaceholder"
                type="text"
                value=""
              >
            </div>
            <div class="addItemContainer">
              <!-- <div class="addItemHeader">添加补充选项</div> -->
              <!-- <div class="addItemTitle">添加选项</div> -->
              <div class="requireTitle">
                必填
              </div>
              <div style="margin-top: 10px;">
                <input
                  id="male"
                  v-model="onOrOff3"
                  type="checkbox"
                  class="checkBoxButton"
                  name="sex"
                >
                <label
                  for="male"
                  class="buttonLabel"
                />
              </div>
            </div>
            <div
              class="addButton"
              @click="confirmAdd(3)"
            >
              添加
            </div>
          </div>
          <!-- 问答题 （多行） -->
          <div
            v-else-if="questionId === 4"
            class="right4"
          >
            <div class="rightHeader">
              <div class="bar" />
              <div class="rightTitle">
                问答题（多行）
              </div>
            </div>
            <div class="inputContainer">
              <div class="inputTitle">
                标题&nbsp;&nbsp;
                <span
                  style="font-size: 17px;font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;color: #999999;"
                >
                  最多20字
                </span>
              </div>
              <input
                v-model="manyAnswerTitle"
                type="text"
                value=""
              >
            </div>
            <div class="inputContainer">
              <div class="inputTitle">
                提示文字&nbsp;&nbsp;
                <span
                  style="font-size: 17px;font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;color: #999999;"
                >
                  最多30字
                </span>
              </div>
              <input
                v-model="manyAnswerTitlePlaceholder"
                type="text"
                value=""
              >
            </div>
            <div class="addItemContainer">
              <!-- <div class="addItemHeader">添加补充选项</div> -->
              <!-- <div class="addItemTitle">添加选项</div> -->
              <div class="requireTitle">
                必填
              </div>
              <div style="margin-top: 10px;">
                <input
                  id="male"
                  v-model="onOrOff4"
                  type="checkbox"
                  class="checkBoxButton"
                  name="sex"
                >
                <label
                  for="male"
                  class="buttonLabel"
                />
              </div>
            </div>
            <div
              class="addButton"
              @click="confirmAdd(4)"
            >
              添加
            </div>
          </div>
          <!-- 地址 -->
          <div
            v-else-if="questionId === 5"
            class="right5"
          >
            <div class="rightHeader">
              <div class="bar" />
              <div class="rightTitle">
                地址
              </div>
            </div>
            <div class="inputContainer">
              <div class="inputTitle">
                标题&nbsp;&nbsp;
                <span
                  style="font-size: 17px;font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;color: #999999;"
                >
                  最多20字
                </span>
              </div>
              <input
                v-model="addressTitle"
                type="text"
                value=""
                placeholder="请输入标题名称"
              >
            </div>
            <div class="inputSlideContainer" />
            <div class="addItemContainer">
              <!-- <div class="addItemHeader">添加补充选项</div> -->
              <!-- <div class="addItemTitle">添加选项</div> -->
              <div class="requireTitle">
                必填
              </div>
              <div style="margin-top: 10px;">
                <input
                  id="male"
                  v-model="onOrOff5"
                  type="checkbox"
                  class="checkBoxButton"
                  name="sex"
                >
                <label
                  for="male"
                  class="buttonLabel"
                />
              </div>
            </div>
            <div
              class="addButton"
              @click="confirmAdd(5)"
            >
              添加
            </div>
          </div>
          <!-- 定位 -->
          <div
            v-else-if="questionId === 6"
            class="right6"
          >
            <div class="rightHeader">
              <div class="bar" />
              <div class="rightTitle">
                定位
              </div>
            </div>
            <div class="inputContainer">
              <div class="inputTitle">
                标题&nbsp;&nbsp;
                <span
                  style="font-size: 17px;font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;color: #999999;"
                >
                  最多20字
                </span>
              </div>
              <input
                v-model="locationTitle"
                type="text"
                value=""
                placeholder="请输入标题名称"
              >
            </div>
            <div class="inputSlideContainer" />
            <div class="addItemContainer">
              <!-- <div class="addItemHeader">添加补充选项</div> -->
              <!-- <div class="addItemTitle">添加选项</div> -->
              <div class="requireTitle">
                必填
              </div>
              <div style="margin-top: 10px;">
                <input
                  id="male"
                  v-model="onOrOff6"
                  type="checkbox"
                  class="checkBoxButton"
                  name="sex"
                >
                <label
                  for="male"
                  class="buttonLabel"
                />
              </div>
            </div>
            <div
              class="addButton"
              @click="confirmAdd(6)"
            >
              添加
            </div>
          </div>
          <!-- 附件 -->
          <div
            v-else-if="questionId === 7"
            class="right7"
          >
            <div class="rightHeader">
              <div class="bar" />
              <div class="rightTitle">
                附件
              </div>
            </div>
            <div class="inputContainer">
              <div class="inputTitle">
                标题&nbsp;&nbsp;
                <span
                  style="font-size: 17px;font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;color: #999999;"
                >
                  最多20字
                </span>
              </div>
              <input
                v-model="appendixTitle"
                type="text"
                value=""
                placeholder="请输入标题名称"
              >
            </div>
            <div
              class="inputSlideContainer"
            />
            <div class="addItemContainer">
              <!-- <div class="addItemHeader">添加补充选项</div> -->
              <!-- <div class="addItemTitle">添加选项</div> -->
              <div class="requireTitle">
                必填
              </div>
              <div style="margin-top: 10px;">
                <input
                  id="male"
                  v-model="onOrOff7"
                  type="checkbox"
                  class="checkBoxButton"
                  name="sex"
                >
                <label
                  for="male"
                  class="buttonLabel"
                />
              </div>
            </div>
            <div
              class="addButton"
              @click="confirmAdd(7)"
            >
              添加
            </div>
          </div>
        </template>
        <!-- 编辑部分 -->
        <template v-if="mark === 2">
          <!--单选项-->
          <div
            v-if="questionId === 1"
            class="right"
          >
            <div class="rightHeader">
              <div
                class="bar"
              />
              <div class="rightTitle">
                单选框
              </div>
            </div>
            <div class="inputContainer">
              <div class="inputTitle">
                标题&nbsp;&nbsp;
                <span
                  style="font-size: 17px;font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;color: #999999;"
                >
                  最多20字
                </span>
              </div>
              <input
                v-model="trueQuestionObj.title"
                type="text"
                value=""
                placeholder="请输入标题名称"
              >
            </div>
            <div class="itemTitle">
              选项
            </div>
            <div class="inputSlideContainer">
              <div
                v-for="(item, index) in trueQuestionObj.fkSelectList"
                :key="index"
                class="inputSlide"
              >
                <img
                  src="~@/assets/img/specialTopicImg/drag.png"
                  alt=""
                >
                <input
                  v-model="item.content"
                  type="text"
                  value=""
                >
                <img
                  src="~@/assets/img/specialTopicImg/deleteItem.png"
                  class="deleteIcon"
                  alt=""
                  @click="deleteEditRadioContent(index)"
                >
              </div>
            </div>
            <div class="addItemContainer">
              <!-- <div class="addItemHeader" >添加补充选项</div> -->
              <div
                class="addItemTitle"
                @click="addEditRadioContent"
              >
                + 添加选项
              </div>
              <div class="requireTitle">
                必填
              </div>
              <div style="margin-top: 10px;margin-left: 14px;">
                <input
                  id="male"
                  v-model="onOrOff"
                  type="checkbox"
                  class="checkBoxButton"
                  name="sex"
                >
                <label
                  for="male"
                  class="buttonLabel"
                />
              </div>
            </div>
            <div
              class="addButton"
              @click="confirmEdit(1)"
            >
              编辑
            </div>
          </div>
          <!-- 多选项 -->
          <div
            v-else-if="questionId === 2"
            class="right2"
          >
            <div class="rightHeader">
              <div class="bar" />
              <div class="rightTitle">
                多选框
              </div>
            </div>
            <div class="inputContainer">
              <div class="inputTitle">
                标题&nbsp;&nbsp;
                <span
                  style="font-size: 17px;font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;color: #999999;"
                >
                  最多20字
                </span>
              </div>
              <input
                v-model="trueQuestionObj.title"
                type="text"
                value=""
                placeholder="请输入标题名称"
              >
            </div>
            <div class="itemTitle">
              选项
            </div>
            <div class="inputSlideContainer">
              <div
                v-for="(item, index) in trueQuestionObj.fkSelectList"
                :key="index"
                class="inputSlide"
              >
                <img
                  src="~@/assets/img/specialTopicImg/drag.png"
                  alt=""
                >
                <input
                  v-model="item.content"
                  type="text"
                >
                <img
                  class="deleteIcon"
                  src="~@/assets/img/specialTopicImg/deleteItem.png"
                  alt=""
                  @click="deleteEditCheckboxContent(index)"
                >
              </div>
            </div>
            <div class="addItemContainer">
              <!-- <div class="addItemHeader">添加补充选项</div> -->
              <div
                class="addItemTitle"
                @click="addEditCheckboxContent"
              >
                + 添加选项
              </div>
              <div class="requireTitle">
                必填
              </div>
              <div style="margin-top: 10px;">
                <input
                  id="male"
                  v-model="onOrOff2"
                  type="checkbox"
                  class="checkBoxButton"
                  name="sex"
                >
                <label
                  for="male"
                  class="buttonLabel"
                />
              </div>
            </div>
            <div
              class="addButton"
              @click="confirmEdit(2)"
            >
              编辑
            </div>
          </div>
          <!-- 问答题（单行) -->
          <div
            v-else-if="questionId === 3"
            class="right3"
          >
            <div class="rightHeader">
              <div class="bar" />
              <div class="rightTitle">
                单行输入框
              </div>
            </div>
            <div class="inputContainer">
              <div class="inputTitle">
                标题&nbsp;&nbsp;
                <span
                  style="font-size: 17px;font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;color: #999999;"
                >
                  最多20字
                </span>
              </div>
              <input
                v-model="trueQuestionObj.title"
                type="text"
                value=""
                placeholder="请输入标题名称"
              >
            </div>
            <div class="inputContainer">
              <div class="inputTitle">
                提示文字&nbsp;&nbsp;
                <span
                  style="font-size: 17px;font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;color: #999999;"
                >
                  最多30字
                </span>
              </div>
              <input
                v-model="trueQuestionObj.remark"
                type="text"
                value=""
              >
            </div>
            <div class="addItemContainer">
              <!-- <div class="addItemHeader">添加补充选项</div> -->
              <!-- <div class="addItemTitle">添加选项</div> -->
              <div class="requireTitle">
                必填
              </div>
              <div style="margin-top: 10px;">
                <input
                  id="male"
                  v-model="onOrOff3"
                  type="checkbox"
                  class="checkBoxButton"
                  name="sex"
                >
                <label
                  for="male"
                  class="buttonLabel"
                />
              </div>
            </div>
            <div
              class="addButton"
              @click="confirmEdit(3)"
            >
              编辑
            </div>
          </div>
          <!-- 问答题 （多行） -->
          <div
            v-else-if="questionId === 4"
            class="right4"
          >
            <div class="rightHeader">
              <div class="bar" />
              <div class="rightTitle">
                多行输入框
              </div>
            </div>
            <div class="inputContainer">
              <div class="inputTitle">
                标题&nbsp;&nbsp;
                <span
                  style="font-size: 17px;font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;color: #999999;"
                >
                  最多20字
                </span>
              </div>
              <input
                v-model="trueQuestionObj.title"
                type="text"
                value=""
                placeholder="请输入标题名称"
              >
            </div>
            <div class="inputContainer">
              <div class="inputTitle">
                提示文字&nbsp;&nbsp;
                <span
                  style="font-size: 17px;font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;color: #999999;"
                >
                  最多30字
                </span>
              </div>
              <input
                v-model="trueQuestionObj.remark"
                type="text"
                value=""
              >
            </div>
            <div class="addItemContainer">
              <!-- <div class="addItemHeader">添加补充选项</div> -->
              <!-- <div class="addItemTitle">添加选项</div> -->
              <div class="requireTitle">
                必填
              </div>
              <div style="margin-top: 10px;">
                <input
                  id="male"
                  v-model="onOrOff4"
                  type="checkbox"
                  class="checkBoxButton"
                  name="sex"
                >
                <label
                  for="male"
                  class="buttonLabel"
                />
              </div>
            </div>
            <div
              class="addButton"
              @click="confirmEdit(4)"
            >
              编辑
            </div>
          </div>
          <!-- 地址 -->
          <div
            v-else-if="questionId === 5"
            class="right5"
          >
            <div class="rightHeader">
              <div class="bar" />
              <div class="rightTitle">
                地址
              </div>
            </div>
            <div class="inputContainer">
              <div class="inputTitle">
                标题&nbsp;&nbsp;
                <span
                  style="font-size: 17px;font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;color: #999999;"
                >
                  最多20字
                </span>
              </div>
              <input
                v-model="trueQuestionObj.title"
                type="text"
                placeholder="请输入标题名称"
              >
            </div>
            <div class="inputSlideContainer" />
            <div class="addItemContainer">
              <!-- <div class="addItemHeader">添加补充选项</div> -->
              <!-- <div class="addItemTitle">添加选项</div> -->
              <div class="requireTitle">
                必填
              </div>
              <div style="margin-top: 10px;">
                <input
                  id="male"
                  v-model="onOrOff5"
                  type="checkbox"
                  class="checkBoxButton"
                  name="sex"
                >
                <label
                  for="male"
                  class="buttonLabel"
                />
              </div>
            </div>
            <div
              class="addButton"
              @click="confirmEdit(5)"
            >
              编辑
            </div>
          </div>
          <!-- 定位 -->
          <div
            v-else-if="questionId === 6"
            class="right6"
          >
            <div class="rightHeader">
              <div class="bar" />
              <div class="rightTitle">
                定位
              </div>
            </div>
            <div class="inputContainer">
              <div class="inputTitle">
                标题&nbsp;&nbsp;
                <span
                  style="font-size: 17px;font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;color: #999999;"
                >
                  最多20字
                </span>
              </div>
              <input
                v-model="trueQuestionObj.title"
                type="text"
                value=""
                placeholder="请输入标题名称"
              >
            </div>
            <div class="inputSlideContainer" />
            <div class="addItemContainer">
              <!-- <div class="addItemHeader">添加补充选项</div> -->
              <!-- <div class="addItemTitle">添加选项</div> -->
              <div class="requireTitle">
                必填
              </div>
              <div style="margin-top: 10px;">
                <input
                  id="male"
                  v-model="onOrOff6"
                  type="checkbox"
                  class="checkBoxButton"
                  name="sex"
                >
                <label
                  for="male"
                  class="buttonLabel"
                />
              </div>
            </div>
            <div
              class="addButton"
              @click="confirmEdit(6)"
            >
              编辑
            </div>
          </div>
          <!-- 附件 -->
          <div
            v-else-if="questionId === 7"
            class="right7"
          >
            <div class="rightHeader">
              <div class="bar" />
              <div class="rightTitle">
                附件
              </div>
            </div>
            <div class="inputContainer">
              <div class="inputTitle">
                标题&nbsp;&nbsp;
                <span
                  style="font-size: 17px;font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;color: #999999;"
                >
                  最多20字
                </span>
              </div>
              <input
                v-model="trueQuestionObj.title"
                type="text"
                value=""
                placeholder="请输入标题名称"
              >
            </div>
            <div class="inputSlideContainer" />
            <div class="addItemContainer">
              <!-- <div class="addItemHeader">添加补充选项</div> -->
              <!-- <div class="addItemTitle">添加选项</div> -->
              <div class="requireTitle">
                必填
              </div>
              <div style="margin-top: 10px;">
                <input
                  id="male"
                  v-model="onOrOff7"
                  type="checkbox"
                  class="checkBoxButton"
                  name="sex"
                >
                <label
                  for="male"
                  class="buttonLabel"
                />
              </div>
            </div>
            <div
              class="addButton"
              @click="confirmEdit(7)"
            >
              编辑
            </div>
          </div>
        </template>
      </div>
    </el-dialog>
    <!-- 添加类目的弹框 -->
    <addCategoryDialog
      ref="addCatDialog"
      @addCategory="addCategorys"
    />
    <!-- 返回的弹框 -->
    <ReturnDialog
      ref="returnDialog"
      @save="returnTop"
      @returnTableList="returnTableList"
    />
    <!-- 编辑类目的弹框 -->
    <editCategoryDialog
      ref="editCategoryDialog"
      @editCategorySubmit="editCategorySubmit"
    />
    <!-- 选择模板分组的弹框 -->
    <ChooseTemplateGroupDialog
      ref="chooseTemplateGroupDialog"
      @chooseTemplate="chooseTemplateGroup"
    />
  </div>
</template>
<script>
import editCategoryDialog from './editCategory.vue';

import ReturnDialog from './returnDialog.vue';

import addCategoryDialog from './addCategory.vue';

import ChooseTemplateGroupDialog from './ChooseTemplateGroupDialog.vue';

export default {
  name: 'editSpecialTopicDialog',
  components: {
    addCategoryDialog,
    ReturnDialog,
    editCategoryDialog,
    ChooseTemplateGroupDialog,
  },
  data() {
    return {
      // 当前被点击的类目
      catIndex: -1,
      itemIndex: 0,
      // 问答题单行标题提示语
      singleAnswerTitlePlaceholder: '',
      // 问答题多行标题提示语
      manyAnswerTitlePlaceholder: '',
      // 问题的id
      trueQuestionId: 0,
      // 临时存储问题的详细信息
      temQuestionObj: {},
      // 模板具体信息
      templateData: {},
      // 模板id
      templateId: 0,
      // 题型的标记，用来标识不同的题型
      questionId: 0,
      // 单选选项是否必填
      onOrOff: false,
      // 多选项是否必填
      onOrOff2: false,
      // 问答题单行
      onOrOff3: false,
      // 问答题多行
      onOrOff4: false,
      // 地址
      onOrOff5: false,
      // 定位
      onOrOff6: false,
      // 附件
      onOrOff7: false,
      // 控制编辑专题弹框的展示与关闭
      dialogVisible: false,
      // 判断是否已经添加类目
      isAddCategory: false,
      form: {
        // 模板名称
        name: '',
        // 题型描述
        desc: '',
      },
      // 单选的内容列表
      selectList: [{ content: '', remark: '' }],
      // 多选的内容列表
      manySelectList: [{ content: '', remark: '' }],
      // 单选列表
      radioTitile: '',
      // 题型顺序
      orderNum: 0,
      // 多选标题
      checkBoxTitle: '',
      // 问答题单行标题
      singleAnswerTitle: '',
      // 问答题多行标题
      manyAnswerTitle: '',
      // 地址标题
      addressTitle: '',
      // 定位标题
      locationTitle: '',
      // 附件标题
      appendixTitle: '',
      // 选择的模板分组
      templateGroupNode: { id: -1, name: '' },
      bottomForm: {
        name: '',
      },
      radio: '1',
      value: '',
      checkList: [],
      // 类目列表
      categoryList: [],
      // 标记是添加操作还是编辑操作，1是添加，2是编辑
      mark: 1,
      cataEntityList: [
        {
          name: '类目1',
          remark: '类目描述1',
          questionEntityList: [
            {
              title: '题目1',
              remark: '题目描述1',
              isAnswer: '1',
              orderNum: 1,
              isExplain: '0',
              isView: '0',
              isSearch: '0',
              isCount: '0',
              isChange: '0',
              imgRemark: '',
              topicName: '单选题',
              fkSelectList: [
                {
                  content: '1',
                  remark: '',
                },
              ],
            },
          ],
        },
      ],
    };
  },
  computed: {
    trueQuestionObj: {
      get() {
        return this.temQuestionObj;
      },
    },
  },
  watch: {
    categoryList: {
      handler(newVal, oldVal) {
        if (newVal.length !== 0) {
          this.isAddCategory = true;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    chooseCat(item, index) {
      this.catIndex = index;
      this.orderNum = item.questionEntityList[item.questionEntityList.length - 1].orderNum;
    },
    /**
     * @description: 编辑类目
     * @param {*}
     * @return {*}
     */
    editCategorySubmit(obj, index) {
      this.$http({
        url: this.$http.adornUrl('/fk/fkTemplateCata/update'),
        method: 'post',
        data: this.$http.adornData({
          ...obj,
        }),
      }).then(({ data }) => {
        // console.log('编辑类目返回的数据为', data);
        if (data.code === 0) {
          this.init(this.templateData);
          this.$refs.editCategoryDialog.dialogVisible = false;
        }
      });
    },
    /**
     * @description: 点击类目编辑按钮
     * @param {*} obj 当前点击的类目信息
     * @param {*} index 类目索引
     * @return {*}
     */
    editCategory(obj, index) {
      this.$refs.editCategoryDialog.init(obj, index);
    },
    returnTableList() {
      this.catIndex = -1;
      // console.log(this.catIndex, 'catIndex');
      this.dialogVisible = false;
      this.$emit('refreshTable');
    },
    returnTop() {
      this.catIndex = -1;
      this.dialogVisible = false;
      this.$emit('refreshTable');
    },
    returnTemplate() {
      this.$refs.returnDialog.init('ret');
    },
    changeState1(value, item2) {
      if (value) {
        // eslint-disable-next-line no-param-reassign
        item2.isView = '1';
      } else {
        // eslint-disable-next-line no-param-reassign
        item2.isView = '0';
      }
      this.$http({
        url: this.$http.adornUrl('/fk/fkQuestion/update'),
        method: 'post',
        data: this.$http.adornData({
          ...item2,
        }),
      }).then(({ data }) => {
        // console.log('更新后返回的数据为', data);
        if (data && data.code === 0) {
          this.$message('更新成功');
          this.init(this.templateData);
        }
      });
    },
    changeState2(value, item2) {
      if (value) {
        // eslint-disable-next-line no-param-reassign
        item2.isSearch = '1';
      } else {
        // eslint-disable-next-line no-param-reassign
        item2.isSearch = '0';
      }
      this.$http({
        url: this.$http.adornUrl('/fk/fkQuestion/update'),
        method: 'post',
        data: this.$http.adornData({
          ...item2,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message('更新成功');
          this.init(this.templateData);
        }
      });
    },
    changeState3(value, item2) {
      if (value) {
        // eslint-disable-next-line no-param-reassign
        item2.isCount = '1';
      } else {
        // eslint-disable-next-line no-param-reassign
        item2.isCount = '0';
      }
      this.$http({
        url: this.$http.adornUrl('/fk/fkQuestion/update'),
        method: 'post',
        data: this.$http.adornData({
          ...item2,
        }),
      }).then(({ data }) => {
        // console.log('更新后返回的数据为', data);
        if (data && data.code === 0) {
          this.$message('更新成功');
          this.init(this.templateData);
        }
      });
    },
    /**
     * @description: 初始化编辑弹框数据
     * @param {int} templateData: 模板的具体数据
     * @return {type} 无
     */
    init(templateData) {
      this.mark = 0;
      this.itemIndex = 0;
      this.templateData = templateData;
      this.templateId = templateData.id;
      const templateId = this.templateId;
      this.$http({
        url: this.$http.adornUrl(`/fk/fkTemplate/info?id=${templateId}`),
        method: 'get',
        params: this.$http.adornParams({}),
      }).then(({ data }) => {
        if (data.code === 0) {
          this.categoryList = data.data.cataEntityList;
          this.form.name = data.data.name;
          this.form.desc = data.data.remark;
          this.templateGroupNode.name = data.data.groupIdString;
          this.templateGroupNode.id = data.data.groupId;
        }
      });
    },
    // 确认添加类目
    addCategorys(form) {
      this.$http({
        url: this.$http.adornUrl('/fk/fkTemplateCata/save'),
        method: 'post',
        data: this.$http.adornData({
          name: form.categoryName,
          remark: form.categoryDesc,
          templateId: this.templateId,
        }),
      }).then(({ data }) => {
        console.log('添加类目后返回的数据为', data);
        if (data.code === 0) {
          this.$refs.addCatDialog.dialogVisible = false;
          this.init(this.templateData);
          this.orderNum = 0;
          this.isAddCategory = true;
        }
      });
    },
    // 点击选项添加相应的题型
    addQuestion(id) {
      this.mark = 1;
      this.questionId = id;
      this.itemIndex = id;
    },
    /**
     * @description: 选择某一项填写完整的题型然后添加题型
     * @param {int} id:题型id
     * @return {type} 无
     */
    confirmAdd(id) {
      if (this.isAddCategory) {
        let cataId;
        if (this.catIndex === -1) {
          this.$message.error('请先选择一个类目');
          return;
        } else {
          cataId = this.categoryList[this.catIndex].id;
        }
        // eslint-disable-next-line no-plusplus
        this.orderNum++;
        if (id === 1) {
          // 添加单选
          if (this.radioTitile && this.selectList.every((item) => item.content)) {
            const questionEntity = {
              title: this.radioTitile,
              remark: '',
              cataId,
              isAnswer: this.onOrOff ? '1' : '2',
              orderNum: this.orderNum,
              isExplain: '0',
              isView: '0',
              isSearch: '0',
              isCount: '0',
              isChange: '0',
              imgRemark: '',
              topicName: '单选题',
              fkSelectList: this.selectList,
            };
            this.$http({
              url: this.$http.adornUrl('/fk/fkQuestion/save'),
              method: 'post',
              data: this.$http.adornData({
                ...questionEntity,
              }),
            }).then(({ data }) => {
              if (data.code === 0) {
                this.$message('添加成功');
                this.radioTitile = '';
                this.onOrOff = false;
                this.selectList = [{ content: '', remark: '' }];
                this.init(this.templateData);
              }
            });
          } else {
            this.$message.error('标题或选项内容不能为空');
            return;
          }
        } else if (id === 2) {
          // 添加多选
          if (
            this.checkBoxTitle
            && this.manySelectList.every((item) => item.content)
          ) {
            const questionEntity = {
              title: this.checkBoxTitle,
              remark: '',
              cataId,
              isAnswer: this.onOrOff2 ? '1' : '2',
              orderNum: this.orderNum,
              isExplain: '0',
              isView: '0',
              isSearch: '0',
              isCount: '0',
              isChange: '0',
              imgRemark: '',
              topicName: '多选题',
              fkSelectList: this.manySelectList,
            };
            this.$http({
              url: this.$http.adornUrl('/fk/fkQuestion/save'),
              method: 'post',
              data: this.$http.adornData({
                ...questionEntity,
              }),
            }).then(({ data }) => {
              if (data.code === 0) {
                this.$message('添加成功');
                this.checkBoxTitle = '';
                this.onOrOff2 = false;
                this.manySelectList = [{ content: '', remark: '' }];
                this.init(this.templateData);
              }
            });
          } else {
            this.$message.error('标题或选项内容不能为空');
            return;
          }
        } else if (id === 3) {
          // 问答题单行
          if (this.singleAnswerTitle) {
            const questionEntity = {
              title: this.singleAnswerTitle,
              remark: this.singleAnswerTitlePlaceholder,
              cataId,
              isAnswer: this.onOrOff3 ? '1' : '2',
              orderNum: this.orderNum,
              isExplain: '0',
              isView: '0',
              isSearch: '0',
              isCount: '0',
              isChange: '0',
              imgRemark: '',
              topicName: '简答-输入',
              fkSelectList: [],
            };
            this.$http({
              url: this.$http.adornUrl('/fk/fkQuestion/save'),
              method: 'post',
              data: this.$http.adornData({
                ...questionEntity,
              }),
            }).then(({ data }) => {
              if (data.code === 0) {
                this.$message('添加成功');
                this.singleAnswerTitle = '';
                this.onOrOff3 = false;
                this.init(this.templateData);
              }
            });
          } else {
            this.$message.error('标题不能为空');
            return;
          }
        } else if (id === 4) {
          // 添加问答题多行
          if (this.manyAnswerTitle) {
            const questionEntity = {
              title: this.manyAnswerTitle,
              remark: this.manyAnswerTitlePlaceholder,
              cataId,
              isAnswer: this.onOrOff4 ? '1' : '2',
              orderNum: this.orderNum,
              isExplain: '0',
              isView: '0',
              isSearch: '0',
              isCount: '0',
              isChange: '0',
              imgRemark: '',
              topicName: '简答-文本',
              fkSelectList: [],
            };
            this.$http({
              url: this.$http.adornUrl('/fk/fkQuestion/save'),
              method: 'post',
              data: this.$http.adornData({
                ...questionEntity,
              }),
            }).then(({ data }) => {
              if (data.code === 0) {
                this.$message('添加成功');
                this.singleAnswerTitle = '';
                this.onOrOff4 = false;
                this.init(this.templateData);
              }
            });
          } else {
            this.$message.error('标题不能为空');
            return;
          }
        } else if (id === 5) {
          // 添加地址
          if (this.addressTitle) {
            const questionEntity = {
              title: this.addressTitle,
              remark: '',
              cataId,
              isAnswer: this.onOrOff5 ? '1' : '2',
              orderNum: this.orderNum,
              isExplain: '0',
              isView: '0',
              isSearch: '0',
              isCount: '0',
              isChange: '0',
              imgRemark: '',
              topicName: '说明',
              fkSelectList: [],
            };
            this.$http({
              url: this.$http.adornUrl('/fk/fkQuestion/save'),
              method: 'post',
              data: this.$http.adornData({
                ...questionEntity,
              }),
            }).then(({ data }) => {
              if (data.code === 0) {
                this.$message('添加成功');
                this.addressTitle = '';
                this.onOrOff5 = false;
                this.init(this.templateData);
              }
            });
          } else {
            this.$message.error('标题不能为空');
            return;
          }
        } else if (id === 6) {
          // 添加定位
          if (this.locationTitle) {
            const questionEntity = {
              title: this.locationTitle,
              remark: '',
              cataId,
              isAnswer: this.onOrOff6 ? '1' : '2',
              orderNum: this.orderNum,
              isExplain: '0',
              isView: '0',
              isSearch: '0',
              isCount: '0',
              isChange: '0',
              imgRemark: '',
              topicName: '地址',
              fkSelectList: [],
            };
            this.$http({
              url: this.$http.adornUrl('/fk/fkQuestion/save'),
              method: 'post',
              data: this.$http.adornData({
                ...questionEntity,
              }),
            }).then(({ data }) => {
              if (data.code === 0) {
                this.$message('添加成功');
                this.locationTitle = '';
                this.onOrOff6 = false;
                this.init(this.templateData);
              }
            });
          } else {
            this.$message.error('标题不能为空');
            return;
          }
        } else if (id === 7) {
          // 添加附件
          if (this.appendixTitle) {
            const questionEntity = {
              title: this.appendixTitle,
              remark: '',
              cataId,
              isAnswer: this.onOrOff7 ? '1' : '2',
              orderNum: this.orderNum,
              isExplain: '0',
              isView: '0',
              isSearch: '0',
              isCount: '0',
              isChange: '0',
              imgRemark: '',
              topicName: '图片',
              fkSelectList: [],
            };
            this.$http({
              url: this.$http.adornUrl('/fk/fkQuestion/save'),
              method: 'post',
              data: this.$http.adornData({
                ...questionEntity,
              }),
            }).then(({ data }) => {
              if (data.code === 0) {
                this.$message('添加成功');
                this.appendixTitle = '';
                this.onOrOff7 = false;
                this.init(this.templateData);
              }
            });
          } else {
            this.$message.error('标题不能为空');
            return;
          }
        }
      } else {
        this.$message.error('请先添加类目');
      }
    },
    /**
     * @description: 删除某个单选项的内容
     * @param {int} index:每个单选项内容的索引
     * @return {type} 无
     */
    deleteRadioContent(index) {
      this.selectList.splice(index, 1);
    },
    /**
     * @description: 删除某个多选项的内容
     * @param {int} index: 每个多选项内容的索引
     * @return {type} 无
     */
    deleteCheckboxContent(index) {
      this.manySelectList.splice(index, 1);
    },
    /**
     * @description: 添加单选项
     * @param {type} 无
     * @return {type} 无
     */
    addRadioContent() {
      const radioContent = { content: '', remark: '' };
      this.selectList.push(radioContent);
    },
    /**
     * @description: 添加多选项
     * @param {type} 无
     * @return {type} 无
     */
    addCheckboxContent() {
      const checkboxContent = { content: '', remark: '' };
      this.manySelectList.push(checkboxContent);
    },
    /**
     * @description: 删除类目
     * @param {int} categoryId:类目id
     * @return {type} 无
     */
    deleteCategory(categoryId) {
      this.$http({
        url: this.$http.adornUrl('/fk/fkTemplateCata/delete'),
        method: 'post',
        data: this.$http.adornData({
          id: categoryId.toString(),
        }),
      }).then(({ data }) => {
        console.log('删除类目返回的数据为', data);
        if (data.code === 0) {
          this.init(this.templateData);
        }
      });
    },
    /**
     * @description: 编辑专题模板
     * @param {type} params
     * @return {type}
     */
    updateTemplate() {
      this.$http({
        url: this.$http.adornUrl('/fk/fkTemplate/update'),
        method: 'post',
        data: this.$http.adornData({
          id: this.templateId,
          name: this.form.name,
          remark: this.form.desc,
          status: this.templateData.status,
          groupId: this.templateGroupNode.id
        }),
      }).then(({ data }) => {
        console.log('更新模板获得的数据为', data);
        if (data.code === 0) {
          this.$message('更新成功');
          this.$refs.returnDialog.init('sav');
        }
      });
    },
    // 打开添加类目的弹框
    openAddCategoryDialog() {
      this.$refs.addCatDialog.dialogVisible = true;
    },
    /**
     * @description: 点击某个问题进行编辑操作
     * @param {int,int} questionId:问题的标识,trueQuestionId：问题的id
     * @return {type}
     */
    enterQuestionDetail(questionId, trueQuestionId) {
      this.itemIndex = 0;
      this.questionId = questionId;
      this.trueQuestionId = trueQuestionId;
      this.mark = 2;
      this.$http({
        url: this.$http.adornUrl(`/fk/fkQuestion/info?id=${trueQuestionId}`),
        method: 'get',
        params: this.$http.adornParams({}),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.temQuestionObj = data.data;
        }
      });
    },
    /**
     * @description: 编辑删除单选项的内容
     * @param {int} index:单选项的索引
     * @return {type}
     */
    deleteEditRadioContent(index) {
      this.trueQuestionObj.fkSelectList.splice(index, 1);
    },
    /**
     * @description: 编辑删除多选项的内容
     * @param {int} index: 多选项的索引
     * @return {type}
     */
    deleteEditCheckboxContent(index) {
      this.trueQuestionObj.fkSelectList.splice(index, 1);
    },
    /**
     * @description: 编辑确认
     * @param {type} params
     * @return {type}
     */
    confirmEdit(questionId) {
      const questionIsRequired = {
        1: this.onOrOff ? '1' : '2',
        2: this.onOrOff2 ? '1' : '2',
        3: this.onOrOff3 ? '1' : '2',
        4: this.onOrOff4 ? '1' : '2',
        5: this.onOrOff5 ? '1' : '2',
        6: this.onOrOff6 ? '1' : '2',
        7: this.onOrOff7 ? '1' : '2',
      };
      this.trueQuestionObj.isAnswer = questionIsRequired[questionId];
      this.$http({
        url: this.$http.adornUrl('/fk/fkQuestion/update'),
        method: 'post',
        data: this.$http.adornData({
          ...this.trueQuestionObj,
        }),
      }).then(({ data }) => {
        console.log('更新后返回的数据为', data);
        if (data && data.code === 0) {
          this.$message('更新成功');
          this.init(this.templateData);
          this.catIndex = -1;
        }
      });
    },
    /**
     * @description: 编辑添加单选项
     * @param {type} 无
     * @return {type} 无
     */
    addEditRadioContent() {
      const singleSelect = {
        content: '',
      };
      this.trueQuestionObj.fkSelectList.push(singleSelect);
    },
    /**
     * @description: 编辑添加多选项
     * @param {type} 无
     * @return {type}
     */
    addEditCheckboxContent() {
      const manySelect = {
        content: '',
      };
      this.trueQuestionObj.fkSelectList.push(manySelect);
    },
    /**
     * @description: 删除问题
     * @param {int} questionId: 问题id
     * @return {type}
     */
    deleteQuestion(questionId) {
      this.$http({
        url: this.$http.adornUrl('/fk/fkQuestion/delete'),
        method: 'post',
        data: this.$http.adornData({
          id: questionId,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message('删除成功');
          this.mark = 0;
          this.init(this.templateData);
        }
      });
    },
    /**
     * @description: 打开模板分组弹框
     * @param {type} 无
     * @return {type} 无
     */
    openTemplateGroupDialog() {
      this.$refs.chooseTemplateGroupDialog.init();
      this.$refs.chooseTemplateGroupDialog.dialogVisible = true;
    },
    /**
     * @description: 选择模板分组节点
     * @param {object} node:模板分组的节点数据
     * @return {type} 无
     */
    chooseTemplateGroup(node) {
      this.templateGroupNode.id = node.id;
      this.templateGroupNode.name = node.name;
      this.$refs.chooseTemplateGroupDialog.dialogVisible = false;
    },
  },
};
</script>
<style lang="less" scoped>
.addSpecialTopicDialog {
  .el-dialog {
    .dialogWrapper {
      display: flex;
      .left {
        flex-shrink: 0;
        width: 218px;
        box-sizing: border-box;
        padding: 0 14.6px;
        //外观
        //   .leftTitle {
        //     text-align: center;
        //     border-bottom: 1px dashed transparent;
        //   }

        .mainContent {
          margin-top: 20px;
          //外观
          .mainButton {
            margin: 0 auto;
            text-align: center;
            font-size: 17px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #0091ff;
            line-height: 24px;
            margin-bottom: 14.06px;
          }
          //盒子模型
          .itemWrapper {
            margin-bottom: 14px;
            display: flex;
            width: 190px;
            height: 42px;
            background: #ffffff;
            border-radius: 4px;
            border: 1px solid #e4e4e4;
            font-size: 17px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            align-items: center;
            box-sizing: border-box;
            padding-left: 11.24px;
            &.itemActive {
              color: #0091ff;
              box-shadow: 0px 6px 7px 3px rgba(213, 227, 240, 0.29);
              border-radius: 4px;
              border: 1px solid #0091ff;
              font-size: 17px;
            }
            img {
              width: 21px;
              height: 21px;
            }
            .itemTitle {
              margin-left: 8.43px;
            }
          }
        }
      }

      .center {
        flex-shrink: 0;
        width: 900px;
        border-left: 1px solid #f2f2f2;
        .topForm {
          border-bottom: 1px solid #f2f2f2;
          .el-form {
            /deep/ .el-form-item__label {
              font-size: 17px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #555555;
              padding: 0;
            }
            .formItem {
              .formInput {
                /deep/ .el-input__inner {
                  width: 461px;
                  height: 42px;
                  background: #ffffff;
                  border-radius: 4px;
                  border: 1px solid rgba(221, 221, 221, 0.82);
                  margin-left: 15px;
                }
              }
            }
            .formItem {
              .inputContainer {
                position: relative;
                width: 461px;
                img {
                  width: 43px;
                  height: 33px;
                  position: absolute;
                  top: 5px;
                  right: 0;
                }
                .inputStyle {
                  width: 461px;
                  height: 42px;
                  background: #ffffff;
                  border-radius: 4px;
                  border: 1px solid rgba(221, 221, 221, 0.82);
                  margin-left: 15px;
                }
              }
            }
            .formItem {
              .textareaStyle {
                margin-left: 15px;
                /deep/ .el-textarea__inner {
                  width: 461px;
                  height: 84px;
                  background: #ffffff;
                  border-radius: 4px;
                  border: 1px solid rgba(221, 221, 221, 0.82);
                }
              }
            }
          }
        }
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
                      margin-left: 8px;
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
                      margin-left: 8px;
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
                      margin-left: 8px;
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
                      margin-left: 8px;
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
                      margin-left: 8px;
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
                      margin-left: 8px;
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
                      margin-left: 8px;
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
                      margin-left: 8px;
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

      .right {
        flex-shrink: 0;
        width: 365px;
        margin-left: 17px;
        .rightHeader {
          display: flex;
          align-items: center;
          margin-top: 14px;
          .bar {
            width: 3px;
            height: 18px;
            background: #0091ff;
            margin-left: 14px;
          }
          .rightTitle {
            margin-left: 14px;
            font-size: 20px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
          }
        }

        .inputContainer {
          .inputTitle {
            display: flex;
            align-items: center;
            font-size: 17px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #555555;
            margin-top: 28px;
            margin-left: 14px;
          }

          input {
            margin: 14px;
            width: 339px;
            height: 42px;
            background: #ffffff;
            border-radius: 4px;
            border: 1px solid rgba(221, 221, 221, 0.82);
            outline: none;
          }
        }
        .itemTitle {
          font-size: 17px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #555555;
          margin-left: 14px;
          margin-top: 28px;
        }
        .inputSlideContainer {
          //定位
          .inputSlide {
            display: flex;
            align-items: center;
            margin-top: 14px;
            margin-left: 14px;
            img {
              width: 14px;
              height: 20px;
              object-fit: cover;
            }
            input {
              // margin-top: 30px;
              margin-left: 10px;
              width: 285px;
              height: 42px;
              background: #ffffff;
              border-radius: 4px;
              border: 1px solid rgba(221, 221, 221, 0.82);
              margin-right: 8px;
            }
            .deleteIcon {
              width: 20px;
              height: 20px;
              object-fit: cover;
            }
          }
        }

        .addItemContainer {
          .addItemHeader {
          }

          .addItemTitle {
            margin-top: 15px;
            margin-left: 14px;
            font-size: 17px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #0091ff;
          }

          .requireTitle {
            margin-top: 17px;
            margin-left: 14px;
            font-size: 17px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #666666;
          }

          input#male.checkBoxButton {
            display: none;
          }
          input#male.checkBoxButton:checked + label.buttonLabel {
            background-color: #0091ff;
          }
          input#male.checkBoxButton:checked + label.buttonLabel:before {
            left: 20px;
          }
          //定位，外观
          label.buttonLabel {
            width: 40px;
            height: 20px;
            border-radius: 20px;
            background-color: #ccc;
            box-shadow: #ccc 0px 0px 0px 1px;
            display: inline-block;
            position: relative;
            //定位，外观
            &:before {
              content: "";
              width: 20px;
              height: 20px;
              border-radius: 20px;
              background-color: #fff;
              position: absolute;
              left: 0;
              top: 0;
              display: inline-block;
              z-index: 1;
              transition: all 0.5s;
            }
          }
        }
        .addButton {
          width: 73px;
          height: 42px;
          background: #0091ff;
          border-radius: 4px;
          font-size: 17px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
          margin-top: 8px;
          margin-left: 14px;
          text-align: center;
          line-height: 42px;
        }
      }
      .right2 {
        margin-left: 17px;
        padding-left: 14px;
        .rightHeader {
          display: flex;
          align-items: center;
          margin-top: 14px;
          .bar {
            width: 3px;
            height: 18px;
            background: #0091ff;
          }
          .rightTitle {
            margin-left: 14px;
            font-size: 20px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
          }
        }

        .inputContainer {
          .inputTitle {
            display: flex;
            align-items: center;
            font-size: 17px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #555555;
            margin-top: 28px;
          }

          input {
            margin: 14px 0;
            width: 339px;
            height: 42px;
            background: #ffffff;
            border-radius: 4px;
            border: 1px solid rgba(221, 221, 221, 0.82);
            outline: none;
          }
        }
        .itemTitle {
          font-size: 17px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #555555;
          margin-top: 28px;
        }
        .inputSlideContainer {
          //定位
          .inputSlide {
            display: flex;
            align-items: center;
            margin-top: 14px;
            img {
              width: 14px;
              height: 20px;
              object-fit: cover;
            }
            input {
              // margin-top: 30px;
              margin-left: 10px;
              width: 285px;
              height: 42px;
              background: #ffffff;
              border-radius: 4px;
              border: 1px solid rgba(221, 221, 221, 0.82);
              margin-right: 8px;
            }
            .deleteIcon {
              width: 20px;
              height: 20px;
              object-fit: cover;
            }
          }
        }

        .addItemContainer {
          .addItemHeader {
          }

          .addItemTitle {
            margin-top: 15px;
            font-size: 17px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #0091ff;
          }

          .requireTitle {
            margin-top: 17px;
            font-size: 17px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #666666;
          }

          input#male.checkBoxButton {
            display: none;
          }
          input#male.checkBoxButton:checked + label.buttonLabel {
            background-color: #0091ff;
          }
          input#male.checkBoxButton:checked + label.buttonLabel:before {
            left: 20px;
          }
          //外观，定位
          label.buttonLabel {
            width: 40px;
            height: 20px;
            border-radius: 20px;
            background-color: #ccc;
            box-shadow: #ccc 0px 0px 0px 1px;
            display: inline-block;
            position: relative;
            //外观，定位
            &:before {
              content: "";
              width: 20px;
              height: 20px;
              border-radius: 20px;
              background-color: #fff;
              position: absolute;
              left: 0;
              top: 0;
              display: inline-block;
              z-index: 1;
              transition: all 0.5s;
            }
          }
        }
        .addButton {
          width: 73px;
          height: 42px;
          background: #0091ff;
          border-radius: 4px;
          font-size: 17px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
          margin-top: 8px;
          text-align: center;
          line-height: 42px;
        }
      }
      .right3 {
        padding-left: 14px;
        margin-left: 17px;
        .rightHeader {
          display: flex;
          align-items: center;
          margin-top: 14px;
          .bar {
            width: 3px;
            height: 18px;
            background: #0091ff;
          }
          .rightTitle {
            margin-left: 14px;
            font-size: 20px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
          }
        }

        .inputContainer {
          .inputTitle {
            display: flex;
            align-items: center;
            font-size: 17px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #555555;
            margin-top: 28px;
          }

          input {
            margin: 14px 0px;
            width: 339px;
            height: 42px;
            background: #ffffff;
            border-radius: 4px;
            border: 1px solid rgba(221, 221, 221, 0.82);
            outline: none;
          }
        }

        .addItemContainer {
          .addItemHeader {
          }
          .requireTitle {
            margin-top: 17px;
            font-size: 17px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #666666;
          }

          input#male.checkBoxButton {
            display: none;
          }
          input#male.checkBoxButton:checked + label.buttonLabel {
            background-color: #0091ff;
          }
          input#male.checkBoxButton:checked + label.buttonLabel:before {
            left: 20px;
          }
          //定位，外观
          label.buttonLabel {
            width: 40px;
            height: 20px;
            border-radius: 20px;
            background-color: #ccc;
            box-shadow: #ccc 0px 0px 0px 1px;
            display: inline-block;
            position: relative;
            //定位，外观
            &:before {
              content: "";
              width: 20px;
              height: 20px;
              border-radius: 20px;
              background-color: #fff;
              position: absolute;
              left: 0;
              top: 0;
              display: inline-block;
              z-index: 1;
              transition: all 0.5s;
            }
          }
        }

        .addButton {
          width: 73px;
          height: 42px;
          background: #0091ff;
          border-radius: 4px;
          font-size: 17px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
          margin-top: 8px;
          text-align: center;
          line-height: 42px;
        }
      }

      .right4 {
        padding-left: 14px;
        margin-left: 17px;
        .rightHeader {
          display: flex;
          align-items: center;
          margin-top: 14px;
          .bar {
            width: 3px;
            height: 18px;
            background: #0091ff;
          }
          .rightTitle {
            margin-left: 14px;
            font-size: 20px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
          }
        }

        .inputContainer {
          .inputTitle {
            display: flex;
            align-items: center;
            font-size: 17px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #555555;
            margin-top: 28px;
          }

          input {
            margin: 14px 0px;
            width: 339px;
            height: 42px;
            background: #ffffff;
            border-radius: 4px;
            border: 1px solid rgba(221, 221, 221, 0.82);
            outline: none;
          }
        }

        .addItemContainer {
          .addItemHeader {
          }

          .requireTitle {
            margin-top: 17px;
            font-size: 17px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #666666;
          }

          input#male.checkBoxButton {
            display: none;
          }
          input#male.checkBoxButton:checked + label.buttonLabel {
            background-color: #0091ff;
          }
          input#male.checkBoxButton:checked + label.buttonLabel:before {
            left: 20px;
          }
          //定位，外观
          label.buttonLabel {
            width: 40px;
            height: 20px;
            border-radius: 20px;
            background-color: #ccc;
            box-shadow: #ccc 0px 0px 0px 1px;
            display: inline-block;
            position: relative;
            //定位，外观
            &:before {
              content: "";
              width: 20px;
              height: 20px;
              border-radius: 20px;
              background-color: #fff;
              position: absolute;
              left: 0;
              top: 0;
              display: inline-block;
              z-index: 1;
              transition: all 0.5s;
            }
          }
        }

        .addButton {
          width: 73px;
          height: 42px;
          background: #0091ff;
          border-radius: 4px;
          font-size: 17px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
          margin-top: 8px;
          text-align: center;
          line-height: 42px;
        }
      }
      .right5 {
        padding-left: 14px;
        margin-left: 17px;
        .rightHeader {
          display: flex;
          align-items: center;
          margin-top: 14px;
          .bar {
            width: 3px;
            height: 18px;
            background: #0091ff;
          }
          .rightTitle {
            margin-left: 14px;
            font-size: 20px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
          }
        }

        .inputContainer {
          .inputTitle {
            display: flex;
            align-items: center;
            font-size: 17px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #555555;
            margin-top: 28px;
          }

          input {
            margin: 14px 0px;
            width: 339px;
            height: 42px;
            background: #ffffff;
            border-radius: 4px;
            border: 1px solid rgba(221, 221, 221, 0.82);
            outline: none;
          }
        }

        .addItemContainer {
          .addItemHeader {
          }

          .requireTitle {
            margin-top: 17px;
            font-size: 17px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #666666;
          }

          input#male.checkBoxButton {
            display: none;
          }
          input#male.checkBoxButton:checked + label.buttonLabel {
            background-color: #0091ff;
          }
          input#male.checkBoxButton:checked + label.buttonLabel:before {
            left: 20px;
          }
          //定位，外观
          label.buttonLabel {
            width: 40px;
            height: 20px;
            border-radius: 20px;
            background-color: #ccc;
            box-shadow: #ccc 0px 0px 0px 1px;
            display: inline-block;
            position: relative;
            //定位，外观
            &:before {
              content: "";
              width: 20px;
              height: 20px;
              border-radius: 20px;
              background-color: #fff;
              position: absolute;
              left: 0;
              top: 0;
              display: inline-block;
              z-index: 1;
              transition: all 0.5s;
            }
          }
        }
        .addButton {
          width: 73px;
          height: 42px;
          background: #0091ff;
          border-radius: 4px;
          font-size: 17px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
          margin-top: 8px;
          text-align: center;
          line-height: 42px;
        }
      }
      .right6 {
        padding-left: 14px;
        margin-left: 17px;
        .rightHeader {
          display: flex;
          align-items: center;
          margin-top: 14px;
          .bar {
            width: 3px;
            height: 18px;
            background: #0091ff;
          }
          .rightTitle {
            margin-left: 14px;
            font-size: 20px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
          }
        }

        .inputContainer {
          .inputTitle {
            display: flex;
            align-items: center;
            font-size: 17px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #555555;
            margin-top: 28px;
          }

          input {
            margin: 14px 0px;
            width: 339px;
            height: 42px;
            background: #ffffff;
            border-radius: 4px;
            border: 1px solid rgba(221, 221, 221, 0.82);
            outline: none;
          }
        }

        .addItemContainer {
          .addItemHeader {
          }

          .requireTitle {
            margin-top: 17px;
            font-size: 17px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #666666;
          }

          input#male.checkBoxButton {
            display: none;
          }
          input#male.checkBoxButton:checked + label.buttonLabel {
            background-color: #0091ff;
          }
          input#male.checkBoxButton:checked + label.buttonLabel:before {
            left: 20px;
          }
          //定位，外观
          label.buttonLabel {
            width: 40px;
            height: 20px;
            border-radius: 20px;
            background-color: #ccc;
            box-shadow: #ccc 0px 0px 0px 1px;
            display: inline-block;
            position: relative;
            //定位，外观
            &:before {
              content: "";
              width: 20px;
              height: 20px;
              border-radius: 20px;
              background-color: #fff;
              position: absolute;
              left: 0;
              top: 0;
              display: inline-block;
              z-index: 1;
              transition: all 0.5s;
            }
          }
        }

        .addButton {
          width: 73px;
          height: 42px;
          background: #0091ff;
          border-radius: 4px;
          font-size: 17px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
          margin-top: 8px;
          text-align: center;
          line-height: 42px;
        }
      }

      .right7 {
        padding-left: 14px;
        margin-left: 17px;
        .rightHeader {
          display: flex;
          align-items: center;
          margin-top: 14px;
          .bar {
            width: 3px;
            height: 18px;
            background: #0091ff;
          }
          .rightTitle {
            margin-left: 14px;
            font-size: 20px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
          }
        }

        .inputContainer {
          .inputTitle {
            display: flex;
            align-items: center;
            font-size: 17px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #555555;
            margin-top: 28px;
          }

          input {
            margin: 14px 0px;
            width: 339px;
            height: 42px;
            background: #ffffff;
            border-radius: 4px;
            border: 1px solid rgba(221, 221, 221, 0.82);
            outline: none;
          }
        }

        .inputSlideContainer {
        }

        .addItemContainer {
          .addItemHeader {
          }

          .requireTitle {
            margin-top: 17px;
            font-size: 17px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #666666;
          }

          input#male.checkBoxButton {
            display: none;
          }
          input#male.checkBoxButton:checked + label.buttonLabel {
            background-color: #0091ff;
          }
          input#male.checkBoxButton:checked + label.buttonLabel:before {
            left: 20px;
          }
          //定位，外观
          label.buttonLabel {
            width: 40px;
            height: 20px;
            border-radius: 20px;
            background-color: #ccc;
            box-shadow: #ccc 0px 0px 0px 1px;
            display: inline-block;
            position: relative;
            //定位，外观
            &:before {
              content: "";
              width: 20px;
              height: 20px;
              border-radius: 20px;
              background-color: #fff;
              position: absolute;
              left: 0;
              top: 0;
              display: inline-block;
              z-index: 1;
              transition: all 0.5s;
            }
          }
        }

        .addButton {
          width: 73px;
          height: 42px;
          background: #0091ff;
          border-radius: 4px;
          font-size: 17px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
          margin-top: 8px;
          text-align: center;
          line-height: 42px;
        }
      }
    }
  }
}
</style>