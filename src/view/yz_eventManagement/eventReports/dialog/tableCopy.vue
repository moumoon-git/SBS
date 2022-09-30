<template>
  <el-table
    ref="singleTable"
    :data="tableData"
    :header-cell-style="{background:'#F9FBFF',color:'#606266'}"
    @row-click="handleCurrentChange"
    @cell-dblclick="handleCellClick"
    class="widthClass"
    :stripe="true"
    :border="false"
    height="196"
  >
    <el-table-column
      min-width="60"
      v-for="(item,key) in tableColumn"
      :key="key"
      :label="item.label"
      :prop="item.prop"
      :width="item.width"
      :resizable="true"
      :formatter="item.formatter"
      :show-overflow-tooltip="true"
    ></el-table-column>
    <el-table-column
      min-width="60"
      label="通讯方式"
      :resizable="false"
      :row-style="{textAlign:'center'}"
    >
      <template slot-scope="scope">
        <div style="display: flex;justify-content: space-around;font-size: 16px;">
          <i
            v-if="showPhone"
            class="myIcon yf-icon-phone"
            @click="handleDialPhone(scope.row,scope.$index)"
          ></i>
          <i
            v-if="showoutline"
            class="myIcon yf-icon-sms"
            @click="handleDialsSpecialPlane(scope.row)"
          ></i>
          <!-- 3.0发送传真是给单位发送传真,暂时不对个人发,所以先隐藏 20210626 -->
          <!-- <i v-if="showoutFax" class="myIcon yf-icon-fax" @click="handleDialsFax(scope.row)"></i> -->
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
    export default {
        name: "tableCopy",
        props: ["tableColumn", "tableData"],
        data(){
          return{
            row:"",//行索引
            column:"",//列索引
            showPhone:true,
            showoutline:true,
            showoutFax:true,
          }
        },
        methods: {
          handleCurrentChange(row) {
            this.$emit("handleCurrentChange",row);
          },
          handleCellClick(row, column, cell, event){
            this.$emit("handleCellClick",row, column, cell, event);
          },
          handleDialPhone(row,index) {
            console.log(row, index);
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
            this.showoutline=true;
            this.showoutFax=true
          },
          eventshowfax(){//显示传真
            this.showPhone=true;
            this.showoutline=true;
            this.showoutFax=true
          },
          eventshowline(){//显示短信
            console.log('短信显示')
            this.showPhone=true;
            this.showoutline=true;
            this.showoutFax=true
          }
        }
    }
</script>

<style scoped>
/* @import '../../../../assets/iconYf/style.css'; */
>>> .el-table__body tr.current-row > td {
    color: #479dff;
}

>>> .el-table--enable-row-hover .el-table__body tr.hover > td {
    background-color: #e3f0ff !important;
}
.widthClass {
    /*max-height: 450px;*/
    /*overflow: auto;*/
    margin: 10px 0;
    font-size: 14px;
}
.myIcon {
    cursor: pointer;
    color: #0091fe;
}
.myIconStyle {
    color: #99c2f8;
}
</style>
