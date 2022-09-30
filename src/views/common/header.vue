<template>
  <el-row :gutter="10">
    <el-col :span="6.5">
      <el-date-picker
        unlink-panels
        v-model="value3"
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
    </el-col>

    <el-col :span="6">
      <el-input
        style="width:300px;float: left;"
        v-model="value4"
        placeholder="请输入内容">
        <el-button slot="append" icon="el-icon-search  style='width:300px;'" @click="searchHandle()"
                   style="background: #409eff;color: #fff;"></el-button>
      </el-input>
    </el-col>

    <!--<el-col :span="11">
      <el-form :inline="true">
        <el-form-item label="事件类型">
          <el-popover
            ref="eventTypeListPopover"
            placement="right-start"
            trigger="click"
          >
            <el-tree
              :data="eventTypeList"
              :props="eventTypeListTreeProps"
              node-key="id"
              ref="eventTypeListTree"
              @current-change="eventTypeListTreeCurrentChangeHandle"
              :default-expand-all="false"
              :auto-expand-parent="true"
              :highlight-current="true"
              :expand-on-click-node="true"
            >
            </el-tree>
          </el-popover>

          <el-input v-model="eventDetailForm.eventTypeName"
                    v-popover:eventTypeListPopover
                    :readonly="true"
                    style="width: 50%" placeholder="点击事件类型" class="menu-list__input">

          </el-input>
        </el-form-item>
      </el-form>
    </el-col>-->


    <el-col :span="11" v-if="headFlag == 1">
      <el-form :inline="true">
        <el-form-item>
          <el-button  type="primary" @click="addOrUpdateHandle()">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

  </el-row>
</template>

<script>
  export default {
    //headFlag = 1显示新增按钮，事件要接报，其他不显示
    props:["headData","headFlag"],
    data () {
      return {
        //tableDatas: this.tableData
        value3: '',
        value4: '',
      }
    },
    methods:{
      addOrUpdateHandle(){
        this.$emit("addOrUpdateHandle",null,2);
      },
      searchHandle(){
        // console.log(this.value3)
        this.$emit("searchHandle",this.value3,this.value4);
      }
    }
  }
</script>

<style scoped>

</style>
