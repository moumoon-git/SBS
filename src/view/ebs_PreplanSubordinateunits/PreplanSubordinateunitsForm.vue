<template>
  <div>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-position="right"
      label-width="100px"
      size="medium"
      @submit.native.prevent
    >
      <el-row :gutter="gutter">
        <el-col :span="12">
          <el-form-item label="备案名称:" prop="title">
            <el-input
              v-model="ruleForm.title"
              :disabled="isDisabled"
              :maxlength="maxlength.VcTitle"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属类别" prop="localCaseClassName">
            <el-input v-model="ruleForm.localCaseClassName" disabled style="width:225px"></el-input>
            <el-button
			  v-if="!isDisabled"
              type="primary"
              size="mini"
              :disabled="isDisabled"
              @click="onSelectTree()"
              style="margin-left:0px;padding:7px 7px"
            >选择</el-button>
            <el-button
			  v-if="!isDisabled"
              type="primary"
              size="mini"
              :disabled="isDisabled"
              @click="onClearSelect()"
              style="margin-left:0px;padding:7px 7px"
            >清除</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="gutter">
        <el-col :span="12" v-if="!isDisabled || versionNo!=null && versionNo!=''">
          <el-form-item label="版本号:">
            <el-input
              v-model="versionNo"
              :disabled="isDisabled"
              :maxlength="maxlength.VcVersionNo"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="!isDisabled || code!=null && code!=''">
          <el-form-item label="备案编码:">
            <el-input
              v-model="code"
              :disabled="isDisabled"
              :maxlength="maxlength.VcCode"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="!isDisabled || builder!=null && builder!=''">
          <el-form-item label="编制单位:">
            <el-input
              v-model="builder"
              :disabled="isDisabled"
              :maxlength="maxlength.VcBuilder"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="!isDisabled || publishUnit!=null && publishUnit!=''">
          <el-form-item label="发布单位:">
            <el-input
              v-model="publishUnit"
              :disabled="isDisabled"
              :maxlength="maxlength.VcPublishUnit"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="!isDisabled || publishDate!=null && publishDate!=''">
          <el-form-item label="发布时间:">
            <el-date-picker
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择日期"
              style="width: 315px"
              v-model="publishDate"
              clearable
              :disabled="isDisabled"
              :picker-options="pickerBeginDateBefore"
            ></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="!isDisabled || lastUpdate!=null && lastUpdate!=''">
          <el-form-item label="修订时间:">
            <el-date-picker
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择日期"
              style="width: 315px"
              v-model="lastUpdate"
              clearable
              :disabled="isDisabled"
              :picker-options="pickerBeginDateAfter"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="!isDisabled || area!=null && area!=''">
          <el-form-item label="适用区域:">
            <el-input
              v-model="area"
              :disabled="isDisabled"
              :maxlength="maxlength.VcArea"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注:" v-if="!isDisabled || remark!=null && remark!=''">
        <el-input v-model="remark" type="textarea" :rows="2" :disabled="isDisabled"></el-input>
      </el-form-item>
      <el-form-item label="附件" v-if="!isDisabled || fileList.length!=0">
        <el-upload
          class="upload-demo"
          action
          :headers="{token: $cookie.get('token') }"
          :http-request="uploadFileMethod"
          :accept="accept"
          :file-list="fileList"
          :before-upload="beforeAvatarUpload"
          :before-remove="beforeRemove"
          :on-preview="handlePreview"
          style="text-align: left;"
          :disabled="isDisabled"
        >
          <el-button v-if="!isDisabled" size="small" type="primary" :disabled="isDisabled">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-row :gutter="gutter">
        <el-col :span="24"></el-col>
      </el-row>
    </el-form>
    <div v-if="!isDisabled" class="dialog-footer">
      <el-button type="primary" size="medium" @click="onSubmit">确认</el-button>
      <el-button type="info" size="medium" @click="onCancel">取消</el-button>
    </div>
    <div v-else class="dialog-footer">
      <el-button type="primary" size="medium" @click="onCancel">确认</el-button>
    </div>
    <!-- 分组 -->
    <grouping-modular ref="mychild" @treeChild="treeChild"></grouping-modular>
  </div>
</template>

