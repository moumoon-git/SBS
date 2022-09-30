<template>
  <div class="AddressGroup">
    <div v-if="currentTab === '1'" class="recently-commonly-contactor">
      <!-- <div :class="'item-style ' + (tabPosition == 1 ? 'active-color' : 'color')" @click="selectCommonlyContactor">
        <i class="el-icon-star-off" style="width:0.91vw;"></i>
        <span class="name-style">{{contactList[0].name || '常用联系人'}}</span>
      </div> -->
      <div
        :class="'item-style ' + (tabPosition == 2 ? 'active-color' : 'color')"
        @click="selectRecentlyContactor"
      >
        <i class="el-icon-time" style="width: 0.91vw"></i>
        <span class="name-style">{{
          contactList[1].name || "最近联系人"
        }}</span>
      </div>
    </div>
    <!-- <p class="title">通讯录分组</p> -->
    <!-- 
    <div style="display:inline-block;position: relative;" class="searchMargin">
      <img class="searchIcon" src="data:image/png;base64,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" alt />
      <el-input v-model="filterText" placeholder="请输入分组" clearable style="width:100%;padding:8px;"></el-input>
    </div> -->
    <el-input
      placeholder="请输入单位名称搜索"
      class="inp"
      v-model="filterText"
    ></el-input>

    <el-scrollbar
      wrap-class="list"
      wrap-style="color: red;max-height:100%;"
      view-class="view-box"
      :native="false"
      :style="{ height: currentTab === '1' ? '405px' : '480px' }"
    >
      <el-tree
        class="treeGroup"
        draggable
        :default-expand-all="false"
        :data="list"
        :props="listProps"
        :default-checked-keys="checkedIds"
        node-key="id"
        current-node-key
        highlight-current
        @node-click="handleNodeClick"
        ref="tree"
        :filter-node-method="filterNode"
      ></el-tree>
    </el-scrollbar>
  </div>
</template>

<script>
// import bus from "@/components/common/js/eventBus";

export default {
  props: {
    list: {
      type: Array,
    },
    listProps: {
      type: Object,
    },
    currentTab: {
      type: String,
    },
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  data() {
    return {
      checkedIds: [],
      filterText: "",
      tabPosition: 1,
      contactList: [
        {
          i: 0,
          name: "常用联系人",
          icon: "el-icon-star-off",
          code: "commonlyused",
        },
        {
          i: 1,
          name: "最近联系人",
          icon: "el-icon-time",
          code: "recentcontact",
        },
      ],
    };
  },
  mounted() {
    // 3.0不要这个方法了
    // this.initContactorGroupsConfig(); // 初始化分组配置
  },
  methods: {
    /**
     * @author hexinting
     * @date 2020-11-05
     * @lastEditor hexinting
     * @lastDate 2020-11-05
     * @description 初始化分组配置
     */
    initContactorGroupsConfig() {
      let contactorGroups = JSON.parse(
        sessionStorage.getItem("contactorGroups")
      ); // 后端返回的分组配置列表
      // 常用联系人、最近联系人
      this.contactList.forEach((item) => {
        if (item) {
          let _index = contactorGroups.findIndex((el) => el.code === item.code); // 根据code查找大分组名字
          if (_index !== -1) {
            // 存在
            item.name = contactorGroups[_index].name; // 替换名字
          }
        }
      });
    },
    //点击树形更新表格
    handleNodeClick(obj) {
      this.tabPosition = 0; // 改变tabPostion
      this.$emit("handleNodeClick", obj, this.groupCheckData);
    },
    filterNode(value, data) {
      // console.log(data)
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    selectCommonlyContactor() {
      this.tabPosition = 1;
      this.$emit("selectCommonlyContactor");
    },
    selectRecentlyContactor() {
      this.tabPosition = 2;
      this.$emit("selectRecentlyContactor");
    },
  },
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}
.AddressGroup {
  border: 1px solid #ddd;
  height: 500px;
  .recently-commonly-contactor {
    width: 100%;
    // height: 6.5vh;
    height: 35px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    border-bottom: 1px solid rgba(233, 235, 240, 1);
    .item-style {
      width: 100%;
      display: flex;
      align-items: center;
      margin-left: 11%;
      cursor: pointer;
    }
    .active-color {
      color: rgba(0, 145, 255, 1);
    }
    .color {
      color: rgba(153, 153, 153, 1);
    }
    .name-style {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      margin-left: 6px;
    }
  }
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
    padding-left: 24px;
    &::-webkit-input-placeholder {
      color: #cccccc;
      font-size: 12px;
    }
  }
  /deep/ .el-input__inner {
    border: 1px solid #ddd;
  }
  // 树形样式
  .el-tree {
    overflow-x: none;
    height: 260px;
  }
  // 树形文字大小
  .el-tree-node__label {
    font-size: 12px;
  }
  // 树形图标样式
  .el-tree-node__expand-icon {
    font-size: 8px;
  }
  .el-tree-node__content > .el-tree-node__expand-icon {
    padding: 6px 11px 6px 5px;
    background-color: initial;
  }

  /deep/ .el-scrollbar__wrap {
    height: 455px;
  }
}
</style>