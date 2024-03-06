'use strict';  // Modo estricto de JavaScript para un código más seguro y eficiente

// Variables globales para elementos del DOM y objetos necesarios
var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var usernameForm = document.querySelector('#usernameForm');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');

// Cliente Stomp y nombre de usuario
var stompClient = null;
var username = null;

// Colores para los avatares de usuario
var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

// Función para conectar al chat
function connect(event) {
    username = document.querySelector('#name').value.trim();  // Obtener nombre de usuario del formulario

    if(username) {
        // Ocultar la página de ingreso de nombre de usuario y mostrar la página de chat
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');

        // Establecer conexión WebSocket con el servidor
        var socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();  // Prevenir el comportamiento predeterminado del formulario
}

// Función llamada cuando se establece conexión WebSocket con éxito
function onConnected() {
    // Suscribirse al tema público para recibir mensajes del chat
    stompClient.subscribe('/topic/public', onMessageReceived);

    // Enviar nombre de usuario al servidor
    stompClient.send("/app/chat.addUser",
        {},
        JSON.stringify({sender: username, type: 'JOIN'})
    );

    connectingElement.classList.add('hidden');  // Ocultar mensaje de conexión
}

// Función llamada en caso de error de conexión
function onError(error) {
    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';  // Mensaje de error
    connectingElement.style.color = 'red';  // Establecer color de texto en rojo
}

// Función para enviar un mensaje al chat
function sendMessage(event) {
    var messageContent = messageInput.value.trim();  // Obtener contenido del mensaje del formulario

        var chatMessage = {
            sender: username,
            content: messageInput.value,
            type: 'CHAT'
    if(messageContent && stompClient) {
        // Crear objeto de mensaje
        };

        // Enviar mensaje al servidor a través de WebSocket
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        messageInput.value = '';  // Limpiar campo de entrada de mensaje
    }

    event.preventDefault();  // Prevenir el comportamiento predeterminado del formulario
}

// Función llamada al recibir un mensaje del servidor
function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);  // Analizar el mensaje recibido

    var messageElement = document.createElement('li');  // Crear un elemento de lista para el mensaje

    if(message.type === 'JOIN') {
        // Si es un mensaje de unión, agregar clase de mensaje de evento y establecer contenido
        messageElement.classList.add('event-message');
        message.content = message.sender + ' joined!';
    } else if (message.type === 'LEAVE') {
        // Si es un mensaje de salida, agregar clase de mensaje de evento y establecer contenido
        messageElement.classList.add('event-message');
        message.content = message.sender + ' left!';
    } else {
        // Si es un mensaje de chat normal, agregar clase de mensaje de chat y mostrar el avatar del usuario
        messageElement.classList.add('chat-message');

        var avatarElement = document.createElement('i');  // Crear elemento para el avatar
        var avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.sender);  // Establecer color de fondo del avatar

        messageElement.appendChild(avatarElement);  // Agregar avatar al mensaje

        var usernameElement = document.createElement('span');  // Crear elemento para el nombre de usuario
        var usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);  // Agregar nombre de usuario al mensaje
    }

    var textElement = document.createElement('p');  // Crear elemento para el contenido del mensaje
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);  // Agregar contenido del mensaje al elemento de mensaje

    messageArea.appendChild(messageElement);  // Agregar el elemento de mensaje al área de mensajes
    messageArea.scrollTop = messageArea.scrollHeight;  // Desplazar el área de mensajes hacia abajo para mostrar el nuevo mensaje
}

// Función para obtener el color del avatar del usuario
function getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    var index = Math.abs(hash % colors.length);
    return colors[index];
}

// Event Listeners para enviar formulario de conexión y formulario de mensajes
usernameForm.addEventListener('submit', connect, true);
messageForm.addEventListener('submit', sendMessage, true);
