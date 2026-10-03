const mongoose = require('mongoose');

const TASK_STATUSES = [
  'ASSIGNED',
  'IN_PROGRESS',
  'VERIFIED',
  'FALSE_ALERT',
  'MONITORING',
  'ACTION_REQUIRED'
];

const TASK_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

const taskSchema = new mongoose.Schema(
  {
    clusterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cluster',
      required: [true, 'Associated cluster ID is required']
    },
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Assigned health worker ID is required']
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    status: {
      type: String,
      enum: {
        values: TASK_STATUSES,
        message: '{VALUE} is not a valid task status'
      },
      default: 'ASSIGNED'
    },
    priority: {
      type: String,
      enum: {
        values: TASK_PRIORITIES,
        message: '{VALUE} is not a valid task priority'
      },
      default: 'MEDIUM'
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    },
    assignedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: {
      type: Date,
      default: null
    },
    verificationReport: {
      confirmedCases: { type: Number, default: 0 },
      observations: { type: String, trim: true, default: '' },
      suspectedSource: { type: String, trim: true, default: '' },
      suppliesProvided: { type: [String], default: [] },
      verifiedAt: { type: Date }
    }
  },
  {
    timestamps: true
  }
);

// Indexes
taskSchema.index({ clusterId: 1, status: 1 });
taskSchema.index({ workerId: 1, status: 1 });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
module.exports.TASK_STATUSES = TASK_STATUSES;
module.exports.TASK_PRIORITIES = TASK_PRIORITIES;
