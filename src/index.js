const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const validLogin = require('./middlewares/userValidation');
const validToken = require('./middlewares/tokenValidation');
const validName = require('./middlewares/nameValidation');
const validAge = require('./middlewares/ageValidation');
const validTalk = require('./middlewares/talkValidation');
const validPatch = require('./middlewares/patchValidation');
const validRate = require('./middlewares/rateValidation');
const validDate = require('./middlewares/dateValidation');
const connection = require('./connection');

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

const validQ = (q, talkers) => {
  if (!q) {
    return talkers;
  }
  return talkers.filter((element) => element.name.includes(q));
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

app.get('/talker/db', async (req, res) => {
  const [result] = await connection.query('SELECT * FROM TalkerDB.talkers');
  const table = result.map((element) => ({
    id: element.id,
    name: element.name,
    age: element.age,
    talk: {
      watchedAt: element.talk_watched_at,
      rate: element.talk_rate,
    },
  }));
  res.status(200).json(table);
});

app.get('/talker/search', validToken, validRate, validDate, async (req, res) => {
  const { q, rate, date } = req.query;
  const talkers = await readFile();
  let searchResult = [];
  const stat = 200;
  searchResult = validQ(q, talkers);
  if (rate) {
      searchResult = searchResult.filter((element) => element.talk.rate === Number(rate));
  }
  if (date) {
    searchResult = searchResult.filter((element) => element.talk.watchedAt === date);
  }
  res.status(stat).json(searchResult);
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
  const { name, age, talk } = req.body;
  const talkers = await readFile();
  const numTalkers = talkers.length;
  const newTalker = { 
    name,
    age,
    id: numTalkers + 1,
    talk,
  };
  talkers.push(newTalker);
  await writeFile(talkers);
  res.status(201).json(newTalker);
});

app.put('/talker/:id', validToken, validName, validAge, validTalk, async (req, res) => {
  const { id } = req.params;
  const { name, age, talk } = req.body;
  const { watchedAt, rate } = talk;
  const talkers = await readFile();
  const updateTalkers = talkers.find((element) => element.id === parseInt(id, 10));
  if (updateTalkers === undefined) {
    res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  } else {
    updateTalkers.name = name;
    updateTalkers.age = age;
    updateTalkers.talk.watchedAt = watchedAt;
    updateTalkers.talk.rate = rate;
    talkers[parseInt(id, 10) - 1] = updateTalkers;
    await writeFile(talkers);
    res.status(200).json(updateTalkers);
  }
});

app.delete('/talker/:id', validToken, async (req, res) => {
  const { id } = req.params;
  const talkers = await readFile();

  const newTalkers = talkers.filter((element) => element.id !== parseInt(id, 10));
  await writeFile(newTalkers);

  res.status(204).end();
});

app.patch('/talker/rate/:id', validToken, validPatch, async (req, res) => {
  const { id } = req.params;
  const { rate } = req.body;
  const talkers = await readFile();

  const updateTalkers = talkers.find((element) => element.id === parseInt(id, 10));
  if (updateTalkers === undefined) {
    res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  } else {
    updateTalkers.talk.rate = rate;
    talkers[parseInt(id, 10) - 1] = updateTalkers;
    await writeFile(talkers);
  }
  res.status(204).end();
});
