// ESTE É APENAS UM EXEMPLO PARA ESTUDOS!!!

const express = require('express'); // Para usar a as rotas
const session = require('express-session'); // Para criar a sessão do usuário
const bodyParser = require('body-parser'); // Usado para receber as informações do front

const app = express();
const router = express.Router();
const port = 3000;

const registeredUsers = []; // Array para armazenar os usuários cadastrados

// Configuração para lidar com os dados recebidos do formulário
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configura a sessão de usuário
// Basicamente armazena alguns dados no navegador de cada usuário temporariamente
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
  const bodyData = req.body; // req contem as variáveis do HTML

  // Se existir dodyData.useremail email, crie a variável user que é igual a ao userEmail recebido do bodyData
  const user = registeredUsers.find(user => user.userEmail === bodyData.useremail);
  // Se a variável user criada a cima existir
  if(user){
    // Se a variável userPassword recebida do HTML corresponder com uma variável no array, o código continua
    if(user.userPassword === bodyData.userpassword){
      req.session.useremail = bodyData.useremail; // Salva a variável useremail na sessão de usuário
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
  const userEmail = req.session.useremail; // userEmail recebe o valor da variável armazenada na session do usuário
  res.render('home', { useremail: userEmail }); // Passa o valor para o frontEnd
});

router.get('/register', function(req, res){
  res.render('register');
});

router.post('/register', function(req, res){
  const { useremail, userpassword } = req.body; // As variáveis recebem as informações do front

  // Verifica se o usuário já esta cadastrado
  if(registeredUsers.find(user => user.userEmail === useremail)){
    console.log('Usuário já cadastrado');
    res.redirect('/register');
  }
  else{
    registeredUsers.push({ userEmail: useremail, userPassword: userpassword }); // Adiciona as variáveis no array
    res.redirect('/');
  }
});

app.use('/', router);

// Inicia o servidor
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});