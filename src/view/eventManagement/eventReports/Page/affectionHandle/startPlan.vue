<template>
  <div style="width: 100%;text-align: left;font-size: 12px">
    <div style="padding: 30px 0">
      <label>预案参考:</label>
      <el-select v-model="initialPlan" placeholder="请选择" @change="cutPlan">
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </div>
    <div style="padding: 0 10px 15px 0;display: flex;align-items: center;">
      <div style="flex: 1">
        <label>响应等级:<span style="margin-left: 30px">{{tentative}}</span></label>
      </div>

      <div style="flex: 2;display: flex;justify-content: flex-end">
        <ul id="planBackg">
          <li  v-for="(list,index) in plan" :key="index"  >
            <span class="spanStrat" :style="{'backgroundColor':list.styleObj}"></span>
            <span class="spanEnd">{{list.name}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div>
      <div style="position: relative">
        <div  v-for="(list,index) in plan" :key="index">
          <div id="aLink" class="planRelative" :class="{ red:changeRed == index}" @click="setClick(list,index)">
            <div class="titlePlan" :style="{'backgroundColor':list.styleObj}">{{list.name}}</div>
            <div class="contentPlan">{{list.remark}}</div>
          </div>
        </div>

      </div>
    </div>

    <div class="missVerdict ">
      <div class="missLeft">研判结论:</div>
      <div class="missRight">
        <el-input
          type="textarea"
          v-model="textarea">
        </el-input>
      </div>
    </div>

    <div class="missVerdict" style="margin:20px">
      <div class="missLeft">
        <el-button type="primary" size="small" @click="adjustTheLevel" v-if="planseng===true">启动预案</el-button>
        <el-button type="primary" size="small" @click="adjustTheLevel" v-else>调整预案</el-button>
      </div>
      <div class="missRight">

      </div>
    </div>
  </div>
</template>

<script>
    import {UrlMap} from '../../../../../assets/js/common'

    export default {
        name: "startPlan",
        data(){
          return{
            options:[],//初判预案
            initialPlan:'',//选中预案
            caseID:'',//事件类型ID
            changeRed:-1,//切换按钮颜色
            plan:[],//预案等级
            tentative:'',//初步判断
            textarea:'',//初判结论
            usernames:'',
            psw:'',
            machineID:'',
            levelId:'',
            preplanId:'',
            eventId:'',//事件ID
            getPlan:null,//存储有不有预案
            pathname:'/emergencyResponse',
            planseng:true,
            stPlan:null,
            MapProjectUrl:window.g.MapProjectUrl,
            ip:''
          }
        },
        mounted(){
          this.getPlanData();
          this.getTheDefaultPlan();
        },
        watch: {
            stPlan:{
              handler(newAll){
                if(newAll===true){
                  this.planseng=false
                }else {
                  this.planseng=true
                }
              },
              deep:true
            },
          },
          methods:{
          getTheDefaultPlan(){// 获取默认的初判预案
           this.caseID=sessionStorage.getItem('caseID')
           this.eventId=sessionStorage.getItem('newID')
            if(this.caseID==''||this.caseID==null||this.eventId==''||this.eventId==null||this.eventId=='newID'){
              return
            }
            let data={
              eventId:this.eventId,
              caseId:this.caseID,
              type:1
            };
            this.$api.getDefault(data).then((res) => {
              if(res.errorcode=='0'){
                if(res.data==[]||res.data==''){
                  return
                }
                if(res.data.preplans==''||res.data.preplans==null||res.data.preplans==[]){
                  return;
                }
                this.initialPlan=res.data.preplans.id;//赋值默认选中
                this.preplanId=res.data.preplans.id;  //因为修改需求，加上前面代码遗留问题，导致又设了一个存储ID，所以再存一次
                this.changeRed =res.data.preplanLevelIndex;
                this.textarea=res.data.content
                let index=res.data.preplanLevelIndex;
                let data={
                  preplanId:this.preplanId
                };
                this.$api.getLevelByPreplanId(data).then((res) => {
                  if(res.errorcode=='0'){
                    this.plan=res.data
                    console.log(this.plan);
                    this.tentative=this.plan[index].name;
                    this.levelId=this.plan[index].id
                  }else {
                    //this.$message.error(res.msg);
                  }
                })
              }else {
                //this.$message.error(res.msg)
              }
            })
          },
          missPlan(){
            this.tentative='未达级别'
          },
          setClick(list,index){//设置点击按钮
            this.levelId=list.id;
            this.changeRed = index;
            this.tentative=this.plan[index].name;
          },
          getPlanData(){
            this.stPlan=this.$store.getters.getTurnOnEmergencyResponse
            this.caseID=sessionStorage.getItem('caseID');
            this.eventId=sessionStorage.getItem('newID');
            if(this.caseID==''||this.caseID==null){
              return
            }
            let data={
              caseId:this.caseID
            };
            this.$api.getPreplanByCaseId(data).then((res) => {
              if(res.errorcode=='0'){
                this.options=res.data
                this.getPlant();
              }else {
                //this.$message.error(res.msg);
              }
            })
          },
          cutPlan(value){
            this.preplanId=value;
            let data={
              preplanId:this.preplanId
            };
            this.$api.getLevelByPreplanId(data).then((res) => {
              if(res.errorcode=='0'){
                this.plan=res.data
              }else {
                //this.$message.error(res.msg);
              }
            })
          },
          getPlant(){//获取有没有启动过预案的type
            if(this.eventId==''||this.eventId==null||this.eventId=='newID'){
              return
            }
            let data={
              eventId:this.eventId
            };
            this.$api.judgePlan(data).then((res) => {
              this.getPlan=res.errorcode;
            })
          },
          adjustTheLevel(){//调整等级
            if(this.caseID==''||this.caseID==null||this.eventId==''||this.eventId==null||this.eventId=='newID'){
              this.$message({
                message: '请选择保存事件!',
                type: 'warning'
              });
            }
            else if(this.levelId==''||this.levelId==null){
              this.$message({
                message: '请选择预案等级!',
                type: 'warning'
              });
            }
            else if(this.preplanId==''||this.preplanId==null){
              this.$message({
                message: '请选择预案!',
                type: 'warning'
              });
            }else {
              const loading = this.$loading({
                lock: true,
                text: '加载中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('body')
              });
              if(this.getPlan==0){
                if(this.stPlan===true){
                  let ipData={};
                  this.$api.getIp(ipData).then((res) => {
                    if(res.errorcode=='0'){
                      this.ip=res.data
                      let data={
                        guId:this.ip
                      };
                      this.$api.userPlan(data).then((res) => {
                        if(res.errorcode=='0'){
                          this.usernames=res.data.usernames;
                          this.psw=res.data.psw;
                          let Level={
                            eventId:this.eventId,
                            preplanId:this.preplanId,
                            levelId:this.levelId,
                            content:this.textarea
                          }
                          this.$api.changeLevel(Level).then((res) => {
                            if(res.errorcode=='0'){
                              let isData={}
                              this.$api.iStarted(isData).then((res) => {
                               if(!res.data){
                                 loading.close();
                                 let agent_id=sessionStorage.getItem('agent_id')
                                 let iddcode=sessionStorage.getItem('seat')
                                 if(this.MapProjectUrl===true){
                                   window.open(UrlMap+'/login.html?usernames='+this.usernames+'&psw='+this.psw+'&machineID='+this.ip+'&agent_id='+agent_id+'&iddcode='+iddcode+'')
                                 }else {
                                   window.open(UrlMap+'/dispatch.html?machineID='+this.ip+'&agent_id='+agent_id+'&iddcode='+iddcode+'')
                                 }
                                 this.$message({
                                   message: '调整预案成功',
                                   type: 'success'
                                 });
                                 this.$router.push({
                                   path:this.pathname
                                 });

                               }else {
                                 loading.close();
                                 this.$message({
                                   message: '调整预案成功',
                                   type: 'success'
                                 });
                                 this.$router.push({
                                   path:this.pathname
                                 });
                               }
                              })
                            }else {
                              loading.close();
                              //this.$message.error(res.msg)
                            }
                          })

                        }else {
                          //this.$message.error(res.msg);
                        }
                      });
                    }
                    else {
                      this.$message.error('暂时无法打开该系统')
                    }
                  });
                }
              }
              else {
                this.startThePlan();
                loading.close();
              }
            }

          },
          startThePlan(){//启动预案
            let ipData={};
            this.$api.getIp(ipData).then((res) => {
              if(res.errorcode=='0'){
                this.ip=res.data
                let data={
                  guId:this.ip
                };
                this.$api.userPlan(data).then((res) => {
                  if(res.errorcode=='0'){
                    this.usernames=res.data.usernames;
                    this.psw=res.data.psw;
                    // iStarted
                    // this.machineID=res.data.machineID;
                    let dataS={
                      eventId:this.eventId,
                      levelId:this.levelId,
                      preplanId:this.preplanId,
                      content:this.textarea
                    };
                    this.$api.StartThePlan(dataS).then((res) => {
                      if(res.errorcode=='0'){

                        let isData={}
                        this.$api.iStarted(isData).then((res) => {
                          if(!res.data){
                            let agent_id=sessionStorage.getItem('agent_id')
                            let iddcode=sessionStorage.getItem('seat')
                            if(this.MapProjectUrl===true){
                              window.open(UrlMap+'/login.html?usernames='+this.usernames+'&psw='+this.psw+'&machineID='+this.ip+'&agent_id='+agent_id+'&iddcode='+iddcode+'')
                            }else {
                              window.open(UrlMap+'/dispatch.html?machineID='+this.ip+'&agent_id='+agent_id+'&iddcode='+iddcode+'')
                            }
                            this.$store.commit('setTurnOnEmergencyResponse',true);
                            this.$message({
                              message: '启动预案成功',
                              type: 'success'
                            });
                            this.$router.push({
                              path:this.pathname
                            });
                          }
                          else {
                            this.$store.commit('setTurnOnEmergencyResponse',true);
                            this.$message({
                              message: '启动预案成功',
                              type: 'success'
                            });
                            this.$router.push({
                              path:this.pathname
                            });
                          }
                        })

                      }else {
                        //this.$message.error(res.msg)
                      }

                    })
                  }else {
                    //this.$message.error(res.msg);
                  }
                });

              }
              else {
                this.$message.error('暂时无法打开该系统')
              }
            });


          }
        }
    }
</script>

<style scoped>
  #planBackg{
    display: flex;
    min-width: 350px;
  }
  #planBackg li{
    width: 100%;
    height: 30px;
    list-style: none;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  #planBackg li .spanStrat{
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
  }
  #planBackg li .spanEnd{
    padding-left: 10px;
    display: inline-block;
  }
  .planRelative{
    width: 100%;
    height: 60px;
    overflow: auto;
    box-sizing: border-box;
    border: 1px solid;
    display: flex;
    font-size: 12px;
  }
  #aLink,#xiesi{
    cursor: pointer;
    color: #7e7f83;
    min-width: 80px;
    /*border: 1px solid #E3F0FF;*/
    font-size: 12px;
  }
  .red{
    box-sizing: border-box;
    border: 2px solid #47AFFF !important;
  }
  .titlePlan{
    /*width: 100%;*/
    /*height: 30px;*/
    /*overflow-y: auto;*/
    /*text-align: center;*/
    /*line-height: 20px;*/
    /*box-sizing: border-box;*/
    /*border: 1px solid;*/
    width: 100%;
    height: 100%;
    display: flex;
    color: white;
    align-items: center;
    justify-content: center;
    overflow: auto;
    flex: 1;
    border-right: 1px solid #ddd;
  }
  .contentPlan{
    /*width: 100%;*/
    /*overflow-y: auto;*/
    /*height: 330px;*/
    /*box-sizing: border-box;*/
    /*border: 1px solid;*/
    width: 100%;
    height: 100%;
    text-align: left;
    text-indent: 20px;
    overflow: auto;
    flex: 5;
  }
  .missVerdict{
    display: flex;
    margin:10px 0;
  }
  .timeByTelephone{
    flex: 1;
  }
  .timeByMsg{
    flex: 1;
  }
  .missLeft{
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .missRight{
    flex: 9;
  }
</style>
