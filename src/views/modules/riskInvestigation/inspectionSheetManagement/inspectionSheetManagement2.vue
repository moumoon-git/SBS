<template>
  <div class="inspectionSheetManagement">
    <!-- 左侧搜索栏 -->
    <slot name="left__container">
      <div class="left-bar">
        <div class="warning-tree-search">
          <div
            class="el-icon-search warning-tree-search-icon"
            @click="getTreeList()"
          />
          <input
            class="warning-tree-search-inner"
            v-model="searchName"
            placeholder="按enter搜索"
            @keyup.enter="getTreeList()"
          >
        
          <div
            class="warning-tree-search-cancel el-icon-close"
            v-if="searchName"
            @click="searchName='';getTreeList();"
          />
        </div>
        <div class="treeClass">
          <!-- 树形 -->
          <el-tree
   
            :default-expanded-keys="[0]"
            :data="searchTreeData"
            :props="treeProps"
            ref="tree"
            node-key="id"
            :current-node-key="0"
            :highlight-current="true"
            @node-click="clickTree"
          />
        </div>
      </div>
    </slot>
    
    <!-- 右侧主体内容 -->
    <div  class="task-wrapper" >
      <!-- 右侧顶部选项栏 -->


      <div  class="task-content-header" >
        <div
          class="task-content-header-title"
        >巡查管理</div>
        <span class="task-content-header-button">
          
          <!-- 1. 检查状态 -->   
          <!-- <el-select class="task-content-header-cycle" v-model="queryList.type" placeholder="检查类型" clearable @change="getWorkData">
            <el-option
              v-for="item in checkTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select> -->
          <!-- 2. 处置状态 -->
          <el-select v-model="queryList.status" placeholder="处置状态" clearable @change="getWorkData" class="task-content-header-cycle">
            <el-option
              v-for="item in handleStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <!-- 3. 时间选择 -->
          <el-date-picker
            class="task-content-header-date"
            v-model="dateValue"
            type="daterange"
            align="right"
            :unlink-panels="false"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          />
          <!-- 4. 关键字搜索 -->
          <el-input
            class="task-content-header-search"
            suffix-icon="el-icon-search"
            v-model="queryList.search"
            placeholder="请输入关键字"
            clearable
            @change="getWorkData"
            @keyup.enter.native="searchResult()"
          />
          <el-button  class="task-content-header-export-button" plain @click="searchResult()">查询</el-button>
          <!-- todotodotodotodotodotodotodotodotodotodotodotodotodotodotodtodotodotodotodotodotodotodotodotodotodotodottodotodotodotodotodotodotodotodotodotodotodottodotodotodotodotodotodotodotodotodotodotodototodo -->
          <!-- 5. 导出按钮 -->
          <!-- <el-button plain class="task-content-header-export-button">
            <img src="../../../../assets/img/upload.svg" alt="导出图标" />导出
          </el-button> -->
          <!-- todotodotodotodotodotodotodotodotodotodotodotodotodotodotodototodotodotodotodotodotodotodotodotodotodotodottodotodotodotodotodotodotodotodotodotodotodottodotodotodotodotodotodotodotodotodotodotodottodotodotodotodotodotodotodotodotodotodotodotdo -->

          <!-- 6. 发布按钮 -->
          <!-- <el-button
            type="primary"
           class="task-content-header-export-button"
            @click="showReleaseSheet(-1)"
          >发布工单</el-button> -->
        </span>
      </div>    
     

      <!-- 右侧表单内容 -->
      <div class="task-content-table">
        <el-table
          :data="sheetTableData"
           
          height="calc(100% - 155px)"
        >
          <!-- 1. 工单名称 -->
          <el-table-column header-align="center" align="center" prop="name" label="工单名称"/>
          <!-- 2. 工单类型 -->
          <el-table-column header-align="center" align="center" prop="workType" label="工单类型">
            <template slot-scope="scope">
              <span v-if="scope.row.workType==0">自定义工单</span>
              <span v-if="scope.row.workType==1">巡查工单</span>
            </template>
          </el-table-column>
          <!-- 3. 工单属性 -->
          <el-table-column header-align="center" align="center" prop label="工单属性">
            <template slot-scope="scope">
              <span>{{workPropertyIdToName(scope.row.workProperty)}}</span>
            </template>
          </el-table-column>
          <!-- 4. 工单地点 -->
          <el-table-column header-align="center" align="center" prop="workPlace" label="工单地点"/>
          <!-- 5. 发布时间 -->
          <el-table-column header-align="center" align="center" prop="gmtCreate" label="发布时间"/>
          <!-- 6. 工单负责人 -->
          <el-table-column header-align="center" align="center" prop label="工单负责人">
            <template slot-scope="scope">
              <span style="color:#0091FF">{{scope.row.contactorIdString}}</span>
            </template>
          </el-table-column>
          <!-- 7. 工单时限 -->
          <el-table-column header-align="center" align="center" label="工单时限" >
            <template slot-scope="scope">
              <span v-if="scope.row.isEndtime==0">无限制时间</span>
              <span v-else>
                {{scope.row.endDate}} {{scope.row.endTime}}
                <br >
                <span
                  v-if="isOutTime(scope.row.endDate, scope.row.endTime)"
                >{{isOutTime(scope.row.endDate, scope.row.endTime)}}</span>
                <span v-else style="color:#F66E6E">已超时</span>
              </span>
            </template>
          </el-table-column>
          <!-- 8. 工单状态 -->
          <el-table-column header-align="center" align="center" prop label="工单状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status==1" style="color:#0BD295">已处置</span>
              <span v-if="scope.row.status==0" style="color:#F7B500">处置中</span>
              <span v-if="scope.row.status==-1" style="color:#999999">已取消</span>
            </template>
          </el-table-column>
          <!-- 9. 操作按钮 -->
          <el-table-column header-align="center" align="center" prop label="操作" >
            <template slot-scope="scope">
              <!-- <img class="operation-icon" src="./img/operation-view-active.png" alt="查看" @click="showViewSheet(scope.$index)"/> -->
              <span v-if="true">
                <img
                  class="eye"
                  src="../../../../assets/img/show.svg"
                  alt="查看"
                  @click="showViewSheet(scope.row.id)"
                  style="cursor:pointer;width:20px;margin-right: 10px"
                  @mouseenter="mouseEnterImg(3,scope.$index)"
                  @mouseleave="mouseLeaveImg(3,scope.$index)"
                >
                <!-- <img class="operation-icon" src="./img/operation-edit-active.png" alt="编辑" @click="showEditSheet(scope.$index)"/> -->
                <img
                  class="edit"
                  src="../../../../assets/img/outEdit.svg"
                  alt="编辑"
                  @click="showReleaseSheet(scope.row.id)"
                  style="cursor:pointer;width:20px;margin-right: 10px"
                  @mouseenter="mouseEnterImg(1,scope.$index)"
                  @mouseleave="mouseLeaveImg(1,scope.$index)"
                >
                <img
                  class="del"
                  src="../../../../assets/img/outDelect.svg"
                  alt="删除"
                  @click="deletRow(scope.row.id)"
                  style="cursor:pointer;width:20px;margin-right: 10px"
                  @mouseenter="mouseEnterImg(2,scope.$index)"
                  @mouseleave="mouseLeaveImg(2,scope.$index)"
                >
              </span>
              <span v-else>
                <img
                  class="eye"
                  src="../../../../assets/img/show.svg"
                  alt="查看"
                  style="cursor:pointer;width:20px;margin-right: 10px"
                  @mouseenter="mouseEnterImg(3,scope.$index)"
                  @mouseleave="mouseLeaveImg(3,scope.$index)"
                >
                <img
                  class="edit"
                  src="../../../../assets/img\outEdit.svg"
                  alt="编辑"
                  style="cursor:pointer;width:20px;margin-right: 10px"
                  @mouseenter="mouseEnterImg(1,scope.$index)"
                  @mouseleave="mouseLeaveImg(1,scope.$index)"
                >
                <img
                  class="del"
                  src="../../../../assets/img\outDelect.svg"
                  alt="删除"
                  style="cursor:pointer;width:20px;margin-right: 10px"
                  @mouseenter="mouseEnterImg(2,scope.$index)"
                  @mouseleave="mouseLeaveImg(2,scope.$index)"
                >
              </span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
      </div>
        

      <div class="task-content-footer">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryList.page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="queryList.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
        />
      </div>
    </div>
          
    <!-- 发布/编辑工单弹窗 -->
    <releaseSheet
      ref="releaseSheet"
      :workPropertyList="this.workPropertyList"
      :getWorkData="this.getWorkData"
      :editWhich="this.editWhich"
    />
    <!-- 查询弹窗 -->
    <!-- <viewSheet :ref="'viewSheet'+scope.$index" :sheetTableData="sheetTableData" :currentRow="scope.$index" style="font-weight:normal;text-align:left;"></viewSheet> -->
    <!-- <viewSheet ref="viewSheet" :viewWhich="this.viewWhich"></viewSheet> -->
    <viewSheet ref="viewSheet"/>
    <!-- 编辑工单弹窗 -->
    <!-- <editSheet :ref="'editSheet'+scope.$index" :sheetTableData="sheetTableData" :currentRow="scope.$index" style="font-weight:normal;text-align:left;"></editSheet> -->
    <!-- <editSheet :sheetTableData="sheetTableData" :workPropertyList="this.workPropertyList" :getWorkData="this.getWorkData" ref="editSheet" style="font-weight:normal;text-align:left;"></editSheet> -->
  </div>
