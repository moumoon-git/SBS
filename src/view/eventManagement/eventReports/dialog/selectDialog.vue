<template>
  <div>
    <el-dialog  top="50px"  width="70%" :title="selectTitle"
                :visible.sync="selectData" left :before-close="closeDialog"
                :close-on-click-modal="false"
                append-to-body >
      <el-row >
        <el-col :span="6">
          <el-scrollbar>
            <el-tree style="overflow: scroll;height: 600px"
                     :highlight-current="showTree"
                     node-key="id"
                     :data="dataTree" :props="defaultProps"
                     @node-click="handleNodeClick"
                     current-node-key="">
              <span class="span-ellipsis" slot-scope="{node}">
              <span :title="node.label">{{ node.label }}</span>
            </span>
            </el-tree>
          </el-scrollbar>
        </el-col>
        <el-col :span="18">
          <div style="display: flex;width: 90%;margin: 0 auto">
            <div style="flex: 5">
              <el-input type="text" placeholder="请输入内容"  clearable v-model="inquireQuery">
                <template slot="append" >
                  <el-button @click="getTableList">查询</el-button>
                </template>
              </el-input>
            </div>
          </div>
          <div style="display: flex;width: 90%;margin: 0 auto">
            <el-checkbox-group
              style="display: flex;flex-wrap: wrap;"
              v-model="checkedCities"
            >
              <el-checkbox v-for="(city,item) in cities" :label="city.id"   :key="item">
                <div style="width: 100%">
                  <div style="display: flex;height: 60px;line-height: 60px">
                    <div style="flex: 1;text-align: center;display: block;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" :title="city.name">{{city.name}}</div>
                    <div style="flex: 1;text-align: center;display: block;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" :title="city.position">{{city.position}}</div>
                  </div>
                  <div style="height: 60px;line-height: 60px;text-indent: 20px;text-align: left">
                    {{city.mobile}}
                  </div>
                </div>
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <div style="width: 100%;margin-top: 30px; text-align: center">
            <el-pagination :small="pagingSize"  :page-size="pageSize"  :total="total"
                           :current-page="currentPage"
                            @current-change="pageMode"
                           layout="total, prev, pager, next, jumper"></el-pagination>
          </div>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="close" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

    export default {
        name: "selectDialog",
        props:['selectTitle','selectData'],
        data(){
          const data = [
            // {
            // id: -7,
            // name: '已选人员',
            // children: null
            // },
            {
              id: '',
              name: '查询所有',
              children: null
            },
            {
              id: -777,
              name: '政务联络网',
              children: null
            }
            ];
          return{
            defaultProps: {
              children: 'children',
              label: 'name'
            },
            dataTree:JSON.parse(JSON.stringify(data)),
            pagingSize:true,
            total:0,
            pageSize:12, //每页多少条
            currentPage:1, //当前页
            checkedCities: [],//选中联系人
            cities: [],//右侧列表
            inquireQuery:'',//查询
            treeId:'',//树ID
            showTree:true,
            serchTs:'',//用来判断搜索内容是否点击了
          }
        },
        watch:{
          treeId:{
            handler(newV,oldV){
              if(newV!=oldV){
                this.currentPage=1
              }
            },
            deep:true
          },
          serchTs:{
            handler(newV,oldV){
              if(newV!=oldV){
                this.currentPage=1
              }
            },
            deep:true
          }
        },
        methods:{
          getListTree(){
            let data={};
            this.$api.telephoneGroupingTree(data).then((res) => {
              if(res.errorcode=='0'){
                this.dataTree[1].children=res.data;
                // console.log('res.data: ', res.data);
                this.handleNodeClick(this.dataTree[0])
              }else {
                //this.$message.error(res.msg);
              }
            })
          },
          close(){
            this.$emit('close');
          },
          confirm(){
            this.$emit('confirm',this.checkedCities);
          },
          closeDialog(){
            this.$emit('closeDialog');
          },
          handleNodeClick(data) {
            if(data.id==-7||data.id==-77||data.id==-777){
              return;
            }
            this.treeId=data.id;
            this.inquireQuery='';
            this.currentPage=1;
            this.checkedCities=[]
            this.getTableList(data);
          },
          getTableList(){
            console.log(this.currentPage);
            let grouping={
              dictType: 'governmentAffairs',
              groupId:this.treeId,
              page:this.currentPage,
              size:this.pageSize,
              searchText: this.inquireQuery,
              type: 'phone'
            };
            this.serchTs=this.inquireQuery
            this.$api.contactorList(grouping).then((res) => {
              if(res.errorcode=='0'){
                this.cities=res.data.list;
                this.total=res.data.totalCount
              }else {
                //this.$message.error(res.msg);
              }
            })
          },
          pageMode(val){
            this.currentPage=val;
            this.checkedCities=[]
            this.getTableList();
          },
        }
    }
</script>

<style scoped>
  >>>.el-checkbox-group .el-checkbox{
    display: inline-block;
    border: 1px solid #ddd;
    border-radius: 5px;
    width: 200px;
    height: 120px;
    line-height: 120px;
    margin: 10px 5px;
  }
  >>>.el-checkbox__input{
    display: none;
  }
  >>>.el-checkbox__label{
    display: flex;
    padding-left: 0;
    width: 100%;
  }
  >>>.el-input-group__append{
    background-color: #409eff;
    border-color: #409eff;
    color: white;
    cursor: pointer;
  }
</style>
