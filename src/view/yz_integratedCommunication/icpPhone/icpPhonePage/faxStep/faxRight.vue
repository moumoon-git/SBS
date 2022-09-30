<template>
  <div class="my-phone-right-main">
    <!-- 传真发送单位框 -->
    <div class="my-phone-right-main-user">
      <div v-if="peopleList.length == 0" class="my-fax-picture">暂无单位</div>
      <div v-else class="my-fax-list-box">
        <!-- 添加滚动 -->
        <el-scrollbar>
          <el-tag
            v-for="(item, index) in peopleList"
            :key="index"
            closable
            type="info"
            @close="myDelete(index)"
          >{{ item.name || item.contactor }}</el-tag>
        </el-scrollbar>
        <!-- 滚动结束 -->
      </div>
      <div class="my-fax-head">
        <div class="my-fax-head-left">
          已添加联系人:
          <span>{{ peopleList.length }}人</span>
        </div>
        <div class="my-fax-head-right">
          <span @click="getContactsInfo">存为分组</span>
          <span class="my-fax-head-right-line"></span>
          <span @click="selectHandle" v-if="visFlag">选择通讯录</span>
          <span class="my-fax-head-right-line" v-if="visFlag"></span>
          <span @click="submitPhones">添加号码</span>
          <span class="my-fax-head-right-line"></span>
          <span @click="clearNumber">清除</span>
          <!-- <span class="my-fax-head-right-line"></span>
          <span >保存分组</span>-->
        </div>
      </div>
      <el-dialog
        title="存为传真分组"
        :visible.sync="dialogVisible"
        width="30%"
        :close-on-click-modal="false"
      >
        <div class="tree">
          <el-scrollbar style="height: 100%">
            <el-tree
              :data="faxTreeData"
              :check-on-click-node="true"
              ref="tree"
              :check-strictly="true"
              node-key="id"
              :default-expanded-keys="groupIds"
              :default-checked-keys="groupIds"
              :props="defaultProps"
            ></el-tree>
          </el-scrollbar>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="groupDialogVisible = true">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 存为分组确认 -->
      <el-dialog
        title="提示"
        :visible.sync="groupDialogVisible"
        width="450px"
        custom-class="groupDialog"
        :close-on-click-modal="false"
      >
        <img
          src="/static/img/ConvergedCommunication/bell.png"
          alt
          style="margin-right: 10px; text-align: center"
        />
        <span style="color: #555">请选择存为分组的保存模式</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="setType('overwrite')" size="medium">覆 盖</el-button>
          <el-button
            type="primary"
            @click="setType('append')"
            size="medium"
            style="margin-right: 20px"
          >追 加</el-button>
        </span>
      </el-dialog>
    </div>

    <!-- 传真信息选择框 -->
    <div class="sendFaxBox">
      <el-form v-model="faxForm" label-width="80px" @submit.native.prevent label-position="right">
        <div class="fax-information">
          <el-row :gutter="gutter">
            <el-col :span="24">
              <el-form-item>
                <span slot="label">传真标题</span>
                <el-input v-model="faxForm.faxTitle" class="faxTitle-input" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="eventRelevance" :gutter="gutter">
            <el-col :span="24">
              <el-form-item label="事件关联">
                <el-popover placement="bottom" v-model="visible" popper-class="eventOptions">
                  <div class="eventSearch">
                    <el-input v-model="searchText" placeholder="请输入关键字" size="small">
                      <i slot="suffix" class="el-input__icon el-icon-search" @click="searchEvent"></i>
                    </el-input>
                  </div>
                  <!-- <div class="recentOptions">
                <div class="recentTitle">近期选择：</div>
                <ul class="recentList">
                  <li class="eachRecent">08.27天河区自然灾害</li>
                </ul>
                  </div>-->
                  <template v-if="eventOptions.length > 0">
                    <ul class="eventList">
                      <li
                        v-for="item in eventOptions"
                        :key="item.id"
                        class="evenyEvent"
                        @click="selectEvent(item)"
                        :style="selectEventStyle(item.id)"
                      >{{ item.title }}</li>
                      <div class="loadMore">
                        <el-button
                          round
                          icon="iconfont icon-loadMore"
                          size="mini"
                          @click="loadMoreHandle"
                          v-if="loadMore"
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
                    v-model="faxForm.caseTitle"
                    readonly
                    placeholder="请选择"
                    size="small"
                  ></el-input>
                </el-popover>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="gutter">
            <el-col :span="24">
              <el-form-item>
                <span slot="label">
                  <span style="color: red">*</span>传真文件
                </span>
                <el-input v-show="false" v-model="faxForm.faxFileName" readonly></el-input>
                <div style="width: 100%; text-align: left">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    accept=".pdf, .jpg, .jpeg, .png, .ppt, .pptx, .doc, .docx, .txt, .xlsx, .xls"
                    :limit="1"
                    :action="action"
                    :headers="{
                      Authorization: $window.localStorage.getItem('token')
                        ? $window.localStorage.getItem('token')
                        : '',
                    }"
                    auto-upload
                    with-credentials
                    :file-list="faxFileList"
                    :on-remove="handleRemove"
                    :before-upload="beforeUpload"
                    :on-exceed="onExceed"
                    :on-success="onSuccess"
                    :show-file-list="true"
                  >
                    <el-button class="btn-upload" slot="trigger" plain>上传文件</el-button>
                    <el-tooltip
                      class="item el-upload__tip"
                      effect="dark"
                      content="支持扩展名：.pdf, .jpg, .jpeg, .png, .ppt, .pptx, .doc, .docx, .txt, .xlsx, .xls"
                      placement="top"
                    >
                      <span>支持扩展名：.pdf...</span>
                    </el-tooltip>
                    <!-- <span class="el-upload__tip">支持扩展名：.pdf...</span> -->
                    <el-button
                      style="padding: 7px 10px"
                      type="primary"
                      @click="handleFaxTemplate"
                    >传真模板</el-button>
                  </el-upload>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="gutter">
            <el-col :span="24">
              <el-form-item>
                <span slot="label">传真回执</span>
                <el-input v-show="false" v-model="faxForm.receiptFileName" readonly></el-input>
                <div style="width: 100%; text-align: left">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    accept=".pdf, .jpg, .jpeg, .png, .ppt, .pptx, .doc, .docx, .txt, .xlsx, .xls"
                    :limit="1"
                    :action="action"
                    :headers="{
                      Authorization: $window.localStorage.getItem('token')
                        ? $window.localStorage.getItem('token')
                        : '',
                    }"
                    auto-upload
                    with-credentials
                    :file-list="receiptFileList"
                    :on-remove="receiptFileHandleRemove"
                    :before-upload="receiptFilebeforeUpload"
                    :on-exceed="onExceed"
                    :on-success="receiptFileonSuccess"
                    :show-file-list="true"
                  >
                    <el-button class="btn-upload" slot="trigger" plain>上传文件</el-button>
                    <el-tooltip
                      class="item el-upload__tip"
                      effect="dark"
                      content="支持扩展名：.pdf, .jpg, .jpeg, .png, .ppt, .pptx, .doc, .docx, .txt, .xlsx, .xls"
                      placement="top"
                    >
                      <span class="el-upload__tip">支持扩展名：.doc .pdf .jpg...</span>
                    </el-tooltip>
                  </el-upload>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="fax-action">
          <el-row :gutter="gutter">
            <el-col :span="2">
              <el-tooltip content="预览" placement="top">
                <div class="icon-preview" @click="previewSubmit"></div>
              </el-tooltip>
            </el-col>
            <el-col :span="2">
              <el-tooltip content="扫描" placement="top">
                <div class="icon-scan" @click="ScanUpload"></div>
              </el-tooltip>
            </el-col>
            <el-col :span="2">
              <el-tooltip content="图片上传" placement="top">
                <div class="icon-PictureUpload" @click="PictureUpload"></div>
              </el-tooltip>
            </el-col>

            <el-col :span="13">
              <el-date-picker
                class="faxTitle-input"
                v-model="faxForm.sendingTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm"
                type="datetime"
                placeholder="选择发送时间"
                style="width: 195px"
              ></el-date-picker>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" size="mini" @click="submitUpload">发送</el-button>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>

    <!-- 传真队列 -->
    <div class="sendFaxList">
      <div class="sendFaxList-headtext">
        <span class="sendFaxList-headline"></span>
        <span>传真队列</span>
      </div>
      <el-table
        class="faxListTable"
        :data="faxListTableData"
        style="width: 100%"
        height="190"
        :header-cell-style="getRowClass"
        :cell-style="getCellStyle"
      >
        <el-table-column label="发送方式" width="70">
          <template slot-scope="scope">
            <div>{{ scope.row.type }}</div>
            <div>{{ scope.row.sendTimeAfter }}</div>
          </template>
        </el-table-column>
        <el-table-column label="总数" width="44">
          <template slot-scope="scope">
            <span>{{ scope.row.totalNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="成功" width="44">
          <template slot-scope="scope">
            <span style="color: #0bd295">{{ scope.row.successfulNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="失败" width="44">
          <template slot-scope="scope">
            <span style="color: #f66e6e">{{ scope.row.failedNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="待发" width="44">
          <template slot-scope="scope">
            <span style="color: #f2b626">{{ scope.row.waitNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="76">
          <template slot-scope="scope">
            <div>{{ scope.row.status }}</div>
            <div>
              {{ scope.row.remainTime
              }}
              <span style="color: #f66e6e" v-show="scope.row.sec !== '00'">
                {{
                scope.row.sec
                }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false" @click="detail(scope.row)">查看</el-link>
            <br />
            <el-link
              type="primary"
              :underline="false"
              @click="cancel(scope.row.faxFile)"
              :disabled="scope.row.status === '发送完毕'"
            >撤销</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 传真模板弹窗 -->
    <el-dialog
      title="选择模板"
      class="faxTemplateDialog"
      :close-on-click-modal="false"
      :visible.sync="faxTemplateVisible"
      width="1200px"
      top="5vh"
      @closed="dialogClosed"
    >
      <el-row>
        <el-col :span="4" style="height: 648px">
          <el-scrollbar style="height: 100%">
            <div
              v-if="faxTemplateTreeList.length === 0"
              style="text-align: center; color: #666"
            >暂无模板数据</div>
            <el-tree
              v-else
              :data="faxTemplateTreeList"
              :props="defaultProps"
              @node-click="handleFaxTemplateTree"
            ></el-tree>
          </el-scrollbar>
        </el-col>
        <el-col :span="20">
          <div>
            <editor-bar
              :heightEditor="heightEditor"
              :noneDisplay="noneDisplay"
              ref="editorBar"
              v-model="editor.info"
              :isClear="isClear"
            ></editor-bar>
            <div style="padding: 10px">
              <div
                style="
                  font-size: 14px;
                  color: #333;
                  margin-bottom: 10px;
                  text-align: left;
                "
              >
                <i class="el-icon-s-order" />剪切板信息
              </div>
              <el-input
                style="font-size: 14px"
                type="textarea"
                :rows="4"
                placeholder="请输入内容"
                v-model="shearVal"
              ></el-input>
            </div>
          </div>
        </el-col>
      </el-row>
      <div style="text-align: right; margin-top: 8px">
        <el-button style="padding: 10px 25px" @click="faxTemplateVisible = false">取 消</el-button>
        <el-button style="padding: 10px 25px" type="primary" @click="faxTemplateEnter">确 认</el-button>
      </div>
    </el-dialog>

    <!-- 传真详情对话框 -->
    <el-dialog
      :visible.sync="faxdetailVisible"
      width="1350px"
      center
      class="dialog-style"
      :close-on-click-modal="false"
      top="2vh"
      @close="faxdetailClose()"
    >
      <div slot="title" class="dialog-header" v-text="'传真详情'"></div>
      <div style="height: 700px">
        <div class="rightShow" style="float: left; width: 800px">
          <iframe :src="faxDetail.path" width="100%" height="100%" frameborder="0" scrolling="no"></iframe>
        </div>
        <div class="faxdetail-line"></div>
        <div class="faxdetailright">
          <div class="sendFaxList-headtext">
            <span class="sendFaxList-headline"></span>
            <span>传真标题：{{ faxDetail.faxName }}</span>
          </div>
          <div class="faxDetailInform">
            <span>发送方式:{{ faxDetail.type }}</span>
            <span class="my-fax-head-right-line"></span>
            <span style="margin-top: -4px">
              文件共
              <span style="font-size: 16px">{{ faxDetail.faxList.length }}</span>份
            </span>
            <div
              v-if="faxDetail.waitFileList.length > 0"
              style="float: right; margin: -20px 0 0 80px"
            >
              <el-button
                v-if="faxDetail.status !== '发送完毕'"
                type="primary"
                size="medium"
                v-text="'撤销'"
                @click="cancel(faxDetail.fileName)"
              ></el-button>
            </div>
          </div>
          <div style="margin-top: 10px">
            <el-tabs v-model="tabsActiveName" @tab-click="handleClick" class="tabsTitle">
              <el-tab-pane :label="'发送队列（' + faxDetail.waitFileList.length + '）'" name="first">
                <div class="sendList" v-for="(item, index) in faxDetail.waitFileList" :key="index">
                  <div style="display: flex; justify-content: space-between">
                    <div>收件单位：{{ item.workUnit || item.number }}</div>
                    <div>
                      <span
                        style="
                          color: #adb6c2;
                          font-weight: bold;
                          cursor: pointer;
                          margin: -12px -20px;
                          font-size: 14px;
                        "
                        @click="deleteFax(item)"
                      >×</span>
                      <span style="color: #555555; font-weight: normal">
                        正在发送第{{
                        item.currentPage + "/" + item.totalPage
                        }}页
                      </span>
                    </div>
                  </div>
                  <!-- {{faxDetail.currentPage/faxDetail.totalPage}} -->
                  <el-progress
                    :percentage="(item.currentPage / item.totalPage) * 100"
                    :stroke-width="2"
                    :show-text="false"
                  ></el-progress>
                </div>
              </el-tab-pane>
              <el-tab-pane :label="'发送成功（' + faxDetail.successFileList.length + '）'" name="second">
                <div
                  class="sendList"
                  v-for="(item, index) in faxDetail.successFileList"
                  :key="index"
                >
                  收件单位：{{ item.workUnit || item.number }}
                  <span
                    style="color: #555555; float: right; font-weight: normal"
                  >{{ item.sendTime }}</span>
                </div>
              </el-tab-pane>
              <el-tab-pane :label="'发送失败（' + faxDetail.failedFileList.length + '）'" name="third">
                <div
                  class="sendList"
                  v-for="(item, index) in faxDetail.failedFileList"
                  :key="index"
                >
                  收件单位：{{ item.workUnit || item.number }}
                  <span style="float: right">
                    <el-button type="text" size="mini" @click="reSendFax(item)">重发</el-button>
                  </span>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 传真预览对话框 -->
    <el-dialog
      :visible.sync="faxPreviewVisible"
      width="1000px"
      center
      class="dialog-style"
      :close-on-click-modal="false"
      top="2vh"
    >
      <div slot="title" class="dialog-header" v-text="'传真预览'"></div>
      <div style="height: 700px">
        <!-- 左缩略 -->
        <div class="leftShow">
          <!-- 传真文件 -->
          <div class="faxFileShow" @click="loadPreview(pdfPath)">
            <div v-if="pdfPath" class="filetitle">传真文件</div>
            <div v-if="pdfPath" class="filecontent1">
              <iframe
                :src="pdfPath"
                width="100%"
                height="90%"
                frameborder="0"
                scrolling="no"
                data-types="click"
              ></iframe>
            </div>
            <div v-else class="filecontent1">
              <div class="icon-smile">暂无传真文件</div>
            </div>
          </div>
          <!-- 回执文件 -->
          <div
            class="faxFileShow"
            style="margin-top: 10px"
            @click="loadPreview(receiptFilepdfPath)"
          >
            <div v-if="pdfPath" class="filetitle">传真回执</div>
            <div v-if="pdfPath" class="filecontent1">
              <iframe
                :src="receiptFilepdfPath"
                width="100%"
                height="100%"
                frameborder="0"
                scrolling="no"
              ></iframe>
            </div>
            <div v-else class="filecontent1">
              <div class="icon-smile">暂无传真回执</div>
            </div>
          </div>
        </div>
        <!-- 右放大 -->
        <div class="rightShow" style="float: right">
          <iframe
            :src="previewPath"
            id="iframe"
            width="100%"
            height="100%"
            frameborder="0"
            scrolling="no"
          ></iframe>
        </div>
      </div>
    </el-dialog>

    <!-- 图片上传对话框 -->
    <el-dialog
      :visible.sync="pictureVisible"
      width="1000px"
      center
      class="dialog-style"
      :close-on-click-modal="false"
      top="2vh"
    >
      <div slot="title" class="dialog-header" v-text="'图片上传'"></div>
      <div style="height: 700px">
        <!-- 左缩略 -->
        <div class="leftShow">
          <!-- 上传 -->
          <div class="pictureShow1">
            <!-- <div class="upload-picture"> -->
            <el-upload
              class="upload-picture"
              ref="upload"
              accept=".jpg, .jpeg, .png"
              :action="action"
              :headers="{
                Authorization: $window.localStorage.getItem('token')
                  ? $window.localStorage.getItem('token')
                  : '',
              }"
              multiple
              auto-upload
              list-type="picture"
              with-credentials
              :file-list="pictureList"
              :show-file-list="true"
              :on-remove="pictureHandleRemove"
              :on-preview="pictureHandlePreview"
              :before-upload="picturebeforeUpload"
              :on-success="pictureonSuccess"
            >
              <div slot="trigger" class="icon-PictureUpload3">获取系统图片</div>
            </el-upload>
            <!-- </div> -->
          </div>

          <div class="pictureShow2">
            <div v-if="pictureList.length == 0" class="icon-smile">暂无上传图片</div>
          </div>
        </div>
        <!-- 右放大 -->
        <div v-if="pictureList.length > 0" class="rightShow" style="float: right">
          <iframe
            :src="picturePath"
            id="iframe"
            width="100%"
            height="100%"
            frameborder="0"
            scrolling="no"
          ></iframe>
        </div>
        <div v-else class="filecontent2">
          <div class="icon-smile">暂无图片</div>
        </div>
        <el-button
          v-if="pictureList.length > 0"
          type="primary"
          size="mini"
          @click="composeFile"
          style="float: right; margin: -20px 20px 0 0"
        >完成</el-button>
      </div>
    </el-dialog>

    <!-- 传真扫描对话框 -->
    <el-dialog
      :visible.sync="scanVisible"
      width="1000px"
      center
      class="dialog-style"
      :close-on-click-modal="false"
      top="2vh"
    >
      <div slot="title" class="dialog-header" v-text="'传真扫描'"></div>
      <div style="height: 700px">
        <div class="leftShow">
          <div class="pictureShow1">
            <div v-if="faxScanStatus == 0" class="icon-scan3" @click="getScan">点击获取扫描件</div>
            <div v-else-if="faxScanStatus == 1" class="icon-scanloading">正在扫描</div>
            <div v-else-if="faxScanStatus == 2" class="icon-scanimport">
              <div class="scanFileShow">
                <iframe
                  :src="scanFilePath"
                  width="100%"
                  height="100%"
                  frameborder="0"
                  scrolling="no"
                ></iframe>
                <div v-if="scanFilePath != ''" class="icon-close" @click="scanClose"></div>
              </div>
              <div
                style="
                  cursor: pointer;
                  margin-top: -40px;
                  margin-left: 15px;
                  height: 20px;
                "
                @click="scanImport"
              >确认导入</div>
            </div>
            <div v-else-if="faxScanStatus == 3" class="icon-rescan">
              <div
                style="cursor: pointer; margin-top: 15px; margin-left: 15px"
                @click="getScan"
              >重新扫描</div>
            </div>
          </div>
          <div class="pictureShow2">
            <div v-if="ScanList.length > 0">
              <el-upload
                class="upload-scan"
                ref="upload"
                accept=".jpg, .jpeg, .png"
                :action="action"
                :headers="{
                  Authorization: $window.localStorage.getItem('token')
                    ? $window.localStorage.getItem('token')
                    : '',
                }"
                multiple
                auto-upload
                list-type="picture"
                with-credentials
                :file-list="ScanList"
                :on-remove="ScanHandleRemove"
                :on-preview="ScanHandlePreview"
                :show-file-list="true"
              >
                <div slot="trigger"></div>
              </el-upload>
            </div>
            <div v-else class="icon-smile">暂无扫描件</div>
          </div>
        </div>
        <div v-if="ScanList.length > 0" class="rightShow" style="float: right">
          <iframe
            :src="scanPath"
            id="iframe"
            width="100%"
            height="100%"
            frameborder="0"
            scrolling="no"
          ></iframe>
        </div>
        <div v-else class="filecontent2">
          <div class="icon-smile">暂无扫描件</div>
        </div>
        <el-button
          v-if="ScanList.length > 0"
          type="primary"
          size="mini"
          @click="composeScan"
          style="float: right; margin: -20px 20px 0 0"
        >完成</el-button>
      </div>
    </el-dialog>

    <div class="elDialog" v-show="addContactVisible">
      <addContact
        ref="addContact"
        v-if="addContactVisible"
        @getCheckCharge="getCheckCharge"
        @changeDialog="addContactVisible = false"
      ></addContact>
    </div>
    <!-- 提示弹窗 -->
    <prompt-dialog-box
      v-if="promptConfig.visible"
      :prompt-dialog-config="promptConfig"
      @confirm="promptConfirm"
      @cancel="promptCanCel"
    ></prompt-dialog-box>
  </div>
</template>

<script>
import bus from "@/yz_components/common/js/eventBus";
import { Url } from "@/assets/js/common";
import EditorBar from "@/view/yz_eventManagement/informationDisposal/editorChint";
import addContact from "../smsStep/addContact/AddContact";
import promptDialogBox from "@/yz_components/promptDialogBox/promptDialogBox";
// import EditorBar from '@/view/eventManagement/informationDisposal/editorChint1'
// import $ from 'jquery'
import { mapGetters } from "vuex";
export default {
  components: {
    EditorBar,
    addContact,
    promptDialogBox,
  },
  props: {
    isAddPhonesShow: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  data() {
    return {
      visFlag: true,
      eventRelevance: true,
      peopleListAddContactVal: "",
      addContactVisible: false,
      faxPath: "",
      shearVal: "", //剪切板内容
      faxTreeData: [], // 传真分组数据
      dialogVisible: false, // 保存分组弹框
      groupDialogVisible: false, // 分组确认弹窗
      contactsList: [], // 联系人列表
      groupIds: [-3], // 默认选中展开分组id
      faxTemplateVisible: false, // 传真模板弹窗
      faxTemplateTreeList: [], //传真模板数据
      defaultProps: {
        //传真模板树配置
        children: "children",
        label: "name",
      },
      heightEditor: {
        height: "480px",
      },
      noneDisplay: {
        display: "flex",
      },
      isClear: false,
      editor: {
        info: "",
      },
      seatNumber: sessionStorage.getItem("seat"),
      agent_id: sessionStorage.getItem("agent_id"),
      HWICP_Version: window.g.HWICP_Version, //icp版本
      findfaxData: [],
      findfaxNumber: [],
      gutter: 20,
      faxForm: {
        caseId: "", //事件关联Id
        caseTitle: "", //事件关联标题
        faxTitle: "", //传真标题
        sendingTime: "", //发送时间(默认显示当前时间)
        faxFileName: "", //传真文件地址
        receiptFileName: "", //回执文件
        pictureFileName: [], //图片
      }, //传真文件表单
      // peopleList: [],//选择发送传真的人员列表;
      eventOptions: [], //事件关联选择框
      phonesText: "", //电话号码输入框
      contactorIds: "", //联系人id
      action: Url + "/eos/communication/fax/convertPDF",
      fileList: [], //发送文件列表
      fileListTime: null,
      faxFileList: [], //传真文件
      previewName: "", //文件预览名称
      pdfPath: "", //PDF路径
      receiptFileList: [], //传真回执文件
      receiptFilepreviewName: "", //传真回执文件预览名称
      receiptFilepdfPath: "", //传真回执文件PDF路径
      faxListTableData: [], //传真队列
      faxPreviewVisible: false, //传真预览对话框
      previewPath: "", //文件、回执预览路径
      pictureVisible: false, //图片上传对话框
      picturePath: "", // 图片预览路径
      pictureList: [], //图片文件列表
      scanVisible: false, //扫描文件对话框
      ScanList: [], //扫描文件列表
      scanPath: "", // 扫描预览路径
      faxdetailVisible: false, //传真详情对话框
      tabsActiveName: "first",
      faxDetail: {
        status: "", //传真发送状态
        fileName: "", //传真文件名
        path: "", //预览地址
        type: "", //发送方式
        faxName: "", //标题
        sendTime: "", //发送时间
        time: null, //倒计时
        Timetext: "撤销", //倒计时显示
        remainTime: {
          day: "",
          hour: "",
          min: "",
          sec: "",
        },
        faxList: [], //传真队列
        failedFileList: [], //失败
        successFileList: [], //失败
        waitFileList: [], //失败
      },
      msgHeadleState: "no",
      visible: false,
      currentPage: 1, // 事件列表页码
      searchText: "", // 事件列表搜索关键字
      loadMore: true, // 是否有更多事件数据
      promptConfig: {
        // 提示弹窗的配置
        visible: false, // 是否显示弹窗
        promptType: "warn", // 弹窗类型：delete:删除提示弹窗,warn：警告提示弹窗,success：成功提示弹窗,error：错误提示弹窗,info：常规类信息提示弹窗,default：不包含icon提示弹窗
        promptTitle: "敏感信息发送提醒", // 弹窗标题
        promptText: "即将通过非密网络发送信息，请勿发送泄密信息", // 弹窗文本
        cancelButtonText: "取消发送", // 取消操作按钮文本
        confirmButtonText: "立即发送", // 确认操作按钮文本
        isNeedIcon: true  // 是否需要显示左边的图标
      },
      IsYangZhouProject: window.g.IsYangZhouProject, // 扬州项目
      IsZengChengProject: window.g.IsZengChengProject, // 增城项目
    };
  },
  computed: {
    ...mapGetters({
      scanFilePath: "getscanFilePath", //扫描文件路径
      faxScanStatus: "getfaxScanStatus", //0：非作业中，1：扫描中2：成功，3：失败，
      peopleList: "getFaxMember",
      faxSendCount: "getFaxSendCount",
    }),
    selectEventStyle() {
      return function (eventId) {
        if (this.faxForm.caseId == eventId) {
          return "color:#0091ff;background-color:rgba(0, 145, 255, .1);";
        } else {
          return "";
        }
      };
    },
  },
  watch: {
    scanFilePath(val) {},
    faxScanStatus(val) {},
    faxSendCount() {
      this.getFaxList();
    },
  },
  created() {
    this.getEventOptions();
    var that = this;
    // this.$bus.$on("clearNumber", function() {
    //   that.clearNumber();
    // });
  },
  mounted() {
    const that = this;
    this.getFaxList();
    this.fileListTime = setInterval(this.getRemainTime, 1000);

    // 添加的通讯录数据
    bus.$off("getContact");
    bus.$on("getContact", (data) => {
      if (data.length != 0) {
        let arr = [];
        data.forEach((ele) => {
          arr.push(ele);
        });
        // that.peopleList = arr
        that.$store.commit("setFaxMember", arr);
        // console.log(that.peopleList)
      } else {
        that.$store.commit("setFaxMember", []);
      }
    });

    // 实时更新传真详情
    bus.$off("getfaxQueue");
    bus.$on("getfaxQueue", (fileName) => {
      let data = {
        fileName,
      };
      this.$api.faxQueuefindByName(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        this.faxDetail.faxName = res.data.faxName;
        this.faxDetail.sendTime = res.data.sendTime;
        this.faxDetail.faxList = [];
        this.faxDetail.failedFileList = [];
        this.faxDetail.successFileList = [];
        this.faxDetail.waitFileList = [];
        this.faxDetail.faxList = res.data.faxList;
        if (this.faxDetail.faxList.length > 0) {
          for (let i in this.faxDetail.faxList) {
            if (this.faxDetail.faxList[i].type == 1)
              this.faxDetail.waitFileList.push(this.faxDetail.faxList[i]);
            else if (this.faxDetail.faxList[i].type == 2)
              this.faxDetail.failedFileList.push(this.faxDetail.faxList[i]);
            else if (this.faxDetail.faxList[i].type == 3)
              this.faxDetail.successFileList.push(this.faxDetail.faxList[i]);
          }
        }
      });
    });
  },
  beforeDestroy: function () {
    clearInterval(this.fileListTime);
  },
  methods: {
    /**
     * @author hexinting
     * @date 2020-10-25
     * @lastEditor hexinting
     * @lastDate 2020-10-25
     * @description 弹窗确认按钮
     */
    promptConfirm() {
      this.sendFax(); // 发送传真
    },
    /**
     * @author hexinting
     * @date 2020-10-25
     * @lastEditor hexinting
     * @lastDate 2020-10-25
     * @description 弹窗取消按钮
     */
    promptCanCel() {
      this.promptConfig.visible = false; // 隐藏弹窗
    },
    // 选择通讯录
    selectHandle() {
      this.$store.commit("setSmsOrFax", "fax");
      this.addContactVisible = true;
      this.$nextTick(() => {
        this.$refs.addContact.getDataList("getContact", this.peopleList);
      });
    },
    // 获取选择通讯录数据
    getCheckCharge(val) {
      this.peopleListAddContactVal = val;
    },
    // 点击传真模板按钮
    handleFaxTemplate() {
      this.faxTemplateVisible = true; // 弹窗
      //获取传真模板数据
      this.$api.getFaxTemplateTree().then((res) => {
        this.faxTemplateTreeList = res.data;
      });
    },
    // 点击传真模板树节点
    handleFaxTemplateTree(data) {
      // 显示传真模板
      this.$refs.editorBar.editor.txt.html(data.content);
    },
    // 关闭弹窗回调
    dialogClosed() {
      // this.$refs.editorBar.editor.txt.html('')
    },
    // 确认传真模板
    faxTemplateEnter() {
      console.log(this.$refs.editorBar.editor.txt.html());
      let parmas = {
        html: this.$refs.editorBar.editor.txt.html(),
      };
      this.$api.convertHtmlPDF(parmas).then((res) => {
        this.faxPath = `${window.g.ApiUrl}/fax/${res.data}`;
        this.previewName = `${res.data}`;
        console.log(this.faxPath);
        this.faxFileList = [];
        let objFile = new File(
          ["First Line Text", "Second Line Text"],
          "上传模板"
        );
        this.faxFileList.push(objFile);
        this.faxTemplateVisible = false;
      });
    } /* 传真发送单位框 */, //添加号码
    /* #region */ getfaxDataN(data) {
      console.log("--data", data);
      console.log("---this.findfaxNumber", this.findfaxNumber);
      // data.forEach((o,i)=>{
      //   if(this.findfaxNumber.indexOf(o)==-1){
      //       this.peopleList.push({
      //         id:0,
      //         name:'',
      //         fax:o,
      //     })
      //     this.findfaxNumber.push(o)
      //   }
      // })
      // this.$emit("update:isAddPhonesShow",false);
      data.forEach((o, i) => {
        console.log("--o--", o);
        console.log("--this.peopleList--", this.peopleList);
        console.log("--this.findfaxNumber--", this.findfaxNumber);
        console.log(
          "长度：",
          this.findfaxNumber.filter((item) => o === item).length
        );
        // if (this.findfaxNumber.indexOf(o) == -1) {
        if (this.findfaxNumber.filter((item) => o === item).length === 0) {
          let arg = { phoneNum: o };
          // 根据号码获取联系人
          this.$api.findContactorByMobile(arg).then((res) => {
            if (res.errorcode != 0) {
              this.$message({
                message: res.msg,
                type: "error",
              });
            }
            if (res.data.id == 0 || res.data.fax !== o) {
              this.peopleList.push({
                id: 0,
                name: o,
                fax: o,
              });
              this.findfaxNumber.push(o);
            } else {
              if (res.data.fax === o) {
                this.peopleList.push(res.data);
                this.findfaxNumber.push(o);
              }
            }
            console.log("----", this.peopleList, this.findfaxNumber);
          });
        }
      });
      this.$emit("update:isAddPhonesShow", false);
    },

    // 获取传真分组
    getFaxGroupData() {
      let data = {
        displayDefault: true, //是否显示未分组联系人
      };
      // this.formData8.myLoading = true
      this.$api
        .faxGroupList(data)
        .then((res) => {
          // this.formData8.myLoading = false
          this.dialogVisible = true;
          // console.log(res);
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error",
            });
            return;
          }
          this.faxTreeData = res.data || [];
          this.dialogVisible = true;
          // console.log(this.faxTreeData);
        })
        .catch((err) => {
          // this["formData" + this.tabPosition] = false;
          // console.log(err);
        });
    },
    // 获取传真联系人分组
    getContactsInfo() {
      if (this.peopleList.length === 0) {
        this.$message({
          type: "info",
          message: "请选择联系人后再保存!",
        });
        return;
      }
      this.getFaxGroupData();
      // console.log(this.peopleList);
      this.contactsList = [];
      for (let item of this.peopleList) {
        let { id, fax } = item;
        let obj = {};
        obj.id = id;
        obj.number = fax;
        this.contactsList.push(obj);
      }
      // console.log(this.contactsList); // 获取右边短信下的联系人列表
    },
    handleFaxClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },

    //  覆盖 or 追加
    setType(type) {
      /*let data = {};
            data = {
              groupId: this.keys,
              contactorData: this.contactsList
            };*/
      this.saveContactsToGroup(type);
    },
    // 保存联系人为短信分组
    saveContactsToGroup(type) {
      // let keys = this.$refs.tree.getCheckedKeys()
      let keys = this.$refs.tree.getCurrentKey();
      this.$refs.tree.setCurrentKey();
      // console.log(keys);
      let data = {};
      if (!!keys) {
        // let id = keys.filter(key => { return key >= 0})[0]
        // console.log(id);
        data = {
          groupId: keys,
          contactorData: this.contactsList,
          type,
        };
        // console.log(data);
      } else {
        this.$message.warning("请选择传真分组");
      }
      this.$api.addContactsToGroup(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        this.dialogVisible = false;
        this.groupDialogVisible = false;
        // console.log(res);
        this.$message({
          message: "存为传真分组成功",
          type: "success",
        });
        this.$store.commit("getFaxContactsUpdate", true);
        // console.log(this.$store.state.isMsgContactsUpdate)
      });
    },

    //添加号码
    // getfaxData(data){
    //   let peopleList = this.peopleList
    //   let data1 = Object.assign({},data);
    //   if(this.findfaxNumber.indexOf(data1.fax)==-1){
    //     peopleList.push(data1)
    //     this.$store.commit('setFaxMember', peopleList)
    //     this.findfaxNumber.push(data1.fax)
    //   }else{
    //     this.$message.warning("你已添加当前传真电话");
    //   }
    // },
    //单个删除点击事件
    myDelete(index) {
      let peopleList = this.peopleList;
      peopleList.splice(index, 1);
      this.findfaxNumber.splice(index, 1);
      this.$store.commit("setFaxMember", peopleList);
      // this.findfaxNumber.splice(index,1);
    },
    //添加号码点击事件
    submitPhones() {
      this.$emit("update:isAddPhonesShow", true);
    },
    //清除点击事件
    clearNumber() {
      this.$store.commit("setFaxMember", []);
      // this.peopleList = [];
      this.findfaxNumber = [];
    } /* # endregion */, //获取未办结事件
    /* #region */ /* 传真信息选择框 */ getEventOptions() {
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
    //传真文件列表移除
    handleRemove(file, fileList) {
      this.faxForm.faxFileName = "";
      this.pdfPath = "";
      this.faxPath = "";
      this.previewPath = "";
      this.previewName = "";
      this.faxFileList = [];
    },
    //上传传真文件前调用的方法
    beforeUpload(file) {
      this.faxFileList.push(file);
      this.faxForm.faxFileName = file.name;
    },
    //上传文件成功后返回预览的文件名称
    onSuccess(response) {
      this.previewName = response.data;
    },
    //限制上传一个文件
    onExceed() {
      this.$message.warning("请点击清除按钮后重新选择文件上传!");
    },
    //传真回执文件列表移除
    receiptFileHandleRemove(file, fileList) {
      this.faxForm.receiptFileName = "";
      this.receiptFilepdfPath = "";
      this.previewPath = "";
      this.receiptFilepreviewName = "";
      this.receiptFileList = [];
    },
    //上传回执文件前调用的方法
    receiptFilebeforeUpload(file) {
      this.receiptFileList.push(file);
      this.faxForm.receiptFileName = file.name;
    },
    //上传文件成功后返回预览的文件名称
    receiptFileonSuccess(response) {
      this.receiptFilepreviewName = response.data;
    },
    //图片上传点击事件
    PictureUpload() {
      this.pictureVisible = true;
    },
    //扫描点击事件
    ScanUpload() {
      this.scanVisible = true;
    },
    /**
     * @lastEditor hexinting
     * @lastDate 2020-10-25
     * @description 发送点击事件
     */
    submitUpload() {
      if (this.faxFileList == "") {
        this.$message.warning("请选择需要发送的传真文件!");
        return;
      }
      // if (this.receiptFileList == '') {
      //   this.$message.warning("请选择需要发送的传真回执文件!");
      //   return;
      // }
      if (this.peopleList.length == 0) {
        this.$message.warning("请添加接收人号码!");
        return;
      } else {
        // 扬州项目需求：发送之前添加提醒 任务133
        if (this.IsYangZhouProject) {
          this.promptConfig.visible = true;
        } else {
          this.$confirm("确认发送?", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.sendFax();
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消发送",
              });
            });
        }
      }
    },
    clearFaxData() {
      (this.faxForm.caseId = ""), //事件关联
        (this.faxForm.caseTitle = ""), //事件关联标题
        (this.faxForm.faxTitle = ""), //传真标题
        (this.faxForm.sendingTime = ""), //发送时间(默认显示当前时间)
        (this.faxForm.faxFileName = ""), //传真文件地址
        (this.faxForm.receiptFileName = ""), //回执文件
        (this.faxForm.pictureFileName = []); //图片
      this.clearNumber();
      this.receiptFileList = []; // 回执列表
      this.faxFileList = []; // 传真列表
    },
    /**
     * @author hexinting
     * @lastDate 2020-10-25
     * @description 批量发送传真
     */
    sendFax() {
      let that = this;
      let phones = [];
      console.log("this.peopleList: ", this.peopleList);
      for (let i = 0; i < this.peopleList.length; i++) {
        phones.push(this.peopleList[i].fax.replace("-", ""));
      }
      // phones = this.findfaxNumber;
      let phoneArry = [...new Set(phones)];
      let contactorIds = [];
      for (let i = 0; i < this.peopleList.length; i++) {
        if (this.peopleList[i].id) {
          contactorIds.push(Number(this.peopleList[i].id));
        } else {
          contactorIds.push(0);
        }
      }
      let contactorIdsArray = [...new Set(contactorIds)];
      console.log(contactorIdsArray);
      if (this.faxForm.sendingTime == null || this.faxForm.sendingTime == "") {
        this.faxForm.sendingTime = new Date();
      }
      // let nowMonth = this.faxForm.sendingTime.getMonth() + 1;
      // let strDate = this.faxForm.sendingTime.getDate();
      // let seperator = "-";// 添加分隔符“-”
      // if (nowMonth >= 1 && nowMonth <= 9) {// 对月份进行处理，1-9月在前面添加一个“0”
      //   nowMonth = "0" + nowMonth;
      // }
      // if (strDate >= 0 && strDate <= 9) { // 对月份进行处理，1-9号在前面添加一个“0”
      //   strDate = "0" + strDate;
      // }
      // let faxTime = this.faxForm.sendingTime.getFullYear() + seperator + nowMonth + seperator + strDate;
      let datas = {
        faxSendTime: this.faxForm.sendingTime.toString(),
        faxCaseId: this.faxForm.caseId,
        faxName: this.faxForm.faxTitle,
      };
      let formData = new FormData();
      formData.append("pdfName", this.previewName);
      formData.append("data", JSON.stringify(datas));
      formData.append("file", this.receiptFileList[0]);
      formData.append("phoneNum", phoneArry.toString());
      formData.append("contactorId", contactorIdsArray.toString());
      console.log('formData: ', formData);
      if (this.msgHeadleState == "yes" || this.IsZengChengProject) {
        formData.append("type", this.$store.state.msgHeadleData.sendType);
        formData.append("typeId", this.$store.state.msgHeadleData.sendTypeId);
      }
      this.$api.sendFax(formData).then(async (res) => {
        if (res.errorcode == 0) {
          if (res.msg == "暂无数据") {
            this.$message({
              message: "传真发送失败",
              type: "warning",
            });
            return;
          }
          this.$message({
            message: "传真已加入发送队列，等待发送",
            type: "success",
          });
          // 传真发送成功后，清除表单数据
          this.clearFaxData();
          //优士康创建、上传传真方法
          if (this.HWICP_Version == "YouShiKang") {
            this.$faxFunction.EstablishFax(
              this.faxFileList.concat(this.receiptFileList),
              function (faxId) {
                that.$faxFunction.sendFax(
                  faxId,
                  phoneArry,
                  that.faxForm.caseId,
                  contactorIdsArray
                );
              }
            );
          }
          this.getFaxList();
          this.faxForm.sendingTime = "";
        } else {
          this.$message.error("发送失败");
        }
      });
      if (this.IsYangZhouProject) {
        // 扬州项目需求：发送之前添加提醒 任务133
        this.promptCanCel(); // 关闭提示弹窗
      }
    } /* # endregion */, //获取传真队列
    /* #region */ /* 传真队列 */
    getFaxList() {
      let data;
      this.$api.faxQueuelistAll(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        if (res.data) {
          // 按发送时间排序
          res.data.sort(
            (m, n) => +new Date(n.sendTime) - +new Date(m.sendTime)
          );
          this.faxListTableData = res.data;
        }
        this.getRemainTime();
      });
    },
    getRemainTime() {
      let TableData = JSON.parse(JSON.stringify(this.faxListTableData));
      if (TableData.length > 0) {
        for (let i in TableData) {
          let array = TableData[i].sendTime.split(" ");
          TableData[i].sendTimeAfter = array[1].substring(0,array[1].lastIndexOf(':'));
          let startDate = new Date(TableData[i].sendTime).getTime();
          let nowDate = new Date().getTime();
          if (nowDate < startDate) {
            let remainTime = startDate - nowDate;
            TableData[i].day = Math.floor(
              remainTime / 1000 / 60 / 60 / 24
            ).toString();
            TableData[i].hour = Math.floor(
              (remainTime / 1000 / 60 / 60) % 24
            ).toString();
            TableData[i].min = Math.floor(
              (remainTime / 1000 / 60) % 60
            ).toString();
            TableData[i].sec = Math.floor((remainTime / 1000) % 60).toString();
            if (TableData[i].hour < 10) {
              TableData[i].hour = "0" + TableData[i].hour;
            }
            if (TableData[i].min < 10) {
              TableData[i].min = "0" + TableData[i].min;
            }
            if (TableData[i].sec < 10) {
              TableData[i].sec = "0" + TableData[i].sec;
            }
            TableData[i].remainTime = "";
            if (
              TableData[i].day == "0" &&
              TableData[i].hour == "00" &&
              TableData[i].min == "00" &&
              TableData[i].sec != "00"
            ) {
              TableData[i].remainTime = "";
            } else if (
              TableData[i].day == "0" &&
              TableData[i].hour == "00" &&
              TableData[i].min != "00"
            ) {
              TableData[i].remainTime = TableData[i].min + ":";
            } else if (TableData[i].day == "0" && TableData[i].hour != "00") {
              TableData[i].remainTime =
                TableData[i].hour + ":" + TableData[i].min + ":";
            } else if (TableData[i].day != "0") {
              TableData[i].remainTime =
                TableData[i].day +
                "天" +
                TableData[i].hour +
                ":" +
                TableData[i].min +
                ":";
            }
            if (TableData[i].sec == "00") {
              TableData[i].remainTime = "";
              TableData[i].status = "正在发送";
            }
          }
        }
      }
      this.faxListTableData = TableData;
    },
    //查看传真详情
    detail(row) {
      this.faxDetail.time = setInterval(this.countDown, 1000);
      this.faxDetail.fileName = row.faxFile;
      this.faxDetail.status = row.status;
      this.faxDetail.path =
        `${Url}/eos/communication/pdf/preview?filename=` + row.faxFile;
      this.faxDetail.type = row.type;
      bus.$emit("getfaxQueue", row.faxFile);
      this.$store.commit("setFaxQueueDetail", row);
      this.faxdetailVisible = true;
    },
    //传真详情关闭
    faxdetailClose() {
      clearInterval(this.faxDetail.time);
      this.faxDetail.time = null;
      this.faxDetail.Timetext = "撤销";
      this.faxDetail.remainTime.day = "";
      this.faxDetail.remainTime.hour = "";
      this.faxDetail.remainTime.min = "";
      this.faxDetail.remainTime.sec = "";
      this.faxDetail.fileName = "";
      this.faxDetail.path = "";
      this.faxDetail.type = "";
      this.faxDetail.faxName = "";
      this.faxDetail.sendTime = "";
      this.faxDetail.faxList = [];
      this.faxDetail.failedFileList = [];
      this.faxDetail.successFileList = [];
      this.faxDetail.waitFileList = [];
      this.faxdetailVisible = false;
      this.getFaxList();
    },
    //撤销点击事件
    cancel(faxFile) {
      this.$confirm("是否撤销发送该传真?", "撤销发送", {
        confirmButtonText: "撤销",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let data = {
            fileName: faxFile,
          };
          this.$api.faxQueuedeleteAll(data).then((res) => {
            if (res.errorcode != 0) {
              this.$message({
                message: res.msg,
                type: "error",
              });
              return;
            }
            this.$message({
              message: "传真已撤销发送",
              type: "success",
            });
            this.faxdetailClose();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消撤销",
          });
        });
    },
    //点击切换页面
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    //撤销待发传真
    deleteFax(item) {
      this.$confirm("是否撤销发送该传真?", "撤销发送", {
        confirmButtonText: "撤销",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let data = {
            id: item.id,
          };
          this.$api.faxQueuedelete(data).then((res) => {
            if (res.errorcode != 0) {
              this.$message({
                message: res.msg,
                type: "error",
              });
              return;
            }
            this.$message({
              message: "传真已撤销发送",
              type: "success",
            });
            let data = {
              fileName: this.faxDetail.fileName,
            };
            this.$api.faxQueuefindByName(data).then((res) => {
              if (res.errorcode != 0) {
                this.$message({
                  message: res.msg,
                  type: "error",
                });
                return;
              }
              this.faxDetail.faxList = [];
              this.faxDetail.failedFileList = [];
              this.faxDetail.successFileList = [];
              this.faxDetail.waitFileList = [];
              this.faxDetail.faxList = res.data.faxList;
              if (this.faxDetail.faxList.length > 0) {
                for (let i in this.faxDetail.faxList) {
                  if (this.faxDetail.faxList[i].type == 1)
                    this.faxDetail.waitFileList.push(this.faxDetail.faxList[i]);
                  else if (this.faxDetail.faxList[i].type == 2)
                    this.faxDetail.failedFileList.push(
                      this.faxDetail.faxList[i]
                    );
                  else if (this.faxDetail.faxList[i].type == 3)
                    this.faxDetail.successFileList.push(
                      this.faxDetail.faxList[i]
                    );
                }
              }
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消撤销",
          });
        });
    },
    //重发
    reSendFax(item) {
      // console.log(item);
      let data = {
        id: item.id,
      };
      this.$api.faxReSendFax(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        this.$message({
          message: "重发成功！",
          type: "success",
        });
        let data = {
          fileName: this.faxDetail.fileName,
        };
        this.$api.faxQueuefindByName(data).then((res) => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error",
            });
            return;
          }
          this.faxDetail.faxList = [];
          this.faxDetail.failedFileList = [];
          this.faxDetail.successFileList = [];
          this.faxDetail.waitFileList = [];
          this.faxDetail.faxList = res.data.faxList;
          if (this.faxDetail.faxList.length > 0) {
            for (let i in this.faxDetail.faxList) {
              if (this.faxDetail.faxList[i].type == 1)
                this.faxDetail.waitFileList.push(this.faxDetail.faxList[i]);
              else if (this.faxDetail.faxList[i].type == 2)
                this.faxDetail.failedFileList.push(this.faxDetail.faxList[i]);
              else if (this.faxDetail.faxList[i].type == 3)
                this.faxDetail.successFileList.push(this.faxDetail.faxList[i]);
            }
          }
        });
      });
    },
    //定时器
    countDown() {
      let startDate = new Date(this.faxDetail.sendTime).getTime(); //结束时间
      let nowDate = new Date().getTime(); //当前实时时间
      if (nowDate > startDate) {
        let alreadyTime = Math.floor((nowDate - startDate) / 1000 / 60); //已经过了多少分钟
        // console.log('已经过了'+alreadyTime+'分钟')
      } else {
        let remainTime = startDate - nowDate;
        this.faxDetail.remainTime.day = Math.floor(
          remainTime / 1000 / 60 / 60 / 24
        ).toString();
        this.faxDetail.remainTime.hour = Math.floor(
          (remainTime / 1000 / 60 / 60) % 24
        ).toString();
        this.faxDetail.remainTime.min = Math.floor(
          (remainTime / 1000 / 60) % 60
        ).toString();
        this.faxDetail.remainTime.sec = Math.floor(
          (remainTime / 1000) % 60
        ).toString();
        if (this.faxDetail.remainTime.hour < 10) {
          this.faxDetail.remainTime.hour = "0" + this.faxDetail.remainTime.hour;
        }
        if (this.faxDetail.remainTime.min < 10) {
          this.faxDetail.remainTime.min = "0" + this.faxDetail.remainTime.min;
        }
        if (this.faxDetail.remainTime.sec < 10) {
          this.faxDetail.remainTime.sec = "0" + this.faxDetail.remainTime.sec;
        }
        // console.log(
        //   "距开始时间还有：" +
        //     this.faxDetail.remainTime.day +
        //     "天" +
        //     this.faxDetail.remainTime.hour +
        //     "小时" +
        //     this.faxDetail.remainTime.min +
        //     "分" +
        //     this.faxDetail.remainTime.sec +
        //     "秒"
        // );
        if (
          this.faxDetail.remainTime.day == "0" &&
          this.faxDetail.remainTime.hour == "00" &&
          this.faxDetail.remainTime.min == "00" &&
          this.faxDetail.remainTime.sec != "00"
        ) {
          this.faxDetail.Timetext =
            "撤销（" + this.faxDetail.remainTime.sec + "秒）";
        } else if (
          this.faxDetail.remainTime.day == "0" &&
          this.faxDetail.remainTime.hour == "00" &&
          this.faxDetail.remainTime.min != "00"
        ) {
          this.faxDetail.Timetext =
            "撤销（" +
            this.faxDetail.remainTime.min +
            "分" +
            this.faxDetail.remainTime.sec +
            "秒）";
        } else if (
          this.faxDetail.remainTime.day == "0" &&
          this.faxDetail.remainTime.hour != "00"
        ) {
          this.faxDetail.Timetext =
            "撤销（" +
            this.faxDetail.remainTime.hour +
            "时" +
            this.faxDetail.remainTime.min +
            "分" +
            this.faxDetail.remainTime.sec +
            "秒）";
        } else if (this.faxDetail.remainTime.day != "0") {
          this.faxDetail.Timetext =
            "撤销（" +
            this.faxDetail.remainTime.day +
            "天" +
            this.faxDetail.remainTime.hour +
            "时" +
            this.faxDetail.remainTime.min +
            "分" +
            this.faxDetail.remainTime.sec +
            "秒）";
        }
      }
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return "background:#F9FCFF;color:#333333;text-align:center;font-size:12px;padding:2px 0;";
      } else {
        return "";
      }
    },
    getCellStyle({ row, column, rowIndex, columnIndex }) {
      return "text-align:center;padding:4px 0;font-size:12px;";
    } /* #region */,
    /* # endregion */
    /* 传真预览 */ previewSubmit() {
      if (
        this.receiptFilepreviewName == "" ||
        this.receiptFilepreviewName == null ||
        this.receiptFilepreviewName == undefined
      ) {
        this.receiptFilepdfPath = "";
        this.previewPath = "";
      } else {
        this.receiptFilepdfPath =
          `${Url}/eos/communication/pdf/preview?filename=` +
          this.receiptFilepreviewName;
        this.previewPath = this.receiptFilepdfPath;
      }
      if (
        (this.previewName == "" ||
          this.previewName == null ||
          this.previewName == undefined) &&
        this.faxPath === ""
      ) {
        this.pdfPath = "";
        this.previewPath = "";
      } else if (this.faxPath) {
        //模板
        this.pdfPath =
          `${Url}/eos/communication/pdf/preview?filename=` + this.previewName;
        this.previewPath = this.faxPath;
      } else {
        //图片
        this.pdfPath =
          `${Url}/eos/communication/pdf/preview?filename=` + this.previewName;
        this.previewPath = this.pdfPath;
      }

      this.faxPreviewVisible = true;
    },
    loadPreview(path) {
      if (path) {
        this.previewPath = path + "&time=" + new Date();
      }
    } /* #region */,
    //上传图片前调用的方法
    /* # endregion */
    /* 图片上传 */
    picturebeforeUpload(file) {
      // console.log('file: ', file);
      // this.pictureList.push(file);
      // this.faxForm.pictureFileName.push(file.name);
    },
    //上传图片成功后返回预览的文件名称
    pictureonSuccess(response, file, fileList) {
      this.pictureList = fileList;
      if (response.errorcode == 0) {
        this.$message({
          message: "图片上传成功",
          type: "success",
        });
        this.picturePath =
          `${Url}/eos/communication/pdf/preview?filename=` + response.data;
      }
    },
    //图片列表移除
    pictureHandleRemove(file, fileList) {
      this.pictureList = fileList;
      // for (let i in this.faxForm.pictureFileName) {
      //   if (this.faxForm.pictureFileName[i] == file.name) {
      //     this.faxForm.pictureFileName.splice(i, 1);
      //   }
      // }
      // for (let i in this.pictureList) {
      //   if (this.pictureList[i].uid == file.uid) {
      //     this.pictureList.splice(i, 1);
      //   }
      // }
      // if (
      //   this.picturePath ==
      //   `${Url}/eos/communication/pdf/preview?filename=` + file.response.data
      // )
      //   this.picturePath = "";
    },
    //点击图片列表
    pictureHandlePreview(file) {
      this.picturePath =
        `${Url}/eos/communication/pdf/preview?filename=` + file.response.data;
    },
    //图片文件合成
    composeFile() {
      let pdfArray = [];
      for (let i in this.pictureList) {
        pdfArray.push(this.pictureList[i].response.data);
      }
      let data = {
        names: pdfArray,
        isDownload: false,
      };
      this.$api.faxmergePdf(data).then((res) => {
        if (res.errorcode == 0) {
          if (res.msg == "暂无数据") {
            this.$message({
              message: "图片合并失败",
              type: "warning",
            });
            return;
          }
          this.faxPath = "";
          this.faxFileList = [];
          let objFile = new File(
            ["First Line Text", "Second Line Text"],
            "上传图片"
          );
          this.faxFileList.push(objFile);
          // console.log(this.faxFileList);
          let data = res.data; // 重新赋值data 不对返回数据进行处理与操作
          objFile.url = `${Url}/eos/communication/pdf/preview?filename=${data}`;
          this.previewName = data;
          this.faxForm.faxFileName = "上传图片";
          this.pictureList = [];
          this.picturePath = "";
          this.pictureVisible = false;
        }
      });
    } /* #region */,
    /* # endregion */
    /* 扫描文件 */ getScan() {
      this.$icp19.FaxScan();
    },
    //扫描导入
    scanImport() {
      this.ScanList.push({
        name: "扫描文件",
        url: this.scanFilePath,
      });
      this.scanPath = this.scanFilePath;
      this.$store.commit("setfaxScanStatus", 0);
      this.$store.commit("setscanFilePath", "");
    },
    //删除扫描件
    scanClose() {
      this.$store.commit("setfaxScanStatus", 0);
      this.$store.commit("setscanFilePath", "");
    },
    //扫描列表删除
    ScanHandleRemove(file, fileList) {
      for (let i in this.ScanList) {
        if (this.ScanList[i].uid == file.uid) {
          this.ScanList.splice(i, 1);
        }
      }
    },
    //点击扫描列表
    ScanHandlePreview(file) {
      this.scanPath = file.url;
    },
    //扫描合成
    composeScan() {
      let pdfArray = [];
      for (let i in this.ScanList) {
        pdfArray.push(this.ScanList[i].url);
      }
      let data = {
        names: pdfArray,
        isDownload: true,
      };
      this.$api.faxmergePdf(data).then((res) => {
        if (res.errorcode == 0) {
          if (res.msg == "暂无数据") {
            this.$message({
              message: "扫描文件合并失败",
              type: "warning",
            });

            return;
          }
          this.ScanList = [];
          let objFile = new File(
            ["First Line Text", "Second Line Text"],
            "扫描文件"
          );
          objFile.url =
            `${Url}/eos/communication/pdf/preview?filename=` + res.data;
          this.faxFileList.push(objFile);
          this.previewName = res.data;
          this.faxForm.faxFileName = "扫描文件";
          // console.log(this.faxFileList);
          this.ScanList = [];
          this.scanPath = "";
          this.scanVisible = false;
        }
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
      this.faxForm.caseTitle = obj.title;
      this.faxForm.caseId = obj.id;
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
.my-phone-right-main {
    overflow: auto;
    height: calc(100vh - 200px);
    background-color: white;
}
/* 传真发送单位框 */ /* #region */
.my-phone-right-main-user {
    background: #fff;
    font-size: 12px;
    color: #666666;
    position: relative;
    border-radius: 0 0 3px 3px;
}
.my-fax-picture {
    background-image: url('../../../../../assets/icpImg/num6.png');
    background-repeat: no-repeat;
    background-position-y: 25px;
    width: 112px;
    max-height: calc(100% - 800px);
    height: 180px;
    padding: 0 10px;
    margin: 0 auto;
    color: #cad5e8;
    text-align: center;
    line-height: 290px;
}
.my-fax-list-box {
    padding: 0 10px;
    height: 180px;
    overflow: auto;
}
.el-tag {
    margin-left: 10px;
    margin-top: 11px;
    color: #555555;
    height: 22px;
    line-height: 15px;
    padding: 2px 4px 3px 4px;
}
.el-tag .el-icon-close {
    right: 0px;
}
.my-fax-list {
    display: flex;
    height: 30px;
    color: #858585;
    align-items: center;
}
.my-fax-head {
    padding: 10px;
    display: flex;
    justify-content: center;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
}
.my-fax-head-left {
    font-size: 12px;
    line-height: 20px;
    flex: 1;
}
.my-fax-head-left span {
    font-weight: bold;
    color: #333;
    margin: 0 5px;
}
.my-fax-head-right {
    color: #0091ff;
    display: flex;
    justify-content: center;
    align-items: center;
}
.my-fax-head-right span {
    cursor: pointer;
}
.my-fax-head-right-line {
    margin: 0 10px;
    height: 14px;
    width: 1px;
    background: #d8d8d8;
}
/* # endregion */
/* 传真信息选择框 */ /* #region */
.sendFaxBox {
    margin: 10px 0;
    background-color: #ffffff;
    border-radius: 3px;
}
.fax-information {
    padding: 10px 10px 0 20px;
    height: 250px;
}
.fax-action {
    padding: 10px 10px 10px 10px;
    background-color: #f9fcff;
}
.el-form-item {
    margin-bottom: 5px;
}
.faxTemplateAddForm .el-form-item {
    margin-bottom: 25px;
}
.faxTitle-input >>> .el-input__inner {
    height: 30px;
}
.faxTitle-input >>> .el-input__icon {
    line-height: 30px;
}
.btn-upload {
    height: 32px;
    padding: 5px;
    font-size: 12px;
}
.icon-upload {
    background-image: url(/@/assets/icpImg/upload.png);
    background-repeat: no-repeat;
    width: 14px;
    height: 14px;
    margin: 0 5px;
}
.el-upload__tip {
    color: #999999;
    margin-left: 10px;
}
.icon-PictureUpload {
    background-image: url(/@/assets/icpImg/PictureUpload2.png);
    background-repeat: no-repeat;
    width: 25px;
    height: 25px;
}
.icon-PictureUpload3 {
    background-image: url(/@/assets/icpImg/PictureUpload3.png);
    background-repeat: no-repeat;
    background-position: center;
    background-position-y: 1px;
    width: 90px;
    height: 60px;
    position: absolute;
    top: 11%;
    margin: 0 25px;
    line-height: 100px;
    font-size: 12px;
    color: #333333;
}
.icon-PictureUpload:hover {
    background-image: url(/@/assets/icpImg/PictureUpload1.png);
    cursor: pointer;
}
.icon-scan:hover {
    background-image: url(/@/assets/icpImg/scan1.png);
    cursor: pointer;
}
.icon-preview {
    background-image: url(/@/assets/icpImg/preview2.png);
    background-repeat: no-repeat;
    width: 25px;
    height: 25px;
}
.icon-preview:hover {
    background-image: url(/@/assets/icpImg/preview1.png);
    cursor: pointer;
}
/* # endregion */
/* 传真队列 */ /* #region */
.MessageBox-iconClass {
    background-image: url(/@/assets/icpImg/bell.png);
    background-repeat: no-repeat;
    height: 54px;
    width: 54px;
}
.sendFaxList {
    height: 260px;
    margin: 10px 0 0;
    background-color: #ffffff;
    overflow: auto;
    border-radius: 3px;
}
.sendFaxList-headtext {
    color: #333333;
    font-size: 14px;
    margin: 10px;
    display: flex;
    font-weight: bold;
}
.sendFaxList-headline {
    background: #0091ff;
    margin: 3px 10px;
    height: 14px;
    width: 2px;
}
.faxListTable >>> .el-button + .el-button {
    margin-left: 0px;
}
.faxListTable >>> .el-button--mini,
.el-button--mini.is-round {
    padding: 4px 15px;
}
.faxdetail-line {
    float: left;
    background: #f2f2f2;
    height: 700px;
    width: 2px;
    display: flex;
}
.faxdetailright {
    float: right;
    width: 498px;
    height: 680px;
    margin: 10px 0;
}
.faxDetailInform {
    font-size: 12px;
    color: #666666;
    font-weight: bold;
    display: flex;
    margin: 0 20px;
}
.tabsTitle >>> .el-tabs__nav {
    width: 100%;
    background-color: #f7f8fa;
}
.tabsTitle >>> .el-tabs__item {
    width: 33.3%;
    color: #999999;
    font-size: 12px;
}
.tabsTitle >>> .el-tabs__item.is-active {
    width: 33.3%;
    color: #555555;
    font-size: 12px;
    font-weight: bold;
}
.tabsTitle >>> #tab-first {
    margin-left: 30px;
}
.tabsTitle >>> .el-tabs__content {
    max-height: 500px;
    overflow-y: auto;
}
.sendList {
    color: #333333;
    font-size: 12px;
    font-weight: bold;
    background-color: #f7f8fa;
    line-height: 34px;
    height: 46px;
    width: 420px;
    margin: 10px auto;
    padding: 0 20px;
}
/* # endregion */
/* 传真预览 */ /* #region */
.dialog-header {
    margin: -20px;
    background-color: #f1f4f6;
    padding: 10px 20px;
    font-size: 14px;
    color: #333333;
    text-align: left;
    border-radius: 5px;
}
.dialog-footer {
    /*border-top:2px solid #F2F2F2FF;*/
    margin: -20px;
    padding: 10px 15px;
}
.dialog-style >>> .el-dialog__body {
    padding: 0px;
    margin-top: 10px;
    border-radius: 5px;
}
.leftShow {
    float: left;
    width: 140px;
    height: 700px;
}
.rightShow {
    width: 800px;
    height: 610px;
    margin: 20px 20px 40px;
    box-shadow: 0px 4px 10px 0px #999999;
}
.faxFileShow {
    cursor: pointer;
    width: 90%;
    height: 325px;
    padding: 10px;
    background-color: #f1f1f1;
}
.faxFileShow:hover,
.faxFileShow:active {
    width: 87%;
    height: 321px;
    padding: 10px;
    background-color: #f1f1f1;
    border: #0091ff solid 2px;
}
.filetitle {
    margin: 5px;
    text-align: center;
    color: #333333;
    font-size: 12px;
}
.filecontent1 {
    margin: 10px;
    height: 90%;
    pointer-events: none;
}
.filecontent2 {
    margin: 10px;
    height: 90%;
    float: right;
    width: 74%;
}
.icon-smile {
    background-image: url(/@/assets/icpImg/smile.png);
    background-repeat: no-repeat;
    width: 140px;
    height: 25px;
    color: #666666;
    font-size: 12px;
    margin: 0 auto;
    text-align: center;
    position: relative;
    top: 40%;
    line-height: 25px;
}
/* # endregion */
/* 图片上传 */ /* #region */
.pictureShow1 {
    width: 100%;
    height: 150px;
    background-color: #f1f1f1;
    border: #999999 dashed 1px;
}
.pictureShow2 {
    margin-top: 10px;
    padding: 0px 13px;
    width: 81%;
    height: 535px;
    background-color: #f1f1f1;
    border: #999999 dashed 1px;
}
.upload-picture >>> .el-upload-list {
    margin: 143px 0 10px;
    overflow: auto;
    padding: 0 10px;
    height: 525px;
}
.upload-picture >>> .el-upload-list--picture .el-upload-list__item {
    height: 110px;
}
.upload-picture >>> .el-upload-list--picture .el-upload-list__item-thumbnail {
    margin-left: -67px;
}
.upload-picture
    >>> .el-upload-list--picture
    .el-upload-list__item.is-success
    .el-upload-list__item-name {
    line-height: 30px;
    margin-top: 0;
    float: left;
    margin-left: -85px;
    width: 100px;
}
/* # endregion */
/* 传真扫描 */ /* #region */
.icon-scan {
    background-image: url(/@/assets/icpImg/scan2.png);
    background-repeat: no-repeat;
    width: 25px;
    height: 25px;
}
.icon-scan3 {
    cursor: pointer;
    background-image: url(/@/assets/icpImg/scan3.png);
    background-repeat: no-repeat;
    background-position: center;
    background-position-y: 1px;
    width: 86px;
    height: 60px;
    position: absolute;
    top: 11%;
    margin: 0 27px;
    line-height: 100px;
    font-size: 12px;
    color: #333333;
}
.icon-scanloading {
    background-image: url(/@/assets/icpImg/loading.png);
    background-repeat: no-repeat;
    background-position: center;
    background-position-y: 1px;
    width: 50px;
    height: 60px;
    position: absolute;
    top: 11%;
    margin: 0 45px;
    line-height: 100px;
    font-size: 12px;
    color: #333333;
}
.icon-rescan {
    background-image: url(/@/assets/icpImg/scanFail.png);
    background-repeat: no-repeat;
    background-position: center;
    background-position-y: 1px;
    width: 70px;
    height: 16px;
    position: absolute;
    top: 6%;
    margin: 0 30px;
    line-height: 100px;
    font-size: 12px;
    color: #0091ff;
}
.icon-scanimport {
    background-image: url(/@/assets/icpImg/scanSuccess.png);
    background-repeat: no-repeat;
    background-position: center;
    background-position-y: 1px;
    width: 80px;
    height: 16px;
    position: absolute;
    top: 6%;
    margin: 0 30px;
    line-height: 100px;
    font-size: 12px;
    color: #0091ff;
}
.scanFileShow {
    margin-left: -20px;
    margin-top: 20px;
    width: 120px;
    height: 107px;
}
.icon-close {
    background-image: url(/@/assets/icpImg/close.png);
    background-repeat: no-repeat;
    width: 16px;
    height: 16px;
    cursor: pointer;
    margin-left: 111px;
    margin-top: -160px;
    z-index: 99999;
    position: absolute;
}
.upload-scan >>> .el-upload-list {
    margin: 0 0 10px;
    overflow: auto;
    padding: 0 10px;
    height: 500px;
}
.upload-scan >>> .el-upload-list--picture .el-upload-list__item {
    height: 110px;
}
.upload-scan >>> .el-upload-list--picture .el-upload-list__item-thumbnail {
    margin-left: -75px;
}
.upload-scan
    >>> .el-upload-list--picture
    .el-upload-list__item.is-success
    .el-upload-list__item-name {
    line-height: 30px;
    margin-top: 70px;
    float: left;
    margin-left: -85px;
    width: 100px;
}
.faxTemplateDialog >>> .el-dialog__body {
    padding: 8px 20px;
}
.faxTemplateDialog >>> .el-scrollbar__wrap {
    overflow: scroll;
    width: 110%;
    height: 100%;
}
.elDialog {
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    z-index: 9;
    height: 100%;
    width: 100%;
}
/* # endregion */
</style>
<style lang="scss" scoped>
// 存为分组弹窗
/deep/ .dialogVisible {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 15px 2px rgba(0, 0, 0, 0.27);
    border-radius: 5px;
    .el-dialog__header {
        background: rgba(241, 244, 246, 1);
        border-radius: 5px 5px 0px 0px;
        text-align: left;
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        .el-dialog__title {
            font-size: 13px;
            color: #333;
        }
        .el-dialog__headerbtn {
            top: 14px;
        }
    }
    .el-dialog__footer {
        padding: 15px 0px 20px;
        border-top: 1px solid #e9ecf1;
        text-align: right;
    }
}
// 存为分组确认弹窗
/deep/ .groupDialog {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 15px 2px rgba(0, 0, 0, 0.27);
    border-radius: 5px;
    .el-dialog__header {
        background: rgba(241, 244, 246, 1);
        border-radius: 5px 5px 0px 0px;
        text-align: left;
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        .el-dialog__title {
            font-size: 13px;
            color: #333;
        }
        .el-dialog__headerbtn {
            top: 14px;
        }
    }
    .el-dialog__body {
        padding: 30px 71.5px;
        text-align: center;
        display: flex;
        align-items: center;
    }
    .el-dialog__footer {
        padding: 15px 0px 20px;
        border-top: 1px solid #e9ecf1;
        text-align: right;
    }
}
/deep/ .el-scrollbar__view {
    height: 150px;
}
</style>
