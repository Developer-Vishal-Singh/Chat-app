const socket = io();


var username;

var chats = document.querySelector('.chats');
var users_count = document.querySelector('.users-count');
var users_list = document.querySelector('.users-list');
var user_msg = document.querySelector('#user-msg');
var msg_send = document.querySelector('#user-send');

do {
    username = prompt("Enter your name : ");
} while (!username);



// It will be call when user will join
socket.emit('new-user-joined', username);

/*Notifying that user is joined */
socket.on('user-connected', (socket_name) => {
    userJoinLeft(socket_name, 'joined');
    // console.log(socket_name);
})

/*function to create joined/left status div */
function userJoinLeft(name, status) {
    let div = document.createElement('div');
    div.classList.add('user-join');
    let content = `<p><b>${name}</b> ${status} the chat</p>`;
    div.innerHTML = content;
    chats.appendChild(div);
    chats.scrollTop = chats.scrollHeight;
}

/*Notifying that user has left */
socket.on('user-disconnected', (user) => {
    userJoinLeft(user, 'left');
})


/*for updating users list and users count */
socket.on('user-list', (users) => {
    users_list.innerHTML = "";
    users_arr = Object.values(users);
    for (let i = 0; i < users_arr.length; i++) {
        let p = document.createElement('p');
        p.innerText = users_arr[i];
        users_list.appendChild(p);
    }
    users_count.innerHTML = users_arr.length;
})

/*for sending message */

msg_send.addEventListener('click', () => {
    let data = {
        user: username,
        msg: user_msg.value
    };
    if (user_msg != '') {
        appendMessage(data, 'outgoing');
        socket.emit('message', data);
        user_msg.value = '';
    }
});

function appendMessage(data, status) {
    let div = document.createElement('div');
    div.classList.add('message', status);
    let content = `
        <h5>${data.user} : </h5>
        <p>${data.msg}</p>
    `;

    div.innerHTML = content;
    chats.appendChild(div);
    chats.scrollTop = chats.scrollHeight;
}


socket.on('message', (user) => {
    appendMessage(user, 'incomming');
})

