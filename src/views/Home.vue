<template>
  <v-container>
    <div id="inform">
      <span id="tip">{{ msg }}</span>
    </div>
    <v-row>
      <v-col cols="12" v-if="allDisabled">
        <v-alert type="warning">现在不是上班时间</v-alert>
      </v-col>

      <v-col cols="12" v-if="shareState.student.isLogin">
        <v-alert type="success" dense :icon="mdiCheckCircle">
          <h3>已签到</h3>
          <p class="mb-0">学号：{{ shareState.student.id }}</p>
          <p class="mb-0">姓名：{{ shareState.student.name }}</p>
          <p class="mb-0">周序：{{ week }}</p>
        </v-alert>
      </v-col>

      <v-col cols="12">
        <v-text-field :rules="idError" label="输入学号" ref="inputId" hide-details="auto" :disabled="inputIdDisabled" v-model="inputId"></v-text-field>
      </v-col>

      <v-col cols="12">
        <v-btn class="mr-3" color="primary" rounded :disabled="signUpDisabled" @click.stop="signUp">签到
        </v-btn>
        <v-btn rounded outlined color="gray" :disabled="signOutDisabled" @click.stop="signOut">签退</v-btn>
        <v-dialog v-model="signUpDialog.show" width="500">
          <v-card color="primary" v-if="signUpDialog.loading">
            <v-card-text>
              Please stand by
              <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
            </v-card-text>
          </v-card>
          <v-card v-else-if="signUpDialog.success">
            <v-card-title class="headline light-green">签到成功</v-card-title>
            <v-card-text>
              <p class="mt-5 mb-0">学号：{{ signUpDialog.msg.id }}</p>
              <p class="mb-0">姓名：{{ signUpDialog.msg.name }}</p>
              <p class="mb-0">签到开始时间：{{ signUpDialog.msg.currentTime }}</p>
              <p class="mb-0">本周签到总时长：{{ signUpDialog.msg.allTime }}</p>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="signUpDialog.show = false">确认</v-btn>
            </v-card-actions>
          </v-card>
          <v-card v-else>
            <v-card-title class="headline red">签到失败</v-card-title>
            <v-card-text>
              <p class="mb-0 mt-5">{{ signUpDialog.msg.err }}</p>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="signUpDialog.show = false">确认</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="signOutDialog.show" width="500">
          <v-card color="primary" v-if="signOutDialog.loading">
            <v-card-text>
              Please stand by
              <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
            </v-card-text>
          </v-card>
          <v-card v-else-if="signOutDialog.success">
            <v-card-title class="headline light-green">签退成功</v-card-title>
            <v-card-text>
              <p class="mt-5 mb-0">学号：{{ signOutDialog.msg.id }}</p>
              <p class="mb-0">姓名：{{ signOutDialog.msg.name }}</p>
              <p class="mb-0">本次签到时长：{{ signOutDialog.msg.accumulatedTime }}h</p>
              <p class="mb-0">签到总时长：{{ signOutDialog.msg.totalTime }}h</p>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="signOutDialog.show = false">确认</v-btn>
            </v-card-actions>
          </v-card>
          <v-card v-else>
            <v-card-title class="headline red">签退失败</v-card-title>
            <v-card-text>
              <p class="mt-5 mb-0">{{ signOutDialog.msg.err }}</p>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="signOutDialog.show = false">确认</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>

    <v-row v-if="shareState.student.isLogin">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            当前在教室的人数：{{ inRomList.items.length }}
            <v-spacer></v-spacer>
            <v-text-field v-model="inRomList.search" :append-icon="mdiMagnify" label="Search" single-line hide-details></v-text-field>
          </v-card-title>
          <v-data-table :headers="inRomList.headers" :items="inRomList.items" :search="inRomList.search" mobile-breakpoint="0" item-key="userid" :items-per-page="10" calculate-widths>
            <template v-slot:[`item.username`]="{item}">
              <v-chip color="success">{{ item.username }}</v-chip>
            </template>
            <template v-slot:[`item.actions`]="{item}">
              <v-btn small @click.stop="handleReport(item)">举报</v-btn>
            </template>
          </v-data-table>
        </v-card>
        <v-dialog v-model="reportDialog.show" width="500">
          <v-card>
            <v-card-title class="headline light-green">确认举报</v-card-title>
            <v-card-text>
              <p class="mb-0 mt-5">
                学号：{{ reportDialog.msg.id }}
                <br />
                姓名：{{ reportDialog.msg.name }}
              </p>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey" text @click="cancelReport">取消</v-btn>
              <v-btn color="primary" text @click="confirmReport">确认</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mdiCheckCircle, mdiMagnify } from '@mdi/js'
