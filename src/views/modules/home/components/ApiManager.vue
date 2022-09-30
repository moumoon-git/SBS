<template>
<div>
  <el-dialog title="添加接口"  :visible.sync="dialogTableVisible" width="40%">
    <div class="apiManager">
      <el-form ref="form"  label-width="100px">

          <el-form-item label="接口名称">
            <el-input v-model="apiName"></el-input>
          </el-form-item>

          <el-form-item label="接口路径">
            <el-input v-model="apiUrl" placeholder='请以英文格式填写,如 /test/test/getTest'></el-input>
          </el-form-item>

          <el-form-item label="接口参数">
            <el-input :rows="3" type="textarea" v-model="apiParams" placeholder='请以英文格式填写,如 {"type":1,"name":"car"}'></el-input>
          </el-form-item>

          <el-form-item label="请求方法">
            <el-select v-model="apiRquestMethod" placeholder="请选择请求方法" style="right: 34%;">
              <el-option value="1" label="get"></el-option>
              <el-option value="2" label="post"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="图表类型">
            <el-select v-model="apiEchartType" placeholder="请选择图表类型" style="right: 34%;">
              <el-option value="114" label="面积饼状图"></el-option>
              <el-option value="115" label="圆形饼状图"></el-option>
              <el-option value="116" label="双线趋势图"></el-option>
              <el-option value="117" label="单线趋势图"></el-option>
              <el-option value="118" label="横向柱状图"></el-option>
              <el-option value="119" label="坚向柱状图"></el-option>
              <el-option value="120" label="表格"></el-option>
              <el-option value="121" label="总数圆圈"></el-option>
              <el-option value="122" label="总数面板"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="业务资源">
            <el-cascader style="right: 34%;"
                         placeholder="请选择业务资源"
                         :props="{ value:'id',label:'sourceName',children:'children' }"
                         v-model="moduleValue"
                         :options="moduleListTree"
                         clearable
                         ref="node"
                         @change="selectApiCascader">

            </el-cascader>
          </el-form-item>

          <el-form-item label="资源指标">
            <el-select v-model="apiSourceFlag" placeholder="请选择资源指标" style="right: 34%;">
              <el-option value="131" label="总数"></el-option>
              <el-option value="132" label="占比"></el-option>
              <el-option value="133" label="趋势"></el-option>
              <el-option value="134" label="表格"></el-option>
            </el-select>
          </el-form-item>

      </el-form>
    </div>

    <!--<el-button type="text">高级选项</el-button>-->
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogTableVisible = false">取消</el-button>
      <el-button @click="submitApi" type="primary">确定</el-button>
    </div>

  </el-dialog>
</div>
</template>
<script>

export default {
  data() {
    return {
      dialogTableVisible: '',
      apiName: '',
      apiUrl: '',
      apiParams: '', //参数
      apiRquestMethod: '', //请求方法
      apiEchartType: '', //ehcart请求类型
      apiSourceId: '', //资源模块id
      apiSourceFlag: '', //资源指标

      moduleListTree: [],
      moduleValue: [],


    };
  },

  created() {

  },
  mounted(){
    this.getModuleList()
  },

  methods: {

    init(){
      this.dialogTableVisible = true;
    },

    getModuleList(){
      this.$http({
        url: this.$http.adornUrl(`/analysis/analysisSource/listTreeByType`),
        method: 'get',
        params: this.$http.adornParams({
          type: 3
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
            this.moduleListTree = data.data
        } else {
          that.$message.error(data.msg)
        }
        
      })
    },
    //某个节点的选取
    selectApiCascader(){
      this.apiSourceId = this.moduleValue[this.moduleValue.length-1]
    },
    //保存
    submitApi(){
      if(this.apiName == '' || this.apiUrl == '' || this.apiEchartType == '' || this.requestWay == '' || this.apiSourceId == '' || this.apiSourceFlag == ''){
        this.$message({
          showClose: true,
          message: '请填写完整',
          type: 'warning'
        });

        return;
      }

      let analysisApi ={
        name: this.apiName.trim(),
        url: this.apiUrl.trim(),
        params: this.apiParams.trim(),
        echartType: this.apiEchartType,
        requestWay: this.requestWay,
        sourceId: this.apiSourceId,
        sourceFlag: this.apiSourceFlag,
      }

      this.$http({
        url: this.$http.adornUrl(`/analysis/analysisApi/save`),
        method: 'post',
        data: this.$http.adornData(
          analysisApi
        )
      }).then(({data}) => {
        if (data && data.code === 0) {
              // console.log("保存",data)
              this.$message({
                showClose: true,
                message: '添加成功',
                type: 'success'
              });
            } else {
              that.$message.error(data.msg)
            }
        this.dialogTableVisible = false;
      })

    }


  },

};
</script>
<style lang="scss">

</style>
