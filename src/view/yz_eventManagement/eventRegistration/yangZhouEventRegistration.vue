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
              v-model="myEventFormData.valueStr"
              style="width: 100%"
              :disabled="myEventFormData.timeDateVal"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-col>
          <el-col :span="19">
            <el-col :span="18">
              <el-col :span="6">
                <el-select
                  v-model="myEventFormData.findTheRangeValue"
                  placeholder="查找区间"
                  style="margin: 0 0 0 5px"
                  @change="intervalDetection1"
                >
                  <el-option
                    v-for="item in findTheRangeData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-col>
              <el-col :span="6">
                <el-input
                  v-model="myEventFormDataNumber"
                  placeholder="查询数量"
                  style="margin: 0 0 0 5px"
                  @blur="inputNumber"
                />
              </el-col>
            </el-col>
          </el-col>
        </el-col>

        <el-col
          :span="4"
          style="text-align: left; text-indent: 10px; margin-top: 2px"
        >
          <el-button type="primary" size="medium" @click="priveFind">
            查找
          </el-button>
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
        />
        <el-table-column
          prop="sendTime"
          align="center"
          label="事发时间"
          height="30"
          show-overflow-tooltip
          min-width="40%"
        />
        <el-table-column
          prop="disasterType"
          align="center"
          label="事件类别"
          height="30"
          show-overflow-tooltip
          width="200"
        />
        <el-table-column label="操作" width="220" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="openMyEvent(scope.row)"
            >
              打开
            </el-button>
            <el-button
              type="primary"
              size="mini"
              @click="addnMyEvent(scope.row)"
            >
              加入事件管理
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!--省厅弹窗end-->
    <div class="yangZhou-eventRegistration-container">
      <el-header class="yangZhou-eventRegistration-container__header">
        <el-col
          :span="18"
          class="yangZhou-eventRegistration-container__header-left"
        >
          <el-col :span="5">
            <el-date-picker
              v-model="valueStr"
              size="big"
              style="width: 100%"
              :disabled="timeDateVal"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-col>
          <el-col :span="19">
            <el-col :span="6">
              <div style="margin-left: 5px">
                <el-input
                  v-model="searchInput"
                  size="big"
                  placeholder="输入标题"
                  prefix-icon="el-icon-search"
                />
              </div>
            </el-col>
            <el-col :span="18">
              <el-col :span="6">
                <el-select
                  v-model="findTheRangeValue"
                  size="big"
                  placeholder="查找区间"
                  style="margin: 0 0 0 5px"
                  @change="intervalDetection"
                >
                  <el-option
                    v-for="item in findTheRangeData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-col>
              <el-col :span="6">
                <el-select
                  v-model="eventLevelValue"
                  size="big"
                  clearable
                  placeholder="事件级别"
                  style="margin: 0 0 0 5px"
                >
                  <el-option
                    v-for="item in eventLevelDate"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-col>
              <el-col :span="6">
                <!-- 注释原因：事件类型是多级的，要用级联选择器 -->
                <!-- <el-select
                  v-model="eventCategoryValue"
                  size="big"
                  clearable
                  placeholder="事件类型"
                  style="margin: 0 0 0 5px"
                >
                  <el-option
                    v-for="item in eventCategoryData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select> -->
                <el-cascader
                  ref="incidenType"
                  v-model.trim="eventCategoryValue"
                  :options="eventCategoryData"
                  :show-all-levels="false"
                  :props="{
                    label: 'name',
                    value: 'id',
                    children: 'children',
                    checkStrictly: true,
                  }"
                  clearable
                  placeholder="事件类型"
                  filterable
                  size="big"
                  style="margin: 0 0 0 5px"
                />
              </el-col>
              <el-col :span="6">
                <el-select
                  v-model="handleTheStateValue"
                  size="big"
                  clearable
                  placeholder="办理状态"
                  style="margin: 0 0 0 5px"
                >
                  <el-option
                    v-for="item in handleTheStateData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-col>
            </el-col>
          </el-col>
        </el-col>

        <el-col
          :span="6"
          class="yangZhou-eventRegistration-container__header-right"
        >
          <el-button
            type="primary"
            size="big"
            class="button-style"
            @click="eventFind"
          >
            查找
          </el-button>
          <el-button
            type="primary"
            size="big"
            class="button-style"
            @click="advancedEventFind"
          >
            高级查找
          </el-button>
          <!-- <el-button type="primary" size="medium" @click="openEventFind(1)">省厅事件</el-button> -->
          <el-button
            type="primary"
            size="big"
            class="button-style"
            @click="showEventSettings"
          >
            事件配置
          </el-button>
        </el-col>
      </el-header>

      <el-main class="yangZhou-eventRegistration-container__main">
        <div class="contentStyle">
          <div class="content-col contentStyle-left">
            <div class="content-col-header">
              <div class="content-col-header__left">事件列表</div>
              <div class="content-col-header__right">
                <el-button
                  type="primary"
                  :disabled="selectList.length !== 1 ? true : false"
                  @click="rowOpenEvent"
                >
                  打开
                </el-button>
                <el-button type="primary" @click="rowDelect"> 删除 </el-button>
                <el-button
                  type="primary"
                  :disabled="selectList.length !== 1 ? true : false"
                  @click="conclusion"
                >
                  总结报告
                </el-button>
                <el-button
                  type="primary"
                  :disabled="selectList.length !== 1 ? true : false"
                  @click="rowDealEvent"
                >
                  处置
                </el-button>
                <!--@author：qinjiaqi 事件完结-扬州项目使用 -->
                <el-button
                  v-if="IsYangZhouProject"
                  class="el-icon-check"
                  @click="endEvent"
                >
                  事件完结
                </el-button>
                <el-button
                 v-if="IsYangZhouProject"
                 type="primary"
                  size="mini"
                  @click="rowReportProvincia"
                >
                  上报省厅
                </el-button>
                <div
                  v-if="isOpenLab"
                  style="display: flex; align-items: center"
                >
                  <div style="font-size: 15px; margin-right: 5px">
                    三级联动事件
                  </div>
                  <el-tooltip :content="linkageValue" placement="top">
                    <el-switch
                      v-model="linkageValue"
                      active-value="开"
                      inactive-value="关"
                    />
                  </el-tooltip>
                </div>
              </div>
            </div>
            <!-- 2021-5-26 新设计-->
            <!-- <div style="margin-top: 20px">
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
                  </div>
                </div> -->
            <!-- 注释原因：设计变更 -->
            <!-- <div class="eventInfoDiv">
                  <div class="eventInfoItem">
                    <img
                      src="./components/assets/event.png"
                      alt=""
                    >
                    <div class="eventInfoItem__right">
                      <div class="eventInfoItem__right__num">
                        {{ eventNumber }}
                      </div>
                      <div class="eventInfoItem__right__bot">
                        事件（件）
                      </div>
                    </div>
                  </div>
                  <div class="eventInfoItem">
                    <img
                      style="width:26px;height:35px"
                      src="./components/assets/death.png"
                      alt=""
                    >
                    <div class="eventInfoItem__right">
                      <div class="eventInfoItem__right__num">
                        {{ eventDie }}
                      </div>
                      <div class="eventInfoItem__right__bot">
                        死亡（人）
                      </div>
                    </div>
                  </div>
                  <div class="eventInfoItem">
                    <img
                      style="width:32px;height:29px"
                      src="./components/assets/hurt.png"
                      alt=""
                    >
                    <div class="eventInfoItem__right">
                      <div class="eventInfoItem__right__num">
                        {{ eventWas }}
                      </div>
                      <div class="eventInfoItem__right__bot">
                        受伤（人）
                      </div>
                    </div>
                  </div>
                  <div class="eventInfoItem">
                    <img
                      style="width:35px;height:35px"
                      src="./components/assets/lost.png"
                      alt=""
                    >
                    <div class="eventInfoItem__right">
                      <div class="eventInfoItem__right__num">
                        {{ eventMissing }}
                      </div>
                      <div class="eventInfoItem__right__bot">
                        失踪（人）
                      </div>
                    </div>
                  </div>
                </div> -->
            <!-- 2021-5-26 新设计-->
            <!-- 2021-06-21新设计 -->
            <div class="eventInfoDiv__new">
              <ul class="eventInfoDiv__new__list">
                <li class="eventInfoDiv__new__item">
                  <span class="eventInfoDiv__new__item__count">{{
                    eventNumber
                  }}</span>
                  <span class="eventInfoDiv__new__item__label">事件(件)</span>
                </li>
                <li class="eventInfoDiv__new__division" />
                <li class="eventInfoDiv__new__item">
                  <span class="eventInfoDiv__new__item__count">
                    {{ eventDie }}
                  </span>
                  <span class="eventInfoDiv__new__item__label">死亡(人)</span>
                </li>
                <li class="eventInfoDiv__new__division" />
                <li class="eventInfoDiv__new__item">
                  <span class="eventInfoDiv__new__item__count">{{
                    eventWas
                  }}</span>
                  <span class="eventInfoDiv__new__item__label">受伤(人)</span>
                </li>
                <li class="eventInfoDiv__new__division" />
                <li class="eventInfoDiv__new__item">
                  <span class="eventInfoDiv__new__item__count">{{
                    eventMissing
                  }}</span>
                  <span class="eventInfoDiv__new__item__label">失踪(人)</span>
                </li>
              </ul>
            </div>

            <el-table
              height="550px"
              :data="tableData"
              :header-row-style="{ background: '#F0F5FF' }"
              highlight-current-row
              style="
                width: 100%;
                margin: 10px 0;
                text-align: center;
                box-shadow: none;
              "
              @row-click="tableRowClick"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" align="center" width="55" />
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
                    v-if="IsYangZhouProject && scope.row.reportStatus == 1"
                    class="el-icon-check"
                    style="
                      position: absolute;
                      left: 193px;
                      top: 19px;
                      color: #70b603;
                      font-size: 20px;
                    "
                  />
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
                          scope.row.occurTime.lastIndexOf(':'),
                        )
                      : ''
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
              />
            </el-table>
            <!--分页-->
            <el-pagination
              center
              layout="prev, pager, next,  total, jumper"
              :page-size="pageSize"
              :total="total"
              :current-page="currentPage"
              @current-change="handleCurrentChange"
            />
          </div>

          <div class="content-col contentStyle-center">
            <div style="width: 100%; height: 740px">
              <!-- 中间 - 续报 -->
              <ReportEvent
                ref="reportEventRef"
                :event-deal-list="eventList"
              />

              <!-- 轮播图 -->
              <!-- <div v-show="eventList.length > 0" class="event_list_wrap">
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
                        <p class="event_name">
                          {{ item.dealOrderName }}
                        </p>
                        <div class="item_wrap_bg"></div>
                      </div>
                    </div>
                  </div>
                  <div slot="button-prev" class="swiper-button-prev">
                  </div>
                  <div slot="button-next" class="swiper-button-next">
                  </div>
                </div>
              </div> -->

              <!-- 内容部分 -->
              <!-- <div class="newContent-box">
                <el-scrollbar v-show="eventList.length > 0" class="formContent">
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
                    <el-col :span="16" style="border: 1px solid transparent">
                      <div class="titleItem">
                        {{ currentEventTime }}
                      </div>
                    </el-col>
                  </el-row>

                  <el-row :gutter="gutter" class="titleHeader">
                    <el-col :span="4">
                      <div prop="reportedTime" class="Titles">接报时间:</div>
                    </el-col>
                    <el-col :span="16">
                      <div class="titleItem">
                        {{ currentEventDatas.reportTime }}
                      </div>
                    </el-col>
                  </el-row>

                  <el-row :gutter="gutter" class="titleHeader">
                    <el-col :span="4">
                      <div prop="accidentUnit" class="Titles">事故单位:</div>
                    </el-col>
                    <el-col :span="16" style="border: 1px solid transparent">
                      <div class="titleItem">
                        {{ currentEventDatas.accidentUnit }}
                      </div>
                    </el-col>
                  </el-row>

                  <el-row :gutter="gutter" class="titleHeader">
                    <el-col :span="4">
                      <div prop="incidenArea" class="Titles">所属区域:</div>
                    </el-col>

                    <el-col :span="16">
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
                            currentEventDatas.fallFigureAddress
                          }}</span>
                          <i
                            class="el-icon-location-outline icon-location"
                            @click="location"
                          />
                        </div>
                        <div class="submit_btn">
                          <el-button
                            size="mini"
                            class="sendBtn"
                            @click="sendSite"
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

                    <el-col :span="8" style="border: 1px solid transparent">
                      <div class="titleItem">
                        {{ currentEventDatas.department }}
                      </div>
                    </el-col>
                  </el-row>

                  <el-row :gutter="gutter" class="titleHeader">
                    <el-col :span="4">
                      <div prop="incidenType" class="Titles">事件类型:</div>
                    </el-col>

                    <el-col :span="8">
                      <div class="titleItem">
                        {{ currentEventDatas.typeName }}
                      </div>
                    </el-col>
                  </el-row>

                  <el-row :gutter="gutter" class="titleHeader">
                    <el-col :span="4">
                      <div class="Titles">信息要素:</div>
                    </el-col>

                    <el-col :span="20" class="event-params-container">
                      <div
                        v-for="item in currentEventDatas.eventParams"
                        :key="item.pId + item.sId"
                        class="event-param"
                      >
                        {{
                          item.name + ':   ' + item.value + (item.unit || '')
                        }}
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
                    <el-col :span="4" class="Titles">
                      <div id="disposalSituation">处置情况:</div>
                    </el-col>

                    <el-col :span="20">
                      <div class="disposalSituation">
                        {{ currentEventDatas.disposalSituation }}
                      </div>
                    </el-col>
                  </el-row>

                  <el-row :gutter="gutter" class="titleHeader">
                    <el-col :span="4">
                      <div id="otherAttachments" class="Titles">其他附件:</div>
                    </el-col>
                    <el-col :span="20">
                      <div class="file_list">
                        <div
                          v-for="(item, index) in fileList"
                          :key="item.index"
                          class="file_item"
                        >
                          <i class="el-icon-paperclip" />
                          <span class="file_name" @click="downloadFile(item)">{{
                            item.fileName
                          }}</span>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                </el-scrollbar>
              </div> -->
            </div>
          </div>

          <div class="content-col contentStyle-right">
            <div class="content-col-header">
              <div class="content-col-header__left">事件时序信息管理</div>
              <div class="content-col-header__right">
                <el-radio-group v-model="eventChainValue" @change="eventChain">
                  <el-radio-button
                    v-for="item in eventChainData"
                    :key="item.id"
                    :label="item.id"
                  >
                    {{ item.name }}
                  </el-radio-button>
                </el-radio-group>
              </div>
            </div>

            <el-scrollbar style="height: 640px">
              <div>
                <EventTimeSeries
                  ref="eventTimeSeries"
                  @seeDetail="cardDetail"
                  @delete="deleteEvents"
                  @clickItem="itemClick"
                />
              </div>
            </el-scrollbar>

            <div class="footerBtn">
              <el-button type="primary" @click="eventPanorama">
                事件全景
              </el-button>
              <el-button type="primary" @click="exportList">
                导出列表
              </el-button>
              <!-- <div
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
              </div> -->
            </div>
          </div>
        </div>
      </el-main>
    </div>

    <!--悬浮球-->
    <div v-if="(floatingBall = false)" class="floatingBall" @mousedown="move">
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
          style="font-size: 16px; font-family: 'Microsoft JhengHei'"
          @click="dblclickDialog"
        >
          当前未处理
        </div>
      </div>
      <transition name="el-zoom-in-center">
        <div
          v-if="flyMe"
          class="transition-box"
          style="position: absolute; right: -40px; top: -30px"
        >
          <el-badge :max="99" :value="phoneValue" class="item">
            <!--电话-->
            <el-button
              size="small"
              class="el-icon-phone buttonBadge"
              @click="allClickPhoneDialog"
            />
          </el-badge>
        </div>
      </transition>

      <transition name="el-zoom-in-center">
        <div
          v-if="flyMe"
          class="transition-box"
          style="position: absolute; right: -65px; top: 40px"
        >
          <el-badge :max="99" :value="smsValue" class="item">
            <!--短信-->
            <el-button
              size="small"
              class="el-icon-s-comment buttonBadge"
              @click="allClickSmsDialog"
            />
          </el-badge>
        </div>
      </transition>

      <transition name="el-zoom-in-center">
        <div
          v-if="flyMe"
          class="transition-box"
          style="position: absolute; right: -40px; top: 115px"
        >
          <el-badge :max="99" :value="faxValue" class="item">
            <!--传真-->
            <el-button
              size="small"
              class="el-icon-printer buttonBadge"
              @click="dblclickDialog"
            />
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
        ref="ruleForm"
        label-width="80px"
        :model="ruleForm"
        :rules="rules"
        @submit.native.prevent
      >
        <el-form-item label="事件标题:">
          <el-input
            v-model.trim="ruleForm.eventTitle"
            type="text"
            show-word-limit
            @change="changeVal"
          />
        </el-form-item>
        <el-form-item label="报送单位:">
          <el-input v-model.trim="ruleForm.submittedUnit" type="text" clearable>
            <template slot="append">
              <el-button @click="submittedSelect"> 选择 </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="事件类型:">
          <el-input v-model.trim="ruleForm.submittedType" type="text" clearable>
            <template slot="append">
              <el-button @click="eventSelect"> 选择 </el-button>
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
          />
          <span>&nbsp;至&nbsp;</span>
          <el-date-picker
            v-model="ruleForm.endTime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="事件级别:">
          <el-select
            v-model="ruleForm.rankEvent"
            style="width: 100%"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in rankSelect"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
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
        />
      </el-dialog>

      <div slot="footer" class="dialog-footer" style="text-align: center">
        <!--        <el-button @click="outerVisible = false">取消</el-button>-->
        <el-button type="primary" @click="lookForConfirmation">
          查找
        </el-button>
      </div>
    </el-dialog>

    <!--旧版本的处置弹窗，现在弃用，没有引入(所有相关数据没有删除，只是没有引用这个组件了)-->
    <deal-dialog
      v-if="dealRefresh"
      ref="dispositionDisposal"
      :deal-dialog="dealDialog"
      :deal-title="dealTitle"
      :event-id="eventId"
      :report-description="reportDescription"
      :continue-item="continueItem"
      @dispositionClose="dispositionClose"
      @dispositionConfirm="dispositionConfirm"
      @dispositionCloseDialog="dispositionCloseDialog"
    />

    <!--新的短信、传真处置模块-->
    <manage-dialog
      v-if="manageDialogRefresh"
      ref="manageDialog"
      :manage-title="manageTitle"
      :manage-dialog="manageDialog"
      :item-data="itemData"
      :disposal-type="disposalType"
      @manageCloseDialog="manageCloseDialog"
    />

    <associated-changes-model
      v-if="associatedRefresh"
      ref="associatedChangesModel"
      :associated-changes-model-title="associatedChangesModelTitle"
      :associated-changes-model-dialog="associatedChangesModelDialog"
      @associatedManageCloseDialog="associatedManageCloseDialog"
      @associatedClose="associatedClose"
      @associatedAffirm="associatedAffirm"
    />

    <!--全部模板的弹窗-->
    <all-model-dialog
      ref="allModelDialog"
      :all-model-title="allModelTitle"
      :suspend-model-dialog="suspendModelDialog"
      @allModelCloseDialog="allModelCloseDialog"
    />

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
        :child-title="childTitle"
        :child-event-id="eventId"
      />
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
            v-for="(item, index) in selectList"
            :key="index"
            class="selectItem"
          >
            {{ item.title }}
            <i class="el-icon-error icon-error" @click="delItem(index)" />
          </li>
        </ul>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleDelReportClose"> 取 消 </el-button>
        <el-button type="danger" @click="sureBtn"> 确 定 </el-button>
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
            v-for="(item, index) in selectList"
            :key="index"
            class="selectItem"
          >
            {{ item.title }}
            <span v-if="item.reportStatus == 1" class="reportItem">已上报</span>
            <i class="el-icon-error icon-error" @click="delItem(index)" />
          </li>
        </ul>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleDelClose"> 取 消 </el-button>
        <el-button type="success" @click="reportBtn"> 确 定 </el-button>
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
      full-screen
      @click="isFaxCard = true"
    >
      <div class="box-card" style="margin: 10px 0; height: 660px">
        <span class="sendFaxList-headline" />
        <span class="title-text">传真预览</span>
        <img
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
          @click="fullScreenDialog = true"
        />
        <iframe
          id="fpxIframe"
          :src="allFpxPreviewPath"
          width="100%"
          height="100%"
          frameborder="no"
          marginwidth="0"
          marginheight="0"
          scrolling="no"
          allowtransparency="yes"
        />
      </div>
    </el-dialog>
    <!--弹窗预览传真-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="fullScreenDialog"
      class="fullscreenFax"
      fullscreen
    > 
      <iframe
        id="iframe"
        :src="previewReportUrl"
        width="100%"
        height="900px"
        frameborder="no"
        marginwidth="0"
        marginheight="0"
        scrolling="no"
        allowtransparency="yes"
      />
    </el-dialog>
    <!-- 全部历史详情 -->
    <el-dialog
      class="selectHistory"
      width="500px"
      :visible.sync="isDialog"
      :close-on-click-modal="false"
      :show-close="true"
      :title="'查看详情'"
      @click="isDialog = true"
    >
      <div class="box-card" style="margin: 10px 0">
        <div class="cardTimes">
          {{ currentItem.time }}
        </div>

        <div v-if="currentItem.type == 'phone'" class="cardIphones1">
          <el-row :gutter="20" style="margin-bottom: 8px">
            <el-col>
              联系人:<span style="margin-left: 24px">{{
                currentItem.contact
                  ? (currentItem.contact || currentItem.contact.name)
                  : currentItem.mobile
              }}</span>
            </el-col>
            <el-col :span="24">
              <div></div>
            </el-col>
          </el-row>

          <el-row :gutter="20" style="margin-bottom: 8px">
            <el-col :span="4"> 通话时长: </el-col>
            <el-col :span="16">
              <div>
                {{ currentItem.conversationTime }}
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20" style="margin-bottom: 8px">
            <el-col :span="4"> 备注信息: </el-col>
            <el-col :span="16">
              <div>
                {{ currentItem.remark }}
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-bottom: 8px">
            <el-col :span="4"> 电话录音: </el-col>
            <el-col :span="16">
              <div
                :id="'content_del' + currentItem.id"
                style="position: relative"
              >
                <!-- <audio
                  style="display: none"
                  controls
                  :src="audioSrc"
                /> -->
                <audio style="display: none" controls :src="currentItem.url" />
              </div>
            </el-col>
          </el-row>
        </div>

        <div v-if="currentItem.type == 'sms'" class="cardIphones1">
          <div class="contact" style="margin-bottom: 8px">
            <el-row :gutter="20">
              <el-col :span="4"> 收信人: </el-col>
              <el-col :span="16">
                <div class="contact_list">
                  {{ currentItem.nameList.length > 0 ? currentItem.nameList : '' }}
                  <!-- <span
                    v-for="(man, index) in currentItem.nameList"
                    :key="index"
                    class="contact_item"
                  >{{ man }}</span> -->
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="currentContent">
            <el-row :gutter="20">
              <el-col class="contenTitle" :span="4"> 信息内容: </el-col>
              <el-col :span="16" class="contentMsg">
                <div>{{ currentItem.content }}</div>
              </el-col>
            </el-row>
          </div>
        </div>

        <div v-if="currentItem.type == 'fax'" class="cardIphones1">
          <el-row :gutter="20">
            <el-col :span="4"> 收信人: </el-col>
            <el-col :span="7">
              <div class="contact_list">
                <span>{{ currentItem.nameList.length > 0 ? currentItem.nameList : '' }}</span>
              </div>
            </el-col>
          </el-row>
          <div class="fax">
            <el-row :gutter="20">
              <el-col class="faxData" :span="4"> 传真文件: </el-col>
              <el-col :span="16">
                <div class="faxNameItem" @click="itemClick(currentItem)">
                  {{ currentItem.name }}
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </el-dialog>
    <sv-dialog
      ref="LocationDialogRef"
      title="定位"
      @modal="handleClosex"
      @cancel="handleClosex"
    >
      <div style="min-width: 600px; min-height: 400px; padding: 20px">
        <Location
          :address="currentEventDatas.address"
          :lng-lat="[currentEventDatas.longitude, currentEventDatas.latitude]"
          @confirm="handleLocationConfirm"
        />
      </div>
    </sv-dialog>

    <!--发送事发地点-->
    <multiple-contact
      v-if="hackResetMultiple"
      ref="selectDialog"
      :select-title="selectTitle"
      :select-data="selectData"
      @close="closeMultiple"
      @confirm="confirmMultiple"
      @closeDialog="closeMyDialogMultiple"
    />

    <!-- 总结报告 -->
    <el-dialog
      class="summaryReports"
      width="800px"
      top="10vh"
      :visible.sync="summaryReports"
      :close-on-click-modal="false"
      :show-close="true"
      full-screen
      @click="conclusionReport()"
    >
      <div class="box-card" style="margin: 10px 0; height: 660px">
        <span class="sendFaxList-headline" />
        <span class="title-text">总结报告</span>
        <img
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
          @click="fullScreenDialog = true"
        />
        <iframe
          id="fpxIframe"
          :src="previewReportUrl"
          width="100%"
          height="100%"
          frameborder="no"
          marginwidth="0"
          marginheight="0"
          scrolling="no"
          allowtransparency="yes"
        />
        <!-- 信息报送 -->
        <el-footer class="apprvoveData">
          <el-row class="leadersApproved">
            <el-button type="primary" @click="expressPushHandle()">
              信息上报
            </el-button>
          </el-row>
        </el-footer>
      </div>
    </el-dialog>
    <!--信息报送-->
    <express-push
      v-if="expressPushVisible"
      ref="expressPush"
      :express-push-data="expressPushData"
      @closeExpressPush="handleCloses"
    />
    <EventSetting
      :dialog-visible="settingVisible"
      @handleClose="settingVisible = false"
    />
  </el-container>
