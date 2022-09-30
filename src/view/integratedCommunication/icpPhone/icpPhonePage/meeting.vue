<template>
  <div class="my-radio-box">
    <div class="my-radio-box-main">
      <el-radio-group v-model="tabPosition" @change="changePage">
        <!-- 电话会议 -->
        <template v-if="confType == 0">
          <el-radio-button
            v-for="(item, index) in phoneList.filter((element) => {
              return element != null;
            })"
            :label="Number(item.label)"
            :key="index"
            >{{ item.name }}</el-radio-button
          >
        </template>
        <!-- 视频会议 -->
        <template v-if="confType == 1">
          <el-radio-button
            v-for="(item, index) in shipinList.filter((element) => {
              return element != null;
            })"
            :label="Number(item.label)"
            :key="index"
            >{{ item.name }}</el-radio-button
          >
        </template>
        <!-- 集群会议 -->
        <template v-if="confType == 2">
          <el-radio-button
            v-for="(item, index) in clusterList.filter((element) => {
              return element != null;
            })"
            :label="Number(item.label)"
            :key="index"
            >{{ item.name }}</el-radio-button
          >
        </template>
      </el-radio-group>
      <div
        style="
          position: absolute;
          right: 3%;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          cursor: pointer;
        "
        @click="manageVisible = !manageVisible"
      >
        <img
          :src="require('@/assets/icpImg/communicationManage.png')"
          style="width: 1.3vw"
          v-if="manageVisible"
        />
        <span
          style="
            font-size: 14px;
            color: #999999;
            line-height: 14px;
            margin-left: 4px;
          "
          v-if="manageVisible"
          >管理</span
        >
        <i
          class="el-icon-circle-check"
          style="font-size: 20px; color: rgba(0, 145, 255, 1)"
          v-if="!manageVisible"
        ></i>
        <span
          style="
            font-size: 14px;
            color: #999999;
            line-height: 14px;
            margin-left: 4px;
          "
          v-if="!manageVisible"
          >完成</span
        >
      </div>
    </div>
    <div class="my-phone-main" v-if="tabPosition == 1">
      <div class="my-tree-box" style="box-sizing: border-box; overflow: auto">
        <el-scrollbar class="my-tree-scroll">
          <!-- <el-input placeholder="输入关键字进行搜索" v-model="filterTextVideo"></el-input> -->
          <el-input
            placeholder="输入关键字进行搜索"
            v-model="myData1.filterTree"
            class="treeSearch"
            style="padding: 10px; box-sizing: border-box"
          >
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              @click="$refs.tree1.filter(myData1.filterTree)"
            ></i>
          </el-input>
          <el-tree
            :data="myData1.treeData"
            @node-click="handleNodeClick"
            node-key="id"
            ref="tree1"
            highlight-current
            :default-expanded-keys="[expandId]"
            :filter-node-method="filterNode"
            :props="defaultProps"
            show-checkbox
            @check-change="handleCheckChange"
            @check="handleTreeCheck"
          >
            <span
              class="custom-tree-node"
              slot-scope="{ node, data }"
              :style="{
                display: 'flex',
                'align-items': 'center',
                position: 'relative',
                width: '100%',
              }"
              @mouseover="treeBtnHoverIndex = data.id"
              @mouseout="treeBtnHoverIndex = -2"
            >
              <span>{{ node.label }}</span>
              <span
                style="
                  display: flex;
                  position: absolute;
                  top: 50%;
                  left: 66%;
                  transform: translateY(-50%);
                "
                v-show="
                  treeBtnHoverIndex == data.id &&
                  !manageVisible &&
                  data.id != -1
                "
              >
                <div
                  style="display: flex; align-items: center; cursor: pointer"
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="编辑"
                    placement="top"
                  >
                    <img
                      :src="require('@/assets/icpImg/editTreeBtn.png')"
                      style="width: 1.3vw"
                      @click="editTreeItem(node, data)"
                    />
                  </el-tooltip>
                </div>
                <div
                  style="
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    margin-left: 5px;
                  "
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="删除"
                    placement="top"
                  >
                    <img
                      :src="require('@/assets/icpImg/deleteTreeBtn.png')"
                      style="width: 1.3vw"
                      @click="deleteTreeItem(node, data)"
                    />
                  </el-tooltip>
                </div>
              </span>
            </span>
          </el-tree>
        </el-scrollbar>
        <treeBtn
          v-if="!manageVisible"
          @changeDialog="closeDialog"
          @refreshData="refreshData"
          :treeDataItem="myData1.treeDataItem"
          :treeData="myData1.treeData"
          :formData="formData1"
          ref="treeBtn1"
          :treeDataItems="myData1.treeMultipleSelection"
          tabPosition="jiankongshipin"
        ></treeBtn>
      </div>
      <div class="my-table-box" style="box-sizing: border-box; overflow: auto">
        <btn-box
          v-if="!manageVisible"
          :btnArry="btnArry1"
          v-bind="{
            refresh: { callback: myRefresh },
            refresh1: { callback: myRefresh1 },
            add: { callback: addList },
            edit: { callback: myEdit },
            del: { callback: handleDelete },
          }"
        ></btn-box>
        <el-row class="my-table-box-search" style="margin: 10px">
          <el-col :span="14">
            <el-input
              placeholder="请输入设备名称/号码"
              class="searchInput"
              v-model="myData1.searchText"
            ></el-input>
          </el-col>
          <el-col :span="10">
            <el-button
              type="primary"
              @click="handleSearch"
              style="margin-left: 10px"
              >搜索</el-button
            >
          </el-col>
        </el-row>
        <el-table
          ref="elTable1"
          :data="myData1.tableData"
          highlight-current-row
          :header-cell-style="{ background: '#E6E6E6', color: '#606266' }"
          style="width: 100%; height: 600px; overflow: auto"
          @row-click="handleRowClick"
          @row-dblclick="handleRowDbClick"
          @selection-change="handleSelectionChange"
          @select="handleSelect"
          @select-all="selectAll"
        >
          <el-table-column type="selection"></el-table-column>
          <!-- <el-table-column type="index" width="50" :resizable="false" align="center"></el-table-column> -->
          <el-table-column
            show-overflow-tooltip
            align="center"
            v-for="(item, key) in myData1.tableColumn"
            :key="key"
            :label="item.label"
            :prop="item.prop"
            :width="item.width"
            :resizable="false"
          ></el-table-column>
          <el-table-column label="操作" width="250px" align="center">
            <template slot-scope="scope">
              <el-tooltip
                v-if="manageVisible"
                class="item"
                effect="dark"
                content="查看"
                placement="top"
              >
                <i
                  class="el-icon-info"
                  @click="watchContactDetails(scope.row)"
                  style="font-size: 24px; color: #9fc8fe; cursor: pointer"
                ></i>
              </el-tooltip>
              <el-tooltip
                v-if="manageVisible"
                class="item"
                effect="dark"
                content="预览"
                placement="top"
              >
                <i
                  class="el-icon-preview"
                  @click="Preview(scope.row)"
                  style="font-size: 24px; color: #9fc8fe; cursor: pointer"
                ></i>
              </el-tooltip>
              <el-tooltip
                v-if="!manageVisible"
                class="item"
                effect="dark"
                content="编辑"
                placement="top"
              >
                <i
                  class="el-icon-edit"
                  @click="
                    ['myData' + tabPosition].rowData = scope.row;
                    window.setTimeout(() => {
                      myEdit();
                    }, 500);
                  "
                  style="
                    font-size: 24px;
                    margin-left: 1vw;
                    color: #9fc8fe;
                    cursor: pointer;
                  "
                ></i>
              </el-tooltip>
              <el-tooltip
                v-if="!manageVisible"
                class="item"
                effect="dark"
                content="删除"
                placement="top"
              >
                <i
                  class="el-icon-delete-solid"
                  @click="
                    ['myData' + tabPosition].rowData = scope.row;
                    window.setTimeout(() => {
                      myDel();
                    }, 500);
                  "
                  style="
                    font-size: 24px;
                    margin-left: 1vw;
                    color: #9fc8fe;
                    cursor: pointer;
                  "
                ></i>
              </el-tooltip>
              <!-- <el-button type="primary" size="mini" @click="talkCall1(scope.row)">添加</el-button>
              <el-button type="primary" size="mini" @click="Preview(scope.row)">预览</el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-pagination
            class="pagination"
            background
            :page-size="myData1.pageSize"
            :page-sizes="[10, 20, 30, 40]"
            :total="myData1.total"
            :current-page="myData1.currentPage"
            @current-change="handCurrentChange"
            @size-change="handSizeChange"
            layout="total, prev, pager, next, sizes, jumper"
          ></el-pagination>
        </el-row>
      </div>
    </div>
    <div class="my-phone-main" v-if="tabPosition == 2">
      <div class="my-tree-box" style="box-sizing: border-box; overflow: auto">
        <el-scrollbar class="my-tree-scroll">
          <el-input
            placeholder="输入关键字进行搜索"
            v-model="myData2.filterTree"
            class="treeSearch"
            style="padding: 10px; box-sizing: border-box"
          >
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              @click="$refs.tree2.filter(myData2.filterTree)"
            ></i>
          </el-input>
          <el-tree
            :data="myData2.treeData"
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
            node-key="id"
            ref="tree2"
            :default-expanded-keys="[expandId]"
            highlight-current
            :props="defaultProps"
            show-checkbox
            @check-change="handleCheckChange"
            @check="handleTreeCheck"
          >
            <span
              class="custom-tree-node"
              slot-scope="{ node, data }"
              :style="{
                display: 'flex',
                'align-items': 'center',
                position: 'relative',
                width: '100%',
              }"
              @mouseover="treeBtnHoverIndex = data.id"
              @mouseout="treeBtnHoverIndex = -2"
            >
              <span>{{ node.label }}</span>
              <span
                style="
                  display: flex;
                  position: absolute;
                  top: 50%;
                  left: 66%;
                  transform: translateY(-50%);
                "
                v-show="
                  treeBtnHoverIndex == data.id &&
                  !manageVisible &&
                  data.id != -1
                "
              >
                <div
                  style="display: flex; align-items: center; cursor: pointer"
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="编辑"
                    placement="top"
                  >
                    <img
                      :src="require('@/assets/icpImg/editTreeBtn.png')"
                      style="width: 1.3vw"
                      @click="editTreeItem(node, data)"
                    />
                  </el-tooltip>
                </div>
                <div
                  style="
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    margin-left: 5px;
                  "
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="删除"
                    placement="top"
                  >
                    <img
                      :src="require('@/assets/icpImg/deleteTreeBtn.png')"
                      style="width: 1.3vw"
                      @click="deleteTreeItem(node, data)"
                    />
                  </el-tooltip>
                </div>
              </span>
            </span>
          </el-tree>
        </el-scrollbar>
        <treeBtn
          v-if="!manageVisible"
          @changeDialog="closeDialog"
          @refreshData="refreshData"
          :treeDataItem="myData2.treeDataItem"
          :treeData="myData2.treeData1"
          :formData="formData2"
          ref="treeBtn2"
          :treeDataItems="myData2.treeMultipleSelection"
          tabPosition="huichangzhongduan"
        ></treeBtn>
      </div>
      <div class="my-table-box" style="box-sizing: border-box; overflow: auto">
        <btn-box
          v-if="!manageVisible"
          :btnArry="btnArry2"
          v-bind="{
            add: { callback: addList },
            edit: { callback: myEdit },
            del: { callback: handleDelete },
          }"
        ></btn-box>
        <el-row class="my-table-box-search" style="margin: 10px">
          <el-col :span="14">
            <el-input
              placeholder="请输入设备名称/号码"
              class="searchInput"
              v-model="myData2.searchText"
            ></el-input>
          </el-col>
          <el-col :span="10">
            <el-button
              type="primary"
              @click="handleSearch"
              style="margin-left: 10px"
              >搜索</el-button
            >
          </el-col>
        </el-row>
        <el-table
          ref="elTable2"
          :data="myData2.tableData"
          highlight-current-row
          :header-cell-style="{ background: '#E6E6E6', color: '#606266' }"
          style="width: 100%; height: 600px; overflow: auto"
          @row-click="handleRowClick"
          @row-dblclick="handleRowDbClick"
          @selection-change="handleSelectionChange"
          @select="handleSelect"
          @select-all="selectAll"
        >
          <el-table-column type="selection"></el-table-column>
          <!-- <el-table-column type="index" width="50" :resizable="false" align="center"></el-table-column> -->
          <el-table-column
            show-overflow-tooltip
            align="center"
            v-for="(item, key) in myData2.tableColumn"
            :key="key"
            :label="item.label"
            :prop="item.prop"
            :width="item.width"
            :resizable="false"
          ></el-table-column>
          <el-table-column label="操作" width="250px" align="center">
            <template slot-scope="scope">
              <el-tooltip
                v-if="manageVisible"
                class="item"
                effect="dark"
                content="查看"
                placement="top"
              >
                <i
                  class="el-icon-info"
                  @click="watchContactDetails(scope.row)"
                  style="font-size: 24px; color: #9fc8fe; cursor: pointer"
                ></i>
              </el-tooltip>
              <el-tooltip
                v-if="!manageVisible"
                class="item"
                effect="dark"
                content="编辑"
                placement="top"
              >
                <i
                  class="el-icon-edit"
                  @click="
                    ['myData' + tabPosition].rowData = scope.row;
                    window.setTimeout(() => {
                      myEdit();
                    }, 500);
                  "
                  style="
                    font-size: 24px;
                    margin-left: 1vw;
                    color: #9fc8fe;
                    cursor: pointer;
                  "
                ></i>
              </el-tooltip>
              <el-tooltip
                v-if="!manageVisible"
                class="item"
                effect="dark"
                content="删除"
                placement="top"
              >
                <i
                  class="el-icon-delete-solid"
                  @click="
                    ['myData' + tabPosition].rowData = scope.row;
                    window.setTimeout(() => {
                      myDel();
                    }, 500);
                  "
                  style="
                    font-size: 24px;
                    margin-left: 1vw;
                    color: #9fc8fe;
                    cursor: pointer;
                  "
                ></i>
              </el-tooltip>
              <!-- <el-tooltip class="item" effect="dark" content="设为常用联系人" placement="top">
                <i class="el-icon-star-on" @click="handSetToCommon(scope.row)" :style="{'font-size': '24px','margin-left': '1vw',cursor: 'pointer',color:scope.row.commonlyUsed==0?'#9FC8FE':'#FBC958'}"></i>
              </el-tooltip>-->
              <!-- <el-button type="primary" size="mini" @click="talkCall1(scope.row)">添加</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-pagination
            class="pagination"
            background
            :page-size="myData2.pageSize"
            :page-sizes="[10, 20, 30, 40]"
            :total="myData2.total"
            :current-page="myData2.currentPage"
            @current-change="handCurrentChange"
            @size-change="handSizeChange"
            layout="total, prev, pager, next, sizes, jumper"
          ></el-pagination>
        </el-row>
      </div>
    </div>
    <div
      class="my-phone-main"
      v-if="tabPosition == 3 || tabPosition == 9 || tabPosition == 10"
    >
      <div class="my-tree-box" style="box-sizing: border-box; overflow: auto">
        <div
          style="
            width: 100%;
            height: 3.5vh;
            display: flex;
            border-bottom: 1px solid rgba(233, 235, 240, 1);
          "
        >
          <!-- <div
            :style="{width: '100%',display: 'flex','align-items': 'center','margin-left':'11%',cursor: 'pointer',color:tabPosition==9?'rgba(0,145,255,1)':'rgba(153,153,153,1)'}"
            @click="tabPosition=9;getDataAl();"
          >
            <i class="el-icon-star-off" style="width:0.91vw;"></i>
            <span
              style="font-size:12px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;margin-left:3px;"
            >常用联系人</span>
          </div>-->
          <div
            :style="{
              width: '100%',
              display: 'flex',
              'align-items': 'center',
              'margin-left': '11%',
              cursor: 'pointer',
              color:
                tabPosition == 10 ? 'rgba(0,145,255,1)' : 'rgba(153,153,153,1)',
            }"
            @click="
              tabPosition = 10;
              getDataRecent();
            "
          >
            <i class="el-icon-time" style="width: 0.91vw"></i>
            <span
              style="
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                margin-left: 3px;
              "
              >最近联系人</span
            >
          </div>
        </div>
        <el-scrollbar class="my-tree-scroll">
          <el-input
            placeholder="输入关键字进行搜索"
            v-model="myData3.filterTree"
            class="treeSearch"
            style="padding: 10px; box-sizing: border-box"
          >
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              @click="$refs.tree3.filter(myData3.filterTree)"
            ></i>
          </el-input>
          <el-tree
            :data="myData3.treeData"
            @node-click="handleNodeClick"
            node-key="id"
            ref="tree3"
            highlight-current
            :props="defaultProps"
            :default-expanded-keys="[expandId]"
            :filter-node-method="filterNode"
            draggable
            @node-drop="handleDrop"
            :allow-drop="allowDrop"
            :allow-drag="allowDrag"
            show-checkbox
            @check-change="handleCheckChange"
            @check="handleTreeCheck"
          >
            <span
              class="custom-tree-node"
              slot-scope="{ node, data }"
              :style="{
                display: 'flex',
                'align-items': 'center',
                position: 'relative',
                width: '100%',
              }"
              @mouseover="treeBtnHoverIndex = data.id"
              @mouseout="treeBtnHoverIndex = -2"
            >
              <span>{{ node.label }}</span>
              <span
                style="
                  display: flex;
                  position: absolute;
                  top: 50%;
                  left: 66%;
                  transform: translateY(-50%);
                "
                v-show="
                  treeBtnHoverIndex == data.id &&
                  !manageVisible &&
                  data.id != -1
                "
              >
                <div
                  style="display: flex; align-items: center; cursor: pointer"
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="编辑"
                    placement="top"
                  >
                    <img
                      :src="require('@/assets/icpImg/editTreeBtn.png')"
                      style="width: 1.3vw"
                      @click="editTreeItem(node, data)"
                    />
                  </el-tooltip>
                </div>
                <div
                  style="
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    margin-left: 5px;
                  "
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="删除"
                    placement="top"
                  >
                    <img
                      :src="require('@/assets/icpImg/deleteTreeBtn.png')"
                      style="width: 1.3vw"
                      @click="deleteTreeItem(node, data)"
                    />
                  </el-tooltip>
                </div>
              </span>
            </span>
          </el-tree>
        </el-scrollbar>
        <treeBtn
          v-if="!manageVisible"
          @changeDialog="closeDialog"
          @refreshData="refreshData"
          :treeDataItem="myData3.treeDataItem"
          :treeData="myData3.treeData"
          :formData="myData"
          ref="treeBtn3"
          :treeDataItems="myData3.treeMultipleSelection"
          tabPosition="zhengwulianluowang"
        ></treeBtn>
        <!-- <el-alert title="温馨提示" type="info" description="可拖动修改同级分组排序" show-icon></el-alert> -->
      </div>
      <div
        class="my-table-box"
        v-if="tabPosition == 3"
        style="box-sizing: border-box; overflow: auto"
      >
        <btn-box
          v-if="!manageVisible"
          :btnArry="btnArry2"
          v-bind="{
            add: { callback: addList },
            edit: { callback: myEdit },
            del: { callback: handleDelete },
          }"
        ></btn-box>
        <el-row class="my-table-box-search" style="margin: 10px">
          <el-col :span="14">
            <el-input
              placeholder="请输入姓名/单位/职位/号码"
              class="searchInput"
              v-model="myData3.searchText"
              @input="handleSearch"
            ></el-input>
          </el-col>
          <el-col :span="10">
            <el-button
              type="primary"
              @click="handleSearch"
              style="margin-left: 10px"
              >搜索</el-button
            >
          </el-col>
        </el-row>
        <el-table
          ref="elTable3"
          :data="myData3.tableData"
          highlight-current-row
          :header-cell-style="{ background: '#E6E6E6', color: '#606266' }"
          style="width: 100%; height: 600px; overflow: auto"
          @row-click="handleRowClick"
          @row-dblclick="handleRowDbClick"
          @selection-change="handleSelectionChange"
          @select="handleSelect"
          @select-all="selectAll"
        >
          <el-table-column type="selection"></el-table-column>
          <!-- <el-table-column type="index" width="50" :resizable="false" align="center"></el-table-column> -->
          <el-table-column
            show-overflow-tooltip
            align="center"
            v-for="(item, key) in myData3.tableColumn"
            :key="key"
            :label="item.label"
            :prop="item.prop"
            :width="item.width"
            :resizable="false"
          ></el-table-column>
          <el-table-column label="操作" width="250px" align="center">
            <template slot-scope="scope">
              <el-tooltip
                v-if="manageVisible"
                class="item"
                effect="dark"
                content="查看"
                placement="top"
              >
                <i
                  class="el-icon-info"
                  @click="watchContactDetails(scope.row)"
                  style="font-size: 24px; color: #9fc8fe; cursor: pointer"
                ></i>
              </el-tooltip>
              <el-tooltip
                v-if="!manageVisible"
                class="item"
                effect="dark"
                content="编辑"
                placement="top"
              >
                <i
                  class="el-icon-edit"
                  @click="
                    ['myData' + tabPosition].rowData = scope.row;
                    window.setTimeout(() => {
                      myEdit();
                    }, 500);
                  "
                  style="
                    font-size: 24px;
                    margin-left: 1vw;
                    color: #9fc8fe;
                    cursor: pointer;
                  "
                ></i>
              </el-tooltip>
              <el-tooltip
                v-if="!manageVisible"
                class="item"
                effect="dark"
                content="删除"
                placement="top"
              >
                <i
                  class="el-icon-delete-solid"
                  @click="
                    ['myData' + tabPosition].rowData = scope.row;
                    window.setTimeout(() => {
                      handleDeleteItem();
                    }, 500);
                  "
                  style="
                    font-size: 24px;
                    margin-left: 1vw;
                    color: #9fc8fe;
                    cursor: pointer;
                  "
                ></i>
              </el-tooltip>
              <!-- <el-tooltip class="item" effect="dark" content="设为常用联系人" placement="top">
                <i
                  class="el-icon-star-on"
                  @click="handSetToCommon(scope.row)"
                  :style="{'font-size': '24px','margin-left': '1vw',cursor: 'pointer',color:scope.row.commonlyUsed==0?'#9FC8FE':'#FBC958'}"
                ></i>
              </el-tooltip>-->
              <!-- <el-button type="primary" size="mini" @click="talkCall1(scope.row)">添加</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-pagination
            class="pagination"
            background
            :page-size="myData3.pageSize"
            :page-sizes="[10, 20, 30, 40]"
            :total="myData3.total"
            :current-page="myData3.currentPage"
            @current-change="handCurrentChange"
            @size-change="handSizeChange"
            layout="total, prev, pager, next, sizes, jumper"
          ></el-pagination>
        </el-row>
      </div>
      <div
        class="my-table-box"
        v-if="tabPosition == 9"
        style="box-sizing: border-box; overflow: auto"
      >
        <btn-box
          v-if="!manageVisible"
          :btnArry="[
            {
              event: 'del',
              icon: 'el-icon-delete',
              title: '批量移除',
            },
          ]"
          v-bind="{
            del: { callback: handleDelete },
          }"
        ></btn-box>
        <el-row class="my-table-box-search" style="margin: 10px">
          <el-col :span="14">
            <el-input
              placeholder="请输入姓名/单位/职位/号码"
              class="searchInput"
              v-model="myData9.searchText"
              @input="handleSearch"
            ></el-input>
          </el-col>
          <el-col :span="10">
            <el-button
              type="primary"
              @click="handleSearch"
              style="margin-left: 10px"
              >搜索</el-button
            >
          </el-col>
        </el-row>
        <el-table
          ref="elTable9"
          :data="myData9.tableData"
          highlight-current-row
          :header-cell-style="{ background: '#E6E6E6', color: '#606266' }"
          style="min-height: 600px; width: 100%; overflow: auto"
          @row-dblclick="handleRowDbClick"
          @row-click="handleRowClick"
          @selection-change="handleSelectionChange"
          @select="handleSelect"
          @select-all="selectAll"
        >
          <el-table-column type="selection"></el-table-column>
          <!-- <el-table-column type="index" width="50" show-overflow-tooltip  :resizable="false" align="center"></el-table-column> -->
          <el-table-column
            align="center"
            prop="name"
            show-overflow-tooltip
            :resizable="false"
            label="姓名"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="workUnit"
            show-overflow-tooltip
            :resizable="false"
            label="单位"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="position"
            show-overflow-tooltip
            :resizable="false"
            label="职位"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="number"
            show-overflow-tooltip
            :resizable="false"
            label="联系号码"
          >
            <!--<template slot-scope="scope">-->
            <!--<div v-if="scope.row.number">-->
            <!--<div-->
            <!--v-if="scope.row.otherTel!=''||scope.row.officeTel!=''||scope.row.homeTel!=''||scope.row.otherTel2!=''"-->
            <!--&gt;-->
            <!--<el-dropdown-->
            <!--@command="handleCommand(scope.row)"-->
            <!--placement="bottom"-->
            <!--trigger="click"-->
            <!--@visible-change="changeDropdown"-->
            <!--&gt;-->
            <!--<span class="el-dropdown-link">-->
            <!--{{scope.row.number}}-->
            <!--<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
            <!--</span>-->
            <!--<el-dropdown-menu slot="dropdown">-->
            <!--<el-dropdown-item command="a" v-if="scope.row.otherTel">-->
            <!--<div @mouseover="elDropdownItem(1)" class="dropdownDiv">-->
            <!--<span>手机2: {{scope.row.otherTel}}</span>-->
            <!--<span-->
            <!--v-if="showSpanImg==1"-->
            <!--style="display: inline-block;width:13px;padding-left: 30px"-->
            <!--&gt;-->
            <!--<img-->
            <!--style="width: 100%;height: 100%"-->
            <!--src="/static/img/icon/dailCall.png"-->
            <!--/>-->
            <!--</span>-->
            <!--</div>-->
            <!--</el-dropdown-item>-->
            <!--<el-dropdown-item command="b" v-if="scope.row.officeTel">-->
            <!--<div @mouseover="elDropdownItem(2)" class="dropdownDiv">-->
            <!--<span>办公电话: {{scope.row.officeTel}}</span>-->
            <!--<span-->
            <!--v-if="showSpanImg==2"-->
            <!--style="display: inline-block;width:13px;padding-left: 30px"-->
            <!--&gt;-->
            <!--<img-->
            <!--style="width: 100%;height: 100%"-->
            <!--src="/static/img/icon/dailCall.png"-->
            <!--/>-->
            <!--</span>-->
            <!--</div>-->
            <!--</el-dropdown-item>-->
            <!--<el-dropdown-item command="c" v-if="scope.row.homeTel">-->
            <!--<div @mouseover="elDropdownItem(3)" class="dropdownDiv">-->
            <!--<span>应急电话: {{scope.row.homeTel}}</span>-->
            <!--<span-->
            <!--v-if="showSpanImg==3"-->
            <!--style="display: inline-block;width:13px;padding-left: 30px"-->
            <!--&gt;-->
            <!--<img-->
            <!--style="width: 100%;height: 100%"-->
            <!--src="/static/img/icon/dailCall.png"-->
            <!--/>-->
            <!--</span>-->
            <!--</div>-->
            <!--</el-dropdown-item>-->
            <!--<el-dropdown-item command="d" v-if="scope.row.otherTel2">-->
            <!--<div @mouseover="elDropdownItem(4)" class="dropdownDiv">-->
            <!--<span>其他电话: {{scope.row.otherTel2}}</span>-->
            <!--<span-->
            <!--v-if="showSpanImg==4"-->
            <!--style="display: inline-block;width:13px;padding-left: 30px"-->
            <!--&gt;-->
            <!--<img-->
            <!--style="width: 100%;height: 100%"-->
            <!--src="/static/img/icon/dailCall.png"-->
            <!--/>-->
            <!--</span>-->
            <!--</div>-->
            <!--</el-dropdown-item>-->
            <!--</el-dropdown-menu>-->
            <!--</el-dropdown>-->
            <!--</div>-->
            <!--<span v-else>{{scope.row.number}}</span>-->
            <!--</div>-->
            <!--<span v-else>{{scope.row.number}}</span>-->
            <!--</template>-->
          </el-table-column>
          <!-- <el-table-column label="操作" width="250px" align="center">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="设为常用联系人" placement="top">
              
                <i
                  class="el-icon-star-on"
                  @click="handSetToCommon(scope.row)"
                  :style="{'font-size': '24px','margin-left': '1vw',cursor: 'pointer',color:scope.row.commonlyUsed==0?'#9FC8FE':'#FBC958'}"
                ></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="设为常用联系人" placement="top">
                <i
                  class="el-icon-star-on"
                  @click="myData9.rowData=scope.row;window.setTimeout(()=>{handleDeleteItem()},500)"
                  :style="{'font-size': '24px',cursor: 'pointer','margin-left': '1vw',color:'#FBC958'}"
                ></i>
              </el-tooltip>
              <el-button type="primary" size="mini" @click="addPhoneCall(scope.row)">添加</el-button>
              <el-button type="primary" size="mini" @click="talkCall(scope.row)">拨号</el-button>
            </template>
          </el-table-column>-->
        </el-table>
        <el-row>
          <el-pagination
            class="pagination"
            background
            :page-size="myData9.pageSize"
            :page-sizes="[10, 20, 30, 40]"
            :total="myData9.total"
            :current-page="myData9.currentPage"
            @current-change="handCurrentChange"
            @size-change="handSizeChange"
            layout="total, prev, pager, next, sizes, jumper"
          ></el-pagination>
        </el-row>
      </div>
      <div
        class="my-table-box"
        v-if="tabPosition == 10"
        style="box-sizing: border-box; overflow: auto"
      >
        <el-table
          ref="elTable10"
          :data="myData10.tableData"
          highlight-current-row
          :header-cell-style="{ background: '#E6E6E6', color: '#606266' }"
          style="width: 100%; min-height: 600px; overflow: auto"
          @row-click="handleRowClick"
          @selection-change="handleSelectionChange"
          @select="handleSelect"
          @select-all="selectAll"
        >
          <el-table-column type="selection"></el-table-column>
          <!-- <el-table-column type="index" width="50" show-overflow-tooltip  :resizable="false" align="center"></el-table-column> -->
          <el-table-column
            show-overflow-tooltip
            align="center"
            v-for="(item, key) in myData10.tableColumn"
            :key="key"
            :label="item.label"
            :prop="item.prop"
            :width="item.width"
            :resizable="false"
          ></el-table-column>
          <!-- <el-table-column label="操作" width="250px" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="addPhoneCall(scope.row)">添加</el-button>
              <el-button type="primary" size="mini" @click="talkCall(scope.row)">拨号</el-button>
            </template>
          </el-table-column>-->
        </el-table>
        <el-row>
          <el-pagination
            class="pagination"
            background
            :page-size="100"
            :total="myData10.total"
            :current-page="myData10.currentPage"
            layout="total, prev, pager, next, jumper"
          ></el-pagination>
        </el-row>
      </div>
    </div>
    <div class="my-phone-main" v-if="tabPosition == 4">
      <div class="my-tree-box" style="box-sizing: border-box; overflow: auto">
        <el-scrollbar class="my-tree-scroll">
          <el-input
            placeholder="输入关键字进行搜索"
            v-model="myData4.filterTree"
            class="treeSearch"
            style="padding: 10px; box-sizing: border-box"
          >
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              @click="$refs.tree4.filter(myData4.filterTree)"
            ></i>
          </el-input>
          <el-tree
            :data="myData4.treeData"
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
            node-key="id"
            ref="tree4"
            :default-expanded-keys="[expandId]"
            highlight-current
            :props="defaultProps"
            draggable
            @node-drop="handleDrop"
            :allow-drop="allowDrop"
            :allow-drag="allowDrag"
            show-checkbox
            @check-change="handleCheckChange"
            @check="handleTreeCheck"
          >
            <span
              class="custom-tree-node"
              slot-scope="{ node, data }"
              :style="{
                display: 'flex',
                'align-items': 'center',
                position: 'relative',
                width: '100%',
              }"
              @mouseover="treeBtnHoverIndex = data.id"
              @mouseout="treeBtnHoverIndex = -2"
            >
              <span>{{ node.label }}</span>
              <span
                style="
                  display: flex;
                  position: absolute;
                  top: 50%;
                  left: 66%;
                  transform: translateY(-50%);
                "
                v-show="
                  treeBtnHoverIndex == data.id &&
                  !manageVisible &&
                  data.id != -1
                "
              >
                <div
                  style="display: flex; align-items: center; cursor: pointer"
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="编辑"
                    placement="top"
                  >
                    <img
                      :src="require('@/assets/icpImg/editTreeBtn.png')"
                      style="width: 1.3vw"
                      @click="editTreeItem(node, data)"
                    />
                  </el-tooltip>
                </div>
                <div
                  style="
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    margin-left: 5px;
                  "
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="删除"
                    placement="top"
                  >
                    <img
                      :src="require('@/assets/icpImg/deleteTreeBtn.png')"
                      style="width: 1.3vw"
                      @click="deleteTreeItem(node, data)"
                    />
                  </el-tooltip>
                </div>
              </span>
            </span>
          </el-tree>
        </el-scrollbar>
        <treeBtn
          v-if="!manageVisible"
          @changeDialog="closeDialog"
          @refreshData="refreshData"
          :treeDataItem="myData4.treeDataItem"
          :treeData="myData4.treeData"
          ref="treeBtn4"
          :treeDataItems="myData4.treeMultipleSelection"
          tabPosition="jicenglianluowang"
        ></treeBtn>
        <!-- <el-alert title="温馨提示" type="info" description="可拖动修改同级分组排序" show-icon>
        </el-alert>-->
      </div>
      <div class="my-table-box" style="box-sizing: border-box; overflow: auto">
        <btn-box
          v-if="!manageVisible"
          :btnArry="btnArry2"
          v-bind="{
            add: { callback: addList },
            edit: { callback: myEdit },
            del: { callback: handleDelete },
            sort: { callback: handleSort },
            download: { callback: handleExportContactor },
            document: { callback: handleExportm },
          }"
          :batchJoinIsShow="true"
          @handleBatchJoin="handleBatchJoin"
          @success="batchJoinSuccess"
        ></btn-box>
        <el-row class="my-table-box-search" style="margin: 10px">
          <el-col :span="14">
            <el-input
              placeholder="请输入姓名/单位/职位/号码"
              class="searchInput"
              v-model="myData4.searchText"
              @input="handleSearch"
            ></el-input>
          </el-col>
          <el-col :span="10">
            <el-button
              type="primary"
              @click="handleSearch"
              style="margin-left: 10px"
              >搜索</el-button
            >
          </el-col>
        </el-row>
        <el-table
          ref="elTable4"
          :data="myData4.tableData"
          highlight-current-row
          :header-cell-style="{ background: '#E6E6E6', color: '#606266' }"
          style="min-height: 600px; width: 100%"
          @row-dblclick="handleRowDbClick"
          @row-click="handleRowClick"
          @selection-change="handleSelectionChange"
          @select="handleSelect"
          @select-all="selectAll"
        >
          <el-table-column type="selection"></el-table-column>
          <!-- <el-table-column type="index" width="50" show-overflow-tooltip  :resizable="false" align="center"></el-table-column> -->
          <el-table-column
            align="center"
            prop="name"
            show-overflow-tooltip
            :resizable="false"
            label="姓名"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="workUnit"
            show-overflow-tooltip
            :resizable="false"
            label="单位"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="position"
            show-overflow-tooltip
            :resizable="false"
            label="职位"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="number"
            show-overflow-tooltip
            :resizable="false"
            label="联系号码"
          >
            <!--<template slot-scope="scope">-->
            <!--<div v-if="scope.row.number">-->
            <!--<div-->
            <!--v-if="scope.row.otherTel!=''||scope.row.officeTel!=''||scope.row.homeTel!=''||scope.row.otherTel2!=''"-->
            <!--&gt;-->
            <!--<el-dropdown-->
            <!--@command="handleCommand(scope.row)"-->
            <!--placement="bottom"-->
            <!--trigger="click"-->
            <!--@visible-change="changeDropdown"-->
            <!--&gt;-->
            <!--<span class="el-dropdown-link">-->
            <!--{{scope.row.number}}-->
            <!--<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
            <!--</span>-->
            <!--<el-dropdown-menu slot="dropdown">-->
            <!--<el-dropdown-item command="a" v-if="scope.row.otherTel">-->
            <!--<div @mouseover="elDropdownItem(1)" class="dropdownDiv">-->
            <!--<span>手机2: {{scope.row.otherTel}}</span>-->
            <!--<span-->
            <!--v-if="showSpanImg==1"-->
            <!--style="display: inline-block;width:13px;padding-left: 30px"-->
            <!--&gt;-->
            <!--<img-->
            <!--style="width: 100%;height: 100%"-->
            <!--src="/static/img/icon/dailCall.png"-->
            <!--/>-->
            <!--</span>-->
            <!--</div>-->
            <!--</el-dropdown-item>-->
            <!--<el-dropdown-item command="b" v-if="scope.row.officeTel">-->
            <!--<div @mouseover="elDropdownItem(2)" class="dropdownDiv">-->
            <!--<span>办公电话: {{scope.row.officeTel}}</span>-->
            <!--<span-->
            <!--v-if="showSpanImg==2"-->
            <!--style="display: inline-block;width:13px;padding-left: 30px"-->
            <!--&gt;-->
            <!--<img-->
            <!--style="width: 100%;height: 100%"-->
            <!--src="/static/img/icon/dailCall.png"-->
            <!--/>-->
            <!--</span>-->
            <!--</div>-->
            <!--</el-dropdown-item>-->
            <!--<el-dropdown-item command="c" v-if="scope.row.homeTel">-->
            <!--<div @mouseover="elDropdownItem(3)" class="dropdownDiv">-->
            <!--<span>应急电话: {{scope.row.homeTel}}</span>-->
            <!--<span-->
            <!--v-if="showSpanImg==3"-->
            <!--style="display: inline-block;width:13px;padding-left: 30px"-->
            <!--&gt;-->
            <!--<img-->
            <!--style="width: 100%;height: 100%"-->
            <!--src="/static/img/icon/dailCall.png"-->
            <!--/>-->
            <!--</span>-->
            <!--</div>-->
            <!--</el-dropdown-item>-->
            <!--<el-dropdown-item command="d" v-if="scope.row.otherTel2">-->
            <!--<div @mouseover="elDropdownItem(4)" class="dropdownDiv">-->
            <!--<span>其他电话: {{scope.row.otherTel2}}</span>-->
            <!--<span-->
            <!--v-if="showSpanImg==4"-->
            <!--style="display: inline-block;width:13px;padding-left: 30px"-->
            <!--&gt;-->
            <!--<img-->
            <!--style="width: 100%;height: 100%"-->
            <!--src="/static/img/icon/dailCall.png"-->
            <!--/>-->
            <!--</span>-->
            <!--</div>-->
            <!--</el-dropdown-item>-->
            <!--</el-dropdown-menu>-->
            <!--</el-dropdown>-->
            <!--</div>-->
            <!--<span v-else>{{scope.row.number}}</span>-->
            <!--</div>-->
            <!--<span v-else>{{scope.row.number}}</span>-->
            <!--</template>-->
          </el-table-column>
          <el-table-column label="操作" width="250px" align="center">
            <template slot-scope="scope">
              <!-- <el-tooltip class="item" effect="dark" content="设为常用联系人" placement="top">
                <i class="el-icon-star-on" @click="handSetToCommon(scope.row)" :style="{'font-size': '24px',color:scope.row.commonlyUsed==0?'#9FC8FE':'#FBC958'}"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="拨号" placement="top">
                <i class="el-icon-phone-outline" @click="addPhoneCall(scope.row)" style="font-size: 24px;margin-left: 1vw;color:#9FC8FE;"></i>
              </el-tooltip>-->
              <el-tooltip
                v-if="manageVisible"
                class="item"
                effect="dark"
                content="查看"
                placement="top"
              >
                <i
                  class="el-icon-info"
                  @click="watchContactDetails(scope.row)"
                  style="font-size: 24px; color: #9fc8fe; cursor: pointer"
                ></i>
              </el-tooltip>
              <el-tooltip
                v-if="!manageVisible"
                class="item"
                effect="dark"
                content="编辑"
                placement="top"
              >
                <i
                  class="el-icon-edit"
                  @click="
                    ['myData' + tabPosition].rowData = scope.row;
                    window.setTimeout(() => {
                      myEdit();
                    }, 500);
                  "
                  style="
                    font-size: 24px;
                    margin-left: 1vw;
                    color: #9fc8fe;
                    cursor: pointer;
                  "
                ></i>
              </el-tooltip>
              <el-tooltip
                v-if="!manageVisible"
                class="item"
                effect="dark"
                content="删除"
                placement="top"
              >
                <i
                  class="el-icon-delete-solid"
                  @click="
                    ['myData' + tabPosition].rowData = scope.row;
                    window.setTimeout(() => {
                      handleDeleteItem();
                    }, 500);
                  "
                  style="
                    font-size: 24px;
                    margin-left: 1vw;
                    color: #9fc8fe;
                    cursor: pointer;
                  "
                ></i>
              </el-tooltip>
              <!-- <el-tooltip class="item" effect="dark" content="设为常用联系人" placement="top">
                <i
                  class="el-icon-star-on"
                  @click="handSetToCommon(scope.row)"
                  :style="{'font-size': '24px','margin-left': '1vw',cursor: 'pointer',color:scope.row.commonlyUsed==0?'#9FC8FE':'#FBC958'}"
                ></i>
              </el-tooltip>-->
              <!-- <el-button type="primary" size="mini" @click="talkCall1(scope.row)">添加</el-button> -->
              <!-- <el-button type="primary" size="mini" @click="talkCall(scope.row)">拨号</el-button>
              <el-button type="primary" size="mini" @click="handSetToCommon(scope.row)">设为常用</el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-pagination
            class="pagination"
            background
            :page-size="myData4.pageSize"
            :page-sizes="[10, 20, 30, 40]"
            :total="myData4.total"
            :current-page="myData4.currentPage"
            @current-change="handCurrentChange"
            @size-change="handSizeChange"
            layout="total, prev, pager, next, sizes, jumper"
          ></el-pagination>
        </el-row>
      </div>
    </div>
    <div class="my-phone-main" v-if="tabPosition == 5">
      <div class="my-tree-box" style="box-sizing: border-box; overflow: auto">
        <el-scrollbar class="my-tree-scroll">
          <el-input
            placeholder="输入关键字进行搜索"
            v-model="myData5.filterTree"
            class="treeSearch"
            style="padding: 10px; box-sizing: border-box"
          >
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              @click="$refs.tree5.filter(myData5.filterTree)"
            ></i>
          </el-input>
          <el-tree
            :data="myData5.treeData"
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
            node-key="id"
            ref="tree5"
            highlight-current
            :default-expanded-keys="[expandId]"
            :props="defaultProps"
            draggable
            @node-drop="handleDrop"
            :allow-drop="allowDrop"
            :allow-drag="allowDrag"
            show-checkbox
            @check-change="handleCheckChange"
            @check="handleTreeCheck"
          >
            <span
              class="custom-tree-node"
              slot-scope="{ node, data }"
              :style="{
                display: 'flex',
                'align-items': 'center',
                position: 'relative',
                width: '100%',
              }"
              @mouseover="treeBtnHoverIndex = data.id"
              @mouseout="treeBtnHoverIndex = -2"
            >
              <span>{{ node.label }}</span>
              <span
                style="
                  display: flex;
                  position: absolute;
                  top: 50%;
                  left: 66%;
                  transform: translateY(-50%);
                "
                v-show="
                  treeBtnHoverIndex == data.id &&
                  !manageVisible &&
                  data.id != -1
                "
              >
                <div
                  style="display: flex; align-items: center; cursor: pointer"
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="编辑"
                    placement="top"
                  >
                    <img
                      :src="require('@/assets/icpImg/editTreeBtn.png')"
                      style="width: 1.3vw"
                      @click="editTreeItem(node, data)"
                    />
                  </el-tooltip>
                </div>
                <div
                  style="
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    margin-left: 5px;
                  "
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="删除"
                    placement="top"
                  >
                    <img
                      :src="require('@/assets/icpImg/deleteTreeBtn.png')"
                      style="width: 1.3vw"
                      @click="deleteTreeItem(node, data)"
                    />
                  </el-tooltip>
                </div>
              </span>
            </span>
          </el-tree>
        </el-scrollbar>
        <treeBtn
          v-if="!manageVisible"
          @changeDialog="closeDialog"
          @refreshData="refreshData"
          :treeDataItem="myData5.treeDataItem"
          :treeData="myData5.treeData"
          :formData="treeBtnConfig1"
          ref="treeBtn5"
          :treeDataItems="myData5.treeMultipleSelection"
          tabPosition="beiqinlianluowang"
        ></treeBtn>
        <!-- <el-alert title="温馨提示" type="info" description="可拖动修改同级分组排序" show-icon>
        </el-alert>-->
      </div>
      <div class="my-table-box" style="box-sizing: border-box; overflow: auto">
        <btn-box
          v-if="!manageVisible"
          :btnArry="btnArry2"
          v-bind="{
            add: { callback: addList },
            edit: { callback: myEdit },
            del: { callback: handleDelete },
            sort: { callback: handleSort },
            download: { callback: handleExportContactor },
            document: { callback: handleExportm },
          }"
          :batchJoinIsShow="true"
          @handleBatchJoin="handleBatchJoin"
          @success="batchJoinSuccess"
        ></btn-box>
        <el-row class="my-table-box-search" style="margin: 10px">
          <el-col :span="14">
            <el-input
              placeholder="请输入姓名/单位/职位/号码"
              class="searchInput"
              v-model="myData5.searchText"
              @input="handleSearch"
            ></el-input>
          </el-col>
          <el-col :span="10">
            <el-button
              type="primary"
              @click="handleSearch"
              style="margin-left: 10px"
              >搜索</el-button
            >
          </el-col>
        </el-row>
        <el-table
          ref="elTable5"
          :data="myData5.tableData"
          highlight-current-row
          :header-cell-style="{ background: '#E6E6E6', color: '#606266' }"
          style="min-height: 600px; width: 100%"
          @row-dblclick="handleRowDbClick"
          @row-click="handleRowClick"
          @selection-change="handleSelectionChange"
          @select="handleSelect"
          @select-all="selectAll"
        >
          <el-table-column type="selection"></el-table-column>
          <!-- <el-table-column type="index" width="50" show-overflow-tooltip  :resizable="false" align="center"></el-table-column> -->
          <el-table-column
            align="center"
            prop="name"
            show-overflow-tooltip
            :resizable="false"
            label="姓名"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="workUnit"
            show-overflow-tooltip
            :resizable="false"
            label="单位"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="position"
            show-overflow-tooltip
            :resizable="false"
            label="职位"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="number"
            show-overflow-tooltip
            :resizable="false"
            label="联系号码"
          >
            <!--<template slot-scope="scope">-->
            <!--<div v-if="scope.row.number">-->
            <!--<div-->
            <!--v-if="scope.row.otherTel!=''||scope.row.officeTel!=''||scope.row.homeTel!=''||scope.row.otherTel2!=''"-->
            <!--&gt;-->
            <!--<el-dropdown-->
            <!--@command="handleCommand(scope.row)"-->
            <!--placement="bottom"-->
            <!--trigger="click"-->
            <!--@visible-change="changeDropdown"-->
            <!--&gt;-->
            <!--<span class="el-dropdown-link">-->
            <!--{{scope.row.number}}-->
            <!--<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
            <!--</span>-->
            <!--<el-dropdown-menu slot="dropdown">-->
            <!--<el-dropdown-item command="a" v-if="scope.row.otherTel">-->
            <!--<div @mouseover="elDropdownItem(1)" class="dropdownDiv">-->
            <!--<span>手机2: {{scope.row.otherTel}}</span>-->
            <!--<span-->
            <!--v-if="showSpanImg==1"-->
            <!--style="display: inline-block;width:13px;padding-left: 30px"-->
            <!--&gt;-->
            <!--<img-->
            <!--style="width: 100%;height: 100%"-->
            <!--src="/static/img/icon/dailCall.png"-->
            <!--/>-->
            <!--</span>-->
            <!--</div>-->
            <!--</el-dropdown-item>-->
            <!--<el-dropdown-item command="b" v-if="scope.row.officeTel">-->
            <!--<div @mouseover="elDropdownItem(2)" class="dropdownDiv">-->
            <!--<span>办公电话: {{scope.row.officeTel}}</span>-->
            <!--<span-->
            <!--v-if="showSpanImg==2"-->
            <!--style="display: inline-block;width:13px;padding-left: 30px"-->
            <!--&gt;-->
            <!--<img-->
            <!--style="width: 100%;height: 100%"-->
            <!--src="/static/img/icon/dailCall.png"-->
            <!--/>-->
            <!--</span>-->
            <!--</div>-->
            <!--</el-dropdown-item>-->
            <!--<el-dropdown-item command="c" v-if="scope.row.homeTel">-->
            <!--<div @mouseover="elDropdownItem(3)" class="dropdownDiv">-->
            <!--<span>应急电话: {{scope.row.homeTel}}</span>-->
            <!--<span-->
            <!--v-if="showSpanImg==3"-->
            <!--style="display: inline-block;width:13px;padding-left: 30px"-->
            <!--&gt;-->
            <!--<img-->
            <!--style="width: 100%;height: 100%"-->
            <!--src="/static/img/icon/dailCall.png"-->
            <!--/>-->
            <!--</span>-->
            <!--</div>-->
            <!--</el-dropdown-item>-->
            <!--<el-dropdown-item command="d" v-if="scope.row.otherTel2">-->
            <!--<div @mouseover="elDropdownItem(4)" class="dropdownDiv">-->
            <!--<span>其他电话: {{scope.row.otherTel2}}</span>-->
            <!--<span-->
            <!--v-if="showSpanImg==4"-->
            <!--style="display: inline-block;width:13px;padding-left: 30px"-->
            <!--&gt;-->
            <!--<img-->
            <!--style="width: 100%;height: 100%"-->
            <!--src="/static/img/icon/dailCall.png"-->
            <!--/>-->
            <!--</span>-->
            <!--</div>-->
            <!--</el-dropdown-item>-->
            <!--</el-dropdown-menu>-->
            <!--</el-dropdown>-->
            <!--</div>-->
            <!--<span v-else>{{scope.row.number}}</span>-->
            <!--</div>-->
            <!--<span v-else>{{scope.row.number}}</span>-->
            <!--</template>-->
          </el-table-column>
          <el-table-column label="操作" width="250px" align="center">
            <template slot-scope="scope">
              <!-- <el-tooltip class="item" effect="dark" content="设为常用联系人" placement="top">
                <i class="el-icon-star-on" @click="handSetToCommon(scope.row)" :style="{'font-size': '24px',color:scope.row.commonlyUsed==0?'#9FC8FE':'#FBC958'}"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="拨号" placement="top">
                <i class="el-icon-phone-outline" @click="talkCall1(scope.row)" style="font-size: 24px;margin-left: 1vw;color:#9FC8FE;"></i>
              </el-tooltip>-->
              <el-tooltip
                v-if="manageVisible"
                class="item"
                effect="dark"
                content="查看"
                placement="top"
              >
                <i
                  class="el-icon-info"
                  @click="watchContactDetails(scope.row)"
                  style="font-size: 24px; color: #9fc8fe; cursor: pointer"
                ></i>
              </el-tooltip>
              <el-tooltip
                v-if="!manageVisible"
                class="item"
                effect="dark"
                content="编辑"
                placement="top"
              >
                <i
                  class="el-icon-edit"
                  @click="
                    ['myData' + tabPosition].rowData = scope.row;
                    window.setTimeout(() => {
                      myEdit();
                    }, 500);
                  "
                  style="
                    font-size: 24px;
                    margin-left: 1vw;
                    color: #9fc8fe;
                    cursor: pointer;
                  "
                ></i>
              </el-tooltip>
              <el-tooltip
                v-if="!manageVisible"
                class="item"
                effect="dark"
                content="删除"
                placement="top"
              >
                <i
                  class="el-icon-delete-solid"
                  @click="
                    ['myData' + tabPosition].rowData = scope.row;
                    window.setTimeout(() => {
                      handleDeleteItem();
                    }, 500);
                  "
                  style="
                    font-size: 24px;
                    margin-left: 1vw;
                    color: #9fc8fe;
                    cursor: pointer;
                  "
                ></i>
              </el-tooltip>
              <!-- <el-tooltip class="item" effect="dark" content="设为常用联系人" placement="top">
                <i
                  class="el-icon-star-on"
                  @click="handSetToCommon(scope.row)"
                  :style="{'font-size': '24px','margin-left': '1vw',cursor: 'pointer',color:scope.row.commonlyUsed==0?'#9FC8FE':'#FBC958'}"
                ></i>
              </el-tooltip>-->
              <!-- <el-button type="primary" size="mini" @click="talkCall1(scope.row)">添加</el-button> -->
              <!-- <el-button type="primary" size="mini" @click="talkCall(scope.row)">拨号</el-button>
              <el-button type="primary" size="mini" @click="handSetToCommon(scope.row)">设为常用</el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-pagination
            class="pagination"
            background
            :page-size="myData5.pageSize"
            :page-sizes="[10, 20, 30, 40]"
            :total="myData5.total"
            :current-page="myData5.currentPage"
            @current-change="handCurrentChange"
            @size-change="handSizeChange"
            layout="total, prev, pager, next, sizes, jumper"
          ></el-pagination>
        </el-row>
      </div>
    </div>
    <div class="my-phone-main" v-if="tabPosition == 6">
      <div class="my-tree-box" style="box-sizing: border-box; overflow: auto">
        <el-input
          placeholder="输入关键字进行搜索"
          v-model="myData6.filterTree"
          class="treeSearch"
          style="padding: 10px; box-sizing: border-box"
        >
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="$refs.tree6.filter(myData6.filterTree)"
          ></i>
        </el-input>
        <div style="max-height: 715px; overflow: auto">
          <el-tree
            :data="myData6.treeData"
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
            node-key="id"
            :default-expanded-keys="[expandId]"
            ref="tree6"
            highlight-current
            :props="defaultProps"
            show-checkbox
            @check-change="handleCheckChange"
            @check="handleTreeCheck"
          ></el-tree>
        </div>
      </div>
      <div class="my-table-box" style="box-sizing: border-box; overflow: auto">
        <el-row class="my-table-box-search" style="margin: 10px">
          <el-col :span="14">
            <el-input
              placeholder="请输入姓名/单位/职位/号码"
              class="searchInput"
              v-model="myData6.searchText"
            ></el-input>
          </el-col>
          <el-col :span="10">
            <el-button
              type="primary"
              @click="handleSearch"
              style="margin-left: 10px"
              >搜索</el-button
            >
          </el-col>
        </el-row>
        <el-table
          ref="elTable6"
          :data="myData6.tableData"
          highlight-current-row
          :header-cell-style="{ background: '#E6E6E6', color: '#606266' }"
          style="width: 100%; height: 600px; overflow: auto"
          @selection-change="handleSelectionChange"
          @select="handleSelect"
          @select-all="selectAll"
        >
          <el-table-column type="selection"></el-table-column>
          <!-- <el-table-column type="index" width="50" :resizable="false" align="center"></el-table-column> -->
          <el-table-column
            show-overflow-tooltip
            align="center"
            v-for="(item, key) in myData6.tableColumn"
            :key="key"
            :label="item.label"
            :prop="item.prop"
            :width="item.width"
            :resizable="false"
          ></el-table-column>
          <!-- <el-table-column label="操作" width="250px" align="center">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="设为常用联系人" placement="top">
                <i
                  class="el-icon-star-on"
                  @click="handSetToCommon(scope.row)"
                  :style="{'font-size': '24px','margin-left': '1vw',cursor: 'pointer',color:scope.row.commonlyUsed==0?'#9FC8FE':'#FBC958'}"
                ></i>
              </el-tooltip>
              <el-button type="primary" size="mini" @click="talkCall1(scope.row)">添加</el-button>
              <el-button type="primary" size="mini" @click="myEidt(scope.row)">修改</el-button>                               
            </template>
          </el-table-column>-->
        </el-table>
        <el-row>
          <el-pagination
            class="pagination"
            background
            :page-size="myData6.pageSize"
            :page-sizes="[10, 20, 30, 40]"
            :total="myData6.total"
            :current-page="myData6.currentPage"
            @current-change="handCurrentChange"
            @size-change="handSizeChange"
            layout="total, prev, pager, next, sizes, jumper"
          ></el-pagination>
        </el-row>
      </div>
    </div>
    <div class="my-phone-main" v-if="tabPosition == 7">
      <div class="my-tree-box" style="box-sizing: border-box; overflow: auto">
        <el-scrollbar class="my-tree-scroll">
          <el-input
            placeholder="输入关键字进行搜索"
            v-model="myData7.filterTree"
            class="treeSearch"
            style="padding: 10px; box-sizing: border-box"
          >
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              @click="$refs.tree7.filter(myData7.filterTree)"
            ></i>
          </el-input>
          <el-tree
            :data="myData7.treeData"
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
            node-key="id"
            ref="tree7"
            :default-expanded-keys="[expandId]"
            highlight-current
            :props="defaultProps"
            show-checkbox
            @check-change="handleCheckChange"
            @check="handleTreeCheck"
          >
            <span
              class="custom-tree-node"
              slot-scope="{ node, data }"
              :style="{
                display: 'flex',
                'align-items': 'center',
                position: 'relative',
                width: '100%',
              }"
              @mouseover="treeBtnHoverIndex = data.id"
              @mouseout="treeBtnHoverIndex = -2"
            >
              <span>{{ node.label }}</span>
              <span
                style="
                  display: flex;
                  position: absolute;
                  top: 50%;
                  left: 66%;
                  transform: translateY(-50%);
                "
                v-show="
                  treeBtnHoverIndex == data.id &&
                  !manageVisible &&
                  data.id != -1
                "
              >
                <div
                  style="display: flex; align-items: center; cursor: pointer"
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="编辑"
                    placement="top"
                  >
                    <img
                      :src="require('@/assets/icpImg/editTreeBtn.png')"
                      style="width: 1.3vw"
                      @click="editTreeItem(node, data)"
                    />
                  </el-tooltip>
                </div>
                <div
                  style="
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    margin-left: 5px;
                  "
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="删除"
                    placement="top"
                  >
                    <img
                      :src="require('@/assets/icpImg/deleteTreeBtn.png')"
                      style="width: 1.3vw"
                      @click="deleteTreeItem(node, data)"
                    />
                  </el-tooltip>
                </div>
              </span>
            </span>
          </el-tree>
        </el-scrollbar>
        <treeBtn
          v-if="!manageVisible"
          @changeDialog="closeDialog"
          @refreshData="refreshData"
          :treeDataItem="myData7.treeDataItem"
          :treeData="myData7.treeData1"
          :formData="formData3"
          ref="treeBtn7"
          :treeDataItems="myData7.treeMultipleSelection"
          tabPosition="jiqunfenzu"
        ></treeBtn>
      </div>
      <div class="my-table-box" style="box-sizing: border-box; overflow: auto">
        <btn-box
          v-if="!manageVisible"
          :btnArry="btnArry2"
          v-bind="{
            add: { callback: addList },
            edit: { callback: myEdit },
            del: { callback: handleDelete },
          }"
        ></btn-box>
        <el-row class="my-table-box-search" style="margin: 10px">
          <el-col :span="14">
            <el-input
              placeholder="请输入设备名称/号码"
              class="searchInput"
              v-model="myData7.searchText"
            ></el-input>
          </el-col>
          <el-col :span="10">
            <el-button
              type="primary"
              @click="handleSearch"
              style="margin-left: 10px"
              >搜索</el-button
            >
          </el-col>
        </el-row>
        <el-table
          ref="elTable7"
          :data="myData7.tableData"
          highlight-current-row
          :header-cell-style="{ background: '#E6E6E6', color: '#606266' }"
          style="width: 100%; height: 600px; overflow: auto"
          @row-click="handleRowClick"
          @row-dblclick="handleRowDbClick"
          @selection-change="handleSelectionChange"
          @select="handleSelect"
          @select-all="selectAll"
        >
          <el-table-column type="selection"></el-table-column>
          <!-- <el-table-column type="index" width="50" :resizable="false" align="center"></el-table-column> -->
          <el-table-column
            show-overflow-tooltip
            align="center"
            v-for="(item, key) in myData7.tableColumn"
            :key="key"
            :label="item.label"
            :prop="item.prop"
            :width="item.width"
            :resizable="false"
          ></el-table-column>
          <el-table-column label="操作" width="250px" align="center">
            <template slot-scope="scope">
              <el-tooltip
                v-if="manageVisible"
                class="item"
                effect="dark"
                content="查看"
                placement="top"
              >
                <i
                  class="el-icon-info"
                  @click="watchContactDetails(scope.row)"
                  style="font-size: 24px; color: #9fc8fe; cursor: pointer"
                ></i>
              </el-tooltip>
              <el-tooltip
                v-if="!manageVisible"
                class="item"
                effect="dark"
                content="编辑"
                placement="top"
              >
                <i
                  class="el-icon-edit"
                  @click="
                    ['myData' + tabPosition].rowData = scope.row;
                    window.setTimeout(() => {
                      myEdit();
                    }, 500);
                  "
                  style="
                    font-size: 24px;
                    margin-left: 1vw;
                    color: #9fc8fe;
                    cursor: pointer;
                  "
                ></i>
              </el-tooltip>
              <el-tooltip
                v-if="!manageVisible"
                class="item"
                effect="dark"
                content="删除"
                placement="top"
              >
                <i
                  class="el-icon-delete-solid"
                  @click="
                    ['myData' + tabPosition].rowData = scope.row;
                    window.setTimeout(() => {
                      myDel();
                    }, 500);
                  "
                  style="
                    font-size: 24px;
                    margin-left: 1vw;
                    color: #9fc8fe;
                    cursor: pointer;
                  "
                ></i>
              </el-tooltip>
              <!-- <el-tooltip class="item" effect="dark" content="设为常用联系人" placement="top">
                <i class="el-icon-star-on" @click="handSetToCommon(scope.row)" :style="{'font-size': '24px','margin-left': '1vw',cursor: 'pointer',color:scope.row.commonlyUsed==0?'#9FC8FE':'#FBC958'}"></i>
              </el-tooltip>-->
              <!-- <el-button type="primary" size="mini" @click="talkCall1(scope.row)">添加</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-pagination
            class="pagination"
            background
            :page-size="myData7.pageSize"
            :page-sizes="[10, 20, 30, 40]"
            :total="myData7.total"
            :current-page="myData7.currentPage"
            @current-change="handCurrentChange"
            @size-change="handSizeChange"
            layout="total, prev, pager, next, sizes, jumper"
          ></el-pagination>
        </el-row>
      </div>
    </div>
    <div class="my-phone-main" v-if="tabPosition == 8">
      <div class="my-tree-box" style="box-sizing: border-box; overflow: auto">
        <el-scrollbar class="my-tree-scroll">
          <el-input
            placeholder="输入关键字进行搜索"
            v-model="myData8.filterTree"
            class="treeSearch"
            style="padding: 10px; box-sizing: border-box"
          >
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              @click="$refs.tree8.filter(myData8.filterTree)"
            ></i>
          </el-input>
          <el-tree
            :data="myData8.treeData"
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
            node-key="id"
            ref="tree8"
            highlight-current
            :props="defaultProps"
            :default-expanded-keys="[expandId]"
            show-checkbox
            @check-change="handleCheckChange"
            @check="handleTreeCheck"
          >
            <span
              class="custom-tree-node"
              slot-scope="{ node, data }"
              :style="{
                display: 'flex',
                'align-items': 'center',
                position: 'relative',
                width: '100%',
              }"
              @mouseover="treeBtnHoverIndex = data.id"
              @mouseout="treeBtnHoverIndex = -2"
            >
              <span>{{ node.label }}</span>
              <span
                style="
                  display: flex;
                  position: absolute;
                  top: 50%;
                  left: 66%;
                  transform: translateY(-50%);
                "
                v-show="
                  treeBtnHoverIndex == data.id &&
                  !manageVisible &&
                  data.id != -1
                "
              >
                <div
                  style="display: flex; align-items: center; cursor: pointer"
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="编辑"
                    placement="top"
                  >
                    <img
                      :src="require('@/assets/icpImg/editTreeBtn.png')"
                      style="width: 1.3vw"
                      @click="editTreeItem(node, data)"
                    />
                  </el-tooltip>
                </div>
                <div
                  style="
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    margin-left: 5px;
                  "
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="删除"
                    placement="top"
                  >
                    <img
                      :src="require('@/assets/icpImg/deleteTreeBtn.png')"
                      style="width: 1.3vw"
                      @click="deleteTreeItem(node, data)"
                    />
                  </el-tooltip>
                </div>
              </span>
            </span>
          </el-tree>
        </el-scrollbar>
        <treeBtn
          v-if="!manageVisible"
          @changeDialog="closeDialog"
          @refreshData="refreshData"
          :treeDataItem="myData8.treeDataItem"
          :treeData="myData8.treeData"
          :formData="ropData"
          ref="treeBtn8"
          :treeDataItems="myData8.treeMultipleSelection"
          tabPosition="ziyuanlianluowang"
        ></treeBtn>
      </div>
      <div class="my-table-box" style="box-sizing: border-box; overflow: auto">
        <btn-box
          v-if="!manageVisible"
          :btnArry="btnArry2"
          v-bind="{
            add: { callback: addList },
            edit: { callback: myEdit },
            del: { callback: handleDelete },
          }"
        ></btn-box>
        <el-row class="my-table-box-search" style="margin: 10px">
          <el-col :span="14">
            <el-input
              placeholder="请输入姓名/单位/职位/号码"
              class="searchInput"
              v-model="myData8.searchText"
            ></el-input>
          </el-col>
          <el-col :span="10">
            <el-button
              type="primary"
              @click="handleSearch"
              style="margin-left: 10px"
              >搜索</el-button
            >
          </el-col>
        </el-row>
        <el-table
          ref="elTable8"
          :data="myData8.tableData"
          highlight-current-row
          :header-cell-style="{ background: '#E6E6E6', color: '#606266' }"
          style="width: 100%; height: 600px; overflow: auto"
          @row-click="handleRowClick"
          @row-dblclick="handleRowDbClick"
          @selection-change="handleSelectionChange"
          @select="handleSelect"
          @select-all="selectAll"
        >
          <el-table-column type="selection"></el-table-column>
          <!-- <el-table-column type="index" width="50" :resizable="false" align="center"></el-table-column> -->
          <el-table-column
            show-overflow-tooltip
            align="center"
            v-for="(item, key) in myData8.tableColumn"
            :key="key"
            :label="item.label"
            :prop="item.prop"
            :width="item.width"
            :resizable="false"
          ></el-table-column>
          <el-table-column label="操作" width="250px" align="center">
            <template slot-scope="scope">
              <el-tooltip
                v-if="manageVisible"
                class="item"
                effect="dark"
                content="查看"
                placement="top"
              >
                <i
                  class="el-icon-info"
                  @click="watchContactDetails(scope.row)"
                  style="font-size: 24px; color: #9fc8fe; cursor: pointer"
                ></i>
              </el-tooltip>
              <el-tooltip
                v-if="!manageVisible"
                class="item"
                effect="dark"
                content="编辑"
                placement="top"
              >
                <i
                  class="el-icon-edit"
                  @click="
                    ['myData' + tabPosition].rowData = scope.row;
                    window.setTimeout(() => {
                      myEdit();
                    }, 500);
                  "
                  style="
                    font-size: 24px;
                    margin-left: 1vw;
                    color: #9fc8fe;
                    cursor: pointer;
                  "
                ></i>
              </el-tooltip>
              <el-tooltip
                v-if="!manageVisible"
                class="item"
                effect="dark"
                content="删除"
                placement="top"
              >
                <i
                  class="el-icon-delete-solid"
                  @click="
                    ['myData' + tabPosition].rowData = scope.row;
                    window.setTimeout(() => {
                      handleDeleteItem();
                    }, 500);
                  "
                  style="
                    font-size: 24px;
                    margin-left: 1vw;
                    color: #9fc8fe;
                    cursor: pointer;
                  "
                ></i>
              </el-tooltip>
              <!-- <el-tooltip class="item" effect="dark" content="设为常用联系人" placement="top">
                <i
                  class="el-icon-star-on"
                  @click="handSetToCommon(scope.row)"
                  :style="{'font-size': '24px','margin-left': '1vw',cursor: 'pointer',color:scope.row.commonlyUsed==0?'#9FC8FE':'#FBC958'}"
                ></i>
              </el-tooltip>-->
              <!-- <el-button type="primary" size="mini" @click="talkCall1(scope.row)">添加</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-pagination
            class="pagination"
            background
            :page-size="myData8.pageSize"
            :page-sizes="[10, 20, 30, 40]"
            :total="myData8.total"
            :current-page="myData8.currentPage"
            @current-change="handCurrentChange"
            @size-change="handSizeChange"
            layout="total, prev, pager, next, sizes, jumper"
          ></el-pagination>
        </el-row>
      </div>
    </div>

    <div class="my-phone-main" v-if="tabPosition == 11">
      <div class="my-tree-box" style="box-sizing: border-box; overflow: auto">
        <el-input
          placeholder="输入关键字进行搜索"
          v-model="myData11.filterTree"
          class="treeSearch"
          style="padding: 10px; box-sizing: border-box"
        >
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="$refs.tree11.filter(myData11.filterTree)"
          ></i>
        </el-input>
        <div style="max-height: 715px; overflow: auto">
          <el-tree
            :data="myData11.treeData"
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
            node-key="id"
            ref="tree11"
            :default-expanded-keys="[expandId]"
            highlight-current
            :props="defaultProps"
            show-checkbox
            @check-change="handleCheckChange"
            @check="handleTreeCheck"
          ></el-tree>
        </div>
      </div>
      <div class="my-table-box" style="box-sizing: border-box; overflow: auto">
        <el-row class="my-table-box-search" style="margin: 10px">
          <el-col :span="14">
            <el-input
              placeholder="请输入姓名/单位/职位/号码"
              class="searchInput"
              v-model="myData11.searchText"
            ></el-input>
          </el-col>
          <el-col :span="10">
            <el-button
              type="primary"
              @click="handleSearch"
              style="margin-left: 10px"
              >搜索</el-button
            >
          </el-col>
        </el-row>
        <el-table
          ref="elTable11"
          :data="myData11.tableData"
          highlight-current-row
          :header-cell-style="{ background: '#E6E6E6', color: '#606266' }"
          style="width: 100%; height: 600px; overflow: auto"
          @selection-change="handleSelectionChange"
          @select="handleSelect"
          @select-all="selectAll"
        >
          <el-table-column type="selection"></el-table-column>
          <!-- <el-table-column type="index" width="50" :resizable="false" align="center"></el-table-column> -->
          <el-table-column
            show-overflow-tooltip
            align="center"
            v-for="(item, key) in myData11.tableColumn"
            :key="key"
            :label="item.label"
            :prop="item.prop"
            :width="item.width"
            :resizable="false"
          ></el-table-column>
          <el-table-column label="操作" width="250px" align="center">
            <template slot-scope="scope">
              <!-- 
                    @authorName: qinjiaqi
                    @description：查看按钮 
                -->
              <el-tooltip
                v-if="manageVisible"
                class="item"
                effect="dark"
                content="查看"
                placement="top"
              >
                <i
                  class="el-icon-info"
                  @click="watchContactDetails(scope.row)"
                  style="font-size: 24px; color: #9fc8fe; cursor: pointer"
                >
                </i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-pagination
            class="pagination"
            background
            :page-size="myData11.pageSize"
            :page-sizes="[10, 20, 30, 40]"
            :total="myData11.total"
            :current-page="myData11.currentPage"
            @current-change="handCurrentChange"
            @size-change="handSizeChange"
            layout="total, prev, pager, next, sizes, jumper"
          ></el-pagination>
        </el-row>
      </div>
    </div>

    <div class="my-phone-main" v-if="tabPosition == 12">
      <div class="my-tree-box" style="box-sizing: border-box; overflow: auto">
        <el-scrollbar class="my-tree-scroll">
          <el-input
            placeholder="输入关键字进行搜索"
            v-model="myData12.filterTree"
            class="treeSearch"
            style="padding: 10px; box-sizing: border-box"
          >
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              @click="$refs.tree12.filter(myData12.filterTree)"
            ></i>
          </el-input>
          <el-tree
            :data="myData12.treeData"
            v-loading="myData12.myLoading"
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
            node-key="id"
            ref="tree10"
            :default-expanded-keys="[expandId]"
            highlight-current
            :props="defaultProps"
            show-checkbox
            @check-change="handleCheckChange"
            @check="handleTreeCheck"
          >
            <span
              class="custom-tree-node"
              slot-scope="{ node, data }"
              :style="{
                display: 'flex',
                'align-items': 'center',
                position: 'relative',
                width: '100%',
              }"
              @mouseover="treeBtnHoverIndex = data.id"
              @mouseout="treeBtnHoverIndex = -2"
            >
              <span>{{ node.label }}</span>
              <span
                style="
                  display: flex;
                  position: absolute;
                  top: 50%;
                  left: 66%;
                  transform: translateY(-50%);
                "
                v-show="
                  treeBtnHoverIndex == data.id &&
                  !manageVisible &&
                  data.id != -1
                "
              >
                <div
                  style="display: flex; align-items: center; cursor: pointer"
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="编辑"
                    placement="top"
                  >
                    <img
                      :src="require('@/assets/icpImg/editTreeBtn.png')"
                      style="width: 1.3vw"
                      @click="editTreeItem(node, data)"
                    />
                  </el-tooltip>
                </div>
                <div
                  style="
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    margin-left: 5px;
                  "
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="删除"
                    placement="top"
                  >
                    <img
                      :src="require('@/assets/icpImg/deleteTreeBtn.png')"
                      style="width: 1.3vw"
                      @click="deleteTreeItem(node, data)"
                    />
                  </el-tooltip>
                </div>
              </span>
            </span>
          </el-tree>
        </el-scrollbar>
        <treeBtn
          v-if="!manageVisible"
          @changeDialog="closeDialog"
          @refreshData="refreshData"
          :treeDataItem="myData12.treeDataItem"
          :treeDataItems="myData12.treeMultipleSelection"
          tabPosition="ziyuanlianluowang"
          :treeData="myData12.treeData"
          :formData="treeBtnConfig2"
          ref="treeBtn12"
        ></treeBtn>
      </div>
      <div class="my-table-box" style="box-sizing: border-box; overflow: auto">
        <btn-box
          v-if="!manageVisible"
          :btnArry="[
            {
              event: 'del',
              icon: 'el-icon-delete',
              title: '批量移除',
            },
            {
              event: 'select',
              title: '选择联系人',
            },
          ]"
          v-bind="{
            add: { callback: addList },
            del: { callback: handleDelete },
            select: { callback: handleSelectContactor },
          }"
        ></btn-box>
        <el-row class="my-table-box-search" style="margin: 10px">
          <el-col :span="14">
            <el-input
              placeholder="请输入姓名/单位/职位/号码"
              class="searchInput"
              v-model="myData12.searchText"
              @input="handleSearch"
            ></el-input>
          </el-col>
          <el-col :span="10">
            <el-button
              type="primary"
              @click="handleSearch"
              style="margin-left: 10px"
              >搜索</el-button
            >
          </el-col>
        </el-row>
        <el-table
          ref="elTable7"
          :data="myData12.tableData"
          highlight-current-row
          :header-cell-style="{ background: '#E6E6E6', color: '#606266' }"
          style="width: 100%; height: 600px; overflow: auto"
          @row-dblclick="handleRowDbClick"
          @row-click="handleRowClick"
          @selection-change="handleSelectionChange"
          @select="handleSelect"
          @select-all="selectAll"
        >
          <el-table-column type="selection"></el-table-column>
          <!-- <el-table-column type="index" width="50" :resizable="false" align="center"></el-table-column> -->
          <el-table-column
            show-overflow-tooltip
            align="center"
            v-for="(item, key) in myData12.tableColumn"
            :key="key"
            :label="item.label"
            :prop="item.prop"
            :width="item.width"
            :resizable="false"
          ></el-table-column>
          <el-table-column label="操作" width="250px" align="center">
            <template slot-scope="scope">
              <!-- <el-button type="primary" size="mini" @click="addCallSms(scope.row)">添加</el-button>
              <el-button type="primary" size="mini" @click="handSetToCommon(scope.row)">设为常用</el-button>-->
              <el-tooltip
                v-if="manageVisible"
                class="item"
                effect="dark"
                content="查看"
                placement="top"
              >
                <i
                  class="el-icon-info"
                  @click="watchContactDetails(scope.row)"
                  style="font-size: 24px; color: #9fc8fe; cursor: pointer"
                ></i>
              </el-tooltip>
              <el-tooltip
                v-if="!manageVisible"
                class="item"
                effect="dark"
                content="编辑"
                placement="top"
              >
                <i
                  class="el-icon-edit"
                  @click="
                    ['formData' + tabPosition].rowData = scope.row;
                    window.setTimeout(() => {
                      handleEdit();
                    }, 500);
                  "
                  style="
                    font-size: 24px;
                    margin-left: 1vw;
                    color: #9fc8fe;
                    cursor: pointer;
                  "
                ></i>
              </el-tooltip>
              <el-tooltip
                v-if="!manageVisible"
                class="item"
                effect="dark"
                content="删除"
                placement="top"
              >
                <i
                  class="el-icon-delete-solid"
                  @click="
                    ['formData' + tabPosition].rowData = scope.row;
                    window.setTimeout(() => {
                      handleDeleteItem();
                    }, 500);
                  "
                  style="
                    font-size: 24px;
                    margin-left: 1vw;
                    color: #9fc8fe;
                    cursor: pointer;
                  "
                ></i>
              </el-tooltip>
              <!-- <el-tooltip class="item" effect="dark" content="设为常用联系人" placement="top">
                    <i class="el-icon-star-on" @click="handSetToCommon(scope.row)" :style="{'font-size': '24px','margin-left': '1vw',cursor: 'pointer',color:scope.row.commonlyUsed==0?'#9FC8FE':'#FBC958'}"></i>
              </el-tooltip>-->
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-pagination
            class="pagination"
            background
            :page-size="myData12.pageSize"
            :page-sizes="[10, 20, 30, 40]"
            :total="myData12.total"
            :current-page="myData12.currentPage"
            @current-change="handCurrentChange"
            @size-change="handSizeChange"
            layout="total, prev, pager, next, sizes, jumper"
          ></el-pagination>
        </el-row>
      </div>
    </div>

    <contact-details-popup
      ref="ContactDetailsPopup"
      @getContactorList="refreshTable"
    ></contact-details-popup>
    <video-dialog ref="VideoDialog" @getVideoList="getVideoList"></video-dialog>
    <watch-video-dialog ref="watchVideoDialog"></watch-video-dialog>
    <terminal-dialog
      ref="TerminalDialog"
      @getTerminalListData="getTerminalListData"
    ></terminal-dialog>
    <watch-terminal-dialog ref="watchTerminalDialog"></watch-terminal-dialog>
    <cluster-dialog
      ref="ClusterDialog"
      @getTableData="getTableData"
    ></cluster-dialog>
    <watch-cluster-dialog ref="watchClusterDialog"></watch-cluster-dialog>
    <watch-contact-details ref="watchContactDetails"></watch-contact-details>

    <!-- 通讯录 -->
    <add-contact
      ref="addContact"
      v-if="addContactVisible"
      @changeDialog="addContactVisible = false"
    ></add-contact>
  </div>
