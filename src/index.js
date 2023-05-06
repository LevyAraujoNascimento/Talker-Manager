const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const validLogin = require('./middlewares/userValidation');
const validToken = require('./middlewares/tokenValidation');
const validName = require("./middlewares/nameValidation");
const validAge = require("./middlewares/ageValidation");
const validTalk = require("./middlewares/talkValidation");

const app = express();
app.use(express.json());

const talker = path.resolve(__dirname, './talker.json');

const readFile = async () => {
  try {
    const data = await fs.readFile(talker);
    return JSON.parse(data);
  } catch (error) {
    console.error(`Arquivo não pôde ser lido: ${error}`);
  }
};

const writeFile = async (newTalker) => {
  try {
    await fs.writeFile(talker, JSON.stringify(newTalker));
  } catch (error) {
    console.error(`Arquivo não pôde ser escrito: ${error}`);
  }
};

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar Teste
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker', async (_req, res) => {
  try {
    const talkers = await readFile();
    res.status(200).json(talkers);
  } catch (err) {
    res.status(200).send([]);
  }
});

app.get('/talker/:id', async (req, res) => {
  const talkers = await readFile();
  const talkerID = talkers.find(({ id }) => id === Number(req.params.id));
  if (talkerID) {
    res.status(200).json(talkerID);  
  } else {
    res.status(404).send({
      message: 'Pessoa palestrante não encontrada',
    });
  } 
});

app.post('/login', validLogin, (req, res) => {
  const tokenRdm = crypto.randomBytes(8).toString('hex');
  res.status(200).json({
    token: tokenRdm,
  });
});

app.post('/talker', validToken, validName, validAge, validTalk, async (req, res) => {
  const talkers = await readFile();
  const numTalkers = talkers.length;
  const newTalker = {...req.body, id: numTalkers + 1};
  talkers.push(newTalker);
  await writeFile(talkers);
  res.status(201).json(newTalker);
});
