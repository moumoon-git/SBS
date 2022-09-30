<template>
  <div class="faxEdit">
    <el-dialog
      :visible.sync="editFax"
      width="500px"
      custom-class="faxEdit__form"
    >
      <div slot="title" class="faxEdit__dialogHeader">
        传真号码管理
      </div>
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item
          label="上级单位"
          prop="parentUnit"
          :label-width="formLabelWidth"
          :style="{ width: formInputWidth }"
        >
          <el-input v-model="form.parentName" @focus="getFaxTree"></el-input>
        </el-form-item>
        <el-form-item
          label="单位名称"
          prop="name"
          :label-width="formLabelWidth"
          :style="{ width: formInputWidth }"
        >
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item
          label="传真号码"
          prop="faxnumber"
          :label-width="formLabelWidth"
          :style="{ width: formInputWidth }"
        >
          <el-input v-model="form.faxnumber"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="faxEdit__dialogFooter">
        <el-button @click="editFax = false">取 消</el-button>
        <el-button type="primary" @click="submitFaxObj('ruleForm')"
          >确 定</el-button
        >
      </div>
      <el-dialog
        width="30%"
        title="请选择要新增到的分组节点"
        :visible.sync="showFaxTree"
        append-to-body
      >
        <el-tree
          class="faxEdit__tree"
          node-key="editTreeId"
          :data="selectTree"
          accordion
          :props="defaultProps"
          @node-click="seleteNode"
          ref="editTreeId"
        >
        </el-tree>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    selectTree: Array,
    editFaxType: String,

    preForm: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      editFax: false,
      showFaxTree: false, // 打开节点数

      rules: {
        // parentUnit: [
        //   { required: true, message: "请选择父级机构", trigger: "change" }
        // ],
        name: [{ required: true, message: "请输入机构名称", trigger: "blur" }],
        faxnumber: [
          { required: true, message: "请输入传真号", trigger: "blur" }
        ]
      },

      defaultProps: {
        children: "children",
        label: "name"
      },

      form: {}, // 表单数据
      formLabelWidth: "120px",
      formInputWidth: "400px"
    };
  },
  //   computed: {
  //     treeData: function() {
  //       let initNode = {
  //         id: 0,
  //         name: "顶级分组节点"
  //       };
  //       let newTree = this.tree;
  //       return newTree.unshift(initNode);
  //     }
  //   },

  mounted() {
    this.form.parentName = this.selectTree[0].name;
    this.form.parentId = this.selectTree[0].id;
  },

  watch: {
    preForm: {
      handler: function() {
        this.form = this.preForm;
      },
      deep: true
    }
  },

  methods: {
    // 展开传真对象树
    getFaxTree() {
      this.showFaxTree = true;
    },

    // 选择传真对象
    seleteNode(e) {
      console.log(e);
      let { name, id } = e;
      this.form.parentName = name;
      this.form.parentId = id;

      setTimeout(() => {
        this.showFaxTree = false;
      }, 200);
    },

    submitFaxObj(ruleForm) {
      console.log(this.form);
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          let requestUrl = "";
          switch (this.editFaxType) {
            case "add":
              requestUrl = '/faxes/faxesgroup/save"';
              break;
            case "update":
              requestUrl = "/faxes/faxesgroup/update";
              break;
            default:
              break;
          }

          // 获取联系人分组
          this.$http({
            url: this.$http.adornUrl(requestUrl),
            method: "post",
            data: this.$http.adornData(this.form)
          }).then(({ data }) => {
            // console.log("请求树数据", data);
            if (data.code === 0) {
              this.$message({
                message: "操作成功！",
                type: "success"
              });
              this.$parent.httpFaxObject();
              setTimeout(() => {
                this.editFax = false;
                this.form = {};
              }, 200);
            } else {
              this.$message.error(data.msg);
            }
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style lang="less">
.faxEdit {
  .faxEdit__form {
  }
  .faxEdit__dialogHeader {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 40px;
    background: #f1f4f6;
    line-height: 40px;
    padding-left: 20px;
    color: #333333;
  }

  .faxEdit__dialogFooter {
    border-top: 1px solid #e9ecf1;
    padding-top: 15px;
  }
}
</style>
