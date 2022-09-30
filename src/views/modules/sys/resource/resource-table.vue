<template>
  <div class="resource-table-wrap" style="padding:3px;height:583px;margin-top:20px;width:100%;margin: 0px;">
    <el-table
      @selection-change="handleSelectionChange"
      :data="dataList"
      stripe
      border 
      style="width: 100%;"
      height="640px"
      :header-cell-style="{
        background: '#E6E6E6 ',
        color: '#555',
        border: '1px solid #fff'
      }"
      :cell-style="{ border: '1px solid #fff' }"
      :row-class-name="tableRowClassName"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <!-- <el-table-column
        prop="id"
        sortable
        header-align="center"
        align="center"
        width="100"
        label="ID"
      >
      </el-table-column> -->
      <el-table-column
        sortable
        prop="name"
        header-align="center"
        align="center"
        width="120"
        :show-overflow-tooltip="true"
        label="物资名称"
      >
      </el-table-column>
      <!-- <el-table-column
        prop="workUnit"
        header-align="center"
        align="center"
        width="200"
        label="工作单位"
      >
      </el-table-column> -->
      <!-- <el-table-column
        prop="officeTel"
        header-align="center"
        align="center"
        width="130"
        label="办公室电话"
      >
      </el-table-column> -->
      <el-table-column
        prop="typeName"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="物资类别"
      >
      </el-table-column>
      <el-table-column
        prop="factory"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="生产厂家"
      >
      </el-table-column>
      <el-table-column
        prop="amount"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="数量"
      >
      </el-table-column>
      <el-table-column
        prop="measureUnit"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="计量单位"
      >
      </el-table-column>
      <el-table-column
        prop="expireTime"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="保质期"
      >
      </el-table-column>
      <el-table-column
        prop="replaceTime"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="需要更换的时间"
      >
      </el-table-column>

      <el-table-column prop="nowStatus" header-align="center" align="center" :show-overflow-tooltip="true" label="现状态">
        <template slot-scope="scope">
          <span v-if="scope.row.nowStatus == '0'" style="color: #3c91ff">可用</span>
          <span v-else-if="scope.row.nowStatus == '1'" style="color: #ffb269">不可用</span>
          <span v-else style="color: #83b8c2">未知</span>
        </template>
      </el-table-column>

       <el-table-column
        header-align="center"
        align="center"
        label="物资图片"
        width="130"
      >
        <template slot-scope="scope">
          <img v-if="scope.row.picPath" :src="scope.row.picPath.indexOf('http') === -1?cloudUrl + scope.row.picPath:scope.row.picPath" style="width:100px;height:100px;">
          <!-- <img v-else :src="scope.row.picPath" style="width:100px;height:100px;"> -->
          <div v-else style="width:100px;height:100px;text-align:center;line-height:100px">无</div>
        </template>
      </el-table-column>

      <!-- <el-table-column
        prop="sex"
        header-align="center"
        align="center"
        label="性别"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.sex === 0" 
            >男</div>
          <div v-else >女</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="mobile1"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="手机号码"
      >
      </el-table-column> -->
      <!-- <el-table-column
        prop="email"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="邮箱地址"
      >
      </el-table-column> -->
      <!-- <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="备注"
      >
      </el-table-column>
      <el-table-column
        sortable
        prop="importance"
        header-align="center"
        align="center"
        width="125"
        :show-overflow-tooltip="true"
        label="紧急联系人"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.importance === 1" size="small">是</el-tag>
          <el-tag v-else size="small" type="danger"
            >否</el-tag
          >
          
        </template>
      </el-table-column>
      <el-table-column
        sortable
        prop="commonlyUsed"
        header-align="center"
        align="center"
        width="125"
        :show-overflow-tooltip="true"
        label="常用联系人"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.commonlyUsed === 1" size="small">是</el-tag>
          <el-tag v-else size="small" type="danger"
            >否</el-tag
          >
          
        </template>
      </el-table-column> -->
      
      
      <!--隐藏宽-->
      <!-- <el-table-column prop="myPlatformId" v-if="false" label="本级平台id"> -->
      <!-- </el-table-column> -->

      <el-table-column
        header-align="center"
        align="center"
        width="220"
        label="操作"
      >
        <template slot-scope="scope">
          <div class="opration">
          <span
            v-if="isAuth('resoure:resourearticle:info')"
            @click="addOrUpdateHandle(scope.row.id, 0)"
            style="border:none;background:none;color:#479DFF;font-size: 12px;font-family: MicrosoftYaHei;font-weight: bold;cursor: pointer;"
            >查看</span
          >
          <span
            v-if="isAuth('resoure:resourearticle:update')"
            @click="addOrUpdateHandle(scope.row.id, 1)"
            style="border:none;background:none;color:#76D672;font-size: 12px;font-family: MicrosoftYaHei;font-weight: bold;cursor: pointer;"
            >修改</span
          >
          <span
            v-if="isAuth('resoure:resourearticle:delete')"
            @click="batchDelete(scope.row)"
            style="border:none;background:none;color:#e65c6d;font-size: 12px;font-family: MicrosoftYaHei;font-weight: bold;cursor: pointer;"
            >删除</span
          >
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: ["dataList"],
  //表格内容
  data() {
    return {
      cloudUrl: window.SITE_CONFIG.cloudUrl,
    };
  },
  mounted(){
    // console.log('dataListdataListdataListdataListdataList',this.dataList)
  },
  methods: {
    //tableRowClassName 为 Table 中的某一行添加 class
     tableRowClassName({row, rowIndex}) {
        if (!row.openId) {
          return 'warning-row';
        } else {
          return 'success-row';
        }
        return '';
      },
    //查看，修改
    addOrUpdateHandle(id, staus) {
      this.$emit("addOrUpdateHandle", id, staus);
    },
    //修改
    handleSelectionChange(val) {
      this.$emit("handleSelectionChange", val);
    },
    //删除
    batchDelete(row) {
      this.$emit("batchDelete", row);
    }
  }
};
</script>

