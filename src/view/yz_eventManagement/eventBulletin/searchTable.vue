<template>
  <div>
    <el-dialog  top="50px"  width="70%" :title="selectTitle"
                :visible.sync="selectData" left :before-close="SearchCloseDialog"
                :close-on-click-modal="false"
                append-to-body >
      <div class="searchBox">
        <el-input prefix-icon="iconfont icon-sousuo"  placeholder="输入用户名/登录名/手机号" v-model="searchTableInfo"  style="width:240px"></el-input>
        <el-button type="primary" size="medium" @click="searchData">搜索</el-button>
      </div>
      <el-table
        ref="indexTable"
        :data="dataTable"
        border
        style="width: 100%;margin: 10px 0;text-align:center;"
        :row-key="bindRowKeys"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          align="center"
          width="55"
          :reserve-selection="true"
        />
        <el-table-column
          prop="displayname"
          align="center"
          label="用户名"
          min-width="30%"
        />
        <el-table-column
          prop="name"
          align="center"
          label="登录名"
          min-width="30%"
        />
        <el-table-column
          prop="mobile"
          align="center"
          label="手机号码"
          min-width="30%"
        />
        <el-table-column
          prop="lastLogin"
          align="center"
          label="最近登陆时间"
          min-width="30%"
        />
        <el-table-column
          prop="status"
          align="center"
          label="状态"
          min-width="30%"
        />
      </el-table>
      <!--分页-->
      <el-pagination
        center
        background
        layout="prev, pager, next,  total, jumper"
        :page-size="pagesize"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="close" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "searchTable",
    props:['selectTitle','selectData'],
    data() {
      return {
        //搜索条件
        searchTableInfo:"",
        pagesize: 10,
        currpage: 1,
        total:0,
        getSearchInfo:[],
        dataTable:[],
        multipleSelection:[],//选中的联系人
        searchType:'',//区分是搜索还是列表
      };
    },
    watch:{
      searchTableInfo:{
        handler(newV,oldV){
          if(oldV===''|| newV!==oldV){
            this.currpage=1
          }
        },
        deep:true
      },
      // 分页回显数据
      dataTable(val) {
        val.forEach(item => {
          this.multipleSelection.forEach(self => {
            if (item.userId == self) {
              this.$refs.indexTable.toggleRowSelection(item);
            }
          });
        });
      },
    },
    methods: {
      SearchCloseDialog(){
        this.$refs.indexTable.clearSelection();
        this.$emit('closeDialog');
      },
      close(){
        this.$refs.indexTable.clearSelection();
        this.$emit('close');
      },
      confirm(){
        this.$emit('confirm',this.multipleSelection);
        this.$refs.indexTable.clearSelection();
      },
      // 当前页改变
      handleCurrentChange(cpage) {
        if(this.searchType=='列表'){
          this.currpage = cpage;
          this.info();
        }else {
          this.currpage = cpage;
          this.searchData();
          this.multipleSelection = [];
        }

      },
      // 页面大小改变
      handleSizeChange(psize) {
        if(this.searchType=='列表'){
          this.pagesize = psize;
          this.info();
        }else {
          this.pagesize = psize;
          this.searchData();
          this.multipleSelection = [];
        }
      },
      // 操作多选
      handleSelectionChange(val) { 
        let arr = [];
        val.forEach(item => {
          arr.push(item.userId);
        });
        console.log(arr);
        this.multipleSelection = arr;
      },
      bindRowKeys(row) {
        return row.userId;
      },
      searchData(){//搜索数据
        this.searchType='搜索';
        let data={
          page:this.currpage,
          limit:this.pagesize,
          username:this.searchTableInfo,
          platformId:'',
          // key:this.searchTableInfo
        };
        this.$api.sendAppListAll(data).then((res) => {
          if(res.errorcode==0){
            this.dataTable=res.page.list
            this.total=res.page.totalCount
          }
        })
      },
      info() {
        this.searchType='列表';
        let data={
          page:this.currpage,
          limit:this.pagesize,
          username:this.searchTableInfo,
          platformId:'',
          // key:this.searchTableInfo
        };
        this.$api.sendAppListAll(data).then((res) => {
          if(res.errorcode==0){
            this.dataTable=res.page.list
            this.total=res.page.totalCount
          }
        })
      }
    },
  }
</script>

<style scoped>

</style>
