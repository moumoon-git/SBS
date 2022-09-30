<!--@author：yf-->
<template>
  <div>
    <el-table
      :max-height="tableConfig.height"
      ref="myTable"
      :data="tableData"
      :header-cell-style="{background:'#F9FCFF',color:'#333333'}"
      highlight-current-row
      v-loading="tableConfig.loading || false"
      @selection-change="selectionChange"
      @select="selectionRow"
      @row-click="rowClick"
      @select-all="selectAll"
    >
      <!-- 当前行数据对应右边的数据，右边数据改了之后，表格也需要高亮的话，就加上这两个属性 -->
      <!-- :row-key="tableConfig.rowKey" -->
      <!-- :current-row-key="tableConfig.currentRowKey" -->

      <el-table-column type="selection" width="50" v-if="tableConfig.selection"></el-table-column>
      <el-table-column type="index" width="50" v-if="tableConfig.index"></el-table-column>

      <template v-for="(item,index) in tableColumn">
        <!--基本头部-->
        <el-table-column v-if="!item.slot" show-overflow-tooltip min-width="80" :align="item.center"  :key="item.prop" :label="item.label" :prop="item.prop" :width="item.width" resizable></el-table-column>
        <!--插槽slot-->
        <el-table-column v-else min-width="80" show-overflow-tooltip :align="item.center" :key="item.prop" :label="item.label" :prop="item.prop" :width="item.width" resizable>
          <template slot-scope="scope">
            <slot :name="item.prop" :slotData="scope.row"></slot>
          </template>
        </el-table-column>
      </template>

    </el-table>
  </div>
</template>

<script>
  export default {
    props: {
      // 表格表头
      tableColumn: {
        type: Array,
        default: []
      },
      // 数据
      tableData: {
        type: Array,
        default: []
      },
      // 配置
      tableConfig: {
        type: Object,
        default: null
      }
    },
    data() {
      return {};
    },
    methods: {
      // 选择项发生变化时会触发该事件
      selectionChange(rows){
        this.$emit('selectionChange',rows)
      },
      // 某一行被点击时会触发该事件
      rowClick(row){
        this.$emit('rowClick',row)
      },
      // 勾选数据行的 Checkbox 时触发的事件
      selectionRow(rows){
        this.$emit('selectionRow',rows)
      },
      // 勾选全选的 Checkbox 时触发的事件
      selectAll(rows){
        this.$emit('selectAll',rows)
      },
      toggleRowSelection(rows,msg){
        if (msg === '最近联系人'){
          this.tableData.forEach((e,i) => {
            if (e.contactorId === 0){
              this.$refs.myTable.toggleRowSelection(this.tableData[i],false)
            }
          });
          rows.forEach((rowsE,rowI) =>{
            this.tableData.forEach((tabE,tabI) =>{
              if (rowsE === tabE.contactorId){
                this.$refs.myTable.toggleRowSelection(this.tableData[tabI],false)
              }
            })
          })
        }else if (msg === '短信最近联系人'){
          this.tableData.forEach((e,i) => {
            if (!/^[1][3,4,5,6,7,8][0-9]{9}$/.test(e.call)){
              console.log('delete ',this.tableData[i])
              this.$refs.myTable.toggleRowSelection(this.tableData[i],false)
            }
          });
          rows.forEach((rowsE,rowI) =>{
            this.tableData.forEach((tabE,tabI) =>{
              if (rowsE === tabE.contactorId){
                if(!(rowsE == '0' && /^[1][3,4,5,6,7,8][0-9]{9}$/.test(tabE.call))){
                  this.$refs.myTable.toggleRowSelection(this.tableData[tabI],false)
                }

              }
            })
          });
        }
        else if (rows){
          rows.forEach((rowsE,rowI) =>{
            this.tableData.forEach((tabE,tabI) =>{
              if (rowsE.id === tabE.id || rowsE.id === tabE.contactorId){
                this.$refs.myTable.toggleRowSelection(this.tableData[tabI],false)
              }
            })
          })
        } else {
          this.$refs.myTable.clearSelection();
        }
      }
    }
  };
</script>
<style scoped>
  >>>.el-table td{
    height: 50px;
    padding: 5px 0;
  }
  /deep/ .el-table__body tr.current-row>td{
    background-color: rgb(204, 228, 255, .7);
  }
  /* 表格鼠标悬浮时的样式（高亮 浮出） */
  /deep/ .el-table--enable-row-hover .el-table__body tr:hover {
      -webkit-transform: translateY(-3px);
      -ms-transform: translateY(-3px);
      transform: translateY(-3px);
      -webkit-box-shadow: 0 0 6px #999;
      box-shadow: 0 0 6px #999;
      -webkit-transition: all .5s ease-out;
      transition: all .5s ease-out;
  }
</style>
