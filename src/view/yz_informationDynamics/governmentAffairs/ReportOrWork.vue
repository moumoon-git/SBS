<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="isDialogVisible"
      @close="closeDialog"
      width="700px"
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
                <el-form-item prop="affairsTypeId" label="类型选择">
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
              <el-row v-else-if="title === '修改工作安排' && workForm.affairsTypeId !== null">
                <el-form-item prop="affairsTypeId" label="类型选择">
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
                <el-form-item prop="title" label="标题">
                  <el-col :span="23">
                    <el-input v-model="workForm.title" placeholder="长度限100字符以内"></el-input>
                  </el-col>
                </el-form-item>
              </el-row>
              <el-row v-show="title !== '添加附件'">
                <el-form-item prop="content" label="内容">
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
              <el-row>
                <el-col :span="12">
                  <el-form-item prop="vcExtend1" :label="(title=='新增零报告'?'报告':'责任')+'人'">
                    <el-input
                      v-model="workForm.vcExtend1"
                      placeholder="长度限100字符以内"
                      maxlength="100"
                      @focus="addPerson"
                    ></el-input>
                    <!-- 选择人员弹窗 -->
                    <selectMansDialog
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
                  <el-form-item prop="executeTime" :label="(title=='新增零报告'?'报告':'执行')+'时间'">
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
              </el-row>
              <el-row v-show="title != '新增零报告'">
                <el-form-item label="附件:" style="text-align: left;">
                  <el-upload
                    class="upload-demo"
                    accept=".doc, .docx, .xls, .xlsx, .png, .jpg, .gif, .jpeg, .pdf, .txt"
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
                      >限doc,docx,xls,xlsx,png,jpg,gif,jpeg,pdf,txt，且不超过50mb</div>
                    </div>
                  </el-upload>
                </el-form-item>
              </el-row>
              <el-row v-show="title == '新增零报告'">
                <el-form-item label="备注">
                  <!--当数据获取且存在后再渲染标签-->
                  <el-col :span="23">
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
              </el-row>
              <el-row>
                <el-form-item label v-show="title !== '添加附件' && title !== '新增零报告'">
                  <!-- <el-radio-group v-model="needCall" style="float:left;margin-bottom: 16px">
                    <el-radio
                      v-for="item in chasingStatus"
                      :label="item.id"
                      :key="item.id"
                    >{{item.label}}</el-radio>
                  </el-radio-group>-->

                  <el-checkbox
                    v-model="needCall"
                    style="float:left;height: 35px;line-height: 0px;"
                  >是否追呼</el-checkbox>

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
  </div>
</template>

