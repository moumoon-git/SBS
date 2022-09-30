<template>
  <div>
    <div class="back">
      <div class="left">
        <section class="grayStyle1">
          响应级别
          <img
            src="/static/img/reversePlan/memberUnit.svg"
            style="width: 20px; cursor: pointer;"
            @click="addlevel"
          >
        </section>
        <div
          v-for="level in levels"
          :key="level.id"
          class="leftItemStyle"
          :style="levelId === level.id ? 'color: #0091FF;' : ''"
          @click="clickLevel(level)"
        >
          {{ level.name }}
          <img
            src="/static/img/reversePlan/close.svg"
            style="width:20px;cursor: pointer;"
            @click="deleteLevel(level.id)"
          >
        </div>
      </div>
      <div class="right">
        <section class="grayStyle2">
          响应级别详情
          <el-button
            v-if="activeName === 'first'"
            type="text"
            style="padding: 0;position: absolute;right: 100px;color: #969799;"
            @click="isShowRight = false"
          >
            取消
          </el-button>
          <el-button
            v-if="activeName === 'second'"
            style="padding: 0;position: absolute;right: 100px;color: #fc2929;"
            type="text"
            @click="deleteLevelProcess"
          >
            删除
          </el-button>
          <div class="vline" />
          <el-button
            v-if="activeName === 'first'"
            type="text"
            style="padding: 0;position: absolute;right: 28px;"
            @click="levelMsgSave"
          >
            保存
          </el-button>
          <el-button
            v-if="activeName === 'second'"
            style="padding: 0;position: absolute;right: 28px;"
            type="text"
            @click="saveProcess"
          >
            保存
          </el-button>
        </section>
        <el-tabs
          v-if="isShowRight"
          v-model="activeName"
          @tab-click="clickTabs"
        >
          <!--等级信息-->
          <el-tab-pane
            label="等级信息"
            name="first"
          >
            <div class="padd1">
              <el-button
                class="sbs-button"
                type="primary"
                style="margin-bottom: 28px;"
                @click="openResponse"
              >
                设置响应参数
              </el-button>
              <el-form label-width="100px">
                <el-form-item
                  label="等级名称:"
                  required
                >
                  <el-input
                    v-model="name"
                    size="mini"
                    class="rightInput"
                    show-word-limit
                  />
                </el-form-item>
                <el-form-item
                  label="响应信号:"
                  required
                >
                  <el-select
                    v-model="signalId"
                    placeholder="请选择"
                    size="mini"
                    style="width: 100%;"
                    @change="change_signal"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="事件等级:"
                  required
                >
                  <el-select
                    v-model="emtlevelID"
                    placeholder="请选择"
                    size="mini"
                    style="width: 100%;"
                    @change="change_emtlevel"
                  >
                    <el-option
                      v-for="item in emtlevelData"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="等级描述:"
                  required
                >
                  <el-input
                    v-model="remark"
                    type="textarea"
                    class="rightInput"
                    :rows="6"
                    show-word-limit
                  />
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>

          <!--流程信息-->
          <el-tab-pane
            label="行动方案"
            name="second"
          >
            <!-- 步骤条 -->
            <div class="headStyle">
              <section class="stepInlineStyle">
                <div
                  v-for="(e, i) in processList"
                  :key="i"
                >
                  <div class="stepStyle">
                    <div
                      class="doing"
                      @click="clickProcess(e.id)"
                    >
                      {{ i + 1 }}
                    </div>
                    <div class="line" />
                  </div>
                </div>
                <el-tooltip
                  effect="dark"
                  content="新增步骤"
                  placement="top-start"
                >
                  <div
                    class="doing"
                    @click="addNewProcess"
                  >
                    +
                  </div>
                </el-tooltip>
              </section>
            </div>

            <!-- 点了步骤条 -->
            <div>
              <div class="flowStyle">
                <div>
                  <div class="sbs-title">
                    流程
                  </div>
                </div>
                <el-form label-width="100px">
                  <el-form-item
                    label="流程名称:"
                    required
                  >
                    <el-input
                      v-model="processName"
                      size="mini"
                      show-word-limit
                    />
                  </el-form-item>
                  <el-form-item
                    label="流程内容:"
                    required
                  >
                    <el-input
                      v-model="processContent"
                      type="textarea"
                      :rows="4"
                      show-word-limit
                    />
                  </el-form-item>
                </el-form>
              </div>

              <div
                class="taskLine"
                @click="isShowTask = !isShowTask"
              >
                <div class="sbs-title">
                  任务
                </div>
                <div class="block">
                  <img
                    :class="isShowTask ? 'headerDown' : 'headerDownReset'"
                    src="/static/img/reversePlan/down.svg"
                  >
                </div>
              </div>
              <div
                v-if="isShowTask"
                class="rightStyle"
              >
                <div class="leftDialogStyle">
                  <section class="headerStyle">
                    <div class="taskHead">
                      任务名称
                    </div>
                    <div>
                      <el-button
                        type="text"
                        class="sbs-button"
                        @click="addNewTask"
                      >
                        新增
                      </el-button>
                      <el-button
                        type="text"
                        class="sbs-button"
                        @click="deleteLevelProcessTask"
                      >
                        删除
                      </el-button>
                    </div>
                  </section>
                  <div
                    v-for="e in taskList"
                    :key="e.id"
                    class="leftItemStyle"
                    :style="taskId === e.id ? 'color: #0091FF;' : ''"
                    @click="clickTask(e.id)"
                  >
                    {{ e.name }}
                  </div>
                </div>
                <div class="rightDialogStyle">
                  <el-form label-width="100px">
                    <el-form-item
                      label="任务名称:"
                      required
                    >
                      <el-input
                        v-model="taskName"
                        size="mini"
                        show-word-limit
                      />
                    </el-form-item>
                    <el-form-item
                      label="任务内容:"
                      required
                    >
                      <el-input
                        v-model="taskContent"
                        type="textarea"
                        :rows="4"
                        show-word-limit
                      />
                    </el-form-item>
                    <el-form-item
                      label="负责人:"
                      required
                    >
                      <el-button
                        type="plain"
                        class="sbs-button"
                        @click="openForm5Dialog(0)"
                      >
                        选择
                      </el-button>
                      <div
                        v-for="item in list1"
                        :key="item.id"
                      >
                        <!-- <div
                          class="notHeadLineWithClose"
                          @mouseover="currHover = item"
                          @mouseleave="currHover = ''"
                        >
                          {{ item.name }}
                          <img
                            v-show="currHover === item"
                            src="/static/img/reversePlan/close.svg"
                            class="deleteImg"
                            @click="deleteImg(469, item, {}, list1, 0)"
                          >
                        </div> -->
                        <section v-if="item.groupResponsibleTypeList.length">
                          <!-- <div style="position: relative;">
                            <div class="sbs-title">
                              应急负责人
                            </div>
                          </div> -->
                          <div
                            v-for="itemone in item.groupResponsibleTypeList"
                            :key="itemone.id"
                            class="typeBack"
                            @mouseover="currHover = itemone"
                            @mouseleave="currHover = ''"
                          >
                            <div
                              v-if="itemone.malicontactorList"
                              style="width: 88%;"
                            >
                              <div
                                v-for="itemin in itemone.malicontactorList"
                                :key="itemin.id"
                                class="listItem"
                              >
                                {{ itemin.name }}（{{ itemin.workUnit }}/{{ itemin.position }}）
                              </div>
                            </div>
                            <div
                              v-else
                              class="listItem"
                            >
                              暂无人员
                            </div>
                            <img
                              v-show="currHover === itemone"
                              src="/static/img/reversePlan/close.svg"
                              class="deleteImg"
                              @click="deleteImg(467, item, itemone, list1, 0)"
                            >
                          </div>
                        </section>
                        <section v-if="item.groupContactorTypeList.length">
                          <!-- <div style="position: relative;">
                            <div class="sbs-title">
                              应急联络人
                            </div>
                          </div> -->
                          <div
                            v-for="itemone in item.groupContactorTypeList"
                            :key="itemone.id"
                            class="typeBack"
                            @mouseover="currHover = itemone"
                            @mouseleave="currHover = ''"
                          >
                            <div
                              v-if="itemone.malicontactorList"
                              style="width: 88%;"
                            >
                              <div
                                v-for="itemin in itemone.malicontactorList"
                                :key="itemin.id"
                                class="listItem"
                              >
                                {{ itemin.name }}（{{ itemin.workUnit }}/{{ itemin.position }}）
                              </div>
                            </div>
                            <div
                              v-else
                              class="listItem"
                            >
                              暂无人员
                            </div>
                            <img
                              v-show="currHover === itemone"
                              src="/static/img/reversePlan/close.svg"
                              class="deleteImg"
                              @click="deleteImg(468, item, itemone, list1, 0)"
                            >
                          </div>
                        </section>
                      </div>
                    </el-form-item>
                    <el-form-item label="成员:">
                      <el-button
                        type="plain"
                        class="sbs-button"
                        @click="openForm5Dialog(1)"
                      >
                        选择
                      </el-button>
                      <div
                        v-for="item in list2"
                        :key="item.id"
                      >
                        <!-- <div
                          class="notHeadLineWithClose"
                          @mouseover="currHover = item"
                          @mouseleave="currHover = ''"
                        >
                          {{ item.name }}
                          <img
                            v-show="currHover === item"
                            src="/static/img/reversePlan/close.svg"
                            class="deleteImg"
                            @click="deleteImg(469, item, {}, list2, 1)"
                          >
                        </div> -->
                        <section v-if="item.groupResponsibleTypeList.length">
                          <!-- <div style="position: relative;">
                            <div class="sbs-title">
                              应急负责人
                            </div>
                          </div> -->
                          <div
                            v-for="itemone in item.groupResponsibleTypeList"
                            :key="itemone.id"
                            class="typeBack"
                            @mouseover="currHover = itemone"
                            @mouseleave="currHover = ''"
                          >
                            <div
                              v-if="itemone.malicontactorList"
                              style="width: 88%;"
                            >
                              <div
                                v-for="itemin in itemone.malicontactorList"
                                :key="itemin.id"
                                class="listItem"
                              >
                                {{ itemin.name }}（{{ itemin.workUnit }}/{{ itemin.position }}）
                              </div>
                            </div>
                            <div
                              v-else
                              class="listItem"
                            >
                              暂无人员
                            </div>
                            <img
                              v-show="currHover === itemone"
                              src="/static/img/reversePlan/close.svg"
                              class="deleteImg"
                              @click="deleteImg(467, item, itemone, list2, 1)"
                            >
                          </div>
                        </section>
                        <section v-if="item.groupContactorTypeList.length">
                          <!-- <div style="position: relative;">
                            <div class="sbs-title">
                              应急联络人
                            </div>
                          </div> -->
                          <div
                            v-for="itemone in item.groupContactorTypeList"
                            :key="itemone.id"
                            class="typeBack"
                            @mouseover="currHover = itemone"
                            @mouseleave="currHover = ''"
                          >
                            <div
                              v-if="itemone.malicontactorList"
                              style="width: 88%;"
                            >
                              <div
                                v-for="itemin in itemone.malicontactorList"
                                :key="itemin.id"
                                class="listItem"
                              >
                                {{ itemin.name }}（{{ itemin.workUnit }}/{{ itemin.position }}）
                              </div>
                            </div>
                            <div
                              v-else
                              class="listItem"
                            >
                              暂无人员
                            </div>
                            <img
                              v-show="currHover === itemone"
                              src="/static/img/reversePlan/close.svg"
                              class="deleteImg"
                              @click="deleteImg(468, item, itemone, list2, 1)"
                            >
                          </div>
                        </section>
                      </div>
                    </el-form-item>
                    <el-form-item label="抄送:">
                      <el-button
                        type="plain"
                        class="sbs-button"
                        @click="openForm5Dialog(2)"
                      >
                        选择
                      </el-button>
                      <div
                        v-for="item in list3"
                        :key="item.id"
                      >
                        <!-- <div
                          class="notHeadLineWithClose"
                          @mouseover="currHover = item"
                          @mouseleave="currHover = ''"
                        >
                          {{ item.name }}
                          <img
                            v-show="currHover === item"
                            src="/static/img/reversePlan/close.svg"
                            class="deleteImg"
                            @click="deleteImg(469, item, {}, list3, 2)"
                          >
                        </div> -->
                        <section v-if="item.groupResponsibleTypeList.length">
                          <!-- <div style="position: relative;">
                            <div class="sbs-title">
                              应急负责人
                            </div>
                          </div> -->
                          <div
                            v-for="itemone in item.groupResponsibleTypeList"
                            :key="itemone.id"
                            class="typeBack"
                            @mouseover="currHover = itemone"
                            @mouseleave="currHover = ''"
                          >
                            <div
                              v-if="itemone.malicontactorList"
                              style="width: 88%;"
                            >
                              <div
                                v-for="itemin in itemone.malicontactorList"
                                :key="itemin.id"
                                class="listItem"
                              >
                                {{ itemin.name }}（{{ itemin.workUnit }}/{{ itemin.position }}）
                              </div>
                            </div>
                            <div
                              v-else
                              class="listItem"
                            >
                              暂无人员
                            </div>
                            <img
                              v-show="currHover === itemone"
                              src="/static/img/reversePlan/close.svg"
                              class="deleteImg"
                              @click="deleteImg(467, item, itemone, list3, 2)"
                            >
                          </div>
                        </section>
                        <section v-if="item.groupContactorTypeList.length">
                          <!-- <div style="position: relative;">
                            <div class="sbs-title">
                              应急联络人
                            </div>
                          </div> -->
                          <div
                            v-for="itemone in item.groupContactorTypeList"
                            :key="itemone.id"
                            class="typeBack"
                            @mouseover="currHover = itemone"
                            @mouseleave="currHover = ''"
                          >
                            <div
                              v-if="itemone.malicontactorList"
                              style="width: 88%;"
                            >
                              <div
                                v-for="itemin in itemone.malicontactorList"
                                :key="itemin.id"
                                class="listItem"
                              >
                                {{ itemin.name }}（{{ itemin.workUnit }}/{{ itemin.position }}）
                              </div>
                            </div>
                            <div
                              v-else
                              class="listItem"
                            >
                              暂无人员
                            </div>
                            <img
                              v-show="currHover === itemone"
                              src="/static/img/reversePlan/close.svg"
                              class="deleteImg"
                              @click="deleteImg(468, item, itemone, list3, 2)"
                            >
                          </div>
                        </section>
                      </div>
                    </el-form-item>
                  </el-form>
                  <div class="saveButton">
                    <el-button
                      class="sbs-button"
                      type="primary"
                      @click="saveTask"
                    >
                      保存
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="footer">
      <el-button
        type="plain"
        class="sbs-button"
        @click="$router.push({
          path: '/organization',
          name: 'organization'
        });"
      >
        返回
      </el-button>
      <div>
        <el-button
          type="plain"
          class="sbs-button"
          @click="prev"
        >
          上一步
        </el-button>
        <el-button
          type="primary"
          class="sbs-button"
          @click="next"
        >
          下一步
        </el-button>
      </div>
    </div>

    <Form5Dialog
      ref="Form5DialogRef"
      @refresh="handleForm5Dialog"
    />
    <response
      ref="responseRef"
      :parameter-data="parameterData"
      :table-data="tableData"
      :relation="relation"
      :user-create="0"
      @parameterSetting="parameterSetting"
    />
  </div>
