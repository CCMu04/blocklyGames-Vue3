<script setup>
import {ref, watch} from "vue";
import {myLocalStorage} from "@/store/myLocalStorage";
import {useStorage} from "@/store/useStorage";
import router from "@/router/router";

// const webName = 'Blockly Games'
const webName = '走迷宫';
const loginStatus = ref({});
if (localStorage.getItem('userInfo') == null) {
  loginStatus.value.name = '请登录';
  loginStatus.value.status = false;
} else {
  let userInfo = JSON.parse(myLocalStorage.getItem('userInfo'));
  loginStatus.value.name = userInfo.name;
  loginStatus.value.status = true;
}

watch((useStorage('userInfo')), () => {
  if (myLocalStorage.getItem('userInfo') == null) {
    loginStatus.value.status = false;
  } else {
    let userInfo = JSON.parse(myLocalStorage.getItem('userInfo'));
    loginStatus.value.name = userInfo.name;
    loginStatus.value.status = true;
  }
})

function logout() {
  myLocalStorage.removeItem('userInfo');
  router.push('/');
}
</script>

<template>
  <el-menu mode="horizontal" :ellipsis="false" :router="true">
    <el-menu-item index="/" style="margin-left: 20px">
      <el-icon size="100px">
        <Cpu/>
      </el-icon>
      <el-text style="font-weight: bold; font-size: x-large;">
        {{ webName }}
      </el-text>
    </el-menu-item>
    <div class="flex-grow"></div>
    <el-menu-item index="/">
      <el-icon>
        <HomeFilled/>
      </el-icon>
      <el-text>首页</el-text>
    </el-menu-item>
    <el-menu-item index="games">
      <el-icon>
        <Histogram/>
      </el-icon>
      <el-text>趣味编程</el-text>
    </el-menu-item>
    <el-sub-menu v-if="loginStatus.status">
      <template #title>
        <el-icon>
          <UserFilled/>
        </el-icon>
        <el-text>{{ loginStatus.name }}</el-text>
      </template>
<!--      <el-menu-item>查看信息</el-menu-item>-->
      <el-menu-item @click="logout">退出登录</el-menu-item>
    </el-sub-menu>
    <el-menu-item v-else style="margin-right: 20px" index="login">
      <el-icon>
        <UserFilled/>
      </el-icon>
      <el-text>请登录</el-text>
    </el-menu-item>
  </el-menu>
</template>

<style scoped>
.flex-grow {
  flex-grow: 1;
}
</style>