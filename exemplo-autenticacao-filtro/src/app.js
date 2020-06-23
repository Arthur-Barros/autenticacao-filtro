import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import session from 'express-session';

import rotasPaginas from './routes/paginas';
import config from './config';


const app = express();

/**
 * Configuração das páginas
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/**
 * Configuração dos recursos estáticos
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Configuração do Body Parser
 */
app.use(bodyParser.urlencoded({
    extended: false
}));

/**
 * Configuração de sessão de forma simples
 */
app.use(session({ secret: config.SECRET, resave: false, saveUninitialized: true }));


/**
 * Rotas de view
 */
app.use('/', rotasPaginas);




export default app;