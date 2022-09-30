<!--@author：yf-->
<template>
  <div>
    <el-table
      :max-height="tableConfig.height"
      ref="myTable"
      :data="tableData"
      :header-cell-style="{background:'#F9FCFF',color:'#333333'}"
      highlight-current-row
      v-loading="tableConfig.loading || false"
      @select="selectRow"
      @row-click="rowClick"
      @select-all="selectAll"
      @selection-change="selectionChange"
      v-drag
    >
      <!-- 当前行数据对应右边的数据，右边数据改了之后，表格也需要高亮的话，就加上这两个属性 -->
      <!-- :row-key="tableConfig.rowKey" -->
      <!-- :current-row-key="tableConfig.currentRowKey" -->

      <el-table-column type="selection" width="50" v-if="tableConfig.selection"></el-table-column>
      <el-table-column type="index" width="50" v-if="tableConfig.index"></el-table-column>

      <template v-for="(item) in tableColumn">
        <!--基本头部-->
        <el-table-column
          v-if="!item.slot"
          show-overflow-tooltip
          min-width="80"
          :align="item.center"
          :key="item.prop"
          :label="item.label"
          :prop="item.prop"
          :width="item.width"
          resizable
        ></el-table-column>
        <!--插槽slot-->
        <el-table-column
          v-else
          min-width="80"
          show-overflow-tooltip
          :align="item.center"
          :key="item.prop"
          :label="item.label"
          :prop="item.prop"
          :width="item.width"
          resizable
        >
          <template slot-scope="scope">
            <slot :name="item.prop" :slotData="scope.row"></slot>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
