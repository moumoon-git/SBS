<template>
  <div class="unitresponse">
    <div class="qqai">
      <!-- <el-col :span="14"> -->
      <span class="qqai_title">各单位接响应</span>
      <!-- </el-col> -->
      <!-- <el-col :span="4" style="margin-left:20px"> -->
      <!-- 日期选择开始 -->
      <el-date-picker
        @change="publishresponse"
        v-model="value1"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd HH:mm:ss"
      ></el-date-picker>
      <!-- 日期选择结束 -->
      <!-- </el-col> -->
      <!-- <el-col :span="4.5" style="margin-left: 90px;margin-right: 8px;"> -->
      <!-- <div class="inputwrapper"> -->
      <el-input
        @change="publishresponse"
        clearable
        v-model="value"
        suffix-icon="el-icon-search"
        placeholder="请输入响应名称、单位关键字"
      ></el-input>
    </div>
    <!-- </div> -->
    <!-- <el-col :span="1">
        <el-button
          type="primary"
          class="buttonstyle"
          style="width: 66px;height: 40px;margin-top: 0px;"
          @click="publishresponse"
        >查询</el-button>
    </el-col>-->
    <!-- </el-row> -->
    <div class="unitresponse_content">
      <el-table
        :data="tableData"
        tooltip-effect="dark"
        height="calc(100vh - 242px)"
        header-row-class-name="title-row"
      >
        <!-- :header-cell-style="{background:'#f1f5ff',textAlign: 'center',height: '60px'}" -->
        <!-- :row-style="{textAlign: 'center',height: '60px', boxSizing: 'border-box'}" -->
        <el-table-column align="center" prop="name" label="响应名称"></el-table-column>
        <el-table-column align="center" prop="remark" label="响应说明"></el-table-column>
        <el-table-column align="center" prop="responseunit" label="响应单位"></el-table-column>
        <el-table-column align="center" prop="gmtCreate" label="发布时间"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看" placement="top">
              <img
                src="../../../assets/img/eye.svg"
                @click="handleLook(scope.$index,scope.row)"
                style="cursor:pointer;width:20px;margin-right: 10px"
                class="eye"
                @mouseenter="mouseEnterImg('eye',scope.$index)"
                @mouseleave="mouseLeaveImg('eye',scope.$index)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-footer>
      <div class="page1">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total,  prev, pager, next, sizes,jumper"
          :total="totalCount"
        ></el-pagination>
      </div>
    </el-footer>
    <!-- 查看等级响应弹框 -->
    <div class="queryresponsedialog">
      <el-dialog :visible.sync="centerDialogVisible" width="1060px" @close="closeWatchDialog" :close-on-click-modal="closeClickModal">
        <template slot="title">
          <div class="titleStyle">查看等级响应</div>
        </template>
        <div class="formcontent">
          <el-form
            status-icon
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
            style="background-color:#F5F8FF;"
          >
            <el-form-item>
              <img src="../../../assets/img/tip5.svg" />
              <el-form-item label="响应说明：" style="margin-top:-35px">{{remark}}</el-form-item>
            </el-form-item>
            <el-form-item label="附件：" style="margin-left:3px">
              <a :href="item.url" v-for="(item,index) in fileArr" :key="index" :download="item.documentName">{{item.documentName}}</a>
            </el-form-item>
          </el-form>
        </div>
        <el-header style="margin-top: 20px;text-align: center; border-bottom: 1px solid #E9ECF1">
          <div class="changebutton">
            <el-radio-group v-model="radio1" @change="changeshowcontent">
              <el-radio-button label="响应情况"></el-radio-button>
              <el-radio-button label="监督整改"></el-radio-button>
            </el-radio-group>
          </div>
        </el-header>
        <!-- 响应情况内容 -->
        <div class="responsecondition" v-if="isResponseShow">
          <el-container>
            <!-- 侧边栏部分 -->
            <el-aside style="width:32%;height:800px;padding: 0 10px;">
              <div class="asidecontent">
                <el-input
                  @change="queryResponseMany"
                  placeholder="请输入平台名称或响应负责人进行查询"
                  v-model="responsename"
                  prefix-icon="el-icon-search"
                  style="marginTop:12px"
                ></el-input>

                <!-- 日期选择开始 -->
                <el-date-picker
                  @change="queryResponseMany"
                  v-model="responsetime"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
                <!-- 日期选择结束 -->
                <!-- <el-button
                  type="primary"
                  style="width:320px;margin:10px 5px"
                  @click="queryResponseMany"
                >筛选</el-button>-->
                <!-- <div class="line"></div> -->
                <div class="responseNumber">
                  <span>
                    响应单位数：
                    <b>{{responseUnitsNumber}}/{{this.unitlist? this.unitlist.length : 0}}</b>
                  </span>
                  <span>
                    响应人数：
                    <b>{{responseTotalNumber}}</b>
                  </span>
                </div>
                <div class="chooseunit">
                  <ul style="list-style:none;padding:0">
                    <li :class="{active:  allChecked}" class="listyle" @click="checkAllUnit">全部单位</li>
                    <li
                      v-for="(item,index) in unitlist"
                      :key="index"
                      class="listyle"
                      :class="{active: currentindex == index}"
                      @click="changeunit(index,item.id)"
                    >
                      {{item.name}}
                      <b v-if="item.arr.length != 0" class="green_button">已响应</b>
                      <b v-else class="gray_button">未响应</b>
                    </li>
                    <!-- class="qqaibeifengle" -->
                  </ul>
                </div>
              </div>
            </el-aside>
            <!-- 侧边栏结束 -->
            <!-- 主体部分 -->
            <el-main
              style="width:95%;height:800px;padding-left:5px;padding-top:15px;padding-right:15px"
            >
              <div class="responsecontainer">
                <!-- 响应块 -->
                <div class="responseline" v-for="(item,index) in responseContentList" :key="index">
                  <div class="responseslide">
                    <!-- 响应内容 -->
                    <div class="responsemaincontent">
                      <el-row
                        style="background-color:#F0F6FF;height:50px;line-height:50px;margin-top:0px"
                      >
                        <span
                          style="left:0;background-color:#9CC6FE;color:#FFFFFF;font-size:16px;margin-left:0px;display:inline-block;width:45px;text-align: center;"
                        >响应</span>

                        <span
                          style="margin-left:20px;color:#555555;font-weight:bold"
                        >{{item.gmtCreate}}</span>
                        <span
                          style="position:absolute;right:10px;color:#555555;font-weight:bold"
                        >响应单位： {{item.platformName}}</span>
                      </el-row>
                      <el-row class="rowstyle">
                        响应人数：
                        <span style="color:#555555">{{item.responNum?item.responNum:0}}人</span>
                      </el-row>
                      <el-row class="rowstyle">
                        响应负责人：
                        <a href="#">{{item.person}} ({{item.personPhone}})</a>
                      </el-row>
                      <el-row class="rowstyle">
                        响应情况：
                        <span style="color:#555555">{{item.remark}}</span>
                      </el-row>
                      <el-row class="rowstyle">
                        <viewer>
                          <img
                            v-for="(item2,index2) in item.documentVoList"
                            :key="index2"
                            :src="item2.allUrl"
                            alt
                            class="imgstyle"
                          />
                        </viewer>
                      </el-row>
                    </div>
                  </div>
                </div>
                <!-- 响应块结束 
              
      <el-pagination
      @size-change="handleResponseSizeChange"
      @current-change="handleResponseCurrentChange"
      :current-page="responsecurrPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="responsepageSize"
      layout="total,  prev, pager, next, sizes,jumper"
      :total="responsetotalCount">
                </el-pagination>-->
              </div>
            </el-main>
          </el-container>
          <!-- 主体结束 -->
        </div>
        <!-- 响应情况结束 -->
        <!-- 监督整改内容开始 -->
        <div class="supervisioncontent" v-else>
          <el-container>
            <!-- 侧边栏部分 -->
            <el-aside
              style="width: 479px;height: 937px;padding: 15px 10px;box-sizing: border-box;"
              class="asidestyle"
            >
              <!-- 侧边栏切换 -->
              <!-- /*
              * @Author: liukanglin
              * @Date: 2020-09-02
              */-->
              <div class="aside_option">
                <div
                  :class="showall == '全部'?'aside_option_active':''"
                  @click="changeSuperviseStatus('全部')"
                >
                  全部
                  <span></span>
                </div>
                <div
                  :class="showall == '待整改'?'aside_option_active':''"
                  @click="changeSuperviseStatus('待整改')"
                >
                  待整改
                  <span></span>
                </div>
                <div
                  :class="showall == '已整改'?'aside_option_active':''"
                  @click="changeSuperviseStatus('已整改')"
                >
                  已整改
                  <span></span>
                </div>
              </div>
              <div
                class="supervisionall"
                v-for="(item,index) in superviseList"
                :key="index"
                @click="querySuperviseDetail(item.id)"
              >
                <el-row
                  style="height: 50px;background-color: #F0F6FF;font-size: 14px;padding-left:25px;line-height: 50px;"
                >
                  <el-col :span="8">{{item.name}}</el-col>
                  <el-col :span="8" :offset="8">{{item.gmtCreate}}</el-col>
                </el-row>
                <el-row class="rowstyle">
                  整改说明：
                  <span style="color:#555555">{{item.remark}}</span>
                </el-row>
                <el-row class="rowstyle">
                  整改单位：
                  <span style="color:#555555">{{item.superviseUnit}}</span>
                </el-row>
                <el-row
                  class="rowstyle"
                  v-for="(imgitem,index) in item.documentVoList"
                  :key="index"
                >
                  <viewer>
                    <img :src="imgitem.allUrl" alt class="supervisionimgstyle" />
                  </viewer>
                </el-row>

                <div style="position:absolute;left:330px;top:115px">
                  <img style="width:100px" v-if="item.status === 0" src="../../../assets/img/daizg.svg" />
                  <img style="width:100px" v-if="item.status !== 0" src="../../../assets/img/yizg.svg" />
                </div>
              </div>

              <!--  <el-pagination
      @size-change="handleSuperviseSizeChange"
      @current-change="handleSuperviseCurrentChange"     SupervisepageSize SupervisetotalCount  SupervisecurrPage
      :current-page="SupervisecurrPage"  
      :page-sizes="[10, 20, 30, 40]"
      :page-size="SupervisepageSize"
      layout="total,  prev, pager, next, sizes,jumper"
      :total="SupervisetotalCount">
              </el-pagination>-->
            </el-aside>
            <!-- 侧边栏部分结束 -->
            <!-- 主体部分 -->
            <el-main
              style="width: 878px;height: 939px;border-left:1px solid #d7d7d7;box-sizing:border-box;padding-left: 20px;padding-right:0px!important"
            >
              <div class="dage">整改部门</div>
              <div
                class="supervisionright"
                v-for="(item,index) in superviseDetailList"
                :key="index"
              >
                <div class="rightcontent" v-if="item.id != superviseId">
                  <el-row style="margin-top: 8px;margin-bottom:8px">
                    <span style="color:#666666;">{{item.platformString}}</span>
                    <span style="color:#999999;padding-left:10px">{{item.gmtCreate}}</span>
                  </el-row>

                  <div class="box_row">
                    <el-row class="rowstyle">
                      整改情况：
                      <span style="color:#555555">{{item.remark}}</span>
                    </el-row>
                    <el-row class="rowstyle">
                      整改负责人：
                      <a href="#">{{item.handerPeople}} ({{item.peoplePhone}})</a>
                    </el-row>
                    <el-row class="rowstyle">
                      <viewer>
                        <img
                          v-for="(imgitem,index) in item.documentVos"
                          :key="index"
                          :src="imgitem.allUrl"
                          alt
                          class="imgstyle"
                        />
                      </viewer>
                    </el-row>
                  </div>
                  <div style="clear:both;"></div>
                </div>
                <div class="rightcontent" v-else>
                  <el-row style="margin-top:8px;padding-left:400px">
                    <span style="color:#999999;font-size:14px">{{item.gmtCreate}}</span>
                    <span
                      style="color#555555;font-size:17px;padding-left:10px"
                    >{{item.platformString}}</span>
                  </el-row>
                  <div
                    style="width: 700px;height: 287px;border: 1px solid #d7d7d7;padding: 0px; 
                                box-sizing: border-box;border-radius: 5px;position: relative;
                                margin-left: 114px;background-color:#9FC8FE"
                  >
                    <el-row class="rowstyle">
                      整改情况：
                      <span style="color:#555555">{{item.remark}}</span>
                    </el-row>
                    <el-row class="rowstyle">
                      整改负责人：
                      <a href="#">{{item.handerPeople}} ({{item.peoplePhone}})</a>
                    </el-row>
                    <el-row class="rowstyle">
                      <img
                        v-for="(imitem,index) in item.documentVos"
                        :key="index"
                        :src="imitem.allUrl"
                        alt
                        class="imgstyle"
                      />
                    </el-row>
                  </div>
                </div>
              </div>
            </el-main>
            <!-- 主体部分结束 -->
          </el-container>
        </div>
        <!-- 监督整改内容结束 -->
      </el-dialog>
    </div>
    <!-- 查看等级弹框结束 -->
  </div>
