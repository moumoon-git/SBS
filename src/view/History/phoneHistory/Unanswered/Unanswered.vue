<!--@author：wzm-->
<template>
  <div class="out">
    <el-tabs type="border-card" class="card">
      <p class="top">
        <!--        <el-button type="primary">查看联系人</el-button>-->
        <el-button @click="openEvent" type="primary">登记事件</el-button>
        <el-button @click="byebye" type="primary">防骚扰</el-button>
        <el-button @click="out" type="primary">导出</el-button>
        <el-button  @click="called" type="primary">呼叫</el-button>
        <span class="span">从</span>
        <el-date-picker v-model="data" type="daterange" range-separator="至" start-placeholder="开始日期"
                        end-placeholder="结束日期" @change="clearClick"></el-date-picker>
        <el-input class="ipt" placeholder="输入电话/姓名" v-model="search" clearable></el-input>
        <el-button @click="lookup" type="primary">查找</el-button>
      </p>
      <!-- 表格-->
      <div class="tab">
        <my-table ref='singleTable' @handleCurrentChange="test" @handleRowDbClick="handleRowDbClick" :tableColumn="tableColumn" :tableData="tableData"></my-table>
      </div>
      <!-- 底部 -->
      <div class="bottom_">
        <!-- 分页器 -->
        <el-pagination :small="pagingSize" :page-size="pageSize" :total="total"
                       @current-change="handleCurrentChange"
                       :current-page.sync="currentPage"
                       layout="total, prev, pager, next, jumper"></el-pagination>

        <div class="btm_">
          <!-- 右侧 -->
          <div class="btm">
            <el-form label-width="120px" :model="formLabelAlign">
              <el-form-item label="备注">
                <el-input class="btm_input" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="formLabelAlign.name">
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-button @click="ok" type="primary">保存</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <contact-details-popup ref="ContactDetailsPopup" @getContactorList="getContactorList"></contact-details-popup>
      </div>
    </el-tabs>
  </div>
</template>

