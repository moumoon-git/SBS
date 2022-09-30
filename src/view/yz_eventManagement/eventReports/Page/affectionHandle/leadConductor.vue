<template>
<div style="padding: 0 10px">
    <div style="width: 100%;height: 200px;overflow: auto">
        <!--表格-->
        <div>
            <lead-conductor-table ref="batchTable" @handleSelectionChange="handleSelectionChange" @handleCurrentChange="handleCurrentChange" @delete="rowDeleteLead" @select="rowSelect" :tableColumn="tableColumn" :tableData="tableData"></lead-conductor-table>
        </div>
        <!--表格分页-->

    </div>
    <div>
        <el-pagination :small="pagingSize" :page-size="pageSize" :page-sizes="[10,20,30,40]" :total="total" :current-page="currentPage" @size-change="handleSizeChange" @current-change="pageMode" layout="total, prev, pager, next, sizes, jumper"></el-pagination>
    </div>

    <div class="formStyle">

        <el-form label-width="75px" :model="ruleForm" :rules="rules" ref="ruleForm" @submit.native.prevent label-position="content">
            <el-row :gutter="gutter">
                <el-col :span="6">
                    <el-form-item label="姓名:" prop="name">
                        <el-input type="text" :disabled="disabled" v-model.trim="ruleForm.name" show-word-limit></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="10">
                    <el-form-item label="指示时间:" prop="instructionsTime" label-width="92px">
                        <el-date-picker format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :disabled="disabled" v-model.trim="ruleForm.instructionsTime" type="datetime" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="指示类型:" prop="instructionsType" label-width="92px">
                        <el-select :readonly="disabled" v-model.trim="ruleForm.instructionsType" placeholder="请选择类型">
                            <el-option v-for="item in optionType" :key="item.value" :label="item.name" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <div class="conductor">
            <div class="conductorLeft">
                <span class="leftLine"></span>
                <span class="txt">指示内容</span>
                <span class="rightLine"></span>
            </div>
            <div class="conductorRight" style="display: none">
                <span class="txt">办理情况</span>
                <span class="conductorLine"></span>
            </div>
        </div>

        <div style="display: flex ;margin-top: 20px;padding-bottom: 10px" :style="{'border-bottom':isYangZhou?'none':'1px solid #ccc'}">
            <div style="flex: 2;padding-right: 10px">
                <el-input type="textarea" placeholder="请输入内容" v-model="instruction" show-word-limit resize="none" :readonly="disabled" :autosize="{minRows:8,maxRows:8}"></el-input>
            </div>
            <div style="flex: 3;display: none">
                <el-form label-width="18%" :model="form" :rules="formRules" ref="form" @submit.native.prevent label-position="right">
                    <el-row style="text-align: left">
                        <el-form-item label="传达方式:">
                            <el-checkbox :readonly="disabled" v-model="byPhone">电话</el-checkbox>
                            <el-checkbox :readonly="disabled" v-model="bySms">短信</el-checkbox>
                            <el-checkbox :readonly="disabled" v-model="byFax">传真</el-checkbox>
                        </el-form-item>
                    </el-row>
                    <el-row style="text-align: left">
                        <el-form-item label="传达对象:">
                            <el-input :readonly="objDisabled" type="textarea" v-model="form.conveyObj" show-word-limit resize="none" :autosize="{minRows:5,maxRows:5}"></el-input>
                        </el-form-item>
                    </el-row>
                </el-form>

            </div>
        </div>

        <div class="radio" v-if="!isYangZhou">
            <el-radio-group :readonly="disabled" v-model="radio">
                <el-radio v-for="opt in  borderData" :key="opt.id" :label="opt.id">
                    {{opt.name}}
                </el-radio>
                <!--          <el-radio :label="433">上级</el-radio>-->
                <!--          <el-radio :label="434">市委</el-radio>-->
                <!--          <el-radio :label="435">市政府</el-radio>-->
                <!--          <el-radio :label="436">办公厅</el-radio>-->
            </el-radio-group>
        </div>
    </div>

    <div class="addButton">
        <el-button type="primary" size="small" v-if="restShow" @click="addReport">新增</el-button>
        <el-button type="primary" size="small" v-if="restShow" @click="updateContent">修改</el-button>
        <el-button type="primary" size="small" v-if="restShow" @click="deleteInBatches">批量删除</el-button>
        <el-button type="primary" size="small" v-if="restShow" @click="instructionsToConvey">指令传达</el-button>
        <el-button type="primary" size="small" v-if="saveShow" :disabled="isDisabled" @click="save('ruleForm')">保存</el-button>
        <el-button type="primary" size="small" v-if="saveShow" @click="callOff">取消</el-button>
    </div>
