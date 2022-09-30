<template>
	<div>
		<el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-position="right" label-width="100px" size="medium"
		 @submit.native.prevent>
			<el-row :gutter="gutter">
				<el-col :span="12">
					<el-form-item label="案例名称:" prop="name">
						<el-input v-model="ruleForm.name" :disabled="isDisabled" :maxlength="maxlength.VcTitle" show-word-limit clearable></el-input>
					</el-form-item>
				</el-col>
        <el-col :span="12">
          <el-form-item label="版本号:" prop="versionNo">
            <el-input v-model="ruleForm.versionNo" :disabled="isDisabled" :maxlength="maxlength.VcVersionNo" show-word-limit clearable></el-input>
          </el-form-item>
        </el-col>

			</el-row>
			<el-row :gutter="gutter">
				<el-col :span="12" v-if="!isDisabled || publishDate!=null && publishDate!=''">
					<el-form-item label="发布日期:">
						<el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="请选择日期" style="width: 315px" v-model="publishDate" clearable
						 :disabled="isDisabled"
						:picker-options="pickerBeginDateAfter"></el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :span="12" v-if="!isDisabled || occurTime!=null && occurTime!=''">
					<el-form-item label="事发时间:">
						<el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择时间" style="width: 315px" v-model="occurTime" clearable
						 :disabled="isDisabled"
						:picker-options="pickerBeginDateBefore"></el-date-picker>
					</el-form-item>
				</el-col>
        <el-col :span="12">
          <el-form-item label="事件类型" prop="localCaseClassName">
            <el-input v-model="ruleForm.localCaseClassName" disabled style="width:225px"></el-input>
            <el-button type="primary" size="mini" :disabled="isDisabled" @click="onSelectCaseClassTree()"  style="margin-left:0px;padding:7px 7px">选择</el-button>
            <el-button type="primary" size="mini" :disabled="isDisabled" @click="onClearCaseClassSelect()" style="margin-left:0px;padding:7px 7px">清除</el-button>
          </el-form-item>
        </el-col>
				<el-col :span="12" v-if="!isDisabled || area!=null && area!=''">
					<el-form-item label="事发区域:">
						<el-input v-model="ruleForm.localAreaName" disabled style="width:225px"></el-input>
            <el-button type="primary" size="mini" :disabled="isDisabled" @click="onSelectAreaTree()"  style="margin-left:0px;padding:7px 7px">选择</el-button>
            <el-button type="primary" size="mini" :disabled="isDisabled" @click="onClearAreaSelect()" style="margin-left:0px;padding:7px 7px">清除</el-button>
					</el-form-item>
				</el-col>
			</el-row>
			<el-form-item label="事发地点:" v-if="!isDisabled || address!=null && address!=''">
        <el-input v-model="address" :disabled="isDisabled" :maxlength="maxlength.VcAddress" show-word-limit style="width:660px"></el-input>
        <el-button icon="el-icon-location-outline" type="text" :disabled="isDisabled" @click="location">定位</el-button>
			</el-form-item>
      <el-form-item label="案例内容:" prop="content">
        <!-- 富文本编辑器 -->
        <rich-text-editor v-model="ruleForm.content"></rich-text-editor>
      </el-form-item>
			<el-form-item label="附件" v-if="!isDisabled || fileList.length!=0">
				<el-upload class="upload-demo" action="" :http-request='uploadFileMethod' :accept="accept" :file-list="fileList"
				 :before-upload="beforeAvatarUpload" :headers="{Authorization: $window.localStorage.getItem('token') ? $window.localStorage.getItem('token') : ''}" :before-remove="beforeRemove" :on-preview="handlePreview" style='text-align: left;'
				 :disabled="isDisabled">
					<el-button  size="small" type="primary" :disabled="isDisabled">点击上传</el-button>
				</el-upload>
			</el-form-item>
			<el-row :gutter="gutter">
				<el-col :span="24">

				</el-col>
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
    <grouping-modular ref="mychild" @treeChild="caseClassTreeChild"></grouping-modular>
    <!-- 选择树部分 -->
    <tree-select-form ref="treeSelect" @submit="onSelectTreeClose"></tree-select-form>
    <!-- 地图定位 -->
    <location ref="Location"></location>
	</div>
