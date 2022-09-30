<template>
  <div>
    <el-row :gutter="20">
      <el-row :gutter="10">
        <el-button type="success" @click="addDistributionControl">新增</el-button>
        <el-button type="primary" @click="startDistributionControlGroup('true','')" :disabled="multipleSelection.length === 0">批量启用</el-button>
        <el-button type="warning" @click="startDistributionControlGroup('false','')" :disabled="multipleSelection.length === 0">批量禁用</el-button>
        <el-button type="danger" @click="delDistributionControlGroup('')" :disabled="multipleSelection.length === 0">批量删除</el-button>
        <el-table
          :data="tableData"
          style="min-height:400px;width: 100%;margin-bottom:5px;"
          ref="multipleTable"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange"
          @current-change = "handleCurrentChange"
          v-loading="dataListLoading"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="gmtCreate" label="创建时间" align="center" width="180"></el-table-column>
          <el-table-column prop="name" label="布控任务名称" align="center"></el-table-column>
          <el-table-column prop="type" label="布控类型" align="center"></el-table-column>
          <el-table-column prop="srcDomainCode" label="发送方域编码" align="center"></el-table-column>
          <el-table-column prop="destDomainCode" label="目标方域编码" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <div class="opration">
                <el-button
                  type="text"
                  @click.stop="startDistributionControlGroup(scope.row.isEnable === 'true'?'false':'true',scope.row.id,scope.row.isEnable)"
                >{{scope.row.isEnable === 'true'?'禁用':'启用'}}</el-button>
                <el-button type="text" @click.stop="addDistributionControlGroup(scope.row.id,scope.row.type)">添加</el-button>
                <el-button type="text" @click.stop="delDistributionControlGroup(scope.row.id)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 
          <el-table
    ref="multipleTable"
    :data="tableData"
    tooltip-effect="dark"
    style="width: 100%"
    @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column
      label="日期"
      width="120">
      <template slot-scope="scope">{{ scope.row.date }}</template>
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      width="120">
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址"
      show-overflow-tooltip>
    </el-table-column>
        </el-table>-->
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <!-- 布控卡口 -->
          <distribution-control-bayonet :bayonetData="bayonetData"></distribution-control-bayonet>
        </el-col>
        <el-col :span="12">
          <distribution-control-human :humanData="humanData" :id="id"></distribution-control-human>
        </el-col>
      </el-row>
    </el-row>

    <!-- 新增布控 -->
    <distribution-control-add ref="addDistributionControlView"></distribution-control-add>

    <!-- 新增布控人员组 -->
    <distribution-control-add-group ref="addDistributionControlGroupView" :allCheckBayonetData="bayonetData" :allCheckHumanData="humanData"></distribution-control-add-group>

    <!-- 新增布控卡口组 -->
  </div>
</template>

<script>
import distributionControlAdd from "./distributionControl-add";
import distributionControlAddGroup from "./distributionControl-add-group";
import distributionControlBayonet from "./distributionControl-bayonet";
import distributionControlHuman from "./distributionControl-human";
export default {
  components: {
    distributionControlAdd: distributionControlAdd,
    distributionControlAddGroup: distributionControlAddGroup,
    distributionControlBayonet: distributionControlBayonet,
    distributionControlHuman: distributionControlHuman
  },
  data() {
    return {
      tableData: [], // 布控表格数据
      type: 2, //默认卡口类型
      onOff: false, //布控开关
      multipleSelection: [], //选中的布控数据
      ids: [], //所选行
      id: '',//当前选中布控Id

      humanData: [],

      bayonetData: [],

      dataListLoading: false
    };
  },
  created() {
    this.initList();
  },
  methods: {
    //  初始化布控数据
    initList() {
      var that = this;
      that.dataListLoading = true;
      that
        .$http({
          url: that.$http.adornUrl(`/vcm/vcmSuspectTask/list`),
          method: "get",
          params: that.$http.adornParams({
            type: that.type
          })
          // data: that.$http.adornData(id)
        })
        .then(({ data }) => {
          if (data && data.code === 0) {
            that.tableData = [...data.data];
            that.tableData.map(v => {
              switch (v.type) {
                case "1":
                  v.type = "车辆布控";
                  break;
                case "2":
                  v.type = "人脸黑名单布控";
                  break;
                case "3":
                  v.type = "人脸白名单布控";
                  break;
              }
            });
            if (data.data.length>0) {
              that.id = data.data[0].id
              that.initGroup()
            }else{
              that.humanData = []
              that.bayonetData = []
            }
          } else {
            that.$message.error(data.msg);
          }
          that.dataListLoading = false;
        });
    },
    //  新增布控
    addDistributionControl() {
      this.$refs.addDistributionControlView.init();
    },
    //  新增布控组员
    addDistributionControlGroup(id,type) {
      this.id = id
      switch (type) {
        case "车辆布控":
          type = 1;
          break;
        case "人脸黑名单布控":
          type = 2;
          break;
        case "人脸白名单布控":
          type = 3;
          break;
      }
      this.$refs.addDistributionControlGroupView.init(id,type);
    },  
    // 启动布控
    startDistributionControlGroup(start, id, isEnable) {

      var ids =
        id && isEnable
          ? [`${id}`]
          : this.multipleSelection.map(v => {
            // console.log(v.isEnable,start)
                return `${v.id}`;
            });
      var that = this;
      that
        .$http({
          url: that.$http.adornUrl(`/vcm/vcmSuspectTask/enableSuspectTask`),
          method: "post",
          data: this.$http.adornData({
            ids,
            isEnable: `${start}`
          })
          // data: that.$http.adornData(id)
        })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.initList();
          } else {
            that.$message.error(data.msg);
          }
        });
    },
    // 删除布控
    delDistributionControlGroup(id) {
      // console.log(id)
      var that = this;
      var ids = id
        ? [`${id}`]
        : this.multipleSelection.map(v => {
            return `${v.id}`;
          });
      // console.log(ids)
      this.$confirm("此操作将永久删除该布控, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        that
          .$http({
            url: that.$http.adornUrl(`/vcm/vcmSuspectTask/delete`),
            method: "post",
            data: this.$http.adornData({
              ids
            })
            // data: that.$http.adornData(id)
          })
          .then(({ data }) => {
            if (data && data.code === 0) {
              this.initList();
              this.$forceUpdate()
            } else {
              that.$message.error(data.msg);
            }
          });
      });
    },
    // 复选框点击事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 行点击事件
    handleCurrentChange(val){
      this.id = val.id
      this.initGroup(val.id)
    },
    // 初始化人员和卡口组数据
    initGroup(){
      var that = this;
      // console.log(that.humanData)
        that
          .$http({
            url: that.$http.adornUrl(`/vcm/vcmSuspectTask/selectSuspectTaskById`),
            method: "get",
            params: that.$http.adornParams({
              id: `${that.id}`
            })
            // data: that.$http.adornData(id)
          })
          .then(({ data }) => {
            if (data && data.code === 0) {
              that.humanData = [...data.data.groupListsList]
              that.bayonetData = [...data.data.bayoneListsList]
            } else {
              that.$message.error(data.msg);
            }
          });
    }
  }
};
</script>

<style lang="scss" scoped>
.opration{
  display: flex;
  justify-content: space-around;
}
</style>