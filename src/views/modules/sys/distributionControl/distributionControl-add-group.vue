<template>
  <div>
    <el-dialog title="请选择要添加的组" :visible.sync="dialogVisible" width="943px" center>
        <el-row :gutter="20">
           
            <el-col :span="8">
                            <div>卡口分组</div>
                <div class="addData">
                      <el-checkbox :indeterminate="isBayonet" v-model="checkbayonetAll" @change="bayonetCheckAllChange">全选</el-checkbox>
                        <div style="margin: 15px 0;"></div>
                        <el-checkbox-group v-model="checkBayonetData" @change="bayonetCheckedCitiesChange">
                            <div v-for="(city,index) in bayonetData" :key="`city_${index}`">
                                <el-checkbox :label="city.id">{{city.name}}</el-checkbox>
                            </div>
                        </el-checkbox-group>
                </div>
            </el-col>

            <el-col :span="8">  
              <div>&nbsp;</div>
              <div class="addData">
                <ul class="humanData">
                  <li v-for="(item,index) in checkHumanDataObj" :key="`check1_${index}`" class="oneHumanData">
                      {{item.name}}
                  </li>
                  <li v-for="(item,index) in checkBayonetDataObj" :key="`check2_${index}`" class="oneHumanData">
                      {{item.name}}
                  </li>
                </ul>
              </div>
            </el-col>

             <el-col :span="8">
              <div>人脸黑名单分组</div>
                <div class="addData">
                      <el-checkbox :indeterminate="isHuman" v-model="checkHumanAll" @change="humanCheckAllChange">全选</el-checkbox>
                        <div style="margin: 15px 0;"></div>
                        <el-checkbox-group v-model="checkHumanData" @change="humanCheckedCitiesChange">
                            <div v-for="(city,index) in humanData" :key="index">
                                <el-checkbox :label="city.id">{{city.name}}</el-checkbox>
                            </div>
                        </el-checkbox-group>
                </div>
            </el-col>
        </el-row>

        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="preservationGroup">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import { format } from "path";

export default {
  props: ['allCheckBayonetData','allCheckHumanData'],
  data() {
    return {
      dialogVisible: false,
    checkHumanAll: false,
    humanData: ['上海', '北京'],
    isHuman: true,
    checkHumanData: [], //添加的人员组
    checkHumanDataObj: [], //添加的人员组

    checkbayonetAll: false,
    bayonetData: ['上海', '北京'],
    isBayonet: true,
    checkBayonetData: [], //添加的卡口组
    checkBayonetDataObj: [], //添加的卡口组
    id: '',//点击的布控 
    };
  },
  watch:{
    allCheckBayonetData(newV,oldV){
      this.checkBayonetData = newV.map(v=>v.id)
      this.checkBayonetDataObj = newV
    },
    allCheckHumanData(newV,oldV){
      this.checkHumanData = newV.map(v=>v.id)
      this.checkHumanDataObj = newV
    },
    checkHumanData(newV,oldV){
      this.checkHumanDataObj = []
       newV.map(v=>{
        this.humanData.map(item=>{
          if(v == item.id){
            this.checkHumanDataObj.push(item)
          }
        })
      })
    },
    checkBayonetData(newV,oldV){
      this.checkBayonetDataObj = []
      newV.map(v=>{
        this.bayonetData.map(item=>{
          if(v == item.id){
            this.checkBayonetDataObj.push(item)
          }
        })
      })
    }
  },
  methods: {
      // 打开新增组弹窗
    init(id,type) {
      this.checkHumanData = []
      this.checkBayonetData = []
      this.isHuman = true
      this.isBayonet = true

      this.$parent.initGroup()

      this.id = id
      this.dialogVisible = true;
          var that = this
            that
          .$http({
            url: that.$http.adornUrl(`/vcm/vcmHumanGroup/list`),
            method: "get",
          })
          .then(({ data }) => {
            if (data && data.code === 0) {
               this.humanData = data.data
              //  this.humanData = ['上海', '北京','广州']
              
            } else {
              that.$message.error(data.msg);
            }
          });

        var that = this
          that
        .$http({
          url: that.$http.adornUrl(`/vcm/vcmBayonetInfo/list`),
          method: "get",
          params: this.$http.adornParams({
            type: type,
          })
          // data: that.$http.adornData(id)
        })
        .then(({ data }) => {
          if (data && data.code === 0) {
             this.bayonetData = [...data.data]
            
          } else {
            that.$message.error(data.msg);
          }
        });

    },
     humanCheckAllChange(val) {
        this.checkHumanDataObj = val ? this.humanData : [];
        this.checkHumanData = this.checkHumanDataObj.map(e => e.id)
        this.isHuman = false;
      },
      humanCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkHumanAll = checkedCount === this.humanData.length;
        this.isHuman = checkedCount > 0 && checkedCount < this.humanData.length;
      },
     bayonetCheckAllChange(val) {
      //  console.log(val)
        this.checkBayonetDataObj = val ? this.bayonetData : [];
        this.checkBayonetData = this.checkBayonetDataObj.map(e => e.id)
      //  console.log(this.checkBayonetData)
        this.isBayonet = false;
      },
      bayonetCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkbayonetAll = checkedCount === this.bayonetData.length;
        this.isBayonet = checkedCount > 0 && checkedCount < this.bayonetData.length;
      },
      //保存
      preservationGroup(){
        var that = this
          that
        .$http({
          url: that.$http.adornUrl(`/vcm/vcmSuspectTask/saveBayonetAndGroupToSuspect`),
          method: "post",
          data: this.$http.adornData({
            bayoneLists: this.checkBayonetData,
            groupLists: this.checkHumanData,
            id: this.id,
          })
          // data: that.$http.adornData(id)
        })
        .then(({ data }) => {
          if (data && data.code === 0) {
             this.bayonetData = [...data.data.list]
            this.dialogVisible = false
          } else {
            that.$message.error(data.msg);
          }
        });
      }
  },
};
</script>

<style lang="scss" scoped>
   /deep/ .el-dialog__title{
        font-size: 30px;
    }
    .addData{
        height: 500px;
        border: 1px solid #ccc;
        padding: 10px;
        box-sizing: border-box;
        .humanData{
          list-style: none;
          padding: 0;
          .oneHumanData{
            height: 40px;
            line-height: 40px;
            border-bottom: 1px solid #ccc;
          }
        }
    }
</style>