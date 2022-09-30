<!--
 * @Author: linhuiting
 * @Date: 2020-11-16 19:10:15
 * @LastEditors: liukanglin
 * @LastEditTime: 2020-11-25 09:44:38
 * @Description: 应急队伍查看弹窗
 * @FilePath: \product_SBS\src\views\modules\sys\resoureteam\resoureteam-see.vue
-->

<template>
  <sv-dialog
    ref="dialog"
    title="查看防护队伍详情"
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
            队伍名称
          </div>
          <div class="information__left__item__content">
            {{ dataForm.name ? dataForm.name : '' }}
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
            所属区域
          </div>
          <div class="information__left__item__content">
            {{ dataForm.townName }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            队伍分组
          </div>
          <div class="information__left__item__content">
            {{ dataForm.teamClassName ? dataForm.teamClassName : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            队伍类型
          </div>
          <div class="information__left__item__content">
            {{ dataForm.teamTypeName ? dataForm.teamTypeName : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            队伍单位
          </div>
          <div class="information__left__item__content">
            {{ dataForm.teamGroup ? dataForm.teamGroup : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            队伍人数
          </div>
          <div class="information__left__item__content">
            {{ dataForm.peopleNumber ? dataForm.peopleNumber : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            成立时间
          </div>
          <div class="information__left__item__content">
            {{ dataForm.creationTime ? dataForm.creationTime : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            传真
          </div>
          <div class="information__left__item__content">
            {{ dataForm.fax ? dataForm.fax : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            值班电话
          </div>
          <div class="information__left__item__content">
            {{ dataForm.telephoneNum ? dataForm.telephoneNum : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            应急通讯方式
          </div>
          <div class="information__left__item__content">
            {{ dataForm.communicationMethod ? dataForm.communicationMethod : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            邮政编码
          </div>
          <div class="information__left__item__content">
            {{ dataForm.postalCode ? dataForm.postalCode : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            应急准备时间
          </div>
          <div class="information__left__item__content">
            {{ dataForm.preparationTime ? dataForm.preparationTime : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            机密等级
          </div>
          <div class="information__left__item__content">
            <!-- {{dataForm.secretLevel ? dataForm.secretLevel : ''}} -->
            <span v-if="dataForm.secretLevel == '1'">机密</span>
            <span v-if="dataForm.secretLevel == '2'">秘密</span>
            <span v-if="dataForm.secretLevel == '3'">限制</span>
            <span v-if="dataForm.secretLevel == '4'">公开</span>
            <span v-if="dataForm.secretLevel == '5'">其他</span>
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            资质等级
          </div>
          <div class="information__left__item__content">
            {{ dataForm.qualificationLevel ? dataForm.qualificationLevel : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            性质
          </div>
          <div class="information__left__item__content">
            <!-- {{dataForm.nature ? dataForm.nature : ''}} -->
            <span v-if="dataForm.nature == '1'">专职</span>
            <span v-if="dataForm.nature == '2'">兼职</span>
            <span v-if="dataForm.nature == '3'">专业志愿者</span>
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            级别
          </div>
          <div class="information__left__item__content">
            <!-- {{dataForm.level ? dataForm.level : ''}} -->
            <span v-if="dataForm.level == '1'">国家级</span>
            <span v-if="dataForm.level == '2'">省级</span>
            <span v-if="dataForm.level == '3'">市级</span>
            <span v-if="dataForm.level == '4'">县级</span>
            <span v-if="dataForm.level == '5'">其他</span>
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
            主要职责
          </div>
          <div class="information__left__item__content">
            {{ dataForm.duties ? dataForm.duties : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            装备描述
          </div>
          <div class="information__left__item__content">
            {{ dataForm.equipment ? dataForm.equipment : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            专长
          </div>
          <div class="information__left__item__content">
            {{ dataForm.specialty ? dataForm.specialty : '' }}
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            应急救援经历
          </div>
          <div class="information__left__item__content">
            {{ dataForm.rescueExperience ? dataForm.rescueExperience : '' }}
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
                  {{ deviceObj[item1.type] }}
                </div>
                <div :class="[{[$style.deviceName]: ['0', '1', '9', '10'].includes(String(item1.type))}, {[$style.deviceName_default]: ['2', '3', '11', '12'].includes(String(item1.type))},]">
                  <span :title="item1.name">{{ item1.name }}</span>
                </div>
                <div
                  v-if="['2', '3', '11', '12'].includes(String(item1.type))"
                  :class="[{[$style.position]: item1.isDefault === 1}, {[$style.related_btn]: item1.isDefault === 0},]"
                >
                  <span>{{ item1.isDefault === 1 ? '已关联' : '关联定位' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="information__left__item">
          <div class="information__left__item__label">
            关联定位
          </div>
          <div class="information__left__item__content">
            {{ dataForm.positioningDeviceName ? dataForm.positioningDeviceName : '' }}
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
    // let self = this;
    return {
      visible: false,
      loading: false,
      currentId: '',
      token: this.$cookie.get('token'),
      dataForm: {
        id: 0,
        name: '',
        teamTypeId: '',
        peopleNumber: '',
        qualificationLevel: '',
        creationTime: '',
        nature: '',
        level: '',
        secretLevel: '',
        areaCode: '',
        postalCode: '',
        fax: '',
        longitude: '',
        latitude: '',
        address: '',
        duties: '',
        specialty: '',
        equipment: '',
        remark: '',
        // groupId: '',
        unitAddress: '',
        coordinateType: '',
        preparationTime: '',
        telephoneNum: '',
        rescueExperience: '',
        communicationMethod: '',
        isDeleted: '',
        createUserId: '',
        gmtCreate: '',
        modifiedUserId: '',
        gmtModified: '',
        platformId: '',
        // teamTypeParentName: "",
        teamClassName: '',
        teamTypeName: '',
        // unitParentName: "",
        teamGroup: '',
        responsiblesName: '',
        responsibles: [],
        contactsName: '',
        contacts: [],
        contactsList: [],
        responsiblesList: [],
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
    init(id) {
      this.dataForm.id = id;
      // 显示弹窗
      this.showDeviceData = {
        monitor: [],
        room: [],
        colony: [],
        // wecomm: [],
        app: [],
      };
      this.$refs.dialog.visible = true;
      this.getData(this.dataForm.id);
    },
    /**
       * @method
       * @desc 获取基本信息页面的信息
       * @param {String} id 数据的id
       */
    getData(id) {
      this.loading = true;
      const request = {
        method: 'get',
        url: this.$http.adornUrl(
          `/resoure/resoureteam/info/${this.dataForm.id}`,
        ),
        baseURL: window.SITE_CONFIG.baseUrl,
        // params: {
        //     // id: this.dataForm.id,
        //     // token: this.token
        // }
        params: this.$http.adornParams(),
      };
      this.$http(request)
        .then((response) => {
          console.log('/resoure/resoureteam/info', response);
          if (response.data.code === 0) {
            Object.assign(this.dataForm, response.data);
            this.dataForm = response.data.resoureTeam;
            response.data.resources.forEach((item) => {
              const typeChange = parseInt(item.type, 10) - 9;
              const arrType = this.deviceTypeObj[typeChange];
              item.data.forEach((item1) => {
                const o = {};
                o.id = item1.entity.id;
                o.name = item1.entity.name;
                o.isDefault = item1.isDefault;
                o.type = typeChange;
                this.showDeviceData[arrType].push(o);
              });
            });
            // console.log("this.dataForm.areaTypeId", this.dataForm.areaTypeId)
            // console.log("this.dataForm.contactsId", this.dataForm.contactsId)
            console.log('获取信息成功', response.data);
            console.log('this.dataForm', this.dataForm);
          } else {
            console.log('获取id =', id, '的详情失败！错误信息：【\n', response, '\n】');
          }
          this.loading = false;
        })
        .catch((error) => {
          console.log('获取id =', id, '的详情失败！错误信息：【\n', error, '\n】');
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
      width: 115px;
      text-align: center;
      border: 1px dashed #0091ff;
      padding: 0px 5px;
    }
    .related_btn {
      opacity: 0;
      text-align: center;
      border: 1px dashed #000000;
      padding: 0 5px;
      height: 30px;
      width: 80px;
      cursor: pointer;
      margin-right: 10px;
    }
    .position {
      opacity: 1;
      text-align: center;
      border: 1px dashed #000000;
      padding: 0 5px;
      height: 30px;
      width: 80px;
      cursor: pointer;
      margin-right: 10px;
    }
    .deviceName_default {
      width: 385px;
      padding-left: 10px;
      color: #0091ff;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .deviceName {
      width: 490px;
      padding-left: 10px;
      color: #0091ff;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
