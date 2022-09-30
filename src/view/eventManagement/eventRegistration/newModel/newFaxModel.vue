<template>
  <div >
    <el-dialog
      title="选择目标"
      :visible.sync="dialogVisible"
      width="700px"
      append-to-body
      :close-on-click-modal="false">
      <el-row>
        <el-col :span="11">
          <el-tabs style="border: 1px solid #EBEEF5;border-radius: 4px;" @tab-click="msgWith">
            <el-tab-pane label="通讯录">
              <el-scrollbar style="height: 100%;margin: 6px;">
                <address-book-tree style="width: 100%;height: 250px;" ref="smsPhoneTree" :showCheckbox="showCheckbox"
                                   :showPhoneIcon="showPhoneIcon" @handleNodeClick="faxRowNodeClick" @handleCheckChange="handleCheckChange">
                </address-book-tree>
              </el-scrollbar>
            </el-tab-pane>
            <el-tab-pane label="最近联系人">
              <el-scrollbar style="height: 100%;margin: 6px;" id="dailList">
                <call-log-model style="width: 100%;height: 240px;" ref="callLogModel">
                </call-log-model>
              </el-scrollbar>
            </el-tab-pane>
            <el-tab-pane label="快捷组">
              <el-scrollbar style="height: 100%;margin: 6px;">
                <quick-group style="width: 100%;height: 250px;" ref="quickGroup" :quickGroupShowCheckbox="quickGroupShowCheckbox"
                             :quickGroupShowPhoneIcon="quickGroupShowPhoneIcon" :hiide="true" @quickNodeClick="faxRowNodeClick" @handleCheckChange="handleCheckChange">
                </quick-group>
              </el-scrollbar>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="2">
          <el-col :span="24" style="padding-top:90px">
            <el-row>
              <div class="arrowButton">
                <el-button @click="addList" type="success" size="mini" round plain class="el-icon-d-arrow-right"></el-button>
              </div>
            </el-row>

            <el-row>
              <div class="arrowButton">
                <el-button @click="delectList" type="success" size="mini" round plain class="el-icon-d-arrow-left"></el-button>
              </div>
            </el-row>

          </el-col>
        </el-col>
        <el-col :span="11">
          <div style="width: 100%">
            <div class="eventList">{{sendType}}</div>
            <el-card class="box-card cardCalss" shadow="hover" id="boxCard">
              <el-row style="width: 100%;height: 240px;">

                <el-col :span="24" style="padding-left: 10px">

                  <el-row>
                    <el-col :span="20">
                      <el-input v-model="FaxinputData" placeholder="输入传真号" size="small"></el-input>
                    </el-col>
                    <el-col :span="4" style="text-align: right">
                      <el-button type="primary " class="el-icon-plus" size="small" @click="pushListNumber"></el-button>
                    </el-col>
                  </el-row>

                  <el-row>

                    <div style="width: 100%;height: 170px;border: 1px solid #ddd;margin-top: 15px;">
                      <el-scrollbar style="height: 100%;overflow:hidden;">
                        <div style="padding: 5px 15px" id="checkedList">
                          <el-checkbox-group v-model="checkedCities">
                            <el-checkbox v-for="item in checkedList" :label="item.id" :key="item.id" :checked="false">
                              {{item.label}}
                            </el-checkbox>
                          </el-checkbox-group>


                        </div>
                      </el-scrollbar>
                      <div style="width: 100%;height: 40px;line-height: 40px">
                        <el-col :span="12">
                          当前收件人数量:{{numberOfRecipients}}
                        </el-col>
                        <el-col :span="12">
                          <el-button type="primary" size="mini" @click="emptyManage">清空</el-button>
                          <el-button type="primary" size="mini" @click="selectTarget">确定</el-button>
                        </el-col>
                      </div>
                    </div>
                  </el-row>
                </el-col>
              </el-row>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </el-dialog>

    <div style="margin: 10px 0;">
      <div style="float: left;">
        <span>传真发送记录</span>
      </div>
      <div style="float: right;">
        <span>发送成功：</span><span style="color: rgba(16,217,176,1);">{{faxSendOk}}</span>
        <span>发送失败：</span><span style="color: rgba(255,147,117,1);">{{faxSendNot}}</span>
      </div>
      <div style="clear: both;"></div>
    </div>
    <tableList :tableData="tableData" :titles="title"></tableList>

    <el-row style="margin-top: 20px;font-size: 14px;">
      <el-row style="margin-bottom: 10px;background: #F0F6FF;line-height:28px;">
        <el-col :span="4">
          <div>自定义标题:</div>
        </el-col>
        <el-col :span="6">
          <el-input v-model="FaxTitle" placeholder="请输入标题" size="mini"></el-input>
        </el-col>
        <el-col :span="4" v-show="eShow">
          添加传真:
        </el-col>
        <el-col :span="6" v-show="eShow">
          <el-input size="mini" disabled v-model="faxItemName" placeholder=""></el-input>
        </el-col>
        <el-col :span="4" v-show="eShow">
          <el-upload  class="upload-demo" ref="upload" auto-upload with-credentials accept=".jpg,.jpeg,.png,.pdf,.ppt,.pptx,.doc,.docx,.txt,.xlsx,.xls"
                      :action="faxUrl" :file-list="fileList" :on-success="onSuccess" :before-upload="beforeUpload"
                      :show-file-list="false">
            <el-button type="primary" slot="trigger" size="mini">选择</el-button>
          </el-upload>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 10px;background: #F0F6FF;line-height:28px;">
        <el-col :span="4">
          定时发送:
        </el-col>
        <el-col :span="6" id="timingSend">
          <el-date-picker size="mini" v-model="timingSend"  format="yyyy-MM-dd HH:mm"
                          value-format="yyyy-MM-dd HH:mm" type="datetime" placeholder="请选择日期时间">
          </el-date-picker>
        </el-col>
        <el-col :span="14" style="text-align: center">
          <el-button type="primary" size="mini" @click="dialogVisible2 = true" >预览传真</el-button>
          <el-button type="primary" size="mini" @click='submitUpload'>发送</el-button>
        </el-col>
      </el-row>
      <!-- <div class="faxArea">
        <iframe :src="PreviewPath" id="iframe" width="100%" height="100%" frameborder="no" border="0" marginwidth="0"
          marginheight="0" scrolling="no" allowtransparency="yes"></iframe>
      </div> -->
      <!--          <el-input-->
      <!--            type="textarea"-->
      <!--            :rows="8"-->
      <!--            placeholder="文本域可编辑传真信息"-->
      <!--            v-model="textarea">-->
      <!--          </el-input>-->

      <div>
        <!--          <el-input @focus="clickButton" ></el-input>-->
        <!--        <el-scrollbar style="height: 100%">-->
        <div >
          <editor-bar1 @clickButton="clickButton"   :heightEditor="heightEditor1" id="barName"
                      :noneDisplay="editorBarData" ref="editorBarData" v-model="editor1.info1" :isClear="isClear"  >
          </editor-bar1>

        </div>
        <!--        </el-scrollbar>-->
      </div>


      <el-row style="margin-top: 10px;background: #F0F6FF;line-height:28px;">
        <el-col :span="4">发送目标:</el-col>
        <el-col :span="20">
          <el-input size="mini"  placeholder="" @focus="dialogVisible = true" v-model="sendTarget"></el-input>
        </el-col>
      </el-row>
    </el-row>

    <!-- 全屏预览传真 -->
    <el-dialog
      :visible.sync="dialogVisible2"
      :close-on-click-modal="false"
      fullscreen>
      <iframe :src="PreviewPath" id="iframe" width="100%" height="900px" frameborder="no" border="0" marginwidth="0"
              marginheight="0" scrolling="no" allowtransparency="yes"></iframe>
    </el-dialog>

    <!-- 弹出传真编辑-->
    <el-dialog
      :close-on-click-modal="false"
      custom-class="way"
      append-to-body
      :visible.sync="dialogVisible3"
      width="1000px"
      top="50px"
      :before-close="handleClose">
      <div>
        <editor-bar
          :heightEditor="heightEditor" :noneDisplay="noneDisplay" ref="editorBar" v-model="editor.info" :isClear="isClear" ></editor-bar>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="exportPdf">保存并关闭</el-button>
        </span>
    </el-dialog>

   <!--拼接的传真编辑的内容-->