</template>

<script>
import treeSearch from '@/view/yz_eventManagement/eventRegistration/plan/treeSearch';
import dealDialog from '@/view/yz_eventManagement/eventRegistration/plan/dispositionDisposal'; // 旧的处置模块
import manageDialog from '@/view/yz_eventManagement/eventRegistration/newModel/manageDialog'; // 新的短信、传真处置模块
import associatedChangesModel from '@/view/yz_eventManagement/eventRegistration/newModel/associatedChangesModel';
import allModelDialog from '@/view/yz_eventManagement/eventRegistration/newModel/allModelDialog'; // 悬浮球弹窗全部Model
import panorama from '@/view/yz_eventManagement/eventRegistration/plan/panorama'; // 事件全景
import bus from '@/yz_components/common/js/eventBus';
import Bus from '@/views/common/js/eventBus';
import { sectionToChinese, matchFileType } from '@/assets/js/yz_common.js';
import Location from '@/views/modules/GarbageClassification/SiteManagement/ClassificationSite/Location/Location';
import multipleContact from '@/view/yz_eventManagement/eventReports/dialog/selectDialog';
import AudioControls from '@/../static/audioControls/audioPlugin';

import pdf from 'vue-pdf';
import informaHistory from '@/view/yangZhouEventReports/page/eventBulletin/InformaHistory'; // 通讯历史
import expressPush from '@/view/yangZhouEventReports/page/eventBulletin/ExpressPush'; // 信息报送
import addContact from '@/view/yz_integratedCommunication/icpPhone/icpPhonePage/smsStep/addContact/AddContact'; // 更改
// import EventInfoCard from "./components/EventInfoCard" //事件基本信息按钮
// 事件配置
import EventSetting from '@/view/yz_SysSetting/settingDialog.vue';
import EventTimeSeries from '@/view/yz_eventManagement/eventRegistration/plan/EventTimeSeries/EventTimeSeries.vue';
import ReportEvent from '@/view/eventManagement/informationDisposal/SystemReport/components/ReportEvent/ReportEvent.vue';
import eventMixin from '@/view/eventManagement/informationDisposal/SystemReport/assets/js/event.js';

