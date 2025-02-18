import { IStorage } from "./types";
import {
  User, InsertUser,
  Project, InsertProject,
  Pattern, InsertPattern,
  Briefing, InsertBriefing,
  Reference, InsertReference
} from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

const MemoryStore = createMemoryStore(session);

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private patterns: Map<number, Pattern>;
  private briefings: Map<number, Briefing>;
  private references: Map<number, Reference>;
  sessionStore: session.SessionStore;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.patterns = new Map();
    this.briefings = new Map();
    this.references = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProjects(clientId?: number): Promise<Project[]> {
    const projects = Array.from(this.projects.values());
    return clientId ? projects.filter(p => p.clientId === clientId) : projects;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const id = this.currentId++;
    const newProject = { ...project, id };
    this.projects.set(id, newProject);
    return newProject;
  }

  async getPatterns(projectId: number): Promise<Pattern[]> {
    return Array.from(this.patterns.values()).filter(
      p => p.projectId === projectId
    );
  }

  async createPattern(pattern: InsertPattern): Promise<Pattern> {
    const id = this.currentId++;
    const newPattern = { ...pattern, id };
    this.patterns.set(id, newPattern);
    return newPattern;
  }

  async getBriefings(projectId: number): Promise<Briefing[]> {
    return Array.from(this.briefings.values()).filter(
      b => b.projectId === projectId
    );
  }

  async createBriefing(briefing: InsertBriefing): Promise<Briefing> {
    const id = this.currentId++;
    const newBriefing = { ...briefing, id };
    this.briefings.set(id, newBriefing);
    return newBriefing;
  }

  async getReferences(projectId: number): Promise<Reference[]> {
    return Array.from(this.references.values()).filter(
      r => r.projectId === projectId
    );
  }

  async createReference(reference: InsertReference): Promise<Reference> {
    const id = this.currentId++;
    const newReference = { ...reference, id };
    this.references.set(id, newReference);
    return newReference;
  }
}

export const storage = new MemStorage();
