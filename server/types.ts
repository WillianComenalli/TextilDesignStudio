import { SessionStore } from "express-session";
import {
  User, InsertUser,
  Project, InsertProject,
  Pattern, InsertPattern,
  Briefing, InsertBriefing,
  Reference, InsertReference
} from "@shared/schema";

export interface IStorage {
  sessionStore: SessionStore;
  
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getProjects(clientId?: number): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  
  getPatterns(projectId: number): Promise<Pattern[]>;
  createPattern(pattern: InsertPattern): Promise<Pattern>;
  
  getBriefings(projectId: number): Promise<Briefing[]>;
  createBriefing(briefing: InsertBriefing): Promise<Briefing>;
  
  getReferences(projectId: number): Promise<Reference[]>;
  createReference(reference: InsertReference): Promise<Reference>;
}
