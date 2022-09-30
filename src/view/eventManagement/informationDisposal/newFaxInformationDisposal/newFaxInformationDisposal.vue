<template>
  <el-container class="newFaxInformationDisposal">
    <el-header
      style="
        height: 80px;
        display: flex;
        align-items: center;
        border-top: 15px solid #ebeef5;
      "
    >
      <el-row :gutter="20" style="width: 100%">
        <el-col :span="2" style="position: relative;min-width:123px;">
          <el-button
            type="primary"
            icon="el-icon-printer"
            style="width: 100%"
            @click="
              tabPosition = '新传真';
              getFaxTable();
            "
          >新传真</el-button>
          <span
            style="
              display: inline-block;
              background: red;
              color: white;
              font-size: 12px;
              padding: 2% 6%;
              border-radius: 50%;
              position: absolute;
              top: -21%;
              right: 0%;
            "
          >{{ unReadNumber }}</span>
        </el-col>
        <el-col style="width: initial">
          <el-radio-group v-model="tabPosition" @change="getFaxTable" class="radioButtonClass">
            <el-radio-button label="突发事件"></el-radio-button>
            <el-radio-button label="三防响应"></el-radio-button>
            <el-radio-button label="领导批示"></el-radio-button>
            <el-radio-button label="通知"></el-radio-button>
            <el-radio-button label="其它"></el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col :span="5">
          <el-date-picker
            style="width: 100%"
            v-model="dateRage"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
            @change="getFaxTable"
          ></el-date-picker>
        </el-col>
        <el-col :span="5">
          <el-input
            placeholder="请输入关键字内容"
            v-model="searchKey"
            class="input-with-select"
            style="width: 100%"
          >
            <el-button slot="append" icon="el-icon-search" @click="getFaxTable"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-main style="background: white">
        <el-table :data="tableData" style="width: 100%; box-shadow: none; border: 1px solid #DDDDDD;" height="600px" @row-click="onRowClick" highlight-current-row class="tableClass">
          <el-table-column prop="sendtime" label="来信时间" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="unit" label="来信单位" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="calling" label="来信号码" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column
            prop="read"
            label="状态"
            v-if="tabPosition == '新传真'"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="caseClassName"
            label="事件类型"
            v-if="tabPosition == '突发事件'"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="eventTitle"
            label="事件标题"
            v-if="
              tabPosition == '突发事件' ||
              tabPosition == '三防响应' ||
              tabPosition == '领导批示' ||
              tabPosition == '通知' ||
              tabPosition == '其它'
            "
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="eventLevelName"
            label="事件等级"
            v-if="tabPosition == '突发事件'"
            :show-overflow-tooltip="true"
          ></el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="tableConfig.currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="tableConfig.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          style="margin-top: 2%"
          :total="tableConfig.total"
        ></el-pagination>
      </el-main>
      <el-aside width="45%" style="background: white">
        <div
          style="
            width: 100%;
            text-align: initial;
            height: 40px;
            display: flex;
            align-items: center;
          "
        >
          <span
            style="
              background: #409eff;
              display: inline-block;
              height: 20px;
              width: 5px;
              margin-left: 2%;
            "
          ></span>
          <span style="color: black; font-weight: bolder; margin-left: 2%">传真预览</span>
        </div>
        <iframe
          :src="faxPreviewPath"
          width="90%"
          height="84%"
          style="margin: auto;display: block;"
          v-if="faxPreviewPath != ''"
          frameborder="no"
          border="0"
          marginwidth="0"
          marginheight="0"
          scrolling="no"
          allowtransparency="yes"
        ></iframe>
        <div
          v-else
          style="
            width: 85%;
            background: url('/static/img/faxBack.png') center no-repeat;
            margin: auto;
            height: 84%;
          "
        ></div>
        <div
          style="
            width: 100%;
            margin-top: 13px;
            display: flex;
            justify-content: space-evenly;
          "
        >
          <span
            style="
              display: inline-block;
              padding: 10px;
              border-radius: 8px;
              border: 1px solid #dcdfe6;
              cursor: pointer;
            "
            @click="onClickDisposal('突发事件')"
          >突发事件处置</span>
          <span
            style="
              display: inline-block;
              padding: 10px;
              border-radius: 8px;
              border: 1px solid #dcdfe6;
              cursor: pointer;
            "
            @click="onClickDisposal('三防响应')"
          >三防响应处置</span>
          <span
            style="
              display: inline-block;
              padding: 10px;
              border-radius: 8px;
              border: 1px solid #dcdfe6;
              cursor: pointer;
            "
            @click="onClickDisposal('领导批示')"
          >领导批示处置</span>
          <span
            style="
              display: inline-block;
              padding: 10px;
              border-radius: 8px;
              border: 1px solid #dcdfe6;
              cursor: pointer;
            "
            @click="onClickDisposal('通知')"
          >通知处置</span>
          <span
            style="
              display: inline-block;
              padding: 10px;
              border-radius: 8px;
              border: 1px solid #dcdfe6;
              cursor: pointer;
            "
            @click="onClickDisposal('其他')"
          >其他处置</span>
          <span
            style="
              display: inline-block;
              padding: 10px;
              border-radius: 8px;
              border: 1px solid #dcdfe6;
              cursor: pointer;
            "
            @click="handleFaxMerge"
          >合并</span>
          <span
            style="
              display: inline-block;
              padding: 10px;
              border-radius: 8px;
              border: 1px solid #dcdfe6;
              cursor: pointer;
            "
            @click="handleSplitFax"
          >拆分</span>
        </div>
      </el-aside>
    </el-container>
    <faxInformationDisposalDialog
      ref="faxInformationDisposalDialog"
      v-if="faxInformationDisposalDialogVisible"
      @closeDialog="
        getFaxTable(), (faxInformationDisposalDialogVisible = false)
      "
    ></faxInformationDisposalDialog>

    <!--合并传真-->
    <mergefaxDialog
        ref="mergefaxDialog"
        v-if="mergefaxDialogVisible"
        @closeFaxDialog="mergefaxDialogVisible = false"
    ></mergefaxDialog>
     <!--拆分传真-->
    <splitFaxDialog
        ref="splitFaxDialog"
        v-if="splitFaxDialogVisible"
        @closeFlag="splitFaxDialogVisible = false"
    ></splitFaxDialog>
  </el-container>
