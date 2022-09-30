<!--@author：yf-->
<template>
  <div class="fax-history-container">
    <div>
      <div
        style="
          display: flex;
          text-align: left;
          padding: 0 10px;
          height: 40px;
          line-height: 40px;
        "
      >
        <label>报送单位:</label>
        <el-select
          v-model="value"
          clearable
          placeholder="请选择"
          @change="chanFaxUnit"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>
    <div class="myTable">
      <fax-table
        ref="faxTable"
        :table-column="faxTableColumn"
        :table-data="faxTableData"
        @handleCheck="faxHandleCheck"
        @downloadCheck="downloadCheck"
      />
    </div>
    <div>
      <!--      <pdf ref="pdf"></pdf>-->
    </div>
  </div>
</template>

<script>
import faxTable from '@/view/yz_eventManagement/eventReports/Page/criminalHistory/faxTable';
// import pdf from './pdf'
// import {Url} from '../../../../../assets/js/common'
const $downLoadFile = require('@/utils/downloadFile.js').default;

export default {
  name: 'FaxHistory',
  components: {
    faxTable,
    // pdf
  },
  data() {
    return {
      options: [],
      total: 0, // 总数据
      pageSize: 1, // 第几页
      currentPage: 10, // 每页多少条数据
      pagingSize: false, // 分页大小
      value: '全部', // 报送单位
      faxTableColumn: [
        {
          prop: 'fax_name',
          label: '文件名字',
        },
        {
          prop: 'fileExtension',
          label: '文件类型',
        },
        {
          prop: 'send_time',
          label: '时间',
        },
      ], // 表头
      // 注释原因：以下为2.7的getFaxHistory接口的字段
      // faxTableColumn: [
      //   {
      //     prop: "faxName",
      //     label: "文件名字"
      //   },{
      //     prop: "faxFile",
      //     label: "文件类型",
      //     formatter: this.fileNameTable
      //   }, {
      //     prop: "sendtime",
      //     label: "时间"
      //   }],//表头
      faxTableData: [], // 表格数据
      eventId: '', // 事件ID

      uploading: false, //
      fileId: '', //
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getID();
      this.getFaxUnit();
    });
  },
  methods: {
    /**
     * @description 获取传真记录
     */
    getFaxRecordList(eventId) {
      this.$http({
        url: `${window.SITE_CONFIG.event}/fax/getFaxRecord`,
        method: 'get',
        params: this.$http.adornParams({
          direct: '',
          faxId: '',
          eventId,
          eventDealId: '',
          keywords: '',
          pageNo: 1,
          pageSize: 10000,
          startDate: '',
          endDate: '',
        }),
      }).then(({ data }) => {
        if (data.errorcode === 0) {
          this.$refs.faxTable.examine = true;
          if (data.data.data.length > 0) {
            data.data.data.forEach((item) => {
              const newItem = { ...item };
              if (newItem.fax_name) {
                const arr = item.fax_name.split('.');
                const extension = arr[arr.length - 1];
                newItem.fileExtension = extension;
              }
              this.faxTableData.push(newItem);
            });
          } else {
            this.faxTableData = [];
          }
        }
      });
    },
    downloadCheck() {},
    faxHandleCheck(row) {
      const request = {
        method: 'get',
        url: `${window.SITE_CONFIG.event}/fax/downloadFaxFile?faxId=${row.fax_id}`,
        headers: {
          token: this.$cookie.get('token'),
        },
        responseType: 'arraybuffer',
      };
      $downLoadFile(request);
      // 注释原因:3.0传真下载接口替换
      // tiff下载
      // // window.open(`${window.g.ApiUrl}/fax/recv/${row.faxFile}`)
      // window.open(
      //   `${window.g.ApiUrl}/eos/communication/pdf/download?filename=${
      //     row.faxFile
      //   }&Authorization=${
      //     localStorage.getItem('token') ? localStorage.getItem('token') : ''
      //   }`,
      // );
    },
    getID() {
      this.eventId = sessionStorage.getItem('newID');
    },
    getFaxTableData() {
      if (
        !this.eventId
        || this.eventId === 'newID'
      ) {
        this.$message({
          message: '请先保存事件',
          type: 'warning',
        });
        return;
      }
      this.getFaxRecordList(this.eventId);
      // 注释原因：3.0获取传真历史的接口替换
      // let data={
      //   eventId:this.eventId,
      // };
      // this.$api.getFaxHistory(data).then((res) => {
      //   if(res.errorcode=='0'){
      //     console.log(res.data);
      //     if(res.data.path!=''){
      //       this.$refs.faxTable.examine=true;
      //     }
      //     if(res.data.path==''){
      //       this.$refs.faxTable.guess=true;
      //     }
      //     this.faxTableData=res.data;
      //   }else {
      //     //this.$message.error(res.msg);
      //   }
      // })
    },
    chanFaxUnit(val) {
      if (
        !this.eventId
        || this.eventId === 'newID'
      ) {
        this.$message({
          message: '请先保存事件',
          type: 'warning',
        });
        return;
      }
      if (val === '全部') {
        this.getFaxTableData();
      } else if (val === '查询未知单位') {
        const data = {
          eventId: this.eventId,
          unit: '',
        };
        this.$api.selectFaxHistoryByEventAndUnit(data).then((res) => {
          if (res.errorcode === 0) {
            this.faxTableData = res.data;
          } else {
            // this.$message.error(res.msg);
          }
        });
      } else {
        const data = {
          eventId: this.eventId,
          unit: val,
        };
        this.$api.selectFaxHistoryByEventAndUnit(data).then((res) => {
          if (res.errorcode === 0) {
            this.faxTableData = res.data;
          } else {
            // this.$message.error(res.msg);
          }
        });
      }
    },
    getFaxUnit() {
      if (
        !this.eventId
        || this.eventId === 'newID'
      ) {
        return;
      }
      const data = {
        eventId: this.eventId,
      };
      this.$api.selectFaxDepartment(data).then((res) => {
        if (res.errorcode === 0) {
          let arr = [
            {
              value: '全部',
              label: '全部',
            },
          ];
          let stuck = true;
          for (let i = 0; i < res.data.length; i++) {
            if (stuck) {
              if (!res.data[i]) {
                res.data[i] = '查询未知单位';
              }
              stuck = false;
            }
            arr.push({
              value: res.data[i],
              label: res.data[i],
            });
          }
          this.options = arr;
          this.getFaxTableData();
        }
      });
    },
    fileNameTable(row) {
      // 修改表格达到预期数据形式
      return row.faxFile.split('.')[row.faxFile.split('.').length - 1];
    },
  },
};
</script>

<style lang="scss">
.fax-history-container {

  .myTable {
    border: 1px solid #ddd;
    padding: 10px 15px;
    margin: 10px;

    .widthClass{
      height: 470px;

      .el-scrollbar__view {
        height: 100%;

        .el-table {
          height: 100%;

        }
      }
    }
  }
}
</style>
