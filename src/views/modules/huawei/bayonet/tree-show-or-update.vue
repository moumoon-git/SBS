<template>
  <el-dialog title="新增卡口" :close-on-click-modal="false" :visible.sync="visible" width="600px">
    <el-container>
      <el-header>
        <el-form
          :model="dataForm"
          :rules="dataRule"
          ref="dataForm"
          @keyup.enter.native="dataFormSubmit()"
          label-width="100px"
        >
          <el-form-item label="卡口名称" prop="name">
            <el-input
              v-model="dataForm.name"
              clearable
              :readonly="type === 1"
              placeholder="请填写卡口名称"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="分组类型">
            <el-select v-model="dataForm.type" placeholder="请选择">
              <el-option v-for="item in typeData" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item label="卡口描述">
            <el-input clearable :readonly="type === 1" v-model="dataForm.remark"></el-input>
          </el-form-item>
        </el-form>
      </el-header>
      <el-footer class="foor">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </el-footer>
    </el-container>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from "@/utils";
export default {
  data() {
    return {
      // 分组弹出的开关
      typeData: [
        {
          id: 0,
          name: "部门"
        },
        {
          id: 1,
          name: "义工"
        }
      ],
      newgroups: false,
      visible: false,
      type: 0,
      dataForm: {
        id: 0,
        parentId: "",
        name: "",
        platformId: "",
        createUserId: "",
        remark: "",
        groupingdescription: "",
        modifiedUserId: "",
        gmtModified: "",
        isDeleted: "",
        eventTypeParentId: "",
        eventTypeParentName: "",
        ancestors: "",
        type: ""
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
          { min: 2, max: 10, message: "长度在2到10字左右", trigger: "blur" }
        ],
        type: [{ required: true, message: "请选择活动区域", trigger: "change" }]
      }
    };
  },

  methods: {
    init(currenTreeObject, type) {
      this.dataForm = currenTreeObject;
      this.visible = true;
      this.type = type;
    },
    // 当选择分组获取到焦点是才触发,并把顶级分组节点插入到树形中
    gettingfocus(event) {
      this.newgroups = true;
      this.$http({
        url: this.$http.adornUrl("/vcm/vcmBayonetInfo/list"),
        method: "get",
        params: this.$http.adornParams({
          type: this.dataForm.type
        })
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.eventTypeParentName = "";
            data.data.splice(0, 0, {
              id: 0,
              name: "顶级分组节点",
              ancestors: "0"
            });
            this.eventTypeList = treeDataTranslate(data.data, "id");
          } else {
            this.$message.error(data.msg);
          }
        })
        .then(() => {
          this.visible = true;
        })
        .then(() => {
          // 新增
          // this.dataForm.name = ''
          this.dataForm.remark = "";
          this.eventTypeListTreeSetCurrentNode();
        })
        .catch(() => {
          if (!this.dataForm.type) {
            this.$message.error("请选择卡口类型");
          }
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
      // console.log("data, node", data, node);
      this.dataForm.parentId = data.id;
      this.dataForm.eventTypeParentId = data.id;
      this.dataForm.eventTypeParentName = data.name;
      if (data.id === 0) {
        this.dataForm.ancestors = data.ancestors;
      } else {
        this.dataForm.ancestors = data.ancestors + "," + data.id;
      }
    },

    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid && (this.type === 1 || this.type === 2)) {
          this.$http({
            url: this.$http.adornUrl(
              `/vcm/vcmBayonetInfo/${this.type === 1 ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              name: this.dataForm.name,
              type: parseInt(this.dataForm.type),
              remark: this.dataForm.remark,
              parentId: this.dataForm.parentId
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.visible = false;
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500
              });
              this.$emit("refreshEventTypeDataList");
              this.$emit("close");
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    }
  }
};
</script>
<style scoped>
.foor {
  margin-top: 80px;
  color: #333;
  text-align: center;
  line-height: 60px;
}
</style>
