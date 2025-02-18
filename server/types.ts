import { SessionStore } from "express-session";
import {
  User, InsertUser,
  Project, InsertProject,
  Pattern, InsertPattern,
  Briefing, InsertBriefing,
  Reference, InsertReference,
  ApprovalStage, InsertApprovalStage,
  ApprovalHistory, InsertApprovalHistory
} from "@shared/schema";

export interface IStorage {
  sessionStore: SessionStore;

  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Project management
  getProjects(clientId?: number): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;

  // Pattern management
  getPatterns(projectId: number): Promise<Pattern[]>;
  createPattern(pattern: InsertPattern): Promise<Pattern>;

  // Approval system
  getApprovalStages(): Promise<ApprovalStage[]>;
  createApprovalStage(stage: InsertApprovalStage): Promise<ApprovalStage>;
  getPatternApprovals(patternId: number): Promise<ApprovalHistory[]>;
  createApprovalHistory(approval: InsertApprovalHistory): Promise<ApprovalHistory>;
  updatePatternStage(patternId: number, currentStage: number): Promise<Pattern>;

  // Briefing management
  getBriefings(projectId: number): Promise<Briefing[]>;
  createBriefing(briefing: InsertBriefing): Promise<Briefing>;

  // Reference management
  getReferences(projectId: number): Promise<Reference[]>;
  createReference(reference: InsertReference): Promise<Reference>;
}