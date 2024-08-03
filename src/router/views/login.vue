<script setup>
import {ref} from "vue";
import PicCode from "@/components/PicCode.vue";
import {myLocalStorage} from "@/store/myLocalStorage";
import router from "@/router/router";
import {ElMessage} from "element-plus";

const code = ref('');
const inputCode = ref('');
const username = ref('');
const password = ref('');
const registerDig = ref(false);
const repeatPassword = ref('');
const registerInfo = ref({
  username: '',
  password: '',
  name: '',
  sex: 1,
  phone: '',
  birthday: null,
  address: ''
});

let string = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
refreshCode();

function login() {
  // 验证码
  if (code.value.toLowerCase() !== inputCode.value.toLowerCase()) {
    setMessage('warning', '验证码错误！');
    return;
  } else refreshCode();
  if (username.value === 0 || password.value.length === 0) {
    setMessage('warning', '未填写账号或密码！');
    return;
  }

  const axios = require('axios');
  let data = new FormData();
  data.append('username', username.value);
  data.append('password', password.value);
  let login = axios.post('https://api.chcmu.xyz/login', data);
  Promise.resolve(login)
      .then((response) => {
        console.log(response.data)
        if (response.data.code === 1) {
          let userInfo = response.data.data[0];
          setMessage('success', `欢迎你，${userInfo.name}！`);
          myLocalStorage.setItem("userInfo", JSON.stringify(userInfo));
          router.push("/");
        } else setMessage('error', response.data.msg);
      }).catch((error) => {
    console.log(error)
  });
}

function register() {
  if (registerInfo.value.username.length === 0 || registerInfo.value.password.length === 0 ||
      registerInfo.value.name.length === 0 || registerInfo.value.phone.length === 0) {
    setMessage('warning', '请填写完整必要信息！');
    return;
  }

  if (registerInfo.value.password !== repeatPassword.value) {
    setMessage('warning', '两次密码输入不一致！');
    return;
  }

  const axios = require('axios');
  let register = axios.post('https://api.chcmu.xyz/register', registerInfo.value);
  Promise.resolve(register)
      .then((response) => {
        console.log(response)
        if (response.data.code === 1) {
          setMessage('success', `${registerInfo.value.name}，感谢你的注册！`);
          registerDig.value = false;
        } else setMessage('warning', response.data.msg);
      }).catch((error) => {
    console.log(error)
  });
}

function refreshCode() {
  code.value = '';
  for (let i = 0; i < 4; i++)
    code.value += string.charAt(Math.floor(Math.random() * string.length));
}

function setMessage(type, msg) {
  if (type !== 'error') {
    ElMessage({
      showClose: true,
      message: msg,
      type: type,
    });
  } else {
    ElMessage.error({
      showClose: true,
      message: msg
    });
  }
}
</script>

<template>
  <el-card style="width: 700px; margin: 150px auto; background-image: url('/img/login.png'); text-align: center">
    <div style="margin: 50px">
      <el-text style="font-size: xx-large; font-weight: bolder; color: azure">
        <el-icon>
          <Flag/>
        </el-icon>
        登录界面
      </el-text>
    </div>
    <div>
      <div style="display: flex; margin: 15px; justify-content: center;">
        <el-text style="color: azure; font-weight: bold; font-size: large; margin-right: 10px">
          <el-icon>
            <User/>
          </el-icon>
          账号
        </el-text>
        <el-input style="max-width: 250px;" placeholder="此处输入你的账号..." v-model="username">
        </el-input>
      </div>
      <div style="display: flex; margin: 15px; justify-content: center;">
        <el-text style="color: azure; font-weight: bold; font-size: large; margin-right: 10px">
          <el-icon>
            <Lock/>
          </el-icon>
          密码
        </el-text>
        <el-input style="max-width: 250px;" placeholder="此处输入你的密码..." v-model="password"
                  type="password">
        </el-input>
      </div>
      <div style="display: flex; margin: 15px; justify-content: center; align-items: center;">
        <el-input style="width: 150px; height: 32px" placeholder="验证码" v-model="inputCode"></el-input>
        <PicCode :identify-code="code" style="margin-left: 20px" @click="refreshCode"/>
      </div>
    </div>
    <div style="display: flex; justify-content: center; margin-bottom: 50px">
      <el-button @click="login">登录</el-button>
      <el-button @click="registerDig = true">注册</el-button>
    </div>
  </el-card>

  <el-dialog v-model="registerDig" align-center width="500px">
    <div style="text-align: center; margin: 30px">
      <el-text style="font-size: x-large; font-weight: bold">注册</el-text>
    </div>
    <div class="registerLine">
      <el-text>{{ `*账\u3000\u3000号` }}</el-text>
      <el-input style="width: 250px; margin-left: 20px" v-model="registerInfo.username"></el-input>
    </div>
    <div class="registerLine">
      <el-text>{{ `*密\u3000\u3000码` }}</el-text>
      <el-input style="width: 250px; margin-left: 20px" v-model="registerInfo.password" type="password"></el-input>
    </div>
    <div class="registerLine">
      <el-text>{{ `*重复密码` }}</el-text>
      <el-input style="width: 250px; margin-left: 20px" v-model="repeatPassword" type="password"></el-input>
    </div>
    <div class="registerLine">
      <el-text>{{ `*昵\u3000\u3000称` }}</el-text>
      <el-input style="width: 250px; margin-left: 20px" v-model="registerInfo.name"></el-input>
    </div>
    <div class="registerLine">
      <el-text>{{ `*性\u3000\u3000别` }}</el-text>
      <el-select style="width: 250px; margin-left: 20px" v-model="registerInfo.sex" placeholder="选择你的性别">
        <el-option :value="1" label="男"/>
        <el-option :value="0" label="女"/>
      </el-select>
    </div>
    <div class="registerLine">
      <el-text>{{ `*手\u3000\u3000机` }}</el-text>
      <el-input style="width: 250px; margin-left: 20px" v-model="registerInfo.phone"></el-input>
    </div>
    <div class="registerLine">
      <el-text>{{ ` 出生日期` }}</el-text>
      <el-date-picker style="width: 250px; margin-left: 20px" v-model="registerInfo.birthday" type="date"
                      format="YYYY/MM/DD" value-format="YYYY-MM-DD" placeholder="选择你的出生日期"/>
    </div>
    <div class="registerLine">
      <el-text>{{ ` 地\u3000\u3000址` }}</el-text>
      <el-input style="width: 250px; margin-left: 20px" v-model="registerInfo.address"></el-input>
    </div>
    <div style="text-align: center; margin: 50px">
      <el-button style="width: 150px" @click="register">注册</el-button>
    </div>
  </el-dialog>
</template>

<style scoped>
.registerLine {
  display: flex;
  justify-content: center;
  margin: 10px;
}
</style>