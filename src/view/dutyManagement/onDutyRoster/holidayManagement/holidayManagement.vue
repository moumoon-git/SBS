<!--@author：wzm-->
<template>
  <div class="out">
    <span>名称</span>
    <el-input v-model="search" style="width:200px"></el-input>
    <span>年份</span>
    <el-date-picker v-model="year" type="year" placeholder="选择日期" value-format="yyyy"></el-date-picker>
    <el-button @click="go" type="primary">查询</el-button>
    <p>
      <el-button @click="dialogFormVisible = true" type="primary">新增</el-button>
      <!-- 弹窗 -->
      <el-dialog title="新增节假日" :close-on-click-modal="false" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="名称" :label-width="formLabelWidth">
            <el-input v-model="form.region" auto-complete="off" maxlength="10" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="开始时间" :label-width="formLabelWidth">
            <el-date-picker v-model="form.begin" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" :label-width="formLabelWidth">
            <el-date-picker v-model="form.over" type="date" placeholder="选择日期(包含当天)"></el-date-picker>
          </el-form-item>
          <el-form-item label="备注" :label-width="formLabelWidth">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容"
                      v-model="form.text"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="add">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 止 -->
      <el-button type="primary" @click="openchange">修改</el-button>
      <!-- 弹窗 -->
      <el-dialog title="修改节假日" :close-on-click-modal="false" :visible.sync="dialogFormVisible1">
        <el-form>
          <el-form-item label="名称" :label-width="formLabelWidth">
            <el-input v-model="name" auto-complete="off" maxlength="10"></el-input>
          </el-form-item>
          <el-form-item label="开始时间" :label-width="formLabelWidth">
            <el-date-picker v-model="record" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" :label-width="formLabelWidth">
            <el-date-picker v-model="overtime" type="date" placeholder="选择日期(包含当天)"></el-date-picker>
          </el-form-item>
          <el-form-item label="备注" :label-width="formLabelWidth">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容"
                      v-model="daytext"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible1 = false">取 消</el-button>

          <el-button type="primary" @click="change">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 止 -->
      <el-button type="primary" @click="delet">删除</el-button>
      <!--       <el-dialog title="提示" :visible.sync="dialogFormVisible2" width="30%" center>-->
      <!--                <span>确定要删除该节假日么？</span>-->
      <!--                <span slot="footer" class="dialog-footer">-->
      <!--                <el-button @click="dialogFormVisible2 = false">取 消</el-button>-->
      <!--                <el-button type="primary" @click="del">确 定</el-button>-->
      <!--                </span>-->
      <!--              </el-dialog>-->
    </p>
    <my-table :tableColumn="tableColumn" @handleCurrentChange="test" :tableData="tableData"></my-table>
    <!-- //分页器 -->
    <el-pagination :small="pagingSize" :page-size="pageSize" :total="total"
                   @current-change="handleCurrentChange"
                   :current-page.sync="currentPage"
                   layout="total, prev, pager, next, jumper"></el-pagination>
  </div>