</template>

<script>
import Form5Dialog from './Form5Dialog.vue';
import response from './response.vue';

export default {
  name: 'From5',
  components: {
    Form5Dialog,
    response,
  },
  data() {
    return {
      preplanId: '',
      versionId: '',
      name: '', // 等级信息名称
      remark: '', // 等级信息描述
      options: [], // 响应信号数组
      emtlevelData: [], // 事件等级数组
      levels: [], // 新增级别数组
      signalId: '', // 响应信号ID双向绑定
      emtlevelID: '', // 事件等级ID
      levelId: '', // 新增响应等级ID
      levelIds: '', // 响应等级第一个id
      parameterData: [], // 参数数据
      tableData: [], // 参数表格数据
      relation: '', // 判断表达式
      isShowRight: false,
      activeName: 'first', // 选项卡切换
      isShowTask: false,
      processList: [], // 流程列表
      processName: '', // 流程名称
      processContent: '', // 流程内容
      processId: '', // 流程id
      taskList: [], // 任务列表
      taskName: '', // 任务名称
      taskContent: '', // 任务内容
      taskId: '', // 任务id
      arrWillGivenToWhich: 0, // 当前选人出来后数据给谁
      list1: [], // 负责人
      list2: [], // 成员
      list3: [], // 抄送
      hasPick: [], // 已选的
      currHover: '', // 右边点了什么
    };
  },
  created() {
    this.versionId = Number(sessionStorage.getItem('preplanVersionId')); // 获取预案版本ID
    this.preplanId = Number(sessionStorage.getItem('preplanId')); // 获取预案ID
    this.getLevels();
    this.eventLevel();
    this.pcode();
    this.getParams();
  },
  methods: {
    // 新增级别
    addlevel() {
      this.name = '';
      this.remark = '';
      this.signalId = '';
      this.levelId = '';
      this.tableData = [];
      this.emtlevelID = '';
      this.relation = '';
      this.getParams();
      this.isShowRight = true;
      this.activeName = 'first';
      this.processList = [];
      this.addNewProcess();
    },
    // 删除预案响应等级级别
    deleteLevel(id) {
      this.levelId = id;
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const data = {
          id: this.levelId,
        };
        this.$http({
          method: 'post',
          url: '/emergency/preparation/preplan/deleteLevel',
          baseURL: window.g.ApiUrl,
          data,
        }).then((res) => {
          if (res) {
            this.$message({
              message: '已删除',
              type: 'success',
            });
            this.levelId = '';
            this.getLevels();
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      });
    },
    // 点击级别获取预案响应等级信息
    clickLevel(level) {
      this.levelId = level.id;
      this.Leveldefault(); // 默认加载第一条数据
      this.activeName = 'first';
    },
    // 默认加载第一条数据
    Leveldefault() {
      if (this.levelId === '') {
        this.levelId = this.levelIds;
      }
      this.$http({
        method: 'post',
        url: '/emergency/preparation/preplan/getLevelInfo',
        baseURL: window.g.ApiUrl,
        data: {
          id: this.levelId,
        },
      }).then((res) => {
        const { data } = res.data;
        this.name = data.name;
        this.remark = data.remark;
        this.signalId = data.signalId;
        this.emtlevelID = data.eventLevelId;
        this.isShowRight = true;
        const params = [];
        for (const i in data.params) {
          if (data.params[i] != null) {
            params.push(data.params[i]);
          }
        }
        this.tableData = params;
        if (data.relation === null) {
          this.relation = '';
        } else {
          this.relation = data.relation;
        }
        if (this.relation !== '') {
          const textID = this.relation;
          const regular = textID.match(/\{(.+?)\}/g); // 找出花括号的内容，包括{}
          const deleteArray = []; // 匹配参数不存在数组
          for (const i in regular) {
            let count = 0;
            for (const j in this.parameterData) {
              const ID = `{${this.parameterData[j].id}}`;
              if (ID === regular[i]) {
                count = 1;
                break;
              }
            }
            if (count === 0) {
              deleteArray.push(regular[i]);
            }
          }
          if (deleteArray.length > 0) {
            let name = '';
            // 参数
            for (const i in deleteArray) {
              name += deleteArray[i];
              if (i < deleteArray.length - 1) {
                name += ',';
              }
            }
            setTimeout(() => {
              this.$message({
                message: `${name}参数不存在，请重新生成条件！`,
                type: 'warning',
              });
            }, 100);
          }
        }
      });
    },
    // 选择响应信号返回值
    change_signal(signalId) {
      this.signalId = signalId;
    },
    // 选择事件等级返回值
    change_emtlevel(id) {
      this.emtlevelID = id;
    },
    // 响应信号获取
    pcode() {
      this.$http({
        method: 'post',
        url: '/emergency/preparation/dictionary/getByParentCode',
        baseURL: window.g.ApiUrl,
        data: {
          pcode: 'level_signal',
        },
      }).then((res) => {
        this.options = res.data.data;
      });
    },
    // 获取预案响应等级列表
    getLevels() {
      this.$http({
        method: 'post',
        url: '/emergency/preparation/preplan/getLevels',
        baseURL: window.g.ApiUrl,
        data: {
          versionId: this.versionId,
          type: 1,
        },
      }).then((res) => {
        const { data } = res.data;
        if (data.length > 0) {
          this.levels = data;
          this.levelIds = data[0].id;
          this.emtlevelID = data[0].eventLevelId;
          this.Leveldefault();
        } else {
          this.levels = [];
          this.isShowRight = false;
        }
      });
    },
    // 获取事件等级
    eventLevel() {
      this.$http({
        method: 'post',
        url: '/emergency/preparation/dictionary/getByParentCode',
        baseURL: window.g.ApiUrl,
        data: {
          pcode: 'emtlevel',
        },
      }).then((res) => {
        this.emtlevelData = res.data.data;
      });
    },
    // 响应参数获取
    getParams() {
      if (window.g.isYangZhouProject) {
        this.$http({
          method: 'post',
          url: '/emergency/preparation/preplan/getParamsForYangzhou',
          baseURL: window.g.ApiUrl,
          data: {
            id: this.preplanId,
            includingDefault: 1,
          },
        }).then((res) => {
          const { data } = res.data;
          const array = [];
          for (let i = 0; i < data.length; i += 1) {
            if (data[i].type === 3) {
              array.push(data[i]);
            }
          }
          this.parameterData = array;
        });
      } else {
        this.$http({
          method: 'post',
          url: '/emergency/preparation/preplan/getParams',
          baseURL: window.g.ApiUrl,
          data: {
            id: this.preplanId,
            includingDefault: 1,
          },
        }).then((res) => {
          const { data } = res.data;
          const array = [];
          for (let i = 0; i < data.length; i += 1) {
            if (data[i].type === 3) {
              array.push(data[i]);
            }
          }
          this.parameterData = array;
        });
      }
    },
    // 等级信息保存
    levelMsgSave() {
      if (this.name && this.remark && this.signalId && this.emtlevelID) {
        if (this.levelId) { // 修改预案响应等级信息
          this.$http({
            method: 'post',
            url: '/emergency/preparation/preplan/updateLevelInfo',
            baseURL: window.g.ApiUrl,
            data: {
              data: {
                id: this.levelId, // 响应ID
                name: this.name, // 等级名称
                remark: this.remark, // 等级描述
                signalId: this.signalId, // 响应信号ID
                params: this.tableData, // 响应等级参数
                relation: this.relation,
                eventLevelId: this.emtlevelID,
              },
            },
          }).then((res) => {
            if (res) {
              this.$message({
                message: '修改成功',
                type: 'success',
              });
              this.levelId = res.data.data.id;
              this.getLevels();
              this.eventLevel();
              this.pcode();
              this.getParams();
            }
          });
        } else { // 保存预案响应等级信息
          this.$http({
            method: 'post',
            url: '/emergency/preparation/preplan/addLevelInfo',
            baseURL: window.g.ApiUrl,
            data: {
              data: {
                name: this.name, // 等级名称
                remark: this.remark, // 等级描述
                versionId: this.versionId, // 预案版本ID
                signalId: this.signalId, // 响应信号ID
                type: 1, // 响应类型
                params: this.tableData, // 响应等级参数
                relation: this.relation,
                eventLevelId: this.emtlevelID,
              },
            },
          }).then((res) => {
            if (res) {
              this.$message({
                message: '保存成功',
                type: 'success',
              });
              this.levelId = res.data.data.id;
              this.getLevels();
              this.eventLevel();
              this.pcode();
              this.getParams();
            }
          });
        }
      } else {
        this.$message({
          message: '名称、响应信号、事件等级、描述必填！！',
          type: 'warning',
        });
      }
    },
    prev() {
      this.$emit('refprev');
    },
    next() {
      this.$emit('refreshList');
    },
    // 设置响应参数
    parameterSetting(data) {
      if (data.tableData === undefined) {
        this.tableData = [];
      } else {
        this.tableData = data.tableData;
      }
      if (data.relation === undefined) {
        this.relation = '';
      } else {
        this.relation = data.relation;
      }
    },
    // 点击设置响应参数按钮
    openResponse() {
      this.$nextTick(() => {
        this.$refs.responseRef.responseclear(this.tableData);
      });
    },
    // el-tabs的点击
    clickTabs(tab) {
      if (tab.label === '行动方案') {
        this.getLevelProcessList(); // 获取流程列表
      }
    },
    // --- 流程 ---
    // 增加流程步骤
    addNewProcess() {
      this.processName = ''; // 流程名称
      this.processContent = ''; // 流程内容
      this.processId = ''; // 流程id
      this.taskList = []; // 任务列表
      this.taskName = ''; // 任务名称
      this.taskContent = ''; // 任务内容
      this.taskId = ''; // 任务id
      this.list1 = []; // 负责人
      this.list2 = []; // 成员
      this.list3 = []; // 抄送
    },
    // 点击流程步骤
    clickProcess(id) {
      this.processId = id;
      this.getDefaultProcess();
    },
    // 拿第一个流程或当前点击流程
    getDefaultProcess() {
      this.$http({
        method: 'post',
        url: '/emergency/preparation/preplan/getLevelProcessDetail',
        baseURL: window.g.ApiUrl,
        data: {
          processId: this.processId,
        },
      }).then((res) => {
        this.processName = res.data.data.name;
        this.processContent = res.data.data.content;
        this.getLevelProcessTaskList(); // 拿流程下的任务
      });
    },
    // 拿流程下的任务
    getLevelProcessTaskList() {
      if (this.processId) {
        this.$http({
          method: 'post',
          url: '/emergency/preparation/preplan/getLevelProcessTaskList',
          baseURL: window.g.ApiUrl,
          data: {
            processId: this.processId,
          },
        }).then((res) => {
          this.taskList = res.data.data || [];
          if (this.taskList.length) {
            this.taskId = this.taskList[0].id;
            this.getLevelProcessTaskDetails(); // 当前任务详情
          }
        });
      }
    },
    // 当前任务详情
    getLevelProcessTaskDetails() {
      this.$http({
        method: 'post',
        url: '/emergency/preparation/preplan/getLevelProcessTaskDetail',
        baseURL: window.g.ApiUrl,
        data: {
          taskId: this.taskId,
          emergencyResponseFlag: 1,
        },
      }).then((res) => {
        const { data } = res.data;
        this.taskName = data.name;
        this.taskContent = data.content;
        this.list1 = []; // 负责人
        this.list2 = []; // 成员
        this.list3 = []; // 抄送
        data.responsePerson.forEach((e) => {
          const a = [];
          const b = [];
          if (e.managerTypes) {
            e.managerTypes.forEach((ee) => {
              if (ee.emergencyStation === 467) {
                a.push(ee);
              } else b.push(ee);
            });
          }
          this.list1.push({
            name: e.name,
            id: e.id,
            forSaveId: e.appPreplanStructId,
            groupResponsibleTypeList: a,
            groupContactorTypeList: b,
          });
        });
        data.members.forEach((e) => {
          const a = [];
          const b = [];
          if (e.managerTypes) {
            e.managerTypes.forEach((ee) => {
              if (ee.emergencyStation === 467) {
                a.push(ee);
              } else b.push(ee);
            });
          }
          this.list2.push({
            name: e.name,
            id: e.id,
            forSaveId: e.appPreplanStructId,
            groupResponsibleTypeList: a,
            groupContactorTypeList: b,
          });
        });
        data.cc.forEach((e) => {
          const a = [];
          const b = [];
          if (e.managerTypes) {
            e.managerTypes.forEach((ee) => {
              if (ee.emergencyStation === 467) {
                a.push(ee);
              } else b.push(ee);
            });
          }
          this.list3.push({
            name: e.name,
            id: e.id,
            forSaveId: e.appPreplanStructId,
            groupResponsibleTypeList: a,
            groupContactorTypeList: b,
          });
        });
      });
    },
    // 保存流程
    saveProcess() {
      if (!this.processName || !this.processContent) {
        this.$message({
          message: '名称、内容必填！',
          type: 'warning',
        });
        return;
      }
      if (this.processId) { // 修改流程
        this.$http({
          method: 'post',
          url: '/emergency/preparation/preplan/updateLevelProcess',
          baseURL: window.g.ApiUrl,
          data: {
            data: {
              id: this.processId, // 流程ID
              name: this.processName, // 流程名称
              content: this.processContent, // 流程内容
            },
          },
        }).then((res) => {
          if (res) {
            this.$message({
              message: '修改成功',
              type: 'success',
            });
            this.getLevelProcessList();
          }
        });
      } else { // 新增流程
        if (this.levelId === '') {
          this.$message({
            message: '请先完成等级信息！',
            type: 'warning',
          });
          return;
        }
        this.$http({
          method: 'post',
          url: '/emergency/preparation/preplan/addLevelProcess',
          baseURL: window.g.ApiUrl,
          data: {
            data: {
              levelId: this.levelId, // 响应等级ID
              name: this.processName, // 流程名称
              content: this.processContent, // 流程内容
            },
          },
        }).then((res) => {
          if (res) {
            this.$message({
              message: '保存成功',
              type: 'success',
            });
            this.getLevelProcessList();
          }
        });
      }
    },
    // 获取流程列表
    getLevelProcessList() {
      this.taskName = ''; // 任务名称
      this.taskContent = ''; // 任务内容
      this.taskId = ''; // 任务id
      this.list1 = []; // 负责人
      this.list2 = []; // 成员
      this.list3 = []; // 抄送
      this.isShowTask = false;
      if (this.levelId) {
        this.$http({
          method: 'post',
          url: '/emergency/preparation/preplan/getLevelProcessList',
          baseURL: window.g.ApiUrl,
          data: {
            levelId: this.levelId,
          },
        }).then((res) => {
          const { data } = res.data;
          if (data.length === 0) {
            this.processList = [];
            this.processName = '';
            this.processContent = '';
            this.taskList = [];
          } else {
            this.processList = data;
            this.processId = data[0].id;
            this.getDefaultProcess();
          }
        });
      }
    },
    // 删除流程
    deleteLevelProcess() {
      if (this.processId === '') {
        this.$message({
          message: '请选中流程再删除！',
          type: 'warning',
        });
        return;
      }
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$http({
          method: 'post',
          url: '/emergency/preparation/preplan/deleteLevelProcess',
          baseURL: window.g.ApiUrl,
          data: {
            id: this.processId,
          },
        }).then((res) => {
          if (res) {
            this.$message({
              message: '已删除',
              type: 'success',
            });
            this.getLevelProcessList();
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      });
    },
    // --- 任务 ---
    // 新增任务内容
    addNewTask() {
      if (this.processId === '') {
        this.$message({
          message: '请保存流程再新增任务！',
          type: 'warning',
        });
        return;
      }
      this.taskName = ''; // 任务名称
      this.taskContent = ''; // 任务内容
      this.taskId = ''; // 任务id
      this.list1 = []; // 负责人
      this.list2 = []; // 成员
      this.list3 = []; // 抄送
    },
    // 保存任务
    saveTask() {
      if (!this.taskName || !this.taskContent || !this.list1.length) {
        this.$message({
          message: '名称、内容、人员必填！',
          type: 'warning',
        });
        return;
      }
      const a1 = [];
      const a2 = [];
      const a3 = [];
      this.list1.forEach((e) => {
        let s = '';
        e.groupResponsibleTypeList.forEach((ee) => {
          s += `${ee.id},`;
        });
        e.groupContactorTypeList.forEach((ee) => {
          s += `${ee.id},`;
        });
        a1.push({
          appPreplanStructId: e.forSaveId,
          managerTypeIds: s,
        });
      });
      this.list2.forEach((e) => {
        let s = '';
        e.groupResponsibleTypeList.forEach((ee) => {
          s += `${ee.id},`;
        });
        e.groupContactorTypeList.forEach((ee) => {
          s += `${ee.id},`;
        });
        a2.push({
          appPreplanStructId: e.forSaveId,
          managerTypeIds: s,
        });
      });
      this.list3.forEach((e) => {
        let s = '';
        e.groupResponsibleTypeList.forEach((ee) => {
          s += `${ee.id},`;
        });
        e.groupContactorTypeList.forEach((ee) => {
          s += `${ee.id},`;
        });
        a3.push({
          appPreplanStructId: e.forSaveId,
          managerTypeIds: s,
        });
      });
      if (this.taskId) { // 修改
        this.$http({
          method: 'post',
          url: '/emergency/preparation/preplan/updateLevelProcessTask',
          baseURL: window.g.ApiUrl,
          data: {
            data: {
              id: this.taskId,
              processId: this.processId,
              name: this.taskName,
              content: this.taskContent,
              attachments: [],
              responsiblePerson: a1,
              members: a2,
              cc: a3,
            },
          },
        }).then((res) => {
          if (res) {
            this.$message({
              message: '修改成功',
              type: 'success',
            });
            this.getLevelProcessTaskList();
          }
        });
      } else { // 新增
        this.$http({
          method: 'post',
          url: '/emergency/preparation/preplan/addLevelProcessTask',
          baseURL: window.g.ApiUrl,
          data: {
            data: {
              id: this.taskId,
              processId: this.processId,
              name: this.taskName,
              content: this.taskContent,
              attachments: [],
              responsiblePerson: a1,
              members: a2,
              cc: a3,
            },
          },
        }).then((res) => {
          if (res) {
            this.$message({
              message: '保存成功',
              type: 'success',
            });
            this.taskId = res.data.data.taskId; // 新增得到的任务id
            this.getLevelProcessTaskList();
          }
        });
      }
    },
    // 点击获取流程任务详细信息
    clickTask(id) {
      this.taskId = id;
      this.getLevelProcessTaskDetails();
    },
    // 删除任务流程
    deleteLevelProcessTask() {
      if (this.taskId === '') {
        this.$message({
          message: '请选中任务再删除！',
          type: 'warning',
        });
        return;
      }
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$http({
          method: 'post',
          url: '/emergency/preparation/preplan/deleteLevelProcessTask',
          baseURL: window.g.ApiUrl,
          data: {
            id: this.taskId,
          },
        }).then((res) => {
          if (res) {
            this.$message({
              message: '已删除',
              type: 'success',
            });
            this.getLevelProcessTaskList();
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      });
    },
    openForm5Dialog(i) {
      this.arrWillGivenToWhich = i;
      if (this.arrWillGivenToWhich === 0) this.hasPick = this.list1; // 负责人
      if (this.arrWillGivenToWhich === 1) this.hasPick = this.list2; // 成员
      if (this.arrWillGivenToWhich === 2) this.hasPick = this.list3; // 抄送
      this.$nextTick(() => {
        this.$refs.Form5DialogRef.init(this.hasPick);
      });
    },
    handleForm5Dialog(arr) {
      if (this.arrWillGivenToWhich === 0) this.list1 = arr; // 负责人
      if (this.arrWillGivenToWhich === 1) this.list2 = arr; // 成员
      if (this.arrWillGivenToWhich === 2) this.list3 = arr; // 抄送
    },
    deleteImg(flag, item, itemone, list, i) {
      const a = list.filter((e) => e.id === item.id);
      if (a.length) {
        if (flag === 467) { // 在组的应急负责人列表里删itemone
          a[0].groupResponsibleTypeList = a[0].groupResponsibleTypeList.filter((e) => e.id !== itemone.id);
        }
        if (flag === 468) { // 在组的应急联络人列表里删itemone
          a[0].groupContactorTypeList = a[0].groupContactorTypeList.filter((e) => e.id !== itemone.id);
        }
        if (!a[0].groupResponsibleTypeList.length
        && !a[0].groupContactorTypeList.length) {
          list = list.filter((e) => e.id !== item.id);
        }
      }
      // this.arrWillGivenToWhich = i;
      // this.$nextTick(() => {
      //   this.$refs.Form5DialogRef.deleteImgFromOut(flag, item, itemone, list);
      // });
    },
  },
};
</script>

<style scoped>
.back {
  display: flex;
  height: 72vh;
  overflow: auto;
  position: relative;
}
.footer {
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;
  position: relative;
  background: #fff;
  box-shadow: 0px 3px 10px 2px rgba(54, 121, 225, 0.09);
  border-radius: 0px 0px 4px 4px;
}
.left {
  width: 24%;
  height: 72vh;
  overflow: auto;
  position: relative;
  background: #fff;
  box-shadow: 0px 3px 10px 2px rgba(54, 121, 225, 0.09);
  border-radius: 4px 4px 0px 0px;
  margin: 0 10px 0 0;
}
.right {
  position: relative;
  width: 76%;
  height: 72vh;
  overflow: auto;
  background: #fff;
  box-shadow: 0px 3px 10px 2px rgba(54, 121, 225, 0.09);
  border-radius: 4px 4px 0px 0px;
}
.leftItemStyle {
  padding: 8px 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.leftItemStyle:hover {
  background: rgba(0, 145, 255, 0.05);
  border-left: 2px solid rgba(0, 145, 255, 1);
}
.saveButton {
  text-align: center;
}
.rightInput {
  width: 100%;
}
.headStyle {
  display: flex;
  padding: 0 0 0 20px;
}
.stepInlineStyle {
  display: flex;
  justify-content: space-evenly;
}
.stepStyle {
  position: relative;
  display: flex;
  align-items: center;
}
.doing {
  width: 30px;
  height: 30px;
  text-align: center;
  cursor: pointer;
  border-radius: 50%;
  color: rgba(0, 145, 255, 1);
  border: 1px solid rgba(0, 145, 255, 1);
  line-height: 30px;
}
.line {
  width: 62px;
  height: 1px;
  background: rgba(0, 145, 255, 1);
}
.flowStyle {
  padding: 10px 20px 0 20px;
}
.rightStyle {
  display: flex;
}
.leftDialogStyle {
  position: relative;
  width: 28%;
  height: 48vh;
  overflow: auto;
  border: 1px solid rgba(221, 221, 221, 1);
  margin: 0px 10px 20px 20px;
}
.rightDialogStyle {
  position: relative;
  width: 68%;
  height: 48vh;
  overflow: auto;
  padding: 0 20px;
}
.headerStyle {
  display: flex;
  justify-content: space-between;
  background: #FBFCFF;
  border-bottom: 1px solid #DDDDDD;
  padding: 8px 20px;
  align-items: center;
}
.notHeadLineWithClose {
  width: 100%;
  padding: 10px;
  background: rgba(241, 244, 246, 0.6);
  font-weight: 550;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.deleteImg {
  width: 17px;
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 10px;
}
.listItem {
  padding: 0px 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.grayStyle1 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 14px;
  background: #EAEAEA;
  border-radius: 4px 4px 0px 0px;
  font-weight: 550;
}
.grayStyle2 {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 20px;
  background: #EAEAEA;
  border-radius: 4px 4px 0px 0px;
  font-weight: 550;
  position: relative;
}
.padd1 {
  padding: 28px 188px 0 188px;
  text-align: right;
}
.taskLine {
  padding: 0 0 0 14px;
  background: #F1F4F6;
  cursor: pointer;
  margin: 0px 20px 14px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.block {
  width: 42px;
  height: 42px;
  background: #E6ECF0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  flex-direction: row;
}
.taskHead {
  font-size: 16px;
  font-weight: 550;
  color: #333333;
}
.headerDown {
  cursor: pointer;
  transform: rotate(180deg);
  transition: all .3s;
}
.headerDownReset {
  cursor: pointer;
  transform: rotate(0deg);
  transition: all .3s;
}
.vline {
  width: 1px;
  height: 17px;
  background: #CCCCCC;
  position: absolute;
  right: 76px;
}
.typeBack {
  background: #F5FAFF;
  border: 1px solid #9DBEFF;
  margin: 10px 0;
  position: relative;
}
</style>
