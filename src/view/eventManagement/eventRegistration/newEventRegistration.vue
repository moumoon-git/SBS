<template>
  <el-container>
    <el-dialog
      width="80%"
      :title="myEventTitle"
      :visible.sync="isopenEvent"
      :close-on-click-modal="false"
      @open="openDialog"
      @close="closeDialogMoldel"
    >
      <el-row>
        <el-col :span="20" style="text-align: left">
          <el-col :span="5">
            <el-date-picker
              style="width: 100%"
              :disabled="myEventFormData.timeDateVal"
              v-model="myEventFormData.valueStr"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-col>
          <el-col :span="19">
            <el-col :span="18">
              <el-col :span="6">
                <el-select
                  v-model="myEventFormData.findTheRangeValue"
                  placeholder="查找区间"
                  @change="intervalDetection1"
                  style="margin: 0 0 0 5px"
                >
                  <el-option
                    v-for="item in findTheRangeData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="6">
                <el-input
                  @blur="inputNumber"
                  v-model="myEventFormDataNumber"
                  placeholder="查询数量"
                  style="margin: 0 0 0 5px"
                ></el-input>
              </el-col>
            </el-col>
          </el-col>
        </el-col>

        <el-col
          :span="4"
          style="text-align: left; text-indent: 10px; margin-top: 2px"
        >
          <el-button type="primary" size="medium" @click="priveFind"
            >查找</el-button
          >
        </el-col>
      </el-row>
      <el-table
        v-loading="myEventFormData.tableLoading"
        height="530px"
        :data="myEventFormData.shentinTableData"
        border
        style="width: 100%; margin: 10px 0; text-align: center"
      >
        <el-table-column
          prop="title"
          align="center"
          label="事件标题"
          height="30"
          show-overflow-tooltip
          min-width="40%"
        >
        </el-table-column>
        <el-table-column
          prop="sendTime"
          align="center"
          label="事发时间"
          height="30"
          show-overflow-tooltip
          min-width="40%"
        ></el-table-column>
        <el-table-column
          prop="disasterType"
          align="center"
          label="事件类别"
          height="30"
          show-overflow-tooltip
          width="200"
        ></el-table-column>
        <el-table-column label="操作" width="220" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="openMyEvent(scope.row)"
              >打开</el-button
            >
            <el-button
              type="primary"
              size="mini"
              @click="addnMyEvent(scope.row)"
              >加入事件管理</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!--省厅弹窗end-->
    <div style="margin-top: 20px; width: 100%; position: relative">
      <el-header class="navsBar" style="height: 80px">
        <el-col :span="18" style="text-align: left">
          <el-col :span="5">
            <el-date-picker
              style="width: 100%"
              :disabled="timeDateVal"
              v-model="valueStr"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-col>
          <el-col :span="19">
            <el-col :span="6">
              <div style="margin-left: 5px">
                <el-input
                  placeholder="输入标题"
                  prefix-icon="el-icon-search"
                  v-model="searchInput"
                ></el-input>
              </div>
            </el-col>
            <el-col :span="18">
              <el-col :span="6">
                <el-select
                  v-model="findTheRangeValue"
                  placeholder="查找区间"
                  @change="intervalDetection"
                  style="margin: 0 0 0 5px"
                >
                  <el-option
                    v-for="item in findTheRangeData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="6">
                <el-select
                  clearable
                  v-model="eventLevelValue"
                  placeholder="事件级别"
                  style="margin: 0 0 0 5px"
                >
                  <el-option
                    v-for="item in eventLevelDate"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="6">
                <el-select
                  clearable
                  v-model="eventCategoryValue"
                  placeholder="事件类别"
                  style="margin: 0 0 0 5px"
                >
                  <el-option
                    v-for="item in eventCategoryData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="6">
                <el-select
                  clearable
                  v-model="handleTheStateValue"
                  placeholder="办理状态"
                  style="margin: 0 0 0 5px"
                >
                  <el-option
                    v-for="item in handleTheStateData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-col>
            </el-col>
          </el-col>
        </el-col>

        <el-col
          :span="6"
          style="text-align: left; text-indent: 10px; margin-top: 2px"
        >
          <el-button type="primary" size="medium" @click="eventFind"
            >查找</el-button
          >
          <el-button type="primary" size="medium" @click="advancedEventFind"
            >高级查找</el-button
          >
          <!-- <el-button type="primary" size="medium" @click="openEventFind(1)">省厅事件</el-button> -->
        </el-col>
      </el-header>

      <el-main style="padding: 12px 20px">
        <div class="contentStyle" style="height: 780px">
          <el-row>
            <el-col :span="9" class="colCalss">
              <div class="eventList">事件列表</div>
              <el-card class="box-card cardCalss" shadow="hover">
                <div style="display: flex; justify-content: space-between">
                  <div style="text-align: left">
                    <el-button
                      class="el-icon-edit"
                      size="mini"
                      @click="rowOpenEvent"
                      :disabled="selectList.length ? true : false"
                      >打开</el-button
                    >
                    <el-button
                      class="el-icon-delete"
                      size="mini"
                      @click="rowDelect"
                      >删除</el-button
                    >
                    <el-button
                      class="el-icon-tickets"
                      size="mini"
                      @click="conclusion"
                      :disabled="selectList.length ? true : false"
                      >总结报告</el-button
                    >
                    <el-button
                      class="el-icon-video-play"
                      size="mini"
                      @click="rowDealEvent"
                      :disabled="selectList.length ? true : false"
                      >处置</el-button
                    >
                    <!--@author：qinjiaqi 事件完结 -->
                    <el-button
                      size="mini"
                      class="el-icon-check"
                      @click="endEvent"
                      >事件完结</el-button
                    >
                    <el-button
                      size="mini"
                      @click="rowReportProvincia"
                      v-if="IsYangZhouProject"
                      >上报省厅</el-button
                    >
                  </div>
                  <div style="display: flex; align-items: center">
                    <div style="font-size: 15px; margin-right: 5px">
                      三级联动事件
                    </div>
                    <el-tooltip :content="linkageValue" placement="top">
                      <el-switch
                        v-model="linkageValue"
                        active-value="开"
                        inactive-value="关"
                      >
                      </el-switch>
                    </el-tooltip>
                  </div>
                </div>

                <el-table
                  height="530px"
                  :data="tableData"
                  border
                  @row-click="tableRowClick"
                  highlight-current-row
                  @selection-change="handleSelectionChange"
                  style="width: 100%; margin: 10px 0; text-align: center"
                >
                  <el-table-column type="selection" align="center" width="55">
                  </el-table-column>
                  <el-table-column
                    label="事件标题"
                    height="30"
                    align="center"
                    show-overflow-tooltip
                    min-width="40%"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.title }}
                      <i
                        class="el-icon-check"
                        style="
                          position: absolute;
                          left: 193px;
                          top: 19px;
                          color: #70b603;
                          font-size: 20px;
                        "
                        v-if="IsYangZhouProject && scope.row.reportStatus == 1"
                      ></i>
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    label="事发时间"
                    height="30"
                    show-overflow-tooltip
                    min-width="40%"
                  >
                    <template slot-scope="scope">
                      {{
                        scope.row.occurTime
                          ? scope.row.occurTime.substring(
                              0,
                              scope.row.occurTime.lastIndexOf(":")
                            )
                          : ""
                      }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="status"
                    align="center"
                    label="状态"
                    height="30"
                    show-overflow-tooltip
                    min-width="20%"
                  ></el-table-column>
                </el-table>
                <!--分页-->
                <el-pagination
                  center
                  small
                  layout="prev, pager, next,  total, jumper"
                  :page-size="pageSize"
                  :total="total"
                  :current-page="currentPage"
                  @current-change="handleCurrentChange"
                ></el-pagination>

                <div style="margin-top: 20px">
                  <div>
                    <span>
                      共
                      <span style="font-size: 25px; color: #479dff">{{
                        eventNumber
                      }}</span
                      >件事件
                    </span>
                    <span>
                      <span style="font-size: 25px; color: red">{{
                        eventDie
                      }}</span
                      >人死亡
                    </span>
                    <span>
                      <span style="font-size: 25px; color: #76d672">{{
                        eventWas
                      }}</span
                      >人受伤
                    </span>
                    <span>
                      <span style="font-size: 25px; color: #f58d25">{{
                        eventMissing
                      }}</span
                      >人失踪
                    </span>
                    <!--                     <span ><span style="font-size: 25px;color: #b1bfe4;">{{eventAffect}}</span >人受影响</span>-->
                  </div>
                </div>
              </el-card>
            </el-col>

            <el-col :span="9" class="colCalss">
              <div style="width: 100%">
                <div class="eventList">预览</div>
                <!-- 轮播图 -->
                <div v-show="eventList.length > 0" class="event_list_wrap">
                  <div class="swiper-container">
                    <div class="swiper-wrapper event_list">
                      <div
                        v-for="(item, index) in eventList"
                        :key="index"
                        class="swiper-slide"
                      >
                        <div
                          :class="
                            'item_wrap ' +
                            (currentEventData.eventIndex === index
                              ? 'item_wrap_active'
                              : '')
                          "
                          @click="clickEvent(item)"
                        >
                          <p class="event_name">{{ item.dealOrderName }}</p>
                          <p class="event_date">{{ item.eventCreateTime }}</p>
                          <!-- <i v-if="index === eventList.length - 1" class="el-icon-close" @click.stop.prevent="handleDeleteEvent(index, item)"></i> -->
                          <div class="item_wrap_bg">
                            <img
                              src="/static/img/Communihistory/event_bg.png"
                              alt=""
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="swiper-button-prev" slot="button-prev">
                      <div class="pre"></div>
                    </div>
                    <div class="swiper-button-next" slot="button-next">
                      <div class="next"></div>
                    </div>
                  </div>
                </div>

                <!-- 内容部分 -->
                <div class="newContent-box">
                  <el-scrollbar
                    class="formContent"
                    v-show="eventList.length > 0"
                  >
                    <!-- <el-form
                    size="small"
                    label-width="90px"
                    label-position="right"
                    style="padding-bottom: 70px"
                  > -->
                    <el-row :gutter="24" class="titleHeader header">
                      <el-col :span="4">
                        <div prop="eventTitle" class="Titles">事件标题:</div>
                      </el-col>
                      <el-col :span="16">
                        <div class="titleItem">
                          {{ currentEventDatas.title }}
                        </div>
                      </el-col>
                    </el-row>

                    <el-row :gutter="gutter" class="titleHeader">
                      <el-col :span="4">
                        <div prop="incidentTime" class="Titles">事发时间:</div>
                      </el-col>
                      <el-col :span="20" style="border: 1px solid transparent">
                        <div class="titleItem">{{ currentEventTime }}</div>
                      </el-col>
                    </el-row>

                    <el-row :gutter="gutter" class="titleHeader">
                      <el-col :span="4"
                        ><div prop="reportedTime" class="Titles">
                          接报时间:
                        </div></el-col
                      >
                      <el-col :span="20">
                        <div class="titleItem">
                          {{ currentEventDatas.reportTime }}
                        </div>
                      </el-col>
                    </el-row>

                    <el-row :gutter="gutter" class="titleHeader">
                      <el-col :span="4">
                        <div prop="incidenArea" class="Titles">辖区范围:</div>
                      </el-col>
                      <el-col :span="20">
                        <div class="titleItem">
                          {{ currentEventDatas.area }}
                        </div>
                      </el-col>
                    </el-row>

                    <el-row :gutter="gutter" class="titleHeader">
                      <el-col :span="4" class="incident_wrap">
                        <div prop="incidentSite" class="Titles">事发地点:</div>
                      </el-col>
                      <el-col :span="20" class="incident_wrap">
                        <div class="titleItem">
                          {{ currentEventDatas.address }}
                        </div>
                      </el-col>
                    </el-row>

                    <el-row :gutter="gutter" class="titleHeader">
                      <el-col :span="4" class="incident_wrap">
                        <div prop="incidentSite" class="Titles">落图地点:</div>
                      </el-col>
                      <el-col :span="19">
                        <div class="SiteItem">
                          <div style="display: flex">
                            <span class="locas">{{
                              currentEventDatas.address
                            }}</span>
                            <i
                              class="el-icon-location-outline icon-location"
                              @click="location"
                            ></i>
                          </div>
                          <div class="submit_btn">
                            <el-button
                              size="mini"
                              @click="sendSite"
                              class="sendBtn"
                            >
                              发送
                            </el-button>
                          </div>
                        </div>
                      </el-col>
                    </el-row>

                    <el-row :gutter="gutter" class="titleHeader">
                      <el-col :span="4">
                        <div prop="reportingUnit" class="Titles">报告单位:</div>
                      </el-col>

                      <el-col :span="20" style="border: 1px solid transparent">
                        <div class="titleItem">
                          {{ currentEventDatas.reportDepart }}
                        </div>
                      </el-col>
                    </el-row>

                    <el-row :gutter="gutter" class="titleHeader">
                      <el-col :span="4">
                        <div prop="incidenType" class="Titles">事件类型:</div>
                      </el-col>

                      <el-col :span="20">
                        <div class="titleItem">
                          {{ currentEventDatas.typeName }}
                        </div>
                      </el-col>
                    </el-row>

                    <el-row :gutter="gutter" class="titleHeader">
                      <el-col :span="4">
                        <div class="Titles">事件要素:</div>
                      </el-col>

                      <el-col :span="20">
                        <div class="informations">
                          <div
                            v-for="(
                              item, index
                            ) in currentEventDatas.eventParams"
                            :key="index"
                            class="information_elements_item"
                          >
                            <span>{{ item.name + ":" }}</span>
                            <span v-if="item.type === '数字'">{{
                              item.value == "" ? 0 : item.value
                            }}</span>
                            <span v-else>{{ item.value }}</span>
                            <span>{{ item.unit ? item.unit : "" }}</span>
                          </div>
                        </div>
                      </el-col>
                    </el-row>

                    <el-row :gutter="gutter" class="titleHeader">
                      <el-col :span="4">
                        <div prop="allCase" class="Titles">事件简况:</div>
                      </el-col>
                      <el-col :span="20">
                        <div class="reportDescription">
                          {{ currentEventDatas.reportDescription }}
                        </div>
                      </el-col>
                    </el-row>
                    <el-row :gutter="gutter" class="titleHeader">
                      <el-col :span="4">
                        <div id="otherAttachments" class="Titles">
                          其他附件:
                        </div>
                      </el-col>
                      <el-col :span="20">
                        <div class="file_list">
                          <div
                            v-for="(item, index) in fileList"
                            :key="item.index"
                            class="file_item"
                          >
                            <i class="el-icon-paperclip"></i>
                            <span
                              class="file_name"
                              @click="downloadFile(item)"
                              >{{ item.fileName }}</span
                            >
                          </div>
                        </div>
                      </el-col>
                    </el-row>
                  </el-scrollbar>
                </div>
              </div>
            </el-col>

            <el-col :span="6" class="colCalss">
              <div class="eventList">事件时序信息管理</div>
              <div class="new-box">
                <el-card class="box-card cardCalss cards" shadow="hover">
                  <div style="width: 100%">
                    <el-radio-group
                      v-model="eventChainValue"
                      @change="eventChain"
                    >
                      <el-radio-button
                        v-for="item in eventChainData"
                        :key="item.id"
                        :label="item.id"
                        >{{ item.name }}</el-radio-button
                      >
                    </el-radio-group>
                  </div>

                  <el-scrollbar style="height: 600px">
                    <div>
                      <el-card
                        class="box-card card-icons"
                        :class="{ red: changeRed == index }"
                        v-for="(item, index) in itemBox"
                        :key="index"
                        style="margin: 10px 0"
                      >
                        <div class="cardHeader">
                          <div class="cardTime">{{ item.time }}</div>
                          <div class="cardDetail" @click="cardDetail(item)">
                            详情
                          </div>
                          <i
                            class="el-icon-close"
                            style="cursor: pointer"
                            @click="deleteEvents(item, index)"
                          ></i>
                        </div>

                        <div class="cardIphone" v-if="item.type == 'phone'">
                          <div
                            class="phoneIcon"
                            style="position: absolute; top:12%; left: -24%"
                          >
                            电话
                          </div>
                          <div class="contact">
                            <el-row :gutter="24" class="contactItem">
                              <el-col style="text-indent: 30px" :span="9">
                                联系人:
                              </el-col>
                              <el-col :span="15">
                                <div>
                                  {{ item.contact == null ? "" : item.contact }}
                                </div>
                              </el-col>
                            </el-row>
                            <el-row :gutter="24" class="contactItem">
                              <el-col :span="9"> 通话时长: </el-col>
                              <el-col :span="15">
                                <div>
                                  {{ item.conversationTime }}
                                </div>
                              </el-col>
                            </el-row>
                            <el-row :gutter="24" class="contactItem">
                              <el-col :span="9"> 备注信息: </el-col>
                              <el-col :span="15">
                                <div class="textRemark">
                                  {{ item.remark }}
                                </div>
                              </el-col>
                            </el-row>
                            <el-row style="display: flex">
                              <el-col :span="10"> 电话录音: </el-col>
                              <el-col :span="24">
                                <div
                                  id="content_del"
                                  style="position: relative"
                                >
                                  <audio
                                    style="display: none"
                                    controls
                                    :src="audioSrc"
                                  ></audio>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                        </div>

                        <div class="cardIphone" v-if="item.type == 'sms'">
                          <div
                            class="phoneIcon"
                           style="position: absolute; top:12%; left: -24%"
                          >
                            短信
                          </div>
                          <div class="contact" style="margin-bottom: 8px">
                            <el-row :gutter="24">
                              <el-col :span="8"> 收信人: </el-col>
                              <el-col :span="16">
                                <div class="contact_list">
                                  <span
                                    v-for="(man, index) in item.nameListFour"
                                    :key="index"
                                    class="contact_item"
                                    >{{ man }}</span
                                  >
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div class="cardRemark">
                            <el-row :gutter="24">
                              <el-col class="contenTitle" :span="6"
                                >信息内容:</el-col
                              >
                              <el-col :span="18" class="contentMsg">
                                <div class="cardItem">{{ item.content }}</div>
                              </el-col>
                            </el-row>
                          </div>
                        </div>
                        <div class="cardIphone" v-if="item.type == 'fax'">
                          <div
                            class="phoneIcon"
                            style="position: absolute; top:12%; left: -24%"
                          >
                            传真
                          </div>
                          <div class="contact" style="margin-bottom: 8px">
                            <el-row :gutter="24" style="margin-bottom: 8px">
                              <el-col :span="8"> 收信人: </el-col>
                              <el-col :span="16">
                                <div class="contact_list">
                                  <span
                                    v-for="(man, index) in item.nameListFour"
                                    :key="index"
                                    class="contact_item"
                                    >{{ man }}</span
                                  >
                                </div>
                              </el-col>
                            </el-row>
                          </div>

                          <div class="Faxs">
                            <el-row :gutter="24">
                              <el-col :span="8">传真文件: </el-col>
                              <el-col :span="16">
                                <div class="faxName" @click="itemClick(item)">
                                  {{ item.name }}
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                        </div>
                      </el-card>
                    </div>
                  </el-scrollbar>

                  <div class="footerBtn">
                    <div
                      class="icon-help"
                      size="medium"
                      type="primary"
                      @click="eventPanorama"
                    >
                      事件全景
                    </div>
                    <div
                      class="icon-help"
                      size="medium"
                      type="primary"
                      @click="exportList"
                    >
                      导出列表
                    </div>
                  </div>
                </el-card>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-main>
    </div>

    <!--悬浮球-->
    <div class="floatingBall" @mousedown="move" v-if="(floatingBall = false)">
      <div
        style="
          color: white;
          margin-top: 25px;
          position: relative;
          cursor: pointer;
        "
      >
        <div
          style="
            font-size: 25px;
            font-family: 'STXingkai';
            text-align: center;
            padding: 5px 0;
            color: red;
          "
          @click="flyMe = !flyMe"
        >
          {{ untreated }}
        </div>
        <div
          @click="dblclickDialog"
          style="font-size: 16px; font-family: 'Microsoft JhengHei'"
        >
          当前未处理
        </div>
      </div>
      <transition name="el-zoom-in-center">
        <div
          class="transition-box"
          style="position: absolute; right: -40px; top: -30px"
          v-if="flyMe"
        >
          <el-badge :max="99" :value="phoneValue" class="item">
            <!--电话-->
            <el-button
              size="small"
              class="el-icon-phone buttonBadge"
              @click="allClickPhoneDialog"
            ></el-button>
          </el-badge>
        </div>
      </transition>

      <transition name="el-zoom-in-center">
        <div
          class="transition-box"
          style="position: absolute; right: -65px; top: 40px"
          v-if="flyMe"
        >
          <el-badge :max="99" :value="smsValue" class="item">
            <!--短信-->
            <el-button
              size="small"
              class="el-icon-s-comment buttonBadge"
              @click="allClickSmsDialog"
            ></el-button>
          </el-badge>
        </div>
      </transition>

      <transition name="el-zoom-in-center">
        <div
          class="transition-box"
          style="position: absolute; right: -40px; top: 115px"
          v-if="flyMe"
        >
          <el-badge :max="99" :value="faxValue" class="item">
            <!--传真-->
            <el-button
              size="small"
              class="el-icon-printer buttonBadge"
              @click="dblclickDialog"
            ></el-button>
          </el-badge>
        </div>
      </transition>
    </div>

    <!--高级查找外层弹窗-->
    <el-dialog
      width="600px"
      :title="title"
      :visible.sync="outerVisible"
      :close-on-click-modal="false"
      @close="beforeClose"
    >
      <el-form
        label-width="80px"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        @submit.native.prevent
      >
        <el-form-item label="事件标题:">
          <el-input
            type="text"
            v-model.trim="ruleForm.eventTitle"
            @change="changeVal"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="报送单位:">
          <el-input type="text" v-model.trim="ruleForm.submittedUnit" clearable>
            <template slot="append">
              <el-button @click="submittedSelect">选择</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="事件类型:">
          <el-input type="text" v-model.trim="ruleForm.submittedType" clearable>
            <template slot="append">
              <el-button @click="eventSelect">选择</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="事发时间:">
          <el-date-picker
            v-model="ruleForm.beginTime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="开始日期"
          ></el-date-picker>
          <span>&nbsp;至&nbsp;</span>
          <el-date-picker
            v-model="ruleForm.endTime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="事件级别:">
          <el-select
            style="width: 100%"
            v-model="ruleForm.rankEvent"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in rankSelect"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!--内层弹窗-->
      <el-dialog
        width="400px"
        :title="coreTitle"
        :visible.sync="innerVisible"
        append-to-body
        :close-on-click-modal="false"
      >
        <tree-search
          ref="treeSearch"
          @affirmDialog="affirmDialog"
          @cancelDialog="cancelDialog"
        ></tree-search>
      </el-dialog>

      <div slot="footer" class="dialog-footer" style="text-align: center">
        <!--        <el-button @click="outerVisible = false">取消</el-button>-->
        <el-button type="primary" @click="lookForConfirmation">查找</el-button>
      </div>
    </el-dialog>

    <!--旧版本的处置弹窗，现在弃用，没有引入(所有相关数据没有删除，只是没有引用这个组件了)-->
    <deal-dialog
      v-if="dealRefresh"
      :dealDialog="dealDialog"
      :dealTitle="dealTitle"
      ref="dispositionDisposal"
      @dispositionClose="dispositionClose"
      @dispositionConfirm="dispositionConfirm"
      @dispositionCloseDialog="dispositionCloseDialog"
      :eventId="eventId"
      :reportDescription="reportDescription"
      :continueItem="continueItem"
    ></deal-dialog>

    <!--新的短信、传真处置模块-->
    <manage-dialog
      v-if="manageDialogRefresh"
      ref="manageDialog"
      :manageTitle="manageTitle"
      :manageDialog="manageDialog"
      @manageCloseDialog="manageCloseDialog"
      :itemData="itemData"
      :disposalType="disposalType"
    ></manage-dialog>

    <associated-changes-model
      v-if="associatedRefresh"
      ref="associatedChangesModel"
      :associatedChangesModelTitle="associatedChangesModelTitle"
      :associatedChangesModelDialog="associatedChangesModelDialog"
      @associatedManageCloseDialog="associatedManageCloseDialog"
      @associatedClose="associatedClose"
      @associatedAffirm="associatedAffirm"
    ></associated-changes-model>

    <!--全部模板的弹窗-->
    <all-model-dialog
      ref="allModelDialog"
      :allModelTitle="allModelTitle"
      :suspendModelDialog="suspendModelDialog"
      @allModelCloseDialog="allModelCloseDialog"
    ></all-model-dialog>

    <!--事件全景-->
    <el-dialog
      id="panoramaId"
      top="30px"
      :title="panorameTitle"
      :visible.sync="panorameVisible"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <panorama
        :key="titleKey"
        :childTitle="childTitle"
        :childEventId="eventId"
      ></panorama>
    </el-dialog>

    <!-- 删除弹窗 -->
    <el-dialog
      class="reportTitle"
      width="400px"
      :title="reportTitle"
      :visible.sync="isDeleteShow"
      :close-on-click-modal="false"
      center
      :before-close="handleDelReportClose"
      :show-close="false"
    >
      <div class="delSubTitles">
        <p>{{ SubTitles }}</p>
      </div>
      <div class="delContent">
        <p>已选事件数:{{ selectList.length }}</p>
        <ul class="selectWrap">
          <li
            class="selectItem"
            v-for="(item, index) in selectList"
            :key="index"
          >
            {{ item.title }}
            <i class="el-icon-error icon-error" @click="delItem(index)"></i>
          </li>
        </ul>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleDelReportClose">取 消</el-button>
        <el-button type="danger" @click="sureBtn">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 事件上报 -->
    <el-dialog
      class="reportTitle"
      width="400px"
      :title="reportTitle"
      :visible.sync="isShow"
      :close-on-click-modal="false"
      center
      :before-close="handleDelClose"
      :show-close="false"
    >
      <div class="delSubTitles">
        <p>{{ SubTitles }}</p>
      </div>
      <div class="delContent">
        <p>已选事件数:{{ selectList.length }}</p>
        <ul class="selectWrap">
          <li
            class="selectItem"
            v-for="(item, index) in selectList"
            :key="index"
          >
            {{ item.title }}
            <span class="reportItem" v-if="item.reportStatus == 1">已上报</span>
            <i class="el-icon-error icon-error" @click="delItem(index)"></i>
          </li>
        </ul>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleDelClose">取 消</el-button>
        <el-button type="success" @click="reportBtn">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 传真文件弹窗 -->
    <el-dialog
      class="FaxCard"
      width="800px"
      top="10vh"
      :visible.sync="isFaxCard"
      :close-on-click-modal="false"
      :show-close="true"
      @click="isFaxCard = true"
      fullScreen
    >
      <div class="box-card" style="margin: 10px 0; height: 660px">
        <span class="sendFaxList-headline"></span>
        <span class="title-text">传真预览</span>
        <img
          @click="fullScreenDialog = true"
          style="
            width: 20px;
            height: 20px;
            position: absolute;
            top: 19px;
            right: 49px;
            z-index: 99;
            cursor: pointer;
          "
          src="../../../assets/phoneHistoryIcon/fullScreen.png"
        />
        <iframe
          :src="allFpxPreviewPath"
          id="fpxIframe"
          width="100%"
          height="100%"
          frameborder="no"
          marginwidth="0"
          marginheight="0"
          scrolling="no"
          allowtransparency="yes"
        >
        </iframe>
        <!-- <pdf :src="allFpxPreviewPath" width="91px" height="125px"></pdf> -->
      </div>
    </el-dialog>
    <!--弹窗预览传真-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="fullScreenDialog"
      fullscreen
    >
      <iframe
        :src="allFpxPreviewPath"
        id="iframe"
        width="100%"
        height="900px"
        frameborder="no"
        marginwidth="0"
        marginheight="0"
        scrolling="no"
        allowtransparency="yes"
      ></iframe>
    </el-dialog>
    <!-- 全部历史详情 -->
    <el-dialog
      class="selectHistory"
      width="500px"
      :visible.sync="isDialog"
      :close-on-click-modal="false"
      :show-close="true"
      @click="isDialog = true"
    >
      <div class="box-card" style="margin: 10px 0">
        <div class="cardTimes">{{ currentItem.time }}</div>

        <div class="cardIphones1" v-if="currentItem.type == 'phone'">
          <el-row :gutter="20" style="margin-bottom: 8px">
            <el-col :span="4" style="text-indent: 13px"> 联系人: </el-col>
            <el-col :span="15">
              <div>
                {{ currentItem.contact == null ? "" : currentItem.contact }}
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20" style="margin-bottom: 8px">
            <el-col :span="4"> 通话时长: </el-col>
            <el-col :span="15">
              <div>
                {{ currentItem.conversationTime }}
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20" style="margin-bottom: 8px">
            <el-col :span="4"> 备注信息:</el-col>
            <el-col :span="15">
              <div>
                {{ currentItem.remark }}
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-bottom: 8px">
            <el-col :span="4"> 电话录音:</el-col>
            <el-col :span="15">
              <div id="content_del" style="position: relative">
                <audio style="display: none" controls :src="audioSrc"></audio>
              </div>
            </el-col>
          </el-row>
        </div>

        <div class="cardIphones1" v-if="currentItem.type == 'sms'">
          <div class="contact" style="margin-bottom: 8px">
            <el-row :gutter="20">
              <el-col :span="4"> 收信人: </el-col>
              <el-col :span="7">
                <div class="contact_list">
                  <span
                    v-for="(man, index) in currentItem.nameList"
                    :key="index"
                    class="contact_item"
                    >{{ man }}</span
                  >
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="currentContent">
            <el-row :gutter="24">
              <el-col class="contenTitle" :span="5">信息内容:</el-col>
              <el-col :span="19" class="contentMsg">
                <div>{{ currentItem.content }}</div>
              </el-col>
            </el-row>
          </div>
        </div>

        <div class="cardIphones1" v-if="currentItem.type == 'fax'">
          <el-row :gutter="20">
            <el-col :span="4"> 收信人: </el-col>
            <el-col :span="16">
              <div class="contact_list">
                <span
                  v-for="(man, index) in currentItem.nameList"
                  :key="index"
                  class="contact_item"
                  >{{ man }}</span
                >
              </div>
            </el-col>
          </el-row>
          <div class="fax">
            <el-row :gutter="20">
              <el-col class="faxData" :span="4"> 传真文件: </el-col>
              <el-col :span="17">
                <div class="faxNameItem" @click="itemClick(currentItem)">
                  {{ currentItem.name }}
                </div>
                <!-- <div v-for="name in currentItem.nameList" :key="name.index">{{ name }}</div> -->
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </el-dialog>

    <location ref="loction" :mapframe="mapId"></location>
    <!--发送事发地点-->
    <multiple-contact
      ref="selectDialog"
      v-if="hackResetMultiple"
      @close="closeMultiple"
      @confirm="confirmMultiple"
      @closeDialog="closeMyDialogMultiple"
      :selectTitle="selectTitle"
      :selectData="selectData"
    ></multiple-contact>
  </el-container>
