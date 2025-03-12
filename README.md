# qiandao2

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

构建 docker 镜像并推送
```shell
docker buildx build --platform linux/amd64 -t docker.kexie.space/kexie/kexie-attendance:latest --push .
```

### 
```shell
docker build -t kexie-at-web .  
docker run -d -p 8080:80 --name kexie-at-web -e BACKEND_HOST=at.kexie.space -e BACKEND_URL=https://at.kexie.space kexie-attendance-web
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

