const testTalk = (talk) => {
  const regex = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;  
  if (!talk) {
    return 'O campo "talk" é obrigatório';
  }
  const { watchedAt, rate } = talk;
  if (!watchedAt) {
    return 'O campo "watchedAt" é obrigatório';
  }
  if (!regex.test(watchedAt)) {
    return 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"';
  }
  if (rate === undefined) {
    return 'O campo "rate" é obrigatório';
  }
  if (!Number.isInteger(rate) || rate < 1 || rate > 5) {
    return 'O campo "rate" deve ser um número inteiro entre 1 e 5';
  }
  return true;
};

const validTalk = (req, res, next) => {
  const { talk } = req.body;
  const result = testTalk(talk);
  if (result === true) {
    next();
  } else {
    res.status(400).send({
      message: result,
    });
  }
  };
  
  module.exports = validTalk;