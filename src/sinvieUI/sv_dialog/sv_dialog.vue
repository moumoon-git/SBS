<template>
  <transition name="fadeout">
    <div
      v-if="visible"
      class="sv-dialog__container"
    >
      <!-- 遮罩 -->
      <div
        class="sv-dialog__shade"
        :style="modal ? '' : 'background:transparent;'"
        @click="$emit('modal')"
      />

      <!-- 弹窗 -->
      <div
        ref="container"
        class="sv-dialog"
      >
        <!-- 【插槽】标题 -->
        <slot name="title">
          <div class="sv-dialog__title">
            <div class="sv-dialog__title__context">
              {{ title }}
            </div>
            <div
              class="sv-dialog__close"
              @click="$emit('cancel')"
            />
          </div>
        </slot>
        <div class="sv-dialog__context">
          <!-- 【插槽】内容 -->
          <slot />
        </div>
        <!-- 【插槽】页脚 -->
        <slot name="footer">
          <div
            class="sv-dialog__footer"
          >
            <sv-button
              width="52px"
              @click="$emit('cancel')"
            >
              取消
            </sv-button>
            <sv-button
              width="52px"
              type="primary"
              @click="$emit('confirm')"
            >
              确定
            </sv-button>
          </div>
        </slot>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'SvDialog',

  props: {
    title: {
      type: String,
      default: '',
    },

    modal: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      visible: false,
    };
  },

  mounted() {
    // 监听ESC按键
    this.$nextTick(() => {
      document.addEventListener('keyup', (evt) => {
        if (evt.keyCode === 27) {
          this.$emit('cancel');
        }
      });
    });
  },
};
</script>

<style lang="scss">
// 弹窗弹出动画
@keyframes pop-up {
  from {transform: scale(0);}
  to {transform: scale(1);}
}
.sv-dialog__container {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2004;
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  overflow: auto;
  // 居中，上下用伪元素填充，防止内部元素高度超出导致显示不全
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  &::before, &::after {
    content: '';
    display: block;
    flex: 1;
  }
}
// 遮罩
.sv-dialog__shade {
  position: fixed;
  background: #000;
  opacity: .5;
  left: -100vw;
  top: -100vh;
  width: 200vw;
  height: 200vh;
  z-index: -1;
}
// 弹窗本体
.sv-dialog {
  font-size: 14px;
  min-width: 200px;
  border-radius: 5px;
  box-shadow: 0px 0px 23px 3px rgba(201, 201, 201, 0.27);
  background: #ffffff;
  flex-shrink: 0;
  min-height: 0;
  z-index: 2004;
  display: inline-flex;
  flex-direction: column;
  animation: pop-up 0.3s;
  transform-origin: center;
  margin: 100px 0;

  .sv-dialog__title {
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    background: #F1F4F6;
    color: #333333;
    position: relative;
    display: flex;
    align-items: center;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;

    .sv-dialog__title__context {
      flex: 1;
      text-align: left;
    }

    .sv-dialog__close {
      width: 15px;
      height: 15px;
      background: no-repeat url('../img/dialog/close.svg') center/100% 100%;
      margin: 0 10px;
      cursor: pointer;

      &:hover {
        background-image: url('../img/dialog/close_hover.svg')
      }
    }
  }

  .sv-dialog__context {
    flex-grow: 1;
    margin: 0;
    display: flex;
    background: #ffffff;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }

  .sv-dialog__footer {
    border-top: 1px solid #F2F2F2;
    padding: 10px 20px;
    text-align: right;
    background: #ffffff;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
}

// 弹窗消失渐变效果
.fadeout-leave-active {
  transition: opacity .3s;
}

.fadeout-leave-to {
  opacity: 0;
}
</style>
