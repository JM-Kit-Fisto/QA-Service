//use JQUERY csv extraction to take in a file an output an array of objects
const pgp = require('pg-promise')();
const db = require('../server/db.js');

// Add this command for each table to resync the last value


db.any(
  `
  COPY questions
  FROM '/Users/gusvoelker/Desktop/questions.csv'
  DELIMITER ','
  CSV HEADER
  `
)
.catch(err => console.log(err))
.then(() => {
  db.any(
    `
    COPY answers
    FROM '/Users/gusvoelker/Desktop/answers.csv'
    DELIMITER ','
    CSV HEADER
    `
  )
  .catch(err => console.log(err))
  .then(() => {
    db.any(
      `
      COPY photos
      FROM '/Users/gusvoelker/Desktop/answers_photos.csv'
      DELIMITER ','
      CSV HEADER
      `
    )
    .catch(err => console.log(err));
  })
  .then(() => {
    db.any(
      `
      SELECT SETVAL((SELECT PG_GET_SERIAL_SEQUENCE('"questions"', 'question_id')), (SELECT (MAX("question_id") + 1) FROM "questions"), FALSE)
      `
    );
    db.any(
      `
      SELECT SETVAL((SELECT PG_GET_SERIAL_SEQUENCE('"answers"', 'answer_id')), (SELECT (MAX("answer_id") + 1) FROM "answers"), FALSE)
      `
    )
    .then(() => {
      db.any(
        `
        SELECT SETVAL((SELECT PG_GET_SERIAL_SEQUENCE('"photos"', 'id')), (SELECT (MAX("id") + 1) FROM "photos"), FALSE)
        `
      )
    })
  })
  .catch(err => console.log(err));
});





