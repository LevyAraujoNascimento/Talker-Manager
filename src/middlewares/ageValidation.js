const test = (age) => {
    if (!age) {
      return 'O campo "age" é obrigatório';
    } else {
      if (age < 18 || typeof age !== 'number' || !Number.isInteger(age)) {
        return 'O campo "age" deve ser um número inteiro igual ou maior que 18';
      }
      return true;
    } 
  };
  
  const validAge = (req, res, next) => {
    const { age } = req.body;
    const result = test(age);
    if (result === true) {
      next();
    } else {
      res.status(400).send({
        message: result,
      });
    }
  };
  
  module.exports = validAge;