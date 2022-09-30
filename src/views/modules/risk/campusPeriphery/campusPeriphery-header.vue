<template>
  <div style="min-width: 1350px;height:56px;padding:10px">
    <el-form>
      <el-form-item style="display: flex;margin:0">
        <el-select
          v-model="validFlag"
          clearable
          placeholder="请选择有效标志"
          style="min-width:80px;width:8vw"
          size="small"
        >
          <el-option label="有效" value="1"></el-option>
          <el-option label="无效" value="2"></el-option>
        </el-select>

        <el-select
          v-model="shareTownId"
          filterable
          default-first-option
          clearable
          @change="handleChangeTown"
          placeholder="请选择镇街"
          style="min-width:110px;width:7vw"
          size="small"
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
          placeholder="请选择校园"
          style="min-width:110px;width:7vw"
          size="small"
        >
          <el-option
            v-for="item in sharePlatform"
            :key="item.linkagePlatformId"
            :label="item.platformName"
            :value="item.linkagePlatformId"
          ></el-option>
        </el-select>

        <el-cascader
          :props="eventtypeProps"
          :options="eventtypelist"
          v-model="eventTypeId"
          clearable
          placeholder="请选择工单类型"
          size="small"
        ></el-cascader>

        <el-date-picker
          unlink-panels
          v-model="value3"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="min-width:350px;width:20vw;"
          size="small"
        ></el-date-picker>

        <!--<el-input style="width:300px;" v-model="value4" placeholder="请输入内容">
          <el-button slot="append" icon="el-icon-search  style='width:300px;'" @click="searchHandle()" style="background: #409eff;color: #fff;"></el-button>
        </el-input>-->
        <el-input
          style="min-width:106px;width:9vw;"
          v-model="value4"
          placeholder="请输入内容"
          clearable
          size="small"
        ></el-input>
        <!-- <el-select v-model="status" clearable placeholder="请选择状态" size="small">
          <el-option label="待核实" value="1"></el-option>
          <el-option label="核实中" value="2"></el-option>
          <el-option label="待处理" value="3"></el-option>
          <el-option label="处理中" value="4"></el-option>
          <el-option label="已处理" value="5"></el-option>
          <el-option label="超出范围" value="6"></el-option>
        </el-select> -->
        <el-button
          @click="searchHandle()"
          style="background: #409eff;color: #fff;"
          type="primary"
          size="small"
        >搜索</el-button>
        <el-button
          @click="switchingMode()"
          v-if="!switchView"
          style="background: #409eff;color: #fff;margin-left:0"
          type="primary"
          size="small"
        >列表模式</el-button>
        <el-button
          @click="switchingMode()"
          v-else
          style="background: #409eff;color: #fff;"
          type="primary"
          size="small"
        >卡片模式</el-button>

        <el-button
          @click="exportEventData()"
          style="background: #409eff;color: #fff;margin-left: initial;"
          type="primary"
          size="small"
        >导出</el-button>

        <el-button
          @click="statisticalEventData()"
          style="background: #409eff;color: #fff;margin-left: initial;"
          type="primary"
          size="small"
        >统计</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  // headFlag = 1显示新增按钮，事件要接报，其他不显示
  props: ["headData", "headFlag", "platformTypeId", "switchView"],
  data() {
    return {
      //有效标志
      validFlag: "1",

      //搜索数据
      value3: "",
      value4: "",

      //共享镇街
      shareTown: [],

      //共享平台数据
      sharePlatform: [],

      //状态值
      status: "",

      //工单类型数据
      eventtypelist: [],
      eventtypeProps: {
        children: "children",
        label: "name",
        value: "id",
      },

      //共享镇街id
      shareTownId: "",

      // 共享平台id
      sharePlatformId: "",

      //共享平台与其他平台共用的平台id
      myAndSharePlatformId: "",

      // 类型id
      eventTypeId: "",
    };
  },

  mounted() {
    //类型初始化
    this.handleChangePlatform();
    // 表格数据
    this.getTownList();
  },

  methods: {
    addOrUpdateHandle() {
      this.$emit("addOrUpdateHandle", null, 2);
    },
    searchHandle() {
      this.$emit(
        "searchHandle",
        this.validFlag,
        this.value3,
        this.value4,
        this.sharePlatformId,
        this.eventTypeId,
        this.shareTownId,
        this.status
      );
    },
    exportEventData() {
      this.$emit(
        "exportEventData",
        this.validFlag,
        this.value3,
        this.value4,
        this.sharePlatformId,
        this.eventTypeId,
        this.shareTownId
      );
    },
    getTownList() {
      //console.log('本平台用户信息:', this.$store.state.user)
      // console.log('本平台的路由:',this.$route.meta.menuId)
      this.$http({
        url: this.$http.adornUrl("/sys/systown/list"),
        method: "post",
        params: this.$http.adornParams(),
      })
        .then(({ data }) => {
          // console.log('getTownList', data)

          // 说明有共享数据
          if (data.list.length > 0) {
            this.shareTown = data.list;
          }
        })
        .then(() => {});
    },

    //镇街决定平台
    handleChangeTown() {
      // console.log("shareTownId",this.shareTownId)
      if (this.shareTownId != null && this.shareTownId != "") {
        this.$http({
          url: this.$http.adornUrl("/event/eventShare/selectSameTypeShareInfo"),
          method: "post",
          params: this.$http.adornParams({
            townId: this.shareTownId,
            myPlatformId: this.$store.state.user.platformId,
            platformTypeId: this.platformTypeId,
          }),
        })
          .then(({ data }) => {
            // console.log('getSharePlatformList', data)

            // 说明有共享数据
            if (data.list.length > 0) {
              this.sharePlatform = data.list;
            } else {
              this.sharePlatformId = "";
              this.sharePlatform = [];
              //重新初始化事件类型
              //this.eventTypeId = '';
              //this.eventtypelist = [];
            }
          })
          .then(() => {});
      } else {
        this.sharePlatformId = "";
        this.sharePlatform = [];
        //重新初始化事件类型
        //this.eventTypeId = '';
        //this.eventtypelist = [];
      }
    },

    //平台决定事件类型
    handleChangePlatform() {
      //if(this.sharePlatformId != null && this.sharePlatformId != ''){

      this.$http({
        url: this.$http.adornUrl("/wechatMobile/selectTypeListByPlatformId"),
        method: "post",
        params: this.$http.adornParams({
          platformTypeId: 6,
        }),
      }).then(({ data }) => {
        //请求的事件类型数据
        if (data.list.length > 0) {
          this.eventtypelist = data.list;
        } else {
          //this.sharePlatformId = '';
          this.eventTypeId = "";
          this.eventtypelist = [];
        }
      });

      //}else{
      //this.sharePlatformId = '';
      //this.eventTypeId = '';
      //this.eventtypelist = [];
      //}
    },
    statisticalEventData() {
      this.$router.push({
        path: "/school/statisticalAnalysis/schoolhome",
      });
    },
    // 切换形式
    switchingMode() {
      this.$emit("changeForm");
    },
  },
};
</script>

<style lang="scss" scoped>
  /deep/ .el-button--medium {
    padding: 10px !important;
  }
</style>
