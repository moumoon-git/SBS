<template>
  <div>
    <div class="back">
      <div class="left">
        <div class="leftTop">
          <div class="sbs-title">
            领导小组
          </div>
          <img
            src="/static/img/reversePlan/leaderTeam.svg"
            style="width: 26px; cursor: pointer;"
            @click="form3AddPosition"
          >
        </div>
        <div
          v-for="itemone in positionList"
          :key="itemone.id"
        >
          <div class="positionStyle">
            {{ itemone.name }}
            <el-button
              type="text"
              class="sbs-button"
              style="padding: 0;"
              @click="form3AddPerson(itemone)"
            >
              添加人员
            </el-button>
          </div>
          <div
            v-for="itemtwo in itemone.children"
            :key="itemtwo.id"
            class="closeAndItemStyle"
          >
            <div style="width: 100%;">
              <div v-if="itemtwo.groupContactorEmergencyType.indexOf('467') !== -1">
                <div
                  v-for="itemthree in itemtwo.managerTypeAndResponse"
                  :key="itemthree.id"
                  class="typeBack"
                >
                  <div
                    v-if="itemthree.malicontactorList.length > 0"
                    style="width: 88%;"
                  >
                    <div
                      v-for="item in itemthree.malicontactorList"
                      :key="item.id"
                      class="leftItemStyle"
                      :style="currentLeftLeader === item ? 'color: #0091FF;' : ''"
                      @click="handleLeftLeaderClick(item, itemone)"
                    >
                      {{ item.name }}（{{ item.workUnit }}/{{ item.position }}）
                    </div>
                  </div>
                  <div
                    v-else
                    class="leftItemStyle"
                  >
                    暂无人员
                  </div>
                  <img
                    src="/static/img/reversePlan/close.svg"
                    style="width:20px;cursor: pointer;position: absolute;right: 10px;top: 7px;"
                    @click="deleteLeadaer(itemthree, itemtwo)"
                  >
                </div>
              </div>
              <div v-if="itemtwo.groupContactorEmergencyType.indexOf('468') !== -1">
                <div
                  v-for="itemthree in itemtwo.managerTypeAndContactor"
                  :key="itemthree.id"
                  class="typeBack"
                >
                  <div
                    v-if="itemthree.malicontactorList.length > 0"
                    style="width: 88%;"
                  >
                    <div
                      v-for="item in itemthree.malicontactorList"
                      :key="item.id"
                      class="leftItemStyle"
                      :style="currentLeftLeader === item ? 'color: #0091FF;' : ''"
                      @click="handleLeftLeaderClick(item, itemone)"
                    >
                      {{ item.name }}（{{ item.workUnit }}/{{ item.position }}）
                    </div>
                  </div>
                  <div
                    v-else
                    class="leftItemStyle"
                  >
                    暂无人员
                  </div>
                  <img
                    src="/static/img/reversePlan/close.svg"
                    style="width:20px;cursor: pointer;position: absolute;right: 10px;top: 7px;"
                    @click="deleteLeadaer(itemthree, itemtwo)"
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="leftTop">
          <div class="sbs-title">
            成员单位
          </div>
          <img
            src="/static/img/reversePlan/memberUnit.svg"
            style="width: 20px; cursor: pointer;"
            @click="form3AddUnit"
          >
        </div>
        <div
          v-for="(itemthree, indexthree) in unitLeftList"
          :key="itemthree.id"
          class="leftItemStyle"
          :style="currentLeftUnit === itemthree ? 'color: #0091FF;' : ''"
          @click="handleUnitClick(itemthree)"
        >
          {{ itemthree.name }}
          <div>
            <i
              class="el-icon-caret-top"
              @click.stop="upFun(indexthree,unitLeftList)"
            />
            <i
              class="el-icon-caret-bottom"
              @click.stop="downFun(indexthree,unitLeftList)"
            />
            <img
              src="/static/img/reversePlan/close.svg"
              style="width: 20px; cursor: pointer;"
              @click.stop="deleteLeftUnit(itemthree)"
            >
          </div>
        </div>
      </div>
      <div class="right">
        <div class="leftDialogStyle">
          <div>
            <div class="sbs-title">
              应急职责
            </div>
          </div>
          <el-input
            v-if="isUnit"
            v-model="currentLeftUnit.remark"
            type="textarea"
            :rows="6"
            :disabled="!isUnit || !currentLeftUnit"
          />
          <el-input
            v-else
            v-model="dutyContent"
            type="textarea"
            :rows="6"
            disabled
          />
          <section v-if="isUnit">
            <div class="leftTop">
              <div class="sbs-title">
                应急岗位
              </div>
              <el-button
                type="text"
                class="sbs-button"
                :disabled="!currentLeftUnit"
                @click="openEventType"
              >
                设置
              </el-button>
            </div>
            <div
              v-for="(itemone, indexone) in [{ name: '应急负责人' }, { name: '应急联络人' }]"
              :key="indexone"
            >
              <div class="positionStyle">
                {{ itemone.name }}
              </div>
              <div v-if="itemone.name === '应急负责人'">
                <div
                  v-for="(item, i) in rightManage"
                  :key="i"
                  class="leftItemStyle"
                >
                  {{ item.name }}（{{ item.workUnit }}/{{ item.position }}）
                </div>
              </div>
              <div v-else>
                <div
                  v-for="(item, i) in rightContact"
                  :key="i"
                  class="leftItemStyle"
                >
                  {{ item.name }}（{{ item.workUnit }}/{{ item.position }}）
                </div>
              </div>
            </div>
          </section>
        </div>
        <div class="saveButton">
          <el-button
            type="primary"
            class="sbs-button"
            @click="editUnitSave"
          >
            保存
          </el-button>
        </div>
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

    <Crud
      ref="Crud"
      @refreshEventTypeDataList="init"
    />
    <Form3AddPerson
      ref="Form3AddPersonRef"
      @refresh="handleForm3AddPerson"
    />
    <Form3AddPosition
      ref="Form3AddPositionRef"
      @refresh="handleForm3AddPosition"
    />
    <Form3AddUnit
      ref="Form3AddUnitRef"
      @refresh="handleForm3AddUnit"
    />
  </div>