</template>

<script>
import treeSearch from "@/view/eventManagement/eventRegistration/plan/treeSearch";
import dealDialog from "@/view/eventManagement/eventRegistration/plan/dispositionDisposal"; //旧的处置模块
import manageDialog from "@/view/eventManagement/eventRegistration/newModel/manageDialog"; //新的短信、传真处置模块
import associatedChangesModel from "@/view/eventManagement/eventRegistration/newModel/associatedChangesModel";
import allModelDialog from "@/view/eventManagement/eventRegistration/newModel/allModelDialog"; //悬浮球弹窗全部Model
import panorama from "@/view/eventManagement/eventRegistration/plan/panorama"; //事件全景
import bus from "@/components/common/js/eventBus";
import { sectionToChinese } from "@/assets/js/common.js";
import Location from "@/components/loction/loction";
import multipleContact from "@/view/eventManagement/eventReports/dialog/selectDialog";
import audioControls from "../../../../static/audioControls/audioPlugin";
import { matchFileType } from "@/assets/js/common.js";
import pdf from "vue-pdf";

export default {
  name: "eventRegistration",
  components: {
    treeSearch,
    dealDialog,
    manageDialog,
    associatedChangesModel,
    allModelDialog,
    panorama,
    Location,
    multipleContact,
    pdf,
  },
  data() {
    return {
      // seeDetails:"查看详情",
      faxTitle: "", //传真弹窗标题
      fullScreenDialog: false,
      fileList: [], // 附件列表
      clickFlag: true,
      audioControls: "", // 音频的构造函数
      Faxdis: false,
      allFpxPreviewPath: "", //allModel选中传真的传真预览地址
      ApiUrl: window.g.ApiUrl,
      audioSrc: null, // 录音地址
      selectData: false, //发送事发地点是否弹窗
      selectTitle: "", //发送事发地点弹窗标题
      hackResetMultiple: true, //强制刷新
      mapId: "overId", //地图定位不同的ID
      gutter: 20,
      eventTitle: "",
      incidentTime: "",
      reportedTime: "",
      accidentUnit: "",
      incidenArea: "",
      incidentSite: "",
      reportingUnit: "", //报告单位
      incidenType: "", //事件类型
      allCase: "", //事件概况
      currentEventData: {}, // 当前选中的事件续报或首报的信息
      currentEventDatas: "",
      currentEventTime: "",
      eventList: [], // 事件列表 轮播 扬州项目使用
      IsYangZhouProject: window.g.IsYangZhouProject,
      testData: "",
      isDeleteShow: false,
      isShow: false, //是否弹出删除框
      isDialog: false, //是否弹窗短信,传真,电话详情弹窗
      isFaxCard: false,
      myEventTitle: "省厅事件",
      isopenEvent: false,
      myEventFormData: {
        shentinTableData: [], //省厅table
        valueStr: "", //搜索日期
        searchInput: "", //标题搜索
        findTheRangeValue: 0, //查找区间选中
        tableLoading: false,
      },
      myEventFormDataNumber: 10, //省厅默认查找条数
      valueStr: "", //搜索日期
      searchInput: "", //标题搜索
      findTheRangeValue: 0, //查找区间选中
      findTheRangeData: [
        {
          id: 0,
          name: "不限时间",
        },
        {
          id: 1,
          name: "当天",
        },
        {
          id: 2,
          name: "3天",
        },
        {
          id: 3,
          name: "7天",
        },
        {
          id: 4,
          name: "15天",
        },
        {
          id: 5,
          name: "30天",
        },
      ], //获取到的查找区间
      eventLevelValue: "", //事件级别选中
      eventLevelDate: [], //获取到的事件级别
      eventCategoryValue: "", //事件类别选中
      eventCategoryData: [], //获取到的事件类别
      handleTheStateValue: "", //办理状态选中
      handleTheStateData: [], //获取到办理状态
      tableData: [], //表格数据
      showOperation: false, //是否显示表格的操作列
      eventChainValue: "0", //事件链选中
      eventChainData: [
        { id: "0", name: "全部" },
        { id: "1", name: "传真" },
        { id: "2", name: "电话" },
        { id: "3", name: "短信" },
      ], //获取到的事件链
      pageSize: 10, //分页,一页显示多少条
      currentPage: 1, //当前页数
      total: 0, //总页数
      eventNumber: 0, //共多少件事件
      eventDie: 0, //共多少人死亡
      eventWas: 0, //共多少人受伤
      eventMissing: 0, //共多少人失踪
      // eventAffect:0,//共多少人受影响
      itemBox: [], //事件链存储数据
      fit: "fill",
      previewUrl: "", //预览的图片地址
      listStaet: "查找", //区分查找/高级查找
      outerVisible: false, //高级查找外层弹窗
      title: "", //高级查找外层标题
      typeData: "", //区分事件类型
      ruleForm: {
        //高级查找外层表单
        eventTitle: "",
        submittedUnit: "",
        submittedType: "",
        beginTime: "",
        endTime: "",
        rankEvent: "",
      },
      UnitId: [], //保存高级选中单位的ID
      eventTypeId: [], //保存高级选中类型的ID
      rules: {},
      rankSelect: [], //高级查找事件级别
      innerVisible: false, //高级查找内层弹窗
      coreTitle: "", //内层弹窗标题
      dialogRefresh: true, //刷新高级查找弹窗
      timeDateVal: false, //日期是否可选
      RowData: [], //表格行点击保存数据
      pathname: "/newEventReports", // 事件列表点击打开后跳转的页面地址
      dealDialog: false, //处置弹窗是否弹出
      dealTitle: "", //处置弹窗标题
      positionX: 0,
      positionY: 0,
      untreated: 0, //悬浮球未处理数量
      phoneValue: 0, //悬浮球电话数量
      smsValue: 0, //悬浮球短信数量
      faxValue: 0, //悬浮球传真数量
      flyMe: false, //悬浮球子模块是否显示
      eventId: null, //事件ID,(有些地方没有直接用到,是用的RowData.id的方式的)
      dealRefresh: false, //强制刷新处置弹窗
      reportDescription: "", //传递给处置弹窗的总体情况
      continueItem: "", //传递给处置弹窗的信息模块的数据
      itemClickData: "", //用来帮助预览判断是什么类型的预览
      itemClickDataRemark: "", //电话或短信备注或是内容数据
      changeRed: -1, //事件链更换样式
      /***
       * 下面是新的处置模块的变量
       * */
      manageTitle: "", //处置弹窗标题
      manageDialog: false, //是否弹出
      manageDialogRefresh: false, //强制刷新
      itemData: "", //传递给弹窗的当前这个事件链的当前数据
      disposalType: "", //打开处置页面的类型控制

      associatedChangesModelTitle: "", //关联事件弹窗Title,
      associatedChangesModelDialog: false, //关联事件是否开启弹窗
      associatedRefresh: true, //关联事件弹窗刷新

      /**下面是悬浮球弹出all
       * */
      allModelTitle: "",
      suspendModelDialog: false,
      registerStyle: {
        height: "",
      },
      panorameTitle: "", //全景弹窗标题
      panorameVisible: false, //全景弹窗
      childTitle: "", //全景标题
      titleKey: null, //用来刷新全景弹窗
      selectList: [], //保存选中的事件
      deleteTitle: "", //删除弹框标题
      delateList: [], //删除弹窗的数据
      // value:false,
      reportTitle: "", //删除,上报省厅弹窗标题
      SubTitles: "", //删除弹窗,上报省厅副标题
      linkageValue: "关", //三级联动开关
      // isOpenLab: window.g.IsOpenLabProject, // 是否openlab项目

      currentItem: {},
      reportingUnitData: [], // 报告单位
    };
  },
  watch: {
    myEventFormDataNumber(newV, oldV) {
      console.log(newV, oldV);
      this.myEventFormDataNumber = newV.replace(/[^0-9]/gi, "");
    },
    eventId: {
      handler(newV, oldV) {
        if (newV === "" || newV === null) {
          this.itemBox = [];
          this.listStaet = "查找";
          this.RowData = [];
          this.reportDescription = "";
          this.continueItem = "";
          this.changeRed = -1;
        }
        if (newV !== oldV) {
          this.itemClickData = "";
          this.itemClickDataRemark = "";
          this.changeRed = -1;
        }
      },
      deep: true,
    },
    linkageValue() {
      this.getTableListData();
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.getEventLevenData();
      this.getCaseData();
      this.getStateData();
      this.getTableListData();
      this.getfloatingBallData();
      this.topUnitTree();
    });
  },
  created() {
    window.addEventListener("resize", this.getHeight);
    window.addEventListener("message", this.locationCallback);
    window.addEventListener("message", this.sendLocationMsg);

    this.getHeight();
  },
  beforeDestroy() {
    window.removeEventListener("message", this.locationCallback);
    window.addEventListener("message", this.sendLocationMsg);
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight);
  },
  methods: {
    /**
     * @author hexinting
     * @date 2021-1-9
     * @description 获取报送单位(新)
     */
    topUnitTree() {
      this.$api.topUnitTree().then((res) => {
        if (res.errorcode === 0) {
          this.reportingUnitData = res.data ? res.data : [];
          console.log("获取报告单位: ", this.reportingUnitData);
          var gettree = function (data) {
            for (var i = 0; i < data.length; i++) {
              if (data[i].children.length == 0) {
                data[i].children = undefined;
              } else {
                gettree(data[i].children);
              }
            }
          };
          if (this.reportingUnitData && this.reportingUnitData.length > 0) {
            gettree(this.reportingUnitData);
          }
        }
      });
    },
    /**
     * @param {number/string} id 报送单位id or 报送单位名字(数据库中，有的旧数据是报送单位名字，新数据是报送单位id)
     * @returns data data: { id: 报送单位id, name: 报送单位名字 }
     * @author hexinting
     * @lastDate 2021-1-9
     * @description 获取报告单位
     */
    getReportingUnit(id) {
      console.log("报送单位：", id);
      console.log("报送单位列表", this.reportingUnitData);
      var departId = parseInt(id);
      let data = {
        id: [], // 报送单位id
        name: "", // 报送单位名字
      };
      if (departId.toString() != "NaN") {
        var departName = "";
        if (
          this.reportingUnitData.filter((item) => item.id === departId).length >
          0
        ) {
          let departArr = [];
          departArr.push(
            this.reportingUnitData.filter((item) => item.id === departId)[0].id
          );
          departName = this.reportingUnitData.filter(
            (item) => item.id === departId
          )[0].name;
          data.id = departArr;
          data.name = departName;
          return data;
        } else {
          for (let i = 0; i < this.reportingUnitData.length; i++) {
            let departArr = [];
            departArr.push(this.reportingUnitData[i].id); // 第一层
            if (
              this.reportingUnitData[i].children &&
              this.reportingUnitData[i].children.filter(
                (item) => item.id === departId
              ).length > 0
            ) {
              departName = this.reportingUnitData[i].children.filter(
                (item) => item.id === departId
              )[0].name;
              departArr.push(
                this.reportingUnitData[i].children.filter(
                  (item) => item.id === departId
                )[0].id
              );
              data.id = departArr;
              data.name = departName;
              return data;
            }
            if (
              this.reportingUnitData[i].children &&
              this.reportingUnitData[i].children.length > 0
            ) {
              for (
                let j = 0;
                j < this.reportingUnitData[i].children.length > 0;
                j++
              ) {
                if (this.reportingUnitData[i].children[j].children) {
                  let child = this.reportingUnitData[i].children[j].children;
                  if (child.filter((item) => item.id === departId).length > 0) {
                    // console.log('选中报送单位：', child);
                    departArr.push(this.reportingUnitData[i].children[j].id); // 第二层
                    departArr.push(
                      child.filter((item) => item.id === departId)[0].id
                    ); // 第三层
                    departName = child.filter((item) => item.id === departId)[0]
                      .name;
                    data.id = departArr;
                    data.name = departName;
                    return data;
                  } else {
                    for (let el of child) {
                      if (
                        el.children &&
                        el.children.filter((item) => item.id === departId)
                          .length > 0
                      ) {
                        departArr.push(
                          this.reportingUnitData[i].children[j].id
                        ); // 第二层
                        departArr.push(el.id); // 第三层
                        departArr.push(
                          el.children.filter((item) => item.id === departId)[0]
                            .id
                        ); // 第四层
                        departName = el.children.filter(
                          (item) => item.id === departId
                        )[0].name;
                        data.id = departArr;
                        data.name = departName;
                        return data;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      } else {
        // 数据库拿到的reportDepart是名字
        var departName = id;
        // console.log("----reportDepart是名字------", departName);
        // console.log("this.reportingUnitData: ", this.reportingUnitData);
        if (
          this.reportingUnitData.filter((item) => item.name === departName)
            .length > 0
        ) {
          let departArr = [];
          departArr.push(
            this.reportingUnitData.filter((item) => item.name === departName)[0]
              .id
          );
          data.id = departArr;
          data.name = departName;
          return data;
        } else {
          for (let i = 0; i < this.reportingUnitData.length; i++) {
            let departArr = [];
            departArr.push(this.reportingUnitData[i].id); // 第一层
            if (
              this.reportingUnitData[i].children &&
              this.reportingUnitData[i].children.filter(
                (item) => item.name === departName
              ).length > 0
            ) {
              departArr.push(
                this.reportingUnitData[i].children.filter(
                  (item) => item.name === departName
                )[0].id
              );
              data.id = departArr;
              data.name = departName;
              return data;
            }
            if (
              this.reportingUnitData[i].children &&
              this.reportingUnitData[i].children.length > 0
            ) {
              for (
                let j = 0;
                j < this.reportingUnitData[i].children.length > 0;
                j++
              ) {
                if (this.reportingUnitData[i].children[j].children) {
                  let child = this.reportingUnitData[i].children[j].children;
                  if (
                    child.filter((item) => item.name === departName).length > 0
                  ) {
                    departArr.push(this.reportingUnitData[i].children[j].id); // 第二层
                    departArr.push(
                      child.filter((item) => item.name === departName)[0].id
                    ); // 第三层
                    data.id = departArr;
                    data.name = departName;
                    return data;
                  } else {
                    for (let el of child) {
                      if (
                        el.children &&
                        el.children.filter((item) => item.name === departName)
                          .length > 0
                      ) {
                        departArr.push(
                          this.reportingUnitData[i].children[j].id
                        ); // 第二层
                        departArr.push(el.id); // 第三层
                        departArr.push(
                          el.children.filter(
                            (item) => item.name === departName
                          )[0].id
                        ); // 第四层
                        data.id = departArr;
                        data.name = departName;
                        return data;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    closeMyDialogMultiple() {
      this.hackResetMultiple = false;
      this.$nextTick(() => {
        // this.$nextTick执行一轮循环后刷新dom。
        this.hackResetMultiple = true;
      });
      this.selectData = false;
    },
    //colse关闭窗口
    closeDialog() {
      this.addEventDialog = false;
      if (this.ruleForm.incidenType.length == 0) {
        sessionStorage.setItem("caseID", "0");
      } else {
        sessionStorage.setItem("caseID", this.caseFor[0].id);
      }

      if (this.ruleForm.incidenArea.length == 0) {
        sessionStorage.setItem("areaId", "");
        sessionStorage.setItem("area", "");
      } else {
        sessionStorage.setItem("areaId", this.areaIdArr[0].id);
        sessionStorage.setItem("area", this.areaNameArr[0].name);
      }
      // sessionStorage.setItem('areaId',this.areaIdArr)
      // sessionStorage.setItem('area',this.areaNameArr)
      this.$refs.eventDialog.clearData(); //刷新子组件数据
      if (this.titleType == "新增") {
        sessionStorage.removeItem("caseID");
        sessionStorage.removeItem("areaId");
        sessionStorage.removeItem("area");
      }
      this.$emit("refreshEvent");
    },

    /*
     * @param  {type}    :   param
     * @return {type}    :   return
     * @lastEditors   :   qcx
     * @lastEditTime  :   2020/12/10 17:06:35
     * @descripttion     :   关闭事发地点的弹窗
     */
    //关闭事发地点的弹窗
    closeMultiple() {
      this.hackResetMultiple = false;
      this.$nextTick(() => {
        // this.$nextTick执行一轮循环后刷新dom。
        this.hackResetMultiple = true;
      });
      this.selectData = false;
    },

    /*
     * @param  {type}    :   param
     * @return {type}    :   return
     * @lastEditors   :   qcx
     * @lastEditTime  :   2020/12/10 17:05:25
     * @descripttion  :发送事发地点弹窗确认
     */

    confirmMultiple(checkedCities) {
      console.log(checkedCities);
      if (checkedCities == "" || checkedCities == []) {
        this.$message({
          message: "请先选择联系人",
          type: "warning",
        });
        return;
      }
      this.hackResetMultiple = false;
      this.$nextTick(() => {
        // this.$nextTick执行一轮循环后刷新dom。
        this.hackResetMultiple = true;
      });
      let eventId = sessionStorage.getItem("newID"); // 事件id
      let data = {
        title: this.ruleForm.eventTitle,
        //location: this.ruleForm.incidentSite, //位置
        //latitude: this.latitude, //纬度
        //longitude: this.longitude, //经度
        eventId: eventId,
        contacter: checkedCities,
      };
      this.$api.sendLocation(data).then((res) => {
        if (res.errorcode == 0) {
          this.currentPage = 1;
          this.selectData = false;
          this.$message({
            message: "发送成功！",
            type: "success",
          });
          // this.getStaetData(); 以前旧的获取全部state的函数，现在已经用不上了，调用会报错
        } else {
          //this.$message.error(res.msg)
        }
      });
    },

    /*
     * @param  {type}    :   param
     * @return {type}    :   return
     * @lastEditors   :   qcx
     * @lastEditTime  :   2020/12/10 16:38:51
     * @descripttion     :   发送事发地点
     */
    //发送事发地点
    sendSite() {
      if (
        this.ruleForm.incidentSite == "" ||
        this.latitude == "" ||
        this.longitude == ""
      ) {
        this.$message({
          message: "请先选择事发地点",
          type: "warning",
        });
        return;
      }
      if (this.ruleForm.eventTitle == "" || this.ruleForm.eventTitle == null) {
        this.$message({
          message: "请先填写事件标题",
          type: "warning",
        });
        return;
      }
      this.selectTitle = "选择联系人";
      this.selectData = true;
      this.$refs.selectDialog.getListTree();
      // this.selectHandle()
    },
    /*
     * @param  {type}    :   param
     * @return {type}    :   return
     * @lastEditors   :   qcx
     * @lastEditTime  :   2020/12/10 16:38:28
     * @descripttion     :   地点定位
     */
    location() {
      this.$refs.loction.visible = false;
      this.$refs.loction.rushLocation = false;
      this.$nextTick(() => {
        this.$refs.loction.visible = true;
        this.$refs.loction.rushLocation = true;
      });
    },
    /**
     * @editor qinjiaqi
     * @param {Object} 传回的地点信息
     * @return {type} undefined
     * @description：直接改事发地点文本不能触发组件聚焦，使用focus会因为el-input外面裹了div不起效果，改用ref
     */
    locationCallback(obj) {
      if (obj.data.action && obj.data.action == "retpoint") {
        let latlon = obj.data.object.point.split(",");
        this.longitude = latlon[0];
        // console.log(latlon[0], latlon[1]);
        this.latitude = latlon[1];
        this.ruleForm.incidentSite = obj.data.object.address;
        this.$refs.loction.visible = false;
      }
      this.$nextTick(() => {
        // this.$refs.ruleForm.clearValidate(); // 清空之前的验证
        // this.$refs.getFocus.focus(); // 触发事发地点框聚焦
      });
    },
    sendLocationMsg(obj) {
      if (obj.data.action && obj.data.action == "ready") {
        // console.log(this.longitude);
        // console.log(this.latitude);
        if (this.longitude && this.latitude) {
          //var framew = window.mapFrame.contentWindow;
          var mapFarme = document.getElementById("overId");
          if (mapFarme) {
            var data = {};
            data.action = "getpoint";
            var object = {};
            object.center = this.longitude + "," + this.latitude;
            object.address = this.ruleForm.incidentSite;
            object.area = "";
            data.object = object;
            mapFarme.contentWindow.postMessage(JSON.stringify(data), "*");
          }
        }
      }
    },

    /*
     * @param  {type}    :   param
     * @return {type}    :   return
     * @lastEditors   :   qcx
     * @lastEditTime  :   2020/12/10 14:31:08
     * @descripttion     :   电话,传真,短信详情
     */
    cardDetail(item) {
      this.isDialog = true;
      this.currentItem = item;
      this.getPhoneList();
    },
    faxCard(item) {
      // console.log(item, 5656);
      this.isFaxCard = true;
      this.faxTitle = "传真预览";
      this.currentItem = item;
      this.allFpxPreviewPath = this.ApiUrl + "/fax/" + this.currentItem.file;
      console.log(this.allFpxPreviewPath, 545);
    },
    /**
     * @param {String} eventId 事件ID
     * @param {Number} index 当前选中下标
     * @author hexinting
     * @date 2020年11月26日
     * @lastDate 2020-12-03
     * @description 查询事件首报和事件续报列表
     */
    findEventDealList(eventId, index) {
      let new_event_list = []; // 事件列表
      this.eventList = []; // 清空列表
      let data = {
        eventId: eventId, // 事件ID
      };
      this.$api.findEventDealList(data).then((res) => {
        if (res.errorcode === 0) {
          if (res.data && res.data.length > 0) {
            res.data.forEach((item, index) => {
              new_event_list.push({
                title: item.title,
                eventIndex: index, // 事件索引
                dealOrderName:
                  item.dealOrderName === ""
                    ? "事件续报" + sectionToChinese(index)
                    : item.dealOrderName, // 续报序号， 事件首报，事件续报一
                eventCreateTime:
                  item.reportTime && item.reportTime.length === 19
                    ? item.reportTime.substring(0, 16)
                    : item.reportTime, // 接报时间
                eventData: item, // 事件数据
                eventDealId: item.id, // 续报id
              });
            });
            this.eventList = new_event_list;
            console.log(this.eventList, 4545454);
            this.$nextTick(() => {
              this.initSwiper(); // 初始化swiper插件
            });
            this.clickEvent(this.eventList[0]);
          } else {
            this.eventList = []; // 清空列表
          }
        }
      });
    },

    /**
     * @author hexinting
     * @date 2020-11-23
     * @lastData 2020-11-29
     * @description 激活当前点击事件
     */
    clickEvent(item) {
      this.fileList = [];
      this.ruleForm.eventTitle = item.title; // 0首报 续报点了谁,把它的标题给它就行
      console.log("1-点击事件：", item);
      console.log(item.dealOrderName, item);
      console.log("eventList:", this.eventList);
      this.temporalEvent = item; // 暂存事件
      if (
        this.isUpdateForm &&
        item.eventIndex !== this.currentEventData.eventIndex
      ) {
        // 点击时候判断表单是否有更改
        this.isShowReminderDialog = true;
        return false;
      }
      if (item.eventDealId) {
        // 判断当前事件是否有事件续报id，若无则为新添加的续报还未保存到数据库
        if (item.eventIndex === this.currentEventData.eventIndex) {
          // 防止频繁点击同一个事件
          console.log("同一个事件，不能频繁点击");
        }
        this.currentEventData = item; // 当前激活的事件数据
        this.currentEventDatas = this.currentEventData.eventData;
        let reportDepart = this.getReportingUnit(
          this.currentEventData.eventData.reportDepartId
        ); // 报送单位
        this.currentEventDatas.reportDepart = reportDepart.name; // 报送单位
        console.log(this.currentEventDatas, 99);
        this.currentEventTime = this.currentEventData.eventCreateTime;
        this.currentEventDatas.attachments.forEach((item) => {
          this.judgeFileType(item);
        });
      }
    },

    //下载附件
    downloadFile(item) {
      console.log(item);
      let name = item.fileName;
      let url = `${window.g.ApiUrl}/eos/file/getStream?id=${item.id}`;
      let eleLink = document.createElement("a");
      eleLink.download = name;
      eleLink.href = url;
      eleLink.click();
    },
    judgeFileType(file) {
      this.fileList.push({
        url: window.g.ApiUrl + file.filePath,
        fileName: file.fileName,
        filePath: file.filePath,
        id: file.id,
      });
      console.log(this.fileList);
    },
    /*
     * @lastEditors   :   hexinting
     * @lastEditTime  :   2021-01-14
     * @descripttion     :   初始化swiper 插件
     */
    initSwiper() {
      var swiper = new this.$Swiper(".swiper-container", {
        freeMode: true, // 默认为false，普通模式：slide滑动时只滑动一格，并自动贴合wrapper，设置为true则变为free模式，slide会根据惯性滑动可能不止一格且不会贴合。
        // freeModeMomentumBounce: false, // 动量反弹。false时禁用free模式下的动量反弹，slides通过惯性滑动到边缘时，无法反弹
        freeModeSticky: true, // 使得freeMode也能自动贴合。
        freeModeMinimumVelocity: 1, // 触发FreeMode惯性的最小触摸速度（px/ms），低于这个值不会惯性滑动
        effect: "coverflow", // slide的切换效果，默认为"slide"（位移切换），可设置为'slide'（普通切换、默认）,"fade"（淡入）"cube"（方块）"coverflow"（3d流）"flip"（3d翻转）
        slidesPerView: "3", // 设置slider容器能够同时显示的slides数量(carousel模式)
        centeredSlides: false, // 设定为true时，active slide会居中，而不是默认状态下的居左
        spaceBetween: 20, // 在slide之间设置距离（单位px）。
        coverflowEffect: {
          // 类似于苹果将多首歌曲的封面以3D界面的形式显示出来的方式
          rotate: 0, // slide做3d旋转时Y轴的旋转角度
          stretch: 0, // 每个slide之间的拉伸值，越大slide靠得越紧。5.3.6 后可使用%百分比
          depth: 0, // slide的位置深度。值越大z轴距离越远，看起来越小。
          modifier: 2, // depth和rotate和stretch的倍率，相当于depth*modifier、rotate*modifier、stretch*modifier，值越大这三个参数的效果越明显。
          slideShadows: false, // 是否开启slide阴影
        },
        navigation: {
          nextEl: ".swiper-button-next", // 设置前进按钮的css选择器或HTML元素
          prevEl: ".swiper-button-prev", // 设置后退按钮的css选择器或HTML元素。
          disabledClass: "my-button-disabled", // 前进后退按钮不可用时的类名。
        },
      });
    },

    /**
     * @lastEditor QCX
     * @lastDate 2020-11-11
     * @description :表格数据全选功能
     */
    handleSelectionChange(val) {
      this.selectList = val;
    },
    openMyEvent(row) {
      //打开省厅事件
      console.log(row);
    },
    addMyEvent(row) {
      //省厅事件添加到事件管理
      console.log(row);
    },
    advancedPriveFind() {
      console.log(1);
    },
    priveFind() {
      //省厅事件查询
      let data = {
        orgCode: "gdszyj-7a863389-84a5-4354-a1e1-46f2ce5b47af",
        startTime: this.myEventFormData.valueStr[0]
          ? this.myEventFormData.valueStr[0]
          : null,
        endTime: this.myEventFormData.valueStr[1]
          ? this.myEventFormData.valueStr[1]
          : null,
        limitCnt: this.myEventFormDataNumber,
      };
      let json = {
        paramJson: JSON.stringify(data),
      };
      this.$api.stSelectEvent(json).then((res) => {
        if (res.errorcode == 0) {
          let resData = JSON.parse(res.data);
          this.myEventFormData.shentinTableData = resData.data.disasterList;
          this.myEventFormData.tableLoading = false;
        } else {
          // //this.$message.error(res.msg)
        }
      });
    },
    closeDialogMoldel() {
      this.myEventFormData = {
        shentinTableData: [],
        valueStr: "",
        searchInput: "",
        findTheRangeValue: 0,
        tableLoading: false,
      };
    },
    inputNumber() {
      if (this.myEventFormDataNumber > 100) {
        this.myEventFormDataNumber = "100";
        this.$message({
          message: "一次最多查询100条",
          type: "warning",
        });
      }
      if (this.myEventFormDataNumber < 10) {
        this.myEventFormDataNumber = "10";
        this.$message({
          message: "一次最少查询10条",
          type: "warning",
        });
      }
    },
    openDialog() {
      this.myEventFormData.tableLoading = true;
      let data = {
        orgCode: "gdszyj-7a863389-84a5-4354-a1e1-46f2ce5b47af",
        startTime: this.myEventFormData.valueStr[0]
          ? this.myEventFormData.valueStr[0]
          : null,
        endTime: this.myEventFormData.valueStr[1]
          ? this.myEventFormData.valueStr[1]
          : null,
        limitCnt: this.myEventFormDataNumber,
      };
      let json = {
        paramJson: JSON.stringify(data),
      };
      this.$api.stSelectEvent(json).then((res) => {
        if (res.errorcode == 0) {
          let resData = JSON.parse(res.data);
          console.log(resData.data.disasterList);
          this.myEventFormData.shentinTableData = resData.data.disasterList;
          this.myEventFormData.tableLoading = false;
        } else {
          // //this.$message.error(res.msg)
        }
      });
    },
    openEventFind(key) {
      //显示省厅事件查询
      this.isopenEvent = key == 1 ? true : false;
    },
    getHeight() {
      // let h =
      //   document.documentElement.clientHeight || document.body.clientHeight;
      // this.registerStyle.height = h - (68 + 205) + 58 + "px";
    },
    //事件全景
    eventPanorama() {
      if (!this.eventId) {
        this.$message({
          message: "请先选择事件再进行全景查看!",
          type: "warning",
        });
        return;
      }
      this.panorameTitle = "事件全景";
      console.log(this.RowData);
      this.childTitle = this.RowData.title;
      this.panorameVisible = true;
      this.titleKey = new Date().getTime();
    },
    //事件全景关闭时
    handleClose() {
      this.panorameVisible = false;
    },
    //导出列表
    exportList() {
      if (this.eventId == "" || this.eventId == null) {
        this.$message({
          message: "请先选择事件在进行导出",
          type: "warning",
        });
        return;
      }
      let Url = window.g.ApiUrl;
      let cType;
      switch (this.eventChainValue) {
        case "0":
          cType = 7;
          break;
        case "1":
          cType = 1;
          break;
        case "2":
          cType = 2;
          break;
        case "3":
          cType = 4;
          break;
        default:
          cType = 7;
          break;
      }
      let downloadYearUrl = `${Url}/eos/register/exportEventDetail?eventId=${this.eventId}&cType=${cType}&data=&unit=`;
      window.location.href = downloadYearUrl;
    },
    getfloatingBallData() {
      //获取悬浮球的数量
      let data = {};
      this.$szApi.getUnhandled(data).then((res) => {
        if (res.errorcode == 0) {
          this.phoneValue = res.data.phone; //悬浮球电话数量
          this.smsValue = res.data.sms; //悬浮球短信数量
          this.faxValue = res.data.fax; //悬浮球传真数量
          if (this.phoneValue + this.smsValue + this.faxValue > 99) {
            this.untreated = "99+";
          } else {
            this.untreated = this.phoneValue + this.smsValue + this.faxValue; //悬浮球未处理数量
          }
        } else {
          // //this.$message.error(res.msg)
        }
      });
    },
    getEventLevenData() {
      //获取事件等级
      let pcode = {
        pcode: "emtlevel",
      };
      this.$szApi.getByPcodes(pcode).then((res) => {
        if (res.errorcode == 0) {
          this.eventLevelDate = res.data;
        } else {
          // //this.$message.error(res.msg)
        }
      });
    },
    move(e) {
      let odiv = e.target; // 获取目标元素
      let x = e.clientX - odiv.offsetLeft;
      let y = e.clientY - odiv.offsetTop;
      document.onmousemove = (e) => {
        let left = e.clientX - x;
        let top = e.clientY - y;
        this.positionX = left;
        this.positionY = top;
        if (left <= 0) {
          left = 0;
        } else if (
          left >=
          document.documentElement.clientWidth - odiv.offsetWidth
        ) {
          left = document.documentElement.clientWidth - odiv.offsetWidth - 200;
        }
        if (top <= 0) {
          top = 0;
        } else if (
          top >=
          document.documentElement.clientHeight - odiv.offsetHeight
        ) {
          top = document.documentElement.clientHeight - odiv.offsetHeight - 200;
        }
        odiv.style.left = left + "px";
        odiv.style.top = top + "px";
      };
      // 为了防止 火狐浏览器 拖拽阴影问题
      document.onmouseup = (e) => {
        console.log(e);
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
    getStateData() {
      //获取办理状态
      let pcode = {
        pcode: "event_over_status",
      };
      this.$szApi.getByPcodes(pcode).then((res) => {
        if (res.errorcode == 0) {
          this.handleTheStateData = res.data;
        } else {
          // //this.$message.error(res.msg)
        }
      });
    },
    /**
     * @lastEditor hexinting
     * @lastDate 2020-10-16
     * @description 总结报告
     */
    conclusion() {
      // 禅道：7354 date：2020-10-16 author:hexinting
      if (this.RowData.statusCode === "0") {
        this.$message({
          message: "未完结不能生成报告",
        });
        return;
      }
      if (
        this.RowData.id == "" ||
        this.RowData.id == null ||
        this.eventId == null
      ) {
        this.$message({
          message: "请先选择事件",
          type: "warning",
        });
        return;
      }
      let Url = window.g.serveEBS;
      let downloadYearUrl = `${Url}/emergency/dispatch/event/getEventReportPdf?eventId=${this.eventId}`;
      window.location.href = downloadYearUrl;
    },
    getCaseData() {
      //获取事件类别
      let caseData = {};
      this.$szApi.getTopCase(caseData).then((res) => {
        if (res.errorcode == 0) {
          this.eventCategoryData = res.data;
        } else {
          // //this.$message.error(res.msg)
        }
      });
    },
    getTableListData() {
      //获取事件列表
      let dateTimeStr, dateTimeEnd;
      if (this.valueStr == [] || this.valueStr == null || this.valueStr == "") {
        dateTimeStr = "";
        dateTimeEnd = "";
      } else {
        dateTimeStr = this.valueStr[0] + " 00:00:00";
        dateTimeEnd = this.valueStr[1] + " 23:59:59";
      }
      let ipData = {
        size: this.pageSize,
        page: this.currentPage,
        name: this.searchInput,
        beginTime: dateTimeStr,
        endTime: dateTimeEnd,
        levelId: this.eventLevelValue,
        topCaseClassId: this.eventCategoryValue,
        status: this.handleTheStateValue,
        reportType: this.linkageValue == "关" ? 0 : 5,
      };
      this.$szApi.listBy(ipData).then((res) => {
        if (res.errorcode == 0) {
          this.tableData = res.data.data;
          if (this.tableData.lenght != 0) {
            this.findEventDealList(this.tableData[0].id); //默认加载表格数据时,将id传给轮播图
            this.tableRowClick(this.tableData[0]);
          }
          this.total = res.data.totalElements;
          let data = {
            name: this.searchInput,
            beginTime: dateTimeStr,
            endTime: dateTimeEnd,
            levelId: this.eventLevelValue,
            topCaseClassId: this.eventCategoryValue,
            status: this.handleTheStateValue,
            reportType: this.linkageValue == "关" ? 0 : 5,
          };
          this.$szApi.getEventStatistics(data).then((res) => {
            if (res.errorcode == 0) {
              console.log(res.data);
              this.eventNumber = this.total; //事件总数
              this.eventWas = res.data.injured; //受伤人数
              this.eventMissing = res.data.missing; //失踪人数
              this.eventDie = res.data.death; //死亡人数
              // this.eventAffect=res.data.
            } else {
              // //this.$message.error(res.msg)
            }
          });
          console.log(res.data);
        } else {
          // //this.$message.error(res.msg)
        }
      });
    },
    eventChain(val) {
      this.itemBox = [];
      console.log(this.eventChainValue, val);
      //事件链检测选择的是哪一个
      if (this.eventId == null || this.eventId == "") {
        this.$message({
          message: "请先选择事件",
          type: "warning",
        });
        return;
      }
      switch (this.eventChainValue) {
        case "0":
          this.getselectAllList();
          break;
        case "1":
          this.getFaxList();
          break;
        case "2":
          this.getPhoneList();
          break;
        case "3":
          this.getSmsList();
          break;
        default:
          break;
      }
    },

    tableRowClick(row) {
      this.eventChainValue = "0";
      //表格行点击事件
      this.RowData = row;
      this.eventId = row.id;
      this.findEventDealList(row.id);
      this.fileList = [];
      //,当点击表格时,触发轮播图
      let type = this.eventChainValue;
      console.log(this.eventId, this.eventChainValue, type);
      this.eventChain("0"); //这是默认加载第一个啊
    },
    getselectAllList() {
      //根据事件获取所有历史
      let data = {
        eventId: this.eventId,
      };
      this.itemBox = [];
      let audioArray;
      const _that = this;
      this.$szApi
        .selectAll(data)
        .then((res) => {
          console.log(res, 669696);
          if (res.errorcode == 0) {
            res.data.forEach((item) => {
              if (item.type !== "phone" && item.nameList) {
                for (var item of res.data) {
                  var arr = [];
                  let nameList = item.nameList || [];
                  for (let i = 0; i < nameList.length; i++) {
                    if (nameList[i]) {
                      arr.push(nameList[i]);
                    }
                    if (arr.length >= 4) {
                      break;
                    }
                  }
                  item.nameListFour = arr;
                  console.log("11111", item.nameListFour);
                }
              }
            });

            new Promise((resolve, reject) => {
              this.itemBox = res.data;
              resolve();
            }).then(() => {
              let getAllAudio = document.querySelectorAll("#content_del audio");

              audioArray = Array.from(getAllAudio);
              res.data.forEach((item) => {
                if (!!item.url) {
                  let recordFile = item.url; // 录音文件地址
                  this.audioSrc = this.ApiUrl + "/rec/" + recordFile;
                  console.log(this.audioSrc); // http://192.168.3.27:8089/rec/20200511134140_13427521779_6001_CALLIN.wav
                  audioArray.forEach((ele, index) => {
                    ele.setAttribute("src", this.audioSrc);
                    // console.log(ele.src)
                  });
                }
              });
            });
          } else {
            // //this.$message.error(res.msg)
          }
        })
        .then(() => {
          setTimeout(() => {
            // 设置图片路径 用require()转换成base64
            let play = require("../../../../static/audioControls/play.png"),
              stop = require("../../../../static/audioControls/stop.png"),
              TurnTheText = require("../../../../static/audioControls/TurnTheText.png"),
              tailor = require("../../../../static/audioControls/tailor.png"),
              dow = require("../../../../static/audioControls/dow.png");

            let obj = {
              play,
              stop,
              TurnTheText,
              tailor,
              dow,
            };
            let type = "yangZhouEventRegistration";
            console.log("Array.from(audioArray)", audioArray);
            Array.from(audioArray).forEach((ele, index) => {
              console.log("插入audioControls插入audioControls", ele);
              let audio = new audioControls(
                ele.parentNode,
                ele.src,
                obj,
                false,
                _that.TurnTheText,
                _that.tailor,
                this.RowData,
                // _that,
                type
              );
              //   _that.audioEventList[index] = audio;
              audio.addIncident("这个用来判断是否显示下载控件");
            });
          });
        }, 10);
    },

    getPhoneList() {
      //获取电话历史
      let data = {
        eventId: this.eventId,
        type: "phone",
      };
      let audioArray;
      const _that = this;
      this.$szApi
        .selectHistory(data)
        .then((res) => {
          if (res.errorcode == 0) {
            console.log(res.data);

            this.itemBox = [];
            this.itemBox = res.data;
            new Promise((resolve, reject) => {
              this.itemBox = res.data;
              resolve();
            }).then(() => {
              let getAllAudio = document.querySelectorAll("#content_del audio");
              audioArray = Array.from(getAllAudio);
              res.data.forEach((item) => {
                if (!!item.url) {
                  let recordFile = item.url; // 录音文件地址
                  this.audioSrc = this.ApiUrl + "/rec/" + recordFile;
                  console.log(this.audioSrc); // http://192.168.3.27:8089/rec/20200511134140_13427521779_6001_CALLIN.wav
                  audioArray.forEach((ele, index) => {
                    ele.setAttribute("src", this.audioSrc);
                    // console.log(ele.src)
                  });
                }
              });
            });
          } else {
            // //this.$message.error(res.msg)
          }
        })
        .then(() => {
          setTimeout(() => {
            // 设置图片路径 用require()转换成base64
            let play = require("../../../../static/audioControls/play.png"),
              stop = require("../../../../static/audioControls/stop.png"),
              TurnTheText = require("../../../../static/audioControls/TurnTheText.png"),
              tailor = require("../../../../static/audioControls/tailor.png"),
              dow = require("../../../../static/audioControls/dow.png");

            let obj = {
              play,
              stop,
              TurnTheText,
              tailor,
              dow,
            };
            let type = "yangZhouEventRegistration";
            console.log("Array.from(audioArray)", audioArray);
            Array.from(audioArray).forEach((ele, index) => {
              console.log("插入audioControls插入audioControls", ele);
              let audio = new audioControls(
                ele.parentNode,
                ele.src,
                obj,
                false,
                _that.TurnTheText,
                _that.tailor,
                this.RowData,
                // _that,
                type
              );
              //   _that.audioEventList[index] = audio;
              audio.addIncident("这个用来判断是否显示下载控件");
            });
          });
        }, 10);
    },
    getSmsList() {
      //获取短信历史
      let data = {
        eventId: this.eventId,
        type: "sms",
      };
      this.$szApi.selectHistory(data).then((res) => {
        if (res.errorcode == 0) {
          console.log(res.data);
          for (var item of res.data) {
            var arr = [];
            let nameList = item.nameList;
            // for (var p of item.nameList) {
            for (var p of nameList) {
              if (p) {
                arr.push(p);
              }
              if (+arr.length >= 4) {
                break;
              }
            }
            item.nameListFour = arr;
            // console.log('11111', item.nameListFour)
          }
          this.itemBox = [];
          this.itemBox = res.data;
        } else {
          // //this.$message.error(res.msg)
        }
      });
    },
    getFaxList() {
      //获取传真历史
      let data = {
        eventId: this.eventId,
        type: "fax",
      };
      this.$szApi.selectHistory(data).then((res) => {
        if (res.errorcode == 0) {
          console.log(res.data);
          for (var item of res.data) {
            var arr = [];
            let nameList = item.nameList;
            // for (var p of item.nameList) {
            for (var p of nameList) {
              if (p) {
                arr.push(p);
              }
              if (+arr.length >= 4) {
                break;
              }
            }
            item.nameListFour = arr;
            // console.log('11111', item.nameListFour)
          }
          this.itemBox = [];
          this.itemBox = res.data;
        } else {
          // //this.$message.error(res.msg)
        }
      });
    },
    eventFind() {
      //查找
      this.listStaet = "查找";
      this.currentPage = 1;
      this.getTableListData();
    },
    advancedEventFind() {
      //高级查找
      this.listStaet = "高级查找";
      this.outerVisible = true;
      this.title = "高级查找";
      let pcode = {
        pcode: "emtlevel",
      };
      this.$szApi.getByPcodes(pcode).then((res) => {
        if (res.errorcode == 0) {
          this.rankSelect = res.data;
        } else {
          // //this.$message.error(res.msg)
        }
      });
    },
    //关闭前的回调
    beforeClose() {
      // this.UnitId = [];
      // this.eventTypeId = [];
      // this.ruleForm.eventTitle='';
      // this.ruleForm.submittedUnit='';
      // this.ruleForm. submittedType='';
      // this.ruleForm. beginTime='';
      // this.ruleForm. endTime='';
      // this.ruleForm.rankEvent='';
      if (
        this.ruleForm.submittedUnit == "" ||
        this.ruleForm.submittedUnit == null
      ) {
        this.UnitId = [];
      }
      if (
        this.ruleForm.submittedType == "" ||
        this.ruleForm.submittedType == null
      ) {
        this.eventTypeId = [];
      }
    },
    submittedSelect() {
      //高级查找选择报送单位
      this.coreTitle = "选择单位";
      this.typeData = "报送单位";
      this.innerVisible = true;
      let data = {
        displayDefault: "false",
      };
      this.$szApi.phoneGroupList(data).then((res) => {
        if (res.errorcode == 0) {
          this.$refs.treeSearch.dataUpdating(res.data, this.typeData);
        } else {
          // //this.$message.error(res.msg)
        }
      });
    },
    eventSelect() {
      //高级查找选择事件类型
      this.coreTitle = "选择类型";
      this.typeData = "选择类型";
      this.innerVisible = true;
      let data = {};
      this.$szApi.getTree(data).then((res) => {
        if (res.errorcode == 0) {
          this.$refs.treeSearch.dataUpdating(res.data, this.typeData);
        } else {
          // //this.$message.error(res.msg)
        }
      });
    },
    lookForConfirmation() {
      //高级查找确认查找
      if (this.outerVisible === true) {
        this.currentPage = 1;
      }
      let deptArr = [];
      deptArr.push(this.ruleForm.submittedUnit);
      let data = {
        size: this.pageSize,
        page: this.currentPage,
        name: this.ruleForm.eventTitle,
        beginTime: this.ruleForm.beginTime + " 00:00:00",
        endTime: this.ruleForm.endTime + " 23:59:59",
        depts: deptArr,
        topCaseClassId: this.eventTypeId[0],
        levelId: this.ruleForm.rankEvent,
      };
      this.$szApi.listBy(data).then((res) => {
        if (res.errorcode == "0") {
          this.outerVisible = false;
          this.tableData = res.data.data;
          this.total = res.data.totalElements;

          let data = {
            name: this.ruleForm.eventTitle,
            beginTime: this.ruleForm.beginTime + " 00:00:00",
            endTime: this.ruleForm.endTime + " 23:59:59",
            levelId: this.ruleForm.rankEvent,
            topCaseClassId: this.eventTypeId[0],
            status: "",
          };
          this.$szApi.getEventStatistics(data).then((res) => {
            if (res.errorcode == 0) {
              console.log(res.data);
              this.eventNumber = this.total; //事件总数
              this.eventWas = res.data.injured; //受伤人数
              this.eventMissing = res.data.missing; //失踪人数
              this.eventDie = res.data.death; //死亡人数
              // this.eventAffect=res.data.
            } else {
              // //this.$message.error(res.msg)
            }
          });
        }
      });
    },
    affirmDialog(filterText, filterId, typeData) {
      //高级内层查找确认
      switch (typeData) {
        case "报送单位":
          if (
            filterText == "" ||
            filterText == null ||
            filterId == "" ||
            filterId == null
          ) {
            this.$message({
              message: "请选择报送单位",
              type: "warning",
            });
          } else {
            this.UnitId = [];
            this.UnitId.push(filterId);
            this.ruleForm.submittedUnit = filterText;
            this.innerVisible = false;
          }
          break;
        case "选择类型":
          if (
            filterText == "" ||
            filterText == null ||
            filterId == "" ||
            filterId == null
          ) {
            this.$message({
              message: "请选择事件类型",
              type: "warning",
            });
          } else {
            this.eventTypeId = [];
            this.eventTypeId.push(filterId);
            this.ruleForm.submittedType = filterText;
            this.innerVisible = false;
          }
          break;
        default:
          break;
      }
    },
    cancelDialog() {
      //高级内层查找取消
      this.innerVisible = false;
    },
    changeVal() {
      //高级查找事件标题
    },
    /**
     * @lastEditor QCX
     * @lastDate 2020-11-11
     * @description 删除事件
     */
    rowDelect() {
      if (this.selectList.length == 0) {
        this.$message({
          message: "请先选中事件再进行删除!",
          type: "warning",
        });
        return;
      } else {
        this.isDeleteShow = true;
        this.reportTitle = "删除事件";
        this.SubTitles = "此操作将删除所选事件,是否继续?";
      }
    },
    // this.$confirm("此操作将删除所选事件, 是否继续?", "删除事件", {
    //   confirmButtonText: "确定",
    //   cancelButtonText: "取消",
    //   // type: "warning",
    //   center: true
    // })
    // .then(() => {
    // let data = {
    //   id: this.RowData.id,
    // };
    //  // this.$szApi.eventDelete(data).then((res) => {
    //   if (res.errorcode == "0") {
    //     this.$message({
    //       message: "删除成功!",
    //       type: "danger",
    //     });
    //     if (this.listStaet === "查找") {
    //       this.getTableListData();
    //     } else if (this.listStaet === "高级查找") {
    //       this.lookForConfirmation();
    //     }
    //   }
    // });
    // })
    // .catch(() => {
    //   this.$message({
    //     type: "info",
    //     message: "已取消删除",
    //   });
    // });

    /**
     * @lastEditor QCX
     * @lastDate 2020-11-11
     * @description 确定删除事件
     */
    sureBtn() {
      let ids = [];
      for (let i = 0; i < this.selectList.length; i++) {
        ids.push(this.selectList[i].id);
      }
      let data = {
        id: ids,
      };
      console.log(ids);
      if (ids.length == 0) {
        this.$message({
          message: "未选择事件",
          type: "danger",
        });
        this.isDeleteShow = false;
        this.getTableListData();
        return;
      } else {
        this.$szApi.eventDelete(data).then((res) => {
          if (res.errorcode == "0") {
            this.$message({
              message: "删除成功!",
              type: "danger",
            });
            this.getTableListData();
            this.isDeleteShow = false;
            if (this.listStaet === "查找") {
              this.getTableListData();
            } else if (this.listStaet === "高级查找") {
              this.lookForConfirmation();
            }
          }
        });
      }
      this.getTableListData();
    },
    /**
     * @lastEditor QCX
     * @lastDate 2020-11-11
     * @description :关闭删除弹框
     */
    handleDelClose() {
      this.isShow = false;
    },

    /**
     * @lastEditor QCX
     * @lastDate 2020-11-11
     * @description :关闭上报省厅弹窗
     */
    handleDelReportClose() {
      this.isDeleteShow = false;
      this.getTableListData();
    },
    /**
     * @lastEditor QCX
     * @lastDate 2020-11-11
     * @description :删减删除,上报省厅弹窗中所选件数
     */
    delItem(i) {
      console.log(this.selectList);
      this.selectList.splice(i, 1);
    },

    //计算时间的方法
    GetDateStr(AddDayCount) {
      let dd = new Date();
      dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
      let y = dd.getFullYear();
      let m =
        dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1; //获取当前月份的日期，不足10补0
      let d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); //获取当前几号，不足10补0
      return y + "-" + m + "-" + d;
    },
    intervalDetection1(val) {
      //检测查找区间
      let date = new Date(); // 获取当前日期
      let nowMonth = date.getMonth() + 1;
      let strDate = date.getDate();
      let seperator = "-"; // 添加分隔符“-”
      if (nowMonth >= 1 && nowMonth <= 9) {
        // 对月份进行处理，1-9月在前面添加一个“0”
        nowMonth = "0" + nowMonth;
      }
      if (strDate >= 0 && strDate <= 9) {
        // 对月份进行处理，1-9号在前面添加一个“0”
        strDate = "0" + strDate;
      }
      //拼接字符串，得到一个格式为(yyyy-MM-dd)的日期
      let curTime =
        date.getFullYear() + seperator + nowMonth + seperator + strDate;
      let startDate, seventDate, fourteenDate, thirtyDate;
      switch (val) {
        case 0:
          this.myEventFormData.timeDateVal = false;
          this.myEventFormData.valueStr = [];
          break;
        case 1:
          this.myEventFormData.timeDateVal = true;
          this.myEventFormData.valueStr = [];
          this.myEventFormData.valueStr.push(curTime);
          this.myEventFormData.valueStr.push(curTime);
          break;
        case 2:
          this.myEventFormData.timeDateVal = true;
          startDate = this.GetDateStr(-2); //获取到的三天前的日期
          this.myEventFormData.valueStr = [];
          this.myEventFormData.valueStr.push(startDate);
          this.myEventFormData.valueStr.push(curTime);
          break;
        case 3:
          this.timeDateVal = true;
          seventDate = this.GetDateStr(-6); //获取到的七天前的日期
          this.myEventFormData.valueStr = [];
          this.myEventFormData.valueStr.push(seventDate);
          this.myEventFormData.valueStr.push(curTime);
          break;
        case 4:
          this.myEventFormData.timeDateVal = true;
          fourteenDate = this.GetDateStr(-14); //获取到的十五天前的日期
          this.myEventFormData.valueStr = [];
          this.myEventFormData.valueStr.push(fourteenDate);
          this.myEventFormData.valueStr.push(curTime);
          break;
        case 5:
          this.myEventFormData.timeDateVal = true;
          thirtyDate = this.GetDateStr(-29); //获取到的三十天前的日期
          this.myEventFormData.valueStr = [];
          this.myEventFormData.valueStr.push(thirtyDate);
          this.myEventFormData.valueStr.push(curTime);
          break;
        default:
          break;
      }
    },
    intervalDetection(val) {
      //检测查找区间
      let date = new Date(); // 获取当前日期
      let nowMonth = date.getMonth() + 1;
      let strDate = date.getDate();
      let seperator = "-"; // 添加分隔符“-”
      if (nowMonth >= 1 && nowMonth <= 9) {
        // 对月份进行处理，1-9月在前面添加一个“0”
        nowMonth = "0" + nowMonth;
      }
      if (strDate >= 0 && strDate <= 9) {
        // 对月份进行处理，1-9号在前面添加一个“0”
        strDate = "0" + strDate;
      }
      //拼接字符串，得到一个格式为(yyyy-MM-dd)的日期
      let curTime =
        date.getFullYear() + seperator + nowMonth + seperator + strDate;
      let startDate, seventDate, fourteenDate, thirtyDate;
      switch (val) {
        case 0:
          this.timeDateVal = false;
          this.valueStr = [];
          break;
        case 1:
          this.timeDateVal = true;
          this.valueStr = [];
          this.valueStr.push(curTime);
          this.valueStr.push(curTime);
          break;
        case 2:
          this.timeDateVal = true;
          startDate = this.GetDateStr(-2); //获取到的三天前的日期
          this.valueStr = [];
          this.valueStr.push(startDate);
          this.valueStr.push(curTime);
          break;
        case 3:
          this.timeDateVal = true;
          seventDate = this.GetDateStr(-6); //获取到的七天前的日期
          this.valueStr = [];
          this.valueStr.push(seventDate);
          this.valueStr.push(curTime);
          break;
        case 4:
          this.timeDateVal = true;
          fourteenDate = this.GetDateStr(-14); //获取到的十五天前的日期
          this.valueStr = [];
          this.valueStr.push(fourteenDate);
          this.valueStr.push(curTime);
          break;
        case 5:
          this.timeDateVal = true;
          thirtyDate = this.GetDateStr(-29); //获取到的三十天前的日期
          this.valueStr = [];
          this.valueStr.push(thirtyDate);
          this.valueStr.push(curTime);
          break;
        default:
          break;
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      if (this.listStaet == "高级查找") {
        this.lookForConfirmation();
      } else {
        this.getTableListData();
      }
    },
    rowOpenEvent() {
      //打开事件
      // let eventID=sessionStorage.getItem('newID');
      console.log(this.RowData);
      if (
        this.RowData.levelId !== 0 &&
        this.RowData.levelId !== "" &&
        this.RowData.levelId !== "" &&
        this.RowData.levelId !== 0
      ) {
        //已经启动过预案
        this.$store.commit("setTurnOnEmergencyResponse", true);
      } else {
        this.$store.commit("setTurnOnEmergencyResponse", false);
      }
      if (this.RowData.id == "" || this.RowData.id == null) {
        this.$message({
          message: "请先选择事件",
          type: "warning",
        });
      } else {
        sessionStorage.setItem("eventTitle", this.RowData.title); // 切换事件后缓存的展示标题也要改
        sessionStorage.setItem("newID", this.RowData.id);
        console.log(this.RowData.id);
        let eventIdTest = sessionStorage.getItem("newID");
        console.log(eventIdTest);
        this.$router.push({
          path: this.pathname,
          query: { linkageValue: this.linkageValue },
        });
      }
    },
    /**
     * @lastEditor qinjiaqi
     * @param {type} 没有
     * @return {type} undefined
     * @description：在跳转到事件接报之前进行办结事件的激活，使其可以使用续报功能
     */
    rowDealEvent() {
      //处置事件
      // let eventID=sessionStorage.getItem('newID');
      console.log(this.RowData);
      if (
        this.RowData.levelId !== 0 &&
        this.RowData.levelId !== "" &&
        this.RowData.levelId !== "" &&
        this.RowData.levelId !== 0
      ) {
        //已经启动过预案
        this.$store.commit("setTurnOnEmergencyResponse", true);
      } else {
        this.$store.commit("setTurnOnEmergencyResponse", false);
      }
      if (this.RowData.id == "" || this.RowData.id == null) {
        this.$message({
          message: "请先选择事件",
          type: "warning",
        });
      } else {
        if (this.RowData.statusCode === "1") {
          let eventID = this.RowData.id;
          this.$confirm("您即将激活该事件，是否确认激活？", "提示", {
            customClass: "message-logout",
            confirmButtonClass: "confirm-button-style",
            cancelButtonClass: "cancel-button-style",
            confirmButtonText: "确认激活",
            cancelButtonText: "取消",
            type: "warning",
            closeOnClickModal: false,
          }).then(() => {
            let data = {
              eventId: eventID,
            };
            this.$api.eventActive(data).then((res) => {
              if (res.errorcode == "0") {
                this.$message({
                  message: "事件激活成功!",
                  type: "success",
                });
                this.RowData.status = "待确认";
                this.RowData.statusCode = "0";
                sessionStorage.setItem("eventTitle", this.RowData.title); // 切换事件后缓存的展示标题也要改
                sessionStorage.setItem("newID", this.RowData.id);
                console.log(this.RowData.id);
                let eventIdTest = sessionStorage.getItem("newID");
                console.log(eventIdTest);
                this.$router.push({
                  path: this.pathname,
                  query: { linkageValue: this.linkageValue },
                });
              } else {
                this.$message.error(res.msg);
              }
            });
          });
        } else {
          this.$message({
            message: "事件未完结，不能激活",
            type: "warning",
          });
        }
      }
    },
    /**
     * @author qinjiaqi
     * @param {type} 没有
     * @return {type} undefined
     * @lastDate 2020-12-9
     * @description：扬州事件完结
     */
    endEvent() {
      if (this.RowData.id == "" || this.RowData.id == null) {
        this.$message({
          message: "请先选择事件",
          type: "warning",
        });
        return;
      }
      console.log("点击了事件完结按钮", this.RowData);
      let eventID = this.RowData.id;
      this.$confirm("您即将完结该事件，是否确认完结？", "提示", {
        customClass: "message-logout",
        confirmButtonClass: "confirm-button-style",
        cancelButtonClass: "cancel-button-style",
        confirmButtonText: "确认完结",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false,
      })
        .then(() => {
          let data = {
            eventId: eventID,
          };
          // 注释原因：“eventEnd”接口完结事件会新增一条空的续报.导致查询出现空续报数据，改为“yzEnd”。author：hexinting date:20210113
          this.$api.yzEnd(data).then((res) => {
            if (res.errorcode == "0") {
              this.$message({
                message: "事件完结成功!",
                type: "success",
              });
              this.RowData.status = "已确认";
              this.RowData.statusCode = "1";
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消完结",
          });
        });
    },

    itemClick(item, index) {
      //事件链循环每一个的点击
      this.changeRed = index;
      this.itemClickData = item;
      this.itemClickDataRemark = "";
      this.itemClickDataRemark = item.remark;
      let faxData;
      switch (item.type) {
        case "fax":
          faxData = {
            faxId: item.id,
          };
          this.$szApi.previewFax(faxData).then((res) => {
            if (res.errorcode == 0) {
              this.previewUrl = window.g.ApiUrl + "/fax/" + res.data;
              this.faxCard(item);
            } else if (res.errorcode == 500) {
              //传真文件不存在
              this.$message.error(res.msg);
              this.previewUrl = "";
            }
          });
          break;
        case "phone":
          break;
        case "sms":
          break;
        default:
          break;
      }
    },
    phoneClickDispose(item, index) {
      //事件链循环每一个处置的点击,电话处置按钮
      console.log(index);
      this.dealTitle = this.RowData.title;
      this.reportDescription = this.RowData.reportDescription;
      this.disposalType = "电话";
      this.continueItem = item;
      this.itemData = item;
      this.manageTitle = "信息处置"; //处置弹窗标题
      this.manageDialog = true; //是否弹出
      this.manageDialogRefresh = false;
      this.$nextTick(() => {
        this.manageDialogRefresh = true;
      });
    },
    faxClickDispose(item, index) {
      //事件链循环每一个处置的点击,传真处置按钮
      console.log(index);
      this.dealTitle = this.RowData.title;
      this.reportDescription = this.RowData.reportDescription;
      this.disposalType = "传真";
      this.continueItem = item;
      this.itemData = item;
      this.manageTitle = "信息处置"; //处置弹窗标题
      this.manageDialog = true; //是否弹出
      this.manageDialogRefresh = false;
      this.$nextTick(() => {
        this.manageDialogRefresh = true;
      });
    },
    smsClickDispose(item, index) {
      //事件链循环每一个处置的点击,短信处置按钮
      // this.dealDialog=true
      console.log(index);
      this.dealTitle = this.RowData.title;
      this.reportDescription = this.RowData.reportDescription;
      this.disposalType = "短信";
      this.continueItem = item;
      this.itemData = item;
      this.manageTitle = "信息处置"; //处置弹窗标题
      this.manageDialog = true; //是否弹出
      this.manageDialogRefresh = false;
      this.$nextTick(() => {
        this.manageDialogRefresh = true;
      });
      // this.dealRefresh=false;
      // this.$nextTick(()=>{
      //   this.dealRefresh=true;
      // })
    },
    dispositionClose() {
      //处置弹窗取消关闭
      this.dealDialog = false;
    },
    dispositionConfirm() {
      //处置弹窗确认关闭
      this.dealDialog = false;
    },
    dispositionCloseDialog() {
      //处置弹窗叉叉关闭
      this.dealDialog = false;
    },
    /***
     * 下面是新的处置模块的操作
     * */
    manageCloseDialog() {
      //处置弹窗叉叉关闭
      this.manageDialog = false;
    },
    /**事件链关联变更
     * **/
    associatedChanges(item, index) {
      // console.log(item, index);
      // this.associatedRefresh=false;
      // this.$nextTick(()=>{
      //   this.associatedRefresh=true
      // })
      // this.associatedChangesModelDialog=true
    },
    associatedManageCloseDialog() {
      //关联变更叉叉取消
      this.associatedChangesModelDialog = false;
    },
    associatedClose() {
      //关联变更取消
      this.associatedChangesModelDialog = false;
    },
    associatedAffirm(eventId) {
      //关联变更确认
      if (eventId == null || eventId == "") {
        this.$message({
          message: "请选择需要更改关联的事件",
          type: "warning",
        });
        return;
      }
      this.associatedChangesModelDialog = false;
    },
    /**悬浮球点击操作
     * */
    dblclickDialog() {
      //悬浮球点击未处理 默认打开传真模块
      this.allModelTitle = "信息处置";
      this.suspendModelDialog = true;
      this.$refs.allModelDialog.activeAllModel = "传真";
      this.$refs.allModelDialog.leftTabsType = "传真";
    },
    allClickPhoneDialog() {
      //悬浮球点击未处理 电话模块
      this.allModelTitle = "信息处置";
      this.suspendModelDialog = true;
      this.$refs.allModelDialog.activeAllModel = "电话";
      this.$refs.allModelDialog.leftTabsType = "电话";
    },
    allClickSmsDialog() {
      //悬浮球点击未处理 短信模块
      this.allModelTitle = "信息处置";
      this.suspendModelDialog = true;
      this.$refs.allModelDialog.activeAllModel = "短信";
      this.$refs.allModelDialog.leftTabsType = "短信";
    },
    allModelCloseDialog() {
      //allModel叉叉关闭
      this.suspendModelDialog = false;
    },

    //删除事件关联
    deleteEvents(item, index) {
      console.log(this.itemClickData, 5656);
      console.log(item, index);
      this.$confirm("删除与该事件的关联?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let data = {
            id: item.id,
            eventId: 0,
            type: item.type,
          };
          this.$api.relateEvent(data).then((res) => {
            if (res.errorcode == 0) {
              this.$message({
                message: "操作成功",
                type: "success",
              });
              let type = this.eventChainValue;
              switch (type) {
                case "0":
                  this.getselectAllList();
                  break;
                case "1":
                  this.getFaxList();
                  break;
                case "2":
                  this.getPhoneList();
                  break;
                case "3":
                  this.getSmsList();
                  break;
                default:
                  break;
              }
              this.itemClickData = "";
              this.itemClickDataRemark = "";
              this.changeRed = -1;
            } else {
              //this.$message.error(res.msg)
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    /**
     * @lastEditor QCX
     * @lastDate 2020-11-11
     * @description 将表格中选的事件对象放入新数组
     */
    show(obj) {
      this.selectList.push(obj);
    },
    /**
     * @lastEditor QCX
     * @lastDate 2020-11-11
     * @description 扬州->上报事件
     */
    rowReportProvincia() {
      if (this.selectList.length == 0) {
        this.$message({
          message: "请先选中事件再进行上报!",
          type: "warning",
        });
        return;
      } else {
        this.isShow = true;
        (this.reportTitle = "上报事件"),
          (this.SubTitles = "是否将所选事件上报省厅?");
      }
    },
    /**
     * @lastEditor QCX
     * @lastDate 2020-11-11
     * @description 扬州->确定上报事件
     */
    reportBtn() {
      let ids = [];
      for (let i = 0; i < this.selectList.length; i++) {
        ids.push(this.selectList[i].id);
      }
      let data = {
        eventIdList: ids,
      };
      if (ids.length == 0) {
        this.$message({
          message: "未选择事件",
          type: "danger",
        });
        this.isShow = false;
        this.getTableListData();
        return;
      } else {
        this.$szApi.reportEmergency(data).then((res) => {
          if (res.errorcode == "0") {
            this.$message({
              message: "上报成功!",
              type: "danger",
            });
            this.isShow = false;
          }
          this.getTableListData();
        });
      }
      this.getTableListData();
    },
  },
};
</script>

<style scoped>
.navsBar {
  margin: 0 30px;
  background-color: white;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  border: 1px solid rgba(219, 219, 219, 1);
  border-radius: 3px;
}
.contentStyle {
  margin: 0 10px 0 10px;
  background-color: white;
  box-sizing: border-box;
  /* border: 1px solid rgba(219, 219, 219, 1); */
  border-radius: 3px;
}
.eventList {
  width: 100%;
  height: 30px;
  margin-bottom: 10px;
  line-height: 30px;
  background-color: cornflowerblue;
  color: white;
  font-size: 12px;
  text-align: center;
}
.colCalss {
  padding: 0 0 0 10px;
}
.colCalss:first-child {
  padding: 0 !important;
}
>>> .el-card__body {
  padding: 10px;
}
.cardCalss {
  min-height: 700px;
  height: 738px;
}
.cardHeader {
  display: flex;
  justify-content: space-around;
}
.cardTime {
  width: 68%;
  height: 40px;
  line-height: 40px;
  text-align: left;
}
.cardTimes {
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: left;
}
.cardDetail {
  height: 40px;
  line-height: 40px;
  color: #40bcf4;
}
.cardRemark {
  max-width: 359px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
}
.cardRemarks {
  display: flex;
}
.cardIphone {
  width: 100%;
  word-wrap: break-word;
  text-align: left;
  text-indent: 5px;
  padding: 0 10px;
}
.cardIphones {
  width: 100%;
  word-wrap: break-word;
  text-align: left;
  text-indent: -10px;
  padding: 0 10px;
}
.cardIphones1 {
  width: 100%;
  word-wrap: break-word;
  text-align: left;
  padding: 0 10px;
}

.cardIphones > .card {
  margin-left: 10px;
  margin-bottom: 10px;
}
.cardIphone > .card {
  margin-left: 10px;
  margin-bottom: 10px;
}

.iconCalssCard {
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: right;
}
.informations {
  display: flex;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  flex-wrap: wrap;
}
.death {
  margin-right: 30px;
}
.reportDescription {
  width: 500px;
  max-height: 87px;
  overflow-y: auto;
  text-align: left;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
}
.disposalSituation {
  width: 500px;
  max-height: 87px;
  overflow-y: auto;
  text-align: left;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
}

/* 电话,传真,短信详情弹窗框 */

.selectHistory >>> .el-dialog__title {
  font-size: 13px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 18px;
  padding: 11px 0 11px 20px;
  display: flex;
  justify-content: flex-start;
}
.selectHistory>>..el-dialog__headerbtn {
  top: 11px;
}
.selectHistory >>> .el-dialog__body {
  padding: 3px 20px;
}
.selectHistory >>> .el-dialog__header {
  /* padding: 0px;
  width: 100%;
  height: 40px;
  background: #F1F4F6;
  border-radius: 5px 5px 0px 0px;
  line-height: 40px; */
  padding: 0px;
}
.iconCalssCard i {
  font-size: 20px;
}
.floatingBall {
  position: absolute;
  width: 120px;
  height: 120px;
  background-image: url("../../../../static/img/big.png");
  background-size: 100%;
  right: 100px;
  bottom: 80px;
  cursor: move;
}
.transition-box >>> .el-button--small,
.el-button--small.is-round {
  padding: 15px;
}
.buttonBadge {
  border-radius: 50%;
  background-color: cornflowerblue;
  color: white;
}
.reamkCalss {
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: left;
  text-indent: 20px;
}
/* .red {
  border-bottom: 5px solid cornflowerblue;
} */
#panoramaId >>> .el-dialog {
  border-radius: 5px;
  box-shadow: 0px 0px 15px 2px rgba(0, 0, 0, 0.27);
}
#panoramaId >>> .el-dialog__header {
  background-color: #f1f4f6;
  border-radius: 5px 5px 0px 0px;
  padding: 10px 0 10px 20px;
  text-align: left;
}
#panoramaId >>> .el-dialog__title {
  color: #333;
  font-size: 15px;
}
#panoramaId >>> .el-dialog__headerbtn {
  top: 12px;
  font-size: 20px;
}
#panoramaId >>> .el-dialog__headerbtn .el-dialog__close {
  color: #adb6c2;
}
/* 删除弹窗样式*/
.delSubTitles > p {
  text-align: center;
}
.delContent ul li {
  list-style: none;
  margin-bottom: 5px;
  background-color: #eee;
  max-width: 305px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 7px 0 0 5px;
  height: 32px;
}
.delContent > p {
  margin-bottom: 0px;
}
.selectWrap {
  padding-left: 0px;
  max-height: 220px;
  overflow-y: scroll;
  position: relative;
}
.scorll::-webkit-scrollbar {
  width: 5px !important;
  height: 5px !important;
  /* background-color: rgba(0, 119, 255, 1); */
}
.scorll::-webkit-scrollbar-thumb {
  border-radius: 3px !important;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3) !important;
  background-color: rgb(0, 200, 255, 0.2) !important;
  /* opacity: 0.2; */
}

.reportTitle >>> .el-dialog__header {
  background: #ddd;
  padding: 10px 20px 12px;
}
.reportTitle >>> .el-dialog__body {
  padding: 0px 25px 30px;
  font-size: 16px;
}
.icon-error {
  position: absolute;
  left: 320px;
}
/*上报省厅 */
.reportItem {
  display: inline-block;
  position: absolute;
  left: 248px;
  width: 50px;
  height: 24px;
  line-height: 24px;
  padding-left: 5px;
  background: #85d40a;
  color: white;
}

.event_list_wrap {
  padding: 12px 0px 0 0px;
  /* width: 600px; */
  box-sizing: border-box;
}

.event_list {
  margin-right: 15px;
}

.event_list .item_wrap,
.event_list .swiper-slide {
  width: 122px !important;
  height: 56px;
  background: #f6f9ff;
  border-radius: 5px;
  border: 1px solid #d1ddf1;
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
}

.event_list .item_wrap_active {
  border: 1px solid #0091ff !important;
}

.event_list .item_wrap .el-icon-close {
  position: absolute;
  right: 4px;
  top: 4px;
  z-index: 100;
}
.event_list .item_wrap_bg {
  width: 56px;
  height: 46px;
  position: absolute;
  right: 0;
}
.event_list .item_wrap_bg > img {
  object-fit: cover;
  width: 56px;
  height: 49px;
}
.event_list .item_wrap > p {
  margin: 0;
  padding: 0;
}
.event_name {
  font-size: 17px;
  color: #333333;
  font-weight: bold;
}
.event_date {
  font-size: 13px;
  font-weight: 400;
  color: #666666;
  margin-top: 6px !important;
}

/* 轮播图样式 start */
.event_list_wrap .swiper-button-prev {
  left: 0 !important;
  --swiper-navigation-color: #ffffff; /* 单独设置按钮颜色 */
  --swiper-navigation-size: 30px; /* 设置按钮大小 */
}
.swiper-button-prev, .swiper-container-rtl .swiper-button-next{
  background: none !important
}

.event_list_wrap .swiper-container {
  padding: 15px 0px 15px 24px !important;
  width: 576px;
}

/* 三角形-左边 */
.event_list_wrap .swiper-button-prev .pre {
  position: absolute;
  /* left: -6px; */
  /* left: 0px; */
  width: 0;
  height: 0;
  border-right: 9px solid #999999;
  border-left: 9px solid transparent;
  border-top: 9px solid transparent;
  border-bottom: 9px solid transparent;
}

.event_list_wrap .swiper-button-next {
  right: -10px !important;
  --swiper-navigation-color: #ffffff; /* 单独设置按钮颜色 */
  --swiper-navigation-size: 30px; /* 设置按钮大小 */
}

/* 三角形-右边 */
.event_list_wrap .swiper-button-next .next {
  position: absolute;
  /* right: -6px; */
  /* right: 0px; */
  width: 0;
  height: 0;
  border-left: 9px solid #999999;
  border-right: 9px solid transparent;
  border-top: 9px solid transparent;
  border-bottom: 9px solid transparent;
}
.event_list_wrap .my-button-disabled {
  opacity: 0.2;
}
.event_list_wrap .swiper-button-next:after,
.swiper-button-prev:after {
  display: none;
}
.event_list_wrap .swiper-slide {
  /* margin-right: 15px; */
}
/* 轮播图样式 end */

/* 事件内容*/
.icon-location {
  color: #9fc8fe;
  line-height: 25px;
  display: inline-block;
  font-size: 24px;
  margin-left: 5px;
}
.icon-help {
  margin-right: 30px;
  color: #039ed9;
  border-bottom: 1px solid #039ed9;
  cursor: pointer;
}
.titleHeader {
  margin-bottom: 20px;
}
.header {
  margin-top: 10px;
}
.sendBtn {
  border-radius: 3px;
  border: 1px solid #0091ff;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #0091ff;
  line-height: 17px;
  border-color: rgb(0, 145, 255);
}
.Titles {
  color: #999;
}
.titleItem {
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  text-align: left;
}

/* 通话录音 */
#content_del .control_wrap .img_del {
  position: relative !important;
  top: 5px !important;
}
.fullScreen {
  position: absolute;
  right: 30px;
  top: 30px;
  z-index: 999;
  cursor: pointer;
}
/* 预览 */
.SiteItem {
  display: flex;
  justify-content: space-between;
}
.locas {
  display: inline-block;
  max-width: 412px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
}

.contact {
  margin-bottom: 10px;
}
.contact_list {
  overflow: hidden;
  width: 100%;
}
.contactItem {
  margin-bottom: 8px;
}
.contact_item {
  float: left;
  width: 50%;
  margin-bottom: 10px;
}

.phoneIcon {
  width: 42px;
  height: 42px;
  border: 1px solid #36a9ce;
  line-height: 42px;
  border-radius: 50%;
  line-height: 42px;
  background: #36a9ce;
  color: #fff;
}
.phones {
  display: flex;
}
.card-icons {
  width: 300px;
  float: right;
  position: relative;
  border-color: #bebebe;
}
.card-icons.el-card {
  overflow: initial !important;
}
.card-icons.el-card::before {
  content: "";
  width: 0;
  height: 0;
  border: 18px solid transparent;
  border-right-color: black;
  position: absolute;
  left: -12%;
  top: 25%;
  margin-top: -18px;
}
.card-icons.el-card:after {
  content: "";
  width: 0;
  height: 0;
  border: 18px solid transparent;
  border-right-color: white;
  position: absolute;
  left: -12%;
  top: 25%;
  margin-top: -18px;
}
.cardContact {
  margin-bottom: 10px;
}
.cardRemarks {
  text-indent: -11px;
  line-height: 24px;
}
.cardItem {
  max-width: 204px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: normal;
}
/* .currentContent{
  display:flex;
} */
.faxData {
  text-indent: -13px;
}
.faxName {
  color: #29acdf;
  /* border-bottom: 1px solid #29acdf; */
  max-width: 183px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.faxNameItem {
  color: #29acdf;
  /* border-bottom: 1px solid #29acdf; */
}
.Faxs {
  max-width: 280px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.footerBtn {
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: flex-end;
}
.contentMsg {
  /* line-height: 25px; */
}
.contenTitle {
  text-indent: 1px;
}
.contact {
  text-indent: 14px;
}
.textRemark {
  max-width: 200px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.sendFaxList-headline {
  background: #595959;
  margin: 3px 10px;
  height: 20px;
  width: 3px;
  position: absolute;
  top: 19px;
  left: 20px;
  z-index: 99;
  cursor: pointer;
}
.title-text {
  font-weight: 700;
  font-size: 18px;
  width: 100px;
  height: 20px;
  position: absolute;
  top: 19px;
  left: 46px;
  z-index: 99;
  cursor: pointer;
}

/* 其他附件样式 */
.file_list {
  display: flex;
  flex-direction: column;
  padding-left: 10px;
  height: 150px;
  overflow-y: scroll;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
}
.file_item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 30px;
  line-height: 30px;
  margin-bottom: 4px;
  cursor: pointer;
}
.file_name:hover {
  font-weight: 400;
  color: #0091ff;
  cursor: pointer;
}
.file_name {
  font-size: 14px;
  min-width: 206px;
  text-overflow: ellipsis;
  text-align: left;
  padding-left: 4px;
  margin-right: 20px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.information_elements_item {
  margin-right: 1%;
  margin-left: 1%;
  margin-bottom: 10px;
  min-width: 31%;
  box-sizing: border-box;
  text-align: left;
}
.formContent {
  height: 636px;
}
</style>
