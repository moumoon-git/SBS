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
            功能组
          </div>
          <img
            src="/static/img/reversePlan/memberUnit.svg"
            style="width: 20px; cursor: pointer;"
            @click="clearWorkGroup"
          >
        </div>
        <div
          v-for="itemthree in workGroupList"
          :key="itemthree.id"
          class="leftItemStyle"
          :style="currentWorkGroup === itemthree ? 'color: #0091FF;' : ''"
          @click="handleWorkGroupClick(itemthree)"
        >
          {{ itemthree.name }}
          <img
            src="/static/img/reversePlan/close.svg"
            style="width: 20px; cursor: pointer;"
            @click.stop="deleteWorkGroup(itemthree)"
          >
        </div>
      </div>
      <div
        v-if="!isUnit"
        class="right"
        style="padding: 20px;"
      >
        <div>
          <div class="sbs-title">
            应急职责
          </div>
        </div>
        <el-input
          v-model="dutyContent"
          type="textarea"
          :rows="6"
          disabled
        />
      </div>
      <div
        v-else
        class="right"
      >
        <section class="grayStyle">
          编辑功能组
        </section>
        <div class="flowStyle">
          <el-form
            ref="dataForm"
            :model="dataForm"
            label-width="100px"
            :rules="rules"
          >
            <el-form-item
              label="功能组名称"
              prop="workGroupName"
            >
              <el-input
                v-model="dataForm.workGroupName"
                :disabled="isWorkDisable"
              />
            </el-form-item>
            <el-form-item label="功能组职责">
              <el-input
                v-model="dutyContent"
                type="textarea"
                :rows="5"
                :disabled="isWorkDisable"
              />
            </el-form-item>
          </el-form>
        </div>
        <div class="rightStyle">
          <div class="leftDialogStyle">
            <section class="headerStyle">
              <div class="sbs-title">
                成员单位
              </div>
              <el-button
                :disabled="isWorkDisable"
                type="text"
                class="sbs-button"
                @click="form3AddUnit"
              >
                添加
              </el-button>
            </section>
            <div
              v-for="(itemthree, indexthree) in unitLeftList"
              :key="itemthree.id"
              class="leftItemStyle"
              :style="currentLeftUnit === itemthree ? 'color: #0091FF;' : ''"
              @click="handleUnitClick(itemthree)"
            >
              <div>
                {{ itemthree.name }}
                <span
                  v-if="itemthree.leadUnit === 1"
                  class="logo"
                >
                  牵头单位
                </span>
              </div>
              <div>
                <i
                  v-if="!isWorkDisable"
                  class="el-icon-caret-top"
                  @click.stop="upFun(indexthree,unitLeftList)"
                />
                <i
                  v-if="!isWorkDisable"
                  class="el-icon-caret-bottom"
                  @click.stop="downFun(indexthree,unitLeftList)"
                />
                <img
                  v-if="!isWorkDisable"
                  src="/static/img/reversePlan/close.svg"
                  style="width: 20px; cursor: pointer;"
                  @click.stop="deleteLeftUnit(itemthree)"
                >
              </div>
            </div>
          </div>
          <div class="rightDialogStyle">
            <div class="leftTop">
              <div class="sbs-title">
                应急职责
              </div>
              <el-switch
                v-model="isLeaderUnit"
                :disabled="!currentLeftUnit || isWorkDisable"
                active-text="设为牵头单位"
                @change="changeLeaderUnit(currentLeftUnit)"
              />
            </div>
            <el-input
              v-model="currentLeftUnit.remark"
              type="textarea"
              :rows="6"
              :disabled="!currentLeftUnit || isWorkDisable"
            />
            <div class="leftTop">
              <div class="sbs-title">
                应急岗位
              </div>
              <el-button
                type="text"
                class="sbs-button"
                :disabled="!currentLeftUnit || isWorkDisable"
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
          </div>
        </div>
        <div class="saveButton">
          <el-button
            v-if="!isWorkDisable"
            type="plain"
            class="sbs-button"
            @click="isWorkDisable = true"
          >
            取消
          </el-button>
          <el-button
            v-if="!isWorkDisable"
            type="primary"
            class="sbs-button"
            @click="editUnitSave"
          >
            保存
          </el-button>
          <el-button
            v-if="isWorkDisable"
            type="danger"
            class="sbs-button"
            @click="handleGroupDelete"
          >
            删除
          </el-button>
          <el-button
            v-if="isWorkDisable"
            type="primary"
            class="sbs-button"
            @click="isWorkDisable = false"
          >
            修改
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
      dataForm: {
        workGroupName: '',
      },
      rules: {
        workGroupName: [
          { required: true, message: '不能为空', trigger: 'blur' },
        ],
      },
      isLeaderUnit: false, // 牵头单位，接口leadUnit 0非1是
      isWorkDisable: true, // 功能组能否编辑
      workGroupList: [], // 功能组列表
      currentWorkGroup: '', // 当前点击功能组
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
          message: '未设置领导小组，创建现场指挥部失败！',
          type: 'error',
        });
      } else if (this.workGroupList.length === 0) {
        this.$message({
          message: '未设置功能组，创建现场指挥部失败！',
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
      this.$refs.Form3AddPositionRef.init(2);
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
      this.clearWorkGroup();
      this.versionId = Number(sessionStorage.getItem('preplanVersionId')); // 获取预案版本ID
      // 获取默认职务列表
      this.$http({
        method: 'get',
        url: `${window.SITE_CONFIG.baseUrl}/mail/mailgroup/getGroupResponseAndContactor`,
        params: {
          versionId: this.versionId, // 版本
          structType: 2, // 1是专项
          type: 1, // 领导小组
          dataStructFlag: 1,
        },
      }).then((res) => {
        if (res.data.data) {
          this.positionList = res.data.data; // 职务
        }
      });
      // 功能组列表
      this.$http({
        method: 'get',
        url: `${window.SITE_CONFIG.baseUrl}/mail/mailgroup/getGroupResponseAndContactor`,
        params: {
          versionId: this.versionId, // 版本
          structType: 2, // 1是专项
          type: 2, // 领导小组
          dataStructFlag: 1,
        },
      }).then((res) => {
        if (res.data.data) {
          this.workGroupList = res.data.data;
          if (res.data.data.length) this.handleWorkGroupClick(res.data.data[0]);
          this.isWorkDisable = true;
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
    },
    // 成员单位-页面左下-点一行
    handleUnitClick(item) {
      this.isUnit = true;
      this.currentLeftUnit = item;
      this.rightManage = [];
      this.rightContact = [];
      this.isLeaderUnit = (item.leadUnit === 1);
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
          this.$refs.Crud.init(this.currentLeftUnit.groupId || this.currentLeftUnit.id);
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
          structType: 2, // 现场
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
      this.unitLeftList = arr;
      this.handleUnitClick(arr[0]);
    },
    // --------
    // 功能组-新建时清空右边
    clearWorkGroup() {
      this.isUnit = true;
      this.isWorkDisable = false;
      this.dataForm.workGroupName = '';
      this.dutyContent = '';
      this.rightManage = [];
      this.rightContact = [];
      this.unitLeftList = [];
      this.currentWorkGroup = '';
      this.currentLeftUnit = '';
    },
    // 功能组-页面左-点一行
    handleWorkGroupClick(item) {
      this.isUnit = true;
      this.isWorkDisable = true;
      this.dataForm.workGroupName = item.name;
      this.dutyContent = item.remark;
      this.rightManage = [];
      this.rightContact = [];
      this.unitLeftList = item.children;
      this.currentWorkGroup = item;
      this.currentLeftUnit = '';
      if (item.children.length) this.handleUnitClick(item.children[0]);
    },
    // 功能组-页面左-删除
    deleteWorkGroup(item) {
      this.$http({
        method: 'post',
        url: '/emergency/preparation/preplan/deleteStruct',
        baseURL: window.g.ApiUrl,
        data: {
          id: item.id,
        },
      }).then((res) => {
        if (res.data.code === 0 || res.data.errorcode === 0) {
          this.$message({
            message: '功能组删除成功！',
            type: 'success',
          });
          this.init();
        }
      });
    },
    // 成员单位-页面右-组和单位-保存
    editUnitSave() {
      this.$refs.dataForm.validate((valid) => {
        if (this.dataForm.workGroupName === '') {
          this.$message({
            message: '功能组名称不能为空!',
            type: 'error',
          });
          return;
        }
        if (valid) {
          const a = [];
          this.unitLeftList.forEach((e) => {
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
            a.push({
              versionId: this.versionId, // 版本id
              pid: 0, // 没用
              name: e.name, // 组名
              groupId: (e.groupId || e.id), // 组id2028
              structType: 2, // 专项
              type: 2, // 成员单位
              groupContactorEmergencyType:
              e.groupResponsibleTypeList.length && !e.groupContactorTypeList.length ? '467'
                : !e.groupResponsibleTypeList.length && e.groupContactorTypeList.length ? '468'
                  : e.groupResponsibleTypeList.length && e.groupContactorTypeList.length ? '467,468'
                    : '', // 负责和联络
              remark: (e.remark || ''),
              contactorManagerTypeIds: s2,
              responesibleManagerTypeIds: s1,
              leadUnit: e.leadUnit || 2,
            });
          });
          // 新增
          if (this.currentWorkGroup === '') {
            this.$http({
              method: 'post',
              url: '/emergency/preparation/preplan/addMultipleGroupStructs',
              baseURL: window.g.ApiUrl,
              data: {
                data: {
                  versionId: this.versionId,
                  name: this.dataForm.workGroupName,
                  structType: 2,
                  pid: 0,
                  type: 2,
                  groupId: '', // 空
                  remark: this.dutyContent,
                  list: a, // 成员单位列
                },
              },
            }).then((res) => {
              if (res.data.code === 0 || res.data.errorcode === 0) {
                this.$message({
                  message: '新增成功',
                  type: 'success',
                });
                this.init();
              }
            });
          } else { // 修改
            this.$http({
              method: 'post',
              url: '/emergency/preparation/preplan/updateMultipleGroupStructs',
              baseURL: window.g.ApiUrl,
              data: {
                data: {
                  id: this.currentWorkGroup.id, // 当前工作组id
                  versionId: this.versionId,
                  name: this.dataForm.workGroupName,
                  structType: 2,
                  pid: 0,
                  type: 2,
                  groupId: '', // 空
                  remark: this.dutyContent,
                  list: a, // 成员单位列
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
          }
        }
      });
    },
    // 设为牵头单位
    changeLeaderUnit(item) {
      this.unitLeftList.forEach((e) => {
        e.leadUnit = 2;
      });
      if (this.isLeaderUnit) item.leadUnit = 1;
    },
    // 功能组-页面右-应急岗位-删除
    handleGroupDelete() {
      if (this.currentWorkGroup === '') {
        this.$message({
          type: 'error',
          message: '请先选中功能组再删除',
        });
        return;
      }
      this.$confirm('是否删除该功能组？', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.deleteWorkGroup(this.currentWorkGroup);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
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
  /* padding: 10px; */
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
.rightStyle {
  display: flex;
}
.leftDialogStyle {
  position: relative;
  width: 28%;
  height: 36vh;
  overflow: auto;
  border: 1px solid rgba(221, 221, 221, 1);
  margin: 0px 10px 20px 20px;
}
.rightDialogStyle {
  position: relative;
  width: 68%;
  height: 36vh;
  overflow: auto;
  border: 1px solid rgba(221, 221, 221, 1);
  padding: 10px 20px;
}
.headerStyle {
  display: flex;
  justify-content: space-between;
  background: #FBFCFF;
  border-bottom: 1px solid #DDDDDD;
  padding: 8px 20px;
  align-items: center;
}
.grayStyle {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 20px;
  background: #EAEAEA;
  border-radius: 4px 4px 0px 0px;
  margin-bottom: 10px;
}
.flowStyle {
  border-bottom: 1px solid rgba(221, 221, 221, 1);
  margin-bottom: 20px;
}
.logo {
  background: #F2B626;
  border-radius: 13px;
  color: #FFFFFF;
  padding: 0px 11px;
}
</style>
