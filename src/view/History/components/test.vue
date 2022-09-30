<template>
  <div class="my-radio-box">
    <!-- <div class="my-radio-box-main">
      <el-radio-group v-model="tabPosition1" @change="changePage1">
        <el-radio-button v-for="(item,index) in list1" :label="index+1" :key="index">{{item.name}}</el-radio-button>
      </el-radio-group>
    </div>
    <template v-if="tabPosition1==2">
      <div class="my-phone-main">
        <div class="my-table-box">
          <el-row>
            <pending-information></pending-information>
          </el-row>
        </div>
      </div>
    </template> -->
    <!-- <template v-if="tabPosition1==1"> -->
    <div class="my-radio-box-main" style="text-align: left" >
      <el-radio-group v-model="tabPosition" @change="changePage">
        <el-radio-button v-for="(item,index) in list" :label="Number(item.label)" :key="index">{{item.name}}
        </el-radio-button>
      </el-radio-group>
<!--      <div style="position: absolute;right: 3%;top: 50%;transform: translateY(-50%);display: flex;align-items: center;cursor: pointer;" @click="manageVisible=!manageVisible">-->
<!--        <img :src="require('@/assets/icpImg/communicationManage.png')" style="width:1.3vw;" v-if="manageVisible">-->
<!--        <span style="font-size: 14px;color: #999999;line-height: 14px;margin-left: 4px;" v-if="manageVisible">管理</span>-->
<!--        <i class="el-icon-circle-check" style="font-size: 20px;color:rgba(0,145,255,1);" v-if="!manageVisible"></i>-->
<!--        <span style="font-size: 14px;color: #999999;line-height: 14px;margin-left: 4px;" v-if="!manageVisible">完成</span>-->
<!--      </div>-->
    </div>
    <div class="my-phone-main" v-if="tabPosition==1||tabPosition==2||tabPosition==3">
      <div class="my-tree-box" style="box-sizing: border-box;overflow: auto;">
        <div style="width: 100%;height: 65px;display: flex;border-bottom: 1px solid rgba(233,235,240,1);">
          <!-- <div :style="{width: '100%',display: 'flex','align-items': 'center','margin-left':'11%',cursor: 'pointer',color:tabPosition==2?'rgba(0,145,255,1)':'rgba(153,153,153,1)'}" @click="tabPosition=2;getDataAl();">
            <i class="el-icon-star-off" style="width:0.91vw;"></i>
            <span style="font-size:12px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;margin-left:3px;">常用联系人</span>
          </div> -->
          <div :style="{width: '100%',display: 'flex','align-items': 'center','margin-left':'11%',cursor: 'pointer',color:tabPosition==3?'rgba(0,145,255,1)':'rgba(153,153,153,1)'}" @click="tabPosition=3;getRecentContactsTable();">
            <i class="el-icon-time" style="width:0.91vw;"></i>
            <span style="font-size:12px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;margin-left:3px;">最近联系人</span>
          </div>
<!--          <div :style="{width: '100%',display: 'flex','align-items': 'center','margin-left':'11%','margin-top': '-5%',cursor: 'pointer',color:tabPosition==3?'rgba(0,145,255,1)':'rgba(153,153,153,1)'}" @click="tabPosition=3;getDataRecent();">-->
<!--            <i class="el-icon-time" style="width:0.91vw;"></i>-->
<!--            <span style="font-size:12px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;margin-left:3px;">未分组联系人</span>-->
<!--          </div>-->
<!--          <div :style="{width: '100%',display: 'flex','align-items': 'center','margin-left':'11%','margin-top': '-5%',cursor: 'pointer',color:tabPosition==3?'rgba(0,145,255,1)':'rgba(153,153,153,1)'}" @click="tabPosition=3;getDataRecent();">-->
<!--            <i class="el-icon-time" style="width:0.91vw;"></i>-->
<!--            <span style="font-size:12px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;margin-left:3px;">全部联系人</span>-->
<!--          </div>-->
        </div>

        <el-scrollbar class="my-tree-scroll">
          <el-input
            placeholder="输入关键字进行搜索"
            v-model="formData1.filterTree" class="treeSearch" style="padding: 10px;box-sizing: border-box;">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="$refs.tree1.filter(formData1.filterTree)"></i>
          </el-input>
          <el-tree :data="formData1.treeData" v-loading="formData1.myLoading"
                   @node-click="handleNodeClick" node-key="id" ref="tree1" class="filter-tree" :filter-node-method="filterNode"
                   highlight-current :props="defaultProps" draggable
                   @node-drop="handleDrop"
                   :allow-drop="allowDrop"
                   :allow-drag="allowDrag"
                   show-checkbox
                   @check-change="handleCheckChange"></el-tree>
        </el-scrollbar>
        <treeBtn v-if="!manageVisible" @changeDialog="closeDialog" @refreshData="refreshData" :treeDataItem="formData1.treeDataItem"
                 :treeData="formData1.treeData" :formData="formData"></treeBtn>
        <!-- <el-alert title="温馨提示" type="info" description="可拖动修改同级分组排序" show-icon>
        </el-alert> -->
      </div>
      <div class="my-table-box" v-if="tabPosition==1" style="box-sizing: border-box;overflow: auto;">

        <btn-box v-if="!manageVisible" :btnArry="btnArry" v-bind="{
              add:{callback:addList},
              edit:{callback:handleEdit},
              del:{callback:handleDelete},
              sort:{callback:handleSort},
              download:{callback:handleExportContactor},
              document:{callback:handleExportm}
            }" :batchJoinIsShow="true" @handleBatchJoin="handleBatchJoin">
        </btn-box>
        <el-row class="my-table-box-search" style="margin:10px;">
          <el-col :span="14">
            <el-input
              placeholder="请输入姓名/单位/职位/号码1"
              class="searchInput"
              v-model="formData1.searchText"
              @input="handleSearch"
            ></el-input>
          </el-col>
          <el-col :span="10">
            <el-button type="primary" @click="handleSearch" style="margin-left:10px;">搜索</el-button>
          </el-col>
        </el-row>
        <el-table ref="singleTable" :data="formData1.tableData" highlight-current-row
                  :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
                  style="width:100%;height:600px;overflow: auto;" @row-dblclick="handleRowDbClick" @row-click="handleRowClick"
                  @select="selectedOne" @select-all="handleSelectionChange">
          <!-- <el-table-column type="index" width="50" :resizable="false" align="center"></el-table-column> -->
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column align="center" prop="name" show-overflow-tooltip :resizable="false" label="姓名"></el-table-column>
          <el-table-column align="center" prop="position" show-overflow-tooltip :resizable="false" label="职位"></el-table-column>
          <el-table-column align="center" prop="workUnit" show-overflow-tooltip :resizable="false" label="单位"></el-table-column>

<!--          <el-table-column align="center" prop="number" show-overflow-tooltip :resizable="false" label="联系号码">-->
<!--            <template slot-scope="scope" >-->
<!--              <div  v-if="scope.row.number">-->
<!--                <div v-if="scope.row.otherTel!=''||scope.row.officeTel!=''||scope.row.homeTel!=''||scope.row.otherTel2!=''" >-->
<!--                  <el-dropdown @command="handleCommand(scope.row)" placement="bottom" trigger="click"-->
<!--                               @visible-change="changeDropdown">-->
<!--                        <span class="el-dropdown-link">-->
<!--                          {{scope.row.number}}-->
<!--                          <i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
<!--                        </span>-->
<!--                    <el-dropdown-menu slot="dropdown">-->
<!--                      <el-dropdown-item command="a" v-if="scope.row.otherTel">-->
<!--                        <div @mouseover='elDropdownItem(1)' class="dropdownDiv">-->
<!--                          <span>手机2:  {{scope.row.otherTel}}</span>-->
<!--                          <span v-if="showSpanImg==1" style="display: inline-block;width:13px;padding-left: 30px">-->
<!--                                <img style="width: 100%;height: 100%" src="/static/img/icon/dailCall.png" />-->
<!--                              </span>-->
<!--                        </div>-->
<!--                      </el-dropdown-item>-->
<!--                      <el-dropdown-item command="b" v-if="scope.row.officeTel">-->
<!--                        <div @mouseover='elDropdownItem(2)' class="dropdownDiv" >-->
<!--                          <span>办公电话:  {{scope.row.officeTel}}</span>-->
<!--                          <span v-if="showSpanImg==2"  style="display: inline-block;width:13px;padding-left: 30px">-->
<!--                            <img style="width: 100%;height: 100%" src="/static/img/icon/dailCall.png" />-->
<!--                          </span>-->
<!--                        </div>-->
<!--                      </el-dropdown-item>-->
<!--                      <el-dropdown-item command="c" v-if="scope.row.homeTel">-->
<!--                        <div @mouseover='elDropdownItem(3)' class="dropdownDiv">-->
<!--                          <span> 应急电话:  {{scope.row.homeTel}}</span>-->
<!--                          <span v-if="showSpanImg==3" style="display: inline-block;width:13px;padding-left: 30px">-->
<!--                              <img style="width: 100%;height: 100%" src="/static/img/icon/dailCall.png" />-->
<!--                            </span>-->
<!--                        </div>-->
<!--                      </el-dropdown-item>-->
<!--                      <el-dropdown-item command="d" v-if="scope.row.otherTel2">-->
<!--                        <div @mouseover='elDropdownItem(4)' class="dropdownDiv">-->
<!--                          <span > 其他电话:  {{scope.row.otherTel2}}</span>-->
<!--                          <span v-if="showSpanImg==4" style="display: inline-block;width:13px;padding-left: 30px">-->
<!--                              <img style="width: 100%;height: 100%" src="/static/img/icon/dailCall.png" />-->
<!--                            </span>-->
<!--                        </div>-->
<!--                      </el-dropdown-item>-->
<!--                    </el-dropdown-menu>-->
<!--                  </el-dropdown>-->

