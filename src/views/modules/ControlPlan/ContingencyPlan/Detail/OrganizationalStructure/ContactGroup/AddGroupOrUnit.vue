<template>
  <div class="seeOrUpdata_template">
    <el-dialog
      :title="title+(type === 1?'部门':'职务')"
      :visible.sync="dialogFormVisible"
      width="370px"
      center
    >
      <el-form ref="form" :model="form" label-width="97px">
        <el-form-item :label="(type === 1?'部门':'职务')+'名称'">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item v-if="type === 1?false:true" label="职责">
          <el-input v-model="form.responsibility"></el-input>
        </el-form-item>
        <el-form-item
          v-if="type === 1?false:true"
          label="成员"
        >
          <sv-select-contact
            v-model="form.contact"
            title="添加成员"
            :api="['/mail/mailgroup/list','/mail/mailcontactor/list']"
            :multiple="true"
          />
        </el-form-item>
        <el-form-item v-if="type === 1?false:true">
          <div
            v-for="(item, index) in linkman"
            :key="index"
          >
            {{ item.name }}({{ item.workUnit }}/{{ item.position }}/{{ item.mobile1 }})
          </div>
        </el-form-item>
        <el-form-item
          v-if="type === 1 && title === '新增'"
          label="所属部门"
        >
          <sv-select-group
            v-model="form.parentId"
            :name="groupName"
            :api="`/incidentplan/rpIncidentMailgroup/list/${reservePlanId}`"
          />
        </el-form-item>
        <el-form-item
          v-if="type === 1 && title === '新增'"
          label="部门职责:"
        >
          <el-input
            v-model="form.responsibilities"
            type="textarea"
            rows="4"
            resize="none"
          />
        </el-form-item>
        <el-form-item
          v-if="type === 1 && title === '编辑'"
          label="部门职务:"
        >
          <el-input
            v-model="form.post"
            type="textarea"
            rows="4"
            resize="none"
          />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" plain size="small">取 消</el-button>
        <el-button type="primary" @click="saveOrEditHandle" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { treeDataTranslate } from "@/utils";
import bus from '@/views/common/js/eventBus';

export default {
  name: "seeOrUpdata_template",
  props: {
    linkman: {
      type: Array,
      default: () => ([]),
    },
  },
  data() {
    return {
      groupName: '', // 分组名称
      dialogFormVisible: false,
      innerDialogVisible: false, //树形模态框
      list: [],
      listProps: {
        children: "children",
        label: "name"
      },

      checkedIds: [], //当前选中的id数组

      checkData: {}, //当前选中树数据

      value: [],
      newAddresseeData: [],
      // 为保存分组提供参数
      phone: "",
      userIds: "",
      mailGroup: [],

      form: {
        name: '', // 部门/职务名称
        region: '',
        choose: '',
        group: '',
        responsibility: '', // 新增职务职责
        parentId: '', // 部门
        responsibilities: '', // 新增部门职责
        post: '', // 编辑部门职责
        contact: [], // 成员id
      },
      reservePlanId: '', // 预案id

      title: "",
      type: '', // 判断是部门还是职务
      delGroupView: false, //删除分组视图

      name: "" //删除对象
    };
  },
  watch: {
    "form.choose"(newV, oldV) {
      if (newV) {
        this.$http({
          url: this.$http.adornUrl("/message/messageGroup/listTree"),
          method: "post"
        }).then(({ data }) => {
          if (data && data.code == 0) {
            // console.log(
            //   "data.data++++++++++++++++++++++++++++++++++++++",
            //   data.data
            // );
            this.list = treeDataTranslate(data.data, "id");
          } else {
            this.$message.error(data.msg);
          }
        });
      }
    }
  },
  mounted() {
    bus.$off('getAddGroupUnit');
    bus.$on('getAddGroupUnit', (val) => {
      // console.log(val);
      // 获取预案id
      this.reservePlanId = val;
    });
  },
  methods: {
    contactViewHandle() {
      this.$emit('contact-view-handle');
    },
    getDataList(obj, title, type) {
      // console.log(obj, title, type, '11111');
      this.title = title;
      this.type = type;
      this.groupName = obj ? obj.parentName : '';
      if (title === '新增') {
        this.form.name = '';
        this.form.responsibility = '';
        this.form.responsibilities = '';
        this.form.post = '';
        this.form.parentId = '';
        this.form.contact = [];
      } else {
        this.form.name = obj ? obj.name : '';
        this.form.responsibility = obj ? obj.responsibility : '';
        this.form.post = obj ? obj.responsibilities : '';
        this.form.parentId = obj ? obj.parentId : '';
      }
      // 编辑部门职责
      if (type === 2) {
        // 赋值初始化
        this.form.contact = [];
        const contact = obj ? obj.mailContactorEntityList : '';
        if (contact.length > 0) {
          contact.forEach((item) => {
            this.form.contact.push(item);
          });
        }
        // console.log(this.form.contact);
      }
      this.dialogFormVisible = true;

      this.list = this.$root.modifiedUserList;
    },
    // 点击树形节点事件
    handleNodeClick(obj) {
      this.checkData = obj;
    },
    // 关闭弹窗
    dialog() {
      this.dialogFormVisible = false;
    },
    // 保存树
    saveTree() {
      // console.log(this.checkData)
      this.innerDialogVisible = false;
      if (this.checkData) {
        this.form.group = this.checkData.name;
      }
    },
    // 新增或编辑分组
    saveOrEditHandle() {
      this.dialogFormVisible = false;

      // if (this.title === "添加") {
      if (this.title === '新增') {
        this.$emit('saveGroup', this.form.name, this.form.responsibility, this.form.parentId, this.form.responsibilities, this.form.contact);
      } else {
        this.$emit('editGroup', this.form.name, this.form.responsibility, this.form.parentId, this.form.post, this.form.contact);
      }
    }
  }
};
</script>

<style scoped lang="scss">
p {
  margin: 0;
}
.name {
  outline: none;
  border-radius: 3px;
  border: 1px solid #ccc;
  width: 65%;
}
/deep/ .el-dialog {
  border-radius: 8px;
  .el-dialog__header {
    background-color: #00a9f2 !important;
    padding: 10px 0;
    border-radius: 8px 8px 0 0;
    text-align: center !important;
    .el-dialog__headerbtn {
      top: 12px;
      .el-dialog__close {
        color: #d1f9fb;
      }
    }
    span {
      color: #d1f9fb;
    }
  }
  /deep/.el-button--primary {
    background-color: #00a9f2;
    border: 1px solid #00a9f2;
  }
}
/deep/ .el-dialog--center .el-dialog__body {
  // padding: 15px 0;
  padding: 30px 18px 0px;
}
</style>
