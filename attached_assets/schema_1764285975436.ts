import { pgTable, text, serial, timestamp, real, boolean, varchar, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contactInquiries = pgTable("contact_inquiries", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  preferredPlan: text("preferred_plan").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactInquirySchema = createInsertSchema(contactInquiries).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContactInquiry = z.infer<typeof insertContactInquirySchema>;
export type ContactInquiry = typeof contactInquiries.$inferSelect;

// Raw Data PT Stress Study participants table
export const ptStressParticipants = pgTable("pt_stress_participants", {
  id: serial("id").primaryKey(),
  
  // Demographics
  age: real("age"),
  gender: varchar("gender", { length: 50 }),
  nationality: varchar("nationality", { length: 100 }),
  maritalStatus: varchar("marital_status", { length: 100 }),
  major: varchar("major", { length: 200 }),
  yearOfStudy: varchar("year_of_study", { length: 50 }),
  medicalConditions: text("medical_conditions"),
  familySupport: varchar("family_support", { length: 100 }),
  friendsSupport: varchar("friends_support", { length: 100 }),
  facultySupport: varchar("faculty_support", { length: 100 }),
  stressSources: text("stress_sources"),
  
  // DASS-21 Scale Items (Depression, Anxiety, Stress)
  dass1WindDown: real("dass1_wind_down"),
  dass2DrynessOfMouth: real("dass2_dryness_of_mouth"),
  dass3NoPositiveFeeling: real("dass3_no_positive_feeling"),
  dass4BreathingDifficulty: real("dass4_breathing_difficulty"),
  dass5NoInitiative: real("dass5_no_initiative"),
  dass6OverReact: real("dass6_over_react"),
  dass7Trembling: real("dass7_trembling"),
  dass8NervousEnergy: real("dass8_nervous_energy"),
  dass9WorriedPanic: real("dass9_worried_panic"),
  dass10NothingToLookForward: real("dass10_nothing_to_look_forward"),
  dass11Agitated: real("dass11_agitated"),
  dass12DifficultToRelax: real("dass12_difficult_to_relax"),
  dass13DownHeartedBlue: real("dass13_down_hearted_blue"),
  dass14Intolerant: real("dass14_intolerant"),
  dass15CloseToPanic: real("dass15_close_to_panic"),
  dass16NoEnthusiasm: real("dass16_no_enthusiasm"),
  dass17NotWorthMuch: real("dass17_not_worth_much"),
  dass18Touchy: real("dass18_touchy"),
  dass19AwareOfHeart: real("dass19_aware_of_heart"),
  dass20ScaredNoReason: real("dass20_scared_no_reason"),
  dass21LifeMeaningless: real("dass21_life_meaningless"),
  
  // DASS-21 Calculated Scores
  anxietyScore: real("anxiety_score"),
  stressScore: real("stress_score"),
  
  // PSS (Perceived Stress Scale) Items
  pss1UpsetUnexpected: real("pss1_upset_unexpected"),
  pss2UnableToControl: real("pss2_unable_to_control"),
  pss3NervousStressed: real("pss3_nervous_stressed"),
  pss4ConfidentHandle: real("pss4_confident_handle"),
  pss5ThingsGoingWay: real("pss5_things_going_way"),
  pss6CouldNotCope: real("pss6_could_not_cope"),
  pss7ControlIrritations: real("pss7_control_irritations"),
  pss8OnTopOfThings: real("pss8_on_top_of_things"),
  pss9AngeredOutsideControl: real("pss9_angered_outside_control"),
  pss10DifficultiesPilingUp: real("pss10_difficulties_piling_up"),
  
  // Primary Outcome Variable
  depressionCategory: varchar("depression_category", { length: 50 }), // normal, mild, moderate, severe, extsever
  
  // Calculated composite scores
  totalStressScore: real("total_stress_score"),
  depressionRiskScore: real("depression_risk_score"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPtStressParticipantSchema = createInsertSchema(ptStressParticipants).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type PtStressParticipant = typeof ptStressParticipants.$inferSelect;
export type InsertPtStressParticipant = z.infer<typeof insertPtStressParticipantSchema>;

// AUK Faculty Course Data Table
export const aukData = pgTable("auk_data", {
  id: serial("id").primaryKey(),
  
  // Term Information
  academicPeriod: varchar("academic_period", { length: 50 }).notNull(), // e.g., "Fall 2019"
  termCode: varchar("term_code", { length: 20 }).notNull(), // e.g., "201908"
  
  // Faculty Information
  facultyId: varchar("faculty_id", { length: 50 }).notNull(),
  facultyName: text("faculty_name").notNull(),
  academicQualifications: varchar("academic_qualifications", { length: 100 }),
  employmentType: varchar("employment_type", { length: 10 }), // F=Full-time, P=Part-time
  
  // Course Information
  crn: varchar("crn", { length: 20 }).notNull(), // Course Registration Number
  subject: varchar("subject", { length: 50 }).notNull(), // e.g., "ARAB 313"
  credit: real("credit"),
  courseTitle: text("course_title"),
  section: varchar("section", { length: 10 }),
  
  // Schedule Information
  sunday: varchar("sunday", { length: 10 }),
  monday: varchar("monday", { length: 10 }),
  tuesday: varchar("tuesday", { length: 10 }),
  wednesday: varchar("wednesday", { length: 10 }),
  thursday: varchar("thursday", { length: 10 }),
  friday: varchar("friday", { length: 10 }),
  saturday: varchar("saturday", { length: 10 }),
  hrsWeek: real("hrs_week"),
  beginTime: varchar("begin_time", { length: 10 }),
  endTime: varchar("end_time", { length: 10 }),
  location: varchar("location", { length: 50 }),
  
  // Enrollment Information
  remainingSeats: integer("remaining_seats"),
  maxCap: integer("max_cap"),
  actualReg: integer("actual_reg"),
  
  // Organizational Information
  dept: text("dept"),
  college: varchar("college", { length: 10 }),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAukDataSchema = createInsertSchema(aukData).omit({
  id: true,
  createdAt: true,
});

export type AukData = typeof aukData.$inferSelect;
export type InsertAukData = z.infer<typeof insertAukDataSchema>;

// HLA Allele Frequencies Table
export const hlaFrequencies = pgTable("hla_frequencies", {
  id: serial("id").primaryKey(),
  locus: varchar("locus", { length: 10 }).notNull(), // A, B, C, DRB1, etc.
  allele: varchar("allele", { length: 20 }).notNull(), // allele code
  frequency: real("frequency").notNull(), // frequency value 0-1
  ethnicity: varchar("ethnicity", { length: 50 }).notNull().default("ALL"), // Kuwaiti, Arab, Asian, etc.
  populationGroup: varchar("population_group", { length: 50 }).default("Kuwait"), // population source
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Patient CPRA Calculations Table
export const cpraCalculations = pgTable("cpra_calculations", {
  id: serial("id").primaryKey(),
  patientId: varchar("patient_id", { length: 100 }), // optional patient identifier
  methodology: varchar("methodology", { length: 10 }).notNull(), // M1, M2, M3
  ethnicity: varchar("ethnicity", { length: 50 }), // patient ethnicity
  unacceptableAntigens: jsonb("unacceptable_antigens").notNull(), // JSON array of antigens
  ethnicWeights: jsonb("ethnic_weights"), // for M2 methodology
  
  // Results
  cpraScore: real("cpra_score").notNull(), // final CPRA percentage
  cpraProportion: real("cpra_proportion"), // for M2 - proportion value
  riskLevel: varchar("risk_level", { length: 20 }), // Low, Moderate, High, Very High
  compatibleDonors: integer("compatible_donors"), // out of 1000
  
  // M2 specific results
  locusProbabilities: jsonb("locus_probabilities"), // per-locus risk probabilities
  perEthnicityResults: jsonb("per_ethnicity_results"), // ethnicity-specific results
  
  // M3 specific results
  confidenceInterval: jsonb("confidence_interval"), // ML confidence intervals
  featureImportance: jsonb("feature_importance"), // ML feature importance scores
  modelAccuracy: real("model_accuracy"), // ML model accuracy
  
  // Metadata
  calculationTime: real("calculation_time"), // time taken in seconds
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Saved Patient Profiles Table
export const patientProfiles = pgTable("patient_profiles", {
  id: serial("id").primaryKey(),
  patientId: varchar("patient_id", { length: 100 }).notNull().unique(), // unique patient identifier
  name: varchar("name", { length: 200 }), // optional patient name
  age: integer("age"),
  gender: varchar("gender", { length: 20 }),
  ethnicity: varchar("ethnicity", { length: 50 }).notNull(),
  medicalHistory: text("medical_history"), // relevant medical background
  
  // Clinical data
  previousTransplants: integer("previous_transplants").default(0),
  transfusionHistory: boolean("transfusion_history").default(false),
  pregnancyHistory: boolean("pregnancy_history").default(false),
  
  // Current status
  isActive: boolean("is_active").default(true),
  lastCalculation: timestamp("last_calculation"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// HLA Data Source Tracking
export const hlaDataSources = pgTable("hla_data_sources", {
  id: serial("id").primaryKey(),
  fileName: varchar("file_name", { length: 200 }).notNull(),
  uploadDate: timestamp("upload_date").defaultNow().notNull(),
  recordCount: integer("record_count").notNull(),
  lociProcessed: jsonb("loci_processed").notNull(), // array of processed loci
  ethnicGroups: jsonb("ethnic_groups"), // array of ethnic groups found
  processingNotes: text("processing_notes"),
  isActive: boolean("is_active").default(true),
});

// Create insert schemas for new tables
export const insertHlaFrequencySchema = createInsertSchema(hlaFrequencies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCpraCalculationSchema = createInsertSchema(cpraCalculations).omit({
  id: true,
  createdAt: true,
});

export const insertPatientProfileSchema = createInsertSchema(patientProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHlaDataSourceSchema = createInsertSchema(hlaDataSources).omit({
  id: true,
  uploadDate: true,
});

// Export types
export type HlaFrequency = typeof hlaFrequencies.$inferSelect;
export type InsertHlaFrequency = z.infer<typeof insertHlaFrequencySchema>;

export type CpraCalculation = typeof cpraCalculations.$inferSelect;
export type InsertCpraCalculation = z.infer<typeof insertCpraCalculationSchema>;

export type PatientProfile = typeof patientProfiles.$inferSelect;
export type InsertPatientProfile = z.infer<typeof insertPatientProfileSchema>;

export type HlaDataSource = typeof hlaDataSources.$inferSelect;
export type InsertHlaDataSource = z.infer<typeof insertHlaDataSourceSchema>;

// Medical Document Analysis System Tables

// Medical Documents - stores uploaded document metadata
export const medicalDocuments = pgTable("medical_documents", {
  id: serial("id").primaryKey(),
  originalFileName: varchar("original_file_name", { length: 255 }).notNull(),
  fileSize: integer("file_size").notNull(), // in bytes
  fileType: varchar("file_type", { length: 50 }).notNull(), // .docx, .pdf, etc.
  mimeType: varchar("mime_type", { length: 100 }), // application/vnd.openxmlformats-officedocument.wordprocessingml.document
  filePath: varchar("file_path", { length: 500 }), // server file path (if stored)
  fileHash: varchar("file_hash", { length: 64 }), // SHA-256 hash for deduplication
  
  // Processing status
  processingStatus: varchar("processing_status", { length: 50 }).notNull().default("pending"), // pending, processing, completed, failed
  processingStartedAt: timestamp("processing_started_at"),
  processingCompletedAt: timestamp("processing_completed_at"),
  processingErrorMessage: text("processing_error_message"),
  
  // Document classification
  documentType: varchar("document_type", { length: 100 }), // medical_report, lab_results, imaging_report, etc.
  containsImages: boolean("contains_images").default(false),
  imageCount: integer("image_count").default(0),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Document Analysis Results - stores AI analysis outputs
export const documentAnalyses = pgTable("document_analyses", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").notNull().references(() => medicalDocuments.id, { onDelete: "cascade" }),
  
  // Extracted content
  extractedText: text("extracted_text"), // raw extracted text
  extractedTextLength: integer("extracted_text_length"),
  ocrResults: jsonb("ocr_results"), // results from image OCR processing
  
  // AI analysis results
  aiSummary: text("ai_summary"), // main AI-generated summary
  medicalFindings: jsonb("medical_findings"), // structured medical findings
  patientInformation: jsonb("patient_information"), // extracted patient data
  clinicalConclusion: text("clinical_conclusion"), // AI-generated clinical conclusion
  recommendations: text("recommendations"), // AI-generated recommendations
  
  // Translation results
  originalLanguage: varchar("original_language", { length: 10 }).default("ar"), // detected language
  translatedText: text("translated_text"), // English translation
  translationStatus: varchar("translation_status", { length: 50 }).default("pending"), // pending, completed, failed
  
  // Analysis metadata
  aiModel: varchar("ai_model", { length: 100 }).default("gpt-4"), // AI model used
  confidenceScore: real("confidence_score"), // AI confidence in analysis (0-1)
  processingTime: real("processing_time"), // seconds taken for processing
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Generated Reports - stores generated PDFs and reports
export const generatedReports = pgTable("generated_reports", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").notNull().references(() => medicalDocuments.id, { onDelete: "cascade" }),
  analysisId: integer("analysis_id").notNull().references(() => documentAnalyses.id, { onDelete: "cascade" }),
  
  // Report metadata
  reportType: varchar("report_type", { length: 100 }).notNull(), // comprehensive_pdf, summary_pdf, clinical_report
  reportTitle: varchar("report_title", { length: 255 }),
  reportFormat: varchar("report_format", { length: 50 }).notNull().default("pdf"), // pdf, txt, html
  
  // Report content
  reportContent: text("report_content"), // full report text content
  reportFilePath: varchar("report_file_path", { length: 500 }), // path to generated file
  reportSize: integer("report_size"), // file size in bytes
  
  // Generation metadata
  generatedBy: varchar("generated_by", { length: 100 }).default("ASIA_AI_System"), // who/what generated it
  templateUsed: varchar("template_used", { length: 100 }), // report template
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Document Processing Log - audit trail of processing steps
export const documentProcessingLogs = pgTable("document_processing_logs", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").notNull().references(() => medicalDocuments.id, { onDelete: "cascade" }),
  
  // Log entry details
  step: varchar("step", { length: 100 }).notNull(), // upload, text_extraction, ocr_processing, ai_analysis, etc.
  status: varchar("status", { length: 50 }).notNull(), // started, completed, failed
  message: text("message"), // detailed log message
  errorDetails: jsonb("error_details"), // structured error information
  
  // Timing
  stepStartedAt: timestamp("step_started_at").notNull(),
  stepCompletedAt: timestamp("step_completed_at"),
  duration: real("duration"), // seconds
  
  // Metadata
  additionalData: jsonb("additional_data"), // any additional structured data
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User Sessions - track user interactions with documents
export const userSessions = pgTable("user_sessions", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 100 }).notNull(),
  ipAddress: varchar("ip_address", { length: 45 }), // IPv6 compatible
  userAgent: text("user_agent"),
  
  // Session activity
  documentsProcessed: integer("documents_processed").default(0),
  totalProcessingTime: real("total_processing_time").default(0), // seconds
  lastActivityAt: timestamp("last_activity_at").defaultNow(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Create insert schemas for medical document tables
export const insertMedicalDocumentSchema = createInsertSchema(medicalDocuments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDocumentAnalysisSchema = createInsertSchema(documentAnalyses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGeneratedReportSchema = createInsertSchema(generatedReports).omit({
  id: true,
  createdAt: true,
});

export const insertDocumentProcessingLogSchema = createInsertSchema(documentProcessingLogs).omit({
  id: true,
  createdAt: true,
});

export const insertUserSessionSchema = createInsertSchema(userSessions).omit({
  id: true,
  createdAt: true,
});

// Export types for medical document system
export type MedicalDocument = typeof medicalDocuments.$inferSelect;
export type InsertMedicalDocument = z.infer<typeof insertMedicalDocumentSchema>;

export type DocumentAnalysis = typeof documentAnalyses.$inferSelect;
export type InsertDocumentAnalysis = z.infer<typeof insertDocumentAnalysisSchema>;

export type GeneratedReport = typeof generatedReports.$inferSelect;
export type InsertGeneratedReport = z.infer<typeof insertGeneratedReportSchema>;

export type DocumentProcessingLog = typeof documentProcessingLogs.$inferSelect;
export type InsertDocumentProcessingLog = z.infer<typeof insertDocumentProcessingLogSchema>;

export type UserSession = typeof userSessions.$inferSelect;
export type InsertUserSession = z.infer<typeof insertUserSessionSchema>;

// ST4 - Kuwait Physiotherapy Workforce Dataset (2011-2024)
export const st4WorkforceData = pgTable("st4_workforce_data", {
  id: serial("id").primaryKey(),
  year: integer("year").notNull(),
  
  // Gender and Nationality breakdown
  kuwaitiPtsMale: integer("kuwaiti_pts_male").notNull(),
  nonKuwaitiPtsMale: integer("non_kuwaiti_pts_male").notNull(),
  kuwaitiPtsFemale: integer("kuwaiti_pts_female").notNull(),
  nonKuwaitiPtsFemale: integer("non_kuwaiti_pts_female").notNull(),
  totalPts: integer("total_pts").notNull(),
  
  // Population data
  kuwaitPopulation: real("kuwait_population").notNull(),
  
  // Position hierarchy
  managerial: integer("managerial").notNull(),
  headOfSpecialists: integer("head_of_specialists").notNull(),
  firstSpecialist: integer("first_specialist").notNull(),
  specialist: integer("specialist").notNull(),
  firstPractitioner: integer("first_practitioner").notNull(),
  practitioner: integer("practitioner").notNull(),
  juniorPractitioner: integer("junior_practitioner").notNull(),
  seniorTechnician: integer("senior_technician").notNull(),
  tech: integer("tech").notNull(),
  assistantTechnician: integer("assistant_technician").notNull(),
  
  // Education levels
  phd: integer("phd").notNull(),
  dpt: integer("dpt").notNull(),
  masters: integer("masters").notNull(),
  bachelors: integer("bachelors").notNull(),
  diploma: integer("diploma").notNull(),
  
  // Clinical activity data
  casesSpecialised: integer("cases_specialised").notNull(),
  casesGeneral: integer("cases_general").notNull(),
  sessionsSpecialised: integer("sessions_specialised").notNull(),
  sessionsGeneral: integer("sessions_general").notNull(),
  
  // Patient data by nationality
  outpatientKuwaiti: integer("outpatient_kuwaiti").notNull(),
  outpatientNonKuwaiti: integer("outpatient_non_kuwaiti").notNull(),
  inpatientKuwaiti: integer("inpatient_kuwaiti").notNull(),
  inpatientNonKuwaiti: integer("inpatient_non_kuwaiti").notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSt4WorkforceDataSchema = createInsertSchema(st4WorkforceData).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type St4WorkforceData = typeof st4WorkforceData.$inferSelect;
export type InsertSt4WorkforceData = z.infer<typeof insertSt4WorkforceDataSchema>;

// Farah Dataset - Community Pharmacists' Attitudes Research (743 participants)
export const farahDataset = pgTable("farah_dataset", {
  id: serial("id").primaryKey(),
  
  // Demographics
  age: integer("age"),
  gender: varchar("gender", { length: 20 }),
  educationLevel: varchar("education_level", { length: 100 }),
  yearsOfExperience: integer("years_of_experience"),
  pharmacyType: varchar("pharmacy_type", { length: 100 }), // Independent, Chain, Hospital
  location: varchar("location", { length: 100 }),
  
  // OAT Service Provision
  providesOatServices: boolean("provides_oat_services").default(false),
  oatTrainingReceived: boolean("oat_training_received").default(false),
  willingToProvideOat: boolean("willing_to_provide_oat").default(false),
  
  // Harm Reduction Attitudes (5-point Likert scale: 1-5)
  attitudeCleanNeedles: integer("attitude_clean_needles"), // 1=Strongly Disagree, 5=Strongly Agree
  attitudeSafeInjectionSites: integer("attitude_safe_injection_sites"),
  attitudeNaloxoneProvision: integer("attitude_naloxone_provision"),
  attitudeMethadonePrograms: integer("attitude_methadone_programs"),
  attitudeAddictionTreatment: integer("attitude_addiction_treatment"),
  
  // Service Barriers
  barrierLackOfTraining: boolean("barrier_lack_of_training").default(false),
  barrierLackOfTime: boolean("barrier_lack_of_time").default(false),
  barrierLegalConcerns: boolean("barrier_legal_concerns").default(false),
  barrierStigma: boolean("barrier_stigma").default(false),
  barrierLackOfResources: boolean("barrier_lack_of_resources").default(false),
  
  // Service Facilitators
  facilitatorTraining: boolean("facilitator_training").default(false),
  facilitatorCompensation: boolean("facilitator_compensation").default(false),
  facilitatorLegalProtection: boolean("facilitator_legal_protection").default(false),
  facilitatorPublicSupport: boolean("facilitator_public_support").default(false),
  facilitatorPeerSupport: boolean("facilitator_peer_support").default(false),
  
  // Knowledge Assessment (0-100 score)
  knowledgeScore: real("knowledge_score"),
  
  // Cluster Assignment (from K-means, Hierarchical, DBSCAN)
  clusterKmeans: integer("cluster_kmeans"),
  clusterHierarchical: integer("cluster_hierarchical"),
  clusterDbscan: integer("cluster_dbscan"),
  
  // Composite Scores
  attitudeScore: real("attitude_score"), // Mean of attitude items
  barrierScore: real("barrier_score"), // Count of barriers
  facilitatorScore: real("facilitator_score"), // Count of facilitators
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertFarahDatasetSchema = createInsertSchema(farahDataset).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type FarahDataset = typeof farahDataset.$inferSelect;
export type InsertFarahDataset = z.infer<typeof insertFarahDatasetSchema>;