<script>
import selectMansDialog from '@/view/yz_eventManagement/eventReports/dialog/selectMansDialog';
export default {
    name: 'appDutyPopup',
    props: {
        //标题
        title: {
            type: String,
        },
    },
    components: {
        selectMansDialog,
    },
    data() {
        return {
            workForm: {
                id: '',
                title: '',
                content: '',
                // unit: "",
                executeTime: '',
                // type: "",
                // vcExtend2: "",
                rightNow: '', // 追呼类型
                remind: 0, //时限
                callFrequency: 0, // 数量
                remindInterval: 0, //间隔时间
                // remark:"",

                contactorIds: [],
                appSjsAffairsFiles: [], //上传文件信息
                vcExtend1: '',
                affairsTypeId: '', // 类型
            }, //表单数据
            needCall: false, // 是否追呼
            workOptions: [], // 类型数据
            chasingType: [
                { id: 0, label: '设定追呼' },
                { id: 1, label: '立即追呼' },
            ],
            chasingStatus: [
                { id: 1, label: '是' },
                { id: 0, label: '否' },
            ],
            setTimes: [
                { id: 1, label: '1分钟' },
                { id: 3, label: '3分钟' },
                { id: 5, label: '5分钟' },
                { id: 10, label: '10分钟' },
                { id: 15, label: '15分钟' },
                { id: 30, label: '30分钟' },
            ],
            setNumbs: [
                { id: 1, label: '1次' },
                { id: 3, label: '3次' },
                { id: 5, label: '5次' },
                { id: 10, label: '10次' },
                { id: 15, label: '15次' },
                { id: 30, label: '30次' },
            ],
            fileList: [], //上传文件列表
            rules: {
                affairsTypeId: [
                    {
                        required: true,
                        message: '类型不能为空',
                        trigger: 'change',
                    },
                ],
                title: [
                    {
                        required: true,
                        message: '标题不能为空',
                        trigger: 'blur',
                    },
                    {
                        max: 100,
                        message: '标题不能超过100字',
                    },
                ],
                content: [
                    {
                        required: true,
                        message: '内容不能为空',
                        trigger: 'blur',
                    },
                    {
                        max: 10000,
                        message: '内容不能超过10000字',
                    },
                ],
                unit: [
                    {
                        max: 200,
                        message: '负责单位名称不能超过200字',
                    },
                ],
                vcExtend1: [
                    {
                        required: true,
                        message: '责任人不能为空',
                        trigger: 'change',
                    },
                ],
                executeTime: [
                    {
                        required: true,
                        message: '时间不能为空',
                        trigger: 'blur',
                    },
                ],
                vcExtend2: [
                    {
                        max: 100,
                        message: '执行情况不能超过100字',
                    },
                ],
            }, //验证规则
            isDialogVisible: false, //是否显示弹窗
            defaultProps: {
                children: 'children',
                label: 'name',
                plusIcon: true,
            },
            treeData: [], //数形数据
            allowType: [
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-excel',
                'image/png',
                'image/jpeg',
                'image/gif',
                'application/pdf',
                'text/plain',
            ], //允许上传的文件mine-type
            time: '', // 当前时间
            affairsId: '', //当前政务Id
            typeId: '',
            outerVisible: false,
            searchText: '',
            mans: '',
            typeTips: 1, //修改工作安排状态 0:弹窗选择不覆盖原标题和内容；1:是否第一次触发下拉框（1为是）；2:弹窗选择覆盖原标题和内容
            originalId: '',// 修改工作安排原类型id
        };
    },
    created() {
        // this.getWorkType();
        this.initTypeData();
    },
    watch: {
        title: {
            immediate: true, // immediate选项可以开启首次赋值监听
            handler(newVal, oldVal) {
                setTimeout(() => {
                    this.clearContenr();
                });
            },
        },
        isDialogVisible(newVal) {
            if (this.title == '新增零报告') {
                this.getTimes();
            }
        },
    },
    methods: {
        // 初始化类型列表
        async initTypeData() {
            let res = await this.$api.affairsTypeList();
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
            let clock = year + '-';
            if (month < 10) clock += '0';
            clock += month + '-';
            if (day < 10) clock += '0';
            clock += day + ' ';
            if (hh < 10) clock += '0';
            clock += hh + ':';
            if (mm < 10) clock += '0';
            clock += mm;
            this.time = clock;
        },
        getWorkType() {
            //获取所有类型
            this.$api.workType().then(res => {
                if (res.errorcode != 0) {
                    this.$message({
                        message: res.msg,
                        type: 'error',
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
            this.$emit('closeDialog');
        },
        showData(row) {
            this.clearContenr();
            console.log('行：', row);
            setTimeout(() => {
                this.affairsId = row.id;
                this.originalId = row.affairsTypeId
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
                this.$api.seeAffairsDetail({ id: row.id }).then(res => {
                    if (res.errorcode != 0) {
                        this.$message({
                            message: res.msg,
                            type: 'error',
                        });
                        return;
                    }
                    // this.attList = res.attachment
                    for (const key in this.workForm) {
                        if (res.data.hasOwnProperty(key)) {
                            if (key == 'needCall') {
                                this.needCall = res.data[key] ? true : false;
                            } else if (key == 'affairsTypeId') {
                                this.workForm.affairsTypeId =
                                    res.data[key] == 0 ? '' : res.data[key];
                            } else {
                                this.workForm[key] = res.data[key];
                            }
                        }
                    }
                    this.workForm.contactorIds = [];
                    if (res.data.appSjsAffairsContacotrVos.length > 0) {
                        res.data.appSjsAffairsContacotrVos.map(t => {
                            this.workForm.contactorIds.push(t.appContactorId);
                            this.workForm.vcExtend1 +=
                                t.appContactorName + '，';
                        });
                        this.workForm.vcExtend1 = this.workForm.vcExtend1.substring(
                            0,
                            this.workForm.vcExtend1.length - 1
                        );
                    }
                    if (res.data.appSjsAffairsFiles.length > 0) {
                        this.fileList = res.data.appSjsAffairsFiles.map(t => {
                            return {
                                name: t.fileOldName,
                                id: t.id,
                            };
                        });
                    }
                });
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
        },
        //上传文件
        handleUploadFile(response, file, fileList) {
            console.log(response);
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
            this.workForm.appSjsAffairsFiles.push({
                fileOldName: response.data.fileOldName,
                fileSize: response.data.fileSize,
                fileUrl: response.data.fileUrl,
            });
        },
        submit(issue) {
            console.log(this.workForm.appSjsAffairsFiles);
            //operate	操作类型 0->新增 1-> 更新 2->删除
            this.$refs.workForm.validate(valid => {
                if (!valid) return;
                let data1 = {
                    ...this.workForm,
                    id: this.affairsId || undefined,
                    needCall: this.needCall ? 1 : 0,
                };
                this.$api.addAffairs({ data: data1 }).then(res => {
                    if (res.errorcode != 0) {
                        this.$message({
                            message: res.msg,
                            type: 'error',
                        });
                        return;
                    }
                    if (!issue) {
                        this.$message({
                            message: '保存成功!',
                            type: 'success',
                        });
                        this.isDialogVisible = false;
                        this.$emit('getTableData');
                    }
                    // this.isDialogVisible = false;
                    // this.$emit("getTableData");

                    if (issue) {
                        let data2 = {
                            id: res.data.id,
                        };
                        this.$api.issue({ data: data2 }).then(res => {
                            if (res.errorcode != 0) {
                                this.$message({
                                    message: res.msg,
                                    type: 'error',
                                });
                                return;
                            }
                            this.$message({
                                message: '保存并下发成功!',
                                type: 'success',
                            });
                            this.isDialogVisible = false;
                            this.$emit('getTableData');
                        });
                    }
                });
            });
        },
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
         * @editorName: qinjiaqi
         * @editorDate: 2020-09-23
         * @param {file} 上传的文件名
         * @return {type} undefined
         * @description：上传类型和上传大小校验
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
            let extension = file.name.substring(file.name.lastIndexOf('.') + 1); //获取文件扩展名
            const exdoc = extension === 'doc';
            const exdocx = extension === 'docx';
            const exxls = extension === 'xls';
            const exxlsx = extension === 'xlsx';
            const expng = extension === 'png';
            const exjpg = extension === 'jpg';
            const exgif = extension === 'gif';
            const exjpeg = extension === 'jpeg';
            const expdf = extension === 'pdf';
            const extxt = extension === 'txt';
            if (
                !exdoc &&
                !exdocx &&
                !exxls &&
                !exxlsx &&
                !expng &&
                !exjpg &&
                !exgif &&
                !exjpeg &&
                !expdf &&
                !extxt
            ) {
                this.$message({
                    message: '不允许上传该类型文件',
                    type: 'error',
                });
                return false;
            }
            if (file.size > 50 * 1024 * 1024) {
                this.$message({
                    message: '不允许上传超过50m的文件',
                    type: 'error',
                });
                return false;
            }
        },

        change(checkboxGroup, checkboxData) {
            // console.log('checkboxData: ', checkboxData);
            this.workForm.vcExtend1 = '';
            this.outerVisible = false;
            this.workForm.contactorIds = checkboxGroup;
            checkboxData.map(v => {
                this.workForm.vcExtend1 += v.name + '，';
            });
            this.workForm.vcExtend1 = this.workForm.vcExtend1.substring(
                0,
                this.workForm.vcExtend1.length - 1
            );
            // console.log('this.vcExtend1: ', this.vcExtend1);
        },
        addPerson() {
            this.outerVisible = true;
            // console.log('this.workForm.contactorIds: ', this.workForm.contactorIds);
            this.$refs.selectDialog.checkboxGroup = this.workForm.contactorIds;
            this.searchText = '';
            this.mans = '';
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
</style>
