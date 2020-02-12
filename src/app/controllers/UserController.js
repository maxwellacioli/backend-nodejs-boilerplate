import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    /*
      Cria um shape para verificação se os campos name, email e password estão
      presentes e se o campo email é um email e se password tem no mínimo
      6 caracteres.
    */
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .min(6)
        .required(),
    });

    /*
      Verifica se os campos presentes no body da requisição estão de acordo
      com as regras do schema
    */
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation error.' });
    }

    /*
      Faz uma pesquisa no banco de dados para verificar se existe um usuário
      com o email passado na requisição, caso exista será retornado um email
      dizendo que já existe um usuário com o email presente na requisição
    */
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (!userExists) {
      const { id, name, email, provider } = await User.create(req.body);

      return res.json({ id, name, email, provider });
    }

    return res.status(400).json({ error: 'User already exists.' });
  }

  async update(req, res) {
    /*
      Cria um schema para verificar se as propriedades nome é uma string,
      email é um email, se o oldpassword tem 6 caracteres no mínimo, se o campo
      oldpassword estiver presente, o campo password é obrigatório, e se o campo
      password estiver presente, o campo confirmpassword também é obrigatório,
      e este último deve ser igual ao campo password.
    */
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation error.' });
    }

    /*
      Destruturação dos elementos email e oldpassword do corpo da requisição
     */
    const { email, oldPassword } = req.body;

    /*
      Busca no banco um usuário com o id presente na requisição,
      este id foi inserido no middleware de autenticação através do código:
        const req.userId = decoded.id;
     */
    const user = await User.findByPk(req.userId);

    /*
      Se existe um email na requisição, é verificado se este email é igual ao
      email já cadastrado, caso não seja, é procurado no banco se existe algum
      usuário com o email informado, caso exista, é retornado o status 400
     */
    if (email && email !== user.email) {
      const userExists = await User.findOne({
        where: { email },
      });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    /*
      Se o campo oldpassword é informado, é verificado se este é igual
      ao password presente no banco de dados através do método
      user.checkpassword(password)
    */
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match.' });
    }

    /*
      Faz a atualização do usuário, utilizando a instancia do usuário que foi
      obtida no banco de dados e retorna um json com as seguintes informação:
      id, name, email e provider.
     */
    const { id, name, provider } = await user.update(req.body);

    return res.json({ id, name, email, provider });
  }
}

export default new UserController();
