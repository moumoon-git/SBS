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
            <!--            <el-col :span="6">-->
            <!--              <div style="margin-left:5px">-->
            <!--                <el-input placeholder="输入标题" prefix-icon="el-icon-search" v-model="myEventFormData.searchInput"></el-input>-->
            <!--              </div>-->
            <!--            </el-col>-->
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
              <!--              <el-col :span="6">-->
              <!--                <el-select-->
              <!--                  clearable-->
              <!--                  v-model="myEventFormData.eventLevelValue"-->
              <!--                  placeholder="事件级别"-->
              <!--                  style="margin: 0 0 0 5px"-->
              <!--                >-->
              <!--                  <el-option-->
              <!--                    v-for="item in eventLevelDate"-->
              <!--                    :key="item.id"-->
              <!--                    :label="item.name"-->
              <!--                    :value="item.id"-->
              <!--                  ></el-option>-->
              <!--                </el-select>-->
              <!--              </el-col>-->
              <!--              <el-col :span="6">-->
              <!--                <el-select-->
              <!--                  clearable-->
              <!--                  v-model="myEventFormData.eventCategoryValue"-->
              <!--                  placeholder="事件类别"-->
              <!--                  style="margin: 0 0 0 5px"-->
              <!--                >-->
              <!--                  <el-option-->
              <!--                    v-for="item in eventCategoryData"-->
              <!--                    :key="item.id"-->
              <!--                    :label="item.name"-->
              <!--                    :value="item.id"-->
              <!--                  ></el-option>-->
              <!--                </el-select>-->
              <!--              </el-col>-->
              <!--              <el-col :span="6">-->
              <!--                <el-select-->
              <!--                  clearable-->
              <!--                  v-model="myEventFormData.handleTheStateValue"-->
              <!--                  placeholder="办理状态"-->
              <!--                  style="margin: 0 0 0 5px"-->
              <!--                >-->
              <!--                  <el-option-->
              <!--                    v-for="item in handleTheStateData"-->
              <!--                    :key="item.id"-->
              <!--                    :label="item.name"-->
              <!--                    :value="item.id"-->
              <!--                  ></el-option>-->
              <!--                </el-select>-->
              <!--              </el-col>-->
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
          <!--          <el-button type="primary" size="medium" @click="advancedPriveFind">高级查找</el-button>-->
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
        <div
          class="contentStyle"
          style="min-height: 750px"
          :style="registerStyle"
        >
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
                      v-if="IsYangZhouProject"
                      @click="rowDealEvent"
                      :disabled="selectList.length ? true : false"
                      >处置</el-button
                    >
                    <!--@author：qinjiaqi 事件完结-扬州项目使用 -->
                    <el-button
                      size="mini"
                      v-if="IsYangZhouProject"
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
                  <div
                    style="display: flex; align-items: center"
                    v-if="isOpenLab"
                  >
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
                    min-width="33%"
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
                    min-width="33%"
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
                    align="center"
                    label="上报渠道"
                    height="30"
                    show-overflow-tooltip
                    min-width="33%"
                    v-if="isVDCP"
                  >
                    <template slot-scope="scope">
                      {{
                        scope.row.reportType == "1"
                          ? "电话"
                          : scope.row.reportType == "2"
                          ? "短信"
                          : scope.row.reportType == "3"
                          ? "传真"
                          : scope.row.reportType == "4"
                          ? "其他"
                          : scope.row.reportType == "5"
                          ? "三级联动"
                          : ""
                      }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    label="地点"
                    height="30"
                    show-overflow-tooltip
                    min-width="33%"
                    v-if="isVDCP"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.address }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="status"
                    align="center"
                    label="状态"
                    height="30"
                    show-overflow-tooltip
                    min-width="33%"
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
            <el-col :span="6" class="colCalss">
              <div class="eventList">事件时序信息管理</div>
              <el-card class="box-card cardCalss" shadow="hover">
                <div style="width: 100%">
                  <el-select
                    style="width: 100%"
                    v-model="eventChainValue"
                    @change="eventChain"
                    placeholder="请选择"
                    size="small"
                  >
                    <el-option
                      v-for="item in eventChainData"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </div>
                <el-scrollbar style="height: 600px">
                  <div>
                    <el-card
                      class="box-card"
                      :class="{ red: changeRed == index }"
                      v-for="(item, index) in itemBox"
                      :key="index"
                      style="margin: 10px 0"
                    >
                      <div
                        @click="itemClick(item, index)"
                        style="cursor: pointer"
                      >
                        <div class="cardTime">
                          {{
                            IsYangZhouProject
                              ? item.time.substring(
                                  0,
                                  item.time.lastIndexOf(":")
                                )
                              : item.time
                          }}
                        </div>
                        <div class="cardIphone" v-if="item.type == 'phone'">
                          {{ item.direct }}电话--{{ item.contact }}({{
                            item.mobile
                          }})
                        </div>
                        <div class="cardIphone" v-if="item.type == 'sms'">
                          {{ item.direct }}短信--{{ item.contact }}({{
                            item.mobile
                          }})
                        </div>
                        <div class="cardIphone" v-if="item.type == 'fax'">
                          {{ item.direct }}传真--{{ item.contact }}({{
                            item.mobile
                          }})
                        </div>
                        <div class="iconCalssCard">
                          <el-tooltip
                            class="item"
                            effect="dark"
                            content="处理"
                            placement="bottom"
                          >
                            <i
                              v-if="item.type == 'sms'"
                              class="el-icon-info"
                              style="color: cornflowerblue; cursor: pointer"
                              @click="smsClickDispose(item, index)"
                            ></i>
                            <i
                              v-if="item.type == 'phone'"
                              class="el-icon-info"
                              style="color: cornflowerblue; cursor: pointer"
                              @click="phoneClickDispose(item, index)"
                            ></i>
                            <i
                              v-if="item.type == 'fax'"
                              class="el-icon-info"
                              style="color: cornflowerblue; cursor: pointer"
                              @click="faxClickDispose(item, index)"
                            ></i>
                          </el-tooltip>
                          <!--                            <el-tooltip class="item" effect="dark" content="回放" v-if="item.type=='phone'" placement="bottom">-->
                          <!--                              <i class="el-icon-caret-right" style="color: #76D672;cursor: pointer"></i>-->
                          <!--                            </el-tooltip>-->

                          <!--                            <el-tooltip class="item" effect="dark" content="电话" v-if="item.type=='phone'||item.type=='sms'" placement="bottom">-->
                          <!--                              <i class="el-icon-phone" style="color: #76D672;cursor: pointer"></i>-->
                          <!--                            </el-tooltip>-->

                          <!--                            <el-tooltip class="item" effect="dark" content="短信" v-if="item.type=='sms'" placement="bottom">-->
                          <!--                              <i class="el-icon-chat-line-square" style="color: #76D672;cursor: pointer"></i>-->
                          <!--                            </el-tooltip>-->

                          <!--                            <el-tooltip class="item" effect="dark" content="发送传真" v-if="item.type=='fax'" placement="bottom">-->
                          <!--                              <i class="el-icon-printer" style="color: #76D672;cursor: pointer"></i>-->
                          <!--                            </el-tooltip>-->

                          <el-tooltip
                            class="item"
                            effect="dark"
                            content="删除"
                            placement="bottom"
                          >
                            <i
                              class="el-icon-delete"
                              style="color: red; cursor: pointer"
                              @click="deleteEvents(item, index)"
                            ></i>
                          </el-tooltip>

                          <!--                            <el-tooltip class="item" effect="dark" content="关联变更" placement="bottom">-->
                          <!--                              <i class="el-icon-sort" style="color:  #76D672;cursor: pointer" @click="associatedChanges(item,index)"></i>-->
                          <!--                            </el-tooltip>-->
                        </div>
                      </div>
                    </el-card>
                  </div>
                </el-scrollbar>

                <div style="width: 100%; text-align: center">
                  <el-button
                    class="el-icon-s-help"
                    size="medium"
                    type="primary"
                    @click="eventPanorama"
                    >事件全景</el-button
                  >
                  <el-button
                    class="el-icon-download"
                    size="medium"
                    type="primary"
                    @click="exportList"
                    >导出列表</el-button
                  >
                </div>
              </el-card>
            </el-col>
            <el-col :span="9" class="colCalss">
              <div style="width: 100%">
                <div class="eventList">预览</div>
                <el-card class="box-card cardCalss" shadow="hover">
                  <div v-if="this.itemClickData.type == 'phone'">
                    <div class="reamkCalss">备注</div>
                    <div>
                      <el-input
                        :maxlength="10000"
                        clearable
                        type="textarea"
                        :rows="2"
                        v-model="itemClickDataRemark"
                        :autosize="{ minRows: 30, maxRows: 30 }"
                        resize="none"
                        show-word-limit
                      ></el-input>
                    </div>
                  </div>

                  <div v-if="this.itemClickData.type == 'sms'">
                    <div class="reamkCalss">内容</div>
                    <div>
                      <el-input
                        :maxlength="10000"
                        clearable
                        type="textarea"
                        :rows="2"
                        v-model="itemClickDataRemark"
                        :autosize="{ minRows: 30, maxRows: 30 }"
                        resize="none"
                        show-word-limit
                      ></el-input>
                    </div>
                  </div>

                  <div v-if="this.itemClickData.type == 'fax'">
                    <div style="width: 100%; height: 682px">
                      <iframe
                        :src="previewUrl"
                        v-if="previewUrl != ''"
                        id="iframe"
                        width="100%"
                        height="100%"
                        frameborder="no"
                        border="0"
                        marginwidth="0"
                        marginheight="0"
                        scrolling="no"
                        allowtransparency="yes"
                      ></iframe>
                      <div
                        v-else-if="previewUrl == ''"
                        style="
                          width: 100%;
                          height: 100%;
                          background: url('/static/img/faxBack.png') center
                            no-repeat;
                          background-size: 220px;
                        "
                      ></div>
                      <!--                      <el-avatar shape="square" :size="1000" :fit="fit" :src="previewUrl"></el-avatar>-->
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
  </el-container>
