<template>
  <div class="SpeechText_wrap">
    <div class="SpeechText_content">
      <header class="SpeechText_header">
        <span>语音转文字</span>
        <img
          alt=""
          src="../../../../../../static/img/Communihistory/close.png"
          @click="close"
        >
      </header>
      <main class="SpeechContent" v-if="!autoOpen">
        <div class="SpeechText_left_origin">
          <div class="SpeechLeft_title">
            <span class="sbs-title">文本框</span>
            <el-button type="text" class="sbs-button"  @click="cellRemark">
              存为电话备注
            </el-button>
          </div>
          <div
            v-loading="loading"
            element-loading-text="转写中"
          >
            <el-input
              ref="copyEle"
              v-model="textarea"
              :rows="14"
              type="textarea"
              placeholder=""
              :readonly="true"
            />
          </div>

          <!-- :readonly="true" -->
        </div>
        <div class="SpeechText_right_origin">
          <div class="sbs-title" style="margin-bottom: 10px">信息摘录</div>
          <div>
            <el-form
              ref="emergencyForm"
              :model="emergencyForm"
              :rules="emergencyFormRules"
              id="elFrom"
              size="small"
              label-position="right"
            >
              <!-- 续保事件关联 -->
              <el-row>
                <el-col :span="24">
                  <el-form-item
                    label="事件关联:"
                    prop="eventCorrelation.caseTitle"
                    label-width="90px"
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
                              emergencyForm.eventCorrelationConfig.eventOptions =
                                [];
                              getEventCorrelationOptions();
                            "
                          />
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
                            v-for="item in emergencyForm.eventCorrelationConfig
                              .eventOptions"
                            :key="item.id"
                            class="evenyEvent"
                            @click="onSelectEventCorrelation(item)"
                          >
                            {{ item.title }}
                          </li>
                          <div class="loadMore">
                            <el-button
                              v-if="
                                emergencyForm.eventCorrelationConfig.loadMore
                              "
                              round
                              icon="iconfont icon-loadMore"
                              size="mini"
                              @click="
                                emergencyForm.eventCorrelationConfig
                                  .currentPage++;
                                getEventCorrelationOptions();
                              "
                            >加载更多</el-button>
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
                        size="small"
                        clearable
                      />
                    </el-popover>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 事件标题 -->
              <el-form-item
                label="事件标题:"
                label-width="90px"
                class="eventTitle"
                prop="eventTitle"
              >
                <el-input
                  v-model="emergencyForm.eventTitle"
                  placeholder="事件标题"
                  size="small"
                />
              </el-form-item>
              <!-- 事发时间和接报时间 -->
              <el-row>
                <el-col :span="12">
                  <el-form-item
                    label="事发时间:"
                    label-width="90px"
                    prop="incidentTime"
                  >
                    <el-date-picker
                      v-model="emergencyForm.incidentTime"
                      type="datetime"
                      placeholder="请选择事发时间"
                      style="width: 186px"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="接报时间:"
                    label-width="90px"
                    prop="reportedTime"
                  >
                    <el-date-picker
                      v-model="emergencyForm.reportedTime"
                      type="datetime"
                      placeholder="请选择接报时间"
                      style="width: 186px"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 事件类型和事件等级 -->
              <el-row>
                <el-col :span="12">
                  <el-form-item
                    label="事件类型:"
                    prop="eventType"
                    label-width="90px"
                  >
                    <el-cascader
                      ref="eventType"
                      v-model.trim="emergencyForm.eventType"
                      :options="emergencyForm.eventTypeOptions"
                      :props="{
                        value: 'id',
                        label: 'name',
                        checkStrictly: true,
                      }"
                      clearable
                      :show-all-levels="false"
                      placeholder="请选择事件类型"
                      class="arrange-style"
                      @change="eventTypeChange"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="报告单位:"
                    label-width="90px"
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
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item
                    label="事故单位:"
                    label-width="90px"
                    prop="accidentUnit"
                  >
                    <el-input
                      size="small"
                      v-model="emergencyForm.accidentUnit"
                      type="text"
                      show-word-limit
                      placeholder="请输入事故单位"
                      class="arrange-style"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="所属区域:"
                    label-width="90px"
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
                      size="small"
                      clearable
                      ref="jurisdiction"
                      :show-all-levels="false"
                      placeholder="请选择所属区域"
                      class="arrange-style"
                      @change="jurisdictionChange"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 事发地点 -->
              <el-form-item
                label="事发地点:"
                label-width="90px"
                prop="incidentLocation"
              >
                <el-input
                  v-model="emergencyForm.incidentLocation"
                  size="small"
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
                label-width="90px"
                prop="fallFigureAddress"
              >
                <!-- prop="fallFigureAddress" -->
                <div style="display: flex; justify-content: space-between">
                  <el-input
                    size="small"
                    type="text"
                    v-model.trim="emergencyForm.fallFigureAddress"
                    show-word-limit
                    :title="emergencyForm.fallFigureAddress"
                    ref="getFocus"
                    placeHolder="请选择落图地点"
                    :style="
                      emergencyForm.eventDealId
                        ? { width: 'calc(100% - 62px)' }
                        : {}
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
                    <el-button size="small" @click="sendSite">发送</el-button>
                  </div>
                </div>
              </el-form-item>
              <!-- 事件要素 -->
              <el-form-item
                label="事件要素:"
                class="eventElements"
                prop="parameter"
                v-if="emergencyForm.parameter"
                label-width="90px"
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
                      <span v-if="item.unit !== ''">{{ item.name }}({{ item.unit }}):</span>
                      <span v-else>{{ item.name }}:</span>
                    </div>
                    <el-input
                      size="mini"
                      v-model.number="item.value"
                      :min="0"
                      label="描述文字"
                      style="width: 79%"
                    />
                  </div>
                  <div v-if="item.type == '文本'" style="width: 250px">
                    <div
                      :title="`${item.name}${
                        item.unit ? `(${item.unit})` : item.unit
                      }`"
                    >
                      <span v-if="item.unit !== ''">{{ item.name }}({{ item.unit }}):</span>
                      <span v-if="item.unit == ''">{{ item.name }}:</span>
                    </div>
                    <el-input
                      type="text"
                      v-model="item.value"
                      size="mini"
                      show-word-limit
                      style="width: 79%"
                    />
                  </div>
                  <div v-if="item.type == '选择'" style="width: 250px">
                    <div
                      :title="`${item.name}${
                        item.unit ? `(${item.unit})` : item.unit
                      }`"
                    >
                      <span v-if="item.unit !== ''">{{ item.name }}({{ item.unit }}):</span>
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
                      />
                    </el-select>
                  </div>
                  <div v-if="item.type == '时间'" style="width: 250px">
                    <div
                      :title="`${item.name}${
                        item.unit ? `(${item.unit})` : item.unit
                      }`"
                    >
                      <span v-if="item.unit !== ''">{{ item.name }}({{ item.unit }}):</span>
                      <span v-if="item.unit == ''">{{ item.name }}:</span>
                    </div>
                    <el-date-picker
                      v-model="item.value"
                      size="mini"
                      format="yyyy-MM-dd HH:mm:ss"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      type="datetime"
                      placeholder="选择日期时间"
                      style="width: 79%"
                    />
                  </div>
                </div>
              </el-form-item>
              <div/>
              <!-- 事故简况 -->
              <el-form-item label="事故简况:" prop="accidentSituation">
                <el-input
                  v-model="emergencyForm.accidentSituation"
                  class="accidentTextarea"
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 8 }"
                />
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
                <el-col
                  :span="24"
                  id="baowen"
                  style="padding-left: 0; padding-right: 0"
                >
                  <el-form-item
                    label="现场处置情况:"
                    id="disposalSituation"
                    prop="disposalSituation"
                  >
                    <el-input
                      type="textarea"
                      v-model="emergencyForm.disposalSituation"
                      :autosize="{ minRows: 3, maxRows: 8 }"
                    />
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
              <el-form-item
                label="其他附件:"
                prop="otherFileList"
                label-width="90px"
              >
                <uploadFile
                  ref="uploadOtherFile"
                  :attachments="emergencyForm.otherFileList"
                  @remove="handleRemoveOtherFile"
                  @success="handleUploadOtherFileSuccess"
                />
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
                }}</span>
              </el-form-item>
              <template v-if="emergencyForm.isExpand">
                <el-form-item label="事发原因:" prop="incidentCause">
                  <el-input
                    v-model="emergencyForm.incidentCause"
                    placeholder="请输入事发原因"
                    size="small"
                  />
                </el-form-item>
                <el-form-item label="已造成后果:" prop="consequences">
                  <el-input
                    v-model="emergencyForm.consequences"
                    placeholder="请输入已造成后果"
                    size="small"
                  />
                </el-form-item>
                <el-form-item
                  label="事件发展趋势:"
                  prop="eventDevelopmentTrend"
                >
                  <el-input
                    v-model="emergencyForm.eventDevelopmentTrend"
                    placeholder="请输入事件发展趋势"
                    size="small"
                  />
                </el-form-item>
                <el-form-item label="已采取措施:" prop="Measures">
                  <el-input
                    v-model="emergencyForm.Measures"
                    placeholder="请输入已采取措施"
                    size="small"
                  />
                </el-form-item>
                <!-- bug14193 隐藏转办人、转办时间、转办部门 -->
                <!-- <el-row :gutter="gutter">
                      <el-col :span="12">
                        <el-form-item label="转办人:">
                          <el-input
                            size="small"
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
                            size="small"
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
                            size="small"
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
            </el-form>
          </div>
        </div>
      </main>
      <!-- 自动打开的语音转文字 -->
      <main class="SpeechContent" v-else>
        <div class="SpeechText_left">
          <div class="sbs-title" style="margin-bottom: 10px">信息摘录</div>
          <div>
            <el-form
              ref="emergencyForm"
              :model="emergencyForm"
              :rules="emergencyFormRules"
              id="elFrom"
              size="small"
              label-position="right"
            >
              <!-- 续保事件关联 -->
              <el-row>
                <el-col :span="24">
                  <el-form-item
                    label="事件关联:"
                    prop="eventCorrelation.caseTitle"
                    label-width="90px"
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
                              emergencyForm.eventCorrelationConfig.eventOptions =
                                [];
                              getEventCorrelationOptions();
                            "
                          />
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
                            v-for="item in emergencyForm.eventCorrelationConfig
                              .eventOptions"
                            :key="item.id"
                            class="evenyEvent"
                            @click="onSelectEventCorrelation(item)"
                          >
                            {{ item.title }}
                          </li>
                          <div class="loadMore">
                            <el-button
                              v-if="
                                emergencyForm.eventCorrelationConfig.loadMore
                              "
                              round
                              icon="iconfont icon-loadMore"
                              size="mini"
                              @click="
                                emergencyForm.eventCorrelationConfig
                                  .currentPage++;
                                getEventCorrelationOptions();
                              "
                            >加载更多</el-button>
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
                        style="width:88%;margin-right:15px;"
                        slot="reference"
                        v-model="emergencyForm.eventCorrelation.caseTitle"
                        placeholder="请选择首报事件关联"
                        size="small"
                        clearable
                      />
                    </el-popover>
                    <el-button  style="font-size:14px;" type="text" class="sbs-button"  @click="saveRemark">
                      保存
                    </el-button>                     
                  </el-form-item>                  
                </el-col>
              </el-row>
              <!-- 事件标题 -->
              <el-form-item
                label="事件标题:"
                label-width="90px"
                class="eventTitle"
                prop="eventTitle"
              >
                <el-input
                  v-model="emergencyForm.eventTitle"
                  placeholder="事件标题"
                  size="small"
                />
              </el-form-item>
              <!-- 事发时间和接报时间 -->
              <el-row>
                <el-col :span="12">
                  <el-form-item
                    label="事发时间:"
                    label-width="90px"
                    prop="incidentTime"
                  >
                    <el-date-picker
                      v-model="emergencyForm.incidentTime"
                      type="datetime"
                      placeholder="请选择事发时间"
                      style="width: 186px"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="接报时间:"
                    label-width="90px"
                    prop="reportedTime"
                  >
                    <el-date-picker
                      v-model="emergencyForm.reportedTime"
                      type="datetime"
                      placeholder="请选择接报时间"
                      style="width: 186px"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 事件类型和事件等级 -->
              <el-row>
                <el-col :span="12">
                  <el-form-item
                    label="事件类型:"
                    prop="eventType"
                    label-width="90px"
                  >
                    <el-cascader
                      ref="eventType"
                      v-model.trim="emergencyForm.eventType"
                      :options="emergencyForm.eventTypeOptions"
                      :props="{
                        value: 'id',
                        label: 'name',
                        checkStrictly: true,
                      }"
                      clearable
                      :show-all-levels="false"
                      placeholder="请选择事件类型"
                      class="arrange-style"
                      @change="eventTypeChange"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="报告单位:"
                    label-width="90px"
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
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item
                    label="事故单位:"
                    label-width="90px"
                    prop="accidentUnit"
                  >
                    <el-input
                      size="small"
                      v-model="emergencyForm.accidentUnit"
                      type="text"
                      show-word-limit
                      placeholder="请输入事故单位"
                      class="arrange-style"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="所属区域:"
                    label-width="90px"
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
                      size="small"
                      clearable
                      ref="jurisdiction"
                      :show-all-levels="false"
                      placeholder="请选择所属区域"
                      class="arrange-style"
                      @change="jurisdictionChange"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 事发地点 -->
              <el-form-item
                label="事发地点:"
                label-width="90px"
                prop="incidentLocation"
              >
                <el-input
                  v-model="emergencyForm.incidentLocation"
                  size="small"
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
                label-width="90px"
                prop="fallFigureAddress"
              >
                <!-- prop="fallFigureAddress" -->
                <div style="display: flex; justify-content: space-between">
                  <el-input
                    size="small"
                    type="text"
                    v-model.trim="emergencyForm.fallFigureAddress"
                    show-word-limit
                    :title="emergencyForm.fallFigureAddress"
                    ref="getFocus"
                    placeHolder="请选择落图地点"
                    :style="
                      emergencyForm.eventDealId
                        ? { width: 'calc(100% - 62px)' }
                        : {}
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
                    <el-button size="small" @click="sendSite">发送</el-button>
                  </div>
                </div>
              </el-form-item>
              <!-- 事件要素 -->
              <el-form-item
                label="事件要素:"
                class="eventElements"
                prop="parameter"
                v-if="emergencyForm.parameter"
                label-width="90px"
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
                      <span v-if="item.unit !== ''">{{ item.name }}({{ item.unit }}):</span>
                      <span v-else>{{ item.name }}:</span>
                    </div>
                    <el-input
                      size="mini"
                      v-model.number="item.value"
                      :min="0"
                      label="描述文字"
                      style="width: 79%"
                    />
                  </div>
                  <div v-if="item.type == '文本'" style="width: 250px">
                    <div
                      :title="`${item.name}${
                        item.unit ? `(${item.unit})` : item.unit
                      }`"
                    >
                      <span v-if="item.unit !== ''">{{ item.name }}({{ item.unit }}):</span>
                      <span v-if="item.unit == ''">{{ item.name }}:</span>
                    </div>
                    <el-input
                      type="text"
                      v-model="item.value"
                      size="mini"
                      show-word-limit
                      style="width: 79%"
                    />
                  </div>
                  <div v-if="item.type == '选择'" style="width: 250px">
                    <div
                      :title="`${item.name}${
                        item.unit ? `(${item.unit})` : item.unit
                      }`"
                    >
                      <span v-if="item.unit !== ''">{{ item.name }}({{ item.unit }}):</span>
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
                      />
                    </el-select>
                  </div>
                  <div v-if="item.type == '时间'" style="width: 250px">
                    <div
                      :title="`${item.name}${
                        item.unit ? `(${item.unit})` : item.unit
                      }`"
                    >
                      <span v-if="item.unit !== ''">{{ item.name }}({{ item.unit }}):</span>
                      <span v-if="item.unit == ''">{{ item.name }}:</span>
                    </div>
                    <el-date-picker
                      v-model="item.value"
                      size="mini"
                      format="yyyy-MM-dd HH:mm:ss"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      type="datetime"
                      placeholder="选择日期时间"
                      style="width: 79%"
                    />
                  </div>
                </div>
              </el-form-item>
              <div/>
              <!-- 事故简况 -->
              <el-form-item label="事故简况:" prop="accidentSituation">
                <el-input
                  v-model="emergencyForm.accidentSituation"
                  class="accidentTextarea"
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 8 }"
                />
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
                <el-col
                  :span="24"
                  id="baowen"
                  style="padding-left: 0; padding-right: 0"
                >
                  <el-form-item
                    label="现场处置情况:"
                    id="disposalSituation"
                    prop="disposalSituation"
                  >
                    <el-input
                      type="textarea"
                      v-model="emergencyForm.disposalSituation"
                      :autosize="{ minRows: 3, maxRows: 8 }"
                    />
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
              <el-form-item
                label="其他附件:"
                prop="otherFileList"
                label-width="90px"
              >
                <uploadFile
                  ref="uploadOtherFile"
                  :attachments="emergencyForm.otherFileList"
                  @remove="handleRemoveOtherFile"
                  @success="handleUploadOtherFileSuccess"
                />
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
                }}</span>
              </el-form-item>
              <template v-if="emergencyForm.isExpand">
                <el-form-item label="事发原因:" prop="incidentCause">
                  <el-input
                    v-model="emergencyForm.incidentCause"
                    placeholder="请输入事发原因"
                    size="small"
                  />
                </el-form-item>
                <el-form-item label="已造成后果:" prop="consequences">
                  <el-input
                    v-model="emergencyForm.consequences"
                    placeholder="请输入已造成后果"
                    size="small"
                  />
                </el-form-item>
                <el-form-item
                  label="事件发展趋势:"
                  prop="eventDevelopmentTrend"
                >
                  <el-input
                    v-model="emergencyForm.eventDevelopmentTrend"
                    placeholder="请输入事件发展趋势"
                    size="small"
                  />
                </el-form-item>
                <el-form-item label="已采取措施:" prop="Measures">
                  <el-input
                    v-model="emergencyForm.Measures"
                    placeholder="请输入已采取措施"
                    size="small"
                  />
                </el-form-item>
                <!-- bug14193 隐藏转办人、转办时间、转办部门 -->
                <!-- <el-row :gutter="gutter">
                      <el-col :span="12">
                        <el-form-item label="转办人:">
                          <el-input
                            size="small"
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
                            size="small"
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
                            size="small"
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
            </el-form>
          </div>          
          <!--  -->
          <!-- :readonly="true" -->
        </div>
        <div class="SpeechText_right">
          <div class="SpeechLeft_title">
            <span class="sbs-title">语音转文字</span>
            <el-button type="text" class="sbs-button"  @click="autoOpenRemark">
              填充备注
            </el-button>            
          </div>
          <div
            style="height: 420px; overflow-y: auto; padding-bottom: 20px"
            ref="audioToTextBox"
          >
            <div
              v-for="(item, index) in isAgentSpeekList"
              :key="index"
              style="font-size: 12px"
            >
                <div
                  v-if="item.from == 2"
                  style="
                    display: flex;
                    justify-content: flex-start;
                    padding-top: 15px;
                  "
                >
                  <span
                    style="
                      display: inline-block;
                      width: 30px;
                      height: 30px;
                      border-radius: 50%;
                      line-height: 30px;
                      font-weight: 500;
                      font-size: 12px;
                      color: rgba(0, 145, 255, 1);
                      background: rgba(235, 248, 254, 1);
                      text-align: center;
                    "
                    >{{ toName }}</span
                  >
                  <span
                    style="
                      width: 75%;
                      text-align: left;
                      display: inline-block;
                      background: rgba(235, 248, 254, 1);
                      padding: 5px;
                      border-radius: 3px;
                      margin-left: 10px;
                    "
                    >{{ item.text }}</span
                  >
                </div>
                <div
                  v-if="item.from == 1"
                  style="
                    display: flex;
                    justify-content: flex-end;
                    padding-top: 15px;
                  "
                >
                  <span
                    style="
                      width: 75%;
                      text-align: left;
                      display: inline-block;
                      background: rgba(237, 255, 242, 1);
                      padding: 5px;
                      border-radius: 3px;
                      margin-right: 10px;
                    "
                    >{{ item.text }}</span
                  >
                  <span
                    style="
                      display: inline-block;
                      width: 30px;
                      height: 30px;
                      line-height: 30px;
                      border-radius: 50%;
                      font-size: 12px;
                      font-weight: 500;
                      color: rgba(11, 210, 149, 1);
                      background: rgba(237, 255, 242, 1);
                      text-align: center;
                    "
                    >我</span
                  >
                </div>
              </div>
            </div>
            <!-- 语音转文字内容下方 -->
            <div style="background-color: #fff; padding-top: 10px;position:relative;right:10px;">
              <el-form ref="form" :model="form" label-width="80px" >
                <el-form-item label="接报备注" prop="caseNote">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 6, maxRows: 6 }"
                    resize="none"
                    v-model="remark"
                  ></el-input>
                </el-form-item>
              </el-form>
            <el-button style="position:absolute;right:0;bottom:-35px;" type="text" class="sbs-button"  @click="saveRemark">
              保存
            </el-button>               
            </div>            
        </div>
      </main>
      <!-- 自动打开的语音转文字 -->
      <footer class="SpeechText_footer">
        <el-button @click="close" class="sbs-button">取消</el-button>
        <el-button
          type="primary"
          @click="submitEmergencyForm"
          class="sbs-button"
          style="margin-right: 20px"
          >创建事件</el-button
        >
      </footer>
    </div>
    <!-- 地图弹窗、 -->
    <LocationDialog ref="LocationDialogRef" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
// 报送单位
import ReportUnit from '@/view/yangZhouEventReports/components/ReportUnit/ReportUnit.vue';
import LocationDialog from '@/views/modules/GarbageClassification/SiteManagement/ClassificationSite/Location/LocationDialog.vue';
import uploadFile from '@/yz_components/upload/uploadFile';
import { getRelations } from '@/assets/js/yz_common.js';

export default {
  name: 'voiceText',
  components: {
    ReportUnit,
    LocationDialog,
    uploadFile,
  },
  data() {
    return {
      remark:'',
      isAgentSpeekList:[
        // {from:1,text:'我是1'},
        // {from:1,text:'1说了一句话'},
        // {from:2,text:'我是2'},
        // {from:2,text:'2说了一句话'},
        // {from:1,text:'1说了一句话'},
        // {from:1,text:'1说了一句话'},
        // {from:1,text:'1说了一句话'},
        // {from:1,text:'1说了一句话'},
        // {from:1,text:'1说了一句话'},
        // {from:2,text:'2说了一句话'},
        // {from:2,text:'2说了一句话'},
        // {from:1,text:'1说了一句话'},
        // {from:2,text:'2说了一句话'},        
      ],
      toName:'',
      autoOpen: false,
      ruleForm: '',
      input: '',
      gutter: 24,
      textarea: '',
      loading: true, // 加载中
      visible: false,
      searchText: '',
      // 表单数据
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
        reportedTime: '',
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
      // 正则
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
    };
  },

  computed: {
    ...mapGetters({
      getTurnToTextLoading: 'getTurnToTextLoading',
      isAgentSpeekList: "getIsAgentSpeekList",
    }),
  },
  watch: {
    isAgentSpeekList: {
      handler(newV, oldV) {
        this.$nextTick(() => {
          let divBox = this.$refs.audioToTextBox;
          console.log(divBox);
          divBox.scrollTop = divBox.scrollHeight;
        });
      },
      deep: true
    },    
    // textarea(newV, old) {
    //   if (newV) {
    //     this.getVoiceText();
    //   }
    // },
    // 解决事件类型级联选择器点击不关闭的问题
    'emergencyForm.eventCorrelation.caseTitle'(newValue, oldValue) {
      if (!newValue) {
        this.fullForm();
      }
    },
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
    /**
     * @author hexinting
     * @date 2020-10-14
     * @description 监听语音转文字过程
     */
    getTurnToTextLoading: {
      deep: true,
      immediate: true,
      handler(newVal) {
        this.loading = newVal || false;
      },
    },
  },
  mounted() {
    this.getEventTypeOptions();
    this.getEventCorrelationOptions();
    this.getEventTitleArea();
  },
  methods: {
    saveRemark() {
      this.$http({
        method: 'post',
        url:
          window.g.ApiUrl + '/eos/history/phone/record',
        data: {
          eventId: this.emergencyForm.eventCorrelation.caseId
            ? this.emergencyForm.eventCorrelation.caseId
            : this.emergencyForm.eventId || 0,
          remark:this.remark,
          guid:localStorage.getItem('2.7guid') || ''
        },
      }).then((res) => {
        if(res.data.code == 0) {
        this.$message({
          message: '保存成功',
          type: 'success',
        })        
        }else {
        this.$message({
          message: res.data.msg,
          type: 'error',
        });          
        }
      });      
    },
    // 接电话语音转文字填充备注
    autoOpenRemark() {
      this.remark = "";
      this.isAgentSpeekList.map(v => {
        this.remark += v.text + "\n";
      });      
    },
    handleUploadOtherFileSuccess(fileList) {
      fileList.forEach((item) => {
        item.fileType = 0; // fileType 文件类型 0是其他文件 1是传真文件
      });
      this.emergencyForm.otherFileList = fileList;
    },

    handleRemoveOtherFile(fileList) {
      fileList.forEach((item) => {
        item.fileType = 1; // fileType 文件类型 0是其他文件 1是传真文件
      });
      this.emergencyForm.otherFileList = fileList;
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
        if (res.errorcode == '0') {
          this.emergencyForm.jurisdictionOptions = res.list;
          const gettree = function (data) {
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
          const gettree = function (data) {
            for (let i = 0; i < data.length; i++) {
              if (!data[i].children || data[i].children.length === 0) {
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
          new Promise((resolve) => {
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
                areaId:
                  this.emergencyForm.jurisdiction[
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
                this.close();
                // 需求432
                // this.$refs.reportUnitRef.setReportingUnitListFromStorage(
                //   this.emergencyForm.reportingUnitName,
                // );
                if(this.autoOpen) {
                  this.$router.push({
                    path: "/yangZhouEventReports",
                  })
                }
              } else {
                this.$message.error(res.msg);
              }
            });
          });
        }
      });
    },
    // 提交
    submitEmergencyForm() {
      if (this.emergencyForm.eventCorrelation.caseId) {
        // 有首报直接进入续报
        this.submitEmergencyFormDealReport();
        // this.$emit('closeVoiceText');
        return false;
      }
      this.$refs.emergencyForm.validate((valid) => {
        if (valid) {
          const data = {
            vcTitle: this.tempEventTitle + this.emergencyForm.eventTitle, // 第一次传标题传辖区加名字，以后只传名字
            dtReportTime: this.emergencyForm.startingTime, // 接报时间
            dtOccurTime: this.$moment(this.emergencyForm.incidentTime).format(
              'YYYY-MM-DD HH:mm:ss',
            ), // 事发时间
            iAreaId:
              this.emergencyForm.jurisdiction[
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
            if (res.errorcode === '0') {
              this.tempEventTitleCount += 1; // 标记是否加入tempEventTitle
              this.emergencyForm.eventId = res.data.id; // 首报id
              this.isFindOrder = false;
              this.submitEmergencyFormDealReport();
              // this.$emit('closeVoiceText'); // 第一次新建事件时，先调用旧的保存事件的接口，再调用保存续报的接口
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
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
     * @description: 事故情况格式化
     * @param {*} data
     * @return {*}
     * @author: qcx
     * @Date: 2021-07-05 16:12:31
     */
    getEventInFormation(data) {
      this.eventInformation = '';
      for (let i = 0; i < data.length; i++) {
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
      const delTime =
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
    // 地图组件
    handleLocation() {
      this.$refs.LocationDialogRef.open({
        longitude: this.longitude,
        latitude: this.latitude,
        address: this.emergencyForm.fallFigureAddress,
        cgcsLongitude: this.cgcsLongitude,
        cgcsLatitude: this.cgcsLatitude,
      }).then(
        ({ longitude, latitude, address, cgcsLongitude, cgcsLatitude }) => {
          this.longitude = longitude;
          this.latitude = latitude;
          this.emergencyForm.fallFigureAddress = address;
          this.cgcsLatitude = cgcsLatitude;
          this.cgcsLongitude = cgcsLongitude;
        },
      );
    },
    /**
     * @description: 改变辖区的回调
     * @param {*} arr
     * @return {*}
     * @author: qcx
     * @Date: 2021-07-05 16:08:08
     */
    jurisdictionChange(arr) {
      this.emergencyForm.jurisdiction = arr;
      this.tempEventTitle = ''; // 先清空，不然会拼接
      if (this.tempEventTitleCount === 0)
        // 第一次的辖区存起来
        // this.tempEventTitle = this.getJurisdictionChange(arr);
        this.tempEventTitle =
          this.$refs.jurisdiction.getCheckedNodes()[0].label;
      console.log('所属区域', this.emergencyForm.jurisdiction);
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
      const gettree = (data) => {
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
     * @description: 选择关联事件
     * @param {*} obj
     * @return {*}
     * @author: qcx
     * @Date: 2021-07-05 16:04:46
     */
    onSelectEventCorrelation(obj) {
      this.emergencyForm.eventCorrelationConfig.visible = false; // 收起下拉框
      if (obj) {
        this.emergencyForm.eventCorrelation.caseTitle = obj.title; // 首报标题
        this.emergencyForm.eventCorrelation.caseId = obj.id; // 首报id
        // 系统上报不需要拿选中事件的最新续报
        if (1) {
          let data = {
            eventId: obj.id, // 事件ID
          };
          this.$api.findEventDealList(data).then((res) => {
            this.emergencyForm.jurisdiction = ''; // 所属区域
            this.emergencyForm.eventTitle = ''; // 事件标题
            this.emergencyForm.parameter = ''; // 事件要素
            this.emergencyForm.eventType = ''; // 事件类型
            this.emergencyForm.eventGrade = ''; // 事件等级
            // this.emergencyForm.incidentTime = ''; // 事发时间
            // this.emergencyForm.incidentLocation = ''; // 事发地点
            this.emergencyForm.reportingUnit = ''; // 报告单位
            this.emergencyForm.contactNumber = ''; // 联系电话
            // this.emergencyForm.accidentSituation = ''; // 事故情况
            this.emergencyForm.faxFileList = []; // 传真附件
            this.emergencyForm.otherFileList = []; // 其他附件
            this.emergencyForm.incidentCause = ''; // 事发原因
            // this.emergencyForm.consequences = ''; // 已造成后果
            this.emergencyForm.eventDevelopmentTrend = ''; // 事件发展趋势
            this.emergencyForm.Measures = ''; // 已采取措施
            this.emergencyForm.fallFigureAddress = ''; // 落图地点
            this.emergencyForm.matterTime = ''; // 转办时间
            this.emergencyForm.matterBranch = ''; // 转办部门
            this.emergencyForm.iComplaintOprid = ''; // 转办人
            this.emergencyForm.matterTrun = ''; // 转办人的姓名
            // this.emergencyForm.disposalSituation = ''; // 处置情况
            this.emergencyForm.accidentUnit = ''; // 事故单位
            this.emergencyForm.reportedTime = ''; // 接报单位
            if (res.errorcode === 0) {
              if (res.data && res.data.length > 0) {
                let arr = res.data;
                arr = arr[arr.length - 1];

                // this.emergencyForm.jurisdiction = this.getIncidenAreaId(
                //   arr.areaId,
                // ); // 所属区域
                this.emergencyForm.eventTitle = arr.title; // 事件标题
                this.emergencyForm.parameter = arr.eventParams; // 事件要素
                this.emergencyForm.eventType =
                  this.emergencyForm.eventType || arr.caseClassId; // 事件类型
                this.emergencyForm.eventGrade = arr.eventLevel; // 事件等级
                this.emergencyForm.incidentTime =
                  this.emergencyForm.incidentTime || arr.occurTime; // 事发时间
                this.emergencyForm.reportedTime = arr.reportTime; // 报送时间
                this.emergencyForm.incidentLocation =
                  this.emergencyForm.incidentLocation || arr.address; // 事发地点
                this.emergencyForm.reportingUnit = arr.reportDepartId; // 报告单位
                this.emergencyForm.reportingUnitName = arr.department; // 报告单位
                this.emergencyForm.contactNumber = arr.dealPhone; // 联系电话
                this.emergencyForm.accidentSituation =
                  this.emergencyForm.accidentSituation || arr.reportDescription; // 事故情况
                arr.attachments.forEach((item) => {
                  if (item.fileType == 1) {
                    this.emergencyForm.faxFileList.push(item);
                  } else {
                    this.emergencyForm.otherFileList.push(item);
                  }
                });
                this.emergencyForm.incidentCause = arr.occurReason; // 事发原因
                this.emergencyForm.consequences =
                  this.emergencyForm.consequences || arr.consequences; // 已造成后果
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
                this.emergencyForm.disposalSituation =
                  this.emergencyForm.disposalSituation || arr.disposalSituation; // 处置情况
                this.emergencyForm.accidentUnit = arr.accidentUnit; // 事故单位
              }
            }
          });
        }
      }

      // sessionStorage.setItem('eventCorrelationId',JSON.stringify(obj))
    },
    // 清空表单
    fullForm() {
      this.$refs['emergencyForm'].resetFields();
      // this.emergencyForm.jurisdiction = ''; // 所属区域
      // this.emergencyForm.eventTitle = ''; // 事件标题
      // this.emergencyForm.parameter = ''; // 事件要素
      // this.emergencyForm.eventType = ''; // 事件类型
      // this.emergencyForm.eventGrade = ''; // 事件等级
      // this.emergencyForm.incidentTime = ''; // 事发时间
      // this.emergencyForm.incidentLocation = ''; // 事发地点
      this.emergencyForm.reportingUnitName = ''; // 报告单位
      // this.emergencyForm.contactNumber = ''; // 联系电话
      // this.emergencyForm.accidentSituation = ''; // 事故情况
      // this.emergencyForm.faxFileList = []; // 传真附件
      // this.emergencyForm.otherFileList = []; // 其他附件
      // this.emergencyForm.incidentCause = ''; // 事发原因
      // this.emergencyForm.consequences = ''; // 已造成后果
      // this.emergencyForm.eventDevelopmentTrend = ''; // 事件发展趋势
      // this.emergencyForm.Measures = ''; // 已采取措施
      // this.emergencyForm.fallFigureAddress = ''; // 落图地点
      // this.emergencyForm.matterTime = ''; // 转办时间
      // this.emergencyForm.matterBranch = ''; // 转办部门
      // this.emergencyForm.iComplaintOprid = ''; // 转办人
      // this.emergencyForm.matterTrun = ''; // 转办人的姓名
      // this.emergencyForm.disposalSituation = ''; // 处置情况
      // this.emergencyForm.accidentUnit = ''; // 事故单位
      // this.emergencyForm.reportedTime = ''; // 接报单位
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
        if (res.errorcode == 0) {
          this.emergencyForm.eventCorrelationConfig.eventOptions.push(
            ...res.data.data,
          );
          // this.eventCorrelationConfig.loadMore =
          //   res.data.data.length == 0 ? false : true;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // copyContent() {
    //   let ele = this.$refs.copyEle;
    //   ele.select(); // 选择对象
    //   document.execCommand('Copy'); // 执行浏览器复制命令
    //   this.$message({
    //     message: '已复制到剪切板',
    //     type: 'success',
    //   });
    // },
    // 存为电话备注
    cellRemark() {
      if (this.textarea) {
        this.$emit('cellRemark', { remark: this.textarea });
        this.$emit('closeVoiceText', { remark: this.textarea });
        this.$message({
          message: '已存为电话备注',
          type: 'success',
        });
      } else {
        this.$message({
          message: '当前文本内容为空',
          type: 'error',
        });
      }
    },
    close() {
      this.fullForm();
      this.$emit('closeVoiceText');
    },
    // 语音转换文字
    async getVoiceText() {
      const request = {
        method: 'GET',
        baseURL: window.SITE_CONFIG.cloudUrl,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        url: '/analysis/analysis',
        params: {
          content: this.textarea,
        },
      };
      try {
        const response = await this.$http(request);
        if (response.data.errorCode === 0) {
          this.emergencyForm.incidentLocation = response.data.data.address;
          this.emergencyForm.consequences = response.data.data.influence;
          this.emergencyForm.accidentSituation =
            response.data.data.eventContent;
          this.emergencyForm.eventType = response.data.data.eventTypeId;
          this.emergencyForm.incidentTime = response.data.data.time;
          this.emergencyForm.disposalSituation = response.data.data.disposal;
        } else {
          throw Error(
            `错误代码${response.data.errorCode}，${response.data.msg}`,
          );
        }
      } catch (err) {
        this.$message.error(`$语音转换失败：${err}`);
      } finally {
        this.loading = false;
      }
    },
  },

};
</script>

<style scoped lang="scss">
.eventList {
  padding-left: 0;
  max-height: 190px;
  overflow-y: scroll;
  margin-bottom: 0;
  list-style-type: none;
}
.eventList .evenyEvent {
  padding: 10px 20px;
}
.eventList .evenyEvent:hover {
  background-color: #f4f4f4;
}
.eventList .loadMore {
  text-align: center;
  margin-top: 8px;
}
.SpeechContent {
  display: flex;
}
.SpeechLeft_title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  el-button {
    width: 72px;
    height: 17px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #0091ff;
    line-height: 17px;
  }
}
#elFrom >>> .el-form-item__label {
  font-size: 12px;
}
.SpeechText_right {
  display: inline-block;
  width: 45%;
  height: 654px;
  box-sizing: border-box;
  border-right: 1px solid rgba(221, 222, 225, 1);
  border-bottom: 1px solid rgba(221, 222, 225, 1);
  padding: 16px;
}
.SpeechText_right_origin {
  width: 60%;
  height: 654px;
  background: #fff;
  padding: 10px 10px 0 10px;
  overflow-y: scroll;
  border-bottom: 1px solid rgba(221, 222, 225, 1);
  display: inline-block;
  box-sizing: border-box;
  padding: 16px;
}

.SpeechText_wrap {
  display: flex;
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.SpeechText_content {
  width: 1000px;
  height: 760px;
  background: rgba(255, 255, 255, 1);
  border-radius: 7px;
  display: flex;
  flex-direction: column;
}
.SpeechText_header {
  width: 100%;
  height: 56px;
  background: rgba(241, 244, 246, 1);
  border-radius: 7px 7px 0px 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 28px;
  box-sizing: border-box;
}
.SpeechText_header > span {
  font-size: 18px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
}
.SpeechText_header > img {
  cursor: pointer;
}
.SpeechText_content main {
  flex: 1;
}
.SpeechText_left {
  width: 60%;
  height: 654px;
  background: #fff;
  padding: 10px 10px 0 10px;
  overflow-y: scroll;
  display: inline-block;
  border-bottom: 1px solid rgba(221, 222, 225, 1);
  box-sizing: border-box;
  padding: 16px;  
}
.SpeechText_left /deep/ .el-textarea__inner {
  height: 592px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  font-size: 17px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  box-sizing: border-box;
  text-align: left;
  resize: none;
}

.SpeechText_left_origin {
  display: inline-block;
  width: 40%;
  box-sizing: border-box;
  border-right: 1px solid rgba(221, 222, 225, 1);
  border-bottom: 1px solid rgba(221, 222, 225, 1);
  padding: 16px;
}
.SpeechText_left_origin /deep/ .el-textarea__inner {
  height: 592px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  font-size: 17px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  box-sizing: border-box;
  text-align: left;
  resize: none;
}
.SpeechText_footer {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  box-sizing: border-box;
}
</style>
