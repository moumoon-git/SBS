<!--
 * @Author: yaoweixin
 * @Date: 2020-08-16 16:14:13
 * @LastEditors: yaoweixin
 * @LastEditTime: 2020-12-18 18:08:33
 * @Description: 新增专题弹框
 * @FilePath: \SBSNEW\src\views\modules\specialTopic\specialTopicTemplate\components\addSpecialTopicDialog.vue
-->
<template>
  <div class="addSpecialTopicDialog">
    <el-dialog title="新增专题" :visible.sync="dialogVisible" width="1563px" :show-close="false" :close-on-click-modal="false">
      <div class="dialogWrapper">
        <!-- 左侧部分 -->
        <div class="left">
          <div class="mainContent">
            <div class="mainButton" @click="openAddCategoryDialog">
              + 新增类目
            </div>
            <div
              class="itemWrapper"
              @click="addQuestion(1)"
              :class="{ itemActive: itemIndex == 1 }"
            :show-close="false"
            >
              <img
                src="~@/assets/img/specialTopicImg/singleChooseActive.png"
                alt=""
                v-if="itemIndex == 1"
              />
              <img
                src="~@/assets/img/specialTopicImg/singleChoose.png"
                alt=""
                v-else
              />
              <div class="itemTitle">单选框</div>
            </div>
            <div
              class="itemWrapper"
              @click="addQuestion(2)"
              :class="{ itemActive: itemIndex == 2 }"
            >
              <img
                src="~@/assets/img/specialTopicImg/manyChooseActive.png"
                alt=""
                v-if="itemIndex == 2"
              />
              <img
                src="~@/assets/img/specialTopicImg/manyChoose.png"
                alt=""
                v-else
              />
              <div class="itemTitle">多选项</div>
            </div>
            <div
              class="itemWrapper"
              @click="addQuestion(3)"
              :class="{ itemActive: itemIndex == 3 }"
            >
              <img
                src="~@/assets/img/specialTopicImg/singleQuestionActive.png"
                alt=""
                v-if="itemIndex == 3"
              />
              <img
                src="~@/assets/img/specialTopicImg/singleQuestion.png"
                alt=""
                v-else
              />
              <div class="itemTitle">问答题（单行）</div>
            </div>
            <div
              class="itemWrapper"
              @click="addQuestion(4)"
              :class="{ itemActive: itemIndex == 4 }"
            >
              <img
                src="~@/assets/img/specialTopicImg/manyQuestionActive.png"
                alt=""
                v-if="itemIndex == 4"
              />
              <img
                src="~@/assets/img/specialTopicImg/manyQuestion.png"
                alt=""
                v-else
              />
              <div class="itemTitle">问答题（多行）</div>
            </div>
            <div
              class="itemWrapper"
              @click="addQuestion(5)"
              :class="{ itemActive: itemIndex == 5 }"
            >
              <img
                src="~@/assets/img/specialTopicImg/addressActive.png"
                alt=""
                v-if="itemIndex == 5"
              />
              <img
                src="~@/assets/img/specialTopicImg/address.png"
                alt=""
                v-else
              />
              <div class="itemTitle">地址</div>
            </div>
            <div
              class="itemWrapper"
              @click="addQuestion(6)"
              :class="{ itemActive: itemIndex == 6 }"
            >
              <img
                src="~@/assets/img/specialTopicImg/locationActive.png"
                alt=""
                v-if="itemIndex == 6"
              />
              <img
                src="~@/assets/img/specialTopicImg/location.png"
                alt=""
                v-else
              />
              <div class="itemTitle">定位</div>
            </div>
            <div
              class="itemWrapper"
              @click="addQuestion(7)"
              :class="{ itemActive: itemIndex == 7 }"
            >
              <img
                src="~@/assets/img/specialTopicImg/fileActive.png"
                alt=""
                v-if="itemIndex == 7"
              />
              <img src="~@/assets/img/specialTopicImg/file.png" alt="" v-else />
              <div class="itemTitle">附件</div>
            </div>
          </div>
        </div>
        <!-- 中间部分 -->
        <div class="center">
          <div class="centerHeader">
            <div class="bar"></div>
            <div class="centerTitle">新增题库模板</div>
          </div>
          <div class="topForm">
            <el-form ref="form" :model="form" label-width="80px">
              <el-form-item label="模板名称" class="formItem">
                <el-input
                  v-model="form.name"
                  class="formInput"
                  placeholder="请输入名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="模板分组" class="formItem">
                <div
                  @click.prevent="openTemplateGroupDialog"
                  class="inputContainer"
                >
                  <img src="~@/assets/img/specialTopicImg/expand.png" alt="" />
                  <input
                    type="text"
                    readonly
                    v-model="templateGroupNode.name"
                    class="inputStyle"
                  />
                </div>
              </el-form-item>
              <!-- <el-form-item label="模板分组:">
                    <el-radio v-model="radio" label="1">填写单项</el-radio>
                    <el-radio v-model="radio" label="2">填写多项</el-radio>
                    </el-form-item> -->
              <el-form-item label="题型描述" class="formItem">
                <el-input
                  type="textarea"
                  v-model="form.desc"
                  class="textareaStyle"
                  placeholder="请输入题型描述"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
          <!-- 所有添加的类目 -->
          <div
            class="centerFormWrapper"
            v-for="(item, categoryIndex) in categoryList"
            :key="categoryIndex"
          >
            <div class="formTitleWrapper">
              <div class="formTitle" @click="chooseCat(categoryIndex)" :class="{catActive: catIndex == categoryIndex}">
                {{ item.name }}
                <img
                  src="~@/assets/img/specialTopicImg/titleDesc.png"
                  alt=""
                  @click="editCategory(item, categoryIndex)"
                />
              </div>
              <div class="deleteText" @click="deleteCategory(categoryIndex)">
                <img
                  src="~@/assets/img/specialTopicImg/deleteCategory.png"
                  alt=""
                />
                删除类目
              </div>
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
                    <div class="radioContent">
                      <div
                        class="choose-box"
                        v-for="(selectItem, selectIndex) in item2.fkSelectList"
                        :key="selectIndex"
                      >
                        <input
                          type="radio"
                          id="yes"
                          name="choose"
                          value="selectItem.content"
                        />
                        <label for="selectItem.content">{{
                          selectItem.content
                        }}</label>
                      </div>
                    </div>
                    <div class="expandContainer">
                      <el-checkbox
                        @change="
                          val => {
                            changeState1(val, item2);
                          }
                        "
                        >是否列为列表显示字段</el-checkbox
                      >

                      <el-checkbox
                        @change="
                          val => {
                            changeState2(val, item2);
                          }
                        "
                        >是否列为默认检索字段</el-checkbox
                      >

                      <el-checkbox
                        @change="
                          val => {
                            changeState3(val, item2);
                          }
                        "
                        >是否列为统计字段</el-checkbox
                      >
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
                    <div class="radioContent">
                      <div
                        class="choose-box"
                        v-for="(selectItem, selectIndex) in item2.fkSelectList"
                        :key="selectIndex"
                      >
                        <input
                          type="checkbox"
                          id="selectItem.content"
                          name="selectItem.content"
                        />
                        <label for="selectItem.content">{{
                          selectItem.content
                        }}</label>
                      </div>
                    </div>
                    <div class="expandContainer">
                      <el-checkbox
                        @change="
                          val => {
                            changeState1(val, item2);
                          }
                        "
                        >是否列为列表显示字段</el-checkbox
                      >

                      <el-checkbox
                        @change="
                          val => {
                            changeState2(val, item2);
                          }
                        "
                        >是否列为默认检索字段</el-checkbox
                      >

                      <el-checkbox
                        @change="
                          val => {
                            changeState3(val, item2);
                          }
                        "
                        >是否列为统计字段</el-checkbox
                      >
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
                    <input type="text" value="" :placeholder="item2.remark" />
                    <div class="expandContainer">
                      <el-checkbox
                        @change="
                          val => {
                            changeState1(val, item2);
                          }
                        "
                        >是否列为列表显示字段</el-checkbox
                      >

                      <el-checkbox
                        @change="
                          val => {
                            changeState2(val, item2);
                          }
                        "
                        >是否列为默认检索字段</el-checkbox
                      >

                      <el-checkbox
                        @change="
                          val => {
                            changeState3(val, item2);
                          }
                        "
                        >是否列为统计字段</el-checkbox
                      >
                    </div>
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
                      :placeholder="item2.remark"
                    ></textarea>
                    <div class="expandContainer">
                      <el-checkbox
                        @change="
                          val => {
                            changeState1(val, item2);
                          }
                        "
                        >是否列为列表显示字段</el-checkbox
                      >

                      <el-checkbox
                        @change="
                          val => {
                            changeState2(val, item2);
                          }
                        "
                        >是否列为默认检索字段</el-checkbox
                      >

                      <el-checkbox
                        @change="
                          val => {
                            changeState3(val, item2);
                          }
                        "
                        >是否列为统计字段</el-checkbox
                      >
                    </div>
                  </div>
                  <div
                    class="addressWrapper"
                    v-else-if="item2.topicName == '说明'"
                  >
                    <div class="questionTitle">
                      <span style="color: red;" v-if="item2.isAnswer == '1'"
                        >*</span
                      >{{ item2.title }}
                    </div>
                    <input type="text" value="" placeholder="请填写详细地址" />
                    <div class="expandContainer">
                      <el-checkbox
                        @change="
                          val => {
                            changeState1(val, item2);
                          }
                        "
                        >是否列为列表显示字段</el-checkbox
                      >

                      <el-checkbox
                        @change="
                          val => {
                            changeState2(val, item2);
                          }
                        "
                        >是否列为默认检索字段</el-checkbox
                      >

                      <el-checkbox
                        @change="
                          val => {
                            changeState3(val, item2);
                          }
                        "
                        >是否列为统计字段</el-checkbox
                      >
                    </div>
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
                    <div class="locationWrapper">
                      <img
                        src="~@/assets/img/specialTopicImg/location.png"
                        alt=""
                      />
                      获取当前位置
                    </div>
                    <div class="expandContainer">
                      <el-checkbox
                        @change="
                          val => {
                            changeState1(val, item2);
                          }
                        "
                        >是否列为列表显示字段</el-checkbox
                      >

                      <el-checkbox
                        @change="
                          val => {
                            changeState2(val, item2);
                          }
                        "
                        >是否列为默认检索字段</el-checkbox
                      >

                      <el-checkbox
                        @change="
                          val => {
                            changeState3(val, item2);
                          }
                        "
                        >是否列为统计字段</el-checkbox
                      >
                    </div>
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
                    <el-upload
                      class="upload-demo"
                      action=""
                      multiple
                      :file-list="fileList"
                    >
                      <!-- <el-button size="small" type="primary">点击上传</el-button> -->
                      <div class="uploadContainer">
                        <div class="addText">+</div>
                        <div class="toast">点击上传</div>
                      </div>
                    </el-upload>
                    <!-- <div class="expandContainer">
                      <el-checkbox
                        @change="
                          val => {
                            changeState1(val, item2);
                          }
                        "
                        >是否列为列表显示字段</el-checkbox
                      >

                      <el-checkbox
                        @change="
                          val => {
                            changeState2(val, item2);
                          }
                        "
                        >是否列为默认检索字段</el-checkbox
                      >

                      <el-checkbox
                        @change="
                          val => {
                            changeState3(val, item2);
                          }
                        "
                        >是否列为统计字段</el-checkbox
                      >
                    </div> -->
                  </div>
                  <img
                    src="~@/assets/img/specialTopicImg/deleteQuestion.png"
                    alt=""
                    class="deleteQuestionIcon"
                    @click="deleteQuestion(questionIndex,categoryIndex)"
                  />
                </div>
              </div>
            </div>
          </div>
          <!-- 保存取消按钮 -->
          <div class="buttonContainer">
            <div class="cancelButton" @click="returnTemplate">返回</div>
            <div class="saveButton" @click="saveTemplate">保存</div>
          </div>
        </div>
        <!-- 右侧点击选项展示部分,根据选项不同展示不同的部分 -->
        <!--单选项-->
        <div class="right" v-if="questionId === 1">
          <div class="rightHeader">
            <div class="bar"></div>
            <div class="rightTitle">单选框</div>
          </div>
          <div class="inputContainer">
            <div class="inputTitle">
              标题&nbsp;&nbsp;
              <!-- <span
                style="font-size: 17px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: #999999;"
                >最多20字</span
              > -->
            </div>
            <input
              type="text"
              value=""
              v-model="radioTitile"
              placeholder="请输入标题名称"
            />
          </div>
          <div class="itemTitle">选项</div>
          <div class="inputSlideContainer">
            <div
              class="inputSlide"
              v-for="(item, index) in selectList"
              :key="index"
            >
              <img src="~@/assets/img/specialTopicImg/drag.png" alt="" />
              <input type="text" value="" v-model="item.content" />
              <img
                src="~@/assets/img/specialTopicImg/deleteItem.png"
                alt=""
                @click="deleteRadioContent(index)"
                class="deleteIcon"
              />
            </div>
          </div>
          <div class="addItemContainer">
            <!-- <div class="addItemHeader" >添加补充选项</div> -->
            <div class="addItemTitle" @click="addRadioContent">+ 添加选项</div>
            <div class="requireTitle">必填</div>
            <div style="margin-top: 10px;margin-left: 14px;">
              <input
                type="checkbox"
                class="checkBoxButton"
                name="sex"
                id="male"
                v-model="onOrOff"
              />
              <label for="male" class="buttonLabel"></label>
            </div>
          </div>
          <div class="addButton" @click="confirmAdd(1)">添加</div>
        </div>
        <!-- 多选项 -->
        <div class="right2" v-else-if="questionId === 2">
          <div class="rightHeader">
            <div class="bar"></div>
            <div class="rightTitle">多选框</div>
          </div>
          <div class="inputContainer">
            <div class="inputTitle">
              标题&nbsp;&nbsp;
              <!-- <span
                style="font-size: 17px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: #999999;"
                >最多20字</span
              > -->
            </div>
            <input
              type="text"
              value=""
              v-model="checkBoxTitle"
              placeholder="请输入标题名称"
            />
          </div>
          <div class="itemTitle">选项</div>
          <div class="inputSlideContainer">
            <div
              class="inputSlide"
              v-for="(item, index) in manySelectList"
              :key="index"
            >
              <img src="~@/assets/img/specialTopicImg/drag.png" alt="" />
              <input type="text" value="" v-model="item.content" />
              <!-- <img src="~@/assets/img/delete.png" alt="" @click="deleteCheckboxContent(index)"> -->
              <img
                src="~@/assets/img/specialTopicImg/deleteItem.png"
                alt=""
                @click="deleteCheckboxContent(index)"
                class="deleteIcon"
              />
            </div>
          </div>
          <div class="addItemContainer">
            <!-- <div class="addItemHeader">添加补充选项</div> -->
            <div class="addItemTitle" @click="addCheckboxContent">
              + 添加选项
            </div>
            <div class="requireTitle">必填</div>
            <div style="margin-top: 10px;">
              <input
                type="checkbox"
                class="checkBoxButton"
                name="sex"
                id="male"
                v-model="onOrOff2"
              />
              <label for="male" class="buttonLabel"></label>
            </div>
          </div>
          <div class="addButton" @click="confirmAdd(2)">添加</div>
        </div>
        <!-- 问答题（单行) -->
        <div class="right3" v-else-if="questionId === 3">
          <div class="rightHeader">
            <div class="bar"></div>
            <div class="rightTitle">单行输入框</div>
          </div>
          <div class="inputContainer">
            <div class="inputTitle">
              标题&nbsp;&nbsp;
              <!-- <span
                style="font-size: 17px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: #999999;"
                >最多20字</span
              > -->
            </div>
            <input
              type="text"
              value=""
              v-model="singleAnswerTitle"
              placeholder="请输入标题名称"
            />
          </div>
          <div class="inputContainer">
            <div class="inputTitle">
              提示文字&nbsp;&nbsp;
              <!-- <span
                style="font-size: 17px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: #999999;"
                >最多30字</span
              > -->
            </div>
            <input
              type="text"
              value=""
              v-model="singleAnswerTitlePlaceholder"
            />
          </div>
          <div class="addItemContainer">
            <!-- <div class="addItemHeader">添加补充选项</div> -->
            <!-- <div class="addItemTitle">+ 添加选项</div> -->
            <div class="requireTitle">必填</div>
            <div style="margin-top: 10px;">
              <input
                type="checkbox"
                class="checkBoxButton"
                name="sex"
                id="male"
                v-model="onOrOff3"
              />
              <label for="male" class="buttonLabel"></label>
            </div>
          </div>
          <div class="addButton" @click="confirmAdd(3)">添加</div>
        </div>
        <!-- 问答题 （多行） -->
        <div class="right4" v-else-if="questionId === 4">
          <div class="rightHeader">
            <div class="bar"></div>
            <div class="rightTitle">多行输入框</div>
          </div>
          <div class="inputContainer">
            <div class="inputTitle">
              标题&nbsp;&nbsp;
              <!-- <span
                style="font-size: 17px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: #999999;"
                >最多20字</span
              > -->
            </div>
            <input
              type="text"
              value=""
              v-model="manyAnswerTitle"
              placeholder="请输入标题名称"
            />
          </div>
          <div class="inputContainer">
            <div class="inputTitle">
              提示文字&nbsp;&nbsp;
              <!-- <span
                style="font-size: 17px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: #999999;"
                >最多30字</span
              > -->
            </div>
            <input type="text" value="" v-model="manyAnswerTitlePlaceholder" />
          </div>
          <div class="addItemContainer">
            <!-- <div class="addItemHeader">添加补充选项</div> -->
            <!-- <div class="addItemTitle">添加选项</div> -->
            <div class="requireTitle">必填</div>
            <div style="margin-top: 10px;">
              <input
                type="checkbox"
                class="checkBoxButton"
                name="sex"
                id="male"
                v-model="onOrOff4"
              />
              <label for="male" class="buttonLabel"></label>
            </div>
          </div>
          <div class="addButton" @click="confirmAdd(4)">添加</div>
        </div>
        <!-- 地址 -->
        <div class="right5" v-else-if="questionId === 5">
          <div class="rightHeader">
            <div class="bar"></div>
            <div class="rightTitle">地址</div>
          </div>
          <div class="inputContainer">
            <div class="inputTitle">
              标题&nbsp;&nbsp;
              <!-- <span
                style="font-size: 17px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: #999999;"
                >最多20字</span
              > -->
            </div>
            <input
              type="text"
              value=""
              v-model="addressTitle"
              placeholder="请输入标题名称"
            />
          </div>
          <div class="addItemContainer">
            <!-- <div class="addItemHeader">添加补充选项</div> -->
            <!-- <div class="addItemTitle">添加选项</div> -->
            <div class="requireTitle">必填</div>
            <div style="margin-top: 10px;">
              <input
                type="checkbox"
                class="checkBoxButton"
                name="sex"
                id="male"
                v-model="onOrOff5"
              />
              <label for="male" class="buttonLabel"></label>
            </div>
          </div>
          <div class="addButton" @click="confirmAdd(5)">添加</div>
        </div>
        <!-- 定位 -->
        <div class="right6" v-else-if="questionId === 6">
          <div class="rightHeader">
            <div class="bar"></div>
            <div class="rightTitle">定位</div>
          </div>
          <div class="inputContainer">
            <div class="inputTitle">
              标题&nbsp;&nbsp;
              <!-- <span
                style="font-size: 17px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: #999999;"
                >最多20字</span
              > -->
            </div>
            <input
              type="text"
              value=""
              v-model="locationTitle"
              placeholder="请输入标题名称"
            />
          </div>
          <div class="addItemContainer">
            <!-- <div class="addItemHeader">添加补充选项</div> -->
            <!-- <div class="addItemTitle">添加选项</div> -->
            <div class="requireTitle">必填</div>
            <div style="margin-top: 10px;">
              <input
                type="checkbox"
                class="checkBoxButton"
                name="sex"
                id="male"
                v-model="onOrOff6"
              />
              <label for="male" class="buttonLabel"></label>
            </div>
          </div>
          <div class="addButton" @click="confirmAdd(6)">添加</div>
        </div>
        <!-- 附件 -->
        <div class="right7" v-else-if="questionId === 7">
          <div class="rightHeader">
            <div class="bar"></div>
            <div class="rightTitle">附件</div>
          </div>
          <div class="inputContainer">
            <div class="inputTitle">
              标题&nbsp;&nbsp;
              <!-- <span
                style="font-size: 17px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: #999999;"
                >最多20字</span
              > -->
            </div>
            <input
              type="text"
              value=""
              v-model="appendixTitle"
              placeholder="请输入标题名称"
            />
          </div>
          <div class="addItemContainer">
            <!-- <div class="addItemHeader">添加补充选项</div> -->
            <!-- <div class="addItemTitle">添加选项</div> -->
            <div class="requireTitle">必填</div>
            <div style="margin-top: 10px;">
              <input
                type="checkbox"
                class="checkBoxButton"
                name="sex"
                id="male"
                v-model="onOrOff7"
              />
              <label for="male" class="buttonLabel"></label>
            </div>
          </div>
          <div class="addButton" @click="confirmAdd(7)">添加</div>
        </div>
      </div>
    </el-dialog>
    <!-- 添加类目的弹框 -->
    <addCategoryDialog
      @addCategory="addCategorys"
      ref="addCatDialog"
    ></addCategoryDialog>
    <!-- 选择模板分组的弹框 -->
    <ChooseTemplateGroupDialog
      ref="chooseTemplateGroupDialog"
      @chooseTemplate="chooseTemplateGroup"
    ></ChooseTemplateGroupDialog>
    <!-- 返回的弹框 -->
    <ReturnDialog
      ref="returnDialog"
      @save="returnTop"
      @returnTableList="returnTableList"
    ></ReturnDialog>
    <!-- 编辑类目的弹框 -->
    <editCategoryDialog
      ref="editCategoryDialog"
      @editCategorySubmit="editCategorySubmit"
    ></editCategoryDialog>
  </div>
