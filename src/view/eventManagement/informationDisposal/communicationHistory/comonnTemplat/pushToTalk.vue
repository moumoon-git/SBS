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
          <!--<el-select v-model="searchType" placeholder="灾害类型">
            <el-option 
              v-for="item in typeList" 
              :key="item.id" 
              :label="item.label" 
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="searchLevel" placeholder="事件等级">
            <el-option 
              v-for="item in levelList" 
              :key="item.id" 
              :label="item.label" 
              :value="item.value">
            </el-option>
          </el-select>-->
          <el-input
              type="text"
              placeholder="请输入单位、号码"
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
                    <el-col :span="12">
                      <el-form-item label="事件标题:">
                        <el-input
                          disabled
                          type="text"
                          v-model.trim="ruleForm.title"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                     <el-col :span="12">
                      <el-form-item label="时间:">
                        <el-input
                          disabled
                          type="text"
                          v-model.trim="ruleForm.time"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="gutter">
                    <el-col :span="12">
                      <el-form-item label="灾害类型:">
                        <el-input
                          disabled
                          type="text"
                          v-model.trim="ruleForm.type"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                     <el-col :span="12">
                      <el-form-item label="等级:">
                        <el-input
                          disabled
                          type="text"
                          v-model.trim="ruleForm.level"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="gutter">
                    <el-col :span="12">
                      <el-form-item label="上报人姓名:">
                        <el-input
                          disabled
                          type="text"
                          v-model.trim="ruleForm.reportName"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                     <el-col :span="12">
                      <el-form-item label="签发人姓名:">
                        <el-input
                          disabled
                          type="text"
                          v-model.trim="ruleForm.signName"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="gutter">
                    <el-col :span="24">
                      <el-form-item label="联系电话:">
                        <el-input
                          disabled
                          type="text"
                          v-model.trim="ruleForm.phone"
                        >
                        <template slot="append">
                          <el-button style="letter-spacing: 6px" @click="phone">
                            <i class="el-icon-phone"></i>
                          </el-button>
                        </template>
                        </el-input>
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
                            <el-button style="letter-spacing: 6px" @click="location">
                              <i class="el-icon-location-outline"></i>
                            </el-button>
                          </template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="事件描述:">
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
                      <el-form-item label="内容:">
                        <el-input
                          disabled
                          type="textarea"
                          :autosize="{ minRows: 4, maxRows: 8 }"
                          v-model.trim="ruleForm.text"
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
    import mixin from "@/view/integratedCommunication/icpPhone/icpPhonePage/mixin";
    import mixin2 from '@/view/yangZhouEventReports/assets/js/mixin/mixin.js'

    export default {
        name: "pushToTalk",
        mixins: [mixin, mixin2],
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
            searchLevel: '',
            searchText: '',
            selectEventInput: '',
            loadMore: true, // 是否有更多事件数据
            tableColumn: [
              {
                prop: "happenTime",
                label: "来信时间",
              },
              {
                prop: "receiveDeptName",
                label: "来信单位"
              },
              {
                prop: "phone",
                label: "来信号码"
              },
              {
                prop: "title",
                label: "事件标题"
              },
              {
                prop: "disasterType",
                label: "灾害类型",
                formatter: this.typeFormatter
              },
              {
                prop: "disasterLevel",
                label: "事件等级",
                formatter: this.levelFormatter
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
              time: '',
              type: '',
              level: '',
              reportName: '',
              signName: '',
              phone: '',
              address: '',
              remark: '',
              text: '',
            },
            visible : false,
            selectEventVisible: false,
            root:'',
            mapId: "ovId", //地图定位不同的ID
            disasterId: ''
          }
        },
        created(){
          window.addEventListener('resize', this.getHeight);
          this.getHeight()
          this.root=window.g.ApiMap;
          window.addEventListener("message", this.locationCallback);
          window.addEventListener("message", this.sendLocationMsg);
        },
        mounted(){
          this.getTableData();
          this.getEventList();
        },
        beforeDestroy() {
          window.removeEventListener("message", this.locationCallback);
          window.addEventListener("message", this.sendLocationMsg);
        },
        destroyed(){
          window.removeEventListener('resize', this.getHeight)
        },
        methods:{
          levelFormatter : function(row){
            var text = ''
            if(row.disasterLevel == 1) {
              text = '一般'
            } else if(row.disasterLevel == 2) {
              text = '急'
            } else if(row.disasterLevel == 3) {
              text = '特急'
            } 
            // else if(row.disasterLevel == 4) {
            //   text = '一般'
            // } else if(row.disasterLevel == 5) {
            //   text = '普通'
            // }
            return text;
          },
          typeFormatter : function(row){
            var text = ''
            if(row.disasterType == 'b') {
              text = '地质类'
            } else if(row.disasterType == 'c') {
              text = '内涝'
            } else if(row.disasterType == 'd') {
              text = '危险边坡'
            } else if(row.disasterType == 'e') {
              text = '危房'
            } else if(row.disasterType == 'f') {
              text = '建筑类'
            } else if(row.disasterType == 'g') {
              text = '水库出险'
            } else if(row.disasterType == 'h') {
              text = '地质类'
            } else if(row.disasterType == 'i') {
              text = '市政类'
            } else {
              text = '气象灾害'
            }
            return text;
          },
          getTableData(){
            let data={
              size:this.pageSize,
              page:this.currentPage,
              key: '',
              beginTime: '',
              endTime: '',
              disasterType:'',
              eventLevel:'',
            };
            this.$api.findAppDisaster(data).then((res) => {
              if(res.errorcode==0){
                this.tableData=res.data.data;
                this.total=res.data.total;

                this.disasterId = ''
                this.eventMsg.name = '';
                this.eventMsg.id = '';    
                this.lon = ''
                this.lat = ''
                this.address = ''
                this.ruleForm.title = ''
                this.ruleForm.time = ''
                this.ruleForm.type = ''
                this.ruleForm.level = ''
                this.ruleForm.reportName = ''
                this.ruleForm.signName = ''
                this.ruleForm.phone = ''
                this.ruleForm.address = ''
                this.ruleForm.remark = ''
                this.ruleForm.text = ''
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
                this.loadMore = res.data.data.length == 0 ? false : true;
              } else {
              }
            });
          },
          getHeight(){
            let h = document.documentElement.clientHeight || document.body.clientHeight
            this.affctionStyle.height = h - (68 + 240) + 'px'
          },
          save(){
            if(this.disasterId != '') {
              let data={
                disasterId: this.disasterId,
                eventId: this.eventMsg.id
              };
              this.$api.updateAppDisasterEvent(data).then((res) => {
                if(res.errorcode==0){
                  this.disasterId = ''
                  this.eventMsg.id = ''
                  this.getTableData();

                  this.disasterId = ''
                  this.eventMsg.name = '';
                  this.eventMsg.id = '';    
                  this.lon = ''
                  this.lat = ''
                  this.address = ''
                  this.ruleForm.title = ''
                  this.ruleForm.time = ''
                  this.ruleForm.type = ''
                  this.ruleForm.level = ''
                  this.ruleForm.reportName = ''
                  this.ruleForm.signName = ''
                  this.ruleForm.phone = ''
                  this.ruleForm.address = ''
                  this.ruleForm.remark = ''
                  this.ruleForm.text = ''
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
              size: this.pageSize,
              page: this.currentPage,
              key: this.searchText,
              beginTime: this.searchStartTime,
              endTime: this.searchEndTime,
              disasterType: this.searchType,
              eventLevel: this.searchLevel,
            };
            this.$api.findAppDisaster(data).then((res) => {
              if(res.errorcode==0){
                this.disasterId = ''
                this.eventMsg.name = '';
                this.eventMsg.id = '';    
                this.lon = ''
                this.lat = ''
                this.address = ''
                this.ruleForm.title = ''
                this.ruleForm.time = ''
                this.ruleForm.type = ''
                this.ruleForm.level = ''
                this.ruleForm.reportName = ''
                this.ruleForm.signName = ''
                this.ruleForm.phone = ''
                this.ruleForm.address = ''
                this.ruleForm.remark = ''
                this.ruleForm.text = ''
                this.fileList = [];

                this.tableData=res.data.data;
                this.total=res.data.total;
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
              disasterId: row.id
            };
            this.$api.findAppDisasterPic(data).then((res) => {
              if(res.errorcode==0){
                this.disasterId = res.data.id;
                if(res.data.appEvent) {
                  this.eventMsg.name = res.data.appEvent.title;
                  this.eventMsg.id = res.data.appEvent.id;
                } else {
                  this.eventMsg.name = '';
                  this.eventMsg.id = '';           
                }
                this.lon = res.data.lon;
                this.lat = res.data.lat;
                this.address = res.data.address;
                this.ruleForm.title = res.data.title
                this.ruleForm.time = res.data.happenTime

                if(res.data.disasterType == 'b') {
                  this.ruleForm.type = '地质类'
                } else if(res.data.disasterType == 'c') {
                  this.ruleForm.type = '内涝'
                } else if(res.data.disasterType == 'd') {
                  this.ruleForm.type = '危险边坡'
                } else if(res.data.disasterType == 'e') {
                  this.ruleForm.type = '危房'
                } else if(res.data.disasterType == 'f') {
                  this.ruleForm.type = '建筑类'
                } else if(res.data.disasterType == 'g') {
                  this.ruleForm.type = '水库出险'
                } else if(res.data.disasterType == 'h') {
                  this.ruleForm.type = '地质类'
                } else if(res.data.disasterType == 'i') {
                  this.ruleForm.type = '市政类'
                } else {
                  this.ruleForm.type = '气象灾害'
                }

                if(res.data.disasterLevel == 1) {
                  this.ruleForm.level = '一般'
                } else if(res.data.disasterLevel == 2) {
                  this.ruleForm.level = '急'
                } else if(res.data.disasterLevel == 3) {
                  this.ruleForm.level = '特急'
                } 
                // else if(res.data.disasterLevel == 4) {
                //   this.ruleForm.level = '一般'
                // } else if(res.data.disasterLevel == 5) {
                //   this.ruleForm.level = '普通'
                // }
                this.ruleForm.reportName = res.data.sendUserName
                this.ruleForm.signName = res.data.signUserName
                this.ruleForm.phone = res.data.phone
                this.ruleForm.address = res.data.address
                this.ruleForm.remark = res.data.description
                this.ruleForm.text = res.data.content
                if (res.data.appDisasterPics && res.data.appDisasterPics.length > 0) {
                  let array = [];
                  for (let i in res.data.appDisasterPics) {
                    let filelist = {};
                    filelist.name = res.data.appDisasterPics[i].name;
                    filelist.id = res.data.appDisasterPics[i].id;
                    filelist.url = res.data.appDisasterPics[i].sourceUrl;
                    array.push(filelist);
                  }
                  this.fileList = array;
                } else {
                  this.fileList = [];
                }
              }
            })
          },
          location() {
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
          locationCallback(obj) {
            if (obj.data.action && obj.data.action == "retpoint") {
              let latlon = obj.data.object.point.split(",");
              this.lon = latlon[0];
              this.lat = latlon[1];
              this.address = obj.data.object.address;
              this.$refs.loction.visible = false;
            }
          },
          sendLocationMsg(obj) {
            if (obj.data.action && obj.data.action == "ready") {
              if (this.lon && this.lat) {
                var mapFarme = document.getElementById("ovId");
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
          phone() {
            this.talkCall({number: this.ruleForm.phone});
          },
          handlePreview(file) {
            window.open(`${file.url}`);
          },
          beforeRemove(file, fileList) {
            // this.fileList.splice(this.fileList.indexOf(file), 1);
            // let data = {
            //   picId: file.id
            // }
            // this.$api.deleteAppDisasterPic(data).then((res) => {
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
            // const copyFile = new File([file], this.rename);
            // this.uploadFileMethod(copyFile)
            // return false
          },
          uploadFileMethod(param) {
            // let data = {
            //   picId: param.file.id,
            //   name: this.rename
            // }
            // this.$api.renameAppDisasterPic(data).then((res) => {
            //   this.$message({
            //     message: '修改成功！',
            //     type: 'success'
            //   });
            //   this.renameVisible = false
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
