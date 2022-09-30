<template
  height="1000px"
width="1400px">
  <el-dialog
  title="以下联系人未能成功导入"
  :close-on-click-modal="false"
  :visible.sync="visible"
  height="1000px"
  width="1400px"
  >

    <el-row>
      <el-col :span="24">
        <div>
          <el-table
            :data="tableData"
            height="500"
            border
            style="width: 100%"
            header-align="center"
            align="center"
            id="tabledata"
            >
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
            <el-table-column
              prop="nowStatus"
              header-align="center"
              align="center"
              :show-overflow-tooltip="true"
              label="现状态"
            >
            </el-table-column>
            <el-table-column
              align="center"
              header-align="center"

              width="300"
              prop="errorMsg"
              label="失败原因">
            </el-table-column>
          </el-table>

        </div>
      </el-col>
      <!-- <el-col :span="24">
        <el-button
          type="success"
          icon="el-icon-printer"
          @click="exportExcel()"
          style="float:right;margin-top:20px"
        >导出数据</el-button>
      </el-col> -->
    </el-row>


</el-dialog>
</template>

<script>
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
  export default {
    data() {
      return{
        visible: false,
        tableData: ''
      }
    },

    methods: {

      init (data) {
        // console.log("================");
        // console.log(data);
        this.visible = true;
        this.tableData = data;

      },
      exportExcel () {
        /* generate workbook object from table */
        var wb = XLSX.utils.table_to_book(document.querySelector('#tabledata'))
        /* get binary string as output */
        var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
        try {
          FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'sheetjs.xlsx')
        } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
        return wbout
      },
      mailSexFormatter(obj){
        let val = obj.sex;
        return val==0?"男":"女";
      }
    }
  };
</script>

<style scoped>

</style>