<script>
    import myTable from "@/components/tables/tables"
    import ContactDetailsPopup from "@/view/integratedCommunication/contactDetailsPopup";

    export default {
        name: 'Unanswered',
        data() {
            return {
                seatNumber:sessionStorage.getItem("seat"),
                agent_id:sessionStorage.getItem("agent_id"),
                HWICP_Version: window.g.HWICP_Version,//icp版本
                //弹窗的数据
                contactorid:'',
                contactForm: {
                    id: "",//联系人id
                    name: "",//姓名
                    sex: '',//性别 默认为0（未知）
                    position: "",//职务
                    workUnit: "",//工作单位
                    mobile: "",//手机号码
                    otherTel: "",//备用手机
                    temobile: "",//手持终端
                    officeTel: "",//办公电话
                    homeTel: "",//应急电话
                    otherTel2: "",//其它电话
                    fax: "",//传真电话
                    email: "",//邮箱
                    importance: '',//紧急程度 默认为0（未知）
                    commonlyUsed: '',//常用联系人(大于0即为常用联系人，小于等于0取消常用联系人)
                    remark: "",//备注
                },//表单数据
                total: null,//数据总数
                pageSize: 10,//总页数
                currentPage: 1,//当前页数
                pagingSize: true,  //分页大小
                pickerOptions2: '',
                data: '',//日期
                textarea: '',
                options: '',
                search: '',//搜索
                date: '',
                // 保存
                eventId:'',
                id:'',
                tableColumn: [
                    {
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
                        prop: "call",//condition
                        label: "联系电话"
                    }, {
                        prop: "workUnit",
                        label: "工作单位"
                    }
                    , {
                        prop: "position",//conductor
                        label: "职务"
                    }
                    , {
                        prop: "operator",
                        label: "值班员"
                    }
                    , {
                        prop: "startTime",
                        label: "呼叫时间"
                    }
                    , {
                        prop: "connectedTime",
                        label: "接通时间"
                    }
                    , {
                        prop: "diffTime",
                        label: "通话时长"
                    }],//表头
                tableData: [],//表格数据
                formLabelAlign: {
                    name: '',
                },
                pathname:'/eventReports',
                telephoneGrouping:'/icpPhone',
                call:''
            }
        },
        methods: {
            clearClick(val){
                if(val==null||val.length<=0){
                    this.pageAxios()
                }
            },
            //登记事件
            openEvent(){//打开具体事件
                this.$store.commit('setPhoneHistoryId', {'id':this.id,'remark':this.rowData.remark});
                this.$store.commit('setTurnOnEmergencyResponse',false);
                sessionStorage.setItem('newID', 'newID');
                console.log(this.$store.state.phoneHistoryId);
                this.$router.push({
                    path:this.pathname
                });
            },
            out() {
                //导出函数
                let time1=''
                let time2=''
                console.log(this.data)
                if(this.data==''||this.data==undefined){
                    time1='';
                    time2=''
                }
                else{
                    time1=this.formatDateTime(this.data[0])
                    time2=this.formatDateTime(this.data[1])
                }
                const UrlRoot = window.g.ApiUrl;
                console.log(this.search)
                console.log(UrlRoot+'/eos/history/exportPhoneList?&dtStart='+time1+'&dtEnd='+time2+'&searchText='+this.search+'&vcDirect=未接')
                window.location.href = UrlRoot+'/eos/history/exportPhoneList?&dtStart='+time1+'&dtEnd='+time2+'&searchText='+this.search+'&vcDirect=未接';

            },
            axios() {
                let cpage =this.currentPage;
                let data = {
                    callType: 0,
                    vcDirect:"未接",
                    page: cpage,
                    size: 10
                };
                this.$api.all(data).then((res) => {
                    console.log(res.data.data)
                    this.tableData = res.data.data;
                    this.total = res.data.totalElements;
                    this.formLabelAlign.name = res.data.data.remark

                    this.rowData = res.data.data[0]
                    this.formLabelAlign.name = res.data.data[0].remark;// 把remark（备注）赋值给name
                    this.todolist = res.data.data[0].eventId === 0? '':res.data.data[0].eventId;  //事件id
                    this.id = res.data.data[0].id;
                    //  this.$refs.singleTable.tableLight(res.data.data[0]);//高亮第一行
                })
                // .catch((err)=>{console.log(res)})
            },
            handleCurrentChange(val) {
                if(this.data){
                    if (this.data[0] !== undefined && this.data[1] !== undefined) {
                        this.searchApi();
                    } else {
                        this.axios();
                    }
                }else {
                    this.axios();
                }

            },
            //时间为空时查询的list
            pageAxios(){
                this.currentPage=1
                let data = {
                    callType: 0,
                    vcDirect:"未接",
                    page: this.currentPage,
                    size: 10
                };
                this.$api.all(data).then((res) => {
                    console.log(res.data.data)
                    this.tableData = res.data.data;
                    this.total = res.data.totalElements;
                    this.formLabelAlign.name = res.data.data.remark

                    this.rowData = res.data.data[0]
                    this.formLabelAlign.name = res.data.data[0].remark;// 把remark（备注）赋值给name
                    this.todolist = res.data.data[0].eventId === 0? '':res.data.data[0].eventId;  //事件id
                    this.id = res.data.data[0].id;
                    //  this.$refs.singleTable.tableLight(res.data.data[0]);//高亮第一行
                })
            },
            // handleCurrentChange() {
            //   console.log(this.currentPage)
            //   var cpage =this.currentPage
            //   let data = {
            //     callType: 0,
            //     vcDirect:"未接",
            //     page: cpage,
            //     size: 10
            //   };
            //   this.$api.all(data).then((res) => {
            //     console.log(res)
            //     this.tableData = res.data.data
            //     this.total = res.data.totalElements;
            //     // console.log(res.data.data[1].remark)
            //     this.formLabelAlign.name = res.data.data.remark
            //   })
            // },
            lookup() {
                // 因为后台数据从0开始  所以请求之前-1
                this.currentPage=1;
                if(this.data==''||this.data==null){
                    let data = {
                        dtStart: '',
                        dtEnd: '',
                        vcDirect:"未接",
                        searchText: this.search,
                        page: this.currentPage,
                        size: 10
                    };
                    this.$api.all(data).then((res) => {
                        this.tableData = res.data.data;
                        this.total = res.data.totalElements;
                        this.formLabelAlign.name = res.data.data.remark;
                    })
                }
                else{
                    // 判断选没选时间（没选会弹出警告后边的else）如果选了进行下一步
                    // 把标准时间转为2018-01-01格式
                    var time = this.data[0]
                    function formatDateTime(time) {
                        var date = time;
                        var y = date.getFullYear();
                        var m = date.getMonth() + 1;
                        m = m < 10 ? ('0' + m) : m;
                        var d = date.getDate();
                        d = d < 10 ? ('0' + d) : d;
                        return y + '-' + m + '-' + d;
                    };
                    let time1 = formatDateTime(this.data[0])
                    let time2 = formatDateTime(this.data[1])
                    //运用方法转换时间
                    console.log(time1)
                    console.log(time2)
                    // 请求发送后台的参数
                    let data = {
                        dtStart: time1,
                        dtEnd: time2,
                        vcDirect:"未接",
                        searchText: this.search,
                        page: this.currentPage,
                        size: 10
                    };
                    this.$api.all(data).then((res) => {
                        // 返回的数据赋值给table
                        this.tableData = res.data.data;
                        // 把数据赋值给总共的数据总数total
                        this.total = res.data.totalElements;
                        console.log(res.data.data);
                        // 赋值备注
                        this.formLabelAlign.name = res.data.data.remark
                        console.log(res.data.data.remark);
                    })
                }

            },
            test(row) {
                console.log(row)
                // if(this.rowData.remark !== this.formLabelAlign.name){
                //     console.log(row)
                //
                //     console.log(this.todolist)
                //     this.$confirm('确认关闭？')
                //         .then(_ => {
                //             let data = {
                //                 eventId: this.todolist,
                //                 id: this.id,
                //                 remark: this.formLabelAlign.name,
                //             };
                //             this.$api.ok(data).then((res) => {
                //                 if (res.errorcode != 0) {
                //                     this.$message({
                //                         message: res.msg,
                //                         type: "error"
                //                     });
                //                     this.axios()
                //                 }
                //             })
                //         })
                //         .catch(_ => {})
                // }
                this.rowData = row
                this.id = row.id;
                console.log(this.id)
                // console.log(row.eventId)
                //console.log(row.eventName)
                // this.eventId = row.eventId;
                this.formLabelAlign.name = row.remark;
                //this.todolist = row.eventId === 0? '':row.eventId;
                //后台存在event事件删除后id任然存在，以下接口来校验
                if(row.eventId === 0){
                    this.todolist = '';
                }else{
                    let data = {id: row.eventId};
                    this.$api.findById(data).then((res) => {
                        console.log(res)
                        if (res.errorcode != 0) {
                            this.todolist = '';
                        }else{
                            this.todolist = row.eventId;
                        }
                    })
                }

                this.call=row.call
                console.log(row)
                this.contactorid=row.contactorId;
            },
            ok() {
                console.log(this.eventboxId);
                console.log(this.id);
                console.log(this.formLabelAlign.name);
                let data = {
                    eventId: this.eventboxId,
                    id: this.id,
                    remark: this.formLabelAlign.name,
                };
                this.$api.ok(data).then((res) => {
                    if (res.errorcode != 0) {
                        this.$message({
                            message: res.msg,
                            type: "error"
                        });
                        return
                    }
                    this.axios()
                })
            },
            formatDateTime(time) {
                console.log(time)
                var date = time;
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                m = m < 10 ? ('0' + m) : m;
                var d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                return y + '-' + m + '-' + d;
            },
            searchApi() {
                // 把标准时间转为2018-01-01格式
                let time1 = this.formatDateTime(this.data[0]);
                let time2 = this.formatDateTime(this.data[1]);
                //运用方法转换时间
                // 因为后台数据从0开始  所以请求之前-1
                var timer = this.currentPage;
                // 请求发送后台的参数
                let data = {
                    dtStart: time1,
                    callType: 0,
                    vcDirect:"未接",
                    dtEnd: time2,
                    searchText: this.search,
                    page: timer,
                    size: 10
                };
                console.log(data);
                this.$api.all(data).then((res) => {
                    // 返回的数据赋值给options
                    this.tableData = res.data.data;
                    // 把数据赋值给总共的数据总数tableData1
                    this.total = res.data.totalElements;
                })
            },
            box_lookup() {
                console.log(this.data1[0]);
                // 判断选没选时间（没选会弹出警告后边的else）如果选了进行下一步
                if (this.data1[0] !== undefined && this.data1[1] !== undefined) {
                    // 把标准时间转为2018-01-01格式
                    var time = this.data1[0];
                    let time1 = this.formatDateTime(this.data1[0]);
                    let time2 = this.formatDateTime(this.data1[1]);
                    //运用方法转换时间
                    console.log(time1);
                    console.log(time2);
                    // 因为后台数据从0开始  所以请求之前-1
                    let timer = this.currentPage;
                    // 请求发送后台的参数
                    let data = {
                        callType: 0,
                        dtStart: time1,
                        dtEnd: time2,
                        searchText: this.box_ipt,
                        page: timer,
                        size: ''
                    };
                    this.$api.todolist(data).then((res) => {
                        // 返回的数据赋值给options
                        console.log(res.data.data);
                        // this.options = res.data.data;
                        // 把数据赋值给总共的数据总数tableData1
                        this.tableData1 = res.data.data;

                    })
                } else {
                    let timer = this.currentPage;
                    let data = {
                        callType: 0,
                        dtStart: '',
                        dtEnd: '',
                        searchText: this.box_ipt,
                        page: timer,
                        size: ''
                    };
                    this.$api.todolist(data).then((res) => {
                        // 返回的数据赋值给options
                        console.log(res.data.data);
                        // this.options = res.data.data;
                        // 把数据赋值给总共的数据总数tableData1
                        this.tableData1 = res.data.data;

                    })
                }
            },
            //表格行双击方法
            handleRowDbClick(){
                let data = {
                    id: this.contactorid
                };
                this.$api.findContactorById(data).then((res) => {
                    this.contactForm = res.data;
                    this.$nextTick(() => {
                        this.$refs.ContactDetailsPopup.isDialogVisible = true;
                        this.$refs.ContactDetailsPopup.title = "查看联系人";
                        this.$refs.ContactDetailsPopup.showData(this.contactForm);
                    });
                })
            },
            //获取联系人数据
            getContactorList() {
                let data;
                if (this.searchText == "") {
                    data = {
                        groupId: this.id,
                        page: this.currentPage,
                        size: this.pageSize,
                        searchText: this.searchText,
                    };
                } else {
                    data = {
                        page: this.currentPage,
                        size: this.pageSize,
                        searchText: this.searchText,
                    };
                }
                this.$api.contactorList(data).then(res => {
                    if (res.errorcode != 0) {
                        this.$message({
                            message: res.msg,
                            type: "error"
                        });
                        return;
                    }
                    this.tableData = res.data.list;
                    this.total = res.data.totalCount;
                })
            },
            byebye(){
                console.log(this.call)
                if(this.call==''){
                    this.$message({
                        message: '请选择人员',
                        type: "error"
                    });
                }
                else{
                    let data = {
                        "data":{
                            "parameter":{
                                "phone":this.call,
                                "remark":null
                            },
                            "type":"add"
                        }

                    };
                    this.$api.blackList(data).then((res) => {
                        console.log(res)
                        if (res.errorcode != 0) {
                            this.$message({
                                message: res.msg,
                                type: "error"
                            });
                        }
                        else{
                            this.$message({
                                message: '启用防骚扰成功',
                                type: "success"
                            });
                        }
                    })
                }
            },
            called(){
                if(this.call==''||this.call==undefined||this.call==null){
                    this.$message({
                        message: '选择的人员无效',
                        type: "error"
                    });
                }
                else{
                    // sessionStorage.setItem('phoneCall', this.call);
                    // this.$router.push({
                    //     path:this.telephoneGrouping
                    // });
                    let self = this,
                        mobile =  this.call;
                    this.$confirm('确认呼叫当前号码?', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        if (self.HWICP_Version == 'HWICP-19.0') {
                            this.$icp19.MakeCall(Number(self.agent_id), mobile, self.seatNumber.toString());
                        }
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消呼叫'
                        });
                    });
                }
            }
        },
        mounted() {
            this.axios()
        },
        components: {
            myTable,ContactDetailsPopup
        }
    }
</script>

<style scoped>
  .out {
    margin: 0 30px;
  }

  .card {
    height: 100%;
  }

  .top {
    display: flex;
    justify-content: flex-start;
    height: 40px;
    line-height: 40px;
  }

  .ipt {
    width: 300px;
    margin-left: 50px;
  }

  .span {
    margin-left: 80px;
    margin-right: 10px;
  }

  .bottom_ {
    width: 100%;
    height: 200px;
    background-color: #fff;
    bottom: 0px;
    left: 231px;
  }

  .music {
    width: 300px;
    height: 200px;
    margin: 0 60px 0 20px;
    /* border: 1px solid #ccc; */
  }

  .btm {
    margin-right: 168px;
    text-align: left;
  }

  .btm_ {
    display: flex;
    justify-content: center;
    /* align-items: center; */
    /* width: 100%;
    height: 100%; */
  }

  .remarks {
    width: 500px;
    height: 80px !important;
    line-height: 0 !important;
  }

  #one {
    display: inline-block;
    height: 100px;
    line-height: 100px;
  }
  .btm_input{
    width: 300px;
  }
</style>
