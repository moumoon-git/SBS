<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    width="1700px"
    :destroy-on-close="true"
    :before-close="handleClose"
    center
  >
    <el-row>
      <el-col :span="7" style="height: 790px;">
        <div
          style="width: 100%;text-align: initial;height: 40px;display: flex;align-items: center;"
        >

          <span class="header-title">传真原件</span>
        </div>
        <iframe
          :src="faxPreviewPath"
          width="100%"
          height="90%"
          frameborder="no"
          border="0"
          marginwidth="0"
          marginheight="0"
          scrolling="no"
          allowtransparency="yes"
          style="margin: auto;overflow: auto;"
        ></iframe>
        <div
          v-if="!faxPreviewPath"
          style="width: 90%;background: url('/static/img/faxBack.png') center no-repeat;height: 88%;margin: auto;overflow: auto;"
        ></div>
      </el-col>
      <el-col
        :span="7"
        class="imgTfTx"
        style="height: 790px;border-left: 1px solid #DCDFE6;border-right: 1px solid #DCDFE6;overflow: auto;"
      >
        <!-- 注释原因：bug13143 公司测试环境：突发事件处置表单，ocr窗口未显示完整。因样式不一样，所以使用了一个新的组件 20210705 -->
        <!-- <imgToText
          ref="imgToText"
          :faxId="tableRow.id"
          :isSequentialRotationIn="true"
          @sequentialRotationIn="sequentialRotationIn"
        ></imgToText> -->
        <NewImgToText
          ref="imgToText"
          :faxId="tableRow.id"
          :isSequentialRotationIn="true"
          @sequentialRotationIn="sequentialRotationIn"/>
      </el-col>
      <el-col
        :span="10"
        style="height: 790px;overflow: auto;box-sizing: border-box;padding: 0px 2%;"
      >
        <div
          style="width: 100%;text-align: initial;height: 60px;display: flex;align-items: center;position: relative;"
        >
          <el-radio-group v-model="tabPosition" style="margin-left: 3%;">
            <el-radio-button label="信息登记"></el-radio-button>
            <el-radio-button label="信息报送"></el-radio-button>
          </el-radio-group>
          <span
            style="color: rgb(64, 158, 255);font-weight: bolder;position: absolute;right: 3%;cursor: pointer;"
            @click="tabPosition='查看报送历史'" v-if="historyRecordEventId"
          >查看报送历史</span>
        </div>
        <div style="width: 100%;text-align: initial;" v-if="tabPosition=='信息登记'">
          <el-form :inline="true" :model="faxTypeForm" class="demo-form-inline">
            <!-- 传真类型 -->
            <el-form-item label="传真类型:">
              <el-radio-group v-model="faxTypeForm.faxType" size="mini" @change="faxTypeChange">
                <el-radio label="突发事件">突发事件</el-radio>
                <el-radio label="三防响应">三防响应</el-radio>
                <el-radio label="领导批示">领导批示</el-radio>
                <el-radio label="通知及其他">通知及其他</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <!-- 突发事件的表单 -->
          <el-form
            ref="emergencyForm"
            :model="emergencyForm"
            :rules="emergencyFormRules"
            v-if="faxTypeForm.faxType=='突发事件'"
            class="emergencyForm"
          >
            <!-- 续保事件关联 -->
            <el-form-item label="首报事件关联:" prop="eventCorrelation.caseTitle">
              <el-popover
                placement="bottom"
                v-model="emergencyForm.eventCorrelationConfig.visible"
                popper-class="eventOptions"
              >
                <div class="eventSearch">
                  <el-input
                    v-model="emergencyForm.eventCorrelationConfig.searchText"
                    placeholder="请输入关键字"
                    size="small"
                  >
                    <i
                      slot="suffix"
                      class="el-input__icon el-icon-search"
                      @click="emergencyForm.eventCorrelationConfig.currentPage = 1;emergencyForm.eventCorrelationConfig.eventOptions = [];getEventCorrelationOptions();"
                    ></i>
                  </el-input>
                </div>
                <template v-if="emergencyForm.eventCorrelationConfig.eventOptions.length > 0">
                  <ul class="eventList">
                    <li
                      v-for="item in emergencyForm.eventCorrelationConfig.eventOptions"
                      :key="item.id"
                      class="evenyEvent"
                      @click="onSelectEventCorrelation(item)"
                      :style="selectEventCorrelationStyle"
                    >{{ item.title }}</li>
                    <div class="loadMore">
                      <el-button
                        round
                        icon="iconfont icon-loadMore"
                        size="mini"
                        @click="emergencyForm.eventCorrelationConfig.currentPage++;getEventCorrelationOptions();"
                        v-if="emergencyForm.eventCorrelationConfig.loadMore"
                      >加载更多</el-button>
                      <div v-else>暂无更多数据</div>
                    </div>
                  </ul>
                </template>
                <template v-else>
                  <div style="text-align: center; margin-top: 10px">暂无数据</div>
                </template>

                <el-input
                  slot="reference"
                  v-model="emergencyForm.eventCorrelation.caseTitle"
                  readonly
                  placeholder="请选择首报事件关联"
                  style="width:81%;"
                  size="small"
                ></el-input>
              </el-popover>
            </el-form-item>
            <!-- 事件标题 -->
            <el-form-item label="事件标题:" class="eventTitle">
              <el-form-item prop="jurisdiction">
                <el-cascader
                  v-model.trim="emergencyForm.jurisdiction"
                  :options="emergencyForm.jurisdictionOptions"
                  :props="{value: 'id',label: 'townName',checkStrictly: true, children: 'children'}"
                  :show-all-levels="false"
                  clearable
                  ref="jurisdiction"
                  placeholder="请选择所属区域"
                  style="width: 104%;"
                ></el-cascader>
              </el-form-item>
              <el-form-item prop="eventTitle">
                <el-input v-model="emergencyForm.eventTitle" placeholder="事件标题" style="width: 127%;margin-left: 23px"></el-input>
              </el-form-item>
            </el-form-item>
            <!-- 事件类型和事件等级 -->
            <el-form-item>
              <el-col :span="12">
                <el-form-item label="事件类型:" prop="eventType">
                  <el-cascader
                    v-model.trim="emergencyForm.eventType"
                    :options="emergencyForm.eventTypeOptions"
                    ref="eventType"
                    :props="{value: 'id',label: 'name',checkStrictly: true}"
                    clearable
                    style="width: 70%"
                    :show-all-levels="false"
                    placeholder="请选择事件类型"
                    @change="eventTypeChange"
                  ></el-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="事件等级:" prop="eventGrade">
                  <el-select
                    v-model="emergencyForm.eventGrade"
                    placeholder="请选择事件等级"
                    style="width:70%;"
                    @change="eventGradeChange"
                  >
                    <el-option
                      v-for="item in emergencyForm.eventGradeOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-form-item>
            <!-- 事发时间和首报时间 -->
            <el-form-item>
              <el-col :span="12">
                <el-form-item label="事发时间:" prop="incidentTime">
                  <el-date-picker
                    v-model="emergencyForm.incidentTime"
                    type="datetime"
                    style="width:70%;"
                    placeholder="请选择事发时间"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="首报时间:" prop="startingTime">
                  <el-date-picker
                    v-model="emergencyForm.startingTime"
                    type="datetime"
                    style="width:70%;"
                    placeholder="请选择首报时间"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
            <!-- 事发地点 -->
            <el-form-item label="事发地点:" prop="incidentLocation">
              <el-input
                v-model="emergencyForm.incidentLocation"
                placeholder="请选择事发地点"
                style="width:83.3%;"
              >
                <i
                  class="el-icon-location-information el-input__icon"
                  slot="suffix"
                  style="cursor: pointer;color: rgb(64, 158, 255);"
                  @click="handleLocation"
                ></i>
              </el-input>
            </el-form-item>
            <!-- 报告单位和联系电话 -->
            <el-form-item>
              <el-col :span="12">
                <el-form-item label="报告单位:" prop="reportingUnit">
                  <!-- 3.0需求432 20210805 -->
                  <ReportUnit
                    ref="reportUnitRef"
                    :unit="emergencyForm.reportingUnitName"
                    :placeholder="'请输入报告单位'"
                    style="width: 70%;float:left;"
                    @input="(val) => {this.emergencyForm.reportingUnitName = val}"
                    @select="(val) => {this.emergencyForm.reportingUnitName = val}"
                  />
                  <!-- 注释原因：3.0需求432 20210805 -->
                  <!-- <el-cascader
                    v-model.trim="emergencyForm.reportingUnit"
                    :options="emergencyForm.reportingUnitOptions"
                    ref="reportingUnit"
                    :props="{value: 'id',label: 'name',checkStrictly: true}"
                    clearable
                    style="width: 70%"
                    :show-all-levels="false"
                    placeholder="请选择报告单位"
                    @change="reportingUnitChange"
                  ></el-cascader> -->
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系电话:" prop="contactNumber">
                  <el-input
                    v-model="emergencyForm.contactNumber"
                    placeholder="请输入联系电话"
                    style="width:69.5%;"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
            <!-- 事件要素 -->
            <el-form-item
              label="事件要素:"
              class="eventElements"
              prop="parameter"
              v-if="emergencyForm.parameter.length!=0"
            >
              <div
                v-for="(item, index) in emergencyForm.parameter"
                :key="index"
                style="margin-right:3%;"
              >
                <div v-if="item.type == '数字'">
                  <div
                    :title="`${item.name}${
                        item.unit ? `(${item.unit})` : item.unit
                        }`"
                  >
                    <span v-if="item.unit !== ''">{{ item.name }}({{ item.unit }}):</span>
                    <span v-else>{{ item.name }}:</span>
                  </div>
                  <el-input size="mini" v-model.number="item.value" :min="0" label="描述文字"></el-input>
                </div>
                <div v-if="item.type == '文本'" style="width: 150px">
                  <div
                    :title="`${item.name}${
                        item.unit ? `(${item.unit})` : item.unit
                        }`"
                  >
                    <span v-if="item.unit !== ''">{{ item.name }}({{ item.unit }}):</span>
                    <span v-if="item.unit == ''">{{ item.name }}:</span>
                  </div>
                  <el-input type="text" size="mini" v-model="item.value" show-word-limit></el-input>
                </div>
                <div v-if="item.type == '选择'">
                  <div
                    :title="`${item.name}${
                        item.unit ? `(${item.unit})` : item.unit
                        }`"
                  >
                    <span v-if="item.unit !== ''">{{ item.name }}({{ item.unit }}):</span>
                    <span v-else>{{ item.name }}:</span>
                  </div>
                  <el-select size="mini" v-model="item.value" placeholder="请选择">
                    <el-option v-for="(items, i) in item.struct" :key="i" :value="items"></el-option>
                  </el-select>
                </div>
                <div v-if="item.type == '时间'">
                  <div
                    :title="`${item.name}${
                        item.unit ? `(${item.unit})` : item.unit
                        }`"
                  >
                    <span v-if="item.unit !== ''">{{ item.name }}({{ item.unit }}):</span>
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
            </el-form-item>
            <!-- 事故情况 -->
            <el-form-item label="事故情况:" prop="accidentSituation">
              <el-input
                type="textarea"
                v-model="emergencyForm.accidentSituation"
                style="width:83%;"
              ></el-input>
            </el-form-item>
            <!-- 传真附件 -->
            <el-form-item label="传真附件:" prop="faxFileList">
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
            </el-form-item>
            <!-- 其他附件 -->
            <el-form-item label="其他附件:" prop="otherFileList">
              <uploadFile
                ref="uploadOtherFile"
                :isShowTitle="false"
                :attachments="emergencyForm.otherFileList"
                @remove="handleRemoveOtherFile"
                @success="handleUploadOtherFileSuccess"
                @clickFile="downloadFile"
              ></uploadFile>
            </el-form-item>
            <el-form-item style="height:47px;margin-bottom: initial;">
              <span
                style="color: rgb(64, 158, 255);font-weight: bolder;position: absolute;right: 3%;cursor: pointer;"
                @click="emergencyForm.isExpand=!emergencyForm.isExpand"
              >{{emergencyForm.isExpand?'收起更多拓展信息>>>':'展开查看更多拓展信息>>>'}}</span>
            </el-form-item>
            <el-form-item label="事发原因:" v-if="emergencyForm.isExpand" prop="incidentCause">
              <el-input
                v-model="emergencyForm.incidentCause"
                placeholder="请输入事发原因"
                style="width:84%;"
              ></el-input>
            </el-form-item>
            <el-form-item label="已造成后果:" v-if="emergencyForm.isExpand" prop="consequences">
              <el-input
                v-model="emergencyForm.consequences"
                placeholder="请输入已造成后果"
                style="width:81.5%;"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="事件发展趋势:"
              v-if="emergencyForm.isExpand"
              prop="eventDevelopmentTrend"
            >
              <el-input
                v-model="emergencyForm.eventDevelopmentTrend"
                placeholder="请输入事件发展趋势"
                style="width:79%;"
              ></el-input>
            </el-form-item>
            <el-form-item label="已采取措施:" v-if="emergencyForm.isExpand" prop="Measures">
              <el-input v-model="emergencyForm.Measures" placeholder="请输入已采取措施" style="width:81%;"></el-input>
            </el-form-item>
            <el-form-item style="height:47px;position:relative;">
              <el-button
                type="primary"
                style="position: absolute;right: 3%;"
                @click="submitEmergencyForm"
              >立即保存</el-button>
            </el-form-item>
          </el-form>
          <!-- 非突发事件的表单 -->
          <el-form
            ref="unEmergencyForm"
            :model="unEmergencyForm"
            :rules="unEmergencyFormRules"
            v-if="faxTypeForm.faxType!='突发事件'"
          >
            <el-form-item label="号码:">
              <el-input v-model="unEmergencyForm.faxNumber" placeholder="请输入号码" style="width:74.5%;" disabled></el-input>
            </el-form-item>
            <el-form-item label="来文单位:">
              <el-input v-model="unEmergencyForm.faxUnit" placeholder="请输入来文单位" style="width:70%;" disabled></el-input>
            </el-form-item>
            <el-form-item label="时间:">
                <el-date-picker
                v-model="unEmergencyForm.letterTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="请选择时间"
                style="width: 74.5%" disabled
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="标题:" prop="letterTitle">
              <el-input
                v-model="unEmergencyForm.letterTitle"
                placeholder="请输入标题"
                style="width:72.8%;"
              ></el-input>
            </el-form-item>
            <el-form-item label="处置状态:">
              <el-select v-model="unEmergencyForm.disposalStatus" placeholder="请选择处置状态" style="width: 70%;">
                <el-option
                    v-for="item in unEmergencyForm.disposalStatusOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="处置记录:">
              <el-input type="textarea" v-model="unEmergencyForm.disposalRecord" style="width:70%;"></el-input>
            </el-form-item>
            <el-form-item label="事件关联:" prop="eventCorrelation.caseTitle">
              <el-popover
                placement="bottom"
                v-model="unEmergencyForm.eventCorrelationConfig.visible"
                popper-class="eventOptions"
              >
                <div class="eventSearch">
                  <el-input
                    v-model="unEmergencyForm.eventCorrelationConfig.searchText"
                    placeholder="请输入关键字"
                    size="small"
                  >
                    <i
                      slot="suffix"
                      class="el-input__icon el-icon-search"
                      @click="unEmergencyForm.eventCorrelationConfig.currentPage = 1;unEmergencyForm.eventCorrelationConfig.eventOptions = [];getEventCorrelationOptions();"
                    ></i>
                  </el-input>
                </div>
                <template v-if="unEmergencyForm.eventCorrelationConfig.eventOptions.length > 0">
                  <ul class="eventList">
                    <li
                      v-for="item in unEmergencyForm.eventCorrelationConfig.eventOptions"
                      :key="item.id"
                      class="evenyEvent"
                      @click="onSelectEventCorrelation(item)"
                      :style="selectEventCorrelationStyle"
                    >{{ item.title }}</li>
                    <div class="loadMore">
                      <el-button
                        round
                        icon="iconfont icon-loadMore"
                        size="mini"
                        @click="unEmergencyForm.eventCorrelationConfig.currentPage++;getEventCorrelationOptions();"
                        v-if="unEmergencyForm.eventCorrelationConfig.loadMore"
                      >加载更多</el-button>
                      <div v-else>暂无更多数据</div>
                    </div>
                  </ul>
                </template>
                <template v-else>
                  <div style="text-align: center; margin-top: 10px">暂无数据</div>
                </template>

                <el-input
                  slot="reference"
                  v-model="unEmergencyForm.eventCorrelation.caseTitle"
                  readonly
                  placeholder="请选择事件关联"
                  style="width:68.4%;"
                  size="small"
                ></el-input>
              </el-popover>
            </el-form-item>
            <el-form-item style="height:47px;position:relative;">
              <el-button
                type="primary"
                style="position: absolute;right: 3%;"
                @click="submitUnEmergencyForm"
              >立即保存</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div style="width: 100%;text-align: initial;" v-if="tabPosition=='信息报送'">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane name="phone" label="电话">
              <phoneIndex ref="phoneIndex" :faxForm="phoneForm"></phoneIndex>
            </el-tab-pane>
            <el-tab-pane name="sms" label="短信">
              <smsRight ref="smsRight" :selectContact="true"></smsRight>
            </el-tab-pane>
            <el-tab-pane name="fax" label="传真">
              <fax-right ref="IcpFaxRight" :isAddPhonesShow.sync="isAddPhonesShow"></fax-right>
            </el-tab-pane>
          </el-tabs>
        </div>

        <div style="width: 100%;text-align: initial;" v-if="tabPosition=='查看报送历史'">
          <el-card class="box-card cardCalss cards" shadow="hover">
            <div style="width: 100%">
              <el-radio-group v-model="eventChainValue" @change="eventChain">
                <el-radio-button
                  v-for="item in eventChainData"
                  :key="item.id"
                  :label="item.id"
                >{{ item.name }}</el-radio-button>
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
                  <!-- <div
                        @click="itemClick(item, index)"
                        style="cursor: pointer"
                  >-->
                  <div class="cardHeader">
                    <div class="cardTime">{{ item.time }}</div>
                    <div class="cardDetail" @click="cardDetail(item)">详情</div>
                    <i
                      class="el-icon-close"
                      style="cursor: pointer"
                      @click="deleteEvents(item, index)"
                    ></i>
                  </div>

                  <div class="cardIphone" v-if="item.type == 'phone'">
                    <div class="phoneIcon" style="position: absolute; top: 0%; left: -23%">电话</div>
                    <div class="contact">
                      <el-row :gutter="24" class="contactItem">
                        <el-col style="text-indent: 30px;" :span="9">联系人:</el-col>
                        <el-col :span="15">
                          <div>{{ item.contact == null ? "" : item.contact }}</div>
                        </el-col>
                      </el-row>
                      <el-row :gutter="24" class="contactItem">
                        <el-col :span="9">通话时长:</el-col>
                        <el-col :span="15">
                          <div>{{ item.conversationTime }}</div>
                        </el-col>
                      </el-row>
                      <el-row :gutter="24" class="contactItem">
                        <el-col :span="9">备注信息:</el-col>
                        <el-col :span="15">
                          <div class="textRemark">{{ item.remark }}</div>
                        </el-col>
                      </el-row>
                      <el-row style="display: flex;">
                        <el-col :span="10">电话录音:</el-col>
                        <el-col :span="24">
                          <div id="content_del" style="position: relative">
                            <audio style="display: none" controls :src="audioSrc"></audio>
                          </div>
                        </el-col>
                      </el-row>
                    </div>
                  </div>

                  <div class="cardIphone" v-if="item.type == 'sms'">
                    <div class="phoneIcon" style="position: absolute; top: 0%; left: -23%">短信</div>
                    <div class="contact" style="margin-bottom: 8px">
                      <el-row :gutter="24">
                        <el-col :span="8">收信人:</el-col>
                        <el-col :span="16">
                          <div class="contact_list">
                            <span
                              v-for="(man, index) in item.nameListFour"
                              :key="index"
                              class="contact_item"
                            >{{ man }}</span>
                          </div>
                        </el-col>
                      </el-row>
                    </div>
                    <div class="cardRemark">
                      <el-row :gutter="24">
                        <el-col class="contenTitle" :span="8">信息内容:</el-col>
                        <el-col :span="16" class="contentMsg">
                          <div class="cardItem">{{ item.content }}</div>
                        </el-col>
                      </el-row>
                    </div>
                  </div>
                  <div class="cardIphone" v-if="item.type == 'fax'">
                    <div class="phoneIcon" style="position: absolute; top: 0%; left: -23%">传真</div>
                    <div class="contact" style="margin-bottom: 8px">
                      <el-row :gutter="24" style="margin-bottom: 8px;">
                        <el-col :span="8">收信人:</el-col>
                        <el-col :span="16">
                          <div class="contact_list">
                            <span
                              v-for="(man, index) in item.nameListFour"
                              :key="index"
                              class="contact_item"
                            >{{ man }}</span>
                          </div>
                        </el-col>
                      </el-row>
                    </div>

                    <div class="Faxs">
                      <el-row :gutter="24">
                        <el-col :span="8">传真文件:</el-col>
                        <el-col :span="16">
                          <div class="faxName" @click="itemClick(item)">{{ item.name }}</div>
                        </el-col>
                      </el-row>
                    </div>
                  </div>
                </el-card>
              </div>
            </el-scrollbar>

            <div class="footerBtn">
              <div class="icon-help" size="medium" type="primary" @click="eventPanorama">事件全景</div>
              <div class="icon-help" size="medium" type="primary" @click="exportList">导出列表</div>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <!--添加号码对话框-->
    <el-dialog :visible.sync="isAddPhonesShow" width="30%" :close-on-click-modal="false" :modal="false">
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

    <location ref="loction" :mapframe="mapId"></location>

    <!--事件全景-->
    <el-dialog
      id="panoramaId"
      top="30px"
      :title="panorameTitle"
      :visible.sync="panorameVisible"
      :close-on-click-modal="false"
      :before-close="panorameHandleClose"
    >
      <panorama :key="titleKey" :childTitle="childTitle" :childEventId="historyRecordEventId"></panorama>
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
          :src="require('@/assets/phoneHistoryIcon/fullScreen.png')"
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
        ></iframe>
      </div>
    </el-dialog>

    <!--弹窗预览传真-->
    <el-dialog :close-on-click-modal="false" :visible.sync="fullScreenDialog" fullscreen>
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
            <el-col :span="4" style="text-indent: 13px;">联系人:</el-col>
            <el-col :span="15">
              <div>{{ currentItem.contact == null ? "" : currentItem.contact }}</div>
            </el-col>
          </el-row>

          <el-row :gutter="20" style="margin-bottom: 8px">
            <el-col :span="4">通话时长:</el-col>
            <el-col :span="15">
              <div>{{ currentItem.conversationTime }}</div>
            </el-col>
          </el-row>

          <el-row :gutter="20" style="margin-bottom: 8px">
            <el-col :span="4">备注信息:</el-col>
            <el-col :span="15">
              <div>{{ currentItem.remark }}</div>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-bottom: 8px">
            <el-col :span="4">电话录音:</el-col>
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
              <el-col :span="4">收信人:</el-col>
              <el-col :span="7">
                <div class="contact_list">
                  <span
                    v-for="(man, index) in currentItem.nameList"
                    :key="index"
                    class="contact_item"
                  >{{ man }}</span>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="currentContent">
            <el-row :gutter="20">
              <el-col class="contenTitle" :span="5">信息内容:</el-col>
              <el-col :span="15" class="contentMsg">
                <div>{{ currentItem.content }}</div>
              </el-col>
            </el-row>
          </div>
        </div>

        <div class="cardIphones1" v-if="currentItem.type == 'fax'">
          <el-row :gutter="20">
            <el-col :span="4">收信人:</el-col>
            <el-col :span="7">
              <div class="contact_list">
                <span
                  v-for="(man, index) in currentItem.nameList"
                  :key="index"
                  class="contact_item"
                >{{ man }}</span>
              </div>
            </el-col>
          </el-row>
          <div class="fax">
            <el-row :gutter="20">
              <el-col class="faxData" :span="4">传真文件:</el-col>
              <el-col :span="17">
                <div class="faxNameItem" @click="itemClick(currentItem)">{{currentItem.name}}</div>
                <!-- <div v-for="name in currentItem.nameList" :key="name.index">{{ name }}</div> -->
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      title="传真预览"
      :visible.sync="emergencyForm.previewFaxFileConfig.faxFileDialogVisible"
      width="30%"
    >
      <div class="filePreviewer">
        <div class="filePreviewer_header">
          传真预览
          <i
            class="el-icon-error"
            @click="emergencyForm.previewFaxFileConfig.faxFileDialogVisible = false"
          ></i>
        </div>
        <el-scrollbar>
          <div class="filePreviewer_content">
            <template v-if="emergencyForm.previewFaxFileConfig.imgOrFileType === 'img'">
              <el-image
                class="img_item"
                :src="emergencyForm.previewFaxFileConfig.filePath"
                :preview-src-list="emergencyForm.previewFaxFileConfig.previewImageUrlList"
              ></el-image>
            </template>
            <iframe
              v-else
              :src="emergencyForm.previewFaxFileConfig.filePath"
              id="fpxIframe"
              width="650px"
              height="100%"
              frameborder="no"
              marginwidth="0"
              marginheight="0"
              scrolling="no"
              allowtransparency="yes"
            ></iframe>
          </div>
        </el-scrollbar>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 地图弹窗 -->
    <LocationDialog ref="LocationDialogRef" />
  </el-dialog>
</template>

<script>
import phoneIndex from '@/view/eventManagement/informationDisposal/communicationHistory/phone/phoneIndex';
import smsRight from '@/view/integratedCommunication/icpPhone/icpPhonePage/smsStep/smsRight';
import faxRight from '@/view/integratedCommunication/icpPhone/icpPhonePage/faxStep/faxRight';
import Location from '@/components/loction/loction'; //定位
import audioControls from '@/../static/audioControls/audioPlugin.js';
import uploadFile from '@/components/upload/uploadFile';
import { matchFileType } from '@/assets/js/common.js';
import imgToText from "./imgToText.vue";
import NewImgToText from "./newImgToText.vue";
import LocationDialog from '@/views/modules/GarbageClassification/SiteManagement/ClassificationSite/Location/LocationDialog.vue';
import ReportUnit from '@/view/yangZhouEventReports/components/ReportUnit/ReportUnit.vue';

export default {
    data() {
        return {
            dialogVisible: false,
            faxPreviewPath: '',
            faxPreviewPathList: [],
            tableRow: {},
            dialogTitle: '突发事件处置',
            tabPosition: '信息登记',
            faxTypeForm: {
                faxType: '突发事件',
            },
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
            },
            unEmergencyForm: {
                faxNumber: '',
                faxUnit: '',
                letterTime: '',
                letterTitle: '',
                disposalStatus: '',
                disposalRecord: '',
                disposalStatusOptions:[],
                eventCorrelation: {
                    caseTitle: '',
                    caseId: '',
                },
                eventCorrelationConfig: {
                    visible: false,
                    searchText: '',
                    currentPage: 1,
                    eventOptions: [],
                    loadMore: true,
                }
            },
            options: [],
            activeName: 'phone',
            phoneForm: {
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
            isAddPhonesShow: false,
            phonesText: '',
            mapId: 'informId',
            latitude: '',
            longitude: '',
            cgcsLatitude: '',
            cgcsLongitude: '',
            eventChainValue: '0',
            eventId: window.sessionStorage.getItem('newID'),
            itemBox: [],
            audioSrc: '',
            itemClickData: '', //用来帮助预览判断是什么类型的预览
            itemClickDataRemark: '', //电话或短信备注或是内容数据
            changeRed: -1, //事件链更换样式
            eventChainData: [
                { id: '0', name: '全部' },
                { id: '1', name: '传真' },
                { id: '2', name: '电话' },
                { id: '3', name: '短信' },
            ], //获取到的事件链
            previewUrl: '', //预览的图片地址
            isFaxCard: false,
            currentItem: {},
            allFpxPreviewPath: '', //allModel选中传真的传真预览地址
            isDialog: false, //是否弹窗短信,传真,电话详情弹窗
            panorameTitle: '', //全景弹窗标题
            childTitle: '', //全景标题
            panorameVisible: false, //全景弹窗
            titleKey: null, //用来刷新全景弹窗
            fullScreenDialog: false,
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
                        trigger: 'blur',
                    },
                ],
                incidentLocation: [
                    {
                        required: true,
                        message: '请填写事发地点',
                        trigger: ['change', 'blur'],
                    },
                ],
                accidentSituation: [
                    {
                        required: true,
                        message: '请填写事故情况',
                        trigger: 'blur',
                    },
                ],
            },
            unEmergencyFormRules: {
                letterTitle: [
                    {
                        required: true,
                        message: '请填写标题',
                        trigger: 'blur',
                    },
                ],
                'eventCorrelation.caseTitle': [
                    {
                        required: true,
                        message: '请填写事件关联',
                        trigger: 'blur',
                    },
                ],
            },
        };
    },
    components: {
        phoneIndex,
        smsRight,
        faxRight,
        Location,
        uploadFile,
        imgToText,
        NewImgToText,
        LocationDialog,
        ReportUnit,
    },
    props: {
      faxId: {
        type: Number,
      },
      isSequentialRotationIn: {
        type: Boolean,
      },
    },
    created() {
    },
    mounted() {
        window.addEventListener('message', this.locationCallback);
        window.addEventListener('message', this.sendLocationMsg);
        this.getEventTitleArea();
        this.getEventCorrelationOptions();
        this.getEventTypeOptions();
        this.getEventGradeOptions();
        this.getReportingUnitOptions();
        this.getDisposalStatusOptions();
        this.$nextTick(() => {
          this.imgToText();
        });

        console.log('this.emergencyForm.jurisdiction: ', this.emergencyForm.jurisdiction);
    },
    beforeDestroy() {
        window.removeEventListener('message', this.locationCallback);
        window.removeEventListener('message', this.sendLocationMsg);
    },
    computed: {
        selectEventCorrelationStyle() {

                if (
                    this.faxTypeForm.faxType=='突发事件'?this.emergencyForm.eventCorrelation.caseId ==
                    sessionStorage.getItem('newID'):this.unEmergencyForm.eventCorrelation.caseId ==
                    sessionStorage.getItem('newID')
                ) {
                    return '';
                } else {
                    return '';
                }

        },
        historyRecordEventId(){
            return this.emergencyForm.eventCorrelation.caseId?this.emergencyForm.eventCorrelation.caseId:this.emergencyForm.eventId
        }
    },
    watch: {
        historyRecordEventId:function(newVal,oldVal){
            this.eventChain()
        },
        activeName: {
            handler: function(newVal) {
                if (newVal === '短信') {
                    const _that = this;
                    setTimeout(() => {
                        _that.$refs.smsRight.msmEventFlag = false;
                        _that.$refs.smsRight.msgHeadleState = 'yes';
                    }, 100);
                    this.$store.commit('setSmsOrFax', 'sms');
                } else if (newVal === '传真') {
                    this.$refs.IcpFaxRight.visFlag = true;
                    _that.$refs.IcpFaxRight.eventRelevance = false;
                    _that.$refs.IcpFaxRight.msgHeadleState = 'yes';
                    this.$store.commit('setSmsOrFax', 'fax');
                } else if (newVal === '电话') {
                    this.$store.commit('setSmsOrFax', 'phone');
                }
            },
            deep: true,
            immediate: true,
        },
        //解决事件类型级联选择器点击不关闭的问题
        'emergencyForm.eventType'(newValue, oldValue) {
            if (this.$refs.eventType) {
                var children = this.$refs.eventType.getCheckedNodes();
                if (children.length > 0 && children[0].children.length < 1) {
                    //判断有没有下级
                    this.$refs.eventType.dropDownVisible = false; //监听值发生变化就关闭它
                }
            }
        },
        "emergencyForm.reportingUnit"(newValue, oldValue) {
            if (this.$refs.reportingUnit) {
                var children = this.$refs.reportingUnit.getCheckedNodes();
                if (children.length > 0 && children[0].children.length < 1) {
                    //判断有没有下级
                    this.$refs.reportingUnit.dropDownVisible = false; //监听值发生变化就关闭它
                }
            }
        },
        //解决所属区域级联选择器点击不关闭的问题
        'emergencyForm.jurisdiction'(newValue, oldValue) {
            if (this.$refs.jurisdiction) {
                var children = this.$refs.jurisdiction.getCheckedNodes();

                if (
                    children &&
                    children.length > 0 &&
                    children[0] &&
                    children[0].children.length < 1
                ) {
                    this.$refs.jurisdiction.dropDownVisible = false; //监听值发生变化就关闭它
                }
            }
        },
    },
    methods: {
      /**
       * @description 传真类型改变触发
       */
      faxTypeChange() {
        Object.assign(this.emergencyForm.eventCorrelationConfig, {
          visible: false,
          searchText: '',
          currentPage: 1,
          eventOptions: [],
          loadMore: true,
        })
        Object.assign(this.unEmergencyForm.eventCorrelationConfig, {
          visible: false,
          searchText: '',
          currentPage: 1,
          eventOptions: [],
          loadMore: true,
        })
        this.getEventCorrelationOptions();
      },
      /**
       * @description 初始化突发事件表单数据
       */
      initEmergencyForm() {
        const initData = {
          eventDealId: '', // 事件续报ID
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
        submitEmergencyForm() {
            if (this.emergencyForm.eventCorrelation.caseId) {
                this.submitEmergencyFormDealReport();
                return false;
            }
            this.$refs.emergencyForm.validate(valid => {
                if (valid) {
                    let data = {
                        vcTitle: this.emergencyForm.eventTitle, //事件标题
                        dtReportTime: this.emergencyForm.startingTime, //首报时间
                        dtOccurTime: this.emergencyForm.incidentTime, //事发时间
                        iAreaId: this.emergencyForm.jurisdiction[
                            this.emergencyForm.jurisdiction.length - 1
                        ], //事发区域ID
                        vcAddress: this.emergencyForm.incidentLocation, //事发地点
                        dLongitude: this.longitude, //经度
                        dLatitude: this.latitude, //纬度
                        vcReportDepart: this.emergencyForm.reportingUnitName, //报送单位名字
                        vcReportDepartId: this.emergencyForm.reportingUnit[
                            this.emergencyForm.reportingUnit.length - 1
                        ], //报送单位id
                        iCaseClassId: this.emergencyForm.eventType, //事件类型
                        iEventLevel: this.emergencyForm.eventGrade, //事件等级
                        iEvnetSetingParams: this.emergencyForm.parameter, //事件要素
                        txtReportDescription: this.emergencyForm.accidentSituation.trim(), //事故情况
                        vcReportNum: this.emergencyForm.contactNumber, //联系电话
                        eventLevel: this.emergencyForm.eventGrade, //事件等级
                        cgcsLongitude: this.cgcsLongitude,
                        cgcsLatitude: this.cgcsLatitude
                    };
                    this.$api.saveEventReceive(data).then(res => {
                        if (res.errorcode == '0') {
                            this.emergencyForm.eventId = res.data.id;
                            this.submitEmergencyFormDealReport(); // 第一次新建事件时，先调用旧的保存事件的接口，再调用保存续报的接口
                            this.$message.success('保存事件成功！');
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
                } else {
                }
            });
        },
        submitEmergencyFormDealReport() {
            this.$refs.emergencyForm.validate(valid => {
                if (valid) {
                    let dealOrder;
                    this.$http({
                        method: 'post',
                        headers: {},
                        url:
                            window.g.ApiUrl +
                            '/eos/event/report/findEventDealOrderMax',
                        data: {
                            eventId: this.emergencyForm.eventCorrelation.caseId? this.emergencyForm.eventCorrelation.caseId: this.emergencyForm.eventId
                        },
                    })
                        .then(res => {
                            console.log(
                                '/eos/event/report/findEventDealOrderMax',
                                res
                            );
                            if (res.data.errorcode == 0) {
                                dealOrder = res.data.data.deal_order;
                            }
                        })
                        .then(() => {
                            let data = {
                                eventJson: {
                                    iid: this.emergencyForm.eventDealId, // 事件续报ID  修改时必传
                                    i_event_process_id: this.emergencyForm
                                        .eventCorrelation.caseId
                                        ? this.emergencyForm.eventCorrelation
                                              .caseId
                                        : this.emergencyForm.eventId, // 事件ID
                                    title: this.emergencyForm.eventTitle, // 事件标题
                                    occurTime: this.emergencyForm.incidentTime, // 事发时间
                                    reportTime: this.emergencyForm.startingTime, // 首报时间
                                    areaId:
                                        this.emergencyForm.jurisdiction.length >
                                        0
                                            ? this.emergencyForm.jurisdiction[
                                                  this.emergencyForm
                                                      .jurisdiction.length - 1
                                              ]
                                            : null, // 管辖范围：关联app_area表的i_id
                                    address: this.emergencyForm
                                        .incidentLocation, // 事发地点
                                    longitude: this.longitude, // 事发地点-经度
                                    latitude: this.latitude, // 事发地点-纬度
                                    reportDepartId:
                                        this.emergencyForm.reportingUnit
                                            .length > 0
                                            ? this.emergencyForm.reportingUnit[
                                                  this.emergencyForm
                                                      .reportingUnit.length - 1
                                              ]
                                            : null, // 报送单位id
                                    vcDepartment: this.emergencyForm.reportingUnitName, // 报告单位
                                    eventType: this.emergencyForm.eventType, // 事件类型
                                    reportDescription: this.emergencyForm.accidentSituation.trim(), // 事件简况
                                    dealOrder: dealOrder ? dealOrder : 0, // 排序：首报、续报一、续报二....
                                    caseClassId: this.emergencyForm.eventType, // 事件要素:对应app_event_seting_params的i_case_id
                                    incidentSite: this.emergencyForm
                                        .incidentLocation, // 落图地点
                                    occurReason: this.emergencyForm
                                        .incidentCause, // 事发原因
                                    consequences: this.emergencyForm
                                        .consequences, // 已造成后果
                                    developmentTrend: this.emergencyForm
                                        .eventDevelopmentTrend, // 事件发展趋势
                                    takeSteps: this.emergencyForm.Measures, // 已采取措施
                                    eventLevel: this.emergencyForm.eventGrade, // 事件等级
                                    dealPhone: this.emergencyForm.contactNumber, // 联系电话（可以理解为报送单位号码）
                                },
                                iEvnetSetingParams: this.emergencyForm
                                    .parameter, // 事件要素
                                attachments: this.emergencyForm.faxFileList.concat(
                                    this.emergencyForm.otherFileList
                                ), // 上传文件
                            };
                            this.$api.saveEventDealReport(data).then(res => {
                                if (res.errorcode == '0') {
                                    this.$message({
                                        message: `${
                                            this.emergencyForm.eventDealId
                                                ? '修改突发事件成功'
                                                : '新增突发事件成功'
                                        }`,
                                        type: 'success',
                                    });
                                    // 需求432
                                    this.$refs.reportUnitRef.setReportingUnitListFromStorage(this.emergencyForm.reportingUnitName);
                                    this.$http({
                                        method: 'post',
                                        headers: {},
                                        url:
                                            window.g.ApiUrl +
                                            '/eos/history/updateFaxEventIdAndType',
                                        data: {
                                            eventDealId: res.data.id,
                                            eventId: this.emergencyForm.eventCorrelation.caseId? this.emergencyForm.eventCorrelation.caseId:this.emergencyForm.eventId,
                                            faxId: this.tableRow.id,
                                            faxType:
                                                this.faxTypeForm.faxType == ''
                                                    ? 0
                                                    : this.faxTypeForm
                                                          .faxType == '突发事件'
                                                    ? 1
                                                    : this.faxTypeForm
                                                          .faxType == '三防响应'
                                                    ? 2
                                                    : this.faxTypeForm
                                                          .faxType == '领导批示'
                                                    ? 3
                                                    : 4
                                        },
                                    }).then(res => {
                                        console.log(
                                            '/eos/history/updateFaxEventIdAndType',
                                            res
                                        );
                                        if (res.data.errorcode == 0) {
                                            this.$message({
                                                message: `传真类型关联成功`,
                                                type: 'success',
                                            });
                                            // this.initEmergencyForm(); // 新增事件或事件续报后要清空表单
                                        }
                                    });
                                } else {
                                    this.$message.error(res.msg);
                                }
                            });
                        });
                } else {
                }
            });
        },
        reportingUnitChange(val) {
            this.emergencyForm.reportingUnitName = this.emergencyForm.reportingUnitOptions.filter(
                item => {
                    return item.id == val[val.length - 1];
                }
            )[0].name;
        },
        eventTypeChange(arr) {
            this.emergencyForm.eventType = arr[arr.length - 1];
            if (arr.length !== 0) {
                let data = {
                    caseId: this.emergencyForm.eventType,
                };
                this.$api.defaultParameters(data).then(res => {
                    if (res.errorcode == '0') {
                        if (res.data.length > 0) {
                            this.emergencyForm.parameter = res.data;
                        }
                    } else {
                        //this.$message.error(res.msg)
                    }
                });
            } else {
                this.emergencyForm.parameter = [];
            }
            var gettree = data => {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].id == arr[arr.length - 1]) {
                        this.emergencyForm.eventType = '';
                        this.emergencyForm.eventType = data[i].id;
                        console.log(
                            'this.emergencyForm.eventType',
                            this.emergencyForm.eventType
                        );
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
        eventGradeChange(val) {
            console.log('eventGradeChange', val, this.emergencyForm.eventGrade);
        },
        submitUnEmergencyForm() {
            this.$refs.unEmergencyForm.validate(valid => {
                if (valid) {
                    let data={
                        id: this.tableRow.id,
                        title: this.unEmergencyForm.letterTitle,
                        result: this.unEmergencyForm.disposalRecord,
                        eventId: this.unEmergencyForm.eventCorrelation.caseId,
                        statusId: this.unEmergencyForm.disposalStatus
                    }
                    this.$api.disposeFax(data).then((res) => {
                        if (res.errorcode == 0) {
                            this.$message({
                                message: "保存成功！",
                                type: "success",
                            });
                            this.$http({
                                method: 'post',
                                headers: {},
                                url:
                                    window.g.ApiUrl +
                                    '/eos/history/updateFaxEventIdAndType',
                                data: {
                                    eventId: this.unEmergencyForm.eventCorrelation.caseId,
                                    faxId: this.tableRow.id,
                                    faxType:
                                        this.faxTypeForm.faxType == ''
                                            ? 0
                                            : this.faxTypeForm
                                                    .faxType == '突发事件'
                                            ? 1
                                            : this.faxTypeForm
                                                    .faxType == '三防响应'
                                            ? 2
                                            : this.faxTypeForm
                                                    .faxType == '领导批示'
                                            ? 3
                                            : 4
                                },
                            }).then(res => {
                                console.log(
                                    '/eos/history/updateFaxEventIdAndType',
                                    res
                                );
                                if (res.errorcode == 0) {
                                    this.$message({
                                        message: `传真类型关联成功`,
                                        type: 'success',
                                    });
                                }
                            });
                        }else{
                             this.$message({
                                message: res.msg,
                                type: "error",
                            });
                        }

                    });
                }
            });
        },
        handleClose(done) {
            this.dialogVisible = false;
            this.$emit('closeDialog');
        },
        handlePreviewFaxFile(item) {
            this.emergencyForm.previewFaxFileConfig.faxFileDialogVisible = true; // 显示文件查看器
            if (matchFileType(item.fileName) === 2) {
                // 2 是图片
                this.emergencyForm.previewFaxFileConfig.imgOrFileType = 'img';
                this.emergencyForm.previewFaxFileConfig.filePath = item.url; // 文件路径
                this.emergencyForm.previewFaxFileConfig.previewImageUrlList.push(
                    window.g.ApiUrl + item.filePath
                ); // 图片显示列表
            } else if (
                matchFileType(item.fileName) !== 1 ||
                matchFileType(item.fileName) !== 10
            ) {
                this.emergencyForm.previewFaxFileConfig.imgOrFileType = 'file';
                this.emergencyForm.previewFaxFileConfig.filePath = item.url; // 文件路径
            }
        },
        downloadFile(item) {
            let name = item.fileName;
            let url = `${window.g.ApiUrl}/eos/file/getStream?id=${item.id}`;
            let eleLink = document.createElement('a');
            eleLink.download = name;
            eleLink.href = url;
            eleLink.click();
        },
        handleRemoveFaxFile(fileList) {
            fileList.forEach(item => {
                item.fileType = 1; // fileType 文件类型 0是其他文件 1是传真文件
            });
            this.emergencyForm.faxFileList = fileList;
        },
        handleRemoveOtherFile(fileList) {
            fileList.forEach(item => {
                item.fileType = 1; // fileType 文件类型 0是其他文件 1是传真文件
            });
            this.emergencyForm.otherFileList = fileList;
        },
        handleUploadFaxFileSuccess(fileList) {
            fileList.forEach(item => {
                item.fileType = 1; // fileType 文件类型 0是其他文件 1是传真文件
            });
            this.emergencyForm.faxFileList = [...fileList];
            console.log(
                'handleUploadFaxFileSuccess',
                fileList,
                this.emergencyForm.faxFileList
            );
        },
        handleUploadOtherFileSuccess(fileList) {
            fileList.forEach(item => {
                item.fileType = 0; // fileType 文件类型 0是其他文件 1是传真文件
            });
            this.emergencyForm.otherFileList = [...fileList];
        },
        handleClick(tab, event) {
            console.log(tab, event);
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
                data.forEach(o => {
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
        locationCallback(obj) {
            if (obj.data.action && obj.data.action == 'retpoint') {
                let latlon = obj.data.object.point.split(',');
                this.longitude = latlon[0];
                console.log('locationCallback', obj);
                this.latitude = latlon[1];
                this.$refs.loction.visible = false;
                this.emergencyForm.incidentLocation = obj.data.object.address;
            }
        },
        sendLocationMsg(obj) {
            if (obj.data.action && obj.data.action == 'ready') {
                console.log(this.longitude);
                console.log(this.latitude);
                if (this.longitude && this.latitude) {
                    this.longitude = '';
                    this.latitude = '';
                    this.emergencyForm.incidentLocation = '';
                    //var framew = window.mapFrame.contentWindow;
                    var mapFarme = document.getElementById('informId');
                    if (mapFarme) {
                        var data = {};
                        data.action = 'getpoint';
                        var object = {};
                        object.center = this.longitude + ',' + this.latitude;
                        object.address = this.emergencyForm.incidentLocation;
                        object.area = '';
                        data.object = object;
                        mapFarme.contentWindow.postMessage(
                            JSON.stringify(data),
                            '*'
                        );
                    }
                }
            }
        },

        handleLocation() {
          this.$refs.LocationDialogRef.open({
            longitude: this.longitude,
            latitude: this.latitude,
            address: this.emergencyForm.incidentLocation,
            cgcsLongitude: this.cgcsLongitude,
            cgcsLatitude: this.cgcsLatitude
          }).then(({
            longitude,
            latitude,
            address,
            cgcsLongitude,
            cgcsLatitude
          }) => {
            this.longitude = longitude;
            this.latitude = latitude;
            this.emergencyForm.incidentLocation = address;
            this.cgcsLatitude = cgcsLatitude;
            this.cgcsLongitude = cgcsLongitude;
          });
        },
        //导出列表
        exportList() {
            if (this.historyRecordEventId == '' || this.historyRecordEventId == null) {
                this.$message({
                    message: '请先选择事件在进行导出',
                    type: 'warning',
                });
                return;
            }
            let Url = window.g.ApiUrl;
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
            let downloadYearUrl = `${Url}/eos/register/exportEventDetail?eventId=${this.historyRecordEventId}&cType=${cType}&data=&unit=`;
            window.location.href = downloadYearUrl;
        },
        eventChain(val) {
            this.itemBox = [];
            console.log(this.eventChainValue, val);
            //事件链检测选择的是哪一个
            if (this.historyRecordEventId == null || this.historyRecordEventId == '') {
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
        getselectAllList() {
            //根据事件获取所有历史
            let data = {
                eventId: this.historyRecordEventId,
            };
            this.itemBox = [];
            let audioArray;
            const _that = this;
            this.$szApi
                .selectAll(data)
                .then(res => {
                    console.log(res, 669696);
                    if (res.errorcode == 0) {
                        res.data.forEach(item => {
                            if (item.type !== 'phone' && item.nameList) {
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
                                    console.log('11111', item.nameListFour);
                                }
                            }
                        });

                        new Promise((resolve, reject) => {
                            this.itemBox = res.data;
                            resolve();
                        }).then(() => {
                            let getAllAudio = document.querySelectorAll(
                                '#content_del audio'
                            );

                            audioArray = Array.from(getAllAudio);
                            res.data.forEach(item => {
                                if (!item.url) {
                                    let recordFile = item.url; // 录音文件地址
                                    this.audioSrc =
                                        this.ApiUrl + '/rec/' + this.recordFile;
                                    console.log(this.audioSrc); // http://192.168.3.27:8089/rec/20200511134140_13427521779_6001_CALLIN.wav
                                    audioArray.forEach((ele, index) => {
                                        ele.setAttribute('src', this.audioSrc);
                                        // console.log(ele.src)
                                    });
                                }
                            });

                            this.audioSrc = '';
                            audioArray.forEach((ele, index) => {
                                ele.setAttribute('src', '');
                                console.log(ele.src);
                            });
                        });
                    } else {
                        // //this.$message.error(res.msg)
                    }
                })
                .then(() => {
                    setTimeout(() => {
                        // 设置图片路径 用require()转换成base64
                        let play = require('@/../static/audioControls/play.png'),
                            stop = require('@/../static/audioControls/stop.png'),
                            TurnTheText = require('@/../static/audioControls/TurnTheText.png'),
                            tailor = require('@/../static/audioControls/tailor.png'),
                            dow = require('@/../static/audioControls/dow.png');

                        let obj = {
                            play,
                            stop,
                            TurnTheText,
                            tailor,
                            dow,
                        };
                        let type = 'yangZhouEventRegistration';
                        console.log('Array.from(audioArray)', audioArray);
                        Array.from(audioArray).forEach((ele, index) => {
                            console.log(
                                '插入audioControls插入audioControls',
                                ele
                            );
                            let audio = new audioControls(
                                ele.parentNode,
                                ele.src,
                                obj,
                                false,
                                TurnTheText,
                                tailor,
                                this.RowData,
                                // _that,
                                type
                            );
                            //   _that.audioEventList[index] = audio;
                            audio.addIncident('这个用来判断是否显示下载控件');
                        });
                    });
                }, 10);
        },
        getFaxList() {
            //获取传真历史
            let data = {
                eventId: this.historyRecordEventId,
                type: 'fax',
            };
            this.$szApi.selectHistory(data).then(res => {
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
        getPhoneList() {
            //获取电话历史
            let data = {
                eventId: this.historyRecordEventId,
                type: 'phone',
            };
            let audioArray;
            const _that = this;
            this.$szApi
                .selectHistory(data)
                .then(res => {
                    if (res.errorcode == 0) {
                        console.log(res.data);

                        this.itemBox = [];
                        this.itemBox = res.data;
                        new Promise((resolve, reject) => {
                            this.itemBox = res.data;
                            resolve();
                        }).then(() => {
                            let getAllAudio = document.querySelectorAll(
                                '#content_del audio'
                            );
                            audioArray = Array.from(getAllAudio);
                            res.data.forEach(item => {
                                if (!item.url) {
                                    let recordFile = item.url; // 录音文件地址
                                    this.audioSrc =
                                        this.ApiUrl + '/rec/' + this.recordFile;
                                    console.log(this.audioSrc); // http://192.168.3.27:8089/rec/20200511134140_13427521779_6001_CALLIN.wav
                                    audioArray.forEach((ele, index) => {
                                        ele.setAttribute('src', this.audioSrc);
                                        // console.log(ele.src)
                                    });
                                }
                            });

                            this.audioSrc = '';
                            audioArray.forEach((ele, index) => {
                                ele.setAttribute('src', '');
                                console.log(ele.src);
                            });
                        });
                    } else {
                        // //this.$message.error(res.msg)
                    }
                })
                .then(() => {
                    setTimeout(() => {
                        // 设置图片路径 用require()转换成base64
                        let play = require('@/../static/audioControls/play.png'),
                            stop = require('@/../static/audioControls/stop.png'),
                            TurnTheText = require('@/../static/audioControls/TurnTheText.png'),
                            tailor = require('@/../static/audioControls/tailor.png'),
                            dow = require('@/../static/audioControls/dow.png');

                        let obj = {
                            play,
                            stop,
                            TurnTheText,
                            tailor,
                            dow,
                        };
                        let type = 'yangZhouEventRegistration';
                        console.log('Array.from(audioArray)', audioArray);
                        Array.from(audioArray).forEach((ele, index) => {
                            console.log(
                                '插入audioControls插入audioControls',
                                ele
                            );
                            let audio = new audioControls(
                                ele.parentNode,
                                ele.src,
                                obj,
                                false,
                                TurnTheText,
                                tailor,
                                this.RowData,
                                // _that,
                                type
                            );
                            //   _that.audioEventList[index] = audio;
                            audio.addIncident('这个用来判断是否显示下载控件');
                        });
                    });
                }, 10);
        },
        getSmsList() {
            //获取短信历史
            let data = {
                eventId: this.historyRecordEventId,
                type: 'sms',
            };
            this.$szApi.selectHistory(data).then(res => {
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
        //删除事件关联
        deleteEvents(item, index) {
            console.log(this.itemClickData, 5656);
            console.log(item, index);
            this.$confirm('删除与该事件的关联?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    let data = {
                        id: item.id,
                        eventId: 0,
                        type: item.type,
                    };
                    this.$api.relateEvent(data).then(res => {
                        if (res.errorcode == 0) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                            });
                            let type = this.eventChainValue;
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
                            //this.$message.error(res.msg)
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
        itemClick(item, index) {
            //事件链循环每一个的点击
            this.changeRed = index;
            this.itemClickData = item;
            this.itemClickDataRemark = '';
            this.itemClickDataRemark = item.remark;
            let faxData;
            switch (item.type) {
                case 'fax':
                    faxData = {
                        faxId: item.id,
                    };
                    this.$szApi.previewFax(faxData).then(res => {
                        if (res.errorcode == 0) {
                            this.previewUrl =
                                window.g.ApiUrl + '/fax/' + res.data;
                            this.faxCard(item);
                        } else if (res.errorcode == 500) {
                            //传真文件不存在
                            this.$message.error(res.msg);
                            this.previewUrl = '';
                        }
                    });
                    break;
                case 'phone':
                    break;
                case 'sms':
                    break;
                default:
                    break;
            }
        },
        faxCard(item) {
            // console.log(item, 5656);
            this.isFaxCard = true;
            this.faxTitle = '传真预览';
            this.currentItem = item;
            this.allFpxPreviewPath =
                window.g.ApiUrl + '/fax/' + this.currentItem.file;
            console.log(this.allFpxPreviewPath, 545);
        },
        cardDetail(item) {
            this.isDialog = true;
            this.currentItem = item;
        },
        //事件全景
        eventPanorama() {
            if (!this.historyRecordEventId) {
                this.$message({
                    message: '请先选择事件再进行全景查看!',
                    type: 'warning',
                });
                return;
            }
            this.panorameTitle = '事件全景';
            console.log(this.RowData);
            this.childTitle = this.RowData.title;
            this.panorameVisible = true;
            this.titleKey = new Date().getTime();
        },
        panorameHandleClose() {
            this.panorameVisible = false;
        },
        getDisposalStatusOptions(){
            this.$api.getByPcode({pcode: "information_processing_status"}).then((res) => {
                if (res.errorcode == 0) {
                    this.unEmergencyForm.disposalStatusOptions = res.data;
                } else {
                    this.$message.error(res.msg)
                }
            });
        },
        getEventTitleArea() {
            this.$api.getJurisdiction({}).then(res => {
              console.log(res);
                if (res.code == 0) {
                    this.emergencyForm.jurisdictionOptions = res.list;
                    var gettree = function(data) {
                        for (var i = 0; i < data.length; i++) {
                            if (!data[i].children) {
                              data[i].children = undefined;
                            }else if (data[i].children.length == 0) {
                              data[i].children = undefined;
                            } else {
                              gettree(data[i].children);
                            }
                        }
                    };
                    gettree(this.emergencyForm.jurisdictionOptions);
                        console.log('this.emergencyForm.jurisdiction: ', this.emergencyForm.jurisdiction);
                    let keyArray = [],
                        jurisdictionId = this.emergencyForm.jurisdiction[0];
                    var that = this;
                    var getCompleteId = function(id, keyArray, options) {
                        for (let key in options) {
                            if (options[key].id == id) {
                                keyArray.push(id);
                                that.emergencyForm.jurisdiction = [];
                                that.emergencyForm.jurisdiction.push(
                                    ...keyArray
                                );
                                console.log(
                                    'keyArray,that.emergencyForm.jurisdiction',
                                    keyArray,
                                    that.emergencyForm.jurisdiction
                                );
                                break;
                            }
                            if (options[key].children) {
                                keyArray.push(options[key].id);
                                getCompleteId(
                                    id,
                                    keyArray,
                                    options[key].children
                                );
                            } else {
                                keyArray = [];
                            }
                        }
                    };
                    // getCompleteId(
                    //     jurisdictionId,
                    //     keyArray,
                    //     this.emergencyForm.jurisdictionOptions
                    // );
                    console.log(this.emergencyForm.jurisdictionOptions);
                }
            });
        },
        //获取未办结事件
        getEventCorrelationOptions() {
            let ipData = {
                dtStart: '',
                dtEnd: '',
                searchText: this.faxTypeForm.faxType=='突发事件'?this.emergencyForm.eventCorrelationConfig
                    .searchText:this.unEmergencyForm.eventCorrelationConfig
                    .searchText,
                page: this.faxTypeForm.faxType=='突发事件'?this.emergencyForm.eventCorrelationConfig.currentPage:this.unEmergencyForm.eventCorrelationConfig.currentPage,
                size: 10,
            };
            this.$api.todolist(ipData).then(res => {
                let data = res.data?res.data.data?[...res.data.data]:[]:[]
                if (res.errorcode == 0) {
                    this.faxTypeForm.faxType=='突发事件'?this.emergencyForm.eventCorrelationConfig.eventOptions.push(
                        ...data
                    ):this.unEmergencyForm.eventCorrelationConfig.eventOptions.push(
                        ...data
                    );
                    this.faxTypeForm.faxType=='突发事件'?(this.emergencyForm.eventCorrelationConfig.loadMore =
                        data.length == 0 ? false : true):this.unEmergencyForm.eventCorrelationConfig.loadMore =
                        data.length == 0 ? false : true;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        onSelectEventCorrelation(obj) {
            this.faxTypeForm.faxType=='突发事件'?this.emergencyForm.eventCorrelationConfig.visible = false:this.unEmergencyForm.eventCorrelationConfig.visible = false;
            this.faxTypeForm.faxType=='突发事件'?this.emergencyForm.eventCorrelation.caseTitle = obj.title:this.unEmergencyForm.eventCorrelation.caseTitle = obj.title;
            this.faxTypeForm.faxType=='突发事件'?this.emergencyForm.eventCorrelation.caseId = obj.id:this.unEmergencyForm.eventCorrelation.caseId = obj.id;
        },
        getEventTypeOptions() {
            this.$api.getTree({}).then(res => {
                if (res.errorcode == '0') {
                    this.emergencyForm.eventTypeOptions = res.data; // console.log("this.treeData: ", this.treeData);
                    var gettree = function(data) {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].children.length == 0) {
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
        getEventGradeOptions() {
            this.$api
                .eventLevel({
                    pcode: 'emtlevel',
                })
                .then(res => {
                    if (res.errorcode == '0') {
                        this.emergencyForm.eventGradeOptions = res.data;
                    }
                });
        },
        getReportingUnitOptions() {
            this.$api.topUnitTree().then(res => {
                if (res.errorcode === 0) {
                    this.emergencyForm.reportingUnitOptions = res.data
                        ? res.data
                        : [];
                    var gettree = function(data) {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].children.length == 0) {
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
        imgToText() {
          this.$nextTick(() => {
            this.$refs.imgToText.oldFaxPath = "";
            this.$refs.imgToText.imageTextArr = [];
            if (this.faxPreviewPath) {
              let fileName = this.faxPreviewPath.substring(this.faxPreviewPath.lastIndexOf("/") + 1);
              let data = {
                faxId: this.tableRow.id,
                fileName,
                isSingle: true,
              };
              // let loading = this.$loading({
              //   lock: true,
              //   text: "识别中...",
              //   spinner: "el-icon-loading",
              //   background: "rgba(0, 0, 0, 0.7)",
              // });
              this.$http({
                baseURL: window.SITE_CONFIG.cloudUrl,
                url: '/event/fax/splitPdf',
                method: 'post',
                data: this.$http.adornData(data),
              }).then((res) => {
                console.log('/event/fax/splitPdf', res)
                res=res.data;
                if (res.errorcode == 0) {
                  if (res.data.length > 0) {
                    res.data.forEach(item =>{
                      var tempItem = JSON.parse(JSON.stringify(item));
                      tempItem.fileUrl=window.SITE_CONFIG["fileupload"]+tempItem.fileUrl;
                      this.faxPreviewPathList.push(tempItem);
                    });
                    this.$refs.imgToText.imageTextArr = res.data;
                    this.$refs.imgToText.getPageData(res.data[0], 0);
                  } else {
                    this.$refs.imgToText.imageTextArr = [];
                  }
                  this.$refs.imgToText.flag = true;
                  this.$refs.imgToText.oldFaxPath = this.faxPreviewPath;
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
              faxId: this.tableRow.id,
              angel: 90,
            };
            this.$api.rotatePdf(data).then((res) => {
              resove(res);
            });
          });
        },
    },
};
</script>
<style  lang="less" scoped>
.eventList {
  li {
    list-style: none;
  }
}
.imgTfTx /deep/ .editorStyle {
  z-index: 2000 !important;
}
/deep/ .el-form-item__label {
    white-space: nowrap;
}
.eventElements /deep/ .el-form-item__content {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
}
.cardCalss {
    min-height: 700px;
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
.cardDetail {
    height: 40px;
    line-height: 40px;
    color: #40bcf4;
}
.event_list .item_wrap .el-icon-close {
    position: absolute;
    right: 4px;
    top: 4px;
    z-index: 100;
}
.cardIphone {
    width: 100%;
    word-wrap: break-word;
    text-align: left;
    text-indent: 5px;
    padding: 0 10px;
}
.cardIphone > .card {
    margin-left: 10px;
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
.contact {
    margin-bottom: 10px;
    text-indent: 14px;
}
.contactItem {
    margin-bottom: 8px;
}
.textRemark {
    max-width: 200px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
/* 通话录音 */
#content_del .control_wrap .img_del {
    position: relative !important;
    top: 5px !important;
}
.contact_list {
    overflow: hidden;
    width: 100%;
}
.contact_item {
    float: left;
    width: 50%;
    margin-bottom: 10px;
}
.cardRemark {
    max-width: 359px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: flex;
}
.contenTitle {
    text-indent: 1px;
}
.contentMsg {
    line-height: 25px;
}
.cardItem {
    max-width: 204px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.Faxs {
    max-width: 280px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.faxName {
    color: #29acdf;
    /* border-bottom: 1px solid #29acdf; */
    max-width: 183px;
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
.icon-help {
    margin-right: 30px;
    color: #039ed9;
    border-bottom: 1px solid #039ed9;
    cursor: pointer;
}
#panoramaId /deep/ .el-dialog {
    border-radius: 5px;
    box-shadow: 0px 0px 15px 2px rgba(0, 0, 0, 0.27);
}
#panoramaId /deep/ .el-dialog__header {
    background-color: #f1f4f6;
    border-radius: 5px 5px 0px 0px;
    padding: 10px 0 10px 20px;
    text-align: left;
}
#panoramaId /deep/ .el-dialog__title {
    color: #333;
    font-size: 15px;
}
#panoramaId /deep/ .el-dialog__headerbtn {
    top: 12px;
    font-size: 20px;
}
#panoramaId /deep/ .el-dialog__headerbtn .el-dialog__close {
    color: #adb6c2;
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
/* 电话,传真,短信详情弹窗框 */
.selectHistory /deep/ .el-dialog__body {
    padding: 3px 20px;
}
.selectHistory /deep/ .el-dialog__header {
    padding: 0px;
}
.cardTimes {
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: left;
}
.cardIphones1 {
    width: 100%;
    word-wrap: break-word;
    text-align: left;
    padding: 0 10px;
}
.currentContent {
    display: flex;
}
.faxData {
    text-indent: -13px;
}
.faxNameItem {
    color: #29acdf;
    /* border-bottom: 1px solid #29acdf; */
}
.emergencyForm{
    letter-spacing: 0px;
}
.emergencyForm .eventTitle {
    & /deep/ .el-form-item__content:nth-child(2) {
        display: flex;
        flex-wrap: nowrap;
       /* & > :nth-child(1) {
            width: 25%;
        }
        & > :nth-child(2) {
            width: 25%;
            margin-left: 2%;
        }*/
        & > :nth-child(3) {
            margin-left: 2%;
        }
    }
}

/* 文件预览 */
.filePreviewer {
    width: 100%;
    height: 100%;
    background: rgba(135, 135, 135, 0.7);
    position: absolute;
    top: 0;
    z-index: 100;
    padding: 5%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.filePreviewer_header {
    width: 650px;
    height: 40px;
    line-height: 40px;
    background: #f1f4f6;
    border-radius: 5px 5px 0px 0px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px 0 10px;
    box-sizing: border-box;
}

.filePreviewer_content {
    background: #ffffff;
    width: 650px;
    height: 680px;
}

.filePreviewer_header .el-icon-error {
    cursor: pointer;
}

.filePreviewer .img_item {
    width: 100%;
    height: 100%;
}

.filePreviewer .img_item /deep/ .el-image__preview {
    object-fit: contain;
}

.header-title {
  font-size: 18px;
  font-weight: 500;
  color: #333333;
  line-height: 28px;
  position: relative;
  padding-left: 11px;

  &::before {
    display: block;
    content: '';
    position: absolute;
    left: 0;
    top: 7px;
    width: 3px;
    height: 18px;
    background: #0091ff;
  }
}

/deep/ .el-dialog {
  margin: 0 !important;
}
</style>
