<template>
  <div class="allContact">
    <!--      联系人架构-->
    <div class="wrap">
      <div class="outLine">
        <input class="search" placeholder="姓名、单位、职位、号码检索" v-model="key" @input="searchContact"/>
      </div>
      <!-- 不使用树形的复选框-->
      <div class="checkWrap">
        <aside class="checkList">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
            style="border:none;"
          >
            <span style="font-size:18px;">全选</span>
          </el-checkbox>

          <div style="margin: 15px 0;"></div>

          <ul class="main">
            <el-checkbox-group
              v-model="checkedCities"
              @change="handleCheckedCitiesChange"
              class="checkbox"
            >
              <li class="main-video" v-for="(city,index) in tableList" :key="index">
                <div class="audio-name">
                  <el-checkbox :label="city" style="width:100%">
                    <div class="oneCheck">
                      <div class="zhiwu">
                        <p>{{city.name}}</p>
                        <p>{{city.position}}</p>
                        <p class="name">{{city.workUnit?city.workUnit:'无'}}</p>
                      </div>
                    </div>
                  </el-checkbox>
                  <div class="img-r" @click="showHide(index,city.id)" ref="arrow">
                    <!-- <img src="../../../../../../../assets/img/list.png" ref="iconfont1" class="icon1" alt />
                    <img src="../../../../../../../assets/img/triangle.png" ref="iconfont2" class="icon2" alt /> -->
                  </div>
                </div>
                <div class="audio-body" ref="child" style="display:none;">
                    <div class="top">
                        <!-- <img :src="city.images?city.images:images" alt="" class="avatar"> -->
                        <div class="mainInfo" style="width: 80%;">
                            <div class="info" style=" display: flex;justify-content: space-between;">
                                <span class="name" style="flex: 1;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{city.name}}</span>
                                <span class="post" style="flex: 1;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{city.position?city.position:"无"}}</span>
                            </div>
                            <p class="workUnit" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{city.workUnit?city.workUnit:"无"}}</p>
                        </div>
                    </div>
                    <div>
                        <span>手机：{{city.mobile1?city.mobile1:"无"}}</span>
                        <span>办公：0755-152458965</span>
                    </div>
                    <div>
                        <span>家庭：{{city.urgentContactorMobile1?city.urgentContactorMobile1:"无"}}</span>
                        <span>其他：{{city.otherTel?city.otherTel:"无"}}</span>
                    </div>
                    <div>
                        <span>邮件：{{city.email?city.email:"无"}}</span>
                        <span>传真：{{city.fex?city.fex:"无"}}</span>
                    </div>
                </div>
              </li>
            </el-checkbox-group>
          </ul>
        </aside>
      </div>
    </div>
  </div>
</template>

<script>
import bus from "@/views/common/js/eventBus";

