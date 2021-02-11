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