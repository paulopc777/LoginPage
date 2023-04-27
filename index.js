//Require
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
const url = require('url');
const app = express();
//Porta
const porta = 443
//Static Files
app.use(express.static(__dirname + '/public/css/'))
app.use(express.static(__dirname + 'public/html/'))
//Sesão e tempo do cookie
app.use(session({
  secret: '1234567890',
  saveUninitialized: true,
  cookie: {maxAge: 1000},
  resave:false
}))
//bodyParse
app.use(bodyParser.urlencoded({
  extended: true
}))
//Usuario e senha
var login = 'admin'
var senha = '1234'
var logado = 'false'
//Set EJS no projeto
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
app.set('views', path.join(__dirname, './public/html/'))
//Requisição de cliente
app.get('/', (req, res) => {
  if (req.session.login) {
    res.render('logado')
    console.log('Usuario logado: ' + req.session.login)
  } else{
     res.render('home')
  }
})
app.get('/enviodearquivo', (req, res) => {
  //Nomeiler Credenciais
  var transport = nodemailer.createTransport({
host: "",
port: 2525,
auth: {
user: "",
pass: ""
}
});
  //Pegando emial{}
  var email = req.query.Email;
  if(email){
    console.log("Email enviado para: " + email )
  }
  //Var de Mesagem de Email
  var message = {
    from: "sender@server.com",
    to: req.query.Email,
    subject: "Message title",
    text: "Plaintext version of the message",
    html: "<p>HTML version of the message</p>"
  };
  //
  transport.sendMail(message, function(err) {
    if (err) {
      return res.status(400).json({
        Error: true,
        messagem: "erro email nao e valido"
      });
    } else {
      return res.json({
        erro: false
      })
    }
  });
})
//Verificação de login
app.post('/', (req, res) => {
  if (req.body.password == senha && req.body.login == login) {
    req.session.login = login
    res.render('logado')
  }else{
    res.render('home')
  }
})
//Start Server
app.listen(porta, () => {
  console.log('Server rodando')
})
