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
      title="查看设备详情"
      @cancel="$refs.dialog.visible = false"
      @confirm="$refs.dialog.visible = false"
    >
      <el-form
        label-width="100px"
        :class="$style.ruleForm"
      >
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item
              label="设备分组:"
              prop="type"
            >
              {{ deviceList.groupName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="设备名称:"
              prop="name"
            >
              {{ deviceList.name }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item
              label="设备编号:"
              prop="code"
            >
              {{ deviceList.code }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="调用编号:"
              prop="number"
            >
              {{ deviceList.number }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item
              label="设备地址:"
              prop="address"
            >
              {{ deviceList.address }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="登录地址:"
              prop="loginUrl"
            >
              {{ deviceList.loginUrl }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item
              label="登录端口:"
              prop="loginPort"
            >
              {{ deviceList.loginPort }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="登录账号:"
              prop="loginUsername"
            >
              {{ deviceList.loginUsername }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item
              label="流媒体地址:"
              prop="streamMediaUrl"
            >
              {{ deviceList.streamMediaUrl }}
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item
              label="是否启用:"
              prop="status"
            >
              {{ deviceList.status == '0' ? '是' : '否' }}
            </el-form-item>
          </el-col> -->
          <el-col :span="12"  v-if="deviceType !== '4'">
            <el-form-item
              label="轨迹订阅:"
              prop="subscription"
            >
              {{ deviceList.subscription == '1' ? '启用' : '关闭' }}
            </el-form-item>
          </el-col>
          <el-col :span="12"  v-if="deviceType !== '4'">
            <el-form-item
              label="软终端类型:"
              prop="softTerminalType"
            >
              {{ deviceList.softTerminalType == '1' ? 'cloud link kit' : 'te mobile' }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item  label="关联对象:" />
        <div :class="$style.backDiv" >
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
  props: {
    deviceType: {
      type: String,
      default: '0',
    }
  },
  data() {
    return {
      deviceList: [], // 专家树
      deviceObj: {
        1: '联系人',
        2: '风险隐患',
        3: '避难场所',
        4: '防护目标',
        5: '应急物资库',
        6: '应急装备库',
        7: '应急队伍',
        8: '应急专家',
      },
      deviceTypeObj: {
        1: 'contact',
        2: 'risk',
        3: 'refuge',
        4: 'protect',
        5: 'goods',
        6: 'equipement',
        7: 'team',
        8: 'expert',
      },
      deviceTextArr: [
        'contact',
        'risk',
        'refuge',
        'protect',
        'goods',
        'equipement',
        'team',
        'expert',
      ],
      showDeviceData: {
        contact: [],
        risk: [],
        refuge: [],
        protect: [],
        goods: [],
        equipement: [],
        team: [],
        expert: [],
      },
    };
  },
  methods: {
    /**
     * @description: 初始化弹窗
     */
    init(id) {
      this.showDeviceData = {
        contact: [],
        risk: [],
        refuge: [],
        protect: [],
        goods: [],
        equipement: [],
        team: [],
        expert: [],
      };
      this.$refs.dialog.visible = true;
      this.$http({
        url: `${window.SITE_CONFIG.cloudUrl}/device/device/appdevice/info/${id}`,
        method: 'get',
        params: this.$http.adornParams(),
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.deviceList = data.data.appDevice;
            data.data.resources.forEach((item) => {
              const arrType = this.deviceTypeObj[item.type];
              item.data.forEach((item1) => {
                const o = {};
                o.id = item1.entity.id;
                o.name = item1.entity.name;
                o.type = item.type;
                this.showDeviceData[arrType].push(JSON.stringify(o));
              });
            });
            console.log('%c [ xxx ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.showDeviceData);
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
    padding: 20px 20px 0 10px;
    width: 800px;
  }
}
.backDiv {
  margin-left: 20px;
  background: #f2f2f2;
  border-radius: 4px;
  overflow: hidden;
  max-height: 250px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    background: transparent;
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d5d5d5;
    border-radius: 5px;
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
