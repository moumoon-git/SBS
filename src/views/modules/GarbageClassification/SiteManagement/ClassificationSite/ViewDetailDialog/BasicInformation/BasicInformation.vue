<template>
  <div
    class="basic-information"
    v-if="visible"
    v-loading="loading"
    element-loading-spinner="sv-loading"
  >
    <div class="basic-information__left">
      <div class="basic-information__left__item">
        <div class="basic-information__left__item__label">分类点状态</div>
        <div class="basic-information__left__item__content">
          <span class="icon" v-if="formData.status == '1'">正常</span>
          <span class="icon yellow" v-else-if="formData.status == '2'"
            >黄牌</span
          >
          <span class="icon red" v-else-if="formData.status == '3'">红牌</span>
          <span class="icon grey" v-else-if="formData.status == '4'">拒收</span>
          <span class="icon blue" v-else-if="formData.status == '5'"
            >责令整改</span
          >
          <span class="icon pink" v-else-if="formData.status == '6'"
            >行政处罚</span
          >
        </div>
      </div>
      <div class="basic-information__left__item">
        <div class="basic-information__left__item__label">分类点照片</div>
        <div class="basic-information__left__item__content">
          <viewer
            :images="
              formData.imgList && formData.imgList.length
                ? formData.imgList.map(e => e.allUrl)
                : []
            "
          >
            <img
              height="80"
              v-for="(img, index) in formData.imgList"
              :key="`img_${index}`"
              :src="img.allUrl"
              :alt="img.name"
            />
          </viewer>
        </div>
      </div>
      <div class="basic-information__left__item">
        <div class="basic-information__left__item__label">收运点名称</div>
        <div class="basic-information__left__item__content">
          {{ formData.name ? formData.name : "" }}
        </div>
      </div>
      <div class="basic-information__left__item">
        <div class="basic-information__left__item__label">所属分组</div>
        <div class="basic-information__left__item__content">
          {{ formData.groupIdName ? formData.groupIdName : "" }}
        </div>
      </div>
      <div class="basic-information__left__item">
        <div class="basic-information__left__item__label">所属社区</div>
        <div class="basic-information__left__item__content">
          {{
            formData.townId
              ? communityList.find(element => element.value == formData.townId)
                  .label
              : ""
          }}
        </div>
      </div>
      <div class="basic-information__left__item">
        <div class="basic-information__left__item__label">城中村/小区名</div>
        <div class="basic-information__left__item__content">
          {{ formData.village ? formData.village : "" }}
        </div>
      </div>
      <div class="basic-information__left__item">
        <div class="basic-information__left__item__label">小区性质</div>
        <div class="basic-information__left__item__content">
          <span v-if="formData.villageType == '1'">物业小区</span>
          <span v-if="formData.villageType == '2'">非物业小区</span>
          <span v-if="formData.villageType == '3'">商城投放点</span>
        </div>
      </div>
      <div class="basic-information__left__item">
        <div class="basic-information__left__item__label">投放点位置</div>
        <div class="basic-information__left__item__content">
          {{ formData.place ? formData.place : "" }}
        </div>
      </div>
      <div class="basic-information__left__item">
        <div class="basic-information__left__item__label">负责人</div>
        <div class="basic-information__left__item__content">
          <span class="basic-information__left__item__tag">
            {{
              formData.mailContactor && formData.mailContactor.name
                ? formData.mailContactor.name
                : ""
            }}
            {{
              formData.mailContactor && formData.mailContactor.mobile1
                ? `（${formData.mailContactor.mobile1}）`
                : ""
            }}
          </span>
        </div>
      </div>
      <div class="basic-information__left__item">
        <div class="basic-information__left__item__label">投放点模式</div>
        <div class="basic-information__left__item__content">
          <span v-if="formData.launchType == '1'">定时投放点</span>
          <span v-if="formData.launchType == '2'">误时投放点</span>
        </div>
      </div>
      <div class="basic-information__left__item">
        <div class="basic-information__left__item__label">投放时间</div>
        <div class="basic-information__left__item__content">
          <div
            v-for="(item, index) in formData.launchTimeList"
            :key="`launch_time_${index}`"
          >
            <span style="display:inline-block;width:45px;">{{
              item.startTime
            }}</span>
            <span>至</span>
            <span style="display:inline-block;width:45px;text-align:right;">{{
              item.endTime
            }}</span>
          </div>
        </div>
      </div>
      <div class="basic-information__left__item">
        <div class="basic-information__left__item__label">联系人</div>
        <div class="basic-information__left__item__content">
          <span class="basic-information__left__item__tag">
            {{
              formData.mailContactorEntity && formData.mailContactorEntity.name
                ? formData.mailContactorEntity.name
                : ""
            }}
            {{
              formData.mailContactorEntity &&
              formData.mailContactorEntity.mobile1
                ? `（${formData.mailContactorEntity.mobile1}）`
                : ""
            }}
          </span>
        </div>
      </div>
      <div class="basic-information__left__item">
        <div class="basic-information__left__item__label">巡查巡检项目</div>
        <div class="basic-information__left__item__content">
          <span
            class="basic-information__left__item__tag"
            v-for="(item, index) in formData.investigationInforList"
            :key="`item_${index}`"
          >
            {{ item.name }}
          </span>
        </div>
      </div>
      <div class="basic-information__left__item">
        <div class="basic-information__left__item__label">守桶人员委派方</div>
        <div class="basic-information__left__item__content">
          <span v-if="formData.delegating == '1'">物业</span>
          <span v-else-if="formData.delegating == '2'">环卫</span>
        </div>
      </div>
      <div class="basic-information__left__item">
        <div class="basic-information__left__item__label">投放点位置描述</div>
        <div class="basic-information__left__item__content">
          {{ formData.remark ? formData.remark : "" }}
        </div>
      </div>
      <div class="basic-information__left__item">
        <div class="basic-information__left__item__label">摄像头</div>
        <div class="basic-information__left__item__content">
          <span
            class="basic-information__left__item__tag"
            v-for="(item, index) in formData.riskCameraEntities"
            :key="`monitor_${index}`"
          >
            {{ item.name }}
          </span>
        </div>
      </div>
    </div>
    <div class="basic-information__right">
      <Location
        :address="formData.place"
        :lngLat="[formData.longitude, formData.latitude]"
        :displayOnly="true"
      />
    </div>
  </div>
