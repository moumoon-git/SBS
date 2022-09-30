<template>
  <div :class="$style.AddDevice">
    <sv-dialog
      ref="svdialog"
      @cancel="closePopup"
      @confirm="submitData"
    >
      <!-- 头部居中 -->
      <template #title>
        <div :class="$style.AddDevicePopupTitle">
          <span v-if="operationFlag==='add'">新增设备</span>
          <span v-else>修改设备</span>
          <span @click="closePopup" />
        </div>
      </template>
      <!-- 内容 -->
      <div :class="$style.AddDevicePopupContent">
        <div v-show="!fullScreenFlag">
          <el-form
            ref="ruleForm"
            :model="ruleForm"
            :rules="formRule"
            label-width="120px"
            class="demo-ruleForm"
          >
            <!-- <el-form-item
              label="标签"
            >

            </el-form-item> -->
            <div :class="$style.label">
              <div style="margin-top:9px;" >标签</div>
              <div :class="$style.labelItem">
                <div :class="$style.addLabel" @click="handleLabel">
                   +
                </div>
                <div :class="$style.labelList">
                  <span v-for="(item,index) in labels" :key="item.id" :class="$style.oneLabel" :style="{'border-color':item.labelStyle}">
                     <span style="z-index:0" :style="{color:item.labelStyle}">
                       {{item.name}}
                      </span>
                     <i class="el-icon-error" :class="$style.delLabel" @click="delLabels(index)"></i>
                  </span>
                </div>
              </div>
            </div>
            <el-form-item
              prop="groupIds"
              label="设备分组"
            >
              <el-cascader
                ref="caseClassId"
                v-model="ruleForm.groupIds"
                :options="deviceTypeArr"
                :props="propsObj"
                clearable
                style="float: left; width: 100%"
                :show-all-levels="false"
                placeholder="请选择设备分组"
              />
            </el-form-item>
            <el-form-item
              prop="name"
              label="设备名称"
            >
              <el-input v-model="ruleForm.name" />
            </el-form-item>
            <el-form-item
              prop="code"
              label="设备编号"
            >
              <el-input v-model="ruleForm.code" />
            </el-form-item>
            <el-form-item
              prop="number"
              label="调用编号"
            >
              <el-input v-model="ruleForm.number" />
            </el-form-item>
            <el-form-item label="设备地址">
              <el-input v-model="ruleForm.address" placeholder="请从右边地图中选择" disabled />
            </el-form-item>
            <el-form-item
              label="经纬度"
              :class="$style.lonlat"
            >
              <el-input
                v-model.number="ruleForm.longitude"
                placeholder="经度"
                disabled
              />
              <el-input
                v-model.number="ruleForm.latitude"
                placeholder="纬度"
                disabled
              />
            </el-form-item>
            <el-form-item label="登录地址" prop="loginUrl">
              <el-input v-model="ruleForm.loginUrl" />
            </el-form-item>
            <el-form-item
              label="登录端口"
              prop="loginPort"
            >
              <el-input v-model="ruleForm.loginPort" />
            </el-form-item>
            <el-form-item label="登录账号" prop="loginUsername">
              <el-input v-model="ruleForm.loginUsername" />
            </el-form-item>
            <el-form-item label="登录密码" prop="loginPassword">
              <el-input
                v-model="ruleForm.loginPassword"
              />
            </el-form-item>
            <el-form-item label="流媒体地址" prop="streamMediaUrl">
              <el-input v-model="ruleForm.streamMediaUrl" />
            </el-form-item>
            <!-- <el-form-item label="是否启用">
              <el-radio-group v-model="ruleForm.status">
                <el-radio-button label="0">
                  是
                </el-radio-button>
                <el-radio-button label="1">
                  否
                </el-radio-button>
              </el-radio-group>
            </el-form-item> -->
            <el-form-item label="轨迹订阅" v-if="deviceType !== '4'">
              <el-radio-group v-model="ruleForm.subscription">
                <el-radio-button label="1">
                  启用
                </el-radio-button>
                <el-radio-button label="0">
                  关闭
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            <!-- <el-form-item
              v-if="deviceFlag === 4"
              label="软终端类型"
              :required="true"
              prop="softTerminalType"
            >
              <el-radio-group v-model="ruleForm.softTerminalType">
                <el-radio :label="0">
                  te mobile
                </el-radio>
                <el-radio :label="1">
                  cloud link kit
                </el-radio>
              </el-radio-group>
            </el-form-item> -->
            <el-form-item
              v-if="deviceType !== '4'"
              label="关联对象"
              :class="$style.addObjectValueParent"
            >
              <!-- <el-button @click="addObjectFun">
                添加
              </el-button> -->
              <el-dropdown
                trigger="click"
                placement="bottom-start"
                @command="handleCommand"
              >
                <el-button
                  plain
                >
                  增加
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-for="(item,key,idx) in deviceObj"
                      :key="idx+key"
                      :command="key"
                    >
                      {{ item }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-form-item>

            <div style="margin-left: 20px" >
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
                  <div
                    :class="$style.showDelete"
                    @click.stop="deleteDevice(item1)"
                  />
                </div>
              </div>
            </div>

            <!-- <el-form-item label="设备关联对象"  v-if="deviceType === '4'">
                {{ `${JSON.parse(showDeviceData.contact[0]).name}`+ "(" + JSON.parse(showDeviceData.contact[0]).phone+')'}}
            </el-form-item> -->

          </el-form>
        </div>
        <div :class="[$style.Location,'add-device-popup-content-location']">
          <div>
            <h6>地点位置</h6>
            <!-- 地图放大 -->
            <span @click="fullScreen" />
          </div>
          <div style="width: 100%;height: 95%">
            <Location
              class="locationAddress"
              :address="ruleForm.address"
              :lng-lat="[ruleForm.longitude, ruleForm.latitude]"
              :cgcsLngLatInit="[ruleForm.cgcsLongitude, ruleForm.cgcsLatitude]"
              @confirm="handleLocationConfirm"
            />
          </div>
        </div>
      </div>
    </sv-dialog>
    <SelectContacts
      ref="SelectContactsEl"
      :dialog-title="deviceTitle"
      @selectedList="getDeviceData"
    />

    <SetLabel v-if="setLabelVisible" ref="setLabel" labelTitle="设置标签" @submitData="submitLabelData" @parentVisible="setLabelVisible=false" v-on="$listeners" />
  </div>
</template>
<script>
import Location from '../GarbageClassification/SiteManagement/ClassificationSite/Location/Location.vue';
import SelectContacts from './selectContacts.vue';
import SetLabel from './SetLabel.vue';

export default {
  components: {
    Location,
    SelectContacts,
    SetLabel,
  },
  props: {
    deviceType: {
      type: String,
      default: '0',
    },
  },
  data() {
    const checkNotCN = (rule, value, callback) => {
      if (/[\u4e00-\u9fa5]/.test(value)) {
        callback(new Error('不能包含中文'));
      } else {
        callback();
      }
    };
    return {
      operationFlag: 'add',
      id: '',
      ruleForm: this.defaultForm(),
      fullScreenFlag: false, // 地图放大
      addObjectValue: '', // 关联对象的值
      deviceTypeArr: [],
      propsObj: {
        value: 'id',
        label: 'name',
        children: 'children',
        checkStrictly: true,
        emitPath: false,
      },
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
      deviceTitle: '',
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
      deviceFlag: '',
      formRule: {
        groupIds: [
          { required: true, message: '请选择设备类型', trigger: ['change', 'blur'] },
        ], // 设备类型
        name: [
          { required: true, message: '设备名称不能为空', trigger: ['change', 'blur'] },
        ], // 设备名称
        code: [
          { required: true, message: '设备编号不能为空', trigger: ['change', 'blur'] },
        ], // 设备编号
        number: [
          { required: true, message: '调用编号不能为空', trigger: ['change', 'blur'] },
        ], // 调用编号
        loginUrl: [{ validator: checkNotCN, trigger: ['change', 'blur'] }],
        loginPort: [{ validator: checkNotCN, trigger: ['change', 'blur'] }],
        loginUsername: [{ validator: checkNotCN, trigger: ['change', 'blur'] }],
        loginPassword: [{ validator: checkNotCN, trigger: ['change', 'blur'] }],
        streamMediaUrl: [{ validator: checkNotCN, trigger: ['change', 'blur'] }],
      },
      labels: [], // 所有标签
      setLabelVisible: false, // 设置标签弹窗
    };
  },
  watch: {
    showDeviceData: {
      handler(newVal) {
        this.showDeviceData = newVal;
      },
      deep: true,
    },
    operationFlag: {
      handler(newVal) {
        this.operationFlag = newVal;
      },
      deep: true,
    },
  },
  methods: {
    // 加载弹窗
    loadingPopup() {
      if (this.$refs.svdialog) {
        this.$refs.svdialog.visible = true;
      } else {
        setTimeout(() => {
          this.loadingPopup();
        }, 200);
      }
    },
    defaultForm() {
      return {
        groupIds: '', // 设备类型
        name: '', // 设备名称
        code: '', // 设备编号
        number: '', // 调用编号
        address: '', // 设备地址
        longitude: '', // 经纬度
        latitude: '', //
        loginUrl: '', // 登录地址
        loginPort: '', // 登录端口
        loginUsername: '', // 登录账号
        loginPassword: '', // 登录密码
        streamMediaUrl: '', // 流媒体地址
        status: '1',
        subscription: '0', // 轨迹定位
        cgcsLatitude: '',
        cgcsLongitude: '',
        // softTerminalType: 0, // 软终端类型
      };
    },
    init(type, row, flag) {
      this.operationFlag = type;
      this.deviceFlag = parseInt(flag, 10);
      this.getDeviceGroupList();
      this.id = row.id;
      // this.ruleForm = row;
      // this.ruleForm.type = String(row.type);
      if (type !== 'add') {
        const request = {
          method: 'post',
          url: `/device/device/appdevice/info/${row.id}`,
          baseURL: window.SITE_CONFIG.cloudUrl,
        };
        this.$http(request)
          .then(({ data }) => {
            if (data.code === 0) {
              this.ruleForm = data.data.appDevice;
              this.labels = data.data.appDevice.labels ? data.data.appDevice.labels : [];
              this.ruleForm.type = String(data.data.appDevice.type);
              this.ruleForm.groupIds = Array.isArray(this.ruleForm.groupIds)
                ? this.ruleForm.groupIds[0]
                : this.ruleForm.groupIds;

              data.data.resources.forEach((item) => {
                const arrType = this.deviceTypeObj[item.type];
                item.data.forEach((item1) => {
                  const o = {};
                  o.id = item1.entity.id;
                  o.name = item1.entity.name;
                  o.type = item.type.toString();
                  // o.phone = item1.entity.mobile1
                  this.showDeviceData[arrType].push(JSON.stringify(o));
                });
              });
            } else {
              this.$message.error(`错误代码：${data.code}`);
            }
          });
      }
      this.loadingPopup();
    },
    getDeviceGroupList() {
      const request = {
        method: 'get',
        url: '/device/device/appdevicegroup/tree/all',
        baseURL: window.SITE_CONFIG.cloudUrl,
        params: {
          type: this.deviceFlag,
        },
      };
      this.$http(request)
        .then(({ data }) => {
          if (data.code === 0) {
            this.deviceTypeArr = data.data;
          } else {
            this.$message.error(`错误代码：${data.code}`);
          }
        });
    },
    // 关闭弹窗
    closePopup() {
      this.ruleForm = this.defaultForm();
      this.labels = [];
      for (const k in this.showDeviceData) {
        this.showDeviceData[k] = [];
      }
      this.$refs.svdialog.visible = false;
    },
    // 点击了确定
    submitData() {
      const params = {
        related: [],
      };
      for (const k in this.showDeviceData) {
        this.showDeviceData[k].forEach((item) => {
          const o = {};
          const value = JSON.parse(item);
          o.resoureId = value.id;
          o.type = value.type;
          params.related.push(o);
        });
      }
      const formData = {
        ...this.ruleForm,
        groupIds: Array.isArray(this.ruleForm.groupIds)
          ? this.ruleForm.groupIds
          : [this.ruleForm.groupIds],
        type: this.deviceFlag,
        needUpdateGroup: 1,
        params,
      };
      if (this.operationFlag === 'modify') {
        formData.id = this.id;
      }
      let labels = this.labels.map((v) => v.id);
      const urlPath = this.operationFlag === 'add'
        ? '/device/device/appdevice/save'
        : '/device/device/appdevice/update';
      const request = {
        method: 'post',
        url: urlPath,
        baseURL: window.SITE_CONFIG.cloudUrl,
        data: formData,
        // contactsId: this.dataForm.contactsId
      };
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$http(request)
            .then(({ data }) => {
              if (data.code === 0) {
                this.closePopup();
                this.fullScreenFlag = false;
                const requestDevice = {
                  method: 'post',
                  url: '/device/device/applabeldevice/saveAll',
                  baseURL: window.SITE_CONFIG.cloudUrl,
                  data: {
                    deviceIds: [data.data.resoureId ? data.data.resoureId : formData.id],
                    labelIds: labels,
                    isDelete: true,
                  },
                };
                this.$http(requestDevice)
                  .then((res) => {
                    if (res.data.code !== 0) {
                      this.$message.error(`错误代码：${res.data.code}`);
                    }
                    this.$emit('refreshDataList');
                  });
              } else {
                this.$message.error(`错误代码：${data.code}`);
              }
            });
        }
      });
    },
    /**
         * @method
         * @desc 地图定位确定位置，获取地址和坐标
         */
    handleLocationConfirm(...arg) {
      this.ruleForm.address = arg[0];
      this.ruleForm.longitude = arg[1][0];
      this.ruleForm.latitude = arg[1][1];
      // 大地坐标系
      this.ruleForm.cgcsLongitude = arg[3][0];
      this.ruleForm.cgcsLatitude = arg[3][1];
      // 强制更新，防止深对象v-model不更新
      this.$forceUpdate();
    },
    // 添加关联对象
    handleCommand(command) {
      // console.log(this.$refs.addObjectValueEl);
      // this.deviceTitle = command;
      // this.$refs.addObjectValueEl.$el.click();
      this.deviceTitle = this.deviceObj[command];
      this.$refs.SelectContactsEl.loadingPopup();
      const arrType = this.deviceTypeObj[command];
      this.$refs.SelectContactsEl.initData(command, this.showDeviceData[arrType]);
    },
    getDeviceData(type, data) {
      const arrType = this.deviceTypeObj[type];
      this.showDeviceData[arrType] = [...data];
    },
    deleteDevice(item) {
      const itemObj = JSON.parse(item);
      const arrType = this.deviceTypeObj[itemObj.type];
      this.showDeviceData[arrType].splice(
        this.showDeviceData[arrType].indexOf(item),
        1,
      );
    },
    // 全屏
    fullScreen() {
      this.fullScreenFlag = !this.fullScreenFlag;
    },
    handleLabel() {
      this.setLabelVisible = true;
      this.$nextTick(() => {
        this.$refs.setLabel.init([...this.labels]);
      });
    },
    submitLabelData(data) {
      this.labels = data;
    },
    delLabels(idx) {
      this.labels.splice(idx, 1);
    },
  },
};
</script>
<style lang="scss" module>
.AddDevicePopupTitle {
	display: flex;
	position: relative;
	justify-content: center;
	align-items: center;
	border-top-left-radius: 5px;
	border-top-right-radius: 5px;
	width: 100%;
	height: 40px;
	background: #f1f4f6;
	line-height: 40px;
	color: #333;

	& > span {
		&:last-child {
			position: absolute;
			right: 14px;
			top: 10px;
			width: 15px;
			height: 15px;
			background: url("./assets/close.svg") 100%/100% no-repeat;
			cursor: pointer;
		}
	}
}
.AddDevicePopupContent {
	display: flex;
	width: 1100px;
	& > div {
		&:first-child {
			overflow-x: hidden;
			overflow-y: auto;
			box-sizing: border-box;
			margin-left: 15px;
			margin-top: 20px;
			padding-right: 20px;
			width: 500px;
			height: 743px;
			max-height: 743px;
			&::-webkit-scrollbar {
				width: 5px;
				background: transparent;
			}

			&::-webkit-scrollbar-thumb {
				border-radius: 5px;
				background: #d5d5d5;
			}
		}
		&:last-child {
			flex: 1;
		}
	}
  .label{
    display:flex;
    margin-bottom:20px;
    align-items: center;
    margin-left: 78px;
    .labelItem{
      display:flex;
      align-items: center;
      margin-left: 12px;
      .addLabel{
        margin-top: 9px;
        padding: 0px 7px;
        border-radius: 5px;
        background-color: #0091ff;
        color: white;
        font-size: 18px;
        font-weight: bold;
        height: 20px;
        line-height: 18px;
      }
      .labelList{
        width:100%;
        overflow:auto;
        padding-top: 10px;
        padding: 10px 10px 0 0;
        display: flex;
        flex-wrap: wrap;
        .oneLabel{
          border:1px dashed #DCDFEA;
          border-radius: 5px;
          margin:5px;
          position:relative;
          .delLabel{
            position:absolute;
            top: -11px;
            font-size: 17px;
            right: -7px;
            background-color: white;cursor: pointer;
          }
        }
      }
    }
  }
}
.Location {
	& > div {
		display: flex;
		&:first-child {
			position: relative;
			margin: 10px 0 10px;
			padding-left: 10px;
			border-left: 2px solid #3f92fe;
			h6 {
				margin: 0;
				font-weight: bold;
				font-size: 16px;
				color: #333;
			}
			span {
				position: absolute;
				right: 20px;
				top: 36px;
				z-index: 1;
				width: 20px;
				height: 20px;
				background: no-repeat center/100% 100% url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjAwNzQwMjc2Nzc5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjMyMjciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTE0NS4wNjY2NjcgODUuMzMzMzMzaDE1My42YzI1LjYgMCA0Mi42NjY2NjctMTcuMDY2NjY3IDQyLjY2NjY2Ni00Mi42NjY2NjZTMzI0LjI2NjY2NyAwIDI5OC42NjY2NjcgMEgzNC4xMzMzMzNDMjUuNiAwIDE3LjA2NjY2NyA4LjUzMzMzMyA4LjUzMzMzMyAxNy4wNjY2NjcgMCAyNS42IDAgMzQuMTMzMzMzIDAgNDIuNjY2NjY3djI1NmMwIDI1LjYgMTcuMDY2NjY3IDQyLjY2NjY2NyA0Mi42NjY2NjcgNDIuNjY2NjY2czQyLjY2NjY2Ny0xNy4wNjY2NjcgNDIuNjY2NjY2LTQyLjY2NjY2NlYxNDUuMDY2NjY3bDIzMC40IDIzMC40YzE3LjA2NjY2NyAxNy4wNjY2NjcgNDIuNjY2NjY3IDE3LjA2NjY2NyA1OS43MzMzMzQgMCAxNy4wNjY2NjctMTcuMDY2NjY3IDE3LjA2NjY2Ny00Mi42NjY2NjcgMC01OS43MzMzMzRMMTQ1LjA2NjY2NyA4NS4zMzMzMzN6IG0xNzAuNjY2NjY2IDU2My4yTDE2Mi4xMzMzMzMgODAyLjEzMzMzM2wtNzYuOCA3Ni44VjcyNS4zMzMzMzNDODUuMzMzMzMzIDY5OS43MzMzMzMgNjguMjY2NjY3IDY4Mi42NjY2NjcgNDIuNjY2NjY3IDY4Mi42NjY2NjdzLTQyLjY2NjY2NyAxNy4wNjY2NjctNDIuNjY2NjY3IDQyLjY2NjY2NnYyNTZjMCAyNS42IDE3LjA2NjY2NyA0Mi42NjY2NjcgNDIuNjY2NjY3IDQyLjY2NjY2N2gyNTZjMjUuNiAwIDQyLjY2NjY2Ny0xNy4wNjY2NjcgNDIuNjY2NjY2LTQyLjY2NjY2N3MtMTcuMDY2NjY3LTQyLjY2NjY2Ny00Mi42NjY2NjYtNDIuNjY2NjY2SDE0NS4wNjY2NjdsNzYuOC03Ni44IDE1My42LTE1My42YzE3LjA2NjY2Ny0xNy4wNjY2NjcgMTcuMDY2NjY3LTQyLjY2NjY2NyAwLTU5LjczMzMzNC0xNy4wNjY2NjctMTcuMDY2NjY3LTQyLjY2NjY2Ny0xNy4wNjY2NjctNTkuNzMzMzM0IDB6IG02NjUuNiAzNC4xMzMzMzRjLTI1LjYgMC00Mi42NjY2NjcgMTcuMDY2NjY3LTQyLjY2NjY2NiA0Mi42NjY2NjZ2MTUzLjZsLTc2LjgtNzYuOC0xNTMuNi0xNTMuNmMtMTcuMDY2NjY3LTE3LjA2NjY2Ny00Mi42NjY2NjctMTcuMDY2NjY3LTU5LjczMzMzNCAwLTE3LjA2NjY2NyAxNy4wNjY2NjctMTcuMDY2NjY3IDQyLjY2NjY2NyAwIDU5LjczMzMzNGwxNTMuNiAxNTMuNiA3Ni44IDc2LjhINzI1LjMzMzMzM2MtMjUuNiAwLTQyLjY2NjY2NyAxNy4wNjY2NjctNDIuNjY2NjY2IDQyLjY2NjY2NnMxNy4wNjY2NjcgNDIuNjY2NjY3IDQyLjY2NjY2NiA0Mi42NjY2NjdoMjU2YzI1LjYgMCA0Mi42NjY2NjctMTcuMDY2NjY3IDQyLjY2NjY2Ny00Mi42NjY2Njd2LTI1NmMwLTI1LjYtMTcuMDY2NjY3LTQyLjY2NjY2Ny00Mi42NjY2NjctNDIuNjY2NjY2eiBtMC02ODIuNjY2NjY3aC0yNTZjLTI1LjYgMC00Mi42NjY2NjcgMTcuMDY2NjY3LTQyLjY2NjY2NiA0Mi42NjY2NjdzMTcuMDY2NjY3IDQyLjY2NjY2NyA0Mi42NjY2NjYgNDIuNjY2NjY2aDE1My42bC03Ni44IDc2LjgtMTUzLjYgMTUzLjZjLTE3LjA2NjY2NyAxNy4wNjY2NjctMTcuMDY2NjY3IDQyLjY2NjY2NyAwIDU5LjczMzMzNCAxNy4wNjY2NjcgMTcuMDY2NjY3IDQyLjY2NjY2NyAxNy4wNjY2NjcgNTkuNzMzMzM0IDBsMTUzLjYtMTUzLjYgNzYuOC03Ni44djE1My42YzAgMjUuNiAxNy4wNjY2NjcgNDIuNjY2NjY3IDQyLjY2NjY2NiA0Mi42NjY2NjZzNDIuNjY2NjY3LTE3LjA2NjY2NyA0Mi42NjY2NjctNDIuNjY2NjY2di0yNTZjMC0yNS42LTE3LjA2NjY2Ny00Mi42NjY2NjctNDIuNjY2NjY3LTQyLjY2NjY2N3oiIGZpbGw9IiM2NjY2NjYiIHAtaWQ9IjMyMjgiPjwvcGF0aD48L3N2Zz4=);
				cursor: pointer;
				&:hover {
					background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjAwNzQwMjc2Nzc5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjMyMjciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTE0NS4wNjY2NjcgODUuMzMzMzMzaDE1My42YzI1LjYgMCA0Mi42NjY2NjctMTcuMDY2NjY3IDQyLjY2NjY2Ni00Mi42NjY2NjZTMzI0LjI2NjY2NyAwIDI5OC42NjY2NjcgMEgzNC4xMzMzMzNDMjUuNiAwIDE3LjA2NjY2NyA4LjUzMzMzMyA4LjUzMzMzMyAxNy4wNjY2NjcgMCAyNS42IDAgMzQuMTMzMzMzIDAgNDIuNjY2NjY3djI1NmMwIDI1LjYgMTcuMDY2NjY3IDQyLjY2NjY2NyA0Mi42NjY2NjcgNDIuNjY2NjY2czQyLjY2NjY2Ny0xNy4wNjY2NjcgNDIuNjY2NjY2LTQyLjY2NjY2NlYxNDUuMDY2NjY3bDIzMC40IDIzMC40YzE3LjA2NjY2NyAxNy4wNjY2NjcgNDIuNjY2NjY3IDE3LjA2NjY2NyA1OS43MzMzMzQgMCAxNy4wNjY2NjctMTcuMDY2NjY3IDE3LjA2NjY2Ny00Mi42NjY2NjcgMC01OS43MzMzMzRMMTQ1LjA2NjY2NyA4NS4zMzMzMzN6IG0xNzAuNjY2NjY2IDU2My4yTDE2Mi4xMzMzMzMgODAyLjEzMzMzM2wtNzYuOCA3Ni44VjcyNS4zMzMzMzNDODUuMzMzMzMzIDY5OS43MzMzMzMgNjguMjY2NjY3IDY4Mi42NjY2NjcgNDIuNjY2NjY3IDY4Mi42NjY2NjdzLTQyLjY2NjY2NyAxNy4wNjY2NjctNDIuNjY2NjY3IDQyLjY2NjY2NnYyNTZjMCAyNS42IDE3LjA2NjY2NyA0Mi42NjY2NjcgNDIuNjY2NjY3IDQyLjY2NjY2N2gyNTZjMjUuNiAwIDQyLjY2NjY2Ny0xNy4wNjY2NjcgNDIuNjY2NjY2LTQyLjY2NjY2N3MtMTcuMDY2NjY3LTQyLjY2NjY2Ny00Mi42NjY2NjYtNDIuNjY2NjY2SDE0NS4wNjY2NjdsNzYuOC03Ni44IDE1My42LTE1My42YzE3LjA2NjY2Ny0xNy4wNjY2NjcgMTcuMDY2NjY3LTQyLjY2NjY2NyAwLTU5LjczMzMzNC0xNy4wNjY2NjctMTcuMDY2NjY3LTQyLjY2NjY2Ny0xNy4wNjY2NjctNTkuNzMzMzM0IDB6IG02NjUuNiAzNC4xMzMzMzRjLTI1LjYgMC00Mi42NjY2NjcgMTcuMDY2NjY3LTQyLjY2NjY2NiA0Mi42NjY2NjZ2MTUzLjZsLTc2LjgtNzYuOC0xNTMuNi0xNTMuNmMtMTcuMDY2NjY3LTE3LjA2NjY2Ny00Mi42NjY2NjctMTcuMDY2NjY3LTU5LjczMzMzNCAwLTE3LjA2NjY2NyAxNy4wNjY2NjctMTcuMDY2NjY3IDQyLjY2NjY2NyAwIDU5LjczMzMzNGwxNTMuNiAxNTMuNiA3Ni44IDc2LjhINzI1LjMzMzMzM2MtMjUuNiAwLTQyLjY2NjY2NyAxNy4wNjY2NjctNDIuNjY2NjY2IDQyLjY2NjY2NnMxNy4wNjY2NjcgNDIuNjY2NjY3IDQyLjY2NjY2NiA0Mi42NjY2NjdoMjU2YzI1LjYgMCA0Mi42NjY2NjctMTcuMDY2NjY3IDQyLjY2NjY2Ny00Mi42NjY2Njd2LTI1NmMwLTI1LjYtMTcuMDY2NjY3LTQyLjY2NjY2Ny00Mi42NjY2NjctNDIuNjY2NjY2eiBtMC02ODIuNjY2NjY3aC0yNTZjLTI1LjYgMC00Mi42NjY2NjcgMTcuMDY2NjY3LTQyLjY2NjY2NiA0Mi42NjY2NjdzMTcuMDY2NjY3IDQyLjY2NjY2NyA0Mi42NjY2NjYgNDIuNjY2NjY2aDE1My42bC03Ni44IDc2LjgtMTUzLjYgMTUzLjZjLTE3LjA2NjY2NyAxNy4wNjY2NjctMTcuMDY2NjY3IDQyLjY2NjY2NyAwIDU5LjczMzMzNCAxNy4wNjY2NjcgMTcuMDY2NjY3IDQyLjY2NjY2NyAxNy4wNjY2NjcgNTkuNzMzMzM0IDBsMTUzLjYtMTUzLjYgNzYuOC03Ni44djE1My42YzAgMjUuNiAxNy4wNjY2NjcgNDIuNjY2NjY3IDQyLjY2NjY2NiA0Mi42NjY2NjZzNDIuNjY2NjY3LTE3LjA2NjY2NyA0Mi42NjY2NjctNDIuNjY2NjY2di0yNTZjMC0yNS42LTE3LjA2NjY2Ny00Mi42NjY2NjctNDIuNjY2NjY3LTQyLjY2NjY2N3oiIGZpbGw9IiMwMDkxRkYiIHAtaWQ9IjMyMjgiPjwvcGF0aD48L3N2Zz4=);
				}
			}
		}
		&:last-child {
			flex: 1;
		}
	}
}
.locationAddress {
	/deep/ .location__address::before {
		white-space: nowrap;
	}
}
.addObjectValueParent {
	position: relative;
}
.addObjectValue {
	visibility: hidden;
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 1px;
}
.lonlat {
	& > div {
		display: flex;
		& > div:first-child {
			margin-right: 10px;
		}
	}
}
.outDiv {
	overflow: hidden;
	margin-top: -2px;
	border-radius: 4px;
	background: #f2f2f2;
	.showDevice {
		display: flex;
		margin: 5px;
		height: 30px;
		line-height: 30px;
		.type {
			padding: 0 5px;
			border: 1px dashed #0091ff;
			width: 25%;
			text-align: center;
		}
		.deviceName {
			overflow: hidden;
			padding-left: 10px;
			width: 75%;
			text-overflow: ellipsis;
			color: #0091ff;
			white-space: nowrap;
		}
		.showDelete {
			display: block;
			width: 15px;
			// height: 14px;
			background: url("./assets/close.svg") 100%/100% no-repeat;
			cursor: pointer;
		}
	}
}
</style>
<style lang="scss" scoped>
.add-device-popup-content-location {
	.location__address {
		&::before {
			width: 80px;
		}
		.location__confirm {
			right: -65px;
		}
	}
}
.locationAddress >>> .location__address::before {
	white-space: nowrap!important;
}

</style>
