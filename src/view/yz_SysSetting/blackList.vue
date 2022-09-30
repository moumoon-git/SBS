<template>
  <div>
    <div style="text-align: left">
      <el-button type="primary" @click='addBlackMan'>新增</el-button>
      <el-button type="primary" @click='changeBlackMan'>修改</el-button>
      <el-button type="primary" @click='deleteBlackMan'>删除</el-button>
      <template>
        <span style="margin-left:40px">名单类型：</span>
        <el-radio-group v-model="listType" @change="changeListType">
          <el-radio label="all">全部</el-radio>
          <el-radio label="phone">电话</el-radio>
          <el-radio label="fax">传真</el-radio>
        </el-radio-group>
      </template>
    </div>
    <div style="height: 350px">
      <el-table
        ref="singleTable"
        class="tableStyle"
        :data="tableData"
        :height="300"
        highlight-current-row
        @row-click="rowClick"
        @row-dblclick='changeBlackMan'
        style="width: 100%">
        <el-table-column min-width="160" v-for="(item,key) in tableColumn" :key="key" :label="item.label"
                         :prop="item.prop"
                         :width="item.width" :resizable="false"></el-table-column>
      </el-table>
      <el-pagination class="pagination" :page-size="pageSize" :total="total"
                     :current-page.sync="currentPage"
                     @current-change='queryBlackList'
                     layout="total, prev, pager, next, jumper"></el-pagination>
    </div>
    <el-dialog
      :title='title'
      :visible.sync="dialogVisible"
      width="30%"
      append-to-body
      :close-on-click-modal="false"
      center>
      <div>
        <el-form :label-position="labelPosition" label-width="100px" :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item label="黑名单号码：" prop="phoneNumber">
            <el-input v-model="ruleForm.phoneNumber" placeholder="请输入手机/固定电话/传真号码" maxlength='20'></el-input>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input v-model="ruleForm.remark" type="textarea" :rows="3" placeholder="请输入备注(100字以内)"
                      maxlength='100'></el-input>
          </el-form-item>
          <el-form-item label="名单类型：">
            <el-radio-group v-model="ruleForm.type">
              <el-radio label="phone">电话</el-radio>
              <el-radio label="fax">传真</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
  <el-button @click="dialogVisible = false">取 消</el-button>
  <el-button type="primary" @click="saveBlackMan('ruleForm')">保 存</el-button>
</span>
    </el-dialog>
  </div>

</template>

