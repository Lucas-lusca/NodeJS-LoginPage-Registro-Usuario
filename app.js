// ESTE É APENAS UM EXEMPLO PARA ESTUDOS!!!

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();
const port = 3000;

// Array para armazenar os usuários cadastrados
const registeredUsers = [];

// Configuração para lidar com os dados enviados pelo formulário
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configura a sessão de usuario
app.use(session({
  secret: 'sua-chave',
  resave: false,
  saveUninitialized: true
}));

// Configura a aplicação para que ela trabalhe com views e ejs
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

router.get('/', function(req, res){
  res.render('index');
});

router.post('/', function(req, res){
  const bodyData = req.body; // req contem as variaveis do HTML
  const user = registeredUsers.find(user => user.userEmail === bodyData.useremail);
  // Se a variavel email recebida do HTML corresponder com uma variavel no array, o codigo continua.
  if(user){
    if(user.userPassword === bodyData.userpassword){
      req.session.useremail = bodyData.useremail;
      res.redirect('/home');
    } else {
      console.log('Senha incorreta');
      res.redirect('/');
    }
  } else {
    console.log('Usuário não cadastrado');
    res.redirect('/');
  }
});

router.get('/home', function(req, res){
  const userEmail = req.session.useremail;
  res.render('home', { useremail: userEmail });
});

router.get('/register', function(req, res){
  res.render('register');
});

router.post('/register', function(req, res){
  const { useremail, userpassword } = req.body;

  // Verifica se o usuario já esta cadastrado
  if(registeredUsers.find(user => user.userEmail === useremail)){
    console.log('Usuário já cadastrado');
    res.redirect('/register');
  }
  else{
    registeredUsers.push({ userEmail: useremail, userPassword: userpassword }); // Adiciona as variaveis no array
    res.redirect('/');
  }
});

app.use('/', router);

// Inicia o servidor
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});