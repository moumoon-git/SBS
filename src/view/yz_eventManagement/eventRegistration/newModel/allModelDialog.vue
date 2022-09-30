<template>
  <div>
    <el-dialog  top="20px" width="1600px"  :title="allModelTitle" :visible.sync="suspendModelDialog"
                :before-close="allModelCloseDialog" :close-on-click-modal="false"
                append-to-body lock-scroll left v-if='suspendModelDialog'
    >

      <el-row>
        <el-col :span="14">

          <el-tabs type="border-card" v-model="leftTabsType">
            <el-tab-pane label="传真" name="传真">
              <el-col :span="10">
                <el-card class="box-card cardCalss" shadow="hover" >
                  <div style="width: 100%;height: 30px;line-height: 30px;text-align: center;background-color: cornflowerblue;color: white;">信息池</div>
                  <div style="height: 645px">
                    <div style="width: 100%;margin: 0 auto">
                      <el-date-picker
                        style="width: 100%;margin: 15px auto"
                        v-model="queryFaxAllTime"
                        type="daterange"
                        size="small"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">

                      </el-date-picker>
                    </div>
                    <div style="display: flex">

                      <div style="flex: 6">
                        <el-select size="small" v-model="queryFaxAllSelect" placeholder="请选择">
                          <el-option
                            v-for="item in faxAllSelectData"
                            :key="item.id"
                            :label="item.label"
                            :value="item.id">
                          </el-option>
                        </el-select>
                      </div>
                      <div style="flex: 1">
                        <el-button   type="primary" size="mini">查询</el-button>
                      </div>


                    </div>

                    <div>
                      <el-scrollbar style="height: 100%">
                        <div style="height: 500px">
                          <div
                               style="margin-top: 10px" v-for="(item,index) in  list" :key="index" @click="changeItem(item,index)">
                            <el-card :class="{ cardModelDiv:changeIndex == index}" shadow="hover" :body-style="bodyStyle">
                              <div style="display: flex">
                                <div style="font-size: 12px;flex: 3">{{item.time}}</div>
                                <div class="ibackDiv">
                                  <i class="el-icon-plus"></i>
                                  <i class="el-icon-edit" v-if="item.indexUpdataButton"  @click="faxUpdataButton(item,index)"></i>
                                  <i class="el-icon-connection"></i>
                                  <i class="iBack_img" v-if="item.returnButton" @click="faxReturnButton(item,index)"></i>
                                  <i class="iSave_img" v-if="item.saveButton" @click="faxSaveButton(item,index)"></i>
                                </div>
                              </div>

                              <div>
                                <div style="padding: 5px 0;display: flex">
                                  <div style="flex: 3">姓名:{{item.name}}</div>
                                  <div style="flex: 1;color: red">{{item.state}}</div>
                                </div>

                                <div style="padding: 5px 0;">备注:{{item.unit}}</div>
                                <div style="padding: 5px 0;">关联事件:{{item.event}}</div>
                              </div>

                            </el-card>

                          </div>
                        </div>
                      </el-scrollbar>
                      <div>
                        <el-pagination
                          center
                          small
                          layout="prev, pager, next,  total, jumper"
                          :page-size="pageFaxSize"
                          :total="totalFax"
                          :current-page="currentFaxPage"
                          @current-change="handleCurrentFaxChange"
                        >
                        </el-pagination>
                      </div>
                    </div>


                  </div>
                </el-card>
              </el-col>
              <el-col :span="14" id="faxCard">
                <el-card class="box-card cardCalss" shadow="hover" >
                  <div >
                    <el-tabs type="border-card" style="height: 713px">
                      <el-tab-pane label="原件预览">
                        <div style="width: 100%;height: 647px;">
                          <iframe :src="allFpxPreviewPath" id="fpxIframe" width="100%" height="100%"
                                  frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes"
                          ></iframe>
                        </div>
                      </el-tab-pane>
                      <el-tab-pane label="文本预览">文本预览</el-tab-pane>
                    </el-tabs>
                  </div>
                </el-card>
              </el-col>
            </el-tab-pane>
            <el-tab-pane label="电话" name="电话">
              <el-col :span="10">
                <el-card class="box-card cardCalss" shadow="hover" >
                  <div style="width: 100%;height: 30px;line-height: 30px;text-align: center;background-color: cornflowerblue;color: white;">信息池</div>
                  <div style="height: 645px">

                  </div>
                </el-card>
              </el-col>
              <el-col :span="14">
                <el-card class="box-card cardCalss" shadow="hover" >
                  <div style="height: 675px">

                  </div>
                </el-card>
              </el-col>
            </el-tab-pane>
            <el-tab-pane label="短信" name="短信">
              <el-col :span="10">
                <el-card class="box-card cardCalss" shadow="hover" >
                  <div style="width: 100%;height: 30px;line-height: 30px;text-align: center;background-color: cornflowerblue;color: white;">信息池</div>
                  <div style="height: 645px">

                  </div>
                </el-card>
              </el-col>
              <el-col :span="14">
                <el-card class="box-card cardCalss" shadow="hover" >
                  <div style="height: 675px">

                  </div>
                </el-card>
              </el-col>
            </el-tab-pane>
          </el-tabs>

        </el-col>

        <el-col :span="10">
          <el-card class="box-card cardCalss" shadow="hover" >
            <div style="width: 100%;height: 30px;line-height: 30px;text-align: center;background-color: cornflowerblue;color: white;">信息处理</div>
            <el-tabs v-model="activeAllModel" type="card">
              <el-tab-pane label="传真" name="传真">
                <new-fax-model ref="newFaxModel"></new-fax-model>
              </el-tab-pane>
              <el-tab-pane label="电话" name="电话">
                <new-phone-model ref="newPhoneModel" ></new-phone-model>
              </el-tab-pane>
              <el-tab-pane label="短信" name="短信">
                <new-sms-model ref="newSmsModel"></new-sms-model>
              </el-tab-pane>
            </el-tabs>

          </el-card>
        </el-col>

      </el-row>

    </el-dialog>
  </div>
