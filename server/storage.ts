import { IStorage } from "./types";
import {
  users, projects, patterns, briefings, references,
  type User, type InsertUser,
  type Project, type InsertProject,
  type Pattern, type InsertPattern,
  type Briefing, type InsertBriefing,
  type Reference, type InsertReference
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getProjects(clientId?: number): Promise<Project[]> {
    if (clientId) {
      return await db.select().from(projects).where(eq(projects.clientId, clientId));
    }
    return await db.select().from(projects);
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async getPatterns(projectId: number): Promise<Pattern[]> {
    return await db.select().from(patterns).where(eq(patterns.projectId, projectId));
  }

  async createPattern(pattern: InsertPattern): Promise<Pattern> {
    const [newPattern] = await db.insert(patterns).values(pattern).returning();
    return newPattern;
  }

  async getBriefings(projectId: number): Promise<Briefing[]> {
    return await db.select().from(briefings).where(eq(briefings.projectId, projectId));
  }

  async createBriefing(briefing: InsertBriefing): Promise<Briefing> {
    const [newBriefing] = await db.insert(briefings).values(briefing).returning();
    return newBriefing;
  }

  async getReferences(projectId: number): Promise<Reference[]> {
    return await db.select().from(references).where(eq(references.projectId, projectId));
  }

  async createReference(reference: InsertReference): Promise<Reference> {
    const [newReference] = await db.insert(references).values(reference).returning();
    return newReference;
  }
}

export const storage = new DatabaseStorage();