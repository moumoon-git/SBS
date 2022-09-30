<template>
  <div class="playView">
    <el-header style="height: 80px; clear: both" class="left">
      <div style="width: 100%; display: flex">
        <div class="tableClass">
          <div style="display: flex; justify-content: space-between">
            <el-button
              @click="pageIndex=1;date='';getDataList()"
              type="primary"
              size="small"
              icon="el-icon-refresh"
              >更新相册</el-button
            >
            <el-form :model="dataForm" @keyup.enter.native="pageIndex=1;getDataList()">
              <el-date-picker
                v-model="date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
              <el-button
                @click="pageIndex=1;getDataList();"
                type="primary"
                size="small"
                style="margin-left: 10px"
                >查询</el-button
              >
            </el-form>
          </div>
          <div style="margin-top: 5px">
              <div style="display:flex;flex-wrap: wrap;">
                  <div v-for="item in dataList" :key="item.id" style="width:25%;position:relative;">
                    <img :src="item.imgVo.allUrl"  alt="" width="100%" height="200px" style="padding: 3px;">
                    <el-checkbox v-model="item.imgVo.noSelect" :true-label="JSON.stringify(item.imgVo)" :false-label="JSON.stringify(item.imgVo)" @change="selectImgChange" style="position:absolute;bottom: 10px;right:10px;"></el-checkbox>
                  </div>
              </div>
            <el-pagination
              @size-change="sizeChangeHandle"
              @current-change="currentChangeHandle"
              :current-page="pageIndex"
              :page-sizes="[12, 20, 50, 100]"
              :page-size="pageSize"
              :total="totalPage"
              layout="total, sizes, prev, pager, next, jumper"
              style="margin-top: 20px"
            ></el-pagination>
          </div>
        </div>
        <div class="screenshot" style="margin-top: 36px">
          <videoPreviewTreeCrud
            ref="resoureteamTreeCrud"
            @close="resoureteamTreeCrudVisible = false"
            :reportParams="reportParams"
            :selectInvitedToJoinList="selectInvitedToJoinList"
            @invitedToJoin="contactViewHandle"
            @delSelectImg="delSelectImg"
          ></videoPreviewTreeCrud>
        </div>
      </div>
    </el-header>
    <MonitorDialog ref="MonitorDialog" />
    <!-- 新增联系人视图 -->
    <linkman-draggable
      ref="commonLink"
      v-show="showcommonLink"
      @OnchildByValue="handelLinkdata"
    ></linkman-draggable>
  </div>
</template>

<script>
import AddOrUpdate from './riskcamera-add-or-update';
import MonitorDialog from './MonitorDialog.vue';
import videoPreviewGrouptreeCrud from './videoPreview-groupTree-crud';
import videoPreviewTreeCrud from './videoPreview-tree-crud';
import LinkmanDraggable from '../../risk/riskvehiclealarm/LinkmanDraggable ';

