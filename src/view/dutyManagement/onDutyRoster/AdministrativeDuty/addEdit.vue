<template>
  <div class="flight-management-add-edit">
    <div style="display:flex;justify-content: space-between;">
      <el-tabs v-model="activeName" style="width:calc(100% - 100px)" @tab-click="idx = parseInt($event.index)">
        <el-tab-pane :label="item.name?item.name:item.default + (index+1) " :name="item.default + (index+1)" v-for="(item,index) in formData" :key="index">
          <el-form ref="form" :rules="rules" :model="item" label-width="118px" v-if="item.default + (index+1) == activeName">
            <el-form-item label="政务名称" prop="name" label-width="82px">
              <el-input v-model="item.name" maxlength="100" show-word-limit></el-input>
            </el-form-item>
            <el-tabs v-model="activeTab" type="border-card">
              <el-tab-pane v-for="tab in tabPane" :key="tab.id" :label="tab.label" :name="tab.label">
                  <el-form-item label="政务值班人数" prop="maxNumble">
                      <el-input v-model="item.maxNumble"></el-input>
                  </el-form-item>
                  <el-form-item label="时间段" required>
                    <el-col :span="20">
                      <el-form-item prop="beginTime">
                        <el-time-picker placeholder="起始时间" v-model="item.beginTime" @change="changeTime(index)" value-format="HH:mm:ss"></el-time-picker>
                      </el-form-item>
                      <el-form-item prop="endTime">
                        <el-time-picker
                          placeholder="结束时间"
                          v-model="item.endTime"
                          :picker-options="{selectableRange: minStartTime}"
                          value-format="HH:mm:ss"
                        ></el-time-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-checkbox v-model="item.toTomorrowStatus" @change="changeTime(index)">跨日值班</el-checkbox>
                    </el-col>
                  </el-form-item>
              </el-tab-pane>
            </el-tabs>
            <el-form-item label="值班日类型" prop="type" label-width="93px" style="text-align:left">
              <el-col :span="24">
                <el-radio-group v-model="item.type">
                  <el-radio :label="0">节假日</el-radio>
                  <el-radio :label="1">工作日</el-radio>
                </el-radio-group>
              </el-col>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div style="flex: 0 1 80px;">
        <el-button type="primary" icon="el-icon-plus" circle size="small" @click="handleAdd"></el-button>
        <el-button type="primary" icon="el-icon-minus" circle size="small" @click="handleRemove"></el-button>
      </div>
    </div>
    
  </div>
</template>
<script>
import { deletedClassesTime } from "@/assets/interface/interface";

export default {
  name: "flightManagementAddEdit",
  data() {
    return {
      // formData: [{
      //   default: '默认', // 初始化不变的默认值
      //   type: "",
      //   name: '',
      //   beginTime: "",
      //   endTime: "",
      //   toTomorrowStatus: false,
      //   id: "",
      //   maxNumble: "",
      // }],
      tabPane: [
        { id: 1, label: "连续时间段" },
        // { id: 2, label: "间隔时间段" },
      ],
      activeTab: "连续时间段",
      minStartTime: "",
      activeName: '默认1',
       rules:{
        name: [
          { required: true, message: '请输入政务名称', trigger: 'blur' },
        ],
        beginTime: [
          {  required: true, message: '请选择开始时间', trigger: 'change' },
        ],
        endTime: [
          {  required: true, message: '请选择结束时间', trigger: 'change' },
        ],
        type: [
          { required: true, message: '请选择值班日类型', trigger: 'change' },
        ],
      },
      idx: 0, //当前ta页索引值
      disabled: false,
    };
  },
  props: {
    formData:{
      type:Array,
    }
  },
 
  computed: {
    timeList() {
      // 连续时间段仅显示数组的第一项
      let list = this.formData.appSjsDutyClassesTimeList;
      return this.activeTab === "间隔时间段"
        ? list
        : list.filter((m, i) => i < 1);
    },
  },
  created() {
    // 新增的时候默认加一条数据
    if (this.type === "add") {
      // this.handleAdd();
    }
    this.$set(this.formData, "date", this.date);
  },
  methods: {
    // 保存
    handleSave() {
      // console.log('this.$refs.form: ', this.$refs.form);
      this.formData.map((v,index)=>{
        this.$refs.form[index].validate((valid) => {
          if (valid) {
            let params = JSON.parse(JSON.stringify(this.formData));
            // console.log("params: ", params);
            params.forEach((m) => {
              m.toTomorrowStatus = !!m.toTomorrowStatus ? 1 : 0;
            });
            console.log("params: ", params);
            this.$api.affairsClassesSaveOrUpdate({ data: params }).then((res)=>{
              if (res.errorcode === 0) {
                this.$emit('saveSuccess', res);
              }
            });
          }else{
            this.$message.error("请选择必填项")
          }
        });
      })
    },
    // 新增
    handleAdd() {
      this.formData.push({
        default: '默认',
        type: "",
        name: '',
        beginTime: "",
        endTime: "",
        toTomorrowStatus: false,
        id: "",
      })
    },
    // 删除
    handleRemove() {
      this.$confirm("此操作将删除今日之后所有排班中的该班次设置，是否继续？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            let params =  { ids: [this.formData[this.idx].id ]} ;
            await this.$api.affairsClassesDelete(params).then((data)=>{
              if (data.errorcode === 0) {
                this.formData.splice(this.idx, 1);
                // 判断是否删除的是最后一个
                this.activeName = this.formData.length>0?this.formData[0].default + '1':"默认1"
              }
            });
          } catch (e) {
            console.log(`handleRemove: ${e}`);
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    // 添加班次
    changeTime(idx) {
      // console.log('this.formData: ', this.formData);
      // console.log('this.formData.appSjsDutyClassesTimeList[idx].toTomorrowStatus: ', this.formData[idx].toTomorrowStatus);
      if (this.formData[idx].toTomorrowStatus) {
        //跨天
        // 时间范围
        this.minStartTime = '00:00:00 - 23:59:59';
        // console.log("时间范围", this.minStartTime);
      } else {
        // 时间范围
        this.minStartTime = this.formData[idx].beginTime + " - 23:59:59"
        // console.log(this.minStartTime)
      }
      if (typeof idx == 'number') this.formData[idx].endTime = "";
    },
  },
};
</script>
<style lang="scss" scoped>

</style>
