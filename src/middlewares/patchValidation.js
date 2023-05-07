const testRate = (rate) => {
  if (rate === undefined) {
    return 'O campo "rate" é obrigatório';
  }
  if (!Number.isInteger(rate) || rate < 1 || rate > 5) {
    return 'O campo "rate" deve ser um número inteiro entre 1 e 5';
  }
  return true;
};

const validPatch = (req, res, next) => {
  const { rate } = req.body;
  const result = testRate(rate);
  if (result !== true) {
    res.status(400).send({
      message: result,
    });
  } else {
    next();
  }
};

module.exports = validPatch;