</template>

<script>
import mixin from "./mixin.js";
import treeBtn from "@/components/phoneNew/treeBtnNotExport";
import btnBox from "@/components/phoneNew/btnBox";
import ContactDetailsPopup from "@/view/integratedCommunication/contactDetailsPopup";
import watchContactDetails from "@/view/integratedCommunication/watchContactDetails";
import ContactSortingPopup from "@/view/integratedCommunication/contactSortingPopup";
import VideoDialog from "@/view/integratedCommunication/icpVideo/videoDialog";
import watchVideoDialog from "@/view/integratedCommunication/icpVideo/watchVideoDialog";
import TerminalDialog from "@/view/integratedCommunication/icpVideo/terminalDialog";
import watchTerminalDialog from "@/view/integratedCommunication/icpVideo/watchTerminalDialog";
import ClusterDialog from "@/view/integratedCommunication/icpVideo/clusterDialog";
import watchClusterDialog from "@/view/integratedCommunication/icpVideo/watchClusterDialog";
import { mapGetters } from "vuex";
import addContact from "./smsStep/addContact/AddContact";
import bus from "@/components/common/js/eventBus";
export default {
  mixins: [mixin],
  components: {
    treeBtn,
    btnBox,
    ContactDetailsPopup,
    watchContactDetails,
    ContactSortingPopup,
    VideoDialog,
    watchVideoDialog,
    TerminalDialog,
    watchTerminalDialog,
    ClusterDialog,
    watchClusterDialog,
    addContact,
  },
  data() {
    return {
      expandId: "",
      addContactVisible: false, //选择通讯录
      tableColumn3: [
        {
          prop: "name",
          label: "姓名",
        },
        {
          prop: "workUnit",
          label: "单位",
        },
        {
          prop: "position",
          label: "职位",
        },
        {
          prop: "call",
          label: "联系号码",
        },
      ],
      treeBtnHoverIndex: -2,
      window: window,
      manageVisible: true, //图标管理功能切换
      filterTextAffair: "", //政务联络网筛选
      showSpanImg: 0,
      filterText: "",
      searchText: "",
      rowData: [], //行表格数据
      dialogVisible: true,
      treeBtnConfig1: {
        pid: 0,
        ref: "video",
        code: "",
        name: "备勤联络网",
      },
      treeBtnConfig2: {
        pid: 0,
        code: "quick",
        ref: "video",
        name: "快捷组",
      },
      myData: {
        pid: 0,
        ref: "video",
        code: "phone",
        name: "政务联络网",
      },
      ropData: {
        pid: 0,
        ref: "video",
        code: "resource",
        name: "资源联络网",
      },
      formData1: {
        pid: 0,
        ref: "video",
        code: "VideoGroup",
        name: "监控视频",
      },
      formData2: {
        pid: 0,
        ref: "video",
        code: "VideoTerminalGroup",
        name: "会场终端",
      },
      formData3: {
        pid: 0,
        ref: "video",
        code: "GroupTalk",
        name: "集群分组",
      },

      defaultProps: {
        children: "children",
        label: "name",
        plusIcon: true,
      },
      //按钮切换
      phoneList: [
        {
          name: "政务联络网",
          label: "3",
        },
        {
          name: "应急联动网",
          label: "6",
        },
        {
          name: "基层联络网",
          label: "4",
        },
        {
          name: "备勤联络网",
          label: "5",
        },
        {
          name: "资源联络网",
          label: "8",
        },
        window.g.IsSuZhouPorject
          ? {
              name: "工业园区管委会通讯录",
              label: "11",
            }
          : null,
        {
          name: "快捷组",
          label: "12",
        },
      ],
      //按钮切换
      shipinList: [
        {
          name: "政务联络网",
          label: "3",
        },
        {
          name: "应急联动网",
          label: "6",
        },
        {
          name: "基层联络网",
          label: "4",
        },
        {
          name: "备勤联络网",
          label: "5",
        },
        {
          name: "资源联络网",
          label: "8",
        },
        {
          name: " 监控视频",
          label: "1",
        },
        {
          name: "会场终端",
          label: "2",
        },
        {
          name: "集群分组",
          label: "7",
        },
        window.g.IsSuZhouPorject
          ? {
              name: "工业园区管委会通讯录",
              label: "11",
            }
          : null,
        // { 视频会议不需要快捷组，先隐藏
        //   name: "快捷组",
        //   label: "12",
        // },
      ],
      //按钮切换
      clusterList: [
        {
          name: "政务联络网",
          label: "3",
        },
        {
          name: "应急联动网",
          label: "6",
        },
        {
          name: "基层联络网",
          label: "4",
        },
        {
          name: "备勤联络网",
          label: "5",
        },
        {
          name: "资源联络网",
          label: "8",
        },
        // {
        //   name: "监控视频",
        //   label: "1"
        // },
        {
          name: "会场终端",
          label: "2",
        },
        {
          name: "集群分组",
          label: "7",
        },
        window.g.IsSuZhouPorject
          ? {
              name: "工业园区管委会通讯录",
              label: "11",
            }
          : null,
        {
          name: "快捷组",
          label: "12",
        },
      ],
      myData1: {
        //视频分组
        tableColumn: [
          {
            prop: "name",
            label: "设备名称",
          },
          {
            prop: "indexCode",
            label: "号码",
          },
        ], //表头
        currentPage: 1,
        total: 0, //数据总数
        pageSize: 10, //总页数
        rowData: null, //表格选择数据
        treeData: [],
        tableData: [], //表格数据
        treeDataItem: {},
        groupId: -1,
        searchText: "",
        filterTree: "", //树状列表输入框过滤
        tableMultipleSelection: [], //列表勾选的选项
        treeMultipleSelection: [], //树状分组勾选的选项
      },
      myData2: {
        //终端分组
        tableColumn: [
          {
            prop: "name",
            label: "设备名称",
          },
          {
            prop: "uri",
            label: "号码",
          },
        ], //表头
        currentPage: 1,
        total: 0, //数据总数
        pageSize: 10, //总页数
        rowData: null, //表格选择数据
        treeData: [],
        treeData1: [], // 新增分组的树
        tableData: [], //表格数据
        treeDataItem: {},
        groupId: 0,
        searchText: "",
        filterTree: "", //树状列表输入框过滤
        tableMultipleSelection: [], //列表勾选的选项
        treeMultipleSelection: [], //树状分组勾选的选项
      },
      myData3: {
        //政务联络网
        tableColumn: [
          {
            prop: "name",
            label: "姓名",
          },
          {
            prop: "workUnit",
            label: "单位",
          },
          {
            prop: "position",
            label: "职位",
          },
          {
            prop: "number",
            label: "联系号码",
          },
        ], //表头
        currentPage: 1,
        total: 0, //数据总数
        pageSize: 10, //总页数
        rowData: null, //表格选择数据
        treeData: [],
        tableData: [], //表格数据
        treeDataItem: {},
        groupId: "",
        searchText: "",
        filterTree: "", //树状列表输入框过滤
        tableMultipleSelection: [], //列表勾选的选项
        treeMultipleSelection: [], //树状分组勾选的选项
      },
      myData9: {
        //常用联系人
        tableColumn: [
          {
            prop: "name",
            label: "姓名",
          },
          {
            prop: "workUnit",
            label: "单位",
          },
          {
            prop: "position",
            label: "职位",
          },
          {
            prop: "number",
            label: "联系号码",
          },
          {
            prop: "updateTime",
            label: "更新时间",
          },
        ], //表头
        currentPage: 1,
        total: 0, //数据总数
        pageSize: 10, //总页数
        rowData: null, //表格选择数据
        treeData: [],
        tableData: [], //表格数据
        treeDataItem: {},
        groupId: 0,
        searchText: "",
        filterTree: "", //树状列表输入框过滤
        tableMultipleSelection: [], //列表勾选的选项
        treeMultipleSelection: [], //树状分组勾选的选项
      },
      myData10: {
        //最近联系人
        tableColumn: [
          {
            prop: "name",
            label: "姓名",
          },
          {
            prop: "workUnit",
            label: "单位",
          },
          {
            prop: "position",
            label: "职位",
          },
          {
            prop: "mobile",
            label: "联系号码",
          },
          {
            prop: "updateTime",
            label: "更新时间",
          },
        ], //表头
        currentPage: 1,
        total: 0, //数据总数
        pageSize: 10, //总页数
        rowData: null, //表格选择数据
        treeData: [],
        tableData: [], //表格数据
        treeDataItem: {},
        groupId: 0,
        searchText: "",
        filterTree: "", //树状列表输入框过滤
        tableMultipleSelection: [], //列表勾选的选项
        treeMultipleSelection: [], //树状分组勾选的选项
      },
      //  myData4:{
      //      tableColumn: [
      //          {
      //           prop: "name",
      //           label: "姓名"
      //         }, {
      //           prop: "workUnit",
      //           label: "单位"
      //         }, {
      //           prop: "position",
      //           label: "职位"
      //         }, {
      //           prop: "number",
      //           label: "号码"
      //         }],//表头
      //       currentPage:1,
      //       total: 0,//数据总数
      //       pageSize: 10,//总页数
      //       rowData:null,//表格选择数据
      //       treeData:[],
      //       tableData: [],//表格数据
      //       treeDataItem:{},
      //       groupId:-1,
      //       searchText:'',
      // },
      // myData5:{//最近联系人
      //      tableColumn: [
      //        {
      //     prop: "contactor",
      //     label: "姓名"
      //   }, {
      //     prop: "workUnit",
      //     label: "单位"
      //   }, {
      //     prop: "position",
      //     label: "职位"
      //   },
      //   {
      //     prop: "direct",
      //     label: "状态"
      //   }, {
      //     prop: "startTime",
      //     label: "通话时间"
      //   }, {
      //     prop: "call",
      //     label: "联系号码"
      //   }],//表头
      //      currentPage:1,
      //       total: 0,//数据总数
      //       pageSize: 10,//总页数
      //       rowData:null,//表格选择数据
      //       treeData:[],
      //       tableData: [],//表格数据
      //       treeDataItem:{},
      //       groupId:-1,
      //       searchText:'',
      // },
      myData4: {
        //基层联络网
        searchText: "", //搜索
        currentPage: 1,
        total: 0, //数据总数
        pageSize: 10, //总页数
        rowData: null, //表格选择数据
        tableData: [], //表格数据
        myLoading: false,
        treeData: [],
        treeDataItem: {},
        manageVisible: true, //图标管理功能切换
        filterTree: "", //树状列表输入框过滤
        groupId: 0,
        filterTree: "", //树状列表输入框过滤
        tableMultipleSelection: [], //列表勾选的选项
        treeMultipleSelection: [], //树状分组勾选的选项
      },
      myData5: {
        //备勤联络网
        searchText: "", //搜索
        currentPage: 1,
        total: 0, //数据总数
        pageSize: 10, //总页数
        rowData: null, //表格选择数据
        tableData: [], //表格数据
        myLoading: false,
        treeData: [],
        treeDataItem: {},
        manageVisible: true, //图标管理功能切换
        filterTree: "", //树状列表输入框过滤
        groupId: 0,
        filterTree: "", //树状列表输入框过滤
        tableMultipleSelection: [], //列表勾选的选项
        treeMultipleSelection: [], //树状分组勾选的选项
      },
      myData6: {
        //应急联动网
        tableColumn: [
          {
            prop: "name",
            label: "姓名",
          },
          {
            prop: "workUnit",
            label: "单位",
          },
          {
            prop: "position",
            label: "职位",
          },
          {
            prop: "number",
            label: "联系号码",
          },
        ], //表头
        currentPage: 1,
        total: 0, //数据总数
        pageSize: 10, //总页数
        rowData: null, //表格选择数据
        treeData: [],
        tableData: [], //表格数据
        treeDataItem: {},
        groupId: -1,
        searchText: "",
        filterTree: "", //树状列表输入框过滤
        tableMultipleSelection: [], //列表勾选的选项
        treeMultipleSelection: [], //树状分组勾选的选项
      },
      myData11: {
        //工业园区管委会通讯录
        tableColumn: [
          {
            prop: "name",
            label: "姓名",
          },
          {
            prop: "workUnit",
            label: "单位",
          },
          {
            prop: "position",
            label: "职位",
          },
          {
            prop: "number",
            label: "联系号码",
          },
        ], //表头
        currentPage: 1,
        total: 0, //数据总数
        pageSize: 10, //总页数
        rowData: null, //表格选择数据
        treeData: [],
        tableData: [], //表格数据
        treeDataItem: {},
        groupId: -1,
        searchText: "",
        filterTree: "", //树状列表输入框过滤
        tableMultipleSelection: [], //列表勾选的选项
        treeMultipleSelection: [], //树状分组勾选的选项
      },
      myData12: {
        //工业园区管委会通讯录
        tableColumn: [
          {
            prop: "name",
            label: "姓名",
          },
          {
            prop: "workUnit",
            label: "单位",
          },
          {
            prop: "position",
            label: "职位",
          },
          {
            prop: "number",
            label: "联系号码",
          },
        ], //表头
        currentPage: 1,
        total: 0, //数据总数
        pageSize: 10, //总页数
        rowData: null, //表格选择数据
        treeData: [],
        tableData: [], //表格数据
        treeDataItem: {},
        groupId: -1,
        searchText: "",
        filterTree: "", //树状列表输入框过滤
        tableMultipleSelection: [], //列表勾选的选项
        treeMultipleSelection: [], //树状分组勾选的选项
      },
      myData8: {
        //资源联络网
        tableColumn: [
          {
            prop: "name",
            label: "姓名",
          },
          {
            prop: "workUnit",
            label: "单位",
          },
          {
            prop: "position",
            label: "职位",
          },
          {
            prop: "number",
            label: "联系号码",
          },
        ], //表头
        currentPage: 1,
        total: 0, //数据总数
        pageSize: 10, //总页数
        rowData: null, //表格选择数据
        treeData: [],
        tableData: [], //表格数据
        treeDataItem: {},
        groupId: 0,
        searchText: "",
        filterTree: "", //树状列表输入框过滤
        tableMultipleSelection: [], //列表勾选的选项
        treeMultipleSelection: [], //树状分组勾选的选项
      },
      myData7: {
        //集群分组
        tableColumn: [
          {
            prop: "name",
            label: "设备名称",
          },
          {
            prop: "code",
            label: "集群类型",
          },
          {
            prop: "number",
            label: "号码",
          },
          {
            prop: "remark",
            label: "备注",
          },
        ], //表头
        currentPage: 1,
        total: 0, //数据总数
        pageSize: 10, //总页数
        rowData: null, //表格选择数据
        treeData: [],
        treeData1: [], //新增组的树
        tableData: [], //表格数据
        treeDataItem: {},
        groupId: 0,
        searchText: "",
        filterTree: "", //树状列表输入框过滤
        tableMultipleSelection: [], //列表勾选的选项
        treeMultipleSelection: [], //树状分组勾选的选项
      },
      btnArry1: [
        {
          event: "refresh",
          icon: "el-icon-refresh",
          title: "更新分组",
          disabled: false,
        },
        {
          event: "refresh1",
          icon: "el-icon-refresh",
          title: "更新终端",
          disabled: false,
        },
        {
          event: "add",
          icon: "el-icon-plus",
          title: "新增",
        },
        {
          event: "edit",
          icon: "el-icon-edit",
          title: "修改",
        },
        {
          event: "del",
          icon: "el-icon-delete",
          title: "批量移除",
        },
      ],
      btnArry2: [
        {
          event: "add",
          icon: "el-icon-plus",
          title: "新增",
        },
        // {
        //   event: "edit",
        //   icon: "el-icon-edit",
        //   title: "修改"
        // },
        {
          event: "del",
          icon: "el-icon-delete",
          title: "批量移除",
        },
      ],
      btnArry3: [
        // {
        //   event: "edit",
        //   icon: "el-icon-edit",
        //   title: "修改"
        // },
        {
          event: "del",
          icon: "el-icon-delete",
          title: "批量移除",
        },
      ],
      tabPosition: 1,
      isExpand: false,
      HWICP_Version: window.g.HWICP_Version, //icp版本
      agent_id: sessionStorage.getItem("agent_id") || "",
      phoneState: true, //判断是否手机号
      filterTextVideo: "", // 视频分组筛选
      groupId: -1,
      DHWws: "",
      openThirdPartyVideoObj: {},
      tmpGroupId: "", // 当前点的组
    };
  },
  created() {
    this.getVideoGroupTree();
    this.getVideoList();
  },
  mounted() {
    this.DHWws = DHWs.getInstance();
    // 登录第三方平台
    this.DHWws.login(window.g.thirdPartyAccount);
    this.DHWws.on("loginState", (res) => {
      if (res) {
        // 登录成功
        // this.openThirdPartyVideo('11010704001320003001')
        // 11010704001320003001
        if (this.openThirdPartyVideoObj.state) {
          this.openThirdPartyVideo(this.openThirdPartyVideoObj.channelId);
        }
      } else {
        // 登录失败
        this.DHWws.login(window.g.thirdPartyAccount);
      }
    });

    this.$nextTick(() => {
      setTimeout(() => {
        this.$refs["tree" + this.tabPosition].setCheckedNodes(
          this.meetingTreeList["tree" + this.tabPosition]
        );

        console.log(
          "this.videoList是什么",
          this.$store,
          this.meetingTreeList,
          this.videoList
        );
        this.videoList.forEach((item) => {
          // console.log(
          //   "mounted里勾选表格item",
          //   item,
          //   this["myData" + this.tabPosition].tableData.filter(element => {
          //     return element.id == item.id;
          //   }),
          //   this["myData" + this.tabPosition].tableData
          // );
          if (
            this["myData" + this.tabPosition].tableData.filter((element) => {
              return element.id == item.id;
            }).length != 0
          ) {
            this.$refs["elTable" + this.tabPosition].toggleRowSelection(
              this["myData" + this.tabPosition].tableData.filter((element) => {
                return element.id == item.id;
              })[0],
              true
            );
          }
        });
      }, 800);
    });

    bus.$off("getMeetingContact");
    bus.$on("getMeetingContact", (checkData) => {
      if (checkData.length != 0) {
        let data = {
          contactorIds: checkData.map((v) => {
            return v.id;
          }),
          groupId: this.groupId,
        };
        this.$api.addContactorToGroup({ data }).then((res) => {
          if (res.errorcode != 0) {
            this.$message.error(res.msg);
            return;
          }
          this.getContactorList();
        });
      }
    });
  },
  watch: {
    videoList(val) {
      console.log("清空列表勾选");
      this.$refs["elTable" + this.tabPosition].clearSelection();
      if (this.tabPosition == 10) {
        this.videoList.forEach((item) => {
          if (
            this["myData" + this.tabPosition].tableData.filter((element) => {
              return element.call == (item.number ? item.number : item.call);
            }).length != 0
          ) {
            this.$refs["elTable" + this.tabPosition].toggleRowSelection(
              this["myData" + this.tabPosition].tableData.filter((element) => {
                return element.call == (item.number ? item.number : item.call);
              })[0],
              true
            );
          }
        });
      } else {
        this.videoList.forEach((item) => {
          if (
            this["myData" + this.tabPosition].tableData.filter((element) => {
              return element.id == item.id;
            }).length != 0
          ) {
            this.$refs["elTable" + this.tabPosition].toggleRowSelection(
              this["myData" + this.tabPosition].tableData.filter((element) => {
                return element.id == item.id;
              })[0],
              true
            );
          }
        });
      }
    },
    filterTextVideo(val) {
      this.$refs.tree.filter(val);
    },
    filterTextAffair(val) {
      this.$refs.tree.filter(val);
    },
    // 根据会议类型，显示不同联络网
    confType(newV) {
      // console.log('newV: ', newV);
      this.tabPosition = newV == 0 ? 3 : newV == 1 ? 1 : newV == 2 ? 7 : 3;
      this.changePage();
    },
  },
  computed: {
    ...mapGetters({
      videoList: "getConfMemberStatus1",
      videoNumber: "getvideoNumber",
      myVdcConfId: "getConfId",
      confStatus: "getConfStatus", //会议状态
      confType: "getVideoType", //会议类型
      meetingTreeList: "getMeetingTreeList", //会议树状分组队列
    }),
  },
  methods: {
    openThirdPartyVideo(channelId) {
      this.openThirdPartyVideoObj.channelId = channelId;
      if (this.DHWws.getLoginState()) {
        // 根据 channelId 播放实时视频。
        this.DHWws.openVideo([channelId]);
        this.openThirdPartyVideoObj.state = false;
      } else {
        this.openThirdPartyVideoObj.state = true;
        this.DHWws.login(window.g.thirdPartyAccount);
      }
    },
    //获取工业园区管委会树状分组
    getSuzhouGroupList() {
      this.$http({
        url: window.g.ApiUrl + "/eos/communication/group/suzhouGroupLIst",
        method: "post",
        data: {},
      }).then(({ data }) => {
        console.log("/eos/communication/group/suzhouGroupLIst", data);
        this.myData11.treeData = data.data;
      });
    },
    watchContactDetails(row) {
      this.$nextTick(() => {
        if (this.tabPosition == 1) {
          this.$refs.watchVideoDialog.isDialogVisible = true;
          this.$refs.watchVideoDialog.title = "查看视频信息";
          this.$refs.watchVideoDialog.getVideoGroupTree();
          this.$refs.watchVideoDialog.showData(row);
        } else if (this.tabPosition == 2) {
          this.$refs.watchTerminalDialog.isDialogVisible = true;
          this.$refs.watchTerminalDialog.title = "查看终端信息";
          this.$refs.watchTerminalDialog.getTerminalGroupListData();
          this.$refs.watchTerminalDialog.showData(row);
        } else if (this.tabPosition == 7) {
          this.$refs.watchClusterDialog.isDialogVisible = true;
          this.$refs.watchClusterDialog.title = "查看集群信息";
          this.$refs.watchClusterDialog.getPcode();
          this.$refs.watchClusterDialog.getTalkGroupListTree();
          this.$refs.watchClusterDialog.showData(row);
        } else {
          this.$refs.watchContactDetails.isDialogVisible = true;
          this.$refs.watchContactDetails.title = "查看联系人";
          this.$refs.watchContactDetails.getTree(
            this.tabPosition,
            this.groupId,
            this.tabName
          );
          this.$refs.watchContactDetails.showData(row);
        }
      });
    },
    handleBatchJoin() {
      let array = [
        { tabPosition: 1, value: "governmentAffairs", remark: "政务联络网" },
        { tabPosition: 5, value: "primaryLevel", remark: "基层联络网" },
        { tabPosition: 6, value: "spareTime", remark: "备勤联络网" },
        { tabPosition: 7, value: "resource", remark: "资源通讯录" },
        { tabPosition: 11, value: "suzhou", remark: "工业园区管委会通讯录" },
        { tabPosition: 12, value: "quick", remark: "快捷组" },
      ];
      let item = array.find((m) => m.tabPosition === this.tabPosition);
      if (item) {
        this.$store.commit("setGroupType", item.value);
        let groupId = this[`formData${this.tabPosition}`].groupId || 0;
        this.$store.commit("setGroupId", groupId);
      }
    },
    // 导入联系人成功回调
    batchJoinSuccess() {
      this.refreshData();
    },
    elDropdownItem(key) {
      if (key == 1) {
        this.showSpanImg = 1;
      }
      if (key == 2) {
        this.showSpanImg = 2;
      }
      if (key == 3) {
        this.showSpanImg = 3;
      }
      if (key == 4) {
        this.showSpanImg = 4;
      }
    },
    changeDropdown() {
      this.showSpanImg = 0;
    },
    handleCommand(row) {
      // 1>=手机2 row.otherTel  2>=办公电话 row.officeTel  3>=应急电话 row.homeTel 4>=其他电话 row.otherTel2
      let index = this.showSpanImg;
      let number;
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
          number = "";
          break;
      }
      // if(['',null].includes(number)){
      //   return
      // }
      this.$confirm("确认拨出该号码？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // this.$message({
          //   type: 'success',
          //   message: '确定!'
          // });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
      console.log(number);
    },
    handSetToCommon(row) {
      if (row.commonlyUsed == 0) {
        let data = { contactorId: row.id };
        this.$api.usedContactor(data).then((res) => {
          if (res.errorcode != 0) {
            this.$message.error(res.msg);
            return;
          }
          this.$message.success("已设为常用联系人!");
          switch (this.tabPosition) {
            case 1:
              this.getVideoList();
              break;
            case 2:
              this.getTerminalListData();
              break;
            case 3:
              this.changeCommonlyUsed(row);
              break;
            case 4:
              this.changeCommonlyUsed(row);
              break;
            case 5:
              this.changeCommonlyUsed(row);
              break;
            case 6:
              this.getEmergencyAddressData();
              break;
            case 7:
              this.getTableData();
              break;
            case 8:
              this.changeCommonlyUsed(row);
              break;
            case 9:
              this.getDataAl();
              break;
            case 11:
              this.getSuzhouGroupList();
              break;
            case 12:
              this.changeCommonlyUsed(row);
              break;
          }
        });
      } else {
        let data = {
          contactorId: row.id,
        };
        this.$confirm("是否将该联系人从常用联系人中移出", "移出常用联系人", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$api.removeCommonContactor(data).then((res) => {
              if (res.errorcode != 0) {
                this.$message({
                  message: res.msg,
                  type: "error",
                });
                return;
              }
              this.$message({
                message: "移出成功!",
                type: "success",
              });
              switch (this.tabPosition) {
                case 1:
                  this.getVideoList();
                  break;
                case 2:
                  this.getTerminalListData();
                  break;
                case 3:
                  this.changeCommonlyUsed(row);
                  break;
                case 4:
                  this.changeCommonlyUsed(row);
                  break;
                case 5:
                  this.changeCommonlyUsed(row);
                  break;
                case 6:
                  this.getEmergencyAddressData();
                  break;
                case 7:
                  this.getTableData();
                  break;
                case 8:
                  this.changeCommonlyUsed(row);
                  break;
                case 9:
                  this.getDataAl();
                  break;
                case 11:
                  this.getSuzhouGroupList();
                  break;
                case 12:
                  this.changeCommonlyUsed(row);
                  break;
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消!",
            });
            return;
          });
      }
    },
    handleSelectionChange(val) {
      console.log("列表选中了什么", val, this.videoList);
      this["myData" + this.tabPosition].tableMultipleSelection = val;
      if (this.manageVisible) {
        // this.$bus.$emit('clearNumber')
        // val.forEach(item=>{
        //   this.talkCall1(item)
        // })
      }
    },
    handleSelect(selection, row) {
      console.log("---当前列表行勾选了什么selection, row", selection, row);

      if (this.tabPosition == 10) {
        if (
          selection.filter((item) => {
            return item.call == row.call;
          }).length == 0
        ) {
          //证明取消勾选
          var temporaryVideoList = this.videoList.filter((item) => {
            return (item.number || item.call) != row.call;
          });
          this.$store.commit("SET_COMEMBER", temporaryVideoList);
        } else {
          var temporaryVideoList = this.videoList;
          if (!row.call) {
            this.$message.warning(`${row.name || row.contactor}联系号码为空`);
            return;
          }
          if (
            temporaryVideoList.filter((element) => {
              return (
                (element.number ? element.number : element.call) == row.call
              );
            }).length == 0
          ) {
            row.isTableSelect = true;
            temporaryVideoList.push(row);
            this.$store.commit("SET_COMEMBER", temporaryVideoList);
          }
        }
      } else {
        if (
          selection.filter((item) => {
            return item.id == row.id;
          }).length == 0
        ) {
          //证明取消勾选
          var temporaryVideoList = this.videoList.filter((item) => {
            return item.id != row.id;
          });
          console.log("--长度--", temporaryVideoList.length);
          this.$store.commit("SET_COMEMBER", temporaryVideoList);
        } else {
          var temporaryVideoList = this.videoList;
          if (
            temporaryVideoList.filter((item) => {
              return item.id == row.id;
            }).length == 0
          ) {
            if (this.tabPosition == 1) {
              row.meetingType = "1";
              console.log("row: ", row);
            } else if (this.tabPosition == 2) {
              row.meetingType = "2";
            } else if (this.tabPosition == 7) {
              row.meetingType = "7";
            } else {
              row.meetingType = "";
            }
            row.isTableSelect = true;
            this.talkCall1(row);
            // temporaryVideoList.push(row)
            // this.$store.commit("SET_COMEMBER", temporaryVideoList);
          }
        }
      }
    },
    // 处理不存在号码情况并返回不存在的号码[0]和存在的号码[1]的数组
    disposeNumber(rows) {
      console.log("---------", rows);
      // 拿到存在的号码
      let inNumberArr = [];
      // 处理不存在号码
      let notNumberArr = [];
      let notNumberNameArr = [];
      rows.forEach((row) => {
        if (row.number) {
          inNumberArr.push(row);
        } else {
          notNumberArr.push(row);
          if (row.name || row.name === "") {
            notNumberNameArr.push(row.name);
          } else {
            notNumberNameArr.push(row.contactor);
          }
        }
      });
      if (notNumberNameArr.length > 0) {
        let notNumberString = notNumberNameArr.join();
        console.log("号码为空对象:", notNumberString);
        this.$message({
          type: "warning",
          message: `(${notNumberString})号码为空`,
        });
        // this.$refs.faxTable.toggleRowSelection(notNumberArr)
      }
      return [notNumberArr, inNumberArr];
    },
    toggleRowSelection() {
      this["myData" + this.tabPosition].tableData.forEach((item) => {
        if (!item.number) {
          this.$refs["elTable" + this.tabPosition].toggleRowSelection(
            item,
            false
          );
        }
      });
    },
    selectAll(selection) {
      console.log("---tab", this.tabPosition);
      console.log("列表全选selection", selection);
      if (this.manageVisible) {
        if (
          this.tabPosition === 3 ||
          this.tabPosition === 4 ||
          this.tabPosition === 5 ||
          this.tabPosition === 6 ||
          this.tabPosition === 8
        ) {
          this.toggleRowSelection();
          this.disposeNumber(this["myData" + this.tabPosition].tableData);
        }
        var temporaryVideoList = this.videoList;
        if (selection.length != 0) {
          selection.forEach((item) => {
            if (this.tabPosition == 10) {
              if (!item.number) {
                this.$message.warning(
                  `${item.name || item.contactor}联系号码为空`
                );
                return;
              }
              if (
                temporaryVideoList.filter((element) => {
                  return (element.number || element.call) == item.call;
                }).length == 0
              ) {
                item.isTableSelect = true;
                temporaryVideoList.push(item);
                this.$store.commit("SET_COMEMBER", temporaryVideoList);
              }
            } else {
              if (
                temporaryVideoList.filter((element) => {
                  return element.id == item.id;
                }).length == 0
              ) {
                if (this.tabPosition == 1) {
                  item.meetingType = "1";
                  console.log("item: ", item);
                } else if (this.tabPosition == 2) {
                  item.meetingType = "2";
                } else if (this.tabPosition == 7) {
                  item.meetingType = "7";
                } else {
                  item.meetingType = "";
                }
                item.isTableSelect = true;
                this.talkCall1(item);
                // temporaryVideoList.push(item)
                // this.$store.commit("SET_COMEMBER", temporaryVideoList);
              }
            }
          });
        } else {
          if (this.tabPosition == 10) {
            this["myData" + this.tabPosition].tableData.forEach((item) => {
              temporaryVideoList = temporaryVideoList.filter((element) => {
                return (element.number || element.call) != item.id;
              });
              this.$store.commit("SET_COMEMBER", temporaryVideoList);
            });
          } else {
            this["myData" + this.tabPosition].tableData.forEach((item) => {
              temporaryVideoList = temporaryVideoList.filter((element) => {
                return element.id != item.id;
              });
              this.$store.commit("SET_COMEMBER", temporaryVideoList);
            });
          }
        }
      }
    },
    // 表格勾选状态 checked-> false:取消全选（有电话号码的联系人）,true:全选（有电话号码的联系人）
    tableCheckStatus(checked) {
      if (checked) {
        setTimeout(() => {
          this.videoList.forEach((item) => {
            if (
              this["myData" + this.tabPosition].tableData.filter((element) => {
                return element.id == item.id;
              }).length != 0
            ) {
              this.$refs["elTable" + this.tabPosition].toggleRowSelection(
                this["myData" + this.tabPosition].tableData.filter(
                  (element) => {
                    return element.id == item.id;
                  }
                )[0],
                true
              );
            }
          });
        }, 800);
      } else {
        setTimeout(() => {
          this["myData" + this.tabPosition].tableData.forEach((item) => {
            this.$refs["elTable" + this.tabPosition].toggleRowSelection(
              item,
              false
            );
            this.videoList.forEach((element, index) => {
              if (element.id == item.id) {
                this.videoList.splice(index, 1);
              }
            });
          });
          this.$store.commit("SET_COMEMBER", this.videoList);
        }, 800);
      }
    },
    handleCheckChange(data, checked, indeterminate) {
      if (this.tabPosition == 9 || this.tabPosition == 10) {
        this.tabPosition = 3;
      }
      console.log(
        "---handleCheckChange树状分组选中了什么",
        data,
        checked,
        indeterminate
      );
      if (checked) {
        this["myData" + this.tabPosition].treeMultipleSelection.push(data);
        this.tableCheckStatus(true);
      } else {
        this["myData" + this.tabPosition].treeMultipleSelection = this[
          "myData" + this.tabPosition
        ].treeMultipleSelection.filter(function (elem) {
          return elem.id != data.id;
        });
        console.log(
          'this["myData" + this.tabPosition].treeMultipleSelection: ',
          this["myData" + this.tabPosition].treeMultipleSelection
        );
        // if (this['myData' + this.tabPosition].treeMultipleSelection.length === 0) {
        //   this.$store.commit('SET_COMEMBER',[]) //当树状分组未被选中时，清空选中的数据
        // }
        if (
          this["myData" + this.tabPosition].treeMultipleSelection.length === 0
        ) {
          this.$store.commit("SET_COMEMBER", []);
        }
        this.tableCheckStatus(false);
        return;
      }

      if (this.manageVisible) {
        console.log(
          "this['myData' + this.tabPosition].treeMultipleSelection是什么",
          this["myData" + this.tabPosition].treeMultipleSelection
        );
        // this.$bus.$emit('clearNumber')
        if (
          this["myData" + this.tabPosition].treeMultipleSelection.length == 0
        ) {
          // setTimeout(()=>{
          //   this.$bus.$emit('clearNumber')
          // },500)
          return false;
        }
        if (
          this.tabPosition == 3 ||
          this.tabPosition == 4 ||
          this.tabPosition == 8 ||
          this.tabPosition == 5 ||
          this.tabPosition == 11 ||
          this.tabPosition == 12
        ) {
          this.$http({
            url:
              window.g.ApiUrl +
              "/eos/communication/group/findAllContactorInGroupAndLowerGroup",
            method: "post",
            data: {
              type: "meeting",
              groupIds: this[
                "myData" + this.tabPosition
              ].treeMultipleSelection.map(function (elem) {
                return elem.id;
              }),
            },
          }).then((res) => {
            console.log(
              "/eos/communication/group/findAllContactorInGroupAndLowerGroup",
              res
            );
            if (res.data.data && res.data.data.length != 0) {
              // var temporaryVideoList = this.videoList.filter(item => {
              //   return item.isTableSelect == true;
              // });
              var temporaryVideoList = this.videoList;
              console.log("temporaryVideoList:", temporaryVideoList);
              res.data.data.forEach((item) => {
                // if(item.mobile){
                // this.talkCall1(item)
                // }
                if (
                  temporaryVideoList.filter((element) => {
                    return element.id == item.id;
                  }).length == 0
                ) {
                  if (this.tabPosition == 1) {
                    item.meetingType = "1";
                    console.log("item: ", item);
                  } else if (this.tabPosition == 2) {
                    item.meetingType = "2";
                  } else if (this.tabPosition == 7) {
                    item.meetingType = "7";
                  } else {
                    item.meetingType = "";
                  }
                  console.log("------item:", item);
                  this.talkCall1(item);
                  // temporaryVideoList.push(item)
                  // this.$store.commit("SET_COMEMBER", temporaryVideoList);
                }
              });
            }
          });
        }
        if (this.tabPosition == 1) {
          this.$http({
            url:
              window.g.ApiUrl + "/eos/communication/video/findAllVideoInGroup",
            method: "post",
            data: {
              groupIds: this[
                "myData" + this.tabPosition
              ].treeMultipleSelection.map(function (elem) {
                return elem.id;
              }),
            },
          }).then((res) => {
            console.log("/eos/communication/video/findAllVideoInGroup", res);
            if (res.data.data && res.data.data.length != 0) {
              // var temporaryVideoList = this.videoList.filter(item => {
              //   return item.isTableSelect == true;
              // });
              var temporaryVideoList = this.videoList;
              res.data.data.forEach((item) => {
                // this.talkCall1(item)
                if (
                  temporaryVideoList.filter((element) => {
                    return element.id == item.id;
                  }).length == 0
                ) {
                  if (this.tabPosition == 1) {
                    item.meetingType = "1";
                    console.log("item: ", item);
                  } else if (this.tabPosition == 2) {
                    item.meetingType = "2";
                  } else if (this.tabPosition == 7) {
                    item.meetingType = "7";
                  } else {
                    item.meetingType = "";
                  }
                  this.talkCall1(item);
                  // temporaryVideoList.push(item)
                  // this.$store.commit("SET_COMEMBER", temporaryVideoList);
                }
              });
            }
          });
        }
        if (this.tabPosition == 2) {
          this.$http({
            url:
              window.g.ApiUrl +
              "/eos/communication/terminal/findAllTerminalInGroup",
            method: "post",
            data: {
              groupIds: this[
                "myData" + this.tabPosition
              ].treeMultipleSelection.map(function (elem) {
                return elem.id;
              }),
            },
          }).then((res) => {
            console.log(
              "/eos/communication/terminal/findAllTerminalInGroup",
              res
            );
            if (res.data.data && res.data.data.length != 0) {
              // var temporaryVideoList = this.videoList.filter(item => {
              //   return item.isTableSelect == true;
              // });
              var temporaryVideoList = this.videoList;

              res.data.data.forEach((item) => {
                // this.talkCall1(item)
                if (
                  temporaryVideoList.filter((element) => {
                    return element.id == item.id;
                  }).length == 0
                ) {
                  if (this.tabPosition == 1) {
                    item.meetingType = "1";
                    console.log("item: ", item);
                  } else if (this.tabPosition == 2) {
                    item.meetingType = "2";
                  } else if (this.tabPosition == 7) {
                    item.meetingType = "7";
                  } else {
                    item.meetingType = "";
                  }
                  this.talkCall1(item);
                  // temporaryVideoList.push(item)
                  // this.$store.commit("SET_COMEMBER", temporaryVideoList);
                }
              });
            }
          });
        }
        if (this.tabPosition == 7) {
          this.$http({
            url:
              window.g.ApiUrl +
              "/eos/communication/groupTalk/findAllTalkingGroupInGroup",
            method: "post",
            data: {
              groupIds: this[
                "myData" + this.tabPosition
              ].treeMultipleSelection.map(function (elem) {
                return elem.id;
              }),
            },
          }).then((res) => {
            console.log(
              "/eos/communication/groupTalk/findAllTalkingGroupInGroup",
              res
            );
            if (res.data.data && res.data.data.length != 0) {
              // var temporaryVideoList = this.videoList.filter(item => {
              //   return item.isTableSelect == true;
              // });
              var temporaryVideoList = this.videoList;

              res.data.data.forEach((item) => {
                // this.talkCall1(item)
                if (
                  temporaryVideoList.filter((element) => {
                    return element.id == item.id;
                  }).length == 0
                ) {
                  if (this.tabPosition == 1) {
                    item.meetingType = "1";
                    console.log("item: ", item);
                  } else if (this.tabPosition == 2) {
                    item.meetingType = "2";
                  } else if (this.tabPosition == 7) {
                    item.meetingType = "7";
                  } else {
                    item.meetingType = "";
                  }
                  this.talkCall1(item);
                  // temporaryVideoList.push(item)
                  // this.$store.commit("SET_COMEMBER", temporaryVideoList);
                }
              });
            }
          });
        }
        if (this.tabPosition == 6) {
          this["myData" + this.tabPosition].treeMultipleSelection.forEach(
            (item) => {
              this.$http({
                url:
                  window.g.ApiUrl + "/eos/communication/preplan/getContactor",
                method: "post",
                data: {
                  type: "meeting",
                  id: item.id,
                  isTop: item.parentId == 0 ? "true" : "false",
                },
              }).then((res) => {
                console.log("/eos/communication/preplan/getContactor", res);
                if (res.data.data && res.data.data.length != 0) {
                  // var temporaryVideoList = this.videoList.filter(item => {
                  //   return item.isTableSelect == true;
                  // });
                  var temporaryVideoList = this.videoList;

                  res.data.data.forEach((item) => {
                    // if(item.mobile){
                    // this.talkCall1(item)
                    // }
                    if (
                      temporaryVideoList.filter((element) => {
                        return element.id == item.id;
                      }).length == 0
                    ) {
                      if (this.tabPosition == 1) {
                        item.meetingType = "1";
                        console.log("item: ", item);
                      } else if (this.tabPosition == 2) {
                        item.meetingType = "2";
                      } else if (this.tabPosition == 7) {
                        item.meetingType = "7";
                      } else {
                        item.meetingType = "";
                      }
                      this.talkCall1(item);
                      // temporaryVideoList.push(item)
                      // this.$store.commit("SET_COMEMBER", temporaryVideoList);
                    }
                  });
                }
              });
            }
          );
        }
      }
    },
    handleTreeCheck(data, node) {
      console.log("handleTreeCheck树状分组选中了什么", data, node);
      this.getContactor(data, node);
      var temporaryMeetingTreeList = this.meetingTreeList;
      temporaryMeetingTreeList["tree" + this.tabPosition] = node.checkedNodes;
      this.$store.commit("setMeetingTreeList", temporaryMeetingTreeList);
    },
    filterNode(value, data) {
      if (!value) return true;
      console.log(data.name);
      return data.name.indexOf(value) !== -1;
    },
    myRefresh() {
      //更新分组
      this.myRefresh2(); // 石景山 更新分组
      if (this.HWICP_Version == "HWICP-19.0") {
        //查询icp视频的根分组信息
        // this.$icp19.ICPQueryGroupInfo(
        //   Number(this.agent_id),
        //   Number(0),
        //   Number(1),
        //   Number(10),
        //   Number(0)
        // );
        //更新视频分组的信息
        // setTimeout(() => {
        //   this.getVideoGroupTree();
        //   this.$message.success("更新成功!");
        // }, 5000);
        if (!sessionStorage.getItem("agent_id")) {
          this.$message.warning("请选择坐席");
          return;
        }
        let data = {
          agentId: sessionStorage.getItem("agent_id"),
          topicName: sessionStorage.getItem("MQMyCode"),
        };
        console.log("----", data);
        this.btnArry1[0].disabled = true;
        this.$api.reloadDeviceInfo(data).then(() => {
          if (res.errorcode === 0) {
            this.btnArry1[0].disabled = false;
            this.getVideoGroupTree();
            this.$message.success("更新成功!");
          }
        });
      }
    },
    myRefresh1() {
      //更新终端分组
      this.myRefresh2(); // 石景山 更新分组
      if (this.HWICP_Version == "HWICP-19.0") {
        // let that = this;
        // this.$icp19.ICPQueryDeviceInfo(
        //   Number(this.agent_id),
        //   Number(0),
        //   Number(1),
        //   Number(10),
        //   Number(0),
        //   "",
        //   function(res) {
        //     console.log(res);
        //     console.log("更新设备信息成功!");
        //   }
        // );

        let data = {
          agentId: sessionStorage.getItem("agent_id"),
          topicName: sessionStorage.getItem("MQMyCode"),
        };
        console.log("----", data);
        this.btnArry1[1].disabled = true;
        this.$api.reloadGroupInfo(data).then((res) => {
          if (res.errorcode === 0) {
            this.btnArry1[1].disabled = false;
          }
        });

        // this.$message.success("更新设备信息成功!");
      }
    },
    myRefresh2() {
      this.$api.beijingReloadDeviceInfo().then((res) => {
        if (res.errorcode === 0) {
          this.btnArry1[0].disabled = false;
          this.btnArry1[1].disabled = false;
        }
      });
    },
    //表格行内单机方法
    handleRowClick(row) {
      this["myData" + this.tabPosition].rowData = row;
    },
    addList() {
      //新增
      this.$nextTick(() => {
        switch (this.tabPosition) {
          case 1:
            this.$refs.VideoDialog.isDialogVisible = true;
            this.$refs.VideoDialog.title = "新增视频信息";
            this.$refs.VideoDialog.getVideoGroupTree();
            break;
          case 2:
            this.$refs.TerminalDialog.isDialogVisible = true;
            this.$refs.TerminalDialog.title = "新增终端信息";
            this.$refs.TerminalDialog.getTerminalGroupListData();
            break;
          case 3:
            this.$refs.ContactDetailsPopup.isDialogVisible = true;
            this.$refs.ContactDetailsPopup.title = "新增联系人";
            this.$refs.ContactDetailsPopup.getTree(
              this.tabPosition,
              this.groupId,
              this.tabName
            );

            break;
          case 4:
            this.$refs.ContactDetailsPopup.isDialogVisible = true;
            this.$refs.ContactDetailsPopup.title = "新增联系人";
            this.$refs.ContactDetailsPopup.getTree(
              this.tabPosition,
              this.groupId,
              this.tabName
            );
            break;
          case 5:
            this.$refs.ContactDetailsPopup.isDialogVisible = true;
            this.$refs.ContactDetailsPopup.title = "新增联系人";
            this.$refs.ContactDetailsPopup.getTree(
              this.tabPosition,
              this.groupId,
              this.tabName
            );

            break;
          case 7:
            this.$refs.ClusterDialog.isDialogVisible = true;
            this.$refs.ClusterDialog.title = "新增集群信息";
            this.$refs.ClusterDialog.getPcode();
            this.$refs.ClusterDialog.getTalkGroupListTree();
            break;
          case 8:
            this.$refs.ContactDetailsPopup.isDialogVisible = true;
            this.$refs.ContactDetailsPopup.title = "新增联系人";
            this.$refs.ContactDetailsPopup.getTree(
              this.tabPosition,
              this.groupId,
              this.tabName
            );
            break;
        }
      });
    },
    myEdit() {
      //修改

      if (
        this["myData" + this.tabPosition].rowData == "" ||
        this["myData" + this.tabPosition].rowData == null
      ) {
        this.$message({
          message: "请选中表格中任意行或双击任意行进行修改!",
          type: "warning",
        });
        return;
      } else {
        this.handleRowDbClick(this["myData" + this.tabPosition].rowData);
      }
    },
    //删除方法
    handleDeleteItem() {
      if (
        this.tabPosition == 1 ||
        this.tabPosition == 7 ||
        this.tabPosition === 8 ||
        this.tabPosition === 11 ||
        this.tabPosition === 12
      ) {
        if (
          this["myData" + this.tabPosition].rowData == "" ||
          this["myData" + this.tabPosition].rowData == null
        ) {
          this.$message({
            message: "请选中表格中任意行进行删除!",
            type: "warning",
          });
          return;
        } else {
          let data = {
            data: { id: this["myData" + this.tabPosition].rowData.id },
            operate: 2,
          };
          this.$confirm("删除当前信息?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.$api.updateConcator(data).then((res) => {
                if (res.errorcode != 0) {
                  this.$message({
                    message: res.msg,
                    type: "error",
                  });
                  return;
                }
                this.$message({
                  message: "删除成功!",
                  type: "success",
                });
                this.getContactorList();
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消删除!",
              });
            });
        }
      } else if (this.tabPosition == 2) {
        if (this.formData2.rowData == "" || this.formData2.rowData == null) {
          this.$message({
            message: "请选中表格中任意行进行取消收藏!",
            type: "warning",
          });
          return;
        } else {
          let data = {
            contactorId: this.formData2.rowData.id,
          };
          this.$confirm("取消收藏当前信息?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.$api.removeCommonContactor(data).then((res) => {
                if (res.errorcode != 0) {
                  this.$message({
                    message: res.msg,
                    type: "error",
                  });
                  return;
                }
                this.$message({
                  message: "取消收藏成功!",
                  type: "success",
                });
                this.getDataAl();
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消操作!",
              });
            });
        }
      } else if (
        this.tabPosition == 3 ||
        this.tabPosition == 4 ||
        this.tabPosition == 5 ||
        this.tabPosition == 6
      ) {
        if (
          this["myData" + this.tabPosition].rowData == "" ||
          this["myData" + this.tabPosition].rowData == null
        ) {
          this.$message({
            message: "请选中表格中任意行进行删除!",
            type: "warning",
          });
          return;
        } else {
          let data = {
            data: { id: this["myData" + this.tabPosition].rowData.id },
            operate: 2,
          };
          this.$confirm("删除当前信息?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.$api.updateConcator(data).then((res) => {
                if (res.errorcode != 0) {
                  this.$message({
                    message: res.msg,
                    type: "error",
                  });
                  return;
                }
                this.$message({
                  message: "删除成功!",
                  type: "success",
                });
                this.getContactorList(this.tabPosition);
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消删除!",
              });
            });
        }
      }
    },
    myDel() {
      //删除单个列表选项
      if (
        this["myData" + this.tabPosition].rowData == "" ||
        this["myData" + this.tabPosition].rowData == null
      ) {
        this.$message({
          message: "请选中表格中任意行进行删除!",
          type: "warning",
        });
        return;
      } else {
        //console.log(data)

        this.$confirm("确定删除该条数据", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            switch (this.tabPosition) {
              case 1:
                this.videoremoveGroup();
                break;
              case 2:
                this.removeTerminal();
                break;
              case 3:
                this.removeCommonContactor();
                break;
              case 4:
                this.removeCommonContactor();
                break;
              case 7:
                this.removeTalkGroup();
                break;
              case 8:
                this.updatContentor();
                break;
              case 9:
                if (!this.myData9.rowData) {
                  this.$message({
                    message: "请选中表格中任意行进行取消收藏!",
                    type: "warning",
                  });
                  return;
                } else {
                  let data = {
                    contactorId: this.myData9.rowData.id,
                  };

                  this.$confirm("取消收藏当前信息?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                  })
                    .then(() => {
                      this.$api.removeCommonContactor(data).then((res) => {
                        if (res.errorcode != 0) {
                          this.$message({
                            message: res.msg,
                            type: "error",
                          });
                          return;
                        }
                        this.$message({
                          message: "取消收藏成功!",
                          type: "success",
                        });
                        this.getDataAl();
                      });
                    })
                    .catch(() => {
                      this.$message({
                        type: "info",
                        message: "已取消操作!",
                      });
                    });
                }
                break;
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除!",
            });
          });
      }
    },
    //披露删除多个列表选项
    handleDelete() {
      if (
        this.tabPosition == 3 ||
        this.tabPosition == 4 ||
        this.tabPosition == 5 ||
        this.tabPosition == 6 ||
        this.tabPosition == 8
      ) {
        if (
          this["myData" + this.tabPosition].tableMultipleSelection.length == 0
        ) {
          this.$message({
            message: "请勾选表格中任一行进行删除!",
            type: "warning",
          });
          return;
        } else {
          this.$confirm("删除当前信息?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.$http({
                url:
                  window.g.ApiUrl +
                  "/eos/communication/contactor/deleteContactor",
                method: "post",
                data: {
                  ids: this[
                    "myData" + this.tabPosition
                  ].tableMultipleSelection.map(function (elem) {
                    return elem.id;
                  }),
                },
              }).then(({ data }) => {
                console.log(
                  "/eos/communication/contactor/deleteContactor",
                  data
                );
                if (data.errorcode != 0) {
                  this.$message({
                    message: data.msg,
                    type: "error",
                  });
                  return;
                }
                this.$message({
                  message: "删除成功!",
                  type: "success",
                });

                switch (this.tabPosition) {
                  case 1:
                    this.getVideoList();
                    break;

                  case 3:
                    this.getContactorList();
                    break;
                  case 4:
                    this.getContactorList(4);
                    break;
                  case 5:
                    this.getContactorList(5);

                    break;
                  case 6:
                    //如果没有父级节点，则查应急通讯录
                    if (node.parent != null && node.parent.parent != null) {
                      this["myData" + this.tabPosition].isTop = "false";
                    } else {
                      this["myData" + this.tabPosition].isTop = "true";
                    }
                    this.getEmergencyAddressData();
                    break;

                  case 8:
                    this.getContactorList(8);
                    break;

                  case 10:
                    this.getDataRecent();
                    break;
                }
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消删除!",
              });
            });
        }
      } else if (this.tabPosition == 1) {
        if (this.myData1.tableMultipleSelection.length == 0) {
          this.$message({
            message: "请选中表格中任一行进行删除!",
            type: "warning",
          });
          return;
        } else {
          this.$confirm("删除当前信息?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.$http({
                url: window.g.ApiUrl + "/eos/communication/video/batchRemove",
                method: "post",
                data: {
                  ids: this[
                    "myData" + this.tabPosition
                  ].tableMultipleSelection.map(function (elem) {
                    return elem.id;
                  }),
                },
              }).then(({ data }) => {
                console.log("/eos/communication/video/batchRemove", data);
                if (data.errorcode != 0) {
                  this.$message({
                    message: data.msg,
                    type: "error",
                  });
                  return;
                }
                this.$message({
                  message: "删除成功!",
                  type: "success",
                });
                this.getDataAl();
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消删除!",
              });
            });
        }
      } else if (this.tabPosition == 2) {
        if (this.myData2.tableMultipleSelection.length == 0) {
          this.$message({
            message: "请选中表格中任一行进行删除!",
            type: "warning",
          });
          return;
        } else {
          this.$confirm("删除当前信息?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.$http({
                url:
                  window.g.ApiUrl + "/eos/communication/terminal/batchRemove",
                method: "post",
                data: {
                  ids: this[
                    "myData" + this.tabPosition
                  ].tableMultipleSelection.map(function (elem) {
                    return elem.id;
                  }),
                },
              }).then(({ data }) => {
                console.log("/eos/communication/terminal/batchRemove", data);
                if (data.errorcode != 0) {
                  this.$message({
                    message: data.msg,
                    type: "error",
                  });
                  return;
                }
                this.$message({
                  message: "删除成功!",
                  type: "success",
                });
                this.getTerminalListData();
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消删除!",
              });
            });
        }
      } else if (this.tabPosition == 7) {
        if (this.myData7.tableMultipleSelection.length == 0) {
          this.$message({
            message: "请选中表格中任一行进行删除!",
            type: "warning",
          });
          return;
        } else {
          this.$confirm("删除当前信息?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.$http({
                url:
                  window.g.ApiUrl + "/eos/communication/groupTalk/batchRemove",
                method: "post",
                data: {
                  ids: this[
                    "myData" + this.tabPosition
                  ].tableMultipleSelection.map(function (elem) {
                    return elem.id;
                  }),
                },
              }).then(({ data }) => {
                console.log("/eos/communication/groupTalk/batchRemove", data);
                if (data.errorcode != 0) {
                  this.$message({
                    message: data.msg,
                    type: "error",
                  });
                  return;
                }
                this.$message({
                  message: "删除成功!",
                  type: "success",
                });
                this.getTableData();
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消删除!",
              });
            });
        }
      }
    },
    removeTalkGroup() {
      //删除集群分组
      let data = {
        id: this["myData" + this.tabPosition].rowData.id,
      };
      this.$api.removeTalkGroup(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        this.$message({
          message: "删除成功!",
          type: "success",
        });
        this.getTableData();
        this["myData" + this.tabPosition].rowData = null;
      });
    },
    updatContentor() {
      if (this.tabPosition == 8) {
        let data = {
          data: { id: this["myData" + this.tabPosition].rowData.id },
          operate: 2,
        };
        this.$api.updateConcator(data).then((res) => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error",
            });
            return;
          }
          this.$message({
            message: "删除成功!",
            type: "success",
          });
          this.getContactorListopo();
        });
      }
    },
    removeCommonContactor() {
      //删除联系人
      let data = {
        contactorId: this["myData" + this.tabPosition].rowData.id,
      };
      this.$api.removeCommonContactor(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        this.$message({
          message: "删除成功!",
          type: "success",
        });
        this.tabPosition == 3 && this.getContactorList();
        this.tabPosition == 4 && this.getDataAl();
        this["myData" + this.tabPosition].rowData = null;
      });
    },
    removeTerminal() {
      //删除终端
      let data = {
        id: this["myData" + this.tabPosition].rowData.id,
      };
      this.$api.removeTerminal(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        this.$message({
          message: "删除成功!",
          type: "success",
        });
        this.getTerminalListData();
        this["myData" + this.tabPosition].rowData = null;
      });
    },
    videoremoveGroup() {
      //删除视频
      let data = {
        id: this["myData" + this.tabPosition].rowData.id,
        groupId: this["myData" + this.tabPosition].rowData.groupId,
      };
      this.$api.videoremoveGroup(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }

        this.$message({
          message: "删除成功!",
          type: "success",
        });
        this.getVideoList();
        this["myData" + this.tabPosition].rowData = null;
      });
    },
    //视频预览方法
    Preview(row) {
      console.log(this.agent_id, row);
      // this.openThirdPartyVideo('11010704001320003001')
      this.openThirdPartyVideo(row.indexCode);
      return;
      if (this.HWICP_Version == "HWICP-19.0") {
        this.$icp19.ICPStartRealPlay(
          Number(this.agent_id),
          0,
          row.indexCode,
          0
        );
      }
    },
    //查看设备信息
    Lookup(row) {
      this.$refs.watchVideoDialog.isSave = false;
      this.$refs.watchVideoDialog.isUpdateName = true;
      this.$refs.watchVideoDialog.isDialogVisible = true;
      this.$refs.watchVideoDialog.title = "视频设备信息";
      this.$refs.watchVideoDialog.getDisableVideoGroupTree();
      this.$refs.watchVideoDialog.showData(row);
    },
    //获取集群分组
    getTalkGroupListTree() {
      let data = {
        displayDefault: true,
      };
      this.$api.talkGroupListTree(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        this.myData7.treeData = res.data ? [...res.data] : [];
        if (res.data) {
          res.data.shift();
          this.myData7.treeData1 = res.data;
        } else {
          this.myData7.treeData1 = [];
        }
      });
    },
    //获取表格数据
    getTableData() {
      let data;
      data = {
        groupId: this.myData7.groupId,
        page: this.myData7.currentPage,
        size: this.myData7.pageSize,
        searchText: this.myData7.searchText,
      };
      this.$api.talkGroupList(data).then((res) => {
        if (res.errorcode !== 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        this.myData7.total = res.data.totalElements || 0;
        this.myData7.tableData = res.data.data || [];
        this["myData" + this.tabPosition].rowData = null;
        setTimeout(() => {
          this.videoList.forEach((item) => {
            if (
              this["myData" + this.tabPosition].tableData.filter((element) => {
                return element.id == item.id;
              }).length != 0
            ) {
              this.$refs["elTable" + this.tabPosition].toggleRowSelection(
                this["myData" + this.tabPosition].tableData.filter(
                  (element) => {
                    return element.id == item.id;
                  }
                )[0],
                true
              );
            }
          });
        }, 800);
      });
    },
    //应急通讯录架构树
    getEmergencyAddressBookTree() {
      let data = {
        id: 0,
      };
      let CallbackReload = this;
      this.$api.getBriefsByClassId(data, CallbackReload).then((result) => {
        if (result) {
          this.myData6.treeData = [];
          for (let n in result.data) {
            this.myData6.treeData.push({
              id: result.data[n].id,
              name: result.data[n].name + "通讯录",
              versionId: result.data[n].versionId,
              children: [],
            });
            let data = {
              id: result.data[n].versionId,
            };
            this.$api.getStructTree(data, this).then((res) => {
              this.myData6.treeData[n].children = res.data;
            });
          }
          // 默认选择第一个分组 禅道7050 author:hexinting date:2020-9-27
          this.myData6.isTop = true; // 默认是一级分组
          this.myData6.treeDataItem.groupId = this.myData6.treeData[0].id;
          console.log("应急联动网id", this.myData6.treeDataItem.groupId);
        }
      });
    },
    //获取应急通讯录联系人
    getEmergencyAddressData() {
      var dictType = this.getDictType();
      let data = {
        searchText: this.myData6.searchText,
        id: this.myData6.treeDataItem.groupId,
        page: this.myData6.currentPage,
        size: this.myData6.pageSize,
        isTop: this.myData6.isTop,
        type: "meeting",
        dictType: dictType,
      };
      if (this.myData6.treeDataItem.groupId) {
        data.id = this.myData6.treeDataItem.groupId;
      } else {
        this.$message({
          message: "请先选择节点",
          type: "warning",
        });
        return;
      }

      this.$api.emergencyAddressBook(data).then((res) => {
        if (res.errorcode != 0) {
          this.message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        this.myData6.tableData = res.data.data || [];
        this.myData6.total = res.data.totalElements || 0;
        setTimeout(() => {
          this.videoList.forEach((item) => {
            if (
              this["myData" + this.tabPosition].tableData.filter((element) => {
                return element.id == item.id;
              }).length != 0
            ) {
              this.$refs["elTable" + this.tabPosition].toggleRowSelection(
                this["myData" + this.tabPosition].tableData.filter(
                  (element) => {
                    return element.id == item.id;
                  }
                )[0],
                true
              );
            }
          });
        }, 800);
      });
    },
    getDataRecent() {
      //获取最近联系人
      this.$api.getRecentContactorList().then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            error: "error",
          });
          return;
        }
        res.data.data.forEach((item) => {
          item.meetingType = "";
        });

        setTimeout(() => {
          this.myData10.tableData = res.data.data || [];
          this.myData10.total = res.data.totalElements;
          this.videoList.forEach((item) => {
            if (
              this["myData" + this.tabPosition].tableData.filter((element) => {
                return element.call == (item.number ? item.number : item.call);
              }).length != 0
            ) {
              this.$refs["elTable" + this.tabPosition].toggleRowSelection(
                this["myData" + this.tabPosition].tableData.filter(
                  (element) => {
                    return (
                      element.call == (item.number ? item.number : item.call)
                    );
                  }
                )[0],
                true
              );
            }
          });
        }, 800);
      });
    },
    myEidt(row) {
      this.handleRowDbClick(row);
    },
    gliaisonGroupList() {
      let data = {
        displayDefault: true, //是否显示未分组联系人
      };
      this.$api.gliaisonGroupList(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        this["myData" + this.tabPosition].treeData = res.data || [];
      });
    },
    dutyGroupList() {
      let data = { displayDefault: true };
      this.$api.dutyGroupList(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        this["myData" + this.tabPosition].treeData = res.data || [];
      });
    },
    getShortcutGroupData() {
      let data = {
        displayDefault: true, //是否显示未分组联系人
      };
      this["myData" + this.tabPosition].myLoading = true;
      this.$api.shortcutGroupList(data).then((res) => {
        this["myData" + this.tabPosition].myLoading = false;
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        this["myData" + this.tabPosition].treeData = res.data || [];
      });
    },
    refreshTable() {
      switch (this.tabPosition) {
        case 1:
          this.getVideoList();
          break;
        case 2:
          this.getTerminalListData();
          break;
        case 3:
          this.getContactorList();
          break;
        case 4:
          this.getContactorList();
          break;
        case 5:
          this.getContactorList();

          break;
        case 6:
          this.getEmergencyAddressData();
          break;
        case 7:
          this.getTableData();
          break;
        case 8:
          this.getContactorList();
          break;
        case 11:
          this.getContactorList();
          break;
        case 12:
          this.getContactorList();
          break;
      }
    },
    handleRowDbClick(row) {
      //双击修改
      this.$nextTick(() => {
        if (this.tabPosition == 1) {
          this.$refs.VideoDialog.isDialogVisible = true;
          this.$refs.VideoDialog.title = "修改视频信息";
          this.$refs.VideoDialog.getVideoGroupTree();
          this.$refs.VideoDialog.showData(row);
        } else if (this.tabPosition == 2) {
          this.$refs.TerminalDialog.isDialogVisible = true;
          this.$refs.TerminalDialog.title = "修改终端信息";
          this.$refs.TerminalDialog.getTerminalGroupListData();
          this.$refs.TerminalDialog.showData(row);
        } else if (this.tabPosition == 3 || this.tabPosition == 8) {
          this.$refs.ContactDetailsPopup.isDialogVisible = true;
          this.$refs.ContactDetailsPopup.title = "修改联系人";
          this.$refs.ContactDetailsPopup.getTree();
          this.$refs.ContactDetailsPopup.showData(row);
        } else if (this.tabPosition == 4) {
          this.$refs.ContactDetailsPopup.isDialogVisible = true;
          this.$refs.ContactDetailsPopup.title = "修改联系人";
          this.$refs.ContactDetailsPopup.getTree();
          this.$refs.ContactDetailsPopup.showData(row);
        } else if (this.tabPosition == 7) {
          this.$refs.ClusterDialog.isDialogVisible = true;
          this.$refs.ClusterDialog.title = "修改集群信息";
          this.$refs.ClusterDialog.getPcode();
          this.$refs.ClusterDialog.getTalkGroupListTree();
          this.$refs.ClusterDialog.showData(row);
        } else {
          this.$refs.ContactDetailsPopup.isDialogVisible = true;
          this.$refs.ContactDetailsPopup.title = "修改联系人";
          this.$refs.ContactDetailsPopup.getTree();
          this.$refs.ContactDetailsPopup.showData(row);
        }
      });
    },
    handleSearch() {
      this["myData" + this.tabPosition].currentPage = 1;
      this["myData" + this.tabPosition].rowData = null;
      this["myData" + this.tabPosition].groupId = "";
      this.tabPosition == 1 && this.getVideoList();
      this.tabPosition == 2 && this.getTerminalListData();
      this.tabPosition == 3 && this.getContactorList();
      this.tabPosition == 4 && this.getContactorList(4);
      this.tabPosition == 5 && this.getContactorList(5);
      this.tabPosition == 6 && this.getEmergencyAddressData();
      this.tabPosition == 7 && this.getTableData();
      this.tabPosition == 8 && this.getContactorList(8);
      this.tabPosition == 11 && this.getContactorList();
      this.tabPosition == 12 && this.getContactorList();
    },
    getDataAl() {
      //获取常用联系人
      let data = {
        searchText: this.myData9.searchText,
        page: this.myData9.currentPage,
        size: this.myData9.pageSize,
        type: "meeting",
      };
      this.$api.commonContactorList(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            error: "error",
          });
          return;
        }
        this.myData9.tableData = res.data.data || [];
        this.myData9.total = res.data.totalElements || 0;
        setTimeout(() => {
          this.videoList.forEach((item) => {
            if (
              this["myData" + this.tabPosition].tableData.filter((element) => {
                return element.id == item.id;
              }).length != 0
            ) {
              this.$refs["elTable" + this.tabPosition].toggleRowSelection(
                this["myData" + this.tabPosition].tableData.filter(
                  (element) => {
                    return element.id == item.id;
                  }
                )[0],
                true
              );
            }
          });
        }, 800);
      });
    },
    //电话分组树
    getPhoneGroupingTree() {
      let data = {
        displayDefault: true,
      };
      this.$api.telephoneGroupingTree(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        this.myData3.treeData = res.data;
      });
    },
    getContactorListopo() {
      this.myData8.rowData = null;
      let data;
      var dictType = this.getDictType();
      data = {
        groupId: this.myData8.groupId,
        page: this.myData8.currentPage,
        size: this.myData8.pageSize,
        searchText: this.myData8.searchText,
        type: "meeting",
        dictType: dictType,
      };

      this.$api.contactorList(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        this.myData8.tableData = res.data.list || [];
        this.myData8.total = res.data.totalCount || 0;
        setTimeout(() => {
          this.videoList.forEach((item) => {
            if (
              this["myData" + this.tabPosition].tableData.filter((element) => {
                return element.id == item.id;
              }).length != 0
            ) {
              this.$refs["elTable" + this.tabPosition].toggleRowSelection(
                this["myData" + this.tabPosition].tableData.filter(
                  (element) => {
                    return element.id == item.id;
                  }
                )[0],
                true
              );
            }
          });
        }, 800);
      });
    },
    // 获取字段类型
    getDictType() {
      let dictType;
      switch (this.tabPosition) {
        case 3:
          dictType = "governmentAffairs";
          break;
        case 4:
          dictType = "primaryLevel";
          break;
        case 5:
          dictType = "spareTime";
          break;
        case 8:
          dictType = "resource";
          break;
        case 11:
          dictType = "suzhouGroup";
          break;
        case 12:
          dictType = "quick";
          break;
      }
      console.log("-------", dictType);
      return dictType;
    },
    // 更改设置联系人的状态
    changeCommonlyUsed(row) {
      let data;
      var dictType = this.getDictType();
      data = {
        groupId: this["myData" + this.tabPosition].groupId,
        page: this["myData" + this.tabPosition].currentPage,
        size: this["myData" + this.tabPosition].pageSize,
        searchText: this["myData" + this.tabPosition].searchText,
        type: "meeting",
        dictType: dictType,
      };

      this.$api.contactorList(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        setTimeout(() => {
          res.data.list.forEach((item) => {
            if (item.id === row.id) {
              row.commonlyUsed = item.commonlyUsed;
            }
          });
        }, 100);
      });
    },
    //获取联系人数据
    getContactorList() {
      this["myData" + this.tabPosition].rowData = null;
      let data;

      var dictType = this.getDictType();
      data = {
        groupId: this["myData" + this.tabPosition].groupId,
        page: this["myData" + this.tabPosition].currentPage,
        size: this["myData" + this.tabPosition].pageSize,
        searchText: this["myData" + this.tabPosition].searchText,
        type: "meeting",
        dictType: dictType,
      };

      this.$api.contactorList(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        this["myData" + this.tabPosition].tableData = res.data.list || [];
        this["myData" + this.tabPosition].total = res.data.totalCount || 0;
        setTimeout(() => {
          this.videoList.forEach((item) => {
            if (
              this["myData" + this.tabPosition].tableData.filter((element) => {
                return element.id == item.id;
              }).length != 0
            ) {
              this.$refs["elTable" + this.tabPosition].toggleRowSelection(
                this["myData" + this.tabPosition].tableData.filter(
                  (element) => {
                    return element.id == item.id;
                  }
                )[0],
                true
              );
            }
          });
        }, 800);
      });
    },
    //获取终端分组
    getTerminalGroupListData() {
      let data = {
        displayDefault: true,
      };
      this.$api.terminalGroupList(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        this.myData2.treeData = res.data ? [...res.data] : [];
        if (res.data) {
          res.data.shift();
          this.myData2.treeData1 = res.data;
        } else {
          this.myData2.treeData1 = [];
        }
      });
    },
    //获取终端分组详细信息
    getTerminalListData() {
      this.myData2.rowData = null;
      let data = {};

      data = {
        groupId: this.myData2.groupId,
        page: this.myData2.currentPage,
        size: this.myData2.pageSize,
        searchText: this.myData2.searchText,
      };

      this.$api.terminalList(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        this.myData2.tableData = res.data.data || [];
        this.myData2.total = res.data.totalElements || 0;
        setTimeout(() => {
          this.videoList.forEach((item) => {
            if (
              this["myData" + this.tabPosition].tableData.filter((element) => {
                return element.id == item.id;
              }).length != 0
            ) {
              this.$refs["elTable" + this.tabPosition].toggleRowSelection(
                this["myData" + this.tabPosition].tableData.filter(
                  (element) => {
                    return element.id == item.id;
                  }
                )[0],
                true
              );
            }
          });
        }, 800);
      });
    },
    async talkCall1(row) {
      console.log("row: ", row);

      //添加会议成员号码
      //  console.log('row: ', row);

      let content;

      switch (
        this.tabPosition //1视频分组，2终端分组3政务4常以此类推
      ) {
        case 1:
          if (row.indexCode == "" || row.indexCode == null) {
            this.$message.warning(`${item.name || item.contactor}号码为空`);
            return;
          } else {
            content = {
              name: row.name,
              call: row.indexCode.length > 10 ? row.indexCode : row.extend1,
              numType: "9", //号码类型
              meetingType: "1",
            };
            console.log(content);
          }
          break;
        case 2:
          if (row.uri == "" || row.uri == null) {
            this.$message.warning(`${row.name || row.contactor}号码为空`);
            return;
          } else {
            content = {
              name: row.name,
              call: row.uri,
              numType: "8",
              meetingType: "2",
            };
          }
          break;
        case 3:
          if (row.number == "" || row.number == null) {
            this.$message.warning(`${row.name || row.contactor}号码为空`);
            this.$refs["elTable" + this.tabPosition].toggleRowSelection(
              row,
              false
            );
            return;
          } else {
            // console.log("row: ", row);
            content = {
              name: row.name,
              call: row.number,
              numType: "1",
            };
            //判断是否要加电话前缀
            // content.call = await this.addPhonePrefix(content.call);
          }

          break;
        case 4:
          if (row.number == "" || row.number == null) {
            this.$message.warning(`${row.name || row.contactor}号码为空`);
            this.$refs["elTable" + this.tabPosition].toggleRowSelection(
              row,
              false
            );
            return;
          } else {
            content = {
              name: row.name,
              call: row.number,
              numType: "1",
            };
            //判断是否要加电话前缀
            // content.call = await this.addPhonePrefix(content.call);
          }
          break;
        case 5:
          if (row.number == "" || row.number == null) {
            this.$message.warning(`${row.name || row.contactor}号码为空`);
            this.$refs["elTable" + this.tabPosition].toggleRowSelection(
              row,
              false
            );
            return;
          } else {
            content = {
              name: row.name,
              call: row.number,
              numType: "1",
            };
            //判断是否要加电话前缀
            // content.call = await this.addPhonePrefix(content.call);
          }
          break;
        case 6:
          if (row.number == "" || row.number == null) {
            this.$message.warning(`${row.name || row.contactor}号码为空`);
            this.$refs["elTable" + this.tabPosition].toggleRowSelection(
              row,
              false
            );
            return;
          } else {
            content = {
              name: row.name,
              call: row.number,
              numType: "1",
            };
            //判断是否要加电话前缀
            // content.call = await this.addPhonePrefix(content.call);
          }
          break;
        case 7:
          if (row.number == "" || row.number == null) {
            this.$message.warning(`${row.name || row.contactor}号码为空`);
            this.$refs["elTable" + this.tabPosition].toggleRowSelection(
              row,
              false
            );
            return;
          } else {
            // alert(row)
            // console.log('row: ', row);
            content = {
              name: row.name,
              call: row.number,
              numType: "1",
              grouping: row.code,
              meetingType: "7",
            };
            //判断是否要加电话前缀
            // content.call = await this.addPhonePrefix(content.call);
          }
          break;
        case 8:
          if (row.number == "" || row.number == null) {
            this.$message.warning(`${row.name || row.contactor}号码为空`);
            this.$refs["elTable" + this.tabPosition].toggleRowSelection(
              row,
              false
            );
            return;
          } else {
            content = {
              name: row.name,
              call: row.number,
              numType: "8",
            };
          }
          break;
      }
      let newA = false;
      this.videoList.forEach((item) => {
        if (item.content.grouping == "集群分组") {
          if (content.grouping == "集群分组") {
            this.$message.warning("只能添加一个集群分组");
            newA = true;
          }
        }
      });
      //  console.log('row: ', row);
      if (newA) return;
      // if (this.videoNumber.indexOf(content.call) != -1) {
      //   // this.$message.warning("你已添加当前成员");
      //   // return;
      // } else {
      let videoList = [...this.videoList],
        videoNumber = [...this.videoNumber];
      if (videoList.length >= 16) {
        this.$message.warning("最多只能添加16个成员");
        return;
      }
      if (this.confStatus) {
        if (this.HWICP_Version == "HWICP-19.0") {
          this.$icp19.JoinConfEx3(
            Number(this.agent_id),
            Number(this.myVdcConfId),
            0,
            content.call,
            Number(content.numType),
            content.name,

            (res) => {}
          );
          row.myAuto = false;
          row.myVideo = false;
          row.myPhoneState = this.phoneState;
          row.content = content;
          videoList.push(row);
          // videoList.push({
          //   myAuto: false,
          //   myVideo: false,
          //   myState: 0,
          //   myPhoneState: this.phoneState,
          //   content: content
          // });
          videoNumber.push(content.call);
          // console.log('videoList: ', videoList);

          console.log("videoList: ", videoList);
          this.$store.commit("SET_COMEMBER", videoList); //成员
          this.$store.commit("SET_VIDEONUMBER", videoNumber); //成员号码数组用来判断是否已经添加了的
        }
      } else {
        row.myAuto = false;
        row.myVideo = false;
        row.myState = 0;
        row.myPhoneState = this.phoneState;
        row.content = content;
        videoList.push(row);
        // videoList.push({
        //   myAuto: false,
        //   myVideo: false,
        //   myState: 0,
        //   myPhoneState: this.phoneState,
        //   content: content
        // });
        videoNumber.push(content.call);
        console.log("videoList: ", videoList);
        this.$store.commit("SET_COMEMBER", videoList); //成员
        this.$store.commit("SET_VIDEONUMBER", videoNumber); //成员号码数组用来判断是否已经添加了的
      }
      // }
    },
    addPhonePrefix(number) {
      /*
       * 电话前缀添加
       */
      let data = {
        number: number,
        agentId: this.agent_id,
      };
      this.phoneState = true;
      return this.$api.validateNumber(data).then((res) => {
        console.log(res, this.phoneState);
        return res;
      });
    },
    phoneFun(phones) {
      let myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
      if (!myreg.test(phones)) {
        return false;
      } else {
        return true;
      }
    },
    /**
     * @description: 切换分组
     * @lastEditor : xuchuangxing
     * @lastUpdateTime : 2020-12-15 16:06
     * @description: 切换分组
     * @param {*}
     * @return {*}
     */
    changePage() {
      this.groupId = "";
      this.manageVisible = true;
      this["myData" + this.tabPosition].total = 0;
      this["myData" + this.tabPosition].pageSize = 10;
      this["myData" + this.tabPosition].rowData = null;
      this["myData" + this.tabPosition].treeData = [];
      this["myData" + this.tabPosition].tableData = []; //表格数据
      this["myData" + this.tabPosition].treeDataItem = {};
      this["myData" + this.tabPosition].groupId = 0;
      this["myData" + this.tabPosition].searchText = "";
      (this["myData" + this.tabPosition].filterTree = ""), //树状列表输入框过滤
        (this["myData" + this.tabPosition].tableMultipleSelection = []), //列表勾选的选项
        (this["myData" + this.tabPosition].treeMultipleSelection = []); //树状分组勾选的选项
      console.log(
        "changePage切换 this.tabPosition",
        this.tabPosition,
        typeof this.tabPosition
      );
      switch (this.tabPosition) {
        case 1:
          this.myData1.groupId = -1; // 默认显示默认分组的联系人从-1开始查起 author: xuchuanxgxing lastUpdateTime: 2020-12-15 16:06

          this.getVideoGroupTree();
          break;
        case 2:
          this.myData2.groupId = -1; // 默认显示全部设备的联系人从-1开始查起 author: xuchuanxgxing lastUpdateTime: 2020-12-15 16:06

          this.getTerminalGroupListData();
          break;
        case 3:
          this.myData3.groupId = 0; //政务联络网默认从0开始查起。在这里重新赋值不影响其他的
          this.getPhoneGroupingTree();
          this.tabName = "政务联络网";
          break;
        case 4:
          this.gliaisonGroupList();
          this.tabName = "基层联络网";
          break;
        case 5:
          this.dutyGroupList();
          this.tabName = "备勤联络网";
          break;
        case 6:
          this.getEmergencyAddressBookTree();
          break;
        case 7:
          this.myData7.groupId = -1; // 默认显示全部设备的联系人从-1开始查起 author: xuchuanxgxing lastUpdateTime: 2020-12-15 16:06

          this.getTalkGroupListTree();
          break;
        case 8:
          this.getResourceGroupingTree(8);
          this.tabName = "资源联络网";
          break;
        case 11:
          this.getSuzhouGroupList();
          this.tabName = "工业园区管委会通讯录";
          break;
        case 12:
          this.getShortcutGroupData();
          this.tabName = "快捷组";
          break;
      }
      setTimeout(() => {
        this.refreshTable(); // 修复禅道7057 author:hexinting date:2020-9-27
      }, 500);
    },
    getResourceGroupingTree(key) {
      let data = {
        displayDefault: true, //是否显示未分组联系人
      };
      this["myData" + this.tabPosition].myLoading = true;
      this.$api
        .resourceGroupList(data)
        .then((res) => {
          this["myData" + this.tabPosition].myLoading = false;
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error",
            });
            return;
          }
          this["myData" + this.tabPosition].treeData = res.data || [];
        })
        .catch((err) => {
          this["myData" + this.tabPosition] = false;
        });
    },
    handCurrentChange(val) {
      this["myData" + this.tabPosition].currentPage = val;

      switch (this.tabPosition) {
        case 1:
          this.getVideoList();
          break;
        case 2:
          this.getTerminalListData();
          break;
        case 3:
          this.getContactorList();
          break;
        case 4:
          this.getContactorList(4);
          break;
        case 5:
          this.getContactorList(5);

          break;
        case 6:
          this.getEmergencyAddressData();
          break;
        case 7:
          this.getTableData();
          break;
        case 8:
          this.getContactorList(8);
          break;
        case 11:
          this.getContactorList();
          break;
        case 12:
          this.getContactorList();
          break;
      }
    },
    handSizeChange(val) {
      this["myData" + this.tabPosition].currentPage = 1; //跳转到第一页
      this["myData" + this.tabPosition].pageSize = val;
      switch (this.tabPosition) {
        case 1:
          this.getVideoList();
          break;
        case 2:
          this.getTerminalListData();
          break;
        case 3:
          this.getContactorList();
          break;
        case 4:
          this.getContactorList(4);
          break;
        case 5:
          this.getContactorList(5);

          break;
        case 6:
          this.getEmergencyAddressData();
          break;
        case 7:
          this.getTableData();
          break;
        case 8:
          this.getContactorList(8);
          break;
        case 11:
          this.getContactorList();
          break;
        case 12:
          this.getContactorList();
          break;
      }
    },
    // 选择联系人
    handleSelectContactor() {
      this.addContactVisible = true;
      this.$nextTick(() => {
        this.$refs.addContact.getDataList("getMeetingContact", this.smsMember);
        console.log("this.smsMember: ", this.smsMember);
      });
      this.$store.commit("setSmsOrFax", "sms");
    },
    //排序方法
    handleSort() {
      this.$nextTick(() => {
        this.$refs.ContactSortingPopup.isDialogVisible = true;
        this.$refs.ContactSortingPopup.getTree();
      });
    },
    //根据分组导出联系人
    handleExportContactor() {
      if (this["formData" + this.tabPosition].groupId == -1) {
        this.$message.warning("未分组联系人不能另存为excel文件");
        return;
      }
      if (
        this["formData" + this.tabPosition].groupId == null ||
        this["formData" + this.tabPosition].groupId == "" ||
        this["formData" + this.tabPosition].groupId == undefined
      ) {
        this.$message.warning("请先选择一个分组");
        return;
      }
      console.log(this["formData" + this.tabPosition].groupId);
      window.location.href =
        window.g.ApiUrl +
        "/eos/communication/contactor/export?groupId=" +
        this["formData" + this.tabPosition].groupId;
    },
    editTreeItem(node, data) {
      console.log("编辑什么node,data", node, data);
      if (this.tabPosition == 9 || this.tabPosition == 10) {
        this.tabPosition = 3;
      }
      this["myData" + this.tabPosition].currentPage = 1; //跳转到第一页
      this["myData" + this.tabPosition].groupId = data.id;
      this["myData" + this.tabPosition].searchText = "";
      this["myData" + this.tabPosition].treeDataItem = {
        groupId: data.id,
        currentGroupName: data.name,
      };

      console.log(data);
      this.$store.commit("setGroupId", data.id);
      this.groupId = data.id;

      setTimeout(() => {
        this.$refs["treeBtn" + this.tabPosition].updateGroup();
      }, 500);
    },
    deleteTreeItem(node, data) {
      console.log("删除什么node,data", node, data);
      if (this.tabPosition == 9 || this.tabPosition == 10) {
        this.tabPosition = 3;
      }
      this["myData" + this.tabPosition].currentPage = 1; //跳转到第一页
      this["myData" + this.tabPosition].groupId = data.id;
      this["myData" + this.tabPosition].searchText = "";
      this["myData" + this.tabPosition].treeDataItem = {
        groupId: data.id,
        currentGroupName: data.name,
      };
      console.log(data);
      this.$store.commit("setGroupId", data.id);
      this.groupId = data.id;

      setTimeout(() => {
        this.$refs["treeBtn" + this.tabPosition].deleteGroup();
      }, 500);
    },
    getContactor(data, node) {
      // if(this.tabPosition==2||this.tabPosition==3){
      //   this.tabPosition=1
      // }
      this["myData" + this.tabPosition].currentPage = 1; //跳转到第一页
      this["myData" + this.tabPosition].groupId = data.id;
      this["myData" + this.tabPosition].searchText = "";
      this["myData" + this.tabPosition].treeDataItem = {
        groupId: data.id,
        currentGroupName: data.name,
      };
      if (this.tabPosition == 3) {
        this.getContactorList();
      } else if (this.tabPosition == 4) {
        //如果没有父级节点，则查应急通讯录
        if (node.parent != null && node.parent.parent != null) {
          this["myData" + this.tabPosition].isTop = "false";
        } else {
          this["myData" + this.tabPosition].isTop = "true";
        }
        this.getContactorList();
        // this.getEmergencyAddressData()
      } else if (this.tabPosition == 5) {
        this.getDataRecent(5);
      } else if (this.tabPosition == 6) {
        this.getDataRecent(6);
      } else if (this.tabPosition == 7) {
        this.getContactorList(7);
      } else if (this.tabPosition == 8) {
        this.getDataRecent(8);
      } else if (this.tabPosition == 11) {
        this.getContactorList(9);
      } else if (this.tabPosition == 12) {
        this.getContactorList(10);
      }
    },
    handleNodeClick(data, node) {
      console.log("----", data, node, this.tabPosition);
      if (this.tabPosition === 9 || this.tabPosition === 10) {
        this.tabPosition = 3;
      }
      this["myData" + this.tabPosition].currentPage = 1; //跳转到第一页
      this["myData" + this.tabPosition].groupId = data.id;
      this["myData" + this.tabPosition].treeDataItem = {
        groupId: data.id,
        currentGroupName: data.name,
      };
      this.tmpGroupId = node.data.id; // qinjiaqi 搜索时把当前分组id传上去实现组内搜索
      switch (this.tabPosition) {
        case 1:
          this.getVideoList();
          break;
        case 2:
          this.getTerminalListData();
          break;
        case 3:
          this.getContactorList();
          break;
        case 4:
          this.getContactorList(4);
          break;
        case 5:
          this.getContactorList(5);
          break;
        case 6:
          //如果没有父级节点，则查应急通讯录
          if (node.parent != null && node.parent.parent != null) {
            this["myData" + this.tabPosition].isTop = "false";
          } else {
            this["myData" + this.tabPosition].isTop = "true";
          }
          this.getEmergencyAddressData();
          break;
        case 7:
          this.getTableData();
          break;
        case 8:
          this.getContactorList(8);
          break;
        case 11:
          this.getContactorList(11);
          break;
        case 12:
          this.getContactorList(12);
          break;
      }
      this.$store.commit("setGroupId", data.id);
      this.groupId = data.id;
    },
    //获取视频分组树
    getVideoGroupTree() {
      let data = {
        displayDefault: true,
      };
      this.$api.videoGroupList(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        this.myData1.treeData = res.data || [];
      });
    },
    refreshData(type) {
      //更新数据树
      // 如果是删除树节点，删除成功后，要清空treeMultipleSelection
      if (type === "deleteTreeNodes") {
        this["formData" + this.tabPosition].treeMultipleSelection = [];
      }
      this["myData" + this.tabPosition].treeDataItem = {};
      this.tabPosition == 1 && this.getVideoGroupTree();
      this.tabPosition == 2 && this.getTerminalGroupListData();
      this.tabPosition == 3 && this.getPhoneGroupingTree();
      this.tabPosition == 4 && this.gliaisonGroupList();
      this.tabPosition == 5 && this.dutyGroupList();
      this.tabPosition == 7 && this.getTalkGroupListTree();
      this.tabPosition == 8 && this.getResourceGroupingTree(8);
      this.tabPosition == 11 && this.getSuzhouGroupList();
      this.tabPosition == 12 && this.getShortcutGroupData();
    },
    //获取设备信息
    getVideoList() {
      this.myData1.rowData = null;
      let data = {};

      data = {
        groupId: this.tmpGroupId,
        page: this.myData1.currentPage,
        size: this.myData1.pageSize,
        searchText: this.myData1.searchText,
      };

      this.$api.getVideoList(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }

        this.myData1.tableData = res.data.data || [];
        this.myData1.total = res.data.totalElements || 0;
        setTimeout(() => {
          this.videoList.forEach((item) => {
            if (
              this["myData" + this.tabPosition].tableData.filter((element) => {
                return element.id == item.id;
              }).length != 0
            ) {
              this.$refs["elTable" + this.tabPosition].toggleRowSelection(
                this["myData" + this.tabPosition].tableData.filter(
                  (element) => {
                    return element.id == item.id;
                  }
                )[0],
                true
              );
            }
          });
        }, 800);
      });
    },
    closeDialog(key) {
      console.log("meeting closeDialog", key);
      this.$emit("closeDialog", key);
    },

    // 拖动排序相关
    refreshTreeAfterDrag() {
      //刷新树数据
      switch (this.tabPosition) {
        case 1:
          this.getVideoGroupTree();
          break;
        case 2:
          this.getTerminalGroupListData();
          break;
        case 3:
          this.myData3.groupId = 0; //政务联络网默认从0开始查起。在这里重新赋值不影响其他的
          this.getPhoneGroupingTree();
          break;
        case 4:
          this.gliaisonGroupList();
          break;
        case 5:
          this.dutyGroupList();
          break;
        case 6:
          this.getEmergencyAddressBookTree();
          break;
        case 7:
          this.getTalkGroupListTree();
          break;
        case 8:
          this.getResourceGroupingTree(8);
          break;
        case 11:
          this.getSuzhouGroupList();
          break;
        case 12:
          this.getShortcutGroupData();
          break;
      }

      //选中
      this.$nextTick(function () {});
      this.expandId = this["formData" + this.tabPosition].treeDataItem.groupId;
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
          ids: arrays, //移动后数组ID
        };

        this.$api.updateContactorGroupOrder(data).then((res) => {
          this.refreshTreeAfterDrag();
        });
      }
    },
    allowDrop(draggingNode, dropNode, type) {
      //拖拽时判定目标节点能否被放置
      this.groupId = draggingNode.data.id;
      if (draggingNode.data.parentId > 0) {
        this.childrenlist = draggingNode.parent.data.children;
      } else {
        this.childrenlist = draggingNode.parent.data;
      }

      if (draggingNode.data.parentId == dropNode.data.parentId) {
        return type !== "inner";
      } else {
        return false;
      }
    },
    allowDrag(draggingNode) {
      //判断节点能否被拖拽
      return draggingNode.data.id > 0;
    },
  },
};
</script>

