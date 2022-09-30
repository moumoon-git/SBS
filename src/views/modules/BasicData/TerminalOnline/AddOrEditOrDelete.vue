/* <template>
  <div class="AddOrEdit">
    <!-- 新增/编辑 -->
    <el-dialog
      :title="type + '终端在线统计'"
      :visible.sync="centerDialogVisible"
      width="500px"
      center
    >
      <ul>
        <li>
          <p class="title">天翼对讲</p>
          <div class="calculation">
            <div>总数：<input type="text" v-model.number="telSum" /></div>
            <div>在线：<input type="text" v-model.number="telOnline" /></div>
            <div>(在线率：{{ telOnlineRate }}%)</div>
          </div>
          <div style="text-align: right; color: red" v-if="telOnline > telSum">
            输入的数据有误
          </div>
        </li>
        <li>
          <p class="title">网格终端</p>
          <div class="calculation">
            <div>总数：<input type="text" v-model.number="netSum" /></div>
            <div>在线：<input type="text" v-model.number="netOnline" /></div>
            <div>(在线率：{{ netOnlineRate }}%)</div>
          </div>
          <div style="text-align: right; color: red" v-if="netOnline > netSum">
            输入的数据有误
          </div>
        </li>
        <li>
          <p class="title">视频监控</p>
          <div class="calculation">
            <div>总数：<input type="text" v-model.number="monSum" /></div>
            <div>在线：<input type="text" v-model.number="monOnline" /></div>
            <div>(在线率：{{ monOnlineRate }}%)</div>
          </div>
          <div style="text-align: right; color: red" v-if="monOnline > monSum">
            输入的数据有误
          </div>
        </li>
      </ul>

      <span slot="footer" class="dialog-footer" v-if="type !== '查看'">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button @click="submit" class="button">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除 -->
    <el-dialog
      title="删除终端在线统计"
      :visible.sync="delDialogVisible"
      width="500px"
      center
    >
      <div style="text-align: center">是否删除该条统计信息</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button @click="delHandle" class="button">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { types } from "util";
export default {
    name: 'AddOrEdit',
  data() {
    return {
      centerDialogVisible: false, //新增/编辑视图窗口
      delDialogVisible: false, //删除视图窗口
      type: "", //判断新增或者编辑
      id: "",//编辑Id

      telSum: 0,
      netSum: 0,
      monSum: 0,
      telOnline: 0,
      netOnline: 0,
      monOnline: 0,
    };
  },
  computed:{
    telOnlineRate(){
      return (this.telOnline<=this.telSum && this.telOnline != '' && this.telSum != '')?((this.telOnline/this.telSum*100).toFixed(2)):'0.00'
    },
    netOnlineRate(){
      return (this.netOnline<=this.netSum && this.netOnline != '' && this.netSum != '')?((this.netOnline/this.netSum*100).toFixed(2)):'0.00'
    },
    monOnlineRate(){
      return (this.monOnline<=this.monSum && this.monOnline != '' && this.monSum != '')?((this.monOnline/this.monSum*100).toFixed(2)):'0.00'
    },
  },
  methods: {
    init(type,id) {
      this.type = type;
      this.centerDialogVisible = true;
      if (id) {
        this.id = id;
        this.$http({
          url: this.$http.adornUrl(`/ty/tyTerminal/info/${id}`),
          method: "get",
        }).then(({ data }) => {
          // console.log(data)
          if (data.TyTerminalEntity) {
            this.telSum = data.TyTerminalEntity.telSum
            this.netSum = data.TyTerminalEntity.netSum
            this.monSum = data.TyTerminalEntity.monSum
            this.telOnline = data.TyTerminalEntity.telOnline
            this.netOnline = data.TyTerminalEntity.netOnline
            this.monOnline = data.TyTerminalEntity.monOnline
          }else{
            this.$message.error(data.msg)
          }
        });
      }else{
        this.telSum = ""
        this.netSum = ""
        this.monSum = ""
        this.telOnline = ""
        this.netOnline = ""
        this.monOnline = ""
      }
    },
    delList(){
      this.delDialogVisible = true;
    },
    // 提交
    submit(){
      if (this.telOnline<=this.telSum && this.netOnline<=this.netSum && this.monOnline<=this.monSum) {
        this.$http({
            url: this.$http.adornUrl(`/ty/tyTerminal/${this.type==='新增'?'save':'update'}`),
            method: "post",
            data: this.$http.adornData({
              id: this.id || undefined,
              telSum: this.telSum,
              netSum: this.netSum,
              monSum: this.monSum,
              telOnline: this.telOnline,
              netOnline: this.netOnline,
              monOnline: this.monOnline,
            })
          }).then(({ data }) => {
            console.log(data)
            if (data && data.code == 0) {
              this.$message({
                type: 'success',
                message: `${this.type}成功`,
                duration: 1500,
                onClose:()=>{
                  this.centerDialogVisible = false
                  this.$emit("initData")
                }
              })
            }else{
              this.$message({
                type: 'error',
                message: data.msg,
                duration: 1500,
                onClose:()=>{
                  this.centerDialogVisible = false
                }
              })
            }
          });
      }
    },
    // 删除
    delHandle(){
      this.$emit("delData")
      this.delDialogVisible = false
    }
  }
};
</script>

<style lang="scss" scoped>
.AddOrEdit {
  .button {
    background-color: #00a9f2;
    color: white;
  }
  ul {
    padding: 0;
    list-style: none;
    li {
      height: 84px;
    }
  }
  p {
    margin: 10px 0;
  }
  input {
    outline: none;
    border: 1px solid #ccc;
    border-radius: 3px;
    width: 100px;
  }
  .title {
    font-weight: bold;
  }
  .calculation {
    display: flex;
    justify-content: space-between;
  }
  .el-button:focus,
  .el-button:hover {
  }
}
</style> */