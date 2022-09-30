<!-- 工作安排弹窗 -->
<template>
  <div class="reportOrWorkContainer">
    <el-dialog
      :title="title"
      :visible.sync="isDialogVisible"
      @close="closeDialog"
      width="880px"
      :close-on-click-modal="false"
      custom-class="ReportOrWork"
    >
      <div style="padding-top: 10px">
        <!-- <el-scrollbar style="height: 100%;"> -->
        <el-row>
          <el-col :span="24">
            <el-form
              ref="workForm"
              :model="workForm"
              :rules="rules"
              label-position="right"
              label-width="100px"
            >
              <el-form-item prop="id" hidden>
                <el-col :span="23">
                  <el-input v-model="workForm.id"></el-input>
                </el-col>
              </el-form-item>
              <el-form-item prop="type" hidden>
                <el-col :span="23">
                  <el-input v-model="typeId"></el-input>
                </el-col>
              </el-form-item>
              <el-row v-if="title !== '添加附件' && title !== '新增零报告' && title !== '修改工作安排'">
                <el-form-item prop="affairsTypeId" label="类型选择：" >
                  <el-col :span="7">
                    <el-select v-model="workForm.affairsTypeId" placeholder="请选择" @change="affairsType">
                      <el-option
                        v-for="item in workOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-row>
              <el-row v-else-if="title === '修改工作安排' && workForm.affairsTypeId !== null">
                <el-form-item prop="affairsTypeId" label="类型选择：">
                  <el-col :span="7">
                    <el-select
                      v-model="workForm.affairsTypeId"
                      placeholder="请选择"
                      @change="affairsType"
                    >
                      <el-option
                        v-for="item in workOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-row>
              <el-row v-show="title !== '添加附件'">
                <el-form-item prop="title" label="标题：">
                  <el-col :span="23">
                    <el-input v-model="workForm.title" placeholder="长度限100字符以内"></el-input>
                  </el-col>
                </el-form-item>
              </el-row>
              <el-row v-show="title !== '添加附件'">
                <el-form-item prop="content" label="内容：">
                  <!--当数据获取且存在后再渲染标签-->
                  <el-col :span="23">
                    <el-input
                      type="textarea"
                      :rows="5"
                      resize="none"
                      placeholder="长度限10000字符以内"
                      v-model="workForm.content"
                    ></el-input>
                  </el-col>
                </el-form-item>
              </el-row>
              <!--因为time的非空校验在其他版块通不过,只能用v-if-->
              <!-- <el-row v-if="title != '新增零报告'"> -->
              <el-row>
                <el-col style="text-align: left;">
                  <!-- <el-form-item prop="executeTime" :label="(title=='新增零报告'?'报告':'执行')+'时间:'"> -->
                  <el-form-item prop="executeTime" label="执行时间:">
                    <el-date-picker
                      v-model="workForm.executeTime"
                      type="datetime"
                      placeholder="选择日期"
                      format="yyyy-MM-dd HH:mm"
                      value-format="yyyy-MM-dd HH:mm"
                      align="right"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col style="text-align: left;padding-right: 25px;">
                  <el-form-item label="单位：" class="unitNames">
                    <!-- <el-input v-model="workForm.unitNames" readonly :title="workForm.unitNames"> -->
                    <!-- <el-input readonly :title="workForm.unitNames"> -->
                      <div style="display:flex;justify-content:space-between">
                        <tag
                          class="tag"
                          :selectIds = []
                          :isPlatformRoot="true"
                          :dataName="unitTag"
                          @handleClose="handleCloseTag"
                          style="
                            padding: 0px 15px 15px 0;
                            border-top: none;
                            width: 655px;
                          "
                        ></tag>
                        <!-- <template slot="append"> -->
                          <!-- <el-button @click="showUnitDialog" >选择单位</el-button> -->
                          <el-button @click="showUnitDialog" style="top: 13px;position: absolute;right: 2px">选择单位</el-button>
                        <!-- </template> -->
                    </div>
                    <!-- </el-input> -->
                  </el-form-item>
                  <el-row>
                    
                  </el-row>
                </el-col>
              </el-row>
              
              <!-- <el-row v-if="title != '新增零报告'" style="margin-bottom: 20px"> -->
              <el-row style="margin-bottom: 20px">
                <el-col :span="23">
                  <el-form-item
                    prop="vcExtend1"
                    label="负责人："
                  >
                    <el-row>
                      <div style="width:500px;text-align:left !important;">
                        <!-- <el-checkbox
                          v-model="isSelectAllPosition"
                          @change="selectAllPosition"
                          class="checkbox" >
                          全选
                        </el-checkbox> -->
                        <el-checkbox-group v-model="selectedPosition">
                            <!-- @change="handleChangePosition" -->
                          <el-checkbox
                            class="checkbox" 
                            @change="positionOrDuty"
                            v-for="item in selectPositionList" 
                            :label="item.id" 
                            :key="item.id"
                            style="position: relative;margin:2px;display: inline-block">
                            {{item.name}}
                          </el-checkbox>
                        </el-checkbox-group>
                      </div>
                      <!-- <el-button @click="isPositionShow=true" style="top: 14px;position: absolute;right: 2px">请选择岗位</el-button> -->
                    </el-row>

                    <!-- <el-row style="border-top: 1px dashed #e2e2e2;"> -->
                    <el-row>
                      <div style="width:500px;text-align:left !important;">
                        <el-checkbox-group v-model="selectPeople">
                          <!-- @change="handleSelectPeople" -->
                          <el-checkbox
                            @change="positionOrDuty"
                            class="checkbox" 
                            v-for="item in selectPeopleList" 
                            :label="item.name" 
                            :key="item.name" 
                            style="position: relative;margin:2px;display: inline-block">
                            {{item.name}}
                          </el-checkbox>
                        </el-checkbox-group>
                      </div>
                      <el-button @click="showSelectUnitDialog" style="top: 13px;position: absolute;right: 2px;display:none">请选择值班员</el-button>
                    </el-row>
                    <!-- 注释原因：旧版本工作安排，选择人员弹窗 -->
                    <!-- <el-input
                      v-model="workForm.vcExtend1"
                      placeholder="长度限100字符以内"
                      maxlength="100"
                      @focus="addPerson"
                    ></el-input>
                    <add-contact
                      ref="addContact"
                      @changeDialog="$refs.addContact.dialogFormVisible = false"
                    ></add-contact> -->
                  </el-form-item>
                  <el-form-item label="通知名单预览:" class="workPreview">
                    <!-- <el-table :data="noticeList" border style="width: 100%" height="220">
                      <el-table-column
                        :prop="item.prop"
                        :label="item.label"
                        align="center"
                        v-for="item in noticeListColumn"
                        :key="item.prop"
                      >
                      </el-table-column>
                    </el-table> -->
                    <el-table :data="noticeList" border style="width: 100%" max-height="220" min-height="220" >
                      <el-table-column prop="dept" label="单位" align="center">
                      </el-table-column>
                      <el-table-column label="人员名称" align="center" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <span
                            v-for="(item, index) in scope.row.contactors"
                            :key="item.contactorId"
                          >
                            {{
                              item.contactor +
                                (index == scope.row.contactors.length - 1 ? "" : ",")
                            }}
                          </span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-form-item>
                </el-col>
              </el-row>
              
              <!-- <el-row v-else>
                <el-col :span="12">
                  <el-form-item
                    prop="vcExtend1"
                    :label="(title=='新增零报告'?'报告':'责任')+'人：'"
                  >
                    <el-input
                      v-model="workForm.vcExtend1"
                      placeholder="长度限100字符以内"
                      maxlength="100"
                      @focus="addPerson"
                    ></el-input> -->
                    <!-- 选择人员弹窗 -->
                    <!-- <selectMansDialog
                      ref="selectDialog"
                      selectTitle="选择联系人"
                      :selectData="outerVisible"
                      @close="outerVisible = false"
                      @closeDialog="outerVisible = false"
                      @addMans="change"
                    ></selectMansDialog>
                  </el-form-item>
                </el-col>
                <el-col :span="12" style="text-align: left;">
                  <el-form-item prop="executeTime" :label="(title=='新增零报告'?'报告':'执行')+'时间：'">
                    <el-date-picker
                      v-model="workForm.executeTime"
                      type="datetime"
                      placeholder="选择日期"
                      format="yyyy-MM-dd HH:mm"
                      value-format="yyyy-MM-dd HH:mm"
                      align="right"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row> -->
              <el-row v-show="title != '新增零报告' && title != '修改工作安排'">
                <el-form-item label="附件:" style="text-align: left;">
                  <!-- 注释原因：旧版上传文件样式 -->
                  <!-- <el-upload
                    class="upload-demo"
                    accept=".doc, .docx, .xls, .xlsx, .png, .jpg, .gif, .jpeg, .pdf, .txt, .zip, .rar"
                    :action="$api.GovernmentAffairsUploadUrl"
                    :headers="{Authorization: $window.localStorage.getItem('token') ? $window.localStorage.getItem('token') : ''}"
                    :on-success="handleUploadFile"
                    :file-list="fileList"
                    :with-credentials="true"
                    :on-remove="handleRemoveFile"
                    :before-upload="beforeFileUpload"
                    multiple
                  >
                    <div style="display:flex;align-items: center;">
                      <el-button size="small" type="primary">点击上传</el-button>
                      <div
                        slot="tip"
                        class="el-upload__tip"
                        style="position: absolute;right: 30px;color:#B5B5B5"
                      >限doc,docx,xls,xlsx,png,jpg,gif,jpeg,pdf,txt,.zip,.rar，且不超过50mb</div>
                    </div>
                  </el-upload> -->

                  <div style="display:flex;align-items: center;">
                    <el-button size="small" type="primary" @click="startUpload">点击上传</el-button>
                    <div
                      slot="tip"
                      class="el-upload__tip"
                      style="position: absolute;right: 30px;color:#B5B5B5"
                    >限doc,docx,xls,xlsx,png,jpg,gif,jpeg,pdf,txt,.zip,.rar，且不超过50mb</div>
                  </div>
                  <!-- 文件列表 -->
                  <div class="file_list">
                    <div v-for="(item, index) in selectedFileLists" :key="item.index" class="file_item">
                      <i class="el-icon-paperclip"></i>
                      <span class="file_name">{{ item.fileOldName }}</span>
                      <div class="upload_success_icon" @click="deleteFile(item, index)"></div>
                    </div>
                  </div>
                  <el-dialog 
                    :visible.sync="uploadShow" 
                    width="490px" 
                    title="附件上传" 
                    :modal="false"
                    :close-on-click-modal="false"
                    :modal-append-to-body="false"
                    custom-class="ReportOrWork"
                    @close="uploadShow=false">
                      <el-form 
                        label-position="right"
                        label-width="100px"
                        style="heigh: 800px;margin: 10px">
                        <el-form-item label="电脑上传：">
                          <el-col :span="24">
                            <el-upload
                              class="upload-demo"
                              accept=".doc, .docx, .xls, .xlsx, .png, .jpg, .gif, .jpeg, .pdf, .txt, .zip, .rar"
                              :action="$window.SITE_CONFIG['cloudUrl']+'/fileupload/upload/uploadAffairs'"
                              :headers="{Authorization: $window.localStorage.getItem('token') ? $window.localStorage.getItem('token') : '',
                                token: $window.localStorage.getItem('token') ? $window.localStorage.getItem('token') : ''
                              }"
                              :on-success="handleUploadFile"
                              :file-list="fileList"
                              :with-credentials="true"
                              :on-remove="handleRemoveFile"
                              :before-upload="beforeFileUpload"
                              multiple
                            >
                              <el-input
                                style="width: 355px"
                                placeholder="选择上传"
                                v-model="pcUploadFileNames"
                                :title="pcUploadFileNames"
                                readonly
                              ></el-input>
                            </el-upload>
                          </el-col>
                        </el-form-item>
                      
                        <el-form-item label="系统上传：">
                          <div style="text-align:left !important;height:300px;overflow:scroll">
                            <el-checkbox-group v-model="selectSystemUpload" @change="handleSelectedFaxTemplateList">
                              <el-checkbox
                                class="checkbox" 
                                v-for="item in systemFileLists" 
                                :label="item.id" 
                                :key="item.id"
                                border
                                style="position: relative;margin:2px;display: inline-block">
                                {{item.title}}
                              </el-checkbox>
                            </el-checkbox-group>
                          </div>
                        </el-form-item>
                      </el-form>
                      <div slot="footer" class="dialog-footer">
                        <el-button @click="cancelSubmit" size="medium">取消</el-button>
                        <el-button type="primary" @click="sumbitFileList" size="medium">确定</el-button>
                      </div>
                  </el-dialog>
                </el-form-item>
              </el-row>
              <!-- 当弹窗为修改工作安排，且没有类型时，则为零报告的修改 -->
              <el-row v-if="title === '修改工作安排' && workForm.affairsTypeId !== null">
                <el-form-item label="附件:" style="text-align: left;">
                  <!-- 注释原因：旧版上传文件样式 -->
                  <!-- <el-upload
                    class="upload-demo"
                    accept=".doc, .docx, .xls, .xlsx, .png, .jpg, .gif, .jpeg, .pdf, .txt, .zip, .rar"
                    :action="$api.GovernmentAffairsUploadUrl"
                    :headers="{Authorization: $window.localStorage.getItem('token') ? $window.localStorage.getItem('token') : ''}"
                    :on-success="handleUploadFile"
                    :file-list="fileList"
                    :with-credentials="true"
                    :on-remove="handleRemoveFile"
                    :before-upload="beforeFileUpload"
                    multiple
                  >
                    <div style="display:flex;align-items: center;">
                      <el-button size="small" type="primary">点击上传</el-button>
                      <div
                        slot="tip"
                        class="el-upload__tip"
                        style="position: absolute;right: 30px;color:#B5B5B5"
                      >限doc,docx,xls,xlsx,png,jpg,gif,jpeg,pdf,txt,.zip,.rar，且不超过50mb</div>
                    </div>
                  </el-upload> -->

                  <div style="display:flex;align-items: center;">
                    <el-button size="small" type="primary" @click="startUpload">点击上传</el-button>
                    <div
                      slot="tip"
                      class="el-upload__tip"
                      style="position: absolute;right: 30px;color:#B5B5B5"
                    >限doc,docx,xls,xlsx,png,jpg,gif,jpeg,pdf,txt,.zip,.rar，且不超过50mb</div>
                  </div>
                  <!-- 文件列表 -->
                  <div class="file_list">
                    <div v-for="(item, index) in selectedFileLists" :key="item.index" class="file_item">
                      <i class="el-icon-paperclip"></i>
                      <span class="file_name">{{ item.fileOldName }}</span>
                      <div class="upload_success_icon" @click="deleteFile(item, index)"></div>
                    </div>
                  </div>
                  <el-dialog 
                    :visible.sync="uploadShow" 
                    width="490px" 
                    title="附件上传" 
                    :modal="false"
                    :close-on-click-modal="false"
                    :modal-append-to-body="false"
                    custom-class="ReportOrWork"
                    @close="uploadShow=false">
                      <el-form 
                        label-position="right"
                        label-width="100px"
                        style="heigh: 800px;margin: 10px">
                        <el-form-item label="电脑上传：">
                          <el-col :span="24">
                            <el-upload
                              class="upload-demo"
                              accept=".doc, .docx, .xls, .xlsx, .png, .jpg, .gif, .jpeg, .pdf, .txt, .zip, .rar"
                              :action="$window.SITE_CONFIG['cloudUrl']+'/fileupload/upload/uploadAffairs'"
                              :headers="{Authorization: $window.localStorage.getItem('token') ? $window.localStorage.getItem('token') : '',
                                token: $window.localStorage.getItem('token') ? $window.localStorage.getItem('token') : ''
                              }"
                              :on-success="handleUploadFile"
                              :file-list="fileList"
                              :with-credentials="true"
                              :on-remove="handleRemoveFile"
                              :before-upload="beforeFileUpload"
                              multiple
                            >
                              <el-input
                                style="width: 355px"
                                placeholder="选择上传"
                                v-model="pcUploadFileNames"
                                :title="pcUploadFileNames"
                                readonly
                              ></el-input>
                            </el-upload>
                          </el-col>
                        </el-form-item>
                      
                        <el-form-item label="系统上传：">
                          <div style="text-align:left !important;height:300px;overflow:scroll">
                            <el-checkbox-group v-model="selectSystemUpload" @change="handleSelectedFaxTemplateList">
                              <el-checkbox
                                class="checkbox" 
                                v-for="item in systemFileLists" 
                                :label="item.id" 
                                :key="item.id"
                                border
                                style="position: relative;margin:2px;display: inline-block">
                                {{item.title}}
                              </el-checkbox>
                            </el-checkbox-group>
                          </div>
                        </el-form-item>
                      </el-form>
                      <div slot="footer" class="dialog-footer">
                        <el-button @click="cancelSubmit" size="medium">取消</el-button>
                        <el-button type="primary" @click="sumbitFileList" size="medium">确定</el-button>
                      </div>
                  </el-dialog>
                </el-form-item>
              </el-row>
              <!-- 取消备注模块，任务316 author：husiyue date：2021.4.22 -->
              <!-- <el-row v-show="title == '新增零报告'">
                <el-form-item label="备注："> -->
                  <!--当数据获取且存在后再渲染标签-->
                  <!-- <el-col :span="23">
                    <el-input
                      type="textarea"
                      :rows="5"
                      resize="none"
                      placeholder="长度限10000字符以内"
                      v-model="workForm.remark"
                      maxlength="10000"
                    ></el-input>
                  </el-col>
                </el-form-item>
              </el-row> -->
              <el-row>
                <el-form-item label v-show="title !== '添加附件' && title !== '新增零报告' && title != '修改工作安排'">
                  <!-- <el-radio-group v-model="needCall" style="float:left;margin-bottom: 16px">
                    <el-radio
                      v-for="item in chasingStatus"
                      :label="item.id"
                      :key="item.id"
                    >{{item.label}}</el-radio>
                  </el-radio-group> -->

                  <el-checkbox v-model="needCall" style="float:left;height: 35px;line-height: 0px;">是否追呼</el-checkbox>

                  <div style="clear:both"></div>


                  <template v-if="needCall">
                    <el-radio-group
                      v-model="workForm.rightNow"
                      style="float:left;margin-bottom: 16px"
                    >
                      <el-radio
                        v-for="item in chasingType"
                        :label="item.id"
                        :key="item.id"
                      >{{item.label}}</el-radio>
                    </el-radio-group>
                    <div style="clear:both"></div>

                    <el-row>
                      <el-col :span="9" v-if="workForm.rightNow == 0">
                        <el-row>
                          <el-col :span="14" style="text-align:left">确认-追呼时限设置</el-col>
                          <el-col :span="9">
                            <el-select v-model="workForm.remind" placeholder="请选择">
                              <el-option
                                v-for="item in setTimes"
                                :key="item.id"
                                :label="item.label"
                                :value="item.id"
                              ></el-option>
                            </el-select>
                          </el-col>
                        </el-row>
                      </el-col>
                      <el-col :span="8">
                        <el-row>
                          <el-col :span="14">追呼间隔时间设置</el-col>
                          <el-col :span="10">
                            <el-select v-model="workForm.remindInterval" placeholder="请选择">
                              <el-option
                                v-for="item in setTimes"
                                :key="item.id"
                                :label="item.label"
                                :value="item.id"
                              ></el-option>
                            </el-select>
                          </el-col>
                        </el-row>
                      </el-col>
                      <el-col :span="7">
                        <el-row>
                          <el-col :span="10">追呼数量</el-col>
                          <el-col :span="12">
                            <el-select v-model="workForm.callFrequency" placeholder="请选择">
                              <el-option
                                v-for="item in setNumbs"
                                :key="item.id"
                                :label="item.label"
                                :value="item.id"
                              ></el-option>
                            </el-select>
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                  </template>
                </el-form-item>
                <el-form-item label v-if="title === '修改工作安排' && workForm.affairsTypeId !== null">
                  <!-- <el-radio-group v-model="needCall" style="float:left;margin-bottom: 16px">
                    <el-radio
                      v-for="item in chasingStatus"
                      :label="item.id"
                      :key="item.id"
                    >{{item.label}}</el-radio>
                  </el-radio-group> -->

                  <el-checkbox v-model="needCall" style="float:left;height: 35px;line-height: 0px;">是否追呼</el-checkbox>

                  <div style="clear:both"></div>


                  <template v-if="needCall">
                    <el-radio-group
                      v-model="workForm.rightNow"
                      style="float:left;margin-bottom: 16px"
                    >
                      <el-radio
                        v-for="item in chasingType"
                        :label="item.id"
                        :key="item.id"
                      >{{item.label}}</el-radio>
                    </el-radio-group>
                    <div style="clear:both"></div>

                    <el-row>
                      <el-col :span="9" v-if="workForm.rightNow == 0">
                        <el-row>
                          <el-col :span="14" style="text-align:left">确认-追呼时限设置</el-col>
                          <el-col :span="9">
                            <el-select v-model="workForm.remind" placeholder="请选择">
                              <el-option
                                v-for="item in setTimes"
                                :key="item.id"
                                :label="item.label"
                                :value="item.id"
                              ></el-option>
                            </el-select>
                          </el-col>
                        </el-row>
                      </el-col>
                      <el-col :span="8">
                        <el-row>
                          <el-col :span="14">追呼间隔时间设置</el-col>
                          <el-col :span="10">
                            <el-select v-model="workForm.remindInterval" placeholder="请选择">
                              <el-option
                                v-for="item in setTimes"
                                :key="item.id"
                                :label="item.label"
                                :value="item.id"
                              ></el-option>
                            </el-select>
                          </el-col>
                        </el-row>
                      </el-col>
                      <el-col :span="7">
                        <el-row>
                          <el-col :span="10">追呼数量</el-col>
                          <el-col :span="12">
                            <el-select v-model="workForm.callFrequency" placeholder="请选择">
                              <el-option
                                v-for="item in setNumbs"
                                :key="item.id"
                                :label="item.label"
                                :value="item.id"
                              ></el-option>
                            </el-select>
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                  </template>
                </el-form-item>
              </el-row>
              
            </el-form>
          </el-col>
        </el-row>
        <!-- </el-scrollbar> -->
      </div>
      <el-row style="padding:13px 20px 12px 0;border-top:1px solid #F1F4F6;text-align:right">
        <el-col :span="24">
          <el-button type="default" @click="closeDialog" size="medium">取消</el-button>
          <el-button type="primary" @click="submit(false)" size="medium">保存</el-button>
          <el-button
            type="primary"
            @click="submit(true)"
            size="medium"
          >保存并{{title=="新增零报告"?'提交':'下发'}}</el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 单位绑定部门弹窗 -->
    <select-unit
      v-if="selectUnitVisible"
      ref="selectUnit"
      @udpateUnitData="udpateUnitData"
      :unitData.sync="unitData"
      v-on="$listeners"
      @handleClose="handleClose"
    />

    <!-- 选择单位（政务联络网分组）弹窗 -->
    <el-dialog width="300px" title="选择单位" :visible.sync="unitDialogVisible" :close-on-click-modal="false" :modal-append-to-body="false" :modal="false" custom-class="ReportOrWork">
      <div style="padding: 20px;">
        <el-scrollbar style="height: 100%">
          <el-tree
            ref="departmentTree"
            show-checkbox
            style="max-height: 400px"
            :data="unitsData"
            node-key="id"
            highlight-current
            :props="defaultProps"
            :default-checked-keys="defaultCheckedDepartment"
            @check-change="departmentClick"
            :check-strictly="true"
            ></el-tree>
        </el-scrollbar>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeUnitDialog" size="medium">取消</el-button>
          <el-button type="primary" @click="confirmUnit" size="medium">确定</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 选择岗位弹窗 -->
    <el-dialog width="300px" title="选择岗位" :visible.sync="isPositionShow" :close-on-click-modal="false" :modal-append-to-body="false" :modal="false" custom-class="ReportOrWork">
      <div style="padding: 20px;">
        <el-scrollbar style="height: 100%">
          <el-tree
            ref="tree"
            show-checkbox
            style="max-height: 400px"
            :data="positionTree"
            node-key="name"
            highlight-current
            :props="positionProps"
            :default-checked-keys="defaultCheckedPosition"
            @check-change="positionClick"></el-tree>
        </el-scrollbar>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelSubmitPosition" size="medium">取消</el-button>
          <el-button type="primary" @click="submitPosition" size="medium">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import addContact from "@/view/integratedCommunication/icpPhone/icpPhonePage/smsStep/addContact/ReportOrWorkAddContact";
