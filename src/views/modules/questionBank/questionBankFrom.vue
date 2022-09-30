<template>
  <div class="questionBankFrom_wrap">
<!--    <el-button class="pd" >-->
<!--      批量导出-->
<!--    </el-button>-->
    <div class="bodyx"  v-if="questionBankFlag">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="160"
            >
          </el-table-column>
          <el-table-column
            label="题库类型"
            width="343">
            <template slot-scope="scope">{{ scope.row.tikuTypeScript }}</template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="题库描述"
            width="380">
            <template slot-scope="scope">{{ scope.row.remark }}</template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="wrpDiv" @click="handleEdit(scope.$index, scope.row)">
                <img class="noactive" src="../../../assets/img/question/xb.png" alt="">
                <img class="active"  src="../../../assets/img/question/xb1.png" alt="">
                <div class="pq">
                  <div>编辑</div>
                </div>
              </div>
<!--              <div class="wrpDiv" @click="handleDelete(scope.$index, scope.row)">-->
<!--                <img class="noactive" src="../../../assets/img/question/sc.png" alt="">-->
<!--                <img class="active" src="../../../assets/img/question/sc1.png" alt="">-->
<!--                <div class="pq">-->
<!--                  <div>导出</div>-->
<!--                </div>-->
<!--              </div>-->
            </template>
          </el-table-column>
        </el-table>
    </div>

    <div v-if="!questionBankFlag">
      <questionBank ref="questionBank" @backClicks="backClickx" ></questionBank>
    </div>

  </div>
</template>

<script>
  import url from '@/mock/modules/url'
  import questionBank from './questionBank'
  export default{
    name:'questionBankFrom',
    data () {
      return {
        questionBankFlag:true,
        tableData: [
          // {
          //   gmtCreate: '',
          //   registerName: '',
          //   tikuTypeScript: ''
          // }
        ],
        multipleSelection: [],
        tkTypeListsData:[]
      }
    },
    methods:{
      backClickx () {
        this.questionBankFlag = true
      },
      tkTypeLists () {
        this.$http({
          url: this.$http.adornUrl(url.epiRegisterTopic.url),
          method: url.epiRegisterTopic.method,
          data: this.$http.adornData({})
        }).then((res)=>{
          this.tkTypeListsData = res.data.data
        }).catch((err)=>{

        })
      },
      handleEdit(index, row) {
        // console.log(index, row);
          this.$http({
            url: this.$http.adornUrl(url.getOneAndLink.url),
            method: url.getOneAndLink.method,
            params: this.$http.adornParams({
              tikuId:row.id
            })
          }).then((res)=>{
            // console.log(res.data.data)
            if (res.data.data) {
              // this.$router.push({ path: '/questionBank/questionBank', query:{data:res.data.data}})
              this.questionBankFlag = false
              this.$nextTick(()=>{
                  this.$refs.questionBank.Topicinits(this.tkTypeListsData)
                  this.$refs.questionBank.inits([res.data.data])
                  this.$refs.questionBank.alldatas(res.data)
              })
            }
          }).catch((err)=>{

          })
      },
      handleDelete(index, row) {
        console.log(index, row);
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(val)
      },
      requers () {
        this.$http({
          url: this.$http.adornUrl(url.epiRegisterTikuList.url),
          method: url.epiRegisterTikuList.method,
          params: this.$http.adornParams({
            page:1,
            limit:20
          })
        }).then((res)=>{
          // console.log(res.data.data.list)
          this.tableData = res.data.data.list
        }).catch((err)=>{

        })
      }
    },
    mounted () {
      this.requers()
      this.tkTypeLists()
    },
    components:{
      questionBank
    }
  }
</script>

<style scoped>
.pd{
  margin-left: 10px;
  margin-bottom: 13px;
  width:76px;
  height:30px;
  background:rgba(255,255,255,1);
  border-radius:3px;
  border:1px solid rgba(222,228,236,1);
  color:rgba(149,165,187,1);
  line-height:30px;
  text-align: center;
  padding: 0;
}
.queryCondition /deep/ .el-button--primary {
  color: #fff;
  background-color: #409EFF;
  border-color: #409EFF;
}
.bodyx /deep/ .el-table-column--selection{
  padding-left: 60px;
}
.bodyx /deep/ .el-checkbox__inner{
  width:16px;
  height:16px;
  border:1px solid rgba(221,228,233,1);
}
.bodyx /deep/ th>.cell{
  font-size:12px;
  font-weight:600;
  color:#000;
  line-height:17px;
}
.bodyx /deep/ td>.cell{
  font-size:12px;
  font-weight:400;
  color:#666666;
  line-height:17px;
}
.bodyx /deep/ .el-tooltip{
  display: flex;
}
.wrpDiv{
  margin-right: 15px;
  position: relative;
}
.wrpDiv>img{
  width:14px;
  height: 14px;
  cursor: pointer;
}
.noactive{
  display: block;
}
.wrpDiv:hover .noactive{
  display: none;
}
.wrpDiv:hover .active{
  display: block;
}
.wrpDiv:hover .pq{
  display: block;
}
.bodyx /deep/ .cell,.bodyx /deep/ tbody,.bodyx /deep/ .el-table__body,.bodyx /deep/ .el-table__body-wrapper{
  overflow: visible !important;
}
.active{
  display: none;
}
.pq{
  position: absolute;
  text-align: center;
  border-radius: 5px;
  top: -40px;
  left: -13px;
  right: 0;
  margin: auto;
  width:40px;
  height:27px;
  line-height: 27px;
  background:#666;
  box-shadow:0px -2px 7px 0px rgba(0,0,0,0.18);
  color: #fff;
  display: none;
}
.pq>div{
  position: relative;
}
.pq>div:before{
    content: '';
    position: absolute;
    bottom: -6px;
    left: 0;
    right: 0;
    margin: auto;
    width: 10px;
    height: 10px;
    background: #666;
    transform: rotate(45deg);
}

</style>
