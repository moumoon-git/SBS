<!--
 * @Author: linhuiting
 * @Date: 2020-11-11 16:51:48
 * @LastEditors: linhuiting
 * @LastEditTime: 2020-12-09 15:52:43
 * @Description: 避难场所查看弹窗
 * @FilePath: \SBS\src\views\modules\contingencyManage\shelterManage\shelterManage-see.vue
-->

<template>
  <sv-dialog
    ref="dialog"
    title="查看避难场所详情"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @cancel="handleDialogClose"
    @modal="handleDialogClose"
  >
    <div
      v-loading="loading"
      class="information"
      element-loading-spinner="sv-loading"
    >
      <!-- A. 左边栏 -->
      <div class="information__left">
        <div class="information__left__item">
          <div class="information__left__item__label">
            名称
          </div>
          <div class="information__left__item__content">
            {{ dataForm.name ? dataForm.name : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            分组
          </div>
          <div class="information__left__item__content">
            {{ dataForm.areaType ? dataForm.areaType : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            所属区域
          </div>
          <div class="information__left__item__content">
            {{ dataForm.townName ? dataForm.townName : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            地址
          </div>
          <div class="information__left__item__content">
            {{ dataForm.address ? dataForm.address : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            经度
          </div>
          <div class="information__left__item__content">
            {{ dataForm.longitude ? dataForm.longitude : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            纬度
          </div>
          <div class="information__left__item__content">
            {{ dataForm.latitude ? dataForm.latitude : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            场所功能
          </div>
          <div class="information__left__item__content">
            {{ dataForm.feature ? dataForm.feature : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            面积(m²)
          </div>
          <div class="information__left__item__content">
            {{ dataForm.acreage ? dataForm.acreage : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            可容纳人数
          </div>
          <div class="information__left__item__content">
            {{ dataForm.peopleNum ? dataForm.peopleNum : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            抗震设防程度
          </div>
          <div class="information__left__item__content">
            {{ dataForm.level ? dataForm.level : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            使用时间
          </div>
          <div class="information__left__item__content">
            {{ dataForm.useTime ? dataForm.useTime : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            设计使用年限
          </div>
          <div class="information__left__item__content">
            {{ dataForm.useYear ? dataForm.useYear : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            主管单位
          </div>
          <div class="information__left__item__content">
            {{ dataForm.competentUnit ? dataForm.competentUnit : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            应急标识
          </div>
          <div class="information__left__item__content">
            <span v-if="dataForm.emergencyFlag == '1'">是</span>
            <span v-if="dataForm.emergencyFlag == '0'">否</span>
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            给排水情况
          </div>
          <div class="information__left__item__content">
            {{ dataForm.waterDetails ? dataForm.waterDetails : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            供电状况
          </div>
          <div class="information__left__item__content">
            {{ dataForm.electricityDetails ? dataForm.electricityDetails : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            通风状况
          </div>
          <div class="information__left__item__content">
            {{ dataForm.windDetails ? dataForm.windDetails : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            应急器材
          </div>
          <div class="information__left__item__content">
            {{ dataForm.emergencyEquipment ? dataForm.emergencyEquipment : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            储备物资
          </div>
          <div class="information__left__item__content">
            {{ dataForm.storeMaterials ? dataForm.storeMaterials : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            备注
          </div>
          <div class="information__left__item__content">
            {{ dataForm.remark ? dataForm.remark : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            联系人
          </div>
          <div class="information__left__item__content">
            <span
              v-for="(item, index) in dataForm.contactorlist"
              :key="`item_${index}`"
            >
              <span
                v-if="item !== null"
                class="information__left__item__tag"
              >
                {{ item.name }}
                {{ item.mobile1 ? `（${item.mobile1}）` : '' }}
              </span>
            </span>
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            负责人
          </div>
          <div class="information__left__item__content">
            <span
              v-for="(item, index) in dataForm.principalList"
              :key="`item_${index}`"
            >
              <span
                v-if="item !== null"
                class="information__left__item__tag"
              >
                {{ item.name }}
                {{ item.mobile1 ? `（${item.mobile1}）` : '' }}
              </span>
            </span>
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            关联设备
          </div>
        </div>
        <div>
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
        </div>
      </div>

      <!-- B. 右边栏 -->
      <div class="information__right">
        <Location
          :address="dataForm.address"
          :lng-lat="[dataForm.longitude, dataForm.latitude]"
          :display-only="true"
        />
      </div>
    </div>

    <!-- 去掉底部 -->
    <template #footer>
      <span />
    </template>
  </sv-dialog>
</template>

<script>
import Location from '@/views/modules/GarbageClassification/SiteManagement/ClassificationSite/Location/Location.vue';

export default {
  name: 'ShelterManageSee',
  components: {
    Location,
  },
  data() {
    return {
      visible: false,
      loading: false,
      currentId: '',
      token: this.$cookie.get('token'),
      dataForm: {
        name: '',
        areaType: '',
        areaTypeId: '',
        areaTypeName: '',
        areaId: '',
        level: '',
        feature: '',
        peopleNum: 0,
        acreage: 0,
        useTime: '',
        useYear: 0,
        emergencyFlag: '',
        longitude: '',
        latitude: '',
        competentUnit: '',
        storeMaterials: '',
        address: '',
        waterDetails: '',
        windDetails: '',
        electricityDetails: '',
        remark: '',
        emergencyEquipment: '',
        contactsId: [],
        contactorlist: [],
        principalList: [],
      },
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
       * @description: 打开弹窗，初始化数据
       * @param {Number} id 数据的id
       */
    init(id, platformId) {
      this.currentId = id;
      // 显示弹窗
      this.$refs.dialog.visible = true;
      this.getData(this.currentId, platformId);
    },
    /**
       * @description 获取基本信息页面的信息
       * @param {Number} id 数据的id
       */
    getData(id, platformIds) {
      this.loading = true;
      this.showDeviceData = {
        monitor: [],
        room: [],
        colony: [],
        // wecomm: [],
        app: [],
      };
      const request = {
        method: 'get',
        url: '/resoure/resourearea/selectById',
        baseURL: window.SITE_CONFIG.baseUrl,
        params: {
          ids: id,
          platformId: platformIds,
          token: this.token,
        },
      };
      this.$http(request)
        .then((response) => {
          if (response.data.code === 0) {
            // Object.assign(this.dataForm, response.data.data);
            response.data.data[0].resources.forEach((item) => {
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
            this.dataForm = {
              ...response.data.data[0],
            };
          } else {
            window.console.log('获取id =', id, '的详情失败！错误信息：【\n', response, '\n】');
          }
          this.loading = false;
        })
        .catch((error) => {
          window.console.log('获取id =', id, '的详情失败！错误信息：【\n', error, '\n】');
          this.loading = false;
        });
    },
    /**
       * @method
       * @desc 弹窗关闭
       */
    handleDialogClose() {
      this.$refs.dialog.visible = false;
    },
  },

};
</script>
<style lang="scss" scoped>
.information {
  width: 900px;
  display: flex;
  justify-content: center;
  align-items: stretch;
  text-align: left;
  &__left {
    //* {line-height: 1.5;}
    width: 440px;
    height: 800px;
    padding: 10px 0;
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
    &__item {
      margin: 15px 0;
      display: flex;
      align-items: flex-start;
      &__label {
        flex-shrink: 0;
        width: 120px;
        margin-right: 20px;
        color: #999999;
        text-align: right;
      }
      &__tag {
        border: 1px solid #E0E0E0;
        border-radius: 3px;
        padding: 0 10px;
        background: #FAFAFA;
        margin: 0 5px 5px 0;
        display: inline-block;
        // word-break: keep-all;
      }
    }
  }
  &__right {
    flex: 1;
    padding: 20px;
  }
}
</style>
<style lang="scss" module>
.backDiv {
  margin-left: 20px;
  background: #f2f2f2;
  border-radius: 4px;
  overflow: hidden;
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