<!--                </div>-->
<!--                <span v-else>{{scope.row.number}}</span>-->
<!--              </div>-->
<!--              <span v-else>{{scope.row.number}}</span>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column label="操作" width="250px" align="center">-->
<!--            <template slot-scope="scope">-->
<!--              <el-tooltip class="item" effect="dark" content="设为常用联系人" placement="top">-->
<!--                <i class="el-icon-star-on" @click="handSetToCommon(scope.row)" :style="{'font-size': '24px',cursor: 'pointer',color:scope.row.commonlyUsed==0?'#9FC8FE':'#FBC958'}"></i>-->
<!--              </el-tooltip>-->
<!--              <el-tooltip class="item" effect="dark" content="添加" placement="top">-->
<!--                <i class="el-icon-phone-outline" @click="addCallSms(scope.row)" style="font-size: 24px;margin-left: 1vw;color:#9FC8FE;cursor: pointer;"></i>-->
<!--              </el-tooltip>-->
<!--              &lt;!&ndash; <el-button type="primary" size="mini" @click="addCallSms(scope.row)">添加</el-button>-->
<!--              <el-button type="primary" size="mini" @click="handSetToCommon(scope.row)">设为常用</el-button> &ndash;&gt;-->
<!--            </template>-->
<!--          </el-table-column>-->
        </el-table>
        <el-row>
          <el-pagination class="pagination" background :page-size="formData1.pageSize" :page-sizes="[10,20,30,40]"
                         :total="formData1.total"
                         :current-page="formData1.currentPage"
                         @current-change="handCurrentChange"
                         @size-change="handSizeChange"
                         layout="total, prev, pager, next, sizes, jumper"></el-pagination>
        </el-row>
      </div>
      <div class="my-table-box" v-if="tabPosition==2" style="box-sizing: border-box;overflow: auto;">
        <!-- <btn-box
          :btnArry="btnArry1"
          v-bind="{
                            del:{callback:handleDelete},
                            edit:{callback:handleEdit},
                        }"
        ></btn-box> -->
        <el-row class="my-table-box-search" style="margin:10px;">
          <el-col :span="14">
            <el-input
              placeholder="请输入姓名/单位/职位/号码2"
              class="searchInput"
              v-model="formData2.searchText"
              @input="handleSearch"
            ></el-input>
          </el-col>
          <el-col :span="10">
            <el-button type="primary" @click="handleSearch" style="margin-left:10px;">搜索</el-button>
          </el-col>
        </el-row>
        <el-table
          ref="singleTable"
          :data="formData2.tableData"
          highlight-current-row
          :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
          style="height: 600px;width:100%;overflow: auto;"
          @row-dblclick="handleRowDbClick"
          @row-click="handleRowClick"
          @select="selectedOne"
          @select-all="handleSelectionChange"
        >
          <!-- <el-table-column type="index" width="50" show-overflow-tooltip  :resizable="false" align="center"></el-table-column> -->
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column align="center" prop="name" show-overflow-tooltip :resizable="false" label="姓名"></el-table-column>
          <el-table-column align="center" prop="position" show-overflow-tooltip :resizable="false" label="职位"></el-table-column>
          <el-table-column align="center" prop="workUnit" show-overflow-tooltip :resizable="false" label="单位"></el-table-column>
<!--          <el-table-column align="center" prop="number" show-overflow-tooltip :resizable="false" label="联系号码">-->
<!--            <template slot-scope="scope" >-->
<!--              <div  v-if="scope.row.number">-->
<!--                <div v-if="scope.row.otherTel!=''||scope.row.officeTel!=''||scope.row.homeTel!=''||scope.row.otherTel2!=''" >-->
<!--                  <el-dropdown @command="handleCommand(scope.row)" placement="bottom" trigger="click"-->
<!--                               @visible-change="changeDropdown">-->
<!--                    <span class="el-dropdown-link">-->
<!--                      {{scope.row.number}}-->
<!--                      <i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
<!--                    </span>-->
<!--                    <el-dropdown-menu slot="dropdown">-->
<!--                      <el-dropdown-item command="a" v-if="scope.row.otherTel">-->
<!--                        <div @mouseover='elDropdownItem(1)' class="dropdownDiv">-->
<!--                          <span>手机2:  {{scope.row.otherTel}}</span>-->
<!--                          <span v-if="showSpanImg==1" style="display: inline-block;width:13px;padding-left: 30px">-->
<!--                            <img style="width: 100%;height: 100%" src="/static/img/icon/dailCall.png" />-->
<!--                          </span>-->
<!--                        </div>-->
<!--                      </el-dropdown-item>-->
<!--                      <el-dropdown-item command="b" v-if="scope.row.officeTel">-->
<!--                        <div @mouseover='elDropdownItem(2)' class="dropdownDiv" >-->
<!--                          <span>办公电话:  {{scope.row.officeTel}}</span>-->
<!--                          <span v-if="showSpanImg==2"  style="display: inline-block;width:13px;padding-left: 30px">-->
<!--                            <img style="width: 100%;height: 100%" src="/static/img/icon/dailCall.png" />-->
<!--                          </span>-->
<!--                        </div>-->
<!--                      </el-dropdown-item>-->
<!--                      <el-dropdown-item command="c" v-if="scope.row.homeTel">-->
<!--                        <div @mouseover='elDropdownItem(3)' class="dropdownDiv">-->
<!--                          <span> 应急电话:  {{scope.row.homeTel}}</span>-->
<!--                          <span v-if="showSpanImg==3" style="display: inline-block;width:13px;padding-left: 30px">-->
<!--                              <img style="width: 100%;height: 100%" src="/static/img/icon/dailCall.png" />-->
<!--                            </span>-->
<!--                        </div>-->
<!--                      </el-dropdown-item>-->
<!--                      <el-dropdown-item command="d" v-if="scope.row.otherTel2">-->
<!--                        <div @mouseover='elDropdownItem(4)' class="dropdownDiv">-->
<!--                          <span > 其他电话:  {{scope.row.otherTel2}}</span>-->
<!--                          <span v-if="showSpanImg==4" style="display: inline-block;width:13px;padding-left: 30px">-->
<!--                              <img style="width: 100%;height: 100%" src="/static/img/icon/dailCall.png" />-->
<!--                            </span>-->
<!--                        </div>-->
<!--                      </el-dropdown-item>-->
<!--                    </el-dropdown-menu>-->
<!--                  </el-dropdown>-->

<!--                </div>-->
<!--                <span v-else>{{scope.row.number}}</span>-->
<!--              </div>-->
<!--              <span v-else>{{scope.row.number}}</span>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column label="操作" width="250px" align="center">-->
<!--            <template slot-scope="scope">-->
<!--              <el-tooltip class="item" effect="dark" content="编辑" placement="top">-->
<!--                <i class="el-icon-edit" style="font-size: 24px;color:#9FC8FE;cursor: pointer;" @click="formData2.rowData=scope.row;handleEdit();"></i>-->
<!--              </el-tooltip>-->
<!--              <el-tooltip class="item" effect="dark" content="设为常用联系人" placement="top">-->
<!--                <i class="el-icon-star-on" @click="formData2.rowData=scope.row;handleDelete();" :style="{'font-size': '24px',cursor: 'pointer','margin-left': '1vw',color:'#FBC958'}"></i>-->
<!--              </el-tooltip>-->
<!--              &lt;!&ndash; <el-button type="primary" size="mini" @click="addPhoneCall(scope.row)">添加</el-button>-->
<!--              <el-button type="primary" size="mini" @click="talkCall(scope.row)">拨号</el-button> &ndash;&gt;-->
<!--            </template>-->
<!--          </el-table-column>-->
        </el-table>
        <el-row>
          <el-pagination
            class="pagination"
            background
            :page-size="formData2.pageSize"
            :page-sizes="[10,20,30,40]"
            :total="formData2.total"
            :current-page="formData2.currentPage"
            @current-change="handCurrentChange"
            @size-change="handSizeChange"
            layout="total, prev, pager, next, sizes, jumper"
          ></el-pagination>
        </el-row>
      </div>
      <div class="my-table-box" v-if="tabPosition==3" style="box-sizing: border-box;overflow: auto;">
        <el-table
          ref="singleTable"
          :data="formData3.tableData"
          highlight-current-row
          :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
          style="width:100%;height: 600px;overflow: auto;"
          @row-click="handleRowClick"
          @select="selectedOne"
          @select-all="handleSelectionChange"
        >
