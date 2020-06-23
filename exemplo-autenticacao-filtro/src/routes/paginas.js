import {
    Router
} from 'express';

import LoginController from '../controller/LoginController';

const router = Router();
const loginCtrl = new LoginController();

/**
 * Rota da página de login
 */
router.get('/', (req, res) => res.render('login'));

// router.get('/cadastro', (req, res) => res.render('cadastro'));
router.get('/cadastro', loginCtrl.verificarToken, (req, res) => res.render('cadastro', { usuario: req.session.usuario }));

router.post('/cadastro', (req,res) => {

    const { email, nome, senha } = req.body;
    const resposta2 = loginCtrl.registrarUsuario(email, nome, senha);
    
   
    res.render('cadastro', { mensagem: resposta2.mensagem });
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



/**
 * Rota para a página Home do sistema, que é protegida por autenticação.
 * Ela só será acessível se o método verificarToken identificar que o
 * token do usuário não expirou, ou seja, se ainda não se passou 1 hora
 * desde que ele realizou o seu login.
 */
router.get('/home', loginCtrl.verificarToken, (req, res) => res.render('home', { usuario: req.session.usuario }));


export default router;