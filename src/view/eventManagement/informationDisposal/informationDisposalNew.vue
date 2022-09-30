<template>
  <div class="informationDisposalNew_warp">
    <el-row style="display: flex; width: 100%; height: 100%">
      <el-col
        :style="{
          width:
            isNewDevelopmentCode &&
            (leftTabsType == '传真' ||
              leftTabsType == '一键通' ||
              leftTabsType == '小型移动应急平台')
              ? '100%'
              : '66.2%',
          height: '100%;',
          overflow: 'hidden',
        }"
      >
        <el-tabs v-model="leftTabsType" class="tabsClass sbs-tabs" @tab-click="tabClick">
          <el-tab-pane
            label="传真"
            name="传真"
            style="width: 100%; height: 100%"
            v-if="isNewDevelopmentCode"
          >
            <new-fax-information-disposal
              @tableClickEmit="changeItem"
              ref="newFaxInformationDisposal"
            ></new-fax-information-disposal>
          </el-tab-pane>
          <el-tab-pane
            label="传真"
            name="传真"
            style="height: 100%"
            v-if="!isNewDevelopmentCode"
          >
            <el-col :span="10">
              <div
                style="
                  min-height: 550px;
                  background-color: rgba(255, 255, 255, 1);
                "
                :style="heightStyle"
              >
                <div style="padding: 12px">
                  <div
                    style="
                      width: 100%;
                      margin: 15 0;
                      display: flex;
                      margin-bottom: 8px;
                    "
                  >
                    <el-date-picker
                      style="width: 65.5%"
                      v-model="queryFaxAllTime"
                      type="daterange"
                      size="small"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                    ></el-date-picker>

                    <el-select
                      v-model="faxStateValue"
                      clearable
                      placeholder="处置情况"
                      style="width: 32.5%; margin-left: 8px"
                    >
                      <el-option
                        v-for="item in faxStateData"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </div>
                  <div style="margin-left: 8px"></div>
                  <div style="display: flex">
                    <el-input
                      placeholder="请输入单位、号码"
                      v-model="queryFaxAllSelect"
                      class="input-with-select"
                    >
                      <el-button
                        slot="append"
                        icon="el-icon-search"
                        type="primary"
                        @click="getUnhandledFax"
                      ></el-button>
                    </el-input>
                    <div style="margin-left: 8px">
                      <el-select
                        v-model="faxTypeValue"
                        clearable
                        placeholder="传真类型"
                        @change="getUnhandledFax"
                      >
                        <el-option
                          v-for="item in faxAllTypeList"
                          :key="item"
                          :label="item"
                          :value="item"
                        ></el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
                <div v-loading="treeLoading" style="height: 87%">
                  <el-scrollbar style="height: 100%">
                    <div :style="listHeight" style="padding: 10px">
                      <div
                        style="margin-top: 10px; text-align: left"
                        v-for="(item, index) in faxList"
                        :key="item.id"
                        @click="changeItem(item, index)"
                      >
                        <el-card
                          :class="{ cardModelDiv: changeIndex == index }"
                          shadow="hover"
                          :body-style="bodyStyle"
                          style="
                            box-shadow: 0 11px 56px -11px rgba(54, 121, 225, 0.16);
                          "
                        >
                          <!-- <div style="display: flex;margin-bottom: 15px;">

                                            <div style="font-size: 12px;">{{item.time}}</div>
                                            <div class="ibackDiv">
                                            <i class="el-icon-connection" style="color: rgba(153,194,248,1);" @click.stop="eventRelevance(item)"></i>
                                            <i class="el-icon-edit" style="color: rgba(153,194,248,1);" @click.stop="editIndex = item.id" v-if="editIndex != item.id"></i>
                                            <i class="el-icon-s-order" style="color: rgba(153,194,248,1);" @click.stop="saveEdite(item,'fax')" v-if="editIndex == item.id"></i>
                                            </div>

                                            <div style="width: 80px;height: 22px;" v-if="editIndex == item.id">
                                            <el-select v-model="selectState" placeholder="请选择" size="mini">
                                                <el-option
                                                v-for="item in options"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                                </el-option>
                                            </el-select>
                                            </div>
                          </div>-->

                          <div slot="header">
                            <div
                              style="
                                font-weight: bold;
                                font-size: 17px;
                                color: #555555;
                              "
                            >
                              {{ `${item.unit ? item.unit : item.phone}` }}
                            </div>
                            <div
                              class="triangle-topright"
                              style="border-bottom: 20px solid #ff9f7f"
                              v-if="!item.status || item.status == '待处置'"
                            >
                              <div class="word">待处置</div>
                            </div>

                            <div
                              class="triangle-topright"
                              style="border-bottom: 20px solid #fbc958"
                              v-else-if="item.status == '处置中'"
                            >
                              <div class="word">{{ item.status }}</div>
                            </div>
                            <div
                              class="triangle-topright"
                              style="border-bottom: 20px solid #0bd295"
                              v-else-if="item.status == '已处置'"
                            >
                              <div class="word">{{ item.status }}</div>
                            </div>
                            <div
                              class="triangle-topright"
                              style="border-bottom: 20px solid #ff5c7e"
                              v-else-if="item.status == '无需处置'"
                            >
                              <div class="word">{{ item.status }}</div>
                            </div>
                            <!-- <div
                              class="triangle-topright"
                              style="border-bottom: 20px solid #999"
                              v-else-if="item.status == ''"
                            >
                              <div class="word">未处置</div>
                            </div> -->
                            <div style="margin-top: 10px">
                              <span
                                style="
                                  font-weight: normal;
                                  font-size: 14px;
                                  color: #999999;
                                  margin-right: 5px;
                                  overflow: hidden;
                                  text-overflow: ellipsis;
                                "
                                class="textType"
                                v-if="item.type"
                                >{{ item.type }}</span
                              >
                              <span
                                style="
                                  font-weight: normal;
                                  font-size: 14px;
                                  color: #999999;
                                "
                                >{{ item.time }}</span
                              >
                            </div>
                          </div>

                          <div v-if="item.event">
                            <div
                              style="
                                font-weight: normal;
                                font-size: 17px;
                                color: #666666;
                                margin-bottom: 8px;
                              "
                            >
                              {{ item.title }}
                            </div>
                            <div
                              style="
                                font-weight: normal;
                                font-size: 17px;
                                color: #999999;
                              "
                            >
                              {{ item.event }}
                              <div
                                class="clock_img"
                                @click="SeeTheHistory(item)"
                              >
                                通讯历史
                              </div>
                            </div>
                          </div>
                          <div
                            v-else
                            style="
                              display: flex;
                              justify-content: space-between;
                            "
                          >
                            <div
                              style="
                                font-weight: normal;
                                font-size: 17px;
                                color: #666666;
                              "
                            >
                              暂无关联事件
                              <!-- <div class="icon-smile"></div> -->
                            </div>
                            <div class="clock_img" @click="SeeTheHistory(item)">
                              通讯历史
                            </div>
                          </div>
                        </el-card>
                      </div>
                    </div>
                  </el-scrollbar>
                  <div>
                    <el-pagination
                      center
                      small
                      layout="prev, pager, next,  total"
                      :page-size="pageFaxSize"
                      :total="totalFax"
                      :current-page.sync="currentFaxPage"
                      @current-change="getUnhandledFax"
                      :pager-count="5"
                    ></el-pagination>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="14" id="faxCard">
              <div style="border-left: 1px solid rgb(220, 223, 230)">
                <div
                  style="
                    color: #333333;
                    font-size: 20px;
                    margin: 10px;
                    display: flex;
                    font-weight: bold;
                    align-items: center;
                  "
                >
                  <span class="sendFaxList-headline"></span>
                  <span>传真预览</span>
                  <i
                    v-if="allFpxPreviewPath != ''"
                    class="iconfont icon-fangda fullScreen"
                    @click="dialogVisible = true"
                  ></i>
                </div>
                <div :style="elTablePlanStyleNext">
                  <iframe
                    :src="allFpxPreviewPath"
                    id="fpxIframe"
                    width="100%"
                    height="100%"
                    v-if="allFpxPreviewPath != ''"
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
                      width: 100%;
                      height: 100%;
                      background: url('/static/img/faxBack.png') center
                        no-repeat;
                      background-size: 220px;
                    "
                  ></div>
                </div>
                <div>
                  <el-button size="small" @click="sequentialRotationOut"
                    >顺序旋转</el-button
                  >
                  <el-button size="small" @click="reply">回复</el-button>
                  <el-button size="small" @click="transmit">转发</el-button>
                  <el-button size="small" @click="faxMergeOpen">合并</el-button>
                  <el-button size="small" @click="activeResolution"
                    >拆分</el-button
                  >

                  <!--                        <el-button size="small">旋转</el-button>-->
                  <el-button size="small" @click="imgToText"
                    >图文识别</el-button
                  >
                  <!--                        <el-button size="small">导出</el-button>-->
                </div>
              </div>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="电话" name="电话" style="height: 100%">
            <div style="height: 100%; display: flex; flex-direction: column">
              <phoneHistoryIndex
                ref="phoneHistoryIndex"
                @phoneClick="clickPhoneList"
                @relevanceEvent="eventDataRequest"
                @clickEventValue="clickEventValue"
              ></phoneHistoryIndex>
            </div>
          </el-tab-pane>
          <el-tab-pane label="短信" name="短信">
            <div style="height: 100%; display: flex; flex-direction: column">
              <msgHistonryIndex
                ref="msgHistonryIndex"
                @transmit="msgTransmit"
                @reply="msgReply"
                @smgClick="clickSmsList"
                @clickEventValue="clickEventValue"
              ></msgHistonryIndex>
            </div>
          </el-tab-pane>
          <el-tab-pane label="APP上报" name="APP上报">
            <div style="height: 100%; display: flex; flex-direction: column">
              <appReportIndex
                ref="appReportIndex"
                @edit="handleEditAppReport"
              ></appReportIndex>
            </div>
          </el-tab-pane>
          <el-tab-pane label="系统上报" name="系统上报">
            <div style="height: 100%; display: flex; flex-direction: column">
              <SystemReport
                ref="systemReportRef"
                @to-event-register="handleToEventRegister"
              ></SystemReport>
            </div>
          </el-tab-pane>
          <!-- <el-tab-pane label="一键通" name="一键通">
            <div style="height: 100%; display: flex; flex-direction: column">
              <pushToTalk
                ref="pushToTalk"
              ></pushToTalk>
            </div>
          </el-tab-pane>
          <el-tab-pane label="小型移动应急平台" name="小型移动应急平台">
            <div style="height: 100%; display: flex; flex-direction: column">
              <smallPlatform
                ref="smallPlatform"
              ></smallPlatform>
            </div>
          </el-tab-pane> -->
        </el-tabs>
      </el-col>
      <el-col
        style="width: 33.8%;height:100%;"
        v-if="
          (isNewDevelopmentCode &&
            !(leftTabsType == '传真') &&
            !(leftTabsType == '一键通') &&
            !(leftTabsType == '小型移动应急平台')) ||
          !isNewDevelopmentCode
        "
      >
        <div class="disposal-right flex_wrap">
          <div class="disposal-right_tab-list">
            <span
              :class="'messageDiv ' + (changeRed === '通讯处置' ? 'messageDiv-active' : '')"
              @click="InformationDisposal"
            >
              <span class="communicate-img"></span>
              <span>通讯处置</span
              >
            </span>
            <span
              :class="'messageDiv ' + (changeRed === '信息登记' ? 'messageDiv-active' : '')"
              @click="infoEntering"
            >
              <span class="message-img"></span>
              <span>信息登记</span
              >
            </span>
            <span
              :class="'messageDiv ' + (changeRed === '事件登记' ? 'messageDiv-active' : '')"
              @click="eventEntering"
            >
              <span class="event-img"></span>
              <span>事件登记</span
              >
            </span>
          </div>
          <div class="disposal-right_tab-content">
            <template
              v-if="InformationDisposalShow"
            >
              <el-tabs
                v-model="activeAllModel"
                :style="rightHeightStyle"
                class="sbs-tabs"
                @tab-click="handleTabChange"
              >
                <el-tab-pane
                  label="电话"
                  name="电话"
                  style="height: calc(96% - 3px)"
                >
                  <div style="height: 100%">
                    <phoneIndex
                      ref="phoneIndex"
                      :faxForm="faxForm"
                    ></phoneIndex>
                  </div>
                </el-tab-pane>
                <el-tab-pane
                  label="短信"
                  name="短信"
                  style="height: calc(96% - 3px)"
                >
                  <div style="height: 100%" class="MessageHandling">
                    <smsRight ref="smsRight" :selectContact="true"></smsRight>
                  </div>
                </el-tab-pane>
                <el-tab-pane
                  label="传真"
                  name="传真"
                  style="height: calc(96% - 3px)"
                >
                  <fax-right
                    ref="IcpFaxRight"
                    :isAddPhonesShow.sync="isAddPhonesShow"
                  ></fax-right>
                </el-tab-pane>
              </el-tabs>
            </template>

            <!-- 事件登记 -->
            <el-card
              class="box-card cardCalss"
              shadow="never"
              v-if="eventEnteringShow && !isNewDevelopmentCode"
              style="background: #ebeef5"
              :style="eventEnteringStyle"
            >
              <!-- editor: qinjiaqi -->

              <el-form
                size="small"
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                @submit.native.prevent
                label-position="left"
                style="padding-bottom: 70px"
                :style="saveEntering"
                :hide-required-asterisk="asterisk"
              >
                <el-row :gutter="gutter" id="serial">
                  <el-col :span="0">
                    <el-form-item label="事件编号:">
                      <el-input
                        type="text"
                        disabled
                        v-model.trim="ruleForm.serialNumber"
                        show-word-limit
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <!-- authorName qinjiaqi -->
                <!-- Description: 样式要求跟事件接报统一，代码从overallSituation.vue拷贝过来 -->
                <el-row :gutter="gutter">
                  <el-col :span="12">
                    <el-form-item label="事发时间:" prop="incidentTime">
                      <el-date-picker
                        style="width: 100%"
                        v-model.trim="ruleForm.incidentTime"
                        type="datetime"
                        format="yyyy-MM-dd HH:mm"
                        value-format="yyyy-MM-dd HH:mm"
                        placeholder="选择日期时间"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>

                  <el-col :span="12">
                    <el-form-item label="接报时间:" prop="reportedTime">
                      <el-date-picker
                        style="width: 100%"
                        v-model.trim="ruleForm.reportedTime"
                        type="datetime"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间"
                        default-time="09:00:00"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="gutter">
                  <el-col :span="12">
                    <el-form-item label="书面报送时间:">
                      <el-date-picker
                        style="width: 100%; float: left"
                        v-model.trim="ruleForm.timeOfWrittenSubmission"
                        type="datetime"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间"
                        default-time="09:00:00"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>

                  <el-col :span="12">
                    <el-form-item label="接报方式:">
                      <el-select
                        v-model="ruleForm.submissionMethod"
                        placeholder="请选择"
                        style="width: 100%; float: left"
                      >
                        <el-option
                          v-for="item in submitOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="gutter">
                  <el-col :span="12">
                    <el-form-item label="报告单位:" prop="reportingUnit">
                      <!-- 3.0需求432 20210805 -->
                      <ReportUnit
                        ref="reportUnitRef"
                        :unit="ruleForm.reportingUnitName"
                        :placeholder="'请输入报告单位'"
                        @input="
                          (val) => {
                            this.ruleForm.reportingUnitName = val;
                          }
                        "
                        @select="
                          (val) => {
                            this.ruleForm.reportingUnitName = val;
                          }
                        "
                      />
                      <!-- <el-cascader
                          v-model.trim="ruleForm.reportingUnit"
                          :options="reportingUnitData"
                          ref="reportingUnit"
                          :props="props"
                          clearable
                          style="float: left; width: 100%"
                          :show-all-levels="false"
                        ></el-cascader> -->
                    </el-form-item>
                  </el-col>

                  <el-col :span="12">
                    <el-form-item label="所属区域:" prop="incidenArea">
                      <el-cascader
                        v-model.trim="ruleForm.incidenArea"
                        :options="jurisdictionData"
                        ref="incidenArea"
                        clearable
                        style="float: left; width: 100%"
                        :show-all-levels="false"
                      ></el-cascader>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="gutter">
                  <el-col :span="24">
                    <el-form-item label="事件标题:" id="titleEvent">
                      <el-input
                        type="text"
                        v-model.trim="ruleForm.eventTitle"
                        show-word-limit
                      ></el-input>
                      <div
                        style="
                          padding: 5px 15px;
                          position: absolute;
                          right: 0;
                          top: -5px;
                        "
                      >
                        <div>
                          <el-link type="primary" @click="generateTheTitle"
                            >生成事件报文</el-link
                          >
                        </div>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>

                <!-- <el-row :gutter="gutter">
                    <div
                      style="text-align: left;padding: 0 10px 10px;font-size: 14px;color: #666;"
                    >报告人:</div>
                    <el-form-item label>
                      <el-col :span="12">
                        <el-input v-model.trim="ruleForm.speakerName" placeholder="姓名"></el-input>
                      </el-col>
                      <el-col :span="12">
                        <el-input v-model.trim="ruleForm.speakerPhone" placeholder="电话"></el-input>
                      </el-col>
                    </el-form-item>
                  </el-row>-->

                <el-row :gutter="gutter">
                  <!-- <el-col :span="12">
                        <el-form-item label="事件级别:">
                            <el-select v-model="ruleForm.incidentRank" placeholder="请选择" @change="tests" @visible-change="visibleChange" style="width: 100%">
                            <el-option
                                v-for="item in eventLevel"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>-->

                  <el-col :span="24">
                    <el-form-item label="事故情况:">
                      <el-input
                        type="textarea"
                        :autosize="{ minRows: 4, maxRows: 8 }"
                        v-model.trim="ruleForm.accidentSituation"
                        show-word-limit
                        :title="ruleForm.accidentSituation"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="gutter">
                  <el-col :span="12">
                    <el-form-item label="事件类型:" prop="incidenType">
                      <el-cascader
                        v-model.trim="ruleForm.incidenType"
                        :options="eventTypeData"
                        ref="incidenType"
                        :props="props"
                        clearable
                        :show-all-levels="false"
                        @change="incidenTypeChange"
                      ></el-cascader>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="gutter" v-if="eventsParameters == true">
                  <el-col :span="24">
                    <!-- <el-form-item label="信息要素:" style="margin: 0"></el-form-item> -->
                    <el-form-item
                      id="itemCalss"
                      style="
                        background: #f9fbff;
                        padding: 5px 0;
                        border-radius: 3px;
                        margin-left: 110px;
                      "
                    >
                      <el-col :span="24">
                        <div style="display: flex; justify-content: center">
                          <div
                            style="
                              display: flex;
                              flex-wrap: wrap;
                              flex-direction: row;
                              justify-content: flex-start;
                              width: 100%;
                            "
                          >
                            <div
                              v-for="(item, index) in parameter"
                              style="margin-right: 9px"
                              :key="index"
                            >
                              <div v-if="item.type == '数字'">
                                <div
                                  :title="`${item.name}${
                                    item.unit ? `(${item.unit})` : item.unit
                                  }`"
                                  style="
                                    width: 150px;
                                    overflow: hidden;
                                    white-space: nowrap;
                                    text-overflow: ellipsis;
                                  "
                                >
                                  <span v-if="item.unit !== ''"
                                    >{{ item.name }}({{ item.unit }}):</span
                                  >
                                  <span v-else>{{ item.name }}:</span>
                                </div>
                                <el-input-number
                                  style="width: 150px"
                                  size="mini"
                                  v-model="item.value"
                                  :min="0"
                                  label="描述文字"
                                ></el-input-number>
                              </div>
                              <div
                                v-if="item.type == '文本'"
                                style="width: 150px"
                              >
                                <div
                                  :title="`${item.name}${
                                    item.unit ? `(${item.unit})` : item.unit
                                  }`"
                                  style="
                                    width: 150px;
                                    overflow: hidden;
                                    white-space: nowrap;
                                    text-overflow: ellipsis;
                                  "
                                >
                                  <span v-if="item.unit !== ''"
                                    >{{ item.name }}({{ item.unit }}):</span
                                  >
                                  <span v-if="item.unit == ''"
                                    >{{ item.name }}:</span
                                  >
                                </div>
                                <el-input
                                  style="width: 150px"
                                  type="text"
                                  size="mini"
                                  v-model="item.value"
                                  show-word-limit
                                ></el-input>
                              </div>
                              <div v-if="item.type == '选择'">
                                <div
                                  :title="`${item.name}${
                                    item.unit ? `(${item.unit})` : item.unit
                                  }`"
                                  style="
                                    width: 150px;
                                    overflow: hidden;
                                    white-space: nowrap;
                                    text-overflow: ellipsis;
                                  "
                                >
                                  <span v-if="item.unit !== ''"
                                    >{{ item.name }}({{ item.unit }}):</span
                                  >
                                  <span v-else>{{ item.name }}:</span>
                                </div>
                                <el-select
                                  style="width: 150px"
                                  size="mini"
                                  v-model="item.value"
                                  placeholder="请选择"
                                  @change="testSelect"
                                >
                                  <el-option
                                    v-for="(items, i) in item.struct"
                                    :key="i"
                                    :value="items"
                                  ></el-option>
                                </el-select>
                              </div>
                              <div
                                v-if="item.type == '时间'"
                                style="width: 150px; margin: 0 auto"
                              >
                                <div
                                  :title="`${item.name}${
                                    item.unit ? `(${item.unit})` : item.unit
                                  }`"
                                  style="
                                    width: 150px;
                                    overflow: hidden;
                                    white-space: nowrap;
                                    text-overflow: ellipsis;
                                  "
                                >
                                  <span v-if="item.unit !== ''"
                                    >{{ item.name }}({{ item.unit }}):</span
                                  >
                                  <span v-if="item.unit == ''"
                                    >{{ item.name }}:</span
                                  >
                                </div>
                                <el-date-picker
                                  style="width: 150px; margin: 0 auto"
                                  size="mini"
                                  v-model="item.value"
                                  format="yyyy-MM-dd"
                                  value-format="yyyy-MM-dd"
                                  type="datetime"
                                  placeholder="选择日期时间"
                                ></el-date-picker>
                              </div>
                            </div>
                          </div>
                        </div>
                      </el-col>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="gutter">
                  <el-col :span="24">
                    <el-form-item :label="`上报情况:`" prop="reportSituation">
                      <el-input
                        type="text"
                        v-model.trim="ruleForm.reportSituation"
                        show-word-limit
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="gutter">
                  <el-col :span="12">
                    <el-form-item label="值班员:">
                      <el-input
                        type="text"
                        v-model.trim="ruleForm.beOnDuty"
                        show-word-limit
                        :title="ruleForm.beOnDuty"
                      ></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="12">
                    <el-form-item label="值班领导:">
                      <el-input
                        type="text"
                        v-model.trim="ruleForm.leaderOnDuty"
                        show-word-limit
                        :title="ruleForm.beOnDuty"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <!-- 以上为新的样式 -->

                <!--

                  <el-row :gutter="gutter">
                    <el-col :span="24">
                      <el-form-item label="事件标题:" id="titleEvent">
                        <el-input type="text" v-model.trim="ruleForm.eventTitle" show-word-limit></el-input>
                        <div style="padding: 5px 15px;position:absolute;right:0;top:-5px;">
                          <div>
                            <el-link type="primary" @click="generateTheTitle">一键生成</el-link>
                          </div>
                        </div>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row :gutter="gutter" v-if="eventsParameters==true">
                    <el-col :span="24">
                      <el-form-item label="信息要素:" style="margin: 0"></el-form-item>
                      <el-form-item
                        id="itemCalss"
                        style="background:#F9FBFF;padding: 5px 0;border-radius:3px"
                      >
                        <el-col :span="24">
                          <div style="display: flex;justify-content: center">
                            <div
                              style="display: flex;flex-wrap: wrap; flex-direction: row;justify-content: flex-start;align-items: center;width: 100%;"
                            >
                              <div v-for="(item,index) in parameter" style="flex:1" :key="index">
                                <div v-if="item.type=='数字'">
                                  <div
                                    :title="`${item.name}${item.unit?`(${item.unit})`:item.unit}`"
                                    style=" width: 150px;overflow: hidden;white-space: nowrap;text-overflow:ellipsis;"
                                  >
                                    <span v-if="item.unit!==''">{{item.name}}({{item.unit}}):</span>
                                    <span v-if="item.unit==''">{{item.name}}:</span>
                                  </div>
                                  <el-input-number
                                    style="width: 150px;"
                                    size="mini"
                                    v-model="item.value"
                                    :min="0"
                                    label="描述文字"
                                  ></el-input-number>
                                </div>
                                <div v-if="item.type=='文本'" style="width: 150px;">
                                  <div
                                    :title="`${item.name}${item.unit?`(${item.unit})`:item.unit}`"
                                    style=" width: 150px;overflow: hidden;white-space: nowrap;text-overflow:ellipsis;"
                                  >
                                    <span v-if="item.unit!==''">{{item.name}}({{item.unit}}):</span>
                                    <span v-if="item.unit==''">{{item.name}}:</span>
                                  </div>
                                  <el-input
                                    style="width: 150px;"
                                    type="text"
                                    size="mini"
                                    v-model="item.value"
                                    show-word-limit
                                  ></el-input>
                                </div>
                                <div v-if="item.type=='选择'">
                                  <div
                                    :title="`${item.name}${item.unit?`(${item.unit})`:item.unit}`"
                                    style=" width: 150px;overflow: hidden;white-space: nowrap;text-overflow:ellipsis;"
                                  >
                                    <span v-if="item.unit!==''">{{item.name}}({{item.unit}}):</span>
                                    <span v-if="item.unit==''">{{item.name}}:</span>
                                  </div>
                                  <el-select
                                    style="width: 150px;"
                                    size="mini"
                                    v-model="item.value"
                                    placeholder="请选择"
                                  >
                                    <el-option
                                      v-for="items in (item.struct)"
                                      :key="items[0]"
                                      :value="items[0]"
                                    ></el-option>
                                  </el-select>
                                </div>
                                <div v-if="item.type=='时间'" style="width: 150px;margin: 0 auto">
                                  <div
                                    :title="`${item.name}${item.unit?`(${item.unit})`:item.unit}`"
                                    style=" width: 150px;overflow: hidden;white-space: nowrap;text-overflow:ellipsis;"
                                  >
                                    <span v-if="item.unit!==''">{{item.name}}({{item.unit}}):</span>
                                    <span v-if="item.unit==''">{{item.name}}:</span>
                                  </div>
                                  <el-date-picker
                                    style="width: 150px;margin: 0 auto"
                                    size="mini"
                                    v-model="item.value"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"
                                    type="datetime"
                                    placeholder="选择日期时间"
                                  ></el-date-picker>
                                </div>
                              </div>
                            </div>
                          </div>
                        </el-col>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <div v-else-if="eventsParameters==false"></div>

                  <el-row :gutter="gutter" style="margin: 0">
                    <el-col :span="24" id="baowen" style="padding-left:0">
                      <el-form-item label="突发事件报文:" style="margin: 0 0 5px 0;text-align: right">
                        <div style="display: flex;justify-content: flex-end">
                                        <div>突发事件报文</div>
                          <div>
                            <el-button type="primary" size="mini" @click="eventMessage">生成突发事件报文</el-button>
                          </div>
                        </div>
                      </el-form-item>
                      <el-form-item id="baowenNeiRon">
                        <el-input
                          type="textarea"
                          v-model.trim="ruleForm.allCase"
                          :autosize="{ minRows:8, maxRows: 8}"
                          show-word-limit
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="gutter">
                    <el-col :span="24" style="padding-right: 20px">
                      <el-form-item label="上报情况:">
                        <el-input
                          type="text"
                          v-model.trim="ruleForm.reportSituation"
                          show-word-limit
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>-->
              </el-form>
              <div
                style="
                  display: flex;
                  align-items: center;
                  background: #fff;
                  padding-bottom: 10px;
                "
              >
                <div
                  style="
                    flex: 1;
                    display: flex;
                    justify-content: flex-start;
                    margin-left: 10px;
                  "
                >
                  <el-button
                    type="primary"
                    size="small"
                    @click="saveEvent('ruleForm')"
                    >保存事件</el-button
                  >
                </div>
                <div
                  style="
                    flex: 1;
                    display: flex;
                    justify-content: flex-end;
                    margin-right: 10px;
                  "
                >
                  <el-button type="primary" size="small">
                    <router-link style="color: white" to="/yangZhouEventReports"
                      >进入事件处置</router-link
                    >
                  </el-button>
                </div>
              </div>
            </el-card>

            <!-- 新事件登记 -->
            <!-- <el-card
              class="box-card cardCalss"
              shadow="never"
              style="background: #ebeef5"
              :style="eventEnteringStyle"
            > -->
              <div
                v-if="eventEnteringShow && isNewDevelopmentCode"
                style="
                  width: 100%;
                  min-height: 760px;
                  background: #fff;
                  padding: 10px 10px 0 10px;
                  transition: all 0.3s;
                  overflow-x: scroll;
                  overflow-y: scroll;
                "
                :style="saveEntering"
              >
                <el-form
                  ref="emergencyForm"
                  :model="emergencyForm"
                  :rules="emergencyFormRules"
                >
                  <!-- 续保事件关联 -->
                  <el-row>
                    <el-col :span="24">
                      <el-form-item
                        label="首报事件关联:"
                        prop="eventCorrelation.caseTitle"
                      >
                        <el-popover
                          placement="bottom"
                          v-model="emergencyForm.eventCorrelationConfig.visible"
                          popper-class="eventOptions"
                        >
                          <div class="eventSearch">
                            <el-input
                              v-model="
                                emergencyForm.eventCorrelationConfig.searchText
                              "
                              placeholder="请输入关键字"
                              size="small"
                              clearable
                            >
                              <i
                                slot="suffix"
                                class="el-input__icon el-icon-search"
                                @click="
                                  emergencyForm.eventCorrelationConfig.currentPage = 1;
                                  emergencyForm.eventCorrelationConfig.eventOptions = [];
                                  getEventCorrelationOptions();
                                "
                              ></i>
                            </el-input>
                          </div>
                          <template
                            v-if="
                              emergencyForm.eventCorrelationConfig.eventOptions
                                .length > 0
                            "
                          >
                            <ul class="eventList">
                              <li
                                v-for="item in emergencyForm
                                  .eventCorrelationConfig.eventOptions"
                                :key="item.id"
                                class="evenyEvent"
                                @click="onSelectEventCorrelation(item)"
                              >
                                {{ item.title }}
                              </li>
                              <div class="loadMore">
                                <el-button
                                  round
                                  icon="iconfont icon-loadMore"
                                  size="mini"
                                  @click="
                                    emergencyForm.eventCorrelationConfig
                                      .currentPage++;
                                    getEventCorrelationOptions();
                                  "
                                  v-if="
                                    emergencyForm.eventCorrelationConfig
                                      .loadMore
                                  "
                                  >加载更多</el-button
                                >
                                <div v-else>暂无更多数据</div>
                              </div>
                            </ul>
                          </template>
                          <template v-else>
                            <div style="text-align: center; margin-top: 10px">
                              暂无数据
                            </div>
                          </template>

                          <el-input
                            slot="reference"
                            v-model="emergencyForm.eventCorrelation.caseTitle"
                            placeholder="请选择首报事件关联"
                            style="width: 80%"
                            size="big"
                            clearable
                          ></el-input>
                        </el-popover>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <!-- 事件标题 -->
                  <el-form-item
                    label="事件标题:"
                    label-width="83px"
                    class="eventTitle"
                    prop="eventTitle"
                  >
                    <el-input
                      v-model="emergencyForm.eventTitle"
                      placeholder="事件标题"
                      size="big"
                    ></el-input>
                  </el-form-item>
                  <!-- 事发时间和接报时间 -->
                  <el-row :gutter="24">
                    <el-form-item>
                      <el-col :span="12">
                        <el-form-item
                          label="事发时间:"
                          label-width="83px"
                          prop="incidentTime"
                        >
                          <el-date-picker
                            v-model="emergencyForm.incidentTime"
                            type="datetime"
                            placeholder="请选择事发时间"
                            class="arrange-style"
                          ></el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item
                          label="接报时间:"
                          label-width="83px"
                          prop="reportedTime"
                        >
                          <el-date-picker
                            v-model="emergencyForm.reportedTime"
                            type="datetime"
                            placeholder="请选择接报时间"
                            class="arrange-style"
                          ></el-date-picker>
                        </el-form-item>
                      </el-col>
                    </el-form-item>
                  </el-row>
                  <!-- 事件类型和事件等级 -->
                  <el-row :gutter="24">
                    <el-col :span="12">
                      <el-form-item
                        label="事件类型:"
                        prop="eventType"
                        label-width="83px"
                      >
                        <el-cascader
                          v-model.trim="emergencyForm.eventType"
                          :options="emergencyForm.eventTypeOptions"
                          ref="eventType"
                          :props="{
                            value: 'id',
                            label: 'name',
                            checkStrictly: true,
                          }"
                          clearable
                          :show-all-levels="false"
                          placeholder="请选择事件类型"
                          @change="eventTypeChange"
                          class="arrange-style"
                        ></el-cascader>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item
                        label="报告单位:"
                        label-width="83px"
                        prop="reportingUnit"
                      >
                        <!-- 3.0需求432 20210805 -->
                        <ReportUnit
                          ref="reportUnitRef"
                          :unit="emergencyForm.reportingUnitName"
                          :placeholder="'请输入报告单位'"
                          @input="
                            (val) => {
                              this.emergencyForm.reportingUnitName = val;
                            }
                          "
                          @select="
                            (val) => {
                              this.emergencyForm.reportingUnitName = val;
                            }
                          "
                        />
                        <!-- <el-cascader
                          v-model.trim="emergencyForm.reportingUnit"
                          :options="emergencyForm.reportingUnitOptions"
                          ref="reportingUnit"
                          :props="{
                            value: 'id',
                            label: 'name',
                            checkStrictly: true,
                          }"
                          clearable
                          style="width: 70%"
                          :show-all-levels="false"
                          placeholder="请选择报告单位"
                          @change="reportUnitChange"
                        ></el-cascader> -->
                      </el-form-item>
                    </el-col>
                    <!-- 事件等级注释原因：跟事件接报页面字段对齐 -->
                    <!-- <el-form-item
                      label="事件等级:"
                      label-width="83px"
                      prop="eventGrade"
                    >
                      <el-select
                        v-model="emergencyForm.eventGrade"
                        size="big"
                        placeholder="请选择事件等级"
                        class="arrange-style"
                        @change="eventGradeChange"
                      >
                        <el-option
                          v-for="item in emergencyForm.eventGradeOptions"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item> -->
                  </el-row>
                  <el-row :gutter="24">
                    <el-col :span="12">
                      <el-form-item
                        label="事故单位:"
                        label-width="83px"
                        prop="accidentUnit"
                      >
                        <el-input
                          size="big"
                          type="text"
                          v-model="emergencyForm.accidentUnit"
                          show-word-limit
                          placeholder="请输入事故单位"
                          class="arrange-style"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item
                        label="所属区域:"
                        label-width="83px"
                        prop="jurisdiction"
                      >
                        <el-cascader
                          v-model.trim="emergencyForm.jurisdiction"
                          :options="emergencyForm.jurisdictionOptions"
                          :props="{
                            value: 'id',
                            label: 'townName',
                            checkStrictly: true,
                            children: 'children',
                          }"
                          size="big"
                          clearable
                          ref="jurisdiction"
                          :show-all-levels="false"
                          placeholder="请选择所属区域"
                          class="arrange-style"
                          @change="jurisdictionChange"
                        ></el-cascader>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <!-- 事发地点 -->
                  <el-form-item
                    label="事发地点:"
                    label-width="83px"
                    prop="incidentLocation"
                  >
                    <el-input
                      v-model="emergencyForm.incidentLocation"
                      size="big"
                      placeholder="请输入事发地点"
                      ref="getFocus"
                    >
                      <!-- <i
                        class="el-icon-location-information el-input__icon"
                        slot="suffix"
                        style="cursor: pointer; color: rgb(64, 158, 255)"
                        @click="handleLocation"
                      ></i> -->
                    </el-input>
                  </el-form-item>
                  <el-form-item
                    label="落图地点:"
                    label-width="83px"
                  >
                    <!-- prop="fallFigureAddress" -->
                    <div style="display: flex; justify-content: space-between">
                      <el-input
                        size="big"
                        type="text"
                        v-model.trim="emergencyForm.fallFigureAddress"
                        show-word-limit
                        :title="emergencyForm.fallFigureAddress"
                        ref="getFocus"
                        placeHolder="请选择落图地点"
                        :style="
                          emergencyForm.eventDealId ? { width: 'calc(100% - 62px)' } : {}
                        "
                      >
                        <template slot="append">
                          <el-button size="mini" @click="handleLocation">
                            <!-- <i class="el-icon-location-outline"></i> -->
                            地点
                          </el-button>
                          <!-- author: qinjiaqi -->
                          <!-- description: 增城需要发坐标 -->
                          <!-- <el-button style="letter-spacing: 6px" @click="sendSite"
                            >发送</el-button
                          > -->
                        </template>
                      </el-input>
                      <div v-if="emergencyForm.eventDealId" class="submit_btn">
                        <el-button size="big" @click="sendSite">发送</el-button>
                      </div>
                    </div>
                  </el-form-item>
                  <!-- 注释原因：表单数据要跟着事件接报的来 -->
                  <!-- <el-col :span="12">
                  <el-form-item label="联系电话:" prop="contactNumber">
                    <el-input
                      v-model="emergencyForm.contactNumber"
                      placeholder="请输入联系电话"
                      style="width: 69.5%"
                    ></el-input>
                  </el-form-item>
                </el-col> -->
                  <!-- 事件要素 -->
                  <el-form-item
                    label="事件要素:"
                    class="eventElements"
                    prop="parameter"
                    v-if="emergencyForm.parameter.length > 0"
                    label-width="83px"
                  >
                    <div
                      v-for="(item, index) in emergencyForm.parameter"
                      :key="index"
                      style="margin-right: 3%"
                    >
                      <div v-if="item.type == '数字'" style="width: 250px">
                        <div
                          :title="`${item.name}${
                            item.unit ? `(${item.unit})` : item.unit
                          }`"
                        >
                          <span v-if="item.unit !== ''"
                            >{{ item.name }}({{ item.unit }}):</span
                          >
                          <span v-else>{{ item.name }}:</span>
                        </div>
                        <el-input
                          size="mini"
                          v-model.number="item.value"
                          :min="0"
                          label="描述文字"
                          style="width: 79%"
                        ></el-input>
                      </div>
                      <div v-if="item.type == '文本'" style="width: 250px">
                        <div
                          :title="`${item.name}${
                            item.unit ? `(${item.unit})` : item.unit
                          }`"
                        >
                          <span v-if="item.unit !== ''"
                            >{{ item.name }}({{ item.unit }}):</span
                          >
                          <span v-if="item.unit == ''">{{ item.name }}:</span>
                        </div>
                        <el-input
                          type="text"
                          size="mini"
                          v-model="item.value"
                          show-word-limit
                          style="width: 79%"
                        ></el-input>
                      </div>
                      <div v-if="item.type == '选择'" style="width: 250px">
                        <div
                          :title="`${item.name}${
                            item.unit ? `(${item.unit})` : item.unit
                          }`"
                        >
                          <span v-if="item.unit !== ''"
                            >{{ item.name }}({{ item.unit }}):</span
                          >
                          <span v-else>{{ item.name }}:</span>
                        </div>
                        <el-select
                          size="mini"
                          v-model="item.value"
                          placeholder="请选择"
                        >
                          <el-option
                            v-for="(items, i) in item.struct"
                            :key="i"
                            :value="items"
                          ></el-option>
                        </el-select>
                      </div>
                      <div v-if="item.type == '时间'" style="width: 250px">
                        <div
                          :title="`${item.name}${
                            item.unit ? `(${item.unit})` : item.unit
                          }`"
                        >
                          <span v-if="item.unit !== ''"
                            >{{ item.name }}({{ item.unit }}):</span
                          >
                          <span v-if="item.unit == ''">{{ item.name }}:</span>
                        </div>
                        <el-date-picker
                          size="mini"
                          v-model="item.value"
                          format="yyyy-MM-dd HH:mm:ss"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          type="datetime"
                          placeholder="选择日期时间"
                          style="width: 79%"
                        ></el-date-picker>
                      </div>
                    </div>
                  </el-form-item>
                  <!-- 事故简况 -->
                  <el-form-item label="事故简况:" prop="accidentSituation">
                    <el-input
                      v-model="emergencyForm.accidentSituation"
                      class="accidentTextarea"
                      type="textarea"
                      :autosize="{ minRows: 3, maxRows: 8 }"
                    >
                    </el-input>
                    <div
                      style="
                        padding-right: 5px;
                        position: absolute;
                        right: 0;
                        top: 1px;
                        display: flex;
                        justify-content: flex-end;
                        width: 100%;
                      "
                    >
                      <div>
                        <el-link type="primary" @click="eventMessage()"
                          >生成事件报文</el-link
                        >
                      </div>
                    </div>
                  </el-form-item>
                  <el-row :gutter="gutter" style="margin: 0">
                    <el-col :span="24" id="baowen" style="padding-left: 0;padding-right:0;">
                      <el-form-item
                        label="现场处置情况:"
                        id="disposalSituation"
                        label-width="114px"
                      >
                        <el-input
                          type="textarea"
                          v-model="emergencyForm.disposalSituation"
                          :autosize="{ minRows: 3, maxRows: 8 }"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <!-- 传真附件 -->
                  <!-- 注释原因：表单数据要跟着事件接报的来 -->
                  <!-- <el-form-item label="传真附件:" prop="faxFileList">
                    <uploadFile
                      uploadLabel="传真附件"
                      :attachments="emergencyForm.faxFileList"
                      fileType=".pdf, .jpg, .jpeg, .png"
                      :isShowPreviewer="false"
                      :isShowTitle="false"
                      ref="uploadFaxFile"
                      @remove="handleRemoveFaxFile"
                      @success="handleUploadFaxFileSuccess"
                      @clickFile="handlePreviewFaxFile"
                    ></uploadFile>
                  </el-form-item> -->
                  <!-- 其他附件 -->
                  <el-form-item label="其他附件:" prop="otherFileList">
                    <uploadFile
                      ref="uploadOtherFile"
                      :attachments="emergencyForm.otherFileList"
                      @remove="handleRemoveOtherFile"
                      @success="handleUploadOtherFileSuccess"
                    ></uploadFile>
                  </el-form-item>
                  <el-form-item style="height: 47px; margin-bottom: initial">
                    <span
                      style="
                        color: rgb(64, 158, 255);
                        font-weight: bolder;
                        position: absolute;
                        right: 3%;
                        cursor: pointer;
                      "
                      @click="emergencyForm.isExpand = !emergencyForm.isExpand"
                      >{{
                        emergencyForm.isExpand
                          ? '收起更多拓展信息>>>'
                          : '展开查看更多拓展信息>>>'
                      }}</span
                    >
                  </el-form-item>
                  <template v-if="emergencyForm.isExpand">
                    <el-form-item label="事发原因:" prop="incidentCause">
                      <el-input
                        v-model="emergencyForm.incidentCause"
                        placeholder="请输入事发原因"
                        size="big"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="已造成后果:" prop="consequences">
                      <el-input
                        v-model="emergencyForm.consequences"
                        placeholder="请输入已造成后果"
                        size="big"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="事件发展趋势:"
                      prop="eventDevelopmentTrend"
                    >
                      <el-input
                        v-model="emergencyForm.eventDevelopmentTrend"
                        placeholder="请输入事件发展趋势"
                        size="big"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="已采取措施:" prop="Measures">
                      <el-input
                        v-model="emergencyForm.Measures"
                        placeholder="请输入已采取措施"
                        size="big"
                      ></el-input>
                    </el-form-item>
                    <!-- bug14193 隐藏转办人、转办时间、转办部门 -->
                    <!-- <el-row :gutter="gutter">
                      <el-col :span="12">
                        <el-form-item label="转办人:">
                          <el-input
                            size="big"
                            type="text"
                            v-model.trim="emergencyForm.matterTrun"
                            clearable
                            show-word-limit
                            disabled
                          ></el-input>
                        </el-form-item>
                      </el-col>

                      <el-col :span="12">
                        <el-form-item label="转办时间:">
                          <el-date-picker
                            size="big"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            v-model.trim="emergencyForm.matterTime"
                            type="datetime"
                            placeholder="选择日期时间"
                            default-time="12:00:00"
                            style="float: left; width: 100%"
                          >
                          </el-date-picker>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row :gutter="gutter">
                      <el-col :span="24">
                        <el-form-item label="转办部门:">
                          <el-input
                            size="big"
                            type="text"
                            clearable
                            v-model.trim="emergencyForm.matterBranch"
                            show-word-limit
                          >
                            <template slot="append"
                              ><el-button @click="toHold"
                                >选择</el-button
                              ></template
                            >
                          </el-input>
                        </el-form-item>
                      </el-col>
                    </el-row> -->
                  </template>
                  <el-form-item style="height: 47px; position: relative">
                    <el-button
                      type="primary"
                      style="position: absolute; right: 3%"
                      @click="submitEmergencyForm"
                      >立即保存</el-button
                    >
                  </el-form-item>
                </el-form>
              </div>
            <!-- </el-card> -->

            <!-- 信息登记 -->
            <div
              v-if="infoEnteringShow"
              style="background: #ebeef5"
              :style="infoEnteringStyle"
            >
              <div
                style="
                  min-height: 610px;
                  background: #fff;
                  transition: all 0.3s;
                  overflow-x: hidden;
                  overflow-y: auto;
                  height: 812px;
                "
              >
                <div style="padding: 20px 20px 0">
                  <el-form
                    :model="faxForm"
                    :rules="faxFormRules"
                    ref="faxForm"
                    label-width="80px"
                    @submit.native.prevent
                    label-position="right"
                    class="faxFormClass"
                  >
                    <el-row :gutter="gutter">
                      <el-col :span="24">
                        <el-form-item label="号码">
                          <el-input
                            v-model="faxForm.calling"
                            disabled
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="gutter">
                      <el-col :span="24">
                        <el-form-item label="来文单位">
                          <el-input v-model="faxForm.unit" disabled></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="gutter">
                      <el-col :span="24">
                        <el-form-item label="时间">
                          <el-date-picker
                            disabled
                            v-model="faxForm.sendtime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                            type="datetime"
                            style="width: 100%"
                          ></el-date-picker>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <!--
                        @editorName: qinjiaqi
                        @editorTime: 2020-09-23
                        @description: 把类型从选择+下拉改成只下拉
                    -->
                    <!-- 删掉此功能 -->
                    <!-- <el-row :gutter="gutter">
                      <el-col :span="24">
                        <el-form-item
                          label="类型"
                          class="faxFormitemClass"
                          prop="type"
                        >
                          <el-select
                            v-model="faxForm.type"
                            placeholder="请选择"
                            style="width: 100%"
                          >
                            <el-option
                              v-for="(item, index) in faxAllTypeList"
                              :key="index"
                              :command="item"
                              :value="item"
                              :label="item"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row> -->
                    <el-row :gutter="gutter">
                      <el-col :span="24">
                        <el-form-item label="标题" prop="title">
                          <el-input v-model="faxForm.title"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="gutter">
                      <el-col :span="24">
                        <el-form-item label="处置状态">
                          <el-select
                            v-model="faxForm.status"
                            placeholder="请选择"
                            style="width: 100%"
                          >
                            <el-option
                              v-for="item in options"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="gutter">
                      <el-col :span="20">
                        <el-form-item label="关联事件" class="faxFormitemClass">
                          <el-popover
                            placement="bottom"
                            v-model="visible"
                            popper-class="eventOptions"
                          >
                            <div class="eventSearch">
                              <el-input
                                v-model="searchText"
                                placeholder="请输入关键字"
                                size="small"
                              >
                                <i
                                  slot="suffix"
                                  class="el-input__icon el-icon-search"
                                  @click="searchEvent"
                                ></i>
                              </el-input>
                            </div>
                            <!-- <div class="recentOptions">
                <div class="recentTitle">近期选择：</div>
                <ul class="recentList">
                  <li class="eachRecent">08.27天河区自然灾害</li>
                </ul>
              </div> -->
                            <template v-if="eventOptions.length > 0">
                              <ul class="eventList">
                                <li
                                  v-for="item in eventOptions"
                                  :key="item.id"
                                  class="evenyEvent"
                                  @click="selectEvent(item)"
                                  :style="selectEventStyle(item.id)"
                                >
                                  {{ item.title }}
                                </li>
                                <div class="loadMore">
                                  <el-button
                                    round
                                    icon="iconfont icon-loadMore"
                                    size="mini"
                                    @click="loadMoreHandle"
                                    v-if="loadMore"
                                    >加载更多</el-button
                                  >
                                  <div v-else>暂无更多数据</div>
                                </div>
                              </ul>
                            </template>
                            <template v-else>
                              <div style="text-align: center; margin-top: 10px">
                                暂无数据
                              </div>
                            </template>

                            <el-input
                              slot="reference"
                              v-model="faxForm.eventTitle"
                              readonly
                              placeholder="请选择"
                            ></el-input>
                          </el-popover>
                        </el-form-item>
                      </el-col>
                      <el-col :span="4">
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="新增关联事件"
                          placement="top-start"
                        >
                          <el-button
                            plain
                            @click="eventEntering"
                            style="
                              width: 100%;
                              height: 40px;
                              padding: 0;
                              border-color: #dbe3e9;
                              color: #83a3b7;
                            "
                            >新增</el-button
                          >
                        </el-tooltip>
                      </el-col>
                    </el-row>
                    <el-row :gutter="gutter">
                      <el-col :span="24">
                        <el-form-item label="处置记录" class="faxFormitemClass">
                          <el-input
                            v-model="faxForm.result"
                            type="textarea"
                            :rows="7"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </div>
                <div
                  style="
                    color: #333333;
                    font-size: 20px;
                    font-weight: bold;
                    text-align: right;
                    padding-right: 15px;
                  "
                >
                  <div>
                    <el-button
                      type="primary"
                      size="small"
                      @click="savefaxHistory"
                      >保存</el-button
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!--弹出事件列表关联-->
    <el-dialog
      title="关联事件"
      :visible.sync="eventList"
      :close-on-click-modal="false"
      append-to-body
      left
      :before-close="beforeClose"
      v-if="rushKist"
    >
      <div>
        <el-table
          :data="gridData"
          stripe
          border
          v-loading="myLoading"
          highlight-current-row
          @row-click="rowClick"
        >
          <el-table-column
            property="title"
            label="事件标题"
            min-width="250"
          ></el-table-column>
          <el-table-column
            property="caseClass"
            label="事件类型"
            min-width="250"
          ></el-table-column>
          <el-table-column
            property="occurTime"
            label="事发时间"
            min-width="250"
          ></el-table-column>
          <el-table-column
            property="receiveOperator"
            label="接报人"
            min-width="100"
          ></el-table-column>
        </el-table>
        <el-pagination
          :page-size="pageSize"
          :total="total"
          :current-page.sync="currentPage"
          @current-change="getTabDatas"
          layout="total, prev, pager, next, jumper"
        ></el-pagination>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="colser" size="mini">取 消</el-button>
        <el-button type="primary" @click="cufim" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 全屏预览传真 -->
    <el-dialog
      :visible.sync="dialogVisible"
      fullscreen
      :close-on-click-modal="false"
    >
      <iframe
        :src="allFpxPreviewPath"
        id="iframe"
        width="100%"
        height="900px"
        frameborder="no"
        border="0"
        marginwidth="0"
        marginheight="0"
        scrolling="no"
        allowtransparency="yes"
      ></iframe>
    </el-dialog>

    <!--选择弹窗组件-->
    <add-dialog
      @closeDialog="closeDialog"
      @confirm="confirm"
      @close="close"
      ref="eventDialog"
      :title="title"
      :addEventDialog="addEventDialog"
      @handleNodeClick="handleNodeClick"
    ></add-dialog>

    <!--选择事发地点-->
    <location ref="loction" :mapframe="mapId"></location>

    <!--添加号码对话框-->
    <el-dialog
      :visible.sync="isAddPhonesShow"
      width="30%"
      :close-on-click-modal="false"
    >
      <div slot="title" class="dialog-header">添加号码</div>
      <el-input
        type="textarea"
        resize="none"
        :autosize="{ minRows: 4, maxRows: 4 }"
        v-model="phonesText"
        placeholder="请输入号码，多个号码使用“，”隔开"
      ></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitClose">取 消</el-button>
        <el-button type="primary" @click="submitPhones">确 定</el-button>
      </div>
    </el-dialog>
    <imgToText
      ref="imgToText"
      :faxId="imgToTextId"
      :isSequentialRotationIn="true"
      @sequentialRotationIn="sequentialRotationIn"
      v-if="imgToTextVisible"
      @closeImgToText="imgToTextVisible = false"
    ></imgToText>
    <resolution ref="resolution"></resolution>
    <merge-fax-dialog
      ref="mergeFaxDialog"
      :key="timerDate"
      @closeFaxDialog="closeFaxDialog"
    ></merge-fax-dialog>

    <!-- 查看传真历史 -->
    <InformaHistory
      v-show="InformaHistoryFlag"
      @closeInformaHis="closeInformaHis"
      ref="InformaHistory"
    ></InformaHistory>

    <!-- 地图弹窗 -->
    <LocationDialog ref="LocationDialogRef" />
  </div>
</template>

<script>
import uploadFile from '@/yz_components/upload/uploadFile';
import smsRight from '../../integratedCommunication/icpPhone/icpPhonePage/smsStep/smsRight';
import phoneIndex from './communicationHistory/phone/phoneIndex';
import phoneHistoryIndex from './communicationHistory/phoneHistoryIndex';
import msgHistonryIndex from './communicationHistory/msgHistonryIndex';
import appReportIndex from './communicationHistory/appReportIndex';
import faxRight from '@/view/integratedCommunication/icpPhone/icpPhonePage/faxStep/faxRight';
import newFaxModel from '@/view/eventManagement/eventRegistration/newModel/newFaxModel';
import newSmsModel from '@/view/eventManagement/eventRegistration/newModel/newSmsModel';
import audioCompName from '@/view/History/phoneHistory/all/audioHistory';
import audioPlan from '@/view/eventManagement/informationDisposal/audioPlan';
import mergeFaxDialog from '@/view/eventManagement/informationDisposal/mergeFaxDialog';
import resolution from '@/view/eventManagement/informationDisposal/resolution';
import imgToText from '@/view/eventManagement/informationDisposal/imgToText';
import Location from '@/components/loction/loction'; // 定位
import addDialog from '@/view/eventManagement/eventReports/dialog/eventDialog'; // 联系人及其她选择弹窗
import InformaHistory from './communicationHistory/comonnTemplat/InformaHistory'; // 传真历史
import newFaxInformationDisposal from '@/view/eventManagement/informationDisposal/newFaxInformationDisposal/newFaxInformationDisposal';
import pushToTalk from './communicationHistory/comonnTemplat/pushToTalk'; // 一键通
import smallPlatform from './communicationHistory/comonnTemplat/smallPlatform'; // 小型
import axios from 'axios';
import Qs from 'qs';
import { getRelations, deepCompare } from '@/assets/js/yz_common.js';
import LocationDialog from '@/views/modules/GarbageClassification/SiteManagement/ClassificationSite/Location/LocationDialog.vue';
// 报送单位
import ReportUnit from '@/view/yangZhouEventReports/components/ReportUnit/ReportUnit.vue';
// 系统上报
import SystemReport from '@/view/eventManagement/informationDisposal/SystemReport/SystemReport.vue';
import bus from '@/views/common/js/eventBus';

export default {
  name: 'informationDisposalNew',
  components: {
    uploadFile,
    phoneIndex,
    smsRight,
    newFaxModel,
    audioCompName,
    Location,
    addDialog,
    audioPlan,
    faxRight,
    phoneHistoryIndex,
    msgHistonryIndex,
    appReportIndex,
    mergeFaxDialog,
    resolution,
    imgToText,
    InformaHistory,
    newFaxInformationDisposal,
    pushToTalk, // 一键通
    smallPlatform, // 小型
    LocationDialog,
    // 报告单位
    ReportUnit,
    // ,audioCompName
    // 系统上报
    SystemReport,
  },
  data() {
    return {
      isNewDevelopmentCode: this.$window.g.isNewDevelopmentCode,
      submitOptions: [
        { id: 1, label: '电话', value: '1' },
        { id: 2, label: '短信', value: '2' },
        { id: 3, label: '传真', value: '3' },
        { id: 4, label: '其他', value: '4' },
      ],
      props: {
        value: 'id',
        label: 'name',
        checkStrictly: true,
      },
      jurisdictionData: [], // 所属区域
      reportingUnitData: [], // 报告单位
      eventTypeData: [], // 事件类型
      beOnDutyVisible: false, // 值班员弹窗
      leaderOnDutyVisible: false, // 值班领导弹窗
      isShowEventReportDialog: false, // 是否显示事件上报弹窗
      ruleForm: {
        eventTitle: '',
        reportedTime: '',
        incidentTime: '',
        incidenArea: [],
        incidentSite: '',
        reportingUnit: [],
        reportingUnitName: '',
        incidenType: [],
        serialNumber: '',
        reportSituation: '',
        allCase: '',
        speakerName: '',
        speakerPhone: '',

        // incidentRank: '',

        timeOfWrittenSubmission: '',
        accidentSituation: '',
        beOnDuty: '',
        beOnDutyIds: [],
        leaderOnDuty: '',
        leaderOnDutyIds: [],
        submissionMethod: '',

        deathToll: '',
        bruiseToll: '',
        disappearToll: '',

        deathNum: '',
        injuredNum: '',
      },

      rules: {
        // eventTitle: [{required: true, message: "不能为空", trigger: "blur"}],
        reportedTime: [
          { required: true, message: '不能为空', trigger: 'blur' },
        ],
        incidentTime: [
          { required: true, message: '不能为空', trigger: 'blur' },
        ],
        timeOfWrittenSubmission: [
          { required: true, message: '不能为空', trigger: 'blur' },
        ],
        incidenArea: [{ required: true, message: '不能为空', trigger: 'blur' }],
        incidentSite: [
          { required: true, message: '不能为空', trigger: 'blur' },
        ],
        reportSituation: [
          { required: true, message: '不能为空', trigger: 'blur' },
        ],
        submissionMethod: [
          { required: true, message: '不能为空', trigger: 'blur' },
        ],
        accidentSituation: [
          { required: true, message: '不能为空', trigger: 'blur' },
        ],
        reportingUnit: [
          { required: true, message: '不能为空', trigger: 'blur' },
        ],
        beOnDuty: [{ required: true, message: '不能为空', trigger: 'blur' }],
        leaderOnDuty: [
          { required: true, message: '不能为空', trigger: 'blur' },
        ],
        incidenType: [{ required: true, message: '不能为空', trigger: 'blur' }],
        deathToll: [{ required: true, message: '不能为空', trigger: 'blur' }],
        bruiseToll: [{ required: true, message: '不能为空', trigger: 'blur' }],
        disappearToll: [
          { required: true, message: '不能为空', trigger: 'blur' },
        ],
        allCase: [{ message: '' }],
      },
      /**
       * @param {type} 没有
       * @return {type} undefined
       * @description：传真的表单数据的规则
       */
      faxFormRules: {
        type: [{ required: true, message: '不能为空', trigger: 'blur' }],
        title: [{ required: true, message: '不能为空', trigger: 'blur' }],
      },
      dataALL: {
        eventTitle: '',
        reportedTime: '',
        incidentTime: '',
        incidenArea: [],
        incidentSite: '',
        reportingUnit: [],
        reportingUnitName: '',
        incidenType: [],
        serialNumber: '',
        reportSituation: '',
        allCase: '',
        speakerName: '',
        speakerPhone: '',

        // incidentRank: '',

        timeOfWrittenSubmission: '',
        accidentSituation: '',
        beOnDuty: '',
        beOnDutyIds: [],
        leaderOnDuty: '',
        leaderOnDutyIds: [],
        submissionMethod: '',

        deathToll: '',
        bruiseToll: '',
        disappearToll: '',

        deathNum: '',
        injuredNum: '',
      },
      faxStateData: [
        {
          value: '',
          label: '',
        },
      ],
      faxStateValue: '',
      faxTypeValue: '',
      activeAllModel: '电话', // 右边tabs选项
      leftTabsType: '传真', // 左边tabs选项
      allFpxPreviewPath: '', // allModel选中传真的传真预览地址
      queryFaxAllTime: '', // allModel传真查询时间
      queryFaxAllSelect: '', // allModel传真下拉选中
      faxAllSelectData: '', // allModel传真获取到的数据
      list: [],
      pageFaxSize: 10, // 传真MODEL分页
      totalFax: 0, // 传真MODEL分页
      currentFaxPage: 1, // 传真MODEL分页
      bodyStyle: {
        padding: '10px 15px',
        backgroundColor: 'transparent',
        cursor: 'pointer',
      }, // cred 默认的样式
      changeIndex: -1, // 更改背景颜色
      eventList: false, // 关联事件弹窗
      pageSize: 10,
      currentPage: 1,
      total: 0,
      rushKist: true,
      gridData: [],
      myLoading: {
        type: Boolean,
        default: false,
      },
      elTablePlanStyle: {
        height: '', // 中间的高度
      },
      elTablePlanStyleNext: {
        height: '',
        padding: '10px',
      },
      heightStyle: {
        height: '',
      },
      infoEnteringStyle: {
        height: '',
      },
      eventEnteringStyle: {
        height: '',
      },
      rightHeightStyle: {
        height: '',
        display: 'flex',
        'flex-direction': 'column',
      },
      listHeight: {
        height: '',
      },
      saveEntering: {
        height: '',
      },
      turnTheText: {
        height: '',
      },
      changeRed: '通讯处置', // 默认显示信息处置
      InformationDisposalShow: true, // 默认显示信息处置
      eventEnteringShow: false, // 默认隐藏录入事件
      infoEnteringShow: false, // 默认隐藏信息登记
      eventsParameters: false, // 情景要素是否显示
      parameter: [], // 情景要素参数
      audioList: {
        // 音频组件地址,只能传递一个,如果需要传递多个,可以自己修改源码  换成数组或者json
        url: '',
        // 这个音频文件的长度,因为一般都是异步获取到音频地址才能初始化audio的,所以这个参数父传递给子合适点
        totalTime: '',
      },
      dialogVisible: false,
      editIndex: '',
      options: '',
      selectState: '',
      textShow: '',
      row: '', // 当前选中的事件
      nowTag: 'fax', // 当前的tag是传真、电话还是短信
      id: '', // 当前左侧选中的的列表
      phoneText: '',
      smsText: '',
      addEventDialog: false, // 选择是否弹窗
      title: '', // 选择弹窗标题
      eventTree: [], // 事件区域选中数据
      eventAddressBook: [], // 事件联系人选中数据
      eventTypeList: [], // 事件类型选中数据
      eventType: [], // 事件类型存储
      longitude: '', // 经度
      latitude: '', // 纬度
      longitude: '',
      cgcsLatitude: '',
      asterisk: false,
      caseid: '', // 事件类型ID
      addClass: '', // 匹配出来的事件模板内容
      gutter: 20,
      audioShow: false,
      leftEventId: '',
      imgToTextId: 0,
      testAudio: false, //
      audioUrlData: '',
      audioId: '',
      mapId: 'informId',
      phonePerson: '', // 电话联系人
      treeLoading: true, // 传真loading加载
      phoneTreeLoading: true, // 电话loading加载
      smsTreeLoading: true, // 短信loading加载
      faxRushe: true, // 刷新传真预览
      phoneRushe: true, // 刷新电话预览
      backSms: {
        // 短信区域给一个背景图
        background: '',
        backgroundSize: '',
      },
      backPhone: {
        // 短信区域给一个背景图
        background: '',
        backgroundSize: '',
      },
      faxcontactId: '', // 传真一键识别用来查询联系人
      audioPlanData: '', // 存储录音实例
      rushFaxData: '', // 刷新传真编辑的内容

      phonesText: '',
      isAddPhonesShow: false,
      faxForm: {
        id: '',
        phone: '',
        unit: '',
        time: '',
        event: '',
        status: '',
        type: null,
        title: null,
        result: null,
        eventId: '',
        eventTitle: '',
      },
      eventOptions: [],
      timerDate: '',
      faxAllTypeList: [],
      InformaHistoryFlag: false, // 传真历史弹窗
      clickFaxInfo: {}, // 点击传真历史
      paramsData: [], // 重新赋值数据库返回数据
      caseFor: [], // 存储原来的事件类型id
      imgToTextVisible: false, // 图文识别弹窗
      visible: false,
      currentPage: 1, // 事件列表页码
      searchText: '', // 事件列表搜索关键字
      loadMore: true, // 是否有更多事件数据
      faxList: [], // 旧的跟电话短信撞了，数据容易出问题 qinjiaqi 20200114
      eventEnteringShow: false, // 默认隐藏录入事件
      isNewDevelopmentCode: this.$window.g.isNewDevelopmentCode,
      emergencyForm: {
        isExpand: false,
        eventId: '',
        eventDealId: '',
        eventCorrelation: {
          caseTitle: '',
          caseId: '',
        },
        jurisdiction: '',
        eventTitle: '',
        eventType: [],
        eventGrade: '',
        incidentTime: '',
        startingTime: '',
        incidentLocation: '',
        reportingUnit: '',
        reportingUnitName: '',
        contactNumber: '',
        parameter: [],
        accidentSituation: '',
        incidentCause: '',
        consequences: '',
        eventDevelopmentTrend: '',
        Measures: '',
        jurisdictionOptions: [],
        eventTypeOptions: [],
        eventGradeOptions: [],
        eventCorrelationConfig: {
          visible: false,
          searchText: '',
          currentPage: 1,
          eventOptions: [],
          loadMore: true,
        },
        reportingUnitOptions: [],
        faxFileList: [],
        previewFaxFileConfig: {
          faxFileDialogVisible: false,
          imgOrFileType: '',
          filePath: '',
          previewImageUrlList: [],
        },
        otherFileList: [],
        fallFigureAddress: '', // 落图地点
        disposalSituation: '', // 现场处置情况

        matterTrun: '', // 转办人
        matterTime: '', // 转办时间
        matterBranch: '', // 转办部门
        accidentUnit: '', // 事故单位
      },
      emergencyFormRules: {
        jurisdiction: [
          {
            required: true,
            message: '请选择所属区域',
            trigger: 'change',
          },
        ],
        eventTitle: [
          {
            required: true,
            message: '请填写事件标题',
            trigger: 'blur',
          },
        ],
        eventType: [
          {
            required: true,
            message: '请选择事件类型',
            trigger: 'change',
          },
        ],
        incidentTime: [
          {
            required: true,
            message: '请选择事发时间',
            trigger: ['blur'],
          },
        ],
        incidentLocation: [
          {
            required: true,
            message: '请填写事发地点',
            trigger: ['blur', 'change'],
          },
        ],
        fallFigureAddress: [
          {
            required: true,
            message: '请填写事发地点',
            trigger: ['blur', 'change'],
          },
        ],
        accidentSituation: [
          {
            required: true,
            message: '请填写事故情况',
            trigger: ['blur'],
          },
        ],
      },
      join: '', // 接
      happen: '', // 发生
      eventElements: '', // 事件要素
      result: '', // 已造成后果
      messure: '', // 目前
      report: '', // 报
      eventInformation: ``, // 事件要素
      isFindOrder: true, // 是不是第一次新建
      incidenArea: [], // 辖区列列表
      tempEventTitle: '',
      tempEventTitleCount: 0,
    };
  },
  beforeDestroy() {
    window.removeEventListener('message', this.locationCallback);
    window.addEventListener('message', this.sendLocationMsg);
    // 新事件登记
    window.removeEventListener('message', this.locationCallbackEmergency);
    window.addEventListener('message', this.sendLocationMsgEmergency);
    document.getElementsByClassName('el-scrollbar__wrap')[0].style.overflow =
      'scroll';
    // document.getElementsByClassName("el-scrollbar__wrap")[0].style.overflow =
    //   "scroll";
    // document.getElementsByClassName('is-vertical')[13].style.visibility='visible'
  },
  created() {
    // console.log("this.$store.state.navTree: ", this.$store.state.navTree);
    // 重要的
    this.eventScene();
    this.addressBook();
    this.incidentType();
    // -----------------
    window.addEventListener('resize', this.getHeight);
    this.getHeight();
    this.getTimes();
    window.addEventListener('message', this.locationCallback);
    window.addEventListener('message', this.sendLocationMsg);
    // 新事件登记位置
    window.addEventListener('message', this.locationCallbackEmergency);
    window.addEventListener('message', this.sendLocationMsgEmergency);
    // 获取改变状态的列表
    let data = {
      pcode: 'information_processing_status',
    };
    this.$api.getByPcode(data).then((res) => {
      // // console.log(res)
      if (res.errorcode == 0) {
        this.options = res.data;
        // // console.log(this.options)
      } else {
        // this.$message.error(res.msg)
      }
    });
    this.getUnhandledFax();
    if (this.$store.getters.getDispositionType) {
      this.leftTabsType = this.$store.getters.getDispositionType;
      this.$store.commit('setDispositionType', '传真');
      if (this.leftTabsType == '电话') {
        this.getUnhandledPhone();
      } else if (this.leftTabsType == '短信') {
        this.getUnhandledSms();
      } else if (this.leftTabsType == '传真') {
        this.getUnhandledFax();
      }
    }
    this.getFaxTypeSelections(); // 选择全部右边表单类型
    // this.getEventOptions();
  },
  computed: {
    eventTypeComments() {
      return JSON.parse(JSON.stringify(this.eventType));
    },
    selectEventStyle() {
      return function (eventId) {
        // console.log("this.faxForm.eventId: ", this.faxForm.eventId);
        // console.log("eventId: ", eventId);
        if (this.faxForm.eventId == eventId) {
          return 'color:#0091ff;background-color:rgba(0, 145, 255, .1);';
        } else {
          return '';
        }
      };
    },
  },
  watch: {
    // 解决所属区域级联选择器点击不关闭的问题
    'ruleForm.incidenArea'(newValue, oldValue) {
      if (this.$refs.incidenArea) {
        var children = this.$refs.incidenArea.getCheckedNodes();
        if (children.length > 0 && children[0].children.length < 1) {
          // 判断有没有下级
          this.$refs.incidenArea.dropDownVisible = false; // 监听值发生变化就关闭它
        }
      }
    },
    // 解决报告单位级联选择器点击不关闭的问题
    'ruleForm.reportingUnit'(newValue, oldValue) {
      if (this.$refs.reportingUnit) {
        var children = this.$refs.reportingUnit.getCheckedNodes();
        if (children.length > 0 && children[0].children.length < 1) {
          // 判断有没有下级
          this.$refs.reportingUnit.dropDownVisible = false; // 监听值发生变化就关闭它
        }
      }
    },
    // 解决事件类型级联选择器点击不关闭的问题
    'ruleForm.incidenType'(newValue, oldValue) {
      if (this.$refs.incidenType) {
        var children = this.$refs.incidenType.getCheckedNodes();
        if (children.length > 0 && children[0].children.length < 1) {
          // 判断有没有下级
          this.$refs.incidenType.dropDownVisible = false; // 监听值发生变化就关闭它
        }
      }
    },

    faxStateValue: function (newVal) {
      this.getUnhandledFax();
    },
    activeAllModel: {
      handler: function (newVal) {
        // console.log("activeAllModel", newVal);
        if (newVal === '短信') {
          const _that = this;
          setTimeout(() => {
            _that.$refs.smsRight.msmEventFlag = false;
          }, 100);
          this.$store.commit('setSmsOrFax', 'sms');
        } else if (newVal === '传真') {
          this.$store.commit('setSmsOrFax', 'fax');
        } else if (newVal === '电话') {
          this.$store.commit('setSmsOrFax', 'phone');
        }
      },
      deep: true,
    },
    queryFaxAllTime() {
      this.getUnhandledFax();
    },
    audioUrlData: {
      handler(valV, oldV) {
        if (oldV != '' && valV !== oldV) {
          try {
            this.audioPlanData.stop(); // 先停止录音播放
          } catch (err) {
            // console.log(err);
          }
        }
      },
      deep: true,
    },
    leftTabsType: {
      handler(valV, oldV) {
        if (valV == '电话') {
          this.getUnhandledPhone();
        } else if (valV == '短信') {
          this.getUnhandledSms();
        } else if (valV == '传真') {
          this.getUnhandledFax();
        }
      },
      deep: true,
    },
    smsText: {
      handler(nV) {
        if (nV == '' || nV == null) {
          this.backSms.background =
            'url(' + '/static/img/smsContent.png' + ')center no-repeat';
          this.backSms.backgroundSize = '220px';
        } else {
          this.backSms.background = 'none';
          this.backSms.backgroundSize = '220px';
        }
      },
      deep: true,
    },
    phoneText: {
      handler(nV) {
        if (nV == '' || nV == null) {
          this.backPhone.background =
            'url(' + '/static/img/txtNull.png' + ')center no-repeat';
          this.backPhone.backgroundSize = '130px';
        } else {
          this.backPhone.background = 'none';
          this.backPhone.backgroundSize = '130px';
        }
      },
      deep: true,
    },
    channelTitle: {
      handler(nV, oV) {
        // console.log(nV, oV);
        if (this.titleType == '新增' || this.titleType == '登记') {
          if (
            this.ruleForm.eventTitle === '' ||
            this.ruleForm.eventTitle == null
          )
            return;
          if (this.ruleForm.incidenType.length > 0) {
            return;
          }
          this.matchingTitle();
        }
      },
      deep: true,
    },
    eventTypeComments: {
      handler(newV, oldV) {
        // console.log("oldV, newV", oldV, newV);
        if (newV !== '' && newV !== null && newV.length !== 0) {
          let caseID = newV[0].id;
          let caseName = newV[0].name;
          this.$emit('refreshEvent');
          sessionStorage.setItem('caseID', caseID);
          sessionStorage.setItem('caseName', caseName);
          if (sessionStorage.getItem('caseID') != 0) {
            this.caseFor.push({ id: sessionStorage.getItem('caseID') });
            // console.log(this.caseFor);
          }
        }
        if (oldV.length == 0) {
          return;
        }
        if (newV.length !== 0 && oldV.length !== 0) {
          // console.log(newV, oldV);
          if (newV[0].id !== oldV[0].id) {
            this.$emit('delectReape');
          }
        }
      },
      deep: true,
    },
    /**
     * @lastEditor qinjiaqi
     * @lastDate 2020-9-30
     * @param {Object, Object} 传入的新值和表单原来的旧值
     * @return {type} undefined
     * @Description 监听事件类型子参数
     */
    parameter: {
      handler(nV, oV) {
        if (oV.length !== 0 && nV.length !== 0) {
          let isSame = deepCompare(nV, oV); // 深度遍历参数是否一样
          this.isUpdateParameter = !isSame; // 取反
          if (this.isUpdateParameter || this.isUpdateForm) {
            this.$emit('updateReportForm', true); // 更新的父组件，父组件去判断是否弹窗
          } else {
            this.$emit('updateReportForm', false); // 更新的父组件，父组件去判断是否弹窗
          }
        }
        let obj = {};
        obj = this.parameter.find((item) => {
          return item.name === '死亡人数'; // 筛选出匹配数据
        });
        // // console.log(obj.value);
        this.$store.commit('setDieNumber', obj && obj.value ? obj.value : 0);
      },
      deep: true,
    },
    /**
     * @lastEditor qinjiaqi
     * @lastDate 2020-9-30
     * @param {Object, Object} 传入的新值和表单原来的旧值
     * @return {type} undefined
     * @Description 监听事件表单
     */
    ruleForm: {
      handler(nV, oV) {
        this.$store.commit('setSituation', nV);
        this.$emit('getAll', this.dataALL, this.paramsData);
        let isSame = deepCompare(this.dataALL, nV); // 是否更新表单 true:两个对象一样；false：两个对象不一样
        this.isUpdateForm = !isSame; // 取反
        if (this.isUpdateParameter || this.isUpdateForm) {
          this.$emit('updateReportForm', true); // 更新的父组件，父组件去判断是否弹窗
        } else {
          this.$emit('updateReportForm', false); // 更新的父组件，父组件去判断是否弹窗
        }
      },
      deep: true,
    },

    // 新事件登记监听级联
    // 解决事件类型级联选择器点击不关闭的问题
    'emergencyForm.eventType'(newValue, oldValue) {
      if (this.$refs.eventType) {
        var children = this.$refs.eventType.getCheckedNodes();
        if (children.length > 0 && children[0].children.length < 1) {
          // 判断有没有下级
          this.$refs.eventType.dropDownVisible = false; // 监听值发生变化就关闭它
        }
      }
    },
    'emergencyForm.reportingUnit'(newValue, oldValue) {
      if (this.$refs.reportingUnit) {
        var children = this.$refs.reportingUnit.getCheckedNodes();
        if (children.length > 0 && children[0].children.length < 1) {
          // 判断有没有下级
          this.$refs.reportingUnit.dropDownVisible = false; // 监听值发生变化就关闭它
        }
      }
    },
    // 解决所属区域级联选择器点击不关闭的问题
    'emergencyForm.jurisdiction'(newValue, oldValue) {
      console.log(newValue, oldValue, 'newValue, oldValue');
      if (this.$refs.jurisdiction) {
        var children = this.$refs.jurisdiction.getCheckedNodes();
        if (
          children &&
          children.length > 0 &&
          children[0] &&
          children[0].children.length < 1
        ) {
          this.$refs.jurisdiction.dropDownVisible = false; // 监听值发生变化就关闭它
        }
      }
    },
  },
  destroyed() {
    window.removeEventListener('resize', this.getHeight);
    bus.$off('toSystemReport');
  },
  mounted() {
    this.$bus.$on('newFaxsComing', () => {
      this.getUnhandledFax();
    });
    this.$bus.$on('newSmssComing', () => {
      this.getUnhandledSms();
    });

    this.$bus.$on('closeNotification', () => {
      // console.log("closeNotification变了", this.$store.state.dispositionType);
      this.leftTabsType = this.$store.state.dispositionType;
    });

    // 监听系统上报事件的通知，点击了就跳转到系统上报
    bus.$on('toSystemReport', ({ eventId }) => {
      this.toSystemReport(eventId);
    });

    this.ruleForm.eventTitle = sessionStorage.getItem('title');
    // this.ruleForm.reportedTime = sessionStorage.getItem("time");
    // sessionStorage.setItem('LevelID', LevelID);
    this.$nextTick(() => {
      this.getEventRank();
    });

    let time = new Date().getTime();

    this.rushFaxData = time;
    this.backSms.background =
      'url(' + '/static/img/smsContent.png' + ')center no-repeat';
    this.backSms.backgroundSize = '220px';
    this.backPhone.background =
      'url(' + '/static/img/txtNull.png' + ')center no-repeat';
    this.backPhone.backgroundSize = '100px';
    this.getTabDatas();

    this.getStateListData();
    let wrap = document.getElementsByClassName(
      'informationDisposalNew_warp',
    )[0];
    if (wrap.parentNode) {
      if (wrap.parentNode.parentNode) {
        if (wrap.parentNode.parentNode.nextElementSibling) {
          if (
            wrap.parentNode.parentNode.nextElementSibling.nextElementSibling
          ) {
            if (
              wrap.parentNode.parentNode.nextElementSibling.nextElementSibling
                .style
            ) {
              wrap.parentNode.parentNode.nextElementSibling.nextElementSibling.style.visibility =
                'hidden';
              // // console.log(wrap.parentNode.parentNode.nextElementSibling.nextElementSibling)
              // // console.log(wrap.parentNode.parentNode.nextElementSibling.nextElementSibling.style)
            }
          }
        }
      }
    }
    // this.ruleForm.speakerName=sessionStorage.getItem('displayname')
    // this.ruleForm.speakerPhone=sessionStorage.getItem('mobile')
    // this.amendParameter()
    this.getEventCorrelationOptions(); // 关联事件
    this.getEventTitleArea(); // 所属区域
    this.getEventTypeOptions(); // 事件类型
    this.getEventGradeOptions(); // 事件等级
    this.getReportingUnitOptions(); // 报告单位
    this.toSystemReport(); // 点击通知后跳转到系统上报-需求417
  },
  methods: {
    /**
     * @description 跳转到系统上报
     */
    toSystemReport(eventId) {
      const path = window.document.location.href;
      if (path.lastIndexOf('?') > -1) {
        const str1 = path.substring(path.lastIndexOf('?'), path.length);
        const str2 = str1.substring(str1.lastIndexOf('to=') + 3, str1.length);
        if (str2 === 'systemReport') {
          this.leftTabsType = '系统上报';
          this.$refs.systemReportRef.getEventPageNum(eventId);
        }
      }
    },
    /**
     * @description 初始化突发事件表单数据
     */
    initEmergencyForm() {
      const initData = {
        eventDealId: '', // 事件续报ID
        eventCorrelation: {
          caseTitle: '',
          caseId: '',
        },
        jurisdiction: '',
        eventTitle: '',
        eventType: [],
        eventGrade: '',
        incidentTime: '',
        startingTime: '',
        incidentLocation: '',
        reportingUnit: '',
        reportingUnitName: '',
        contactNumber: '',
        parameter: [],
        accidentSituation: '',
        incidentCause: '',
        consequences: '',
        eventDevelopmentTrend: '',
        Measures: '',
        reportingUnitOptions: [],
        faxFileList: [],
        otherFileList: [],
      };
      Object.assign(this.emergencyForm, initData);
    },

    /**
     * @description 系统上报-右侧转到事件登记
     */
    handleToEventRegister(data) {
      // 加载事件的最新续报
      const eventDealData = data.eventData;
      this.emergencyForm.jurisdiction = eventDealData.incidenArea; // 所属区域
      this.emergencyForm.eventTitle = eventDealData.eventTitle; // 事件标题
      this.emergencyForm.parameter = eventDealData.eventParams; // 事件要素
      this.emergencyForm.eventType = eventDealData.incidenType; // 事件类型
      this.emergencyForm.eventGrade = eventDealData.incidentRank; // 事件等级
      this.emergencyForm.incidentTime = eventDealData.incidentTime; // 事发时间
      this.emergencyForm.reportedTime = eventDealData.reportedTime; // 接报时间
      this.emergencyForm.incidentLocation = eventDealData.incidentSite; // 事发地点
      this.emergencyForm.reportingUnit = ''; // 报告单位
      this.emergencyForm.reportingUnitName = eventDealData.platformName; // 报告单位
      this.emergencyForm.contactNumber = eventDealData.speakerPhone; // 联系电话
      this.emergencyForm.accidentSituation = eventDealData.reportDescription; // 事故情况
      this.emergencyForm.otherFileList = eventDealData.uploadFileData; // 其他附件
      this.emergencyForm.incidentCause = eventDealData.matterCause; // 事发原因
      this.emergencyForm.consequences = eventDealData.matterConsequence; // 已造成后果
      this.emergencyForm.eventDevelopmentTrend = eventDealData.matterTendency; // 事件发展趋势
      this.emergencyForm.Measures = eventDealData.step; // 已采取措施
      this.emergencyForm.matterTrun = eventDealData.matterTrun; // 转办人
      this.emergencyForm.matterTime = eventDealData.matterTime; // 转办时间
      this.emergencyForm.matterBranch = eventDealData.matterBranch; // 转办部门
      this.emergencyForm.fallFigureAddress = eventDealData.fallFigureAddress; // 落图地点
      this.emergencyForm.disposalSituation = eventDealData.disposalSituation; // 处置情况
      this.emergencyForm.accidentUnit = eventDealData.accidentUnit; // 事故单位

      // 转到事件登记
      this.eventEntering();
    },
    /**
     * @param {type} val 当前tab激活的对象
     * @descripttion:切换传真、短信、电话
     */
    handleTabChange(val) {
      if (val.name === '短信') {
        this.$store.commit('setSmsOrFax', 'sms');
      } else if (val.name === '传真') {
        this.$store.commit('setSmsOrFax', 'fax');
      } else {
        this.$store.commit('setSmsOrFax', 'phone');
      }
    },

    /**
     * @param {type} 没有
     * @return {type} undefined
     * @description：暂无关联事件时触发清空列表并能让其新增事件
     */
    addEvent() {
      let emEventId = sessionStorage.getItem('newID');
      let emCaseId = sessionStorage.getItem('caseID');
      let emEventContent = sessionStorage.getItem('createdEvent');
      this.$emit('setId', emEventId, emCaseId); // 清空之前将事件ID传给事件不保存时再次用来存储事件
      // this.$emit('addPath');
      this.titleType = '新增';
      sessionStorage.removeItem('newID');
      sessionStorage.removeItem('caseID');
      this.$emit('refreshEvent'); // 新增，移除旧的本地存储
      this.ruleForm.eventTitle = ''; // 清空事件标题
      this.ruleForm.reportedTime = ''; // 清空接报时间
      this.ruleForm.incidentTime = ''; // 清空事发时间
      this.ruleForm.incidenArea = []; // 清空所属区域
      this.ruleForm.incidentSite = ''; // 清空事发地点
      this.ruleForm.reportingUnit = []; // 清空报告单位
      this.ruleForm.incidenType = []; // 清空事件类型
      this.ruleForm.serialNumber = ''; // 清空事件等级
      this.ruleForm.reportSituation = ''; // 清空上报情况
      this.ruleForm.allCase = ''; // 清空总体情况
      this.ruleForm.speakerName = ''; // 清空报告人
      this.ruleForm.speakerPhone = ''; // 清空报告人电话
      this.ruleForm.timeOfWrittenSubmission = ''; // 清空书面报送时间
      this.ruleForm.accidentSituation = ''; // 清空事故情况
      this.ruleForm.beOnDuty = ''; // 清空值班员
      this.ruleForm.beOnDutyIds = []; // 清空值班员id
      this.ruleForm.leaderOnDuty = ''; // 清空值班领导
      this.ruleForm.leaderOnDutyIds = []; // 清空值班领导id
      this.ruleForm.submissionMethod = ''; // 清空接报方式
      this.ruleForm.deathToll = ''; // 清空死亡人数
      this.ruleForm.bruiseToll = ''; // 清空受伤人数
      this.ruleForm.disappearToll = ''; // 清空失踪人数
      this.ruleForm.deathNum = ''; // 清空死亡人数
      this.ruleForm.injuredNum = ''; // 清空受伤人数
      this.parameter = []; // 清空事件类型子参数
      this.test = ''; // 清空事件等级id
      this.latitude = ''; // 清空纬度
      this.longitude = ''; // 清空经度
      this.eventAddressBook = []; // 清空通讯库存储
      this.eventType = []; // 清空事件类型组
      this.eventTree = []; // 清空事件类型树
      this.reason = ''; // 清空事发原因
      this.result = ''; // 清空已造成后果
      this.growing = ''; // 清空事件发展趋势
      this.messure = ''; // 清空已采取措施
      let typeAdd = '新增'; // 标记该事件为新增
      this.$emit('addType', typeAdd);
      // 获取默认的事件类型子参数
      let data = {
        caseId: 0,
      };
      this.$api.defaultParameters(data).then((res) => {
        if (res.errorcode == '0') {
          this.parameter = res.data;
        } else {
          // this.$message.error(res.msg)
        }
      });
      // 如果本地有createdEvent项则调用
      if (emEventContent) {
        this.ruleForm.incidentTime = emEventContent.time;
        this.ruleForm.incidenArea = emEventContent.position;
        this.ruleForm.eventTitle = emEventContent.event;
      }
    },
    reportingUnitChange(val) {
      this.getReportingUnit(val[val.length - 1]);
    },

    /**
     * @lastEditor qinjiaqi
     * @lastDate 2020-9-30
     * @param {Object} 事件类型组
     * @return {type} undefined
     * @Description 改变事件类型子参数
     */
    incidenTypeChange(arr) {
      sessionStorage.setItem('caseID', arr[arr.length - 1]);
      this.amendParameter();
      var gettree = (data) => {
        for (var i = 0; i < data.length; i++) {
          if (data[i].id == arr[arr.length - 1]) {
            this.eventType = [];
            this.eventType.push({
              name: data[i].name,
              id: data[i].id,
            });
            return;
          } else {
            if (data[i].children) {
              gettree(data[i].children);
            }
          }
        }
      };
      gettree(this.eventTypeData);
    },

    areaTypeChange(arr) {
      var gettree = (data) => {
        for (var i = 0; i < data.length; i++) {
          if (data[i].id == arr[arr.length - 1]) {
            this.eventTree = [];
            this.eventTree.push({ name: data[i].name, id: data[i].id });
            return;
          } else {
            if (data[i].children) {
              gettree(data[i].children);
            }
          }
        }
      };
      gettree(this.jurisdictionData);
    },

    beOnDutyHandle() {
      this.beOnDutyVisible = true;
      this.$refs.beOnDutyDialog.checkboxGroup = this.ruleForm.beOnDutyIds;
    },

    changeBeOnDuty(checkboxGroup, checkboxData) {
      this.ruleForm.beOnDuty = '';
      this.beOnDutyVisible = false;
      this.ruleForm.beOnDutyIds = checkboxGroup;
      checkboxData.map((v) => {
        this.ruleForm.beOnDuty += v.name + '，';
      });
      this.ruleForm.beOnDuty = this.ruleForm.beOnDuty.substring(
        0,
        this.ruleForm.beOnDuty.length - 1,
      );
    },

    leaderOnDutyHandle() {
      this.leaderOnDutyVisible = true;
      this.$refs.leaderOnDutyDialog.checkboxGroup = this.ruleForm.leaderOnDutyIds;
    },
    changeLeaderOnDuty(checkboxGroup, checkboxData) {
      this.ruleForm.leaderOnDuty = '';
      this.leaderOnDutyVisible = false;
      this.ruleForm.leaderOnDutyIds = checkboxGroup;
      checkboxData.map((v) => {
        this.ruleForm.leaderOnDuty += v.name + '，';
      });
      this.ruleForm.leaderOnDuty = this.ruleForm.leaderOnDuty.substring(
        0,
        this.ruleForm.leaderOnDuty.length - 1,
      );
    },
    // 获取事件级别
    getEventRank() {
      let data = {
        pcode: 'emtlevel',
      };
      this.$api.eventLevel(data).then((res) => {
        if (res.errorcode == '0') {
          this.eventLevel = res.data;
        }
      });
    },
    visibleChange() {
      this.getEventRank();
    },
    // 测试下拉框
    testSelect() {
      // console.log(this.parameter);
    },
    openEventDetail(key) {
      if (sessionStorage.getItem('newID')) {
        this.isEventDetail = key == 1 ? true : false;
      } else {
        this.$message({
          message: '请先保存事件!',
          type: 'warning',
        });
      }
    },

    // 来文类型选择
    handleCommand(val) {
      this.faxForm.type = val;
    },
    // 转发
    msgTransmit(data) {
      // console.log(data);
      this.InformationDisposalShow = true;
      this.eventEnteringShow = false;
      const _that = this;
      setTimeout(() => {
        _that.activeAllModel = '短信';
        if (data.remark) {
          this.$store.commit('setCopyBusinessCard', data.remark);
          this.$refs.smsRight.setMsgType('转发');
        } else {
          this.$message.warning('内容为空');
        }
      }, 100);
    },
    // 回复
    msgReply(data) {
      this.InformationDisposalShow = true;
      this.eventEnteringShow = false;
      const _that = this;
      setTimeout(() => {
        _that.activeAllModel = '短信';
        // let obj = {
        //     contactorId: data.contactId,
        //     id:data.contactId,
        //     name: data.name,
        //     mobile: data.phone
        // }
        // _that.$refs.smsRight.peopleList = [obj]
        // _that.$refs.smsRight.msgForm.msgContent = data.remark
        // _that.$store.commit('setSmsMember',[obj])
        _that.$refs.smsRight.getfaxDataN([data.phone]);
      }, 100);
    },
    // 回复
    reply() {
      // console.log(this.$store.state.msgHeadleData);
      this.InformationDisposalShow = true;
      this.eventEnteringShow = false;
      const _that = this;
      setTimeout(() => {
        this.activeAllModel = '传真';
        if (this.$store.state.msgHeadleData) {
          this.$refs.IcpFaxRight.eventRelevance = false;
          this.$refs.IcpFaxRight.visFlag = true;
          this.$refs.IcpFaxRight.faxForm.caseId = this.faxForm.eventId;
          this.$refs.IcpFaxRight.faxForm.faxTitle = this.faxForm.title;
          this.$refs.IcpFaxRight.peopleList = [
            {
              fax: this.$store.state.msgHeadleData.phone,
              id: this.$store.state.msgHeadleData.id,
              name: this.$store.state.msgHeadleData.phone,
            },
          ];
          this.$store.commit('setFaxMember', [this.clickFaxInfo]);
          // console.log(
          //   "回复",
          //   this.activeAllModel,
          //   this.$store.state.msgHeadleData
          // );
        } else {
          this.$message.error('暂无数据');
        }
      }, 100);
    },
    // 转发
    transmit() {
      const _that = this;
      this.InformationDisposalShow = true;
      this.eventEnteringShow = false;
      setTimeout(() => {
        this.activeAllModel = '传真';
        if (this.$store.state.msgHeadleData) {
          this.$api
            .previewFax({ faxId: this.$store.state.msgHeadleData.id })
            .then((res) => {
              if (res.errorcode == 0) {
                // console.log(res.data);
                if (this.$refs.IcpFaxRight.faxFileList.length == 0) {
                  let objFile = new File(
                    ['First Line Text', 'Second Line Text'],
                    res.data,
                  );
                  this.$refs.IcpFaxRight.eventRelevance = false;
                  this.$refs.IcpFaxRight.visFlag = true;
                  this.$refs.IcpFaxRight.faxForm.caseId = this.faxForm.eventId;
                  this.$refs.IcpFaxRight.faxForm.faxTitle = this.faxForm.title;
                  this.$refs.IcpFaxRight.faxFileList.push(objFile);
                  this.$refs.IcpFaxRight.previewName = res.data;
                } else {
                  this.$message.warning('请点击清除按钮后重新选择文件上传!');
                }
              } else {
                this.$message.error(res.msg);
              }
            });
        } else {
          this.$message.error('暂无数据');
        }
      }, 100);
    },
    // 传真拆分
    activeResolution() {
      if (this.allFpxPreviewPath) {
        // console.log(this.allFpxPreviewPath);
        this.$refs.resolution.flag = true;
        this.$refs.resolution.oldFaxPath = this.allFpxPreviewPath;
      }
    },
    // 传真合并
    faxMergeOpen() {
      this.$refs.mergeFaxDialog.isMergeFaxDialog = true;
    },
    imgToText() {
      this.imgToTextVisible = true;
      this.$nextTick(() => {
        this.$refs.imgToText.oldFaxPath = '';
        // let filename = this.allFpxPreviewPath.substr(
        //   this.allFpxPreviewPath.lastIndexOf("/") + 1,this.allFpxPreviewPath.lastIndexOf("?")
        // ); // 72c0d9d068b34cbabe812ea171f0bf94.pdf
        this.$refs.imgToText.imageTextArr = [];
        // console.log(this.imgToTextId, this.faxForm);
        if (this.allFpxPreviewPath) {
          let fileName = this.allFpxPreviewPath.substring(
            this.allFpxPreviewPath.lastIndexOf('/') + 1,
            this.allFpxPreviewPath.lastIndexOf('?'),
          ); // 72c0d9d068b34cbabe812ea171f0bf94.pdf
          // console.log("fileName: ", fileName);
          let data = {
            faxId: this.imgToTextId,
            fileName,
            isSingle: true,
          };
          // let loading = this.$loading({
          //   lock: true,
          //   text: "识别中...",
          //   spinner: "el-icon-loading",
          //   background: "rgba(0, 0, 0, 0.7)",
          // });
          this.$api.splitPdf(data).then((res) => {
            if (res.errorcode == 0) {
              if (res.data.length > 0) {
                this.$refs.imgToText.imageTextArr = res.data;
                this.$refs.imgToText.getPageData(res.data[0], 0);
              } else {
                this.$refs.imgToText.imageTextArr = [];
              }
              this.$refs.imgToText.flag = true;
              this.$refs.imgToText.oldFaxPath = this.allFpxPreviewPath;
              // loading.close();
            } else {
              this.$message.error(res.msg);
              this.$refs.imgToText.imageTextArr = [];
              this.$refs.imgToText.oldFaxPath = '';
              // loading.close();
            }
          });
        }
      });
    },
    closeFaxDialog() {
      this.$refs.mergeFaxDialog.isMergeFaxDialog = false;
      this.timerDate = new Date().getTime();
    },
    rushContent() {
      // 刷新传真子组件
      let time = new Date().getTime();
      // console.log(time);
      this.rushFaxData = time;
    },
    recordingInstance(node) {
      this.audioPlanData = node; // 获取到录音的实例
    },
    copyTextSuccess(e) {
      this.$message.success('复制成功');
      // 把数据复制到文本域
      this.$refs.newFaxModel.copyToTextarea(e.text);
    },
    copyTextError() {
      this.$message.error('复制失败');
    },
    rowClick(row) {
      this.row = row;
    },
    saveEdite(item, types) {
      if (!this.selectState) {
        this.editIndex = '';
        return;
      }
      let data = {
        type: types,
        id: item.id,
        statusId: this.selectState,
      };
      // console.log(data);
      this.$api.disposeEvent(data).then((res) => {
        if (res.errorcode == 0) {
          this.editIndex = '';
          if (types == 'fax') {
            this.getUnhandledFax();
          } else if (types == 'phone') {
            this.audioPlanData.stop();
            this.phoneTreeLoading = true;
            this.phoneRushe = false;
            this.$nextTick(() => {
              this.testAudio = false;
              this.phoneRushe = true;
              this.audioUrlData = '';
              this.audioId = '';
              this.phoneText = '';
            });
            this.getUnhandledPhone();
          } else if (types == 'sms') {
            this.getUnhandledSms();
          }
        } else {
          // this.$message.error(res.msg)
        }
      });
    },
    tabClick(tab, event) {
      // console.log("this.leftTabsType", this.leftTabsType);
      this.queryFaxAllTime = '';
      this.queryFaxAllSelect = '';
      this.phonePerson = '';
      this.leftEventId = '';
      this.changeIndex = -1;
      this.currentFaxPage = 1;
      this.InformationDisposalShow = false;
      this.eventEnteringShow = true;
      this.ruleForm.speakerName = '';
      this.ruleForm.speakerPhone = '';
      this.$nextTick(() => {
        // 切换tabs时刷新右侧辅助页面的数据
        this.activeAllModel = '传真'; // 默认传真
        this.InformationDisposalShow = true;
        this.eventEnteringShow = false;
        this.changeRed = '通讯处置';
      });
      if (tab.name == '传真') {
        // this.treeLoading = true;
        this.faxRushe = false;
        this.$nextTick(() => {
          this.allFpxPreviewPath = '';
          this.faxRushe = true;
        });
        this.getUnhandledFax();
        this.nowTag = 'fax';
        this.$store.commit('setSmsOrFax', 'fax');
      } else if (tab.name == '电话') {
        this.phoneTreeLoading = true;
        this.phoneRushe = false;
        this.$nextTick(() => {
          this.testAudio = false;
          this.phoneRushe = true;
          this.audioUrlData = '';
          this.audioId = '';
          this.phoneText = '';
        });
        this.getUnhandledPhone();
        this.nowTag = 'phone';
        this.$store.commit('setSmsOrFax', 'phone');
      } else if (tab.name == '短信') {
        this.smsTreeLoading = true;
        this.smsText = '';
        this.getUnhandledSms();
        this.nowTag = 'sms';
        this.$store.commit('setSmsOrFax', 'sms');
      } else if (tab.name === 'APP上报') {
        this.initEmergencyForm();
        this.$refs.appReportIndex.getReportData('normal'); // 获取APP上报数据
        this.$refs.appReportIndex.incidentType(); // 获取事件类型
        this.$refs.appReportIndex.getStateListData(); // 获取处置状态
      } else if (tab.name === '系统上报') {
        this.initEmergencyForm();
      }
    },
    /**
     * @lastEditor qinjiaqi
     * @lastDate 2020-10-26
     * @param {type} 无
     * @return {type} undefined
     * @Description 自适应高度
     */
    getHeight() {
      // 自适应高度
      let h =
        document.documentElement.clientHeight || document.body.clientHeight;
      this.elTablePlanStyle.height = (h - (68 + 235) + 98) / 2 + 'px';
      this.elTablePlanStyleNext.height = h - (68 + 235) + 40 + 'px'; // 原件预览文件区域高度
      this.listHeight.height = h - (68 + 450) + 120 + 'px';
      this.heightStyle.height = h - (68 + 235) + 103 + 'px';
      this.rightHeightStyle.height = h - (68 + 163 + 40) + 198 + 'px';
      this.saveEntering.height = h - (11 + 190) + 'px';
      this.turnTheText.height = (h - (68 + 235) + 54) / 2 - 34 + 'px';
      // 信息登记高度
      this.infoEnteringStyle.height = h - (68 + 118 + 40) + 138 + 'px';
      // 事件登记高度
      this.eventEnteringStyle.height = h - (68 + 118 + 40) + 138 + 'px';
    },
    getTabDatas() {
      // 获取事件列表
      let data = {
        size: this.pageSize,
        page: this.currentPage,
      };
      this.myLoading = true;
      this.$api
        .eventHistory(data)
        .then((res) => {
          if (res.errorcode == 0) {
            this.gridData = res.data.data;
            this.total = res.data.totalElements;
          }
          this.myLoading = false;
        })
        .catch(() => {
          this.myLoading = false;
        });
    },
    allModelCloseDialog() {
      this.$emit('allModelCloseDialog');
    },
    closeDialog() {
      // colse关闭窗口
      this.addEventDialog = false;
      this.$refs.eventDialog.clearData(); // 刷新子组件数据
      // this.$emit('refreshEvent')
    },
    handleCurrentFaxChange(val) {
      // 传真model分页器
      this.$emit('handleCurrentFaxChange', val);
    },
    // 获取报告单位
    getReportingUnit(id) {
      // console.log("报送单位：", id);
      let departId = parseInt(id);
      let departName = '';
      if (
        this.reportingUnitData.filter((item) => item.id === departId).length > 0
      ) {
        let departArr = [];
        departArr.push(
          this.reportingUnitData.filter((item) => item.id === departId)[0].id,
        );
        departName = this.reportingUnitData.filter(
          (item) => item.id === departId,
        )[0].name;
        this.ruleForm.reportingUnitName = departName;
        this.ruleForm.reportingUnit = departArr;
      }
      if (
        this.reportingUnitData.filter((item) => item.id === departId).length ===
        0
      ) {
        for (let i = 0; i < this.reportingUnitData.length; i++) {
          let departArr = [];
          departArr.push(this.reportingUnitData[i].id);
          if (
            this.reportingUnitData[i].children &&
            this.reportingUnitData[i].children.filter((item) => item.id === id)
              .length > 0
          ) {
            // console.log("选中报送单位：", this.reportingUnitData[i]);
            departName = this.reportingUnitData[i].children.filter(
              (item) => item.id === id,
            )[0].name;
            this.ruleForm.reportingUnitName = departName;
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
                  // console.log("选中报送单位：", child[j]);
                  departArr.push(child[j].id);
                  departName = child[j].name;
                  this.ruleForm.reportingUnitName = departName;
                  this.ruleForm.reportingUnit = departArr;
                }
              }
            }
          }
        }
      }
      // console.log("报告单位：", departId, departName);
      // console.log(
      //   "报告单位：",
      //   this.ruleForm.reportingUnit,
      //   this.ruleForm.reportingUnitName
      // );
      return departName;
    },
    /**
     * @description 获取灾害类型id
     * @param {number | string} caseClassId
     */
    getCaseClassId(caseClassId) {
      const typeIds = getRelations({
        arr: this.emergencyForm.eventTypeOptions,
        relationKey: 'id',
        findKey: 'id',
        findValue: Number(caseClassId),
      });
      const typeNames = getRelations({
        arr: this.emergencyForm.eventTypeOptions,
        relationKey: 'name',
        findKey: 'id',
        findValue: Number(caseClassId),
      });
      return {
        typeIds,
        typeNames,
      };
    },

    // 获取所属区域的id
    getIncidenAreaId(areaId) {
      const areaIdArr = getRelations({
        arr: this.emergencyForm.jurisdictionOptions,
        relationKey: 'id',
        findKey: 'id',
        findValue: Number(areaId),
      });
      this.ruleForm.incidenArea = areaIdArr;
      return areaIdArr;
    },

    // 点击传真列表
    changeItem(item, index) {
      console.log('ddddddddddddddddddddd');
      console.log(item);
      this.clickFaxInfo = {
        id: item.contactId,
        name: item.name || item.phone,
        fax: item.phone,
      };
      this.currentFax = item;
      item.sendType = 'fax';
      item.sendTypeId = item.id;
      this.$store.dispatch('msgHeadleDatas', item);
      this.faxcontactId = item.contactId;
      this.phonePerson = '';
      this.changeIndex = index;
      this.allFpxPreviewPath = '';
      this.textShow = '';
      this.leftEventId = item.id;
      this.imgToTextId = item.id;
      this.phonePerson = item.phone;
      this.faxForm = { ...item };

      this.faxForm.eventId = item.eventId; // 如果没有id，设置为空
      this.faxForm.eventTitle = item.event;
      this.nowTag = 'fax';
      // 判断当前联事件id是否存在关联事件列表里面
      if (item === 0) {
        this.faxForm.eventId = '';
      }
      // console.log("faxForm", this.faxForm);
      // 判断当前联事件id是否存在关联事件列表里面，如果不存在，faxForm.eventId为空
      // this.isHaveEventId(item.eventId);

      // 获取pdf
      let data1 = {
        faxId: item.id,
      };
      // this.$api.previewFax(data1).then((res) => {
      //   if (res.errorcode == 0) {
      //     this.allFpxPreviewPath = `${window.g.ApiUrl}/fax/${
      //       res.data
      //     }?timeStamp=${new Date().getTime()}`;
      //   } else {
      //     // this.$message.error(res.msg)
      //   }
      // });
      if (item.eventId === '' || !item.eventId || item.eventId === undefined) {
        this.addEvent(); // 没有关联事件则清空事件登记表单数据
      } else {
        // 有关联事件则获取事件详情
        // 报告人
        let data = {
          id: item.eventId,
        };
        this.$api.findById(data).then((res) => {
          // alert('根据事件id获取事件详情')
          // console.log(res);
          if (res.errorcode == '0') {
            this.ruleForm.eventTitle = res.data.event.title;
            this.ruleForm.reportedTime = res.data.event.reportTime;
            this.ruleForm.incidentTime = res.data.event.occurTime;
            this.ruleForm.incidenArea = [res.data.event.areaId];
            this.ruleForm.incidentSite = res.data.event.address;
            this.ruleForm.reportingUnit = res.data.event.reportDepartId;
            this.ruleForm.reportingUnitName = res.data.event.reportDepart;
            this.ruleForm.incidenType = [res.data.event.caseClassId];
            // this.ruleForm.incidentRank = res.data.event.eventLevel;
            this.test = res.data.event.eventLevelId;
            this.ruleForm.reportSituation = res.data.event.reportSuperior;
            this.ruleForm.allCase = res.data.event.reportDescription;
            this.eventTree.push({
              name: res.data.event.area,
              id: res.data.event.areaId,
            });
            this.eventType.push({
              name: res.data.event.caseClass,
              id: res.data.event.caseClassId,
            });
            this.longitude = res.data.event.longitude;
            this.latitude = res.data.event.latitude;
            this.ruleForm.speakerName = res.data.event.reportMan;
            this.ruleForm.speakerPhone = res.data.event.reportNum;
            this.ruleForm.timeOfWrittenSubmission =
              res.data.event.writtenReportTime;
            this.ruleForm.accidentSituation = res.data.event.accidentSituation;
            this.ruleForm.beOnDuty = res.data.event.dutyPeople;
            this.ruleForm.leaderOnDuty = res.data.event.dutyLeader;
            this.ruleForm.submissionMethod = res.data.event.reportType;

            if (res.data.event.reportDepartId !== 0) {
              this.getReportingUnit(res.data.event.reportDepartId);
            }
            if (
              res.data.event.reportDepartId === 0 &&
              res.data.event.reportDepart !== ''
            ) {
              // 旧数据 res.data.event.reportDepartId为0 res.data.event.reportDepart为报送单位id
              // 获取reportDepartId
              this.getReportingUnit(res.data.event.reportDepart);
            }
            this.getIncidenAreaId(res.data.event.areaId);
            const { typeIds } = this.getCaseClassId(
              res.data.event.caseClassId,
            );
            this.ruleForm.incidenType = typeIds;
            /**
             * 获取电话计时是否开启存储在本地存储
             * **/
            let extend1 = res.data.event.extend1;
            let extend2 = res.data.event.extend2;
            sessionStorage.setItem('phoneExtend1', extend1);
            sessionStorage.setItem('smsExtend2', extend2);

            // 重新赋值不绑定
            this.dataALL.eventTitle = res.data.event.title;
            this.dataALL.reportedTime = res.data.event.reportTime;
            this.dataALL.incidentTime = res.data.event.occurTime;
            this.dataALL.incidenArea = [res.data.event.areaId];
            this.dataALL.incidentSite = res.data.event.address;
            this.dataALL.reportingUnit = res.data.event.reportDepart;
            this.dataALL.incidenType = [res.data.event.caseClassId];
            // this.dataALL.incidentRank = res.data.event.eventLevel;
            this.dataALL.serialNumber = res.data.event.eventCode;
            this.dataALL.reportSituation = res.data.event.reportSuperior;
            this.dataALL.allCase = res.data.event.reportDescription;
            this.dataALL.speakerName = res.data.event.reportMan;
            this.dataALL.speakerPhone = res.data.event.reportNum;

            this.dataALL.timeOfWrittenSubmission =
              res.data.event.writtenReportTime;
            this.dataALL.accidentSituation = res.data.event.accidentSituation;
            this.dataALL.beOnDuty = res.data.event.dutyPeople;
            this.dataALL.leaderOnDuty = res.data.event.dutyLeader;
            this.dataALL.submissionMethod = res.data.event.reportType;

            this.reason = res.data.event.reason;
            this.result = res.data.event.result;
            this.growing = res.data.event.growing;
            this.messure = res.data.event.messure;

            this.ruleForm.serialNumber = res.data.event.eventCode;
            if (
              res.data.event.levelId !== 0 &&
              res.data.event.levelId !== '' &&
              res.data.event.planId !== '' &&
              res.data.event.planId !== 0
            ) {
              // 已经启动过预案
              this.$store.commit('setTurnOnEmergencyResponse', true);
            } else {
              // 没启动过预案
              this.$store.commit('setTurnOnEmergencyResponse', false);
            }

            if (res.data.eventParams.length == 0) {
              this.eventsParameters = false;
            } else {
              this.eventsParameters = true;
              // // console.log('this.parameter: ',  this.parameter);
              setTimeout(() => {
                this.parameter = res.data.eventParams;
              }, 600);
              this.paramsData = res.data.eventParams; // 重新赋值数据库数据做对比
            }
            this.$emit('getAll', this.dataALL, this.paramsData);
            // // console.log('parameter: ', parameter);
          }
        });
      }
    },

    // 判断当前联事件id是否存在关联事件列表里面，如果不存在，faxForm.eventId为空
    /* isHaveEventId(eventId) {
      let filterEvent = this.eventOptions.filter(item => item.id === eventId)
      if (filterEvent.length > 0) {
        this.faxForm.eventId = eventId; // 如果有关联事件，则赋值
      } else {
        this.faxForm.eventId = ""; // 如果没有关联事件，则清空
      }
      // console.log('该传真关联的事件id：', this.faxForm.eventId)
    }, */
    isHaveEventId(eventId) {
      for (let i in this.eventOptions) {
        if (this.eventOptions[i].id === eventId) {
          this.faxForm.eventId = eventId; // 如果有id，则赋值
          this.faxForm.eventTitle = this.eventOptions[i].title; // 如果有标题，则赋值
          return false;
        } else {
          this.faxForm.eventId = ''; // 如果没有id，设置为空
          this.faxForm.eventTitle = obj.event;
        }
      }
    },

    // 点击电话列表
    clickPhoneList(item, index) {
      console.log(item, '点击电话列表');
      this.phonePerson = '';
      this.leftEventId = '';
      this.changeIndex = index;
      this.audioList = {};
      this.audioUrlData = '';
      this.phoneText = '';
      this.leftEventId = item.id;
      this.phonePerson = item.phone;
      this.nowTag = 'phone';
      // 获取录音文件
      let data = {
        phoneId: item.id,
      };
      this.$api.audioUrl(data).then((res) => {
        if (res.errorcode == 0) {
          if (res.data.url && res.data.url !== '') {
            this.testAudio = false;
            this.$nextTick(() => {
              this.testAudio = true;
              this.audioId = item.id;
              this.audioUrlData = window.SITE_CONFIG['cloudUrl'] + res.data.url;
            });
          } else {
            this.testAudio = false;
          }
        } else {
          this.testAudio = false;
          this.audioUrlData = null;
          // this.$message.error(res.msg)
        }
      });
      // 获取录音转文本内容
      // this.$api.phoneToText(data).then((res) => {
      //   if (res.errorcode == 0) {
      //     this.phoneText = res.data;
      //   } else {
      //     // // this.$message.error(res.msg)
      //   }
      // });
      // 报告人
      this.$api.findContactorByMobile({ phoneNum: item.phone }).then((res) => {
        if (res.code == 0) {
          this.ruleForm.speakerName = res.mailContactor
            ? res.mailContactor.name
            : '';
          this.ruleForm.speakerPhone = res.mailContactor
            ? res.mailContactor.mobile1 ||
              res.mailContactor.homeTel ||
              res.mailContactor.officeTel
            : '';
        } else {
          this.$message.error(res.msg);
        }
      });
      if (this.isNewDevelopmentCode) {
        if (
          item.eventId == '' ||
          item.eventId == null ||
          item.eventId === undefined
        ) {
          this.emergencyForm.eventCorrelation.caseTitle = ''; // 首报标题
          this.emergencyForm.eventCorrelation.caseId = ''; // 首报id
          this.emergencyForm.jurisdiction = ''; // 所属区域
          this.emergencyForm.eventTitle = ''; // 事件标题
          this.emergencyForm.parameter = ''; // 事件要素
          this.emergencyForm.eventType = ''; // 事件类型
          this.emergencyForm.eventGrade = ''; // 事件等级
          this.emergencyForm.incidentTime = ''; // 事发时间
          this.emergencyForm.incidentLocation = ''; // 事发地点
          this.emergencyForm.reportingUnit = ''; // 报告单位
          this.emergencyForm.contactNumber = ''; // 联系电话
          this.emergencyForm.accidentSituation = ''; // 事故情况
          this.emergencyForm.faxFileList = []; // 传真附件
          this.emergencyForm.otherFileList = []; // 其他附件
          this.emergencyForm.incidentCause = ''; // 事发原因
          this.emergencyForm.consequences = ''; // 已造成后果
          this.emergencyForm.eventDevelopmentTrend = ''; // 事件发展趋势
          this.emergencyForm.Measures = ''; // 已采取措施
        } else {
          var obj = {
            id: item.eventId,
            title: item.event,
          };
          this.onSelectEventCorrelation(obj);
        }
      } else {
        if (
          item.eventId === '' ||
          !item.eventId ||
          item.eventId === undefined
        ) {
          this.addEvent(); // 没有关联事件则清空事件登记表单数据
        } else {
          // 有关联事件则获取事件详情
          // 报告人
          let data = {
            id: item.eventId,
          };
          this.$api.findById(data).then((res) => {
            // alert('根据事件id获取事件详情')
            // console.log(res);
            if (res.errorcode == '0') {
              this.ruleForm.eventTitle = res.data.event.title;
              this.ruleForm.reportedTime = res.data.event.reportTime;
              this.ruleForm.incidentTime = res.data.event.occurTime;
              this.ruleForm.incidenArea = [res.data.event.areaId];
              this.ruleForm.incidentSite = res.data.event.address;
              this.ruleForm.reportingUnit = res.data.event.reportDepartId;
              this.ruleForm.reportingUnitName = res.data.event.reportDepart;
              this.ruleForm.incidenType = [res.data.event.caseClassId];
              // this.ruleForm.incidentRank = res.data.event.eventLevel;
              this.test = res.data.event.eventLevelId;
              this.ruleForm.reportSituation = res.data.event.reportSuperior;
              this.ruleForm.allCase = res.data.event.reportDescription;
              this.eventTree.push({
                name: res.data.event.area,
                id: res.data.event.areaId,
              });
              this.eventType.push({
                name: res.data.event.caseClass,
                id: res.data.event.caseClassId,
              });
              this.longitude = res.data.event.longitude;
              this.latitude = res.data.event.latitude;
              this.ruleForm.speakerName = res.data.event.reportMan;
              this.ruleForm.speakerPhone = res.data.event.reportNum;
              this.ruleForm.timeOfWrittenSubmission =
                res.data.event.writtenReportTime;
              this.ruleForm.accidentSituation =
                res.data.event.accidentSituation;
              this.ruleForm.beOnDuty = res.data.event.dutyPeople;
              this.ruleForm.leaderOnDuty = res.data.event.dutyLeader;
              this.ruleForm.submissionMethod = res.data.event.reportType;

              if (res.data.event.reportDepartId !== 0) {
                this.getReportingUnit(res.data.event.reportDepartId);
              }
              if (
                res.data.event.reportDepartId === 0 &&
                res.data.event.reportDepart !== ''
              ) {
                // 旧数据 res.data.event.reportDepartId为0 res.data.event.reportDepart为报送单位id
                // 获取reportDepartId
                this.getReportingUnit(res.data.event.reportDepart);
              }
              this.getIncidenAreaId(res.data.event.areaId);
              const { typeIds } = this.getCaseClassId(
                res.data.event.caseClassId,
              );
              this.ruleForm.incidenType = typeIds;
              // console.log("事件数据：", this.ruleForm);
              /**
               * 获取电话计时是否开启存储在本地存储
               * **/
              let extend1 = res.data.event.extend1;
              let extend2 = res.data.event.extend2;
              sessionStorage.setItem('phoneExtend1', extend1);
              sessionStorage.setItem('smsExtend2', extend2);

              // 重新赋值不绑定
              this.dataALL.eventTitle = res.data.event.title;
              this.dataALL.reportedTime = res.data.event.reportTime;
              this.dataALL.incidentTime = res.data.event.occurTime;
              this.dataALL.incidenArea = [res.data.event.areaId];
              this.dataALL.incidentSite = res.data.event.address;
              this.dataALL.reportingUnit = res.data.event.reportDepart;
              this.dataALL.incidenType = [res.data.event.caseClassId];
              // this.dataALL.incidentRank = res.data.event.eventLevel;
              this.dataALL.serialNumber = res.data.event.eventCode;
              this.dataALL.reportSituation = res.data.event.reportSuperior;
              this.dataALL.allCase = res.data.event.reportDescription;
              this.dataALL.speakerName = res.data.event.reportMan;
              this.dataALL.speakerPhone = res.data.event.reportNum;

              this.dataALL.timeOfWrittenSubmission =
                res.data.event.writtenReportTime;
              this.dataALL.accidentSituation = res.data.event.accidentSituation;
              this.dataALL.beOnDuty = res.data.event.dutyPeople;
              this.dataALL.leaderOnDuty = res.data.event.dutyLeader;
              this.dataALL.submissionMethod = res.data.event.reportType;

              this.reason = res.data.event.reason;
              this.result = res.data.event.result;
              this.growing = res.data.event.growing;
              this.messure = res.data.event.messure;

              this.ruleForm.serialNumber = res.data.event.eventCode;

              if (
                res.data.event.levelId !== 0 &&
                res.data.event.levelId !== '' &&
                res.data.event.planId !== '' &&
                res.data.event.planId !== 0
              ) {
                // 已经启动过预案
                this.$store.commit('setTurnOnEmergencyResponse', true);
              } else {
                // 没启动过预案
                this.$store.commit('setTurnOnEmergencyResponse', false);
              }

              if (res.data.eventParams.length == 0) {
                this.eventsParameters = false;
              } else {
                this.eventsParameters = true;
                // // console.log('this.parameter: ',  this.parameter);
                setTimeout(() => {
                  this.parameter = res.data.eventParams;
                }, 600);
                this.paramsData = res.data.eventParams; // 重新赋值数据库数据做对比
              }
              this.$emit('getAll', this.dataALL, this.paramsData);
              // // console.log('parameter: ', parameter);
            }
          });
        }
      }
    },
    // 点击短信列表
    clickSmsList(item, index) {
      console.log(item, 'index');
      this.phonePerson = '';
      this.leftEventId = '';
      this.changeIndex = index;
      this.smsText = item.title || '';
      this.leftEventId = item.id;
      this.phonePerson = item.phone;
      this.nowTag = 'sms';
      // 报告人
      this.$api.findContactorByMobile({ phoneNum: item.phone }).then((res) => {
        if (res.code == 0) {
          this.ruleForm.speakerName = res.mailContactor
            ? res.mailContactor.name
            : '';
          this.ruleForm.speakerPhone = res.mailContactor
            ? res.mailContactor.mobile1 ||
              res.mailContactor.homeTel ||
              res.mailContactor.officeTel
            : '';
        } else {
          this.$message.error(res.msg);
        }
      });

      if (this.isNewDevelopmentCode) {
        if (
          item.eventId == '' ||
          item.eventId == null ||
          item.eventId === undefined
        ) {
          this.emergencyForm.eventCorrelation.caseTitle = ''; // 首报标题
          this.emergencyForm.eventCorrelation.caseId = ''; // 首报id
          this.emergencyForm.jurisdiction = ''; // 所属区域
          this.emergencyForm.eventTitle = ''; // 事件标题
          this.emergencyForm.parameter = ''; // 事件要素
          this.emergencyForm.eventType = ''; // 事件类型
          this.emergencyForm.eventGrade = ''; // 事件等级
          this.emergencyForm.incidentTime = ''; // 事发时间
          this.emergencyForm.incidentLocation = ''; // 事发地点
          this.emergencyForm.reportingUnit = ''; // 报告单位
          this.emergencyForm.contactNumber = ''; // 联系电话
          this.emergencyForm.accidentSituation = ''; // 事故情况
          this.emergencyForm.faxFileList = []; // 传真附件
          this.emergencyForm.otherFileList = []; // 其他附件
          this.emergencyForm.incidentCause = ''; // 事发原因
          this.emergencyForm.consequences = ''; // 已造成后果
          this.emergencyForm.eventDevelopmentTrend = ''; // 事件发展趋势
          this.emergencyForm.Measures = ''; // 已采取措施
        } else {
          console.log(item, 'item');
          let data = {
            smsId: item.id,
          };
          this.$api.getEventBySmsId(data).then((res) => {
            if (res.errorcode === 0) {
              var obj = {
                id: res.data.eventId,
                title: res.data.eventName,
              };
              this.onSelectEventCorrelation(obj);
            }
          });
        }
      } else {
        if (
          !item.eventId === '' ||
          !item.eventId ||
          item.eventId === undefined
        ) {
          this.addEvent(); // 没有关联事件则清空事件登记表单数据
        } else {
          // 有关联事件则获取事件详情
          // 报告人
          let data = {
            id: item.eventId,
          };
          this.$api.findById(data).then((res) => {
            // alert('根据事件id获取事件详情')
            // // console.log(res,1111);
            if (res.errorcode == '0') {
              this.ruleForm.eventTitle = res.data.event.title;
              this.ruleForm.reportedTime = res.data.event.reportTime;
              this.ruleForm.incidentTime = res.data.event.occurTime;
              this.ruleForm.incidenArea = [res.data.event.areaId];
              this.ruleForm.incidentSite = res.data.event.address;
              this.ruleForm.reportingUnit = res.data.event.reportDepartId;
              this.ruleForm.reportingUnitName = res.data.event.reportDepart;
              this.ruleForm.incidenType = [res.data.event.caseClassId];
              // this.ruleForm.incidentRank = res.data.event.eventLevel;
              this.test = res.data.event.eventLevelId;
              this.ruleForm.reportSituation = res.data.event.reportSuperior;
              this.ruleForm.allCase = res.data.event.reportDescription;
              this.eventTree.push({
                name: res.data.event.area,
                id: res.data.event.areaId,
              });
              this.eventType.push({
                name: res.data.event.caseClass,
                id: res.data.event.caseClassId,
              });
              this.longitude = res.data.event.longitude;
              this.latitude = res.data.event.latitude;
              this.ruleForm.speakerName = res.data.event.reportMan;
              this.ruleForm.speakerPhone = res.data.event.reportNum;
              this.ruleForm.timeOfWrittenSubmission =
                res.data.event.writtenReportTime;
              this.ruleForm.accidentSituation =
                res.data.event.accidentSituation;
              this.ruleForm.beOnDuty = res.data.event.dutyPeople;
              this.ruleForm.leaderOnDuty = res.data.event.dutyLeader;
              this.ruleForm.submissionMethod = res.data.event.reportType;

              if (res.data.event.reportDepartId !== 0) {
                this.getReportingUnit(res.data.event.reportDepartId);
              }
              if (
                res.data.event.reportDepartId === 0 &&
                res.data.event.reportDepart !== ''
              ) {
                // 旧数据 res.data.event.reportDepartId为0 res.data.event.reportDepart为报送单位id
                // 获取reportDepartId
                this.getReportingUnit(res.data.event.reportDepart);
              }
              this.getIncidenAreaId(res.data.event.areaId);
              const { typeIds } = this.getCaseClassId(
                res.data.event.caseClassId,
              );
              this.ruleForm.incidenType = typeIds;

              /**
               * 获取电话计时是否开启存储在本地存储
               * **/
              let extend1 = res.data.event.extend1;
              let extend2 = res.data.event.extend2;
              sessionStorage.setItem('phoneExtend1', extend1);
              sessionStorage.setItem('smsExtend2', extend2);

              // 重新赋值不绑定
              this.dataALL.eventTitle = res.data.event.title;
              this.dataALL.reportedTime = res.data.event.reportTime;
              this.dataALL.incidentTime = res.data.event.occurTime;
              this.dataALL.incidenArea = [res.data.event.areaId];
              this.dataALL.incidentSite = res.data.event.address;
              this.dataALL.reportingUnit = res.data.event.reportDepart;
              this.dataALL.incidenType = [res.data.event.caseClassId];
              // this.dataALL.incidentRank = res.data.event.eventLevel;
              this.dataALL.serialNumber = res.data.event.eventCode;
              this.dataALL.reportSituation = res.data.event.reportSuperior;
              this.dataALL.allCase = res.data.event.reportDescription;
              this.dataALL.speakerName = res.data.event.reportMan;
              this.dataALL.speakerPhone = res.data.event.reportNum;

              this.dataALL.timeOfWrittenSubmission =
                res.data.event.writtenReportTime;
              this.dataALL.accidentSituation = res.data.event.accidentSituation;
              this.dataALL.beOnDuty = res.data.event.dutyPeople;
              this.dataALL.leaderOnDuty = res.data.event.dutyLeader;
              this.dataALL.submissionMethod = res.data.event.reportType;

              this.reason = res.data.event.reason;
              this.result = res.data.event.result;
              this.growing = res.data.event.growing;
              this.messure = res.data.event.messure;

              this.ruleForm.serialNumber = res.data.event.eventCode;

              if (
                res.data.event.levelId !== 0 &&
                res.data.event.levelId !== '' &&
                res.data.event.planId !== '' &&
                res.data.event.planId !== 0
              ) {
                // 已经启动过预案
                this.$store.commit('setTurnOnEmergencyResponse', true);
              } else {
                // 没启动过预案
                this.$store.commit('setTurnOnEmergencyResponse', false);
              }

              if (res.data.eventParams.length == 0) {
                this.eventsParameters = false;
              } else {
                this.eventsParameters = true;
                // // console.log('this.parameter: ',  this.parameter);
                setTimeout(() => {
                  this.parameter = res.data.eventParams;
                }, 600);
                this.paramsData = res.data.eventParams; // 重新赋值数据库数据做对比
              }
              this.$emit('getAll', this.dataALL, this.paramsData);
              // // console.log('parameter: ', parameter);
            }
          });
        }
      }
    },

    // 事件关联emit
    eventDataRequest(eventId) {
      this.$api
        .findEventDealList({
          eventId,
        })
        .then((res) => {
          if (res.errorcode === 0) {
            let obj;
            res.data.forEach(function (item, index) {
              // console.log(item, '事件关联');
              obj = item;
            });
            // this.onSelectEventCorrelation(obj);
          }
          console.log(
            '%c [ xxx ]',
            'font-size:13px; background:pink; color:#bf2c9f;',
            res,
          );
        });
    },

    eventRelevance(item) {
      // 事件关联
      this.eventList = true;
      this.id = item.id;
    },
    pageMode() {
      // 监听是第几页
    },
    beforeClose() {
      // 叉叉弹窗关闭销毁
      this.eventList = false;
      this.rushKist = false; // 放在关闭时能解决V-if闪屏问题
      this.$nextTick(() => {
        this.rushKist = true;
      });
    },
    colser() {
      // 取消
      this.eventList = false;
      this.rushKist = false; // 放在关闭时能解决V-if闪屏问题
      this.$nextTick(() => {
        this.rushKist = true;
      });
    },
    cufim() {
      // 确认
      this.eventList = false;
      this.rushKist = false; // 放在关闭时能解决V-if闪屏问题
      this.$nextTick(() => {
        this.rushKist = true;
      });
      // console.log(this.row);
      if (this.row) {
        let data = {
          eventId: this.row.id,
          id: this.id,
          type: this.nowTag,
        };
        // console.log(data);
        this.$api.relateEvent(data).then((res) => {
          if (res.errorcode == '0') {
            // console.log(res.data);
            if (this.nowTag == 'fax') {
              this.getUnhandledFax();
            } else if (this.nowTag == 'phone') {
              this.getUnhandledPhone();
            } else if (this.nowTag == 'sms') {
              this.getUnhandledSms();
            }
            this.$message({
              message: '关联成功',
              type: 'success',
            });
          } else {
            // this.$message.error(res.msg)
          }
        });
      }
      this.row = '';
    },
    InformationDisposal() {
      // 事件录入
      this.changeRed = '通讯处置';
      this.eventEnteringShow = false;
      this.InformationDisposalShow = true;
      this.infoEnteringShow = false;
    },
    eventEntering() {
      // 信息处置
      this.changeRed = '事件登记';
      this.eventEnteringShow = true;
      this.InformationDisposalShow = false;
      this.infoEnteringShow = false;
    },
    infoEntering() {
      // 信息处置
      this.changeRed = '信息登记';
      console.log(this.faxForm);
      this.infoEnteringShow = true;
      this.eventEnteringShow = false;
      this.InformationDisposalShow = false;
    },
    // 根据修改的事件类型获取事件参数
    amendParameter(type) {
      let caseIdParameter = sessionStorage.getItem('caseID');
      // console.log("caseIdParameter: ", caseIdParameter);
      let data = {
        caseId: caseIdParameter,
      };
      this.$api.defaultParameters(data).then((res) => {
        if (res.errorcode == '0') {
          // console.log(res.data);
          if (res.data.length > 0) {
            this.eventsParameters = true;
            this.parameter = res.data;
            if (type === 'APP') {
              this.emergencyForm.parameter = this.parameter; // 信息要素
            }
            // console.log("this.parameter:", this.parameter);
          }
        } else {
          // this.$message.error(res.msg)
        }
      });
    },
    getUnhandledFax() {
      // 获取未处理的传真
      this.treeLoading = true;
      const _that = this;
      let time1 = '';
      let time2 = '';
      if (this.queryFaxAllTime) {
        // console.log(this.queryFaxAllTime);
        time1 = this.formatDateTime(this.queryFaxAllTime[0]);
        time2 = this.formatDateTime(this.queryFaxAllTime[1]);
      }
      let data = {
        beginTime: time1,
        endTime: time2,
        key: this.queryFaxAllSelect, // 关键词
        page: this.currentFaxPage,
        size: 10,
        statusId: this.faxStateValue,
        faxType: this.faxTypeValue,
      };
      // // console.log(data)
      this.$api
        .getUnhandledFax(data)
        .then((res) => {
          if (res.errorcode == 0) {
            if (res.data) {
              this.faxList = res.data.data;
              // console.log("传真列表：", this.faxList, res.data.data);
              this.totalFax = res.data.total;
              if (res.data.data.length != 0) {
                setTimeout(() => {
                  res.data.data[0].sendType = 'fax';
                  res.data.data[0].sendTypeId = res.data.data[0].id;
                  let ifTypeFlag =
                    (_that.isNewDevelopmentCode &&
                      !(_that.leftTabsType == '传真') &&
                      !(_that.leftTabsType == '一键通') &&
                      !(_that.leftTabsType == '小型移动应急平台')) ||
                    !_that.isNewDevelopmentCode;
                  if (_that.InformationDisposalShow && ifTypeFlag) {
                    setTimeout(() => {
                      // console.log(_that.$refs);
                      _that.$refs.IcpFaxRight.visFlag = true;
                      _that.$refs.IcpFaxRight.eventRelevance = false;
                      _that.$refs.IcpFaxRight.msgHeadleState = 'yes';
                      _that.$refs.smsRight.msgHeadleState = 'yes';
                    }, 500);
                  }
                  _that.$store.dispatch('msgHeadleDatas', res.data.data[0]);
                }, 500);
                this.getEventOptions();
                setTimeout(() => {
                  _that.changeItem(
                    _that.changeIndex != -1
                      ? res.data.data[_that.changeIndex]
                      : res.data.data[0],
                    _that.changeIndex != -1 ? _that.changeIndex : 0,
                  );
                  // this.changeItem(
                  //   res.data.data[0],
                  //   this.changeIndex != -1 ? this.changeIndex : 0
                  // );
                }, 200);
              }
            }
            this.treeLoading = false;
          } else {
            // this.$message.error(res.msg)
            this.faxList = [];
            this.totalFax = 0;
            this.treeLoading = false;
          }
        })
        .catch(() => {
          this.faxList = [];
          this.totalFax = 0;
          this.treeLoading = false;
        });
    },
    getUnhandledPhone() {
      const _that = this;
      // 获取未处理的电话
      let time1 = '';
      let time2 = '';
      this.phoneTreeLoading = true;
      this.changeIndex = -1;
      this.nowTag = 'phone';
      this.phonePerson = '';
      this.InformationDisposalShow = false;
      this.eventEnteringShow = true;
      this.$nextTick(() => {
        // 切换tabs时刷新右侧辅助页面的数据
        this.activeAllModel = '传真'; // 默认传真
        this.InformationDisposalShow = true;
        this.eventEnteringShow = false;
        this.changeRed = '通讯处置';
      });
      if (this.queryFaxAllTime) {
        // console.log(this.queryFaxAllTime);
        time1 = this.formatDateTime(this.queryFaxAllTime[0]);
        time2 = this.formatDateTime(this.queryFaxAllTime[1]);
      }
      let data = {
        beginTime: time1,
        endTime: time2,
        key: this.queryFaxAllSelect,
        page: this.currentFaxPage,
        size: 10,
        statusId: this.faxStateValue,
        faxType: this.faxTypeValue,
      };
      // console.log(data);
      this.$api.getUnhandledPhone(data).then((res) => {
        // console.log(res);
        if (res.errorcode == 0) {
          this.list = res.data.data;
          this.totalFax = res.data.total;
          this.phoneTreeLoading = false;
          setTimeout(() => {
            _that.$refs.IcpFaxRight.msgHeadleState = 'yes';
            _that.$refs.smsRight.msgHeadleState = 'yes';
          }, 100);
          this.clickPhoneList(res.data.data[0], 0);
        } else {
          // this.$message.error(res.msg)
        }
      });
    },
    getUnhandledSms() {
      const _that = this;
      // 获取未处理的短信
      let time1 = '';
      let time2 = '';
      this.smsText = '';
      this.smsTreeLoading = true;
      this.changeIndex = -1;
      this.nowTag = 'sms';
      this.phonePerson = '';
      this.InformationDisposalShow = false;
      this.eventEnteringShow = true;
      this.$nextTick(() => {
        // 切换tabs时刷新右侧辅助页面的数据
        this.activeAllModel = '传真'; // 默认传真
        this.InformationDisposalShow = true;
        this.eventEnteringShow = false;
        this.changeRed = '通讯处置';
      });
      if (this.queryFaxAllTime) {
        time1 = this.formatDateTime(this.queryFaxAllTime[0]);
        time2 = this.formatDateTime(this.queryFaxAllTime[1]);
      }
      const data = {
        beginTime: time1,
        endTime: time2,
        key: this.queryFaxAllSelect,
        page: this.currentFaxPage,
        size: 10,
        statusId: this.faxStateValue,
        faxType: this.faxTypeValue,
      };
      this.$api.getReceiveSms(data).then((res) => {
        if (res.errorcode === 0) {
          this.list = res.data.data;
          this.totalFax = res.data.total;
          this.smsTreeLoading = false;
          setTimeout(() => {
            _that.$refs.IcpFaxRight.msgHeadleState = 'yes';
            _that.$refs.smsRight.msgHeadleState = 'yes';
          }, 100);
          if (res.data.data.length > 0) {
            this.clickSmsList(res.data.data[0], 0);
            // 短信的事件要用接口调
            const resquestData = {
              smsId: res.data.data[0].smsId || res.data.data[0].id,
            };
            this.$api.getEventBySmsId(resquestData).then((response) => {
              if (response.errorcode === 0) {
                const obj = {
                  id: response.data.eventId,
                  title: response.data.eventName,
                };
                this.onSelectEventCorrelation(obj);
              }
            });
          }
        } else {
          // this.$message.error(res.msg)
        }
      });
    },
    formatDateTime(time) {
      let date = time;
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? '0' + m : m;
      let d = date.getDate();
      d = d < 10 ? '0' + d : d;
      return y + '-' + m + '-' + d;
    },
    // 生成事件报文模板
    eventMessage() {
      let data = {
        caseId: sessionStorage.getItem('caseID'),
        typeId: '699',
        page: 1,
        size: 10,
      };
      this.$api.templateList(data).then((res) => {
        if (res.errorcode == 0) {
          // console.log(res.data.data);
          res.data.data.forEach((item, i) => {
            let addClass = item.content;
            // console.log(addClass);
            // 替换事件基本信息，没填的不替换、保留占位符
            if (
              this.ruleForm.eventTitle !== undefined
              // this.ruleForm.eventTitle !== null &&
              // this.ruleForm.eventTitle !== ""
            ) {
              addClass = addClass.replace(
                '【事件标题】',
                this.ruleForm.eventTitle,
              );
            }
            if (
              this.ruleForm.reportedTime !== undefined &&
              this.ruleForm.reportedTime !== null &&
              this.ruleForm.reportedTime !== ''
            ) {
              addClass = addClass.replace(
                '【接报时间】',
                this.ruleForm.reportedTime,
              );
            }
            if (
              this.ruleForm.incidentTime !== undefined &&
              this.ruleForm.incidentTime !== null &&
              this.ruleForm.incidentTime !== ''
            ) {
              addClass = addClass.replace(
                '【事发时间】',
                this.ruleForm.incidentTime,
              );
            }
            if (this.ruleForm.incidenArea.length > 0) {
              addClass = addClass.replace(
                '【事发区域】',
                this.ruleForm.incidenArea,
              );
            }
            if (
              this.ruleForm.incidentSite !== undefined &&
              this.ruleForm.incidentSite !== null &&
              this.ruleForm.incidentSite !== ''
            ) {
              addClass = addClass.replace(
                '【事发地点】',
                this.ruleForm.incidentSite,
              );
            }
            if (this.ruleForm.reportingUnit.length > 0) {
              addClass = addClass.replace(
                '【报送单位】',
                this.ruleForm.reportingUnit,
              );
            }
            if (this.ruleForm.incidenType.length > 0) {
              addClass = addClass.replace(
                '【事件类型】',
                this.ruleForm.incidenType,
              );
            }
            if (
              this.ruleForm.speakerName !== undefined &&
              this.ruleForm.speakerName !== null &&
              this.ruleForm.speakerName !== ''
            ) {
              addClass = addClass.replace(
                '【报告人-姓名】',
                this.ruleForm.speakerName,
              );
            }
            if (
              this.ruleForm.speakerPhone !== undefined &&
              this.ruleForm.speakerPhone !== null &&
              this.ruleForm.speakerPhone !== ''
            ) {
              addClass = addClass.replace(
                '【报送人-电话】',
                this.ruleForm.speakerPhone,
              );
            }
            if (
              this.reason !== undefined &&
              this.reason !== null &&
              this.reason !== ''
            ) {
              addClass = addClass.replace('【事发原因】', this.reason);
            }
            if (
              this.result !== undefined &&
              this.result !== null &&
              this.result !== ''
            ) {
              addClass = addClass.replace('【已造成后果】', this.result);
            }
            if (
              this.growing !== undefined &&
              this.growing !== null &&
              this.growing !== ''
            ) {
              addClass = addClass.replace('【事件发展趋势】', this.growing);
            }
            if (
              this.messure !== undefined &&
              this.messure !== null &&
              this.messure !== ''
            ) {
              addClass = addClass.replace('【已采取措施】', this.messure);
            }

            for (let param of this.parameter) {
              // console.log(param);
              // console.log(`【${param.name}】` === "【类型】");
              // 需要根据信息要素名称匹配替换的字符串，名称为空则跳过
              if (
                param.name === undefined ||
                param.name === null ||
                param.name === ''
              ) {
                continue;
              }
              if (
                param.value === undefined ||
                param.value === null ||
                param.value === ''
              ) {
                // 没填时显示暂无
                addClass = addClass.replace(`【${param.name}】`, '暂无');
              } else {
                let str = `${param.value}`;
                if (
                  param.unit === undefined ||
                  param.unit === null ||
                  param.unit === ''
                ) {
                  str = `${param.value}`;
                } else {
                  str = `${param.value}(${param.unit})`;
                }
                addClass = addClass.replaceAll(`【${param.name}】`, str);
                // // console.log(addClass.indexOf(`【${param.name}】`, addClass[39])); // 39
                // // console.log(`【${param.name}】`)
              }
              /*
                let paramString =
                  paramItem.name === "时间"
                    ? ` ${paramItem.name}: ${paramItem.value};`
                    : paramItem.value == 0
                    ? ` ${paramItem.name}:暂无  `
                    : ` ${paramItem.name}:${paramItem.value}(${paramItem.unit});`;
                 */
            }

            /*
              if (item.content.indexOf("参数项") !== -1) {
                // console.log(item.content.indexOf("【参数项】"));
                let paramIndex = item.content.indexOf("【参数项】");
                addClass = addClass.substr(0, paramIndex);

                for (let param of arr) {
                  addClass += param;
                }
                // console.log(addClass);
                // addClass = item.content // !!!!!
                // // console.log(item.content)
                // // console.log('addClass', this.ruleForm)
              }
              */

            // OK

            // addClass = addClass.replace('【参数项】 【值】【单位】；', '')
            // // console.log(addClass)

            // // console.log(arr); // ["受伤人数: 0(位);", "时间: null(null);", "死亡人数: 0(位);", "文本: null(本);"]

            // if(item.content.indexOf('受伤人数')!=-1){
            //   this.parameter.forEach((it,i)=>{// 情景要素
            //     if(it.name.indexOf('受伤人数')!=-1){
            //       addClass = addClass.replace("【受伤人数】",it.value==(null||undefined)?0:it.value);
            //     }
            //
            //   })
            //
            // }
            // if(item.content.indexOf('时间')!=-1){
            //   this.parameter.forEach((it,i)=>{// 情景要素
            //     if(it.name.indexOf('时间')!=-1){
            //       addClass = addClass.replace("【时间】",it.value==(null||undefined)?'暂无时间':it.value);
            //     }
            //
            //   })
            // }
            //
            // if(item.content.indexOf('死亡人数')!=-1){
            //   this.parameter.forEach((it,i)=>{// 情景要素
            //     if(it.name.indexOf('死亡人数')!=-1){
            //       addClass = addClass.replace("【死亡人数】",it.value==(null||undefined)?0:it.value);
            //     }
            //
            //   })
            // }
            //
            // if(item.content.indexOf('文本')!=-1){
            //   this.parameter.forEach((it,i)=>{// 情景要素
            //     if(it.name.indexOf('文本')!=-1){
            //       addClass = addClass.replace("【文本】",it.value==(null||undefined)?0 :it.value);
            //     }
            //
            //   })
            // }
            this.addClass = addClass;
            this.autoGenerAtion();
            // this.ruleForm.allCase =addClass
          });
        } else {
          // this.$message.error(res.msg)
        }
      });
    },
    // 根据事件标题匹配事件类型和预案
    matchingTitle() {
      let eventTypeId = 0;
      let areaTypeId = 0;
      if (this.eventType.length > 0) {
        eventTypeId = this.eventType[0].id;
      }
      if (this.incidenArea.length > 0) {
        areaTypeId = this.incidenArea[0].id;
      }
      let data = {
        title: this.ruleForm.eventTitle,
        caseClassId: eventTypeId,
        areaId: areaTypeId,
      };
      this.$api.matchPreplan(data).then((res) => {
        if (res.errorcode == 0) {
          if (res.data === '' || res.data === []) {
            this.ruleForm.incidenType = [];
            this.eventType = [];
            return;
          }
          this.ruleForm.incidenType = res.data.caseClass.name;
          this.eventType = [];
          this.eventType.push({
            name: res.data.caseClass.name,
            id: res.data.caseClass.id,
          });
        } else {
          // this.$message.error(res.msg)
        }
      });
    },
    // 发送事发地点
    sendSite() {
      if (
        this.emergencyForm.incidentSite == '' ||
        this.latitude == '' ||
        this.longitude == ''
      ) {
        this.$message({
          message: '请先选择事发地点',
          type: 'warning',
        });
        return;
      }
      if (this.emergencyForm.eventTitle == '' || this.emergencyForm.eventTitle == null) {
        this.$message({
          message: '请先填写事件标题',
          type: 'warning',
        });
        return;
      }
      this.selectTitle = '选择联系人';
      this.selectData = true;
      this.$refs.selectDialog.getListTree();
    },
    // 关闭事发地点的弹窗
    closeMultiple() {
      this.hackResetMultiple = false;
      this.$nextTick(() => {
        // this.$nextTick执行一轮循环后刷新dom。
        this.hackResetMultiple = true;
      });
      this.selectData = false;
    },
    autoGenerAtion() {
      if (
        this.ruleForm.reportedTime == '' ||
        this.ruleForm.reportedTime == null ||
        this.ruleForm.reportedTime == undefined
      ) {
        this.$message({
          message: '请填写接报时间',
          type: 'warning',
        });
        return;
      }
      if (
        this.ruleForm.incidentTime == '' ||
        this.ruleForm.incidentTime == null ||
        this.ruleForm.incidentTime == undefined
      ) {
        this.$message({
          message: '请填写事发时间',
          type: 'warning',
        });
        return;
      }
      if (
        this.ruleForm.allCase == '' ||
        this.ruleForm.allCase == null ||
        this.ruleForm.allCase == undefined
      ) {
        this.$refs.ruleForm.clearValidate();

        this.ruleForm.allCase = this.addClass;
        //             `${this.ruleForm.reportedTime}接报:${this.ruleForm.incidentTime},发生${this.ruleForm.incidenType}事故事件。
        // 事件过程:
        // 事发原因: ${this.reason==null||undefined?'':this.reason}
        // 已造成后果:${this.result==null||undefined?'':this.result}
        // 事件发展趋势:${this.growing==null||undefined?'':this.growing}
        // 已采取措施:${this.messure==null||undefined?'':this.messure}
        //             `
      } else {
        this.$confirm(
          '基本情况已有内容, 是否覆盖?点击【取消】则自动生成的内容到末尾',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          },
        )
          .then(() => {
            this.$refs.ruleForm.clearValidate();
            this.ruleForm.allCase = '';
            this.ruleForm.allCase = this.addClass;
            //             this.ruleForm.allCase =
            //               `${this.ruleForm.reportedTime}接报:${this.ruleForm.incidentTime},发生${this.ruleForm.incidenType}事故事件。
            // 事件过程:
            // 事发原因: ${this.reason==null||undefined?'':this.reason}
            // 已造成后果:${this.result==null||undefined?'':this.result}
            // 事件发展趋势:${this.growing==null||undefined?'':this.growing}
            // 已采取措施:${this.messure==null||undefined?'':this.messure}
            //               `
          })
          .catch(() => {
            this.$refs.ruleForm.clearValidate();
            // console.log(this.ruleForm.allCase, this.addClass);
            this.ruleForm.allCase += `\n\n${this.addClass}`;
            //               `\n\n${this.ruleForm.reportedTime}接报:${this.ruleForm.incidentTime},发生${this.ruleForm.incidenType}事故事  。
            // 事件过程:
            // 事发原因: ${this.reason==null||undefined?'':this.reason}
            // 已造成后果:${this.result==null||undefined?'':this.result}
            // 事件发展趋势:${this.growing==null||undefined?'':this.growing}
            // 已采取措施:${this.messure==null||undefined?'':this.messure}
            //               `
          });
      }
    },
    getTimes() {
      // 获取现在的时间
      let now = new Date();
      let year = now.getFullYear(); // 年
      let month = now.getMonth() + 1; // 月
      let day = now.getDate(); // 日
      let hh = now.getHours(); // 时
      let mm = now.getMinutes(); // 分
      let ss = now.getSeconds(); // 秒
      let clock = year + '-';
      if (month < 10) clock += '0';
      clock += month + '-';
      if (day < 10) clock += '0';
      clock += day + ' ';
      if (hh < 10) clock += '0';
      clock += hh + ':';
      if (mm < 10) clock += '0';
      clock += mm + ':';
      if (ss < 10) clock += '0';
      clock += ss;
      // this.ruleForm.incidentTime=clock
      this.ruleForm.reportedTime = clock;
      // this.ruleForm.reportedTime = this.faxForm.time;// 暂时把初始值强硬改成传真时间，需要再改回来
    },
    // 发送事发地点弹窗确认
    confirmMultiple(checkedCities) {
      // console.log(checkedCities);
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
      let data = {
        title: this.ruleForm.title,
        location: this.ruleForm.incidentSite, // 位置
        latitude: this.latitude, // 纬度
        longitude: this.longitude, // 经度
        contacts: checkedCities,
      };
      this.$api.sendLocation(data).then((res) => {
        if (res.errorcode == 0) {
          this.currentPage = 1;
          this.selectData = false;
          this.$message({
            message: '发送成功！',
            type: 'success',
          });
          this.getStaetData();
        } else {
          // this.$message.error(res.msg)
        }
      });
    },
    closeMyDialogMultiple() {
      this.hackResetMultiple = false;
      this.$nextTick(() => {
        // this.$nextTick执行一轮循环后刷新dom。
        this.hackResetMultiple = true;
      });
      this.selectData = false;
    },
    saveEvent() {
      // 保存事件
      if (this.changeIndex == -1) {
        this.$message.warning('请先选中关联左侧列表事件');
        return false;
      }
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let eventTreeId = this.eventTree;
          let eventTypeId = this.eventType;

          if (eventTreeId.length == 0) {
            eventTreeId = '';
          } else {
            eventTreeId = eventTreeId[0].id;
          }
          if (eventTypeId.length == 0) {
            eventTypeId = '';
          } else {
            eventTypeId = eventTypeId[0].id;
          }
          if (this.longitude == '' || this.longitude == undefined) {
            this.longitude = null;
          }
          if (this.latitude == '' || this.latitude == undefined) {
            this.latitude = null;
          }
          // console.log(eventTreeId, eventTypeId);
          let data = {
            // eventCode:this.ruleForm.serialNumber,
            vcTitle: this.ruleForm.eventTitle, // 事件标题
            typeId: this.leftEventId,
            type: this.nowTag, // fax,phone,sms
            dtReportTime:
              this.ruleForm.reportedTime.length < 19
                ? this.ruleForm.reportedTime + ':00'
                : this.ruleForm.reportedTime, // 接报时间 格式为yyyy-MM-dd HH:mm 的时间，需要在后加”:00“ author:hexinting date:2020-11-13 bug8161
            dtOccurTime:
              this.ruleForm.incidentTime.length < 19
                ? this.ruleForm.incidentTime + ':00'
                : this.ruleForm.incidentTime, // 事发时间 格式为yyyy-MM-dd HH:mm 的时间，需要在后加”:00“ author:hexinting date:2020-11-11 bug8161
            iAreaId: this.ruleForm.incidenArea[
              this.ruleForm.incidenArea.length - 1
            ], // 事发区域ID
            // eventTreeId, // 事发区域ID
            vcAddress: this.ruleForm.incidentSite, // 事发地点
            dLongitude: this.longitude, // 经度
            dLatitude: this.latitude, // 纬度
            // vcReportDepart: this.ruleForm.reportingUnit[this.ruleForm.reportingUnit.length-1], // 报送单位
            vcReportDepart: this.ruleForm.reportingUnitName, // 报送单位
            vcReportDepartId: this.ruleForm.reportingUnit[
              this.ruleForm.reportingUnit.length - 1
            ],
            iCaseClassId: eventTypeId, // 事件类型
            // iEventLevel: this.test,// 事件等级
            iEvnetSetingParams: this.parameter, // 事件参数
            txtReportSuperior: this.ruleForm.reportSituation, // 上报情况
            txtReportDescription: this.ruleForm.allCase, // 总体情况
            vcReportMan: this.ruleForm.speakerName,
            vcReportNum: this.ruleForm.speakerPhone,
            // deathNum: this.ruleForm.deathNum,
            // injuredNum: this.ruleForm.injuredNum,
            writtenReportTime: this.ruleForm.timeOfWrittenSubmission, // 书面报送时间
            reportType: this.ruleForm.submissionMethod, // 报送方式
            accidentSituation: this.ruleForm.accidentSituation, // 事故情况
            dutyPeople: this.ruleForm.beOnDuty, // 值班员
            dutyLeader: this.ruleForm.leaderOnDuty, // 值班领导
            phoneId:
              this.phoneHistalId == '' || undefined ? null : this.phoneHistalId,
            remark:
              this.phoneHistalremack == '' || undefined
                ? null
                : this.phoneHistalremack,
            cgcsLongitude: this.cgcsLongitude,
            cgcsLatitude: this.cgcsLatitude
          };
          this.$api.saveEventReceive(data).then((res) => {
            if (res.errorcode == '0') {
              this.$message({
                message: '保存事件成功!',
                type: 'success',
              });
              if (this.nowTag == 'fax') {
                this.getUnhandledFax();
              } else if (this.nowTag == 'phone') {
                this.getUnhandledPhone();
              } else if (this.nowTag == 'sms') {
                this.getUnhandledSms();
              }
              // let eventId = res.data.id;
              // this.reload()
            } else {
              this.$message({
                message: res.msg,
                type: 'error',
              });
            }
          });
        }
      });
    },
    close() {
      // 弹出选择取消
      this.addEventDialog = false;
      // sessionStorage.setItem('caseID', this.caseFor)
      // sessionStorage.setItem('areaId',this.areaIdArr)
      // sessionStorage.setItem('area',this.areaNameArr)
      this.$refs.eventDialog.clearData(); // 刷新子组件数据
    },
    // 树点击事件
    handleNodeClick(data) {
      let type = this.title;
      switch (type) {
        case '选择区域':
          this.eventTree = [];
          this.eventTree.push({ name: data.name, id: data.id });
          break;
        case '选择联系人分组':
          // console.log(data.name);
          this.eventAddressBook = [];
          this.eventAddressBook.push({ name: data.name, id: data.id });
          break;
        case '选择事件类型':
          this.eventType = [];
          this.eventType.push({ name: data.name, id: data.id });
          break;
        default:
          break;
      }
    },
    confirm() {
      // 弹窗选择确定
      let type = this.title;
      switch (type) {
        case '选择区域':
          this.ruleForm.incidenArea = this.eventTree[0].name;
          break;
        case '选择联系人分组':
          this.ruleForm.submittedUnit = this.eventAddressBook[0].name;
          break;
        case '选择事件类型':
          this.ruleForm.incidenType = this.eventTypeList[0].name;
          let data = this.eventTypeList[0].id;
          this.caseid = this.eventTypeList[0].id; // 给生成模板用
          // console.log(this.eventTypeList, this.caseid);
          this.amendParameter(this.eventTypeList[0].id);
          break;
        default:
          break;
      }
      this.$refs.eventDialog.clearData(); // 刷新子组件数据
      this.addEventDialog = false;
    },
    // 通讯录
    addressBook() {
      this.$api.topUnitTree().then((res) => {
        if (res.errorcode === 0) {
          if (res.data) {
            this.reportingUnitData = res.data;
            var gettree = function (data) {
              for (var i = 0; i < data.length; i++) {
                if (!data[i].children || data[i].children.length == 0) {
                  data[i].children = undefined;
                } else {
                  gettree(data[i].children);
                }
              }
            };
            gettree(this.reportingUnitData);
          }
        }
      });
    },
    eventScene() {
      this.$http
        .get(`${window.SITE_CONFIG.baseUrl}/sys/systown/list`)
        .then((response) => {
          if (response.data.code === 0) {
            let options = [];
            response.data.list.forEach((item) => {
              options.push({
                label: item.townName,
                value: item.id,
              });
            });
            this.jurisdictionData = options;
          }
        });
    },
    incidentType() {
      // this.title = "选择事件类型";
      let data = {};
      this.$api.getTree(data).then((res) => {
        if (res.errorcode == '0') {
          // // console.log(res);
          this.eventTypeData = res.data;
          var gettree = function (data) {
            for (var i = 0; i < data.length; i++) {
              if (!data[i].children || data[i].children.length == 0) {
                data[i].children = undefined;
              } else {
                gettree(data[i].children);
              }
            }
          };
          gettree(this.eventTypeData);
        }
      });
    },

    handleLocation() {
      console.log('%c [ xxx ]', 'font-size:13px; background:pink; color:#bf2c9f;', 123123);
      this.$refs.LocationDialogRef.open({
        longitude: this.longitude,
        latitude: this.latitude,
        address: this.emergencyForm.fallFigureAddress,
        cgcsLongitude: this.cgcsLongitude,
        cgcsLatitude: this.cgcsLatitude
      }).then(({ longitude, latitude, address,cgcsLongitude, cgcsLatitude }) => {
        this.longitude = longitude;
        this.latitude = latitude;
        this.emergencyForm.fallFigureAddress = address;
        this.cgcsLatitude = cgcsLatitude;
        this.cgcsLongitude = cgcsLongitude;
      });
    },

    locationCallback(obj) {
      if (obj.data.action && obj.data.action == 'retpoint') {
        let latlon = obj.data.object.point.split(',');
        this.longitude = latlon[0];
        // console.log(latlon[0], latlon[1]);
        this.latitude = latlon[1];
        this.ruleForm.incidentSite = obj.data.object.address;
        this.$refs.loction.visible = false;
      }
    },
    sendLocationMsg(obj) {
      if (obj.data.action && obj.data.action == 'ready') {
        // console.log(this.longitude);
        // console.log(this.latitude);
        if (this.longitude && this.latitude) {
          this.longitude = '';
          this.latitude = '';
          this.ruleForm.incidentSite = '';
          // var framew = window.mapFrame.contentWindow;
          var mapFarme = document.getElementById('informId');
          if (mapFarme) {
            var data = {};
            data.action = 'getpoint';
            var object = {};
            object.center = this.longitude + ',' + this.latitude;
            object.address = this.ruleForm.incidentSite;
            object.area = '';
            data.object = object;
            mapFarme.contentWindow.postMessage(JSON.stringify(data), '*');
          }
        }
      }
    },
    // turTheText(){ // 语音转文字
    //   if(this.voiceUrl==''||this.voiceUrl==null){
    //     return
    //   }
    //   let extenion=this.voiceUrl.split('.');
    //   // console.log(extenion);
    //   let data={
    //     url:this.voiceUrl,
    //     extenion:extenion[4]
    //   }
    //   this.$api.downloadRecordToText(data).then((res) => {
    //     if(res.errorcode=='0'){
    //       // console.log(res.data);
    //       this.word=res.data.result
    //     }
    //   })
    // },
    /**
     * @param {type} 没有
     * @return {String} 按格式生成的标题
     * @description：一键生成标题
     */
    generateTheTitle() {
      let oneTime = '';
      let twoTime = '';
      // 辖区名字
      let { areaName } = this.getIncidenArea();
      // 事件类型
      let { typeNames } = this.getCaseClassId(this.ruleForm.incidentType[this.ruleForm.incidentType.length - 1])

      if (this.ruleForm.incidentTime) {
        oneTime = this.ruleForm.incidentTime.substring(5, 7);
        twoTime = this.ruleForm.incidentTime.substring(8, 10);
      }
      this.ruleForm.eventTitle = `${oneTime}.${twoTime} ${areaName}/${typeNames.join('/')}`;
      this.$message({
        message: '生成成功',
        type: 'success',
      });
      this.$refs['ruleForm'].clearValidate(['eventTitle']);
    },
    // 语音截取识别成功赋值文字
    sendPhoneText(val) {
      this.phoneText = val;
    },
    // 电话一键核实
    phoneVerification() {
      if (this.phonePerson == '' || this.leftEventId == '') {
        this.$message({
          message: '请选择需要核实的内容!',
          type: 'warning',
        });
        return;
      }
      this.InformationDisposalShow = true;
      this.eventEnteringShow = false;
      this.$nextTick(() => {
        this.activeAllModel = '电话';
        this.changeRed = '通讯处置';
        this.$refs.newPhoneModel.oneKeyCheck(this.phonePerson);
      });
    },
    // 短信一键核实
    smsCheck() {
      if (this.phonePerson == '' || this.leftEventId == '') {
        this.$message({
          message: '请选择需要核实的内容!',
          type: 'warning',
        });
        return;
      }
      this.InformationDisposalShow = true;
      this.eventEnteringShow = false;
      this.$nextTick(() => {
        this.activeAllModel = '电话';
        this.changeRed = '通讯处置';
        this.$refs.newPhoneModel.oneKeyCheck(this.phonePerson);
      });
    },
    // 传真一键核实
    faxCheck() {
      if (this.phonePerson == '' || this.leftEventId == '') {
        this.$message({
          message: '请选择需要核实的内容!',
          type: 'warning',
        });
        return;
      }
      this.InformationDisposalShow = true;
      this.eventEnteringShow = false;
      this.$nextTick(() => {
        this.activeAllModel = '电话';
        this.changeRed = '通讯处置';
        this.$refs.newPhoneModel.oneKeyCheck(this.faxcontactId);
      });
    },
    submitClose() {
      this.phonesText = '';
      this.isAddPhonesShow = false;
    },
    submitPhones() {
      if (this.phonesText.length == 0) {
        this.$message.warning('输入不能为空');
      } else {
        let data = this.phonesText.split(/[,，]/) || [];
        data = [...new Set(data)];
        let data1 = [];
        data.forEach((o) => {
          if (/^(\d{3,4}-)?\d{7,8}$/.test(o)) {
            data1.push(o);
          } else {
            setTimeout(() => {
              this.$message.error('传真号码格式错误:' + o);
            }, 500);
          }
        });
        if (data1.length == 0) {
          this.$message.warning('请输入正确的传真号码');
        } else {
          this.$refs.IcpFaxRight.getfaxDataN(data1);
        }
      }
    },
    // 获取未办结事件
    getEventOptions() {
      let ipData = {
        dtStart: '',
        dtEnd: '',
        searchText: this.searchText,
        page: this.currentPage,
        size: 10,
      };
      this.$api.todolist(ipData).then((res) => {
        if (res.errorcode == 0) {
          if (!res.data) {
            return;
          }
          this.eventOptions.push(...res.data.data);
          this.loadMore = res.data.data.length == 0 ? false : true;
        } else {
          // // this.$message.error(res.msg)
        }
      });
    },
    /**
     * editorName: qinjiaqi
     * @param {type} 没有
     * @return {type} undefined
     * @description：在原先保存信息登记的代码上添加validate判断表单数据
     */
    savefaxHistory() {
      this.$refs['faxForm'].validate((valid) => {
        if (valid) {
          let data = {
            id: this.faxForm.id,
            type: this.faxForm.type,
            title: this.faxForm.title,
            result: this.faxForm.result,
            eventId: this.faxForm.eventId,
            statusId: this.faxForm.status,
          };
          if (typeof data.statusId != 'number') delete data.statusId;
          this.$api.disposeFax(data).then((res) => {
            if (res.errorcode != 0) {
              this.$message({
                message: res.msg,
                type: 'error',
              });
              return;
            }
            this.$message({
              message: '保存成功！',
              type: 'success',
            });
            this.getUnhandledFax();
          });
          this.$refs.faxForm.clearValidate();
        }
      });
    },
    // 获取状态列表
    getStateListData() {
      let data = {
        pcode: 'information_processing_status',
      };
      this.$api.eventGetByPcodes(data).then((res) => {
        if (res.errorcode == 0) {
          // console.log("res.data: ", res.data);
          this.faxStateData = res.data;
        } else {
          this.$message({
            message: res.msg,
            type: 'error',
          });
        }
      });
    },
    // 获取全部右边表单类型
    getFaxTypeSelections() {
      this.$api.getFaxTypeSelections().then((res) => {
        if (!res.data) {
          this.faxAllTypeList = [];
          return;
        }
        this.faxAllTypeList = res.data;
      });
    },
    // 查看传真历史
    SeeTheHistory(item) {
      this.InformaHistoryFlag = true;
      this.$refs.InformaHistory.historyVisiable = true;
      let obj = {
        id: item.id,
        type: 'fax',
      };
      this.$api
        .getShowHistory(obj)
        .then((res) => {
          // console.log("getShowHistory res,res.data", res, res.data);
          if (res.errorcode == 0) {
            let historyArray = [];
            arr = [];

            for (let key in res.data) {
              this.lockHistory(res.data[key], key.substr(0, key.indexOf('L')));
              historyArray.push(res.data[key]);
            }
            arr = historyArray.flat(); // 降维成一维
            // console.log(arr, historyArray);
            if (arr.length !== 0) {
              arr.forEach((ele) => {
                if (ele.list) {
                  ele.name = this.disposeVisName(ele.list);
                } else {
                  ele.name = '';
                }
                if (ele.type == 'fax') {
                  ele.durationStr = this.hourTimeNum(ele.duration);
                }
                ele.millisecond = new Date(ele.time).getTime(); // 用毫秒数进行冒泡排序
              });
              var len = arr.length;
              for (var i = 0; i < len - 1; i++) {
                for (var j = 0; j < len - 1 - i; j++) {
                  // 相邻元素两两对比，元素交换，大的元素交换到后面
                  if (arr[j].millisecond > arr[j + 1].millisecond) {
                    var temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                  }
                }
              }
              arr = arr.reverse();
              // // console.log(arr);
              this.$refs.InformaHistory.listData = arr;
              this.$refs.InformaHistory.audio();
              this.$refs.InformaHistory.historyVisiable = false;
            } else {
              this.$refs.InformaHistory.listData = [];
              this.$refs.InformaHistory.historyVisiable = false;
            }
          } else {
            this.$message({
              message: res.msg,
              type: 'error',
            });
          }
        })
        .catch(() => {
          this.$refs.InformaHistory.listData = [];
          this.$refs.InformaHistory.historyVisiable = false;
        });
    },
    // 分钟数
    minutes(time) {
      let secondNum = parseInt(time) % 3600; // 得到秒
      let minutes = '00';
      // 分钟
      if (secondNum >= 60) {
        minutes =
          parseInt(secondNum / 60) >= 10
            ? parseInt(secondNum / 60)
            : '0' + parseInt(secondNum / 60);
      }
      return (
        minutes +
        '分' +
        (secondNum % 60 >= 10 ? secondNum % 60 : '0' + (secondNum % 60)) +
        '秒'
      );
    },
    // 小时
    hourTimeNum(time) {
      // 大于等于一个小时
      let hourStr = '00';
      if (time >= 3600) {
        hourStr =
          parseInt(time / 3600) >= 10
            ? parseInt(time / 3600)
            : '0' + parseInt(time / 3600);
        return hourStr + '时' + this.minutes(time);
      } else {
        return this.minutes(time);
      }
    },
    // 处理显示姓名
    disposeVisName(data) {
      let str = '';
      if (data.length != 0) {
        data.forEach((ele, index) => {
          if (index == data.length - 1) {
            str += ele.contactor;
          } else {
            str += ele.contactor + '、';
          }
        });
      }
      // // console.log(str)
      return str;
    },
    // 处理查看历史回调的数据
    lockHistory(data, type) {
      if (data.length != 0) {
        data.forEach((ele) => {
          ele.type = type;
        });
      }
    },
    // 关闭传真历史弹窗
    closeInformaHis() {
      this.InformaHistoryFlag = false;
    },
    /**
     * @description: 列表中的顺序旋转
     * @updateTime : 2020-11-12 11:00
     * @athor : xuchuangxing
     * @lastEditor : xuchuangxing
     * @param {*}
     * @return {*}
     */
    sequentialRotationIn() {
      this.sequentialRotationApi().then((res) => {
        if (res.errorcode == 0) {
          this.imgToText();
          this.getUnhandledFax();
          this.$message.success('旋转成功');
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    /**
     * @description: 图文识别中的顺序旋转
     * @updateTime : 2020-11-12 11:00
     * @athor : xuchuangxing
     * @lastEditor : xuchuangxing
     * @param {*}
     * @return {*}
     */
    sequentialRotationOut() {
      this.sequentialRotationApi().then((res) => {
        if (res.errorcode == 0) {
          this.getUnhandledFax();
          this.$message.success('旋转成功');
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    /**
     * @description: 顺序旋转接口
     * @updateTime : 2020-11-12 11:00
     * @athor : xuchuangxing
     * @lastEditor : xuchuangxing
     * @param {*}
     * @return {*}
     */
    sequentialRotationApi() {
      return new Promise((resove, reject) => {
        let data = {
          faxId: this.imgToTextId,
          angel: 90,
        };
        this.$api.rotatePdf(data).then((res) => {
          resove(res);
        });
      });
    },
    /**
     * @description: 选中的事件
     * @author: xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 20201119 14:56
     * @param {obj} 选中的事件信息
     * @return {*}
     */
    selectEvent(obj) {
      this.visible = false;
      this.faxForm.eventTitle = obj.title;
      this.faxForm.eventId = obj.id;
    },
    /**
     * @description: 搜索事件
     * @author : xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2020-11-19 15:06
     * @param {*}
     * @return {*}
     */
    searchEvent() {
      this.currentPage = 1;
      this.eventOptions = [];
      this.getEventOptions();
    },
    /**
     * @description: 每次追加10条事件列表
     * @author : xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2020-11-19 15:06
     * @param {*}
     * @return {*}
     */
    loadMoreHandle() {
      this.currentPage++;
      this.getEventOptions();
    },
    /**
     * @description:  获得关联事件
     * @param {*}
     * @return {*}
     * @author: qcx
     * @Date: 2021-07-05 16:01:31
     */
    getEventCorrelationOptions() {
      let ipData = {
        dtStart: '',
        dtEnd: '',
        searchText: this.emergencyForm.eventCorrelationConfig.searchText,
        page: this.emergencyForm.eventCorrelationConfig.currentPage,
        size: 10,
      };
      this.$api.todolist(ipData).then((res) => {
        console.log(res, '关联关联');
        if (res.errorcode == 0) {
          this.emergencyForm.eventCorrelationConfig.eventOptions.push(
            ...res.data.data,
          );
          this.emergencyForm.eventCorrelationConfig.loadMore =
            res.data.data.length == 0 ? false : true;
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    /**
     * @description: 每选一个关联事件切换一次右边登记
     * @param {*} item
     * @return {*}
     * @author: qcx
     * @Date: 2021-07-06 16:54:10
     */
    clickEventValue(item) {
      var obj = {
        id: item.id,
        title: item.title,
      };
      console.log('当前选择的下拉：', item);
      this.onSelectEventCorrelation(obj);
    },

    /**
     * @description: 获得所属区域
     * @param {*}
     * @return {*}
     * @author: qcx
     * @Date: 2021-07-05 16:01:59
     */
    getEventTitleArea() {
      this.$api.getJurisdiction({}).then((res) => {
        console.log(res, '所属区域');
        if (res.errorcode == '0') {
          this.emergencyForm.jurisdictionOptions = res.list;
          var gettree = function (data) {
            console.log(data, '辖区');
            for (var i = 0; i < data.length; i++) {
              if (!data[i].children || data[i].children.length == 0) {
                data[i].children = undefined;
              } else {
                gettree(data[i].children);
              }
            }
          };
          gettree(this.emergencyForm.jurisdictionOptions);
          let keyArray = [],
            jurisdictionId = this.emergencyForm.jurisdiction[0];
          var that = this;
          var getCompleteId = function (id, keyArray, options) {
            for (let key in options) {
              if (options[key].id == id) {
                keyArray.push(id);
                that.emergencyForm.jurisdiction = [];
                that.emergencyForm.jurisdiction.push(...keyArray);
                break;
              }
              if (options[key].children) {
                keyArray.push(options[key].id);
                getCompleteId(id, keyArray, options[key].children);
              } else {
                keyArray = [];
              }
            }
          };
          getCompleteId(
            jurisdictionId,
            keyArray,
            this.emergencyForm.jurisdictionOptions,
          );
        }
      });
    },
    /**
     * @description: 获得事件类型
     * @param {*}
     * @return {*}
     * @author: qcx
     * @Date: 2021-07-05 16:02:30
     */
    getEventTypeOptions() {
      this.$api.getTree({}).then((res) => {
        if (res.errorcode == '0') {
          this.emergencyForm.eventTypeOptions = res.data;
          var gettree = function (data) {
            for (var i = 0; i < data.length; i++) {
              if (!data[i].children || data[i].children.length == 0) {
                data[i].children = undefined;
              } else {
                gettree(data[i].children);
              }
            }
          };
          gettree(this.emergencyForm.eventTypeOptions);
        }
      });
    },
    /**
     * @description: 获得事件等级
     * @param {*}
     * @return {*}
     * @author: qcx
     * @Date: 2021-07-05 16:03:06
     */
    getEventGradeOptions() {
      this.$api.eventLevel({ pcode: 'emtlevel' }).then((res) => {
        if (res.errorcode == '0') {
          this.emergencyForm.eventGradeOptions = res.data;
        }
      });
    },
    /**
     * @description: 报告单位
     * @editor : qinjiaqi
     * @updateTime : 2021-03-30
     * @param {*}
     * @return {*}
     */
    getReportingUnitOptions() {
      this.$api.topUnitTree().then((res) => {
        if (res.errorcode === 0) {
          this.emergencyForm.reportingUnitOptions = res.data ? res.data : [];
          var gettree = function (data) {
            for (var i = 0; i < data.length; i++) {
              if (!data[i].children || data[i].children.length == 0) {
                data[i].children = undefined;
              } else {
                gettree(data[i].children);
              }
            }
          };
          if (
            this.emergencyForm.reportingUnitOptions &&
            this.emergencyForm.reportingUnitOptions.length > 0
          ) {
            gettree(this.emergencyForm.reportingUnitOptions);
          }
        }
      });
    },
    /**
     * @description: 报告单位
     * @param {*}
     * @return {*}
     * @author: qcx
     * @Date: 2021-07-05 16:03:31
     */
    getReportingUnitOptions() {
      this.$api.topUnitTree().then((res) => {
        if (res.errorcode === 0) {
          this.emergencyForm.reportingUnitOptions = res.data ? res.data : [];
          var gettree = function (data) {
            for (var i = 0; i < data.length; i++) {
              if (!data[i].children || data[i].children.length == 0) {
                data[i].children = undefined;
              } else {
                gettree(data[i].children);
              }
            }
          };
          if (
            this.emergencyForm.reportingUnitOptions &&
            this.emergencyForm.reportingUnitOptions.length > 0
          ) {
            gettree(this.emergencyForm.reportingUnitOptions);
          }
        }
      });
    },
    /**
     * @description: 选择关联事件
     * @param {*} obj
     * @return {*}
     * @author: qcx
     * @Date: 2021-07-05 16:04:46
     */
    onSelectEventCorrelation(obj) {
      console.log(obj, '关联事件');
      this.emergencyForm.eventCorrelationConfig.visible = false; // 收起下拉框
      if (obj) {
        this.emergencyForm.eventCorrelation.caseTitle = obj.title; // 首报标题
        this.emergencyForm.eventCorrelation.caseId = obj.id; // 首报id
        // 系统上报不需要拿选中事件的最新续报
        if (
          this.leftTabsType !== '系统上报' &&
          this.leftTabsType !== 'APP上报'
        ) {
          let data = {
            eventId: obj.id, // 事件ID
          };
          this.$api.findEventDealList(data).then((res) => {
            this.emergencyForm.jurisdiction = ''; // 所属区域
            this.emergencyForm.eventTitle = ''; // 事件标题
            this.emergencyForm.parameter = ''; // 事件要素
            this.emergencyForm.eventType = ''; // 事件类型
            this.emergencyForm.eventGrade = ''; // 事件等级
            this.emergencyForm.incidentTime = ''; // 事发时间
            this.emergencyForm.incidentLocation = ''; // 事发地点
            this.emergencyForm.reportingUnit = ''; // 报告单位
            this.emergencyForm.contactNumber = ''; // 联系电话
            this.emergencyForm.accidentSituation = ''; // 事故情况
            this.emergencyForm.faxFileList = []; // 传真附件
            this.emergencyForm.otherFileList = []; // 其他附件
            this.emergencyForm.incidentCause = ''; // 事发原因
            this.emergencyForm.consequences = ''; // 已造成后果
            this.emergencyForm.eventDevelopmentTrend = ''; // 事件发展趋势
            this.emergencyForm.Measures = ''; // 已采取措施
            this.emergencyForm.fallFigureAddress = ''; // 落图地点
            this.emergencyForm.matterTime = ''; // 转办时间
            this.emergencyForm.matterBranch = ''; // 转办部门
            this.emergencyForm.iComplaintOprid = ''; // 转办人
            this.emergencyForm.matterTrun = ''; // 转办人的姓名
            this.emergencyForm.disposalSituation = ''; // 处置情况
            this.emergencyForm.accidentUnit = ''; // 事故单位
            this.emergencyForm.reportedTime = ''; // 接报单位
            if (res.errorcode === 0) {
              if (res.data && res.data.length > 0) {
                let arr = res.data;
                arr = arr[arr.length - 1];
                this.emergencyForm.jurisdiction = this.getIncidenAreaId(
                  arr.areaId,
                ); // 所属区域
                this.emergencyForm.eventTitle = arr.title; // 事件标题
                this.emergencyForm.parameter = arr.eventParams; // 事件要素
                this.emergencyForm.eventType = arr.caseClassId; // 事件类型
                this.emergencyForm.eventGrade = arr.eventLevel; // 事件等级
                this.emergencyForm.incidentTime = arr.occurTime; // 事发时间
                this.emergencyForm.reportedTime = arr.reportTime; // 报送时间
                this.emergencyForm.incidentLocation = arr.address; // 事发地点
                this.emergencyForm.reportingUnit = arr.reportDepartId; // 报告单位
                this.emergencyForm.reportingUnitName = arr.department; // 报告单位
                this.emergencyForm.contactNumber = arr.dealPhone; // 联系电话
                this.emergencyForm.accidentSituation = arr.reportDescription; // 事故情况
                arr.attachments.forEach((item) => {
                  if (item.fileType == 1) {
                    this.emergencyForm.faxFileList.push(item);
                  } else {
                    this.emergencyForm.otherFileList.push(item);
                  }
                });
                this.emergencyForm.incidentCause = arr.occurReason; // 事发原因
                this.emergencyForm.consequences = arr.consequences; // 已造成后果
                this.emergencyForm.eventDevelopmentTrend = arr.developmentTrend; // 事件发展趋势
                this.emergencyForm.Measures = arr.takeSteps; // 已采取措施
                this.emergencyForm.fallFigureAddress = arr.fallFigureAddress; // 落图地点
                // 获取转办人姓名
                if (arr.complaintOprid) {
                  this.getUserInfo(arr.complaintOprid);
                }
                this.emergencyForm.matterTime = arr.complaint; // 转办时间
                this.emergencyForm.matterBranch = arr.complaintDepartment; // 转办部门
                this.emergencyForm.iComplaintOprid = arr.complaintOprid; // 转办人
                this.emergencyForm.disposalSituation = arr.disposalSituation; // 处置情况
                this.emergencyForm.accidentUnit = arr.accidentUnit; // 事故单位
              }
            }
          });
        }
      }
      // sessionStorage.setItem('eventCorrelationId',JSON.stringify(obj))
    },
    /**
     * 获取转办人的姓名
     */
    getUserInfo(userId) {
      this.$http
        .get(`${window.SITE_CONFIG.baseUrl}/sys/user/info/${userId}`)
        .then((response) => {
          if (response.data.code === 0 && response.data.user) {
            this.emergencyForm.matterTrun = response.data.user.name; // 转办人的姓名
          }
        });
    },
    /**
     * @description: 选择事件类型
     * @param {*} arr
     * @return {*}
     * @author: qcx
     * @Date: 2021-07-05 16:05:28
     */
    eventTypeChange(arr) {
      this.emergencyForm.eventType = arr[arr.length - 1];
      if (arr.length !== 0) {
        let data = {
          caseId: this.emergencyForm.eventType,
        };
        this.$api.defaultParameters(data).then((res) => {
          console.log(res.data, '事件要素');
          if (res.errorcode == '0') {
            if (res.data.length > 0) {
              this.emergencyForm.parameter = res.data;
            }
          } else {
          }
        });
      } else {
        this.emergencyForm.parameter = [];
      }
      var gettree = (data) => {
        for (var i = 0; i < data.length; i++) {
          if (data[i].id == arr[arr.length - 1]) {
            this.emergencyForm.eventType = '';
            this.emergencyForm.eventType = data[i].id;
            return;
          } else {
            if (data[i].children) {
              gettree(data[i].children);
            }
          }
        }
      };
      gettree(this.emergencyForm.eventTypeOptions);
    },
    /**
     * @description: 选择事件等级
     * @param {*} val
     * @return {*}
     * @author: qcx
     * @Date: 2021-07-05 16:05:47
     */
    eventGradeChange(val) {
      console.log('eventGradeChange', val, this.emergencyForm.eventGrade);
    },
    // /**
    //  * @description: 定位弹窗
    //  * @param {*}
    //  * @return {*}
    //  * @author: qcx
    //  * @Date: 2021-07-05 16:06:34
    //  */
    // onLocation() {
    //   // 定位弹窗
    //   this.$refs.loction.visible = false;
    //   this.$refs.loction.rushLocation = false;
    //   this.$nextTick(() => {
    //     this.$refs.loction.visible = true;
    //     this.$refs.loction.rushLocation = true;
    //   });
    // },
    /**
     * @description: 选择报告单位-调用
     * @param {*} val
     * @return {*}
     * @author: qcx
     * @Date: 2021-07-05 16:06:50
     */
    reportUnitChange(val) {
      this.emergencyForm.reportingUnitName = this.getReportUnitChange(val);
      this.emergencyForm.reportingUnit = val;
      console.log(
        '报送单位：',
        this.emergencyForm.reportingUnit,
        this.emergencyForm.reportingUnitName,
      );
    },
    /**
     * @description: 选择报告单位-实现
     * @param {*} arr
     * @return {*}
     * @author: qcx
     * @Date: 2021-07-05 16:07:15
     */
    getReportUnitChange(arr) {
      let incidenArea = '';
      if (arr.length === 1) {
        if (
          this.emergencyForm.reportingUnitOptions.filter(
            (item) => item.id === arr[0],
          ).length > 0
        ) {
          incidenArea = this.emergencyForm.reportingUnitOptions.filter(
            (item) => item.id === arr[0],
          )[0].name;
        } else {
          let area1 = '';
          let area2 = '';
          let area3 = '';
          for (
            let i = 0;
            i < this.emergencyForm.reportingUnitOptions.length;
            i++
          ) {
            if (this.emergencyForm.reportingUnitOptions[i].children) {
              if (
                this.emergencyForm.reportingUnitOptions[i].children.filter(
                  (item) => item.id === arr[0],
                ).length > 0
              ) {
                // area1 = this.emergencyForm.reportingUnitOptions[i].name;
                // area2 = this.emergencyForm.reportingUnitOptions[i].children.filter(item => item.id === arr[0])[0].name
                // incidenArea = area1 + area2
                incidenArea = this.emergencyForm.reportingUnitOptions[
                  i
                ].children.filter((item) => item.id === arr[0])[0].name;
              } else {
                for (
                  let j = 0;
                  j <
                  this.emergencyForm.reportingUnitOptions[i].children.length;
                  j++
                ) {
                  if (
                    this.emergencyForm.reportingUnitOptions[i].children[j]
                      .children
                  ) {
                    if (
                      this.emergencyForm.reportingUnitOptions[i].children[
                        j
                      ].children.filter((item) => item.id === arr[0]).length > 0
                    ) {
                      // area1 = this.emergencyForm.reportingUnitOptions[i].name;
                      // area2 = this.emergencyForm.reportingUnitOptions[i].children[j].name;
                      // area3 = this.emergencyForm.reportingUnitOptions[i].children[j].children.filter(item => item.id === arr[0])[0].name;
                      // incidenArea = area1 + area2 + area3
                      incidenArea = this.emergencyForm.reportingUnitOptions[
                        i
                      ].children[j].children.filter(
                        (item) => item.id === arr[0],
                      )[0].name;
                    }
                  }
                }
              }
            }
          }
        }
      } else if (arr.length === 2) {
        let area1 = this.emergencyForm.reportingUnitOptions.filter(
          (item) => item.id === arr[0],
        )[0].name;
        let area2 = '';
        for (
          let i = 0;
          i < this.emergencyForm.reportingUnitOptions.length;
          i++
        ) {
          if (this.emergencyForm.reportingUnitOptions[i].children) {
            if (
              this.emergencyForm.reportingUnitOptions[i].children.filter(
                (item) => item.id === arr[1],
              ).length > 0
            ) {
              // area2 = this.emergencyForm.reportingUnitOptions[i].children.filter(item => item.id === arr[1])[0].name
              // incidenArea = area1 + area2
              incidenArea = this.emergencyForm.reportingUnitOptions[
                i
              ].children.filter((item) => item.id === arr[1])[0].name;
            }
          }
        }
      } else if (arr.length === 3) {
        let area1 = this.emergencyForm.reportingUnitOptions.filter(
          (item) => item.id === arr[0],
        )[0].name;
        let area2 = '';
        let area3 = '';
        for (
          let i = 0;
          i < this.emergencyForm.reportingUnitOptions.length;
          i++
        ) {
          if (this.emergencyForm.reportingUnitOptions[i].children) {
            for (
              let j = 0;
              j < this.emergencyForm.reportingUnitOptions[i].children.length;
              j++
            ) {
              if (
                this.emergencyForm.reportingUnitOptions[i].children[j].children
              ) {
                if (
                  this.emergencyForm.reportingUnitOptions[i].children[
                    j
                  ].children.filter((item) => item.id === arr[2]).length > 0
                ) {
                  // area2 = this.emergencyForm.reportingUnitOptions[i].children.filter(item => item.id === arr[1])[0].name;
                  // area3 = this.emergencyForm.reportingUnitOptions[i].children[j].children.filter(item => item.id === arr[2])[0].name;
                  // incidenArea = area1 + area2 + area3
                  incidenArea = this.emergencyForm.reportingUnitOptions[
                    i
                  ].children[j].children.filter((item) => item.id === arr[2])[0]
                    .name;
                }
              }
            }
          }
        }
      }
      console.log('报告单位', incidenArea);
      return incidenArea;
    },
    /**
     * @description: 生成事件报文事故情况
     * @param {*}
     * @return {*}
     * @author: qcx
     * @Date: 2021-07-05 16:07:44
     */
    eventMessage() {
      let addClass =
        '【接报时间】接【报送单位】报:【事发时间】，【事发地点】，【事件信息】造成【事件要素】目前，事故调查工作正在进行中。';
      if (
        this.emergencyForm.startingTime !== undefined &&
        this.emergencyForm.startingTime !== null &&
        this.emergencyForm.startingTime !== ''
      ) {
        addClass = addClass.replace(
          '【接报时间】',
          this.getTimeData(this.emergencyForm.startingTime),
        );
      }
      if (this.join !== undefined && this.join !== null && this.join !== '') {
        addClass = addClass.replace('接', this.join);
      }
      if (
        this.report !== undefined &&
        this.report !== null &&
        this.report !== ''
      ) {
        addClass = addClass.replace('报', this.report);
      }
      if (this.emergencyForm.reportingUnitOptions.length > 0) {
        addClass = addClass.replace(
          '【报送单位】',
          this.emergencyForm.reportingUnitName,
        );
      }
      if (
        this.emergencyForm.incidentTime !== undefined &&
        this.emergencyForm.incidentTime !== null &&
        this.emergencyForm.incidentTime !== ''
      ) {
        addClass = addClass.replace(
          '【事发时间】',
          this.getTimeData(this.emergencyForm.incidentTime),
        );
      }
      if (
        this.emergencyForm.incidentLocation !== undefined &&
        this.emergencyForm.incidentLocation !== null &&
        this.emergencyForm.incidentLocation !== ''
      ) {
        addClass = addClass.replace(
          '【事发地点】',
          this.emergencyForm.incidentLocation,
        );
      }

      if (
        this.eventElements !== undefined &&
        this.eventElements !== null &&
        this.eventElements !== ''
      ) {
        addClass = addClass.replace('【事件信息】', this.eventElements);
      }
      if (this.emergencyForm.parameter.length > 0) {
        addClass = addClass.replace(
          '【事件要素】',
          this.getEventInFormation(this.emergencyForm.parameter),
        );
      }
      if (
        this.result !== undefined &&
        this.result !== null &&
        this.result !== ''
      ) {
        addClass = addClass.replace('造成', this.result);
      }
      if (
        this.messure !== undefined &&
        this.messure !== null &&
        this.messure !== ''
      ) {
        addClass = addClass.replace(
          '目前，事故调查工作正在进行中。',
          this.messure,
        );
      }
      this.emergencyForm.accidentSituation = addClass;

      //
    },
    /**
     * @description: 改变辖区的回调
     * @param {*} arr
     * @return {*}
     * @author: qcx
     * @Date: 2021-07-05 16:08:08
     */
    jurisdictionChange(arr) {
      console.log(arr, 'arr');
      console.log('当前区域', this.$refs.jurisdiction.getCheckedNodes()[0].label);
      this.emergencyForm.jurisdiction = arr;
      this.tempEventTitle = ''; // 先清空，不然会拼接
      if (this.tempEventTitleCount == 0)
        // 第一次的辖区存起来
        // this.tempEventTitle = this.getJurisdictionChange(arr);
        this.tempEventTitle = this.$refs.jurisdiction.getCheckedNodes()[0].label;
      console.log('所属区域', this.emergencyForm.jurisdiction);
    },
    /**
     * @description: 拼接辖区名字
     * @param {*} arr
     * @return {*}
     * @author: qcx
     * @Date: 2021-07-05 16:08:29
     */
    getJurisdictionChange(arr) {
      console.log(arr, 'arr');
      if (!arr) return '';
      let incidenArea = '';
      if (arr.length === 1) {
        if (
          this.emergencyForm.jurisdictionOptions.filter(
            (item) => item.id === arr[0],
          ).length > 0
        ) {
          incidenArea = this.emergencyForm.jurisdictionOptions.filter(
            (item) => item.id === arr[0],
          )[0].townName;
        } else {
          let area1 = '';
          let area2 = '';
          let area3 = '';
          for (
            let i = 0;
            i < this.emergencyForm.jurisdictionOptions.length;
            i++
          ) {
            if (this.emergencyForm.jurisdictionOptions[i].children) {
              if (
                this.emergencyForm.jurisdictionOptions[i].children.filter(
                  (item) => item.id === arr[0],
                ).length > 0
              ) {
                area1 = this.emergencyForm.jurisdictionOptions[i].townName;
                area2 = this.emergencyForm.jurisdictionOptions[
                  i
                ].children.filter((item) => item.id === arr[0])[0].townName;
                incidenArea = area1 + area2;
                // incidenArea = this.emergencyForm.jurisdictionOptions[i].children.filter(
                //   (item) => item.id === arr[0]
                // )[0].name;
              } else {
                for (
                  let j = 0;
                  j < this.emergencyForm.jurisdictionOptions[i].children.length;
                  j++
                ) {
                  if (
                    this.emergencyForm.jurisdictionOptions[i].children[j]
                      .children
                  ) {
                    if (
                      this.emergencyForm.jurisdictionOptions[i].children[
                        j
                      ].children.filter((item) => item.id === arr[0]).length > 0
                    ) {
                      area1 = this.emergencyForm.jurisdictionOptions[i]
                        .townName;
                      area2 = this.emergencyForm.jurisdictionOptions[i]
                        .children[j].townName;
                      area3 = this.emergencyForm.jurisdictionOptions[
                        i
                      ].children[j].children.filter(
                        (item) => item.id === arr[0],
                      )[0].townName;
                      incidenArea = area1 + area2 + area3;
                      // incidenArea = this.emergencyForm.jurisdictionOptions[i].children[
                      //   j
                      // ].children.filter(
                      //   (item) => item.id === arr[0]
                      // )[0].name;
                    }
                  }
                }
              }
            }
          }
        }
      } else if (arr.length === 2) {
        let area1 = this.emergencyForm.jurisdictionOptions.filter(
          (item) => item.id === arr[0],
        )[0].name;
        let area2 = '';
        for (
          let i = 0;
          i < this.emergencyForm.jurisdictionOptions.length;
          i++
        ) {
          if (this.emergencyForm.jurisdictionOptions[i].children) {
            if (
              this.emergencyForm.jurisdictionOptions[i].children.filter(
                (item) => item.id === arr[1],
              ).length > 0
            ) {
              area2 = this.emergencyForm.jurisdictionOptions[i].children.filter(
                (item) => item.id === arr[1],
              )[0].name;
              incidenArea = area1 + area2;
              // incidenArea = this.emergencyForm.jurisdictionOptions[i].children.filter(
              //   (item) => item.id === arr[1]
              // )[0].name;
            }
          }
        }
      } else if (arr.length === 3) {
        let area1 = this.emergencyForm.jurisdictionOptions.filter(
          (item) => item.id === arr[0],
        )[0].name;
        let area2 = '';
        let area3 = '';
        for (
          let i = 0;
          i < this.emergencyForm.jurisdictionOptions.length;
          i++
        ) {
          if (this.emergencyForm.jurisdictionOptions[i].children) {
            for (
              let j = 0;
              j < this.emergencyForm.jurisdictionOptions[i].children.length;
              j++
            ) {
              if (
                this.emergencyForm.jurisdictionOptions[i].children[j].children
              ) {
                if (
                  this.emergencyForm.jurisdictionOptions[i].children[
                    j
                  ].children.filter((item) => item.id === arr[2]).length > 0
                ) {
                  area2 = this.emergencyForm.jurisdictionOptions[
                    i
                  ].children.filter((item) => item.id === arr[1])[0].name;
                  area3 = this.emergencyForm.jurisdictionOptions[i].children[
                    j
                  ].children.filter((item) => item.id === arr[2])[0].name;
                  incidenArea = area1 + area2 + area3;
                  // incidenArea = this.emergencyForm.jurisdictionOptions[i].children[
                  //   j
                  // ].children.filter(
                  //   (item) => item.id === arr[2]
                  // )[0].name;
                }
              }
            }
          }
        }
      }
      console.log('所属区域', incidenArea);
      return incidenArea;
    },

    /**
     * @description 获取所属区域id
     * @param {number | string} areaId
     */
    getIncidenArea(areaId) {
      const areaIdArr = getRelations({
        arr: this.jurisdictionData,
        relationKey: 'id',
        findKey: 'id',
        findValue: Number(areaId),
      });
      const areaName = getRelations({
        arr: this.jurisdictionData,
        relationKey: 'townName',
        findKey: 'id',
        findValue: Number(areaId),
      });
      return {
        areaName: areaName[areaName.length - 1],
        areaIds: areaIdArr,
      };
    },
    /**
     * @description: 下面都是附件操作
     * @param {*} fileList
     * @return {*}
     * @author: qcx
     * @Date: 2021-07-05 16:09:33
     */
    handleRemoveFaxFile(fileList) {
      fileList.forEach((item) => {
        item.fileType = 1; // fileType 文件类型 0是其他文件 1是传真文件
      });
      this.emergencyForm.faxFileList = fileList ? fileList : [];
    },
    handleUploadFaxFileSuccess(fileList) {
      fileList.forEach((item) => {
        item.fileType = 1; // fileType 文件类型 0是其他文件 1是传真文件
      });
      this.emergencyForm.faxFileList = fileList ? fileList : [];
    },
    handlePreviewFaxFile(item) {
      this.emergencyForm.previewFaxFileConfig.faxFileDialogVisible = true; // 显示文件查看器
      if (matchFileType(item.fileName) === 2) {
        // 2 是图片
        this.emergencyForm.previewFaxFileConfig.imgOrFileType = 'img';
        this.emergencyForm.previewFaxFileConfig.filePath = item.url; // 文件路径
        this.emergencyForm.previewFaxFileConfig.previewImageUrlList.push(
          window.g.ApiUrl + item.filePath,
        ); // 图片显示列表
      } else if (
        matchFileType(item.fileName) !== 1 ||
        matchFileType(item.fileName) !== 10
      ) {
        this.emergencyForm.previewFaxFileConfig.imgOrFileType = 'file';
        this.emergencyForm.previewFaxFileConfig.filePath = item.url; // 文件路径
      }
    },
    handleRemoveOtherFile(fileList) {
      fileList.forEach((item) => {
        item.fileType = 1; // fileType 文件类型 0是其他文件 1是传真文件
      });
      this.emergencyForm.otherFileList = fileList;
    },
    handleUploadOtherFileSuccess(fileList) {
      fileList.forEach((item) => {
        item.fileType = 0; // fileType 文件类型 0是其他文件 1是传真文件
      });
      this.emergencyForm.otherFileList = fileList;
    },
    downloadFile(item) {
      let name = item.fileName;
      let url = `${window.g.ApiUrl}/eos/file/getStream?id=${item.id}`;
      let eleLink = document.createElement('a');
      eleLink.download = name;
      eleLink.href = url;
      eleLink.click();
    },

    /**
     * @description: 提交表单
     * @param {*}
     * @return {*}
     * @author: qcx
     * @Date: 2021-07-05 16:10:45
     */
    submitEmergencyForm() {
      if (this.emergencyForm.eventCorrelation.caseId) {
        // 有首报直接进入续报
        this.submitEmergencyFormDealReport();
        return false;
      }
      this.$refs.emergencyForm.validate((valid) => {
        if (valid) {
          let data = {
            vcTitle: this.tempEventTitle + this.emergencyForm.eventTitle, // 第一次传标题传辖区加名字，以后只传名字
            dtReportTime: this.emergencyForm.startingTime, // 接报时间
            dtOccurTime: this.$moment(this.emergencyForm.incidentTime).format(
              'YYYY-MM-DD HH:mm:ss',
            ), // 事发时间
            iAreaId: this.emergencyForm.jurisdiction[
              this.emergencyForm.jurisdiction.length - 1
            ], // 事发区域id，有取最后一个没有取null
            vcAddress: this.emergencyForm.incidentLocation, // 事发地点
            dLongitude: this.longitude, // 经度
            dLatitude: this.latitude, // 纬度
            vcReportDepart: this.emergencyForm.reportingUnitName, // 报送单位名字
            vcReportDepartId:
              this.emergencyForm.reportingUnit.length > 0
                ? this.emergencyForm.reportingUnit[
                    this.emergencyForm.reportingUnit.length - 1
                  ]
                : '', // 报送单位id
            iCaseClassId: this.emergencyForm.eventType, // 事件类型
            iEventLevel: this.emergencyForm.eventGrade, // 事件等级
            iEvnetSetingParams: this.emergencyForm.parameter, // 事件要素
            txtReportDescription: this.emergencyForm.accidentSituation.trim(), // 事故情况
            vcReportNum: this.emergencyForm.contactNumber, // 联系电话
            eventLevel: this.emergencyForm.eventGrade, // 事件等级
          };
          this.$api.saveEventReceive(data).then((res) => {
            if (res.errorcode == '0') {
              this.tempEventTitleCount += 1; // 标记是否加入tempEventTitle
              // sessionStorage.setItem('eventCorrelationId',JSON.stringify(res.data.id)) 如果希望跟传真那边联动的话再打开
              this.emergencyForm.eventId = res.data.id; // 首报id
              this.isFindOrder = false;
              this.submitEmergencyFormDealReport(); // 第一次新建事件时，先调用旧的保存事件的接口，再调用保存续报的接口
            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
        }
      });
    },

    /**
     * @description: 第一次新建事件时，先调用旧的保存事件的接口，再调用保存续报的接口
     * @param {*}
     * @return {*}
     * @author: qcx
     * @Date: 2021-07-05 16:11:15
     */
    submitEmergencyFormDealReport() {
      if (
        !this.emergencyForm.incidentTime || // 事发时间
        !this.emergencyForm.eventType || // 事件类型
        !this.emergencyForm.incidentLocation || // 事发地点
        !this.emergencyForm.accidentSituation || // 事故情况
        !this.emergencyForm.eventTitle // 时间标题
      ) {
        this.$message({
          message: '请完善事件信息',
          type: 'error',
        });
        return false;
      }
      this.$refs.emergencyForm.validate((valid) => {
        if (valid) {
          let dealOrder;
          new Promise((resolve, reject) => {
            if (this.isFindOrder) {
              this.$http({
                method: 'post',
                headers: {},
                url:
                  window.g.ApiUrl + '/eos/event/report/findEventDealOrderMax',
                data: {
                  eventId: this.emergencyForm.eventCorrelation.caseId
                    ? this.emergencyForm.eventCorrelation.caseId
                    : this.emergencyForm.eventId,
                },
              }).then((res) => {
                if (res.data.errorcode == 0) {
                  dealOrder = res.data.data.deal_order; // 查询第几个续报
                  resolve();
                }
              });
            } else {
              resolve();
            }
          }).then(() => {
            console.log(
              'emergencyForm',
              typeof this.emergencyForm.eventType,
              typeof this.emergencyForm.eventType === 'array',
            );
            let data = {
              eventJson: {
                iid: this.emergencyForm.eventDealId, // 事件续报ID  修改时必传
                i_event_process_id: this.emergencyForm.eventCorrelation.caseId
                  ? this.emergencyForm.eventCorrelation.caseId
                  : this.emergencyForm.eventId, // 对应的首报事件ID
                // tempEventTitleCount为1的时候为第一次将初始辖区传上去，以后都不传
                title:
                  this.tempEventTitleCount == 1
                    ? this.tempEventTitle + this.emergencyForm.eventTitle
                    : this.emergencyForm.eventTitle, // 事件标题
                occurTime: this.emergencyForm.incidentTime, // 事发时间
                reportTime: this.emergencyForm.reportedTime, // 接报时间
                areaId: this.emergencyForm.jurisdiction[
                  this.emergencyForm.jurisdiction.length - 1
                ], // 管辖范围：关联app_area表的i_id 事发区域id，有取最后一个没有取null
                address: this.emergencyForm.incidentLocation, // 事发地点
                longitude: this.longitude, // 事发地点-经度
                latitude: this.latitude, // 事发地点-纬度
                vcDepartment: this.emergencyForm.reportingUnitName, // 报送单位
                reportDepartId:
                  this.emergencyForm.reportingUnit.length > 0
                    ? this.emergencyForm.reportingUnit[
                        this.emergencyForm.reportingUnit.length - 1
                      ]
                    : null, // 报送单位id
                reportDepart: this.emergencyForm.reportingUnitName, // 报送单位
                eventType:
                  typeof this.emergencyForm.eventType === 'object'
                    ? this.emergencyForm.eventType[
                        this.emergencyForm.eventType.length - 1
                      ]
                    : this.emergencyForm.eventType, // 事件类型
                reportDescription: this.emergencyForm.accidentSituation.trim(), // 事件简况
                dealOrder: dealOrder ? dealOrder : 0, // 排序：首报、续报一、续报二....
                caseClassId:
                  typeof this.emergencyForm.eventType === 'object'
                    ? this.emergencyForm.eventType[
                        this.emergencyForm.eventType.length - 1
                      ]
                    : this.emergencyForm.eventType, // 事件要素:对应app_event_seting_params的i_case_id
                incidentSite: this.emergencyForm.incidentLocation, // 落图地点
                occurReason: this.emergencyForm.incidentCause, // 事发原因
                consequences: this.emergencyForm.consequences, // 已造成后果
                developmentTrend: this.emergencyForm.eventDevelopmentTrend, // 事件发展趋势
                takeSteps: this.emergencyForm.Measures, // 已采取措施
                eventLevel: this.emergencyForm.eventGrade, // 事件等级
                dealPhone: this.emergencyForm.contactNumber, // 联系电话（可以理解为报送单位号码）
                disposalSituation: this.emergencyForm.disposalSituation, // 处置情况
                fallFigureAddress: this.emergencyForm.fallFigureAddress, // 落图地点
                iComplaintOprid: this.emergencyForm.iComplaintOprid,
                dtComplaint: this.emergencyForm.matterTime, // 转办时间
                vcComplaintDepartment: this.emergencyForm.matterBranch, // 转办部门
                disposalName: this.emergencyForm.disposalName, // 处置姓名
                disposalUnit: this.emergencyForm.disposalUnit, // 处置单位
                disposalPosition: this.emergencyForm.disposalPosition, // 处置职务
                disposalPhone: this.emergencyForm.disposalPhone, // 处置电话
                accidentUnit: this.emergencyForm.accidentUnit, // 事故单位
              },
              iEvnetSetingParams: this.emergencyForm.parameter, // 事件要素
              attachments: this.emergencyForm.faxFileList.concat(
                this.emergencyForm.otherFileList,
              ), // 上传文件
            };
            this.$api.saveEventDealReport(data).then((res) => {
              if (res.errorcode == '0') {
                this.tempEventTitle = ''; // 结束首次传辖区
                this.tempEventTitleCount = 0; // 结束首次传辖区
                this.$message({
                  message: '新增突发事件成功',
                  type: 'success',
                });
                this.initEmergencyForm();
                // 需求432
                this.$refs.reportUnitRef.setReportingUnitListFromStorage(
                  this.emergencyForm.reportingUnitName,
                );
                // 下面关联传真才有用
                // this.emergencyForm.eventDealId = res.data.id; // 当前是第xx续报
                // this.$http({
                //   method: "post",
                //   headers: {},
                //   url:window.g.ApiUrl + "/eos/history/updateFaxEventIdAndType", // 更新续报的时候
                //   data: {
                //     eventId: this.emergencyForm.eventCorrelation.caseId
                //       ? this.emergencyForm.eventCorrelation.caseId
                //       : this.emergencyForm.eventId,
                //     eventDealId: this.emergencyForm.eventDealId,
                //     faxId: sessionStorage.getItem("faxId"), // 这个要点击传真的表格才有值，在电话短信模块可能用不了
                //     faxType: 1
                //   }
                // }).then(res => {
                //   if (res.errorcode == 0) {
                //     this.$message({
                //       message: `传真类型关联成功`,
                //       type: "success"
                //     });
                //   }
                // });
                if (this.leftTabsType == '电话') {
                  this.getUnhandledPhone();
                } else if (this.leftTabsType == '短信') {
                  this.getUnhandledSms();
                } else if (this.leftTabsType === '系统上报') {
                  this.$refs.systemReportRef.handleRefreshEvent();
                } else if (this.leftTabsType === 'APP上报') {
                  this.$refs.appReportIndex.getReportData('normal');
                }
              } else {
                this.$message.error(res.msg);
              }
            });
          });
        }
      });
    },

    /**
     * @description: 时间格式化
     * @param {*} time
     * @return {*}
     * @author: qcx
     * @Date: 2021-07-05 16:12:05
     */
    getTimeData(time) {
      let standardTtime = time;
      let date = new Date(standardTtime);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let minute = date.getMinutes();
      let delTime =
        year +
        '年' +
        month +
        '月' +
        day +
        '日' +
        '' +
        hour +
        '时' +
        minute +
        '分';
      return delTime;
    },

    /**
     * @description: 事故情况格式化
     * @param {*} data
     * @return {*}
     * @author: qcx
     * @Date: 2021-07-05 16:12:31
     */
    getEventInFormation(data) {
      this.eventInformation = ``;
      for (var i = 0; i < data.length; i++) {
        if (data[i].name.indexOf('死亡') == 0) {
          if (data[i].value != '0' && data[i].value) {
            this.messure = '目前，事故调查及善后工作正在进行中。';
          } else {
            this.messure = '目前，事故调查工作正在进行中。';
          }
        }
        if (
          data[i].name.indexOf('受伤') == 0 ||
          data[i].name.indexOf('死亡') == 0
        ) {
          if (data[i].value != '0' && data[i].value)
            this.eventInformation += `${data[i].value}${data[i].unit}${data[i].name},`;
        }
      }
      this.eventInformation = this.eventInformation.replace(/,+$/, '。');
      return this.eventInformation;
    },

    /**
     * @description: 新事件登记回调经纬度赋值
     * @param {*} obj 传回的地点信息
     * @return {*}
     * @author: qcx
     * @Date: 2021-07-05 16:12:49
     */
    locationCallbackEmergency(obj) {
      if (obj.data.action && obj.data.action == 'retpoint') {
        let latlon = obj.data.object.point.split(',');
        this.longitude = latlon[0];
        // console.log(latlon[0], latlon[1]);
        this.latitude = latlon[1];
        this.emergencyForm.incidentLocation = obj.data.object.address;
        this.$refs.loction.visible = false;
      }
      // 在非事件登记页面emergencyForm没有渲染出来在created阶段会报错
      if (this.eventEnteringShow) {
        this.$nextTick(() => {
          this.$refs.emergencyForm.clearValidate(); // 清空之前的验证
          this.$refs.getFocus.focus(); // 触发事发地点框聚焦
        });
      }
    },

    /**
     * @description: 新事件登记回调经纬度赋值
     * @param {*} obj 传回的地点信息
     * @return {*}
     * @author: qcx
     * @Date: 2021-07-05 16:13:20
     */
    sendLocationMsgEmergency(obj) {
      if (obj.data.action && obj.data.action == 'ready') {
        if (this.longitude && this.latitude) {
          var mapFarme = document.getElementById('overId');
          if (mapFarme) {
            var data = {};
            data.action = 'getpoint';
            var object = {};
            object.center = this.longitude + ',' + this.latitude;
            object.address = this.emergencyForm.incidentLocation;
            object.area = '';
            data.object = object;
            mapFarme.contentWindow.postMessage(JSON.stringify(data), '*');
          }
        }
      }
    },
    /**
     * 点击 App 上报卡片中的【事件登记】按钮，将数据移动到右侧事件登记里编辑
     *
     * @param {Object} item 卡片的数据
     */
    handleEditAppReport(item) {
      // 1. 右侧栏切换到【事件登记】模块
      this.eventEntering();
      let newItem = JSON.parse(JSON.stringify(item));
      // 存放附件
      let appAttachments = [];

      if (newItem.appAttachments.length > 0) {
        newItem.appAttachments.forEach((item) => {
          appAttachments.push({
            fileName: item.filename,
            filePath: item.url,
            fileType: item.type,
            size: item.size,
          });
        });
      }
      // 2. 赋值
      this.emergencyForm.eventTitle = newItem.title; // 事件标题
      this.emergencyForm.eventType = newItem.caseClassId; // 事件类型
      this.emergencyForm.startingTime = newItem.reportTime; // 接报时间
      this.emergencyForm.incidentLocation = newItem.address; // 事发地点
      this.emergencyForm.fallFigureAddress = newItem.address; // 落图地点
      this.emergencyForm.otherFileList = appAttachments; // 附件
      this.emergencyForm.accidentSituation = newItem.content; // 事故情况
      // 存事件类型id，与信息要素对应
      sessionStorage.setItem('caseID', newItem.caseClassId);
      // 根据类型获取对应的信息要素并赋值
      this.amendParameter('APP');
      // 获取事件的续报信息，用于事件登记
      this.$http({
        url: `${window.SITE_CONFIG.event}/event/info/getDetail`,
        method: 'post',
        data: this.$http.adornData({
          id: newItem.id,
        }),
      }).then((res) => {
        console.log(this.emergencyForm.otherFileList);
        // 如果有续报，则把续报的附件加到参数中
        if (res.data && res.data.data.reportSupplements.length > 0) {
          let reportSupplements = res.data.data.reportSupplements;
          reportSupplements.forEach((items, ind) => {
            // 事故情况添加续报内容
            this.emergencyForm.accidentSituation += `\n[${
              items.reportTime
            }续报${ind + 1}]\n${items.content}`;
            if (items.appAttachments.length > 0) {
              items.appAttachments.forEach((item2) => {
                console.log(item2);
                this.emergencyForm.otherFileList.push({
                  fileName: item2.filename,
                  filePath: item2.url,
                  fileType: item2.type,
                  size: item2.size,
                });
              });
            }
          });
        }
      });
      console.log(
        'handleEditAppReport中的附件!!!：',
        this.emergencyForm.otherFileList,
      );
    },
  },
};
</script>

<style scoped lang="scss">
@import './assets/css/informationDisposalNew.css';
/deep/.sbs-tabs .el-tabs__header.is-top{
  padding: 0px;
}
</style>
