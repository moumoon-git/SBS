<template>
  <div class="jlsq-big-container">
    <div class="container jlsq">
      <!-- 页面切换标签 -->
      <el-tabs
        v-model="tikuType"
        @tab-click="handleClick"
      >
        <el-tab-pane
          label="集体奖励激励申请"
          name="3"
        />
        <el-tab-pane
          label="个人奖励激励申请"
          name="2"
        />
        <el-tab-pane
          label="其他奖励和慰问申请"
          name="1"
        />
      </el-tabs>
      <!-- 第二行的内容 -->
      <div class="row2 header-stats">
        <!-- 审核状态统计值 -->
        <div>
          总人数：
          <span style="color: #333333">{{ auditStatusStat.stat1 }}</span>
        </div>
        <div>
          待审核：
          <span style="color: #f2b626">{{ auditStatusStat.stat2 }}</span>
        </div>
        <div>
          已审核：
          <span style="color: #0bd295">{{ auditStatusStat.stat3 }}</span>
        </div>
        <div>
          已驳回：
          <span style="color: #f66e6e">{{ auditStatusStat.stat4 }}</span>
        </div>
        <div>
          待提交：
          <span style="color: #666666">{{ auditStatusStat.stat5 }}</span>
        </div>

        <!-- <div>预览&下载政策文件</div> -->
        <div />
      </div>
      <!-- 第一行的内容 -->
      <div class="row1 header-operation">
        <!-- 奖励类型选择框 -->
        <el-select
          v-model="search.awardType"
          clearable
          class="input-select"
          placeholder="选择奖励类型"
          @change="getDataList"
        >
          <el-option
            v-for="item in awardTypeOptions"
            :key="item.id"
            :label="item.registerName"
            :value="item.id"
          />
        </el-select>
        <!-- 审核状态选择框 -->
        <el-select
          v-model="search.auditStatus"
          clearable
          class="input-select"
          placeholder="审核状态"
          @change="getDataList"
        >
          <el-option
            v-for="item in auditStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <!-- 日期范围选择框 -->
        <div class="date-block">
          <el-date-picker
            v-model="search.dateTime"
            class="date-range"
            type="daterange"
            align="right"
            value-format="yyyy-MM-dd"
            clearable
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="getDataList"
          />
        </div>
        <!-- 表单输入框和按钮 -->
        <div class="search-container">
          <input
            v-model="search.tableInput"
            placeholder="请输入关键字"
            @change="getDataList"
          >
          <div
            v-if="search.tableInput"
            class="search-icon el-icon-close"
            @click="
              search.tableInput = '';
              getDataList();
            "
          />
          <div
            v-else
            class="search-icon el-icon-search"
          />
        </div>
        <!-- <el-input
          class="input-text search"
          clearable
          v-model="search.tableInput"
          placeholder="请输入关键字"
          suffix-icon="el-icon-search"
          @change="getDataList"
        ></el-input>-->
        <!-- <el-button class="search-button" type="primary" @click="getDataList">查询</el-button> -->
        <div
          class="more-button-container"
          :class="moreBtnIsFocus ? 'more-button-focus' : 'more-button-unfocus'"
        >
          <div @click="moreBtnIsFocus = !moreBtnIsFocus">
            <span>更多</span>
            <!-- <i :class="moreBtnIsFocus?'el-icon-caret-top':'el-icon-caret-bottom'"></i> -->
            <i class="el-icon-caret-bottom" />
          </div>
          <div class="more-button-content">
            <div class="more-button-content-item-header">
              导出
            </div>
            <!-- <div class="more-button-content-item" @click="downloadtemplate()">
              导出模板
            </div> -->
            <div
              class="more-button-content-item"
              @click="exportSelectAll()"
            >
              导出已选择数据
            </div>
            <div
              class="more-button-content-item"
              @click="conditionExport()"
            >
              导出所有查询数据
            </div>
            <div class="more-button-content-line" />
            <!-- <div class="more-button-content-item" @click="moreClick(4)">
              导入
            </div> -->
          </div>
        </div>
        <!-- <el-button type="primary" @click="handleCommand()" size="medium" class="jqsq-content-header-export-button">申报奖励</el-button> -->
        <!-- 隐藏的按钮 -->
        <div style="z-index: -1; position: absolute">
          <el-upload
            :with-credentials="true"
            :show-file-list="false"
            :on-progress="beforeUploadFile"
            :on-error="handleError"
            :on-success="handleAvatarSuccess"
            :action="documenttoken"
            class="import-container"
          >
            <el-tooltip
              placement="top"
              effect="light"
            >
              <div slot="content">
                请填写我们提供
                <br>的模板进行导入
              </div>
              <el-button
                ref="importButton"
                v-loading.fullscreen.lock="fullscreenLoading"
                element-loading-text="正在导入奖励列表，可能需要几分钟时间，请耐心等待.."
                plain
              >
                <img src="../../../../assets/img/download.svg">
                导入
              </el-button>
            </el-tooltip>
          </el-upload>
          <el-button
            ref="exportTemplateBtn"
            class="export-template"
            type="primary"
            @click="downloadtemplate()"
          >
            导出模板
          </el-button>
          <el-dropdown class="export-container">
            <el-button plain>
              <img src="../../../../assets/img/upload.svg">
              导出
            </el-button>
            <el-dropdown-menu
              slot="dropdown"
              split-button="true"
            >
              <el-dropdown-item
                ref="conditionExportBtn"
                @click.native="conditionExport()"
              >
                导出已选择数据
              </el-dropdown-item>
              <el-dropdown-item
                ref="unconditionExportBtn"
                @click.native="exportSelectAll()"
              >
                导出所有查询数据
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

        <!-- 申报按钮以及对应弹窗 -->
        <el-dropdown
          class="declare-button"
          trigger="click"
          @command="handleCommand"
        >
          <el-button type="primary">
            申报奖励
            <i class="el-icon-caret-bottom" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(item, index) in tikuAddType"
              :key="index"
              :command="item"
            >
              {{ item.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <!-- 列表的内容 -->
      <div class="jlsq-content-table">
        <el-table
          height="100%"
          :data="tableData"
          border
          @selection-change="rewardDataChange"
        >
          <el-table-column
            v-if="moreBtnIsFocus"
            type="selection"
            header-align="left"
            align="center"
            width="55"
          />
          <el-table-column
            prop="id"
            label="文档编号"
            width="200"
            align="center"
          />
          <!-- <el-table-column prop="item2" label="奖励" width="300" align="center"></el-table-column> -->
          <el-table-column
            prop="reportIdString"
            label="申报对象"
            align="center"
          />
          <el-table-column
            prop="tikuIdString"
            label="奖励类型"
            align="center"
          />
          <el-table-column
            prop="rewardAmount"
            label="申领奖励金额"
            align="center"
          >
            <template slot-scope="scope">
              <span>￥{{ scope.row.rewardAmount }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="platformName"
            label="填报单位"
            align="center"
          />
          <el-table-column
            prop="reportTime"
            label="申报时间"
            align="center"
          />
          <el-table-column
            prop="statusString"
            label="状态"
            width="80"
            align="center"
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.statusString === '待提交'"
                style="color: #666666"
              >待提交</span>
              <span
                v-if="scope.row.statusString === '待审核'"
                style="color: #f2b626"
              >待审核</span>
              <span
                v-if="scope.row.statusString === '已审核'"
                style="color: #0bd295"
              >已审核</span>
              <span
                v-if="scope.row.statusString === '已驳回'"
                style="color: #f66e6e"
              >已驳回</span>
            </template>
          </el-table-column>
          <el-table-column
            prop
            label="操作"
            width="150"
            align="right"
          >
            <template slot-scope="scope">
              <!-- <img
                v-if="scope.row.statusString==='待提交'"
                @click="baoshen(scope.row.id)"
                src="../../../../assets/img/sh.svg"
                style="cursor:pointer;width:20px;margin-right:10px"
              />
              <img
                v-if="scope.row.statusString==='待提交'"
                @click="updateCheck(scope.row.id)"
                src="../../../../assets/img/edit.svg"
                style="cursor:pointer;width:20px;margin-right:10px"
              />
              <img
                v-if="scope.row.statusString==='已驳回'"
                @click="newbaoshen(scope.row.id)"
                src="../../../../assets/img/sh.svg"
                style="cursor:pointer;width:20px;margin-right:10px"
              />
              <img
                v-if="scope.row.statusString!='待提交'"
                src="../../../../assets/img/eye.svg"
                @click="showCheck(scope.row.id)"
                style="cursor:pointer;width:20px;margin-right:10px"
              />
              <img
                src="../../../../assets/img/del.svg"
                @click="deleteHandle(scope.row)"
                style="cursor:pointer;width:20px;margin-right:10px"
              />-->
              <el-tooltip
                v-if="scope.row.statusString === '待提交'"
                class="item"
                content="报审"
                effect="dark"
                placement="top"
              >
                <div
                  class="button-view button-baoshen"
                  @click="baoshen(scope.row.id)"
                />
              </el-tooltip>
              <el-tooltip
                v-if="scope.row.statusString === '待提交'"
                class="item"
                content="编辑"
                effect="dark"
                placement="top"
              >
                <div
                  class="button-view button-edit"
                  @click="updateCheck(scope.row.id)"
                />
              </el-tooltip>
              <el-tooltip
                v-if="scope.row.statusString === '已驳回'"
                class="item"
                content="重新报审"
                effect="dark"
                placement="top"
              >
                <div
                  class="button-view button-baoshen"
                  @click="newbaoshen(scope.row.id)"
                />
              </el-tooltip>
              <el-tooltip
                v-if="scope.row.statusString != '待提交'"
                class="item"
                content="查看"
                effect="dark"
                placement="top"
              >
                <div
                  class="button-view"
                  @click="showCheck(scope.row.id)"
                />
              </el-tooltip>
              <el-tooltip
                class="item"
                content="删除"
                effect="dark"
                placement="top"
              >
                <div
                  class="button-view button-delete"
                  @click="deleteHandle(scope.row)"
                />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 底部分页按钮  v-if="scope.row.statusString=='已驳回'||scope.row.statusString==='待提交'"-->
      <div class="jlsq-content-footer">
        <el-pagination
          background
          :current-page="pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <!-- 查看弹窗，import checkDialog.vue -->
      <checkDialog
        ref="checkDialog"
        :manager-id="manageId"
        :tiku-type="tikuType"
        @getDataList="getDataList()"
        @queryHistoryRecord="queryHHistoryRecord"
      />

      <!-- 新增/编辑弹窗 -->
      <el-dialog
        :title="type == 'add' ? '新增申请信息' : '编辑申请信息'"
        :visible.sync="reportDialogVisible"
        width="1019px"
        class="dialog"
        :close-on-click-modal="closeClickModal"
      >
        <!-- 1. 顶部表单说明 -->
        <div
          v-if="dataForm.remark"
          class="dialog-caption"
        >
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAB1ElEQVRIS8WWPUtcQRSGn/cGDBYKgoVtCjGmFlkLFSEEIZZ6Bf9HUlnauD9E3KulIiSFRIss9sGvImVSCBYJkgTcE2bv3t27urpzR7hOO2fmmTPnnTOv6DPMEAmzEL1HNoMxjhhpLjOuEZeYvkJjn5hjCXtsSz02aQnLoA2MiX4Ha86Lc7B1xew+FN8TaAmvMG0BFS/Q/aA6sjXFfL87dQ9oCfOY3AlHA2HZsitky4r5kt+nC9iCfQIGngjLlv9D9i4PbQNb13jildnCUbrh4ZzPuVym09n1doA1pzTPmsWNFJREPkAXU9eqzaS6cup2ajTt+K6mOBBkK069ar6zHZ16S9+dKgjIOSs2KasxB+pSUt9MQ4Bpp5iXbUdVZB/6QvIBwUBVZYmOMNe6CoxQoDiW1fQDGCuAC6thCvjpMvyD8bIUoPj7DMBnuNLioinW2jrVSkUTbYJ9LFTD4GD3LEIefjDQPfyQ1vZiEIjg9qbpM7yGcwOutQU178VvMDwJB2/g15kXr928s2gr8j29PYGh1/B5Cn5f+AC7v6dWls7H+H3APohOTO8PuAV1fqYci9G+2jJNVA5ank3Ml6c0I9wFzay+RUtEVulp9Ruqo8aej9X/D+WE04k0haOlAAAAAElFTkSuQmCC"
            alt="alert"
          >
          {{ dataForm.remark }}
        </div>
        <!-- 2. 正文内容 -->
        <div class="report-wrapper">
          <!-- 2.1 左边表单 -->
          <div class="left-content-container">
            <div
              v-if="tikuType == 2"
              class="item-container"
            >
              <label
                class="item-label"
                for="applicant-select"
              >申请人</label>
              <span class="item-content applicant-select">
                <!--
                  * @author tanjinfeng
                  * @date 2020-10-13
                  * @desc 申请人选择改成弹窗组件
                -->
                <!-- modify start -->
                <!-- <el-select id="applicant-select" v-model="applyPersonOptionsId" placeholder="请选择">
                  <el-option
                    v-for="(item, index) in applyPersonOptions"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select> -->
                <sv-select-contact
                  v-model="applyPersonOptions"
                  title="申请人"
                  :multiple="true"
                  :api="[
                    '/sys/platform/getPlatformTreeByPlatformId',
                    '/approve/approveMemberEntity/listByPlatform',
                  ]"
                  :group-tree-props="{
                    children: 'children',
                    label: 'platformName',
                    value: 'id',
                  }"
                />
                <!-- modify end -->
              </span>
            </div>
            <template v-for="(item, index) in dataForm.question">
              <div
                v-if="item.topicName !== '图片'"
                :key="`question${item.id}`"
                class="item-container"
              >
                <label
                  class="item-label"
                  :for="`question${item.id}`"
                >{{
                  item.title
                }}</label>
                <span class="item-content">
                  <template v-if="item.topicName === '单选题'">
                    <el-radio-group v-model="item.answer">
                      <div
                        v-for="v in item.approveSelectList"
                        :key="`danxuan${v.id}`"
                        style="margin-bottom: 5px"
                      >
                        <el-radio :label="v.id">
                          {{ v.content }}
                          <input
                            v-if="v.ifInput === '1' && item.answer == v.id"
                            v-model="item.remark"
                            type="text"
                            class="content"
                          >
                        </el-radio>
                      </div>
                    </el-radio-group>
                  </template>
                  <template v-if="item.topicName === '混答+多选'">
                    <el-checkbox-group v-model="item.answer">
                      <div
                        v-for="v in item.approveSelectList"
                        :key="`hundaduoxuan${v.id}`"
                      >
                        <el-checkbox
                          :key="`hundaduoxuan2${v.id}`"
                          :label="v.id"
                        >{{ v.content }}</el-checkbox>
                        <input
                          v-if="
                            v.ifInput === '1' &&
                              item.answer.find((id) => id == v.id)
                          "
                          v-model="item.remark"
                          type="text"
                          class="content"
                        >
                      </div>
                    </el-checkbox-group>
                  </template>
                  <template v-if="item.topicName === '多选题'">
                    <el-checkbox-group v-model="item.answer">
                      <div
                        v-for="v in item.approveSelectList"
                        :key="`duoxuan${v.id}`"
                      >
                        <el-checkbox
                          :key="`duoxuan2${v.id}`"
                          :label="v.id"
                        >{{
                          v.content
                        }}</el-checkbox>
                      </div>
                    </el-checkbox-group>
                  </template>
                  <template v-if="item.topicName === '混答+单选'">
                    <el-radio-group v-model="item.answer">
                      <div
                        v-for="v in item.approveSelectList"
                        :key="`hundadanxuan${v.id}`"
                        style="margin-bottom: 5px"
                      >
                        <el-radio :label="v.id">{{ v.content }}</el-radio>
                        <input
                          v-if="v.ifInput === '1' && item.answer == v.id"
                          v-model="item.remark"
                          type="text"
                          class="content"
                        >
                      </div>
                    </el-radio-group>
                  </template>
                  <template v-if="item.topicName === '简答-输入'">
                    <input
                      :id="`question${item.id}`"
                      v-model="item.answer"
                      type="text"
                      class="content"
                    >
                  </template>
                  <template v-if="item.topicName === '简答-文本'">
                    <el-input
                      :id="`question${item.id}`"
                      v-model="item.answer"
                      type="textarea"
                      style="width: 100%"
                      autosize
                      resize="none"
                    />
                  </template>
                </span>
              </div>
              <div
                v-if="item.topicName === '图片'"
                :key="`question${item.id}`"
                class="item-img-container"
              >
                <label class="item-label">图片</label>
                <div
                  v-if="item.topicName === '图片'"
                  class="item-img-content"
                >
                  <el-upload
                    action="https://jsonplaceholder.typicode.com/posts/"
                    list-type="picture-card"
                    :on-remove="(res) => handleRemove(res, index)"
                    :before-upload="beforeUpload"
                    :http-request="(file) => beforeAvatarUpload(file, index)"
                    :limit="2"
                    :file-list="item.answer"
                    :on-exceed="overFile"
                    multiple
                  >
                    <i
                      class="el-icon-plus"
                      style="line-height: 5"
                    />
                  </el-upload>
                </div>
              </div>
            </template>
            <div class="item-container">
              <label
                class="item-label"
                for="reward-amount"
              >申请奖励金额</label>
              <span class="item-content">
                <input
                  id="reward-amount"
                  v-model="dataForm.rewardAmount"
                  class="content"
                >
              </span>
            </div>

            <div class="item-file-container">
              <label class="item-label">附件</label>
              <div class="item-content">
                <div
                  class="file-button-container"
                  @click="uploadActive()"
                >
                  <img
                    alt
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAPklEQVQ4T2NkIADsJ/37j6zkYB4TIz4teCVBGkcNZBgNQ4wUxIieLAilS0LyI9FAQmEymvVGsx5mGqF6iQ0ASP5LTf0QRA4AAAAASUVORK5CYII="
                  >
                  <span>上传附件</span>
                  <input
                    ref="file_button_inner"
                    class="file-button-inner"
                    type="file"
                    accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*,video/*,audio/*,.xls,.xlsx,.txt,.pdf"
                    multiple
                    @change="getFile($event)"
                  >
                </div>
                <div class="file-preview">
                  <template v-for="(file, index) in dataForm.documentList">
                    <span
                      v-if="isImg(file.url)"
                      :key="`img${index}`"
                      class="img-wrapper"
                    >
                      <img
                        :alt="file.name"
                        :src="`${$window.SITE_CONFIG['cloudUrl']}${file.url}`"
                      >
                      <div
                        class="close el-icon-close"
                        @click="dataForm.documentList.splice(index, 1)"
                      />
                    </span>
                  </template>
                  <template v-for="(file, index) in dataForm.documentList">
                    <div
                      v-if="!isImg(file.url)"
                      :key="`img${index}`"
                      class="file-wrapper"
                    >
                      <a
                        :href="`${$window.SITE_CONFIG['cloudUrl']}${file.url}`"
                      >{{ file.name }}</a>
                      <div
                        class="close el-icon-close"
                        @click="dataForm.documentList.splice(index, 1)"
                      />
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <!-- 2.2 右边申报进度展示 -->
          <div class="right-content-container">
            <div class="title">
              审批流程
            </div>
            <el-button
              class="histroy-button"
              type="text"
              @click="queryHHistoryRecord(dataForm.id)"
            >
              历史申报记录
            </el-button>
            <!-- A. 新增时的流程 -->
            <div
              v-if="type == 'add'"
              class="progress-container"
            >
              <!-- A.0. 顶部审批流程选择 -->
              <!-- <el-select
                class="progress-select"
                v-model="manageId"
                @change="changeManage"
                clearable
                placeholder="请选择审批流程"
              >
                <el-option
                  v-for="item in manageList"
                  :key="`managelist${item.value}`"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>-->

              <!-- A.1. 填报单位 -->
              <div class="progress-item-container">
                <div class="progress-item-header">
                  <span>填报</span>
                  <span>{{ tianbaoUnit }}</span>
                </div>

                <div class="progress-item-content">
                  <div
                    v-if="createUser.name"
                    class="each-line"
                  >
                    <span class="label">负责人：</span>
                    <span v-if="createUser.name">{{ createUser.name }}</span>
                    <span
                      v-if="createUser.role"
                    >（{{ createUser.role }}）</span>
                    <!-- <span class="phone" v-if="createUser.phone">{{createUser.phone}}</span> -->
                  </div>
                </div>
              </div>

              <!-- A.2. 报审单位 -->
              <div
                class="progress-item-container has-pre-progress next-progress"
              >
                <div class="progress-item-header">
                  <span>报审单位</span>
                  <span>
                    <el-select
                      v-model="nextPlatformId"
                      class="progress-select progress-item-select"
                      clearable
                      :placeholder="baoshenData.name"
                      @change="UnitChange"
                    >
                      <el-option
                        v-for="(item, index) in platformOptions"
                        :key="`platform${index}`"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </span>
                </div>
                <div class="progress-item-content">
                  <div
                    v-if="baoshenData.contactor.name"
                    class="each-line"
                  >
                    <span class="label">负责人：</span>
                    <span v-if="baoshenData.contactor.name">{{
                      baoshenData.contactor.name
                    }}</span>
                    <span
                      v-if="baoshenData.contactor.role"
                    >（{{ baoshenData.contactor.role }}）</span>
                    <!-- <span
                      class="phone"
                      v-if="baoshenData.contactor.phone"
                    >{{baoshenData.contactor.phone}}</span>-->
                  </div>
                </div>
              </div>

              <!-- A.3. 后续待审批单位 -->
              <div
                v-for="(item, index) in unitList"
                :key="`unit${index}`"
              >
                <div
                  v-if="index > 0"
                  class="progress-item-container has-pre-progress inactive-progress"
                >
                  <div class="progress-item-header">
                    <span>待审核</span>
                    <span>{{ item.depName }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- B. 编辑时的流程 -->
            <div
              v-if="type != 'add'"
              class="progress-container"
            >
              <!-- B.1. 填报单位 -->
              <div
                v-for="(item, index) in processList"
                :key="`edit_progress_${index}`"
                class="progress-item-container"
                :class="{
                  'has-pre-progress next-progress':
                    processType[index] == '报审单位',
                  'has-pre-progress inactive-progress':
                    processType[index] == '待审核',
                  'has-pre-progress': processType[index] != '填报',
                }"
              >
                <div
                  v-if="processType[index] == '报审单位'"
                  class="progress-item-header"
                >
                  <span>报审单位</span>
                  <span>
                    <el-select
                      v-model="nextPlatformId"
                      class="progress-select progress-item-select"
                      clearable
                      :placeholder="baoshenData.name"
                      @change="UnitChange"
                    >
                      <el-option
                        v-for="(item, index) in platformOptions"
                        :key="`platform_edit_${index}`"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </span>
                </div>
                <div
                  v-else
                  class="progress-item-header"
                >
                  <span>{{ processType[index] }}</span>
                  <span>{{
                    item.approveApproveEntity.platformIdString == ""
                      ? item.depName
                      : item.approveApproveEntity.platformIdString
                  }}</span>
                </div>

                <div class="progress-item-content">
                  <div
                    v-if="item.approveApproveEntity.gmtCreate"
                    class="each-line"
                  >
                    <span class="label">填报时间：</span>
                    <span>{{ item.approveApproveEntity.gmtCreate }}</span>
                  </div>
                  <div
                    v-if="item.approveApproveEntity.sysUserVo.name"
                    class="each-line"
                  >
                    <span class="label">填报人：</span>
                    <span v-if="item.approveApproveEntity.sysUserVo.name">{{
                      item.approveApproveEntity.sysUserVo.name
                    }}</span>
                    <span
                      v-if="item.approveApproveEntity.sysUserVo.role"
                    >（{{ item.approveApproveEntity.sysUserVo.role }}）</span>
                    <!-- <span
                      class="phone"
                      v-if="item.approveApproveEntity.sysUserVo.phone"
                    >{{item.approveApproveEntity.sysUserVo.phone}}</span>-->
                  </div>
                  <div
                    v-if="item.chargeMan.name"
                    class="each-line"
                  >
                    <span class="label">负责人：</span>
                    <span v-if="item.chargeMan.name">{{
                      item.chargeMan.name
                    }}</span>
                    <span
                      v-if="item.chargeMan.position"
                    >（{{ item.chargeMan.position }}）</span>
                    <!-- <span class="phone" v-if="item.chargeMan.mobile1">{{item.chargeMan.mobile1}}</span> -->
                  </div>
                  <div
                    v-if="item.approveApproveEntity.approveResult"
                    class="each-line"
                  >
                    <span class="label">审批结果：</span>
                    <span
                      v-if="item.approveApproveEntity.approveResult == '0'"
                      style="color: #70b603"
                    >审核通过</span>
                    <span
                      v-if="item.approveApproveEntity.approveResult == '1'"
                      style="color: #d9001b"
                    >已驳回</span>
                  </div>
                  <div
                    v-if="item.approveApproveEntity.approveComments"
                    class="each-line"
                  >
                    <span class="label">审批意见：</span>
                    <span>{{ item.approveApproveEntity.approveComments }}</span>
                  </div>
                </div>
              </div>

              <!-- <div
                class="check-process-wrapper"
                v-for="(item,index) in processList"
                :key="`show${index}`"
              >
                <span
                  :class="!item.approveApproveEntity.platformId?'check-process-head-grey':'check-process-head-1'"
                >{{processType[index]}}</span>

                <span v-if="processType[index] =='报审单位'">
                  <el-select
                    clearable
                    class="check-process-content-1"
                    v-model="nextPlatformId"
                    :placeholder="baoshenData.name"
                    @change="UnitChange"
                  >
                    <el-option
                      v-for="(item,index) in platformOptions"
                      :key="`platform1${index}`"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </span>

                <span
                  v-if="processType[index] != '报审单位'"
                  :class="!item.approveApproveEntity.platformId?'check-process-content-grey':'check-process-content-1'"
                >{{item.approveApproveEntity.platformIdString==''?item.depName:item.approveApproveEntity.platformIdString}}</span>
                <div class="check-process-main">
                  <el-form ref="form" label-width="100px">
                    <el-form-item
                      v-if="item.approveApproveEntity.gmtCreate!=''"
                      label="填报时间："
                    >{{item.approveApproveEntity.gmtCreate}}</el-form-item>
                    <el-form-item
                      v-if="item.approveApproveEntity.sysUserVo.name!=''"
                      label="填报人："
                    >
                      <span>{{item.approveApproveEntity.sysUserVo.name}}({{item.approveApproveEntity.sysUserVo.role}})</span>
                      <span
                        style="float:right;margin-right:5%"
                      >{{item.approveApproveEntity.sysUserVo.phone}}</span>
                    </el-form-item>
                    <el-form-item v-if="item.chargeMan.name!=''" label="负责人：">
                      <span>{{item.chargeMan.name}}({{item.chargeMan.position}})</span>
                      <span style="float:right;margin-right:5%">{{item.chargeMan.mobile1}}</span>
                    </el-form-item>
                    <el-form-item
                      v-if="item.approveApproveEntity.approveResult!=''"
                      label="审批结果："
                    >
                      <span
                        v-if="item.approveApproveEntity.approveResult=='0'"
                        style="color:#70B603"
                      >审核通过</span>
                      <span
                        v-if="item.approveApproveEntity.approveResult=='1'"
                        style="color:#D9001B "
                      >已驳回</span>
                    </el-form-item>
                    <el-form-item
                      v-if="item.approveApproveEntity.approveComments!=''"
                      label="审批意见："
                    >{{item.approveApproveEntity.approveComments}}</el-form-item>
                  </el-form>
                </div>
                <svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <defs>

                    <marker
                      id="arrow-blue"
                      markerUnits="strokeWidth"
                      markerWidth="12"
                      markerHeight="12"
                      viewBox="0 0 12 12"
                      refX="6"
                      refY="6"
                      orient="auto"
                    >
                      <path d="M2,2 L10,6 L2,10 L6,6 L2,2" style="fill: lightskyblue;" />
                    </marker>

                    <marker
                      id="arrow-grey"
                      markerUnits="strokeWidth"
                      markerWidth="12"
                      markerHeight="12"
                      viewBox="0 0 12 12"
                      refX="6"
                      refY="6"
                      orient="auto"
                    >
                      <path d="M2,2 L10,6 L2,10 L6,6 L2,2" style="fill: lightgrey;" />
                    </marker>
                  </defs>
                  <line
                    x1="50"
                    y1="0"
                    x2="50"
                    y2="50"
                    stroke="lightskyblue"
                    stroke-width="2"
                    marker-end="url(#arrow-blue)"
                    v-if="index<processList.length-1&&item.approveApproveEntity.nextPlatformId!=''&&item.approveApproveEntity.approveResult!=1"
                  />
                  <svg
                    width="100%"
                    height="100%"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line
                      x1="50"
                      y1="00"
                      x2="50"
                      y2="50"
                      stroke="lightgrey"
                      stroke-width="2"
                      marker-end="url(#arrow-grey)"
                      v-if="index<processList.length-1 && processList[index+1].approveApproveEntity.platformId==''"
                    />
                  </svg>
                </svg>
              </div>-->
            </div>
          </div>
        </div>

        <!-- 3. 表单底部取消确定按钮 -->
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="reportDialogVisible = false">
            取消
          </el-button>
          <el-button
            type="primary"
            @click="reportSubmit()"
          >
            确定
          </el-button>
        </div>
      </el-dialog>

      <historyRecord ref="historyRecord" />
    </div>
  </div>
</template>

<script>
import historyRecord from '@/views/modules/approveLevel/resourceManage/historyRecord.vue';
import Cookies from 'js-cookie';
import checkDialog from './checkDialog';

const httpaddress = window.SITE_CONFIG.baseUrl;
export default {
  components: {
    checkDialog,
    historyRecord,
  },
  data() {
    return {
      closeClickModal: false, // 禁止点击model关闭dialog
      rewardDataSelection: [],
      // showName: true,
      // 当前激活的标签页，取值：'first', 'second', 'third'
      activeTab: 'first',
      // 平台选项
      platformOptions: [],
      // 申请人选项
      applyPersonOptions: [],
      // 申请人id
      applyPersonOptionsId: [],
      // 弹窗类型
      type: '',
      // 新增奖励类型
      tikuType: '3',
      tikuAddType: [],
      tikuId: '',
      // 审核流程下拉框
      manageList: [],
      manageId: '',
      // 填报人
      createUser: {
        id: '',
        name: '',
        phone: '',
        role: '',
      },
      // 新增
      // 填报单位
      tianbaoUnit: '',
      // 当前平台
      nowPlatForm: '',
      // 报审平台数据
      platformData: [],
      // 报审单位
      baoshenData: {
        id: '',
        name: '',
        contactor: {
          id: '', name: '', role: '', phone: '',
        },
      },
      // 流程单位
      unitList: [],
      // 类型
      processType: [],
      processList: [],
      // 表单
      dataForm: {
        id: '',
        name: '',
        remark: '',
        question: [],
        documentList: [],
        rewardAmount: '',
      },
      nextPlatformId: '',
      // 详情数据
      dataDetailData: {},
      awardTypeOptions: [],
      awardClassOptions: [
        {
          value: '选项1',
          label: '严格落实人屋那关及技防措施',
        },
        {
          value: '选项2',
          label: '积极投入技防建设',
        },
        {
          value: '选项3',
          label: '其他奖励',
        },
      ],
      auditStatusOptions: [
        {
          value: '0',
          label: '待提交',
        },
        {
          value: '1',
          label: '待审核',
        },
        {
          value: '2',
          label: '已审核',
        },
        {
          value: '3',
          label: '已驳回',
        },
      ],
      // 查询数据
      search: {
        tableInput: '',
        dateTime: [],
        awardType: '',
        awardClass: '',
        auditStatus: '',
      },
      // 申报弹窗是否可见
      reportDialogVisible: false,
      // 申报弹窗左边表单内容
      reportForm: {
        agent: '',
        count: '',
        num: '',
        flow: '',
        lastyear: '',
        total: '',
        type: [false, false, false],
        basic: '',
        amount: '',
      },
      // 审核状态统计值
      auditStatusStat: {
        stat1: 0,
        stat2: 0,
        stat3: 0,
        stat4: 0,
        stat5: 0,
      },
      // 列表数据数组
      tableData: [],
      // 分页数据
      totalPage: 0,
      pageIndex: 1,
      pageSize: 10,
      fullscreenLoading: false,
      documenttoken: '',
      dataRules: {
        rewardAmount: [
          {
            required: true,
            message: '申请奖励金额不能为空',
            trigger: 'blur',
          },
        ],
      },
      // “更多”按钮触发
      moreBtnIsFocus: false,
    };
  },
  mounted() {
    this.getAwardTypeOptions();
    const user = this.$cookie.get('userId');
    // this.createUser = user.substring(2, user.length);
    this.nowPlatForm = this.$cookie.get('platformId');
    this.getDataList();
    // this.getCount();
  },
  created() {
    this.documenttoken = `${httpaddress}/approve/approveReward/xlsInput?token=${this.$cookie.get(
      'token',
    )}`;
    // this.applyPerson();
  },
  methods: {
    getCount() {
      // 总人数
      this.auditStatusStat.stat1 = this.tableData.length;
      let stat2Count = 0;
      let stat3Count = 0;
      let stat4Count = 0;
      let stat5Count = 0;
      for (let i = 0; i < this.tableData.length; i++) {
        // 待审核：1
        if (this.tableData[i].status == '1') {
          stat2Count++;
        }
        // 已审核：2
        if (this.tableData[i].status == '2') {
          stat3Count++;
        }
        // 已驳回：3
        if (this.tableData[i].status == '3') {
          stat4Count++;
        }
        // 待提交：0
        if (this.tableData[i].status == '0') {
          stat5Count++;
        }
      }
      this.auditStatusStat.stat2 = stat2Count;
      this.auditStatusStat.stat3 = stat3Count;
      this.auditStatusStat.stat4 = stat4Count;
      this.auditStatusStat.stat5 = stat5Count;
    },
    deleteHandle(row) {
      const ids = [row.id];
      console.log('row', row);
      this.$confirm('确定对进行删除操作', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          if (row.status == 1 || row.status == 2) {
            this.$alert('该流程正在进行中无法删除', '提示', {
              confirmButtonText: '确定',
              callback: (action) => {

              },
            });
          } else {
            this.$http({
              url: this.$http.adornUrl('/approve/approveReward/delete'),
              method: 'post',
              data: this.$http.adornData({ ids }),
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.getDataList();
                  },
                });
              } else {
                this.$message.error(data.msg);
              }
            });
          }
        })
        .catch(() => {});
    },
    // 根据题库类型获取流程
    getAwardTypeOptions() {
      // console.log("tikutype", this.tikuType);
      this.$http({
        // url: this.$http.adornUrl(
        //   `/approve/approveManage/getManageListByType?type=${this.tikuType}`
        // ),
        url: this.$http.adornUrl(
          `/approve/approveTikuType/getTikuListByCondition?tikuType=${this.tikuType}`,
        ),
        method: 'get',
        param: this.$http.adornParams(),
      }).then(({ data }) => {
        // data 是获取到的所有数据
        if (data && data.code === 0) {
          // this.tikuAddType = data.data;
          this.awardTypeOptions = data.data;
        } else {
          this.$message({
            message: `${data.msg}`,
            type: 'error',
          });
        }
      });
      this.$http({
        url: this.$http.adornUrl(
          `/approve/approveManage/getManageListByType?type=${this.tikuType}`,
        ),
        method: 'get',
        param: this.$http.adornParams(),
      }).then(({ data }) => {
        // data 是获取到的所有数据
        if (data && data.code === 0) {
          this.tikuAddType = data.data;
          // this.awardTypeOptions = data.data;
        } else {
          this.$message({
            message: `${data.msg}`,
            type: 'error',
          });
        }
      });
    },
    clearDialog() {
      this.dataForm.rewardAmount = '';
      // this.applyPersonOptionsId = "";
      this.applyPersonOptions = [];
      this.applyPersonOptionsId = [];
      this.nextPlatformId = '';
      this.manageId = '';
      this.unitList = [];
      this.platformOptions = [];
      this.tianbaoUnit = '';
      this.createUser.id = '';
      this.createUser.name = '';
      this.createUser.role = '';
      this.createUser.phone = '';
      this.baoshenData = {
        id: '',
        name: '',
        contactor: {
          id: '', name: '', role: '', phone: '',
        },
      };
      // this.baoshen;
    },
    // 审核流程下拉框确定
    changeManage(manageId) {
      this.getUnit();
      this.getPlatformById(this.nowPlatForm);
    },
    // 选择新增下拉
    handleCommand(command) {
      // this.showName = true;
      console.log('command', command);
      this.manageList = [];
      this.dataForm.id = '';
      this.applyPerson();
      this.clearDialog();
      this.manageId = command.id;
      this.tikuId = command.tikuId;
      this.type = 'add';
      this.$http({
        url: this.$http.adornUrl(
          `/approve/approveReward/applyReward/${this.tikuId}`,
        ),
        method: 'get',
        param: this.$http.adornParams(),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.processList = data.approveManageList;
          data.approveManageList.forEach((item) => {
            this.manageList.push({
              value: item.id,
              label: item.name,
            });
          });
          this.dataForm.name = data.approveTikuEntity.registerName;
          this.dataForm.remark = data.approveTikuEntity.remark;
          this.dataForm.documentList = [];
          this.dataForm.question = data.approveTikuEntity.approveQuestionList;
          this.dataForm.question.map((v) => {
            if (
              v.topicName === '单选题'
              || v.topicName === '混答+单选'
              || v.topicName === '混答+多选'
              || v.topicName === '多选题'
              || v.topicName === '图片'
            ) {
              v.answer = [];
              v.remark = '';
            } else if (
              v.topicName === '简答-文本'
              || v.topicName === '简答-输入'
            ) {
              v.answer = '';
              v.remark = '';
            }
          });
          this.tabType = 'reward';
          this.reportDialogVisible = true;
          console.log('表单数据', data);
          this.getUnit();
          this.getPlatformById(this.nowPlatForm);
          // this.tikuAddType = data.data;
        } else {
          this.$message({
            message: `${data.msg}`,
            type: 'error',
          });
        }
      });
    },
    // 下个平台的下拉框改变
    UnitChange() {
      const index = this.platformData.findIndex(
        (item) => item.id == this.nextPlatformId,
      );
      // console.log("1234", this.dataForm.nextPlatformId, this.platformData);
      if (index >= 0) {
        // console.log("下拉框改变", index, this.platformData[index]);
        if (this.platformData[index].contactor != null) {
          // console.log("新增报审人", this.baoshenData);
          this.baoshenData.id = this.platformData[index].id;
          this.baoshenData.name = this.platformData[index].name;
          this.baoshenData.contactor.id = this.platformData[index].contactor.id;

          this.baoshenData.contactor.name = this.platformData[
            index
          ].contactor.name;
          '';
          this.baoshenData.contactor.role = this.platformData[
            index
          ].contactor.position;
          this.baoshenData.contactor.phone = this.platformData[
            index
          ].contactor.mobile1;
          // console.log("新增报审人", this.baoshenData);
          if (this.type == 'shenhe' || this.type == 'update') {
            const i = this.processType.findIndex((item) => item == '报审单位');
            console.log('1111111', this.processList);
            this.processList[i].chargeMan.id = this.platformData[
              index
            ].contactor.id;

            this.processList[i].chargeMan.name = this.platformData[
              index
            ].contactor.name;
            this.processList[i].chargeMan.position = this.platformData[
              index
            ].contactor.position;
            this.processList[i].chargeMan.mobile1 = this.platformData[
              index
            ].contactor.mobile1;
          }
        } else {
          if (this.type == 'shenhe' || this.type == 'update') {
            const i = this.processType.findIndex((item) => item == '报审单位');
            // console.log("审核失败1111111111111111", this.processList);
            this.processList[i].chargeMan.name = '-';
            this.processList[i].chargeMan.position = '-';
            this.processList[i].chargeMan.mobile1 = '-';
          }
          this.baoshenData = {
            id: '',
            name: '',
            contactor: {
              id: '', name: '', position: '', mobile1: '',
            },
          };
        }
      } else {
        if (this.type == 'shenhe') {
          const i = this.processType.findIndex((item) => item == '报审单位');
          this.processList[i].chargeMan.id = '';
          this.processList[i].chargeMan.name = '';
          this.processList[i].chargeMan.position = '';
          this.processList[i].chargeMan.mobile1 = '';
        }
        this.baoshenData = {
          id: '',
          name: '',
          contactor: {
            id: '', name: '', position: '', mobile1: '',
          },
        };
      }
      // console.log("下拉框改变", this.platformData[index], this.baoshenData);
    },
    getPlatform() {
      this.$http({
        url: this.$http.adornUrl(`/sys/platform//info/${this.nowPlatForm}`),
        method: 'get',
        param: this.$http.adornParams(),
      }).then(({ data }) => {
        // data 是获取到的所有数据
        if (data && data.code === 0) {
          this.tianbaoUnit = data.platForm.platformName;
          // this.console.log("当前平台名称", data);
          // data.data.forEach(item => {
          //   this.platformOptions.push({ value: item.code, label: item.name });
          // });
        } else {
          this.$message({
            message: `${data.msg}`,
            type: 'error',
          });
        }
      });
      // console.log("报审单位", this.processType[index], this.baoshenData.id);
      this.$http({
        url: this.$http.adornUrl(
          `/approve/approveProcess/getPlatForm?id=${this.baoshenData.id}`,
        ),
        method: 'get',
        param: this.$http.adornParams(),
      }).then(({ data }) => {
        // data 是获取到的所有数据
        if (data && data.code === 0) {
          // console.log("报审单位平台数据", data, this.baoshenData.id);
          this.platformData = data.data;
          data.data.forEach((item) => {
            this.platformOptions.push({
              value: item.id,
              label: item.platformName,
            });
          });
        } else {
          this.$message({
            message: `${data.msg}`,
            type: 'error',
          });
        }
      });
    },
    getUnit() {
      const { manageId } = this;
      console.log('1111111', this.manageId);
      this.$http({
        url: this.$http.adornUrl(
          `/approve/approveProcess/getUnit?id=${manageId}`,
        ),
        method: 'get',
        param: this.$http.adornParams(),
      }).then(({ data }) => {
        // data 是获取到的所有数据
        if (data && data.code === 0) {
          this.unitList = data.data;
          if (this.unitList.length > 0) {
            if (this.type == 'add') {
              this.baoshenData.id = this.unitList[0].depId;
              this.baoshenData.name = `请选择${this.unitList[0].depName}`;
              this.tianbaoUnit = this.unitList[0].depName;
            }

            // if (this.type == "shenhe" || this.type == "update") {
            //   // console.log("22222222", this.processType);
            //   var Unitindex = this.processType.findIndex(
            //     (item) => item == "报审单位"
            //   );
            //   console.log("unitList", this.unitList, Unitindex);
            //   if (Unitindex > 0) {
            //     this.baoshenData.id = this.unitList[Unitindex - 1].depId;
            //     this.baoshenData.name =
            //       "请选择" + this.unitList[Unitindex - 1].depName;
            //   }
            // }
            // console.log("新增", this.unitList, this.baoshenData.name);
          }
          this.getPlatform();
        } else {
          this.$message({
            message: `${data.msg}`,
            type: 'error',
          });
        }
      });
    },
    getPlatformById(id) {
      this.$http({
        url: this.$http.adornUrl(`/sys/platform//infoById/${id}`),
        method: 'get',
        param: this.$http.adornParams(),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log("byId", data);
          if (this.type == 'add') {
            this.createUser.id = data.platform.contactor.id;
            this.createUser.name = data.platform.contactor.name;
            this.createUser.phone = data.platform.contactor.mobile1;
            this.createUser.role = data.platform.contactor.position;
            // if (!this.showName) {
            // this.createUser.id = "";
            // this.createUser.name = "";
            // this.createUser.phone = "";
            // this.createUser.role = "";
            // }
            // console.log("新增createuser", this.createUser.name);
          } else {
            const index = this.processType.findIndex((item) => item == '审核中');
            if (index > -1) {
              this.processList[index].chargeMan.id = data.platform.contactor.id;
              this.processList[index].chargeMan.name = data.platform.contactor.name;
              this.processList[index].chargeMan.position = data.platform.contactor.position;
              this.processList[index].chargeMan.mobile1 = data.platform.contactor.mobile1;
            }
            const i = this.processType.findIndex((item) => item == '报审单位');
            if (i > -1 && this.type == 'update') {
              this.processList[i].chargeMan.id = data.platform.contactor.id;
              this.processList[i].chargeMan.name = data.platform.contactor.name;
              this.processList[i].chargeMan.position = data.platform.contactor.position;
              this.processList[i].chargeMan.mobile1 = data.platform.contactor.mobile1;
            }
          }
        } else {
          this.$message({
            message: `${data.msg}`,
            type: 'error',
          });
        }
      });
    },
    // 列表数据
    getDataList() {
      this.$http({
        url: this.$http.adornUrl('/approve/approveReward/list'),
        method: 'post',
        data: this.$http.adornData({
          page: this.pageIndex,
          limit: this.pageSize,
          search: this.search.tableInput,
          startTime:
            this.search.dateTime == null ? '' : this.search.dateTime[0],
          endTime: this.search.dateTime == null ? '' : this.search.dateTime[1],
          tikuType: this.tikuType,
          tikuId: this.search.awardType,
          status: this.search.auditStatus,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log("列表数据", data);
          this.tableData = data.page.list;
          this.totalPage = data.page.totalCount;
          this.getCount();
        } else {
          this.dataList = [];
          this.totalPage = 0;
          this.$message({
            message: `${data.msg}`,
            type: 'error',
          });
        }
      });
    },
    // 点击切换标签页，待实现
    handleClick(tab, event) {
      this.search.awardType = '';
      this.getDataList();
      this.getAwardTypeOptions();
      // this.getCount();

      // console.log(tab, event);
    },
    // 弹窗关闭提示
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    // 申报弹窗提交
    reportSubmit() {
      let sure = true;
      console.log('to be submitteddddd', this.dataForm);
      for (const i in this.dataForm.question) {
        const v = this.dataForm.question[i];
        if (v.answer.length === 0 && v.isAnswer == '1') {
          this.$message.warning(`请选择${v.title}`);
          sure = false;
          return;
        }
      }
      if (sure) {
        const index = this.processType.findIndex((item) => item == '已审核');
        if (this.dataForm.rewardAmount !== '') {
          this.dataForm.question.map((v) => {
            if (v.topicName == '图片' && v.answer) {
              v.answer.map((v) => {
                if (v.url) {
                  this.$delete(v, 'url');
                  this.$delete(v, 'uuid');
                  this.$delete(v, 'status');
                }
                console.log('url: ', v);
              });
            }
          });
          if (this.nextPlatformId == '' && index < this.unitList.length) {
            this.$message.error('请选择下个平台名字');
            return;
          }
          // console.log('申请人数据',
          //   this.applyPersonOptions);
          // 保存修改
          this.applyPersonOptionsId = this.applyPersonOptions.map((item) => item.id);
          // console.log(
          //   'manageId',
          //   this.manageId,
          //   '申请人id',
          //   this.applyPersonOptionsId,
          // );
          this.tikuType != 2 ? (this.applyPersonOptionsId = [-1]) : null;
          // if(this)
          this.$http({
            url: this.$http.adornUrl(
              `/approve/approveReward/${!this.dataForm.id ? 'save' : 'update'}`,
            ),
            method: 'post',
            data: {
              id: this.dataForm.id || undefined,
              tikuType: this.tikuType,
              status: '0',
              rewardAmount: this.dataForm.rewardAmount,
              managerId: this.manageId,
              nextPlatformId: this.nextPlatformId,
              reportIds: this.applyPersonOptionsId,
              submitType: this.type,
              documentList: this.dataForm.documentList,
              answerList: this.dataForm.question.map((v) => ({
                questionId: v.id,
                answer: v.answer
                  ? typeof v.answer === 'string'
                    ? v.answer + (v.remark ? `##${v.remark}` : '')
                    : typeof v.answer === 'object' && v.topicName != '图片'
                      ? v.answer.toString()
                      : JSON.stringify(v.answer)
                  : '',
              })),
            },
          }).then(({ data }) => {
            if (data && data.code == 0) {
              this.reportDialogVisible = false;
              this.getDataList();
            } else {
              this.$message.error(data.msg);
            }
          });
        } else {
          this.$message.warning('请填写奖励金额');
          sure = false;
          return;
        }
        // this.$refs["dataForm"].validate((valid) => {
        //   if (valid) {
        //     this.dataForm.question.map((v) => {
        //       if (v.topicName == "图片" && v.answer) {
        //         v.answer.map((v) => {
        //           if (v.url) {
        //             this.$delete(v, "url");
        //             this.$delete(v, "uuid");
        //             this.$delete(v, "status");
        //           }
        //           console.log("url: ", v);
        //         });
        //       }
        //     });
        //     if (this.nextPlatformId == "" && index < this.unitList.length) {
        //       this.$message.error("请选择下个平台名字");
        //       return;
        //     }
        //     // 保存修改
        //     console.log("manageId", this.manageId);
        //     // if(this)
        //     this.$http({
        //       url: this.$http.adornUrl(
        //         `/approve/approveReward/${
        //           !this.dataForm.id ? "save" : "update"
        //         }`
        //       ),
        //       method: "post",
        //       data: {
        //         id: this.dataForm.id || undefined,
        //         tikuType: this.tikuType,
        //         status: "0",
        //         rewardAmount: this.dataForm.rewardAmount,
        //         managerId: this.manageId,
        //         nextPlatformId: this.nextPlatformId,
        //         reportId: this.applyPersonOptionsId,
        //         submitType: this.type,
        //         answerList: this.dataForm.question.map((v) => {
        //           return {
        //             questionId: v.id,
        //             answer: v.answer
        //               ? typeof v.answer == "string"
        //                 ? v.answer + (v.remark ? "##" + v.remark : "")
        //                 : typeof v.answer == "object" && v.topicName != "图片"
        //                 ? v.answer.toString()
        //                 : JSON.stringify(v.answer)
        //               : "",
        //           };
        //         }),
        //       },
        //     }).then(({ data }) => {
        //       if (data && data.code == 0) {
        //         this.reportDialogVisible = false;
        //         this.getDataList();
        //       } else {
        //         this.$message.error(data.msg);
        //       }
        //     });
        //   }
        // });
      }

      console.log('申报弹窗提交');
    },
    // 点击查看按钮弹窗
    showCheck(id) {
      this.$refs.checkDialog.init(id, 'show');
    },
    // 重新申报
    newbaoshen(id) {
      this.type = 'baoshen';
      // this.showName = true;
      // this.applyPerson();
      this.updateCheck(id);
    },
    // 点击编辑按钮弹窗
    updateCheck(id) {
      // this.showName = false;
      this.applyPerson();
      if (this.type != 'baoshen') {
        this.type = 'update';
      }
      this.$http({
        url: this.$http.adornUrl(`/approve/approveReward//info/${id}`),
        method: 'get',
        param: this.$http.adornParams({}),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.manageId = data.data.managerId;
          console.log('mageddddddd', this.manageId, data.data.managerId);
          // console.log("详情数据1111", data);
          if (this.type == 'baoshen') {
            this.manageList = [];
            this.type = 'add';
            this.tikuId = data.data.approveManageEntity.tikuId;
            this.$http({
              url: this.$http.adornUrl(
                `/approve/approveReward/applyReward/${this.tikuId}`,
              ),
              method: 'get',
              param: this.$http.adornParams(),
            }).then(({ data }) => {
              if (data && data.code === 0) {
                data.approveManageList.forEach((item) => {
                  this.manageList.push({
                    value: item.id,
                    label: item.name,
                  });
                });
              }
            });
            this.getPlatformById(this.nowPlatForm);
          }
          this.checkFormDetail = data.data;
          // this.applyPersonOptionsId = data.data.reportId;
          this.applyPersonOptions = data.data.memberList;
          // this.checkForm =
          //   data.data.approveManageEntity.approveTikuEntity.approveQuestionList;
          // 左边题库
          this.dataForm.id = data.data.id;
          // console.log("1111111111111111111", this.dataForm.id);
          this.dataForm.documentList = JSON.parse(data.data.document);
          this.dataForm.name = data.data.approveManageEntity.approveTikuEntity.registerName;
          this.dataForm.question = data.data.approveManageEntity.approveTikuEntity.approveQuestionList;
          this.dataForm.question.map((v) => {
            if (v.topicName === '单选题') {
              v.answer = v.answer ? parseInt(v.answer) : [];
            } else if (v.topicName === '混答+单选') {
              //  console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',v.answer.substring(v.answer.indexOf('#'),v.answer.length))
              v.remark = v.answer ? v.answer.split('##')[1] : '';
              v.answer = v.answer ? parseInt(v.answer.split('##')[0]) : [];
            } else if (v.topicName === '混答+多选') {
              const answerIndex = v.answer.indexOf('#');
              if (answerIndex != -1) {
                v.remark = v.answer
                  ? v.answer
                    .substring(v.answer.indexOf('#') + 2, v.answer.length)
                    .split(',')
                  : '';
                v.answer = v.answer
                  ? v.answer
                    .substring(0, v.answer.indexOf('#'))
                    .split(',')
                    .map((item) => +item)
                  : [];
              } else {
                v.remark = '';
                v.answer = v.answer
                  ? v.answer
                    .substring(0, v.answer.length)
                    .split(',')
                    .map((item) => +item)
                  : [];
              }
            } else if (v.topicName === '图片') {
              if (v.answer) {
                v.answer = JSON.parse(v.answer).map((v) => ({
                  name: v.name,
                  url: v.oldPath,
                  oldPath: v.oldPath,
                  path: v.path,
                }));
                console.log('图片vanswer', v.answer);
              } else {
                v.answer = [];
              }
            } else if (v.topicName === '多选题') {
              v.answer = v.answer
                ? v.answer
                  .substring(0, v.answer.length)
                  .split(',')
                  .map((item) => +item)
                : [];
            }
          });
          this.dataForm.rewardAmount = data.data.rewardAmount;
          this.dataForm.documentList = JSON.parse(data.data.document);
          this.dataForm.documentList == null
            ? (this.dataForm.documentList = [])
            : null;
          console.log(this.dataForm.documentList, 'this.dataForm.documentList');
          // 右边流程图
          // this.manageId = data.data.managerId;
          // this.getUnit();

          if (this.type == 'add') {
            this.reportDialogVisible = true;
            this.createUser.id = '';
            this.createUser.name = '';
            this.createUser.role = '';
            this.createUser.phone = '';
            // console.log("新增createuser", this.createUser.name);
            return;
          }

          this.processType = ['填报'];
          this.processList = data.data.approveManageEntity.processList;

          // 获取审批流程
          this.unitList = [];
          for (
            let depIndex = 1;
            depIndex < this.processList.length;
            depIndex++
          ) {
            this.unitList.push({
              depId: this.processList[depIndex].depId,
              depName: this.processList[depIndex].depName,
            });
          }

          this.processList.forEach((item) => {
            if (item.chargeMan == null) {
              item.chargeMan = {
                id: '',
                name: '',
                position: '',
                mobile1: '',
              };
            }
            if (item.approveApproveEntity == null) {
              item.approveApproveEntity = {
                approveComments: '',
                approveResult: '',
                createUserId: '',
                gmtCreate: '',
                gmtModified: '',
                id: '',
                isDeleted: '',
                modifiedUserId: '',
                nextPlatformId: '',
                nextPlatformIdString: '',
                platformId: '',
                platformIdString: '',
                processId: '',
                qrcodeImg: '',
                rewardId: '',
                sysUserVo: {
                  id: '', name: '', phone: '', role: '',
                },
                tikuType: '',
              };
            }
          });
          // this.baoshenData.name =
          //   "请选择" + data.data.approveManageEntity.unitList[1].unitIdString;
          this.baoshenData.name = `请选择${this.processList[1].depName}`;
          // console.log("报审单位", this.baoshenData.name, this.processList);

          // 未填报
          const index = this.processList.findIndex(
            (item) => item.approveApproveEntity.platformIdString == '',
          );
          // console.log("没错", index);
          if (
            // 有未填报且没被驳回
            index > 0
            && this.processList[index].approveApproveEntity.approveResult != 1
          ) {
            this.processList[
              index
            ].approveApproveEntity.platformId = this.processList[
              index - 1
            ].approveApproveEntity.nextPlatformId;
            // this.nextPlatformName = this.processList[
            //   index - 1
            // ].approveApproveEntity.nextPlatformId;
            this.processList[
              index
            ].approveApproveEntity.platformIdString = this.processList[
              index - 1
            ].approveApproveEntity.nextPlatformIdString;
            // console.log(
            //   "审核中",
            //   this.processList[index].approveApproveEntity.platformIdString,
            //   this.processList[index - 1].approveApproveEntity
            //     .nextPlatformIdString
            // );
            const choosePlatformid = this.processList[index].approveApproveEntity
              .platformId;
            console.log('报审平台id', choosePlatformid);
            if (choosePlatformid != 0) {
              this.getPlatformById(choosePlatformid);
            }
          }

          for (let i = 1; i < this.processList.length; i++) {
            if (this.processList[i].approveApproveEntity.sysUserVo.name == '') {
              if (
                this.processList[i].approveApproveEntity.nextPlatformIdString
                  == ''
                && this.processList[i].approveApproveEntity.platformIdString != ''
              ) {
                if (this.type == 'update' && i == 1) {
                  this.processType.push('报审单位');
                  this.nextPlatformName = this.processList[0].approveApproveEntity.nextPlatformId;
                  this.nextPlatformId = this.processList[0].approveApproveEntity.nextPlatformId;
                } else {
                  this.processType.push('审核中');
                  if (
                    i < this.processList.length - 1
                    && this.type == 'shenhe'
                  ) {
                    const nowIndex = this.processType.findIndex(
                      (item) => item == '审核中',
                    );
                    if (nowIndex > 0) {
                      if (
                        this.processList[nowIndex - 1].approveApproveEntity
                          .nextPlatformId == this.nowPlatForm
                      ) {
                        this.processType.push('报审单位');
                        i += 1;
                      }
                    }
                  }
                }

                // console.log("type", "审核中");
              } else {
                this.processType.push('待审核');
              }
            } else {
              this.processType.push('已审核');
            }
          }

          // 显示报审单位名称
          if (this.type == 'shenhe' || this.type == 'update') {
            // console.log("22222222", this.processType);
            const Unitindex = this.processType.findIndex(
              (item) => item == '报审单位',
            );
            console.log('unitList', this.unitList, Unitindex);
            if (Unitindex > 0) {
              this.baoshenData.id = this.unitList[Unitindex - 1].depId;
              this.baoshenData.name = `请选择${this.unitList[Unitindex - 1].depName}`;
            }
          }
          if (this.type == 'add') {
            this.baoshenData.id = this.unitList[0].depId;
          }
          console.log('报审id', this.baoshenData.id);
          this.getPlatform();

          // console.log("最终结果", this.processList);
          // this.getUnit();
          const lastIndex = this.processType.findIndex(
            (item) => item == '审核中',
          );
          if (lastIndex == this.processList.length - 1) {
            this.nextPlatformId = 0;
          }
          if (this.type == 'shenhe') {
            const a = this.processType.findIndex((item) => item == '审核中');
            if (a > 0) {
              this.processId = this.processList[a].id;
              console.log('流程id', this.processId);
              if (
                this.processList[a - 1].approveApproveEntity.nextPlatformId
                == this.nowPlatForm
              ) {
                this.showshenhe = true;
              }
            }
          }
          this.reportDialogVisible = true;
          console.log('检验');
          // this.checkDialogVisible = true;
        } else {
          // this.checkFormDetail = {};
          this.dataForm.question = [];
          this.$message({
            message: `${data.msg}`,
            type: 'error',
          });
        }
      });
    },
    // 每页数
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    handleRemove(file, fileList) {
      this.dataForm.annex = [];
      console.log('删除上传handleRemove file, fileList', file, fileList);
      fileList.forEach((item) => {
        this.dataForm.annex.push(item);
      });
      console.log('`````````````````', this.dataForm.annex);
      this.fileList = this.dataForm.annex;
    },
    baoshen(id) {
      this.$http({
        url: this.$http.adornUrl('/approve/approveReward/updateStatus'),
        method: 'post',
        data: this.$http.adornData({
          id,
        }),
      }).then(({ data }) => {
        console.log('数据列表data', data);
        if (data && data.code === 0) {
          this.getDataList();
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    // 删除上传题库图片
    handleRemove(file, idx) {
      this.dataForm.question[idx].answer.map((v, index) => {
        if (v.name == file.name) {
          this.dataForm.question[idx].answer.splice(index, 1);
        }
      });
    },
    // 上传题库图片
    beforeAvatarUpload(param, idx) {
      console.log('uploading img gggggggg');
      const { file } = param;
      const testmsg = file.name.substring(file.name.lastIndexOf('.') + 1);
      const extension = testmsg === 'jpg';
      const extension2 = testmsg === 'png';
      if (!extension && !extension2) {
        this.$message({
          message: '上传头像只能是 jpg、png格式!',
          type: 'warning',
        });
        return;
      }
      const form = new FormData();

      form.append('file', file);
      this.$http({
        url: this.$http.adornUrl('/upload/passImg'),
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: form,
      })
        .then(({ data }) => {
          // console.log("/upload/platformImages",data)
          if (data && data.code === 0) {
            // this.imageUrl = window.SITE_CONFIG.baseUrl + "/" + data.url;
            const urlStr = data.data.url.replace(/\\/g, '/');
            console.log('上传图片', idx, this.dataForm.question);
            this.dataForm.question[idx].answer.push({
              name: data.data.name,
              url: window.SITE_CONFIG.cloudUrl + urlStr,
              path: urlStr,
              oldPath: window.SITE_CONFIG.cloudUrl + urlStr,
            });

            //  this.registeinfor[idx].answer = this.registeinfor[idx].epiSelectEntityList
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch((err) => {});
    },
    beforeUpload(param) {
      // 对图片进行压缩
      const imgSize = param.size / 1024 / 1024;
      if (imgSize > 1) {
        const _this = this;
        return new Promise((resolve) => {
          const reader = new FileReader();
          const image = new Image();
          image.onload = (imageEvent) => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            const width = image.width * _this.imgQuality;
            const height = image.height * _this.imgQuality;
            canvas.width = width;
            canvas.height = height;
            context.clearRect(0, 0, width, height);
            context.drawImage(image, 0, 0, width, height);
            const dataUrl = canvas.toDataURL(param.type);
            const blobData = _this.dataURItoBlob(dataUrl, param.type);
            resolve(blobData);
          };
          reader.onload = (e) => {
            image.src = e.target.result;
          };
          reader.readAsDataURL(param);
        });
      }
    },
    overFile() {
      this.$message.warning('上传图片最多不超过两个');
    },
    // 图片上传之前
    // beforeAvatarUpload(file) {
    //   let form = new FormData();
    //   form.append("file", file);
    //   var flag =  "";
    //   console.log(flag);
    //   form.append("emergencyInfoId", flag);
    //   this.$http({
    //     url: this.$http.adornUrl(`/upload/emergencyFile`),
    //     method: "post",
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //     data: form,
    //   })
    //     .then(({ data }) => {
    //       if (data && data.code === 0) {
    //         this.dataForm.annex.push(data.data);
    //         this.fileList = this.dataForm.annex;
    //         // console.log("上传上传", data, this.fileList, file);
    //       } else {
    //         this.$message.error(data.msg);
    //       }
    //     })
    //     .catch((err) => {});
    // },

    // handlePreview(file) {
    //   console.log("上传预览handlePreview file", file);
    //   if (this.$route.query.status === "update") {
    //     let httpaddress = window.SITE_CONFIG.cloudUrl;
    //     window.open(
    //       `${httpaddress}/${file.url}?attname=${
    //         file.name
    //       }&token=${this.$cookie.get("token")}`
    //     );
    //   }
    // },

    // // 预览文件
    // previewDocument(file) {
    //   console.log("aaaaaaaaaaaaaaaaaaaaa", file);

    //   var index = file.name.lastIndexOf(".");
    //   var ext = file.name.substr(index + 1);
    //   if (
    //     [
    //       "png",
    //       "jpg",
    //       "jpeg",
    //       "bmp",
    //       "gif",
    //       "webp",
    //       "psd",
    //       "svg",
    //       "tiff",
    //     ].indexOf(ext.toLowerCase()) !== -1
    //   ) {
    //     // console.log('该文件是图片')
    //     this.dialogDocumentVisible = false;
    //     this.documentUrl =
    //       this.$window.SITE_CONFIG["cloudUrl"] + "/" + file.url;
    //     console.log("文件路径1", this.documentUrl);
    //     return true;
    //   } else {
    //     this.dialogDocumentVisible = true;
    //     this.documentUrl = this.$window.SITE_CONFIG["cloudUrl"] + file.url;
    //     console.log("文件路径2", this.documentUrl);
    //     return false;
    //   }
    // },
    // 申请人选项
    applyPerson() {
      this.$http({
        url: this.$http.adornUrl('/approve/approveMemberEntity/list'),
        method: 'post',
        data: this.$http.adornData({
          page: 1,
          limit: 10000,
        }),
      }).then((data) => {
        console.log('申请人选项data====》', data);
        // this.applyPersonOptions = data.data.page.list;
      });
    },
    rewardDataChange(selection) {
      this.rewardDataSelection = selection;
      console.log('奖励列表选的数据', this.rewardDataSelection);
    },
    conditionExport() {
      const httpaddress = window.SITE_CONFIG.baseUrl;
      const token = document.cookie;
      window.location.href = `${httpaddress}/approve/approveReward/xlsOutputCondition?tikuId=${
        this.search.awardType
      }&status=${this.search.auditStatus}
      &startTime=${
  this.search.dateTime == '' ? '' : this.search.dateTime[0]
}&endTime=${
  this.search.dateTime == '' ? '' : this.search.dateTime[1]
}&page=${this.pageIndex}&limit=${this.pageSize}&search=${
  this.search.tableInput
}&tikuType=${this.tikuType}&token=${this.$cookie.get('token')}`;
    },
    exportSelectAll() {
      const httpaddress = window.SITE_CONFIG.baseUrl;
      const checkedIds = [];
      if (this.rewardDataSelection.length < 1) {
        this.$message({
          message: '请选择数据进行导出',
          type: 'warning',
        });
        return;
      }
      this.rewardDataSelection.forEach((item) => checkedIds.push(item.id));
      const token = document.cookie;
      window.location.href = `${httpaddress}/approve/approveReward/xlsOutputSelect?checkedIds=${checkedIds}
        &token=${Cookies.get('token')}`;
    },
    // 文件上传时的钩子
    beforeUploadFile(event, file, fileList) {
      this.fullscreenLoading = true;
      console.log(
        '文件上传时的钩子event,file,fileList===>',
        event,
        file,
        fileList,
      );
    },
    // 上传失败的回调
    handleError(err, file, fileList) {
      console.log('上传失败的回调err, file, fileList===>', err, file, fileList);
    },
    // 上传成功的回调
    handleAvatarSuccess(response, file, fileList) {
      this.fullscreenLoading = false;
      this.filename = file.name;
      this.getDataList();
      console.log('response, file, fileList===>', response, file, fileList);
      if (file.response.errorData.length == 0) {
        this.$message({
          message: '导入成功!',
          type: 'success',
        });
      } else if (file.response.errorData.length > 0) {
        const str = document.createElement('div');
        file.response.errorData.forEach((item) => {
          const cdiv = document.createElement('div');
          cdiv.innerHTML = item.errorMsg;
          cdiv.style.marginTop = '10px';
          str.appendChild(cdiv);
        });
        this.$message({
          dangerouslyUseHTMLString: true,
          message: `<div>${file.response.msg}</div>${str.innerHTML}`,
          type: 'error',
        });
      } else {
        // this.$message.error({
        //   type: "error",
        //   message: `${file.response.msg}`,
        // });
      }
    },
    // 导出模板
    downloadtemplate() {
      const httpaddress = window.SITE_CONFIG.baseUrl;
      const token = document.cookie;
      window.location.href = `${httpaddress}/approve/approveReward/gettemplate?token=${Cookies.get(
        'token',
      )}`;
    },
    /**
     * @method
     * @desc 点击更多里的选项，链接到对应已经做好的但隐藏的按钮
     * @param {number} option 按钮类型
     */
    moreClick(option) {
      switch (option) {
        case 1:
          this.$refs.exportTemplateBtn.$el.click();
          break;
        case 2:
          this.$refs.conditionExportBtn.$el.click();
          break;
        case 3:
          this.$refs.unconditionExportBtn.$el.click();
          break;
        case 4:
          this.$refs.importButton.$el.click();
          break;
      }
    },

    /**
     * @method
     * @desc 文件上传，返回文件在服务器中保存地址
     * @param {object} event input事件
     * @return {null}
     */
    getFile(event) {
      const that = this;
      const url = `${window.SITE_CONFIG.baseUrl}/upload/emergencyHandleProcessFile`;
      // 上传的文件列表
      const fileList = event.target.files;
      for (const file of fileList) {
        // 每次上传1个文件，返回一条url
        const formData = new FormData();
        formData.append('file', file);
        that.$http
          .post(url, formData)
          .then((res) => {
            console.log('上传成功：【\n', res, '\n】');
            that.dataForm.documentList.push({
              name: res.data.data.name,
              url: res.data.data.url,
            });
            // 清空input值，防止重复上传时不触发change事件
            event.srcElement.value = '';
          })
          .catch((err) => {
            console.log('上传失败：【\n', err, '\n】');
          });
      }
    },
    // 判断是图片还是文档
    isImg(url) {
      const res = url.slice(-4);
      if (
        res == '.png'
        || res == '.jpg'
        || res == 'jpeg'
        || res == '.gif'
        || res == '.bmp'
      ) {
        return true;
      }
      return false;
    },
    // 上传附件
    uploadActive() {
      this.$refs.file_button_inner.click();
    },
    // 查看历史申报记录
    queryHHistoryRecord(id) {
      console.log('hi', this.tikuType, this.dataForm.id, '11111');
      this.$refs.historyRecord.init(
        // parseInt(this.$cookie.get("platformId")),
        id,
        this.tikuType,
      );
      this.$refs.historyRecord.dialogVisible = true;
    },
  },
};
</script>

