<!--@author：wzm-->
<template>
  <div>
    <div class="contentStyle">
      <el-header v-if='!showSort' style=" height: 72px;line-height: 72px;">
        <div class="navsBar">
          <add-button @handleAdd="addClass"></add-button>&nbsp;&nbsp;
          <!-- 新增弹窗 -->
          <el-dialog title="班次管理" :close-on-click-modal="false" :visible.sync="dialogFormVisibleadd">
            <el-form :model="form">
              <el-form-item  label="班次名称" :label-width="formLabelWidth">
                <el-input v-model="form.class" auto-complete="off" maxlength='12'></el-input>
              </el-form-item>
              <el-form-item label="人数" :label-width="formLabelWidth">
                <el-input-number v-model="form.man"  :min="1" :max="100" label="描述文字"></el-input-number>
                <!-- <el-input v-model="form.man" auto-complete="off" max='99'></el-input> -->
              </el-form-item>
              <el-form-item label="时间" :label-width="formLabelWidth" style="text-align: left">
                <el-time-picker placeholder="起始时间" v-model="startTime" @change='changeTime()'></el-time-picker>
                <el-time-picker placeholder="结束时间" v-model="endTime" :picker-options="{selectableRange: minStartTime}">
                </el-time-picker>
              </el-form-item>
              <el-form-item  label="" :label-width="formLabelWidth" style="text-align: left">
                <el-checkbox v-model="checkedCities1" @change='changeTime()'>跨天值班</el-checkbox>
                <el-checkbox v-model="checkedCities2">领导班次</el-checkbox>
              </el-form-item>
              <el-form-item  label="类型" :label-width="formLabelWidth" style="text-align: left">
                <el-select v-model="value" placeholder="请选择">
                  <el-option  v-for="(item,index) in options" :key="index" :label="item.name" :value="item.id"></el-option></el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="unadd">取 消</el-button>
              <el-button type="primary" @click="add">确 定</el-button>
            </div>
          </el-dialog>
          <edit-button @handleEdit='handleEdit'></edit-button>&nbsp;&nbsp;
          <!-- 修改弹窗 -->
          <el-dialog title="班次管理" :close-on-click-modal="false" :visible.sync="dialogFormVisiblechange">
            <el-form :model="form1">
              <el-form-item  label="班次名称" :label-width="formLabelWidth">
                <el-input v-model="name" auto-complete="off" maxlength='20'></el-input>
              </el-form-item>
              <el-form-item label="人数" :label-width="formLabelWidth">
                <el-input-number v-model="num"  :min="1" :max="100" label="描述文字"></el-input-number>
              </el-form-item>
              <el-form-item label="时间" :label-width="formLabelWidth" style="text-align: left">
                <el-time-picker placeholder="起始时间" v-model="start" @change='changeTime2()'></el-time-picker>
                <el-time-picker placeholder="结束时间" v-model="end" :picker-options="{selectableRange: minStartTime2}">
                </el-time-picker>
              </el-form-item>
              <el-form-item  label="" :label-width="formLabelWidth" style="text-align: left">
                <el-checkbox v-model="acrossDay" @change='changeTime2()'>跨天值班</el-checkbox>
                <el-checkbox v-model="leader">领导班次</el-checkbox>
              </el-form-item>
              <el-form-item  label="类型" :label-width="formLabelWidth" style="text-align: left">

                <el-select v-model="value1" placeholder="请选择">
                  <el-option v-for="(item,index) in options" :key="index" :label="item.name" :value="item.id"></el-option></el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisiblechange = false">取 消</el-button>
              <el-button type="primary" @click="change">确 定</el-button>
            </div>
          </el-dialog>
          <!-- zhi -->
          <delete-button @handleDelete="handleDelete"></delete-button>
          <!--         <el-dialog title="提示" :visible.sync="dialogFormVisibledel" width="30%" center>-->
          <!--          <span>确定要删除该班次么？</span>-->
          <!--          <span slot="footer" class="dialog-footer">-->
          <!--            <el-button @click="dialogFormVisibledel = false">取 消</el-button>-->
          <!--            <el-button type="primary" @click="del">确 定</el-button>-->
          <!--          </span>-->
          <!--        </el-dialog>-->
          <sort-button @sortButton="sort"></sort-button>
        </div>
      </el-header>
      <el-header v-if='showSort' style=" height: 72px;line-height: 72px;">
        <div class="navsBar">
          <el-button type="primary" @click='sortchild("最前")'>最前</el-button>
          <el-button type="primary" @click='sortchild("上移")'>上移</el-button>
          <el-button type="primary" @click='sortchild("下移")'>下移</el-button>
          <el-button type="primary" @click='sortchild("最后")'>最后</el-button>
          <el-button type="primary" @click='showSort = false'>取消排序</el-button>
        </div>
      </el-header>
      <el-main style="padding: 12px 20px">
        <!--表格分页-->
        <div class="tableContainer">
          <my-table :tableColumn="tableColumn" @handleCurrentChange="test"  :tableData="tableData"></my-table>
          <el-pagination :small="pagingSize"  :page-size="pageSize"  :total="total"
                         :current-page.sync="currentPage"
                         @current-change="handCurrentChange"
                         layout="total, prev, pager, next, jumper">
          </el-pagination>
        </div>
      </el-main>
    </div>
  </div>