</template>

<script>
// 地图定位
import Location from "../../Location/Location.vue";

export default {
  name: "BasicInformation",
  components: {
    Location
  },
  props: {},
  data() {
    return {
      visible: false,
      loading: false,
      formData: {},
      communityList: []
    };
  },
  methods: {
    init(id, communityList) {
      this.visible = true;
      this.getData(id);
      this.communityList = communityList;
    },
    /**
     * @method
     * @desc 获取基本信息页面的信息
     * @param {String} id 数据的id
     */
    getData(id) {
      this.loading = true;
      const request = {
        method: "get",
        url: "/garbage/garbageSortPoint/info",
        baseURL: window.SITE_CONFIG.baseUrl,
        params: {
          id,
          token: this.token
        }
      };
      this.$http(request)
        .then(response => {
          if (response.data.code == 0) {
            Object.assign(this.formData, response.data.data);
          } else {
            console.log(
              "获取id =",
              id,
              "的详情失败！错误信息：【\n",
              response,
              "\n】"
            );
          }
          this.loading = false;
        })
        .catch(error => {
          console.log(
            "获取id =",
            id,
            "的详情失败！错误信息：【\n",
            error,
            "\n】"
          );
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.basic-information {
  display: flex;
  justify-content: center;
  align-items: stretch;
  &__left {
    * {
      line-height: 1.5;
    }
    width: 440px;
    min-height: 700px;
    padding: 10px 0;
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
      &__content {
        flex-grow: 1;
        color: #333333;
        .icon {
          font-size: 12px;
          color: #16c88b;
          background: #e8f9f4;
          border-radius: 5px;
          padding: 2px 10px;
          &.yellow {
            color: #f8b10c;
            background: #fff8ea;
          }
          &.red {
            color: #f94e36;
            background: #ffefed;
          }
          &.grey {
            color: #000000;
            background: #e6e6e6;
          }
          &.blue {
            color: #368bf9;
            background: #ecf5fc;
          }
          &.pink {
            color: #ff8171;
            background: #ffffff;
            border: 1px solid #ff8171;
          }
        }
      }
      &__tag {
        border: 1px solid #e0e0e0;
        border-radius: 3px;
        padding: 0 10px;
        background: #fafafa;
        margin: 0 5px 5px 0;
        display: inline-block;
        // word-break: keep-all;
      }
      img {
        margin: 0 10px 10px 0;
        cursor: zoom-in;
      }
    }
  }
  &__right {
    flex: 1;
    padding: 20px;
  }
}
</style>