</template>
<script>
import editCategoryDialog from "./editCategory.vue";
import ReturnDialog from "./returnDialog.vue";
import addCategoryDialog from "./addCategory.vue";
import ChooseTemplateGroupDialog from "./ChooseTemplateGroupDialog.vue";
export default {
  name: "addSpecialTopicDialog",
  data() {
    return {
      oldNodeMessage : {id: -1, name: ""},
      catIndex: -1, //当前被点击的类目
      itemIndex: 0, //判断点击了那个选项
      isAddCategory: false, //判断是否已创立类目
      fileList: [], //上传文件列表
      questionId: 0, //题型的标记，用来标识不同的题型
      onOrOff: false, //单选选项是否必填
      onOrOff2: false, //多选项是否必填
      onOrOff3: false, //问答题单行
      onOrOff4: false, //问答题多行
      onOrOff5: false, //地址
      onOrOff6: false, //定位
      onOrOff7: false, //附件
      dialogVisible: false, //控制新增专题弹框的展示与关闭
      form: {
        name: "",
        desc: ""
      },
      selectList: [{ content: "", remark: "" }], //单选的内容列表
      manySelectList: [{ content: "", remark: "" }], //多选的内容列表
      radioTitile: "", //单选列表
      orderNum: 0, // 题型顺序
      checkBoxTitle: "", //多选标题
      singleAnswerTitle: "", //问答题单行标题
      singleAnswerTitlePlaceholder: "", //问答题单行标题提示语
      manyAnswerTitle: "", //问答题多行标题
      manyAnswerTitlePlaceholder: "", //问答题多行标题提示语
      addressTitle: "", //地址标题
      locationTitle: "", //定位标题
      appendixTitle: "", //附件标题
      templateGroupNode: { id: -1, name: "" }, //选择的模板分组
      bottomForm: {
        name: ""
      },
      radio: "1",
      value: "",
      checkList: [],
      categoryList: [], //类目列表
      cataEntityList: [
        {
          name: "类目1",
          remark: "类目描述1",
          questionEntityList: [
            {
              title: "题目1",
              remark: "题目描述1",
              isAnswer: "1",
              orderNum: 1,
              isExplain: "0",
              isView: "0",
              isSearch: "0",
              isCount: "0",
              isChange: "0",
              imgRemark: "",
              topicName: "单选题",
              fkSelectList: [
                {
                  content: "1",
                  remark: ""
                }
              ]
            }
          ]
        }
      ]
    };
  },
  watch: {
    onOrOff(newVal, oldVal) {
      console.log("xinzhi为", newVal);
    }
  },
  components: {
    addCategoryDialog,
    ChooseTemplateGroupDialog,
    ReturnDialog,
    editCategoryDialog
  },
    methods: {
        chooseCat(index) {
            this.catIndex = index
        },
        editCategory(obj,index) {
            this.$refs.editCategoryDialog.init(obj,index)
        },
        /**
         * @description: 编辑类目确认
         * @param {*}
         * @return {*}
         */
        editCategorySubmit(obj,index) {
           this.$set(this.categoryList,index,obj) 
           this.$refs.editCategoryDialog.dialogVisible = false
        },
        /**
         * @description: 返回表格列表
         * @param {*}
         * @return {*}
         */
        returnTableList() {
            this.refreshForm()
            this.dialogVisible = false
            this.$emit('refreshTable')
        },
        returnTop() {
            this.refreshForm()
            this.dialogVisible = false
        },
        returnTemplate() {
            this.$refs.returnDialog.init('ret')
        },
        /**
         * @description: 删除问题
         * @param {*} index:问题的索引
         * @return {*}
         */
        deleteQuestion(index,catIndex) {
           this.categoryList[catIndex].questionEntityList.splice(index,1) 
        },
        changeState1(value,item2) {
            console.log('是否'+ value+"item"+JSON.stringify(item2))
            if(value) {
                item2.isView = '1'
            }else {
                item2.isView = '0'
            }
        },
        changeState2(value,item2) {
            console.log('是否'+ value+"item"+JSON.stringify(item2))
            if(value) {
                item2.isSearch = '1'
            }else {
                item2.isSearch = '0'
            }
        },
        changeState3(value,item2) {
            console.log('是否'+ value+"item"+JSON.stringify(item2))
             if(value) {
                item2.isCount = '1'
            }else {
                item2.isCount = '0'
            }
        },
        //确认添加类目
        addCategorys(form) {
            this.$refs.addCatDialog.dialogVisible = false
            console.log('要添加的类目为',form)
            var cataEntity = {
                "name": form.categoryName,
                "remark": form.categoryDesc
            }
            cataEntity.questionEntityList = []
            this.categoryList.push(cataEntity)
            this.orderNum = 0
            this.isAddCategory = true
        },
        //打开添加类目的弹框
        openAddCategoryDialog() {
            this.$refs.addCatDialog.dialogVisible = true   
        },
        //点击选项添加相应的题型
        addQuestion(id) {
            this.questionId = id
            this.itemIndex = id
        },
        /**
         * @description: 选择某一项填写完整的题型然后添加题型
         * @param {int} id:题型id
         * @return {type} 无
         */
        confirmAdd(id) {
            if(this.isAddCategory) {
            this.orderNum++
            if(id === 1) {//添加单选
              if(this.radioTitile && this.selectList.every(item => item.content)) {
                var questionEntity = {
                    "title": this.radioTitile,
                    "remark": '',
                    "isAnswer": this.onOrOff? "1": "2",
                    "orderNum": this.orderNum,
                    "isExplain":"0",
                    "isView":"0",
                    "isSearch":"0",
                    "isCount":"0",
                    "isChange":"0",
                    "imgRemark":"",
                    "topicName":"单选题",
                    "fkSelectList": this.selectList
                }
                if(this.catIndex == -1) {
                    this.categoryList[this.categoryList.length-1].questionEntityList.push(questionEntity)
                }else {
                    this.categoryList[this.catIndex].questionEntityList.push(questionEntity)
                }
                this.$message('添加成功')
                this.radioTitile = ''
                this.onOrOff = false
                this.selectList = [{"content": '',"remark": ''}]
            } else {
                this.$message.error('标题或选项内容不能为空')
                return
            }
            }else if(id === 2) {//添加多选
            if(this.checkBoxTitle && this.manySelectList.every(item => item.content)) {
                var questionEntity = {
                    "title": this.checkBoxTitle,
                    "remark": '',
                    "isAnswer": this.onOrOff2? "1": "2",
                     "orderNum": this.orderNum,
                    "isExplain":"0",
                    "isView":"0",
                    "isSearch":"0",
                    "isCount":"0",
                    "isChange":"0",
                    "imgRemark":"",
                    "topicName":"多选题",
                    "fkSelectList": this.manySelectList
                }
                if(this.catIndex == -1) {
                    this.categoryList[this.categoryList.length-1].questionEntityList.push(questionEntity)
                }else {
                    this.categoryList[this.catIndex].questionEntityList.push(questionEntity)
                }
                this.$message('添加成功')
                this.checkBoxTitle = ''
                this.onOrOff2 = false
                this.manySelectList = [{"content": '',"remark": ''}]
            } else {
                this.$message.error('标题或选项内容不能为空')
                return
            }
            }else if(id === 3) {//问答题单行
                if(this.singleAnswerTitle) {
                var questionEntity = {
                    "title": this.singleAnswerTitle,
                    "remark": this.singleAnswerTitlePlaceholder, 
                    "isAnswer": this.onOrOff3? "1": "2",
                    "orderNum": this.orderNum,
                    "isExplain":"0",
                    "isView":"0",
                    "isSearch":"0",
                    "isCount":"0",
                    "isChange":"0",
                    "imgRemark":"",
                    "topicName":"简答-输入",
                    "fkSelectList": []
                }
                if(this.catIndex == -1) {
                    this.categoryList[this.categoryList.length-1].questionEntityList.push(questionEntity)
                }else {
                    this.categoryList[this.catIndex].questionEntityList.push(questionEntity)
                }
                
                this.$message('添加成功')
                this.singleAnswerTitle = ''
                this.onOrOff3 = false
            } else {
                 this.$message.error('标题不能为空')
                return
            }
            }else if(id === 4) {//添加问答题多行
                if(this.manyAnswerTitle) {
                var questionEntity = {
                    "title": this.manyAnswerTitle,
                    "remark": this.manyAnswerTitlePlaceholder,
                    "isAnswer": this.onOrOff4? "1": "2",
                    "orderNum": this.orderNum,
                    "isExplain":"0",
                    "isView":"0",
                    "isSearch":"0",
                    "isCount":"0",
                    "isChange":"0",
                    "imgRemark":"",
                    "topicName":"简答-文本",
                    "fkSelectList": []
                }
                if(this.catIndex == -1) {
                    this.categoryList[this.categoryList.length-1].questionEntityList.push(questionEntity)
                }else {
                    this.categoryList[this.catIndex].questionEntityList.push(questionEntity)
                }
                
                this.$message('添加成功')
                this.singleAnswerTitle = ''
                this.onOrOff4 = false
            }else {
                this.$message.error('标题不能为空')
                return
            }
            }else if(id === 5) {//添加地址
                if(this.addressTitle) {
                var questionEntity = {
                    "title": this.addressTitle,
                    "remark": '',
                    "isAnswer": this.onOrOff5? "1": "2",
                    "orderNum": this.orderNum,
                    "isExplain":"0",
                    "isView":"0",
                    "isSearch":"0",
                    "isCount":"0",
                    "isChange":"0",
                    "imgRemark":"",
                    "topicName":"说明",
                    "fkSelectList": []
                }
                if(this.catIndex == -1) {
                    this.categoryList[this.categoryList.length-1].questionEntityList.push(questionEntity)
                }else {
                    this.categoryList[this.catIndex].questionEntityList.push(questionEntity)
                }
                
                this.$message('添加成功')
                this.addressTitle = ''
                this.onOrOff5 = false
            }else {
               this.$message.error('标题不能为空')
                return 
            }
            }else if(id === 6) {//添加定位
                if(this.locationTitle) {
                var questionEntity = {
                    "title": this.locationTitle,
                    "remark": '',
                    "isAnswer": this.onOrOff6? "1": "2",
                    "orderNum": this.orderNum,
                    "isExplain":"0",
                    "isView":"0",
                    "isSearch":"0",
                    "isCount":"0",
                    "isChange":"0",
                    "imgRemark":"",
                    "topicName":"地址",
                    "fkSelectList": []
                }
                if(this.catIndex == -1) {
                    this.categoryList[this.categoryList.length-1].questionEntityList.push(questionEntity)
                }else {
                    this.categoryList[this.catIndex].questionEntityList.push(questionEntity)
                }
                
                this.$message('添加成功')
                this.locationTitle = ''
                this.onOrOff6 = false
            }else {
                this.$message.error('标题不能为空')
                return 
            }
            }
            else if(id === 7) {//添加附件
              if(this.appendixTitle) {
                var questionEntity = {
                    "title": this.appendixTitle,
                    "remark": '',
                    "isAnswer": this.onOrOff7? "1": "2",
                    "orderNum": this.orderNum,
                    "isExplain":"0",
                    "isView":"0",
                    "isSearch":"0",
                    "isCount":"0",
                    "isChange":"0",
                    "imgRemark":"",
                    "topicName":"图片",
                    "fkSelectList": []
                }
                if(this.catIndex == -1) {
                    this.categoryList[this.categoryList.length-1].questionEntityList.push(questionEntity)
                }else {
                    this.categoryList[this.catIndex].questionEntityList.push(questionEntity)
                }
                
                this.$message('添加成功')
                this.appendixTitle = ''
                this.onOrOff7 = false
            }else {
                 this.$message.error('标题不能为空')
                return 
            }
            }
        }else {
            this.$message.error('请先添加类目')
        }
            

        },
        /**
         * @description: 删除某个单选项的内容
         * @param {int} index:每个单选项内容的索引 
         * @return {type} 无 
         */
        deleteRadioContent(index) {
            this.selectList.splice(index,1)
        },
        /**
         * @description: 删除某个多选项的内容
         * @param {int} index: 每个多选项内容的索引
         * @return {type} 无
         */
        deleteCheckboxContent(index) {
            this.manySelectList.splice(index,1)
        },
        /**
         * @description: 添加单选项
         * @param {type} 无
         * @return {type} 无
         */
        addRadioContent() {
            var radioContent = {"content": '',"remark": ''}
            this.selectList.push(radioContent)
        },
        /**
         * @description: 添加多选项
         * @param {type} 无
         * @return {type} 无
         */
        addCheckboxContent() {
            var checkboxContent = {"content": '',"remark": ''}
            this.manySelectList.push(checkboxContent)
        },
        /**
         * @description: 删除类目
         * @param {int} categoryIndex:类目索引
         * @return {type} 无
         */
        deleteCategory(categoryIndex) {
            this.categoryList.splice(categoryIndex,1)
        },
        /**
         * @description: 打开模板分组弹框
         * @param {type} 无
         * @return {type} 无
         */
        openTemplateGroupDialog() {
            this.$refs.chooseTemplateGroupDialog.init()
            this.$refs.chooseTemplateGroupDialog.dialogVisible = true
        },
        /**
         * @description: 选择模板分组节点
         * @param {object} node:模板分组的节点数据
         * @return {type} 无
         */
        chooseTemplateGroup(node) {
            this.templateGroupNode.id = node.id
            this.templateGroupNode.name = node.name
            this.$refs.chooseTemplateGroupDialog.dialogVisible = false
        },
        /**
         * @description: 保存专题模板
         * @param {type} params
         * @return {type} 
         */
        saveTemplate() {
            if(!this.form.name) {
                this.$message.error('模板名称不能为空')
                return
            }
             this.$http({
            url: this.$http.adornUrl(
              `/fk/fkTemplate/save`
            ),
            method: 'post',
            data: this.$http.adornData({
              name: this.form.name,
              groupId: this.templateGroupNode.id.toString(),
              remark: this.form.desc,
              status: "1",
              cataEntityList: this.categoryList
            })
          }).then(({ data }) => {
              console.log('保存模板获得的数据为',data)
              if(data.code === 0) {
                  
                  this.$message('新增成功')
                  this.$refs.returnDialog.init('sav')
                  
              }
              
          })
        },
        refreshForm() {
      this.catIndex = -1, //当前被点击的类目
      this.itemIndex = 0, //判断点击了那个选项
      this.isAddCategory = false, //判断是否已创立类目
      this.fileList = [], //上传文件列表
      this.questionId = 0, //题型的标记，用来标识不同的题型
      this.onOrOff = false, //单选选项是否必填
      this.onOrOff2 = false, //多选项是否必填
      this.onOrOff3 = false, //问答题单行
      this.onOrOff4 = false, //问答题多行
      this.onOrOff5 = false, //地址
      this.onOrOff6 = false, //定位
      this.onOrOff7 = false, //附件
      this.dialogVisible = false, //控制新增专题弹框的展示与关闭
      this.form = {
        name: "",
        desc: ""
      },
      this.selectList = [{ content: "", remark: "" }], //单选的内容列表
      this.manySelectList = [{ content: "", remark: "" }], //多选的内容列表
      this.radioTitile = "", //单选列表
      this.orderNum = 0, // 题型顺序
      this.checkBoxTitle = "", //多选标题
      this.singleAnswerTitle = "", //问答题单行标题
      this.singleAnswerTitlePlaceholder = "", //问答题单行标题提示语
      this.manyAnswerTitle = "", //问答题多行标题
      this.manyAnswerTitlePlaceholder = "", //问答题多行标题提示语
      this.addressTitle = "", //地址标题
      this.locationTitle = "", //定位标题
      this.appendixTitle = "", //附件标题
      this.$set(this.templateGroupNode,'id',this.oldNodeMessage.id)
      this.$set(this.templateGroupNode,'name',this.oldNodeMessage.name)
      
      this.bottomForm = {
        name: ""
      },
      this.radio = "1",
      this.value = "",
      this.checkList = [],
      this.categoryList = [], //类目列表
      this.cataEntityList = [
        {
          name: "类目1",
          remark: "类目描述1",
          questionEntityList: [
            {
              title: "题目1",
              remark: "题目描述1",
              isAnswer: "1",
              orderNum: 1,
              isExplain: "0",
              isView: "0",
              isSearch: "0",
              isCount: "0",
              isChange: "0",
              imgRemark: "",
              topicName: "单选题",
              fkSelectList: [
                {
                  content: "1",
                  remark: ""
                }
              ]
            }
          ]
        }
      ]
        }
      
    
  }
};
</script>
<style lang="less" scoped>
.addSpecialTopicDialog {
  .el-dialog {
    //盒子模型
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
        //     background: linear-gradient(white,white) padding-box, repeating-linear-gradient(-45deg,#ccc 0, #ccc .25em,white 0,white .75em);

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
        //   margin-left: 10px;
        flex-shrink: 0;
        width: 900px;
        border-left: 1px solid #f2f2f2;
        .centerHeader {
          display: flex;
          align-items: center;
          margin-top: 14.06px;
          margin-bottom: 25px;
          .bar {
            width: 3px;
            height: 18px;
            background: #0091ff;
            margin-left: 28.11px;
            margin-right: 14.06px;
          }

          .centerTitle {
            font-size: 20px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
          }
        }
        .topForm {
          border-bottom: 1px solid #ccc;
          margin-left: 22px;
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