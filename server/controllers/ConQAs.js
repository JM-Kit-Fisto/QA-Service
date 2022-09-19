const Question = require("../models/ModQA.js");


//TODO: fix the retrieval of dates
exports.getQuestions = (req, res) => {
  let page = req.query.page || 1;
  let count = req.query.count || 5;
  let index1 = (page * count) - count;
  let index2 = page -1 + count;
  Question.findAllQuestions(req.query.product_id)
  .then(questions => {
    let responseObj = {
      product_id: req.query.product_id,
      results: questions
    };
    let answers = questions.map(question => {
      return Question.findAllAnswers(question.question_id)
    })
    Promise.all(answers)
    .then(answers => {
      responseObj.results.forEach((question, index) => {
        let answersArr = answers[index];
        questionAnswers = {};
        answersArr.forEach(answer => {
          if (answer.photos[0].id === null) {
            answer.photos = [];
          }
          questionAnswers[answer.answer_id] = {
            id: answer.answer_id,
            body: answer.body,
            date: answer.date,
            answerer_name: answer.answerer_name,
            helpfulness: answer.helpfulness,
            photos: answer.photos,
          };
        });
        question.answers = questionAnswers;
      })
      responseObj.results = questions.slice(index1, index2);
      res.send(responseObj);
    })
  });
}

exports.getAnswers = (req, res) => {
  console.log(req.params.question_id)
  let page = req.query.page || 1;
  let count = req.query.count || 5;
  Question.findAllAnswers(req.params.question_id)
  .then((answers) => {
    let response = {
      question: req.params.question_id,
      page: page,
      count: count
    }
    let index1 = (page * count) - count;
    let index2 = page -1 + count;
    answers.forEach(answer => {
      if (answer.photos[0].id === null) {
        answer.photos = [];
      }
    })
    response.results = answers.slice(index1, index2);
    res.send(response);
  })

}

exports.postQuestions = (req, res) => {

  Question.insertQuestion(req.body)
  .then(result => res.sendStatus(201))
  .catch(err => {
    console.log('this is err', err)
    res.sendStatus(400);
  })
}

exports.postAnswers = (req, res) => {
  let obj = req.body;
  obj.question_id = req.params.question_id;
  Question.insertAnswer(obj)
  .then(() => res.sendStatus(201))
  .catch(err => {
    console.log('this is err', err)
    res.sendStatus(400);
  });
}

exports.toggleQuestionHelpful = (req, res) => {
  Question.markQuestionHelpful(req.params.question_id)
  .then(() => res.sendStatus(201))
  .catch(err => {
    console.log('this is err', err)
    res.sendStatus(400);
  });
}

exports.toggleQuestionReport = (req, res) => {
  Question.markQuestionReport(req.params.question_id)
  .then(() => res.sendStatus(201))
  .catch(err => {
    console.log('this is err', err)
    res.sendStatus(400);
  });
}

exports.toggleAnswerHelpful = (req, res) => {
  Question.markAnswerHelpful(req.params.answer_id)
  .then(() => res.sendStatus(201))
  .catch(err => {
    console.log('this is err', err)
    res.sendStatus(400);
  });
}

exports.toggleAnswerReport = (req, res) => {
  Question.markAnswerReport(req.params.answer_id)
  .then(() => res.sendStatus(201))
  .catch(err => {
    console.log('this is err', err)
    res.sendStatus(400);
  });
}