<!--    <div id="barName" style="height: 1200px;position:absolute;left: 0;top: 0;opacity: 0">-->

<!--    </div>-->
  </div>
</template>

<script>
    import tableList from '@/components/table/tableList'
    import addressBookTree from '@/view/eventManagement/eventRegistration/newModel/smsPhoneTree'
    import quickGroup from '@/view/eventManagement/eventRegistration/newModel/quickGroup'
    import callLogModel from '@/view/eventManagement/eventRegistration/newModel/callLogModel'
    import EditorBar from '@/view/eventManagement/informationDisposal/editorChint'
    import EditorBar1 from '@/view/eventManagement/informationDisposal/editorChint1'
    export default {
        name: "newFaxModel",
        components: {
            addressBookTree,
            quickGroup,
            callLogModel,
            tableList,
            EditorBar,
            EditorBar1
        },
        data() {
            return {
                showCheckbox: true, //通讯录子组件树显不显示复选框
                showPhoneIcon: false, //通讯录子组件树显不显示电话图标
                quickGroupShowCheckbox: true, //快捷组树组件是否显示复选
                quickGroupShowPhoneIcon: false, //快捷组树组件是否显示电话图标
                sendType: '发送传真', //发送类型
                FaxinputData: '', //传真号
                checkedList: [], //多选列表循环数组
                checkedCities: [], //选中的多选
                numberOfRecipients: 0, //收件人数量
                FaxTitle: '', //传真标题
                PreviewPath: '', //传真预览路径
                faxUrl: window.g.ApiUrl + '/eos/communication/fax/convertPDF', //传真选择上传路径
                fileList: [],
                faxItemName: '', //传真名字
                timingSend: '', //传真定时发送
                rowItemData: '', //存储tree节点点击数据
                leftTreeData: '', //存储左边选中的树数据
                uploadForm: [], //文件上传
                faxSendOk: 0,
                faxSendNot: 0,
                dialogVisible:false,
                dialogVisible2:false,
                textarea:'',
                // author:husiyue,date:2020.10.12,bug:7422
                title: [
                    {
                        prop: 'title',
                        label: '传真标题'
                    }, {
                        prop: 'sendtime',
                        label: '发送时间'
                    }, {
                        prop: 'call',
                        label: '发送目标号码'
                    },
                  {
                        prop:'workUnit',
                        label:'单位'
                  },
                  {
                        prop: 'success',
                        label: '发送状态'
                  }
                    ],
                tableData: [],
                sendTarget:'',

                editor: {
                    info: ''
                },
                editor1: {
                    info1: ''
                },
                isClear: false,
                dialogVisible3:false,
                // timer:'',
                noneDisplay:{
                    display:'flex'
                },
                editorBarData:{
                    display:'none'
                },
                heightEditor1:{
                    height:'200px'
                },
                heightEditor:{
                    height:'500px'
                },
                baseData:'',//转成base64之后的数据
                hasShow:false,
                eShow:true,
                loading:'',
            }
        },
        mounted() {
            let data = {
                dtStart:this.GetDateStr(-6)//获取到七天前的日期
            }
            this.$api.fax(data).then((res) => {
                //author:husiyue date:2020-10-14 bug:7423
                if (res.errorcode == 0) {
                    console.log(res.data);
                    // this.tableData=res.data.data
                    res.data.data.forEach((item,i)=>{
                      if(item.direct == '已发'){
                        this.tableData.push(item)
                        if(item.success=='成功'){
                            this.faxSendOk+=1
                        }
                        if(item.success=='失败'){
                            this.faxSendNot+=1
                        }
                      }
                    })
                } else {
                    //this.$message.error(res.msg)
                }
            });
            this.editor.info='<h2 style="text-align: center;">\n' +
                '        <span style="font-weight: bold; font-family: 微软雅黑;"\n' +
                '          >突发事件信息专报</span\n' +
                '        >\n' +
                '      </h2>\n' +
                '      <div>\n' +
                '        <h3 style="text-align: center;">\n' +
                '          <span style="font-family: 微软雅黑;">第2019-X期&nbsp;</span>\n' +
                '        </h3>\n' +
                '      </div>\n' +
                '      <div>\n' +
                '        <h3 style="display: flex;font-size: 16px;">\n' +
                '          <div style="font-weight: bold;text-align:left;flex: 1;">\n' +
                '            报送单位：深圳市应急管理局值班室\n' +
                '          </div>\n' +
                '          <div style="font-weight: bold;text-align:right;flex: 1;">\n' +
                '            2019年X月XX日\n' +
                '          </div>\n' +
                '        </h3>\n' +
                '      </div>\n' +
                '      <p><br /></p>\n' +
                '      <h3 style="text-align: center;">\n' +
                '        <span style="font-weight: bold;">关于XXXXXXXXX的报告</span>\n' +
                '      </h3>\n' +
                '      <div>\n' +
                '        <h3 style="text-align: center;">\n' +
                '          <span style="font-weight: bold;">XXXXX</span>\n' +
                '        </h3>\n' +
                '      </div>\n' +
                '      <div>\n' +
                '        <span style="font-weight: bold;"><br /></span>\n' +
                '      </div>\n' +
                '      <div>\n' +
                '        <span style="font-weight: bold;"><br /></span>\n' +
                '      </div>\n' +
                '      <div>\n' +
                '        <span style="font-weight: bold;"><br /></span>\n' +
                '      </div>\n' +
                '      <div>\n' +
                '        <span style="font-weight: bold;"><br /></span>\n' +
                '      </div>\n' +
                '      <div>\n' +
                '        <span style="font-weight: bold;"><br /></span>\n' +
                '      </div>\n' +
                '      <div>\n' +
                '        <span style="font-weight: bold;"><br /></span>\n' +
                '      </div>\n' +
                '      <div>\n' +
                '        <span style="font-weight: bold; font-size: x-large;"><br /></span>\n' +
                '      </div>\n' +
                '      <div>\n' +
                '        <p>\n' +
                '          <span style="font-weight: bold; font-size: medium;"\n' +
                '            >报送：省应急管理厅、市委值班室、市政府值班室</span\n' +
                '          >\n' +
                '        </p>\n' +
                '      </div>\n' +
                '      <div>\n' +
                '        <div style="font-size: medium;display: flex;">\n' +
                '          <div style="font-weight: bold;flex: 1;">编辑：</div>\n' +
                '          <div style="font-weight: bold;flex: 2;">联系电话：0755-88100100</div>\n' +
                '          <div style="font-weight: bold;flex: 1;">签发：</div>\n' +
                '        </div>\n' +
                '      </div>\n' +
                '      <div>\n' +
                '        <span style="font-weight: bold;"><br /></span>\n' +
                '      </div>'
        },
        methods: {
            //传真编辑弹出
            clickButton(){
                // this.editor.info = this.editor1.info1
                if(this.faxItemName==''){
                    this.dialogVisible3=true
                    this.$refs.editorBarData.editor.$textElem.attr('contenteditable', true)
                    // if(this.editor1.info1!=''){
                  //   this.$refs.editorBarData.editor.$textElem.attr('contenteditable', false)
                  // }
                }else {
                    // this.editor.info=''
                    // this.editor1.info1=''
                    this.$refs.editorBarData.editor.$textElem.attr('contenteditable', false)
                    this.$message({
                        message: '只能选择一种上传传真的类型',
                        type: 'warning'
                    });
                }
            },
            change(val,chinld) {
                console.log(val);
                // this.editor1.info1 = val
                if(chinld==''){
                    console.log(val);
                    this.$refs.editorBarData.editor.txt.clear()
                }
            },
            handleClose() {
                this.dialogVisible3=false
                // this.editor1.info1.txt.clear()
                // this.timer = new Date().getTime()//每次都获取不同的时间
            },
            exportPdf(){
              this.$refs.editorBarData.editor.txt.html(this.editor.info)
                console.log(this.editor.info);
                this.baseData=this.$refs.editorBarData.editor.txt.html()
                this.$api.convertHtmlPDF({html:this.baseData}).then((res) => {
                    if (res.errorcode == 0) {
                        this.dialogVisible3=false
                        this.PreviewPath=window.g.ApiUrl+'/'+res.data
                    } else {
                        this.$message.error(res.msg)
                    }
                });

                // console.log(this.$refs.editorBarData.editor.txt.text());
                // this.$setDomBase('#barName',res =>{
                //       console.log(res);
                //       this.baseData=res
                //       this.dialogVisible3=false
                //   })
            },

            openFullScreen2() {
                this.loading = this.$loading({
                    lock: true,
                    text: '传真发送中...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
            },

            GetDateStr(AddDayCount) {
                let dd = new Date();
                dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
                let y = dd.getFullYear();
                let m = (dd.getMonth()+1)<10?"0"+(dd.getMonth()+1):(dd.getMonth()+1);//获取当前月份的日期，不足10补0
                let d = dd.getDate()<10?"0"+dd.getDate():dd.getDate();//获取当前几号，不足10补0
                return y+"-"+m+"-"+d;
            },
            /**
             * @author hexinting
             * @date 2020-9-29
             * @lastAuthor hexinting
             * @lastDate 2020-9-29
             * @description 传真通讯录点击方法
             */ 
            faxRowNodeClick(row) {
                this.rowItemData = row
                let treeData
                if (row.disabled) {
                    if (row.children.length == 0) {
                        let data = {
                            pid: row.id,
                            code: 'governmentAffairs' // 添加参数（根据融合通讯的来）
                            // type: 'fax'
                        }
                        this.$szApi.phoneGruopList(data).then((res) => {
                            if (res.errorcode == 0) {
                                treeData = res.data
                                treeData.forEach(item => {
                                    const newChild = {
                                        label: item.label,
                                        children: item.children,
                                        disabled: item.disabled,
                                        id: item.id,
                                        mobile: item.mobile,
                                        officeTel: item.officeTel,
                                        otherTel: item.otherTel,
                                        position: item.position,
                                        temobile: item.temobile,
                                        workUnit: item.workUnit,
                                        fax: item.fax
                                    };
                                    if (!row.children) {
                                        this.$set(row, 'children', []);
                                    } else {
                                        console.log(row);
                                        row.children.push(newChild);
                                    }

                                })


                            } else {
                                // //this.$message.error(res.msg)
                            }
                        });
                    }
                }
            },
            handleCheckChange(arr) {
                this.leftTreeData = arr;
            },
            getClickChildrenData() {
                if (this.rowItemData.disabled) {
                    let data = {
                        pid: this.rowItemData.id
                    }
                    this.$szApi.phoneGruopList(data).then((res) => {
                        if (res.errorcode == 0) {
                            console.log(res.data);
                            let data = res.data
                            return data
                        } else {
                            // //this.$message.error(res.msg)
                        }
                    });
                }
            },
            msgWith(tab) { //左边Tabs
                this.msgTableWith = tab.label
                switch (tab.label) {
                    case '通讯录':
                        break;
                    case '最近联系人':
                        break;
                    case '快捷组':
                        break;
                    default:
                        break;
                }
            },
            //手动输入传真号添加
            pushListNumber() {
                let faxCheck = /^((\+?[0-9]{2,4}\-[0-9]{3,4}\-)|([0-9]{3,4}\-))?([0-9]{7,8})(\-[0-9]+)?$/; //传真号码校验
                if (this.FaxinputData == '' || this.FaxinputData == null) {
                    this.$message({
                        message: '请先填写传真号!',
                        type: 'warning'
                    });
                    return
                }else if(!this.FaxinputData.match(faxCheck)){
                    this.$message({
                        message: '请输入正确的传真号码!',
                        type: 'warning'
                    });
                    return
                }
                let spliceData = this.checkedList
                let temporaryArr = spliceData
                temporaryArr.push({
                    id: this.FaxinputData,
                    label: this.FaxinputData,
                    fax: this.FaxinputData
                })
                for (let i = 0; i < temporaryArr.length; i++) { //数组冒泡去重
                    for (let j = i + 1; j < temporaryArr.length; j++) {
                        if (temporaryArr[i].id == temporaryArr[j].id) {
                            temporaryArr.splice(j, 1);
                            j--;
                        }
                    }
                }
                this.checkedList = temporaryArr
                this.numberOfRecipients = this.checkedList.length //总共多少人
            },
            /**
             * @author hexinting
             * @date 2020-9-29
             * @lastAuthor hexinting
             * @lastDate 2020-9-29
             * @description 添加list
             */
            addList() {
                let arrObj = this.checkedList //把多选已经有了的数据赋值过来
                let noFaxMans = []; // 没有传真号码的联系人名字
                console.log(this.leftTreeData)
                this.leftTreeData.forEach(item => { //再把从节点获取到的数据赋值进最后的出的数组
                    if(item.fax){
                        arrObj.push({
                            id: item.id,
                            label: item.label,
                            fax:item.fax
                        })
                    }else{
                      noFaxMans.push(item.label);
                    }
                });
                if (noFaxMans.length > 0) { // 若有联系人传真号码为空，给提醒
                  this.$message.error(noFaxMans.join(',') + '  的传真号码为空，不能添加');
                }
                for (let i = 0; i < arrObj.length; i++) { //数组冒泡去重
                    for (let j = i + 1; j < arrObj.length; j++) {
                        if (arrObj[i].id == arrObj[j].id) {
                            arrObj.splice(j, 1);
                            j--;
                        }
                    }
                }
                this.checkedList = arrObj //得到最后的结果赋值给右侧
                this.numberOfRecipients = this.checkedList.length //总共多少人
                this.$refs.smsPhoneTree.delectAllData(); // 清空tree勾选节点
                this.$refs.quickGroup.delectAllData(); // 清空tree勾选节点
            },
            delectList() { //删除list
                this.checkedList = this.checkedList.filter(items => { //数组过滤
                    return !this.checkedCities.includes(items.id)
                });
                this.checkedCities = []
                this.numberOfRecipients = this.checkedList.length //总共多少人
            },
            emptyManage() { //清空
                this.checkedList = []
                this.numberOfRecipients = this.checkedList.length //总共多少人
            },
            selectTarget(){
                console.log(this.checkedList);
                let name = '';
                this.checkedList.forEach((item,i) => {
                    i==this.checkedList.length - 1? name += item.label: name += item.label + '，';
                });
                this.sendTarget = name;
                this.dialogVisible = false;
            },
            //文件上传成功时的函数
            onSuccess(response, file) {
                if (response.errorcode == 0) {
                    this.faxItemName = file.name
                    this.PreviewPath = window.g.ApiUrl + '/' + response.data
                }else {
                    this.$message.warning(response.msg);
                }

            },
            beforeUpload(file) { //利用假上传获取文件判断格式
              let  content=this.$refs.editorBarData.editor.txt.text()
              if(['',null].includes(content)){
                    this.uploadForm.push(file);
                    let testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
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
                    if (!extension && !extension2 && !extension3 && !extension4 && !extension5 && !extension6 &&
                        !extension7 && !extension8 && !extension9 && !extension10 && !extension11) {
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
                    return extension || extension2 || extension3 || extension4 || extension5 || extension6 || extension7 ||
                        extension8 || extension9 || extension10 || extension11
                }else {
                    this.$message({
                        message: '只能选择一种上传传真的类型',
                        type: 'warning'
                    });
                    return false
                }

            },
            //一键复制把数据复制到文本域
            copyToTextarea(val){
                this.textarea += val;
            },
            submitUpload(){
                console.log(this.uploadForm,this.FaxTitle,this.timingSend,this.textarea,this.checkedList);
                if (this.uploadForm == ''&&this.baseData=='') {
                    this.$message.warning("请选择需要发送的传真文件!");
                    return;
                }
                if (this.checkedList.length == 0) {
                    this.$message.warning("请选择发送目标!");
                    return;
                } else {
                    this.$confirm('确认发送?', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.openFullScreen2()
                        this.sendFax();
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消发送'
                        });
                    });
                }
            },
            sendFax(){
                let faxNumber = '';
                let contactorIds = '';
                for (let i = 0; i < this.checkedList.length; i++) {
                    i==this.checkedList.length - 1? faxNumber += this.checkedList[i].fax: faxNumber += this.checkedList[i].fax + ',';
                    if(this.checkedList[i].id == this.checkedList[i].fax){
                        i==this.checkedList.length - 1? contactorIds += '0': contactorIds += '0,';
                    }else{
                        i==this.checkedList.length - 1? contactorIds += this.checkedList[i].id: contactorIds += this.checkedList[i].id+',';
                    }
                }
                if (!this.timingSend) {
                    this.timingSend = new Date();
                }
                console.log(faxNumber,contactorIds);
                let datas = {
                    faxSendTime: this.timingSend,
                    remark: this.textarea,
                    faxName: this.FaxTitle,
                    contactorId: contactorIds
                };
                let formData = new FormData();
                if(this.uploadForm[0]){
                    formData.append("data", JSON.stringify(datas));
                    formData.append("file", this.uploadForm[0]);
                    formData.append('phoneNum', faxNumber);
                    formData.append('contactorId', contactorIds);
                }else {
                    formData.append("data", JSON.stringify(datas));
                    // formData.append("file", this.uploadForm[0]);
                    formData.append('phoneNum', faxNumber);
                    formData.append('contactorId', contactorIds);
                    formData.append('html', this.baseData);
                }
                this.$api.sendFax(formData).then((res) => {
                    if (res.errorcode == 0 && !res.data) {
                        this.$message({
                            message: '发送中...',
                            type: 'success'
                        });
                        this.loading.close()
                        this.$emit('rushContent')

                    } else {
                        this.$message.error('发送失败');
                        this.loading.close()
                    }
                }).catch(error=>{
                    this.loading.close()
                });
            }

        },

    }
