<template>
  <div class="resoureteamWrap">
    <div style="height:8px;width:100%;background: rgb(240, 243, 244);"></div>

    <div style="width:100%;display: flex;padding:32px 16px 0px 16px">
      <div style="width:15%;min-width:320px;">
        <sheltermanagetree
          :list="modifiedUserList"
          :listProps="modifiedUserProps"
          @handleNodeClick="handleNodeClick"
          @showTree="showEventType"
          @addTree="addEventType"
          @updateTree="updateEventType"
          @deleteTree="deleteEventType"
        >
        </sheltermanagetree>
      </div>
      <div class="tableClass">
        <div style="height:725px;max-height:725px;">
          <!--<sheltermanagetable :dataList="platShareMenuList"></sheltermanagetable>-->
          <sheltermanagetable ref="managetable"></sheltermanagetable>
        </div>
      </div>

    </div>
    <!--分组增改 -->
    <sheltermanagetreecrud
      v-if="resoureteamTreeCrudVisible"
      ref="resoureteamTreeCrud"
      @refreshEventTypeDataList="getDataList"
    ></sheltermanagetreecrud>

  </div>
</template>

<script>

  import sheltermanagetree from "./shelterManage-tree";
  import sheltermanagetable from "./shelterManage-table";
  import sheltermanagetreecrud from "./shelterManage-tree-crud";
  import { treeDataTranslate } from "@/utils";

  export default {
    data () {
      return {
        selectedNode: 0,
        fileList: [],
        filename: "",
        //上传文件的文件名
        uploadfilesname: "",
        // 树形勾选框选中的id
        checkedIds: [],

        treeForm: {
          id:'',
          parentId:'',
          ancestors:'',
          // 分组名字
          currentTreename: "",
          //分组描述
          groupingdescription: "",
          name: "",
          url: "",
          password: "",
          remark: "",
        },
        //表格
        platShareMenuList: {},
        //平台列表
        platformList: [],
        //分组树形
        modifiedUserList: [],
        modifiedUserProps: {
          children: "children",
          label: "name"
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        //队伍类型Visible
        resoureteamTreeCrudVisible: false,
      }
    },
    components: {
      sheltermanagetable,
      sheltermanagetree,
      sheltermanagetreecrud,
    },
    created(){
      this.getDataList()
    },
 
    methods: {
      // 新增短信平台弹窗
      addNewResoureteam(id) {
        this.addOrUpdateVisible = true;
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id);
        });
      },

      //点击列表事件
      handleNodeClick(obj) {
        this.selectedNode = obj.id;
        //点击切换
        this.getMessageInfo();

      },

      //查看分组
      showEventType(id) {
        this.resoureteamTreeCrudVisible = true;
        this.$nextTick(() => {
          this.$refs.resoureteamTreeCrud.init(id, null, 1); //代表查看
        });
      },

      //添加分组
      addEventType() {
        this.resoureteamTreeCrudVisible = true;
        this.$nextTick(() => {
          this.$refs.resoureteamTreeCrud.init(null, null, 2); //代表添加
        });
      },

      //修改分组名称
      updateEventType(id) {
        this.resoureteamTreeCrudVisible = true;
        this.$nextTick(() => {
          this.$refs.resoureteamTreeCrud.init(id, null, 3); //代表修改
        });
      },

      //删除分组
      deleteEventType(id) {
        console.log("id",id)
        var ids = [];
        ids.push(id);
        this.$confirm(`确定对进行[删除]操作?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl(
              '/message/messageSetting/delete'
            ),
            method: "post",
            data: this.$http.adornData(ids, false)
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.$message({
                  message: "操作成功",
                  type: "success",
                  duration: 1000
                });
                this.getDataList();
              } else {
                this.$message.error(data.msg);
              }
            });

        });
      },

      //请求分组对应的短信信息
      getMessageInfo(){
        this.$http({
          url: this.$http.adornUrl(`/message/messageSetting/info/${this.selectedNode}`),
          method: "get",
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data && data.code === 0) {
              this.platShareMenuList = data.MessageSettingEntity
              //渲染右边平台树
              
              this.$refs.managetable.init(this.platShareMenuList)
          } else {
            this.$message.error(data.msg)
          }
        });
      },

      // 获取分组数据列表
      getDataList () {
        this.dataListLoading = true;
        this.$http({
          url: this.$http.adornUrl("/message/messageSetting/list"),
          method: "get",
        }).then(({ data }) => {
          console.log("获取分组数据列表",data)
          if(data.data){
            this.modifiedUserList = data.data;
            //默认选中第一个
            this.selectedNode = data.data[0].id;
            this.getMessageInfo();
          }
        });
      },

      // 分组修改提交
      submittingbygroups() {
        if (!this.treeForm.currentTreename) {
          this.$message.error("分组名称不能为空");
          return;
        } else {

          this.$http({
            url: this.$http.adornUrl(`/message/messageSetting/update`),
            method: "post",
            data: this.$http.adornData({
              'id': this.treeForm.id,
              'name': this.treeForm.currentTreename,
              'userId': this.treeForm.userId,
              'password': this.treeForm.password,
              'remark': this.treeForm.remark,
              'url': this.treeForm.url,
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
                this.$message({
                  message: "操作成功",
                  type: "success",
                  duration: 1000,
                  onClose: () => {
                    //关闭
                    this.dialogVisible = false;
                    //刷新
                    this.getDataList();
                  }
                });
              } else {
                this.$message.error(data.msg)
              }
          });
        }
      },

    }
  }
</script>
<style lang="less">
.resoureteamWrap{
  margin: -20px;
  .addressbookbox > .el-header {
    color: #333;
    /*text-align: center;*/
    line-height: 80px;
  }

  .addressbookbox > .el-aside {
    /*background-color: #D3DCE6;*/
    color: red;
    text-align: center;
    line-height: 20px;
  }

  .addressbookbox > .el-main {
    /*background-color: #E9EEF3;*/
    color: #333;
    text-align: center;
    line-height: 150px;
  }
  .tableClass {
    padding: 3px;
    border: 1px solid rgba(230, 230, 230, 1);
    height: 725px;
    width: 82%;
    margin-left: 20px;
    min-width: 540px;
  }
  .el-table__fixed-right::before,
  .el-table__fixed::before {
    height: 0px;
  }
}
</style>
