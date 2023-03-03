<template>
  <button :type="type"><slot>Кнопка</slot></button>
</template>

<script>
export default {
  props: ["type"],
};
</script>
