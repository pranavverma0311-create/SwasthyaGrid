/**
 * SwasthyaGrid - Synthetic Demo Seed Data
 * Max: 5 Users, 10 Reports, 2 Clusters, 3 Tasks, 3 Facilities
 * All data is 100% synthetic for demonstration and testing purposes.
 */

const demoUsers = [
  {
    key: 'admin',
    name: 'SwasthyaGrid System Admin',
    email: 'admin@swasthyagrid.demo',
    plainPassword: 'AdminPassword123!',
    role: 'ADMIN',
    area: 'HQ Central',
    phone: '+91 91234 00001'
  },
  {
    key: 'officer_anita',
    name: 'Dr. Anita Sharma',
    email: 'officer.anita@swasthyagrid.demo',
    plainPassword: 'OfficerPassword123!',
    role: 'OFFICER',
    area: 'Ward 7 - South',
    phone: '+91 91234 00002',
    assignedWard: 'Ward 7 - South'
  },
  {
    key: 'officer_rajesh',
    name: 'Dr. Rajesh Rao',
    email: 'officer.rajesh@swasthyagrid.demo',
    plainPassword: 'OfficerPassword123!',
    role: 'OFFICER',
    area: 'Ward 12 - North',
    phone: '+91 91234 00003',
    assignedWard: 'Ward 12 - North'
  },
  {
    key: 'worker_sunita',
    name: 'Sunita Devi (ASHA)',
    email: 'worker.sunita@swasthyagrid.demo',
    plainPassword: 'WorkerPassword123!',
    role: 'HEALTH_WORKER',
    area: 'Ward 7 - South',
    phone: '+91 91234 00004',
    assignedWard: 'Ward 7 - South'
  },
  {
    key: 'citizen_ramesh',
    name: 'Ramesh Kumar',
    email: 'citizen.ramesh@swasthyagrid.demo',
    plainPassword: 'CitizenPassword123!',
    role: 'CITIZEN',
    area: 'Ward 7 - South',
    phone: '+91 91234 00005'
  }
];

const demoFacilities = [
  {
    name: 'Ward 7 Urban Primary Health Centre (UPHC)',
    type: 'PHC',
    location: {
      type: 'Point',
      coordinates: [77.5946, 12.9716],
      address: '24 South Cross Road, Ward 7',
      ward: 'Ward 7 - South'
    },
    contact: {
      phone: '+91 80 2345 6789',
      email: 'uphc.ward7@health.gov.demo',
      inCharge: 'Dr. Anita Sharma'
    },
    availability: {
      status: 'OPERATIONAL',
      isOpen24x7: true,
      bedsTotal: 20,
      bedsAvailable: 14,
      orsStockAvailable: true,
      testingKitsAvailable: true
    }
  },
  {
    name: 'South District Community Hospital',
    type: 'HOSPITAL',
    location: {
      type: 'Point',
      coordinates: [77.5912, 12.9680],
      address: '100 Ring Road, South Sector',
      ward: 'Ward 7 - South'
    },
    contact: {
      phone: '+91 80 2345 6700',
      email: 'south.hospital@health.gov.demo',
      inCharge: 'Dr. V. K. Murthy'
    },
    availability: {
      status: 'OPERATIONAL',
      isOpen24x7: true,
      bedsTotal: 75,
      bedsAvailable: 32,
      orsStockAvailable: true,
      testingKitsAvailable: true
    }
  },
  {
    name: 'North Sector Diagnostic & Epidemiological Lab',
    type: 'LAB',
    location: {
      type: 'Point',
      coordinates: [77.6050, 12.9850],
      address: '88 Tech Boulevard, Ward 12',
      ward: 'Ward 12 - North'
    },
    contact: {
      phone: '+91 80 2345 8890',
      email: 'lab.north@health.gov.demo',
      inCharge: 'Dr. Rajesh Rao'
    },
    availability: {
      status: 'OPERATIONAL',
      isOpen24x7: false,
      bedsTotal: 0,
      bedsAvailable: 0,
      orsStockAvailable: false,
      testingKitsAvailable: true
    }
  }
];

