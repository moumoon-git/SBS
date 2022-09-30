<template>
  <div id="center">
    <!--<p class="thetitle">监测预警响应流程设计</p>-->
    <el-card class="box-card" shadow="always" :body-style="{ padding: '0px' }">
      <div class="left">
        <div class="top">
          <ul>
            <li @click="addlevel()">+新增级别</li>
            <li @click="deleteLevel()">-删除级别</li>
          </ul>
        </div>
        <div style="clear: both;" class="middle">
          <ul>
            <li v-for="(level,index) in levelList" :key="level.id" @click="Level(level,index)"
                :class="{levelsclass:level.id==levelId}"
                style="white-space: pre;overflow: hidden;text-overflow:ellipsis;"><i></i>{{level.responseName}}
            </li>
          </ul>

        </div>
      </div>
      <div class="right">
        <el-tabs type="border-card" v-if="active" v-model="activeName" @tab-click="handleClick" style="height: 520px;">

          <!--警情响应-->
          <el-tab-pane label="警情响应" name="first">
            <div class="levelTop" style="float: right;">
              <!--<el-button size="small" style="padding: 6px 6px;" @click="responseclears">添加响应参数</el-button>-->
            </div>
            <div style="margin: 0 auto;width: 370px;clear: both;">
              <el-form label-width="100px">
                <el-form-item label="等级名称:" class="member" required>
                  <el-input size="mini" class="right-input" v-model="dataForm.responseName"></el-input>
                </el-form-item>
                <el-form-item label="响应等级:" class="member" style="width: 250px;" required>
                  <el-select v-model="dataForm.responseLevel" placeholder="请选择" size="mini" width="50"
                             @change="change_responseLevel">
                    <el-option v-for="item in responseLevel" :key="item.id" :label="item.name" :value="item.id"
                               style="padding-left:14px ;">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="响应时限:" class="member" required>
                  <el-input size="mini" class="right-input" v-model="dataForm.responseDuration"></el-input>
                </el-form-item>
                <el-form-item label="一般事件处置时限:" class="member" required>
                  <el-input size="mini" class="right-input" v-model="dataForm.generalEventDuration"></el-input>
                </el-form-item>
                <el-form-item label="复杂事件处置时限:" class="member" required>
                  <el-input size="mini" class="right-input" v-model="dataForm.complexEventDuration"></el-input>
                </el-form-item>
                <div class="submit-btn">
                  <el-button size="small" type="primary" style="padding: 6px 14px;margin-top: 20px;" @click="grade">保存
                  </el-button>
                </div>
              </el-form>
            </div>

          </el-tab-pane>
          <!--人员关联-->
          <el-tab-pane label="人员关联" name="second">
            <div class="levelTop" style="float: right;">
              <!--<el-button size="small" style="padding: 6px 6px;" @click="responseclears">添加响应参数</el-button>-->
            </div>
            <div style="margin: 0 auto;width: 370px;clear: both;">
              <el-form label-width="100px">
                <el-form-item label="服务对象:" class="member" style="width: 250px;" required>
                  <el-select v-model="emtlevelID" placeholder="请选择" size="mini" width="50" @change="change_emtlevel">
                    <el-option v-for="item in serviceObject" :key="item.id" :label="item.name" :value="item.id"
                               style="padding-left:14px ;">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="牵头部门:" class="member" required>
                  <el-input size="mini" class="right-input" v-model="name"></el-input>
                </el-form-item>
                <el-form-item label="牵头部门联系人:" class="member" required>
                  <el-input size="mini" class="right-input" v-model="name"></el-input>
                </el-form-item>
                <el-form-item label="应哨部门:" class="member" required>
                  <el-input size="mini" class="right-input" v-model="name"></el-input>
                </el-form-item>
                <el-form-item label="应哨部门联系人:" class="member" required>
                  <el-input size="mini" class="right-input" v-model="name"></el-input>
                </el-form-item>
                <div class="submit-btn">
                  <el-button size="small" type="primary" style="padding: 6px 14px;margin-top: 20px;" @click="grade">保存
                  </el-button>
                </div>
              </el-form>
            </div>

          </el-tab-pane>
          <!--处置参考-->
          <el-tab-pane label="处置参考" name="third">
            <div class="levelTop" style="float: right;">
              <!--<el-button size="small" style="padding: 6px 6px;" @click="responseclears">添加响应参数</el-button>-->
            </div>
            <div style="margin: 0 auto;width: 370px;clear: both;">
              <el-form label-width="100px">
                <el-form-item label="处置参考:" class="member" style="resize:none" required>
                  <el-input type="textarea" class="right-input" :rows="6" v-model="remark" maxlength="1000"></el-input>
                </el-form-item>
                <div class="submit-btn">
                  <el-button size="small" type="primary" style="padding: 6px 14px;margin-top: 20px;" @click="grade">保存
                  </el-button>
                </div>
              </el-form>
            </div>

          </el-tab-pane>


        </el-tabs>
      </div>
    </el-card>


    <!--添加参数-->
    <el-dialog title="响应参数" :visible.sync="addParameter" width="780px" center>
      <response ref="responsechild" :parameterData="parameterData" @parameterSetting="parameterSetting"
                :tableData="tableData" :relation="relation" :userCreate="userCreate"></response>
    </el-dialog>

  </div>
