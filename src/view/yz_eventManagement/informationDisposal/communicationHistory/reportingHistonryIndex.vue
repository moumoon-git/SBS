<template>
  <div class="reportingHistonryIndex_wrap">
    <header class="header">
      <!-- 头部选择日期及关键字-->
      <div class="header_date">
        <el-date-picker
          v-model="dateValue"
          @change="getCardList"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </div>
      <!-- 搜索-->
      <div class="search_wrap">
        <el-select v-model="typeId" placeholder="请选择类型" clear @change="getCardList">
          <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
    </header>
    <!--主体内容-->
    <section
      class="content"
      style="display: flex;flex-wrap: wrap;justify-content: flex-start;box-sizing: border-box;padding-left: 4%;"
    >
      <template v-if="cardList.length!=0">
        <div
          style="width: 30%;
            height: 300px;
            box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;
            border: 1px solid rgb(235, 238, 245);
            display: flex;
            margin: 20px 10px 0px;
            justify-content: space-between;
            flex-direction: column;
            text-align: initial;
            position: relative;"
          v-for="(item,index) in cardList"
          :key="index"
          @click="onClickCard(item)"
        >
          <div
            style="height: 20%;
            width: 100%;
            display: flex;
            align-items: center;
            position: relative;"
          >
            <span
              style="font-size: 20px;font-weight: bolder;margin-left: 5%;"
            >{{item.ctiOperator?item.ctiOperator.name:''}}</span>
            <i
              class="el-icon-phone-outline"
              style="color: #409eff;margin-left: 5%;cursor: pointer;"
              @click.stop="onTalkCall(item)"
            />
            <span style="color: #a2a2a2;position: absolute;right: 5%;">{{item.reportTime}}</span>
          </div>
          <p
            style="padding: 0px 5%;
            width: 100%;
            box-sizing: border-box;

            margin: 0px;
            display: -webkit-box;
            -webkit-line-clamp: 8;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;"
            v-if="item.typeDict.code=='form'"
          >{{item.description}}</p>
          <div style="width: 100%;color: rgb(162, 162, 162);" v-if="item.typeDict.code=='form'">
            <span style="margin-left:5%;">附件 {{item.attachmentList.length}}</span>
          </div>
          <div
            style="width: 100%;
            height: 212px;
            overflow: auto;
            padding: 0px 1% 0px 5%;
            box-sizing: border-box;
            margin-bottom: 3%;"
            v-if="item.typeDict.code=='img'"
          >
            <template v-if="item.attachmentList.length!=0">
              <el-image
                :style="{width: item.attachmentList.length>=3?'28%':(item.attachmentList.length==2?'45%':'92%'),height: item.attachmentList.length>=3?'4.2vw':(item.attachmentList.length==2?'4.5vw':'9.2vw'),margin: '1.8%'}"
                v-for="(imgItem,imgIndex) in item.attachmentList"
                :key="imgIndex"
                :src="$window.g.ApiUrl+imgItem.path"
                :preview-src-list="[$window.g.ApiUrl+imgItem.path]"
              ></el-image>
            </template>
            <el-image
              v-else
              style="width: 92%;height: 9.2vw;margin: 1.8%;"
              src="/static/img/noPicture.jpg"
              :preview-src-list="['/static/img/noPicture.jpg']"
            ></el-image>
          </div>
          <div style="width: 100%;height: 240px;overflow: auto;" v-if="item.typeDict.code=='video'">
            <video
              v-for="(videoItem,videoIndex) in item.attachmentList"
              :key="videoIndex"
              controls
              style="display: block;width: 84%;height: 10vw;margin: 0px auto 20px auto;"
            >
              <source :src="$window.g.ApiUrl+videoItem.path" type="video/mp4" />
            </video>
          </div>
          <div
            style="width: 100%;
            color: rgb(64, 158, 255);
            margin-bottom: 5%;"
          >
            <span
              style="margin-left:5%;cursor: pointer;"
              @click.stop="onLocation(item)"
            >位置：{{item.address}}</span>
          </div>
        </div>
      </template>
      <div
        v-else
        style="margin-left: 50%;
    margin-top: 50%;
    transform: translate(-50%,-50%);"
      >暂无数据</div>
    </section>

    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="cardListPagination.currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="cardListPagination.pageSize"
      layout=" sizes, prev, pager, next, jumper"
      :total="cardListPagination.total"
      style="margin: 0px 0px 20px 50%;
        transform: translateX(-50%);"
    ></el-pagination>
    <reportingDetailDialog
      ref="reportingDetailDialog"
      v-if="reportingDetailDialogVisible"
      @onCloseCallback="reportingDetailDialogVisible=false"
      @onLocation="onLocation"
      @onTalkCall="onTalkCall"
      :eventReportId="eventReportId"
    ></reportingDetailDialog>
    <location ref="loction" :mapframe="locationDataSetId"></location>
  </div>
</template>

<script>
import reportingDetailDialog from './reportingDetailDialog';
import location from '@/yz_components/loction/loction';
import mixin from '@/view/yz_integratedCommunication/icpPhone/icpPhonePage/mixin.js';
import mixin2 from '@/view/yangZhouEventReports/assets/js/mixin/mixin.js';

