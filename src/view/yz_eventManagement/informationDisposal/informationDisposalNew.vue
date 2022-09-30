<script src="../../../../../xxs.js"></script>
<template>
  <div style="margin: 10px" class="informationDisposalNew_warp">
    <el-row style="display: flex; height: 100%">
      <el-col style="width: 66.2%">
        <el-tabs
          style="height: 96%; display: flex; flex-direction: column"
          class="tabsClass"
          v-model="leftTabsType"
          @tab-click="tabClick"
        >
          <el-tab-pane label="传真" name="传真" style="height: 100%">
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
                      placeholder="请输入单位、标题、事件、号码"
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
                        v-for="(item, index) in list"
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
                              style="border-bottom: 20px solid #999;"
                              v-else-if="item.status==''"
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
                                >{{
                                  isYangZhou
                                    ? item.time.substring(
                                        0,
                                        item.time.lastIndexOf(":")
                                      )
                                    : item.time
                                }}</span
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
                              justify-content: space-between; ;
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
                  <div class="auto_printing">
                    <span
                      style="
                        color: #333333;
                        font-size: 14px;
                        font-weight: inherit;
                        margin-left: 10px;
                      "
                      >自动打印：</span
                    >
                    <el-switch
                      v-model="isAutoPrinting"
                      active-color="#0091FF"
                      inactive-color="#CACACA"
                      active-value="开"
                      inactive-value="关"
                      @change="setAutoPrinting"
                    >
                    </el-switch>
                  </div>
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
                      background: url('/static/img/faxBack.png') center no-repeat;
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
              ></msgHistonryIndex>
            </div>
          </el-tab-pane>
          <el-tab-pane label="上报" name="上报" v-if="isVDCP">
            <div style="height: 100%; display: flex; flex-direction: column">
              <reportingHistonryIndex
                ref="msgHistonryIndex"
              ></reportingHistonryIndex>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col style="width: 33.8%">
        <div
          style="
            height: 96%;
            display: flex;
            flex-direction: column;
            padding: 0 10px;
          "
          class="flex_wrap"
        >
          <div
            style="
              margin: 0 0 10px 0px;
              width: 100%;
              min-width: 185px;
              display: flex;
            "
          >
            <span class="messageDiv" @click="InformationDisposal">
              <span class="message-img"></span>通讯处置
            </span>
            <span class="messageDiv" @click="infoEntering">
              <span class="message-img"></span>信息登记
            </span>
            <span class="messageDiv" @click="eventEntering">
              <span class="event-img"></span>事件登记
            </span>
          </div>
          <div>
            <el-card
              class="box-card cardCalss"
              shadow="never"
              v-if="InformationDisposalShow"
            >
              <el-tabs
                v-model="activeAllModel"
                :style="rightHeightStyle"
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
            </el-card>

            <!-- 事件登记 -->
            <!--              style="background: none !important;padding: 0 !important;padding: 10px;box-sizing:border-box;height: calc(100% - 35px);background-color: #Fff;"-->
            <el-card
              class="box-card cardCalss"
              shadow="never"
              v-if="eventEnteringShow"
              style="background: #ebeef5"
              :style="eventEnteringStyle"
            >
              <!-- editor: qinjiaqi -->
              <div
                style="
                  min-height: 760px;
                  background: #fff;
                  padding: 10px 10px 0 10px;
                  transition: all 0.3s;
                  overflow-x: hidden;
                  overflow-y: scroll;
                "
                :style="saveEntering"
              >
                <el-form
                  size="small"
                  :model="ruleForm"
                  :rules="rules"
                  ref="ruleForm"
                  @submit.native.prevent
                  label-position="left"
                  style="padding-bottom: 70px"
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
                          :format="
                            isYangZhou
                              ? 'yyyy-MM-dd HH:mm'
                              : 'yyyy-MM-dd HH:mm:ss'
                          "
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="选择日期时间"
                        ></el-date-picker>
                      </el-form-item>
                    </el-col>

                    <el-col :span="12">
                      <el-form-item
                        :label="isYangZhou ? '接报时间:' : '首报时间:'"
                        prop="reportedTime"
                      >
                        <el-date-picker
                          style="width: 100%"
                          v-model.trim="ruleForm.reportedTime"
                          type="datetime"
                          :format="
                            isYangZhou
                              ? 'yyyy-MM-dd HH:mm'
                              : 'yyyy-MM-dd HH:mm:ss'
                          "
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="选择日期时间"
                          default-time="09:00:00"
                        ></el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row :gutter="gutter" v-if="!isYangZhou">
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
                        <el-cascader
                          v-model.trim="ruleForm.reportingUnit"
                          :options="reportingUnitData"
                          ref="reportingUnit"
                          :props="props"
                          clearable
                          style="float: left; width: 100%"
                          :show-all-levels="false"
                        ></el-cascader>
                      </el-form-item>
                    </el-col>

                    <el-col :span="12">
                      <el-form-item label="所属区域:" prop="incidenArea">
                        <el-cascader
                          v-model.trim="ruleForm.incidenArea"
                          :options="jurisdictionData"
                          ref="incidenArea"
                          :props="props"
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
                              >一键生成</el-link
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

                    <el-col :span="24" v-if="!isYangZhou">
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
                          style="float: left; width: 100%"
                          :show-all-levels="false"
                          @change="incidenTypeChange"
                        ></el-cascader>
                      </el-form-item>
                      <!--        <div class="eventDetail-box-list">
                    <span class="eventDetail-box-list-left">事件类型:</span>
                    <span class="eventDetail-box-list-right">{{ruleForm.incidenType}}</span>
                  </div>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="死:">
                        <el-input
                          v-model.trim="ruleForm.deathNum"
                          show-word-limit
                          :title="ruleForm.deathNum"
                        ></el-input>
                      </el-form-item>
                    </el-col>

                    <el-col :span="6">
                      <el-form-item label="伤:">
                        <el-input
                          v-model.trim="ruleForm.injuredNum"
                          show-word-limit
                          :title="ruleForm.injuredNum"
                        ></el-input>
                      </el-form-item>-->
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
                                  <!-- {{item.name}}<span v-if="item.unit!==''">({{item.unit}})</span>: -->
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
                                    value-format="yyyy-MM-dd:ss"
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

                  <el-row :gutter="gutter" v-if="isYangZhou">
                    <el-col :span="24">
                      <el-form-item
                        :label="isYangZhou ? '事故简况:' : '事件情况:'"
                        prop="accidentSituation"
                      >
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
                    <el-col :span="24">
                      <el-form-item :label="`上报情况:`" v-if="!isYangZhou">
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
                      <el-form-item label="值班领导:" v-if="!isYangZhou">
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
              </div>
              <!-- editor: qinjiaqi -->
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
                  overflow-y: scroll;
                  height: 812px;
                "
              >
                <div style="padding: 20px 20px 0">
                  <el-form
                    v-model="faxForm"
                    label-width="80px"
                    @submit.native.prevent
                    label-position="right"
                    class="faxFormClass"
                  >
                    <el-row :gutter="gutter">
                      <el-col :span="24">
                        <el-form-item label="号码">
                          <el-input v-model="faxForm.phone" disabled></el-input>
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
                            v-model="faxForm.time"
                            :format="
                              isYangZhou
                                ? 'yyyy-MM-dd HH:mm'
                                : 'yyyy-MM-dd HH:mm:ss'
                            "
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="datetime"
                            style="width: 100%"
                          ></el-date-picker>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="gutter">
                      <el-col :span="24">
                        <el-form-item label="类型" class="faxFormitemClass">
                          <el-dropdown
                            trigger="click"
                            @command="handleCommand"
                            style="display: initial; width: 100%; margin: -10px"
                          >
                            <span class="el-dropdown-link">
                              <el-input
                                style="width: 100%; margin: 0px 0px 0px 29px"
                                v-model="faxForm.type"
                                placeholder="请输入内容"
                                suffix-icon="el-icon-arrow-down"
                              ></el-input>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item
                                v-for="(item, index) in faxAllTypeList"
                                :key="index"
                                :command="item"
                                >{{ item }}</el-dropdown-item
                              >
                            </el-dropdown-menu>
                          </el-dropdown>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="gutter">
                      <el-col :span="24">
                        <el-form-item label="标题">
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
                            :rows="2"
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
                    display: flex;
                    font-weight: bold;
                  "
                >
                  <div
                    style="position: absolute; right: 30px; margin-top: -2px"
                  >
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
      @imgToText="imgToText"
      v-if="imgToTextVisible"
      @closeImgToText="imgToTextVisible = false"
      @sequentialRotationIn="sequentialRotationIn"
    ></imgToText>
    <resolution ref="resolution" @updateFaxList="getUnhandledFax"></resolution>
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
  </div>
</template>

<script>
import smsRight from "@/yz_integratedCommunication/icpPhone/icpPhonePage/smsStep/smsRight";
import phoneIndex from "./communicationHistory/phone/phoneIndex";
import phoneHistoryIndex from "./communicationHistory/phoneHistoryIndex";
import msgHistonryIndex from "./communicationHistory/msgHistonryIndex";
import reportingHistonryIndex from "./communicationHistory/reportingHistonryIndex";
import faxRight from "@/view/yz_integratedCommunication/icpPhone/icpPhonePage/faxStep/faxRight";
import newFaxModel from "@/view/yz_eventManagement/eventRegistration/newModel/newFaxModel";
import newSmsModel from "@/view/yz_eventManagement/eventRegistration/newModel/newSmsModel";
import audioCompName from "@/view/yz_History/phoneHistory/all/audioHistory";
import audioPlan from "@/view/yz_eventManagement/informationDisposal/audioPlan";
import mergeFaxDialog from "@/view/yz_eventManagement/informationDisposal/mergeFaxDialog";
import resolution from "@/view/yz_eventManagement/informationDisposal/resolution";
import imgToText from "@/view/yz_eventManagement/informationDisposal/imgToText";
import Location from "@/yz_components/loction/loction"; //定位
import addDialog from "@/view/yz_eventManagement/eventReports/dialog/eventDialog"; //联系人及其她选择弹窗
import InformaHistory from "./communicationHistory/comonnTemplat/InformaHistory"; // 传真历史
import axios from "axios";
import Qs from "qs";
import bus from "@/yz_components/common/js/eventBus";

