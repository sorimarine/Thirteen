const socket = io();
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
  });
const chatMessages = document.querySelector('.chat-messages');

socket.emit('joinRoom', { username, room });


socket.on('message', message => {
  outputMessage(message);
});

const chatForm = document.getElementById('chat-form');

chatForm.addEventListener('submit', e => {
  e.preventDefault();

  let msg = e.target.elements.msg.value;

  msg = msg.trim();
  if (!msg) {
    return false
  }

  socket.emit('chatMessage', msg);

  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = `(${message.time})`;
  p.innerHTML += ` <span class="username">${message.username}</span>:`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}