</template>

<script>
  import bus from '@/utils/bus'

  export default {
    name: 'from4',
    components: {},
    data () {
      return {
        levelList:[],//等级列表

        responseLevel: [   //响应等级
          {id: 1, name: 'Ⅰ级（特别重大）'},
          {id: 2, name: 'Ⅱ级（重大）'},
          {id: 3, name: 'Ⅲ级（较大）'},
          {id: 4, name: 'Ⅳ级（一般）'},
        ],
        serviceObject: [   //服务对象
          {id: 1, name: '老人'},
          {id: 2, name: '年青人'},
          {id: 3, name: '儿童'},
          {id: 4, name: '妇女'},
          {id: 5, name: '区域'},
        ],

        dataForm: {
          planId: '',//预案id
          levelId:'',//等级id
          responseName:'',//等级名称
          responseLevel: '',//响应等级
          responseLevelName: '',//响应等级名称
          responseDuration: '',//响应时长
          generalEventDuration: '',//一般事件响应时长
          complexEventDuration: '',//复杂事件响应时长
        },

        addParameter: false, //添加响应参数设置
        bgclass: false, //步骤背景切换
        activeName: 'first', //选项卡切换
        active: false,
        //preplanId: null,
        // versionId: null,
        name: '', //等级信息名称
        remark: '', //等级信息描述
        options: [], //响应信号数组
        emtlevelData: [], //事件等级数组
        levels: [], //新增级别数组
        signalId: '', //响应信号ID双向绑定
        emtlevelID: '', //事件等级ID
        type: 0, //响应类型
        deleteLevelID: '', //删除ID
        levelId: '', //新增响应等级ID
        levelIds: '',
        items: [], //流程步骤新增数组
        processname: '', //流程名称
        content: '', //流程内容
        addtasks: [], //新增任务内容数组
        taskname: '', //任务名称
        taskcontent: '', //任务内容
        taskId: '', //任务ID
        taskIds: '',
        task: false, //任务内容显示与隐藏
        show: false,
        processId: '', //新增流程内容ID
        processIds: '',
        dynamicTags: [],
        dynamicTag: [],
        parameterData: [], //参数数据
        parameterSettingdata: [],
        tableData: [], //参数表格数据
        relation: '', //判断表达式
        userCreate: 1,
        responsetype: 0,
      }
    },
    created () {
      this.getLevels()
      this.getParams()
      this.pcode()
      this.eventLevel()
    },
    computed: {
      f1() {
        return this.$store.state.user.levelList
      }
    },
    watch: {
      f1(curVal, oldVal) {
        this.levelList=(curVal)
        // console.log("levelList",this.levelList)
      }
    },
    methods: {
      responseclears () {
        this.addParameter = true
        //				if(this.responsetype==1){
        setTimeout(() => {
          this.$refs.responsechild.responseclear()
        }, 1000)
        //				}

      },
      parameterSetting (data) {
        this.parameterSettingdata = data
        this.addParameter = false
      },
      /* 等级信息*/

      //新增新级别数组
      addlevel () {
        /*bus.$on('sendPlanId', val => {
          this.dataForm.planId = val
          alert(val)
        })*/
        const planId= sessionStorage.getItem("planId");
        if (planId === '' || planId == null) {
          this.$message({
            message: '请先保存预案信息！',
            type: 'warning'
          })
          return
        }


        this.active = true
        this.name = ''
        this.remark = ''
        this.signalId = ''
        this.levelId = ''
        this.processId = ''
        this.activeName = 'first'
        this.items = []
        this.tableData = []
        this.emtlevelID = ''
        this.relation = ''
        this.show = false
        this.getParams()
        this.responsetype = 1

        this.dataForm.planId=planId
        this.dataForm.responseName = ''
        this.dataForm.responseLevel = ''
        this.dataForm.responseDuration = ''
        this.dataForm.responseLevelName = ''
        this.dataForm.generalEventDuration = ''
        this.dataForm.complexEventDuration = ''


      },
      //删除预案响应等级级别
      deleteLevel () {
        if (this.levelId == '') {
          this.$message({
            message: '请选中级别再删除！',
            type: 'warning'
          })
          return
        }

        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            'id': this.levelId
          }

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      Leveldefault () { //默认加载第一条数据
        if (this.levelId == '') {
          this.levelId = this.levelIds
        }
        let data = {
          'id': this.levelId
        }

      },
      //点击级别获取预案响应等级信息
      Level (level, index) {
        this.levelId = level.id
        this.Leveldefault()
        this.activeName = 'first'
        this.show = false
        this.task = false
        this.processId = ''
        this.taskId = ''

      },
      //选择响应等级返回值
      change_responseLevel (responseLevelId) {
        this.dataForm.responseLevel = responseLevelId
        const rp=this.responseLevel.filter(item => item.id == this.dataForm.responseLevel)[0]
        this.dataForm.responseLevelName =rp.name
      },
      //选择事件等级返回值
      change_emtlevel (id) {
        this.emtlevelID = id
      },
      //获取预案响应等级
      getLevels () {
        let condition = localStorage.getItem('AddpreplanId') //从本地存储获取预案ID和预案版本ID
        // this.versionId = JSON.parse(condition).versionId //获取预案版本ID
        //this.preplanId = JSON.parse(condition).preplanId //获取预案ID
        let data = {
          //  versionId: this.versionId,
          type: this.type
        }

      },
      //响应信号获取
      pcode () {

        let data = {
          'pcode': 'level_signal'
        }

      },
      eventLevel () { //获取事件等级

        let data = {
          'pcode': 'emtlevel'
        }

      },
      //响应参数获取
      getParams () {
        let condition = localStorage.getItem('AddpreplanId') //从本地存储获取预案ID和预案版本ID
        //this.versionId = JSON.parse(condition).versionId //获取预案版本ID
        // this.preplanId = JSON.parse(condition).preplanId //获取预案ID
        let data = {
          // id: this.preplanId
        }

      },
      //警情响应保存
      grade () {
        this.$emit('savePolicResponse', this.dataForm)
      },

      /*流程设置*/
      handleClick (tab, event) {
        if (tab.label == '流程设置') {
          this.getLevelProcessList()
        }
      },
      //增加流程步骤
      add () {
        let _this = this
        if (_this.items.length >= 0) {
          _this.items.push(_this.items.length)
          if (_this.items.length == 1) {
            this.processname = ''
            this.content = ''
            this.task = false
            this.addtasks = []
          } else {
            this.processname = ''
            this.content = ''
            this.addtasks = []
            this.processId = ''
            this.taskId = ''
            this.task = false
          }
        }
        if (_this.items.length > 0) {
          this.show = true
        }

      },
      defaultprocess () {
        if (!this.processId) {
          this.processId = this.processIds
        }
        let data = {
          processId: this.processId
        }

      },
      //点击流程步骤
      getIndex (id, index) {
        if (!id) {
          this.processname = ''
          this.content = ''
          this.addtasks = []
          this.processId = ''
          this.taskId = ''
          this.task = false
          return
        }
        this.processId = id
        this.taskId = ''
        this.defaultprocess()

      },
      //保存流程
      processbtn () {
        if (!this.processname || !this.content) {
          this.$message({
            message: '名称、内容必填！',
            type: 'warning'
          })
          return
        }
        if (this.processId) { //修改流程
          let test = {
            id: this.processId, //响应流程ID
            name: this.processname, //流程名称
            content: this.content, //流程内容
          }
          let data = {
            data: test
          }

        } else { //新增流程
          if (this.levelId == '') {
            this.$message({
              message: '请先完成等级信息！',
              type: 'warning'
            })
            return
          }
          let test = {
            levelId: this.levelId, //响应等级ID
            name: this.processname, //流程名称
            content: this.content, //流程内容
          }
          let data = {
            data: test
          }

        }

      },
      //获取预案响应等级流程列表
      getLevelProcessList () {
        if (this.levelId) {
          let data = {
            levelId: this.levelId
          }

        }
      },
      //删除流程
      deleteLevelProcess () {
        if (this.processId == '') {
          this.$message({
            message: '请选中流程再删除！',
            type: 'warning'
          })
          return
        }

        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          let data = {
            id: this.processId
          }

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })

      },
      //新增任务内容
      addtask () {
        if (this.processId == '') {
          this.$message({
            message: '请保存流程再新增任务！',
            type: 'warning'
          })
          return
        }
        this.task = true
        this.taskname = ''
        this.taskcontent = ''
        this.taskId = ''
        this.dynamicTags = []
      },

      //保存任务
      taskbtn () {
        if (!this.taskname || !this.taskcontent || this.dynamicTags.length == 0) {
          this.$message({
            message: '名称、内容、人员必填！',
            type: 'warning'
          })
          return
        }

        let arrays = []
        this.dynamicTags.forEach(function (data) {
          arrays.push(data.id)
        })
        if (this.taskId) {
          let test = {
            taskId: this.taskId,
            name: this.taskname,
            content: this.taskcontent,
            positions: arrays
          }
          let data = {
            data: test
          }

        } else {
          let test = {
            processId: this.processId,
            name: this.taskname,
            content: this.taskcontent,
            positions: arrays
          }
          let data = {
            data: test
          }

        }

      },
      //获取流程任务列表
      getLevelProcessTaskList () {
        if (this.processId) {
          let data = {
            processId: this.processId
          }

        }
      },
      getLevelProcessTask (id) { //点击获取流程任务详细信息
        this.taskId = id
        this.getLevelProcessTaskDetails()
      },

      getLevelProcessTaskDetails () {
        if (!this.taskId) {
          this.taskId = this.taskIds
        }
        let data = {
          taskId: this.taskId
        }

      },
      //删除任务流程
      deleteLevelProcessTask () {

        if (this.taskId == '') {
          this.$message({
            message: '请选中任务再删除！',
            type: 'warning'
          })
          return
        }

        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          let data = {
            id: this.taskId
          }

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })

      },
      //联系人查找弹出框
      contact () {
        if (this.dynamicTags) {
          this.dynamicTag = this.dynamicTags
        }
        if (this.taskId == '') {
          this.$refs.child.dynamicTags()
        }
        this.$refs.child.childFn()

      },
      child (chooseList) {

        this.dynamicTags = chooseList
      },
      handleClose (tag) {
        if (this.taskId) {
          this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
          return
        }
        this.$refs.child.chooseChanged(tag)
      },

      next () {
        this.$emit('refreshList')
      },
      prev () {
        this.$emit('refprev')
      },
    }
  }
