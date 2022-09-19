//use JQUERY csv extraction to take in a file an output an array of objects
const pgp = require('pg-promise')();
const db = require('../server/db.js');

// Add this command for each table to resync the last value
// SELECT SETVAL((SELECT PG_GET_SERIAL_SEQUENCE('"Foo"', 'Foo_id')), (SELECT (MAX("Foo_id") + 1) FROM "Foo"), FALSE);

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
  .catch(err => console.log(err));
});




// db.any(
//   `
//   INSERT INTO Questions(product_id, question_body, create_at, asker_name, question_helpfulness, reported, asker_email)
//   VALUES(${Number(data[i]['product_id'])}, '${data[i]['body']}', to_timestamp(${Number(data[i]['date_written']) / 1000}), '${data[i]['asker_name']}', ${Number(data[i]['helpful'])}, ${!data[i]['reported']}, '${data[i]['asker_email']}')
//   `
// )

