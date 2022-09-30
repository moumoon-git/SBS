<template>
  <div class="phoneIndex_Wrap">
    <!--头部-->
    <div class="phoneIndex_header">
      <div class="phoneIndex_header_Tab" @click="tabShortcutGroup">
        <img
          v-if="!tabObj.shortcutGroup"
          src="../../../../../../static/img/Communihistory/shortcutGroup.png"
          alt
        />
        <img v-else src="../../../../../../static/img/Communihistory/shortcutGroupHover.png" alt />
        <span>快捷组</span>
      </div>

      <!-- <div class="phoneIndex_header_select">
        <el-select
          v-model="value"
          @focus="changeHeaderSelectValue"
          :popper-append-to-body="false"
          placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.label"
            :label="item.name"
            :value="item.val">
          </el-option>
        </el-select>
      </div>-->

      <div class="phoneIndex_header_Tab" @click="tabCommon">
        <img v-if="!tabObj.common" src="../../../../../../static/img/Communihistory/common.png" alt />
        <img v-else src="../../../../../../static/img/Communihistory/common1.png" alt />
        <span>{{ IsShenzhenProject ? '政务联络网' : '通讯录' }}</span>
      </div>

      <div class="phoneIndex_header_Tab" @click="tabRecently">
        <img
          v-if="!tabObj.recently"
          src="../../../../../../static/img/Communihistory/recently.png"
          alt
        />
        <img v-else src="../../../../../../static/img/Communihistory/recently1.png" alt />
        <span>最近联系人</span>
      </div>
    </div>
    <!--内容-->
    <div class="phoneIndex_content">
      <!-- 架构-->
      <div class="framework" v-if="eleFlagHumanFlag">
        <div style="width:30%;">
          <el-tree
            :data="data"
            :props="defaultProps"
            accordion
            ref="tree"
            @node-click="handleNodeClick"
            :default-checked-keys="groupId"
            :default-expanded-keys="groupId"
          ></el-tree>
        </div>

        <div class="framework_right" style="width:70%;">
          <div class="framework_right_header">
            <div>
              <el-input placeholder="请输入关键字搜索" v-model="input" @keyup.enter.native="searchBtn"></el-input>
              <el-button
                @click="searchBtn"
                icon="el-icon-search"
                style="display: flex;align-items: center;justify-content: center;"
              ></el-button>
            </div>
            <img
              @click="cellPhoneNumFlag=!cellPhoneNumFlag"
              src="../../../../../../static/img/Communihistory/sudoku.png"
              alt
            />
            <div class="cellPhoneNum" v-show="cellPhoneNumFlag">
              <dialPlate ref="dialPlate" @dialing="dialing"></dialPlate>
            </div>
          </div>
          <!--渲染的列表-->
          <div class="framework_right_content">
            <div
              class="framework_right_content_list"
              v-for="(item ,index) in organizationData"
              :key="index"
            >
              <div class="framework_right_content_list_left">
                <div>{{item.name}} {{item.position}}</div>
                <div>{{item.workUnit}}</div>
              </div>

              <div class="framework_right_content_list_right">
                <div class="selectPhone">
                  <el-dropdown trigger="click" @visible-change="visMoreList($event,0)">
                    <span class="el-dropdown-link">...</span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>
                        <div class="selectPhoneCell" v-if="item.phoneAllObj.mobile">
                          <span>手机号码：{{item.phoneAllObj.mobile}}</span>
                          <img @click="callPhone(item.phoneAllObj.mobile, item.id)"
                              src="../../../../../../static/img/Communihistory/cell1.png" alt="">
                        </div>
                        <div class="selectPhoneCell" v-if="item.phoneAllObj.officeTel">
                          <span>办公室电话：{{item.phoneAllObj.officeTel}}</span>
                          <img @click="callPhone(item.phoneAllObj.officeTel, item.id)"
                              src="../../../../../../static/img/Communihistory/cell1.png" alt="">
                        </div>
                        <div class="selectPhoneCell" v-if="item.phoneAllObj.homeTel">
                          <span>家庭电话：{{item.phoneAllObj.homeTel}}</span>
                          <img @click="callPhone(item.phoneAllObj.homeTel, item.id)"
                              src="../../../../../../static/img/Communihistory/cell1.png" alt="">
                        </div>
                        <div class="selectPhoneCell"
                            v-if="!item.phoneAllObj.mobile&&!item.phoneAllObj.officeTel&&!item.phoneAllObj.homeTel">
                          暂无更多
                        </div>
                        <!-- <div class="selectPhoneCell" v-if="item.phoneAllObj.mobile">
                          <span>手机号码：{{item.phoneAllObj.mobile}}</span>
                          <img
                            @click="callPhone(item.phoneAllObj.mobile)"
                            src="../../../../../../static/img/Communihistory/cell1.png"
                            alt
                          />
                        </div>
                        <div class="selectPhoneCell" v-if="item.phoneAllObj.otherTel">
                          <span>备用号码：{{item.phoneAllObj.otherTel}}</span>
                          <img
                            @click="callPhone(item.phoneAllObj.otherTel)"
                            src="../../../../../../static/img/Communihistory/cell1.png"
                            alt
                          />
                        </div>
                        <div class="selectPhoneCell" v-if="item.phoneAllObj.officeTel">
                          <span>办公电话：{{item.phoneAllObj.officeTel}}</span>
                          <img
                            @click="callPhone(item.phoneAllObj.officeTel)"
                            src="../../../../../../static/img/Communihistory/cell1.png"
                            alt
                          />
                        </div>
                        <div class="selectPhoneCell" v-if="item.phoneAllObj.homeTel">
                          <span>应急电话：{{item.phoneAllObj.homeTel}}</span>
                          <img
                            @click="callPhone(item.phoneAllObj.homeTel)"
                            src="../../../../../../static/img/Communihistory/cell1.png"
                            alt
                          />
                        </div>
                        <div class="selectPhoneCell" v-if="item.phoneAllObj.otherTel2">
                          <span>其他电话：{{item.phoneAllObj.otherTel2}}</span>
                          <img
                            @click="callPhone(item.phoneAllObj.otherTel2)"
                            src="../../../../../../static/img/Communihistory/cell1.png"
                            alt
                          />
                        </div>
                        <div
                          class="selectPhoneCell"
                          v-if="!item.phoneAllObj.mobile&&!item.phoneAllObj.otherTel&&!item.phoneAllObj.officeTel&&!item.phoneAllObj.number&&!item.phoneAllObj.otherTel2"
                        >暂无更多</div> -->
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                <div class="cellPhoneImg" @click="callPhoneAssign(item)"></div>
              </div>
            </div>
          </div>
          <!--页脚-->
          <div class="framework_right_footer" style="display: flex;justify-content: center;">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="organization.page"
              :page-size="10"
              layout="prev, pager, next, jumper"
              :total="organization.total"
            ></el-pagination>
          </div>
        </div>
      </div>
      <!--常用和最近联系人-->
      <div class="commonAndRecently" v-if="!eleFlagHumanFlag">
        <!--渲染列表-->
        <div class="commonAndRecently_content">
          <div
            v-for="(item ,index) in theOrganizationData"
            :key="index"
            class="framework_right_content_list"
          >
            <div class="framework_right_content_list_left">
              <div>{{item.name || item.contactor || call}} {{item.position}}</div>
              <div>{{item.workUnit}}</div>
            </div>

            <div class="framework_right_content_list_right">
              <div class="selectPhone">
                <el-dropdown trigger="click" @visible-change="visMoreList($event,0)">
                  <span class="el-dropdown-link">...</span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                        <div class="selectPhoneCell" v-if="item.phoneAllObj.mobile">
                          <span>手机号码：{{item.phoneAllObj.mobile}}</span>
                          <img @click="callPhone(item.phoneAllObj.mobile, item.id)"
                              src="../../../../../../static/img/Communihistory/cell1.png" alt="">
                        </div>
                        <div class="selectPhoneCell" v-if="item.phoneAllObj.officeTel">
                          <span>办公室电话：{{item.phoneAllObj.officeTel}}</span>
                          <img @click="callPhone(item.phoneAllObj.officeTel, item.id)"
                              src="../../../../../../static/img/Communihistory/cell1.png" alt="">
                        </div>
                        <div class="selectPhoneCell" v-if="item.phoneAllObj.homeTel">
                          <span>家庭电话：{{item.phoneAllObj.homeTel}}</span>
                          <img @click="callPhone(item.phoneAllObj.homeTel, item.id)"
                              src="../../../../../../static/img/Communihistory/cell1.png" alt="">
                        </div>
                        <div class="selectPhoneCell"
                            v-if="!item.phoneAllObj.mobile&&!item.phoneAllObj.officeTel&&!item.phoneAllObj.homeTel">
                          暂无更多
                        </div>
                      <!-- <div class="selectPhoneCell" v-if="item.phoneAllObj.mobile">
                        <span>手机号码：{{item.phoneAllObj.mobile}}</span>
                        <img
                          @click="callPhone(item.phoneAllObj.mobile)"
                          src="../../../../../../static/img/Communihistory/cell1.png"
                          alt
                        />
                      </div>
                      <div class="selectPhoneCell" v-if="item.phoneAllObj.otherTel">
                        <span>备用号码：{{item.phoneAllObj.otherTel}}</span>
                        <img
                          @click="callPhone(item.phoneAllObj.otherTel)"
                          src="../../../../../../static/img/Communihistory/cell1.png"
                          alt
                        />
                      </div>
                      <div class="selectPhoneCell" v-if="item.phoneAllObj.officeTel">
                        <span>办公电话：{{item.phoneAllObj.officeTel}}</span>
                        <img
                          @click="callPhone(item.phoneAllObj.officeTel)"
                          src="../../../../../../static/img/Communihistory/cell1.png"
                          alt
                        />
                      </div>
                      <div class="selectPhoneCell" v-if="item.phoneAllObj.homeTel">
                        <span>应急电话：{{item.phoneAllObj.homeTel}}</span>
                        <img
                          @click="callPhone(item.phoneAllObj.homeTel)"
                          src="../../../../../../static/img/Communihistory/cell1.png"
                          alt
                        />
                      </div>
                      <div class="selectPhoneCell" v-if="item.phoneAllObj.otherTel2">
                        <span>其他电话：{{item.phoneAllObj.otherTel2}}</span>
                        <img
                          @click="callPhone(item.phoneAllObj.otherTel2)"
                          src="../../../../../../static/img/Communihistory/cell1.png"
                          alt
                        />
                      </div>
                      <div
                        class="selectPhoneCell"
                        v-if="!item.phoneAllObj.mobile&&!item.phoneAllObj.otherTel&&!item.phoneAllObj.officeTel&&!item.phoneAllObj.number&&!item.phoneAllObj.otherTel2"
                      >暂无更多</div> -->
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
              <div class="cellPhoneImg" @click="callPhoneAssign(item)"></div>
            </div>
          </div>
        </div>
        <!--页脚-->
        <!-- <div class="framework_right_footer commonAndRecently_footer">
          <span>/</span>
          <el-pagination
            @size-change="latelyHandleSizeChange"
            @current-change="latelyHandleCurrentChange"
            :current-page.sync="lately.page"
            :page-size="14"
            layout="prev, pager, next, jumper"
            :total="lately.total">
          </el-pagination>
        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
