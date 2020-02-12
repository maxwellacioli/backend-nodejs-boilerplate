import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  /*
    Pega o elemento authorization do header da requisiçaõ
   */
  const authHeader = req.headers.authorization;

  /*
    Caso este seja undefined, significa que não foi enviado no header
   */
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  /*
    Como o método split cria um array com os elementos separados por ' ',
    é feita a destruturação do mesmo, para pegar o elemento token, observar que
    esta foi feita utilizando [] (por conta do array) e não {} como é feito
    geralmente na destruturação de objetos.
   */
  const [, token] = authHeader.split(' ');

  /*
    Como o método verify utiliza uma sintaxe antiga, ou seja, na qual o segundo
    parametro é uma função de callback, promisify converte a função para
    retornar uma promessa. Por isso tem o await, caso contrário teriamos que
    usar 'then' e 'catch'.
  */
  try {
    /*
      decoded conterá todas as informações do token: header, payload e signature
    */
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;
    req.provider = decoded.provider;

    /*
      Como se trata de um middleware ele deve retornar next para continuar o
      fluxo da requisição
    */

    /*
      Notamos que que verify retornará uma promessa, caso tudo ocorra
      normalemente, retornará next(), caso ocorra algum erro, este
      será capturado no catch e retornará como resposta um erro 401.
    */
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token.' });
  }
};
