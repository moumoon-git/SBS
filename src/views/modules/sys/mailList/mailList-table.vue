<template>
  <div class="mailList-table-wrap" style="padding:3px;margin: 0px auto;">
      <ul style="display:flex;flex-wrap:wrap;margin:0 auto;">
        <li style="width:390px;display:flex;padding:15px;border:1px solid rgba(0, 0, 0, 0.6);border-radius: 5px;margin:0px 15px 15px 0;position: relative;"  v-for="(item,idx) in dataList" :key="idx" @mouseover="show(idx)" @mouseleave="show(-1)">
          <!-- <img style="width:150px;height:170px;margin-right:10px;" :src="item.images?item.images:imageUrl" alt=""> -->
          <viewer :images="[item.images?$window.SITE_CONFIG.cloudUrl + item.images:imageUrl]"> 
            <img
                v-for="(item,index) in [
                  item.images
                    ? (item.images.startsWith('http') ? item.images : $window.SITE_CONFIG.cloudUrl + item.images)
                    : imageUrl
                ]"
                :key="index"
                :src="item"
                class="avatar"
              >
        </viewer>
         <div class="operation" v-if="onOff==idx"> 
                  <span v-if="isAuth('mail:mailcontactor:info')"  @click="addOrUpdateHandle(item.id, 0)" style="cursor: pointer;">
                    <i class="el-icon-view"></i>
                  </span> 
                  <span v-if="isAuth('mail:mailcontactor:update')&&!$parent.sharedPlatform.noticeBarVisible"  @click="addOrUpdateHandle(item.id, 1)" style="cursor: pointer;"> 
                    <i class="el-icon-edit"></i>
                  </span>
                  <span v-if="isAuth('mail:mailcontactor:delete')&&!$parent.sharedPlatform.noticeBarVisible"  @click="batchDelete({'id':item.id,'name':item.name})" style="cursor: pointer;">
                    <i class="el-icon-delete"></i>
                  </span>
                </div>
          <div class="info">
            <p>姓名：{{item.name}}</p>
            <p>单位：{{item.workUnit?item.workUnit:"未知"}}</p>
            <p>职务：{{item.position}}</p>
            <p>手机号码：{{item.mobile}}</p>
            <p>办公室电话：{{item.officeTel?item.officeTel:"未知"}}</p>
            <p>家庭电话：{{item.homeTel?item.homeTel:"未知"}}</p>
            <!-- <p>备注：{{item.remark}}</p> -->
            <div>
              <div style="position: absolute;top:8%;right:5%">
                <img src="../../../../assets/img/administrators.png" style="width:20px;" v-if="item.personnelMark == 1" alt="">
                <img src="../../../../assets/img/authentication .png" style="width:25px;" v-if="item.openId">
              </div>

            </div>
          </div>
        </li>
      </ul>
    <!-- <el-table
      @selection-change="handleSelectionChange"
      :data="dataList"
      stripe
      border
      style="width: 100%;"
      height="583px"
      :header-cell-style="{
        background: '#E6E6E6 ',
        color: '#555',
        border: '1px solid #fff'
      }"
      :cell-style="{ border: '1px solid #fff' }"
      :row-class-name="tableRowClassName"
    >
      <el-table-column type="selection" width="55"></el-table-column> -->
      <!-- <el-table-column
        prop="id"
        sortable
        header-align="center"
        align="center"
        width="100"
        label="ID"
      >
      </el-table-column>-->
      <!-- <el-table-column sortable prop="name" header-align="center" align="center" width="100" label="姓名"></el-table-column> -->
      <!-- <el-table-column
        prop="workUnit"
        header-align="center"
        align="center"
        width="200"
        label="工作单位"
      >
      </el-table-column>-->
      <!-- <el-table-column
        prop="officeTel"
        header-align="center"
        align="center"
        width="130"
        label="办公室电话"
      >
      </el-table-column>-->
      <!-- <el-table-column prop="position" header-align="center" align="center" :show-overflow-tooltip="true" label="职务"></el-table-column>
      <el-table-column prop="sex" header-align="center" align="center" label="性别">
        <template slot-scope="scope">
          <div v-if="scope.row.sex === 0">男</div>
          <div v-else>女</div>
        </template>
      </el-table-column>
      <el-table-column prop="mobile1" header-align="center" align="center" :show-overflow-tooltip="true" label="手机号码"></el-table-column> -->
      <!-- <el-table-column
        prop="email"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="邮箱地址"
      >
      </el-table-column>-->
      <!-- <el-table-column prop="remark" header-align="center" align="center" :show-overflow-tooltip="true" label="备注"></el-table-column> -->
      <!-- <el-table-column sortable prop="importance" header-align="center" align="center" width="125" :show-overflow-tooltip="true" label="紧急联系人">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.importance === 1" size="small">是</el-tag>
          <el-tag v-else size="small" type="danger">否</el-tag>
        </template>
      </el-table-column> -->
      <!-- <el-table-column sortable prop="commonlyUsed" header-align="center" align="center" width="125" :show-overflow-tooltip="true" label="常用联系人">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.commonlyUsed === 1" size="small">是</el-tag>
          <el-tag v-else size="small" type="danger">否</el-tag>
        </template>
      </el-table-column> -->

      <!--隐藏宽-->
      <!-- <el-table-column prop="myPlatformId" v-if="false" label="本级平台id"> -->
      <!-- </el-table-column> -->
