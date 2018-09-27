const Koa = require("koa")
const session = require("koa-generic-session")
const render = require("koa-rend")
const passport = require("koa-passport")
const koaBody = require("koa-body")
const serve = require("koa-static")
const Pool = require("pg-pool")
const Router = require("koa-router")
const WebSocket = require("ws")

const configDB = require("./database.js")
const PgStore = require("./pg-sess.js")
const database_url = configDB.pg_url;
var with_ssl = "";
if(!process.env.DEVELOPMENT){with_ssl = "?ssl=true";}
console.log("with_ssl ", with_ssl)


const port = 5000

const pub = new Router()

const app = new Koa()
app.keys = ["your-secret"]

app.use(serve(__dirname+'/public'))
//app.use(session({store: pg_store})
render(app, {root: "views", development: true})
app.use(koaBody())
/*
require("./auth2.js")(pool, passport)
app.use(passport.initialize())
app.use(passport.session())
*/ 
function is_xhr(){
return async function is_xhr(ctx, next){
	ctx.state.xhr = (ctx.request.get("X-Requested-With") === "XMLHttpRequest")
	await next()	
}
}
app.use(is_xhr())
pub.get("/", async ctx=>{
ctx.body = await ctx.render("main_page", {})	
})
app.use(pub.routes()).use(pub.allowedMethods())
const koa_server = app.listen(process.env.PORT || port)
const wss = new WebSocket.Server({server: koa_server})

wss.on('connection', wss_connected);

function wss_connected(ws, ui){
console.log('a new websocket connection	! URL: ', ui.url)
ws.send("Hali halo from websocket server!")
ws.url = ui.url;
ws.on('message', ws_on_message)
ws.on('close', ws_on_close)
ws.on('error', ws_on_error)
}

function to_json(obj){try{return JSON.stringify(obj)}catch(e){console.log("err stringify: ", e);return obj;}}
wss.on("bubu",function(ba, data_obj){
console.log("on bubu, data_obj:", data_obj, "url: ", ba.url)
let data = {}
data.type = "on_bubu"
data.data = data_obj
data.url = ba.url
var jstr = to_json(data)
ba.send(jstr)
}
)

function ws_on_message(msg){
console.log("URL 2: ", this.url);
console.log("a message from client: ", msg)
wss.emit("bubu", this, "dubu")
this.send(msg)
}
function ws_on_close(){
console.log('a websocket connection closed!')
console.log("ws.url_1: ", this.url)
delete this.url
console.log("ws.url: ",this.url)
}
function ws_on_error(er){
console.log('websocket error: ',err)
}
console.log("on port ", port)