</script>

<style scoped>
  #dailList>>>.el-card__body {
    padding: 0;
  }

  #dailList>>>.el-card {
    height: 80px;
    overflow: auto;
  }

  .arrowButton {
    margin-bottom: 20px;
    text-align: center;
  }

  .eventList {
    width: 100%;
    height: 39px;
    text-align: center;
    line-height: 39px;
    background-color: cornflowerblue;
    color: white;
  }

  #boxCard>>>.el-card__body {
    padding: 20px 20px 20px 0;
  }

  #checkedList>>>.el-checkbox {
    display: inline-block;
    width: 100%;
    margin-right: 0;
    text-indent: 5px;
    line-height: 35px;
    text-align: left;
  }
  .faxArea{
    width: 99%;
    height: 250px;
    border: 2px solid rgba(220,223,230,1);
    background-image: url(../../../../../static/img/faxArea.svg);
    background-position:center;
    background-repeat:no-repeat;
  }
  #timingSend >>>.el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 100%;
  }

  >>>.dialog-fade-enter-active .el-dialog.way{
    animation: anim-open .3s;
  }
  >>>.dialog-fade-leave-active .el-dialog.way{
    animation: anim-close .3s;
  }
  @keyframes anim-open {
    0% {
      transform: translate3d(0,-100% , 0);
      opacity: 0;
    }
    100% {
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
  }
  @keyframes anim-close {
    0% {
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
    100% {
      transform: translate3d(100%, 0, 0);
      opacity: 0;
    }
  }

  >>>.w-e-text-container{
    z-index: 100!important;
  }

</style>
