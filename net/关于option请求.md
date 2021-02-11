# 关于option请求

**爱总结，爱搬砖，爱生活**

## 引言
前不久用`Vue`和`node`搭建个人博客，用`Axios`做网络请求，在做博主登录验证的时候总是会发送两条相同的请求，其中一条的请求方式为`OPTION`，然后看了几篇博客，基本提到的是跨域、浏览器预校验、简单请求、复杂请求，下面围绕`OPTION`总结一下。

## 心得
`OPTION`请求是浏览器为确定跨域请求资源的安全做的预请求，解决`OPTION`请求有两种方式第一种是使用简单请求，第二种是设置浏览器预校验请求失效时间。

## 案例引入
- 模仿登录请求写了一个简单的案例，下面给出会发送`OPTION`请求的代码（极简单的案例只为突出解决OPTION请求的问题，其他问题不是本篇博客的范畴）
node代码
```js
const express = require('express')
const jwt = require('jsonwebtoken');

const app = express()
const port = 3000

// 解决跨域问题
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "X-Requested-With, accept, origin, content-type, Authorization")
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
  res.header("X-Powered-By", ' 3.2.1')
  next()
})

app.get('/', (req, res) => {
  const token = jwt.sign({ foo: 'bar' }, 'shhhhh')
  res.send(token)
})

app.post('/login', (req, res) => {
  const token = req.headers.authorization
  let result
  jwt.verify(token, 'shhhhh', function(err, decoded) {
    if (err) {
      console.log(err);
      res.send(500)
    } else {
      result = 'success'
      res.send(result)
    }
  });
  
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
```

Vue代码
```html
<template>
  <div id="app">
    <button @click="login">点击</button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'App',
  data(){
    return {
      token: ''
    }
  },
  mounted() {
    axios.get('http://localhost:3000/').then(data => {
      this.token = data.data
    })
  },
  methods: {
    login() {
      axios.request({
        url: 'http://localhost:3000/login',
        method: 'post',
        headers: {
          'Authorization': this.token
        }
      }).then(data => {
        console.log(data);
      })
    }
  }
}
</script>

<style scoped>

</style>
```
- 上面的代码在执行`login`事件函数时每次都会向服务器发送两次同样的请求，其中一次就是本篇博客的主角`OPTION`请求，接下来是针对`OPTION`请求的一番探究。

## 什么时OPTION请求
- 跨域请求资源时浏览器为确认请求来源的安全性，会在正式的请求之前做一次预校验请求，待服务器允许之后才能发送正式的请求，这个预校验请求就是`OPTION`请求；
- 并不是每次跨域资源请求都会发送`OPTION`请求，当跨域请求为简单请求的时就不会发送预校验请求，当跨域请求为复杂请求时才会发送预校验请求；
- 跨域请求就不再做详细的阐述，来看一下什么是简单请求和复杂请求。

### 简单请求和复杂请求
- 先看什么是简单请求，不满足简单请求的就是复杂请求
> - 有些请求不会触发CORS的预检。尽管Fetch规范（定义了 CORS）没有使用该术语，但在本文中将这些称为“简单请求”。“简单请求”是满足以下所有条件的请求：
> 允许的方法之一：
>   + GET
>   + HEAD
>   + POST
> - WSS除了由用户代理自动设置的标头（例如，Connection，User-Agent，或在定义的其它标题抓取规格为“禁止的标题名称”），其允许被手动设置仅标头是那些抓取规范定义为“ CORS安全列出的请求标头”，它们是：
>   + Accept
>   + Accept-Language
>   + Content-Language
>   + Content-Type （但请注意下面的其他要求）
> - Content-Type标头唯一允许的值为：
>   + application/x-www-form-urlencoded
>   + multipart/form-data
>   + text/plain
> - 没有在事件中使用的任何XMLHttpRequest.upload对象上注册事件侦听器；使用XMLHttpRequest.upload属性访问这些。
> - ReadableStream请求中未使用任何对象。

- 上面这段内容摘自CND[跨域资源共享（CORS）](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS),这篇文章值得多读几遍；
- 对比简单请求，可想而知什么是复杂请求；
- 回过头去看一下博客开头的引入案例，在登录请求中将token携带在请求头中，显然这个请求不再是跨域简单请求，因此在正式的登录请求之前会发送`OPTION`请求，获得‘批准’之后才会发送正式的登录请求；

## OPTION请求好吗？
`OPTION`请求是浏览器的一种安全策略，当然好，但是过多的`OPTION`请求会占用浏览器的资源，影响页面的性能，所以要尽可能的减少`OPTION`请求。

## 怎么解决OPTION请求的问题
- 解决`OPTION`请求有两条思路
  1. 不使用复杂请求
  2. 给浏览器的预校验设置失效时间
- `OPTION`请求只有在跨域复杂请求的时候才会有，所以就有了第一种解决思路，不要使用复杂请求，取而代之的是使用简单请求；
- 第二种思路是给浏览器设置预校验失效时间，通过在服务端设置请求头`Access-Control-Max-Age`，下面贴出具体的代码；
node代码
```js
// 解决跨域问题
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "X-Requested-With, accept, origin, content-type, Authorization")
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
  // 下面代码设值了浏览器预校验请求的失效时间为60s
  res.header("Access-Control-Max-Age", 60)
  res.header("X-Powered-By", ' 3.2.1')
  next()
})
```
[关于Access-Control-Max-Age](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Max-Age)

[案例代码]()

**爱总结，爱搬砖，爱生活**