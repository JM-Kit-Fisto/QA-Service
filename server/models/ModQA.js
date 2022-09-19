const db = require('../db.js');

exports.findAllQuestions = (product_id) => {
  return db.any(`
  SELECT question_id, question_body, question_date, asker_name, question_helpfulness, reported
  FROM questions
  WHERE product_id = ${product_id} AND reported = false
  `);
}

exports.findAllAnswers = (question_id) => {
  question_id = Number(question_id);

  return db.any(`
  SELECT A.answer_id, A.body, A.date, A.answerer_name, A.helpfulness,
  jsonb_agg(jsonb_build_object('id', P.id, 'url', P.url)) as photos
  FROM answers A
  Left JOIN photos P ON P.answer_id = A.answer_id
  WHERE question_id = ${question_id} AND A.reported = false
  GROUP BY a.answer_id
  `);
}

exports.findAllPhotos = (answer_id) => {
  return db.any(`SELECT id, url FROM photos WHERE answer_id = ${answer_id}`)
}

exports.insertQuestion = ({body, name, email, product_id}) => {
  product_id = Number(product_id);
  return db.any(`
  INSERT INTO questions
  (question_body, asker_name, asker_email, product_id)
  VALUES('${body}', '${name}', '${email}', ${product_id})
  `);
}

exports.insertAnswer = ({question_id, body, name, email, photos}) => {
  console.log('photos', photos)
  question_id = Number(question_id);
  return db.any(`
  with first_insert as (
    insert into answers(question_id, body, answerer_name, answerer_email)
    values(${question_id}, '${body}', '${name}', '${email}')
    RETURNING answer_id
 )
   insert into photos( answer_id, url)
   SELECT (select answer_id from first_insert) id, x
   FROM  unnest(ARRAY${photos}) x
  `);
}

exports.markQuestionHelpful = (question_id) => {
  question_id = Number(question_id);
  return db.any(`
  UPDATE questions
    SET question_helpfulness = question_helpfulness + 1
  WHERE question_id = ${question_id}
  `);
}

exports.markQuestionReport = (question_id) => {
  question_id = Number(question_id);
  return db.any(`
  UPDATE questions SET reported = NOT reported WHERE question_id = ${question_id}
  `);
}

exports.markAnswerHelpful = (answer_id) => {
  answer_id = Number(answer_id);
  return db.any(`
  UPDATE answers
    SET helpfulness = helpfulness + 1
  WHERE answer_id = ${answer_id}
  `);
}

exports.markAnswerReport = (answer_id) => {
  answer_id = Number(answer_id);
  return db.any(`
  UPDATE answers SET reported = NOT reported WHERE answer_id = ${answer_id}
  `);
}