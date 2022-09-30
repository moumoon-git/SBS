<!--@author：wzm-->
<template>
  <div class="div">
    <my-table id="table-content"
                  :tableColumn="tableColumn" :tableData="tableData"
                  @handleCurrentChange="rowclick"
                ></my-table>
    <el-pagination :small="pagingSize" :page-size="pageSize" :total="total"
                       @current-change="test(false)"
                       :current-page.sync="currentPage"
                       layout="total, prev, pager, next, jumper"></el-pagination>
  </div>
</template>

<script>
import myTable from "@/components/tables/tables"
export default {
  name:"onduty_",
  components: {},
  data() {
    return {
        tableColumn: [
          {
            prop: "stieType",
            label: "点名类型",
            formatter:this.statusFormatter
          },
          {
            prop: "name",
            label: "名称"
          }, {
            prop: "time",
            label: "时间"
          }, {
            prop: "status",
            label: "状态",
            formatter:this.stieTypeFormatter
          }, {
            prop: "address",
            label: "地址"
          }
          , {
            prop: "remark",
            label: "备注"
          }
        //   , {
        //     prop: "operatorName",
        //     label: "会议纪要"
        //   }
          ],//表头
        tableData: [],//数据
        // 分页器
        total: 0,//数据总数
        pageSize: 10,//每页条数
        currentPage: 1,//当前页数
        pagingSize: true,  //分页大小
        // 数据
        start:'',
        end:'',
        siteType:'',//点名方式
        status:'',//状态
    };
  },
  methods: {

         statusFormatter: function(row, column,cellValue) {
            if(cellValue==0){
                return '电话点名'
            }
            else if(cellValue==1){
                return '视频点名'
            }
            else{
                return '小程序点名'
            }
         },
         stieTypeFormatter: function(row, column,cellValue) {
            if(cellValue==0){
                return '在岗'
            }
            else if(cellValue==1){
                return '离岗'
            }
            else{
                return '设备故障'
            }
         },
      //行点击
      rowclick(row){
          console.log(row)
      },
        test(time,todolist){
            console.log(time)
            /* this.start=time[0]
            this.end=time[1]
            console.log(todolist)
            this.siteType=todolist
            let site=Number(this.siteType) */
            if (time) {
              console.log(123)
              this.start = time[0];
              this.end = time[1];
              this.siteType = Number(todolist)
            }
            let data={
                page:this.currentPage,
                size:this.pageSize,
                start:this.start,
                end:this.end,
                siteType:this.siteType,//点名方式
                status:0
	                };
            if(this.siteType==1){
                this.$api.conferenceDuty_all(data).then((res) =>{
                    console.log(res)
                    this.tableColumn=[
                        {
                            prop: "stieType",
                            label: "点名类型",
                            formatter:this.statusFormatter
                        },
                        {
                            prop: "name",
                            label: "名称"
                        }, {
                            prop: "time",
                            label: "时间"
                        }, {
                            prop: "status",
                            label: "状态",
                            formatter:this.stieTypeFormatter
                        }, {
                            prop: "address",
                            label: "地址"
                        }
                        , {
                            prop: "remark",
                            label: "备注"
                        }
                        , {
                            prop: "remark2",
                            label: "会议纪要"
                        }
                    ],//表头
                        this.tableData=res.data.data;
                    this.total = res.data.totalElements;
                })
            }
            else {
                this.$api.conferenceDuty_all(data).then((res) =>{
                    console.log(res)
                    this.tableColumn=[
                        {
                            prop: "stieType",
                            label: "点名类型",
                            formatter:this.statusFormatter
                        },
                        {
                            prop: "name",
                            label: "名称"
                        }, {
                            prop: "time",
                            label: "时间"
                        }, {
                            prop: "status",
                            label: "状态",
                            formatter:this.stieTypeFormatter
                        }, {
                            prop: "address",
                            label: "地址"
                        }
                        , {
                            prop: "remark",
                            label: "备注"
                        }
                        //   , {
                        //     prop: "remark2",
                        //     label: "会议纪要"
                        //   }
                    ],//表头
                        this.tableData=res.data.data;
                    this.total = res.data.totalElements;
                })
            }
            },
        //分页器
        handleCurrentChange(){

        },

  },
    mounted(){

    },
  components: {
      myTable
  },
};
</script>

<style  scoped>
.div{
    padding: 0 30px
}
</style>
