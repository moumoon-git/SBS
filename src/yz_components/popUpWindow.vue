<template>
  <div class="popUpWindowDel_wrap" :class="{ 'oy-active': buttonShow }" ref="kongtiao">
    <!-- 头部 -->
    <header
      class="popUpWindowDel_header"
      @mousedown="mouseDownHandleelse($event)"
      @mouseup="mouseUpHandleelse($event)"
    >
      <popUpWindowDelTop
        ref="popUpWindowDelTop"
        :basicsData="basicsData"
        @recordingToText="recordingToText"
      ></popUpWindowDelTop>
    </header>

    <!-- 主要内容部分 -->
    <aside class="popUpWindowDel_content">
      <!-- 主要内容左边 -->
      <aside :class="RealTimeVoiceToText ? 'popUpWindowDel_left' :'popUpWindowDel_left_2'">
        <div style="background-color: #fff">
          <!--上面-->
          <div style="padding: 10px; height: 300px">
            <!--上的标题上部分-->
            <div>
              <div style="display: flex; align-items: center">
                <span
                  style="
                    display: inline-block;
                    background-color: #0091ff;
                    width: 2px;
                    height: 12px;
                  "
                ></span>
                <span style="font-size: 14px; padding-left: 10px; font-weight: bold">接报指引</span>
              </div>
            </div>

            <!--上的标题下部分-->
            <div style="display: flex; padding-top: 10px">
              <!--上_左边-->
              <div style="flex: 2">
                <div
                  :class="RealTimeVoiceToText ? 'guide' : 'guide_2'"
                >
                  <el-scrollbar style="height: 100%">
                    <el-tree
                      :data="treeData"
                      :props="defaultProps"
                      default-expand-all
                      @node-click="handleNodeClick"
                    >
                      <span class="span-ellipsis" slot-scope="{ node, data }">
                        <span :title="node.label">{{ node.label }}</span>
                      </span>
                    </el-tree>
                  </el-scrollbar>
                </div>
              </div>

              <!--上_右边-->
              <div style="flex: 3">
                <div>
                  <el-input
                    type="textarea"
                    :readonly="true"
                    :autosize="{ minRows: 12, maxRows: 12 }"
                    placeholder="暂无内容"
                    resize="none"
                    v-model="contentText"
                  ></el-input>
                </div>
              </div>
            </div>
          </div>

          <div :class="RealTimeVoiceToText ? 'guide_bg' : 'guide_bg_2'"></div>

          <!--下面-->
          <div style="background-color: #fff; height: 190px; padding: 10px">
            <el-form ref="form" :model="form" label-width="80px" :rules="rules">
              <el-form-item label="事件关联" prop="eventRelevance">
                <el-popover placement="bottom" v-model="visible" popper-class="eventOptions">
                  <div class="eventSearch">
                    <el-input v-model="searchText" placeholder="请输入关键字" size="small">
                      <i slot="suffix" class="el-input__icon el-icon-search" @click="searchEvent"></i>
                    </el-input>
                  </div>
                  <!-- <div class="recentOptions">
                <div class="recentTitle">近期选择：</div>
                <ul class="recentList">
                  <li class="eachRecent">08.27天河区自然灾害</li>
                </ul>
                  </div>-->
                  <template v-if="selectList.length > 0">
                    <ul class="eventList">
                      <li
                        v-for="item in selectList"
                        :key="item.id"
                        class="evenyEvent"
                        @click="selectEvent(item)"
                        :style="selectEventStyle(item.id)"
                      >{{ item.title }}</li>
                      <div class="loadMore">
                        <el-button
                          round
                          icon="iconfont icon-loadMore"
                          size="mini"
                          @click="loadMoreHandle"
                          v-if="loadMore"
                        >加载更多</el-button>
                        <div v-else>暂无更多数据</div>
                      </div>
                    </ul>
                  </template>
                  <template v-else>
                    <div style="text-align: center; margin-top: 10px">暂无数据</div>
                  </template>

                  <el-input
                    slot="reference"
                    v-model="form.eventTitle"
                    readonly
                    placeholder="请选择活动区域"
                    size="mini"
                  ></el-input>
                </el-popover>
              </el-form-item>
              <el-form-item label="接报备注" prop="caseNote">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 5, maxRows: 5 }"
                  resize="none"
                  v-model="form.caseNote"
                ></el-input>
                <!-- <div ref="toolbar" style="display: none"></div>
                <div ref="editor"></div> -->
              </el-form-item>
              <el-form-item label-width="0" class="flex-cen-xy">
                <el-button
                  :disabled="isCallPhone == 'talking' ? true : false"
                  type="primary"
                  size="mini"
                  @click="createEvent"
                >创建事件</el-button>
                <el-button
                  :disabled="isCallPhone == 'talking' ? true : false"
                  size="mini"
                  @click="clickSaveEvent('form')"
                >保存</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </aside>

      <!-- 主要内容右边 -->
      <aside v-if="RealTimeVoiceToText" class="popUpWindowDel_right">
        <div
          style="
            background-color: #fff;
            height: 530px;
            width: 100%;
            padding: 10px 0 0 10px;
          "
        >
          <div style="display: flex; align-items: center">
            <span
              style="
                display: inline-block;
                background-color: #0091ff;
                width: 2px;
                height: 12px;
              "
            ></span>
            <span style="font-size: 14px; padding-left: 10px; font-weight: bold">语音转文字</span>
            <!-- <div style="float:right"> -->
            <el-button @click="copy" style="padding: 7px 10px;margin-left:10px;">复制</el-button>
            <el-button @click="fillInComments" style="padding: 7px 10px;">填充备注</el-button>
            <!-- 功能上没用到 先隐藏，放出来会影响样式 author:hexinting date:20201202 -->
            <!-- <el-form>
              <el-form-item prop="caseNote">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 5, maxRows: 5 }"
                  resize="none"
                  v-model="form.caseNote"
                ></el-input>
                <div ref="toolbar" style="display: none"></div>
                <div ref="editor"></div>
              </el-form-item>
            </el-form> -->

            <!-- </div> -->
            <span style="display: inline-block">
              <img
                v-if="isCallPhone == 'hangUp'"
                style="
                  margin-left: 20px;
                  width: 17px;
                  height: 16px;
                  cursor: pointer;
                "
                src="/static/img/linkage.png"
                title="复制"
                v-clipboard:copy="textAll"
                v-clipboard:success="copyTextSuccess"
                v-clipboard:error="copyTextError"
              />
              <img
                style="
                  margin-left: 10px;
                  width: 17px;
                  height: 16px;
                  cursor: pointer;
                "
                src="/static/img/marshalling.png"
                title="覆盖文字内容"
                @click="saveToTextData"
              />
            </span>
          </div>
          <!-- 功能上没用到 先隐藏，放出来会影响样式 author:hexinting date:20201202 -->
          <div style="display:none;">
            <el-form>
              <el-form-item prop="caseNote">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 5, maxRows: 5 }"
                  resize="none"
                  v-model="form.caseNote"
                ></el-input>
                <div ref="toolbar" style="display: none"></div>
                <div ref="editor"></div>
              </el-form-item>
            </el-form>
          </div>

          <el-input
            type="textarea"
            v-model="callLog"
            ref="chatRecord"
            style="opacity: 0; position: absolute; top: 0; z-index: -9999;left:0px;"
          ></el-input>

          <div>
            <!--            <el-scrollbar style="height: 100%">-->
            <div
              style="height: 460px; overflow-y: auto; padding-bottom: 20px"
              ref="audioToTextBox"
              v-if="audioToText"
            >
              <div v-for="(item, index) in isAgentSpeekList" :key="item" style="font-size: 12px">
                <div
                  v-if="item.from == 2"
                  style="
                    display: flex;
                    justify-content: flex-start;
                    padding-top: 15px;
                  "
                >
                  <span
                    style="
                      display: inline-block;
                      width: 30px;
                      height: 30px;
                      border-radius: 50%;
                      line-height: 30px;
                      font-weight: 500;
                      font-size: 12px;
                      color: rgba(0, 145, 255, 1);
                      background: rgba(235, 248, 254, 1);
                    "
                  >{{ toName }}</span>
                  <span
                    style="
                      width: 75%;
                      text-align: left;
                      display: inline-block;
                      background: rgba(235, 248, 254, 1);
                      padding: 5px;
                      border-radius: 3px;
                      margin-left: 10px;
                      cursor:text;
                    "
                  >{{ item.text }}</span>
                </div>
                <div
                  v-if="item.from == 1"
                  style="
                    display: flex;
                    justify-content: flex-end;
                    padding-top: 15px;
                  "
                >
                  <span
                    style="
                      width: 75%;
                      text-align: left;
                      display: inline-block;
                      background: rgba(237, 255, 242, 1);
                      padding: 5px;
                      border-radius: 3px;
                      margin-right: 10px;
                      cursor:text;
                    "
                  >{{ item.text }}</span>
                  <span
                    style="
                      display: inline-block;
                      width: 30px;
                      height: 30px;
                      line-height: 30px;
                      border-radius: 50%;
                      font-size: 12px;
                      font-weight: 500;
                      color: rgba(11, 210, 149, 1);
                      background: rgba(237, 255, 242, 1);
                    "
                  >我</span>
                </div>
              </div>
            </div>
            <div style="height: 460px" v-if="!audioToText">
              <div style="width: 100%; height: 300px">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 23, maxRows: 23 }"
                  resize="none"
                  v-model="textAll"
                ></el-input>
              </div>
            </div>
            <!--            </el-scrollbar>-->
          </div>
        </div>
      </aside>
    </aside>
  </div>