</template>

<script>
  import Grouping from '../../ebs_components/Grouping'
  import TreeSelectForm from '../../ebs_components/TreeSelectForm'
  import Location from '../../ebs_components/Location'
  import RichTextEditor from '../../ebs_components/MyRichTextEditor'
	import {
		root
	} from '../../assets/js/ebs_common'

	export default {
		name: "typicalCaseForm",
		props: ['id', 'type', 'caseClassId', 'caseClassName', 'treeData', 'ZoningData'],
		components: {
      'grouping-modular': Grouping,
      'tree-select-form': TreeSelectForm,
      'location': Location,
      'rich-text-editor': RichTextEditor,
		},
		inject:['reload'],
		data() {
			return {
				accept: '.xls,.xlsx,.doc,.txt,.pdf,.docx,.jpg,.jpeg,.png,.ppt,.pptx',
				root: "",
				theme: '案例管理',
				gutter: 20,
				fileList: [],
				ruleForm: {
					name: '',
          versionNo: "", //版本号
					localCaseClassName: '',
          localAreaName: '',
          content: '', //案例内容
				},
				pickerBeginDateBefore:{
					disabledDate: (time) => {
						let finishDateVal =new Date(this.publishDate).getTime();
						if (finishDateVal) {
							return (time.getTime() >= finishDateVal)||(time.getTime() < new Date('1949-09-30').getTime());
						}else{
							return (time.getTime() < new Date('1949-09-30').getTime())||(time.getTime() > new Date().getTime());
						}
					}
				},
				pickerBeginDateAfter:{
					disabledDate: (time) => {
						let beginDateVal = new Date(this.occurTime).getTime();
						if (beginDateVal) {
							return (time.getTime() < beginDateVal) || (time.getTime() > new Date().getTime());
						} else{
							return (time.getTime() > new Date().getTime());
						}
					}
				},
				rules: { //正则
					name: [{
						required: true,
						validator: this.$regular.currencyRules,
						trigger: 'blur'
					}],
					versionNo: [{
						required: true,
						message: '不能为空',
						trigger: 'blur'
					}],
          content: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }],
				},

				publishDate: null, //发布日期
        occurTime: null, //事发时间
        localCaseClassId: '', //事件类型ID
        localAreaId: '', //事发区域ID
				address: "", //事发地点
				longitude: '', //经度
				latitude: '', //纬度
				attachmentId: null, //附件ID
				attachmentName: "", //附件名称
				maxlength: [],
			}
		},
		computed: {
			isDisabled() {
				return this.type == 'detail';
			}
		},
		created() {
			this.$http({
				method: 'post',
				url:  '/common/getColumnLength',
				baseURL: window.g.ApiUrl,
				data:{table: "app_typical_case"}
				}).then(res => {
				this.maxlength.VcName = res.data.VcName;
        this.maxlength.VcVersionNo = res.data.VcVersionNo;
				this.maxlength.VcAddress = res.data.VcAddress;
				this.maxlength.TxtContent = res.data.TxtContent;
			});
      window.addEventListener("message", this.locationCallback);
      window.addEventListener("message", this.sendLocationMsg);
			this.exports()
		},
    beforeDestroy() {
      window.removeEventListener('message', this.locationCallback);
      window.removeEventListener('message', this.sendLocationMsg);
    },
		methods: {
			onSelectCaseClassTree() { //打开类别树
				let data = this.treeData;
				let type = '选择应急类型';
				let treeData = {
					id: this.localCaseClassId,
					name: this.ruleForm.localCaseClassName
				}
				this.$refs.mychild.openModal(data, type, treeData);
			},
			onClearCaseClassSelect() { //清除类别
				this.ruleForm.localCaseClassName = '';
				this.localCaseClassId = '';
			},
      caseClassTreeChild(data) { //类别数据回传
        this.ruleForm.localCaseClassName = data.treeName;
        this.localCaseClassId = data.treeID;
      },
      onSelectAreaTree() { //打开区域树
        this.$refs.treeSelect.theme = "选择行政区划";
        let treeData = {
          id: this.localAreaId,
          name: this.ruleForm.localAreaName
        }
        this.$refs.treeSelect.getTree('area', treeData);
        this.$refs.treeSelect.visible = true;
      },
      onClearAreaSelect() { //清除区域
        this.localAreaId = '';
        this.ruleForm.localAreaName = "";
      },
      onSelectTreeClose(data) {
        this.localAreaId = data.id;
        this.ruleForm.localAreaName = data.name;
        this.$refs.treeSelect.visible = false;
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
					url:  '/emergency/preparation/typicalCase/detail',
					baseURL: window.g.ApiUrl,
					data
					}).then(res => {
						let result = res.data;
						this.$nextTick(() => {
							this.ruleForm.name = result.name;
              this.ruleForm.versionNo = result.versionNo;
							this.publishDate = result.publishDate;
							this.occurTime = result.occurTime;
							if (result.caseClass.id){
                this.localCaseClassId = result.caseClass.id;
                let parentName = this.$ParentnodeTree(this.treeData, result.caseClass.id).name; //父级名称
                this.ruleForm.localCaseClassName = parentName + '->' + result.caseClass.name;
              }
              if (result.district.id) {
                this.localAreaId = result.district.id;
                let parentName = this.$ParentnodeTree(this.ZoningData, this.localAreaId).name; //父级名称
                if(!parentName || parentName=='所有区划')
                  this.ruleForm.localAreaName = result.district.name;
                else
                  this.ruleForm.localAreaName = parentName + '->' + result.district.name;
              } else {
                this.localAreaId = '';
                this.ruleForm.localAreaName = '';
              }
							this.address = result.address;
							this.longitude = result.longitude;
							this.latitude = result.latitude;
							this.ruleForm.content = result.content;
							if (result.attachments && result.attachments.length > 0) {
								let array = [];
								for (let i in result.attachments) {
									let filelist = {};
									filelist.name = result.attachments[i].title + result.attachments[i].extension;
									filelist.id = result.attachments[i].id;
									filelist.url = root + result.attachments[i].path + result.attachments[i].filename + result.attachments[i].extension;
									array.push(filelist);
								}
								this.fileList = array;
							} else {
								this.fileList = [];
							}
						})
					});
				} else {
					this.$nextTick(() => {
						this.$refs['ruleForm'].resetFields();
						this.ruleForm.name = "";
						this.localCaseClassId = this.caseClassId;
						let parentName = this.$ParentnodeTree(this.treeData, this.caseClassId).name; //父级名称
						this.ruleForm.localCaseClassName = parentName + '->' + this.caseClassName;
            this.localAreaId = "";
            this.ruleForm.localAreaName = "";
					});
          this.ruleForm.versionNo = "";
					this.publishDate = null;
					this.occurTime = null;
					this.address = "";
					this.longitude = "";
					this.latitude = "";
					this.ruleForm.content = "";
					this.attachmentId = null;
					this.attachmentName = "";
					this.fileList = [];

				}
			},
      //定位
      location() {
        this.$refs.Location.visible = true;
      },
      sendLocationMsg(obj) {
        if (obj.data.action && obj.data.action == "ready") {
          if (this.longitude && this.latitude) {
            //var framew = window.mapFrame.contentWindow;
            var mapFarme = document.getElementById("map-frame");
            if (mapFarme) {
              var data = {};
              data.action = "getpoint";
              var object = {};
              object.center = this.longitude + "," + this.latitude;
              object.address = this.address;
              object.area = "";
              data.object = object;
              mapFarme.contentWindow.postMessage(JSON.stringify(data), "*");
            }
          }
        }
      },

      locationCallback(obj) {
        if (obj.data.action && obj.data.action == "retpoint") {
          var latlon = obj.data.object.point.split(",");
          this.longitude = latlon[0];
          this.latitude = latlon[1];
          this.address = obj.data.object.address;
          this.$refs.Location.visible = false;
        }
      },

			uploadFileMethod(param) { //自定义上传
				let fileObject = param.file;
				let formData = new FormData();
				formData.append("file", fileObject);
				this.$http({
				method: 'post',
				url:  '/emergency/preparation/attachment/upload',
				baseURL: window.g.ApiUrl,
				data:formData
				} ).then(res => {
					let filePath = res.data.filePath;
					let size = res.data.size;
					this.handleUploadSuccess(filePath, size);
				})
			},
			handlePreview(file) {
				// location.href = file.url;
				window.open(`${file.url}?Authorization=${localStorage.getItem("token")? localStorage.getItem("token"): ""}`);
			},
			handleUploadSuccess(filePath, size) {
				let data = {
					filePath: filePath,
					size: size,
					type: "typicalCase",
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
					filelist.url = root + filePath;
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
                  name: this.ruleForm.name,
                  versionNo: this.ruleForm.versionNo,
									publishDate: this.publishDate,
									occurTime: this.occurTime,
                  caseClassId: this.localCaseClassId,
                  areaId: this.localAreaId,
                  address: this.address,
                  longitude: this.longitude,
                  latitude: this.latitude,
									content: this.ruleForm.content,
                  attachments: attachmentIds, //附件id
								}
							};
							let CallbackReload=this;
							this.$http({
							method: 'post',
							url:  '/emergency/preparation/typicalCase/add',
							baseURL: window.g.ApiUrl,
							data
							}).then(res => {
								this.$emit('on-submit', 'create');
								this.$message({
									message: '新增成功',
									type: 'success'
								});

							});
						} else if (this.type == 'update') {
							let data = {
								data: {
									id: this.id,
                  name: this.ruleForm.name,
                  versionNo: this.ruleForm.versionNo,
                  publishDate: this.publishDate,
                  occurTime: this.occurTime,
                  caseClassId: this.localCaseClassId,
                  areaId: this.localAreaId,
                  address: this.address,
                  longitude: this.longitude,
                  latitude: this.latitude,
                  content: this.ruleForm.content,
                  attachments: attachmentIds, //附件id
								}
							};
							let CallbackReload=this;
							this.$http({
							method: 'post',
							url:  '/emergency/preparation/typicalCase/update',
							baseURL: window.g.ApiUrl,
							data
							}).then(res => {
								this.$emit('on-submit', 'update');
								this.$message({
									message: '修改成功',
									type: 'success'
								});
							});
						}
					} else {
						return false;
					}
				});

			},
			// 对话框取消按钮事件
			onCancel() {
				this.$emit('on-cancel');
				this.$refs['ruleForm'].resetFields();
			},
			closeDialog() { //清除正则验证
				this.$refs['ruleForm'].resetFields();
			}
		}
	}
</script>

<style scoped>
	@import '../../assets/css/common.css';

	.long-label-style>>>.el-form-item__label {
		line-height: 25px;
	}

	.el-tag+.el-tag {
		margin-left: 10px;
		margin-bottom: 10px;
	}

	.el-input>>>.el-input__inner {
		color: #606266;
	}

	.el-select>>>.el-input__inner {
		color: #606266;
	}

	.el-textarea>>>.el-textarea__inner {
		color: #606266;
	}

	.upload-demo {
		margin-left: 10px;
		display: inline;
	}

	.el-form-item>>>.el-form-item__content {
		line-height: 34px;
	}

	.el-dialog__wrapper>>>.el-dialog--center .el-dialog__body {
		text-align: left;
	}
</style>
