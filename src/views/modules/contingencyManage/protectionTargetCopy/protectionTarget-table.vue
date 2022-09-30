<template>
  <div class="resoureteam-table-wrap">
    <el-table
      @selection-change="handleSelectionChange"
      :data="dataList"
      stripe
      border
      
      :row-class-name="tableRowClassName"
    >
      <!-- <el-table-column
        type="selection"
        header-align="center"
        align="center">
      </el-table-column> -->

      <el-table-column
      prop="name"
        header-align="center"
        align="center"
        label="名称" :show-overflow-tooltip="true"
      >
        <!-- <template slot-scope="scope">
          <sv-table-tooltip :content="scope.row.name"/>
        </template> -->
      </el-table-column>

       <el-table-column
      prop="location"
        header-align="center"
        align="center"
        label="地址" :show-overflow-tooltip="true"
        >
        <!-- <template slot-scope="scope">
          <sv-table-tooltip :content="scope.row.location"/>
        </template> -->
      </el-table-column>

      <el-table-column
      prop="name"
        header-align="center"
        align="center"
        label="主体单位"
        >
        <!-- <template slot-scope="scope">
          <sv-table-tooltip :content="scope.row.chargeUnit"/>
        </template> -->
      </el-table-column>

      <el-table-column
      prop="name"
        header-align="center"
        align="center"
        label="联系人"  :show-overflow-tooltip="true"
        >
        <!-- <template slot-scope="scope">
          <sv-table-tooltip :content="scope.row.contactName"/>
        </template> -->
      </el-table-column>
      <el-table-column
      prop="name"
        header-align="center"
        align="center"
        label="联系电话"  :show-overflow-tooltip="true"
        >
        <!-- <template slot-scope="scope">
          <sv-table-tooltip :content="scope.row.mobile"/>
        </template> -->
      </el-table-column>

      <el-table-column
        header-align="center"
        align="center"
        width="170px"
        label="操作">
        <template slot-scope="scope">
            <!-- <div class="opration">
            <el-button type="info" size="small" @click.native="addOrUpdateHandle(scope.row.id,'watch')">查看</el-button>
            <span type="primary" size="small" @click="addOrUpdateHandle(scope.row.id,'edit')">编辑</span>
            <span type="danger" size="small" @click="batchDelete(scope.row.id)">删除</span>
          </div> -->
          <sv-table-operation
                            :display="['view', 'update', 'delete']"
                            @view="addOrUpdateHandle(scope.row.id,'watch')"
                            @update="addOrUpdateHandle(scope.row.id,'edit')"
                            @delete="batchDelete(scope.row.id)"
                        ></sv-table-operation>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
export default {
  props: ["dataList"],
  //表格内容
  data() {
    return {};
  },
  methods: {
    ifendcase(row, column){
      // console.log('ifendcase',row, column)
      if(column.property==="nature"){
        //1:专职 2:兼职 3:专业志愿者
        return row.nature===1?'专职':(row.nature===2?'兼职':'专业志愿者');
      }
      if(column.property==="level"){
        //1:国家级2:省级3:市级 4:县级 5:乡镇级 6:其他
        return row.level===1?'国家级':(row.nature===2?'省级':(row.nature===3?'市级':(row.nature===4?'县级':(row.nature===5?'乡镇级':'其他'))));
      }
      if(column.property==="secretLevel"){
        //1机密 2秘密 3限制  4公开  5其他
        return row.secretLevel===1?'机密':(row.secretLevel===2?'秘密':(row.secretLevel===3?'限制':(row.secretLevel===4?'公开':'其他')));
      }

    },
    //tableRowClassName 为 Table 中的某一行添加 class
     tableRowClassName({row, rowIndex}) {
        if (!row.openId) {
          return 'warning-row';
        } else {
          return 'success-row';
        }
        return '';
      },
    //查看 / 修改
    addOrUpdateHandle(id, staus) {
      this.$emit("seeOrUpdateHandle", id, staus);
    },
    //删除
    batchDelete(row) {
      this.$emit("batchDelete", row);
    },

    //被勾选的表格
    handleSelectionChange(val) {
      var tal = [];
      this.$emit("handleSelectionChange", val);
      for (var i = 0; i < val.length; i++) {
        tal.push(val[i].id);
        this.currenttableArray = tal;
      }
      // console.log(this.currenttableArray);
    },
  }
};
</script>

<style lang="less">

</style>

