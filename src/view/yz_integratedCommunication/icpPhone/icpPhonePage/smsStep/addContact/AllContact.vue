<template>
  <div class="allContact">
    <!--      联系人架构-->
    <div class="wrap">
      <!-- <p class="title">通讯录分组</p> -->
      <el-input
        placeholder="请输入姓名/单位/职位/号码搜索"
        class="inp"
        @input="searchContact"
        v-model="key"
      ></el-input>
      <!-- 不使用树形的复选框-->
      <div class="checkWrap">
        <aside class="checkList">
          <el-checkbox
            v-model="checkAll"
            @change="handleCheckAllChange"
            style="
              border: none;
              padding-left: 10px;
              background: rgba(251, 252, 255, 1);
              width: 94%;
              height: 33px;
              line-height: 0px;
            "
            v-if="judge != 'getCharge'"
          >
            <div class="oneCheck">
              <div class="zhiwu">
                <p style="color: #333333; font-weight: bold">姓名</p>
                <p style="color: #333333; font-weight: bold">职位</p>
                <p style="color: #333333; font-weight: bold">单位</p>
              </div>
            </div>
            <!-- <span style="color:#333333;font-weight:bold;">全选</span> -->
          </el-checkbox>

          <!-- <div style="margin: 15px 0;"></div> -->

          <ul class="main" style="margin: 0">
            <el-checkbox-group
              v-model="checkedCities"
              @change="handleCheckedCitiesChange"
              class="checkbox"
              :max="judge == 'getCharge' ? 1 : undefined"
              :style="{ height: (judge == 'getCharge' ? 248 : 215) + 'px' }"
            >
              <li
                class="main-video"
                v-for="(city, index) in tableList"
                :key="index"
              >
                <div class="audio-name">
                  <el-checkbox
                    :label="city"
                    style="width: 100%"
                    v-if="city.id !== disableId"
                  >
                    <div class="oneCheck">
                      <div class="zhiwu">
                        <p>{{ city.name }}</p>
                        <p>{{ city.position ? city.position : "无" }}</p>
                        <p class="name">
                          {{ city.workUnit ? city.workUnit : "无" }}
                        </p>
                      </div>
                    </div>
                  </el-checkbox>
                  <div
                    class="img-r"
                    @click="showHide(index, city.id)"
                    ref="arrow"
                  >
                    <!-- <img src="../../../../../../../assets/img/list.png" ref="iconfont1" class="icon1" alt />
                    <img src="../../../../../../../assets/img/triangle.png" ref="iconfont2" class="icon2" alt />-->
                  </div>
                </div>
                <div class="audio-body" ref="child" style="display: none">
                  <div class="top">
                    <!-- <img :src="city.images?city.images:images" alt="" class="avatar"> -->
                    <div class="mainInfo" style="width: 80%">
                      <div
                        class="info"
                        style="display: flex; justify-content: space-between"
                      >
                        <span
                          class="name"
                          style="
                            flex: 1;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                          "
                          >{{ city.name }}</span
                        >
                        <span
                          class="post"
                          style="
                            flex: 1;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                          "
                          >{{ city.position ? city.position : "无" }}</span
                        >
                      </div>
                      <p
                        class="workUnit"
                        style="
                          overflow: hidden;
                          text-overflow: ellipsis;
                          white-space: nowrap;
                        "
                      >
                        {{ city.workUnit ? city.workUnit : "无" }}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span>手机：{{ city.mobile1 ? city.mobile1 : "无" }}</span>
                    <span>办公：0755-152458965</span>
                  </div>
                  <div>
                    <span
                      >家庭：{{
                        city.urgentContactorMobile1
                          ? city.urgentContactorMobile1
                          : "无"
                      }}</span
                    >
                    <span
                      >其他：{{ city.otherTel ? city.otherTel : "无" }}</span
                    >
                  </div>
                  <div>
                    <span>邮件：{{ city.email ? city.email : "无" }}</span>
                    <span>传真：{{ city.fex ? city.fex : "无" }}</span>
                  </div>
                </div>
              </li>
            </el-checkbox-group>
          </ul>
        </aside>
      </div>
    </div>
  </div>
</template>

<script>
import bus from "@/yz_components/common/js/eventBus";
import { mapGetters } from "vuex";
// import $ from 'jquery'

