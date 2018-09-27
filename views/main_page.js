const main_page = n=>{
	return `<html><head><title>chat</title>
	<script src="/js/chat.js"></script>
	</head><body><h2>chat app</h2>
	<h3>write your message</h3>
	<form name="global_chat">
	<input name="send_message" type="text" id="chatmessage" placeholder="your message here">
	<input type="submit" value="send">
	</form>
	<h3>chat box</h3>
	<div id="chatbox"></div>
	<h3>log chat box</h3><div id="logsockbox"></div></body></html>`
	}
module.exports = {main_page}
