<template>
    <div>
      <el-header class="navsBar" style="height: 80px">
        <el-col :span="24" style="text-align: left">
          <el-date-picker
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="请选择开始时间"
            v-model="searchStartTime"
            type="date">
          </el-date-picker>-
          <el-date-picker
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="请选择结束时间"
            v-model="searchEndTime"
            type="date">
          </el-date-picker>
          <!--<el-select v-model="searchType" placeholder="信息类型">
            <el-option 
              v-for="item in typeList" 
              :key="item.id" 
              :label="item.label" 
              :value="item.value">
            </el-option>
          </el-select>-->
          <el-input
              type="text"
              placeholder="请输入单位"
              v-model.trim="searchText"
              style="width: 227px"
          ></el-input>
          <el-button type="primary" size="medium" @click="searchByText">检索</el-button>
        </el-col>
      </el-header>
      <el-main style="padding: 2px 30px;background-color: white;" >
        <el-row>
          <el-col :span="12" class="background" :style="affctionStyle">
            <el-col :span="24">
              <my-table 
                style="text-align: center;"
                :tableColumn="tableColumn"
                :tableData="tableData"
                @handleCurrentChange="handleCurrentChange">
              </my-table>
              <el-pagination
                style="text-align: center;" 
                :small="pagingSize"
                :page-size="pageSize"
                :total="total"
                :current-page="currentPage"
                @size-change="handleSizeChange"
                @current-change="pageMode"
                layout="total,prev,pager,next,sizes,jumper">
              </el-pagination>
            </el-col>
          </el-col>
          <el-col :span="12">
            <div class="background" style="margin: 26px;" :style="affctionStyle">
              <div>
                <el-form
                  size="small"
                  label-width="90px"
                  :model="ruleForm"
                  ref="ruleForm"
                  label-position="right"
                  style="padding-bottom: 90px"
                >
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="关联事件:">
                        <el-popover placement="bottom" v-model="selectEventVisible">
                          <div>
                            <el-input v-model="selectEventInput" placeholder="请选择事件" size="small">
                              <i slot="suffix" class="el-input__icon el-icon-search" @click="searchSelectEvent"></i>
                            </el-input>
                          </div>
                          <template v-if="eventList.length > 0">
                            <ul>
                              <li
                                v-for="item in eventList"
                                :key="item.id"
                                @click="clickSelectEvent(item)"
                                :style="selectEventStyle(item.id)"
                              >{{item.title}}
                              </li>
                              <div>
                                <el-button round icon="iconfont icon-loadMore" size="mini" @click="loadMoreHandle" v-if="loadMore">
                                  加载更多
                                </el-button>
                                <div v-else>暂无更多数据</div>
                              </div>
                            </ul>
                          </template>
                          <template v-else>
                            <div style="text-align: center; margin-top: 10px">暂无数据</div>
                          </template>
                          <el-input
                            slot="reference"
                            v-model="eventMsg.name"
                            readonly
                            placeholder="请选择事件"
                            size="small"
                          ></el-input>
                        </el-popover>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-button type="primary" @click="save" style="float: right;">保存</el-button>
                    </el-col>
                  </el-row>
                  <el-row :gutter="gutter">
                    <el-col :span="24">
                      <el-form-item label="信息名称:">
                        <el-input
                          disabled
                          type="text"
                          v-model.trim="ruleForm.title"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="gutter">
                    <el-col :span="12">
                      <el-form-item label="信息类型:">
                        <el-input
                          disabled
                          type="text"
                          v-model.trim="ruleForm.type"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                     <el-col :span="12">
                      <el-form-item label="设备编号:">
                        <el-input
                          disabled
                          type="text"
                          v-model.trim="ruleForm.deviceNo"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="gutter">
                    <el-col :span="12">
                      <el-form-item label="单位名称:">
                        <el-input
                          disabled
                          type="text"
                          v-model.trim="ruleForm.unit"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                     <el-col :span="12">
                      <el-form-item label="行政区域:">
                        <el-input
                          disabled
                          type="text"
                          v-model.trim="ruleForm.area"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="gutter">
                    <el-col :span="12">
                      <el-form-item label="采集时间:">
                        <el-input
                          disabled
                          type="text"
                          v-model.trim="ruleForm.collectTime"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                     <el-col :span="12">
                      <el-form-item label="上传时间:">
                        <el-input
                          disabled
                          type="text"
                          v-model.trim="ruleForm.uploadTime"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="gutter">
                    <el-col :span="24">
                      <el-form-item label="地点:">
                        <el-input
                          disabled
                          type="text"
                          v-model.trim="ruleForm.address"
                        >
                          <template slot="append">
                            <el-button style="letter-spacing: 6px" @click="setLocation">
                              <i class="el-icon-location-outline"></i>
                            </el-button>
                          </template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="描述:">
                        <el-input
                          disabled
                          type="textarea"
                          :autosize="{ minRows: 4, maxRows: 8 }"
                          v-model.trim="ruleForm.remark"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="多媒体信息:">
                        <el-upload
                          action=""
                          disabled
                          :file-list="fileList"
                          :before-remove="beforeRemove"
                          :on-preview="handlePreview"
                          style="text-align: left"
                        >
                        </el-upload>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-main>
      <!--<el-dialog :visible.sync="visible" width="1000px" center append-to-body :close-on-click-modal="false">
        <div slot="title">定位</div>
          <iframe frameborder=0 width="100%" height="600px" scrolling=auto
            :src="`${root}/location.html?longitude=${lon}&latitude=${lat}&address=${address}&type=feedBack&showPickPop=true`"
          ></iframe>
      </el-dialog>-->
      <location ref="loction" :mapframe="mapId"></location>
    </div>
