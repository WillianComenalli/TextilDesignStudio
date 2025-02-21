"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertReferenceSchema = exports.insertBriefingSchema = exports.insertApprovalHistorySchema = exports.insertApprovalStageSchema = exports.insertPatternSchema = exports.insertProjectSchema = exports.insertUserSchema = exports.references = exports.briefings = exports.approvalHistory = exports.approvalStages = exports.patterns = exports.projects = exports.users = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
var drizzle_zod_1 = require("drizzle-zod");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    username: (0, pg_core_1.text)("username").notNull().unique(),
    password: (0, pg_core_1.text)("password").notNull(),
    name: (0, pg_core_1.text)("name").notNull(),
    role: (0, pg_core_1.text)("role").notNull(),
    companyName: (0, pg_core_1.text)("company_name"),
});
exports.projects = (0, pg_core_1.pgTable)("projects", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    title: (0, pg_core_1.text)("title").notNull(),
    description: (0, pg_core_1.text)("description"),
    clientId: (0, pg_core_1.integer)("client_id").references(function () { return exports.users.id; }),
    status: (0, pg_core_1.text)("status").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
});
exports.patterns = (0, pg_core_1.pgTable)("patterns", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    projectId: (0, pg_core_1.integer)("project_id").references(function () { return exports.projects.id; }),
    title: (0, pg_core_1.text)("title").notNull(),
    imageUrl: (0, pg_core_1.text)("image_url").notNull(),
    status: (0, pg_core_1.text)("status").notNull(),
    currentStage: (0, pg_core_1.integer)("current_stage").notNull().default(1),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
});
exports.approvalStages = (0, pg_core_1.pgTable)("approval_stages", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.text)("name").notNull(),
    description: (0, pg_core_1.text)("description"),
    order: (0, pg_core_1.integer)("order").notNull(),
    requiredRole: (0, pg_core_1.text)("required_role").notNull(),
});
exports.approvalHistory = (0, pg_core_1.pgTable)("approval_history", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    patternId: (0, pg_core_1.integer)("pattern_id").references(function () { return exports.patterns.id; }),
    stageId: (0, pg_core_1.integer)("stage_id").references(function () { return exports.approvalStages.id; }),
    approvedBy: (0, pg_core_1.integer)("approved_by").references(function () { return exports.users.id; }),
    status: (0, pg_core_1.text)("status").notNull(),
    comments: (0, pg_core_1.text)("comments"),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
});
exports.briefings = (0, pg_core_1.pgTable)("briefings", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    projectId: (0, pg_core_1.integer)("project_id").references(function () { return exports.projects.id; }),
    content: (0, pg_core_1.json)("content").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
});
exports.references = (0, pg_core_1.pgTable)("references", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    projectId: (0, pg_core_1.integer)("project_id").references(function () { return exports.projects.id; }),
    title: (0, pg_core_1.text)("title").notNull(),
    imageUrl: (0, pg_core_1.text)("image_url").notNull(),
    source: (0, pg_core_1.text)("source"),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
});
// Schema definitions
exports.insertUserSchema = (0, drizzle_zod_1.createInsertSchema)(exports.users).pick({
    username: true,
    password: true,
    name: true,
    role: true,
    companyName: true,
});
exports.insertProjectSchema = (0, drizzle_zod_1.createInsertSchema)(exports.projects);
exports.insertPatternSchema = (0, drizzle_zod_1.createInsertSchema)(exports.patterns);
exports.insertApprovalStageSchema = (0, drizzle_zod_1.createInsertSchema)(exports.approvalStages);
exports.insertApprovalHistorySchema = (0, drizzle_zod_1.createInsertSchema)(exports.approvalHistory);
exports.insertBriefingSchema = (0, drizzle_zod_1.createInsertSchema)(exports.briefings);
exports.insertReferenceSchema = (0, drizzle_zod_1.createInsertSchema)(exports.references);
