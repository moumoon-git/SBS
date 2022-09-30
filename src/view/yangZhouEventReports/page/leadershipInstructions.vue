<template>
  <div style="padding: 10px 10px ;overflow: none;">
    <el-dialog
      :visible.sync="isShow"
      @close="isShow=false"
      :append-to-body="true"
      :title="dialogType == 'new' ? '新增批示' : '修改批示'"
      :close-on-click-modal="false"
      class="addClass"
      width="20%"
    >
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-row>
          <el-col :span="24">
            <el-form-item label="姓名:" prop="name">
              <el-input
                type="text"
                v-model="ruleForm.name"
                placeholder="请输入姓名"
                :maxlength="10"
                show-word-limit
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="单位:" prop="leaderWorkunit">
              <el-input
                type="text"
                v-model="ruleForm.leaderWorkunit"
                placeholder="请输入单位"
                :maxlength="15"
                show-word-limit
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="职务:" prop="leaderPosition">
              <el-input
                type="text"
                v-model="ruleForm.leaderPosition"
                placeholder="请输入职务"
                :maxlength="15"
                show-word-limit
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="时间:" prop="instructionsTime">
              <el-date-picker
                style="width: 100%"
                v-model="ruleForm.instructionsTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                placeholder="请输入时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="类型:" prop="instructionsType">
              <el-radio v-model="ruleForm.instructionsType" label="指示">指示</el-radio>
              <el-radio v-model="ruleForm.instructionsType" label="批示">批示</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="内容:" prop="instruction">
              <el-input
                type="textarea"
                :autosize="{ minRows:3, maxRows:6}"
                v-model="ruleForm.instruction"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" style="float: right">
            <el-button
              type="primary"
              size="small"
              @click="save('ruleForm')"
              style="float: right;margin-left:20px;"
            >保存</el-button>
            <el-button type="plain" size="small" @click="callOff" style="float: right;">取消</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <div class="content_title_left">
      <div class="vertical_bar"></div>
      <span class="content_title_name">批示指示记录</span>
      <el-button type="primary" @click="addReport()" style="position: absolute;right: 1%;">新增</el-button>
    </div>
    <div>
      <el-collapse v-model="instruction" accordion>
        <div v-for="item in tableData" :key="item.id">
          <el-collapse-item
            style="width: 100%;font-size: 17px;font-weight: 550; margin-bottom: 5px;position: relative;"
          >
            <template slot="title">
              <span
                style="margin-left: 10px;border-radius:3px;color:white;font-weight: 700;display:inline-block;width:43px;height:28px;text-align:center;line-height: 28px;"
                :class="item.approvaltype == '批示' ? 'pishiBackColor' : 'zhishiBackColor'"
              >{{item.approvaltype}}</span>
              <span style="margin-left: 10px;font-weight: 700;">{{item.leadername}}</span>
              <span style="margin-left: 10px;font-weight: 700;">{{item.leaderPosition}}</span>
              <span style="margin-left: 10px;font-weight: 700;">{{item.leaderWorkunit}}</span>
              <span style="position: absolute;font-weight: 700;right:27px;">{{item.approvalTime}}</span>
            </template>
            <p
              style="width: 100%;
                    height: 143px;
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #555555;
                    line-height: 20px;  
                    text-align:left"
            >{{item.approval}}</p>
            <el-tooltip effect="dark" content="电话" placement="top">
              <img
                src="/static/img/leadConductor/phone.png"
                alt
                @click="phone()"
                style="float: left;width:22.49px;height:auto;cursor:pointer;padding: 2px"
              />
            </el-tooltip>
            <el-tooltip effect="dark" content="短信" placement="top">
              <img
                src="/static/img/leadConductor/sms.png"
                alt
                @click="sms(item.approval)"
                style="float: left;width:22.49px;height:auto;cursor:pointer;padding: 2px"
              />
            </el-tooltip>
            <el-tooltip effect="dark" content="传真" placement="top">
              <img
                src="/static/img/leadConductor/fax.png"
                alt
                @click="fax(item)"
                style="float: left;width:22.49px;height:auto;cursor:pointer;padding: 2px"
              />
            </el-tooltip>
            <el-tooltip effect="dark" content="编辑" placement="top">
              <img
                src="/static/img/leadConductor/edit.png"
                alt
                @click="updateContent(item)"
                style="float: right;width:22.49px;height:auto;cursor:pointer;padding: 2px"
              />
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top">
              <img
                src="/static/img/leadConductor/delete.png"
                alt
                @click="rowDeleteLead(item.id)"
                style="float: right;width:22.49px;height:auto;cursor:pointer;padding: 2px"
              />
            </el-tooltip>
            <el-tooltip effect="dark" content="复制" placement="top">
              <img
                src="/static/img/leadConductor/copy.png"
                alt
                @click="copyComments(item)"
                style="float: right;width:22.49px;height:auto;cursor:pointer;padding: 2px"
              />
            </el-tooltip>
          </el-collapse-item>
        </div>
      </el-collapse>
    </div>
    <el-pagination
      background
      layout="total, prev, pager, next, jumper"
      :total="total"
      :current-page="currentPage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-size="pageSize"
      style="margin-top: 10px;text-align: center;"
    ></el-pagination>

    <el-dialog
      :visible.sync="isPhoneShow"
      @close="isPhoneShow=false"
      :append-to-body="true"
      title="电话传达"
      :close-on-click-modal="false"
      class="adClass"
    >
      <el-form>
        <phone-dialog ref="phoneDialog" :faxForm="faxForm"></phone-dialog>
      </el-form>
    </el-dialog>
    <el-dialog
      :visible.sync="isSmsShow"
      @close="isSmsShow=false"
      :append-to-body="true"
      title="短信传达"
      :close-on-click-modal="false"
      class="adClass"
    >
      <el-form>
        <sms-dialog ref="smsDialog" :selectContact="true" @close="isSmsShow=false"></sms-dialog>
      </el-form>
    </el-dialog>
    <el-dialog
      :visible.sync="isFaxShow"
      @close="isFaxShow=false,$store.commit('setSelectContact', [])"
      :append-to-body="true"
      title="传真传达"
      :close-on-click-modal="false"
      class="adClass"
      top="63px"
      width="476px"
    >
      <el-form>
        <fax-dialog
          ref="faxDialog"
          v-if="isFaxShow"
          :id="faxId"
          :faxName="ruleForm.name"
          :faxTitle="eventTitle"
          :faxWorkunit="ruleForm.leaderWorkunit"
          :faxApproval="ruleForm.instruction"
          :approvalTime="ruleForm.instructionsTime"
        ></fax-dialog>
        <div
          style="width: 100%;height: 130px;border-top: 1px solid #E0E0E0;position: absolute;bottom: 0%;left: 0%;
            background: white;"
        >
          <div
            style="color: #666666;position: absolute;left: 1%;top: 6%;transform: translateY(-50%);"
          >收信人 {{selectContact.length}}</div>
          <div style="margin-left: 55px;height: auto; background: white;">
            <div
              v-for="(item,index) in selectContact"
              :key="index"
              style="margin:10px;display: inline-block;
                background: #FAFAFA;
                border: 1px solid #E0E0E0;
                padding: 10px 20px;position: relative;"
            >
              {{item.name}}
              <i
                class="el-icon-close"
                style="position: absolute;
                    right: 3%;
                    top: 3%;cursor: pointer;"
                @click="selectContact.splice(index,1)"
              ></i>
            </div>
          </div>
          <div
            style="color: #0091FF;
            position: absolute;
            right: 18%;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;"
            @click="selectContact.splice(0,selectContact.length)"
          >清空</div>
          <div
            style="position: absolute;
            right: 16%;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;"
          >|</div>
          <div
            style="color: #0091FF;
            position: absolute;
            right: 2%;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;"
            @click="selectMember"
          >选择通讯录</div>
          <div
            style="position: absolute;
            right: 2%;
            bottom: 8%;

            cursor: pointer;
            padding: 8px 20px;
            border-radius: 5px;
            color: white;
            background: #0091FF;"
            @click="sendInstructions"
          >发送</div>
          <div
            style="    position: absolute;
            right: 17%;
            bottom: 8%;
            cursor: pointer;
            padding: 8px 20px;
            border-radius: 5px;
            color: white;
            background: rgb(0, 145, 255);"
            @click="$window.open($window.g.ApiUrl+$window.JSON.parse($window.sessionStorage.getItem('EventApprovalAssets')).wordPathName)"
          >下载word</div>
        </div>
      </el-form>
    </el-dialog>

    <add-contact
      ref="addContact"
      v-if="addContactVisible"
      @changeDialog="addContactVisible = false"
    ></add-contact>
  </div>
