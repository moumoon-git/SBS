<template>
  <div>
    <!-- 清空所有 -->
    <el-dialog :visible.sync="draftsView" width="910px" title="草稿箱" center>
        <el-row :gutter="20" class="drafts">
            <el-col :span="11">
                <div class="info">
                <div class="number">
                    <p>草稿箱数量：<span style="color:red;font-weight:bold;">{{contactList.length}}</span></p>
                    <p style="color:#01a9f2" @click="delDrafts()">清空</p>
                </div>
                <ul class="detail"> 
                    <li class="oneDetail" v-for="item in contactList" :key="item.id" @click="SMSContent(item)">
                        <img src="../../../../../../../assets/img/delete.png" class="delIcon" alt="" @click="delDrafts(item.id)">
                        <div class="data">
                            <p>{{item.createTime}}</p>
                            <p class="name">编写人：{{item.name}}</p>
                        </div>
                    </li>
                </ul>
          </div>
            </el-col>
            <el-col :span="13">
                <div class="statistics">
                    <div>已选收信人</div>
                    <p>通讯录分组数量：{{detailData.mlGroup?detailData.mlGroup.length:0}} &nbsp;&nbsp;&nbsp;&nbsp;短信分组数量：{{detailData.msgGroup?detailData.msgGroup.length:0}} &nbsp;&nbsp;&nbsp;&nbsp;联系人数量：{{detailData.phone?detailData.phone.split(',').length:0}}</p>
                    <div>短信内容</div>
                    <p class="content">
                        {{detailData.content}}
                    </p>
                </div>
            </el-col>
        </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="draftsView = false" plain size="small">取 消</el-button>
        <el-button type="primary" @click="sure" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import bus from "@/views/common/js/eventBus";

export default {
    data() {
        return {
            draftsView: false,
            contactList: [],

            detailData: [],
            draftData: [],//草稿箱数据
        }
    },
    methods:{
        // 初始化数据
        initData(){
             this.$http({
                url: this.$http.adornUrl(`/message/messagedraft/listdarft`),
                method: 'POST',
                data: this.$http.adornData({})
                }).then(({ data }) => {
                    if(data.code === 0){
                        this.contactList = data.data
                        if (this.contactList.length>0) {
                            this.SMSContent(this.contactList[0])
                        }else{
                            this.detailData = []
                        }
                    }else {
                        this.$message.error(data.msg);
                    }
            })
        },
        init(){
            this.draftsView = true
            this.initData()
        },
        SMSContent(obj){
            this.draftData = obj
            this.$http({
                url: this.$http.adornUrl(`/message/messagedraft/selectdarftbyid`),
                method: 'POST',
                data: this.$http.adornData({
                    id: obj.id
                })
                }).then(({ data }) => {
                    if (data && data.code == 0) {
                        // console.log(data)
                        // if (data.data.length !== 0) {
                        //   this.total = data.data.totalCount
                        //   this.platShareMenuList = data.data.list
                        //   console.log('platShareMenuList++++++++++++++++++++++++++++++++++++++++++++',this.platShareMenuList)
                        // }
                        this.detailData = data.data
                    } else {
                        this.$message.error(data.msg);
                    }
                
                })
        },
        // 确定提取草稿箱联系人
        sure(){
            this.draftsView = false
            // console.log(this.detailData)
            if(this.detailData){
                bus.$emit("getDetailData",this.detailData)
            }
        },
        // 删除草稿箱
        delDrafts(ids){
            
               ids = ids?[ids]:this.contactList.map(v=> v.id)
            this.$confirm('此操作将永久删除该草稿, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                      this.$http({
                url: this.$http.adornUrl(`/message/messagedraft/delete`),
                method: 'POST',
                data: this.$http.adornData({
                    ids,
                })
                }).then(({ data }) => {
                // console.log(data)
                    if (data.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!',
                            duration: 1500,
                            onClose:()=>{
                                this.initData()
                                this.$emit('initDrafts')
                            }
                        });
                    } else {
                        this.$message.error(data.msg);
                    }
                })
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
          
        }
}
};
</script>

<style lang="scss" scoped>
p{
    margin: 0;
}
/deep/ .el-dialog__wrapper .el-dialog{
  border-radius: 8px;
  .el-dialog__header{
    background-color: #01a9f2 !important;
    padding: 10px 0;
    border-radius: 8px 8px 0 0;
    .el-dialog__headerbtn {
      top: 12px;
      .el-dialog__close{
        color: #d1f9fb; 
      }
    }
    span{
      color: #d1f9fb; 
    }
  }
  .el-dialog__body{
      padding: 0px 18px 10px;
  }
}

.drafts{
    .info{
        .number{
            display: flex;
            justify-content: space-between;
            padding: 8px 20px 8px 0px;
            border-bottom: 1px solid #ccc;
            
        }
        .detail{
            list-style: none;
            padding: 0;
            height: 243px;
            overflow-x: scroll;
            &::-webkit-scrollbar{
                width: 0 !important;
                height: 0;
            }
            .oneDetail{
                display: flex;
                align-items: center;
                .delIcon{
                    width: 20px;
                    height: 20px;
                    margin-right: 10px;
                }
                .data{
                    width: 90%;
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 10px;
                    background-color: #f2f2f2;
                    margin: 10px 0;
                    color: black;
                    align-items: center;
                    .name{
                        width: 120px;
                    }
                }
            }
        }
    }
    .statistics{
        border: 1px solid #01a9f2;
        padding: 0 10px;
        font-size: 14px;
        margin-top: 25px;
        div{
            margin: 8px 0;
        }
        .content{
            text-indent: 2em;
            height: 145px;
            overflow-x: scroll;
            &::-webkit-scrollbar{
                width: 0 !important;
                height: 0;
            }
        }
    }
}
</style>