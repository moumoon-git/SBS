<template>
  <div>
      <el-form>
        <el-col :span="16">
          <el-form-item style="display: flex;">
              <span style="display: flex">业务专题</span>
                <div>
                  <!--<el-button class="homePage" style="width: 100px;" type="primary" plain @click="homePageClick">首页</el-button>
                  <el-button class="largeScreen" style="width: 100px;" type="primary" plain @click="largeScreenClick">大屏</el-button>-->
                  <el-button class="homePage" style="width: 100px;color: #5b4b4b;" type="info" plain @click="homePageClick">首页</el-button>
                  <el-button class="largeScreen" style="width: 100px;color: #5b4b4b;" type="info" plain @click="largeScreenClick">大屏</el-button>

                  <el-cascader placeholder="业务资源"
                               style="margin-left: 20px"
                               :props="{ checkStrictly: true,value:'id',label:'sourceName',children:'children' }"
                               v-model="moduleValue"
                               :options="moduleListTree"
                               clearable
                               ref="node"
                               @change="selectCascader">

                  </el-cascader>
                </div>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item style="display: flex">
            <div style="margin-top: 30px">
              <el-button class="apiManager" style="width: 100px;color: #5b4b4b;display: inline-block" type="info" plain @click="computerClick">电脑端</el-button>
              <el-button class="apiManager" style="width: 100px;color: #5b4b4b;display: inline-block" type="info" plain @click="mobileClick">移动端</el-button>
              <el-button class="apiManager" style="width: 100px;color: #5b4b4b;display: inline-block" type="info" plain @click="apiManagerClick">接口管理</el-button>
            </div>
          </el-form-item>
        </el-col>


      </el-form>

      <!--接口管理-->
    <ApiManager ref="apiManager" v-if="apiManagerDisabled"></ApiManager>
  </div>
</template>

<script>
import $ from "jquery";
import ApiManager from '../components/ApiManager.vue'

export default {
  data() {
      return {

        //级联筢的模块值
        moduleValue: '',
        moduleCheckedNode: [],
        moduleListTree: [],


        //模块位置,如果是0，则可能是首页或者是大屏
        //如果是菜单id，则是业务模块
        modulePosition: [],
        moduleName: '',

        //接口管理
        apiManagerDisabled: false,

      }

    },
    components: {
      ApiManager
    },
    computed:{
      analysisModulePosition: {
        get () { return this.$store.state.analysis.analysisData.analysisModulePosition },
        set (val) { this.$store.commit('analysis/updateAnalysisModulePosition', val) }
      },
      analysisModuleName: {
        get () { return this.$store.state.analysis.analysisData.analysisModuleName },
        set (val) { this.$store.commit('analysis/updateAnalysisModuleName', val) }
      },
      modulePositionId: {
        get () { return this.$store.state.analysis.modulePositionId },
        set (val) { this.$store.commit('analysis/updateAnalysisModulePositionId', val) }
      }
    },
    created() {
      this.getModuleList();
    },
    mounted () {

    },
    methods: {
      getModuleList(){
        this.$http({
          url: this.$http.adornUrl(`/analysis/analysisSource/listTreeByType`),
          method: 'get',
          params: this.$http.adornParams({
            type: 3
          })
        }).then(({data}) => {
           if (data && data.code === 0) {
            // console.log('analysis/analysisSource/listTreeByType', data)
            //权限数据
            //this.moduleList = data.data;
            this.moduleListTree = data.data
          } else {
            this.$message.error(data.msg)
          }
          
        })
      },
      //某个节点的选取
      selectCascader(){
        // console.log("触发触发级联",this.moduleValue[this.moduleValue.length-1])
        //this.modulePositionId = this.moduleValue[this.moduleValue.length-1]
        this.$store.commit('analysis/updateAnalysisModulePositionId', this.moduleValue[this.moduleValue.length-1])
        var getCheckedNode =  this.$refs.node.getCheckedNodes(true);
        //console.log("获取到选中的节点", getCheckedNode)
        function findChilden (obj, list) {
          list.push(obj.id)
          let children = obj.children
          if (children != null) {
            children.forEach((item, index) => {
              findChilden(item, list)
            })
          }
        }
        if(getCheckedNode !=null && getCheckedNode[0].data != null){
          findChilden(getCheckedNode[0].data, this.modulePosition = [])
        }
        // console.log("获取到选中的节点id", this.modulePosition)
        this.analysisModulePosition = [];
        //this.analysisModulePosition.push(this.modulePosition)
        this.$store.commit('analysis/updateAnalysisModulePosition', this.modulePosition)
        this.$store.commit('analysis/updateAnalysisModuleName', "other")
        //this.analysisModuleName = "other";

        $('.largeScreen').removeClass('mouduleSelect')
        $('.homePage').removeClass('mouduleSelect')

      },

      //大屏点击
      largeScreenClick(){
        this.analysisModulePosition = [];
        this.$store.commit('analysis/updateAnalysisModulePosition', [10])
        //this.analysisModulePosition.push([10]);
        //this.modulePositionId = 10;
        this.$store.commit('analysis/updateAnalysisModulePositionId', 10)
        this.$store.commit('analysis/updateAnalysisModuleName', "largeScreen")
        //this.analysisModuleName = "largeScreen";
        $('.homePage').removeClass('mouduleSelect')
        $('.largeScreen').addClass('mouduleSelect')
      },

      //首页点击
      homePageClick(){
        this.analysisModulePosition = [];
        this.$store.commit('analysis/updateAnalysisModulePosition', [11])
        //this.analysisModulePosition.push([11]);
        //this.modulePositionId = 11;
        this.$store.commit('analysis/updateAnalysisModulePositionId', 11)
        this.$store.commit('analysis/updateAnalysisModuleName', "homePage")
        //this.analysisModuleName = "homePage";
        $('.largeScreen').removeClass('mouduleSelect')
        $('.homePage').addClass('mouduleSelect')
        //this.$emit('homePageClick', this.modulePosition, this.moduleName)
      },

      //电脑点击
      computerClick(){
        this.$message({
          message: '紧急开发中....',
          type: 'warning'
        });
      },

      //移动端点击
      mobileClick(){
        this.$message({
          message: '紧急开发中....',
          type: 'warning'
        });
      },

      //接口管理弹窗
      apiManagerClick(){
        this.apiManagerDisabled = true;
        this.$nextTick(() => {
          this.$refs.apiManager.init()
        });
      }


    },

};
</script>
<style lang="scss">
  .mouduleSelect{
    color: #ffffff !important;
    border-color: #2196F3 !important;
    background-color:#03a9f4 !important;
  }
</style>