</div>
</template>

<script>
import leadConductorTable from "@/view/yz_eventManagement/eventReports/dialog/batchTable"
import bus from "@/yz_components/common/js/eventBus";
export default {
    name: "leadConductor",
    components: {
        leadConductorTable
    },
    data() {
        return {
            tableColumn: [{
                    prop: "leadername",
                    label: "姓名"
                },
                {
                    prop: "approval",
                    label: "指示内容"
                },
                {
                    prop: "approvalTime",
                    label: "指示时间"
                },
                {
                    prop: "approvaltype",
                    label: "指示类型"
                },
                {
                    prop: "deptName",
                    label: "单位"
                },
                {
                    prop: "createTime",
                    label: "操作时间"
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
                instructionsType: ''
            },
            rules: {
                name: [{
                    required: true,
                    message: '不能为空',
                    trigger: 'blur'
                }, ],
                instructionsTime: [{
                    required: true,
                    message: '不能为空',
                    trigger: 'blur'
                }, ],
                instructionsType: [{
                    required: true,
                    message: '不能为空',
                    trigger: 'blur'
                }, ],
            },
            instruction: '', //批示内容
            form: {
                conveyObj: ''
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
            optionType: [{
                value: '指示',
                label: '指示'
            }, {
                value: '批示',
                label: '批示'
            }], //批示类型数据
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
        }
    },
    mounted() {
        this.getTableList();
        bus.$off("tableList")
        bus.$on("tableList", () => {
            this.getTableList()
        })
    },
    created() {
        this.$nextTick(() => {
            this.getByPcodeData()
        })
    },
    watch: {
        ction: {
            handler(newV, oldV) {
                console.log(newV);
            },
            deep: true
        }
    },
    methods: {
        //获取字典表的单位
        getByPcodeData() {
            let data = {
                pcode: 'event_instruction_dept'
            }
            this.$api.getByPcode(data).then((res) => {
                console.log(res,2222)
                if (res.errorcode== '0') {
                    console.log(res.data);
                    this.borderData = res.data
                } else {
                    //this.$message.error(res.msg);
                }
            })
        },
        instructionsToConvey() { //携带参数到指令传达
            if (this.eventId == '' || this.eventId == null) {
                this.$message({
                    message: '暂无事件可以进行操作',
                    type: 'warning'
                });
                return;
            }
            if (this.eventId == 'newID') {
                this.$message({
                    message: '请选择保存事件!',
                    type: 'warning'
                });
                return
            }
            if (this.ction.length > 1) {
                this.$message({
                    message: '只能选择一个指令进行传达',
                    type: 'warning'
                });
                this.ction = []
                this.$refs.batchTable.clore()
                this.restShow = true;
                this.saveShow = false;
                this.disabled = true;
                this.ruleForm.name = '';
                this.ruleForm.instructionsTime = '';
                this.ruleForm.instructionsType = '';
                this.instruction = '';
                this.form.checkList = [];
                this.tableRowData = []
                this.radio = '';
                this.byFax = false;
                this.byPhone = false;
                this.bySms = false;
                this.id = '';
                this.$refs.ruleForm.clearValidate();
                this.$refs.ruleForm.resetFields();
                this.$refs.form.clearValidate();
                this.$refs.form.resetFields();
                return
            }
            console.log(this.ction, this.tableRowData);
            if (this.ction.length == 0 && this.tableRowData.length == 0) {
                this.$message({
                    message: '请选择指令进行传达',
                    type: 'warning'
                });
                return;
            }
            this.$emit('skipInstructConvey', this.tableRowData)
        },
        getTableList() { //获取列表
            this.eventId = sessionStorage.getItem('newID');
            if (this.eventId == '' || this.eventId == null || this.eventId == 'newID') {
                return
            }
            let data = {
                eventId: this.eventId,
                page: this.currentPage,
                size: this.pageSize,
            };
            this.$api.leadList(data).then((res) => {
                if (res.errorcode == '0') {
                    this.tableData = res.data.data;
                    this.total = res.data.totalElements
                } else {
                    //this.$message.error(res.msg);
                }
            })
        },
        rowSelect(selection, row) { //用户手动勾选事件
            if (selection.length == 0) {
                this.restShow = true;
                this.saveShow = false;
                this.disabled = true;
                this.ruleForm.name = '';
                this.ruleForm.instructionsTime = '';
                this.ruleForm.instructionsType = '';
                this.instruction = '';
                this.form.checkList = [];
                this.tableRowData = []
                this.radio = '';
                this.byFax = false;
                this.byPhone = false;
                this.bySms = false;
                this.id = '';
                this.ction = [];
                this.$refs.ruleForm.clearValidate();
                this.$refs.ruleForm.resetFields();
                this.$refs.form.clearValidate();
                this.$refs.form.resetFields();
                return
            }
            this.tableRowData = row
            this.ction = selection
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
                this.byFax = true
            } else {
                this.byFax = false
            }
            if (selection[0].byPhone == 1) {
                this.byPhone = true
            } else {
                this.byPhone = false
            }
            if (selection[0].bySms == 1) {
                this.bySms = true
            } else {
                this.bySms = false
            }
        },
        handleCurrentChange(row) { //表格点击事件
            console.log(row);
            this.tableRowData = row
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
            if (row.byFax == 1) {
                this.byFax = true
            } else {
                this.byFax = false
            }
            if (row.byPhone == 1) {
                this.byPhone = true
            } else {
                this.byPhone = false
            }
            if (row.bySms == 1) {
                this.bySms = true
            } else {
                this.bySms = false
            }
        },
        handleSizeChange(val) { //监听一页几条数据
            this.pageSize = val;
            this.getTableList();
            this.$refs.batchTable.clore()
            this.restShow = true;
            this.saveShow = false;
            this.disabled = true;
            this.ruleForm.name = '';
            this.ruleForm.instructionsTime = '';
            this.ruleForm.instructionsType = '';
            this.instruction = '';
            this.form.checkList = [];
            this.tableRowData = []
            this.radio = '';
            this.byFax = false;
            this.byPhone = false;
            this.bySms = false;
            this.id = ''
            this.ction = [];
            this.$refs.ruleForm.clearValidate();
            this.$refs.ruleForm.resetFields();
            this.$refs.form.clearValidate();
            this.$refs.form.resetFields();
        },
        pageMode(val) { //监听第几页
            this.currentPage = val;
            this.getTableList();
            this.$refs.batchTable.clore()
            this.restShow = true;
            this.saveShow = false;
            this.disabled = true;
            this.ruleForm.name = '';
            this.ruleForm.instructionsTime = '';
            this.ruleForm.instructionsType = '';
            this.instruction = '';
            this.form.checkList = [];
            this.tableRowData = []
            this.radio = '';
            this.byFax = false;
            this.byPhone = false;
            this.bySms = false;
            this.id = ''
            this.ction = [];
            this.$refs.ruleForm.clearValidate();
            this.$refs.ruleForm.resetFields();
            this.$refs.form.clearValidate();
            this.$refs.form.resetFields();
        },
        addReport() { //新增续报
            if (this.eventId == '' || this.eventId == null) {
                this.$message({
                    message: '暂无事件可以进行操作',
                    type: 'warning'
                });
                return
            }
            if (this.eventId == 'newID') {
                this.$message({
                    message: '请选择保存事件!',
                    type: 'warning'
                });
                return
            }
            this.restShow = false;
            this.saveShow = true;
            this.disabled = false;
            this.dataType = '新增'
            this.ruleForm.name = '';
            this.ruleForm.instructionsTime = '';
            this.ruleForm.instructionsType = '';
            this.instruction = '';
            this.form.checkList = [];
            this.tableRowData = []
            this.radio = '';
        },
        save(ruleForm) {
            this.$refs[ruleForm].validate((valid) => {
                if (valid) {
                    this.isDisabled = true;
                    setTimeout(() => {
                        this.isDisabled = false;
                    }, 3000);
                    if (this.bySms == true) {
                        this.bySms = 1
                    } else {
                        this.bySms = 0
                    }
                    if (this.byPhone == true) {
                        this.byPhone = 1
                    } else {
                        this.byPhone = 0
                    }
                    if (this.byFax == true) {
                        this.byFax = 1
                    } else {
                        this.byFax = 0
                    }
                    let type = this.dataType;
                    let addData, upData;
                    switch (type) {
                        case "新增":
                            addData = {
                                data: {
                                    byFax: this.byFax,
                                    byPhone: this.byPhone,
                                    bySms: this.bySms,
                                    deptType: this.radio,
                                    eventId: this.eventId,
                                    approval: this.instruction,
                                    approvaltype: this.ruleForm.instructionsType,
                                    leadername: this.ruleForm.name,
                                    approvalTime: this.ruleForm.instructionsTime,
                                }
                            };
                            this.$api.leadAdd(addData).then((res) => {
                                if (res.errorcode == '0') {
                                    this.$message({
                                        message: '保存成功',
                                        type: 'success'
                                    });
                                    this.restShow = true;
                                    this.saveShow = false;
                                    this.disabled = true;
                                    this.ruleForm.name = '';
                                    this.ruleForm.instructionsTime = '';
                                    this.ruleForm.instructionsType = '';
                                    this.instruction = '';
                                    this.form.checkList = [];
                                    this.tableRowData = []
                                    this.radio = '';
                                    this.byFax = false;
                                    this.byPhone = false;
                                    this.bySms = false;
                                    this.id = '';
                                    this.ction = [];
                                    this.$refs.ruleForm.clearValidate();
                                    this.$refs.ruleForm.resetFields();
                                    this.$refs.form.clearValidate();
                                    this.$refs.form.resetFields();

                                    this.getTableList();

                                } else {
                                    //this.$message.error(res.msg);
                                }
                            })
                            break;

                        case "修改":
                            upData = {
                                data: {
                                    id: this.id,
                                    byFax: this.byFax,
                                    byPhone: this.byPhone,
                                    bySms: this.bySms,
                                    deptType: this.radio,
                                    eventId: this.eventId,
                                    approval: this.instruction,
                                    approvaltype: this.ruleForm.instructionsType,
                                    leadername: this.ruleForm.name,
                                    approvalTime: this.ruleForm.instructionsTime,
                                }
                            };
                            this.$api.leadUpdate(upData).then((res) => {
                                if (res.errorcode == '0') {
                                    this.$message({
                                        message: '修改成功',
                                        type: 'success'
                                    });
                                    this.restShow = true;
                                    this.saveShow = false;
                                    this.disabled = true;
                                    this.ruleForm.name = '';
                                    this.ruleForm.instructionsTime = '';
                                    this.ruleForm.instructionsType = '';
                                    this.instruction = '';
                                    this.form.checkList = [];
                                    this.tableRowData = []
                                    this.radio = '';
                                    this.byFax = false;
                                    this.byPhone = false;
                                    this.bySms = false;
                                    this.id = '';
                                    this.ction = [];
                                    this.$refs.ruleForm.clearValidate();
                                    this.$refs.ruleForm.resetFields();
                                    this.$refs.form.clearValidate();
                                    this.$refs.form.resetFields();

                                    this.getTableList();
                                } else {
                                    //this.$message.error(res.msg);
                                }
                            })
                            break;
                        default:
                            break;
                    }
                }
            });
        },
        updateContent() { //修改
            if (this.id == '' || this.id == null) {
                this.$message({
                    message: '请选择内容进行修改',
                    type: 'warning'
                });
                return
            }
            if (this.eventId == 'newID') {
                this.$message({
                    message: '请选择保存事件!',
                    type: 'warning'
                });
                return
            }
            console.log(this.ction);
            if (this.ction.length > 1) {
                this.$message({
                    message: '只能选择一个数据进行修改',
                    type: 'warning'
                });
                this.$refs.batchTable.clore()
                this.restShow = true;
                this.saveShow = false;
                this.disabled = true;
                this.ruleForm.name = '';
                this.ruleForm.instructionsTime = '';
                this.ruleForm.instructionsType = '';
                this.instruction = '';
                this.form.checkList = [];
                this.tableRowData = []
                this.radio = '';
                this.byFax = false;
                this.byPhone = false;
                this.bySms = false;
                this.id = '';
                this.ction = [];
                this.$refs.ruleForm.clearValidate();
                this.$refs.ruleForm.resetFields();
                this.$refs.form.clearValidate();
                this.$refs.form.resetFields();
                return
            }

            this.dataType = '修改';
            this.objDisabled = false;
            this.disabled = false;
            this.restShow = false;
            this.saveShow = true;
        },
        rowDeleteLead(id) { //删除
            let singleId = []
            singleId.push(id)
            let data = {
                id: singleId
            };
            this.$api.leadDelete(data).then((res) => {
                if (res.errorcode == '0') {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.callOff();
                    this.getTableList();
                } else {
                    //this.$message.error(res.msg);
                }
            });

        },
        handleSelectionChange(val) { //全选
            this.arrayID = val;
        },
        deleteInBatches() { //批量删除
            if (this.arrayID.length == 0) {
                this.$message({
                    message: '请选择领导指示！',
                    type: 'warning'
                });
                return;
            }
            this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let ids = []; //全选ID数组
                let deleteCount = 0;
                for (let i in this.arrayID) {
                    ids.push(this.arrayID[i].id);
                    deleteCount++;
                }
                console.log(deleteCount);
                let data = {
                    id: ids
                };
                this.$api.leadDelete(data).then((res) => {
                    if (res.errorcode == '0') {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.callOff();
                        this.getTableList();
                    } else {
                        //this.$message.error(res.msg);
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });

        },
        callOff() { //取消续报
            this.$refs.batchTable.clore()
            this.restShow = true;
            this.saveShow = false;
            this.disabled = true;
            this.ruleForm.name = '';
            this.ruleForm.instructionsTime = '';
            this.ruleForm.instructionsType = '';
            this.instruction = '';
            this.form.checkList = [];
            this.tableRowData = []
            this.radio = '';
            this.byFax = false;
            this.byPhone = false;
            this.bySms = false;
            this.id = '';
            this.ction = [];
            this.$refs.ruleForm.clearValidate();
            this.$refs.ruleForm.resetFields();
            this.$refs.form.clearValidate();
            this.$refs.form.resetFields();
            // this.$refs[formName].resetFields();
        },
    }
}
</script>

<style scoped>
.formStyle {
    margin-top: 20px;
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

>>>.el-input__inner {
    height: 30px;
    line-height: 30px;
}

.formStyle>>>.el-date-editor.el-input,
.el-date-editor.el-input__inner {
    width: 100%;
}
</style>