export default {
    name: 'reportingHistonryIndex',
    mixins: [mixin, mixin2],
    data() {
        return {
            typeId: '',
            options: [],
            eventReportId: '',
            reportingDetailDialogVisible: false,
            dateValue: [],
            cardListPagination: {
                total: 0,
                currentPage: 1,
                pageSize: 10,
            },
            cardList: [],
            mapObject: {
                longitude: '',
                latitude: '',
                address: '',
            },
            locationDataSetId: 'locationDataSetId',
        };
    },
    created() {
        this.getCardList();
    },
    mounted() {
        window.addEventListener('message', this.sendLocationMsg);
        this.$http({
            method: 'post',
            headers: {
                'Content-Type': '',
            },
            url:
                window.g.ApiUrl +
                `/emergency/preparation/dictionary/getByParentCode?pcode=vdcpEventReportType`,
            data: {},
        }).then(({ data }) => {
            console.log(
                '/emergency/preparation/dictionary/getByParentCode',
                data
            );
            this.options = data.data;
        });
    },
    components: {
        reportingDetailDialog,
        location,
    },
    methods: {
        handleSizeChange(val) {
            this.cardListPagination.pageSize = val;
            this.getCardList();
        },
        handleCurrentChange(val) {
            this.cardListPagination.currentPage = val;
            this.getCardList();
        },
        onTalkCall(row) {
            this.talkCall(row.ctiOperator);
        },
        getCardList() {
            this.$http({
                method: 'get',
                headers: {
                    'Content-Type': '',
                },
                url:
                    window.g.ApiUrl +
                    `/eos/event/vdcpEventReport/pageListEventReport?page=${
                        this.cardListPagination.currentPage
                    }&size=${this.cardListPagination.pageSize}${
                        this.dateValue.length != 0
                            ? '&startTime=' +
                              this.$moment(this.dateValue[0]).format(
                                  'YYYY-MM-DD HH:mm:ss'
                              )
                            : ''
                    }${
                        this.dateValue.length != 0
                            ? '&endTime=' +
                              this.$moment(this.dateValue[1]).format(
                                  'YYYY-MM-DD HH:mm:ss'
                              )
                            : ''
                    }&typeId=${this.typeId}`,
                data: {},
            }).then(({ data }) => {
                console.log(
                    '/eos/event/vdcpEventReport/pageListEventReport',
                    data
                );
                if (data.errorcode == 0) {
                    this.cardList = data.data.data;
                    this.cardListPagination.total = data.data.totalElements;
                }
            });
        },
        onLocation(item) {
            this.mapObject.longitude = item.longitude;
            this.mapObject.latitude = item.latitude;
            this.mapObject.address = item.address;
            this.$refs.loction.visible = false;
            this.$refs.loction.rushLocation = false;
            this.$nextTick(() => {
                this.$refs.loction.visible = true;
                this.$refs.loction.rushLocation = true;
            });
        },
        sendLocationMsg(obj) {
            if (obj.data.action && obj.data.action == 'ready') {
                if (this.mapObject.longitude && this.mapObject.latitude) {
                    //var framew = window.mapFrame.contentWindow;
                    var mapFrame = document.getElementById('locationDataSetId');
                    if (mapFrame) {
                        var data = {};
                        data.action = 'getpoint';
                        var object = {};
                        object.center =
                            this.mapObject.longitude +
                            ',' +
                            this.mapObject.latitude;
                        object.address = this.mapObject.address;
                        object.area = '';
                        data.object = object;
                        mapFrame.contentWindow.postMessage(
                            JSON.stringify(data),
                            '*'
                        );
                    }
                }
            }
        },
        onClickCard(item) {
            console.log('点击card', item);
            if (item.typeDict.code != 'form') {
                return;
            }
            this.reportingDetailDialogVisible = true;
            this.eventReportId = item.id;
            this.$nextTick(() => {
                this.$refs.reportingDetailDialog.reportingDetailDialogVisible = true;
            });
        },
    },
};
</script>

<style scoped>
.reportingHistonryIndex_wrap {
    width: 100%;
    height: 100%;
    overflow: auto;
}
.header {
    display: flex;
    align-items: center;
    padding: 13px;
    box-sizing: border-box;
    border-bottom: 1px solid #f3f3f3;
}
.header > span {
    margin-right: 20px;
    font-size: 17px;
    font-weight: 400;
    color: rgba(85, 85, 85, 1);
    min-width: 35px;
}
.header_date {
    position: relative;
    margin: 0 10px;
}
.header_date /deep/ .el-date-editor .el-range-input,
.el-date-editor .el-range-separator {
    /*text-align: left;*/
}
.header /deep/ .el-input__inner,
.header /deep/ .el-input__icon {
    height: 42px;
    line-height: 42px;
}
.header_date /deep/ .el-range-editor.el-input__inner {
    width: 399px;
    height: 42px;
}
.search_wrap {
    width: 399px;
    display: flex;
    align-items: center;
}
.search_wrap /deep/ .el-input__inner {
    border-radius: 5px 0 0 5px;
}
.search_wrap /deep/ .el-button--primary {
    width: 42px;
    height: 42px;
    background: rgba(63, 146, 254, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 7px;
    border-radius: 0 5px 5px 0;
}
.search_wrap /deep/ .el-button--primary img {
    width: 14px;
    height: 14px;
}
.content {
    width: 100%;
    height: 100%;
    overflow: auto;
}
</style>
