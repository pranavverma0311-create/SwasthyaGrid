const mongoose = require('mongoose');

const CLUSTER_PRIORITIES = ['LOW', 'WATCH', 'HIGH', 'CRITICAL'];
const CLUSTER_STATUSES = ['DETECTED', 'TASK_DISPATCHED', 'FIELD_VERIFIED', 'RESOLVED', 'FALSE_ALERT'];

const clusterSchema = new mongoose.Schema(
  {
    area: {
      type: String,
      required: [true, 'Cluster area/ward name is required'],
      trim: true
    },
    reportIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Report'
      }
    ],
    score: {
      type: Number,
      required: [true, 'Explainable risk score is required'],
      min: [0, 'Score cannot be less than 0'],
      max: [100, 'Score cannot exceed 100']
    },
    priority: {
      type: String,
      required: [true, 'Priority level is required'],
      enum: {
        values: CLUSTER_PRIORITIES,
        message: '{VALUE} is not a valid cluster priority'
      },
      default: 'WATCH'
    },
    signals: {
      type: [String],
      default: [] // e.g. ["acute_gastro_spike", "shared_water_source", "high_velocity"]
    },
    explanation: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Explainability rationale is required'],
      // Stored as an explainable structure: { summary: string, factors: [...] } or string
      set: function (val) {
        if (typeof val === 'string') {
          return { summary: val, factors: [] };
        }
        return val;
      }
    },
    status: {
      type: String,
      enum: {
        values: CLUSTER_STATUSES,
        message: '{VALUE} is not a supported cluster status'
      },
      default: 'DETECTED'
    },
    centerLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0]
      }
    },
    radiusMeters: {
      type: Number,
      default: 500
    },
    detectedAt: {
      type: Date,
      default: Date.now
    },
    resolvedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Indexes
clusterSchema.index({ priority: 1, score: -1 });
clusterSchema.index({ area: 1, status: 1 });
clusterSchema.index({ 'centerLocation.coordinates': '2dsphere' });

const Cluster = mongoose.model('Cluster', clusterSchema);

module.exports = Cluster;
module.exports.CLUSTER_PRIORITIES = CLUSTER_PRIORITIES;
module.exports.CLUSTER_STATUSES = CLUSTER_STATUSES;
