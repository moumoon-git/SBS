<template>
  <div :class="$style.container">
    <contact-group :class="$style.left"/>
    <contact-list :class="$style.right"/>
  </div>
</template>

<script>
import ContactGroup from './ContactGroup/ContactGroup'
import ContactList from './ContactList/ContactList'

export default {
  name: 'PreplanDocument',
  components: {
    ContactGroup,
    ContactList
  }
}
</script>

<style module>
.container {
  display: flex;
  width: 100%;
  height: 100%;
}

.left {
  width: 350px;
  height: 100%;
  flex-grow: 0;
  flex-shrink: 0;
}

.right {
  height: 100%;
  flex-grow: 1;
  border-left: 1px solid #F2F2F2;
}
</style>