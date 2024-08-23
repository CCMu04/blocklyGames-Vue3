<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <Header v-show="$route.meta.showHeaderFooter"/>
  <RouterView/>
  <Footer v-show="$route.meta.showHeaderFooter"/>
</template>

<style>
* {
  margin: 0;
}

#blocklyDiv {
  .blocklyMainBackground {
    stroke-width: 0;
  }
}

.gameLoading {
  .el-loading-spinner {
    .circular {
      background-image: url('/public/img/loading.gif');
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
    }

    .el-loading-text {
      color: rgba(161, 255, 161, 0.79);
      font-size: larger;
      font-weight: bolder;
      font-family: 'Noto Sans SC', 'ZCOOL KuaiLe', sans-serif;
    }
  }
}
</style>