import bus from "@/components/common/js/eventBus";
import selectUnit from "@/components/selectUnit.vue";
import selectMansDialog from "@/view/eventManagement/eventReports/dialog/selectMansDialog";
import { debounce } from "@/utils/common.js";
import tag from "@/components/tag/tag";
import axios from '@/assets/api/api'

export default {
  name: "appDutyPopup",
  props: {
    //标题
    title: {
      type: String
    }
  },
  components: {
    addContact,
    selectMansDialog,
    selectUnit,
    tag,
  },
  data() {
    return {
      workForm: {
        id: "",
        title: "",
        content: "",
        // unit: "",
        executeTime: "",
        // type: "",
        // vcExtend2: "",
        rightNow: "", // 追呼类型
        remind: 1, //时限   bug11264 时限、间隔时间设置都需默认选择为1分钟，追呼数量默认选择1次
        callFrequency: 1, // 数量  bug11264 时限、间隔时间设置都需默认选择为1分钟，追呼数量默认选择1次
        remindInterval: 1, //间隔时间  bug11264 时限、间隔时间设置都需默认选择为1分钟，追呼数量默认选择1次
        // remark:"",

        contactorIds: [],
        appSjsAffairsFiles: [], //电脑上传文件信息
        vcExtend1: "",
        affairsTypeId: "", // 类型
        unitNames: '', // 所选政务联络网分组的名称
      }, //表单数据
      unitNames: '', // 单位名称
      unitTag:[], // 单位tag信息
      positions: [], // 职位
      relation: [], // 政务联络网分组和部门关联关系

      needCall: false, // 是否追呼
      workOptions: [], // 类型数据
      chasingType: [
        { id: 0, label: "设定追呼" },
        { id: 1, label: "立即追呼" }
      ],
      chasingStatus: [
        { id: 1, label: "是" },
        { id: 0, label: "否" }
      ],
      setTimes: [
        { id: 1, label: "1分钟" },
        { id: 3, label: "3分钟" },
        { id: 5, label: "5分钟" },
        { id: 10, label: "10分钟" },
        { id: 15, label: "15分钟" },
        { id: 30, label: "30分钟" }
      ],
      setNumbs: [
        { id: 1, label: "1次" },
        { id: 3, label: "3次" },
        { id: 5, label: "5次" },
        { id: 10, label: "10次" },
        { id: 15, label: "15次" },
        { id: 30, label: "30次" }
      ],
      fileList: [], //上传文件列表
      rules: {
        affairsTypeId: [
          { required: true, message: "类型不能为空",  trigger: "change" }
        ],
        title: [
          { required: true, message: "标题不能为空", trigger: "blur" },
          {
            max: 100,
            message: "标题不能超过100字"
          }
        ],
        content: [
          // { required: true, message: "内容不能为空", trigger: "blur" },
          {
            max: 10000,
            message: "内容不能超过10000字"
          }
        ],
        unit: [
          {
            max: 200,
            message: "负责单位名称不能超过200字"
          }
        ],
        // vcExtend1: [
        //   { required: true, message: "责任人不能为空", trigger: "change" }
        // ],
        // executeTime: [
        //   { required: true, message: "时间不能为空", trigger: "blur" }
        // ],
        vcExtend2: [
          {
            max: 100,
            message: "执行情况不能超过100字"
          }
        ],
        unitNames: [
          {
            required: true,
            message: "单位不能为空"
          }
        ], // 所选政务联络网分组的名称
        
      }, //验证规则
      isDialogVisible: false, //是否显示弹窗
      defaultProps: {
        children: "children",
        label: "name",
        plusIcon: true
      },
      treeData: [], //数形数据
      allowType: [
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "image/png",
        "image/jpeg",
        "image/gif",
        "application/pdf",
        "text/plain"
      ], //允许上传的文件mine-type
      time: "", // 当前时间
      affairsId: "", //当前政务Id
      typeId: "",
      outerVisible: false,
      searchText: "",
      mans: "",
      typeTips: 1, //修改工作安排状态 0:弹窗选择不覆盖原标题和内容；1:是否第一次触发下拉框（1为是）；2:弹窗选择覆盖原标题和内容
      originalId: '',// 修改工作安排原类型id
      dataName: [], // 选了的所有联系人
      
      // 附件--start
      uploadShow: false, // 是否打开附件上传弹窗
      pcUploadList: [], // 电脑上传在输入框展示的列表
      pcUploadFileNames: '', // 电脑上传文件名字
      systemFileLists: [], // 系统文件列表
      systemUploadList: [], // 系统上传列表
      selectSystemUpload: [], // 勾选的系统上传
      selectedFileLists: [], // 当前选中上传的文件
      // 附件--end

      // 岗位--start
      isSelectAllPosition: false, // 是否全选岗位
      selectedPosition: [], // 已勾选的岗位
      // defaultCheckedPosition: ['主要领导', '主管领导', '办公室负责人', '科室负责人', '科室联络员'], // 选择岗位弹窗——默认勾选的岗位
      defaultCheckedPosition: [], // 选择岗位弹窗——默认勾选的岗位
      // defaultPositions: [
      //   {
      //     name: '主要领导'
      //   },
      //   {
      //     name: '主管领导'
      //   },
      //   {
      //     name: '办公室负责人'
      //   },
      //   {
      //     name: '科室负责人'
      //   },
      //   {
      //     name: '科室联络员'
      //   }
      // ], // 初始化——默认显示的岗位联系人列表
      selectPositionList: [], // 岗位联系人列
      temCheckedKeys: [], // 暂存岗位 
      positionTree: [], // 岗位树
      positionProps: { // 岗位树prop
        label: 'name',
      },
      isPositionShow: false, // 岗位弹窗
      // 岗位--end

      // 单位--start
      unitData: [], // 政务联络网和部门的关联关系
      selectPeople: [], // 勾选的值班员联系人
      selectPeopleList: [{
        name: '值班员'
      }], // 值班员联系人列
      selectUnitVisible: false, // 是否显示单位弹窗
      // 单位--end

      unitDialogVisible: false, // 单位弹窗——是否显示单位弹窗
      unitDialogTitle: '选择分组', // 单位弹窗——弹窗标题
      unitsData: [], // 政务联系网分组
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      defaultCheckedDepartment: [], // 默认勾选的单位
      hasCheckedNodes: [], // 修改的已勾选的单位，不是第一次点击选择单位时，使用该数组判断勾选的数据
      checkFlag: 0, // 判断是否第一次点击选择单位 -0 第一次点击 -1 不是第一次点击
      noticeList: [],// 人员名单
      showSelectPeople: [],// 值班员名单预览
      showSelectedPosition: [],// 岗位名单预览
      noticeListColumn: [
        { prop: "dept", label: "单位" },
        // { prop: "position", label: "职位" },
        { prop: "contactor", label: "人员名称" }
      ],
    };
  },
  created() {
    // this.getWorkType();
    this.initTypeData();
  },
  /**
   * @createTime 2021-04-09
   * @editor qinjiaqi
   * @param {type} 没有
   * @return {type} undefined
   * @Description mounted
   */
 mounted() {
    // qinjiaqi 石景山之前用的通讯录现在不用了改用勾选负责人
    bus.$off("ReportOrWork");
    bus.$on("ReportOrWork", contactors => {
      this.workForm.vcExtend1 = '';
      this.workForm.contactorIds = [];
      if(contactors && contactors.length > 0) {
        this.dataName = contactors
        var i = 0
        for(; i < contactors.length - 1; i ++) {
          this.workForm.vcExtend1 += contactors[i].name + ' , '
          this.workForm.contactorIds.push(contactors[i].id)
        }
        this.workForm.vcExtend1 += contactors[i].name
        this.workForm.contactorIds.push(contactors[i].id)
      }
    });
    // this.selectPositionList = this.defaultPositions; // 初始化岗位   新增||编辑工作安排——负责人——岗位
    this.getSystemFileLists() // 初始化系统上传列表
    this.getPositionTree() // 初始化岗位树
    this.getAllUnits(); // 获取政务联络网分组
    this.postData(); // 获取所有岗位
  },
  watch: {
    title: {
      immediate: true, // immediate选项可以开启首次赋值监听
      handler(newVal, oldVal) {
        setTimeout(() => {
          this.clearContenr();
        });
      }
    },
    isDialogVisible(newVal) {
      if (this.title == "新增零报告") {
        this.getTimes();
      }
      // if(this.title != '修改工作安排'){
      //   this.$api.getDefaultDeptAndGroupRel().then(res => {
      //     if (res.errorcode !== 0) {
      //       return;
      //     }
      //     console.log(res)
      //     this.unitData = res.data.map(item => {
      //       return {
      //         id: item.groupId, // 政务联络网分组Id
      //         groupName: item.groupName, // 政务联络网分组名字
      //         deptId: item.deptId ? item.deptId : '' // 部门ID
      //       }
      //     })
      //   })
      // }
    },
    // 监听电脑上传的文件列表
    pcUploadList: {
      handler: function(newVal, oldVal) {
        let newFileList = [];
        if (newVal.length > 0) {
          newFileList = newVal.map(item => {
            return item.fileOldName; // 文件名字
          })
          this.pcUploadFileNames = newFileList.join(',') // 文件名字
        } else {
          this.pcUploadFileNames = '';
        }
      },
      immediate: true
    },
    // unitData(newVal, oldVal) {
    //   let checkData = oldVal.filter(x =>
    //     newVal.some(y => y.deptId == x.deptId)
    //   ); // 判断之前的deptId集合是否和现在相等
    //   //   不是的话清除名单预览的数据 取消值班员勾选
    //   console.log("checkData: ", checkData);
    //   if (checkData.length != oldVal.length) {
    //     this.noticeList = [];
    //     this.total = 0;
    //     this.beOnDutyState = false;
    //   }
    //   console.log("newVal: ", newVal);
    //   console.log("oldVal: ", oldVal);
    // }
  },
  methods: {
    /**
     * @createTime 2021-04-27
     * @author husiyue
     * @Description 获取单位和值班部门绑定数据
     */
    async getHistoryUnitData() {
      // this.$api.getDefaultDeptAndGroupRel()
      axios({ //备忘录，查找表格
        url: window.SITE_CONFIG['event'] + '/app/sjs/affairs/getDefaultDeptAndGroupRel',
        method: 'post',
      })
      .then(res => {
        if (res.errorcode !== 0) {
          return;
        }
        console.log(this.unitData)
        this.unitData.forEach(item => {
          res.data.forEach((ele,ind) =>{
            console.log(ele.groupId==item.id)
            if(ele.groupId == item.id && item.deptId == ''){
              item.deptId = ele.deptId
            }
          })
        })
        this.relation.forEach(item => {
          res.data.forEach((ele,ind) =>{
            console.log(ele.groupId==item.groupId)
            if(ele.groupId == item.groupId && item.deptId == ''){
              item.deptId = ele.deptId
            }
          })
        })
        console.log(this.unitData,this.relation)
      })
    },
    /**
     * @createTime 2021-04-18
     * @author hexinting
     * @Description 显示选择单位弹窗
     */
    showUnitDialog() {
      this.unitDialogVisible = true; // 显示选择单位弹窗
      this.getAllUnits(); // 获取政务联络网分组
    },

    /**
     * @createTime 2021-04-18
     * @author hexinting
     * @Description 关闭选择单位弹窗
     */
    closeUnitDialog() {
      this.unitDialogVisible = false; // 关闭弹窗
    },

    /**
     * @param {Object} units 政务联络网与部门的关联关系 units = [{deptId: '', id: ''}] (deptId:部门ID， id:政务联络网ID)（单位——部门关联弹窗确定按钮触发）
     * @createTime 2021-04-18
     * @author hexinting
     * @Description 全选或取消全选岗位
     */
    udpateUnitData(units) {
      // unitData: 政务联络网和部门的关联关系
      // 如果编辑了政务联络网分组和部门的关联关系，则更新unitData里的deptId
      this.unitData.forEach(item => {
        units.forEach(el => {
          // id || groupId 政务联络网分组ID
          if (item.id == el.groupId) {
            item.deptId = el.deptId ? el.deptId : ''; // deptId:部门ID
          }
        })
      })
      
      this.relation = units; // 政务联络网与部门的关联关系
      console.log(this.relation)
      this.handleSelectPeople()// 更新名单预览表格信息
      // if(title === '修改工作安排'){

      // }else{
      //   this.$api.getDefaultDeptAndGroupRel().then(res => {
      //     if (res.errorcode !== 0) {
      //       return;
      //     }
      //     console.log(res)
      //   })
      // }
    },

    /**
     * @param {Boolean} val true(全选) || false(取消全选)
     * @return {type} undefined
     * @createTime 2021-04-16
     * @author hexinting
     * @Description 全选或取消全选岗位
     */
    selectAllPosition(val) {
      if (val) {
        // 全选岗位
        this.selectedPosition = this.selectPositionList.map(item => {
          return item.id
        }) // 获取已勾选的岗位
        // this.selectPeople = [];  // 岗位和值班员只能二选一。选了岗位，值班员勾选框要清空。选了值班员，则岗位勾选框要清空
      } else {
        this.selectedPosition = []; // 取消全选，清空已勾选的岗位
      }
      // this.handleChangePosition()
      this.positionOrDuty()
    },

    /**
     * @param {type} 
     * @return {type} undefined
     * @createTime 2021-04-16
     * @author hexinting
     * @Description 新增/编辑工作安排——“负责人”项——选择岗位时触发
     */
    async handleChangePosition() {
      // this.selectPeople = []; // 岗位和值班员只能二选一。选了岗位，值班员勾选框要清空。选了值班员，则岗位勾选框要清空
      this.isSelectAllPosition =
      this.selectedPosition.length === this.selectPositionList.length;
      // this.isPositionIndeterminate =
      //   this.noticePosition.length > 0 &&
      //   this.noticePosition.length < this.notificePositionArr.length;
      if (!this.isSelectAllPosition && this.selectedPosition.length == 0) {
        this.showSelectedPosition = [];
        this.noticeList = this.showSelectPeople.concat(this.showSelectedPosition);
        return;
      }
      console.log(this.unitData.map(item => {return item.id}))
      let data = {
        page: 1,
        size: 5,
        position: this.selectedPosition,
        isPage: true,
        groupIds: this.unitData.map(item => {return item.id})
      };
      let res = await this.$api.getPositionPeople(data);

      console.log("res: ", res);
      this.showSelectedPosition = res.data.data
      this.positionOrDuty(res);
    },

    /**
     * @param {type} 
     * @return {type} undefined
     * @createTime 2021-04-16
     * @author hexinting
     * @Description 点击岗位树的节点
     */
    confirmUnit() {
      this.workForm.unitNames = []; // 初始化——政务联络网分组名字
      let unitNames = []; // 分组名字
      let newUnits = []; // 新政务联络网分组名字
      this.unitTag = []; // 政务联络网tag数据
      let checkedNodes = this.$refs.departmentTree.getCheckedNodes(); // 已勾选政务联络网分组名字
      console.log('已选单位：', checkedNodes)
      this.hasCheckedNodes = this.$refs.departmentTree.getCheckedNodes();// 已勾选单位
      this.checkFlag = 1 
      // 将新编辑的政务联络网分组
      checkedNodes.forEach((item) => {
        // newUnits的对象键名要和unitData的一致
        newUnits.push({
          id: item.id, // 政务联络网分组Id
          groupName: item.name, // 政务联络网分组名字
          deptId: '' // 部门ID
        })
        this.unitTag.push({
          id: item.id,
          name: item.name
        })
      })

      console.log(newUnits,this.unitData)
      // 通过分组ID 判断是否更新已绑定部门
      newUnits.forEach(item => {
        this.unitData.forEach(el => {
          if (item.id === el.id) {
            item.deptId = el.deptId;
          }
        })
        unitNames.push(item.groupName) // 政务联络网分组名字
      })
      this.unitData = newUnits; // 将新编辑的政务联络网分组 赋值 unitData在单位——部门弹窗使用
      // if(this.title != '修改工作安排') {
        this.getHistoryUnitData()
      // }
      this.relation = []; // 关联关系——接口传参使用
      
      this.relation = this.unitData.map(item => {
        return {
          groupId: item.id, // 政务联络网分组Id
          deptId: item.deptId // 部门ID
        }
      })
      
      this.workForm.unitNames = unitNames.join(','); // 政务联络网分组名字
      this.unitDialogVisible = false; // 隐藏弹窗
      // this.handleChangePosition()
      // this.handleSelectPeople()
      this.positionOrDuty()
    },
    /**
     * @createTime 2021-04-16
     * @author hexinting
     * @param {Object} 树节点
     * @return {type} undefined
     * @Description 点击岗位树的节点
     */
    departmentClick(data) {
      console.log(data)
    },

    /**
     * @createTime 2021-04-16
     * @author hexinting
     * @param {Object} 树节点
     * @return {type} undefined
     * @Description 勾选值班员
     */
    async handleSelectPeople() {
      // console.log(e)
      // this.selectedPosition = []; // 岗位和值班员只能二选一。选了岗位，值班员勾选框要清空。选了值班员，则岗位勾选框要清空
      // this.isSelectAllPosition = false; // 岗位取消全选
      let noticeDutyOfficer = this.unitData.filter(v => v.deptId);
      if (this.selectPeople.length == 0 || noticeDutyOfficer.length == 0) {
        // this.noticeList = [];
        this.showSelectPeople = []
        this.noticeList = this.showSelectPeople.concat(this.showSelectedPosition);
        return;
      }
      let data = {
        date: this.formatDate(),
        deptIdList: noticeDutyOfficer.map(v => {
          return v.deptId;
        }),
        page: 1,
        size: 5,
        isPage: true
      };
      // let res = await this.$api.getDutyPeople(data);
      // this.showSelectPeople = res.data.data
      // this.positionOrDuty(res);
    },
    /**
     * @description: 岗位和部门数据请求成功后赋值操作
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/23
     * @param {*}
     * @return {*}
     */
    async positionOrDuty() {
      console.log(this.selectedPosition)
      let noticeDutyOfficer = [];
      let noticeDutyOfficerIds = [];

      // 岗位 全选的状态变化
      if (this.selectedPosition.length === this.selectPositionList.length) {
        this.isSelectAllPosition = true;
      }
      if (this.selectPeople.length > 0 || this.selectedPosition.length > 0) {
        noticeDutyOfficer = this.unitData.filter(v => v.deptId); // 获取所有部门Id存在的对象数组
        noticeDutyOfficerIds = noticeDutyOfficer.map(v => {
          return v.deptId;
        }); // 获取所有部门Id
      }
      
      if(this.selectPeople.length == 0){
        noticeDutyOfficerIds = [];
      }
      // 没有选择负责人
      if (this.selectPeople.length == 0 && this.selectedPosition.length == 0) {
        // this.showSelectPeople = []
        this.noticeList = [];
        return;
      }
      let data = {
        date: this.formatDate(),
        deptIdList: noticeDutyOfficerIds,
        posts: this.selectedPosition,
        groupIds: this.unitData.map(item => {return item.id}),
        module: 'affairs',
      };
      // let res = await this.$api.getDutyAndPosition(data);
      let res = await axios({ //备忘录，查找表格
          url: window.SITE_CONFIG['event'] + '/app/sjs/affairs/getAllContactor',
          method: 'post',
          data
        })
      console.log("res: ", res);
      if(res.errorcode == 500){
        this.noticeList = []
        return;
      }
      if (res.errorcode != 0) {
        this.$message({
          message: res.msg,
          type: "error"
        });
        return;
      }
      if (res.data != '暂无数据') {
        this.noticeList = res.data;
      } else {
        this.noticeList = [];
      }
    },
    /**
     * @description: 单位或者部门数据请求成功后赋值操作
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/23
     * @param {*}
     * @return {*}
     */
    // positionOrDuty(res) {
    //   if (res.errorcode != 0) {
    //     this.$message({
    //       message: res.msg,
    //       type: "error"
    //     });
    //     return;
    //   }
    //   if (res.data) {
    //     //   判断是否是下发时不分页的数据 分开存储 避免下发通知后表格数据显示不分页的数据 和总数
    //     // if (!this.isPage) {
    //     //   this.saveNoticeList = res.data;
    //     // } else {
    //       this.total = res.data.totalElements;
    //       this.noticeList = this.showSelectPeople.concat(this.showSelectedPosition);
    //     // }
    //   } else {
    //     // if (!this.isPage) {
    //     //   this.saveNoticeList = [];
    //     // } else {
    //       // this.noticeList = [];
    //       this.showSelectPeople = [];
    //       this.total = 0;
    //     // }
    //   }
    // },
    /**
     * @createTime 2021-04-09
     * @author qinjiaqi
     * @param {Object} 树节点
     * @return {type} undefined
     * @Description 显示选择单位和部门关联的弹窗
     */
    showSelectUnitDialog() {
      this.selectUnitVisible = true;
    },

    /**
     * @createTime 2021-04-16
     * @author hexinting
     * @return {type} undefined
     * @Description 获取政务联络网分组
     */
    getAllUnits() {
      // this.$api.phoneGroupList({})
      axios({ //备忘录，查找表格
        url: window.SITE_CONFIG['baseUrl'] + '/mail/mailgroup/list',
        method: 'get',
        params: {}
      })
      .then(res => {
        if (res.errorcode == "0") {
          this.unitsData = res.data; // 政务联络网分组 选择单位弹窗使用
        }
      });
      console.log(this.hasCheckedNodes)
      console.log(this.defaultCheckedDepartment)
      // 判断是否第一次点击选择单位，若不是，则勾选之后修改的单位 bug11452 author：husiyue date：2021.4.20
      if(this.checkFlag){
        this.defaultCheckedDepartment = this.hasCheckedNodes.map(item => {
          return item.id;
        })
        this.$refs.departmentTree.setCheckedKeys(this.defaultCheckedDepartment);
      }

    },
    
    /**
     * @author hexinting
     * @lastUpdateTime : 2021/4/16
     * @param {*}
     * @return {*}
     * @Description 单位绑定部门弹窗
     */
    handleClose() {
      this.selectUnitVisible = false;
    },
    /**
     * @author husiyue
     * @lastUpdateTime : 2021/4/26
     * @param {*}
     * @return {*}
     * @Description 单位tag删除
     */
    handleCloseTag(tag, i) {
      console.log(tag, i)
      console.log(this.unitData)
      // 当前删除tag的数组下标
      let index = this.unitData.findIndex((ele)=>{
        return ele.id === tag.id
      })
      // 如果删除的tag存在选中的政务联络网关系数组中，则删除
      if(index != -1){
        this.unitData.splice(index,1)
        console.log(this.unitData)
        this.relation = this.unitData.map(item => {
          return {
            groupId: item.id, // 政务联络网分组Id
            deptId: item.deptId // 部门ID
          }
        })
        console.log(this.relation)
        // 删除tag
        this.unitTag.splice(index,1)
        // 第一次点开选择单位弹窗，使用defaultCheckedDepartment渲染树
        console.log(this.defaultCheckedDepartment)
        let defaultCheckeIndex = this.defaultCheckedDepartment.findIndex((ele)=>{
          return ele === tag.id
        })
        if(defaultCheckeIndex != -1){
          this.defaultCheckedDepartment.splice(defaultCheckeIndex,1)
        }
        // 不是第一次点开选择单位弹窗，使用hasCheckedNodes渲染树
        console.log(this.hasCheckedNodes)
        let hasCheckedNodesIndex = this.hasCheckedNodes.findIndex((ele)=>{
          return ele.id === tag.id
        })
        if(hasCheckedNodesIndex != -1){
          this.hasCheckedNodes.splice(hasCheckedNodesIndex,1)
        }
        this.positionOrDuty()
        // this.defaultCheckedDepartment = this.unitTag.map(item => {
        //   return item.id;
        // })
        // this.hasCheckedNodes = this.unitTag.map(item => {
        //   return item.id;
        // })
        // console.log(this.hasCheckedNodes)
        // this.$refs.departmentTree.setCheckedKeys(this.hasCheckedNodes);
      }
      // unitTag
    },
    /**
     * @createTime 2021-04-12
     * @author hexinting
     * @param {String} fileLists 已选中文件 = 已选系统文件 + 已选电脑文件
     * @return {type} undefined
     * @Description 更新附件信息
     */
    updateFileLists(fileLists) {
      this.fileList = []; // 已选电脑文件列表
      this.selectSystemUpload = []; // 传真模板勾选项
      this.selectedFileLists = []; // 已选中文件 = 已选系统文件 + 已选电脑文件
      this.workForm.appSjsAffairsFiles = fileLists;
      this.selectedFileLists = fileLists; // 已选中文件 = 已选系统文件 + 已选电脑文件
      this.systemUploadList = this.selectedFileLists.filter(item => item.faxTempId); // 系统文件
      this.pcUploadList = this.selectedFileLists.filter(item => !item.faxTempId); // 电脑文件
      this.fileList = this.pcUploadList.map( t => {
        return {
          name: t.fileOldName,
          id: t.id,
        }
      }) // 已选电脑文件列表
      this.selectSystemUpload = this.systemUploadList.map((el) => {
        return parseInt(el.faxTempId)
      }); // 传真模板勾选项
    },

    /**
     * @createTime 2021-04-12
     * @author hexinting
     * @param {String} fileUrl 文件路径
     * @return {type} undefined
     * @Description 接口删除文件
     */
    deleteFaxTempFile(fileUrl) {
      let params = {
        filePath: fileUrl
      }
      // this.$api.deleteFaxTempFile(data)
      axios({ //备忘录，查找表格
        url: window.SITE_CONFIG['event'] + '/app/sjs/affairs/deleteFaxTempFile',
        method: 'get',
        params
      })
      .then(res => {
        if (res.errorcode !== 0) {
          this.$message({
            message: res.msg,
            type: 'error'
          })
          return;
        }
        this.selectedFileLists.splice(index, 1);
        this.updateFileLists(this.selectedFileLists); // 更新附件信息
      })
    },

    /**
     * @createTime 2021-04-12
     * @author hexinting
     * @param {String} url 文件路径
     * @return {type} undefined
     * @Description 删除文件
     */
    deleteFile(item, index) {
      this.selectedFileLists.splice(index, 1); // 将文件删除
      this.updateFileLists(this.selectedFileLists); // 更新附件信息

      // 接口删除文件，暂不使用
      // this.deleteFaxTempFile(item.fileUrl);
    },

    /**
     * @createTime 2021-04-12
     * @author hexinting
     * @param {type} 没有
     * @return {type} undefined
     * @Description 提交岗位
     */
    submitPosition() {
      this.isPositionShow = false; // 岗位弹窗
      this.selectPositionList = Array.from(new Set(this.temCheckedKeys)); // 拷贝
    },

    /**
     * @createTime 2021-04-12
     * @author hexinting
     * @param {type} 没有
     * @return {type} undefined
     * @Description 取消选择岗位
     */
    cancelSubmitPosition() {
      this.isPositionShow = false; // 岗位弹窗
      let defaultCheckedPosition = [];
      defaultCheckedPosition = this.selectPositionList.map(item => {
        return item.id
      }) 
      this.$refs.tree.setCheckedKeys(defaultCheckedPosition); // 恢复上次选择的岗位
    },

    /**
     * @createTime 2021-04-12
     * @author hexinting
     * @param {type} 没有
     * @return {type} undefined
     * @Description 将电脑上传文件和系统文件合并
     */
    mergeFiles() {
      this.selectedFileLists = this.systemUploadList.concat(this.pcUploadList); // 将电脑上传文件和系统文件合并
      this.workForm.appSjsAffairsFiles = []; // 清空工作文件
      this.selectedFileLists.forEach(item => {
        this.workForm.appSjsAffairsFiles.push({
          faxTempId: item.faxTempId ? item.faxTempId : null, // 传真模板ID
          extension: item.extension,  // 文件拓展名
          fileOldName: item.fileOldName, // 文件名
          fileSize: item.fileSize ? item.fileSize : 0, // 文件大小
          fileUrl: item.fileUrl // 文件路径
        });
      })
    },
    /**
     * @createTime 2021-04-12
     * @author hexinting
     * @param {type} 没有
     * @return {type} undefined
     * @Description 点击上传按钮开始上传
     */
    startUpload() {
      this.uploadShow = true
    },

    /**
     * @createTime 2021-04-12
     * @author hexinting
     * @param {type} 没有
     * @return {type} undefined
     * @Description 选中后的传真模板
     */
    handleSelectedFaxTemplateList(val) {
      console.log(val)
    },

    /**
     * @createTime 2021-04-12
     * @author hexinting
     * @param {type} 没有
     * @return {type} undefined
     * @Description 上传文件
     */
    sumbitFileList() {
      console.log('上传的文件：', this.selectSystemUpload)
      if (this.selectSystemUpload.length === 0) {
        this.uploadShow = false; // 隐藏弹窗
        this.mergeFiles(); // 合并文件
        return;
      }

      // 根据传真模板ID获取对应传真文件
      let data = {
        faxTempIds: this.selectSystemUpload // 传真模板ID
      }
      // this.$api.uploadFaxTempToAffairs(data)
      axios({ //备忘录，查找表格
        url: window.SITE_CONFIG['event'] + '/eos/communication/faxTemplate/uploadFaxTempToAffairs',
        method: 'post',
        data
      })
      .then(res => {
        if (res.errorcode !== 0) {
          return;
        }

        let result = res.data ? res.data : []; // 传真模板文件数组
        this.systemUploadList = []; //先清空
        result.forEach(item => {
          this.systemUploadList.push({
            isFaxTemplate: true, // 是否是传真模板
            faxTempId: item.faxTempId ? item.faxTempId : null, // 传真模板ID 电脑上传的文件faxTempId为空
            extension: 'pdf',  // 文件拓展名
            fileOldName: item.fileOldName + item.extension, // 文件名 后端返回的传真模板文件名没有带“.pdf”，前端自行拼接
            fileSize: item.fileSize ? item.fileSize : 0, // 文件大小
            fileUrl: item.fileUrl // 文件路径
          })
        })

        this.uploadShow = false; // 隐藏上传附件弹窗
        this.mergeFiles(); // 合并文件
        console.log('合并文件', this.selectedFileLists)
        console.log('工作文件', this.workForm.appSjsAffairsFiles)
      })
    },

    /**
     * @createTime 2021-04-12
     * @author hexinting
     * @param {type} 没有
     * @return {type} undefined
     * @Description 取消上传
     */
    cancelSubmit() {
      this.uploadShow = false; // 关闭上传附件弹窗
    },

    /**
     * @createTime 2021-04-09
     * @author qinjiaqi
     * @param {type} 没有
     * @return {type} undefined
     * @Description 获取系统上传所有data
     */
    getSystemFileLists(){
      // 获取传真模板列表
      this.$api.getFaxTempList().then(res => {
        if (res.errorcode !== 0) {
          this.systemFileLists = []; // 系统上传列表
          return;
        }
        this.systemFileLists = res.data ? res.data : []; // 系统上传列表
      })
    },

    /**
     * @createTime 2021-04-09
     * @author qinjiaqi
     * @param {type} 没有
     * @return {type} undefined
     * @Description 获取岗位树所有data
     */
    getPositionTree() {
      let data = {};
      let tree = [];
      this.$api.contactorPosition(data).then(res => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error"
          });
          return;
        }
        for (let i = 0; i < res.data.length; i++) {
          tree.push({
            name: res.data[i],
          });
        }
        this.positionTree = tree; // 岗位树
      })
    },

    /**
     * @createTime 2021-04-09
     * @author qinjiaqi
     * @param {Object} 树节点
     * @return {type} undefined
     * @Description 点击岗位树的节点
     */
    positionClick(data) {
      let checkedKeys = this.$refs.tree.getCheckedKeys();
      this.temCheckedKeys = []; // 中间变量 存放已选的岗位
      checkedKeys.forEach(item => {
        this.temCheckedKeys.push({
          name: item
        })
      })
      // console.log(this.temCheckedKeys, this.selectPositionList)
    },

    // 初始化类型列表
    async initTypeData() {
      // let res = await this.$api.affairsTypeList();
      let res = await axios({ //备忘录，查找表格
          url: window.SITE_CONFIG['event'] + '/app/sjs/affairsType/list',
          method: 'get',
        })
      console.log('/app/sjs/affairsType/list', res)
      if (res.errorcode !== 0) {
        this.$message.error(res.msg);
        return;
      }
      this.workOptions = res.data;
    },
    getTimes() {
      //获取现在的时间
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
      clock += mm;
      this.time = clock;
    },
    formatDate() {
      var date = new Date();
      var year = date.getFullYear();
      var month = (date.getMonth() + 1).toString();
      var day = date.getDate().toString();
      if (month.length == 1) {
        month = "0" + month;
      }
      if (day.length == 1) {
        day = "0" + day;
      }
      var dateTime = year + "-" + month + "-" + day;
      return dateTime;
    },
    getWorkType() {
      //获取所有类型
      // this.$api.workType()
      axios({ //备忘录，查找表格
        url: window.SITE_CONFIG['event'] + '/eos/appDutyInformationReleas/detail',
        method: 'post',
      })
      .then(res => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error"
          });
          return;
        }
        this.workOptions = res.data;
      });
    },
    clearContenr() {
      //清空表单内容以及校验信息
      // this.$nextTick(()=>{
      //   this.$refs["workForm"].resetFields();
      //   this.workForm.executeTime = "";
      //   this.workForm.appSjsAffairsFiles = [];
      //   this.workForm.contactorIds = [];
      //   this.vcExtend1 = "";
      //   this.workForm.affairsTypeId = "";
      //   this.fileList = [];
      //   this.affairsId = "";
      //   this.needCall = 1
      //   this.workForm.rightNow = 0
      //   this.workForm.remind = 0
      //   this.workForm.remindInterval = 0
      //   if (this.title == "新增零报告") {
      //     this.workForm.executeTime = this.time;
      //   }
      // })
    },
    closeDialog() {
      this.clearContenr();
      this.isDialogVisible = false;
      this.$emit("closeDialog");
    },
    showData(row) {
      this.clearContenr()
      console.log('行：', row)
      setTimeout(() => {
        this.affairsId = row.id;
        this.originalId = row.affairsTypeId;
        // this.workForm.title = row.title;
        // this.workForm.content = row.content;
        // this.workForm.unit = row.unit;
        // this.workForm.executeTime = row.executeTime;
        // this.workForm.affairsTypeId = row.affairsTypeId;
        // this.workForm.remindInterval = row.remindInterval;
        // this.workForm.rightNow = row.rightNow;
        // this.workForm.remind = row.remind;
        // this.needCall = row.needCall;
        // this.workForm.affairsTypeId = row.affairsTypeId;

        // console.log('this.vcExtend1: ', this.vcExtend1);
        // this.$api.seeAffairsDetail({id:row.id})
        axios({ //备忘录，查找表格
          url: window.SITE_CONFIG['event'] + '/app/sjs/affairs/info',
          method: 'get',
          params: {id:row.id}
        })
        .then(res=>{
          if(res.errorcode!=0){
            this.$message({
              message:res.msg,
              type:"error"
            });
            return
          }
          // this.attList = res.attachment
          // workForm中没有needCall字段，所以直接判断 bug11452 author:husiyue date:2021.4.20
          if (res.data.hasOwnProperty("needCall")) {
            this.needCall = res.data["needCall"]?true:false
          }
          for (const key in this.workForm) {
            if (res.data.hasOwnProperty(key)) {
              if (key=="needCall") {
                this.needCall = res.data[key]?true:false
              }else if (key=="affairsTypeId") {
                this.workForm.affairsTypeId = res.data[key] == 0?"":res.data[key]
              } else if (key === 'unitNames') {
                this.workForm.unitNames = res.data.appRollCallOnDuties.map(item => {
                  return item.groupName
                })

              } else {
                this.workForm[key] = res.data[key];
              }
            }
          }
          this.workForm.contactorIds = []
          this.dataName = []
          if(res.data.appSjsAffairsContacotrVos.length>0){
            // 传回来联系人类型和本地存储类型不匹配要做转换
            for(var i=0; i<res.data.appSjsAffairsContacotrVos.length ; i++) {
              this.dataName.push(
                {
                  id: res.data.appSjsAffairsContacotrVos[i].appContactorId,
                  name:res.data.appSjsAffairsContacotrVos[i].appContactorName,
                  position: res.data.appSjsAffairsContacotrVos[i].appContactorPosition ? res.data.appSjsAffairsContacotrVos[i].appContactorPosition : '无',
                  workUnit: res.data.appSjsAffairsContacotrVos[i].appContactorWorkUnit ? res.data.appSjsAffairsContacotrVos[i].appContactorWorkUnit : '无',
                  mobile: res.data.appSjsAffairsContacotrVos[i].appContactorNumber,
                }
              )
            }
            res.data.appSjsAffairsContacotrVos.map( t => {
              this.workForm.contactorIds.push(t.appContactorId)
              this.workForm.vcExtend1 += t.appContactorName + '，'
            })
            this.workForm.vcExtend1 = this.workForm.vcExtend1.substring(0,this.workForm.vcExtend1.length-1)
          }
          // 附件
          if (res.data.appSjsAffairsFiles.length > 0) {
            this.updateFileLists(res.data.appSjsAffairsFiles);
          }
          // 值班员
          if (res.data.appRollCallOnDuties.length > 0) {
            // 政务联络网和部门的关联关系
            this.relation = res.data.appRollCallOnDuties.map(item => {
              return {
                groupId: item.groupId,
                deptId: item.deptId,
              }
            })

            // 政务联络网和部门的关联关系
            this.unitData = res.data.appRollCallOnDuties.map(item => {
              return {
                id: item.groupId, // 政务联络网分组Id
                groupName: item.groupName, // 政务联络网分组名字
                deptId: item.deptId ? item.deptId : '' // 部门ID
              }
            })
            
            // 政务联络网分组名字
            let unitNames = res.data.appRollCallOnDuties.map(item => {
              return item.groupName;
            })
            this.workForm.unitNames = unitNames.join(','); // 政务联络网分组名字
            this.unitTag = res.data.appRollCallOnDuties.map(item => {
              return {
                id: item.groupId,
                name:item.groupName};
            })
            console.log(this.unitTag)

            // 选择单位弹窗 —— 默认勾选单位
            console.log(res.data.appRollCallOnDuties.map(item => {return item.groupId;}))
            this.defaultCheckedDepartment = res.data.appRollCallOnDuties.map(item => {
              return item.groupId;
            })
            // 若appRollCallOnDuties中 政务联络网分组都没有关联部门，则不勾选值班员。反之，则勾选。
            if (res.data.appRollCallOnDuties.filter(item => item.deptId).length > 0) {
              this.selectPeople = ['值班员'] // 勾选值班员
              if(this.title == "修改工作安排") {
                // this.handleSelectPeople()
                this.positionOrDuty()
              }
            } else {
              this.selectPeople = [] // 不勾选值班员
              // 修改安排时，如果重新选择了值班员，且单位和值班部门都没有关联，填入存储数据
              if(this.relation.filter(item => item.deptId).length > 0) {
                console.log("已选过关联")
              }else{
                this.getHistoryUnitData()
              }
            }
          } 

          // 岗位
          if(res.data.positions.length > 0) {
            this.selectedPosition = res.data.positions.map(item => {
              // return item.vcPosition;
              return item.iPositionId;
            })
            this.defaultCheckedPosition = this.selectedPosition;
            // this.defaultPositions = res.data.positions.map(item => {
            //   return {
            //     name: item.vcPosition
            //   };
            // })
            res.data.positions.forEach(el => {
              let _index = this.selectPositionList.findIndex(item => item.name == el.vcPosition); // 索引 数组去重
              if (_index == -1) {
                this.selectPositionList.push({
                  name: el.vcPosition
                })
              }
            })
            // 全选
            if (this.selectedPosition.length === this.selectPositionList.length) {
              this.isSelectAllPosition = true;
            }
            // this.handleChangePosition()
            this.positionOrDuty()
          }
        })
      }, 100);
      // this.getAtt(row.id);
    },
    //从文件列表删除文件
    handleRemoveFile(file, fileList) {
      //uid是刚上传的,id和releaseId是旧的
      let index = this.workForm.appSjsAffairsFiles.findIndex(
        t =>
          t.uid === file.uid ||
          (t.id === file.id && t.releaseId === file.releaseId)
      );
      this.workForm.appSjsAffairsFiles.splice(index, 1);
      this.pcUploadList.splice(index, 1); // 把名字移出输入框
    },
    /**
     * @editorName hexinting
     * @editorDate 2021-04-19
     * @description 上传文件
     */
    handleUploadFile(response, file, fileList) {
      console.log(response);
      // 新版上传附件
      this.pcUploadList.push({
        faxTempId: null, // 传真模板ID
        extension: response.data.extension,  // 文件拓展名
        fileOldName: response.data.fileOldName, // 文件名
        fileSize: response.data.fileSize ? response.data.fileSize : 0, // 文件大小
        fileUrl: response.data.fileUrl // 文件路径
      })
      // let path = response.slice(5, response.length - 1);
      // let filename = response.slice(
      //   response.lastIndexOf("/") + 1,
      //   response.length - 1
      // );
      // let extension = response.slice(
      //   response.lastIndexOf(".") + 1,
      //   response.length - 1
      // );
      // let title = file.name.slice(0, file.name.lastIndexOf("."));
      // 注释原因：旧版本上传文件
      // this.workForm.appSjsAffairsFiles.push({
      //   extension: response.data.extension,
      //   fileOldName: response.data.fileOldName,
      //   fileSize: response.data.fileSize,
      //   fileUrl: response.data.fileUrl
      // });
    },
    submit: debounce(function (issue) {
      this.hasCheckedNodes = [] // 清空上次选择单位的数据
      this.checkFlag = 0 // 重置选择单位
      console.log(this.workForm.appSjsAffairsFiles)
      //operate	操作类型 0->新增 1-> 更新 2->删除
      this.$refs.workForm.validate(valid => {
        if (!valid) return;
        // bug10761 后端接收空时会报错，因此需要把数据改为null date:2021.3.10 author:husiyue
        if(this.workForm.vcExtend1 == ''){
          this.workForm.vcExtend1 = null
        }
        if(this.workForm.executeTime == ''){
          this.workForm.executeTime = null
        }
        if(this.workForm.content == ''){
          this.workForm.content = null
        }
        this.workForm.contactorIds = []; // 新版工作安排，新版不需要这个参数了，将contactorIds改为[]，否则后端会报错
        // 如果勾选了岗位，则relations的deptId要置空，将政务联络网分组和部门关联关系解绑
        // if (this.selectPeople.length === 0) {
        //   this.relation = this.relation.map(item => {
        //     return {
        //       groupId: item.groupId,
        //       deptId: ''
        //     }
        //   })
        // }
        // 保存并下发时一定要选择岗位和单位
        if(issue) {
          let hasDeptId = false
          if(this.workForm.unitNames == "" || this.selectPeople.length === 0 && this.selectedPosition.length === 0 ) {
            this.$message.warning("请选择单位和负责人");
            return;
          }
          console.log(this.relation.length)
          // 选择值班员时判断选择值班员中值班部门是否选择完整
          if(this.selectPeople.length > 0 && this.relation.length > 0){
            this.relation.forEach((ele,ind) =>{
              if(ele.deptId == null || ele.deptId == '' || ele.deptId == 'NaN'||isNaN(ele.deptId)){
                hasDeptId = true
              }
              if(this.relation.length == ind+1){
                if(hasDeptId){
                  this.$message.warning('请为值班员选择值班部门')
                }
              }
            })
            if(hasDeptId) return;
          }
        }
        // console.log(this.$refs)
        // this.$refs.selectUnit.saveDepartment()
        console.log(this.selectPeople)
        let data = {
          data: {
            ...this.workForm,
            id: this.affairsId || undefined,
            needCall:this.needCall?1:0,
          },
          // positions: this.selectPeople.length === 0 ? this.selectedPosition : [], // 职位
          positions: this.selectedPosition, // 职位
          relation: this.relation, // 政务联络网分组和部门关联关系,没有选择值班员时清空关系
          hasContactor: issue?true:false,// 下发时需要判断岗位和单位中是否有联系人
          posts: this.selectedPosition,
          hasDuty: this.selectPeople.length > 0? true:false,// 是否勾选了值班员
        };
        // this.$api.addAffairs(data)
        axios({ //备忘录，查找表格
          url: window.SITE_CONFIG['event'] + '/app/sjs/affairs/saveOrUpdate',
          method: 'post',
          data
        })
        .then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          if(!issue){
            this.$message({
              message: "保存成功!",
              type: "success"
            });
            this.isDialogVisible = false;
            this.$emit("getTableData");
          }

          if(issue){
            let data2 = {
              id: res.data.id
            }
            // this.$api.issue({ data:data2 })
            axios({ //备忘录，查找表格
              url: window.SITE_CONFIG['event'] + '/app/sjs/affairs/send',
              method: 'post',
              data: data2,
            })
            .then(res => {
              if (res.errorcode != 0) {
                this.$message({
                  message: res.msg,
                  type: "error"
                });
                return;
              }
              this.$message({
                message: "保存并下发成功!",
                type: "success"
              });
              this.isDialogVisible = false;
              this.$emit("getTableData");
            });
          }

          //this.isDialogVisible = false;
          //this.$emit("getTableData");
        });
      });
    },500),
    // getAtt(id) {
    //   //获取附件数量
    //   this.$api.appDutyInformationReleasDetail({ id }).then(res => {
    //     if (res.errorcode != 0) {
    //       this.$message({
    //         message: res.msg,
    //         type: "error"
    //       });
    //       return;
    //     }
    //     this.att = res.attachment;
    //     console.log(this.att);
    //     this.fileList = res.attachment.map(t => {
    //       return {
    //         name: t.title + "." + t.extension,
    //         id: t.id,
    //         releaseId: t.releaseId
    //       };
    //     });
    //   });
    // },
   /** 
    * @editorName hexinting 
    * @editorDate 2021-03-19
    * @param {file} 上传的文件名
    * @return {type} undefined
    * @description 上传类型和上传大小校验
    */
    beforeFileUpload(file) {
        // 上传校验
        // if (this.allowType.indexOf(file.type) === -1){
        //     this.$message({
        //         message:'不允许上传该类型文件',
        //         type:"error"
        //     });
        //     return false
        // }
        let extension = file.name.substring(file.name.lastIndexOf('.') + 1) //获取文件扩展名
        const exdoc = extension === 'doc' 
        const exdocx = extension === 'docx'
        const exxls = extension === 'xls'
        const exxlsx = extension === 'xlsx'
        const expng = extension === 'png'
        const exjpg = extension === 'jpg'
        const exgif = extension === 'gif'
        const exjpeg = extension === 'jpeg'
        const expdf = extension === 'pdf'
        const extxt = extension === 'txt'
        const exzip = extension === "zip";
        const exrar = extension === "rar";
        if(!exdoc && !exdocx && !exxls && !exxlsx && !expng && !exjpg && !exgif && !exjpeg && !expdf && !extxt && !exzip && !exrar) {
            this.$message({
                message:'不允许上传该类型文件',
                type:"error"
            });
            return false;
        }       
        if (file.size > 50*1024*1024){
            this.$message({
                message:'不允许上传超过50m的文件',
                type:"error"
            });
            return false;
        }
    },

    change(checkboxGroup, checkboxData) {
      // console.log('checkboxData: ', checkboxData);
      this.workForm.vcExtend1 = ""
      this.outerVisible = false
      this.workForm.contactorIds = checkboxGroup;
      checkboxData.map(v=> {
        this.workForm.vcExtend1 += v.name +"，"
      })
      this.workForm.vcExtend1 = this.workForm.vcExtend1.substring(0,this.workForm.vcExtend1.length-1)
      // console.log('this.vcExtend1: ', this.vcExtend1);
    },
    addPerson() {
      this.$store.commit("setSmsOrFax", "sms");
      if(this.title != '新增零报告') {
        this.$nextTick(() => {
          this.$refs.addContact.dialogFormVisible = true
        })
        this.outerVisible = true;
        this.searchText = "";
        this.mans = "";
        // 白天
        if(this.workForm.executeTime) {
          //只有五点是要区分五点半以前和五点半以后
          if(
            ( ((this.workForm.executeTime).split(' '))[1].split(':')[0] >= 9 
            && ((this.workForm.executeTime).split(' '))[1].split(':')[0] < 17 )
            ||
            ( ((this.workForm.executeTime).split(' '))[1].split(':')[0] >= 9 
            && ((this.workForm.executeTime).split(' '))[1].split(':')[0] == 17 &&
            ((this.workForm.executeTime).split(' '))[1].split(':')[1] <= 30 )
          ) {
            this.$nextTick(() => {
              this.$refs.addContact.dateValue = ((this.workForm.executeTime).split(' '))[0]
              this.$refs.addContact.activeAllModel = "2"
              this.$refs.addContact.getDataList('ReportOrWork', this.dataName)
              this.$refs.addContact.changePage()
            })
          } else {// 晚上
            this.$nextTick(() => {
              this.$refs.addContact.dateValue = ((this.workForm.executeTime).split(' '))[0]
              this.$refs.addContact.activeAllModel = "1"
              this.$refs.addContact.getDataList('ReportOrWork', this.dataName)
              this.$refs.addContact.changePage()
            })
          }
        } else {
          this.$nextTick(() => {
            this.$refs.addContact.dateValue = ''
            this.$refs.addContact.activeAllModel = "3"
            this.$refs.addContact.getDataList('ReportOrWork', this.dataName)
            this.$refs.addContact.changePage()
          })
        }
      } else {
        this.outerVisible = true;
        // console.log('this.workForm.contactorIds: ', this.workForm.contactorIds);
        this.$refs.selectDialog.checkboxGroup = this.workForm.contactorIds
        this.searchText = "";
        this.mans = "";
      }
    },
    /**
     * @lastDate 2020-12-31
     * @lastAuthor husiyue
     * @param typeTips 修改工作安排状态 0:弹窗选择不覆盖原标题和内容；1:是否第一次触发下拉框（1为是）；2:弹窗选择覆盖原标题和内容
     * @descripttion 修改工作安排时，第一次下拉框选择类型后触发弹出标题、内容覆盖提示弹窗
    */
    affairsType(id) {
        // 修改前原类型的数据
        let OriginalTypeData = this.workOptions.find(v => v.id == this.originalId);
        // 下拉框选择类型后，当前选择类型的数据
        let currentTypeData = this.workOptions.find(v => v.id == id);
        // 判断是否为修改弹窗，且是否第一次修改
        if(this.title == "修改工作安排" && this.typeTips == 1){
          // 如果修改前标题和内容与类型的默认标题内容不一致，弹出提示
          if(this.workForm.title !== OriginalTypeData.title || this.workForm.content !== OriginalTypeData.content){
            this.$confirm("是否将现选类型的初始化标题和内容覆盖原标题和内容", "是否修改标题和内容?", {
            confirmButtonText: "是",
            cancelButtonText: "否",
            type: "warning",
          }).then(()=>{// 选择覆盖原标题和内容，把类型的默认标题和内容覆盖原标题内容
            this.workForm.title = currentTypeData.title;
            this.workForm.content = currentTypeData.content;
            this.typeTips = 2
          }).catch(()=>{ // 选择不覆盖原内容，之后修改只修改类型，不再提示修改覆盖
            this.typeTips = 0
          })
          }else{// 如果修改前标题和内容与类型的默认标题内容一致，直接修改标题和内容，无需弹出提示
            this.workForm.title = currentTypeData.title;
            this.workForm.content = currentTypeData.content;
            this.typeTips = 2 // 覆盖原内容
          }
        }else if(this.title == "新增工作安排"){
          this.workForm.title = currentTypeData.title;
          this.workForm.content = currentTypeData.content;
        }
        // 弹框选择覆盖原内容后，每次选择类型后，标题和内容直接修改为默认标题和内容，不再提示；
        if(this.typeTips == 2){
          this.workForm.title = currentTypeData.title;
          this.workForm.content = currentTypeData.content;
        }
    },
    /**
     * @description: 获取所有岗位下拉数据
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/26
     * @param {*}
     * @return {*}
     */
    postData() {
      let data = {};
      // this.$api.getPostData(data)
      axios({ //备忘录，查找表格
        url: window.SITE_CONFIG['event'] + '/app/sjs/affairs/getAllPost',
        method: 'post',
        data
      })
      .then(res => {
        console.log(res);
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error"
          });
          return;
        }
        this.selectPositionList = res.data;
        this.defaultCheckedPosition = res.data
      });
    },
    },
    
};
</script>