</template>

<script>
  import newFaxModel from '@/view/yz_eventManagement/eventRegistration/newModel/newFaxModel'
  import newSmsModel from '@/view/yz_eventManagement/eventRegistration/newModel/newSmsModel'
  import newPhoneModel from '@/view/yz_eventManagement/eventRegistration/newModel/newPhoneModel'
  // import audioCompName from '@/view/yz_eventManagement/eventRegistration/newModel/audio'
  export default {
    name: "allModelDialog",
    components:{
      newFaxModel,newSmsModel,newPhoneModel
      // ,audioCompName
    },
    props:['allModelTitle','suspendModelDialog'],
    data(){
      return{
        activeAllModel:'传真',//右边tabs选项
        leftTabsType:'传真',//左边tabs选项
        allFpxPreviewPath:'',//allModel选中传真的传真预览地址
        queryFaxAllTime:'',//allModel传真查询时间
        queryFaxAllSelect:'',//allModel传真下拉选中
        faxAllSelectData:'',//allModel传真获取到的数据
        list:[
          {
            time:'2019年03月05日 18:45',
            name:'马璇',
            state:'默认处置中',
            unit:'区妇联',
            event:'山体滑坡事件',
            returnButton:false,
            saveButton:false,
            indexUpdataButton:true
          },
          {
            time:'2019年03月05日 18:45',
            name:'马璇',
            state:'默认处置中',
            unit:'区妇联',
            event:'山体滑坡事件',
            returnButton:false,
            saveButton:false,
            indexUpdataButton:true
          },
          {
            time:'2019年03月05日 18:45',
            name:'马璇',
            state:'默认处置中',
            unit:'区妇联',
            event:'山体滑坡事件',
            returnButton:false,
            saveButton:false,
            indexUpdataButton:true
          },
          {
            time:'2019年03月05日 18:45',
            name:'马璇',
            state:'待处置',
            unit:'区妇联',
            event:'山体滑坡事件',
            returnButton:false,
            saveButton:false,
            indexUpdataButton:true
          },
          {
            time:'2019年03月05日 18:45',
            name:'马璇',
            state:'待处置',
            unit:'区妇联',
            event:'山体滑坡事件',
            returnButton:false,
            saveButton:false,
            indexUpdataButton:true
          },{
            time:'2019年03月05日 18:45',
            name:'马璇',
            state:'待处置',
            unit:'区妇联',
            event:'山体滑坡事件',
            returnButton:false,
            saveButton:false,
            indexUpdataButton:true
          },
          {
            time:'2019年03月05日 18:45',
            name:'马璇',
            state:'待处置',
            unit:'区妇联',
            event:'山体滑坡事件',
            returnButton:false,
            saveButton:false,
            indexUpdataButton:true
          },
          {
            time:'2019年03月05日 18:45',
            name:'马璇',
            state:'待处置',
            unit:'区妇联',
            event:'山体滑坡事件',
            returnButton:false,
            saveButton:false,
            indexUpdataButton:true
          },
          {
            time:'2019年03月05日 18:45',
            name:'马璇',
            state:'待处置',
            unit:'区妇联',
            event:'山体滑坡事件',
            returnButton:false,
            saveButton:false,
            indexUpdataButton:true
          },
          {
            time:'2019年03月05日 18:45',
            name:'马璇',
            state:'待处置',
            unit:'区妇联',
            event:'山体滑坡事件',
            returnButton:false,
            saveButton:false,
            indexUpdataButton:true
          },
        ],
        pageFaxSize:10,//传真MODEL分页
        totalFax:0,//传真MODEL分页
        currentFaxPage:1,//传真MODEL分页
        bodyStyle:{
          padding: '10px;',
          backgroundColor:'transparent',
          cursor: 'pointer'
        },//cred 默认的样式
        changeIndex:-1,//更改背景颜色
      }
    },
    created(){

    },
    mounted(){

    },
    methods:{
      allModelCloseDialog(){
        this.$emit('allModelCloseDialog')
      },
      handleCurrentFaxChange(val){//传真model分页器
        this.$emit('handleCurrentFaxChange',val)
      },
      changeItem(item,index){//点击每一条数据
        this.changeIndex=index
      },
      faxUpdataButton(item,index){//传真修改按钮
        console.log(item,index);
        item.indexUpdataButton=false  //修改按钮
        item.returnButton=true
        item.saveButton=true
      },
      faxReturnButton(item){//传真返回按钮
        item.indexUpdataButton=true  //修改按钮
        item.returnButton=false
        item.saveButton=false
      },
      faxSaveButton(item){//传真保存按钮
        item.indexUpdataButton=true  //修改按钮
        item.returnButton=false
        item.saveButton=false
      },

    }
  }
</script>

<style scoped>
  >>>.el-dialog__header{
    background-color: cornflowerblue;
  }
  >>>.el-dialog__title{
    color: white !important;
  }
  >>>.el-dialog__headerbtn .el-dialog__close{
    color: white !important;
  }
  >>>.el-dialog--center .el-dialog__body{
    padding: 5px 0 0 0 ;
  }
  #faxCard >>>.el-card__body{
    padding:0 ;
  }
  .iBack_img{
    display: inline-block;
    height:16px;
    width:16px;
    background-image: url('../../../../../static/img/icon/getBack.png');
    background-size: 100%;
  }
  .iSave_img{
    display: inline-block;
    height:16px;
    width:16px;
    background-image: url('../../../../../static/img/icon/save.png');
    background-size: 100%;
  }
  .ibackDiv{
    flex: 1;
    font-size: 17px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #8A8A8A
  }
  .ibackDiv i{
    margin: 0 5px;
    cursor: pointer;
  }
  .cardModelDiv{
    background-color: cornflowerblue !important;
    color: white !important;
  }
</style>
