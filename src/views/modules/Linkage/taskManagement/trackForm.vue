<template>
    <div>
        <el-dialog
      title="排查登记表"
      :visible.sync="centerDialogVisible"
      width="600px"
      center
      >
      <div style="display:flex;justify-content:space-between;margin-bottom:20px;">
        <div>登记人：{{registraData.registerName}}</div>
        <div>登记时间：{{registraData.gmtCreate}}</div>
      </div>

      <div style="backgroundColor:#f0f0f0;padding: 20px;margin-bottom:20px;">
        <p style="text-align:center">登记信息</p>
        <div v-for="(item,index) in registraInfo" :key="index">
          <div style="display:flex;"><p style="width:20px;">{{index+1}}.</p><p>{{item.title}}</p></div>
          <template v-if="item.topicName === '单选题'">
            <div v-for="one in item.answer.indexOf(',')>-1?item.answer.split(','):[item.answer]" :key="one.id">
              <div v-for="v in item.epiSelectEntityList" :key="v.id">
                <p v-if="one == v.id">{{v.content}}</p>
              </div>
            </div>
          </template>
          <template v-if="item.topicName === '混答+多选'">
              <div v-for="one in item.answer.indexOf(',')>-1?item.answer.slice(0,item.answer.indexOf('#')).split(','):[item.answer.slice(0,item.answer.indexOf('#'))]" :key="one.id">
                <div v-for="v in item.epiSelectEntityList" :key="v.id">
                  <p v-if="one == v.id && v.ifInput=='1'">{{item.answer.slice(item.answer.indexOf('#')+2,item.answer.length)}}</p>
                  <p v-else-if="one == v.id">{{v.content}}</p>
                </div>
              </div>
            <!-- <p v-if="item.answer.indexOf('#')>-1">{{item.answer.slice(item.answer.indexOf('#')+2,item.answer.length)}}</p> -->
          </template>
          <template v-if="item.topicName === '混答+单选'">
            <div v-for="v in item.epiSelectEntityList" :key="v.id">
              <p v-if="item.answer.indexOf('#')>-1?item.answer.slice(0,item.answer.indexOf('#')):item.answer == v.id">{{v.content}}{{item.answer.indexOf('#')>-1?','+item.answer.slice(item.answer.indexOf('#')+2,item.answer.length):""}}</p>
            </div>
          </template>
        </div>
        <!-- <p>1.您和您的家人身体状况</p>
        <p>自觉正常</p>
        <p>2.体温检测</p>
        <p>36.8度</p>
        <p>3.您和您最近是否有外出</p>
        <p>否</p>
        <p>4.最近是否有亲友来访，尤其湖北或武汉亲友</p>
        <p>否</p>
        <p>5.您或您的家人是否已复工</p>
        <p>否</p> -->
      </div>

      <div style="backgroundColor:#f0f0f0;padding: 20px;">
        <p style="text-align:center">登记情况</p>
        <p>登记结果：{{registraData.investigateResultString}}</p>
        <div style="display:flex;">
          <p style="width:145px">备注信息：</p>
          <p>{{registraData.remark}}</p>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="trackFDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="trackFDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                trackFDialogVisible: false, //跟踪试图
                trackData: [],//跟踪表
                registraInfo: [],//跟踪信息
            }
        },
        methods: {
            init(taskId,id) {
                this.trackFDialogVisible = true

                this.$http({
                    url: this.$http.adornUrl(`/task/taskRegisterHistory/getOneAndLink`),
                    method: "get",
                    params: this.$http.adornParams({ 
                        id,
                        taskId,
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                    // console.log(data)
                    this.trackData = data.data
                    this.trackInfo = data.data.epiRegisterTikuEntity.epiQuestionEntityList
                    } else {
                    this.trackData = []
                    this.$message.error(data.msg);
                    }
                });
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>