export default {
    props: {
        // 表格表头
        tableColumn: {
            type: Array,
            default: [],
        },
        // 数据
        tableData: {
            type: Array,
            default: [],
        },
        // 配置
        tableConfig: {
            type: Object,
            default: null,
        },
        //对于列表中唯一的字段myKey默认为id
        myKey: {
            type: String,
            default: "id"
        }
    },
    /**
     * @author husiyue
     * @date 2021-01-13
     * @lastEditor husiyue
     * @lastDate 2021-01-13
     * @description 拖拽多选功能，bug10015
    */
    directives: {
        drag: {
            // 指令的定义
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
                    console.log(Math.abs(_x - startX)<5 && Math.abs(_y - startY))
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
                            vnode.context.$refs.myTable.toggleRowSelection(ele,false)
                        })
                        flag = false;
                    }
                    if (vnode.context.mouseflag) {
                        if (selDiv.style.display == "none") {
                            selDiv.style.display = "";
                        }
                        var scrolling = ''
                        console.log(oDiv.getElementsByClassName("is-scrolling-none"))
                        if(oDiv.getElementsByClassName("is-scrolling-none").length > 0){
                            scrolling=oDiv.getElementsByClassName("is-scrolling-none");
                        }else{
                            scrolling=oDiv.getElementsByClassName("is-scrolling-left");
                        }
                        console.log(scrolling[0])
                        console.log(Math.min(_x, startX)-left+scrolling[0].scrollLeft + "px")
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
                                    vnode.context.$refs.myTable.toggleRowSelection(vnode.context.tableData[i],true)
                                    //把选中的都存入到table标签中的已选中
                                    if(vnode.context.tableData[i])
                                        vnode.context.multipleSelection.push(vnode.context.tableData[i]);
                                }
                            } else {
                                if (selList[i].className.indexOf("seled") != -1 ) {                                 
                                    selList[i].className = "el-table__row";
                                    vnode.context.$refs.myTable.toggleRowSelection(vnode.context.tableData[i],false);
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
        };
    },
    methods: {
        /** 
         * @author hexinting
         * @date 2021-01-28
         * @param {type} 没有
         * @return {type} undefined
         * @description：选择项发生变化时会触发该事件
        */ 
        selectionChange(rows){
            // console.log("selectionChange",rows)
            this.$emit('selectionChange',rows)
        },
        /** 
         * @author qinjiaqi
         * @date 2020-01-11
         * @param {type} 没有
         * @return {type} undefined
         * @description：翻页滚动条自动回到顶部
        */  
        changePage() {
            this.$nextTick(()=>{
                this.$refs.myTable.bodyWrapper.scrollTop=0;
            })
        },
        // 某一行被点击时会触发该事件
        // rowClick(row) {
        //     console.log("某一行被点击时会触发该事件")
        //     this.$emit('rowClick', row);
        // },
        // 勾选数据行的 Checkbox 时触发的事件
        selectRow(rows, row) {
            console.log('selectRow', rows, row);
            this.$emit('selectrow', rows, row);
        },
        // 勾选全选的 Checkbox 时触发的事件
        selectAll(rows) {
            console.log('selectAll', rows);
            this.$emit('selectallrow', rows);
        },
        toggleRowSelection(rows, msg) {
            if (msg === '最近联系人') {
                this.tableData.forEach((e, i) => {
                    if (e.contactorId === 0) {
                        this.$refs.myTable.toggleRowSelection(
                            this.tableData[i],
                            false
                        );
                    }
                });
                rows.forEach((rowsE, rowI) => {
                    this.tableData.forEach((tabE, tabI) => {
                        if (rowsE === tabE.contactorId) {
                            this.$refs.myTable.toggleRowSelection(
                                this.tableData[tabI],
                                false
                            );
                        }
                    });
                });
            } else if (msg === '短信最近联系人') {
                this.tableData.forEach((e, i) => {
                    if (!/^[1][3,4,5,6,7,8][0-9]{9}$/.test(e.call)) {
                        console.log('delete ', this.tableData[i]);
                        this.$refs.myTable.toggleRowSelection(
                            this.tableData[i],
                            false
                        );
                    }
                });
                rows.forEach((rowsE, rowI) => {
                    this.tableData.forEach((tabE, tabI) => {
                        if (rowsE === tabE.contactorId) {
                            if (
                                !(
                                    rowsE == '0' &&
                                    /^[1][3,4,5,6,7,8][0-9]{9}$/.test(tabE.call)
                                )
                            ) {
                                this.$refs.myTable.toggleRowSelection(
                                    this.tableData[tabI],
                                    false
                                );
                            }
                        }
                    });
                });
            } else if (rows) {
                rows.forEach((rowsE, rowI) => {
                    this.tableData.forEach((tabE, tabI) => {
                        if (
                            rowsE.id === tabE.id ||
                            rowsE.id === tabE.contactorId
                        ) {
                            this.$refs.myTable.toggleRowSelection(
                                this.tableData[tabI],
                                false
                            );
                        }
                    });
                });
            } else {
                this.$refs.myTable.clearSelection();
            }
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
        rowClick(row, event, column) {
            if(this.tableConfig.selection){
                let flag=true;           
                //确定当前的row的index
                var index = 0;
                this.tableData.forEach((ele,i)=>{
                    if(ele[this.myKey] == row[this.myKey]){
                        index = i+1;
                    }
                })
                this.toggleShow = false;
                //如果有就移除
                this.multipleSelection.forEach((ele,i)=>{
                    if(ele[this.myKey]==row[this.myKey]){
                        this.$refs.myTable.toggleRowSelection(row,false);
                        //element的方法用不了 只能自己改变类名
                        this.$refs.myTable.$el.getElementsByTagName("tr")[index].className = "el-table__row";
                        this.multipleSelection.splice(i,1);
                        flag = false;
                    }
                })
                //如果没有就push
                if(flag){
                    this.$refs.myTable.toggleRowSelection(row,true);
                    this.multipleSelection.push(row);
                    //element的方法用不了 只能自己改变类名
                    this.$refs.myTable.$el.getElementsByTagName("tr")[index].className = "el-table__row seled";
                }
            }
            console.log(row)
            this.$emit('rowClick', row);  
            this.$emit('selectrow', this.multipleSelection);     
        },
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
        }
    },

};
</script>
<style scoped>
>>> .el-table td {
    height: 50px;
    padding: 5px 0;
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
