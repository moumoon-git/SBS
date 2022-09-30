<!--@author：wzm-->
<template>
  <div>
    <el-header class="navsBar" style="height: 80px">

      <el-col :span="9" style="text-align: left">
        <!--日期时间选择-->
        <el-date-picker v-model="time" readonly type="datetimerange" range-separator="至" start-placeholder="开始日期"
                        end-placeholder="结束日期">
        </el-date-picker>
      </el-col>
      <el-col :span="15">
        <el-row>
          <el-col :span="6">
            <el-select v-model="duty" disabled placeholder="请选择值班人员">
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="carryOn" placeholder="请选择接班人员">
              <el-option v-for="(item,index) in options" :key="index" :label="item.displayname" :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span='9'>
            <el-input type="password" placeholder="请输入登录密码" v-model="loginPassword" clearable>
              <template slot="prepend">登录密码:</template>
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-button @click="search" type="primary">交班</el-button>
          </el-col>
        </el-row>
      </el-col>

    </el-header>

    <el-main style="padding: 12px 20px 0">
      <el-row>
        <el-col :span="18">
          <div class="contentStyle">
            <div style=" height: 72px;line-height: 72px;text-align: left;">
              <add-button @handleAdd="dialogFormVisible = true"></add-button>&nbsp;&nbsp;
              <!-- 弹窗 -->
              <el-dialog :close-on-click-modal="false" title="登记值班日志" :visible.sync="dialogFormVisible">
                <el-form :model="form" :rules="rules" ref="form">
                  <el-form-item label="发生时间" :label-width="formLabelWidth" prop="timer">
                    <el-date-picker v-model="form.timer" type="datetime" placeholder="选择日期时间"></el-date-picker>

                  </el-form-item>
                  <el-form-item label="值班记录" :label-width="formLabelWidth" prop="name1">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="可输入三千字以内的内容" v-model="form.name1"
                              maxlength='10000'></el-input>
                  </el-form-item>
                  <el-form-item label="办理情况" :label-width="formLabelWidth" prop="name2">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="可输入三千字以内的内容" v-model="form.name2"
                              maxlength='10000'></el-input>
                  </el-form-item>
                  <el-form-item label="领导批示" :label-width="formLabelWidth" prop="name3">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="可输入三千字以内的内容" v-model="form.name3"
                              maxlength='10000'></el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="unadd">取 消</el-button>
                  <el-button type="primary" @click="add">确 定</el-button>
                </div>
              </el-dialog>
              <!-- 止 -->
              <edit-button @handleEdit='openchange'></edit-button>&nbsp;&nbsp;
              <!-- 弹窗 -->
              <el-dialog title="修改值班日志" :close-on-click-modal="false" :visible.sync="dialogFormVisible1">
                <el-form>
                  <el-form-item label="发生时间" :label-width="formLabelWidth">
                    <el-date-picker v-model="begintime" type="datetime" placeholder="选择日期时间"></el-date-picker>

                  </el-form-item>
                  <el-form-item label="值班记录" :label-width="formLabelWidth">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="可输入一万字以内的内容" v-model="record"
                              maxlength='10000'></el-input>
                  </el-form-item>
                  <el-form-item label="办理情况" :label-width="formLabelWidth">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="可输入一万字以内的内容" v-model="situation"
                              maxlength='10000'></el-input>
                  </el-form-item>
                  <el-form-item label="领导批示" :label-width="formLabelWidth">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="可输入一万字以内的内容" v-model="boss"
                              maxlength='10000'></el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="dialogFormVisible1 = false">取 消</el-button>
                  <el-button type="primary" @click="change">确 定</el-button>
                </div>
              </el-dialog>
              <!-- 止 -->
              <delete-button @handleDelete='delect'></delete-button>
              <!-- 弹窗 -->
              <!--              <el-dialog title="提示" :visible.sync="dialogFormVisible2" width="30%" center>-->
              <!--                <span>确定要删除该事件么？</span>-->
              <!--                <span slot="footer" class="dialog-footer">-->
              <!--                <el-button @click="dialogFormVisible2 = false">取 消</el-button>-->
              <!--                <el-button type="primary" @click="del">确 定</el-button>-->
              <!--                </span>-->
              <!--              </el-dialog>-->
              <select-incident @selectIncident='selectAll("选择事件")'></select-incident>
              <select-phone @selectPhone="selectAll('选择电话')"></select-phone>
              <select-note @selectNote="selectAll('选择短信')"></select-note>
              <!-- //弹框 -->
              <el-dialog class="msg_box" top='0' :close-on-click-modal="false" :modal='false' width='890px' :title="selectTitle"
                         :visible.sync="dialogTableVisible" :before-close="handleClose">
                <el-row>
                  <el-col :span="13">
                    <span>查询时间：</span>
                    <el-date-picker v-model="dataphone" type="daterange" range-separator="至" start-placeholder="开始日期"
                                    end-placeholder="结束日期"></el-date-picker>
                  </el-col>
                  <el-col :span="11">
                    <el-input class="ipt" :placeholder="selectPlaceholder" v-model="box_ipt" clearable></el-input>
                    <el-button type="primary" @click="box_lookup(1)">查询</el-button>
                  </el-col>
                  <!-- <span style="width:70px;display: inline-block;">关键字：</span> -->
                </el-row>

                <my-table @handleCurrentChange="click" :tableColumn="tableTitle" :tableData="selectTableData"></my-table>
                <!-- 分页器 -->
                <el-pagination :small="pagingSize" :total="selectTotal" @current-change="selectPageChange"
                               :current-page.sync="selectPage" layout="total, prev, pager, next, jumper">
                </el-pagination>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="handleClose()">取 消</el-button>
                  <el-button type="primary" @click="succees">确 定</el-button>
                </span>
                <!-- <el-button @click="succees" type="primary">确定</el-button> -->
              </el-dialog>
              <!-- 止 -->
            </div>
            <div class="tableContainer">
              <my-table :tableColumn="tableColumn" @handleCurrentChange="test" :tableData="tableData"></my-table>
              <!--              <el-pagination :small="pagingSize"-->
              <!--                             :total="total"-->
              <!--                             @current-change="handleNodeClick"-->
              <!--                             :current-page.sync="currentPage"-->
              <!--                            layout="total, prev, pager, next , jumper">-->
              <!--              </el-pagination> &lt;!&ndash; :page-size="pageSize"&ndash;&gt;-->
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="contactsPanel">
            <!-- 右侧表单-->
            <equipment-state ref="fromDate" @submitForm="submitForm" :ruleForm="ruleForm"></equipment-state>
          </div>

        </el-col>
      </el-row>
    </el-main>


  </div>
