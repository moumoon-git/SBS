<template>
  <div
    class="sv-table-operation"
    :class="{'sv-table-operation__single': display.length == 1}"
  >
    <el-tooltip
      v-for="(icon, index) in display"
      :key="`sv-table-operation-icon__${index}`"
      :content="getTooltip(icon)"
      effect="dark"
      placement="top"
    >
      <div
        class="sv-table-operation__button"
        :class="`sv-table-operation__${icon}`"
        @click.stop="handleClick(icon)"
      />
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'SvTableOperation',
  props: {
    /**
     * @props
     * @desc 显示哪些按钮
     * @type {Array}
     * @example ['edit', 'delete', 'view', 'start', 'stop', 'qrcode', 'add', 'audit', 'submit', 'resubmit', 'download', 'collect', 'contactor', 'call', 'link', 'lock', 'unlock', 'recall', 'export', 'setting', 'cross', 'monitor', 'release']
     */
    display: {
      type: Array,
      default: () => ['view', 'edit', 'delete'],
    },
  },
  methods: {
    /**
         * @method
         * @desc 根据icon类型，返回对应tooltip的提示内容
         * @param {String} icon icon的名字
         * @return {String} 对应的的提示框文本
         */
    getTooltip(icon) {
      switch (icon) {
        case 'edit':
        case 'edit_disable':
          return '编辑';
        case 'delete':
        case 'delete_disable':
          return '删除';
        case 'view':
        case 'view_disable':
          return '查看';
        case 'start':
        case 'start_disable':
          return '启用';
        case 'stop':
        case 'stop_disable':
          return '停用';
        case 'qrcode':
        case 'qrcode_disable':
          return '二维码';
        case 'add':
        case 'add_disable':
          return '添加';
        case 'audit':
        case 'audit_disable':
          return '审核';
        case 'submit':
        case 'submit_disable':
          return '报审';
        case 'resubmit':
        case 'resubmit_disable':
          return '重新报审';
        case 'download':
        case 'download_disable':
          return '下载';
        case 'collect':
        case 'collect_disable':
          return '收藏';
        case 'contactor':
        case 'contactor_disable':
          return '联系人';
        case 'call':
        case 'call_disable':
          return '拨号';
        case 'link':
        case 'link_disable':
          return '链接';
        case 'confirm':
        case 'confirm_disable':
          return '确认';
        case 'unlock':
        case 'unlock_disable':
          return '解锁';
        case 'lock':
        case 'lock_disable':
          return '锁定';
        case 'recall':
        case 'recall_disable':
          return '撤回';
        case 'export':
        case 'export_disable':
          return '导出';
        case 'setting':
        case 'setting_disable':
          return '配置';
        case 'cross':
        case 'cross_disable':
          return '新增';
        case 'monitor':
        case 'monitor_disable':
          return '监控';
        case 'release':
        case 'release_disable':
          return '发布';
        case 'up':
          return '上移';
        case 'down':
          return '下移';
        case 'record':
          return '调拨记录';
        default:
          return icon;
      }
    },
    /**
     * @method
     * @desc 点击向父组件传递相应事件
     * @param {String} icon icon的名字
     */
    handleClick(icon) {
      if (icon.slice(-8) !== '_disable') {
        this.$emit(icon);
      }
    },
  },
};
</script>

<style lang="scss">
$iconNameList: edit, delete, view, start, stop, qrcode, add, release, audit, submit, resubmit, download, collect, contactor, call, link, lock, unlock, recall, export, setting, cross, monitor, up, down, record;
.sv-table-operation {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    .sv-table-operation__button {
        display: inline-block;
        width: 23px;
        height: 23px;
        margin: 0 2px;
        cursor: pointer;
        &:active {
            position: relative;
            top: 1px;
        }
        @each $i in $iconNameList {
            @if $i == audit or $i == submit or $i == resubmit {
                &.sv-table-operation__#{$i} {
                    background: no-repeat url('../img/icon/audit.svg') center/100% 100%;
                    &:hover {
                        background-image: url('../img/icon/audit_hover.svg');
                    }
                }
                &.sv-table-operation__#{$i}_disable {
                    background: no-repeat url('../img/icon/audit_disable.svg') center/100% 100%;
                    cursor: not-allowed;
                }
            } @else {
                &.sv-table-operation__#{$i} {
                    background: no-repeat url('../img/icon/#{$i}.svg') center/100% 100%;
                    &:hover {
                        background-image: url('../img/icon/#{$i}_hover.svg');
                    }
                }
                &.sv-table-operation__#{$i}_disable {
                    background: no-repeat url('../img/icon/#{$i}_disable.svg') center/100% 100%;
                    cursor: not-allowed;
                    &:active {
                        position: static;
                    }
                }
            }
        }
        // 新增
        &.sv-table-operation__cross,
        &.sv-table-operation__cross_disable {
            background-size: 80% 80%;
        }
    }
    &.sv-table-operation__single {
        justify-content: center;
    }
}
</style>