<style lang="less">
.jlsq {
  .jlsqDataForm {
    .el-form-item__label {
      margin-left: 80px;
    }
    .el-form-item__content {
      margin-left: 205px !important;
    }
    .el-input__inner {
      width: 250px;
    }
  }
  .jqsq-content-header-export-button {
    height: 42px !important;
    position: relative;
    bottom: 1px;
    /deep/span {
      font-size: 14px;
    }
    padding: 10px;
    margin-left: 1px;
  }
  .info {
    font-size: 14px;
    padding: 20px;
    background-color: white;
    .portrait {
      width: 120px;
      height: 200px;
      border-radius: 10px;
    }
    .example {
      color: #c0c0c0;
    }
  }
  .content {
    width: 250px;
    height: 35px;
    margin-left: 10px;
    outline: none;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding-left: 10px;
  }
  .manageSelect {
    height: 45px;
    margin-left: 15px;
    width: 95%;
  }
  .el-select--medium {
    width: 100%;
  }
  .baoshenUnit {
    .el-input__inner {
      padding-left: 0px;
      font-size: 1px;
    }
    .el-input--medium {
      width: 12vw !important;
    }
  }

  .el-select-dropdown .el-popper {
    left: 1290px !important;
  }
  .check-process-wrapper {
    margin-left: 15px;
    // max-height: 200px;
    padding: 0;
    font-size: 13px;
  }
  .check-process {
    margin: 20px;
    width: 20vw;
    border: 1px solid rgba(215, 215, 215, 1);
    border-radius: 3px;
    background-color: rgba(249, 251, 255, 1);
    padding: 10px;
  }
  .check-process-head-1 {
    border: 1px solid #0091ff;
    border-radius: 3px;
    color: white;
    background-color: #0091ff;
    padding: 5px 15px;
    display: inline-block;
    width: 4.6vw;
    text-align: center;
  }
  .check-process-head-grey {
    border: 1px solid rgba(215, 215, 215, 1);
    border-radius: 3px;
    color: white;
    background-color: rgba(215, 215, 215, 1);
    padding: 5px 15px;
    display: inline-block;
    width: 4.6vw;
    text-align: center;
  }
  .check-process-content-1 {
    font-size: 11px;
    border: 1px solid #0091ff;
    border-left: none;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    padding: 5px 15px;
    display: inline-block;
    width: 13vw;
    text-align: center;
    .el-input__inner {
      background-color: #f9fbff;
      border: 0;
      height: 28px;
    }
  }
  .check-process-content-grey {
    border: 1px solid rgba(215, 215, 215, 1);
    border-left: none;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    color: rgba(215, 215, 215, 1);
    padding: 5px 15px;
    display: inline-block;
    width: 13vw;
    text-align: center;
  }
  .check-process-head-2 {
    border: 1px solid rgba(215, 215, 215, 1);
    border-radius: 3px;
    color: white;
    background-color: rgba(215, 215, 215, 1);
    padding: 5px 15px;
    display: inline-block;
    width: 4.6vw;
    text-align: center;
  }
  .check-process-content-2 {
    border: 1px solid rgba(215, 215, 215, 1);
    border-left: none;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    color: rgba(215, 215, 215, 1);
    padding: 5px 15px;
    display: inline-block;
    width: 13vw;
    text-align: center;
  }
  .check-process .el-form-item {
    margin-bottom: 0;
  }
  .check-process-main {
    width: 342px;
    border: 1px solid rgba(170, 170, 170, 1);
    border-top: none;
    border-radius: 3px;
  }
}
.row1 .input-select {
  width: 230px;
  margin-right: 10px;
}
.row1 .date-block {
  display: inline-block;
  margin-left: 10px;
}
.row1 .date-block .el-date-editor {
  width: 238px;
  padding: 6px 8px;
}
.row1 .input-text {
  width: 298px;
  margin: 0 15px;
}
.row2 {
  display: flex;
}
.row2 div {
  margin-left: 25px;
  color: #999999;
}

