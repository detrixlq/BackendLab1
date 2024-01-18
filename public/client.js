const socket = io()
let name;

// to send the message on the chat, when pressing enter 
let textArea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message_area')

do {
    name = prompt('Please enter your name: ')
}while(!name)

// keyup means any key 
textArea.addEventListener('keyup', (e) => {
    if(e.key === 'Enter'){
        sendMessage(e.target.value)
    }
})

function sendMessage(message){
    let msg = {
        user: name,
        message: message.trim()
    }

    // append the message

    appendMessage(msg, 'outgoing')
    textArea.value = ''
    scrollToBottom()

    // send to server via socket connection 
    socket.emit('message', msg)
}

function appendMessage(msg, type){
    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className, 'message')

    let markup = `
        <h4> ${msg.user} </h4>
        <p> ${msg.message} </p>
    `

    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)
}


// Receive the message
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming')
    scrollToBottom()
})

function scrollToBottom(){
    messageArea.scrollTop = messageArea.scrollHeight
}