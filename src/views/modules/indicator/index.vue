<template>
  <el-row :gutter="20">
    <el-col :span="24">
        <el-form ref="dynamicValidateForm" style="border: 1px solid #000000;padding: 30px;">

          <el-row :gutter="20">
            <el-form-item>
              <el-col :span="6">
                <el-select @change="selectVisualizionTown" v-model="visualizionTownId" placeholder="请选择地区">
                  <el-option
                    v-for="item in visualizionTownList"
                    :key="item.id"
                    :label="item.townName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-col>

              <el-col :span="6">
                <div>
                  <el-select @change="selectModule" v-model="visualizionModuleId" placeholder="模块选择">
                    <el-option
                      v-for="item in visualizionModuleList"
                      :key="item.id"
                      :label="item.indicatorName.substring(0,10)"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
              </el-col>

            </el-form-item>
          </el-row>

          <el-form-item>
            <div>
              <!--<span>模块名称</span>-->
              <el-input
                style="width: 95%"
                type="textarea"
                :rows="3"
                placeholder="模块名称"
                v-model="visualizionModuleName"
                clearable>
              </el-input>
            </div>
          </el-form-item>

          <div v-if="visualizionModuleArray.indexOf(visualizionModuleType) != -1">
            <el-row :gutter="20">
              <el-col :span="10">
                <el-form ref="dynamicValidateForm2">

                  <el-form-item>
                    <el-button @click="addTimeDomain">新增</el-button>
                    <el-button type="primary" @click="saveTimeDomain" :disabled="saveTimeKeyValueIsdisabled">保存</el-button>
                  </el-form-item>

                  <el-form-item
                    v-for="(domain, index) in indicatorTimeValue"
                    :key="domain.key"
                  >


                    <el-input v-model="domain.timeName" style="width: 50%"
                              @change="changeTimeSearchButton(domain)"
                              @focus.prevent="clickTimeSearchButton(domain)">
                      <el-button slot="prepend" icon="el-icon-delete" @click.prevent="removeTimeDomain(domain)"></el-button>
                    </el-input>

                    <el-input-number size="small"
                                     @change="changeTimeSearchButton(domain)"
                                     @focus.prevent="clickTimeSearchButton(domain)"
                                     v-model="domain.orderNum" style="width: 40%"></el-input-number>

                  </el-form-item>
                </el-form>
              </el-col>

              <el-col :span="14">
                <el-form ref="dynamicValidateForm3">
                  <el-form-item>
                    <el-button @click="addKeyValueDomain" :disabled="addTimeKeyValueIsdisabled">新增健值</el-button>
                    <!--<el-button @click="saveKeyValueDomain" :disabled="saveTimeKeyValueIsdisabled">保存健值</el-button>-->
                  </el-form-item>

                  <el-form-item
                    v-for="(domain, index) in indicatorTimeKeyValue"
                    :key="domain.key"
                  >
                    <el-row>

                      <el-col :span="10">
                        <div>
                          <span>字段名</span><el-input v-model="domain.name" style="width: 70%"></el-input>
                        </div>
                      </el-col>

                      <el-col :span="10">
                        <div>
                          <span>字段值</span><el-input v-model="domain.value" style="width: 70%"></el-input>
                        </div>
                      </el-col>

                      <!--<el-col :span="2">
                        <el-button @click.prevent="removeKeyValueDomain(domain)">编辑</el-button>
                      </el-col>-->

                      <el-col :span="2">
                        <el-button @click.prevent="removeKeyValueDomain(domain)">删除</el-button>
                      </el-col>

                    </el-row>

                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </div>

          <div v-else>
            <el-form-item>
              <el-button @click="addDomain">新增</el-button>
              <el-button type="primary" @click="submitForm()">保存</el-button>
            </el-form-item>

            <el-form-item
              v-for="(domain, index) in indicatorValue"
              :key="domain.key"
            >
              <el-row>

                <el-col :span="8">
                  <div>
                    <span>字段名</span><el-input v-model="domain.name" style="width: 70%"></el-input>
                  </div>
                </el-col>

                <el-col :span="8">
                  <div>
                    <span>字段值</span><el-input v-model="domain.value" style="width: 70%"></el-input>
                  </div>
                </el-col>

                <el-col :span="6">
                  <div>
                    <el-input-number size="small" v-model="domain.orderNum" style="width: 80%"></el-input-number>
                  </div>
                </el-col>

                <el-col :span="2">
                  <el-button @click.prevent="removeDomain(domain)">删除</el-button>
                </el-col>

              </el-row>

            </el-form-item>
          </div>

        </el-form>
    </el-col>

    <!--<el-col :span="12"  style="border: 1px solid #000000;padding: 15px;">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form ref="dynamicValidateForm2">
            <el-form-item>
              <el-button @click="addTimeDomain">新增日期</el-button>
              <el-button @click="saveTimeDomain" :disabled="saveTimeKeyValueIsdisabled">保存</el-button>
            </el-form-item>

            <el-form-item
              v-for="(domain, index) in indicatorTimeValue"
              :key="domain.key"
            >


              <el-input v-model="domain.timeName" style="width: 50%"
                        @change="changeTimeSearchButton(domain)"
                        @focus.prevent="clickTimeSearchButton(domain)">
                <el-button slot="prepend" icon="el-icon-delete" @click.prevent="removeTimeDomain(domain)"></el-button>
              </el-input>

              <el-input-number size="small"
                               @change="changeTimeSearchButton(domain)"
                               @focus.prevent="clickTimeSearchButton(domain)"
                               v-model="domain.orderNum" style="width: 40%"></el-input-number>

            </el-form-item>
          </el-form>
        </el-col>

        <el-col :span="16">
            <el-form ref="dynamicValidateForm3">
              <el-form-item>
                <el-button @click="addKeyValueDomain" :disabled="addTimeKeyValueIsdisabled">新增健值</el-button>
                &lt;!&ndash;<el-button @click="saveKeyValueDomain" :disabled="saveTimeKeyValueIsdisabled">保存健值</el-button>&ndash;&gt;
              </el-form-item>

              <el-form-item
                v-for="(domain, index) in indicatorTimeKeyValue"
                :key="domain.key"
              >
                <el-row>

                  <el-col :span="10">
                    <div>
                      <span>字段名</span><el-input v-model="domain.name" style="width: 70%"></el-input>
                    </div>
                  </el-col>

                  <el-col :span="10">
                    <div>
                      <span>字段值</span><el-input v-model="domain.value" style="width: 70%"></el-input>
                    </div>
                  </el-col>

                  &lt;!&ndash;<el-col :span="2">
                    <el-button @click.prevent="removeKeyValueDomain(domain)">编辑</el-button>
                  </el-col>&ndash;&gt;

                  <el-col :span="2">
                    <el-button @click.prevent="removeKeyValueDomain(domain)">删除</el-button>
                  </el-col>

                </el-row>

              </el-form-item>
            </el-form>
        </el-col>
      </el-row>
    </el-col>-->
  </el-row>

