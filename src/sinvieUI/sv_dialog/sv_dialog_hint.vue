<template>
  <div
    v-if="visible"
    class="sv-dialog-hint"
  >
    <div
      class="sv-dialog-hint__shade"
      :style="modal ? '' : 'background: transparent;'"
    />
    <div class="sv-dialog-hint__title">
      <div class="sv-dialog-hint__title__context">
        {{ title }}
      </div>
      <div
        class="sv-dialog-hint__close"
        @click="visible = false"
      />
    </div>
    <div class="sv-dialog-hint__context">
      <div
        v-if="type"
        :class="[
          'sv-dialog-hint__icon',
          {
            'sv-dialog-hint__icon-delete': type === 'delete',
            'sv-dialog-hint__icon-alert': type === 'alert',
            'sv-dialog-hint__icon-success': type === 'success',
            'sv-dialog-hint__icon-fail': type === 'fail',
            'sv-dialog-hint__icon-normal': type === 'normal' || type === 'submit'
          }
        ]"
      />
      <div class="sv-dialog-hint__context__text">
        {{ confirmHint }}
        <div v-if="type==='delete'">
          {{ supplementText || '删除后，数据将不可恢复' }}
        </div>
        <div v-else-if="type!=='delete' && supplementText">
          {{ supplementText }}
        </div>
      </div>
    </div>
    <div
      v-if="type==='delete' || type==='submit'"
      class="sv-dialog-hint__footer"
    >
      <sv-button
        width="52px"
        @click="
          $emit('cancel');
          visible = false;
        "
      >
        取消
      </sv-button>
      <sv-button
        width="52px"
        type="primary"
        @click="
          $emit('confirm');
          visible = false;
        "
      >
        确定
      </sv-button>
    </div>
    <div
      v-else-if="type==='alert'"
      class="sv-dialog-hint__footer"
    >
      <sv-button
        width="52px"
        @click="
          $emit('cancel');
          $emit('save');
          visible = false;
        "
      >
        保存
      </sv-button>
      <sv-button
        width="52px"
        type="primary"
        @click="
          $emit('confirm');
          $emit('exit');
          visible = false;
        "
      >
        退出
      </sv-button>
    </div>
    <div
      v-else-if="type==='fail'"
      class="sv-dialog-hint__footer"
    >
      <sv-button
        width="76px"
        @click="
          $emit('cancel');
          $emit('confirm');
          $emit('exit');
          visible = false;
        "
      >
        返回重试
      </sv-button>
    </div>
    <div
      v-else
      class="sv-dialog-hint__footer"
    >
      <sv-button
        width="100px"
        @click="
          $emit('cancel');
          $emit('confirm');
          $emit('exit');
          visible = false;
        "
      >
        返回操作列表
      </sv-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SvDialogHint',

  props: {
    type: {
      type: String,
      default: '',
    },

    title: {
      type: String,
      default: '提示',
    },

    text: {
      type: String,
      default: '',
    },

    supplement: {
      type: String,
      default: '',
    },

    modal: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      visible: false,
      supplementText: this.supplement,
    };
  },

  computed: {
    confirmHint() {
      let result = '';
      switch (this.type) {
        case 'delete': {
          result = this.text || '是否确认要删除？';
          break;
        }

        case 'alert': {
          result = this.text || '数据尚未保存，是否继续退出？';
          break;
        }

        case 'success': {
          result = this.text || '恭喜，提交成功！';
          break;
        }

        case 'fail': {
          result = this.text || '抱歉，提交失败！';
          break;
        }

        case 'normal': {
          result = this.text || '这是一条提醒消息！';
          break;
        }

        case 'submit': {
          result = this.text || '是否确认提交？';
          break;
        }

        default: {
          result = this.text;
        }
      }

      return result;
    },
  },

  watch: {
    supplement(val) {
      this.supplementText = val;
    },
  },
};
</script>

<style lang="scss">
@keyframes pop-up {
  from {transform: scale(0);}
  to {transform: scale(1);}
}

.sv-dialog-hint {
  font-size: 14px;
  width: 400px;
  height: 200px;
  border-radius: 5px;
  box-shadow: 0px 0px 23px 3px rgba(201, 201, 201, 0.27);
  background: #ffffff;
  position: fixed;
  left: calc(50vw - 200px);
  top: calc(50vh - 150px);
  z-index: 99999;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: pop-up 0.3s;

  .sv-dialog-hint__title {
    text-align: left;
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    background: #F1F4F6;
    color: #333333;
    position: relative;
    display: flex;
    align-items: center;

    .sv-dialog-hint__title__context {
      flex: 1;
    }

    .sv-dialog-hint__close {
      width: 15px;
      height: 15px;
      background: no-repeat url('../img/dialog/close.svg') center/100% 100%;
      margin: 0 10px;
      cursor: pointer;

      &:hover {
        background-image: url('../img/dialog/close_hover.svg');
      }
    }
  }
  .sv-dialog-hint__context {
    flex: 1;
    margin: 0;
    padding: 5px 54px;
    display: flex;
    align-items: center;
    background: #ffffff;

    .sv-dialog-hint__icon {
      width: 49px;
      height: 48px;
      margin-right: 20px;
      position: relative;
      bottom: 4px;
      flex-shrink: 0;

      $typeList: delete, alert, success, fail, normal;
      @each $i in $typeList {
        &.sv-dialog-hint__icon-#{$i} {
          background: no-repeat url('../img/dialog/hint_#{$i}.svg') center/100% 100%;
        }
      }
    }
    .sv-dialog-hint__context__text {
      text-align: left;

      // 补充说明文本
      div {
        color: #999999;
        font-size: 12px;
        margin-top: 8px;
        max-height: 70px;
        overflow-y: auto;
        word-break: break-all;
        white-space: pre-line;
        &::-webkit-scrollbar {
          width: 0;
        }
      }
    }
  }

  .sv-dialog-hint__footer {
    border-top: 1px solid #F2F2F2;
    padding: 10px 20px;
    text-align: right;
    background: #ffffff;
  }
}

.sv-dialog-hint__shade {
    position: fixed;
    background: #000;
    opacity: .5;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
}
</style>
