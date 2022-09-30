<template>
  <div >
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
               :close-on-click-modal="false" @close="colsA">
      <el-form hide-required-asterisk label-width="90px" :model="ruleForm" :rules="rules" ref="ruleForm"
               label-position="left" @submit.native.prevent>
        <el-form-item label="单位名称:" prop="name">
          <el-input type="text" v-model.trim="ruleForm.name" show-word-limit></el-input>
        </el-form-item>

        <el-form-item label="到达人数:" >
          <el-input-number v-model.trim="ruleForm.number " :min="0" :max="99999"></el-input-number>
        </el-form-item>

        <el-form-item label="到达时间:" >

          <el-date-picker
            :format="isYangZhou?'yyyy-MM-dd HH:mm':'yyyy-MM-dd HH:mm:ss'"
            value-format='yyyy-MM-dd HH:mm:ss'
            v-model.trim="ruleForm.time"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>

        </el-form-item>

        <el-form-item label="装备:" >
          <el-input type="textarea" resize="none" :autosize="{minRows:5,maxRows:7}" v-model.trim="ruleForm.equip"
                    show-word-limit></el-input>
        </el-form-item>

        <el-form-item label="到达位置:" >
          <el-input type="text" v-model.trim="ruleForm.location " show-word-limit disabled>
            <template slot="append">
              <el-button @click="locationDialog">定位</el-button>
            </template>
          </el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <!--        <el-button @click="outerVisible = false">取消</el-button>-->
        <el-button size="small" type="primary" @click="lookForConfirmation('ruleForm')">确认</el-button>
      </div>
      <Location ref="loction" />
    </el-dialog>
  </div>
</template>

<script>
  import myTable from "@/yz_components/tables/tables"
  import Location from '@/views/modules/GarbageClassification/SiteManagement/ClassificationSite/Location/LocationDialog.vue';

  export default {
    name: "rescuePower",
    components: {
      myTable,
      Location
    },
    data() {
      return {
        tableColumn: [
          {
            prop: "name",
            label: "部门名称"
          },
          {
            prop: "value",
            label: "到场人数"
          },
          {
            prop: "time",
            label: "到场时间"
          },
          {
            prop: "equipment",
            label: "装备"
          },
          {
            prop: "address",
            label: "到达位置"
          }
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
          time: '',
          equip: '',
          location: ''
        },
        long: '',//经度
        lat: '',//纬度
        rules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'},
          ],
        },
        id: '',//事件ID
        tableRowData: [],//表格行点击数据
        isYangZhou: window.g.IsYangZhouProject
      }
    },
    created() {
      this.getTableData();
      window.addEventListener("message", this.locationCallback);
    },
    beforeDestroy() {
      window.removeEventListener('message', this.locationCallback);
    },
    methods: {
      locationDialog() {//定位
        this.$refs.loction.open({
          longitude: this.long,
          latitude: this.lat,
          address: this.ruleForm.location,
        }).then(({ longitude, latitude, address }) => {
          this.long = longitude;
          this.lat = latitude;
          this.ruleForm.location = address;
        });
      },
      locationCallback(obj) {
        if (obj.data.action && obj.data.action == "retpoint") {
          var latlon = obj.data.object.point.split(",");
          this.long = latlon[0];
          this.lat = latlon[1];
          this.ruleForm.location = obj.data.object.address;
          this.$refs.loction.visible = false;
        }
      },
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
        this.$api.rescueList(data).then((res) => {
          if (res.errorcode == '0') {
            this.tableData = res.data.data
            this.total = res.data.totalElements
            // 扬州需求 时间精确到分钟
            if(window.g.IsYangZhouProject){
              console.log(res.data.data)
              for(var i in res.data.data){
                this.tableData[i].time = res.data.data[i].time.substring(0,res.data.data[i].time.lastIndexOf(':'))
              }
            }
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
        this.title = '新增救援力量';
        this.ruleForm.name = '';
        this.ruleForm.number = '';
        this.ruleForm.time = '';
        this.ruleForm.equip = '';
        this.ruleForm.location = '';
        this.long = '';
        this.lat = '';
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
        this.title = '修改救援力量';
        this.ruleForm.name = this.tableRowData.name;
        this.ruleForm.number = this.tableRowData.value;
        this.ruleForm.time = this.tableRowData.time;
        this.ruleForm.equip = this.tableRowData.equipment;
        this.ruleForm.location = this.tableRowData.address;
        this.long = this.tableRowData.longitude;
        this.lat = this.tableRowData.latitude;
      },
      deleteReport() {//删除
        if (this.tableRowData == '' || this.tableRowData == null || this.tableRowData == []) {
          this.$message({
            message: '请点击表格选择内容进行删除！',
            type: 'warning'
          });
          return;
        }
        this.$confirm('此操作将删除该条内容, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            id: this.tableRowData.id
          };
          this.$api.rescueDelete(data).then((res) => {
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
            let addData,upData;
            switch (type) {
              case "新增救援力量":
                 addData = {
                  data: {
                    eventProcessId: this.id,
                    name: this.ruleForm.name,
                    value: this.ruleForm.number,
                    equipment: this.ruleForm.equip,
                    longitude: this.long,
                    latitude: this.lat,
                    address: this.ruleForm.location,
                    time: this.ruleForm.time
                  }
                };
                this.$api.rescueAdd(addData).then((res) => {
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
              case "修改救援力量":
                 upData = {
                  data: {
                    eventProcessId: this.id,
                    name: this.ruleForm.name,
                    value: this.ruleForm.number,
                    equipment: this.ruleForm.equip,
                    longitude: this.long,
                    latitude: this.lat,
                    address: this.ruleForm.location,
                    time: this.ruleForm.time,
                    id: this.tableRowData.id
                  }
                };
                this.$api.rescueUpdate(upData).then((res) => {
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
        console.log(row)
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
      colsA() {//清空规则
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

  >>> .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100%;
  }
</style>