<style scoped>
.el-icon-preview {
  background: url(~@/assets/icpImg/preview.png) center no-repeat;
  background-size: cover;
}
.el-icon-preview:before {
  content: "替";
  font-size: 16px;
  visibility: hidden;
}
/deep/ [role="treeitem"] {
  margin: 6px 0px;
}
.treeSearch /deep/ .el-input__inner {
  background: rgb(234, 234, 234);
  border-radius: 12px;
  opacity: 0.52;
  height: 3vh;
}
.el-table /deep/ thead th,
.el-table /deep/ thead tr {
  background: rgba(249, 252, 255, 1) !important;
}
.treeSearch /deep/ .el-input__suffix {
  height: initial;
  right: 16px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
}
.my-radio-box {
  height: 100%;
  position: relative;
}
.el-radio-button {
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
  box-shadow: 0px 3px 10px 2px rgba(54, 121, 225, 0.09);
  border-radius: 3px;
}
.my-radio-box >>> .el-radio-button__inner {
  padding: 14px 22px;
  font-size: 14px;
  color: #999999;
  border: none;
  border-bottom: 2px white solid;
  background: white !important;
  box-shadow: none !important;
}

.my-radio-box .is-active >>> .el-radio-button__inner {
  border-bottom: 2px #0091ff solid;
  color: #0091ff;
  border-radius: 0;
}
>>> .el-radio-button:first-child .el-radio-button__inner {
  border-left: 0;
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
  box-shadow: 0px 3px 10px 2px rgba(54, 121, 225, 0.09);
  border-radius: 3px;
}

