<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <p v-if="student.isLogin" style="text-align: center; font-size: 20px;">欢迎您,{{student.name}}</p>
        <p style="font-family: sans-serif; font-size: 18px;">以下内容你需要了解的:</p>
        <p>1.新来的萌新每周需要打卡18小时（后续以管理层决定的时间为准),不足的会有相应的惩罚。</p>
        <p>2.允许的签到签退时间为: 6:00-23:30 (星期天-星期四)，6:00-24:00 (星期五-星期六),到时间系统会自动清退用户,用户此次记录并且不会被记录，所以要记得签退，同时向用户发邮件提醒。</p>
        <p>3.禁止刷时间，恶意举报。</p>
        <p>4.有Bug请联系技术副主席。</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import store from "@/store/store.js";
export default {
  data() {
    return {
      student: store.state.student
    };
  }
};
</script>
