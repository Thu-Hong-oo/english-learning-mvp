// CommonJS version for Node.js scripts
const User = require('./src/models/User');
const Course = require('./src/models/Course');
const Lesson = require('./src/models/Lesson');
const Exercise = require('./src/models/Exercise');
const UserProgress = require('./src/models/UserProgress');
const Comment = require('./src/models/Comment');
const Vocabulary = require('./src/models/Vocabulary');
const InstructorApplication = require('./src/models/InstructorApplication');
const Post = require('./src/models/Post');

module.exports = {
  User,
  Course,
  Lesson,
  Exercise,
  UserProgress,
  Comment,
  Vocabulary,
  InstructorApplication,
  Post
};