<!--           <el-table-column type="index" width="50" show-overflow-tooltip  :resizable="false" align="center"></el-table-column>-->
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column   show-overflow-tooltip align="center"
                             v-for="(item,key) in tableColumn3" :key="key" :label="item.label" :prop="item.prop"
                             :width="item.width" :resizable="false"></el-table-column>
<!--          <el-table-column label="操作" width="250px" align="center">-->
<!--            <template slot-scope="scope">-->
<!--              <el-tooltip class="item" effect="dark" content="拨号" placement="top">-->
<!--                <i class="el-icon-phone-outline" @click="addPhoneCall(scope.row)" style="font-size: 24px;color:#9FC8FE;cursor: pointer;"></i>-->
<!--              </el-tooltip>-->
<!--              &lt;!&ndash; <el-button type="primary" size="mini" @click="addPhoneCall(scope.row)">添加</el-button>-->
<!--              <el-button type="primary" size="mini" @click="talkCall(scope.row)">拨号</el-button> &ndash;&gt;-->
<!--            </template>-->
<!--          </el-table-column>-->
        </el-table>
        <el-row>
          <el-pagination
            class="pagination"
            background
            :page-size="100"
            :total="formData3.total"
            :current-page="formData3.currentPage"
            layout="total, prev, pager, next, jumper"
          ></el-pagination>
        </el-row>
      </div>
    </div>
    <!--<div class="my-phone-main" v-else-if="tabPosition==2">
      <div class="my-table-box">
        <el-table ref="singleTable" :data="formData1.tableData" highlight-current-row
                  height="586px"
                  :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
                  style="width:100%;" @row-dblclick="handleRowDbClick" @row-click="handleRowClick">
          <el-table-column type="index" width="50" :resizable="false" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip align="center"
                           v-for="(item,key) in tableColumn" :key="key" :label="item.label" :prop="item.prop"
                           :width="item.width" :resizable="false"></el-table-column>
          <el-table-column label="操作" width="250px" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="addCallSms(scope.row)">添加</el-button>
              <el-button type="primary" size="mini" @click="handSetToCommon(scope.row)">设为常用</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-pagination class="pagination" background :page-size="formData1.pageSize" :page-sizes="[10,20,30,40]"
                         :total="formData1.total"
                         :current-page="formData1.currentPage"
                         @current-change="handCurrentChange"
                         @size-change="handSizeChange"
                         layout="total, prev, pager, next, sizes, jumper"></el-pagination>
        </el-row>
      </div>
    </div>-->
    <!-- <div class="my-phone-main" v-else-if="tabPosition==2">
      <div class="my-table-box">

        <btn-box :btnArry="btnArry1" v-bind="{
                        del:{callback:handleDelete},
                        edit:{callback:handleEdit},
                     }">
        </btn-box>
        <el-row class="my-table-box-search" style="margin:0 0 10px 8px;">
          <el-col :span="14">
            <el-input
              placeholder="请输入姓名/单位/职位/号码"
              class="searchInput"
              v-model="formData2.searchText"
              @input="handleSearch"
            ></el-input>
          </el-col>
          <el-col :span="10">
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </el-col>

        </el-row>
        <el-table ref="singleTable" :data="formData2.tableData" highlight-current-row
                  :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
                  style="width:100%;height:600px;overflow: auto;" @row-dblclick="handleRowDbClick" @row-click="handleRowClick">
          <el-table-column type="index" width="50" :resizable="false" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip align="center"
                           v-for="(item,key) in tableColumn" :key="key" :label="item.label" :prop="item.prop"
                           :width="item.width" :resizable="false"></el-table-column>
          <el-table-column label="操作" width="250px" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="addCallSms(scope.row)">添加</el-button>

            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-pagination class="pagination" background :page-size="formData2.pageSize" :page-sizes="[10,20,30,40]"
                         :total="formData2.total"
                         :current-page="formData2.currentPage"
                         @current-change="handCurrentChange"
                         @size-change="handSizeChange"
                         layout="total, prev, pager, next, sizes, jumper"></el-pagination>
        </el-row>
      </div>
    </div> -->

    <div class="my-phone-main" v-else-if="tabPosition==4">
      <div class="my-tree-box" style="box-sizing: border-box;overflow: auto;">
        <el-input
          placeholder="输入关键字进行搜索"
          v-model="formData4.filterTree" class="treeSearch" style="padding: 10px;box-sizing: border-box;">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="$refs.tree4.filter(formData4.filterTree)"></i>
        </el-input>
        <div style="max-height: 650px;overflow: auto;">
          <el-tree :accordion="true"
                   :filter-node-method="filterNode"
                   :default-expand-all="isExpand" :data="formData4.treeData" v-loading="formData4.myLoading"
                   @node-click="handleNodeClick" node-key="id" ref="tree4" highlight-current
                   :props="defaultProps"></el-tree>
        </div>

      </div>
      <div class="my-table-box" style="box-sizing: border-box;overflow: auto;">
        <el-row class="my-table-box-search" style="margin:10px;">
          <el-col :span="14">
            <el-input
              placeholder="请输入姓名/单位/职位/号码"
              class="searchInput"
              v-model="formData4.searchText"
              @input="handleSearch"
            ></el-input>
          </el-col>
          <el-col :span="10">
            <el-button type="primary" @click="handleSearch" style="margin-left:10px;">搜索</el-button>
          </el-col>

        </el-row>
        <el-table ref="singleTable" :data="formData4.tableData" highlight-current-row
                  :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
                  style="width:100%;height:600px;overflow: auto;" @row-dblclick="handleRowDbClick" @row-click="handleRowClick" @select="selectedOne" @select-all="handleSelectionChange">
          <!-- <el-table-column type="index" width="50" :resizable="false" align="center"></el-table-column> -->
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column show-overflow-tooltip align="center"
                           v-for="(item,key) in tableColumn" :key="key" :label="item.label" :prop="item.prop"
                           :width="item.width" :resizable="false"></el-table-column>
<!--          <el-table-column label="操作" width="250px" align="center">-->
<!--            <template slot-scope="scope">-->
<!--              <el-button type="primary" size="mini" @click="addCallSms(scope.row)">添加</el-button>-->
<!--              <el-button type="primary" size="mini" @click="handSetToCommon(scope.row)">设为常用</el-button>-->
<!--            </template>-->
<!--          </el-table-column>-->
        </el-table>
        <el-row>
          <el-pagination class="pagination" background :page-size="formData4.pageSize" :page-sizes="[10,20,30,40]"
                         :total="formData4.total"
                         :current-page="formData4.currentPage"
                         @current-change="handCurrentChange"
                         @size-change="handSizeChange"
                         layout="total, prev, pager, next, sizes, jumper"></el-pagination>
        </el-row>
      </div>
    </div>
    <div class="my-phone-main" v-else-if="tabPosition==5">
      <div class="my-tree-box" style="box-sizing: border-box;overflow: auto;">
        <el-scrollbar class="my-tree-scroll">
          <el-input
            placeholder="输入关键字进行搜索"
            v-model="formData5.filterTree" class="treeSearch" style="padding: 10px;box-sizing: border-box;">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="$refs.tree5.filter(formData5.filterTree)"></i>
          </el-input>
          <el-tree :data="formData5.treeData" v-loading="myLoading" @node-click="handleNodeClick" node-key="id"
                   ref="tree5" highlight-current :props="defaultProps"
                   draggable
                   @node-drop="handleDrop"
                   :allow-drop="allowDrop"
                   :allow-drag="allowDrag"
          ></el-tree>
        </el-scrollbar>
        <treeBtn v-if="!manageVisible" @changeDialog="closeDialog" @refreshData="refreshData" :treeDataItem="formData5.treeDataItem"
                 :treeData="formData5.treeData" :formData="treeBtnConfig"></treeBtn>
        <!-- <el-alert title="温馨提示" type="info" description="可拖动修改同级分组排序" show-icon>
        </el-alert> -->
      </div>
      <div class="my-table-box" style="box-sizing: border-box;overflow: auto;">
        <btn-box
          v-if="!manageVisible"
          :btnArry="btnArry"
          v-bind="{
                            add:{callback:addList},
                            edit:{callback:handleEdit},
                            del:{callback:handleDelete},
                            sort:{callback:handleSort},
                            download:{callback:handleExportContactor},
                            document:{callback:handleExportm}
                         }"
          :batchJoinIsShow="true"
          @handleBatchJoin="handleBatchJoin"
        ></btn-box>
        <el-row class="my-table-box-search" style="margin:10px;">
          <el-col :span="14">
            <el-input
              placeholder="请输入姓名/单位/职位/号码"
              class="searchInput"
              v-model="formData5.searchText"
              @input="handleSearch"
            ></el-input>
          </el-col>
          <el-col :span="10">
            <el-button type="primary" @click="handleSearch" style="margin-left:10px;">搜索</el-button>
          </el-col>
        </el-row>
        <el-table ref="singleTable" :data="formData5.tableData" highlight-current-row
                  :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
                  style="width:100%;height:600px;overflow: auto;" @row-dblclick="handleRowDbClick" @row-click="handleRowClick"
                  @select="selectedOne" @select-all="handleSelectionChange">>
          <!-- <el-table-column type="index" width="50" :resizable="false" align="center"></el-table-column> -->
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column show-overflow-tooltip align="center"
                           v-for="(item,key) in tableColumn" :key="key" :label="item.label" :prop="item.prop"
                           :width="item.width" :resizable="false"></el-table-column>