</template>

<script>
import Crud from '@/views/modules/sys/mailList/mailList-tree-new-crud.vue';
import Form3AddPerson from './Form3AddPerson.vue';
import Form3AddPosition from './Form3AddPosition.vue';
import Form3AddUnit from './Form3AddUnit.vue';

export default {
  components: {
    Crud,
    Form3AddPerson,
    Form3AddPosition,
    Form3AddUnit,
  },
  data() {
    return {
      positionList: [],
      unitLeftList: [],
      versionId: '',
      dutyContent: '',
      rightManage: [],
      rightContact: [],
      isUnit: false,
      currentPosition: '', // 当前点击职位
      currentLeftLeader: '', // 当前点击领导
      currentLeftUnit: '', // 当前点击单位
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    prev() {
      this.$emit('refprev');
    },
    next() {
      if (this.positionList.length === 0) {
        this.$message({
          message: '未设置领导小组，创建专项指挥部失败！',
          type: 'error',
        });
      } else if (this.unitLeftList.length === 0) {
        this.$message({
          message: '未设置成员单位，创建专项指挥部失败！',
          type: 'error',
        });
      } else {
        this.$emit('refreshList');
      }
    },
    form3AddPerson(itemone) {
      this.currentPosition = itemone;
      const a = [];
      if (itemone.children) {
        itemone.children.forEach((e) => {
          a.push({
            name: e.name,
            id: e.groupId,
            groupResponsibleTypeList: e.managerTypeAndResponse,
            groupContactorTypeList: e.managerTypeAndContactor,
            remark: e.remark,
          });
        });
      }
      this.$refs.Form3AddPersonRef.init(itemone.name, a);
    },
    form3AddPosition() {
      this.$refs.Form3AddPositionRef.init(1);
    },
    form3AddUnit() {
      const a = [];
      if (this.unitLeftList) {
        this.unitLeftList.forEach((e) => {
          a.push({
            name: e.name,
            id: e.groupId || e.id,
            groupResponsibleTypeList: e.managerTypeAndResponse || e.groupResponsibleTypeList,
            groupContactorTypeList: e.managerTypeAndContactor || e.groupContactorTypeList,
            remark: e.remark,
          });
        });
      }
      this.$refs.Form3AddUnitRef.init('成员单位', a);
    },
    init() {
      this.currentPosition = '';
      this.currentLeftLeader = '';
      this.currentLeftUnit = '';
      this.isUnit = true;
      this.rightManage = [];
      this.rightContact = [];
      this.dutyContent = '';
      this.versionId = Number(sessionStorage.getItem('preplanVersionId')); // 获取预案版本ID
      // 获取默认职务列表
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
        }
      });
      // 成员单位列表
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
          this.unitLeftList = res.data.data; // 成员单位
          if (res.data.data.length) this.handleUnitClick(res.data.data[0]);
        }
      });
    },
    // 领导小组-点一行
    handleLeftLeaderClick(item, itemone) {
      this.isUnit = false;
      this.currentPosition = itemone;
      this.currentLeftLeader = item;
      this.dutyContent = itemone.remark;
    },
    // 领导小组-删除
    deleteLeadaer(item, groupItem) {
      this.$http({
        method: 'post',
        url: '/emergency/preparation/preplan/deleteManagerType',
        baseURL: window.g.ApiUrl,
        data: {
          structId: groupItem.id,
          managerTypeId: item.id,
          emergencyStation: item.emergencyStation,
        },
      }).then((res) => {
        if (res.data.code === 0 || res.data.errorcode === 0) {
          this.$message({
            message: '删除成功！',
            type: 'success',
          });
          this.init();
        }
      });
    },
    /**
      * @desc 上移
      * @param {}
      * @returns {}
    */
    upFun(index, arr) {
      if (index !== 0) {
        arr[index] = arr.splice(index - 1, 1, arr[index])[0];
      } else {
        arr.push(arr.shift());
      }
      this.$http({
        method: 'post',
        url: '/emergency/preparation/preplan/orderAppPrePlan',
        baseURL: window.g.ApiUrl,
        data: {
          versionId: this.versionId,
          groupIds: arr.map((e) => e.id),
        },
      }).then((res) => {
      });
    },
    /**
      * @desc 下移
      * @param {}
      * @returns {}
    */
    downFun(index, arr) {
      if (index !== arr.length - 1) {
        arr[index] = arr.splice(index + 1, 1, arr[index])[0];
      } else {
        arr.unshift(arr.splice(index, 1)[0]);
      }
      this.$http({
        method: 'post',
        url: '/emergency/preparation/preplan/orderAppPrePlan',
        baseURL: window.g.ApiUrl,
        data: {
          versionId: this.versionId,
          groupIds: arr.map((e) => e.id),
        },
      }).then((res) => {
      });
    },
    // 成员单位-页面左下-点一行
    handleUnitClick(item) {
      this.isUnit = true;
      this.currentLeftUnit = item;
      this.rightManage = [];
      this.rightContact = [];
      this.dutyContent = item.remark;
      const e = item;
      e.groupResponsibleTypeList = e.managerTypeAndResponse || e.groupResponsibleTypeList;
      e.groupContactorTypeList = e.managerTypeAndContactor || e.groupContactorTypeList;
      if (e.groupResponsibleTypeList) {
        e.groupResponsibleTypeList.forEach((ee) => {
          if (ee.malicontactorList) {
            ee.malicontactorList.forEach((eee) => {
              this.rightManage.push(eee);
            });
          }
        });
      }
      if (e.groupContactorTypeList) {
        e.groupContactorTypeList.forEach((ee) => {
          if (ee.malicontactorList) {
            ee.malicontactorList.forEach((eee) => {
              this.rightContact.push(eee);
            });
          }
        });
      }
    },
    // 成员单位-页面左下-删除
    deleteLeftUnit(item) {
      this.$http({
        method: 'post',
        url: '/emergency/preparation/preplan/deleteStruct',
        baseURL: window.g.ApiUrl,
        data: {
          id: item.id, // 删除删id
        },
      }).then((res) => {
        if (res.data.code === 0 || res.data.errorcode === 0) {
          this.$message({
            message: '成员单位删除成功！',
            type: 'success',
          });
          this.init();
        }
      });
    },
    // 打开设置窗
    openEventType() {
      if (this.currentLeftUnit) {
        this.$nextTick(() => {
          this.$refs.Crud.isDisabled = false;
          this.$refs.Crud.init(this.currentLeftUnit.groupId);
        });
      } else {
        this.$message({
          message: '请先选中一个成员单位',
          type: 'error',
        });
      }
    },
    // 把选出来的人给领导小组保存
    handleForm3AddPerson(arr) {
      const a = [];
      arr.forEach((e) => {
        let s1 = '';
        let s2 = '';
        e.groupResponsibleTypeList.forEach((ee) => {
          s1 += `${ee.id},`;
        });
        e.groupContactorTypeList.forEach((ee) => {
          s2 += `${ee.id},`;
        });
        a.push({
          versionId: this.versionId, // 版本id
          pid: this.currentPosition.id, // 职责id226167
          name: e.name, // 组名
          groupId: e.id, // 组id2028
          structType: 1, // 专项
          type: 1, // 班子
          groupContactorEmergencyType:
          e.groupResponsibleTypeList.length && !e.groupContactorTypeList.length ? '467'
            : !e.groupResponsibleTypeList.length && e.groupContactorTypeList.length ? '468'
              : e.groupResponsibleTypeList.length && e.groupContactorTypeList.length ? '467,468'
                : '', // 负责和联络
          remark: '', // 暂无，不传
          contactorManagerTypeIds: s2,
          responesibleManagerTypeIds: s1,
        });
      });
      this.$http({
        url: `${window.g.ApiUrl}/emergency/preparation/preplan/batchUpdateStruct`,
        method: 'post',
        data: {
          data: a,
        },
      }).then((res) => {
        if (res.data.errorcode === 0) {
          this.$message({
            message: '保存成功！',
            type: 'success',
          });
          this.init();
        }
      });
    },
    handleForm3AddPosition() {
      this.init();
    },
    handleForm3AddUnit(arr) {
      const a = [];
      arr.forEach((e) => {
        let s1 = '';
        let s2 = '';
        e.groupResponsibleTypeList.forEach((ee) => {
          s1 += `${ee.id},`;
        });
        e.groupContactorTypeList.forEach((ee) => {
          s2 += `${ee.id},`;
        });
        a.push({
          versionId: this.versionId, // 版本id
          pid: 0, // 没用
          name: e.name, // 组名
          groupId: e.id, // 组id2028
          structType: 1, // 专项
          type: 2, // 成员单位
          groupContactorEmergencyType:
          e.groupResponsibleTypeList.length && !e.groupContactorTypeList.length ? '467'
            : !e.groupResponsibleTypeList.length && e.groupContactorTypeList.length ? '468'
              : e.groupResponsibleTypeList.length && e.groupContactorTypeList.length ? '467,468'
                : '', // 负责和联络
          remark: (e.remark || ''),
          contactorManagerTypeIds: s2,
          responesibleManagerTypeIds: s1,
        });
      });
      this.$http({
        url: `${window.g.ApiUrl}/emergency/preparation/preplan/batchUpdateStruct`,
        method: 'post',
        data: {
          data: a,
        },
      }).then((res) => {
        if (res.data.errorcode === 0) {
          this.$message({
            message: '保存成功！',
            type: 'success',
          });
          this.init();
        }
      });
    },
    // 成员单位-页面右下-修改保存
    editUnitSave() {
      if (this.currentLeftUnit === '') {
        this.$message({
          message: '请先选中要修改的单位',
          type: 'error',
        });
        return;
      }
      const e = this.currentLeftUnit;
      if (e.managerTypeAndResponse) e.groupResponsibleTypeList = e.managerTypeAndResponse;
      if (e.managerTypeAndContactor) e.groupContactorTypeList = e.managerTypeAndContactor;
      let s1 = '';
      let s2 = '';
      e.groupResponsibleTypeList.forEach((ee) => {
        s1 += `${ee.id},`;
      });
      e.groupContactorTypeList.forEach((ee) => {
        s2 += `${ee.id},`;
      });
      this.$http({
        method: 'post',
        url: '/emergency/preparation/preplan/updateMultipleGroupStructs',
        baseURL: window.g.ApiUrl,
        data: {
          data: {
            id: this.currentLeftUnit.id, // 自己的id
            versionId: this.versionId,
            name: this.currentLeftUnit.name,
            structType: 1,
            pid: 0,
            type: 2,
            groupId: this.currentLeftUnit.groupId || this.currentLeftUnit.id,
            remark: this.currentLeftUnit.remark,
            groupContactorEmergencyType:
            e.groupResponsibleTypeList.length && !e.groupContactorTypeList.length ? '467'
              : !e.groupResponsibleTypeList.length && e.groupContactorTypeList.length ? '468'
                : e.groupResponsibleTypeList.length && e.groupContactorTypeList.length ? '467,468'
                  : '', // 负责和联络
            contactorManagerTypeIds: s2,
            responesibleManagerTypeIds: s1,
          },
        },
      }).then((res) => {
        if (res.data.code === 0 || res.data.errorcode === 0) {
          this.$message({
            message: '修改成功',
            type: 'success',
          });
          this.init();
        }
      });
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
  padding: 10px;
}
.leftTop {
  display: flex;
  justify-content: space-between;
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
.positionStyle {
  background: #EAEAEA;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 550;
  padding: 10px;
}
.closeAndItemStyle {
  display: flex;
}
.leftItemStyle {
  padding: 6px 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.leftItemStyle:hover {
  background: rgba(0, 145, 255, 0.05);
  border-left: 2px solid rgba(0, 145, 255, 1);
}
.blueTextWithClose {
  color: rgba(0, 145, 255, 1);
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.typeBack {
  background: #F5FAFF;
  border: 1px solid #9DBEFF;
  margin: 10px 0;
  position: relative;
}
.saveButton {
  border-top: 1px solid rgba(221, 221, 221, 1);
  text-align: right;
  padding: 10px 20px 10px 0px;
  position: absolute;
  bottom: 0px;
  width: 100%;
}
.rightInput {
  width: 100%;
}
.leftDialogStyle {
  position: relative;
  height: 66vh;
  padding: 10px;
  overflow: auto;
}
</style>
