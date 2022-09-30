<template>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="visible">
      <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">


        <el-form-item label="人员">
          <el-input v-model="dataForm.contactorNameStr" @focus="handleInform" placeholder="选择人员"></el-input>
        </el-form-item>


        <el-form-item size="mini" label="授权" v-if="isAuth('sys:platform:save')">
          <el-tree
            :data="menuList"
            :props="menuListTreeProps"
            node-key="menuId"
            ref="menuListTree"
            :default-expand-all="true"
            show-checkbox>
          </el-tree>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false" plain size="small">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()" size="small">确定</el-button>
      </span>

      <LinkmanRadio ref="commonLink"
                        v-show="showcommonLink"
                        @OnchildByValue="handelLinkdata">

      </LinkmanRadio>

    </el-dialog>
</template>

<script>
  import { treeDataTranslate } from '@/utils'
  import LinkmanRadio from '@/views/common/Linkman';

  export default {
    data () {

      var validateUrl = (rule, value, callback) => {
        if (this.dataForm.type === 1 && !/\S/.test(value)) {
          callback(new Error('菜单URL不能为空'))
        } else {
          callback()
        }
      }
      return {
        visible: false,

        showcommonLink: false, // 人员弹窗

        dataRule: {
          name: [
            { required: true, message: '菜单名称不能为空', trigger: 'blur' }
          ],
          url: [
            { validator: validateUrl, trigger: 'blur' }
          ]
        },

        //联系人名称
        dataForm: {
          contactorId: [],
          contactorName: [],
          contactorNameStr: ''
        },

        //菜单数据
        menuList: [],
        menuListTreeProps: {
          label: 'name',
          children: 'children'
        },

      }
    },

    components: {
      LinkmanRadio
    },

    methods: {
      init() {
        this.visible = true;
      },

      handleInform () {
        this.showcommonLink = true
        this.$refs.commonLink.handleAddContacts(
          '/mail/mailgroup/list',
          '请选择人员',
          "选择人员"
        )
      },

      //人员选择确认
      handelLinkdata ({ linkman, name  }) {
        console.log("人员选择确认",linkman,name)
        this.dataForm.contactorId = [];
        this.dataForm.contactorName = [];
        this.dataForm.contactorNameStr = '';
        if(linkman != null && linkman.length > 0){
            for(var i=0; i<linkman.length; i++){
              this.dataForm.contactorId.push(linkman[i].id);
              this.dataForm.contactorName.push(linkman[i].name);
              this.dataForm.contactorNameStr = this.dataForm.contactorNameStr + linkman[i].name + "、";
            }

            this.getMenuList();

        }
        // this.dataForm.contactorId = linkman[0].id;
        // this.dataForm.contactorName = linkman[0].name;
        // //同时选择请求权限
        // if(this.dataForm.contactorId !=0){
        //   this.getMenuList();
        // }

      },

      //菜单选择
      getMenuList() {
        this.$http({
          url: this.$http.adornUrl('/sys/menu/select'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) =>{
            if (data && data.code === 0) {
              this.menuList = treeDataTranslate(data.menuList, 'menuId')
            }else{
              this.$message.error(data.msg)
            }
        })
      },

      // 菜单树选中
      menuListTreeCurrentChangeHandle (data, node) {
        this.dataForm.parentId = data.menuId
        this.dataForm.parentName = data.name
      },
      // 菜单树设置当前选中节点
      menuListTreeSetCurrentNode () {
        this.$refs.menuListTree.setCurrentKey(this.dataForm.parentId)
        this.dataForm.parentName = (this.$refs.menuListTree.getCurrentNode() || {})['name']
      },

      // 平台菜单树设置当前选中节点
      platFormListTreeSetCurrentNode () {
        this.$refs.platFormListTree.setCurrentKey(this.dataForm.platformParentId)
        this.dataForm.platformParentName = (this.$refs.platFormListTree.getCurrentNode() || {})['platformName']
      },

      // 平台菜单树选中
      platFormListTreeCurrentChangeHandle (data, node) {
        this.dataForm.ancestors=data.ancestors+','+data.id
        this.dataForm.platformParentId = data.id
        this.dataForm.platformParentName = data.platformName
      },


      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const menuIdList = [].concat(this.$refs.menuListTree.getCheckedKeys(), this.$refs.menuListTree.getHalfCheckedKeys());
            if (menuIdList.length === 0) {
              this.$message.error('请勾选');
              return;
            }
            this.$http({
              url: this.$http.adornUrl(`/mail/mailcontactor/saveMailMenu`),
              method: 'post',
              data: this.$http.adornData({
                'contactorIdList': this.dataForm.contactorId,
                menuIdList,
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }


</script>

<style lang="scss">
  .m-colorPicker .box.open{
    width: 220px;
  }
  .el-tree {
    overflow-y:auto;
    overflow-x: scroll;
    height: 500px;
  }

</style>
