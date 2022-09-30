<template>
  <div class="msg_container">
    <el-table
      :data="tableData"
      ref="refTable"
      style="width: 100%;"
      :header-cell-style="{background:'rgba(249,252,255,1)',color:'black'}"
      @row-click = "clickRow"
      highlight-current-row
      @select="selectRow"
      @select-all="selectAll"
      v-loading="loading"
      v-drag>
      <el-table-column type="selection" width="50" v-if="tableConfig.selection"></el-table-column>
      <el-table-column
        label="收/发"
        width="100"
      >
        <template slot-scope="scope" >
          <div v-if="scope.row.direct == '发送'" style="display: inline-block; width: 11px;height: 11px;border-radius: 50%;background: #0BD295"></div>
          <div v-if="scope.row.direct == '接收'" style="display: inline-block; width: 11px;height: 11px;border-radius: 50%;background: #0091FF"></div>
          <span style="text-align: left">{{scope.row.direct}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="姓名/号码"
        width="135"
        >
        <template slot-scope="scope" >
          <span style="text-align: left">{{scope.row.contactor}}</span><br />
          <span style="text-align: left">{{scope.row.call}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="workUnit"
        label="单位"
        >
        <template slot-scope="scope">
          <span >{{scope.row.workUnit?scope.row.workUnit:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="position"
        label="职位"
        width="170">
        <template slot-scope="scope">
          <span >{{scope.row.position?scope.row.position:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="eventTitle"
        label="事件标题"
        width="170">
        <template slot-scope="scope">
          <span >{{scope.row.eventTitle?scope.row.eventTitle:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="sendTime"
        label="时间"
        width="100">
          <template slot-scope="scope" >
            <span style="text-align: left">{{isYangZhouProject?scope.row.sendTime.slice(11,16):scope.row.sendTime.slice(10)}}</span>
            <br />
            <span>{{scope.row.sendTime.slice(0,10)}}</span>
          </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="120">
        <template slot-scope="scope" >
          <el-button v-if="scope.row.status == '发送失败'" type="danger" class="temp">{{scope.row.status}}</el-button>
          <el-button v-if="scope.row.status == '发送成功'" type="success" class="temp">{{scope.row.status}}</el-button>
          <el-button v-if="scope.row.status == '已发送'" type="success" class="temp">{{scope.row.status}}</el-button>
          <el-button v-if="scope.row.status == '未读'" type="warning" class="temp">{{scope.row.status}}</el-button>
          <el-button v-if="scope.row.status == '已读'" type="primary" class="temp">{{scope.row.status}}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="receipt"
        label="回执"
        width="">
        <template slot-scope="scope" >
          <span v-if="scope.row.receipt">{{scope.row.receipt}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型"
        width="">
        <template slot-scope="scope" >
          <span >{{scope.row.type?scope.row.type:'-'}}</span>
        </template>
      </el-table-column>
    </el-table>
<!--    <el-pagination background layout="prev, pager, next" :total="totalElements"-->
<!--                  @current-change="box_lookup" current-page.sync="totalPages"-->
<!--    ></el-pagination>-->
  </div>
</template>

<script>
  export default {
    name: "msgAll",
    // props:['sendTable','queryAllData','clickQueryAll','size','tableConfig','myKey'],
    props:{
      sendTable:{
        type: [Array,Object],
        default: () => {
          return {};
        },
      },
      // queryAllData,
      // clickQueryAll,
      size:{
        type: Number,
      },
      // 配置
      tableConfig:{
        type: Object,
        default: null,
      },
      //对于列表中唯一的字段myKey默认为id
      myKey: {
          type: String,
          default: "id"
      }
    },
    directives: {
        drag: {
            /**
             * @author husiyue
             * @date 2021-01-13
             * @lastEditor husiyue
             * @lastDate 2021-01-13
             * @description 拖拽多选功能，bug10015
            */
            inserted: function (el, binding, vnode) {
                var oDiv = el;
                //监听用户鼠标事件
                oDiv.onmousedown = function (ev) {
                //初始化不显示
                vnode.context.toggleShow=false;  
                //确保用户在移动鼠标的时候只初始化一次选中
                var flag = true;
                //用来存储列表
                var selList = [];
                //获得指令下的dom对应的表格
                var fileNodes = oDiv.getElementsByTagName("tr");    
                var countI = 0;
                //获得鼠标
                var evt = window.event || arguments[0];
                var startX = (evt.x || evt.clientX);
                var startY = (evt.y || evt.clientY);
                var top,left;
                //时时获得
                top=getY(oDiv);
                left=getX(oDiv);
                var selDiv = document.createElement("div");
                selDiv.style.cssText = "position:absolute;width:0px;height:0px;font-size:0px;margin:0px;padding:0px;border:1px dashed #0099FF;background-color:#C3D5ED;z-index:1000;filter:alpha(opacity:60);opacity:0.6;display:none;";
                selDiv.id = "selectDiv";
                document.getElementsByClassName("el-table__body")[0].appendChild(selDiv);
                selDiv.style.left = startX + "px";
                console.log(selDiv.style.left)
                selDiv.style.top = startY + "px";
                var _x = null;
                var _y = null;
                vnode.context.clearEventBubble(evt);
                // //打开开关
                vnode.context.mouseflag = true;
                // //鼠标拖动时画框
                document.onmousemove = function (ev) {
                    evt = window.event || arguments[0];
                    _x = (evt.x || evt.clientX);
                    _y = (evt.y || evt.clientY);
                    //为了确定是点击事件还是移动事件
                    console.log(Math.abs(_x - startX), Math.abs(_y - startY))
                    if(Math.abs(_x - startX)<5 && Math.abs(_y - startY)<5){
                        return;
                    }else{
                        vnode.context.$handleSelect();
                    }
                    //为了确保只有一次的渲染每次框选都把默认选中为空
                    if(flag){
                        //重置选中css
                        for (var i = 0; i < fileNodes.length; i++) {
                            if (fileNodes[i].className.indexOf("el-table__row") != -1) {
                                fileNodes[i].className = "el-table__row";
                                selList.push(fileNodes[i]);
                            }
                        }     
                        vnode.context.multipleSelection=[]
                        vnode.context.tableData.forEach((ele)=>{
                            vnode.context.$refs.refTable.toggleRowSelection(ele,false)
                        })
                        flag = false;
                    }
                    if (vnode.context.mouseflag) {
                        if (selDiv.style.display == "none") {
                            selDiv.style.display = "";
                        }
                        // var scrolling=oDiv.getElementsByClassName("is-scrolling-none");
                        var scrolling='';
                        if(oDiv.getElementsByClassName("is-scrolling-none").length > 0){
                            scrolling=oDiv.getElementsByClassName("is-scrolling-none");
                        }else{
                            scrolling=oDiv.getElementsByClassName("is-scrolling-left");
                        }
                        // if(oDiv.getElementsByClassName("is-scrolling-none").length > 0){
                        //   scrolling=oDiv.getElementsByClassName("is-scrolling-none");
                        // }else{
                        //   scrolling=oDiv.getElementsByClassName("is-scrolling-left");
                        // }
                        console.log(scrolling)
                        console.log(Math.min(_x, startX)-left+scrolling[0])
                        selDiv.style.left = Math.min(_x, startX)-left+scrolling[0].scrollLeft + "px";
                        //48是表头的高度
                        selDiv.style.top = Math.min(_y, startY)-top - 48+scrolling[0].scrollTop+ "px";
                        selDiv.style.width = Math.abs(_x - startX) + "px";
                        selDiv.style.height = Math.abs(_y - startY) + "px";

                        // ---------------- 关键算法确定列表的选中靠的是index---------------------
                        var _l = selDiv.offsetLeft, _t = selDiv.offsetTop;
                        var _w = selDiv.offsetWidth, _h = selDiv.offsetHeight;
                        for (var i = 0; i < selList.length; i++) {
                            var sl = selList[i].offsetWidth + selList[i].offsetLeft;
                            var st = selList[i].offsetHeight + selList[i].offsetTop;
                            if (sl > _l && st > _t && selList[i].offsetLeft < _l + _w && selList[i].offsetTop < _t + _h) {
                                if (selList[i].className.indexOf("seled") == -1) {                                    
                                    selList[i].className = selList[i].className + " seled";
                                    vnode.context.$refs.refTable.toggleRowSelection(vnode.context.tableData[i],true)
                                    //把选中的都存入到table标签中的已选中
                                    if(vnode.context.tableData[i])
                                        vnode.context.multipleSelection.push(vnode.context.tableData[i]);
                                }
                            } else {
                                if (selList[i].className.indexOf("seled") != -1 ) {                                 
                                    selList[i].className = "el-table__row";
                                    vnode.context.$refs.refTable.toggleRowSelection(vnode.context.tableData[i],false);
                                    vnode.context.multipleSelection.forEach((ele,i)=>{
                                        //这里没用对象是否相等用的是传入table中的唯一的myKey字段
                                        if(ele[vnode.context.myKey]==vnode.context.tableData[i][vnode.context.myKey] ){
                                            vnode.context.multipleSelection.splice(i,1);
                                        }
                                    })
                                }
                            }
                        }
 
                    }
                    vnode.context.clearEventBubble(evt);
                };
                //方法是确定列表到屏幕的位置
                function getX(obj){
                    var parObj=obj;
                    var left=obj.offsetLeft;
                    while(parObj=parObj.offsetParent){
                        left+=parObj.offsetLeft;
                    }
                    return left;
                }
                //方法是确定列表到屏幕的位置
                function getY(obj){
                    var parObj=obj;
                    var top=obj.offsetTop;
                    while(parObj = parObj.offsetParent){
                        top+=parObj.offsetTop;
                    }
                    return top;
                }
                //在鼠标抬起后做的重置
                document.onmouseup = function () {
                    console.log(Math.abs(_x - startX)<5 && Math.abs(_y - startY))
                    //把鼠标移动事初始化
                    document.onmousemove=null;
                    if (selDiv) {
                        document.getElementsByClassName("el-table__body")[0].removeChild(selDiv);
                    }
                    console.log(Math.abs(_x - startX)<5 && Math.abs(_y - startY))
                    selList = null, _x = null, _y = null, selDiv = null, startX = null, startY = null, evt = null;
                    vnode.context.mouseflag = false;
                    // vnode.context.$handleSelect();
                };
            };
        }
        }
    },
    data() {
      return {
        tableData: [],
        totalElements:0,
        totalPages:0,
        loading:false,
        isYangZhouProject:window.g.IsYangZhouProject,
        //指令中确定的时候是鼠标按下事件
        mouseflag: false,
        //选中的数组
        multipleSelection: [],
        //控制右键菜单弹出显示
        dialogVisible:false,
        //分页当前的页数
        currentPage:1 ,
        //当前右键点击的列
        // currentRow:[],
        //当前滚动的距离，
        targetScroll:0
      }
    },
    watch:{
      'sendTable.data':function (newVal) {
        console.log(newVal)
        this.tableData = this.sendTable.data
        this.totalElements = this.sendTable.totalElements
        this.totalPages = parseInt(this.sendTable.totalPages)
        console.log('点击搜索了')
      },

    },
    mounted() {
      if (!this.$route.query.type){
        this.$emit("getStatusOptions",true)
      }
    },
    methods:{
        /** 
         * @author qinjiaqi
         * @date 2020-01-13
         * @param {type} 没有
         * @return {type} undefined
         * @description：翻页滚动条自动回到顶部
        */  
        changePage() {
          this.$nextTick(()=>{
            this.$refs.refTable.$el.parentNode.scrollTop=0
          })
        },
        selectRow(rows) {
            console.log('selectRow', rows);
            this.$emit('selectrow', rows);
        },
        selectAll(rows) {
            console.log('selectAll', rows);
            this.$emit('selectallrow', rows);
        },
      init(page){
        this.loading = true;
        let data = {
          id:'',
          dtStart: '',
          dtEnd: '',
          // smsType:'',
          page:page,
          size: this.size,
          status:0,
          smsId:'',
          searchText:'',
          direct:'',
        };
        this.queryData = data
        this.$api.lishijilu(data).then((res) => {
          // 返回的数据赋值给table
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return
          }
          if(!res.data){
            this.$message({
              message: res.msg,
              type: "error"
            });
            return
          }

          let temp = res.data
          // 区分发送和接受的号码
          temp.data.forEach(item=>{
            item['number'] = item['call']
          })

          this.totalElements = temp.totalElements
          this.totalPages = parseInt(temp.totalPages)
          this.tableData = temp.data
          this.loading = false;
          if(temp.data[0]){
            //默认选中第一个
            this.$nextTick(()=>{
              let content = temp.data[0]['content']
              let smsId = temp.data[0]['smsId']
              let eventId = temp.data[0]['eventId']
              let workUnit = temp.data[0]['workUnit']
              let direct = temp.data[0]['direct']

              console.log(temp.data[0])
              this.$emit('changeALL',temp.data[0])
            })
          }

        })
      },
      // box_lookup(page){
      //   this.queryData['page'] = page-1
      //   this.queryData = this.queryAllData
      //   // console.log(this.queryAllData + '111')
      //   let data = this.queryData
      //   this.$api.lishijilu(data).then(res=>{
      //     if (res.errorcode != 0) {
      //       this.$message({
      //         message: res.msg,
      //         type: "error"
      //       });
      //       return
      //     }
      //     if(!res.data){
      //       this.$message({
      //         message: res.msg,
      //         type: "error"
      //       });
      //       return
      //     }
      //     console.log(page)
      //     let temp = res.data
      //     this.totalElements = temp.totalElements
      //     this.totalPages = parseInt(temp.totalPages)
      //     this.tableData = temp.data
      //   })
      // },
      //列表单击选中事件
      clickRow(row, event, column){
        // let content = row['content']
        // let smsId = row['smsId']
        // let eventId = row['eventId']
        // let workUnit = row['workUnit']
        // let direct = row['direct']
        // alert(row)
        if(row.status == '未读'){
          // console.log(row.id)
          let data = {id:row.id}
          this.$api.smsRead(data).then(res=>{
            if(res.msg == 'SUCCESS'){
              row.status = '已读'
              this.$store.commit('SET_ANSWERNUM') //改变未读状态
            }
          })
        }
        
        // console.log(smsId,eventId,'111111111')
        if(this.tableConfig.selection){
            let flag=true;           
            //确定当前的row的index
            var index = 0;
            this.tableData.forEach((ele,i)=>{
              console.log(row[this.myKey])
                if(ele[this.myKey] == row[this.myKey]){
                    index = i+1;
                }
            })
            this.toggleShow = false;
            //如果有就移除
            this.multipleSelection.forEach((ele,i)=>{
                if(ele[this.myKey]==row[this.myKey]){
                    this.$refs.refTable.toggleRowSelection(row,false);
                    //element的方法用不了 只能自己改变类名
                    this.$refs.refTable.$el.getElementsByTagName("tr")[index].className = "el-table__row";
                    this.multipleSelection.splice(i,1);
                    flag = false;
                }
            })
            //如果没有就push
            if(flag){
                this.$refs.refTable.toggleRowSelection(row,true);
                this.multipleSelection.push(row);
                //element的方法用不了 只能自己改变类名
                this.$refs.refTable.$el.getElementsByTagName("tr")[index].className = "el-table__row seled";
            }
        }
        this.$emit('changeALL',row)
        console.log(row)
        this.$emit('selectrow', this.multipleSelection);    
        console.log(this.multipleSelection) 
      },
      //清除默认事件
      clearEventBubble(evt) {
          if (evt.stopPropagation)
              evt.stopPropagation();
          else
              evt.cancelBubble = true;
          if (evt.preventDefault)
              evt.preventDefault();
          else
              evt.returnValue = false;
      },
      //列表单击选中事件
      // rowClick(row, event, column) {
      //     if(this.tableConfig.selection){
      //         let flag=true;           
      //         //确定当前的row的index
      //         var index = 0;
      //         this.tableData.forEach((ele,i)=>{
      //             if(ele[this.myKey] == row[this.myKey]){
      //                 index = i+1;
      //             }
      //         })
      //         this.toggleShow = false;
      //         //如果有就移除
      //         this.multipleSelection.forEach((ele,i)=>{
      //             if(ele[this.myKey]==row[this.myKey]){
      //                 this.$refs.refTable.toggleRowSelection(row,false);
      //                 //element的方法用不了 只能自己改变类名
      //                 this.$refs.refTable.$el.getElementsByTagName("tr")[index].className = "el-table__row";
      //                 this.multipleSelection.splice(i,1);
      //                 flag = false;
      //             }
      //         })
      //         //如果没有就push
      //         if(flag){
      //             this.$refs.refTable.toggleRowSelection(row,true);
      //             this.multipleSelection.push(row);
      //             //element的方法用不了 只能自己改变类名
      //             this.$refs.refTable.$el.getElementsByTagName("tr")[index].className = "el-table__row seled";
      //         }
      //     }
      //     console.log(row)
      //     this.$emit('rowClick', row);  
      //     this.$emit('selectrow', this.multipleSelection);     
      // },
      //每页条数变化
      handleSizeChange(val) {
          // console.log(`每页 ${val} 条`);
      },
      //当批量选中结束调用
      $handleSelect(){
          // this.$emit('handleSelect',this.multipleSelection)
          this.$emit('selectrow', this.multipleSelection);
          console.log(this.multipleSelection)
          console.log(this.$parent.tableConfig)
          console.log(this.tableConfig.selection)
          // console.log(vnode.context.multipleSelection)
          if(this.tableConfig.selection == false){
              this.tableConfig.selection = true
              // this.$emit('tableConfig.selection',true)
          }
      },
      //监听表格的滚动
      handleScroll(e){
          this.targetScroll = e.target.scrollTop;         
      },
      //
      headerClassName(){
          return "air-table-header__class";
      },
    },
  }
</script>

<style scoped>
  /deep/.el-table th > .cell {
    text-align: center;
  }
  /deep/.el-table .cell {
    text-align: center;
  }
  .el-pagination {
    text-align: right;
  }
  .container {
    padding: 28px 0 0 0;
  }
  .temp.el-button.el-button--warning{
    background: #ff977a;
  }
  .temp{
    padding: 5px ;
    width: 78px;
    cursor:default;
  }
  >>>.el-table .el-table__body-wrapper .el-table__row td{
    padding: 0;
    height: 56px;
  }
  >>> .el-table__body tr.current-row>td{
    background-color: rgb(204, 228, 255, .7);
  }
  /* 表格鼠标悬浮时的样式（高亮 浮出） */
  >>> .el-table--enable-row-hover .el-table__body tr:hover {
      -webkit-transform: translateY(-3px);
      -ms-transform: translateY(-3px);
      transform: translateY(-3px);
      -webkit-box-shadow: 0 0 6px #999;
      box-shadow: 0 0 6px #999;
      -webkit-transition: all .5s ease-out;
      transition: all .5s ease-out;
  }
</style>
