<template>
  <div class="body">

    <v-dialog v-model="dialogShow" width="500">

      <v-card color="primary" v-if="submit.loading">
        <v-card-text>
          Please stand by
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>

      <v-card v-else-if="submit.status">
        <v-card-title class="headline light-green">提交成功</v-card-title>
        <v-card-text>
          <p class="mb-0">{{ submit.result }}</p>
          <p class="mb-0"> 后续可通过此申诉编号查询申诉处理状态 </p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialogShow = false">确认</v-btn>
        </v-card-actions>
      </v-card>

      <v-card v-else>
        <v-card-title class="headline red">提交失败</v-card-title>
        <v-card-text>
          <p class="mt-5 mb-0">{{ submit.result }}</p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialogShow = false">确认</v-btn>
        </v-card-actions>
      </v-card>

    </v-dialog>


    <v-card max-width="1280" class="mx-auto">
      <v-container fluid>
        <!-- 页面标题 -->
        <v-card-title class="text-h4 primary--text">
          签到时长申诉申请
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="text primary--text" v-if="appealedSignRecordId">
          本次申诉对应的签到记录编号：{{ appealedSignRecordId }}
        </v-card-text>

        <v-card-text class="red--text" v-else>
            如果你是被恶意举报了，请去签到记录界面找到被举报的对应记录点击申诉，而不是直接在这里申请补加！！！
        </v-card-text>

        <!-- 申诉表单 -->
        <v-form ref="form" @submit.prevent="submitAppeal">
          <v-row class="mt-4">
            <v-col cols="12" md="6">
              <v-text-field
                  v-model="form.appealUser.id"
                  label="学号"
                  :rules="requiredRule"
                  outlined
                  dense
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                  v-model="form.appealUser.name"
                  label="姓名"
                  :rules="requiredRule"
                  outlined
                  dense
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                  v-model="form.appealUser.email"
                  label="邮箱"
                  :rules="emailRules"
                  hint="请输入有效邮箱地址"
                  outlined
                  dense
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                  v-model="form.appealUser.dept"
                  :items="optionList.departments"
                  item-text="dept"
                  label="选择部门"
                  :rules="requiredRule"
                  outlined
                  dense
                  return-object
              ></v-select>
            </v-col>

            <!-- 方向选择 -->
            <v-col cols="12" md="6">
              <v-select
                  v-model="form.appealUser.learn"
                  :items="optionList.learn[form.appealUser.dept]"
                  :disabled="!form.appealUser.dept"
                  label="选择方向"
                  :rules="requiredRule"
                  outlined
                  dense
                  hint="请根据部门选择方向"
                  :loading="isLoading"
              ></v-select>
            </v-col>

            <v-col cols="12">
              <v-select
                  v-model="form.appealUser.location"
                  :items="optionList.classrooms"
                  item-text="location"
                  label="选择你在哪个教室"
                  :rules="requiredRule"
                  outlined
                  dense
                  return-object
              ></v-select>
            </v-col>

            <v-col cols="12">
              <v-text-field
                  v-model="form.requireAddTime"
                  label="需要补加时长,以时（h）为单位"
                  hint="填写一个数字即可。比如要加2.5h便填写2.5即可"
                  :rules="requiredRule"
                  outlined
                  dense
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-textarea
                  v-model="form.reason"
                  label="补加详细原因描述"
                  :rules="requiredRule"
                  outlined
                  rows="3"
                  counter="300"
                  maxlength="300"
                  hint="请详细说明为什么你需要补加此次时长"
              ></v-textarea>
            </v-col>

            <v-col cols="12">
              <!-- 文件上传组件 -->
              <v-file-input
                  v-model="form.appealImageUrls"
                  label="点击上传证明材料（仅支持JPG/PNG图片）"
                  multiple
                  outlined
                  show-size
                  :accept="allowedTypes"
                  :rules="fileRules"
                  @change="handleFileUpload"
              ></v-file-input>

              <!-- 预览区域 -->
              <v-row v-if="previews.length" class="mt-2">
                <v-col
                    v-for="(preview, index) in previews"
                    :key="index"
                    cols="6"
                    sm="4"
                    md="2"
                >
                  <v-card class="preview-card">
                    <v-img
                        :src="preview.url"
                        aspect-ratio="1"
                        class="grey lighten-2"
                    >
                      <template v-slot:placeholder>
                        <v-row class="fill-height" justify="center" align="center">
                          <v-progress-circular indeterminate color="grey lighten-5"/>
                        </v-row>
                      </template>
                    </v-img>

                    <v-btn
                        icon
                        small
                        absolute
                        top
                        right
                        color="red"
                        @click="removeFile(index)"
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>


            <v-col cols="12" class="text-right">
              <v-btn
                  type="submit"
                  color="primary"
                  :loading="submitting"
                  large>
                提交申诉
              </v-btn>
            </v-col>
          </v-row>
        </v-form>

        <!-- 历史申诉记录 -->
