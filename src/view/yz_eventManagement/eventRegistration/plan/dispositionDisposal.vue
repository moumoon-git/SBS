<template>
  <div>
    <el-dialog left top="10px" width="1400px" :title="dealTitle" :visible.sync="dealDialog"
               :before-close="dispositionCloseDialog" :close-on-click-modal="false"
               append-to-body lock-scroll
    >
      <el-row>
        <el-col :span="4">
          <el-form :model="withForm" status-icon :rules="withRules" ref="ruleForm"
                   label-width="100px" class="demo-ruleForm" label-position="top"
          >
            <el-form-item label="事件标题:" >
              <el-input type="textarea" v-model="withForm.title" :autosize="{ minRows:2, maxRows:5}"
                        show-word-limit resize="none"></el-input>
            </el-form-item>
            <el-form-item label="总体情况:" >
              <el-input type="textarea" v-model="withForm.case" :autosize="{ minRows:5, maxRows: 7}"
                        show-word-limit resize="none"></el-input>
            </el-form-item>
            <div>
              <el-button type="primary" size="mini">保存</el-button>
            </div>
          </el-form>
        </el-col>
        <el-col :span="20" style="padding: 0 10px">
          <div class="contentWith">
            <div style="position: absolute;top: -10px;left: 20px;background-color: white;padding: 0 10px">联系人</div>
            <el-row >

              <el-col :span="8" style="height: 280px;padding: 0 10px">
                <el-scrollbar style="height: 100%;">
                    <el-input
                      clearable
                      placeholder="输入关键字进行搜索"
                      v-model="eventTreeSearch">
                    </el-input>
                     <el-tree ref="tree"
                              :data="treeData"
                              :props="defaultProps"
                              @node-click="handleNodeClick"
                              :filter-node-method="searchTreeData"
                              highlight-current
                              :default-expanded-keys="[0]"
                              node-key="id"
                     >
                      <span class="span-ellipsis" slot-scope="{ node }">
                        <span :title="node.label">{{ node.label }}</span>
                      </span>
                     </el-tree>

                </el-scrollbar>
              </el-col>

              <el-col :span="16">
                <el-row>
                  <el-col :span="20" style="padding: 0 ">
                    <el-input
                    placeholder="请输入一项联系人信息(名字、单位、职务、手机号码、办公电话)"
                    prefix-icon="el-icon-search"
                    v-model="searchGrouping"
                    >
                    </el-input>
                  </el-col>
                  <el-col :span="4" style="text-align: center">
                    <el-button type="primary" size="medium" @click="groupSearch">查找</el-button>
                  </el-col>
                </el-row>
                <el-row>
                  <el-scrollbar>
                     <el-table
                  height="230px"
                  :data="withTableData"
                  border
                  highlight-current-row
                  style="width: 100%;margin: 10px 0;text-align:center;">
                      <el-table-column
                        prop="name"
                        align="center"
                        label="联系人"
                        height="30"
                        show-overflow-tooltip
                        min-width="16%">
                      </el-table-column>
                      <el-table-column
                        prop="workUnit"
                        align="center"
                        label="单位"
                        height="30"
                        show-overflow-tooltip
                        min-width="21%">
                      </el-table-column>
                      <el-table-column
                        prop="position"
                        align="center"
                        label="职务"
                        height="30"
                        show-overflow-tooltip
                        min-width="21%">
                      </el-table-column>
                      <el-table-column
                        prop="mobile"
                        align="center"
                        label="手机号码"
                        height="30"
                        show-overflow-tooltip
                        min-width="21%">
                      </el-table-column>
                      <el-table-column
                        prop="officeTel"
                        align="center"
                        label="办公电话"
                        height="30"
                        show-overflow-tooltip
                        min-width="21%">
                      </el-table-column>
                </el-table>
                  </el-scrollbar>
                  <!--分页-->
                  <el-pagination
                    center
                    small
                    layout="prev, pager, next,  total, jumper"
                    :page-size="withPageSize"
                    :total="withTotal"
                    :current-page="withCurrentPage"
                    @current-change="handleCurrentChange"
                  >
                  </el-pagination>
                </el-row>


              </el-col>
            </el-row>

          </div>
        </el-col>
      </el-row>

      <el-row style="padding: 10px 0;">
          <el-col :span="4">
            <el-row>
              <div class="contentWith">
                <div style="position: absolute;top: -10px;left: 20px;background-color: white;padding: 0 10px">信息</div>

                <el-row style="font-size: 12px;padding-left: 10px;height: 450px">
                  <el-scrollbar style="height: 100%">
                  <div>{{contentWithTime}}</div>
                  <div style="text-indent: 10px">{{contentWithType}}--{{contentWithName}}({{contentWithPhone}})</div>

                    <div style="padding: 20px 0;text-indent: 10px">
                      {{contentWithRemak}}
                    </div>

                </el-scrollbar>
                </el-row>

              </div>
            </el-row>
          </el-col>
          <el-col :span="20" style="padding: 0 10px">
          <el-row>
            <el-tabs type="border-card" @tab-click="msgWith">
              <el-tab-pane label="电话">
                <!--电话组件-->
                <phone-model ref="phoneModel"></phone-model>
              </el-tab-pane>
              <el-tab-pane label="传真">
                <!--传真组件-->
                <fax-model ref="faxModel"></fax-model>
              </el-tab-pane>
              <el-tab-pane label="短信">
                <!--短信组件-->
                <sms-model ref="smsModel"></sms-model>
              </el-tab-pane>
            </el-tabs>
          </el-row>
        </el-col>
      </el-row>

