<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @closed="clearDialog"
  >
    <el-container>
      <el-header style="height:120px">
        <el-form
          :model="dataForm"
          :rules="dataRule"
          ref="dataForm"
          @keyup.enter.native="dataFormSubmit()"
          label-width="100px"
        >
          <el-form-item label="请选择分组" prop="eventTypeParentName" >
            <el-dialog title="请选择要新增到的分组节点" :visible.sync="newgroups" width="30%" append-to-body>
              <el-tree
                :data="eventTypeList"
                :props="eventTypeListTreeProps"
                node-key="id"
                ref="eventTypeTree"
                @current-change="eventTypeListTreeCurrentChangeHandle"
                :default-expand-all="true"
                :auto-expand-parent="true"
                :highlight-current="true"
                :expand-on-click-node="false"
              ></el-tree>
              <span slot="footer" class="dialog-footer">
                <el-button @click="newgroups = false" plain size="small">取 消</el-button>
                <el-button type="primary" @click="newgroups = false" size="small">确 定</el-button>
              </span>
            </el-dialog>
            <el-input
              v-model="dataForm.eventTypeParentName"
              @focus="gettingfocus"
              v-popover:eventTypeListPopover
              placeholder="选择分组"
              :readonly="true"
            ></el-input>
            <el-input v-show="false" v-model="dataForm.parentId" :readonly="true"></el-input>
          </el-form-item>

          <el-form-item label="分组名称" prop="name">
            <el-input v-model="dataForm.name" placeholder="请填写分组名称" v-bind:readonly="type===1"></el-input>
          </el-form-item>
          <el-form-item label="分组描述">
            <el-input v-model="dataForm.gmtCreate"></el-input>
          </el-form-item>
        </el-form>
      </el-header>
      <el-footer class="foor">
        <el-button @click="visible = false" plain size="small">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()" size="small">确定</el-button>
      </el-footer>
    </el-container>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from "@/utils";
export default {
  data() {
    return {
      newgroups: false,
      visible: false,
      type: 0,
      title: "",
      dataForm: {
        id: "",
        parentId: 0,
        name: "",
        gmtCreate: "",
        eventTypeParentId: "",
        eventTypeParentName: ""
      },
      eventTypeList: [], // 树的数据
      eventTypeListTreeProps: {
        label: "name",
        children: "children"
      },
      dataRule: {
        eventTypeParentName: [
          { required: true, message: "请选择一个分组", trigger: "blur" }
        ],
        name: [
          { required: true, message: "分组名称不能为空", trigger: "blur" },
          { min: 2, max: 20, message: "长度在2到20字左右", trigger: "blur" }
        ]
      }
    };
  },

  methods: {
    init(id, currenTreeObject, type) {
      this.dataForm.name = "";
      this.dataForm.gmtCreate = "";
      this.dataForm.id = id || 0;
      this.type = type;
      this.$nextTick(() => {
        /* if (type === 2) {
          this.$http({
              url: this.$http.adornUrl('/mail/mailgroup/list'),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              this.eventTypeParentName=''
              // data.data.splice(0,0, {id:0,name: '顶级分组节点'})
              this.eventTypeList = treeDataTranslate(data.data, 'id')
              console.log(data.data)
              // console.log(this.eventTypeList)
            }).then(() => {
              this.visible = true
            }).then(() => {
              // 新增
              this.dataForm.name=''
              this.dataForm.gmtCreate=''
              this.eventTypeListTreeSetCurrentNode()
            })
          } */if(currenTreeObject){
                   if(currenTreeObject.id==0)
          {
this.dataForm.eventTypeParentName='顶级分组节点'
          this.dataForm.parentId =0;
          }
          else{
          this.dataForm.eventTypeParentName=currenTreeObject.name
          this.dataForm.parentId = currenTreeObject.id;}}
          else if(type === 2){
            this.dataForm.eventTypeParentName='顶级分组节点'
              this.dataForm.parentId =0;
          }
        if (type === 2) {
          this.visible = true;
          this.title = "新增";
 
        }
        if (type === 3) {
          this.title = "修改";
          this.$http({
            url: this.$http.adornUrl(
              `/investigation/investigationTaskGroup/info/${this.dataForm.id}`
            ),
            method: "get",
            params: this.$http.adornParams()
          })
            .then(({ data }) => {
              if (data && data.code === 0) {
                this.dataForm.parentId =
                  data.InvestigationTaskGroupEntity.parentId;
                this.dataForm.name = data.InvestigationTaskGroupEntity.name;
                this.dataForm.gmtCreate =
                  data.InvestigationTaskGroupEntity.remark;
              } else {
                this.$message.error(data.msg);
              }
            })
            .then(() => {
              this.visible = true;
            });
        }
      });
    },
    // 当选择分组获取到焦点是才触发,并把顶级分组节点插入到树形中
    gettingfocus(event) {
      this.newgroups = true;
      this.$http({
        url: this.$http.adornUrl(
          "/investigation/investigationTaskGroup/listTree"
        ),
        method: "get",
        params: this.$http.adornParams()
      })
        .then(({ data }) => {
          // console.log("22222222", data);
          if (data && data.code === 0) {
            this.eventTypeParentName = "";
            data.data.splice(0, 0, { id: 0, name: "顶级分组节点" });
            console.log("this.eventTypeList: ", data.data);
            // this.eventTypeList = treeDataTranslate(data.data, 'id')
            this.eventTypeList = data.data;
          } else {
            this.$message.error(data.msg);
          }
        })
        .then(() => {
          this.visible = true;
        })
        .then(() => {
          // 新增
          this.dataForm.gmtCreate = "";
          this.eventTypeListTreeSetCurrentNode();
        });
    },
    // 分组树设置当前选中节点
    eventTypeListTreeSetCurrentNode() {
      this.$refs.eventTypeTree.setCurrentKey(this.dataForm.id);
      this.dataForm.eventTypeParentName = (this.$refs.eventTypeTree.getCurrentNode() ||
        {})["name"];
    },
    // 分组树选中
    eventTypeListTreeCurrentChangeHandle(data, node) {
      this.dataForm.parentId = data.id;
      this.dataForm.eventTypeParentId = data.id;
      this.dataForm.eventTypeParentName = data.name;
    },

    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid && (this.type === 2 || this.type === 3)) {
          this.$http({
            url: this.$http.adornUrl(
              `/investigation/investigationTaskGroup/${
                this.type === 2 ? "save" : "update"
              }`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              parentId: this.dataForm.parentId,
              name: this.dataForm.name,
              remark: this.dataForm.gmtCreate
            })
          }).then(({ data }) => {
            console.log(data.code);
            if (data && data.code === 0) {
              this.visible = false;
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500
              });
              this.$emit("refreshGroupDataList");
              this.$emit("close");
            }
             else {
              // this.$message.error("请选择你要新增到的分组节点");
              this.$message.error(`${data.msg}`);
            }
          });
        }
      });
    },
    clearDialog() {
      this.$refs["dataForm"].resetFields();
      this.dataForm.gmtCreate = "";
    }
  }
};
</script>
<style scoped>
.foor {
  margin-top: 100px;
  color: #333;
  text-align: center;
  line-height: 60px;
}
</style>
