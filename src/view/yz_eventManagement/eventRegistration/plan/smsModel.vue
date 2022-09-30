<template>
  <div>
    <div class="contentWith">
      <div style="position: absolute;top: -10px;left: 20px;background-color: white;padding: 0 10px">收信人</div>
      <el-row>
        <el-col :span="16">
          <el-row style="padding: 0 20px">
            <el-row>
              <el-col :span="20">
                <el-input
                  clearable
                  placeholder="添加号码,多个用,分隔,回车确认"
                  v-model="addSmsInput">
                </el-input>
              </el-col>
              <el-col :span="4" style="text-align: center">
                <el-button type="primary" size="medium">查找</el-button>
              </el-col>
            </el-row>

            <el-row style="margin: 10px 0">
              <el-button type="primary" size="mini" class="el-icon-delete">移除</el-button>
              <el-button type="primary" size="mini" class="el-icon-brush">清除</el-button>
            </el-row>
          </el-row>

          <el-row>
            <el-scrollbar>
              <el-table
              height="250px"
              :data="smsTableData"
              border
              highlight-current-row
              style="width: 100%;margin: 10px 0;text-align:center;">

                <el-table-column
                  prop="nuber"
                  align="center"
                  label="联系人"
                  height="30"
                  show-overflow-tooltip
                  min-width="22%">
                </el-table-column>
                <el-table-column
                  prop="unit"
                  align="center"
                  label="单位"
                  height="30"
                  show-overflow-tooltip
                  min-width="26%">
                </el-table-column>
                <el-table-column
                  prop="wonti"
                  align="center"
                  label="职务"
                  height="30"
                  show-overflow-tooltip
                  min-width="26%">
                </el-table-column>
                <el-table-column
                  prop="phoneNumber"
                  align="center"
                  label="手机号码"
                  height="30"
                  show-overflow-tooltip
                  min-width="26%">
                </el-table-column>
            </el-table>
            </el-scrollbar>
            <div style="width: 100%;text-align: right;padding-right: 10px">已选择{{smsPeople}}人</div>
          </el-row>

        </el-col>
        <el-col :span="8" style="padding: 0 10px">
          <div>
            <el-input
              :maxlength=1000
              clearable
              type="textarea"
              :rows="2"
              placeholder="请输入短信内容"
              v-model="report"
              :autosize="{ minRows:13, maxRows:13}"
              resize="none"
              show-word-limit
            >
            </el-input>
          </div>

          <div class="bottomRow">
            <!-- bug12442 短信签名隐藏 -->
            <!-- <div class="leftSelect">
              <label class="export">签名:</label>
              <el-select size="mini" v-model="signature" filterable clearable placeholder="请选择" @blur="selectBlur">
                <el-option
                  v-for="item in signatureOptions"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value">
                </el-option>
              </el-select>
            </div> -->
            <div class="rightButton">
              <el-button type="primary" size="mini" @click="sendData">发送</el-button>
            </div>
          </div>
        </el-col>
      </el-row>

    </div>
  </div>
</template>

<script>
    export default {
        name: "smsModel",
        data(){
          return{
            addSmsInput:'',//添加号码
            smsTableData:[],//短信表格数据
            report:'',//短信内容
            signature:'',//签名选中
            signatureOptions: [], //签名
            // options:[
            //   {value:'办公室',label:'办公室'},
            //   {value:'财务室',label:'财务室'},
            //   {value:'总裁办',label:'总裁办'},
            // ],//签名数据
            smsPeople:0,//短信人数
          }
        },
        mounted(){
          this.getFindSmsSign() // 获取签名
        },
        methods:{
          //获取短信签名
          getFindSmsSign() {
            let data;
            this.$api.findSmsSign(data).then(res => {
              if (res.errorcode != 0) {
                this.$message.error(res.msg);
                return;
              }
              this.signatureOptions = res.data;
            });
          },
          sendData(){//发送

          },
          selectBlur(e) {
            this.signature = e.target.value
          },
        }
    }
</script>

<style scoped>
  .contentWith{
    border: 1px solid #ddd;
    border-radius: 5px;
    width: 100%;
    padding: 15px 0;
    position: relative;
  }
  .bottomRow{
    width: 100%;
    display: flex;
    height: 50px;
    align-items: center;
  }
  .leftSelect{
    flex:3;
    text-align: left;
    display: flex;
    align-items: center;
  }
  .rightButton{
    flex: 1;
    text-align: right;
  }
  .export{
    padding: 0 10px 0 0;
    color: #909399;
    vertical-align: middle;
    height: 30px;
    line-height: 30px;
    display: inline-block;
    white-space: nowrap;
    font-size: 14px;
  }
  .leftSelect >>>.el-input{
    width: 100%;
  }
</style>
