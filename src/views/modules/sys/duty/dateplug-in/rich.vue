<template>
  <div>
    <!-- 当日才可以新增交班事项 -->
    <div v-if="oldDate == newDate">
      <div :class="$style.updateTime">保存时间：暂无</div>
      <div class="wrap">
        <textarea class="textIn"  placeholder="请输入内容..." v-model="editorArr.content" />
        <div :class="$style.registrant">
          <div :class="$style.registrant_left">
            <!-- <span>登记人：</span>
            <input type="text" v-model="editorArr.eventHuman" > -->
            <div>
              <span>交班人：</span>
              <input type="text" v-model="editorArr.shiftPerson" >
            </div>
            <div>
              <span>接班人：</span>
              <input type="text" v-model="editorArr.successor" >
            </div>
          </div>
          <span @click="save" :class="$style.textStyle">保存</span>
        </div>
      </div>
    </div>
    <div v-if="oldDate <= newDate">
      <div v-for="item in cesData" :key="item.id">
        <div :class="$style.updateTime">
          {{ item.state === 'WAITING' ? `保存时间：${item.contentUpdateTime || item.updateTime}`
            : item.state === 'SHIFTING' ? `交班时间：${item.shiftTime || item.updateTime}`
              : `完成时间：${item.finishTime || item.updateTime}`
          }}
        </div>
        <div class="wrap" :class="item.active?'active':''" >
          <textarea class="textIn" v-model="item.content"  @input="changeInput"  placeholder="请输入内容..." :readonly="item.active?true:false" />
          <div :class="$style.registrant">
            <div :class="$style.registrant_left">
              <!-- <span>登记人：</span>
              <input type="text" v-if="!item.active" v-model="item.registrant" @input="changeInput" > -->
              <div>
                <span>交班人：</span>
                <input
                  v-model="item.registrant"
                  type="text"
                  :disabled="item.active"
                >
              </div>
              <div>
                <span>接班人：</span>
                <input
                  v-model="item.receiver"
                  type="text"
                  :disabled="item.active"
                >
              </div>
              <!-- 登记人 -->
              <!-- <span v-if="item.active" >{{item.registrant}}</span> -->
              <!-- 更新时间 -->
              <!-- <span v-if="item.active" style="margin-left: 30px;">{{item.updateTime}}</span> -->
            </div>
            <div>
              <span
                v-if="item.active && item.state === 'WAITING'"
                :class="
                  [$style.textStyle,
                  {[$style.textNone]: oldDate !== newDate}]"
                @click="shift(item)"
              >交班</span>
              <span
                v-if="item.active && item.state === 'WAITING'"
                style="color:#0091ff"
              >|</span>
              <span
                v-if="item.active && item.state === 'WAITING'"
                :class="
                  [$style.textStyle,
                  {[$style.textNone]: oldDate !== newDate}]"
                @click="updatas(item)"
              >修改</span>
              <span
                v-if="item.active && item.state === 'WAITING'"
                style="color:#0091ff"
              >|</span>
              <span
                v-if="item.active && item.state === 'WAITING'"
                :class="
                  [$style.textStyle,
                  {[$style.textNone]: oldDate !== newDate}]"
                @click="open(item)"
              >删除</span>
              <span
                v-else-if="item.state === 'WAITING'"
                :class="
                  [$style.textStyle,
                  {[$style.textNone]: oldDate !== newDate}]"
                @click="savexxx(item)"
              >保存</span>
              <span
                v-if="item.active && item.state === 'SHIFTING'"
                :class="
                  [$style.textStyle,
                  {[$style.textNone]: oldDate !== newDate}]"
                @click="matterDone(item)"
              >事项完成</span>
              <span
                v-if="item.active && item.state === 'FINISHED'"
                style="color: #797979"
                class="textStyle"
              >事项已完成</span>
            </div>
          </div>
          <div
            v-if="item.state === 'FINISHED'"
            :class="[$style.registrant_left, $style.registrant_finish]"
          >
            <div>
              <span>完成人：</span>
              <input
                v-model="item.finishPerson"
                type="text"
                disabled
              >
              <div :class="$style.remark" v-if="item.finishRemark">
                备注：{{ item.finishRemark }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <matterDoneDialog
      ref="matterDoneDialog"
      @matterDoneBack="matterCallBack"
    />
  </div>
</template>

<script>
import dutylogs from '@/mock/modules/dutylog'; // 引入接口
import matterDoneDialog from './matterDoneDialog.vue';

export default {
  name: 'rich',
  components: {
    matterDoneDialog,
  },
  data() {
    return {
      editorArr: {
        content: '',
        eventHuman: '',
        shiftPerson: '', // 交班人
        successor: '', // 接班人
      },
      oldDate: this.dateFormatter(new Date()).split(' ')[0],
      newDate: this.dateFormatter(new Date()).split(' ')[0],
      cesData: [],
      id: '',
      chooseDate: '',
    };
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
    // 格式化起始时间结束时间
    dateFormatter(str, hasTime) {
      // 默认返回yyyy-MM-dd HH-mm-ss, 可传第二个参数false，返回yyyy-MM-dd
      const d = new Date(str);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hour = String(d.getHours()).padStart(2, '0');
      const minute = String(d.getMinutes()).padStart(2, '0');
      const second = String(d.getSeconds()).padStart(2, '0');
      if (hasTime) {
        return (
          [year, month, day].join("-") + " " + [hour, minute, second].join(":")
        );
      } else {
        return [year, month, day].join("-");
      }
    },
    open(item) {
      if (this.oldDate !== this.newDate) {
        this.$message.warning('请在本日的交班事项中操作');
        return;
      }
      // eslint-disable-next-line eqeqeq
      if (this.oldDate <= this.newDate) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.deleteEvent(item)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    changeInput() {
      // console.log(this.cesData)
    },
    init(data) {
      this.oldDate = data
      // console.log(this.oldDate, this.newDate)
    },
    requests(data) {
      console.log('!!!', data, this.chooseDate);
      this.editorArr.content = '';
      this.editorArr.shiftPerson = '';
      this.editorArr.successor = '';
      // 更新
      const date = {
        date: this.dateFormatter(data),
      };
      const datas = {
        url: this.$http.adornUrl(dutylogs.dutylogs_listByDate.url),
        method: dutylogs.dutylogs_listByDate.method,
        params: this.$http.adornParams(date),
      };
      this.$http(datas).then((res) => {
        // eslint-disable-next-line eqeqeq
        if (res.data.list.length != 0) {
          res.data.list.forEach(function (ele, index) {
            ele.active = true
            // ele.state = 'SHIFTING'
          })
          this.cesData = res.data.list
          // console.log(res.data.list)
          this.id = res.data.list[0].dutyLogId
        } else {
          this.cesData = []
        }
      }).catch((err) => {
        // console.log(err)
      })
    },
    updatas (item) {
      if (this.oldDate !== this.newDate) {
        this.$message.warning('请在本日的交班事项中操作');
        return;
      }
    //  修改
      // console.log(item, item.date)
      // eslint-disable-next-line eqeqeq
      /**
       * @author tanjinfeng
       * @date 2020-11-09
       * @desc 修复BUG：编辑按钮无反应
       */
      // *****原来的代码
      // if (item.date == new Date().toLocaleDateString().replace(/\//g, '-')) {
      //   item.active = false
      // }
      // *****修改的代码
      const date = new Date()
      if (item.date <= `${date.getFullYear()}-${`0${date.getMonth() + 1}`.slice(-2)}-${`0${date.getDate()}`.slice(-2)}`) {
        item.active = false
      }
      // *****结束
    },
    saveResquests(val) {
      // 保存请求  duty_log_operations
      const datas = {
        url: this.$http.adornUrl(dutylogs.dutylogs_save.url),
        method: dutylogs.dutylogs_save.method,
        data: this.$http.adornParams(val),
      };
      this.$http(datas).then((res) => {
        // console.log(res.data)
        // 更新
        this.requests(this.chooseDate);
        const oldDate = new Date(new Date().getTime() - 86400000);
        // console.log(oldDate.getFullYear())
        // const datetime = oldDate.getFullYear() + '-' + ((oldDate.getMonth() + 1)<10?('0'+(oldDate.getMonth() + 1)):(oldDate.getMonth() + 1)) + '-' + ((oldDate.getDate() + 1)<10?('0'+(oldDate.getDate() + 1)):(oldDate.getDate() + 1))
        // this.$emit('refreshDuty', datetime);
      }).catch((err) => {
        // console.log(err)
      });
    },
    save() {
      /**
       * @author tanjinfeng
       * @desc 限制输入内容不为空，且提示
       */
      if (this.editorArr.content === '') {
        this.$message.error('请输入内容');
        return;
      }
      if (this.editorArr.shiftPerson === '' || this.editorArr.successor === '') {
        this.$message.warning('交接班人不能为空');
        return;
      }
      // 保存按钮
      const val = {
        content: this.editorArr.content, // 内容
        // createTime: '',
        // date: this.chooseDate,
        // dutyLogId: this.id,
        // id: '',
        // operatorId: '',
        // registrant: this.editorArr.eventHuman,
        // updateTime: '',
        registrant: this.editorArr.shiftPerson, // 交班人
        receiver: this.editorArr.successor, // 接班人
      };
      this.saveResquests(val); // 保存
      this.editorArr.content = '';
      // this.editorArr.eventHuman = '';
      this.editorArr.shiftPerson = '';
      this.editorArr.successor = '';
      this.getUserInfo(); // 获取用户信息
    },
    savexxx(item) {
      if (item.content === '') {
        this.$message.error('请输入内容');
        return;
      }
      if (item.registrant === '' || item.receiver === '') {
        this.$message.warning('交接班人不能为空');
        return;
      }
      console.log(item);
      // 修改后保存
      item.active = true;
      // console.log(item)
      const datas = {
        // url: this.$http.adornUrl(dutylogs.dutylogs_update.url),
        // method: dutylogs.dutylogs_update.method,
        url: this.$http.adornUrl(`/duty/dutyLogItem/${item.id}/updateContent`),
        method: 'PUT',
        data: this.$http.adornParams({
          content: item.content, // 内容
          registrant: item.registrant, // 交班人
          receiver: item.receiver, // 接班人
        }),
      };
      this.$http(datas).then((res) => {
        // console.log(res.data)
        if (res.data && res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '修改成功!',
          });
          this.requests(this.chooseDate || this.oldDate);
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    deleteEvent (item) {
      // console.log(item.id)
      const datas = {
        url: this.$http.adornUrl(dutylogs.dutylogs_DelEvent.url + item.id),
        method: dutylogs.dutylogs_DelEvent.method,
        data: ''
      }
      this.$http(datas).then((res) => {
        /**
         * @author tanjinfeng
         * @date 2020-11-09
         * @desc 修复BUG：没有删除的后续提示
         */
        // *****原来的代码
        // if (res && res.code === 0) {
        // *****修改后的代码
        if (res.data && res.data.code === 0) {
        // *****结束
          // console.log(res.data)
          this.requests(this.chooseDate)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          const oldDate = new Date(new Date().getTime() - 86400000)
          const datetime = oldDate.getFullYear() + '-' + ((oldDate.getMonth() + 1)<10?('0'+(oldDate.getMonth() + 1)):(oldDate.getMonth() + 1)) + '-' + ((oldDate.getDate() + 1)<10?('0'+(oldDate.getDate() + 1)):(oldDate.getDate() + 1))
          this.$emit('refreshDuty',datetime)
        }else{
          this.$message.error(res.msg)
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    /**
     * 获取登录用户信息
     */
    getUserInfo() {
      this.$http.get(`${window.SITE_CONFIG.baseUrl}/sys/user/info/${this.$cookie.get('userId')}`)
        .then((response) => {
          if (response.data.code === 0 && response.data.user) {
            this.editorArr.eventHuman = response.data.user.username || ''
          }
        });
    },
    /**
     * 交班
     */
    shift(item) {
      if (this.oldDate !== this.newDate) {
        this.$message.warning('请在本日的交班事项中操作');
        return;
      }
      if (item.registrant === '' || item.receiver === '') {
        this.$message.warning('交接班人不能为空');
        return;
      }
      const datas = {
        url: this.$http.adornUrl(`/duty/dutyLogItem/${item.id}/shift`),
        method: 'PUT',
        data: this.$http.adornParams(),
      };
      this.$http(datas).then((res) => {
        // console.log(res.data)
        if (res.data && res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '交班成功!',
          });
          this.requests(this.chooseDate);
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    /**
     * 事项完成
     */
    matterDone(item) {
      if (this.oldDate !== this.newDate) {
        this.$message.warning('请在本日的交班事项中操作');
        return;
      }
      this.$refs.matterDoneDialog.init(item.id);
    },
    // 事项完成弹窗返回
    matterCallBack() {
      console.log('!!!', this.oldDate, this.newDate, this.chooseDate);
      this.requests(this.chooseDate || this.oldDate);
    },
  },
};
</script>

<style scoped >
  .wrap{
    width: 100%;
    position: relative;
    /* padding: 5px 10px; */
    margin-bottom: 30px;
    border-radius: 4px;
    border: 1px solid #E4E4E4;
  }
  /* .wrap:before{
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 5px;
    background:#ccc;
    border-radius: 5px 0 0 5px/10px 0 0 10px;
  }
  .active:before{
    background:#409eff;;
  } */
  .textIn{
    resize:none;
    width: 100%;
    padding-left:12px;
    padding-top: 12px;
    height: 200px;
    outline: none;
    border: none;
    /* background: #f9f9f9; */
  }
  .textIn::-webkit-input-placeholder{
     color: #C8C9CC;
  }
  .iconts>i{
    font-size: 22px;
  }
  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-track {
    background-color: white;
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius: 2em;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #EBEDF0;
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius: 2em;
  }
</style>
<style lang="scss" module>
  .updateTime {
    text-align: right;
    width: 100%;
    color:#797979;
  }
  .registrant{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    border-top: 1px solid #E4E4E4;
    & > img{
      width: 17px;
      height: 18px;
    }
  }
  .registrant_finish {
    border-top: 1px solid #E4E4E4;
    padding: 5px 10px;
    .remark {
      word-break: break-all;
      margin-top: 5px;
      padding-left: 7px;
    }
  }
  .registrant_left {
    display: flex;
    flex-direction: column;
    & > div {
      color:#797979;
      margin-bottom: 8px;
      & > input {
        outline: none;
        border: none;
        border-radius: 4px;
        border: 1px solid #C8C9CC;
        width: 185px;
        height: 24px;
      }
      & > span {
        color:#797979;
        &::before {
          content: '*';
          color: red;
        }
      }
    }
  }
  .textStyle{
    cursor: pointer;
    color:#0091ff;
    &:hover {
      opacity: 0.5;
    }
  }
  .textNone {
    cursor: not-allowed;
    &:hover {
      opacity: 1;
    }
  }

</style>
