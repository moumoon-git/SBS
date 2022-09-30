<template>
  <el-dialog
    :title="title"
    center
    class="sbs-dialog"
    width="48%"
    :visible.sync="isVisible"
    :close-on-click-modal="false"
  >
    <div class="flex">
      <div class="frame">
        <div class="headLine">
          通讯联络网
        </div>
        <div
          class="overFlow"
          style="height: 47vh;"
        >
          <el-tree
            ref="leftTree"
            class="leftTree"
            :filter-node-method="filterNode"
            :data="treeData"
            :props="{
              label: 'name',
              children: 'children',
            }"
            node-key="id"
            :show-checkbox="false"
            :check-strictly="true"
            @node-click="handleUnitClick"
          />
        </div>
      </div>
      <div class="frame">
        <div class="headLine">
          部门成员
        </div>
        <div class="overFlow">
          <div class="notHeadLine">
            <div
              v-if="list1.length"
              :class="hasChoose.has(`${currChooseId}467`) ? 'checkBoxChoose' : 'checkBox'"
              @click.stop="select(1, 467, {})"
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
              @click.stop="select(1, 468, {})"
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
        <div class="bottomLine">
          <el-button
            type="text"
            class="sbs-button"
            @click="selectAll(false)"
          >
            取消全选
          </el-button>
          <el-button
            type="text"
            class="sbs-button"
            @click="selectAll(true)"
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
                @click="deleteImg(469, item, {})"
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
      title: '', // 标题
      isVisible: false, // 是否开窗
      versionId: 0, // 预案版本id
      treeData: [], // 通讯录树
      currChooseId: 0, // 左边点了什么id
      currChooseName: '', // 左边点了什么通讯录组
      currHover: '', // 右边点了什么
      chooseList: [], // 右边
      hasChoose: new Map(), // 右边
      list1: [], // 当前currChooseId得到的groupResponsibleTypeList
      list2: [], // 当前currChooseId得到的groupContactorTypeList
    };
  },
  methods: {
    init(title, arr) {
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
      this.title = `添加${title}`;
      if (arr.length) {
        arr.forEach((e) => {
          this.handleUnitClick(e).then(() => {
            this.currChooseId = e.id;
            this.currChooseName = e.name;
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
      // 通讯录
      this.$http({
        url: this.$http.adornUrl(`/mail/mailgroup/list?platformId=${this.$store.state.user.platformId}`),
        method: 'get',
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.treeData = data.data;
        }
      });
    },
    // 点树
    handleUnitClick(item) {
      const promise = new Promise((resolve) => {
        this.currChooseId = item.id;
        this.currChooseName = item.name;
        this.$http({
          method: 'post',
          url: `${window.SITE_CONFIG.baseUrl}/mail/mailgroup/getGroupManageEventTypeAndPeople`,
          data: {
            Ids: [item.groupId || item.id],
            preplandVersionId: this.versionId,
            // filterManagerType: 1,
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
    存储进chooseList的结构：
    {
      最左组名    this.currChooseName
      最左组id    this.currChooseId
      groupResponsibleTypeList: [
        如果all=0 flag=467 item整个对象放入
        如果all=1 flag=467 this.list1给groupResponsibleTypeList
        如果all=1 flag=469 全选
      ]
      groupContactorTypeList: [
        如果all=0 flag=468 item整个对象放入
        如果all=1 flag=468 this.list2给groupContactorTypeList
        如果all=1 flag=469 全选
      ]
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
          groupResponsibleTypeList: [],
          groupContactorTypeList: [],
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
              this.hasChoose.set(`${this.currChooseId}467`, {});
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
              this.hasChoose.set(`${this.currChooseId}468`, {});
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
          groupResponsibleTypeList: [],
          groupContactorTypeList: [],
        });
        a = this.chooseList.filter((e) => e.id === this.currChooseId);
      }
      // 对于应急负责人
      if (flag && !this.hasChoose.has(`${this.currChooseId}467`)) {
        this.hasChoose.set(`${this.currChooseId}467`, {});
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
        this.hasChoose.set(`${this.currChooseId}468`, {});
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
            groupResponsibleTypeList: [],
            groupContactorTypeList: [],
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
    // 树
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
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
.leftTree >>>.el-tree-node:focus>.el-tree-node__content{
  color: rgba(0, 145, 255, 1);
}
</style>