.my-tree-scroll {
  height: 100%;
  box-sizing: border-box;
  position: relative;
  z-index: 20;
  max-height: 715px;
  padding-bottom: 40px;
}
.my-table-box {
  flex: 1;
  border-left: 10px solid #ebeef5;
  background: white;
  box-shadow: 0px 3px 10px 2px rgba(54, 121, 225, 0.09);
  border-radius: 3px;
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
.filter-tree /deep/ .is-leaf.el-tree-node__expand-icon.el-icon-caret-right {
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
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAASnElEQVR4Xu2dCZAW1RWFmQECoigY4w5R474RDZZrTDAqSiQDzMLIALIKsgoii2zDjiDbCCKLIKCIMOyIxMQtMdFyLS0TS0stLUxMtDQhkYkEZsjp+H6XgZ9/69P9ut+ZKmqA6f7e7XP7zL2vX//deXX0JQWkQFIF8qSNFJACyRWQQXR2SIFDKCCD6PSQAjKIzgEpkJ0CqiDZ6aa9HFFABnEk0TrM7BSQQbLTTXs5ooAM4kiidZjZKSCDZKeb9nJEAecNUllZeV5RUdGfHMm3DjNDBZw2yMaNG8dDr5L9+/d37NChw5sZaqfNHVDAWYMYc5SbHL9VXV1dikryhgM51yFmoICTBqlljoRcb5tK8noG+mnTmCvgnEGSmCOR5ndMJXkt5nnX4aWpgFMGSWGOhGTv1tTUdCwsLHw1TQ21WYwVcMYgaZojker38JeO7du3fyXGudehpaGAEwbJ0BwJ2d5HJSlFJXkpDR21SUwViL1BsjRHIt0fmEryYkzzr8NKoUCsDZKjORLSfWgqyQs6m9xTILYG8ckciTNip7kE/Lx7p4jbRxxLg/hsjsQZ8pGpJH9w+5Rx6+hjZxCSORJnxV9NJXnOrdPE3aONnUG8VG7atGkcTuQJpLR+bCrJ70h8YS1SIJYG8fRFJRmLbxNJWv/dVJJnSXxhLVEgtgYxJhmD75NIWn9iLgE/Q+ILa4ECsTaIp++GDRtG5+XlTSZp/SkqSSlulX+KxBc2ZAVibxAzJ7kLJ/IUktafmUryJIkvbIgKOGEQ026NwvepJK0/N5XkNyS+sCEp4IxBTLs1Eu3WNJLW/zSV5AkSX9gQFHDKIMYkI2CS6SStd5lKsoPEFzZgBZwziGm3huP73SSt/20qyeMkvrABKuCkQczEfRh+288kaf2FWUx8jMQXNiAFnDWIqSR34Ps9JK2rzGLiNhJf2AAUcNogZk4yFHOSWSSt/wN2x3bt2m0l8YUlK+C8QUy7NQS/7WcztIZBvvTaLSwmbmbwxeQqIIMYfXHv1u346xyS3P81E/dNJL6wJAVkkG8JC5MMxj/nkrTeay4BbyDxhSUoIIPUEhX3bg1CWzSPoLWHrDaVZD2JL6zPCsggBxEUlWQg/rvCZ60TuBpTSdaR+ML6qIAMkkRMmGQAfnSvj1rXRnnP3VpL5AvtgwIyyCFERLvVH+3WfB90PigC7FJcAn6UxRc3dwVkkBQaopLchk3uy13qpIROqCSPEPlC56CADJKGeJs3b+6LtYyFaWya1SaoJGWoJKuz2lk7URWQQdKUFw+C6IPJ9f1pbp7NZl1QSR7KZkftw1NABslAW7Rbt2LzRRnskummXWGSVZnupO15CsggGWqLiXtvtESLM9wt7c1RpbrhtpQVae+gDakKyCBZyIt2qxdO5CVZ7JruLt1RSR5Md2Ntx1NABslSW7RbPbHr0ix3T7kbqlQPTNyXp9xQG1AVkEFykBftVg+cyA/kgEi1ay9UEiY/1fjO/1wGyfEUgEm6wyTLcsQk3R3s3qgktErFijsuXBnEh0zCJLfgRGbOGfqgktAuDPggQWwRMohPqcXEvSsm7rSrTzBgX1QS5iVmn5SIF0YG8TGfmLh3AW6lj8jaqH6oJLQVfWLckUXLID6nDibpDCRtsQ+VpD8qCfPeMJ8ViTZOBiHkD3OSMpzItNtGwB4AkywghC5kLQVkENIpgTlJJ8xJHibhPewgtFvMz6sQQ48OWgYh5grt1s3A0+7SRSUZjErC+uQjUZnooGUQcq7QbpXiRGZ+3mMIKgnrQRNkdezHyyAB5Gj9+vUd8/Pz17CGggGHopKwHlnECjsSXBkkoDSh3SrBUMyP1w5DJWE9ITIglewbRgYJMCeYuBdhuLWYvFN0RyW5E5WE9azhAJWyZyhKouw5PPsiQSUp9EyCP/mM6NDKDS8oKGA9tZ4RstVMGSSE9GDi3gG/7T2T1GUMD/ZIVBLW+08YIVvLlEFCSg3arfZotTyT1GOEAJOMgklYb9JihGwlUwYJMS1ot9qZdqs+IwyYZDRMwnpxKSNk65gySMgpQbtVYNqt7zFCAXsMTMJ6BTYjZKuYMogF6cA6ya8wufbarQaMcPBMr3GFhYWTGOy4M2UQSzKMOUlbnMhr8Ru/ISMkzHfG42kpExnsODNlEIuyi3brJtNuHUYKqxyLiRNI7FhiZRDL0opK0sabuOM3/uGM0MCdiEoynsGOI1MGsTCruLp1o7m6dQQpvEmoJONI7FhhZRBL04kHZt/gzUkQXmNGiKgkU1BJxjDYcWLKIBZnE+1Wa7OYeCQjTLCnwiSjGey4MGUQyzOJdut6024dxQgVJpkOk4xisOPAlEEikEVc3brOXN1qwggXJrkbJhnJYEedKYNEJINot6417VZTUsgzMHEfQWJHFiuDRCh1aLd+4ZkE1eRoRthg34NKcieDHVWmDBKxzKHdusa0W98nhT4LlWQYiR05rAwSuZTVqYN7t1qZe7eOYYSPSjIHlWQogx01pgwStYyZeLds2fKz6upqb53kWNIhzEUlGUJiRwYrg0QmVQcGisXEq81i4nGMw0AlqUAlGcxgR4Upg0QlU0nixNWtn+JH3r1bx5MO5V5UkkEktvVYGcT6FKUOEBP3q8zE/YTUW2e1xXyYZGBWe0Z8Jxkk4glMhI9260rTbp1IOqT7YJL+JLa1WBnE2tRkHhjarSvMh65OynzvtPZYCJP0S2vLmGwkg8QkkYnDQLt1uWm3TmYcGuY6izBx78tg28iUQWzMSo4xYZ3kMrNO0ixHVLLdF6OS9CGxrcLKIFalw79gKisrL61bt663TtLcP+o3JFSSpagkvRlsm5gyiE3Z8DkWLCZeYhYTT/EZncA9gErSi8S2AiuDWJEGXhC4utXSu8ERf04ljbIMJulJYoeOlUFCTwE/ANwF/BOM4rVbp5FGexAm6U5ih4qVQUKVP7jBMXG/2Ezcf0QadQVM0o3EDg0rg4QmffADo926yCwmnk4afRVM0pXEDgUrg4Qie3iDot36sWm3ziBF8RBM0oXEDhwrgwQuefgDYjGxhVlMPJMUzWqYpIzEDhQrgwQqtz2DYZ3kQrNOchYpqkdgkk4kdmBYGSQwqe0bCPduXWDu3TqbER2q1Bq8esF7V3xkv2SQyKbOn8DRbp1v2q1z/CEeQFmLStKRxKZjZRC6xPYPgEpyrjdxx2LieYxocXm5BC8WXcdgs5kyCFthy/moIOeYCnI+I1SwS9FmMd8Pzwj7a6YMQpXXbvjWrVvP3rdvn7fCfgEjUlSOm1E51jDYQTFlkKCUtmwcLBqeZe7RupARGipHGSrHagY7SKYMEqTaloyFtupM01a1YIQE43XGrfAPM9hBM2WQoBUPeTysf5xh1j+8FXXGVxdctXqIAQ6DKYOEoXpIY6KtOt3ci3URIwRUjltQOVYy2GExZZCwlA94XNyD5d3F603IL2YMDXN0gzlWMNhhMmWQMNUPaGzc6n6audXd+1yI718wRw+YY7nvYAuAMogFSWCGsHbt2lPr16/vVY6WjHFgjp4wxzIG2wamDGJDFkgxoK06xbxP5BLGEJjP9C4sLFzKYNvClEFsyYTPcaCt+iGuVj0Kg1zqM/r/OHBvReVYwmDbxJRBbMqGT7Hg3irveVjevVWX+YSsjemDS7mLSWyrsDKIVenIPRhUjpPNhPzy3GkHEmC621A57mewbWTKIDZmJcuYcG/VSebeqiuyRKTarR8qx8JUG8Xp5zJITLKJRcATzb1VVzIOCewBqBwLGGybmTKIzdlJMza0VSeYtuqqNHfJdLOBqBzzM90pDtvLIBHPItY5jjfrHN6bpnz/QuUYjMpR4Ts4IkAZJCKJOliYaKuO8569iztzryYdxu2oHPNI7EhgZZBIpOnAIHHL+rHmlvWfkQ5hCMwxl8SODFYGiUyqvgkUbdUPTFv1c0b4aKvuQFs1m8GOGlMGiVjGVq9efUzDhg29tqoVKfRhqByzSOzIYWWQCKVsx44dR1dVVa2DOa5hhI3KMRyVYyaDHVWmDBKRzG3btq2ptwiIk/haUsgjUDlmkNiRxcogEUgd7sptgjC9W9avY4QL041C5ZjOYEedKYNYnkFMyI8yE/LrSaHehcoxjcSOPFYGsTiF27dvP3LPnj1e5WjNCBNzmdF4NM9UBjsuTBnE0kxiEbCxubfqBlKIY1E5JpPYscHKIBamEm3VEaatupEU3jiYYxKJHSusDGJZOleuXHl448aNvbaqDSm0cphjAokdO6wMYlFK8XmORnv37vUWAX9JCmsCzFFOYscSK4NYkla0VYeZtuomUkiTYI5xJHZssTKIBaldvnx5wyZNmnhtVVtSOJNhjrEkdqyxMkjI6a2oqGjQrFkz7/0ZBYxQ0K5NwaXcMQy2C0wZJMQsv/zyy/V37tzpVY52pDCmoXLcRWI7gZVBQkrz008/XW/Xrl3evVXtGSGgckxH5RjFYLvElEFCyDYm5HXNhLwDafgZqBwjSGynsDJIwOkuLy/Pb9GihddWFTKGRuWYicoxnMF2kSmDBJh1tFN5uDPXW+coIg07C5VjGIntJFYGCTDteCSoN+coJg05G+a4g8R2FiuDBJR6VA7vUm4JYzhUpDloq4Yy2K4zZZAAzgCYw3sVckfSUPNQOW4nsZ3HyiDkUwCP53kEv+FLGcOAW4HKMZjBFvMrBWQQ4pmAyuG9J/xm0hDzUTkGktjCGgVkENKpAHN47wnvxMCjcixA5RjAYIv5XQVkEMIZAXOsArYzAe0hF6Jy9COxha2lgAzi8ykBc3jvCe/iM/arfjgv735UjtsYbDEProAM4uOZgXWOFVjn6Ooj8msUzLEI5ujLYIuZXAEZxKezA5XjQaBu8Qn3HQzMsQTmuJXBFvPQCsggPpwhMMdyYLr5gDoAAXMshTl6M9hiplZABkmt0SG3wDrHMpzE3XPEJNt9GSbkPUlsYdNQQAZJQ6Rkm6ByPICf9cgBkXRXmG45KgeFzYg3rkwZJMvMwhxLsSvrt/sKVA5Ky5bl4Tq7mwySRerRVi3Bb/heWeyachdwV6JyUCb7KQfXBgfOAaVJZgrAHItxElMmzeCugjkol4kzO0ptnVBAFSSDcwFt1SJsTrncivWTh/EKAtbqewZHqU2/rYAMkub5gEXAhTiJWQt1qzHnKEszFG0WoAIySBpio3Lch80ot3jAdGtQOVh3/KZxdNrkUArIICnOD5hjATZh3Rz4KCoH5bMiOu39UUAGOYSOaKvm4zd8f3+k/i4F3HWoHJSP4DLidZUpgyTJPCrHvfgR5TMXMEclzMF6eIOr5zLluGWQg8gKc1Tgv1mf1luPS7nFuKS7n5JRQX1VQAapJSfWOebh5B3kq8oGhsqxEXOOIvBrGHwx/VdABvmWpqgcc/FP1kMQNuEVB8WtWrXa538aRWQpIIMYZWGOOfgr5fE5qBxbmjdvXtSyZcu9rESKy1FABoGuaKtmo+0ZwpG4ztYGDRoUt2nTZg+JLyxRAecNAnPMgjkoTyVE5XisadOmRWirviTmUGiiAk4bBOscM3ESsx72vL1evXrFbdu2rSLmT2iyAs4aBOaYAXPcSdL38UaNGhW3bt16N4kvbEAKOGkQTMjvhr6sd2j8Gq9yLiopKfkioBxqGKICzhkEc47pmHOw3r70xO7du4s7d+78L2LOhA5QAacMgrZqGtqqkSR9f2sqxy4SX9gQFHDGIGirpkJf1kstn6yqqiouKyv7Rwg51JBEBZwwCNqqKWirWK9DfgqVoxhzjs+JeRI6JAVibxCYYzLMMZqk7zNo2YpwZ+5nJL6wISsQa4OgrZoEfceQNH7WVI5PSXxhLVAgtgaBOSZC37EkjX9vKscnJL6wligQS4OgrZqAtmocSePnTOX4G4kvrEUKxM4gqBzjoW85SeM/1tTUFBUWFn5M4gtrmQKxM4inL8kkz5vK8RfLcqhwiArE0iB+mwTt2gvV1dXFqBwfEXMhtIUKxNYgPprkRRikCJ8j32lh/hQSWYFYG8QHk7yEOYdXOT4k50F4SxWIvUFyMMkr2LcID1n4wNLcKawAFHDCIFmY5FVTOd4PIAcawmIFnDFIuibBfOM1LAIWo3K8Z3HeFFpACjhlkDRM8np+fn5RQUHBuwHpr2EsV8A5gyQzCSrHG15bhRsP37E8ZwovQAWcNMhBTPKmqRxvB6i9hoqAAs4aJGESVI5iUzneikC+FGLACjhtEE9rfAz3XCwC/jlg3TVcRBRw3iARyZPCDEkBGSQk4TVsNBSQQaKRJ0UZkgIySEjCa9hoKCCDRCNPijIkBWSQkITXsNFQQAaJRp4UZUgKyCAhCa9ho6GADBKNPCnKkBSQQUISXsNGQ4H/AUeBOBTMIUbyAAAAAElFTkSuQmCC");
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

.dropdownDiv {
  max-width: 250px;
  text-align: left;
}
</style>