</template>

<script>
import popUpWindowDelTop from './template/popUpWindowDelTop';
import { mapGetters } from 'vuex';
import { reverseValidatedNumber } from '../assets/interface/interface';
import bus from '@/components/common/js/eventBus';

import wangeditor from 'wangeditor';

export default {
    name: 'popUpWindow',
    computed: {
        ...mapGetters({
            isCallPhone: 'getIsCallPhone', //电话队列的通话状态
            isAgentSpeekList: 'getIsAgentSpeekList',
            phoneID: 'getCallHistoryId',
            buttonShow: 'getIsShowButton',
            isCallType: 'getIsCallType', //呼入还是呼出
        }),
        selectEventStyle() {
            return function(eventId) {
                if (this.form.eventRelevance == eventId) {
                    return 'color:#0091ff;background-color:rgba(0, 145, 255, .1);';
                } else {
                    return '';
                }
            };
        },
    },
    data() {
        return {
            RealTimeVoiceToText: window.g.RealTimeVoiceToText, // 是否支持实时语音转文字功能
            basicsData: {
                name: '',
                position: '',
                workUnit: '',
                phone: '',
                phoneState: 0,
                picture: '',
            }, // 传给popUpWindowDelTop的基础数据
            treeData: [],
            contentText: '',
            defaultProps: {
                children: 'children',
                label: 'name',
            },
            form: {
                eventRelevance: '',
                eventTitle: '',
                caseNote: '',
            },
            rules: {
                eventRelevance: [
                    {
                        required: true,
                        message: '请选择事件关联',
                        trigger: 'blur',
                    },
                ],
                caseNote: [
                    { required: true, message: '请填写备注', trigger: 'blur' },
                ],
            },
            selectList: [],
            moveDataelse: {
                x: null,
                y: null,
            },
            audioToText: true,
            textAll: '',
            agent_id: sessionStorage.getItem('agent_id') || '', //坐席ID
            pathname: '/eventReports',
            toName: '',

            editor: '',
            callLog: '',
            visible: false,
            currentPage: 1, // 事件列表页码
            searchText: '', // 事件列表搜索关键字
            loadMore: true, // 是否有更多事件数据
        };
    },
    watch: {
        isAgentSpeekList: {
            handler(newV, oldV) {
                this.$nextTick(() => {
                    let divBox = this.$refs.audioToTextBox;
                    console.log(divBox);
                    this.toName = this.basicsData.name.substr(
                        this.basicsData.name.length - 1,
                        1
                    );
                    divBox.scrollTop = divBox.scrollHeight;
                });
            },
            deep: true,
        },
        isCallPhone: {
            handler(neW, olD) {
                console.log(neW, olD);
                this.getCallMsg();
                if ((olD == '' || olD == 'hangUp') && neW == 'call') {
                    this.textAll = '';
                    this.audioToText = true;
                    this.$store.commit('setIsAgentSpeekList', []);
                }
                // if((olD=='talking'||olD=='hangUp') && neW==''){
                //     this.$store.commit("setIsAgentSpeekList", []);
                // }
            },
            deep: true,
        },
    },
    methods: {
        saveToTextData() {
            this.$confirm('此操作将覆盖实时转文字内容, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    let data = {
                        id: this.phoneID,
                        remark: this.textAll,
                    };
                    this.$api.updateRecordPhoneHisory(data).then(res => {
                        if (res.errorcode === 0) {
                            this.$message({
                                message: '更新成功!',
                                type: 'success',
                            });
                        } else {
                            this.$message.error('更新失败');
                        }
                    });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消',
                    });
                });
        },
        copyTextSuccess(e) {
            this.$message.success('复制成功');
        },
        copyTextError() {
            this.$message.error('复制失败');
        },
        recordingToText(data) {
            this.textAll = data;
            this.audioToText = false;
        },
        mouseDownHandleelse(event) {
            console.log('---按下鼠标按钮---');
            document.onselectstart = function() {
                return false;
            };
            this.moveDataelse.x = event.pageX - this.$refs.kongtiao.offsetLeft;
            this.moveDataelse.y = event.pageY - this.$refs.kongtiao.offsetTop;
            event.currentTarget.style.cursor = 'move';
            this.mouseMoveHandleelse(event);
        },
        mouseMoveHandleelse(event) {
            //计算出鼠标相对点击元素的位置,e.clientX获取的是鼠标的位置，OffsetLeft是元素相对于外层元素的位置
            let x = event.clientX - this.$refs.kongtiao.offsetLeft;
            let y = event.clientY - this.$refs.kongtiao.offsetTop;
            window.onmousemove = e => {
                // 获取拖拽元素的位置
                let left = e.clientX - x;
                let top = e.clientY - y;
                //console.log(document.documentElement.clientHeight,odiv.offsetHeight)
                // 把拖拽元素 放到 当前的位置
                if (left <= 0) {
                    left = 0;
                } else if (
                    left >=
                    document.documentElement.clientWidth -
                        this.$refs.kongtiao.offsetWidth
                ) {
                    //document.documentElement.clientWidth 屏幕的可视宽度
                    left =
                        document.documentElement.clientWidth -
                        this.$refs.kongtiao.offsetWidth;
                }

                if (top <= 0) {
                    top = 0;
                } else if (
                    top >=
                    document.documentElement.clientHeight -
                        this.$refs.kongtiao.offsetHeight
                ) {
                    // document.documentElement.clientHeight 屏幕的可视高度
                    top =
                        document.documentElement.clientHeight -
                        this.$refs.kongtiao.offsetHeight;
                }
                this.$refs.kongtiao.style.left = left + 'px';
                this.$refs.kongtiao.style.top = top + 'px';
            };
        },
        /**
         * @lastEditor hexinting
         * @lastDate 2020-11-16
         * @description 松开鼠标按钮事件
         */
        mouseUpHandleelse(event) {
            console.log('---松开鼠标按钮---');
            window.onmousemove = null;
            event.currentTarget.style.cursor = 'move';
            // bug8432 author:hexinting date:2020-11-16
            document.onselectstart = function() {
                return true;
            };
        },
        handleNodeClick(data) {
            this.$api.helpergetHelper({ id: data.id }).then(res => {
                if (res.errorcode === 0) {
                    this.contentText = res.data;
                }
            });
        },
        getData() {
            this.$api.helperGetTree().then(res => {
                if (res.errorcode === 0) {
                    this.treeData = res.data;
                }
            });
        },
        getEventList() {
            let ipData = {
                dtStart: '',
                dtEnd: '',
                searchText: this.searchText,
                page: this.currentPage,
                size: 10,
            };
            this.$api.todolist(ipData).then(res => {
                if (res.errorcode == 0) {
                    this.selectList.push(...res.data.data);
                    this.loadMore = res.data.data.length == 0 ? false : true;
                } else {
                    // //this.$message.error(res.msg)
                }
            });
        },
        /**
         * @lastEditor hexinting
         * @lastDate 2020-11-17
         * @description 创建事件
         */
        createEvent() {
            let phoneId = this.$store.getters.getCallHistoryId; // 电话历史id
            this.$store.commit('setPhoneHistoryId', {
                id: '',
                remark: '',
                name: this.basicsData.name,
                iphone: this.basicsData.mobile,
            });
            this.$store.commit('setTurnOnEmergencyResponse', false);
            sessionStorage.setItem('newID', 'newID');
            /* console.log(this.rowData.remark);
        sessionStorage.setItem('remark', this.rowData.remark); */
            this.$router.push({
                path: this.pathname,
            });

            let data = {
                phoneId: phoneId, // 电话历史id bug8501 author:hexinting date:2020-11-17
                content: this.textAll,
            };
            this.$api
                .createdEvent(data)
                .then(res => {
                    if (res.errorcode === 0) {
                        sessionStorage.setItem('createdEvent', res.data.event);
                        bus.$emit('addEvent');
                    } else {
                        sessionStorage.setItem('createdEvent', {});
                    }
                })
                .catch(() => {
                    sessionStorage.setItem('createdEvent', {});
                });
        },
        clickSaveEvent(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let data = {
                        id: this.phoneID,
                        eventId: this.form.eventRelevance,
                        remark: this.form.caseNote,
                    };
                    this.$api.ok(data).then(res => {
                        if (res.errorcode === 0) {
                            this.$message({
                                message: '保存成功',
                                type: 'success',
                            });
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        getCallMsg() {
            if (this.isCallType == 'callIng') {
                let data = this.$store.getters.getUserCall;
                this.basicsData.name = data ? data.name : '';
                this.basicsData.position = data ? data.position : '';
                this.basicsData.phone = data ? data.phone : '';
                this.basicsData.workUnit = data ? data.workUnit : '';
                this.basicsData.picture = data ? data.picture : '';
            }
            if (this.isCallType == 'callOut') {
                let data = this.$store.getters.getNowSelectPhoneList;
                console.log(data);
                this.basicsData.name =
                    data && data.length >= 1 ? data[0].content.name : '';
                this.basicsData.position =
                    data && data.length >= 1 ? data[0].content.position : '';
                this.basicsData.phone =
                    data && data.length >= 1 ? data[0].content.phone : '';
                this.basicsData.workUnit =
                    data && data.length >= 1 ? data[0].content.workUnit : '';
                this.basicsData.picture =
                    data && data.length >= 1 ? data[0].content.picture : '';
            }
        },

        //根据号码查询联系人
        async phoneTransform(number) {
            let data = { phoneNum: number };
            let phoneCall = {};
            await this.$api.findContactorByMobile(data).then(res => {
                phoneCall = {
                    name: res.data.name,
                    position: res.data.position,
                    phone: res.data.mobile,
                    workUnit: res.data.workUnit,
                    state: 0,
                };
            });
            return phoneCall;
        },

        initWangEditor() {
          let that = this
          this.editor = new wangeditor(this.$refs.toolbar, this.$refs.editor);
          this.editor.customConfig.menus = [];
          this.editor.customConfig.onchange = html => {
              this.form.caseNote = html;
          };
          // 创建富文本编辑器
          this.editor.create();
          this.editor.$textContainerElem
              .css('border', '1px solid #DCDFE6')
              .css('border-radius', '4px')
              .css('position', 'relative')
              .css('overflow', 'auto')
              .css('text-align', 'left')
              .css('font-size', '13px')
              .css('width', '100%')
              .css('height', '107px')
              .css('color', '#666')
              .css('cursor', 'text');
        },
        // 填充备注
        fillInComments() {
            // document.querySelectorAll('.w-e-text>p')[0].remove();
            // this.editor.txt.clear();
            // 清空接报备注
            this.form.caseNote = ''
            // bug9496 点击填充备注无反应 author：husiyue date：2020-12-22
            this.isAgentSpeekList.map(v => {
                if (v.from == 1) {
                  this.form.caseNote += `我 ${v.text}` + '\n'
                  // this.editor.txt.append(
                  //     `<p style="float:right">${v.text}  我</p><br/>`
                  // );
                } else if (v.from == 2) {
                  this.form.caseNote += `${this.toName} ${v.text}`+'\n'
                  // this.editor.txt.append(
                  //     `<p style="float:left">${this.toName} ${v.text}</p><br/>`
                  // );
                }
            });
        },
        // 复制到剪贴板
        copy() {
            this.callLog = '';
            this.isAgentSpeekList.map(v => {
                if (v.from == 2) {
                    this.callLog += '我  ' + v.text + '\n';
                } else if (v.from == 1) {
                    this.callLog += this.toName + '  ' + v.text + '\n';
                }
            });
            this.$nextTick(() => {
                let ele = this.$refs.chatRecord;
                console.log(ele);
                ele.select(); // 选择对象
                document.execCommand('Copy'); // 执行浏览器复制命令
                this.$message({
                    message: '已复制到剪切板',
                    type: 'success',
                });
            });
        },
        /**
         * @description: 选中的事件
         * @author: xuchuangxing
         * @lastEditor : xuchuangxing
         * @updateTime : 20201119 14:56
         * @param {obj} 选中的事件信息
         * @return {*}
         */
        selectEvent(obj) {
            this.visible = false;
            this.form.eventTitle = obj.title;
            this.form.eventRelevance = obj.id;
        },
        /**
         * @description: 搜索事件
         * @author : xuchuangxing
         * @lastEditor : xuchuangxing
         * @updateTime : 2020-11-19 15:06
         * @param {*}
         * @return {*}
         */
        searchEvent() {
            this.currentPage = 1;
            this.selectList = [];
            this.getEventList();
        },
        /**
         * @description: 每次追加10条事件列表
         * @author : xuchuangxing
         * @lastEditor : xuchuangxing
         * @updateTime : 2020-11-19 15:06
         * @param {*}
         * @return {*}
         */
        loadMoreHandle() {
            this.currentPage++;
            this.getEventList();
        },
    },
    mounted() {
        this.getData();
        this.getEventList();

        this.initWangEditor();
    },
    created() {
        // let that=this
        // this.$bus.$on('translate', function () {
        //   that.getCallMsg();
        // });
        this.getCallMsg();
    },
    components: {
        popUpWindowDelTop,
    },
};
</script>

<style scoped>
/* 大外套 */
.popUpWindowDel_wrap {
    width: 800px;
    height: 600px;
    box-shadow: 0px 3px 10px 2px rgba(44, 45, 46, 0.16);
    border-radius: 2px;
    background: rgba(234, 242, 246, 1);
    display: flex;
    flex-direction: column;
    position: absolute;
    z-index: 99;
    top: 10%;
    left: 30%;
}

/* 头部 */
.popUpWindowDel_header {
    width: 100%;
    background: url('/static/img/topBgrDel.png') no-repeat;
}

/* 主要内容 */
.popUpWindowDel_content {
    display: flex;
    flex: 1;
}

/* 主要内容左边 */
.popUpWindowDel_left {
    width: 470px;
    height: 100%;
    margin-right: 10px;
}
.popUpWindowDel_left_2 {
  width: 100%;
  height: 100%;
}

/* 主要内容右边 */
.popUpWindowDel_right {
    width: 310px;
    height: 100%;
    position: relative;
}

>>> .el-form-item {
    margin-bottom: 0;
}

.span-ellipsis {
    width: 100%;
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
    font-size: 12px;
    letter-spacing: 1px;
    text-overflow: ellipsis;
}

.oy-active {
    display: none;
}

>>> .w-e-text-container {
    /* 层级太高了导致覆盖了语音转文字弹窗 */
    z-index: 200 !important;
}

.guide {
  width: 160px;
  height: 263px;
  border-radius: 3px;
  border: 1px solid rgba(221, 221, 221, 1);
}
.guide_2 {
  width: 290px;
  height: 263px;
  border-radius: 3px;
  border: 1px solid rgba(221, 221, 221, 1);
}

.guide_bg {
  width: 480px;
  height: 10px;
  background: rgba(234, 242, 246, 1);
}

.guide_bg_2 {
  width: 100%;
  height: 10px;
  background: rgba(234, 242, 246, 1);
}
</style>
