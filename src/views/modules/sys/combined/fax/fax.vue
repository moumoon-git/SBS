<template>
  <div class="faxRoot">
    <div class="faxRoot__leftTree">
      <!-- <fax-tree
        @handleNodeClick="handleNodeClick"
        @addTree="addEventType"
        @getCheckedIds="getCheckedIds"
        ref="faxTree"
      ></fax-tree> -->
      <FaxDispatchLeft
        ref="SMSDispatchLeft"
        :selected-list.sync="selectedList"
        @handleCheckChange="handleCheckChange"
      />
    </div>
    <div class="faxRoot__center">
      <div class="faxRoot__selections">
        <div class="faxRoot__tags">
          <el-tag
            v-for="(item, idx) in selectedList"
            :key="idx"
            type="info"
            effect="plain"
            closable
            size="small"
            disable-transitions
            style="margin-right: 10px;margin-bottom: 10px;"
            @close="deleteSelection(item)"
          >
            {{ item.name || item.groupName || item.fax }}
          </el-tag>
          <el-tag
            v-for="(item, idx) in extraNumber"
            :key="`${item.fax}-${idx}`"
            type="info"
            effect="plain"
            closable
            size="small"
            disable-transitions
            style="margin-right: 10px;margin-bottom: 10px;"
            @close="deleteExtraFaxNumber(item)"
          >
            {{ item.name || item.fax }}
          </el-tag>
          <el-input
            v-if="inputVisible"
            ref="saveTagInput"
            v-model="inputValue"
            size="small"
            class="faxRoot__input"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          />
        </div>
        <div class="faxRoot__selectionsBottom">
          <div>
            <span style="color:#666666">收件单位</span>&nbsp;&nbsp;<span
              style="display:inline-block;width:24px;height:22px;background:#F3F3F7;border-radius:4px;color:#333333;font-weight:600"
              >{{ selectedList.length }}</span
            >
          </div>

          <div style="font-size: 12px;">
            <el-button type="text" style="" @click="clearup">清空</el-button>
            <span style="color:#D8D8D8">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
            <el-button type="text" @click="addNumber">添加号码</el-button>
          </div>
        </div>
      </div>
      <div class="faxRoot__uploadFax">
        <div class="faxRoot__file">
          <h4>
            <span style="color:red">*</span><span style="">传真文件</span>
          </h4>
          <el-upload
            class="faxRoot__upload"
            action="#"
            :on-success="handleSuccess"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-error="handleError"
            :before-remove="beforeRemove"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList"
            :http-request="upload"
          >
            <el-button
              class="faxRoot__uploadBtn"
              plain
              size="small"
              icon="el-icon-upload"
              >上传文件</el-button
            >
          </el-upload>
        </div>

        <div class="faxRoot__preview">
          <!-- <el-tooltip effect="dark" content="预览文件" placement="top">
            <el-image
              class="faxRoot__image"
              :src="require('@/assets/img/previewDocument.png')"
              @click="previewDocument"
            ></el-image> </el-tooltip
          > -->
          <el-button
            class="faxRoot__btn"
            type="primary"
            size="mini"
            @click="sendFax"
            :disabled="!(selectedList.length > 0 && fileList.length > 0 || extraNumber.length > 0 && fileList.length > 0)"
            >发送</el-button
          >
          <el-button
            type="text"
            @click="switchToFaxRecord"
          >
            查看队列
          </el-button>
        </div>
      </div>
    </div>
    <div class="faxRoot__right">
      <div class="faxRoot__pretitle">
        <div
          style="width:2px;height:13px;background:rgba(0,145,255,1);margin-right:8px"
        ></div>
        <span style="font-weight:500;font-size:14px;color:rgba(51,51,51,1);"
          >传真预览</span
        >
      </div>
      <div v-if="previewFile" style="margin-top:20px;width: 95%;overflow: auto;">
        <!-- <fax-preview :document="previewFile"></fax-preview> -->
        <iframe
          :src="previewFile.url"
          width="100%"
          height="750px"
          frameborder="1"
        ></iframe>
      </div>
      <div class="faxRoot__image" v-else>
        <el-image :src="require('@/assets/img/noFile.png')"></el-image>
        <div style="color:#CAD5E8">暂无预览</div>
      </div>
    </div>

    <fax-state ref="faxState"></fax-state>
  </div>
