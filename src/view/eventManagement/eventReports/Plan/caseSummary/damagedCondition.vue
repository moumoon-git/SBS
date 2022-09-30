<template>
  <div>
    <div class="addButton">
      <el-button type="primary" size="small" @click="addReport">新增</el-button>
      <el-button type="primary" size="small" @click="updataReport">修改</el-button>
      <el-button type="primary" size="small" @click="deleteReport">删除</el-button>
    </div>
    <div style="width: 100%">
      <!--表格-->
      <div>
        <my-table
          @handleCurrentChange="handleCurrentChange"
          :tableColumn="tableColumn"
          :tableData="tableData"></my-table>
      </div>
      <!--表格分页-->
      <div style="padding: 10px 0">
        <el-pagination :small="pagingSize" :page-size="pageSize" :page-sizes="[10,20,30,40]" :total="total"
                       :current-page="currentPage"
                       @size-change="handleSizeChange" @current-change="pageMode"
                       layout="total, prev, pager, next, sizes, jumper"></el-pagination>
      </div>
    </div>

    <!--弹窗-->
    <el-dialog width="600px" :title="title" :visible.sync="innerVisible" append-to-body center
               :close-on-click-modal="false" @close="off">
      <el-form hide-required-asterisk
               label-width="90px" :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left"
               @submit.native.prevent>
        <el-form-item label="名称:" prop="name">
          <el-input type="text" v-model.trim="ruleForm.name" show-word-limit></el-input>
        </el-form-item>

        <el-form-item label="受损数量:">
          <el-input-number v-model.trim="ruleForm.number " :min="1" :max="99999"></el-input-number>
        </el-form-item>

        <el-form-item label="计量单位:">
          <el-input type="text" v-model.trim="ruleForm.unit" show-word-limit></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <!--        <el-button @click="outerVisible = false">取消</el-button>-->
        <el-button size="small" type="primary" @click="lookForConfirmation('ruleForm')">确认</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
  import myTable from "@/components/tables/tables"

  export default {
    name: "damagedCondition",
    components: {
      myTable
    },
    data() {
      return {
        tableColumn: [
          {
            prop: "name",
            label: "名称"
          },
          {
            prop: "value",
            label: "受损数量"
          },
          {
            prop: "unit",
            label: "计量单位"
          },
        ],
        tableData: [],
        pagingSize: true,
        total: 0,
        pageSize: 10, //每页多少条
        currentPage: 1, //当前页
        innerVisible: false,//弹窗
        title: '',
        ruleForm: {
          name: '',
          number: '',
          unit: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'},
          ],
        },
        id: '',//事件ID
        tableRowData: [],//表格行点击数据
      }
    },
    created() {
      this.getTableData();
    },
    methods: {
      getTableData() {
        this.id = sessionStorage.getItem('newID');
        if(this.id==''||this.id==null||this.id=='newID'){
          return
        }
        this.tableDates();
      },
      tableDates() {
        let data = {
          size: this.pageSize,
          page: this.currentPage,
          eventId: this.id
        };
        this.$api.caseList(data).then((res) => {
          if (res.errorcode == '0') {
            this.tableData = res.data.data
            this.total = res.data.totalElements
          }
        })
      },
      addReport() {//新增
        if(this.id==''||this.id==null){
          this.$message({
            message: '暂无事件可以进行操作',
            type: 'warning'
          });
          return;
        }
        if(this.id=='newID'){
          this.$message({
            message: '请选择保存事件!',
            type: 'warning'
          });
          return
        }
        this.innerVisible = true;
        this.title = '新增受损情况';
        this.ruleForm.name = '';
        this.ruleForm.number = '';
        this.ruleForm.unit = '';
      },
      updataReport() {//修改
        if (this.tableRowData == '' || this.tableRowData == null || this.tableRowData == []) {
          this.$message({
            message: '请点击表格选择内容进行修改！',
            type: 'warning'
          });
          return;
        }
        this.innerVisible = true;
        this.title = '修改损失情况汇总';
        this.ruleForm.name = this.tableRowData.name;
        this.ruleForm.number = this.tableRowData.value;
        this.ruleForm.unit = this.tableRowData.unit;
      },
      deleteReport() {//删除
        if (this.tableRowData == '' || this.tableRowData == null || this.tableRowData == []) {
          this.$message({
            message: '请点击表格选择内容进行删除！',
            type: 'warning'
          });
          return;
        }
        this.$confirm('确认删除该数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            id: this.tableRowData.id
          };
          this.$api.caseDelete(data).then((res) => {
            if (res.errorcode == '0') {
              this.$message({
                message: '已删除！',
                type: 'success'
              });
              this.tableDates();
              this.tableRowData = '';
              this.innerVisible = false;
            } else {
              //this.$message.error(res.msg);
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      lookForConfirmation(ruleForm) {//确认关闭按钮
        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            let type = this.title;
            let addData,upData
            switch (type) {
              case "新增受损情况":
                 addData = {
                  data: {
                    eventProcessId: this.id,
                    name: this.ruleForm.name,
                    value: this.ruleForm.number,
                    unit: this.ruleForm.unit
                  }
                };
                this.$api.caseAdd(addData).then((res) => {
                  if (res.errorcode == '0') {
                    this.$message({
                      message: '新增成功！',
                      type: 'success'
                    });
                    this.tableDates();
                    this.tableRowData = '';
                    this.innerVisible = false;
                  } else {
                    //this.$message.error(res.msg);
                  }
                })
                break;
              case "修改损失情况汇总":
                 upData = {
                  data: {
                    eventProcessId: this.id,
                    name: this.ruleForm.name,
                    value: this.ruleForm.number,
                    unit: this.ruleForm.unit,
                    id: this.tableRowData.id
                  }
                };
                this.$api.caseUpdate(upData).then((res) => {
                  if (res.errorcode == '0') {
                    this.$message({
                      message: '修改成功！',
                      type: 'success'
                    });
                    this.tableDates();
                    this.tableRowData = '';
                    this.innerVisible = false;
                  } else {
                    //this.$message.error(res.msg);
                  }
                })
                break;
            }
          }

        });


      },
      handleCurrentChange(row) {
        this.tableRowData = row;
      },
      handleSizeChange(val) {
        this.tableRowData=[]
        this.pageSize = val;
        this.tableDates();
      },
      pageMode(val) {
        this.tableRowData=[]
        this.currentPage = val;
        this.tableDates();
      },
      off() {//清空规则
        this.$refs.ruleForm.clearValidate();
        this.$refs.ruleForm.resetFields();
      }
    }
  }
</script>

<style scoped>
  .addButton {
    width: 100%;
    text-align: left;
  }

  >>> .el-input-number {
    width: 100%;
  }
</style>
