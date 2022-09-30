<template>
  <div style="background-color: white;margin-top: 5px;">
    <header class="serchWrap">
      <span v-if="name == '全部'" class="type">关联日志:</span>
      <span v-if="name == '群发' || name == '定时' || name == '催报'" class="type">关联事件:</span>
      <el-input type="text" class="event"></el-input>
      <button>选择</button>
      <button>取消</button>
    </header>

    <div v-if="name == '全部'">
      <div class="content">
        <ul>
          <li
            v-for="(item,index) in oneList"
            :key="index"
            :class="idx == index?'handleStyle':''"
            @click="toData(item,index)"
          >
            <p><发送>{{item.createTime}}【{{item.status}}】</p>
            <div>{{item.content}}</div>
          </li>
        </ul>
      </div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[10, 30, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>

    <div v-if="name == '群发' || name == '定时' || name == '催报'" style="margin-top:10px;">
      <p class="reply">短信内容</p>
      <div style="padding:3px;box-sizing:border-box;background-color:#ddd;">
        <textarea name id style="height:204px" v-model="content1" v-if="name == '群发'"></textarea>
        <textarea name id style="height:523px" v-model="content2" v-if="name == '定时'"></textarea>
        <textarea name id style="height:204px" v-model="content3" v-if="name == '催报'"></textarea>
      </div>

      <div v-if="name == '群发' || name == '催报'">
        <p class="reply">回复内容</p>

        <div style="padding:3px;box-sizing:border-box;background-color:#ddd;">
          <textarea name id style="height:248px"></textarea>
        </div>
      </div>
    </div>

    <!-- <div v-if="name == '定时' || name == '催报'"> 
          <p class='reply'>短信内容</p>
          <div style="padding:3px;box-sizing:border-box;background-color:#ddd;">
            <textarea name="" id="" style="height:584px" v-model="content"></textarea>
          </div>
    </div>-->

    <footer class="operation">
      <!-- <button >回复</button> -->
      <button @click="forward">转发</button>
      <button v-if="name == '全部' || name == '群发'" @click="retransmission">重发</button>
    </footer>
  </div>
</template>

<script>
import Bus from "@/views/common/js/eventBus";
export default {
  props: ["name"],
  name: "sms_history_centent",
  components: {},
  data() {
    return {
      page: 1,
      pageSize: 5,
      total: 0,
      oneList: [],
      event: false,
      content1: "",
      content2: "",
      content3: "",
      idx: 0,
      userId: ''
    };
  },
  created() {
    this.retransmissionDebounce = this._.debounce(() => {
      var forwaraData = this.$store.state.user.forward;
      // console.log(forwaraData)
      this.$http({
        url: this.$http.adornUrl("/message/messageinfor/sendmessage"),
        method: "post",
        data: this.$http.adornData({
          content: forwaraData.content,
          phone: forwaraData.phone,
          doWay: forwaraData.doWay,
          userIds: forwaraData.userIds?forwaraData.userIds:this.userId,
          type: forwaraData.type,
          sendWay: forwaraData.sendWay,
          signature: forwaraData.signature,
          eventId: parseInt(forwaraData.eventId)
        })
      }).then(data => {
        // console.log(data);
        if (data && data.data.code === "0") {
          this.$message({
            message: "发送成功",
            type: "success"
          });
          Bus.$emit("initGroup");
          if (this.status) {
            this.$http({
              url: this.$http.adornUrl("/duty/dutyLogMessage/messageSave"),
              method: "post",
              data: this.$http.adornData({
                remark: this.form.remarks,
                messageInforId: data.data.msgId
              })
            }).then(data => {
              // console.log(data);
              if (data && data.data.code == "0") {
              } else {
                this.$message.error("关联日志失败");
              }
            });
          }
        } else {
          this.$message.error("发送失败");
        }
      });
    }, 1000);
  },
  mounted() {
    Bus.$on("upDateAllList", row => {
      this.$http({
        url: this.$http.adornUrl("/message/messageinfor/listbyphone"),
        method: "get",
        params: this.$http.adornParams({
          page: 1,
          limit: 2000,
          phone: row.phone
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(
          //   "getDataList+++++++++++++++++++++++++++++++++++++++++++++++",
          //   data
          // );
          this.oneList = data.page.list;
          this.total = data.page.totalCount;
          this.forwardData = this.oneList[0];
        } else {
          this.oneList = [];
          this.total = 0;
          this.$message.error(data.msg)
        }
      });
    }),
      Bus.$on("getContent", row => {
        if (this.name == "群发") {
          this.content1 = row.content;
        } else if (this.name == "定时") {
          this.content2 = row.content;
        } else if(this.name == "催报"){
          this.content3 = row.content;
        }
      });
  },
  computed: {
    content: {
      get() {
        return this.$store.state.user.content;
      },
      set(value) {
        this.$store.commit("user/updateSMSContent", value);
      }
    },
    forwardData: {
      get() {
        return this.$store.state.user.forward;
      },
      set(value) {
        this.$store.commit("user/updateSMSForward", value);
      }
    }
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
      Bus.$emit("tabForward");
      Bus.$emit("forwardData");
    },
    // 重发
    retransmission() {
      this.retransmissionDebounce();
    }
  }
};
</script>
<style lang="scss" scoped>
* {
  padding: 0;
  margin: 0;
}
li {
  list-style: none;
}

@mixin operation {
  height: 50px;
  // min-height: 60px;
  // height: 7vh;
  display: flex;
  line-height: 50px;
  box-sizing: border-box;
}

@mixin button {
  width: 10%;
  height: 35px;
  border-radius: 5px;
  line-height: 35px;
  background: rgb(14, 142, 190);
  color: #fff;
  border: none;
  font-size: 15px;
  border: 1px solid lightblue;
  margin: 8px 0 0 10px;
}

.serchWrap {
  @include operation;
  .type{
    display: inline-block;
    height: 100%;
    width: 120px;
    background: rgb(14, 142, 190);
    padding: 0 10px;
    margin-right: 10px;
  }
  .event {
    width: 50%;
    height: 35px;
    // margin: 7px 0;
    border: none;
    outline: none;
    border-radius: 3px;
  }
  span {
    font-size: 1vw;
    color: #f4f4f4;
  }
  input::-webkit-input-placeholder {
    color: #ccc;
  }
  button {
    @include button;
  }
}

.content {
  height: 550px;
  padding: 5px 30px;
  box-sizing: border-box;
  ul {
    li {
      padding: 5px 5px 30px 5px;
      border-radius: 5px;
      margin-bottom: 10px;
      border: 1px solid #ccc;
      p {
        margin: 5px;
        font-size: 14px;
        font-weight: bold;
        // text-indent: 1em;
      }
    }
  }
}

.operation {
  margin-top: 13px;
  @include operation;
  display: flex;
  justify-content: space-around;
  button {
    @include button;
    width: 20%;
  }
}

.reply {
  font-size: 18px;
  // margin: 16.5px 0;
  margin: 16.5px 10px;
}
textarea {
  width: 100%;
  background-color: #ddd !important;
  border: 1px solid black;
  outline: none;
  resize: none;
}
.handleStyle {
  background-color: cornflowerblue;
}
</style>