export default {
  name: "informationDisposalNew",
  components: {
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
    reportingHistonryIndex,
    mergeFaxDialog,
    resolution,
    imgToText,
    InformaHistory,
    // ,audioCompName
  },
  data() {
    return {
      submitOptions: [
        { id: 1, label: "电话", value: "1" },
        { id: 2, label: "短信", value: "2" },
        { id: 3, label: "传真", value: "3" },
        { id: 4, label: "其他", value: "4" },
      ],
      props: {
        value: "id",
        label: "name",
        checkStrictly: true,
      },
      jurisdictionData: [], // 所属区域
      reportingUnitData: [], // 报告单位
      eventTypeData: [], // 事件类型
      beOnDutyVisible: false, // 值班员弹窗
      leaderOnDutyVisible: false, // 值班领导弹窗
      isShowEventReportDialog: false, // 是否显示事件上报弹窗
      ruleForm: {
        eventTitle: "",
        reportedTime: "",
        incidentTime: "",
        incidenArea: [],
        incidentSite: "",
        reportingUnit: [],
        incidenType: [],
        serialNumber: "",
        reportSituation: "",
        allCase: "",
        speakerName: "",
        speakerPhone: "",

        // incidentRank: '',

        timeOfWrittenSubmission: "",
        accidentSituation: "",
        beOnDuty: sessionStorage.getItem("displayname"),
        beOnDutyIds: [],
        leaderOnDuty: "",
        leaderOnDutyIds: [],
        submissionMethod: "",

        deathToll: "",
        bruiseToll: "",
        disappearToll: "",

        deathNum: "",
        injuredNum: "",
      },
      rules: {
        // eventTitle: [{required: true, message: "不能为空", trigger: "blur"}],
        reportedTime: [
          { required: true, message: "不能为空", trigger: "blur" },
        ],
        incidentTime: [
          { required: true, message: "不能为空", trigger: "blur" },
        ],
        timeOfWrittenSubmission: [
          { required: true, message: "不能为空", trigger: "blur" },
        ],
        incidenArea: [{ required: true, message: "不能为空", trigger: "blur" }],
        incidentSite: [
          { required: true, message: "不能为空", trigger: "blur" },
        ],
        reportSituation: [
          { required: true, message: "不能为空", trigger: "blur" },
        ],
        submissionMethod: [
          { required: true, message: "不能为空", trigger: "blur" },
        ],
        accidentSituation: [
          { required: true, message: "不能为空", trigger: "blur" },
        ],
        reportingUnit: [
          { required: true, message: "不能为空", trigger: "blur" },
        ],
        beOnDuty: [{ required: true, message: "不能为空", trigger: "blur" }],
        leaderOnDuty: [
          { required: true, message: "不能为空", trigger: "blur" },
        ],
        incidenType: [{ required: true, message: "不能为空", trigger: "blur" }],
        deathToll: [{ required: true, message: "不能为空", trigger: "blur" }],
        bruiseToll: [{ required: true, message: "不能为空", trigger: "blur" }],
        disappearToll: [
          { required: true, message: "不能为空", trigger: "blur" },
        ],
        allCase: [{ message: "" }],
      },
      dataALL: {
        eventTitle: "",
        reportedTime: "",
        incidentTime: "",
        incidenArea: [],
        incidentSite: "",
        reportingUnit: [],
        incidenType: [],
        serialNumber: "",
        reportSituation: "",
        allCase: "",
        speakerName: "",
        speakerPhone: "",

        // incidentRank: '',

        timeOfWrittenSubmission: "",
        accidentSituation: "",
        beOnDuty: "",
        beOnDutyIds: [],
        leaderOnDuty: "",
        leaderOnDutyIds: [],
        submissionMethod: "",

        deathToll: "",
        bruiseToll: "",
        disappearToll: "",

        deathNum: "",
        injuredNum: "",
      },
      faxStateData: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      faxStateData: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      faxStateValue: "",
      faxTypeValue: "",
      activeAllModel: "电话", //右边tabs选项
      leftTabsType: "传真", //左边tabs选项
      allFpxPreviewPath: "", //allModel选中传真的传真预览地址
      queryFaxAllTime: "", //allModel传真查询时间
      queryFaxAllSelect: "", //allModel传真下拉选中
      faxAllSelectData: "", //allModel传真获取到的数据
      list: [],
      pageFaxSize: 10, //传真MODEL分页
      totalFax: 0, //传真MODEL分页
      currentFaxPage: 1, //传真MODEL分页
      bodyStyle: {
        padding: "10px 15px",
        backgroundColor: "transparent",
        cursor: "pointer",
      }, //cred 默认的样式
      changeIndex: -1, //更改背景颜色
      eventList: false, //关联事件弹窗
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
        height: "", //中间的高度
      },
      elTablePlanStyleNext: {
        height: "",
        padding: "10px",
      },
      heightStyle: {
        height: "",
      },
      infoEnteringStyle: {
        height: "",
      },
      eventEnteringStyle: {
        height: "",
      },
      rightHeightStyle: {
        height: "",
        display: "flex",
        "flex-direction": "column",
      },
      listHeight: {
        height: "",
      },
      saveEntering: {
        height: "",
      },
      turnTheText: {
        height: "",
      },
      changeRed: "信息处置", //默认显示信息处置
      InformationDisposalShow: true, //默认显示信息处置
      eventEnteringShow: false, //默认隐藏录入事件
      infoEnteringShow: false, // 默认隐藏信息登记
      eventsParameters: false, //情景要素是否显示
      parameter: [], //情景要素参数
      audioList: {
        //音频组件地址,只能传递一个,如果需要传递多个,可以自己修改源码  换成数组或者json
        url: "",
        //这个音频文件的长度,因为一般都是异步获取到音频地址才能初始化audio的,所以这个参数父传递给子合适点
        totalTime: "",
      },
      dialogVisible: false,
      editIndex: "",
      options: "",
      selectState: "",
      textShow: "",
      row: "", //当前选中的事件
      nowTag: "fax", //当前的tag是传真、电话还是短信
      id: "", //当前左侧选中的的列表
      phoneText: "",
      smsText: "",
      addEventDialog: false, //选择是否弹窗
      title: "", //选择弹窗标题
      eventTree: [], //事件区域选中数据
      eventAddressBook: [], //事件联系人选中数据
      eventTypeList: [], //事件类型选中数据
      eventType: [], //事件类型存储
      longitude: "", //经度
      latitude: "", //纬度
      asterisk: false,
      caseid: "", //事件类型ID
      addClass: "", //匹配出来的事件模板内容
      gutter: 20,
      audioShow: false,
      leftEventId: "",
      imgToTextId: 0,
      testAudio: false, //
      audioUrlData: "",
      audioId: "",
      mapId: "informId",
      phonePerson: "", //电话联系人
      treeLoading: true, //传真loading加载
      phoneTreeLoading: true, //电话loading加载
      smsTreeLoading: true, //短信loading加载
      faxRushe: true, //刷新传真预览
      phoneRushe: true, //刷新电话预览
      backSms: {
        //短信区域给一个背景图
        background: "",
        backgroundSize: "",
      },
      backPhone: {
        //短信区域给一个背景图
        background: "",
        backgroundSize: "",
      },
      faxcontactId: "", //传真一键识别用来查询联系人
      audioPlanData: "", //存储录音实例
      rushFaxData: "", //刷新传真编辑的内容

      phonesText: "",
      isAddPhonesShow: false,
      faxForm: {
        id: "",
        phone: "",
        unit: "",
        time: "",
        event: "",
        status: "",
        type: null,
        title: null,
        result: null,
        eventId: "",
        eventTitle: "",
      },
      eventOptions: [],
      timerDate: "",
      faxAllTypeList: [],
      currentFax: {}, // 当前选中的传真数据
      InformaHistoryFlag: false, // 传真历史弹窗
      clickFaxInfo: {}, //点击传真历史
      paramsData: [], //重新赋值数据库返回数据
      caseFor: [], //存储原来的事件类型id
      paramsData: [],
      imgToTextVisible: false, //图文识别弹窗
      isAutoPrinting: false, // 自动打印传真
      isYangZhou: window.g.IsYangZhouProject, // 是否扬州项目
      isVDCP: window.g.IsVDCPProject, // 是否VDCP
      visible: false,
      currentPage: 1, // 事件列表页码
      searchText: "", // 事件列表搜索关键字
      loadMore: true, // 是否有更多事件数据
    };
  },
  beforeDestroy() {
    window.removeEventListener("message", this.locationCallback);
    window.addEventListener("message", this.sendLocationMsg);
    document.getElementsByClassName("el-scrollbar__wrap")[0].style.overflow =
      "scroll";
    // document.getElementsByClassName('is-vertical')[13].style.visibility='visible'
  },
  created() {
    // 重要的
    this.eventScene();
    this.addressBook();
    this.incidentType();
    // -----------------
    window.addEventListener("resize", this.getHeight);
    this.getHeight();
    this.getTimes();
    this.getUnhandledFax();
    window.addEventListener("message", this.locationCallback);
    window.addEventListener("message", this.sendLocationMsg);
    //获取改变状态的列表
    let data = {
      pcode: "information_processing_status",
    };
    this.$api.getByPcode(data).then((res) => {
      // // console.log(res)
      if (res.errorcode == 0) {
        this.options = res.data;
        // // console.log(this.options)
      } else {
        //this.$message.error(res.msg)
      }
    });
    if (this.$store.getters.getDispositionType) {
      this.leftTabsType = this.$store.getters.getDispositionType;
      // if (this.leftTabsType == "电话") {
      //   this.getUnhandledPhone();
      // } else if (this.leftTabsType == "短信") {
      //   this.getUnhandledSms();
      // } else if (this.leftTabsType == "传真") {
      //   this.getUnhandledFax();
      // }
    }

    this.getFaxTypeSelections(); //选择全部右边表单类型
    // this.getEventOptions();
  },
  computed: {
    //获取悬浮球跳转过来时是跳哪个模块
    msgType() {
      return this.$store.getters.getDispositionType;
    },
    eventTypeComments() {
      return JSON.parse(JSON.stringify(this.eventType));
    },
    selectEventStyle() {
      return function (eventId) {
        if (this.faxForm.eventId == eventId) {
          return "color:#0091ff;background-color:rgba(0, 145, 255, .1);";
        } else {
          return "";
        }
      };
    },
  },
  watch: {
    //解决所属区域级联选择器点击不关闭的问题
    "ruleForm.incidenArea"(newValue, oldValue) {
      if (this.$refs.incidenArea) {
        var children = this.$refs.incidenArea.getCheckedNodes();
        if (children.length > 0 && children[0].children.length < 1) {
          //判断有没有下级
          this.$refs.incidenArea.dropDownVisible = false; //监听值发生变化就关闭它
        }
      }
    },
    //解决报告单位级联选择器点击不关闭的问题
    "ruleForm.reportingUnit"(newValue, oldValue) {
      if (this.$refs.reportingUnit) {
        var children = this.$refs.reportingUnit.getCheckedNodes();
        if (children.length > 0 && children[0].children.length < 1) {
          //判断有没有下级
          this.$refs.reportingUnit.dropDownVisible = false; //监听值发生变化就关闭它
        }
      }
    },
    //解决事件类型级联选择器点击不关闭的问题
    "ruleForm.incidenType"(newValue, oldValue) {
      if (this.$refs.incidenType) {
        var children = this.$refs.incidenType.getCheckedNodes();
        if (children.length > 0 && children[0].children.length < 1) {
          //判断有没有下级
          this.$refs.incidenType.dropDownVisible = false; //监听值发生变化就关闭它
        }
      }
    },
    faxStateValue: function (newVal) {
      this.getUnhandledFax();
    },
    activeAllModel: {
      handler: function (newVal) {
        if (newVal === "短信") {
          const _taht = this;
          setTimeout(() => {
            _taht.$refs.smsRight.msmEventFlag = false;
          }, 100);
          this.$store.commit("setSmsOrFax", "sms");
        } else if (newVal === "传真") {
          this.$store.commit("setSmsOrFax", "fax");
        } else if (newVal === "电话") {
          this.$store.commit("setSmsOrFax", "phone");
        }
      },
      deep: true,
    },
    queryFaxAllTime() {
      this.getUnhandledFax();
    },
    audioUrlData: {
      handler(valV, oldV) {
        if (oldV != "" && valV !== oldV) {
          this.audioPlanData.stop(); //先停止录音播放
        }
      },
      deep: true,
    },
    leftTabsType: {
      handler(valV, oldV) {
        // if (valV == "电话") {
        //   this.getUnhandledPhone();
        // } else if (valV == "短信") {
        //   this.getUnhandledSms();
        // } else if (valV == "传真") {
        //   this.getUnhandledFax();
        // }
      },
      deep: true,
    },
    msgType() {
      this.leftTabsType = this.msgType;
    },
    smsText: {
      handler(nV) {
        if (nV == "" || nV == null) {
          this.backSms.background =
            "url(" + "/static/img/smsContent.png" + ")center no-repeat";
          this.backSms.backgroundSize = "220px";
        } else {
          this.backSms.background = "none";
          this.backSms.backgroundSize = "220px";
        }
      },
      deep: true,
    },
    phoneText: {
      handler(nV) {
        if (nV == "" || nV == null) {
          this.backPhone.background =
            "url(" + "/static/img/txtNull.png" + ")center no-repeat";
          this.backPhone.backgroundSize = "130px";
        } else {
          this.backPhone.background = "none";
          this.backPhone.backgroundSize = "130px";
        }
      },
      deep: true,
    },
    channelTitle: {
      handler(nV, oV) {
        // console.log(nV, oV);
        if (this.titleType == "新增" || this.titleType == "登记") {
          if (
            this.ruleForm.eventTitle === "" ||
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
        if (newV !== "" && newV !== null && newV.length !== 0) {
          let caseID = newV[0].id;
          let caseName = newV[0].name;
          this.$emit("refreshEvent");
          sessionStorage.setItem("caseID", caseID);
          sessionStorage.setItem("caseName", caseName);
          if (sessionStorage.getItem("caseID") != 0) {
            this.caseFor.push({ id: sessionStorage.getItem("caseID") });
            // console.log(this.caseFor);
          }
        }
        if (oldV.length == 0) {
          return;
        }
        if (newV.length !== 0 && oldV.length !== 0) {
          // console.log(newV, oldV);
          if (newV[0].id !== oldV[0].id) {
            this.$emit("delectReape");
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
          let isSame = this.deepCompare(nV, oV); // 深度遍历参数是否一样
          this.isUpdateParameter = !isSame; // 取反
          if (this.isUpdateParameter || this.isUpdateForm) {
            this.$emit("updateReportForm", true); // 更新的父组件，父组件去判断是否弹窗
          } else {
            this.$emit("updateReportForm", false); // 更新的父组件，父组件去判断是否弹窗
          }
        }
        let obj = {};
        obj = this.parameter.find((item) => {
          return item.name === "死亡人数"; //筛选出匹配数据
        });
        // // console.log(obj.value);
        this.$store.commit("setDieNumber", obj && obj.value ? obj.value : 0);
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
        this.$store.commit("setSituation", nV);
        this.$emit("getAll", this.dataALL, this.paramsData);
        let isSame = this.deepCompare(this.dataALL, nV); // 是否更新表单 true:两个对象一样；false：两个对象不一样
        this.isUpdateForm = !isSame; // 取反
        if (this.isUpdateParameter || this.isUpdateForm) {
          this.$emit("updateReportForm", true); // 更新的父组件，父组件去判断是否弹窗
        } else {
          this.$emit("updateReportForm", false); // 更新的父组件，父组件去判断是否弹窗
        }
      },
      deep: true,
    },
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight);
  },
  mounted() {
    this.findFieldPrinting(); // 查询自动打印传真
    bus.$on("newFaxsComing", () => {
      this.getUnhandledFax();
    });
    bus.$on("newSmssComing", () => {
      this.getUnhandledSms();
    });
    this.ruleForm.eventTitle = sessionStorage.getItem("title");
    // this.ruleForm.reportedTime = sessionStorage.getItem("time");
    // sessionStorage.setItem('LevelID', LevelID);
    this.$nextTick(() => {
      this.getEventRank();
    });
    // bus.$off("addEvent");
    // bus.$on("addEvent", () => {
    //   this.addEvent();
    // });

    let time = new Date().getTime();
    // // console.log(time);
    this.rushFaxData = time;
    this.backSms.background =
      "url(" + "/static/img/smsContent.png" + ")center no-repeat";
    this.backSms.backgroundSize = "220px";
    this.backPhone.background =
      "url(" + "/static/img/txtNull.png" + ")center no-repeat";
    this.backPhone.backgroundSize = "100px";
    // this.getEventOptions();
    this.getTabDatas();

    this.getStateListData();
    let wrap = document.getElementsByClassName(
      "informationDisposalNew_warp"
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
                "hidden";
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
  },
  methods: {
    /**
     * @author hexinting
     * @date 2020-10-14
     * @lasteditor hexinting
     * @date 2020-10-14
     * @description 查询自动打印传真
     */
    findFieldPrinting() {
      this.$api
        .findFieldPrinting()
        .then((res) => {
          if (res.errorcode == 0) {
            if (res.data === "false") {
              this.isAutoPrinting = "关";
            } else {
              this.isAutoPrinting = "开";
            }
          }
        })
        .catch((err) => {
          this.$message({
            message: err.msg,
            type: "error",
          });
        });
    },
    /**
     * @author hexinting
     * @date 2020-10-14
     * @lasteditor hexinting
     * @date 2020-10-14
     * @description 开启，关闭自动打印传真
     */
    setAutoPrinting() {
      let data = {
        value: this.isAutoPrinting === "开" ? true : false,
      };
      this.$api
        .updateFieldPrinting(data)
        .then((res) => {
          if (res.errorcode == 0) {
            this.$message({
              message:
                this.isAutoPrinting === "开"
                  ? "已开启自动打印"
                  : "已关闭自动打印",
              type: "success",
            });
          } else {
            this.$message({
              message: res.msg,
              type: "error",
            });
          }
          this.findFieldPrinting(); // 查询自动打印传真
        })
        .catch((err) => {
          this.$message({
            message: err.msg,
            type: "error",
          });
          this.findFieldPrinting(); // 查询自动打印传真
        });
    },
    /**
     * @param {*} x 比较的对象1
     * @param {*} y 比较的对象2
     * @description 深度比较两个对象是否相等
     * @lasteditor qinjiaqi
     * @date 2020-9-30
     * @returns true 相等； false 不相等
     */
    deepCompare(x, y) {
      var i, l, leftChain, rightChain;
      function compare2Objects(x, y) {
        var p;
        // remember that NaN === NaN returns false 记住，NaN === NaN返回false
        // and isNaN(undefined) returns true isNaN(未定义)返回true
        if (
          isNaN(x) &&
          isNaN(y) &&
          typeof x === "number" &&
          typeof y === "number"
        ) {
          return true;
        }
        // Compare primitives and functions.  比较原语和函数。
        // Check if both arguments link to the same object. 检查两个参数是否链接到同一个对象。
        // Especially useful on the step where we compare prototypes 在比较原型的步骤中特别有用
        if (x === y) {
          return true;
        }
        // Works in case when functions are created in constructor. 在构造函数中创建函数时工作。
        // Comparing dates is a common scenario. Another built-ins? 比较日期是一种常见的场景。另一个内置模板?
        // We can even handle functions passed across iframes 我们甚至可以处理通过iframes传递的函数
        if (
          (typeof x === "function" && typeof y === "function") ||
          (x instanceof Date && y instanceof Date) ||
          (x instanceof RegExp && y instanceof RegExp) ||
          (x instanceof String && y instanceof String) ||
          (x instanceof Number && y instanceof Number)
        ) {
          return x.toString() === y.toString();
        }
        // At last checking prototypes as good as we can 最后，我们尽可能地检查原型
        if (!(x instanceof Object && y instanceof Object)) {
          return false;
        }

        if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
          return false;
        }
        if (x.constructor !== y.constructor) {
          return false;
        }
        if (x.prototype !== y.prototype) {
          return false;
        }
        // Check for infinitive linking loops 检查不定式连接循环
        if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
          return false;
        }
        // Quick checking of one object being a subset of another. 快速检查一个对象是否是另一个对象的子集。
        for (p in y) {
          if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
            return false;
          } else if (typeof y[p] !== typeof x[p]) {
            return false;
          }
        }
        for (p in x) {
          if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
            return false;
          } else if (typeof y[p] !== typeof x[p]) {
            return false;
          }
          switch (typeof x[p]) {
            case "object":
            case "function":
              leftChain.push(x);
              rightChain.push(y);
              if (!compare2Objects(x[p], y[p])) {
                return false;
              }
              leftChain.pop();
              rightChain.pop();
              break;

            default:
              if (x[p] !== y[p]) {
                return false;
              }
              break;
          }
        }
        return true;
      }
      if (arguments.length < 1) {
        return true;
        // throw "Need two or more arguments to compare"; 抛出“需要两个或更多的参数进行比较”;
      }
      for (i = 1, l = arguments.length; i < l; i++) {
        leftChain = [];
        rightChain = [];
        if (!compare2Objects(arguments[0], arguments[i])) {
          return false;
        }
      }
      return true;
    },
    /**
     * @author hexinting
     * @lastEditor hexinting
     * @lastDate 2020-9-25
     * @param {type} val 当前tab激活的对象
     * @descripttion:切换传真、短信、电话
     */
    handleTabChange(val) {
      // console.log(val.name);
      if (val.name === "短信") {
        this.$store.commit("setSmsOrFax", "sms");
      } else if (val.name === "传真") {
        this.$store.commit("setSmsOrFax", "fax");
      } else {
        this.$store.commit("setSmsOrFax", "phone");
      }
    },
    /**
     * @param {type} 没有
     * @return {type} undefined
     * @description：暂无关联事件时触发清空列表并能让其新增事件
     */
    addEvent() {
      let emEventId = sessionStorage.getItem("newID");
      let emCaseId = sessionStorage.getItem("caseID");
      let emEventContent = sessionStorage.getItem("createdEvent");
      this.$emit("setId", emEventId, emCaseId); //清空之前将事件ID传给事件不保存时再次用来存储事件
      // this.$emit('addPath');
      this.titleType = "新增";
      sessionStorage.removeItem("newID");
      sessionStorage.removeItem("caseID");
      this.$emit("refreshEvent"); //新增，移除旧的本地存储
      this.ruleForm.eventTitle = ""; //清空事件标题
      this.ruleForm.reportedTime = ""; //清空首报时间
      this.ruleForm.incidentTime = ""; //清空事发时间
      this.ruleForm.incidenArea = []; //清空所属区域
      this.ruleForm.incidentSite = ""; //清空事发地点
      this.ruleForm.reportingUnit = []; //清空报告单位
      this.ruleForm.incidenType = []; //清空事件类型
      this.ruleForm.serialNumber = ""; //清空事件等级
      this.ruleForm.reportSituation = ""; //清空上报情况
      this.ruleForm.allCase = ""; //清空总体情况
      this.ruleForm.speakerName = ""; //清空报告人
      this.ruleForm.speakerPhone = ""; //清空报告人电话
      this.ruleForm.timeOfWrittenSubmission = ""; //清空书面报送时间
      this.ruleForm.accidentSituation = ""; //清空事故情况
      this.ruleForm.beOnDuty = window.g.IsZengChengProject
        ? sessionStorage.getItem("displayname")
        : ""; //清空值班员，增城要默认为用户名字
      this.ruleForm.beOnDutyIds = []; //清空值班员id
      this.ruleForm.leaderOnDuty = ""; //清空值班领导
      this.ruleForm.leaderOnDutyIds = []; //清空值班领导id
      this.ruleForm.submissionMethod = ""; //清空接报方式
      this.ruleForm.deathToll = ""; //清空死亡人数
      this.ruleForm.bruiseToll = ""; //清空受伤人数
      this.ruleForm.disappearToll = ""; //清空失踪人数
      this.ruleForm.deathNum = ""; //清空死亡人数
      this.ruleForm.injuredNum = ""; //清空受伤人数
      this.parameter = []; //清空事件类型子参数
      this.test = ""; //清空事件等级id
      this.latitude = ""; //清空纬度
      this.longitude = ""; //清空经度
      this.eventAddressBook = []; //清空通讯库存储
      this.eventType = []; //清空事件类型组
      this.eventTree = []; //清空事件类型树
      this.reason = ""; //清空事发原因
      this.result = ""; //清空已造成后果
      this.growing = ""; //清空事件发展趋势
      this.messure = ""; //清空已采取措施
      let typeAdd = "新增"; //标记该事件为新增
      this.$emit("addType", typeAdd);
      // 获取默认的事件类型子参数
      let data = {
        caseId: 0,
      };
      this.$api.defaultParameters(data).then((res) => {
        if (res.errorcode == "0") {
          // console.log(res.data);
          this.parameter = res.data;
        } else {
          //this.$message.error(res.msg)
        }
      });
      // 如果本地有createdEvent项则调用
      if (emEventContent) {
        this.ruleForm.incidentTime = emEventContent.time;
        this.ruleForm.incidenArea = emEventContent.position;
        this.ruleForm.eventTitle = emEventContent.event;
      }
    },
    /**
     * @lastEditor qinjiaqi
     * @lastDate 2020-9-30
     * @param {Object} 事件类型组
     * @return {type} undefined
     * @Description 改变事件类型子参数
     */
    incidenTypeChange(arr) {
      sessionStorage.setItem("caseID", arr[arr.length - 1]);
      this.amendParameter();
      var gettree = (data) => {
        // // console.log('data: ', data);
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
      // // console.log('this.eventType: ', this.eventType);
    },
    areaTypeChange(arr) {
      var gettree = (data) => {
        // console.log("data: ", data);
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
      // console.log("this.jurisdictionData: ", this.jurisdictionData);
    },
    beOnDutyHandle() {
      this.beOnDutyVisible = true;
      this.$refs.beOnDutyDialog.checkboxGroup = this.ruleForm.beOnDutyIds;
    },
    changeBeOnDuty(checkboxGroup, checkboxData) {
      this.ruleForm.beOnDuty = "";
      this.beOnDutyVisible = false;
      this.ruleForm.beOnDutyIds = checkboxGroup;
      checkboxData.map((v) => {
        this.ruleForm.beOnDuty += v.name + "，";
      });
      this.ruleForm.beOnDuty = this.ruleForm.beOnDuty.substring(
        0,
        this.ruleForm.beOnDuty.length - 1
      );
    },
    leaderOnDutyHandle() {
      this.leaderOnDutyVisible = true;
      this.$refs.leaderOnDutyDialog.checkboxGroup = this.ruleForm.leaderOnDutyIds;
    },
    changeLeaderOnDuty(checkboxGroup, checkboxData) {
      this.ruleForm.leaderOnDuty = "";
      this.leaderOnDutyVisible = false;
      this.ruleForm.leaderOnDutyIds = checkboxGroup;
      checkboxData.map((v) => {
        this.ruleForm.leaderOnDuty += v.name + "，";
      });
      this.ruleForm.leaderOnDuty = this.ruleForm.leaderOnDuty.substring(
        0,
        this.ruleForm.leaderOnDuty.length - 1
      );
    },
    //获取事件级别
    getEventRank() {
      let data = {
        pcode: "emtlevel",
      };
      this.$api.eventLevel(data).then((res) => {
        if (res.errorcode == "0") {
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
      if (sessionStorage.getItem("newID")) {
        this.isEventDetail = key == 1 ? true : false;
      } else {
        this.$message({
          message: "请先保存事件!",
          type: "warning",
        });
      }
    },

    //来文类型选择
    handleCommand(val) {
      this.faxForm.type = val;
    },
    //转发
    msgTransmit(data) {
      // console.log(data);
      this.$refs.smsRight.historyType = data.sendType;
      this.$refs.smsRight.historyId = data.id;
      this.InformationDisposalShow = true;
      this.eventEnteringShow = false;
      const _that = this;
      setTimeout(() => {
        _that.activeAllModel = "短信";
        // _that.$refs.smsRight.msgForm.msgContent = data.remark;
        if (data.remark) {
          this.$store.commit("setCopyBusinessCard", data.remark);
        } else {
          this.$message.warning("内容为空");
        }
      }, 100);
    },
    //回复
    msgReply(data) {
      this.InformationDisposalShow = true;
      this.eventEnteringShow = false;
      const _that = this;
      setTimeout(() => {
        _that.activeAllModel = "短信";
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
    //回复
    reply() {
      // console.log(this.$store.state.msgHeadleData);
      this.InformationDisposalShow = true;
      this.eventEnteringShow = false;
      const _that = this;
      setTimeout(() => {
        this.activeAllModel = "传真";
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
          this.$store.commit("setFaxMember", [this.clickFaxInfo]);
          // console.log(
            "回复",
            this.activeAllModel,
            this.$store.state.msgHeadleData
          );
        } else {
          this.$message.error("暂无数据");
        }
      }, 100);
    },
    //转发
    transmit() {
      const _that = this;
      this.InformationDisposalShow = true;
      this.eventEnteringShow = false;
      setTimeout(() => {
        this.activeAllModel = "传真";
        if (this.$store.state.msgHeadleData) {
          this.$api
            .previewFax({ faxId: this.$store.state.msgHeadleData.id })
            .then((res) => {
              if (res.errorcode == 0) {
                // console.log(res.data);
                if (this.$refs.IcpFaxRight.faxFileList.length == 0) {
                  let objFile = new File(
                    ["First Line Text", "Second Line Text"],
                    res.data
                  );
                  this.$refs.IcpFaxRight.eventRelevance = false;
                  this.$refs.IcpFaxRight.visFlag = true;
                  this.$refs.IcpFaxRight.faxForm.caseId = this.faxForm.eventId;
                  this.$refs.IcpFaxRight.faxForm.faxTitle = this.faxForm.title;
                  this.$refs.IcpFaxRight.faxFileList.push(objFile);
                  this.$refs.IcpFaxRight.previewName = res.data;
                } else {
                  this.$message.warning("请点击清除按钮后重新选择文件上传!");
                }
              } else {
                this.$message.error(res.msg);
              }
            });
        } else {
          this.$message.error("暂无数据");
        }
      }, 100);
    },
    //传真拆分
    activeResolution() {
      if (this.allFpxPreviewPath) {
        // console.log(this.allFpxPreviewPath);
        this.$refs.resolution.flag = true;
        this.$refs.resolution.oldFaxPath = this.allFpxPreviewPath;
      }
    },
    //传真合并
    faxMergeOpen() {
      this.$refs.mergeFaxDialog.isMergeFaxDialog = true;
    },
    imgToText() {
      this.imgToTextVisible = true;
      this.$nextTick(() => {
        this.$refs.imgToText.oldFaxPath = "";
        // let filename = this.allFpxPreviewPath.substr(
        //   this.allFpxPreviewPath.lastIndexOf("/") + 1
        // ); //72c0d9d068b34cbabe812ea171f0bf94.pdf
        this.$refs.imgToText.imageTextArr = [];
        // console.log(this.imgToTextId, this.faxForm);
        if (this.allFpxPreviewPath) {
          let fileName = this.allFpxPreviewPath.substring(
            this.allFpxPreviewPath.lastIndexOf("/") + 1,
            this.allFpxPreviewPath.lastIndexOf("?")
          ); //72c0d9d068b34cbabe812ea171f0bf94.pdf
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
              this.$refs.imgToText.oldFaxPath = "";
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
      //刷新传真子组件
      let time = new Date().getTime();
      // console.log(time);
      this.rushFaxData = time;
    },
    recordingInstance(node) {
      this.audioPlanData = node; //获取到录音的实例
    },
    copyTextSuccess(e) {
      this.$message.success("复制成功");
      //把数据复制到文本域
      this.$refs.newFaxModel.copyToTextarea(e.text);
    },
    copyTextError() {
      this.$message.error("复制失败");
    },
    rowClick(row) {
      this.row = row;
    },
    saveEdite(item, types) {
      if (!this.selectState) {
        this.editIndex = "";
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
          this.editIndex = "";
          if (types == "fax") {
            this.getUnhandledFax();
          } else if (types == "phone") {
            this.audioPlanData.stop();
            this.phoneTreeLoading = true;
            this.phoneRushe = false;
            this.$nextTick(() => {
              this.testAudio = false;
              this.phoneRushe = true;
              this.audioUrlData = "";
              this.audioId = "";
              this.phoneText = "";
            });
            this.getUnhandledPhone();
          } else if (types == "sms") {
            this.getUnhandledSms();
          }
        } else {
          //this.$message.error(res.msg)
        }
      });
    },
    tabClick(tab, event) {
      this.queryFaxAllTime = "";
      this.queryFaxAllSelect = "";
      this.phonePerson = "";
      this.leftEventId = "";
      this.changeIndex = -1;
      this.currentFaxPage = 1;
      this.InformationDisposalShow = false;
      this.eventEnteringShow = true;
      this.ruleForm.speakerName = "";
      this.ruleForm.speakerPhone = "";
      this.$nextTick(() => {
        //切换tabs时刷新右侧辅助页面的数据
        // this.activeAllModel = "传真"; //默认传真
        this.InformationDisposalShow = true;
        this.eventEnteringShow = false;
        this.changeRed = "信息处置";
      });
      // console.log(tab);
      return;
      if (tab.name == "传真") {
        // this.treeLoading = true;
        this.faxRushe = false;
        this.$nextTick(() => {
          this.allFpxPreviewPath = "";
          this.faxRushe = true;
        });
        this.getUnhandledFax();
        this.nowTag = "fax";
        this.$store.commit("setSmsOrFax", "fax");
      } else if (tab.name == "电话") {
        this.phoneTreeLoading = true;
        this.phoneRushe = false;
        this.$nextTick(() => {
          this.testAudio = false;
          this.phoneRushe = true;
          this.audioUrlData = "";
          this.audioId = "";
          this.phoneText = "";
        });
        this.getUnhandledPhone();
        this.nowTag = "phone";
        this.$store.commit("setSmsOrFax", "phone");
      } else if (tab.name == "短信") {
        this.smsTreeLoading = true;
        this.smsText = "";
        this.getUnhandledSms();
        this.nowTag = "sms";
        this.$store.commit("setSmsOrFax", "sms");
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
      //自适应高度
      let h =
        document.documentElement.clientHeight || document.body.clientHeight;
      this.elTablePlanStyle.height = (h - (68 + 235) + 98) / 2 + "px";
      this.elTablePlanStyleNext.height = h - (68 + 235) + 40 + "px"; //原件预览文件区域高度
      this.listHeight.height = h - (68 + 450) + 120 + "px";
      this.heightStyle.height = h - (68 + 235) + 103 + "px";
      this.rightHeightStyle.height = h - (68 + 163 + 40) + 198 + "px";
      this.saveEntering.height = h - (11 + 190) + "px";
      this.turnTheText.height = (h - (68 + 235) + 54) / 2 - 34 + "px";
      // 信息登记高度
      this.infoEnteringStyle.height = h - (68 + 118 + 40) + 138 + "px";
      // 事件登记高度
      this.eventEnteringStyle.height = h - (68 + 118 + 40) + 138 + "px";
    },
    getTabDatas() {
      //获取事件列表
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
      this.$emit("allModelCloseDialog");
    },
    closeDialog() {
      //colse关闭窗口
      this.addEventDialog = false;
      this.$refs.eventDialog.clearData(); //刷新子组件数据
      // this.$emit('refreshEvent')
    },
    handleCurrentFaxChange(val) {
      //传真model分页器
      this.$emit("handleCurrentFaxChange", val);
    },
    /**
     * @param {number/string} id 报送单位id or 报送单位名字(数据库中，有的旧数据是报送单位名字，新数据是报送单位id)
     * @returns data data: { id: 报送单位id, name: 报送单位名字 }
     * @editor qinjiaqi
     * @lastDate 2020-10-19
     * @description 获取报告单位
     */
    getReportingUnit(id) {
      // console.log("--------------------------------");
      // console.log("报送单位：", id);
      // console.log("报送单位列表", this.reportingUnitData);
      var departId = parseInt(id);
      // console.log("报送单位：", departId, departId.toString() == "NaN");
      if (departId.toString() != "NaN") {
        // console.log("----reportDepartId------", departId);
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
          this.ruleForm.reportingUnitName = departName;
          this.ruleForm.reportingUnit = departArr;
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
              // console.log("选中报送单位：", this.reportingUnitData[i]);
              departName = this.reportingUnitData[i].children.filter(
                (item) => item.id === departId
              )[0].name;
              departArr.push(
                this.reportingUnitData[i].children.filter(
                  (item) => item.id === departId
                )[0].id
              );
              this.ruleForm.reportingUnit = departArr;
              this.ruleForm.reportingUnitName = departName;
              // console.log(
                "第二层：",
                this.ruleForm.reportingUnit,
                departArr,
                departName
              );
              return false;
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
                    // console.log("选中报送单位：", child);
                    departArr.push(this.reportingUnitData[i].children[j].id); // 第二层
                    departArr.push(
                      child.filter((item) => item.id === departId)[0].id
                    ); // 第三层
                    departName = child.filter((item) => item.id === departId)[0]
                      .name;
                    this.ruleForm.reportingUnitName = departName;
                    this.ruleForm.reportingUnit = departArr;
                    // console.log(
                      "第三层：",
                      this.ruleForm.reportingUnit,
                      departArr,
                      departName
                    );
                    return false;
                  } else {
                    for (let el of child) {
                      if (
                        el.children &&
                        el.children.filter((item) => item.id === departId)
                          .length > 0
                      ) {
                        // console.log("第四层", child, el.id);
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
                        this.ruleForm.reportingUnitName = departName;
                        this.ruleForm.reportingUnit = departArr;
                        // console.log(
                          "第四层：",
                          this.ruleForm.reportingUnit,
                          departArr,
                          departName
                        );
                        return false;
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
        if (
          this.reportingUnitData.filter((item) => item.name === departName)
            .length > 0
        ) {
          let departArr = [];
          departArr.push(
            this.reportingUnitData.filter((item) => item.name === departName)[0]
              .id
          );
          this.ruleForm.reportingUnit = departArr;
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
              // console.log("第一级", this.reportingUnitData[i].name);
              departArr.push(
                this.reportingUnitData[i].children.filter(
                  (item) => item.name === departName
                )[0].id
              );
              this.ruleForm.reportingUnit = departArr;
              // console.log(
                "第二层：",
                this.ruleForm.reportingUnit,
                departArr,
                departName
              );
              return false;
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
                // console.log(
                  "第二级",
                  this.reportingUnitData[i].children[j].name
                );
                if (this.reportingUnitData[i].children[j].children) {
                  let child = this.reportingUnitData[i].children[j].children;
                  if (
                    child.filter((item) => item.name === departName).length > 0
                  ) {
                    // console.log(
                      "第三级",
                      child.filter((item) => item.name === departName)[0].name
                    );
                    // console.log("选中报送单位：", child);
                    departArr.push(this.reportingUnitData[i].children[j].id); // 第二层
                    departArr.push(
                      child.filter((item) => item.name === departName)[0].id
                    ); // 第三层
                    this.ruleForm.reportingUnit = departArr;
                    // console.log(
                      "第三层：",
                      this.ruleForm.reportingUnit,
                      departArr,
                      departName
                    );
                    return false;
                  } else {
                    for (let el of child) {
                      if (
                        el.children &&
                        el.children.filter((item) => item.name === departName)
                          .length > 0
                      ) {
                        // console.log("第四级", el.name);
                        // console.log("第四层", child, el.id);
                        departArr.push(
                          this.reportingUnitData[i].children[j].id
                        ); // 第二层
                        departArr.push(el.id); // 第三层
                        departArr.push(
                          el.children.filter(
                            (item) => item.name === departName
                          )[0].id
                        ); // 第四层
                        this.ruleForm.reportingUnit = departArr;
                        // console.log(
                          "第四层：",
                          this.ruleForm.reportingUnit,
                          departArr,
                          departName
                        );
                        return false;
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
    getCaseClassId(caseClassId, caseName) {
      // alert(5)
      let incidenType = [];
      // console.log("灾害类型：", caseClassId, caseName);
      // console.log("灾害类型：", this.ruleForm.incidenType, this.eventTypeData);
      if (
        this.eventTypeData.filter((item) => item.id === caseClassId).length > 0
      ) {
        let filterData = this.eventTypeData.filter(
          (item) => item.id === caseClassId
        );
        incidenType.push(filterData[0].id);
        this.ruleForm.incidenType = incidenType;
        // console.log("----结果---灾害类型：", this.ruleForm.incidenType);
        return false;
      } else {
        for (let a of this.eventTypeData) {
          if (a.children && a.children.length > 0) {
            if (
              a.children.filter((item) => item.id === caseClassId).length > 0
            ) {
              let filterData = a.children.filter(
                (item) => item.id === caseClassId
              );
              incidenType.push(a.id);
              incidenType.push(filterData[0].id);
              this.ruleForm.incidenType = incidenType;
              // console.log("----结果---灾害类型：", this.ruleForm.incidenType);
              return false;
            } else {
              for (let b of a.children) {
                // console.log("----", b);
                if (b.children && b.children.length > 0) {
                  if (
                    b.children.filter((item) => item.id === caseClassId)
                      .length > 0
                  ) {
                    let filterData = b.children.filter(
                      (item) => item.id === caseClassId
                    );
                    incidenType.push(a.id);
                    incidenType.push(b.id);
                    incidenType.push(filterData[0].id);
                    this.ruleForm.incidenType = incidenType;
                    // console.log(
                      "----结果---灾害类型：",
                      this.ruleForm.incidenType
                    );
                    return false;
                  } else {
                    for (let c of b.children) {
                      if (c.children && c.children.length > 0) {
                        if (
                          c.children.filter((item) => item.id === caseClassId)
                            .length > 0
                        ) {
                          let filterData = c.children.filter(
                            (item) => item.id === caseClassId
                          );
                          incidenType.push(a.id);
                          incidenType.push(b.id);
                          incidenType.push(c.id);
                          incidenType.push(filterData[0].id);
                          this.ruleForm.incidenType = incidenType;
                          // console.log(
                            "----结果---灾害类型：",
                            this.ruleForm.incidenType
                          );
                          return false;
                        } else {
                        }
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
    // 获取所属区域的id
    getIncidenAreaId(areaId) {
      // alert(1)
      let incidenArea = [];
      // console.log("辖区Id", areaId);
      // console.log(
        "辖区名字：",
        this.ruleForm.incidenArea,
        this.jurisdictionData
      );
      if (
        this.jurisdictionData.filter((item) => item.id === areaId).length > 0
      ) {
        let filterData = this.jurisdictionData.filter(
          (item) => item.id === areaId
        );
        incidenArea.push(filterData[0].id);
        this.ruleForm.incidenArea = incidenArea;
        return false;
      } else {
        for (let a of this.jurisdictionData) {
          if (a.children && a.children.length > 0) {
            if (a.children.filter((item) => item.id === areaId).length > 0) {
              let filterData = a.children.filter((item) => item.id === areaId);
              incidenArea.push(a.id);
              incidenArea.push(filterData[0].id);
              this.ruleForm.incidenArea = incidenArea;
              return false;
            } else {
              for (let b of a.children) {
                // console.log("----", b);
                if (b.children && b.children.length > 0) {
                  if (
                    b.children.filter((item) => item.id === areaId).length > 0
                  ) {
                    let filterData = b.children.filter(
                      (item) => item.id === areaId
                    );
                    incidenArea.push(a.id);
                    incidenArea.push(b.id);
                    incidenArea.push(filterData[0].id);
                    this.ruleForm.incidenArea = incidenArea;
                    return false;
                  } else {
                    for (let c of b.children) {
                      if (c.children && c.children.length > 0) {
                        if (
                          c.children.filter((item) => item.id === areaId)
                            .length > 0
                        ) {
                          let filterData = c.children.filter(
                            (item) => item.id === areaId
                          );
                          incidenArea.push(a.id);
                          incidenArea.push(b.id);
                          incidenArea.push(c.id);
                          incidenArea.push(filterData[0].id);
                          this.ruleForm.incidenArea = incidenArea;
                          return false;
                        } else {
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      // console.log(
        "辖区名字：",
        this.ruleForm.incidenArea,
        this.jurisdictionData
      );
    },
    //点击传真列表
    changeItem(item, index) {
      // console.log("index: ", index);
      //点击每一条数据
      // console.log("单行传真数据: ", item);
      this.clickFaxInfo = {
        id: item.contactId,
        name: item.name || item.phone,
        fax: item.phone,
      };
      this.currentFax = item;
      item.sendType = "fax";
      item.sendTypeId = item.id;
      this.$store.dispatch("msgHeadleDatas", item);
      this.faxcontactId = item.contactId;
      this.phonePerson = "";
      this.changeIndex = index;
      this.allFpxPreviewPath = "";
      this.textShow = "";
      this.leftEventId = item.id;
      this.imgToTextId = item.id;
      this.phonePerson = item.phone;
      this.faxForm = { ...item };

      this.faxForm.eventId = item.eventId; // 如果没有id，设置为空
      this.faxForm.eventTitle = item.event;
      this.nowTag = "fax";
      // 判断当前联事件id是否存在关联事件列表里面
      if (item === 0) {
        this.faxForm.eventId = "";
      }

      // 判断当前联事件id是否存在关联事件列表里面，如果不存在，faxForm.eventId为空
      // this.isHaveEventId(item.eventId);

      //获取pdf
      let data1 = {
        faxId: item.id,
      };
      this.$api.previewFax(data1).then((res) => {
        if (res.errorcode == 0) {
          this.allFpxPreviewPath = `${window.g.ApiUrl}/fax/${
            res.data
          }?timeStamp=${new Date().getTime()}`;
        } else {
          //this.$message.error(res.msg)
        }
      });
      if (item.eventId === "" || !item.eventId || item.eventId === undefined) {
        this.addEvent(); // 没有关联事件则清空事件登记表单数据
      } else {
        // 有关联事件则获取事件详情
        //报告人
        let data = {
          id: item.eventId,
        };
        this.$api.findById(data).then((res) => {
          // alert('根据事件id获取事件详情')
          // console.log(res);
          if (res.errorcode == "0") {
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
              res.data.event.reportDepart !== ""
            ) {
              // 旧数据 res.data.event.reportDepartId为0 res.data.event.reportDepart为报送单位id
              // 获取reportDepartId
              this.getReportingUnit(res.data.event.reportDepart);
            }
            this.getIncidenAreaId(res.data.event.areaId);
            this.getCaseClassId(
              res.data.event.caseClassId,
              res.data.event.caseClass
            );
            // console.log("事件数据：", this.ruleForm);
            /**
             * 获取电话计时是否开启存储在本地存储
             * **/
            let extend1 = res.data.event.extend1;
            let extend2 = res.data.event.extend2;
            sessionStorage.setItem("phoneExtend1", extend1);
            sessionStorage.setItem("smsExtend2", extend2);

            //重新赋值不绑定
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
              res.data.event.levelId !== "" &&
              res.data.event.planId !== "" &&
              res.data.event.planId !== 0
            ) {
              //已经启动过预案
              this.$store.commit("setTurnOnEmergencyResponse", true);
            } else {
              //没启动过预案
              this.$store.commit("setTurnOnEmergencyResponse", false);
            }

            if (res.data.eventParams.length == 0) {
              this.eventsParameters = false;
            } else {
              this.eventsParameters = true;
              // // console.log('this.parameter: ',  this.parameter);
              setTimeout(() => {
                this.parameter = res.data.eventParams;
              }, 600);
              this.paramsData = res.data.eventParams; //重新赋值数据库数据做对比
            }
            this.$emit("getAll", this.dataALL, this.paramsData);
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
          return false;
        } else {
          this.faxForm.eventId = ""; // 如果没有id，设置为空
        }
      }
    },

    //点击电话列表
    clickPhoneList(item, index) {
      this.phonePerson = "";
      this.leftEventId = "";
      this.changeIndex = index;
      this.audioList = {};
      this.audioUrlData = "";
      this.phoneText = "";
      this.leftEventId = item.id;
      // console.log(item.phone);
      this.phonePerson = item.phone;
      this.nowTag = "phone";
      //获取录音文件
      let data = {
        phoneId: item.id,
      };
      this.$api.audioUrl(data).then((res) => {
        if (res.errorcode == 0) {
          if (res.data.url && res.data.url !== "") {
            this.testAudio = false;
            this.$nextTick(() => {
              this.testAudio = true;
              this.audioId = item.id;
              this.audioUrlData = window.g.ApiUrl + "/rec/" + res.data.url;
            });
          } else {
            this.testAudio = false;
          }
        } else {
          this.testAudio = false;
          this.audioUrlData = null;
          //this.$message.error(res.msg)
        }
      });
      //获取录音转文本内容
      this.$api.phoneToText(data).then((res) => {
        if (res.errorcode == 0) {
          this.phoneText = res.data;
        } else {
          // //this.$message.error(res.msg)
        }
      });
      //报告人
      this.$api.findContactorByMobile({ phoneNum: item.phone }).then((res) => {
        if (res.code == 0) {
          this.ruleForm.speakerName = res.data.name || "";
          this.ruleForm.speakerPhone = res.data.mobile || "";
        } else {
          this.$message.error(res.msg);
        }
      });
      if (!item.eventId === "" || !item.eventId || item.eventId === undefined) {
        this.addEvent(); // 没有关联事件则清空事件登记表单数据
      } else {
        // 有关联事件则获取事件详情
        //报告人
        let data = {
          id: item.eventId,
        };
        this.$api.findById(data).then((res) => {
          // alert('根据事件id获取事件详情')
          // // console.log(res,1111);
          if (res.errorcode == "0") {
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
              res.data.event.reportDepart !== ""
            ) {
              // 旧数据 res.data.event.reportDepartId为0 res.data.event.reportDepart为报送单位id
              // 获取reportDepartId
              this.getReportingUnit(res.data.event.reportDepart);
            }
            this.getIncidenAreaId(res.data.event.areaId);
            this.getCaseClassId(
              res.data.event.caseClassId,
              res.data.event.caseClass
            );
            // console.log("事件数据：", this.ruleForm);
            /**
             * 获取电话计时是否开启存储在本地存储
             * **/
            let extend1 = res.data.event.extend1;
            let extend2 = res.data.event.extend2;
            sessionStorage.setItem("phoneExtend1", extend1);
            sessionStorage.setItem("smsExtend2", extend2);

            //重新赋值不绑定
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
              res.data.event.levelId !== "" &&
              res.data.event.planId !== "" &&
              res.data.event.planId !== 0
            ) {
              //已经启动过预案
              this.$store.commit("setTurnOnEmergencyResponse", true);
            } else {
              //没启动过预案
              this.$store.commit("setTurnOnEmergencyResponse", false);
            }

            if (res.data.eventParams.length == 0) {
              this.eventsParameters = false;
            } else {
              this.eventsParameters = true;
              // // console.log('this.parameter: ',  this.parameter);
              setTimeout(() => {
                this.parameter = res.data.eventParams;
              }, 600);
              this.paramsData = res.data.eventParams; //重新赋值数据库数据做对比
            }
            this.$emit("getAll", this.dataALL, this.paramsData);
            // // console.log('parameter: ', parameter);
          }
        });
      }
    },
    //点击短信列表
    clickSmsList(item, index) {
      this.phonePerson = "";
      this.leftEventId = "";
      this.changeIndex = index;
      this.smsText = item.title;
      this.leftEventId = item.id;
      this.phonePerson = item.phone;
      this.nowTag = "sms";
      // console.log("nowTag", this.nowTag);
      //报告人
      this.$api.findContactorByMobile({ phoneNum: item.phone }).then((res) => {
        if (res.code == 0) {
          this.ruleForm.speakerName = res.data.name || "";
          this.ruleForm.speakerPhone = res.data.mobile || "";
        } else {
          this.$message.error(res.msg);
        }
      });
      if (!item.eventId === "" || !item.eventId || item.eventId === undefined) {
        this.addEvent(); // 没有关联事件则清空事件登记表单数据
      } else {
        // 有关联事件则获取事件详情
        //报告人
        let data = {
          id: item.eventId,
        };
        this.$api.findById(data).then((res) => {
          // alert('根据事件id获取事件详情')
          // // console.log(res,1111);
          if (res.errorcode == "0") {
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
              res.data.event.reportDepart !== ""
            ) {
              // 旧数据 res.data.event.reportDepartId为0 res.data.event.reportDepart为报送单位id
              // 获取reportDepartId
              this.getReportingUnit(res.data.event.reportDepart);
            }
            this.getIncidenAreaId(res.data.event.areaId);
            this.getCaseClassId(
              res.data.event.caseClassId,
              res.data.event.caseClass
            );
            // console.log("事件数据：", this.ruleForm);
            /**
             * 获取电话计时是否开启存储在本地存储
             * **/
            let extend1 = res.data.event.extend1;
            let extend2 = res.data.event.extend2;
            sessionStorage.setItem("phoneExtend1", extend1);
            sessionStorage.setItem("smsExtend2", extend2);

            //重新赋值不绑定
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
              res.data.event.levelId !== "" &&
              res.data.event.planId !== "" &&
              res.data.event.planId !== 0
            ) {
              //已经启动过预案
              this.$store.commit("setTurnOnEmergencyResponse", true);
            } else {
              //没启动过预案
              this.$store.commit("setTurnOnEmergencyResponse", false);
            }

            if (res.data.eventParams.length == 0) {
              this.eventsParameters = false;
            } else {
              this.eventsParameters = true;
              // // console.log('this.parameter: ',  this.parameter);
              setTimeout(() => {
                this.parameter = res.data.eventParams;
              }, 600);
              this.paramsData = res.data.eventParams; //重新赋值数据库数据做对比
            }
            this.$emit("getAll", this.dataALL, this.paramsData);
            // // console.log('parameter: ', parameter);
          }
        });
      }
    },
    eventRelevance(item) {
      //事件关联
      this.eventList = true;
      this.id = item.id;
    },
    pageMode() {
      //监听是第几页
    },
    beforeClose() {
      //叉叉弹窗关闭销毁
      this.eventList = false;
      this.rushKist = false; //放在关闭时能解决V-if闪屏问题
      this.$nextTick(() => {
        this.rushKist = true;
      });
    },
    colser() {
      //取消
      this.eventList = false;
      this.rushKist = false; //放在关闭时能解决V-if闪屏问题
      this.$nextTick(() => {
        this.rushKist = true;
      });
    },
    cufim() {
      //确认
      this.eventList = false;
      this.rushKist = false; //放在关闭时能解决V-if闪屏问题
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
          if (res.errorcode == "0") {
            // console.log(res.data);
            if (this.nowTag == "fax") {
              this.getUnhandledFax();
            } else if (this.nowTag == "phone") {
              this.getUnhandledPhone();
            } else if (this.nowTag == "sms") {
              this.getUnhandledSms();
            }
            this.$message({
              message: "关联成功",
              type: "success",
            });
          } else {
            //this.$message.error(res.msg)
          }
        });
      }
      this.row = "";
    },
    InformationDisposal() {
      //事件录入
      this.changeRed = "通讯处置";
      this.eventEnteringShow = false;
      this.InformationDisposalShow = true;
      this.infoEnteringShow = false;
    },
    eventEntering() {
      //信息处置
      this.changeRed = "事件登记";
      this.eventEnteringShow = true;
      this.InformationDisposalShow = false;
      this.infoEnteringShow = false;
    },
    infoEntering() {
      //信息处置
      this.changeRed = "信息登记";
      this.infoEnteringShow = true;
      this.eventEnteringShow = false;
      this.InformationDisposalShow = false;
    },
    //根据修改的事件类型获取事件参数
    amendParameter() {
      let caseIdParameter = sessionStorage.getItem("caseID");
      // console.log("caseIdParameter: ", caseIdParameter);
      let data = {
        caseId: caseIdParameter,
      };
      this.$api.defaultParameters(data).then((res) => {
        if (res.errorcode == "0") {
          // console.log(res.data);
          if (res.data.length > 0) {
            this.eventsParameters = true;
            this.parameter = res.data;
            // console.log("this.parameter:", this.parameter);
          }
        } else {
          //this.$message.error(res.msg)
        }
      });
    },
    getUnhandledFax() {
      //获取未处理的传真
      this.treeLoading = true;
      const _that = this;
      let time1 = "";
      let time2 = "";
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
        blacklist: 0 // 不查询黑名单传真
      };
      // // console.log(data)
      this.$api
        .getUnhandledFax(data)
        .then((res) => {
          if (res.errorcode == 0) {
            if (res.data) {
              this.list = res.data.data;
              this.totalFax = res.data.total;
              if (res.data.data.length != 0) {
                setTimeout(() => {
                  res.data.data[0].sendType = "fax";
                  res.data.data[0].sendTypeId = res.data.data[0].id;
                  if (_that.InformationDisposalShow) {
                    setTimeout(() => {
                      if (this.$refs.IcpFaxRight !== undefined) {
                        this.$refs.IcpFaxRight.visFlag = true;
                        _that.$refs.IcpFaxRight.eventRelevance = false;
                        _that.$refs.IcpFaxRight.msgHeadleState = "yes";
                      }
                      if (this.$refs.smsRight !== undefined) {
                        _that.$refs.smsRight.msgHeadleState = "yes";
                      }
                    }, 100);
                  }
                  _that.$store.dispatch("msgHeadleDatas", res.data.data[0]);
                }, 500);
                this.getEventOptions();
                setTimeout(() => {
                  this.changeItem(
                    this.changeIndex != -1
                      ? res.data.data[this.changeIndex]
                      : res.data.data[0],
                    this.changeIndex != -1 ? this.changeIndex : 0
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
            //this.$message.error(res.msg)
            this.list = [];
            this.totalFax = 0;
            this.treeLoading = false;
          }
        })
        .catch(() => {
          this.list = [];
          this.totalFax = 0;
          this.treeLoading = false;
        });
    },
    getUnhandledPhone() {
      const _that = this;
      //获取未处理的电话
      let time1 = "";
      let time2 = "";
      this.phoneTreeLoading = true;
      this.changeIndex = -1;
      this.nowTag = "phone";
      this.phonePerson = "";
      this.InformationDisposalShow = false;
      this.eventEnteringShow = true;
      this.$nextTick(() => {
        //切换tabs时刷新右侧辅助页面的数据
        this.activeAllModel = "传真"; //默认传真
        this.InformationDisposalShow = true;
        this.eventEnteringShow = false;
        this.changeRed = "信息处置";
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
        // // console.log(res);
        if (res.errorcode == 0) {
          this.list = res.data.data;
          this.totalFax = res.data.total;
          this.phoneTreeLoading = false;
          setTimeout(() => {
            _that.$refs.IcpFaxRight.msgHeadleState = "yes";
            _that.$refs.smsRight.msgHeadleState = "yes";
          }, 100);
          this.clickPhoneList(res.data.data[0], 0);
        } else {
          //this.$message.error(res.msg)
        }
      });
    },
    getUnhandledSms() {
      const _that = this;
      //获取未处理的短信
      let time1 = "";
      let time2 = "";
      this.smsText = "";
      this.smsTreeLoading = true;
      this.changeIndex = -1;
      this.nowTag = "sms";
      this.phonePerson = "";
      this.InformationDisposalShow = false;
      this.eventEnteringShow = true;
      this.$nextTick(() => {
        //切换tabs时刷新右侧辅助页面的数据
        this.activeAllModel = "传真"; //默认传真
        this.InformationDisposalShow = true;
        this.eventEnteringShow = false;
        this.changeRed = "信息处置";
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
      this.$api.getUnhandledSms(data).then((res) => {
        // console.log(res);
        if (res.errorcode == 0) {
          this.list = res.data.data;
          this.totalFax = res.data.total;
          this.smsTreeLoading = false;
          setTimeout(() => {
            _that.$refs.IcpFaxRight.msgHeadleState = "yes";
            _that.$refs.smsRight.msgHeadleState = "yes";
          }, 100);
          this.clickSmsList(res.data.data[0], 0);
        } else {
          //this.$message.error(res.msg)
        }
      });
    },
    formatDateTime(time) {
      let date = time;
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      return y + "-" + m + "-" + d;
    },
    //生成事件报文模板
    eventMessage() {
      let data = {
        caseId: sessionStorage.getItem("caseID"),
        typeId: "699",
        page: 1,
        size: 10,
      };
      this.$api.templateList(data).then((res) => {
        if (res.errorcode == 0) {
          // console.log(res.data.data);
          res.data.data.forEach((item, i) => {
            let addClass = item.content;
            // console.log(addClass);
            //替换事件基本信息，没填的不替换、保留占位符
            if (
              this.ruleForm.eventTitle !== undefined
              // this.ruleForm.eventTitle !== null &&
              // this.ruleForm.eventTitle !== ""
            ) {
              addClass = addClass.replace(
                "【事件标题】",
                this.ruleForm.eventTitle
              );
            }
            if (
              this.ruleForm.reportedTime !== undefined &&
              this.ruleForm.reportedTime !== null &&
              this.ruleForm.reportedTime !== ""
            ) {
              addClass = addClass.replace(
                "【接报时间】",
                this.ruleForm.reportedTime
              );
            }
            if (
              this.ruleForm.incidentTime !== undefined &&
              this.ruleForm.incidentTime !== null &&
              this.ruleForm.incidentTime !== ""
            ) {
              addClass = addClass.replace(
                "【事发时间】",
                this.ruleForm.incidentTime
              );
            }
            if (this.ruleForm.incidenArea.length > 0) {
              addClass = addClass.replace(
                "【事发区域】",
                this.ruleForm.incidenArea
              );
            }
            if (
              this.ruleForm.incidentSite !== undefined &&
              this.ruleForm.incidentSite !== null &&
              this.ruleForm.incidentSite !== ""
            ) {
              addClass = addClass.replace(
                "【事发地点】",
                this.ruleForm.incidentSite
              );
            }
            if (this.ruleForm.reportingUnit.length > 0) {
              addClass = addClass.replace(
                "【报送单位】",
                this.ruleForm.reportingUnit
              );
            }
            if (this.ruleForm.incidenType.length > 0) {
              addClass = addClass.replace(
                "【事件类型】",
                this.ruleForm.incidenType
              );
            }
            if (
              this.ruleForm.speakerName !== undefined &&
              this.ruleForm.speakerName !== null &&
              this.ruleForm.speakerName !== ""
            ) {
              addClass = addClass.replace(
                "【报告人-姓名】",
                this.ruleForm.speakerName
              );
            }
            if (
              this.ruleForm.speakerPhone !== undefined &&
              this.ruleForm.speakerPhone !== null &&
              this.ruleForm.speakerPhone !== ""
            ) {
              addClass = addClass.replace(
                "【报送人-电话】",
                this.ruleForm.speakerPhone
              );
            }
            if (
              this.reason !== undefined &&
              this.reason !== null &&
              this.reason !== ""
            ) {
              addClass = addClass.replace("【事发原因】", this.reason);
            }
            if (
              this.result !== undefined &&
              this.result !== null &&
              this.result !== ""
            ) {
              addClass = addClass.replace("【已造成后果】", this.result);
            }
            if (
              this.growing !== undefined &&
              this.growing !== null &&
              this.growing !== ""
            ) {
              addClass = addClass.replace("【事件发展趋势】", this.growing);
            }
            if (
              this.messure !== undefined &&
              this.messure !== null &&
              this.messure !== ""
            ) {
              addClass = addClass.replace("【已采取措施】", this.messure);
            }

            for (let param of this.parameter) {
              // console.log(param);
              // console.log(`【${param.name}】` === "【类型】");
              //需要根据信息要素名称匹配替换的字符串，名称为空则跳过
              if (
                param.name === undefined ||
                param.name === null ||
                param.name === ""
              ) {
                continue;
              }
              if (
                param.value === undefined ||
                param.value === null ||
                param.value === ""
              ) {
                //没填时显示暂无
                addClass = addClass.replace(`【${param.name}】`, "暂无");
              } else {
                let str = `${param.value}`;
                if (
                  param.unit === undefined ||
                  param.unit === null ||
                  param.unit === ""
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

            //// console.log(arr); // ["受伤人数: 0(位);", "时间: null(null);", "死亡人数: 0(位);", "文本: null(本);"]

            // if(item.content.indexOf('受伤人数')!=-1){
            //   this.parameter.forEach((it,i)=>{//情景要素
            //     if(it.name.indexOf('受伤人数')!=-1){
            //       addClass = addClass.replace("【受伤人数】",it.value==(null||undefined)?0:it.value);
            //     }
            //
            //   })
            //
            // }
            // if(item.content.indexOf('时间')!=-1){
            //   this.parameter.forEach((it,i)=>{//情景要素
            //     if(it.name.indexOf('时间')!=-1){
            //       addClass = addClass.replace("【时间】",it.value==(null||undefined)?'暂无时间':it.value);
            //     }
            //
            //   })
            // }
            //
            // if(item.content.indexOf('死亡人数')!=-1){
            //   this.parameter.forEach((it,i)=>{//情景要素
            //     if(it.name.indexOf('死亡人数')!=-1){
            //       addClass = addClass.replace("【死亡人数】",it.value==(null||undefined)?0:it.value);
            //     }
            //
            //   })
            // }
            //
            // if(item.content.indexOf('文本')!=-1){
            //   this.parameter.forEach((it,i)=>{//情景要素
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
          //this.$message.error(res.msg)
        }
      });
    },
    //根据事件标题匹配事件类型和预案
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
          if (res.data === "" || res.data === []) {
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
          //this.$message.error(res.msg)
        }
      });
    },
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
    },
    //关闭事发地点的弹窗
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
        this.ruleForm.reportedTime == "" ||
        this.ruleForm.reportedTime == null ||
        this.ruleForm.reportedTime == undefined
      ) {
        this.$message({
          message: "请填写接报时间",
          type: "warning",
        });
        return;
      }
      if (
        this.ruleForm.incidentTime == "" ||
        this.ruleForm.incidentTime == null ||
        this.ruleForm.incidentTime == undefined
      ) {
        this.$message({
          message: "请填写事发时间",
          type: "warning",
        });
        return;
      }
      if (
        this.ruleForm.allCase == "" ||
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
          "基本情况已有内容, 是否覆盖?点击【取消】则自动生成的内容到末尾",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            this.$refs.ruleForm.clearValidate();
            this.ruleForm.allCase = "";
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
            //               `\n\n${this.ruleForm.reportedTime}接报:${this.ruleForm.incidentTime},发生${this.ruleForm.incidenType}事故事件。
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
      //获取现在的时间
      let now = new Date();
      let year = now.getFullYear(); //年
      let month = now.getMonth() + 1; //月
      let day = now.getDate(); //日
      let hh = now.getHours(); //时
      let mm = now.getMinutes(); //分
      let ss = now.getSeconds(); //秒
      let clock = year + "-";
      if (month < 10) clock += "0";
      clock += month + "-";
      if (day < 10) clock += "0";
      clock += day + " ";
      if (hh < 10) clock += "0";
      clock += hh + ":";
      if (mm < 10) clock += "0";
      clock += mm + ":";
      if (ss < 10) clock += "0";
      clock += ss;
      // this.ruleForm.incidentTime=clock
      this.ruleForm.reportedTime = clock;
    },
    //发送事发地点弹窗确认
    confirmMultiple(checkedCities) {
      // console.log(checkedCities);
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
      let data = {
        title: this.ruleForm.title,
        location: this.ruleForm.incidentSite, //位置
        latitude: this.latitude, //纬度
        longitude: this.longitude, //经度
        contacts: checkedCities,
      };
      this.$api.sendLocation(data).then((res) => {
        if (res.errorcode == 0) {
          this.currentPage = 1;
          this.selectData = false;
          this.$message({
            message: "发送成功！",
            type: "success",
          });
          this.getStaetData();
        } else {
          //this.$message.error(res.msg)
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
      //保存事件
      if (this.changeIndex == -1) {
        this.$message.warning("请先选中关联左侧列表事件");
        return false;
      }
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          let eventTreeId = this.eventTree;
          let eventTypeId = this.eventType;

          if (eventTreeId.length == 0) {
            eventTreeId = "";
          } else {
            eventTreeId = eventTreeId[0].id;
          }
          if (eventTypeId.length == 0) {
            eventTypeId = "";
          } else {
            eventTypeId = eventTypeId[0].id;
          }
          if (this.longitude == "" || this.longitude == undefined) {
            this.longitude = null;
          }
          if (this.latitude == "" || this.latitude == undefined) {
            this.latitude = null;
          }
          // console.log(eventTreeId, eventTypeId);
          let data = {
            // eventCode:this.ruleForm.serialNumber,
            vcTitle: this.ruleForm.eventTitle, //事件标题
            typeId: this.leftEventId,
            type: this.nowTag, //fax,phone,sms
            dtReportTime:
              this.ruleForm.reportedTime.length < 19
                ? this.ruleForm.reportedTime + ":00"
                : this.ruleForm.reportedTime, //接报时间 格式为yyyy-MM-dd HH:mm 的时间，需要在后加”:00“ author:hexinting date:2020-11-13 bug8161
            dtOccurTime:
              this.ruleForm.incidentTime.length < 19
                ? this.ruleForm.incidentTime + ":00"
                : this.ruleForm.incidentTime, //事发时间 格式为yyyy-MM-dd HH:mm 的时间，需要在后加”:00“ author:hexinting date:2020-11-11 bug8161
            iAreaId: this.ruleForm.incidenArea[
              this.ruleForm.incidenArea.length - 1
            ], //事发区域ID
            // eventTreeId, //事发区域ID
            vcAddress: this.ruleForm.incidentSite, //事发地点
            dLongitude: this.longitude, //经度
            dLatitude: this.latitude, //纬度
            vcReportDepart: this.ruleForm.reportingUnitName, //报送单位
            vcReportDepartId: this.ruleForm.reportingUnit[
              this.ruleForm.reportingUnit.length - 1
            ],
            iCaseClassId: eventTypeId, //事件类型
            // iEventLevel: this.test,//事件等级
            iEvnetSetingParams: this.parameter, //事件参数
            txtReportSuperior: this.ruleForm.reportSituation, //上报情况
            txtReportDescription: this.ruleForm.allCase, //总体情况
            vcReportMan: this.ruleForm.speakerName,
            vcReportNum: this.ruleForm.speakerPhone,
            //deathNum: this.ruleForm.deathNum,
            // injuredNum: this.ruleForm.injuredNum,
            writtenReportTime: this.ruleForm.timeOfWrittenSubmission, // 书面报送时间
            reportType: this.ruleForm.submissionMethod, // 报送方式
            accidentSituation: this.ruleForm.accidentSituation, // 事故情况
            dutyPeople: this.ruleForm.beOnDuty, // 值班员
            dutyLeader: this.ruleForm.leaderOnDuty, // 值班领导
            phoneId:
              this.phoneHistalId == "" || undefined ? null : this.phoneHistalId,
            remark:
              this.phoneHistalremack == "" || undefined
                ? null
                : this.phoneHistalremack,
          };
          this.$api.saveEventReceive(data).then((res) => {
            if (res.errorcode == "0") {
              this.$message({
                message: "保存事件成功!",
                type: "success",
              });
              if (this.nowTag == "fax") {
                this.getUnhandledFax();
              } else if (this.nowTag == "phone") {
                this.getUnhandledPhone();
              } else if (this.nowTag == "sms") {
                this.getUnhandledSms();
              }
              // let eventId = res.data.id;
              // this.reload()
            } else {
              this.$message({
                message: res.msg,
                type: "error",
              });
            }
          });
        }
      });
    },
    close() {
      //弹出选择取消
      this.addEventDialog = false;
      // sessionStorage.setItem('caseID', this.caseFor)
      // sessionStorage.setItem('areaId',this.areaIdArr)
      // sessionStorage.setItem('area',this.areaNameArr)
      this.$refs.eventDialog.clearData(); //刷新子组件数据
    },
    //树点击事件
    handleNodeClick(data) {
      let type = this.title;
      switch (type) {
        case "选择区域":
          this.eventTree = [];
          this.eventTree.push({ name: data.name, id: data.id });
          break;
        case "选择联系人分组":
          // console.log(data.name);
          this.eventAddressBook = [];
          this.eventAddressBook.push({ name: data.name, id: data.id });
          break;
        case "选择事件类型":
          this.eventType = [];
          this.eventType.push({ name: data.name, id: data.id });
          break;
        default:
          break;
      }
    },
    confirm() {
      //弹窗选择确定
      let type = this.title;
      switch (type) {
        case "选择区域":
          this.ruleForm.incidenArea = this.eventTree[0].name;
          break;
        case "选择联系人分组":
          this.ruleForm.submittedUnit = this.eventAddressBook[0].name;
          break;
        case "选择事件类型":
          this.ruleForm.incidenType = this.eventTypeList[0].name;
          let data = this.eventTypeList[0].id;
          this.caseid = this.eventTypeList[0].id; //给生成模板用
          // console.log(this.eventTypeList, this.caseid);
          this.amendParameter(this.eventTypeList[0].id);
          break;
        default:
          break;
      }
      this.$refs.eventDialog.clearData(); //刷新子组件数据
      this.addEventDialog = false;
    },
    //通讯录
    addressBook() {
      let data = {};
      this.$api.phoneGroupList(data).then((res) => {
        if (res.errorcode == "0") {
          // this.$refs.eventDialog.lol(res.data);

          this.reportingUnitData = res.data; // // console.log("this.treeData: ", this.treeData);
          var gettree = function (data) {
            for (var i = 0; i < data.length; i++) {
              if (data[i].children.length == 0) {
                data[i].children = undefined;
              } else {
                gettree(data[i].children);
              }
            }
          };
          gettree(this.reportingUnitData);
        }
      });
    },
    eventScene() {
      let data = {};
      this.$api.topTree(data).then((res) => {
        if (res.errorcode == "0") {
          // this.$refs.eventDialog.lol(res.data);
          this.jurisdictionData = res.data; //// console.log("this.treeData: 事件接报", this.treeData);
          var gettree = function (data) {
            for (var i = 0; i < data.length; i++) {
              if (data[i].children.length == 0) {
                data[i].children = undefined;
              } else {
                gettree(data[i].children);
              }
            }
          };
          gettree(this.jurisdictionData);
        }
      });
    },
    incidentType() {
      // this.title = "选择事件类型";
      let data = {};
      this.$api.getTree(data).then((res) => {
        if (res.errorcode == "0") {
          // // console.log(res);
          this.eventTypeData = res.data;
          var gettree = function (data) {
            for (var i = 0; i < data.length; i++) {
              if (data[i].children.length == 0) {
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
    location() {
      //定位弹窗
      this.$refs.loction.visible = false;
      this.$refs.loction.rushLocation = false;
      this.$nextTick(() => {
        this.$refs.loction.visible = true;
        this.$refs.loction.rushLocation = true;
      });
    },
    locationCallback(obj) {
      if (obj.data.action && obj.data.action == "retpoint") {
        let latlon = obj.data.object.point.split(",");
        this.longitude = latlon[0];
        // console.log(latlon[0], latlon[1]);
        this.latitude = latlon[1];
        this.ruleForm.incidentSite = obj.data.object.address;
        this.$refs.loction.visible = false;
      }
    },
    sendLocationMsg(obj) {
      if (obj.data.action && obj.data.action == "ready") {
        // console.log(this.longitude);
        // console.log(this.latitude);
        if (this.longitude && this.latitude) {
          this.longitude = "";
          this.latitude = "";
          this.ruleForm.incidentSite = "";
          //var framew = window.mapFrame.contentWindow;
          var mapFarme = document.getElementById("informId");
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
    // turTheText(){ //语音转文字
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
     * @return {String} 逐级展示的事件类型
     * @description：根据id拼接类型名字,全部获取
     * @author qinjiaqi
     * @date 2020-9-21
     */
    getIncidenType() {
      let incidenType = "";
      if (this.ruleForm.incidenType.length === 1) {
        if (
          this.eventTypeData.filter(
            (item) => item.id === this.ruleForm.incidenType[0]
          ).length > 0
        ) {
          incidenType = this.eventTypeData.filter(
            (item) => item.id === this.ruleForm.incidenType[0]
          )[0].name;
        } else {
          let type1 = "";
          let type2 = "";
          let type3 = "";
          for (let i = 0; i < this.eventTypeData.length; i++) {
            if (this.eventTypeData[i].children) {
              if (
                this.eventTypeData[i].children.filter(
                  (item) => item.id === this.ruleForm.incidenType[0]
                ).length > 0
              ) {
                type1 = this.eventTypeData[i].name;
                type2 = this.eventTypeData[i].children.filter(
                  (item) => item.id === this.ruleForm.incidenType[0]
                )[0].name;
                incidenType = type1 + "/" + type2;
                // incidenType = this.eventTypeData[i].children.filter(item => item.id === this.ruleForm.incidenType[0])[0].name
              } else {
                for (
                  let j = 0;
                  j < this.eventTypeData[i].children.length;
                  j++
                ) {
                  if (this.eventTypeData[i].children[j].children) {
                    if (
                      this.eventTypeData[i].children[j].children.filter(
                        (item) => item.id === this.ruleForm.incidenType[0]
                      ).length > 0
                    ) {
                      type1 = this.eventTypeData[i].name;
                      type2 = this.eventTypeData[i].children[j].name;
                      type3 = this.eventTypeData[i].children[j].children.filter(
                        (item) => item.id === this.ruleForm.incidenType[0]
                      )[0].name;
                      incidenType = type1 + "/" + type2 + "/" + type3;
                      // incidenType = this.eventTypeData[i].children[j].children.filter(item => item.id === this.ruleForm.incidenType[0])[0].name;
                    }
                  }
                }
              }
            }
          }
        }
      } else if (this.ruleForm.incidenType.length === 2) {
        let type1 = this.eventTypeData.filter(
          (item) => item.id === this.ruleForm.incidenType[0]
        )[0].name;
        let type2 = "";
        for (let i = 0; i < this.eventTypeData.length; i++) {
          if (this.eventTypeData[i].children) {
            if (
              this.eventTypeData[i].children.filter(
                (item) => item.id === this.ruleForm.incidenType[1]
              ).length > 0
            ) {
              type2 = this.eventTypeData[i].children.filter(
                (item) => item.id === this.ruleForm.incidenType[1]
              )[0].name;
              incidenType = type1 + "/" + type2;
              // incidenType = this.eventTypeData[i].children.filter(item => item.id === this.ruleForm.incidenType[1])[0].name
            }
          }
        }
      } else if (this.ruleForm.incidenType.length === 3) {
        let type1 = this.eventTypeData.filter(
          (item) => item.id === this.ruleForm.incidenType[0]
        )[0].name;
        let type2 = "";
        let type3 = "";
        for (let i = 0; i < this.eventTypeData.length; i++) {
          if (this.eventTypeData[i].children) {
            for (let j = 0; j < this.eventTypeData[i].children.length; j++) {
              if (this.eventTypeData[i].children[j].children) {
                if (
                  this.eventTypeData[i].children[j].children.filter(
                    (item) => item.id === this.ruleForm.incidenType[2]
                  ).length > 0
                ) {
                  type2 = this.eventTypeData[i].children.filter(
                    (item) => item.id === this.ruleForm.incidenType[1]
                  )[0].name;
                  type3 = this.eventTypeData[i].children[j].children.filter(
                    (item) => item.id === this.ruleForm.incidenType[2]
                  )[0].name;
                  incidenType = type1 + "/" + type2 + "/" + type3;
                  // incidenType = this.eventTypeData[i].children[j].children.filter(item => item.id === this.ruleForm.incidenType[2])[0].name;
                }
              }
            }
          }
        }
      }
      // console.log("getIncidenType获取的事件类型：", incidenType);
      return incidenType;
    },
    /**
     * @param {type} 没有
     * @return {String} 最后一个地区的名字
     * @description：根据id拼接辖区名字,只获取最后一个地区
     * @editor qinjiaqi
     * @date 2020-9-21
     */
    getIncidenArea() {
      let incidenArea = "";
      if (this.ruleForm.incidenArea.length === 1) {
        if (
          this.jurisdictionData.filter(
            (item) => item.id === this.ruleForm.incidenArea[0]
          ).length > 0
        ) {
          incidenArea = this.jurisdictionData.filter(
            (item) => item.id === this.ruleForm.incidenArea[0]
          )[0].name;
        } else {
          let area1 = "";
          let area2 = "";
          let area3 = "";
          for (let i = 0; i < this.jurisdictionData.length; i++) {
            if (this.jurisdictionData[i].children) {
              if (
                this.jurisdictionData[i].children.filter(
                  (item) => item.id === this.ruleForm.incidenArea[0]
                ).length > 0
              ) {
                // area1 = this.jurisdictionData[i].name;
                // area2 = this.jurisdictionData[i].children.filter(item => item.id === this.ruleForm.incidenArea[0])[0].name
                // incidenArea = area1 + area2
                incidenArea = this.jurisdictionData[i].children.filter(
                  (item) => item.id === this.ruleForm.incidenArea[0]
                )[0].name;
              } else {
                for (
                  let j = 0;
                  j < this.jurisdictionData[i].children.length;
                  j++
                ) {
                  if (this.jurisdictionData[i].children[j].children) {
                    if (
                      this.jurisdictionData[i].children[j].children.filter(
                        (item) => item.id === this.ruleForm.incidenArea[0]
                      ).length > 0
                    ) {
                      // area1 = this.jurisdictionData[i].name;
                      // area2 = this.jurisdictionData[i].children[j].name;
                      // area3 = this.jurisdictionData[i].children[j].children.filter(item => item.id === this.ruleForm.incidenArea[0])[0].name;
                      // incidenArea = area1 + area2 + area3
                      incidenArea = this.jurisdictionData[i].children[
                        j
                      ].children.filter(
                        (item) => item.id === this.ruleForm.incidenArea[0]
                      )[0].name;
                    }
                  }
                }
              }
            }
          }
        }
      } else if (this.ruleForm.incidenArea.length === 2) {
        // let area1 = this.jurisdictionData.filter(item => item.id === this.ruleForm.incidenArea[0])[0].name;
        // let area2 = ''
        for (let i = 0; i < this.jurisdictionData.length; i++) {
          if (this.jurisdictionData[i].children) {
            if (
              this.jurisdictionData[i].children.filter(
                (item) => item.id === this.ruleForm.incidenArea[1]
              ).length > 0
            ) {
              // area2 = this.jurisdictionData[i].children.filter(item => item.id === this.ruleForm.incidenArea[1])[0].name
              // incidenArea = area1 + area2
              incidenArea = this.jurisdictionData[i].children.filter(
                (item) => item.id === this.ruleForm.incidenArea[1]
              )[0].name;
            }
          }
        }
      } else if (this.ruleForm.incidenArea.length === 3) {
        // let area1 = this.jurisdictionData.filter(item => item.id === this.ruleForm.incidenArea[0])[0].name;
        // let area2 = ''
        // let area3 = ''
        for (let i = 0; i < this.jurisdictionData.length; i++) {
          if (this.jurisdictionData[i].children) {
            for (let j = 0; j < this.jurisdictionData[i].children.length; j++) {
              if (this.jurisdictionData[i].children[j].children) {
                if (
                  this.jurisdictionData[i].children[j].children.filter(
                    (item) => item.id === this.ruleForm.incidenArea[2]
                  ).length > 0
                ) {
                  // area2 = this.jurisdictionData[i].children.filter(item => item.id === this.ruleForm.incidenArea[1])[0].name;
                  // area3 = this.jurisdictionData[i].children[j].children.filter(item => item.id === this.ruleForm.incidenArea[2])[0].name;
                  // incidenArea = area1 + area2 + area3
                  incidenArea = this.jurisdictionData[i].children[
                    j
                  ].children.filter(
                    (item) => item.id === this.ruleForm.incidenArea[2]
                  )[0].name;
                }
              }
            }
          }
        }
      }
      // console.log("getIncidenArea获取的事件类型：", incidenArea);
      return incidenArea;
    },
    /**
     * @param {type} 没有
     * @return {String} 按格式生成的标题
     * @description：一键生成标题
     * @author qinjiaqi
     * @date 2020-9-21
     */
    generateTheTitle() {
      // console.log(
        "辖区名字：",
        this.ruleForm.incidenArea,
        this.jurisdictionData,
        this.jurisdictionData.filter(
          (item) => item.id === this.ruleForm.incidenArea[0]
        )
      );
      // console.log(
        "事件类型：",
        this.ruleForm.incidenType,
        this.eventTypeData,
        this.eventTypeData.filter(
          (item) => item.id === this.ruleForm.incidenType[0]
        )
      );
      let oneTime = "";
      let twoTime = "";
      // 辖区名字
      let incidenArea = this.getIncidenArea();
      // 事件类型
      let incidenType = this.getIncidenType();
      /* if (this.ruleForm.incidenType.length > 0) {
               incidenType = this.eventTypeComments[0].name
        }*/
      if (this.ruleForm.incidentTime) {
        oneTime = this.ruleForm.incidentTime.substring(5, 7);
        twoTime = this.ruleForm.incidentTime.substring(8, 10);
      }
      // 生成标题时防止用户将必填项置空导致意义不明标题出现
      if (
        (oneTime === "" && twoTime === "") ||
        incidenArea === "" ||
        incidenType === ""
      ) {
        this.$message({
          message: "请将必填信息补充完整",
          type: "warning",
        });
        return;
      }
      // this.ruleForm.eventTitle = `${oneTime}.${twoTime} ${this.ruleForm.incidenArea} ${this.ruleForm.incidenType}`;
      this.ruleForm.eventTitle = `${oneTime}.${twoTime} ${incidenArea}/${incidenType}`;
      this.$message({
        message: "生成成功",
        type: "success",
      });
      this.$refs["ruleForm"].clearValidate(["eventTitle"]);
      // console.log("事件标题：", this.ruleForm.eventTitle);
    },
    //语音截取识别成功赋值文字
    sendPhoneText(val) {
      this.phoneText = val;
    },
    //电话一键核实
    phoneVerification() {
      if (this.phonePerson == "" || this.leftEventId == "") {
        this.$message({
          message: "请选择需要核实的内容!",
          type: "warning",
        });
        return;
      }
      this.InformationDisposalShow = true;
      this.eventEnteringShow = false;
      this.$nextTick(() => {
        this.activeAllModel = "电话";
        this.changeRed = "信息处置";
        this.$refs.newPhoneModel.oneKeyCheck(this.phonePerson);
      });
    },
    //短信一键核实
    smsCheck() {
      if (this.phonePerson == "" || this.leftEventId == "") {
        this.$message({
          message: "请选择需要核实的内容!",
          type: "warning",
        });
        return;
      }
      this.InformationDisposalShow = true;
      this.eventEnteringShow = false;
      this.$nextTick(() => {
        this.activeAllModel = "电话";
        this.changeRed = "信息处置";
        this.$refs.newPhoneModel.oneKeyCheck(this.phonePerson);
      });
    },
    //传真一键核实
    faxCheck() {
      if (this.phonePerson == "" || this.leftEventId == "") {
        this.$message({
          message: "请选择需要核实的内容!",
          type: "warning",
        });
        return;
      }
      this.InformationDisposalShow = true;
      this.eventEnteringShow = false;
      this.$nextTick(() => {
        this.activeAllModel = "电话";
        this.changeRed = "信息处置";
        this.$refs.newPhoneModel.oneKeyCheck(this.faxcontactId);
      });
    },
    submitClose() {
      this.phonesText = "";
      this.isAddPhonesShow = false;
    },
    submitPhones() {
      if (this.phonesText.length == 0) {
        this.$message.warning("输入不能为空");
      } else {
        let data = this.phonesText.split(/[,，]/) || [];
        data = [...new Set(data)];
        let data1 = [];
        data.forEach((o) => {
          if (/^(\d{3,4}-)?\d{7,8}$/.test(o)) {
            data1.push(o);
          } else {
            setTimeout(() => {
              this.$message.error("传真号码格式错误:" + o);
            }, 500);
          }
        });
        if (data1.length == 0) {
          this.$message.warning("请输入正确的传真号码");
        } else {
          this.$refs.IcpFaxRight.getfaxDataN(data1);
        }
      }
    },
    //获取未办结事件
    getEventOptions() {
      let ipData = {
        dtStart: "",
        dtEnd: "",
        searchText: this.searchText,
        page: this.currentPage,
        size: 10,
      };
      this.$api.todolist(ipData).then((res) => {
        if (res.errorcode == 0) {
          this.eventOptions.push(...res.data.data);
          this.loadMore = res.data.data.length == 0 ? false : true;
        } else {
          // //this.$message.error(res.msg)
        }
      });
    },
    savefaxHistory() {
      let data = {
        id: this.faxForm.id,
        type: this.faxForm.type,
        title: this.faxForm.title,
        result: this.faxForm.result,
        eventId: this.faxForm.eventId,
        statusId: this.faxForm.status,
      };
      if (typeof data.statusId != "number") delete data.statusId;
      this.$api.disposeFax(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        this.$message({
          message: "保存成功！",
          type: "success",
        });
        this.getUnhandledFax();
      });
    },
    //获取状态列表
    getStateListData() {
      let data = {
        pcode: "information_processing_status",
      };
      this.$api.eventGetByPcodes(data).then((res) => {
        if (res.errorcode == 0) {
          // console.log("res.data: ", res.data);
          this.faxStateData = res.data;
        } else {
          this.$message({
            message: res.msg,
            type: "error",
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
      let historyArray = [];
      // // console.log(item);
      historyArray = [];
      this.InformaHistoryFlag = true;
      this.$refs.InformaHistory.historyVisiable = true;
      let obj = {
        id: item.id,
        type: "fax",
      };
      this.$api
        .getShowHistory(obj)
        .then((res) => {
          if (res.errorcode == 0) {
            // console.log(res.data);
            for (let key in res.data) {
              this.lockHistory(res.data[key], key.substr(0, key.indexOf("L")));
              historyArray.push(res.data[key]);
            }
            let arr = historyArray.flat(); //降维成一维
            // console.log(arr, historyArray);
            if (arr.length !== 0) {
              arr.forEach((ele) => {
                if (ele.list) {
                  ele.name = this.disposeVisName(ele.list);
                } else {
                  ele.name = "";
                }
                if (ele.type == "fax") {
                  ele.durationStr = this.hourTimeNum(ele.duration);
                }
                ele.millisecond = new Date(ele.time).getTime(); //用毫秒数进行冒泡排序
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
              // console.log(arr);
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
              type: "error",
            });
          }
        })
        .catch(() => {
          this.$refs.InformaHistory.listData = [];
          this.$refs.InformaHistory.historyVisiable = false;
        });
    },
    //分钟数
    minutes(time) {
      let secondNum = parseInt(time) % 3600; //得到秒
      let minutes = "00";
      //分钟
      if (secondNum >= 60) {
        minutes =
          parseInt(secondNum / 60) >= 10
            ? parseInt(secondNum / 60)
            : "0" + parseInt(secondNum / 60);
      }
      return (
        minutes +
        "分" +
        (secondNum % 60 >= 10 ? secondNum % 60 : "0" + (secondNum % 60)) +
        "秒"
      );
    },
    //小时
    hourTimeNum(time) {
      //大于等于一个小时
      let hourStr = "00";
      if (time >= 3600) {
        hourStr =
          parseInt(time / 3600) >= 10
            ? parseInt(time / 3600)
            : "0" + parseInt(time / 3600);
        return hourStr + "时" + this.minutes(time);
      } else {
        return this.minutes(time);
      }
    },
    //处理显示姓名
    disposeVisName(data) {
      let str = "";
      if (data.length != 0) {
        data.forEach((ele, index) => {
          if (index == data.length - 1) {
            str += ele.contactor;
          } else {
            str += ele.contactor + "、";
          }
        });
      }
      // // console.log(str)
      return str;
    },
    //处理查看历史回调的数据
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
          this.$message.success("旋转成功");
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
          this.$message.success("旋转成功");
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
  },
};
</script>

<style scoped>
.informationDisposalNew_warp {
  height: 98%;
}

.informationDisposalNew_warp .word {
  text-align: center;
  margin: auto;
  position: absolute;
  display: inline-block;
  width: 50px;
  color: #fff;
  transform-origin: bottom center;
  font-size: 12px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  right: -14px;
  top: 3px;
  font-size: 10px;
  color: white;
}

.informationDisposalNew_warp .triangle-topright {
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  position: absolute;
  top: 7px;
  right: -15px;
  transform: rotate(45deg);
  width: 25px;
}

.informationDisposalNew_warp .textType {
  display: inline-block;
  background: rgba(250, 250, 250, 1);
  border-radius: 3px;
  border: 1px solid rgba(197, 222, 254, 1);
  width: 75px;
  height: 21px;
  color: #0091ff !important;
  line-height: 21px;
  text-align: center;
}

>>> .el-dialog__headerbtn .el-dialog__close {
  font-size: 25px;
  font-weight: bold;
}

>>> .el-dialog--center .el-dialog__body {
  padding: 5px 0 0 0;
}

#faxCard >>> .el-card__body {
  padding: 0px;
}

.clock_img {
  float: right;
  color: #0091ff;
}

.message-img {
  background-image: url("../../../../static/img/icon/message.png");
  background-repeat: no-repeat;
  height: 18px;
  width: 18px;
  /*margin: auto 0;*/
  /*margin-left: 100px;*/
}

.event-img {
  background-image: url("../../../../static/img/icon/event.png");
  background-repeat: no-repeat;
  height: 18px;
  width: 18px;
  /*margin: auto 0;*/
  /*margin-left: 100px;*/
}

.cardModelDiv {
  border-bottom: 5px solid cornflowerblue;
}

.cardModelDiv >>> .el-card__header {
  padding: 14px 20px;
}

.messageDiv {
  flex: 1;
  height: 42px;
  border: #dddee1 solid 1px;
  font-size: 17px;
  color: #333333;
  line-height: 42px;
  background: #ffffff;
  display: flex;
  cursor: pointer;
  justify-content: center;
  align-items: center;
}

.messsagColor {
  background-color: #f0f6ff;
  color: #0091ff;
  border-left: 3px solid #0091ff;
  box-sizing: border-box;
}

.messageDiv:active {
  width: 264px;
  height: 42px;
  border: #dddee1 solid 1px;
  font-size: 17px;
  color: #333333;
  line-height: 42px;
  background: #fbfcff;
  display: flex;
  cursor: pointer;
  justify-content: center;
}

.messageCut {
  margin: 0 auto;
  font-size: 16px;
}

#itemCalss >>> .el-form-item__content {
  margin-left: 0 !important;
}

.fullScreen {
  position: absolute;
  right: 30px;
  z-index: 999;
  cursor: pointer;
  color: #ccc;
}

.tabsClass {
  background: #ffffff;
}

>>> .el-tabs__header.is-top {
  margin: 0;
  height: 52px;
}

>>> .el-tabs__nav-wrap.is-top {
  color: #a2a2a2 !important;
  background: #f9fbff;
  height: 52px;
}

>>> .el-tabs__nav-scroll {
  margin: 10px 32px;
}

>>> .el-tabs__item {
  font-size: 17px;
  color: #a2a2a2;
}

>>> .el-tabs__item.is-active {
  color: #409eff;
}

>>> .el-tabs__item:hover {
  color: #6b7280;
}

>>> .el-tabs__nav-next,
>>> .el-tabs__nav-prev {
  line-height: 58px;
  font-size: 20px;
}

>>> .el-range-editor--small.el-input__inner {
  height: initial;
}

>>> .el-range-editor--small .el-range-separator {
  line-height: 32px;
}

.icon-smile {
  background-image: url(../../../assets/icpImg/smile.png);
  background-repeat: no-repeat;
  width: 25px;
  height: 25px;
  float: right;
}

#itemCalss >>> .el-form-item__content {
  margin-left: 0 !important;
}

#serial >>> .el-input.is-disabled .el-input__inner:nth-child(1) {
  background-color: black !important;
  color: yellow !important;
}

>>> .el-input.is-disabled .el-input__inner {
  /*overflow: hidden;*/
  /*text-overflow: ellipsis;*/
  white-space: nowrap;
}

>>> .el-input-number--mini {
  width: 193px;
}

/* >>>.el-form--label-left .el-form-item__label{
     letter-spacing: 1px;
     position: relative;
   } */
#reporter >>> .el-col-10 {
  padding: 0 !important;
}

#reporter >>> .el-col-14 {
  padding-right: 0 !important;
}

#itemCalss >>> .el-form-item__content {
  margin-left: 0 !important;
}

#baowen >>> .el-form-item__content {
  margin-left: 0 !important;
}

#baowenNeiRon >>> .el-form-item__content textarea {
  background-color: #f9f9f9;
  padding-right: 80px;
  resize: none;
}

#baowen >>> .el-form-item__label:before {
  content: "";
  color: #f56c6c;
  margin-right: 4px;
}

.el-pagination__jump {
  margin-left: 0;
}

>>> .phoneCall .el-form-item__content {
  margin-left: 0 !important;
}

#titleEvent >>> .el-input__inner {
  padding-right: 84px !important;
}

.none {
  height: 40px;
  /*margin: 10px 0;*/
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.parameterTop,
.parameterBottom {
  display: flex;
  width: 100%;
  margin: 0 auto;
  padding: 0;
  justify-content: space-between;
}

.parameterTop li,
.parameterBottom li {
  list-style: none;
  width: 33.333%;
  height: 30px;
}

.parameterTop li::before {
  content: "●";
  color: #bde4ff;
  padding-right: 10px;
}

>>> .el-tooltip__popper {
  max-width: 400px !important;
  font-size: 16px !important;
  line-height: 180%;
}

/*  enlong */
>>> .el-tabs__content {
  flex: 1;
}

>>> .el-tabs__nav-wrap::after {
  height: 0px;
}

.sendFaxList-headline {
  background: #0091ff;
  margin: 3px 10px;
  height: 20px;
  width: 3px;
}

.auto_printing {
  position: absolute;
  right: 74px;
}

>>> .el-card {
  position: relative;
}

.cardCalss >>> .el-card__body {
  padding: 0;
  background-color: #ebeef5;
}

.faxFormClass >>> .el-form-item {
  margin-bottom: 14px;
}

/* .faxFormitemClass >>> .el-form-item__label {
  line-height: 20px;
} */
.MessageHandling {
}

>>> .MessageHandling > div {
  /* height: 100%;
  max-height: 100%; */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

>>> .my-phone-right-main > div {
  flex: 1;
}

>>> .my-phone-right-main > div:nth-child(1) {
  display: flex;
  flex-direction: column;
  min-height: 200px;
}

>>> .my-phone-right-main > div:nth-child(1) > div:nth-child(1) {
  flex: 1;
}

/*  修改样式用  >>>  进行穿透 .MessageHandling>div> .my-phone-right-main-user*/
>>> .msgTemplate {
  display: none;
}

>>> .my-phone-right-main {
  height: 100% !important;
  display: flex;
  flex-direction: column;
}

>>> .contentModular {
  margin: 12px 0 8px 12px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

>>> .sendMsg {
  overflow: hidden;
}

>>> .sendFaxList {
  flex: 1;
  height: auto !important;
  display: flex;
  flex-direction: column;
  min-height: 200px;
}

>>> .my-phone-right-main > div:nth-child(3) {
  height: auto !important;
  min-height: 200px;
}

>>> .my-fax-picture {
  height: auto !important;
  max-height: 83%;
}

>>> .faxListTable {
  height: auto !important;
  flex: 1;
}

>>> .el-tab-pane {
  height: 100%;
}

.flex_wrap > div:nth-child(2) {
  flex: 1;
}

>>> .dialog-style {
  display: flex;
  justify-content: center;
  align-items: center;
}

>>> .sendFaxBox {
  min-height: 310px;
  max-height: 310px;
}

>>> .el-dialog {
  margin: 0 !important;
}

>>> .el-dialog__wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.eventDetail-box-list-left {
  margin-right: 10px;
}

.eventDetail-box-list-right {
  flex: 1;
  width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 10px;
  border-bottom: 1px solid #333;
}
.my-phone-right-main >>> .el-tabs__nav-scroll {
  margin: 10px 0px;
}
.my-phone-right-main >>> .el-form .simpleMsg {
  padding: 10px;
}
</style>
