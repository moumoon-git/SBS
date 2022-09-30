<template>
    <el-table  ref="singleTable" :data="tableData"
               :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
               @row-click="handleCurrentChange"
               @cell-dblclick="handleCellClick"
               class="widthClass"
               :stripe="true"
               :border="true"
               max-height="450px"
    >
      <el-table-column min-width="60" v-for="(item,key) in tableColumn" :key="key" :label="item.label" :prop="item.prop"
                       :width="item.width" :resizable="true"
                       :formatter="item.formatter"
                       :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column min-width="60" label="通讯方式" :resizable="false">
        <template slot-scope="scope" >
          <el-button v-if="showPhone" type="info" size="mini" icon="el-icon-mobile-phone" @click="handleDialPhone(scope.row)"></el-button>
          <el-button v-if="showoutline" type="info" size="mini" icon="el-icon-chat-dot-square" @click="handleDialsSpecialPlane(scope.row)"></el-button>
          <el-button v-if="showoutFax" type="info" size="mini" icon="el-icon-document" @click="handleDialsFax(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
</template>

<script>
    export default {
        name: "tableEvent",
        props: ["tableColumn", "tableData"],
        data(){
          return{
            row:"",//行索引
            column:"",//列索引
            showPhone:true,
            showoutline:false,
            showoutFax:false,
          }
        },
        methods: {
          handleCurrentChange(row) {
            this.$emit("handleCurrentChange",row);
          },
          handleCellClick(row, column, cell, event){
            this.$emit("handleCellClick",row, column, cell, event);
          },
          handleDialPhone(row) {
            this.$emit("handleDialPhone",row);
          },
          handleDialsSpecialPlane(row){
            this.$emit("handleDialsSpecialPlane",row);
          },
          handleDialsFax(row){
            this.$emit("handleDialsFax",row);
          },
          eventshowPhone(){//显示电话
            console.log('电话显示')
            this.showPhone=true;
            this.showoutline=false;
            this.showoutFax=false
          },
          eventshowfax(){//显示传真
            this.showPhone=false;
            this.showoutline=false;
            this.showoutFax=true
          },
          eventshowline(){//显示短信
            console.log('短信显示')
            this.showPhone=false;
            this.showoutline=true;
            this.showoutFax=false
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
  .widthClass{
    /*max-height: 450px;*/
    /*overflow: auto;*/
    margin: 10px 0;
    font-size: 14px;
  }
</style>