<script>
	import {
		root
	} from '../../assets/js/ebs_common'
  import Grouping from '../../ebs_components/Grouping'
	export default {
		name: "PreplanSubordinateunitsForm",
		props: ['id', 'type', 'caseClassId', 'caseClassName', 'treeData'],
		components: {
      'grouping-modular': Grouping
		},
		inject:['reload'],
		data() {
			return {
				isYangZhouProject: true,//window.g.isYangZhouProject,
				accept: '.xls,.xlsx,.doc,.txt,.pdf,.docx,.jpg,.jpeg,.png,.ppt,.pptx',
				root: "",
				theme: '预案备案',
				gutter: 20,
				fileList: [],
				ruleForm: {
					title: '',
					localCaseClassName: '',
				},
				pickerBeginDateBefore:{
					disabledDate: (time) => {
						let finishDateVal =new Date( this.lastUpdate).getTime();
						if (finishDateVal) {
							return (time.getTime() >= finishDateVal)||(time.getTime() < new Date('1949-09-30').getTime());
						}else{
							return (time.getTime() < new Date('1949-09-30').getTime())||(time.getTime() > new Date().getTime());
						}
					}
				},
				pickerBeginDateAfter:{
					disabledDate: (time) => {
						let beginDateVal = new Date(this.publishDate).getTime();
						if (beginDateVal) {
							return (time.getTime() < beginDateVal) || (time.getTime() > new Date().getTime());
						} else{
							return (time.getTime() > new Date().getTime());
						}
					}
				},
				rules: { //正则
					title: [{
						required: true,
						validator: this.$regular.currencyRules,
						trigger: 'blur'
					}],
					localCaseClassName: [{
						required: true,
						message: '不能为空',
						trigger: 'blur'
					}],

				},
				code: "", //编码
				area: "", //适用区域
				builder: "", //编制单位
				publishUnit: "", //发布单位
				publishDate: null, //发布时间
				versionNo: "", //版本号
				lastUpdate: null, //修订时间
				remark: "", //备注
				reportRemark: "", //审核说明
				attachmentId: null, //附件ID
				attachmentName: "", //附件名称
				localCaseClassId: '',
				maxlength: [],
				reportStatus: '待上报',
			}
		},
		computed: {
			isDisabled() {
				return this.type == 'detail';
			}
		},
		created() {
			// this.$http({
			// 		method: 'post',
			// 		url:  '/common/getColumnLength',
			// 		baseURL: window.g.ApiUrl,
			// 		data:{table: "app_preplan_subordinateunits"}
			// 		}).then(res => {
			this.maxlength.VcTitle = 500;
			this.maxlength.VcCode = 500;
			this.maxlength.VcArea = 500;
			this.maxlength.VcBuilder = 500;
			this.maxlength.VcPublishUnit = 500;
			this.maxlength.VcVersionNo = 500;
			// });
			this.exports();
		},
		methods: {
			onSelectTree() { //打开类别树
				let data = this.treeData;
				let type = '选择应急类型';
				let treeData = {
					id: this.localCaseClassId,
					name: this.ruleForm.localCaseClassName
				}
				this.$refs.mychild.openModal(data, type, treeData);
			},
			onClearSelect() { //清除类别
				this.ruleForm.localCaseClassName = '';
				this.localCaseClassId = '';
			},
			treeChild(data) { //数据回传
				this.ruleForm.localCaseClassName = data.treeName;
				this.localCaseClassId = data.treeID;
			},
			exports() {
				this.root = root;
			},
			getDetail() {
				if (this.id && this.id > 0) {
					let data = {
						id: this.id
					};
					let CallbackReload=this;
					this.$http({
					method: 'post',
					url:  '/emergency/preparation/preplanSubordinateunits/detail',
					baseURL: window.g.ApiUrl,
					data
					}).then(res => {
						let result = res.data.data;
						this.$nextTick(() => {
							this.ruleForm.title = result.title;
							this.code = result.code;
							this.area = result.area;
							this.builder = result.builder;
							this.publishUnit = result.publishUnit;
							this.publishDate = result.publishDate;
							this.versionNo = result.versionNo;
							this.lastUpdate = result.lastUpdate;
							this.remark = result.remark;
							this.reportRemark = result.reportRemark;
							this.reportStatus = (result.reportStatus == 0 ? '已上报' : (result.reportStatus == 1 ? '通过' : (result.reportStatus == 2 ?'驳回' : '待上报')));
							if (result.attachment && result.attachment.length > 0) {
								let array = [];
								for (let i in result.attachment) {
									let filelist = {};
									filelist.name = result.attachment[i].title;
									filelist.id = result.attachment[i].id;
									filelist.url = window.SITE_CONFIG.fileupload + result.attachment[i].path + result.attachment[i].filename;
									array.push(filelist);
								}
								this.fileList = array;
							} else {
								this.fileList = [];
							}
							this.localCaseClassId = result.caseClass.id;
							let parentName = this.$ParentnodeTree(this.treeData, result.caseClass.id).name; //父级名称
							this.ruleForm.localCaseClassName = parentName + '->' + result.caseClass.name;
						})
					});
				} else {
					this.$nextTick(() => {
						this.$refs['ruleForm'].resetFields();
						this.ruleForm.title = "";
						this.localCaseClassId = this.caseClassId;
						let parentName = this.$ParentnodeTree(this.treeData, this.caseClassId).name; //父级名称
						this.ruleForm.localCaseClassName = parentName + '->' + this.caseClassName;
					})
					this.code = "";
					this.area = "";
					this.builder = "";
					this.publishUnit = "";
					this.publishDate = null;
					this.versionNo = "";
					this.lastUpdate = null;
					this.remark = "";
					this.reportRemark = "";
					this.attachmentId = null;
					this.attachmentName = "";
					this.fileList = [];
				}
			},
			uploadFileMethod(param) { //自定义上传
				let fileObject = param.file;
				let formData = new FormData();
				formData.append("file", fileObject);
				formData.append("type", 2);
				this.$http({
					method: 'post',
					url:  '/appAttachment/fileUploadAttachment',
					baseURL: window.SITE_CONFIG["fileupload"],
					data: formData
				}).then(res => {
					if (res.data.errorcode === 0) {
						this.fileList.push({
							name: res.data.data.title,
							id: res.data.data.id,
							url: window.SITE_CONFIG.cloudUrl + res.data.data.url,
						})
					} else {
						this.$message.error(res.data.msg)
					}
				})
			},
			handlePreview(file) {
				// location.href = file.url;
				// window.open(`${file.url}?Authorization=${localStorage.getItem("token")? localStorage.getItem("token"): ""}`);
				const request = {
					method: 'get',
					baseURL: window.SITE_CONFIG.cloudUrl,
					url: '/fileupload/appAttachment/download',
					params: {
						appAttachmentId: file.id,
						isForceDownload: '1',
					},
					headers: {
						token: this.$cookie.get('token'),
					},
					responseType: 'arraybuffer',
				};
				this.$http(request).then((response) => {
					if (response.data) {
						const a = document.createElement('a');
						a.target = '_blank';
						a.download = file.name;
						a.href = window.URL.createObjectURL(new Blob([response.data]));
						a.click();
					}
				});
			},
			handleUploadSuccess(filePath, size) {
				let data = {
					filePath: filePath,
					size: size,
					type: "preplanSubordinateunits",
				}
				this.$http({
					method: 'post',
					url:  '/emergency/preparation/attachment/add',
					baseURL: window.g.ApiUrl,
					data
					}).then(res => {
					let filelist = {};
					filelist.name = res.data.name + res.data.extension;
					filelist.id = res.data.id;
					filelist.url = window.SITE_CONFIG.cloudUrl + filePath;
					this.fileList.push(filelist);
					this.$message({
						message: '上传成功',
						type: 'success'
					});

				})

			},
			beforeAvatarUpload(file) { //上传前类型判断
				let fileName = file.name.lastIndexOf("."); //取到文件名开始到最后一个点的长度
				let fileNameLength = file.name.length; //取到文件名长度
				let fileFormat = file.name.substring(fileName + 1, fileNameLength);
				let fileType = fileFormat === 'xlsx' || fileFormat === 'xls' || fileFormat === 'doc' || fileFormat === 'docx' ||
					fileFormat === 'txt' || fileFormat === 'pdf' || fileFormat === 'jpg' || fileFormat === 'jpeg' || fileFormat ===
					'png' || fileFormat === 'ppt' || fileFormat === 'pptx';
				if (!fileType) {
					this.$message.error('上传格式为.xls,.xlsx,.doc,.txt,.pdf,.docx,.jpg,.jpeg,.png,.ppt,.pptx');
				}
				return fileType;
			},
			beforeRemove(file, fileList) { //删除文件
				this.fileList.splice(this.fileList.indexOf(file), 1);
			},


			// 对话框确认按钮事件
			onSubmit() {
				this.$refs['ruleForm'].validate((valid) => {
					if (valid) {
						let attachmentIds = [];
						for (let i in this.fileList) {
							attachmentIds.push(this.fileList[i].id)
						}
						if (this.type == 'create') {
							let data = {
								data: {
									title: this.ruleForm.title,
									code: this.code,
									area: this.area,
									builder: this.builder,
									publishUnit: this.publishUnit,
									publishDate: this.publishDate,
									versionNo: this.versionNo,
									lastUpdate: this.lastUpdate,
									remark: this.remark,
									attachmentId: attachmentIds, //附件id
									caseClassId: this.localCaseClassId,
								}
							};
							this.$http({
								method: 'post',
								url:  '/emergency/preparation/preplanSubordinateunits/add',
								baseURL: window.g.ApiUrl,
								data
							}).then(res => {
								if (res.data.code === 0 || res.data.errorcode === 0) {
									this.$emit('on-submit', 'create');
									this.$message({
										message: '新增成功',
										type: 'success'
									});
									this.reportPreplan(res.data.data.id); // 保存同时上报
								}
							});
						} else if (this.type == 'update') {
							let data = {
								data: {
									id: this.id,
									title: this.ruleForm.title,
									code: this.code,
									area: this.area,
									builder: this.builder,
									publishUnit: this.publishUnit,
									publishDate: this.publishDate,
									versionNo: this.versionNo,
									lastUpdate: this.lastUpdate,
									remark: this.remark,
									attachmentId: attachmentIds,
									caseClassId: this.localCaseClassId,
								}
							};
							this.$http({
								method: 'post',
								url:  '/emergency/preparation/preplanSubordinateunits/update',
								baseURL: window.g.ApiUrl,
								data
							}).then(res => {
								if (res.data.code === 0 || res.data.errorcode === 0) {
									this.$emit('on-submit', 'update');
									this.$message({
										message: '修改成功',
										type: 'success'
									});
									this.reportPreplan(this.id); // 保存同时上报
								}
							});
						}
					} else {
						return false;
					}
				});
			},
			reportPreplan(id) {
				let data = {
					id: id,
					status: 0,
					remark: '',
				};
				this.$http({
					method: 'post',
					url:  '/event/emergency/preparation/preplanSubordinateunits/examinePreplan',
					baseURL: window.SITE_CONFIG["cloudUrl"],
					data
				}).then(res => {
					if(res.data.errorcode == 0) {
						this.$message({
							message: '上报成功',
							type: 'success'
						});
						this.getTable();
					} else {
						this.$message({
							message: '上报失败',
							type: 'error'
						});
					}
				})
			},
			// 对话框取消按钮事件
			onCancel() {
				this.$emit('on-cancel');
				this.$refs['ruleForm'].resetFields();
			},
			closeDialog() { //清除正则验证
				this.$refs['ruleForm'].resetFields();
			},
		},
		
	}
