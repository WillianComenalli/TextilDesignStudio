import { pgTable, text, serial, integer, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  companyName: text("company_name"),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  clientId: integer("client_id").references(() => users.id),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const patterns = pgTable("patterns", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  title: text("title").notNull(),
  imageUrl: text("image_url").notNull(),
  status: text("status").notNull(),
  currentStage: integer("current_stage").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// New table for approval stages
export const approvalStages = pgTable("approval_stages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  order: integer("order").notNull(),
  requiredRole: text("required_role").notNull(),
});

// New table for approval history
export const approvalHistory = pgTable("approval_history", {
  id: serial("id").primaryKey(),
  patternId: integer("pattern_id").references(() => patterns.id),
  stageId: integer("stage_id").references(() => approvalStages.id),
  approvedBy: integer("approved_by").references(() => users.id),
  status: text("status").notNull(), // 'approved', 'rejected', 'pending'
  comments: text("comments"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const briefings = pgTable("briefings", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  content: json("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const references = pgTable("references", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  title: text("title").notNull(),
  imageUrl: text("image_url").notNull(),
  source: text("source"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Update schemas to include new fields
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  role: true,
  companyName: true,
});

export const insertProjectSchema = createInsertSchema(projects);
export const insertPatternSchema = createInsertSchema(patterns);
export const insertApprovalStageSchema = createInsertSchema(approvalStages);
export const insertApprovalHistorySchema = createInsertSchema(approvalHistory);
export const insertBriefingSchema = createInsertSchema(briefings);
export const insertReferenceSchema = createInsertSchema(references);

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertPattern = z.infer<typeof insertPatternSchema>;
export type InsertApprovalStage = z.infer<typeof insertApprovalStageSchema>;
export type InsertApprovalHistory = z.infer<typeof insertApprovalHistorySchema>;
export type InsertBriefing = z.infer<typeof insertBriefingSchema>;
export type InsertReference = z.infer<typeof insertReferenceSchema>;

export type User = typeof users.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Pattern = typeof patterns.$inferSelect;
export type ApprovalStage = typeof approvalStages.$inferSelect;
export type ApprovalHistory = typeof approvalHistory.$inferSelect;
export type Briefing = typeof briefings.$inferSelect;
export type Reference = typeof references.$inferSelect;