<script>
  export default {
    name: "blackList",
    data() {
      let numberCheck=(rule,value,callback)  =>{
            console.log(value)
            let num1 = /^[1][2,3,4,5,6,7,8,9][0-9]{9}$/;   //手机号码校验
            let num2 = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;   //固定电话校验
            let num3 = /^((\+?[0-9]{2,4}\-[0-9]{3,4}\-)|([0-9]{3,4}\-))?([0-9]{7,8})(\-[0-9]+)?$/; //传真号码校验
            if(!value.match(num1) && !value.match(num2) && !value.match(num3)){
              callback(new Error('请输入正确的手机/固定电话/传真号码!'));
            }
            callback();
          };
      return {
        listType: "all", // 名单类型
        tableColumn: [
          {
            prop: "phoneNumber",
            label: "电话号码"
          },
          {
            prop: "remark",
            label: "备注"
          },
          {
            prop: "type",
            label: "名单类型"
          }
        ],//表头名称
        tableData: [],//表格数据
        pageSize: 5,//页数
        total: 0,//数据总数
        currentPage: 1,//当前页
        dialogVisible: false,
        labelPosition: 'right',
        row: '',
        title: '',
        oldPhone: '',
        agent_id: sessionStorage.getItem('agent_id'),
        ruleForm: {
          phoneNumber: '',//添加号码
          remark: '',
          type: 'phone' // 名单类型
        },
        rules: {
          phoneNumber: [
            {validator: numberCheck, trigger: 'blur'}
          ]
        }
      }
    },
    created () {
      this.queryBlackList();
    },
    methods: {
      /**
       * @author hexinting
       * @date 2020-10-10
       * @lastDate 2020-10-10
       * @lastEditor hexinting
       * @description 查询名单类型
       */
      changeListType() {
        this.queryBlackList(); // 根据名单类型查询黑名单
      },
      /**
       * @lastDate 2020-10-14
       * @lastEditor hexinting
       * @description 查询黑名单
       */
      queryBlackList() {
        let data = {
          data: {
            parameter: {
              page: this.currentPage,
              type: this.listType !== "all" ? this.listType : ''
            },
            type: 'select'
          }
        };
        this.$api.blackList(data).then((res) => {
          if (res.errorcode == 0) {
            let data = res.data.parameter;
            this.tableData = [];
            data.forEach(value => {
              this.tableData.push({
                id: value.id,
                phoneNumber: value.name,
                remark: value.remark,
                type: value.type
              });
            });
            this.total = res.data.paging.size;
            this.row = '';
          }
        })
      },
      /**
       * @lastDate 2020-10-14
       * @lastEditor hexinting
       * @description 提交 新增/修改的黑名单
       */
      saveBlackMan(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.title === '新增黑名单') {
              let data = {
                data: {
                  parameter: {
                    phone: this.ruleForm.phoneNumber,
                    remark: this.ruleForm.remark,
                    type: this.ruleForm.type
                  },
                  type: "add"
                }
              }
              this.$api.blackList(data).then((res) => {
                if (res.errorcode == 0) {
                  this.$message({
                    message: '新增黑名单成功',
                    type: 'success'
                  });
                  this.dialogVisible = false;
                  this.queryBlackList();
                  /**
                   * 黑名单管理，可1添加，0删除,2清空
                   * @param agent_id 坐席id
                   * @param phoneNumber 号码列表，以逗号隔开，最多支持32个21个数字的号码串
                   * @param iControl 控制命令，1添加，0删除,2清空
                   * @constructor
                   */
                  this.$icp19.OperateBlackList(Number(this.agent_id), Number(this.ruleForm.phoneNumber), 1);
                } else {
                  this.$message.error(res.msg);
                }
              })
            } else if (this.title === '修改黑名单') {
              let data = {
                data: {
                  parameter: {
                    id: this.row.id,
                    phone: this.ruleForm.phoneNumber,
                    remark: this.ruleForm.remark,
                    oldPhone: this.oldPhone,
                    type: this.ruleForm.type
                  },
                  type: "update"
                }
              }
              this.$api.blackList(data).then((res) => {
                if (res.errorcode == 0) {
                  this.$message({
                    message: '修改黑名单成功',
                    type: 'success'
                  });
                  this.queryBlackList();
                  this.dialogVisible = false;
                  this.row = '';
                  this.$icp19.OperateBlackList(Number(this.agent_id), Number(this.ruleForm.phoneNumber), 0);
                  this.$icp19.OperateBlackList(Number(this.agent_id), Number(this.ruleForm.phoneNumber), 1);
                } else {
                  this.$message.error(res.msg);
                }
              })
            }
          } else {
            // this.$message.error('请输入正确的黑名单号码');
            return false;
          }
        });
      },
      rowClick(row) {
        console.log(row);
        this.row = row;
      },
      addBlackMan() {
        this.$nextTick(() => {
          if (this.$refs['ruleForm'] !== undefined) {
            this.$refs['ruleForm'].resetFields(); //如果是第一次就点击新增就没必要reset, 根据元素undefined判断
          }
          this.ruleForm.phoneNumber = '';
          this.ruleForm.remark = '';
        });
        this.title = '新增黑名单';
        this.dialogVisible = true;
      },
      /**
       * @lastDate 2020-10-14
       * @lastEditor hexinting
       * @description 修改黑名单
       */
      changeBlackMan() {
        if (!this.row) {
          this.$message({
            message: '请先选中要修改的黑名单号码',
            type: 'warning'
          });
        } else {
          this.$nextTick(() => {
            if (this.$refs['ruleForm'] !== undefined) {
              this.$refs['ruleForm'].resetFields(); //如果是第一次就点击修改就没必要reset, 根据元素undefined判断
            }
            this.title = '修改黑名单';
            this.ruleForm.phoneNumber = this.row.phoneNumber;
            this.oldPhone = this.row.phoneNumber;
            this.ruleForm.remark = this.row.remark;
            this.ruleForm.type = this.row.type === '传真' ? 'fax' : this.row.type === '电话' ? 'phone' : '' ;
            this.dialogVisible = true;
          })
        }
      },
      /**
       * @lastDate 2020-10-14
       * @lastEditor hexinting
       * @description 删除黑名单
       */
      deleteBlackMan() {
        if (!this.row) {
          this.$message({
            message: '请先选中要删除的黑名单号码',
            type: 'warning'
          });
        } else {
          this.$confirm('此操作将删除该骚扰电话号码，请谨慎操作', '删除提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let data = {
              data: {
                parameter: [this.row.id],
                type: "delete"
              }
            }
            console.log(data);
            this.$api.blackList(data).then((res) => {
              console.log(res)
              if (res.errorcode == 0) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.queryBlackList();
                this.$icp19.OperateBlackList(Number(this.agent_id), Number(this.ruleForm.phoneNumber), 0);
                this.dialogVisible = false;
                this.row = '';
              } else {
                this.$message.error(res.msg);
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }
      }
    }
  }
</script>

<style scoped>
  .pagination {
    float: right;
    width: 892px;
    height: 36px;
    margin-top: 16px;
    padding: 0;
  }

  .tableStyle {
    line-height: 36px;
  }

  /* .el-button+.el-button{
    margin-left: 30px;
  } */
</style>