</template>

<script>
import phoneDialog from '@/view/yz_eventManagement/informationDisposal/communicationHistory/phone/phoneIndex';
import smsDialog from '@/view/yz_integratedCommunication/icpPhone/icpPhonePage/smsStep/smsRightLeader';
import faxDialog from '@/view/yangZhouEventReports/page/faxDialog';
import addContact from '@/view/yz_integratedCommunication/icpPhone/icpPhonePage/smsStep/addContact/AddContact';
import bus from '@/yz_components/common/js/eventBus';
import { mapGetters } from 'vuex';
export default {
    name: 'leadershipInstructions',
    components: {
        phoneDialog,
        smsDialog,
        faxDialog,
        addContact,
    },
    data() {
        return {
            $window: '',
            addContactVisible: false,
            faxForm: {
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
            tableColumn: [
                {
                    prop: 'leadername',
                    label: '姓名',
                },
                {
                    prop: 'approval',
                    label: '指示内容',
                },
                {
                    prop: 'approvalTime',
                    label: '指示时间',
                },
                {
                    prop: 'approvaltype',
                    label: '指示类型',
                },
                {
                    prop: 'deptName',
                    label: '单位',
                },
                {
                    prop: 'createTime',
                    label: '操作时间',
                },
                // {
                //     prop: "operator",
                //     label: "操作员"
                // },
            ], //表头
            tableData: [], //表格数据
            total: 0, //总数据
            pageSize: 10, //多少条
            currentPage: 1, //第几页
            pagingSize: true, //分页大小
            gutter: 20,
            ruleForm: {
                name: '',
                instructionsTime: '',
                instructionsType: '',
                leaderWorkunit: '',
                leaderPosition: '',
                instruction: '',
            },
            faxId: 0,
            rules: {
                name: [
                    {
                        required: true,
                        message: '不能为空',
                        trigger: 'blur',
                    },
                ],
                instructionsTime: [
                    {
                        required: true,
                        message: '不能为空',
                        trigger: 'blur',
                    },
                ],
                instructionsType: [
                    {
                        required: true,
                        message: '不能为空',
                        trigger: 'blur',
                    },
                ],
                /* leaderWorkunit: [{
                    required: true,
                    message: '不能为空',
                    trigger: 'blur'
                }, ],
                leaderPosition: [{
                    required: true,
                    message: '不能为空',
                    trigger: 'blur'
                }, ],*/
                instruction: [
                    {
                        required: true,
                        message: '不能为空',
                        trigger: 'blur',
                    },
                ],
            },
            instruction: '', //批示内容
            form: {
                conveyObj: '',
            },
            formRules: {
                // conveyObj:[
                //   { required: true, message: '不能为空', trigger: 'blur' },
                // ],
                // msg:[
                //   { required: true, message: '请选择一个', trigger: 'blur' },
                // ]
            },
            radio: '', //单选框
            borderData: [], //单选框数据
            restShow: true, //默认显示按钮
            saveShow: false, //默认隐藏按钮
            optionType: [
                {
                    value: '指示',
                    label: '指示',
                },
                {
                    value: '批示',
                    label: '批示',
                },
            ], //批示类型数据
            eventId: '', //事件ID
            disabled: true,
            byPhone: false, //电话
            bySms: false, //短信
            byFax: false, //传真
            tableRowData: [], //表格行数据
            objDisabled: true,
            dataType: '', //修改保存
            id: '', //当前批示的ID
            isDisabled: false, //防重复提交按钮限制
            arrayID: [], //全选数组数据
            ction: [], //
            isYangZhou: window.g.IsYangZhouProject, // 是否扬州项目
            isShow: false,
            dialogType: '',
            isPhoneShow: false,
            isSmsShow: false,
            isFaxShow: false,
            eventTitle: '',
        };
    },
    mounted() {
        this.getTableList();
    },
    created() {
        this.$window = window;
        this.$nextTick(() => {
            this.getByPcodeData();
        });
    },
    computed: {
        ...mapGetters({
            selectContact: 'getSelectContact',
        }),
    },
    watch: {
        selectContact(newValue, oldValue) {
            console.log('选择联系人', this.selectContact);
        },
        ction: {
            handler(newV, oldV) {
                console.log(newV);
            },
            deep: true,
        },
    },
    methods: {
        sendInstructions() {
            let formData = new FormData();
            formData.append(
                'pdfName',
                JSON.parse(sessionStorage.getItem('EventApprovalAssets'))
                    .pdfPathName
            );
            formData.append(
                'data',
                JSON.stringify({
                    faxSendTime: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
                    faxCaseId: sessionStorage.getItem('newID'),
                    faxName: JSON.parse(
                        sessionStorage.getItem('EventApprovalAssets')
                    ).fileName,
                })
            );
            // formData.append("file", );
            formData.append(
                'phoneNum',
                this.selectContact
                    .map(item => {
                        return item.fax.replace('-', '');
                    })
                    .toString()
            );
            formData.append(
                'contactorId',
                this.selectContact
                    .map(item => {
                        return item.id;
                    })
                    .toString()
            );
            this.$http({
                method: 'post',

                url: window.g.ApiUrl + '/eos/communication/fax/sendFax',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                data: formData,
            }).then(res => {
                console.log('/eos/communication/fax/sendFax', res);
                if (res.headers) {
                    res = res.data;
                }
                if (res.errorcode == 0) {
                    this.$message({
                        message: '发送成功',
                        type: 'success',
                    });
                    this.isFaxShow = false;
                }
            });
        },
        selectMember() {
            this.addContactVisible = true;
            this.$nextTick(() => {
                this.$refs.addContact.dialogFormVisible = true;
            });
        },
        handleSizeChange(val) {},
        handleCurrentChange(val) {
            this.currentPage = val;
            let data = {
                eventId: this.eventId,
                page: this.currentPage,
                size: this.pageSize,
            };
            this.$http
                .get(window.g.ApiUrl + '/eos/event/approval/pageList', {
                    params: data,
                })
                .then(res => {
                    if (res.headers) {
                        res = res.data;
                    }
                    if (res.errorcode == '0') {
                        this.tableData = res.data.data;
                        this.total = res.data.totalElements;
                        for (let i in this.tableData) {
							if (this.tableData[i].approvalTime != null) {
								let publishDate = this.tableData[i].approvalTime.replace(/-/g, '/');
								let time = new Date(publishDate);
								let y = time.getFullYear();
								let m = time.getMonth() + 1;
                                let d = time.getDate();
                                let h = time.getHours();
                                let min = time.getMinutes();
								this.tableData[i].approvalTime = y + '-' + this.transformationTime(m) + '-' + this.transformationTime(d) + ' ' + this.transformationTime(h) + ':' + this.transformationTime(min);
							}
						}
                    } else {
                        //this.$message.error(res.msg);
                    }
                });
        },
        getTimes() {
            let now = new Date();
            let year = now.getFullYear(); //年
            let month = now.getMonth() + 1; //月
            let day = now.getDate(); //日
            let hh = now.getHours(); //时
            let mm = now.getMinutes(); //分
            let clock = year + '-';
            if (month < 10) clock += '0';
            clock += month + '-';
            if (day < 10) clock += '0';
            clock += day + ' ';
            if (hh < 10) clock += '0';
            clock += hh + ':';
            if (mm < 10) clock += '0';
            clock += mm + ':';
        },
        copyComments(item) {
            let addData = {
                data: {
                    byFax: 0,
                    byPhone: 0,
                    bySms: 0,
                    deptType: '',
                    eventId: this.eventId,
                    approval: item.approval,
                    approvaltype: item.approvaltype,
                    leadername: item.leadername,
                    approvalTime: `${item.approvalTime}:00`,
                    leaderWorkunit: item.leaderWorkunit,
                    leaderPosition: item.leaderPosition,
                },
            };
            this.$api.leadAdd(addData).then(res => {
                if (res.errorcode == '0') {
                    this.$message({
                        message: '复制成功',
                        type: 'success',
                    });
                    let data = {
                        eventId: this.eventId,
                        page: this.currentPage,
                        size: this.pageSize,
                    };
                    this.$http
                        .get(window.g.ApiUrl + '/eos/event/approval/pageList', {
                            params: data,
                        })
                        .then(res => {
                            if (res.headers) {
                                res = res.data;
                            }
                            if (res.errorcode == '0') {
                                this.tableData = res.data.data;
                                this.total = res.data.totalElements;
                                for (let i in this.tableData) {
                                    if (this.tableData[i].approvalTime != null) {
                                        let publishDate = this.tableData[i].approvalTime.replace(/-/g, '/');
                                        let time = new Date(publishDate);
                                        let y = time.getFullYear();
                                        let m = time.getMonth() + 1;
                                        let d = time.getDate();
                                        let h = time.getHours();
                                        let min = time.getMinutes();
                                        this.tableData[i].approvalTime = y + '-' + this.transformationTime(m) + '-' + this.transformationTime(d) + ' ' + this.transformationTime(h) + ':' + this.transformationTime(min);
                                    }
                                }
                            } else {
                                //this.$message.error(res.msg);
                            }
                        });
                }
            });
        },
        //获取字典表的单位
        getByPcodeData() {
            let data = {
                pcode: 'event_instruction_dept',
            };
            this.$api.getByPcode(data).then(res => {
                console.log(res, 2222);
                if (res.errorcode == '0') {
                    console.log(res.data);
                    this.borderData = res.data;
                } else {
                }
            });
        },
        phone() {
            /* let eventId = sessionStorage.getItem('eventDealId'); 
            if(eventId == "" || eventId == undefined || eventId == null) { // 没有事件就去拿续报的发
                eventId = 0
            }
            this.faxForm.eventId = eventId
            if (sessionStorage.getItem("eventTitle") != null && sessionStorage.getItem("eventTitle") != "" && sessionStorage.getItem("eventTitle") != undefined) {
                this.eventTitle = sessionStorage.getItem("eventTitle");
            } else this.eventTitle = ""
            this.faxForm.eventTitle = this.eventTitle; */
            this.isPhoneShow = true;
            this.isSmsShow = false;
            this.isFaxShow = false;
        },
        sms(newV) {
            this.$store.commit("setCopyBusinessCard", newV);
            this.isPhoneShow = false;
            this.isSmsShow = true;
            // 进入页面默认关联上事件
            this.$nextTick(() =>{
                this.$refs.smsDialog.msgForm.caseTitle = sessionStorage.getItem('eventTitle'); // 事件id
                this.$refs.smsDialog.msgForm.caseId = sessionStorage.getItem('newID'); // 事件标题
            })
            this.isFaxShow = false;
        },
        fax(item) {
            this.$store.commit("setSmsOrFax", "fax");
            if (sessionStorage.getItem("eventDealTitle") != null 
                && sessionStorage.getItem("eventDealTitle") != "" 
                && sessionStorage.getItem("eventDealTitle") != undefined) {
                this.eventTitle = sessionStorage.getItem("eventDealTitle");
            } else 
                this.eventTitle = ""

            this.isPhoneShow = false;
            this.isSmsShow = false;
            this.isFaxShow = true;

            this.ruleForm.name = item.leadername;
            this.ruleForm.leaderWorkunit = item.leaderWorkunit;
            this.ruleForm.instruction = item.approval;
            this.ruleForm.instructionsTime = item.approvalTime;
            this.faxId = item.id;
            sessionStorage.setItem('faxPdfPath', item.attachmentList[1].path);
        },
		transformationTime(data) { //转换时间格式
			return data < 10 ? '0' + data : data;
		},
        getTableList() {
            //获取列表
            this.eventId = sessionStorage.getItem('newID');
            if (
                this.eventId == '' ||
                this.eventId == null ||
                this.eventId == 'newID'
            ) {
                return;
            }
            let data = {
                eventId: this.eventId,
                page: this.currentPage,
                size: this.pageSize,
            };
            this.$http
                .get(window.g.ApiUrl + '/eos/event/approval/pageList', {
                    params: data,
                })
                .then(res => {
                    if (res.headers) {
                        res = res.data;
                    }
                    if (res.errorcode == '0') {
                        this.tableData = res.data.data;
                        this.total = res.data.totalElements;
                        for (let i in this.tableData) {
							if (this.tableData[i].approvalTime != null) {
								let publishDate = this.tableData[i].approvalTime.replace(/-/g, '/');
								let time = new Date(publishDate);
								let y = time.getFullYear();
								let m = time.getMonth() + 1;
                                let d = time.getDate();
                                let h = time.getHours();
                                let min = time.getMinutes();
								this.tableData[i].approvalTime = y + '-' + this.transformationTime(m) + '-' + this.transformationTime(d) + ' ' + this.transformationTime(h) + ':' + this.transformationTime(min);
							}
						}
                    } else {
                        //this.$message.error(res.msg);
                    }
                });
        },
        rowSelect(selection, row) {
            //用户手动勾选事件
            if (selection.length == 0) {
                this.restShow = true;
                this.saveShow = false;
                this.disabled = true;
                this.ruleForm.name = '';
                this.ruleForm.instructionsTime = '';
                this.ruleForm.instructionsType = '';
                this.instruction = '';
                this.form.checkList = [];
                this.tableRowData = [];
                this.radio = '';
                this.byFax = false;
                this.byPhone = false;
                this.bySms = false;
                this.id = '';
                this.ction = [];
                this.$refs.ruleForm.clearValidate();
                this.$refs.ruleForm.resetFields();
                return;
            }
            this.tableRowData = row;
            this.ction = selection;
            this.form.checkList = [];
            this.ruleForm.name = row.leadername;
            this.ruleForm.instructionsTime = row.approvalTime;
            this.ruleForm.instructionsType = row.approvaltype;
            this.instruction = row.approval;
            this.id = row.id;
            this.radio = row.deptType;
            this.byFax = false;
            this.byPhone = false;
            this.bySms = false;
            console.log(selection);
            if (selection[0].byFax == 1) {
                this.byFax = true;
            } else {
                this.byFax = false;
            }
            if (selection[0].byPhone == 1) {
                this.byPhone = true;
            } else {
                this.byPhone = false;
            }
            if (selection[0].bySms == 1) {
                this.bySms = true;
            } else {
                this.bySms = false;
            }
        },
        handleSizeChange(val) {
            //监听一页几条数据
            this.pageSize = val;
            this.getTableList();
            this.$refs.batchTable.clore();
            this.restShow = true;
            this.saveShow = false;
            this.disabled = true;
            this.ruleForm.name = '';
            this.ruleForm.instructionsTime = '';
            this.ruleForm.instructionsType = '';
            this.instruction = '';
            this.form.checkList = [];
            this.tableRowData = [];
            this.radio = '';
            this.byFax = false;
            this.byPhone = false;
            this.bySms = false;
            this.id = '';
            this.ction = [];
            this.$refs.ruleForm.clearValidate();
            this.$refs.ruleForm.resetFields();
        },
        pageMode(val) {
            //监听第几页
            this.currentPage = val;
            this.getTableList();
            this.$refs.batchTable.clore();
            this.restShow = true;
            this.saveShow = false;
            this.disabled = true;
            this.ruleForm.name = '';
            this.ruleForm.instructionsTime = '';
            this.ruleForm.instructionsType = '';
            this.instruction = '';
            this.form.checkList = [];
            this.tableRowData = [];
            this.radio = '';
            this.byFax = false;
            this.byPhone = false;
            this.bySms = false;
            this.id = '';
            this.ction = [];
            this.$refs.ruleForm.clearValidate();
            this.$refs.ruleForm.resetFields();
        },
        addReport() {
            //新增续报
            if (this.eventId == '' || this.eventId == null) {
                this.$message({
                    message: '暂无事件可以进行操作',
                    type: 'warning',
                });
                return;
            }
            if (this.eventId == 'newID') {
                this.$message({
                    message: '请选择保存事件!',
                    type: 'warning',
                });
                return;
            }
            this.dialogType = 'new';
            this.isShow = true;
            this.restShow = false;
            this.saveShow = true;
            this.disabled = false;
            this.dataType = '新增';
            this.ruleForm.name = '';
            this.ruleForm.leaderWorkunit = '';
            this.ruleForm.leaderPosition = '';
            this.ruleForm.instructionsTime = '';
            this.ruleForm.instructionsType = '指示';
            this.ruleForm.instruction = '';
            this.instruction = '';
            this.form.checkList = [];
            this.tableRowData = [];
            this.radio = '';
        },
        save(ruleForm) {
            this.$refs[ruleForm].validate(valid => {
                if (valid) {
                    this.isDisabled = true;
                    setTimeout(() => {
                        this.isDisabled = false;
                    }, 3000);
                    if (this.bySms == true) {
                        this.bySms = 1;
                    } else {
                        this.bySms = 0;
                    }
                    if (this.byPhone == true) {
                        this.byPhone = 1;
                    } else {
                        this.byPhone = 0;
                    }
                    if (this.byFax == true) {
                        this.byFax = 1;
                    } else {
                        this.byFax = 0;
                    }
                    let type = this.dataType;
                    let addData, upData;
                    switch (type) {
                        case '新增':
                            addData = {
                                data: {
                                    byFax: this.byFax,
                                    byPhone: this.byPhone,
                                    bySms: this.bySms,
                                    deptType: this.radio,
                                    eventId: this.eventId,
                                    approval: this.ruleForm.instruction,
                                    approvaltype: this.ruleForm
                                        .instructionsType,
                                    leadername: this.ruleForm.name,
                                    approvalTime: this.ruleForm
                                        .instructionsTime + ':00',
                                    leaderWorkunit: this.ruleForm
                                        .leaderWorkunit,
                                    leaderPosition: this.ruleForm
                                        .leaderPosition,
                                },
                            };
                            this.$api.leadAdd(addData).then(res => {
                                if (res.errorcode == '0') {
                                    this.$message({
                                        message: '保存成功',
                                        type: 'success',
                                    });
                                    this.isShow = false;
                                    this.restShow = true;
                                    this.saveShow = false;
                                    this.disabled = true;
                                    this.ruleForm.name = '';
                                    this.ruleForm.instructionsTime = '';
                                    this.ruleForm.instructionsType = '';
                                    this.ruleForm.leaderWorkunit = '';
                                    this.ruleForm.leaderPosition = '';
                                    this.instruction = '';
                                    this.form.checkList = [];
                                    this.tableRowData = [];
                                    this.radio = '';
                                    this.byFax = false;
                                    this.byPhone = false;
                                    this.bySms = false;
                                    this.id = '';
                                    this.ction = [];
                                    this.$refs.ruleForm.clearValidate();
                                    this.$refs.ruleForm.resetFields();
                                    let data = {
                                        eventId: this.eventId,
                                        page: this.currentPage,
                                        size: this.pageSize,
                                    };
                                    this.$http
                                        .get(
                                            window.g.ApiUrl +
                                                '/eos/event/approval/pageList',
                                            { params: data }
                                        )
                                        .then(res => {
                                            if (res.headers) {
                                                res = res.data;
                                            }
                                            if (res.errorcode == '0') {
                                                this.tableData = res.data.data;
                                                this.total = res.data.totalElements;
                                                for (let i in this.tableData) {
                                                    if (this.tableData[i].approvalTime != null) {
                                                        let publishDate = this.tableData[i].approvalTime.replace(/-/g, '/');
                                                        let time = new Date(publishDate);
                                                        let y = time.getFullYear();
                                                        let m = time.getMonth() + 1;
                                                        let d = time.getDate();
                                                        let h = time.getHours();
                                                        let min = time.getMinutes();
                                                        this.tableData[i].approvalTime = y + '-' + this.transformationTime(m) + '-' + this.transformationTime(d) + ' ' + this.transformationTime(h) + ':' + this.transformationTime(min);
                                                    }
                                                }
                                            } else {
                                                //this.$message.error(res.msg);
                                            }
                                        });
                                } else {
                                    //this.$message.error(res.msg);
                                }
                            });
                            break;

                        case '修改':
                            upData = {
                                data: {
                                    id: this.id,
                                    byFax: this.byFax,
                                    byPhone: this.byPhone,
                                    bySms: this.bySms,
                                    deptType: this.radio,
                                    eventId: this.eventId,
                                    approval: this.ruleForm.instruction,
                                    approvaltype: this.ruleForm
                                        .instructionsType,
                                    leadername: this.ruleForm.name,
                                    approvalTime: this.ruleForm
                                        .instructionsTime + ':00',
                                    leaderWorkunit: this.ruleForm
                                        .leaderWorkunit,
                                    leaderPosition: this.ruleForm
                                        .leaderPosition,
                                },
                            };
                            this.$api.leadUpdate(upData).then(res => {
                                if (res.errorcode == '0') {
                                    this.$message({
                                        message: '修改成功',
                                        type: 'success',
                                    });
                                    this.restShow = true;
                                    this.saveShow = false;
                                    this.isShow = false;
                                    this.disabled = true;
                                    this.ruleForm.name = '';
                                    this.ruleForm.instructionsTime = '';
                                    this.ruleForm.instructionsType = '';
                                    this.ruleForm.leaderWorkunit = '';
                                    this.ruleForm.leaderPosition = '';
                                    this.instruction = '';
                                    this.form.checkList = [];
                                    this.tableRowData = [];
                                    this.radio = '';
                                    this.byFax = false;
                                    this.byPhone = false;
                                    this.bySms = false;
                                    this.id = '';
                                    this.ction = [];
                                    this.$refs.ruleForm.clearValidate();
                                    this.$refs.ruleForm.resetFields();
                                    let data = {
                                        eventId: this.eventId,
                                        page: this.currentPage,
                                        size: this.pageSize,
                                    };
                                    this.$http
                                        .get(
                                            window.g.ApiUrl +
                                                '/eos/event/approval/pageList',
                                            { params: data }
                                        )
                                        .then(res => {
                                            if (res.headers) {
                                                res = res.data;
                                            }
                                            if (res.errorcode == '0') {
                                                this.tableData = res.data.data;
                                                this.total = res.data.totalElements;
                                                for (let i in this.tableData) {
                                                    if (this.tableData[i].approvalTime != null) {
                                                        let publishDate = this.tableData[i].approvalTime.replace(/-/g, '/');
                                                        let time = new Date(publishDate);
                                                        let y = time.getFullYear();
                                                        let m = time.getMonth() + 1;
                                                        let d = time.getDate();
                                                        let h = time.getHours();
                                                        let min = time.getMinutes();
                                                        this.tableData[i].approvalTime = y + '-' + this.transformationTime(m) + '-' + this.transformationTime(d) + ' ' + this.transformationTime(h) + ':' + this.transformationTime(min);
                                                    }
                                                }
                                            } else {
                                                //this.$message.error(res.msg);
                                            }
                                        });
                                } else {
                                    //this.$message.error(res.msg);
                                }
                            });
                            break;
                        default:
                            break;
                    }
                }
            });
        },
        updateContent(item) {
            //修改
            this.id = item.id;
            if (this.id == '' || this.id == null) {
                this.$message({
                    message: '请选择内容进行修改',
                    type: 'warning',
                });
                return;
            }
            if (this.eventId == 'newID') {
                this.$message({
                    message: '请选择保存事件!',
                    type: 'warning',
                });
                return;
            }
            console.log(this.ction);
            if (this.ction.length > 1) {
                this.$message({
                    message: '只能选择一个数据进行修改',
                    type: 'warning',
                });
                this.$refs.batchTable.clore();
                this.restShow = true;
                this.saveShow = false;
                this.disabled = true;
                this.ruleForm.name = '';
                this.ruleForm.instructionsTime = '';
                this.ruleForm.instructionsType = '';
                this.instruction = '';
                this.form.checkList = [];
                this.tableRowData = [];
                this.radio = '';
                this.byFax = false;
                this.byPhone = false;
                this.bySms = false;
                this.id = '';
                this.ction = [];
                this.$refs.ruleForm.clearValidate();
                this.$refs.ruleForm.resetFields();
                return;
            }
            this.dialogType = 'edit';
            this.isShow = true;
            this.dataType = '修改';
            this.objDisabled = false;
            this.disabled = false;
            this.restShow = false;
            this.saveShow = true;
            this.ruleForm.name = item.leadername;
            this.ruleForm.instructionsTime = item.approvalTime;
            this.ruleForm.instructionsType = item.approvaltype;
            this.ruleForm.leaderWorkunit = item.leaderWorkunit;
            this.ruleForm.leaderPosition = item.leaderPosition;
            this.ruleForm.instruction = item.approval;
        },
        rowDeleteLead(id) {
            this.$confirm('此操作将永久删除该批示, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    //删除
                    let singleId = [];
                    singleId.push(id);
                    let data = {
                        id: singleId,
                    };
                    this.$api.leadDelete(data).then(res => {
                        if (res.errorcode == '0') {
                            this.$message({
                                message: '删除成功',
                                type: 'success',
                            });
                            this.callOff();
                            let data = {
                                eventId: this.eventId,
                                page: this.currentPage,
                                size: this.pageSize,
                            };
                            this.$http
                                .get(
                                    window.g.ApiUrl +
                                        '/eos/event/approval/pageList',
                                    {
                                        params: data,
                                    }
                                )
                                .then(res => {
                                    if (res.headers) {
                                        res = res.data;
                                    }
                                    if (res.errorcode == '0') {
                                        this.tableData = res.data.data;
                                        this.total = res.data.totalElements;
                                        for (let i in this.tableData) {
                                            if (this.tableData[i].approvalTime != null) {
                                                let publishDate = this.tableData[i].approvalTime.replace(/-/g, '/');
                                                let time = new Date(publishDate);
                                                let y = time.getFullYear();
                                                let m = time.getMonth() + 1;
                                                let d = time.getDate();
                                                let h = time.getHours();
                                                let min = time.getMinutes();
                                                this.tableData[i].approvalTime = y + '-' + this.transformationTime(m) + '-' + this.transformationTime(d) + ' ' + this.transformationTime(h) + ':' + this.transformationTime(min);
                                            }
                                        }
                                    } else {
                                        //this.$message.error(res.msg);
                                    }
                                });
                        } else {
                        }
                    });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除',
                    });
                });
        },
        handleSelectionChange(val) {
            //全选
            this.arrayID = val;
        },
        deleteInBatches() {
            //批量删除
            if (this.arrayID.length == 0) {
                this.$message({
                    message: '请选择领导指示！',
                    type: 'warning',
                });
                return;
            }
            this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    let ids = []; //全选ID数组
                    let deleteCount = 0;
                    for (let i in this.arrayID) {
                        ids.push(this.arrayID[i].id);
                        deleteCount++;
                    }
                    console.log(deleteCount);
                    let data = {
                        id: ids,
                    };
                    this.$api.leadDelete(data).then(res => {
                        if (res.errorcode == '0') {
                            this.$message({
                                message: '删除成功',
                                type: 'success',
                            });
                            this.callOff();
                            this.getTableList();
                        } else {
                            //this.$message.error(res.msg);
                        }
                    });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除',
                    });
                });
        },
        callOff() {
            //取消续报
            this.isShow = false;
            return;
            this.$refs.batchTable.clore();
            this.restShow = true;
            this.saveShow = false;
            this.disabled = true;
            this.ruleForm.name = '';
            this.ruleForm.instructionsTime = '';
            this.ruleForm.instructionsType = '';
            this.instruction = '';
            this.form.checkList = [];
            this.tableRowData = [];
            this.radio = '';
            this.byFax = false;
            this.byPhone = false;
            this.bySms = false;
            this.id = '';
            this.ction = [];
            this.$refs.ruleForm.clearValidate();
            this.$refs.ruleForm.resetFields();
            // this.$refs[formName].resetFields();
        },
    },
};
</script>

