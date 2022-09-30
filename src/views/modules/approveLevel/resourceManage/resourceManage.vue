<template>
  <div class="resource-management-all-container">
    <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
      <el-tab-pane label="巡查车辆管理" name="first"></el-tab-pane>
      <el-tab-pane label="群防岗亭管理" name="second"></el-tab-pane>
    </el-tabs>

    <div style="height: 100%" v-if="activeName == 'first'">
      <!-- 审核状态统计值 -->
      <div class="header-stats">
        <div>
          总数：
          <span style="color: #333333">{{ totalCount }}</span>
        </div>
        <div>
          待审核：
          <span style="color: #f2b626">{{ waitCheckCount }}</span>
        </div>
        <div>
          已审核：
          <span style="color: #0bd295">{{ checkedCount }}</span>
        </div>
        <div>
          已驳回：
          <span style="color: #f66e6e">{{ rejectCount }}</span>
        </div>
        <div>
          待提交：
          <span style="color: #666666">{{ waitCommitCount }}</span>
        </div>
        <div>预览&下载政策文件</div>
      </div>

      <!-- 第二行筛选 -->
      <div class="header-operation">
        <!-- 奖励类型选择框 -->
        <el-select
          @change="searchResult()"
          clearable
          class="input-select"
          v-model="dataForm.carSource"
          placeholder="选择能源类型"
        >
          <el-option
            v-for="item in sourceOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>

        <el-select
          v-model="dataForm.approveStatus"
          clearable
          class="input-select"
          placeholder="选择审核状态"
          @change="searchResult()"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <!-- 日期范围选择框 -->
        <div class="date-block">
          <el-date-picker
            class="date-range"
            v-model="dataForm.dateRange"
            type="daterange"
            align="right"
            value-format="yyyy-MM-dd"
            clearable
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="searchResult()"
          ></el-date-picker>
        </div>
        <!-- 表单输入框和按钮 -->
        <div class="search-container">
          <input
            placeholder="请输入负责人姓名或电话"
            v-model="dataForm.name"
            @change="searchResult()"
          />
          <div
            v-if="dataForm.name"
            class="search-icon el-icon-close"
            @click="
              dataForm.name = '';
              searchResult();
            "
          ></div>
          <div v-else class="search-icon el-icon-search"></div>
        </div>

        <div
          class="more-button-container"
          :class="moreBtnIsFocus ? 'more-button-focus' : 'more-button-unfocus'"
        >
          <div @click="moreBtnIsFocus = !moreBtnIsFocus">
            <span>更多</span>
            <i class="el-icon-caret-bottom"></i>
          </div>
          <div class="more-button-content">
            <div class="more-button-content-item-header">导出</div>
            <div
              v-if="!shgl || shgl < 1"
              class="more-button-content-item"
              @click="downloadtemplate()"
            >
              导出模板
            </div>
            <div class="more-button-content-item" @click="exportSelectAll()">
              导出已选择数据
            </div>
            <div class="more-button-content-item" @click="exportSearchAll('4')">
              导出所有查询数据
            </div>
            <div
              class="more-button-content-line"
              v-if="!shgl || shgl < 1"
            ></div>
            <div
              class="more-button-content-item"
              @click="moreClick(1)"
              v-if="!shgl || shgl < 1"
            >
              导入
            </div>
          </div>
          <!-- 隐藏的导入按钮 -->
          <div style="z-index: -1; position: absolute">
            <el-form
              :inline="true"
              :model="dataForm"
              style="position: relative"
            >
              <el-form-item>
                <el-upload
                  :with-credentials="true"
                  :on-progress="beforeUploadFile"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :action="documenttoken"
                  :headers="{ token: $cookie.get('token') }"
                  style="display: inline-flex; margin: 0 10px"
                >
                  <el-tooltip placement="top" effect="light">
                    <div slot="content">
                      请填写我们提供
                      <br />的模板进行导入
                    </div>
                    <el-button
                      ref="importButton"
                      v-loading.fullscreen.lock="fullscreenLoading"
                      element-loading-text="正在导入巡查车辆列表，可能需要几分钟时间，请耐心等待.."
                      type="primary"
                      size="small"
                      >导入</el-button
                    >
                  </el-tooltip>
                </el-upload>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <el-button
          class="add-button"
          type="primary"
          v-if="!shgl || shgl < 1"
          size="small"
          @click="addOrUpdateHandle(null, 'add')"
          >新增</el-button
        >
      </div>

      <div class="zygl-content-table">
        <el-table
          height="100%"
          border
          :data="dataList"
          v-loading="dataListLoading"
          @selection-change="carDataSelection"
        >
          <el-table-column
            type="selection"
            header-align="left"
            align="center"
            v-if="moreBtnIsFocus"
          ></el-table-column>
          <el-table-column
            type="index"
            header-align="center"
            align="center"
            width="80"
            label="序号"
          ></el-table-column>
          <el-table-column
            prop="townName"
            header-align="center"
            align="center"
            label="所属镇街"
          ></el-table-column>
          <el-table-column
            prop="platformName"
            header-align="center"
            align="center"
            label="所属村居"
          ></el-table-column>
          <el-table-column
            prop="carNum"
            header-align="center"
            align="center"
            label="车牌号"
          ></el-table-column>
          <el-table-column
            prop="carSource"
            header-align="center"
            align="center"
            label="能源类型"
          >
            <template slot-scope="scope">
              <span>{{
                sourceOptions.find(item => item.value == scope.row.carSource)
                  ? sourceOptions.find(
                      item => item.value == scope.row.carSource
                    ).label
                  : ""
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="carProduceTime"
            header-align="center"
            align="center"
            width="180"
            label="生产日期"
          ></el-table-column>
          <el-table-column
            prop="responsible"
            header-align="center"
            align="center"
            label="责任人"
          ></el-table-column>
          <el-table-column
            prop="phone"
            header-align="center"
            align="center"
            label="联系电话"
          ></el-table-column>
          <el-table-column
            prop="carStatus"
            header-align="center"
            align="center"
            label="使用状态"
          >
            <template slot-scope="scope">
              <span>{{
                sourceTypeOptions.find(
                  item => item.value == scope.row.carStatus
                )
                  ? sourceTypeOptions.find(
                      item => item.value == scope.row.carStatus
                    ).label
                  : ""
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="gmtCreate"
            width="200"
            header-align="center"
            align="center"
            label="创建时间"
          ></el-table-column>
          <el-table-column
            prop="status"
            header-align="center"
            align="center"
            label="审核状态"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.status == 0" style="color: #000000"
                >待提交</span
              >
              <span v-if="scope.row.status == 1" style="color: #f59a23"
                >待审核</span
              >
              <span v-if="scope.row.status == 2" style="color: #70b603"
                >已审核</span
              >
              <span v-if="scope.row.status == 3" style="color: #d9001b"
                >已驳回</span
              >
              <!-- <span
                :class="(statusOptions.find(item => item.value == scope.row.status))?(statusOptions.find(item => item.value == scope.row.status)).label == '待审核'?'yellowFont':
                (statusOptions.find(item => item.value == scope.row.status)).label=='已审核'?'greenFont':
                (statusOptions.find(item => item.value == scope.row.status)).label=='已驳回'?'redFont':'blackFont':''"
              >{{ (statusOptions.find(item => item.value == scope.row.status))?(statusOptions.find(item => item.value == scope.row.status)).label:"" }}</span>-->
            </template>
          </el-table-column>
          <el-table-column
            prop="accountType"
            header-align="center"
            align="center"
            label="使用状态"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.accountType == 1" style="color: #000000"
                >申报</span
              >
              <span v-if="scope.row.accountType == 2" style="color: #d9001b"
                >报废</span
              >
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="right"
            width="120"
            label="操作"
          >
            <template slot-scope="scope">
              <div v-if="shgl > 0">
                <el-tooltip
                  class="item"
                  content="审核"
                  v-if="nowPlatForm == scope.row.nextPlatformId"
                  effect="dark"
                  placement="top"
                >
                  <div
                    class="button-view button-baoshen"
                    @click="addOrUpdateHandle2(scope.row.id, 'shenhe', shgl)"
                  ></div>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  content="查看"
                  effect="dark"
                  placement="top"
                >
                  <div
                    class="button-view"
                    @click="addOrUpdateHandle(scope.row.id, 'show')"
                  ></div>
                </el-tooltip>
              </div>
              <div v-else>
                <el-tooltip
                  class="item"
                  content="报审"
                  v-if="scope.row.status == '0'"
                  effect="dark"
                  placement="top"
                >
                  <div
                    class="button-view button-baoshen"
                    @click="baoshen(scope.row.id)"
                  ></div>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  content="编辑"
                  v-if="scope.row.status == '0'"
                  effect="dark"
                  placement="top"
                >
                  <div
                    class="button-view button-edit"
                    @click="addOrUpdateHandle(scope.row.id, 'update')"
                  ></div>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  content="查看"
                  v-if="scope.row.status != '0'"
                  effect="dark"
                  placement="top"
                >
                  <div
                    class="button-view"
                    @click="addOrUpdateHandle(scope.row.id, 'show')"
                  ></div>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  content="重新报审"
                  v-if="scope.row.status == '3'"
                  effect="dark"
                  placement="top"
                >
                  <div
                    class="button-view button-baoshen"
                    @click="newbaoshen(scope.row.id, 'baoshen')"
                  ></div>
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
                  ></div>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="zygl-content-footer">
        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>

    <div style="height: 100%" v-if="activeName == 'second'">
      <!-- 审核状态统计值 -->
      <div class="header-stats">
        <div>
          总数：
          <span style="color: #333333">{{ totalCount }}</span>
        </div>
        <div>
          待审核：
          <span style="color: #f2b626">{{ waitCheckCount }}</span>
        </div>
        <div>
          已审核：
          <span style="color: #0bd295">{{ checkedCount }}</span>
        </div>
        <div>
          已驳回：
          <span style="color: #f66e6e">{{ rejectCount }}</span>
        </div>
        <div>
          待提交：
          <span style="color: #666666">{{ waitCommitCount }}</span>
        </div>
        <div>预览&下载政策文件</div>
      </div>

      <div class="header-operation">
        <!-- 奖励类型选择框 -->
        <el-select
          @change="searchResult()"
          clearable
          class="input-select"
          v-model="dataForm2.value"
          placeholder="选择镇街"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>

        <!-- 村居类型选择框 -->
        <el-select
          @change="searchResult()"
          clearable
          class="input-select"
          v-model="dataForm2.value2"
          placeholder="选择村居"
        >
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>

        <el-select
          v-model="dataForm2.approveStatus"
          clearable
          class="input-select"
          placeholder="选择审核状态"
          @change="searchResult()"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <!-- 日期范围选择框 -->
        <div class="date-block">
          <el-date-picker
            class="date-range"
            v-model="dataForm2.dateRange"
            type="daterange"
            align="right"
            value-format="yyyy-MM-dd"
            clearable
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="searchResult()"
          ></el-date-picker>
        </div>
        <!-- 表单输入框和按钮 -->
        <div class="search-container">
          <input
            placeholder="请输入负责人姓名，电话或岗亭名称"
            v-model="dataForm2.name"
            @change="searchResult()"
          />
          <div
            v-if="dataForm2.name"
            class="search-icon el-icon-close"
            @click="
              dataForm2.name = '';
              searchResult();
            "
          ></div>
          <div v-else class="search-icon el-icon-search"></div>
        </div>

        <div
          class="more-button-container"
          :class="moreBtnIsFocus ? 'more-button-focus' : 'more-button-unfocus'"
        >
          <div @click="moreBtnIsFocus = !moreBtnIsFocus">
            <span>更多</span>
            <i class="el-icon-caret-bottom"></i>
          </div>
          <div class="more-button-content">
            <div class="more-button-content-item-header">导出</div>
            <div
              v-if="!shgl || shgl < 1"
              class="more-button-content-item"
              @click="downloadtemplate()"
            >
              导出模板
            </div>
            <div class="more-button-content-item" @click="exportSelectAll()">
              导出已选择数据
            </div>
            <div class="more-button-content-item" @click="exportSearchAll('5')">
              导出所有查询数据
            </div>
            <div
              class="more-button-content-line"
              v-if="!shgl || shgl < 1"
            ></div>
            <div
              class="more-button-content-item"
              @click="moreClick(2)"
              v-if="!shgl || shgl < 1"
            >
              导入
            </div>
          </div>
          <!-- 隐藏的导入按钮 -->
          <div style="z-index: -1; position: absolute">
            <el-form
              :inline="true"
              :model="dataForm"
              style="position: relative"
            >
              <el-form-item>
                <el-upload
                  :with-credentials="true"
                  :on-progress="beforeUploadFile"
                  :show-file-list="false"
                  :data="{
                    file: fileName,
                    url:
                      'http://localhost:8200/108ee3f1-9df4-4998-9112-17ee0b9f08db'
                  }"
                  :on-success="handleAvatarSuccess"
                  :action="documenttoken"
                  style="display: inline-flex; margin: 0 10px"
                >
                  <el-tooltip placement="top" effect="light">
                    <div slot="content">
                      请填写我们提供
                      <br />的模板进行导入
                    </div>
                    <el-button
                      ref="importButton2"
                      v-loading.fullscreen.lock="fullscreenLoading"
                      element-loading-text="正在导入群防岗亭列表，可能需要几分钟时间，请耐心等待.."
                      type="primary"
                      size="small"
                      >导入</el-button
                    >
                  </el-tooltip>
                </el-upload>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <el-button
          class="add-button"
          type="primary"
          v-if="!shgl || shgl < 1"
          size="small"
          @click="addOrUpdateHandle(null, 'add')"
          >新增</el-button
        >
      </div>

      <div class="zygl-content-table">
        <el-table
          :data="dataList2"
          v-loading="dataListLoading"
          height="100%"
          border
          @selection-change="boxDataSelection"
        >
          <el-table-column
            v-if="moreBtnIsFocus"
            type="selection"
            header-align="left"
            align="center"
            width="55"
          ></el-table-column>
          <el-table-column
            type="index"
            header-align="center"
            align="center"
            width="80"
            label="序号"
          ></el-table-column>
          <el-table-column
            prop="townName"
            header-align="center"
            align="center"
            label="所属镇街"
          ></el-table-column>
          <el-table-column
            prop="platformName"
            header-align="center"
            align="center"
            label="所属村居"
          ></el-table-column>
          <el-table-column
            prop="name"
            header-align="center"
            align="center"
            label="岗亭名称"
          ></el-table-column>
          <el-table-column
            prop="place"
            header-align="center"
            align="center"
            label="地址"
          ></el-table-column>
          <el-table-column
            prop="responsible"
            header-align="center"
            align="center"
            label="责任人"
          ></el-table-column>
          <el-table-column
            prop="phone"
            header-align="center"
            align="center"
            label="联系电话"
          ></el-table-column>
          <el-table-column
            prop="gmtCreate"
            width="200"
            header-align="center"
            align="center"
            label="创建时间"
          ></el-table-column>
          <el-table-column
            prop="carStatus"
            header-align="center"
            align="center"
            label="使用状态"
          >
            <template slot-scope="scope">
              <span
                :class="
                  statusOptions.find(item => item.value == scope.row.status)
                    .label == '待审核'
                    ? 'yellowFont'
                    : statusOptions.find(item => item.value == scope.row.status)
                        .label == '已审核'
                    ? 'greenFont'
                    : statusOptions.find(item => item.value == scope.row.status)
                        .label == '已驳回'
                    ? 'redFont'
                    : 'blackFont'
                "
                >{{
                  statusOptions.find(item => item.value == scope.row.status)
                    .label
                }}</span
              >
            </template>
          </el-table-column>

          <el-table-column
            prop="accountType"
            header-align="center"
            align="center"
            label="使用状态"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.accountType == 1" style="color: #000000"
                >申报</span
              >
              <span v-if="scope.row.accountType == 2" style="color: #d9001b"
                >报废</span
              >
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="right"
            width="120"
            label="操作"
          >
            <template slot-scope="scope">
              <div v-if="shgl > 0">
                <!-- <el-button
                  v-if="nowPlatForm==scope.row.nextPlatformId"
                  size="small"
                  type="primary"
                  @click="addOrUpdateHandle2(scope.row.id,'shenhe',shgl)"
                >审核</el-button>
                <el-button
                  size="small"
                  type="primary"
                  @click="addOrUpdateHandle(scope.row.id,'show')"
                >查看</el-button>-->
                <el-tooltip
                  class="item"
                  content="审核"
                  v-if="nowPlatForm == scope.row.nextPlatformId"
                  effect="dark"
                  placement="top"
                >
                  <div
                    class="button-view button-baoshen"
                    @click="addOrUpdateHandle2(scope.row.id, 'shenhe', shgl)"
                  ></div>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  content="查看"
                  effect="dark"
                  placement="top"
                >
                  <div
                    class="button-view"
                    @click="addOrUpdateHandle(scope.row.id, 'show')"
                  ></div>
                </el-tooltip>
              </div>
              <div v-else>
                <!-- <el-button
                  size="small"
                  type="primary"
                  v-if="scope.row.status == '0'"
                  @click="baoshen(scope.row.id)"
                >报审</el-button>
                <el-button
                  size="small"
                  type="primary"
                  v-if="scope.row.status == '0'"
                  @click="addOrUpdateHandle(scope.row.id,'update')"
                >编辑</el-button>
                <el-button
                  size="small"
                  type="primary"
                  v-if="scope.row.status != '0' "
                  @click="addOrUpdateHandle(scope.row.id,'show')"
                >查看</el-button>
                <el-button
                  size="small"
                  type="primary"
                  v-if="scope.row.status == '3'"
                  @click="newbaoshen(scope.row.id,'baoshen')"
                >重新报审</el-button>
                <el-button size="small" type="danger" @click="deleteHandle(scope.row)">删除</el-button>-->

                <el-tooltip
                  class="item"
                  content="报审"
                  v-if="scope.row.status == '0'"
                  effect="dark"
                  placement="top"
                >
                  <div
                    class="button-view button-baoshen"
                    @click="baoshen(scope.row.id)"
                  ></div>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  content="编辑"
                  v-if="scope.row.status == '0'"
                  effect="dark"
                  placement="top"
                >
                  <div
                    class="button-view button-edit"
                    @click="addOrUpdateHandle(scope.row.id, 'update')"
                  ></div>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  content="查看"
                  v-if="scope.row.status != '0'"
                  effect="dark"
                  placement="top"
                >
                  <div
                    class="button-view"
                    @click="addOrUpdateHandle(scope.row.id, 'show')"
                  ></div>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  content="重新报审"
                  v-if="scope.row.status == '3'"
                  effect="dark"
                  placement="top"
                >
                  <div
                    class="button-view button-baoshen"
                    @click="newbaoshen(scope.row.id, 'baoshen')"
                  ></div>
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
                  ></div>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="zygl-content-footer">
        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>

    <!-- 导入错误信息 -->
    <el-dialog
      title="以下信息未能成功导入"
      :close-on-click-modal="false"
      :visible.sync="errDataVisible"
      height="1000px"
      width="1400px"
    >
      <el-row>
        <el-col :span="24">
          <div>
            <el-table
              :data="errTableData"
              height="500"
              border
              style="width: 100%"
              header-align="center"
              align="center"
            >
              <el-table-column
                sortable
                prop="name"
                header-align="center"
                align="center"
                width="120"
                :show-overflow-tooltip="true"
                label="车名"
              ></el-table-column>
              <el-table-column
                prop="carNum"
                header-align="center"
                align="center"
                :show-overflow-tooltip="true"
                label="车牌号"
              ></el-table-column>
              <el-table-column
                prop="carType"
                header-align="center"
                align="center"
                :show-overflow-tooltip="true"
                label="车品牌及型号"
              ></el-table-column>
              <el-table-column
                prop="carSource"
                header-align="center"
                align="center"
                :show-overflow-tooltip="true"
                label="能源类型"
              ></el-table-column>
              <el-table-column
                prop="carProduceTime"
                header-align="center"
                align="center"
                :show-overflow-tooltip="true"
                label="生产时间"
              ></el-table-column>
              <el-table-column
                prop="carStatus"
                header-align="center"
                align="center"
                :show-overflow-tooltip="true"
                label="使用状态"
              ></el-table-column>
              <el-table-column
                prop="responsible"
                header-align="center"
                align="center"
                :show-overflow-tooltip="true"
                label="负责人"
              ></el-table-column>
              <el-table-column
                prop="phone"
                header-align="center"
                align="center"
                :show-overflow-tooltip="true"
                label="负责人电话"
              ></el-table-column>
              <el-table-column
                prop="nextPlatformId"
                header-align="center"
                align="center"
                :show-overflow-tooltip="true"
                label="下个平台"
              ></el-table-column>
              <el-table-column
                align="center"
                header-align="center"
                width="300"
                prop="errorMsg"
                label="失败原因"
              ></el-table-column>
            </el-table>
          </div>
        </el-col>
        <el-col :span="24">
          <el-button
            type="success"
            icon="el-icon-printer"
            @click="exportExcel()"
            style="float: right; margin-top: 20px"
            >导出数据</el-button
          >
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 新增修改 -->
    <resource-add-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="getData"
      @getNextPlatformId="getPlatformId"
      :tabType="activeName"
      :tkId="tktk"
    ></resource-add-update>
  </div>
</template>

<script>
import ResourceAddUpdate from "./resource-add-update";
import { platformTreeDataTranslate } from "@/utils";
import Cookies from "js-cookie";
var token = document.cookie;
var httpaddress = window.SITE_CONFIG.baseUrl;
export default {
  name: "resourceManage",
  props: ["shgl", "tktk"],
  data() {
    return {
      fullscreenLoading: false,
      documenttoken: `${httpaddress}/approve/approveCarEntity/xlsInput?token=${this.$cookie.get(
        "token"
      )}`,
      fileName: "",
      nowPlatForm: "",
      nextPlatformId: "",
      totalCount: 0,
      waitCheckCount: 0,
      checkedCount: 0,
      rejectCount: 0,
      waitCommitCount: 0,
      carTableSelected: [],
      boxTableSelected: [],
      //能源状态下拉框
      sourceOptions: [],
      //能源类型
      sourceTypeOptions: [],
      //审核状态
      statusOptions: [],
      //镇街下拉框
      options: [],
      options2: [],
      //标签框
      activeName: "first",
      activeUrl: "approveCarEntity",
      //车辆数据
      dataForm: {
        name: '',
        dateRange: [],
        carSource: '',
        approveStatus: '',
      },
      dataList: [],
      dataList2: [],
      //岗亭数据
      dataForm2: {
        value: '',
        value2: '',
        dateRange: [],
        name: '',
        approveStatus: '',
      },
      dataList2: [],
      dataListLoading: false,
      addOrUpdateVisible: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,

      errDataVisible: false,
      errTableData: "",
      // “更多”按钮触发
      moreBtnIsFocus: false
    };
  },
  components: {
    ResourceAddUpdate
  },
  mounted() {
    this.getCarSource();
    this.getCarSourceType();
    this.getCarSourceStatus();
    this.getCount();
    this.getDataList();
    this.nowPlatForm = this.$cookie.get("platformId");
  },
  methods: {
    //获取镇街
    getOption() {
      this.options = [];
      this.$http({
        url: this.$http.adornUrl(`/sys/platform/list`),
        method: "get",
        param: this.$http.adornParams({
          terminal: "0"
        })
      }).then(({ data }) => {
        // data 是获取到的所有数据
        if (data && data.code === 0) {
          data.townList.forEach(item => {
            this.options.push({ value: item.id, label: item.townName });
          });
          console.log("townList", data.townList, this.options);
        } else {
          this.$message({
            message: `${data.msg}`,
            type: "error"
          });
        }
      });
    },
    //获取村居
    getOption2() {
      this.options2 = [];
      this.dataForm2.value2 = "";
      console.log("111", this.dataForm2.value);
      this.$http({
        url: this.$http.adornUrl("/approve/approveBoxEntity/getVillage"),
        method: "get",
        params: this.$http.adornParams({
          id: this.dataForm2.value
        })
      }).then(({ data }) => {
        console.log("111111111111", data);
        if (data && data.code === 0) {
          data.village.forEach(item => {
            this.options2.push({ value: item.id, label: item.platformName });
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    getData(val) {
      if (val == "1") {
        this.getDataList();
      }
      if (val == "2") {
        this.getDataList2();
      }
    },
    getPlatformId(val) {
      this.nextPlatformId = val;
      console.log("资源管理", this.nextPlatformId, this.nowPlatForm);
    },
    getDataList() {
      console.log("能源111111", this.sourceTypeOptions, this.statusOptions);
      let request = {
        page: this.pageIndex,
        limit: this.pageSize,
        search: this.dataForm.name,
        startTime:
          this.dataForm.dateRange == null ? "" : this.dataForm.dateRange[0],
        endTime:
          this.dataForm.dateRange == null ? "" : this.dataForm.dateRange[1],
        carSource: this.dataForm.carSource,
        approveStatus: this.dataForm.approveStatus,
      };
      this.shgl == 4 ? (request["tikuType"] = 4) : null;
      this.$http({
        url: this.$http.adornUrl(`/approve/approveCarEntity/list`),
        method: "post",
        data: this.$http.adornData(request)
      }).then(({ data }) => {
        console.log("数据列表data", data);
        if (data && data.code === 0) {
          this.dataList = data.page.list;
          this.totalPage = data.page.totalCount;
          this.getCount();
        } else {
          this.dataList = [];
          this.totalPage = 0;
          this.$message.error(data.msg);
        }
        this.dataListLoading = false;
      });
    },
    getDataList2() {
      let request = {
        page: this.pageIndex,
        limit: this.pageSize,
        search: this.dataForm2.name,
        startTime:
          this.dataForm2.dateRange == null ? "" : this.dataForm2.dateRange[0],
        endTime:
          this.dataForm2.dateRange == null ? "" : this.dataForm2.dateRange[1],
        townName: this.dataForm2.value,
        platformName: this.dataForm2.value2,
        approveStatus: this.dataForm2.approveStatus,
      };
      this.shgl == 5 ? (request["tikuType"] = 5) : null;
      this.$http({
        url: this.$http.adornUrl(`/approve/approveBoxEntity/list`),
        method: "post",
        data: this.$http.adornData(request)
      }).then(({ data }) => {
        console.log("数据列表data", data);
        if (data && data.code === 0) {
          this.dataList2 = data.page.list;
          this.totalPage = data.page.totalCount;
          this.getCount();
        } else {
          this.dataList2 = [];
          this.totalPage = 0;
          this.$message.error(data.msg);
        }
        this.dataListLoading = false;
      });
    },
    //删除
    deleteHandle(row) {
      console.log("测试", row);
      var ids = row
        ? [row.id]
        : this.carTableSelected.map(item => {
            return item.id;
          });
      var checkedName = row
        ? [row.name]
        : this.carTableSelected.map(item => {
            return item.name;
          });
      this.$confirm(
        `确定对[${checkedName.join(",")}]进行[${
          row ? "删除" : "批量删除"
        }]操作?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          if (row.status == 1 || row.status == 2) {
            this.$alert("该流程正在进行中无法删除", "提示", {
              confirmButtonText: "确定",
              callback: action => {
                return;
              }
            });
          } else {
            let url;
            if (this.activeName == "first") {
              url = "/approve/approveCarEntity/delete";
            }
            if (this.activeName == "second") {
              url = "/approve/approveBoxEntity/delete";
            }
            this.$http({
              url: this.$http.adornUrl(url),
              method: "post",
              data: this.$http.adornData({ ids })
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.$message({
                  message: "操作成功",
                  type: "success",
                  duration: 1500,
                  onClose: () => {
                    if (this.activeName == "first") {
                      this.getDataList();
                    }
                    if (this.activeName == "second") {
                      this.getDataList2();
                    }
                  }
                });
              } else {
                this.$message.error(data.msg);
              }
            });
          }
        })
        .catch(() => {});
    },
    baoshen(id) {
      let url;
      if (this.activeName == "first") {
        url = "/approve/approveCarEntity/updateStatus";
      }
      if (this.activeName == "second") {
        url = "/approve/approveBoxEntity/updateStatus";
      }
      this.$http({
        url: this.$http.adornUrl(url),
        method: "post",
        data: this.$http.adornData({
          id: id
        })
      }).then(({ data }) => {
        console.log("数据列表data", data);
        if (data && data.code === 0) {
          if (this.activeName == "first") {
            this.getDataList();
          }
          if (this.activeName == "second") {
            this.getDataList2();
          }
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    //表格多选
    carDataSelection(selection) {
      this.carTableSelected = selection;
    },
    //表格多选
    boxDataSelection(selection) {
      this.boxTableSelected = selection;
    },
    //查询数据
    searchResult() {
      this.pageIndex = 1;
      if (this.activeName == "first") {
        this.getDataList();
      }
      if (this.activeName == "second") {
        this.getDataList2();
      }
    },
    getCount() {
      // let url;
      // if (this.activeName == "first") {
      //   url = "/approve/approveCarEntity/count";
      // }
      // if (this.activeName == "second") {
      //   url = "/approve/approveBoxEntity/count";
      // }
      // this.$http({
      //   url: this.$http.adornUrl(url),
      //   method: "get",
      //   param: this.$http.adornParams(),
      // }).then(({ data }) => {
      //   // data 是获取到的所有数据
      //   if (data && data.code === 0) {
      //     this.totalCount = data.data.memberCount;
      //     this.waitCheckCount = data.data.waitCheckCount;
      //     this.checkedCount = data.data.checkedCount;
      //     this.rejectCount = data.data.rejectCount;
      //     this.waitCommitCount = data.data.waitCommitCount;

      //   } else {
      //     this.$message({
      //       message: `${data.msg}`,
      //       type: "error",
      //     });
      //   }
      // });

      let stat2Count = 0;
      let stat3Count = 0;
      let stat4Count = 0;
      let stat5Count = 0;
      if (this.activeName == "first") {
        this.totalCount = this.dataList.length;
        for (let i = 0; i < this.dataList.length; i++) {
          if (this.dataList[i].status == "1") {
            stat2Count++;
          }
          if (this.dataList[i].status == "2") {
            stat3Count++;
          }
          if (this.dataList[i].status == "3") {
            stat4Count++;
          }
          if (this.dataList[i].status == "0") {
            stat5Count++;
          }
        }
        this.waitCheckCount = stat2Count;
        this.checkedCount = stat3Count;
        this.rejectCount = stat4Count;
        this.waitCommitCount = stat5Count;
      }
      if (this.activeName == "second") {
        this.totalCount = this.dataList2.length;
        for (let i = 0; i < this.dataList2.length; i++) {
          if (this.dataList2[i].status == "1") {
            stat2Count++;
          }
          if (this.dataList2[i].status == "2") {
            stat3Count++;
          }
          if (this.dataList2[i].status == "3") {
            stat4Count++;
          }
          if (this.dataList2[i].status == "0") {
            stat5Count++;
          }
        }
        this.waitCheckCount = stat2Count;
        this.checkedCount = stat3Count;
        this.rejectCount = stat4Count;
        this.waitCommitCount = stat5Count;
      }
    },
    //获取能源类型
    getCarSource() {
      this.sourceOptions = [];
      this.$http({
        url: this.$http.adornUrl(
          `/sys/sysdictionary/getSysDictionaryListByCode?code=car_source`
        ),
        method: "get",
        param: this.$http.adornParams()
      }).then(({ data }) => {
        // data 是获取到的所有数据
        if (data && data.code === 0) {
          data.data.forEach(item => {
            this.sourceOptions.push({ value: item.code, label: item.name });
          });
        } else {
          this.$message({
            message: `${data.msg}`,
            type: "error"
          });
        }
      });
    },
    //获取使用状态
    getCarSourceType() {
      this.sourceTypeOptions = [];
      this.$http({
        url: this.$http.adornUrl(
          `/sys/sysdictionary/getSysDictionaryListByCode?code=car_type`
        ),
        method: "get",
        param: this.$http.adornParams()
      }).then(({ data }) => {
        // data 是获取到的所有数据
        if (data && data.code === 0) {
          data.data.forEach(item => {
            this.sourceTypeOptions.push({ value: item.code, label: item.name });
          });
        } else {
          this.$message({
            message: `${data.msg}`,
            type: "error"
          });
        }
      });
    },
    //获取审核状态
    getCarSourceStatus() {
      this.statusOptions = [];
      this.$http({
        url: this.$http.adornUrl(
          `/sys/sysdictionary/getSysDictionaryListByCode?code=approve_status`
        ),
        method: "get",
        param: this.$http.adornParams()
      }).then(({ data }) => {
        // data 是获取到的所有数据
        if (data && data.code === 0) {
          data.data.forEach(item => {
            this.statusOptions.push({ value: item.code, label: item.name });
          });
        } else {
          this.$message({
            message: `${data.msg}`,
            type: "error"
          });
        }
      });
    },
    // 导入自定义文件上传行为
    uploadSectionFile(param) {
      let form = new FormData();
      console.log("parma////////", param);
      let url;
      if (this.activeName == "first") {
        url = "/approve/approveCarEntity/xlsInput";
      }
      if (this.activeName == "second") {
        url = "/approve/approveBoxEntity/xlsInput";
      }
      form.append("file", param.file);
      this.$http({
        url: this.$http.adornUrl(url),
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data"
        },
        data: form
      })
        .then(({ data }) => {
          if (!data.code) {
            this.$message({
              message: "导入成功!",
              type: "success"
            });
            // this.dataForm.enclosure = data.filePath;
            // this.dataForm.fileName = data.fileName;
            // 上传成功重新请求数据渲染页面
            // this.$emit('planData')
            if (this.activeName == "first") {
              this.getDataList();
            }
            if (this.activeName == "second") {
              this.getDataList2();
            }
          } else {
            if (this.activeName == "first") {
              this.$message.error("只支持导入巡查车辆文件");
            }
            if (this.activeName == "second") {
              this.$message.error("只支持导入群防岗亭文件");
            }
          }
        })
        .catch(err => {
          // alert(err)
        });
    },
    // 导出选中组数据
    exportSelectAll() {
      let httpaddress = window.SITE_CONFIG.baseUrl;
      let checkedIds = [];
      if (this.activeName == "first") {
        if (this.carTableSelected.length < 1) {
          this.$message({
            message: "请选择数据进行导出",
            type: "warning"
          });
          return;
        }
        this.carTableSelected.forEach(item => checkedIds.push(item.id));
        // checkedIds = this.carTableSelected;
      }
      if (this.activeName == "second") {
        if (this.boxTableSelected.length < 1) {
          this.$message({
            message: "请选择数据进行导出",
            type: "warning"
          });
          return;
        }
        this.boxTableSelected.forEach(item => checkedIds.push(item.id));
      }
      console.log("所选数组id", checkedIds);
      let token = document.cookie;
      if (this.activeName == "first") {
        const url = `${httpaddress}/approve/approveCarEntity/xlsOutputSelect?checkedIds=${checkedIds}
        &token=${Cookies.get("token")}`;
        const request = {
          method: 'get',
          url,
          headers: {
            token: this.$cookie.get('token'),
          },
          responseType: 'arraybuffer',
        };
        this.$http(request).then((response) => {
          if (response.data) {
            const a = document.createElement('a');
            a.target = '_blank';
            a.download = '导出数据.xls';
            a.href = window.URL.createObjectURL(new Blob([response.data]));
            a.click();
          }
        });
      }
      if (this.activeName == "second") {
        const url = `${httpaddress}/approve/approveBoxEntity/xlsOutputSelect?checkedIds=${checkedIds}
        &token=${Cookies.get("token")}`;
        const request = {
          method: 'get',
          url,
          headers: {
            token: this.$cookie.get('token'),
          },
          responseType: 'arraybuffer',
        };
        this.$http(request).then((response) => {
          if (response.data) {
            const a = document.createElement('a');
            a.target = '_blank';
            a.download = '导出数据.xls';
            a.href = window.URL.createObjectURL(new Blob([response.data]));
            a.click();
          }
        });
      }
    },

    //导出所有搜索数据
    exportSearchAll(tikuType) {
      let httpaddress = window.SITE_CONFIG.baseUrl;
      //   if (this.buttonType == "0") {
      //     checkedIds = this.areaTreeIds;
      //   } else {
      //     checkedIds = this.groupTreeIds;
      //   }
      console.log("export all", this.dataForm2);
      if (!this.shgl) {
        tikuType = "";
      }
      if (this.activeName == "first") {
        const url =
          window.SITE_CONFIG["baseUrl"] +
            `/approve/approveCarEntity/xlsOutputCondition?carSource=${
              this.dataForm.carSource
            }&startTime=${
              this.dataForm.dateRange == "" ? "" : this.dataForm.dateRange[0]
            }&endTime=${
              this.dataForm.dateRange == "" ? "" : this.dataForm.dateRange[1]
            }&page=${this.pageIndex}&limit=${this.pageSize}&search=${
              this.dataForm.name
            }&tikuType=${tikuType}&token=${this.$cookie.get("token")}`;
        const request = {
          method: 'get',
          url,
          headers: {
            token: this.$cookie.get('token'),
          },
          responseType: 'arraybuffer',
        };
        this.$http(request).then((response) => {
          if (response.data) {
            const a = document.createElement('a');
            a.target = '_blank';
            a.download = '导出数据.xls';
            a.href = window.URL.createObjectURL(new Blob([response.data]));
            a.click();
          }
        });
      } else {
        const url =
          window.SITE_CONFIG["baseUrl"] +
            `/approve/approveBoxEntity/xlsOutputCondition?townName=${
              this.dataForm2.value
            }&platformName=${this.dataForm2.value2}&startTime=${
              this.dataForm2.dateRange == "" ? "" : this.dataForm2.dateRange[0]
            }&endTime=${
              this.dataForm2.dateRange == "" ? "" : this.dataForm2.dateRange[1]
            }&page=${this.pageIndex}&limit=${this.pageSize}&search=${
              this.dataForm2.name
            }&tikuType=${tikuType}&token=${this.$cookie.get("token")}`;
        const request = {
          method: 'get',
          url,
          headers: {
            token: this.$cookie.get('token'),
          },
          responseType: 'arraybuffer',
        };
        this.$http(request).then((response) => {
          if (response.data) {
            const a = document.createElement('a');
            a.target = '_blank';
            a.download = '导出数据.xls';
            a.href = window.URL.createObjectURL(new Blob([response.data]));
            a.click();
          }
        });
      }
    },

    //导出模板
    downloadtemplate() {
      let httpaddress = window.SITE_CONFIG.baseUrl;
      let token = document.cookie;
      // let exportEx = this.currentTreeObject;
      // console.log(
      //   `${httpaddress}//resoure/resourearticle/gettemplate?gId=${exportEx}&token=${Cookies.get('token')}`
      // );
      // window.open(httpaddress +'//mail/mailgroup/gettemplate?gId=' + exportEx + '&' + token)
      if (this.activeName == "first") {
        const url = `${httpaddress}/approve/approveCarEntity/gettemplate?token=${Cookies.get(
          "token"
        )}`;
        const request = {
          method: 'get',
          url,
          headers: {
            token: this.$cookie.get('token'),
          },
          responseType: 'arraybuffer',
        };
        this.$http(request).then((response) => {
          if (response.data) {
            const a = document.createElement('a');
            a.target = '_blank';
            a.download = '导出模板.xls';
            a.href = window.URL.createObjectURL(new Blob([response.data]));
            a.click();
          }
        });
      } else {
        const url = `${httpaddress}/approve/approveBoxEntity/gettemplate?token=${Cookies.get(
          "token"
        )}`;
        const request = {
          method: 'get',
          url,
          headers: {
            token: this.$cookie.get('token'),
          },
          responseType: 'arraybuffer',
        };
        this.$http(request).then((response) => {
          if (response.data) {
            const a = document.createElement('a');
            a.target = '_blank';
            a.download = '导出模板.xls';
            a.href = window.URL.createObjectURL(new Blob([response.data]));
            a.click();
          }
        });
      }
    },
    // 新增 修改
    addOrUpdateHandle(id, type) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, type, "null");
      });
    },
    // 新增 修改
    addOrUpdateHandle2(id, type, manageType) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, type, manageType);
      });
    },
    //重新报审
    newbaoshen(id, type) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, type, "null");
      });
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      if (this.activeName == "first") {
        this.getDataList();
      }
      if (this.activeName == "second") {
        this.getDataList2();
      }
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      if (this.activeName == "first") {
        this.getDataList();
      }
      if (this.activeName == "second") {
        this.getDataList2();
      }
    },
    //转换标签
    handleTabClick(tab, event) {
      console.log("tab====>", tab);
      this.activeName = tab.name;
      if (this.activeName == "second") {
        this.documenttoken = `${httpaddress}/approve/approveBoxEntity/xlsInput?token=${this.$cookie.get(
          "token"
        )}`;
        this.getDataList2();
        this.getCount();
        this.getOption();
        this.getOption2();
      } else {
        this.documenttoken = `${httpaddress}/approve/approveCarEntity/xlsInput?token=${this.$cookie.get(
          "token"
        )}`;
        this.getDataList();
        this.getCount();
      }
      //   console.log("11111111111111", tab, event);
    },
    // 切换到标签2
    tabt() {
      this.activeName = "second";
      this.getDataList2();
      this.getCount();
      this.getOption();
    },
    // 切换到巡查车辆登记审核
    inspectionVehicle() {
      this.getDataList();
    },
    // 文件上传时的钩子
    beforeUploadFile(event, file, fileList) {
      this.fullscreenLoading = true;
      console.log("文件上传时的钩子", event, file, fileList);
    },
    //上传成功的回调
    handleAvatarSuccess(response, file, fileList) {
      this.fullscreenLoading = false;
      this.fileName = file.name;
      if (this.activeName == "first") {
        this.getDataList();
      } else {
        this.getDataList2();
      }
      // console.log("上传成功的回调", response);
      // console.log("上传成功的回调2", file);
      // console.log(fileList);
      if (file.response.errorData.length == 0) {
        this.$message({
          message: "导入成功!",
          type: "success"
        });
        this.getDataList();
      } else if (file.response.errorData.length > 0) {
        // this.errorDataVisible = true;
        let str = document.createElement("div");
        file.response.errorData.forEach(item => {
          let cdiv = document.createElement("div");
          cdiv.innerHTML = item.errorMsg;
          cdiv.style.marginTop = "10px";
          str.appendChild(cdiv);
        });
        this.$message({
          dangerouslyUseHTMLString: true,
          message: `<div>${file.response.msg}</div>${str.innerHTML}`,
          type: "error"
        });
        // this.$nextTick(() => {
        //   // this.$refs.errorData.init(file.response.errorData);
        //   // this.errDataVisible = true;
        //   this.errTableData = file.response.errorData;
        //   console.log("错误信息", file.response.errorData, this.errTableData);
        // });
      } else {
        this.$message.error({
          type: "error",
          message: `${file.response.msg}`
        });
      }
    },
    //错误信息导出
    exportExcel() {
      /* generate workbook object from table */
      var wb = XLSX.utils.table_to_book(document.querySelector("#tabledata"));
      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          "sheetjs.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    /**
     * @method
     * @desc 点击更多里的选项，链接到对应已经做好的但隐藏的按钮
     * @param {number} option 按钮类型
     */
    moreClick(option) {
      switch (option) {
        case 1:
          this.$refs.importButton.$el.click();
          break;
        case 2:
          this.$refs.importButton2.$el.click();
          break;
      }
    }
  }
};
</script>
<style lang="less">
.resource-management-all-container {
  background: white;
  min-width: 1355px;
  border-radius: 4px;
  overflow: hidden;
  height: calc(100vh - 112px);
  position: relative;
  box-shadow: 0px 4px 14px 3px rgba(54, 121, 225, 0.09);
  .el-tabs {
    .el-tabs__nav.is-top {
      padding-left: 35px;
      padding-top: 13px;
    }
    .el-tabs__header
      .el-tabs__nav-wrap
      .el-tabs__nav-scroll
      .el-tabs__nav {
      border: none;
      .el-tabs__item.is-top {
        color: #999999;
        font-size: 16px;
        font-weight: normal;
        padding: 0 !important;
        margin-right: 50px;
        height: 55px;
        line-height: 53px;
        border: none;
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
      display: inline-block;
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
      .el-icon-date {
        top: 2px;
      }
      .el-input__inner {
        height: 42px;
        line-height: 42px;
        padding-left: 10px;
        padding-right: 10px;
        font-size: 16px;
        font-weight: 400;
      }
      .el-icon-arrow-up::before {
        margin-top: 9px;
      }
      .el-input__suffix {
        right: 11px;
        top: 1px;
        background: white;
        height: 40px;
      }
      .el-icon-arrow-up::before {
        background: no-repeat
          url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAOCAYAAAA1+Nx+AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAGKADAAQAAAABAAAADgAAAAANlRePAAABeklEQVQ4Eb1SsUrEQBC9TXEBwc5gL/gBFsKh5BIrK1sNglwh9lp4foMnqL9wCBJrsbAQk0tODiysUgn2EvsjFonvHVnY80xcLFwYZjIz772Z3TQa/33CMNxJkqT5V11iwbEt8YYM6AeDwUFRFH6apn14odZ0YmJK7A25iJkSMAzDF0K8IO+h4VyHVO0pMR45yMXazJSj0Wgxy7InTLOE+onruj2VpCoOgqCL2inI30zTXGu1Wu/snRFgEne4DDeELWCSjm3bV8xXnSiK9vI876P+AVt3HOdV9v4owCImWoV7xERN2Fa73b6XINXjWjax7S3sE/kNbPys1isF2PQbWGeIqUdWlRlzalzRPjaYg92VVzdpY8wca+yp2rB2AymITY5xxz2QTR4QhGI8Hg/5IyDugvxM9n73WgIEYeILEB5ChL9xA/EK4ks86BG/q462AAgFRK5B5JVkPsh3IVJUkTNf+wYqkESWZXXgH2hlXEuu4rXjOI7nabqAL81rpopzt9VwAAAAAElFTkSuQmCC);
        background-size: 20px 10px;
        background-position: center;
        transform: rotate(180deg);
      }
      .el-icon-circle-close {
        font-size: 16px;
      }
      &:nth-child(2) {
        width: 132px;
      }
    }
    .date-block {
      display: inline-block;
      .date-range {
        height: 42px;
        width: 290px;
        // margin-left: 1px;
        .el-icon-date {
          top: 2px;
        }
        .el-range-input,
        .el-range-separator {
          font-size: 16px;
        }
        .el-range-input {
          margin-left: 20px;
          width: 105px;
        }
        .el-range-separator {
          margin-top: 6px;
          margin-left: 5px;
          margin-right: -15px;
        }
        .el-range__icon {
          font-size: 17px;
        }
        .el-range__close-icon {
          font-size: 17px;
          position: relative;
          top: 1px;
        }
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
    .add-button {
      position: absolute;
      right: 10px;
      width: 73px;
      height: 42px !important;
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
  .zygl-content-table {
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
  }
  .zygl-content-footer {
    height: 83px;
    position: relative;
    .el-pagination {
      position: absolute;
      bottom: 15px;
      right: 30px;
      .el-pagination__total {
        font-size: 16px;
        color: rgba(96, 98, 102, 1);
        vertical-align: center;
        position: relative;
        top: 8px;
        right: 10px;
      }
      .number,
      .btn-prev,
      .btn-next,
      .more {
        border-radius: 3px;
        height: 42px;
        width: 42px;
        line-height: 42px;
        font-size: 16px;
        font-weight: normal;
        margin: 0 !important;
        margin-right: 14px !important;
      }
      .el-pagination__sizes {
        .el-input__inner {
          border-radius: 3px;
          height: 42px;
          width: 107px;
          line-height: 42px;
          font-size: 16px;
        }
      }
      .el-pagination__jump {
        height: 42px;
        line-height: 42px;
        font-size: 16px;
        margin-left: 5px;
        .el-input__inner {
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
</style>
