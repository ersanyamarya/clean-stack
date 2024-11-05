use('clean-stack');

// drop users collection
db.users.drop();

// add 10 users to the users collection

let users = [];

for (let i = 0; i < 10; i++) {
  users.push({
    email: `abc-${i}@example.com`,
    password: `password_1234`,
    firstName: `First Name ${i}`,
    lastName: `Last Name ${i}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

db.users.insertMany([
  {
    email: 'er.sanyam.arya@gmail.com',
    password: 'password_1234',
    firstName: 'Sanyam',
    lastName: 'Arya',
  },
  ...users,
]);

db.users.find({});
