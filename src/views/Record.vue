<template>
  <div>
    <v-card max-width="1024" class="mx-auto">
      <v-container fluid>
        <v-card-title>截至今日，宁的所有的签到记录</v-card-title>
        <v-card-subtitle>为了简约，时长低于0.05不展示</v-card-subtitle>
        <v-row align="center" class="term">
          <v-col class="d-flex">
            <v-select v-model="term.value" :items="term.items" item-text="label" item-value="value" label="学期"></v-select>
          </v-col>
        </v-row>
        <v-simple-table fixed-header>
          <template #default>
            <thead>
              <tr>
                <th>学号</th>
                <th>姓名</th>
                <th>部门</th>
                <th>地点</th>
                <th>开始时间</th>
                <th>结束时间</th>
                <th>累计</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in tableData" :key="index">
                <td>{{item.userId}}</td>
                <td>{{item.userName}}</td>
                <td>{{item.userDept}}</td>
                <td>{{item.userLocation}}</td>
                <td>{{item.start}}</td>
                <td>{{item.end}}</td>
                <td>{{item.accumulatedTime}}</td>
                <td>{{item.status}}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import store from "@/store/store.js";
export default {
  data() {
    return {
      tableData: [],
      term: {
        value: "",
        items: []
      }
    };
  },
  mounted() {
    let userId = store.state.userId || localStorage.getItem('id');
    if (userId === "" || userId === null) {
      alert("宁还没有签到");
      this.$router.replace({ path: '/' });
    } else {
      this.$http
        .get(`/api/record/${userId}`)
        .then((res) => {
          if (res.data.code === 0) {
            for (let i = 0; i < res.data.data.length; ++i) {
              let self = res.data.data[i];
              if (self.accumulatedTime <= 0.05) {
                res.data.data.splice(i, 1)
                i--;
              }
            }
            this.tableData = res.data.data;
            console.log(this.tableData)
          } else {
            alert(res.data.msg);
          }
        })
        .catch((err) => {
          alert(err);
        });

      this.$http.get(`/api/record/term/${userId}`).then(({ data }) => {
        if (data.code == 0) {
          let items = data.data.map(v => {
            console.log(v);
            let t = v.split("_");
            let lable = `${t[0]}-${t[1]}${t[2] == 1 ? "上学期" : "下学期"}`
            return { label: lable, value: v };
          })
          this.term.items = items;
          this.term.value = items[0].value;
        } else {
          alert(data.msg);
        }
      }).catch((err) => {
        alert(err);
      });
    }
  }, watch: {

    'term.value'(nv, ov) {
      let userId = store.state.userId || localStorage.getItem('id');
      if (ov == "");
      else {
        console.log({ nv, ov });
        this.$http
          .get(`/api/record/${userId}/${nv}`)
          .then((res) => {
            if (res.data.code === 0) {
              for (let i = 0; i < res.data.data.length; ++i) {
                let self = res.data.data[i];
                if (self.accumulatedTime <= 0.05) {
                  res.data.data.splice(i, 1)
                  i--;
                }
              }
              this.tableData = res.data.data;
              console.log(this.tableData)
            } else {
              alert(res.data.msg);
            }
          })
          .catch((err) => {
            alert(err);
          });

      }
    }
  }
};
</script>

<style scoped>
th,
td {
  white-space: nowrap;
}
.term {
  margin-left: 5px;
  width: 300px;
  height: 87px;
  margin-top: -20px;
}
</style>