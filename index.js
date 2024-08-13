const express = require("express");
const engine = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')

//APLICAÇÃO
const app = express();

//CONEXÃO COM BANCO
const conn = require('./db/conn')

//MODELS
const Tought = require('./models/Tought')
const User = require('./models/User')

//ROTAS
const toughtsRoutes = require('./routes/toughtsRoutes')
const authRoutes = require('./routes/authRoutes')

//CONTROLLER
const ToughtsController = require("./controllers/ToughtController")

//TEMPLATE ENGINE
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')

//RECEBER RESPOSTA DO BODY
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//SESSION MIDDLEWARES, ONDE VAMOS SALVAR AS SESSIONS
app.use(
  session({
    name: 'session',
    secret: 'nosso_secret',
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {},
      path: require('path').join(require('os').tmpdir(), 'sessions'),
    }),
    cookie: {
      secure: false,
      maxAge: 3600000,
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    },
  }),
)

//FLASH MESSAGES
app.use(flash())

//PUBLIC PATH
app.use(express.static('public'))

//SET SESSIONS TO RES
app.use((req, res, next) => {
    
  if(req.session.userid) {
      res.locals.session = req.session;
  }

  next();
})

//ROTAS
app.use('/toughts', toughtsRoutes)
app.use('/', authRoutes)

app.get('/', ToughtsController.showToughts)


conn
    //.sync({force: true})
    .sync()                
    .then(() => {
        app.listen(3000)
    })
    .catch((err) =>
        console.log(err)
    )