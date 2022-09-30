<template>
  <div style="min-width: 1350px">
    <el-form>
      <el-form-item
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <!-- <el-select v-model="audited" clearable placeholder="请选择有效标志" style="width:120px;">
          <el-option label="未被人工审核" value="0"></el-option>
          <el-option label="已被人工审核" value="1"></el-option>
        </el-select> -->

        <!-- <el-select
          v-model="shareTownId"
          filterable
          default-first-option
          clearable
          @change="handleChangeTown"
          placeholder="请选择镇街"
          style="width:120px;"
        >
          <el-option
            v-for="item in shareTown"
            :key="item.id"
            :label="item.townName"
            :value="item.id"
          ></el-option>
        </el-select>

        <el-select
          v-model="sharePlatformId"
          filterable
          default-first-option
          clearable
          placeholder="请选择小区"
          style="width:120px;"
        >
          <el-option
            v-for="item in sharePlatform"
            :key="item.linkagePlatformId"
            :label="item.platformName"
            :value="item.linkagePlatformId"
          ></el-option>
        </el-select> -->

        <el-select
          v-if="eventShow"
          v-model="eventTypeId"
          clearable
          placeholder="请选择违规类型"
          size="small"
        >
          <el-option
            v-for="(item, index) in eventtypelist"
            :key="index"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
        <el-date-picker
          v-model="value3"
          unlink-panels
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="small"
        />

        <!-- <el-input style="width:300px;" v-model="value4" placeholder="请输入内容"></el-input> -->
        <el-button
          style="background: #409eff; color: #fff"
          type="primary"
          size="small"
          @click="searchHandle()"
        >
          搜索
        </el-button>

        <!-- <el-button
          @click="exportEventData()"
          style="background: #409eff;color: #fff;margin-left: initial;"
        >导出</el-button> -->

        <!-- <el-button
          @click="statisticalEventData()"
          style="background: #409eff;color: #fff;margin-left: initial;"
        >统计</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  // headFlag = 1显示新增按钮，事件要接报，其他不显示
  props: ['headData', 'headFlag', 'platformTypeId', 'pageType'],
  data() {
    return {
      // 违规类型下拉框是否显示
      eventShow: true,
      // 未被人工审核
      audited: '',

      // 搜索数据
      value3: '',
      value4: '',

      // 共享镇街
      shareTown: [],

      // 共享平台数据
      sharePlatform: [],

      // 工单类型数据
      eventtypelist: [
        { name: '未违规', id: 0 },
        { name: '店外经营', id: 1 },
        { name: '游摊小贩', id: 2 },
        { name: '占道经营', id: 3 },
        { name: '乱堆物堆料', id: 4 },
        { name: '非机动车', id: 5 },
        { name: '户外广告', id: 6 },
        { name: '打包垃圾', id: 7 },
        { name: '违规撑伞', id: 8 },
        { name: '垃圾箱满溢', id: 9 },
        { name: '暴露垃圾', id: 10 },
        { name: '沿街晾晒', id: 11 },
        { name: '人群聚集', id: 13 },
      ],
      eventtypeProps: {
        children: 'children',
        label: 'name',
        value: 'id',
      },

      // 共享镇街id
      shareTownId: '',

      // 共享平台id
      sharePlatformId: '',

      // 共享平台与其他平台共用的平台id
      myAndSharePlatformId: '',

      // 类型id
      eventTypeId: '',
    };
  },

  mounted() {
    // 类型初始化
    // this.handleChangePlatform();
    // 表格数据
    this.getEventtypelist();
    this.getTownList();
    console.log('页面类型', this.pageType);
    if (this.pageType == 'sh') {
      this.eventShow = false;
    }
  },

  methods: {
    addOrUpdateHandle() {
      this.$emit('addOrUpdateHandle', null, 2);
    },
    searchHandle() {
      this.$emit(
        'searchHandle',
        this.audited,
        this.value3,
        this.value4,
        this.sharePlatformId,
        this.eventTypeId,
        this.shareTownId,
      );
    },
    exportEventData() {
      this.$emit(
        'exportEventData',
        this.audited,
        this.value3,
        this.value4,
        this.sharePlatformId,
        this.eventTypeId,
        this.shareTownId,
      );
    },
    getTownList() {
      this.$http({
        url: this.$http.adornUrl('/sys/systown/list'),
        method: 'post',
        params: this.$http.adornParams(),
      })
        .then(({ data }) => {
          // console.log("getTownList", data);

          // 说明有共享数据
          if (data.list.length > 0) {
            this.shareTown = data.list;
          } else {
            this.$message.error(data.msg);
          }
        })
        .then(() => {});
    },

    // 镇街决定平台
    handleChangeTown() {
      // console.log("shareTownId", this.shareTownId);
      if (this.shareTownId != null && this.shareTownId != '') {
        this.$http({
          url: this.$http.adornUrl('/event/eventShare/selectSameTypeShareInfo'),
          method: 'post',
          params: this.$http.adornParams({
            townId: this.shareTownId,
            myPlatformId: this.$store.state.user.platformId,
            platformTypeId: this.platformTypeId,
          }),
        })
          .then(({ data }) => {
            // console.log("getSharePlatformList", data);

            // 说明有共享数据
            if (data.list.length > 0) {
              this.sharePlatform = data.list;
            } else {
              this.sharePlatformId = '';
              this.sharePlatform = [];
              this.$message.error(data.msg);
            }
          })
          .then(() => {});
      } else {
        this.sharePlatformId = '';
        this.sharePlatform = [];
      }
    },

    // //平台决定事件类型
    // handleChangePlatform() {
    //   this.$http({
    //     url: this.$http.adornUrl("/event/eventType/selectCityBadManagement"),
    //     method: "get",
    //     params: this.$http.adornParams({})
    //   }).then(({ data }) => {
    //     //请求的事件类型数据
    //     if (data.list.length > 0) {
    //       this.eventtypelist = data.list;
    //     } else {
    //       //this.sharePlatformId = '';
    //       this.eventTypeId = "";
    //       this.eventtypelist = [];
    //     }
    //   });
    // },
    getEventtypelist() {
      this.$http({
        url: this.$http.adornUrl('/sys/sysdictionary/getSysDictionaryListByCode'),
        method: 'get',
        params: this.$http.adornParams({
          code: 'violation_type',
        }),
      }).then(({ data }) => {
        // 请求的事件类型数据
        if (data.data.length > 0) {
          console.log('事件类型列表', data);
          this.eventtypelist = data.data;
          console.log('eventtypelist', this.eventtypelist);
        } else {
          // this.sharePlatformId = '';
          this.eventTypeId = '';
          this.eventtypelist = [];
        }
      });
    },

    statisticalEventData() {
      this.$router.push({
        path: '/school/statisticalAnalysis/schoolhome',
      });
    },
  },
};
</script>

<style scoped>
</style>