</script>

<style scoped>
  * {
    margin: 0;
    padding: 0;
  }

  #center h1 {
    text-align: center;
  }

  li {
    list-style: none;
    /*text-align: center;*/
  }

  #center .box-card {
    width: 1120px;
    /*margin: 20px auto;*/
  }

  .top li {
    float: left;
    width: 110px;
    text-align: center;
    font-size: 16px;
    border-right: 1px solid #E4E7ED;
    border-bottom: 1px solid #E4E7ED;
    height: 36px;
    line-height: 36px;
    cursor: pointer;
  }

  .left {
    width: 222px;
    float: left;
  }

  .middle {
    width: 221px;
    /*border-right: 1px solid #E4E7ED;*/
    height: 500px;
  }

  .middle li {
    text-align: center;
    height: 30px;
    font-size: 16px;
    line-height: 30px;
    cursor: pointer;
  }

  .right {
    float: left;
    margin-top: 16px;
    margin-left: 10px;
    width: 882px;
    min-height: 400px;
  }

  .right-input {
    width: 360px;
  }

  .member {
    margin-top: 16px;
  }

  .member i {
    display: inline-block;
    width: 10px;
    height: 1px;
    background: #C0C0C0;
  }

  .setup {
    width: 358px;
    padding-bottom: 10px;
    border: 1px solid #C0C0C0;
    min-height: 100px;
  }

  .setupinput {
    width: 50px;
    height: 24px;
    padding: 0 2px;
    color: #606266;
  }

  .bottom {
    margin: 0 auto;
    margin-top: 30px;
  }

  .bottom li {
    float: left;
    width: 80px;
    background: #66b1ff;
    color: #FFFFFF;
    font-size: 14px;
    height: 30px;
    line-height: 30px;
    border-radius: 8px;
  }

  .bottom li:first-child {
    margin-left: 104px;
    margin-right: 20px;
  }

  .submit-btn {
    clear: both;
    text-align: center;
  }

  .right_top li {
    list-style: none;
    width: 72px;
    cursor: pointer;
    float: left;
  }

  .right_top li span {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1px solid #409EFF;
    color: #409EFF;
    display: inline-block;
    text-align: center;
    line-height: 30px;
  }

  .right_top li i {
    display: inline-block;
    width: 40px;
    height: 1px;
    background: #409EFF;
  }

  .right_top p {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1px solid #409EFF;
    color: #3b85fe;
    display: inline-block;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
    /*float: left;*/
  }

  .right_center {
    clear: both;
  }

  .right_process {
    width: 824px;
    height: 300px;
    border: 1px solid #dcdfe6;
    clear: both;
    position: relative;
    margin-bottom: 60px;
  }

  .right_process h3 {
    font-weight: normal;
    font-size: 16px;
    width: 50px;
    height: 30px;
    line-height: 30px;
    background: #FFFFFF;
    position: absolute;
    color: #606266;
    left: 12px;
    top: -15px;
    text-align: center;
  }

  .right_process span {
    float: right;
    font-size: 14px;
    margin-top: 4px;
    margin-right: 24px;
  }

  .right_process .delete {
    position: absolute;
    color: #607d8b;
    right: -4px;
    top: -10px;
    cursor: pointer;
  }

  .member-input {
    width: 700px;
  }

  .task_left {
    width: 300px;
    min-height: 200px;
    border: 1px solid #dcdfe6;
    position: relative;
    padding-bottom: 2px;
    display: inline-block;
  }

  .task_nav {
    float: right;
  }

  .task_left h3 {
    font-weight: normal;
    font-size: 16px;
    width: 50px;
    height: 30px;
    line-height: 30px;
    background: #FFFFFF;
    position: absolute;
    color: #606266;
    left: 12px;
    top: -15px;
    text-align: center;
  }

  .task_nav li {
    float: left;
    width: 60px;
    height: 26px;
    text-align: center;
    line-height: 27px;
    font-size: 16px;
    cursor: pointer;
    border: 1px solid #dcdfe6;
    margin-top: 6px;
    margin-bottom: 6px;
    background: #ccc;
  }

  .task_nav li:last-child {
    border-left: 0;
    margin-right: 4px;
  }

  .content {
    clear: both;
    text-align: center;
  }

  .content h2 {
    font-size: 16px;
    font-weight: normal;
    line-height: 24px;
    border-bottom: 1px solid #1111118f;
  }

  .content li {
    height: 30px;
    line-height: 30px;
    cursor: pointer;
  }

  .task_right {
    width: 500px;
    float: right
  }

  .task_content {
    border: 1px solid #dcdfe6;
    width: 398px;
    min-height: 100px;
    position: relative;
  }

  .add {
    position: absolute;
    bottom: 0;
    right: 0;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
    padding: 0 10px;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .el-checkbox + .el-checkbox {
    margin-left: 0;
  }

  .create-btn {
    float: right;
    margin: 10px;
  }

  .el-tag + .el-tag {
    margin-left: 0px;
    margin-bottom: 10px;
  }

  .el-tree >>> .el-tree-node {
    /*background: #ccc;*/
  }

  .el-tree--highlight-current >>> .el-tree-node.is-current > .el-tree-node__content {
    background-color: #C0C0C0;
  }

  .el-tag + .el-tag {
    margin-left: 0px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .dynamicTags {
    padding: 0 10px;
    margin-right: 10px;
  }

  .right_top li span.bgclass {
    background-color: #409EFF;
    color: #FFFFFF;
  }

  .levelsclass {
    background: #ccc;
  }

  .el-scrollbar__wrap {
    overflow-x: hidden;
  }

  .thetitle {
    text-align: center;
    font-size: 24px;
    margin: 15px auto;
    color: #000;
  }

  .el-form >>> .el-form-item {
    margin-bottom: 0;
  }

  .el-form-item__label {
    min-width: 136px;
  }
</style>