<!--        <v-divider class="my-8"></v-divider>-->

<!--        <v-card-title class="text-h6">-->
<!--          <v-icon left>mdi-history</v-icon>-->
<!--          历史申诉记录-->
<!--        </v-card-title>-->

<!--        <v-simple-table class="elevation-2">-->
<!--          <template v-slot:default>-->
<!--            <thead>-->
<!--            <tr>-->
<!--              <th>提交时间</th>-->
<!--              <th>类型</th>-->
<!--              <th>状态</th>-->
<!--              <th>处理结果</th>-->
<!--              <th>操作</th>-->
<!--            </tr>-->
<!--            </thead>-->
<!--            <tbody>-->
<!--            <tr v-for="item in history" :key="item.id">-->
<!--              <td>{{ formatDate(item.createdAt) }}</td>-->
<!--              <td>{{ item.type }}</td>-->
<!--              <td>-->
<!--                <v-chip :color="getStatusColor(item.status)" small>-->
<!--                  {{ item.status }}-->
<!--                </v-chip>-->
<!--              </td>-->
<!--              <td>{{ item.result || '&#45;&#45;' }}</td>-->
<!--              <td>-->
<!--                <v-btn-->
<!--                    icon-->
<!--                    small-->
<!--                    @click="viewDetail(item)"-->
<!--                >-->
<!--                  <v-icon>mdi-eye</v-icon>-->
<!--                </v-btn>-->
<!--              </td>-->
<!--            </tr>-->
<!--            </tbody>-->
<!--          </template>-->
<!--        </v-simple-table>-->
      </v-container>
    </v-card>

    <!-- 查看详情对话框 -->
<!--    <v-dialog v-model="detailDialog" max-width="600">-->
<!--      <v-card>-->
<!--        <v-card-title>申诉详情</v-card-title>-->
<!--        <v-card-text>-->
<!--          <pre>{{ selectedDetail }}</pre>-->
<!--        </v-card-text>-->
<!--      </v-card>-->
<!--    </v-dialog>-->

  </div>
</template>

<script>