</template>
<script>
export default {
  name: "unitresponse",
  data() {
    return {
      closeClickModal: false, //禁止点击model关闭dialog
      SupervisepageSize: 0,
      SupervisetotalCount: 0,
      SupervisecurrPage: 0,
      superviseDetailList: [], //右侧监督整改详情
      superviseList: [], //整改列表
      allChecked: true, //点击全部单位是否添加样式
      value: "", //选择框默认值
      value1: "", //日期选择器默认值
      tableData: [],
      totalCount: 0, //总条数
      pageSize: 0, //每页显示的条数
      totalPage: 0, //总页数，
      currPage: 0, //当前页数
      dialogFormVisible: false, //控制新增等级响应弹框的显示隐藏
      form: {
        //表单数据
        responsename: "",
        responsedesc: "",
      },
      formLabelWidth: "120px", //控制表单标签的宽度
      centerDialogVisible: false, //控制查看等级响应的弹框
      radio1: "响应情况", //控制图标切换
      isResponseShow: true, //控制响应情况内容是否展示
      responsename: "", //响应单位、单位负责人关键字
      responsetime: "", //响应日期
      tabPosition: "left", //控制tab栏的显示方向
      unitlist: [], //响应单位列表
      currentindex: -1, //响应单位的默认选中的下标
      showall: "全部", // 监督整改选择全部或者待整改
      responsetotalCount: 0, //响应内容总条数
      responsepageSize: 0, //响应内容每页显示的条数
      responsetotalPage: 0,
      responsecurrPage: 0, //响应当前页数
      fileArr: [], //文件列表
      remark: "", //响应说明
      responseContentList: [], //响应内容列表
      responseTotalNumber: 0, //响应人数
      responseUnitsNumber: 0, //响应单位数
      responseUnitId: '', //响应单位的id
    };
  },
  created() {
    this.$http({
      url: this.$http.adornUrl(`/level/levelPublish/list`),
      method: "post",
      data: this.$http.adornData({
        status: this.value,
        search: "",
        page: 1,
        limit: 10,
        startTime: "",
        endTime: "",
      }),
    }).then(({ data }) => {
      if (data && data.code === 0) {
        this.init(data);
      }
    });
  },
  methods: {
    closeWatchDialog(){
      // 清空响应单位的id
      this.responseUnitId = '';
      //默认设置一开始打开全部单位被选中
      this.allChecked = true;
    },
    //鼠标移入事件
    mouseEnterImg(val, index) {
      console.log("鼠标移入", index);
      if (val == "eye") {
        document
          .getElementsByClassName("eye")
          [index].setAttribute("src", require("../../../assets/img/eye2.svg"));
      }
    },
    //鼠标离开事件
    mouseLeaveImg(val, index) {
      console.log("鼠标离开", index);
      if (val == "eye") {
        document
          .getElementsByClassName("eye")
          [index].setAttribute("src", require("../../../assets/img/eye.svg"));
      }
    },
    downloadFile(filename, fileurl) {
      //下载文件
      this.$http({
        url: this.$http.adornUrl(`/level/levelPublish/dowload/file`),
        method: "get",
        params: this.$http.adornParams({
          fileName: filename,
          fileUrl: fileurl,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message.info("下载成功");
        }
      });
    },
    handleSuperviseSizeChange(val) {
      this.SupervisepageSize = val;
      this.$http({
        url: this.$http.adornUrl(`/levelRectifyPublish/selectPageList`),
        method: "post",
        data: this.$http.adornData({
          status: "",
          page: this.SupervisecurrPage,
          limit: this.SupervisepageSize,
          search: "",
          publishId: this.responseid,
        }),
      }).then(({ data }) => {
        let platformList = [];
        console.log("监督整改数据为", data);
        this.SupervisecurrPage = data.data.currPage;
        this.SupervisepageSize = data.data.pageSize;
        this.SupervisetotalCount = data.data.totalCount;
        data.data.list.forEach((item, index) => {
          platformList = [];
          item.platformList.forEach((platitem, index) => {
            platformList.push(platitem.platformName);
          });
          item.superviseUnit = platformList.join("、");
        });
        this.superviseList = data.data.list;
      });
    },
    handleSuperviseCurrentChange(val) {
      this.SupervisecurrPage = val;
      this.$http({
        url: this.$http.adornUrl(`/levelRectifyPublish/selectPageList`),
        method: "post",
        data: this.$http.adornData({
          status: "",
          page: this.SupervisecurrPage,
          limit: this.SupervisepageSize,
          search: "",
          publishId: this.responseid,
        }),
      }).then(({ data }) => {
        let platformList = [];
        console.log("监督整改数据为", data);
        this.SupervisecurrPage = data.data.currPage;
        this.SupervisepageSize = data.data.pageSize;
        this.SupervisetotalCount = data.data.totalCount;
        data.data.list.forEach((item, index) => {
          platformList = [];
          item.platformList.forEach((platitem, index) => {
            platformList.push(platitem.platformName);
          });
          item.superviseUnit = platformList.join("、");
        });
        this.superviseList = data.data.list;
      });
    },
    queryResponseMany() {
      this.$http({
        url: this.$http.adornUrl(`/level/levelResponseInfor/list`),
        method: "post",
        data: this.$http.adornData({
          publishId: this.responseid,
          search: this.responsename,
          page: this.responsecurrPage,
          limit: this.responsepageSize,
          startTime: this.responsetime ? this.responsetime[0] : "",
          endTime: this.responsetime ? (this.responsetime[1].split('00:00:00'))[0] + '23:59:59' : "",
          platformId: this.responseUnitId,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message.info("查询成功");
          // console.log("点击某一项获得的数据为", data);
          this.responsetotalCount = data.data.totalCount;
          this.responsepageSize = data.data.pageSize;
          this.responsecurrPage = data.data.currPage;
          this.responsetotalPage = data.data.totalPage;
          this.responseContentList = data.data.list;
        }
      });
    },
    // 根据不同的状态获取不同的数据列表
    changeSuperviseStatus(type) {
      this.showall = type;
      if (this.showall == "待整改") {
        this.$http({
          url: this.$http.adornUrl(`/levelRectifyPublish/selectPageList`),
          method: "post",
          data: this.$http.adornData({
            status: "0",
            page: 1,
            limit: 10,
            search: "",
            publishId: this.responseid,
          }),
        }).then(({ data }) => {
          let platformList = [];
          console.log("监督整改数据为", data);
          data.data.list.forEach((item, index) => {
            platformList = [];
            item.platformList.forEach((platitem, index) => {
              platformList.push(platitem.platformName);
            });
            item.superviseUnit = platformList.join("、");
          });
          this.superviseList = data.data.list;
        });
      }
      if (this.showall == "已整改") {
        this.$http({
          url: this.$http.adornUrl(`/levelRectifyPublish/selectPageList`),
          method: "post",
          data: this.$http.adornData({
            status: "1",
            page: 1,
            limit: 10,
            search: "",
            publishId: this.responseid,
          }),
        }).then(({ data }) => {
          let platformList = [];
          console.log("监督整改数据为", data);
          data.data.list.forEach((item, index) => {
            platformList = [];
            item.platformList.forEach((platitem, index) => {
              platformList.push(platitem.platformName);
            });
            item.superviseUnit = platformList.join("、");
          });
          this.superviseList = data.data.list;
        });
      }
      if (this.showall == "全部") {
        this.$http({
          url: this.$http.adornUrl(`/levelRectifyPublish/selectPageList`),
          method: "post",
          data: this.$http.adornData({
            status: "",
            page: 1,
            limit: 10,
            search: "",
            publishId: this.responseid,
          }),
        }).then(({ data }) => {
          let platformList = [];
          console.log("监督整改数据为", data);
          data.data.list.forEach((item, index) => {
            platformList = [];
            item.platformList.forEach((platitem, index) => {
              platformList.push(platitem.platformName);
            });
            item.superviseUnit = platformList.join("、");
          });
          this.superviseList = data.data.list;
        });
      }
    },
    init(data) {
      let tablelist = [];
      let responseUnit = "";
      let responseUnitArr = [];
      console.log("块出来：", data);
      tablelist = data.page.list;
      tablelist.forEach((item, index) => {
        responseUnitArr = [];
        if (item.platformList != null) {
          item.platformList.forEach((item2, index) => {
            responseUnitArr.push(item2.platformName);
          });
        }

        // console.log("responseUnitARR", responseUnitArr.toString());
        item.responseunit = responseUnitArr.join("、");
      });
      console.log("tablelist", tablelist);
      this.tableData = tablelist;
      this.totalCount = data.page.totalCount; //总条数
      this.pageSize = data.page.pageSize; //每页显示的条数
      this.totalPage = data.page.totalPage; //总页数，
      this.currPage = data.page.currPage; //当前页
    },
    checkAllUnit() {
      this.allChecked = true;
      this.currentindex = -1;
      this.$http({
        url: this.$http.adornUrl(`/level/levelResponseInfor/list`),
        method: "post",
        data: this.$http.adornData({
          search: "",
          page: this.responsecurrPage,
          limit: this.responsepageSize,
          startTime: "",
          endTime: "",
          publishId: this.responseid,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log("点击某一项获得的数据为", data);
          this.responsetotalCount = data.data.totalCount;
          this.responsepageSize = data.data.pageSize;
          this.responsecurrPage = data.data.currPage;
          this.responsetotalPage = data.data.totalPage;
          this.responseContentList = data.data.list;
        }
      });
    },
    handleResponseSizeChange(pageSize) {
      this.ResponsepageSize = pageSize;
      this.$http({
        url: this.$http.adornUrl(`/level/levelPublish/getUnitAndResponse`),
        method: "post",
        data: this.$http.adornData({
          serach: "",
          startTime: "",
          endTime: "",
          page: this.responsecurrPage,
          limit: pageSize,
          publishId: this.responseid,
        }),
      }).then(({ data }) => {
        console.log("查看等级响应的数据为", data);
        let fileOldArr = [];
        // let filename = data.LevelPublish.fileName? data.LevelPublish.fileName:[]
        // let fileurl = data.LevelPublish.fileUrl? data.LevelPublish.fileUrl:[]
        this.remark = data.LevelPublish.remark;
        filename.forEach((item, index) => {
          fileOldArr.push({
            filename: filename[index],
            fileurl: fileurl[index],
          });
        });
        fileOldArr = data.LevelPublish.publishDocumentList;
        console.log("fileOldArr", fileOldArr);
        this.fileArr = fileOldArr;
        this.unitlist = data.platformList.map((item) => {
          return { id: item.id, name: item.platformName };
        });
      });
    },
    handleResponseCurrentChange(currentpage) {
      this.responsecurrPage = currentpage;
      this.$http({
        url: this.$http.adornUrl(`/level/levelPublish/getUnitAndResponse`),
        method: "post",
        data: this.$http.adornData({
          serach: "",
          startTime: "",
          endTime: "",
          page: currentpage,
          limit: this.responsepageSize,
          publishId: this.responseid,
        }),
      }).then(({ data }) => {
        console.log("查看等级响应的数据为", data);
        let fileOldArr = [];
        // let filename = data.LevelPublish.fileName? data.LevelPublish.fileName:[]
        // let fileurl = data.LevelPublish.fileUrl? data.LevelPublish.fileUrl:[]
        this.remark = data.LevelPublish.remark;
        // filename.forEach((item,index) => {
        //     fileOldArr.push({"filename": filename[index],"fileurl": fileurl[index]})
        // })
        fileOldArr = data.LevelPublish.publishDocumentList;
        console.log("fileOldArr", fileOldArr);
        this.fileArr = fileOldArr;
        this.unitlist = data.platformList.map((item) => {
          return { id: item.id, name: item.platformName };
        });
      });
    },
    publishresponse() {
      // this.centerDialogVisible = true
      console.log("value", this.value);
      console.log("value1", this.value1 instanceof Array);
      // this.dialogFormVisible = true
      this.$http({
        url: this.$http.adornUrl(`/level/levelPublish/list`),
        method: "post",
        data: this.$http.adornData({
          status: "",
          search: this.value,
          page: this.currPage,
          limit: this.pageSize,
          // startTime: this.value1[0] ? this.value1[0] : "",
          // endTime: this.value1[1] ? this.value1[1] : "",
          startTime: this.value1 ? (this.value1[0] ? this.value1[0] : "") : "",
          endTime: this.value1 ? (this.value1[1] ? (this.value1[1].split('00:00:00'))[0] + '23:59:59' : "") : "",
        }),
      }).then(({ data }) => {
        console.log("data", data);
        if (data && data.code === 0) {
          this.$message.info("查询成功");
          this.init(data);
        } else {
          this.$message.error("查询失败请重试");
        }
      });
    },
    changeshowcontent() {
      if (this.radio1 === "响应情况") {
        this.isResponseShow = true;
      } else {
        this.isResponseShow = false;
        this.$http({
          url: this.$http.adornUrl(`/levelRectifyPublish/selectPageList`),
          method: "post",
          data: this.$http.adornData({
            status: "",
            page: 1,
            limit: 10,
            search: "",
            publishId: this.responseid,
          }),
        }).then(({ data }) => {
          let platformList = [];
          console.log("监督整改数据为", data);
          this.SupervisecurrPage = data.data.currPage;
          this.SupervisepageSize = data.data.pageSize;
          this.SupervisetotalCount = data.data.totalCount;
          data.data.list.forEach((item, index) => {
            platformList = [];
            item.platformList.forEach((platitem, index) => {
              platformList.push(platitem.platformName);
            });
            item.superviseUnit = platformList.join("、");
          });
          this.superviseList = data.data.list;
        });
      }
    },
    changeunit(index, id) {
      this.responseUnitId = id;
      this.allChecked = false;
      this.currentindex = index;
      console.log("id", id);
      this.$http({
        url: this.$http.adornUrl(`/level/levelResponseInfor/list`),
        method: "post",
        data: this.$http.adornData({
          search: "",
          page: this.responsecurrPage,
          limit: this.responsepageSize,
          startTime: "",
          endTime: "",
          platformId: this.responseUnitId,
          publishId: this.responseid,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log("点击某一项获得的数据为", data);
          this.responsetotalCount = data.data.totalCount;
          this.responsepageSize = data.data.pageSize;
          this.responsecurrPage = data.data.currPage;
          this.responsetotalPage = data.data.totalPage;
          this.responseContentList = data.data.list;
        }
      });
    },
    handleLook(index, row) {
      this.responseTotalNumber = 0; //先将响应人数重新设置为0
      this.responseUnitsNumber = 0; //先将响应单位数重新设置为0
      this.responsename = "";
      this.responsetime = "";
      this.responseid = row.id;
      console.log("rowid",row,row.id);
      this.$http({
        url: this.$http.adornUrl(`/level/levelPublish/getUnitAndResponse`),
        method: "post",
        data: this.$http.adornData({
          serach: "",
          startTime: "",
          endTime: "",
          page: 1,
          limit: 10,
          publishId: row.id,
        }),
      }).then(({ data }) => {
        console.log("查看等级响应的数据为", data);
        let fileOldArr = [];
        // let filename = data.LevelPublish.fileName? data.LevelPublish.fileName:[]
        // let fileurl = data.LevelPublish.fileUrl? data.LevelPublish.fileUrl:[]
        this.remark = data.LevelPublish.remark;
        // filename.forEach((item,index) => {
        //     fileOldArr.push({"filename": filename[index],"fileurl": fileurl[index]})
        // })
        fileOldArr = data.LevelPublish.publishDocumentList;
        console.log("fileOldArr", fileOldArr);
        this.fileArr = fileOldArr;
        // this.unitlist = data.platformList.map((item) => {
        //   return { id: item.id, name: item.platformName };
        // });
        this.unitlist = data.platformList.map((item) => {
          let arr = [];
          data.responseinfo.list.forEach((val)=>{
            if(val.platformId == item.id){
              // console.log(val);
              arr.push(val);
            }
          })
          console.log(arr);
          return { id: item.id, name: item.platformName,arr };
        });
        console.log(this.unitlist);
        this.unitlist.forEach(item=>{
          if(item.arr.length != 0){
            this.responseUnitsNumber++;
          }
        })
        this.responsetotalCount = data.responseinfo.totalCount;
        this.responsepageSize = data.responseinfo.pageSize;
        this.responsecurrPage = data.responseinfo.currPage;
        this.responsetotalPage = data.responseinfo.totalPage;
        this.responseContentList = data.responseinfo.list;
        data.responseinfo.list.forEach(item=>{
          if(item.responNum){
            this.responseTotalNumber += parseInt(item.responNum)
          }
        })
      });
      this.centerDialogVisible = true;
    },
    querySuperviseDetail(id) {
      //查询右侧部门信息
      this.superviseId = id;
      this.$http({
        url: this.$http.adornUrl(`/level/levelRectifyInfo/selectPagelist`),
        method: "post",
        data: this.$http.adornData({
          publishId: id,
        }),
      }).then(({ data }) => {
        console.log("右侧列表数据为", data);
        this.superviseDetailList = data.data;
      });
    },
    handleSizeChange(pageSize) {
      console.log("每页大小", pageSize);
      this.pageSize = pageSize;
      this.$http({
        url: this.$http.adornUrl(`/level/levelPublish/list`),
        method: "post",
        data: this.$http.adornData({
          status: this.value,
          search: "",
          page: this.currPage,
          limit: pageSize,
          startTime: "",
          endTime: "",
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.init(data);
        }
      });
    },
    handleCurrentChange(currentpage) {
      console.log("page", currentpage);
      this.currPage = currentpage;
      this.$http({
        url: this.$http.adornUrl(`/level/levelPublish/list`),
        method: "post",
        data: this.$http.adornData({
          status: this.value,
          search: "",
          page: currentpage,
          limit: this.pageSize,
          startTime: "",
          endTime: "",
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.init(data);
        }
      });
    },
  },
};
</script>
<style scoped lang="less">
  * {
    font-family: "Microsoft YaHei", PingFangSC-Regular, "PingFang SC",
      Roboto-Regular, SourceHanSansCN-Regular;
  }
  .qqai {
    padding: 10px;
    line-height: 36px;
    position: relative;
    /deep/ .el-input {
      width: 300px;
      position: absolute;
      right: 28px;
    }
    /deep/ .el-input__inner {
      width: 300px;
      height: 36px;
      margin-top: 0px;
      margin-left: 5px;
    }
    /deep/ .el-date-editor--daterange {
      width: 320px;
      height: 36px;
      margin-left: 50px;
      margin-top: 0px;
      position: absolute;
      right: 333px;
    }
  }
  .qqai_title {
    font-size: 16px;
    margin-right: 5px;
    font-weight: bold;
    color: #333333;
    border-left: 3px solid #0091ff;
    padding-left: 10px;
    height: 16px;
    line-height: 16px;
    display: inline-block;
  }
  .qqaibeifengle {
    font-size: 15px;
    text-align: left;
    margin-top: 5px;
  }
  .unitresponse {
    overflow: hidden;
    border-radius: 4px;
  }
  .unitresponse_content {
    height: (100vh - 240px);
    .el-table {
      height: 100%;
      -webkit-box-shadow: none;
      box-shadow: none;
      font-size: 14px;
      /deep/ .el-table__body {
        /deep/ td {
          border-left: none;
          border-right: none;
        }
        tr {
          background: none;
        }
        tr:hover {
          box-shadow: 0px 0px 11px 3px rgba(67, 85, 114, 0.1);
          td:nth-child(1) {
            border-left: 3px solid #0091ff;
          }
        }
      }
      /deep/ .el-table__row {
        // font-weight: normal;
        .cell {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      }
      /deep/.title-row th {
        background: #f1f5ff;
        text-align: center;
      }
    }
  }
  /deep/ .el-dialog__body {
    border-bottom: 1px solid #f2f2f2;
  }
  /deep/ .el-pagination {
    // margin-top: 48px;
    height: 72px;
    position: absolute;
    right: 20px;
    top: 5px;
  }
  .dage {
    border-left: 2px #3f92fe solid;
    padding-left: 10px;
    color: #333333;
    height: 16px;
    line-height: 16px;
    font-size: 16px;
    font-weight: bold;
  }
  .buttonstyle {
    background-color: #0091ff;
    margin-top: 0px;
  }
  .is-background {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .inputname {
    width: 400px;
  }
  .el-textarea /deep/.el-textarea__inner {
    width: 700px;
  }
  .responseunit {
    width: 700px;
    height: 100px;
    background-color: #f1f5ff;
    margin-left: 120px;
  }
  .responseunit /deep/ .el-button {
    margin-left: 15px;
    margin-top: 15px;
    position: relative;
  }
  .responseunit /deep/ .deleteicon {
    position: absolute;
    top: -16px;
    right: -18px;
    font-size: 30px;
    color: #d7d7d7;
  }
  .dialog-footer {
    text-align: center;
  }
  .dialog-footer /deep/ .el-button {
    height: 50px;
    width: 150px;
  }
  .dialogheaderstyle /deep/ .el-dialog__header {
    background: #f1f4f6;
    padding-left: 0px;
    height: 65px;
    padding-top: 25px;
  }
  .dialogheaderstyle /deep/ .el-dialog__headerbtn {
    position: absolute;
    top: 20px;
    right: 10px;
    padding: 0;
    background: 0 0;
    border: none;
    outline: 0;
    cursor: pointer;
    font-size: 24px !important;
  }
  .unitresponse {
    position: relative;
    background-color: #ffffff;
    height: calc(100vh - 112px);
  }
  .queryresponsedialog /deep/ .el-dialog__header {
    background-color: #f1f4f6;
    height: 65px;
    font-size: 18px;
    padding-top: 22px;
    padding-left: 28px;
  }
  .queryresponsedialog /deep/ .el-dialog__headerbtn {
    position: absolute;
    top: 20px;
    right: 10px;
    padding: 0;
    background: 0 0;
    border: none;
    outline: 0;
    cursor: pointer;
    font-size: 24px !important;
  }
  .queryresponsedialog /deep/ .el-dialog__body {
    padding-left: 0px;
    padding-top: 0px;
    padding-right: 0px;
    padding: 0;
  }
  .formcontent /deep/ .el-form-item {
    margin-bottom: 0px;
  }
  .formcontent /deep/ .el-form-item__content {
    margin-left: 30px !important;
  }

  .changebutton /deep/ .is-active {
    background-color: #0091ff;
  }
  .changebutton
    /deep/
    .el-radio-button__orig-radio:checked
    + .el-radio-button__inner {
    background-color: #0091ff !important;
    color: #ffffff;
  }
  .changebutton /deep/ .el-radio-group {
    width: 230px !important;
    height: 40px;
  }
  .changebutton /deep/ .el-radio-button {
    width: 115px;
    height: 40px;
    border-radius: 5px;
  }
  .changebutton /deep/ .el-radio-button__inner {
    width: 115px;
    height: 40px;
    line-height: 18px;
    color: #999999;
  }
  .page {
    position: absolute;
    bottom: 0;
    left: 486px;
  }
  .page1 {
    // margin-top: -30px;
    position: relative;
  }
  .asidecontent {
    height: 100%;
    border-right: 1px solid #d7d7d7;
  }
  .asidecontent /deep/ .el-input__inner {
    width: calc(100% - 20px);
    margin: 3px 5px;
    // padding-left: 25px;
    margin-bottom: 0px;
    border-radius: 18px;
  }
  .asidecontent /deep/ .el-input__prefix {
    top: 3px;
    left: 10px;
  }
  .asidecontent /deep/ .el-date-editor {
    margin-top: 10px;
  }
  .choose {
    width: 275px;
    margin-top: 10px;
    margin-left: 22px;
    height: 40px;
    font-size: 13px;
  }
  .line {
    width: 310px;
    border-top: 1px solid #d7d7d7;
    margin-top: 0px;
    margin-left: 10px;
  }
  .active {
    // background-color: #f1f5ff;
    background: rgba(0, 145, 255, 0.1);
    border-left: 2px solid #15a6fc;
  }
  .listyle {
    padding: 10px 85px 10px 27px;
    font-size: 14px;
    color: #333333;
    width: 330px;
    margin-left: -10px;
    cursor: pointer;
    /* height: 40px; */
  }
  .responseslide {
    width: 100%;
    height: 323px;
    position: relative;
    // margin-left: 50px;
    /* margin-top: 15px; */
    border: 1px solid #d7d7d7;
    // border-radius: 5px;
  }
  .triangle {
    top: 22px;
    left: -22px;
    width: 50px;
    height: 50px;
    position: absolute;
    background: url(../../../assets/img/arrowslide.png) no-repeat;
  }
  .responseline {
    width: 100%;
    height: 327px;

    position: relative;
    margin-bottom: 10px;
  }
  .responseNumber {
    height: 50px;
    line-height: 50px;
    margin-left: -10px;
    padding-left: 27px;
    position: relative;
    span:nth-last-child(1) {
      position: absolute;
      right: 30px;
    }
    b {
      font-size: 16px;
    }
  }
  .chooseunit {
    .listyle {
      position: relative;
      b {
        position: absolute;
        right: 13px;
        top: 50%;
        margin-top: -15px;
        color: #ffffff;
        font-weight: normal;
        padding: 5px;
        border-radius: 4px;
        width: 66px;
        text-align: center;
        &.green_button {
          background-color: #0bd295;
        }
        &.gray_button {
          background-color: #cccccc;
        }
      }
    }
  }
  .buttoncircle {
    position: absolute;
    left: -19px;
    top: 23px;
    width: 35px;
    height: 35px;
    border-radius: 20px;
    background-color: #15a6fc;
    color: #fff;
    text-align: center;
    line-height: 35px;
  }
  .fontstyle {
    font-size: 14px;
    color: #000;
  }
  .imgstyle {
    width: 192px;
    height: 163px;
    margin-right: 13px;
  }
  .box_row {
    width: 100%;
    min-height: 287px;
    box-shadow: 0px 1px 5px 0px rgba(187, 211, 230, 0.5);
    border: 1px solid #d7d7d7;
    margin-left: -8px;
    padding: 0px;
    box-sizing: border-box;
    float: left;
    border-radius: 7px;
    position: relative;
  }
  .rowstyle {
    margin: 8px 15px;
    color: #999999;
  }
  .asidestyle .aside_option {
    height: 58px;
    line-height: 58px;
    text-align: center;
    display: flex;
    margin: -15px -10px 20px -10px;
    border-bottom: 1px solid #e9ecf1;
  }
  .asidestyle .aside_option div {
    width: 33.33%;
    cursor: pointer;
    position: relative;
  }
  .asidestyle .aside_option .aside_option_active {
    font-weight: bold;
  }
  .asidestyle .aside_option .aside_option_active span {
    position: absolute;
    width: 16px;
    height: 16px;
    border: 1px solid #d7d7d7;
    border-right: none;
    border-bottom: none;
    background-color: #ffffff;
    bottom: -8px;
    left: 50%;
    margin-left: -8px;
    transform: rotate(45deg);
  }
  .asidestyle /deep/ .el-radio-group {
    width: 456px !important;
    margin-bottom: 10px;
    height: 40px;
  }
  .asidestyle /deep/ .el-radio-button {
    width: 152px;
    height: 40px;
  }
  .asidestyle /deep/ .el-radio-button__inner {
    width: 152px;
    height: 40px;
  }
  .asidestyle /deep/ .is-active {
    background-color: #0091ff;
  }
  .asidestyle
    /deep/
    .el-radio-button__orig-radio:checked
    + .el-radio-button__inner {
    background-color: #0091ff !important;
  }
  .supervisionall {
    width: 454px;
    min-height: 258px;
    border: 1px solid #d7d7d7;
    margin-bottom: 10px;
    margin-left: 3px;
    position: relative;
  }
  .supervisionimgstyle {
    width: 170px;
    height: 130px;
  }
  .supervisionbutton {
    width: 58px;
    height: 58px;
    border-radius: 50%;
    background-color: #f59a23;
    position: absolute;
    text-align: center;
    line-height: 58px;
    color: #fff;
    right: 11px;
    top: 57px;
  }
  .arrowpic {
    top: 22px;
    left: -22px;
    width: 50px;
    height: 50px;
    position: absolute;
    background: url(../../../assets/img/arrowslide.png) no-repeat;
  }
  .greenarrowpic {
    top: 26px;
    right: -50px;
    width: 50px;
    height: 50px;
    position: absolute;
    background: url(../../../assets/img/greenarrow.png) no-repeat;
  }
  .rightcontent {
    margin-top: 10px;
  }
  .troop {
    float: right;
    background-color: #70b603;
    width: 85px;
    /* height: 38px; */
    text-align: center;
    box-sizing: border-box;
    font-size: 13px;
    padding: 0px;
    line-height: normal;
    letter-spacing: normal;
    margin-right: 14px;
    margin-top: 18px;
  }
  .unitnamewrapper /deep/ .el-input--medium .el-input__inner {
    width: 278px;
    height: 40px;
    padding: 10px;
    margin-left: 22px;
  }
  .unitnamewrapper
    /deep/
    .el-input--medium
    .el-input__inner::-webkit-input-placeholder {
    color: #7f7f7f;
    font-size: 14px;
  }
  .unitnamewrapper
    /deep/
    .el-input--medium
    .el-input__inner::-moz-input-placeholder {
    color: #7f7f7f;
    font-size: 14px;
  }
  .unitnamewrapper
    /deep/
    .el-input--medium
    .el-input__inner::-ms-input-placeholder {
    color: #7f7f7f;
    font-size: 14px;
  }
</style>