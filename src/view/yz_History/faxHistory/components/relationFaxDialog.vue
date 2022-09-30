<template>
  <div class="sms-tree relationFaxDialog">
    <el-row>
      <el-col :span="14" style="border-right: 1px solid #E9EBF0;">
        <el-row>
          <el-col :span="24">
            <nav-bar style="background-color: #F9FBFF;" :barDisabled="treeLoading" ref="navBar" :selectedName="selectedName" :navBarList="navBarList" class="narBar"
                     @changTab="changTab" ></nav-bar>
          </el-col>
        </el-row>
        <el-col :span="10" style="padding-right: 0px;">
          <div style="padding: 20px 36px 10px; color: #666666;font-size:14px;border-bottom: 1px solid #E9EBF0">
            <template v-for="(item,i) in contactList">
              <div :class="{'shortcut_box':true,'mgb8':i===0}">
                <!-- 注释原因：动态配置大分组名字 author：hexinting date:2020-11-05 -->
                <!-- <span :class="contactName === item.name? 'shortcut_active' : ''" @click="shortcutClick(item.name)"> -->
                <span :class="contactCode === item.code? 'shortcut_active' : ''" @click="shortcutClick(item)">
                  <i :class="item.icon" class="mgr8" />{{item.name}}
                </span>
              </div>
            </template>
          </div>
          <div style="padding:10px; height: 615px;" class="common_input">
            <el-input placeholder="输入关键字搜索" v-model="treeRelationFaxDialogConfig.filterText" class="mgb8">
              <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <el-scrollbar style="height: 92%;" v-loading="treeLoading"
                          element-loading-text="加载中..."
                          element-loading-spinner="el-icon-loading"
                          element-loading-background="rgba(255, 255, 255, 0.8)">
              <myTree ref="myFaxTree" :treeData="treeRelationFaxDialogData" :defaultProps="treeRelationFaxDialogProps" :treeConfig="treeRelationFaxDialogConfig" @nodeClick="nodeClick"></myTree>
            </el-scrollbar>
          </div>
        </el-col>
        <el-col :span="14" style="border-left: 1px solid #E9EBF0;">
          <div style="text-align: center;padding-top: 10px" class="common_input">
            <!-- 注释原因：动态配置大分组名字 author：hexinting date:2020-11-05 -->
            <!-- <el-input style="width: 60%;" :disabled="contactName === '最近联系人'" placeholder="输入关键字搜索" @keyup.enter.native="handleSearch" v-model="searchData.searchText" class="mgb8"> -->
            <el-input style="width: 60%;" :disabled="contactCode === 'recentcontact'" placeholder="输入关键字搜索" @keyup.enter.native="handleSearch" v-model="searchData.searchText" class="mgb8">
              <i slot="suffix" style="cursor: pointer" class="el-input__icon el-icon-search" @click="handleSearch"></i>
            </el-input>
          </div>
          <!-- 注释原因：动态配置大分组名字 author：hexinting date:2020-11-05 -->
          <!-- <div class="my_table" :style="contactName === '最近联系人'?{'min-height': '658px'}:{'min-height': '615px'}"> -->
          <div class="my_table" :style="contactCode === 'recentcontact'?{'min-height': '658px'}:{'min-height': '615px'}">
            <myTable ref="faxTable" :tableColumn="tableColumn" :tableData="tableData" :tableConfig="tableConfig" @rowClick="rowClick" @selectallrow="selectFaxAll" @selectrow="selectionFaxRow(arguments)"></myTable>
          </div>
          <!-- 注释原因：动态配置大分组名字 author：hexinting date:2020-11-05 -->
          <!-- <div class="center_pagination" style="background: #fff;text-align: right; padding: 6px 0;" v-show="contactName !== '最近联系人'"> -->
          <div class="center_pagination" style="background: #fff;text-align: right; padding: 6px 0;" v-show="contactCode !== 'recentcontact'">
            <myPagination :pageConfig="pageConfig" :layout="layout" @sizeChange="sizeChange" @currentChange="currentChange"></myPagination>
          </div>
        </el-col>
      </el-col>

      <el-col :span="10" style="padding:10px">
        <div class="mgb10" style="height: 150px; padding: 10px 10px 35px; box-sizing: border-box; border-radius:4px;border:1px solid #ddd;position: relative;">
          <div style="height: 100%">
            <el-scrollbar style="height: 100%;">
              <el-tag
                style="margin:0 10px 10px 0"
                v-for="tag in tags"
                :key="tag.id"
                effect="plain"
                @close="handleTagClose(tag)"
                closable>
                {{tag.fax || tag.name || tag.contactor || tag.call || tag.number}}
              </el-tag>
            </el-scrollbar>
          </div>
          <div class="addressee_box">
            <span>收信人</span>
            <div>{{tags.length}}</div>
          </div>
          <div class="operate_box">
            <span @click="handleEmpty">清空</span>
            <span @click="isAddPhonesShow = true">添加号码</span>
            <span @click="getFaxGroupData">保存分组</span>
          </div>
        </div>
        <!-- 传真信息选择框 -->
        <div class="mgb10">
          <el-form class="faxForm" ref="faxForm" v-model="faxForm" label-width="95px" >
            <div class="sendFaxBox">
              <el-form-item label="传真标题">
                <el-input placeholder="标题" v-model="faxForm.name"></el-input>
              </el-form-item>
              <el-form-item label="传真文件" class="fax_upload_box">
                <div style="position: relative;">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    accept=".pdf,.jpg,.jpeg,.png,.ppt,.pptx,.doc,.docx,.txt,.xlsx,.xls"
                    :action="action"
                    :headers="{Authorization: $window.localStorage.getItem('token') ? $window.localStorage.getItem('token') : ''}"
                    with-credentials
                    :file-list="faxTemplateFileList"
                    :before-upload="beforeFaxTamplateUpload"
                    :on-remove="onRemove"
                    :on-success="onSuccess">
                    <el-button class="btn-upload"><i class="el-icon-upload2 mgr8" />上传文件</el-button>
                  </el-upload>
                  <el-button class="template_btn mgl8" @click="handleFaxTemplate"><i class="el-icon-upload2 mgr8" />选择模板</el-button>
                </div>
              </el-form-item>
              <el-form-item label="传真回执" class="fax_upload_box">
                <el-upload
                  class="upload-demo"
                  ref="upload"
                  accept=".pdf,.jpg,.jpeg,.png,.ppt,.pptx,.doc,.docx,.txt,.xlsx,.xls"
                  :action="action"
                  :headers="{Authorization: $window.localStorage.getItem('token') ? $window.localStorage.getItem('token') : ''}"
                  with-credentials
                  :file-list="receiptFileList"
                  :on-remove="receiptFileHandleRemove"
                  :before-upload="receiptFilebeforeUpload"
                  :on-success="receiptFileonSuccess">
                  <el-button class="btn-upload" slot="trigger" plain><i class="el-icon-upload2 mgr8" />上传文件</el-button>
                  <span slot="tip" class="el-upload__tip mgl8">支持扩展名：.doc .pdf .jpg...</span>
                </el-upload>
              </el-form-item>
              <el-form-item label="关联事件" >
                <el-select v-model="faxForm.caseId" placeholder="请选择" class="faxTitle-input" style="width:100%">
                  <el-option
                    v-for="item in faxAllCaseId"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>

            <div class="fax-action">
              <el-row type="flex" align="middle">
                <el-col :span="2">
                  <el-tooltip content="预览" placement="top">
                    <div class="icon-preview" @click="previewSubmit"></div>
                  </el-tooltip>
                </el-col>
                <el-col :span="2">
                  <el-tooltip content="扫描" placement="top">
                    <div class="icon-scan" @click="scanVisible = true"></div>
                  </el-tooltip>
                </el-col>
                <el-col :span="2">
                  <el-tooltip content="图片上传" placement="top">
                    <div class="icon-PictureUpload" @click="pictureVisible = true"></div>
                  </el-tooltip>
                </el-col>

                <el-col :span="9" :offset="6">
                  <el-date-picker
                    :picker-options="pickerOptionsStart"
                    class="faxTitle-input"
                    v-model="sendTime"
                    type="datetime"
                    placeholder="选择日期时间"
                    style="width:195px"
                    value-format="yyyy-MM-dd HH:mm:ss">
                  </el-date-picker>
                </el-col>
                <el-col :span="2">
                  <el-button type="primary" size="mini" @click="submitUpload">发送</el-button>
                </el-col>
              </el-row>
            </div>
          </el-form>
        </div>
        <!-- 传真队列 -->
        <div class="my_table">
          <myTable :tableColumn="tableFaxQueueColumn" :tableData="tableFaxQueueData" :tableConfig="tableFaxQueueConfig">
            <template slot="type" slot-scope="data">
              <div>{{data.slotData.type}}</div>
              <div>{{data.slotData.sendTimeAfter}}</div>
            </template>
            <template slot="successfulNum" slot-scope="data">
              <div style="color:#0BD295;">{{data.slotData.successfulNum}}</div>
            </template>
            <template slot="failedNum" slot-scope="data">
              <div style="color:#F66E6E;">{{data.slotData.failedNum}}</div>
            </template>
            <template slot="waitNum" slot-scope="data">
              <div style="color:#F2B626;">{{data.slotData.waitNum}}</div>
            </template>
            <template slot="status" slot-scope="data">
              <div>{{data.slotData.status}}</div>
              <template v-if="data.slotData.status !== '正在发送' && data.slotData.status !== '发送完毕'">
                <div v-html="data.slotData.sendTime"></div>
              </template>
            </template>
            <template slot="operate" slot-scope="data">
              <el-link class="mgr4" type="primary" :underline="false" @click="detail(data.slotData)">查看</el-link>
              <el-link type="primary" :underline="false" @click="cancel(data.slotData.faxFile)" :disabled="data.slotData.status === '发送完毕'">撤销</el-link>
            </template>
          </myTable>
        </div>
      </el-col>
    </el-row>

    <!--添加号码对话框-->
    <el-dialog :visible.sync="isAddPhonesShow" title="添加号码" width="30%" :close-on-click-modal="false" append-to-body>
      <el-input type="textarea" resize="none" :autosize="{minRows:4,maxRows:4}" v-model="phonesText"
                placeholder="请输入号码，多个号码使用“，”隔开"></el-input>
      <div slot="footer"  class="dialog-footer">
        <el-button @click="submitClose">取 消</el-button>
        <el-button type="primary" @click="submitPhones">确 定</el-button>
      </div>
    </el-dialog>

    <!--存为分组-->
    <el-dialog
      class="storGroupDialog"
      :visible.sync="storGroupVisible"
      append-to-body
      :close-on-click-modal="false"
      title="存为传真分组"
      width="30%">
      <div style="height: 230px">
        <el-scrollbar style="height: 100%">
          <myTree
            ref="myFaxTree"
            :treeData="treeStorGroupData"
            :defaultProps="treeRelationFaxDialogProps"
            :treeConfig="treeRelationFaxDialogConfig"
            @nodeClick="nodeStorGroupClick"></myTree>
        </el-scrollbar>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="storGroupVisible = false">取 消</el-button>
        <el-button type="primary" @click="enterGroup">确 定</el-button>
      </span>
      <!-- 存为分组确认 -->
      <el-dialog
        title="提示"
        append-to-body
        :visible.sync="groupDialogVisible"
        width="450px"
        class="groupDialog"
        :close-on-click-modal="false"
      >
        <div style="display: flex;justify-content: center;align-items: center;">
          <img src="/static/img/ConvergedCommunication/bell.png" alt style="margin-right:10px; text-align: center;" />
          <span style="color:#555">请选择存为分组的保存模式</span>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="setType('overwrite')" size="medium">覆 盖</el-button>
          <el-button type="primary" @click="setType('append')" size="medium" style="margin-right:20px;">追 加</el-button>
        </span>
      </el-dialog>
    </el-dialog>

    <!--传真模板弹窗-->
    <el-dialog :visible.sync="faxTemplateVisible"
      append-to-body
      title="选择模板"
      class="faxTemplateDialog"
      :close-on-click-modal="false"
      width="1200px"
      top="5vh"
      @closed="faxTamplateClosed">
      <el-row>
        <el-col :span="4" style="height:648px">
          <el-scrollbar style="height:100%">
            <div v-if="treeFaxTemplateList.length === 0" style="text-align: center;color: #666">
              暂无模板数据
            </div>
            <myTree :treeData="treeFaxTemplateList" :defaultProps="treeSelectFaxTamplateProps" :treeConfig="treeSelectFaxTamplateConfig" @nodeClick="handleFaxTemplateTree"></myTree>
          </el-scrollbar>
        </el-col>
        <el-col :span="20">
          <div>
            <editor-bar
              :heightEditor="heightEditor"
              :noneDisplay="noneDisplay"
              ref="editorBar"
              v-model="editor.info"
              :isClear="isClear"></editor-bar>
            <div style="padding: 10px">
              <div style="font-size:14px;color: #333;margin-bottom: 10px;text-align: left"><i class="el-icon-s-order" />剪切板信息</div>
              <el-input
                style="font-size: 14px"
                type="textarea"
                :rows="4"
                placeholder="请输入内容"
                v-model="shearVal">
              </el-input>
            </div>
          </div>
        </el-col>
      </el-row>
      <div style="text-align: right; margin-top: 8px">
        <el-button style="padding: 10px 25px" @click="faxTemplateVisible = false">取 消</el-button>
        <el-button style="padding: 10px 25px" type="primary" @click="faxTemplateEnter">确 认</el-button>
      </div>
    </el-dialog>

    <!-- 传真预览对话框 -->
    <el-dialog :visible.sync="faxPreviewVisible"
               append-to-body
               title="传真预览"
               :close-on-click-modal="false"
               width="1000px"
               top="2vh"
               @closed="faxPreviewClosed">
      <div style="height:700px;">
        <!-- 左缩略 -->
        <div class="leftShow">
          <!-- 传真文件 -->
          <div class="faxFileShow" @click="loadPreview(faxPreviewUrl)">
            <div v-if="faxPreviewUrl" class="filetitle">传真文件</div>
            <div v-if="faxPreviewUrl" class="filecontent1">
              <div style="position: absolute; top: 0;left: 0;width: 100%;height: 100%;cursor: pointer" onclick="loadPreview(faxPreviewUrl)" ></div>
              <iframe :src="faxPreviewUrl" width="100%" height="90%" frameborder="0" scrolling="no"></iframe>
            </div>
            <div v-else class="filecontent1"><div class="icon-smile">暂无传真文件</div></div>
          </div>
          <!-- 回执文件 -->
          <div class="faxFileShow" style="margin-top:10px;" @click="loadPreview(receiptFileUrl)">
            <div v-if="receiptFileUrl" class="filetitle">传真回执</div>
            <div  v-if="receiptFileUrl" class="filecontent1" @click="loadPreview(receiptFileUrl)">
              <div style="position: absolute; top: 0;left: 0;width: 100%;height: 100%;cursor: pointer" onclick="loadPreview(faxPreviewUrl)" ></div>
              <iframe :src="receiptFileUrl"  width="100%" height="100%" frameborder="0" scrolling="no"></iframe>
            </div>
            <div v-else class="filecontent1"><div class="icon-smile">暂无传真回执</div></div>
          </div>
        </div>
        <!-- 右放大 -->
        <div class="rightShow" style="float:right;">
          <iframe :src="previewPath" id="iframe" width="100%" height="100%" frameborder="0" scrolling="no"></iframe>
        </div>
      </div>
    </el-dialog>

    <!-- 图片上传对话框 -->
    <el-dialog :visible.sync="pictureVisible"
               append-to-body
               title="图片上传"
               :close-on-click-modal="false"
               width="1000px"
               top="2vh"
               @closed="pictureClosed">
      <div style="height: 730px">
        <!-- 左缩略 -->
        <div class="leftShow">
          <!-- 上传 -->
          <div class="pictureShow1"  >
            <el-upload class="upload-picture"
                       ref="upload"
                       accept=".jpg,.jpeg,.png"
                       :action="action"
                       :headers="{Authorization: $window.localStorage.getItem('token') ? $window.localStorage.getItem('token') : ''}"
                       multiple
                       auto-upload
                       list-type="picture"
                       with-credentials
                       :file-list="pictureList"
                       :show-file-list="true"
                       :on-remove="pictureHandleRemove"
                       :before-upload="picturebeforeUpload"
                       :on-success="pictureonSuccess">
              <div slot="trigger" style="width: 100%;height: 100%;padding-top: 20%">
                <img src="../../../../assets/icpImg/PictureUpload3.png" />
                <div class="icon-PictureUpload3">获取系统图片</div>
              </div>
            </el-upload>
          </div>
          <div class="pictureShow2">
            <div v-if="picturePostNumber==0"  class="icon-smile">暂无上传图片</div>
          </div>
        </div>
        <!-- 右放大 -->
        <div v-if="picturePostNumber>0" class="rightShow" style="float:right;">
          <iframe :src="picturePath" id="iframe" width="100%" height="100%" frameborder="0" scrolling="no"></iframe>
        </div>
        <div v-else class="filecontent2"><div class="icon-smile">暂无图片</div></div>
        <el-button v-if="picturePostNumber>0" type="primary" size="mini" @click="composeFile" style="float:right;margin:20px 20px 0 0;">完成</el-button>
      </div>
    </el-dialog>

    <!-- 传真扫描对话框 -->
    <el-dialog :visible.sync="scanVisible"
               append-to-body
               width="1000px"
               title="传真扫描"
               class="dialog-style"
               :close-on-click-modal="false"
               top="2vh">
      <div style="height:700px;">
        <div class="leftShow">
          <div class="pictureShow1"  >
            <div v-if="faxScanStatus==0" class="icon-scan3" @click="getScan">点击获取扫描件</div>
            <div v-else-if="faxScanStatus==1" class="icon-scanloading">正在扫描</div>
            <div v-else-if="faxScanStatus==2" class="icon-scanimport">
              <div class="scanFileShow">
                <iframe :src="scanFilePath"  width="100%" height="100%" frameborder="0" scrolling="no"></iframe>
                <div v-if="scanFilePath!=''"  class="icon-close" @click="scanClose"></div>
              </div>
              <div style="cursor: pointer;margin-top:-40px;margin-left: 15px;height: 20px;" @click="scanImport">确认导入</div>
            </div>
            <div v-else-if="faxScanStatus==3" class="icon-rescan"><div style="cursor: pointer;margin-top:15px;margin-left: 15px;" @click="getScan">重新扫描</div></div>
          </div>
          <div class="pictureShow2">
            <div v-if="ScanList.length>0">
              <el-upload class="upload-scan"
                         ref="upload"
                         accept=".jpg,.jpeg,.png"
                         :action="action"
                         :headers="{Authorization: $window.localStorage.getItem('token') ? $window.localStorage.getItem('token') : ''}"
                         multiple
                         auto-upload
                         list-type="picture"
                         with-credentials
                         :file-list="ScanList"
                         :on-remove="ScanHandleRemove"
                         :on-preview="ScanHandlePreview"
                         :show-file-list="true">
                <div slot="trigger" ></div>
              </el-upload>
            </div>
            <div v-else class="icon-smile">暂无扫描件</div>
          </div>
        </div>
        <div v-if="ScanList.length>0" class="rightShow" style="float:right;">
          <iframe :src="scanPath" id="iframe" width="100%" height="100%" frameborder="0" scrolling="no"></iframe>
        </div>
        <div v-else class="filecontent2"><div class="icon-smile">暂无扫描件</div></div>
        <el-button v-if="ScanList.length>0" type="primary" size="mini" @click="composeScan" style="float:right;margin:-20px 20px 0 0;">完成</el-button>
      </div>
    </el-dialog>

    <!-- 传真详情对话框 -->
    <el-dialog :visible.sync="faxdetailVisible"
               append-to-body
               width="1350px"
               center
               class="dialog-style-new"
               :close-on-click-modal="false"
               top="2vh"
               @close="faxdetailClose()">
      <div slot="title"
           class="dialog-header" v-text="'传真详情'"></div>
      <div style="height:700px;">
        <div class="rightShow" style="float:left;width:800px;">
          <iframe :src="faxDetail.path"  width="100%" height="100%" frameborder="0" scrolling="no"></iframe>
        </div>
        <div class="faxdetail-line"></div>
        <div class="faxdetailright" >
          <div class="sendFaxList-headtext">
            <span class="sendFaxList-headline"></span>
            <span >传真标题：{{faxDetail.faxName}}</span>
          </div>
          <div class="faxDetailInform">
            <span>发送方式:{{faxDetail.type}}</span>
            <el-divider direction="vertical"></el-divider>
            <span style="margin-top:-4px;">文件共<span style="font-size:16px;">{{faxDetail.faxList.length}}</span>份</span>
            <div v-if="faxDetail.waitFileList.length>0" style="float:right;margin:-20px 0 0 80px">
              <el-button v-if="faxDetail.status !== '发送完毕'" type="primary" size="medium" v-text="'撤销'" @click="cancel(faxDetail.fileName)"></el-button>
            </div>
          </div>
          <div style="margin-top:10px;height:400px;">
            <el-tabs v-model="tabsActiveName" class="tabsTitle">
              <el-tab-pane :label="'发送队列（'+faxDetail.waitFileList.length+'）'" name="first">
                <div class="sendList" v-for="(item,index) in faxDetail.waitFileList" :key="index" >
                  收件单位：{{item.workUnit || item.number}}
                  <span style="color:#ADB6C2;float:right;font-weight: bold;cursor: pointer;margin: -12px -20px;font-size:14px;" @click="deleteFax(item)">×</span>
                  <span style="color:#555555;float:right;font-weight: normal;">{{faxDetail.status === '待发送'? faxDetail.status : `${faxDetail.status}第${item.currentPage}页`}}</span>
                </div>
              </el-tab-pane>
              <el-tab-pane :label="'发送成功（'+faxDetail.successFileList.length+'）'" name="second">
                <div class="sendList" v-for="(item,index) in faxDetail.successFileList" :key="index" >
                  收件单位：{{item.workUnit || item.number}}
                  <span style="color:#555555;float:right;font-weight: normal;">{{item.sendTime}}</span>
                </div>
              </el-tab-pane>
              <el-tab-pane :label="'发送失败（'+faxDetail.failedFileList.length+'）'" name="third">
                <div class="sendList" v-for="(item,index) in faxDetail.failedFileList" :key="index" >
                  收件单位：{{item.workUnit || item.number}}
                  <span style="float:right;"><el-button type="text" size="mini" @click="reSendFax(item)">重发</el-button></span>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>

        </div>
      </div>
    </el-dialog>

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
  import navBar from "../../components/navBar"
  import myTree from "../../components/myTree"
  import myTable from "../../components/myTable"
  import myPagination from '../../components/myPagination'

  import EditorBar from '@/view/yz_eventManagement/informationDisposal/editorChint'
  import promptDialogBox from "@/yz_components/promptDialogBox/promptDialogBox";
  import {replaceContactorGroupsConfig, filterGroupName} from '@/assets/js/yz_common.js'
  export default {
    name: "relationFaxDialog",
    components:{
      navBar,
      myTree,
      myTable,
      myPagination,
      EditorBar,
      promptDialogBox
    },
    props: {
      // 单条信息记录
      contactData: {
        type: Object,
        default: null
      },
      faxName:{
        type: String,
        default: ""
      },
      // 关联事件所有事件
      faxAllCaseId: {
        type: Array,
        default: null
      }
    },
    data(){
      return{
        IsYangZhouProject: window.g.IsYangZhouProject, // 扬州项目
        // selectedName: window.g.IsYangZhouProject ? "政务通信录" : "政务联络网",//默认选中导航条
        selectedName: "政务联络网",//默认选中导航条
        selectedCode: "phone", //默认选中导航条 分组code
        // navBarList: window.g.IsYangZhouProject ? [
        //   {
        //     name: "政务通信录"
        //   },{
        //     name: "应急通信录"
        //   },
        //   // {
        //   //   name: "基层联络网"
        //   // },{
        //   //   name: "备勤联络网"
        //   // },{
        //   //   name: "资源联络网"
        //   // },
        //   {
        //     name: "传真分组"
        //   },
        // ] : [
        //   {
        //     name: "政务联络网"
        //   },{
        //     name: "应急联动网"
        //   },{
        //     name: "基层联络网"
        //   },{
        //     name: "备勤联络网"
        //   },{
        //     name: "资源联络网"
        //   },{
        //     name: "传真分组"
        //   },
        // ],
        navBarList: [
          {
            name: "政务联络网",
            code: "phone",
            enabled: true
          },{
            name: "应急联动网",
            code: "linkage",
            enabled: true
          },{
            name: "基层联络网",
            code: "gliaison",
            enabled: true
          },{
            name: "备勤联络网",
            code: "dutyGroup",
            enabled: true
          },{
            name: "资源联络网",
            code: "resource",
            enabled: true
          },{
            name: "传真分组",
            code: "faxgroup",
            enabled: true
          }
        ],
        contactName: '',
        contactCode: '', // commonlyused(常用联系人) / recentcontact(最近联系人)
        contactList: [
          // {i:0, name:'常用联系人', icon: 'el-icon-star-off', code: 'commonlyused'},
          {i:1, name:'最近联系人', icon: 'el-icon-time', code: 'recentcontact'}
        ],

        // 标签
        tags: [],

        //传真文件表单
        faxForm:{...this.contactData},
        sendTime: '',
        pickerOptionsStart: {
          disabledDate(time) {
            return (
              time.getTime() < new Date(new Date().toLocaleDateString()).getTime()
            );
          }
        },

        // 表格筛选数据
        searchData:{
          id:'',
          isTop: '',
          groupId: '',  //树节点ID
          searchText: '',   //搜索内容
          type: "fax",
          page: 1,
          size: 10
        },
        // 树数据配置
        treeRelationFaxDialogData: [],
        treeRelationFaxDialogProps: {
          children: 'children',
          label: 'name'
        },
        treeLoading: false,
        treeRelationFaxDialogConfig: {
          filterText: '', //筛选内容
          checkbox: false,
          loading: false,
        },

        // 中间表格配置数据
        tableColumn: [
          {label:'姓名',prop:'contactor',width:90},
          {label:'职位',prop:'position',width:130},
          {label:'单位',prop:'workUnit'},
        ],
        tableData:[],
        tableConfig: {
          height: '620px',
          loading: false,
          selection: true,
        },

        // 传真队列表格配置数据
        tableFaxQueueColumn: [
          {label:'发送方式',prop:'type',slot:true,center:'center',width:80},
          {label:'总数',prop:'totalNum',width:52,center:'center'},
          {label:'成功',prop:'successfulNum',slot:true,width:52,center:'center'},
          {label:'失败',prop:'failedNum',slot:true,width:52,center:'center'},
          {label:'待发',prop:'waitNum',slot:true,width:52,center:'center'},
          {label:'状态',prop:'status',slot:true},
          {label:'操作',prop:'operate',slot:true,center:'center',width:100},
        ],
        tableFaxQueueData:[],
        tableFaxQueueConfig: {
          height: '260px',
          loading: false,
          selection: false,
          index: true,
        },
        faxQueuelistdata: [],

        // 分页器配置
        pageConfig:{
          total: 0,
          currentPage: 1,
          totalPages: 1,
          small: true,
          background: false
        },
        layout: 'prev, pager, next, sizes, jumper',

        // 添加号码
        isAddPhonesShow: false,
        phonesText: '',//电话号码输入框

        // 存为分组
        sendGroupData: {
          groupId: '',
          contactorData: [],
          type: 'append'
        },
        storGroupVisible: false,
        groupDialogVisible: false,
        treeStorGroupData: [],


        // 上传模板文件和传真回执
        faxTemplateFileList: [],  //name和url
        receiptFileList: [],
        receiptFile: {},
        faxPreviewUrl: '',    //传真文件路径
        receiptFileUrl: '',   //传真回执路径

        // 上传文件
        action: window.g.ApiUrl + '/eos/communication/fax/convertPDF',  //上传地址

        //上传多张图片
        pictureVisible: false,  //弹窗
        pictureList: [],
        picturePath: '',
        picturePostNumber: 0,   //多张图片上传个数

        // 传真预览
        faxPreviewVisible: false,
        previewPath: '',

        // 发送传真详情
        faxdetailVisible: false,
        tabsActiveName:'first',
        faxDetail:{
          status: '', //传真发送状态
          fileName:'',//传真文件名
          path:'',//预览地址
          type:'',//发送方式
          faxName:'',//标题
          sendTime:'',//发送时间
          time:null,//倒计时
          Timetext:'撤销',//倒计时显示
          remainTime:{
            day:'',
            hour:'',
            min:'',
            sec:''
          },
          faxList:[],//传真队列
          failedFileList:[],//失败
          successFileList:[],//失败
          waitFileList:[],//失败
        },

        // 扫描
        scanVisible: false,
        ScanList:[],//扫描文件列表
        scanPath:'',// 扫描预览路径

        // 传真模板弹窗
        faxTemplateVisible: false,  // 传真模板弹窗
        treeFaxTemplateList: [],  //传真模板数据
        treeSelectFaxTamplateProps: {
          children: 'children',
          label: 'name'
        },
        treeSelectFaxTamplateConfig: {
          checkbox: false,
          loading: false,
        },
        // 富文本
        heightEditor:{
          height:'480px'
        },
        noneDisplay:{
          display:'flex'
        },
        isClear: false,
        editor: {
          info: ''
        },
        shearVal: '',   //剪切板内容
        fileListTime:null,
        promptConfig: { // 提示弹窗的配置
          visible: false, // 是否显示弹窗
          promptType: 'warn', // 弹窗类型：delete:删除提示弹窗,warn：警告提示弹窗,success：成功提示弹窗,error：错误提示弹窗,info：常规类信息提示弹窗,default：不包含icon提示弹窗
          promptTitle: '敏感信息发送提醒', // 弹窗标题
          promptText: '即将通过非密网络发送信息，请勿发送泄密信息', // 弹窗文本
          cancelButtonText: '取消发送', // 取消操作按钮文本
          confirmButtonText: '立即发送', // 确认操作按钮文本
          isNeedIcon: true  // 是否需要显示左边的图标
        },
        IsYangZhouProject: window.g.IsYangZhouProject // 扬州项目
      }
    },
    computed:{
      scanFilePath(){//扫描文件路径
        return this.$store.getters.getscanFilePath;
      },
      faxScanStatus(){//0：非作业中，1：扫描中2：成功，3：失败，
        return this.$store.getters.getfaxScanStatus;
      },
      faxSendCount(){//0：非作业中，1：扫描中2：成功，3：失败，
        return this.$store.state.faxSendCount;
      }
    },
    watch: {
      scanFilePath(val){
      },
      faxScanStatus(val){
      },
      faxSendCount(){
        this.getFaxQueuelistAll()
      }
    },
    created(){
      // 融合通讯大分组设为可配置状态，扬州定制的分组先注释 date:2020-11-05 author:hexinting
      // if (this.IsYangZhouProject) {
      //   this.getPhoneGroupingTree('政务通信录')
      // } else {
      //   this.getPhoneGroupingTree('政务联络网')
      // }
      this.getPhoneGroupingTree('phone')
      this.fillForm()
      this.getFaxQueuelistAll()
    },
    mounted() {
      // 3.0不要这个方法了
      // this.initContactorGroupsConfig(); // 初始化分组配置
    },
    beforeDestroy: function() {
      clearInterval(this.fileListTime);
    },
    methods: {
      /**
       * @author hexinting
       * @date 2020-11-05
       * @lastEditor hexinting
       * @lastDate 2020-11-05
       * @description 初始化分组配置
       */
      initContactorGroupsConfig() {
        let contactorGroups = JSON.parse(sessionStorage.getItem("contactorGroups")); // 后端返回的分组配置列表
        this.navBarList = replaceContactorGroupsConfig(this.navBarList); // 根据后端返回分组，替换联系人大分组名字配置
        // 导航栏
        let filterGroup = this.navBarList.filter(item => item && item.code === "phone");
        if (filterGroup.length === 0) { // 如果没有配置政务联络网
          this.selectedName = this.navBarList[0].name; // 默认选中第一个
          this.selectedCode = this.navBarList[0].code; // 默认选中第一个
        } else {
          this.selectedName = filterGroup[0].name;
          this.selectedCode = filterGroup[0].code;
        }
        // 常用联系人、最近联系人
        this.contactList.forEach(item => {
          if (item) {
            let _index = contactorGroups.findIndex(el => el.code === item.code); // 根据code查找大分组名字
            if (_index !== -1) { // 存在
                item.name = contactorGroups[_index].name // 替换名字
            }
          }
        })
      },
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
      // 根据传值填充表单
      fillForm(){
        if(this.contactData.newKey){
          this.tags.push(this.contactData)
        }
        if (this.contactData.newIframeUrl){
          this.faxTemplateFileList.push({name:'上传文件',url:this.contactData.newIframeUrl})
          this.pdfName = this.contactData.fileName
        }
      },
      /**
       * @lastAuthor hexinting
       * @lastDate 2020-11-05
       * @description 获取树数据
       */
      getPhoneGroupingTree(msg) {
        // 发送请求前显示loading加载中...
        this.treeLoading = true
        // if (msg === '政务联络网' || msg === '政务通信录'){// 注释原因：动态配置大分组名字 不通过写死分组名字来判断 author：hexinting date:2020-10-10
        if (msg === 'phone'){
          this.$api.phoneGroupList({displayDefault: true}).then(res => {
            if (!res.data){
              this.treeRelationFaxDialogData = []
              return
            }
            res.data.forEach((e,i) => {
              if (e.id === -1) {
                res.data[i].disabled = true
              }
            })
            this.treeRelationFaxDialogData = res.data
            this.treeLoading = false
          })
        // } else if (msg === '应急联动网' || msg === '应急通信录') {
        } else if (msg === 'linkage') {
          this.$api.getBriefsByClassId({id:0}).then(res =>{
            if (!res.data){
              this.treeRelationFaxDialogData = []
              return
            }
            let arrayId = res.data
            let resData = []
            let statusIdx = 0
            arrayId.forEach(e => {
              statusIdx++
              this.$api.getStructTree({id:e.id}).then(res => {
                if (!res.data){
                  return
                }
                statusIdx--
                if (res.data.length > 0){
                  resData = [...resData,...res.data]
                }
                if (statusIdx === 0){
                  this.treeRelationFaxDialogData = [...resData]
                  this.treeLoading = false
                }
              })
            })
          })
        // } else if (msg === '基层联络网') {
        } else if (msg === 'gliaison') {
          this.$api.gliaisonGroupList({displayDefault: true}).then(res => {
            if (!res.data){
              this.treeRelationFaxDialogData = []
              return
            }
            res.data.forEach((e,i) => {
              if (e.id === -1) {
                res.data[i].disabled = true
              }
            })
            this.treeRelationFaxDialogData = res.data
            this.treeLoading = false
          })
        // } else if (msg === '备勤联络网') {
        } else if (msg === 'dutyGroup') {
          this.$api.dutyGroupList({displayDefault: true}).then(res => {
            if (!res.data){
              this.treeRelationFaxDialogData = []
              return
            }
            res.data.forEach((e,i) => {
              if (e.id === -1) {
                res.data[i].disabled = true
              }
            })
            this.treeRelationFaxDialogData = res.data
            this.treeLoading = false
          })
        // } else if (msg === '资源联络网') {
        } else if (msg === 'resource') {
          this.$api.resourceGroupList({displayDefault: true}).then(res => {
            if (!res.data){
              this.treeRelationFaxDialogData = []
              return
            }
            res.data.forEach((e,i) => {
              if (e.id === -1) {
                res.data[i].disabled = true
              }
            })
            this.treeRelationFaxDialogData = res.data
            this.treeLoading = false
          })
        // } else if (msg === '传真分组') {
        } else if (msg === 'faxgroup') {
          this.$api.faxGroupList({displayDefault: true}).then(res => {
            if (!res.data){
              this.treeRelationFaxDialogData = []
              return
            }
            res.data.forEach((e,i) => {
              if (e.id === -1) {
                res.data[i].disabled = true
              }
            })
            this.treeRelationFaxDialogData = res.data
            this.treeLoading = false
          })
        }
      },
      /**
       * @param {String} tabName tab名字
       * @lastAuthor hexinting
       * @lastDate 2020-11-05
       * @description tabs切换
       */
      changTab(tabName) {
        // 初始化数据
        this.searchData.groupId = ''
        this.searchData.id = ''
        this.searchData.searchText = '' //树筛选数据
        this.searchData.page = 1
        // 判断防止多次点击同一tabs发送同一请求
        if (this.selectedName != tabName){
          let groupCode = filterGroupName(tabName); // 过滤分组名字,查找code
          this.getPhoneGroupingTree(groupCode)  //发送请求更新树节点
          // this.getPhoneGroupingTree(tabName)  //发送请求更新树节点
          this.selectedName = tabName;
          this.selectedCode = groupCode; // 选中分组的code
          console.log('selectedCode', this.selectedCode);

          // 需要初始化的数据
          this.initRightData()
          this.treeRelationFaxDialogConfig.filterText =  '' //树筛选数据
        }
      },
      /**
       * @param {Object} item 激活tab
       * @lastAuthor hexinting
       * @lastDate 2020-11-05
       * @description 常用联系人/最近联系人切换
       */
      shortcutClick(item){
        // 判断防止多次点击发送同一请求
        if(this.contactName != item.name){
          this.contactName = item.name // 分组名字
          this.contactCode = item.code // 分组code
          // this.getContactList(name) // 注释原因：动态配置大分组名字 author：hexinting date:2020-10-12
          this.getContactList(item.code) // 根据code获取常用联系人/最近联系人

          // 需要初始化的数据
          this.tableData = []   //清空表格数据
          this.searchData.groupId = ''
          this.searchData.id = ''
          this.searchData.searchText = '' //树筛选数据
          this.searchData.page = 1
          this.treeRelationFaxDialogConfig.filterText =  '' //筛选内容
        }
      },
      /**
       * @param {String} code 分组code
       * @lastAuthor hexinting
       * @lastDate 2020-11-05
       * @description 获取常用联系人/最近联系人
       */
      getContactList(code){
        this.tableConfig.loading = true
        //   if (name === '常用联系人'){ // 注释原因： 动态配置联系人大分组
        if (code === 'commonlyused'){
          this.tableColumn[0].prop = 'name'
          this.$api.commonContactorList(this.searchData).then(res => {
            if (!res.data.data){
              this.treeRelationFaxDialogData = []
              return
            }
            this.tableData = res.data.data
            this.pageConfig.total = res.data.totalElements
            this.pageConfig.totalPages = res.data.totalPages
            this.tableConfig.loading = false
          }).catch(err =>{
            this.tableConfig.loading = false
          })
        //   } else if(name === '最近联系人'){ // 注释原因： 动态配置联系人大分组
        } else if(code === 'recentcontact'){
          this.tableColumn[0].prop = 'name'
          this.$api.getRecentContactorList().then(res => {
            if (!res.data.data){
              this.treeRelationFaxDialogData = []
              return
            }
            this.tableData = res.data.data
            this.pageConfig.total = res.data.totalElements
            this.pageConfig.totalPages = res.data.totalPages
            this.tableConfig.loading = false
          }).catch(err =>{
            this.tableConfig.loading = false
          })
        }
      },
      // 树节点点击时
      nodeClick(nodeData,node){
        // 判断防止多次点击发送同一请求
        if (this.searchData.groupId !== nodeData.id){
          if (node.parent.parent === null){
            this.searchData.isTop = true
          }else {
            this.searchData.isTop = false
          }
          this.searchData.groupId = nodeData.id
          this.searchData.id = nodeData.id
          this.getTableOfTreeData()
          // 需要初始化的数据
          this.initRightData()
        }
      },
      // 筛选表格数据
      handleSearch(){
        this.searchData.groupId = ''
        this.searchData.page = 1
        this.pageConfig.currentPage = 1
        this.getTableOfTreeData()
      },
      /**
       * @lastAuthor hexinting
       * @lastDate 2020-11-05
       * @description 获取表格数据
       */
      getTableOfTreeData(){
        this.tableConfig.loading = true
        this.tableColumn[0].prop = 'name'
        if(this.selectedCode === 'linkage'){
        // if(this.selectedName === '应急联动网' || this.selectedName === '应急通信录'){
          this.$api.emergencyAddressBook(this.searchData).then(res => {
            if (!res.data.data){
              this.treeRelationFaxDialogData = []
              return
            }
            this.tableData = res.data.data
            this.pageConfig.total = res.data.totalElements
            this.pageConfig.totalPages = res.data.totalPages
            this.tableConfig.loading = false
          }).catch(err =>{
            this.tableConfig.loading = false
          })
        }else {
          this.$api.contactorList(this.searchData).then(res =>{
            if (!res.data.data){
              this.treeRelationFaxDialogData = []
              return
            }
            this.tableData = res.data.list
            this.pageConfig.total = res.data.totalCount
            this.pageConfig.totalPages = res.data.totalPage
            this.tableConfig.loading = false
          }).catch(err =>{
            this.tableConfig.loading = false
          })
        }
      },
      // fax表格点击全选
      selectFaxAll(rows){
        if (rows.length === 0){
          return
        }
        // 勾选最近联系人不用去请求接口 auth:hexinting
        let inNumberArr = this.disposeFaxNumber(rows)[1] // 处理不存在传真号码并拿到存在的传真号码[1]的数组
        this.existFaxNumber(inNumberArr)
        // if (this.contactName === '最近联系人') {
        //   this.filtrateContacts(rows)
        // }else {
        //   let inNumberArr = this.disposeFaxNumber(rows)[1] // 处理不存在传真号码并拿到存在的传真号码[1]的数组
        //   this.existFaxNumber(inNumberArr)
        // }
      },
      /**
       * @param {Array} data [rows, row] rows:表格勾选行 row:当前选中行当前选中或取消选中的一行
       * @lastAuthor hexinting
       * @lastDate 2021-01-28
       * @description fax表格点击单选
       */
      selectionFaxRow(data){
        var rows = data[0]
        if (rows.length === 0){
          return
        }
        // 勾选最近联系人不用去请求接口 auth:hexinting
        let inNumberArr = this.disposeFaxNumber(rows)[1] // 处理不存在传真号码并拿到存在的传真号码[1]的数组
        this.existFaxNumber(inNumberArr)
        // if (this.contactName === '最近联系人') {
        //   this.filtrateContacts(rows)
        // }else {
        //   let inNumberArr = this.disposeFaxNumber(rows)[1] // 处理不存在传真号码并拿到存在的传真号码[1]的数组
        //   this.existFaxNumber(inNumberArr)
        // }
      },
      // 处理不存在传真号码情况并返回不存在的传真号码[0]和存在的传真号码[1]的数组
      disposeFaxNumber(rows){
        // 拿到存在的传真号码
        let inNumberArr = []
        // 处理不存在传真号码
        let notNumberArr = []
        let notNumberNameArr = []
        rows.forEach((rowE,rowI) =>{
          if (rowE.fax){
            inNumberArr.push(rowE)
          }else {
            notNumberArr.push(rowE)
            if (rowE.name || rowE.name === ''){
              notNumberNameArr.push(rowE.name)
            } else {
              notNumberNameArr.push(rowE.contactor)
            }
          }
        })
        if (notNumberNameArr.length > 0){
          let notNumberString = notNumberNameArr.join()
          this.$message({
            type:'info',
            message:`(${notNumberString})不存在传真号码`
          })
          this.$refs.faxTable.toggleRowSelection(notNumberArr)
        }
        return [notNumberArr,inNumberArr]
      },
      // 处理存在传真号码
      existFaxNumber(inNumberArr){
        inNumberArr.forEach((rowE,rowI) =>{
          let exist = this.tags.some(e => e.id === rowE.id)
          if(!exist){
            this.tags = [...this.tags,rowE]
          }
        })
        console.log(this.tags);
      },
      // 最近联系人筛选
      filtrateContacts(rows){
        let contactIds = []
        let notContactIds = []
        let inContacts = []   //存在联系人
        let notContacts = []  //不存在联系人
        rows.forEach(e => {
          if (e.contactorId>0){
            contactIds.push(e.contactorId)
          }else {
            notContactIds.push(e.contactorId)
          }
        })
        if (contactIds.length > 0){
          let parmas = {
            ids:contactIds
          }
          this.$api.findAllContactors(parmas).then(res =>{
            if (res.data){
              notContacts = res.data.notExistIds  //不存在联系人的id
              // 存在联系人的id
              res.data.contactors.forEach(e =>{
                if (e.fax !==''){
                  inContacts.push(e)  //存在fax
                } else {
                  notContacts.push(e.id)  //不存在fax
                }
              })
              this.$refs.faxTable.toggleRowSelection(notContacts,'最近联系人')
              if (notContacts.length > 0){
                this.$message({
                  type:'info',
                  message:`不能发送传真给不存在传真号码的联系人!`
                })
              }
              this.existFaxNumber(inContacts)
            }
          })
        }
        if(notContactIds.length > 0){
          this.$refs.faxTable.toggleRowSelection(notContactIds,'最近联系人')
          this.$message({
            type:'info',
            message:`联系人不存在!`
          })
        }
      },
      // 选择项发生变化时会触发该事件
      selectionChange(rows){

      },
      //清空联系人
      handleEmpty(){
        this.tags = []
        this.$refs.faxTable.toggleRowSelection()
      },
      // 删除单个联系人
      handleTagClose(tag) {
        this.tags.splice(this.tags.indexOf(tag), 1);
        this.$refs.faxTable.toggleRowSelection([tag])
      },
      // 点击表格当行数据
      rowClick(row){

      },
      /**
       * @param {Number} val 页条数
       * @lastAuthor hexinting
       * @lastDate 2020-11-05
       * @description 10条/页改变
       */
      sizeChange(val){
        this.searchData.size = val
        // if (this.contactName === '常用联系人' || this.contactName === '最近联系人') { // 注释原因：动态配置大分组名字 author：hexinting date:2020-10-12
        if (this.contactCode === 'commonlyused' || this.contactCode === 'recentcontact') {
          this.getContactList(this.contactName)
        }else {
          this.getTableOfTreeData()
        }
      },
      /**
       * @param {Number} val 页条数
       * @lastAuthor hexinting
       * @lastDate 2020-11-05
       * @description 页码改变
       */
      currentChange(val){
        this.searchData.page = val
        // if (this.contactName === '常用联系人' || this.contactName === '最近联系人') {// 注释原因：动态配置大分组名字 author：hexinting date:2020-10-12
        if (this.contactCode === 'commonlyused' || this.contactCode === 'recentcontact') {
          this.getContactList(this.contactName)
        }else {
          this.getTableOfTreeData()
        }
      },
      // 初始化数据
      initRightData(){
        this.tableData = []   //清空表格数据
        this.searchData.searchText = '' //筛选内容
        this.searchData.page = 1
        this.contactName = ''       //不选中常用联系人/最近联系人
        this.pageConfig.total = 0
        this.pageConfig.currentPage = 1
        this.pageConfig.totalPages = 1
      },

      // 添加号码取消
      submitClose(){
        this.phonesText ='';
        this.isAddPhonesShow = false;
      },
      // 添加号码确认
      submitPhones(){
        if(this.phonesText.length==0){
          this.$message.warning('输入不能为空');
        }else {
          let data = this.phonesText.split(',')||[];
          data = [...new Set(data)];
          let numberCorrect = [];
          let numberError = [];
          let numberRepetition = []
          data.forEach(e =>{
            if(/^(\d{3,4}-)?\d{7,8}$/.test(e)){
              numberCorrect.push(e)
            }else{
              numberError.push(e)
            }
          })
          // 传真号码不符合
          if (numberError.length > 0) {
            let numberErrorS = numberError.join()
            this.$message.warning(`您输入的(${numberErrorS})传真号码不符合!`);
          }

          numberCorrect.forEach(numE =>{
            let someNumber = this.tags.some(tagE =>{ return numE === tagE.number || numE === tagE.call})
            if (someNumber){
              numberRepetition.push(numE)
            }else {
              this.tags.push({
                id: 0,
                name:numE,
                fax:numE,
              })
            }
          })
          // 传真号码已重复
          if (numberRepetition.length > 0){
            let numberRepetitionS = numberRepetition.join()
            setTimeout(() =>{
              this.$message.warning(`您输入的(${numberRepetitionS})传真号码已重复!`);
            },500)
          }

          this.isAddPhonesShow = false;
          this.phonesText = ''
        }
      },

      // 获取传真分组
      getFaxGroupData() {
        if (this.tags.length === 0){
          this.$message({
            message: '请选择联系人',
            type: "error"
          });
          return
        }
        let data = {
          displayDefault: true
        }
        this.$api.faxGroupList(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          this.storGroupVisible = true
          this.treeStorGroupData = res.data || [];
        })
      },
      // 点击存为分组树节点
      nodeStorGroupClick(nodeData,node){
        this.sendGroupData.groupId = nodeData.id
      },
      //确认分组
      enterGroup(){
        if (!this.sendGroupData.groupId){
          this.$message({
            type:'info',
            message: '请选择分组!'
          })
          return
        }
        this.groupDialogVisible = true
      },
      // 点击存为联系人分组
      setType(type){
        this.tags.forEach(e => {
          let conData = {
            id: e.id,
            number: e.fax
          }
          this.sendGroupData.contactorData.push(conData)
        })
        this.sendGroupData.type = type
        this.$api.addContactsToGroup(this.sendGroupData).then(res =>{
          this.$message({
            type:'success',
            message: '存为传真分组成功!'
          })
          this.sendGroupData.contactorData = []
          this.sendGroupData.groupId = ''
          this.groupDialogVisible = false
        })
      },

      // 传真弹窗
      // 点击传真模板按钮
      handleFaxTemplate(){
        this.treeSelectFaxTamplateConfig.loading = true
        this.faxTemplateVisible = true;   // 弹窗
        //获取传真模板数据
        this.$api.getFaxTemplateTree().then(res => {
          this.treeSelectFaxTamplateConfig.loading = false
          if (!res.data){
            this.treeFaxTemplateList = []
            return
          }
          this.treeFaxTemplateList = res.data
        }).catch(err =>{
          this.treeSelectFaxTamplateConfig.loading = false
        })
      },

      // 点击传真模板树节点
      handleFaxTemplateTree(data) {
        // 显示传真模板
        this.$refs.editorBar.editor.txt.html(data.content)
      },

      // 传真模板弹窗关闭回调
      faxTamplateClosed(){
        this.$refs.editorBar.editor.txt.html('')
      },
      // 确认传真模板
      faxTemplateEnter(){
        let parmas = {
          html:this.$refs.editorBar.editor.txt.html()
        }
        this.$api.convertHtmlPDF(parmas).then(res => {
          if (this.faxTemplateFileList.length > 0){
            this.$message.warning("只能上传一份传真文件!原先上传的传真文件已被覆盖");
          }
          this.pdfName = res.data
          this.faxTemplateFileList = []
          this.faxTemplateFileList.push({name:'上传模板',url:`${window.g.ApiUrl}/${res.data}`})
          this.faxTemplateVisible = false
        })
      },
      // 传真文件上传之前
      beforeFaxTamplateUpload(file) {

      },
      // 传真文件上传成功
      onSuccess(response, file, fileList){
        this.faxTemplateFileList = []
        this.pdfName = response.data
        if (this.faxTemplateFileList.length > 0){
          this.$message.warning("只能上传一份传真文件!原先上传的传真文件已被覆盖");
        }
        this.faxTemplateFileList.push({name:'上传文件',url:`${window.g.ApiUrl}/${response.data}`})
      },
      // 回执文件上传之前
      receiptFilebeforeUpload(file){
        this.receiptFile = file
      },
      // 回执文件上传成功
      receiptFileonSuccess(response){
        this.receiptFileList = []
        if (this.receiptFileList.length > 0){
          this.$message.warning("只能上传一份传真文件!原先上传的传真文件已被覆盖");
        }
        this.receiptFileList.push({name:'上传回执',url:`${window.g.ApiUrl}/${response.data}`})
      },
      // 多张图片上传之前
      picturebeforeUpload(file){
        //this.pictureList.push(file)
      },
      // 多张图片上传成功回调
      pictureonSuccess(response, file, fileList){
        this.picturePostNumber++
        if(this.picturePostNumber === fileList.length){
          this.mergeImgOfPdf(fileList)
        }
      },
      //合并多张图片为一个pdf
      mergeImgOfPdf(fileList){
        let pdfArray=[]
        for(let i in fileList){
          pdfArray.push(fileList[i].response.data)
        }
        let data={
          names:pdfArray,
          isDownload:false
        }
        this.$api.faxmergePdf(data).then(res => {
          if (res.errorcode == 0) {
            if(res.msg=='暂无数据'){
              this.$message({
                message: '图片合并失败',
                type: 'warning'
              });
              return
            }
           this.picturePath = `${window.g.ApiUrl}/${res.data}`
          }
        })
      },
      //图片列表移除
      pictureHandleRemove(file, fileList) {
        this.pictureList = fileList
        this.picturePostNumber--
        this.mergeImgOfPdf(fileList);
      },
      // 确认完成图片文件合成
      composeFile(){
        if (this.faxTemplateFileList.length > 0){
          this.$message.warning("只能上传一份传真文件!原先上传的传真文件已被覆盖");
        }
        this.faxTemplateFileList = []
        this.faxTemplateFileList.push({name:'上传图片',url:this.picturePath})
        this.pictureVisible = false
      },
      // 完成图片文件合成弹窗关闭回调
      pictureClosed(){
        this.pictureList = []
        this.picturePath = ''
        this.picturePostNumber = 0
      },
      // 传真列表移除
      onRemove(file, fileList){
        this.pdfName = ''
        this.faxTemplateFileList = []
        this.faxPreviewUrl = ''    //传真文件路径
      },
      // 回执列表移除
      receiptFileHandleRemove(){
        this.receiptFile = ''
        this.receiptFileList = []
        this.receiptFileUrl = ''    //回执文件路径
      },
      // 传真预览弹窗关闭
      faxPreviewClosed(){
        this.previewPath = ''
      },
      //预览传真
      // 弹窗
      previewSubmit(){
        this.faxPreviewVisible=true
        if (this.faxTemplateFileList[0]){
          this.faxPreviewUrl = this.faxTemplateFileList[0].url
          this.loadPreview(this.faxPreviewUrl)
        }
        if (this.receiptFileList[0]){
          this.receiptFileUrl = this.receiptFileList[0].url
        }
      },
      // 传真和回执切换
      loadPreview(url){
        this.previewPath = url
      },

      /* # endregion */

      /* 扫描文件 *//* #region */
      getScan(){
        this.$icp19.FaxScan()
      },
      //扫描导入
      scanImport(){
        this.ScanList.push({
          name:'扫描文件',
          url:this.scanFilePath

        })
        this.scanPath=this.scanFilePath
        this.$store.commit('setfaxScanStatus',0)
        this.$store.commit('setscanFilePath','')
      },
      //删除扫描件
      scanClose(){
        this.$store.commit('setfaxScanStatus',0)
        this.$store.commit('setscanFilePath','')
      },
      //扫描列表删除
      ScanHandleRemove(file, fileList){
        for(let i in this.ScanList){
          if(this.ScanList[i].uid==file.uid){
            this.ScanList.splice(i,1)
          }
        }
      },
      //点击扫描列表
      ScanHandlePreview(file){
        this.scanPath=file.url
      },
      //扫描合成
      composeScan(){
        let pdfArray=[]
        for(let i in this.ScanList){
          pdfArray.push(this.ScanList[i].url)
        }
        let data={
          names:pdfArray,
          isDownload:true
        }
        this.$api.faxmergePdf(data).then(res => {
          if (res.errorcode == 0) {
            if(res.msg=='暂无数据'){
              this.$message({
                message: '扫描文件合并失败',
                type: 'warning'
              });
              return
            }
            this.ScanList=[]
            let objFile=new File(["First Line Text","Second Line Text"],'扫描文件')
            objFile.url=`${window.g.ApiUrl}/eos/communication/pdf/preview?filename=`+res.data
            this.faxFileList.push(objFile)
            this.previewName=res.data
            this.faxForm.faxFileName='扫描文件'
            console.log(this.faxFileList)
            this.ScanList=[]
            this.scanPath=''
            this.scanVisible=false
          }
        })
      },
      /* # endregion */

      /**
       * @lastEditor hexinting
       * @lastDate 2020-10-25
       * @description 发送点击事件
       */
      submitUpload() {
        if (this.faxTemplateFileList.length === 0) {
          this.$message.warning("请选择需要发送的传真文件!");
          return;
        }

        if (this.tags.length == 0) {
          this.$message.warning("请添加接收人号码!");
          return;
        }

        if (this.IsYangZhouProject) {
          this.promptConfig.visible = true;
        } else {
          this.$confirm('确认发送?', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {

            this.sendFax();

          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消发送'
            });
          });
        }
      },
      //批量发送传真
      sendFax() {
        let faxNum = []     //传真号码
        let contactorId = []    //联系人id
        this.tags.forEach(e =>{
          if (e.fax){
            faxNum.push(e.fax)
          } else if (e.call){
            faxNum.push(e.call)
          }
          contactorId.push(e.id)
        })
        console.log(this.pdfName)
         let faxName = this.faxName.substr(
          this.faxName.lastIndexOf("/") + 1
        )
        let parmas = {
          // file:this.receiptFile,
          phoneNum: faxNum.join(),
          contactorId: contactorId.join(),
          pdfName: faxName,
          data: {
            faxSendTime: this.sendTime || '',          //定时发送时间
            faxCaseId: this.faxForm.caseId || '',    //事件ID
            faxName: this.faxForm.title || '',     //
            
            faxCreateTime: '',            //发送时间
            remark: ''                    //备注
          }
        }
        console.log(parmas);
        this.$api.sendFax(parmas).then(res => {
          if (res.errorcode != 0){
            this.$message({
              message: '发送失败!请检查文件是否正确',
              type: "error"
            });
          }else {
            if (res.msg == '暂无数据') {
              this.$message({
                message: '传真发送失败',
                type: 'warning'
              });
              return
            }
            this.$message({
              message: '传真已加入发送队列，等待发送',
              type: 'success'
            });
            this.getFaxQueuelistAll()
            if (this.IsYangZhouProject) { // 扬州项目需求：发送之前添加提醒 任务133
              this.promptCanCel(); // 关闭提示弹窗
            } 
          }
        });
      },
      // 获取传真队列
      getFaxQueuelistAll(){
        this.$api.faxQueuelistAll({}).then(res => {
          this.tableFaxQueueConfig.loading = false
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          if (res.data.length > 0) {
            this.faxQueuelistdata = [...res.data]
            let dataCopy = [...res.data]
            // 呼叫时间/接通时间数据格式化
            dataCopy.forEach((e,i) => {
              if (e.waitNum > 0){
                // dataCopy[i].
                let newSendTime = e.sendTime
                let array = e.sendTime.split(" ");
                dataCopy[i].sendTimeAfter = array[1];
                //结束时间
                var endDate = new Date(newSendTime);
                //当前时间
                var nowDate = new Date();
                //相差的总秒数
                var totalSeconds = parseInt((endDate - nowDate) / 1000);

                if (totalSeconds > 60){   // 大于1分钟
                  dataCopy[i].sendTime = this.getTime(totalSeconds)
                } else {    //小于1分钟
                  dataCopy[i].sendTime = ''
                  this.timeDown(dataCopy[i],totalSeconds)
                }
              }
            })
            this.tableFaxQueueData = dataCopy
          }else {
            this.tableFaxQueueData = []
          }
        }).catch(err => this.tableFaxQueueConfig.loading = false)
      },
      // 撤销传真队列
      cancel(faxFile){
        this.$confirm('是否撤销发送该传真?', '撤销发送', {
          confirmButtonText: '撤销',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          let data={
            fileName:faxFile
          }
          this.$api.faxQueuedeleteAll(data).then(res => {
            if (res.errorcode != 0) {
              this.$message({
                message: res.msg,
                type: "error"
              });
              return;
            }
            this.$message({
              message: '传真已撤销发送',
              type: "success"
            });
            this.getFaxQueuelistAll()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消撤销'
          });
        });
      },

      //查看传真详情
      detail(row){
        console.log(row);
        this.faxDetail.fileName=row.faxFile
        this.faxDetail.path=`${window.g.ApiUrl}/eos/communication/pdf/preview?filename=`+row.faxFile
        this.faxDetail.type=row.type
        this.faxDetail.status=row.status
        let data={
          fileName:this.faxDetail.fileName
        }
        this.$api.faxQueuefindByName(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          console.log(res);
          this.faxDetail.faxName=res.data.faxName
          this.faxDetail.sendTime=res.data.sendTime
          this.faxDetail.faxList=[]
          this.faxDetail.failedFileList=[]
          this.faxDetail.successFileList=[]
          this.faxDetail.waitFileList=[]
          this.faxDetail.faxList=res.data.faxList
          if(this.faxDetail.faxList.length>0){
            for(let i in this.faxDetail.faxList){
              if(this.faxDetail.faxList[i].type==1)
                this.faxDetail.waitFileList.push(this.faxDetail.faxList[i])
              else if(this.faxDetail.faxList[i].type==2)
                this.faxDetail.failedFileList.push(this.faxDetail.faxList[i])
              else if(this.faxDetail.faxList[i].type==3)
                this.faxDetail.successFileList.push(this.faxDetail.faxList[i])
            }
          }
        })
        this.faxdetailVisible=true
      },
      //传真详情关闭
      faxdetailClose(){
        this.faxDetail.Timetext='撤销'
        this.faxDetail.remainTime.day=''
        this.faxDetail.remainTime.hour=''
        this.faxDetail.remainTime.min=''
        this.faxDetail.remainTime.sec=''
        this.faxDetail.fileName=''
        this.faxDetail.path=''
        this.faxDetail.type=''
        this.faxDetail.faxName=''
        this.faxDetail.sendTime=''
        this.faxDetail.faxList=[]
        this.faxDetail.failedFileList=[]
        this.faxDetail.successFileList=[]
        this.faxDetail.waitFileList=[]
        this.faxdetailVisible=false

        this.getFaxQueuelistAll()
      },
      //撤销点击事件
      cancel(faxFile){
        this.$confirm('是否撤销发送该传真?', '撤销发送', {
          confirmButtonText: '撤销',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          let data={
            fileName:faxFile
          }
          this.$api.faxQueuedeleteAll(data).then(res => {
            if (res.errorcode != 0) {
              this.$message({
                message: res.msg,
                type: "error"
              });
              return;
            }
            this.$message({
              message: '传真已撤销发送',
              type: "success"
            });
            this.faxdetailClose()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消撤销'
          });
        });

      },
      //撤销待发传真
      deleteFax(item){
        this.$confirm('是否撤销发送该传真?', '撤销发送', {
          confirmButtonText: '撤销',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          let data={
            id:item.id
          }
          this.$api.faxQueuedelete(data).then(res => {
            if (res.errorcode != 0) {
              this.$message({
                message: res.msg,
                type: "error"
              });
              return;
            }
            this.$message({
              message: '传真已撤销发送',
              type: "success"
            });
            let data={
              fileName:this.faxDetail.fileName
            }
            this.$api.faxQueuefindByName(data).then(res => {
              if (res.errorcode != 0) {
                this.$message({
                  message: res.msg,
                  type: "error"
                });
                return;
              }
              this.faxDetail.faxList=[]
              this.faxDetail.failedFileList=[]
              this.faxDetail.successFileList=[]
              this.faxDetail.waitFileList=[]
              this.faxDetail.faxList=res.data.faxList
              if(this.faxDetail.faxList.length>0){
                for(let i in this.faxDetail.faxList){
                  if(this.faxDetail.faxList[i].type==1)
                    this.faxDetail.waitFileList.push(this.faxDetail.faxList[i])
                  else if(this.faxDetail.faxList[i].type==2)
                    this.faxDetail.failedFileList.push(this.faxDetail.faxList[i])
                  else if(this.faxDetail.faxList[i].type==3)
                    this.faxDetail.successFileList.push(this.faxDetail.faxList[i])
                }
              }
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消撤销'
          });
        });
      },
      //重发
      reSendFax(item){
        console.log(item)
        let data={
          id:item.id
        }
        this.$api.faxReSendFax(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          this.$message({
            message: '重发成功！',
            type: "success"
          });
          let data={
            fileName:this.faxDetail.fileName
          }
          this.$api.faxQueuefindByName(data).then(res => {
            if (res.errorcode != 0) {
              this.$message({
                message: res.msg,
                type: "error"
              });
              return;
            }
            this.faxDetail.faxList=[]
            this.faxDetail.failedFileList=[]
            this.faxDetail.successFileList=[]
            this.faxDetail.waitFileList=[]
            this.faxDetail.faxList=res.data.faxList
            if(this.faxDetail.faxList.length>0){
              for(let i in this.faxDetail.faxList){
                if(this.faxDetail.faxList[i].type==1)
                  this.faxDetail.waitFileList.push(this.faxDetail.faxList[i])
                else if(this.faxDetail.faxList[i].type==2)
                  this.faxDetail.failedFileList.push(this.faxDetail.faxList[i])
                else if(this.faxDetail.faxList[i].type==3)
                  this.faxDetail.successFileList.push(this.faxDetail.faxList[i])
              }
            }
          })

        })
      },
      // 倒计时
      timeDown(row,totalSeconds){
        let that = this
        if (totalSeconds <   0){
          row.status = '正在发送'
        } else {
          setTimeout(function () {
            row.sendTime = `(${totalSeconds}秒)`
            totalSeconds--
            that.timeDown(row,totalSeconds)
          },1000)
        }
      },
      // 更改时间
      getTime(totalSeconds) {
        //天数
        var days = Math.floor(totalSeconds / (60 * 60 * 24));
        //取模（余数）
        var modulo = totalSeconds % (60 * 60 * 24);
        //小时数
        var hours = Math.floor(modulo / (60 * 60));
        
        modulo = modulo % (60 * 60);
        //分钟
        var minutes = Math.floor(modulo / 60);
        //秒
        var seconds = modulo % 60;
        if(0<=seconds&&seconds<10)
          seconds="0"+seconds
        //输出到页面
        if (days > 0){
          if(0<=hours&&hours<10)
            hours="0"+hours
          if(0<=minutes&&minutes<10)
            minutes="0"+minutes
          return days + "天" + hours + ":"+ minutes+":"+ seconds
        } else if (hours > 0){
          if(0<=hours&&hours<10)
            hours="0"+hours
          if(0<=minutes&&minutes<10)
            minutes="0"+minutes
          return hours + ":" + minutes + ":"+ seconds
        } else if (minutes > 0){
          if(0<=minutes&&minutes<10)
            minutes="0"+minutes
          return minutes + ":" + seconds
        } else{
          return  seconds
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
  .mgr4{
    margin-right: 4px;
  }
  .mgr8{
    margin-right: 8px;
  }
  .mgl8{
    margin-left: 8px;
  }
  .mgb8{
    margin-bottom: 8px;
  }
  .mgb10{
    margin-bottom: 10px;
  }
  .narBar{
    margin: 0px;
  }
  >>>.el-tabs__item{
    font-size: 16px;
    color: #666666;
    height: 48px;
    line-height: 48px;
  }

  >>>.is-active{
    color: #333 !important;
  }

  .shortcut_box span{
    cursor: pointer;
  }
  .shortcut_active{
    color: #0091ff;
  }
  .common_input >>>.el-input__inner{
    height: 36px;
    border-radius: 7px;
  }

  .center_pagination >>>.el-pagination__sizes{
    margin: 0;
  }

  .center_pagination >>>.el-input--mini .el-input__inner{
    line-height: 22px;
    height: 22px;
  }
  .center_pagination >>>.el-pagination__jump{
    margin: 0;
  }

  .addressee_box{
    position: absolute;
    left: 10px;
    bottom: 10px;
  }
  .addressee_box span{
    font-size: 14px;
    color: #666;
  }
  .addressee_box div{
    display: inline-block;
    padding: 5px 10px;
    background: #F3F3F7;
    border-radius:6px;
  }

  .operate_box{
    position: absolute;
    right: 10px;
    bottom: 10px;
  }
  .operate_box span{
    font-size: 14px;
    color: #0091FF;
    padding: 0 8px;
    cursor: pointer;
    border-right: 1px solid #D8D8D8;
  }
  .operate_box span:last-child{
    border: none;
  }

  .faxForm{
    border: 1px solid #DDDDDD;
    border-radius: 4px;
  }

  .sendFaxBox{
    padding: 10px 20px 0 0;
  }

  .sendFaxBox >>> .el-form-item{
    margin-bottom: 10px;
  }
  .fax_upload_box >>>.el-button{
    padding: 8px 10px;
  }
  .sendFaxBox>>>.el-input__inner{
    height: 36px;
  }
  .template_btn{
    position: absolute;
    top: 5px;
    left: 90px;
  }
  .fax-action{
    padding: 10px 10px 10px 10px;
    background-color: #F9FCFF;
  }
  .faxTitle-input >>> .el-input__inner {
    height: 36px;
  }
  .faxTitle-input >>> .el-input__icon {
    line-height: 30px;
  }
  .btn-upload{
    height: 32px;
    padding: 5px;
    font-size: 12px;
  }

  .icon-preview{
    background-image: url(../../../../assets/icpImg/preview2.png);
    background-repeat: no-repeat;
    width:25px;
    height: 25px;
  }
  .icon-preview:hover{
    background-image: url(../../../../assets/icpImg/preview1.png);
    cursor: pointer;
  }
  .icon-scan{
    background-image: url(../../../../assets/icpImg/scan2.png);
    background-repeat: no-repeat;
    width:25px;
    height: 25px;
  }
  .icon-scan:hover{
    background-image: url(../../../../assets/icpImg/scan1.png);
    cursor: pointer;
  }
  .icon-PictureUpload{
    background-image: url(../../../../assets/icpImg/PictureUpload2.png);
    background-repeat: no-repeat;
    width:25px;
    height: 25px;
  }
  .icon-PictureUpload:hover{
    background-image: url(../../../../assets/icpImg/PictureUpload1.png);
    cursor: pointer;
  }

  .footer_box{
    padding: 18px 30px 22px 0;
  }
  .footer_box >>> .el-button{
    padding: 8px 15px;
    font-size: 16px;
  }

  .faxTemplateDialog >>> .el-dialog__body{
    padding: 8px 20px;
  }
  .faxTemplateDialog >>> .el-scrollbar__wrap {
    overflow: scroll;
    width: 110%;
    height: 100%;
  }


  .leftShow{
    float:left;
    width:140px;
    height: 700px;
  }
  .rightShow{
    width: 800px;
    height: 700px;
    box-shadow: 0px 4px 10px 0px #999999;
  }

  .faxFileShow{
    cursor: pointer;
    width:90%;
    height: 325px;
    padding: 10px;
    background-color: #f1f1f1;
  }
  .faxFileShowInner:hover,.faxFileShowInner:active {
    width:87%;
    height: 321px;
    padding: 10px;
    border: #0091FF solid 2px;
  }

  .filetitle{
    margin: 5px;
    text-align: center;
    color: #333333;
    font-size: 12px;
  }
  .filecontent1{
    position: relative;
    margin: 10px;
    height: 90%;
  }
  .filecontent2{
    margin: 10px;
    height: 90%;
    float: right;
    width: 74%;
  }

  /* 图片上传 *//* #region */
  .pictureShow1{
    width:100%;
    height: 150px;
    position: relative;
    background-color: #f1f1f1;
    border: #999999 dashed 1px;
  }

  .pictureShow2{
    margin-top: 10px;
    padding: 0px 13px;
    width: 81%;
    height: 535px;
    background-color: #f1f1f1;
    border: #999999 dashed 1px;
  }
  >>>.el-upload--picture{
    width:100%;
    height: 150px;
  }
  .upload-picture >>> .el-upload-list{
    margin: 13px 0 10px;
    overflow: auto;
    padding: 0 10px;
    height: 525px
  }
  .upload-picture >>> .el-upload-list--picture .el-upload-list__item{
    height: 110px;
  }
  .upload-picture >>> .el-upload-list--picture .el-upload-list__item-thumbnail{
    margin-left: -67px;
  }
  .upload-picture >>> .el-upload-list--picture .el-upload-list__item.is-success .el-upload-list__item-name{
    line-height: 30px;
    margin-top: 0;
    float: left;
    margin-left: -85px;
    width: 100px;
  }

  .icon-smile{
    background-image: url(../../../../assets/icpImg/smile.png);
    background-repeat: no-repeat;
    width:140px;
    height: 25px;
    color: #666666;
    font-size: 12px;
    margin: 0 auto;
    text-align: center;
    position: relative;
    top: 40%;
    line-height: 25px;
  }

  .icon-PictureUpload3{
    width: 100%;
    text-align: center;
    font-size: 12px;
    color: #333333;
  }

  .storGroupDialog >>> .el-dialog__body{
    padding: 10px 20px;
  }
  .storGroupDialog >>> .el-dialog__footer{
    padding: 5px 20px;
  }

  /* 传真扫描 *//* #region */

  .icon-scan{
    background-image: url(../../../../assets/icpImg/scan2.png);
    background-repeat: no-repeat;
    width:25px;
    height: 25px;
  }
  .icon-scan3{
    cursor: pointer;
    background-image: url(../../../../assets/icpImg/scan3.png);
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
  .icon-scanloading{
    background-image: url(../../../../assets/icpImg/loading.png);
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
  .icon-rescan{
    background-image: url(../../../../assets/icpImg/scanFail.png);
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
    color: #0091FF;
  }
  .icon-scanimport{
    background-image: url(../../../../assets/icpImg/scanSuccess.png);
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
    color: #0091FF;
  }
  .scanFileShow{
    margin-left: -20px;
    margin-top: 20px;
    width: 120px;
    height: 107px;
  }
  .icon-close{
    background-image: url(../../../../assets/icpImg/close.png);
    background-repeat: no-repeat;
    width: 16px;
    height: 16px;
    cursor: pointer;
    margin-left: 111px;
    margin-top: -160px;
    z-index: 99999;
    position:absolute;
  }

  .upload-scan >>> .el-upload-list{
    margin: 0 0 10px;
    overflow: auto;
    padding: 0 10px;
    height: 500px
  }
  .upload-scan >>> .el-upload-list--picture .el-upload-list__item{
    height: 110px;
  }
  .upload-scan >>> .el-upload-list--picture .el-upload-list__item-thumbnail{
    margin-left: -75px;
  }
  .upload-scan >>> .el-upload-list--picture .el-upload-list__item.is-success .el-upload-list__item-name{
    line-height: 30px;
    margin-top:70px;
    float: left;
    margin-left: -85px;
    width: 100px;
  }
  /* 传真扫描 *//* #endregion */

  .dialog-style-new .faxdetail-line{
    float: left;
    background:#F2F2F2;
    height: 700px;
    width: 2px;
    display: flex;

  }
  .dialog-style-new .faxdetailright{
    float: right;
    width:498px;
    height: 680px;
    margin:10px 0;
  }
  .dialog-style-new .faxDetailInform{
    font-size: 12px;
    color: #666666;
    font-weight:bold;
    display: flex;
    margin: 0 20px;
    align-items: center;
  }
  .dialog-style-new .tabsTitle >>> .el-tabs__content{
    height: 440px;
    overflow: scroll;
  }
  .dialog-style-new .tabsTitle >>> .el-tabs__nav{
    width: 100%;
    background-color: #F7F8FA;
  }
  .dialog-style-new .tabsTitle >>> .el-tabs__item{
    width: 33.3%;
    color: #999999;
    font-size: 12px;
  }
  .dialog-style-new .tabsTitle >>> .el-tabs__item.is-active{
    width: 33.3%;
    color: #555555;
    font-size: 12px;
    font-weight: bold;
  }
  .dialog-style-new .tabsTitle >>> #tab-first{
    margin-left: 30px;
  }
  .dialog-style-new .sendList{
    color: #333333;
    font-size: 12px;
    font-weight: bold;
    background-color: #F7F8FA;
    line-height: 36px;
    height: 36px;
    width: 420px;
    margin: 10px auto;
    padding: 0 20px;
  }
  .dialog-style-new .sendFaxList-headline{
    background:#0091FF;
    margin:3px 10px;
    height: 14px;
    width: 2px;
  }

  .dialog-style-new .sendFaxList-headtext{
    color:#333333;
    font-size: 14px;
    margin:10px;
    display: flex;
    font-weight: bold;
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
    .el-dialog__footer {
      padding: 15px 0px 20px;
      border-top: 1px solid #e9ecf1;
      text-align: right;
    }
  }

  
</style>
