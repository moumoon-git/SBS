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
                  v-model="addSmsFaxInput">
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
                :data="smsFaxTableData"
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
                  label="传真号码"
                  height="30"
                  show-overflow-tooltip
                  min-width="26%">
                </el-table-column>
              </el-table>
            </el-scrollbar>
            <div style="width: 100%;text-align: right;padding-right: 10px">已选择{{faxPeople}}人</div>
          </el-row>

        </el-col>
        <el-col :span="8" style="padding: 0 10px">
          <el-row style="height: 130px">
            <el-col :span="6" class="faxNameKkp">
              <label>传真文件:</label>
            </el-col>
            <el-col :span="12">
              <div style="border: 1px solid #ddd;height: 120px;">
                <div class="uiLi">
                  <el-scrollbar>
                    <div class="divClassName" v-for="(item,index) in resDataList" :key="index"
                        >
                      <div style="flex: 8">{{item.filename}}</div>
                      <!--                    <div style="flex: 2" v-if="item.extension=='jpg'||item.extension=='pdf'"><el-button type="success" size="mini" @click="downloadList(item,index)">查看</el-button></div>-->
                      <div style="flex: 2" ><el-button type="primary" size="mini">下载</el-button></div>
                    </div>
                  </el-scrollbar>
                </div>

              </div>
            </el-col>
            <el-col :span="6">
              <div class="addKkp" >
                <el-upload
                  class="upload-demo"
                  ref="upload"
                  auto-upload
                  with-credentials
                  accept=".jpg,.jpeg,.png,.pdf,.ppt,.pptx,.doc,.docx,.txt,.xlsx,.xls"
                  :action="extendString"
                  :file-list="fileList"
                  :on-success="onSuccess"
                  :on-error="onError"
                  :before-upload="beforeUpload"
                  :data="withParameters"
                  :show-file-list="false"
                  :on-exceed="onExceed"
                >
                  <el-button type="primary" slot="trigger" size="mini">选择</el-button>
                </el-upload>
              </div>
            </el-col>
          </el-row>

          <el-row style="height: 130px">
            <el-col :span="6" class="faxNameKkp">
              <label>回执文件:</label>
            </el-col>
            <el-col :span="12">
              <div style="border: 1px solid #ddd;height: 120px;">
                <div class="uiLi">
                  <el-scrollbar>
                    <div class="divClassName" v-for="(item,index) in resDataList" :key="index"
                    >
                      <div style="flex: 8">{{item.filename}}</div>
                      <!--                    <div style="flex: 2" v-if="item.extension=='jpg'||item.extension=='pdf'"><el-button type="success" size="mini" @click="downloadList(item,index)">查看</el-button></div>-->
                      <div style="flex: 2" ><el-button type="primary" size="mini">下载</el-button></div>
                    </div>
                  </el-scrollbar>
                </div>

              </div>
            </el-col>
            <el-col :span="6">
              <div class="addKkp" >
                  <el-button type="primary" slot="trigger" size="mini">选择</el-button>
              </div>
              <div class="addKkp">
                <el-button type="primary" size="mini" >清除</el-button>
              </div>
            </el-col>
          </el-row>
          <el-row style="width: 100%;text-align: center;margin-top: 30px">
            <el-button type="primary"  size="small">发送</el-button>
          </el-row>
        </el-col>
      </el-row>

    </div>
  </div>
</template>

<script>
    export default {
        name: "faxModel",
        data(){
          return{
            addSmsFaxInput:'',//传真添加内容
            smsFaxTableData:[],//传真列表
            resDataList:[],//传真文件列表
            extendString:'',//传真上传的路劲
            fileList:[],//选中数据的数组
            uploadForm:[],
            withParameters:{
              eventId:sessionStorage.getItem('newID')
            },//默认上传时携带的参数
            faxPeople:0,//传真人数
          }
        },
        methods:{
          onSuccess(){//上传成功

          },
          onError(err){//文件提前上传失败
            console.log(err);
          },
          beforeUpload(file) {//利用假上传获取文件判断格式
            this.uploadForm.push(file)
            console.log(file)
            let testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
            const extension = testmsg === 'jpg'
            const extension2 = testmsg === 'jpeg'
            const extension3 = testmsg === 'png'
            const extension4 = testmsg === 'pdf'
            const extension5 = testmsg === 'ppt'
            const extension6 = testmsg === 'pptx'
            const extension7 = testmsg === 'doc'
            const extension8 = testmsg === 'docx'
            const extension9 = testmsg === 'txt'
            const extension10 = testmsg === 'xlsx'
            const extension11 = testmsg === 'xls'
            // const isLt2M = file.size / 1024 / 1024 < 10
            if(!extension && !extension2 && !extension3 && !extension4 && !extension5 && !extension6
              && !extension7 && !extension8 && !extension9 && !extension10 && !extension11) {
              this.$message({
                message: '请上传正确的文件格式',
                type: 'warning'
              });
            }
            // if(!isLt2M) {
            //     this.$message({
            //         message: '上传文件大小不能超过 10MB!',
            //         type: 'warning'
            //     });
            // }
            // return extension || extension2 && isLt2M
            return extension || extension2 || extension3|| extension4|| extension5|| extension6|| extension7|| extension8|| extension9|| extension10|| extension11
          },
          onExceed(){//文件超出限制
            this.$message({
              message: '请先删除已选择的文件再进行上传!',
              type: 'warning'
            });
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
  .addKkp{
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  .faxNameKkp{
    display:flex;
    align-items: center;
    height: 130px;
    font-weight: bold;
    font-size: 18px
  }
</style>