<!--          <el-table-column label="操作" width="250px" align="center">-->
<!--            <template slot-scope="scope">-->
<!--              <el-button type="primary" size="mini" @click="addCallSms(scope.row)">添加</el-button>-->
<!--              <el-button type="primary" size="mini" @click="handSetToCommon(scope.row)">设为常用</el-button>-->
<!--            </template>-->
<!--          </el-table-column>-->
        </el-table>
        <el-row>
          <el-pagination class="pagination" background :page-size="formData5.pageSize" :page-sizes="[10,20,30,40]"
                         :total="formData5.total"
                         :current-page="formData5.currentPage"
                         @current-change="handCurrentChange"
                         @size-change="handSizeChange"
                         layout="total, prev, pager, next, sizes, jumper"></el-pagination>
        </el-row>
      </div>
    </div>
    <div class="my-phone-main" v-else-if="tabPosition==6">
      <div class="my-tree-box" style="box-sizing: border-box;overflow: auto;">
        <el-scrollbar class="my-tree-scroll">
          <el-input
            placeholder="输入关键字进行搜索"
            v-model="formData6.filterTree" class="treeSearch" style="padding: 10px;box-sizing: border-box;">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="$refs.tree6.filter(formData6.filterTree)"></i>
          </el-input>
          <el-tree :data="formData6.treeData" v-loading="myLoading" @node-click="handleNodeClick" node-key="id"
                   ref="tree6" highlight-current :props="defaultProps"
                   draggable
                   @node-drop="handleDrop"
                   :allow-drop="allowDrop"
                   :allow-drag="allowDrag"
          ></el-tree>
        </el-scrollbar>
        <treeBtn v-if="!manageVisible" @changeDialog="closeDialog" @refreshData="refreshData" :treeDataItem="formData6.treeDataItem"
                 :treeData="formData6.treeData" :formData="treeBtnConfig1"></treeBtn>
        <!-- <el-alert title="温馨提示" type="info" description="可拖动修改同级分组排序" show-icon>
        </el-alert> -->
      </div>
      <div class="my-table-box" style="box-sizing: border-box;overflow: auto;">
        <btn-box
          v-if="!manageVisible"
          :btnArry="btnArry"
          v-bind="{
                            add:{callback:addList},
                            edit:{callback:handleEdit},
                            del:{callback:handleDelete},
                            sort:{callback:handleSort},
                            download:{callback:handleExportContactor},
                            document:{callback:handleExportm}
                         }"
          :batchJoinIsShow="true"
          @handleBatchJoin="handleBatchJoin"
        ></btn-box>
        <el-row class="my-table-box-search" style="margin:10px;">
          <el-col :span="14">
            <el-input
              placeholder="请输入姓名/单位/职位/号码"
              class="searchInput"
              v-model="formData6.searchText"
              @input="handleSearch"
            ></el-input>
          </el-col>
          <el-col :span="10">
            <el-button type="primary" @click="handleSearch" style="margin-left:10px;">搜索</el-button>
          </el-col>
        </el-row>
        <el-table ref="singleTable" :data="formData6.tableData" highlight-current-row
                  :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
                  style="width:100%;height:600px;overflow: auto;" @row-dblclick="handleRowDbClick" @row-click="handleRowClick"
                  @select="selectedOne" @select-all="handleSelectionChange">
          <!-- <el-table-column type="index" width="50" :resizable="false" align="center"></el-table-column> -->
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column show-overflow-tooltip align="center"
                           v-for="(item,key) in tableColumn" :key="key" :label="item.label" :prop="item.prop"
                           :width="item.width" :resizable="false"></el-table-column>
<!--          <el-table-column label="操作" width="250px" align="center">-->
<!--            <template slot-scope="scope">-->
<!--              <el-button type="primary" size="mini" @click="addCallSms(scope.row)">添加</el-button>-->
<!--              <el-button type="primary" size="mini" @click="handSetToCommon(scope.row)">设为常用</el-button>-->
<!--            </template>-->
<!--          </el-table-column>-->
        </el-table>
        <el-row>
          <el-pagination class="pagination" background :page-size="formData6.pageSize" :page-sizes="[10,20,30,40]"
                         :total="formData6.total"
                         :current-page="formData6.currentPage"
                         @current-change="handCurrentChange"
                         @size-change="handSizeChange"
                         layout="total, prev, pager, next, sizes, jumper"></el-pagination>
        </el-row>
      </div>
    </div>
    <div class="my-phone-main" v-if="tabPosition==7">
      <div class="my-tree-box" style="box-sizing: border-box;overflow: auto;">
        <el-scrollbar class="my-tree-scroll">
          <el-input
            placeholder="输入关键字进行搜索"
            v-model="formData7.filterTree" class="treeSearch" style="padding: 10px;box-sizing: border-box;">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="$refs.tree7.filter(formData7.filterTree)"></i>
          </el-input>
          <el-tree :data="formData7.treeData" v-loading="formData7.myLoading" @node-click="handleNodeClick"
                   node-key="id" ref="tree7" highlight-current :props="defaultProps"></el-tree>
        </el-scrollbar>
        <treeBtn v-if="!manageVisible" @changeDialog="closeDialog" @refreshData="refreshData" :treeDataItem="formData7.treeDataItem"
                 :treeData="formData7.treeData" :formData="code"></treeBtn>
      </div>
      <div class="my-table-box" style="box-sizing: border-box;overflow: auto;">

        <btn-box v-if="!manageVisible" :btnArry="btnArry" v-bind="{
                            add:{callback:addList},
                            edit:{callback:handleEdit},
                            del:{callback:handleDelete},
                            sort:{callback:handleSort},
                            download:{callback:handleExportContactor},
                            document:{callback:handleExportm}
                         }" :batchJoinIsShow="true" @handleBatchJoin="handleBatchJoin">
        </btn-box>
        <el-row class="my-table-box-search" style="margin:10px;">
          <el-col :span="14">
            <el-input
              placeholder="请输入姓名/单位/职位/号码"
              class="searchInput"
              v-model="formData7.searchText"
              @input="handleSearch"
            ></el-input>
          </el-col>
          <el-col :span="10">
            <el-button type="primary" @click="handleSearch" style="margin-left:10px;">搜索</el-button>
          </el-col>

        </el-row>
        <el-table ref="singleTable" :data="formData7.tableData" highlight-current-row
                  :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
                  style="width:100%;height:600px;overflow: auto;" @row-dblclick="handleRowDbClick" @row-click="handleRowClick"
                  @select="selectedOne" @select-all="handleSelectionChange">
          <!-- <el-table-column type="index" width="50" :resizable="false" align="center"></el-table-column> -->
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column show-overflow-tooltip align="center"
                           v-for="(item,key) in tableColumn" :key="key" :label="item.label" :prop="item.prop"
                           :width="item.width" :resizable="false"></el-table-column>
<!--          <el-table-column label="操作" width="250px" align="center">-->
<!--            <template slot-scope="scope">-->
<!--              <el-button type="primary" size="mini" @click="addCallSms(scope.row)">添加</el-button>-->
<!--              <el-button type="primary" size="mini" @click="handSetToCommon(scope.row)">设为常用</el-button>-->
<!--            </template>-->
<!--          </el-table-column>-->
        </el-table>
        <el-row>
          <el-pagination class="pagination" background :page-size="formData7.pageSize" :page-sizes="[10,20,30,40]"
                         :total="formData7.total"
                         :current-page="formData7.currentPage"
                         @current-change="handCurrentChange"
                         @size-change="handSizeChange"
                         layout="total, prev, pager, next, sizes, jumper"></el-pagination>
        </el-row>
      </div>
    </div>
    <div class="my-phone-main" v-else-if="tabPosition==8">
      <div class="my-tree-box" style="box-sizing: border-box;overflow: auto;">

        <el-scrollbar class="my-tree-scroll">
          <el-input
            placeholder="输入关键字进行搜索"
            v-model="formData8.filterTree" class="treeSearch" style="padding: 10px;box-sizing: border-box;">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="$refs.tree8.filter(formData8.filterTree)"></i>
          </el-input>
          <el-tree :data="formData8.treeData" v-loading="formData8.myLoading" @node-click="handleNodeClick"
                   node-key="id" ref="tree8" highlight-current :props="defaultProps"></el-tree>
        </el-scrollbar>
        <treeBtn v-if="!manageVisible" @changeDialog="closeDialog" @refreshData="refreshData" :treeDataItem="formData8.treeDataItem"
                 :treeData="formData8.treeData" :formData="formDataTree"></treeBtn>
      </div>
      <div class="my-table-box" style="box-sizing: border-box;overflow: auto;">
        <btn-box  v-if="!manageVisible" :btnArry="btnArry1" v-bind="{
              del:{callback:handleDelete},
              edit:{callback:handleEdit},
            }">
        </btn-box>
        <el-row class="my-table-box-search" style="margin:10px;">
          <el-col :span="14">
            <el-input
              placeholder="请输入姓名/单位/职位/号码"
              class="searchInput"
              v-model="formData8.searchText"
              @input="handleSearch"
            ></el-input>
          </el-col>
          <el-col :span="10">
            <el-button type="primary" @click="handleSearch" style="margin-left:10px;">搜索</el-button>
          </el-col>

        </el-row>
        <el-table ref="singleTable" :data="formData8.tableData" highlight-current-row
                  :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
                  style="height: 600px;width:100%;overflow: auto;" @row-click="handleRowClick"
                  @select="selectedOne"
                  @select-all="handleSelectionChange">
          <!-- <el-table-column type="index" width="50" :resizable="false" align="center"></el-table-column> -->
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column show-overflow-tooltip align="center"
                           v-for="(item,key) in tableColumn3" :key="key" :label="item.label" :prop="item.prop"
                           :width="item.width" :resizable="false"></el-table-column>
