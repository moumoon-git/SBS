<!--
 * @Author: yanghaohao
 * @Date: 2020-09-16 10:02:52
 * @LastEditTime: 2020-12-16 14:12:15
 * @LastEditors: liukanglin
 * @Description:垃圾分类的宣传教育页面
 * @FilePath: \product_SBS\src\views\modules\GarbageClassification\PublicityEducation\PublicityEducation.vue
-->

<template>
  <div>
    <sv-template
      ref="template"
      title="宣传教育"
      :tableRequest="tableRequest"
      @refresh="getStatisticData"
      :searchSetting="{
        width:'260px',
        placeholder:'请输入宣传点、负责人名字关键字'
      }"
    >
      <template #left__container>
        <div></div>
      </template>
      <template #middle__operation__select>
        <sv-select
          :options="communityOptions"
          v-model="communitySelect"
          placeholder="请选择社区"
          @change="typeChange"
        ></sv-select>
      </template>
      <!-- <template #middle__operation__button>
        <sv-button type="primary" @click="searchTable">查询</sv-button>
      </template> -->
      <template #middle__statistics>
        <table class="statistic_table">
          <span class="statistic">
            <td class="span_td">{{ statisticList.activityTime }}</td>
            <tr class="span_tr">
              宣传次数
            </tr>
          </span>
           <span class="span_line"></span>
          <span class="statistic">
            <td class="span_td">{{ statisticList.pensonTime }}</td>
            <tr class="span_tr">
              投入人次
            </tr></span
          >
           <span class="span_line"></span>
          <span class="statistic">
            <td class="span_td">{{ statisticList.answerTime }}</td>
            <tr class="span_tr">
              宣教人次
            </tr></span
          >
           <span class="span_line"></span>
          <span class="statistic">
            <td class="span_td">
              <span v-if="statisticList.accuracy != 0">{{ parseFloat(statisticList.accuracy).toFixed(1) }}%</span>
              <span v-if="statisticList.accuracy == 0">{{ statisticList.accuracy }}%</span>
            </td>
            <tr class="span_tr">
              宣传知晓率
            </tr>
          </span>
        </table>
      </template>
      <template #middle__table>
        <el-table-column
          prop="name"
          header-align="center"
          align="center"
          label="活动名称"
        ></el-table-column>
        <el-table-column
          prop="place"
          header-align="center"
          align="center"
          label="宣传地点"
        ></el-table-column>
        <el-table-column
          prop="townIdString"
          header-align="cneter"
          align="center"
          label="所属社区"
        ></el-table-column>
        <el-table-column
          prop="personTime"
          header-align="center"
          align="center"
          label="投入人次"
        ></el-table-column>
        <el-table-column
          prop="answerTime"
          header-align="center"
          align="center"
          label="宣教人次"
        ></el-table-column>
        <el-table-column
          prop="contactorName"
          header-align="center"
          align="center"
          label="宣教负责人"
        ></el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="宣传知晓率"
        >
        <template slot-scope="scope">
           <span v-if="scope.row.accuracy != 0">{{parseFloat(scope.row.accuracy).toFixed(1)}}%</span>
           <span v-if="scope.row.accuracy == 0">{{scope.row.accuracy}}%</span>
        </template>
        
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          width="150"
          label="操作"
        >
          <template slot-scope="scope">
            <sv-table-operation
              :display="['view']"
              @view="viewContent(scope.row)"
            ></sv-table-operation>
          </template>
        </el-table-column>
      </template>
    </sv-template>
    <el-dialog
      width="1000px"
      title="宣传教育记录"
      :visible.sync="dialogLookVisible"
      class="add-task-dialog"
      @closed="closeDialog"
    >
      <div class="container_front">
        <div class="first_row">
          <span class="row_span1"
            >宣传地点：<span class="font_color1">{{ place }}</span></span
          >
          <span class="row_span"
            >宣传时间：<span class="font_color">{{ gmtCreate }}</span></span
          >
          <span class="row_span"
            >负责人：<span class="font_color">{{ contactorName }}</span></span
          >
        </div>
        <div class="second_row">
          <span class="row_span"
            >投入人次：<span class="font_color">{{ personTime }}</span></span
          >
          <span class="row_span"
            >宣传人次：<span class="font_color">{{ answerTime }}</span></span
          >
          <span class="row_span"
            >知晓率：<span class="font_color">{{ accuracy }}%</span></span
          >
        </div>
      </div>
      <div class="container_middle">
        <div class="middle_title">宣传情况</div>
        <div class="middle_remark">{{ remark }}</div>
      </div>

      <div class="container_bottom">
        <div class="bottom_title">宣传照片</div>
        <div class="container_bottom_img">
          <viewer>
            <img
              class="bottom_img"
              v-for="(item, index) in imgList"
              :key="index"
              :src="item.allUrl"
              alt
            />
          </viewer>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //选择的社区
      communitySelect: "",
      //社区列表数据
      communityOptions: [],
      //保存统计数据
      statisticList: "",
      //查看弹窗
      dialogLookVisible: false,
      //弹窗数据
      place: "",
      gmtCreate: "",
      contactorName: "",
      personTime: "",
      answerTime: "",
      remark: "",
      accuracy: "",
      imgList: [
        {
          url: "",
          name: "",
        },
      ],
      //使用自定义模板参数

      tableRequest: {
        api: '/garbage/garbageActivity/pcList',
        params: {
          townId: this.communitySelect,
          memberId: '',
          noMember: '',
        },
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getCommunityType();
    });
  },
  methods: {
    /**
     * @description: 获取社区下拉框列表数据
     * @param {type}
     * @return {type}
     */
    getCommunityType() {
      this.$http({
        url: this.$http.adornUrl("/sys/systown/treeList"),
        method: "post",
        params: this.$http.adornParams({
          module: "1",
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          data.list.forEach((item) => {
            item.children.forEach((item) => {
              this.communityOptions.push({
                value: item.id,
                label: item.townName,
              });
            });
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    /**
     * @description: 获取统计的相关数据
     * @param {type}
     * @return {type}
     */
    getStatisticData(request, response) {
      this.$http({
        url: this.$http.adornUrl(`/garbage/garbageActivity/count`),
        method: "post",
        data: this.$http.adornData({
          search: request.data.search,
          startTime: request.data.startTime,
          endTime: request.data.endTime,
          townId: request.data.townId,
          noMember: request.data.noMember,
          memberId: request.data.memberId,
          page: request.data.page,
          limit: request.data.limit,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.statisticList = data.data;
        } else {
          this.statisticList = [];
          this.$message.error(data.msg);
        }
      });
    },
    /**
     * @description: 查看选择的表格行数据
     * @param {传入当前行的id}
     * @return {type}
     */
    viewContent(data) {
      this.$http({
        url:this.$http.adornUrl(`/garbage/garbageActivity/info/${data.id}`),
        methods:"get",
        params:this.$http.adornParams(),
      }).then(({data}) =>{
         if(data && data.code === 0 ){
            this.imgList = data.data.imgList;
         }
         else{
           this.$message.error(data.msg);
         }

      })



      this.gmtCreate = data.gmtCreate;
      this.contactorName = data.contactorName;
      this.personTime = data.personTime;
      this.accuracy = data.accuracy;
      this.answerTime = data.answerTime;
      this.remark = data.remark;
      this.place = data.place;
      this.dialogLookVisible = true;
      
    },
    /**
     * @description:删除选中的表格的行数据
     * @param {传入当前行id}
     * @return {type}
     */
    deleteContent(val) {},

    /**
     * @description:关闭查看弹窗
     * @param {type}
     * @return {type}
     */
    closeDialog() {
      this.dialogLookVisible = false;
    },
    /**
     * @description: 下拉框变更就更新表格
     * @param {type}
     * @return {type}
     */
    typeChange() {
      this.tableRequest.params.townId = this.communitySelect;
      this.$refs.template.getTableList(this.tableRequest);
    },
    /**
     * @description:查询按钮点击
     * @param {type}
     * @return {type}
     */
    searchTable() {
      this.$refs.template.getTableList(this.tableRequest);
    },
  },
};
</script>
<style lang="less" scoped>
.add-task-dialog {
  font-size: 14px;
  /deep/ .el-dialog {
    border-radius: 5px;
    box-shadow: 0px 0px 23px 3px rgba(201, 201, 201, 0.27);
  }
  //弹窗表头样式
  /deep/ .el-dialog__header {
    height: 40px;
    line-height: 40px;
    background-color: #f1f4f6;
    border-radius: 5px 5px 0px 0px;
    padding:0px;
   /deep/ .el-dialog__title{
      font-size:14px;
      padding-left:20px;
    }
    /deep/.el-dialog__headerbtn{
     top:0px;
    }
  }
  /deep/ .el-dialog__body {
  padding:0px;
    
  }
  .container_front {
    background: rgba(249, 251, 255, 1);
    width: 1000px;
    .first_row {
      padding-top: 20px;
      display:flex;
      .row_span {
        width: 300px;
        display: inline-block;
        color: #999999;
        margin-left: 30px;
      }
      .font_color {
        color: #555555;
      }
       .row_span1 {
       margin-left:30px;
        width: 300px;
        color: #999999;
            .font_color1{
         color:#555555;
     
      }
      }
  
    }
    .second_row {
      margin-top: 20px;
      padding-bottom: 20px;
      white-space: nowrap;
      .row_span {
        width: 300px;
        display: inline-block;
        color: #999999;
        margin-left: 30px;
      }
     
      .font_color {
        color: #555555;
      }
    }
  }
  .container_middle {
    height: 150px;
    padding:20px;
    .middle_title {
      border-left: 3px solid rgba(0, 145, 255, 1);
      font-size: 14px;
      font-weight: bold;
      display: inline-block;
      height: 14px;
      line-height: 14px;
      padding-left: 10px;
    }
    .middle_remark {
      color: #333333;
      display: flex;
      margin-left: 20px;
    }
  }
  .container_bottom {
    padding:20px;
    .bottom_title {
      border-left: 3px solid rgba(0, 145, 255, 1);
      font-size: 14px;
      font-weight: bold;
      display: inline-block;
      height: 14px;
      line-height: 14px;
      padding-left: 10px;
     
    }
    .container_bottom_img{
      padding:10px;
      display: flex;
      
     .bottom_img{
        padding:10px;
        width:120px;
      }}
  }
}
//统计数据行的样式
.statistic_table{
  display: flex;
  flex:1;
  justify-content: space-around;
.statistic {
  font-size: 14px;
  color: #333333;
  padding-left: 70px;
  font-weight: bold;
  display: inline-block;
  height: 50px;
  width: 200px;
  .span_td {
    font-size: 13px;
    color: #333333;
    text-align: center;
  }
  .span_tr {
    color: #999999;
  }
}
     .span_line{
      display: block;
      width: 2px;
      height: 24px;
      margin: 13px 5px;
      background-color: rgba(0,0,0,.05);
    }}
</style>