<style scoped lang="scss">
/deep/ .ReportOrWork .el-dialog__header {
  background-color: #f1f4f6;
  border-radius: 5px 5px 0px 0px;
  padding: 10px 0 10px 20px;
  text-align: left;
}
/deep/ .ReportOrWork .el-dialog__title {
  color: #333;
  font-size: 15px;
}
/deep/ .ReportOrWork .el-dialog__headerbtn {
  top: 12px;
  font-size: 20px;
}
/deep/ .ReportOrWork .el-dialog__headerbtn .el-dialog__close {
  color: #adb6c2;
}
/deep/ .ReportOrWork .el-dialog__body {
  padding: 0;
}

/deep/ .el-form-item {
  margin-bottom: 20px;
}

// 单选框样式更改
/deep/ .el-radio__inner {
  border-radius: initial;
}
/deep/ .el-radio__input.is-checked .el-radio__inner::after {
  width: 3px;
  height: 7px;
  border: 1px solid #fff;
  border-left: 0;
  border-top: 0;
  left: 4px;
  top: 1px;
  transition: transform 0.15s ease-in 0.05s;
  transform-origin: center;
  transform: rotate(45deg) !important;
  background-color: initial;
  border-radius: initial;
}
/* 其他附件样式 */
.file_list {
  display: flex;
  flex-direction: column;
  padding-left: 10px;
  max-height: 150px;
  overflow-y: scroll;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  background: #f6fcff;
  margin-top: 10px;
}
.file_item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 30px;
  line-height: 30px;
  margin-bottom: 4px;
  cursor: pointer;
}
.file_name:hover {
  font-weight: 400;
  color: #0091ff;
  cursor: pointer;
}
.file_name {
  font-size: 14px;
  min-width: 206px;
  text-overflow: ellipsis;
  text-align: left;
  padding-left: 4px;
  margin-right: 20px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.upload_success_icon {
  width: 20px;
  height: 20px;
  display: block;
  background: url('../../../../static/img/icon/tick.png');
  background-position: 50%;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.upload_success_icon:hover {
  width: 20px;
  height: 20px;
  display: block;
  background: url('../../../../static/img/close.png');
  background-position: 50%;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.unitNames >>> .el-input-group__append {
  background: transparent;
  padding: 0 24px;
  color: #409EFF;
}
.unitNames >>> .el-input .el-input__inner {
  border-right: 1px solid transparent;
}
.unitNames.is-error >>> .el-input__inner {
  border-right: 1px solid #F56C6C;
}
.reportOrWorkContainer .dialog-footer {
  padding-top: 15px;
  border-top: 1px solid #F1F4F6;
  text-align: right;
}
.workPreview >>> .el-table th {
  padding: 0;
}
</style>
