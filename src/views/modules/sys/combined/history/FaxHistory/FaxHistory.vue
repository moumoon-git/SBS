<template>
  <div
    v-loading="isLoading"
    element-loading-spinner="sv-loading"
    :class="$style.container"
  >
    <!-- 1. 操作栏 -->
    <header :class="$style.header">
      <!-- 1-1. 发送/接收 -->
      <sv-select
        v-model="sendOrRecieve"
        :clearable="false"
        :options="[
          { label: '发送', value: 0 },
          { label: '接收', value: 1 },
        ]"
        width="75px"
      />
      <!-- 2-2. 日期范围 -->
      <span style="margin-left: 15px; margin-right: -5px;">创建时间：</span>
      <sv-select-date
        v-model="dateRange"
      />
      <!-- 2-3. 搜索栏 -->
      <sv-input-search
        v-model="searchKeyword"
        placeholder="请输入联系人、单位、号码"
        width="250px"
      />
      <sv-button
        type="primary"
        @click="onHandleClick"
      >
        搜索
      </sv-button>
    </header>
    <!-- 2. 主体内容 -->
    <main :class="$style.main">
      <!-- 2-1-A. 发送 -->
      <section v-if="sendOrRecieve === 0">
        <FaxHistorySend
          ref="FaxHistorySend"
          :searchKeyword="searchKeyword"
          :dateRange="dateRange"
          @updateFileUrl="tableRow=$event"
        />
      </section>
      <!-- 2-1-B. 接收 -->
      <section v-else>
        <FaxHistoryRecieve
          ref="FaxHistoryRecieve"
          :searchKeyword="searchKeyword"
          :dateRange="dateRange"
          @updateFileUrl="tableRow=$event"
        />
      </section>
      <!-- 2-2. 预览 -->
      <section>
        <FaxHistoryPreview :url='tableRow.faxFile' />
        <div :class="$style.functionButton">
            <sv-button
                @click="handleFaxMerge"
            >
                合并
            </sv-button>
            <sv-button
                @click="handleSplitFax"
            >
                拆分
            </sv-button>
            <sv-button
                @click="forward"
            >
                转发
            </sv-button>
            <sv-button
                @click="onClickDisposal('突发事件')"
            >
                登记事件
            </sv-button>
        </div>
      </section>

    </main>
    <!--合并传真-->
    <MergefaxDialog
        ref="MergefaxDialog"
        v-if="mergefaxDialog"
        @closeFaxDialog="mergefaxDialog = false"
    ></MergefaxDialog>

    <!--拆分传真-->
    <SplitFaxDialog
        ref="SplitFaxDialog"
        v-if="splitFaxDialog"
        @closeFlag="splitFaxDialog = false"
    ></SplitFaxDialog>

    <!--登记事件-->
    <FaxInformationDisposalDialog
      ref="faxInformationDisposalDialog"
      v-if="faxInformationDisposalDialogVisible"
      @closeDialog="
        getFaxTable(), (faxInformationDisposalDialogVisible = false)
      "
      :class="$style.faxInformationDisposal"
    ></FaxInformationDisposalDialog>
  </div>
</template>

<script>
import FaxHistorySend from './modules/FaxHistorySend/FaxHistorySend.vue';
import FaxHistoryRecieve from './modules/FaxHistoryRecieve/FaxHistoryRecieve.vue';
import FaxHistoryPreview from './modules/FaxHistoryPreview/FaxHistoryPreview.vue';
import MergefaxDialog from './modules/mergefaxDialog/mergefaxDialog.vue';
import SplitFaxDialog from './modules/splitFaxDialog/splitFaxDialog.vue';
import FaxInformationDisposalDialog from '@/view/eventManagement/informationDisposal/newFaxInformationDisposal/faxInformationDisposalDialog.vue';
import { isAuth } from '@/utils';
import bus from "@/views/common/js/eventBus";