const demoReports = [
  // Cluster 1 (Ward 7 - Acute Gastrointestinal signal)
  {
    key: 'rep1',
    clusterKey: 'cluster1',
    userKey: 'citizen_ramesh',
    location: {
      type: 'Point',
      coordinates: [77.5940, 12.9710],
      address: 'Block A, Lane 2, Ward 7',
      ward: 'Ward 7 - South',
      pincode: '560001'
    },
    symptoms: ['acute diarrhea', 'vomiting', 'mild fever'],
    topics: ['water_quality', 'gastrointestinal'],
    duration: '2 days',
    severity: 'SEVERE',
    affectedPeople: 3,
    description: 'Three members of household began vomiting and severe diarrhea after tap water tasted murky.',
    environmentalFactors: {
      waterSource: 'Municipal Tap Line B',
      drainageIssues: true,
      recentFlooding: false
    },
    status: 'VERIFIED'
  },
  {
    key: 'rep2',
    clusterKey: 'cluster1',
    userKey: 'worker_sunita',
    location: {
      type: 'Point',
      coordinates: [77.5943, 12.9712],
      address: 'Block A, Lane 3, Ward 7',
      ward: 'Ward 7 - South',
      pincode: '560001'
    },
    symptoms: ['severe diarrhea', 'stomach cramps'],
    topics: ['water_quality', 'gastrointestinal'],
    duration: '1 day',
    severity: 'SEVERE',
    affectedPeople: 2,
    description: 'Frontline survey identified 2 individuals with sudden onset watery stool.',
    environmentalFactors: {
      waterSource: 'Municipal Tap Line B',
      drainageIssues: true,
      recentFlooding: false
    },
    status: 'VERIFIED'
  },
  {
    key: 'rep3',
    clusterKey: 'cluster1',
    userKey: null, // Anonymous citizen report
    location: {
      type: 'Point',
      coordinates: [77.5938, 12.9718],
      address: 'Block B Market Street, Ward 7',
      ward: 'Ward 7 - South',
      pincode: '560001'
    },
    symptoms: ['vomiting', 'acute diarrhea', 'dehydration'],
    topics: ['water_quality'],
    duration: '2 days',
    severity: 'SEVERE',
    affectedPeople: 4,
    description: 'Family of four sick with severe stomach infection.',
    environmentalFactors: {
      waterSource: 'Municipal Tap Line B',
      drainageIssues: false,
      recentFlooding: false
    },
    status: 'VERIFIED'
  },
  {
    key: 'rep4',
    clusterKey: 'cluster1',
    userKey: null,
    location: {
      type: 'Point',
      coordinates: [77.5948, 12.9709],
      address: 'Block B Corner, Ward 7',
      ward: 'Ward 7 - South',
      pincode: '560001'
    },
    symptoms: ['acute diarrhea', 'fatigue'],
    topics: ['gastrointestinal'],
    duration: '1-2 days',
    severity: 'MODERATE',
    affectedPeople: 1,
    description: 'Watery diarrhea since yesterday morning.',
    environmentalFactors: {
      waterSource: 'Municipal Tap Line B',
      drainageIssues: false,
      recentFlooding: false
    },
    status: 'UNDER_REVIEW'
  },
  {
    key: 'rep5',
    clusterKey: 'cluster1',
    userKey: null,
    location: {
      type: 'Point',
      coordinates: [77.5950, 12.9715],
      address: 'Main Bazaar Road, Ward 7',
      ward: 'Ward 7 - South',
      pincode: '560001'
    },
    symptoms: ['stomach cramps', 'nausea'],
    topics: ['water_quality'],
    duration: '1 day',
    severity: 'MODERATE',
    affectedPeople: 2,
    description: 'Nausea and stomach pain across 2 tenants.',
    environmentalFactors: {
      waterSource: 'Municipal Tap Line B',
      drainageIssues: true,
      recentFlooding: false
    },
    status: 'ANALYZED'
  },
  {
    key: 'rep6',
    clusterKey: 'cluster1',
    userKey: null,
    location: {
      type: 'Point',
      coordinates: [77.5941, 12.9720],
      address: 'Block A Outer, Ward 7',
      ward: 'Ward 7 - South',
      pincode: '560001'
    },
    symptoms: ['severe diarrhea', 'vomiting', 'fever'],
    topics: ['water_quality', 'gastrointestinal'],
    duration: '2 days',
    severity: 'SEVERE',
    affectedPeople: 3,
    description: 'Elderly family members suffering acute gastroenteritis symptoms.',
    environmentalFactors: {
      waterSource: 'Municipal Tap Line B',
      drainageIssues: true,
      recentFlooding: false
    },
    status: 'ANALYZED'
  },

  // Cluster 2 (Ward 12 - Vector-Borne Febrile Illness signal)
  {
    key: 'rep7',
    clusterKey: 'cluster2',
    userKey: null,
    location: {
      type: 'Point',
      coordinates: [77.6045, 12.9840],
      address: 'Sector 3 Parkside, Ward 12',
      ward: 'Ward 12 - North',
      pincode: '560002'
    },
    symptoms: ['high fever', 'joint pain', 'headache'],
    topics: ['vector_borne', 'febrile'],
    duration: '3 days',
    severity: 'SEVERE',
    affectedPeople: 2,
    description: 'High fever and severe debilitating joint pain after mosquito breeding in park pond.',
    environmentalFactors: {
      waterSource: 'Borewell',
      drainageIssues: true,
      recentFlooding: true
    },
    status: 'ANALYZED'
  },
  {
    key: 'rep8',
    clusterKey: 'cluster2',
    userKey: null,
    location: {
      type: 'Point',
      coordinates: [77.6052, 12.9845],
      address: 'Sector 3 4th Cross, Ward 12',
      ward: 'Ward 12 - North',
      pincode: '560002'
    },
    symptoms: ['fever with chills', 'body ache'],
    topics: ['vector_borne'],
    duration: '2-3 days',
    severity: 'MODERATE',
    affectedPeople: 1,
    description: 'Continuous fever with extreme body ache.',
    environmentalFactors: {
      waterSource: 'Municipal Tap Line A',
      drainageIssues: false,
      recentFlooding: true
    },
    status: 'ANALYZED'
  },
  {
    key: 'rep9',
    clusterKey: 'cluster2',
    userKey: null,
    location: {
      type: 'Point',
      coordinates: [77.6048, 12.9852],
      address: 'Sector 3 Lake View, Ward 12',
      ward: 'Ward 12 - North',
      pincode: '560002'
    },
    symptoms: ['continuous fever', 'rash', 'retro-orbital pain'],
    topics: ['vector_borne'],
    duration: '4 days',
    severity: 'SEVERE',
    affectedPeople: 2,
    description: 'Pain behind eyes, rash and continuous high temperatures.',
    environmentalFactors: {
      waterSource: 'Borewell',
      drainageIssues: true,
      recentFlooding: true
    },
    status: 'ANALYZED'
  },

  // Isolated Report (Monitoring)
  {
    key: 'rep10',
    clusterKey: null,
    userKey: null,
    location: {
      type: 'Point',
      coordinates: [77.6150, 12.9600],
      address: 'East Avenue, Ward 18',
      ward: 'Ward 18 - East',
      pincode: '560003'
    },
    symptoms: ['dry cough', 'mild fever'],
    topics: ['respiratory'],
    duration: '1 day',
    severity: 'MILD',
    affectedPeople: 1,
    description: 'Mild seasonal upper respiratory cough.',
    environmentalFactors: {
      waterSource: 'Municipal Tap Line C',
      drainageIssues: false,
      recentFlooding: false
    },
    status: 'NEW'
  }
];