</script>

<style scoped>
@import '../../assets/css/common.css';

.long-label-style >>> .el-form-item__label {
    line-height: 25px;
}

.el-tag + .el-tag {
    margin-left: 10px;
    margin-bottom: 10px;
}

.el-input >>> .el-input__inner {
    color: #606266;
}

.el-select >>> .el-input__inner {
    color: #606266;
}

.el-textarea >>> .el-textarea__inner {
    color: #606266;
}

.upload-demo {
    margin-left: 10px;
    display: inline;
}

.el-form-item >>> .el-form-item__content {
    line-height: 34px;
}

.el-dialog__wrapper >>> .el-dialog--center .el-dialog__body {
    text-align: left;
}

.waitForReportClass {
    height: 0px;
    border-top: 0px;
    border-bottom: 43px solid orange;
    border-right: 43px solid transparent;
    border-left: 43px solid transparent;
    -webkit-transform: rotate(-45deg);
    left: -41px;
    top: 21px;
    position: absolute;
    color: #ffffff;
    font-size: 26px;
    text-align: center;
}
.waitForCheckClass {
    height: 0px;
    border-top: 0px;
    border-bottom: 43px solid orange;
    border-right: 43px solid transparent;
    border-left: 43px solid transparent;
    -webkit-transform: rotate(-45deg);
    left: -41px;
    top: 21px;
    position: absolute;
    color: #ffffff;
    font-size: 26px;
    text-align: center;
}
.checkUnsuccessClass {
    height: 0px;
    border-top: 0px;
    border-bottom: 43px solid red;
    border-right: 43px solid transparent;
    border-left: 43px solid transparent;
    -webkit-transform: rotate(-45deg);
    left: -41px;
    top: 21px;
    position: absolute;
    color: #ffffff;
    font-size: 26px;
    text-align: center;
}
.checkSuccessClass {
    height: 0px;
    border-top: 0px;
    border-bottom: 43px solid green;
    border-right: 43px solid transparent;
    border-left: 43px solid transparent;
    -webkit-transform: rotate(-45deg);
    left: -41px;
    top: 21px;
    position: absolute;
    color: #ffffff;
    font-size: 22px;
    text-align: center;
}

</style>