export default {
  props: ["dataList"],
  data() {
    return {
      checkedCities: [],//默认选中数据
      checkAll: false,
      isIndeterminate: true,
      tableList: [],
      // images: require('../../../../../../../assets/img/load.jpg'),//详情默认图片
      addedkData: [],//已添加的联系人
      groupCheckData: [],//已选中的联系人

      key: '',//搜索内容
    };
  },
  created() {
    // console.log(
    //   "newV++++++++++++++++++++++++++++++++++++++++++++++++++",
    //   this.dataList
    // );
  },
  mounted(){
    bus.$off("getCheckData")
    bus.$on("getCheckData",val=>{
      this.groupCheckData = val
    })
  },  
  watch: {
    dataList(newV, oldV) {
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
          this.groupCheckData.map(v=>{
             checkExist.push(this.tableList.find( item => v.id === item.id ) )
          })
        }
      this.checkedCities = addedkExist.concat(checkExist)
    },
  },
  methods: {
    handleCheckAllChange(val) {
      console.log('val: ', val);
      this.checkedCities = val ? this.tableList : [];
      this.isIndeterminate = false;
      this.checkAll = val;
      this.$emit("selectData", this.checkedCities);
    },
    handleCheckedCitiesChange(value) {
      console.log(value)
      this.$emit("selectData", value);
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.tableList.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.tableList.length;
    },
    showHide(index,id) {
      if (this.$refs.child[index].style.display === "none") {
        this.$refs.child[index].style.display = "block";
        this.$refs.iconfont1[index].style.display = "none";
        this.$refs.iconfont2[index].style.display = "inline-block";
        // this.$refs.arrow[index].style.transform = "rotateZ(0deg)";
      } else {
        this.$refs.child[index].style.display = "none";
        this.$refs.iconfont1[index].style.display = "inline-block";
        this.$refs.iconfont2[index].style.display = "none";
        // this.$refs.arrow[index].style.transform = "rotateZ(90deg)";
      }
    },
    // 搜索联系人
    searchContact(){
      this.$emit("searchResult", this.key);
    }
  },
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}
.allContact {
  height: 404px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 0 5px;
  .outLine {
    border-bottom: 1px dashed #ccc;
    padding: 5px 10px;
    .search {
      width: 100%;
      padding-left: 15px;
      border-radius: 50px;
      outline: none;
      height: 30px;
      border: 1px solid #ccc;
      &::-webkit-input-placeholder {
        color: #ccc;
      }
      &::-moz-input-placeholder {
        color: #ccc;
      }
      &::-ms-input-placeholder {
        color: #ccc;
      }
    }
  }
  .wrap {
    display: flex;
    flex-direction: column;
    background-color: white;
    margin: 0;
    .checkWrap {
      .checkList {
        background-color: #fff;
        box-sizing: border-box;
        .checkbox {
          height: 215px;
          overflow-x: scroll;
          &::-webkit-scrollbar {
            width: 0 !important;
            height: 0;
          }
        }
        /deep/ .el-checkbox__label {
          width: 93%;
          padding: 0;
          margin-left: 10px;
          .oneCheck {
            width: 100%;
            display: flex;
            align-items: center;
            .right {
              display: flex;
              flex-direction: column;
              justify-content: flex-end;
              height: 50px;
              width: 130px;
              min-width: 80px;
              .name {
                display: inline-block;
                font-size: 15px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
            .zhiwu {
              width: 235px;
              min-width: 90px;
              height: 27px;
              display: flex !important;
              justify-content: space-between;
              display: inline-block;
              font-size: 13px;
              line-height: 27px;
              p {
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: wrap;
                padding: 0 5px;
              }
            }
          }
        }
      }
    }
  }
}

.main {
  padding: 0;
  list-style: none;
  .title {
    text-align: center;
    border-bottom: 1px dashed #ccc;
    padding: 8px 0;
  }
  .main-video {
    .audio-name {
      display: flex;
      align-items: center;
      .img-l {
        margin: 0 40px 0 10px;
      }
      .img-r {
        .icon1 {
          width: 16px;
          transform: rotateX(180deg);
        }
        .icon2 {
          display: none;
          width: 16px;
        }
      }
    }
    .audio-body{
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #ccc;
        margin: 5px;
        .top{
            display: flex;
            .avatar{
                width: 50px;
                height: 50px;
                border-radius: 50%;
                margin-right: 10px;
            }
            .maininfo{
                width: 80%;
                .info{
                    display: flex;
                    justify-content: space-between;
                    span{
                        flex: 1;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
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
.checkbox{
    font-size: 13px;
    color: #333;
}

.el-checkbox {
  width: 100%;
  border-bottom: 1px dashed #ddd;
  margin: 3px 0;
  padding: 3px 10px;
  vertical-align: middle;
  line-height: 0.8;
}

/deep/
  .checkList
  .el-checkbox-group
  .el-checkbox__input.is-checked
  .el-checkbox__inner {
  background-color: limegreen;
  border-color: limegreen;
}

/deep/
  .checkList
  .el-checkbox-group
  .el-checkbox
  .el-checkbox__input
  .el-checkbox__inner {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  &::after {
    border-width: 3px;
    height: 9px;
    width: 4px;
  }
}
</style>