const express = require('express');
const env = require('./config/environment');
const logger = require("morgan");
const cookieParser = require('cookie-parser');
const app = express();
require('./config/view-helper')(app);
const port = 8000;
const cors = require('cors');
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose')
const session = require('express-session');
const passport= require('passport');
const LocalStrategy = require('./config/passport-local-stratrgy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const path = require("path");
const customMware = require('./config/middleware');
// seeting up chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_socket').chatSockets(chatServer);
chatServer.listen(5000);  
console.log("Chat server is listening on port 5000");
if(env.name=='development')
{
    app.use(sassMiddleware(
        {
            src: path.join(__dirname,env.asset_path,'scss'),
            dest:path.join(__dirname,env.asset_path,'css'),
            debug:true,
            outputStyle:'extended',
            prefix:'/css'
        }
    ))
}


app.use(express.urlencoded());
app.use(cookieParser());
//make the uploads path avalibale to browser.
app.use('/uploads',express.static(__dirname + '/uploads'));
app.use(logger(env.morgan.mode,env.morgan.options))
app.use(express.static(env.asset_path));
//app.use(express.static('./assets'));
app.use(expressLayouts);
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);
app.set('view engine',"ejs");
app.set('views','./views');

app.use(session(
    {
        name : 'major2',
        secret: env.session_cookie_key,
        saveUninitialized:false,
        resave:false,
        cookie:
        {
            maxAge:(1000*60*100)
        },
        store:  MongoStore.create(
            {
                //mongooseConnection:db,
                mongoUrl:'mongodb://0.0.0.0:27017/contact_list_cookie',
                autoRemove :'disabled'
            },
            function(err)
            {
                console.log(err||'connect-mongo-db-setup-ok');
            }
        )

    }
));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);
app.use('/',require('./routes'));

app.listen(port, function(err){

    if (err)
    {
        console.log("Error in running the server",err);
    }

    console.log("Server is running on port",port);
});