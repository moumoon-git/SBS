<template>
  <div class="operation">
    <span class="operation-title">切换事件</span>
    <el-popover
      v-model="visible"
      popper-class="eventOptions"
      placement="bottom"
    >
      <div class="eventSearch">
        <el-input v-model="searchText" placeholder="请输入关键字" size="small">
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="searchEvent"
          ></i>
        </el-input>
      </div>

      <ul v-if="eventOptions.length > 0" class="eventList">
        <li
          v-for="item in eventOptions"
          :key="item.id"
          :class="
            'evenyEvent ' +
            (item.id === selectEventId ? 'evenyEvent--active' : '')
          "
          @click="switchEvent(item.id)"
        >
          {{ item.title }}
        </li>
        <div class="loadMore">
          <el-button
            v-if="loadMore"
            round
            icon="iconfont icon-loadMore"
            size="mini"
            @click="loadMoreHandle"
            >加载更多</el-button
          >
          <div v-else>暂无更多数据</div>
        </div>
      </ul>
      <div v-else class="noData">暂无数据</div>

      <el-input
        v-model="selectEvent"
        slot="reference"
        readonly
        placeholder="请选择"
      ></el-input>
    </el-popover>
  </div>
</template>
<script>
export default {
  name: 'SwitchEvent',
  data() {
    return {
      eventOptions: [], // 加载的事件
      visible: false, // 是否显示弹窗
      selectEventId: null, // 事件ID
      selectEvent: '', // 事件标题
      currentPage: 1, // 事件列表页码
      searchText: '', // 事件列表搜索关键字
      loadMore: true, // 是否有更多事件数据
    };
  },
  methods: {
    /**
     * @description: 搜索事件
     * @author : xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2020-11-17 18:58
     * @param {*}
     * @return {*}
     */
    searchEvent() {
      this.currentPage = 1;
      this.eventOptions = [];
      this.initEvent();
    },
    /**
     * @description: 每次追加10条事件列表
     * @author : xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2020-11-17 18:58
     * @param {*}
     * @return {*}
     */
    loadMoreHandle() {
      this.currentPage++;
      this.initEvent();
    },

    /**
     * @description 获取事件列表
     */
    getEventList(type) {
      const ipData = {
        size: 10,
        page: this.currentPage,
        name: this.searchText,
        reportType:
          !this.$route.query.linkageValue ||
          this.$route.query.linkageValue == '关'
            ? 0
            : 5,
      };
      this.$szApi.listBy(ipData).then((res) => {
        if (res.errorcode === 0) {
          this.eventOptions = this.eventOptions.concat(res.data.data);
          this.loadMore = res.data.data.length == 0 ? false : true;
          if (type === 'updateList' || this.currentPage === 1) {
            this.switchEvent(this.eventOptions[0].id);
          }
        } else {
          // //this.$message.error(res.msg)
        }
      });
    },

    /**
     * @param {String} type 类型'updateList'：更新列表，如果事件接报页面将事件都删除了，那么要重新赋值
     * @returns 无
     * @lastEditor hexinting
     * @lastDate 2020-11-30
     * @description 初始化所有事件
     */
    initEvent() {
      setTimeout(() => {
        const eventID = sessionStorage.getItem('newID') || ''; // 获取事件id
        const eventTitle = sessionStorage.getItem('eventTitle') || ''; // 获取事件标题
        if (eventID) {
          this.selectEventId = parseInt(eventID) || 0;
          this.selectEvent = eventID !== 'newID' ? eventTitle : ''; // 切换事件
        }
      }, 800);
    },
    // 切换事件
    switchEvent(id) {
      const currentEvent = this.eventOptions.find((v) => v.id == id);
      sessionStorage.setItem('eventTitle', currentEvent.title); // 切换事件后缓存的展示标题也要改
      this.selectEvent = currentEvent.title; // 事件标题
      if (
        currentEvent.levelId !== 0 &&
        currentEvent.levelId !== '' &&
        currentEvent.levelId !== '' &&
        currentEvent.levelId !== 0
      ) {
        //已经启动过预案
        this.$store.commit('setTurnOnEmergencyResponse', true);
      } else {
        this.$store.commit('setTurnOnEmergencyResponse', false);
      }
      sessionStorage.setItem('newID', currentEvent.id);
      // this.reload() // 注释原因：bug8566 eos拉会成功后，在事件接报模块切换事件会刷新页面，导致页面刷新，home.vue页面中的beforeDestroy关闭会议的方法 author：hexinting date:2020-11-20
      // 切换事件之后默认进入信息核实子页面
      this.selectEventId = currentEvent.id;
      console.log('切换事件后的事件id：', currentEvent.id);
      this.clickedName = '信息核实';
      this.$store.commit('setEventId', currentEvent.id); // 在事件接报页面监听事件id
      this.visible = false;
    },
  },
};
</script>

<style lang="scss">
.operation {
  display: flex;
  align-items: center;

  .operation-title {
    cursor: pointer;
    margin-right: 10px;
    font-size: 16px;
  }

  >>> .el-select {
    padding: 0 10px;
  }

  .operation_btn {
    margin-left: 10px;
  }

  .change-btn {
    border-color: #409eff;
    -webkit-transform: rotate(90deg);
    -moz-transform: rotate(90deg);
    transform: rotate(90deg);
    filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=1);

    .el-icon-sort {
      color: #409eff;
    }
  }

  .noData {
    text-align: center;
    margin-top: 10px;
  }
}
/* 事件选择下拉样式 */
.eventOptions {
  padding: 10px 0;
  color: #666;
  font-size: 14px;
}
.eventOptions ul {
  padding: 0;
  list-style: none;
}
.eventOptions .eventSearch {
  margin: 0 20px;
}
.eventOptions .eventSearch .el-input__inner {
  border-radius: 17px;
}
.eventOptions .eventSearch .el-icon-circle-close {
  display: none;
}
.eventOptions .recentOptions {
  display: flex;
  align-items: center;
  margin: 10px 20px;
}
.eventOptions .recentOptions .recentList {
  display: flex;
  margin: 0;
}
.eventOptions .recentOptions .eachRecent {
  border: 1px solid #0091ff;
  border-radius: 20px;
  padding: 3px 10px;
  color: #0091ff;
}
.eventOptions .eventList {
  max-height: 190px;
  overflow: scroll;
  margin-bottom: 0;
}
.eventOptions .eventList .evenyEvent {
  padding: 10px 20px;
}
.eventOptions .eventList .evenyEvent:hover {
  background-color: #f4f4f4;
}
.eventOptions .eventList .loadMore {
  text-align: center;
  margin-top: 8px;
}
.eventOptions .eventList .loadMore .el-button {
  box-shadow: 0px 0px 8px 2px rgba(67, 85, 114, 0.1);
  color: #666;
  border: none;
}
.eventOptions .eventList .loadMore .el-button .iconfont {
  font-size: 14px;
}
.eventOptions .eventList .loadMore .el-button--mini {
  padding: 4px 10px;
}
</style>
