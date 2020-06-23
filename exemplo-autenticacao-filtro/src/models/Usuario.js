/**
 * Modelo de dados do usuário
 * @author Sidney Sousa
 */
export default class Usuario {

    /**
     * Construtor da classe
     * @param {*} login Login do usuário
     * @param {*} nome Nome do usuário
     * @param {*} salt String hexadecimal utilizada para "embaralhar" a senha do usuário
     * @param {*} hash Código criptografado gerado com base na senha do usuário
     */
    constructor(login, nome, salt, hash) {
        this.login = login;
        this.nome = nome;
        this.salt = salt;
        this.hash = hash;
    }
}