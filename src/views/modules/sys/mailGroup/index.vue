<template>
  <div class="mod-menu">
    <el-form :inline="true" :model="dataForm" style="position:relative;height:58px;">
     
      <el-button style="position:absolute;right: 0%;top:0%;" v-if="isAuth('mail:mailgroup:save')" type="primary" @click="addEventType()">新增</el-button>
      
    </el-form>
    <el-table
      :data="dataList"
      border
      style="width: 100%;">
      <!-- <el-table-column
        prop="menuId"
        header-align="center"
        align="center"
        width="80"
        label="ID">
      </el-table-column> -->
      <table-tree-column
        prop="name"
        header-align="center"
        treeKey="id"
        
        label="通讯录分组">
      </table-tree-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        
        label="备注">
      </el-table-column>
      <el-table-column
        prop="qrCode"
        header-align="center"
        align="center"
        label="二维码"
        width="250">
        <template slot-scope="scope">
          <viewer :images="[baseUrl+scope.row.qrCode]">
              <img
                v-for="(item,index) in [baseUrl+scope.row.qrCode]"
                :src="item"
                :key="index"
                style="width:80px;height:80px;"
              />
            </viewer>
          <!-- <img v-if="scope.row.qrCode" :src="baseUrl+scope.row.qrCode" style="width:80px;height:80px;" @click="watchQrCodeDialogVisible=true;watchQrCodeSrc=baseUrl+scope.row.qrCode;"> -->
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 0" size="small">目录</el-tag>
          <el-tag v-else-if="scope.row.type === 1" size="small" type="success">菜单</el-tag>
          <el-tag v-else-if="scope.row.type === 2" size="small" type="info">按钮</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="verificationCode"
        header-align="center"
        align="center"
        label="验证码"
        width="160">
      </el-table-column>
      <!-- <el-table-column
        prop="url"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="菜单URL">
      </el-table-column>
      <el-table-column
        prop="perms"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="授权标识">
      </el-table-column> -->
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="300"
        label="操作">
        <template slot-scope="scope">
          <div class="opration">
            <el-button v-if="isAuth('mail:mailgroup:delete')" type="text" size="small" @click="createdQrCode(scope.row.id)">生成二维码</el-button>
            <el-button v-if="isAuth('mail:mailgroup:delete')" type="text" size="small" @click="createdVerificationCode(scope.row.id)">生成验证码</el-button>
            <el-button v-if="isAuth('mail:mailgroup:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row)">修改</el-button>
            <el-button v-if="isAuth('mail:mailgroup:delete')" type="text" size="small" @click="deleteHandle(scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="currPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalCount"
      layout="total, sizes, prev, pager, next, jumper"
    >
    </el-pagination>

    
    <el-dialog title="查看二维码" :visible.sync="watchQrCodeDialogVisible" style="text-align:center;">
      <img :src="watchQrCodeSrc" alt="" >
    </el-dialog>

    <el-dialog title="修改分组" :visible.sync="watchGroupDialogVisible" width="40%">
      <el-form :rules="rules" :modal="treeForm" ref="treeForm">
        <el-form-item label="分组名称" size="large" label-width="100px">
          <el-input
           
            placeholder="请输入内容"
            v-model="treeForm.currentTreename"
            clearable
            style="margin-bottom: 10px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="分组类型" size="large" label-width="100px">
          <el-select v-model="treeForm.type" placeholder="请选择">
            <el-option v-for="item in typeData" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分组描述" size="large" label-width="100px">
          <el-input
            placeholder="分组描述"
            v-model="treeForm.groupingdescription"
            clearable
          
          ></el-input>
        </el-form-item>
        <el-form-item label="验证码" size="large" label-width="100px">
          <el-input
            placeholder="验证码"
            v-model="treeForm.verificationCode"
            clearable
          
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="watchGroupDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submittingbygroups(treeForm.id)">确 定</el-button>
      </span>
    </el-dialog>
    <!--事件弹窗,查看 /新增 / 修改-->
    <eventtype-add-or-update
      v-if="eventtypeAddOrUpdateVisible"
      ref="eventtypeAddOrUpdate"
      @refreshEventTypeDataList="getDataList" @close="eventtypeAddOrUpdateVisible=false"
    ></eventtype-add-or-update>
  </div>
