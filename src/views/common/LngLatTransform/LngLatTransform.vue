<template>
  <div style="display: inline;">
    <!-- <el-tooltip
      content="经纬度转换"
      effect="dark"
      placement="bottom"
    > -->
      <button
        class="site-navbar__menu__lnglat"
        @click="$refs.dialog.visible = true"
      />
    <!-- </el-tooltip> -->
    <sv-dialog
      ref="dialog"
      title="经纬度转换工具"
      :modal="false"
      @cancel="$refs.dialog.visible = false"
      @modal="$refs.dialog.visible = false"
    >
      <div class="lnglat-transform">
        <div class="lnglat-transform__operation">
          <sv-select
            v-model="type"
            :clearable="false"
            :options="options"
            width="300px"
          />
          <sv-button @click="text = ''">
            清空
          </sv-button>
          <sv-button
            type="primary"
            @click="handleTransform"
          >
            转换
          </sv-button>
        </div>
        <sv-textarea
          v-model="text"
          :rows="10"
          :scroll="true"
          placeholder="请从Excel中复制纬度和经度两列的数据"
        />
      </div>
      <template #footer>
        <span />
      </template>
    </sv-dialog>
  </div>
</template>

<script>
import lib from './js/LngLatTransform';

export default {
  name: 'LngLatTransform',
  data() {
    return {
      text: '',
      type: 0,
      options: [
        {
          label: '百度坐标系 → 火星坐标系',
          value: 0,
        },
        {
          label: '火星坐标系 → 百度坐标系',
          value: 1,
        },
        {
          label: 'WGS84 → 火星坐标系',
          value: 2,
        },
        {
          label: '火星坐标系 → WGS84',
          value: 3,
        },
      ],
    };
  },
  methods: {
    /**
     * @description 执行转换
     */
    handleTransform() {
      const originalData = this.text.split('\n');
      const result = [];
      originalData.forEach((data) => {
        let lnglat = data.split('\t');
        if (
          lnglat[0]
          && lnglat[1]
          && Number(lnglat[0])
          && Number(lnglat[1])
        ) {
          switch (this.type) {
            case 0: {
              lnglat = lib.bd09togcj02(Number(lnglat[0]), Number(lnglat[1]));
              break;
            }
            case 1: {
              lnglat = lib.gcj02tobd09(Number(lnglat[0]), Number(lnglat[1]));
              break;
            }
            case 2: {
              lnglat = lib.wgs84togcj02(Number(lnglat[0]), Number(lnglat[1]));
              break;
            }
            case 3: {
              lnglat = lib.gcj02towgs84(Number(lnglat[0]), Number(lnglat[1]));
              break;
            }
            default:
          }
        }
        result.push(lnglat.join('\t'));
      });
      this.autoCopy(result.join('\n'));
    },
    /**
     * @description 自动将转换结果复制到剪切板
     * @param {String} value 转换后的结果
     */
    autoCopy(value) {
      const copyContainer = document.createElement('textarea');
      copyContainer.value = value;
      document.body.appendChild(copyContainer);
      copyContainer.select();
      document.execCommand('Copy');
      document.body.removeChild(copyContainer);
      this.$message.success('转换成功，已复制到剪切板');
    },
  },
};
</script>

<style lang="scss">
.site-navbar__menu__lnglat {
  border: 0;
  outline: 0;
  width: 20px;
  height: 20px;
  vertical-align: middle;
  margin: 0 10px;
  cursor: pointer;
  background: no-repeat center/100% 100% url('./img/lnglat_transform.svg');
  &:active {
    position: relative;
    top: 1px;
  }
}
.lnglat-transform {
  width: 410px;
  padding: 10px;
  &__operation {
    margin: 0 0 10px 0;
    text-align: right;
    & > .sv-select {
      float: left;
    }
  }
}
</style>
