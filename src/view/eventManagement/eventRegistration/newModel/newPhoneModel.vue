<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-tabs  @tab-click="phoneMsgWith" style="border: 1px solid #EBEEF5;border-radius: 4px;">
          <el-tab-pane label="通讯录">
            <el-scrollbar style="height: 100%;margin: 6px;">
              <phone-address-book-tree
                style="width: 100%;height: 250px;" ref="smsPhoneTree"
                :showCheckbox="phoneShowCheckbox" :showPhoneIcon="phoneShowPhoneIcon"
                @handleNodeClick="phoneRowNodeClick">
              </phone-address-book-tree>
            </el-scrollbar>
          </el-tab-pane>
          <el-tab-pane label="最近联系人">
            <el-scrollbar style="height: 100%;margin: 6px;" id="dailList">
              <phone-call-log-model style="width: 100%;height: 240px;" ref="callLogModel" @callPhone="callPhone"

              >
              </phone-call-log-model>
            </el-scrollbar>
          </el-tab-pane>
          <el-tab-pane label="快捷组">
            <el-scrollbar style="height: 100%;margin: 6px;">
              <phone-quick-group style="width: 100%;height: 250px;" ref="quickGroup"
                                 @quickNodeClick="quickNodeClick"
                                 :quickGroupShowCheckbox="phoneQuickGroupShowCheckbox"
                                 :quickGroupShowPhoneIcon="phoneQuickGroupShowPhoneIcon"
                                 :hiide="false"
              >
              </phone-quick-group>
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <!--      <el-col :span="2">-->
      <!--        <el-col :span="24" style="padding-top:90px">-->
      <!--          <el-row>-->
      <!--            <div class="arrowButton">-->
      <!--              <el-button @click="phoneAddList" type="success" size="mini" round plain class="el-icon-d-arrow-right"></el-button>-->
      <!--            </div>-->
      <!--          </el-row>-->

      <!--          <el-row>-->
      <!--            <div class="arrowButton">-->
      <!--              <el-button @click="phoneDelectList" type="success" size="mini" round plain class="el-icon-d-arrow-left"></el-button>-->
      <!--            </div>-->
      <!--          </el-row>-->

      <!--        </el-col>-->
      <!--      </el-col>-->
      <el-col :span="12">
        <div style="width: 100%">
          <el-card class="box-card cardCalss" shadow="hover" id="boxCard">
            <el-row style="width: 100%;height: 240px;">
              <el-col :span="24" style="padding-left: 10px">
                <figure-plate ref="figurePlate"></figure-plate>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </el-col>
    </el-row>

    <el-row style="margin-top: 20px">
      <el-scrollbar style="height: 100%">
        <div style="height:321px;text-align: left">
          <div>
            <div>
              <el-row>
                <el-col :offset="1" :span="23" class="name">
                  {{phone.name}}
                </el-col>
              </el-row>
            </div>
            <div class="introduction">
              <el-row style="margin-top: 10px">
                <el-col :span="24">
                  <i class="icon-zhiwu" style="vertical-align:text-top"></i>
                  <span>{{phone.position}}</span>
                </el-col>
              </el-row>
              <el-row style="margin-top: 10px">
                <el-col :span="24">
                  <i class="icon-danwei" style="vertical-align:text-top"></i>
                  <span>{{phone.workUnit}}</span>
                </el-col>
              </el-row>
            </div>
            <div class="details">
              <div>
                <span @click="changeCallNumber(phone.phone)">
                  <el-link :underline="false">手机号码:{{phone.phone}}</el-link>
                </span>
                <span @click="changeCallNumber(phone.work)">
                  <el-link :underline="false"> 办公电话:{{phone.work}}</el-link>
                </span>
              </div>

              <div>
                <span @click="changeCallNumber(phone.standbyApplication)">
                  <el-link :underline="false"> 备用手机:{{phone.standbyApplication }}</el-link>
                </span>
                <span @click="changeCallNumber(phone.rest)">
                  <el-link :underline="false">其他电话:{{phone.rest}}</el-link>
                </span>
              </div>

              <div>
                <span  @click="changeCallNumber(phone.emergency)">
                   <el-link :underline="false">应急电话:{{phone.emergency}}</el-link>
                </span>
                <span @click="changeCallNumber(phone.terminal)">
                   <el-link :underline="false">手持终端:{{phone.terminal}}</el-link>
                </span>
              </div>

            </div>
          </div>
        </div>
      </el-scrollbar>
    </el-row>
  </div>
