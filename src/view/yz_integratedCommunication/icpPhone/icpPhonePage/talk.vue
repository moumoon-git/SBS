<template>
  <div class="my-radio-box">
      <div class="my-radio-box-main">
        <el-radio-group v-model="tabPosition" @change="changePage">
          <el-radio-button v-for="(item,index) in list.filter(element=>{return element!=null})" :label="Number(item.label)" :key="index">{{item.name}}</el-radio-button>
        </el-radio-group>
        <div style="position: absolute;right: 3%;top: 50%;transform: translateY(-50%);display: flex;align-items: center;cursor: pointer;" @click="manageVisible=!manageVisible">
          <img :src="require('@/assets/icpImg/communicationManage.png')" style="width:1.3vw;" v-if="manageVisible">
          <span style="font-size: 14px;color: #999999;line-height: 14px;margin-left: 4px;" v-if="manageVisible">管理</span>
          <i class="el-icon-circle-check" style="font-size: 20px;color:rgba(0,145,255,1);" v-if="!manageVisible"></i>
          <span style="font-size: 14px;color: #999999;line-height: 14px;margin-left: 4px;" v-if="!manageVisible">完成</span>
        </div>
      </div>
      <div  class="my-phone-main" v-if="tabPosition==1">
        <div class="my-tree-box" style="box-sizing: border-box;overflow: auto;">
          <el-scrollbar class="my-tree-scroll">
            <el-input
              placeholder="输入关键字进行搜索" 
              v-model="myData1.filterTree" class="treeSearch" style="padding: 10px;box-sizing: border-box;">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="$refs.tree1.filter(myData1.filterTree)"></i>
            </el-input>
            <el-tree :data="myData1.treeData"
            @node-click="handleNodeClick"
           :filter-node-method="filterNode"
            node-key="id" ref="tree1"
            highlight-current :props="defaultProps" show-checkbox @check-change="handleCheckChange" @check="handleTreeCheck">
              <span class="custom-tree-node" slot-scope="{ node, data }" :style="{display: 'flex','align-items': 'center',position: 'relative',width: '100%'}" @mouseover="treeBtnHoverIndex=data.id" @mouseout="treeBtnHoverIndex=-2">
                <span>{{ node.label }}</span>
                <span style="display: flex;position: absolute;top: 50%;left: 66%;transform: translateY(-50%);" v-show="treeBtnHoverIndex==data.id&&!manageVisible && data.id !=-1">
                  <div style="display: flex;align-items: center;cursor: pointer;" >
                    <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                      <img :src="require('@/assets/icpImg/editTreeBtn.png')" style="width:1.3vw;" @click="editTreeItem(node, data)">
                    </el-tooltip>
                  </div> 
                  <div style="display: flex;align-items: center;cursor: pointer;margin-left: 5px;" >
                    <el-tooltip class="item" effect="dark" content="删除" placement="top">
                      <img :src="require('@/assets/icpImg/deleteTreeBtn.png')" style="width:1.3vw;" @click="deleteTreeItem(node, data)">
                    </el-tooltip>
                  </div>
                </span>
              </span>
            </el-tree>
          </el-scrollbar>
          <treeBtn v-if="!manageVisible" @changeDialog="closeDialog" @refreshData="refreshData"
            :treeDataItem="myData1.treeDataItem"
            :treeData="myData1.treeData" :formData="formData1" ref="treeBtn1" :treeDataItems="myData1.treeMultipleSelection" tabPosition="jiqunfenzu">
          </treeBtn>
        </div>
        <div class="my-table-box" style="box-sizing: border-box;overflow: auto;">
          <btn-box v-if="!manageVisible" :btnArry="btnArry2" v-bind="{
            add:{callback:addList},
            edit:{callback:myEdit},
            del:{callback:handleDelete}}"> </btn-box>
          <el-row  class="my-table-box-search" style="margin:10px;">
            <el-col :span="14">
              <el-input
              placeholder="请输入设备名称/号码"
              class="searchInput"
              v-model="myData1.searchText"
              @input="handleSearch"
            ></el-input>
            </el-col>
            <el-col :span="10">
              <el-button type="primary"  @click="handleSearch" style="margin-left:10px;">搜索</el-button>
            </el-col>

            </el-row>
                <el-table
                  ref="elTable1"
                  :data="myData1.tableData"
                  highlight-current-row
                  :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
                  height="670"
                  style="width: 100%; height: 670px; overflow: auto" 
                  @row-click="handleRowClick" @row-dblclick="handleRowDbClick"
                  @selection-change="handleSelectionChange" 
                  @select="handleSelect" 
                  @select-all="selectAll">
                    <el-table-column type="selection"></el-table-column>
                    <!-- <el-table-column type="index" width="50" :resizable="false" align="center"></el-table-column> -->
                    <el-table-column   show-overflow-tooltip align="center"
                    v-for="(item,key) in myData1.tableColumn" :key="key" :label="item.label" :prop="item.prop"
                    :width="item.width" :resizable="false"></el-table-column>
                    <el-table-column   show-overflow-tooltip align="center" label="集群类型" prop="code" :resizable="false" ></el-table-column>
                    <el-table-column label="操作" width="250px" align="center">
                      <template slot-scope="scope" >
                        <el-tooltip v-if="manageVisible" class="item" effect="dark" content="查看" placement="top">
                          <i class="el-icon-info" @click="watchContactDetails(scope.row)"  style="font-size: 24px;color:#9FC8FE;cursor: pointer;"></i>
                        </el-tooltip>
                        <el-tooltip v-if="!manageVisible" class="item" effect="dark" content="编辑" placement="top">
                          <i class="el-icon-edit" @click="['myData' + tabPosition].rowData=scope.row;window.setTimeout(()=>{myEdit()},500)"  style="font-size: 24px;margin-left: 1vw;color:#9FC8FE;cursor: pointer;"></i>
                        </el-tooltip>
                        <el-tooltip v-if="!manageVisible" class="item" effect="dark" content="删除" placement="top">
                          <i class="el-icon-delete-solid" @click="['myData' + tabPosition].rowData=scope.row;window.setTimeout(()=>{myDel()},500)" style="font-size: 24px;margin-left: 1vw;color:#9FC8FE;cursor: pointer;"></i>
                        </el-tooltip>

                        <!-- <el-button type="primary" size="mini" @click="talkCall1(scope.row)">添加</el-button> -->
                      </template>
                    </el-table-column>
              </el-table>
            <el-row>
            <el-pagination class="pagination" background :page-size="myData1.pageSize" :page-sizes="[10,20,30,40]" :total="myData1.total"
              :current-page="myData1.currentPage"
              @current-change="handCurrentChange"
              @size-change="handSizeChange"
              layout="total, prev, pager, next, sizes, jumper"></el-pagination>
            </el-row>
        </div>
      </div>
      <div  class="my-phone-main" v-if="tabPosition==2">
        <div class="my-tree-box">
          <treeBtn  @changeDialog="closeDialog" @refreshData="refreshData" :treeDataItem="myData2.treeDataItem" :treeData="myData2.treeData" :formData="formData2"></treeBtn>
          <el-scrollbar class="my-tree-scroll">
            <el-tree :data="myData2.treeData"    @node-click="handleNodeClick"  node-key="id" ref="tree" highlight-current :props="defaultProps"
              draggable
              @node-drop="handleDrop"
              :allow-drop="allowDrop"
              :allow-drag="allowDrag"
            ></el-tree>
          <el-alert title="温馨提示" type="info" description="可拖动修改同级分组排序" show-icon>
          </el-alert>
          </el-scrollbar>
        </div>
        <div class="my-table-box">
            <btn-box :btnArry="btnArry2" v-bind="{
                add:{callback:addList},
                edit:{callback:myEdit},
                del:{callback:myDel},
            }"> </btn-box>
            <el-row  class="my-table-box-search" style="margin:10px 0 10px 8px;">
              <el-col :span="14">
                    <el-input
                placeholder="请输入姓名/单位/职位/号码"
                class="searchInput"
                v-model="myData2.searchText"
                @input="handleSearch"
              ></el-input>
              </el-col>
              <el-col :span="10">
                <el-button type="primary"  @click="handleSearch">搜索</el-button>
              </el-col>
            </el-row>
              <el-table
                ref="singleTable"
                :data="myData2.tableData"
                highlight-current-row
                :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
                height="670"
                style="width: 100%; height: 670px; overflow: auto"
                @row-click="handleRowClick"
                @row-dblclick="handleRowDbClick">
                  <el-table-column type="index" width="50" :resizable="false" align="center"></el-table-column>
                    <el-table-column   show-overflow-tooltip align="center"
                    v-for="(item,key) in myData2.tableColumn" :key="key" :label="item.label" :prop="item.prop"
                    :width="item.width" :resizable="false"></el-table-column>
                  <el-table-column label="操作" width="185" align="center">
                    <template slot-scope="scope" >
                        <el-button type="primary" size="mini" @click="talkCall1(scope.row)">添加</el-button>
                          <el-button type="primary" size="mini" @click="handSetToCommon(scope.row)">设为常用</el-button>
                    </template>
                  </el-table-column>
              </el-table>
            <el-row>
            <el-pagination class="pagination" background :page-size="myData2.pageSize" :page-sizes="[10,20,30,40]" :total="myData2.total"
              :current-page="myData2.currentPage"
              @current-change="handCurrentChange"
              @size-change="handSizeChange"
              layout="total, prev, pager, next, sizes, jumper"></el-pagination>
            </el-row>
        </div>
      </div>
      <div  class="my-phone-main" v-if="tabPosition==3">
        <div class="my-tree-box">
          <treeBtn  @changeDialog="closeDialog" @refreshData="refreshData" :treeDataItem="myData3.treeDataItem" :treeData="myData3.treeData" :formData="formData3"></treeBtn>
          <el-scrollbar class="my-tree-scroll">
            <el-tree :data="myData3.treeData"    @node-click="handleNodeClick"  node-key="id" ref="tree" highlight-current :props="defaultProps"></el-tree>
          </el-scrollbar>
        </div>
        <div class="my-table-box">
          <btn-box :btnArry="btnArry2" v-bind="{
              add:{callback:addList},
              edit:{callback:myEdit},
              del:{callback:myDel},
          }"> </btn-box>
          <el-row  class="my-table-box-search" style="margin:10px 0 10px 8px;">
            <el-col :span="14">
              <el-input
                placeholder="请输入姓名/单位/职位/号码"
                class="searchInput"
                v-model="myData3.searchText"
                @input="handleSearch"
              ></el-input>
            </el-col>
            <el-col :span="10">
              <el-button type="primary"  @click="handleSearch">搜索</el-button>
            </el-col>

          </el-row>
          <el-table
            ref="singleTable"
            :data="myData3.tableData"
            highlight-current-row
            height="670"
            style="width: 100%; height: 670px; overflow: auto"
            :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
            @row-click="handleRowClick"
            @row-dblclick="handleRowDbClick">
            <el-table-column type="index" width="50" :resizable="false" align="center"></el-table-column>
            <el-table-column   show-overflow-tooltip align="center"
                                v-for="(item,key) in myData3.tableColumn" :key="key" :label="item.label" :prop="item.prop"
                                :width="item.width" :resizable="false"></el-table-column>
            <el-table-column label="操作" width="185" align="center">
              <template slot-scope="scope" >
                <el-button type="primary" size="mini" @click="talkCall1(scope.row)">添加</el-button>
  <!--              <el-button type="primary" size="mini" @click="handSetToCommon(scope.row)">设为常用</el-button>-->
              </template>
            </el-table-column>
          </el-table>
          <el-row>
            <el-pagination class="pagination" background :page-size="myData3.pageSize" :page-sizes="[10,20,30,40]" :total="myData3.total"
            :current-page="myData3.currentPage"
            @current-change="handCurrentChange"
            @size-change="handSizeChange"
            layout="total, prev, pager, next, sizes, jumper"></el-pagination>
          </el-row>
        </div>
      </div>

      <div  class="my-phone-main" v-if="tabPosition==4">
        <div class="my-tree-box" style="box-sizing: border-box;overflow: auto;">
          <el-scrollbar class="my-tree-scroll">
            <el-input
              placeholder="输入关键字进行搜索" 
              v-model="myData4.filterTree" class="treeSearch" style="padding: 10px;box-sizing: border-box;">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="$refs.tree4.filter(myData4.filterTree)"></i>
            </el-input>
            <el-tree :data="myData4.treeData"
            @node-click="handleNodeClick"
           :filter-node-method="filterNode"
            node-key="id" ref="tree4"
            highlight-current :props="defaultProps" show-checkbox @check-change="handleCheckChange" @check="handleTreeCheck">
              <span class="custom-tree-node" slot-scope="{ node, data }" :style="{display: 'flex','align-items': 'center',position: 'relative',width: '100%'}" @mouseover="treeBtnHoverIndex=data.id" @mouseout="treeBtnHoverIndex=-2">
                <span>{{ node.label }}</span>
                <span style="display: flex;position: absolute;top: 50%;left: 66%;transform: translateY(-50%);" v-show="treeBtnHoverIndex==data.id&&!manageVisible && data.id !=-1">
                  <div style="display: flex;align-items: center;cursor: pointer;" >
                    <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                      <img :src="require('@/assets/icpImg/editTreeBtn.png')" style="width:1.3vw;" @click="editTreeItem(node, data)">
                    </el-tooltip>
                  </div> 
                  <div style="display: flex;align-items: center;cursor: pointer;margin-left: 5px;" >
                    <el-tooltip class="item" effect="dark" content="删除" placement="top">
                      <img :src="require('@/assets/icpImg/deleteTreeBtn.png')" style="width:1.3vw;" @click="deleteTreeItem(node, data)">
                    </el-tooltip>
                  </div>
                </span>
              </span>
            </el-tree>
          </el-scrollbar>
        </div>
        <div class="my-table-box" style="box-sizing: border-box;overflow: auto;">
         
          <el-row  class="my-table-box-search" style="margin:10px;">
            <el-col :span="14">
              <el-input
              placeholder="请输入设备名称/号码"
              class="searchInput"
              v-model="myData4.searchText"
              @input="handleSearch"
            ></el-input>
            </el-col>
            <el-col :span="10">
              <el-button type="primary"  @click="handleSearch" style="margin-left:10px;">搜索</el-button>
            </el-col>

            </el-row>
                <el-table
                  ref="elTable4"
                  :data="myData4.tableData"
                  highlight-current-row
                  :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
                  height="670"
                  style="width: 100%; height: 670px; overflow: auto"
                  @row-click="handleRowClick"
                  @row-dblclick="handleRowDbClick"
                  @selection-change="handleSelectionChange"
                  @select="handleSelect"
                  @select-all="selectAll">
                    <el-table-column type="selection"></el-table-column>
                    <!-- <el-table-column type="index" width="50" :resizable="false" align="center"></el-table-column> -->
                    <el-table-column   show-overflow-tooltip align="center"
                    v-for="(item,key) in myData4.tableColumn" :key="key" :label="item.label" :prop="item.prop"
                    :width="item.width" :resizable="false"></el-table-column>
                    <el-table-column   show-overflow-tooltip align="center" label="集群类型" prop="code" :resizable="false" ></el-table-column>
                    <el-table-column label="操作" width="250px" align="center">
                      <template slot-scope="scope" >
                        <el-tooltip v-if="manageVisible" class="item" effect="dark" content="查看" placement="top">
                          <i class="el-icon-info" @click="watchContactDetails(scope.row)"  style="font-size: 24px;color:#9FC8FE;cursor: pointer;"></i>
                        </el-tooltip>
                        <!-- <el-tooltip v-if="!manageVisible" class="item" effect="dark" content="编辑" placement="top">
                          <i class="el-icon-edit" @click="['myData' + tabPosition].rowData=scope.row;window.setTimeout(()=>{myEdit()},500)"  style="font-size: 24px;margin-left: 1vw;color:#9FC8FE;cursor: pointer;"></i>
                        </el-tooltip>
                        <el-tooltip v-if="!manageVisible" class="item" effect="dark" content="删除" placement="top">
                          <i class="el-icon-delete-solid" @click="['myData' + tabPosition].rowData=scope.row;window.setTimeout(()=>{myDel()},500)" style="font-size: 24px;margin-left: 1vw;color:#9FC8FE;cursor: pointer;"></i>
                        </el-tooltip>

                        <el-button type="primary" size="mini" @click="talkCall1(scope.row)">添加</el-button> -->
                      </template>
                    </el-table-column>
              </el-table>
            <el-row>
            <el-pagination class="pagination" background :page-size="myData4.pageSize" :page-sizes="[10,20,30,40]" :total="myData4.total"
              :current-page="myData4.currentPage"
              @current-change="handCurrentChange"
              @size-change="handSizeChange"
              layout="total, prev, pager, next, sizes, jumper"></el-pagination>
            </el-row>
        </div>
      </div>

    <contact-details-popup ref="ContactDetailsPopup" @getContactorList="refreshTable"></contact-details-popup>
    <cluster-dialog ref="ClusterDialog" @getTableData="getTableData"></cluster-dialog>
    <watch-cluster-dialog ref="watchClusterDialog"></watch-cluster-dialog>
    <watch-contact-details ref="watchContactDetails"></watch-contact-details>
  </div>