</template>

<script>
    import Location from "@/components/loction/loction";
    import myTable from "@/components/tables/tables"
    import {Url} from '@/assets/js/common'
    import bus from '@/components/common/js/eventBus';
    export default {
        name: "pushToTalk",
        components:{
          Location,
          myTable,
        },
        data(){
          return{
            lon: '',
            lat: '',
            address: '',
            gutter:24,
            searchStartTime: '',
            searchEndTime: '',
            searchType: '',
            searchText: '',
            selectEventInput: '',
            loadMore: true, // 是否有更多事件数据
            tableColumn: [
              {
                prop: "collectTime",
                label: "来信时间",
              },
              {
                prop: "collectUser",
                label: "来信单位"
              },
              {
                prop: "collectName",
                label: "信息名称"
              },
              {
                prop: "collectType",
                label: "信息类型",
                // formatter: this.collectTypeFormatter
              },
              {
                prop: "appEvent.title",
                label: "关联事件"
              },
            ],//表头数据
            total: 0,//数据总数
            pageSize: 10,//总页数
            currentPage: 1,//当前页数1
            pagingSize:false,  //分页大小
            tableData:[],//表格数据
            affctionStyle:{
              height:''
            },
            type: '',
            level: '',
            eventMsg: {
              name: '',
              id: ''
            },
            typeList:[],
            levelList: [],
            eventList: [],
            fileList: [],
            ruleForm: {
              title: '',
              type: '',
              deviceNo: '',
              unit: '',
              area: '',
              collectTime: '',
              uploadTime: '',
              address: '',
              remark: '',
            },
            visible : false,
            selectEventVisible: false,
            root:'',
            mapId: "overd", //地图定位不同的ID
            reportId:'',
          }
        },
        created(){
          window.addEventListener('resize', this.getHeight);
          this.getHeight()
          this.root=window.g.ApiMap;
          window.addEventListener("message", this.locationCallbac);
          window.addEventListener("message", this.sendLocationMs);
        },
        mounted(){
          this.getTableData();
          this.getEventList();
        },
        beforeDestroy() {
          window.removeEventListener("message", this.locationCallbac);
          window.addEventListener("message", this.sendLocationMs);
        },
        destroyed(){
          window.removeEventListener('resize', this.getHeight)
        },
        methods:{
          getTableData(){
            let data={
              size:this.pageSize,
              page:this.currentPage,
              collectType: '',
              key: '',
              beginTime: '',
              endTime: '',
            };
            this.$api.findAppSzXxydyjReport(data).then((res) => {
              if(res.errorcode==0){
                this.tableData=res.data.data;
                this.total=res.data.total;

                this.reportId = '';
                this.eventMsg.name = '';
                this.eventMsg.id = '';
                this.lon = '';
                this.lat = '';
                this.address = '';
                this.ruleForm.title = '';
                this.ruleForm.type = '';
                this.ruleForm.deviceNo = '';
                this.ruleForm.unit = '';
                this.ruleForm.area = '';
                this.ruleForm.collectTime = '';
                this.ruleForm.uploadTime = '';
                this.ruleForm.address = '';
                this.ruleForm.remark = '';
                this.fileList = [];
              }
            })
          },
          getEventList(){
            let ipData = {
              dtStart: "",
              dtEnd: "",
              searchText: this.selectEventInput,
              size:this.pageSize,
              page:this.currentPage,
            };
            this.$api.todolist(ipData).then((res) => {
              if (res.errorcode == 0) {
                if (!res.data) {
                  return
                }
                this.eventList.push(...res.data.data);
              } else {
              }
            });
          },
          getHeight(){
            let h = document.documentElement.clientHeight || document.body.clientHeight
            this.affctionStyle.height = h - (68 + 240) + 'px'
          },
          save(){
            if(this.reportId != '') {
              let data={
                reportId: this.reportId,
                eventId: this.eventMsg.id
              };
              this.$api.updateAppSzXxyjReportEvent(data).then((res) => {
                if(res.errorcode==0){
                  this.reportId = ''
                  this.eventMsg.id = ''
                  this.getTableData();

                  this.reportId = '';
                  this.eventMsg.name = '';
                  this.eventMsg.id = '';
                  this.lon = '';
                  this.lat = '';
                  this.address = '';
                  this.ruleForm.title = '';
                  this.ruleForm.type = '';
                  this.ruleForm.deviceNo = '';
                  this.ruleForm.unit = '';
                  this.ruleForm.area = '';
                  this.ruleForm.collectTime = '';
                  this.ruleForm.uploadTime = '';
                  this.ruleForm.address = '';
                  this.ruleForm.remark = '';
                  this.fileList = [];
                  
                  this.$message({
                    message: '保存成功！',
                    type: 'success'
                  });
                }
              })
            } else {
              this.$message({
                message: '请先选择左侧列表！',
                type: 'error'
              });
            }
          },
          searchByText(){ //按时间查询更新快报
            let data={
              size:this.pageSize,
              page:this.currentPage,
              collectType: this.searchType,
              key: this.searchText,
              beginTime: this.searchStartTime,
              endTime: this.searchEndTime,
            };
            this.$api.findAppSzXxydyjReport(data).then((res) => {
              if(res.errorcode==0){
                this.tableData=res.data.data;
                this.total=res.data.total;

                this.reportId = '';
                this.eventMsg.name = '';
                this.eventMsg.id = '';
                this.lon = '';
                this.lat = '';
                this.address = '';
                this.ruleForm.title = '';
                this.ruleForm.type = '';
                this.ruleForm.deviceNo = '';
                this.ruleForm.unit = '';
                this.ruleForm.area = '';
                this.ruleForm.collectTime = '';
                this.ruleForm.uploadTime = '';
                this.ruleForm.address = '';
                this.ruleForm.remark = '';
                this.fileList = [];
              }
            })
          },
          handleSizeChange(val){//监听每页数量
            this.pageSize=val;
            this.currentPage=1
            this.getTableData();
          },
          pageMode(val){//监听是第几页
            this.currentPage=val;
            this.getTableData();
          },
          handleCurrentChange(row){//表格点击
            console.log(row);
            let data={
              reportId: row.id
            };
            this.$api.findAppSzXxydyjReportAttach(data).then((res) => {
              if(res.errorcode==0){
                this.reportId = res.data.id;
                if(res.data.appEvent) {
                  this.eventMsg.name = res.data.appEvent.title;
                  this.eventMsg.id = res.data.appEvent.id;
                } else {
                  this.eventMsg.name = '';
                  this.eventMsg.id = '';           
                }
                this.lon = res.data.longitude;
                this.lat = res.data.latitude;
                this.address = res.data.area;
                this.ruleForm.title = res.data.collectName
                this.ruleForm.type = res.data.collectType
                this.ruleForm.deviceNo = res.data.deviceNo
                this.ruleForm.unit = res.data.collectUser
                this.ruleForm.area = res.data.area
                this.ruleForm.collectTime = res.data.collectTime
                this.ruleForm.uploadTime = res.data.uploadTime
                this.ruleForm.address = res.data.area
                this.ruleForm.remark = res.data.description
                if (res.data.appSzXxydyjReportAttachs && res.data.appSzXxydyjReportAttachs.length > 0) {
                  let array = [];
                  for (let i in res.data.appSzXxydyjReportAttachs) {
                    let filelist = {};
                    filelist.name = res.data.appSzXxydyjReportAttachs[i].fileName;
                    filelist.id = res.data.appSzXxydyjReportAttachs[i].id;
                    filelist.url = res.data.appSzXxydyjReportAttachs[i].sourceUrl;
                    array.push(filelist);
                  }
                  this.fileList = array;
                } else {
                  this.fileList = [];
                }
              }
            })
          },
          setLocation() {
          //   this.visible = false;
          //   this.$nextTick(() => {
          //     this.visible = true;
          //   });
          // },
            this.$refs.loction.visible = false;
            this.$refs.loction.rushLocation = false;
            this.$nextTick(() => {
              this.$refs.loction.visible = true;
              this.$refs.loction.rushLocation = true;
            });
          },
          locationCallbac(obj) {
            if (obj.data.action && obj.data.action == "retpoint") {
              let latlon = obj.data.object.point.split(",");
              this.lon = latlon[0];
              this.lat = latlon[1];
              this.address = obj.data.object.address;
              this.$refs.loction.visible = false;
            }
          },
          sendLocationMs(obj) {
            if (obj.data.action && obj.data.action == "ready") {
              if (this.lon && this.lat) {
                var mapFarme = document.getElementById("overd");
                if (mapFarme) {
                  var data = {};
                  data.action = "getpoint";
                  var object = {};
                  object.center = this.lon + "," + this.lat;
                  object.address = this.address;
                  object.area = "";
                  data.object = object;
                  mapFarme.contentWindow.postMessage(JSON.stringify(data), "*");
                }
              }
            }
          },
          handlePreview(file) {
            window.open(`${file.url}`);
          },
          beforeRemove(file, fileList) {
            // this.fileList.splice(this.fileList.indexOf(file), 1);
            // let data = {
            //   reportId: file.id,
            // }
            // this.$api.deleteAppSzXxydyjReportAttach(data).then((res) => {
            //   this.$message({
            //     message: '删除成功！',
            //     type: 'success'
            //   });
            //   this.getTableData();
            // });
          },
          searchSelectEvent() {
            this.currentPage = 1;
            this.eventList = [];
            this.getEventList()
          },
          loadMoreHandle() {
            this.currentPage ++;
            this.getEventList();
          },
          clickSelectEvent(obj) {
            this.selectEventVisible = false;
            this.eventMsg.name = obj.title;
            this.eventMsg.id = obj.id;
          },
          selectEventStyle() {
            return function (eventId) {
              if (this.eventMsg.id == eventId) {
                return "color:#0091ff;background-color:rgba(0, 145, 255, .1);";
              } else {
                return "";
              }
            };
          },
          beforeAvatarUpload(file) {
            // const copyFile = new File([file],  '哈哈哈哈');
            // this.uploadFileMethod(copyFile)
            // return false
          },
          uploadFileMethod(param) {
            // let data = {
            //   reportId: param.file.id,
            //   name: '哈哈哈'
            // }
            // this.$api.renameAppSzXxydyjReportAttach(data).then((res) => {
            //   this.$message({
            //     message: '修改成功！',
            //     type: 'success'
            //   });
            //   this.getTableData();
            // });
          },
        }
    }
</script>

<style scoped>
  .navsBar {
    margin: 0 30px;
    background-color: white;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    border:1px solid rgba(219, 219, 219, 1);
    border-radius:3px;
  }
  .background{
    background-color: white;
    height: 700px;
  }
</style>
