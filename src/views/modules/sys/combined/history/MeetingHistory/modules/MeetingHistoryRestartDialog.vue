<template>
  <sv-dialog
    ref="dialog"
    title="重启会议"
    @modal="$refs.dialog.visible = false;"
    @cancel="$refs.dialog.visible = false;"
  >
    <div :class="$style.container">
      <header>
        会议成员：{{ members.length }}
      </header>
      <main>
        <ul :class="$style.list">
          <li
            v-for="(member, index) in members"
            :key="member.id"
          >
            <span>{{ member.memberName }}</span>
            <button
              :class="$style.delete"
              @click="handleDelete(index)"
            />
          </li>
        </ul>
      </main>
    </div>
    <template #footer>
      <footer :class="$style.footer">
        <sv-button
          type="primary"
          @click="handleRestartMeeting"
        >
          重启会议
        </sv-button>
      </footer>
    </template>
  </sv-dialog>
</template>

<script>
export default {
  name: 'MeetingHistoryRestartDialog',
  inject: ['combined'],
  data() {
    return {
      resolve: null,
      reject: null,
      detail: null,
      members: [],
    };
  },
  methods: {
    /**
     * 打开弹窗
     * @param {String} initValue 初始值
     */
    open(initValue) {
      this.detail = initValue;
      this.members = [...(initValue.members || [])];
      this.$refs.dialog.visible = true;
    },
    /**
     * 重启会议
     */
    handleRestartMeeting() {
      const members = [];
      if (this.members && this.members.length) {
        this.members.forEach((member) => {
          members.push({
            Id: member.memberId || member.id,
            Name: member.memberName || member.memberCode,
            Number: member.memberCode,
            Type: member.memberType < 5 ? 1 : member.memberType === 8 ? 4 : member.memberType === 5 ? 9 : 8,
          });
        });
        this.combined.uds.createMeeting(
          this.detail.meetingInfo.title,
          members,
          this.detail.meetingInfo.eventId,
        );
        this.$refs.dialog.visible = false;
      }
    },
    /**
     * 删除成员
     * @param {Number} index 下标
     */
    handleDelete(index) {
      this.members.splice(index, 1);
    },
  },
};
</script>

<style lang="scss" module>
.container {
  width: 400px;
  padding: 10px 20px;
  .list {
    list-style: decimal;
    margin: 10px 0;
    padding: 0 0 0 20px;
  }
  .delete {
    background: #0091FF;
    mask: no-repeat center/100% 100% url(./imgs/delete.svg);
    width: 14px;
    height: 14px;
    border: none;
    outline: none;
    cursor: pointer;
    &:hover {
      opacity: .7;
    }
    &:active {
      position: relative;
      top: 1px;
    }
  }
}
.footer {
  text-align: center;
  padding: 10px;
}
</style>
