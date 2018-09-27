var global_socket = null;
var global_log_box = null;
var socket_debug_devel = true;
var str_update_old_browser = "Could you update your browser?";
var str_sock_already_opened = "Socket is already opened!";
function gid(id){return document.getElementById(id);}
window.onload = global_socket_init;
function global_socket_init(){ 
global_log_box = gid("logsockbox");
run_socket();
}
function run_socket(){
if(!window.WebSocket){toconsole(str_update_old_browser);return;}
if(global_socket){toconsole(str_sock_already_opened);return;}
global_socket = new WebSocket("ws://localhost:5000");
global_socket.onopen = socket_on_open;
global_socket.onmessage = socket_on_message;
global_socket.onerror = socket_on_error;
global_socket.onclose = socket_on_close;
}
function socket_on_open(){
log_sock("<b>Websocket connection is opened!</b><br>");
var name_g_chat="global_chat";
var send_text = document.forms[name_g_chat];
//alert(send_text.name);
send_text.onsubmit = on_submit_chat_message;
}
function on_submit_chat_message(evt){
evt.preventDefault();
try{
//alert("send to server!"+evt.target.send_message.value);
if(evt.target.send_message.value)send_to_sock(evt.target.send_message.value);
//alert("ok");
}catch(e){alert(e);}
}
function socket_on_error(err){
log_sock("<b>Websocket error!: " + err + "</b><br>");	
}
function socket_on_close(){
global_socket = null;
log_sock("<b>Websocket connection closed!</b><br>");	
}
function socket_on_message(evt){
log_sock("<b>msg: </b>" + evt.data + "<br>");	
}
function log_sock(str){
//if(!socket_debug_devel)return;
html_text(global_log_box, str);	
}
function html_text(el, html_str){
if(!el)return;
return el.innerHTML+= html_str;
}
function toconsole(str){
if(socket_debug_devel)return console.log(str);
}
function send_to_sock(str){
if(global_socket){
var t_json_data = {};
t_json_data.data = str
t_json_data.type = "message";
var t_json_str =  to_json(t_json_data);
if(t_json_str)global_socket.send(t_json_str);	
}
}
function to_json(str){
try{
return JSON.stringify(str);	
}catch(e){toconsole(e);return null;}	
}