</template>

<script>
    import Qs from 'qs';
    import md5 from 'js-md5';
    import AddButton from '@/components/button/addButton'
    import EditButton from "@/components/button/editButton"
    import DeleteButton from "@/components/button/deleteButton"
    import selectIncident from "@/components/button/selectIncident"
    import selectPhone from "@/components/button/selectPhone"
    import selectNote from "@/components/button/selectNote"
    import myTable from "@/components/tables/tables"
    import equipmentState from "@/view/dutyManagement/logBook/dutyLog/fromDate"
    export default {
        name: "dutyLog",
        components: {
            myTable,
            AddButton,
            EditButton,
            DeleteButton,
            selectIncident,
            selectPhone,
            selectNote,
            equipmentState
        },
        inject:['reload'],
        data() {

            return {
                // 选择事件
                time: [],
                dialogTableVisible: false,
                dataphone: "",
                box_ipt: '',
                tableTitle: [],
                tableTitle1: [{
                    prop: "eventCode",
                    label: "事件编号"
                },
                    {
                        prop: "title",
                        label: "事件标题"
                    }, {
                        prop: "eventTypeName",
                        label: "事件类型"
                    }, {
                        prop: "occurTime",
                        label: "事发时间"
                    }, {
                        prop: "areaName",
                        label: "事发区域"
                    }, {
                        prop: "eventLevelName",
                        label: "事件等级"
                    }, {
                        prop: "operatorName",
                        label: "接报人"
                    }
                ], //表头
                tableTitle2: [{
                    prop: "direct",
                    label: "类型"
                },
                    {
                        prop: "agentName",
                        label: "坐席"
                    }, {
                        prop: "contactor",
                        label: "联系人"
                    }, {
                        prop: "call",
                        label: "联系电话"
                    }, {
                        prop: "workUnit",
                        label: "工作单位"
                    }, {
                        prop: "position",
                        label: "职务"
                    }, {
                        prop: "operator",
                        label: "值班员"
                    }, {
                        prop: "startTime",
                        label: "呼叫时间"
                    }, {
                        prop: "endTime",
                        label: "接通时间"
                    }, {
                        prop: "diffTime",
                        label: "通话时长"
                    }
                ],
                tableTitle3: [{
                    prop: "direct",
                    label: "收发方向"
                },
                    {
                        prop: "contactor",
                        label: "联系人"
                    }, {
                        prop: "workUnit",
                        label: "工作单位"
                    }, {
                        prop: "position",
                        label: "职务"
                    }, {
                        prop: "call",
                        label: "联系号码"
                    }, {
                        prop: "sendTime",
                        label: "发送时间"
                    }, {
                        prop: "status",
                        label: "状态"
                    }, {
                        prop: "receipt",
                        label: "回执"
                    }
                ],
                selectTableData: [],
                occurTime: '', //时间
                reportDescription: '', //值班记录
                status: '', //办理情况
                diongboss: '', //领导批示
                diongid: "",
                // 止
                // 选择短信
                dialogmsg: false,
                bigid: '', //大事件id
                options: [], //值班人员数据
                duty: '', //值班人员
                dutys: [],
                dutyid: '', //值班人员id
                personnel: [], //接班人员数据
                carryOn: '', //接班人员id
                loginPassword: '', //登录密码
                dialogFormVisible: false, //add弹窗
                dialogFormVisible1: false, //change弹窗
                dialogFormVisible2: false, //add弹窗
                // timer: '', //弹窗时间
                //选中的表格中的行数据
                id: '', //事件id
                begintime: '', //时间
                record: '', //记录
                situation: '', //办理情况，
                boss: '', //领带批示
                form: {
                    timer: '', //弹窗时间
                    name1: '',
                    name2: '',
                    name3: '',
                    region: '',
                },
                formLabelWidth: '120px',
                tableColumn: [{
                    prop: "operateTime",
                    label: "时间"
                }, {
                    prop: "event",
                    label: "值班记录"
                }, {
                    prop: "operation",
                    label: "办理情况"
                }, {
                    prop: "leadershipInstructions",
                    label: "领导批示"
                }], //表头
                tableData: [], //表格数据
                total: 0, //数据总数
                pageSize: 1, //总页数
                currentPage: 1, //当前页数
                pagingSize: false, //分页大小
                ruleForm: {
                    radio: '1',
                    breakDown: '',
                    eventDeal: '',
                    handover: '',
                    remindConfirmDuty: false
                },
                //author:husiyue date:2020-10-14 bug:7441
                rules:{
                    timer:[
                        {type:'date', required:true, message:'请选择发生时间', trigger:'change'}
                    ],
                    name1:[
                        {required:true, message:'请填写值班记录', trigger:'blur'}
                    ]

                },
                selectTitle: '',
                selectTotal: 0, //弹框数据总数
                selectPage: 1, //弹框当前页数
                namelogin: '',
                box_lookupClick: '',
                // pathname:'/dutyLog',
                selectPlaceholder:''
            }
        },
        methods: {
            axios() {
                // console.log(new Date(2000, 10, 10, 10, 10))
                // 获取当前日期

                var dat = new Date();
                // console.log(dat);
                var year = dat.getFullYear();
                var month = dat.getMonth() + 1;
                var day = dat.getDate();
                day = (day < 10 ? "0" + day : day);
                month = (month < 10 ? "0" + month : month);
                var hour = dat.getHours();
                hour = (hour < 10 ? "0" + hour : hour);
                var minutes = dat.getMinutes()
                minutes = (minutes < 10 ? "0" + minutes : minutes);
                var seconds = dat.getSeconds()
                seconds = (seconds < 10 ? "0" + seconds : seconds);
                // this.time.push(start)
                // this.time.push(end)
                // console.log(hour)
                if (hour >= 8) {
                    var start = (year + '-' + month + '-' + day + ' ' + '08:00:00');
                    var end = (year + '-' + month + '-' + day + ' ' + '18:00:00');
                    this.time = [start, end]
                } else {
                    var start = (year + '-' + month + '-' + day + ' ' + '18:00:00');
                    var day2 = dat.getDate() + 1;
                    var end = (year + '-' + month + '-' + day2 + ' ' + '08:00:00');
                    this.time = [start, end]
                }
                // console.log(this.time[0],this.time[1])
                var years = year + '-' + month + '-' + day
                var mintens = hour + ':' + minutes + ':' + seconds
                let data = {
                    currentDate: years,
                    currentTime: mintens
                };
                //  请求
                this.$api.dutyLog(data).then((res) => {
                    console.log(res)
                    this.duty = res.data.bigName
                    // this.dutyid=res.data.bigId
                    if (res.errorcode != 0) {
                        // console.log(res.data.bigId)
                        this.time = [res.data.start, res.data.end]
                    } else {
                        //     // 返回的数据赋值给table
                        this.time = [res.data.appDutyLog.dateStart, res.data.appDutyLog.dateEnd]; //时间
                        if (res.data.appDutyLog.breakDown != '') {
                            this.ruleForm.radio = '0';
                            this.$refs.fromDate.forbidden = false;
                            this.$refs.fromDate.eventDeal = '异常';
                        } else {
                            this.ruleForm.radio = '1';
                            this.$refs.fromDate.forbidden = true;
                            this.$refs.fromDate.eventDeal = '正常';
                        }
                        this.ruleForm.breakDown = res.data.appDutyLog.breakDown;
                        this.ruleForm.eventDeal = res.data.appDutyLog.eventDeal;
                        this.ruleForm.handover = res.data.appDutyLog.handover;
                        this.ruleForm.remindConfirmDuty = !(res.data.appDutyLog.confirmed && res.data.appDutyLog.confirmed === 1);
                        //     //  值班人员数据等等
                        this.tableData = res.data.appDutyLogOperations;
                        this.total = res.data.appDutyLogOperations.length;
                        // this.carryOn=res.data.dutyLog.secondDutyOperator;
                        this.bigid = res.data.appDutyLog.id;
                        console.log(res.data.appDutyLog.id)
                        // this.duty=res.data.dutyLog.primaryDutyOperator;//值班人员
                        this.dutyid = res.data.appDutyLog.primaryDutyOpeartor; ///值班人员id
                        // this.carryOn=res.data.dutyLog.secondaryDutyOpeartor ,//接班人员
                        // this.carryOn=res.data.appDutyLog.secondaryDutyOpeartor1//接班人员id
                    }

                    console.log(this.dutyid)
                })


            },
          handleClose() {
            this.dataphone = null
            this.box_lookupClick = null
            this.dialogTableVisible = false
          },


            //分页
            // handleNodeClick(){
            //           let data = {
            //               currentDate:years,
            //               currentTime:mintens
            //           }
            //     //  请求
            //     this.$api.dutyLog(data).then((res) => {
            //         console.log(res)})
            //       },
            //交班请求
            search() {
                let displayname = ""
                for (let i = 0; i < this.options.length; i++) {
                    if (this.carryOn == this.options[i].id) {
                        console.log(this.options[i].name)
                        this.namelogin = this.options[i].name
                        displayname = this.options[i].displayname
                    }
                }
                if(this.namelogin==''||this.loginPassword==''){
                    this.$message({
                        message: '请输入交班人账号或密码！',
                        type: "warning"
                    });
                    return
                }
                let tex = {
                    "data": {
                        // id: this.bigid,
                        dateStart: this.time[0],
                        dateEnd: this.time[1],
                        // primaryDutyOpeartor:this.dutyid,		//值班员
                        secondaryDutyOpeartor1: this.carryOn, //接班员 不是必需
                        handover: this.ruleForm.handover, //领导交办
                        breakDown: this.ruleForm.breakDown, //故障描述
                        eventDeal: this.ruleForm.eventDeal, //事件处理
                        username: this.namelogin,
                        password: md5(this.loginPassword),
                        confirmed: this.ruleForm.remindConfirmDuty ? 0 : 1 //提醒接班人员
                    },
                };
                this.$api.handover(tex).then((res) => {
                    if (res.errorcode == 0) {
                        console.log(this.carryOn)
                        console.log(this.loginPassword)

                        if (this.carryOn == '' || this.carryOn == null || this.carryOn == undefined) {
                            this.$message({
                                message: '请输入账号密码',
                                type: "error"
                            });
                            return
                        }
                        let data = new FormData()
                        data.append('username', this.namelogin)
                        data.append('password', md5(this.loginPassword))
                        //  请求
                        this.$api.login(data).then((res) => {
                            console.log(res)
                            if (res.errorcode != 0) {
                                this.$message({
                                    message: res.msg,
                                    type: "error"
                                });
                                return;
                            }
                            this.$message({
                                message: '交班成功',
                                type: 'success'
                            });
                            this.userName = sessionStorage.setItem("displayname", displayname);
                            this.carryOn = ''
                            this.loginPassword = '';
                            this.axios()
                            this.reload()
                            // this.$router.push({
                            //     path:this.pathname
                            // });
                            // window.location.reload()
                        })
                    } else {
                        // console.log(this.carryOn)
                        // this.dutyid=res.data.bigId
                        // console.log(this.dutyid)
                        // this.axios();
                        // this.carryOn='';
                        // this.loginPassword=''
                        // this.$message({
                        //     message: '交班成功',
                        //     type: 'success'
                        // });
                        this.$message({
                            message: res.msg,
                            type: 'error'
                        });
                    }
                })



            },
            //增加
            add(valid) {
                if(valid){
                console.log(this.bigid)
                console.log(this.form.timer)
                if (this.form.timer != '' && this.form.name1 != '') {
                    let tex = {
                        "data": {
                            id: this.bigid,
                            dateStart: this.time[0],
                            dateEnd: this.time[1],
                            // primaryDutyOpeartor:this.dutyid,		//值班员
                            secondaryDutyOpeartor1: this.carryOn, //接班员 不是必需
                            handover: this.ruleForm.handover, //领导交办
                            breakDown: this.ruleForm.breakDown, //故障描述
                            eventDeal: this.ruleForm.eventDeal, //事件处理
                            confirmed: this.ruleForm.remindConfirmDuty ? 0 : 1 //提醒接班人员
                        },
                    };
                    console.log(tex)
                    this.$api.dutyLogupdate(tex).then((res) => {
                        console.log(res)
                        this.bigid = res.data

                        //一条数据的四个内容
                        let hour = this.formatDateTime(this.form.timer)
                        console.log(hour)
                        console.log(this.form.name1)
                        console.log(this.form.name2)
                        console.log(this.form.name3)
                        console.log(this.time[0])

                        let text = {
                            operateTime: hour,
                            event: this.form.name1,
                            operation: this.form.name2,
                            leadershipInstructions: this.form.name3
                        }

                        let data = {
                            "data": {
                                dutyLogId: this.bigid, //duty_log 主键id
                                operateTime: hour, //时间
                                event: this.form.name1, //值班记录
                                operation: this.form.name2, //办理情况
                                leadershipInstructions: this.form.name3 //领导批示
                            }
                        }
                        console.log(this.bigid)
                        this.$api.dutyLogadd(data).then((res) => {
                            if (res.errorcode != 0) {
                                this.$message({
                                    message: res.msg,
                                })
                            } else {
                                // this.tableData.push(text)
                                this.dialogFormVisible = false
                                this.$message({
                                    message: '成功添加一条记录',
                                    type: 'success'
                                });
                            }
                            //添加到表格的数组里

                            this.form.timer = ''
                            this.form.name1 = ''
                            this.form.name2 = ''
                            this.form.name3 = ''
                            this.axios();
                            return
                        })
                    })
                } 
                // else if (this.form.timer == '') {
                //     this.$message({
                //         showClose: true,
                //         message: '时间不能为空哦!',
                //         type: 'warning'
                //     });

                // } else if (this.form.name1 == '') {
                //     this.$message({
                //         showClose: true,
                //         message: '记录不能为空哦!',
                //         type: 'warning'
                //     });

                // } else {
                //     this.$message({
                //         showClose: true,
                //         message: '格式错误!',
                //         type: 'warning'
                //     });
                // }

}
            },
            test(row) {
                console.log(row.id)
                // console.log(row.event)
                // console.log(row.operation)
                // console.log(row.leadershipInstructions)
                this.begintime = row.operateTime;
                this.record = row.event;
                this.id = row.id;
                this.situation = row.operation;
                this.boss = row.leadershipInstructions;
            },
            //修改
            openchange() {
                if (this.id) {
                    this.dialogFormVisible1 = true
                } else {
                    this.$message({
                        type: 'info',
                        message: '请选择一个值班日志'
                    });
                }
            },
            change() {
                console.log(this.begintime)
                console.log(this.formatDateTime(this.begintime));
                let time = '';
                if (!this.begintime) {
                    this.$message({
                        message: '时间不能为空！',
                        type: 'warning'
                    });
                    return;
                }

                this.dialogFormVisible1 = false
                let data = {
                    "data": {
                        id: this.id,
                        dutyLogId: this.bigid, //duty_log 主键id
                        operateTime: this.formatDateTime(this.begintime), //时间
                        event: this.record, //值班记录
                        operation: this.situation, //办理情况
                        leadershipInstructions: this.boss //领导批示
                    }
                };
                this.$api.dutyLogchange(data).then((res) => {
                    if (res.errorcode != 0) {
                        this.$message({
                            message: res.msg,
                        });
                        return
                    }
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                    this.axios();
                })
            },
            //删除
            delect() {
                if (this.id) {
                    this.$confirm('确认删除该日志, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let data = {
                            id: this.id,
                            // dutyLogId: this.bigid,	//duty_log 主键id
                        };
                        this.$api.dutyLogdel(data).then((res) => {
                            if (res.errorcode != 0) {
                                this.$message({
                                    message: res.msg,
                                    type: "error"
                                });
                            } else {
                                this.$message({
                                    type: 'success',
                                    message: '已删除'
                                });
                            }
                            this.axios();
                            this.id = ''
                        });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                } else {
                    this.$message({
                        type: 'info',
                        message: '请选择一个值班日志'
                    });
                }
            },
            // del(){
            //   let data={
            //        id:this.id,
            //        // dutyLogId: this.bigid,	//duty_log 主键id
            //          };
            //          console.log(this.id)
            //    this.$api.dutyLogdel(data).then((res) =>{
            //        if (res.errorcode!=0){
            //            this.$message({
            //                message:res.msg,
            //                type:"error"
            //            });
            //            return
            //        }
            //        this.axios();
            //    });
            //    this.dialogFormVisible2 = false
            // },
            submitForm(malfunction, eventDeal, assign) {
                console.log(malfunction);
                console.log(eventDeal);
                console.log(assign);
                console.log(this.carryOn);
                //  console.log(this.time[0])
                //  console.log(this.time[1])
                //  console.log(this.duty)
                //  console.log(this.carryOn)
                let data = {
                    "data": {
                        id: this.bigid,
                        dateStart: this.time[0],
                        dateEnd: this.time[1],
                        // primaryDutyOpeartor : this.dutyid,		//值班员
                        secondaryDutyOpeartor1: this.carryOn, //接班员 不是必需
                        handover: assign, //领导交办
                        breakDown: malfunction, //故障描述
                        eventDeal: eventDeal, //事件处理
                        confirmed: this.ruleForm.remindConfirmDuty ? 0 : 1 //提醒接班人员
                    }
                };

                this.$api.dutyLogupdate(data).then((res) => {
                    console.log(res)
                    if (res.errorcode != 0) {
                        this.$message({
                            message: res.msg,
                            type: "error"
                        });
                    }
                    this.$message({
                        message: '保存成功',
                        type: "success"
                    });
                    this.bigid = res.data
                })
            },
            formatDateTime(time) {
                console.log(time);
                let date = new Date(time);
                let y = date.getFullYear();
                let m = date.getMonth() + 1;
                m = m < 10 ? ('0' + m) : m;
                let d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                let h = date.getHours();
                h = h < 10 ? ('0' + h) : h;
                let f = date.getMinutes();
                f = f < 10 ? ('0' + f) : f;
                let s = date.getSeconds();
                s = s < 10 ? ('0' + s) : s;
                return y + '-' + m + '-' + d + ' ' + h + ':' + f + ':' + s;
            },
            formatDateTime1(time) {
                if (time == undefined) {
                    time = ''
                } else {

                    console.log(time);
                    let date = time;
                    let y = date.getFullYear();
                    let m = date.getMonth() + 1;
                    m = m < 10 ? ('0' + m) : m;
                    let d = date.getDate();
                    d = d < 10 ? ('0' + d) : d;
                    let h = date.getHours();
                    h = h < 10 ? ('0' + h) : h;
                    let f = date.getMinutes();
                    f = f < 10 ? ('0' + f) : f;
                    return y + '-' + m + '-' + d;
                }
            },
            // 选择事件
            box_lookup(page) {
                console.log(this.dataphone);
                let time1 = '';
                let time2 = '';
                if (this.dataphone) {
                    time1 = this.formatDateTime1(this.dataphone[0]);
                    time2 = this.formatDateTime1(this.dataphone[1]);
                }
                this.selectPage = 1;
                // if (page == 0) {
                //     this.selectPage = 1;
                // }
                let search = this.box_ipt;
                this.box_lookupClick = [time1, time2, search];
                console.log(time1, time2)
                if (this.selectTitle == '选择事件') {

                    let data = {
                        callType: 0,
                        dtStart: time1,
                        dtEnd: time2,
                        searchText: this.box_ipt,
                        page: this.selectPage,
                        size: 10
                    };
                    this.$api.todolist(data).then((res) => {
                        console.log(res);
                        this.selectTableData = res.data.data;
                        this.selectTotal = res.data.totalElements;
                    })
                } else if (this.selectTitle == '选择电话') {
                    let data = {
                        dtStart: time1,
                        dtEnd: time2,
                        searchText: this.box_ipt,
                        page: this.selectPage,
                        size: 10
                    }
                    this.$api.all(data).then((res) => {
                        console.log(res);
                        this.selectTableData = res.data.data;
                        this.selectTotal = res.data.totalElements;
                    })
                } else {
                    let data = {
                        dtStart: time1,
                        dtEnd: time2,
                        searchText: this.box_ipt,
                        page: this.selectPage,
                        smsType: '',
                        size: 10
                    }
                    this.$api.msg_box(data).then((res) => {
                        console.log(res);
                        this.selectTableData = res.data.data;
                        this.selectTotal = res.data.totalElements;
                    })

                }

            },
            click(row) {
                console.log(row);
                this.diongid = row.id //id
                if (this.selectTitle == '选择事件') {
                    this.reportDescription = row.reportDescription //值班记录
                    this.occurTime = row.occurTime
                    let data = {
                        eventId: this.diongid,
                    }
                    this.$api.dutyLogboss(data).then((res) => {
                        console.log(res)
                        this.status = row.messure //办理情况
                        if (row.approval == null) {
                            this.diongboss = ''
                        } else {
                            this.diongboss = row.approval
                        }
                    })
                } else if (this.selectTitle == '选择电话') {
                    if (row.direct == '已拨') {
                        this.reportDescription = '致电' + row.position + row.contactor + row.called
                    } else if (row.direct == '已接') {
                        this.reportDescription = row.position + row.contactor + row.called + '来电'
                    } else {
                        this.reportDescription = row.position + row.contactor + row.called + '来电，' + '操作员：' + row.operator
                    }
                    console.log(this.reportDescription)
                    this.status = ''
                    this.diongboss = ''
                    this.occurTime = row.startTime
                } else {
                    if (row.type == '发送') {
                        this.reportDescription = '发给' + row.workUnit + row.position + row.contactor + row.call + '一条消息，内容为' + row.content
                    } else {
                        this.reportDescription = row.workUnit + row.position + row.contactor + row.call + '发来一条消息，内容为' + row.content +
                            '操作员：' + row.operator
                    }
                    console.log(this.reportDescription)
                    this.status = ''
                    this.diongboss = ''
                    this.occurTime = row.sendTime
                }
            },
            succees() {
                console.log(this.bigid);
                console.log(this.diongid)
                if (this.diongid == '') {
                    this.$message({
                        type: 'info',
                        message: '你还没有选中相关数据哦'
                    });
                    return
                }
                if (this.bigid == undefined) {
                    this.bigid = ''
                }
                let tex = {
                    "data": {
                        id: this.bigid,
                        dateStart: this.time[0],
                        dateEnd: this.time[1],
                        // primaryDutyOpeartor:this.dutyid,		//值班员
                        secondaryDutyOpeartor1: this.carryOn, //接班员 不是必需
                        handover: this.ruleForm.handover, //领导交办
                        breakDown: this.ruleForm.breakDown, //故障描述
                        eventDeal: this.ruleForm.eventDeal, //事件处理
                        confirmed: this.ruleForm.remindConfirmDuty ? 0 : 1 //提醒接班人员
                    },
                };
                console.log(tex)
                this.$api.dutyLogupdate(tex).then((res) => {
                    console.log(res)
                    this.bigid = res.data
                    if (this.reportDescription == '') {
                        this.$message.error('这条事件的记录为空，不能添加哦');
                    } else {
                        let text = {
                            operateTime: this.occurTime,
                            event: this.reportDescription,
                            operation: this.status,
                            leadershipInstructions: this.diongboss
                        }
                        //添加到表格的数组里

                        let data = {
                            "data": {
                                dutyLogId: this.bigid, //duty_log 主键id
                                operateTime: this.occurTime? this.occurTime:'', //时间
                                event: this.reportDescription, //值班记录
                                operation: this.status, //办理情况
                                leadershipInstructions: this.diongboss //领导批示
                            }
                        }
                        console.log(data)
                        this.$api.dutyLogadd(data).then((res) => {
                            console.log(res)
                            if (res.errorcode != 0) {
                                this.$message({
                                    message: res.msg,
                                    type: "error"
                                });
                            } else {
                                this.$message({
                                    message: '添加成功',
                                    type: "success"
                                });
                                //this.tableData.push(text)
                                this.axios();
                                this.dialogTableVisible = false
                                this.box_ipt = ''
                                this.dataphone = []
                            }

                        })

                    }
                })
            },
            selectAll(selectEven) {
                this.diongid = ''
                this.box_ipt = '';
                this.dataphone = '';
                this.selectTitle = selectEven;
                this.dialogTableVisible = true;
                this.selectPage = 1; //初始化，默认第一页开始
                this.selectTotal = 0; //初始化，默认总条数0
                if (selectEven == '选择事件') {
                    this.tableTitle = this.tableTitle1;
                    this.selectPlaceholder = '请输入事件标题';
                    this.selectEvens();
                } else if (selectEven == '选择电话') {
                    this.tableTitle = this.tableTitle2;
                    this.selectPlaceholder = '请输入联系人/联系电话';
                    this.selectPhone();
                } else if (selectEven == '选择短信') {
                    this.tableTitle = this.tableTitle3;
                    this.selectPlaceholder = '请输入联系人/联系号码';
                    this.selectNote();
                }
            },
            /*选择事件后台数据*/
            selectEvens() {
                /* let time1 = '';
                let time2 = '';
                if(this.dataphone){
                     time1 = this.formatDateTime1(this.dataphone[0]);
                     time2 = this.formatDateTime1(this.dataphone[1]);
                } */
                // console.log(this.box_lookupClick)
                let data = {
                    callType: 0,
                    dtStart: this.box_lookupClick ? this.box_lookupClick[0] : '',
                    dtEnd: this.box_lookupClick ? this.box_lookupClick[1] : '',
                    searchText: this.box_lookupClick ? this.box_lookupClick[2] : '',
                    page: this.selectPage,
                    size: 10
                };
                this.$api.todolist(data).then((res) => {
                    this.selectTableData = res.data.data
                    this.selectTotal = res.data.totalElements;
                })
            },
            /*选择电话后台数据*/
            selectPhone() {
                /* let time1;
                        let time2;
                        if(this.dataphone!=undefined){
                            time1 = this.formatDateTime1(this.dataphone[0]);
                            time2 = this.formatDateTime1(this.dataphone[1]);
                        }
                        else{
                            time1='';
                            time2=''
                        }
                      console.log(this.selectPage) */
                let data = {
                  dtStart: this.box_lookupClick ? this.box_lookupClick[0] : '',
                  dtEnd: this.box_lookupClick ? this.box_lookupClick[1] : '',
                  searchText: this.box_lookupClick ? this.box_lookupClick[2] : '',
                    page: this.selectPage,
                    size: 10
                };
                this.$api.all(data).then((res) => {
                    this.selectTableData = res.data.data
                    this.selectTotal = res.data.totalElements;
                })
            },
            /*选择短信后台数据*/
            selectNote() {
                /* let time1;
                let time2;
                if(this.dataphone!=undefined){
                    time1 = this.formatDateTime1(this.dataphone[0]);
                    time2 = this.formatDateTime1(this.dataphone[1]);
                }
                else{
                    time1='';
                    time2=''
                } */
                let data = {
                  dtStart: this.box_lookupClick ? this.box_lookupClick[0] : '',
                  dtEnd: this.box_lookupClick ? this.box_lookupClick[1] : '',
                  searchText: this.box_lookupClick ? this.box_lookupClick[2] : '',
                  page: this.selectPage,
                  smsType: '',
                  size: 10
                };
                this.$api.msg_box(data).then((res) => {
                    this.selectTableData = res.data.data
                    this.selectTotal = res.data.totalElements;
                });
            },
            selectPageChange() {
                if (this.selectTitle == '选择事件') {
                    this.selectEvens();
                } else if (this.selectTitle == '选择电话') {
                    this.selectPhone();
                } else if (this.selectTitle == '选择短信') {
                    this.selectNote();
                }
            },
            unadd() {
                // this.dialogFormVisible = false
                // this.form.timer = ''
                // this.form.name1 = ''
                // this.form.name2 = ''
                // this.form.name3 = ''
                this.$nextTick(() => {
                    this.$refs['form'].resetFields();
                });
                this.dialogFormVisible = false
            },
            axios2() {
                let data = {

                };
                //  请求
                // 接班人员数据
                this.$api.dutyLog_man(data).then((res) => {
                    console.log(res.data)
                    // 返回的数据赋值给table
                    //值班人员数据
                    this.options = res.data
                    // console.log(res.data.data[1].diffTime)
                    // 把数据赋值给总共的数据总数total
                    // this.total = res.data.totalElements;
                    // 把remark（备注）赋值给name
                    // this.formLabelAlign.name = res.data.data.remark
                });

            }

        },
        mounted() {
            // this.duty=sessionStorage.getItem('displayname')
            this.axios();
            var d = new Date();
            var y = d.getFullYear();
            var m = d.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            var resDate = y + '-' + m;
            // console.log('1')
            this.month = resDate
            // this.axios();
            this.axios2()


        },
    }
</script>

<style scoped>
  .contentStyle {
    height: 682px;
    margin: 0 20px 0 10px;
    padding: 0 20px;
    background-color: white;
    box-sizing: border-box;
    border: 1px solid rgba(219, 219, 219, 1);
    border-radius: 3px;
  }

  .contactsPanel {
    width: 100%;
    height: 682px;
    padding: 0 15px;
    background-color: rgba(255, 255, 255, 1);
    box-sizing: border-box;
    border: 1px solid rgba(219, 219, 219, 1);
    border-radius: 3px;
    overflow-y: auto;
  }

  .navsBar {
    margin: 0 30px;
    background-color: white;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    border: 1px solid rgba(219, 219, 219, 1);
    border-radius: 3px;
  }

  .tableContainer {
    padding: 6px;
    box-sizing: border-box;
    border: 1px solid rgba(211, 215, 219, 1);
  }

  .ipt {
    width: 300px;
  }

  .msg_box {
    position: fixed;
    z-index: 9999;
  }

  >>>.el-dialog__header {
    padding: 0 10px;
  }

  >>>.el-dialog__body {
    padding: 0 20px 20px 20px;
  }
</style>