.el-dialog__header {
  background: rgba(241, 244, 246, 1);
}
.report-process {
  margin: 20px;
  width: 300px;
  border: 1px solid rgba(215, 215, 215, 1);
  border-radius: 3px;
  background-color: rgba(249, 251, 255, 1);
  padding: 10px;
}
.report-table {
  flex: 1;
  margin: 20px;
}
.report-wrapper {
  display: flex;
  flex-flow: row;
}
.el-dialog__footer {
  text-align: center;
}
.process-wrapper {
  margin: 20px auto;
  text-align: center;
  margin-bottom: -30px;
}
.process-head-1 {
  border: 1px dashed #0091ff;
  border-radius: 3px;
  color: white;
  background-color: lightskyblue;
  padding: 5px 15px;
  display: inline-block;
}
.process-content-1 {
  border: 1px dashed #0091ff;
  border-left: none;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  padding: 5px 15px;
  display: inline-block;
  width: 200px;
}
.process-head-2 {
  border: 1px dashed #d7d7d7;
  border-radius: 3px;
  color: white;
  background-color: #d7d7d7;
  padding: 5px 15px;
  display: inline-block;
}
.process-content-2 {
  border: 1px dashed #d7d7d7;
  border-left: none;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  padding: 5px 15px;
  display: inline-block;
  width: 200px;
  color: #d7d7d7;
}
svg {
  height: 60px;
}
.el-card__body {
  padding: 0 !important;
}

