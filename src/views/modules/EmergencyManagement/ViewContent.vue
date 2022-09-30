<!--
 * @Author: yanghaohao
 * @Date: 2021-02-03 15:06:23
 * @LastEditTime: 2021-03-09 13:21:08
 * @LastEditors: Please set LastEditors
 * @Description: 查看应急专家
 * @FilePath: /SBS/src/views/modules/EmergencyManagement/ViewContent.vue
-->

<template>
  <div :class="$style.expert">
    <sv-dialog
      ref="dialog"
      title="查看应急专家"
      @cancel="$refs.dialog.visible = false"
      @modal="$refs.dialog.visible = false"
      @confirm="$refs.dialog.visible = false"
    >
      <el-form
        label-width="100px"
        :class="$style.ruleForm"
      >
        <el-form-item
          label="头像:"
          prop="picPath"
        >
          <sv-upload-img
            v-model="expertTreeList.imgList"
            :is-view="true"
          />
        </el-form-item>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item
              label="姓名:"
              prop="name"
            >
              {{ expertTreeList.name }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="手机号码:"
              prop="moblie"
            >
              {{ expertTreeList.phone }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item
              label="专家组:"
              prop="expertGroup"
            >
              {{ expertTreeList.groupName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="办公电话:"
              prop="phone"
            >
              {{ expertTreeList.officePhone }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item
              label="专家分类:"
              prop="expertGroup"
            >
              {{ expertTreeList.teamTypeName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="工作单位:"
              prop="workPlace"
            >
              {{ expertTreeList.workUnit }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item
              label="职务:"
              prop="work"
            >
              {{ expertTreeList.duty }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="主管单位:"
              prop="manage"
            >
              {{ expertTreeList.managerUnit }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item
              label="数据来源部门:"
              prop="statics"
            >
              {{ expertTreeList.datasource }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="专业类别:"
              prop="perform"
            >
              {{ expertTreeList.majorType }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item
              label="职称:"
              prop="position"
            >
              {{ expertTreeList.dutyName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="应急分类:"
              prop="classify"
            >
              {{ expertTreeList.emergencyName }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item
              label="所属区域:"
              prop="area"
            >
              {{ expertTreeList.areaName }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="重要成果:">
          {{ expertTreeList.achievements }}
        </el-form-item>
        <el-form-item label="专业领域:">
          {{ expertTreeList.majorArea }}
        </el-form-item>
        <el-form-item label="应急工作简历:">
          {{ expertTreeList.emergencyResume }}
        </el-form-item>
        <el-form-item label="工作简历描述:">
          {{ expertTreeList.workResume }}
        </el-form-item>
        <el-form-item label="备注:">
          {{ expertTreeList.remark }}
        </el-form-item>
        <el-form-item label="关联设备:">
        </el-form-item>
        <div :class="$style.backDiv">
          <div
            v-for="(item,idx) in deviceTextArr"
            :key="idx"
            :class="$style.outDiv"
          >
            <div
              v-for="(item1, idx1) in showDeviceData[item]"
              :key="idx1"
              :class="$style.showDevice"
            >
              <div :class="$style.type">
                {{ deviceObj[JSON.parse(item1).type] }}
              </div>
              <div :class="$style.deviceName">
                <span :title="JSON.parse(item1).name">{{ JSON.parse(item1).name }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-form>
    </sv-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      expertTreeList: [], // 专家树
      deviceObj: {
        0: '监控视频',
        1: '会场终端',
        2: '集群终端',
        // 3: 'WeComm',
        4: 'APP终端',
      },
      deviceTypeObj: {
        0: 'monitor',
        1: 'room',
        2: 'colony',
        // 3: 'wecomm',
        4: 'app',
      },
      deviceTextArr: [
        'monitor',
        'room',
        'colony',
        // 'wecomm',
        'app',
      ],
      showDeviceData: {
        monitor: [],
        room: [],
        colony: [],
        // wecomm: [],
        app: [],
      },
    };
  },
  methods: {
  /**
   * @description: 初始化弹窗
   */
    init(id, platformIds) {
      this.showDeviceData = {
        monitor: [],
        room: [],
        colony: [],
        // wecomm: [],
        app: [],
      };
      this.$refs.dialog.visible = true;
      this.$http({
        url: this.$http.adornUrl(`/resoure/resourexpert/info/${id}`),
        method: 'get',
        params: this.$http.adornParams({
          platformId: platformIds,
        }),
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.expertTreeList = data.data;
            data.data.resources.forEach((item) => {
              const typeChange = parseInt(item.type, 10) - 9;
              const arrType = this.deviceTypeObj[typeChange];
              item.data.forEach((item1) => {
                const o = {};
                o.id = item1.entity.id;
                o.name = item1.entity.name;
                o.type = typeChange;
                this.showDeviceData[arrType].push(JSON.stringify(o));
              });
            });
          } else {
            this.$message.error(data.msg);
          }
        });
    },
  },
};
</script>
<style lang="scss" module>
.expert {
  .ruleForm {
    padding: 20px 20px 0px 10px;
    width: 700px;
    .expertTree {
      width: 300px;
      display: flex;
      flex-direction: column;
    }
  }
}
.backDiv {
  margin-left: 20px;
  background: #f2f2f2;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #d5d5d5;
    border-radius: 5px;
  }
  &::-webkit-scrollbar-corner {
    background: transparent;
  }
}
.outDiv {
  margin-top: -2px;
  .showDevice {
    display: flex;
    height: 30px;
    line-height: 30px;
    margin: 5px;
    .type {
      width: 25%;
      text-align: center;
      border: 1px dashed #0091ff;
      padding: 0px 5px;
    }
    .deviceName {
      width: 75%;
      padding-left: 10px;
      color: #0091ff;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
