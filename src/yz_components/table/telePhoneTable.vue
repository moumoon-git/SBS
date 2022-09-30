<template>
  <el-table ref="singleTable" :data="tableData" highlight-current-row
            max-height="586px"
            :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
            @row-click="handleRowClick"
            @row-dblclick="handleRowDbClick"
            style="height: 614px;">
    <el-table-column type="index" width="50" :resizable="false"></el-table-column>
    <el-table-column   show-overflow-tooltip
                     v-for="(item,key) in tableColumn" :key="key" :label="item.label" :prop="item.prop"
                     :width="item.width" :resizable="false"></el-table-column>
    <el-table-column label="操作" width="175">
      <template slot-scope="scope" >
        <el-button type="info" size="mini" @click="handleDial(scope.row)">拨号</el-button>
        <el-button type="info" v-if="setToCommonIsShow" size="mini" @click="handSetToCommon(scope.row)">设为常用</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    name: "telephoneTable",
    props: ["tableColumn", "tableData"],
    data(){
      return{
        setToCommonIsShow:false
      }
    },
    methods: {
      handleRowClick(row,column,event) {
        this.$emit("handleRowClick",row)
      },
      handleRowDbClick(row){
        this.$emit("handleRowDbClick",row);
      },
      handleDial(row) {
        this.$emit("handleDial",row)
      },
      handSetToCommon(row){
          let data = {contactorId:row.id};
          this.$api.usedContactor(data).then(res=>{
            if (res.errorcode!=0){
              this.$message.error(res.msg);
              return;
            }
            this.$message.success("已设为常用联系人!");
          });
      }
    }
  }
</script>

<style scoped>
  >>> .el-table__body tr.current-row > td {
    color: #479DFF;
  }

  >>>.el-table--enable-row-hover .el-table__body tr.hover>td{
    background-color: #E3F0FF !important;
  }


</style>