/**
 * @author tanjinfeng
 * @date 2020.08.12
 */
.jlsq-big-container {
  background: white;
  min-width: 1355px;
  border-radius: 4px;
  overflow: hidden;
  .jlsq {
    height: calc(100vh - 112px);
    width: 100%;
    min-width: 1355px;
    position: relative;
    box-shadow: 0px 4px 14px 3px rgba(54, 121, 225, 0.09);
    .el-tabs {
      .el-tabs__nav.is-top {
        padding-left: 35px;
        padding-top: 13px;
      }
      /deep/.el-tabs__header
        .el-tabs__nav-wrap
        .el-tabs__nav-scroll
        .el-tabs__nav {
        .el-tabs__item.is-top {
          color: #999999;
          font-size: 16px;
          font-weight: normal;
          padding: 0 !important;
          margin-right: 50px;
          height: 55px;
          line-height: 53px;
        }
        .el-tabs__item.is-top.is-active {
          color: #333333;
          font-weight: bold;
          border-bottom: 2px solid #3f92fe;
        }
      }
    }
    .header-stats {
      position: relative;
      padding: 9px 0 18px 0;
      * {
        color: #999999;
        font-size: 16px;
        font-weight: normal;
      }
      div {
        margin: 0 28px 0 0;
        &:first-child {
          margin-left: 38px;
        }
        &:last-child {
          color: #0091ff;
          margin: 0;
          position: absolute;
          right: 14px;
          top: 5px;
          cursor: pointer;
        }
        span {
          font-weight: bold;
          font-size: 20px;
        }
      }
    }
    .header-operation {
      padding-left: 36px;
      position: relative;
      > * {
        margin: 0;
        margin-right: 4px;
      }
      .input-select {
        width: 328px;
        height: 42px;
        /deep/.el-icon-date {
          top: 2px;
        }
        /deep/.el-input__inner {
          height: 42px;
          line-height: 42px;
          padding-left: 10px;
          padding-right: 10px;
          font-size: 16px;
          font-weight: 400;
        }
        /deep/.el-icon-arrow-up::before {
          margin-top: 9px;
        }
        /deep/.el-input__suffix {
          right: 11px;
          top: 1px;
          background: white;
          height: 40px;
        }
        /deep/.el-icon-arrow-up::before {
          background: no-repeat
            url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAOCAYAAAA1+Nx+AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAGKADAAQAAAABAAAADgAAAAANlRePAAABeklEQVQ4Eb1SsUrEQBC9TXEBwc5gL/gBFsKh5BIrK1sNglwh9lp4foMnqL9wCBJrsbAQk0tODiysUgn2EvsjFonvHVnY80xcLFwYZjIz772Z3TQa/33CMNxJkqT5V11iwbEt8YYM6AeDwUFRFH6apn14odZ0YmJK7A25iJkSMAzDF0K8IO+h4VyHVO0pMR45yMXazJSj0Wgxy7InTLOE+onruj2VpCoOgqCL2inI30zTXGu1Wu/snRFgEne4DDeELWCSjm3bV8xXnSiK9vI876P+AVt3HOdV9v4owCImWoV7xERN2Fa73b6XINXjWjax7S3sE/kNbPys1isF2PQbWGeIqUdWlRlzalzRPjaYg92VVzdpY8wca+yp2rB2AymITY5xxz2QTR4QhGI8Hg/5IyDugvxM9n73WgIEYeILEB5ChL9xA/EK4ks86BG/q462AAgFRK5B5JVkPsh3IVJUkTNf+wYqkESWZXXgH2hlXEuu4rXjOI7nabqAL81rpopzt9VwAAAAAElFTkSuQmCC);
          background-size: 20px 10px;
          background-position: center;
          transform: rotate(180deg);
        }
        /deep/.el-icon-circle-close {
          font-size: 16px;
        }
        &:nth-child(2) {
          width: 132px;
        }
      }
      .date-range {
        height: 42px;
        width: 290px;
        // margin-left: 1px;
        /deep/.el-icon-date {
          top: 2px;
        }
        /deep/.el-range-input,
        /deep/.el-range-separator {
          font-size: 16px;
        }
        /deep/.el-range-input {
          margin-left: 20px;
          width: 105px;
        }
        /deep/.el-range-separator {
          margin-top: 0px;
          margin-left: 5px;
          margin-right: -15px;
        }
        /deep/.el-range__icon {
          font-size: 17px;
        }
        /deep/.el-range__close-icon {
          font-size: 17px;
          position: relative;
          top: 1px;
        }
      }
      .search-container {
        border: 1px solid #dddddd;
        border-radius: 4px;
        width: 328px;
        height: 42px;
        line-height: 40px;
        display: inline-block;
        margin: 0;
        &:hover {
          border-color: #c0c4cc;
        }
        &:focus-within {
          border-color: #0091ff;
        }
        input {
          width: calc(100% - 40px);
          height: 40px;
          border: none;
          outline: none;
          font-size: 16px;
          font-weight: 400;
          margin-left: 5px;
          color: rgb(96, 98, 102);
          &::-webkit-input-placeholder {
            color: #b4b4b4;
          }
        }
        .search-icon {
          font-size: 19px;
          font-weight: bold;
          color: #999999;
        }
        .search-icon.el-icon-close {
          border: 1px solid #999999;
          border-radius: 50%;
          font-size: 12px;
          padding: 2px 1px 1px 1px;
          text-align: center;
          position: relative;
          left: 2px;
          bottom: 2px;
          cursor: pointer;
          &:hover {
            color: #b4b4b4;
          }
        }
      }
      .declare-button {
        position: absolute;
        right: 10px;
        /deep/.el-button {
          width: 106px;
          height: 42px !important;
          padding: 11px 5px 11px 19px;
          span {
            font-size: 16px;
            font-weight: 400;
            color: #ffffff;
            i {
              font-size: 10px;
              position: relative;
              bottom: 2px;
              left: -3px;
            }
          }
        }
      }
      .import-container,
      .export-container {
        .el-button {
          width: 95px;
          height: 42px !important;
          line-height: 21px;
          img {
            width: 19px;
            height: 19px;
            margin-right: -4px;
          }
          span {
            font-size: 16px;
            color: #666666;
          }
        }
      }
      .import-container {
        display: inline-block;
        padding: 0;
        margin-left: 3px;
      }
      .export-template {
        height: 42px !important;
        span {
          font-size: 16px;
          color: #ffffff;
        }
      }
      .more-button-container {
        margin-left: 2px;
        display: inline-block;
        position: relative;
        width: 80px;
        height: 42px;
        line-height: 40px;
        border: 1px solid #dddee1;
        border-radius: 4px;
        font-size: 16px;
        text-align: center;
        color: #666666;
        user-select: none;
        cursor: pointer;
        .more-button-content {
          position: absolute;
          top: 50px;
          right: 0;
          width: 160px;
          z-index: 1;
          transform: scaleY(0);
          transform-origin: center top;
          transition: transform 0.5s;
          background: rgba(255, 255, 255, 1);
          box-shadow: 0px 3px 11px 0px rgba(0, 0, 0, 0.1);
          border-radius: 6px;
          .more-button-content-item-header {
            color: #999999;
            text-align: left;
            padding: 21px 0 15px 20px;
            line-height: 14px;
            cursor: auto;
          }
          .more-button-content-item {
            text-align: left;
            padding: 13px 0 15px 20px;
            line-height: 14px;
            &:hover {
              background: rgba(0, 145, 255, 0.1);
            }
          }
          .more-button-content-line {
            border-bottom: 1px solid #e6e6e6;
            width: 132px;
            height: 13px;
            margin: 0 auto;
            margin-bottom: 14px;
            cursor: auto;
          }
        }
        i {
          transition: transform 0.5s;
        }
        &.more-button-unfocus:hover {
          border-color: #b4b4b4;
        }
        &.more-button-focus {
          border-color: #0091ff;
          i {
            transform: rotate(-180deg);
          }
          .more-button-content {
            z-index: 1;
            transform: scaleY(1);
          }
        }
      }
    }
    .jlsq-content-table {
      height: calc(100% - 285px);
      margin-top: 20px;
      overflow: hidden;
      .el-table {
        -webkit-box-shadow: none;
        box-shadow: none;
        border: none;
        max-width: none;
        overflow-y: auto;
        thead div {
          font-size: 14px;
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
          th {
            height: 56px;
          }
        }
        tbody {
          div {
            font-size: 14px;
            font-weight: normal;
            color: rgba(102, 102, 102, 1);
          }
          td {
            border-left: none;
            border-right: none;
            .item {
              display: inline-block;
            }
            .button-view {
              margin: 0 auto;
              width: 27px;
              height: 25px;
              cursor: pointer;
              background: no-repeat
                url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAkCAYAAADl9UilAAAEDElEQVRYR+2Wb2hVZRzHv9/nrOlWU5molcSiMoTaIne79zZ7Y0QUQkLLEZTb7k3qTc02rSCDDDKodEvrTWH3bloQswQDKyLyTa57592grUCyohFWOhzO1aZr53zjzhn7c+89z50Vvtjz7pzn+/38vvzO8zznIS7Twcs0F+aC5ftl5jr2v3QsntJKelgLodLzVE5yCYCFE8UHJfUbw14QXTI4FAnw2H8W7JPjmtc/gA2e0ACoPL9C7DXE7sFS7GtYwfM2Xqs1FktoHYlmSDfYQLNqyJ8kNEXDPOjHyRmsvUNFww52S9roB8pnnuSeYhcNNVUcyebLGqwtqcUe8DGkqnyKWmvJDgM8UBfi6UyejMHeTmlh4Ri+BLTKutCshOweLcDdTwQ4ON0+I1i75Awn8ZmgeyxrDQD8CELvuJ4oB1QNoNTGT/CL4hDuqyHdyfoZweJfazuo522goNpGHbPpt0oMXZfCirTnlwCOX9OFkkLX2wWxzoojvhK5k1uzBms7qqDnqgOA4wcUFI+GnWgsoUcJvAro2gse/irguWiY78USboxgxI8FwDUeq+qq2HlR+0/HJLEtiU5BAV+Q0O+5vJEOHiTVmkkvsV4uDhhHP4JIH8A5B8FUXQhBkrqwIiZGW0IPedB+P8C4SXqr7Jxp7CvCCUFLM+8qniobwfK++V6LyCdtuAZcXxfmh1OCxRNeAkDIBkBy45iLbseoO6fe8HYKlZL22HABJCNhE54erAuA1fEgMGqAHkGpXAUJBjygglDMMlh3JGwqpwRrTaha0Hgb/QbBnWcHsLVksX6HsCijnjgzdJpXLyjFdkGb/ZjpecewujbIA1OCpR/iCX0FaLUF5ASW8Sb243F52pVxjRlu0hK8g5P6AcByfyaPRMK866Juyjm296hudV2lP2mhL4hsjoS4OZZUI6WXAJRMeIZEvhgNsSWe1E5ITb4sYNRxWFl7B7/NGCz9MpbQFkKvW8BAaMfZAfPCvKVwCl2Mr41RB13nT8FdUIqXBW2x4Qh8Jhrmjsnamf9Kia2d+EBSjQ0UQh+g941jetJ6z/UqAD4CoszGT7K9PoiHMXF+Ze1YeqK5Q0WLjA4RWGMDn61GwOEzHtc2Zbj+ZL327P1GV3oj2C/o/tkWzuUj+Kkpwvra2/hnxs2Ty7ztsAqun++9JvLpyX+JSwwqSm/8fM48u20Nx7KxrK7WrQndK+hNADdfYqjvCT5VH+bnfhyrYGlI+3cqHB5CvaRGECv9wFPmhWMkW4pL0FpzC0dtvNbBJsP2pbTqrzFvHckghAoAyyZdldIXvpMgeiR1XlFgDm4IMPc/NUPSWQWbwZH47hFclX7/2Gr8MX3r23RouubfCTabyj6euWD5NnWuY/l27G9733k0ycG80wAAAABJRU5ErkJggg==);
              background-size: 100% 100%;
              &:hover {
                background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAkCAYAAADl9UilAAADdElEQVRYR+2XW4iMYRjHf4/ZzIp1WDlfKKdcWMUK4YYkUpRFCjkkbtb3rXUqlFUox9357A3JIZScihJJ3LCx2b3AhZzKhXPWYckOOz16v92tmd2Z+d4Zh1zsczff9///n/88877P84zwn4b8p75oN5bpL9NesX9TsQM6HGUmUIhSAPRC6OYnVz4D7xEeADUIl1ktj/6eMU/DKIsRnGYz9rmMScVDOIEjURui3RmL6GxgPzDIRjQN5jlQiisXg3TSG9uvncjBQ1kRJJTRe+EwjTiUyvdUvNTGKrUnMS4BEzJKag+uIsQsiuVDMkpyYwe1G1FuoIy2z5MFUqglzBRWibkwCdHW2BkN8YarKFMtU9UhnEf9WwhCAUoRkG/FF67Tl+nMl1g8vq0xT3egbLIShePk4vKaeroz1Od84gn9yKOBCLDESkfYiSObUxvzdCxKFRCyEDyKK8up0EUIu4D+zZxXKBspkZNE9AiwzEIrhjABR6pbsHEVU8GjGmWMhdB7GhhMLnOAYynwS2ngArk88xtwUAj3cBgLok0noiU8nYtyNojffI4qqWMN+bxE6Z2UI7yjjgHkU45SbKk7D0fOJRqL6B1gnJWA6WsdqEWpTYvPYRQ/KcT0Lbu4iyvjE41VqJlrtu1hOXAfuBeQzxyLkYA5a8FhvmiJFLY2VoTglzEwhH3AZpQ3QPcU+E8IfQFzy9cGaja5KcKRC4nGzCdPb6FMtBB5SVeGUM9K1G8LbUNwyeMQX3gKDAjUFG7jyKQWXGIfi+gI1F9VOgYKmaHuyloqdA2wDSHP5yj1wFZKpJyImsqWBmopPxAKceVhcmPmaUTXAXsCxZoAexG2ECZEFP9sEKaGKDGU7YDRson1uLI3HphkVqoQ4TQw30YReIFwCvEvg6nYSJSFwEBL/hlcFrT0r9QVM2/MuhPiMjDZUjxb2E1izEy2/qRee/ZoZ8KcRZmRbda0POEKUeaxXr4lvzvp2GWaQw92AyUJU+L3nJqRU8FHNlAmjamk7FZrT6ehHACG/Z4nHiOsxpFrQTp2xoxKmXakB0sB0x6GBwm3em/+JZXzkWOUyQ8brr2xeLVKHU0jsxGzDfgjp0/cqmQWvrf+yFKqyeEixZJ+piZxmp2xNkJqNrIu/uONfG199W0q1Brzh4xlkzo9p91YpjVtr1imFfsFaaXrJVm90+MAAAAASUVORK5CYII=);
              }
            }
            .button-baoshen {
              background: no-repeat
                url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAACsElEQVRYR+2XQUgVURSG//89fUXmNiSKIqqNFKXVm0gXEi1Cl2WBkG+kaFMbN0GLCFrUqlZCEva0okW1KVqJtCjIeU8JgoTKlRKEURBRKTrv/jHpQsl53pkxceFdn3P+7/zncO8MsUoPVykX1sCiTiaxY/feapOZxEURLZB2ADAQRgk91VSqy23i96hQQXwisL6iThmjOwCqFxMn+RVCW85hf1S42GD5IZ1GSQ+Xak6An07zePtBDkSBiwWWL6qGRqMCNtqJcaKqGjtba/nTLj7mKPOF0g2Il2xF/u4M2ZnL8pZtTizHegt6J6nWVmQ2ji9ch0dtc2KB5T0zCWC9rcgc2JjrcLttTjywgqYgrbMVmRvleC7LbbY58cA8Mw5gq63I7CQ55GZ5yDYnFlivp8eCTtiKzF6Y7Mo5vGCbEw9sUG2iHtiKBHESj3Uctr/LYoF1D6sy4+sjAMtl5hvXYX2URmKBBQJ9BbUIeCapfA2hBLLBdeitCFggkvdKtwGeLy/Ia67DK1GgZncyweke1oZKXx8IbAkpMzI2yX1Xm+hHlUkENudaD8COxYQJXc856ctRoRI7FhS465lXBBoWB8OTnJM6ueJg+YIaIb0MEw4+eVjBPe4Bvo8KZzXKRyPKzJRQNb+4P41q42MA0K5yogSLmQo0Gx/T8+My4/jV2spSWG5ZsPvDqvNLugmhEUAqatdLxM+Q7CfQ2Z5lcCcuOKFgfZ72GuI1pAVOLTNcUO5bJsP6tjqOza8dCpb3zHMAzf8B5J+SJHtyWZ61BfsR9pOx/LAcdR3utgULFnO59yqsp8+uk9psBzaoc2Syl8HWWQP87nC44GslfMeKqrEtnDQuPQNz5gi/2DnmmVU6Ss98Wrkd44TrcL+VY0nHkzTf6klKKhInfw0sqmtrjkV17A8Ttdwn8+HHVQAAAABJRU5ErkJggg==);
              background-size: 100% 100%;
              &:hover {
                background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAACZElEQVRYR+2XP2hTURTGfyf+qahdRURRRF1EUQtO7VQcpB0VhW6iOJjm1oIIDiI46KR5sUGLdBMH66I4FXGwIKLgpKB2ahGkUqGI1tgmOfLSDEb6knNfQpohd/7O/X73O4f77hNadEmLctEG8+1M/Ynd1S0sMYjSD+wGisAU8IQiWS7KvC9UqK8P7I6eosh9oDPCfA5hgJRM+MLFBxvR0xR4WPNwSp4Ex0nJcx+4eGBZ3Uq+1K7NRrNZ1rKHC/LTqI/ZyrTeRLhsNSnplGGG5La1Jl5iGX2Pst9qUtIJL0hJr7UmHligv4ENVpOybhonu6w1ccFyQIfVpKybwclOa008sLTOIOywmpR1b3Fy1FoTDyzQceCE1aSsy+Ikaa2JB5bRAZQHVpPy8B/zucvigY3qOnJ8BmzDLLwjJV0+B4kHFjqktZ8ET9Gad2EBoZuUvG4OWOiS0Xso52sYXsfJVR+o5WuvnjWqG8nxCdi+4jbKB+Y5xDXJ+9rUBxa6BToGnIkwvoGTK75Q9Se2DDYJdEeYP8bJyeaDZbQH5WUV4/DJc4BB+egLZ2vlI13PHJsqNl+kEyF8Y+2taiq8oYM+/rBYoZvkF+NSiKqtDjaiRyhwC+gBEr6nrqFfQpggwTBJCe/EihUNltaDCK/gv6QaTAd8Zw1dJGX6362jwQJ9BvQ1nmPFHcdwctYGltYfSORPRqN5p3CyzwYWaDiYjZ6rqAN9xck2G1hGzxm+g41JTllgSCpeK9EzFv4JNWstUOSSfLMl1rKtDPRLE2dsFieHbYk1q40RPrZP0ipAtsF8Q28n5pvYX5BCmCfkwuT5AAAAAElFTkSuQmCC);
              }
            }
            .button-edit {
              background: no-repeat
                url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAACgElEQVRYR+3VW0sUYRwG8OeZXTD6CH2LwHXGS2/CDhBhRRG5M4UYRQUhEiIoiIRYhHVTUc4UERFR0UG7s7udFT9DF0H0DYJVd57YVNKa2XlnT0j43s7zzv83//cwxC4d3KUu7MGyrkxHOxaEOiQoIPideQwUu/ktCdwxmL+sfkR6C2Dfbwz51cqhLwnXEdg/qK021cF1BlaKFkH0xy5bAq6tsHsL6rp2hJWHK9rftY6PgvricARXXIeF7c/aBvPLukPhYCWPY8Pd/JmC++E51oG2w4JQs4JGNgt9Wc3zaBJOwHo+x+ODBS60FRaUNSNpdGcRLiV0TiSHXJtP/l7ili6lH+oWoJsJ+ygGhyXP4VR8PuuVnJD3S5oGNVbvdcSfzm0djLZesEGoKUHjRt8ofPZ6rcNp2aaX0i9rEtJEWqHacwmVXJ4nigUupuWbgvnl6gTEybQiG78gVAgOuDY/meQbhs2XNE4qduPGFF6FeNLr5QcT1MZ3NDD8ssYgTRtOXWWOp9wC3xvmNxucJQ3AD2vXQe1aMBprIE97Nt8ZpbeFMnUsKGtU0oxhkTVYPOP18I1hfkfMGDYfaoTQrEmR2m8mB54tOnxtko/LGMH8km7Qwm1JqfkayrJ4zu3hq0ZRRpv/6bKuS7hrgiK4LuC85/BlM6hUmF/WVUhzRqdXqMLioGfzRbOourAg1BVB941QQNUC3aLD561A1YX5YRSZoVglccG1+axVqDSYDApFEC96vQwMspkiiafMD6M0WARwyHM4n6miYbgxGBlZwHDR5mPDOpljjcBE8JLr8FHmahkmZIUJ5GXP5oMMNRqKpt7kDb21BZP2YFmbuNex/6ZjvwBgQAc2QRV6PQAAAABJRU5ErkJggg==);
              background-size: 100% 100%;
              &:hover {
                background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAACN0lEQVRYR+3Wz2rUUBTH8e+JixYfwbdw4QN0I4qCSFUUUUQpFTVJEZFSCgqliKjYGzcqKkVERETF/7v6AD6DC0F8A3HsOEeuTrFMk8m5SWYoMneb353z4dybkxE26ZJN6mIECz2Z4XYs050oywhf6TDJjHwpAg8P5nQX8AIY72I+o0wU4YYD24haa1Qhbliw94DvWN7KxQ0WlukYibS4o1v5wRtgIpcmfCKRHeufDQ6W6Q2U7Yyzl2n5XoL7RirbBg9zeg248KeQ8JEx9vTBtdnCPs7Ju8HCnF4FLvYc2UpB55SIKWK533vEzR6l0yvAbMElz8OtkMpCXr45WKaLKHMlE/4fbu3FKNjQDCzTBZR542fnA6nsLsvWhzm9DFwqK9R93iJiP7H4udZ31YM59SAPs6wWwiSJvLWEq8MynUfJvbgbCis/iThAIq8tqL9Tpspa0jmEReNWjzpILK+M+e74C0n77JLOIvixYFmrRBwilpeW8PpMWMec+sHpB6hlrSIcJpHnlnBvxg5z6j8x/lNTvpQ2EUdI5Fl5OD9hgzk9j3AdNd3JNnCUVJ5WRdkuv9MU4WYA6hipPKmDKoc5jQFnfHt/AcdJ5XFdVH+Y07PALTNKOcGMPGoCVQbrmFHCSRJ52BSqDKaGQh2EUySybMgGRYrfSqdlMI+aIpEHQRWN4aowf8zTpHLPWCc4VgXmO3maVO4GVwvYEArz/9HPEMvtgBqVorbJX+mn620awUL7N+rYf9Ox3+DAtCc1NXF7AAAAAElFTkSuQmCC);
              }
            }
            .button-delete {
              background: no-repeat
                url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAABmklEQVRYR+2XO0sDQRSF70nii2CrNiJYphZ3YyEKdqm1dVMJ/gALC19gaynYmG3V2lIxhbgr1ukVm/gDRJHsEUkCJrLLzDiBFLPl5T6+PfcycwcypB+GlEscmG5njBQLY1ZInkBkniKFzKKQRBJ5zQl2Nsu4UAU0AqvFfBFyVrVI2w/Nqo8Z1RgjsDBmQlI79tlD/gBIVOAyk1+S+f4kjTvB3AS/VJL3+xQnMSYlafXbN4A/tlSwWsx7IZdMAHRjANwEHtZ+x6WChRFvKVzVLWLiD8Fj4MNTAjMpYDNGe4BtFs/KpQwWxqyTXLYCBtSrHlasgNWihFagOkmqfi5TFGXFHFhH0X8rVim1M103ehudZu96DbyVgdf+tzDuHcE0uwNziqWdVWnHhVPMKTboK8nNmO6MDe2VZLoKWbsrw4hNCqdMQXr3ebwFPqatLIrnEQ8h3LMClsNRsIh9K2BnTxwZbckxRLZJFg0B3yE4/SzI7tYCMt+myvtYF+TnBX71IOMmYOtl+QCgtKJrg5kAmcQ4MF3VnGK6in0D9pTfJ+EbO1oAAAAASUVORK5CYII=);
              background-size: 100% 100%;
              &:hover {
                background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAABcElEQVRYR+2Xv0oDQRCHvzGKASsbtbGx9AUUC1Gws88rCIJ32FhY+A9s1aQQfATzDgopBPEBfACxiU06UcSMSFQMl7vsDhu4Yrfcm5nfx++GuTmhpEdKykUE830zNscauolyBiwA40NEu8AzY+yxI9eugFawJ5R5V5GfuDapzLnmWMG6qKE/O1Q4km8Hh55isKZWMhUeEab5GFp5UECHSRb5zDyqSeYuH6yud8CKCcA/6YZUNv6nFYHdAuv+GoYM4YFEltzADPVDptiaPyRBTi13sLq2gNVATC1SWSuq5QOmgaB6ZVIp1I5gGbdH7dh9rSe53OyXzrv/ixo1mCY9KWn0g+XdR7DoWO6squvAORYdi47FOVa2AVvaT5J5FQrWYw1to8yYQfoX+hcSmQ2zKF7oMcJBILATEjkMA3alE7xzirINTBkBX4FLquyzJYX/pu4b7C+JqnBO1QS2yxsiTiu6P5iJyD8pgvl6Fh3zdewL5tObJ8EoArUAAAAASUVORK5CYII=);
              }
            }
          }
          tr {
            background: none;
          }
          tr:hover {
            box-shadow: 0px 0px 11px 3px rgba(67, 85, 114, 0.1);
            td:nth-child(1) {
              border-left: 3px solid #0091ff;
            }
            // .button-view {
            //   background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAkCAYAAADl9UilAAADdElEQVRYR+2XW4iMYRjHf4/ZzIp1WDlfKKdcWMUK4YYkUpRFCjkkbtb3rXUqlFUox9357A3JIZScihJJ3LCx2b3AhZzKhXPWYckOOz16v92tmd2Z+d4Zh1zsczff9///n/88877P84zwn4b8p75oN5bpL9NesX9TsQM6HGUmUIhSAPRC6OYnVz4D7xEeADUIl1ktj/6eMU/DKIsRnGYz9rmMScVDOIEjURui3RmL6GxgPzDIRjQN5jlQiisXg3TSG9uvncjBQ1kRJJTRe+EwjTiUyvdUvNTGKrUnMS4BEzJKag+uIsQsiuVDMkpyYwe1G1FuoIy2z5MFUqglzBRWibkwCdHW2BkN8YarKFMtU9UhnEf9WwhCAUoRkG/FF67Tl+nMl1g8vq0xT3egbLIShePk4vKaeroz1Od84gn9yKOBCLDESkfYiSObUxvzdCxKFRCyEDyKK8up0EUIu4D+zZxXKBspkZNE9AiwzEIrhjABR6pbsHEVU8GjGmWMhdB7GhhMLnOAYynwS2ngArk88xtwUAj3cBgLok0noiU8nYtyNojffI4qqWMN+bxE6Z2UI7yjjgHkU45SbKk7D0fOJRqL6B1gnJWA6WsdqEWpTYvPYRQ/KcT0Lbu4iyvjE41VqJlrtu1hOXAfuBeQzxyLkYA5a8FhvmiJFLY2VoTglzEwhH3AZpQ3QPcU+E8IfQFzy9cGaja5KcKRC4nGzCdPb6FMtBB5SVeGUM9K1G8LbUNwyeMQX3gKDAjUFG7jyKQWXGIfi+gI1F9VOgYKmaHuyloqdA2wDSHP5yj1wFZKpJyImsqWBmopPxAKceVhcmPmaUTXAXsCxZoAexG2ECZEFP9sEKaGKDGU7YDRson1uLI3HphkVqoQ4TQw30YReIFwCvEvg6nYSJSFwEBL/hlcFrT0r9QVM2/MuhPiMjDZUjxb2E1izEy2/qRee/ZoZ8KcRZmRbda0POEKUeaxXr4lvzvp2GWaQw92AyUJU+L3nJqRU8FHNlAmjamk7FZrT6ehHACG/Z4nHiOsxpFrQTp2xoxKmXakB0sB0x6GBwm3em/+JZXzkWOUyQ8brr2xeLVKHU0jsxGzDfgjp0/cqmQWvrf+yFKqyeEixZJ+piZxmp2xNkJqNrIu/uONfG199W0q1Brzh4xlkzo9p91YpjVtr1imFfsFaaXrJVm90+MAAAAASUVORK5CYII=);
            // }
          }
        }
      }
      // /deep/.el-table::-webkit-scrollbar {
      //   background: transparent;
      //   width: 5px;
      // }
      // /deep/.el-table::-webkit-scrollbar-thumb {
      //   background: rgba(153, 153, 153, 1);
      //   border-radius: 20px;
      // }
    }
    .jlsq-content-footer {
      height: 83px;
      position: relative;
      .el-pagination {
        position: absolute;
        bottom: 15px;
        right: 30px;
        /deep/.el-pagination__total {
          font-size: 16px;
          color: rgba(96, 98, 102, 1);
          vertical-align: center;
          position: relative;
          top: 8px;
          right: 10px;
        }
        /deep/.number,
        /deep/.btn-prev,
        /deep/.btn-next,
        /deep/.more {
          border-radius: 3px;
          height: 42px;
          width: 42px;
          line-height: 42px;
          font-size: 16px;
          font-weight: normal;
          margin: 0;
          margin-right: 14px;
        }
        /deep/.el-pagination__sizes {
          /deep/.el-input__inner {
            border-radius: 3px;
            height: 42px;
            width: 107px;
            line-height: 42px;
            font-size: 16px;
          }
        }
        /deep/.el-pagination__jump {
          height: 42px;
          line-height: 42px;
          font-size: 16px;
          margin-left: 5px;
          /deep/.el-input__inner {
            border-radius: 3px;
            height: 42px;
            width: 38px;
            line-height: 42px;
            font-size: 16px;
          }
        }
      }
    }
  }
  /deep/.el-dialog {
    border-radius: 7px;
    /deep/.el-dialog__header {
      background: #f1f4f6;
      border-radius: 7px;
      padding: 15px 28px;
      .el-dialog__title {
        font-size: 16px;
        color: rgba(51, 51, 51, 1);
      }
      .el-dialog__headerbtn {
        height: 21px;
        width: 21px;
        line-height: 21px;
        text-align: center;
        position: absolute;
        top: 14px;
        right: 14px;
        i {
          font-size: 20px;
          font-weight: bolder;
        }
      }
    }
    .el-dialog__body {
      padding: 0;
      .dialog-caption {
        padding: 7px 15px 7px 57px;
        background: #f5f8ff;
        font-size: 14px;
        color: #666666;
        position: relative;
        img {
          width: 17px;
          height: 17px;
          position: absolute;
          left: 29px;
          top: 7px;
        }
      }
      .report-wrapper {
        display: flex;
        .left-content-container {
          border-bottom: 1px solid #f2f2f2;
          padding: 18px 40px 11px 37px;
          width: 529px;
          * {
            font-size: 14px;
            color: #555555;
          }
          .item-container {
            position: relative;
            min-height: 42px;
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            .item-label {
              text-align: right;
              flex: 1;
              margin-right: 20px;
            }
            .item-content {
              width: 314px;
              &.applicant-select {
                .el-select {
                  #applicant-select {
                    height: 42px;
                  }
                  .el-input__suffix i {
                    height: 36px;
                  }
                }
              }
              .content {
                width: 100%;
                height: 42px;
                margin: 0;
                border-color: #dddddd;
                &:hover {
                  border-color: #c0c4cc;
                }
                &:focus {
                  border-color: #0091ff;
                }
              }
              .el-checkbox__label {
                padding-left: 15px;
              }
              .el-textarea__inner {
                padding: 5px 10px;
              }
            }
          }
          .item-img-container {
            position: relative;
            padding-left: 137px;
            margin-bottom: 28px;
            * {
              color: #fff;
            }
            .el-icon-plus {
              color: #8c939d;
            }
            .item-label {
              position: absolute;
              left: 90px;
              color: #555555;
            }
            .item-img-content {
              display: inline-block;
              width: 314px;
            }
          }
          .item-file-container {
            padding-left: 137px;
            margin-bottom: 28px;
            position: relative;
            .item-label {
              position: absolute;
              left: 90px;
              top: 12px;
              color: #555555;
            }
            .item-content {
              width: 314px;
              .file-button-container {
                border: 1px solid #d9d9d9;
                border-radius: 4px;
                overflow: hidden;
                text-align: center;
                width: 119px;
                height: 44px;
                line-height: 44px;
                cursor: pointer;
                user-select: none;
                img {
                  width: 14px;
                  height: 14px;
                  position: relative;
                  bottom: 3px;
                }
                input {
                  position: absolute;
                  z-index: -999999;
                }
                &:hover {
                  border-color: #c0c4cc;
                }
                &:active {
                  border-color: #0091ff;
                }
              }
              .file-preview {
                margin-top: 8px;
                .close {
                  position: absolute;
                  top: -5px;
                  right: -5px;
                  cursor: pointer;
                  border: 1px solid #0091ff;
                  border-radius: 50%;
                  width: 20px;
                  height: 20px;
                  line-height: 20px;
                  background: #0091ff;
                  color: white;
                  font-weight: bolder;
                  text-align: center;
                  &:hover {
                    background-color: #9fc8fe;
                    border-color: #9fc8fe;
                  }
                }
                .img-wrapper {
                  display: inline-block;
                  height: 148px;
                  width: 148px;
                  position: relative;
                  margin-right: 8px;
                  margin-bottom: 8px;
                  img {
                    height: 100%;
                    width: 100%;
                    border: 1px solid #c0ccda;
                    border-radius: 6px;
                  }
                }
                .file-wrapper {
                  position: relative;
                  .close {
                    position: static;
                    display: inline-block;
                  }
                  a {
                    color: #0091ff;
                  }
                }
              }
            }
          }
        }
        .right-content-container {
          border-left: 1px dashed #f0f0f0;
          border-bottom: 1px solid #f2f2f2;
          flex: 1;
          padding: 14px;
          position: relative;
          .title {
            border-left: 2px solid #3f92fe;
            padding-left: 14px;
            font-size: 16px;
            line-height: 16px;
            height: 16px;
            font-weight: bold;
            color: rgba(51, 51, 51, 1);
            margin-bottom: 14px;
          }
          .histroy-button {
            position: absolute;
            top: 0px;
            right: 14px;
            font-size: 16px;
            color: rgba(0, 145, 255, 1);
          }
          .progress-container {
            .progress-select {
              margin: 14px auto;
              margin-top: 0;
              width: 100%;
              height: 42px;
              /deep/.el-input__inner {
                height: 42px;
                line-height: 42px;
                padding-left: 10px;
                padding-right: 10px;
                font-size: 14px;
              }
              /deep/.el-icon-arrow-up::before {
                margin-top: 9px;
              }
              /deep/.el-input__suffix {
                right: 11px;
                top: 1px;
                background: white;
                height: 40px;
              }
              /deep/.el-icon-arrow-up::before {
                background: no-repeat
                  url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAOCAYAAAA1+Nx+AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAGKADAAQAAAABAAAADgAAAAANlRePAAABeklEQVQ4Eb1SsUrEQBC9TXEBwc5gL/gBFsKh5BIrK1sNglwh9lp4foMnqL9wCBJrsbAQk0tODiysUgn2EvsjFonvHVnY80xcLFwYZjIz772Z3TQa/33CMNxJkqT5V11iwbEt8YYM6AeDwUFRFH6apn14odZ0YmJK7A25iJkSMAzDF0K8IO+h4VyHVO0pMR45yMXazJSj0Wgxy7InTLOE+onruj2VpCoOgqCL2inI30zTXGu1Wu/snRFgEne4DDeELWCSjm3bV8xXnSiK9vI876P+AVt3HOdV9v4owCImWoV7xERN2Fa73b6XINXjWjax7S3sE/kNbPys1isF2PQbWGeIqUdWlRlzalzRPjaYg92VVzdpY8wca+yp2rB2AymITY5xxz2QTR4QhGI8Hg/5IyDugvxM9n73WgIEYeILEB5ChL9xA/EK4ks86BG/q462AAgFRK5B5JVkPsh3IVJUkTNf+wYqkESWZXXgH2hlXEuu4rXjOI7nabqAL81rpopzt9VwAAAAAElFTkSuQmCC);
                background-size: 20px 10px;
                background-position: center;
                transform: rotate(180deg);
              }
              /deep/.el-icon-circle-close {
                font-size: 14px;
              }
              &:nth-child(2) {
                width: 132px;
              }
            }
            .progress-item-container {
              border: 1px solid #dae7f8;
              position: relative;
              * {
                font-size: 14px;
              }
              .progress-item-header {
                display: flex;
                span:first-child {
                  font-size: 16px;
                  font-weight: bold;
                  color: rgba(255, 255, 255, 1);
                  background: #0091ff;
                  display: inline-block;
                  width: 80px;
                  height: 50px;
                  text-align: center;
                  line-height: 50px;
                }
                span:last-child {
                  font-size: 14px;
                  font-weight: bold;
                  color: rgba(85, 85, 85, 1);
                  background: #f0f6ff;
                  display: inline-block;
                  flex: 1;
                  text-align: center;
                  line-height: 50px;
                }
              }
              .progress-item-content {
                .each-line {
                  position: relative;
                  margin: 0 14px 9px 84px;
                  .label {
                    display: block;
                    width: 80px;
                    color: #999999;
                    position: absolute;
                    left: -80px;
                    top: 0;
                    text-align: right;
                  }
                  .phone {
                    float: right;
                  }
                }
                div:first-child {
                  margin-top: 9px;
                }
              }
              &.has-pre-progress {
                margin-top: 46px;
                &::before {
                  content: "";
                  display: block;
                  width: 26px;
                  height: 32px;
                  background: no-repeat
                    url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAuCAYAAABEbmvDAAADcUlEQVRYR+1YSWgUQRT9v7p6HUcTE424QQRRY4Li0QVcmSgEBC+CCOJRwZMnTx48eBVyFtSL5OBBiDpGSURBwYtiXHFBFPeMmcxMT091V5XUkMRkYqYrgcRLFzQN0+/Xf/3q1/s1jaA5Hr0vtvgBPaQJnwKTIAt72twruvGoC7z/NujMjYQ3dfG1ONMgwwc2pRp142dMjCCAZ1Pd+UEICT7jMOfELEpgTYunTawSCvjww0+IJYrFKjC2K5Mai5VqFJAoNirEjA02qbGkxua6iSc1ltRYUmOaNZAcFBO70CwVSI49E489A6+j/YJHrZPV4zViYlsh4CdnW2MGwbJn4empK2SM/4QI3EQY2L7eeY23nvmXKyE/qruksyWmOz8iCMcmXXj9SYFLAcS1DDDU3+yYQQ2EZQ12HGz8ecgFfB9mWngWCVCXRbEHe5+W3kdctDomgZVNLqjE/2OUAg6fc2WQEsAxyVnsf8M2l3zWx4VsNimB1U0OqPt8jhE/gq+/A5AAYFFyZ0mHd6Aqz713wdpCIcpyIVspQVjV7IJtzg+5XDGEH/lKVQfXNHr2tbuHEVGOr1v/B7mslC/d4kJuIoiwsskBz/67Y+ZCwZ95BkNFBoqITUl3psM7NZZnUkE9ePUzXWBuL4vkDkSAFYsdWODof3LSJa/q6NtwBfJ+CIggXYue2bfRPT8xfkql90tJ2aB/LQhFlwKqHdiQMnVzxuKElPAlV4FiEClSwjbp8Uy7e6k2cNotePtZ6WIQyWNSSmxeaEFz2opNGgfgQsLnoQDKjAMhyDyXHtyzzvnnV8q63pB9XjpXYfKMIteYMmHpIlu95axGxCV8GiqDOp8RAgXXNjJ7N3gPp5ssNk32RelEpSK6pQRMuxSWNypysWGT8inT/PSrDCGXysS/pCwzs6vNHqz3hloZ+gb9Q0Eorgopaco2qpuCaHQJlThgoqqUWkZq4KuGtNG5bY37MU52LWJqkr6X5Z1BwG8IKV3dLjHRzU2CjxuaUp1bV2EujpR6rk1Mge++YFvKjCkjju0StW7upL2uXa0Y6JCaMTHdLjHRzW3T6MmMurkuqVkRU0H1ukQ9N59zYiqB6hJ55vZGo11ieaMDxYDXdfN5IVZVrqZLVJegjpvPG7GxRNnn/gXGxAkkkPcsemT3Bic7ExL/wv4BFQTHETJHjAAAAAAASUVORK5CYII=);
                  background-size: 100% 100%;
                  position: absolute;
                  left: 262px;
                  top: -39px;
                }
              }
              &.next-progress {
                .progress-item-header {
                  span:first-child {
                    background: #9fc8fe;
                  }
                  .progress-item-select {
                    margin: 0;
                    * {
                      background: transparent;
                      border: none;
                      outline: none;
                    }
                    /deep/.el-input__inner {
                      color: #999999;
                      text-align: center;
                    }
                    /deep/.el-input__suffix-inner {
                      background: #f0f6ff;
                      width: 25px;
                      position: relative;
                      bottom: -6px;
                      height: 40px;
                      .el-icon-circle-close {
                        position: relative;
                        bottom: 10px;
                      }
                    }
                  }
                }
              }
              &.inactive-progress {
                border-color: #f0f0f0;
                .progress-item-header {
                  span:first-child {
                    background: #dddddd;
                  }
                  span:last-child {
                    background: #f0f0f0;
                    color: #cccccc;
                  }
                }
              }
            }
          }
        }
      }
    }
    .el-dialog__footer {
      text-align: right;
      height: 82px;
      padding: 21px 26px 0 0;
      .el-button {
        height: 42px !important;
        width: 78px;
        padding: 0;
        span {
          font-size: 16px;
        }
        &:first-child span {
          color: #95a5bb;
        }
      }
    }
  }
}
</style>
