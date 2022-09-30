<!--@author：wzm-->
<template>
  <div class="out">
    <p class="p_"><span>月份：</span><el-date-picker value-format="yyyy-MM" v-model="month" type="month" :clearable="false" placeholder="选择月"></el-date-picker>
      <el-button type="primary" @click="reonvate">查询</el-button>
      <el-button type="primary" @click="word">导出</el-button>
    </p>
    <div class="tab">
      <my-table  id="table-content" :tableColumn="tableColumn" :tableData="tableData"></my-table></div>
  </div>
</template>

<script>
    import myTable from "@/components/tables/tables"
    //导出表格的依赖
    import FileSaver from 'file-saver'
    import XLSX from 'xlsx'

    export default {
        name: "historyAndScheduling",
        data(){
            return{
                month:'',
                tableColumn: [],//表头
                tableData: [],//表格数据
                month2:''
            }
        },

        methods: {
            formatDateTime(time) {
                console.log(time)
                var date = time;
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                m = m < 10 ? ('0' + m) : m;
                // var d = date.getDate();
                // d = d < 10 ? ('0' + d) : d;
                return y + '-' + m ;
            },
            axios(){
                //        var d = new Date(this.month);
                //  var y = d.getFullYear();
                //  var m = d.getMonth() + 1;
                //  m = m < 10 ? ('0' + m) : m;
                // var  resDate = y+'-'+m;
                //        console.log(resDate)
                this.month2=this.month
                let data = {
                    date:this.month
                };
                //  请求
                this.$api.historyAndScheduling(data).then((res) => {
                    console.log(res.data)

                    //动态班次列，取数据的第一个数据就可以了
                    var plan = res.data[0].plans;
                    var tableColumn = [];
                    var item = {
                        prop: "day",
                        label: "日期"
                    };
                    tableColumn.push(item)
                    for (var i = 0; i < plan.length; i++) {
                        console.log(plan[i].contactorList)
                        var item = {
                            prop: plan[i].dutyFrequency.name,
                            label: plan[i].dutyFrequency.name
                        };
                        tableColumn.push(item)
                    }
                    //创建表头
                    this.tableColumn = tableColumn;
                    // console.log(this.tableColumn);
                    // 返回的数据赋值给table
                    let tableData = [];
                    for (let i = 0; i < res.data.length; i++) {
                        let plan = res.data[i].plans;
                        tableData.push({
                            day: res.data[i].day,
                        });
                        for (let j =0;j<plan.length;j++){
                            let dutyFrequency = plan[j].dutyFrequency.name;
                            let contactorList = plan[j].contactorList;
                            let str="";
                            for (let k =0;k<contactorList.length;k++){
                                if(str!=""){
                                    str += ","+contactorList[k].person;
                                }else {
                                    str = contactorList[k].person;
                                }
                            }
                            tableData[i][dutyFrequency] = str;
                        }
                    }
                    this.tableData = tableData;
                })
            },
            reonvate(){
                if(this.month==''||this.month==null){
                    this.$message({
                        message: '请先选择日期',
                        type: 'warning'
                    });
                    return
                }
                this.axios()
            },
            // 导出
            word(){
                var xlsxParam = { raw: true }
                let et = XLSX.utils.table_to_book(document.getElementById('table-content'),xlsxParam); //此处传入table的DOM节点
                let etout = XLSX.write(et, {
                    bookType: 'xlsx',
                    bookSST: true,
                    type: 'array'
                });
                try {
                    FileSaver.saveAs(new Blob([etout], {
                        type: 'application/octet-stream'
                    }), this.month2+'.xlsx');   //trade-publish.xlsx 为导出的文件名
                } catch (e) {
                    console.log(e, etout);
                }
                return etout;
            },
        },
        mounted() {
            var d = new Date();
            var y = d.getFullYear();
            var m = d.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            var  resDate = y+'-'+m;
            this.month= resDate

            // var time =new Date()
            //          let y= time.getFullYear()
            //          let m=time.getMonth()+1
            //           m = m < 10 ? ('0' + m) : m;
            //           this.month= y+'-'+m
            //           console.log(this.month)
            this.axios()
        },
        components: {
            myTable
        },
    }
</script>

<style scoped>
  .p_ {
    padding: 10px 30px 10px 30px;
    text-align: left;
  }

  .tab {
    padding: 0 30px;
  }
</style>