</template>

<script>
  import TableTreeColumn from '@/components/table-tree-column'
  import EventtypeAddOrUpdate from './mailList-tree-crud'
import { treeDataTranslate } from '@/utils'
  import { setTimeout } from 'timers'
export default {
    data () {
      return {
        typeData: [
          {
            id: 0,
            name: '部门'
          },
          {
            id: 1,
            name: '义工'
          }
        ],
        // 当前页数
        currPage: 1,
        // 每页显示条目个数
        pageSize: 10,
        // 总条目数
        totalCount: 0,
        rules: {
          currentTreename: [
            { required: true, message: '请输入分组名称', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10个字', trigger: 'blur' }
          ]
        },
        baseUrl: window['SITE_CONFIG'].baseUrl,
        dataForm: {},
        // 事件类型窗口
        eventtypeAddOrUpdateVisible: false,
        dataList: [],
        dataListLoading: false,
        addOrUpdateVisible: false,
        watchQrCodeSrc: '',
        watchQrCodeDialogVisible: false,
        watchGroupDialogVisible: false,
        treeForm: {
          id: '',
          platformId: '',
        // 分组名字
          currentTreename: '',
        // 分组描述
          groupingdescription: '',
          type: '',
          verificationCode: ''
        }
      }
    },
    components: {
      TableTreeColumn,
      EventtypeAddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 每页显示条目个数改变时会触发
      sizeChangeHandle (val) {
        // console.log(`每页 ${val} 条`)
        this.pageSize = val
        this.currPage = 1
        this.$http({
          url: this.$http.adornUrl('/mail/mailgroup/list'),
          method: 'get',
          params: this.$http.adornParams(
            {
              limit: this.pageSize,
              page: this.currPage
              // groupId: this.selectedNode,
              // search: this.search
            }
          )
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.dataList = treeDataTranslate(data.data.list, 'id')
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      // 当前页数改变时会触发
      currentChangeHandle (val) {
        // console.log(`当前页: ${val}`)
        this.currPage = val
        this.$http({
          url: this.$http.adornUrl('/mail/mailgroup/list'),
          method: 'get',
          params: this.$http.adornParams(
            {
              limit: this.pageSize,
              page: this.currPage
              // groupId: this.selectedNode,
              // search: this.search
            }
          )
        }).then(({ data }) => {
          if (data && data.code === 0) {
            // console.log(data)
            this.dataList = treeDataTranslate(data.data.list, 'id')
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      // 添加分组
      addEventType () {
        this.eventtypeAddOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.eventtypeAddOrUpdate.init(null, null, 2) // 代表新增
        })
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/mail/mailgroup/list'),
          method: 'get',
          params: this.$http.adornParams()
        }).then((res) => {
            if (res && res.code === 0) {
            // console.log('res', res)
            this.dataList = treeDataTranslate(res.data.data, 'id')
            // console.log('this.dataList', this.dataList)
          } else {
            this.$message.error(res.msg);
          }
          this.dataListLoading = false
        })
      },
      // 递归dataList用于生成二维码，验证码
      recursiveDataList ({dataList, id, src, verification}) {
        var that = this
        if (dataList && dataList.length > 0) {
          dataList.forEach(item => {
            if (item.children && item.children.length > 0) {
              that.recursiveDataList({dataList: item.children, id, src, verification})
            }
  
            if (item.id === id) {
              if (src) {
                this.$set(item, 'qrCode', src)
              } else {
                this.$set(item, 'verificationCode', verification)
              }
            }
          })
        }
      },
      // 生成二维码
      createdQrCode (id) {
        var that = this
        this.$http({
          url: this.$http.adornUrl('/wechat/createGroupQRCode'),
          method: 'get',
          params: this.$http.adornParams(
            {
              groupId: id
            }
          )
        }).then((res) => {
          if (res && res.code === 0) {
            //  console.log('this.dataList1', this.dataList)
            that.recursiveDataList({dataList: that.dataList, id: id, src: res.data.qrCodeImgUrl})
            setTimeout(() => {
              // console.log('this.dataList', this.dataList)
            })
          } else {
            this.$message.error(res.msg);
          }
         
        })
      },
      // 生成验证码
      createdVerificationCode (id) {
        var that = this
        this.$http({
          url: this.$http.adornUrl('/mail/mailgroup/createVerification'),
          method: 'get',
          params: this.$http.adornParams(
            {
              groupId: id
            }
          )
        }).then((res) => {
          if (res && res.code === 0) {
             that.recursiveDataList({dataList: that.dataList, id: id, verification: res.data.verification})
            // console.log('this.dataList', this.dataList)
          } else {
            this.$message.error(res.msg);
          }
        })
      },
      // 分组修改提交
      submittingbygroups (id) {
        if (!this.treeForm.currentTreename) {
          this.$message.error('分组名称不能为空')
        } else {
          this.watchGroupDialogVisible = false
          this.$http({
            url: this.$http.adornUrl(`/mail/mailgroup/update`),
            method: 'post',
            data: this.$http.adornData({
              id: this.treeForm.id,
              name: this.treeForm.currentTreename,
              platformId: this.treeForm.platformId,
              remark: this.treeForm.groupingdescription,
              verificationCode: this.treeForm.verificationCode,
              type: this.treeForm.type
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.msg);
          }
            
          })
        }
      },
      // 新增 / 修改
      addOrUpdateHandle (item) {
        this.watchGroupDialogVisible = true
        this.treeForm = {
          id: item.id,
          platformId: item.platformId,
          currentTreename: item.name,
          groupingdescription: item.remark,
          verificationCode: item.verificationCode,
          type: item.type
        }
      },
      // 删除
      deleteHandle (item) {
        var that = this
        this.$confirm(`确定对[id=${item.id}]进行[删除]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var checkedNames = ''
  
          if (item.system === 1) {
            checkedNames += item.name
          }
  
          setTimeout(() => {
            if (checkedNames) {
              that.$message({
                message: `${checkedNames}删除失败`,
                type: 'error',
                duration: 1500
              })
              return 0
            }
            that.$http({
              url: that.$http.adornUrl(
              `/mail/mailgroup/delete/${item.id}`
            ),
              method: 'post'
            // data: that.$http.adornData(id)
            }).then(({ data }) => {
              if (data && data.code === 0) {
                that.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500
                })
                that.getDataList()
              } else {
                that.$message.error(data.msg)
              }
            })
          })
        })
      }
    }
  }
</script>
<style lang="less">
.mod-menu{
  
    .el-tag.el-tag--small.el-tag--light{
      background-color: rgba(64,158,255,.1);
      padding: 0 10px;
      height: 32px;
      line-height: 30px;
      font-size: 12px;
      color: rgba(71,157,255,1)!important;  
      border-radius: 4px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      border: 1px solid rgba(64,158,255,.2);
      white-space: nowrap;
    }
    //表格奇偶行换颜色
    .has-gutter tr>th{
      background:rgba(230,230,230,1);
    
    }
    .el-table th{
        background-color: rgba(230,230,230,1);
    }
    .el-table__body tbody > :nth-child(2n){
      background:rgba(230,230,230,1);
    }
    //弹窗样式
    .el-form-item.is-success .el-input__inner, .el-form-item.is-success .el-input__inner:focus, .el-form-item.is-success .el-textarea__inner, .el-form-item.is-success .el-textarea__inner:focus{
      border: 1px solid #DCDFE6;
    }
    //按钮样式
    .el-button.el-button--medium:hover{
      color: #a3a3a3 !important;
      border-color:rgba(71,157,255,1) !important;
      background: transparent !important;
    }
    .el-form{
       .el-button--primary{  
        width:88px;
        background:rgba(255,255,255,1);
        border:1px solid rgba(211,215,219,1);
        border-radius:2px;
        font-size:12px;
        font-family:MicrosoftYaHei;
        font-weight:400;
        color:rgba(162,162,162,1);
      }
    }
    //修改，删除按钮样式
    .cell{
      .el-button--text{
        font-size:12px;
        font-family:MicrosoftYaHei;
        font-weight:bold;
        color:rgba(118,214,114,1);
      }
      .el-button:last-child{
        font-size:12px;
        font-family:MicrosoftYaHei;
        font-weight:bold;
        color:rgba(230,115,128,1);
      }
    }
    
    .opration{
      display: flex;
      justify-content: space-around;
    }
}
</style>
