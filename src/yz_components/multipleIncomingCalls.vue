<template>
  <div ref="socrllBox">
    <!-- <div style="display: flex;width: 1200px;flex-wrap: nowrap;overflow: auto;flex-direction: row-reverse;" ref="socrllBox"> -->
    <div v-for="(item , index) in callMsg" :key="index" style="float:right;">
      <div :class="[item.msg.important!='leader'?'miniPlanCallIng':'miniPlanCallIngLeader']">
        <div style="padding: 20px">
          <!--个人信息-->
          <div class="messagePlan">
            <div class="messagePlanContent">
              <img
                multipleIncomingCalls
                :src="item.msg.picture?(item.msg.picture.search('http')==-1?($window.g.ApiUrl+item.msg.picture):item.msg.picture):'static/img/headless.png'"
                class="user_img messagePlanContent_left"
              />
              <div class="messagePlanContent_right">
                <span class="user_name" :title="item.msg.name">{{item.msg.name}}</span>
                <div class="messagePlanContent_right_bottom">
                  <span
                    v-if="item.msg.position"
                    class="user_position" :title="item.msg.position">
                    ({{item.msg.position}})</span>
                  <span
                    v-if="item.msg.workUnit"
                    class="user_workUnit"
                    :title="item.msg.workUnit"
                  >({{item.msg.workUnit}})</span>
                </div>
              </div>
            </div>
            <!-- <div
              style="font-size:14px;font-weight:400;color:rgba(255,245,245,1);"
            >{{item.msg.workUnit}}</div>-->
            <div
              style="width: 50px;height: 50px;background-color: white;border-radius: 50%;position: absolute;right: 40px;top: 7px;
            display: flex;justify-content: center;align-items: center;font-size: 12px"
            >
              <div style="color: black;width: 40px;overflow: hidden;text-align: center">
                <div>坐席</div>
                <div>{{item.agentNumber}}</div>
              </div>
            </div>
            <i
              class="el-icon-close"
              @click="callIncxexColse(item , index)"
              style="position: absolute;right: 20px;top: 0;color: #fff;cursor: pointer;"
            ></i>
          </div>
          <!--号码-->
          <div class="numberPlan">
            <div class="numberAffilation">
              <div style="padding-right: 10px;">{{item.number}}</div>
              <div style="padding-left: 10px">{{item.msg.city}}</div>
            </div>
            <div class="callStatus">来电...</div>
          </div>

          <!--来电-->
          <div class="bottomPlan">
            <el-button
              v-if="item.agentNumber==seat && $window.g.communicationTool !== '优士康'"
              type="success"
              size="mini"
              @click="answerIndex(item, index)"
            >接听</el-button>
            <el-button
              v-if="item.agentNumber!==seat"
              type="success"
              size="mini"
              @click="callPickup(item, index)"
            >代答</el-button>
            <el-button v-if="item.agentNumber==seat" type="danger" size="mini" @click="hangUp">拒接</el-button>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="callMsg.length>3"
      style="position: absolute;width: 1250px; display: flex;justify-content: space-evenly;top: 100px;right: -28px;font-size: 28px;"
    >
      <div style="width: 100%;display: flex;justify-content: flex-start;cursor: pointer">
        <i class="el-icon-d-arrow-left" @click="scrollLeftDiv"></i>
      </div>
      <div style="width: 100%;display: flex;justify-content: flex-end;cursor: pointer">
        <i class="el-icon-d-arrow-right" @click="scrollRightDiv"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'multipleIncomingCalls',
    computed: {
        ...mapGetters({
            callMsg: 'getIsManyCallsList',
            conn: 'getCallConn',
            isCallPhone: 'getIsCallPhone', //电话队列的通话状态,
        }),
    },
    data() {
        return {
            $window: window,
            agent_id: sessionStorage.getItem('agent_id') || '', //坐席ID
            seat: sessionStorage.getItem('seat') || '', //坐席号码
            agent_Tag: sessionStorage.getItem('agent_Tag') || '', //工号
            HWICP_Version: window.g.HWICP_Version, //icp版本
        };
    },
    methods: {
        scrollLeftDiv() {
            let outDiv = this.$refs.socrllBox;
            outDiv.scrollLeft -= 300;
        },
        scrollRightDiv() {
            let outDiv = this.$refs.socrllBox;
            outDiv.scrollLeft += 300;
        },

        answerIndex(item, index) {
          console.log('接听电话——————————————');
          
            let audios = document.getElementsByTagName('audio');

            [...audios].forEach(item => {
                //   if(item !== target){
                item.pause();
                //   }
            });
            this.$icp19.AnswerCall(Number(this.agent_id), Number(this.conn), 1);
        },

        //代答
        callPickup(item) {
            let audios = document.getElementsByTagName('audio');

            [...audios].forEach(item => {
                //   if(item !== target){
                item.pause();
                //   }
            });
            // /** SnatchPickup
            //  * 代接正在振铃的坐席的来电
            //  * @param agent_id 坐席id
            //  * @param conn 正在通话的通话ID（备用）
            //  * @param agentTag 代接的坐席工号,
            //  * @param agentNum 代接的坐席号码
            //  * @constructor
            //  */
            this.$icp19.SnatchPickup(
                Number(this.agent_id),
                Number(this.conn),
                Number(item.agentTag),
                Number(item.agentNumber)
            );
        },

        //关闭当前的电话弹窗
        callIncxexColse(item, index) {
            this.callMsg.splice(index, 1);
        },
        //挂断方法
        hangUp() {
            console.log('-----拒接------');
            this.$confirm('是否结束当前通话?', '提示', {
                confirmButtonText: '是',
                cancelButtonText: '否',
                type: 'warning',
            }).then(() => {
                let audios = document.getElementsByTagName('audio');

                [...audios].forEach(item => {
                    // if(item !== target){
                    item.pause();
                    // }
                });
                if (this.HWICP_Version == 'HWICP-19.0') {
                    this.$icp19.DropCall(
                        Number(this.agent_id),
                        Number(this.conn),
                        ''
                    );
                    this.$store.commit('setCallStatus', false);
                }
            });
        },
    },
    mounted() {
        console.log('--来电弹窗--');
    },
};
</script>

<style scoped>
.miniPlanCallIng {
    width: 301px;
    height: 214px;
    background-image: url('/static/img/phoneCallImg/callJoinX.png');
    background-repeat: no-repeat;
    background-size: 301px 214px;
    background-position: center center;
}
.miniPlanCallIngLeader {
    width: 301px;
    height: 214px;
    background-image: url('/static/img/phoneCallImg/callJoinXLeader.png');
    background-repeat: no-repeat;
    background-size: 301px 214px;
    background-position: center center;
}

.messagePlan {
    width: 100%;
    height: 60px;
    text-align: left;
    position: relative;
}

.messagePlanContent {
  font-size:17px;
  font-weight:500;
  color:rgba(255,255,255,1);
  width:100%;
  display: flex;
  justify-content: space-between;
}

.messagePlanContent_right {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 178px;
}

.messagePlanContent_right_bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user_img {
  width:60px;
  height:60px;
  margin-left:20px;
}

.user_name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin:0;
  padding:0;
}

.user_position {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width:50%;
}

.user_workUnit {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width:50%;
}

.numberPlan {
    width: 100%;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

.bottomPlan {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
