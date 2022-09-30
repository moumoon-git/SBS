<template>
  <div :class="[$style.container, { [$style.visible]: visible }]">
    <button :class="['el-icon-close', $style.close]" @click="close"/>
    <el-input
      v-model="value"
      class="sbs-input"
      placeholder="请输入号码"
      clearable
    />
    <div :class="$style.pad">
      <button @click="add('1')" />
      <button @click="add('2')" />
      <button @click="add('3')" />
      <button @click="add('4')" />
      <button @click="add('5')" />
      <button @click="add('6')" />
      <button @click="add('7')" />
      <button @click="add('8')" />
      <button @click="add('9')" />
      <button @click="add('*')" />
      <button @click="add('0')" />
      <button @click="add('#')" />
    </div>
    <button :class="$style.confirm" @click="confirm" />
    <button :class="$style.minus" @click="minus" />
  </div>
</template>

<script>
export default {
  name: 'DialPopup',
  data() {
    return {
      value: '',
      visible: false,
      resolve: null,
    };
  },
  methods: {
    open() {
      this.visible = true;
      return new Promise((resolve) => {
        this.resolve = resolve;
      });
    },
    close() {
      this.visible = false;
      this.value = '';
      this.resolve = null;
    },
    add(val) {
      this.value += val;
    },
    minus() {
      this.value = this.value.slice(0, this.value.length - 1);
    },
    confirm() {
      if (this.resolve) {
        this.resolve(this.value);
      }
      this.visible = false;
      this.value = '';
    },
  },
};
</script>

<style lang="scss" module>
.container {
  transform-origin: right bottom;
  transition: transform .3s;
  transform: scale(0);
  position: absolute;
  width: 237px;
  height: 287px;
  background: #ffffff;
  border-radius: 5px;
  box-shadow: 0px 2px 9px 0px rgba(63, 146, 254, 0.2);
  &.visible {
    transform: scale(1);
  }
  :global(.sbs-input) {
    margin: 19px 12px 12px;
    width: calc(100% - 24px);
  }
  button {
    margin: 0;
    padding: 0;
    border: none;
    cursor: pointer;
    &:hover { filter: brightness(105%); }
    &:active { filter: brightness(80%); }
  }
  .close {
    color: #979797;
    position: absolute;
    right: 4px;
    top: 8px;
    font-size: 10px;
    padding: 0;
    border: none;
    outline: none;
    background: transparent;
    margin: 0;
    cursor: pointer;
  }
  .pad {
    display: grid;
    margin: 0 auto;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 6px 11px;
    width: 217px;
    height: 170px;
    & > button {
      &:nth-child(1) { background: no-repeat center/100% 100% url(./1.svg); }
      &:nth-child(2) { background: no-repeat center/100% 100% url(./2.svg); }
      &:nth-child(3) { background: no-repeat center/100% 100% url(./3.svg); }
      &:nth-child(4) { background: no-repeat center/100% 100% url(./4.svg); }
      &:nth-child(5) { background: no-repeat center/100% 100% url(./5.svg); }
      &:nth-child(6) { background: no-repeat center/100% 100% url(./6.svg); }
      &:nth-child(7) { background: no-repeat center/100% 100% url(./7.svg); }
      &:nth-child(8) { background: no-repeat center/100% 100% url(./8.svg); }
      &:nth-child(9) { background: no-repeat center/100% 100% url(./9.svg); }
      &:nth-child(10) { background: no-repeat center/100% 100% url('./star.svg'); }
      &:nth-child(11) { background: no-repeat center/100% 100% url(./0.svg); }
      &:nth-child(12) { background: no-repeat center/100% 100% url('./hash.svg'); }
    }
  }
  .confirm {
    position: absolute;
    width: 65px;
    height: 37px;
    left: 87px;
    bottom: 15px;
    background: no-repeat center/100% 100% url('./confirm.svg');
  }
  .minus {
    position: absolute;
    width: 45px;
    height: 27px;
    right: 20px;
    bottom: 19px;
    background: no-repeat center/100% 100% url('./minus.svg');
  }
}
</style>
