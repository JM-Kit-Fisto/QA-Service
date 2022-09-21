require('dotenv').config();
const pgp = require('pg-promise')();


const cn = {
  host: process.env.HOST1,
  port: process.env.PORT1,
  database: process.env.DATABASE1,
  user: process.env.USER1,
  password: process.env.PASSWORD1,
  test: process.env.TEST1
};

const db = pgp(cn)

//create an index on answer_id on photos
db.any(
  `CREATE TABLE IF NOT EXISTS questions (
    question_id SERIAL,
    product_id INTEGER NOT NULL,
    question_body VARCHAR(1000) NOT NULL,
    question_date VARCHAR(60) NOT NULL DEFAULT NOW()::VARCHAR(60),
    asker_name VARCHAR(60) NOT NULL,
    asker_email VARCHAR(320) NULL DEFAULT NULL,
    reported BOOLEAN NOT NULL DEFAULT FALSE,
    question_helpfulness INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (question_id)
  )`
  )
  .catch(err => console.log(err))
  .then(() => {
    db.any(
      `
      CREATE TABLE IF NOT EXISTS answers (
        answer_id SERIAL,
        question_id INTEGER NOT NULL REFERENCES questions (question_id),
        body VARCHAR(1000) NOT NULL,
        date VARCHAR(60) NOT NULL DEFAULT NOW()::VARCHAR(60),
        answerer_name VARCHAR(60) NOT NULL,
        answerer_email VARCHAR(320) NULL DEFAULT NULL,
        reported BOOLEAN NOT NULL DEFAULT FALSE,
        helpfulness INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (answer_id)
      )
      `
      )
      .catch(err => console.log(err))
      .then(() => {
        db.any(
          `
          CREATE TABLE IF NOT EXISTS photos (
            id SERIAL,
            answer_id INTEGER NOT NULL REFERENCES answers (answer_id),
            url VARCHAR(1000) NOT NULL,
            PRIMARY KEY (id)
          )
          `
          )
          .then(() => {
            db.any(`CREATE INDEX IF NOT EXISTS product ON questions (product_id);`)
            db.any(`CREATE INDEX IF NOT EXISTS report ON questions (reported);`)
            db.any(`CREATE INDEX IF NOT EXISTS question ON answers (question_id);`)
            db.any(`CREATE INDEX IF NOT EXISTS product ON questions (product_id);`)
            db.any(`CREATE INDEX IF NOT EXISTS answer ON photos (answer_id);`)
          })
      })
  })




  module.exports = db;

