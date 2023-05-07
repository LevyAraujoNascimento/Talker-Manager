const validRate = (req, res, next) => {
const { rate } = req.query;
if (rate === undefined) {
    next();
}
if (!Number.isInteger(Number(rate)) || Number(rate) < 1 || Number(rate) > 5) {
    res.status(400).send({
        message: 'O campo "rate" deve ser um número inteiro entre 1 e 5',
        });
} else {
  next();    
}
};
module.exports = validRate;
