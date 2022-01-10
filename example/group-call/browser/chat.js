// Scope for <sf-m name="the-app">


const scrollToBottom = () => requestAnimationFrame(() => setTimeout(() => {
    var textarea = document.querySelector('.chatbox');
    textarea.scrollTop = textarea.scrollHeight;
}, 300));

sf.model('chat', function(self, root){
    let messages = [];
	self.chatText = 'hahaha';
    self.chatinput = '';

    const renderMessages = () => {
        self.chatText = messages.map(({ name, msg, timestamp }) => [
            name,
            `(${(new Date(timestamp)).toLocaleString()}): `,
            msg
        ].join(' ')).join('\n');
        scrollToBottom();
    };

    self.sendMessage = function(text) {
        console.log('fafe', self.chatinput);
        console.log({ text })
        const name = window.localStorage.getItem('name') || 'nameNOTsetYET';
        const msg = self.chatinput;
        self.chatinput = '';
        socket.emit('chatmessage', {
                name,
                msg
        });
        document.getElementById('chatinput').focus();
    };
    self.setName = function() {
        const name = window.prompt('what do you want to set your name as for the chat?');
        window.localStorage.setItem('name', name);
    };
    
    document.getElementById('chatinput').addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            self.sendMessage(
                document.getElementById('chatinput').value
            );
        }
    });

    socket.emit('getmessages', msgs => {
        console.log('got messages', messages);
        messages = msgs;
        renderMessages();
    });

    socket.on('newmessage', message => {
        messages.push(message);
        renderMessages();
    });
    
});