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

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  role: true,
  companyName: true,
});

export const insertProjectSchema = createInsertSchema(projects);
export const insertPatternSchema = createInsertSchema(patterns);
export const insertBriefingSchema = createInsertSchema(briefings);
export const insertReferenceSchema = createInsertSchema(references);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertPattern = z.infer<typeof insertPatternSchema>;
export type InsertBriefing = z.infer<typeof insertBriefingSchema>;
export type InsertReference = z.infer<typeof insertReferenceSchema>;

export type User = typeof users.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Pattern = typeof patterns.$inferSelect;
export type Briefing = typeof briefings.$inferSelect;
export type Reference = typeof references.$inferSelect;