const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../backend/.env') });

const {
  User,
  Report,
  Cluster,
  Task,
  Action,
  Facility
} = require('../../backend/src/models');

const {
  demoUsers,
  demoFacilities,
  demoReports,
  demoClusters,
  demoTasks
} = require('./demoData');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/swasthyagrid';

const seedDatabase = async () => {
  console.log('🌱 [SwasthyaGrid Seed] Initializing database seeding...');
  console.log(`📡 [MongoDB] Connecting to: ${MONGODB_URI.replace(/\/\/(.*?):(.*?)@/, '//***:***@')}`);

  let conn = null;
  try {
    conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 4000
    });
    console.log('✅ [MongoDB] Connected successfully.');
  } catch (error) {
    console.error(`⚠️  [MongoDB] Could not connect to database: ${error.message}`);
    console.log('ℹ️  Ensure MongoDB is running locally or specify a valid MONGODB_URI in your .env file.');
    console.log('ℹ️  Example: MONGODB_URI=mongodb://localhost:27017/swasthyagrid');
    process.exit(1);
  }

  try {
    console.log('🧹 [Clean] Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Report.deleteMany({}),
      Cluster.deleteMany({}),
      Task.deleteMany({}),
      Action.deleteMany({}),
      Facility.deleteMany({})
    ]);

    // 1. Seed Users (hash passwords securely)
    console.log(`👤 [Users] Seeding ${demoUsers.length} synthetic users...`);
    const userMap = {};
    for (const u of demoUsers) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(u.plainPassword, salt);
      const userDoc = await User.create({
        name: u.name,
        email: u.email,
        passwordHash,
        role: u.role,
        area: u.area,
        phone: u.phone,
        assignedWard: u.assignedWard
      });
      userMap[u.key] = userDoc;
    }

    // 2. Seed Facilities
    console.log(`🏥 [Facilities] Seeding ${demoFacilities.length} synthetic healthcare facilities...`);
    const facilities = await Facility.insertMany(demoFacilities);

    // 3. Seed Clusters
    console.log(`📍 [Clusters] Seeding ${demoClusters.length} health signal outbreak clusters...`);
    const clusterMap = {};
    for (const c of demoClusters) {
      const clusterDoc = await Cluster.create({
        area: c.area,
        score: c.score,
        priority: c.priority,
        signals: c.signals,
        explanation: c.explanation,
        status: c.status,
        centerLocation: c.centerLocation,
        radiusMeters: c.radiusMeters
      });
      clusterMap[c.key] = clusterDoc;
    }

    // 4. Seed Reports and associate with clusters and users
    console.log(`📋 [Reports] Seeding ${demoReports.length} synthetic symptom reports...`);
    const reportMap = {};
    const clusterReportIds = { cluster1: [], cluster2: [] };

    for (const r of demoReports) {
      const clusterDoc = r.clusterKey ? clusterMap[r.clusterKey] : null;
      const reporterUser = r.userKey ? userMap[r.userKey] : null;

      const reportDoc = await Report.create({
        reporterId: reporterUser ? reporterUser._id : null,
        location: r.location,
        symptoms: r.symptoms,
        topics: r.topics,
        duration: r.duration,
        severity: r.severity,
        affectedPeople: r.affectedPeople,
        description: r.description,
        environmentalFactors: r.environmentalFactors,
        status: r.status,
        clusterId: clusterDoc ? clusterDoc._id : null,
        aiAnalysis: {
          signalsDetected: r.topics,
          riskLevel: r.severity === 'SEVERE' ? 'HIGH' : 'MODERATE',
          summary: `Aggregated ${r.symptoms.join(', ')} signal detected. Non-diagnostic public health advisory signal.`,
          confidenceScore: 0.92,
          analyzedAt: new Date()
        }
      });

      reportMap[r.key] = reportDoc;
      if (r.clusterKey && clusterReportIds[r.clusterKey]) {
        clusterReportIds[r.clusterKey].push(reportDoc._id);
      }
    }

    // Update clusters with member report IDs
    for (const key of Object.keys(clusterReportIds)) {
      if (clusterMap[key]) {
        clusterMap[key].reportIds = clusterReportIds[key];
        await clusterMap[key].save();
      }
    }

    // 5. Seed Tasks
    console.log(`📋 [Tasks] Seeding ${demoTasks.length} field worker dispatch tasks...`);
    for (const t of demoTasks) {
      const clusterDoc = clusterMap[t.clusterKey];
      const workerUser = userMap[t.workerKey];
      const officerUser = userMap[t.assignedByKey];

      await Task.create({
        clusterId: clusterDoc ? clusterDoc._id : null,
        workerId: workerUser ? workerUser._id : null,
        assignedBy: officerUser ? officerUser._id : null,
        status: t.status,
        priority: t.priority,
        notes: t.notes,
        completedAt: t.completedAt || null,
        verificationReport: t.verificationReport || {}
      });
    }

    // 6. Seed Operational Action Audit Logs
    console.log('📝 [Actions] Seeding operational intervention audit trail...');
    await Action.create([
      {
        clusterId: clusterMap['cluster1']._id,
        actionType: 'STATUS_CHANGE',
        owner: userMap['officer_anita']._id,
        notes: 'Upgraded Ward 7 cluster status from DETECTED to TASK_DISPATCHED.',
        metadata: { previousStatus: 'DETECTED', newStatus: 'TASK_DISPATCHED' }
      },
      {
        clusterId: clusterMap['cluster1']._id,
        actionType: 'DISPATCH_HEALTH_WORKER',
        owner: userMap['officer_anita']._id,
        notes: 'Dispatched ASHA worker Sunita Devi for door-to-door ORS distribution and water testing.',
        metadata: { workerId: userMap['worker_sunita']._id }
      },
      {
        clusterId: clusterMap['cluster1']._id,
        actionType: 'COMMUNITY_ADVISORY_ISSUED',
        owner: userMap['officer_anita']._id,
        notes: 'Issued localized boil-water advisory for Ward 7 South Sector Tap Line B.',
        metadata: { channel: 'SMS_AND_WHATSAPP_BROADCAST', ward: 'Ward 7 - South' }
      },
      {
        clusterId: clusterMap['cluster2']._id,
        actionType: 'DISPATCH_HEALTH_WORKER',
        owner: userMap['officer_rajesh']._id,
        notes: 'Dispatched vector-control inspection team to Ward 12 North.',
        metadata: { workerId: userMap['worker_sunita']._id }
      }
    ]);

    console.log('\n=============================================');
    console.log('🎉 [SwasthyaGrid Seed] Completed successfully!');
    console.log('=============================================');
    console.log(`👤 Users:      ${demoUsers.length} synthetic accounts seeded`);
    console.log(`🏥 Facilities: ${demoFacilities.length} healthcare centres`);
    console.log(`📋 Reports:    ${demoReports.length} health signal reports`);
    console.log(`📍 Clusters:   ${demoClusters.length} outbreak clusters`);
    console.log(`📝 Tasks:      ${demoTasks.length} field worker tasks`);
    console.log(`🛡️  Actions:    4 operational audit logs`);
    console.log('=============================================\n');

  } catch (err) {
    console.error('❌ [Seed Error]:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 [MongoDB] Disconnected.');
    process.exit(0);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