</template>

<script>
import faxInformationDisposalDialog from './faxInformationDisposalDialog';
import mergefaxDialog from '@/views/modules/sys/combined/history/FaxHistory/modules/mergefaxDialog/mergefaxDialog.vue';
import splitFaxDialog from '@/views/modules/sys/combined/history/FaxHistory/modules/splitFaxDialog/splitFaxDialog.vue';
export default {
    data() {
        return {
            tabPosition: '',
            dateRage: [],
            searchKey: '',
            tableData: [],
            tableConfig: {
                currentPage: 1,
                pageSize: 10,
                total: 1,
            },
            faxInformationDisposalDialogVisible: false,
            faxPreviewPath: '',
            tableRow: {},
            unReadNumber: 0,
            mergefaxDialogVisible: false,
            splitFaxDialogVisible: false,
        };
    },
    components: {
        faxInformationDisposalDialog,
        mergefaxDialog,
        splitFaxDialog,
    },
    props: [],
    mounted() {
        this.getFaxTable();
    },
    methods: {
        getFaxTable() {
            this.$http({
                method: 'post',
                headers: {},
                url: window.g.ApiUrl + '/eos/history/findFaxUnread',
                data: {},
            }).then(({ data }) => {
                console.log('/eos/history/findFaxUnread', data);
                this.unReadNumber = data.data.unread;
            });

            this.$http({
                method: 'post',
                headers: {},
                url: window.g.ApiUrl + '/eos/history/faxListNew',
                data: {
                    dtStart:
                        this.dateRage.length != 0
                            ? this.$moment(this.dateRage[0]).format(
                                  'YYYY-MM-DD'
                              )
                            : '',
                    dtEnd:
                        this.dateRage.length != 0
                            ? this.$moment(this.dateRage[1]).format(
                                  'YYYY-MM-DD'
                              )
                            : '',
                    searchText: this.searchKey,
                    size: this.tableConfig.pageSize,
                    page: this.tableConfig.currentPage,
                    faxType:
                        this.tabPosition == ''
                            ? '':
                        this.tabPosition == '新传真'
                            ? 0
                            : this.tabPosition == '突发事件'
                            ? 1
                            : this.tabPosition == '三防响应'
                            ? 2
                            : this.tabPosition == '领导批示'
                            ? 3
                            : this.tabPosition == '通知'
                            ? 4
                            : 0,
                },
            }).then(({ data }) => {
                console.log('/eos/history/faxListNew', data);
                if (data.errorcode == 0) {
                    this.tableData = data.data.data;
                    this.tableConfig.total = data.data.totalElements;
                    if (!data.data.data || data.data.data.length==0) {
                      return
                    }
                    this.tableRow = data.data.data.length!=0?data.data.data[0]:{};
                    if (data.data.data[0].faxFile.search('pdf') === -1) {
                      this.$http({
                        baseURL: window.SITE_CONFIG.cloudUrl,
                        url: '/event/fax/previewFax',
                        method: 'get',
                        params: this.$http.adornParams({
                          attachmentId: data.data.data[0].attachmentId,
                        }),
                      }).then(({ data }) => {
                        console.log('/event/fax/previewFax', data);
                        if (data.errorcode === 0) {
                          this.faxPreviewPath = window.SITE_CONFIG.cloudUrl + data.data;
                        }
                      });
                    }else {
                      this.faxPreviewPath = window.SITE_CONFIG.cloudUrl + data.data.data[0].faxFile;
                  }
                }
            });
        },
        onRowClick(row, column, event) {
            console.log('onRowClick', row);
            this.$emit('tableClickEmit',row)
            this.tableRow = row;
             if (row.faxFile.search('pdf') === -1) {
                this.$http({
                  baseURL: window.SITE_CONFIG.cloudUrl,
                  url: '/event/fax/previewFax',
                  method: 'get',
                  params: this.$http.adornParams({
                    attachmentId: row.attachmentId,
                  }),
                }).then(({ data }) => {
                  console.log('/event/fax/previewFax', data);
                  if (data.errorcode === 0) {
                    this.faxPreviewPath = window.SITE_CONFIG.cloudUrl + data.data;
                  }
                });
              } else {
                this.faxPreviewPath = window.SITE_CONFIG.cloudUrl + row.faxFile;
              }
        },
        onClickDisposal(tabpositionType) {
          console.log('this.tableRow',this.tableRow);
            this.$http({
                method: 'post',
                headers: {},
                url: window.g.ApiUrl + '/eos/history/updateFaxRead',
                data: {
                    faxId: this.tableRow.id,
                },
            }).then(({ data }) => {
                console.log('/eos/history/updateFaxRead', data);
                this.getFaxTable();
            });

            this.faxInformationDisposalDialogVisible = true;
            this.$nextTick(() => {
                this.$refs.faxInformationDisposalDialog.dialogVisible = true;
                this.$refs.faxInformationDisposalDialog.faxTypeForm.faxType = tabpositionType;
                this.$refs.faxInformationDisposalDialog.tableRow = this.tableRow;
                this.$refs.faxInformationDisposalDialog.faxPreviewPath = this.faxPreviewPath;

                // let fileName;
                // this.$api
                //     .previewFax({
                //         faxId: this.tableRow.id,
                //     })
                //     .then(res => {
                //         fileName = res.data;
                //     })
                //     .then(() => {
                //         let data = {
                //             faxId: this.tableRow.id,
                //             fileName: fileName,
                //             isSingle: true
                //         };
                //         this.$api.splitPdf(data).then(res => {
                //             console.log('splitPdf', res);
                //             if (res.errorcode == 0) {
                //                 if (res.data.length > 0) {
                //                     this.$refs.faxInformationDisposalDialog.ocrArray =
                //                         res.data;
                //                 }
                //             } else {
                //                 this.$message.error(res.msg);
                //             }
                //         });
                //     });

                this.$http({
                    method: 'post',
                    headers: {},
                    url:
                        window.g.ApiUrl + '/eos/event/report/findEventDealById',
                    data: {
                        eventDealId: this.tableRow.eventDealId,
                    },
                }).then(res => {
                    console.log('/eos/event/report/findEventDealById', res);
                    res = res.data;
                    console.log('this.tableRowthis.tableRow', this.tableRow);
                    this.$refs.faxInformationDisposalDialog.unEmergencyForm.faxNumber = this.tableRow.calling;
                    this.$refs.faxInformationDisposalDialog.unEmergencyForm.faxUnit = this.tableRow.workUnit;
                    this.$refs.faxInformationDisposalDialog.unEmergencyForm.letterTime = this.tableRow.sendtime;
                    this.$refs.faxInformationDisposalDialog.unEmergencyForm.letterTitle = this.tableRow.title;
                    this.$refs.faxInformationDisposalDialog.unEmergencyForm.disposalRecord = this.tableRow.processingResult;
                    this.$refs.faxInformationDisposalDialog.unEmergencyForm.disposalStatus = this.tableRow.processing || "";
                    this.$refs.faxInformationDisposalDialog.unEmergencyForm.eventCorrelation.caseId = this.tableRow.caseId;
                    this.$refs.faxInformationDisposalDialog.unEmergencyForm.eventCorrelation.caseTitle = this.tableRow.eventTitle;
                    setTimeout(() => {
                        this.$refs.faxInformationDisposalDialog.getEventTitleArea();
                    });
                    if (res.errorcode == 0 && res.data.length != 0) {
                        this.$refs.faxInformationDisposalDialog.emergencyForm.eventId =
                            res.data[0].eventProcessId;
                        this.$refs.faxInformationDisposalDialog.emergencyForm.eventCorrelation.caseId =
                            res.data[0].eventProcessId;
                        this.$refs.faxInformationDisposalDialog.emergencyForm.eventCorrelation.caseTitle =
                            res.data[0].title;
                        this.$refs.faxInformationDisposalDialog.emergencyForm.eventDealId =
                            res.data[0].id;
                        this.$refs.faxInformationDisposalDialog.emergencyForm.eventTitle =
                            res.data[0].title;
                        this.$refs.faxInformationDisposalDialog.emergencyForm.incidentTime =
                            res.data[0].occurTime;
                        this.$refs.faxInformationDisposalDialog.emergencyForm.startingTime =
                            res.data[0].reportTime;
                        this.$refs.faxInformationDisposalDialog.emergencyForm.jurisdiction = 
                            res.data[0].areaId
                        ;
                        this.$refs.faxInformationDisposalDialog.emergencyForm.incidentLocation =
                            res.data[0].address;
                        this.$refs.faxInformationDisposalDialog.longitude =
                            res.data[0].longitude;
                        this.$refs.faxInformationDisposalDialog.latitude =
                            res.data[0].latitude;
                        this.$refs.faxInformationDisposalDialog.emergencyForm.reportingUnit =
                            res.data[0].reportDepartId;
                        this.$refs.faxInformationDisposalDialog.emergencyForm.eventType =
                            res.data[0].eventType;
                        this.$refs.faxInformationDisposalDialog.emergencyForm.accidentSituation =
                            res.data[0].reportDescription;
                        this.$refs.faxInformationDisposalDialog.emergencyForm.incidentCause =
                            res.data[0].occurReason;
                        this.$refs.faxInformationDisposalDialog.emergencyForm.consequences =
                            res.data[0].consequences;
                        this.$refs.faxInformationDisposalDialog.emergencyForm.eventDevelopmentTrend =
                            res.data[0].developmentTrend;
                        this.$refs.faxInformationDisposalDialog.emergencyForm.Measures =
                            res.data[0].takeSteps;
                        this.$refs.faxInformationDisposalDialog.emergencyForm.eventGrade =
                            res.data[0].eventLevel || "";
                        this.$refs.faxInformationDisposalDialog.emergencyForm.contactNumber =
                            res.data[0].dealPhone;
                        res.data[0].attachments.forEach(item => {
                            if (item.fileType == 1) {
                                this.$refs.faxInformationDisposalDialog.emergencyForm.faxFileList.push(
                                    item
                                );
                            } else {
                                this.$refs.faxInformationDisposalDialog.emergencyForm.otherFileList.push(
                                    item
                                );
                            }
                        });
                    }
                });
            });
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.tableConfig.pageSize = val;
            this.getFaxTable();
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.tableConfig.currentPage = val;
            this.getFaxTable();
        },
        handleFaxMerge(){
            this.mergefaxDialogVisible = true;
            this.$nextTick(()=>{
                this.$refs.mergefaxDialog.isMergeFaxDialog = true
                this.$refs.mergefaxDialog.faxHistoryOrinformationDisposa = "informationDisposa"
                this.$refs.mergefaxDialog.tabPosition = this.tabPosition
            });
        },
        handleSplitFax(){
            this.splitFaxDialogVisible = true
            this.$nextTick(()=>{
                this.$refs.splitFaxDialog.flag = true;
                if (this.tableRow.faxFile.search('pdf') === -1) {
                    this.$http({
                    baseURL: window.SITE_CONFIG.cloudUrl,
                    url: '/event/fax/previewFax',
                    method: 'get',
                    params: this.$http.adornParams({
                        attachmentId: this.tableRow.attachmentId,
                    }),
                    }).then(({ data }) => {
                    console.log('/event/fax/previewFax', data);
                    if (data.errorcode === 0) {
                        this.$refs.splitFaxDialog.rawFaxPath = window.SITE_CONFIG.cloudUrl + data.data;
                        this.$refs.splitFaxDialog.oldFaxPath = window.SITE_CONFIG.cloudUrl + data.data;
                    }
                    });
                }else {
                    this.$refs.splitFaxDialog.rawFaxPath = window.SITE_CONFIG.cloudUrl + this.tableRow.faxFile;
                    this.$refs.splitFaxDialog.oldFaxPath = window.SITE_CONFIG.cloudUrl + this.tableRow.faxFile;
                }
                this.$refs.splitFaxDialog.faxId = this.tableRow.id;
            });
           
        }
    },
};
</script>
<style  lang="less" scoped>
.newFaxInformationDisposal /deep/ .el-dialog__header{
  text-align: center;
}
.newFaxInformationDisposal /deep/ .el-dialog__wrapper{
  left: 170px; 
}
.el-table /deep/ th > .cell {
    color: black;
    font-weight: bolder;
}
</style>
<style scoped>
  .radioButtonClass >>>.el-radio-button.is-active > span {
    color: #0091FF;
    background-color: #ffffff !important;
  }

  .tableClass >>> .el-table__body tr.current-row > td {
    color: #1f7ce6;
  }

  .tableClass >>>.el-table--enable-row-hover .el-table__body tr.hover>td{
    background-color: #E3F0FF !important;
  }
</style>