<!-- 
      <el-table-column fixed="right" header-align="center" align="center" width="250" label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('mail:mailcontactor:info')" type="info" size="mini" @click="addOrUpdateHandle(scope.row.id, 0)">查看</el-button>
          <el-button v-if="isAuth('mail:mailcontactor:update')" type="primary" size="mini" @click="addOrUpdateHandle(scope.row.id, 1)">修改</el-button>
          <el-button v-if="isAuth('mail:mailcontactor:delete')" type="danger" size="mini" @click="batchDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table> -->


  </div>
</template>
<script>
export default {
  
  props: ['dataList'],
  // 表格内容
  data () {
    return {
      imageUrl:require('../../../../assets/img/load2.svg'),
      onOff: null,
    }
  },
  methods: {
    getSrcList(index){
      return this.urls.slice(index).concat(this.urls.slice(0,index))
    },
    // tableRowClassName 为 Table 中的某一行添加 class
    tableRowClassName ({ row, rowIndex }) {
      if (!row.openId) {
        return 'warning-row'
      } else {
        return 'success-row'
      }
      return ''
    },
    // 查看
    addOrUpdateHandle (id, staus) {
      this.$emit('addOrUpdateHandle', id, staus)
    },
    // 修改
    handleSelectionChange (val) {
      this.$emit('handleSelectionChange', val)
    },
    // 删除
    batchDelete (row) {
      this.$emit('batchDelete', row)
    },

     onPreview() {
     this.showViewer = true
    },
    // 关闭查看器
    closeViewer() {
     this.showViewer = false
    },
    show(idx){
      this.onOff = idx
    },
    hide(){
      this.onOff = null
    }
  }
}
</script>

<style lang="less">
.mailList-table-wrap {
  p{
    margin-bottom: 5px;
  }
  .el-table .warning-row {
    color: rgb(209, 199, 199);
    flex-wrap: wrap
  }

  .el-table .success-row {
    // background: #f0f9eb;
  }
  .el-table::before {
    height: 0px;
  }
  .el-table__header .has-gutter tr > th {
    background: rgba(230, 230, 230, 1) !important;
  }
  .el-table th {
    background: rgba(230, 230, 230, 1) !important;
  }
  .el-table__body tbody > :nth-child(2n) {
    background: rgba(230, 230, 230, 1);
  }
  .el-button--default {
    border-radius: 3px;
    width: 88px;
  }
  .cell {
    .el-button--info {
      background-color: transparent;
      border: none;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      font-weight: bold;
      color: rgba(71, 157, 255, 1);
    }
    .el-button--primary {
      background-color: transparent;
      border: none;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      font-weight: bold;
      color: rgba(118, 214, 114, 1);
    }
    .el-button--danger {
      background-color: transparent;
      border: none;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      font-weight: bold;
      color: rgba(230, 115, 128, 1);
      
    }
  }
  .el-pagination {
    display: flex;
    justify-content: center;
  }


  .avatar{
    // width:150px;
    height:170px;
    margin-right:10px;
  }
  .info{
    display: flex;
    flex-direction: column;
    align-content: space-around;
    box-sizing: border-box;
  }
  .operation{
    position: absolute;;
    bottom: 26px;
    left: 77px;
    span{
      display:inline-block;
      width:25px;
      height:25px;
      background-color:#ccc;
      line-height:25px;
      text-align:center
    }
  }
}
</style>

