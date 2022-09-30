<!--
 * @author: author
 * @date: date
 * @version: version
 * @lastEditors: lastEditors
 * @lastEditTime: lastEditTime
 * @descripttion: descripttion
-->
<template>
  <div>
    <el-dialog
      title="上报详情"
      :visible.sync="reportingDetailDialogVisible"
      width="35%"
      @close="$emit('onCloseCallback')"
      :center="false"
    >
      <section v-if="cardDetail[0]" style="width:100%;height: 500px;overflow: auto;">
        <div style="position:relative;">
          <span style="font-size: 20px;font-weight: bolder;margin-left: 5%;">
            姓名：
            <span
              style="margin-left:5px;"
            >{{cardDetail[0].ctiOperator?cardDetail[0].ctiOperator.name:''}}</span>
          </span>
          <span style="font-size: 20px;font-weight: bolder;position: absolute;right: 5%;">
            电话：
            <span
              style="color: rgb(64, 158, 255);margin-left:5px;cursor: pointer;"
              @click="$emit('onTalkCall',cardDetail[0])"
            >{{cardDetail[0].ctiOperator?cardDetail[0].ctiOperator.mobile:''}}</span>
          </span>
        </div>
        <div
          style="
            width: 98%;
            border: 1px solid;
            border-radius: 15px;
            margin: 20px auto;
            position:relative;"
          v-for="(item,index) in cardDetail"
          :key="index"
        >
          <div style="position:relative;width: 100%;margin: 15px 0px;">
            <span style="font-size: 20px;font-weight: bolder;margin-left: 5%;">
              时间：
              <span style="margin-left:5px;font-weight: initial;">{{item.reportTime}}</span>
            </span>
            <span
              style="width: 40%;font-size: 20px;font-weight: bolder;position: absolute;right: 5%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"
            >
              位置：
              <el-tooltip class="item" effect="dark" :content="item.address" placement="top">
                <span
                  style="color: rgb(64, 158, 255);margin-left:5px;font-weight: initial;cursor: pointer;"
                  @click="$emit('onLocation',item)"
                >{{item.address}}</span>
              </el-tooltip>
            </span>
          </div>
          <div style="position:relative;width: 100%;margin: 15px 0px;">
            <span style="font-size: 20px;font-weight: bolder;margin-left: 5%;">
              事件类型：
              <span style="margin-left:5px;font-weight: initial;">{{item.caseClassName}}</span>
            </span>
            <span style="font-size: 20px;font-weight: bolder;position: absolute;right: 5%;">
              事件等级：
              <span
                style="color: rgb(64, 158, 255);margin-left:5px;font-weight: initial;"
              >{{item.eventLevelName}}</span>
            </span>
          </div>
          <div style="position:relative;width: 100%;margin: 15px 0px;">
            <span style="font-size: 20px;font-weight: bolder;margin-left: 5%;">事件内容：</span>
          </div>
          <p
            style="padding: 0px 5%;
            width: 100%;
            margin: -7px 0px 15px 0px;
            font-size: 20px;
            box-sizing: border-box;"
          >{{item.description}}</p>
          <div
            style="width: 100%;font-size: 20px;font-weight: bolder;margin: 15px 0px;"
            v-if="item.attachmentList.length!=0"
          >
            <span style="margin-left:5%;">附件：</span>
          </div>
          <div
            style="width: 100%;
                margin-top:-7px;
                display: flex;
                flex-wrap: wrap;
                padding: 0px 4% 0px 5%;
                box-sizing: border-box;
                margin-bottom: 15px;"
            v-if="item.attachmentList.length!=0"
          >
            <el-image
              v-for="(attachmentItem,attachmentIndex) in item.attachmentList"
              :key="attachmentIndex"
              style="width:17%;height: 5vw;margin: 1.4%;"
              :src="$window.g.ApiUrl+attachmentItem.path"
              :preview-src-list="[$window.g.ApiUrl+attachmentItem.path]"
            ></el-image>
          </div>
          <div
            :style="{position: 'absolute',
            right: '5%',
            bottom: '5%',color: 'white',
            padding: '5px 10px',
            'border-radius': '5px',
            background: index==0?'rgb(64, 158, 255)':'red'}"
          >{{index==0?'首报':'续报'}}</div>
        </div>
      </section>
    </el-dialog>
  </div>
</template>

<script>
export default {
    name: 'reportingDetailDialog',
    props: ['eventReportId'],
    data() {
        return {
            reportingDetailDialogVisible: false,
            cardDetail: [],
        };
    },
    created() {
        this.getCardDetail();
    },
    mounted() {},
    components: {},
    methods: {
        getCardDetail() {
            this.$http({
                method: 'get',
                headers: {
                    'Content-Type': '',
                },
                url:
                    window.g.ApiUrl +
                    `/eos/event/vdcpEventReport/getEventReportDealList?eventReportId=${this.eventReportId}`,
                data: {},
            }).then(({ data }) => {
                console.log(
                    '/eos/event/vdcpEventReport/getEventReportDealList',
                    data
                );
                if (data.errorcode == 0) {
                    this.cardDetail = data.data;
                }
            });
        },
    },
};
</script>

<style scoped>
</style>
