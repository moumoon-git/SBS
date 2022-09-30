<template>
  <div class="my-radio-box">
    <div class="my-radio-box-main">
      <el-radio-group v-model="tabPosition" @change="changePage">
        <el-radio-button
          v-for="(item, index) in list.filter((element) => {
            return element != null;
          })"
          :label="Number(item.label)"
          :key="index"
          >{{ item.name }}
        </el-radio-button>
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
    <edit-group-details
      v-if="editGroupDetailsVisible"
      :node="groupDetailsNode"
      :data="groupDetailsData"
      :treeDataProp="treeDataProp"
      :visibleProp.sync="editGroupDetailsVisible"
      :topPosition="tabPosition"
      @refresh="refreshData"
    ></edit-group-details>
    <add-group-details
      v-if="addGroupDetailsVisible"
      :node="globalNode"
      :data="globalData"
      :treeDataProp="treeDataProp"
      :visibleProp.sync="addGroupDetailsVisible"
      :topPosition="tabPosition"
      @refresh="refreshData"
    ></add-group-details>
    <div
      class="my-phone-main"
      v-if="tabPosition == 1 || tabPosition == 2 || tabPosition == 3"
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
            :style="{width: '100%',display: 'flex','align-items': 'center','margin-left':'11%',cursor: 'pointer',color:tabPosition==2?'rgba(0,145,255,1)':'rgba(153,153,153,1)'}"
            @click="tabPosition=2;getDataAl();"
          >
            <i class="el-icon-star-off" style="width:0.91vw;"></i>
            <span
              style="font-size:12px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;margin-left:3px;"
            >{{contactList[0].name || '常用联系人'}}</span>
          </div> -->
          <div
            :style="{
              width: '100%',
              display: 'flex',
              'align-items': 'center',
              'margin-left': '11%',
              cursor: 'pointer',
              color:
                tabPosition == 3 ? 'rgba(0,145,255,1)' : 'rgba(153,153,153,1)',
            }"
            @click="
              tabPosition = 3;
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
              >{{ contactList[1].name || "最近联系人" }}</span
            >
          </div>
        </div>
        <el-scrollbar class="my-tree-scroll">
          <el-input
            placeholder="输入关键字进行搜索"
            v-model="formData1.filterTree"
            class="treeSearch"
            style="padding: 10px; box-sizing: border-box"
          >
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              @click="$refs.tree1.filter(formData1.filterTree)"
            ></i>
          </el-input>
          <el-tree
            :data="formData1.treeData"
            v-loading="formData1.myLoading"
            @node-click="handleNodeClick"
            node-key="id"
            ref="tree1"
            highlight-current
            :props="defaultProps"
            :filter-node-method="filterNode"
            draggable
            @node-drop="handleDrop"
            :allow-drop="allowDrop"
            :allow-drag="allowDrag"
            :show-checkbox="!manageVisible ? true : false"
            @check-change="handleCheckChange"
            @check="handleCheck"
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
                  right: 4%;
                  transform: translateY(-50%);
                "
                v-show="treeBtnHoverIndex == data.id && data.id != -1"
              >
                <div
                  style="display: flex; align-items: center; cursor: pointer"
                  v-show="!manageVisible"
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
                      @click="editGroupDetails(node, data)"
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
                  v-show="!manageVisible"
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
                <div
                  style="
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    margin-left: 5px;
                  "
                >
                  <watch-group-details
                    :node="node"
                    :data="data"
                    :top-position="tabPosition"
                  ></watch-group-details>
                </div>
              </span>
            </span>
          </el-tree>
        </el-scrollbar>
        <treeBtn
          v-if="!manageVisible"
          @changeDialog="closeDialog"
          @refreshData="refreshData"
          :treeDataItem="formData1.treeDataItem"
          :treeData="formData1.treeData"
          :formData="formData"
          ref="treeBtn1"
          :treeDataItems="formData1.treeMultipleSelection"
          tabPosition="zhengwulianluowang"
        ></treeBtn>
        <!-- <el-alert title="温馨提示" type="info" description="可拖动修改同级分组排序" show-icon>
        </el-alert>-->
      </div>
      <div
        class="my-table-box"
        v-if="tabPosition == 1"
        style="box-sizing: border-box; overflow: auto"
      >
        <btn-box
          v-if="!manageVisible"
          ref="btnBox"
          :btnArry="btnArry"
          v-bind="{
            add: { callback: addList },
            del: { callback: handleDelete },
            sort: { callback: handleSort },
            download: { callback: handleExportContactor },
            document: { callback: handleExportm },
          }"
          :batchJoinIsShow="true"
          @handleBatchJoin="handleBatchJoin"
          @success="batchJoinSuccess"
        ></btn-box>
        <el-row
          class="my-table-box-search"
          style="margin: 10px; display: flex; align-items: center"
        >
          <el-col :span="11">
            <el-input
              placeholder="请输入姓名/单位/职位/号码"
              class="searchInput"
              v-model="formData1.searchText"
              @input="handleSearch"
            ></el-input>
          </el-col>
          <el-col :span="11">
            <el-button
              type="primary"
              @click="handleSearch"
              style="margin-left: 10px"
              >搜索</el-button
            >
          </el-col>
          <el-col :span="1" v-if="$window.g.IsZengChengProject">
            <i
              class="el-icon-s-order"
              :style="{
                color: formData1.isCardMode ? '#d7d7d7' : '#409EFF',
                'font-size': '30px',
                cursor: 'pointer',
              }"
              @click="formData1.isCardMode = false"
            ></i>
          </el-col>
          <el-col :span="1" v-if="$window.g.IsZengChengProject">
            <i
              class="el-icon-menu"
              :style="{
                color: formData1.isCardMode ? '#409EFF' : '#d7d7d7',
                'font-size': '30px',
                cursor: 'pointer',
              }"
              @click="formData1.isCardMode = true"
            ></i>
          </el-col>
        </el-row>
        <section
          v-if="
            $window.g.IsZengChengProject &&
            formData1.isCardMode &&
            formData1.tableData.length != 0
          "
          style="
            width: 100%;
            height: 670px;
            overflow-y: scroll;
            padding-left: 1.5%;
            display: flex;
            flex-wrap: wrap;
            align-content: flex-start;
          "
        >
          <div
            v-for="(item, index) in formData1.tableData"
            :key="index"
            id="formCard"
            @click="handleRowClick(item)"
            style="
              position: relative;
              display: inline-block;
              width: 12.4vw;
              min-width: 235px;
              height: 95px;
              border: 1px solid #d7d7d7;
              border-radius: 10px;
              margin: 1% 0px 0px 1%;
              display: flex;
            "
          >
            <el-checkbox
              v-if="!manageVisible && !threeSidesVisible && !transferVisible"
              v-model="item.checked"
              @change="onCheckCard(item, index)"
              style="position: absolute; left: 3%; top: 3%"
            ></el-checkbox>
            <div
              left
              style="
                display: inline-block;
                width: 40%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <div
                style="
                  width: 70%;
                  height: 55%;
                  overflow: hidden;
                  border-radius: 50%;
                "
              >
                <img
                  :src="
                    item.picture
                      ? $window.g.ApiUrl + item.picture
                      : '/static/img/headless.png'
                  "
                  style="width: 105%; height: 105%"
                />
              </div>
            </div>
            <div
              right
              style="
                position: relative;
                display: inline-block;
                width: 60%;
                height: 88px;
                box-sizing: border-box;
                padding: 6% 0px;
                display: flex;
                flex-wrap: wrap;
                align-items: center;
              "
            >
              <div
                style="
                  width: 100%;
                  font-size: 12px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                "
              >
                <span style="color: #d7d7d7">姓名：</span>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.name"
                  placement="top"
                >
                  <span>{{ item.name }}</span>
                </el-tooltip>
              </div>
              <div
                style="
                  width: 100%;
                  font-size: 12px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                "
              >
                <span style="color: #d7d7d7">职务：</span>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.position"
                  placement="top"
                >
                  <span>{{ item.position }}</span>
                </el-tooltip>
              </div>
              <div style="width: 100%; font-size: 12px; white-space: nowrap">
                <span style="color: #d7d7d7">电话：</span>
                <template v-if="item.number">
                  <template
                    v-if="
                      item.otherTel != '' ||
                      item.officeTel != '' ||
                      item.homeTel != '' ||
                      item.otherTel2 != ''
                    "
                  >
                    <el-dropdown
                      style="position: initial !important; font-size: 12px"
                      @command="handleCommand(item)"
                      placement="bottom"
                      trigger="click"
                      @visible-change="changeDropdown"
                    >
                      <span class="el-dropdown-link">
                        <div
                          style="
                            display: inline-block;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            width: initial;
                          "
                        >
                          <el-tooltip
                            class="item"
                            effect="dark"
                            :content="item.number"
                            placement="top"
                          >
                            <span>{{ item.number }}</span>
                          </el-tooltip>
                        </div>
                        <i
                          class="el-icon-arrow-down el-icon--right"
                          style="margin-left: 0px; font-size: 15px"
                        ></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="a" v-if="item.otherTel">
                          <div
                            @mouseover="elDropdownItem(1)"
                            class="dropdownDiv"
                          >
                            <span>手机2: {{ item.otherTel }}</span>
                            <span
                              v-if="showSpanImg == 1"
                              style="
                                display: inline-block;
                                width: 13px;
                                padding-left: 30px;
                              "
                            >
                              <img
                                style="width: 100%; height: 100%"
                                src="/static/img/icon/dailCall.png"
                              />
                            </span>
                          </div>
                        </el-dropdown-item>
                        <el-dropdown-item command="b" v-if="item.officeTel">
                          <div
                            @mouseover="elDropdownItem(2)"
                            class="dropdownDiv"
                          >
                            <span>办公电话: {{ item.officeTel }}</span>
                            <span
                              v-if="showSpanImg == 2"
                              style="
                                display: inline-block;
                                width: 13px;
                                padding-left: 30px;
                              "
                            >
                              <img
                                style="width: 100%; height: 100%"
                                src="/static/img/icon/dailCall.png"
                              />
                            </span>
                          </div>
                        </el-dropdown-item>
                        <el-dropdown-item command="c" v-if="item.homeTel">
                          <div
                            @mouseover="elDropdownItem(3)"
                            class="dropdownDiv"
                          >
                            <span>应急电话: {{ item.homeTel }}</span>
                            <span
                              v-if="showSpanImg == 3"
                              style="
                                display: inline-block;
                                width: 13px;
                                padding-left: 30px;
                              "
                            >
                              <img
                                style="width: 100%; height: 100%"
                                src="/static/img/icon/dailCall.png"
                              />
                            </span>
                          </div>
                        </el-dropdown-item>
                        <el-dropdown-item command="d" v-if="item.otherTel2">
                          <div
                            @mouseover="elDropdownItem(4)"
                            class="dropdownDiv"
                          >
                            <span>其他电话: {{ item.otherTel2 }}</span>
                            <span
                              v-if="showSpanImg == 4"
                              style="
                                display: inline-block;
                                width: 13px;
                                padding-left: 30px;
                              "
                            >
                              <img
                                style="width: 100%; height: 100%"
                                src="/static/img/icon/dailCall.png"
                              />
                            </span>
                          </div>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                  <div
                    v-else
                    style="
                      display: inline-block;
                      overflow: hidden;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      width: initial;
                    "
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="item.number"
                      placement="top"
                    >
                      <span>{{ item.number }}</span>
                    </el-tooltip>
                  </div>
                </template>
              </div>
              <div
                style="
                  position: absolute;
                  bottom: -5%;
                  right: 5%;
                  white-space: nowrap;
                "
              >
                <el-tooltip
                  v-if="manageVisible && !threeSidesVisible && !transferVisible"
                  class="item"
                  effect="dark"
                  content="查看"
                  placement="top"
                >
                  <i
                    class="el-icon-info"
                    @click="watchContactDetails(item)"
                    style="font-size: 16px; color: #9fc8fe; cursor: pointer"
                  ></i>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  v-if="manageVisible && !threeSidesVisible && !transferVisible"
                  effect="dark"
                  content="拨号"
                  placement="top"
                >
                  <i
                    class="el-icon-phone-outline"
                    @click="talkCall(item)"
                    style="
                      font-size: 16px;
                      margin-left: 2%;
                      color: #9fc8fe;
                      cursor: pointer;
                    "
                  ></i>
                </el-tooltip>

                <el-tooltip
                  v-if="
                    !manageVisible && !threeSidesVisible && !transferVisible
                  "
                  class="item"
                  effect="dark"
                  content="编辑"
                  placement="top"
                >
                  <i
                    class="el-icon-edit"
                    @click="
                      ['formData' + tabPosition].rowData = item;
                      window.setTimeout(() => {
                        handleEdit();
                      }, 500);
                    "
                    style="
                      font-size: 16px;
                      margin-left: 2%;
                      color: #9fc8fe;
                      cursor: pointer;
                    "
                  ></i>
                </el-tooltip>
                <el-tooltip
                  v-if="
                    !manageVisible && !threeSidesVisible && !transferVisible
                  "
                  class="item"
                  effect="dark"
                  content="删除"
                  placement="top"
                >
                  <i
                    class="el-icon-delete-solid"
                    @click="
                      ['formData' + tabPosition].rowData = item;
                      window.setTimeout(() => {
                        handleDeleteItem();
                      }, 500);
                    "
                    style="
                      font-size: 16px;
                      margin-left: 2%;
                      color: #9fc8fe;
                      cursor: pointer;
                    "
                  ></i>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="三方"
                  placement="top"
                  v-if="threeSidesVisible"
                >
                  <i
                    class="el-icon-circle-plus"
                    @click="busClickThree({ row: item })"
                    style="font-size: 16px; color: #9fc8fe; cursor: pointer"
                  ></i>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="转接"
                  placement="top"
                  v-if="transferVisible"
                >
                  <img
                    style="display: inline-block; width: 24px; cursor: pointer"
                    src="/static/img/icon/onDailCall.png"
                    @click="busClickTrans({ row: item })"
                  />
                </el-tooltip>
              </div>
            </div>
          </div>
        </section>
        <section
          v-if="
            $window.g.IsZengChengProject &&
            formData1.isCardMode &&
            formData1.tableData.length == 0
          "
          style="
            width: 100%;
            height: 670px;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          暂无数据
        </section>
        <el-table
          v-if="!formData1.isCardMode || !$window.g.IsZengChengProject"
          ref="singleTable"
          :data="formData1.tableData"
          highlight-current-row
          :header-cell-style="{ background: '#E6E6E6', color: '#606266' }"
          height="670"
          style="width: 100%; height: 670px; overflow: auto"
          @row-dblclick="handleRowDbClick"
          @cell-mouse-enter="showInfo"
          @row-click="handleRowClick"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            v-if="!manageVisible"
          ></el-table-column>
          <!-- <el-table-column type="index" width="50" show-overflow-tooltip  :resizable="false" align="center"></el-table-column> -->
          <el-table-column
            align="center"
            prop="name"
            show-overflow-tooltip
            :resizable="false"
            label="姓名"
          >
            <template slot-scope="scope">
              <span style="color: red" v-if="scope.row.infoMark == 1">*</span>
              <span style="margin-left: 10px">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
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
            <template slot-scope="scope">
              <div v-if="scope.row.number">
                <div
                  v-if="
                    scope.row.otherTel != '' ||
                    scope.row.officeTel != '' ||
                    scope.row.homeTel != '' ||
                    scope.row.otherTel2 != ''
                  "
                >
                  <el-dropdown
                    @command="handleCommand(scope.row)"
                    placement="bottom"
                    trigger="click"
                    @visible-change="changeDropdown"
                  >
                    <span class="el-dropdown-link">
                      {{ scope.row.number }}
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="a" v-if="scope.row.otherTel">
                        <div @mouseover="elDropdownItem(1)" class="dropdownDiv">
                          <span>手机2: {{ scope.row.otherTel }}</span>
                          <span
                            v-if="showSpanImg == 1"
                            style="
                              display: inline-block;
                              width: 13px;
                              padding-left: 30px;
                            "
                          >
                            <img
                              style="width: 100%; height: 100%"
                              src="/static/img/icon/dailCall.png"
                            />
                          </span>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item command="b" v-if="scope.row.officeTel">
                        <div @mouseover="elDropdownItem(2)" class="dropdownDiv">
                          <span>办公电话: {{ scope.row.officeTel }}</span>
                          <span
                            v-if="showSpanImg == 2"
                            style="
                              display: inline-block;
                              width: 13px;
                              padding-left: 30px;
                            "
                          >
                            <img
                              style="width: 100%; height: 100%"
                              src="/static/img/icon/dailCall.png"
                            />
                          </span>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item command="c" v-if="scope.row.homeTel">
                        <div @mouseover="elDropdownItem(3)" class="dropdownDiv">
                          <span>应急电话: {{ scope.row.homeTel }}</span>
                          <span
                            v-if="showSpanImg == 3"
                            style="
                              display: inline-block;
                              width: 13px;
                              padding-left: 30px;
                            "
                          >
                            <img
                              style="width: 100%; height: 100%"
                              src="/static/img/icon/dailCall.png"
                            />
                          </span>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item command="d" v-if="scope.row.otherTel2">
                        <div @mouseover="elDropdownItem(4)" class="dropdownDiv">
                          <span>其他电话: {{ scope.row.otherTel2 }}</span>
                          <span
                            v-if="showSpanImg == 4"
                            style="
                              display: inline-block;
                              width: 13px;
                              padding-left: 30px;
                            "
                          >
                            <img
                              style="width: 100%; height: 100%"
                              src="/static/img/icon/dailCall.png"
                            />
                          </span>
                        </div>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                <span v-else>{{ scope.row.number }}</span>
              </div>
              <span v-else>{{ scope.row.number }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column align="center" prop="updateTime" show-overflow-tooltip :resizable="false" label="更新时间"></el-table-column> -->
          <el-table-column label="操作" width="150px" align="center">
            <template slot-scope="scope">
              <el-tooltip
                v-if="manageVisible && !threeSidesVisible && !transferVisible"
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
                v-if="!manageVisible && !threeSidesVisible && !transferVisible"
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
                v-if="!manageVisible && !threeSidesVisible && !transferVisible"
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
              <el-tooltip
                class="item"
                v-if="manageVisible && !threeSidesVisible && !transferVisible"
                effect="dark"
                content="拨号"
                placement="top"
              >
                <i
                  class="el-icon-phone-outline"
                  @click="talkCall(scope.row)"
                  style="
                    font-size: 24px;
                    margin-left: 1vw;
                    color: #9fc8fe;
                    cursor: pointer;
                  "
                ></i>
              </el-tooltip>
              <!-- <el-tooltip class="item" effect="dark" content="设为常用联系人" placement="top"
                          v-if="!threeSidesVisible&&!transferVisible">
                <i
                  class="el-icon-star-on"
                  @click="handSetToCommon(scope.row)"
                  :style="{'font-size': '24px',cursor: 'pointer','margin-left': '1vw',color:scope.row.commonlyUsed==0?'#9FC8FE':'#FBC958'}"
                ></i>
              </el-tooltip> -->
              <el-tooltip
                class="item"
                effect="dark"
                content="三方"
                placement="top"
                v-if="threeSidesVisible"
              >
                <i
                  class="el-icon-circle-plus"
                  @click="busClickThree(scope)"
                  style="font-size: 24px; color: #9fc8fe; cursor: pointer"
                ></i>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="转接"
                placement="top"
                v-if="transferVisible"
              >
                <img
                  style="display: inline-block; width: 24px; cursor: pointer"
                  src="/static/img/icon/onDailCall.png"
                  @click="busClickTrans(scope)"
                />
              </el-tooltip>
              <!-- <el-button type="primary" size="mini" @click="addPhoneCall(scope.row)">添加</el-button>
              <el-button type="primary" size="mini" @click="talkCall(scope.row)">拨号</el-button>
              <el-button type="primary" size="mini" @click="handSetToCommon(scope.row)">设为常用</el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-pagination
            class="pagination"
            background
            :page-size="formData1.pageSize"
            :page-sizes="[10, 20, 30, 40]"
            :total="formData1.total"
            :current-page="formData1.currentPage"
            @current-change="handCurrentChange"
            @size-change="handSizeChange"
            layout="total, prev, pager, next, sizes, jumper"
          ></el-pagination>
        </el-row>
      </div>
      <div
        class="my-table-box"
        v-if="tabPosition == 2"
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
              v-model="formData2.searchText"
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
          ref="singleTable"
          :data="formData2.tableData"
          highlight-current-row
          :header-cell-style="{ background: '#E6E6E6', color: '#606266' }"
          height="670"
          style="width: 100%; height: 670px; overflow: auto"
          @row-dblclick="handleRowDbClick"
          @cell-mouse-enter="showInfo"
          @row-click="handleRowClick"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            v-if="!manageVisible"
          ></el-table-column>
          <!-- <el-table-column type="index" width="50" show-overflow-tooltip  :resizable="false" align="center"></el-table-column> -->
          <el-table-column
            align="center"
            prop="name"
            show-overflow-tooltip
            :resizable="false"
            label="姓名"
          >
            <template slot-scope="scope">
              <span style="color: red" v-if="scope.row.infoMark == 1">*</span>
              <span style="margin-left: 10px">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
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
            <template slot-scope="scope">
              <div v-if="scope.row.number">
                <div
                  v-if="
                    scope.row.otherTel != '' ||
                    scope.row.officeTel != '' ||
                    scope.row.homeTel != '' ||
                    scope.row.otherTel2 != ''
                  "
                >
                  <el-dropdown
                    @command="handleCommand(scope.row)"
                    placement="bottom"
                    trigger="click"
                    @visible-change="changeDropdown"
                  >
                    <span class="el-dropdown-link">
                      {{ scope.row.number }}
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="a" v-if="scope.row.otherTel">
                        <div @mouseover="elDropdownItem(1)" class="dropdownDiv">
                          <span>手机2: {{ scope.row.otherTel }}</span>
                          <span
                            v-if="showSpanImg == 1"
                            style="
                              display: inline-block;
                              width: 13px;
                              padding-left: 30px;
                            "
                          >
                            <img
                              style="width: 100%; height: 100%"
                              src="/static/img/icon/dailCall.png"
                            />
                          </span>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item command="b" v-if="scope.row.officeTel">
                        <div @mouseover="elDropdownItem(2)" class="dropdownDiv">
                          <span>办公电话: {{ scope.row.officeTel }}</span>
                          <span
                            v-if="showSpanImg == 2"
                            style="
                              display: inline-block;
                              width: 13px;
                              padding-left: 30px;
                            "
                          >
                            <img
                              style="width: 100%; height: 100%"
                              src="/static/img/icon/dailCall.png"
                            />
                          </span>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item command="c" v-if="scope.row.homeTel">
                        <div @mouseover="elDropdownItem(3)" class="dropdownDiv">
                          <span>应急电话: {{ scope.row.homeTel }}</span>
                          <span
                            v-if="showSpanImg == 3"
                            style="
                              display: inline-block;
                              width: 13px;
                              padding-left: 30px;
                            "
                          >
                            <img
                              style="width: 100%; height: 100%"
                              src="/static/img/icon/dailCall.png"
                            />
                          </span>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item command="d" v-if="scope.row.otherTel2">
                        <div @mouseover="elDropdownItem(4)" class="dropdownDiv">
                          <span>其他电话: {{ scope.row.otherTel2 }}</span>
                          <span
                            v-if="showSpanImg == 4"
                            style="
                              display: inline-block;
                              width: 13px;
                              padding-left: 30px;
                            "
                          >
                            <img
                              style="width: 100%; height: 100%"
                              src="/static/img/icon/dailCall.png"
                            />
                          </span>
                        </div>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                <span v-else>{{ scope.row.number }}</span>
              </div>
              <span v-else>{{ scope.row.number }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px" align="center">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                content="拨号"
                placement="top"
                v-if="!threeSidesVisible && !transferVisible"
              >
                <i
                  class="el-icon-phone-outline"
                  @click="talkCall(scope.row)"
                  style="font-size: 24px; color: #9fc8fe; cursor: pointer"
                ></i>
              </el-tooltip>
              <!-- <el-tooltip class="item" effect="dark" content="设为常用联系人" placement="top"
                          v-if="!threeSidesVisible&&!transferVisible">
                <i
                  class="el-icon-star-on"
                  @click="formData2.rowData=scope.row;handleDeleteItem()"
                  :style="{'font-size': '24px',cursor: 'pointer','margin-left': '1vw',color:'#FBC958'}"
                ></i>
              </el-tooltip> -->
              <el-tooltip
                class="item"
                effect="dark"
                content="三方"
                placement="top"
                v-if="threeSidesVisible"
              >
                <i
                  class="el-icon-circle-plus"
                  @click="busClickThree(scope)"
                  style="font-size: 24px; color: #9fc8fe; cursor: pointer"
                ></i>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="转接"
                placement="top"
                v-if="transferVisible"
              >
                <img
                  style="display: inline-block; width: 24px; cursor: pointer"
                  src="/static/img/icon/onDailCall.png"
                  @click="busClickTrans(scope)"
                />
              </el-tooltip>
              <!-- <el-button type="primary" size="mini" @click="addPhoneCall(scope.row)">添加</el-button>
              <el-button type="primary" size="mini" @click="talkCall(scope.row)">拨号</el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-pagination
            class="pagination"
            background
            :page-size="formData2.pageSize"
            :page-sizes="[10, 20, 30, 40]"
            :total="formData2.total"
            :current-page="formData2.currentPage"
            @current-change="handCurrentChange"
            @size-change="handSizeChange"
            layout="total, prev, pager, next, sizes, jumper"
          ></el-pagination>
        </el-row>
      </div>
      <div
        class="my-table-box"
        v-if="tabPosition == 3"
        style="box-sizing: border-box; overflow: auto"
      >
        <el-table
          ref="singleTable"
          :data="formData3.tableData"
          highlight-current-row
          :header-cell-style="{ background: '#E6E6E6', color: '#606266' }"
          height="670"
          style="width: 100%; height: 670px; overflow: auto"
          @row-click="handleRowClick"
          @selection-change="handleSelectionChange"
        >
          <!-- <el-table-column type="index" width="50" show-overflow-tooltip  :resizable="false" align="center"></el-table-column> -->
          <el-table-column
            show-overflow-tooltip
            align="center"
            v-for="(item, key) in tableColumn3"
            :key="key"
            :label="item.label"
            :prop="item.prop"
            :resizable="false"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="number"
            show-overflow-tooltip
            :resizable="false"
            label="联系号码"
          >
            <template slot-scope="scope">
              {{
                scope.row.mobile ||
                scope.row.otherTel ||
                scope.row.officeTel ||
                scope.row.homeTel ||
                scope.row.otherTel2
              }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px" align="center">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                content="拨号"
                placement="top"
                v-if="!threeSidesVisible && !transferVisible"
              >
                <i
                  class="el-icon-phone-outline"
                  @click="talkCall(scope.row)"
                  style="font-size: 24px; color: #9fc8fe; cursor: pointer"
                ></i>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="三方"
                placement="top"
                v-if="threeSidesVisible"
              >
                <i
                  class="el-icon-circle-plus"
                  @click="busClickThree(scope)"
                  style="font-size: 24px; color: #9fc8fe; cursor: pointer"
                ></i>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="转接"
                placement="top"
                v-if="transferVisible"
              >
                <img
                  style="display: inline-block; width: 24px; cursor: pointer"
                  src="/static/img/icon/onDailCall.png"
                  @click="busClickTrans(scope)"
                />
              </el-tooltip>
              <!-- <el-button type="primary" size="mini" @click="addPhoneCall(scope.row)">添加</el-button>
              <el-button type="primary" size="mini" @click="talkCall(scope.row)">拨号</el-button>-->
            </template>
          </el-table-column>
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
    <!-- <div class="my-phone-main" v-else-if="tabPosition==2">
      <div class="my-table-box" style="border: none">
        <btn-box
          :btnArry="btnArry1"
          v-bind="{
                            del:{callback:handleDelete},
                            edit:{callback:handleEdit},
                         }"
        ></btn-box>
        <el-row class="my-table-box-search" style="margin:10px;">
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
        <el-table
          ref="singleTable"
          :data="formData2.tableData"
          highlight-current-row
          :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
          style="height: 600px;width:100%;overflow: auto;"
          @row-dblclick="handleRowDbClick"
          @row-click="handleRowClick"
        >
          <el-table-column align="center" prop="name" show-overflow-tooltip :resizable="false" label="姓名"></el-table-column>
          <el-table-column align="center" prop="workUnit" show-overflow-tooltip :resizable="false" label="单位"></el-table-column>
          <el-table-column align="center" prop="position" show-overflow-tooltip :resizable="false" label="职位"></el-table-column>
          <el-table-column align="center" prop="number" show-overflow-tooltip :resizable="false" label="联系号码">
            <template slot-scope="scope" >
              <div  v-if="scope.row.number">
                <div v-if="scope.row.otherTel!=''||scope.row.officeTel!=''||scope.row.homeTel!=''||scope.row.otherTel2!=''" >
                  <el-dropdown @command="handleCommand(scope.row)" placement="bottom" trigger="click"
                               @visible-change="changeDropdown">
                <span class="el-dropdown-link">
                  {{scope.row.number}}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="a" v-if="scope.row.otherTel">
                        <div @mouseover='elDropdownItem(1)' class="dropdownDiv">
                          <span>手机2:  {{scope.row.otherTel}}</span>
                          <span v-if="showSpanImg==1" style="display: inline-block;width:13px;padding-left: 30px">
                        <img style="width: 100%;height: 100%" src="/static/img/icon/dailCall.png" />
                      </span>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item command="b" v-if="scope.row.officeTel">
                        <div @mouseover='elDropdownItem(2)' class="dropdownDiv" >
                          <span>办公电话:  {{scope.row.officeTel}}</span>
                          <span v-if="showSpanImg==2"  style="display: inline-block;width:13px;padding-left: 30px">
                        <img style="width: 100%;height: 100%" src="/static/img/icon/dailCall.png" />
                      </span>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item command="c" v-if="scope.row.homeTel">
                        <div @mouseover='elDropdownItem(3)' class="dropdownDiv">
                          <span> 应急电话:  {{scope.row.homeTel}}</span>
                          <span v-if="showSpanImg==3" style="display: inline-block;width:13px;padding-left: 30px">
                          <img style="width: 100%;height: 100%" src="/static/img/icon/dailCall.png" />
                        </span>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item command="d" v-if="scope.row.otherTel2">
                        <div @mouseover='elDropdownItem(4)' class="dropdownDiv">
                          <span > 其他电话:  {{scope.row.otherTel2}}</span>
                          <span v-if="showSpanImg==4" style="display: inline-block;width:13px;padding-left: 30px">
                          <img style="width: 100%;height: 100%" src="/static/img/icon/dailCall.png" />
                        </span>
                        </div>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>

                </div>
                <span v-else>{{scope.row.number}}</span>
              </div>
              <span v-else>{{scope.row.number}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250px" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="addPhoneCall(scope.row)">添加</el-button>
              <el-button type="primary" size="mini" @click="talkCall(scope.row)">拨号</el-button>
            </template>
          </el-table-column>
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
    </div>-->
    <!-- <div class="my-phone-main" v-else-if="tabPosition==3">
      <div class="my-table-box" style="border: none">
        <el-table
          ref="singleTable"
          :data="formData3.tableData"
          highlight-current-row
          height="586px"
          :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
          style="height: 700px;width:100%;"
          @row-click="handleRowClick"
        >
          <el-table-column type="index" width="50" show-overflow-tooltip  :resizable="false" align="center"></el-table-column>
          <el-table-column   show-overflow-tooltip align="center"
                             v-for="(item,key) in tableColumn3" :key="key" :label="item.label" :prop="item.prop"
                             :width="item.width" :resizable="false"></el-table-column>
          <el-table-column label="操作" width="250px" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="addPhoneCall(scope.row)">添加</el-button>
              <el-button type="primary" size="mini" @click="talkCall(scope.row)">拨号</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-pagination
            class="pagination"
            background
            :page-size="formData3.pageSize"
            :total="formData3.total"
            layout="prev, pager, next"
          ></el-pagination>
        </el-row>
      </div>
    </div>-->
    <div class="my-phone-main" v-if="tabPosition == 4">
      <div class="my-tree-box" style="box-sizing: border-box; overflow: auto">
        <el-input
          placeholder="输入关键字进行搜索"
          v-model="formData4.filterTree"
          class="treeSearch"
          style="padding: 10px; box-sizing: border-box"
        >
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="$refs.tree4.filter(formData4.filterTree)"
          ></i>
        </el-input>

        <div style="max-height: 711px; min-height: 711px; overflow: auto">
          <el-tree
            :accordion="true"
            :filter-node-method="filterNode"
            :default-expand-all="isExpand"
            :data="formData4.treeData"
            v-loading="formData4.myLoading"
            @node-click="handleNodeClick"
            node-key="id"
            ref="tree4"
            highlight-current
            :props="defaultProps"
          ></el-tree>
        </div>
      </div>
      <div class="my-table-box" style="box-sizing: border-box; overflow: auto">
        <el-row
          class="my-table-box-search"
          style="margin: 10px; display: flex; align-items: center"
        >
          <el-col :span="11">
            <el-input
              placeholder="请输入姓名/单位/职位/号码"
              class="searchInput"
              v-model="formData4.searchText"
            ></el-input>
          </el-col>
          <el-col :span="11">
            <el-button
              type="primary"
              @click="handleSearch"
              style="margin-left: 10px"
              >搜索</el-button
            >
          </el-col>
          <el-col :span="1" v-if="$window.g.IsZengChengProject">
            <i
              class="el-icon-s-order"
              :style="{
                color: formData4.isCardMode ? '#d7d7d7' : '#409EFF',
                'font-size': '30px',
                cursor: 'pointer',
              }"
              @click="formData4.isCardMode = false"
            ></i>
          </el-col>
          <el-col :span="1" v-if="$window.g.IsZengChengProject">
            <i
              class="el-icon-menu"
              :style="{
                color: formData4.isCardMode ? '#409EFF' : '#d7d7d7',
                'font-size': '30px',
                cursor: 'pointer',
              }"
              @click="formData4.isCardMode = true"
            ></i>
          </el-col>
        </el-row>

        <section
          v-if="
            $window.g.IsZengChengProject &&
            formData4.isCardMode &&
            formData4.tableData.length != 0
          "
          style="
            width: 100%;
            height: 670px;
            padding-left: 1.5%;
            overflow-y: scroll;
            display: flex;
            flex-wrap: wrap;
            align-content: flex-start;
          "
        >
          <div
            v-for="(item, index) in formData4.tableData"
            :key="index"
            @click="handleRowClick(item)"
            style="
              position: relative;
              display: inline-block;
              width: 12.4vw;
              min-width: 235px;
              height: 95px;
              border: 1px solid #d7d7d7;
              border-radius: 10px;
              margin: 1% 0px 0px 1%;
              display: flex;
            "
          >
            <el-checkbox
              v-if="!manageVisible && !threeSidesVisible && !transferVisible"
              v-model="item.checked"
              @change="onCheckCard(item, index)"
              style="position: absolute; left: 3%; top: 3%"
            ></el-checkbox>
            <div
              left
              style="
                display: inline-block;
                width: 40%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <div
                style="
                  width: 70%;
                  height: 55%;
                  overflow: hidden;
                  border-radius: 50%;
                "
              >
                <img
                  :src="
                    item.picture
                      ? $window.g.ApiUrl + item.picture
                      : '/static/img/headless.png'
                  "
                  style="width: 105%; height: 105%"
                />
              </div>
            </div>
            <div
              right
              style="
                position: relative;
                display: inline-block;
                width: 60%;
                height: 88px;
                padding: 6% 0px;
                box-sizing: border-box;
                display: flex;
                flex-wrap: wrap;
                align-items: center;
              "
            >
              <div
                style="
                  width: 100%;
                  font-size: 12px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                "
              >
                <span style="color: #d7d7d7">姓名：</span>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.name"
                  placement="top"
                >
                  <span>{{ item.name }}</span>
                </el-tooltip>
              </div>
              <div
                style="
                  width: 100%;
                  font-size: 12px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                "
              >
                <span style="color: #d7d7d7">职务：</span>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.position"
                  placement="top"
                >
                  <span>{{ item.position }}</span>
                </el-tooltip>
              </div>
              <div style="width: 100%; font-size: 12px; white-space: nowrap">
                <span style="color: #d7d7d7">电话：</span>
                <template v-if="item.number">
                  <template
                    v-if="
                      item.otherTel != '' ||
                      item.officeTel != '' ||
                      item.homeTel != '' ||
                      item.otherTel2 != ''
                    "
                  >
                    <el-dropdown
                      style="position: initial !important; font-size: 12px"
                      @command="handleCommand(item)"
                      placement="bottom"
                      trigger="click"
                      @visible-change="changeDropdown"
                    >
                      <span class="el-dropdown-link">
                        <div
                          style="
                            display: inline-block;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            width: initial;
                          "
                        >
                          <el-tooltip
                            class="item"
                            effect="dark"
                            :content="item.number"
                            placement="top"
                          >
                            <span>{{ item.number }}</span>
                          </el-tooltip>
                        </div>
                        <i
                          class="el-icon-arrow-down el-icon--right"
                          style="margin-left: 0px; font-size: 15px"
                        ></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="a" v-if="item.otherTel">
                          <div
                            @mouseover="elDropdownItem(1)"
                            class="dropdownDiv"
                          >
                            <span>手机2: {{ item.otherTel }}</span>
                            <span
                              v-if="showSpanImg == 1"
                              style="
                                display: inline-block;
                                width: 13px;
                                padding-left: 30px;
                              "
                            >
                              <img
                                style="width: 100%; height: 100%"
                                src="/static/img/icon/dailCall.png"
                              />
                            </span>
                          </div>
                        </el-dropdown-item>
                        <el-dropdown-item command="b" v-if="item.officeTel">
                          <div
                            @mouseover="elDropdownItem(2)"
                            class="dropdownDiv"
                          >
                            <span>办公电话: {{ item.officeTel }}</span>
                            <span
                              v-if="showSpanImg == 2"
                              style="
                                display: inline-block;
                                width: 13px;
                                padding-left: 30px;
                              "
                            >
                              <img
                                style="width: 100%; height: 100%"
                                src="/static/img/icon/dailCall.png"
                              />
                            </span>
                          </div>
                        </el-dropdown-item>
                        <el-dropdown-item command="c" v-if="item.homeTel">
                          <div
                            @mouseover="elDropdownItem(3)"
                            class="dropdownDiv"
                          >
                            <span>应急电话: {{ item.homeTel }}</span>
                            <span
                              v-if="showSpanImg == 3"
                              style="
                                display: inline-block;
                                width: 13px;
                                padding-left: 30px;
                              "
                            >
                              <img
                                style="width: 100%; height: 100%"
                                src="/static/img/icon/dailCall.png"
                              />
                            </span>
                          </div>
                        </el-dropdown-item>
                        <el-dropdown-item command="d" v-if="item.otherTel2">
                          <div
                            @mouseover="elDropdownItem(4)"
                            class="dropdownDiv"
                          >
                            <span>其他电话: {{ item.otherTel2 }}</span>
                            <span
                              v-if="showSpanImg == 4"
                              style="
                                display: inline-block;
                                width: 13px;
                                padding-left: 30px;
                              "
                            >
                              <img
                                style="width: 100%; height: 100%"
                                src="/static/img/icon/dailCall.png"
                              />
                            </span>
                          </div>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                  <div
                    v-else
                    style="
                      display: inline-block;
                      overflow: hidden;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      width: initial;
                    "
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="item.number"
                      placement="top"
                    >
                      <span>{{ item.number }}</span>
                    </el-tooltip>
                  </div>
                </template>
              </div>
              <div
                style="
                  position: absolute;
                  bottom: -5%;
                  right: 5%;
                  white-space: nowrap;
                "
              >
                <el-tooltip
                  v-if="manageVisible && !threeSidesVisible && !transferVisible"
                  class="item"
                  effect="dark"
                  content="查看"
                  placement="top"
                >
                  <i
                    class="el-icon-info"
                    @click="watchContactDetails(item)"
                    style="font-size: 16px; color: #9fc8fe; cursor: pointer"
                  ></i>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  v-if="manageVisible && !threeSidesVisible && !transferVisible"
                  effect="dark"
                  content="拨号"
                  placement="top"
                >
                  <i
                    class="el-icon-phone-outline"
                    @click="talkCall(item)"
                    style="
                      font-size: 16px;
                      margin-left: 2%;
                      color: #9fc8fe;
                      cursor: pointer;
                    "
                  ></i>
                </el-tooltip>

                <el-tooltip
                  class="item"
                  effect="dark"
                  content="三方"
                  placement="top"
                  v-if="threeSidesVisible"
                >
                  <i
                    class="el-icon-circle-plus"
                    @click="busClickThree({ row: item })"
                    style="font-size: 16px; color: #9fc8fe; cursor: pointer"
                  ></i>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="转接"
                  placement="top"
                  v-if="transferVisible"
                >
                  <img
                    style="display: inline-block; width: 24px; cursor: pointer"
                    src="/static/img/icon/onDailCall.png"
                    @click="busClickTrans({ row: item })"
                  />
                </el-tooltip>
              </div>
            </div>
          </div>
        </section>
        <section
          v-if="
            $window.g.IsZengChengProject &&
            formData4.isCardMode &&
            formData4.tableData.length == 0
          "
          style="
            width: 100%;
            height: 670px;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          暂无数据
        </section>
        <el-table
          ref="singleTable"
          v-if="!formData4.isCardMode || !$window.g.IsZengChengProject"
          :data="formData4.tableData"
          highlight-current-row
          :header-cell-style="{ background: '#E6E6E6', color: '#606266' }"
          height="670"
          style="width: 100%; height: 670px; overflow: auto"
          @row-dblclick="handleRowDbClick"
          @cell-mouse-enter="showInfo"
          @row-click="handleRowClick"
          @selection-change="handleSelectionChange"
        >
          <!-- 这一行不能删，不然会出问题：管理状态下切换到应急联动网会出现多选框，切换回去也会出现多列的选择框-->
          <el-table-column type="selection" v-if="false"></el-table-column>
          <!-- <el-table-column type="index" width="50" show-overflow-tooltip  :resizable="false" align="center"></el-table-column> -->
          <el-table-column
            align="center"
            prop="name"
            show-overflow-tooltip
            :resizable="false"
            label="姓名"
          >
            <template slot-scope="scope">
              <span style="color: red" v-if="scope.row.infoMark == 1">*</span>
              <span style="margin-left: 10px">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
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
            <template slot-scope="scope">
              <div v-if="scope.row.number">
                <div
                  v-if="
                    scope.row.otherTel != '' ||
                    scope.row.officeTel != '' ||
                    scope.row.homeTel != '' ||
                    scope.row.otherTel2 != ''
                  "
                >
                  <el-dropdown
                    @command="handleCommand(scope.row)"
                    placement="bottom"
                    trigger="click"
                    @visible-change="changeDropdown"
                  >
                    <span class="el-dropdown-link">
                      {{ scope.row.number }}
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="a" v-if="scope.row.otherTel">
                        <div @mouseover="elDropdownItem(1)" class="dropdownDiv">
                          <span>手机2: {{ scope.row.otherTel }}</span>
                          <span
                            v-if="showSpanImg == 1"
                            style="
                              display: inline-block;
                              width: 13px;
                              padding-left: 30px;
                            "
                          >
                            <img
                              style="width: 100%; height: 100%"
                              src="/static/img/icon/dailCall.png"
                            />
                          </span>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item command="b" v-if="scope.row.officeTel">
                        <div @mouseover="elDropdownItem(2)" class="dropdownDiv">
                          <span>办公电话: {{ scope.row.officeTel }}</span>
                          <span
                            v-if="showSpanImg == 2"
                            style="
                              display: inline-block;
                              width: 13px;
                              padding-left: 30px;
                            "
                          >
                            <img
                              style="width: 100%; height: 100%"
                              src="/static/img/icon/dailCall.png"
                            />
                          </span>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item command="c" v-if="scope.row.homeTel">
                        <div @mouseover="elDropdownItem(3)" class="dropdownDiv">
                          <span>应急电话: {{ scope.row.homeTel }}</span>
                          <span
                            v-if="showSpanImg == 3"
                            style="
                              display: inline-block;
                              width: 13px;
                              padding-left: 30px;
                            "
                          >
                            <img
                              style="width: 100%; height: 100%"
                              src="/static/img/icon/dailCall.png"
                            />
                          </span>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item command="d" v-if="scope.row.otherTel2">
                        <div @mouseover="elDropdownItem(4)" class="dropdownDiv">
                          <span>其他电话: {{ scope.row.otherTel2 }}</span>
                          <span
                            v-if="showSpanImg == 4"
                            style="
                              display: inline-block;
                              width: 13px;
                              padding-left: 30px;
                            "
                          >
                            <img
                              style="width: 100%; height: 100%"
                              src="/static/img/icon/dailCall.png"
                            />
                          </span>
                        </div>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                <span v-else>{{ scope.row.number }}</span>
              </div>
              <span v-else>{{ scope.row.number }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px" align="center">
            <template slot-scope="scope">
              <!-- 
                    @authorName: qinjiaqi
                    @description：查看按钮 
                -->
              <el-tooltip
                v-if="manageVisible && !threeSidesVisible && !transferVisible"
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
              <el-tooltip
                class="item"
                effect="dark"
                content="拨号"
                placement="top"
                v-if="manageVisible && !threeSidesVisible && !transferVisible"
              >
                <i
                  class="el-icon-phone-outline"
                  @click="talkCall(scope.row)"
                  style="
                    font-size: 24px;
                    margin-left: 1vw;
                    color: #9fc8fe;
                    cursor: pointer;
                  "
                ></i>
              </el-tooltip>
              <!-- <el-tooltip class="item" effect="dark" content="设为常用联系人" placement="top"
                          v-if="!threeSidesVisible&&!transferVisible">
                <i
                  class="el-icon-star-on"
                  @click="handSetToCommon(scope.row)"
                  :style="{'font-size': '24px',cursor: 'pointer','margin-left': '1vw',color:scope.row.commonlyUsed==0?'#9FC8FE':'#FBC958'}"
                ></i>
              </el-tooltip> -->
              <el-tooltip
                class="item"
                effect="dark"
                content="三方"
                placement="top"
                v-if="threeSidesVisible"
              >
                <i
                  class="el-icon-circle-plus"
                  @click="busClickThree(scope)"
                  style="font-size: 24px; color: #9fc8fe; cursor: pointer"
                ></i>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="转接"
                placement="top"
                v-if="transferVisible"
              >
                <img
                  style="display: inline-block; width: 24px; cursor: pointer"
                  src="/static/img/icon/onDailCall.png"
                  @click="busClickTrans(scope)"
                />
              </el-tooltip>
              <!-- <el-button type="primary" size="mini" @click="addPhoneCall(scope.row)">添加</el-button>
              <el-button type="primary" size="mini" @click="talkCall(scope.row)">拨号</el-button>
              <el-button type="primary" size="mini" @click="handSetToCommon(scope.row)">设为常用</el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-pagination
            class="pagination"
            background
            :page-size="formData4.pageSize"
            :page-sizes="[10, 20, 30, 40]"
            :total="formData4.total"
            :current-page="formData4.currentPage"
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
            v-model="formData5.filterTree"
            class="treeSearch"
            style="padding: 10px; box-sizing: border-box"
          >
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              @click="$refs.tree5.filter(formData5.filterTree)"
            ></i>
          </el-input>
          <el-tree
            :data="formData5.treeData"
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
            node-key="id"
            ref="tree5"
            highlight-current
            :props="defaultProps"
            draggable
            @node-drop="handleDrop"
            :allow-drop="allowDrop"
            :allow-drag="allowDrag"
            :show-checkbox="!manageVisible ? true : false"
            @check-change="handleCheckChange"
            @check="handleCheck"
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
                  right: 4%;
                  transform: translateY(-50%);
                "
                v-show="treeBtnHoverIndex == data.id && data.id != -1"
              >
                <div
                  style="display: flex; align-items: center; cursor: pointer"
                  v-show="!manageVisible"
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
                      @click="editGroupDetails(node, data)"
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
                  v-show="!manageVisible"
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
                <div
                  style="
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    margin-left: 5px;
                  "
                >
                  <watch-group-details
                    :node="node"
                    :data="data"
                    :top-position="tabPosition"
                  ></watch-group-details>
                </div>
              </span>
            </span>
          </el-tree>
        </el-scrollbar>
        <treeBtn
          v-if="!manageVisible"
          @changeDialog="closeDialog"
          @refreshData="refreshData"
          :treeDataItem="formData5.treeDataItem"
          :treeData="formData5.treeData"
          :formData="treeBtnConfig"
          ref="treeBtn5"
          :treeDataItems="formData5.treeMultipleSelection"
          tabPosition="jicenglianluowang"
        ></treeBtn>
        <!-- <el-alert title="温馨提示" type="info" description="可拖动修改同级分组排序" show-icon>
        </el-alert>-->
      </div>
      <div class="my-table-box" style="box-sizing: border-box; overflow: auto">
        <btn-box
          v-if="!manageVisible"
          :btnArry="btnArry"
          v-bind="{
            add: { callback: addList },
            edit: { callback: handleEdit },
            del: { callback: handleDelete },
            sort: { callback: handleSort },
            download: { callback: handleExportContactor },
            document: { callback: handleExportm },
          }"
          :batchJoinIsShow="true"
          @handleBatchJoin="handleBatchJoin"
          @success="batchJoinSuccess"
        ></btn-box>
        <el-row
          class="my-table-box-search"
          style="margin: 10px; display: flex; align-items: center"
        >
          <el-col :span="11">
            <el-input
              placeholder="请输入姓名/单位/职位/号码"
              class="searchInput"
              v-model="formData5.searchText"
              @input="handleSearch"
            ></el-input>
          </el-col>
          <el-col :span="11">
            <el-button
              type="primary"
              @click="handleSearch"
              style="margin-left: 10px"
              >搜索</el-button
            >
          </el-col>
          <el-col :span="1" v-if="$window.g.IsZengChengProject">
            <i
              class="el-icon-s-order"
              :style="{
                color: formData5.isCardMode ? '#d7d7d7' : '#409EFF',
                'font-size': '30px',
                cursor: 'pointer',
              }"
              @click="formData5.isCardMode = false"
            ></i>
          </el-col>
          <el-col :span="1" v-if="$window.g.IsZengChengProject">
            <i
              class="el-icon-menu"
              :style="{
                color: formData5.isCardMode ? '#409EFF' : '#d7d7d7',
                'font-size': '30px',
                cursor: 'pointer',
              }"
              @click="formData5.isCardMode = true"
            ></i>
          </el-col>
        </el-row>
        <section
          v-if="
            $window.g.IsZengChengProject &&
            formData5.isCardMode &&
            formData5.tableData.length != 0
          "
          style="
            width: 100%;
            height: 670px;
            padding-left: 1.5%;
            overflow-y: scroll;
            display: flex;
            flex-wrap: wrap;
            align-content: flex-start;
          "
        >
          <div
            v-for="(item, index) in formData5.tableData"
            :key="index"
            @click="handleRowClick(item)"
            style="
              position: relative;
              display: inline-block;
              width: 12.4vw;
              min-width: 235px;
              height: 95px;
              border: 1px solid #d7d7d7;
              border-radius: 10px;
              margin: 1% 0px 0px 1%;
              display: flex;
            "
          >
            <el-checkbox
              v-if="!manageVisible && !threeSidesVisible && !transferVisible"
              v-model="item.checked"
              @change="onCheckCard(item, index)"
              style="position: absolute; left: 3%; top: 3%"
            ></el-checkbox>
            <div
              left
              style="
                display: inline-block;
                width: 40%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <div
                style="
                  width: 70%;
                  height: 55%;
                  overflow: hidden;
                  border-radius: 50%;
                "
              >
                <img
                  :src="
                    item.picture
                      ? $window.g.ApiUrl + item.picture
                      : '/static/img/headless.png'
                  "
                  style="width: 105%; height: 105%"
                />
              </div>
            </div>
            <div
              right
              style="
                position: relative;
                display: inline-block;
                width: 60%;
                height: 88px;
                padding: 6% 0px;
                box-sizing: border-box;
                display: flex;
                flex-wrap: wrap;
                align-items: center;
              "
            >
              <div
                style="
                  width: 100%;
                  font-size: 12px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                "
              >
                <span style="color: #d7d7d7">姓名：</span>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.name"
                  placement="top"
                >
                  <span>{{ item.name }}</span>
                </el-tooltip>
              </div>
              <div
                style="
                  width: 100%;
                  font-size: 12px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                "
              >
                <span style="color: #d7d7d7">职务：</span>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.position"
                  placement="top"
                >
                  <span>{{ item.position }}</span>
                </el-tooltip>
              </div>
              <div style="width: 100%; font-size: 12px; white-space: nowrap">
                <span style="color: #d7d7d7">电话：</span>
                <template v-if="item.number">
                  <template
                    v-if="
                      item.otherTel != '' ||
                      item.officeTel != '' ||
                      item.homeTel != '' ||
                      item.otherTel2 != ''
                    "
                  >
                    <el-dropdown
                      style="position: initial !important; font-size: 12px"
                      @command="handleCommand(item)"
                      placement="bottom"
                      trigger="click"
                      @visible-change="changeDropdown"
                    >
                      <span class="el-dropdown-link">
                        <div
                          style="
                            display: inline-block;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            width: initial;
                          "
                        >
                          <el-tooltip
                            class="item"
                            effect="dark"
                            :content="item.number"
                            placement="top"
                          >
                            <span>{{ item.number }}</span>
                          </el-tooltip>
                        </div>
                        <i
                          class="el-icon-arrow-down el-icon--right"
                          style="margin-left: 0px; font-size: 15px"
                        ></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="a" v-if="item.otherTel">
                          <div
                            @mouseover="elDropdownItem(1)"
                            class="dropdownDiv"
                          >
                            <span>手机2: {{ item.otherTel }}</span>
                            <span
                              v-if="showSpanImg == 1"
                              style="
                                display: inline-block;
                                width: 13px;
                                padding-left: 30px;
                              "
                            >
                              <img
                                style="width: 100%; height: 100%"
                                src="/static/img/icon/dailCall.png"
                              />
                            </span>
                          </div>
                        </el-dropdown-item>
                        <el-dropdown-item command="b" v-if="item.officeTel">
                          <div
                            @mouseover="elDropdownItem(2)"
                            class="dropdownDiv"
                          >
                            <span>办公电话: {{ item.officeTel }}</span>
                            <span
                              v-if="showSpanImg == 2"
                              style="
                                display: inline-block;
                                width: 13px;
                                padding-left: 30px;
                              "
                            >
                              <img
                                style="width: 100%; height: 100%"
                                src="/static/img/icon/dailCall.png"
                              />
                            </span>
                          </div>
                        </el-dropdown-item>
                        <el-dropdown-item command="c" v-if="item.homeTel">
                          <div
                            @mouseover="elDropdownItem(3)"
                            class="dropdownDiv"
                          >
                            <span>应急电话: {{ item.homeTel }}</span>
                            <span
                              v-if="showSpanImg == 3"
                              style="
                                display: inline-block;
                                width: 13px;
                                padding-left: 30px;
                              "
                            >
                              <img
                                style="width: 100%; height: 100%"
                                src="/static/img/icon/dailCall.png"
                              />
                            </span>
                          </div>
                        </el-dropdown-item>
                        <el-dropdown-item command="d" v-if="item.otherTel2">
                          <div
                            @mouseover="elDropdownItem(4)"
                            class="dropdownDiv"
                          >
                            <span>其他电话: {{ item.otherTel2 }}</span>
                            <span
                              v-if="showSpanImg == 4"
                              style="
                                display: inline-block;
                                width: 13px;
                                padding-left: 30px;
                              "
                            >
                              <img
                                style="width: 100%; height: 100%"
                                src="/static/img/icon/dailCall.png"
                              />
                            </span>
                          </div>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                  <div
                    v-else
                    style="
                      display: inline-block;
                      overflow: hidden;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      width: initial;
                    "
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="item.number"
                      placement="top"
                    >
                      <span>{{ item.number }}</span>
                    </el-tooltip>
                  </div>
                </template>
              </div>
              <div
                style="
                  position: absolute;
                  bottom: -5%;
                  right: 5%;
                  white-space: nowrap;
                "
              >
                <el-tooltip
                  v-if="manageVisible && !threeSidesVisible && !transferVisible"
                  class="item"
                  effect="dark"
                  content="查看"
                  placement="top"
                >
                  <i
                    class="el-icon-info"
                    @click="watchContactDetails(item)"
                    style="font-size: 16px; color: #9fc8fe; cursor: pointer"
                  ></i>
                </el-tooltip>
                <el-tooltip
                  v-if="
                    !manageVisible && !threeSidesVisible && !transferVisible
                  "
                  class="item"
                  effect="dark"
                  content="编辑"
                  placement="top"
                >
                  <i
                    class="el-icon-edit"
                    @click="
                      ['formData' + tabPosition].rowData = item;
                      window.setTimeout(() => {
                        handleEdit();
                      }, 500);
                    "
                    style="
                      font-size: 16px;
                      margin-left: 2%;
                      color: #9fc8fe;
                      cursor: pointer;
                    "
                  ></i>
                </el-tooltip>
                <el-tooltip
                  v-if="
                    !manageVisible && !threeSidesVisible && !transferVisible
                  "
                  class="item"
                  effect="dark"
                  content="删除"
                  placement="top"
                >
                  <i
                    class="el-icon-delete-solid"
                    @click="
                      ['formData' + tabPosition].rowData = item;
                      window.setTimeout(() => {
                        handleDeleteItem();
                      }, 500);
                    "
                    style="
                      font-size: 16px;
                      margin-left: 2%;
                      color: #9fc8fe;
                      cursor: pointer;
                    "
                  ></i>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  v-if="manageVisible && !threeSidesVisible && !transferVisible"
                  content="拨号"
                  placement="top"
                >
                  <i
                    class="el-icon-phone-outline"
                    @click="talkCall(item)"
                    style="
                      font-size: 16px;
                      margin-left: 2%;
                      color: #9fc8fe;
                      cursor: pointer;
                    "
                  ></i>
                </el-tooltip>
                <!-- <el-tooltip class="item" effect="dark" content="设为常用联系人" placement="top"
                                    v-if="!threeSidesVisible&&!transferVisible">
                            <i
                            class="el-icon-star-on"
                            @click="handSetToCommon(scope.row)"
                            :style="{'font-size': '24px','margin-left': '1vw',cursor: 'pointer',color:scope.row.commonlyUsed==0?'#9FC8FE':'#FBC958'}"
                            ></i>
                        </el-tooltip> -->
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="三方"
                  placement="top"
                  v-if="threeSidesVisible"
                >
                  <i
                    class="el-icon-circle-plus"
                    @click="busClickThree({ row: item })"
                    style="font-size: 16px; color: #9fc8fe; cursor: pointer"
                  ></i>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="转接"
                  placement="top"
                  v-if="transferVisible"
                >
                  <img
                    style="display: inline-block; width: 24px; cursor: pointer"
                    src="/static/img/icon/onDailCall.png"
                    @click="busClickTrans({ row: item })"
                  />
                </el-tooltip>
              </div>
            </div>
          </div>
        </section>
        <section
          v-if="
            $window.g.IsZengChengProject &&
            formData5.isCardMode &&
            formData5.tableData.length == 0
          "
          style="
            width: 100%;
            height: 670px;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          暂无数据
        </section>
        <el-table
          ref="singleTable"
          v-if="!formData5.isCardMode || !$window.g.IsZengChengProject"
          :data="formData5.tableData"
          highlight-current-row
          :header-cell-style="{ background: '#E6E6E6', color: '#606266' }"
          height="670"
          style="width: 100%; height: 670px; overflow: auto"
          @row-dblclick="handleRowDbClick"
          @cell-mouse-enter="showInfo"
          @row-click="handleRowClick"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            v-if="!manageVisible"
          ></el-table-column>
          <!-- <el-table-column type="index" width="50" show-overflow-tooltip  :resizable="false" align="center"></el-table-column> -->
          <el-table-column
            align="center"
            prop="name"
            show-overflow-tooltip
            :resizable="false"
            label="姓名"
          >
            <template slot-scope="scope">
              <span style="color: red" v-if="scope.row.infoMark == 1">*</span>
              <span style="margin-left: 10px">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
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
            <template slot-scope="scope">
              <div v-if="scope.row.number">
                <div
                  v-if="
                    scope.row.otherTel != '' ||
                    scope.row.officeTel != '' ||
                    scope.row.homeTel != '' ||
                    scope.row.otherTel2 != ''
                  "
                >
                  <el-dropdown
                    @command="handleCommand(scope.row)"
                    placement="bottom"
                    trigger="click"
                    @visible-change="changeDropdown"
                  >
                    <span class="el-dropdown-link">
                      {{ scope.row.number }}
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="a" v-if="scope.row.otherTel">
                        <div @mouseover="elDropdownItem(1)" class="dropdownDiv">
                          <span>手机2: {{ scope.row.otherTel }}</span>
                          <span
                            v-if="showSpanImg == 1"
                            style="
                              display: inline-block;
                              width: 13px;
                              padding-left: 30px;
                            "
                          >
                            <img
                              style="width: 100%; height: 100%"
                              src="/static/img/icon/dailCall.png"
                            />
                          </span>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item command="b" v-if="scope.row.officeTel">
                        <div @mouseover="elDropdownItem(2)" class="dropdownDiv">
                          <span>办公电话: {{ scope.row.officeTel }}</span>
                          <span
                            v-if="showSpanImg == 2"
                            style="
                              display: inline-block;
                              width: 13px;
                              padding-left: 30px;
                            "
                          >
                            <img
                              style="width: 100%; height: 100%"
                              src="/static/img/icon/dailCall.png"
                            />
                          </span>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item command="c" v-if="scope.row.homeTel">
                        <div @mouseover="elDropdownItem(3)" class="dropdownDiv">
                          <span>应急电话: {{ scope.row.homeTel }}</span>
                          <span
                            v-if="showSpanImg == 3"
                            style="
                              display: inline-block;
                              width: 13px;
                              padding-left: 30px;
                            "
                          >
                            <img
                              style="width: 100%; height: 100%"
                              src="/static/img/icon/dailCall.png"
                            />
                          </span>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item command="d" v-if="scope.row.otherTel2">
                        <div @mouseover="elDropdownItem(4)" class="dropdownDiv">
                          <span>其他电话: {{ scope.row.otherTel2 }}</span>
                          <span
                            v-if="showSpanImg == 4"
                            style="
                              display: inline-block;
                              width: 13px;
                              padding-left: 30px;
                            "
                          >
                            <img
                              style="width: 100%; height: 100%"
                              src="/static/img/icon/dailCall.png"
                            />
                          </span>
                        </div>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                <span v-else>{{ scope.row.number }}</span>
              </div>
              <span v-else>{{ scope.row.number }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px" align="center">
            <template slot-scope="scope">
              <el-tooltip
                v-if="manageVisible && !threeSidesVisible && !transferVisible"
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
                v-if="!manageVisible && !threeSidesVisible && !transferVisible"
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
                v-if="!manageVisible && !threeSidesVisible && !transferVisible"
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
              <el-tooltip
                class="item"
                effect="dark"
                v-if="manageVisible && !threeSidesVisible && !transferVisible"
                content="拨号"
                placement="top"
              >
                <i
                  class="el-icon-phone-outline"
                  @click="talkCall(scope.row)"
                  style="
                    font-size: 24px;
                    margin-left: 1vw;
                    color: #9fc8fe;
                    cursor: pointer;
                  "
                ></i>
              </el-tooltip>
              <!-- <el-tooltip class="item" effect="dark" content="设为常用联系人" placement="top"
                          v-if="!threeSidesVisible&&!transferVisible">
                <i
                  class="el-icon-star-on"
                  @click="handSetToCommon(scope.row)"
                  :style="{'font-size': '24px','margin-left': '1vw',cursor: 'pointer',color:scope.row.commonlyUsed==0?'#9FC8FE':'#FBC958'}"
                ></i>
              </el-tooltip> -->
              <el-tooltip
                class="item"
                effect="dark"
                content="三方"
                placement="top"
                v-if="threeSidesVisible"
              >
                <i
                  class="el-icon-circle-plus"
                  @click="busClickThree(scope)"
                  style="font-size: 24px; color: #9fc8fe; cursor: pointer"
                ></i>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="转接"
                placement="top"
                v-if="transferVisible"
              >
                <img
                  style="display: inline-block; width: 24px; cursor: pointer"
                  src="/static/img/icon/onDailCall.png"
                  @click="busClickTrans(scope)"
                />
              </el-tooltip>
              <!-- <el-button type="primary" size="mini" @click="addPhoneCall(scope.row)">添加</el-button>
              <el-button type="primary" size="mini" @click="talkCall(scope.row)">拨号</el-button>
              <el-button type="primary" size="mini" @click="handSetToCommon(scope.row)">设为常用</el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-pagination
            class="pagination"
            background
            :page-size="formData5.pageSize"
            :page-sizes="[10, 20, 30, 40]"
            :total="formData5.total"
            :current-page="formData5.currentPage"
            @current-change="handCurrentChange"
            @size-change="handSizeChange"
            layout="total, prev, pager, next, sizes, jumper"
          ></el-pagination>
        </el-row>
      </div>
    </div>
    <div class="my-phone-main" v-if="tabPosition == 6">
      <div class="my-tree-box" style="box-sizing: border-box; overflow: auto">
        <el-scrollbar class="my-tree-scroll">
          <el-input
            placeholder="输入关键字进行搜索"
            v-model="formData6.filterTree"
            class="treeSearch"
            style="padding: 10px; box-sizing: border-box"
          >
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              @click="$refs.tree6.filter(formData6.filterTree)"
            ></i>
          </el-input>
          <el-tree
            :data="formData6.treeData"
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
            node-key="id"
            ref="tree6"
            highlight-current
            :props="defaultProps"
            draggable
            @node-drop="handleDrop"
            :allow-drop="allowDrop"
            :allow-drag="allowDrag"
            :show-checkbox="!manageVisible ? true : false"
            @check-change="handleCheckChange"
            @check="handleCheck"
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
                  right: 4%;
                  transform: translateY(-50%);
                "
                v-show="treeBtnHoverIndex == data.id && data.id != -1"
              >
                <div
                  style="display: flex; align-items: center; cursor: pointer"
                  v-show="!manageVisible"
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
                      @click="editGroupDetails(node, data)"
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
                  v-show="!manageVisible"
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
                <div
                  style="
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    margin-left: 5px;
                  "
                >
                  <watch-group-details
                    :node="node"
                    :data="data"
                    :top-position="tabPosition"
                  ></watch-group-details>
                </div>
              </span>
            </span>
          </el-tree>
        </el-scrollbar>
        <treeBtn
          v-if="!manageVisible"
          @changeDialog="closeDialog"
          @refreshData="refreshData"
          :treeDataItem="formData6.treeDataItem"
          :treeData="formData6.treeData"
          :formData="treeBtnConfig1"
          ref="treeBtn6"
          :treeDataItems="formData6.treeMultipleSelection"
          tabPosition="beiqinlianluowang"
        ></treeBtn>
        <!-- <el-alert title="温馨提示" type="info" description="可拖动修改同级分组排序" show-icon>
        </el-alert>-->
      </div>
      <div class="my-table-box" style="box-sizing: border-box; overflow: auto">
        <btn-box
          v-if="!manageVisible"
          :btnArry="btnArry"
          v-bind="{
            add: { callback: addList },
            edit: { callback: handleEdit },
            del: { callback: handleDelete },
            sort: { callback: handleSort },
            download: { callback: handleExportContactor },
            document: { callback: handleExportm },
          }"
          :batchJoinIsShow="true"
          @handleBatchJoin="handleBatchJoin"
          @success="batchJoinSuccess"
        ></btn-box>
        <el-row
          class="my-table-box-search"
          style="margin: 10px; display: flex; align-items: center"
        >
          <el-col :span="11">
            <el-input
              placeholder="请输入姓名/单位/职位/号码"
              class="searchInput"
              v-model="formData6.searchText"
              @input="handleSearch"
            ></el-input>
          </el-col>
          <el-col :span="11">
            <el-button
              type="primary"
              @click="handleSearch"
              style="margin-left: 10px"
              >搜索</el-button
            >
          </el-col>
          <el-col :span="1" v-if="$window.g.IsZengChengProject">
            <i
              class="el-icon-s-order"
              :style="{
                color: formData6.isCardMode ? '#d7d7d7' : '#409EFF',
                'font-size': '30px',
                cursor: 'pointer',
              }"
              @click="formData6.isCardMode = false"
            ></i>
          </el-col>
          <el-col :span="1" v-if="$window.g.IsZengChengProject">
            <i
              class="el-icon-menu"
              :style="{
                color: formData6.isCardMode ? '#409EFF' : '#d7d7d7',
                'font-size': '30px',
                cursor: 'pointer',
              }"
              @click="formData6.isCardMode = true"
            ></i>
          </el-col>
        </el-row>
        <section
          v-if="
            $window.g.IsZengChengProject &&
            formData6.isCardMode &&
            formData6.tableData.length != 0
          "
          style="
            width: 100%;
            height: 670px;
            padding-left: 1.5%;
            overflow-y: scroll;
            display: flex;
            flex-wrap: wrap;
            align-content: flex-start;
          "
        >
          <div
            v-for="(item, index) in formData6.tableData"
            :key="index"
            @click="handleRowClick(item)"
            style="
              position: relative;
              display: inline-block;
              width: 12.4vw;
              min-width: 235px;
              height: 95px;
              border: 1px solid #d7d7d7;
              border-radius: 10px;
              margin: 1% 0px 0px 1%;
              display: flex;
            "
          >
            <el-checkbox
              v-if="!manageVisible && !threeSidesVisible && !transferVisible"
              v-model="item.checked"
              @change="onCheckCard(item, index)"
              style="position: absolute; left: 3%; top: 3%"
            ></el-checkbox>
            <div
              left
              style="
                display: inline-block;
                width: 40%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <div
                style="
                  width: 70%;
                  height: 55%;
                  overflow: hidden;
                  border-radius: 50%;
                "
              >
                <img
                  :src="
                    item.picture
                      ? $window.g.ApiUrl + item.picture
                      : '/static/img/headless.png'
                  "
                  style="width: 105%; height: 105%"
                />
              </div>
            </div>
            <div
              right
              style="
                position: relative;
                display: inline-block;
                width: 60%;
                height: 88px;
                padding: 6% 0px;
                box-sizing: border-box;
                display: flex;
                flex-wrap: wrap;
                align-items: center;
              "
            >
              <div
                style="
                  width: 100%;
                  font-size: 12px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                "
              >
                <span style="color: #d7d7d7">姓名：</span>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.name"
                  placement="top"
                >
                  <span>{{ item.name }}</span>
                </el-tooltip>
              </div>
              <div
                style="
                  width: 100%;
                  font-size: 12px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                "
              >
                <span style="color: #d7d7d7">职务：</span>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.position"
                  placement="top"
                >
                  <span>{{ item.position }}</span>
                </el-tooltip>
              </div>
              <div style="width: 100%; font-size: 12px; white-space: nowrap">
                <span style="color: #d7d7d7">电话：</span>
                <template v-if="item.number">
                  <template
                    v-if="
                      item.otherTel != '' ||
                      item.officeTel != '' ||
                      item.homeTel != '' ||
                      item.otherTel2 != ''
                    "
                  >
                    <el-dropdown
                      style="position: initial !important; font-size: 12px"
                      @command="handleCommand(item)"
                      placement="bottom"
                      trigger="click"
                      @visible-change="changeDropdown"
                    >
                      <span class="el-dropdown-link">
                        <div
                          style="
                            display: inline-block;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            width: initial;
                          "
                        >
                          <el-tooltip
                            class="item"
                            effect="dark"
                            :content="item.number"
                            placement="top"
                          >
                            <span>{{ item.number }}</span>
                          </el-tooltip>
                        </div>
                        <i
                          class="el-icon-arrow-down el-icon--right"
                          style="margin-left: 0px; font-size: 15px"
                        ></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="a" v-if="item.otherTel">
                          <div
                            @mouseover="elDropdownItem(1)"
                            class="dropdownDiv"
                          >
                            <span>手机2: {{ item.otherTel }}</span>
                            <span
                              v-if="showSpanImg == 1"
                              style="
                                display: inline-block;
                                width: 13px;
                                padding-left: 30px;
                              "
                            >
                              <img
                                style="width: 100%; height: 100%"
                                src="/static/img/icon/dailCall.png"
                              />
                            </span>
                          </div>
                        </el-dropdown-item>
                        <el-dropdown-item command="b" v-if="item.officeTel">
                          <div
                            @mouseover="elDropdownItem(2)"
                            class="dropdownDiv"
                          >
                            <span>办公电话: {{ item.officeTel }}</span>
                            <span
                              v-if="showSpanImg == 2"
                              style="
                                display: inline-block;
                                width: 13px;
                                padding-left: 30px;
                              "
                            >
                              <img
                                style="width: 100%; height: 100%"
                                src="/static/img/icon/dailCall.png"
                              />
                            </span>
                          </div>
                        </el-dropdown-item>
                        <el-dropdown-item command="c" v-if="item.homeTel">
                          <div
                            @mouseover="elDropdownItem(3)"
                            class="dropdownDiv"
                          >
                            <span>应急电话: {{ item.homeTel }}</span>
                            <span
                              v-if="showSpanImg == 3"
                              style="
                                display: inline-block;
                                width: 13px;
                                padding-left: 30px;
                              "
                            >
                              <img
                                style="width: 100%; height: 100%"
                                src="/static/img/icon/dailCall.png"
                              />
                            </span>
                          </div>
                        </el-dropdown-item>
                        <el-dropdown-item command="d" v-if="item.otherTel2">
                          <div
                            @mouseover="elDropdownItem(4)"
                            class="dropdownDiv"
                          >
                            <span>其他电话: {{ item.otherTel2 }}</span>
                            <span
                              v-if="showSpanImg == 4"
                              style="
                                display: inline-block;
                                width: 13px;
                                padding-left: 30px;
                              "
                            >
                              <img
                                style="width: 100%; height: 100%"
                                src="/static/img/icon/dailCall.png"
                              />
                            </span>
                          </div>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                  <div
                    v-else
                    style="
                      display: inline-block;
                      overflow: hidden;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      width: initial;
                    "
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="item.number"
                      placement="top"
                    >
                      <span>{{ item.number }}</span>
                    </el-tooltip>
                  </div>
                </template>
              </div>
              <div
                style="
                  position: absolute;
                  bottom: -5%;
                  right: 5%;
                  white-space: nowrap;
                "
              >
                <el-tooltip
                  v-if="manageVisible && !threeSidesVisible && !transferVisible"
                  class="item"
                  effect="dark"
                  content="查看"
                  placement="top"
                >
                  <i
                    class="el-icon-info"
                    @click="watchContactDetails(item)"
                    style="font-size: 16px; color: #9fc8fe; cursor: pointer"
                  ></i>
                </el-tooltip>
                <el-tooltip
                  v-if="
                    !manageVisible && !threeSidesVisible && !transferVisible
                  "
                  class="item"
                  effect="dark"
                  content="编辑"
                  placement="top"
                >
                  <i
                    class="el-icon-edit"
                    @click="
                      ['formData' + tabPosition].rowData = item;
                      window.setTimeout(() => {
                        handleEdit();
                      }, 500);
                    "
                    style="
                      font-size: 16px;
                      margin-left: 2%;
                      color: #9fc8fe;
                      cursor: pointer;
                    "
                  ></i>
                </el-tooltip>
                <el-tooltip
                  v-if="
                    !manageVisible && !threeSidesVisible && !transferVisible
                  "
                  class="item"
                  effect="dark"
                  content="删除"
                  placement="top"
                >
                  <i
                    class="el-icon-delete-solid"
                    @click="
                      ['formData' + tabPosition].rowData = item;
                      window.setTimeout(() => {
                        handleDeleteItem();
                      }, 500);
                    "
                    style="
                      font-size: 16px;
                      margin-left: 2%;
                      color: #9fc8fe;
                      cursor: pointer;
                    "
                  ></i>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  v-if="manageVisible && !threeSidesVisible && !transferVisible"
                  content="拨号"
                  placement="top"
                >
                  <i
                    class="el-icon-phone-outline"
                    @click="talkCall(item)"
                    style="
                      font-size: 16px;
                      margin-left: 2%;
                      color: #9fc8fe;
                      cursor: pointer;
                    "
                  ></i>
                </el-tooltip>

                <el-tooltip
                  class="item"
                  effect="dark"
                  content="三方"
                  placement="top"
                  v-if="threeSidesVisible"
                >
                  <i
                    class="el-icon-circle-plus"
                    @click="busClickThree({ row: item })"
                    style="font-size: 16px; color: #9fc8fe; cursor: pointer"
                  ></i>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="转接"
                  placement="top"
                  v-if="transferVisible"
                >
                  <img
                    style="display: inline-block; width: 24px; cursor: pointer"
                    src="/static/img/icon/onDailCall.png"
                    @click="busClickTrans({ row: item })"
                  />
                </el-tooltip>
              </div>
            </div>
          </div>
        </section>
        <section
          v-if="
            $window.g.IsZengChengProject &&
            formData6.isCardMode &&
            formData6.tableData.length == 0
          "
          style="
            width: 100%;
            height: 670px;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          暂无数据
        </section>
        <el-table
          ref="singleTable"
          v-if="!formData6.isCardMode || !$window.g.IsZengChengProject"
          :data="formData6.tableData"
          highlight-current-row
          :header-cell-style="{ background: '#E6E6E6', color: '#606266' }"
          height="670"
          style="width: 100%; height: 670px; overflow: auto"
          @row-dblclick="handleRowDbClick"
          @cell-mouse-enter="showInfo"
          @row-click="handleRowClick"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            v-if="!manageVisible"
          ></el-table-column>
          <!-- <el-table-column type="index" width="50" show-overflow-tooltip  :resizable="false" align="center"></el-table-column> -->
          <el-table-column
            align="center"
            prop="name"
            show-overflow-tooltip
            :resizable="false"
            label="姓名"
          >
            <template slot-scope="scope">
              <span style="color: red" v-if="scope.row.infoMark == 1">*</span>
              <span style="margin-left: 10px">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
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
            <template slot-scope="scope">
              <div v-if="scope.row.number">
                <div
                  v-if="
                    scope.row.otherTel != '' ||
                    scope.row.officeTel != '' ||
                    scope.row.homeTel != '' ||
                    scope.row.otherTel2 != ''
                  "
                >
                  <el-dropdown
                    @command="handleCommand(scope.row)"
                    placement="bottom"
                    trigger="click"
                    @visible-change="changeDropdown"
                  >
                    <span class="el-dropdown-link">
                      {{ scope.row.number }}
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="a" v-if="scope.row.otherTel">
                        <div @mouseover="elDropdownItem(1)" class="dropdownDiv">
                          <span>手机2: {{ scope.row.otherTel }}</span>
                          <span
                            v-if="showSpanImg == 1"
                            style="
                              display: inline-block;
                              width: 13px;
                              padding-left: 30px;
                            "
                          >
                            <img
                              style="width: 100%; height: 100%"
                              src="/static/img/icon/dailCall.png"
                            />
                          </span>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item command="b" v-if="scope.row.officeTel">
                        <div @mouseover="elDropdownItem(2)" class="dropdownDiv">
                          <span>办公电话: {{ scope.row.officeTel }}</span>
                          <span
                            v-if="showSpanImg == 2"
                            style="
                              display: inline-block;
                              width: 13px;
                              padding-left: 30px;
                            "
                          >
                            <img
                              style="width: 100%; height: 100%"
                              src="/static/img/icon/dailCall.png"
                            />
                          </span>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item command="c" v-if="scope.row.homeTel">
                        <div @mouseover="elDropdownItem(3)" class="dropdownDiv">
                          <span>应急电话: {{ scope.row.homeTel }}</span>
                          <span
                            v-if="showSpanImg == 3"
                            style="
                              display: inline-block;
                              width: 13px;
                              padding-left: 30px;
                            "
                          >
                            <img
                              style="width: 100%; height: 100%"
                              src="/static/img/icon/dailCall.png"
                            />
                          </span>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item command="d" v-if="scope.row.otherTel2">
                        <div @mouseover="elDropdownItem(4)" class="dropdownDiv">
                          <span>其他电话: {{ scope.row.otherTel2 }}</span>
                          <span
                            v-if="showSpanImg == 4"
                            style="
                              display: inline-block;
                              width: 13px;
                              padding-left: 30px;
                            "
                          >
                            <img
                              style="width: 100%; height: 100%"
                              src="/static/img/icon/dailCall.png"
                            />
                          </span>
                        </div>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                <span v-else>{{ scope.row.number }}</span>
              </div>
              <span v-else>{{ scope.row.number }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px" align="center">
            <template slot-scope="scope">
              <el-tooltip
                v-if="manageVisible && !threeSidesVisible && !transferVisible"
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
                v-if="!manageVisible && !threeSidesVisible && !transferVisible"
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
                v-if="!manageVisible && !threeSidesVisible && !transferVisible"
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
              <el-tooltip
                class="item"
                effect="dark"
                v-if="manageVisible && !threeSidesVisible && !transferVisible"
                content="拨号"
                placement="top"
              >
                <i
                  class="el-icon-phone-outline"
                  @click="talkCall(scope.row)"
                  style="
                    font-size: 24px;
                    margin-left: 1vw;
                    color: #9fc8fe;
                    cursor: pointer;
                  "
                ></i>
              </el-tooltip>
              <!-- <el-tooltip class="item" effect="dark" content="设为常用联系人" placement="top"
                          v-if="!threeSidesVisible&&!transferVisible">
                <i
                  class="el-icon-star-on"
                  @click="handSetToCommon(scope.row)"
                  :style="{'font-size': '24px','margin-left': '1vw',cursor: 'pointer',color:scope.row.commonlyUsed==0?'#9FC8FE':'#FBC958'}"
                ></i>
              </el-tooltip> -->
              <el-tooltip
                class="item"
                effect="dark"
                content="三方"
                placement="top"
                v-if="threeSidesVisible"
              >
                <i
                  class="el-icon-circle-plus"
                  @click="busClickThree(scope)"
                  style="font-size: 24px; color: #9fc8fe; cursor: pointer"
                ></i>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="转接"
                placement="top"
                v-if="transferVisible"
              >
                <img
                  style="display: inline-block; width: 24px; cursor: pointer"
                  src="/static/img/icon/onDailCall.png"
                  @click="busClickTrans(scope)"
                />
              </el-tooltip>
              <!-- <el-button type="primary" size="mini" @click="addPhoneCall(scope.row)">添加</el-button>
              <el-button type="primary" size="mini" @click="talkCall(scope.row)">拨号</el-button>
              <el-button type="primary" size="mini" @click="handSetToCommon(scope.row)">设为常用</el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-pagination
            class="pagination"
            background
            :page-size="formData6.pageSize"
            :page-sizes="[10, 20, 30, 40]"
            :total="formData6.total"
            :current-page="formData6.currentPage"
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
            v-model="formData7.filterTree"
            class="treeSearch"
            style="padding: 10px; box-sizing: border-box"
          >
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              @click="$refs.tree7.filter(formData7.filterTree)"
            ></i>
          </el-input>
          <el-tree
            :data="formData7.treeData"
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
            node-key="id"
            ref="tree7"
            highlight-current
            :props="defaultProps"
            :show-checkbox="!manageVisible ? true : false"
            @check-change="handleCheckChange"
            @check="handleCheck"
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
                  right: 4%;
                  transform: translateY(-50%);
                "
                v-show="treeBtnHoverIndex == data.id && data.id != -1"
              >
                <div
                  style="display: flex; align-items: center; cursor: pointer"
                  v-show="!manageVisible"
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
                      @click="editGroupDetails(node, data)"
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
                  v-show="!manageVisible"
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
                <div
                  style="
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    margin-left: 5px;
                  "
                >
                  <watch-group-details
                    :node="node"
                    :data="data"
                    :top-position="tabPosition"
                  ></watch-group-details>
                </div>
              </span>
            </span>
          </el-tree>
        </el-scrollbar>
        <treeBtn
          v-if="!manageVisible"
          @changeDialog="closeDialog"
          @refreshData="refreshData"
          :treeDataItem="formData7.treeDataItem"
          :treeData="formData7.treeData"
          :formData="treeBtnConfig2"
          ref="treeBtn7"
          :treeDataItems="formData7.treeMultipleSelection"
          tabPosition="ziyuanlianluowang"
        ></treeBtn>
      </div>
      <div class="my-table-box" style="box-sizing: border-box; overflow: auto">
        <btn-box
          v-if="!manageVisible"
          :btnArry="btnArry"
          v-bind="{
            add: { callback: addList },
            edit: { callback: handleEdit },
            del: { callback: handleDelete },
            sort: { callback: handleSort },
            download: { callback: handleExportContactor },
            document: { callback: handleExportm },
          }"
          :batchJoinIsShow="true"
          @handleBatchJoin="handleBatchJoin"
          @success="batchJoinSuccess"
        ></btn-box>
        <el-row
          class="my-table-box-search"
          style="margin: 10px; display: flex; align-items: center"
        >
          <el-col :span="11">
            <el-input
              placeholder="请输入姓名/单位/职位/号码"
              class="searchInput"
              v-model="formData7.searchText"
              @input="handleSearch"
            ></el-input>
          </el-col>
          <el-col :span="11">
            <el-button
              type="primary"
              @click="handleSearch"
              style="margin-left: 10px"
              >搜索</el-button
            >
          </el-col>
          <el-col :span="1" v-if="$window.g.IsZengChengProject">
            <i
              class="el-icon-s-order"
              :style="{
                color: formData7.isCardMode ? '#d7d7d7' : '#409EFF',
                'font-size': '30px',
                cursor: 'pointer',
              }"
              @click="formData7.isCardMode = false"
            ></i>
          </el-col>
          <el-col :span="1" v-if="$window.g.IsZengChengProject">
            <i
              class="el-icon-menu"
              :style="{
                color: formData7.isCardMode ? '#409EFF' : '#d7d7d7',
                'font-size': '30px',
                cursor: 'pointer',
              }"
              @click="formData7.isCardMode = true"
            ></i>
          </el-col>
        </el-row>
        <section
          v-if="
            $window.g.IsZengChengProject &&
            formData7.isCardMode &&
            formData7.tableData.length != 0
          "
          style="
            width: 100%;
            height: 670px;
            padding-left: 1.5%;
            overflow-y: scroll;
            display: flex;
            flex-wrap: wrap;
            align-content: flex-start;
          "
        >
          <div
            v-for="(item, index) in formData7.tableData"
            :key="index"
            @click="handleRowClick(item)"
            style="
              position: relative;
              display: inline-block;
              width: 12.4vw;
              min-width: 235px;
              height: 95px;
              border: 1px solid #d7d7d7;
              border-radius: 10px;
              margin: 1% 0px 0px 1%;
              display: flex;
            "
          >
            <el-checkbox
              v-if="!manageVisible && !threeSidesVisible && !transferVisible"
              v-model="item.checked"
              @change="onCheckCard(item, index)"
              style="position: absolute; left: 3%; top: 3%"
            ></el-checkbox>
            <div
              left
              style="
                display: inline-block;
                width: 40%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <div
                style="
                  width: 70%;
                  height: 55%;
                  overflow: hidden;
                  border-radius: 50%;
                "
              >
                <img
                  :src="
                    item.picture
                      ? $window.g.ApiUrl + item.picture
                      : '/static/img/headless.png'
                  "
                  style="width: 105%; height: 105%"
                />
              </div>
            </div>
            <div
              right
              style="
                position: relative;
                display: inline-block;
                width: 60%;
                height: 88px;
                box-sizing: border-box;
                padding: 6% 0px;
                display: flex;
                flex-wrap: wrap;
                align-items: center;
              "
            >
              <div
                style="
                  width: 100%;
                  font-size: 12px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                "
              >
                <span style="color: #d7d7d7">姓名：</span>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.name"
                  placement="top"
                >
                  <span>{{ item.name }}</span>
                </el-tooltip>
              </div>
              <div
                style="
                  width: 100%;
                  font-size: 12px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                "
              >
                <span style="color: #d7d7d7">职务：</span>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.position"
                  placement="top"
                >
                  <span>{{ item.position }}</span>
                </el-tooltip>
              </div>
              <div style="width: 100%; font-size: 12px; white-space: nowrap">
                <span style="color: #d7d7d7">电话：</span>
                <template v-if="item.number">
                  <template
                    v-if="
                      item.otherTel != '' ||
                      item.officeTel != '' ||
                      item.homeTel != '' ||
                      item.otherTel2 != ''
                    "
                  >
                    <el-dropdown
                      style="position: initial !important; font-size: 12px"
                      @command="handleCommand(item)"
                      placement="bottom"
                      trigger="click"
                      @visible-change="changeDropdown"
                    >
                      <span class="el-dropdown-link">
                        <div
                          style="
                            display: inline-block;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            width: initial;
                          "
                        >
                          <el-tooltip
                            class="item"
                            effect="dark"
                            :content="item.number"
                            placement="top"
                          >
                            <span>{{ item.number }}</span>
                          </el-tooltip>
                        </div>
                        <i
                          class="el-icon-arrow-down el-icon--right"
                          style="margin-left: 0px; font-size: 15px"
                        ></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="a" v-if="item.otherTel">
                          <div
                            @mouseover="elDropdownItem(1)"
                            class="dropdownDiv"
                          >
                            <span>手机2: {{ item.otherTel }}</span>
                            <span
                              v-if="showSpanImg == 1"
                              style="
                                display: inline-block;
                                width: 13px;
                                padding-left: 30px;
                              "
                            >
                              <img
                                style="width: 100%; height: 100%"
                                src="/static/img/icon/dailCall.png"
                              />
                            </span>
                          </div>
                        </el-dropdown-item>
                        <el-dropdown-item command="b" v-if="item.officeTel">
                          <div
                            @mouseover="elDropdownItem(2)"
                            class="dropdownDiv"
                          >
                            <span>办公电话: {{ item.officeTel }}</span>
                            <span
                              v-if="showSpanImg == 2"
                              style="
                                display: inline-block;
                                width: 13px;
                                padding-left: 30px;
                              "
                            >
                              <img
                                style="width: 100%; height: 100%"
                                src="/static/img/icon/dailCall.png"
                              />
                            </span>
                          </div>
                        </el-dropdown-item>
                        <el-dropdown-item command="c" v-if="item.homeTel">
                          <div
                            @mouseover="elDropdownItem(3)"
                            class="dropdownDiv"
                          >
                            <span>应急电话: {{ item.homeTel }}</span>
                            <span
                              v-if="showSpanImg == 3"
                              style="
                                display: inline-block;
                                width: 13px;
                                padding-left: 30px;
                              "
                            >
                              <img
                                style="width: 100%; height: 100%"
                                src="/static/img/icon/dailCall.png"
                              />
                            </span>
                          </div>
                        </el-dropdown-item>
                        <el-dropdown-item command="d" v-if="item.otherTel2">
                          <div
                            @mouseover="elDropdownItem(4)"
                            class="dropdownDiv"
                          >
                            <span>其他电话: {{ item.otherTel2 }}</span>
                            <span
                              v-if="showSpanImg == 4"
                              style="
                                display: inline-block;
                                width: 13px;
                                padding-left: 30px;
                              "
                            >
                              <img
                                style="width: 100%; height: 100%"
                                src="/static/img/icon/dailCall.png"
                              />
                            </span>
                          </div>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                  <div
                    v-else
                    style="
                      display: inline-block;
                      overflow: hidden;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      width: initial;
                    "
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="item.number"
                      placement="top"
                    >
                      <span>{{ item.number }}</span>
                    </el-tooltip>
                  </div>
                </template>
              </div>
              <div
                style="
                  position: absolute;
                  bottom: -5%;
                  right: 5%;
                  white-space: nowrap;
                "
              >
                <el-tooltip
                  v-if="manageVisible && !threeSidesVisible && !transferVisible"
                  class="item"
                  effect="dark"
                  content="查看"
                  placement="top"
                >
                  <i
                    class="el-icon-info"
                    @click="watchContactDetails(item)"
                    style="font-size: 16px; color: #9fc8fe; cursor: pointer"
                  ></i>
                </el-tooltip>
                <el-tooltip
                  v-if="
                    !manageVisible && !threeSidesVisible && !transferVisible
                  "
                  class="item"
                  effect="dark"
                  content="编辑"
                  placement="top"
                >
                  <i
                    class="el-icon-edit"
                    @click="
                      ['formData' + tabPosition].rowData = item;
                      window.setTimeout(() => {
                        handleEdit();
                      }, 500);
                    "
                    style="
                      font-size: 16px;
                      margin-left: 2%;
                      color: #9fc8fe;
                      cursor: pointer;
                    "
                  ></i>
                </el-tooltip>
                <el-tooltip
                  v-if="
                    !manageVisible && !threeSidesVisible && !transferVisible
                  "
                  class="item"
                  effect="dark"
                  content="删除"
                  placement="top"
                >
                  <i
                    class="el-icon-delete-solid"
                    @click="
                      ['formData' + tabPosition].rowData = item;
                      window.setTimeout(() => {
                        handleDeleteItem();
                      }, 500);
                    "
                    style="
                      font-size: 16px;
                      margin-left: 2%;
                      color: #9fc8fe;
                      cursor: pointer;
                    "
                  ></i>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="拨号"
                  placement="top"
                  v-if="manageVisible && !threeSidesVisible && !transferVisible"
                >
                  <i
                    class="el-icon-phone-outline"
                    @click="talkCall({ row: item })"
                    style="
                      font-size: 16px;
                      margin-left: 2%;
                      color: #9fc8fe;
                      cursor: pointer;
                    "
                  ></i>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="三方"
                  placement="top"
                  v-if="threeSidesVisible"
                >
                  <i
                    class="el-icon-circle-plus"
                    @click="busClickThree({ row: item })"
                    style="font-size: 16px; color: #9fc8fe; cursor: pointer"
                  ></i>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="转接"
                  placement="top"
                  v-if="transferVisible"
                >
                  <img
                    style="display: inline-block; width: 24px; cursor: pointer"
                    src="/static/img/icon/onDailCall.png"
                    @click="busClickTrans({ row: item })"
                  />
                </el-tooltip>
              </div>
            </div>
          </div>
        </section>
        <section
          v-if="
            $window.g.IsZengChengProject &&
            formData7.isCardMode &&
            formData7.tableData.length == 0
          "
          style="
            width: 100%;
            height: 670px;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          暂无数据
        </section>
        <el-table
          ref="singleTable"
          v-if="!formData7.isCardMode || !$window.g.IsZengChengProject"
          :data="formData7.tableData"
          highlight-current-row
          :header-cell-style="{ background: '#E6E6E6', color: '#606266' }"
          height="670"
          style="width: 100%; height: 670px; overflow: auto"
          @row-dblclick="handleRowDbClick"
          @cell-mouse-enter="showInfo"
          @row-click="handleRowClick"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            v-if="!manageVisible"
          ></el-table-column>
          <!-- <el-table-column type="index" width="50" show-overflow-tooltip  :resizable="false" align="center"></el-table-column> -->
          <el-table-column
            align="center"
            prop="name"
            show-overflow-tooltip
            :resizable="false"
            label="姓名"
          >
            <template slot-scope="scope">
              <span style="color: red" v-if="scope.row.infoMark == 1">*</span>
              <span style="margin-left: 10px">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
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
            <template slot-scope="scope">
              <div v-if="scope.row.number">
                <div
                  v-if="
                    scope.row.otherTel != '' ||
                    scope.row.officeTel != '' ||
                    scope.row.homeTel != '' ||
                    scope.row.otherTel2 != ''
                  "
                >
                  <el-dropdown
                    @command="handleCommand(scope.row)"
                    placement="bottom"
                    trigger="click"
                    @visible-change="changeDropdown"
                  >
                    <span class="el-dropdown-link">
                      {{ scope.row.number }}
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="a" v-if="scope.row.otherTel">
                        <div @mouseover="elDropdownItem(1)" class="dropdownDiv">
                          <span>手机2: {{ scope.row.otherTel }}</span>
                          <span
                            v-if="showSpanImg == 1"
                            style="
                              display: inline-block;
                              width: 13px;
                              padding-left: 30px;
                            "
                          >
                            <img
                              style="width: 100%; height: 100%"
                              src="/static/img/icon/dailCall.png"
                            />
                          </span>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item command="b" v-if="scope.row.officeTel">
                        <div @mouseover="elDropdownItem(2)" class="dropdownDiv">
                          <span>办公电话: {{ scope.row.officeTel }}</span>
                          <span
                            v-if="showSpanImg == 2"
                            style="
                              display: inline-block;
                              width: 13px;
                              padding-left: 30px;
                            "
                          >
                            <img
                              style="width: 100%; height: 100%"
                              src="/static/img/icon/dailCall.png"
                            />
                          </span>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item command="c" v-if="scope.row.homeTel">
                        <div @mouseover="elDropdownItem(3)" class="dropdownDiv">
                          <span>应急电话: {{ scope.row.homeTel }}</span>
                          <span
                            v-if="showSpanImg == 3"
                            style="
                              display: inline-block;
                              width: 13px;
                              padding-left: 30px;
                            "
                          >
                            <img
                              style="width: 100%; height: 100%"
                              src="/static/img/icon/dailCall.png"
                            />
                          </span>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item command="d" v-if="scope.row.otherTel2">
                        <div @mouseover="elDropdownItem(4)" class="dropdownDiv">
                          <span>其他电话: {{ scope.row.otherTel2 }}</span>
                          <span
                            v-if="showSpanImg == 4"
                            style="
                              display: inline-block;
                              width: 13px;
                              padding-left: 30px;
                            "
                          >
                            <img
                              style="width: 100%; height: 100%"
                              src="/static/img/icon/dailCall.png"
                            />
                          </span>
                        </div>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                <span v-else>{{ scope.row.number }}</span>
              </div>
              <span v-else>{{ scope.row.number }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px" align="center">
            <template slot-scope="scope">
              <el-tooltip
                v-if="manageVisible && !threeSidesVisible && !transferVisible"
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
                v-if="!manageVisible && !threeSidesVisible && !transferVisible"
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
                v-if="!manageVisible && !threeSidesVisible && !transferVisible"
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
              <el-tooltip
                class="item"
                effect="dark"
                content="拨号"
                placement="top"
                v-if="manageVisible && !threeSidesVisible && !transferVisible"
              >
                <i
                  class="el-icon-phone-outline"
                  @click="talkCall(scope.row)"
                  style="
                    font-size: 24px;
                    margin-left: 1vw;
                    color: #9fc8fe;
                    cursor: pointer;
                  "
                ></i>
              </el-tooltip>
              <!-- <el-tooltip class="item" effect="dark" content="设为常用联系人" placement="top"
                          v-if="!threeSidesVisible&&!transferVisible">
                <i
                  class="el-icon-star-on"
                  @click="handSetToCommon(scope.row)"
                  :style="{'font-size': '24px','margin-left': '1vw',cursor: 'pointer',color:scope.row.commonlyUsed==0?'#9FC8FE':'#FBC958'}"
                ></i>
              </el-tooltip> -->
              <el-tooltip
                class="item"
                effect="dark"
                content="三方"
                placement="top"
                v-if="threeSidesVisible"
              >
                <i
                  class="el-icon-circle-plus"
                  @click="busClickThree(scope)"
                  style="font-size: 24px; color: #9fc8fe; cursor: pointer"
                ></i>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="转接"
                placement="top"
                v-if="transferVisible"
              >
                <img
                  style="display: inline-block; width: 24px; cursor: pointer"
                  src="/static/img/icon/onDailCall.png"
                  @click="busClickTrans(scope)"
                />
              </el-tooltip>
              <!-- <el-button type="primary" size="mini" @click="addPhoneCall(scope.row)">添加</el-button>
              <el-button type="primary" size="mini" @click="talkCall(scope.row)">拨号</el-button>
              <el-button type="primary" size="mini" @click="handSetToCommon(scope.row)">设为常用</el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-pagination
            class="pagination"
            background
            :page-size="formData7.pageSize"
            :page-sizes="[10, 20, 30, 40]"
            :total="formData7.total"
            :current-page="formData7.currentPage"
            @current-change="handCurrentChange"
            @size-change="handSizeChange"
            layout="total, prev, pager, next, sizes, jumper"
          ></el-pagination>
        </el-row>
      </div>
    </div>
    <div class="my-phone-main" v-if="tabPosition == 8">
      <div class="my-tree-box" style="box-sizing: border-box; overflow: auto">
        <el-input
          placeholder="输入关键字进行搜索"
          v-model="formData8.filterTree"
          class="treeSearch"
          style="padding: 10px; box-sizing: border-box"
        >
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="$refs.tree8.filter(formData8.filterTree)"
          ></i>
        </el-input>

        <div style="max-height: 711px; min-height: 711px; overflow: auto">
          <el-tree
            :accordion="true"
            :filter-node-method="filterNode"
            :default-expand-all="isExpand"
            :data="formData8.treeData"
            v-loading="formData8.myLoading"
            @node-click="handleNodeClick"
            node-key="id"
            ref="tree8"
            highlight-current
            :props="defaultProps"
          ></el-tree>
        </div>
      </div>
      <div class="my-table-box" style="box-sizing: border-box; overflow: auto">
        <el-row
          class="my-table-box-search"
          style="margin: 10px; display: flex; align-items: center"
        >
          <el-col :span="11">
            <el-input
              placeholder="请输入姓名/单位/职位/号码"
              class="searchInput"
              v-model="formData8.searchText"
            ></el-input>
          </el-col>
          <el-col :span="11">
            <el-button
              type="primary"
              @click="handleSearch"
              style="margin-left: 10px"
              >搜索</el-button
            >
          </el-col>
          <el-col :span="1" v-if="$window.g.IsZengChengProject">
            <i
              class="el-icon-s-order"
              :style="{
                color: formData8.isCardMode ? '#d7d7d7' : '#409EFF',
                'font-size': '30px',
                cursor: 'pointer',
              }"
              @click="formData8.isCardMode = false"
            ></i>
          </el-col>
          <el-col :span="1" v-if="$window.g.IsZengChengProject">
            <i
              class="el-icon-menu"
              :style="{
                color: formData8.isCardMode ? '#409EFF' : '#d7d7d7',
                'font-size': '30px',
                cursor: 'pointer',
              }"
              @click="formData8.isCardMode = true"
            ></i>
          </el-col>
        </el-row>
        <section
          v-if="
            $window.g.IsZengChengProject &&
            formData8.isCardMode &&
            formData8.tableData.length != 0
          "
          style="
            width: 100%;
            height: 670px;
            padding-left: 1.5%;
            overflow-y: scroll;
            display: flex;
            flex-wrap: wrap;
            align-content: flex-start;
          "
        >
          <div
            v-for="(item, index) in formData8.tableData"
            :key="index"
            @click="handleRowClick(item)"
            style="
              position: relative;
              display: inline-block;
              width: 12.4vw;
              min-width: 235px;
              height: 95px;
              border: 1px solid #d7d7d7;
              border-radius: 10px;
              margin: 1% 0px 0px 1%;
              display: flex;
            "
          >
            <el-checkbox
              v-if="!manageVisible && !threeSidesVisible && !transferVisible"
              v-model="item.checked"
              @change="onCheckCard(item, index)"
              style="position: absolute; left: 3%; top: 3%"
            ></el-checkbox>
            <div
              left
              style="
                display: inline-block;
                width: 40%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <div
                style="
                  width: 70%;
                  height: 55%;
                  overflow: hidden;
                  border-radius: 50%;
                "
              >
                <img
                  :src="
                    item.picture
                      ? $window.g.ApiUrl + item.picture
                      : '/static/img/headless.png'
                  "
                  style="width: 105%; height: 105%"
                />
              </div>
            </div>
            <div
              right
              style="
                position: relative;
                display: inline-block;
                width: 60%;
                height: 88px;
                box-sizing: border-box;
                padding: 6% 0px;
                display: flex;
                flex-wrap: wrap;
                align-items: center;
              "
            >
              <div
                style="
                  width: 100%;
                  font-size: 12px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                "
              >
                <span style="color: #d7d7d7">姓名：</span>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.name"
                  placement="top"
                >
                  <span>{{ item.name }}</span>
                </el-tooltip>
              </div>
              <div
                style="
                  width: 100%;
                  font-size: 12px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                "
              >
                <span style="color: #d7d7d7">职务：</span>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.position"
                  placement="top"
                >
                  <span>{{ item.position }}</span>
                </el-tooltip>
              </div>
              <div style="width: 100%; font-size: 12px; white-space: nowrap">
                <span style="color: #d7d7d7">电话：</span>
                <template v-if="item.number">
                  <template
                    v-if="
                      item.otherTel != '' ||
                      item.officeTel != '' ||
                      item.homeTel != '' ||
                      item.otherTel2 != ''
                    "
                  >
                    <el-dropdown
                      style="position: initial !important; font-size: 12px"
                      @command="handleCommand(item)"
                      placement="bottom"
                      trigger="click"
                      @visible-change="changeDropdown"
                    >
                      <span class="el-dropdown-link">
                        <div
                          style="
                            display: inline-block;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            width: initial;
                          "
                        >
                          <el-tooltip
                            class="item"
                            effect="dark"
                            :content="item.number"
                            placement="top"
                          >
                            <span>{{ item.number }}</span>
                          </el-tooltip>
                        </div>
                        <i
                          class="el-icon-arrow-down el-icon--right"
                          style="margin-left: 0px; font-size: 15px"
                        ></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="a" v-if="item.otherTel">
                          <div
                            @mouseover="elDropdownItem(1)"
                            class="dropdownDiv"
                          >
                            <span>手机2: {{ item.otherTel }}</span>
                            <span
                              v-if="showSpanImg == 1"
                              style="
                                display: inline-block;
                                width: 13px;
                                padding-left: 30px;
                              "
                            >
                              <img
                                style="width: 100%; height: 100%"
                                src="/static/img/icon/dailCall.png"
                              />
                            </span>
                          </div>
                        </el-dropdown-item>
                        <el-dropdown-item command="b" v-if="item.officeTel">
                          <div
                            @mouseover="elDropdownItem(2)"
                            class="dropdownDiv"
                          >
                            <span>办公电话: {{ item.officeTel }}</span>
                            <span
                              v-if="showSpanImg == 2"
                              style="
                                display: inline-block;
                                width: 13px;
                                padding-left: 30px;
                              "
                            >
                              <img
                                style="width: 100%; height: 100%"
                                src="/static/img/icon/dailCall.png"
                              />
                            </span>
                          </div>
                        </el-dropdown-item>
                        <el-dropdown-item command="c" v-if="item.homeTel">
                          <div
                            @mouseover="elDropdownItem(3)"
                            class="dropdownDiv"
                          >
                            <span>应急电话: {{ item.homeTel }}</span>
                            <span
                              v-if="showSpanImg == 3"
                              style="
                                display: inline-block;
                                width: 13px;
                                padding-left: 30px;
                              "
                            >
                              <img
                                style="width: 100%; height: 100%"
                                src="/static/img/icon/dailCall.png"
                              />
                            </span>
                          </div>
                        </el-dropdown-item>
                        <el-dropdown-item command="d" v-if="item.otherTel2">
                          <div
                            @mouseover="elDropdownItem(4)"
                            class="dropdownDiv"
                          >
                            <span>其他电话: {{ item.otherTel2 }}</span>
                            <span
                              v-if="showSpanImg == 4"
                              style="
                                display: inline-block;
                                width: 13px;
                                padding-left: 30px;
                              "
                            >
                              <img
                                style="width: 100%; height: 100%"
                                src="/static/img/icon/dailCall.png"
                              />
                            </span>
                          </div>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                  <div
                    v-else
                    style="
                      display: inline-block;
                      overflow: hidden;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      width: initial;
                    "
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="item.number"
                      placement="top"
                    >
                      <span>{{ item.number }}</span>
                    </el-tooltip>
                  </div>
                </template>
              </div>
              <div
                style="
                  position: absolute;
                  bottom: -5%;
                  right: 5%;
                  white-space: nowrap;
                "
              >
                <el-tooltip
                  v-if="manageVisible && !threeSidesVisible && !transferVisible"
                  class="item"
                  effect="dark"
                  content="查看"
                  placement="top"
                >
                  <i
                    class="el-icon-info"
                    @click="watchContactDetails(item)"
                    style="font-size: 16px; color: #9fc8fe; cursor: pointer"
                  >
                  </i>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="拨号"
                  placement="top"
                  v-if="!threeSidesVisible && !transferVisible"
                >
                  <i
                    class="el-icon-phone-outline"
                    @click="talkCall(item)"
                    style="font-size: 16px; color: #9fc8fe; cursor: pointer"
                  ></i>
                </el-tooltip>

                <el-tooltip
                  class="item"
                  effect="dark"
                  content="三方"
                  placement="top"
                  v-if="threeSidesVisible"
                >
                  <i
                    class="el-icon-circle-plus"
                    @click="busClickThree({ row: item })"
                    style="font-size: 16px; color: #9fc8fe; cursor: pointer"
                  ></i>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="转接"
                  placement="top"
                  v-if="transferVisible"
                >
                  <img
                    style="display: inline-block; width: 24px; cursor: pointer"
                    src="/static/img/icon/onDailCall.png"
                    @click="busClickTrans({ row: item })"
                  />
                </el-tooltip>
              </div>
            </div>
          </div>
        </section>
        <section
          v-if="
            $window.g.IsZengChengProject &&
            formData8.isCardMode &&
            formData8.tableData.length == 0
          "
          style="
            width: 100%;
            height: 670px;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          暂无数据
        </section>
        <el-table
          ref="singleTable"
          v-if="!formData8.isCardMode || !$window.g.IsZengChengProject"
          :data="formData8.tableData"
          highlight-current-row
          :header-cell-style="{ background: '#E6E6E6', color: '#606266' }"
          height="670"
          style="width: 100%; height: 670px; overflow: auto"
          @row-dblclick="handleRowDbClick"
          @cell-mouse-enter="showInfo"
          @row-click="handleRowClick"
          @selection-change="handleSelectionChange"
        >
          <!-- <el-table-column type="index" width="50" show-overflow-tooltip  :resizable="false" align="center"></el-table-column> -->
          <el-table-column
            align="center"
            prop="name"
            show-overflow-tooltip
            :resizable="false"
            label="姓名"
          >
            <template slot-scope="scope">
              <span style="color: red" v-if="scope.row.infoMark == 1">*</span>
              <span style="margin-left: 10px">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
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
            <template slot-scope="scope">
              <div v-if="scope.row.number">
                <div
                  v-if="
                    scope.row.otherTel != '' ||
                    scope.row.officeTel != '' ||
                    scope.row.homeTel != '' ||
                    scope.row.otherTel2 != ''
                  "
                >
                  <el-dropdown
                    @command="handleCommand(scope.row)"
                    placement="bottom"
                    trigger="click"
                    @visible-change="changeDropdown"
                  >
                    <span class="el-dropdown-link">
                      {{ scope.row.number }}
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="a" v-if="scope.row.otherTel">
                        <div @mouseover="elDropdownItem(1)" class="dropdownDiv">
                          <span>手机2: {{ scope.row.otherTel }}</span>
                          <span
                            v-if="showSpanImg == 1"
                            style="
                              display: inline-block;
                              width: 13px;
                              padding-left: 30px;
                            "
                          >
                            <img
                              style="width: 100%; height: 100%"
                              src="/static/img/icon/dailCall.png"
                            />
                          </span>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item command="b" v-if="scope.row.officeTel">
                        <div @mouseover="elDropdownItem(2)" class="dropdownDiv">
                          <span>办公电话: {{ scope.row.officeTel }}</span>
                          <span
                            v-if="showSpanImg == 2"
                            style="
                              display: inline-block;
                              width: 13px;
                              padding-left: 30px;
                            "
                          >
                            <img
                              style="width: 100%; height: 100%"
                              src="/static/img/icon/dailCall.png"
                            />
                          </span>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item command="c" v-if="scope.row.homeTel">
                        <div @mouseover="elDropdownItem(3)" class="dropdownDiv">
                          <span>应急电话: {{ scope.row.homeTel }}</span>
                          <span
                            v-if="showSpanImg == 3"
                            style="
                              display: inline-block;
                              width: 13px;
                              padding-left: 30px;
                            "
                          >
                            <img
                              style="width: 100%; height: 100%"
                              src="/static/img/icon/dailCall.png"
                            />
                          </span>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item command="d" v-if="scope.row.otherTel2">
                        <div @mouseover="elDropdownItem(4)" class="dropdownDiv">
                          <span>其他电话: {{ scope.row.otherTel2 }}</span>
                          <span
                            v-if="showSpanImg == 4"
                            style="
                              display: inline-block;
                              width: 13px;
                              padding-left: 30px;
                            "
                          >
                            <img
                              style="width: 100%; height: 100%"
                              src="/static/img/icon/dailCall.png"
                            />
                          </span>
                        </div>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                <span v-else>{{ scope.row.number }}</span>
              </div>
              <span v-else>{{ scope.row.number }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px" align="center">
            <template slot-scope="scope">
              <!-- 
                    @authorName: qinjiaqi
                    @description：查看按钮 
                -->
              <el-tooltip
                v-if="manageVisible && !threeSidesVisible && !transferVisible"
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
              <el-tooltip
                class="item"
                effect="dark"
                content="拨号"
                placement="top"
                v-if="!threeSidesVisible && !transferVisible"
              >
                <i
                  class="el-icon-phone-outline"
                  @click="talkCall(scope.row)"
                  style="font-size: 24px; color: #9fc8fe; cursor: pointer"
                ></i>
              </el-tooltip>
              <!-- <el-tooltip class="item" effect="dark" content="设为常用联系人" placement="top"
                          v-if="!threeSidesVisible&&!transferVisible">
                <i
                  class="el-icon-star-on"
                  @click="handSetToCommon(scope.row)"
                  :style="{'font-size': '24px',cursor: 'pointer','margin-left': '1vw',color:scope.row.commonlyUsed==0?'#9FC8FE':'#FBC958'}"
                ></i>
              </el-tooltip> -->
              <el-tooltip
                class="item"
                effect="dark"
                content="三方"
                placement="top"
                v-if="threeSidesVisible"
              >
                <i
                  class="el-icon-circle-plus"
                  @click="busClickThree(scope)"
                  style="font-size: 24px; color: #9fc8fe; cursor: pointer"
                ></i>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="转接"
                placement="top"
                v-if="transferVisible"
              >
                <img
                  style="display: inline-block; width: 24px; cursor: pointer"
                  src="/static/img/icon/onDailCall.png"
                  @click="busClickTrans(scope)"
                />
              </el-tooltip>
              <!-- <el-button type="primary" size="mini" @click="addPhoneCall(scope.row)">添加</el-button>
              <el-button type="primary" size="mini" @click="talkCall(scope.row)">拨号</el-button>
              <el-button type="primary" size="mini" @click="handSetToCommon(scope.row)">设为常用</el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-pagination
            class="pagination"
            background
            :page-size="formData8.pageSize"
            :page-sizes="[10, 20, 30, 40]"
            :total="formData8.total"
            :current-page="formData8.currentPage"
            @current-change="handCurrentChange"
            @size-change="handSizeChange"
            layout="total, prev, pager, next, sizes, jumper"
          ></el-pagination>
        </el-row>
      </div>
    </div>
    <div class="my-phone-main" v-if="tabPosition == 9">
      <div class="my-tree-box" style="box-sizing: border-box; overflow: auto">
        <el-scrollbar class="my-tree-scroll">
          <el-input
            placeholder="输入关键字进行搜索"
            v-model="formData9.filterTree"
            class="treeSearch"
            style="padding: 10px; box-sizing: border-box"
          >
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              @click="$refs.tree9.filter(formData9.filterTree)"
            ></i>
          </el-input>
          <el-tree
            :data="formData9.treeData"
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
            node-key="id"
            ref="tree9"
            highlight-current
            :props="defaultProps"
            :show-checkbox="!manageVisible ? true : false"
            @check-change="handleCheckChange"
            @check="handleCheck"
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
                  right: 4%;
                  transform: translateY(-50%);
                "
                v-show="treeBtnHoverIndex == data.id && data.id != -1"
              >
                <div
                  style="display: flex; align-items: center; cursor: pointer"
                  v-show="!manageVisible"
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
                      @click="editGroupDetails(node, data)"
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
                  v-show="!manageVisible"
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
                <div
                  style="
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    margin-left: 5px;
                  "
                >
                  <watch-group-details
                    :node="node"
                    :data="data"
                    :top-position="tabPosition"
                  ></watch-group-details>
                </div>
              </span>
            </span>
          </el-tree>
        </el-scrollbar>
        <treeBtn
          v-if="!manageVisible"
          @changeDialog="closeDialog"
          @refreshData="refreshData"
          :treeDataItem="formData9.treeDataItem"
          :treeData="formData9.treeData"
          :formData="treeBtnConfig3"
          ref="treeBtn9"
          :treeDataItems="formData9.treeMultipleSelection"
          tabPosition="ziyuanlianluowang"
        ></treeBtn>
      </div>
      <div class="my-table-box" style="box-sizing: border-box; overflow: auto">
        <btn-box
          v-if="!manageVisible"
          :btnArry="btnArry"
          v-bind="{
            add: { callback: addList },
            edit: { callback: handleEdit },
            del: { callback: handleDelete },
            sort: { callback: handleSort },
            download: { callback: handleExportContactor },
            document: { callback: handleExportm },
          }"
          :batchJoinIsShow="true"
          @handleBatchJoin="handleBatchJoin"
          @success="batchJoinSuccess"
        ></btn-box>
        <el-row
          class="my-table-box-search"
          style="margin: 10px; display: flex; align-items: center"
        >
          <el-col :span="11">
            <el-input
              placeholder="请输入姓名/单位/职位/号码"
              class="searchInput"
              v-model="formData9.searchText"
              @input="handleSearch"
            ></el-input>
          </el-col>
          <el-col :span="11">
            <el-button
              type="primary"
              @click="handleSearch"
              style="margin-left: 10px"
              >搜索</el-button
            >
          </el-col>
          <el-col :span="1" v-if="$window.g.IsZengChengProject">
            <i
              class="el-icon-s-order"
              :style="{
                color: formData9.isCardMode ? '#d7d7d7' : '#409EFF',
                'font-size': '30px',
                cursor: 'pointer',
              }"
              @click="formData9.isCardMode = false"
            ></i>
          </el-col>
          <el-col :span="1" v-if="$window.g.IsZengChengProject">
            <i
              class="el-icon-menu"
              :style="{
                color: formData9.isCardMode ? '#409EFF' : '#d7d7d7',
                'font-size': '30px',
                cursor: 'pointer',
              }"
              @click="formData9.isCardMode = true"
            ></i>
          </el-col>
        </el-row>
        <section
          v-if="
            $window.g.IsZengChengProject &&
            formData9.isCardMode &&
            formData9.tableData.length != 0
          "
          style="
            width: 100%;
            height: 670px;
            padding-left: 1.5%;
            overflow-y: scroll;
            display: flex;
            flex-wrap: wrap;
            align-content: flex-start;
          "
        >
          <div
            v-for="(item, index) in formData9.tableData"
            :key="index"
            @click="handleRowClick(item)"
            style="
              position: relative;
              display: inline-block;
              width: 12.4vw;
              min-width: 235px;
              height: 95px;
              border: 1px solid #d7d7d7;
              border-radius: 10px;
              margin: 1% 0px 0px 1%;
              display: flex;
            "
          >
            <el-checkbox
              v-if="!manageVisible && !threeSidesVisible && !transferVisible"
              v-model="item.checked"
              @change="onCheckCard(item, index)"
              style="position: absolute; left: 3%; top: 3%"
            ></el-checkbox>
            <div
              left
              style="
                display: inline-block;
                width: 40%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <div
                style="
                  width: 70%;
                  height: 55%;
                  overflow: hidden;
                  border-radius: 50%;
                "
              >
                <img
                  :src="
                    item.picture
                      ? $window.g.ApiUrl + item.picture
                      : '/static/img/headless.png'
                  "
                  style="width: 105%; height: 105%"
                />
              </div>
            </div>
            <div
              right
              style="
                position: relative;
                display: inline-block;
                width: 60%;
                height: 88px;
                box-sizing: border-box;
                padding: 6% 0px;
                display: flex;
                flex-wrap: wrap;
                align-items: center;
              "
            >
              <div
                style="
                  width: 100%;
                  font-size: 12px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                "
              >
                <span style="color: #d7d7d7">姓名：</span>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.name"
                  placement="top"
                >
                  <span>{{ item.name }}</span>
                </el-tooltip>
              </div>
              <div
                style="
                  width: 100%;
                  font-size: 12px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                "
              >
                <span style="color: #d7d7d7">职务：</span>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.position"
                  placement="top"
                >
                  <span>{{ item.position }}</span>
                </el-tooltip>
              </div>
              <div style="width: 100%; font-size: 12px; white-space: nowrap">
                <span style="color: #d7d7d7">电话：</span>
                <template v-if="item.number">
                  <template
                    v-if="
                      item.otherTel != '' ||
                      item.officeTel != '' ||
                      item.homeTel != '' ||
                      item.otherTel2 != ''
                    "
                  >
                    <el-dropdown
                      style="position: initial !important; font-size: 12px"
                      @command="handleCommand(item)"
                      placement="bottom"
                      trigger="click"
                      @visible-change="changeDropdown"
                    >
                      <span class="el-dropdown-link">
                        <div
                          style="
                            display: inline-block;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            width: initial;
                          "
                        >
                          <el-tooltip
                            class="item"
                            effect="dark"
                            :content="item.number"
                            placement="top"
                          >
                            <span>{{ item.number }}</span>
                          </el-tooltip>
                        </div>
                        <i
                          class="el-icon-arrow-down el-icon--right"
                          style="margin-left: 0px; font-size: 15px"
                        ></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="a" v-if="item.otherTel">
                          <div
                            @mouseover="elDropdownItem(1)"
                            class="dropdownDiv"
                          >
                            <span>手机2: {{ item.otherTel }}</span>
                            <span
                              v-if="showSpanImg == 1"
                              style="
                                display: inline-block;
                                width: 13px;
                                padding-left: 30px;
                              "
                            >
                              <img
                                style="width: 100%; height: 100%"
                                src="/static/img/icon/dailCall.png"
                              />
                            </span>
                          </div>
                        </el-dropdown-item>
                        <el-dropdown-item command="b" v-if="item.officeTel">
                          <div
                            @mouseover="elDropdownItem(2)"
                            class="dropdownDiv"
                          >
                            <span>办公电话: {{ item.officeTel }}</span>
                            <span
                              v-if="showSpanImg == 2"
                              style="
                                display: inline-block;
                                width: 13px;
                                padding-left: 30px;
                              "
                            >
                              <img
                                style="width: 100%; height: 100%"
                                src="/static/img/icon/dailCall.png"
                              />
                            </span>
                          </div>
                        </el-dropdown-item>
                        <el-dropdown-item command="c" v-if="item.homeTel">
                          <div
                            @mouseover="elDropdownItem(3)"
                            class="dropdownDiv"
                          >
                            <span>应急电话: {{ item.homeTel }}</span>
                            <span
                              v-if="showSpanImg == 3"
                              style="
                                display: inline-block;
                                width: 13px;
                                padding-left: 30px;
                              "
                            >
                              <img
                                style="width: 100%; height: 100%"
                                src="/static/img/icon/dailCall.png"
                              />
                            </span>
                          </div>
                        </el-dropdown-item>
                        <el-dropdown-item command="d" v-if="item.otherTel2">
                          <div
                            @mouseover="elDropdownItem(4)"
                            class="dropdownDiv"
                          >
                            <span>其他电话: {{ item.otherTel2 }}</span>
                            <span
                              v-if="showSpanImg == 4"
                              style="
                                display: inline-block;
                                width: 13px;
                                padding-left: 30px;
                              "
                            >
                              <img
                                style="width: 100%; height: 100%"
                                src="/static/img/icon/dailCall.png"
                              />
                            </span>
                          </div>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                  <div
                    v-else
                    style="
                      display: inline-block;
                      overflow: hidden;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      width: initial;
                    "
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="item.number"
                      placement="top"
                    >
                      <span>{{ item.number }}</span>
                    </el-tooltip>
                  </div>
                </template>
              </div>
              <div
                style="
                  position: absolute;
                  bottom: -5%;
                  right: 5%;
                  white-space: nowrap;
                "
              >
                <el-tooltip
                  v-if="manageVisible && !threeSidesVisible && !transferVisible"
                  class="item"
                  effect="dark"
                  content="查看"
                  placement="top"
                >
                  <i
                    class="el-icon-info"
                    @click="watchContactDetails(item)"
                    style="font-size: 16px; color: #9fc8fe; cursor: pointer"
                  ></i>
                </el-tooltip>
                <el-tooltip
                  v-if="
                    !manageVisible && !threeSidesVisible && !transferVisible
                  "
                  class="item"
                  effect="dark"
                  content="编辑"
                  placement="top"
                >
                  <i
                    class="el-icon-edit"
                    @click="
                      ['formData' + tabPosition].rowData = item;
                      window.setTimeout(() => {
                        handleEdit();
                      }, 500);
                    "
                    style="
                      font-size: 16px;
                      margin-left: 2%;
                      color: #9fc8fe;
                      cursor: pointer;
                    "
                  ></i>
                </el-tooltip>
                <el-tooltip
                  v-if="
                    !manageVisible && !threeSidesVisible && !transferVisible
                  "
                  class="item"
                  effect="dark"
                  content="删除"
                  placement="top"
                >
                  <i
                    class="el-icon-delete-solid"
                    @click="
                      ['formData' + tabPosition].rowData = item;
                      window.setTimeout(() => {
                        handleDeleteItem();
                      }, 500);
                    "
                    style="
                      font-size: 16px;
                      margin-left: 2%;
                      color: #9fc8fe;
                      cursor: pointer;
                    "
                  ></i>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="拨号"
                  placement="top"
                  v-if="!threeSidesVisible && !transferVisible"
                >
                  <i
                    class="el-icon-phone-outline"
                    @click="talkCall(item)"
                    style="
                      font-size: 16px;
                      margin-left: 2%;
                      color: #9fc8fe;
                      cursor: pointer;
                    "
                  ></i>
                </el-tooltip>

                <el-tooltip
                  class="item"
                  effect="dark"
                  content="三方"
                  placement="top"
                  v-if="threeSidesVisible"
                >
                  <i
                    class="el-icon-circle-plus"
                    @click="busClickThree({ row: item })"
                    style="font-size: 16px; color: #9fc8fe; cursor: pointer"
                  ></i>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="转接"
                  placement="top"
                  v-if="transferVisible"
                >
                  <img
                    style="display: inline-block; width: 24px; cursor: pointer"
                    src="/static/img/icon/onDailCall.png"
                    @click="busClickTrans({ row: item })"
                  />
                </el-tooltip>
              </div>
            </div>
          </div>
        </section>
        <section
          v-if="
            $window.g.IsZengChengProject &&
            formData9.isCardMode &&
            formData9.tableData.length == 0
          "
          style="
            width: 100%;
            height: 670px;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          暂无数据
        </section>
        <el-table
          ref="singleTable"
          v-if="!formData9.isCardMode || !$window.g.IsZengChengProject"
          :data="formData9.tableData"
          highlight-current-row
          :header-cell-style="{ background: '#E6E6E6', color: '#606266' }"
          height="670"
          style="width: 100%; height: 670px; overflow: auto"
          @row-dblclick="handleRowDbClick"
          @cell-mouse-enter="showInfo"
          @row-click="handleRowClick"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            v-if="!manageVisible"
          ></el-table-column>
          <!-- <el-table-column type="index" width="50" show-overflow-tooltip  :resizable="false" align="center"></el-table-column> -->
          <el-table-column
            align="center"
            prop="name"
            show-overflow-tooltip
            :resizable="false"
            label="姓名"
          >
            <template slot-scope="scope">
              <span style="color: red" v-if="scope.row.infoMark == 1">*</span>
              <span style="margin-left: 10px">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
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
            <template slot-scope="scope">
              <div v-if="scope.row.number">
                <div
                  v-if="
                    scope.row.otherTel != '' ||
                    scope.row.officeTel != '' ||
                    scope.row.homeTel != '' ||
                    scope.row.otherTel2 != ''
                  "
                >
                  <el-dropdown
                    @command="handleCommand(scope.row)"
                    placement="bottom"
                    trigger="click"
                    @visible-change="changeDropdown"
                  >
                    <span class="el-dropdown-link">
                      {{ scope.row.number }}
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="a" v-if="scope.row.otherTel">
                        <div @mouseover="elDropdownItem(1)" class="dropdownDiv">
                          <span>手机2: {{ scope.row.otherTel }}</span>
                          <span
                            v-if="showSpanImg == 1"
                            style="
                              display: inline-block;
                              width: 13px;
                              padding-left: 30px;
                            "
                          >
                            <img
                              style="width: 100%; height: 100%"
                              src="/static/img/icon/dailCall.png"
                            />
                          </span>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item command="b" v-if="scope.row.officeTel">
                        <div @mouseover="elDropdownItem(2)" class="dropdownDiv">
                          <span>办公电话: {{ scope.row.officeTel }}</span>
                          <span
                            v-if="showSpanImg == 2"
                            style="
                              display: inline-block;
                              width: 13px;
                              padding-left: 30px;
                            "
                          >
                            <img
                              style="width: 100%; height: 100%"
                              src="/static/img/icon/dailCall.png"
                            />
                          </span>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item command="c" v-if="scope.row.homeTel">
                        <div @mouseover="elDropdownItem(3)" class="dropdownDiv">
                          <span>应急电话: {{ scope.row.homeTel }}</span>
                          <span
                            v-if="showSpanImg == 3"
                            style="
                              display: inline-block;
                              width: 13px;
                              padding-left: 30px;
                            "
                          >
                            <img
                              style="width: 100%; height: 100%"
                              src="/static/img/icon/dailCall.png"
                            />
                          </span>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item command="d" v-if="scope.row.otherTel2">
                        <div @mouseover="elDropdownItem(4)" class="dropdownDiv">
                          <span>其他电话: {{ scope.row.otherTel2 }}</span>
                          <span
                            v-if="showSpanImg == 4"
                            style="
                              display: inline-block;
                              width: 13px;
                              padding-left: 30px;
                            "
                          >
                            <img
                              style="width: 100%; height: 100%"
                              src="/static/img/icon/dailCall.png"
                            />
                          </span>
                        </div>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                <span v-else>{{ scope.row.number }}</span>
              </div>
              <span v-else>{{ scope.row.number }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px" align="center">
            <template slot-scope="scope">
              <el-tooltip
                v-if="manageVisible && !threeSidesVisible && !transferVisible"
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
                v-if="!manageVisible && !threeSidesVisible && !transferVisible"
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
                v-if="!manageVisible && !threeSidesVisible && !transferVisible"
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
              <el-tooltip
                class="item"
                effect="dark"
                content="拨号"
                placement="top"
                v-if="!threeSidesVisible && !transferVisible"
              >
                <i
                  class="el-icon-phone-outline"
                  @click="talkCall(scope.row)"
                  style="
                    font-size: 24px;
                    margin-left: 1vw;
                    color: #9fc8fe;
                    cursor: pointer;
                  "
                ></i>
              </el-tooltip>
              <!-- <el-tooltip class="item" effect="dark" content="设为常用联系人" placement="top"
                          v-if="!threeSidesVisible&&!transferVisible">
                <i
                  class="el-icon-star-on"
                  @click="handSetToCommon(scope.row)"
                  :style="{'font-size': '24px','margin-left': '1vw',cursor: 'pointer',color:scope.row.commonlyUsed==0?'#9FC8FE':'#FBC958'}"
                ></i>
              </el-tooltip> -->
              <el-tooltip
                class="item"
                effect="dark"
                content="三方"
                placement="top"
                v-if="threeSidesVisible"
              >
                <i
                  class="el-icon-circle-plus"
                  @click="busClickThree(scope)"
                  style="font-size: 24px; color: #9fc8fe; cursor: pointer"
                ></i>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="转接"
                placement="top"
                v-if="transferVisible"
              >
                <img
                  style="display: inline-block; width: 24px; cursor: pointer"
                  src="/static/img/icon/onDailCall.png"
                  @click="busClickTrans(scope)"
                />
              </el-tooltip>
              <!-- <el-button type="primary" size="mini" @click="addPhoneCall(scope.row)">添加</el-button>
              <el-button type="primary" size="mini" @click="talkCall(scope.row)">拨号</el-button>
              <el-button type="primary" size="mini" @click="handSetToCommon(scope.row)">设为常用</el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-pagination
            class="pagination"
            background
            :page-size="formData9.pageSize"
            :page-sizes="[10, 20, 30, 40]"
            :total="formData9.total"
            :current-page="formData9.currentPage"
            @current-change="handCurrentChange"
            @size-change="handSizeChange"
            layout="total, prev, pager, next, sizes, jumper"
          ></el-pagination>
        </el-row>
      </div>
    </div>
    <!--电话快捷组-->
    <div class="my-phone-main" v-if="tabPosition == 10">
      <div class="my-tree-box" style="box-sizing: border-box; overflow: auto">
        <el-scrollbar class="my-tree-scroll">
          <el-input
            placeholder="输入关键字进行搜索"
            v-model="formData10.filterTree"
            class="treeSearch"
            style="padding: 10px; box-sizing: border-box"
          >
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              @click="$refs.tree10.filter(formData10.filterTree)"
            ></i>
          </el-input>
          <el-tree
            :data="formData10.treeData"
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
            node-key="id"
            ref="tree10"
            highlight-current
            :props="defaultProps"
            draggable
            @node-drop="handleDrop"
            :allow-drop="allowDrop"
            :allow-drag="allowDrag"
            :show-checkbox="!manageVisible ? true : false"
            @check-change="handleCheckChange"
            @check="handleCheck"
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
                  right: 4%;
                  transform: translateY(-50%);
                "
                v-show="treeBtnHoverIndex == data.id && data.id != -1"
              >
                <div
                  style="display: flex; align-items: center; cursor: pointer"
                  v-show="!manageVisible"
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
                      @click="editGroupDetails(node, data)"
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
                  v-show="!manageVisible"
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
                <div
                  style="
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    margin-left: 5px;
                  "
                >
                  <watch-group-details
                    :node="node"
                    :data="data"
                    :top-position="tabPosition"
                  ></watch-group-details>
                </div>
              </span>
            </span>
          </el-tree>
        </el-scrollbar>
        <treeBtn
          v-if="!manageVisible"
          @changeDialog="closeDialog"
          @refreshData="refreshData"
          :treeDataItem="formData10.treeDataItem"
          :treeData="formData10.treeData"
          :formData="treeBtnConfig4"
          ref="treeBtn10"
          :treeDataItems="formData10.treeMultipleSelection"
          tabPosition="jicenglianluowang"
        ></treeBtn>
        <!-- <el-alert title="温馨提示" type="info" description="可拖动修改同级分组排序" show-icon>
        </el-alert>-->
      </div>
      <div class="my-table-box" style="box-sizing: border-box; overflow: auto">
        <btn-box
          v-if="!manageVisible"
          :btnArry="[
            {
              event: 'add',
              icon: 'el-icon-plus',
              title: '新增联系人',
            },
            {
              event: 'del',
              icon: 'el-icon-delete',
              title: '批量移除',
            },
            {
              event: 'select',
              title: '选择联系人',
            },
            {
              event: 'export',
              title: '导出联系人',
            },
          ]"
          v-bind="{
            add: { callback: addList },
            del: { callback: handleDelete },
            select: { callback: handleSelectContactor },
            export: { callback: handleExportContactor },
          }"
        >
        </btn-box>
        <el-row
          class="my-table-box-search"
          style="margin: 10px; display: flex; align-items: center"
        >
          <el-col :span="11">
            <el-input
              placeholder="请输入姓名/单位/职位/号码"
              class="searchInput"
              v-model="formData10.searchText"
              @input="handleSearch"
            ></el-input>
          </el-col>
          <el-col :span="11">
            <el-button
              type="primary"
              @click="handleSearch"
              style="margin-left: 10px"
              >搜索</el-button
            >
          </el-col>
          <el-col :span="1" v-if="$window.g.IsZengChengProject">
            <i
              class="el-icon-s-order"
              :style="{
                color: formData10.isCardMode ? '#d7d7d7' : '#409EFF',
                'font-size': '30px',
                cursor: 'pointer',
              }"
              @click="formData10.isCardMode = false"
            ></i>
          </el-col>
          <el-col :span="1" v-if="$window.g.IsZengChengProject">
            <i
              class="el-icon-menu"
              :style="{
                color: formData10.isCardMode ? '#409EFF' : '#d7d7d7',
                'font-size': '30px',
                cursor: 'pointer',
              }"
              @click="formData10.isCardMode = true"
            ></i>
          </el-col>
        </el-row>
        <section
          v-if="
            $window.g.IsZengChengProject &&
            $window.g.IsZengChengProject &&
            formData10.isCardMode &&
            formData10.tableData.length != 0
          "
          style="
            width: 100%;
            height: 670px;
            padding-left: 1.5%;
            overflow-y: scroll;
            display: flex;
            flex-wrap: wrap;
            align-content: flex-start;
          "
        >
          <div
            v-for="(item, index) in formData10.tableData"
            :key="index"
            @click="handleRowClick(item)"
            style="
              position: relative;
              display: inline-block;
              width: 12.4vw;
              min-width: 235px;
              height: 95px;
              border: 1px solid #d7d7d7;
              border-radius: 10px;
              margin: 1% 0px 0px 1%;
              display: flex;
            "
          >
            <el-checkbox
              v-if="!manageVisible && !threeSidesVisible && !transferVisible"
              v-model="item.checked"
              @change="onCheckCard(item, index)"
              style="position: absolute; left: 3%; top: 3%"
            ></el-checkbox>
            <div
              left
              style="
                display: inline-block;
                width: 40%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <div
                style="
                  width: 70%;
                  height: 55%;
                  overflow: hidden;
                  border-radius: 50%;
                "
              >
                <img
                  :src="
                    item.picture
                      ? $window.g.ApiUrl + item.picture
                      : '/static/img/headless.png'
                  "
                  style="width: 105%; height: 105%"
                />
              </div>
            </div>
            <div
              right
              style="
                position: relative;
                display: inline-block;
                width: 60%;
                height: 88px;
                box-sizing: border-box;
                padding: 6% 0px;
                display: flex;
                flex-wrap: wrap;
                align-items: center;
              "
            >
              <div
                style="
                  width: 100%;
                  font-size: 12px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                "
              >
                <span style="color: #d7d7d7">姓名：</span>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.name"
                  placement="top"
                >
                  <span>{{ item.name }}</span>
                </el-tooltip>
              </div>
              <div
                style="
                  width: 100%;
                  font-size: 12px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                "
              >
                <span style="color: #d7d7d7">职务：</span>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.position"
                  placement="top"
                >
                  <span>{{ item.position }}</span>
                </el-tooltip>
              </div>
              <div style="width: 100%; font-size: 12px; white-space: nowrap">
                <span style="color: #d7d7d7">电话：</span>
                <template v-if="item.number">
                  <template
                    v-if="
                      item.otherTel != '' ||
                      item.officeTel != '' ||
                      item.homeTel != '' ||
                      item.otherTel2 != ''
                    "
                  >
                    <el-dropdown
                      style="position: initial !important; font-size: 12px"
                      @command="handleCommand(item)"
                      placement="bottom"
                      trigger="click"
                      @visible-change="changeDropdown"
                    >
                      <span class="el-dropdown-link">
                        <div
                          style="
                            display: inline-block;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            width: initial;
                          "
                        >
                          <el-tooltip
                            class="item"
                            effect="dark"
                            :content="item.number"
                            placement="top"
                          >
                            <span>{{ item.number }}</span>
                          </el-tooltip>
                        </div>
                        <i
                          class="el-icon-arrow-down el-icon--right"
                          style="margin-left: 0px; font-size: 15px"
                        ></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="a" v-if="item.otherTel">
                          <div
                            @mouseover="elDropdownItem(1)"
                            class="dropdownDiv"
                          >
                            <span>手机2: {{ item.otherTel }}</span>
                            <span
                              v-if="showSpanImg == 1"
                              style="
                                display: inline-block;
                                width: 13px;
                                padding-left: 30px;
                              "
                            >
                              <img
                                style="width: 100%; height: 100%"
                                src="/static/img/icon/dailCall.png"
                              />
                            </span>
                          </div>
                        </el-dropdown-item>
                        <el-dropdown-item command="b" v-if="item.officeTel">
                          <div
                            @mouseover="elDropdownItem(2)"
                            class="dropdownDiv"
                          >
                            <span>办公电话: {{ item.officeTel }}</span>
                            <span
                              v-if="showSpanImg == 2"
                              style="
                                display: inline-block;
                                width: 13px;
                                padding-left: 30px;
                              "
                            >
                              <img
                                style="width: 100%; height: 100%"
                                src="/static/img/icon/dailCall.png"
                              />
                            </span>
                          </div>
                        </el-dropdown-item>
                        <el-dropdown-item command="c" v-if="item.homeTel">
                          <div
                            @mouseover="elDropdownItem(3)"
                            class="dropdownDiv"
                          >
                            <span>应急电话: {{ item.homeTel }}</span>
                            <span
                              v-if="showSpanImg == 3"
                              style="
                                display: inline-block;
                                width: 13px;
                                padding-left: 30px;
                              "
                            >
                              <img
                                style="width: 100%; height: 100%"
                                src="/static/img/icon/dailCall.png"
                              />
                            </span>
                          </div>
                        </el-dropdown-item>
                        <el-dropdown-item command="d" v-if="item.otherTel2">
                          <div
                            @mouseover="elDropdownItem(4)"
                            class="dropdownDiv"
                          >
                            <span>其他电话: {{ item.otherTel2 }}</span>
                            <span
                              v-if="showSpanImg == 4"
                              style="
                                display: inline-block;
                                width: 13px;
                                padding-left: 30px;
                              "
                            >
                              <img
                                style="width: 100%; height: 100%"
                                src="/static/img/icon/dailCall.png"
                              />
                            </span>
                          </div>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                  <div
                    v-else
                    style="
                      display: inline-block;
                      overflow: hidden;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      width: initial;
                    "
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="item.number"
                      placement="top"
                    >
                      <span>{{ item.number }}</span>
                    </el-tooltip>
                  </div>
                </template>
              </div>
              <div
                style="
                  position: absolute;
                  bottom: -5%;
                  right: 5%;
                  white-space: nowrap;
                "
              >
                <el-tooltip
                  v-if="manageVisible && !threeSidesVisible && !transferVisible"
                  class="item"
                  effect="dark"
                  content="查看"
                  placement="top"
                >
                  <i
                    class="el-icon-info"
                    @click="watchContactDetails(item)"
                    style="font-size: 20px; color: #9fc8fe; cursor: pointer"
                  ></i>
                </el-tooltip>
                <el-tooltip
                  v-if="
                    !manageVisible && !threeSidesVisible && !transferVisible
                  "
                  class="item"
                  effect="dark"
                  content="编辑"
                  placement="top"
                >
                  <i
                    class="el-icon-edit"
                    @click="
                      ['formData' + tabPosition].rowData = item;
                      window.setTimeout(() => {
                        handleEdit();
                      }, 500);
                    "
                    style="
                      font-size: 20px;
                      margin-left: 2%;
                      color: #9fc8fe;
                      cursor: pointer;
                    "
                  ></i>
                </el-tooltip>
                <el-tooltip
                  v-if="
                    !manageVisible && !threeSidesVisible && !transferVisible
                  "
                  class="item"
                  effect="dark"
                  content="删除"
                  placement="top"
                >
                  <i
                    class="el-icon-delete-solid"
                    @click="
                      ['formData' + tabPosition].rowData = item;
                      window.setTimeout(() => {
                        handleDeleteItem();
                      }, 500);
                    "
                    style="
                      font-size: 20px;
                      margin-left: 2%;
                      color: #9fc8fe;
                      cursor: pointer;
                    "
                  ></i>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  v-if="manageVisible && !threeSidesVisible && !transferVisible"
                  content="拨号"
                  placement="top"
                >
                  <i
                    class="el-icon-phone-outline"
                    @click="talkCall(item)"
                    style="
                      font-size: 20px;
                      margin-left: 2%;
                      color: #9fc8fe;
                      cursor: pointer;
                    "
                  ></i>
                </el-tooltip>

                <el-tooltip
                  class="item"
                  effect="dark"
                  content="三方"
                  placement="top"
                  v-if="threeSidesVisible"
                >
                  <i
                    class="el-icon-circle-plus"
                    @click="busClickThree({ row: item })"
                    style="font-size: 20px; color: #9fc8fe; cursor: pointer"
                  ></i>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="转接"
                  placement="top"
                  v-if="transferVisible"
                >
                  <img
                    style="display: inline-block; width: 24px; cursor: pointer"
                    src="/static/img/icon/onDailCall.png"
                    @click="busClickTrans({ row: item })"
                  />
                </el-tooltip>
              </div>
            </div>
          </div>
        </section>
        <section
          v-if="
            $window.g.IsZengChengProject &&
            formData10.isCardMode &&
            formData10.tableData.length == 0
          "
          style="
            width: 100%;
            height: 670px;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          暂无数据
        </section>
        <el-table
          ref="singleTable"
          v-if="!formData10.isCardMode || !$window.g.IsZengChengProject"
          :data="formData10.tableData"
          highlight-current-row
          :header-cell-style="{ background: '#E6E6E6', color: '#606266' }"
          height="670"
          style="width: 100%; height: 670px; overflow: auto"
          @row-dblclick="handleRowDbClick"
          @cell-mouse-enter="showInfo"
          @row-click="handleRowClick"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            v-if="!manageVisible"
          ></el-table-column>
          <!-- <el-table-column type="index" width="50" show-overflow-tooltip  :resizable="false" align="center"></el-table-column> -->
          <el-table-column
            align="center"
            prop="name"
            show-overflow-tooltip
            :resizable="false"
            label="姓名"
          >
            <template slot-scope="scope">
              <span style="color: red" v-if="scope.row.infoMark == 1">*</span>
              <span style="margin-left: 10px">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
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
            <template slot-scope="scope">
              <div v-if="scope.row.number">
                <div
                  v-if="
                    scope.row.otherTel != '' ||
                    scope.row.officeTel != '' ||
                    scope.row.homeTel != '' ||
                    scope.row.otherTel2 != ''
                  "
                >
                  <el-dropdown
                    @command="handleCommand(scope.row)"
                    placement="bottom"
                    trigger="click"
                    @visible-change="changeDropdown"
                  >
                    <span class="el-dropdown-link">
                      {{ scope.row.number }}
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="a" v-if="scope.row.otherTel">
                        <div @mouseover="elDropdownItem(1)" class="dropdownDiv">
                          <span>手机2: {{ scope.row.otherTel }}</span>
                          <span
                            v-if="showSpanImg == 1"
                            style="
                              display: inline-block;
                              width: 13px;
                              padding-left: 30px;
                            "
                          >
                            <img
                              style="width: 100%; height: 100%"
                              src="/static/img/icon/dailCall.png"
                            />
                          </span>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item command="b" v-if="scope.row.officeTel">
                        <div @mouseover="elDropdownItem(2)" class="dropdownDiv">
                          <span>办公电话: {{ scope.row.officeTel }}</span>
                          <span
                            v-if="showSpanImg == 2"
                            style="
                              display: inline-block;
                              width: 13px;
                              padding-left: 30px;
                            "
                          >
                            <img
                              style="width: 100%; height: 100%"
                              src="/static/img/icon/dailCall.png"
                            />
                          </span>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item command="c" v-if="scope.row.homeTel">
                        <div @mouseover="elDropdownItem(3)" class="dropdownDiv">
                          <span>应急电话: {{ scope.row.homeTel }}</span>
                          <span
                            v-if="showSpanImg == 3"
                            style="
                              display: inline-block;
                              width: 13px;
                              padding-left: 30px;
                            "
                          >
                            <img
                              style="width: 100%; height: 100%"
                              src="/static/img/icon/dailCall.png"
                            />
                          </span>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item command="d" v-if="scope.row.otherTel2">
                        <div @mouseover="elDropdownItem(4)" class="dropdownDiv">
                          <span>其他电话: {{ scope.row.otherTel2 }}</span>
                          <span
                            v-if="showSpanImg == 4"
                            style="
                              display: inline-block;
                              width: 13px;
                              padding-left: 30px;
                            "
                          >
                            <img
                              style="width: 100%; height: 100%"
                              src="/static/img/icon/dailCall.png"
                            />
                          </span>
                        </div>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                <span v-else>{{ scope.row.number }}</span>
              </div>
              <span v-else>{{ scope.row.number }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px" align="center">
            <template slot-scope="scope">
              <el-tooltip
                v-if="manageVisible && !threeSidesVisible && !transferVisible"
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
                v-if="!manageVisible && !threeSidesVisible && !transferVisible"
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
                v-if="!manageVisible && !threeSidesVisible && !transferVisible"
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
              <el-tooltip
                class="item"
                effect="dark"
                v-if="manageVisible && !threeSidesVisible && !transferVisible"
                content="拨号"
                placement="top"
              >
                <i
                  class="el-icon-phone-outline"
                  @click="talkCall(scope.row)"
                  style="
                    font-size: 24px;
                    margin-left: 1vw;
                    color: #9fc8fe;
                    cursor: pointer;
                  "
                ></i>
              </el-tooltip>
              <!-- <el-tooltip class="item" effect="dark" content="设为常用联系人" placement="top"
                          v-if="!threeSidesVisible&&!transferVisible">
                <i
                  class="el-icon-star-on"
                  @click="handSetToCommon(scope.row)"
                  :style="{'font-size': '24px','margin-left': '1vw',cursor: 'pointer',color:scope.row.commonlyUsed==0?'#9FC8FE':'#FBC958'}"
                ></i>
              </el-tooltip> -->
              <el-tooltip
                class="item"
                effect="dark"
                content="三方"
                placement="top"
                v-if="threeSidesVisible"
              >
                <i
                  class="el-icon-circle-plus"
                  @click="busClickThree(scope)"
                  style="font-size: 24px; color: #9fc8fe; cursor: pointer"
                ></i>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="转接"
                placement="top"
                v-if="transferVisible"
              >
                <img
                  style="display: inline-block; width: 24px; cursor: pointer"
                  src="/static/img/icon/onDailCall.png"
                  @click="busClickTrans(scope)"
                />
              </el-tooltip>
              <!-- <el-button type="primary" size="mini" @click="addPhoneCall(scope.row)">添加</el-button>
              <el-button type="primary" size="mini" @click="talkCall(scope.row)">拨号</el-button>
              <el-button type="primary" size="mini" @click="handSetToCommon(scope.row)">设为常用</el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-pagination
            class="pagination"
            background
            :page-size="formData10.pageSize"
            :page-sizes="[10, 20, 30, 40]"
            :total="formData10.total"
            :current-page="formData10.currentPage"
            @current-change="handCurrentChange"
            @size-change="handSizeChange"
            layout="total, prev, pager, next, sizes, jumper"
          ></el-pagination>
        </el-row>
      </div>
    </div>
    <!-- 通讯录 -->
    <add-contact
      ref="addContact"
      v-if="addContactVisible"
      @changeDialog="addContactVisible = false"
    ></add-contact>
    <!--联系人弹窗-->
    <contact-details-popup
      ref="ContactDetailsPopup"
      :tabPosition="tabPosition"
      @getContactorList="refreshTable"
    ></contact-details-popup>
    <contact-sorting-popup
      ref="ContactSortingPopup"
      @getContactorList="getContactorList"
    ></contact-sorting-popup>
    <watch-contact-details ref="watchContactDetails"></watch-contact-details>
    <!-- Author hexinting
      @Date  2021-1-18
      @goal  针对openLab项目，删除逻辑修改,1.删除当前分组联系人 2.删除所有分组的该联系人
      @deleteBtnFlag 控制弹框的显示
     -->
    <el-dialog
      title="联系人删除提示"
      :visible.sync="deleteBtnFlag"
      width="25%"
      center
    >
      <span
        >该联系人在系统中存在分组、预案等关联数据,删除数据将不可恢复，请您确认相关操作!</span
      >
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteGroupOne"
          >从分组中删除</el-button
        >
        <el-button type="danger" @click="deleteGroupAll">彻底删除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixin from "./mixin.js";
import treeBtn from "@/yz_components/phoneNew/treeBtn";
import btnBox from "@/yz_components/phoneNew/btnBox";
import ContactDetailsPopup from "@/view/yz_integratedCommunication/contactDetailsPopup";
import watchContactDetails from "@/view/yz_integratedCommunication/watchContactDetails";
import ContactSortingPopup from "@/view/yz_integratedCommunication/contactSortingPopup";
import bus from "@/yz_components/common/js/eventBus";
import addContact from "./smsStep/addContact/AddContact";

import watchGroupDetails from "../../watchGroupDetails";
import editGroupDetails from "../../editGroupDetails";
import addGroupDetails from "../../addGroupDetails";
import { replaceContactorGroupsConfig } from "@/assets/js/yz_common.js";
import {
  faxGroupList,
  resourceGroupList,
} from "@/assets/interface/interface";

export default {
  mixins: [mixin],
  components: {
    treeBtn,
    btnBox,
    ContactDetailsPopup,
    watchContactDetails,
    ContactSortingPopup,
    addContact,

    watchGroupDetails,
    editGroupDetails,
    addGroupDetails,
  },
  data() {
    return {
      IsOpenLabProject: window.g.IsOpenLabProject, // openLab 项目
      checked: false,
      globalData: "", // 全局的本次选择的通讯录
      globalNode: "",
      IsYangZhouProject: window.g.IsYangZhouProject, // 扬州项目
      seletecdContacList: [], // 勾选的联系人列表
      seletecdContacIds: [], // 保存勾选的联系人id
      checkedGroupIds: [], // 保存勾选的分组id，用于导出联系人
      addContactVisible: false, //选择通讯录
      threeSidesVisible: false,
      transferVisible: false,
      treeBtnHoverIndex: -2,
      window: window,
      manageVisible: true, //图标管理功能切换
      formData1: {
        isCardMode: true,
        searchText: "", //搜索
        currentPage: 1,
        total: 0, //数据总数
        pageSize: window.g.IsZengChengProject ? 40 : 10, //总页数 bug 9359 增城定制化需求 author：何欣婷 date:2020-12-10
        rowData: null, //表格选择数据
        tableData: [], //表格数据
        myLoading: false,
        treeData: [],
        treeDataItem: {},
        filterTree: "", //树状列表输入框过滤
        tableMultipleSelection: [], //列表勾选的选项
        treeMultipleSelection: [], //树状分组勾选的选项
        groupId: "",
      },
      formData2: {
        isCardMode: true,
        //常用联系人
        searchText: "", //搜索
        currentPage: 1,
        total: 0, //数据总数
        pageSize: window.g.IsZengChengProject ? 40 : 10, //总页数 bug 9359 增城定制化需求 author：何欣婷 date:2020-12-10
        rowData: null, //表格选择数据
        tableData: [], //表格数据
        myLoading: false,
        treeData: [],
        treeDataItem: {},
        filterTree: "", //树状列表输入框过滤
        tableMultipleSelection: [], //列表勾选的选项
        treeMultipleSelection: [], //树状分组勾选的选项
        groupId: "",
      },
      formData3: {
        isCardMode: true,
        //最近联系人
        searchText: "", //搜索
        currentPage: 1,
        total: 0, //数据总数
        pageSize: window.g.IsZengChengProject ? 40 : 20, //总页数 bug 9359 增城定制化需求 author：何欣婷 date:2020-12-10
        rowData: null, //表格选择数据
        tableData: [], //表格数据
        myLoading: false,
        treeData: [],
        treeDataItem: {},
        filterTree: "", //树状列表输入框过滤
        tableMultipleSelection: [], //列表勾选的选项
        treeMultipleSelection: [], //树状分组勾选的选项
        groupId: "",
      },
      formData4: {
        isCardMode: true,
        //应急联络网
        searchText: "", //搜索
        currentPage: 1,
        total: 0, //数据总数
        pageSize: window.g.IsZengChengProject ? 40 : 10, //总页数 bug 9359 增城定制化需求 author：何欣婷 date:2020-12-10
        rowData: null, //表格选择数据
        tableData: [], //表格数据
        myLoading: false,
        treeData: [],
        treeDataItem: {},
        filterTree: "", //树状列表输入框过滤
        tableMultipleSelection: [], //列表勾选的选项
        treeMultipleSelection: [], //树状分组勾选的选项
        groupId: "",
      },
      formData5: {
        isCardMode: true,
        //基层联络网
        searchText: "", //搜索
        currentPage: 1,
        total: 0, //数据总数
        pageSize: window.g.IsZengChengProject ? 40 : 10, //总页数 bug 9359 增城定制化需求 author：何欣婷 date:2020-12-10
        rowData: null, //表格选择数据
        tableData: [], //表格数据
        myLoading: false,
        treeData: [],
        treeDataItem: {},
        filterTree: "", //树状列表输入框过滤
        tableMultipleSelection: [], //列表勾选的选项
        treeMultipleSelection: [], //树状分组勾选的选项
        groupId: "",
      },
      formData6: {
        isCardMode: true,
        //备勤联络网
        searchText: "", //搜索
        currentPage: 1,
        total: 0, //数据总数
        pageSize: window.g.IsZengChengProject ? 40 : 10, //总页数 bug 9359 增城定制化需求 author：何欣婷 date:2020-12-10
        rowData: null, //表格选择数据
        tableData: [], //表格数据
        myLoading: false,
        treeData: [],
        treeDataItem: {},
        filterTree: "", //树状列表输入框过滤
        tableMultipleSelection: [], //列表勾选的选项
        treeMultipleSelection: [], //树状分组勾选的选项
        groupId: "",
      },
      formData7: {
        isCardMode: true,
        //资源联络网
        searchText: "", //搜索
        currentPage: 1,
        total: 0, //数据总数
        pageSize: window.g.IsZengChengProject ? 40 : 10, //总页数 bug 9359 增城定制化需求 author：何欣婷 date:2020-12-10
        rowData: null, //表格选择数据
        tableData: [], //表格数据
        myLoading: false,
        treeData: [],
        treeDataItem: {},
        filterTree: "", //树状列表输入框过滤
        tableMultipleSelection: [], //列表勾选的选项
        treeMultipleSelection: [], //树状分组勾选的选项
        groupId: "",
      },
      formData8: {
        isCardMode: true,
        //工业园区管委会通讯录
        searchText: "", //搜索
        currentPage: 1,
        total: 0, //数据总数
        pageSize: window.g.IsZengChengProject ? 40 : 10, //总页数 bug 9359 增城定制化需求 author：何欣婷 date:2020-12-10
        rowData: null, //表格选择数据
        tableData: [], //表格数据
        myLoading: false,
        treeData: [],
        treeDataItem: {},
        filterTree: "", //树状列表输入框过滤
        tableMultipleSelection: [], //列表勾选的选项
        treeMultipleSelection: [], //树状分组勾选的选项
        groupId: "",
      },
      formData9: {
        isCardMode: true,
        //快捷联络网
        searchText: "", //搜索
        currentPage: 1,
        total: 0, //数据总数
        pageSize: window.g.IsZengChengProject ? 40 : 10, //总页数 bug 9359 增城定制化需求 author：何欣婷 date:2020-12-10
        rowData: null, //表格选择数据
        tableData: [], //表格数据
        myLoading: false,
        treeData: [],
        treeDataItem: {},
        filterTree: "", //树状列表输入框过滤
        tableMultipleSelection: [], //列表勾选的选项
        treeMultipleSelection: [], //树状分组勾选的选项
        groupId: "",
      },
      formData10: {
        isCardMode: true,
        //电话快捷组
        searchText: "", //搜索
        currentPage: 1,
        total: 0, //数据总数
        pageSize: window.g.IsZengChengProject ? 40 : 10, //总页数 bug 9359 增城定制化需求 author：何欣婷 date:2020-12-10
        rowData: null, //表格选择数据
        tableData: [], //表格数据
        myLoading: false,
        treeData: [],
        treeDataItem: {},
        filterTree: "", //树状列表输入框过滤
        tableMultipleSelection: [], //列表勾选的选项
        treeMultipleSelection: [], //树状分组勾选的选项
        groupId: "",
      },
      searchText: "",
      rowData: [], //行表格数据
      btnArry: [
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
        {
          event: "document",
          icon: "el-icon-document",
          title: "模板",
        },
        {
          event: "download",
          icon: "el-icon-download",
          title: "导出联系人",
        },
        {
          event: "sort",
          icon: "el-icon-sort",
          title: "排序",
        },
      ],
      btnArry1: [
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
      faxBtnList: [
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
          title: "删除",
        },
      ],
      dialogVisible: true,
      // 通讯大分组名字设为可配置状态，扬州定制的分组先注释 date:2020-11-05 author:hexinting
      // formData: {
      //   pid: 0,
      //   code: "phone",
      //   ref: "phone",
      //   name: window.g.IsYangZhouProject ? "政务通信录" : "政务联络网"
      // },
      formData: {
        pid: 0,
        code: "phone",
        ref: "phone",
        name: "政务联络网",
      },
      treeBtnConfig: {
        pid: 0,
        code: "gliaison",
        ref: "phone",
        name: "基层联络网",
      },
      treeBtnConfig1: {
        pid: 0,
        code: "dutyGroup",
        ref: "phone",
        name: "备勤联络网",
      },
      treeBtnConfig2: {
        pid: 0,
        code: "resource",
        ref: "phone",
        name: "资源通讯录",
      },
      treeBtnConfig3: {
        pid: 0,
        code: "quick",
        ref: "phone",
        name: "快捷联络网",
      },
      // 通讯大分组名字设为可配置状态，扬州定制的分组先注释 date:2020-11-05 author:hexinting
      // treeBtnConfig4: {
      //   pid: 0,
      //   code: "phoneQuick",
      //   ref: "phone",
      //   name: window.g.IsYangZhouProject ? "常用联系人" : "电话快捷组"
      // },
      treeBtnConfig4: {
        pid: 0,
        code: "phoneQuick",
        ref: "phone",
        name: "电话快捷组",
      },
      treeDataItem: {},
      currentPage: 1, //当前页数
      groupId: -1, // 分组id
      // 通讯大分组名字设为可配置状态，扬州定制的分组先注释 date:2020-11-05 author:hexinting
      // tabName: window.g.IsYangZhouProject ? "政务通信录" : "政务联络网", // 标签名称
      tabName: "phone", // 标签名称 政务联络网
      defaultProps: {
        children: "children",
        label: "name",
        plusIcon: true,
      },
      myLoading: false,
      treeData: [], //电话快捷组
      list: [
        {
          //按钮切换
          // name: window.g.IsYangZhouProject ? "政务通信录" : "政务联络网",
          name: "政务联络网",
          label: "1",
          code: "phone",
          enabled: true, // 是否显示
        },
        // {
        //   name: "常用联系人",
        //   label: "2",
        //   code: "commonlyused",
        //   enabled:true
        // },
        // {
        //   name: "最近联系人",
        //   label: "3",
        //   code: "recentcontact",
        //   enabled:true
        // },
        {
          // name: window.g.IsYangZhouProject ? "应急通信录" : "应急联动网",
          name: "应急联动网",
          label: "4",
          code: "linkage",
          enabled: true, // 是否显示
        },
        // window.g.IsYangZhouProject ? null : {
        //   name: "基层联络网",
        //   label: "5"
        // },
        // window.g.IsYangZhouProject ? null : {
        //   name: "备勤联络网",
        //   label: "6"
        // },
        // window.g.IsYangZhouProject ? null : {
        //   name: "资源联络网",
        //   label: "7"
        // },
        {
          name: "基层联络网",
          label: "5",
          code: "gliaison",
          enabled: true, // 是否显示
        },
        {
          name: "备勤联络网",
          label: "6",
          code: "dutyGroup",
          enabled: true, // 是否显示
        },
        {
          name: "资源联络网",
          label: "7",
          code: "resource",
          enabled: true, // 是否显示
        },
        // {
        //   name: "快捷联络网",
        //   label: "9"",
        //   code: "quick",
        //   enabled: true // 是否显示
        // },
        {
          // name: window.g.IsYangZhouProject ? "常用联系人" : "电话快捷组",
          name: "电话快捷组",
          label: "10",
          code: "phoneQuick",
          enabled: true, // 是否显示
        },
        window.g.IsSuZhouPorject
          ? {
              name: "工业园区管委会通讯录",
              label: "8",
              code: "suzhouGroup",
              enabled: true, // 是否显示
            }
          : null,
      ],
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
      tableColumn1: [
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
          prop: "direct",
          label: "状态",
        },
        {
          prop: "startTime",
          label: "通话时间",
        },
      ], //表头
      tabPosition: 1,
      tableData: [], //表格数据
      total: 0, //数据总数
      pageSize: 10, //总页数
      isExpand: false,
      showSpanImg: 0,
      childrenlist: [], //拖动排序后的数组ID

      editGroupDetailsVisible: false,
      groupDetailsNode: {},
      groupDetailsData: {},
      treeDataProp: [],

      addGroupDetailsVisible: false,

      relGroup: "",
      contactList: [
        {
          i: 0,
          name: "常用联系人",
          icon: "el-icon-star-off",
          code: "commonlyused",
        },
        {
          i: 1,
          name: "最近联系人",
          icon: "el-icon-time",
          code: "recentcontact",
        },
      ],
      deleteBtnFlag: false, // 控制删除对话框显示/隐藏
      deleteMoreorOne: "", // 打开的是删除单个的还是删除多个的 more多个，one一个
    };
  },
  created() {
    this.getPhoneGroupingTree();
    this.getContactorList();
    // bug8415 author:hexinting date:2020-11-12
    // 3.0不要这个方法了
    // if (sessionStorage.getItem("contactorGroups")) {
    //   this.initContactorGroupsConfig(); // 初始化分组配置
    // } else {
    // this.contactorGroupsFromDictionary();
    // }
  },
  mounted() {
    let _this = this;
    bus.$on("threeSidesChange", function () {
      _this.threeSidesVisible = true;
    });
    bus.$on("transferChange", function () {
      _this.transferVisible = true;
    });

    bus.$off("getPhoneContact");
    bus.$on("getPhoneContact", (checkData) => {
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
  computed: {},
  watch: {},
  methods: {
    onCheckCard(item, index) {
      this["formData" + this.tabPosition].tableData.splice(index, 1, item);
      if (item.checked && this.seletecdContacList.length == 0) {
        this.seletecdContacList.push(item);
        this[
          "formData" + this.tabPosition
        ].tableMultipleSelection = this.seletecdContacList;
      } else {
        var containerResult = this.seletecdContacList.filter(
          (seletecdContacListItem) => {
            return seletecdContacListItem.id == item.id;
          }
        );
        if (item.checked) {
          containerResult.length == 0 && this.seletecdContacList.push(item);
        } else {
          containerResult.length != 0 &&
            this.seletecdContacList.splice(index, 1);
        }
        this[
          "formData" + this.tabPosition
        ].tableMultipleSelection = this.seletecdContacList;
      }
    },
    /**
     * @author hexinting
     * @date 2020-11-12
     * @lastEditor hexinting
     * @lastDate 2020-11-12
     * @description 登录成功后获取融合通讯分组
     */
    contactorGroupsFromDictionary() {
      this.$api.contactorGroupsFromDictionary().then((res) => {
        if (res.errorcode === 0) {
          sessionStorage.setItem("contactorGroups", JSON.stringify(res.data));
          this.initContactorGroupsConfig();
        }
        console.log("获取融合通讯分组", res);
      });
    },
    /**
     * @author hexinting
     * @date 2020-10-14
     * @lastEditor hexinting
     * @lastDate 2020-10-14
     * @description 初始化分组配置
     */
    initContactorGroupsConfig() {
      let contactorGroups = JSON.parse(
        sessionStorage.getItem("contactorGroups")
      ); // 后端返回的分组配置列表
      this.list = replaceContactorGroupsConfig(this.list); // 根据后端返回分组，替换联系人大分组名字配置
      this.list.forEach((item) => {
        if (item) {
          if (item.code === "phone") {
            // 政务联络网
            this.formData.name = item.name;
          } else if (item.code === "gliaison") {
            // 基层联络网
            this.treeBtnConfig.name = item.name;
          } else if (item.code === "dutyGroup") {
            // 备勤联络网
            this.treeBtnConfig1.name = item.name;
          } else if (item.code === "resource") {
            // 资源通讯录
            this.treeBtnConfig2.name = item.name;
          } else if (item.code === "quick") {
            // 快捷联络网
            this.treeBtnConfig3.name = item.name;
          } else if (item.code === "phoneQuick") {
            // 电话快捷组
            this.treeBtnConfig4.name = item.name;
          }
        }
      });
      // 常用联系人、最近联系人
      this.contactList.forEach((item) => {
        if (item) {
          let _index = contactorGroups.findIndex((el) => el.code === item.code); // 根据code查找大分组名字
          if (_index !== -1) {
            // 存在
            item.name = contactorGroups[_index].name; // 替换名字
          }
        }
      });
    },
    watchContactDetails(row) {
      this.$refs.watchContactDetails.isDialogVisible = true;
      this.$refs.watchContactDetails.title = "查看联系人";
      this.$refs.watchContactDetails.getTree(
        this.tabPosition,
        this.groupId,
        this.tabName
      );

      this.$refs.watchContactDetails.showData(row);
    },
    busClickThree(scope) {
      bus.$emit("threeSidesData", {
        number: scope.row.number,
      });
      this.threeSidesVisible = false;
    },
    busClickTrans(scope) {
      bus.$emit("transferData", {
        number: scope.row.number,
      });
      this.transferVisible = false;
    },

    handleSelectionChange(val) {
      console.log("列表选中了什么", val);
      this["formData" + this.tabPosition].tableMultipleSelection = val;
      this.seletecdContacList = val;
    },
    // 无限递归获取数据
    recursion(data, array) {
      if (data.length != 0) {
        data.forEach((ele) => {
          if (ele.children) {
            array.push(ele.id);
            this.recursion(ele.children, array);
          }
        });
      } else {
        return;
      }
    },
    handleCheckChange(data, checked, indeterminate) {
      if (this.tabPosition == 2 || this.tabPosition == 3) {
        this.tabPosition = 1;
      }
      console.log("树状分组选中了什么", data, checked, indeterminate);
      let arrs = [];
      if (checked) {
        arrs.push(data.id);
        this.recursion(data.children, arrs);
        console.log(arrs);
      }
      let key = `formData${this.tabPosition}`;
      if (checked) {
        this[key].treeMultipleSelection.push(data);
      } else {
        this[key].treeMultipleSelection = this[
          key
        ].treeMultipleSelection.filter((elem) => elem.id !== data.id);
      }
    },
    changeDropdown() {
      this.showSpanImg = 0;
    },
    elDropdownItem(key) {
      this.showSpanImg = key;
    },
    handleCommand(row) {
      // 1>=手机2 row.otherTel  2>=办公电话 row.officeTel  3>=应急电话 row.homeTel 4>=其他电话 row.otherTel2
      let phoneList = ["otherTel", "officeTel", "homeTel", "otherTel2"];
      let number = [1, 2, 3, 4].includes(this.showSpanImg)
        ? row[phoneList[this.showSpanImg - 1]]
        : "";
      if (!number) {
        return;
      }
      this.talkCall({ number: number });
    },
    gliaisonGroupList() {
      let data = {
        displayDefault: true, //是否显示未分组联系人
      };
      this.$api.gliaisonGroupList(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message.error(res.msg);
          return;
        }
        this["formData" + this.tabPosition].treeData = res.data || [];
      });
    },
    dutyGroupList() {
      let data = { displayDefault: true };
      this.$api.dutyGroupList(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message.error(res.msg);
          return;
        }
        this["formData" + this.tabPosition].treeData = res.data || [];
      });
    },
    refreshTable() {
      console.log("-------", this.tabPosition);
      if (this.tabPosition == 1) {
        this.getContactorList();
      } else if (this.tabPosition === 2) {
        this.getDataAl();
      } else if (this.tabPosition === 3) {
        this.getDataRecent();
      } else if (this.tabPosition === 4) {
        this.getEmergencyAddressData();
      } else if (this.tabPosition === 5) {
        this.getContactorList();
      } else if (this.tabPosition === 6) {
        this.getContactorList();
      } else if (this.tabPosition === 7) {
        this.getContactorList();
      } else if (this.tabPosition === 8) {
        this.getContactorList();
      } else if (this.tabPosition === 9) {
        this.getContactorList();
      } else if (this.tabPosition === 10) {
        this.getContactorList();
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      console.log(data.name);
      return data.name.indexOf(value) !== -1;
    },
    /**
     * @lastEditor hexinting
     * @lastDate 2020-11-5
     * @description
     */
    handleBatchJoin() {
      let array = [
        // 通讯大分组名字设为可配置状态，扬州定制的分组先注释 date:2020-11-05 author:hexinting
        // {tabPosition: 1, value: 'governmentAffairs', remark: this.IsYangZhouProject ? "政务通信录" : "政务联络网"},
        { tabPosition: 1, value: "governmentAffairs", remark: "政务联络网" },
        { tabPosition: 5, value: "primaryLevel", remark: "基层联络网" },
        { tabPosition: 6, value: "spareTime", remark: "备勤联络网" },
        { tabPosition: 7, value: "resource", remark: "资源通讯录" },
        { tabPosition: 8, value: "suzhou", remark: "工业园区管委会通讯录" },
        { tabPosition: 9, value: "quick", remark: "快捷联络网" },
        { tabPosition: 10, value: "phoneQuick", remark: "电话快捷组" },
        // {tabPosition: 10, value: 'phoneQuick', remark: this.IsYangZhouProject ? '常用联系人' : '电话快捷组'}
      ];
      let item = array.find((m) => m.tabPosition === this.tabPosition);
      if (item) {
        this.$store.commit("setGroupType", item.value);
        let groupId = this[`formData${this.tabPosition}`].groupId || 0;
        this.$store.commit("setGroupId", groupId);
      }
      // this.refreshData()
    },
    // 导入联系人成功回调
    batchJoinSuccess() {
      this.refreshData();
    },
    /**
     * @lastEditor hexinting
     * @lastDate 2020-11-5
     * @description 分组切换
     * @lastEditorReason 通讯大分组名字设为可配置状态，扬州定制的分组先注释 date:2020-11-05 author:hexinting
     */
    changePage() {
      this.globalData = {};
      this.globalNode = {};
      this.groupId = -1;
      this.manageVisible = true;
      this["formData" + this.tabPosition] = {
        isCardMode: true,
        //常用联系人
        searchText: "", //搜索
        currentPage: 1,
        total: 0, //数据总数
        pageSize: window.g.IsZengChengProject ? 40 : 10, //总页数 bug 9359 增城定制化需求 author：何欣婷 date:2020-12-10
        rowData: null, //表格选择数据
        tableData: [], //表格数据
        myLoading: false,
        treeData: [],
        treeDataItem: {},
        filterTree: "",
        tableMultipleSelection: [], //列表勾选的选项
        treeMultipleSelection: [], //树状分组勾选的选项
      };
      console.log(this.tabPosition);

      if (this.tabPosition == 1) {
        this.getPhoneGroupingTree(1);
        this.tabName = "phone";
        // this.tabName = this.IsYangZhouProject ? "政务通信录" : "政务联络网";
      } else if (this.tabPosition == 2) {
        this.getDataAl();
        this.tabName = "commonlyused";
        // this.tabName = "常用联系人";
      } else if (this.tabPosition == 3) {
        this.getDataRecent();
        this.tabName = "recentcontact";
        // this.tabName = "最近联系人";
      } else if (this.tabPosition == 4) {
        this.getEmergencyAddressBookTree();
        this.tabName = "linkage";
        // this.tabName = "应急联动网";
        // this.tabName = this.IsYangZhouProject ? "应急通信录" : "应急联动网";
      } else if (this.tabPosition == 5) {
        this.gliaisonGroupList();
        this.tabName = "gliaison";
        // this.tabName = "基层联络网";
      } else if (this.tabPosition == 6) {
        this.dutyGroupList();
        this.tabName = "dutyGroup";
        // this.tabName = "备勤联络网";
      } else if (this.tabPosition == 7) {
        this.getResourceGroupingTree(7);
        this.tabName = "resource";
        // this.tabName = "资源联络网";
      } else if (this.tabPosition === 8) {
        this.getSuzhouGroupList();
        this.tabName = "suzhouGroup";
        // this.tabName = "工业园区管委会通讯录";
      } else if (this.tabPosition === 9) {
        this.getShortcutGroupData();
        this.tabName = "quick";
        // this.tabName = "快捷联络网";
      } else if (this.tabPosition === 10) {
        this.getPhoneQuick();
        this.tabName = "phoneQuick";
        // this.tabName = this.IsYangZhouProject ? '常用联系人' : '电话快捷组';
        // this.tabName = "电话快捷组";
      }
      setTimeout(() => {
        this.refreshTable(); // 修复禅道7057 author:hexinting date:2020-9-27
      }, 500);
    },
    //应急通讯录架构树
    getEmergencyAddressBookTree() {
      let data = {
        id: 0,
      };
      let CallbackReload = this;

      this.$api
        .getBriefsByClassId(data, CallbackReload)
        .then((result) => {
          this.formData4.myLoading = false;
          if (result) {
            this.formData4.treeData = [];
            for (let n in result.data) {
              this.formData4.treeData.push({
                id: result.data[n].id,
                name: result.data[n].name + "通讯录",
                versionId: result.data[n].versionId,
                children: [],
              });
              let data = {
                id: result.data[n].versionId,
              };
              this.$api.getStructTree(data, this).then((res) => {
                this.formData4.treeData[n].children = res.data;
              });
              console.log("应急联动网", this.formData4.treeData);
            }
            // 默认选择第一个分组 禅道7050 author:hexinting date:2020-9-27
            this.formData4.isTop = true; // 默认是一级分组
            this.formData4.treeDataItem.groupId = this.formData4.treeData[0].id;
            console.log("应急联动网id", this.formData4.treeDataItem.groupId);
          }
        })
        .catch((err) => {
          this.formData4.myLoading = false;
        });
    },
    //获取工业园区管委会树状分组
    getSuzhouGroupList() {
      this.$http({
        url: window.g.ApiUrl + "/eos/communication/group/suzhouGroupLIst",
        method: "post",
        data: {},
      }).then(({ data }) => {
        console.log("/eos/communication/group/suzhouGroupLIst", data);
        this.formData8.treeData = data.data;
      });
    },
    //获取应急通讯录联系人
    getEmergencyAddressData() {
      console.log(
        "this.formData4.treeDataItem this.formData4",
        this.formData4.treeDataItem,
        this.formData4
      );
      let data = {
        searchText: this.formData4.searchText,
        id: this.formData4.treeDataItem.groupId,
        page: this.formData4.currentPage,
        size: this.formData4.pageSize,
        isTop: this.formData4.isTop,
        type: "phone",
      };
      if (this.formData4.treeDataItem.groupId) {
        data.id = this.formData4.treeDataItem.groupId;
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
        console.log(res.data.totalElements);
        console.log(res.data.data);
        this.formData4.tableData =
          res.data.data.map((item) => {
            item.checked = false;
            return item;
          }) || [];
        this.formData4.total = res.data.totalElements || 0;
      });
    },
    //获取最近联系人
    getDataRecent() {
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
          this.formData3.tableData =
            res.data.data.map((item) => {
              item.checked = false;
              return item;
            }) || [];
          this.formData3.total = res.data.totalElements;
        }, 500);
      });
    },
    //获取常用联系人
    getDataAl() {
      let data = {
        searchText: this.formData2.searchText,
        page: this.formData2.currentPage,
        size: this.formData2.pageSize,
        type: "phone",
      };
      this.$api.commonContactorList(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            error: "error",
          });
          return;
        }
        this.formData2.tableData =
          res.data.data.map((item) => {
            item.checked = false;
            return item;
          }) || [];
        this.formData2.total = res.data.totalElements || 0;
      });
    },
    //获取电话快捷组
    getPhoneQuick() {
      let data = {
        displayDefault: true,
      };
      this.$api.phoneQuickGroupList(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        this.formData10.treeData = res.data || [];
        this["formData" + this.tabPosition].treeData = res.data || [];
      });
      /*this.$http({
          url: window.g.ApiUrl + "/eos/communication/group/phoneQuickGroupList",
          headers:{'Authorization':sessionStorage.getItem("machineId")},
          method: "post",
          data: {
            displayDefault: true
          }
        }).then(({data}) => {
          console.log("/eos/communication/group/phoneQuickGroupList", data);
          this.formData10.treeData = data.data
          this["formData" + this.tabPosition].treeData = data.data || [];
        });
        // getShortcutGroupData();*/
    },
    //搜索
    handleSearch() {
      this["formData" + this.tabPosition].currentPage = 1; //点击搜索就从0页开始查询
      this["formData" + this.tabPosition].groupId = "";
      if (this.tabPosition == 1) {
        this.getContactorList("search");
      } else if (this.tabPosition == 2) {
        this.getDataAl();
      } else if (this.tabPosition == 3) {
        this.getDataRecent();
      } else if (this.tabPosition == 4) {
        this.getEmergencyAddressData();
      } else if (this.tabPosition == 5) {
        this.getContactorList(5);
      } else if (this.tabPosition == 6) {
        this.getContactorList(6);
      } else if (this.tabPosition == 7) {
        this.getContactorList(7);
      } else if (this.tabPosition === 8) {
        this.getContactorList(8);
      } else if (this.tabPosition === 9) {
        this.getContactorList(9);
      } else if (this.tabPosition === 10) {
        this.getContactorList(10);
      }
    },
    //新增
    addList() {
      this.$nextTick(() => {
        this.$refs.ContactDetailsPopup.isDialogVisible = true;
        this.$refs.ContactDetailsPopup.title = "新增联系人";
        this.$refs.ContactDetailsPopup.getTree(
          this.tabPosition,
          this.groupId,
          this.tabName
        );
      });
    },
    //修改方法
    handleEdit() {
      let key = `formData${this.tabPosition}`;
      if (!this[key].rowData) {
        this.$message.warning("请选中表格中任意行或双击任意行进行修改!");
        return;
      }

      this.handleRowDbClick(this[key].rowData);
    },
    /**
     * @author hexinting
     * @date 2021-1-22
     * @param {String} ids 联系人id
     * @param {String} groupId 联系人分组id
     * @param {String} deleteMoreorOne one的时候点开的是联系人后面的单选删除,more的时候是多选的删除
     * @param {Array} seletecdContacList 勾选中的联系人所有信息
     * @param {String} seletecdContacIds 处理好的联系人id
     * @description 删除分组关系联系人
     */
    deleteGroupOne() {
      let key = `formData${this.tabPosition}`;
      console.log(this[key]);
      if (this.deleteMoreorOne == "one") {
        console.log("分组中删除");
        // 未分组联系人只能彻底删除,因为未分组
        if (this[key].rowData.groupId <= 0) {
          this.$message.error("未分组联系人没有分组关系只能彻底删除");
          return;
        }
        let data = {
          groupId: this[key].rowData.groupId,
          ids: [this[key].rowData.id],
        };
        this.$api.deleteContactorGroupRelLower(data).then((res) => {
          if (res.errorcode !== 0) {
            this.$message.error(res.msg);
            this.deleteBtnFlag = false;
            return;
          }
          this.$message.success("删除成功!");
          this.getContactorList(this.tabPosition === 5);
          this.deleteBtnFlag = false;
        });
      }
      if (this.deleteMoreorOne == "more") {
        // 处理联系人id
        this.seletecdContacIds = [];
        if (this.seletecdContacList.length >= 1) {
          this.seletecdContacList.map((ele) => {
            this.seletecdContacIds.push(ele.id);
          });
        }
        let data = {
          groupId: this[key].groupId,
          ids: this.seletecdContacIds,
        };
        this.$api.deleteContactorGroupRelLower(data).then((res) => {
          if (res.errorcode !== 0) {
            this.$message.error(res.msg);
            this.deleteBtnFlag = false;
            return;
          }
          this.$message.success("删除成功!");
          this.getContactorList(this.tabPosition === 5);
          this.deleteBtnFlag = false;
        });
      }
    },
    /**
     * @author hexinting
     * @date 2021-1-18
     * @param {String} deleteMoreorOne one的时候点开的是联系人后面的单选删除,more的时候是多选的删除
     * @description 彻底删除联系人
     */
    deleteGroupAll() {
      console.log("彻底删除");
      let key = `formData${this.tabPosition}`;
      if (this.deleteMoreorOne == "one") {
        console.log(this[key].rowData.id);
        let data = {
          data: { id: this[key].rowData.id },
          operate: 2,
        };
        this.$api.updateConcator(data).then((res) => {
          if (res.errorcode !== 0) {
            this.$message.error(res.msg);
            this.deleteBtnFlag = false;
            return;
          }
          this.$message.success("删除成功!");
          this.getContactorList(this.tabPosition === 5);
          this.deleteBtnFlag = false;
        });
      }
      if (this.deleteMoreorOne == "more") {
        this.$http({
          url: `${window.g.ApiUrl}/eos/communication/contactor/deleteContactor`,
          method: "post",
          data: {
            ids: this[key].tableMultipleSelection.map((elem) => elem.id),
          },
        }).then(({ data }) => {
          console.log("/eos/communication/contactor/deleteContactor", data);
          if (data.errorcode !== 0) {
            this.$message.error(data.msg);
            return;
          }
          this.$message.success("删除成功!");
          this.deleteBtnFlag = false;
          if ([1, 5, 6, 7, 8, 9, 10].includes(this.tabPosition)) {
            this.getContactorList(this.tabPosition === 5);
          }
        });
      }
    },
    /**
     * @lastEditor hexinting
     * @date 2021-1-18
     * @description 删除单个列表选项
     */
    handleDeleteItem() {
      let key = `formData${this.tabPosition}`;
      if ([1, 5, 6, 7, 8, 9, 10].includes(this.tabPosition)) {
        if (!this[key].rowData) {
          this.$message.warning("请选中表格中任意行进行删除!");
          return;
        }
        // openLab项目 删除逻辑修改，删除前提示是“删除当前分组联系人” 还是“删除所有分组的该联系人”
        if (this.IsOpenLabProject) {
          this.deleteBtnFlag = true;
          this.deleteMoreorOne = "one";
          return false;
        }

        let data = {
          data: { id: this[key].rowData.id },
          operate: 2,
        };
        this.$confirm("删除当前信息?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$api.updateConcator(data).then((res) => {
              if (res.errorcode !== 0) {
                this.$message.error(res.msg);
                return;
              }
              this.$message.success("删除成功!");
              this.getContactorList(this.tabPosition === 5);
            });
          })
          .catch(() => {
            this.$message.info("已取消删除!");
          });
      }
      if (this.tabPosition === 2) {
        if (!this.formData2.rowData) {
          this.$message.warning("请选中表格中任意行进行取消收藏!");
          return;
        }
        let data = {
          contactorId: this.formData2.rowData.id,
        };
        this.$confirm("是否将该联系人从常用联系人中移出", "移出常用联系人", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$api.removeCommonContactor(data).then((res) => {
              if (res.errorcode !== 0) {
                this.$message.error(res.msg);
                return;
              }
              this.$message.success("移出成功!");
              this.getDataAl();
            });
          })
          .catch(() => {
            this.$message.info("已取消!");
          });
      }
    },
    /**
     * @lastEditor hexinting
     * @date 2021-1-18
     * @description 批量删除多个列表选项
     */
    handleDelete() {
      let key = `formData${this.tabPosition}`;
      if ([1, 5, 6, 7, 8, 9, 10].includes(this.tabPosition)) {
        if (this[key].tableMultipleSelection.length === 0) {
          this.$message.warning("请勾选表格中任一行进行删除!");
          return;
        }
        // openLab项目 删除逻辑修改，删除前提示是“删除当前分组联系人” 还是“删除所有分组的该联系人”
        if (this.IsOpenLabProject) {
          this.deleteBtnFlag = true;
          this.deleteMoreorOne = "more";
          return false;
        }

        this.$confirm("删除当前信息?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$http({
              url: `${window.g.ApiUrl}/eos/communication/contactor/deleteContactor`,
              method: "post",
              data: {
                ids: this[key].tableMultipleSelection.map((elem) => elem.id),
              },
            }).then(({ data }) => {
              console.log("/eos/communication/contactor/deleteContactor", data);
              if (data.errorcode !== 0) {
                this.$message.error(data.msg);
                return;
              }
              this.$message.success("删除成功!");
              if ([1, 5, 6, 7, 8, 9, 10].includes(this.tabPosition)) {
                this.getContactorList(this.tabPosition === 5);
              }
            });
          })
          .catch(() => {
            this.$message.info("已取消删除!");
          });
      }
      if (this.tabPosition === 2) {
        if (this.formData2.tableMultipleSelection.length === 0) {
          this.$message.warning("请选中表格中任一行进行删除!");
          return;
        }
        this.$confirm("删除当前信息?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$http({
              url: `${window.g.ApiUrl}/eos/communication/contactor/batchRemoveCommonContactor`,
              method: "post",
              data: {
                contactorIds: this[key].tableMultipleSelection.map(
                  (elem) => elem.id
                ),
              },
            }).then(({ data }) => {
              console.log(
                "/eos/communication/contactor/batchRemoveCommonContactor",
                data
              );
              if (data.errorcode !== 0) {
                this.$message.error(data.msg);
                return;
              }
              this.$message.success("删除成功!");
              this.getDataAl();
            });
          })
          .catch(() => {
            this.$message.info("已取消删除!");
          });
      }
    },
    // 选择联系人
    handleSelectContactor() {
      this.addContactVisible = true;
      this.$nextTick(() => {
        this.$refs.addContact.getDataList("getPhoneContact", this.smsMember);
        console.log("this.smsMember: ", this.smsMember);
      });
      this.$store.commit("setSmsOrFax", "phone");
    },
    //排序方法
    handleSort() {
      this.$nextTick(() => {
        this.$refs.ContactSortingPopup.isDialogVisible = true;
        this.$refs.ContactSortingPopup.getTree();
        if (this.globalData !== "")
          // 刚进入页面全局data为空，如果不加判断会把联系树全部列到右边，但所有联系树不是一个组，列出来会意义不明。故加这句
          this.$refs.ContactSortingPopup.handleNodeClick(this.globalData, ""); //获取当前选择的id的联系人数据
      });
    },
    /* 选中复选框时的方法
        @author xry
        @checkedGroupIds 勾选的所有id
        @tabPosition     所在的tab页id
       */
    handleCheck(node, checked) {
      console.log("选中复选框", node, checked);
      this.checkedGroupIds = checked.checkedKeys;
      console.log(
        "导出联系人的分组id：",
        this.checkedGroupIds,
        this.tabPosition
      );
      // 获取复选框分组id给子组件
      switch (this.tabPosition) {
        case 1:
          this.$refs.treeBtn1.getGroupIds(this.checkedGroupIds);
          break;
        case 5:
          this.$refs.treeBtn5.getGroupIds(this.checkedGroupIds);
          break;
        case 6:
          this.$refs.treeBtn6.getGroupIds(this.checkedGroupIds);
          break;
        case 7:
          this.$refs.treeBtn7.getGroupIds(this.checkedGroupIds);
          break;
        case 9:
          this.$refs.treeBtn9.getGroupIds(this.checkedGroupIds);
          break;
        case 10:
          this.$refs.treeBtn10.getGroupIds(this.checkedGroupIds);
          break;
      }
    },
    /* 导出联系人
        @Author xry
        @groupId 不是打勾，而是选中的分组id
        @seletecdContacList 勾选中的联系人所有信息
        @seletecdContacIds 处理好的联系人id
      */
    handleExportContactor() {
      let key = `formData${this.tabPosition}`;
      console.log(this[key].groupId);
      console.log(this.seletecdContacList);
      // 2020-9-14修改接口后groupId为非必填项
      // if (!this[key].groupId) {
      //         this.$message.warning('请先选择一个分组');
      //         return;
      //     }
      if (this.seletecdContacList.length == 0) {
        this.$message.warning("请先选择联系人");
        return;
      }
      console.log(this[key].groupId); // 最后一个点击分组的id,和复选框勾选无关 :导出联系人需要
      // 处理联系人id
      this.seletecdContacIds = [];
      if (this.seletecdContacList.length >= 1) {
        this.seletecdContacList.map((ele) => {
          this.seletecdContacIds.push(ele.id);
        });
      }
      console.log(this.seletecdContacIds);
      // 1.原方法
      // window.location.href = `${window.g.ApiUrl}/eos/communication/contactor/export?groupIds=${this[key].groupId}&contactorIds=${this.seletecdContacIds}`;
      // 2.携带验证的方法
      let exportURL = this[key].groupId
        ? `${window.g.ApiUrl}/eos/communication/contactor/export?groupIds=${this[key].groupId}&contactorIds=${this.seletecdContacIds}`
        : `${window.g.ApiUrl}/eos/communication/contactor/export?contactorIds=${this.seletecdContacIds}`;
      // let exportURL = `${window.g.ApiUrl}/eos/communication/contactor/export?groupIds=${this[key].groupId}&contactorIds=${this.seletecdContacIds}`
      var xhr = new XMLHttpRequest();
      xhr.open("GET", exportURL, true);
      xhr.withCredentials = true;
      xhr.responseType = "blob"; // 返回类型blob
      let token = localStorage.getItem("token");
      if (token == null) {
        token = "";
      }
      xhr.setRequestHeader("Authorization", token);
      // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
      xhr.onload = function () {
        // 请求完成
        if (this.status === 200) {
          // 返回200
          var blob = this.response;
          var reader = new FileReader();
          reader.readAsDataURL(blob); // 转换为base64，可以直接放入a标签href
          reader.onload = function (e) {
            // 转换完成，创建一个a标签用于下载
            var a = document.createElement("a");
            a.download = "联系人表.xlsx";
            a.setAttribute("target", "_blank");
            a.setAttribute("target", "_self");
            a.href = e.target.result;
            document.body.append(a); // 修复firefox中无法触发click
            console.log(a);
            a.click();
            // document.body.remove(a);
          };
        }
      };
      xhr.send();
    },
    //表格行点击方法
    handleRowClick(row) {
      this["formData" + this.tabPosition].rowData = row;
      this.$emit("findCall", row.id);
    },
    //双击修改
    handleRowDbClick(row) {
      this.$nextTick(() => {
        this.$refs.ContactDetailsPopup.isDialogVisible = true;
        this.$refs.ContactDetailsPopup.title = "修改联系人";
        this.$refs.ContactDetailsPopup.getTree(this.tabPosition);
        this.$refs.ContactDetailsPopup.showData(row);
      });
    },
    // closeDialog(key) {
    //   this.$emit("closeDialog", key);
    // },
    closeDialog(key) {
      switch (this.tabPosition) {
        case 1:
          this.treeDataProp = this.formData1.treeData;
          break;
        case 5:
          this.treeDataProp = this.formData5.treeData;
          break;
        case 6:
          this.treeDataProp = this.formData6.treeData;
          break;
        case 7:
          this.treeDataProp = this.formData7.treeData;
          break;
        case 10:
          this.treeDataProp = this.formData10.treeData;
          break;
        default:
          this.treeDataProp = this.formData1.treeData;
          break;
      }
      this.addGroupDetailsVisible = true;
    },

    handleNodeClick(data, node) {
      this.globalData = data; //把局部data赋给全局data，以便保持本次点击的结点id
      this.globalNode = node;
      this.$refs.ContactSortingPopup.handleNodeClick(this.globalData, node); //传给子点击文件

      this.relGroup = data.name;
      let temp = node;
      while (temp.parent.data.name) {
        this.relGroup = `${temp.parent.data.name}/${this.relGroup}`;
        temp = temp.parent;
      }

      if (this.tabPosition == 2 || this.tabPosition == 3) {
        this.tabPosition = 1;
      }
      console.log(
        "handleNodeClick data,node",
        data,
        node,
        this["formData" + this.tabPosition]
      );
      this.groupId = data.id; // 获取分组
      this["formData" + this.tabPosition].currentPage = 1; //跳转到第一页
      this["formData" + this.tabPosition].groupId = data.id;
      this["formData" + this.tabPosition].searchText = "";
      this["formData" + this.tabPosition].treeDataItem = {
        groupId: data.id,
        currentGroupName: data.name,
      };
      if (this.tabPosition == 1) {
        this.getContactorList();
      } else if (this.tabPosition == 4) {
        //如果没有父级节点，则查应急通讯录
        if (node.parent != null && node.parent.parent != null) {
          this["formData" + this.tabPosition].isTop = "false";
        } else {
          this["formData" + this.tabPosition].isTop = "true";
        }
        this.getEmergencyAddressData();
      } else if (this.tabPosition == 5) {
        this.getContactorList();
      } else if (this.tabPosition == 6) {
        this.getContactorList();
      } else if (this.tabPosition == 7) {
        this.getContactorList();
      } else if (this.tabPosition === 8) {
        this.getContactorList();
      } else if (this.tabPosition === 9) {
        this.getContactorList();
      } else if (this.tabPosition === 10) {
        this.getContactorList();
      }
    },
    editTreeItem(node, data) {
      console.log("编辑什么node,data", node, data);
      this.editAndDeleteTreeItem(node, data, "edit");
    },
    deleteTreeItem(node, data) {
      console.log("删除什么node,data", node, data);
      this.editAndDeleteTreeItem(node, data, "delete");
    },
    editGroupDetails(node, data) {
      console.log("查看什么node,data", node, data);
      this.groupDetailsNode = node;
      this.groupDetailsData = data;
      switch (this.tabPosition) {
        case 1:
          this.treeDataProp = this.formData1.treeData;
          break;
        case 5:
          this.treeDataProp = this.formData5.treeData;
          break;
        case 6:
          this.treeDataProp = this.formData6.treeData;
          break;
        case 7:
          this.treeDataProp = this.formData7.treeData;
          break;
        case 10:
          this.treeDataProp = this.formData10.treeData;
          break;
        default:
          this.treeDataProp = this.formData1.treeData;
          break;
      }
      this.editGroupDetailsVisible = true;
    },
    // editTreeItem和deleteTreeItem通用方法
    editAndDeleteTreeItem(node, data, type) {
      let key = `formData${this.tabPosition}`;
      if (this.tabPosition === 2 || this.tabPosition === 3) {
        this.tabPosition = 1;
      }
      this[key].currentPage = 1; //跳转到第一页
      this[key].groupId = data.id;
      this[key].searchText = "";
      this[key].treeDataItem = {
        groupId: data.id,
        currentGroupName: data.name,
      };
      console.log(data);
      this.$store.commit("setGroupId", data.id);
      this.groupId = data.id;

      setTimeout(() => {
        let ref = this.$refs[`treeBtn${this.tabPosition}`];
        if (type === "edit") {
          ref.updateGroup();
        } else {
          ref.deleteGroup();
        }
      }, 500);
    },
    //改变页数查询
    handCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this["formData" + this.tabPosition].currentPage = val;
      console.log(
        `this["formData" + this.tabPosition]`,
        this["formData" + this.tabPosition],
        this["formData" + this.tabPosition].currentPage,
        "formData" + this.tabPosition
      );
      if (this.tabPosition == 1) {
        this.getContactorList();
      } else if (this.tabPosition == 2) {
        this.getDataAl();
      } else if (this.tabPosition == 5) {
        this.getContactorList();
      } else if (this.tabPosition == 4) {
        this.getEmergencyAddressData();
      } else if (this.tabPosition == 6) {
        this.getContactorList();
      } else if (this.tabPosition == 7) {
        this.getContactorList();
      } else if (this.tabPosition == 8) {
        this.getContactorList();
      } else if (this.tabPosition == 9) {
        this.getContactorList();
      } else if (this.tabPosition == 10) {
        this.getContactorList();
      }
    },
    //改变每页条数查询
    handSizeChange(val) {
      this["formData" + this.tabPosition].currentPage = 1;
      this["formData" + this.tabPosition].pageSize = val;
      if (
        this.tabPosition === 1 ||
        this.tabPosition === 5 ||
        this.tabPosition === 6 ||
        this.tabPosition === 7 ||
        this.tabPosition === 8 ||
        this.tabPosition === 9 ||
        this.tabPosition === 10
      ) {
        this.getContactorList();
      } else if (this.tabPosition === 2) {
        this.getDataAl();
      } else if (this.tabPosition === 4) {
        this.getEmergencyAddressData();
      }
    },
    //获取联系人数据
    getContactorList(type) {
      let key = `formData${this.tabPosition}`;
      this[key].rowData = null;
      let dictType;
      switch (this.tabPosition) {
        case 1:
          dictType = "governmentAffairs";
          break;
        case 5:
          dictType = "primaryLevel";
          break;
        case 6:
          dictType = "spareTime";
          break;
        case 7:
          dictType = "resource";
          break;
        case 8:
          dictType = "suzhouGroup";
          break;
        case 9:
          dictType = "quick";
          break;
        case 10:
          dictType = "phoneQuick";
          break;
      }
      // bug9183 author:hexinting date:20201207
      let data = window.g.IsZengChengProject
        ? {
            groupId:
              this[key].groupId === -1 ? -1 : type ? " " : this[key].groupId,
            page: this[key].currentPage,
            size: this[key].pageSize,
            searchText: this[key].searchText,
            type: "phone",
            dictType: dictType,
            thisGroupOnly: true,
          }
        : {
            groupId:
              this[key].groupId === -1 ? -1 : type ? " " : this[key].groupId,
            page: this[key].currentPage,
            size: this[key].pageSize,
            searchText: this[key].searchText,
            type: "phone",
            dictType: dictType,
          };
      this.$api.contactorList(data).then((res) => {
        console.log(res);
        if (res.errorcode !== 0) {
          this.$message.error(res.msg);
          return;
        }
        console.log("点亮小星星后查询的列表", res);
        this[key].tableData =
          res.data.list.map((item) => {
            item.checked = false;
            return item;
          }) || [];
        this[key].total = res.data.totalCount || 0;
      });
    },
    refreshData() {
      this.globalData = {};
      this.globalNode = {};

      this["formData" + this.tabPosition].treeDataItem = {};
      if (this.tabPosition == 1) {
        this.getPhoneGroupingTree();
      } else if (this.tabPosition == 5) {
        this.gliaisonGroupList();
      } else if (this.tabPosition == 6) {
        this.dutyGroupList();
      } else if (this.tabPosition == 7) {
        this.getResourceGroupingTree();
      } else if (this.tabPosition === 8) {
        this.getSuzhouGroupList();
      } else if (this.tabPosition === 9) {
        this.getShortcutGroupData();
      } else if (this.tabPosition === 10) {
        this.getPhoneQuick();
      }
      setTimeout(() => {
        this.refreshTable(); 
      }, 500); // bug10592 qinjiaqi 20210301
    },
    //电话快捷组树
    getPhoneGroupingTree(key) {
      let data = {
        displayDefault: true, //是否显示未分组联系人
      };
      this["formData" + this.tabPosition].myLoading = true;
      this.$api
        .telephoneGroupingTree(data)
        .then((res) => {
          this["formData" + this.tabPosition].myLoading = false;
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error",
            });
            return;
          }
          console.log(res.data);
          this["formData" + this.tabPosition].treeData = res.data || [];
        })
        .catch((err) => {
          this["formData" + this.tabPosition] = false;
        });
    },
    getResourceGroupingTree(key) {
      let data = {
        displayDefault: true, //是否显示未分组联系人
      };
      this["formData" + this.tabPosition].myLoading = true;
      this.$api
        .resourceGroupList(data)
        .then((res) => {
          this["formData" + this.tabPosition].myLoading = false;
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error",
            });
            return;
          }
          this["formData" + this.tabPosition].treeData = res.data || [];
        })
        .catch((err) => {
          this["formData" + this.tabPosition] = false;
        });
    },
    getShortcutGroupData(key) {
      let data = {
        displayDefault: true, //是否显示未分组联系人
      };
      this["formData" + this.tabPosition].myLoading = true;
      this.$api.shortcutGroupList(data).then((res) => {
        this["formData" + this.tabPosition].myLoading = false;
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        this["formData" + this.tabPosition].treeData = res.data || [];
      });
    },
    getTen(key) {
      let data = {
        displayDefault: true, //是否显示未分组联系人
      };
      this["formData" + this.tabPosition].myLoading = true;
      this.$api.TenshortcutGroupList(data).then((res) => {
        this["formData" + this.tabPosition].myLoading = false;
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        this["formData" + this.tabPosition].treeData = res.data || [];
      });
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
          if (this.tabPosition == 4) {
            this.getEmergencyAddressData();
          } else {
            this.getContactorList();
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

              if (this.tabPosition == 4) {
                this.getEmergencyAddressData();
              } else {
                this.getContactorList();
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

    // 获取传真分组数据
    // getFaxGroupData() {
    //   let data = {
    //     displayDefault: true //是否显示未分组联系人
    //   };
    //   this.formData8.myLoading = true;
    //   this.$api
    //     .faxGroupList(data)
    //     .then(res => {
    //       this.formData8.myLoading = false;
    //       console.log(res);
    //       if (res.errorcode != 0) {
    //         this.$message({
    //           message: res.msg,
    //           type: "error"
    //         });
    //         return;
    //       }
    //       this.formData8.treeData = res.data || [];
    //       console.log(this.formData8.treeData);
    //     })
    //     .catch(err => {
    //       this["formData" + this.tabPosition] = false;
    //     });
    // },

    // 拖动排序相关
    refreshTreeAfterDrag() {
      //刷新树数据
      if (this.tabPosition == 1) {
        // 政务联络网
        this.getPhoneGroupingTree(1);
      } else if (this.tabPosition == 2) {
      } else if (this.tabPosition == 3) {
      } else if (this.tabPosition == 4) {
        // 应急联动网
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
      } else if (this.tabPosition == 8) {
        // 工业园区管委会通讯录
        this.getSuzhouGroupList();
      } else if (this.tabPosition === 9) {
        // 快捷联络网
        this.getShortcutGroupData();
      } else if (this.tabPosition === 10) {
        // 电话快捷组
        this.getPhoneQuick();
      }

      //选中
      this.$nextTick(function () {
        if (this.tabPosition == 1) {
          // 政务联络网
          this.$refs.tree.setCurrentKey(this.groupId);
        } else if (this.tabPosition == 2) {
        } else if (this.tabPosition == 3) {
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
        } else if (this.tabPosition === 9) {
          // 快捷联络网
          this.$refs.tree9.setCurrentKey(this.groupId);
        } else if (this.tabPosition === 10) {
          // 电话快捷组
          this.$refs.tree10.setCurrentKey(this.groupId);
        }
      });
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
    //拖拽时判定目标节点能否被放置
    allowDrop(draggingNode, dropNode, type) {
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
    //判断节点能否被拖拽
    allowDrag(draggingNode) {
      return draggingNode.data.id > 0;
    },

    showInfo(row, column, cell, event) {
      if (row.infoMark == 1) {
        let tmp = {
          name: this.getTabName(this.tabPosition),
          id: 0,
          children: this[`formData${this.tabPosition}`].treeData,
        };
        let relGroup = this.getRelGroup(tmp, row.groupId);
        cell.title = `关联分组: ${relGroup}`;
      } else {
        cell.title = "";
      }
    },
    getRelGroup(data, key) {
      if (data.id == key) {
        return data.name;
      }

      for (let i = 0; i < data.children.length; i++) {
        let tmp = this.getRelGroup(data.children[i], key);
        if (tmp) {
          return `${data.name}/${tmp}`;
        }
      }
      return null;
    },
    getTabName(tabPosition) {
      let tmp = {
        1: "政务联络网",
        4: "应急联动网",
        5: "基层联络网",
        6: "备勤联络网",
        7: "资源联络网",
        10: "电话快捷组",
      };
      return tmp[tabPosition];
    },
  },
};
</script>

<style scoped>
#formCard:hover {
  box-shadow: 0px 3px 10px 2px rgba(44, 45, 46, 0.16);
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
  overflow-y: hidden;
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

.dropdownDiv {
  max-width: 250px;
  text-align: left;
}
>>> .el-table__body tr.current-row > td {
  background-color: rgb(204, 228, 255, 0.7);
}
/* 表格鼠标悬浮时的样式（高亮 浮出） */
>>> .el-table--enable-row-hover .el-table__body tr:hover {
  -webkit-transform: translateY(-3px);
  -ms-transform: translateY(-3px);
  transform: translateY(-3px);
  -webkit-box-shadow: 0 0 6px #999;
  box-shadow: 0 0 6px #999;
  -webkit-transition: all 0.5s ease-out;
  transition: all 0.5s ease-out;
}
</style>
