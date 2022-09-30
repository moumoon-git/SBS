<template>
  <div>
    <div style="text-align: left" v-if='!showSort'>
        <el-button type="primary" @click='showDialog("事件等级新增")'>新增</el-button>
        <el-button type="primary" @click='showDialog("事件等级修改")'>修改</el-button>
        <el-button type="primary" @click='showDialog("事件等级删除")'>删除</el-button>
        <el-button type="primary" @click='startSort'>排序</el-button>
    </div>
    <div style="text-align: left" v-if='showSort'>
        <el-button type="primary" @click='sort("最前")'>最前</el-button>
        <el-button type="primary" @click='sort("上移")'>上移</el-button>
        <el-button type="primary" @click='sort("下移")'>下移</el-button>
        <el-button type="primary" @click='sort("最后")'>最后</el-button>
        <el-button type="primary" @click='sort("排序")'>保存排序</el-button>
        <el-button type="primary" @click='showSort = false'>返回</el-button>
    </div>
       <div v-if='!showSort'>
          <el-table
            ref="singleTable"
            class="tableStyle"
            :data="tableData"
            highlight-current-row
            max-height='350px'
            @current-change="handleCurrentChange"
            @row-dblclick='showDialog("事件等级修改")'
            style="width: 100%">
            <el-table-column min-width="160" v-for="(item,key) in tableColumn" :key="key" :label="item.label"
                             :prop="item.prop"
                             :width="item.width" :resizable="false">
            </el-table-column>
          </el-table>
          <!-- 暂不启用分页
          <el-pagination class="pagination" :page-size="pageSize"  :total="total"
                         :current-page.sync="currentPage"
                         @current-change="axios()"
                         layout="total, prev, pager, next, jumper"></el-pagination> -->
      </div>
      <div v-if='showSort'>
        <el-table
          ref="elTable"
          class="tableStyle"
          :data="tableDataAll"
          highlight-current-row
          max-height='350px'
          @row-click="rowClick"
          style="width: 100%">
          <el-table-column min-width="160" v-for="(item,key) in tableColumn" :key="key" :label="item.label"
                           :prop="item.prop"
                           :width="item.width" :resizable="false"></el-table-column>
        </el-table>
      </div>


    <!--  弹框 -->
    <el-dialog
      :title='title'
      :visible.sync="dialogVisible"
      width="30%"
      append-to-body
      :close-on-click-modal="false"
      center>
      <div>
        <el-form :label-position="labelPosition" label-width="110px">
          <el-form-item label="事件等级名称：">
            <el-input v-model="name" maxlength='20'></el-input>
          </el-form-item>
          <el-form-item label="电话报送时限：">
            <!-- <el-input-number v-model="phoneNumber" :min="0" :max="999" ></el-input-number> -->
            <el-input v-model="phoneNumber" @keyup.native="proving1" maxlength='3' onpaste="return false" ></el-input>
            <span>分钟</span>
          </el-form-item>
          <el-form-item label="短信报送时限：">
            <!-- <el-input-number v-model="msg" :min="0" :max="999" ></el-input-number> -->
            <el-input v-model="msg" @keyup.native="proving2" maxlength='3' onpaste="return false" ></el-input>
            <!-- <el-input type="number" min='0' max='999' v-model="msg"></el-input> -->
            <span>分钟</span>
          </el-form-item>
          <p>说明：若无对应的报送时限要求，请清空报送时限。</p>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer" v-if='title == "事件等级新增"'>
        <el-button @click="saveEventType('保存并新增')">保存并新增</el-button>
        <el-button type="primary" @click="saveEventType('保存并关闭')">保存并关闭</el-button>
        <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
      </span>
      <span slot="footer" class="dialog-footer" v-if='title == "事件等级修改"'>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEventType('保存修改')">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "eventLevelManagement",
    data() {
      return {
        tableColumn: [
          {
            prop: "name",
            label: "名称"
          }, {
            prop: "extend1",
            label: "电话报送时限(分钟)"
          }, {
            prop: "extend2",
            label: "短信报送时限(分钟)"
          }
        ],//表头
        tableData: [],//表格数据
        pageSize: 5,//页数
        total: 0,//数据总数
        currentPage: 1,//当前页数
        title:'',
        dialogVisible:false,
        name:'',
        oldName:"",
        phoneNumber:'',
        msg:'',
        labelPosition:'right',
        row:'',
        showSort:false,
        tableDataAll:[],
        rowSort:'',
      }

    },
    methods: {
        proving1(){
            this.phoneNumber = this.phoneNumber.replace(/[^\0.\d]/g,'');
            this.phoneNumber = this.phoneNumber.replace('.','');
        },
        proving2(){
            this.msg = this.msg.replace(/[^\0\.\d]/g,'');
            this.msg = this.msg.replace('.','');
        },
        axios(){
            let data={
                data:{
                parameter:{
                    countPage:0
                    /*page:this.currentPage,
                    countPage:5*/
                },
                type:"select"
                }
              };
              console.log(data)
            this.$api.eventlevelAll(data).then((res) => {
                console.log(res)
                /*if(this.currentPage > res.data.paging.totalPages){
                  this.currentPage = res.data.paging.totalPages;
                  this.axios();
                  return;
                }
                this.total=res.data.paging.size;*/
                this.tableData=res.data.parameter;
                this.row = '';
            })
        },

        handleCurrentChange(row) {
            this.row=row
        },
        showDialog(title){
            console.log(this.row,title)
            if(!this.row && title != '事件等级新增'){
                let titleName = title == '事件等级修改'? '修改':'删除';
                this.$message({
                    message: '请先单击选中要'+titleName+'的行',
                    type: 'warning'
                });
                return;
            }
            console.log(this.title)
            this.title = title;
            if(title == '事件等级新增'){
                this.name = '';
                this.msg = '';
                this.phoneNumber = '';
                this.dialogVisible = true;
            }else if(title == '事件等级修改'){
                this.name=this.row.name;
                this.oldName = this.row.name;
                this.phoneNumber=this.row.extend1;
                this.msg=this.row.extend2;
                this.dialogVisible = true;
            }else if(title == '事件等级删除'){
                this.$confirm('此操作将删除所选的事件等级，请谨慎操作', '删除提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let data = {
                        "data":{
                            "parameter":[this.row.id],
                            "type":"delete"
                        }
                    }
                    console.log(data);
                    this.$api.eventlevelAll(data).then((res) => {
                        console.log(res)
                        if(res.errorcode == 0){
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.row = '';
                            this.axios();
                        }else{
                           this.$message.error(res.msg);
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        },
        saveEventType(button){
            console.log(this.name,this.phoneNumber,this.msg);
            this.name = this.trim(this.name);
            if(this.name == ''){
                this.$message.error('名称不能为空');
            }
            else if(button == '保存修改'){
                console.log(this.row)
                    let data = {
                        "data":{
                            "parameter":{
                                "id":this.row.id,
                                "name":this.name,
                                "oldName":this.oldName,
                                "extend1":this.phoneNumber,
                                "extend2":this.msg,
                                "order":this.row.order,
                            },
                            "type":"update"
                        }
                    }
                    console.log(data)
                    this.$api.eventlevelAll(data).then(res => {
                        console.log(res)
                        if (res.errorcode !=0){
                            this.$message({
                                message:res.msg,
                                type:"error"
                            });
                        }else{
                            this.dialogVisible = false;
                            this.row = '';
                            this.axios();
                        }
                    })
            }
              /* 保存事件类型 */
              else{
                  let data = {
                      "data":{
                          "parameter":{
                              "name":this.name,
                              "extend1":this.phoneNumber,
                              "extend2":this.msg
                          },
                          "type":"add"
                      }
                  };
                  console.log(data)
                  this.$api.eventlevelAll(data).then(res => {
                      if (res.errorcode !=0){
                          this.$message({
                              message:res.msg,
                              type:"error"
                          });
                      }else{
                         this.$message({
                                  message: '保存成功！',
                                  type: 'success'
                                });
                          this.name = '';
                          this.msg = '';
                          this.phoneNumber = '';
                          if(button == '保存并关闭') {this.dialogVisible = false;}
                          this.axios();
                      }

                  })
              }
          },
      trim(str){
        return str.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
      },
      startSort(){
          let data={
                data:{
                parameter:{
                    countPage:0
                },
                type:"select"
            }   };
            this.$api.eventlevelAll(data).then((res) => {
                console.log(res)
                this.tableDataAll=res.data.parameter;
                this.rowSort = '';
                this.showSort = true;
                this.row = '';
            })
      },
      sort(button){
           console.log(this.rowSort,this.tableDataAll)
           if(!this.rowSort && button !== '排序'){
                this.$message({
                    message: '请先单击选中要操作的行',
                    type: 'warning'
                });
                return;
           }
           let index,tem,totalLength = this.tableDataAll.length;
          for(let i = 0; i < totalLength; i++){
             if(this.rowSort == this.tableDataAll[i]){
                index = i;
                break;
             }
          }
          console.log(index)
           if(button == '最前'){
              if(index != 0){
                 tem  = this.tableDataAll[index];
                 this.tableDataAll.splice(index,1);
                 this.tableDataAll.splice(0,0,tem);
              }
           }else if(button == '上移'){
              if(index != 0){
                  console.log(index,tem)
                 tem  = this.tableDataAll[index];
                 this.tableDataAll.splice(index,1);
                 this.tableDataAll.splice(index-1,0,tem);
              }
           }else if(button == '下移'){
              if(index != (totalLength -1)){
                 tem  = this.tableDataAll[index];
                 this.tableDataAll.splice(index,1);
                 this.tableDataAll.splice(index+1,0,tem);
              }
           }else if(button == '最后'){
              if(index != (totalLength -1)){
                 tem  = this.tableDataAll[index];
                 this.tableDataAll.splice(index,1);
                 this.tableDataAll.splice(totalLength -1,0,tem);
              }
           }else if(button == '排序'){
                for(let i = 0; i < totalLength; i++){
                   this.tableDataAll[i].order = i;
                }
                let data={
                    data:{
                      parameter:this.tableDataAll,
                      type:"sort"
                    }
                  };
                console.log(data)
                this.$api.eventlevelAll(data).then((res) => {
                  console.log(res)
                    if(res.errorcode == 0){
                          this.$message({
                            type: 'success',
                            message: '排序成功!'
                          });
                          this.axios();
                        } else{
                          this.$message.error(res.msg);
                        }
                })
           }
           this.$set(this.tableDataAll,index,this.tableDataAll[index]);//刷新表格
           console.log(this.tableDataAll)
      },
      rowClick(row){
         this.rowSort = row;
      }
  },
    mounted() {
        this.axios()
    }
  }
</script>

<style scoped>
  .pagination {
    float: right;
    width: 892px;
    height: 36px;
    margin-top: 16px;
    padding: 0;
  }

  .tableStyle{
    line-height: 36px;
  }
  .el-input{
    width:80%;
  }
</style>
