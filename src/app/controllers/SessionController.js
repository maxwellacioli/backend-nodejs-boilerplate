import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    /*
      Faz a validação dos campos email e password presentes
      no body da requisição
     */
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    /*
      Verifica se o shape acima é valido, caso seja inválido (false)
      será retornado o status 400 (erro na requisição)
     */
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation error.' });
    }

    /*
      Faz a desestruturação dos campos email e password presentes no corpo
      da requisição
     */
    const { email, password } = req.body;

    /*
      Faz a busca no banco de dados por um usuario cujo email é o email
      passado no corpo da requisiçaõ
    */
    const user = await User.findOne({ where: { email } });

    /*
      Caso user seja undefined (não encontrado no banco), será retornado
      status 401(Unauthorized).
    */
    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    /*
      Verifica se o password passado no corpo da mensagem é igual ao password
      armazenado no banco de dados
    */
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match.' });
    }

    /*
      Faz a destruturação do elementos id e name do user retornado
      da query do banco
    */
    const { id, name } = user;

    /*
      cria um token através do método jwt.sign(...), a variavel id será
      armazenada no payloader do token, seguindo do segredo e da data de
      expiração
    */

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

/*
  Retorna o session controller
*/
export default new SessionController();