</template>

<script>
  import treeBtn from '@/yz_components/phoneNew/treeBtnNotExport';
  import btnBox from '@/yz_components/phoneNew/btnBox';
  import ContactDetailsPopup from "@/view/yz_integratedCommunication/contactDetailsPopup";
  import watchContactDetails from "@/view/yz_integratedCommunication/watchContactDetails";
  import ContactSortingPopup from "@/view/yz_integratedCommunication/contactSortingPopup";
  import ClusterDialog from "@/view/yz_integratedCommunication/icpVideo/clusterDialog";
  import watchClusterDialog from "@/view/yz_integratedCommunication/icpVideo/watchClusterDialog";
  import { mapGetters } from "vuex";
  import {replaceContactorGroupsConfig} from '@/assets/js/yz_common.js'
  export default {
    components: {
        treeBtn,
        btnBox,
        ContactDetailsPopup,
        watchContactDetails,
        ContactSortingPopup,
        ClusterDialog,
        watchClusterDialog
      },
    data() {
      return {
        IsYangZhouProject: window.g.IsYangZhouProject, // 扬州项目
        temporaryContactorName:'',
        treeBtnHoverIndex:-2,
        window:window,
        manageVisible:true, //图标管理功能切换
        talkList:[],
        talkListNumer:[],
        btnArry2:[
          {
            event:'add',
            icon:'el-icon-plus',
            title:'新增'
          },
        //   {
        // event:'edit',
        // icon:'el-icon-edit',
        // title:'修改'
        // },
        {
          event:'del',
          icon:'el-icon-delete',
          title:'批量移除'
        }],
        filterText:'',
        searchText:'',
        rowData: [],//行表格数据
        dialogVisible:true,
        formData1:{
         pid:0,
         code:'GroupTalk',
         ref:'talk',
         name:'集群分组',
        },
        formData2:{
         pid:0,
         code:'phone',
         ref:'talk',
         name: window.g.IsYangZhouProject ? "政务通信录" : "政务联络网",
        },
        formData3:{
         pid:0,
         code:'resource',
         ref:'talk',
         name:'资源联络网',
        },
        defaultProps: {
          children: 'children',
          label: 'name',
          plusIcon: true,
        },

        list:[
        // {
        //     name:'政务联络网',
        //     label:'2',
        //     code: 'phone',
        //     enabled: true
        // },{
        //     name:'资源联络网',
        //     label:'3',
        //     code: 'resource',
        //     enabled: true
        // },
        {//按钮切换
            name:' 集群分组',
            label:'1',
            code: 'GroupTalk',
            enabled: true
        },
        window.g.IsSuZhouPorject?
          {
            name: '工业园区管委会通讯录',
            label: '4',
            code: 'suzhouGroup',
            enabled: true
          }:null],
        myData1:{//集群分组
             tableColumn: [
                {
            prop: "name",
            label: "设备名称"
          },
          {
            prop: "number",
            label: "号码"
          },
          {
            prop: "remark",
            label: "备注"
          }],//表头
          currentPage:1,
          total: 0,//数据总数
          pageSize: window.g.IsZengChengProject ? 40 : 10, //总页数 bug 9359 增城定制化需求 author：何欣婷 date:2020-12-10
          rowData:null,//表格选择数据
          treeData:[],
          tableData: [],//表格数据
          treeDataItem:{},
          groupId:'',
          searchText:'',
          filterTree:'', //树状列表输入框过滤
          tableMultipleSelection:[], //列表勾选的选项
          treeMultipleSelection:[] //树状分组勾选的选项
        },
        myData2:{
           tableColumn: [
             {
               prop: "name",
               label: "姓名"
             },
             {
               prop: "workUnit",
               label: "单位"
             },
             {
               prop: "position",
               label: "职位"
             },
             {
               prop: "number",
               label: "联系号码"
             },
             {
               prop: "updateTime",
               label: "更新时间"
             }
           ], //表头
          currentPage:1,
          total: 0,//数据总数
          pageSize: window.g.IsZengChengProject ? 40 : 10, //总页数 bug 9359 增城定制化需求 author：何欣婷 date:2020-12-10
          rowData:null,//表格选择数据
          treeData:[],
          tableData: [],//表格数据
          treeDataItem:{},
          groupId:0,
          searchText:'',
          filterTree:'', //树状列表输入框过滤
          tableMultipleSelection:[], //列表勾选的选项
          treeMultipleSelection:[] //树状分组勾选的选项
        },
        myData3:{
          tableColumn: [
            {
              prop: "name",
              label: "姓名"
            }, {
              prop: "workUnit",
              label: "单位"
            }, {
              prop: "position",
              label: "职位"
            }, {
              prop: "number",
              label: "联系号码"
            }],//表头
          currentPage:1,
          total: 0,//数据总数
          pageSize: window.g.IsZengChengProject ? 40 : 10, //总页数 bug 9359 增城定制化需求 author：何欣婷 date:2020-12-10
          rowData:null,//表格选择数据
          treeData:[],
          tableData: [],//表格数据
          treeDataItem:{},
          groupId:0,
          searchText:'',
          filterTree:'', //树状列表输入框过滤
          tableMultipleSelection:[], //列表勾选的选项
          treeMultipleSelection:[] //树状分组勾选的选项
        },
        myData4:{//工业园区管委会通讯录
             tableColumn: [
                {
            prop: "name",
            label: "设备名称"
          },
          {
            prop: "number",
            label: "号码"
          },
          {
            prop: "remark",
            label: "备注"
          }],//表头
          currentPage:1,
          total: 0,//数据总数
          pageSize: window.g.IsZengChengProject ? 40 : 10, //总页数 bug 9359 增城定制化需求 author：何欣婷 date:2020-12-10
          rowData:null,//表格选择数据
          treeData:[],
          tableData: [],//表格数据
          treeDataItem:{},
          groupId:'',
          searchText:'',
          filterTree:'', //树状列表输入框过滤
          tableMultipleSelection:[], //列表勾选的选项
          treeMultipleSelection:[] //树状分组勾选的选项
        },
         btnArry1:[{
          event:'edit',
          icon:'el-icon-edit',
          title:'修改'
        },{
          event:'del',
          icon:'el-icon-delete',
          title:'批量移除'
        }],
        tabPosition: 1,
        isExpand: false,
        groupId: -1, // 分组id
      }
    },
    created(){
      this.getTalkGroupListTree()
      this.getTableData();
    },
    mounted(){
      this.$nextTick(()=>{
        // 3.0不要这个方法了
        // this.initContactorGroupsConfig(); // 初始化分组配置
        setTimeout(()=>{
          this.$refs['tree' + this.tabPosition].setCheckedNodes(this.talkTreeList['tree' + this.tabPosition])
          console.log("this.talkMember是什么",this.$store,this.talkTreeList,this.talkMember)
          this.talkMember.forEach(item=>{
            console.log("mounted里勾选表格item",item,this['myData' + this.tabPosition].tableData.filter(element=>{return element.id==item.id}),this['myData' + this.tabPosition].tableData )
            if(this['myData' + this.tabPosition].tableData.filter(element=>{return element.id==item.id}).length!=0){
              this.$refs['elTable' + this.tabPosition].toggleRowSelection(this['myData' + this.tabPosition].tableData.filter(element=>{return element.id==item.id})[0],true);
            } 
          })
        },800)
      })
    },
    watch: {
      talkMember(val){
        console.log("清空列表勾选")
        this.$refs['elTable' + this.tabPosition].clearSelection();
        this.talkMember.forEach(item=>{
          if(this['myData' + this.tabPosition].tableData.filter(element=>{return element.id==item.id}).length!=0){
            this.$refs['elTable' + this.tabPosition].toggleRowSelection(this['myData' + this.tabPosition].tableData.filter(element=>{return element.id==item.id})[0],true);
          }      
        })
      }
    },
    computed: {
      ...mapGetters({
        talkMember: "getTalkMember", //对讲队列
        talkTreeList: "getTalkTreeList" //对讲树状分组队列
      })
    },
    methods: {
      /**
       * @author hexinting
       * @date 2020-11-05
       * @lastEditor hexinting
       * @lastDate 2020-11-05
       * @description 初始化分组配置
       */
      initContactorGroupsConfig() {
        let contactorGroups = JSON.parse(sessionStorage.getItem("contactorGroups")); // 后端返回的分组配置列表
        this.list = replaceContactorGroupsConfig(this.list); // 根据后端返回分组，替换联系人大分组名字配置
      },
      //获取工业园区管委会树状分组
      getSuzhouGroupList() {
        this.$http({
          url:window.g.ApiUrl +"/eos/communication/group/suzhouGroupLIst",
          method: "post",
          data: {}
        }).then(({data}) => {
          console.log("/eos/communication/group/suzhouGroupLIst",data); 
          this.myData4.treeData=data.data
        });
      },
      watchContactDetails(row){
        this.$refs.watchClusterDialog.isDialogVisible = true;
        this.$refs.watchClusterDialog.title = "查看集群信息";
        this.$refs.watchClusterDialog.getPcode();
          this.$refs.watchClusterDialog.getTalkGroupListTree();
        this.$refs.watchClusterDialog.showData(row);
      },
      handleSelectionChange(val) {
        console.log('列表选中了什么',val,this.talkMember)
        this['myData' + this.tabPosition].tableMultipleSelection=val
        if(this.manageVisible){
          // this.$bus.$emit('clearNumber')
          // val.forEach(item=>{
          //   this.talkCall1(item)
          // })
        } 
      },
      handleSelect(selection, row){
        console.log('当前列表行勾选了什么selection, row',selection, row)
        if(selection.filter(item=>{return item.id==row.id}).length==0){ //证明取消勾选
          var temporaryTalkMember=this.talkMember.filter(item=>{return item.id!=row.id})
          this.$store.commit("setTalkMember", temporaryTalkMember);
        }else{
          var temporaryTalkMember=this.talkMember
          if(temporaryTalkMember.filter(item=>{return item.id==row.id}).length==0){
            
            if(!row.number){
              this.$message.warning(`${row.name||row.contactor}联系号码为空`)
            }else{
              row.isTableSelect=true
              row.headset=false
              row.microphone=true
              temporaryTalkMember.push(row)
              this.$store.commit("setTalkMember", temporaryTalkMember);
            }
          }  
        }
      },
      selectAll(selection){
        console.log("列表全选selection",selection)
        var temporaryTalkMember=this.talkMember
        if(selection.length!=0){
          selection.forEach(item=>{
            if(temporaryTalkMember.filter(element=>{return element.id==item.id}).length==0){
              
              if(!item.number){
                this.$message.warning(`${item.name||item.contactor}联系号码为空`)
              }else{
                item.isTableSelect=true
                item.headset=false
                item.microphone=true
                temporaryTalkMember.push(item)
                this.$store.commit("setTalkMember", temporaryTalkMember);
              }
            }
          })
        }else{
          this['myData' + this.tabPosition].tableData.forEach(item=>{
            temporaryTalkMember=temporaryTalkMember.filter(element=>{return element.id!=item.id})
            this.$store.commit("setTalkMember", temporaryTalkMember);
          })
        }
        
      },
      filterNode(value, data) {
        if (!value) return true;
        console.log(data.name);
        return data.name.indexOf(value) !== -1;
      },
      handleCheckChange(data, checked, indeterminate) {    
        console.log('handleCheckChange树状分组选中了什么',data, checked, indeterminate);
        if(checked){
          this['myData' + this.tabPosition].treeMultipleSelection.push(data)
        }else{
          this.temporaryContactorName=''
          this['myData' + this.tabPosition].treeMultipleSelection=this['myData' + this.tabPosition].treeMultipleSelection.filter(function (elem) {
            return (elem.id != data.id);
          })
           if (this['myData' + this.tabPosition].treeMultipleSelection.length === 0) {
            this.$store.commit('setTalkMember',[]) //当树状分组未被选中时，清空选中的数据
          }
        }
        if(this.manageVisible){  
          console.log("this['myData' + this.tabPosition].treeMultipleSelection是什么",this['myData' + this.tabPosition].treeMultipleSelection)
          // this.$bus.$emit('clearNumber')
          if(this['myData' + this.tabPosition].treeMultipleSelection.length==0){
            // setTimeout(()=>{
            //   this.$bus.$emit('clearNumber')
            // },500)
            return false;
          }
          if(this.tabPosition==1||this.tabPosition==4){
            this.$http({ 
              url: window.g.ApiUrl + '/eos/communication/groupTalk/findAllTalkingGroupInGroup',
              method: 'post',
              data:{
                groupIds:this['myData' + this.tabPosition].treeMultipleSelection.map(function (elem) {
                  return elem.id
                })
              }
            }).then(res => {
              console.log("/eos/communication/groupTalk/findAllTalkingGroupInGroup",res)
              if(res.data.data&&res.data.data.length!=0){
                var temporaryTalkMember=this.talkMember.filter(item=>{return item.isTableSelect==true})
                res.data.data.forEach(item=>{
                  // if(item.mobile){
                    // this.talkCall1(item)
                  // }
                  if(temporaryTalkMember.filter(element=>{return element.id==item.id}).length==0){
                    if(!item.number){
                      if(this.temporaryContactorName!=(item.name?item.name:item.contactor)&&checked){
                        this.temporaryContactorName=item.name||item.contactor
                        this.$message.warning(`${item.name||item.contactor}联系号码为空`)
                      }
                      
                    }else{
                      item.headset=false
                      item.microphone=true
                      temporaryTalkMember.push(item)
                      this.$store.commit("setTalkMember", temporaryTalkMember);
                    }
                  }
                })
              }
              
            })
          }   
          
        }
      },
      handleTreeCheck(data,node){
        console.log('handleTreeCheck树状分组选中了什么',data,node);
        var temporaryTalkTreeList=this.talkTreeList
        temporaryTalkTreeList['tree' + this.tabPosition]=node.checkedNodes
        this.$store.commit("setTalkTreeList", temporaryTalkTreeList);
      },
       addList(){//新增
            this.$nextTick(() => {
               switch (this.tabPosition) {

                  case 2:

                          this.$refs.ContactDetailsPopup.isDialogVisible = true;
                          this.$refs.ContactDetailsPopup.title = "新增联系人";
                          this.$refs.ContactDetailsPopup.getTree();

                  break;
                   case 1:
                        this.$refs.ClusterDialog.isDialogVisible = true;
                        this.$refs.ClusterDialog.title = "新增集群信息";
                        this.$refs.ClusterDialog.getTalkGroupListTree();
                  break;
                  case 3:
                      this.$refs.ContactDetailsPopup.isDialogVisible = true;
                      this.$refs.ContactDetailsPopup.title = "新增联系人";
                      this.$refs.ContactDetailsPopup.getTree();
                  break;
              }


            });
        },
        myEdit(){//修改
          if (this['myData'+this.tabPosition].rowData == "" || this['myData'+this.tabPosition].rowData == null) {
            this.$message({
              message: "请选中表格中任意行或双击任意行进行修改!",
              type: "warning"
            });
            return;
          } else {
            this.handleRowDbClick(this['myData'+this.tabPosition].rowData);
          }

        },
        myDel(){ //删除单个列表选项
          if (this['myData'+this.tabPosition].rowData == "" || this['myData'+this.tabPosition].rowData == null) {
            this.$message({
              message: "请选中表格中任意行进行删除!",
              type: "warning"
            });
            return;
          } else {
            //console.log(data)
            this.$confirm('确定删除该条数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              switch (this.tabPosition) {
                case 1:

                    this.removeTalkGroup()
                break;
                case 2:
                  this.removeCommonContactor()
                break;
                  case 3:
                  this.removeContentor()
                break;
              }
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除!'
              });
            });
          }
        },
    /** 
     * @LastEditTime: 2020-09-28 15:28:50
     * @LastEditors: qinjiaqi
     * @param {type} 没有
     * @return {type} undefined
     * @Description: 批量删除多个列表选项
     */  
    handleDelete() {
        if (this.tabPosition == 1) {
            if (this.myData1.tableMultipleSelection.length==0) {
                this.$message({
                    message: "请选中表格中任一行进行删除!",
                    type: "warning"
                });
            return;
            } else {
                this.$confirm('删除当前信息?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http({ 
                        url: window.g.ApiUrl + '/eos/communication/groupTalk/batchRemove',
                        method: 'post',
                        data:{
                            ids:this['myData' + this.tabPosition].tableMultipleSelection.map(function (elem) {
                                return elem.id
                            })
                        }
                    }).then(({data}) => {
                        console.log("/eos/communication/groupTalk/batchRemove",data)
                        if (data.errorcode != 0) {
                            this.$message({
                                message: data.msg,
                                type: "error"
                            });
                            return;
                        }
                        this.$message({
                            message: "删除成功!",
                            type: "success"
                        });
                        this.removeTalkGroup()
                        // 批量勾选的时候右边也会显示数据，所以清除
                        var temporaryTalkMember = []
                        // 把新数组赋给setTalkMember，使得右边同步改变
                        this.$store.commit("setTalkMember", temporaryTalkMember); 
                        // 删除完后让表格自动刷新
                        this.getTableData(); 
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除!'
                    });
                });
            }
        }
    },
      removeContentor(){
        let data = {
          data: {id: this['myData'+this.tabPosition].rowData.id},
          operate: 2,
        };
        this.$api.updateConcator(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          this.$message({
            message: "删除成功!",
            type: "success"
          });
          this.getContactorListResource();
        });

      },
      updatContentor(){
        if(this.tabPosition==3){
          let data = {
            data: {id: this['myData'+this.tabPosition].rowData.id},
            operate: 2,
          };
          this.$api.updateConcator(data).then(res => {
            if (res.errorcode != 0) {
              this.$message({
                message: res.msg,
                type: "error"
              });
              return;
            }
            this.$message({
              message: "删除成功!",
              type: "success"
            });
            this.getContactorListopo();
          });
        }
      },
          removeCommonContactor(){//删除联系人
            let data = {
                      contactorId: this['myData'+this.tabPosition].rowData.id,
                  };
             this.$api.removeCommonContactor(data).then(res => {
                              if (res.errorcode != 0) {
                                this.$message({
                                  message: res.msg,
                                  type: "error"
                                });
                                return;
                              }
                              this.$message({
                                message: "删除成功!",
                                type: "success"
                              });
                             this.getContactorList()
                               this['myData'+this.tabPosition].rowData = null;
                            });
        },
        /** 
         * @LastEditTime: 2020-09-28 15:28:50
         * @LastEditors: qinjiaqi
         * @param {type} 没有
         * @return {type} undefined
         * @Description: 删除集群分组 
         */  
        removeTalkGroup(){
            let data = {
                id: this['myData'+this.tabPosition].rowData.id,
            };
            this.$api.removeTalkGroup(data).then(res => {
                if (res.errorcode != 0) {
                    this.$message({
                        message: res.msg,
                        type: "error"
                    });
                    return;
                }
                this.$message({
                    message: "删除成功!",
                    type: "success"
                });
                // 找出原来列表里勾选了的
                var temporaryTalkTrueMember=this.talkMember.filter(item=>{return item.isTableSelect==true}) 
                // 把勾选了且不等于要删除的数据存进新数组 
                var temporaryTalkMember = temporaryTalkTrueMember.filter(element=>{return element.id!=this['myData'+this.tabPosition].rowData.id})
                // 把新数组赋给setTalkMember，使得右边同步改变 
                this.$store.commit("setTalkMember", temporaryTalkMember); 
                // 更新表格展示
                this.getTableData();
                // 被删除的原来的行数据置空
                this['myData'+this.tabPosition].rowData = null;
            });
        },  
       //表格行内单机方法
        handleRowClick(row) {
          this['myData'+this.tabPosition].rowData = row;
        },
      //电话分组树
      getPhoneGroupingTree() {
        let data = {
          displayDefault: true
        };
        this.$api.telephoneGroupingTree(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return
          }
          this.myData2.treeData = res.data;
        })
      },
      getResourceGroupingTree(key) {
        let data = {
          displayDefault: true //是否显示未分组联系人
        };
        this['myData'+this.tabPosition].myLoading = true;
        this.$api.resourceGroupList(data).then(res => {
          this['myData'+this.tabPosition].myLoading = false;
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return
          }
          this['myData'+this.tabPosition].treeData = res.data||[];


        }).catch(err=>{
          this['myData'+this.tabPosition] = false;
        })
      },
      //获取联系人数据
      getContactorList() {
        this['myData' + this.tabPosition].rowData = null;
        var dictType
        switch(this.tabPosition){
          case 4:
            dictType='suzhouGroup'
            break;
        }
        // bug9183 author:hexinting date:20201207
        let data= window.g.IsZengChengProject ? {
            searchText: this['myData' + this.tabPosition].searchText,
            groupId:  this['myData' + this.tabPosition].groupId,
            page:  this['myData' + this.tabPosition].currentPage,
            size:  this['myData' + this.tabPosition].pageSize,
            type:'groupTalk',
            dictType:dictType,
            thisGroupOnly: true
          } : {
            searchText: this['myData' + this.tabPosition].searchText,
            groupId:  this['myData' + this.tabPosition].groupId,
            page:  this['myData' + this.tabPosition].currentPage,
            size:  this['myData' + this.tabPosition].pageSize,
            type:'groupTalk',
            dictType:dictType
          };

        this.$api.contactorList(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          this['myData' + this.tabPosition].tableData = res.data.list||[];
           this['myData' + this.tabPosition].total = res.data.totalCount||0;
        })
      },
      getContactorListResource() {
        this.myData3.rowData = null;
        let data;

        // bug9183 author:hexinting date:20201207
        data = window.g.IsZengChengProject ? {
          searchText: this.myData3.searchText,
          groupId:  this.myData3.groupId,
          page:  this.myData3.currentPage,
          size:  this.myData3.pageSize,
          type:'groupTalk',
          thisGroupOnly: true
        } : {
          searchText: this.myData3.searchText,
          groupId:  this.myData3.groupId,
          page:  this.myData3.currentPage,
          size:  this.myData3.pageSize,
          type:'groupTalk'
        };

        this.$api.contactorList(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          this.myData3.tableData = res.data.list||[];
          this.myData3.total = res.data.totalCount||0;
        })
      },

      //获取集群分组
      getTalkGroupListTree() {
        let data = {
          displayDefault: true
        };
        this.$api.talkGroupListTree(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return
          }
          this.myData1.treeData = res.data||[];
        })
      },
      //获取集群分组表格数据
      getTableData() {
         if(this.tabPosition==1){
           let data;
           data = {
             groupId: this.myData1.groupId,
             page: this.myData1.currentPage,
             size: this.myData1.pageSize,
             searchText: this.myData1.searchText,
             dictType:'GroupTalk'
           };
           this.$api.talkGroupList(data).then(res => {
             if (res.errorcode !== 0) {
               this.$message({
                 message: res.msg,
                 type: "error"
               });
               return;
             }
             this.myData1.total = res.data.totalElements||0;
             this.myData1.tableData = res.data.data||[];
             this.myData1.rowData = null;
           })
         }
         if(this.tabPosition==3){
           this.getTableDataResource()
         }

      },

      getTableDataResource() {

        let data;
        data = {
          groupId: this.myData3.groupId,
          page: this.myData3.currentPage,
          size: this.myData3.pageSize,
          searchText: this.myData3.searchText,
        };
        this.$api.talkGroupList(data).then(res => {
          if (res.errorcode !== 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          this.myData3.total = res.data.totalElements||0;
          this.myData3.tableData = res.data.data||[];
          this.myData3.rowData = null;
        })
      },




        myEidt(row){

           this.handleRowDbClick(row);

        },
        refreshTable(){
         if(this.tabPosition==3){
           this.getContactorListResource()
         }
         if(this.tabPosition==2){
           this.getContactorList();
         }

        },
        handleRowDbClick(row){//双击修改
              this.$nextTick(() => {
                if(this.tabPosition==1){
                         this.$refs.ClusterDialog.isDialogVisible = true;
                    this.$refs.ClusterDialog.title = "修改集群信息";
                    this.$refs.ClusterDialog.getTalkGroupListTree();
                    this.$refs.ClusterDialog.showData(row);
                }else if(this.tabPosition==2||this.tabPosition==3){
                      this.$refs.ContactDetailsPopup.isDialogVisible = true;
                      this.$refs.ContactDetailsPopup.title = "修改联系人";
                      this.$refs.ContactDetailsPopup.getTree();
                      this.$refs.ContactDetailsPopup.showData(row);
                }
              });
        },
        handleSearch(){
          this['myData'+this.tabPosition].currentPage =1;
          this["myData" + this.tabPosition].groupId=''
          this.tabPosition==1&&this.getTableData();
          this.tabPosition==2&&this.getContactorList()
          this.tabPosition==3&&this.getContactorListResource()
          this.tabPosition==4&&this.getContactorList()
        },

        talkCall1(row){
          let content;
           switch (this.tabPosition) {
              case 1:
                if (row.number ==''|| row.number ==null){
                  this.$message.warning("当前号码为空");
                  return;
                }else if (row.code !='集群分组') {
                  this.$message.warning("请选择集群分组");
                  return;
                  }else{
                    content={
                        name:row.name,
                        call:row.number,
                        numType:'1',
                        microphone:false,
                        headset:false
                    }
              }
              break;
              case 2:
                if (row.number ==''|| row.number ==null){
                  this.$message.warning("当前联系人号码为空");
                  return;
                }else{
                    content={
                        name:row.name,
                        call:row.number,
                        numType:'1',
                        microphone:false,
                        headset:false
                    }
                }
              break;
           }
           this.$emit('findfaxDataT',content);

        },
        changePage(){
          this.manageVisible = true
          console.log("changePage切换 this.tabPosition",this.tabPosition,typeof this.tabPosition)
          this['myData'+this.tabPosition].total =0;
          this['myData'+this.tabPosition].pageSize = window.g.IsZengChengProject ? 40 : 10; //总页数 bug 9359 增城定制化需求 author：何欣婷 date:2020-12-10
          this['myData'+this.tabPosition].rowData =null;
          this['myData'+this.tabPosition].treeData =[];
          this['myData'+this.tabPosition].tableData=[];//表格数据
          this['myData'+this.tabPosition].treeDataItem={};
          this['myData'+this.tabPosition].groupId=-1;
          this['myData'+this.tabPosition].searchText='';
          this['myData'+this.tabPosition].filterTree='', //树状列表输入框过滤
          this['myData'+this.tabPosition].tableMultipleSelection=[], //列表勾选的选项
          this['myData'+this.tabPosition].treeMultipleSelection=[] //树状分组勾选的选项
          switch (this.tabPosition) {
            case 1:
                this.getTalkGroupListTree();
            break;
            case 2:
              this.myData2.groupId=0;
              this.getPhoneGroupingTree();
            break;
            case 3:
              this.myData3.groupId=0;
              this.getResourceGroupingTree();
            break;
            case 4:
                this.getSuzhouGroupList();
            break;

          }

        },
        handCurrentChange(val){
             this['myData'+this.tabPosition].currentPage = val;

            switch (this.tabPosition) {
                   case 1:
                      this.getTableData();
                  break;
                  case 2:
                    this.getContactorList()
                  break;
                    case 3:
                    this.getContactorListResource()
                  break;
                  case 4:
                    this.getContactorList()
                  break;
            }
        },
        handSizeChange(val){
               this['myData'+this.tabPosition].currentPage = 1;//跳转到第一页
              this['myData'+this.tabPosition].pageSize = val;
            switch (this.tabPosition) {
                  case 1:
                      this.getTableData();
                  break;
                  case 2:
                  this.getContactorList()
                  break;
                  case 3:
                  this.getContactorListResource()
                  break;
                  case 4:
                  this.getContactorList()
                  break;
            }
        },
      editTreeItem(node, data){
        console.log("编辑什么node,data",node,data)
        this['myData' + this.tabPosition].currentPage = 1;//跳转到第一页
        this['myData' + this.tabPosition].groupId = data.id;
        this['myData' + this.tabPosition].searchText = "";
        this['myData' + this.tabPosition].treeDataItem = {
          groupId: data.id,
          currentGroupName: data.name
        }
        
        console.log(data);
        this.$store.commit('setGroupId', data.id)
        this.groupId = data.id
        
        setTimeout(()=>{
          this.$refs['treeBtn'+this.tabPosition].updateGroup()
        },500)
      },
      deleteTreeItem(node, data){
        console.log("删除什么node,data",node,data)
        this['myData' + this.tabPosition].currentPage = 1;//跳转到第一页
        this['myData' + this.tabPosition].groupId = data.id;
        this['myData' + this.tabPosition].searchText = "";
        this['myData' + this.tabPosition].treeDataItem = {
          groupId: data.id,
          currentGroupName: data.name
        }
    
        console.log(data);
        this.$store.commit('setGroupId', data.id)
        this.groupId = data.id
        
        setTimeout(()=>{
          this.$refs['treeBtn'+this.tabPosition].deleteGroup()
        },500)
      },
      handleNodeClick(data, node){
        this['myData'+this.tabPosition].currentPage = 1;//跳转到第一页
        this['myData'+this.tabPosition].groupId = data.id;
        this['myData'+this.tabPosition].treeDataItem = {
                  groupId:data.id,
                  currentGroupName:data.name
              }
          switch (this.tabPosition) {
              case 1:
                  this.getTableData();
            break;
            case 2:
              this.getContactorList()
            break;
              case 3:
              this.getContactorListResource()
            break;
              case 4:
              this.getContactorList()
            break;
        }
      },

        refreshData(){//更新分组树
          this['myData'+this.tabPosition].treeDataItem = {}
          this.tabPosition==1&&this.getTalkGroupListTree();
          this.tabPosition==2&&this.getPhoneGroupingTree();
          this.tabPosition==3&&this.getResourceGroupingTree();
        },
        closeDialog(key){
          this.$emit('closeDialog',key);
        },
      handSetToCommon(row){
        if(row.commonlyUsed==0){
          let data = { contactorId: row.id };
          this.$api.usedContactor(data).then(res => {
            if (res.errorcode != 0) {
              this.$message.error(res.msg);
              return;
            }
            this.$message.success("已设为常用联系人!");
            switch (this.tabPosition) {
              case 1:
                this.getTableData();
              break;
              case 2:
                this.getContactorList()
              break;
                case 3:
                this.getContactorListResource()
              break;
            }
          });
        }else{
          let data = {
            contactorId: row.id
          };
          this.$confirm("是否将该联系人从常用联系人中移出", "移出常用联系人", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.$api.removeCommonContactor(data).then(res => {
                if (res.errorcode != 0) {
                  this.$message({
                    message: res.msg,
                    type: "error"
                  });
                  return;
                }
                this.$message({
                  message: "移出成功!",
                  type: "success"
                });
                switch (this.tabPosition) {
                  case 1:
                    this.getTableData();
                  break;
                  case 2:
                    this.getContactorList()
                  break;
                    case 3:
                    this.getContactorListResource()
                  break;
                }
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消!"
              });
              return;
            });
        }
        

      },

      // 拖动排序相关
      refreshTreeAfterDrag() {
        //刷新树数据
        switch (this.tabPosition) {
          case 1:
            this.getTalkGroupListTree();
            break;
          case 2:
            this.myData2.groupId=0;
            this.getPhoneGroupingTree();
            break;
          case 3:
            this.myData3.groupId=0;
            this.getResourceGroupingTree();
            break;

        }

        //选中
        this.$nextTick(function() {

        })
      },
      handleDrop(draggingNode, dropNode, dropType, ev) {
        if (this.childrenlist) {
          let arrays = [];
          this.childrenlist.forEach(function(data) {
            if (data.id > 0){
              arrays.push(data.id);
            }
          });
          let data = {
            ids: arrays //移动后数组ID
          };

          this.$api.updateContactorGroupOrder(data).then(res => {
            this.refreshTreeAfterDrag();
          })
        }
      },
      allowDrop(draggingNode, dropNode, type) { //拖拽时判定目标节点能否被放置
        this.groupId = draggingNode.data.id;
        if (draggingNode.data.parentId > 0){
          this.childrenlist = draggingNode.parent.data.children;
        }else{
          this.childrenlist = draggingNode.parent.data;
        }

        if (draggingNode.data.parentId == dropNode.data.parentId) {
          return type !== 'inner';
        } else {
          return false;
        }
      },
      allowDrag(draggingNode) { //判断节点能否被拖拽
        return draggingNode.data.id > 0;
      }
    }
  }
