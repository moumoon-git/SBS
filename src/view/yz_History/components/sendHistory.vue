<template>
  <div>
    <el-table
      :data="tableData"
      ref="refTable1"
      style="width: 100%;"
      @row-click = "clickRow"
      @select = "selectRow"
      @select-all="selectAll"
      :header-cell-style="{background:'rgba(249,252,255,1)',color:'#black'}"
      highlight-current-row
      v-drag
    >
      <el-table-column type="selection" width="50" v-if="tableConfig.selection"></el-table-column>
      <!-- <el-table-column type="groupNum" width="80">
        <template slot-scope="scope"> -->
          <!-- <el-radio :label="scope.row.groupNum" v-model="radio" class="textRadio">&nbsp;</el-radio> -->
        <!-- </template>
      </el-table-column> -->
      <el-table-column prop="type" label="发送类型" width="140">
        <template slot-scope="scope">
          <span>{{scope.row.type?scope.row.type:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="发送时间" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.sendTime">{{scope.row.sendTime.slice(0,10)}}</span>
          <br />
          <span
            v-if="scope.row.sendTime"
            style="text-align: left"
          >{{isYangZhouProject?scope.row.sendTime.slice(11,16):scope.row.sendTime.slice(10)}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <!--    <el-table-column-->
      <!--      prop="address"-->
      <!--      label="发送状态"-->
      <!--      width="124">-->
      <!--    </el-table-column>-->
      <el-table-column prop="total" label="收信人数" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.total?scope.row.total:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="成功" width="110">
        <template slot-scope="scope">
          <span style="color:#0BD295;">{{scope.row.success?scope.row.success:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="失败" width="110">
        <template slot-scope="scope">
          <span style="color:#F46666">{{scope.row.failed?scope.row.failed:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="事件标题" show-overflow-tooltip width="140">
        <template slot-scope="scope">
          <span style="white-space: nowrap">{{scope.row.eventTitle?scope.row.eventTitle:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="短信内容" show-overflow-tooltip>
        <template slot-scope="scope">
          <span style="white-space: nowrap">{{scope.row.content?scope.row.content:'-'}}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--    <el-pagination v-if="totalElements>=10" background layout="prev, pager, next" :total="totalElements"-->
    <!--                   :current-page.sync="selectPage"  @current-change="box_lookup"></el-pagination>-->
  </div>
</template>

<script>
export default {
    name: 'sendHistory',
    // props: ['sendTable', 'size', 'tableConfig'],
    props:{
      sendTable:{
        type: [Object,Array],
        default: () => {
          return {};
        },
      },
      // queryAllData,
      // clickQueryAll,
      size:{
        type: Number
      },
      // 配置
      tableConfig:{
        type: Object,
        default: null,
      },
      //对于列表中唯一的字段myKey默认为id
      myKey: {
          type: String,
          default: "groupNum"
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
                document.getElementsByClassName("el-table__body")[1].appendChild(selDiv);
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
                            vnode.context.$refs.refTable1.toggleRowSelection(ele,false)
                        })
                        flag = false;
                    }
                    if (vnode.context.mouseflag) {
                        if (selDiv.style.display == "none") {
                            selDiv.style.display = "";
                        }
                        var scrolling=''
                        if(oDiv.getElementsByClassName("is-scrolling-none").length > 0){
                            scrolling=oDiv.getElementsByClassName("is-scrolling-none");
                        }else{
                            scrolling=oDiv.getElementsByClassName("is-scrolling-left");
                        }
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
                                    vnode.context.$refs.refTable1.toggleRowSelection(vnode.context.tableData[i],true)
                                    //把选中的都存入到table标签中的已选中
                                    if(vnode.context.tableData[i])
                                        vnode.context.multipleSelection.push(vnode.context.tableData[i]);
                                }
                            } else {
                                if (selList[i].className.indexOf("seled") != -1 ) {                                 
                                    selList[i].className = "el-table__row";
                                    vnode.context.$refs.refTable1.toggleRowSelection(vnode.context.tableData[i],false);
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
                        document.getElementsByClassName("el-table__body")[1].removeChild(selDiv);
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
            totalElements: 0,
            // radio: '',
            rowActived: {},
            selectPage: 1,
            isYangZhouProject: window.g.IsYangZhouProject,
            //指令中确定的时候是鼠标按下事件
            mouseflag: false,
            //选中的数组
            multipleSelection: [],
            //控制右键菜单弹出显示
            // dialogVisible:false,
            //分页当前的页数
            currentPage:1 ,
            //当前右键点击的列
            // currentRow:[],
            //当前滚动的距离，
            targetScroll:0,
        };
    },
    watch: {
        //点击搜索时执行
        sendTable: function(newVal, oldVal) {
            this.tableData = this.sendTable.data;
            console.log(this.sendTable)
            // console.log(this.tableData[0])
            // if (this.tableData[0]) {
            //     this.radio = this.tableData[0].groupNum;
            // }
        },
        // radio: function(newVal, oldVal) {
        //     this.tableData.forEach((val, index) => {
        //         if (val.groupNum === newVal) {
        //             this.$emit('changeSMS', newVal, val);
        //             this.rowActived = val;
        //         }
        //     });
        //     // this.$emit('changeSMS',newVal,this.rowActived)
        //     // console.log('rowActived',newVal, this.rowActived)
        // },
    },
    created() {},
    methods: {
        /** 
         * @author qinjiaqi
         * @date 2020-01-13
         * @param {type} 没有
         * @return {type} undefined
         * @description：翻页滚动条自动回到顶部
        */  
        changePage() {
          this.$nextTick(()=>{
            this.$refs.refTable1.$el.parentNode.scrollTop=0
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
        // handleSelectionChange(val) {
        //   this.multipleSelection = val;
        //   console.log(this.multipleSelection)
        // },
        initData() {
            let data = {
                startTime: '',
                endTime: '',
                type: 0,
                searchText: '',
                page: 1,
                size: this.size,
            };
            this.$api.smsSendRecord(data).then(res => {
                // 返回的数据赋值给table
                if (res.errorcode != 0) {
                    this.$message({
                        message: res.msg,
                        type: 'error',
                    });
                    return;
                }
                if (!res.data) {
                    this.$message({
                        message: res.msg,
                        type: 'error',
                    });
                    return;
                }
                this.$nextTick(() => {
                    let data = res.data;
                    this.totalElements = data.totalElements;
                    console.log(data)
                    this.tableData = data.data;
                    // if (this.tableData[0]) {
                    //     this.rowActived = this.tableData[0];
                    //     this.radio = this.rowActived.groupNum;
                    // }
                });
            });
        },
        clickRow(row, col) {
            // this.radio = row.groupNum
            // if (this.radio != row.groupNum) {
            //     this.radio = row.groupNum;
            //     this.rowActived = row;
            //     this.$emit('changeSMS', this.radio, row);
            //     // console.log(this.radio)
            // }
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
                      this.$refs.refTable1.toggleRowSelection(row,false);
                      //element的方法用不了 只能自己改变类名
                      this.$refs.refTable1.$el.getElementsByTagName("tr")[index].className = "el-table__row";
                      this.multipleSelection.splice(i,1);
                      flag = false;
                  }
              })
              //如果没有就push
              if(flag){
                  this.$refs.refTable1.toggleRowSelection(row,true);
                  this.multipleSelection.push(row);
                  //element的方法用不了 只能自己改变类名
                  this.$refs.refTable1.$el.getElementsByTagName("tr")[index].className = "el-table__row seled";
              }
          }
          // this.$emit('changeALL',row)
          console.log(row)
          this.$emit('changeSMS', row);
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
        //                 this.$refs.refTable1.toggleRowSelection(row,false);
        //                 //element的方法用不了 只能自己改变类名
        //                 this.$refs.refTable1.$el.getElementsByTagName("tr")[index].className = "el-table__row";
        //                 this.multipleSelection.splice(i,1);
        //                 flag = false;
        //             }
        //         })
        //         //如果没有就push
        //         if(flag){
        //             this.$refs.refTable1.toggleRowSelection(row,true);
        //             this.multipleSelection.push(row);
        //             //element的方法用不了 只能自己改变类名
        //             this.$refs.refTable1.$el.getElementsByTagName("tr")[index].className = "el-table__row seled";
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
        box_lookup(page) {
            let data = {
                startTime: '',
                endTime: '',
                type: 0,
                searchText: '',
                page: page,
                size: 10,
            };
            this.$api.smsSendRecord(data).then(res => {
                // 返回的数据赋值给table
                if (res.errorcode != 0) {
                    this.$message({
                        message: res.msg,
                        type: 'error',
                    });
                    return;
                }
                if (!res.data) {
                    this.$message({
                        message: res.msg,
                        type: 'error',
                    });
                    return;
                }
                this.$nextTick(() => {
                    let data = res.data;
                    this.totalElements = data.totalElements;
                    this.tableData = data.data;
                    // if (this.tableData[0]) {
                    //     this.rowActived = this.tableData[0];
                    //     this.radio = this.rowActived.groupNum;
                    // }
                });
            });
        },
    },
    mounted() {
        this.$emit('lookup', 1);
    },
};
</script>

<style scoped>
/deep/.el-table th > .cell {
    /*text-align: center;*/
    color: #333333;
}
/deep/.el-table .cell {
    /*text-align: center;*/
}
.el-pagination {
    text-align: right;
}
>>> .el-table .el-table__body-wrapper .el-table__row td {
    padding: 0;
    height: 25px;
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
