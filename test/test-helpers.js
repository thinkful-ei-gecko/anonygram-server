const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

function seedUsers(db, users) {
  const usersWithEncryptedPasswords = users.map((user) => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1),
  }));
  return db.insert(usersWithEncryptedPasswords).into('users');
}

function truncateAllTables(db) {
  return db.raw(
    `TRUNCATE
      comments,
      users,
      submission;`
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
  mockUsers,
  seedUsers,
  truncateAllTables,
  makeAuthHeader,
};
