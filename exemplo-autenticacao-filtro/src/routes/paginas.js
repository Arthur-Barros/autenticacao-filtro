import {
    Router
} from 'express';

import LoginController from '../controller/LoginController';

const router = Router();
const loginCtrl = new LoginController();
/**
 * Rota da página de login
 */
router.get('/', (req, res) =>{

    let userLoged;
    if(!req.session.usuario){
        userLoged = false;
    }else{
        userLoged = true;
    }

    return res.render('login', { userLoged });
}); 


/**
 * Rota para a verificação do login do usuário
 */
router.post('/', (req, res) => {
    /**
     * Pega o e-mail e senha que o usuário 
     * informou no formulário
     */
    const { email, senha } = req.body;
    const resposta = loginCtrl.realizarLogin(email, senha);
    

    /**
     * Se o usuário foi autenticado, adiciona o
     * token JWT na sessão para que ele possa ser
     * usado em toda a requisição para verificar
     * se o usuário está autenticado e se a sessão
     * ainda é válida.
     */
    if (resposta.autenticado) {
        req.session.token = resposta.token;
        req.session.usuario = resposta.usuario;
        res.redirect('/home');
    } else {
        res.render('login', { mensagem: resposta.mensagem });
    }
});


//Rota do cadastro 
router.get('/cadastro', loginCtrl.verificarUsuario, (req, res) => res.render('cadastro'));

// Rota para criar um novo usuário
router.post('/cadastro', (req,res) => {

    const { email, nome, senha } = req.body;
    const resposta2 = loginCtrl.registrarUsuario(email, nome, senha);
  
    res.render('cadastro', { mensagem: resposta2.mensagem });
    
   
});

// rota da logout
router.get('/logout', (req,res) => {
    console.log("entrei aqui");
    req.session = null;
    console.log(req.session);
    res.redirect('/');
    
});


/**
 * Rota para a página Home do sistema, que é protegida por autenticação.
 * Ela só será acessível se o método verificarToken identificar que o
 * token do usuário não expirou, ou seja, se ainda não se passou 1 hora
 * desde que ele realizou o seu login.
 */
router.get('/home', loginCtrl.verificarToken, (req, res) => res.render('home', { usuario: req.session.usuario }));


export default router;