</script>

<style scoped>
/deep/ [role="treeitem"]{
    margin: 6px 0px;
  }
  .treeSearch /deep/ .el-input__inner{
    background: rgb(234, 234, 234);
    border-radius: 12px;
    opacity: 0.52;
    height: 3vh;
  }
  .el-table /deep/ thead th, .el-table /deep/ thead tr {
    background: rgba(249,252,255,1)!important;
  }
  .treeSearch /deep/ .el-input__suffix{
    height: initial;
    right: 16px!important;
    top: 50%!important;
    transform: translateY(-50%)!important;
  }
  .my-radio-box {
    height: 100%;
    position: relative;
  }
  .el-radio-button{

  }
  /*.my-radio-box .el-radio-button >>> .el-radio-button__inner {*/
  /*  padding: 15px 30px;*/
  /*  border-bottom: none;*/
  /*}*/
  .my-radio-box-main {
    position: relative;
    z-index: 30;
    margin-bottom: 10px;
    background: white;
    box-shadow:0px 3px 10px 2px rgba(54,121,225,0.09);
    border-radius:3px;
  }
  .my-radio-box  >>>.el-radio-button__inner {
    padding: 14px 22px;
    font-size: 14px;
    color: #999999;
    border: none;
    border-bottom: 2px white solid;
    background: white !important;
    box-shadow: none !important;
  }

  .my-radio-box .is-active >>>.el-radio-button__inner {
    border-bottom:2px #0091FF solid ;
    color: #0091FF;
    border-radius: 0;
  }
  >>>.el-radio-button:first-child .el-radio-button__inner{
    border-left:0;
  }

  .my-phone-main {
    box-sizing: border-box;
    height: calc(100vh - 175px);
    overflow: auto;
    display: flex;
  }

  .my-tree-box {
    height: initial;
    background-color: #fff;
    border-top: 1px solid rgba(211, 215, 219, 1);
    border-right: 1px solid rgba(211, 215, 219, 1);
    border-bottom: 1px solid rgba(211, 215, 219, 1);
    width: 26%;
    position: relative;
    min-width: 200px;
    box-shadow:0px 3px 10px 2px rgba(54,121,225,0.09);
    border-radius:3px;
  }

  .my-tree-scroll {
    height: 100%;
    box-sizing: border-box;
    position: relative;
    z-index: 20;
    max-height: 650px;
    padding-bottom: 40px;
  }
  .my-table-box {
    flex: 1;
    border-left: 10px solid #ebeef5;
    background: white;
    box-shadow:0px 3px 10px 2px rgba(54,121,225,0.09);
    border-radius:3px;
    display: flex;
    flex-direction: column;
  }
  .el-tree--highlight-current
    >>> .el-tree-node.is-current
    > .el-tree-node__content {
    background: #e5f4ff;
  }
  .pagination {
    padding: 16px 0;
    text-align: center;
  }
  .my-tree-input-box {
    padding: 10px 5px;
    position: absolute;
    top: -4px;
    left: 0;
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    z-index: 30;
  }

  .filter-tree {
    width: 100%;
    box-sizing: border-box;
    padding-left: 10px;
    flex: 1;
  }
  .filter-tree /deep/ .el-tree-node__content {
    height: 32px !important;
  }
  .filter-tree /deep/ .el-tree-node__expand-icon {
    font-size: 17px;
    color: #8a8a8a;
    margin-right: 10px;
  }
  .filter-tree /deep/ .is-leaf.el-tree-node__expand-icon.el-icon-caret-right{
    margin-right: initial;
  }
  .filter-tree
    /deep/
    .el-tree-node
    .el-tree-node__content
    .el-tree-node__expand-icon:before {
    content: "";
    display: inline-block;
    width: 10px;
    height: 10px;
    background: url("data:image/png;base64,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");
    background-size: 100% 100%;
  }

  .filter-tree
    /deep/
    .el-tree-node
    .el-tree-node__content
    .el-tree-node__expand-icon.is-leaf:before {
    width: 0;
  }
  /*一级菜单收缩显示*/
  /deep/
    .filter-tree
    > .el-tree-node
    > .el-tree-node__content
    > .el-tree-node__expand-icon.is-leaf:before {
    margin-right: 20px;
  }
  /deep/ .filter-tree > .el-tree-node > .el-tree-node__content {
    background: none !important;
  }
  /deep/ .filter-tree .el-tree-node__label {
    font-size: 12px;
    letter-spacing: 1px;
    margin-top: -2px;
  }
  /deep/
    .filter-tree
    > .el-tree-node
    > .el-tree-node__content
    > .el-tree-node__label {
    margin-left: 25px;
    position: relative;
    font-size: 12px;
    letter-spacing: 1px;
  }
  /deep/
    .filter-tree
    > .el-tree-node
    > .el-tree-node__content
    > .el-tree-node__label::before {
    content: "";
    position: absolute;
    left: -25px;
    width: 17px;
    height: 17px;
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAANCAYAAACgu+4kAAAAmUlEQVQ4T+2TMQ4BYRCFv5e4gt0b2JtwAEdxAOfQ6DUS5WrcwNYShYZCFDqC7BMSksXm/yNK086bb15eZuS8tQU1EcbeISagvtqLDREl51kJqKr1HsqeOsthiFEDeI6tgGMtRF7L02z27iC099H3RS7S8dcA3wDz9EMGsQ44/QG/ySA5gxrRuVeFB7lIBlhd9HrOAaTvvzO6Ap8dRlHswtTSAAAAAElFTkSuQmCC");
    background-size: 100% 100%;
  }
  /deep/
    .filter-tree
    > .el-tree-node
    > .el-tree-node__content
    > .el-tree-node__expand-icon.expanded
    ~ span::before {
    content: "";
    position: absolute;
    left: -25px;
    width: 17px;
    height: 17px;
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAANCAYAAACgu+4kAAAAmUlEQVQ4T+2TMQ4BYRCFv5e4gt0b2JtwAEdxAOfQ6DUS5WrcwNYShYZCFDqC7BMSksXm/yNK086bb15eZuS8tQU1EcbeISagvtqLDREl51kJqKr1HsqeOsthiFEDeI6tgGMtRF7L02z27iC099H3RS7S8dcA3wDz9EMGsQ44/QG/ySA5gxrRuVeFB7lIBlhd9HrOAaTvvzO6Ap8dRlHswtTSAAAAAElFTkSuQmCC") no-repeat;
    background-size: 100% 100%;
  }

  .filter-tree /deep/ .changeImgOften:before {
    content: "";
    position: absolute;
    top: 0;
    left: -25px;
    width: 23px;
    height: 23px;
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAEXElEQVRYCe1Wz09UVxQ+586bARuJtSXVNnRTgQhC66pNRGustv+Alsamv3ZEURpIsQODeB0ydJQEI4iGrmqjJkW76KKbpk2jqQu7qRHGJjK2C0yVpmBttTAM795+58FMAGcYBhdNE8l37v3OuefXu+/O5RE9/vs/70C4t7NGH49uepRncB4l2LLqUMpa5NgOWRZ4WVEI0ieir7K1F0HJMm/V+4KXhOcrKt+AlD8e/GCKszVtKZ7vzPkGiL/uOfIys7kCPgSRHBusVa/oho9/hJ4XlrUDik3HbBVNRIcgxOyGZc5XpPu8YuTkW+IfyNK19v3BjRIc7o1eJaYXmezm9v2tl8W2VFFLdUz5oXhIOCuOMDPOH8NEnWIj4taZeeljzh2w1nLkZKTEneZS9vFLULuRfrhizbrK2tpaF5wGBgZ8P4/evA5ehiYaybjXfI6Nh/aGbkmTsGdFuoHIscizSZ/aoJhKDfE6bE2pJVuKSJFCzGngud9vbwh+njaAhHui71m2p0HnYhJKnInjhiiOvYoj502/a2KhxtBtrJEjg0jS4VVMdNoSPYd3iVcsVk9GMV7BdTOM9Ruk+IYZm/watnkw45PnuLjwHhlbjhzlzITdoPVwqkLRKsRiczz8hlrbYfca8OxQPHQcP1pmlPsdlOex8E0gwLXBuuA96MuGPqafZCcwgNKvI8mIVfSarm+Jg3tQ3jg7HPzwwLBPuTVQh/EUbySm7CmtdXqXYM8LEstOwcnZ4l7uucUl2bwGxNBW3zbiuGYLeAyym58uOCOJwPNCf3+/n54KnEXQbsiQ5JTc4POAnZ6npxV9qusZnp7+FoZqnOQLa/yr366rq0tCzwkpPpq8ew6/oF1wHrSOs0Pvaf4d/CFkbUA8dd/RtWy8M1EJ/Qs7lngHuzENnhVS/HZi7AyaroVTzCrfDl1/4A54RqiM1lmjBKL7bVDvQt6iVbQS86IYd8dXzhS3435rt0mOxQIWbcALHH3wJ2YpPKIbtXCo2dGyt0WavYWDVzQ1PpXzF5S7gdX+cpTzQ4YgSwJbEl+/Ki4syxWQswHl88n7xwPR9YXJwj2dW3RfdPNCO25SzxeHcCZ2ocMc3ZnDM1JDphpXKdbsIAYPKLzVKu7E7biJjaXDvZ9cxtdRqL2h9aI4KLKDuEeEVmM4D8mKnA0oqypxlZK1vlhH35EKPFUYshN3NSNrqqka/Fv8Ho1cgG87KYoRLn+s59yBnK8ACauQiMi6zcaYQRTfBf1X7Mq7+FluFBEuNsib4EPGtR+By2ubifWUzIM8ReYVWLu7u1f87U/cB001+gt4EEW/xH1gwNOArnBr7oQhCnkBInCLkgVFTU1NE6JkkkVfwV+BiQq2SiHwDv67HTJ/JD7TWk9BfwiwS0PnMX+ligs+wPk4DKe1953Eesw/QTJi0QbwvV2CT63gExPOiebm5gcZMywwogFp8NOurq6z/6yY3ocPmBK4ZG0Aa4/x3+7AvwS4jOUcrgwDAAAAAElFTkSuQmCC") !important;
    background-size: 90% 90% !important;
  }
  .filter-tree /deep/ .changeImgLately:before {
    content: "";
    position: absolute;
    top: 0;
    left: -25px;
    width: 23px;
    height: 23px;
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAADeklEQVRYCe1WbUtUQRQ+Z3ZdBUkJCkoLyvIHGPQDKhGMwDfyW0G/IPalFXW3ru6uYu4q+QOEom/mS1EEYdSHPlbQp6DCpFKCgigtXdc70zM3da97d7fVrU96ec6dM2fOOXNm5swL0e6302eAtzIBseHYQVOpFlLURMSHYbsfpPEFvw9MfNc03ZNGMPgZ9YJQUADGUP9xl1J9ilQbvApQPkgEMm4ydxm+znf5FHXbXwPoSUTb4PAmlMtBSdCYYjWh2PWqdJm+oU7JMtrL0qwTJFoQ5HnIPKBFVnwhHOiaAp8TnLMFDb2JqA9THQfLCGLMFBw0vJ2zlOczhvtrhJKDWKZWqElW5AsHum+Az4qcAUTifc0Y6TisUJA/m5PeREyhna76ux1+IvGYVzENol0H3xT2d90H70DW9TQGBg6h11vQFkQqmK1ztOUFbIbRcyeUBJbltk5g8A6gA4eMhHs1Auke0ORVf2gI5bYQ8nZh+ZQeeaUpqTebE5EpxBoeIaKLoBUpRADltsGMNDSVDw5SoEvRRFRvXbBpOAJwmbIJzQJJNIGEmwFfFMLB8FsksN4JLuxP7XuTP0cASJxGrYEc0EaaLZrSvvhspjNHAFA4BiLs8xe6/BfEQv7xJakm0587U4D6ARBRabLg43R9O1p2az/71vQkPfNJ9yqOFKpaa94oxAaXZqw9Xf6r3NrjafH/4ZwzwDSPBKz9KVLV6PINKCfso8yphIYll1m9NtI5VDdhTW6TKbIyn0nW2aRFsUKoE5YDpvdWafs5A2Dr4CDs4GabXnGs1Nc3UkDRg0xHjgBkqmQKSqvE1IpDqQZ8UYhcj9TCVzOcmEzqHspNEJtqqBgdHZ9gMArWI6RMKIWTAZXtQNsqF+uj3IPOR0P+0MdMP44AtIJMuXtQLoCaI4l+faGA3TqiQ30hTPw5WH4Xgq+hdMDlkEDwdHp64XRD/WtiagedOdVQn3zy6PEzNBUEPXJXZSk6ty4gTCG3h3zdL7MZczbhusz+IEEgdySLK7gfZinPp/MGSxeHSgtI4jr34kYdAZ8VeQPQFo4nmaJJBPNQKn5OiyszFRUV/EMuH2VBJ3HxN+Lu1wlXCtvin2RwYsGIG/uYSwKI9jIEZaB8WFJEI0ql4kbA+JpPUbfBpy4KI/2qsT3La2FVBdKYw09fu1t+lsNuFzt8Bn4DN8klCcjCu9UAAAAASUVORK5CYII=") !important;
    background-size: 90% 90% !important;
  }
  .filter-tree /deep/ .el-tree-node__expand-icon.is-leaf {
    color: transparent;
    cursor: default;
  }
  .filter-tree /deep/ .el-tree-node {
    margin-bottom: 5px;
  }
  .filter-tree /deep/ .el-tree-node__children .is-current::before {
    content: "";
    display: inline-block;
    width: 2px;
    height: 32px;
    background-color: #0091ff;
    position: absolute;
  }
  .filter-tree /deep/ .is-current > div:first-child {
    background: #ebf4fe;
    color: #0091ff;
  }
  .filter-tree /deep/ .is-current .changeImgOften:before {
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAARCAYAAADHeGwwAAACRElEQVQ4T52UzW/ScBjHR2mBvq0da6GE4ODgBIziFk08ycX4ssR40Zh48LCb0X/Cv2A3/Qd208SbUS/EkwlyWZRkLotgxA4KAn0D0pXi89NgGIHS+Ts1/X2f5/O8/R7fksdTLpcDmUxm4PP5lmRZXovH4z+8mPq8iJBmOBy2ul3zjuP4q6urZBXDsKAXW08AXdcjDMPUIXrsL8xROx39uiBwnxZBPAFQ9B3D2BI4rogcVpvN2JogVAG4MIuFgHr919VoNPxh2hmCQmaPeZ5/6ZbFCcBoNPL3B4NdMhR6AEZ/7mzb/gKOHobD4c+TjjRNE0Ik+ZbA8c2x1rKOP1Yq326m02l9rD0BcOBomvmE59kXi2o7616WlWuxmIiy/ed3OgOnYRiSxLLK/wAURWFEUdTnAhqNRjQSiRy1Wq00CA9OA6lUFCmZFOWmpq1HOO5wZonQzzJEkRVFTVXVW9DA914g7bZxYWWF3jMMI8qybHPSZuYUoWaD6Njo9Z6yNP3cDaKq5u3lZeoNZM9IkmROa+eOqWVZOzCKXZIkn7kBdL13LxAgtoNBYmuWbi4AxvNnrVa7nEwmj9wApVKJ2NjY1P1+LHQqAJRpNDkNbhA37dwMpo2ggTdomn6HQP1+/z5FUa/GUKSFbwICsj31oFAo4Pl83oKNicHDu8uy1Ouh43z/ur9/LpvNQvXsPRzHz5um+QiW4C70yoAVfiaRSLQ9AZAInn2RIPAr4OwAepFLpVKDSWNU+4u5XBFWxSUAHALw7Kwy/gYs3/8SzCPghAAAAABJRU5ErkJggg==") !important;
    background-repeat: no-repeat;
    height: 17px !important;
  }
  .my-tree-box >>> .el-scrollbar__wrap {
    overflow-x: hidden;
  }

  >>> .el-dropdown-menu__item {
    font-size: 12px;
  }

  .dropdownDiv{
    max-width:250px;
    text-align: left;
  }
</style>
