<!--
 * @Author: your name
 * @Date: 2020-06-01 14:14:39
 * @LastEditTime: 2020-11-26 11:43:46
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \SBS\src\views\modules\sys\mailList\mailList-errorData.vue
-->
<template
  height="1000px"
width="1400px">
  <el-dialog title="以下联系人未能成功导入" :close-on-click-modal="false" :visible.sync="visible" height="1000px" width="1400px">
    <el-row>
      <el-col :span="24">
        <div>
          <el-table :data="tableData" height="500" border style="width: 100%" header-align="center" align="center" id="tabledata">
            <el-table-column align="center" header-align="center" prop="groupName" label="部门" width="150"></el-table-column>
            <el-table-column align="center" header-align="center" prop="name" label="联系人名称" width="150"></el-table-column>
            <!-- <el-table-column
              align="center"
              header-align="center"
              prop="age"
              label="年龄"
            >
            </el-table-column>-->
            <el-table-column align="center" header-align="center" prop="sex" :formatter="mailSexFormatter" label="性别"></el-table-column>
            <!-- <el-table-column
              align="center"
              header-align="center"
              prop="workUnit"
              label="工作单位">
            </el-table-column>-->
            <el-table-column align="center" header-align="center" prop="position" label="职务"></el-table-column>
            <!-- <el-table-column
              align="center"
              header-align="center"
              prop="officeTel"
              label="办公室号码"
              width="150">
            </el-table-column>-->
            <el-table-column align="center" header-align="center" prop="mobile1" label="手机号码1" width="150"></el-table-column>
            <el-table-column align="center" header-align="center" prop="mobile2" label="手机号码2" width="150"></el-table-column>
            <el-table-column align="center" header-align="center" prop="homeTel" label="家庭号码" width="150"></el-table-column>
            <el-table-column align="center" header-align="center" prop="fax" label="传真号码" width="150"></el-table-column>
            <el-table-column align="center" header-align="center" prop="otherTel" label="其他号码" width="150"></el-table-column>
            <el-table-column align="center" header-align="center" prop="email" label="邮箱地址" width="150"></el-table-column>
            <el-table-column align="center" header-align="center" prop="remark" label="备注" width="150"></el-table-column>
            <el-table-column align="center" header-align="center" width="300" prop="errorMsg" label="失败原因"></el-table-column>
          </el-table>
        </div>
      </el-col>
      <!-- <el-col :span="24">
        <el-button type="success" icon="el-icon-printer" @click="exportExcel()" style="float:right;margin-top:20px">导出数据</el-button>
      </el-col> -->
    </el-row>
  </el-dialog>
</template>

<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
  data () {
    return {
      visible: false,
      tableData: ''
    }
  },

  methods: {
    init (data) {
      // console.log('================')
      // console.log(data)
      this.visible = true
      this.tableData = data
    },
    exportExcel () {
      /* generate workbook object from table */
      var wb = XLSX.utils.table_to_book(document.querySelector('#tabledata'))
      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
      })
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: 'application/octet-stream' }),
          'sheetjs.xlsx'
        )
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout)
      }
      return wbout
    },
    mailSexFormatter (obj) {
      let val = obj.sex
      return val == 0 ? '男' : (val == 1 ? '女': '未知')
    }
  }
}
</script>

<style scoped>
</style>
