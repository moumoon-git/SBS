<template>
  <div>
    <el-dialog title="收货地址" :visible.sync="dialogFormVisible" width="800px" >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="140px"
        class="demo-ruleForm"
      >
        <el-form-item label="项目ID">
          <el-input type="number" v-model="ruleForm.projectId" clearable></el-input>
        </el-form-item>
        <el-form-item label="作业名称" prop="taskName">
          <el-input v-model="ruleForm.taskName" clearable></el-input>
        </el-form-item>
        <el-form-item label="作业描述" prop="description">
          <el-input v-model="ruleForm.description" clearable></el-input>
        </el-form-item>

        <el-form-item label="功能版本" prop="serviceVersion">
          <el-input v-model="ruleForm.serviceVersion" readonly></el-input>
        </el-form-item>

        <el-form-item v-model="ruleForm.serviceConfig" label="服务器算法配置">
          <ul class="serviceConfig">
            <li class="common">
              <p class="commonTitle">通用算法配置</p>
              <ul>
                <li class="mulInputParameter">
                  <p class="mulInputParameterTitle">多路输入</p>
                  <el-form
                    :model="ruleForm.serviceConfig.common.mulInputParameter"
                    :rules="rules"
                    ref="ruleForm"
                    label-width="110px"
                    style="padding: 10px;"
                  >
                    <el-form-item label="索引列表" prop style="padding-bottom:5px;">
                      <el-input
                        v-model="ruleForm.serviceConfig.common.mulInputParameter.inputIndex"
                        style="width:300px;"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="采样时间间隔" prop style="padding-bottom:5px">
                      <el-input
                        v-model="ruleForm.serviceConfig.common.mulInputParameter[0].samplingTimeInterval"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="报警阙值" prop style="padding-bottom:5px">
                      <el-input
                        v-model="ruleForm.serviceConfig.common.mulInputParameter[0].alarmThreshold"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="图片压缩比" prop style="padding-bottom:5px">
                      <el-input
                        v-model="ruleForm.serviceConfig.common.mulInputParameter[0].sendOriImgCompressionRatio"
                      ></el-input>
                    </el-form-item>
                  </el-form>
                </li>
              </ul>
            </li>
          </ul>
        </el-form-item>

        <el-form-item label="视频数据输入类型" prop>
          <el-select v-model="ruleForm.input.type" placeholder="请选择输入类型">
            <el-option label="obs" value="obs"></el-option>
            <el-option label="url" value="url"></el-option>
            <el-option label="edgecamera" value="edgecamera"></el-option>
            <el-option label="vis" value="vis"></el-option>
            <el-option label="edgerestful" value="edgerestful"></el-option>
          </el-select>

          <el-button type="primary" v-if="ruleForm.input.type === 'edgecamera'" @click="getCameras">获取相机</el-button>
        </el-form-item>

        <div style="display:flex;align-items: center;margin-bottom:10px;">
          <p style="margin-right:5px;">视频数据输入内容</p>
          <div style="border:1px solid #ccc;padding: 10px;">
            <!-- <el-form
              :model="ruleForm.input.data"
              :rules="rules"
              ref="ruleForm"
              label-width="110px"
              style="padding: 10px;"
            > -->
              <el-form-item
                label="OBS桶名称"
                prop
                style="padding-bottom:5px;"
                v-if="ruleForm.input.type === 'obs'"
                
              >
                <el-input></el-input>
              </el-form-item>
              <el-form-item
                label="OBS桶内的路径"
                prop
                style="padding-bottom:5px"
                v-if="ruleForm.input.type === 'obs'"
              >
                <el-input></el-input>
              </el-form-item>

              <el-form-item
                label="边缘摄像头ID"
                style="padding-bottom:5px"
                v-if="ruleForm.input.type === 'edgecamera'"
              >
                <el-input v-model="ruleForm.edgeCameraId"></el-input>
              </el-form-item>

              <el-form-item
                label="视频流名称"
                prop
                style="padding-bottom:5px;"
                v-if="ruleForm.input.type === 'vis'"
              >
                <el-input></el-input>
              </el-form-item>

              <el-form-item
                label="边缘节点id"
                prop
                style="padding-bottom:5px;"
                v-if="ruleForm.input.type === 'edgerestful'"
              >
                <el-input></el-input>
              </el-form-item>

              <el-form-item
                label="rest请求路径"
                prop
                style="padding-bottom:5px;"
                v-if="ruleForm.input.type === 'edgerestful' || ruleForm.input.type === 'url'"
              >
                <el-input></el-input>
              </el-form-item>

              <el-form-item
                label="输入校验"
                prop
                style="padding-bottom:5px"
                v-if="ruleForm.input.type === 'edgerestful'"
              >
                <el-input></el-input>
              </el-form-item>

              <el-form-item
                label="流地址的路径"
                prop
                style="padding-bottom:5px;"
                v-if="ruleForm.input.type === 'edgerestful'"
              >
                <el-input></el-input>
              </el-form-item>

              <el-form-item label="输入序号" prop style="padding-bottom:5px">
                <el-input style="width:481px;" readonly :value="indexCodes"></el-input>
              </el-form-item>
            <!-- </el-form> -->
          </div>
        </div>

        <div style="display:flex;align-items: center;margin-bottom:10px;">
          <p style="margin-right:5px;">视频数据输出内容</p>
          <div style="border:1px solid #ccc;">
            <el-form
              :model="ruleForm.output.webhook"
              :rules="rules"
              ref="ruleForm"
              label-width="120px"
              style="padding: 10px;"
            >
              <el-form-item label="输出URL地址" prop="url" style="padding-bottom:5px;">
                <el-input v-model="ruleForm.output.webhook.url" style="width:500px;"></el-input>
              </el-form-item>

              <div>请求头参数设置</div>
              <el-form-item label="X-HW-ID" prop='XHWID' style="padding-bottom:5px">
                <el-input v-model="ruleForm.output.webhook.headers['X-HW-ID']"></el-input>
              </el-form-item>

              <el-form-item label="X-HW-APPKEY" prop="XHWAPPKEY" style="padding-bottom:5px;">
                <el-input v-model="ruleForm.output.webhook.headers['X-HW-APPKEY']"></el-input>
              </el-form-item>

              <el-form-item label="Content-Type" prop="ContentType" style="padding-bottom:5px;">
                <el-input v-model="ruleForm.output.webhook.headers['Content-Type']"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 获取相机列表 -->
    <el-dialog title="相机列表" :visible.sync="cameraListVisible" width="400px" @close="closeDialog">
        <el-input v-model="search" placeholder="输入相机名称" @keyup.enter.native="onSearch">
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="onSearch"
            style="padding: 12px 12px;"
          ></el-button>
        </el-input>
        <div class="candidate">
          <el-checkbox-group v-model="nameList">
            <div v-for="person in personList"
                :key="person.id"
                style="padding-left: 10px;"
            >
              <el-checkbox
                :label="person"
                style="text-align: left;"
              >{{ person.name }}</el-checkbox>
            </div>
          </el-checkbox-group>
          <el-pagination
            small
            @current-change="handleCurrentChange"
            :page-size="pageSize"
            :current-page="currentPage"
            layout="total, prev, pager, next"
            :total="total"
          ></el-pagination>
        </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogFormVisible: false,
      ruleForm: {
        projectId: "",
        taskName: "",
        description: "",
        edgeCameraId: 0,//所有边缘相机Id
        index: '',//所有输入序号
        input: {
          data: [],
          type: "edgecamera"
        },
        output: {
          webhook: {
            url: "",
            headers: {
              'Content-Type': '',
              'X-HW-APPKEY': '',
              'X-HW-ID': '',
            }
          }
        },
        serviceConfig: {
          common: {
            mulInputParameter: [{
              inputIndex: [0],
              samplingTimeInterval: 5000,
              alarmThreshold: 50,
              sendOriImgCompressionRatio: 90
            }]
          }
        },
        serviceVersion: "1.0",
      },
      rules: {
        taskName: [
          { required: true, message: "请输入任务名称", trigger: "blur" },
          {
            pattern: /^[a-zA-Z0-9-_]{1,100}$/g,
            min: 1,
            max: 100,
            message:
              "格式应为字母（a～zA～Z）、数字（0～9）、中划线（-）、下划线（_）组成，长度范围为[1，100]。",
            trigger: "blur"
          }
        ],
        description: [
          { max: 500, message: "长度范围为[0，500]。", trigger: "blur" }
        ],
        url: [
          { required: true, message: "此处不能为空", trigger: "blur" }
        ],
        XHWID: [
          { required: true, message: "此处不能为空", trigger: "blur" }
        ],
        XHWAPPKEY: [
          { required: true, message: "此处不能为空", trigger: "blur" }
        ],
        ContentType: [
          { required: true, message: "此处不能为空", trigger: "blur" }
        ],
      },

      cameraListVisible: false,//相机列表试图
      search: '',//搜索内容
      total: 0, // 总条数
      currentPage: 1, // 当前页
      pageSize: 10, // 每页显示的条数
      nameList: [],//选中的相机
      personList: '',//所有相机列表,
      
      ids: '',//所有Id
      indexCodes: '',//所有索引码

    };
  },
  watch:{
    personList(newV,oldV){
      // console.log(newV)
    }
  },
  methods: {
    init(){
        this.dialogFormVisible = true;
        this.getList()
    },
    submitForm(formName) {
      // console.log(this.ruleForm.serviceConfig.common.mulInputParameter.samplingTimeInterval)
      var that = this;
      that.$refs[formName].validate(valid => {
        if (valid) {
          that
            .$http({
              url: that.$http.adornUrl(`/vcm/vcmCrowdcountTask/save`),
              method: "post",
              data: this.$http.adornData({
                projectId: this.ruleForm.projectId,
                taskName: this.ruleForm.taskName,
                description: this.ruleForm.description,
                input: JSON.stringify(this.ruleForm.input),
                serviceVersion: this.ruleForm.serviceVersion,
                output: JSON.stringify(this.ruleForm.output),
                serviceConfig: JSON.stringify(this.ruleForm.serviceConfig),
              })
              // data: that.$http.adornData(id)
            })
            .then(({ data }) => {
              if (data && data.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '添加成功',
                    duration: 1000,
                    onClose: () => {
                      this.dialogFormVisible = false
                      this.$refs.ruleForm.resetFields()
                    }
                  })
              } else {
                that.$message.error(data.msg);
              }
            });
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 初始化相机数据
    getCameras(){
      this.cameraListVisible = true

      // this.getList()
    },

    // 获取所有相机列表
    getList() {
      
      this.$http({
        url: this.$http.adornUrl("/vcm/vcmBayonetInfo/selectCamera"),
        method: "get",
        params: this.$http.adornParams({
          name: this.search,
          limit: this.pageSize,
          page: this.currentPage
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // 详细联系人列表
          this.personList = data.data.list;
          this.total = data.data.totalCount;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 当前页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    // 搜索结果
    onSearch() {
      this.currentPage = 1;
      this.getList();
    },
    // 关闭相机弹窗
    closeDialog(){
      this.ruleForm.data = []

      if (this.nameList.length>0) {
         this.nameList.map(v=>{
          this.ruleForm.input.data.push({id:v.indexCode,index:this.ruleForm.edgeCameraId})
          this.ids += this.ruleForm.edgeCameraId+', '
          this.indexCodes += v.indexCode + ', '
        })
      }
      this.ids = this.ids.slice(0,this.ids.length-2)
      this.indexCodes = this.indexCodes.slice(0,this.indexCodes.length-2)
    }
  }
};
</script>

<style lang="scss" scoped>
ul {
  padding: 0;
}
p {
  margin: 0;
}
.serviceConfig {
  list-style: none;
  border: 1px solid #ccc;
  li {
    //   border-bottom:1px solid #ccc;
    &:last-child() {
      border: none;
    }
  }
  .common {
    height: 184px;
    line-height: 164px;
    display: flex;
    .commonTitle {
      height: 100%;
      padding: 0 10px;
      border-right: 1px solid #ccc;
    }
    .mulInputParameter {
      height: 184px;
      line-height: 164px;
      padding: 0 10px;
      list-style: none;
      display: flex;
    }
    .mulInputParameterTitle {
      width: 90px;
      height: 100%;
      padding: 0 10px;
      border-right: 1px solid #ccc;
    }
  }
}

.candidate {
  height: 500px;
  border-radius: 5px;
  padding-top: 10px;
  border: 1px solid #ccc;
  background-color: #fff;
  color: #303133;
  margin-top: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}


</style>