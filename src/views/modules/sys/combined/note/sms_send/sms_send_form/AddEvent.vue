<template>
  <div>
    <!-- 添加事件关联人员 -->
    <el-dialog :visible.sync="personnelView" width="910px" title="添加事件关联人员" center>
      <el-row :gutter="20">
        <el-col :span="18" style="border-right:1px solid #ccc;padding-right: 23px;">
          <div class="search">
            <div class="searchWrap" style="width:50%">
              <img src="../../../../../../../assets/img/search.png" class="searchIcon" alt />
              <input type="text" placeholder="请输入事件标题或编号" v-model="search" class="search" @input="searchDebounce" style="width:100%;">
            </div>
            <span style="display:inline-block;width:13%;text-align:center;">事发时间</span>
            <div class="searchWrap" style="width:37%">
                <el-date-picker
                v-model="value1"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd">
                </el-date-picker>
            </div>
          </div>
          <el-table :data="tableData" height="250" border style="width: 100%" @row-click='getEventPerson' highlight-current-row>
            <el-table-column prop="number" label="事件编号"></el-table-column>
            <el-table-column prop="title" label="事件标题"></el-table-column>
            <el-table-column prop="reportTime" label="事发时间"></el-table-column>
          </el-table>
        </el-col>
        <el-col :span="6">
          <div style="display:flex;justify-content: space-between;margin-bottom:20px;">
            <p>事件关联人员</p>
            <p>已选一人</p>
          </div>
          <ul class="main">
                        <!-- <el-checkbox-group v-model="checkList"> -->
            <li class="main-video" v-for="(item,index) in relateContact" :key="item.id">
              <div class="audio-name">
                <el-checkbox :key="item.id" @change="(val)=>{show(val,item)}"></el-checkbox>
                <div class="img-l">
                  <span class="img-l-num">{{item.createTime}}</span>
                </div>
                <div class="img-r" @click="showHide(index)" ref="arrow">
                  <img src="../../../../../../../assets/img/triangle.png" class="iconfont" alt />
                </div>
              </div>
              <div class="audio-body" ref="child" style="display:none;">
                <ul style="display:flex;;list-style:none;padding:0;">
                  <li
                    style="border:1px solid #ccc;border-radius:3px;padding:10px;margin: 0px 5px;"
                    v-for="v in item.messageInforEntityList"
                    :key="v.id"
                  >{{v.name?v.name:'未知联系人'}}</li>
                </ul>
              </div>
            </li>
            <!-- </el-checkbox-group> -->
          </ul>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="personnelView = false">取 消</el-button>
        <el-button @click="sumbit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
    data() {
        return {
            personnelView: false,
            tableData: [],//事件列表
            search: '',
            value1: '',

            relateContact: [], //点击获取人员
            checkList: [],
            checkData: "",//选中数据

            test: '',
        }
    },
    created(){
        this.searchDebounce = this._.debounce(() => {
            this.getListData()
        },1000)
    },
    watch:{
        value1(newV){
            // console.log(newV)
            this.getListData()
        }
    },
    methods: {
        getListData(){
            this.$http({
                url: this.$http.adornUrl("/emergency/emergencyinfo/list"),
                method: "get",
                params: this.$http.adornParams({
                  key: this.search,
                  startTime: this.value1[0],
                  endTime: this.value1[1],
                  status: '',
                  type: '',
                  page: 1,
                  limit: 10,
                })
              }).then(data => {
                // console.log(data.data.page.list);
                if (data.data.page.list !== 0) {
                    this.tableData = data.data.page.list
                    this.getEventPerson(this.tableData[0])
                } else {
                  this.$message.error(data.msg);
                }
              });
        },
        init() {
            this.personnelView = true
            this.getListData()
              
        },
        showHide(idx) {
            if (this.$refs.child[idx].style.display === 'none') {
                this.$refs.child[idx].style.display = 'block'
                this.$refs.arrow[idx].style.transform = 'rotateZ(-90deg)'
            } else {
                this.$refs.child[idx].style.display = 'none'
                this.$refs.arrow[idx].style.transform = 'rotateZ(0deg)'
            }
        },
        // 获取事件关联人员
        getEventPerson(row){
           this.$http({
                url: this.$http.adornUrl("/message/messageinfor/getMailContactByEventId"),
                method: "get",
                params: this.$http.adornParams({
                  eventId	: row.id
                })
              }).then(data => {
                // console.log(data.data.page.list);
                // console.log(data)
                if (data.data.code === 0) {
                    this.relateContact = data.data.data
                } else {
                  this.$message.error(data.data.msg);
                }
              });
        },
        sumbit(){
          this.personnelView = false
          this.$emit('getEventContact',this.checkList)
        },
        show(val,item){
          if(val){
            this.checkList.push(item)
          }else{
           this.checkList = this.checkList.filter(v=>v.id!==item.id)
          }
          // console.log(this.checkList)
        },
      
    },
};
</script>

<style lang="scss" scoped>
// 添加事件关联人员
.search{
  display: flex;
  align-items: center;
  .searchWrap {
    padding: 16px 0px;
    display: flex;
    justify-content: space-between;
    position: relative;
    .search{
        outline: none;
        border:1px solid #ccc;
        height: 35px;
        border-radius: 3px;
        padding-left: 30px;
    }
    .searchIcon {
      width: 24px;
      position: absolute;
      top: 23px;
      left: 4px;
      z-index: 1;
    }
    /deep/ .el-input--medium .el-input__inner {
      padding-left: 30px;
    }
    /deep/ input::-webkit-input-placeholder {
      // padding-left: 20px;
    }
  }
}

.main{
  list-style: none;
  margin: 0;
  height: 276px;
  overflow: scroll;
  padding: 0;
  &::-webkit-scrollbar{
    width: 0 !important;
    height: 0;
  }
  .main-video{
    .audio-name{
      display: flex;
      .img-l{
        margin: 0 15px 0 10px;
      }
      .img-r{
        .iconfont{
          width: 16px;
          transform: rotateZ(90deg)
        }
      }
    }
  }
}

.groupList {
  list-style: none;
  padding: 0 10px;
  display: flex;
  
  .oneGroupList {
    width: 150px;
    display: flex;
    justify-content: space-between;
    align-content: center;
    border: 1px solid #ccc;
    padding: 8px;
    .workUnit {
      width: 60%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .totalCount {
    }
  }
}
.el-date-editor .el-range-separator{
    padding: 0;
}
</style>