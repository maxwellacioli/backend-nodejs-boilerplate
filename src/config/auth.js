import 'dotenv/config';

/*
  Contém o segredo da assinatura do token ('maxwellgobarber' utlizando o MD5).
  Além disso, contém o prazo de validade do token: 1d = um dia.
*/
export default {
  secret: process.env.APP_SECRET,
  expiresIn: '1d',
};