</template>

<script>
// 发布编辑工单弹窗组件
import releaseSheet from "./releaseSheet/releaseSheet";
// 查看工单弹窗组件
import viewSheet from "./viewSheet/viewSheet";
export default {
 
  components: {
    releaseSheet,
    viewSheet,
  },
  watch: {
    // 监控日期选择栏，更新查询条件queryList
    dateValue(val) {
      if (val) {
        this.queryList.startTime = val[0];
        this.queryList.endTime = val[1];
      } else {
        this.queryList.startTime = "";
        this.queryList.endTime = "";
      }
      this.getWorkData();
    },
    // 监控左侧搜索栏，变更则触发树形的过滤操作
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  mounted() {
    console.log("this.emergnecy",this.emergencyId,this.$route.query.id)
      this.queryList.targetId = this.$route.query.id
    // 获取表单数据
    this.getWorkData();
    // 获取工单属性列表
    this.getWorkPropertyList();
    // 获取树形数据
    this.getTreeList();
  },
    data() {
    return {
      searchName:"",
      // 查询条件
      queryList: {
        page: 1,
        limit: 10,
        groupIds: [-1],
        startTime: "",
        endTime: "",
        /**
         * @author tanjinfeng
         * @date 2020-11-28
         * @description 删除module=3
         */
        // *** 原来的代码 ***
        // module: "3",
        // *** 修改后的代码 ***
        module: "",
        // *** 结束 ***
        property: "",
        status: "",
        type: "",
        search: "",
        targetId:''
      },
      // 工单属性列表
      workPropertyList: [],
      // 检查类型可选值
      checkTypeOptions: [
        {
          value: "0",
          label: "自定义工单",
        },
        {
          value: "1",
          label: "巡查工单",
        },
      ],
      // 工单处置状态可选值
      handleStatusOptions: [
        {
          value: "-1",
          label: "已取消",
        },
        {
          value: "0",
          label: "处置中",
        },
        {
          value: "1",
          label: "已处置",
        },
      ],
      // 日期选择栏取值，是一个数组，dateValue[0, 1] = [startTime, endTime]
      dateValue: "",
      // 获取到的表单数据
      sheetTableData: [],
      // 判定弹窗是发布还是编辑
      editWhich: "",
      // 判定查看哪一行表单
      viewWhich: "",
      // 左侧搜索栏过滤关键词
      filterText: "",
      // 左侧搜索栏树形数据
      searchTreeData: [],
      // 树形配置
      treeProps: {
        value: "id",
        children: "children",
        label: "name",
      },
      // 分页器显示数据总数
      totalCount: 0,
    };
  },
  methods: {
   searchResult(){
     this.queryList.page = 1,
     this.getWorkData();

   }
,

 //鼠标移入事件
    mouseEnterImg(val, index) {
      console.log("鼠标移入", index);
      if (val == 1) {
        document
          .getElementsByClassName("edit")
          [index].setAttribute(
            "src",
            require("../../../../assets/img/edit.svg")
          );
      }
      if (val == 2) {
        document
          .getElementsByClassName("del")
          [index].setAttribute(
            "src",
            require("../../../../assets/img/delect.svg")
          );
      }
      if(val == 3)
      {
          document
          .getElementsByClassName("eye")
          [index].setAttribute(
            "src",
            require("../../../../assets/img/light-eye.svg")
          );

      }
    },
    //鼠标离开事件
    mouseLeaveImg(val, index) {
      console.log("鼠标离开", index);
      if (val == 1) {
        document
          .getElementsByClassName("edit")
          [index].setAttribute(
            "src",
            require("../../../../assets/img/outEdit.svg")
          );
      }
      if (val == 2) {
        document
          .getElementsByClassName("del")
          [index].setAttribute(
            "src",
            require("../../../../assets/img/outDelect.svg")
          );
      }
           if(val == 3)
      {
          document
          .getElementsByClassName("eye")
          [index].setAttribute(
            "src",
            require("../../../../assets/img/show.svg")
          );

      }
    },
    // 获取表单数据
    getWorkData() {
      let url = window.SITE_CONFIG["baseUrl"] + "/work/workSheet/list";
      let that = this;
      this.$http.post(url, that.queryList, { emulateJSON: true }).then(
        function (res) {
          // 表单列表保存在本地数组sheetTableData中
          that.sheetTableData = res.data.page.list;
          that.totalCount = res.data.page.totalCount;
          console.log("获取表单数据：\n", res, that.totalCount);
        },
        function (res) {
          console.log("getWorkData()获取数据失败！\n错误信息：\n", res);
        }
      );
    },
    // 获取工单属性列表
    getWorkPropertyList() {
      /**
       * @author tanjinfeng
       * @date 2020-11-28
       * @description 删除module
       */
      // *** 原来的代码 ***
      // let url =
      //   window.SITE_CONFIG["baseUrl"] + "/work/workProperty/treelist?module=3";
      // *** 修改后的代码 ***
      let url =
        window.SITE_CONFIG["baseUrl"] + "/work/workProperty/treelist";
      // *** 结束 ***
      let that = this;
      this.$http.get(url).then(
        function (res) {
          // 工单属性列表保存在本地数组workPropertyList中
          for (var item of res.data.data) {
            that.workPropertyList.push({
              value: item.id,
              label: item.name,
            });
          }
        },
        function (res) {
       //   console.log("工单属性列表获取失败！\n错误信息：\n", res);
         // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
        }
      );
    },
    // 根据工单属性id返回对应工单属性名
    workPropertyIdToName(id) {
      for (let item of this.workPropertyList) {
        if (id == item.value) {
          return item.label;
        }
      }
    },
    // 计算工单时限剩余时间
    isOutTime(date, time) {
      let now = new Date();
      let year = now.getFullYear();
      let month = now.getMonth() + 1;
      let day = now.getDate();
      let hour = now.getHours();
      let minute = now.getMinutes();
      let nowDate =
        year + "-" + month + "-" + day + " " + hour + ":" + minute + ":00";
      let inDate = date + " " + time + ":00";
      let dHour = Math.floor(
        (Date.parse(inDate) - Date.parse(nowDate)) / (3600 * 1000)
      );
      let dMin = Math.floor(
        (Date.parse(inDate) - Date.parse(nowDate)) / (600 * 1000)
      );
      //   console.log(
      //     "工单时间",
      //     nowDate,
      //     inDate,
      //     Date.parse(inDate),
      //     Date.parse(nowDate)
      //   );
      if (dHour < 0) {
        return false;
      } else {
        let leftDays = Math.floor(dHour / 24);
        // let leftHours = dHour % 24;
        let leftHours = ((dMin/60) % 24).toFixed(1);
        let res = "剩余：" + leftDays + "天" + leftHours + "小时";
        return res;
      }
    },
    // 删除该行数据
    deletRow(id) {
      this.$confirm("确认删除？")
        .then((_) => {
          let send = {
            ids: [id],
          };
          let url = window.SITE_CONFIG["baseUrl"] + "/work/workSheet/delete";
          let that = this;
          this.$http.post(url, send, { emulateJSON: true }).then(
            function (res) {
              console.log("删除工单成功！", res);
              // 刷新数据
              that.getWorkData();
            },
            function (res) {
              console.log("删除工单失败！\n错误信息：\n", res);
              console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
            }
          );
          done();
        })
        .catch((_) => {});
    },
    // 点击显示“发布/编辑工单”弹窗, index==-1时是发布， else为编辑
    showReleaseSheet(id) {
      this.$refs.releaseSheet.releaseVisible = true;
      this.editWhich = id;
    },
    // 查看工单点击弹窗
    showViewSheet(id) {
      this.$refs.viewSheet.init(id);
      // this.$refs.viewSheet.viewSheetVisible = true;
      // this.viewWhich = id;
    },
    /**
     * @method
     * @desc 获取树形数据
     */
    getTreeList() {
   this.$http({
        url: this.$http.adornUrl("/investigation/investigationTaskGroup/listTree"),
        method: "get",
        params: this.$http.adornParams({
          name: this.searchName,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
      this.searchTreeData = [{
            id: 0,
            name: '全部',
            children: null
          }, ...data.data]
          
          this.getWorkData()
        } else {
          this.$message.error(data.msg);
        }
      });


    //  let self = this;
    //  let url =
    ///    window.SITE_CONFIG["baseUrl"] +
    //    "/investigation/investigationTaskGroup/listTree";
    //  this.$http.get(url).then(
      //  (res) => {
     //     console.log("获取树形成功：【\n", res.data.data, "\n】");
     //     self.searchTreeData = res.data.data;
     //     self.searchTreeData.push({
      //      id: -1,
      //      name: "其他",
      //      children: null,
     //     });
     //   },
    //    (res) => {
      //    console.log("获取树形失败：【\n", res, "\n】");
    //    }
     // );
    },


    // 树形过滤规则
    //filterNode(value, data) {
    //  console.log("过滤的数据", value, data);
    //  if (!value) return true;
    //  return data.name.indexOf(value) !== -1;
   // },
    /**
     * @method
     * @desc 点击树形数据，传组id查询列表
     */
    clickTree(data) {
      let self = this;
      console.log("点击树形的节点数据:", data);
      this.queryList.groupIds = [];
      

      (function getChild(data) {
        if(data.id == 0)
        {self.queryList.groupIds = []
         return  }
        self.queryList.groupIds.push(data.id);
        if (data.hasOwnProperty("children") && data.children !== null) {
          for (let item of data.children) {
            getChild(item);
          }
        }
      })(data);
      console.log("点击的节点及其子孙id集合：", this.queryList.groupIds);
      this.getWorkData();
    },
    /**
     * @method
     * @desc 点击全部，传空数组，查询所有列表
     */
    getAll() {
      this.queryList.groupIds = [];
      this.getWorkData();
      console.log("alll");
    },
    // 分页器操作
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.queryList.limit = val;
      this.getWorkData();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.queryList.page = val;
      this.getWorkData();
    },
  },

};
</script>

<style lang="less" scoped>
* {
  font-family: PingFangSC-Regular, PingFang SC;
}
.inspectionSheetManagement{
  height: calc(100vh - 112px);
  display: flex;
  background: #F4F4F4;

   .left-bar{  

    background: white;
    height: 100%;
    // max-width: 358px;
    width: 22%;
    min-width: 200px; 
    box-shadow:0px 4px 14px 3px rgba(54, 121, 225,0.09);
   
    border-radius: 4px;
    font-family: PingFangSC-Regular, PingFang SC;

    .warning-tree-search {
      &:hover {
        border-color: #C0C4CC;
      }
      &:focus-within {
        border-color:rgba(0, 145, 255, 1);
      }
      
      height: 40px;
      width: calc(100% - 28px);
      border-radius: 21px;
      border:1px solid rgba(232,236,240,1);
      position: relative;
      margin: 20px 0px 20px 15px;
      .warning-tree-search-icon {
        font-size: 17px;
        font-weight: bold;
        width: 17px;
        height: 17px;
        color: rgba(153, 153, 153, 1);
        margin: 10px 0px 11px 18px;
        cursor: pointer;
      }
      .warning-tree-search-inner {
        border: none;
        outline: none;
        // width: 260px;
        width: calc(100% - 70px);
        font-size: 14px;
      }
      .warning-tree-search-cancel {
        width: 17px;
        height: 17px;
        line-height: 15px;
        font-size: 15px;
        text-align: center;
        border: 1px solid rgba(153, 153, 153, 1);
        color:rgba(153, 153, 153, 1);
        border-radius: 50%;
        cursor: pointer;
        position: absolute;
        right: 10px;
        top: 11px;
      }
      .warning-tree-search-cancel:hover {
        color: rgba(153, 153, 153, 0.5);
        border-color: rgba(153, 153, 153, 0.5);
      }
   
      
      }

      .treeClass::-webkit-scrollbar {
      background: transparent;
      width: 5px;
    }
    .treeClass::-webkit-scrollbar-thumb {
      background: rgba(153, 153, 153, 1);
      border-radius: 20px;
    }
    .treeClass {
      overflow: auto;
       height: calc(100vh - 290px);
   
      /deep/.el-tree-node__content {
        height: 45px;
      }
      /deep/.el-tree-node__label {
        font-size: 14px;
        font-family: PingFangSC-Regular,PingFang SC;
        font-weight: 400;
      }
      /deep/.is-current  > .el-tree-node__content{
       background: rgba(0, 145, 255, 0.1);
        border-left: 2px solid rgba(0, 145, 255, 1);
        color: rgba(0, 145, 255, 1);
      }
      /deep/.el-tree-node__content:hover {
        background: rgba(0, 145, 255, 0.1);
      }
    }

    }

     .task-wrapper {
    border-radius: 4px;
    box-shadow:0px 4px 14px 3px rgba(54, 121, 225,0.09);
    border: 1px solid transparent;
    background: white;
    margin-left: 10px;
    // width: 1360px;
    width: calc(78% - 10px);
    min-width: 1050px;
    // height: calc(100vh - 115px);
    height: 100%;
    position: relative;
    .task-content-header {
      height: 76px;
      .task-content-header-title {
        border-left: 3px solid rgba(0, 145, 255, 1);
        font-size: 16px;
        font-weight: bold;
        display: inline-block;
        height: 16px;
        line-height: 16px;
        padding-left: 14px;
        position: absolute;
        left: 15px;
        top: 30px;
      }
    
      .task-content-header-button {
        position: absolute;
        right: 13px;
        top: 17px;
        .task-content-header-cycle,
        .task-content-header-disposer {
          margin-top:-5px;
          width: 104px;
          height: 42px;
          /deep/.el-input__inner {
            height: 42px;
            line-height: 42px;
            padding-left: 10px;
            padding-right: 10px;
            font-size: 14px;
          }
          /deep/.el-icon-arrow-up::before {
            margin-top: 9px;
          }
          /deep/.el-input__suffix {
            right: 2px;
          }
          /deep/.el-icon-arrow-up::before {
            background: no-repeat url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAOCAYAAAA1+Nx+AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAGKADAAQAAAABAAAADgAAAAANlRePAAABeklEQVQ4Eb1SsUrEQBC9TXEBwc5gL/gBFsKh5BIrK1sNglwh9lp4foMnqL9wCBJrsbAQk0tODiysUgn2EvsjFonvHVnY80xcLFwYZjIz772Z3TQa/33CMNxJkqT5V11iwbEt8YYM6AeDwUFRFH6apn14odZ0YmJK7A25iJkSMAzDF0K8IO+h4VyHVO0pMR45yMXazJSj0Wgxy7InTLOE+onruj2VpCoOgqCL2inI30zTXGu1Wu/snRFgEne4DDeELWCSjm3bV8xXnSiK9vI876P+AVt3HOdV9v4owCImWoV7xERN2Fa73b6XINXjWjax7S3sE/kNbPys1isF2PQbWGeIqUdWlRlzalzRPjaYg92VVzdpY8wca+yp2rB2AymITY5xxz2QTR4QhGI8Hg/5IyDugvxM9n73WgIEYeILEB5ChL9xA/EK4ks86BG/q462AAgFRK5B5JVkPsh3IVJUkTNf+wYqkESWZXXgH2hlXEuu4rXjOI7nabqAL81rpopzt9VwAAAAAElFTkSuQmCC);
            background-size: 20px 10px;
            background-position: center;
            transform: rotate(180deg);
          }
          /deep/.el-icon-circle-close {
            font-size: 17px;
          }
        }
        .task-content-header-date {
          height: 42px;
          width: 290px;
          margin-left: 1px;
          /deep/.el-icon-date {
            top: 2px;
          }
          /deep/.el-range-input,
          /deep/.el-range-separator {
            font-size: 16px;
          }
          /deep/.el-range-input {
            margin-left: 20px;
            width: 105px;
          }
          /deep/.el-range-separator {
            margin-top: 5px;
            margin-left: 5px;
            margin-right: -15px;
          }
          /deep/.el-range__icon {
            font-size: 17px;
          }
          /deep/.el-range__close-icon {
            font-size: 17px;
            position: relative;
            top: 1px;
          }
        }
        .task-content-header-search {
          width: 229px;
          /deep/.el-input__inner {
            height: 42px;
            width: 229px;
            font-size: 14px;
          }
          /deep/.el-input__clear {
            font-size: 17px;
            padding-top: 2px;
          }
        }
        .task-content-header-search-button,
        .task-content-header-export-button {
          height: 42px !important;
          position: relative;
          bottom: 1px;
          /deep/span {
            font-size: 14px;
          }
        }
        .task-content-header-export-button {
          padding: 10px;
          margin-left: 1px;
        }
        .task-content-header-export-expand {
          position: absolute;
          border: 1px solid white;
          border-radius: 4px;
          right: 0;
          top: 45px;
          background: white;
          z-index: 999;
          transition: opacity 0.5s;
          box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
          color: rgba(85, 85, 85, 1);
          font-size: 16px;
          .task-content-header-export-expand-item{
            cursor: pointer;
            padding: 5px 10px;
            font-size: 16px;
          }
          .task-content-header-export-expand-item:hover {
            background: #E2F5FF;
            color: #0091FF;
          }
        }
        .task-content-header-export-expand-hide {
          opacity: 0;
          z-index: -999;
        }
      }
    }
    .task-content-table {
      height: calc(100% - 155px);
      overflow: hidden;
      /deep/.el-table {
        -webkit-box-shadow: none;
        box-shadow: none;
        border: none;
        position: absolute;
        left: -1px;
        width: calc(100% + 3px);
        max-width: none;
        overflow-y: auto;
        /deep/thead div {
          font-size: 14px;
          font-weight: bold;
          color:rgba(51, 51, 51, 1);
          th {
            height: 56px;
          }
        }
        /deep/tbody {
          div {
            font-size: 14px;
            font-family: PingFangSC-Regular,PingFang SC;
            font-weight: normal;
            color:rgba(102, 102, 102, 1);
          }
          td {
            border-left: none;
            border-right: none;
            .button-view {
              margin: 0 auto;
              width: 27px;
              height: 25px;
              cursor: pointer;
              background: no-repeat url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAkCAYAAADl9UilAAAEDElEQVRYR+2Wb2hVZRzHv9/nrOlWU5molcSiMoTaIne79zZ7Y0QUQkLLEZTb7k3qTc02rSCDDDKodEvrTWH3bloQswQDKyLyTa57592grUCyohFWOhzO1aZr53zjzhn7c+89z50Vvtjz7pzn+/38vvzO8zznIS7Twcs0F+aC5ftl5jr2v3QsntJKelgLodLzVE5yCYCFE8UHJfUbw14QXTI4FAnw2H8W7JPjmtc/gA2e0ACoPL9C7DXE7sFS7GtYwfM2Xqs1FktoHYlmSDfYQLNqyJ8kNEXDPOjHyRmsvUNFww52S9roB8pnnuSeYhcNNVUcyebLGqwtqcUe8DGkqnyKWmvJDgM8UBfi6UyejMHeTmlh4Ri+BLTKutCshOweLcDdTwQ4ON0+I1i75Awn8ZmgeyxrDQD8CELvuJ4oB1QNoNTGT/CL4hDuqyHdyfoZweJfazuo522goNpGHbPpt0oMXZfCirTnlwCOX9OFkkLX2wWxzoojvhK5k1uzBms7qqDnqgOA4wcUFI+GnWgsoUcJvAro2gse/irguWiY78USboxgxI8FwDUeq+qq2HlR+0/HJLEtiU5BAV+Q0O+5vJEOHiTVmkkvsV4uDhhHP4JIH8A5B8FUXQhBkrqwIiZGW0IPedB+P8C4SXqr7Jxp7CvCCUFLM+8qniobwfK++V6LyCdtuAZcXxfmh1OCxRNeAkDIBkBy45iLbseoO6fe8HYKlZL22HABJCNhE54erAuA1fEgMGqAHkGpXAUJBjygglDMMlh3JGwqpwRrTaha0Hgb/QbBnWcHsLVksX6HsCijnjgzdJpXLyjFdkGb/ZjpecewujbIA1OCpR/iCX0FaLUF5ASW8Sb243F52pVxjRlu0hK8g5P6AcByfyaPRMK866Juyjm296hudV2lP2mhL4hsjoS4OZZUI6WXAJRMeIZEvhgNsSWe1E5ITb4sYNRxWFl7B7/NGCz9MpbQFkKvW8BAaMfZAfPCvKVwCl2Mr41RB13nT8FdUIqXBW2x4Qh8Jhrmjsnamf9Kia2d+EBSjQ0UQh+g941jetJ6z/UqAD4CoszGT7K9PoiHMXF+Ze1YeqK5Q0WLjA4RWGMDn61GwOEzHtc2Zbj+ZL327P1GV3oj2C/o/tkWzuUj+Kkpwvra2/hnxs2Ty7ztsAqun++9JvLpyX+JSwwqSm/8fM48u20Nx7KxrK7WrQndK+hNADdfYqjvCT5VH+bnfhyrYGlI+3cqHB5CvaRGECv9wFPmhWMkW4pL0FpzC0dtvNbBJsP2pbTqrzFvHckghAoAyyZdldIXvpMgeiR1XlFgDm4IMPc/NUPSWQWbwZH47hFclX7/2Gr8MX3r23RouubfCTabyj6euWD5NnWuY/l27G9733k0ycG80wAAAABJRU5ErkJggg==);
              background-size: 100% 100%;
              &:hover {
                background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAkCAYAAADl9UilAAADdElEQVRYR+2XW4iMYRjHf4/ZzIp1WDlfKKdcWMUK4YYkUpRFCjkkbtb3rXUqlFUox9357A3JIZScihJJ3LCx2b3AhZzKhXPWYckOOz16v92tmd2Z+d4Zh1zsczff9///n/88877P84zwn4b8p75oN5bpL9NesX9TsQM6HGUmUIhSAPRC6OYnVz4D7xEeADUIl1ktj/6eMU/DKIsRnGYz9rmMScVDOIEjURui3RmL6GxgPzDIRjQN5jlQiisXg3TSG9uvncjBQ1kRJJTRe+EwjTiUyvdUvNTGKrUnMS4BEzJKag+uIsQsiuVDMkpyYwe1G1FuoIy2z5MFUqglzBRWibkwCdHW2BkN8YarKFMtU9UhnEf9WwhCAUoRkG/FF67Tl+nMl1g8vq0xT3egbLIShePk4vKaeroz1Od84gn9yKOBCLDESkfYiSObUxvzdCxKFRCyEDyKK8up0EUIu4D+zZxXKBspkZNE9AiwzEIrhjABR6pbsHEVU8GjGmWMhdB7GhhMLnOAYynwS2ngArk88xtwUAj3cBgLok0noiU8nYtyNojffI4qqWMN+bxE6Z2UI7yjjgHkU45SbKk7D0fOJRqL6B1gnJWA6WsdqEWpTYvPYRQ/KcT0Lbu4iyvjE41VqJlrtu1hOXAfuBeQzxyLkYA5a8FhvmiJFLY2VoTglzEwhH3AZpQ3QPcU+E8IfQFzy9cGaja5KcKRC4nGzCdPb6FMtBB5SVeGUM9K1G8LbUNwyeMQX3gKDAjUFG7jyKQWXGIfi+gI1F9VOgYKmaHuyloqdA2wDSHP5yj1wFZKpJyImsqWBmopPxAKceVhcmPmaUTXAXsCxZoAexG2ECZEFP9sEKaGKDGU7YDRson1uLI3HphkVqoQ4TQw30YReIFwCvEvg6nYSJSFwEBL/hlcFrT0r9QVM2/MuhPiMjDZUjxb2E1izEy2/qRee/ZoZ8KcRZmRbda0POEKUeaxXr4lvzvp2GWaQw92AyUJU+L3nJqRU8FHNlAmjamk7FZrT6ehHACG/Z4nHiOsxpFrQTp2xoxKmXakB0sB0x6GBwm3em/+JZXzkWOUyQ8brr2xeLVKHU0jsxGzDfgjp0/cqmQWvrf+yFKqyeEixZJ+piZxmp2xNkJqNrIu/uONfG199W0q1Brzh4xlkzo9p91YpjVtr1imFfsFaaXrJVm90+MAAAAASUVORK5CYII=);
              }
            }
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
      }
    }
    .task-content-footer {
      height: 83px;
      position: relative;
      .el-pagination {
        position: absolute;
        bottom: 15px;
        right: 30px;
        /deep/.el-pagination__total {
          font-size: 14px;
          color: rgba(96, 98, 102, 1);
          vertical-align: center;
          position: relative;
          top: 8px;
          right: 10px;
        }
        /deep/.number,
        /deep/.btn-prev,
        /deep/.btn-next,
        /deep/.more {
          border-radius: 3px;
          height: 42px;
          width: 42px;
          line-height: 42px;
          font-size: 14px;
          font-weight: normal;
          margin: 0;
          margin-right: 14px;
        }
        /deep/.el-pagination__sizes {
          /deep/.el-input__inner{
            border-radius: 3px;
            height: 42px;
            width: 107px;
            line-height: 42px;
            font-size: 14px;
          }
        }
        /deep/.el-pagination__jump {
          height: 42px;
          line-height: 42px;
          font-size: 14px;
          margin-left: 5px;
          /deep/.el-input__inner{
            border-radius: 3px;
            height: 42px;
            width: 38px;
            line-height: 42px;
            font-size: 14px;
          }
        }
      }
    }
  }


   }

















</style>