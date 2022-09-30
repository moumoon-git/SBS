<!--
    * @description 查看分组信息
    * @author yangqingdong
    * @lastEditors yangqingdong
    * @lastEditTime 2020/9/17 16:39
    -->
<template>
  <div>
    <el-popover placement="right" width="460" trigger="click" v-model="visible">
      <el-row>
        <el-col :span="20"><h3>查看分组</h3></el-col>
        <el-col :span="4">
          <div class="close-btn"><i class="el-icon-close closeBtn" @click="visible=false"></i></div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">上级单位: {{ parentUnit }}</el-col>
        <el-col :span="12">单位名称: {{ data.name }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="24">单位地址: {{info.officeAddress}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="12">办公电话: {{info.officeTel}}</el-col>
        <el-col :span="12">传真号码: {{info.fax}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="12">联系电话: {{info.mobile}}</el-col>
        <el-col :span="12">电子邮箱: {{info.email}}</el-col>
      </el-row>
      <el-row style="{margin-bottom: 28px;margin-top: 28px;}">单位负责人: </el-row>
      <el-table :data="principals" :show-header="false" height="192px">
        <el-table-column width="400">
          <template slot-scope="scope">
            <div class="personWrap">
              <el-row>
                <el-col :span="12">姓名: {{ scope.row.name }}</el-col>
                <el-col :span="12">职务: {{ scope.row.position }}</el-col>
              </el-row>
              <el-row>
                <el-col :span="12">办公电话: {{ scope.row.officeTel }}</el-col>
                <el-col :span="12">手机: {{ scope.row.mobile }}</el-col>
              </el-row>
              <el-row>
                <el-col :span="12">分工: {{ scope.row.remark }}</el-col>
              </el-row>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-tooltip effect="dark" content="查看分组" placement="top" slot="reference" @click="visible = !visible">
        <img
          :src="require('@/assets/icpImg/detailTreeBtn.png')"
          style="width:1.3vw;"
        />
      </el-tooltip>
    </el-popover>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js'
export default {
  name: "watchGroupDetails",
  props: ["node", "data", "topPosition"],
  data() {
    return {
      visible: false,
      parentUnit: "",
      info: {
        name: this.data.name,
        officeAddress: '',
        officeTel: '',
        fax: '',
        mobile: '',
        email: '',
        importance: 0,
        workUnit: this.data.name
      },
      principals: [
        // {
        //   name: "张三",
        //   position: "石景山应急局局长",
        //   officeTel: "84441521",
        //   mobile: "13922396688",
        //   remark: "分管森林防火",
        // },
      ],

      code: "", //顶级单位代码
      top: "",  //顶级单位名字
    }
  },
  created() {
    switch (this.topPosition){
      case 1:
        this.code = "phone";
        this.top = "政务联络网";
        break;
      case 5:
        this.code = "gliaison";
        this.top = "基层联络网";
        break;
      case 6:
        this.code = "dutyGroup";
        this.top = "备勤联络网";
        break;
      case 7:
        this.code = "resource";
        this.top = "资源联络网";
        break;
      case 10:
        this.code = "phoneQuick";
        this.top = "电话快捷组";
        break;
    }
    if(this.node.parent.data.name){
      this.parentUnit = this.node.parent.data.name;
    }else{
      this.parentUnit = this.top;
    }
  },
  watch: {
    visible: {  //可见的时候才获取分组信息
      handler(newValue) {
        if (newValue) {
          this.$api.getGroupInfo({
            groupId: this.data.id
          }).then(res => {
            console.log(res)
            if (res.data.principals){
              this.principals = res.data.principals;
            }
            if(res.data.info){
              this.info = res.data.info;
              // 非十一位的号码为加密过的ECB要解密
              this.info.mobile = res.data.info.mobile.length <= 11 ? res.data.info.mobile : this.decrypt(res.data.info.mobile);
            }
          })
        }
      },
    }
  },
  methods: {
     // qinjiaqi ECB解密
     decrypt(word) {
      let key = CryptoJS.enc.Utf8.parse('abcdefgabcdefg12');
      let decrypt = CryptoJS.AES.decrypt(word, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
      return decrypt.toString(CryptoJS.enc.Utf8);
    },
  }
}
</script>

<style scoped>
.personWrap {
  border: 1px solid RGBA(218, 231, 248, 1);
}

.close-btn {
  height: 54px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
}

.el-row {
  margin-bottom: 14px;
}
</style>
