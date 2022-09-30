<!--@author：hexinting 扬州项目使用 -->
<template>
  <div class="yangzhou__overallSituation">
    <div class="content_title">
      <div class="content_title_left">
        <div class="vertical_bar"></div>
        <span class="content_title_name">事件接报</span>
      </div>
      <div class="content_title_right">
        <!--@author：qinjiaqi 事件完结-扬州项目使用 -->
        <el-button
          icon="el-icon-check"
          type="text"
          @click="endEvent"
          :disabled="isEnd ? true : false"
        >
          事件完结
        </el-button>
        <el-button
          icon="el-icon-plus"
          type="text"
          @click="addExpressNews"
          :disabled="isEnd ? true : false"
          id="end_event_btn"
          >添加续报</el-button
        >
      </div>
    </div>

    <div class="content_subject">
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
                  (currentEventData.eventIndex === item.eventIndex
                    ? 'item_wrap_active'
                    : '')
                "
                @click="clickEvent(item)"
              >
                <p class="event_name">{{ item.dealOrderName }}</p>
                <!-- <p class="event_date">{{ item.eventCreateTime }}</p> -->
                <i
                  v-if="index === 0"
                  class="el-icon-close"
                  @click.stop.prevent="handleDeleteEvent(index, item)"
                ></i>
                <div class="item_wrap_bg"></div>
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
      <div class="formContent">
        <div class="form-content-wrap">
          <el-form
            size="big"
            label-width="90px"
            :model="ruleForm"
            :rules="yangZhouRules"
            ref="ruleForm"
            @submit.native.prevent
            label-position="right"
            :hide-required-asterisk="asterisk"
          >
            <!-- <el-row :gutter="gutter" id="serial">
              <el-col :span="24">
                <el-form-item label="事件编号:">
                  <el-input type="text" readonly v-model.trim="ruleForm.serialNumber " show-word-limit></el-input>
                </el-form-item>
              </el-col>
            </el-row>-->
            <el-row>
              <el-col :span="24">
                <el-form-item label="事件标题:" prop="eventTitle" id="titleEvent">
                  <el-input
                    type="text"
                    size="big"
                    v-model="ruleForm.eventTitle"
                    show-word-limit
                    placeholder="请输入事件标题"
                  ></el-input>
                  <div
                    style="
                      padding: 5px 15px;
                      position: absolute;
                      right: 0;
                      top: -5px;
                    "
                  >
                    <!-- 扬州项目去掉 -->
                    <!-- <div>
                      <el-link type="primary" @click="generateTheTitle"
                        >一键生成</el-link
                      >
                    </div> -->
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="gutter">
              <el-col :span="12">
                <el-form-item label="事发时间:" prop="incidentTime">
                  <el-date-picker
                    size="big"
                    style="width: 100%"
                    v-model="ruleForm.incidentTime"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="接报时间:"
                  prop="reportedTime"
                  label-width="90px"
                >
                  <el-date-picker
                    size="big"
                    style="width: 100%"
                    v-model.trim="ruleForm.reportedTime"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="gutter">
              <el-col :span="12">
                <el-form-item label="事故单位:" prop="accidentUnit">
                  <el-input
                    size="big"
                    type="text"
                    v-model="ruleForm.accidentUnit"
                    show-word-limit
                    placeholder="请输入事故单位"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属区域:" prop="incidenArea">
                  <el-cascader
                    ref="incidenArea"
                    v-model.trim="ruleForm.incidenArea"
                    :options="jurisdictionData"
                    :props="{
                      value: 'id',
                      label: 'townName',
                      checkStrictly: true,
                      children: 'children'
                    }"
                    :show-all-levels="false"
                    size="big"
                    clearable
                    filterable
                    style="float: left; width: 100%"
                  ></el-cascader>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- <el-row :gutter="gutter" v-if="!isYangZhou">
              <el-col :span="12">
                <el-form-item label="书面报送时间:" prop="timeOfWrittenSubmission">
                  <el-date-picker
                    style="width: 100%"
                    v-model.trim="ruleForm.timeOfWrittenSubmission"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间"
                    default-time="09:00:00"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row> -->
            <el-row :gutter="gutter">
              <el-col :span="12">
                <el-form-item label="事发地点:" prop="incidentSite">
                  <el-input
                    size="big"
                    v-model.trim="ruleForm.incidentSite"
                    type="text"
                    placeholder="请输入事发地点"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" class="incident_wrap">
                <el-form-item
                  v-if="isSendSite"
                  label="落图地点:"
                  label-width="90px"
                  style="display: flex; justify-content: space-between"
                >
                  <!-- prop="fallFigureAddress" -->
                  <el-input
                    size="big"
                    type="text"
                    v-model.trim="ruleForm.fallFigureAddress"
                    show-word-limit
                    :title="ruleForm.fallFigureAddress"
                    ref="getFocus"
                    placeHolder="请选择落图地点"
                    style="width: calc(100% - 62px)"
                  >
                    <template slot="append">
                      <el-button size="mini" @click="location">
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
                  <div class="submit_btn">
                    <el-button size="big" @click="sendSite">发送</el-button>
                  </div>
                </el-form-item>
                <el-form-item
                  v-else
                  label="落图地点:"
                  label-width="90px"
                  style="display: flex; justify-content: space-between"
                >
                  <!-- prop="fallFigureAddress" -->
                  <el-input
                    size="big"
                    type="text"
                    v-model.trim="ruleForm.fallFigureAddress"
                    show-word-limit
                    :title="ruleForm.fallFigureAddress"
                    ref="getFocus"
                    placeHolder="请选择落图地点"
                  >
                    <template slot="append">
                      <el-button size="mini" @click="location">
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
                    @input="reportingUnitNameInput"
                    @select="reportingUnitNameInput"
                  />
                  <!-- <el-input
                    type="text"
                    readonly
                    v-model.trim="ruleForm.reportingUnit"
                    show-word-limit
                    :title="ruleForm.reportingUnit"
                  >
                    <template slot="append">
                      <el-button @click="addressBook">通讯录</el-button>
                    </template>
                  </el-input>-->

                  <!-- 注释原因：3.0需求432 20210805 -->
                  <!-- <el-cascader
                    size="big"
                    v-model.trim="ruleForm.reportingUnit"
                    :options="reportingUnitData"
                    ref="reportingUnit"
                    :props="props"
                    clearable
                    style="float: left; width: 100%"
                    :show-all-levels="false"
                    filterable
                    placeHolder="请选择报告单位"
                    @change="reportingUnitChange"
                    :before-filter="beforeFilter"
                    @blur="reportingUnitBlur"
                  ></el-cascader> -->
                </el-form-item>
              </el-col>
              <!-- 扬州需求样式：扬州去掉报送方式 -->
              <!-- <el-col v-if="!isYangZhou" :span="12">
                <el-form-item label="报送方式:" prop="submissionMethod">
                  <el-select
                    v-model="ruleForm.submissionMethod"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in isOpenLab
                        ? submitOptions
                        : submitOptions.filter((v) => !v.disabled)"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      :disabled="item.disabled"
                    ></el-option>
                  </el-select> -->
              <!-- <el-cascader
                    v-model.trim="ruleForm.incidenArea"
                    :options="options"
                    :props="props"
                    clearable
                  style="float:left;width: 100%"></el-cascader>-->
              <!-- </el-form-item>
              </el-col> -->
              <!-- 扬州需求样式 -->
              <el-col :span="12">
                <el-form-item
                  label="事件类型:"
                  prop="incidenType"
                  label-width="90px"
                >
                  <el-cascader
                    size="big"
                    v-model.trim="ruleForm.incidenType"
                    :options="eventTypeData"
                    ref="incidenType"
                    :props="props"
                    clearable
                    style="float: left; width: 100%"
                    :show-all-levels="false"
                    placeHolder="请选择事件类型"
                    filterable
                    @change="incidenTypeChange"
                  ></el-cascader>

                  <!-- <el-input
                    type="text"
                    readonly
                    v-model.trim="ruleForm.incidenType"
                    show-word-limit
                    :title="ruleForm.incidenType"
                  >
                    <template slot="append">
                      <el-button style="letter-spacing: 6px" @click="incidentType">事件</el-button>
                    </template>
                  </el-input>-->
                </el-form-item>
              </el-col>
            </el-row>
            <!-- <el-row :gutter="gutter" v-if="!isYangZhou">
              <el-col :span="12" id="reporter">
                <el-form-item label="报告人:">
                  <el-col :span="10">
                    <el-input
                      v-model.trim="ruleForm.speakerName"
                      placeholder="姓名"
                    ></el-input>
                  </el-col>
                  <el-col :span="14">
                    <el-input
                      v-model.trim="ruleForm.speakerPhone"
                      placeholder="电话"
                    ></el-input>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row> -->
            <!-- bug8540 事故情况要删除 author:hexinting date:20201120 -->
            <!-- <el-row :gutter="gutter" v-if="!isYangZhou">
              <el-col :span="24">
                <el-form-item label="事故情况:" prop="accidentSituation">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 8 }"
                    v-model.trim="ruleForm.accidentSituation"
                    show-word-limit
                    :title="ruleForm.accidentSituation"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row> -->
            <!-- <el-row v-if="!isYangZhou" :gutter="gutter">
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
                  ></el-cascader> -->

            <!-- <el-input
                    type="text"
                    readonly
                    v-model.trim="ruleForm.incidenType"
                    show-word-limit
                    :title="ruleForm.incidenType"
                  >
                    <template slot="append">
                      <el-button style="letter-spacing: 6px" @click="incidentType">事件</el-button>
                    </template>
                  </el-input>-->
            <!-- </el-form-item>
              </el-col>
            </el-row> -->

            <el-row
              :gutter="gutter"
              v-if="eventsParameters == true && parameter.length > 0"
            >
              <el-col :span="24">
                <!-- <el-form-item label="信息要素:" style="margin: 0"></el-form-item> -->
                <el-form-item id="itemCalss" label="信息要素:">
                  <el-col :span="24" style="padding-right: 0">
                    <div style="display: flex; justify-content: center">
                      <div class="information_wrap">
                        <div
                          v-for="(item, index) in parameter"
                          :key="index"
                          class="information_elements_item"
                        >
                          <div
                            v-if="item.type == '数字'"
                            class="information_elements"
                          >
                            <div
                              :title="`${item.name}${
                                item.unit ? `(${item.unit})` : item.unit
                              }`"
                              class="information_elements_name"
                            >
                              <span v-if="item.unit !== ''"
                                >{{ item.name }}({{ item.unit }}):</span
                              >
                              <span v-else>{{ item.name }}:</span>
                            </div>
                            <!-- <el-input-number
                              style="width: 150px"
                              size="mini"
                              v-model="item.value"
                              :min="0"
                              label="描述文字"
                            ></el-input-number> -->
                            <el-input
                              size="mini"
                              v-model.number="item.value"
                              :min="0"
                              label="描述文字"
                              oninput="value=value.replace(/[^\d]/g,'')"
                            ></el-input>
                          </div>
                          <div
                            v-if="item.type == '文本'"
                            style="width: 150px"
                            class="information_elements information_elements_long"
                          >
                            <div
                              :title="`${item.name}${
                                item.unit ? `(${item.unit})` : item.unit
                              }`"
                              class="information_elements_name"
                            >
                              <span v-if="item.unit !== ''"
                                >{{ item.name }}({{ item.unit }}):</span
                              >
                              <span v-if="item.unit == ''">{{ item.name }}:</span>
                            </div>
                            <el-tooltip
                              effect="dark"
                              :content="item.value"
                              placement="top"
                              :disabled="item.value?false:true">
                              <!-- <el-button>上左</el-button> -->
                              <el-input
                                type="text"
                                size="mini"
                                v-model="item.value"
                                show-word-limit
                              ></el-input>
                            </el-tooltip>
                          </div>
                          <div
                            v-if="item.type == '选择'"
                            class="information_elements"
                          >
                            <div
                              :title="`${item.name}${
                                item.unit ? `(${item.unit})` : item.unit
                              }`"
                              class="information_elements_name"
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
                            class="information_elements information_elements_long"
                          >
                            <!--                        {{item.name}}<span v-if="item.unit!==''">({{item.unit}})</span>:-->
                            <div
                              :title="`${item.name}${
                                item.unit ? `(${item.unit})` : item.unit
                              }`"
                              class="information_elements_name"
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
                            ></el-date-picker>
                          </div>
                        </div>
                      </div>
                    </div>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <div v-else-if="eventsParameters == false"></div>

            <!-- bug8540 事故情况要删除 author:hexinting date:20201120 -->
            <!-- <el-row :gutter="gutter" v-if="isYangZhou">
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
            </el-row> -->

            <el-row :gutter="gutter" style="margin: 0">
              <el-col :span="24" id="baowen" style="padding-left: 0">
                <el-form-item
                  label="事故简况:"
                  style="margin: 0 0 20px 0; text-align: right"
                  id="baowenNeiRon"
                  prop="allCase"
                >
                  <div style="display: flex; justify-content: flex-end">
                    <div>
                      <el-button type="text" size="big" @click="eventMessage"
                        >生成事件报文</el-button
                      >
                    </div>
                  </div>
                  <!-- </el-form-item> -->
                  <!-- <el-form-item id="baowenNeiRon"> -->
                  <el-input
                    size="big"
                    type="textarea"
                    v-model="ruleForm.allCase"
                    :autosize="{ minRows: 3, maxRows: 8 }"
                    @mouseover.native="testHandle"
                    style="margin-left: 12px"
                  ></el-input>
                  <!-- bug9114 恢复一键核实和一键报送 author：hexinting date:2020-12-06 -->
                  <div class="onekey_check">
                    <div style="margin-right: 20px">
                      <el-link class="onekey_btn" size="mini" @click="oneKeyCheck">一键核实</el-link>
                    </div>
                    <div>
                      <el-link  class="onekey_btn" size="mini" @click="oneKeySubmission"
                        >一键报送</el-link
                      >
                    </div>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="gutter" style="margin: 0">
              <el-col :span="24" id="baowen" style="padding-left: 0">
                <el-form-item
                  label="现场处置情况:"
                  style="margin: 0 0 20px 0; text-align: right"
                  id="disposalSituation"
                  label-width="114px"
                >
                  <el-input
                    type="textarea"
                    v-model="ruleForm.disposalSituation"
                    :autosize="{ minRows: 3, maxRows: 8 }"
                    @mouseover.native="testHandle"
                    style="margin-left: 12px"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- <el-row :gutter="gutter" v-if="!isYangZhou">
              <el-col :span="24">
                <el-form-item :label="`上报情况:`" prop="reportSituation">
                  <el-input
                    type="text"
                    v-model.trim="ruleForm.reportSituation"
                    show-word-limit
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row> -->
            <!-- <el-row :gutter="gutter">
              <el-col :span="12">
                <el-form-item label="值班员:"> -->
            <!-- <el-select v-model="ruleForm.beOnDuty" placeholder="请选择">
                    <el-option
                      v-for="item in submitOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>-->

            <!-- <el-input
                    type="text"
                    readonly
                    v-model.trim="ruleForm.beOnDuty"
                    show-word-limit
                    :title="ruleForm.beOnDuty"
                  >
                    <template slot="append">
                      <el-button @click="beOnDutyHandle">联络网</el-button>
                    </template>
                  </el-input>

                  <selectMansDialog
                    ref="beOnDutyDialog"
                    selectTitle="选择联系人"
                    :selectData="beOnDutyVisible"
                    @close="beOnDutyVisible = false"
                    @closeDialog="beOnDutyVisible = false"
                    @addMans="changeBeOnDuty"
                  ></selectMansDialog> -->
            <!-- <el-input
                    type="text"
                    v-model.trim="ruleForm.beOnDuty"
                    show-word-limit
                    :title="ruleForm.beOnDuty"
                  ></el-input>
                </el-form-item>
              </el-col> -->

            <!-- <el-col :span="12" v-if="!isYangZhou">
                <el-form-item label="值班领导:"> -->
            <!-- <el-select v-model="ruleForm.submittedUnit" placeholder="请选择">
                    <el-option
                      v-for="item in submitOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>-->

            <!-- <el-input
                    type="text"
                    readonly
                    v-model.trim="ruleForm.leaderOnDuty"
                    show-word-limit
                    :title="ruleForm.leaderOnDuty"
                  >
                    <template slot="append">
                      <el-button @click="leaderOnDutyHandle">联络网</el-button>
                    </template>
                  </el-input>

                  <selectMansDialog
                    ref="leaderOnDutyDialog"
                    selectTitle="选择联系人"
                    :selectData="leaderOnDutyVisible"
                    @close="leaderOnDutyVisible = false"
                    @closeDialog="leaderOnDutyVisible = false"
                    @addMans="changeLeaderOnDuty"
                  ></selectMansDialog> -->

            <!-- <el-input
                    type="text"
                    v-model.trim="ruleForm.leaderOnDuty"
                    show-word-limit
                    :title="ruleForm.beOnDuty"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row> -->
            <!-- 扬州需求：其他附件 author:hexinting date:2020-11-23 -->
            <el-row>
              <el-col>
                <el-form-item label-width="0">
                  <uploadFile
                    :label="'其他附件:'"
                    :attachments="ruleForm.uploadFileData"
                    @remove="handleRemoveFile"
                    @success="handleSuccess"
                  >
                  </uploadFile>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="extendInformationButton">
              <el-button type="text" @click="showExtentInformation">{{
                extendInformationVisible
                  ? '收起更多扩展信息>>>'
                  : '展开查看更多扩展信息>>>'
              }}</el-button>
            </el-row>
            <!-- 扩展信息  -->
            <template v-if="extendInformationVisible">
              <el-row :gutter="gutter">
                <el-col id="matterCause" :span="24">
                  <el-form-item label="事发原因:">
                    <el-input
                      size="big"
                      type="textarea"
                      :maxlength="1000"
                      resize="none"
                      clearable
                      :autosize="{ minRows: 5, maxRows: 10 }"
                      v-model="ruleForm.matterCause"
                      show-word-limit
                      style="margin-left: 12px"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="gutter">
                <el-col id="matterConsequence" :span="24">
                  <el-form-item label="已造成后果:" label-width="100px">
                    <el-input
                      size="big"
                      type="textarea"
                      :maxlength="1000"
                      resize="none"
                      clearable
                      :autosize="{ minRows: 5, maxRows: 10 }"
                      v-model="ruleForm.matterConsequence"
                      show-word-limit
                      style="margin-left: 12px"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="gutter">
                <el-col id="matterTendency" :span="24">
                  <el-form-item label="事件发展趋势:" label-width="114px">
                    <el-input
                      size="big"
                      type="textarea"
                      :maxlength="10000"
                      resize="none"
                      clearable
                      :autosize="{ minRows: 5, maxRows: 10 }"
                      v-model="ruleForm.matterTendency"
                      show-word-limit
                      style="margin-left: 12px"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="gutter">
                <el-col id="step" :span="24">
                  <el-form-item label="已采取措施:" label-width="100px">
                    <el-input
                      size="big"
                      type="textarea"
                      :maxlength="10000"
                      resize="none"
                      clearable
                      :autosize="{ minRows: 5, maxRows: 10 }"
                      v-model="ruleForm.step"
                      show-word-limit
                      style="margin-left: 12px"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- bug14193 隐藏转办人、转办时间、转办部门 -->
              <!-- <el-row :gutter="gutter">
                <el-col :span="12">
                  <el-form-item label="转办人:">
                    <el-input
                      size="big"
                      type="text"
                      v-model.trim="ruleForm.matterTrun"
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
                      v-model.trim="ruleForm.matterTime"
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
                      v-model.trim="ruleForm.matterBranch"
                      show-word-limit
                    >
                      <template slot="append"
                        ><el-button @click="toHold">选择</el-button></template
                      >
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row> -->
            </template>
          </el-form>
        </div>
        <div class="addButton">
          <div class="button_list">
            <el-button size="big" @click="saveReport">保存事件</el-button>
            <el-button size="big" type="primary" @click="createExpressNews"
              >生成快报</el-button
            >
          </div>
          <!-- <el-button type="primary" size="small" @click="saveEvent('ruleForm')"
            >保存事件</el-button
          > -->
          <!-- <el-button class="el-icon-plus" type="primary" size="small" @click="addEvent">新增事件</el-button> -->
          <!-- <el-button type="primary" size="small" @click="eventReception">上报事件</el-button> -->
          <!-- <el-button type="primary" size="small" @click="eventReport">上报事件</el-button> -->
          <!-- <el-button type="primary" size="small" @click="openEventDetail(1)">报送省厅</el-button> -->
          <!--      <el-button type="primary" size="small" @click="sendSite">发送事发地点</el-button>-->
          <div class="eventDetail-box" v-show="isEventDetail">
            <div class="eventDetail-box-list">
              <span class="eventDetail-box-list-left">事件标题:</span>
              <span class="eventDetail-box-list-right">{{
                ruleForm.eventTitle
              }}</span>
            </div>
            <div class="eventDetail-box-list">
              <span class="eventDetail-box-list-left">事发时间:</span>
              <span class="eventDetail-box-list-right">{{
                ruleForm.incidentTime
              }}</span>
            </div>
            <div class="eventDetail-box-list">
              <span class="eventDetail-box-list-left">报送时间:</span>
              <span class="eventDetail-box-list-right">{{
                ruleForm.reportedTime
              }}</span>
            </div>
            <div class="eventDetail-box-list">
              <div class="eventDetail-box-list-half">
                <span class="eventDetail-box-list-left">报送人:</span>
                <span
                  class="eventDetail-box-list-right"
                  style="text-align: center; margin-right: 10px"
                  >{{ ruleForm.speakerName }}</span
                >
              </div>
              <div class="eventDetail-box-list-half">
                <span class="eventDetail-box-list-left">联系电话:</span>
                <span class="eventDetail-box-list-right">{{
                  ruleForm.speakerPhone
                }}</span>
              </div>
            </div>

            <div class="eventDetail-box-list">
              <span class="eventDetail-box-list-left">事件类型:</span>
              <span class="eventDetail-box-list-right">{{
                ruleForm.incidenType
              }}</span>
            </div>
            <div class="eventDetail-box-list">
              <span class="eventDetail-box-list-left">事发地点:</span>
              <span class="eventDetail-box-list-right">{{
                ruleForm.incidentSite
              }}</span>
            </div>
            <div class="eventDetail-box-list flex-wrap">
              <div
                class="eventDetail-box-list-three"
                v-for="(item, index) in parameter"
                :key="index"
              >
                <span class="eventDetail-box-list-left" v-if="item.unit"
                  >{{ item.name }}({{ item.unit }}):</span
                >
                <span class="eventDetail-box-list-left" v-else
                  >{{ item.name }}:</span
                >
                <span
                  class="eventDetail-box-list-right"
                  style="margin-right: 10px; text-align: center"
                  >{{ item.value || 0 }}</span
                >
              </div>
            </div>
            <div class="eventDetail-box-list" style="display: flex">
              <span
                class="eventDetail-box-list-left"
                style="display: inline-block; flex: 2"
                >事件描述:</span
              >
              <span style="display: inline-block; flex: 13">
                <el-input
                  type="textarea"
                  :rows="5"
                  resize="none"
                  v-model="mettingForm.describe"
                  placeholder="请输入事件描述"
                ></el-input>
              </span>
            </div>
            <div class="eventDetail-box-list" style="display: flex">
              <span
                class="eventDetail-box-list-left"
                style="display: inline-block; flex: 2"
                >报送期数:</span
              >
              <span style="display: inline-block; flex: 13">
                <el-input-number
                  style="width: 100%"
                  size="small"
                  :min="0"
                  v-model="mettingForm.periodNumber"
                ></el-input-number>
              </span>
            </div>

            <div class="eventDetail-box-list" style="display: flex">
              <span
                class="eventDetail-box-list-left"
                style="display: inline-block; flex: 2"
                >事件等级:</span
              >
              <span style="display: inline-block; flex: 13">
                <el-select
                  v-model="mettingForm.eventId"
                  clearable
                  size="small"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in eventIds"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </span>
            </div>

            <div class="eventDetail-box-list" style="display: flex">
              <span
                class="eventDetail-box-list-left"
                style="display: inline-block; flex: 2"
                >签发人:</span
              >
              <span style="display: inline-block; flex: 13">
                <el-input
                  style="width: 100%"
                  type="text"
                  size="small"
                  v-model.trim="mettingForm.name"
                ></el-input>
              </span>
            </div>
            <div class="oy-number-footer">
              <el-button type="primary" size="mini" @click="submitted"
                >报送</el-button
              >
              <el-button type="plain" size="mini" @click="openEventDetail(2)"
                >取消</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <add-dialog
      @closeDialog="closeDialog"
      @confirm="confirm"
      @close="close"
      ref="eventDialog"
      :title="title"
      :addEventDialog="addEventDialog"
      @handleNodeClick="handleNodeClick"
    ></add-dialog>
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
    <event-report-dialog
      v-if="isShowEventReportDialog"
      @close="isShowEventReportDialog = false"
    >
    </event-report-dialog>
    <!-- 提示弹窗 -->
    <prompt-dialog-box
      v-if="promptConfig.visible"
      :prompt-dialog-config="promptConfig"
      @confirm="promptConfirm"
      @cancel="promptCanCel"
    ></prompt-dialog-box>
    <!-- 通讯录 -->
    <add-contact
      ref="addContact"
      v-if="addContactVisible"
      @changeDialog="addContactVisible = false"
    ></add-contact>
    <leave-reminder-dialog
      v-if="isShowReminderDialog"
      @noSave="noSave"
      @offSave="offSave"
      @yesSave="yesSave"
    ></leave-reminder-dialog>
    <!-- 地图弹窗 -->
    <LocationDialog ref="LocationDialogRef" />
  </div>
</template>

<script>
import addDialog from '@/view/yz_eventManagement/eventReports/dialog/eventDialog';
import Location from '@/yz_components/loction/loction';
import multipleContact from '@/view/yz_eventManagement/eventReports/dialog/selectDialog';
import bus from '@/yz_components/common/js/eventBus';
import selectMansDialog from '@/view/yz_eventManagement/eventReports/dialog/selectMansDialog';
import EventReportDialog from '@/view/yz_eventManagement/eventReports/dialog/eventReportDialog';
import uploadFile from '@/yz_components/upload/uploadFile';
import { mapGetters } from 'vuex';
import promptDialogBox from '@/yz_components/promptDialogBox/promptDialogBox';
import { sectionToChinese, getRelations, deepCompare } from '@/assets/js/yz_common.js';
import addContact from '@/view/yz_integratedCommunication/icpPhone/icpPhonePage/smsStep/addContact/AddContact';
import leaveReminderDialog from '@/view/yz_eventManagement/eventReports/dialog/leaveReminderDialog';
import LocationDialog from '@/views/modules/GarbageClassification/SiteManagement/ClassificationSite/Location/LocationDialog.vue';
import ReportUnit from '@/view/yangZhouEventReports/components/ReportUnit/ReportUnit.vue';

export default {
  name: 'overallSituation',
  components: {
    addDialog,
    Location,
    multipleContact,
    selectMansDialog,
    EventReportDialog,
    uploadFile,
    promptDialogBox,
    addContact,
    leaveReminderDialog,
    LocationDialog,
    ReportUnit,
  },
  inject: ['reload'], // 引入方法
  data() {
    return {
      isShowReminderDialog: false, //是否显示弹窗
      isUpdateForm: false, // 表单是否更新（判断表单是否更新，有更新则提示弹窗）
      isUpdateParameter: false, // 事件灾害类型对应的参数是否更新（判断参数是否更新，有更新则提示弹窗）
      IsShenzhenProject: window.g.IsShenzhenProject, // 是否是深圳项目
      gutter: 20,
      ruleForm: {
        eventDealId: '', // 续报id
        serialNumber: '',
        eventTitle: '',
        reportedTime: '',
        incidentTime: '',
        timeOfWrittenSubmission: '',
        incidenArea: [],
        reportingUnit: [],
        reportingUnitName: '',
        incidentSite: '',
        submissionMethod: '',
        // accidentSituation: "", // bug8540 事故情况要删除 author:hexinting date:20201120
        incidenType: [],
        // incidentRank: '',
        deathToll: '',
        bruiseToll: '',
        disappearToll: '',
        reportSituation: '',
        allCase: '',
        speakerName: '',
        speakerPhone: '',
        beOnDuty: sessionStorage.getItem('displayname'),
        // beOnDutyIds: [],
        leaderOnDuty: '',
        leaderOnDutyIds: [],
        uploadFileData: [], // 上传文件
        accidentUnit: '', // 事故单位
        disposalSituation: '', // 处置情况
        fallFigureAddress: '', // 落图地点
        // -- 扩展信息 start---
        matterCause: '', // 事发原因
        matterConsequence: '', // 已造成后果
        matterTendency: '', // 事件发展趋势
        step: '', // 已采取措施
        matterTrun: '', // 转办人
        matterTime: '', // 转办时间
        matterBranch: '', // 转办部门
        // --- 扩展信息 end---
        disposalName: '', // 处置姓名
        disposalUnit: '', // 处置单位
        disposalPosition: '', // 处置职务
        disposalPhone: '', // 处置电话
      },
      rules: {
        eventTitle: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur',
          },
        ],
        reportedTime: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur',
          },
        ],
        incidentTime: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur',
          },
        ],
        // timeOfWrittenSubmission: [
        //   { required: true, message: "不能为空", trigger: "blur" },
        // ],
        incidenArea: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur',
          },
        ],
        incidentSite: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur',
          },
        ],
        fallFigureAddress: [
          {
            required: true,
            message: '不能为空',
            trigger: ['blur', 'change'],
          },
        ],
        // reportSituation: [
        //   { required: true, message: "不能为空", trigger: "blur" },
        // ],
        // submissionMethod: [
        //   { required: true, message: "不能为空", trigger: "blur" },
        // ],
        // accidentSituation: [
        //   { required: true, message: "不能为空", trigger: "blur" },
        // ],
        reportingUnit: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur',
          },
        ],
        beOnDuty: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur',
          },
        ],
        leaderOnDuty: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur',
          },
        ],
        incidenType: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur',
          },
        ],
        deathToll: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur',
          },
        ],
        bruiseToll: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur',
          },
        ],
        disappearToll: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur',
          },
        ],

        allCase: [
          {
            message: '',
          },
        ],
      },
      yangZhouRules: {
        // 扬州的表单验证规则
        eventTitle: [
          // 事件标题
          {
            required: true,
            message: '不能为空',
            trigger: 'blur',
          },
        ],
        // reportedTime: [ // 接报时间
        //   {
        //     required: true,
        //     message: "不能为空",
        //     trigger: "blur",
        //   },
        // ],
        incidentTime: [
          // 事发时间
          {
            required: true,
            message: '不能为空',
            trigger: 'blur',
          },
        ],
        // timeOfWrittenSubmission: [
        //   { required: true, message: "不能为空", trigger: "blur" },
        // ],
        incidenArea: [
          // 所属区域
          {
            required: true,
            message: '不能为空',
            trigger: 'blur',
          },
        ],
        incidentSite: [
          // 事发地点
          {
            required: true,
            message: '不能为空',
            trigger: 'blur',
          },
        ],
        fallFigureAddress: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur',
          },
        ],
        // reportSituation: [
        //   { required: true, message: "不能为空", trigger: "blur" },
        // ],
        // submissionMethod: [
        //   { required: true, message: "不能为空", trigger: "blur" },
        // ],
        // accidentSituation: [
        //   { required: true, message: "不能为空", trigger: "blur" },
        // ],
        // reportingUnit: [ // 报告单位
        //   {
        //     required: true,
        //     message: "不能为空",
        //     trigger: "blur",
        //   },
        // ],
        // beOnDuty: [
        //   {
        //     required: true,
        //     message: "不能为空",
        //     trigger: "blur",
        //   },
        // ],
        // leaderOnDuty: [
        //   {
        //     required: true,
        //     message: "不能为空",
        //     trigger: "blur",
        //   },
        // ],
        incidenType: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur',
          },
        ],
        // deathToll: [
        //   {
        //     required: true,
        //     message: "不能为空",
        //     trigger: "blur",
        //   },
        // ],
        // bruiseToll: [
        //   {
        //     required: true,
        //     message: "不能为空",
        //     trigger: "blur",
        //   },
        // ],
        // disappearToll: [
        //   {
        //     required: true,
        //     message: "不能为空",
        //     trigger: "blur",
        //   },
        // ],
        allCase: [
          // 事故简况
          {
            required: true,
            message: '不能为空',
            trigger: 'blur',
          },
        ],
      },
      eventLevel: [], //事件级别下拉数据
      addEventDialog: false, //是否弹窗
      title: '', //弹窗标题
      eventTree: [], //事发区域选择树存储内容
      eventDepartment: [], // 转办部门选择树存储内容
      eventAddressBook: [], //通讯库存储
      eventType: [], //事件类型存储
      longitude: '', //经度
      latitude: '', //纬度
      cgcsLongitude: '',
      cgcsLatitude: '',
      parameter: [], //参数
      eventsParameters: false,
      test: '',
      titleType: '保存', //title类型

      reason: '', //事发原因
      result: '', //已造成后果
      growing: '', //事件发展趋势
      messure: '', //已采取措施
      dataALL: {
        eventDealId: '', // 续报id
        serialNumber: '',
        eventTitle: '',
        reportedTime: '',
        incidentTime: '',
        timeOfWrittenSubmission: '',
        incidenArea: [],
        reportingUnit: [],
        reportingUnitName: '',
        incidentSite: '',
        submissionMethod: '',
        // accidentSituation: "", // bug8540 事故情况要删除 author:hexinting date:20201120
        incidenType: [],
        // incidentRank: '',
        deathToll: '',
        bruiseToll: '',
        disappearToll: '',
        reportSituation: '',
        allCase: '',
        speakerName: '',
        speakerPhone: '',
        beOnDuty: '',
        // beOnDutyIds: [],
        leaderOnDuty: '',
        leaderOnDutyIds: [],
        uploadFileData: [], // 上传文件
        accidentUnit: '', // 事故单位
        disposalSituation: '', // 处置情况
        fallFigureAddress: '', // 落图地点
        // -- 扩展信息 start---
        matterCause: '', // 事发原因
        matterConsequence: '', // 已造成后果
        matterTendency: '', // 事件发展趋势
        step: '', // 已采取措施
        iComplaintOprid: '', // 转办人ID
        matterTrun: '', // 转办人姓名
        matterTime: '', // 转办时间
        matterBranch: '', // 转办部门
        // --- 扩展信息 end---
        disposalName: '', // 处置姓名
        disposalUnit: '', // 处置单位
        disposalPosition: '', // 处置职务
        disposalPhone: '', // 处置电话
      },

      paramsData: [], //重新赋值数据库返回数据

      typeOfReceipt: '保存', //接收新增还是修改

      caseFor: [], //存储原来的事件类型id
      areaIdArr: [], //存储原来的事件区域ID
      areaNameArr: [], //存储原来的事件区域名字

      selectTitle: '', //发送事发地点弹窗标题
      selectData: false, //发送事发地点是否弹窗
      hackResetMultiple: true, //强制刷新

      phoneHistalId: '', //登记事件传过来的ID
      phoneHistalremack: '',
      asterisk: false,
      addClass: '', //生成突发报文存储

      // mapLongitude:'',//传给地图标点的经度
      // mapLatitude:'',//传给地图标点的纬度
      // mapIncidentSite:'',//传给地图的位置

      mapId: 'overId', //地图定位不同的ID
      isEventDetail: false, //报送省厅事件框
      mettingForm: {
        eventIds: '',
        name: '',
        describe: '',
        periodNumber: 0,
      },
      sendLoading: '', //报送加载条
      eventIds: [
        {
          name: '特别重大',
          id: 1,
        },
        {
          name: '重大',
          id: 2,
        },
        {
          name: '较大',
          id: 3,
        },
        {
          name: '一般',
          id: 4,
        },
      ],

      typeValue: '', // 事件类型值
      levelValue: '', // 事件等级值
      eventId: sessionStorage.getItem('newID'),
      // 报送方式
      submitOptions: [
        {
          id: 1,
          label: '电话',
          value: '1',
        },
        {
          id: 2,
          label: '短信',
          value: '2',
        },
        {
          id: 3,
          label: '传真',
          value: '3',
        },
        {
          id: 4,
          label: '其他',
          value: '4',
        },
        {
          id: 5,
          label: '三级联动',
          value: '5',
          disabled: true,
        },
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
      textareaHeight: 0, // 事件报文高度
      textareaHeight2: 0, // 信息处置高度
      textareascrollTop: 0, // 事件报文滚动高度
      isYangZhou: window.g.IsYangZhouProject, // 是否扬州项目
      isOpenLab: window.g.IsOpenLabProject, // 是否openlab项目
      isSaveData: false, // 是否新增事件
      eventList: [], // 事件列表 轮播 扬州项目使用
      fileList: [], // 附件列表 扬州项目使用
      imageList: [], // 图片列表 扬州项目使用
      promptConfig: {
        // 提示弹窗的配置
        visible: false, // 是否显示弹窗
        promptType: 'delete', // 弹窗类型：delete:删除提示弹窗,warn：警告提示弹窗,success：成功提示弹窗,error：错误提示弹窗,info：常规类信息提示弹窗,default：不包含icon提示弹窗
        promptTitle: '敏感信息发送提醒', // 弹窗标题
        promptText: '即将通过非密网络发送信息，请勿发送泄密信息', // 弹窗文本
        subPomptText: '', // 二级提示文本
        cancelButtonText: '取消发送', // 取消操作按钮文本
        confirmButtonText: '立即发送', // 确认操作按钮文本
        isNeedIcon: true, // 是否需要显示左边的图标
      },
      currentEventData: {}, // 当前选中的事件续报或首报的信息
      // currentEventData: { // 当前选中的事件续报或首报的信息
      //   eventIndex: 0, // 下标
      //   dealOrderName: '事件首报',
      //   eventCreateTime: '', // 接报时间
      //   eventData: {}, // 表单数据
      //   eventDealId: null // 续报id
      // },
      currentEventDealIdIsSame: false, // 判断当前选中事件状态
      userPromptReason: '', // 使用弹窗的原因
      addContactVisible: false, //选择通讯录
      temporalEvent: null, // 暂存事件
      isAddEventDeal: false, // 是否点击了添加续报的按钮
      isSendSite: false, // 发不发送
      beforeFilterTxt: '', // 报告单位的搜索文本
      eventStatus: '0', //监听当前事件的eventStatus，可能取值为在办和办结
      isEnd: false, //监听eventStatus来改变按钮
      // 拓展信息
      extendInformationVisible: false, // 扩展信息
      practicePatterns: window.g.practicePatterns, // 演练模式
    };
  },
  created() {
    window.addEventListener('message', this.locationCallback);
    window.addEventListener('message', this.sendLocationMsg);

    this.eventScene();

    this.incidentType();
    // 扬州需求：在事件接报页面进行事件完结
    this.listenBtn();
  },
  beforeDestroy() {
    window.removeEventListener('message', this.locationCallback);
    window.addEventListener('message', this.sendLocationMsg);
  },
  mounted() {
    this.topUnitTree(); // 获取报告单位
    this.getDefaultEventList(); // 查询事件续报列表

    if (sessionStorage.getItem('title')) {
      this.ruleForm.eventTitle = sessionStorage.getItem('title');
    }
    if (sessionStorage.getItem('time')) {
      this.ruleForm.reportedTime = sessionStorage.getItem('time');
    }
    // sessionStorage.setItem('LevelID', LevelID);
    // this.addressBook(); // 扬州新需求中，这个方法用topUnitTree 方法替换掉
    this.$nextTick(() => {
      // setTimeout(() => {
      //   // this.getDefaultEvent();
      // }, 1000);
      this.getEventRank();

      // 获取事件报文高度
      this.textareaHeight = document.getElementById(
        'baowenNeiRon',
      ).style.height;
      document.getElementById('baowenNeiRon').onscroll = () => {
        this.textareascrollTop = document.getElementById(
          'baowenNeiRon',
        ).scrollTop;
      };
      // 获取信息处置高度
      this.textareaHeight2 = document.getElementById(
        'disposalSituation',
      ).style.height;
      document.getElementById('disposalSituation').onscroll = () => {
        this.textareascrollTop = document.getElementById(
          'disposalSituation',
        ).scrollTop;
      };
    });

    bus.$off('addEvent');
    bus.$on('addEvent', () => {
      this.addEvent();
    });
    // 监听到设置-报告单位增删改时候，要同步更新最新数据
    bus.$on('updateReportUnit', () => {
      this.topUnitTree();
    });
    this.getByCodeAndParentCode();
  },
  computed: {
    getRuleFormIncidenType() {
      return this.ruleForm.incidenType;
    },
    olos() {
      return JSON.parse(JSON.stringify(this.parameter));
    },
    eventTypeComments() {
      return JSON.parse(JSON.stringify(this.eventType));
    },
    theScene() {
      return JSON.parse(JSON.stringify(this.eventTree));
    },
    channelTitle() {
      return this.ruleForm.eventTitle;
    },
    ...mapGetters({
      activeEvent: 'getActiveEvent', // 获取事件接报当前激活的事件续报
      event_id: 'getEventId', // 事件id
    }),
  },
  watch: {
    "ruleForm.incidentTime": {
      handler(newVal) {
        console.log(newVal);
      },
      deep: true,
      immediate: true,
    },
    /**
     * @author hexinting
     * @date 2020-11-20
     * @description 监听事件id 当切换事件时候触发
     */
    event_id: {
      handler: function (newVal, oldVal) {
        // bug8566 eos拉会成功后，在事件接报模块切换事件会刷新页面，导致页面刷新，home.vue页面中的beforeDestroy关闭会议的方法 author：hexinting date:2020-11-20
        // this.getDefaultEvent();
        if (newVal) {
          this.$nextTick(() => {
            this.initForm();
            this.findEventDealList(newVal); // 删除成功查询列表
            this.listenBtn();
          });
        }
      },
      immediate: true,
    },
    /**
     * @author hexinting
     * @date 2020-11-28
     * @description 获取事件接报当前激活的事件续报,事件接报页面和事件快报页面的联动
     */
    activeEvent: {
      handler: function (newVal, oldVal) {
        // 先判断事件续报id是否相等，如果不相等说明是切换的事件
        if (oldVal && newVal.eventDealId !== oldVal.eventDealId) {
          this.changeEventDeal(newVal); // 监听到事件快报页面切换事件，同时切换
        }
      },
      immediate: true,
    },
    getRuleFormIncidenType(newValue, oldValue) {
      sessionStorage.setItem('incidenType', newValue);
    },
    //解决所属区域级联选择器点击不关闭的问题
    'ruleForm.incidenArea'(newValue, oldValue) {
      if (this.$refs.incidenArea) {
        var children = this.$refs.incidenArea.getCheckedNodes();
        if (children.length > 0 && children[0].children.length < 1) {
          //判断有没有下级
          this.$refs.incidenArea.dropDownVisible = false; //监听值发生变化就关闭它
        }
      }
    },
    //解决报告单位级联选择器点击不关闭的问题
    'ruleForm.reportingUnit'(newValue, oldValue) {
      if (this.$refs.reportingUnit) {
        var children = this.$refs.reportingUnit.getCheckedNodes();
        if (children.length > 0 && children[0].children.length < 1) {
          //判断有没有下级
          this.$refs.reportingUnit.dropDownVisible = false; //监听值发生变化就关闭它
        }
      }
    },
    //解决事件类型级联选择器点击不关闭的问题
    'ruleForm.incidenType'(newValue, oldValue) {
      if (this.$refs.incidenType) {
        var children = this.$refs.incidenType.getCheckedNodes();
        if (children.length > 0 && children[0].children.length < 1) {
          //判断有没有下级
          this.$refs.incidenType.dropDownVisible = false; //监听值发生变化就关闭它
        }
      }
    },
    theScene: {
      handler(newV) {
        if (newV !== '' && newV !== null && newV.length !== 0) {
          let areaName = newV[0].name;
          let areaId = newV[0].id;
          if (
            (sessionStorage.getItem('areaId') != '' &&
              sessionStorage.getItem('areaId') != 'null' &&
              sessionStorage.getItem('areaId')) ||
            (sessionStorage.getItem('area') != '' &&
              sessionStorage.getItem('area') != 'null' &&
              sessionStorage.getItem('area'))
          ) {
            this.areaIdArr.push({
              id: sessionStorage.getItem('areaId'),
            });
            this.areaNameArr.push({
              name: sessionStorage.getItem('area'),
            });
          }
          sessionStorage.setItem('areaId', areaId);
          sessionStorage.setItem('area', areaName);
        }
      },
      deep: true,
    },
    eventTypeComments: {
      handler(newV, oldV) {
        if (newV !== '' && newV !== null && newV.length !== 0) {
          let caseID = newV[0].id;
          let caseName = newV[0].name;
          this.$emit('refreshEvent');
          sessionStorage.setItem('caseID', caseID);
          sessionStorage.setItem('caseName', caseName);
          if (sessionStorage.getItem('caseID') != 0) {
            this.caseFor.push({
              id: sessionStorage.getItem('caseID'),
            });
          }
        }
        if (oldV.length == 0) {
          return;
        }
        if (newV.length !== 0 && oldV.length !== 0) {
          if (newV[0].id !== oldV[0].id) {
            this.$emit('delectReape');
          }
        }
      },
      deep: true,
    },
    'currentEventData.ruleForm': {
      handler: function (newVal, oldVal) {},
      immediate: true,
    },
    /**
     * @lastEditor hexinting
     * @lastDate 2020-11-30
     * @description 监听表单是否发生改变
     */
    ruleForm: {
      handler(nV, oV) {
        this.isChangeForm(nV);
      },
      deep: true,
    },
    olos: {
      handler(newV) {
        this.$store.commit('setParam', newV);
      },
      deep: true,
    },
    channelTitle: {
      handler(nV, oV) {
        if (this.titleType == '新增' || this.titleType == '登记') {
          if (
            this.ruleForm.eventTitle === '' ||
            this.ruleForm.eventTitle == null
          )
            return;
          if (this.ruleForm.incidenType.length > 0) {
            return;
          }
          // this.matchingTitle();
        }
      },
      deep: true,
    },
    /**
     * @lastEditor hexinting
     * @lastDate 2020-11-30
     * @description 监听事件类型对应的参数是否发生改变
     */
    parameter: {
      handler(nV, oV) {
        if (oV.length !== 0 && nV.length !== 0 && !this.isSaveData) {
          // isSaveData用来判断是否是保存了事件，保存了事件就不用校验parameter author:hexinting date:2020-11-11
          let isSame = deepCompare(this.currentEventData.paramsData, nV); // 是否更新表单 true:两个对象一样；false：两个对象不一样
          this.isUpdateParameter = !isSame; // 取反
          // 注释原因：就业务的逻辑
          // let isSame = deepCompare(nV, oV); // 深度遍历参数是否一样
          // if (this.isUpdateParameter || this.isUpdateForm) {
          // this.$emit("updateReportForm", true); // 更新的父组件，父组件去判断是否弹窗
          // } else {
          // this.$emit("updateReportForm", false); // 更新的父组件，父组件去判断是否弹窗
          // }
        }
        let obj = {};
        obj = this.parameter.find((item) => {
          return item.name === '死亡人数'; //筛选出匹配数据
        });
        this.$store.commit('setDieNumber', obj && obj.value ? obj.value : 0);
      },
      immedate: true,
    },
    // "ruleForm.incidenType"() {
    //   this.amendParameter();
    // },
  },
  methods: {
    reportingUnitNameInput(val) {
      console.log('报告单位：', val);
      this.ruleForm.reportingUnitName = val;
    },
    /**
     * @description 判断表单是否更改
     */
    isChangeForm(nV) {
      // 事件续报id一样，可以进行比较表单是否修改
      this.$store.commit('setSituation', nV);
      this.$emit('getAll', this.currentEventData.ruleForm, this.paramsData);
      const oldForm = { ...this.currentEventData.ruleForm };
      const newForm = { ...nV };
      console.log('老：', JSON.stringify(oldForm));
      console.log('新', JSON.stringify(newForm));
      delete oldForm.matterTrun;
      delete newForm.matterTrun;
      // 是否更新表单 true:两个对象一样；false：两个对象不一样
      const isSame = deepCompare({ ...oldForm }, { ...newForm });
      this.isUpdateForm = !isSame; // 取反
      console.log('是否更新：', this.isUpdateForm)
      // 注释原因：旧版本的比较逻辑
      // this.$emit("getAll", this.dataALL, this.paramsData);
      // let isSame = deepCompare(this.dataALL, nV); // 是否更新表单 true:两个对象一样；false：两个对象不一样
      // if (this.isUpdateParameter || this.isUpdateForm) {
      // this.$emit("updateReportForm", true); // 更新的父组件，父组件去判断是否弹窗
      // } else {
      // this.$emit("updateReportForm", false); // 更新的父组件，父组件去判断是否弹窗
      // }
    },
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
     * @description 通讯录
     */
    toHold() {
      this.title = '选择部门';
      this.addEventDialog = true;
      this.$http({
        url: this.$http.adornUrl(`/mail/mailgroup/list?platformId=`),
        method: 'get',
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$refs.eventDialog.lol(data.data);
        }
      });
    },
    /**
     * @author hexinting
     * @date 2020-12-8
     * @description 添加报告单位
     */
    addUnit(val) {
      let data = {
        data: {
          parameter: {
            pid: 0,
            name: val,
            contactorId: [],
          },
          type: 'add',
        },
      };
      this.$api.unitSetting(data).then((res) => {
        if (res.errorcode === 0) {
          this.addressBook();
          bus.$emit('updateReportUnit'); // 更新报告单位
        }
      });
    },
    /**
     * @date 2020-12-07
     * @author hexinting
     * @description 报告单位筛选之前的钩子，参数为输入的值，若返回 false 或者返回 Promise 且被 reject，则停止筛选
     */
    beforeFilter(val) {
      setTimeout(() => {
        let cascaderInnerText = document.getElementsByClassName(
          'el-cascader__suggestion-list',
        )[0].innerText; // 级联搜索的结果
        if (cascaderInnerText === '无匹配数据') {
          // 无搜索内容
          this.beforeFilterTxt = val; // 获取到最后的输入内容，添加为报告单位
        } else {
          // 有搜索内容
          this.beforeFilterTxt = '';
        }
      }, 500);
    },
    /**
     * @date 2020-12-07
     * @author hexinting
     * @description 报告单位筛选之前的钩子，参数为输入的值，若返回 false 或者返回 Promise 且被 reject，则停止筛选
     */
    reportingUnitBlur(e) {
      if (this.beforeFilterTxt !== '') {
        // 获取到最后的输入内容，添加为报告单位
        this.addUnit(this.beforeFilterTxt); // 添加为报告单位
      }
    },
    /**
     * @lastAuthor hexinting
     * @lastDate 2020-12-03
     * @description 更改表单规则 bug9156
     */
    changeFormRules(item) {
      if (item && item.eventIndex === 0) {
        this.yangZhouRules = {
          // 扬州的表单验证规则
          eventTitle: [
            // 事件标题
            {
              required: true,
              message: '不能为空',
              trigger: 'blur',
            },
          ],
          incidentTime: [
            // 事发时间
            {
              required: true,
              message: '不能为空',
              trigger: 'blur',
            },
          ],
          incidenArea: [
            // 所属区域
            {
              required: true,
              message: '不能为空',
              trigger: 'blur',
            },
          ],
          incidentSite: [
            // 事发地点
            {
              required: true,
              message: '不能为空',
              trigger: 'blur',
            },
          ],
          fallFigureAddress: [
            {
              required: true,
              message: '不能为空',
              trigger: 'blur',
            },
          ],
          incidenType: [
            {
              required: true,
              message: '不能为空',
              trigger: 'blur',
            },
          ],
          allCase: [
            // 事故简况
            {
              required: true,
              message: '不能为空',
              trigger: 'blur',
            },
          ],
        };
      } else if (!item || (item && item.eventIndex > 0)) {
        this.yangZhouRules = {
          // 扬州的表单验证规则
          eventTitle: [
            // 事件标题
            {
              required: true,
              message: '不能为空',
              trigger: 'blur',
            },
          ],
          reportedTime: [
            // 接报时间
            {
              required: true,
              message: '不能为空',
              trigger: 'blur',
            },
          ],
          incidentTime: [
            // 事发时间
            {
              required: true,
              message: '不能为空',
              trigger: 'blur',
            },
          ],
          incidenArea: [
            // 所属区域
            {
              required: true,
              message: '不能为空',
              trigger: 'blur',
            },
          ],
          incidentSite: [
            // 事发地点
            {
              required: true,
              message: '不能为空',
              trigger: 'blur',
            },
          ],
          fallFigureAddress: [
            {
              required: true,
              message: '不能为空',
              trigger: 'blur',
            },
          ],
          incidenType: [
            {
              required: true,
              message: '不能为空',
              trigger: 'blur',
            },
          ],
          allCase: [
            // 事故简况
            {
              required: true,
              message: '不能为空',
              trigger: 'blur',
            },
          ],
        };
      }
    },
    /**
     * @lastAuthor hexinting
     * @lastDate 2020-12-03
     * @description 当表单发生改变时 不保存
     */
    noSave() {
      this.isShowReminderDialog = false;
      this.isSaveData = true;
      this.isUpdateParameter = false; // 还原为初始值，未更新
      this.isUpdateForm = false; // 还原为初始值，未更新
      if (this.isAddEventDeal) {
        // 点了添加续报按钮
        if (this.eventList.length === 1) {
          this.$emit('initEventList'); // 重新获取最新事件的接报数据
        } else if (
          this.eventList.length >= 2 &&
          !this.currentEventData.eventDealId
        ) {
          // 添加续报-不保存-删掉当前添加的事件
          this.eventList.splice(this.eventList.length - 1, 1);
          this.currentEventData = this.eventList[this.eventList.length - 1];
          this.isAddEventDeal = false;
        }
      } else {
        if (this.temporalEvent) {
          this.currentEventData = this.temporalEvent; // 将暂存事件赋值
          this.getFormData(this.temporalEvent.eventData);
        }
      }
    },
    /**
     * @lastAuthor hexinting
     * @lastDate 2020-11-30
     * @description 当表单发生改变时 取消
     */
    offSave() {
      this.isShowReminderDialog = false;
      this.isSaveData = false;
      this.isUpdateParameter = true; // 还原为初始值，未更新
      this.isUpdateForm = true; // 还原为初始值，未更新
      // if (this.temporalEvent) {
      //   this.currentEventData = this.temporalEvent; // 将暂存事件赋值
      //   this.getFormData(this.temporalEvent.eventData);
      // }
    },
    /**
     * @lastAuthor hexinting
     * @lastDate 2020-11-30
     * @description 当表单发生改变时 保存
     */
    yesSave() {
      this.saveReport();
      this.isShowReminderDialog = false;
      this.isSaveData = true;
      this.isUpdateParameter = false; // 还原为初始值，未更新
      this.isUpdateForm = false; // 还原为初始值，未更新
    },
    /**
     * @author hexinting
     * @date 2020-11-30
     * @description 选择通讯录
     */
    selectHandle() {
      this.addContactVisible = true;
      this.$nextTick(() => {
        this.$refs.addContact.getDataList('getCheckCharge', []);
        // this.$refs.addContact.getDataList("getCheckCharge", this.peopleList);
      });
      this.$store.commit('setSmsOrFax', 'phone');
    },
    /**
     * @author hexinting
     * @date 2020-11-29
     * @description 根据续报id获取快报数据
     */
    getEventBulletinList(eventDealId) {
      let data = {
        eventDealId: eventDealId, // 事件续报id
      };
      this.$api.getEventBulletinList(data).then((res) => {
        if (res.errorcode === 0) {
          this.currentEventData.attachmentList = res.data.attachmentList; // 快报附件
          this.eventList[this.currentEventData.eventIndex].attachmentList =
            res.data.attachmentList; // 快报附件
        }
      });
    },

    /**
     * @author hexinting
     * @date 2020-11-29
     * @description 监听到事件快报页面切换事件，同时切换
     */
    changeEventDeal(data) {
      if (this.currentEventData.eventDealId !== data.eventDealId) {
        // 若页面当前激活的事件与事件快报不符合，则切换事件续报
        let filterData = this.eventList.filter(
          (item) => item.eventDealId === data.eventDealId,
        ); // 查找出事件快报页面激活的事件
        if (filterData.length > 0) {
          this.currentEventData = filterData[0];
          this.getFormData(this.currentEventData.eventData);
        }
      }
    },

    /**
     * @author hexinting
     * @date 2020-11-28
     * @lastDate 2020-11-30
     * @description 删除事件首报(新)
     */
    deleteFirstEvent() {
      const eventId = sessionStorage.getItem('newID'); // 事件id
      const data = {
        eventId, // 事件id
      };
      this.$api.deleteEvent(data).then((res) => {
        if (res.errorcode === 0) {
          this.$message.success('删除成功');
          // sessionStorage.setItem('newID', null);
          this.$emit('initEventList', 'updateList'); // 初始化事件列表
          // setTimeout(() => {
          //   this.getDefaultEventList();
          // }, 100);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    /**
     * @author hexinting
     * @date 2021-1-12
     * @description 获取报送单位(新)
     */
    topUnitTree() {
      // this.$http({
      //   method: 'get',
      //   url: '/mail/mailgroup/list',
      //   baseURL: window.SITE_CONFIG.baseUrl
      //   }).then((response) => {
      //     // console.log("/mail/mailgroup/list response",response)
      //     if (response.data.code === 0) {
      //       this.reportingUnitData=response.data.data
      //     }
      //   })
      this.$api.topUnitTree().then((res) => {
        if (res.errorcode === 0) {
          if (res.data) {
            this.reportingUnitData = res.data;
            // 解决获取报送单位接口返回数据慢,从而导致表单里报送单位为空的问题：
            // 页面初始化时,当topUnitTree接口还没把报送单位返回回来，findEventDealList接口就已经拿完数据了,这时候报送单位为空就会为空
            this.getReportingUnit(this.ruleForm.reportingUnit);
            const gettree = (data) => {
              for (let i = 0; i < data.length; i++) {
                if (data[i].children.length === 0) {
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
    /**
     * @author hexinting
     * @date 2020-11-27
     * @lastDate 2020-12-11
     * @description 生成快报
     */
    createBulletin(eventDealId) {
      if (!eventDealId) {
        return;
      }
      const data = {
        eventDealId,
      };
      this.$http({
        url: window.g.ApiUrl + '/eos/event/appEventDealBulletin/createBulletin',
        method: 'get',
        params: data,
      }).then((res) => {
        if (res.data.errorcode === 0) {
          this.$message.success('快报生成成功！');
          this.currentEventData.attachmentList = res.data.data.attachmentList; // 快报附件
          this.eventList[this.currentEventData.eventIndex].attachmentList =
            res.data.data.attachmentList; // 快报附件
          // this.promptConfig.visible = false;
        } else {
          this.$message.error('生成快报失败');
          // this.$message.error(res.msg)
          // this.promptConfig.visible = false;
        }
        this.$emit('createBulletin'); // 跳转到事件快报页面
      });
    },
    /**
     * @param {Object} filtList 上传成功后得到的列表
     * @author hexinting
     * @date 2020-11-27
     * @description 文件上传成功
     */
    handleSuccess(fileList) {
      this.ruleForm.uploadFileData = fileList;
    },
    /**
     * @param {Object} filtList 移除上得到的列表
     * @author hexinting
     * @date 2020-11-27
     * @lastDate 2020-11-30
     * @description 移除上传附件
     */
    handleRemoveFile(fileList) {
      this.ruleForm.uploadFileData = fileList;
    },
    /**
     * @author hexinting
     * @date 2020-11-26
     * @lastDate 2020-12-06
     * @description 添加续报
     */
    addExpressNews() {
      this.changeFormRules(); // 更改表单规则 bug9156
      this.isAddEventDeal = true;
      if (this.isUpdateForm) {
        this.isShowReminderDialog = true;
        return false;
      }
      this.addResubmittingReport();
    },
    /**
     * @param {String} type 类型 生成快报：点击"生成快报按钮"按钮前要先保存续报
     * @author hexinting
     * @date 2020-11-28
     * @lastDate 2020-11-30
     * @description 暂存事件
     */
    saveReport(type) {
      if (this.currentEventData.eventIndex === 0) {
        // 事件首报
        this.saveEvent(type);
      } else {
        // 事件续报
        this.saveEventDealReport(type);
      }
    },
    /**
     * @author hexinting
     * @date 2020-11-26
     * @description 提醒是否要删除事件首报或续报
     */
    handleDeleteEvent(index, item) {
      this.promptConfig.visible = true; // 显示弹窗
      this.promptConfig.promptTitle = '提醒';
      this.promptConfig.promptText =
        item.eventIndex === 0 ? '是否要删除该事件首报' : '是否要删除该事件续报';
      this.promptConfig.subPomptText = '删除后，数据将不可恢复';
      this.promptConfig.cancelButtonText = '取消删除'; // 取消操作按钮文本
      this.promptConfig.confirmButtonText = '确定删除'; // 确认操作按钮文本
      this.currentEventData = item; // 将要删除的事件续报或首报的信息
      this.userPromptReason = '删除事件';
    },
    /**
     * @author hexinting
     * @date 2020-11-26
     * @description 删除事件续报
     */
    deleteEvent() {
      let eventId = sessionStorage.getItem('newID'); // 事件id
      let data = {
        eventDealId: this.currentEventData.eventData.id, // 续报id
      };
      this.$api.deleteEventDeal(data).then((res) => {
        if (res.errorcode === 0) {
          this.eventList.splice(this.currentEventData.eventIndex, 1);
          if (this.eventList.length === 0) {
            this.deleteFirstEvent(); // 删除事件。如果是首报，要先删除事件续报，再删除事件
          } else {
            this.findEventDealList(eventId); // 删除成功查询列表
          }
          this.$message.success('删除成功');
          this.promptConfig.visible = false; // 隐藏弹窗
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    /**
     * @author hexinting
     * @date 2020-11-26
     * @lastEditor hexinting
     * @lastDate 2020-11-30
     * @description 弹窗确认按钮
     */
    promptConfirm() {
      if (this.userPromptReason === '生成快报') {
        this.saveReport('生成快报');
        // this.createBulletin(this.currentEventData.eventDealId); // 生成快报
      } else if (this.userPromptReason === '删除事件') {
        if (this.currentEventData.eventDealId) {
          // 续报的id存在时，才能删除
          this.deleteEvent(); // 删除事件接报
        } else {
          this.eventList = this.eventList.filter(
            (item) => item.eventIndex !== this.currentEventData.eventIndex,
          );
          // this.eventList.splice(this.currentEventData.eventIndex, 1); // 删除
          this.promptConfig.visible = false;
          this.$message.success('删除成功！');
          this.isAddEventDeal = false;
          this.currentEventData = { ...this.eventList[0] };
        }
      }
    },
    /**
     * @author hexinting
     * @date 2020-11-26
     * @lastEditor hexinting
     * @lastDate 2020-11-26
     * @description 弹窗取消按钮
     */
    promptCanCel() {
      this.promptConfig.visible = false; // 隐藏弹窗
    },
    /**
     * @author hexinting
     * @date 2020-11-26
     * @description 新建续报，初始化表单
     */
    initForm() {
      this.isEnd = false;
      document.getElementById('end_event_btn').disabled = false;
      this.isSendSite = false;
      this.ruleForm.eventTitle = ''; //清空事件标题
      this.ruleForm.reportedTime = ''; //清空首报时间
      this.ruleForm.incidentTime = ''; //清空事发时间
      this.ruleForm.incidenArea = []; //清空所属区域
      this.ruleForm.incidentSite = ''; //清空事发地点
      this.ruleForm.reportingUnit = []; //清空报告单位
      this.ruleForm.reportingUnitName = ''; //清空报告单位
      this.ruleForm.incidenType = []; //清空事件类型
      this.ruleForm.serialNumber = ''; //清空事件等级
      this.ruleForm.reportSituation = ''; //清空上报情况
      this.ruleForm.allCase = ''; //清空总体情况
      this.ruleForm.speakerName = ''; //清空报告人
      this.ruleForm.speakerPhone = ''; //清空报告人电话
      this.ruleForm.timeOfWrittenSubmission = ''; //清空书面报送时间
      // this.ruleForm.accidentSituation = ""; //清空事故情况 // bug8540 事故情况要删除 author:hexinting date:20201120
      // this.ruleForm.beOnDuty = this.isYangZhou
      //   ? sessionStorage.getItem("displayname")
      //   : ""; //初始化值班员
      this.ruleForm.beOnDuty = sessionStorage.getItem('displayname'); //初始化值班员
      // this.ruleForm.beOnDutyIds = []; //清空值班员id // 注释原因：参数暂时不用了 author:hexinting date:20201111 bug8068
      this.ruleForm.leaderOnDuty = ''; //清空值班领导
      this.ruleForm.leaderOnDutyIds = []; //清空值班领导id
      this.ruleForm.submissionMethod = ''; //清空接报方式
      this.ruleForm.deathToll = ''; //清空死亡人数
      this.ruleForm.bruiseToll = ''; //清空受伤人数
      this.ruleForm.disappearToll = ''; //清空失踪人数
      // this.ruleForm.deathNum = ""; //清空死亡人数 // 注释原因：参数暂时不用了 author:hexinting date:20201111 bug8068
      // this.ruleForm.injuredNum = ""; //清空受伤人数 // 注释原因：参数暂时不用了 author:hexinting date:20201111 bug8068
      this.ruleForm.uploadFileData = []; //清空上传的附件
      this.ruleForm.disposalSituation = ''; //清空处置情况
      this.ruleForm.accidentUnit = ''; //清空事故单位
      this.ruleForm.eventDealId = ''; // 事件续报id
      this.ruleForm.fallFigureAddress = ''; // 落图地点
      this.parameter = []; //清空事件类型子参数
      this.test = ''; //清空事件等级id
      this.latitude = ''; //清空纬度
      this.longitude = ''; //清空经度
      this.eventAddressBook = []; //清空通讯库存储
      this.eventType = []; //清空事件类型组
      this.eventTree = []; //清空事件类型树
      this.eventDepartment = []; // 清空转办部门树
      this.reason = ''; //清空事发原因
      this.result = ''; //清空已造成后果
      this.growing = ''; //清空事件发展趋势
      this.messure = ''; //清空已采取措施
      this.getTimes(); //事发时间和首报时间新增时默认为当前时间
      this.ruleForm.matterTendency = ''; // 事件发展趋势
      this.ruleForm.step = ''; // 已采取措施
      this.ruleForm.matterTrun = ''; // 转办人
      this.ruleForm.matterTime = ''; // 转办时间
      this.ruleForm.matterBranch = ''; // 转办部门
      this.ruleForm.disposalName = ''; // 处置姓名
      this.ruleForm.disposalUnit = ''; // 处置单位
      this.ruleForm.disposalPosition = ''; // 处置职务
      this.ruleForm.disposalPhone = ''; // 处置电话

      // -- 扩展事件 start ---
      this.ruleForm.matterCause = ''; // 事发原因
      this.ruleForm.matterConsequence = ''; // 已造成后果
      this.ruleForm.matterTendency = ''; // 事件发展趋势
      this.ruleForm.step = ''; // 已采取措施
      this.ruleForm.matterTime = ''; // 转办时间
      this.ruleForm.matterBranch = ''; // 转办部门
      this.ruleForm.iComplaintOprid = ''; // 转办人
    },
    /**
     * @author hexinting
     * @date 2020年11月26日
     * @lastDate 2020-12-03
     * @description 添加续报,添加续报时候，除了附件、接报时间，其他的填充上一份续报的内容
     */
    addResubmittingReport() {
      // let lastEvent = this.eventList[this.eventList.length - 1]; // 获取最新续报的数据
      let lastEvent = this.eventList[0]; // 获取最新续报的数据
      // this.initForm(); // 新建续报，初始化表单
      this.ruleForm.uploadFileData = []; // 清空上传的附件
      this.ruleForm.eventDealId = null; // 清空续报id
      this.getTimes('addEventDeal'); // 添加续报只需要更新接报时间为当前时间
      const newEventItem = {
        eventIndex: this.eventList.length,
        dealOrderName: '事件续报' + sectionToChinese(this.eventList.length),
        eventCreateTime:
          this.ruleForm.reportedTime.length === 19
            ? this.ruleForm.reportedTime.substring(0, 16)
            : this.ruleForm.reportedTime, // 接报时间
        eventData: lastEvent.eventData, // 表单数据
        eventDealId: null, // 续报id
        ruleForm: null, // 表单数据
        paramsData: null, // 信息要素数据
        attachmentList: null, // 快报列表
      };
      this.eventList.unshift(newEventItem);
      this.currentEventData = newEventItem; // 更改当前选中事件
      this.$nextTick(() => {
        this.initSwiper(); // 初始化swiper插件
      });
    },
    /**
     * @author hexinting
     * @date 2020年11月26日
     * @lastDate 2020-11-30
     * @description 生成快报
     */
    createExpressNews() {
      let type = '生成快报';
      if (
        !this.currentEventData.attachmentList ||
        this.currentEventData.attachmentList.length === 0
      ) {
        // 如果没有附件
        this.saveReport(type);
        this.createBulletin(this.currentEventData.eventDealId); // 生成快报
      } else {
        this.promptConfig.promptType = 'warn'; // 弹窗类型
        this.promptConfig.visible = true; // 显示弹窗
        this.promptConfig.promptTitle = '提醒';
        this.promptConfig.promptText = '替换当前事件快报内容？';
        this.promptConfig.cancelButtonText = '取消'; // 取消操作按钮文本
        this.promptConfig.confirmButtonText = '确定'; // 确认操作按钮文本
        this.userPromptReason = '生成快报'; // 生成快报
      }
    },
    /**
     * @author hexinting
     * @date 2020年11月26日
     * @lastDate 2020-12-03
     * @description 查询事件续报
     */
    getDefaultEventList() {
      let eventId = sessionStorage.getItem('newID'); // 事件id
      if (!eventId) {
        // 没有事件id时,获取最新的事件id
        this.$api.selectLastEvent({}).then((res) => {
          if (res.errorcode == '0') {
            let newID = res.data.event.id; // 事件id
            let caseID = res.data.event.caseClassId; // 事件类型id
            let caseName = res.data.event.caseClass; // 事件类型
            let areaId = res.data.event.areaId; // 所属区域id
            let area = res.data.event.area; // 所属区域
            let eventTitle = res.data.event.title; // 事件标题
            let allCase = res.data.event.reportDescription;
            let LevelID = res.data.event.eventLevelId; // 事件等级
            let extend1 = res.data.event.extend1; // 获取电话计时是否开启,存储在本地存储
            let extend2 = res.data.event.extend2; // 获取电话计时是否开启,存储在本地存储
            sessionStorage.setItem('newID', newID); //本地存储最新事件的ID
            sessionStorage.setItem('caseID', caseID); //本地存储最新事件的caseID
            sessionStorage.setItem('caseName', caseName); //本地存储最新事件的caseID
            sessionStorage.setItem('areaId', areaId); //本地存储最新事件的事发区域ID
            sessionStorage.setItem('area', area); //本地存储最新事件的事发区域
            sessionStorage.setItem('eventTitle', eventTitle); //为了自动生成写的存储标题
            sessionStorage.setItem('allCase', allCase); //为了自动生成写的存储总体情况
            sessionStorage.setItem('LevelID', LevelID); // 缓存事件等级
            sessionStorage.setItem('phoneExtend1', extend1); // 获取电话计时是否开启,存储在本地存储
            sessionStorage.setItem('smsExtend2', extend2); // 获取电话计时是否开启,存储在本地存储

            this.findEventDealList(newID); // 查询事件首报和事件续报
          }
        });
      } else if (eventId == 'newID') {
        this.initForm();
        this.eventList.push({
          eventIndex: 0,
          dealOrderName: '事件首报', // 续报序号
          eventCreateTime:
            this.ruleForm.reportedTime.length === 19
              ? this.ruleForm.reportedTime.substring(0, 16)
              : this.ruleForm.reportedTime, // 接报时间
          eventData: null, // 表单数据
          eventDealId: null, // 续报id
          ruleForm: null, // 表单数据
          paramsData: null, // 信息要素数据
          attachmentList: null, // 快报列表
        });
      } else {
        // 注释原因：页面加载后，监听事件Id时候也会触发findEventDealList方法，方法会调用两次，因此这里先注释，使用监听事件Id来触发findEventDealList
        // this.findEventDealList(eventId);
      }
    },
    /**
     * @param {String} eventId 事件ID
     * @param {Number} index 当前选中下标
     * @author hexinting
     * @date 2020年11月26日
     * @lastDate 2020-12-06
     * @description 查询事件首报和事件续报列表
     */
    findEventDealList(eventId, _index) {
      let event_list = []; // 事件列表，事件快报要使用到
      let new_event_list = []; // 事件列表
      // this.eventList = []; // 清空列表
      let data = {
        eventId: eventId, // 事件ID
      };
      this.$api.findEventDealList(data).then((res) => {
        if (res.errorcode === 0) {
          if (res.data.length > 0) {
            this.getFormData(res.data[0]); // 根据列表数据获取表单数据
            res.data.forEach((item, index) => {
              new_event_list.push({
                eventIndex: item.dealOrder, // 事件索引
                dealOrderName:
                  item.dealOrderName === ''
                    ? '事件续报' + sectionToChinese(res.data.length - index - 1)
                    : item.dealOrderName, // 续报序号， 事件首报，事件续报一
                eventCreateTime:
                  item.reportTime && item.reportTime.length === 19
                    ? item.reportTime.substring(0, 16)
                    : item.reportTime, // 接报时间
                eventData: item, // 事件数据
                eventDealId: item.id, // 续报id
                attachmentList: item.appEventDealBulletin
                  ? item.appEventDealBulletin.attachmentList
                  : null, // 事件快报
              });
              if (item.appEventDealBulletin) {
                // 如果有快报，才添加到event_list列表，给事件快报页面显示
                event_list.push({
                  eventIndex: index, // 事件索引
                  dealOrderName:
                    item.dealOrderName === ''
                      ? '事件续报' + sectionToChinese(index)
                      : item.dealOrderName, // 续报序号， 事件首报，事件续报一
                  eventCreateTime:
                    item.reportTime.length === 19
                      ? item.reportTime.substring(0, 16)
                      : item.reportTime, // 接报时间
                  eventDealId: item.id, // 续报id
                });
              }
              if (item.id != null || item.id != '' || item.id != undefined)
                this.isSendSite = true;
            });
            this.eventList = new_event_list;
            // 新增或者修改事件成功之后，要请求获取列表的接口。_index存在，则说明是修改或者新增后获取列表接口；否则是初始页面时获取列表接口
            if (_index) {
              const eventDealItem = this.eventList.filter((el) => el.eventIndex === _index)[0];
              this.currentEventData = { ...eventDealItem }; // _index存在，说明是修改或者新增后获取列表接口
              const eventDealData = {
                eventName: eventDealItem.dealOrderName, // 事件名字 比如：事件首报，事件续报
                eventProcessId: eventDealItem.eventData.eventProcessId, // 事件id
                eventDealId: eventDealItem.eventDealId, // 事件续报id
              };
              this.isSendSite = !!eventDealItem.eventDealId;
              this.$store.commit('setActiveEvent', eventDealData); // 将当前激活的事件id和事件续报id 传给事件快报页面
              // this.getEventBulletinList(this.eventList[_index].eventDealId); // 获取事件快报
            } else {
              const eventDealItem = { ...this.eventList[0] }; // 初始时默认选中第一个数据
              this.currentEventData = eventDealItem;
              const eventDealData = {
                eventName: eventDealItem.dealOrderName, // 事件名字 比如：事件首报，事件续报
                eventProcessId: eventDealItem.eventData.eventProcessId, // 事件id
                eventDealId: eventDealItem.eventDealId, // 事件续报id
              };
              this.isSendSite = !!eventDealItem.eventDealId;
              this.$store.commit('setActiveEvent', eventDealData); // 将当前激活的事件id和事件续报id 传给事件快报页面
              // this.getEventBulletinList(this.eventList[0].eventDealId); // 获取事件快报
            }

            this.getFormData(this.currentEventData.eventData); // 获取表单数据
            this.$store.commit('setEventList', event_list);
            this.$nextTick(() => {
              this.initSwiper(); // 初始化swiper插件
            });
          } else {
            this.initForm(); // 初始化数据
            this.eventList = []; // 清空列表
            this.$store.commit('setEventList', []);
          }
        }
      });
    },
    /**
     * 获取转办人的姓名
     */
    getUserInfo(userId) {
      this.$http
        .get(`${window.SITE_CONFIG.baseUrl}/sys/user/info/${userId}`)
        .then((response) => {
          if (response.data.code === 0 && response.data.user) {
            this.ruleForm.matterTrun = response.data.user.name;
          }
        });
    },
    /**
     * @author hexinting
     * @date 2020-11-26
     * @lastDate 2020-11-30
     * @description 根据列表数据获取表单数据
     */
    getFormData(data) {
      const { extend1, extend2 } = data; // extend1获取电话计时是否开启存储在本地存储,extend2获取短信计时是否开启存储在本地存储
      const caseID = data.caseClassId; // 事件类型id
      const caseName = data.caseClass; // 事件类型
      const eventTitle = data.title; // 事件标题
      sessionStorage.setItem('phoneExtend1', extend1); // 获取电话计时是否开启存储在本地存储
      sessionStorage.setItem('smsExtend2', extend2); // 获取短信计时是否开启存储在本地存储
      sessionStorage.setItem('caseID', caseID); // 本地存储最新事件的caseID
      sessionStorage.setItem('caseName', caseName); // 本地存储最新事件的caseID
      sessionStorage.setItem('eventDealTitle', eventTitle); // qinjiaqi  续报标题给指示批示传真

      this.ruleForm.eventTitle = data.title; // 事件标题
      this.ruleForm.eventDealId = data.id; // 事件续报id
      /*
          @editor: qinjiaqi
          @description: 每得到一次当前展示页的数据都把该数据标题及时缓存进本地
      */
      // sessionStorage.setItem("eventTitle", eventTitle); // 把新的标题存进缓存

      this.ruleForm.reportedTime = data.reportTime; // 报送时间
      this.ruleForm.incidentTime = data.occurTime; //事发时间
      this.ruleForm.incidenArea = data.areaId; //所属区域
      this.ruleForm.incidentSite = data.address; //事发地点
      this.ruleForm.reportingUnit = data.reportDepartId; //报送单位id
      this.ruleForm.reportingUnitName = data.department || data.reportDepart || ''; //报送单位名字
      console.log('报告单位：', this.ruleForm.reportingUnitName)
      this.ruleForm.incidenType = data.caseClassId; //事件类型
      this.ruleForm.reportSituation = data.reportSuperior; //上报情况
      this.ruleForm.allCase = data.reportDescription; //事件报文
      this.ruleForm.speakerName = data.reportMan; //报告人名字
      this.ruleForm.speakerPhone = data.reportNum; //报告人电话
      this.ruleForm.timeOfWrittenSubmission = data.writtenReportTime; //书面报送时间
      // this.ruleForm.accidentSituation = data.accidentSituation; //事故情况 // bug8540 事故情况要删除 author:hexinting date:20201120
      this.ruleForm.beOnDuty = data.dutyPeople; //值班员
      this.ruleForm.leaderOnDuty = data.dutyLeader; //值班领导
      this.ruleForm.submissionMethod = data.reportType; //报送方式
      this.ruleForm.serialNumber = data.eventCode; //事件编号
      // this.ruleForm.incidentRank = data.eventLevel;
      this.ruleForm.accidentUnit = data.accidentUnit; // 事故单位
      this.ruleForm.disposalSituation = data.disposalSituation; // 处置情况
      this.ruleForm.uploadFileData = data.attachments; // 上传附件
      this.ruleForm.fallFigureAddress = data.fallFigureAddress; // 落图地点
      //重新赋值不绑定
      this.dataALL.eventTitle = data.title; //事件标题
      this.dataALL.reportedTime = data.reportTime; //报送时间
      this.dataALL.incidentTime = data.occurTime; //事发时间
      this.dataALL.incidenArea = data.areaId; //所属区域
      this.dataALL.incidentSite = data.address; //事发地点
      this.dataALL.reportingUnit = data.reportDepartId; //报送单位id
      this.dataALL.reportingUnitName = data.department || data.reportDepart || ''; //报送单位名字
      this.dataALL.incidenType = data.caseClassId; //事件类型
      this.dataALL.serialNumber = data.eventCode; //事件编号
      this.dataALL.reportSituation = data.reportSuperior; //上报情况
      this.dataALL.allCase = data.reportDescription; //事件报文
      this.dataALL.speakerName = data.reportMan; //报告人名字
      this.dataALL.speakerPhone = data.reportNum; //报告人电话
      this.dataALL.timeOfWrittenSubmission = data.writtenReportTime; //书面报送时间
      // this.dataALL.accidentSituation = data.accidentSituation; //事件情况 // bug8540 事故情况要删除 author:hexinting date:20201120
      this.dataALL.beOnDuty = data.dutyPeople; //值班员
      this.dataALL.leaderOnDuty = data.dutyLeader; //值班领导
      this.dataALL.submissionMethod = data.reportType; //报送方式
      // this.dataALL.incidentRank = data.eventLevel;
      this.dataALL.accidentUnit = data.accidentUnit; // 事故单位
      this.dataALL.disposalSituation = data.disposalSituation; // 处置情况
      this.dataALL.uploadFileData = data.attachments; // 上传附
      this.dataALL.fallFigureAddress = data.fallFigureAddress; // 落图地点

      // 获取报告单位。因为element-UI组件中，级联组件需要每一层id组成一个数组。数据库保存报告单位时，只保存了最后一个子级的id。因此需要沿着该子级去寻找祖先id，拼接成数组。
      if (data.reportDepartId !== 0) {
        if (!data.reportDepartId) {
          this.ruleForm.reportingUnitName = data.department || data.reportDepart || '';
        } else {
          this.getReportingUnit(data.reportDepartId); //获取报告单位
        }
      }

      // (2.7才有这种数据，3.0应该不存在这类数据)
      // 有些旧数据 data.reportDepartId为0 data.reportDepart为报送单位名字。因此要根据报送单位名字来查找报送单位id
      // if (data.reportDepartId === 0 && data.reportDepart !== '') {
      //   this.getReportingUnit(data.reportDepart); //获取报告单位
      // }

      // 获取所属区域的id。因为element-UI组件中，级联组件需要每一层id组成一个数组。数据库保存所属区域时，只保存了最后一个子级的id。
      this.getIncidenAreaId(data.areaId); //获取所属区域的id

      // 获取灾害类型。因为element-UI组件中，级联组件需要每一层id组成一个数组。数据库保存灾害类型时，只保存了最后一个子级的id。
      this.getCaseClassId(data.caseClassId, data.caseClass); // 获取灾害类型

      // 报送方式为三级联动的数据时，事件类型不存在，先自行添加数据，在隐藏
      this.eventTypeData = this.eventTypeData.filter((v) => !v.threeLevels);
      if (data.reportType == 5) {
        this.eventTypeData.push({
          id: data.caseClassId,
          name: data.caseClass,
          threeLevels: true,
        });
      }
      bus.$emit('removeThreeLevels', data.reportType);
      // -- 扩展事件 start ---
      this.ruleForm.matterCause = data.occurReason; // 事发原因
      this.ruleForm.matterConsequence = data.consequences; // 已造成后果
      this.ruleForm.matterTendency = data.developmentTrend; // 事件发展趋势
      this.ruleForm.step = data.takeSteps; // 已采取措施
      // 获取转办人姓名
      if (data.complaintOprid) {
        this.getUserInfo(data.complaintOprid);
      }
      this.ruleForm.matterTime = data.complaint; // 转办时间
      this.ruleForm.matterBranch = data.complaintDepartment; // 转办部门
      this.ruleForm.iComplaintOprid = data.complaintOprid; // 转办人
      // --- 扩展事件 end ---
      this.reason = data.occurReason; // 事发原因
      this.result = data.consequences; // 已造成后果
      this.growing = data.developmentTrend; // 事件发展趋势
      this.messure = data.takeSteps; // 已采取措施
      this.longitude = data.longitude; //经度
      this.latitude = data.latitude; //纬度
      this.test = data.eventLevelId;
      this.eventTree.push({
        name: data.area,
        id: data.areaId,
      }); // 所属区域
      this.eventType.push({
        name: data.caseClass,
        id: data.caseClassId,
      }); // 事件类型
      this.eventDepartment.push({
        name: data.complaintDepartment,
      }); // 转办部门
      if (
        data.levelId !== 0 &&
        data.levelId !== '' &&
        data.planId !== '' &&
        data.planId !== 0
      ) {
        //已经启动过预案
        this.$store.commit('setTurnOnEmergencyResponse', true);
      } else {
        //没启动过预案
        this.$store.commit('setTurnOnEmergencyResponse', false);
      }

      // 事件类型对应的参数
      if (data.eventParams.length == 0) {
        this.eventsParameters = false;
      } else {
        this.eventsParameters = true;
        setTimeout(() => {
          this.parameter = data.eventParams;
        }, 600);
        this.paramsData = data.eventParams; //重新赋值数据库数据做对比
      }

      this.currentEventData.ruleForm = { ...this.ruleForm }; // 存储表单数据，用来判断当前表单是否修改过
      this.currentEventData.paramsData = this.paramsData; // 存储信息要素，用来判断当前表单是否修改过
    },
    /**
     * @param {String} type 类型 生成快报：点击"生成快报按钮"按钮前要先保存续报
     * @author hexinting
     * @date 2020年11月26日
     * @lastDate 2020-12-03
     * @description 事件续报保存
     */
    saveEventDealReport(type) {
      if (this.promptConfig.visible) {
        this.promptConfig.visible = false;
      }
      // 经纬度必填的情况下，以下的判断要加上
      // if (!this.longitude || !this.latitude) {
      //   this.$message({
      //     message: "请给事发地点选择经纬度",
      //     type: "error",
      //   });
      //   return false;
      // }
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let eventId = sessionStorage.getItem('newID');
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
          let data = {
            eventJson: {
              iid: this.ruleForm.eventDealId, // 事件续报ID  修改时必传
              i_event_process_id: eventId, // 事件ID
              title: this.ruleForm.eventTitle, // 事件标题
              occurTime: this.ruleForm.incidentTime, // 事发时间
              reportTime: this.ruleForm.reportedTime, // 接报时间
              areaId:
                this.ruleForm.incidenArea.length > 0
                  ? this.ruleForm.incidenArea[
                      this.ruleForm.incidenArea.length - 1
                    ]
                  : null, // 管辖范围：关联app_area表的i_id
              address: this.ruleForm.incidentSite, // 事发地点
              longitude: this.longitude, // 事发地点-经度
              latitude: this.latitude, // 事发地点-纬度
              vcDepartment: this.ruleForm.reportingUnitName, // 报送单位
              reportDepartId:
                this.ruleForm.reportingUnit.length > 0
                  ? this.ruleForm.reportingUnit[
                      this.ruleForm.reportingUnit.length - 1
                    ]
                  : null, // 报送单位id
              reportDepart: this.ruleForm.reportingUnitName, // 报送单位
              eventType: eventTypeId, // 事件类型
              reportDescription: this.ruleForm.allCase, // 事件简况
              dealOrder: this.currentEventData.eventIndex, // 排序：首报、续报一、续报二....
              caseClassId: eventTypeId, // 事件要素:对应app_event_seting_params的i_case_id
              accidentUnit: this.ruleForm.accidentUnit, // 事故单位
              disposalSituation: this.ruleForm.disposalSituation, // 处置情况
              fallFigureAddress: this.ruleForm.fallFigureAddress, // 落图地点
              occurReason: this.ruleForm.matterCause, // 事发原因
              consequences: this.ruleForm.matterConsequence, // 已造成后果
              developmentTrend: this.ruleForm.matterTendency, // 事件发展趋势
              takeSteps: this.ruleForm.step, // 已采取措施
              iComplaintOprid: this.ruleForm.iComplaintOprid,
              dtComplaint: this.ruleForm.matterTime, // 转办时间
              vcComplaintDepartment: this.ruleForm.matterBranch, // 转办部门
              disposalName: this.ruleForm.disposalName, // 处置姓名
              disposalUnit: this.ruleForm.disposalUnit, // 处置单位
              disposalPosition: this.ruleForm.disposalPosition, // 处置职务
              disposalPhone: this.ruleForm.disposalPhone, // 处置电话
              cgcsLongitude: this.cgcsLongitude,
              cgcsLatitude: this.cgcsLatitude,
            },
            iEvnetSetingParams: this.parameter, // 事件要素
            attachments: this.ruleForm.uploadFileData, // 上传文件

          };
          this.$api.saveEventDealReport(data).then((res) => {
            sessionStorage.setItem('refreshTruti', true);
            if (res.errorcode === 0) {
              this.isSendSite = !!this.ruleForm.eventDealId;
              // this.getFormData(res.data); // 保存数据

              this.currentEventData.eventDealId = res.data.id; // 事件快报
              this.currentEventData.eventCreateTime =
                res.data.reportTime.length === 19
                  ? res.data.reportTime.substring(0, 16)
                  : res.data.reportTime; // 接报时间
              this.currentEventData.eventData = res.data; // 接报时间

              if (type === '生成快报') {
                // 生成快报时，获取续报的数据要延迟一点，因为后端数据入库需要时间
                setTimeout(() => {
                  this.findEventDealList(
                    eventId,
                    this.currentEventData.eventIndex,
                  ); // 查询事件续报列表
                }, 2000);
                this.createBulletin(this.currentEventData.eventDealId); // 生成快报
              } else {
                this.findEventDealList(
                  eventId,
                  this.currentEventData.eventIndex,
                ); // 查询事件续报列表
                this.$message.success('事件已保存成功！');
              }
              // 需求432
              this.$refs.reportUnitRef.setReportingUnitListFromStorage(this.ruleForm.reportingUnitName);
              if (res.data.needRejudge) {
                this.$confirm(`预案研判等级已由原来${res.data.oldLevel}变更${res.data.newLevel}`, '是否刷新?', {
                  confirmButtonText: '是',
                  cancelButtonText: '否',
                  type: 'warning',
                }).then(() => {
                  this.$emit('jumpto');
                }).catch(() => {
                });
              }
            } else {
              this.$message.error('事件保存失败！');
            }
          });
        }
      });
    },
    /**
     * @author hexinting
     * @date 2020-11-28
     * @description 控制只能输入数字
     */
    handleInput(val) {
      val = val.replace(/[^\d]/g, '');
    },
    /**
     * @author hexinting
     * @date 2020-11-23
     * @lastData 2020-12-06
     * @description 激活当前点击事件
     */
    clickEvent(item) {
      this.temporalEvent = item; // 暂存事件
      this.changeFormRules(item); // 更改表单规则 bug9156
      // 点击下一个事件的时候，要判断事件是否有保存，没有保存不能跳转
      this.isChangeForm(this.ruleForm);
      console.log(this.isUpdateForm, item.eventIndex, this.currentEventData.eventIndex, this.isUpdateForm &&
        item.eventIndex !== this.currentEventData.eventIndex)
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
          return false;
        }
        this.currentEventData = item; // 当前激活的事件数据
        // if (!item.attachmentList) { // 若无事件快报，则先获取事件快报列表
        //   this.getEventBulletinList(item.eventDealId); // 获取快报列表
        // }
        this.getFormData(item.eventData); // 将数据库数据复制给表单
        const data = {
          eventName: item.dealOrderName, // 事件名字 比如：事件首报，事件续报
          eventProcessId: item.eventData.eventProcessId, // 事件id
          eventDealId: item.eventDealId, // 事件续报id
        };
        bus.$emit('activeEvent', data); // 将当前激活的事件id和事件续报id 传给事件快报页面
        this.$store.commit('setActiveEvent', data); // 将当前激活的事件id和事件续报id 传给事件快报页面
      }
    },
    /**
     * @author hexinting
     * @date 2020-11-13
     * @description 初始化swiper 插件
     */
    initSwiper() {
      var swiper = new this.$Swiper('.swiper-container', {
        freeMode: false,
        effect: 'coverflow', // slide的切换效果，默认为"slide"（位移切换），可设置为'slide'（普通切换、默认）,"fade"（淡入）"cube"（方块）"coverflow"（3d流）"flip"（3d翻转）
        slidesPerView: 'auto', // 设置slider容器能够同时显示的slides数量(carousel模式)
        centeredSlides: false, // 设定为true时，active slide会居中，而不是默认状态下的居左
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
     * @param {array} val 报送单位id
     * @lastEditor hexinting
     * @lastDate 2020-9-18
     * @description 报送单位发生改变触发
     */
    reportingUnitChange(val) {
      this.getReportingUnit(val[val.length - 1], 'dataALL');
    },
    // 测试下拉框
    testSelect() {},
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
    //省厅报送接口
    submitted() {
      // ruleForm.eventTitle  标题
      // ruleForm.incidentTime  事发时间  ruleForm.reportedTime 报送时间 ruleForm.speakerName 报送人
      // ruleForm.speakerPhone  联系电话  ruleForm.incidenType  事件类型 ruleForm.incidentSite 事发地址
      //mettingForm.eventId 事件等级  mettingForm.name 签发人  parameter 事件参数   longitude: "", //经度 latitude: "", //纬度
      let mdFive = {
        signKey: '1970!@#$e102ebb2a8df821d6ae596a901180c036',
      };
      let mdFiveRes;
      this.$api.provinceMD5(mdFive).then((res) => {
        if (res.errorcode == 0) {
          mdFiveRes = res.data;
        } else {
          //this.$message.error(res.msg)
        }
      });
      let deathNum, missNum, injuredNum;
      this.parameter.forEach((item, i) => {
        if (item.name == '死亡人数') {
          deathNum = item.value;
        }
        if (item.name == '失踪人数') {
          missNum = item.value;
        }
        if (item.name == '受伤人数') {
          injuredNum = item.value;
        }
      });
      if (
        this.ruleForm.eventTitle == '' ||
        this.mettingForm.eventId == '' ||
        this.mettingForm.describe == '' ||
        this.longitude == '' ||
        this.latitude == '' ||
        this.ruleForm.incidentSite == '' ||
        this.ruleForm.speakerName == '' ||
        this.mettingForm.name == '' ||
        this.ruleForm.speakerPhone == '' ||
        this.ruleForm.incidenType == [] ||
        this.mettingForm.periodNumber === '' ||
        this.ruleForm.reportedTime == '' ||
        this.ruleForm.incidentTime == ''
      ) {
        this.$message({
          message: '所有参数均不能为空!',
          type: 'warning',
        });
        return;
      }
      this.sendLoading = this.$loading({
        lock: true,
        text: '报送中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      let data = {
        orgCode: 'gdszyj-7a863389-84a5-4354-a1e1-46f2ce5b47af',
        title: this.ruleForm.eventTitle,
        disasterLevel: this.mettingForm.eventId,
        description: [this.mettingForm.describe],
        lon: this.longitude,
        lat: this.latitude,
        address: this.ruleForm.incidentSite,
        deathNum: deathNum ? deathNum : 0,
        missNum: missNum ? missNum : 0,
        injuredNum: injuredNum ? injuredNum : 0,
        sendUserName: this.ruleForm.speakerName,
        signUserName: this.mettingForm.name,
        phone: this.ruleForm.speakerPhone,
        disasterType: this.ruleForm.incidenType,
        periodNumber: this.mettingForm.periodNumber,
        happenTime: this.ruleForm.reportedTime,
        sendTime: this.ruleForm.reportedTime,
        receiveTime: this.ruleForm.incidentTime,
        disasterId: sessionStorage.getItem('newID')
          ? sessionStorage.getItem('newID')
          : '',
        eventId: sessionStorage.getItem('newID')
          ? sessionStorage.getItem('newID')
          : '',
      };
      let json = {
        paramJson: JSON.stringify(data),
      };
      this.$api.reportEvent(json).then((res) => {
        if (res.errorcode == 0) {
          this.isEventDetail = false;
          this.$message({
            message: '报送成功!',
            type: 'success',
          });
          this.sendLoading.close();
        } else {
          this.sendLoading.close();
          this.$message.error('报送失败!');
          //this.$message.error(res.msg)
        }
      });
    },
    // 根据事件要素替换事件报文(因后台报文只有一个模板，所以“当前事态进展情况及数据如下：”之后的模板由前端动态生成)
    replaceMessage(data) {
      let filter_text = '当前事态进展情况及数据如下：';
      let _index = data.indexOf(filter_text);
      let text = '';
      let content = '';
      if (_index === -1) {
        text = data;
      } else {
        text = data.substring(0, _index);
      }
      for (let item of this.parameter) {
        if (item.name) {
          if (
            item.value === '' ||
            item.value === null ||
            item.value === undefined
          ) {
            content += item.name + '：' + '【' + item.name + '】' + '；';
          } else {
            if (
              item.unit === undefined ||
              item.unit === null ||
              item.unit === ''
            ) {
              content += item.name + '：' + item.value + '；';
            } else {
              content +=
                item.name + '：' + item.value + '(' + item.unit + ')' + '；';
            }
          }
        }
      }
      content = text + filter_text + '\n' + content;
      return content;
    },
    // 生成事件报文模板
    eventMessage() {
      console.log(this.ruleForm);
      const data = {
        caseId: sessionStorage.getItem('caseID'),
        typeId: '699',
        page: 1,
        size: 10,
      };
      this.$api.templateList(data).then((res) => {
        if (res.errorcode === 0) {
          res.data.data.forEach((item, i) => {
            let addClass = item.content;
            if (!this.isYangZhou) {
              addClass = this.replaceMessage(addClass);
            }
            // 替换事件基本信息，没填的填'无' bug13668
            addClass = addClass.replace('【事件标题】', this.ruleForm.eventTitle || '无');

            if (
              this.ruleForm.reportedTime !== undefined &&
              this.ruleForm.reportedTime !== null &&
              this.ruleForm.reportedTime !== ''
            ) {
              addClass = addClass.replace('【接报时间】', this.isYangZhou ? this.getTime(this.ruleForm.reportedTime) : this.ruleForm.reportedTime);
            } else {
              addClass = addClass.replace('【接报时间】', '无');
            }

            if (
              this.ruleForm.incidentTime !== undefined &&
              this.ruleForm.incidentTime !== null &&
              this.ruleForm.incidentTime !== ''
            ) {
              addClass = addClass.replace(
                '【事发时间】',
                this.isYangZhou
                  ? this.getTime(this.ruleForm.incidentTime)
                  : this.ruleForm.reportedTime,
              );
            } else {
              addClass = addClass.replace('【事发时间】', '无');
            }

            if (this.ruleForm.incidenArea.length > 0) {
              addClass = addClass.replace(
                '【事发区域】',
                this.getIncidenArea(),
              );
            } else {
              addClass = addClass.replace('【事发区域】', '无');
            }

            addClass = addClass.replace('【事发地点】', this.ruleForm.incidentSite || '无');

            addClass = addClass.replace('【报送单位】', this.ruleForm.reportingUnitName || '无');

            addClass = addClass.replace('【事件类型】', this.ruleForm.incidenType.length > 0 ? this.eventTypeComments[0].name : '无');

            // bug8540 事故情况要删除 author:hexinting date:20201120
            // if (
            //   this.ruleForm.accidentSituation !== undefined &&
            //   this.ruleForm.accidentSituation !== null &&
            //   this.ruleForm.accidentSituation !== ""
            // ) {
            //   addClass = addClass.replace(
            //     "【事故简况】",
            //     this.ruleForm.accidentSituation
            //   );
            // }

            addClass = addClass.replace('【报告人-姓名】', this.ruleForm.speakerName || '无');

            addClass = addClass.replace('【事发原因】', this.reason || this.ruleForm.matterCause || '无');
            addClass = addClass.replace('【已造成后果】', this.result || this.ruleForm.matterConsequence || '无');
            addClass = addClass.replace('【事件发展趋势】', this.growing || this.ruleForm.matterTendency || '无');
            addClass = addClass.replace('【已采取措施】', this.messure || this.ruleForm.step || '无');

            for (let param of this.parameter) {
              //需要根据信息要素名称匹配替换的字符串，名称为空则跳过
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
                //没填时显示暂无
                addClass = addClass.replace(`【${param.name}】`, '无');
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
                // console.log(item.content)
                // console.log('addClass', this.ruleForm)
              }
              */

            // OK

            // addClass = addClass.replace('【参数项】 【值】【单位】；', '')
            // console.log(addClass)

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
    /**
     * @description: 获取时间格式
     * @param {*}
     * @return {*}
     */
    getTime(day) {
      let dateConversion = new Date(day); // 转换为格林尼治时间
      let year = dateConversion.getFullYear(); // 年
      let month = dateConversion.getMonth() + 1; // 月 默认从零开始
      let date = dateConversion.getDate(); // 日
      let hours = dateConversion.getHours(); // 时
      let minutes = dateConversion.getMinutes(); // 分
      let fullDate =
        year +
        '年' +
        month +
        '月' +
        date +
        '日' +
        hours +
        '点' +
        minutes +
        '分';
      return fullDate;
    },
    //根据事件标题匹配事件类型和预案
    matchingTitle() {
      let eventTypeId = 0;
      if (this.eventType.length > 0) {
        eventTypeId = this.eventType[0].id;
      }
      let data = {
        title: this.ruleForm.eventTitle,
        caseClassId: eventTypeId,
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
          //this.$message.error(res.msg)
        }
      });
    },
    //发送事发地点
    sendSite() {
      if (
        this.ruleForm.fallFigureAddress == '' ||
        this.latitude == '' ||
        this.longitude == ''
      ) {
        this.$message({
          message: '请先选择事发地点',
          type: 'warning',
        });
        return;
      }
      if (this.ruleForm.eventTitle == '' || this.ruleForm.eventTitle == null) {
        this.$message({
          message: '请先填写事件标题',
          type: 'warning',
        });
        return;
      }
      this.selectTitle = '选择联系人';
      this.selectData = true;
      // this.selectHandle()
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
    /**
     * @param {Array} 要发给的联系人们
     * @returns 无
     * @lastEditor hexinting
     * @lastDate 2020-11-29
     * @description 发送事发地点弹窗确认
     */
    //发送事发地点弹窗确认
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
      let eventId = sessionStorage.getItem('newID'); // 事件id
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
            message: '发送成功！',
            type: 'success',
          });
          // this.getStaetData(); 以前旧的获取全部state的函数，现在已经用不上了，调用会报错
        } else {
          //this.$message.error(res.msg)
        }
      });
    },
    /**
     * @author qinjiaqi
     * @param {type} 没有
     * @return {type} undefined
     * @description：监听当前展示事件是否完结
     */
    listenBtn() {
      let eventID = sessionStorage.getItem('newID');
      //监听默认展示的事件是否完结
      if (eventID == '' || eventID == null || eventID == 'newID') {
        let data = {};
        this.$api.selectLastEvent(data).then((res) => {
          if (res.errorcode == '0') {
            this.eventStatus = res.data.event.statusCode;
            if (this.eventStatus === '1') {
              this.isEnd = true;
              return;
            }
          }
        });
      } else {
        //监听当前选择的事件是否完结
        let arr = {
          id: eventID,
        };
        this.$api.findById(arr).then((res) => {
          if (res.errorcode == '0') {
            this.eventStatus = res.data.event.statusCode;
            if (this.eventStatus === '1') {
              this.isEnd = true;
              return;
            }
          }
        });
      }
    },
    /**
     * @author qinjiaqi
     * @param {type} 没有
     * @return {type} undefined
     * @description：处理事件完结
     */
    endEvent() {
      let eventID = sessionStorage.getItem('newID');
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
          if (!eventID) {
            //防止用户新建事件时点击完结
            this.$message({
              type: 'warning',
              message: '当前事件未被创建，不能完结',
            });
            return;
          }
          // 注释原因：“eventEnd”接口完结事件会新增一条空的续报.导致查询出现空续报数据，改为“yzEnd”。author：hexinting date:20210113
          const data = {
            eventId: eventID,
          };
          this.$api.yzEnd(data).then((res) => {
            if (res.errorcode === 0) {
              this.$message({
                message: '事件完结成功!',
                type: 'success',
              });
              this.listenBtn(); //完结后更新按钮样式
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
    closeMyDialogMultiple() {
      this.hackResetMultiple = false;
      this.$nextTick(() => {
        // this.$nextTick执行一轮循环后刷新dom。
        this.hackResetMultiple = true;
      });
      this.selectData = false;
    },
    //根据修改的事件类型获取事件参数
    amendParameter() {
      let caseIdParameter = sessionStorage.getItem('caseID');
      let data = {
        caseId: caseIdParameter,
      };
      this.$api.defaultParameters(data).then((res) => {
        if (res.errorcode == '0') {
          if (res.data.length > 0) {
            this.eventsParameters = true;
            this.parameter = res.data;
          }
        } else {
          //this.$message.error(res.msg)
        }
      });
    },
    visibleChange() {
      this.getEventRank();
    },
    /**
     * @param {number/string} id 报送单位id or 报送单位名字(数据库中，有的旧数据是报送单位名字，新数据是报送单位id)
     * @param {string} type 用于区分dataALL是否需要赋值
     * @returns data data: { id: 报送单位id, name: 报送单位名字 }
     * @author hexinting
     * @lastDate 2020-9-18
     * @description 获取报告单位
     */
    getReportingUnit(value, type) {
      const reportingUnitIdArr = getRelations({
        arr: this.reportingUnitData,
        relationKey: 'id',
        findKey: 'id',
        findValue: value,
      });
      const reportingUnitNameArr = getRelations({
        arr: this.reportingUnitData,
        relationKey: 'name',
        findKey: 'id',
        findValue: value,
      });
      this.ruleForm.reportingUnitName =
        reportingUnitNameArr[reportingUnitNameArr.length - 1];
      this.ruleForm.reportingUnit = reportingUnitIdArr;
      this.dataALL.reportingUnitName = type
        ? ''
        : reportingUnitNameArr[reportingUnitNameArr.length - 1];
      this.dataALL.reportingUnit = type ? '' : reportingUnitIdArr;
    },
    /**
     * @param 无
     * @returns 无
     * @lastEditor qinjiaqi
     * @lastDate 2020-09-30
     * @description 获取默认事件或最新事件
     */
    getDefaultEvent() {
      let eventId = sessionStorage.getItem('newID'); // 事件id
      // 不存在事件id
      if (eventId == '' || eventId == null || eventId == undefined) {
        // 获取最新的事件id
        this.$api.selectLastEvent({}).then((res) => {
          if (res.errorcode == '0') {
            let newID = res.data.event.id; // 事件id
            let caseID = res.data.event.caseClassId; // 事件类型id
            let caseName = res.data.event.caseClass; // 事件类型
            let areaId = res.data.event.areaId; // 所属区域id
            let area = res.data.event.area; // 所属区域
            let eventTitle = res.data.event.title; // 事件标题
            let allCase = res.data.event.reportDescription;
            let LevelID = res.data.event.eventLevelId; // 事件等级
            let extend1 = res.data.event.extend1; // 获取电话计时是否开启,存储在本地存储
            let extend2 = res.data.event.extend2; // 获取电话计时是否开启,存储在本地存储
            sessionStorage.setItem('newID', newID); //本地存储最新事件的ID
            sessionStorage.setItem('caseID', caseID); //本地存储最新事件的caseID
            sessionStorage.setItem('caseName', caseName); //本地存储最新事件的caseID
            sessionStorage.setItem('areaId', areaId); //本地存储最新事件的事发区域ID
            sessionStorage.setItem('area', area); //本地存储最新事件的事发区域
            sessionStorage.setItem('eventTitle', eventTitle); //为了自动生成写的存储标题
            sessionStorage.setItem('allCase', allCase); //为了自动生成写的存储总体情况
            sessionStorage.setItem('LevelID', LevelID); // 缓存事件等级
            sessionStorage.setItem('phoneExtend1', extend1); // 获取电话计时是否开启,存储在本地存储
            sessionStorage.setItem('smsExtend2', extend2); // 获取电话计时是否开启,存储在本地存储
            this.$store.commit('setCaseId', caseID);
            // 事件接报表单赋值
            this.ruleForm.eventTitle = res.data.event.title; // 事件标题
            this.ruleForm.reportedTime = res.data.event.reportTime; // 报送时间
            this.ruleForm.incidentTime = res.data.event.occurTime; //事发时间
            this.ruleForm.incidenArea = res.data.event.areaId; //所属区域
            this.ruleForm.incidentSite = res.data.event.address; //事发地点
            this.ruleForm.reportingUnit = res.data.event.reportDepartId; //报送单位id
            this.ruleForm.reportingUnitName = res.data.event.reportDepart; //报送单位名字
            this.ruleForm.incidenType = [res.data.event.caseClassId]; //事件类型
            this.ruleForm.speakerName = res.data.event.reportMan; //报告人名字
            this.ruleForm.speakerPhone = res.data.event.reportNum; //报告人电话
            this.ruleForm.timeOfWrittenSubmission =
              res.data.event.writtenReportTime; //书面报送时间
            // this.ruleForm.accidentSituation = res.data.event.accidentSituation; //事故情况 // bug8540 事故情况要删除 author:hexinting date:20201120
            this.ruleForm.submissionMethod = res.data.event.reportType; //报送方式
            this.ruleForm.beOnDuty = res.data.event.dutyPeople; //值班员
            this.ruleForm.leaderOnDuty = res.data.event.dutyLeader; //值班领导
            this.ruleForm.serialNumber = res.data.event.eventCode; //事件编号
            this.ruleForm.reportSituation = res.data.event.reportSuperior; //上报情况
            this.ruleForm.allCase = res.data.event.reportDescription; //事件报文
            // this.ruleForm.incidentRank = res.data.event.eventLevel; // 事件等级
            this.ruleForm.accidentUnit = res.data.event.accidentUnit; // 事故单位
            this.ruleForm.disposalSituation = res.data.event.disposalSituation; // 处置情况
            this.ruleForm.uploadFileData = res.data.event.attachments; // 上传附件
            // 更多扩展信息
            this.ruleForm.matterTendency = res.data.event.growing; // 事件发展趋势
            this.ruleForm.step = res.data.event.messure; // 已采取措施
            this.ruleForm.matterTime = res.data.event.complaint; // 转办时间
            this.ruleForm.matterBranch = res.data.event.complaintDepartment; // 转办部门
            this.ruleForm.iComplaintOprid = res.data.event.complaintOprid;
            this.ruleForm.disposalName = res.data.event.disposalName; // 处置姓名
            this.ruleForm.disposalUnit = res.data.event.disposalUnit; // 处置单位
            this.ruleForm.disposalPosition = res.data.event.disposalPosition; // 处置职务
            this.ruleForm.disposalPhone = res.data.event.disposalPhone; // 处置电话

            // 为了判断表单是否改变 如果改变过还未保存的情况下，切换页面时弹窗提醒是否保存
            this.dataALL.eventTitle = res.data.event.title; // 事件标题
            this.dataALL.reportedTime = res.data.event.reportTime; // 报送时间
            this.dataALL.incidentTime = res.data.event.occurTime; //事发时间
            this.dataALL.incidenArea = res.data.event.areaId; //所属区域
            this.dataALL.incidentSite = res.data.event.address; //事发地点
            this.dataALL.reportingUnit = res.data.event.reportDepartId; //报送单位id
            this.dataALL.reportingUnitName = res.data.event.reportDepart; //报送单位名字
            this.dataALL.incidenType = [res.data.event.caseClassId]; //事件类型
            this.dataALL.serialNumber = res.data.event.eventCode; //事件编号
            this.dataALL.reportSituation = res.data.event.reportSuperior; //上报情况
            this.dataALL.allCase = res.data.event.reportDescription; //事件报文
            this.dataALL.speakerName = res.data.event.reportMan; //报告人名字
            this.dataALL.speakerPhone = res.data.event.reportNum; //报告人电话
            this.dataALL.timeOfWrittenSubmission =
              res.data.event.writtenReportTime; //书面报送时间
            // this.dataALL.accidentSituation = res.data.event.accidentSituation; //事故情况 // bug8540 事故情况要删除 author:hexinting date:20201120
            this.dataALL.beOnDuty = res.data.event.dutyPeople; //值班员
            this.dataALL.leaderOnDuty = res.data.event.dutyLeader; //值班领导
            this.dataALL.submissionMethod = res.data.event.reportType; //报送方式
            // this.dataALL.incidentRank = res.data.event.eventLevel;
            this.dataALL.accidentUnit = res.data.event.accidentUnit; // 事故单位
            this.dataALL.disposalSituation = res.data.event.disposalSituation; // 处置情况
            this.dataALL.uploadFileData = res.data.event.attachments; // 上传附件
            // 更多扩展信息
            this.dataALL.matterTendency = res.data.event.growing; // 事件发展趋势
            this.dataALL.step = res.data.event.messure; // 已采取措施
            this.dataALL.matterTime = res.data.event.complaint; // 转办时间
            this.dataALL.matterBranch = res.data.event.complaintDepartment; // 转办部门
            this.dataALL.disposalName = res.data.event.disposalName; // 处置姓名
            this.dataALL.disposalUnit = res.data.event.disposalUnit; // 处置单位
            this.dataALL.disposalPosition = res.data.event.disposalPosition; // 处置职务
            this.dataALL.disposalPhone = res.data.event.disposalPhone; // 处置电话

            // 获取报告单位。因为element-UI组件中，级联组件需要每一层id组成一个数组。数据库保存报告单位时，只保存了最后一个子级的id。因此需要沿着该子级去寻找祖先id，拼接成数组。
            if (res.data.event.reportDepartId !== 0) {
              this.getReportingUnit(res.data.event.reportDepartId);
            }
            // 有些旧数据 res.data.event.reportDepartId为0 res.data.event.reportDepart为报送单位名字。因此要根据报送单位名字来查找报送单位id
            if (
              res.data.event.reportDepartId === 0 &&
              res.data.event.reportDepart !== ''
            ) {
              this.getReportingUnit(res.data.event.reportDepart);
            }
            // 获取所属区域的id。因为element-UI组件中，级联组件需要每一层id组成一个数组。数据库保存所属区域时，只保存了最后一个子级的id。
            this.getIncidenAreaId(res.data.event.areaId); // 获取所属区域的id
            // 获取灾害类型。因为element-UI组件中，级联组件需要每一层id组成一个数组。数据库保存灾害类型时，只保存了最后一个子级的id。
            this.getCaseClassId(
              res.data.event.caseClassId,
              res.data.event.caseClass,
            ); // 获取灾害类型

            // 报送方式为三级联动的数据时，事件类型不存在，先自行添加数据，在隐藏
            this.eventTypeData = this.eventTypeData.filter(
              (v) => !v.threeLevels,
            );
            if (res.data.event.reportType == 5) {
              this.eventTypeData.push({
                id: res.data.event.caseClassId,
                name: res.data.event.caseClass,
                threeLevels: true,
              });
            }
            bus.$emit('removeThreeLevels', res.data.event.reportType);
            this.reason = res.data.event.reason; // 事发原因
            this.result = res.data.event.result; // 已造成后果
            this.growing = res.data.event.growing; // 事件发展趋势
            this.messure = res.data.event.messure; // 已采取措施
            this.longitude = res.data.event.longitude; // 经度
            this.latitude = res.data.event.latitude; // 纬度
            this.test = res.data.event.eventLevelId; // 事件等级
            this.eventTree.push({
              name: res.data.event.area,
              id: res.data.event.areaId,
            }); // 所属区域
            this.eventType.push({
              name: res.data.event.caseClass,
              id: res.data.event.caseClassId,
            }); // 事件类型

            if (
              res.data.event.levelId !== 0 &&
              res.data.event.levelId !== '' &&
              res.data.event.planId !== '' &&
              res.data.event.planId !== 0
            ) {
              //已经启动过预案
              this.$store.commit('setTurnOnEmergencyResponse', true);
            } else {
              //没启动过预案
              this.$store.commit('setTurnOnEmergencyResponse', false);
            }

            // 事件类型对应的参数
            if (res.data.eventParams.length == 0) {
              this.eventsParameters = false;
            } else {
              this.eventsParameters = true;
              this.parameter = res.data.eventParams;
              this.paramsData = res.data.eventParams; //重新赋值数据库数据做对比
            }
            this.$emit('getAll', this.dataALL, this.paramsData);
            this.$emit('updateNewID', newID);
            // this.$store.commit('setSituation', this.ruleForm);
            // this.$store.commit('setParam',this.parameter);
          }
        });
      } else if (eventId == 'newID') {
        let phoneHistaldata = this.$store.getters.getPhoneHistoryId;
        let remack = phoneHistaldata.remark;
        let phoneRemack = phoneHistaldata.id;
        let name = phoneHistaldata.name;
        let iphone = phoneHistaldata.iphone;
        this.titleType = '登记';
        this.ruleForm.eventTitle = '';
        this.ruleForm.reportedTime = '';
        this.ruleForm.incidentTime = '';
        this.ruleForm.incidenArea = [];
        this.ruleForm.incidentSite = '';
        this.ruleForm.reportingUnit = [];
        this.ruleForm.reportingUnitName = '';
        this.ruleForm.incidenType = [];
        // this.ruleForm.incidentRank = '',
        this.ruleForm.deathToll = '';
        this.ruleForm.bruiseToll = '';
        this.ruleForm.disappearToll = '';
        this.ruleForm.reportSituation = '';
        this.ruleForm.allCase = remack == null || undefined ? '' : remack;
        this.phoneHistalId = phoneRemack;
        this.phoneHistalremack = remack == null || undefined ? '' : remack;
        this.ruleForm.serialNumber = '';
        this.ruleForm.speakerName = name == null || undefined ? '' : name;
        this.ruleForm.speakerPhone = iphone == null || undefined ? '' : iphone;
        this.parameter = [];
        this.test = '';
        this.latitude = '';
        this.longitude = '';
        this.eventAddressBook = [];
        this.eventType = [];
        this.eventTree = [];
        this.getTimes();
        this.ruleForm.accidentUnit = ''; // 事故单位
        this.ruleForm.disposalSituation = ''; // 处置情况
        this.ruleForm.uploadFileData = []; // 上传附件
        // 更多拓展信息
        this.ruleForm.matterTendency = '';
        this.ruleForm.step = ''; // 已采取措施
        this.ruleForm.matterTrun = ''; // 转办人
        this.ruleForm.matterTime = ''; // 转办时间
        this.ruleForm.matterBranch = ''; // 转办部门
        this.ruleForm.disposalName = ''; // 处置姓名
        this.ruleForm.disposalUnit = ''; // 处置单位
        this.ruleForm.disposalPosition = ''; // 处置职务
        this.ruleForm.disposalPhone = ''; // 处置电话
        this.eventList.push({
          eventIndex: 0,
          dealOrderName: '事件首报', // 续报序号
          eventCreateTime:
            this.ruleForm.reportedTime.length === 19
              ? this.ruleForm.reportedTime.substring(0, 16)
              : this.ruleForm.reportedTime, // 接报时间
          eventData: {}, // 数据库返回数据
          eventDealId: null, // 续报id
          ruleForm: null, // 表单数据
          paramsData: null, // 信息要素数据
          attachmentList: null, // 快报列表
        });
      } else {
        // 根据事件id获取事件详情
        let data = {
          id: eventId,
        };
        this.$api.findById(data).then((res) => {
          if (res.errorcode == '0') {
            let extend1 = res.data.event.extend1; // 获取电话计时是否开启存储在本地存储
            let extend2 = res.data.event.extend2; // 获取电话计时是否开启存储在本地存储
            sessionStorage.setItem('phoneExtend1', extend1); // 获取电话计时是否开启存储在本地存储
            sessionStorage.setItem('smsExtend2', extend2); // 获取电话计时是否开启存储在本地存储
            sessionStorage.setItem('caseID', res.data.event.caseClassId); //本地存储最新事件的caseID
            this.$store.commit('setCaseId', res.data.event.caseClassId);
            this.ruleForm.eventTitle = res.data.event.title; // 事件标题

            /*
                @editor: qinjiaqi
                @description: 每得到一次当前展示页的数据都把该数据标题及时缓存进本地
            */
            let eventTitle = res.data.event.title; // 事件标题
            sessionStorage.setItem('eventTitle', eventTitle); // 把新的标题存进缓存

            this.ruleForm.reportedTime = res.data.event.reportTime; // 报送时间
            this.ruleForm.incidentTime = res.data.event.occurTime; //事发时间
            this.ruleForm.incidenArea = res.data.event.areaId; //所属区域
            this.ruleForm.incidentSite = res.data.event.address; //事发地点
            this.ruleForm.reportingUnit = res.data.event.reportDepartId; //报送单位id
            this.ruleForm.reportingUnitName = res.data.event.reportDepart; //报送单位名字
            this.ruleForm.incidenType = res.data.event.caseClassId; //事件类型
            this.ruleForm.reportSituation = res.data.event.reportSuperior; //上报情况
            this.ruleForm.allCase = res.data.event.reportDescription; //事件报文
            this.ruleForm.speakerName = res.data.event.reportMan; //报告人名字
            this.ruleForm.speakerPhone = res.data.event.reportNum; //报告人电话
            this.ruleForm.timeOfWrittenSubmission =
              res.data.event.writtenReportTime; //书面报送时间
            // this.ruleForm.accidentSituation = res.data.event.accidentSituation; //事故情况 // bug8540 事故情况要删除 author:hexinting date:20201120
            this.ruleForm.beOnDuty = res.data.event.dutyPeople; //值班员
            this.ruleForm.leaderOnDuty = res.data.event.dutyLeader; //值班领导
            this.ruleForm.submissionMethod = res.data.event.reportType; //报送方式
            this.ruleForm.serialNumber = res.data.event.eventCode; //事件编号
            // this.ruleForm.incidentRank = res.data.event.eventLevel;
            this.ruleForm.accidentUnit = res.data.event.accidentUnit; // 事故单位
            this.ruleForm.disposalSituation = res.data.event.disposalSituation; // 处置情况
            this.ruleForm.uploadFileData = res.data.event.attachments; // 上传附件
            // // 更多拓展信息
            // this.ruleForm.matterTendency = res.data.event.growing; // 事件发展趋势
            // this.ruleForm.step = res.data.event.messure; // 已采取措施
            // this.ruleForm.matterTime = res.data.event.complaint; // 转办时间
            // this.ruleForm.matterBranch = res.data.event.complaintDepartment; // 转办部门
            this.ruleForm.iComplaintOprid = res.data.event.complaintOprid;
            this.ruleForm.disposalName = res.data.event.disposalName; // 处置姓名
            this.ruleForm.disposalUnit = res.data.event.disposalUnit; // 处置单位
            this.ruleForm.disposalPosition = res.data.event.disposalPosition; // 处置职务
            this.ruleForm.disposalPhone = res.data.event.disposalPhone; // 处置电话
            //重新赋值不绑定
            this.dataALL.eventTitle = res.data.event.title; //事件标题
            this.dataALL.reportedTime = res.data.event.reportTime; //报送时间
            this.dataALL.incidentTime = res.data.event.occurTime; //事发时间
            this.dataALL.incidenArea = res.data.event.areaId; //所属区域
            this.dataALL.incidentSite = res.data.event.address; //事发地点
            this.dataALL.reportingUnit = res.data.event.reportDepartId; //报送单位id
            this.dataALL.reportingUnitName = res.data.event.reportDepart; //报送单位名字
            this.dataALL.incidenType = res.data.event.caseClassId; //事件类型
            this.dataALL.serialNumber = res.data.event.eventCode; //事件编号
            this.dataALL.reportSituation = res.data.event.reportSuperior; //上报情况
            this.dataALL.allCase = res.data.event.reportDescription; //事件报文
            this.dataALL.speakerName = res.data.event.reportMan; //报告人名字
            this.dataALL.speakerPhone = res.data.event.reportNum; //报告人电话
            this.dataALL.timeOfWrittenSubmission =
              res.data.event.writtenReportTime; //书面报送时间
            // this.dataALL.accidentSituation = res.data.event.accidentSituation; //事件情况 // bug8540 事故情况要删除 author:hexinting date:20201120
            this.dataALL.beOnDuty = res.data.event.dutyPeople; //值班员
            this.dataALL.leaderOnDuty = res.data.event.dutyLeader; //值班领导
            this.dataALL.submissionMethod = res.data.event.reportType; //报送方式
            // this.dataALL.incidentRank = res.data.event.eventLevel;
            this.dataALL.accidentUnit = res.data.event.accidentUnit; // 事故单位
            this.dataALL.disposalSituation = res.data.event.disposalSituation; // 处置情况
            this.dataALL.uploadFileData = res.data.event.attachments; // 上传附件

            // this.dataALL.matterTendency = res.data.event.growing; // 事件发展趋势
            // this.dataALL.step = res.data.event.messure; // 已采取措施
            // this.dataALL.matterTime = res.data.event.complaint; // 转办时间
            // this.dataALL.matterBranch = res.data.event.complaintDepartment; // 转办部门
            this.dataALL.disposalName = res.data.event.disposalName; // 处置姓名
            this.dataALL.disposalUnit = res.data.event.disposalUnit; // 处置单位
            this.dataALL.disposalPosition = res.data.event.disposalPosition; // 处置职务
            this.dataALL.disposalPhone = res.data.event.disposalPhone; // 处置电话

            // 获取报告单位。因为element-UI组件中，级联组件需要每一层id组成一个数组。数据库保存报告单位时，只保存了最后一个子级的id。因此需要沿着该子级去寻找祖先id，拼接成数组。
            if (res.data.event.reportDepartId !== 0) {
              this.getReportingUnit(res.data.event.reportDepartId); //获取报告单位
            }

            // 有些旧数据 res.data.event.reportDepartId为0 res.data.event.reportDepart为报送单位名字。因此要根据报送单位名字来查找报送单位id
            if (
              res.data.event.reportDepartId === 0 &&
              res.data.event.reportDepart !== ''
            ) {
              this.getReportingUnit(res.data.event.reportDepart); //获取报告单位
            }
            // 获取所属区域的id。因为element-UI组件中，级联组件需要每一层id组成一个数组。数据库保存所属区域时，只保存了最后一个子级的id。
            this.getIncidenAreaId(res.data.event.areaId); //获取所属区域的id

            // 获取灾害类型。因为element-UI组件中，级联组件需要每一层id组成一个数组。数据库保存灾害类型时，只保存了最后一个子级的id。
            this.getCaseClassId(
              res.data.event.caseClassId,
              res.data.event.caseClass,
            ); // 获取灾害类型

            // 报送方式为三级联动的数据时，事件类型不存在，先自行添加数据，在隐藏
            this.eventTypeData = this.eventTypeData.filter(
              (v) => !v.threeLevels,
            );
            if (res.data.event.reportType == 5) {
              this.eventTypeData.push({
                id: res.data.event.caseClassId,
                name: res.data.event.caseClass,
                threeLevels: true,
              });
            }
            bus.$emit('removeThreeLevels', res.data.event.reportType);

            this.reason = res.data.event.reason; // 事发原因
            this.result = res.data.event.result; // 已造成后果
            this.growing = res.data.event.growing; // 事件发展趋势
            this.messure = res.data.event.messure; // 已采取措施
            this.longitude = res.data.event.longitude; //经度
            this.latitude = res.data.event.latitude; //纬度
            this.test = res.data.event.eventLevelId;
            this.eventTree.push({
              name: res.data.event.area,
              id: res.data.event.areaId,
            }); // 所属区域
            this.eventType.push({
              name: res.data.event.caseClass,
              id: res.data.event.caseClassId,
            }); // 事件类型

            if (
              res.data.event.levelId !== 0 &&
              res.data.event.levelId !== '' &&
              res.data.event.planId !== '' &&
              res.data.event.planId !== 0
            ) {
              //已经启动过预案
              this.$store.commit('setTurnOnEmergencyResponse', true);
            } else {
              //没启动过预案
              this.$store.commit('setTurnOnEmergencyResponse', false);
            }

            // 事件类型对应的参数
            if (res.data.eventParams.length == 0) {
              this.eventsParameters = false;
            } else {
              this.eventsParameters = true;
              setTimeout(() => {
                this.parameter = res.data.eventParams;
              }, 600);
              this.paramsData = res.data.eventParams; //重新赋值数据库数据做对比
            }
            this.$emit('getAll', this.dataALL, this.paramsData);
            this.$emit('updateNewID', res.data.event.id);
          }
        });
      }
    },
    //获取事件级别
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
    //区域选择
    eventScene() {
      this.$http
        .get(`${window.SITE_CONFIG.baseUrl}/sys/systown/treeList`)
        .then((response) => {
          if (response.data.code === 0) {
            // let options = [];
            // response.data.list.forEach((item) => {
            //   options.push({
            //     label: item.townName,
            //     value: item.id,
            //   });
            // });
            // this.jurisdictionData = options;
            this.jurisdictionData = response.data.list;
          }
        });

      // let data = {};
      // this.$api.topTree(data).then((res) => {
      //   if (res.errorcode == "0") {
      //     // this.$refs.eventDialog.lol(res.data);

      //     this.jurisdictionData = res.data; // console.log("this.treeData: ", this.treeData);
      //     var gettree = function (data) {
      //       for (var i = 0; i < data.length; i++) {
      //         if (data[i].children.length == 0) {
      //           data[i].children = undefined;
      //         } else {
      //           gettree(data[i].children);
      //         }
      //       }
      //     };
      //     gettree(this.jurisdictionData);
      //   }
      // });
    },
    //定位弹窗
    location() {
      // this.$refs.loction.visible = false;
      // this.$refs.loction.rushLocation = false;
      // this.$nextTick(() => {
      //   this.$refs.loction.visible = true;
      //   this.$refs.loction.rushLocation = true;
      // });
      this.$refs.LocationDialogRef.open({
        longitude: this.longitude,
        latitude: this.latitude,
        address: this.ruleForm.fallFigureAddress,
        cgcsLongitude: this.cgcsLongitude,
        cgcsLatitude: this.cgcsLatitude
      }).then(({ longitude, latitude, address, pointInfo,  cgcsLongitude, cgcsLatitude }) => {
        this.longitude = longitude;
        this.latitude = latitude;
        this.ruleForm.fallFigureAddress = address;
        this.cgcsLatitude = cgcsLatitude;
        this.cgcsLongitude = cgcsLongitude;
        console.log(pointInfo)
        // 14672  现场环境-南海：落图地点能自动同步所属区域
        const res = this.handleArea({ ...pointInfo });
        if (res) {
          this.ruleForm.incidenArea = res.areaIds;
        }
      });
    },
    /**
     * @description 落图地点同步所属区域
     */
    handleArea({nation, province, city, county, road, poi}) {
      const areas = [nation, province, city, county, road, poi]
      const arr = areas.map((item) => {
        const areaIds = getRelations({
          arr: this.jurisdictionData,
          relationKey: 'id',
          findKey: 'townName',
          findValue: item,
        });
        if (areaIds.length > 0) {
          const areaName = getRelations({
            arr: this.jurisdictionData,
            relationKey: 'townName',
            findKey: 'townName',
            findValue: item,
          });
          return {
            name: item,
            areaIds,
            areaName,
          }
        } else {
          return false;
        }
      })
      console.log('地点：', arr)
      const arr2 = arr.filter((el) => !!el)
      if (arr2.length > 0) {
        return {
          areaIds: arr2[0].areaIds,
          areaName: arr2[0].areaName,
        }
      } else {
        return false;
      }
    },
    /**
     * @editor qinjiaqi
     * @param {Object} 传回的地点信息
     * @return {type} undefined
     * @lastEditor hexinting
     * @lastDate 20201-12-11
     * @description：直接改事发地点文本不能触发组件聚焦，使用focus会因为el-input外面裹了div不起效果，改用ref
     */
    locationCallback(obj) {
      if (obj.data.action && obj.data.action == 'retpoint') {
        let latlon = obj.data.object.point.split(',');
        this.longitude = latlon[0];
        this.latitude = latlon[1];
        this.ruleForm.fallFigureAddress = obj.data.object.address; // 修改字段incidentSite 改为 fallFigureAddress
        this.$refs.loction.visible = false;
      }
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate(); // 清空之前的验证
        this.$refs.getFocus.focus(); // 触发事发地点框聚焦
      });
    },
    sendLocationMsg(obj) {
      if (obj.data.action && obj.data.action == 'ready') {
        if (this.longitude && this.latitude) {
          //var framew = window.mapFrame.contentWindow;
          var mapFarme = document.getElementById('overId');
          if (mapFarme) {
            var data = {};
            data.action = 'getpoint';
            var object = {};
            object.center = this.longitude + ',' + this.latitude;
            object.address = this.ruleForm.fallFigureAddress;
            object.area = '';
            data.object = object;
            mapFarme.contentWindow.postMessage(JSON.stringify(data), '*');
          }
        }
      }
    },
    /**
     * @lastEditor hexinting
     * @lastDate 2020-12-10
     * @description 获取报送单位
     */
    addressBook() {
      let data = { data: { parameter: null, type: 'select' } };
      this.$api.unitSetting(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: 'error',
          });
          return;
        }
        let treeData = res.data;
        this.reportingUnitData = JSON.parse(JSON.stringify(treeData));
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
        if (this.beforeFilterTxt !== '') {
          // 新增完报告单位后，要选中新增的报告单位
          let reportingUnit = []; // 选中的报送单位
          reportingUnit.push(
            this.reportingUnitData.filter(
              (el) => el.name === this.beforeFilterTxt,
            )[0].id,
          );
          this.ruleForm.reportingUnit = reportingUnit;
          this.ruleForm.reportingUnitName = this.beforeFilterTxt;
          setTimeout(() => {
            this.beforeFilterTxt = '';
          }, 100);
        }
      });
    },
    incidentType() {
      // this.title = "选择事件类型";
      // this.addEventDialog = true;
      let data = {};
      this.$api.getTree(data).then((res) => {
        if (res.errorcode == '0') {
          // this.$refs.eventDialog.lol(res.data);

          this.eventTypeData = res.data; // console.log("this.treeData: ", this.treeData);
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
    //树点击事件
    handleNodeClick(data) {
      let type = this.title;
      switch (type) {
        case '选择部门':
          this.eventDepartment = [];
          this.eventDepartment.push({ name: data.name, id: data.id });
          break;
        case '选择区域':
          this.eventTree = [];
          this.eventTree.push({
            name: data.name,
            id: data.id,
          });
          break;
        case '选择联系人分组':
          this.eventAddressBook = [];
          this.eventAddressBook.push({
            name: data.name,
            id: data.id,
          });
          break;
        case '选择事件类型':
          this.eventType = [];
          this.eventType.push({
            name: data.name,
            id: data.id,
          });
          break;
        default:
          break;
      }
    },
    //弹出取消
    close() {
      this.addEventDialog = false;
      this.isUpdateForm = false;
      this.isUpdateParameter = false;
      this.isSaveData = true;
      // console.log(this.caseFor);
      // if (this.ruleForm.incidenType.length == 0) {
      //     // console.log(this.ruleForm.incidenType.length,888)
      //     sessionStorage.setItem('caseID', '0');
      // } else {
      //     sessionStorage.setItem('caseID', this.caseFor[0].id);
      // }
      // if (this.ruleForm.incidenArea.length == 0) {
      //     sessionStorage.setItem('areaId', '');
      //     sessionStorage.setItem('area', '');
      // } else {
      //     sessionStorage.setItem('areaId', this.areaIdArr[0].id);
      //     sessionStorage.setItem('area', this.areaNameArr[0].name);
      // }
      // sessionStorage.setItem('areaId',this.areaIdArr)
      // sessionStorage.setItem('area',this.areaNameArr)
      this.$refs.eventDialog.clearData(); //刷新子组件数据
      // if (this.titleType == '新增') {
      //     sessionStorage.removeItem('caseID');
      //     sessionStorage.removeItem('areaId');
      //     sessionStorage.removeItem('area');
      //     sessionStorage.removeItem('statusCode');
      // }
      // this.$emit('refreshEvent');
    },
    tests(val) {
      this.test = val;
    },
    /**
     * @param {String} type 类型 生成快报：点击"生成快报按钮"按钮前要先保存续报
     * @lastEditor hexinting
     * @lastDate 2020-11-30
     * @description 保存事件（事件首报）：若是事件首报，保存完拿到事件id后，再保存事件续报
     */
    saveEvent(type) {
      // if (!this.longitude || !this.latitude) {
      //   this.$message({
      //     message: "请给事发地点选择经纬度",
      //     type: "error",
      //   });
      //   return false;
      // }
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.titleType == '保存') {
            let eventId = sessionStorage.getItem('newID');
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
            this.isSaveData = false; // 初始化保存状态
            let data = {
              eventCode: this.ruleForm.serialNumber, //事件编号
              eventId: eventId, //事件ID
              vcTitle: this.ruleForm.eventTitle, //事件标题
              dtReportTime: this.ruleForm.reportedTime, //接报时间
              dtOccurTime: this.ruleForm.incidentTime, // 事发时间
              iAreaId: this.ruleForm.incidenArea[
                this.ruleForm.incidenArea.length - 1
              ], //事发区域ID
              vcAddress: this.ruleForm.incidentSite, //事发地点
              dLongitude: this.longitude, //经度
              dLatitude: this.latitude, //纬度
              vcReportDepart: this.ruleForm.reportingUnitName, //报送单位
              vcReportDepartId: this.ruleForm.reportingUnit.length > 0 ? this.ruleForm.reportingUnit[
                this.ruleForm.reportingUnit.length - 1
              ] : '', //报送单位
              iCaseClassId: eventTypeId, //事件类型
              iEventLevel: this.test, //事件等级
              iEvnetSetingParams: this.parameter, //事件参数
              txtReportSuperior: this.ruleForm.reportSituation, //上报情况
              txtReportDescription: this.ruleForm.allCase.trim(), //总体情况
              vcReportMan: this.ruleForm.speakerName,
              vcReportNum: this.ruleForm.speakerPhone,
              writtenReportTime: this.ruleForm.timeOfWrittenSubmission, // 书面报送时间
              reportType: this.ruleForm.submissionMethod, // 报送方式
              // accidentSituation: this.ruleForm.accidentSituation, // 事故情况 // bug8540 事故情况要删除 author:hexinting date:20201120
              dutyPeople: this.ruleForm.beOnDuty, // 值班员
              dutyLeader: this.ruleForm.leaderOnDuty, // 值班领导
              iOperatorId: this.ruleForm.leaderOnDuty, // 操作员Id
              txtReason: this.ruleForm.matterCause, // 事发原因
              txtResult: this.ruleForm.matterConsequence, // 已造成后果
              txtGrowing: this.ruleForm.matterTendency, // 事件发展趋势
              txtMessure: this.ruleForm.step, // 已采取措施
              iComplaintOprid: this.ruleForm.iComplaintOprid,
              dtComplaint: this.ruleForm.matterTime, // 转办时间
              vcComplaintDepartment: this.ruleForm.matterBranch, // 转办部门
              disposalName: this.ruleForm.disposalName, // 处置姓名
              disposalUnit: this.ruleForm.disposalUnit, // 处置单位
              disposalPosition: this.ruleForm.disposalPosition, // 处置职务
              disposalPhone: this.ruleForm.disposalPhone, // 处置电话
              cgcsLongitude: this.cgcsLongitude,
              cgcsLatitude: this.cgcsLatitude,
            };
            console.log('%c [ data ]', 'font-size:13px; background:pink; color:#bf2c9f;', data);
            this.$api.saveEventReceive(data).then((res) => {
              if (res.errorcode == '0') {
                // 扬州新需求不需要此提示 author hexinting date:2020-11-29
                // this.$message({
                //   message: "保存事件成功!",
                //   type: "success",
                // });
                let preservation = 1;
                let stort = true;

                this.$emit('saveSuccess', preservation, stort);
                // this.getDefaultEvent();
                // this.reload()
                this.isUpdateForm = false;
                this.isUpdateParameter = false;
                this.isSaveData = true; // isSaveData用来判断是否是保存了事件，保存了事件就不用校验parameter author:hexinting date:2020-11-11
                this.isAddEventDeal = false; // 初始化添加续报状态
                this.saveEventDealReport(type); // 第一次新建事件时，先调用旧的保存事件的接口，再调用保存续报的接口
                // 保存事件后要给父组件更新事件列表，同步数据
                this.$emit('initEventList'); // 初始化事件列表
              } else {
                let nameTab = '事件接报';
                this.$emit('saveError', nameTab);
                //this.$message.error(res.msg)
              }
              if (res.errorcode === 500) {
                this.$message({
                  message: res.msg,
                  type: 'warn',
                });
              }
            });
            return;
          }
          if (this.titleType == '新增' || this.titleType == '登记') {
             let eventID = sessionStorage.getItem('newID');
            if(this.titleType == '新增'&&eventID == '' || eventID == null){
              this.addEventInFos();
            }
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
            this.isSaveData = false; // 初始化保存状态
            let data = {
              eventCode: this.ruleForm.serialNumber,
              vcTitle: this.ruleForm.eventTitle, // 事件标题
              dtReportTime: this.ruleForm.reportedTime, // 接报时间
              dtOccurTime: this.ruleForm.incidentTime, // 事发时间
              iAreaId: this.ruleForm.incidenArea[
                this.ruleForm.incidenArea.length - 1
              ],
              // iAreaId: eventTreeId, //事发区域ID
              vcAddress: this.ruleForm.incidentSite, //事发地点
              dLongitude: this.longitude, //经度
              dLatitude: this.latitude, //纬度
              vcReportDepart: this.ruleForm.reportingUnitName, //报送单位
              vcReportDepartId: this.ruleForm.reportingUnit.length > 0 ? this.ruleForm.reportingUnit[
                this.ruleForm.reportingUnit.length - 1
              ] : '', //报送单位
              iCaseClassId: eventTypeId, //事件类型
              iEventLevel: this.test, //事件等级
              iEvnetSetingParams: this.parameter, //事件参数
              txtReportSuperior: this.ruleForm.reportSituation, //上报情况
              txtReportDescription: this.ruleForm.allCase.trim(), //总体情况
              vcReportMan: this.ruleForm.speakerName,
              vcReportNum: this.ruleForm.speakerPhone,
              phoneId:
                this.phoneHistalId == '' || undefined
                  ? null
                  : this.phoneHistalId,
              remark:
                this.phoneHistalremack == '' || undefined
                  ? null
                  : this.phoneHistalremack,
              writtenReportTime: this.ruleForm.timeOfWrittenSubmission, // 书面报送时间
              reportType: this.ruleForm.submissionMethod, // 报送方式
              // accidentSituation: this.ruleForm.accidentSituation, // 事故情况 // bug8540 事故情况要删除 author:hexinting date:20201120
              dutyPeople: this.ruleForm.beOnDuty, // 值班员
              dutyLeader: this.ruleForm.leaderOnDuty, // 值班领导
              txtReason: this.ruleForm.matterCause,
              txtResult: this.ruleForm.matterConsequence,
              txtGrowing: this.ruleForm.matterTendency,
              txtMessure: this.ruleForm.step,
              iComplaintOprid: this.ruleForm.iComplaintOprid,
              dtComplaint: this.ruleForm.matterTime,
              vcComplaintDepartment: this.ruleForm.matterBranch,
              disposalName: this.ruleForm.disposalName, // 处置姓名
              disposalUnit: this.ruleForm.disposalUnit, // 处置单位
              disposalPosition: this.ruleForm.disposalPosition, // 处置职务
              disposalPhone: this.ruleForm.disposalPhone, // 处置电话
            };
            this.$api.saveEventReceive(data).then((res) => {
              if (res.errorcode == '0') {
                // 扬州新需求不需要此提示 author hexinting date:2020-12-29
                // this.$message({
                //   message: "新增事件成功!",
                //   type: "success",
                // });
                let eventId = res.data.id;
                if (this.titleType == '登记') {
                  let upData = {
                    id: this.phoneHistalId,
                    eventId: eventId,
                    remark: res.data.reportDescription,
                  };
                  this.$api.ok(upData).then((res) => {
                    if (res.errorcode == '0') {
                      this.parameter = res.data;
                    } else {
                      //this.$message.error(res.msg)
                    }
                  });
                }

                this.titleType = '保存';
                sessionStorage.setItem('newID', eventId);
                this.$emit('saveEvent');
                this.$emit('typeAddAll', this.typeOfReceipt);
                this.$emit('refreshEvent');
                // this.getDefaultEvent();
                // this.reload()
                this.isSaveData = true; // isSaveData用来判断是否是保存了事件，保存了事件就不用校验parameter author:hexinting date:2020-11-11
                this.isUpdateForm = false;
                this.isUpdateParameter = false;
                this.saveEventDealReport(type); // 第一次新建事件时，先调用旧的保存事件的接口，再调用保存续报的接口
                this.$emit('initEventList', 'updateList'); // 初始化事件列表
              } else {
                let nameTab = '事件接报';
                this.$emit('saveError', nameTab);
                this.$message.error(res.msg);
              }
            });
            return;
          }
        } else {
          let judge = false;
          this.$emit('emitPath', judge);
        }
      });
    },
    //colse关闭窗口
    closeDialog() {
      this.addEventDialog = false;
      if (this.ruleForm.incidenType.length == 0) {
        sessionStorage.setItem('caseID', '0');
        this.$store.commit('setCaseId', '0');
      } else {
        sessionStorage.setItem('caseID', this.caseFor[0].id);
        this.$store.commit('setCaseId', this.caseFor[0].id);
      }

      if (this.ruleForm.incidenArea.length == 0) {
        sessionStorage.setItem('areaId', '');
        sessionStorage.setItem('area', '');
      } else {
        sessionStorage.setItem('areaId', this.areaIdArr[0].id);
        sessionStorage.setItem('area', this.areaNameArr[0].name);
      }
      // sessionStorage.setItem('areaId',this.areaIdArr)
      // sessionStorage.setItem('area',this.areaNameArr)
      this.$refs.eventDialog.clearData(); //刷新子组件数据
      if (this.titleType == '新增') {
        sessionStorage.removeItem('caseID');
        sessionStorage.removeItem('areaId');
        sessionStorage.removeItem('area');
      }
      this.$emit('refreshEvent');
    },
    /**
     * @param {} type 'addEventDeal' 添加续报 添加续报只需要更新接报时间
     * @lastEditor hexinting
     * @lastDate 2020-12-3
     * @description 获取事发时间和接报时间
     */
    getTimes(type) {
      let now = new Date();
      let year = now.getFullYear(); //年
      let month = now.getMonth() + 1; //月
      let day = now.getDate(); //日
      let hh = now.getHours(); //时
      let mm = now.getMinutes(); //分
      let ss = now.getSeconds(); //秒
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
      if (type === 'addEventDeal') {
        this.ruleForm.reportedTime = clock;
        return false;
      }
      this.ruleForm.incidentTime = clock;
      this.ruleForm.reportedTime = clock;
    },
    //弹出确定
    confirm() {
      let type = this.title;
      switch (type) {
        case '选择部门':
          this.ruleForm.matterBranch = this.eventDepartment[0].name;
          break;
        case '选择区域':
          this.ruleForm.incidenArea = this.eventTree[0].name;
          this.$emit('refreshEvent');
          break;
        case '选择联系人分组':
          this.ruleForm.reportingUnit = this.eventAddressBook[0].name;
          break;
        case '选择事件类型':
          this.ruleForm.incidenType = this.eventType[0].name;
          this.$emit('refreshEvent');
          this.amendParameter();
          let caseIdParameter = sessionStorage.getItem('caseID');
          break;
        default:
          break;
      }
      this.$refs.eventDialog.clearData(); //刷新子组件数据
      this.addEventDialog = false;
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
            closeOnClickModal: false,
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
    /**
     * @param {type} 没有
     * @return {type} undefined
     * @lastEditor :hexinting
     * @updateTime :2020-12-03
     * @description：清空事件参数然后让其新增事件
     */
    addEvent() {
      let emEventId = sessionStorage.getItem('newID');
      let emCaseId = sessionStorage.getItem('caseID');
      let emEventContent = sessionStorage.getItem('createdEvent');
      this.$emit('setId', emEventId, emCaseId); //清空之前将事件ID传给事件不保存时再次用来存储事件
      this.$confirm('新增将清空以上的内容', '是否新增?', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning',
        closeOnClickModal: false,
      })
        .then(() => {
          this.titleType = '新增';
          sessionStorage.removeItem('newID');
          sessionStorage.removeItem('caseID');
          sessionStorage.removeItem('eventTitle'); // 移除旧的缓存标题
          this.$emit('refreshEvent'); //新增，移除旧的本地存储
          this.initForm(); // 初始化表单
          this.eventList = []; // 初始事件列表
          this.eventList.push({
            eventIndex: 0, // 下标
            dealOrderName: '事件首报', // 续报序号
            eventCreateTime:
              this.ruleForm.reportedTime.length === 19
                ? this.ruleForm.reportedTime.substring(0, 16)
                : this.ruleForm.reportedTime, // 接报时间
            eventData: {}, // 表单数据
            eventDealId: null, // 续报id
            ruleForm: null, // 表单数据
            paramsData: null, // 信息要素数据
            attachmentList: null, // 快报列表
          });
          this.currentEventData = this.eventList[0];
          this.$emit('updateNewID', null); // 清空事件id
          let typeAdd = '新增';
          this.$emit('addType', typeAdd);
          // bug9093 author:hexinting date:20201206
          // 获取默认的事件类型子参数
          // let data = {
          //   caseId: 0,
          // };
          // this.$api.defaultParameters(data).then((res) => {
          //   if (res.errorcode == "0") {
          //     // console.log(res.data);
          //     this.parameter = res.data;
          //   } else {
          //     // this.$message.error(res.msg)
          //   }
          // });
          // 如果本地有createdEvent项则调用
          if (emEventContent) {
            this.ruleForm.incidentTime = emEventContent.time;
            this.ruleForm.incidenArea = emEventContent.position;
            this.ruleForm.eventTitle = emEventContent.event;
          }
        })
        .catch(() => {});
    },
    eventReception() {
      let eventId = sessionStorage.getItem('newID');
      if (eventId) {
        let data = {
          eventId,
        };
        this.$api.eventReception(data).then((res) => {
          if (res.errorcode == '0') {
            this.$message.success('事件接报成功');
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        this.$message.error('事件不存在');
      }
    },
    // 显示事件上报弹窗
    eventReport() {
      this.isShowEventReportDialog = true;
    },
    //一键核实
    oneKeyCheck() {
      this.$store.commit('setOverallEvent', this.ruleForm.allCase);
      this.$emit('oneKeyCheck');
    },
    //一键报送
    oneKeySubmission() {
      this.$store.commit('setOverallEvent', this.ruleForm.allCase);
      this.$emit('oneKeySubmission');
    },
    // 获取所属区域的id
    getIncidenAreaId(areaId) {
      const areaIdArr = getRelations({
        arr: this.jurisdictionData,
        relationKey: 'id',
        findKey: 'id',
        findValue: Number(areaId),
      });
      this.ruleForm.incidenArea = areaIdArr;
      this.dataALL.incidenArea = areaIdArr;
    },
    /**
     * @param {Number} caseClassId 灾害类型id
     * @param {string} caseName 灾害类型名字
     * @returns 无
     * @lastEditor hexinting
     * @lastDate 2020-12-06
     * @description 获取灾害类型
     */
    getCaseClassId(caseClassId, caseName) {
      let incidenType = [];
      this.eventType = [];
      if (
        this.eventTypeData.filter((item) => item.id === caseClassId).length > 0
      ) {
        let filterData = this.eventTypeData.filter(
          (item) => item.id === caseClassId,
        );
        incidenType.push(filterData[0].id);
        this.ruleForm.incidenType = incidenType;
        this.dataALL.incidenType = incidenType;
        // bug9112 author:hexinting date:2020-12-06
        this.eventType.push({
          name: filterData[0].name,
          id: filterData[0].id,
        });

        let index;
        for (let i = 0; i < this.eventTypeData.length; i++) {
          if (this.eventTypeData[i].id === filterData[0].id) {
            index = i;
            break;
          }
        }

        this.$refs.incidenType.$refs.panel.$refs.menu[0].$el.children[0].children[0].children[
          index
        ].click();
        this.$refs.incidenType.dropDownVisible = false;
        return incidenType;
      } else {
        for (let a of this.eventTypeData) {
          if (a.children && a.children.length > 0) {
            if (
              a.children.filter((item) => item.id === caseClassId).length > 0
            ) {
              let filterData = a.children.filter(
                (item) => item.id === caseClassId,
              );
              incidenType.push(a.id);
              incidenType.push(filterData[0].id);
              this.ruleForm.incidenType = incidenType;
              this.dataALL.incidenType = incidenType;
              // bug9112 author:hexinting date:2020-12-06
              this.eventType.push({
                name: filterData[0].name,
                id: filterData[0].id,
              });
              let index;
              for (let i = 0; i < a.children.length; i++) {
                if (a.children[i].id === filterData[0].id) {
                  index = i;
                  break;
                }
              }
              this.$nextTick(() => {
                this.$refs.incidenType.$refs.panel.$refs.menu[1].$el.children[0].children[0].children[
                  index
                ].click();
                this.$refs.incidenType.dropDownVisible = false;
              });

              return incidenType;
            } else {
              for (let b of a.children) {
                if (b.children && b.children.length > 0) {
                  if (
                    b.children.filter((item) => item.id === caseClassId)
                      .length > 0
                  ) {
                    let filterData = b.children.filter(
                      (item) => item.id === caseClassId,
                    );
                    incidenType.push(a.id);
                    incidenType.push(b.id);
                    incidenType.push(filterData[0].id);
                    this.ruleForm.incidenType = incidenType;
                    this.dataALL.incidenType = incidenType;
                    // bug9112 author:hexinting date:2020-12-06
                    this.eventType.push({
                      name: filterData[0].name,
                      id: filterData[0].id,
                    });
                    let index;
                    for (let i = 0; i < b.children.length; i++) {
                      if (b.children[i].id === filterData[0].id) {
                        index = i;
                        break;
                      }
                    }
                    this.$nextTick(() => {
                      this.$refs.incidenType.$refs.panel.$refs.menu[2].$el.children[0].children[0].children[
                        index
                      ].click();
                      this.$refs.incidenType.dropDownVisible = false;
                    });

                    return incidenType;
                  } else {
                    for (let c of b.children) {
                      if (c.children && c.children.length > 0) {
                        if (
                          c.children.filter((item) => item.id === caseClassId)
                            .length > 0
                        ) {
                          let filterData = c.children.filter(
                            (item) => item.id === caseClassId,
                          );
                          incidenType.push(a.id);
                          incidenType.push(b.id);
                          incidenType.push(c.id);
                          incidenType.push(filterData[0].id);
                          this.ruleForm.incidenType = incidenType;
                          this.dataALL.incidenType = incidenType;
                          // bug9112 author:hexinting date:2020-12-06
                          this.eventType.push({
                            name: filterData[0].name,
                            id: filterData[0].id,
                          });
                          let index;
                          for (let i = 0; i < c.children.length; i++) {
                            if (c.children[i].id === filterData[0].id) {
                              index = i;
                              break;
                            }
                          }
                          this.$nextTick(() => {
                            this.$refs.incidenType.$refs.panel.$refs.menu[3].$el.children[0].children[0].children[
                              index
                            ].click();
                            this.$refs.incidenType.dropDownVisible = false;
                          });

                          return incidenType;
                        } else {
                          return incidenType;
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
    /**
     * @authorName: qinjiaqi
     * @param {type} 没有
     * @return {String} 逐级展示的事件类型
     * @description：根据id拼接类型名字,全部获取
     */
    getIncidenType() {
      let incidenType = '';
      if (this.ruleForm.incidenType.length === 1) {
        if (
          this.eventTypeData.filter(
            (item) => item.id === this.ruleForm.incidenType[0],
          ).length > 0
        ) {
          incidenType = this.eventTypeData.filter(
            (item) => item.id === this.ruleForm.incidenType[0],
          )[0].name;
        } else {
          let type1 = '';
          let type2 = '';
          let type3 = '';
          for (let i = 0; i < this.eventTypeData.length; i++) {
            if (this.eventTypeData[i].children) {
              if (
                this.eventTypeData[i].children.filter(
                  (item) => item.id === this.ruleForm.incidenType[0],
                ).length > 0
              ) {
                type1 = this.eventTypeData[i].name;
                type2 = this.eventTypeData[i].children.filter(
                  (item) => item.id === this.ruleForm.incidenType[0],
                )[0].name;
                incidenType = type1 + '/' + type2;
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
                        (item) => item.id === this.ruleForm.incidenType[0],
                      ).length > 0
                    ) {
                      type1 = this.eventTypeData[i].name;
                      type2 = this.eventTypeData[i].children[j].name;
                      type3 = this.eventTypeData[i].children[j].children.filter(
                        (item) => item.id === this.ruleForm.incidenType[0],
                      )[0].name;
                      incidenType = type1 + '/' + type2 + '/' + type3;
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
          (item) => item.id === this.ruleForm.incidenType[0],
        )[0].name;
        let type2 = '';
        for (let i = 0; i < this.eventTypeData.length; i++) {
          if (this.eventTypeData[i].children) {
            if (
              this.eventTypeData[i].children.filter(
                (item) => item.id === this.ruleForm.incidenType[1],
              ).length > 0
            ) {
              type2 = this.eventTypeData[i].children.filter(
                (item) => item.id === this.ruleForm.incidenType[1],
              )[0].name;
              incidenType = type1 + '/' + type2;
              // incidenType = this.eventTypeData[i].children.filter(item => item.id === this.ruleForm.incidenType[1])[0].name
            }
          }
        }
      } else if (this.ruleForm.incidenType.length === 3) {
        let type1 = this.eventTypeData.filter(
          (item) => item.id === this.ruleForm.incidenType[0],
        )[0].name;
        let type2 = '';
        let type3 = '';
        for (let i = 0; i < this.eventTypeData.length; i++) {
          if (this.eventTypeData[i].children) {
            for (let j = 0; j < this.eventTypeData[i].children.length; j++) {
              if (this.eventTypeData[i].children[j].children) {
                if (
                  this.eventTypeData[i].children[j].children.filter(
                    (item) => item.id === this.ruleForm.incidenType[2],
                  ).length > 0
                ) {
                  type2 = this.eventTypeData[i].children.filter(
                    (item) => item.id === this.ruleForm.incidenType[1],
                  )[0].name;
                  type3 = this.eventTypeData[i].children[j].children.filter(
                    (item) => item.id === this.ruleForm.incidenType[2],
                  )[0].name;
                  incidenType = type1 + '/' + type2 + '/' + type3;
                  // incidenType = this.eventTypeData[i].children[j].children.filter(item => item.id === this.ruleForm.incidenType[2])[0].name;
                }
              }
            }
          }
        }
      }
      return incidenType;
    },
    /**
     * @param {type} 没有
     * @return {String} 最后一个地区的名字
     * @description 获取最后一个地区的名字
     */
    getIncidenArea() {
      const areaId = this.ruleForm.incidenArea[this.ruleForm.incidenArea.length - 1];
      const areaName = getRelations({
        arr: this.jurisdictionData,
        relationKey: 'townName',
        findKey: 'id',
        findValue: Number(areaId),
      });
      return areaName && areaName.length > 0 ? areaName[areaName.length - 1] : '';
    },
    /**
     * @editorName: qinjiaqi
     * @param {type} 没有
     * @return {String} 按格式生成的标题
     * @description：一键生成标题
     */
    generateTheTitle() {
      let oneTime = '';
      let twoTime = '';
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
        (oneTime === '' && twoTime === '') ||
        incidenArea === '' ||
        incidenType === ''
      ) {
        this.$message({
          message: '请将必填信息补充完整',
          type: 'warning',
        });
        return;
      }
      // this.ruleForm.eventTitle = `${oneTime}.${twoTime} ${this.ruleForm.incidenArea} ${this.ruleForm.incidenType}`;
      this.ruleForm.eventTitle = `${oneTime}.${twoTime} ${incidenArea}/${incidenType}`;
      this.$message({
        message: '生成成功',
        type: 'success',
      });
      this.$refs['ruleForm'].clearValidate(['eventTitle']);
    },
    // 注释的原因:没用到（author：hexinting；2020-9-17）
    // beOnDutyHandle() {
    //     this.beOnDutyVisible = true;
    //     this.$refs.beOnDutyDialog.checkboxGroup = this.ruleForm.beOnDutyIds;
    // },
    // changeBeOnDuty(checkboxGroup, checkboxData) {
    //     this.ruleForm.beOnDuty = '';
    //     this.beOnDutyVisible = false;
    //     this.ruleForm.beOnDutyIds = checkboxGroup;
    //     checkboxData.map(v => {
    //         this.ruleForm.beOnDuty += v.name + '，';
    //     });
    //     this.ruleForm.beOnDuty = this.ruleForm.beOnDuty.substring(
    //         0,
    //         this.ruleForm.beOnDuty.length - 1
    //     );
    // },
    // leaderOnDutyHandle() {
    //     this.leaderOnDutyVisible = true;
    //     this.$refs.leaderOnDutyDialog.checkboxGroup = this.ruleForm.leaderOnDutyIds;
    // },
    // changeLeaderOnDuty(checkboxGroup, checkboxData) {
    //     this.ruleForm.leaderOnDuty = '';
    //     this.leaderOnDutyVisible = false;
    //     this.ruleForm.leaderOnDutyIds = checkboxGroup;
    //     checkboxData.map(v => {
    //         this.ruleForm.leaderOnDuty += v.name + '，';
    //     });
    //     this.ruleForm.leaderOnDuty = this.ruleForm.leaderOnDuty.substring(
    //         0,
    //         this.ruleForm.leaderOnDuty.length - 1
    //     );
    // },
    /**
     * @lastEditor hexinting
     * @lastDate 2020-12-06
     * @description 事件类型改变触发
     */
    incidenTypeChange(arr) {
      sessionStorage.setItem('caseID', arr[arr.length - 1]);
      this.$store.commit('setCaseId', arr[arr.length - 1]);
      // bug9093 author:hexinting date:20201206
      if (arr.length !== 0) {
        this.amendParameter();
      } else {
        this.parameter = [];
      }
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
    testHandle() {
      this.textareaHeight = document.getElementById(
        'baowenNeiRon',
      ).style.height;
    },
    disposalSituationText() {
      this.textareaHeight2 = document.getElementById(
        'disposalSituation',
      ).style.height;
    },
    /**
     * @author hexinting
     * @description 显示或收起更多扩展信息
     */
    showExtentInformation() {
      this.extendInformationVisible = !this.extendInformationVisible;
    },
    //事件上报
    addEventInFos(){
      this.$api.addEventInFos({}).then((res) => {
         console.log(res,"事件上报")
      });
    }
  },
};
</script>

<style scoped>
@import './assets/css/yangZhouOverallSituation';
</style>
