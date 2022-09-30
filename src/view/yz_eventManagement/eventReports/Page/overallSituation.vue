<!--@author：yf-->
<template>
  <div>
    <div class="formContent">
      <el-form
        size="small"
        label-width="110px"
        :model="ruleForm"
        :rules="IsShenzhenProject ? shenZhenRules : rules"
        ref="ruleForm"
        @submit.native.prevent
        label-position="left"
        style="padding-bottom: 70px"
        :hide-required-asterisk="asterisk"
        :class="IsZengChengProject ? 'zengChengFormStyle' : ''"
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
                v-model="ruleForm.eventTitle"
                @change="getDrillMode"
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
        <el-row :gutter="gutter">
          <el-col :span="12">
            <el-form-item label="事发时间:" prop="incidentTime">
              <el-date-picker
                style="width: 100%"
                v-model="ruleForm.incidentTime"
                type="datetime"
                :format="
                  isYangZhou ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd HH:mm:ss'
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
                  isYangZhou ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd HH:mm:ss'
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
        </el-row>
        <el-row :gutter="gutter">
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
          <el-col :span="12">
            <el-form-item label="事发地点:" prop="incidentSite">
              <el-input
                type="text"
                v-model.trim="ruleForm.incidentSite"
                show-word-limit
                :title="ruleForm.incidentSite"
                ref="getFocus"
              >
                <template slot="append">
                  <el-button style="letter-spacing: 6px" @click="location">
                    <i class="el-icon-location-outline"></i>
                  </el-button>
                  <!-- author: qinjiaqi -->
                  <!-- description: 增城需要发坐标 -->
                  <el-button style="letter-spacing: 6px" @click="sendSite"
                    >发送</el-button
                  >
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="gutter">
          <el-col :span="12">
            <el-form-item label="报告单位:" prop="reportingUnit">
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
              <el-cascader
                v-model.trim="ruleForm.reportingUnit"
                :options="reportingUnitData"
                ref="reportingUnit"
                :props="props"
                clearable
                style="float: left; width: 100%"
                :show-all-levels="false"
                filterable
                @change="reportingUnitChange"
              ></el-cascader>
            </el-form-item>
          </el-col>

          <el-col :span="12">
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
              </el-select>
              <!-- <el-cascader
                v-model.trim="ruleForm.incidenArea"
                :options="options"
                :props="props"
                clearable
              style="float:left;width: 100%"></el-cascader>-->
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
                popper-class="eventType"
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
          <el-col :span="12" v-if="isLuoYangProject">
            <el-form-item label="接报模式:" prop="drillMode">
              <el-radio-group
                v-model="ruleForm.drillMode"
                @change="getDrillMode"
              >
                <el-radio :label="0">突发事件</el-radio>
                <el-radio :label="1">演练事件</el-radio>
              </el-radio-group>
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
                      <div v-if="item.type == '文本'" style="width: 150px">
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
                          <span v-if="item.unit == ''">{{ item.name }}:</span>
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
                        <!--                        {{item.name}}<span v-if="item.unit!==''">({{item.unit}})</span>:-->
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
                          <span v-if="item.unit == ''">{{ item.name }}:</span>
                        </div>
                        <el-date-picker
                          style="width: 150px; margin: 0 auto"
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
              label="事件报文:"
              style="margin: 0 0 5px 0; text-align: right"
            >
              <div style="display: flex; justify-content: flex-end">
                <div>
                  <el-button type="primary" size="mini" @click="eventMessage"
                    >生成突发事件报文</el-button
                  >
                </div>
              </div>
            </el-form-item>
            <el-form-item id="baowenNeiRon">
              <el-input
                type="textarea"
                v-model="ruleForm.allCase"
                :autosize="{ minRows: 8, maxRows: 8 }"
                @mouseover.native="testHandle"
              ></el-input>
              <div
                style="
                  padding-right: 5px;
                  position: absolute;
                  right: 9px;
                  bottom: 1px;
                  display: flex;
                  justify-content: flex-end;
                  background-color: #f9f9f9;
                  width: 96%;
                "
              >
                <div style="margin-right: 20px">
                  <el-link size="mini" @click="oneKeyCheck">一键核实</el-link>
                </div>
                <div>
                  <el-link size="mini" @click="oneKeySubmission"
                    >一键报送</el-link
                  >
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="gutter" v-if="!isYangZhou">
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
              <el-input
                type="text"
                v-model.trim="ruleForm.beOnDuty"
                show-word-limit
                :title="ruleForm.beOnDuty"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12" v-if="!isYangZhou">
            <el-form-item label="值班领导:">
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

              <el-input
                type="text"
                v-model.trim="ruleForm.leaderOnDuty"
                show-word-limit
                :title="ruleForm.beOnDuty"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="addButton">
        <el-button type="primary" size="small" @click="saveEvent('ruleForm')"
          >保存事件</el-button
        >
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
    <!--qinjiaqi 发送事发地点旧 废弃-->
    <multiple-contact
      ref="selectDialog"
      v-if="hackResetMultiple"
      @close="closeMultiple"
      @confirm="confirmMultiple"
      @closeDialog="closeMyDialogMultiple"
      :selectTitle="selectTitle"
      :selectData="selectData"
    ></multiple-contact>
    <!-- qinjiaqi 发送事发地点新 -->
    <el-dialog
      :visible.sync="isSmsShow"
      @close="isSmsShow = false"
      :append-to-body="true"
      title="选择联系人"
      :close-on-click-modal="false"
      class="adClass"
      width="30%"
    >
      <el-form>
        <sms-dialog ref="smsDialog" :selectContact="true"></sms-dialog>
      </el-form>
    </el-dialog>

    <event-report-dialog
      v-if="isShowEventReportDialog"
      @close="isShowEventReportDialog = false"
    >
    </event-report-dialog>
  </div>
</template>

