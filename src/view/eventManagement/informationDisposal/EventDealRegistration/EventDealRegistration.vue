<!-- 事件登记表单:todo还未完成 -->
<template>
  <div class="event-deal-registration-container">
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
              v-model="emergencyForm.eventCorrelationConfig.visible"
              placement="bottom"
              popper-class="eventOptions"
            >
              <div class="eventSearch">
                <el-input
                  v-model="emergencyForm.eventCorrelationConfig.searchText"
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
                  />
                </el-input>
              </div>
              <template
                v-if="
                  emergencyForm.eventCorrelationConfig.eventOptions.length > 0
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
                      v-if="emergencyForm.eventCorrelationConfig.loadMore"
                      round
                      icon="iconfont icon-loadMore"
                      size="mini"
                      @click="
                        emergencyForm.eventCorrelationConfig.currentPage++;
                        getEventCorrelationOptions();
                      "
                    >
                      加载更多
                    </el-button>
                    <div v-else>
                      暂无更多数据
                    </div>
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
              />
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
        />
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
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="接报时间:"
              label-width="83px"
              prop="startingTime"
            >
              <el-date-picker
                v-model="emergencyForm.startingTime"
                type="datetime"
                placeholder="请选择接报时间"
                class="arrange-style"
              />
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-row>
      <!-- 事件类型和事件等级 -->
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="事件类型:" prop="eventType" label-width="83px">
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
            />
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
                  emergencyForm.reportingUnitName = val;
                }
              "
              @select="
                (val) => {
                  emergencyForm.reportingUnitName = val;
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
              v-model="ruleForm.accidentUnit"
              size="big"
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
            label-width="83px"
            prop="jurisdiction"
          >
            <el-cascader
              ref="jurisdiction"
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
        label-width="83px"
        prop="incidentLocation"
      >
        <el-input
          ref="getFocus"
          v-model="emergencyForm.incidentLocation"
          size="big"
          placeholder="请选择事发地点"
        >
          <i
            slot="suffix"
            class="el-icon-location-information el-input__icon"
            style="cursor: pointer; color: rgb(64, 158, 255)"
            @click="handleLocation"
          />
        </el-input>
      </el-form-item>
      <el-form-item
        label="落图地点:"
        label-width="83px"
        prop="fallFigureAddress"
      >
        <div style="display: flex; justify-content: space-between">
          <el-input
            ref="getFocus"
            v-model.trim="emergencyForm.fallFigureAddress"
            :title="emergencyForm.fallFigureAddress"
            :style="isSendSite ? { width: 'calc(100% - 62px)' } : {}"
            size="big"
            type="text"
            show-word-limit
            placeholder="请选择落图地点"
          >
            <template slot="append">
              <el-button
                size="mini"
                @click="location"
              >
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
          <div
            v-if="isSendSite"
            class="submit_btn"
          >
            <el-button
              size="big"
              @click="sendSite"
            >
              发送
            </el-button>
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
                    />
                  </el-form-item>
                </el-col> -->
      <!-- 事件要素 -->
      <el-form-item
        v-if="emergencyForm.parameter.length > 0"
        label="事件要素:"
        class="eventElements"
        prop="parameter"
        label-width="83px"
      >
        <div
          v-for="(item, index) in emergencyForm.parameter"
          :key="index"
          style="margin-right: 3%"
        >
          <div
            v-if="item.type == '数字'"
            style="width: 250px"
          >
            <div
              :title="`${item.name}${item.unit ? `(${item.unit})` : item.unit}`"
            >
              <span
                v-if="item.unit !== ''"
              >
                {{ item.name }}({{ item.unit }}):
              </span>
              <span v-else>{{ item.name }}:</span>
            </div>
            <el-input
              v-model.number="item.value"
              size="mini"
              :min="0"
              label="描述文字"
              style="width: 79%"
            />
          </div>
          <div
            v-if="item.type == '文本'"
            style="width: 250px"
          >
            <div
              :title="`${item.name}${item.unit ? `(${item.unit})` : item.unit}`"
            >
              <span
                v-if="item.unit !== ''"
              >
                {{ item.name }}({{ item.unit }}):
              </span>
              <span v-if="item.unit == ''">{{ item.name }}:</span>
            </div>
            <el-input
              v-model="item.value"
              type="text"
              size="mini"
              show-word-limit
              style="width: 79%"
            />
          </div>
          <div
            v-if="item.type == '选择'"
            style="width: 250px"
          >
            <div
              :title="`${item.name}${item.unit ? `(${item.unit})` : item.unit}`"
            >
              <span
                v-if="item.unit !== ''"
              >
                {{ item.name }}({{ item.unit }}):
              </span>
              <span v-else>{{ item.name }}:</span>
            </div>
            <el-select
              v-model="item.value"
              size="mini"
              placeholder="请选择"
            >
              <el-option
                v-for="(items, i) in item.struct"
                :key="i"
                :value="items"
              />
            </el-select>
          </div>
          <div
            v-if="item.type == '时间'"
            style="width: 250px"
          >
            <div
              :title="`${item.name}${item.unit ? `(${item.unit})` : item.unit}`"
            >
              <span
                v-if="item.unit !== ''"
              >
                {{ item.name }}({{ item.unit }}):
              </span>
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
      <!-- 事故简况 -->
      <el-form-item
        label="事故简况:"
        prop="accidentSituation"
      >
        <el-input
          v-model="emergencyForm.accidentSituation"
          class="accidentTextarea"
          type="textarea"
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
          <el-link
            type="primary"
            @click="eventMessage()"
          >
            生成事件报文
          </el-link>
        </div>
      </el-form-item>
      <el-row
        :gutter="gutter"
        style="margin: 0"
      >
        <el-col
          id="baowen" 
          :span="24"
          style="padding-left: 0"
        >
          <el-form-item
            id="disposalSituation"
            label="现场处置情况:"
            label-width="114px"
          >
            <el-input
              v-model="emergencyForm.disposalSituation"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 8 }"
              @mouseover.native="testHandle"
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
        >
          {{
            emergencyForm.isExpand
              ? '收起更多拓展信息>>>'
              : '展开查看更多拓展信息>>>'
          }}
        </span>
      </el-form-item>
      <template v-if="emergencyForm.isExpand">
        <el-form-item
          label="事发原因:"
          prop="incidentCause"
        >
          <el-input
            v-model="emergencyForm.incidentCause"
            placeholder="请输入事发原因"
            size="big"
          />
        </el-form-item>
        <el-form-item label="已造成后果:" prop="consequences">
          <el-input
            v-model="emergencyForm.consequences"
            placeholder="请输入已造成后果"
            size="big"
          />
        </el-form-item>
        <el-form-item label="事件发展趋势:" prop="eventDevelopmentTrend">
          <el-input
            v-model="emergencyForm.eventDevelopmentTrend"
            placeholder="请输入事件发展趋势"
            size="big"
          />
        </el-form-item>
        <el-form-item label="已采取措施:" prop="Measures">
          <el-input
            v-model="emergencyForm.Measures"
            placeholder="请输入已采取措施"
            size="big"
          />
        </el-form-item>
        <!-- bug14193 隐藏转办人、转办时间、转办部门 -->
        <!-- <el-row :gutter="gutter">
          <el-col :span="12">
            <el-form-item label="转办人:">
              <el-input
                v-model.trim="emergencyForm.matterTrun"
                size="big"
                type="text"
                clearable
                show-word-limit
                disabled
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="转办时间:">
              <el-date-picker
                v-model.trim="emergencyForm.matterTime"
                size="big"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00"
                style="float: left; width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="gutter">
          <el-col :span="24">
            <el-form-item label="转办部门:">
              <el-input
                v-model.trim="emergencyForm.matterBranch"
                size="big"
                type="text"
                clearable
                show-word-limit
              >
                <template
                  slot="append"
                >
                  <el-button @click="toHold">
                    选择
                  </el-button>
                </template>
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
        >
          立即保存
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import uploadFile from '@/yz_components/upload/uploadFile';
import ReportUnit from '@/view/yangZhouEventReports/components/ReportUnit/ReportUnit.vue';
import { getRelations, deepCompare } from '@/assets/js/yz_common.js';
import Location from '@/components/loction/loction'; // 定位

export default {
  components: {
    uploadFile,
    Location,
    // 报告单位
    ReportUnit,
  },
  data() {
    return {
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
            trigger: ['blur', 'change'],
          },
        ],
      },
    };
  },
  methods: {
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
      this.emergencyForm.startingTime = ''; // 首报时间
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
      // 转到事件登记
      this.eventEntering();
    },
  },
};
</script>
<style lang="scss">
.event-deal-registration-container {
}
</style>