<style lang="less">
.resource-table-wrap {
  // /deep/ .el-table--scrollable-x .el-table__body-wrapper,.el-table--scrollable-y .el-table__body-wrapper{
  //   &::-webkit-scrollbar{
  //   width:10px;
  //   height:10px;
  //   /**/
  //   }
  //   &::-webkit-scrollbar-track{
  //     background: rgb(239, 239, 239);
  //     border-radius:2px;
  //   }
  //   &::-webkit-scrollbar-thumb{
  //     background: #bfbfbf;
  //     border-radius:10px;
  //   }
  //   &::-webkit-scrollbar-corner{
  //     background: #179a16;
  //   }
  // }

  .el-table .success-row {
    // background: #f0f9eb;
  }
  .el-table::before {
    height: 0px;
  }
  .el-table__header .has-gutter tr > th {
    background: rgba(230, 230, 230, 1) !important;
  }
  .el-table th {
    background: rgba(230, 230, 230, 1) !important;
  }
  .el-table__body tbody > :nth-child(2n) {
    background: rgba(230, 230, 230, 1);
  }
  .el-button--default {
    border-radius: 3px;
    width: 88px;
  }
  .cell {
    .el-button--info {
      background-color: transparent;
      border: none;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      font-weight: bold;
      color: rgba(71, 157, 255, 1);
    }
    .el-button--primary {
      background-color: transparent;
      border: none;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      font-weight: bold;
      color: rgba(118, 214, 114, 1);
    }
    .el-button--danger {
      background-color: transparent;
      border: none;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      font-weight: bold;
      color: rgba(230, 115, 128, 1);
    }
  }
  .el-pagination {
    display: flex;
    justify-content: center;
  }
  .opration{
    display: flex;
    justify-content: space-around;
  }
}
</style>

