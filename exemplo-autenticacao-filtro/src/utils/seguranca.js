import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import decode from 'jwt-decode';

import config from '../config';
import Usuario from '../models/Usuario';

/**
 * Dado um determinado usuário e sua senha,
 * verifica se a senha do usuário é válida
 * @param {*} usuario Dados do usuário
 * @param {*} senha senha do usuário
 */
const senhaEhValida = (usuario, senha) => {
    let hash = crypto.pbkdf2Sync(senha, usuario.salt, 1000, 64, 'sha512').toString('hex');
    return usuario.hash === hash;
}

/**
 * Cria um novo usuário com senha criptografada (hash + salt)
 * @param {*} email E-mail do usuário
 * @param {*} nome Nome do usuário
 * @param {*} senha Senha do usuário
 */
const criarUsuario = (email, nome, senha) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(senha, salt, 1000, 64, 'sha512').toString('hex');

    const usuario = new Usuario(email, nome, salt, hash);
    return usuario;
}

/**
 * Gera um novo token JWT baseado no e-mail do usuário 
 * e a palavra secreta (SECRET) do sistema
 * @param {*} usuario 
 */
const gerarJWT = usuario => jwt.sign(
    {
        usuario: usuario.login
    },
    config.SECRET,
    {
        expiresIn: '1h'
    }
);

/**
 * Verifica se o token do usuário expirou,
 * ou seja, se já se passou 1 hora desde que
 * ele realizou o seu login no sistema.
 * @param {*} token 
 */
const tokenExpirou = token => {
    if (token) {
        const tokenDecodificado = decode(token);
        let dataAtual = new Date();
        dataAtual.setDate(dataAtual.getDate());
        dataAtual = parseInt(dataAtual.getTime() / 1000);
        if (tokenDecodificado.exp < dataAtual) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
};

export default {
    senhaEhValida,
    criarUsuario,
    gerarJWT,
    tokenExpirou
};