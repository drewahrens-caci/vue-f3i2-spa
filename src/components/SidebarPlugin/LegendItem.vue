<template>
  <component :is="baseComponent" class="legend-item" tag="li">
    <b-alert v-if="item.type == 'alert'" :variant="item.variant" show>
      <font-awesome-icon v-if="item.hasIcon && item.library === 'fas'" fas :icon="item.icon" class="icon float-right ml-1" :class="'text-' + item.iconVariant"></font-awesome-icon>
      <font-awesome-icon v-else-if="item.hasIcon && item.library === 'far'" far :icon="item.icon" class="icon float-right ml-1" :class="'text-' + item.iconVariant"></font-awesome-icon>
      <span class="ml-1" :class="item.classes">{{ item.name }}</span>
    </b-alert>
  </component>
</template>

<script>
export default {
  name: 'legend-item',
  props: {
    item: {
      type: Object,
      default: () => {
        return {
          id: 0,
          type: 'alert',
          name: '',
          hasIcon: false,
          library: '',
          icon: '',
          iconVariant: '',
          variant: '',
          color: 'white',
          classes: ''
        }
      }
    }
  },
  computed: {
    baseComponent() {
      return 'li'
    }
  }
}
</script>

<style lang="scss" scoped></style>
