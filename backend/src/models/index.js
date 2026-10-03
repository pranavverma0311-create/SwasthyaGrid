/**
 * SwasthyaGrid Database Models Index
 * Clean central export for all Mongoose models
 */

const User = require('./User');
const Report = require('./Report');
const Cluster = require('./Cluster');
const Task = require('./Task');
const Action = require('./Action');
const Facility = require('./Facility');

module.exports = {
  User,
  Report,
  Cluster,
  Task,
  Action,
  Facility
};
