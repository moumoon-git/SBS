<template>
  <div class="dutylog-table-wrap" style="padding:3px;height:583px;margin-top:20px;width:100%;margin: 0px;">
    <el-table :data="dataList" stripe border style="width: 100%;" height="535px" :span-method="arraySpanMethod" :row-class-name="tableRowClassName">
      <!-- <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>-->
      <el-table-column prop="inspectionName" header-align="center" align="center" label="巡检项">

        <template slot-scope="scope" >
          <div class="cell" v-if="scope.$index===0||scope.$index===1">{{scope.row.inspectionName}}</div>
          <el-input v-if="scope.$index!==0&&scope.$index!==1" v-model="scope.row.inspectionName" placeholder="请填写" style="border:0;"></el-input>
          <!-- <el-input v-if="scope.$index===0||scope.$index===1" v-model="scope.row.name" type="textarea" :rows="4" placeholder="请填写" style="border:0;"></el-input> -->
        </template>
      </el-table-column>
      <el-table-column prop="inspectionRemark" header-align="center" align="center" label="说明">
        <template slot-scope="scope">
          <el-input v-if="scope.$index!==0&&scope.$index!==1" v-model="scope.row.inspectionRemark" placeholder="请填写" style="border:0;"></el-input>
          <el-input v-if="scope.$index===0||scope.$index===1" v-model="scope.row.inspectionRemark" type="textarea" :rows="4" placeholder="请填写" style="border:0;"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="inspectionStatus" header-align="center" align="center" label="运行情况">
        <template slot-scope="scope" style="width:100%;">
          <el-select v-model="scope.row.inspectionStatus" placeholder="请选择">
            <el-option v-for="item in situationOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </template>
      </el-table-column>
    </el-table>

    <el-button type="primary" @click="saveDutyLog()" v-if="typeShow!==1" style="margin-top:10px;float:right;margin-left:20px;" size="small">保存</el-button>
    <el-button type="primary" @click="AddTable()" v-if="typeShow!==1" style="margin-top:10px;float:right;" size="small">新增巡查项</el-button>
  </div>
</template>

<script>
export default {
  props: ['dataList', 'typeShow'],
  // 表格内容
  data () {
    return {
      situationOptions: [
        {
          value: 0,
          label: '正常'
        },
        {
          value: 1,
          label: '异常'
        }

      ]
    }
  },
  mounted () {
    // console.log('scope.row',scope.row)
  },
  methods: {
    AddTable () {
      this.$emit('AddTable')
    },
    saveDutyLog () {
      this.$emit('saveDutyLog', this.dataList)
    },
    // tableRowClassName 为 Table 中的某一行添加 class
    tableRowClassName ({ row, rowIndex }) {
      // if (rowIndex === 3) {
      //   return 'rowIndex3'
      // }
      // if (rowIndex === 4) {
      //   return 'rowIndex4'
      // }
    },
    // 合并行列
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0 || rowIndex === 1) {
        if (columnIndex === 1) {
          return [1, 2]
        }
      }
      if (rowIndex > 1) {
        if (columnIndex === 3) {
          return [3, 1]
        }
      }
    }
  }
}
</script>

<style lang="less">
.dutylog-table-wrap {
  .el-table {
    input {
      border: 0;
    }
    textarea {
      border: 0;
      resize: none;
    }
  }
  .el-table .rowIndex3 {
    // background: #f0f9eb;
    height: 100px;
  }
  .el-table .rowIndex4 {
    // background: #f0f9eb;
    height: 200px;
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
  .el-table__body tbody > :nth-child(n) {
    background: #f5f7fa;
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

