const mongoose = require('mongoose');

const ACTION_TYPES = [
  'STATUS_CHANGE',
  'DISPATCH_HEALTH_WORKER',
  'COMMUNITY_ADVISORY_ISSUED',
  'WATER_TESTING_REQUESTED',
  'MEDICAL_CAMP_SCHEDULED',
  'SUPPLIES_DISPATCHED',
  'ALERT_ESCALATED',
  'ALERT_RESOLVED'
];

const actionSchema = new mongoose.Schema(
  {
    clusterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cluster',
      default: null
    },
    actionType: {
      type: String,
      required: [true, 'Action type is required'],
      trim: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Action owner is required']
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

// Indexes for timeline and cluster audit trails
actionSchema.index({ clusterId: 1, timestamp: -1 });
actionSchema.index({ owner: 1, timestamp: -1 });

const Action = mongoose.model('Action', actionSchema);

module.exports = Action;
module.exports.ACTION_TYPES = ACTION_TYPES;