<!--      <div slot="footer" class="dialog-footer">-->
<!--        <el-button @click="dispositionClose" size="small">取 消</el-button>-->
<!--        <el-button type="primary" size="small" @click="dispositionConfirm">确 定</el-button>-->
<!--      </div>-->
    </el-dialog>





  </div>
</template>

<script>
    import phoneModel from '@/view/yz_eventManagement/eventRegistration/plan/phoneModel'
    import smsModel from '@/view/yz_eventManagement/eventRegistration/plan/smsModel'
    import faxModel from '@/view/yz_eventManagement/eventRegistration/plan/faxModel'
    export default {
      name: "dispositionDisposal",
      components:{
        phoneModel,smsModel,faxModel
      },
      props:['dealDialog','dealTitle','eventId','reportDescription','continueItem'],
        data(){
          return{
            withForm:{
              title:'',
              case:''
            },
            id:'',//事件ID
            withRules:{

            },
            treeData: [
              {
                name: '全部分组',
                id: '',
                children: []
              }
            ],
            defaultProps: {
              children: 'children',
              label: 'name'
            },
            searchGrouping:'',//搜索分组
            withPageSize:10,
            withTotal:0,
            withCurrentPage:1,
            withTableData:[],//表格数据
            eventTreeSearch:'',//树节点搜索内容
            contentWithTime:'2018-09-23 07:19:14',//信息>>>时间
            contentWithType:'接听电话',//信息>>>类型
            contentWithName:'宿含芙',//信息>>>名字
            contentWithPhone:'17373221483',//信息>>>电话
            contentWithRemak:'',//信息>>>备注
            msgTableWith:'电话',//tabs默认选中
            groupingTreeID:'',//分组树ID
          }
        },
        watch: {
          eventTreeSearch(val) {
            this.$refs.tree.filter(val);
          }
        },
        mounted(){
          this.contentWithTime=this.continueItem.time;
          this.contentWithName=this.continueItem.contact;
          this.contentWithPhone=this.continueItem.mobile;
          this.contentWithRemak=this.continueItem.remark;
          if(this.continueItem.type=='sms'){
            this.contentWithType=`${this.continueItem.direct}短信`
          }
          if(this.continueItem.type=='phone'){
            this.contentWithType=`${this.continueItem.direct}电话`
          }
          if(this.continueItem.type=='fax'){
            this.contentWithType=`${this.continueItem.direct}传真`
          }

          this.withForm.title=this.dealTitle;
          this.withForm.case=this.reportDescription;
          let data={
            displayDefault:'false'
          }
          this.$szApi.phoneGroupList(data).then((res) => {
            if(res.errorcode == 0){
              let treeDataNum = res.data;
              this.treeData[0].children = JSON.parse(JSON.stringify(treeDataNum));
            }else {
              // //this.$message.error(res.msg)
            }

          });
        },
        methods:{
          searchTreeData(value, data){//tree节点搜索
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
          },
          dispositionClose(){//取消
            this.$emit('dispositionClose')
          },
          dispositionConfirm(){//确认
            this.$emit('dispositionConfirm')
          },
          dispositionCloseDialog(){//叉叉关闭弹窗
            this.$emit('dispositionCloseDialog')
          },
          handleNodeClick(data) {//树点击
            this.groupingTreeID=data.id
            this.groupingFormTable();
          },
          handleCurrentChange(val){//分组表格分页器
            this.withCurrentPage=val
            this.groupingFormTable()
          },
          groupSearch(){//分组查找
            this.withCurrentPage=1
            let pageNumber= this.withCurrentPage-1
            let TreeData={
              groupId:this.groupingTreeID,
              page:pageNumber,
              size:this.withPageSize,
              searchText:this.searchGrouping
            };
            this.$szApi.contactorList(TreeData).then((res) => {
              if(res.errorcode == 0){
                this.withTableData=res.data.data
                this.withTotal=res.data.totalElements
              }else {
                // //this.$message.error(res.msg)
              }

            });
          },
          groupingFormTable(){//获取分组表格
            let pageNumber= this.withCurrentPage-1
            let TreeData={
              groupId:this.groupingTreeID,
              page:pageNumber,
              size:this.withPageSize,
            };
            this.$szApi.contactorList(TreeData).then((res) => {
              if(res.errorcode == 0){
                this.withTableData=res.data.data
                this.withTotal=res.data.totalElements
              }else {
                // //this.$message.error(res.msg)
              }

            });
          },
          msgWith(tab){
            this.msgTableWith=tab.label
          },
        },
    }
</script>

<style scoped>
  >>>.el-dialog__body{
    padding: 0 20px;
  }
  .contentWith{
    border: 1px solid #ddd;
    border-radius: 5px;
    width: 100%;
    padding: 15px 0;
    position: relative;
  }
</style>