</template>

<script>
import treeSearch from "@/view/yz_eventManagement/eventRegistration/plan/treeSearch";
import dealDialog from "@/view/yz_eventManagement/eventRegistration/plan/dispositionDisposal"; //旧的处置模块
import manageDialog from "@/view/yz_eventManagement/eventRegistration/newModel/manageDialog"; //新的短信、传真处置模块
import associatedChangesModel from "@/view/yz_eventManagement/eventRegistration/newModel/associatedChangesModel";
import allModelDialog from "@/view/yz_eventManagement/eventRegistration/newModel/allModelDialog"; //悬浮球弹窗全部Model
import panorama from "@/view/yz_eventManagement/eventRegistration/plan/panorama"; //事件全景
export default {
  name: "eventRegistration",
  components: {
    treeSearch,
    dealDialog,
    manageDialog,
    associatedChangesModel,
    allModelDialog,
    panorama,
  },
  data() {
    return {
      isVDCP: window.g.IsVDCPProject,
      IsYangZhouProject: window.g.IsYangZhouProject,
      testData: "",
      isDeleteShow: false,
      isShow: false, //是否弹出删除框
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
      eventChainValue: 0, //事件链选中
      eventChainData: [
        { id: 0, name: "全部信息" },
        { id: 1, name: "传真信息" },
        { id: 2, name: "电话信息" },
        { id: 3, name: "短信信息" },
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
      pathname: "/eventReports",
      dealpathname: "/informationDisposal",
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
      isOpenLab: window.g.IsOpenLabProject, // 是否openlab项目
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
    });
  },
  created() {
    window.addEventListener("resize", this.getHeight);
    this.getHeight();
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight);
  },
  methods: {
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
      let h =
        document.documentElement.clientHeight || document.body.clientHeight;
      this.registerStyle.height = h - (68 + 205) + 58 + "px";
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
        case 0:
          cType = 7;
          break;
        case 1:
          cType = 1;
          break;
        case 2:
          cType = 2;
          break;
        case 3:
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
          this.tableRowClick(this.tableData[0]); //
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
      //事件链检测选择的是哪一个
      if (this.eventId == null || this.eventId == "") {
        this.$message({
          message: "请先选择事件",
          type: "warning",
        });
        return;
      }
      switch (val) {
        case 0:
          this.getselectAllList();
          break;
        case 1:
          this.getFaxList();
          break;
        case 2:
          this.getPhoneList();
          break;
        case 3:
          this.getSmsList();
          break;
        default:
          break;
      }
    },
    tableRowClick(row) {
      //表格行点击事件
      this.RowData = row;
      this.eventId = row.id;
      let type = this.eventChainValue;
      this.eventChainValue = 0;
      console.log(this.eventId, this.eventChainValue, type);
      this.eventChain(0); //这是默认加载第一个啊
      switch (type) {
        case 0:
          this.getselectAllList();
          break;
        case 1:
          this.getFaxList();
          break;
        case 2:
          this.getPhoneList();
          break;
        case 3:
          this.getSmsList();
          break;
        default:
          break;
      }
    },
    getselectAllList() {
      //根据事件获取所有历史
      let data = {
        eventId: this.eventId,
      };
      this.$szApi.selectAll(data).then((res) => {
        if (res.errorcode == 0) {
          this.itemBox = [];
          this.itemBox = res.data;
          console.log(res.data,"所有历史")
          //默认加载第一个历史数据,bug10158 增城区政府：【事件管理】事件管理应默认加载数据，让页面信息丰富一些@lastAuthor:qcx
          // 
          if(this.itemBox.length>0){
            this.itemClick(this.itemBox[0])
          }
        } else {
          // //this.$message.error(res.msg)
        }
      });
    },
    getPhoneList() {
      //获取电话历史
      let data = {
        eventId: this.eventId,
        type: "phone",
      };
      this.$szApi.selectHistory(data).then((res) => {
        if (res.errorcode == 0) {
          console.log(res.data);
          this.itemBox = [];
          this.itemBox = res.data;
        } else {
          // //this.$message.error(res.msg)
        }
      });
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
    /**
     * @lastEditor qinjiaqi
     * @param {type} 没有
     * @return {type} undefined
     * @description：纯打开，不做处理
     */
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
        sessionStorage.setItem("newID", this.RowData.id);
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
        if (this.IsYangZhouProject) {
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
                  sessionStorage.setItem("newID", this.RowData.id);
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
        } else {
          if (this.isOpenLab) {
            // obp
            sessionStorage.setItem("newID", this.RowData.id);
            this.$router.push({
              path: this.dealpathname, // obp跳转到信息处置
              query: { linkageValue: this.linkageValue },
            });
          } else {
            // 增城
            sessionStorage.setItem("newID", this.RowData.id);
            this.$router.push({
              path: this.pathname,
              query: { linkageValue: this.linkageValue },
            });
          }
        }
      }
    },
    itemClick(item, index) {
     console.log(index,"545")
      //事件链循环每一个的点击
      this.changeRed = index;//下标
      this.itemClickData = item;//内容
      this.itemClickDataRemark = "";
      this.itemClickDataRemark = item.remark;
      console.log( this.itemClickDataRemark,"44")
      let faxData;
      switch (item.type) {
        case "fax":
          faxData = {
            faxId: item.id,
          };
          this.$szApi.previewFax(faxData).then((res) => {
            if (res.errorcode == 0) {
              this.previewUrl = window.g.ApiUrl + "/fax/" + res.data;
            } else if (res.errorcode == 500) {
              // //this.$message.error(res.msg)
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
      this.manageTitle = "融合通信"; //处置弹窗标题
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
      this.manageTitle = "融合通信"; //处置弹窗标题
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
      this.manageTitle = "融合通信"; //处置弹窗标题
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
      console.log(item, index);
      this.$confirm("删除与该事件的关联?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false,
      })
        .then(() => {
          let data = {
            id: item.id,
            eventId: 0,
            type: this.itemClickData.type,
          };
          this.$api.relateEvent(data).then((res) => {
            if (res.errorcode == 0) {
              this.$message({
                message: "操作成功",
                type: "success",
              });
              let type = this.eventChainValue;
              switch (type) {
                case 0:
                  this.getselectAllList();
                  break;
                case 1:
                  this.getFaxList();
                  break;
                case 2:
                  this.getPhoneList();
                  break;
                case 3:
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
  border: 1px solid rgba(219, 219, 219, 1);
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
}
.cardTime {
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: left;
}
.cardIphone {
  width: 100%;
  word-wrap: break-word;
  text-align: left;
  text-indent: 20px;
  padding: 0 10px;
}
.iconCalssCard {
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: right;
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
.red {
  border-bottom: 5px solid cornflowerblue;
}
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
</style>
