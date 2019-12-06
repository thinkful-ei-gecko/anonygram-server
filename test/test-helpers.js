const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function setupTestDB(app) {
  let knex = require('knex');
  let db = knex({
    client: 'pg',
    connection: process.env.TEST_DB_URL,
  });
  app.set('db', db);
  return db;
}

function coordinatesGreenwich() {
  return {
    lat: '51.4825766',
    lon: '-0.0076589',
  };
}

function coordinatesQuito() {
  return {
    lat: '-0.180653',
    lon: '-78.467834',
  };
}

function mockUsers() {
  return [
    {
      id: '53d25d5f-a033-40b3-a253-84172a514973',
      username: 'test-user-1',
      password: 'password',
    },
    {
      id: 'cc5fe585-8682-4499-a04e-6255b42116c1',
      username: 'test-user-2',
      password: 'password',
    },
  ];
}

function mockSubmissions() {
  // id SERIAL PRIMARY KEY,
  // image_url TEXT NOT NULL,
  // image_text TEXT,
  // karma_total INTEGER DEFAULT 0,
  // latitude TEXT NOT NULL,
  // longitude TEXT NOT NULL,
  return [
    {
      id: 1,
      image_url: 'https://anonygram-images.s3.amazonaws.com/greenwich',
      image_text: 'image text',
      latitude: coordinatesGreenwich().lat,
      longitude: coordinatesGreenwich().lon,
      // create_timestamp: now() - INTERVAL '1 DAYS';
    },
    {
      id: 2,
      image_url: 'https://anonygram-images.s3.amazonaws.com/quito',
      image_text: 'image text',
      latitude: coordinatesQuito().lat,
      longitude: coordinatesQuito().lon,
      // create_timestamp: now() - INTERVAL '1 DAYS';
    },
  ];
}

function seedUsers(db, users) {
  const usersWithEncryptedPasswords = users.map((user) => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1),
  }));
  return db.insert(usersWithEncryptedPasswords).into('users');
}

function seedSubmissions(db, submissions) {
  return db.insert(submissions).into('submission');
}

function truncateAllTables(db) {
  return db.raw(
    `TRUNCATE
      comments,
      users,
      submission   
      RESTART IDENTITY CASCADE;`
  );
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ id: user.id, username: user.username }, secret, {
    subject: user.username,
    expiresIn: '1h',
    algorithm: 'HS256',
  });
  return `Bearer ${token}`;
}

module.exports = {
  setupTestDB,
  coordinatesGreenwich,
  coordinatesQuito,
  mockUsers,
  mockSubmissions,
  seedUsers,
  seedSubmissions,
  truncateAllTables,
  makeAuthHeader,
};