export default {
  name: 'FaxHistory',
  components: {
    // 发送记录
    FaxHistorySend,
    // 接收记录
    FaxHistoryRecieve,
    // 传真预览
    FaxHistoryPreview,
    // 合并传真
    MergefaxDialog,
    // 拆分传真
    SplitFaxDialog,
    // 登记事件
    FaxInformationDisposalDialog,
  },
  data() {
    return {
      // 载入中
      isLoading: 0,
      // 发送-0，接收-1
      sendOrRecieve: 0,
      // 日期范围
      dateRange: ['', ''],
      // 搜索关键词
      searchKeyword: '',
      tableRow: '',
      // 合并弹窗
      mergefaxDialog: false,
      // 拆分弹窗
      splitFaxDialog:false,
      // 登记事件     
      faxInformationDisposalDialogVisible:false,
    };
  },
  methods: {
    onHandleClick() {
      if (this.sendOrRecieve === 0) {
        this.$refs.FaxHistorySend.pageIndex = 1;
        this.$refs.FaxHistorySend.getFaxRecordList();
      } else {
        this.$refs.FaxHistoryRecieve.pageIndex = 1;
        this.$refs.FaxHistoryRecieve.getFaxRecordList();
      }
    },
    handleFaxMerge(){
        this.mergefaxDialog = true;
        this.$nextTick(()=>{
            this.$refs.MergefaxDialog.isMergeFaxDialog = true
            this.$refs.MergefaxDialog.faxHistoryOrinformationDisposa = "faxHistory"
        });
    },
    handleSplitFax(){
        this.splitFaxDialog = true
      if (this.tableRow.faxFile) {
          this.$nextTick(()=>{
            this.$refs.SplitFaxDialog.flag = true;
            this.$refs.SplitFaxDialog.rawFaxPath = window.SITE_CONFIG.cloudUrl + this.tableRow.faxFile;
            this.$refs.SplitFaxDialog.oldFaxPath = window.SITE_CONFIG.cloudUrl + this.tableRow.faxFile;
            this.$refs.SplitFaxDialog.faxId = this.tableRow.id;
        });
      }else{
          this.$message.warning("传真文件不存在")
      }
    },
    onClickDisposal(tabpositionType) {
          console.log('this.tableRow',this.tableRow);
            this.$http({
                method: 'post',
                headers: {},
                url: window.g.ApiUrl + '/eos/history/updateFaxRead',
                data: {
                    faxId: this.tableRow.fax_id,
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
                this.$refs.faxInformationDisposalDialog.faxPreviewPath = window.SITE_CONFIG.cloudUrl + this.tableRow.faxFile;

                this.$http({
                    method: 'post',
                    headers: {},
                    url:
                        window.g.ApiUrl + '/eos/event/report/findEventDealById',
                    data: {
                        eventDealId: this.tableRow.event_deal_id,
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
                            res.data[0].areaId;
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
        forward(){
            const toTab = isAuth('chuanzhen:xianshi') &&
              !isAuth('duanxin:mokuai') &&
              !isAuth('phone:phoneinfo:list')
              ? 'first'
              : isAuth('duanxin:mokuai') && isAuth('phone:phoneinfo:list')
                ? 'fourth'
                : 'second';
            bus.$emit('tabChange', toTab);
            bus.$emit('getFaxFile', this.tableRow);
        }
  },
};
</script>

<style lang="scss" module>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  .header {
    height: 56px;
    line-height: 56px;
    text-align: right;
    padding-right: 15px;
    border-bottom: 1px solid #F2F2F2;
  }
  .main {
    flex-grow: 1;
    display: flex;
    & > section:first-child { flex-grow: 1; }
    & > section:last-child {
      width: 460px;
      flex-shrink: 0;
      border-left: 1px solid #F2F2F2;
    }
    .functionButton{
        height: 6%;
        display: flex;
        align-items: center;
        justify-content: space-around;
        
    }
  }
  .faxInformationDisposal{
    left: 170px; 
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>    
