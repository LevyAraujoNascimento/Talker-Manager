const validPassword = (password) => {
  const limit = 6;
  if (!password) {
    return 'O campo "password" é obrigatório';
  }
  if (password.length < limit) {
    return 'O "password" deve ter pelo menos 6 caracteres';
  }
  return true;
};

const validEmail = (email) => {
  const regex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i;
  if (!email) {
    return 'O campo "email" é obrigatório';
  }
  if (!regex.test(email)) {
    return 'O "email" deve ter o formato "email@email.com"';
  }
  return true;
};

const validLogin = (req, res, next) => {
  const { password, email } = req.body;
  const resultEmail = validEmail(email);
  const resultPassword = validPassword(password);
  let result = false;
  if (resultEmail !== true) result = resultEmail;
  if (resultPassword !== true) result = resultPassword;
  if (resultEmail === true && resultPassword === true) {
    next();
  } else {
    res.status(400).send({
      message: result,
    });
  }
};

module.exports = validLogin;