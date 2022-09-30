<template>
  <div>
    <el-row>
      <el-col :sm="{span: 10}"
              :xs="{span: 10}"
              :md="{span: 10}"
              :lg="{span:7}"
              :xl="{span: 7}"
              class="cardContent" v-for="(items,key) in plateData" :key="items.key">
        <div>
          <el-card shadow="hover" class="hoverPlan">
            <div v-if="items.importance== 217 " class="common">一般</div>
            <div v-else-if="items.importance== 219 " class="matter">紧急</div>
            <div v-else class="common">暂无</div>
            <div class="namePlan">
              <i @click="show(items)" class="el-icon-user-solid"></i>
              <span>{{items.name}}</span>
            </div>
            <div>
              <i class="el-icon-phone"></i><span>手机：</span>
              <el-select class="select"   size="mini" v-model="mobileNumber[key]"  :placeholder="defaultDisplay(items.mobileList)">
              <el-option
                v-for="(t,k) in items.mobileList"
                :key="k"
                :label="t.labels"
                :value="t.labels"
                @click.native="phoneChange(items.name,items.id,mobileNumber[key])">
              </el-option>
              </el-select>
              <br>
                <br>
                <i class="el-icon-service"></i><span>电话：</span>
                <el-select class="select"  size="mini" v-model="telNumber[key]" :placeholder="defaultDisplay(items.TelList)">
                  <el-option
                    v-for="(t,k) in items.TelList"
                    :key="k"
                    :label="t.labels"
                    :value="t.labels"
                    @click.native="phoneChange(items.name,items.id,telNumber[key])">
                  </el-option>
                </el-select>
            </div>
            <div class="position"><span class="el-icon-s-help"></span><span>职位：</span><span>{{items.position}}</span> </div>
            <div>
<!--              <el-button type="primary" size="small" @click="sumb(items,key)">拨号</el-button>-->
            </div>
          </el-card>
        </div>

      </el-col>
    </el-row>
  </div>
</template>

<script>
    export default {
        props:['plateData'],
        name: "namePlate",
        data(){
          return{
            mobileNumber:[],
            telNumber:[],
          }
        },

      methods:{
        /*下拉框有数据时默认展示第一条，否则提示无数据*/
        defaultDisplay(items){
          if(items.length != 0){
            return items[0].labels;
          }else{
            return '无数据'
          }
        },
        show(items){
          console.log(items)
             this.$emit("show",items)
          },
        phoneChange(name,id,phoneNumber){
          //console.log(phoneNumber,this.mobileNumber);
          this.$emit("phoneChange",name,id,phoneNumber);
        },
         resetModel(){
          this.mobileNumber = [];
          this.telNumber = [];
         }

      },
    }
</script>

<style scoped>
  .cardContent{
    margin:10px;
    text-align: left;
  }
  .hoverPlan{
    position: relative;
  }
  .matter,.common{
    padding: 5px 10px;
    position: absolute;
    font-size:12px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(255,255,255,1);
    right: 0;
    top: 0;
  }
  .matter{
    background-color: red;
  }
  .common{
    background-color: #00a854;
  }
  .namePlan{
    height: 50px;
    line-height: 30px;
  }
  .select{
    width: 150px;
  }
  .position{
    padding: 20px 0;
  }
</style>
