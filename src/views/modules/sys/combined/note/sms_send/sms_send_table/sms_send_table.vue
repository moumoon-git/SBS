<template>
  <div>
    <!--      联系人架构-->
    <div class="wrap">
      <!-- 不使用树形的复选框-->
      <div class="checkWrap">
        <aside class="checkList">
          <div style="float:right">
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange"
              style="border:none;"
            >
              <span style="font-size:12px;padding-left:5px;color:#D5D5D5">全选</span>
            </el-checkbox>
          </div>

          <div style="margin: 15px 0;"></div>

          <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
            <el-checkbox
              v-for="(city,index) in tableList"
              :label="city"
              :key="index"
              style="width:100%"
            >
              <div
                class="oneCheck"
              >
                <div style="padding: 6.5px 17px;background-color:rgba(238,238,238,1);margin-right:15px;">
                  <img v-if="city.images" :src="city.images.indexOf('http') === -1?baseUrl+city.images:city.images" alt="" style="width:51px;height:63px;vertical-align: middle">
                  <img v-else :src="images" alt="" style="width:51px;height:63px;vertical-align: middle">
                </div>
                <div class="zhiwu">
                  <p >姓名：<span class="title" @click.prevent="lookChoice(city)">{{city.name}}</span></p>
                  <p>职务：{{city.position}}</p>
                  <p class="name">单位：{{city.workUnit?city.workUnit:'无'}}</p>
                </div>
              </div>
            </el-checkbox>
          </el-checkbox-group>
        </aside>
      </div>
    </div>

    <!-- 联系人短信记录 -->
    <sms-send-detail ref="checkHistoryView"></sms-send-detail>
  </div>
</template>

<script>
import bus from "@/views/common/js/eventBus";
import smsSendDetail from "./sms_send_detail";

export default {
  props: ['dataList'],
  name: "sms_send_table",
  components: {
    "sms-send-detail": smsSendDetail
  },
  data() {
    return {
      idx: 0,
      images: require('../../../../../../../assets/img/load.jpg'),

      checkedCities: [],
      checkAll: false,
      isIndeterminate: true,
      value: [],
      result: "", //搜索内容

      tableList: [],
      allCheckStatu: false,
      noOrHalfCheckStatu: false,
      groupCheckData: [],//已选中的联系人

      baseUrl: window.SITE_CONFIG['cloudUrl'],
    };
  },
  watch: {
    dataList(newV,oldV){
      // console.log(this.groupCheckData)
      // this.checkedCities = []
      let addedkExist = [] //存放已添加的数据在当前组里选中数据
      let checkExist = [] //存放已选中的数据在当前组里选中数据
      this.tableList = newV;
        // console.log(this.groupCheckData)
        // if (this.addedkData.length !== 0) {
        //   this.addedkData.map(v=>{
        //     //  addedkExist.push(this.tableList.find( item => v.id === item.id ) )
        //   })
        // }
        if (this.groupCheckData) {
          // alert(4444)
          // console.log(this.groupCheckData)
          this.groupCheckData.map(v=>{
            // alert(444)
             checkExist.push(this.tableList.find( item => v.id === item.id ) )
          })
        }
      this.checkedCities = addedkExist.concat(checkExist)

      let checkedCount = this.checkedCities.length;
      this.checkAll = checkedCount === this.tableList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.tableList.length;
      this.$forceUpdate()
    },
    checkAll(newV,oldV){
      this.allCheckStatu = newV
      if (newV) {
        bus.$emit('allCheck')
      }
      setTimeout(()=>{
        if (!newV && !this.noOrHalfCheckStatu) {
          bus.$emit('noOrHalfCheck',newV)
        }
      })
    },
    isIndeterminate(newV,oldV){
      this.noOrHalfCheckStatu = newV
      if(!this.allCheckStatu) {
        bus.$emit('noOrHalfCheck',newV)
      }
    }
  },
  mounted(){
    bus.$off("getCheckData")
    bus.$on("getCheckData",val=>{
      this.groupCheckData = val
      // console.log(this.groupCheckData)
    })

    bus.$off("handleCheckAllChange")
    bus.$on('handleCheckAllChange',(val)=>{
      // alert(val)
      this.checkedCities = val ? this.tableList : [];
      this.isIndeterminate = false;
      this.checkAll = val
      bus.$emit("getData", this.checkedCities);
    })

    bus.$off("searchContact")
    bus.$on('searchContact',(val)=>{
      this.tableList = val
    })
  },
  methods: {
    changeData(index) {
      this.idx = index;
      this.$emit("changeData", index);
    },
    handleCheckAllChange(val) {
      bus.$emit('handleCheckAllChange',val)
    },
    handleCheckedCitiesChange(value) {
      bus.$emit("getData", value);
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.tableList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.tableList.length;
    },
    search() {
      this.$emit("search", this.result);
    },
    // 查看短信历史
    lookChoice(city) {
      this.$refs.checkHistoryView.checkHistory(city);
    },
   
  }
};
</script>