</template>
<script>
  import myTable from "@/components/tables/tables"

  export default {
    name: "holidayManagement",
    data() {
      return {
        search: '',
        year: '',
        // 分页器
        total: null,//数据总数
        pageSize: 10,//每页条数
        currentPage: 1,//当前页数
        pagingSize: true,  //分页大小
        dialogFormVisible: false,//add弹窗
        dialogFormVisible1: false,//修改弹窗
        dialogFormVisible2: false,//删除弹窗
        id: '',//事件id
        name: '',//名字
        record: '',//开始时间
        overtime: '',//结束时间
        daytext: '',//备注
        form: {
          region: '',
          begin: '',
          text: '',
          over: '',
        },
        formLabelWidth: '120px',
        tableColumn: [
          {
            prop: "name",
            label: "名称"
          },
          {
            prop: "date",
            label: "开始日期"
          }, {
            prop: "overtime",
            label: "结束日期(包含)"
          }, {
            prop: "duration",
            label: "天数"
          }],//表头
        tableData: [],//表格数据
      }
    },
    components: {
      myTable

    },
    methods: {
      // 刚开始数据
      axios() {
        let data = {
          page: 1,
          size: 10,
          name:'',
          year:''
        };
        //  请求
        this.$api.holidayManagement(data).then((res) => {
          console.log(res.data.data)
          // 返回的数据赋值给table
          if (res.data.data)
            this.tableData = res.data.data;
          // 把数据赋值给总共的数据总数total
          this.total = res.data.totalElements;
        })
      },
      searchApi() {
        // 请求发送后台的参数
        // console.log(this.currentPage)
        let data = {
          name: this.search,
          year: this.year,
          page: this.currentPage,
          size: 10
        };
        // console.log(data);
        this.$api.holidayManagement(data).then((res) => {
          // 返回的数据赋值给options
          this.tableData = res.data.data;
          // 把数据赋值给总共的数据总数tableData1
          this.total = res.data.totalElements;
        })
      },
      //  分页器
      handleCurrentChange() {
        if (this.data == undefined) {
          this.searchApi();
        } else {
          this.axios();
        }
      },
      go() {
        console.log(this.currentPage)
        let data = {
          year: this.year,
          name: this.search,
          page: this.currentPage,
          size: 10
        };
        console.log(data);
        this.$api.holidayManagement(data).then((res) => {
          // 返回的数据赋值给options
          this.tableData = res.data.data;
          // 把数据赋值给总共的数据总数tableData1
          this.total = res.data.totalElements;
        })
      },
      // 转时间
      formatDateTime(time) {
        // console.log(time)
        var date = time;
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        return y + '-' + m + '-' + d;
      },
      // 计算结束时间*****************************************************************
      //   endDateTime(time) {
      //   // console.log(time)
      //   var date = time;
      //   var y = date.getFullYear();
      //   var m = date.getMonth() + 1;
      //   m = m < 10 ? ('0' + m) : m;
      //   var d = date.getDate();
      //   d = d < 10 ? ('0' + d) : d;
      //   return y + '-' + m + '-' + d;
      // },
      //增加
      add() {
        if (this.form.region == '' || this.form.begin == '' || this.form.over == '') {
          this.$message({
            showClose: true,
            message: '名称和时间都不能为空哦!',
            type: 'error'
          });
        } else if (this.form.begin > this.form.over) {
          this.$message({
            showClose: true,
            message: '开始时间必须小于结束时间哦！',
            type: 'error'
          });
        } else {
          //一条数据的四个内容
          console.log(9)
          let begin = this.formatDateTime(this.form.begin)
          let over = this.formatDateTime(this.form.over)
          console.log(begin, over)
          let date1 = new Date(begin);
          let date2 = new Date(over);
          let date = (date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24);/*时间天数*/
          console.log(this.form.region);
          console.log(date);
          console.log(over);
          console.log(this.form.text);
          this.dialogFormVisible = false;
          let data = {
            "data": {
              name: this.form.region,
              overtime: over,
              date: begin,
              remark: this.form.text,
              duration: date + 1	//节日长度（日）
            }
          }
          this.$api.holidayManagementadd(data).then((res) => {
            if (res.errorcode != 0) {
              this.$message({
                message: res.msg,
              });
              return
            }
            this.go();
            this.form.region = '',
              this.form.begin = '',
              this.form.over = '',
              this.form.text = ''

          })
        }
      },
      timechange(time) {
        var d = new Date(time);
        var y = d.getFullYear();
        var m = d.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = d.getDay();
        d = d < 10 ? ('0' + d) : d;
        return y + '-' + m + '-' + d;
      },
      test(row) {
        console.log(row)
        this.name = row.name;
        this.record = row.date;
        this.id = row.id;
        this.overtime = row.overtime;
        this.daynum = row.duration;
        this.daytext = row.remark;
      },
      openchange() {
        if (this.id) {
          this.dialogFormVisible1 = true
        } else {
          this.$message({
            type: 'info',
            message: '请选择一个节假日'
          });
        }
      },
      // 修改
      change() {

        console.log(this.timechange(this.overtime));
        let overtime = this.timechange(this.overtime)
        console.log(this.record, overtime);
        console.log(this.form.region)
        if (this.name == '' || this.record == '' || this.overtime == '') {
          this.$message({
            showClose: true,
            message: '名称和时间都不能为空哦!',
            type: 'error'
          });
        }
        // else if(this.record>overtime) {
        //     console.log(111111111111)
        //     this.$message({
        //         showClose: true,
        //         message: '开始时间必须小于结束时间哦！',
        //         type: 'error'
        //     });
        // }
        else {
          console.log(this.overtime,this.record)
          // let over = this.timechange(this.overtime)
          // let begin = this.timechange(this.record)
          // console.log(hour)
          let date1 = new Date(this.record);
          // console.log(this.record)
          let date2 = new Date(this.overtime);
          console.log(date1, date2)
          let time = Math.ceil((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));/*时间天数*/
          console.log(time)
          if (time >= 0) {
            console.log(this.overtime,this.record)
            let data = {
              "data": {
                id: this.id,
                name: this.name,
                date: this.record,
                overtime: this.overtime,
                remark: this.daytext,
                duration: time + 1	//节日长度（日）
              }
            };
              console.log('data: ', data);
            this.dialogFormVisible1 = false
            this.$api.holidayManagementchange(data).then((res) => {
              if (res.errorcode != 0) {
                this.$message({
                  message: res.msg,
                });
                return
              }
              this.go();
            })
          } else {
            this.$message({
              showClose: true,
              message: '开始时间必须小于结束时间哦！',
              type: 'error'
            });
          }
        }

      },
      delet() {
        console.log(this.id)
        if (this.id) {
          this.$confirm('确认删除该节日, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let data = {
              id: this.id,
              // dutyLogId: this.bigid,	//duty_log 主键id
            };
            this.$api.holidayManagementdel(data).then((res) => {
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
              this.go();
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
            message: '请选择一个节假日'
          });
        }
      },
    },
    mounted() {
      this.axios()

    },

  }
</script>

<style scoped>
  .out {
    padding: 0 30px 0 30px;
    text-align: left;
  }
</style>
