const test = (name) => {
  if (!name) {
    return 'O campo "name" é obrigatório';
  } else {
    if (name.length < 3) {
      return 'O "name" deve ter pelo menos 3 caracteres';
    }
    return true;
  } 
};

const validName = (req, res, next) => {
  const { name } = req.body;
  const result = test(name);
  if (result === true) {
    next();
  } else {
    res.status(400).send({
      message: result,
    });
  }
};

module.exports = validName;