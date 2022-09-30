<template>
  <!-- 左边表单 -->
  <div class="tikuShowOrUpdate">
    <el-row :gutter="20">
      <div class="info">
        <template>
          <!-- <div style="marginLeft:118px;fontSize:15px;marginBottom: 10px;"> -->
          <!-- <div style="padding:20px 5px;margin-bottom: 20px;">
            <el-col :span="6">
              <span style="margin:5px;color:#333;float:right">申请人</span>
            </el-col>
            <el-col :span="9">
              <el-select style="marginLeft:9px" v-model="applyPersonOptionsId" placeholder="请选择">
                <el-option
                  v-for="(item,index) in applyPersonOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-col>
          </div>-->
          <div
            v-for="(item,index) in questionList"
            :key="`question${index}`"
            style="padding:20px 5px;margin-bottom: 20px;"
          >
            <el-col :span="6">
              <span style="margin:5px;color:#333;float:right">
                <!-- <span v-if="item.isAnswer=='1'" style="color:red;margin-right:5px;">*</span> -->
                {{item.title}}
              </span>
            </el-col>
            <el-col :span="16">
              <template v-if="item.topicName==='单选题'">
                <el-radio-group v-model="item.answer">
                  <!-- item.answer?parseInt(item.answer):[] -->
                  <span
                    v-for="v in item.approveSelectList"
                    style="margin-right: 30px;"
                    :key="`danxuan${v.id}`"
                  >
                    <el-radio :label="v.id">
                      {{v.content}}
                      <input
                        v-if="v.ifInput==='1' && item.answer==v.id"
                        type="text"
                        class="content"
                        v-model="item.remark"
                      />
                    </el-radio>
                  </span>
                </el-radio-group>
              </template>
              <template v-if="item.topicName==='混答+多选'">
                <el-checkbox-group v-model="item.answer">
                  <!-- item.answer?item.answer.substring(0,item.answer.indexOf('#')).split(',').map(item => {  return +item;  }):[] -->
                  <span
                    v-for="v in item.approveSelectList"
                    style="margin-right: 20px;"
                    :key="`hundaduoxuan${v.id}`"
                  >
                    <el-checkbox :label="v.id" :key="`hundaduoxuan2${v.id}`">
                      {{v.content}}
                      <!-- item.answer?item.answer.substring(item.answer.indexOf('#')+2,item.answer.length).split(','):'' -->
                      <input
                        v-if="v.ifInput==='1' && item.answer==v.id"
                        v-model="item.remark"
                        type="text"
                        class="content"
                      />
                    </el-checkbox>
                  </span>
                </el-checkbox-group>
              </template>
              <template v-if="item.topicName==='多选题'">
                <el-checkbox-group v-model="item.answer">
                  <!-- item.answer?item.answer.substring(0,item.answer.indexOf('#')).split(',').map(item => {  return +item;  }):[] -->
                  <span
                    v-for="v in item.approveSelectList"
                    style="margin-right: 20px;"
                    :key="`duoxuan${v.id}`"
                  >
                    <el-checkbox :label="v.id" :key="`duoxuan2${v.id}`">
                      {{v.content}}
                      <!-- item.answer?item.answer.substring(item.answer.indexOf('#')+2,item.answer.length).split(','):'' -->
                      <!-- <input
                                  v-if="v.ifInput==='1' && item.answer==v.id"
                                  v-model="item.remark"
                                  type="text"
                                  class="content"
                      />-->
                    </el-checkbox>
                  </span>
                </el-checkbox-group>
              </template>
              <template v-if="item.topicName==='混答+单选'">
                <el-radio-group v-model="item.answer">
                  <!-- item.answer?parseInt(item.answer.split('##')[0]):[] -->
                  <span
                    v-for="v in item.approveSelectList"
                    :key="`hundadanxuan${v.id}`"
                    style="margin-right: 30px;"
                  >
                    <el-radio :label="v.id">
                      {{v.content}}
                      <!-- item.answer?item.answer.split('##')[1]:'' -->
                      <input
                        v-if="v.ifInput==='1' && item.answer==v.id"
                        v-model="item.remark"
                        type="text"
                        class="content"
                      />
                    </el-radio>
                  </span>
                </el-radio-group>
              </template>
              <template v-if="item.topicName==='简答-输入'">
                <input type="text" class="content" v-model="item.answer" />
              </template>
              <template v-if="item.topicName==='简答-文本'">
                <el-input type="textarea" style="width:450px" resize="none" v-model="item.answer"></el-input>
              </template>
              <!-- <template v-if="item.topicName==='图片'">
                <el-upload
                  action="https://jsonplaceholder.typicode.com/posts/"
                  list-type="picture-card"
                  :on-remove="function(res){return handleRemove(res,index)}"
                  :before-upload="beforeUpload"
                  :http-request="function(file){return beforeAvatarUpload(file,index)}"
                  :limit="2"
                  :file-list="item.answer"
                  :on-exceed="overFile"
                  multiple
                >
                  <i class="el-icon-plus" style="line-height:5"></i>
                </el-upload>
              </template>-->
            </el-col>
          </div>
        </template>
        <div></div>
      </div>
    </el-row>
  </div>
</template>


<script>
export default {
  props: ["questionList"],
  components: {},
  data() {
    return {};
  },
  methods: {},
  created() {},
};
</script>


<style lang="less">
.tikuShowOrUpdate {
  flex: 1;
  margin: 20px;

  .info {
    font-size: 14px;
    padding: 20px;
    background-color: white;
    .portrait {
      width: 120px;
      height: 200px;
      border-radius: 10px;
    }
    .example {
      color: #c0c0c0;
    }
  }
}
</style>