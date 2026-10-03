const mongoose = require('mongoose');

const FACILITY_TYPES = ['HOSPITAL', 'PHC', 'CLINIC', 'LAB', 'OTHER'];
const FACILITY_STATUSES = ['OPERATIONAL', 'LIMITED', 'OVERWHELMED', 'CLOSED'];

const facilitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Facility name is required'],
      trim: true,
      minlength: [2, 'Facility name must be at least 2 characters']
    },
    type: {
      type: String,
      required: [true, 'Facility type is required'],
      enum: {
        values: FACILITY_TYPES,
        message: '{VALUE} is not a valid facility type'
      },
      default: 'PHC'
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
      }
    },
    contact: {
      phone: { type: String, trim: true },
      email: { type: String, trim: true },
      inCharge: { type: String, trim: true }
    },
    availability: {
      status: {
        type: String,
        enum: FACILITY_STATUSES,
        default: 'OPERATIONAL'
      },
      isOpen24x7: {
        type: Boolean,
        default: true
      },
      bedsTotal: {
        type: Number,
        default: 10,
        min: 0
      },
      bedsAvailable: {
        type: Number,
        default: 10,
        min: 0
      },
      orsStockAvailable: {
        type: Boolean,
        default: true
      },
      testingKitsAvailable: {
        type: Boolean,
        default: true
      }
    }
  },
  {
    timestamps: true
  }
);

// Indexes
facilitySchema.index({ 'location.coordinates': '2dsphere' });
facilitySchema.index({ type: 1, 'location.ward': 1 });

const Facility = mongoose.model('Facility', facilitySchema);

module.exports = Facility;
module.exports.FACILITY_TYPES = FACILITY_TYPES;
module.exports.FACILITY_STATUSES = FACILITY_STATUSES;