</template>

<script>
  import phoneAddressBookTree from '@/view/eventManagement/eventRegistration/newModel/smsPhoneTree'
  import phoneQuickGroup from '@/view/eventManagement/eventRegistration/newModel/quickGroup'
  import phoneCallLogModel from '@/view/eventManagement/eventRegistration/newModel/callLogModel'
  import figurePlate from '@/view/eventManagement/eventRegistration/newModel/figurePlate'
  import {findContactorByMobile} from "../../../../assets/interface/interface";
  //引入拨号盘

  export default {
    name: "newPhoneModel",
    components: {
      phoneAddressBookTree, phoneQuickGroup, phoneCallLogModel, figurePlate
    },
    data() {
      return {
        phoneShowCheckbox: false,//通讯录子组件树显不显示复选框
        phoneShowPhoneIcon: true,//通讯录子组件树显不显示电话图标
        phoneQuickGroupShowCheckbox: false,//快捷组树组件是否显示复选
        phoneQuickGroupShowPhoneIcon: true,//快捷组树组件是否显示电话图标
        phoneSendType: '',//发送类型
        phone: {
          name: '',
          position: '',
          workUnit: '',
          phone: '',
          work: '',
          standbyApplication: '',
          rest: '',
          emergency: '',
          terminal: ''
        },
        rowItemData: '',//存储通讯录tree节点点击数据
        shortcutItemData: '',//存储快捷组tree节点点击数据

      }
    },
    methods: {
      /**
       * @author hexinting
       * @date 2020-9-29
       * @lastAuthor hexinting
       * @lastDate 2020-9-29
       * @description 电话通讯录tree
       */    
      phoneRowNodeClick(row) {
        console.log(row);
        this.rowItemData = row
        let treeData
        if (row.disabled) {
          if (row.children.length == 0) {
            let data = {
              pid: row.id,
              code: 'governmentAffairs' // 添加参数（根据融合通讯的来）
            }
            this.$szApi.phoneGruopList(data).then((res) => {
              if (res.errorcode == 0) {
                treeData = res.data
                treeData.forEach(item => {
                  const newChild = {
                    label: item.label,
                    children: item.children,
                    disabled: item.disabled,
                    id: item.id,
                    mobile: item.mobile,
                    officeTel: item.officeTel,
                    otherTel: item.otherTel,
                    position: item.position,
                    //temobile: item.temobile,
                    workUnit: item.workUnit,

                    mobile2: item.mobile2,
                    otherTel2: item.otherTel,
                    homeMobile: item.homeTel,
                    temobile: item.temobile,
                  };
                  if (!row.children) {
                    this.$set(row, 'children', []);
                  } else {
                    console.log(row);
                    row.children.push(newChild);
                  }

                })


              } else {
                // //this.$message.error(res.msg)
              }
            });
          }
        }
        if(!row.disabled){
          this.$refs.figurePlate.ruleForm.tel=row.mobile
          this.phone.name=row.label//姓名
          this.phone.position=row.position//职务
          this.phone.workUnit=row.workUnit//工作单位
          this.phone.phone=row.mobile//手机号
          this.phone.work=row.officeTel//办公电话
          this.phone.standbyApplication=row.mobile2//备用号
          this.phone.rest=row.otherTel2//其他电话
          this.phone.emergency=row.homeMobile//应急号码
          // this.phone.rowItemData=row.temobile//手持终端
          this.phone.terminal=row.temobile//手持终端
        }
      },
      phoneMsgWith(tab) {
        console.log(tab);
      },
      changeCallNumber(mobile){
        this.$refs.figurePlate.ruleForm.tel=mobile
      },

      //信息处置点击一键核实添加的功能
      oneKeyCheck(phone){
        // this.$refs.figurePlate.ruleForm.tel=phone
          console.log(phone);
          this.$api.findContactorByMobile({phoneNum:phone}).then((res) => {
            if (res.errorcode == 0) {
                this.phone.name=res.data.name//姓名
                this.phone.position=res.data.position//职务
                this.phone.workUnit=res.data.workUnit//工作单位
                this.phone.phone=res.data.mobile//手机号
                this.phone.work=res.data.officeTel//办公电话
                this.phone.standbyApplication=res.data.otherTel //备用号
                this.phone.rest=res.data.otherTel2//其他电话
                this.phone.emergency=res.data.homeMobile//应急号码
                // this.phone.rowItemData=res.data.temobile//手持终端
                this.phone.terminal=res.data.temobile//手持终端
                if(res.data.mobile){
                    this.$refs.figurePlate.ruleForm.tel=res.data.mobile
                }else if(res.data.officeTel){
                    this.$refs.figurePlate.ruleForm.tel=res.data.officeTel
                }else if(res.data.otherTel){
                    this.$refs.figurePlate.ruleForm.tel=res.data.otherTel
                }else if(res.data.otherTel2){
                    this.$refs.figurePlate.ruleForm.tel=res.data.otherTel2
                }else if(res.data.homeMobile){
                    this.$refs.figurePlate.ruleForm.tel=res.data.homeMobile
                }else if(res.data.temobile){
                    this.$refs.figurePlate.ruleForm.tel=res.data.temobile
                }else {
                    this.$refs.figurePlate.ruleForm.tel=''
                }
            }
        })
      },

      /**
       * @author hexinting
       * @date 2020-9-29
       * @lastAuthor hexinting
       * @lastDate 2020-9-29
       * @description 快捷组
       */ 
      quickNodeClick(row){
        this.shortcutItemData = row
        let treeData
        if (row.disabled) {
          if (row.children.length == 0) {
            let data = {
              pid: row.id,
              code: 'quick' // 添加参数（根据融合通讯的来）
            }
            this.$szApi.phoneGruopList(data).then((res) => {
              if (res.errorcode == 0) {
                treeData = res.data
                treeData.forEach(item => {
                  let newPhoneChild = {
                    label: item.label,
                    children: item.children,
                    disabled: item.disabled,
                    id: item.id,
                    mobile: item.mobile,
                    officeTel: item.officeTel,
                    mobile2: item.mobile2,
                    position: item.position,
                    temobile: item.temobile,
                    workUnit: item.workUnit
                  };
                  if (!row.children) {
                    this.$set(row, 'children', []);
                  } else {
                    console.log(row);
                    row.children.push(newPhoneChild);
                  }

                })


              } else {
                // //this.$message.error(res.msg)
              }
            });
          }
        }
        if(!row.disabled){
          this.$refs.figurePlate.ruleForm.tel=row.mobile
          this.phone.name=row.label//姓名
          this.phone.position=row.position//职务
          this.phone.workUnit=row.workUnit//工作单位
          this.phone.phone=row.mobile//手机号
          this.phone.work=row.officeTel//办公电话
          this.phone.standbyApplication=row.mobile2//备用号
          this.phone.rest=row.otherTel2//其他电话
          this.phone.emergency=row.homeMobile//应急号码
          // this.phone.rowItemData=row.temobile//手持终端
          this.phone.terminal=row.temobile//手持终端
        }
      },
      // phoneAddList(){},
      // phoneDelectList(){},
      callPhone(obj){
          this.$refs.figurePlate.ruleForm.tel=obj.call
          this.phone.name=""//姓名
          this.phone.position=obj.position//职务
          this.phone.workUnit=obj.workUnit//工作单位
          this.phone.phone=obj.call//手机号
          this.phone.work=""//办公电话
          this.phone.standbyApplication=""//备用号
          this.phone.rest=""//其他电话
          this.phone.emergency=""//应急号码
          // this.phone.rowItemData=""//手持终端
          this.phone.terminal=""//手持终端
      }
    }
  }
</script>

<style scoped>
  #dailList >>> .el-card__body {
    padding: 0;
  }

  #dailList >>> .el-card {
    height: 80px;
    overflow: auto;
  }

  .arrowButton {
    margin-bottom: 20px;
    text-align: center;
  }

  .eventList {
    width: 100%;
    height: 39px;
    text-align: center;
    line-height: 39px;
    background-color: cornflowerblue;
    color: white;
  }

  #checkedList >>> .el-checkbox {
    display: inline-block;
    width: 100%;
    margin-right: 0;
    text-indent: 5px;
    line-height: 35px;
    text-align: left;
  }

  .name {
    font-weight: bold;
    font-size: 25px;
  }

  .details {
    border: 1px solid #ddd;
    margin-top: 7px;
  }

  .details div {
    display: flex;
    align-items: center;
  }

  .details span {
    flex: 1;
    display: inline-block;
    padding: 26px 10px;
  }
</style>