<style scoped lang="less">
p {
  margin: 0;
}
.el-checkbox + .el-checkbox {
  margin-left: 0;
}
.wrap {
  display: flex;
  flex-direction: column;
  margin-right: 5px;
  background-color: white;
}
.active {
  background-color: dodgerblue;
}
.tab {
  ul {
    width: 90%;
    list-style: none;
    display: flex;
    margin: 1vh auto;
    padding: 0;
    border-radius: 5px;
    border: 1px solid lightblue;
    li {
      text-align: center;
      flex: 1;
      // height: 3.5vh;
      height: 35px;
      // min-height: 35px;
      // line-height: 3.5vh;
      line-height: 35px;
      font-size: 0.8vw;
      border-right: 1px solid lightblue;
      &:last-child {
        border: 0;
      }
    }
  }
}

.serchWrap {
  //   width: 100%;
  padding: 5px;
  //   background: #00a2d4;
  //   display: flex;
  //   align-items: center;
  //   justify-content: space-around;
  input {
    height: 35px;
    width: 80%;
    border-radius: 5px;
    border: 1px solid #ccc;
    padding-left: 15px;
    color: #fff;
    vertical-align: top;
  }
  input::-webkit-input-placeholder {
    color: #ccc;
  }
  button {
    height: 35px;
    width: 18%;
    border-radius: 8px;
    background: rgb(14, 142, 190);
    border: 1px solid #299ac6 !important;
    color: #fff;
    border: none;
    font-size: 15px;
    /*font-family: "KatTi";*/
    /*letter-spacing: 5px;*/
  }
}

.checkWrap {
  height: 785px;
  overflow: scroll;
  &::-webkit-scrollbar{
    width: 0 !important;
    height: 0;
  }
  .checkList {
    background-color: #fff;
    padding: 10px;
    box-sizing: border-box;
    /deep/ .el-checkbox__label {
      padding-left: 0px;
      width: 100%;
      .oneCheck {
        // margin: 10px 0;
        width: 100%;
        display: flex;
        align-items: center;
        padding-right: 23px;
        .right{
          display: flex ;
          flex-direction: column;
          justify-content: flex-end;
          height: 50px;
          width: 130px;
          min-width: 80px;
          .name {
            display: inline-block;
            font-size: 13px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .zhiwu {
          width: 130px;
          min-width: 90px;
          display: flex !important;
          flex-direction: column;
          justify-content: space-between;
          display: inline-block;
          font-size: 14px;
          .title{
            font-size: 15px;
            font-weight: bold;
            color: #299ac6;
          }
          p {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: wrap;
            margin: 2px;
          }
        }
      }
    }
  }
}
.el-checkbox {
  width: 100%;
  border:1px solid rgba(213,213,213,1);
  margin: 3px 0;
  padding-right: 10px;
  vertical-align: middle;
  line-height: 0.8;
  border-radius:5px;
}

/deep/ .checkList .el-checkbox-group .el-checkbox__input.is-checked .el-checkbox__inner{
  background-color: #0091FF;
  border-color: #0091FF;
}

/deep/ .checkList .el-checkbox-group .el-checkbox .el-checkbox__input{
  position: absolute;
  top: calc( 50% - 9px );
  right: 15px;
}

/deep/ .checkList .el-checkbox-group .el-checkbox .el-checkbox__input .el-checkbox__inner{
  width: 18px;
  height: 18px;
  border-radius: 2px;
  &::after{
  border-width: 3px;
  height: 9px;
  width: 4px;
  top:1px;
  }
}

/deep/ .checkList .el-checkbox__input.is-checked .el-checkbox__inner{
  background-color: #0091FF;
  border-color: #0091FF;
}

/deep/ .checkList .el-checkbox .el-checkbox__input .el-checkbox__inner{
  &::after{
  border-width: 3px;
  height: 9px;
  width: 4px;
  top: 1px;
  }
}

/deep/ .checkList .el-checkbox__input.is-indeterminate  .el-checkbox__inner{
  background-color: #0091FF;
  border-color: #0091FF;
}

/deep/ .checkList .el-checkbox .el-checkbox__input .el-checkbox__inner{
  width: 18px;
  height: 18px;
  border-radius: 2px;
  &::before{
  top:6px;
  }
}

.pagination{
  margin: 10px 0px;
}
</style>
