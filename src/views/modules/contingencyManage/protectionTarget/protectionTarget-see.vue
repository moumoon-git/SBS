<!--
 * @Author: linhuiting
 * @Date: 2020-11-12 14:39:08
 * @LastEditors: linhuiting
 * @LastEditTime: 2020-12-09 13:24:11
 * @Description: 防护目标查看弹窗
 * @FilePath: \SBS\src\views\modules\contingencyManage\protectionTarget\protectionTarget-see.vue
-->

<template>
  <sv-dialog
    ref="dialog"
    title="查看防护目标详情"
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
            防护目标类型
          </div>
          <div class="information__left__item__content">
            {{ dataForm.className ? dataForm.className : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            防护目标分组
          </div>
          <div class="information__left__item__content">
            {{ dataForm.protectTypeParentName ? dataForm.protectTypeParentName : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            地址
          </div>
          <div class="information__left__item__content">
            {{ dataForm.location ? dataForm.location : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            等级
          </div>
          <div class="information__left__item__content">
            <span v-if="dataForm.level == '1'">国家级</span>
            <span v-if="dataForm.level == '2'">省级</span>
            <span v-if="dataForm.level == '3'">市级</span>
            <span v-if="dataForm.level == '4'">县级</span>
            <span v-if="dataForm.level == '5'">乡镇级</span>
            <span v-if="dataForm.level == '6'">其他</span>
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            面积(m²)
          </div>
          <div class="information__left__item__content">
            {{ dataForm.areaSize ? dataForm.areaSize : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            当前人数
          </div>
          <div class="information__left__item__content">
            {{ dataForm.nowNumber ? dataForm.nowNumber : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            可容纳人数
          </div>
          <div class="information__left__item__content">
            {{ dataForm.canuseNumber ? dataForm.canuseNumber : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            防护等级
          </div>
          <div class="information__left__item__content">
            <span v-if="dataForm.protectLevel == '1'">特别重要防护</span>
            <span v-if="dataForm.protectLevel == '2'">重要防护</span>
            <span v-if="dataForm.protectLevel == '3'">较高防护</span>
            <span v-if="dataForm.protectLevel == '4'">一般防护</span>
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            成立时间
          </div>
          <div class="information__left__item__content">
            {{ dataForm.useTime ? dataForm.useTime : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            所属区域
          </div>
          <div class="information__left__item__content">
            {{ dataForm.areaName ? dataForm.areaName : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            主体单位
          </div>
          <div class="information__left__item__content">
            {{ dataForm.chargeUnit ? dataForm.chargeUnit : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            防护措施
          </div>
          <div class="information__left__item__content">
            {{ dataForm.conservatoryMeasure ? dataForm.conservatoryMeasure : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            应急通讯方式
          </div>
          <div class="information__left__item__content">
            {{ dataForm.communicationMode ? dataForm.communicationMode : '' }}
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
              v-for="(item, index) in dataForm.contactsList"
              :key="`item_${index}`"
              class="information__left__item__tag"
            >
              {{ item.name }}
              {{ item.mobile1 ? `（${item.mobile1}）` : '' }}
            </span>
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            负责人
          </div>
          <div class="information__left__item__content">
            <span
              v-for="(item, index) in dataForm.responsiblesList"
              :key="`item_${index}`"
              class="information__left__item__tag"
            >
              {{ item.name }}
              {{ item.mobile1 ? `（${item.mobile1}）` : '' }}
            </span>
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            附件
          </div>
          <div class="information__left__item__content">
            <span
              v-for="(item, index) in dataForm.documentList"
              :key="index"
            >
              <viewer>
                <el-row v-if="isImg(item.url)">
                  <img
                    class="picture"
                    :src="backgroundURL + item.url"
                    :alt="item.name"
                  >
                  <p
                    class="description"
                    :src="backgroundURL + item.url"
                  >{{ item.name }}</p>
                </el-row>
                <div
                  v-else
                  class="fileList__name"
                >
                  <a
                    :href="`${backgroundURL}${item.url}`"
                    :download="item.name"
                  >
                    <i class="el-icon-document" />
                    {{ item.name }}
                  </a>
                </div>
              </viewer>
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
          :address="dataForm.location"
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
// import viewFile from '@/views/modules/event/emergency/emergencyhandleprocess.vue';
import Cookies from 'js-cookie';

export default {
  name: 'ProtectionTargetSee',
  components: {
    Location,
  },
  data() {
    return {
      visible: false,
      loading: false,
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
      currentId: '',
      token: this.$cookie.get('token'),
      backgroundURL: window.SITE_CONFIG.cloudUrl,
      dialogDocumentVisible: false,
      $window: {},
      $Cookies: {},
      dataForm: {
        id: 0,
        name: '',
        clssId: '',
        className: '',
        protectType: '',
        protectTypeParentName: '',
        groupId: '',
        location: '',
        longitude: '',
        latitude: '',
        level: '',
        protectLevel: '',
        area: '',
        areaName: '',
        areaSize: '',
        riskReason: '',
        riskReasonParentName: '',
        chargeUnit: '',
        nowNumber: '',
        useTime: '',
        canuseNumber: '',
        layout: '',
        monitorWay: '',
        dataSourceUnit: '',
        defenseArea: '',
        trafficConditions: '',
        generalSituation: '',
        conservatoryMeasure: '',
        communicationMode: '',
        remark: '',
        contacts: [],
        chargeId: [],
        contactsList: [],
        responsiblesList: [],
        documentList: [],
      },
      fileList: [],
      natureOptions: [],
    };
  },
  methods: {
    /**
     * @description: 打开弹窗，初始化数据
     * @param {Number} id 数据的id
     */
    init(id) {
      this.dataForm.id = id;
      // 显示弹窗
      this.$refs.dialog.visible = true;
      this.getData(this.dataForm.id);
    },
    /**
     * @description 获取基本信息页面的信息
     * @param {Number} id 数据的id
     */
    getData(id) {
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
        url: '/resoure/resoureProtectTarget/info',
        baseURL: window.SITE_CONFIG.baseUrl,
        params: {
          id,
          token: this.token,
        },
      };
      this.$http(request)
        .then((response) => {
          // console.log('/resoure/resoureProtectTarget/info', response);
          if (response.data.code === 0) {
            Object.assign(this.dataForm, response.data);
            this.dataForm = response.data.ResoureProtectTargetEntity;
            response.data.resources.forEach((item) => {
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
     * @description: 判断是图片还是文档
     * @param {String} url 文件的地址
     * @return {Boolean} 图片返回true，文档返回flase
     */
    isImg(url) {
      const res = url.slice(-4);
      if (res === '.png' || res === '.jpg' || res === 'jpeg' || res === '.gif' || res === '.bmp') {
        return true;
      }
      return false;
    },
    /**
     * @method
     * @desc 弹窗关闭
     */
    handleDialogClose() {
      this.$refs.dialog.visible = false;
    },

    created() {
      this.$window = window;
      this.$Cookies = Cookies;
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
    //min-height: 700px;
    padding: 10px 0;
    height: 800px;
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

  .picture {
    max-width: 300px;
    max-height: 200px;
  }
}
</style>
<style lang="scss" module>
.expert {
  .ruleForm {
    padding: 20px 20px 0px 10px;
    width: 500px;
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