const $downloadFile = require('@/utils/downloadFile.js').default;

export default {
  name: 'YangZhouEventRegistration',
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
    expressPush,
    informaHistory,
    addContact,
    EventSetting,
    EventTimeSeries,
    ReportEvent,
    // EventInfoCard
  },
  mixins: [eventMixin],
  data() {
    return {
      settingVisible: false, // 是否显示事件配置弹窗
      fileList: [], // 附件列表
      clickFlag: true,
      audioControls: '', // 音频的构造函数
      Faxdis: false,
      allFpxPreviewPath: '', // allModel选中传真的传真预览地址
      ApiUrl: window.g.ApiUrl,
      audioSrc: null, // 录音地址
      selectData: false, // 发送事发地点是否弹窗
      selectTitle: '', // 发送事发地点弹窗标题
      hackResetMultiple: true, // 强制刷新
      mapId: 'overId', // 地图定位不同的ID
      gutter: 20,
      eventTitle: '',
      incidentTime: '',
      reportedTime: '',
      accidentUnit: '',
      incidenArea: '',
      incidentSite: '',
      reportingUnit: '', // 报告单位
      incidenType: '', // 事件类型
      allCase: '', // 事件概况
      currentEventData: {}, // 当前选中的事件续报或首报的信息
      currentEventDatas: {},
      currentEventTime: '',
      eventList: [], // 事件列表 轮播 扬州项目使用
      IsYangZhouProject: window.g.IsYangZhouProject,
      testData: '',
      isDeleteShow: false,
      isShow: false, // 是否弹出删除框
      isDialog: false, // 是否弹窗短信,传真,电话详情弹窗
      isFaxCard: false,
      summaryReports: false, // 总结报告弹窗
      summaryTitle: '', /// /总结报告弹窗标题
      myEventTitle: '省厅事件',
      isopenEvent: false,
      myEventFormData: {
        shentinTableData: [], // 省厅table
        valueStr: '', // 搜索日期
        searchInput: '', // 标题搜索
        findTheRangeValue: 0, // 查找区间选中
        tableLoading: false,
      },
      myEventFormDataNumber: 10, // 省厅默认查找条数
      valueStr: '', // 搜索日期
      searchInput: '', // 标题搜索
      findTheRangeValue: 0, // 查找区间选中
      findTheRangeData: [
        {
          id: 0,
          name: '不限时间',
        },
        {
          id: 1,
          name: '当天',
        },
        {
          id: 2,
          name: '3天',
        },
        {
          id: 3,
          name: '7天',
        },
        {
          id: 4,
          name: '15天',
        },
        {
          id: 5,
          name: '30天',
        },
      ], // 获取到的查找区间
      eventLevelValue: '', // 事件级别选中
      eventLevelDate: [], // 获取到的事件级别
      eventCategoryValue: [], // 事件类别选中
      eventCategoryData: [], // 获取到的事件类别
      handleTheStateValue: '', // 办理状态选中
      handleTheStateData: [], // 获取到办理状态
      tableData: [], // 表格数据
      showOperation: false, // 是否显示表格的操作列
      eventChainValue: '0', // 事件链选中
      eventChainData: [
        { id: '0', name: '全部' },
        { id: '1', name: '传真' },
        { id: '2', name: '电话' },
        { id: '3', name: '短信' },
      ], // 获取到的事件链
      pageSize: 10, // 分页,一页显示多少条
      currentPage: 1, // 当前页数
      total: 0, // 总页数
      eventNumber: 0, // 共多少件事件
      eventDie: 0, // 共多少人死亡
      eventWas: 0, // 共多少人受伤
      eventMissing: 0, // 共多少人失踪
      // eventAffect:0,//共多少人受影响
      itemBox: [], // 事件链存储数据
      fit: 'fill',
      previewUrl: '', // 预览的图片地址
      previewReport: '', // 预览的总结报告地址
      listStaet: '查找', // 区分查找/高级查找
      outerVisible: false, // 高级查找外层弹窗
      title: '', // 高级查找外层标题
      typeData: '', // 区分事件类型
      ruleForm: {
        // 高级查找外层表单
        eventTitle: '',
        submittedUnit: '',
        submittedType: '',
        beginTime: '',
        endTime: '',
        rankEvent: '',
      },
      UnitId: [], // 保存高级选中单位的ID
      eventTypeId: [], // 保存高级选中类型的ID
      rules: {},
      rankSelect: [], // 高级查找事件级别
      innerVisible: false, // 高级查找内层弹窗
      coreTitle: '', // 内层弹窗标题
      dialogRefresh: true, // 刷新高级查找弹窗
      timeDateVal: false, // 日期是否可选
      RowData: [], // 表格行点击保存数据
      pathname: '/yangZhouEventReports', // 事件列表点击打开后跳转的页面地址
      dealDialog: false, // 处置弹窗是否弹出
      dealTitle: '', // 处置弹窗标题
      positionX: 0,
      positionY: 0,
      untreated: 0, // 悬浮球未处理数量
      phoneValue: 0, // 悬浮球电话数量
      smsValue: 0, // 悬浮球短信数量
      faxValue: 0, // 悬浮球传真数量
      flyMe: false, // 悬浮球子模块是否显示
      eventId: null, // 事件ID,(有些地方没有直接用到,是用的RowData.id的方式的)
      dealRefresh: false, // 强制刷新处置弹窗
      reportDescription: '', // 传递给处置弹窗的总体情况
      continueItem: '', // 传递给处置弹窗的信息模块的数据
      itemClickData: '', // 用来帮助预览判断是什么类型的预览
      itemClickDataRemark: '', // 电话或短信备注或是内容数据
      changeRed: -1, // 事件链更换样式
      /** *
       * 下面是新的处置模块的变量
       * */
      manageTitle: '', // 处置弹窗标题
      manageDialog: false, // 是否弹出
      manageDialogRefresh: false, // 强制刷新
      itemData: '', // 传递给弹窗的当前这个事件链的当前数据
      disposalType: '', // 打开处置页面的类型控制

      associatedChangesModelTitle: '', // 关联事件弹窗Title,
      associatedChangesModelDialog: false, // 关联事件是否开启弹窗
      associatedRefresh: true, // 关联事件弹窗刷新

      /** 下面是悬浮球弹出all
       * */
      allModelTitle: '',
      suspendModelDialog: false,
      registerStyle: {
        height: '',
      },
      panorameTitle: '', // 全景弹窗标题
      panorameVisible: false, // 全景弹窗
      childTitle: '', // 全景标题
      titleKey: null, // 用来刷新全景弹窗
      selectList: [], // 保存选中的事件
      deleteTitle: '', // 删除弹框标题
      delateList: [], // 删除弹窗的数据
      // value:false,
      reportTitle: '', // 删除,上报省厅弹窗标题
      SubTitles: '', // 删除弹窗,上报省厅副标题
      linkageValue: '关', // 三级联动开关
      isOpenLab: window.g.IsOpenLabProject, // 是否openlab项目
      currentItem: {},

      /* 下面是总结报告all */
      expressPushVisible: false, // 信息报送弹窗
      expressPushTitle: '信息报送', // 信息报送弹窗标题
      expressPushData: {
        faxOrMail: 'all', // 显示哪种类型弹窗 默认都显示 all:都显示  fax:只显示传真  mail:只显示邮件
        expressPushTitle: '信息上报', // 信息报送弹窗标题
        expressPushPDFUrl: '', // 传真文件
      },
      InformaHistoryFlag: false, // 通讯历史弹窗
      faxTitle: '', // 传真弹窗标题
      previewReportUrl: '',
      fullScreenDialog: false,
    };
  },
  watch: {
    myEventFormDataNumber(newV, oldV) {
      this.myEventFormDataNumber = newV.replace(/[^0-9]/gi, '');
    },
    eventId: {
      handler(newV, oldV) {
        if (newV === '' || newV === null) {
          this.itemBox = [];
          this.listStaet = '查找';
          this.RowData = [];
          this.reportDescription = '';
          this.continueItem = '';
          this.changeRed = -1;
        }
        if (newV !== oldV) {
          this.itemClickData = '';
          this.itemClickDataRemark = '';
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
    });
    const that = this;
    // 添加传真/邮件联系人
    bus.$on('getCheckCharge', (data) => {
      if (data.length != 0) {
        if (this.selectType == '传真') {
          this.expressPushData.faxContacts = data;
        } else if (this.selectType == '邮件') {
          this.expressPushData.mailContacts = data;
        }
      } else {
      }
    });
    Bus.$on('updateEventList', () => {
      this.getTableListData();
    });
  },
  created() {
    window.addEventListener('resize', this.getHeight);
    window.addEventListener('message', this.locationCallback);
    window.addEventListener('message', this.sendLocationMsg);

    this.getHeight();
  },
  beforeDestroy() {
    window.removeEventListener('message', this.locationCallback);
    window.addEventListener('message', this.sendLocationMsg);
    bus.$off('updateEventList');
  },
  destroyed() {
    window.removeEventListener('resize', this.getHeight);
  },
  methods: {
    /**
     * @description 获取字典接口
     */
    getByCodeAndParentCode() {
      const data = {
        pcode: 'event_over_status',
        code: 1,
      };
      this.$api.getByCodeAndParentCode(data).then((res) => {
        console.log('获取代办状态：', res);
      });
    },
    /**
     * @description 打开事件配置弹窗
     */
    showEventSettings() {
      this.settingVisible = true;
    },
    closeMyDialogMultiple() {
      this.hackResetMultiple = false;
      this.$nextTick(() => {
        // this.$nextTick执行一轮循环后刷新dom。
        this.hackResetMultiple = true;
      });
      this.selectData = false;
    },
    // colse关闭窗口
    closeDialog() {
      this.addEventDialog = false;
      if (this.ruleForm.incidenType.length == 0) {
        sessionStorage.setItem('caseID', '0');
      } else {
        sessionStorage.setItem('caseID', this.caseFor[0].id);
      }

      if (this.ruleForm.incidenArea.length == 0) {
        sessionStorage.setItem('areaId', '');
        sessionStorage.setItem('area', '');
      } else {
        sessionStorage.setItem('areaId', this.areaIdArr[0].id);
        sessionStorage.setItem('area', this.areaNameArr[0].name);
      }
      this.$refs.eventDialog.clearData(); // 刷新子组件数据
      if (this.titleType == '新增') {
        sessionStorage.removeItem('caseID');
        sessionStorage.removeItem('areaId');
        sessionStorage.removeItem('area');
      }
      this.$emit('refreshEvent');
    },

    /*
     * @param  {type}    :   param
     * @return {type}    :   return
     * @lastEditors   :   qcx
     * @lastEditTime  :   2020/12/10 17:06:35
     * @descripttion     :   关闭事发地点的弹窗
     */
    // 关闭事发地点的弹窗
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
      if (checkedCities == '' || checkedCities == []) {
        this.$message({
          message: '请先选择联系人',
          type: 'warning',
        });
        return;
      }
      this.hackResetMultiple = false;
      this.$nextTick(() => {
        // this.$nextTick执行一轮循环后刷新dom。
        this.hackResetMultiple = true;
      });
      const eventId = this.RowData.id; // 事件id
      const data = {
        title: this.ruleForm.eventTitle,
        eventId,
        contacter: checkedCities,
      };
      this.$api.sendLocation(data).then((res) => {
        if (res.errorcode == 0) {
          this.currentPage = 1;
          this.selectData = false;
          this.$message({
            message: '发送成功！',
            type: 'success',
          });
          // this.getStaetData(); 以前旧的获取全部state的函数，现在已经用不上了，调用会报错
        } else {
          // this.$message.error(res.msg)
        }
      });
    },

    /*
     * @descripttion 发送事发地点
     */
    // 发送事发地点
    sendSite() {
      this.selectTitle = '选择联系人';
      this.selectData = true;
    },
    /*
     * @param  {type}    :   param
     * @return {type}    :   return
     * @lastEditors   :   qcx
     * @lastEditTime  :   2020/12/10 16:38:28
     * @descripttion     :   地点定位
     */
    location() {
      this.$refs.LocationDialogRef.visible = true;
    },
    handleClosex() {
      this.$refs.LocationDialogRef.visible = false;
    },
    handleLocationConfirm(data) {
      this.$refs.LocationDialogRef.visible = false;
      this.currentEventDatas.fallFigureAddress = data;
    },
    /**
     * @editor qinjiaqi
     * @param {Object} 传回的地点信息
     * @return {type} undefined
     * @description：直接改事发地点文本不能触发组件聚焦，使用focus会因为el-input外面裹了div不起效果，改用ref
     */
    locationCallback(obj) {
      if (obj.data.action && obj.data.action == 'retpoint') {
        const latlon = obj.data.object.point.split(',');
        this.longitude = latlon[0];
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
      if (obj.data.action && obj.data.action == 'ready') {
        if (this.longitude && this.latitude) {
          const mapFarme = document.getElementById('overId');
          if (mapFarme) {
            const data = {};
            data.action = 'getpoint';
            const object = {};
            object.center = `${this.longitude},${this.latitude}`;
            object.address = this.ruleForm.incidentSite;
            object.area = '';
            data.object = object;
            mapFarme.contentWindow.postMessage(JSON.stringify(data), '*');
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
      if (item.type === 'phone') {
        // 生成的audio类名要唯一，不然会影响其他的audio
        setTimeout(() => {
          this.setAudioAttribute(
            `#content_del${this.currentItem.id} audio`,
            this.currentItem.url,
          );
        }, 100);
      }
      // this.getPhoneList();
    },
    faxCard(item) {
      this.isFaxCard = true;
      this.faxTitle = '传真预览';
      this.currentItem = item;
      this.allFpxPreviewPath = `${window.SITE_CONFIG.cloudUrl}${this.currentItem.file}`;
    },

    /**
     * @param {String} eventId 事件ID
     * @param {Number} index 当前选中下标
     * @description 查询事件首报和事件续报列表
     */
    findEventDealList(eventId, index) {
      const new_event_list = []; // 事件列表
      this.eventList = []; // 清空列表
      const data = {
        eventId, // 事件ID
      };
      this.$api.findEventDealList(data).then((res) => {
        if (res.errorcode === 0) {
          if (res.data && res.data.length > 0) {
            res.data.forEach((item, index) => {
              new_event_list.push({
                title: item.title,
                eventIndex: index, // 事件索引
                dealOrderName:
                  item.dealOrderName === ''
                    ? `事件续报${sectionToChinese(index)}`
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
            this.$nextTick(() => {
              this.initSwiper(); // 初始化swiper插件
            });
            this.clickEvent(this.eventList[0]);
          } else {
            this.eventList = []; // 清空列表
          }
        }

        this.findEventDealListCallback(eventId, res); // findEventDealList 接口回调
      });
    },
    /**
     * @description findEventDealList 接口回调
     */
    findEventDealListCallback(eventId, res) {
      if (res.errorcode === 0) {
        if (res.data.length > 0) {
          this.eventDealList = this.setEventDealList(res.data) || []; // 事件列表
          this.$nextTick(() => {
            this.$refs.reportEventRef.eventId = eventId;
            this.$refs.reportEventRef.eventDealList = this.eventDealList;
            this.$refs.reportEventRef.$refs.eventSwiperRef.eventDealList = this.eventDealList;
            this.$refs.reportEventRef.$refs.eventSwiperRef.clickEvent(this.eventDealList[0], 0);
          });
        } else {
          this.initEventDealData(); // 初始化数据
          this.eventDealList = []; // 清空列表
          this.$nextTick(() => {
            this.$refs.reportEventRef.eventId = eventId;
            this.$refs.reportEventRef.eventDealList = this.eventDealList;
            this.$refs.reportEventRef.$refs.eventSwiperRef.eventDealList = this.eventDealList;
          });
        }
      }
    },
    /**
     * @author hexinting
     * @date 2020-11-23
     * @lastData 2020-11-29
     * @description 激活当前点击事件
     */
    clickEvent(item) {
      this.fileList = [];
      //   this.ruleForm.eventTitle = item.title; // 0首报 续报点了谁,把它的标题给它就行
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
        }
        this.currentEventData = item; // 当前激活的事件数据
        this.currentEventDatas = (this.currentEventData.eventData);
        this.currentEventTime = this.currentEventData.eventCreateTime;
        // this.name=
        const data = {
          eventName: item.dealOrderName, // 事件名字 比如：事件首报，事件续报
          eventProcessId: item.eventData.eventProcessId, // 事件id
          eventDealId: item.eventDealId, // 事件续报id
        };
        bus.$emit('activeEvent', data); // 将当前激活的事件id和事件续报id 传给事件快报页面
        this.$store.commit('setActiveEvent', data); // 将当前激活的事件id和事件续报id 传给事件快报页面

        this.currentEventDatas.attachments.forEach((item) => {
          this.judgeFileType(item);
        });
      }
    },

    // 下载附件
    downloadFile(item) {
      const request = {
        method: 'get',
        url: `/eos/event/sum/downloadFile?fileName=${item.fileName}&filePath=${item.filePath}`,
        baseURL: window.SITE_CONFIG.fileupload,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          token: this.$cookie.get('token'),
        },
        responseType: 'arraybuffer',
      };
      $downloadFile(request);
      // const name = item.fileName;
      // const url = `${window.g.ApiUrl}/eos/file/getStream?id=${item.id}`;
      // const eleLink = document.createElement('a');
      // eleLink.download = name;
      // eleLink.href = url;
      // eleLink.click();
    },
    judgeFileType(file) {
      this.fileList.push({
        url: window.g.ApiUrl + file.filePath,
        fileName: file.fileName,
        filePath: file.filePath,
        id: file.id,
      });
    },
    /*
     * @lastEditors   :   qcx
     * @lastEditTime  :   2020/12/07 17:47:57
     * @descripttion     :   初始化swiper 插件
     */
    initSwiper() {
      const swiper = new this.$Swiper('.swiper-container', {
        // freeMode: false,
        freeMode: true, // 默认为false，普通模式：slide滑动时只滑动一格，并自动贴合wrapper，设置为true则变为free模式，slide会根据惯性滑动可能不止一格且不会贴合。
        freeModeSticky: true, // 使得freeMode也能自动贴合。
        freeModeMinimumVelocity: 1, // 触发FreeMode惯性的最小触摸速度（px/ms），低于这个值不会惯性滑动
        effect: 'coverflow', // slide的切换效果，默认为"slide"（位移切换），可设置为'slide'（普通切换、默认）,"fade"（淡入）"cube"（方块）"coverflow"（3d流）"flip"（3d翻转）
        slidesPerView: 'auto', // 设置slider容器能够同时显示的slides数量(carousel模式)
        slidesPerView: '4', // 设置slider容器能够同时显示的slides数量(carousel模式)
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
          nextEl: '.swiper-button-next', // 设置前进按钮的css选择器或HTML元素
          prevEl: '.swiper-button-prev', // 设置后退按钮的css选择器或HTML元素。
          disabledClass: 'my-button-disabled', // 前进后退按钮不可用时的类名。
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
      // 打开省厅事件
      console.log(row);
    },
    addMyEvent(row) {
      // 省厅事件添加到事件管理
      console.log(row);
    },
    advancedPriveFind() {
      console.log(1);
    },
    priveFind() {
      // 省厅事件查询
      const data = {
        orgCode: 'gdszyj-7a863389-84a5-4354-a1e1-46f2ce5b47af',
        startTime: this.myEventFormData.valueStr[0]
          ? this.myEventFormData.valueStr[0]
          : null,
        endTime: this.myEventFormData.valueStr[1]
          ? this.myEventFormData.valueStr[1]
          : null,
        limitCnt: this.myEventFormDataNumber,
      };
      const json = {
        paramJson: JSON.stringify(data),
      };
      this.$api.stSelectEvent(json).then((res) => {
        if (res.errorcode == 0) {
          const resData = JSON.parse(res.data);
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
        valueStr: '',
        searchInput: '',
        findTheRangeValue: 0,
        tableLoading: false,
      };
    },
    inputNumber() {
      if (this.myEventFormDataNumber > 100) {
        this.myEventFormDataNumber = '100';
        this.$message({
          message: '一次最多查询100条',
          type: 'warning',
        });
      }
      if (this.myEventFormDataNumber < 10) {
        this.myEventFormDataNumber = '10';
        this.$message({
          message: '一次最少查询10条',
          type: 'warning',
        });
      }
    },
    openDialog() {
      this.myEventFormData.tableLoading = true;
      const data = {
        orgCode: 'gdszyj-7a863389-84a5-4354-a1e1-46f2ce5b47af',
        startTime: this.myEventFormData.valueStr[0]
          ? this.myEventFormData.valueStr[0]
          : null,
        endTime: this.myEventFormData.valueStr[1]
          ? this.myEventFormData.valueStr[1]
          : null,
        limitCnt: this.myEventFormDataNumber,
      };
      const json = {
        paramJson: JSON.stringify(data),
      };
      this.$api.stSelectEvent(json).then((res) => {
        if (res.errorcode == 0) {
          const resData = JSON.parse(res.data);
          this.myEventFormData.shentinTableData = resData.data.disasterList;
          this.myEventFormData.tableLoading = false;
        } else {
          // //this.$message.error(res.msg)
        }
      });
    },
    openEventFind(key) {
      // 显示省厅事件查询
      this.isopenEvent = key == 1;
    },
    getHeight() {
      const h =
        document.documentElement.clientHeight || document.body.clientHeight;
      this.registerStyle.height = `${h - (68 + 205) + 58}px`;
    },
    // 事件全景
    eventPanorama() {
      if (!this.eventId) {
        this.$message({
          message: '请先选择事件再进行全景查看!',
          type: 'warning',
        });
        return;
      }
      this.panorameTitle = '事件全景';
      this.childTitle = this.RowData.title;
      this.panorameVisible = true;
      this.titleKey = new Date().getTime();
    },
    // 事件全景关闭时
    handleClose() {
      this.panorameVisible = false;
    },
    // 导出列表
    exportList() {
      if (this.eventId == '' || this.eventId == null) {
        this.$message({
          message: '请先选择事件在进行导出',
          type: 'warning',
        });
        return;
      }
      const Url = window.g.ApiUrl;
      let cType;
      switch (this.eventChainValue) {
        case '0':
          cType = 7;
          break;
        case '1':
          cType = 1;
          break;
        case '2':
          cType = 2;
          break;
        case '3':
          cType = 4;
          break;
        default:
          cType = 7;
          break;
      }
      // 注释原因：以下方法导出会出现乱码
      // const request = {
      //   method: 'get',
      //   baseURL: window.SITE_CONFIG.event,
      //   url: '/eos/register/exportEventDetail',
      //   headers: {
      //     token: this.$cookie.get('token'),
      //   },
      //   params: {
      //     eventId: this.eventId,
      //     cType,
      //     data: '',
      //     unit: '',
      //   },
      // };
      // this.$http(request).then((res) => {
      //   if (res) {
      //     const a = document.createElement('a');
      //     a.target = '_blank';
      //     a.href = window.URL.createObjectURL(new Blob([res.data]));
      //     a.download = '导出列表'
      //     a.click();
      //   }
      // });
      const request = {
        method: 'get',
        url: `/eos/register/exportEventDetail`,
        baseURL: window.SITE_CONFIG.event,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          token: this.$cookie.get('token'),
        },
        responseType: 'arraybuffer',
        params: {
          eventId: this.eventId,
          cType,
          data: '',
          unit: '',
        },
      };
      $downloadFile(request);
    },
    getfloatingBallData() {
      // 获取悬浮球的数量
      const data = {};
      this.$szApi.getUnhandled(data).then((res) => {
        if (res.errorcode == 0) {
          this.phoneValue = res.data.phone; // 悬浮球电话数量
          this.smsValue = res.data.sms; // 悬浮球短信数量
          this.faxValue = res.data.fax; // 悬浮球传真数量
          if (this.phoneValue + this.smsValue + this.faxValue > 99) {
            this.untreated = '99+';
          } else {
            this.untreated = this.phoneValue + this.smsValue + this.faxValue; // 悬浮球未处理数量
          }
        } else {
          // //this.$message.error(res.msg)
        }
      });
    },
    getEventLevenData() {
      // 获取事件等级
      const pcode = {
        pcode: 'emtlevel',
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
      const odiv = e.target; // 获取目标元素
      const x = e.clientX - odiv.offsetLeft;
      const y = e.clientY - odiv.offsetTop;
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
        odiv.style.left = `${left}px`;
        odiv.style.top = `${top}px`;
      };
      // 为了防止 火狐浏览器 拖拽阴影问题
      document.onmouseup = (e) => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
    getStateData() {
      // 获取办理状态
      const pcode = {
        pcode: 'event_over_status',
      };
      this.$szApi.getByPcodes(pcode).then((res) => {
        if (res.errorcode == 0) {
          this.handleTheStateData = res.data;
        } else {
          // //this.$message.error(res.msg)
        }
      });
    },

    /*
     * @param  {type}    :   item=>传真路径
     * @return {type}    :   return
     * @lastEditors   :   qcx
     * @lastEditTime  :   2021/01/29 17:33:40
     * @descripttion     :   打开总结报告中传真文件预览窗口
     */
    conclusionReport(item) {
      this.summaryReports = true;
      this.summaryTitle = '传真预览';
      this.previewReportUrl = item;
    },
    /*
     * @param  {type}    :   param
     * @return {type}    :   return
     * @lastEditors   :   qcx
     * @lastEditTime  :   2021/01/29 18:03:25
     * @descripttion     :    总结报告
     */
    conclusion() {
      // 总结报告需要拿已选择的数据
      const row = this.selectList[0];
      this.RowData = row;
      this.eventId = this.RowData.id;
      // 禅道：7354 date：2020-10-16 author:hexinting
      if (this.RowData.statusCode === '0') {
        this.$message({
          message: '事件正在办理中，请完结后进行总结~',
        });
        return;
      }
      if (
        this.RowData.id == '' ||
        this.RowData.id == null ||
        this.eventId == null
      ) {
        this.$message({
          message: '请先选择事件',
          type: 'warning',
        });
        return;
      }
      this.getFinalReport();
      // const Url = window.g.serveEBS;
      // const downloadYearUrl = `${Url}/emergency/dispatch/event/previewEventReportPdf?eventId=${this.eventId}`;
      // this.$http({
      //   method: 'post',
      //   headers: {
      //     'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      //   },
      //   url: downloadYearUrl,
      // }).then((res) => {
      //   if (res.data.errorcode == 0) {
      //     const { data } = res.data;
      //     this.pdfData = data.previewPath;
      //     this.conclusionReport(this.pdfData);
      //   } else if (res.errorcode == 500) {
      //     // 传真文件不存在
      //     this.$message.error(res.msg);
      //     this.previewReportUrl = '';
      //   }
      // });
    },
    /**
     * @description 获取总结报告
     */
    getFinalReport() {
      const URL = window.SITE_CONFIG['event'];
      this.$http({
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        url: `${URL}/eos/event/eventSummaryReport`,
        params: {
          eventId: this.eventId,
        },
      })
        .then((res) => {
          if (res.data.errorcode == 0) {
            const { data } = res.data;
            this.pdfData = window.SITE_CONFIG['fileupload'] + data.path;
            this.conclusionReport(this.pdfData);
          } else if (res.data.errorcode === 500) {
            // 传真文件不存在
            this.$message.error(res.data.msg);
            this.previewReportUrl = '';
            this.$message.error(
              `获取总结报告失败，错误代码：${res.data.errorcode}，错误信息：${res.data.msg}`,
            );
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch((error) => {
          this.message.error(
            `获取总结报告失败，错误代码：${
              error.code || error.errorcode
            }，错误信息：${error.msg || error.message}`,
          );
        });
    },
    /**
     * @description: //更改  打开联系人弹窗
     * @author: qcx
     * @lastEditor : qcx
     * @updateTime : 2021-1-29 18:03
     * @param {*} type : //显示联系人类型
     * @return {*}
     */
    expressPushHandle(type) {
      if (this.pdfData) {
        this.expressPushVisible = true;
        this.$nextTick(() => {
          this.expressPushData.expressPushPDFUrl = this.pdfData;
        });
      } else {
        this.$message.warning('PDF路径不存在');
      }
    },
    /**
     * @description: 关闭信息报送弹窗
     * @author: qcx
     * @lastEditor : qcx
     * @updateTime : 2021-1-29 18:03
     * @param {*}
     * @return {*}
     */
    handleCloses() {
      this.expressPushVisible = false;
    },
    /**
     * @description 获取事件类别
     */
    getCaseData() {
      this.$api.getTree({}).then((res) => {
        if (res.errorcode === 0) {
          this.eventCategoryData = res.data;
          const gettree = function(el) {
            for (let i = 0; i < el.length; i += 1) {
              if (el[i].children.length === 0) {
                el[i].children = undefined;
              } else {
                gettree(el[i].children);
              }
            }
          };
          gettree(this.eventCategoryData);
        }
      });
      // const caseData = {};
      // this.$szApi.getTopCase(caseData).then((res) => {
      //   if (res.errorcode == 0) {
      //     this.eventCategoryData = res.data;
      //   } else {
      //     // //this.$message.error(res.msg)
      //   }
      // });
    },
    getTableListData() {
      // 获取事件列表
      let dateTimeStr;
      let dateTimeEnd;
      if (this.valueStr == [] || this.valueStr == null || this.valueStr == '') {
        dateTimeStr = '';
        dateTimeEnd = '';
      } else {
        dateTimeStr = `${this.valueStr[0]} 00:00:00`;
        dateTimeEnd = `${this.valueStr[1]} 23:59:59`;
      }
      const ipData = {
        size: this.pageSize,
        page: this.currentPage,
        name: this.searchInput,
        beginTime: dateTimeStr,
        endTime: dateTimeEnd,
        levelId: this.eventLevelValue,
        topCaseClassId: this.eventCategoryValue.length > 0 ? this.eventCategoryValue[this.eventCategoryValue.length - 1] : '',
        status: this.handleTheStateValue,
        reportType: this.linkageValue === '关' ? 0 : 5,
        includeLowerPlatform: 0, // 0查本级，1查本级和下级，2查下级
      };
      this.$szApi.listBy(ipData).then((res) => {
        if (res.errorcode == 0) {
          this.tableData = res.data.data;
          if (this.tableData.lenght != 0) {
            this.findEventDealList(this.tableData[0].id); // 默认加载表格数据时,将id传给轮播图
            this.tableRowClick(this.tableData[0]);
          }
          this.total = res.data.totalElements;
          const data = {
            name: this.searchInput,
            beginTime: dateTimeStr,
            endTime: dateTimeEnd,
            levelId: this.eventLevelValue,
            topCaseClassId: this.eventCategoryValue.length > 0 ? this.eventCategoryValue[this.eventCategoryValue.length - 1] : '',
            status: this.handleTheStateValue,
            reportType: this.linkageValue == '关' ? 0 : 5,
            includeLowerPlatform: 0, // 0查本级，1查本级和下级，2查下级
          };
          this.$szApi.getEventStatistics(data).then((res) => {
            if (res.errorcode == 0) {
              this.eventNumber = this.total; // 事件总数
              this.eventWas = res.data.injured; // 受伤人数
              this.eventMissing = res.data.missing; // 失踪人数
              this.eventDie = res.data.death; // 死亡人数
              // this.eventAffect=res.data.
            } else {
              // //this.$message.error(res.msg)
            }
          });
        } else {
          // //this.$message.error(res.msg)
        }
      });
    },
    eventChain(val) {
      this.itemBox = [];
      // 事件链检测选择的是哪一个
      if (this.eventId == null || this.eventId == '') {
        this.$message({
          message: '请先选择事件',
          type: 'warning',
        });
        return;
      }
      switch (this.eventChainValue) {
        case '0':
          this.getselectAllList();
          break;
        case '1':
          this.getFaxList();
          break;
        case '2':
          this.getPhoneList();
          break;
        case '3':
          this.getSmsList();
          break;
        default:
          break;
      }
    },

    tableRowClick(row) {
      this.eventChainValue = '0';
      // 表格行点击事件
      this.RowData = row;
      this.eventId = row.id;
      this.findEventDealList(row.id);
      this.fileList = [];
      // ,当点击表格时,触发轮播图
      const type = this.eventChainValue;
      this.eventChain('0'); // 这是默认加载第一个啊
    },

    /**
     * @description 数据格式化
     */
    formatterData(data) {
      this.itemBox = data;
      setTimeout(() => {
        this.itemBox.forEach((item, index) => {
          if (item.type === 'phone') {
            this.setAudioAttribute(`#content_del${index} audio`, item.url);
          }
        });
      }, 100);
      this.$refs.eventTimeSeries.formatterData(data);
    },

    /**
     * @description 设置语音的属性
     */
    setAudioAttribute(selector, url) {
      const audioDom = document.querySelectorAll(selector)[0];
      audioDom.setAttribute('src', `${window.SITE_CONFIG.cloudUrl}${url}`);
      const _that = this;
      // 设置图片路径 用require()转换成base64
      const play = require('../../../../static/audioControls/play.png');
      const stop = require('../../../../static/audioControls/stop.png');
      const TurnTheText = require('../../../../static/audioControls/TurnTheText.png');
      const tailor = require('../../../../static/audioControls/tailor.png');
      const dow = require('../../../../static/audioControls/dow.png');
      const obj = {
        play,
        stop,
        TurnTheText,
        tailor,
        dow,
      };
      const type = 'yangZhouEventRegistration';
      const audio = new AudioControls(
        audioDom.parentNode,
        audioDom.src,
        obj,
        false,
        _that.TurnTheText,
        _that.tailor,
        this.RowData,
        // _that,
        type,
      );
      //   _that.audioEventList[index] = audio;
      audio.addIncident('这个用来判断是否显示下载控件');
    },

    /**
     * @description 根据事件获取所有历史
     */
    getselectAllList() {
      this.itemBox = [];
      const data = {
        eventId: this.eventId,
      };
      this.$szApi
        .selectAll(data)
        .then((res) => {
          if (res.errorcode === 0) {
            this.formatterData(res.data);
          } else {
            this.$message.error(
              `获取事件时序记录失败，错误代码：${res.errorcode}，错误信息：${res.msg}`,
            );
          }
        })
        .catch((error) => {
          // this.$message.error(
          //   `获取事件时序记录失败，错误代码：${error.errorcode}，错误信息：${error.msg}`,
          // );
        });
    },

    /**
     * @description 获取电话历史
     */
    getPhoneList() {
      this.itemBox = [];
      const data = {
        eventId: this.eventId,
        type: 'phone',
      };
      this.$szApi
        .selectHistory(data)
        .then((res) => {
          if (res.errorcode === 0) {
            this.formatterData(res.data);
          } else {
            this.$message.error(
              `获取事件时序记录失败，错误代码：${res.errorcode}，错误信息：${res.msg}`,
            );
          }
        })
        .catch((error) => {
          // this.$message.error(
          //   `获取事件时序记录失败，错误代码：${error.errorcode}，错误信息：${error.msg}`,
          // );
        });
    },

    getSmsList() {
      // 获取短信历史
      const data = {
        eventId: this.eventId,
        type: 'sms',
      };
      this.$szApi.selectHistory(data).then((res) => {
        if (res.errorcode == 0) {
          this.itemBox = [];
          this.itemBox = res.data;
          this.formatterData(res.data);
        } else {
        }
      });
    },
    getFaxList() {
      // 获取传真历史
      const data = {
        eventId: this.eventId,
        type: 'fax',
      };
      this.$szApi.selectHistory(data).then((res) => {
        if (res.errorcode == 0) {
          this.itemBox = [];
          this.itemBox = res.data;
          this.formatterData(res.data);
        } else {
        }
      });
    },
    eventFind() {
      // 查找
      this.listStaet = '查找';
      this.currentPage = 1;
      this.getTableListData();
    },
    advancedEventFind() {
      // 高级查找
      this.listStaet = '高级查找';
      this.outerVisible = true;
      this.title = '高级查找';
      const pcode = {
        pcode: 'emtlevel',
      };
      this.$szApi.getByPcodes(pcode).then((res) => {
        if (res.errorcode == 0) {
          this.rankSelect = res.data;
        } else {
        }
      });
    },
    // 关闭前的回调
    beforeClose() {
      if (
        this.ruleForm.submittedUnit == '' ||
        this.ruleForm.submittedUnit == null
      ) {
        this.UnitId = [];
      }
      if (
        this.ruleForm.submittedType == '' ||
        this.ruleForm.submittedType == null
      ) {
        this.eventTypeId = [];
      }
    },
    submittedSelect() {
      // 高级查找选择报送单位
      this.coreTitle = '选择单位';
      this.typeData = '报送单位';
      this.innerVisible = true;
      const getTree = function (data) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].children.length === 0) {
            data[i].children = undefined;
          } else {
            getTree(data[i].children);
          }
        }
      };
      this.$api.topUnitTree().then((res) => {
        if (res.errorcode === 0) {
          if (res.data) {
            this.reportingUnitData = res.data;
            getTree(this.reportingUnitData);
            this.$refs.treeSearch.dataUpdating(
              this.reportingUnitData,
              this.typeData,
            );
          }
        }
      });
    },
    eventSelect() {
      // 高级查找选择事件类型
      this.coreTitle = '选择类型';
      this.typeData = '选择类型';
      this.innerVisible = true;
      const data = {};
      this.$szApi.getTree(data).then((res) => {
        if (res.errorcode == 0) {
          this.$refs.treeSearch.dataUpdating(res.data, this.typeData);
        } else {
        }
      });
    },
    lookForConfirmation() {
      // 高级查找确认查找
      if (this.outerVisible === true) {
        this.currentPage = 1;
      }
      const deptArr = [];
      deptArr.push(this.ruleForm.submittedUnit);
      const data = {
        size: this.pageSize,
        page: this.currentPage,
        name: this.ruleForm.eventTitle,
        beginTime: `${this.ruleForm.beginTime} 00:00:00`,
        endTime: `${this.ruleForm.endTime} 23:59:59`,
        depts: deptArr,
        topCaseClassId: this.eventTypeId[0],
        levelId: this.ruleForm.rankEvent,
        includeLowerPlatform: 0, // 0查本级，1查本级和下级，2查下级
      };
      this.$szApi.listBy(data).then((res) => {
        if (res.errorcode == '0') {
          this.outerVisible = false;
          this.tableData = res.data.data;
          this.total = res.data.totalElements;
          if (this.tableData.lenght !== 0) {
            this.findEventDealList(this.tableData[0].id); // 默认加载表格数据时,将id传给轮播图
            this.tableRowClick(this.tableData[0]);
          }
          const data2 = {
            name: this.ruleForm.eventTitle,
            beginTime: `${this.ruleForm.beginTime} 00:00:00`,
            endTime: `${this.ruleForm.endTime} 23:59:59`,
            levelId: this.ruleForm.rankEvent,
            topCaseClassId: this.eventTypeId[0],
            status: '',
            includeLowerPlatform: 0, // 0查本级，1查本级和下级，2查下级
          };
          this.$szApi.getEventStatistics(data2).then((res2) => {
            if (res2.errorcode === 0) {
              this.eventNumber = this.total; // 事件总数
              this.eventWas = res2.data.injured; // 受伤人数
              this.eventMissing = res2.data.missing; // 失踪人数
              this.eventDie = res2.data.death; // 死亡人数
            }
          });
        }
      });
    },
    affirmDialog(filterText, filterId, typeData) {
      // 高级内层查找确认
      switch (typeData) {
        case '报送单位':
          if (
            filterText == '' ||
            filterText == null ||
            filterId == '' ||
            filterId == null
          ) {
            this.$message({
              message: '请选择报送单位',
              type: 'warning',
            });
          } else {
            this.UnitId = [];
            this.UnitId.push(filterId);
            this.ruleForm.submittedUnit = filterText;
            this.innerVisible = false;
          }
          break;
        case '选择类型':
          if (
            filterText == '' ||
            filterText == null ||
            filterId == '' ||
            filterId == null
          ) {
            this.$message({
              message: '请选择事件类型',
              type: 'warning',
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
      // 高级内层查找取消
      this.innerVisible = false;
    },
    changeVal() {
      // 高级查找事件标题
    },
    /**
     * @lastEditor QCX
     * @lastDate 2020-11-11
     * @description 删除事件
     */
    rowDelect() {
      if (this.selectList.length == 0) {
        this.$message({
          message: '请先选中事件再进行删除!',
          type: 'warning',
        });
      } else {
        this.isDeleteShow = true;
        this.reportTitle = '删除事件';
        this.SubTitles = '此操作将删除所选事件,是否继续?';
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
      const ids = [];
      for (let i = 0; i < this.selectList.length; i++) {
        ids.push(this.selectList[i].id);
      }
      const data = {
        id: ids,
      };
      if (ids.length === 0) {
        this.$message({
          message: '未选择事件',
          type: 'danger',
        });
        this.isDeleteShow = false;
        this.getTableListData();
        return;
      }
      this.$szApi.eventDeleteList(data).then((res) => {
        if (res.errorcode === 0) {
          this.$message({
            message: '删除成功!',
            type: 'danger',
          });
          this.getTableListData();
          this.isDeleteShow = false;
        } else if (this.listStaet === '高级查找') {
          this.lookForConfirmation();
        }
      });
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
      this.selectList.splice(i, 1);
    },

    // 计算时间的方法
    GetDateStr(AddDayCount) {
      const dd = new Date();
      dd.setDate(dd.getDate() + AddDayCount); // 获取AddDayCount天后的日期
      const y = dd.getFullYear();
      const m =
        dd.getMonth() + 1 < 10 ? `0${dd.getMonth() + 1}` : dd.getMonth() + 1; // 获取当前月份的日期，不足10补0
      const d = dd.getDate() < 10 ? `0${dd.getDate()}` : dd.getDate(); // 获取当前几号，不足10补0
      return `${y}-${m}-${d}`;
    },
    intervalDetection1(val) {
      // 检测查找区间
      const date = new Date(); // 获取当前日期
      let nowMonth = date.getMonth() + 1;
      let strDate = date.getDate();
      const seperator = '-'; // 添加分隔符“-”
      if (nowMonth >= 1 && nowMonth <= 9) {
        // 对月份进行处理，1-9月在前面添加一个“0”
        nowMonth = `0${nowMonth}`;
      }
      if (strDate >= 0 && strDate <= 9) {
        // 对月份进行处理，1-9号在前面添加一个“0”
        strDate = `0${strDate}`;
      }
      // 拼接字符串，得到一个格式为(yyyy-MM-dd)的日期
      const curTime =
        date.getFullYear() + seperator + nowMonth + seperator + strDate;
      let startDate;
      let seventDate;
      let fourteenDate;
      let thirtyDate;
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
          startDate = this.GetDateStr(-2); // 获取到的三天前的日期
          this.myEventFormData.valueStr = [];
          this.myEventFormData.valueStr.push(startDate);
          this.myEventFormData.valueStr.push(curTime);
          break;
        case 3:
          this.timeDateVal = true;
          seventDate = this.GetDateStr(-6); // 获取到的七天前的日期
          this.myEventFormData.valueStr = [];
          this.myEventFormData.valueStr.push(seventDate);
          this.myEventFormData.valueStr.push(curTime);
          break;
        case 4:
          this.myEventFormData.timeDateVal = true;
          fourteenDate = this.GetDateStr(-14); // 获取到的十五天前的日期
          this.myEventFormData.valueStr = [];
          this.myEventFormData.valueStr.push(fourteenDate);
          this.myEventFormData.valueStr.push(curTime);
          break;
        case 5:
          this.myEventFormData.timeDateVal = true;
          thirtyDate = this.GetDateStr(-29); // 获取到的三十天前的日期
          this.myEventFormData.valueStr = [];
          this.myEventFormData.valueStr.push(thirtyDate);
          this.myEventFormData.valueStr.push(curTime);
          break;
        default:
          break;
      }
    },
    intervalDetection(val) {
      // 检测查找区间
      const date = new Date(); // 获取当前日期
      let nowMonth = date.getMonth() + 1;
      let strDate = date.getDate();
      const seperator = '-'; // 添加分隔符“-”
      if (nowMonth >= 1 && nowMonth <= 9) {
        // 对月份进行处理，1-9月在前面添加一个“0”
        nowMonth = `0${nowMonth}`;
      }
      if (strDate >= 0 && strDate <= 9) {
        // 对月份进行处理，1-9号在前面添加一个“0”
        strDate = `0${strDate}`;
      }
      // 拼接字符串，得到一个格式为(yyyy-MM-dd)的日期
      const curTime =
        date.getFullYear() + seperator + nowMonth + seperator + strDate;
      let startDate;
      let seventDate;
      let fourteenDate;
      let thirtyDate;
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
          startDate = this.GetDateStr(-2); // 获取到的三天前的日期
          this.valueStr = [];
          this.valueStr.push(startDate);
          this.valueStr.push(curTime);
          break;
        case 3:
          this.timeDateVal = true;
          seventDate = this.GetDateStr(-6); // 获取到的七天前的日期
          this.valueStr = [];
          this.valueStr.push(seventDate);
          this.valueStr.push(curTime);
          break;
        case 4:
          this.timeDateVal = true;
          fourteenDate = this.GetDateStr(-14); // 获取到的十五天前的日期
          this.valueStr = [];
          this.valueStr.push(fourteenDate);
          this.valueStr.push(curTime);
          break;
        case 5:
          this.timeDateVal = true;
          thirtyDate = this.GetDateStr(-29); // 获取到的三十天前的日期
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
      if (this.listStaet == '高级查找') {
        this.lookForConfirmation();
      } else {
        this.getTableListData();
      }
    },
    rowOpenEvent() {
      if (this.selectList.length === 1) {
        this.RowData = { ...this.selectList[0] };
      }
      if (
        this.RowData.levelId !== 0 &&
        this.RowData.levelId !== '' &&
        this.RowData.levelId !== '' &&
        this.RowData.levelId !== 0
      ) {
        // 已经启动过预案
        this.$store.commit('setTurnOnEmergencyResponse', true);
      } else {
        this.$store.commit('setTurnOnEmergencyResponse', false);
      }
      if (this.RowData.id == '' || this.RowData.id == null) {
        this.$message({
          message: '请先选择事件',
          type: 'warning',
        });
      } else {
        sessionStorage.setItem('eventTitle', this.RowData.title); // 切换事件后缓存的展示标题也要改
        sessionStorage.setItem('newID', this.RowData.id);

        const eventIdTest = sessionStorage.getItem('newID');
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
      // 处置事件
      // let eventID=sessionStorage.getItem('newID');
      if (
        this.RowData.levelId !== 0 &&
        this.RowData.levelId !== '' &&
        this.RowData.levelId !== '' &&
        this.RowData.levelId !== 0
      ) {
        // 已经启动过预案
        this.$store.commit('setTurnOnEmergencyResponse', true);
      } else {
        this.$store.commit('setTurnOnEmergencyResponse', false);
      }
      if (this.RowData.id == '' || this.RowData.id == null) {
        this.$message({
          message: '请先选择事件',
          type: 'warning',
        });
      } else {
        // if(this.IsYangZhouProject) {
        if (this.RowData.statusCode === '1') {
          const eventID = this.RowData.id;
          this.$confirm('您即将激活该事件，是否确认激活？', '提示', {
            customClass: 'message-logout',
            confirmButtonClass: 'confirm-button-style',
            cancelButtonClass: 'cancel-button-style',
            confirmButtonText: '确认激活',
            cancelButtonText: '取消',
            type: 'warning',
            closeOnClickModal: false,
          }).then(() => {
            const data = {
              eventId: eventID,
            };
            this.$api.eventActive(data).then((res) => {
              if (res.errorcode == '0') {
                this.$message({
                  message: '事件激活成功!',
                  type: 'success',
                });
                this.RowData.status = '待确认';
                this.RowData.statusCode = '0';
                sessionStorage.setItem('eventTitle', this.RowData.title); // 切换事件后缓存的展示标题也要改
                sessionStorage.setItem('newID', this.RowData.id);
                const eventIdTest = sessionStorage.getItem('newID');
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
            message: '事件未确认，不能激活',
            type: 'warning',
          });
        }
        // } else {
        //   sessionStorage.setItem("eventTitle", this.RowData.title); // 切换事件后缓存的展示标题也要改
        //   sessionStorage.setItem("newID", this.RowData.id);
        //   let eventIdTest = sessionStorage.getItem("newID");
        //   this.$router.push({
        //     path: this.pathname,
        //     query: { linkageValue: this.linkageValue },
        //   });
        // }
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
      if (this.RowData.id == '' || this.RowData.id == null) {
        this.$message({
          message: '请先选择事件',
          type: 'warning',
        });
        return;
      }
      const eventID = this.RowData.id;
      this.$confirm('您即将完结该事件，是否确认完结？', '提示', {
        customClass: 'message-logout',
        confirmButtonClass: 'confirm-button-style',
        cancelButtonClass: 'cancel-button-style',
        confirmButtonText: '确认完结',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
      })
        .then(() => {
          const data = {
            eventId: eventID,
          };
          // 注释原因：“eventEnd”接口完结事件会新增一条空的续报.导致查询出现空续报数据，改为“yzEnd”。author：hexinting date:20210113
          this.$api.yzEnd(data).then((res) => {
            if (res.errorcode == '0') {
              this.$message({
                message: '事件完结成功!',
                type: 'success',
              });
              this.RowData.status = '已确认';
              this.RowData.statusCode = '1';
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消完结',
          });
        });
    },
    itemClick(item, index) {
      // 事件链循环每一个的点击
      this.changeRed = index;
      this.itemClickData = item;
      this.itemClickDataRemark = '';
      this.itemClickDataRemark = item.remark;
      let faxData;
      switch (item.type) {
        case 'fax':
          if (item.url.search('pdf') === -1) {
            this.$http({
              baseURL: window.SITE_CONFIG['event'],
              url: '/fax/previewFax',
              method: 'get',
              params: this.$http.adornParams({
                attachmentId: data.data.id,
              }),
            }).then(({ data }) => {
              console.log('/event/fax/previewFax', data);
              if (data.errorcode === 0) {
                this.previewUrl = `${window.SITE_CONFIG.cloudUrl}${data.data}`;
                this.faxCard(item);
              } else if (data.errorcode === 500) {
                // 传真文件不存在
                this.$message.error(data.msg);
                this.previewUrl = '';
              }
            });
          } else {
            this.previewUrl = `${window.SITE_CONFIG.cloudUrl}${item.url}`;
            this.faxCard(item);
          }
          // faxData = {
          //   attachmentId: item.id,
          // };
          // this.$szApi.previewFax(faxData).then((res) => {
          //   if (res.errorcode == 0) {
          //     this.previewUrl = `${window.SITE_CONFIG.cloudUrl}data.data`;
          //     this.faxCard(item);
          //   } else if (res.errorcode == 500) {
          //     // 传真文件不存在
          //     this.$message.error(res.msg);
          //     this.previewUrl = '';
          //   }
          // });
          break;
        case 'phone':
          break;
        case 'sms':
          break;
        default:
          break;
      }
    },
    phoneClickDispose(item, index) {
      // 事件链循环每一个处置的点击,电话处置按钮
      this.dealTitle = this.RowData.title;
      this.reportDescription = this.RowData.reportDescription;
      this.disposalType = '电话';
      this.continueItem = item;
      this.itemData = item;
      this.manageTitle = '融合通信'; // 处置弹窗标题
      this.manageDialog = true; // 是否弹出
      this.manageDialogRefresh = false;
      this.$nextTick(() => {
        this.manageDialogRefresh = true;
      });
    },
    faxClickDispose(item, index) {
      // 事件链循环每一个处置的点击,传真处置按钮
      this.dealTitle = this.RowData.title;
      this.reportDescription = this.RowData.reportDescription;
      this.disposalType = '传真';
      this.continueItem = item;
      this.itemData = item;
      this.manageTitle = '融合通信'; // 处置弹窗标题
      this.manageDialog = true; // 是否弹出
      this.manageDialogRefresh = false;
      this.$nextTick(() => {
        this.manageDialogRefresh = true;
      });
    },
    smsClickDispose(item, index) {
      // 事件链循环每一个处置的点击,短信处置按钮
      // this.dealDialog=true
      this.dealTitle = this.RowData.title;
      this.reportDescription = this.RowData.reportDescription;
      this.disposalType = '短信';
      this.continueItem = item;
      this.itemData = item;
      this.manageTitle = '融合通信'; // 处置弹窗标题
      this.manageDialog = true; // 是否弹出
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
      // 处置弹窗取消关闭
      this.dealDialog = false;
    },
    dispositionConfirm() {
      // 处置弹窗确认关闭
      this.dealDialog = false;
    },
    dispositionCloseDialog() {
      // 处置弹窗叉叉关闭
      this.dealDialog = false;
    },
    /** *
     * 下面是新的处置模块的操作
     * */
    manageCloseDialog() {
      // 处置弹窗叉叉关闭
      this.manageDialog = false;
    },
    /** 事件链关联变更
     * * */
    associatedChanges(item, index) {
      // this.associatedRefresh=false;
      // this.$nextTick(()=>{
      //   this.associatedRefresh=true
      // })
      // this.associatedChangesModelDialog=true
    },
    associatedManageCloseDialog() {
      // 关联变更叉叉取消
      this.associatedChangesModelDialog = false;
    },
    associatedClose() {
      // 关联变更取消
      this.associatedChangesModelDialog = false;
    },
    associatedAffirm(eventId) {
      // 关联变更确认
      if (eventId == null || eventId == '') {
        this.$message({
          message: '请选择需要更改关联的事件',
          type: 'warning',
        });
        return;
      }
      this.associatedChangesModelDialog = false;
    },
    /** 悬浮球点击操作
     * */
    dblclickDialog() {
      // 悬浮球点击未处理 默认打开传真模块
      this.allModelTitle = '信息处置';
      this.suspendModelDialog = true;
      this.$refs.allModelDialog.activeAllModel = '传真';
      this.$refs.allModelDialog.leftTabsType = '传真';
    },
    allClickPhoneDialog() {
      // 悬浮球点击未处理 电话模块
      this.allModelTitle = '信息处置';
      this.suspendModelDialog = true;
      this.$refs.allModelDialog.activeAllModel = '电话';
      this.$refs.allModelDialog.leftTabsType = '电话';
    },
    allClickSmsDialog() {
      // 悬浮球点击未处理 短信模块
      this.allModelTitle = '信息处置';
      this.suspendModelDialog = true;
      this.$refs.allModelDialog.activeAllModel = '短信';
      this.$refs.allModelDialog.leftTabsType = '短信';
    },
    allModelCloseDialog() {
      // allModel叉叉关闭
      this.suspendModelDialog = false;
    },

    // 删除事件关联
    deleteEvents(item, index) {
      this.$confirm('删除与该事件的关联?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          const data = {
            id: item.id,
            eventId: 0,
            type: item.type,
          };
          this.$api.relateEvent(data).then((res) => {
            if (res.errorcode == 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
              });
              const type = this.eventChainValue;
              switch (type) {
                case '0':
                  this.getselectAllList();
                  break;
                case '1':
                  this.getFaxList();
                  break;
                case '2':
                  this.getPhoneList();
                  break;
                case '3':
                  this.getSmsList();
                  break;
                default:
                  break;
              }
              this.itemClickData = '';
              this.itemClickDataRemark = '';
              this.changeRed = -1;
            } else {
              // this.$message.error(res.msg)
            }
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
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
          message: '请先选中事件再进行上报!',
          type: 'warning',
        });
      } else {
        this.isShow = true;
        (this.reportTitle = '上报事件'),
        (this.SubTitles = '是否将所选事件上报省厅?');
        this.reportBtn()
      }
    },
    /**
     * @lastEditor QCX
     * @lastDate 2020-11-11
     * @description 扬州->确定上报事件
     */
    reportBtn() {
      const ids = [];
      for (let i = 0; i < this.selectList.length; i++) {
        ids.push(this.selectList[i].id);
      }
      const data = {
       eventIdList: ids,
      };
      if (ids.length == 0) {
        this.$message({
          message: '未选择事件',
          type: 'danger',
        });
        this.isShow = false;
        this.getTableListData();
        return;
      }
      this.$szApi.reportEmergency(data).then((res) => {
        if (res.errorcode == '0') {
          this.$message.success('上报成功！');
          this.isShow = false;
        }else{
          this.$message.warning(res.msg);
        }
        this.getTableListData();
      });

      this.getTableListData();
    },
    summaryReport() {
      this.summaryReport = true;
    },
  },
};
</script>

<style>
/* authorName qinjiaqi */
/* 事件完结弹出框样式 */
.message-logout {
  width: 443px;
  height: 150px;
  background: inherit;
  background-color: rgba(255, 255, 255, 1);
  box-sizing: border-box;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(188, 188, 188, 1);
  border-radius: 5px;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
  box-shadow: none;
}

.el-message-box__btns {
  text-align: center !important;
}

.el-message-box__btns {
  padding: 10px 20px 10px !important;
  text-align: center !important;
}

.el-message-box {
  padding-bottom: 0px !important;
}

/* 确认按钮样式 */
.confirm-button-style {
  background: inherit;
  background-color: rgba(0, 153, 255, 1);
  width: 100px;
  height: 34px;
  float: center;
  border: none;
  border-radius: 5px;
}

/* 取消按钮样式 */
.cancel-button-style {
  width: 100px;
  height: 34px;
  float: right;
  box-sizing: border-box;
  border-width: 1px;
  background-color: rgba(255, 255, 255, 1);
  border-color: rgba(121, 121, 121, 1);
  border-radius: 5px;
  margin-right: 70px;
  text-align: center;
}
</style>

<style scoped>
.eventList {
  width: 100%;
  height: 30px;
  /* margin-bottom: 10px; */
  line-height: 30px;
  background-color: cornflowerblue;
  color: white;
  font-size: 12px;
  text-align: center;
}
.colCalss {
  /* padding: 0 0 0 10px; */
}
.colCalss:nth-child(2) {
  border-right: 1px solid #e6e6e6;
  margin-right: 10px;
  background: #fff;
}
.colCalss:last-child {
  background: #fff;
}
>>> .el-row {
  display: flex;
}
>>> .el-card__body {
  padding: 10px;
}
.cardCalss {
  min-height: 720px;
  height: calc(100% - 30px);
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
}
.death {
  margin-right: 30px;
}
.reportDescription {
  /* width: 500px; */
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
.selectHistory >>> .el-dialog__body {
  padding: 3px 20px;
}
.selectHistory .el-col-4 {
  width: 70px;
  padding: 0 !important;
  line-height: 25px;
}
.selectHistory .contenTitle {
  width: 70px;
  padding: 0 !important;
  line-height: 25px;
}
.currentContent .el-row {
  width: 100%;
}
.selectHistory >>> .el-dialog__header {
  /* padding: 0px; */
}
.iconCalssCard i {
  font-size: 20px;
}
.floatingBall {
  position: absolute;
  width: 120px;
  height: 120px;
  background-image: url('../../../../static/img/big.png');
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
  /* padding: 12px 10px 0 10px; */
  padding: 0 6px;
  width: 100%;
  box-sizing: border-box;
}

.event_list {
  margin-right: 15px;
}

/* .event_list .item_wrap{
  width: 100%;
} */
.event_list .item_wrap,
.event_list .swiper-slide {
  /* width: 132px; */
  /* width: 25%; */
  width: 122px !important;
  height: 42px;
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
  width: 32px;
  height: 37px;
  position: absolute;
  right: 0;
  background: url('/@/../static/img/Communihistory/event_bg2.svg');
  background-repeat: no-repeat;
  background-size: 100%;
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
  top: 40px;
  --swiper-navigation-color: #ffffff; /* 单独设置按钮颜色 */
  --swiper-navigation-size: 30px; /* 设置按钮大小 */
  background: url(./components/assets/left.png) no-repeat;
  background-position: 50% 50% !important;
}

.event_list_wrap .swiper-container {
  padding: 18px 24px 11px 24px !important;
  width: 100%;
  box-sizing: border-box;
}

/* 三角形-左边 */
/* .event_list_wrap .swiper-button-prev {
  position: absolute;
  width: 0;
  height: 0;
  border-right: 9px solid #999999;
  border-left: 9px solid transparent;
  border-top: 9px solid transparent;
  border-bottom: 9px solid transparent;
} */

.event_list_wrap .swiper-button-next {
  right: 0 !important;
  top: 40px;
  --swiper-navigation-color: #ffffff; /* 单独设置按钮颜色 */
  --swiper-navigation-size: 30px; /* 设置按钮大小 */
  background: url(./components/assets/right.png) no-repeat;
  background-position: 50% 50% !important;
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
  /* opacity: 0.2; */
}
.event_list_wrap .swiper-button-next:after,
.swiper-button-prev:after {
  display: none;
}
.event_list_wrap .swiper-slide {
  margin-right: 11px;
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
  width: 100%;
}
.event-params-container {
  display: flex;
  align-content: flex-start;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.event-params-container .event-param {
  padding: 0 10px;
}
.header {
  margin-top: 10px;
}
.submit_btn {
  margin-left: -1px;
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
  content: '';
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
  content: '';
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
  white-space: nowrap;
}
.currentContent {
  display: flex;
}
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
  padding-right: 14px;
  box-sizing: border-box;
}
.contentMsg {
  line-height: 25px;
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

/* 信息报送 */
.apprvoveData {
  height: 40px !important;
  margin-top: -5px !important;
  display: flex;
  justify-content: flex-end;
}
.eventInfoDiv {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  margin: 0 auto;
}
.eventInfoItem img {
  width: 28px;
  height: 32px;
}
.eventInfoItem {
  width: 220px;
  height: 73px;
  background: #f9f9fa;
  border-radius: 4px;
  margin: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.eventInfoItem__right {
  margin-left: 15px;
}
.eventInfoItem__right__num {
  font-size: 22px;
  font-weight: 500;
  color: #666666;
}
.eventInfoItem__right__bot {
  font-size: 17px;
  color: #999999;
}
/* 2021-06-21新设计 start */
.eventInfoDiv__new {
  width: 100%;
  height: 73px;
  border-radius: 4px;
  margin-top: 10px;
  padding: 0 14px;
  box-sizing: border-box;
}
.eventInfoDiv__new .eventInfoDiv__new__list {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 2%;
  background: #f9f9fa;
}
.eventInfoDiv__new .eventInfoDiv__new__item {
  height: 100%;
  padding: 8px 0 10px 0;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.eventInfoDiv__new .eventInfoDiv__new__item__count {
  font-weight: 500;
  color: #666666;
  font-size: 18px;
}
.eventInfoDiv__new .eventInfoDiv__new__item__label {
  font-weight: 500;
  color: #999999;
  font-size: 16px;
}
.eventInfoDiv__new__division {
  list-style: none;
  width: 1px;
  height: 34px;
  background: #d8d8d8;
}
/* 2021-06-21新设计 end */
.el-scrollbar__view {
  width: 96%;
  margin: auto;
}
.el-scrollbar {
  overflow-x: hidden;
  overflow-y: auto;
}
>>> .el-scrollbar__wrap {
  overflow-x: hidden;
}
.formContent {
  height: 100%;
  width: 100%;
  margin: 0 auto;
  padding-left: 22px;
  box-sizing: border-box;
}
</style>

<style lang="scss">
@import './assets/css/yangZhouEventRegistration.scss';
</style>