var token = document.cookie;
var httpaddress = window.SITE_CONFIG.baseUrl;
export default {
  data() {
    return {
      invitedToJoinList: [],
      selectInvitedToJoinList: [],
      reportParams: '',
      showcommonLink: false,
      cameraData2: [],
      // 总条目数
      totalCount: 0,
      indexCode: '',
      resoureteamTreeCrudVisible: false,
      statusData: [
        { value: 1, label: '启用' },
        { value: 0, label: '未启用' },
      ],
      cameraSelect: [],
      cameraType: '', //相机类型
      dataList: [],
      pageIndex: 1,
      pageSize: 12,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      dataForm: {
        key: '',
        enclosure: '',
        fileName: '',
      },
      date: '',
    };
  },
  components: {
    AddOrUpdate,
    MonitorDialog,
    videoPreviewGrouptreeCrud,
    videoPreviewTreeCrud,
    LinkmanDraggable,
  },
  mounted() {
    this.handlePreview();
  },
  created() {
    this.getCameraType();
    this.getDataList();
  },
  methods: {
    // 表单复选框勾选ID
    selectionChangeHandle(dataIds) {
      this.dataIds = dataIds;
    },
    // 选择联系人视图
    contactViewHandle() {
      this.showcommonLink = true;
      this.$refs.commonLink.isShowAll = false;
      this.$nextTick(() => {
        this.$refs.commonLink.handleAddContacts(
          '/mail/mailgroup/list',
          '请选择',
        );
      });
    },
    // 选择联系人数据
    handelLinkdata({ linkman }) {
      this.selectInvitedToJoinList = [];
      for (var i = 0; i < linkman.length; i++) {
        this.selectInvitedToJoinList.push({
          name: linkman[i].name,
          openId: linkman[i].openId,
          id: linkman[i].id,
        });
      }
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      console.log('this.date: ', this.date);
      let startTime = this.date&&this.date[0]
      let endTime = this.date&&this.date[1]
      let params = {
        page: this.pageIndex,
        size: this.pageSize,
        startTime,
        endTime,
      };
      this.$api.getMeetingImg(params).then(( res ) => {
        if (res && res.code === 0) {
          this.dataList = res.page.list;
          if( this.dataList.length>0) {
              this.dataList.map(v=>{
                  v.imgVo.noSelect = false
              })
          }
          this.totalPage = res.page.totalCount;
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
        this.dataListLoading = false;
      });
    },
    // 选择小区
    handleChangePlatform() {
      if (
        (this.sharePlatformId != null && this.sharePlatformId != '') ||
        this.cameraType != null
      ) {
        this.getDataList();
      } else {
        this.sharePlatformId = '';
      }
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    handlePreview() {
      var socket = new WebSocket(window.SITE_CONFIG['websocket_phone']);
      socket.onmessage = (evt) => {
        var receiveMessage = JSON.parse(evt.data);
        var messageData = JSON.parse(receiveMessage.data);
        let index = this.rowIndex;
        if (receiveMessage.type == 'StopRealPlay' && receiveMessage.code == 0) {
          this.codeNum = messageData.devNum;
          this.$emit('refrehStatus', this.codeNum, true);
        } else if (
          receiveMessage.type == 'StartRealPlay' &&
          receiveMessage.code == 0
        ) {
          this.codeNum = messageData.devNum;
          this.$emit('refrehStatus', this.codeNum, false);
        }
      };
    },
    /**
     * @method
     * @desc 打开监控视频弹窗
     */
    openMonitor(row, index) {
      let indexCode = '';
      this.rowIndex = index;
      var type = '';
      if (row.status == '0') {
        //未启用状态
        type = 'StartRealPlay';
        this.isView = false;
      } else if (row.status == '1') {
        type = 'StopRealPlay';
        this.isView = true;
      }

      if (
        row.indexCodeList &&
        row.indexCodeList.length &&
        row.indexCodeList[0]
      ) {
        indexCode = row.indexCodeList[0];
      } else {
        indexCode = row.indexCode.split(',')[0];
      }
      // this.$refs.MonitorDialog.init(indexCode);
      var ws = new WebSocket(window.SITE_CONFIG['websocket_phone']);

      var sendMsg = {
        type: type,
        phone: indexCode,
      };
      // this.$emit("refrehStatus", row.codeNum, this.isView);
      ws.onopen = function () {
        ws.send(JSON.stringify(sendMsg));
      };
      ws.onmessage = (evt) => {
        var previewMessage = JSON.parse(evt.data);
        if (previewMessage.code == 0) {
          this.$emit('refrehStatus', row.codeNum, this.isView);
          ws.close();
        }
      };
      ws.onerror = function (evt) {
        // console.log("WebSocket错误信息：", evt);
      };
    },
    /**
     * @description: 获取相机类型
     * @param {*}
     * @return {*}
     */
    getCameraType() {
      this.$http({
        url: this.$http.adornUrl(
          `/sys/sysdictionary/getSysDictionaryListByCode?code=VIDEO_CAMERA_TYPE`,
        ),
        method: 'get',
        params: this.$http.adornParams({}),
      }).then((data) => {
        this.cameraSelect = data.data.data;
        this.cameraSelect.unshift({
          code: '',
          name: '全部',
        });
      });
    },
    selectImgChange(imgJSON){
        let imgData = JSON.parse(imgJSON)
        // console.log('imgData: ', imgData);
        if (!imgData.noSelect) {
            this.dataList.map(v=>{
                if (v.imgVo.name == imgData.name) {
                    v.imgVo.noSelect = true
                }
            })
            this.$forceUpdate();
            this.$refs.resoureteamTreeCrud.imageUrl.push({ name: imgData.name, url: imgData.allUrl ,filePath:imgData.url})
        }else{
            this.noSelectImg(imgData.name)
            let imgArr = this.$refs.resoureteamTreeCrud.imageUrl
            console.log('imgArr: ', imgArr);
            console.log('imgData.fileName: ', imgData.name);
            this.$refs.resoureteamTreeCrud.imageUrl = imgArr.filter(v=>v.name != imgData.name)
        }
    },
    noSelectImg(name){
        this.dataList.map(v=>{
            if (v.imgVo.name == name) {
                v.imgVo.noSelect = false
            }
        })
        this.$forceUpdate();
    },
    delSelectImg(name){
        this.noSelectImg(name)
    }
  },
};
</script>
<style lang="less">
.tableClass {
  padding: 3px;
  width: 82%;
  min-width: 540px;
  // 监控按钮及悬浮情况
  .button-monitor {
    display: inline-block;
    width: 18px;
    height: 19px;
    cursor: pointer;
    margin-top: 10px;
    background: no-repeat
      url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTggMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+55uR5o6nPC90aXRsZT4KICAgIDxnIGlkPSLpgJrnlKjlm77moIciIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSLooajmoLzpgJrnlKjlm77moIciIHRyYW5zZm9ybT0idHJhbnNsYXRlKC02ODAuMDAwMDAwLCAtOTguMDAwMDAwKSIgZmlsbD0iIzlGQzhGRSIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGcgaWQ9Iue8lue7hC0zIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2Ni4wMDAwMDAsIDMwLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9Iue8lue7hCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjUuMDAwMDAwLCA2OC4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNTUzLjQwNjY2NywxMC43Nzc5NDQzIEw1NTEuNzAzMzMzLDEwLjc3Nzk0NDMgTDU1MS43MDMzMzMsOC42NDg3Nzc2NyBMNTUwLDguMzM0NDcyMTIgTDU1MCwxNS4xOTQ0NDQyIEw1NTEuNzAzMzMzLDE0LjY0Mjg4ODcgTDU1MS43MDMzMzMsMTIuMjc2NDcyMSBMNTU0LjQ2MTExMSwxMi4yNzY0NzIxIEw1NTUuOTIxMTExLDEwLjMwNTQ3MjEgTDU1My45NzQ0NDQsOS4yNzk0MTY1NSBMNTUzLjQwNjY2NywxMC43Nzc5NDQzIFogTTU2Mi4yNDc3NzgsMTEuMTcxMzMzMiBMNTY2LjIyMjIyMiw4LjcyNTgzMzIzIEw1NTMuODkzMzMzLDEgTDU1Mi40MzMzMzMsMSBMNTUwLjQ4NjY2NywzLjkxNzk3MjE4IEw1NTAuNDg2NjY3LDQuOTQ0MDI3NzIgTDU2MS4zNTU1NTUsMTEuMjUyNDQ0MyBMNTYyLjI0Nzc3OCwxMS4xNzEzMzMyIFogTTU2MC43ODc3NzgsMTEuNzIyODg4NyBMNTUxLjQ2LDUuODg4OTcyMTYgTDU1MC40ODY2NjcsNi45MTUwMjc3IEw1NjEuMzU1NTU1LDEzLjIyMzQ0NDMgTDU2Mi4zMjg4ODksMTMuMjIzNDQ0MyBMNTYyLjgxNTU1NSwxMi43NDg5NDQzIEw1NjMuMzAyMjIyLDExLjMyOTQ5OTkgTDU2MS44NDIyMjIsMTIuMzU1NTU1NCBDNTYxLjE5MTMwNSwxMS44ODEwNTU0IDU2MC43ODc3NzgsMTEuNzIyODg4NyA1NjAuNzg3Nzc4LDExLjcyMjg4ODcgTDU2MC43ODc3NzgsMTEuNzIyODg4NyBaIiBpZD0i55uR5o6nIj48L3BhdGg+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==);
    &:hover {
      background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTggMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+55uR5o6nPC90aXRsZT4KICAgIDxnIGlkPSLpgJrnlKjlm77moIciIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSLooajmoLzpgJrnlKjlm77moIciIHRyYW5zZm9ybT0idHJhbnNsYXRlKC02ODAuMDAwMDAwLCAtMTM0LjAwMDAwMCkiIGZpbGw9IiMwMDkxRkYiPgogICAgICAgICAgICA8ZyBpZD0i57yW57uELTMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDY2LjAwMDAwMCwgMzAuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0i57yW57uE5aSH5Lu9IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2NS4wMDAwMDAsIDEwNC4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNTUzLjQwNjY2NywxMC43Nzc5NDQzIEw1NTEuNzAzMzMzLDEwLjc3Nzk0NDMgTDU1MS43MDMzMzMsOC42NDg3Nzc2NyBMNTUwLDguMzM0NDcyMTIgTDU1MCwxNS4xOTQ0NDQyIEw1NTEuNzAzMzMzLDE0LjY0Mjg4ODcgTDU1MS43MDMzMzMsMTIuMjc2NDcyMSBMNTU0LjQ2MTExMSwxMi4yNzY0NzIxIEw1NTUuOTIxMTExLDEwLjMwNTQ3MjEgTDU1My45NzQ0NDQsOS4yNzk0MTY1NSBMNTUzLjQwNjY2NywxMC43Nzc5NDQzIFogTTU2Mi4yNDc3NzgsMTEuMTcxMzMzMiBMNTY2LjIyMjIyMiw4LjcyNTgzMzIzIEw1NTMuODkzMzMzLDEgTDU1Mi40MzMzMzMsMSBMNTUwLjQ4NjY2NywzLjkxNzk3MjE4IEw1NTAuNDg2NjY3LDQuOTQ0MDI3NzIgTDU2MS4zNTU1NTUsMTEuMjUyNDQ0MyBMNTYyLjI0Nzc3OCwxMS4xNzEzMzMyIFogTTU2MC43ODc3NzgsMTEuNzIyODg4NyBMNTUxLjQ2LDUuODg4OTcyMTYgTDU1MC40ODY2NjcsNi45MTUwMjc3IEw1NjEuMzU1NTU1LDEzLjIyMzQ0NDMgTDU2Mi4zMjg4ODksMTMuMjIzNDQ0MyBMNTYyLjgxNTU1NSwxMi43NDg5NDQzIEw1NjMuMzAyMjIyLDExLjMyOTQ5OTkgTDU2MS44NDIyMjIsMTIuMzU1NTU1NCBDNTYxLjE5MTMwNSwxMS44ODEwNTU0IDU2MC43ODc3NzgsMTEuNzIyODg4NyA1NjAuNzg3Nzc4LDExLjcyMjg4ODcgTDU2MC43ODc3NzgsMTEuNzIyODg4NyBaIiBpZD0i55uR5o6nIj48L3BhdGg+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==);
    }
  }
}
</style>
