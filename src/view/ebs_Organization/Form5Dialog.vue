<template>
  <el-dialog
    title="人员选择"
    center
    class="sbs-dialog"
    width="48%"
    :visible.sync="isVisible"
    :close-on-click-modal="false"
  >
    <div class="flex">
      <div class="frame">
        <div class="headLine">
          专项指挥部
        </div>
        <div
          class="overFlow"
          style="height: 47vh;"
        >
          <div class="notHeadLine">
            领导小组
          </div>
          <div
            v-for="itemone in positionList"
            :key="itemone.id"
            :class="currChoose === itemone ? 'listItemChoosed' : 'listItem'"
            @click.stop="handlePositionClick(itemone)"
          >
            {{ itemone.name }}
          </div>
          <div class="notHeadLine">
            成员单位
          </div>
          <div
            v-for="itemtwo in unitList"
            :key="itemtwo.id"
            :class="currChoose === itemtwo ? 'listItemChoosed' : 'listItem'"
            @click.stop="handleUnitClick(itemtwo)"
          >
            {{ itemtwo.name }}
          </div>
        </div>
      </div>
      <div class="frame">
        <div class="headLine">
          部门成员
        </div>
        <!-- 点了领导小组 -->
        <div
          v-if="isUnit === 'lead'"
          class="overFlow"
        >
          <div
            v-for="item in currChoose.children || []"
            :key="item.id"
          >
            <div class="notHeadLine">
              {{ item.name }}
            </div>
            <div v-if="item.groupContactorEmergencyType.indexOf('467') !== -1">
              <div class="blueText">
                <div
                  v-if="item.managerTypeAndResponse"
                  :class="hasChoose.has(`${item.groupId}467`) ? 'checkBoxChoose' : 'checkBox'"
                  @click.stop="reset(item),
                               select(1, 467, { id: currChooseId, name: currChooseName, groupId: currChooseGroupId })"
                />
                应急负责人
              </div>
              <div
                v-for="itemthree in item.managerTypeAndResponse"
                :key="itemthree.id"
              >
                <div class="blueText">
                  <div
                    v-if="itemthree.malicontactorList.length"
                    :class="hasChoose.has(`${item.groupId}${itemthree.id}`) ? 'checkBoxChoose' : 'checkBox'"
                    @click.stop="reset(item),
                                 select(0, 467, itemthree)"
                  />
                  {{ itemthree.name }}
                </div>
                <div
                  v-for="itemone in itemthree.malicontactorList"
                  :key="itemone.id"
                  class="listItem"
                >
                  {{ itemone.name }}（{{ itemone.workUnit }}/{{ itemone.position }}）
                </div>
              </div>
            </div>
            <div v-if="item.groupContactorEmergencyType.indexOf('468') !== -1">
              <div class="blueText">
                <div
                  v-if="item.managerTypeAndContactor"
                  :class="hasChoose.has(`${item.groupId}468`) ? 'checkBoxChoose' : 'checkBox'"
                  @click.stop="reset(item),
                               select(1, 468, { id: currChooseId, name: currChooseName, groupId: currChooseGroupId })"
                />
                应急联络人
              </div>
              <div
                v-for="itemthree in item.managerTypeAndContactor"
                :key="itemthree.id"
              >
                <div class="blueText">
                  <div
                    v-if="itemthree.malicontactorList.length"
                    :class="hasChoose.has(`${item.groupId}${itemthree.id}`) ? 'checkBoxChoose' : 'checkBox'"
                    @click.stop="reset(item),
                                 select(0, 468, itemthree)"
                  />
                  {{ itemthree.name }}
                </div>
                <div
                  v-for="itemtwo in itemthree.malicontactorList"
                  :key="itemtwo.id"
                  class="listItem"
                >
                  {{ itemtwo.name }}（{{ itemtwo.workUnit }}/{{ itemtwo.position }}）
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 点了成员单位 -->
        <div
          v-else
          class="overFlow"
        >
          <div class="notHeadLine">
            {{ currChooseName }}
          </div>
          <div class="notHeadLine">
            <div
              v-if="list1.length"
              :class="hasChoose.has(`${currChooseId}467`) ? 'checkBoxChoose' : 'checkBox'"
              @click.stop="select(1, 467, { id: currChooseId, name: currChooseName, groupId: currChooseGroupId })"
            />
            应急负责人
          </div>
          <div
            v-for="item in list1"
            :key="item.id"
          >
            <div class="blueText">
              <div
                v-if="item.malicontactorList"
                :class="hasChoose.has(`${currChooseId}${item.id}`) ? 'checkBoxChoose' : 'checkBox'"
                @click.stop="select(0, 467, item)"
              />
              {{ item.name }}
            </div>
            <div
              v-for="itemone in item.malicontactorList"
              :key="itemone.id"
              class="listItem"
            >
              {{ itemone.name }}（{{ itemone.workUnit }}/{{ itemone.position }}）
            </div>
          </div>
          <div class="notHeadLine">
            <div
              v-if="list2.length"
              :class="hasChoose.has(`${currChooseId}468`) ? 'checkBoxChoose' : 'checkBox'"
              @click.stop="select(1, 468, { id: currChooseId, name: currChooseName, groupId: currChooseGroupId })"
            />
            应急联络人
          </div>
          <div
            v-for="item in list2"
            :key="item.id"
          >
            <div class="blueText">
              <div
                v-if="item.malicontactorList"
                :class="hasChoose.has(`${currChooseId}${item.id}`) ? 'checkBoxChoose' : 'checkBox'"
                @click.stop="select(0, 468, item)"
              />
              {{ item.name }}
            </div>
            <div
              v-for="itemone in item.malicontactorList"
              :key="itemone.id"
              class="listItem"
            >
              {{ itemone.name }}（{{ itemone.workUnit }}/{{ itemone.position }}）
            </div>
          </div>
        </div>
        <div
          class="bottomLine"
        >
          <el-button
            type="text"
            class="sbs-button"
            @click="isUnit === '' ? selectAll(false) : selectAllLead(false)"
          >
            取消全选
          </el-button>
          <el-button
            type="text"
            class="sbs-button"
            @click="isUnit === '' ? selectAll(true) : selectAllLead(true)"
          >
            全选
          </el-button>
        </div>
      </div>
      <div class="frame">
        <div class="headLine">
          已选人员
        </div>
        <div class="overFlow">
          <div
            v-for="item in chooseList"
            :key="item.id"
          >
            <div
              class="notHeadLineWithClose"
              @mouseover="currHover = item"
              @mouseleave="currHover = ''"
            >
              {{ item.name }}
              <img
                v-show="currHover === item"
                src="/static/img/reversePlan/close.svg"
                class="deleteImg"
                @click="deleteImg(469, item, { id: currChooseId, name: currChooseName, groupId: currChooseGroupId })"
              >
            </div>
            <section v-if="item.groupResponsibleTypeList.length">
              <div style="position: relative;">
                <div class="sbs-title">
                  应急负责人
                </div>
              </div>
              <div
                v-for="itemone in item.groupResponsibleTypeList"
                :key="itemone.id"
                @mouseover="currHover = itemone"
                @mouseleave="currHover = ''"
              >
                <div class="blueTextWithClose">
                  {{ itemone.name }}
                  <img
                    v-show="currHover === itemone"
                    src="/static/img/reversePlan/close.svg"
                    class="deleteImg"
                    @click="deleteImg(467, item, itemone)"
                  >
                </div>
                <div
                  v-for="itemin in itemone.malicontactorList"
                  :key="itemin.id"
                  class="listItem"
                >
                  {{ itemin.name }}（{{ itemin.workUnit }}/{{ itemin.position }}）
                </div>
              </div>
            </section>
            <section v-if="item.groupContactorTypeList.length">
              <div style="position: relative;">
                <div class="sbs-title">
                  应急联络人
                </div>
              </div>
              <div
                v-for="itemone in item.groupContactorTypeList"
                :key="itemone.id"
                @mouseover="currHover = itemone"
                @mouseleave="currHover = ''"
              >
                <div class="blueTextWithClose">
                  {{ itemone.name }}
                  <img
                    v-show="currHover === itemone"
                    src="/static/img/reversePlan/close.svg"
                    class="deleteImg"
                    @click="deleteImg(468, item, itemone)"
                  >
                </div>
                <div
                  v-for="itemin in itemone.malicontactorList"
                  :key="itemin.id"
                  class="listItem"
                >
                  {{ itemin.name }}（{{ itemin.workUnit }}/{{ itemin.position }}）
                </div>
              </div>
            </section>
          </div>
        </div>
        <div class="bottomLine">
          已选{{ chooseList.length }}
          <el-button
            type="text"
            class="sbs-button"
            @click="hasChoose.clear(), chooseList = []"
          >
            全部清空
          </el-button>
        </div>
      </div>
    </div>
    <div class="bottom">
      <el-button
        type="plain"
        class="sbs-button"
        @click="isVisible = false"
      >
        取消
      </el-button>
      <el-button
        type="primary"
        class="sbs-button"
        @click="handleCommit"
      >
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      isVisible: false, // 是否开窗
      versionId: 0, // 预案版本id
      isUnit: '', // 左边点的是啥
      positionList: [], // 领导小组左
      unitList: [], // 成员单位左
      currChoose: { children: [] }, // 左边点了什么
      currChooseId: 0, // 左边点了什么id
      currChooseName: '', // 左边点了什么通讯录组
      currChooseGroupId: 0, // 左边点了什么组id
      forSaveId: 0, // 先叫这个
      currHover: '', // 右边点了什么
      chooseList: [], // 右边
      hasChoose: new Map(), // 右边
      list1: [], // 当前currChooseId得到的groupResponsibleTypeList
      list2: [], // 当前currChooseId得到的groupContactorTypeList
    };
  },
  methods: {
    init(arr) {
      // 获取预案版本ID
      this.versionId = Number(sessionStorage.getItem('preplanVersionId'));
      // 初始化
      this.currChooseId = 0;
      this.currChooseName = '';
      this.isVisible = true;
      this.chooseList = [];
      this.hasChoose = new Map();
      this.list1 = [];
      this.list2 = [];
      this.currChooseGroupId = 0;
      this.forSaveId = 0;
      this.currChoose = { children: [] };
      return new Promise((r) => {
        if (arr.length) {
          arr.forEach((e) => {
            this.handleUnitClick(e).then(() => {
              this.currChoose = e;
              this.currChooseId = e.groupId;
              this.currChooseName = e.name;
              this.currChooseGroupId = e.groupId;
              this.forSaveId = e.forSaveId || e.id;
              if (e.groupResponsibleTypeList.length) {
                e.groupResponsibleTypeList.forEach((ee) => {
                  this.select(0, 467, ee);
                });
              }
              if (e.groupContactorTypeList.length) {
                e.groupContactorTypeList.forEach((ee) => {
                  this.select(0, 468, ee);
                });
              }
            });
          });
        }
        const promiseArr = [];
        const p1 = new Promise((resolve) => {
          // 领导小组
          this.$http({
            method: 'get',
            url: `${window.SITE_CONFIG.baseUrl}/mail/mailgroup/getGroupResponseAndContactor`,
            params: {
              versionId: this.versionId, // 版本
              structType: 1, // 1是专项
              type: 1, // 领导小组
              dataStructFlag: 1,
            },
          }).then((res) => {
            if (res.data.data) {
              this.positionList = res.data.data; // 职务
              resolve();
            }
          });
        });
        promiseArr.push(p1);
        const p2 = new Promise((resolve) => {
          // 成员单位
          this.$http({
            method: 'get',
            url: `${window.SITE_CONFIG.baseUrl}/mail/mailgroup/getGroupResponseAndContactor`,
            params: {
              versionId: this.versionId, // 版本
              structType: 1, // 1是专项
              type: 2, // 领导小组
              dataStructFlag: 1,
            },
          }).then((res) => {
            if (res.data.data) {
              this.unitList = res.data.data; // 成员单位
              resolve();
            }
          });
        });
        promiseArr.push(p2);
        Promise.all(promiseArr).then(() => {
          r();
        });
      });
    },
    // 领导小组
    handlePositionClick(item) {
      this.isUnit = 'lead';
      this.currChoose = item;
      this.currChooseId = item.id;
      this.currChooseName = item.name;
      this.currChooseGroupId = item.groupId || '';
      this.forSaveId = item.id;
    },
    // 成员单位
    handleUnitClick(item) {
      const promise = new Promise((resolve) => {
        this.isUnit = '';
        this.currChoose = item;
        this.currChooseId = item.groupId;
        this.currChooseName = item.name;
        this.currChooseGroupId = item.groupId;
        this.forSaveId = item.forSaveId || item.id;
        console.log(this.forSaveId, '组id', item);
        this.$http({
          method: 'post',
          url: `${window.SITE_CONFIG.baseUrl}/mail/mailgroup/getGroupManageEventTypeAndPeople`,
          data: {
            Ids: [item.groupId || item.id],
            preplandVersionId: this.versionId,
            filterManagerType: 1,
          },
        }).then((res) => {
          if (res.data.errorcode === 0) {
            this.list1 = res.data.data[0].groupResponsibleTypeList;
            this.list2 = res.data.data[0].groupContactorTypeList;
            resolve();
          }
        });
      });
      return promise;
    },
    /*
    如果是成员单位
    存储进chooseList的结构：
    {
      最左组名    this.currChooseName
      最左组id    this.currChooseId
      groupResponsibleTypeList [
        {
          name 成员单位
          id 成员单位
          groupId 成员单位 死存就行，不要处理
          malicontactorList 死存就行，不要处理
        }
      ]
      groupContactorTypeList 同上
    }
    如果是领导小组
    存储进chooseList的结构：
    {
      最左组名    this.currChooseName
      最左组id    this.currChooseId
      groupResponsibleTypeList 对应 managerTypeAndResponse [
        {
          name 成员单位
          id 成员单位
          groupId 成员单位 = id 死存就行，不要处理
          malicontactorList 死存就行，不要处理
        }
      ]
      groupContactorTypeList 对应 managerTypeAndContactor 同上
    }
    ==================
    存储进hasChoose的结构：
    勾单个item
    {
      String(最左组id + item的id)
      item整个对象放入
    }
    勾this.currChooseId的应急负责人
    {
      String(最左组id + 467)
      item整个对象放入
    }
    并且挨个this.list1做【单个item】标记
    勾this.currChooseId的应急联络人
    {
      String(最左组id + 468)
      item整个对象放入
    }
    并且挨个this.list2做【单个item】标记
     */
    select(all, flag, item) {
      let a = this.chooseList.filter((e) => e.id === this.currChooseId);
      if (a.length) {
        // a已在里面
      } else {
        this.chooseList.push({
          name: this.currChooseName,
          id: this.currChooseId,
          groupId: this.currChooseGroupId,
          groupResponsibleTypeList: [],
          groupContactorTypeList: [],
          forSaveId: this.forSaveId,
        });
        a = this.chooseList.filter((e) => e.id === this.currChooseId);
      }
      if (all === 0) {
        if (flag === 467) {
          if (this.hasChoose.has(`${this.currChooseId}${item.id}`)) {
            this.hasChoose.delete(`${this.currChooseId}${item.id}`);
            a[0].groupResponsibleTypeList = a[0].groupResponsibleTypeList.filter((e) => e.id !== item.id);
          } else {
            this.hasChoose.set(`${this.currChooseId}${item.id}`, item);
            a[0].groupResponsibleTypeList.push(item);
          }
          if (a[0].groupResponsibleTypeList.length === this.list1.length) {
            if (!this.hasChoose.has(`${this.currChooseId}467`)) {
              this.hasChoose.set(`${this.currChooseId}467`, { id: this.currChooseId, name: this.currChooseName, groupId: this.currChooseGroupId });
            }
          } else {
            if (this.hasChoose.has(`${this.currChooseId}467`)) {
              this.hasChoose.delete(`${this.currChooseId}467`);
            }
          }
        }
        if (flag === 468) {
          if (this.hasChoose.has(`${this.currChooseId}${item.id}`)) {
            this.hasChoose.delete(`${this.currChooseId}${item.id}`);
            a[0].groupContactorTypeList = a[0].groupContactorTypeList.filter((e) => e.id !== item.id);
          } else {
            this.hasChoose.set(`${this.currChooseId}${item.id}`, item);
            a[0].groupContactorTypeList.push(item);
          }
          if (a[0].groupContactorTypeList.length === this.list2.length) {
            if (!this.hasChoose.has(`${this.currChooseId}468`)) {
              this.hasChoose.set(`${this.currChooseId}468`, { id: this.currChooseId, name: this.currChooseName, groupId: this.currChooseGroupId });
            }
          } else {
            if (this.hasChoose.has(`${this.currChooseId}468`)) {
              this.hasChoose.delete(`${this.currChooseId}468`);
            }
          }
        }
      }
      if (all === 1) {
        if (flag === 467) {
          if (this.hasChoose.has(`${this.currChooseId}467`)) {
            this.hasChoose.delete(`${this.currChooseId}467`);
            a[0].groupResponsibleTypeList = [];
            // 并且挨个this.list1做【单个item】标记
            // 删除情况：e在hasChoose，删去，否则不做操作
            this.list1.forEach((e) => {
              if (this.hasChoose.has(`${this.currChooseId}${e.id}`)) {
                this.hasChoose.delete(`${this.currChooseId}${e.id}`);
              }
            });
          } else {
            this.hasChoose.set(`${this.currChooseId}467`, item);
            a[0].groupResponsibleTypeList = this.list1;
            // 并且挨个this.list1做【单个item】标记
            // 添加情况：e不在hasChoose，加入，否则不做操作
            this.list1.forEach((e) => {
              if (!this.hasChoose.has(`${this.currChooseId}${e.id}`)) {
                this.hasChoose.set(`${this.currChooseId}${e.id}`, e);
              }
            });
          }
        }
        if (flag === 468) {
          if (this.hasChoose.has(`${this.currChooseId}468`)) {
            this.hasChoose.delete(`${this.currChooseId}468`);
            a[0].groupContactorTypeList = [];
            // 并且挨个this.list2做【单个item】标记
            // 删除情况：e在hasChoose，删去，否则不做操作
            this.list2.forEach((e) => {
              if (this.hasChoose.has(`${this.currChooseId}${e.id}`)) {
                this.hasChoose.delete(`${this.currChooseId}${e.id}`);
              }
            });
          } else {
            this.hasChoose.set(`${this.currChooseId}468`, item);
            a[0].groupContactorTypeList = this.list2;
            // 并且挨个this.list2做【单个item】标记
            // 添加情况：e不在hasChoose，加入，否则不做操作
            this.list2.forEach((e) => {
              if (!this.hasChoose.has(`${this.currChooseId}${e.id}`)) {
                this.hasChoose.set(`${this.currChooseId}${e.id}`, e);
              }
            });
          }
        }
      }
      // 如果下面没有任何item还要把this.currChooseId从chooseList删去
      if (!a[0].groupResponsibleTypeList.length
      && !a[0].groupContactorTypeList.length) {
        this.chooseList = this.chooseList.filter((e) => e.id !== this.currChooseId);
        if (this.hasChoose.has(`${this.currChooseId}467`)) {
          this.hasChoose.delete(`${this.currChooseId}467`);
          // 并且挨个this.list1做【单个item】标记
          // 删除情况：e在hasChoose，删去，否则不做操作
          this.list1.forEach((e) => {
            if (this.hasChoose.has(`${this.currChooseId}${e.id}`)) {
              this.hasChoose.delete(`${this.currChooseId}${e.id}`);
            }
          });
        }
        if (this.hasChoose.has(`${this.currChooseId}468`)) {
          this.hasChoose.delete(`${this.currChooseId}468`);
          // 并且挨个this.list2做【单个item】标记
          // 删除情况：e在hasChoose，删去，否则不做操作
          this.list2.forEach((e) => {
            if (this.hasChoose.has(`${this.currChooseId}${e.id}`)) {
              this.hasChoose.delete(`${this.currChooseId}${e.id}`);
            }
          });
        }
      }
    },
    // 全选相当于同时勾应急负责人和应急联络人
    // flag=true，且不在hasChoose里，可勾选
    // flag=true，且在hasChoose里，不做操作
    // flag=false，且在hasChoose里，可踢出去
    // flag=false，且不在hasChoose里，不做操作
    selectAll(flag) {
      let a = this.chooseList.filter((e) => e.id === this.currChooseId);
      if (a.length) {
        // a已在里面
      } else {
        this.chooseList.push({
          name: this.currChooseName,
          id: this.currChooseId,
          groupId: this.currChooseGroupId,
          groupResponsibleTypeList: [],
          groupContactorTypeList: [],
          forSaveId: this.forSaveId,
        });
        a = this.chooseList.filter((e) => e.id === this.currChooseId);
      }
      // 对于应急负责人
      if (flag && !this.hasChoose.has(`${this.currChooseId}467`)) {
        this.hasChoose.set(`${this.currChooseId}467`, { id: this.currChooseId, name: this.currChooseName, groupId: this.currChooseGroupId });
        a[0].groupResponsibleTypeList = this.list1;
        // 添加情况：e不在hasChoose，加入，否则不做操作
        this.list1.forEach((e) => {
          if (!this.hasChoose.has(`${this.currChooseId}${e.id}`)) {
            this.hasChoose.set(`${this.currChooseId}${e.id}`, e);
          }
        });
      } else if (!flag && this.hasChoose.has(`${this.currChooseId}467`)) {
        this.hasChoose.delete(`${this.currChooseId}467`);
        a[0].groupResponsibleTypeList = [];
        // 删除情况：e在hasChoose，删去，否则不做操作
        this.list1.forEach((e) => {
          if (this.hasChoose.has(`${this.currChooseId}${e.id}`)) {
            this.hasChoose.delete(`${this.currChooseId}${e.id}`);
          }
        });
      }
      // 对于应急联络人
      if (flag && !this.hasChoose.has(`${this.currChooseId}468`)) {
        this.hasChoose.set(`${this.currChooseId}468`, { id: this.currChooseId, name: this.currChooseName, groupId: this.currChooseGroupId });
        a[0].groupContactorTypeList = this.list2;
        // 添加情况：e不在hasChoose，加入，否则不做操作
        this.list2.forEach((e) => {
          if (!this.hasChoose.has(`${this.currChooseId}${e.id}`)) {
            this.hasChoose.set(`${this.currChooseId}${e.id}`, e);
          }
        });
      } else if (!flag && this.hasChoose.has(`${this.currChooseId}468`)) {
        this.hasChoose.delete(`${this.currChooseId}468`);
        a[0].groupContactorTypeList = [];
        // 删除情况：e在hasChoose，删去，否则不做操作
        this.list2.forEach((e) => {
          if (this.hasChoose.has(`${this.currChooseId}${e.id}`)) {
            this.hasChoose.delete(`${this.currChooseId}${e.id}`);
          }
        });
      }
      // 取消全选还要把this.currChooseId从chooseList删去
      if (!flag) {
        this.chooseList = this.chooseList.filter((e) => e.id !== this.currChooseId);
      }
    },
    selectAllLead(flag) {
      // 如果是点的领导小组，要对职责下面每个组遍历，挨个reset然后save
      if (this.isUnit === 'lead') {
        this.currChoose.children.forEach((item) => {
          this.reset(item);
          this.selectAll(flag);
        });
      }
    },
    // 删除
    // 0 删this.currChooseId
    // 1 删具体的item
    deleteImg(flag, item, itemone) {
      this.handleUnitClick(item).then(() => {
        let a = this.chooseList.filter((e) => e.id === this.currChooseId);
        if (a.length) {
        // a已在里面
        } else {
          this.chooseList.push({
            name: this.currChooseName,
            id: this.currChooseId,
            groupId: this.currChooseGroupId,
            groupResponsibleTypeList: [],
            groupContactorTypeList: [],
            forSaveId: this.forSaveId,
          });
          a = this.chooseList.filter((e) => e.id === this.currChooseId);
        }
        if (flag === 467) { // 在组的应急负责人列表里删itemone
          if (this.hasChoose.has(`${this.currChooseId}${itemone.id}`)) {
            this.hasChoose.delete(`${this.currChooseId}${itemone.id}`);
            a[0].groupResponsibleTypeList = a[0].groupResponsibleTypeList.filter((e) => e.id !== itemone.id);
          }
        }
        if (flag === 468) { // 在组的应急联络人列表里删itemone
          if (this.hasChoose.has(`${this.currChooseId}${itemone.id}`)) {
            this.hasChoose.delete(`${this.currChooseId}${itemone.id}`);
            a[0].groupContactorTypeList = a[0].groupContactorTypeList.filter((e) => e.id !== itemone.id);
          }
        }
        // 如果下面没有任何item还要把this.currChooseId从chooseList删去
        if (!a[0].groupResponsibleTypeList.length) {
          if (this.hasChoose.has(`${this.currChooseId}467`)) {
            this.hasChoose.delete(`${this.currChooseId}467`);
            // 并且挨个this.list1做【单个item】标记
            // 删除情况：e在hasChoose，删去，否则不做操作
            this.list1.forEach((e) => {
              if (this.hasChoose.has(`${this.currChooseId}${e.id}`)) {
                this.hasChoose.delete(`${this.currChooseId}${e.id}`);
              }
            });
          }
        }
        if (!a[0].groupContactorTypeList.length) {
          if (this.hasChoose.has(`${this.currChooseId}468`)) {
            this.hasChoose.delete(`${this.currChooseId}468`);
            // 并且挨个this.list2做【单个item】标记
            // 删除情况：e在hasChoose，删去，否则不做操作
            this.list2.forEach((e) => {
              if (this.hasChoose.has(`${this.currChooseId}${e.id}`)) {
                this.hasChoose.delete(`${this.currChooseId}${e.id}`);
              }
            });
          }
        }
        if (!a[0].groupResponsibleTypeList.length
        && !a[0].groupContactorTypeList.length) {
          this.chooseList = this.chooseList.filter((e) => e.id !== this.currChooseId);
        }
        if (flag === 469) { // 整组删除
          this.selectAll(false);
        }
      });
    },
    // 确定
    handleCommit() {
      if (this.chooseList.length === 0) {
        this.$message({
          message: '不能保存空组',
          type: 'error',
        });
        return;
      }
      this.isVisible = false;
      this.$emit('refresh', this.chooseList);
    },
    deleteImgFromOut(flag, item, itemone, list) {
      this.init(list).then(() => {
        this.deleteImg(flag, item, itemone);
      });
    },
    // 如果是领导小组数据要整理去配合成员单位
    reset(item) {
      this.currChooseId = item.groupId;
      this.currChooseName = item.name;
      this.currChooseGroupId = item.groupId || '';
      this.list1 = item.managerTypeAndResponse;
      this.list2 = item.managerTypeAndContactor;
      this.forSaveId = item.id;
      console.log(this.forSaveId, '组id');
    },
  },
};
</script>

