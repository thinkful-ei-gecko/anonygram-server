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
  const now = new Date();
  const twoDaysAgo = new Date(new Date().setDate(now.getDate() - 2));
  const fiveDaysAgo = new Date(new Date().setDate(now.getDate() - 5));
  return [
    {
      id: 1,
      image_url: 'https://anonygram-images.s3.amazonaws.com/greenwich',
      image_text: 'greenwich',
      karma_total: 20,
      latitude: coordinatesGreenwich().lat,
      longitude: coordinatesGreenwich().lon,
      create_timestamp: fiveDaysAgo,
    },
    {
      id: 2,
      image_url: 'https://anonygram-images.s3.amazonaws.com/quito1',
      image_text: 'quito1',
      karma_total: 5,
      latitude: coordinatesQuito().lat,
      longitude: coordinatesQuito().lon,
      create_timestamp: twoDaysAgo,
    },
    {
      id: 3,
      image_url: 'https://anonygram-images.s3.amazonaws.com/quito2',
      image_text: 'quito2',
      karma_total: 99,
      latitude: coordinatesQuito().lat,
      longitude: coordinatesQuito().lon,
      create_timestamp: now,
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