<style scoped>
/deep/ .el-collapse-item__content {
    padding-bottom: 0;
}
/deep/ .el-collapse-item__header {
    height: 39px;
    background: #dae7f8;
}
.formStyle {
    margin-top: 20px;
}

.pishiBackColor {
    background-color: #3ea9fa;
}

.zhishiBackColor {
    background-color: #ffbe72;
}

.addButton {
    width: 100%;
    height: 70px;
    line-height: 70px;
    text-align: left;
    text-indent: 20px;
}

.conductor {
    display: flex;
    width: 100%;
}

.conductorLeft {
    flex: 2;
    text-align: left;
}

.leftLine {
    display: inline-block;
    width: 10%;
    border-top: 1px solid #ccc;
}

.rightLine {
    display: inline-block;
    width: 80%;
    border-top: 1px solid #ccc;
}

.txt {
    font-size: 14px;
    color: #686868;
    vertical-align: -4px;
}

.conductorLine {
    display: inline-block;
    width: 80%;
    border-top: 1px solid #ccc;
}

.conductorRight {
    flex: 3;
    text-align: center;
}

.radio {
    display: flex;
    text-align: left;
    padding: 10px 0 0 30px;
}

>>> .el-input__inner {
    height: 30px;
    line-height: 30px;
}

.formStyle >>> .el-date-editor.el-input,
.el-date-editor.el-input__inner {
    width: 100%;
}

/deep/.el-dialog__wrapper.adClass .el-dialog {
    height: 88vh;
    margin-bottom: 0px;
}

.addClass {
    width: 100%;
    height: 100%;
    margin: 0 auto;
}

.adClass {
    width: 100%;
    height: 100%;
    margin: 0 auto;
}

.adClass >>> .el-dialog__body {
    padding-top: 5px;
}

.adClass >>> .el-dialog {
    margin-top: 5vh !important;
}

.vertical_bar {
    width: 3px;
    height: 18px;
    background: #3f92fe;
}

.content_title_name {
    font-size: 17px;
    font-weight: bolder;
    color: #333333;
    margin-left: 18px;
}

.content_title_left {
    text-align: left;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 7px;
    margin-bottom: 15px;
}
</style>
