<template>
  <div class="contactRecordContent">
    <ul class="info">
      <li
        v-for="(item,index) in oneList"
        :key="index"
        class="oneInfo"
        :class="{'direction':item.type===1}"
      >
        <div class="title">
          <p v-if="item.type===0">
            {{ item.contactorName }}
          </p>
          <p v-else>
            {{ item.sendTime }}
          </p>
          <p v-if="item.type===0">
            {{ item.sendTime }}
          </p>
          <p v-else>
            {{ item.contactorName }}
          </p>
        </div>
        <div class="content">
          {{ item.content }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import Bus from '@/views/common/js/eventBus';

export default {
  name: 'Content',
  data() {
    return {
      oneList: [],
      idx: 0,
      userId: '',
    };
  },

  mounted() {
    Bus.$on('upDateAllList', (row) => {
      this.$http({
        url: `${window.SITE_CONFIG.cloudUrl}/event/eos/communication/sms/listByPhone`,
        method: 'get',
        params: this.$http.adornParams({
          phone: row.phone,
          page: 1,
          size: 2000,
        }),
      }).then(({ data }) => {
        if (data && data.errorcode === 0) {
          this.oneList = data.data.smsList;
        } else {
          this.oneList = [];
          this.$message.error(data.msg);
        }
      });
    });
  },
  methods: {
    // 每页数
    handleSizeChange(val) {
      this.pageSize = val;
      this.page = 1;
      this.getConactsList();
    },
    // 当前页
    handleCurrentChange(val) {
      this.page = val;
      this.getConactsList();
    },
    // 点击短信获取数据
    toData(row, index) {
      // console.log(this.$store.state.user.forward);
      this.forwardData = row;
      this.idx = index;
    },
    // 转发
    forward() {
      Bus.$emit('tabForward');
      Bus.$emit('forwardData');
    },
    // 重发
    retransmission() {
      this.retransmissionDebounce();
    },
  },
};
</script>
<style lang="scss" scoped>
.contactRecordContent {
  .direction{
    align-self: flex-end;
  }
  height: 550px;
  padding: 5px 15px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  background-color: #f4f4f4;
  .info {
    height: 100%;
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    overflow: scroll;
    &::-webkit-scrollbar{
      width: 0 !important;
      height: 0;
    }
    .oneInfo {
      width: 85%;
      margin-bottom: 10px;
      .title{
        display: flex;
        justify-content: space-between;
        height: 30px;
        line-height: 30px;
        p{
          margin: 0;
        }
      }
      .content{
        border: 1px solid black;
        border-radius: 5px;
        background-color: white;
        padding: 5px;
        text-indent: 2em;
      }
    }
  }
}
</style>