import mixin from '@/view/yz_integratedCommunication/icpPhone/icpPhonePage/mixin';
import dialPlate from '@/yz_components/dialPlate';
import mixin2 from '@/view/yangZhouEventReports/assets/js/mixin/mixin.js';

export default {
    mixins: [mixin, mixin2],
    name: 'phoneIndex',
    props: {
        faxForm: {
            type: Object,
        },
    },
    data() {
        return {
            IsYangZhouProject: window.g.IsYangZhouProject, // 扬州项目
            IsShenzhenProject: window.g.IsShenzhenProject, // 是否是深圳项目
            isDrawOrCli: 0, //政务联络网判断是节点下拉还是搜索框搜素
            gid: 0, //保留未分组节点的组id
            isDrowOrClick: 0, //应急联络网判断是节点下拉还是搜索框搜索
            nodeid: 0, //定义节点id
            nodechildren: [], //保留节点下面的子节点信息
            //控制架构和联系人的展示方式
            eleFlagHumanFlag: true,
            //控制电话盘
            cellPhoneNumFlag: false,
            //选择架构
            options: window.g.IsYangZhouProject
                ? [
                      {
                          //按钮切换
                          name: '政务通信录',
                          val: '1',
                      },
                      {
                          name: '应急通信录',
                          val: '4',
                      },
                      // {
                      //   name: '基层联络网',
                      //   val: '5'
                      // }, {
                      //   name: '备勤联络网',
                      //   val: '6'
                      // }, {
                      //   name: '资源联络网',
                      //   val: '7'
                      // }
                  ]
                : [
                      {
                          //按钮切换
                          name: '政务联络网',
                          val: '1',
                      },
                      {
                          name: '应急联动网',
                          val: '4',
                      },
                      {
                          name: '基层联络网',
                          val: '5',
                      },
                      {
                          name: '备勤联络网',
                          val: '6',
                      },
                      {
                          name: '资源联络网',
                          val: '7',
                      },
                  ],
            // 下拉选择框的值
            value: '1',
            //切换联系人的flag
            tabObj: {
                common: false,
                recently: false,
                shortcutGroup: false,
            },
            //组织架构
            data: [],
            defaultProps: {
                children: 'children',
                label: 'name',
            },
            //搜索
            input: '',
            // 选择页
            organization: {
                page: 1,
                total: 0,
            },
            //最近联系人
            lately: {
                page: 1,
                total: 0,
            },
            organizationData: [], //组织架构的联系人列编数据
            theOrganizationData: [], //非组织架构的联系人列表数据
            affairsObj: {}, //请求联系人的数据对象
            groupId: [],
        };
    },
    methods: {
        //初始化数据
        initLatelyData(str) {
            this.lately = {
                page: 1,
                total: 0,
            };
            this.organization = {
                page: 1,
                total: 0,
            };
            this.input = '';
            //初始化组织架构和常用联系人、最近联系人按钮切换的锁
            this.tabObj.common = false;
            this.tabObj.recently = false;
            this.tabObj.shortcutGroup = false;
            this.eleFlagHumanFlag = false;
            if (str) {
                this[str] = true;
                this.input = this.faxForm.phone;
            }
        },
        // 拨打默认电话
        callPhoneAssign(item) {
            // 注释原因：2.7的打电话逻辑变更为3.0的
            // let obj = {
            //     type: this.$store.state.msgHeadleData.sendType,
            //     typeId: this.$store.state.msgHeadleData.sendTypeId,
            // };
            // if (item.mobile) {
            //     this.talkCall({ number: item.mobile }, '', obj);
            // } else if (item.otherTel) {
            //     this.talkCall({ number: item.otherTel }, '', obj);
            // } else if (item.officeTel) {
            //     this.talkCall({ number: item.officeTel }, '', obj);
            // } else if (item.number) {
            //     this.talkCall({ number: item.number }, '', obj);
            // } else if (item.otherTel2) {
            //     this.talkCall({ number: item.otherTel2 }, '', obj);
            // }
            if (!item.mobile && !item.mobile1 && !item.homeTel && !item.officeTel) {
            this.$message({
                message: `${item.name}联系号码为空`
            })
            return false;
            }
            this.makePhoneCall(item.mobile || item.mobile1 || item.homeTel || item.officeTel, item.id, null, sessionStorage.getItem('newID'));
        },
        // 拨打电话
        callPhone(phone, id) {
            // 注释原因：2.7的打电话逻辑变更为3.0的
            // if (phone) {
            //     let obj = {
            //         type: this.$store.state.msgHeadleData.sendType,
            //         typeId: this.$store.state.msgHeadleData.sendTypeId,
            //     };
            //     this.talkCall({ number: phone }, '', obj);
            // }
            this.makePhoneCall(phone, id, null, sessionStorage.getItem('newID'));
        },
        //点击切换通讯录
        tabCommon() {
            this.initLatelyData('eleFlagHumanFlag'); //初始化
            this.tabObj.common = true;
            this.affairsObj = {};
            this.organizationData = [];
            this.getTissueDataList();
            this.value = '1';
            this.searchBtn();
        },
        //点击切换快捷组
        tabShortcutGroup() {
            this.initLatelyData('eleFlagHumanFlag'); //初始化
            this.tabObj.shortcutGroup = true;
            this.affairsObj = {};
            this.organizationData = [];
            this.shortcutGroupList();
            this.value = '9';
            this.searchBtn();
        },
        //点击切换最近联系人
        tabRecently() {
            this.initLatelyData(); //初始化
            this.tabObj.recently = true;
            this.combineRequery();
        },
        //获取常用联系人  政务联络网
        getCommonListData() {
            let data = {
                page: this.lately.page,
                size: 10,
                searchText: '',
                type: 'phone',
            };
            this.$api.commonContactorList(data).then(res => {
                if (res.errorcode == 0) {
                    console.log(res.data);
                    if (res.data) {
                        this.settlePhone(res.data.data);
                    }
                    this.lately.total = res.data.totalElements;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        //应急联络网
        // getCommonListData() {
        //   let data = {
        //     id: 0
        //   }
        //   this.$api.getBriefsByClassId(data).then((res) => {
        //     if (res.errorcode == 0) {
        //       let fun = this.getDa(res.data, 'versionId')
        //     } else {
        //       this.$message.error(res.msg)
        //     }
        //   });
        // },
        //递归获取组织架构
        getDa(data, str) {
            if (data.length != 0) {
                data.forEach((ele, index) => {
                    if (ele[str]) {
                        this.$api.getStructTree({ id: ele[str] }).then(res => {
                            if (res.errorcode == 0) {
                                ele.children = res.data;
                                if (index == data.length - 1) {
                                    this.data = data;
                                    console.log(data);
                                }
                            }
                        });
                    }
                });
            }
        },
        //获取最近联系人
        getRecentlyListData() {
            this.$api.getRecentContactorList().then(res => {
                if (res.errorcode == 0) {
                    console.log(res.data);
                    this.lately.total = res.data.totalElements;
                    if (res.data) {
                        if (res.data.data.length != 0) {
                            this.settlePhone(res.data.data);
                            // res.data.data.forEach(ele => {
                            //   ele.phoneAllObj = {
                            //     mobile: ele.callType == 0 ? ele.calling : ele.called
                            //   }
                            // })
                        }
                        this.theOrganizationData = res.data.data;
                    }
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        //整合常用和最近联系人的请求
        combineRequery() {
            if (this.tabObj.common) {
                this.getCommonList();
            } else if (this.tabObj.recently) {
                this.getRecentlyListData();
            }
        },
        //获取常用联系人
        getCommonList() {
            let data = {
                page: this.lately.page,
                searchText: '',
                size: 14,
                type: 'phone',
                all: true,
            };
            this.$api.commonContactorList(data).then(res => {
                if (res.errorcode == 0) {
                    if (res.data) {
                        console.log('电话联系人数据为：', res.data.data);
                        if (res.data) {
                            this.settlePhone(res.data.data);
                            this.theOrganizationData = res.data.data;
                            this.lately.total = res.data.totalElements;
                        }
                    }
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        //点击组织架构
        handleNodeClick(obj, node) {
            this.input = '';
            this.organization.page = 1;
            console.log('节点信息为：', obj, node);
            if (
                this.value == 1 ||
                this.value == 5 ||
                this.value == 6 ||
                this.value == 7 ||
                this.value == 9 ||
                !this.value
            ) {
                this.isDrawOrCli = 1; //1代表是树节点下
                this.affairs(obj, undefined);
            } else if (this.value == 4) {
                this.isDrowOrClick = 1; //1表示树节点下拉
                this.emergencyAddressBook(obj);
                this.nodeid = obj.id;
                this.nodechildren = obj.children;
            }
        },
        // 设置dictType
        setDictType(value) {
            let dictType = '';
            switch (value) {
                case '1':
                    dictType = 'governmentAffairs';
                    break;
                case '5':
                    dictType = 'primaryLevel';
                    break;
                case '6':
                    dictType = 'spareTime';
                    break;
                case '7':
                    dictType = 'resource';
                    break;
                case '9':
                    dictType = 'quick';
                    break;
                default:
                    dictType = undefined;
            }
            return dictType;
        },
        //搜索
        searchBtn() {
            if (
                this.value == 1 ||
                this.value == 5 ||
                this.value == 6 ||
                this.value == 7 ||
                this.value == 9 ||
                !this.value
            ) {
                let dictType = this.setDictType(this.value);
                this.isDrawOrCli = 2; //2代表搜索框搜索
                if (this.gid === -1) {
                    this.affairs({ id: -1 }, dictType);
                } else {
                    this.affairs({}, dictType);
                }
            } else if (this.value == 4) {
                this.isDrowOrClick = 2; //2表示搜索框搜索
                this.emergencyAddressBook({
                    id: this.nodeid,
                    children: this.nodechildren,
                });
            }
        },
        //备勤联络网
        dutyGroupList() {
            this.$api.dutyGroupList({ displayDefault: true }).then(res => {
                console.log(res);
                if (res.errorcode != 0) {
                    this.$message({
                        message: res.msg,
                        type: 'error',
                    });
                    return;
                }
                if (res.data) {
                    this.data = res.data;
                }
            });
        },
        //资源联络网
        resourceGroupList() {
            this.$api.resourceGroupList({ displayDefault: true }).then(res => {
                console.log(res);
                if (res.errorcode != 0) {
                    this.$message({
                        message: res.msg,
                        type: 'error',
                    });
                    return;
                }
                if (res.data) {
                    this.data = res.data;
                }
            });
        },
        // 快捷组
        shortcutGroupList() {
            this.$api.shortcutGroupList({ displayDefault: true }).then(res => {
                console.log(res);
                if (res.errorcode != 0) {
                    this.$message({
                        message: res.msg,
                        type: 'error',
                    });
                    return;
                }
                if (res.data) {
                    this.data = res.data;
                }
            });
        },
        // 政务组织网
        affairs(obj, dictType) {
            if (this.isDrawOrCli === 1) {
                if (obj.id === -1) {
                    this.gid = -1;
                    this.input = '';
                } else {
                    this.gid = 0;
                }
            }
            if (this.isDrawOrCli === 2) {
                if (obj.id === -1) {
                    this.gid = -1;
                } else {
                    this.gid = 0;
                }
            }
            this.affairsObj = obj;
            // bug9617 author:qinjiaqi date:20201224
            let data = window.g.IsZengChengProject
                ? {
                    groupId: obj.id || 0,
                    page: this.organization.page,
                    size: 10,
                    search: this.input,
                    type: 'phone',
                    dictType: "governmentAffairs",
                    thisGroupOnly: true,
                }
                : {
                    groupId: obj.id || 0,
                    page: this.organization.page,
                    search: this.input,
                    dictType,
                    size: 10,
                    type: 'phone',
                };
            this.$api.contactorList(data).then(res => {
                console.log(res);
                if (res.errorcode != 0) {
                    this.$message({
                        message: res.msg,
                        type: 'error',
                    });
                    return;
                }
                if (res.data) {
                    this.settlePhone(res.data.list);
                }
                this.organizationData = res.data.list;
                this.organization.total = res.data ? res.data.totalCount : 0;
                console.log(this.organization.total);
            });
        },
        //应急联动网
        emergencyAddressBook(obj) {
            let isTop = true;
            if (this.isDrowOrClick === 1) {
                //1表示树节点下拉
                this.input = '';
            }
            let isObjectExist = JSON.stringify(obj) == '{}';
            if (!isObjectExist && obj.children) {
                if (obj.children.length === 0) {
                    isTop = false;
                }
            }
            console.log('点击时的对象是：', obj);
            this.affairsObj = obj;
            let data = {
                id: obj.id,
                isTop: isTop + '',
                page: this.organization.page,
                searchText: this.input,
                size: 10,
                type: 'phone',
            };
            console.log('传递的搜索数据是:', data);
            this.$api.emergencyAddressBook(data).then(res => {
                console.log(res);
                if (res.errorcode != 0) {
                    this.$message({
                        message: res.msg,
                        type: 'error',
                    });
                    return;
                }
                this.settlePhone(res.data ? res.data.data : []);
                this.organizationData = res.data ? res.data.data : [];
                this.organization.total = res.data ? res.data.totalElements : 0;
            });
        },
        //整理电话数据
        settlePhone(data) {
            if (data.length != 0) {
                console.log(data);
                data.forEach(ele => {
                    // 注释原因：修复bug13586 通过与通讯录管理里面，联系人信息字段的对比。 3.0联系人电话的字段只有手机号码，家庭电话，办公室电话

                    // ele.phoneAllObj = {
                    //     mobile: ele.mobile, //手机号码
                    //     otherTel: ele.otherTel, //手机2
                    //     officeTel: ele.officeTel, //办公电话
                    //     number: ele.number, //联系号码
                    //     otherTel2: ele.otherTel2, //其他号码
                    // };

                    ele.phoneAllObj = {
                        mobile: ele.mobile1 || ele.mobile,//手机号码
                        homeTel: ele.homeTel, //家庭电话
                        officeTel: ele.officeTel,//办公室电话
                    }
                });
            }
        },
        //组织架构的选择页
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            // 架构的页数变化时查看是哪个组织下的，然后发起请求
            if (this.value == 1 || this.value == 5 || this.value == 9) {
                this.affairs(this.affairsObj, this.setDictType(this.value));
            } else if (this.value == 4) {
                this.emergencyAddressBook(this.affairsObj);
            }
        },
        //最近联系人和常用联系人
        latelyHandleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.lately.page = val;
            this.combineRequery();
        },
        latelyHandleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.lately.page = val;
            this.combineRequery();
        },
        //显示更多
        visMoreList(flag, data) {
            if (flag) {
                let Ele = Array.from(
                    document.querySelectorAll('.el-dropdown-menu.el-popper')
                );
                if (Ele.length != 0) {
                    setTimeout(() => {
                        Ele.forEach(ele => {
                            // console.log(parseInt(ele.style.left),ele)
                            ele.style.left =
                                parseInt(ele.style.left) + 23 + 'px';
                            ele.style.top = parseInt(ele.style.top) + 50 + 'px';
                        });
                    }, 10);
                }
            }
        },
        changeHeaderSelectValue(data) {
            setTimeout(() => {
                let ele = document.querySelector(
                    '.phoneIndex_header_select .el-select-dropdown'
                );
                ele.style.top = parseInt(ele.style.top) - 5 + 'px';
            }, 100);
        },
        //获取组织架构
        getTissueDataList() {
            let data = {
                displayDefault: true, //是否显示未分组联系人
            };
            this.$api.telephoneGroupingTree(data).then(res => {
                if (res.errorcode != 0) {
                    this.$message({
                        message: res.msg,
                        type: 'error',
                    });
                    return;
                }
                this.data = res.data;
            });
        },
        //打电话
        dialing(data) {
            // 注释原因：打电话不用2.7的逻辑了
            // console.log(data);
            // let obj = {
            //     type: this.$store.state.msgHeadleData.sendType,
            //     typeId: this.$store.state.msgHeadleData.sendTypeId,
            // };
            // this.talkCall({ number: parseInt(data.phoneNumber) }, '', obj);
            this.makePhoneCall(data.phoneNumber, null, null, sessionStorage.getItem('newID'));
        },
        //获得组织架构联系人
        getGroup() {},
        //获得基层联络网
        getJC() {
            //
            let data = { displayDefault: true };
            this.$api.gliaisonGroupList(data).then(res => {
                if (res.errorcode == 0) {
                    console.log(res.data);
                    this.data = res.data;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        //根据选择的组织架构值加载数据
        ifGetDataFun(val) {
            if (val == 4 && this.eleFlagHumanFlag) {
                this.getCommonListData();
            } else if (val == 5 && this.eleFlagHumanFlag) {
                this.getJC();
            } else if (val == 6 && this.eleFlagHumanFlag) {
                this.dutyGroupList();
            } else if (val == 7 && this.eleFlagHumanFlag) {
                this.resourceGroupList();
            } else if (val == 8 && this.eleFlagHumanFlag) {
                this.shortcutGroupList();
            } else if (this.eleFlagHumanFlag) {
                this.getTissueDataList();
            }
        },
    },
    mounted() {
        // this.ifGetDataFun(1)
        if (this.IsShenzhenProject) {
            // 如果是深圳市项目，优先显示政务联络网。其余的项目优先显示快捷组
            this.tabCommon();
        } else {
            this.tabShortcutGroup();
        }
    },
    components: {
        dialPlate,
    },
    watch: {
        // value: function (newValue) {
        //   console.log(newValue)
        //   this.initLatelyData('eleFlagHumanFlag')
        //   this.ifGetDataFun(newValue)
        //   this.affairsObj = {}
        //   this.organizationData = []
        // },
        faxForm(newV) {
            this.input = newV.phone;
            this.searchBtn();
            this.tabShortcutGroup();
            this.value = '9';
        },
    },
};
</script>

<style scoped>
.phoneIndex_Wrap {
    height: 800px;
    background: #fff;
    display: flex;
    flex-direction: column;
}

.phoneIndex_header {
    height: 70px;
    border-bottom: 1px solid #eae6e6;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 5%;
}

.phoneIndex_header_select {
    width: 141px;
    height: 42px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
}

.phoneIndex_header_Tab {
    display: flex;
    align-items: center;
    cursor: pointer;
    white-space: nowrap;
}

.phoneIndex_header_Tab > img {
    width: 28px;
    height: 28px;
    margin-right: 14px;
}

. .phoneIndex_header_Tab > span {
    font-size: 17px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
}

.phoneIndex_content {
    flex: 1;
    display: flex;
    overflow-y: scroll;
}

.framework {
    flex: 1;
    display: flex;
    justify-content: space-between;
    overflow-x: hidden;
}

.framework > div:nth-child(1) {
    overflow-y: scroll;
    padding-top: 20px;
    box-sizing: border-box;
    border-right: 1px solid #eae6e6;
}

/* .framework > div {
    width: 50%;
    max-width: 265px;
  } */

.framework_right {
    display: flex;
    flex-direction: column;
}

.framework_right_header {
    padding: 0 13px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 13px;
    position: relative;
}

.framework_right_header > div:nth-child(1) {
    width: 210px;
    position: relative;
}

.framework_right_header > div:nth-child(1) > button {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 15%;
    border: none;
    cursor: pointer;
    background: transparent;
    outline: none;
}

.framework_right_header > img {
    width: 28px;
    height: 28px;
    margin-left: 10px;
    cursor: pointer;
}

.cellPhoneNum {
    position: absolute;
    top: 45px;
    right: 5%;
    background: #fff;
    z-index: 99;
    padding: 20px 15px;
    box-shadow: 0px 0px 32px 4px rgba(201, 201, 201, 0.27);
}

.cellPhoneNum > div {
    background: none !important;
    background-image: none !important;
}

.cellPhoneNum > div >>> .close {
    display: none;
}

/*渲染的列表*/
.framework_right_content {
    padding: 0 14px;
    flex: 1;
    display: flex;
    /* flex-direction: column; */
    /* align-items: center; */
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    align-content: flex-start;
    padding-top: 14px;
    overflow: scroll;
}

.framework_right_content_list {
    /* min-width: 222px; */
    min-height: 83px;
    /* max-width: 240px; */
    width: 40%;
    height: 83px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    border: 1px solid rgba(234, 230, 230, 1);
    margin: 14px;
    padding: 14px 10px 14px 14px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    position: relative;
    transition: all 0.5s;
    /* margin: 0px 0vw 2vw 2vw; */
}

.framework_right_content_list:hover {
    transform: translateY(-5px);
    box-shadow: 3px 3px 3px #ccc;
    border: 1px solid rgba(157, 190, 255, 1);
    background: rgba(245, 250, 255, 1);
}

.framework_right_content_list >>> .el-dropdown {
    font-size: 26px;
    color: #dddddd;
    cursor: pointer;
    user-select: none;
    margin-top: -5px;
}

.framework_right_content_list >>> .el-select {
    position: absolute;
    left: -3%;
    top: 35px;
    width: 106%;
}

.framework_right_content_list >>> .el-select > .el-input {
    visibility: hidden;
}

.framework_right_content_list >>> .el-popper {
    left: 0 !important;
}

.framework_right_content_list_active {
    border: 1px solid rgba(157, 190, 255, 1);
    background: rgba(245, 250, 255, 1);
}

.framework_right_content_list_left {
    max-width: 80%;
}

.framework_right_content_list_left > div {
    text-align: left;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.framework_right_content_list_left > div:nth-child(1) {
    font-size: 17px;
    font-weight: 600;
    color: rgba(51, 51, 51, 1);
    margin-bottom: 7px;
}

.framework_right_content_list_right {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    position: relative;
}

.selectPhone {
    position: absolute;
    top: -17px;
    right: 5px;
}

.cellPhoneImg {
    width: 25px;
    height: 27px;
    background: url('../../../../../../static/img/Communihistory/cell.png')
        no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
}

.cellPhoneImg:hover {
    background: url('../../../../../../static/img/Communihistory/cell1.png')
        no-repeat;
    background-size: 100% 100%;
}

/* .framework_right_footer {
    position: relative;
    margin-bottom: 3px;
}

.framework_right_footer > span {
    position: absolute;
    z-index: 100;
    top: 4px;
    bottom: 0;
    left: 55%;
    margin: auto;
}

.framework_right_footer >>> .el-pagination {
    position: relative;
}

.framework_right_footer >>> .el-pagination__jump {
    font-size: 0;
    position: absolute;
    left: 15%;
    height: 25px;
    z-index: 100;
}

.framework_right_footer >>> .el-pagination .btn-next .el-icon,
.framework_right_footer >>> .el-pagination .btn-prev .el-icon {
    font-size: 18px;
}

.framework_right_footer >>> .el-pagination .btn-next,
.framework_right_footer >>> .el-pagination .btn-prev {
    position: relative;
    z-index: 99;
}

.framework_right_footer
    >>> .el-pagination__jump
    .el-pagination__editor.el-input,
.framework_right_footer
    >>> .el-pagination__jump
    .el-pagination__editor.el-input
    .el-input__inner {
    width: 57px;
    height: 25px;
} */

.selectPhoneCell {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 250px;
    padding: 0 20px;
    box-sizing: border-box;
}

.selectPhoneCell > img {
    width: 18px;
    height: 19px;
    cursor: pointer;
    visibility: hidden;
}

.selectPhoneCell:hover img {
    visibility: visible;
}

.selectPhoneCell:hover {
    font-weight: 500;
    color: rgba(0, 145, 255, 1);
}

/*联系人*/
.commonAndRecently {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.commonAndRecently_content {
    width: 100%;
    padding: 15px 15px;
    box-sizing: border-box;
    overflow-y: scroll;
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: flex-start;
}

.commonAndRecently_footer {
    width: 265px;
}

>>> .el-tree > .is-expanded {
    position: relative;
}

>>> .el-tree > .is-expanded:before {
    content: '';
    position: absolute;
    height: calc(100% - 26px);
    width: 1px;
    border-left: 1px dashed #afafaf;
    left: 32px;
    top: 17px;
    z-index: 99;
}

/*激活时的蓝色条*/
>>> .el-tree .el-tree-node__content {
    position: relative;
}

>>> .el-tree .el-tree-node__content:before {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 2px;
    background: #2d8cf0;
}

>>> .el-tree-node__expand-icon.expanded {
    margin-left: 20px;
}

>>> .el-tree-node__content > .el-tree-node__expand-icon {
    margin-left: 20px;
}

>>> .el-icon-search:before {
    font-size: 20px;
}

>>> .el-icon-caret-right:before {
    content: '\E6E0';
}

>>> .el-tree-node__content:hover,
>>> .el-tree-node__content:active,
>>> .el-tree-node__content:focus {
    background: rgba(63, 146, 254, 0.2);
    color: #3f92fe;
}

>>> .el-tree-node__label {
    font-size: 17px;
}

>>> .el-dropdown-menu__item {
    padding: 0;
}

>>> .popper__arrow {
    display: none !important;
}

/* >>> .el-pager > li {
    display: none;
}

>>> .el-pager > li:last-child {
    display: block;
    text-align: right;
}

>>> .el-pager {
    width: 120px;
    overflow: hidden;
    z-index: 99;
    position: relative;
} */

>>> .el-dropdown-menu__item:focus,
>>> .el-dropdown-menu__item:hover {
    color: #000;
    background: none;
}

>>> .el-select-dropdown__item {
    font-size: 17px;
}

>>> .el-select-dropdown__item.hover,
>>> .el-select-dropdown__item:hover {
    font-weight: 500;
}

>>> .el-select-dropdown__item.selected {
    font-weight: 500;
    background: rgba(0, 145, 255, 0.2);
}

>>> .expanded {
    color: #ccc;
}
</style>
