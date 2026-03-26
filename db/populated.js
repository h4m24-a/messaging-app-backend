#! /usr/bin/env node
require('dotenv').config()

const { Client } = require("pg"); //  used to interact with the PostgreSQL database.


// SQL is a string containing SQL command
const SQL = `

    CREATE TABLE IF NOT EXISTS messages (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    text TEXT,
    conversation_id INTEGER,
    sender_id INTEGER,
    seen BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_conversation
    FOREIGN KEY (conversation_id)
    REFERENCES conversation(id)
    ON DELETE CASCADE,

    CONSTRAINT fk_sender
    FOREIGN KEY (sender_id)
    REFERENCES users(id)
    ON DELETE CASCADE
  );
`



async function main() {         // async function
  console.log('seeding...');    // logs seeding to console to indicate start of seeding process
  const client = new Client({   // A new instance of Client is created.
    connectionString: process.env.DATABASE_URL  // connectionString specifies the database connection details
  });
  await client.connect();   //  establishes a connection to the PostgreSQL database using the client.
  await client.query(SQL);  //  Executes the SQL commands defined in the SQL string.
  await client.end();       // This closes the connection to the database.
  console.log("done");      // logs done to console to indicate end of seeding process.
}

main();



/*
- User Table
id,
username,
password,
profile image,
bio
created_at


- Conversation Table- user1 and user2 just represents the two users, they still have unique ids.
id
user1 id  (user.id as FK)
user2 id  (user.id as FK)
created_at

- Messages Table
id
conversation_id (conversation.id as FK)
text
seen
sender_id  (user.id as FK)
created_at


CREATE TABLE IF NOT EXISTS users (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  profile_image TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP


  CREATE TABLE IF NOT EXISTS conversation (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      user1_id INTEGER 
      user2_id INTEGER 
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

      CONSTRAINT fk_user1
      FOREIGN KEY (user1_id)
      REFERENCES users(id)
      ON DELETE CASCADE

      CONSTRAINT fk_user2
      FOREIGN KEY (user2_id)
      REFERENCES users(id)
      ON DELETE CASCADE,

      CONSTRAINT unique_user_pair   --- Means both user id's in a conversation must be unique, not allowing two where the values are the same
      UNIQUE (user1_id, user2_id)
    );


 CREATE TABLE IF NOT EXISTS messages (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    text TEXT,
    conversation_id INTEGER,
    sender_id INTEGER,
    seen BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_conversation
    FOREIGN KEY (conversation_id)
    REFERENCES conversation(id)
    ON DELETE CASCADE,

    CONSTRAINT fk_sender
    FOREIGN KEY (sender_id)
    REFERENCES users(id)
    ON DELETE CASCADE

*/