</template>

<script>
    import MyTable from "@/components/tables/tables"
    import AddButton from '@/components/button/addButton'
    import EditButton from "@/components/button/editButton"
    import DeleteButton from "@/components/button/deleteButton"
    import SortButton from "@/components/button/sortButton"
    export default {
        name: "flightManagement",
        components:{
            MyTable,
            AddButton,
            EditButton,
            DeleteButton,
            SortButton
        },
        data(){
            return{
                showSort:false,
                // 双向绑定的值
                name:'',//名字
                start:'12:02:22',//开始时间
                end:'',//结束时间
                type:'',//类型
                num:'',//人数
                acrossDay:"",//跨天值班
                leader:'',//领导班次
                options:[],
                //491：办公室排班 492：领导排班 493：部门排班  499：下级排班
                // 删除
                dialogFormVisibledel:false,
                id:'',
                // 添加
                value:'',//todolist
                dialogFormVisibleadd:false,
                formLabelWidth: '120px',
                startTime:'',
                minStartTime:'',
                minStartTime2:'',
                endTime:'',
                checkedCities1:false,
                checkedCities2:false,
                form: {
                    class: '',
                    man:''
                },
                // 修改
                value1:'',//todolist
                dialogFormVisiblechange:false,
                startTime1:'',
                endTime1:'',
                checkedCities3:false,
                checkedCities4:false,
                form1: {
                    class: '',
                    man:''
                },
                tableColumn: [
                    {
                        prop: "name",
                        label: "班次名称"
                    }, {
                        prop: "type",
                        label: "类型"
                    }, {
                        prop: "start",
                        label: "开始时间"
                    }, {
                        prop: "end",
                        label: "结束时间"
                    }, {
                        prop: "leader",
                        label: "领导班次"
                    }, {
                        prop: "man",
                        label: "人数"
                    }],//表头
                tableData: [],//表格数据
                total: 200,//数据总数
                pageSize: 10,//总页数
                currentPage: 1,//当前页数
                pagingSize:false,  //分页大小
            }
            order:''
        },
        methods: {
            // 刚开始数据
            axios(){
                let data = {
                    page:this.currentPage,
                    size:10
                };
                //  请求
                this.$api.flightManagement(data).then((res) => {
                    console.log(res)
                    // 返回的数据赋值给table
                    this.tableData = res.data.data
                    // 把数据赋值给总共的数据总数total
                    this.total = res.data.totalElements;
                })
            },
            handCurrentChange(){
                this.axios();
            },
            addClass(){
                this.value = '';
                this.dialogFormVisibleadd=true;
            },
            searchApi() {
                // 把标准时间转为2018-01-01格式
                // let time1 = this.formatDateTime(this.data[0]);
                // let time2 = this.formatDateTime(this.data[1]);
                //运用方法转换时间
                // 请求发送后台的参数
                console.log(res)
                let data = {
                    // dtStart: time1,
                    // dtEnd: time2,
                    searchText: this.search,
                    page: this.currentPage,
                    size: 10
                };
                console.log(data);
                this.$api.flightManagement(data).then((res) => {
                    console.log(res)
                    // 返回的数据赋值给options
                    this.tableData = res.data.data;
                    // 把数据赋值给总共的数据总数tableData1
                    this.total = res.data.totalElements;
                })
            },
            //  分页器
            handleCurrentChange() {
                if (this.data == undefined) {
                    this.searchApi();
                } else {
                    this.axios();
                }
            },
            // 删除
            del(){
                let data={
                    id:this.id,
                    // dutyLogId: this.bigid,	//duty_log 主键id
                };
                this.$api.flightManagement_del(data).then((res) =>{
                    if (res.errorcode!=0){
                        this.$message({
                            message:res.msg,
                            type:"error"
                        });
                        return
                    }else{
                        this.$message({
                            message:'删除成功',
                            type:"success"
                        });
                    }
                    this.axios();
                    this.id = '';
                });
                this.dialogFormVisibledel = false
            },
            //  添加
            add(){
                console.log(this.name=='')
                if(this.form.class==''){
                    this.$message({
                        showClose: true,
                        message: '名称不能为空哦!',
                        type: 'error'
                    });
                }
                else if(this.startTime==''){
                    this.$message({
                        showClose: true,
                        message: '开始时间不能为空哦!',
                        type: 'error'
                    });
                }
                else if(this.endTime==''){
                    this.$message({
                        showClose: true,
                        message: '结束时间不能为空哦!',
                        type: 'error'
                    });
                }
                else if(this.value==''){
                    this.$message({
                        showClose: true,
                        message: '类型不能为空哦!',
                        type: 'error'
                    });
                }
                else{
                    // console.log(this.startTime)
                    let time1=this.dateFormation(this.startTime);
                    let time2=this.dateFormation(this.endTime);
                    console.log(time1)
                    console.log(time2)
                    console.log(this.checkedCities1)
                    console.log(this.checkedCities2)
                    if(time1===time2){
                        this.$message({
                            showClose: true,
                            message: '开始结束时间不能相同!',
                            type: 'error'
                        });
                        return
                    }
                    let data={
                        "data":{
                            name: this.form.class,
                            type: this.value,	//491：办公室排班 492：领导排班 493：部门排班  499：下级排班
                            start: time1,
                            end: time2,
                            man: this.form.man,  //人数
                            leader: this.checkedCities2,  //领导班次    5：否，6：是
                            remark: "", //工作日模板
                            holidayTemplate: '', //节假日模板
                            acrossDay:  this.checkedCities1	//跨天值班    5：否，6：是
                        }

                    };
                    console.log(data)
                    this.$api.holidayManagement_add(data).then((res) =>{
                        if (res.errorcode!=0){
                            console.log(res)
                            this.$message({
                                message:res.msg,
                                type:"error"
                            });
                            return
                        }
                        else{
                            this.axios();
                            this.$message({
                                message: '恭喜你，成功添加一条记录',
                                type: 'success'
                            });
                            this.form.class=''
                            this.startTime=''
                            this.endTime=''
                            this.checkedCities1=false
                            this.checkedCities2=false
                            this.value1=''
                            this.dialogFormVisibleadd = false
                        }

                    });

                }
            },
            unadd(){
                this.dialogFormVisibleadd = false
                this.form.class=''
                this.startTime=''
                this.endTime=''
                this.value=''
                this.checkedCities1=false
                this.checkedCities2=false
                this.value1=undefined
                this.dialogFormVisibleadd = false
            },

            // 修改
            change(){
                let type;
                for(let i = 0; i < this.options.length; i++){
                    if(this.options[i].text == this.value1){
                        type = this.options[i].id;
                        break;
                    }
                }
                console.log(type,this.start,this.end )
                if(this.name==''){
                    this.$message({
                        message:'名字不能为空哦',
                        type:"error"
                    });
                }
                else if(this.start==''||this.start==null||this.start=='NaN:NaN:NaN'){
                    this.$message({
                        message:'开始时间不能为空哦',
                        type:"error"
                    });
                }
                else if(this.end==''||this.end==null||this.end=='NaN:NaN:NaN'){
                    this.$message({
                        message:'结束时间不能为空哦',
                        type:"error"
                    });
                }
                /*else if(this.end==this.start){
                  this.$message({
                    message:'开始结束时间不能相等哦',
                    type:"error"
                  });
                }*/
                else if(type==''){
                    this.$message({
                        message:'类型不能为空哦',
                        type:"error"
                    });
                }
                else{
                    let data={
                        "data":{
                            id:this.id,
                            name: this.name,
                            type: this.value1,	//491：办公室排班 492：领导排班 493：部门排班  499：下级排班
                            start: this.dateFormation(this.start),
                            end: this.dateFormation(this.end),
                            man: this.num,  //人数
                            leader: this.leader,  //领导班次    5：否，6：是
                            remark: "", //工作日模板
                            holidayTemplate: '', //节假日模板
                            acrossDay:  this.acrossDay,	//跨天值班    5：否，6：是
                            order:this.order
                        }
                    };
                    console.log(data)
                    this.$api.holidayManagement_change(data).then((res) =>{
                        console.log(res)
                        if (res.errorcode!=0){
                            this.$message({
                                message:res.msg,
                                type:"error"
                            });
                            return
                        }else{
                            this.$message({
                                message:'修改成功',
                                type:"success",
                            });
                            this.dialogFormVisiblechange = false
                            this.axios();
                        }

                    });

                }

            },
            test(row) {
                // console.log(rowAdd)
                // this.name = row.name;
                // this.record = row.date;
                // 判断56  5是false  6是true]
                if(row.acrossDay===6){
                    this.acrossDay=true//跨天值班
                }
                else{
                    this.acrossDay=false
                }
                // 判断是否  变成布尔
                if(row.leader=='否'){
                    // console.log(1)
                    this.leader=false//领导班次
                }
                else{
                    this.leader=true
                }
                this.id = row.id;
                // this.name = row.name;
                //   //this.start = row.start;
                //   let start = (row.start).split(':');
                //   let end = (row.end).split(':');
                //   this.start = new Date(2016, 9, 10, start[0], start[1],start[2]);
                //   this.end = new Date(2016, 9, 10, end[0], end[1],end[2]);
                //   this.type = row.type;
                //   this.num = row.man;
                //   console.log(row)
                //   this.value1 = row.type;
                //   this.order=row.order;
                //   // this.overtime = row.overtime;
                //   // this.daynum = row.duration;
                //   // this.daytext = row.remark;
                this.$api.dutyDetail({id:this.id}).then((res) => {
                    if(res.errorcode==0){
                        console.log(res.data);
                        this.name = res.data.name;
                        // //this.start = row.start;
                        let start = (res.data.start).split(':');
                        let end = (res.data.end).split(':');
                        this.start = new Date(2016, 9, 10, start[0], start[1],start[2]);
                        this.end = new Date(2016, 9, 10, end[0], end[1],end[2]);
                        // this.type = res.data.type.id;
                        this.num = res.data.man;
                        // console.log(row)
                        this.value1 = res.data.type.id;
                        this.order=res.data.order;
                        // this.overtime = res.data.overtime;
                        // this.daynum = res.data.duration;
                        // this.daytext = res.data.remark;
                    }
                })
            },
            // 添加班次 
            changeTime(){
                if(this.checkedCities1){ //跨天
                    // 时间范围
                    this.minStartTime = '00:00:00 - ' + this.changeDate(this.startTime);
                    this.endTime = '';
                    console.log('时间范围', this.minStartTime)
                }else{
                    // 时间范围
                    this.minStartTime = this.changeDate(this.startTime,1) + ' - 23:59:59';
                    console.log(this.minStartTime)
                    this.endTime = '';
                }

            },
            // 修改班次
            changeTime2(first){
                if(this.acrossDay){ //跨天
                    this.minStartTime2 = '00:00:00 - ' + this.changeDate(this.start);
                }else{
                    console.log(123);
                    this.minStartTime2 = this.changeDate(this.start,1) + ' - 23:59:59';
                }
                if(!first) this.end = '';
            },
            changeDate(changeDate,num){
                if(num){
                    var myDate  = new Date(new Date(changeDate).getTime() + 1000);
                }else{
                    var myDate  = new Date(new Date(changeDate).getTime() - 1000);
                }
                return this.dateFormation(myDate);
            },
            // 将时间格式转换为“00:00:00”
            dateFormation(date) {
                let h=date.getHours(); //获取系统时，
                let m=date.getMinutes(); //分
                let s=date.getSeconds(); //秒
                if (h < 10) h = "0" + h;
                if (s < 10) s = "0" + s;
                if (m < 10) m = "0" + m;
                return h+':'+m+":"+s;
            },
            handleEdit(){
                console.log(this.id);
                if(this.id){
                    this.changeTime2('first')
                    this.dialogFormVisiblechange=true;
                }
                else{
                    this.$message({
                        type: 'info',
                        message: '请选择一个班次'
                    });
                }
            },
            handleDelete(){
                if(this.id){
                    this.$confirm('确认删除该班次, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.del();
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }
                else{
                    this.$message({
                        type: 'info',
                        message: '请选择一个班次'
                    });
                }
            },
            //paixu
            sort(){
                this.showSort = true;
            },
            sortchild(text){
                if(this.id==''){
                    this.$message({
                        message: '请先单击选中要操作的行',
                        type: 'warning'
                    });
                    return;
                }
                let index,tem,totalLength = this.tableData.length;
                for(let i = 0; i < totalLength; i++){
                    if(this.id == this.tableData[i].id){
                        index = i;
                        break;
                    }
                }
                if(text=='最前'){
                    // let id=JSON.stringify(this.id)
                    let data = {
                        "data": {
                            "type": "top",
                            "shift": this.id
                        }
                    };
                    //  请求
                    this.$api.sort(data).then((res) => {
                        console.log(res)
                        this.axios()
                    })
                }
                else if(text=='上移'){
                    console.log(index,this.id ,this.tableData[index-1].id)
                    if(index === 0) return;
                    let data = {
                        "data": {
                            "type": "shift",
                            "shift1": this.id,
                            'shift2': this.tableData[index-1].id
                        }
                    };
                    //  请求
                    this.$api.sort(data).then((res) => {
                        console.log(res)
                        this.axios()
                    })
                }
                else if(text=='下移'){
                    if(index==totalLength) return;
                    let data = {
                        "data": {
                            "type": "shift",
                            "shift1": this.id,
                            'shift2': this.tableData[index+1].id
                        }
                    };
                    //  请求
                    this.$api.sort(data).then((res) => {
                        console.log(res)
                        this.axios()
                    })
                }
                else if(text=='最后'){
                    let data = {
                        "data": {
                            "type": "bottom",
                            "shift": this.id
                        }
                    };
                    //  请求
                    this.$api.sort(data).then((res) => {
                        console.log(res)
                        this.axios()
                    })
                }
            }
        },
        mounted(){
            this.axios()
            this.$nextTick(()=>{
                let data={
                    pcode:'duty_type'
                }
                this.$api.getByPcode(data).then((res) => {
                    if(res.errorcode=='0'){
                        console.log(res.data);
                        this.options=res.data
                    }else {
                        //this.$message.error(res.msg);
                    }
                })
            })

        },

    }

</script>

<style scoped>
  .navsBar {
    width: 100%;
    height: 80px;
    background-color: white;
    display: flex;
    align-items: center;
  }
  .contentStyle {
    margin: 16px 30px 0 30px;
    background-color: white;
    box-sizing: border-box;
    border:1px solid rgba(219, 219, 219, 1);
    border-radius:3px;
  }
  .tableContainer {
    padding: 6px;
    box-sizing: border-box;
    border: 1px solid rgba(211, 215, 219, 1);
  }
  .element.style{
    text-align: left
  }
  .el-input-number{
    display: block;
    width:220px;
  }
  .dialog-footer{
    text-align: center;
  }
</style>