<!--          <el-table-column label="操作" width="250px" align="center">-->
<!--            <template slot-scope="scope">-->
<!--              <el-button type="primary" size="mini" @click="addCallSms(scope.row)">添加</el-button>-->

<!--            </template>-->
<!--          </el-table-column>-->
        </el-table>
        <el-row>
          <el-pagination class="pagination" background :page-size="100" :total="formData8.total"
                         :current-page="formData8.currentPage" layout="total, prev, pager, next, jumper"></el-pagination>
        </el-row>
      </div>
    </div>

    <!--<div class="my-radio-box-main" style="margin-top:10px;">
      <el-radio-group v-model="tabPosition" @change="changePage">
        <el-radio-button v-for="(item,index) in list" :label="index+1" :key="index">{{item.name}}</el-radio-button>
      </el-radio-group>
    </div>-->
    <!-- <div class="my-phone-main" v-if="tabPosition==1">
      &lt;!&ndash; <div class="my-tree-box">
         <treeBtn @changeDialog="closeDialog" @refreshData="refreshData" :treeDataItem="formData1.treeDataItem"
                  :treeData="formData1.treeData" :formData="formData"></treeBtn>
         <el-scrollbar class="my-tree-scroll">
           <el-tree :data="formData1.treeData" v-loading="formData1.myLoading"
                    @node-click="handleNodeClick" node-key="id" ref="tree"
                    highlight-current :props="defaultProps"

           ></el-tree>
         </el-scrollbar>
         <el-alert title="温馨提示" type="info" description="可拖动修改同级分组排序" show-icon>
         </el-alert>
       </div>&ndash;&gt;
     </div>-->
    <!-- </template> -->
    <!-- <template v-if="tabPosition1==3">
      <urgent-information></urgent-information>
    </template> -->


    <!--联系人弹窗-->
    <contact-details-popup ref="ContactDetailsPopup" @getContactorList="refreshTable"></contact-details-popup>
    <contact-sorting-popup ref="ContactSortingPopup" @getContactorList="getContactorList"></contact-sorting-popup>


  </div>
</template>

