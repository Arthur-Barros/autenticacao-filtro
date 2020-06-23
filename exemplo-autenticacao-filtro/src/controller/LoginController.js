import seguranca from '../utils/seguranca';

/**
 * Controlador de login (autenticação)
 * @author Sidney Sousa
 */
export default class LoginController {

    constructor() {
        this.usuarios = [];
        const usuarioTeste =
            seguranca.criarUsuario('admin@email.com', 'Administrador', 'senha123');
        this.usuarios.push(usuarioTeste);
    }


    /**
     * Registra um novo usuário caso ele não exista
     * @param {*} login Login (no caso, o e-mail) do usuário
     * @param {*} nome Nome do usuário
     * @param {*} senha Senha do usuário
     */
    registrarUsuario(login, nome, senha) {
        let usuario = this.recuperarUsuario(login);

        /**
         * Se o usuário ainda não existe,
         * então ele pode ser cadastrado.
         */
        if (!usuario) {
            /**
             * Cria o usuário com o hash e salt
             */
            usuario = seguranca.criarUsuario(login, nome, senha);
            this.usuarios.push(usuario);

            return { mensagem: 'Usuário registrado com sucesso' };
        } else {
            /**
             * Se o usuário já existe, retorna
             * uma mensagem avisando.
             */
            return { mensagem: 'Usuário já existente' }
        }
    }


    /**
     * Realiza o login (autenticação) de um usuário
     * @param {*} login Login (no caso, o e-mail) do usuário
     * @param {*} senha Senha do usuário
     */
    realizarLogin(login, senha) {
        const usuario = this.recuperarUsuario(login);

        /**
         * Se o usuário existe e a senha é valida,
         * cria o token JWT o qual vai permitir que
         * o usuário tenha acesso ao sistema por 1 hora.
         */
        if (usuario && seguranca.senhaEhValida(usuario, senha)) {
            const token = seguranca.gerarJWT(usuario);
            return {
                autenticado: true,
                usuario,
                token
            };
        } else {
            /**
             * Se o usuário não existe ou a senha é inválida,
             * o usuário não é autenticado e o sistema retorna
             * uma mensagem avisando o fato.
             */
            return {
                autenticado: false,
                mensagem: 'Não autorizado'
            };
        }
    }

    /**
     * Recupera um usuário pelo login, caso exista algum
     * usuário com o login procurado.
     * @param {*} login Login (no caso, o e-mail) do usuário
     */
    recuperarUsuario(login) {
        return this.usuarios.find(usuario => usuario.login === login);
    }

    /**
     * Verifica se o token JWT ainda é valido (não expirou)
     * @param {*} req Requisição HTTP
     * @param {*} res Resposta HTTP
     * @param {*} next Função que invoca o próximo passo caso o token seja válido
     */
    verificarToken(req, res, next) {
        const token = req.session.token;
        console.log(token);

        /**
         * Se o token já expirou, não permite o acesso à página
         * e redireciona para a página de login.
         */
        if (!seguranca.tokenExpirou(token)) {
            res.redirect('/');
        } else {
            /**
             * Caso contrário, permite o acesso e deixa
             * passar para frente.
             */
            next();
        }
    }

}