</template>

<script>

  export default {

    name: 'dynamicForm',

    data () {
      return {
        //地区
        visualizionTownList: [],
        visualizionTownId: '',

        //模块选择
        visualizionModuleArray: [5,9,10,11], //有时间线的模块
        visualizionModuleList: [],
        visualizionModuleName: '',
        visualizionModuleType: '',
        visualizionModuleId: '',

        //单纯的健值对
        indicatorValue: [{
          timeValue: '',
          name: '',
          value: '',
          orderNum: '',
          key: Date.now()
        }],

        //处理数据后的数组
        saveData: [],

        //时间模块处置
        indicatorTimeValue: [{
          timeName: '',
          orderNum: '',
          key: Date.now()
        }],

        //选择的键
        selectedTimeName: '',
        elecdtTimeOrderNum: '',

        //健值数据
        indicatorTimeKeyValue: [{
          timeValue: '',
          name: '',
          value: '',
          orderNum: '',
          key: Date.now(),
          flag: true, //标志是不是第一个值
        }],

        //是否禁用
        addTimeKeyValueIsdisabled: false,
        saveTimeKeyValueIsdisabled: false,
        //saveButtonClickFalg: false,
        //日期上面保存按钮
        saveTimeButtonClickFalg: false,
        //右边json的值
        dataArayy: [],
        //健值对第一个保存的值，因为第一个关系到后面的模板
        firstIndicatorTimeKeyValue: [{
          timeValue: '',
          name: '',
          value: '',
          orderNum: '',
          key: Date.now(),
          flag: true, //标志是不是第一个值
        }],


      }
    },

    mounted(){
      this.getVisualizionTownList();
      this.getVisualizionModule();
    },

    methods: {
      //请求地区
      getVisualizionTownList(){
        this.$http({
          url: this.$http.adornUrl('/visualizationTown/list'),
          method: 'get',
          params: this.$http.adornParams()
        }).then((data) => {
            // console.log("请求地区",data)
            this.visualizionTownList = data.data.list;
        })
      },

      //请求模块
      getVisualizionModule(){
        this.$http({
          url: this.$http.adornUrl('/visualizationIndicator/list'),
          method: 'get',
          params: this.$http.adornParams({
            visualizionTownId: this.visualizionTownId
          })
        }).then((data) => {
          // console.log("请求模块",data)
          this.visualizionModuleList = data.data.list;
        })
      },

      //选择地区
      selectVisualizionTown(){
        //console.log(this.visualizionTownId);
        this.getVisualizionModule();
      },

      //选择模块
      selectModule(){
        // console.log("选择模块",this.visualizionModuleId);
        this.visualizionModuleList.forEach((item)=>{
            if(item.id === this.visualizionModuleId){
                this.visualizionModuleName = item.indicatorName;
                this.visualizionModuleType = item.indicatorType;
            }
        })

          //数据恢复
          this.indicatorValue = [{
            timeValue: '',
            name: '',
            value: '',
            orderNum: '',
            key: Date.now()
          }];
          this.saveData = [];
          this.indicatorTimeValue = [{
            timeName: '',
            orderNum: '',
            key: Date.now()
          }];
          this.selectedTimeName =  '';
          this.elecdtTimeOrderNum =  '';
          this.indicatorTimeKeyValue = [{
            timeValue: '',
            name: '',
            value: '',
            orderNum: '',
            key: Date.now(),
            flag: true,
          }];
          this.addTimeKeyValueIsdisabled = false;
          this.saveTimeKeyValueIsdisabled = false;
          this.saveTimeButtonClickFalg = false;
          this.dataArayy = [];
          this.firstIndicatorTimeKeyValue = [{
            timeValue: '',
            name: '',
            value: '',
            orderNum: '',
            key: Date.now(),
            flag: true,
          }];

          //请求数据
          this.getTimeKeyValueDataByModuleID();

      },

      submitForm() {
        console.log("保存",this.indicatorValue)
        this.saveData = [];

        //数据处理
        for(let i=0; i<this.indicatorValue.length; i++){

          this.saveData.push({
            visualizationIndicatorId: this.visualizionModuleId,
            indicatorKey: this.indicatorValue[i].name.trim(),
            indicatorValue: this.indicatorValue[i].value.trim(),
            orderNum: this.indicatorValue[i].orderNum,
            deleted: 0
          })

        }

        let obj = {
          id: this.visualizionModuleId,
          visualizationTownId: this.visualizionTownId,
          indicatorName: this.visualizionModuleName,
          indicatorType: this.visualizionModuleType,
          //key-value表
          visualizationIndicatorKeyValueEntity: this.saveData
        }


        // console.log("保存前整理后数据", obj)

        this.$http({
          url: this.$http.adornUrl('/visualizationIndicator/save'),
          method: 'post',
          data: this.$http.adornData({
            ...obj
          })
        }).then(({ data }) => {
          // console.log("没有时间线的保存到数据库",data)
          this.$message({
            message: '保存成功',
            type: 'success'
          });
        })


      },

      removeDomain(item) {
        this.$confirm("您确定删除此节点?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/visualizationIndicatorKeyValue/deleteKeyValueListByIndicatorIdAndKey'),
            method: 'get',
            params: this.$http.adornParams({
              visualizationIndicatorId: this.visualizionModuleId,
              indicatorKey: item.name
            })
          }).then((data) => {
            var index = this.indicatorValue.indexOf(item)
            if (index !== -1) {
              this.indicatorValue.splice(index, 1)
            }

            this.$message({
              message: '删除成功',
              type: 'success'
            });
          })
        })

      },

      //左边新增模块
      addDomain() {
        this.indicatorValue.push({
          timeValue: '',
          name: '',
          value: '',
          orderNum: '',
          key: Date.now()
        });
      },

      //右边新增时间模块
      addTimeDomain(){

        // console.log("当前时间模块",this.indicatorTimeValue)

        //判断当前键值
        for(let i=0; i<this.indicatorTimeKeyValue.length;i++){
          if(!this.indicatorTimeKeyValue[i].name || !this.indicatorTimeKeyValue[i].value){
            this.saveTimeButtonClickFalg = false;
            this.$message({
              message: '请填完当前键值',
              type: 'warning'
            });
            return;
          }else{
            this.saveTimeButtonClickFalg = true;
          }
        }

        //判断它是否填完当前键值
        if(this.indicatorTimeKeyValue.length >0 && !this.saveTimeButtonClickFalg){
          //说明没有值
          this.$message({
            message: '请先点击保存按钮',
            type: 'warning'
          });
          return;
        }

        if(this.indicatorTimeValue[this.indicatorTimeValue.length - 1]){
          if(!(this.selectedTimeName.trim())){
            //说明没有值
            this.$message({
              message: '请填写当前日期',
              type: 'warning'
            });
            return;
          }
        }

        //先判断
        for(let i=0; i<this.indicatorTimeKeyValue.length;i++){
          if(!this.indicatorTimeKeyValue[i].name || !this.indicatorTimeKeyValue[i].value){
            this.saveTimeButtonClickFalg = false;
            this.$message({
              message: '请填完当前键值',
              type: 'warning'
            });
            return;
          }
        }

        //新增时间
        this.indicatorTimeValue.push({
          timeName: '',
          orderNum: 0,
          key: Date.now()
        });

        //新增键值
        // console.log("点击新增日期，新增键值",this.firstIndicatorTimeKeyValue)
        this.indicatorTimeKeyValue = [];
        for(let i=0; i<this.firstIndicatorTimeKeyValue.length; i++){
          this.indicatorTimeKeyValue.push({
            timeValue: '',
            name: this.firstIndicatorTimeKeyValue[i].name,
            value: '',
            orderNum: '',
            key: Date.now()+Math.random(),
            flag: false, //标志是不是第一个值
          })
          //this.indicatorTimeKeyValue = this.firstIndicatorTimeKeyValue;
        }



      },

      //保存
      saveTimeDomain(){
        //this.indicatorTimeValue[1]
        if(this.indicatorTimeValue[this.indicatorTimeValue.length - 1]){
          if(!(this.selectedTimeName)){//false 没有保存 !false
            //说明没有值
            this.$message({
              message: '请填写当前日期',
              type: 'success'
            });
            return;
          }
        }else{

        }

        //判断当前键值
        for(let i=0; i<this.indicatorTimeKeyValue.length;i++){
          if(!this.indicatorTimeKeyValue[i].name || !this.indicatorTimeKeyValue[i].value){
            this.saveTimeButtonClickFalg = false;
            this.$message({
              message: '请填完当前键值',
              type: 'success'
            });
            return;
          }else{
            this.saveTimeButtonClickFalg = true;
          }
        }


        this.dataArayy = [];
        let jsonValueArray = [];
        //构建数据
        for(let i=0; i<this.indicatorTimeKeyValue.length; i++){
          //构建出json字符串: [{"name":"新增疑似","data":130},{"name":"新增确诊","data":120}]
          jsonValueArray.push({
            name: this.indicatorTimeKeyValue[i].name,
            data: this.indicatorTimeKeyValue[i].value
          })

          //模范第一个，造福全人类
          this.firstIndicatorTimeKeyValue[i] = {
            timeValue: '',
            name: this.indicatorTimeKeyValue[i].name,
            value: '',
            orderNum: '',
            key: Date.now()+Math.random()
          }

        }

        // console.log("健值表时间值",this.indicatorTimeValue)
        //健值表
        this.dataArayy.push({
          visualizationIndicatorId: this.visualizionModuleId,  //模块的值
          //indicatorKey: this.indicatorTimeValue[this.indicatorTimeValue.length - 1].timeName.trim(),  //时间的值
          indicatorKey: this.selectedTimeName.trim(),  //时间的值
          indicatorValue: JSON.stringify(jsonValueArray),  //json字符串
          orderNum: this.selecdtTimeOrderNum,  //排序
          deleted: 0
        })


        let obj = {
          id: this.visualizionModuleId,
          visualizationTownId: this.visualizionTownId,
          indicatorName: this.visualizionModuleName,
          indicatorType: this.visualizionModuleType,
          //key-value表
          visualizationIndicatorKeyValueEntity: this.dataArayy,
        }

        //有时间框焦点值，先删除
        if(this.selectedTimeName){
          //deleteKeyValueListByIndicatorIdAndKey
          this.$http({
            url: this.$http.adornUrl('/visualizationIndicatorKeyValue/deleteKeyValueListByIndicatorIdAndKey'),
            method: 'get',
            params: this.$http.adornParams({
              visualizationIndicatorId: this.visualizionModuleId,
              indicatorKey: this.selectedTimeName
            })
          }).then((data) => {
            // console.log("保存日期按钮构建的值",obj)
            //保存到数据库
            this.$http({
              url: this.$http.adornUrl('/visualizationIndicator/save'),
              method: 'post',
              data: this.$http.adornData({
                ...obj
              })
            }).then(({ data }) => {
              // console.log("右边保存到数据库",data)
              this.$message({
                message: '保存成功',
                type: 'success'
              });
            })

          })
        }


      },

      //点击搜索时间标志，获取焦点，显示新增键值
      clickTimeSearchButton(item){
        //获取到选择的健
        this.selecdtTimeOrderNum = item.orderNum;
        this.selectedTimeName = item.timeName;

        // console.log("获取时间key:",item)
        //item.timeName;
        this.$http({
          url: this.$http.adornUrl('/visualizationIndicatorKeyValue/indicatorKeyValueListByIndicatorIdAndKey'),
          method: 'get',
          params: this.$http.adornParams({
            visualizationIndicatorId: this.visualizionModuleId,
            indicatorKey: item.timeName
          })
        }).then((data) => {
          // console.log("点击搜索时间标志",data)

          if(data.data.list.length >0){

            let value = data.data.list[0].indicatorValue;
            let obj =  JSON.parse(value)
            // console.log("json转成数组",obj)
            this.indicatorTimeKeyValue = [];
            this.firstIndicatorTimeKeyValue = [];

            for(let i=0; i<obj.length; i++){
              this.indicatorTimeKeyValue.push({
                timeValue: '',
                name: obj[i].name,
                value: obj[i].data,
                key: Date.now()+Math.random()
              })

              //第一个值
              this.firstIndicatorTimeKeyValue.push({
                timeValue: '',
                name: obj[i].name,
                value: '',
                key: Date.now()+Math.random()
              })
            }

          }else{
            this.indicatorTimeKeyValue = this.firstIndicatorTimeKeyValue;
          }

        })

      },

      //焦点离开时
      changeTimeSearchButton(item){
        //获取到选择的健
        // console.log("焦点离开时的值",item)
        this.selecdtTimeOrderNum = item.orderNum;
        this.selectedTimeName = item.timeName;
      },

      //新增键值
      addKeyValueDomain(){
        // console.log("点击新增键值")
        if(this.indicatorTimeValue.length === 0){
          this.$message({
            message: '请先添加日期',
            type: 'warning'
          });
          return;
        }
        this.indicatorTimeKeyValue.push({
          timeValue: '',
          name: '',
          value: '',
          orderNum: '',
          key: Date.now()
        });
      },

      //删除时间
      removeTimeDomain(item){

        this.$confirm("您确定删除此节点?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          //请求删除
          this.$http({
            url: this.$http.adornUrl('/visualizationIndicatorKeyValue/deleteKeyValueListByIndicatorIdAndKey'),
            method: 'get',
            params: this.$http.adornParams({
              visualizationIndicatorId: this.visualizionModuleId,
              indicatorKey: item.timeName
            })
          }).then((data) => {

            //删除了时间，其的键值也被删除
            let index = this.indicatorTimeValue.indexOf(item)
            if (index !== -1) {
              this.indicatorTimeValue.splice(index, 1)
            }
            this.indicatorTimeKeyValue = []

            this.$message({
              message: '删除成功',
              type: 'success'
            });

          })
        }).catch(() => {

        });


      },

      //删除键值
      removeKeyValueDomain(item) {
        var index = this.indicatorTimeKeyValue.indexOf(item)
        if (index !== -1) {
          this.indicatorTimeKeyValue.splice(index, 1)
        }
      },

      //通过镇街与模块，获取时间类型的键值对,key-value表
      getTimeKeyValueDataByModuleID(){
        this.$http({
          url: this.$http.adornUrl('/visualizationIndicatorKeyValue/indicatorKeyValueListByIndicatorId'),
          method: 'get',
          params: this.$http.adornParams({
            visualizationIndicatorId: this.visualizionModuleId
          })
        }).then((data) => {
          // console.log("通过镇街与模块，获取时间类型的键值对",data.data.list)

          //为时间模块赋值
          if(data.data.list.length > 0){

            if(this.visualizionModuleArray.indexOf(this.visualizionModuleType) == -1){
              //不包含时间线
              this.indicatorValue = [];
              for(let i=0; i<data.data.list.length; i++){
                this.indicatorValue.push({
                  name: data.data.list[i].indicatorKey,
                  value: data.data.list[i].indicatorValue,
                  orderNum: data.data.list[i].orderNum,
                  key: Date.now()+Math.random()
                })
              }

            }else{

              this.indicatorTimeValue = [];
              for(let i=0; i<data.data.list.length; i++){
                this.indicatorTimeValue.push({
                  timeName: data.data.list[i].indicatorKey,
                  orderNum: data.data.list[i].orderNum,
                  key: Date.now()+Math.random()
                })
              }

              //渲染第一个时间键值对
              let item = {
                timeName: data.data.list[0].indicatorKey
              }
              this.clickTimeSearchButton(item);
            }

          }

        })
      }


    }

  }
</script>

<style lang="scss">


</style>

