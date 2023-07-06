'use strict';

const bcryptjs = require('bcryptjs');
const Context = require('./context');

class Database {
  constructor(seedData, enableLogging) {
    this.blogPosts = seedData.blogPosts;
    this.users = seedData.users;
    this.enableLogging = enableLogging;
    this.context = new Context('blogApp.db', enableLogging);
  }

  log(message) {
    if (this.enableLogging) {
      console.info(message);
    }
  }

  tableExists(tableName) {
    this.log(`Checking if the ${tableName} table exists...`);

    return this.context
      .retrieveValue(`
        SELECT EXISTS (
          SELECT 1 
          FROM sqlite_master 
          WHERE type = 'table' AND name = ?
        );
      `, tableName);
  }

  createUser(user) {
    return this.context
      .execute(`
        INSERT INTO Users
          (username, password, createdAt, updatedAt)
        VALUES
          (?, ?, datetime('now'), datetime('now'));
      `,
        user.username,
        user.password);
  }

  createBlogPost(post) {
    return this.context
      .execute(`
        INSERT INTO BlogPosts
          (userId, title, body, createdAt, updatedAt)
        VALUES
          (?, ?, ?, datetime('now'), datetime('now'));
      `,
        post.userId,
        post.title,
        post.body);
  }

  async hashUserPasswords(users) {
    const usersWithHashedPasswords = [];

    for (const user of users) {
      const hashedPassword = await bcryptjs.hash(user.password, 10);
      usersWithHashedPasswords.push({ ...user, password: hashedPassword });
    }

    return usersWithHashedPasswords;
  }

  async createUsers(users) {
    for (const user of users) {
      await this.createUser(user);
    }
  }

  async createBlogPosts(blogPosts) {
    for (const blogPost of blogPosts) {
      await this.createBlogPost(blogPost);
    }
  }

  async init() {
    const userTableExists = await this.tableExists('Users');

    if (userTableExists) {
      this.log('Dropping the Users table...');

      await this.context.execute(`
        DROP TABLE IF EXISTS Users;
      `);
    }

    this.log('Creating the Users table...');

    await this.context.execute(`
      CREATE TABLE Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        username VARCHAR(255) NOT NULL DEFAULT '', 
        password VARCHAR(255) NOT NULL DEFAULT '', 
        createdAt DATETIME NOT NULL, 
        updatedAt DATETIME NOT NULL
      );
    `);

    this.log('Hashing the user passwords...');

    const users = await this.hashUserPasswords(this.users);

    this.log('Creating the user records...');

    await this.createUsers(users);

    const blogTableExists = await this.tableExists('BlogPosts');

    if (blogTableExists) {
      this.log('Dropping the BlogPosts table...');

      await this.context.execute(`
        DROP TABLE IF EXISTS BlogPosts;
      `);
    }

    this.log('Creating the BlogPosts table...');

    await this.context.execute(`
      CREATE TABLE BlogPosts (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        title VARCHAR(255) NOT NULL DEFAULT '', 
        body TEXT NOT NULL DEFAULT '', 
        createdAt DATETIME NOT NULL, 
        updatedAt DATETIME NOT NULL, 
        userId INTEGER NOT NULL DEFAULT -1 
          REFERENCES Users (id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

    this.log('Creating the blog post records...');

    await this.createBlogPosts(this.blogPosts);

    this.log('Database successfully initialized!');
  }
}

module.exports = Database;