<script>
  import mixin from '../../integratedCommunication/icpPhone/icpPhonePage/mixin.js';
  import treeBtn from '@/components/phoneNew/treeBtn';
  import btnBox from '@/components/phoneNew/btnBox';
  import ContactDetailsPopup from "@/view/integratedCommunication/contactDetailsPopup";
  import ContactSortingPopup from "@/view/integratedCommunication/contactSortingPopup";
  import PendingInformation from '@/view/integratedCommunication/icpSms/pendingInformation/pendingInformation';
  import UrgentInformation from '@/view/integratedCommunication/icpSms/urgentInformation/urgentInformation';
  import mixin2 from '@/view/yangZhouEventReports/assets/js/mixin/mixin.js';

  import { mapState } from 'vuex'

  export default {
    mixins: [mixin, mixin2],
    components: {
      treeBtn,
      btnBox,
      ContactDetailsPopup,
      ContactSortingPopup,
      PendingInformation,
      UrgentInformation,
    },
    data() {
      return {
        manageVisible:true, //图标管理功能切换
        showSpanImg:0,
        tabName: '政务联络网', // 标签名称
        formData1: {//政务联络网
          searchText: '',//搜索
          currentPage: 1,
          total: 0,//数据总数
          pageSize: 10,//总页数
          rowData: null,//表格选择数据
          tableData: [],//表格数据
          treeData: [],
          groupId: 0,//分组id
          myLoading: false,
          filterTree:'', //树状列表输入框过滤
          multipleSelection:[] //列表勾选的选项
        },
        formData2: {//常用联系人
          searchText: '',//搜索
          currentPage: 1,
          total: 0,//数据总数
          pageSize: 10,//总页数
          rowData: null,//表格选择数据
          tableData: [],//表格数据
          treeData: [],
          groupId: 0,//分组id
          myLoading: false,
          filterTree:'', //树状列表输入框过滤
          multipleSelection:[] //列表勾选的选项
        },
        formData3: {//最近联系人
          searchText: '',//搜索
          currentPage: 1,
          total: 0,//数据总数
          pageSize: 20,//总页数
          rowData: null,//表格选择数据
          tableData: [],//表格数据
          treeData: [],
          groupId: 0,//分组id
          myLoading: false,
          filterTree:'', //树状列表输入框过滤
          multipleSelection:[] //列表勾选的选项
        },
        formData4: {//应急联动网
          searchText: '',//搜索
          currentPage: 1,
          total: 0,//数据总数
          pageSize: 10,//总页数
          rowData: null,//表格选择数据
          tableData: [],//表格数据
          myLoading: false,
          treeData: [],
          treeDataItem: {},
          filterTree:'', //树状列表输入框过滤
          multipleSelection:[] //列表勾选的选项
        },
        formData5: {//基层联络网
          searchText: '',//搜索
          currentPage: 1,
          total: 0,//数据总数
          pageSize: 10,//总页数
          rowData: null,//表格选择数据
          tableData: [],//表格数据
          myLoading: false,
          treeData: [],
          treeDataItem: {},
          filterTree:'', //树状列表输入框过滤
          multipleSelection:[] //列表勾选的选项
        },
        formData6: {//备勤联络网
          searchText: '',//搜索
          currentPage: 1,
          total: 0,//数据总数
          pageSize: 10,//总页数
          rowData: null,//表格选择数据
          tableData: [],//表格数据
          myLoading: false,
          treeData: [],
          treeDataItem: {},
          filterTree:'', //树状列表输入框过滤
          multipleSelection:[] //列表勾选的选项
        },
        formData7: {//资源联络网
          searchText: '',//搜索
          currentPage: 1,
          total: 0,//数据总数
          pageSize: 10,//总页数
          rowData: null,//表格选择数据
          tableData: [],//表格数据
          treeData: [],
          groupId: 0,//分组id
          myLoading: false,
          filterTree:'', //树状列表输入框过滤
          multipleSelection:[] //列表勾选的选项
        },
        formData8: {//短信分组
          searchText: '',//搜索
          currentPage: 1,
          total: 0,//数据总数
          pageSize: 10,//总页数
          rowData: null,//表格选择数据
          tableData: [],//表格数据
          treeData: [],
          groupId: 0,//分组id
          myLoading: false,
          filterTree:'', //树状列表输入框过滤
          multipleSelection:[] //列表勾选的选项
        },
        filterText: '',
        searchText: '',
        rowData: [],//行表格数据
        btnArry: [
          {
            event: 'add',
            icon: 'el-icon-plus',
            title: '新增'
          }, {
            event: 'edit',
            icon: 'el-icon-edit',
            title: '修改'
          }, {
            event: 'del',
            icon: 'el-icon-delete',
            title: '删除'
          }, {
            event: 'document',
            icon: 'el-icon-document',
            title: '模板'
          }, {
            event: 'download',
            icon: 'el-icon-download',
            title: '导出'

          }, {
            event: 'sort',
            icon: 'el-icon-sort',
            title: '排序'
          }],
        btnArry1: [
          {
            event: 'edit',
            icon: 'el-icon-edit',
            title: '修改'
          }, {
            event: 'del',
            icon: 'el-icon-delete',
            title: '删除'
          }],
        dialogVisible: true,
        formData: {
          pid: 0,
          code: 'phone',
          ref: 'sms',
          name: '政务联络网',
        },
        code: {
          pid: 0,
          code: 'resource',
          ref: 'sms',
          name: '资源联络网',
        },
        formDataTree: {
          pid: 0,
          code: 'sms',
          ref: 'sms',
          name: '短信分组',
        },
        treeBtnConfig: {
          pid: 0,
          code: 'gliaison',
          ref: 'sms',
          name: '基层联络网',
        },
        treeBtnConfig1: {
          pid: 0,
          code: 'dutyGroup',
          ref: 'sms',
          name: '备勤联络网',
        },
        treeDataItem: {},
        currentPage: 1,//当前页数
        groupId: -1,//分组id
        defaultProps: {
          children: 'children',
          label: 'name',
          plusIcon: true,
        },
        myLoading: false,
        treeData: [],//电话分组
        list: [
          {//按钮切换
            name: '政务联络网',
            label: '1'
          },
          // {
          //   name: '常用联系人',
          //   label: '2'
          // }, {
          //   name: '最近联系人',
          //   label: '3'
          // },
          {
            name: '应急联动网',
            label: '4'
          }, {
            name: '基层联络网',
            label: '5'
          }, {
            name: '备勤联络网',
            label: '6'
          }, {
            name: '资源联络网',
            label: '7'
          },
          {
            name: '短信分组',
            label: '8'
          }],

        tableColumn: [
          {
            prop: "name",
            label: "姓名"
          }, {
            prop: "position",
            label: "职位"
          }, {
            prop: "workUnit",
            label: "单位"
          },

        ],//表头
        tableColumn1: [
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
        tableColumn3: [
          {
            prop: "name",
            label: "姓名"
          }, {
            prop: "position",
            label: "职位"
          }, {
            prop: "workUnit",
            label: "单位"
          },
          // {
          //   prop: "mobile",
          //   label: "联系号码"
          // }
        ],//表头
        tabPosition: 1,
        tableData: [],//表格数据
        total: 0,//数据总数
        pageSize: 10,//总页数
        isExpand: false,
        tabPosition1: 1,
        list1: [
          {
            name: "信息发送",
            label: "1"
          },
          {
            name: "待发信息",
            label: "2"
          },
          {
            name: "催报信息",
            label: "3"
          }
        ]
      }
    },
    created() {
      this.getPhoneGroupingTree();
      // this.$store.commit('getMsgContactsUpdate', false)
      // console.log(this.$store.state.msgContactsUpdate);
      // console.log(this.$store.state.faxContactsUpdate);
    },
    beforeDestroy() {
      sessionStorage.removeItem('store')
    },
    watch: {
      filterText(val) {
        if (val == '' || val == null || val == undefined) {
          this.$refs.tree1.filter(val);
        }
      },
      /*'$store.state.msgContactsUpdate': {
        deep: true,
        handler: function(newVal, oldVal) {
          console.log(newVal, oldVal)
        }
      },*/
      handleMsgContactsUpdate(newVal, oldVal) {
        console.log(newVal, oldVal)
        if (newVal) {
          console.log('联系人更新')
          this.getContactorList()
          this.$store.commit('getMsgContactsUpdate', false) // 重置更新状态为false
        } else {
          console.log('newVal == false');
          console.log(this.$store.state.msgContactsUpdate);
        }
      }

    },
    // computed:mapState({
    //   // handleMsgContactsUpdate: 'isMsgContactsUpdate' // 处理信息联系人更新
    //   handleMsgContactsUpdate: state => state.isMsgContactsUpdate // 处理信息联系人更新
    // }),

    computed: {
      handleMsgContactsUpdate() {
        console.log(this.$store.state.msgContactsUpdate);
        return this.$store.state.msgContactsUpdate
      }
    },

    methods: {
      handleCheckChange(data, checked, indeterminate) {
        console.log('树状分组选中了什么',data, checked, indeterminate);
      },
      selectedOne(val){
        console.log('列表选中了什么111',val)
        console.log(this['formData' + this.tabPosition].multipleSelection,this['formData' + this.tabPosition].multipleSelection)

        if(this['formData' + this.tabPosition].multipleSelection.length <=val.length){
          let selectedVal = val[val.length-1]
          if(selectedVal.number||selectedVal.call){
                this.$refs.singleTable.toggleRowSelection(selectedVal)
                this.$message.warning("当前联系人电话为空")
              }else{
                this.$emit('findfaxDataS', selectedVal);
                this['formData' + this.tabPosition].multipleSelection = val
              }
        }

      },
      handleSelectionChange(val) {
        console.log('列表选中了什么',val)
        // console.log(this['formData' + this.tabPosition].multipleSelection)

        // this.$bus.$emit('clearNumber')

        this['formData' + this.tabPosition].multipleSelection=val
        let flag = false
        val.forEach(item=>{
          if(item.number||item.call){
            this.$refs.singleTable.toggleRowSelection(item)
            flag = true
          }else{
            this.$emit('findfaxDataS', item);
          }
          // !(item.number||item.call) ? this.$message.warning("当前联系人电话为空") : this.$emit('findfaxDataS', item);
        })
        if(flag) this.$message.warning("当前联系人电话为空")

      },
      elDropdownItem(key) {
        if(key==1){
          this.showSpanImg=1
        }
        if(key==2){
          this.showSpanImg=2
        }
        if(key==3){
          this.showSpanImg=3
        }
        if(key==4){
          this.showSpanImg=4
        }

      },
      changeDropdown() {
        this.showSpanImg=0
      },
      handleCommand(row) { // 1>=手机2 row.otherTel  2>=办公电话 row.officeTel  3>=应急电话 row.homeTel 4>=其他电话 row.otherTel2
        let index=this.showSpanImg
        let number
        switch (index) {
          case 1:
            number = row.otherTel;
            break;
          case 2:
            number = row.officeTel;
            break;
          case 3:
            number = row.homeTel;
            break;
          case 4:
            number = row.otherTel2;
            break;
          default:
            number = '';
            break;
        }
        // if(['',null].includes(number)){
        //   return
        // }
        this.$confirm('确认拨出该号码？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          // this.$message({
          //   type: 'success',
          //   message: '确定!'
          // });

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
        console.log(number)
      },
      getRecentContactsTable(){
        //获取最近联系人
        this.$api.getRecentContactorList().then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              error: "error"
            });
            return;
          }
          this.formData3.tableData = res.data.data || [];
          this.formData3.total = res.data.totalElements;
        });
      },
      changePage1() {
        if (this.tabPosition1 == 2) {
          this.myData2 = {
            rowData: null,
            myLoading: false,
            tableData: [], //表格数据
            tableData1: [], //表格数据
            total: 0, //数据总数
            pageSize: 10 //总页数
          };
          // this.getTableData();
        }
      },
      gliaisonGroupList() {
        let data = {
          displayDefault: true
        };
        this.$api.gliaisonGroupList(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          this.formData5.treeData = res.data || [];
        })
      },
      dutyGroupList() {
        let data = {
          displayDefault: true
        };
        this.$api.dutyGroupList(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          this.formData6.treeData = res.data || [];
        })
      },
      addCallSms(row) {
        !row.mobile ? this.$message.warning("当前联系人电话为空") : this.$emit('findfaxDataS', row);
        // console.log(row)
      },
      refreshTable() {
        if (this.tabPosition == 1 || this.tabPosition == 7) {
          this.getContactorList();
        } else if (this.tabPosition == 2) {
          this.getDataAl();
        } else if (this.tabPosition == 3) {
          this.getRecentContactsTable()
        } else if (this.tabPosition == 5) {
          this.getContactorList();
        } else if (this.tabPosition == 6) {
          this.getContactorList();
        }
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      filterTexts() {
        this.$refs.tree1.filter(this.filterText);
      },
      changePage(){
        console.log(this.tabPosition);
        if(this.tabPosition==2){
          this.formData2 ={//常用联系人
            searchText:'',//搜索
            currentPage:1,
            total: 0,//数据总数
            pageSize: 10,//总页数
            rowData:null,//表格选择数据
            tableData: [],//表格数据
          };
          this.getDataAl();
          this.tabName = '常用联系人'
        }else if(this.tabPosition==3){
          this.getRecentContactsTable()
          this.tabName = '最近联系人'
        }else if(this.tabPosition==8){
          this.formData8 ={//短信分组
            searchText:'',//搜索
            currentPage:1,
            total: 0,//数据总数
            pageSize: 10,//总页数
            rowData:null,//表格选择数据
            tableData: [],//表格数据
            treeData:[],
            myLoading:false,
            groupId: 0,//分组id
          };
          this.getSmsGroupListTree(8);
          this.getDataRecent(3);
          this.tabName = '短信分组'
        }else if(this.tabPosition==4){
          this.formData4 = {//应急联动网
            searchText:'',//搜索
            currentPage:1,
            total: 0,//数据总数
            pageSize: 10,//总页数
            rowData:null,//表格选择数据
            tableData: [],//表格数据
            myLoading:false,
            treeData:[],
            treeDataItem:{},
          }
          this.filterText ='';
          this.getEmergencyAddressBookTree()
          this.tabName = '应急联动网'
        }else if(this.tabPosition==5){
          this.formData5 = {//基层联络
            searchText:'',//搜索
            currentPage:1,
            total: 0,//数据总数
            pageSize: 10,//总页数
            rowData:null,//表格选择数据
            tableData: [],//表格数据
            myLoading:false,
            treeData:[],
            treeDataItem:{},
          };
          this.gliaisonGroupList();
          this.tabName = '基层联络网'
        }else if(this.tabPosition==6){
          this.formData6 = {//备勤联络网
            searchText:'',//搜索
            currentPage:1,
            total: 0,//数据总数
            pageSize: 10,//总页数
            rowData:null,//表格选择数据
            tableData: [],//表格数据
            myLoading:false,
            treeData:[],
            treeDataItem:{},
          };
          this.dutyGroupList();
          this.tabName = '备勤联络网'

        }else if(this.tabPosition==7){
          this.formData7 = {//资源联络网
            searchText:'',//搜索
            currentPage:1,
            total: 0,//数据总数
            pageSize: 10,//总页数
            rowData:null,//表格选择数据
            tableData: [],//表格数据
            myLoading:false,
            treeData:[],
            treeDataItem:{},
          };
          this.getResourceGroupingTree(7);
          this.tabName = '资源联络网'
        } else if(this.tabPosition === 1) {
          this.tabName = '政务联络网'
        }
      },
      handleSearch() {//搜索
        this['formData' + this.tabPosition].currentPage = 1//点击搜索就从0页开始查询
        if (this.tabPosition == 1) {
          this.getContactorList();
        } else if (this.tabPosition == 2) {
          this.getDataAl()
        } else if(this.tabPosition == 3){
          this.getRecentContactsTable()
        } else if (this.tabPosition == 8) {
          this.getDataRecent(3);
        } else if (this.tabPosition == 4) {
          this.getEmergencyAddressData()
        } else if (this.tabPosition == 5) {
          this.getContactorList();
        } else if (this.tabPosition == 6) {
          this.getContactorList();
        } else if (this.tabPosition == 7) {
          this.getContactorList();
        }

      },
      addList() {//新增
        this.$nextTick(() => {
          this.$refs.ContactDetailsPopup.isDialogVisible = true;
          this.$refs.ContactDetailsPopup.title = "新增联系人";
          this.$refs.ContactDetailsPopup.getTree(this.tabPosition, this.groupId, this.tabName);
        });
      }
      ,
      //修改方法
      handleEdit() {

        if (this['formData' + this.tabPosition].rowData == "" || this['formData' + this.tabPosition].rowData == null) {
          this.$message({
            message: "请选中表格中任意行或双击任意行进行修改!",
            type: "warning"
          });
          return;
        } else {
          this.handleRowDbClick(this['formData' + this.tabPosition].rowData);
        }

      },
      handleBatchJoin() {
        let groupId = this['formData' + this.tabPosition].groupId
        if (this.tabPosition == 1) {//政务联络网
          this.$store.commit('setGroupType', 'governmentAffairs');
          if (groupId == '' || groupId == null) {
            groupId = 0
          }
          this.$store.commit('setGroupId', groupId);
        }
        if (this.tabPosition == 7) {//资源联络网
          this.$store.commit('setGroupType', 'resource');
          if (groupId == '' || groupId == null) {
            groupId = 0
          }
          this.$store.commit('setGroupId', groupId);

        }
        if (this.tabPosition == 5) {//基层联络网
          this.$store.commit('setGroupType', 'primaryLevel');
          if (groupId == '' || groupId == null) {
            groupId = 0
          }
          this.$store.commit('setGroupId', groupId);
        }
        if (this.tabPosition == 6) {//备勤联络网
          this.$store.commit('setGroupType', 'spareTime');
          if (groupId == '' || groupId == null) {
            groupId = 0
          }
          this.$store.commit('setGroupId', groupId);
        }
      },
      handleNodeClick(data, node) {
        if(this.tabPosition==2||this.tabPosition==3){
          this.tabPosition=1
        }
        this['formData' + this.tabPosition].currentPage = 1;//跳转到第一页
        this['formData' + this.tabPosition].groupId = data.id;
        this['formData' + this.tabPosition].searchText = "";
        this['formData' + this.tabPosition].treeDataItem = {
          groupId: data.id,
          currentGroupName: data.name
        }
        if (this.tabPosition == 1) {
          this.getContactorList()
        } else if (this.tabPosition == 4) {
          //如果没有父级节点，则查应急通讯录
          if (node.parent != null && node.parent.parent != null) {
            this['formData' + this.tabPosition].isTop = 'false';
          } else {
            this['formData' + this.tabPosition].isTop = 'true';
          }
          this.getEmergencyAddressData()
        } else if (this.tabPosition == 8) {

          this.getDataRecent(3);

        } else if (this.tabPosition == 5) {

          this.getDataRecent(5);

        } else if (this.tabPosition == 6) {

          this.getDataRecent(6);

        } else if (this.tabPosition == 7) {
          this.getContactorList();
        }
        console.log(data);
        this.$store.commit('setGroupId', data.id)
        this.groupId = data.id
      },
      //获取联系人数据
      getContactorList() {
        this['formData' + this.tabPosition].rowData = null;
        let data;
        if (this.tabPosition == 1) {
          data = {
            groupId: this['formData' + this.tabPosition].groupId,
            page: this['formData' + this.tabPosition].currentPage,
            size: this['formData' + this.tabPosition].pageSize,
            searchText: this['formData' + this.tabPosition].searchText,
            type: 'sms'
          };
        } else {
          data = {
            groupId: this['formData' + this.tabPosition].groupId,
            page: this['formData' + this.tabPosition].currentPage,
            size: this['formData' + this.tabPosition].pageSize,
            searchText: this['formData' + this.tabPosition].searchText,
          };
        }

        this.$api.contactorList(data).then(res => {
          console.log(res)
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          this['formData' + this.tabPosition].tableData = res.data.list || [];
          this['formData' + this.tabPosition].total = res.data.totalCount || 0;
        })
      },
      refreshData() {
        if (this.tabPosition == 1) {
          this.treeDataItem = {};
          this.getPhoneGroupingTree();
        } else if (this.tabPosition == 8) {
          this.formData8.treeDataItem = {};
          this.getSmsGroupListTree(8)

        } else if (this.tabPosition == 5) {
          this.formData5.treeDataItem = {};
          this.gliaisonGroupList();

        } else if (this.tabPosition == 6) {
          this.formData6.treeDataItem = {};
          this.dutyGroupList();

        } else if (this.tabPosition == 7) {
          this.formData7.treeDataItem = {};
          this.getResourceGroupingTree(7);

        }
      },
      //应急通讯录架构树
      getEmergencyAddressBookTree() {
        let data = {
          id: 0,
        };
        let CallbackReload = this;
        this.formData4.myLoading = true;
        this.$api.getBriefsByClassId(data, CallbackReload).then(result => {
          this.formData4.myLoading = false;
          if (result) {
            this.formData4.treeData = [];
            for (let n in result.data) {
              this.formData4.treeData.push({
                id: result.data[n].id,
                name: result.data[n].name + '通讯录',
                versionId: result.data[n].versionId,
                children: []
              });
              let data = {
                id: result.data[n].versionId,
              };
              this.$api.getStructTree(data, this).then(res => {
                this.formData4.treeData[n].children = res.data;
              })
            }
          }
        }).catch(err => {
          this.formData4.myLoading = false;
        })

      },
      //删除方法
      handleDelete() {
        if (this.tabPosition == 1 || this.tabPosition == 8 || this.tabPosition == 5 || this.tabPosition == 6 || this.tabPosition == 7) {
          if (this['formData' + this.tabPosition].rowData == "" || this['formData' + this.tabPosition].rowData == null) {
            this.$message({
              message: "请选中表格中任意行进行删除!",
              type: "warning"
            });
            return;
          } else {
            let data = {
              data: {id: this['formData' + this.tabPosition].rowData.id},
              operate: 2,
            };
            this.$confirm('删除当前信息?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
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
                this.getContactorList();
              });
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除!'
              });
            });
          }
        } else if (this.tabPosition == 2) {
          if (this.formData2.rowData == "" || this.formData2.rowData == null) {
            this.$message({
              message: "请选中表格中任意行进行删除!",
              type: "warning"
            });
            return;
          } else {
            let data = {
              contactorId: this.formData2.rowData.id,
            };
            this.$confirm('删除当前信息?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
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
                this.getDataAl();
              });
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除!'
              });
            });
          }
        }
      }
      ,
      //排序方法
      handleSort() {
        this.$nextTick(() => {
          this.$refs.ContactSortingPopup.isDialogVisible = true;
          this.$refs.ContactSortingPopup.getTree();
        });
      },
      //根据分组导出联系人
      handleExportContactor() {
        if (this['formData' + this.tabPosition].groupId == -1) {
          this.$message.warning("未分组联系人不能另存为excel文件");
          return;
        }
        if (this['formData' + this.tabPosition].groupId == null || this['formData' + this.tabPosition].groupId == "" ||
          this['formData' + this.tabPosition].groupId == undefined) {
          this.$message.warning("请先选择一个分组");
          return;
        }
        window.location.href = window.g.ApiUrl + "/eos/communication/contactor/export?groupId=" + this['formData' + this.tabPosition].groupId;
      },
      //表格行点击方法
      handleRowClick(row) {
        this['formData' + this.tabPosition].rowData = row;

      },
      closeDialog(key) {
        this.$emit('closeDialog', key);
      },
      //电话分组树
      getPhoneGroupingTree(key) {
        let data = {
          displayDefault: true //是否显示未分组联系人
        };

        this.$api.telephoneGroupingTree(data).then(res => {

          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return
          }
          if (key) {
            this['formData' + this.tabPosition].treeData = res.data || [];
          } else {
            this['formData' + this.tabPosition].treeData = res.data || [];
          }

        })
      },
      handSetToCommon(row) {
        let data = {contactorId: row.id};
        this.$api.usedContactor(data).then(res => {
          if (res.errorcode != 0) {
            this.$message.error(res.msg);
            return;
          }
          this.$message.success("已设为常用联系人!");
        });
      },
      handleRowDbClick(row) {//双击修改

        this.$nextTick(() => {
          this.$refs.ContactDetailsPopup.isDialogVisible = true;
          this.$refs.ContactDetailsPopup.title = "修改联系人";
          this.$refs.ContactDetailsPopup.getTree();
          this.$refs.ContactDetailsPopup.showData(row);
        });
      },
      //改变页数查询
      handCurrentChange(val) {
        this['formData' + this.tabPosition].currentPage = val;
        if (this.tabPosition == 1) {
          this.getContactorList();
        } else if (this.tabPosition == 2) {
          this.getDataAl();
        } else if (this.tabPosition == 5) {
          this.getContactorList();
        } else if (this.tabPosition == 4) {
          this.getEmergencyAddressData()
        } else if (this.tabPosition == 6) {
          this.getContactorList();
        } else if (this.tabPosition == 7) {
          this.getContactorList();
        }
      },
      //改变每页条数查询
      handSizeChange(val) {
        this['formData' + this.tabPosition].currentPage = 1;
        this['formData' + this.tabPosition].pageSize = val;
        if (this.tabPosition == 1) {

          this.getContactorList();
        } else if (this.tabPosition == 2) {
          this.getDataAl();
        } else if (this.tabPosition == 5) {
          this.getContactorList();
        } else if (this.tabPosition == 4) {
          this.getEmergencyAddressData()
        } else if (this.tabPosition == 6) {
          this.getContactorList();
        } else if (this.tabPosition == 7) {
          this.getContactorList();
        }
      },
      getDataAl() {//获取常用联系人
        let data = {
          searchText: this.formData2.searchText,
          page: this.formData2.currentPage,
          size: this.formData2.pageSize,
          type: 'sms'
        };
        this.$api.commonContactorList(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              error: "error"
            });
            return;
          }
          this.formData2.tableData = res.data.data || [];
          this.formData2.total = res.data.totalElements || 0;
        })
      },
      //获取短信分组
      getSmsGroupListTree(key) {
        let data = {
          displayDefault: true
        };
        this.$api.smsGroupList(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }

          this['formData' + key].treeData = res.data || [];
        })
      },
      //获取应急通讯录联系人
      getEmergencyAddressData() {
        let data = {
          searchText: this.formData4.searchText,
          id: this.formData4.treeDataItem.groupId,
          page: this.formData4.currentPage,
          size: this.formData4.pageSize,
          isTop: this.formData4.isTop,
          type: "phone"
        };
        if (this.formData4.treeDataItem.groupId) {
          data.id = this.formData4.treeDataItem.groupId;
        } else {
          this.$message({
            message: "请先选择节点",
            type: "warning"
          });
          return;
        }

        this.$api.emergencyAddressBook(data).then(res => {
          if (res.errorcode != 0) {
            this.message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          console.log(res.data.totalElements);
          console.log(res.data.data);
          this.formData4.tableData = res.data.data || [];
          this.formData4.total = res.data.totalElements || 0;
        });
      },
      getDataRecent(key) {//获取短信分组
        console.log(key);
        let data = {
          searchText: this['formData' + key].searchText,
          groupId: this['formData' + key].groupId,
          page: this['formData' + key].currentPage,
          size: this['formData' + key].pageSize,
          type: 'sms'
        };
        if (this['formData' + key].groupId) {
          data.groupId = this['formData' + key].groupId
        } else {
          return
        }
        this.$api.contactorList(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              error: "error"
            });
            return;
          }
          this['formData' + key].tableData = res.data.list || [];

        })
      },
      getResourceGroupingTree(key) {
        let data = {
          displayDefault: true //是否显示未分组联系人
        };
        this['formData' + this.tabPosition].myLoading = true;
        this.$api.resourceGroupList(data).then(res => {
          this['formData' + this.tabPosition].myLoading = false;
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return
          }
          this['formData' + this.tabPosition].treeData = res.data || [];


        }).catch(err => {
          this['formData' + this.tabPosition] = false;
        })
      },

      // 拖动排序相关
      refreshTreeAfterDrag() {
        //刷新树数据
        if (this.tabPosition == 1) {
          // 政务联络网
          this.treeDataItem = {};
          this.getPhoneGroupingTree(1);
        } else if (this.tabPosition == 2) {
          // 常用联系人
        } else if (this.tabPosition == 8) {
          // 短信分组
        } else if (this.tabPosition == 4) {
          // 应急联动网
          this.filterText = "";
          this.getEmergencyAddressBookTree();
        } else if (this.tabPosition == 5) {
          // 基层联络网
          this.gliaisonGroupList();
        } else if (this.tabPosition == 6) {
          // 备勤联络网
          this.dutyGroupList();
        } else if (this.tabPosition == 7) {
          // 资源联络网
          this.getResourceGroupingTree(7);
        } else if (this.tabPosition === 8) {
          // 传真
          this.getFaxGroupData();
        }

        //选中
        this.$nextTick(function () {
          if (this.tabPosition == 1) {
            // 政务联络网
            this.$refs.tree.setCurrentKey(this.groupId);
          } else if (this.tabPosition == 2) {
            // 常用联系人
          } else if (this.tabPosition == 8) {
            // 短信分组
          } else if (this.tabPosition == 4) {
            // 应急联动网
            this.$refs.tree1.setCurrentKey(this.groupId);
          } else if (this.tabPosition == 5) {
            // 基层联络网
            this.$refs.tree5.setCurrentKey(this.groupId);
          } else if (this.tabPosition == 6) {
            // 备勤联络网
            this.$refs.tree6.setCurrentKey(this.groupId);
          } else if (this.tabPosition == 7) {
            // 资源联络网
            this.$refs.tree7.setCurrentKey(this.groupId);
          } else if (this.tabPosition === 8) {
            // 传真
            this.$refs.tree8.setCurrentKey(this.groupId);
          }
        })
      },
      handleDrop(draggingNode, dropNode, dropType, ev) {
        if (this.childrenlist) {
          let arrays = [];
          this.childrenlist.forEach(function (data) {
            if (data.id > 0) {
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
        if (draggingNode.data.parentId > 0) {
          this.childrenlist = draggingNode.parent.data.children;
        } else {
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
    border: 1px rgba(233,236,241,1) solid;
  }
  .el-radio-button{

  }
  /*.my-radio-box .el-radio-button >>> .el-radio-button__inner {*/
  /*  padding: 15px 30px;*/
  /*  border-bottom: none;*/
  /*}*/
  .my-radio-box-main {
    position: relative;
    text-align: left;
    z-index: 30;
    margin-bottom: 10px;
    /*background: white;*/
    /*box-shadow:0px 3px 10px 2px rgba(54,121,225,0.09);*/
    /*border-radius:3px;*/
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
    /*height: calc(100vh - 175px);*/
    height: 600px;
    overflow: auto;
    display: flex;
  }

  .my-tree-box {
    height: initial;
    /*max-height: 100%;*/
    /*height:400px;*/
    background-color: #fff;
    border-top: 1px solid rgba(211, 215, 219, 1);
    border-right: 1px solid rgba(211, 215, 219, 1);
    border-bottom: 1px solid rgba(211, 215, 219, 1);
    width: 40%;
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
    /*max-height: 78%;*/
    padding-bottom: 10px;
  }
  .my-table-box {
    flex: 1;
    border-left: 10px solid #ebeef5;
    background: white;
    box-shadow:0px 3px 10px 2px rgba(54,121,225,0.09);
    border-radius:3px;
  }
  .el-tree--highlight-current
  >>> .el-tree-node.is-current
  > .el-tree-node__content {
    background-color: #c0c0c0;
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
    /* margin-right: 10px; */
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
    /* top: -1px; */
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
    /* top: -1px; */
    left: -25px;
    width: 17px;
    height: 17px;
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAANCAYAAACgu+4kAAAAmUlEQVQ4T+2TMQ4BYRCFv5e4gt0b2JtwAEdxAOfQ6DUS5WrcwNYShYZCFDqC7BMSksXm/yNK086bb15eZuS8tQU1EcbeISagvtqLDREl51kJqKr1HsqeOsthiFEDeI6tgGMtRF7L02z27iC099H3RS7S8dcA3wDz9EMGsQ44/QG/ySA5gxrRuVeFB7lIBlhd9HrOAaTvvzO6Ap8dRlHswtTSAAAAAElFTkSuQmCC")
    no-repeat;
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
