<template>
    <div>
      <communication-mobile-human style="border: 1px solid #ccc">

      </communication-mobile-human>

      <communication-history-human style="border: 1px solid #ccc;margin-top: 10px;">

      </communication-history-human>
    </div>
</template>

<script>
  import communicationMobileHuman from '../mobile_human'  // 联系人列表
  // eslint-disable-next-line camelcase
  import communicationHistory_human from '../history_human'  // 联系人列表
  import Bus from '@/utils/bus'
  export default {
    name: 'mobile_common',
    data () {
      return {

      }
    },
    mounted () {
      // url: '/mail/mailcontactor/commonContactorList',
      Bus.$emit('mobile_human_data', { num: 4 })
      Bus.$emit('common', {url: '/mail/mailcontactor/commonContactorList'})
    },
    methods: {

    },
    components: {
      'communication-mobile-human': communicationMobileHuman,
      'communication-history-human': communicationHistory_human
    }
  }
</script>

<style scoped>

</style>