<script>
import smsDialog from "@/view/yz_integratedCommunication/icpPhone/icpPhonePage/smsStep/smsRightSendLocation";
import addDialog from "@/view/yz_eventManagement/eventReports/dialog/eventDialog";
import Location from "@/yz_components/loction/loction";
import multipleContact from "@/view/yz_eventManagement/eventReports/dialog/selectDialog";
import bus from "@/yz_components/common/js/eventBus";
import selectMansDialog from "@/view/yz_eventManagement/eventReports/dialog/selectMansDialog";
import EventReportDialog from "@/view/yz_eventManagement/eventReports/dialog/eventReportDialog";
export default {
  name: "overallSituation",
  components: {
    addDialog,
    Location,
    multipleContact,
    selectMansDialog,
    EventReportDialog,
    smsDialog,
  },
  inject: ["reload"], // 引入方法
  data() {
    return {
      isSmsShow: false, // 事发地点弹窗
      isUpdateForm: false, // 表单是否更新（判断表单是否更新，有更新则提示弹窗）
      isUpdateParameter: false, // 事件灾害类型对应的参数是否更新（判断参数是否更新，有更新则提示弹窗）
      IsShenzhenProject: window.g.IsShenzhenProject, // 是否是深圳项目
      IsZengChengProject: window.g.IsZengChengProject, // 增城项目
      gutter: 20,
      // dataALL 是专门用来判断表单是否更改的依据 若在ruleForm里面添加了变量，dataAll也要同步添加
      // 在接口selectLastEvent和findById获取事件数据时候,更新ruleForm的同时也要更新dataALL
      ruleForm: {
        serialNumber: "",
        eventTitle: "",
        reportedTime: "",
        incidentTime: "",
        timeOfWrittenSubmission: "",
        incidenArea: [],
        reportingUnit: [],
        reportingUnitName: "",
        incidentSite: "",
        submissionMethod: "",
        // accidentSituation: "", // bug8540 事故情况要删除 author:hexinting date:20201120
        incidenType: [],
        // incidentRank: '',
        deathToll: "",
        bruiseToll: "",
        disappearToll: "",
        reportSituation: "",
        allCase: "",
        speakerName: "",
        speakerPhone: "",
        beOnDuty: sessionStorage.getItem("displayname"),
        // beOnDutyIds: [],
        leaderOnDuty: "",
        leaderOnDutyIds: [],
        drillMode: 0, // 洛阳需求->演练模式，0-突发事件，1-演练事件
      },
      rules: {
        // 深圳市政府的表单验证规则
        eventTitle: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        reportedTime: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        incidentTime: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        // timeOfWrittenSubmission: [
        //   { required: true, message: "不能为空", trigger: "blur" },
        // ],
        incidenArea: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        incidentSite: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
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
            message: "不能为空",
            trigger: "blur",
          },
        ],
        beOnDuty: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        leaderOnDuty: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        incidenType: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        deathToll: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        bruiseToll: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        disappearToll: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],

        allCase: [
          {
            message: "",
          },
        ],
      },
      shenZhenRules: {
        // eventTitle: [{required: true, message: "不能为空", trigger: "blur"}],
        reportedTime: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        incidentTime: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        timeOfWrittenSubmission: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        incidenArea: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        incidentSite: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        reportSituation: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        submissionMethod: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        // accidentSituation: [ // bug8540 事故情况要删除 author:hexinting date:20201120
        //   {
        //     required: true,
        //     message: "不能为空",
        //     trigger: "blur",
        //   },
        // ],
        reportingUnit: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        beOnDuty: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        leaderOnDuty: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        incidenType: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        deathToll: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        bruiseToll: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        disappearToll: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],

        allCase: [
          {
            message: "",
          },
        ],
      },
      eventLevel: [], //事件级别下拉数据
      addEventDialog: false, //是否弹窗
      title: "", //弹窗标题
      eventTree: [], //事发区域选择树存储内容
      eventAddressBook: [], //通讯库存储
      eventType: [], //事件类型存储
      longitude: "", //经度
      latitude: "", //纬度
      parameter: [], //参数
      eventsParameters: false,
      test: "",
      titleType: "保存", //title类型

      reason: "", //事发原因
      result: "", //已造成后果
      growing: "", //事件发展趋势
      messure: "", //已采取措施
      // dataALL 是专门用来判断表单是否更改的依据 若在ruleForm里面添加了变量，dataAll也要同步添加
      // 在接口selectLastEvent和findById获取事件数据时候,更新ruleForm的同时也要更新dataALL
      dataALL: {
        serialNumber: "",
        eventTitle: "",
        reportedTime: "",
        incidentTime: "",
        timeOfWrittenSubmission: "",
        incidenArea: [],
        reportingUnit: [],
        reportingUnitName: "",
        incidentSite: "",
        submissionMethod: "",
        // accidentSituation: "", // bug8540 事故情况要删除 author:hexinting date:20201120
        incidenType: [],
        // incidentRank: '',
        deathToll: "",
        bruiseToll: "",
        disappearToll: "",
        reportSituation: "",
        allCase: "",
        speakerName: "",
        speakerPhone: "",
        beOnDuty: "",
        // beOnDutyIds: [],
        leaderOnDuty: "",
        leaderOnDutyIds: [],
        drillMode: 0, // 洛阳需求->演练模式，0-突发事件，1-演练事件
      },

      paramsData: [], //重新赋值数据库返回数据

      typeOfReceipt: "保存", //接收新增还是修改

      caseFor: [], //存储原来的事件类型id
      areaIdArr: [], //存储原来的事件区域ID
      areaNameArr: [], //存储原来的事件区域名字

      selectTitle: "", //发送事发地点弹窗标题
      selectData: false, //发送事发地点是否弹窗
      hackResetMultiple: true, //强制刷新

      phoneHistalId: "", //登记事件传过来的ID
      phoneHistalremack: "",
      asterisk: false,
      addClass: "", //生成突发报文存储

      // mapLongitude:'',//传给地图标点的经度
      // mapLatitude:'',//传给地图标点的纬度
      // mapIncidentSite:'',//传给地图的位置

      mapId: "overId", //地图定位不同的ID
      isEventDetail: false, //报送省厅事件框
      mettingForm: {
        eventIds: "",
        name: "",
        describe: "",
        periodNumber: 0,
      },
      sendLoading: "", //报送加载条
      eventIds: [
        {
          name: "特别重大",
          id: 1,
        },
        {
          name: "重大",
          id: 2,
        },
        {
          name: "较大",
          id: 3,
        },
        {
          name: "一般",
          id: 4,
        },
      ],

      typeValue: "", // 事件类型值
      levelValue: "", // 事件等级值
      eventId: sessionStorage.getItem("newID"),
      // 报送方式
      submitOptions: [
        {
          id: 1,
          label: "电话",
          value: "1",
        },
        {
          id: 2,
          label: "短信",
          value: "2",
        },
        {
          id: 3,
          label: "传真",
          value: "3",
        },
        {
          id: 4,
          label: "其他",
          value: "4",
        },
        {
          id: 5,
          label: "三级联动",
          value: "5",
          disabled: true,
        },
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
      textareaHeight: 0, // 事件报文高度
      textareascrollTop: 0, // 事件报文滚动高度
      isYangZhou: window.g.IsYangZhouProject, // 是否扬州项目
      isOpenLab: window.g.IsOpenLabProject, // 是否openlab项目
      isSaveData: false, // 是否新增事件
      isLuoYangProject: window.g.IsLuoYangProject, // 是否洛阳项目
      eventTitleMark: "",
    };
  },
  created() {
    window.addEventListener("message", this.locationCallback);
    window.addEventListener("message", this.sendLocationMsg);

    this.eventScene();

    this.incidentType();
  },
  beforeDestroy() {
    window.removeEventListener("message", this.locationCallback);
    window.addEventListener("message", this.sendLocationMsg);
  },
  mounted() {
    if (sessionStorage.getItem("title")) {
      this.ruleForm.eventTitle = sessionStorage.getItem("title");
    }
    if (sessionStorage.getItem("time")) {
      this.ruleForm.reportedTime = sessionStorage.getItem("time");
    }
    // sessionStorage.setItem('LevelID', LevelID);
    this.addressBook();
    this.$nextTick(() => {
      setTimeout(() => {
        this.getDefaultEvent();
      }, 2000);
      this.getEventRank();

      // 获取事件报文高度
      this.textareaHeight = document.getElementById(
        "baowenNeiRon"
      ).style.height;
      document.getElementById("baowenNeiRon").onscroll = () => {
        this.textareascrollTop = document.getElementById(
          "baowenNeiRon"
        ).scrollTop;
      };
    });

    bus.$off("addEvent");
    bus.$on("addEvent", () => {
      this.addEvent();
    });
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
  },
  watch: {
    getRuleFormIncidenType(newValue, oldValue) {
      sessionStorage.setItem("incidenType", newValue);
    },
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
    theScene: {
      handler(newV) {
        if (newV !== "" && newV !== null && newV.length !== 0) {
          let areaName = newV[0].name;
          let areaId = newV[0].id;
          if (
            (sessionStorage.getItem("areaId") != "" &&
              sessionStorage.getItem("areaId") != "null" &&
              sessionStorage.getItem("areaId")) ||
            (sessionStorage.getItem("area") != "" &&
              sessionStorage.getItem("area") != "null" &&
              sessionStorage.getItem("area"))
          ) {
            this.areaIdArr.push({
              id: sessionStorage.getItem("areaId"),
            });
            this.areaNameArr.push({
              name: sessionStorage.getItem("area"),
            });
          }
          sessionStorage.setItem("areaId", areaId);
          sessionStorage.setItem("area", areaName);
        }
      },
      deep: true,
    },
    eventTypeComments: {
      handler(newV, oldV) {
        console.log("oldV, newV", oldV, newV, 1);
        if (newV !== "" && newV !== null && newV.length !== 0) {
          let caseID = newV[0].id;
          let caseName = newV[0].name;
          this.$emit("refreshEvent");
          sessionStorage.setItem("caseID", caseID);
          sessionStorage.setItem("caseName", caseName);
          if (sessionStorage.getItem("caseID") != 0) {
            this.caseFor.push({
              id: sessionStorage.getItem("caseID"),
            });
            console.log(this.caseFor);
          }
        }
        if (oldV.length == 0) {
          return;
        }
        if (newV.length !== 0 && oldV.length !== 0) {
          console.log(newV, oldV, 2);
          if (newV[0].id !== oldV[0].id) {
            this.$emit("delectReape");
          }
        }
      },
      deep: true,
    },

    /**
     * @lastEditor hexinting
     * @lastDate 2020-9-17
     * @description 监听表单是否发生改变
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
        console.log(
          "表单：深度遍历是否一样：",
          this.deepCompare(this.dataALL, nV)
        );
        console.log("旧", JSON.stringify(this.dataALL));
        console.log("新", JSON.stringify(nV));
      },
      deep: true,
    },
    olos: {
      handler(newV) {
        this.$store.commit("setParam", newV);
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
          // this.matchingTitle();
        }
      },
      deep: true,
    },
    /**
     * @lastEditor hexinting
     * @lastDate 2020-11-11
     * @description 监听事件类型对应的参数是否发生改变
     */
    parameter: {
      handler(nV, oV) {
        console.log("新parameter", { ...nV });
        console.log("旧parameter", { ...oV });
        if (oV.length !== 0 && nV.length !== 0 && !this.isSaveData) {
          // isSaveData用来判断是否是保存了事件，保存了事件就不用校验parameter author:hexinting date:2020-11-11
          console.log("参数：深度遍历是否一样：", this.deepCompare(oV, nV));
          console.log("旧", JSON.stringify(oV));
          console.log("新", JSON.stringify(nV));
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
          return item.name === "死亡"; //筛选出匹配数据
        });
        // console.log(obj.value);
        this.$store.commit("setDieNumber", obj && obj.value ? obj.value : 0);
      },
      immedate: true,
    },
    // "ruleForm.incidenType"() {
    //   this.amendParameter();
    // },
  },
  methods: {
    /**
     * @param {*} x 比较的对象1
     * @param {*} y 比较的对象2
     * @description 深度比较两个对象是否相等
     * @author hexinting
     * @date 2020-9-16
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
     * @param {array} val 报送单位id
     * @lastEditor hexinting
     * @lastDate 2020-9-18
     * @description 报送单位发生改变触发
     */
    reportingUnitChange(val) {
      this.getReportingUnit(val[val.length - 1], "dataALL");
    },
    // 测试下拉框
    testSelect() {
      // console.log(this.parameter);
    },
    openEventDetail(key) {
      console.log(sessionStorage.getItem("newID"));
      if (sessionStorage.getItem("newID")) {
        this.isEventDetail = key == 1 ? true : false;
      } else {
        this.$message({
          message: "请先保存事件!",
          type: "warning",
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
        signKey: "1970!@#$e102ebb2a8df821d6ae596a901180c036",
      };
      let mdFiveRes;
      this.$api.provinceMD5(mdFive).then((res) => {
        if (res.errorcode == 0) {
          // console.log(res.data);
          mdFiveRes = res.data;
        } else {
          //this.$message.error(res.msg)
        }
      });
      let deathNum, missNum, injuredNum;
      this.parameter.forEach((item, i) => {
        if (item.name == "死亡人数") {
          deathNum = item.value;
        }
        if (item.name == "失踪人数") {
          missNum = item.value;
        }
        if (item.name == "受伤人数") {
          injuredNum = item.value;
        }
      });
      // console.log(this.mettingForm.periodNumber);
      if (
        this.ruleForm.eventTitle == "" ||
        this.mettingForm.eventId == "" ||
        this.mettingForm.describe == "" ||
        this.longitude == "" ||
        this.latitude == "" ||
        this.ruleForm.incidentSite == "" ||
        this.ruleForm.speakerName == "" ||
        this.mettingForm.name == "" ||
        this.ruleForm.speakerPhone == "" ||
        this.ruleForm.incidenType == [] ||
        this.mettingForm.periodNumber === "" ||
        this.ruleForm.reportedTime == "" ||
        this.ruleForm.incidentTime == ""
      ) {
        this.$message({
          message: "所有参数均不能为空!",
          type: "warning",
        });
        return;
      }
      this.sendLoading = this.$loading({
        lock: true,
        text: "报送中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let data = {
        orgCode: "gdszyj-7a863389-84a5-4354-a1e1-46f2ce5b47af",
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
        disasterId: sessionStorage.getItem("newID")
          ? sessionStorage.getItem("newID")
          : "",
        eventId: sessionStorage.getItem("newID")
          ? sessionStorage.getItem("newID")
          : "",
      };
      let json = {
        paramJson: JSON.stringify(data),
      };
      this.$api.reportEvent(json).then((res) => {
        if (res.errorcode == 0) {
          // console.log(res.data);
          this.isEventDetail = false;
          this.$message({
            message: "报送成功!",
            type: "success",
          });
          this.sendLoading.close();
        } else {
          this.sendLoading.close();
          this.$message.error("报送失败!");
          //this.$message.error(res.msg)
        }
      });
    },
    // 根据事件要素替换事件报文(因后台报文只有一个模板，所以“当前事态进展情况及数据如下：”之后的模板由前端动态生成)
    replaceMessage(data) {
      let filter_text = "当前事态进展情况及数据如下：";
      let _index = data.indexOf(filter_text);
      let text = "";
      let content = "";
      // console.log('下标：', _index);
      // console.log(data.substring(0, _index));
      if (_index === -1) {
        text = data;
      } else {
        text = data.substring(0, _index);
      }
      for (let item of this.parameter) {
        if (item.name) {
          if (
            item.value === "" ||
            item.value === null ||
            item.value === undefined
          ) {
            content += item.name + "：" + "【" + item.name + "】" + "；";
          } else {
            if (
              item.unit === undefined ||
              item.unit === null ||
              item.unit === ""
            ) {
              content += item.name + "：" + item.value + "；";
            } else {
              content +=
                item.name + "：" + item.value + "(" + item.unit + ")" + "；";
            }
          }
        }
      }
      content = text + filter_text + "\n" + content;
      // console.log(content);
      return content;
    },
    //生成事件报文模板
    eventMessage() {
      // console.log('事件类型：', this.parameter);
      // console.log('表单：', this.ruleForm);
      let data = {
        caseId: sessionStorage.getItem("caseID"),
        typeId: "699",
        page: 1,
        size: 10,
      };
      this.$api.templateList(data).then((res) => {
        if (res.errorcode == 0) {
          // console.log('事件突发报文：', res.data.data);
          res.data.data.forEach((item, i) => {
            let addClass = item.content;
            if (!this.isYangZhou) {
              addClass = this.replaceMessage(addClass);
            }
            // console.log(addClass);
            //替换事件基本信息，没填的不替换、保留占位符
            if (
              this.ruleForm.eventTitle !== undefined &&
              this.ruleForm.eventTitle !== null &&
              this.ruleForm.eventTitle !== ""
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
                this.isYangZhou
                  ? this.getTime(this.ruleForm.reportedTime)
                  : this.ruleForm.reportedTime
              );
            }
            if (
              this.ruleForm.incidentTime !== undefined &&
              this.ruleForm.incidentTime !== null &&
              this.ruleForm.incidentTime !== ""
            ) {
              addClass = addClass.replace(
                "【事发时间】",
                this.isYangZhou
                  ? this.getTime(this.ruleForm.incidentTime)
                  : this.ruleForm.reportedTime
              );
            }
            if (this.ruleForm.incidenArea.length > 0) {
              // addClass = addClass.replace(
              //   "【事发区域】",
              //   this.ruleForm.incidenArea
              // );
              addClass = addClass.replace(
                "【事发区域】",
                this.getIncidenArea()
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
              // addClass = addClass.replace(
              //   "【报送单位】",
              //   this.ruleForm.reportingUnit
              // );
              addClass = addClass.replace(
                "【报送单位】",
                this.ruleForm.reportingUnitName
              );
            }
            if (this.ruleForm.incidenType.length > 0) {
              // addClass = addClass.replace(
              //   "【事件类型】",
              //   this.ruleForm.incidenType
              // );
              addClass = addClass.replace(
                "【事件类型】",
                this.eventTypeComments[0].name
              );
            }
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
              // console.log(`【${param.name}】` === '【类型】');
              //需要根据信息要素名称匹配替换的字符串，名称为空则跳过
              if (
                param.name === undefined ||
                param.name === null ||
                param.name === ""
              ) {
                continue;
              }
              // console.log('param.value: ', param.value);
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
                // console.log(addClass.indexOf(`【${param.name}】`, addClass[39])); // 39
                // console.log(`【${param.name}】`)
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
                console.log(item.content.indexOf("【参数项】"));
                let paramIndex = item.content.indexOf("【参数项】");
                addClass = addClass.substr(0, paramIndex);

                for (let param of arr) {
                  addClass += param;
                }
                console.log(addClass);
                // addClass = item.content // !!!!!
                // console.log(item.content)
                // console.log('addClass', this.ruleForm)
              }
              */

            // OK

            // addClass = addClass.replace('【参数项】 【值】【单位】；', '')
            // console.log(addClass)

            //console.log(arr); // ["受伤人数: 0(位);", "时间: null(null);", "死亡人数: 0(位);", "文本: null(本);"]

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
        "年" +
        month +
        "月" +
        date +
        "日" +
        hours +
        "点" +
        minutes +
        "分";
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
    /**
     * @param {type} undefined
     * @returns 无
     * @lastEditor qinjiaqi
     * @lastDate 2020-12-16
     * @description 发送事发地点弹窗
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
      // this.selectTitle = "选择联系人";
      // this.selectData = true;
      sessionStorage.setItem("eventTitle", this.ruleForm.eventTitle); //事件标题可以实时改
      // 事发地点是用id查找的，不能实时填写去发送，必须保存后才可以
      this.isSmsShow = true;
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
     * @lastEditor qinjiaqi
     * @lastDate 2020-11-26
     * @description 发送事发地点弹窗确认
     */
    //发送事发地点弹窗确认
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
    //根据修改的事件类型获取事件参数
    amendParameter() {
      let caseIdParameter = sessionStorage.getItem("caseID");
      console.log("caseIdParameter: ", caseIdParameter);
      let data = {
        caseId: caseIdParameter,
      };
      this.$api.defaultParameters(data).then((res) => {
        if (res.errorcode == "0") {
          console.log(res.data);
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
    getReportingUnit(id, type) {
      // console.log('报送单位：', id);
      // console.log('报送单位列表', this.reportingUnitData);
      var departId = parseInt(id);
      let data = {
        id: [], // 报送单位id
        name: "", // 报送单位名字
      };
      if (departId.toString() != "NaN") {
        // console.log("----reportDepartId------", departId);
        // console.log("this.reportingUnitData: ", this.reportingUnitData);
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
          this.dataALL.reportingUnitName = type ? "" : departName;
          this.dataALL.reportingUnit = type ? "" : departArr;
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
              this.ruleForm.reportingUnit = departArr;
              this.ruleForm.reportingUnitName = departName;
              this.dataALL.reportingUnitName = type ? "" : departName;
              this.dataALL.reportingUnit = type ? "" : departArr;
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
                    this.ruleForm.reportingUnitName = departName;
                    this.ruleForm.reportingUnit = departArr;
                    this.dataALL.reportingUnitName = type ? "" : departName;
                    this.dataALL.reportingUnit = type ? "" : departArr;
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
                        this.ruleForm.reportingUnitName = departName;
                        this.ruleForm.reportingUnit = departArr;
                        this.dataALL.reportingUnitName = type ? "" : departName;
                        this.dataALL.reportingUnit = type ? "" : departArr;
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
        this.ruleForm.reportingUnitName = departName;
        this.dataALL.reportingUnitName = type ? "" : departName;
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
          this.ruleForm.reportingUnit = departArr;
          this.dataALL.reportingUnit = type ? "" : departArr;
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
              this.ruleForm.reportingUnit = departArr;
              this.dataALL.reportingUnit = type ? "" : departArr;
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
                    this.ruleForm.reportingUnit = departArr;
                    this.dataALL.reportingUnit = type ? "" : departArr;
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
                        this.ruleForm.reportingUnit = departArr;
                        this.dataALL.reportingUnit = type ? "" : departArr;
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
    /**
     * @param 无
     * @returns 无
     * @lastEditor qinjiaqi
     * @lastDate 2020-09-30
     * @description 获取默认事件或最新事件
     * 在事件接报页面当中，有个需求是：更换子页面时候要判断当前表单是否更改过。
     * 因此声明了一个变量用来保存获取数据的值（dataALL），dataALL 是专门用来判断表单是否更改的依据。
     * 若在ruleForm里面声明了多少个key，dataAll也要同步。
     * 通过在接口selectLastEvent和接口findById获取事件数据，给ruleForm赋值的时候，dataAll也要同步赋值。
     */
    getDefaultEvent() {
      let eventId = sessionStorage.getItem("newID"); // 事件id
      // 不存在事件id
      if (eventId == "" || eventId == null || eventId == undefined) {
        console.log(
          "-----------获取最新的事件id获取事件类型的参数------------"
        );
        // 获取最新的事件id
        this.$api.selectLastEvent({}).then((res) => {
          if (res.errorcode == "0") {
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
            sessionStorage.setItem("newID", newID); //本地存储最新事件的ID
            sessionStorage.setItem("caseID", caseID); //本地存储最新事件的caseID
            sessionStorage.setItem("caseName", caseName); //本地存储最新事件的caseID
            sessionStorage.setItem("areaId", areaId); //本地存储最新事件的事发区域ID
            sessionStorage.setItem("area", area); //本地存储最新事件的事发区域
            sessionStorage.setItem("eventTitle", eventTitle); //为了自动生成写的存储标题
            sessionStorage.setItem("allCase", allCase); //为了自动生成写的存储总体情况
            sessionStorage.setItem("LevelID", LevelID); // 缓存事件等级
            sessionStorage.setItem("phoneExtend1", extend1); // 获取电话计时是否开启,存储在本地存储
            sessionStorage.setItem("smsExtend2", extend2); // 获取电话计时是否开启,存储在本地存储
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
            console.log(this.ruleForm.eventTitle)
            console.log(this.dataALL.eventTitle)
            // 如果是洛阳项目，在标题前添加演练标识 author：husiyue date：2021/01/22
            if(this.isLuoYangProject){
              if(res.data.event.rehearse == 1){
                this.eventTitleMark = "【演练】"
                this.ruleForm.eventTitle = this.eventTitleMark+this.ruleForm.eventTitle
                this.dataALL.eventTitle = this.eventTitleMark+this.dataALL.eventTitle
                this.ruleForm.drillMode = 1 // 接报模式
                this.dataALL.drillMode = 1 // 接报模式
                console.log(this.ruleForm.eventTitle)
                console.log(this.dataALL.eventTitle)
              }else{
                this.eventTitleMark = ""
                this.ruleForm.drillMode = 0
                this.dataALL.drillMode = 0
              }
            }
            // 获取报告单位。因为element-UI组件中，级联组件需要每一层id组成一个数组。数据库保存报告单位时，只保存了最后一个子级的id。因此需要沿着该子级去寻找祖先id，拼接成数组。
            if (res.data.event.reportDepartId !== 0) {
              this.getReportingUnit(res.data.event.reportDepartId);
            }
            // 有些旧数据 res.data.event.reportDepartId为0 res.data.event.reportDepart为报送单位名字。因此要根据报送单位名字来查找报送单位id
            if (
              res.data.event.reportDepartId === 0 &&
              res.data.event.reportDepart !== ""
            ) {
              this.getReportingUnit(res.data.event.reportDepart);
            }
            // 获取所属区域的id。因为element-UI组件中，级联组件需要每一层id组成一个数组。数据库保存所属区域时，只保存了最后一个子级的id。
            this.getIncidenAreaId(res.data.event.areaId); // 获取所属区域的id

            // 获取灾害类型。因为element-UI组件中，级联组件需要每一层id组成一个数组。数据库保存灾害类型时，只保存了最后一个子级的id。
            this.getCaseClassId(
              res.data.event.caseClassId,
              res.data.event.caseClass
            ); // 获取灾害类型

            // 报送方式为三级联动的数据时，事件类型不存在，先自行添加数据，在隐藏
            this.eventTypeData = this.eventTypeData.filter(
              (v) => !v.threeLevels
            );
            if (res.data.event.reportType == 5) {
              this.eventTypeData.push({
                id: res.data.event.caseClassId,
                name: res.data.event.caseClass,
                threeLevels: true,
              });
            }
            bus.$emit("removeThreeLevels", res.data.event.reportType);

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

            // 事件类型对应的参数
            if (res.data.eventParams.length == 0) {
              this.eventsParameters = false;
            } else {
              this.eventsParameters = true;
              this.parameter = res.data.eventParams;
              this.paramsData = res.data.eventParams; //重新赋值数据库数据做对比
            }
            this.$emit("getAll", this.dataALL, this.paramsData);
            this.$emit("updateNewID", newID);
            // console.log('paramsData: ', paramsData);
            // this.$store.commit('setSituation', this.ruleForm);
            // this.$store.commit('setParam',this.parameter);
          }
        });
      } else if (eventId == "newID") {
        console.log("-----------创建新事件获取事件类型的参数------------");
        let phoneHistaldata = this.$store.getters.getPhoneHistoryId;
        let remack = phoneHistaldata.remark;
        let phoneRemack = phoneHistaldata.id;
        let name = phoneHistaldata.name;
        let iphone = phoneHistaldata.iphone;
        this.titleType = "登记";
        this.ruleForm.eventTitle = "";
        this.ruleForm.reportedTime = "";
        this.ruleForm.incidentTime = "";
        this.ruleForm.incidenArea = [];
        this.ruleForm.incidentSite = "";
        this.ruleForm.reportingUnit = [];
        this.ruleForm.incidenType = [];
        // this.ruleForm.incidentRank = '',
        this.ruleForm.deathToll = "";
        this.ruleForm.bruiseToll = "";
        this.ruleForm.disappearToll = "";
        this.ruleForm.reportSituation = "";
        this.ruleForm.allCase = remack == null || undefined ? "" : remack;
        this.phoneHistalId = phoneRemack;
        this.phoneHistalremack = remack == null || undefined ? "" : remack;
        this.ruleForm.serialNumber = "";
        this.ruleForm.speakerName = name == null || undefined ? "" : name;
        this.ruleForm.speakerPhone = iphone == null || undefined ? "" : iphone;
        this.parameter = [];
        this.test = "";
        this.latitude = "";
        this.longitude = "";
        this.eventAddressBook = [];
        this.eventType = [];
        this.eventTree = [];
        this.getTimes();
      } else {
        console.log("-----------根据事件id获取事件类型的参数------------");
        // 根据事件id获取事件详情
        let data = {
          id: eventId,
        };
        this.$api.findById(data).then((res) => {
          console.log(res); //获取到事件详情
          if (res.errorcode == "0") {
            let extend1 = res.data.event.extend1; // 获取电话计时是否开启存储在本地存储
            let extend2 = res.data.event.extend2; // 获取电话计时是否开启存储在本地存储
            sessionStorage.setItem("phoneExtend1", extend1); // 获取电话计时是否开启存储在本地存储
            sessionStorage.setItem("smsExtend2", extend2); // 获取电话计时是否开启存储在本地存储
            this.ruleForm.eventTitle = res.data.event.title; // 事件标题
            console.log(res.data.event.rehearse)
            /* 
                            @editor: qinjiaqi
                            @description: 每得到一次当前展示页的数据都把该数据标题及时缓存进本地 
                        */
            let eventTitle = res.data.event.title; // 事件标题
            sessionStorage.setItem("eventTitle", eventTitle); // 把新的标题存进缓存

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
            if(this.isLuoYangProject){
              if(res.data.event.rehearse == 1){
                this.eventTitleMark = "【演练】"
                this.ruleForm.eventTitle = this.eventTitleMark+this.ruleForm.eventTitle
                this.dataALL.eventTitle = this.eventTitleMark+this.dataALL.eventTitle
                this.ruleForm.drillMode = 1 // 接报模式
                this.dataALL.drillMode = 1 // 接报模式
              }else{
                this.eventTitleMark = ""
                this.ruleForm.drillMode = 0
                this.dataALL.drillMode = 0
              }
            }
            // 获取报告单位。因为element-UI组件中，级联组件需要每一层id组成一个数组。数据库保存报告单位时，只保存了最后一个子级的id。因此需要沿着该子级去寻找祖先id，拼接成数组。
            if (res.data.event.reportDepartId !== 0) {
              this.getReportingUnit(res.data.event.reportDepartId); //获取报告单位
            }

            // 有些旧数据 res.data.event.reportDepartId为0 res.data.event.reportDepart为报送单位名字。因此要根据报送单位名字来查找报送单位id
            if (
              res.data.event.reportDepartId === 0 &&
              res.data.event.reportDepart !== ""
            ) {
              this.getReportingUnit(res.data.event.reportDepart); //获取报告单位
            }
            // 获取所属区域的id。因为element-UI组件中，级联组件需要每一层id组成一个数组。数据库保存所属区域时，只保存了最后一个子级的id。
            this.getIncidenAreaId(res.data.event.areaId); //获取所属区域的id

            // 获取灾害类型。因为element-UI组件中，级联组件需要每一层id组成一个数组。数据库保存灾害类型时，只保存了最后一个子级的id。
            this.getCaseClassId(
              res.data.event.caseClassId,
              res.data.event.caseClass
            ); // 获取灾害类型

            // 报送方式为三级联动的数据时，事件类型不存在，先自行添加数据，在隐藏
            this.eventTypeData = this.eventTypeData.filter(
              (v) => !v.threeLevels
            );
            if (res.data.event.reportType == 5) {
              this.eventTypeData.push({
                id: res.data.event.caseClassId,
                name: res.data.event.caseClass,
                threeLevels: true,
              });
            }
            bus.$emit("removeThreeLevels", res.data.event.reportType);

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
            this.$emit("getAll", this.dataALL, this.paramsData);
            this.$emit("updateNewID", res.data.event.id);
            // console.log('this.parameter: ',  this.parameter);
          }
        });
      }
      // console.log('------事件-------', this.ruleForm);
      console.log(
        "*****获取默认事件或者最新事件*****",
        this.ruleForm,
        this.dataALL
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
    //区域选择
    eventScene() {
      let data = {};
      this.$api.topTree(data).then((res) => {
        if (res.errorcode == "0") {
          // this.$refs.eventDialog.lol(res.data);

          this.jurisdictionData = res.data; // console.log("this.treeData: ", this.treeData);
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
    //定位弹窗
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
        this.$refs.ruleForm.clearValidate(); // 清空之前的验证
        this.$refs.getFocus.focus(); // 触发事发地点框聚焦
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
    //通讯录
    addressBook() {
      let data = {};
      this.$api.phoneGroupList(data).then((res) => {
        if (res.errorcode == "0") {
          // this.$refs.eventDialog.lol(res.data);

          this.reportingUnitData = res.data; // console.log("this.treeData: ", this.treeData);
          console.log("this.reportingUnitData: ", this.reportingUnitData);
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
    incidentType() {
      // this.title = "选择事件类型";
      // this.addEventDialog = true;
      let data = {};
      this.$api.getTree(data).then((res) => {
        if (res.errorcode == "0") {
          // console.log(res);
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
        case "选择区域":
          this.eventTree = [];
          this.eventTree.push({
            name: data.name,
            id: data.id,
          });
          break;
        case "选择联系人分组":
          // console.log(data.name);
          this.eventAddressBook = [];
          this.eventAddressBook.push({
            name: data.name,
            id: data.id,
          });
          break;
        case "选择事件类型":
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
      // console.log(this.caseFor);
      // if (this.ruleForm.incidenType.length == 0) {
      //     console.log(this.ruleForm.incidenType.length,888)
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
    //保存事件
    saveEvent() {
      if (!this.longitude || !this.latitude) {
        this.$message({
          message: "请给事发地点选择经纬度",
          type: "error",
        });
        return false;
      }
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          if (this.titleType == "保存") {
            // console.log('保存');
            let eventId = sessionStorage.getItem("newID");
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
            this.isSaveData = false; // 初始化保存状态
            // console.log(this.longitude, this.latitude);
            // console.log(
            //     'this.ruleForm.reportingUnit: ',
            //     this.ruleForm.incidenArea[
            //         this.ruleForm.incidenArea.length - 1
            //     ]
            // );
            // console.log(
            //     'this.ruleForm.incidenArea: ',
            //     this.ruleForm.reportingUnit[
            //         this.ruleForm.reportingUnit.length - 1
            //     ]
            // );
            let data = {
              eventCode: this.ruleForm.serialNumber, //事件编号
              eventId: eventId, //事件ID
              vcTitle:
                this.eventTitleMark.length > 0
                  ? this.ruleForm.eventTitle.split("】")[1]
                  : this.ruleForm.eventTitle, //事件标题,如果是洛阳项目，要去除演练事件标识
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
              vcAddress: this.ruleForm.incidentSite, //事发地点
              dLongitude: this.longitude, //经度
              dLatitude: this.latitude, //纬度
              vcReportDepart: this.ruleForm.reportingUnitName, //报送单位
              vcReportDepartId: this.ruleForm.reportingUnit[
                this.ruleForm.reportingUnit.length - 1
              ],
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
              rehearse: this.ruleForm.drillMode, //接报模式：1-演练事件 0-突发事件,默认为突发事件，洛阳需要加演练事件
            };
            this.$api.saveEventReceive(data).then((res) => {
              if (res.errorcode == "0") {
                this.$message({
                  message: "保存事件成功!",
                  type: "success",
                });
                let preservation = 1;
                let stort = true;

                // console.log(res.data.levelId);
                this.$emit("saveSuccess", preservation, stort);
                this.getDefaultEvent();
                // this.reload()
                this.isUpdateForm = false;
                this.isUpdateParameter = false;
                this.isSaveData = true; // isSaveData用来判断是否是保存了事件，保存了事件就不用校验parameter author:hexinting date:2020-11-11
              } else {
                let nameTab = "事件接报";
                this.$emit("saveError", nameTab);
                //this.$message.error(res.msg)
              }
              if (res.errorcode === 500) {
                this.$message({
                  message: res.msg,
                  type: "warn",
                });
              }
            });
            return;
          }
          if (this.titleType == "新增" || this.titleType == "登记") {
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
            this.isSaveData = false; // 初始化保存状态
            // console.log(eventTreeId, eventTypeId);
            let data = {
              eventCode: this.ruleForm.serialNumber,
              vcTitle:
                this.eventTitleMark.length > 0
                  ? this.ruleForm.eventTitle.split("】")[1]
                  : this.ruleForm.eventTitle, //事件标题,如果是洛阳项目，要去除演练事件标识
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
              ],
              // iAreaId: eventTreeId, //事发区域ID
              vcAddress: this.ruleForm.incidentSite, //事发地点
              dLongitude: this.longitude, //经度
              dLatitude: this.latitude, //纬度
              vcReportDepart: this.ruleForm.reportingUnitName, //报送单位
              vcReportDepartId: this.ruleForm.reportingUnit[
                this.ruleForm.reportingUnit.length - 1
              ], //报送单位
              iCaseClassId: eventTypeId, //事件类型
              iEventLevel: this.test, //事件等级
              iEvnetSetingParams: this.parameter, //事件参数
              txtReportSuperior: this.ruleForm.reportSituation, //上报情况
              txtReportDescription: this.ruleForm.allCase.trim(), //总体情况
              vcReportMan: this.ruleForm.speakerName,
              vcReportNum: this.ruleForm.speakerPhone,
              phoneId:
                this.phoneHistalId == "" || undefined
                  ? null
                  : this.phoneHistalId,
              remark:
                this.phoneHistalremack == "" || undefined
                  ? null
                  : this.phoneHistalremack,
              writtenReportTime: this.ruleForm.timeOfWrittenSubmission, // 书面报送时间
              reportType: this.ruleForm.submissionMethod, // 报送方式
              // accidentSituation: this.ruleForm.accidentSituation, // 事故情况 // bug8540 事故情况要删除 author:hexinting date:20201120
              dutyPeople: this.ruleForm.beOnDuty, // 值班员
              dutyLeader: this.ruleForm.leaderOnDuty, // 值班领导
              rehearse: this.ruleForm.drillMode, //接报模式：1-演练事件 0-突发事件,默认为突发事件，洛阳需要加演练事件
            };
            this.$api.saveEventReceive(data).then((res) => {
              if (res.errorcode == "0") {
                this.$message({
                  message: "新增事件成功!",
                  type: "success",
                });
                let eventId = res.data.id;
                if (this.titleType == "登记") {
                  let upData = {
                    id: this.phoneHistalId,
                    eventId: eventId,
                    remark: res.data.reportDescription,
                  };
                  this.$api.ok(upData).then((res) => {
                    if (res.errorcode == "0") {
                      this.parameter = res.data;
                    } else {
                      //this.$message.error(res.msg)
                    }
                  });
                }
                this.titleType = "保存";
                sessionStorage.setItem("newID", eventId);
                this.getDefaultEvent();
                this.$emit("saveEvent");
                this.$emit("typeAddAll", this.typeOfReceipt);
                this.$emit("refreshEvent");
                // this.reload()
                this.isSaveData = true; // isSaveData用来判断是否是保存了事件，保存了事件就不用校验parameter author:hexinting date:2020-11-11
                this.isUpdateForm = false;
                this.isUpdateParameter = false;
              } else {
                let nameTab = "事件接报";
                this.$emit("saveError", nameTab);
                //this.$message.error(res.msg)
              }
            });
            return;
          }
        } else {
          let judge = false;
          this.$emit("emitPath", judge);
        }
      });
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
    getTimes() {
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
      this.ruleForm.incidentTime = clock;
      this.ruleForm.reportedTime = clock;
    },
    //弹出确定
    confirm() {
      let type = this.title;
      switch (type) {
        case "选择区域":
          this.ruleForm.incidenArea = this.eventTree[0].name;
          this.$emit("refreshEvent");
          break;
        case "选择联系人分组":
          this.ruleForm.reportingUnit = this.eventAddressBook[0].name;
          break;
        case "选择事件类型":
          this.ruleForm.incidenType = this.eventType[0].name;
          this.$emit("refreshEvent");
          this.amendParameter();
          let caseIdParameter = sessionStorage.getItem("caseID");
          // console.log('caseIdParameter: ', caseIdParameter);
          break;
        default:
          break;
      }
      this.$refs.eventDialog.clearData(); //刷新子组件数据
      this.addEventDialog = false;
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
    /**
     * @param {type} 没有
     * @return {type} undefined
     * @lastEditor :xuchuangxing
     * @updateTime :2020-110-02 16:49
     * @description：清空事件参数然后让其新增事件
     */
    addEvent() {
      console.log("------------创建新事件-------------");
      let emEventId = sessionStorage.getItem("newID");
      let emCaseId = sessionStorage.getItem("caseID");
      let emEventContent = sessionStorage.getItem("createdEvent");
      this.$emit("setId", emEventId, emCaseId); //清空之前将事件ID传给事件不保存时再次用来存储事件
      this.$confirm("新增将清空以上的内容", "是否新增?", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning",
      })
        .then(() => {
          this.titleType = "新增";
          sessionStorage.removeItem("newID");
          sessionStorage.removeItem("caseID");
          sessionStorage.removeItem("eventTitle"); // 移除旧的缓存标题
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
          this.ruleForm.drillMode = 0; // 接报模式默认为突发事件，洛阳需要加演练事件
          // this.ruleForm.accidentSituation = ""; //清空事故情况 // bug8540 事故情况要删除 author:hexinting date:20201120
          // this.ruleForm.beOnDuty = this.isYangZhou
          //   ? sessionStorage.getItem("displayname")
          //   : ""; //初始化值班员
          this.ruleForm.beOnDuty = sessionStorage.getItem("displayname"); //初始化值班员
          // this.ruleForm.beOnDutyIds = []; //清空值班员id // 注释原因：参数暂时不用了 author:hexinting date:20201111 bug8068
          this.ruleForm.leaderOnDuty = ""; //清空值班领导
          this.ruleForm.leaderOnDutyIds = []; //清空值班领导id
          this.ruleForm.submissionMethod = ""; //清空接报方式
          this.ruleForm.deathToll = ""; //清空死亡人数
          this.ruleForm.bruiseToll = ""; //清空受伤人数
          this.ruleForm.disappearToll = ""; //清空失踪人数
          // this.ruleForm.deathNum = ""; //清空死亡人数 // 注释原因：参数暂时不用了 author:hexinting date:20201111 bug8068
          // this.ruleForm.injuredNum = ""; //清空受伤人数 // 注释原因：参数暂时不用了 author:hexinting date:20201111 bug8068
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
          this.getTimes(); //事发时间和首报时间新增时默认为当前时间
          this.$emit("updateNewID", null); // 清空事件id
          let typeAdd = "新增";
          this.$emit("addType", typeAdd);
          // 获取默认的事件类型子参数
          let data = {
            caseId: 0,
          };
          this.$api.defaultParameters(data).then((res) => {
            if (res.errorcode == "0") {
              console.log(res.data);
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
        })
        .catch(() => {});
    },
    eventReception() {
      let eventId = sessionStorage.getItem("newID");
      if (eventId) {
        let data = {
          eventId,
        };
        this.$api.eventReception(data).then((res) => {
          if (res.errorcode == "0") {
            this.$message.success("事件接报成功");
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        this.$message.error("事件不存在");
      }
    },
    // 显示事件上报弹窗
    eventReport() {
      this.isShowEventReportDialog = true;
    },
    //一键核实
    oneKeyCheck() {
      this.$store.commit("setOverallEvent", this.ruleForm.allCase);
      this.$emit("oneKeyCheck");
    },
    //一键报送
    oneKeySubmission() {
      this.$store.commit("setOverallEvent", this.ruleForm.allCase);
      this.$emit("oneKeySubmission");
    },
    // 获取所属区域的id
    getIncidenAreaId(areaId) {
      let incidenArea = [];
      // console.log('辖区Id', areaId);
      // console.log(
      //     '辖区名字：',
      //     this.ruleForm.incidenArea,
      //     this.jurisdictionData
      // );
      if (
        this.jurisdictionData.filter((item) => item.id === areaId).length > 0
      ) {
        let filterData = this.jurisdictionData.filter(
          (item) => item.id === areaId
        );
        incidenArea.push(filterData[0].id);
        this.ruleForm.incidenArea = incidenArea;
        this.dataALL.incidenArea = incidenArea;
        return incidenArea;
      } else {
        for (let a of this.jurisdictionData) {
          if (a.children && a.children.length > 0) {
            if (a.children.filter((item) => item.id === areaId).length > 0) {
              let filterData = a.children.filter((item) => item.id === areaId);
              incidenArea.push(a.id);
              incidenArea.push(filterData[0].id);
              this.ruleForm.incidenArea = incidenArea;
              this.dataALL.incidenArea = incidenArea;
              return incidenArea;
            } else {
              for (let b of a.children) {
                // console.log('----', b);
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
                    this.dataALL.incidenArea = incidenArea;
                    return incidenArea;
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
                          this.dataALL.incidenArea = incidenArea;
                          return incidenArea;
                        } else {
                          return incidenArea;
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
      //     '辖区名字：',
      //     this.ruleForm.incidenArea,
      //     this.jurisdictionData
      // );
    },
    /**
     * @param {Number} caseClassId 灾害类型id
     * @param {string} caseName 灾害类型名字
     * @returns 无
     * @lastEditor hexinting
     * @lastDate 2020-9-18
     * @description 获取灾害类型
     */
    getCaseClassId(caseClassId, caseName) {
      let incidenType = [];
      // console.log('灾害类型：', caseClassId, caseName);
      // console.log(
      //     '灾害类型：',
      //     this.ruleForm.incidenType,
      //     this.eventTypeData
      // );
      if (
        this.eventTypeData.filter((item) => item.id === caseClassId).length > 0
      ) {
        let filterData = this.eventTypeData.filter(
          (item) => item.id === caseClassId
        );
        incidenType.push(filterData[0].id);
        this.ruleForm.incidenType = incidenType;
        this.dataALL.incidenType = incidenType;

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
        // console.log('----结果---灾害类型：', this.ruleForm.incidenType);
        return incidenType;
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
              this.dataALL.incidenType = incidenType;

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

              // console.log(
              //     '----结果---灾害类型：',
              //     this.ruleForm.incidenType
              // );
              return incidenType;
            } else {
              for (let b of a.children) {
                // console.log('----', b);
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
                    this.dataALL.incidenType = incidenType;

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

                    // console.log(
                    //     '----结果---灾害类型：',
                    //     this.ruleForm.incidenType
                    // );
                    return incidenType;
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
                          this.dataALL.incidenType = incidenType;

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

                          // console.log(
                          //     '----结果---灾害类型：',
                          //     this.ruleForm
                          //         .incidenType
                          // );
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
      console.log("getIncidenType获取的事件类型：", incidenType);
      return incidenType;
    },
    /**
     * @editorName: qinjiaqi
     * @param {type} 没有
     * @return {String} 最后一个地区的名字
     * @description：根据id拼接辖区名字,只获取最后一个地区
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
      console.log("getIncidenArea获取的事件类型：", incidenArea);
      return incidenArea;
    },
    /**
     * @editorName: qinjiaqi
     * @param {type} 没有
     * @return {String} 按格式生成的标题
     * @description：一键生成标题
     */
    generateTheTitle() {
      // console.log(
      //     '辖区名字：',
      //     this.ruleForm.incidenArea,
      //     this.jurisdictionData,
      //     this.jurisdictionData.filter(
      //         item => item.id === this.ruleForm.incidenArea[0]
      //     )
      // );
      // console.log(
      //     '事件类型：',
      //     this.ruleForm.incidenType,
      //     this.eventTypeData,
      //     this.eventTypeData.filter(
      //         item => item.id === this.ruleForm.incidenType[0]
      //     )
      // );
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
      // 如果接报模式为1-演练事件，一键生成时添加标识
      if (this.isLuoYangProject) {
        if (this.ruleForm.drillMode == 1) {
          console.log(this.eventTitleMark);
          this.ruleForm.eventTitle =
            this.eventTitleMark +
            `${oneTime}.${twoTime} ${incidenArea}/${incidenType}`;
        } else {
          this.ruleForm.eventTitle = `${oneTime}.${twoTime} ${incidenArea}/${incidenType}`;
        }
      } else {
        this.ruleForm.eventTitle = `${oneTime}.${twoTime} ${incidenArea}/${incidenType}`;
      }

      this.$message({
        message: "生成成功",
        type: "success",
      });
      this.$refs["ruleForm"].clearValidate(["eventTitle"]);
      // console.log('事件标题', this.ruleForm.eventTitle);
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
    incidenTypeChange(arr) {
      sessionStorage.setItem("caseID", arr[arr.length - 1]);
      this.amendParameter();
      var gettree = (data) => {
        // console.log('data: ', data);
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
      // console.log('this.eventType: ', this.eventType);
    },
    testHandle() {
      this.textareaHeight = document.getElementById(
        "baowenNeiRon"
      ).style.height;
    },
    /**
     * @author: husiyue
     * @return {String} 接报模式
     * @description：接报模式切换监听
     * @param {drillMode} type 0:突发事件；1:演练事件
     */
    getDrillMode() {
      console.log(this.ruleForm.drillMode);
      console.log(this.ruleForm.eventTitle);
      // 标题为空时不添加演练标识，以免出现undefined
      if (this.ruleForm.eventTitle.length > 0) {
        if (this.ruleForm.drillMode == 1) {
          // 是否已有演练标识
          if (this.eventTitleMark.length > 0) {
            this.ruleForm.eventTitle = this.ruleForm.eventTitle;
          } else {
            this.eventTitleMark = "【演练】";
            this.ruleForm.eventTitle =
              this.eventTitleMark + this.ruleForm.eventTitle;
          }
        } else {
          if (this.eventTitleMark.length > 0) {
            this.ruleForm.eventTitle = this.ruleForm.eventTitle.split("】")[1];
            this.eventTitleMark = "";
          } else {
            this.ruleForm.eventTitle = this.ruleForm.eventTitle;
          }
          // this.eventTitleMark = ""
        }
      }

      console.log(this.ruleForm.eventTitle);
      console.log(this.eventTitleMark.length);
    },
  },
};
</script>

<style scoped>
.formContent {
  padding: 20px 20px;
  position: relative;
}

.addButton {
  height: 70px;
  line-height: 70px;
  position: absolute;
  right: 20px;
  width: 100%;
  background-color: white;
  bottom: 0;
  text-align: right;
  text-indent: 40px;
}

#itemCalss .el-form-item__content {
  margin-left: 0 !important;
}

#serial .el-input .el-input__inner:nth-child(1) {
  background-color: black !important;
  color: yellow !important;
}

.el-input.is-disabled .el-input__inner {
  /*overflow: hidden;*/
  /*text-overflow: ellipsis;*/
  white-space: nowrap;
}

.el-input-number--mini {
  width: 193px;
}

.el-select--small {
  width: 100%;
}

.formContent .el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 15px;
}

.el-form--label-left .el-form-item__label {
  letter-spacing: 1px;
  position: relative;
  line-height: 25px;
}

.el-form-item .el-form-item__label:before {
  padding: 0;
  position: absolute;
  left: -10px;
}

.el-form-item__label-wrap {
  margin-left: 15px !important;
}

/*>>> .el-form-item__content {*/
/*  margin-left: 125px !important;*/
/*}*/

#reporter .el-col-10 {
  padding: 0 !important;
}

#reporter .el-col-14 {
  padding-right: 0 !important;
}

#itemCalss .el-form-item__content {
  margin-left: 0 !important;
}

#baowen .el-form-item__content {
  margin-left: 0 !important;
}

#baowenNeiRon >>> .el-form-item__content textarea {
  background-color: #f9f9f9;
  padding-bottom: 40px;
}

#baowen .el-form-item__label:before {
  content: "";
  color: #f56c6c;
  margin-right: 4px;
}

#titleEvent .el-input__inner {
  padding-right: 84px !important;
}

.eventDetail-box {
  position: absolute;
  bottom: 70px;
  left: 50%;
  width: 500px;
  background: #fff;
  margin-left: -250px;
  z-index: 100;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 20px 0;
}

.eventDetail-box-list {
  display: flex;
  line-height: 1;
  text-align: left;
  text-indent: 0;
  padding: 0 15px 5px 15px;
  line-height: 1;
  color: #333;
  font-size: 14px;
  line-height: 30px;
}

.eventDetail-box-list.flex-wrap {
  flex-wrap: wrap;
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

.eventDetail-box-list-half {
  display: flex;
  width: 50%;
}

.eventDetail-box-list-three {
  min-width: 33.33%;
  /*display: flex;*/
}

.oy-number-footer {
  padding-top: 20px;
  text-align: center;
  text-indent: 0;
  line-height: 1;
}

.zengChengFormStyle >>> .is-required > .el-form-item__label {
  color: red !important;
}

.zengChengFormStyle
  >>> .el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:before {
  content: "";
  margin-right: 0;
}
</style>