import store from '@/store/store.js'

export default {
  data: function () {
    return {
      week: '',
      msg: '',
      mdiCheckCircle,
      mdiMagnify,
      inputId: '',
      shareState: store.state,
      allDisabled: true,
      signUpDialog: {
        loading: false,
        show: false,
        success: false,
        msg: {
          id: '',
          name: '',
          currentTime: '',
          allTime: '',
          err: ''
        }
      },
      signOutDialog: {
        loading: false,
        show: false,
        success: false,
        msg: {
          id: '',
          name: '',
          accumulatedTime: 0,
          totalTime: 0,
          err: ''
        }
      },
      reportDialog: {
        show: false,
        msg: {
          id: '',
          name: ''
        }
      },
      inRomList: {
        search: '',
        headers: [
          {
            text: '学号',
            align: 'center',
            sortable: false,
            value: 'userId'
          },
          {
            text: '姓名',
            align: 'center',
            sortable: false,
            value: 'userName',
            class: 'data-table-td-mw100'
          },
          {
            text: '部门',
            align: 'center',
            sortable: true,
            value: 'userDept',
            class: 'data-table-td-mw100'
          },
          {
            text: '地点',
            align: 'center',
            sortable: false,
            value: 'userLocation'
          },
          {
            text: '操作',
            align: 'center',
            sortable: false,
            value: 'actions'
          }
        ],
        items: []
      }
    }
  },
  methods: {
    notice() {
      // if (this.intervalId != null) return
      // this.intervalId = setInterval(() => {
      //   var start = this.msg.substring(0, 1)
      //   var end = this.msg.substring(1)
      //   this.msg = end + start
      // }, 100)
    }
    ,
    checkTimeVaild() {

      let currentTime = new Date()
      let hours = currentTime.getHours()
      let minutes = currentTime.getMinutes()
      let week = currentTime.getDay();

      let weekend = [5, 6];
      // console.log(new Date(currentTime.getDate() + 1000 * 60 * 60 * 24 * 14).getDate());
      if (hours < 6) {
        return false
      } else {
        // console.log(weekend.includes(week));
        return weekend.includes(week) ? true : !(hours >= 23 && minutes >= 30);
      }
      // return true;
    },
    signUp() {
      //check valid
      if (!this.$refs.inputId.validate(true)) return
      //loading shows
      this.signUpDialog.show = true
      this.signUpDialog.loading = true
      //send inputid
      this.$http.post('/api/user/signIn', { userId: this.inputId }).then(res => {
        if (res.data.code === 0) {
          let currentTime = (function getNowTime() {
            let d = new Date();
            let Y = d.getFullYear();
            let M = d.getMonth() + 1;
            let D = d.getDate();
            let h = d.getHours();
            let m = d.getMinutes();
            let t = d.getSeconds();
            return `${Y}-${M < 10 ? '0' + M : M}-${D < 10 ? '0' + D : D} ${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}:${t < 10 ? '0' + t : t}`;
          })();
          this.signUpDialog.success = true
          this.signUpDialog.loading = false
          //set success msg
          this.signUpDialog.msg.id = this.inputId
          this.signUpDialog.msg.name = res.data.data.userName
          this.signUpDialog.msg.currentTime = currentTime;
          this.signUpDialog.msg.allTime = res.data.data.totalTime

          //store set login
          store.setLogin({ id: this.inputId, name: res.data.data.userName })

          //refresh list
          this.getList()
          // set week
          localStorage.setItem('week', res.data.data.week)
          this.week = res.data.data.week
          store.state.student.logined = true;

        } else {
          this.signUpDialog.success = false
          this.signUpDialog.loading = false
          this.signUpDialog.msg.err = res.data.msg
        }
      })
    },
    signOut() {
      if (!this.$refs.inputId.validate(true)) return
      this.signOutDialog.show = true
      this.signOutDialog.loading = true

      this.$http.post('/api/user/signOut', { userId: this.inputId }).then(res => {
        if (res.data.code === 0) {
          this.signOutDialog.loading = false
          this.signOutDialog.success = true
          this.signOutDialog.msg.id = this.inputId
          this.signOutDialog.msg.name = res.data.data.userName
          this.signOutDialog.msg.totalTime = res.data.data.totalTime
          this.signOutDialog.msg.accumulatedTime = res.data.data.accumulatedTime

          //store set logout
          store.setLogOut()

          //refresh list
          this.getList()
        } else if (res.data.code == -202) {
          this.signOutDialog.loading = false
          this.signOutDialog.msg.err = res.data.msg
          store.setLogOut()
        }
        else {
          this.signOutDialog.loading = false
          this.signOutDialog.msg.err = res.data.msg
        }
      })
    },
    handleReport(item) {
      //console.log(item);
      this.reportDialog.msg.id = item.userId
      this.reportDialog.msg.name = item.userName
      this.reportDialog.show = true
    },
    confirmReport() {
      //console.log("submit");
      //console.log("学号：" + this.reportDialog.msg.id);
      this.reportDialog.show = false
      this.$http
        .post('/api/user/complaint', {
          targetUserId: this.reportDialog.msg.id,
          operatorUserId: localStorage.getItem('id')
        })
        .then(res => {
          if (res.data.code === 0) {
            alert('举报成功')
          }
          this.getList()
          //如果自己举报自己。。。
          if (localStorage.getItem('id') === this.reportDialog.msg.id) {
            store.setLogOut()
          }
        })
    },
    cancelReport() {
      this.reportDialog.show = false
    },
    getList() {
      this.$http.get('/api/record/online').then(res => {
        this.inRomList.items = res.data.data
      })
    }
  },
  computed: {
    inputIdDisabled() {
      return this.allDisabled
    },
    signUpDisabled() {
      return this.allDisabled || this.shareState.student.isLogin
    },
    signOutDisabled() {
      return this.allDisabled
    },
    idError() {
      const rules = []

      const allowSpace = false
      const required = true

      if (!allowSpace) {
        const rule = val => (val || '').indexOf(' ') < 0 || '不允许输入空格'
        rules.push(rule)
      }

      if (required) {
        const rule = val => !!val || '不能留空'
        rules.push(rule)
      }
      return rules
    }
  },
  watch: {
    'signUpDialog.loading'(val) {
      if (!val) return
      if (this.signUpDialog.loading) {
        setTimeout(() => (this.signUpDialog.loading = false), 5000)
        this.signUpDialog.success = false
        this.signUpDialog.msg.err = '超时错误'
      }
    },
    'signOutDialog.loading'(val) {
      if (!val) return
      if (this.signOutDialog.loading) {
        setTimeout(() => (this.signOutDialog.loading = false), 5000)
        this.signOutDialog.success = false
        this.signOutDialog.msg.err = '超时错误'
      }
    },
    'inRomList.items'() {
      //check me inRoom
      let meName;
      var inRoom = this.inRomList.items.some(item => {
        meName = item.userName
        return item.userId.toString() === localStorage.getItem('id')
      })
      // console.log(meName)
      if (inRoom) {
        var id = localStorage.getItem('id')
        var name = meName
        store.setLogin({ id, name })
      } else {
        store.setLogOut()
      }
    }
  },
  mounted() {
    this.week = localStorage.getItem('week')
    this.notice()
    if (this.checkTimeVaild()) {
      this.allDisabled = false
      //get id from localStorage
      this.inputId = localStorage.getItem('id')
      //check if login from localStorage
      if (localStorage.getItem('isLogin') === 'true') {
        var id = localStorage.getItem('id')
        var name = localStorage.getItem('name')
        store.setLogin({ id, name })
      }

      //get list
      this.getList()
    } else {
      console.log('All disabled')
    }
  }
}
</script>
<style>
#inform {
  font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;
  color: #0788a9;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

}
</style>
