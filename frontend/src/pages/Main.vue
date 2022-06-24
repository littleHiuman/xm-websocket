<template>
  <div class="page-home">
    <div class="chat-history">
      <ul class="content-container">
        <li v-for="item in history"
            :key="item.len"
            class="content-wrap"
            :class="{ tips: item.from == 'tips', others: item.from == 'server' || (item.from == 'user' && item.name != name), mine: item.from == 'user' && item.name == name }">
          <div class="content-name"
               v-if="item.from != 'tips'">{{ item.name }}</div>
          <div class="content-info">{{ item.message }}</div>
        </li>
      </ul>
    </div>
    <div class="chat-input"
         contentEditable="true"
         @keyup="keyupHandle"
         @keypress="keypressHandle"
         @keydown="keydownHandle"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { debounce } from 'xm-fns'
import { useRouter } from 'vue-router'
const props = defineProps({
  loginName: {
    type: String,
    required: true
  }
})
const name = props.loginName
const router = useRouter()
if (!name.length) {
  sessionStorage.setItem('xm-websocket', JSON.stringify([]))
  router.push('/')
}
const history = ref(JSON.parse(sessionStorage.getItem('xm-websocket')) || [])
var ws
var hasPressShift = ref(false)
var hasPressEnter = ref(false)
function scrollDown () {
  var container = document.querySelector('.chat-history')
  if (container) {
    var sh = container.scrollHeight + 500
    container.scrollTo({
      top: sh,
      left: 0,
      behavior: 'smooth'
    })
  }
}
var scrollDownFn = debounce(scrollDown, 1000)

onMounted(() => {
  scrollDown()
})

function useWS () {
  // 浏览器提供 WebSocket 对象
  var ws = new WebSocket('ws://localhost:4000')
  return ws;
}

if (name.length) {
  ws = useWS()
  // 发送
  ws.onopen = function () {
    sendMsg({ from: 'tips', name, message: `welcome ${name}!` })
    console.log('onopen');
  }
  // 接收
  ws.onmessage = function (mes) {
    var data = JSON.parse(mes.data)
    console.log('onmessage', data);
    pushHistory(data)
  }
  // 结束
  ws.onclose = function close () {
    console.log('disconnected');
  }
  window.onbeforeunload = beforeunloadHandle
}

function beforeunloadHandle () {
  if (name.length && ws) {
    sendMsg({ from: 'tips', name, message: `byebye ${name}!` })
  }
}
function keyupHandle (e) {
  var keyCode = e.keyCode
  if (keyCode == 16) {
    hasPressShift.value = false
  } else if(keyCode == 13) {
    hasPressEnter.value = false
  }
}
function keypressHandle (e) {
  var keyCode = e.keyCode
  if (keyCode == 13) {
    if (!hasPressShift.value) {
      e.preventDefault();
      send(e)
    }
  }
}
function keydownHandle(e){
  var keyCode = e.keyCode
  if (keyCode == 16) {
    hasPressShift.value = true
  } else if (keyCode == 13) {
    hasPressEnter.value = true
  }
}
function send (e) {
  var target = e.target
  sendMsg({ from: 'user', name, message: target.innerText.trim() })
  target.innerText = ''
}
function sendMsg (obj) {
  const { from, name, message } = obj
  var data = {
    from,
    name,
    message,
    time: new Date().getTime(),
    len: history.value.length
  }
  console.log('send', data)
  ws.send(JSON.stringify(data))
  pushHistory(data)
}
function pushHistory (data) {
  var { from, name, message } = data
  var obj = {
    from,
    name,
    message,
    time: data?.time || new Date().getTime(),
    len: data?.len || history.value.length
  }
  history.value.push(obj)
  sessionStorage.setItem('xm-websocket', JSON.stringify(history.value))
  scrollDownFn()
}

</script>

<style scoped>
.page-home {
  min-width: 500px;
  min-height: 700px;
}

.chat-history {
  padding: 5px;
  min-height: 500px;
  border: 1px solid gray;
  overflow: auto;
}

.chat-input {
  height: 200px;
  border: 1px solid gray;
  border-top: none;
  outline: none;
  padding: 5px;
}

.content-container {
  padding: 0;
}

.content-wrap {
  max-width: 35%;
  list-style: none;
  clear: both;
}

.content-wrap.tips {
  text-align: center;
  margin: 0 auto;
}

.content-wrap.mine {
  margin-left: 65%;
}

.content-info {
  min-height: 22px;
  display: inline-block;
  border-radius: 10px;
  padding: 5px;
}

.content-wrap.others .content-info {
  background-color: lightblue;
}

.content-wrap.mine .content-info {
  background-color: lightgreen;
  float: right;
}

.content-name {
  font-size: 12px;
  color: gray;
}

.content-wrap.mine .content-name {
  text-align: right;
}
</style>