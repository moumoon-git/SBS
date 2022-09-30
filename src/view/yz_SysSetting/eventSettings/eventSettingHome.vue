<template>
  <div>
    <el-row>
      <el-col :span="4" style="border-right: 1px solid #ddd">
        <el-scrollbar style="height: 600px">
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="eventTreeSearch">
          </el-input>
          <el-tree
            ref="tree"
            :data="treedata"
            node-key="id"
            highlight-current
            :default-expanded-keys="[0]"
            @node-click="handleNodeClick"
            :props="defaultProps"
            :filter-node-method="searchTreeData"
          >
            <span class="span-ellipsis" slot-scope="{ node}">
              <span :title="node.label">{{ node.label }}</span>
            </span>
          </el-tree>
        </el-scrollbar>

      </el-col>
      <el-col :span="20">

        <div class="topSetting">
          <el-scrollbar style="height: 280px">
            <div style="display: flex;text-align: left;padding-left: 20px">
              <el-button type="primary" icon="el-icon-plus" size="small" @click="addAuto">情景信息</el-button>
              <el-button style="margin-left: 20px" type="primary"  size="small" @click="send">保存</el-button>
              <el-link style="padding-left: 30px" type="primary" :underline="false">说明:名称、单位和可选项请避免使用特殊符号。<span style="color: red">填好信息后请记得保存</span></el-link>
            </div>
            <div>
                <div style="display: flex;flex-wrap: wrap;padding: 0 20px">

                  <el-card class="box-card" v-for="(item,index) in itemNumber" :key="index" style="width: 400px;margin: 10px">
                    <div slot="header" class="clearfix" style="text-align: left">
                      <span >参数</span>
                      <el-button style=" padding: 3px 0 3px 300px" type="text" icon="el-icon-delete"
                                 @click="deletesPlan(item,index)" >
                      </el-button>
                    </div>
                    <div  class="text item">
                      <div style="display: flex;width: 100%">
                        <div  class="curdPlanr">
                            <div class="curdTop">
                              <span class="curdLeft"><a  style="color: red">名称:</a></span>
                              <span class="curdRight">
                                <el-input
                                  size="small"
                                  v-model.trim="item.dataNuber.name"
                                >
                              </el-input>
                            </span>
                            </div>
                            <div class="curdTop">
                                <span class="curdLeft">单位:</span>
                                <span class="curdRight">
                                  <el-input
                                    size="small"
                                    v-model.trim="item.dataNuber.unit"
                                  >
                                </el-input>
                              </span>
                           </div>
                        </div>
                        <div style="padding-left: 10px"  class="curdPlanl">
                            <div class="curdTop">
                              <span class="curdLeft" style="text-align: center"><a  style="color: red">类型:</a></span>
                              <span class="curdRight">
                                <el-select v-model="item.dataNuber.typeValue" placeholder="请选择" @change="changeSelect($event,index)" :key="index">
                                  <el-option
                                    v-for="itemTwo in item.typeOption"
                                    :key="itemTwo.value"
                                    :label="itemTwo.label"
                                    :value="itemTwo.value">
                                  </el-option>
                                </el-select>
                            </span>
                            </div>
                        </div>
                      </div>

                      <!--循环的选项值-->
                      <div style="height: 40px;line-height: 40px" v-if="item.selectShow">

                        <div style="display: flex;width: 100%"   v-for="(itemSetVal,cindex) in item.set" :key="cindex">
                          <span class="curdLeft">选项值:</span>
                          <span class="curdRight">
                                  <el-input
                                    size="small"
                                    v-model="itemSetVal.setVal"
                                  >
                                </el-input>
                          </span>
                          <span class="curdLeft " >
                                <i v-if="cindex==0" class="el-icon-plus" style="padding-left: 45px" @click="addSelectVal(item,index)"></i>
                                <i v-else class="el-icon-delete" style="padding-left: 45px" @click="deleteSelectVal(item,index,cindex)"></i>
                          </span>
                        </div>
                      </div>


                    </div>
                  </el-card>
                </div>

            </div>

          </el-scrollbar>
        </div>

        <div class="bottomSetting">
          <el-tabs type="border-card" @tab-click="msg" >
            <el-tab-pane label="信息核实">
              <div style="width: 100%">
                <msg-check v-if="tabLabel=='信息核实'" ref="msgCheck"></msg-check>
              </div>
            </el-tab-pane>
            <!-- 注释原因：3.0事件处置管理需求里只有信息核实 20210630 -->
            <!-- <el-tab-pane label="实情初判">
              <truth-initial-judging v-if="tabLabel=='实情初判'" ref="truthInitialJudging"></truth-initial-judging>
            </el-tab-pane>
            <el-tab-pane label="信息报送">
              <msg-send v-if="tabLabel=='信息报送'" ref="msgSend" :treeId='treeId'></msg-send>
            </el-tab-pane>
            <el-tab-pane label="领导指示">
              <lead-indicate v-if="tabLabel=='领导指示'"  ref="leadIndicate" ></lead-indicate>
            </el-tab-pane>
            <el-tab-pane label="指令传达">
              <order-send v-if="tabLabel=='指令传达'" ref="orderSend"></order-send>
            </el-tab-pane> -->
            <!--
            <el-tab-pane label="情况上报">
              <case-up v-if="tabLabel=='情况上报'" ref="caseUp"></case-up>
            </el-tab-pane>
            <el-tab-pane label="启动预案">
              <start-arranged v-if="tabLabel=='启动预案'" ref="startArranged"></start-arranged>
            </el-tab-pane>
            <el-tab-pane label="情况汇总">
              <case-collect v-if="tabLabel=='情况汇总'" ref="caseCollect"></case-collect>
            </el-tab-pane>
            -->
          </el-tabs>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
    import msgCheck from '@/view/yz_SysSetting/eventSettings/plan/msgCheck'
    import truthInitialJudging from '@/view/yz_SysSetting/eventSettings/plan/truthInitialJudging'
    import msgSend from '@/view/yz_SysSetting/eventSettings/plan/msgSend'
    import leadIndicate from '@/view/yz_SysSetting/eventSettings/plan/leadIndicate'
    import orderSend from '@/view/yz_SysSetting/eventSettings/plan/orderSend'
    import caseUp from '@/view/yz_SysSetting/eventSettings/plan/caseUp'
    import startArranged from '@/view/yz_SysSetting/eventSettings/plan/startArranged'
    import caseCollect from '@/view/yz_SysSetting/eventSettings/plan/caseCollect'
    export default {
        name: "eventSettingHome",
        components:{
          msgCheck,
          truthInitialJudging,
          msgSend,
          leadIndicate,
          orderSend,
          caseUp,
          startArranged,
          caseCollect
        },
        data(){
          return{
            defaultProps: {
              children: 'children',
              label: 'name',
            },
            treedata: [
              {
                name: '事件类型',
                id: 0,
                children: []
              }
            ],
            obj:{ //数据对象
              id:'',
              typeOption:[
                {
                  value: '数字',
                  label: '数字'
                },
                {
                  value: '选择',
                  label: '选择'
                },
                {
                  value: '时间',
                  label: '时间'
                },
                {
                  value: '文本',
                  label: '文本'
                },
              ],//下拉列表s数据
              dataNuber:{
                name:'',//名称
                unit:'',//单位
                typeValue:'',//选中内容
                setVal:'',//设置文本内容
              },
              set:[],  // 添加选项数组
              selectShow:false,
            },
            itemNumber:[],//计算多少个参数卡片
            // selectShow:false,//用选择时的文本
            tabLabel:'信息核实',
            eventTreeSearch:'',//树搜索
          }
        },
        mounted(){
          this.getTreeData();
        },
        watch: {
          eventTreeSearch(val) {
            this.$refs.tree.filter(val);
          }
        },
        methods:{
          searchTreeData(value, data){//tree节点搜索
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
          },
          msg(tab){
            this.tabLabel=tab.label;
          },
          handleNodeClick(data){//树点击
            sessionStorage.setItem('parameterTreeId',data.id)
            this.treeId=sessionStorage.getItem('parameterTreeId')
            this.getPlime();
            switch (this.tabLabel) {
              case '信息核实':
                this.$refs.msgCheck.evaluationID();
                this.$refs.msgCheck.staffData=[];
                this.$refs.msgCheck.staffId='';
                break;
              case '实情初判':
                this.$refs.truthInitialJudging.evaluationID();
                break;
              case '信息报送':
                this.$refs.msgSend.msgTableData=[];
                this.$refs.msgSend.crewId='';
                this.$refs.msgSend.changeRed=-1;
                this.$refs.msgSend.evaluationID();
                break;
              case '领导指示':
                this.$refs.leadIndicate.evaluationID();
                break;
              case '指令传达':
                this.$refs.orderSend.evaluationID();
                break;
              case '情况上报':
                this.$refs.caseUp.evaluationID();
                break;
              case '启动预案':
                this.$refs.startArranged.evaluationID();
                break;
              case '情况汇总':
                this.$refs.caseCollect.evaluationID();
                break;
              default:
                break;
            }
          },
          getPlime(){//获取当前事件的参数
            let data={
              caseId:this.treeId
            };
            this.$api.paramList(data).then((res) => {
              if(res.errorcode==0){
                this.itemNumber=[];
                  for(let i=0;i<res.data.length;i++){
                    if(res.data[i].type=='选择'){
                      let arrAppend=[];
                      for(let k=0;k<res.data[i].value.length;k++){
                        arrAppend.push({setVal:res.data[i].value[k]})
                      }
                        this.obj={ //数据对象
                          id:res.data[i].id,
                          typeOption:[
                            {
                              value: '数字',
                              label: '数字'
                            },
                            {
                              value: '选择',
                              label: '选择'
                            },
                            {
                              value: '时间',
                              label: '时间'
                            },
                            {
                              value: '文本',
                              label: '文本'
                            },
                          ],//下拉列表s数据
                          dataNuber:{
                            name:res.data[i].name,//名称
                            unit:res.data[i].unit,//单位
                            typeValue:res.data[i].type,//选中内容
                            setVal:'',//设置文本内容
                          },
                          set:arrAppend,  // 添加选项数组
                          selectShow:true,
                        }

                    }
                    else {
                      this.obj={ //数据对象
                        id:res.data[i].id,
                        typeOption:[
                          {
                            value: '数字',
                            label: '数字'
                          },
                          {
                            value: '选择',
                            label: '选择'
                          },
                          {
                            value: '时间',
                            label: '时间'
                          },
                          {
                            value: '文本',
                            label: '文本'
                          },
                        ],//下拉列表s数据
                        dataNuber:{
                          name:res.data[i].name,//名称
                          unit:res.data[i].unit,//单位
                          typeValue:res.data[i].type,//选中内容
                          setVal:'',//设置文本内容
                        },
                        set:[],  // 添加选项数组
                        selectShow:false,
                      }
                    }
                    this.itemNumber.push(this.obj);

                  }
              }
            })
          },
          send(){
            let arr=[];
            this.itemNumber.forEach((item,index) =>{
              let name = item.dataNuber.name;
              let unit = item.dataNuber.unit;
              let types = item.dataNuber.typeValue;
              let id = item.id;
              if(item.id==undefined||item.id==''){
                 id=null
              }

              arr.push({
                type:types,
                unit:unit,
                value:[],
                name:name,
                id:id
              });

              item.set.forEach(citem =>{
                arr[index].value.push(citem.setVal);
              });
            });
            for(let k=0; k< arr.length; k++){
              if(arr[k].name==''||arr[k].name==null){
                this.$message({
                  message: '参数名称不能为空!',
                  type: 'warning'
                });
                return;
              }
              if(arr[k].type==''||arr[k].type==null){
                this.$message({
                  message: '参数类型不能为空!',
                  type: 'warning'
                });
                return;
              }
              for(let j=k+1; j< arr.length; j++){
                if(arr[k].name== arr[j].name){
                  this.$message({
                    message: '参数名称不能相同!',
                    type: 'warning'
                  });
                  return;
                }
              }
            }
            let datas=Array.from(new Set(arr))
            console.log(datas);
            if(this.treeId==''||this.treeId==undefined||this.treeId==null){
              this.$message({
                message: '请先选择事件类型!',
                type: 'warning'
              });
              return
            }
            let data={
              caseId:this.treeId,
              data:arr
            };
            this.$api.paramAdd(data).then((res) => {
              if(res.errorcode==0){
                this.getPlime();
                this.$message({
                  message: '保存成功',
                  type: 'success'
                });
                // if(arr!=[]&&arr!=null && arr!= ''){
                //   this.$message({
                //     message: '保存成功',
                //     type: 'success'
                //   });
                // }
              }else {
                this.$message.error(res.msg)
              }
            })
          },
          deleteSelectVal(item,index,cindex){//选中选择时添加value值
            this.$confirm('确认删除该条选项?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.itemNumber[index].set.splice(cindex,1)
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              });
            });

          },
          addSelectVal(item,index){//选中选择时添加value值
            let b = JSON.parse(JSON.stringify(this.obj.dataNuber.setVal));
            this.itemNumber[index].set.push({setV:b});
          },
          changeSelect(val,index){//监听选择的是什么格式的文本
            switch (val) {
              case '数字':
                this.itemNumber[index].selectShow=false;

                break;
              case '选择':
                this.itemNumber[index].selectShow=true;
                this.itemNumber[index].set=[
                  {
                    setVal: ''
                  }
                ];
                break;
              case '时间':
                this.itemNumber[index].selectShow=false;

                break;
              case '文本':
                this.itemNumber[index].selectShow=false;
                break;
            }
          },
          addAuto(){//新增一个
            if(this.treeId==''||this.treeId==undefined||this.treeId==null){
              this.$message({
                message: '请先选择事件类型！!',
                type: 'warning'
              });
              return
            }
            this.obj={ //数据对象
              typeOption:[
                {
                  value: '数字',
                  label: '数字'
                },
                {
                  value: '选择',
                  label: '选择'
                },
                {
                  value: '时间',
                  label: '时间'
                },
                {
                  value: '文本',
                  label: '文本'
                },
              ],//下拉列表s数据
              dataNuber:{
                name:'',//名称
                unit:'',//单位
                typeValue:'',//选中内容
                setVal:'',//设置文本内容
              },
              set:[],  // 添加选项数组
              selectShow:false,
            };
            let a = JSON.parse(JSON.stringify(this.obj));
            this.itemNumber.push(a);
          },
          deletesPlan(item,index){//删除当前这一个
            this.itemNumber.splice(index,1)
          },
          getTreeData() {
            let data = {};
            this.$api.getTree(data).then(res => {
              if (res.errorcode!=0){
                this.$message({
                  message:res.msg,
                  type:"error"
                });
                return
              }
              let treeData = res.data;
              this.treedata[0].children = JSON.parse(JSON.stringify(treeData));
            })
          }
        }
    }
</script>

<style scoped>
  .span-ellipsis {
    width: 100%;
    text-align: left;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: block;
  }
  .topSetting{
    height: 280px;
    border-bottom: 1px solid #ddd;
  }
  .bottomSetting{

  }
  >>>.el-card__header{
    padding: 10px 20px;
  }
  >>>.el-card__body{
    padding: 0 20px 20px 20px;
  }
  .curdPlanr{
    flex: 1;
  }
  .curdPlanl{
    flex: 1;
  }
  .curdTop{
    display: flex;
    height: 40px;
    line-height: 40px;
    margin-top: 10px
  }
  .curdLeft{
    height: 40px;
    line-height: 40px;
    display: inline-block;
    flex: 1;
    text-align: left
  }
  .curdRight{
    display:inline-block;
    flex: 3
  }
  >>>.el-card, .el-message{
    overflow: auto;
  }
  .curdRight>>>.el-input__inner{
    height: 35px;
    line-height: 35px;
  }
  .bottomSetting>>>.el-tabs--border-card>.el-tabs__content{
    padding: 0 !important;
  }
</style>