const demoClusters = [
  {
    key: 'cluster1',
    area: 'Ward 7 - South',
    score: 88,
    priority: 'CRITICAL',
    signals: ['acute_gastro_spike', 'municipal_water_line_clustering', 'high_case_velocity'],
    explanation: {
      summary: 'Rapid surge of 15 individuals with acute gastrointestinal symptoms within 350 meters along Municipal Tap Line B within 48 hours.',
      factors: [
        { factor: 'case_velocity', weight: 40, description: '15 symptomatic persons reported within a 48h observation window' },
        { factor: 'spatial_density', weight: 35, description: 'Dense clustering concentrated in a 350-meter radius' },
        { factor: 'shared_water_source', weight: 25, description: 'Over 80% of affected households share Tap Line B' }
      ]
    },
    status: 'TASK_DISPATCHED',
    centerLocation: {
      type: 'Point',
      coordinates: [77.5942, 12.9714]
    },
    radiusMeters: 400
  },
  {
    key: 'cluster2',
    area: 'Ward 12 - North',
    score: 64,
    priority: 'HIGH',
    signals: ['febrile_illness_cluster', 'stagnant_water_proximity'],
    explanation: {
      summary: 'Clustering of 5 high-fever cases with joint pains concentrated around post-monsoon stagnant water pools.',
      factors: [
        { factor: 'symptom_coincidence', weight: 45, description: 'High fever coupled with debilitating joint ache' },
        { factor: 'environmental_trigger', weight: 30, description: 'Severe local drainage stagnation reported' },
        { factor: 'temporal_cluster', weight: 25, description: 'Multiple households reporting symptoms across 3 days' }
      ]
    },
    status: 'DETECTED',
    centerLocation: {
      type: 'Point',
      coordinates: [77.6048, 12.9845]
    },
    radiusMeters: 300
  }
];

const demoTasks = [
  {
    clusterKey: 'cluster1',
    workerKey: 'worker_sunita',
    assignedByKey: 'officer_anita',
    status: 'IN_PROGRESS',
    priority: 'URGENT',
    notes: 'Distribute ORS packets and chlorine tablets to households in Block A & B. Verify water contamination source at Tap Line B.'
  },
  {
    clusterKey: 'cluster1',
    workerKey: 'worker_sunita',
    assignedByKey: 'officer_anita',
    status: 'VERIFIED',
    priority: 'HIGH',
    notes: 'Inspect main sewer-pipe proximity to feeder pipeline behind market.',
    completedAt: new Date(),
    verificationReport: {
      confirmedCases: 14,
      observations: 'Confirmed cross-contamination leak at joint near open storm drain.',
      suspectedSource: 'Municipal Tap Line B cracked feeder pipe',
      suppliesProvided: ['50 ORS packets', '200 Chlorine water purification tablets'],
      verifiedAt: new Date()
    }
  },
  {
    clusterKey: 'cluster2',
    workerKey: 'worker_sunita',
    assignedByKey: 'officer_rajesh',
    status: 'ASSIGNED',
    priority: 'HIGH',
    notes: 'Conduct larvicidal spray around Parkside pond and inspect stagnant water puddles in Sector 3.'
  }
];

module.exports = {
  demoUsers,
  demoFacilities,
  demoReports,
  demoClusters,
  demoTasks
};
