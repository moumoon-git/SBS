<template>
  <div>
    <sv-input-tree-search
      v-model.lazy="searchKeyword"
      style="margin: 10px 20px;"
      width="calc(87%)"
    />
    <div :class="['sv-tree', $style.treeScroll]">
      <el-tree
        ref="tree"
        :data="data"
        accordion
        :props="defaultProps"
        :filter-node-method="filterNode"
        @node-click="seleteNode"
      >
        <div
          slot-scope="{ node, data }"
          class="sv-tree-node"
        >
          <div class="label">
            {{ node.label }}
          </div>
        </div>
      </el-tree>
    </div>
  </div>
</template>

<script>
import Bus from '@/utils/bus.js';
import url from '@/mock/modules/url';

export default {
  name: 'PhoneTree',
  data() {
    return {
      // 搜索关键词
      searchKeyword: '',
      data: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        platformName: 'platformName',
      },
    };
  },
  watch: {
    searchKeyword(val) {
      this.$refs.tree.filter(val);
    },
  },
  mounted() {
    this.httpHuman();
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    changeImg() {
      const img = document.querySelectorAll('.el-tree-node__label');
      console.log('12345', img, '12345');
      if (img.length != 0) {
        for (let i = 0; i < img.length; i++) {
          if (img[i].innerText == '常用联系人') {
            img[i].className = 'el-tree-node__label changeImgOften';
          } else if (img[i].innerText == '最近联系人') {
            img[i].className = 'el-tree-node__label changeImgLately';
          }
        }
      }
    },
    changeBack() {
      const divList = document.querySelectorAll('.el-tree-node__content');
      const labelList = document.querySelectorAll(
        '.filter-tree>.el-tree-node>.el-tree-node__content>.el-tree-node__label',
      );
      console.log('labelList: ', divList);

      // console.log(divList)
      if (divList.length != 0) {
        for (let i = 0; i < divList.length; i++) {
          divList[i].onclick = function (e) {
            for (let j = 0; j < divList.length; j++) {
              divList[j].style.background = '';
              divList[j].style.color = '#606266';
            }
            // this.style.background = '#3F92FE'
            // this.style.color = '#fff'
            // this.style.opacity = '0.1'
          };
        }
      }
    },
    seleteNode(data) {
      if (data) {
        Bus.$emit('linkman', data);
        // console.log('发起请求了', data)
      }
    },
    httpHuman() {
      const that = this;
      // 获取联系人分组
      this.$http({
        url: this.$http.adornUrl(url.phone_tree.url),
        method: url.phone_tree.method,
        params: {
          flag: true,
        },
      }).then(({ data }) => {
        if (data.code === 0) {
          const findChilden = (obj) => {
            if (obj.platformName !== null && obj.platformName !== undefined) {
              obj.name = obj.platformName;
            }
            const { children } = obj;
            if (children) {
              children.forEach((item) => {
                findChilden(item);
              });
            }
          };
          [data.data].forEach((obj) => {
            findChilden(obj);
          });
          // console.log(data.data)
          let datas = [
            {
              id: 1,
              name: '常用联系人',
            },
            {
              id: 1,
              name: '最近联系人',
            },
            {
              id: 0,
              name: '全部',
              platformName: '全部',
              platformTitle: '全部',
              children: null,
            },
          ];
          datas = datas.concat(data.data);
          // console.log(datas)
          that.data = datas;
          setTimeout(() => {
            that.changeImg();
            that.changeBack();
          });

          console.log('树的数据', that.data);
        } else {
          this.$message.error(data.msg);
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.inp {
  width: 92%;
  margin: auto;
  display: block;
  position: relative;
  border-radius: 12px;
  outline: none;
  /* background-color: #F4F4F4; */
  /* border: 1px solid #F4F4F4; */
}
.inp /deep/ .el-input__inner {
  background: rgba(234, 234, 234, 1);
  border-radius: 12px;
  height: 24px;
  line-height: 24px;
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
  background: url("data:image/png;base64,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");
  background-size: 100% 100%;
}
.filter-tree {
  width: 100%;
  padding: 10px;
  padding-bottom: 0;
  flex: 1;
}
.filter-tree /deep/ .el-tree-node__content {
  height: 32px !important;
}
.filter-tree /deep/ .el-tree-node__expand-icon {
  font-size: 17px;
  color: #8a8a8a;
  padding-left: 0;
}
.filter-tree
  /deep/
  .el-tree-node
  .el-tree-node__content
  .el-tree-node__expand-icon.expanded {
  margin-top: 16px;
}
.filter-tree
  /deep/
  .el-tree-node
  .el-tree-node__content
  .el-tree-node__expand-icon:before {
  content: "";
  display: inline-block;
  width: 10px;
  height: 10px;
  background: url("data:image/png;base64,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");
  background-size: 100% 100%;
  margin-right: 10px;
}

.filter-tree
  /deep/
  .el-tree-node
  .el-tree-node__content
  .el-tree-node__expand-icon.is-leaf:before {
  width: 0;
}
// 一级菜单收缩显示
/deep/
  .filter-tree
  > .el-tree-node
  > .el-tree-node__content
  > .el-tree-node__expand-icon.is-leaf:before {
  margin-right: 20px;
}
/deep/ .filter-tree > .el-tree-node > .el-tree-node__content {
  background: none !important;
}
/deep/ .filter-tree .el-tree-node__label {
  font-size: 12px;
  letter-spacing: 1px;
}
/deep/
  .filter-tree
  > .el-tree-node
  > .el-tree-node__content
  > .el-tree-node__label {
  margin-left: 20px;
  position: relative;
  font-size: 12px;
  letter-spacing: 1px;
  &:before {
    content: "";
    position: absolute;
    top: 2px;
    left: -25px;
    width: 17px;
    height: 17px;
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAANCAYAAACgu+4kAAAAmUlEQVQ4T+2TMQ4BYRCFv5e4gt0b2JtwAEdxAOfQ6DUS5WrcwNYShYZCFDqC7BMSksXm/yNK086bb15eZuS8tQU1EcbeISagvtqLDREl51kJqKr1HsqeOsthiFEDeI6tgGMtRF7L02z27iC099H3RS7S8dcA3wDz9EMGsQ44/QG/ySA5gxrRuVeFB7lIBlhd9HrOAaTvvzO6Ap8dRlHswtTSAAAAAElFTkSuQmCC");
    background-size: 100% 100%;
  }
}
/deep/
  .filter-tree
  > .el-tree-node
  > .el-tree-node__content
  > .el-tree-node__expand-icon.expanded
  ~ span::before {
  content: "";
  position: absolute;
  top: 2px;
  left: -25px;
  width: 17px;
  height: 17px;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAOCAYAAADJ7fe0AAABJklEQVQ4T53RPUgDQRAF4PcS8BCENOY6wUI82xgFK8EiREsLe0tBsLATBCP2IlhZi52ksDMoEWwVK0MwaOnPCf6AQSOXHWfRoAiB25tii2Xet8MOpRI8QtAP6Am5hXAPXnqDU7U3vYtVlMNAw/9LbpSc5/TVaRylC2Kj0gZY+56wSxmzzplG+S9yp62tOC//9phNFhvbHSRCppmHFw24IXZOaXWQKrLPFzr+sjMCHP8gZgn+66JuJkiArCgybNDbLKAvOkoAaKQ9bic5g/+yqzvYSoA8IfeQtciq/sek/kfBHZF9joZzlOrgBDLvJwp4zojIAvPhDuXcnwVZdgZswMgQx8Jri5QUWXNGKBXmwqLNUS7Rgw9/BClJxYYk/YmD+zpLMDbzBdd1ckiv8q08AAAAAElFTkSuQmCC")
    no-repeat;
  background-size: 100% 100%;
}

.filter-tree /deep/ .changeImgOften:before {
  content: "";
  position: absolute;
  top: 0;
  left: -25px;
  width: 23px;
  height: 23px;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAEXElEQVRYCe1Wz09UVxQ+586bARuJtSXVNnRTgQhC66pNRGustv+Alsamv3ZEURpIsQODeB0ydJQEI4iGrmqjJkW76KKbpk2jqQu7qRHGJjK2C0yVpmBttTAM795+58FMAGcYBhdNE8l37v3OuefXu+/O5RE9/vs/70C4t7NGH49uepRncB4l2LLqUMpa5NgOWRZ4WVEI0ieir7K1F0HJMm/V+4KXhOcrKt+AlD8e/GCKszVtKZ7vzPkGiL/uOfIys7kCPgSRHBusVa/oho9/hJ4XlrUDik3HbBVNRIcgxOyGZc5XpPu8YuTkW+IfyNK19v3BjRIc7o1eJaYXmezm9v2tl8W2VFFLdUz5oXhIOCuOMDPOH8NEnWIj4taZeeljzh2w1nLkZKTEneZS9vFLULuRfrhizbrK2tpaF5wGBgZ8P4/evA5ehiYaybjXfI6Nh/aGbkmTsGdFuoHIscizSZ/aoJhKDfE6bE2pJVuKSJFCzGngud9vbwh+njaAhHui71m2p0HnYhJKnInjhiiOvYoj502/a2KhxtBtrJEjg0jS4VVMdNoSPYd3iVcsVk9GMV7BdTOM9Ruk+IYZm/watnkw45PnuLjwHhlbjhzlzITdoPVwqkLRKsRiczz8hlrbYfca8OxQPHQcP1pmlPsdlOex8E0gwLXBuuA96MuGPqafZCcwgNKvI8mIVfSarm+Jg3tQ3jg7HPzwwLBPuTVQh/EUbySm7CmtdXqXYM8LEstOwcnZ4l7uucUl2bwGxNBW3zbiuGYLeAyym58uOCOJwPNCf3+/n54KnEXQbsiQ5JTc4POAnZ6npxV9qusZnp7+FoZqnOQLa/yr366rq0tCzwkpPpq8ew6/oF1wHrSOs0Pvaf4d/CFkbUA8dd/RtWy8M1EJ/Qs7lngHuzENnhVS/HZi7AyaroVTzCrfDl1/4A54RqiM1lmjBKL7bVDvQt6iVbQS86IYd8dXzhS3435rt0mOxQIWbcALHH3wJ2YpPKIbtXCo2dGyt0WavYWDVzQ1PpXzF5S7gdX+cpTzQ4YgSwJbEl+/Ki4syxWQswHl88n7xwPR9YXJwj2dW3RfdPNCO25SzxeHcCZ2ocMc3ZnDM1JDphpXKdbsIAYPKLzVKu7E7biJjaXDvZ9cxtdRqL2h9aI4KLKDuEeEVmM4D8mKnA0oqypxlZK1vlhH35EKPFUYshN3NSNrqqka/Fv8Ho1cgG87KYoRLn+s59yBnK8ACauQiMi6zcaYQRTfBf1X7Mq7+FluFBEuNsib4EPGtR+By2ubifWUzIM8ReYVWLu7u1f87U/cB001+gt4EEW/xH1gwNOArnBr7oQhCnkBInCLkgVFTU1NE6JkkkVfwV+BiQq2SiHwDv67HTJ/JD7TWk9BfwiwS0PnMX+ligs+wPk4DKe1953Eesw/QTJi0QbwvV2CT63gExPOiebm5gcZMywwogFp8NOurq6z/6yY3ocPmBK4ZG0Aa4/x3+7AvwS4jOUcrgwDAAAAAElFTkSuQmCC") !important;
  background-size: 90% 90% !important;
}
.filter-tree /deep/ .changeImgLately:before {
  content: "";
  position: absolute;
  top: 0;
  left: -25px;
  width: 23px;
  height: 23px;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAADeklEQVRYCe1WbUtUQRQ+Z3ZdBUkJCkoLyvIHGPQDKhGMwDfyW0G/IPalFXW3ru6uYu4q+QOEom/mS1EEYdSHPlbQp6DCpFKCgigtXdc70zM3da97d7fVrU96ec6dM2fOOXNm5swL0e6302eAtzIBseHYQVOpFlLURMSHYbsfpPEFvw9MfNc03ZNGMPgZ9YJQUADGUP9xl1J9ilQbvApQPkgEMm4ydxm+znf5FHXbXwPoSUTb4PAmlMtBSdCYYjWh2PWqdJm+oU7JMtrL0qwTJFoQ5HnIPKBFVnwhHOiaAp8TnLMFDb2JqA9THQfLCGLMFBw0vJ2zlOczhvtrhJKDWKZWqElW5AsHum+Az4qcAUTifc0Y6TisUJA/m5PeREyhna76ux1+IvGYVzENol0H3xT2d90H70DW9TQGBg6h11vQFkQqmK1ztOUFbIbRcyeUBJbltk5g8A6gA4eMhHs1Auke0ORVf2gI5bYQ8nZh+ZQeeaUpqTebE5EpxBoeIaKLoBUpRADltsGMNDSVDw5SoEvRRFRvXbBpOAJwmbIJzQJJNIGEmwFfFMLB8FsksN4JLuxP7XuTP0cASJxGrYEc0EaaLZrSvvhspjNHAFA4BiLs8xe6/BfEQv7xJakm0587U4D6ARBRabLg43R9O1p2az/71vQkPfNJ9yqOFKpaa94oxAaXZqw9Xf6r3NrjafH/4ZwzwDSPBKz9KVLV6PINKCfso8yphIYll1m9NtI5VDdhTW6TKbIyn0nW2aRFsUKoE5YDpvdWafs5A2Dr4CDs4GabXnGs1Nc3UkDRg0xHjgBkqmQKSqvE1IpDqQZ8UYhcj9TCVzOcmEzqHspNEJtqqBgdHZ9gMArWI6RMKIWTAZXtQNsqF+uj3IPOR0P+0MdMP44AtIJMuXtQLoCaI4l+faGA3TqiQ30hTPw5WH4Xgq+hdMDlkEDwdHp64XRD/WtiagedOdVQn3zy6PEzNBUEPXJXZSk6ty4gTCG3h3zdL7MZczbhusz+IEEgdySLK7gfZinPp/MGSxeHSgtI4jr34kYdAZ8VeQPQFo4nmaJJBPNQKn5OiyszFRUV/EMuH2VBJ3HxN+Lu1wlXCtvin2RwYsGIG/uYSwKI9jIEZaB8WFJEI0ql4kbA+JpPUbfBpy4KI/2qsT3La2FVBdKYw09fu1t+lsNuFzt8Bn4DN8klCcjCu9UAAAAASUVORK5CYII=") !important;
  background-size: 90% 90% !important;
}
.filter-tree /deep/ .el-tree-node__expand-icon.is-leaf {
  color: transparent;
  cursor: default;
}
.filter-tree /deep/ .el-tree-node {
  margin-bottom: 5px;
}
.filter-tree /deep/ .el-tree-node__children .is-current::before {
  content: "";
  display: inline-block;
  width: 2px;
  height: 32px;
  background-color: #0091ff;
  position: absolute;
}
.filter-tree /deep/ .is-current > div:first-child {
  background: #ebf4fe;
  color: #0091ff;
}
.filter-tree /deep/ .is-current .changeImgOften:before {
  // background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAARCAYAAADHeGwwAAACRElEQVQ4T52UzW/ScBjHR2mBvq0da6GE4ODgBIziFk08ycX4ssR40Zh48LCb0X/Cv2A3/Qd208SbUS/EkwlyWZRkLotgxA4KAn0D0pXi89NgGIHS+Ts1/X2f5/O8/R7fksdTLpcDmUxm4PP5lmRZXovH4z+8mPq8iJBmOBy2ul3zjuP4q6urZBXDsKAXW08AXdcjDMPUIXrsL8xROx39uiBwnxZBPAFQ9B3D2BI4rogcVpvN2JogVAG4MIuFgHr919VoNPxh2hmCQmaPeZ5/6ZbFCcBoNPL3B4NdMhR6AEZ/7mzb/gKOHobD4c+TjjRNE0Ik+ZbA8c2x1rKOP1Yq326m02l9rD0BcOBomvmE59kXi2o7616WlWuxmIiy/ed3OgOnYRiSxLLK/wAURWFEUdTnAhqNRjQSiRy1Wq00CA9OA6lUFCmZFOWmpq1HOO5wZonQzzJEkRVFTVXVW9DA914g7bZxYWWF3jMMI8qybHPSZuYUoWaD6Njo9Z6yNP3cDaKq5u3lZeoNZM9IkmROa+eOqWVZOzCKXZIkn7kBdL13LxAgtoNBYmuWbi4AxvNnrVa7nEwmj9wApVKJ2NjY1P1+LHQqAJRpNDkNbhA37dwMpo2ggTdomn6HQP1+/z5FUa/GUKSFbwICsj31oFAo4Pl83oKNicHDu8uy1Ouh43z/ur9/LpvNQvXsPRzHz5um+QiW4C70yoAVfiaRSLQ9AZAInn2RIPAr4OwAepFLpVKDSWNU+4u5XBFWxSUAHALw7Kwy/gYs3/8SzCPghAAAAABJRU5ErkJggg==") !important;
  background-repeat: no-repeat;
  height: 17px !important;
}

.changeImgLately {
  position: relative;
}
.filter-tree /deep/ .changeImgLately:after {
  content: "";
  position: absolute;
  bottom: -12px;
  left: -42px;
  width: 220px;
  height: 1px;
  border-bottom: 1px solid #e9ebf0;
}
.iconA{
  display: inline-block;
  // width: 20px;
  // height: 20px;
  // background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAOCAYAAADJ7fe0AAABJklEQVQ4T53RPUgDQRAF4PcS8BCENOY6wUI82xgFK8EiREsLe0tBsLATBCP2IlhZi52ksDMoEWwVK0MwaOnPCf6AQSOXHWfRoAiB25tii2Xet8MOpRI8QtAP6Am5hXAPXnqDU7U3vYtVlMNAw/9LbpSc5/TVaRylC2Kj0gZY+56wSxmzzplG+S9yp62tOC//9phNFhvbHSRCppmHFw24IXZOaXWQKrLPFzr+sjMCHP8gZgn+66JuJkiArCgybNDbLKAvOkoAaKQ9bic5g/+yqzvYSoA8IfeQtciq/sek/kfBHZF9joZzlOrgBDLvJwp4zojIAvPhDuXcnwVZdgZswMgQx8Jri5QUWXNGKBXmwqLNUS7Rgw9/BClJxYYk/YmD+zpLMDbzBdd1ckiv8q08AAAAAElFTkSuQmCC")
  //   no-repeat;
  // background-size: 90% 90% !important;
  // margin-right: 3px;
}
.custom-tree-node{
  display: flex;
  align-items: center;
}
// 调整最近联系人间距
/deep/ .filter-tree > .el-tree-node:nth-child(2) > .el-tree-node__content {
  margin-bottom: 17px;
}
</style>

<style lang="scss" module>
  .treeScroll {
    height: 708px;
    overflow-y: auto;
  }
</style>