<style scoped>
.flex {
  display: flex;
  justify-content: space-evenly;
}
.frame {
  border: 1px solid #DDDDDD;
  width: 31%;
  margin: 20px 0;
}
.headLine {
  width: 100%;
  padding: 10px;
  background: #FBFCFF;
  border-bottom: 1px solid #DDDDDD;
}
.bottomLine {
  width: 100%;
  padding: 0 10px;
  background: #FBFCFF;
  border-top: 1px solid #DDDDDD;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.overFlow {
  height: 44vh;
  overflow: auto;
}
.notHeadLine {
  width: 100%;
  padding: 10px;
  background: rgba(241, 244, 246, 0.6);
  font-weight: 550;
  display: flex;
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
.blueText {
  color: rgba(0, 145, 255, 1);
  display: flex;
  align-items: center;
  padding: 10px;
}
.blueTextWithClose {
  color: rgba(0, 145, 255, 1);
  display: flex;
  align-items: center;
  padding: 10px;
  justify-content: space-between;
}
.listItem {
  padding: 7px 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.listItemWithClose {
  padding: 7px 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.deleteImg {
  width: 17px;
  height: 17px;
  cursor: pointer;
}
.listItemChoosed {
  padding: 7px 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  background: rgba(63, 146, 254, 0.05);
}
.bottom {
  border-top: 1px solid #E9ECF1;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 15px 10px;
}
.checkBox {
  margin-right: 9px;
  width: 16px;
  height: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #A6ADB4;
}
.checkBoxChoose {
  margin-right: 9px;
  width: 16px;
  height: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 145, 255, 1);
}
.checkBoxChoose::before {
  content: "✓";
  color: #fff;
}
</style>
