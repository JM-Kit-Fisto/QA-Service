require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { queryParser } = require('express-query-parser')
// const path = require("path");
const controller = require('./controllers/ConQAs.js');

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  queryParser({
    parseNull: true,
    parseUndefined: true,
    parseBoolean: true,
    parseNumber: true,
  })
);

//Routes
app.get('/qa/questions', controller.getQuestions);

app.get('/qa/questions/:question_id/answers', controller.getAnswers);

app.post('/qa/questions', controller.postQuestions);

app.post('/qa/questions/:question_id/answers', controller.postAnswers);

app.put('/qa/questions/:question_id/helpful', controller.toggleQuestionHelpful);

app.put('/qa/questions/:question_id/report', controller.toggleQuestionReport);

app.put('/qa/answers/:answer_id/helpful', controller.toggleAnswerHelpful);

app.put('/qa/answers/:answer_id/report', controller.toggleAnswerReport);



const PORT = process.env.SERVER_PORT1 || 3000;
app.listen(PORT);
console.log(`Server listening at http://localhost:${PORT}`);

//SELECT * FROM questions WHERE question_id = 2;