</template>

<script>
import faxTree from "./faxComponents/faxTree";
import faxPreview from "./faxComponents/previewFax";
import faxState from "./faxComponents/faxState";
import FaxDispatchLeft from './faxComponents/FaxDispatchLeft.vue';
import Cookies from "js-cookie";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import bus from "@/views/common/js/eventBus";
const countDownTime = 10;

export default {
  components: {
    "fax-tree": faxTree,
    "fax-preview": faxPreview,
    "fax-state": faxState,
    FaxDispatchLeft,
    // "fax-add-or-update": faxAddOrUpdate
  },
  data() {
    return {
      platformId: this.$store.state.user.platformId, // 用户平台id
      checkedIds: {}, // 当前变化的复选框
      checkedNodes: [], // 选择的传真对象

      fileList: [], //发送文件列表
      inputVisible: false, // 标签新加号码
      inputValue: "", // 新建标签值
      extraNumber: [], // 额外添加的传真号码
      tableData: [],

      sendStatus: [
        {
          id: 0,
          label: "待发送"
        },
        {
          id: 1,
          label: "发送中"
        },
        {
          id: 2,
          label: "发送成功"
        },
        {
          id: 3,
          label: "发送失败"
        },
        {
          id: 4,
          label: "已取消"
        },
        {
          id: 5,
          label: "已暂停"
        },
      ],

      page: 1, // 请求的页数 
      pageSize: 10, // 每页请求的数据条数

      countDowm: [], // 倒计时时间 countDownTime秒
      interval: "", // 定时器对象
      // 选中的预览文件
      previewFile: null,
      selectedList: [],
    };
  },
  watch: {
    selectedList: {
      handler(newVal) {
        console.log('监听selectedList：', newVal);
      },
      deep: true,
      immediate: true,
    }
  },
  mounted() {
    this.initWebSocket();
    this.initNewWebSocket();
    this.getFaxListForm();

    // 获取传真文件
    bus.$on("getFaxFile", faxFile => {
        let pdfFile = {
            url:faxFile.faxFile,
            name:faxFile.faxName
        }
        this.fileList = [pdfFile]
    });
  },
  methods: {
    /**
     * @description 获取分组树数据
     */
    getGroupTree(faxNumber) {
      return new Promise((resolve) => {
        // 请求参数
        const request = {
          method: 'get',
          baseURL: window.SITE_CONFIG.baseUrl,
          url: '/mail/mailgroup/list',
          params: {
            search: faxNumber,
            isTree: 0,
          },
        };
        this.$http(request)
          .then(
            ({ data: response }) => {
              console.log('查询树状分组', response);
              if (response.code === 0 || response.errorcode === 0) {
                resolve(response.data);
              }
            },
          )
      })
    },
    // 点击树形节点事件
    handleNodeClick(obj) {
      console.log(obj);
      //   function findChilden(obj, list) {
      //     list.push(obj.id);
      //     let children = obj.children;
      //     // console.log(list)
      //     if (children != null) {
      //       children.forEach((item, index) => {
      //         // console.log(item)
      //         findChilden(item, list);
      //       });
      //     }
      //   }

      //   // console.log('树形结点点击事件', obj)
      //   this.selectedNode = [];
      //   this.currentTreeObject = obj.id;
      //   this.treeForm.currentTreename = obj.name;
      //   this.search = "";
      //   // 分组描述
      //   this.treeForm.groupingdescription = obj.remark;
      //   this.treeForm.type = obj.type;
      //   this.currentTreeplatformId = obj.platformId;
      //   this.currentTreeparentId = obj.parentId;
      //   this.currentTreeancestors = obj.ancestors;

      //   findChilden(obj, (this.selectedNode = []));

      //   // console.log('selectedNode:' + this.selectedNode)
      //   // console.log(this.currentTreeObject)
      //   // console.log(this.treeForm.currentTreename)
      //   // 查询树形关联的联系人
      //   this.$http({
      //     url: this.$http.adornUrl(`/mail/mailcontactor/list`),
      //     method: "POST",
      //     data: this.$http.adornData({
      //       limit: this.pageSize,
      //       page: 1,
      //       groupId: this.selectedNode,
      //       platformId: String(this.sharedPlatform.platformId)
      //     })
      //   }).then(({ data }) => {
      //     if (data && data.code === 0) {
      //       // console.log(data)
      //       this.totalCount = data.data.totalCount;
      //       this.currPage = data.data.currPage;
      //       this.pageSize = data.data.pageSize;
      //       this.platShareMenuList = data.data.list;
      //     } else {
      //       this.$message.error(data.msg);
      //     }
      //   });
    },

    // 添加分组
    addEventType() {
      this.eventtypeAddOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.eventtypeAddOrUpdate.init(null, null, 2); // 代表新增
      });
    },
    // 树形复选框勾选ID
    getCheckedIds(checkedIds, checkedNodes) {
      this.checkedIds = checkedIds;
      this.checkedNodes = checkedNodes.checkedNodes;

      // console.log("接收到的数据1", checkedIds);
      // console.log("接收到的数据2", checkedNodes);
    },

    // 删除选择的传真对象
    deleteSelection(item) {
      const selectIdx = this.selectedList.findIndex((e) => e.id === item.id || e.fax === item.fax);
      console.log(item, selectIdx);
      this.selectedList.splice(selectIdx, 1);
      this.$nextTick(() => {
        this.$refs.SMSDispatchLeft.handleCheckShow();
      });
    },

    // 删除额外添加的传真号码
    deleteExtraFaxNumber(item) {
      this.extraNumber.splice(this.extraNumber.indexOf(item), 1);
    },

    // 清空传真对象数组
    clearup() {
      this.selectedList = [];
      this.extraNumber = [];
      // this.$refs.faxTree.setCheckedKeys(this.checkedNodes);
    },

    // 添加号码
    addNumber() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      const inputValue = this.inputValue;
      var reg = new RegExp("^[0-9]*$");
      if (!reg.test(inputValue)) {
        this.$message.error('传真号只能输入数字');
        return;
      }
      if (inputValue) {
        this.getGroupTree(inputValue).then((res) => {
          // 传真号码存在通讯录里
          if (res.length > 0) {
            res.forEach((item) => {
              // const index = this.extraNumber.findIndex((el) => item.id === el.id);
              // if (index < 0) {
              //   this.extraNumber.push(item);
              // }
              const index = this.selectedList.findIndex((el) => item.id === el.id);
              if (index < 0) {
                const obj = { ...item };
                obj.groupType = 'contacts';
                this.selectedList.push(obj);
                this.$nextTick(() => {
                  this.$refs.SMSDispatchLeft.handleCheckShow();
                });
              }
            });
          } else {
            // 传真号码不存在通讯录里
            this.extraNumber.push({
              fax: inputValue,
            });
            // this.selectedList.push({
            //   fax: inputValue,
            // });
          }
        });
      }
      this.inputVisible = false;
      this.inputValue = '';
    },

    // 发送传真(不即时发送，定时一分半后发送)
    sendFax() {
      const memberList = this.selectedList.concat(this.extraNumber);
      this.$http({
        baseURL: window.SITE_CONFIG.cloudUrl,
        url: '/event/fax/sendFax',
        method: 'post',
        data: this.$http.adornData({
          senderFaxNo: '',
          sendTime: '',
          appAttachmentId: this.fileList.map((file) => file.id).join(),
          faxName: this.fileList.map((file) => file.name).join(),
          faxFileUrl: this.fileList.map((file) => file.url).join(),
          memberList: memberList.map(
            (item) => {
            return {
              'receiverFaxNo': item.fax,
              'contactType': item.groupType === 'messages' ? 3 : item.groupType==='contacts' ? 2 : 0,
              'contactId': item.id || '',
            }
          }),
        }),
      }).then(({ data }) => {
        console.log('/event/fax/sendFax', data);
        if (data.errorcode === 0) {
          this.$message.success('格式正确传真号发送成功');
          this.getFaxListForm();
        } else {
          this.$message.error('发送传真失败');
        }
        let countDownObj = {
          historyId: data.historyId,
          time: countDownTime,
          interval: ""
        };

        this.countDowm.push(countDownObj);

        let idx = this.countDowm.findIndex(
          item => item.historyId == data.historyId
        );
        this.countDowm[idx].interval = setInterval(() => {
          this.countDowm[idx].time--;
          if (this.countDowm[idx].time === 0) {
            clearInterval(this.countDowm[idx].interval);
            // this.countDowm[idx].time = countDownTime;
            // this.countDowm[idx].interval = "";
            console.log(11111);
            // 以下进行发送传真请求
          }
        }, 1000);

        // this.tableData.unshift({
        //   id: 4,
        //   historyId: data.historyId,
        //   sendDate: "2020-05-22 00:00:00",
        //   sendStatus: 1,
        //   successCount: 1,
        //   failCount: 2,
        //   numberCount: 6
        // });
      });
    },

    // 取消发送传真
    handleCancel(index, row) {
      console.log(row);
      let currentCountDown = this.countDowm.findIndex(
        item => item.historyId == row.historyId
      );
      clearInterval(this.countDowm[currentCountDown].interval);
      this.countDowm[currentCountDown].time = 0;
      this.countDowm[currentCountDown].interval = "";
      // clearInterval(this.interval);
      // this.countDowm = countDownTime;
      // this.interval = "";
    },

    /**
          以下为文件上传相关函数
     */
    previewDocument() {
      let { url } = this.fileList;
    },

    handleSuccess(response, file, fileList) {
      console.log(response, file, fileList);
    },

    /**
     * @description 移除已上传的文件
     * @param { Object } file 需要被移除的文件
     */
    handleRemove(file) {
      const index = this.fileList.findIndex((item) => item.id === file.id);
      this.fileList.splice(index, 1);
    },

    handlePreview(file) {
      this.previewFile = { url: window.SITE_CONFIG.cloudUrl + file.url };
      // this.previewFile = file;
    },
    handleError(file) {
      this.$message.error("上传失败");
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `最多上传3份文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },

    //上传文件
    upload(files) {
      const formData = new FormData();
      formData.append('file', files.file);
      formData.append('type', 6);
      this.$http({
        url: '/appAttachment/fileUploadAttachment',
        baseURL: window.SITE_CONFIG.fileupload,
        method: 'post',
        data: formData,
      })
        .then(({ data }) => {
          console.log('/appAttachment/fileUploadAttachment', data);
          if (data.errorcode === 0) {
            const templateFile = {
              id: data.data.id,
              // name: data.data.url.split('/').pop(),
              name: data.data.title,
            };
            if (data.data.url.search('pdf') === -1) {
              this.$http({
                baseURL: window.SITE_CONFIG.cloudUrl,
                url: '/event/fax/previewFax',
                method: 'get',
                params: this.$http.adornParams({
                  attachmentId: data.data.id,
                }),
              }).then(({ data }) => {
                console.log('/event/fax/previewFax', data);
                if (data.errorcode === 0) {
                  this.previewFile = { url: window.SITE_CONFIG.cloudUrl + data.data };
                  templateFile.url = data.data;
                  this.fileList = [templateFile];
                }
              });
            } else {
              this.previewFile = { url: window.SITE_CONFIG.cloudUrl + data.data.url };
              templateFile.url = data.data.url;
              this.fileList = [templateFile];
            }
          } else {
            this.$message.error('上传失败');
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },

    /**
      以下为传真队列
    */

    // 连接
    initWebSocket() {
      var that = this;
      that.connection();
      // 断开重连机制,尝试发送消息,捕获异常发生时重连
      this.timer = setInterval(() => {
        try {
          that.globalStompClient.send(
            "/platform/check",
            {},
            JSON.stringify({ to: that.platformId })
          );
          // 连接3.0唯一的
        } catch (err) {
          that.connection();
        }
      }, 10000);
    },
    // 连接
    connection() {
      var that = this;
      // 连接SockJS的endpoint名称为"endpointOyzc"
      // var socket = new SockJS('http://127.0.0.1:8888/endpointOyzc');
      that.socket = new SockJS(`${window.SITE_CONFIG.websocket}`);
      // 使用STMOP子协议的WebSocket客户端
      that.stompClient = Stomp.over(that.socket);
      that.globalStompClient = that.stompClient;
      // 连接WebSocket服务端
      that.stompClient.connect({}, function(frame) {
        // 通过stompClient.subscribe订阅/topic/getResponse 目标(destination)发送的消息
        // "/platform/" + that.platformId + "/message",
        that.stompClient.subscribe(
          "/topic/" + that.platformId + "/fax/faxMessage",
          function(response) {
            // alert(11111)
            var str = response.body;
            console.log("平台广播", response);
            let body = JSON.parse(response.body);
            console.log("解析数据", body);
          }
        );
      });
    },
    // 断开
    disconnect() {
      if (this.globalStompClient != null) {
        this.globalStompClient.disconnect();
      }
      // console.log('Disconnected', '平台广播')
    },
/**
* @desc 链接3.0唯一的websocket
* @param {} params
* @returns {} returns
*/
   // 连接
   initNewWebSocket() {
      const that = this;
      that.connection2();
    },
    // 连接
    connection2() {
      const that = this;
      that.socket = new SockJS(window.SITE_CONFIG.websocket);
      // 使用STMOP子协议的WebSocket客户端
      that.stompClient = Stomp.over(that.socket);
      // 连接WebSocket服务端
      that.stompClient.connect({}, (frame) => {
        console.log('链接了传真队列ws'+frame)
        // 通过stompClient.subscribe订阅/topic/getResponse 目标(destination)发送的消息
        that.stompClient.subscribe(
          `/platform/${Cookies.get('platformId')}/message`,
          function (response) {
            console.log('recieve websocket response:', response);
            const str = JSON.parse(response.body).msgType;
            console.log(JSON.parse(response.body))
            console.log(str);
            if(str===80002){
              that.getFaxListForm()
            }
          },
        );
      });
    },
    // 获取传真队列表格数据
    getFaxListForm() {
      this.$http({
        baseURL: window.SITE_CONFIG.cloudUrl,
        url: '/event/fax/getSendFaxQueue',
        method: 'get',
        params: this.$http.adornParams({
          pageNo: 1, // this.page
          pageSize: 50, // this.pageSize
          sendStatus: '',
        }),
      }).then(({ data }) => {
        console.log('/event/fax/getSendFaxQueue', data);
        if (data.errorcode === 0) {
          this.tableData = [...data.data.data];
        }
      // this.tableData = [
      //   {
      //     id: 4,
      //     historyId: 6,
      //     sendDate: "2020-05-22 00:00:00",
      //     sendStatus: 3,
      //     successCount: 1,
      //     failCount: 2,
      //     numberCount: 6
      //   },
      //   {
      //     id: 5,
      //     historyId: 7,
      //     sendDate: "2020-05-22 01:01:01",
      //     sendStatus: 2,
      //     successCount: 2,
      //     failCount: 1,
      //     numberCount: 3
      //   },
      //   {
      //     id: 6,
      //     historyId: 8,
      //     sendDate: "2020-05-22 00:00:00",
      //     sendStatus: 2,
      //     successCount: 1,
      //     failCount: 1,
      //     numberCount: 3
      //   },
      //   {
      //     id: 7,
      //     historyId: 9,
      //     sendDate: "2020-05-22 00:00:00",
      //     sendStatus: 3,
      //     successCount: 1,
      //     failCount: 5,
      //     numberCount: 7
      //   }
      // ];
      });
    },

    // 查看传真传送状态
    handleCheck(index, row) {
      console.log(index, row);
      this.$refs.faxState.checkFaxState = true;
      this.$refs.faxState.faxDetail = row;
    },
    // 勾选树
    handleCheckChange(data, checked) {
      console.log('勾选：', data)
      if (checked) {
        this.selectedList.push(data);
      } else {
        this.selectedList = this.selectedList.filter((el)=>el.id!==data.id);
      }
      console.log('当前勾选树', this.selectedList);
    },
    /**
     * 点击【查看队列】，跳转到传真记录
     */
    switchToFaxRecord() {
      this.$emit('switch-to-fax-record');
    },
  },
  destroyed(){
      bus.$off("getFaxFile");
  }
};
</script>

<style lang="less" scope>
.faxRoot {
  width: 100%;
  min-width: 1000px;
  background: #f4f4f4;
  display: flex;
  justify-content: space-between;

  .faxRoot__leftTree {
    // width: 18.67%;
    // width: 21.85%;
    overflow: auto;
    width: 300px;
    height: 85vh;
    // width: 255px;

    // min-width: 255px;
    min-height: 612px;
    background: #fff;
    box-sizing: border-box;
    // border: 1px solid red;
  }

  .faxRoot__center {
    // width: 33.38%;
    // width: 39.07%;
    width: calc((100% - 300px) / 2);
    // width: 456px;
    // min-width: 456px;
    box-sizing: border-box;
    padding: 10px;
    background: #fff;
    // border: 1px solid blue;
    // display: flex;
    // flex-direction: column;
    // justify-content: space-between;

    .faxRoot__selections {
      height: 80.75%;
      border-radius: 3px;
      border: 1px solid rgba(234, 230, 230, 1);
      box-sizing: border-box;
      padding: 7px 9px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .faxRoot__tags {
        display: flex;
        flex-wrap: wrap;
      }

      .faxRoot__input {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
      }

      .faxRoot__selectionsBottom {
        margin-bottom: 4px;
        display: flex;
        justify-content: space-between;
      }
    }

    .faxRoot__uploadFax {
      margin-top: 10px;

      height: 18.33%;
      border-radius: 3px;
      border: 1px solid rgba(234, 230, 230, 1);

      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      
      position: relative;

      .faxRoot__file {
        display: flex;
        align-items: center;
        margin: 12px 10px;

        .el-upload-list,
        .el-upload-list--text {
          position: absolute !important;
          left: 200px;
          top: 0;
          width: 200px;
        }

        .faxRoot__uploadBtn {
          width: 94px;
          height: 32px;
          margin-left: 20px;
        }
      }

      .faxRoot__preview {
        display: flex;
        height: 50px;
        background: #f9fcff;
        justify-content: space-between;
        align-items: center;
        padding-left: 15px;
        padding-right: 10px;
        flex-direction: row-reverse;
      }
    }

    .faxRoot__faxTable {
      margin-top: 10px;
      height: 34.86%;
      border-radius: 3px;
      border: 1px solid rgba(234, 230, 230, 1);
      box-sizing: border-box;
      padding: 8px 0;
      color: #666666;

      .faxRoot__tableTitle {
        width: 100%;
        display: flex;
        align-items: center;
        margin: 0 12px;
      }

      .faxRoot__table-success {
        color: #0bd295;
      }

      .faxRoot__table-fail {
        color: #f66e6e;
      }

      .faxRoot__table-await {
        color: #f2b626;
      }
    }
  }

  .faxRoot__right {
    // width: 33.38%;
    // width: 39.07%;
    width: calc((100% - 300px) / 2);
    // width: 23%;
    // width: 456px;
    // min-width: 456px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;

    .faxRoot__pretitle {
      width: 100%;
      display: flex;
      align-items: center;
      // margin: 0 12px;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
    }

    .faxRoot__image {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 100px;
    }
  }
}
</style>
