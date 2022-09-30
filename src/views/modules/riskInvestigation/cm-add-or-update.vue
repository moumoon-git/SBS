<template>
  <div>
    <el-dialog
      :title="type==='add' ? '新增' : '修改'"
      :close-on-click-modal="false"
      :visible.sync="visible">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
               label-width="80px">


        <el-form-item label="检查项目" prop="roleName">
          <el-input v-model="dataForm.roleName" placeholder="检查项目"></el-input>
        </el-form-item>
        <el-form-item label="检查内容" prop="remark">
          <el-input v-model="dataForm.remark" placeholder="检查内容"></el-input>
        </el-form-item>
        <!--<el-form-item size="mini" label="授权">
          <el-tree
            :data="menuList"
            :props="menuListTreeProps"
            node-key="menuId"
            ref="menuListTree"
            :default-expand-all="true"
            show-checkbox>
          </el-tree>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    </el-dialog>
    <GroupSelect v-if="showSelectPlatform" :prop="prop" ref="selectPlatformRef" @onSubmit="onSubmit"/>
  </div>
</template>

<script>
  import {treeDataTranslate} from '@/utils'
  import GroupSelect from '@/views/common/groupselect'

  export default {
    components: {
      GroupSelect
    },
    data () {
      return {
        visible: false,
        type:'',
        showSelectPlatform: false,
        prop: {
          children: 'children',
          label: 'platformName'
        },
        menuList: [],
        menuListTreeProps: {
          label: 'name',
          children: 'children'
        },
        dataForm: {
          changValue: 0,
          id: 0,
          roleName: '',
          remark: '',
          //终端数据
          platformId: null,
          platformName: '',
        },
        dataRule: {
          roleName: [
            {required: true, message: '检查项目不能为空', trigger: 'blur'}
          ]
        },
        tempKey: -666666 // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
      }
    },
    computed: {
      platformId: {
        get () {
          return this.$store.state.user.platformId
        }
      },
      isAdmin: {
        get () {
          return this.$store.state.user.isAdmin
        }
      }
    },
    watch: {
      'dataForm.platformId': {
        handler (newPlatformId, oldPlatformId) {
          //获取菜单
          //alert("watch")
					if(newPlatformId !== null)
						this.getMenuList(newPlatformId)
        },
        deep: true,
        immediate: true
      }
    },

    methods: {
      //选择终端用户
      selectPlatform () {
        this.showSelectPlatform = true
        this.$nextTick(() => {
          // console.log(this.$refs.selectPlatformRef)
          this.$refs.selectPlatformRef.init('/sys/platform/treeList', '请选择终端用户')
        })
      },
      //选择终端用户
      onSubmit (obj) {
        // console.log('选择终端用户后', obj)
        this.dataForm.platformId = obj.id
        this.dataForm.platformName = obj.platformName
      },
      clearDataForm () {
        // console.log('clearDataForm')
        this.dataForm.roleName = ''
        this.dataForm.remark = ''
        this.dataForm.platformName = ''
        this.dataForm.menuList = []
      },
      init (id,type) {
        //先清除表单数据
        this.clearDataForm()
        this.dataForm.id = id
        this.type=type
        //新增

        switch (type) {
          case 'add':
            //不是系统管理员
            if (this.isAdmin !== 1) {
              //查询用户所属终端
              this.$http({
                url: this.$http.adornUrl(`/sys/platform/infoById/${this.platformId}`),
                method: 'get',
                params: this.$http.adornParams()
              }).then(({data}) => {
                 if (data && data.code === 0) {
                   this.dataForm.platformName = data.platform.platformName
                  } else {
                    this.$message.error(data.msg)
                  }

              })
              this.getMenuList(this.platformId)
            } else {
              this.visible = true
            }
            break

          case 'update':
            //修改
            this.$http({
              url: this.$http.adornUrl(`/sys/role/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.roleName = data.role.roleName
                this.dataForm.remark = data.role.remark

                this.$http({
                  url: this.$http.adornUrl(`/sys/platformmenu/menuList/${data.role.platformId}`),
                  method: 'get',
                  params: this.$http.adornParams()
                }).then(({data: _data}) => {
                  if (data && data.code === 0) {
                    this.menuList = treeDataTranslate(_data.data, 'menuId')
                    this.visible = true
                    const idx = data.role.menuIdList.indexOf(this.tempKey)
                    if (idx !== -1) {
                      data.role.menuIdList.splice(idx, data.role.menuIdList.length - idx)
                    }
                    this.$nextTick(function(){
                      this.$refs.menuListTree.setCheckedKeys(data.role.menuIdList)
                    })
                  } else {
                    this.$message.error(data.msg)
                  }
                })

                //查询用户所属终端
                this.$http({
                  url: this.$http.adornUrl(`/sys/platform/infoById/${data.role.platformId}`),
                  method: 'get',
                  params: this.$http.adornParams()
                }).then(({data}) => {
                  if (data && data.code === 0) {
                    this.dataForm.platformName = data.platform.platformName
                  } else {
                    this.$message.error(data.msg)
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
            break
          default:
            // console.log("type异常......")
        }
      },

      /*this.dataForm.id = id || 0

      //系统管理员新增时
      if (this.isAdmin === 1 && !this.dataForm.id) {
        this.$http({
          url: this.$http.adornUrl('/sys/platform/lists'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.platformList = treeDataTranslate(data.platformList, 'id')
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (!this.dataForm.id) {
            // 新增
            this.platformListTreeSetCurrentNode()
          }
        })
      } else {

      }

      this.$http({
        url: this.$http.adornUrl(`/sys/platformmenu/menuList/${this.dataForm.platformId}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        this.menuList = treeDataTranslate(data, 'menuId')
      }).then(() => {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.$refs.menuListTree.setCheckedKeys([])
        })
      }).then(() => {
        if (this.dataForm.id) {

        }
        /!*else {
          this.$http({
            url: this.$http.adornUrl(`/sys/platformmenu/menuList/${this.platformId}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.menuList = treeDataTranslate(data, 'menuId')
          })
        }*!/
      })
    }
    ,
*/
      /*init (id) {
        this.dataForm.id = id || 0

        if (this.isAdmin === 1) {
          this.$http({
            url: this.$http.adornUrl('/sys/platform/lists'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.platformList = treeDataTranslate(data.platformList, 'id')
          }).then(() => {
            this.visible = true
            this.$nextTick(() => {
              this.$refs['dataForm'].resetFields()
            })
          }).then(() => {
            if (!this.dataForm.id) {
              // 新增
              this.platformListTreeSetCurrentNode()
            }
          })
        }



        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/sys/role/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.roleName = data.role.roleName
              this.dataForm.remark = data.role.remark
              var idx = data.role.menuIdList.indexOf(this.tempKey)
              if (idx !== -1) {
                data.role.menuIdList.splice(idx, data.role.menuIdList.length - idx)
              }
              this.$refs.menuListTree.setCheckedKeys(data.role.menuIdList)

              //查询用户所属终端
              this.$http({
                url: this.$http.adornUrl(`/sys/platform/infoById/${data.role.platformId}`),
                method: 'get',
                params: this.$http.adornParams()
              }).then(({data}) => {
                console.log(data)
                this.dataForm.platformName = data.platform.platformName
              })
            }
          })


        }
        //获取菜单
        if (this.dataForm.platformId) {
          this.getMenuList(this.dataForm.platformId)
        }

      },*/

      getMenuList (platformId) {
        this.$http({
          url: this.$http.adornUrl(`/sys/platformmenu/menuList/${platformId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.menuList = treeDataTranslate(data.data, 'menuId')
          this.visible = true
        }).then(() => {
          this.$nextTick(() => {
            //this.$refs['dataForm'].resetFields()
            this.$refs.menuListTree.setCheckedKeys([])
          })
        })
      }
      ,

      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/role/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'roleId': this.dataForm.id || undefined,
                'roleName': this.dataForm.roleName,
                'remark': this.dataForm.remark,
                'platformId': this.dataForm.platformId,
                'menuIdList': [].concat(this.$refs.menuListTree.getCheckedKeys(), [this.tempKey], this.$refs.menuListTree.getHalfCheckedKeys())
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                })
                this.visible = false
                this.$emit('refreshDataList')
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
