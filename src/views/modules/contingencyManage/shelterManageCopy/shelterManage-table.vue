<template>
  <div class="resoureteam-table-wrap" style="padding:3px;height:583px;margin-top:20px;width:100%;margin: 0px;">
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
      <el-table-column
        type="selection"
        header-align="center"
        align="center">
      </el-table-column>

      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="场所名称" :show-overflow-tooltip="true">
      </el-table-column>

      <el-table-column
        prop="address"
        header-align="center"
        align="center"
        label="所在区域" :show-overflow-tooltip="true">
      </el-table-column>

      <el-table-column
        prop="feature"
        header-align="center"
        align="center"
        label="场所功能"  :show-overflow-tooltip="true">
      </el-table-column>

      <el-table-column
        header-align="center"
        align="center"
        label="联系人"
        :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.contactorlist.length>0?scope.row.contactorlist.map(item=>{return item.name}).join(','):''}}
        </template>
      </el-table-column>

      <el-table-column
        header-align="center"
        align="center"
        label="联系人电话"  :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.contactorlist.length>0?scope.row.contactorlist.map(item=>{return item.mobile1}).join(','):''}}
        </template>
      </el-table-column>

      <el-table-column
        header-align="center"
        align="center"
        width="230"
        label="操作">
        <template slot-scope="scope">
          <div class="opration">
          <span type="info" @click="addOrUpdateHandle(scope.row,'watch')" style="border:none;background:none;color:#479DFF;font-size: 12px;font-family: MicrosoftYaHei;font-weight: bold;cursor: pointer;">查看</span>
          <span type="primary" @click="addOrUpdateHandle(scope.row,'modify')" style="border:none;background:none;color:#76D672;font-size: 12px;font-family: MicrosoftYaHei;font-weight: bold;cursor: pointer;">修改</span>
          <span type="danger" @click="batchDelete(scope.row.id)" style="border:none;background:none;color:#e65c6d;font-size: 12px;font-family: MicrosoftYaHei;font-weight: bold;cursor: pointer;">删除</span>
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
    return {};
  },
  methods: {
    ifendcase(row, column){
      // console.log('ifendcase',row, column)
      if(column.property==="nature"){
        //1:专职 2:兼职 3:专业志愿者
        return row.nature===1?'专职':(row.nature===2?'兼职':'专业志愿者');
      }
      if(column.property==="level"){
        //1:国家级2:省级3:市级 4:县级 5:乡镇级 6:其他
        return row.level===1?'国家级':(row.nature===2?'省级':(row.nature===3?'市级':(row.nature===4?'县级':(row.nature===5?'乡镇级':'其他'))));
      }
      if(column.property==="secretLevel"){
        //1机密 2秘密 3限制  4公开  5其他
        return row.secretLevel===1?'机密':(row.secretLevel===2?'秘密':(row.secretLevel===3?'限制':(row.secretLevel===4?'公开':'其他')));
      }

    },
    //tableRowClassName 为 Table 中的某一行添加 class
     tableRowClassName({row, rowIndex}) {
        if (!row.openId) {
          return 'warning-row';
        } else {
          return 'success-row';
        }
        return '';
      },
    //查看 / 修改
    addOrUpdateHandle(val, staus) {
      this.$emit("seeOrUpdateHandle", val, staus);
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
.resoureteam-table-wrap {


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

