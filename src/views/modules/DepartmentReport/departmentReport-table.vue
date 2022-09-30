<template>
  <div class="resource-table-wrap" style="padding:3px;height:583px;margin-top:20px;width:100%;margin: 0px;">
    <el-table
      @selection-change="handleSelectionChange"
      :data="dataList"
      stripe
      border 
      style="width: 100%;"
      height="583px"
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
        prop="imName"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="姓名"
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
        prop="credentialsNum"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="身份证号码"
      >
      </el-table-column>
      <el-table-column
        prop="factory"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="籍贯"
      >
      </el-table-column>
      <el-table-column
        prop="humanType"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="人员类型"
        :formatter="ifendcase"
      >
      </el-table-column>
      <el-table-column
        prop="detailedAddress"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="现居住地址"
      >
      </el-table-column>
      <el-table-column
        prop="workplace"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="属地单位"
      >
      </el-table-column>
      <el-table-column
        prop="phone"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="联系电话"
      >
      </el-table-column>
      <el-table-column
        prop="nowStatus"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="登记单位数"
      >
      </el-table-column>

       <el-table-column
       prop="gmtModified"
        header-align="center"
        align="center"
        label="最新排查时间"
        :show-overflow-tooltip="true"
      >
        <!-- <template slot-scope="scope">
          <img :src="baseUrl + scope.row.picPath" style="width:100px;height:100px;">
        </template> -->
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
          <el-button
            v-if="isAuth('resoure:resourearticle:info')"
            type="info"
            size="mini"
            @click="addOrUpdateHandle(scope.row.id, 0,scope.row)"
            >查看</el-button
          >
          <!-- <el-button
            v-if="isAuth('resoure:resourearticle:update')"
            type="primary"
            size="mini"
            @click="addOrUpdateHandle(scope.row.id, 1)"
            >修改</el-button
          >
          <el-button
            v-if="isAuth('resoure:resourearticle:delete')"
            type="danger"
            size="mini"
            @click="batchDelete(scope.row.id)"
            >删除</el-button
          > -->
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
      baseUrl: window.SITE_CONFIG.baseUrl+'/'
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
    addOrUpdateHandle(id, staus,obj) {
      this.$emit("addOrUpdateHandle", id, staus,obj);
    },
    //修改
    handleSelectionChange(val) {
      this.$emit("handleSelectionChange", val);
    },
    //删除
    batchDelete(row) {
      this.$emit("batchDelete", row);
    },
    ifendcase(val){
      if(val.humanType == '1'||val.humanType == '0'){return "本地常驻"}
      if (val.humanType == '2'){return "外地返回"}
        
    }
  }
};
</script>

<style lang="less">
.resource-table-wrap {
  /deep/ .el-table--scrollable-x .el-table__body-wrapper,.el-table--scrollable-y .el-table__body-wrapper{
    &::-webkit-scrollbar{
    width:10px;
    height:10px;
    /**/
    }
    &::-webkit-scrollbar-track{
      background: rgb(239, 239, 239);
      border-radius:2px;
    }
    &::-webkit-scrollbar-thumb{
      background: #bfbfbf;
      border-radius:10px;
    }
    &::-webkit-scrollbar-corner{
      background: #179a16;
    }
  }

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
}
</style>

