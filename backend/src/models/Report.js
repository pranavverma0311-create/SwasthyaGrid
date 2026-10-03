const mongoose = require('mongoose');

const REPORT_STATUSES = ['NEW', 'ANALYZED', 'UNDER_REVIEW', 'VERIFIED', 'RESOLVED'];
const REPORT_SEVERITY = ['MILD', 'MODERATE', 'SEVERE'];

const reportSchema = new mongoose.Schema(
  {
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null // Nullable for anonymous citizen submissions
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        default: [0, 0]
      },
      address: {
        type: String,
        trim: true
      },
      ward: {
        type: String,
        trim: true
      },
      pincode: {
        type: String,
        trim: true
      }
    },
    symptoms: {
      type: [String],
      required: [true, 'At least one symptom must be reported'],
      validate: {
        validator: function (val) {
          return Array.isArray(val) && val.length > 0;
        },
        message: 'A report must contain at least one symptom'
      }
    },
    topics: {
      type: [String],
      default: [] // e.g. ["water_quality", "sanitation", "gastrointestinal"]
    },
    duration: {
      type: String,
      trim: true,
      default: '1-2 days'
    },
    severity: {
      type: String,
      enum: {
        values: REPORT_SEVERITY,
        message: '{VALUE} is not a valid severity level'
      },
      default: 'MODERATE'
    },
    affectedPeople: {
      type: Number,
      default: 1,
      min: [1, 'Affected people count must be at least 1']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    aiAnalysis: {
      signalsDetected: { type: [String], default: [] },
      riskLevel: { type: String, enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL', 'PENDING'], default: 'PENDING' },
      summary: { type: String, default: '' },
      confidenceScore: { type: Number, min: 0, max: 1, default: 0 },
      analyzedAt: { type: Date }
      // NOTE: This system monitors public health signals. It does NOT claim or deliver clinical medical diagnosis.
    },
    status: {
      type: String,
      enum: {
        values: REPORT_STATUSES,
        message: '{VALUE} is not a supported report status'
      },
      default: 'NEW'
    },
    clusterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cluster',
      default: null
    },
    environmentalFactors: {
      waterSource: { type: String, trim: true },
      drainageIssues: { type: Boolean, default: false },
      recentFlooding: { type: Boolean, default: false }
    }
  },
  {
    timestamps: true
  }
);

// 2dsphere index for spatial queries
reportSchema.index({ 'location.coordinates': '2dsphere' });
reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ 'location.ward': 1, status: 1 });

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
module.exports.REPORT_STATUSES = REPORT_STATUSES;
module.exports.REPORT_SEVERITY = REPORT_SEVERITY;