export default {
  props: ["dataList", "judge", "disableId", "searchText"],
  data() {
    return {
      checkedCities: [], //默认选中数据
      checkAll: false,
      isIndeterminate: true,
      tableList: [],
      // images: require('../../../../../../../assets/img/load.jpg'),//详情默认图片
      addedkData: [], //已添加的联系人
      groupCheckData: [], //已选中的联系人

      key: "", //搜索内容
    };
  },
  computed: {
    ...mapGetters({
      smsOrFax: "getSmsOrFax",
    }),
  },
  created() {},
  mounted() {
    bus.$off("getCheckData");
    bus.$on("getCheckData", (val) => {
      this.groupCheckData = val;
    });
  },
  watch: {
    dataList(newV, oldV) {
      let addedkExist = []; //存放已添加的数据在当前组里选中数据
      let checkExist = []; //存放已选中的数据在当前组里选中数据
      let filterData = []; // 过滤undefined数据
      this.tableList = newV;
      if (this.groupCheckData.length > 0) {
        this.groupCheckData.map((v) => {
          // console.log('v.id: ', v.id);
          checkExist.push(this.tableList.find((item) => v.id === item.id));
        });
        if (checkExist.length > 0) {
          filterData = this.$emit("delRepy", checkExist).$listeners.delRepy(
            checkExist
          );
        }
        this.checkedCities = addedkExist.concat(filterData);
      } else {
        this.checkedCities = [];
      }
      if (this.tableList.length === 0) {
        this.checkAll = false;
        return;
      }
      this.checkAll = this.checkedCities.length === this.tableList.length;
      this.isIndeterminate =
        this.checkedCities.length > 0 &&
        this.checkedCities.length < this.tableList.length;

      this.$emit("selectData", this.checkedCities, true);
    },
    // 监听父组件传的搜索框的值，并将它赋值给key
    searchText: {
      handler: function (newVal, oldVal) {
        console.log("搜索框的值：", newVal);
        if (newVal === "") {
          this.key = "";
        }
      },
      deep: true,
    },
  },
  methods: {
    handleCheckAllChange(val) {
      var contactorNameArr = [];
      var contactorNameString = "";
      if (val) {
        // this.tableList = this.tableList.filter(v => v.id != this.disableId); // 没作用，注释，会导致最近联系人全选后，tableList清空
        if (this.smsOrFax === "fax") {
          this.checkedCities = this.tableList.filter((v) => v.fax);
          this.tableList.forEach((item) => {
            if (!item.fax || item.fax === "" || item.fax === undefined) {
              contactorNameArr.push(item.name || item.contactor);
              contactorNameString = contactorNameArr.join();
              this.$message.warning(`${contactorNameString}传真号码为空`);
            }
          });
        } else if (this.smsOrFax === "email") {
          this.checkedCities = this.tableList.filter((v) => v.email);
          this.tableList.forEach((item) => {
            if (!item.email || item.email === "" || item.email === undefined) {
              contactorNameArr.push(item.name || item.contactor);
              contactorNameString = contactorNameArr.join();
              this.$message.warning(`${contactorNameString}邮件账号为空`);
            }
          });
        } else {
          this.checkedCities = this.tableList.filter(
            (v) =>
              v.number ||
              v.mobile ||
              v.mobile1 ||
              v.mobile2 ||
              v.phone ||
              v.orderNum ||
              v.otherTel ||
              v.otherTel2 ||
              v.officeTel ||
              v.homeTel
          );
          this.tableList.forEach((item) => {
            if (
              !item.number &&
              !item.mobile &&
              !item.mobile1 &&
              !item.mobile2 &&
              !item.phone &&
              !item.orderNum &&
              !item.otherTel &&
              !item.otherTel2 &&
              !item.officeTel &&
              !item.homeTel
            ) {
              contactorNameArr.push(item.name || item.contactor);
              contactorNameString = contactorNameArr.join();
              this.$message.warning(`${contactorNameString}联系号码为空`);
            }
          });
        }
        // this.checkedCities = this.tableList.filter(v => v.number)
      } else {
        this.checkedCities = [];
      }
      // this.checkedCities = val ? this.tableList : [];
      this.isIndeterminate = false;
      this.checkAll = val;
      this.$emit("selectData", this.checkedCities, false);
      // this.$emit("initContact")
    },
    handleCheckedCitiesChange(value) {
      var data = [];
      var contactorNameArr = [];
      var contactorNameString = "";
      if (this.smsOrFax === "fax") {
        data = value.filter((v) => v.fax);
        value.forEach((item) => {
          if (!item.fax || item.fax === "" || item.fax === undefined) {
            contactorNameArr.push(item.name || item.contactor);
            contactorNameString = contactorNameArr.join();
            this.$message.warning(`${contactorNameString}传真号码为空`);
          }
        });
      } else if (this.smsOrFax === "email") {
        data = value.filter((v) => v.email);
        value.forEach((item) => {
          if (!item.email || item.email === "" || item.email === undefined) {
            contactorNameArr.push(item.name || item.contactor);
            contactorNameString = contactorNameArr.join();
            this.$message.warning(`${contactorNameString}邮件账号为空`);
          }
        });
      } else {
        data = value.filter(
          (v) =>
            v.number ||
            v.mobile ||
            v.mobile1 ||
            v.mobile2 ||
            v.phone ||
            v.orderNum ||
            v.otherTel ||
            v.otherTel2 ||
            v.officeTel ||
            v.homeTel
        );
        value.forEach((item) => {
          if (
            !item.number &&
            !item.mobile &&
            !item.mobile1 &&
            !item.mobile2 &&
            !item.phone &&
            !item.orderNum &&
            !item.otherTel &&
            !item.otherTel2 &&
            !item.officeTel &&
            !item.homeTel
          ) {
            contactorNameArr.push(item.name || item.contactor);
            contactorNameString = contactorNameArr.join();
            this.$message.warning(`${contactorNameString}联系号码为空`);
          }
        });
      }
      this.checkedCities = data;
      console.log("value: ", value);
      this.$emit("selectData", data, false);
      this.checkAll = checkedCount === this.tableList.length;
      let checkedCount = value.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.tableList.length;
    },
    showHide(index, id) {
      if (this.$refs.child[index].style.display === "none") {
        this.$refs.child[index].style.display = "block";
        this.$refs.iconfont1[index].style.display = "none";
        this.$refs.iconfont2[index].style.display = "inline-block";
        // this.$refs.arrow[index].style.transform = "rotateZ(0deg)";
      } else {
        this.$refs.child[index].style.display = "none";
        this.$refs.iconfont1[index].style.display = "inline-block";
        this.$refs.iconfont2[index].style.display = "none";
        // this.$refs.arrow[index].style.transform = "rotateZ(90deg)";
      }
    },
    // 搜索联系人
    searchContact() {
      this.$emit("searchResult", this.key);
    },
  },
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}
.allContact {
  height: 460px;
  // 标题样式
  .title {
    border-bottom: 1px solid #ddd;
    font-size: 12px;
    height: 32px;
    line-height: 32px;
    background: rgba(251, 252, 255, 1);
    padding-left: 14px;
  }
  // 搜索图标样式
  .searchIcon {
    width: 13px;
    position: absolute;
    top: 16px;
    left: 13px;
    z-index: 1;
  }
  // 输入框样式
  /deep/ .el-input--medium .el-input__inner {
    height: 26px;
    line-height: 26px;
    padding-left: 22px;
  }
  /deep/ .el-input__inner {
    border: 1px solid #ddd;
    &::-webkit-input-placeholder {
      color: #cccccc;
      font-size: 12px;
    }
  }
  .outLine {
    border-bottom: 1px dashed #ccc;
    padding: 5px 10px;
    .search {
      width: 100%;
      padding-left: 15px;
      border-radius: 50px;
      outline: none;
      height: 30px;
      border: 1px solid #ccc;
      &::-webkit-input-placeholder {
        color: #ccc;
      }
      &::-moz-input-placeholder {
        color: #ccc;
      }
      &::-ms-input-placeholder {
        color: #ccc;
      }
    }
  }
  .wrap {
    display: flex;
    flex-direction: column;
    background-color: white;
    margin: 0;
    .inp {
      width: 80%;
      margin: 10px auto 14px;
      display: block;
      position: relative;
      border-radius: 12px;
      outline: none;
      /* background-color: #F4F4F4; */
      /* border: 1px solid #F4F4F4; */
    }
    .inp /deep/ .el-input__inner {
      background: rgba(234, 234, 234, 0.52);
      border-radius: 12px;
      height: 24px !important;
      line-height: 24px !important;
      border: none;
    }
    .inp /deep/ .el-input__inner::placeholder {
      color: #999999;
      font-size: 12px;
      font-family: MicrosoftYaHei;
    }
    .inp:before {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      right: 8px;
      margin: auto;
      width: 14px;
      height: 14px;
      background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMkAAADICAYAAABCmsWgAAAdFUlEQVR4Xu2dCXRV1bnHEwGh4mprrQM+rS6KUlv0UUFEfQpOaBVwxFk0JMigoiJaQa2xjnUAxICMwSjaNigOYOs84EBB22rB4VWxWC1EX5/RV4Yw+n5fvJcmkOSe6dt7n3v3Weus3Ny79zf89/7veSgu8k9OBCZOnLhrcXHxXq1bt97r66+/lndH/v8uEb8jr3zmO/mc/U5kfikv33/J7/Wf5a/8z+fPeJfx/7I2bdosKykpke/84ygCxY7aZcWsKVOmHIDiw8m8nYUMfM6+7ZQNEpIsa/C+1apVq5fKyso+VtbrxQdAoKBJMnXq1EMgw+HgdAjvobzfC4CZySAfoOwFSPsafxdeeOGFfzWp3Ov6BoGCIsn06dP33LhxYz8yXS8hBgTZLWUZYbGQBbtfwI+5F1100cqU2Z9Kc/OeJJMmTdqBdn8/Mlb9Syq1TWVKbW30cr6aK++QIUOezBOfnHQjL0lSXV3dqra2VgiRfXdyEv3kjHpfyLLNNtvMHTx48CvJifWS8q65VVlZ2XHDhg0l1Bhn4dwPCzGJ8X0Rzcn78X0mNczqQsQgaZ/zoiahA96VzFECOBfwfjtpkFIq769gch99l5n0XWpS6oMTZqeaJJMnT5aRqRJKTiGHf5pGoAZ8ZvLTfX50LFoWSSVJ7r333r60v4UYp0ZzuyBjSdNrJvMvM5h/+XNBIhDR6VSRBHJ0gRyj8PX8iP76aEVFa6hZ7qIpdid9lq88ILkRSAVJmAnfjkQdReJe4fscuRM1YIh3wPSuoUOHSlPMPy0g4DxJ6HecmyFHV5+SKgjMlZqF/srLKtLzQKizJMksGZGa45Q8wNl5FyDK3evXr7+LkbBPnDfWsIFOkoTm1ZXgcLthLLy6oqKPaIKNoQn2Ww/GvxFwiiQTJkzYvW3btr/CvLN9ItlDgFplbF1d3ZgRI0astWeFO5qdIUlmWFdqj33dgaegLXkV70czAiZ/C/pxgiR0zq+l9LqxoFPCTefXZppfY900z4xVVkkia63oLErt4ScFzaR3VC2/ZX5qNIsn/xZVQJrjWSMJzaseAF8FeD9KM4AFZLts+BpK8+vFAvK53lUrJKF5dRTNq4fRL3vC/ZMeBFaTbkOZU3kgPSbHt9Q4SRjePQmzH41vupdgC4FMP+VWW/pN6zVKEmqQgZRE0sTyT/oRGE/T6/L0u5HbA2MkoQa5GXPG5DbJh0gRArMgynkpsjeSqUZIAkGkeSXNrLQ/H+LAEt7F1Ijy91Pe1Zs2bVpFE2R1u3btVq1bt27VihUrinfeeef27K1vz+hde5ant2eQoj0boDrxtwvh9yN+F+J2SDsg+P00M/THpd2PluxXJwkEeQIDZK952p73MFj2XbxOhl5Ehl/MIXJ1STpRVVW14+rVq/eDOAciN/vulaQOE7Igyv0QJW+3L6iSBIJUkkiyrTYNjxDicTLsW7xvlJaWymkkxh+OPepETdOdjHco74kQdA/jRkRTeDlNr/HRorodS40kEEQmCWWhorMPmfATMuHj/H2CkvBZ1wyVfTTY11/Igm39ebdzzcaG9kDuM4YNG1btso1RbFMhCaNYI2WPQhSDTMQRYqDnN0KOtJwowuqEPejfCFlk8efBJnCKqONYMH0mYlwnoyVOEvaBnE7mc3WptRCj0sVaI0zuoIYZANEH4kvfMPFMhMUm2R58BERZaEKfCR2JkoSlJofKAWkYvoMJ40PoqKQpUElTQM7UzZtn2rRpR+LXQBxyrdMsh+X1hShL8wHsxEhCgu1Cgkk1u79DwMymZBtHzbHAIZsSN4Xm7cGU3jKxNyBx4dEFPgZJTo4e3Z2YiZGEJoCcGujKxJKQYhyJNNsdqPUtkWYYWoQsTvRZIO5NrPO6Tt9zXQ2JkIR+yChK7Dt0TQ0kXSb3xkKOcYFC52kgyCJEGcm7u20XyRdnpn07cGySkCB9SIinHUiMRym5rsyXdnBcPGW+hRl+mbc4Ia6smPE/hSjHQpR3Y8qxFj0WSRzqh5RDjhusoeiwYgox2VVoeyHiU6TPzxyGqUXTYpHEgX7IUqk9aPf6pfctJDPpNISf7+a1djeLnBhJbeL05HJzEEYmie1+CKD75lWIohmiHEHwCbyysNLWI8PCqbtwKBJJMgfH2ZxzkJEr6Zj6JwQCEEXubJnBK9fhGX8o2P5QU1PTq7y8fJ1x5TEURiIJYD+CTlsnK+btQroY6RgqKvMqc2imWpnDQO8vaR5fH8pgy4FDkyRzNq+VPc6URANo18reeP/ERIDWwATwvCSmmCjRN0lNlqbzvEKRRFal4qA0s4wfXs1ylz4caePcSt0oucSVOBbX2aVqtCsUSahFfkF1aXyoFZ3nUkU/6Ermyic7IMrJ1ChzTPuEzitoFaTi0LvAJMlcoCO1iOk7CW+jah5tOhELSR8thBH4K0PEJp9/0DroRuvgM5NKo+gKTBKAvA8FplebToUgMsbvH2UELE06XkPy3qLsWmzxgUiSOcxalsCbfB4AQFkG7h9DCECUeagytoyFJtdHNKUPcP1aukAkATwZUTJ5Xm/eLLM2lL8TUZNZ7/UUwmQ+xciThr5JTpLINdCw/WUjiH2jpAbgjkrzgjiDWCWuykJH/t1tt922W9In0SQJTBCSzDR5TzoEKYMgMivsH0sI0HKQyb5yg+ovpsk10aC+UKpaJAmlSlcyrbE7v9E1A4KUhfLAB1ZBwOSsvOQx0v0AFUcSENoiSShRZFhQhgdNPO9s2LDhaC62rDGhzOtoGYHMOi/ZJ2Skf0Jr5Qzmwpw8jqhZkmQu2JFaxNS8yMlUuY/5zOsOAob7J3NIf5ODQ4GBbpYkAHQj1eC1gSXFC1gBQDbWEcWzugBiU6NI/3CQCVfJb11pdr1tQlcYHU2SpLq6ulVtbe1/G6pq3+OUld4c9/N5GMN9WDMIzJgxozPNYLlc9PsGNN5CYXmNAT2hVDRJEpMX7VB6nE3p8etQVvvARhEgP1yFQrk6XPtZynBwF9eGg5sjiZEqls7aDDprfjRLO+slIJ/m96tyiHcColoUgY7zKTTleCpnnq1IMmnSpB24T0OaWjspW1mDnp5lZWUfK+vx4hNAAJLIwd1yhrL28yRNLqeOb92KJJyAMpA+QpU2Esi/HTB+bkCPV5EQAsydPE/tf2RC4poTs4nVwZ1cug57K5JQYsjRoKcpA7E+M5KR2rOYlPFxUrypApS8MYwm12RXQGhEEha47cmBZtLUUj16xs+su5L84e2gE/8Wsf4zfMxQMZxa4NqIJABwMa7cE8qdCIGpTg+nOn0lQlQfxTICmSNUtXcUrsbNTjTHV1h2t159I5LQ5pxFm/McZcOcKiWUfc078RUVFTtyf6TUJqrnDJMPSxj5vM8FALesSaSPsK+mYTS1zqO9OUtTh5eti4ChXYy/oSY5S9eTYNI3kyTTH1kWLFrkUP9i5KyTn12PjJ8TEdmp2psm84vKxnzBTP+eLHhdqawnp/jNJDE0y/4IpYP2yFlOp32A+AgwCrqQVkGP+JKal4D8XrQ65mvqCCK7IUluIoL2uhk512FqEMN8GLcRoFCVvCJ5Ru2hX3IZ/RLTp7hs5c9mkhiYKNqYaWppN+nUEs0L/jcCmSOmFitjUkWheoGyjpziG9YkawjdLmeMiAGoOp+m6jwuYnQfzUEEqE1kU5Zc4qT1LIYk1u/grCcJnfafMon4Jy1PM3JTccaSMgZ5JR6SyMpgWSGs9rRu3frbpaWl/1JTEEBwPUloag2k/ae6XstPIAZIjZQFId+cRb55SNNsmuhHMBr6kqaOXLLrSUKJcDN/xuQKHOP3L6k2XbvbPYY7PqogQL9kLwq/vymjMYq8c5eyjhbFZ0mifd+In2W3mcqKuilglyF+T0UV1rd2Z0nyDk7+WNFRf/GOIrg2RWuvGpdr/xjwsXVhVD20WZJs5PM2imD3pMpcqCjfi7aEgIG7MxeSd3pacu8bkuDkPrBVlserPXS+dvFLUdTgtSqYzvtxdN5/r2jEJ5DkB4ryc4oWkmhvy1yFk9vntMQHSCUCbMTanULwE0XjN5F/WinKzym6mBGKqxihUDsJg1pqCW3K/XJa4gOkFgE6719gvNroJSeodOAEFWsnexZTXd5BdTlKMYWeoCQ4UVG+F20ZAfLQfPLQYVpmMNHdffjw4X/Ukp9LbjGlwDQCqR3rQ01yNzXJZbkM8b+nFwHy0CSsH6blAQQ8hoWOz2nJzyVXSCKHFA/IFTDG7345Sgzw0hCVPCQT0TIhrfJQ0PanoDV909pmX4Qk2ovU/ByJStZxRyh5SFoK47QsYmDgDEZHrZ04L6NbqptnqCqpKS+UJp1/8hQB8tBgSnvNfUIX0K9VXVvYUtJITfI+ATorpt85OKi6CE7Rdi86AALkobMJ9mCAoFGDDCUPTYkaOW48IYkMre0SV1AL8f29I4rguiDawNZvq012IYn2Zqs+dLqedSExvQ06CDAEfAzN6md0pLMspLh4DE32W7Xk55KrThImKvtwEJ0nSa6USPHvzLofQ+dajSRA8wuaWzfagkhIIqfk7apogG9uKYLrgmjt5hY1yZXUJHfa8lVI8h7Kf6RlAA6ei4OanTot073cgAgwunUOo1uaBw5eQk1SEdCcxIPJEPACHNRcimx1ZCJxxLzArRCgoB3Cl2qnwJM/y+jXysVSVh6pSWSZs9opJjh4BQ5qH7BsBTyv9BsE6LiPpMWgucXW6jSCkETuKzxTMcGtdroU/fKiMwiQh67j4y+1AIGAp9Bkf1RLfi650ty6l9J+aK6AMX6fQntSU34M03zUJBCgJqkiIw9MQlZTMpB9PCTR3NjVoulSk8j489VaDkLAZ2luaR5gpmW6lxsQAfKQLGM/IGDw0MFsHyskm64uZi5D8+KeD6lJ9g6NjI+QGgRojaylMNxWy2BOl/8Bp8tr7n5suSbBwaOltNdyELkbIUlrRfletEUEuK25M7coy/o/rWct+Uft+N0gRhcb2KMsduyJo38PYpAPky4EKGRPpZB9WNHqd8k7P1GUn1N09kghOWtV7bAG223KnCj4AJERoD9yPZHLIwvIHXEuJOmfO5heiCxJ3kBFdz01ReU4eoOifC/aEgIGNu2NJ+9cbsm9erVZkjzA53O1DGEI7yWG8I7Qku/l2kOA4d9/kr47KlpgdUnKZpLg6LU4qr3K8ruUCF8pgulFG0aA/uz+NKXf1lRre46kIUlOw5jZys72ozaZp6nDyzaLgIFtu+LQbrbvc882t36IMR8qQ3wHzqpe+KJsvxe/BQK0QCZSuA5XBMb6EaebaxL5YGAbr/WDjxUTsyBFax8iAqhOHGzY8M5EWUB2knJqd6M20b52TtkFL14QMHSXuxOjog1JciW+366cBUZDktuUdXjxBhCg5SHbH1SHZmnKOdGP3UwSA8tTJOlehCRHGkhDr0IRAQjShln298nEHRXVONFpb9Qnqaqq2rGuru6fyk6L+H0hiuZaHwMuFLYKA0tRBGAnrqduRBL5h9GKhZQOPZSzwKWQZIKyDi9eEQFqkvsRf56iChFt/a7ErH+bm1vyBc7LPmXZr6z5LIAkh2gq8LL1EKAg/TEF6VtoaKOnpf6sLSf6I03VJOr3cmeAPR2iqE5eaiZgIcumIJULn1Tnu+jvfFJTU9OpvLx8nQtYN6pJJk6cuH3r1q3l/sTdNI2jlJjH7Hs/TR1edvIIkD92JX/8Gcma57SJ4dMpRAcn70E0iY1IYrDJVcRuyKM42fGFaGb7WDYQoBaRGkTt6sCsT+SNAeQNzT0qoeBriiQnIMHEGqsqSosLQlnrA1tDQIZ9US61iPYGqM/Xrl2794gRI/7PmrNbKN6KJJnaRPVUx6wN3IXXm7vwXnYFDG9H8whAkov5VfMshKzyWRSe2iNnoZK6OZLIzLvMwGs/zwPI0dpKvPx4CFRWVu6xbt261+hL7hFPUu7Yts/YasrCJknCPoHD2CcwP7dLiYTwS1USgVFPCLWI1CBSk2g/r1NoHqqtJKz8JkkiQgxNLIqq1ZQevRntki3E/nEMAe27Rxq6Sz4YRj5QO1M4KrTNkoTS4yKEmjrJ2/pm/6gA5ns8lqA8w7zFMQb8XMr5Wl05X2ulAV2hVLREku2QJKMZ+4SSGD3wSKpatRtco5tVuDEhyCgIcochBJxYFt+Ur82SJNPkGk0VeIsJkEgMuZbuKI5EXWBCn9fRMgK0JORoWrm+3MQjtUdXCsmlJpSF1dEiSQzOsNbbDVFegCRHhXXCh08WAQZudslc77Z/spKblka6Tybdh5nQFUVHiyQRgVS5t+DE6CjCI8a5mRLl2ohxfbQEEDC0yjdr6QYI2WPYsGHStHfyCUKSfSCJOCB9FCMPoPUDNBOz/kb8SZMSw/0QWe17DyNaI1zGKCdJxHhKFhnlktEuU887zMafymy8LLb0jyEEGO49jkxr8h6QVazTOpB1WrLCw9knEEmmT5/+UzLta3jxLYOevLlixYqDWS69waDOglXF6fAdOR1elgjtbgoEWih30hcxsbIjlkuBSCIaqIZvxCnTfYX59E96xfLQRw6EAK2F1wl4cKDAyQT6XwreHrQWPkpGnJ6UwCQBxO9ghtQm2qtAG3lL9f80bVa1i0/1oE2PZNK2GmsHmLSYdL2JdJW7Fp1/ApNEPKHNWoJzlaa9QuckADXZJzLtojV9Jo4GasK5j9m8dUhpaelya46HUByKJCIXUJ/gj41dhbfR9DI5FB0CxnQGJS3lbvRBpq2n0Cul0DNe2Eb1MzRJ6Jv0om/yUlSFceL5GiUOeo3jko4LSMeeyUkMLOkhCrtzAod2IGBokojNADwegC+1YT96H2RvQyk719ba0J92nTSZu1PYPIQfNi57XY1eOeo2VeeuRSIJy1X2oE35Ig7LafQ2nucgy3CGDz+woTytOiHIiRBEmlial+60BE8qz1yLRJJMbXIyGXWOxQyzlAS/kratHPTtnxwIQJBLwWu8LaDSvC4vMkkEbAOXSgZJU2eXWAcxXjtM5tze8cr3iOR0g6VGB7HUaFHOgA4GiEUS8YcSag4JcLJN3yilHpVaxdWl1rawoe/4E7C5G/0urKx+BzvuIY2m2MIjqt7YJKGkkn6J7Duw1T/J+u6bXw1yAYXXKZnmlfrhDSEz32yIcnrIOFaDxyaJI/2ThiDO4p9xhXpZEIXWAfgv94ao3aacQI5NFVESIYlD/ZNs+snw8Lg2bdqMHTRo0P8kkKjOi+DYn53Wr18/MkOQts4bXFSUGqIkRpIMUeRoylMdSiBpgo1dvnz5ZFYTb3LIrsRMkY45Pg6m7yEEsd3kDetXKoiSNElkEaT0Tw4Ki5ZyeLlrvJLTOCpdPI0jiu+ZrdUDiSuv0UWnUextIY7zREmUJAIEidcpM9FobF9CiESTycdKhiMrGY78PEQ8Z4Jm7gc5P0MO7dPdTfntNFESJ4mgykECPcmILp968g+aJw+zK06ugHjOVE6IqifTpOqPzSci40xe1Qt0otoZM56zRFEhiYDFGH1fEnVuTOBMRF+Mkich9TxqF9kv48yTuQa6nhwGLvF0wW8niaJGEkHc1v6TqKlNZlxEZlzE3z8xMvY6+x2M7rGXphS2d5eXWu4g7NC+vzIqVJrxnCOKKkkESZoKJu6H10q0TxEsxFlATbOEPeBLOLRAvov9sKe8M323LhBB3h7oOBChO8UWnB8CnCKKOkkyRJEjY2R5RD48tWTqJWTqJTgjhJEDv1fx3Sr5LH8hUxGkas/37fl/e97s505810Vevts2H8BQ9MEZohghSabpdTyZ40lFUL3o/EPACaIYI4mkHx3RI2lrP59/aek9UkTAOlGMkkSAZNTrEJoav+OjTDz6xyMQBAGrRDFOEkGETms3apQHaX51DoKQD+MRAAFrRLFCkkyNInsdZKecvzPRcyAoAlaIYo0kggqLDrfp0KHDnXyUpd3+8QgEQcA4UaySJIsI/ZRBci4s/+8QBCUfpuARMEoUJ0giSc7Il0yo3cl7WMFnAfsArJXt0BRcYzDF1UWUxojiDEkkX1RXV3+rtrb2Lj46e+uR/fyrawHEmMdKgMvLyso+ZLXE1Wi7VVdjLOlGiOIUSRo0v84jsa7hfz/6FSsPBY9MzSE7OG9kVbTc2b75sXGYdnCr60OqE8VJkojnmXv75KqHi0OC5oOHR+AhltJcL7VHU1HpM86m0DotvFhjMVSJ4ixJsvCyMrYfcyrXFuiKWO1c9hdqkHHUHvflUkSN4trW7C1NViOK8yQRJGbOnNmOQw6ugSimLxHKlXfS+vvHkKOC7QAVJSUldUGdgCiPEPaUoOEthFMhSipIkgU7cy1dKf/L285CIqRaJcT4EgcqhCAs+f8sijM0veZQWFk9jDCH3YkTJVUkadAEk81JpXLPBX/9GrBgub2C69cqkrislRpFzl8+KZhaK6ESJUoqSZKFnbOmOtIMy9Ysu1hJDreV/h3z5JoFuRNEtikn9lCjPJbZc5+YzIQFJUaUVJMkCyoTkf/B6MxZmREY144zSjjtA4l7tQE5vgoUI0IgapTHidY/QlQjUcgP1VzPcUZcZXlBkoYgkHB9hCw0xWTIstCWuWRrDWOb2xh9nAvWfeNmRK342PZrRu/OjiM/70iSBQOydOCznCYpZMnna67nkxHmcvDe3CT6G1EyE1jPI94JUeIaijOL5uZ5UXXlLUm2qF2kCSbXXP+MNx+aYzK/8QQd8bmu3PlBjfIkNh0fNSMaiFcFUS6IoqcgSNIQGDm2h8nJEzOdzrQQ5gt8eBObhRzPktjPREls7TjUKLLjVAoiV59KsJOBnlBPwZGkITpMUu5aV1d3OKSpP9pHTjHhdxsXbm6ZaAvlDDDsegOb3mZO4y+hUtViYIjy+0ytbdGKFlVPhShDwhhX0CRpCqgJEya0lfOwGC0T0uxLZu1IuOyb9EDA0uzxRHJEEc2nJTSf5KiiVD/U1k/hz7EOO3EvPBke1D5PkqBIEY69+TuwlKMjZ2p1FPKQEVqa9d/A72sIJ28dtcIa4q2R73hrV65cuWTkyJFrQqhPVVBqFLldoI/DRldAlEuC2OdJEgQlHyYSAkw4PkMBcUykyAYiYdvdzKNclkuVJ0kuhPzvsRCgRnkWAc4e9gFRxkKUK1py0pMkVhbwkYMgAFHkegsXbgBuztw7aHpd1dyPniRBUtmHiY0Anfnn6YsdGVuQnoDbIMropsR7kuiB7iVvgQA1ygt8dYSrwEDim1jCct2W9nmSuJpieWoXnfkX6Qf0dti9G6hRyhva50nicGrlq2nUKC/hm8vr6U6HKLOz+HuS5GtOdNwviPIyJh7usJmbieJJ4nAq5btpNL3m0/Ry9TDCP1KbyNV8RZ4k+Z4THfePGuUVTPwvR82UZV5TPUkcTZ1CMosa5VVqlEMd9HkhJOnpSeJgyhSiSdQor+P3wQ76vpsniYOpUqgmMeG4gLmKno7539eTxLEUKXRzqFH+AAbObIajGTjCk6TQc6WD/lOjLKRG6eGIaeWeJI6khDejMQLUKIv45kAHcJngSeJAKngTmkYAorzBL/VzFbYemlu/8iSxhb7XGwgBiPImAbsFCqwT6OeeJDrAeqkJImC56TXYkyTBxPSi9BBgwlFOkLHRmd/fk0QvXb3khBGAKAsgisl5lA+Zcd/bkyThhPTidBEwPDNfDklu8CTRTVMvXQEBE2u9mKdZTq3VHZKs8CRRSEQvUh8BA6uH62sR8cSTRD89vQYlBBQ3bjU6CtWTRCkBvVgzCGjsmacGacQLTxIzaem1KCJAjXIr4q9OQMV7EETu42z0eJIkgKwXYR8BiHI9VpTHsGQOBJFLn7Z6PElioOqjuoXAtGnTunEo+YVYJW/QR66zm8p5W3JbV5OPJ0lQKH241CDARbN7YWxvrs/oxTDufpCgA3934zu5u17eD/hf7lFZwDnA7+Zy7P8B3BNN7EPQfXwAAAAASUVORK5CYII=");
      background-size: 100% 100%;
    }
    .checkWrap {
      .checkList {
        background-color: #fff;
        box-sizing: border-box;
        .checkbox {
          overflow-x: scroll;
          &::-webkit-scrollbar {
            width: 0 !important;
            height: 0;
          }
        }
        /deep/ .el-checkbox__label {
          width: 93%;
          padding: 0;
          margin-left: 10px;
          font-size: 12px;
          .oneCheck {
            width: 100%;
            display: flex;
            align-items: center;
            .right {
              display: flex;
              flex-direction: column;
              justify-content: flex-end;
              height: 50px;
              width: 130px;
              min-width: 80px;
              .name {
                display: inline-block;
                font-size: 15px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
            .zhiwu {
              width: 235px;
              min-width: 90px;
              height: 27px;
              display: flex !important;
              justify-content: space-between;
              display: inline-block;
              line-height: 27px;
              p {
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: wrap;
                padding: 0 5px;
              }
            }
          }
        }
        /deep/ .el-checkbox {
          .el-checkbox__input.is-indeterminate {
            .el-checkbox__inner {
              background-color: #0091ff !important;
            }
          }
        }
      }
    }
  }
}

.main {
  padding: 0;
  list-style: none;
  .title {
    text-align: center;
    border-bottom: 1px dashed #ddd;
    padding: 8px 0;
  }
  .main-video {
    .audio-name {
      display: flex;
      align-items: center;
      .img-l {
        margin: 0 40px 0 10px;
      }
      .img-r {
        .icon1 {
          width: 16px;
          transform: rotateX(180deg);
        }
        .icon2 {
          display: none;
          width: 16px;
        }
      }
    }
    .audio-body {
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #ddd;
      margin: 5px;
      .top {
        display: flex;
        .avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-right: 10px;
        }
        .maininfo {
          width: 80%;
          .info {
            display: flex;
            justify-content: space-between;
            span {
              flex: 1;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
    }
  }
}

.groupList {
  list-style: none;
  padding: 0 10px;
  display: flex;

  .oneGroupList {
    width: 150px;
    display: flex;
    justify-content: space-between;
    align-content: center;
    border: 1px solid #ddd;
    padding: 8px;
    .workUnit {
      width: 60%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .totalCount {
    }
  }
}
.checkbox {
  color: #555;
  height: 345px !important;
  overflow: scroll;
}
.el-checkbox {
  width: 100%;
  border-bottom: 1px solid rgba(221, 221, 221, 1);
  padding: 7px 11px 8px;
  margin: 0;
  // vertical-align: middle;
  // line-height: 0.8;
}
// 复选框选中样式
/deep/ .checkList .el-checkbox__input.is-checked .el-checkbox__inner,
.checkList .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #0091ff !important;
  border-color: #0091ff !important;
}
// 默认未选中样式
/deep/
  .checkList
  // .el-checkbox-group
  .el-checkbox
  .el-checkbox__input
  .el-checkbox__inner {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  border: 1px solid #dde4e9;
  &::after {
    border-width: 2px;
    height: 9px;
    width: 4px;
    top: 0px;
  }
}
// 列表选中字体样式
/deep/
  .checkList
  .el-checkbox-group
  .el-checkbox__input.is-checked
  + .el-checkbox__label {
  color: #555555;
}
</style>