export default {

  mounted() {
    this.appealedSignRecordId = this.$route.params.id
    console.log(this.appealedSignRecordId)
  },

  data() {
    return {
      appealedSignRecordId: '',
      dialogShow: false,
      submit: {
        loading: false,
        status: false,
        result: '',
      },
      detailDialog: false,
      selectedDetail: null,
      allowedTypes: "image/png, image/jpeg", // 允许的MIME类型
      optionList: {
        departments: [
          '软件部',
          '硬件部',
          '多媒体部',
        ],
        learn: {
          '软件部': [
              'App开发',
              '深度学习',
              '游戏开发'
          ],
          '硬件部': [
              '嵌入式开发'
          ],
          '多媒体部': [
              '网站开发',
              '小程序开发',
              '视频剪辑',
              'UI设计',
          ]
        },
        classrooms: [
            '5108',
            '5109',
            '5110'
        ]
      },
      form: {
        appealUser: {
          id: '',
          name: '',
          dept: '',
          location: '',
          email: '',
          learn: '',
        },
        signRecordId: '111',
        requireAddTime: '',
        reason: '',
        appealImageUrls: []
      },
      fileRules: [
        files => !files ||
            Array.from(files).every(file =>
                ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)
                || '仅支持JPG和PNG格式图片')
      ],
      requiredRule: [v => !!v || '此项为必填项'],
      emailRules: [
        v => !!v || '邮箱不能为空', // 必填规则
        v => /.+@.+\..+/.test(v) || '邮箱格式不正确' // 正则校验
      ],
      records: [
        {id: 1, title: '2023-06-15 考勤记录'},
        {id: 2, title: '数学期末考试成绩'}
      ],
      history: [
        {
          id: 1,
          createdAt: new Date('2023-05-20'),
          type: '考勤异常申诉',
          status: '已处理',
          result: '申诉通过'
        },
        {
          id: 2,
          createdAt: new Date('2023-06-10'),
          type: '成绩异议申诉',
          status: '处理中'
        }
      ],
      previews: []
    }
  },
  methods: {

    imagesEmpty(previews) {
      return previews.length === 0;
    },

    showDialogHint(message) {
      this.submit.loading = false
      this.submit.result = message
    },

    async uploadImages(images) {
      const formData = new FormData();
      images.forEach(file => formData.append('images', file.file));
      try {
        const response = await this.$http.post('/api/appeal/uploadImage', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        if (response.data.code === 0) {
          console.log('上传成功：', response.data.data)
          return response.data.data
        }
      } catch (e) {
        console.error('上传失败：', e)
        return []
      }
    },

    async submitAppeal() {
      this.dialogShow = true
      this.submit.loading = true
      if (this.$refs.form.validate()) {
        if (!this.imagesEmpty(this.previews)) {
          this.form.appealImageUrls = await this.uploadImages(this.previews)
          if (this.form.appealImageUrls.length === 0) {
            this.submit.status = false
            this.showDialogHint('上传图片失败')
            return
          }
        }
        // 打印 form 对象
        console.log("Form Data:", this.form);
        try {
          // 这里调用提交API
          this.form.signRecordId = this.appealedSignRecordId
          const response = await this.$http.post('/api/appeal/uploadAppeal', this.form)
          if (response.data.code === 0) {
            this.submit.status = true
            this.showDialogHint('本次申诉的编号: ' + response.data.data)
            this.$refs.form.reset()
          } else {
            this.submit.status = false
            this.showDialogHint(response.data.msg)
          }
        } catch (error) {
          console.error(error)
          this.submit.status = false
          this.showDialogHint('提交申诉失败')
        } finally {
          this.submit.loading = false
        }
      } else {
        this.submit.status = false
        this.showDialogHint('参数校验不通过，请检查填写内容是否规范')
      }
    },
    handleFileUpload(files) {
      if (!files) return

      // 过滤无效文件类型
      const validFiles = Array.from(files).filter(file =>
          ['image/png', 'image/jpeg'].includes(file.type)
      )

      // 提示错误信息
      if (validFiles.length !== files.length) {
        this.$store.dispatch('showSnackbar', {
          message: '包含不支持的文件类型，已自动过滤',
          color: 'error'
        })
      }

      // 更新文件列表
      const dataTransfer = new DataTransfer()
      validFiles.forEach(file => dataTransfer.items.add(file))
      this.form.attachments = dataTransfer.files

      // 生成预览
      this.previews = validFiles.map(file => ({
        name: file.name,
        type: file.type.split('/')[0],
        url: URL.createObjectURL(file),
        file: file
      }))
    },

    removeFile(index) {
      URL.revokeObjectURL(this.previews[index].url)
      this.previews.splice(index, 1)

      const dataTransfer = new DataTransfer()
      this.previews.forEach(preview => {
        dataTransfer.items.add(preview.file)
      })
      this.form.attachments = dataTransfer.files
    },

    beforeDestroy() {
      this.previews.forEach(preview => {
        URL.revokeObjectURL(preview.url)
      })
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString('zh-CN')
    },

    getStatusColor(status) {
      const colors = {
        '已处理': 'success',
        '处理中': 'orange',
        '待处理': 'grey',
        '已拒绝': 'error'
      }
      return colors[status] || 'grey'
    },
    viewDetail(item) {
      this.selectedDetail = JSON.stringify(item, null, 2)
      this.detailDialog = true
    },
  }
}
</script>

<style scoped>
.v-card__title {
  padding-bottom: 0.5rem;
}

.v-divider {
  border-color: rgba(0, 0, 0, 0.1);
}

.body {
  margin: 20px 0;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.preview-card {
  position: relative;
  overflow: hidden;
  transition: 0.3s;
}

.preview-card:hover {
  transform: translateY(-5px);
}

</style>