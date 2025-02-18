import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  app.get("/api/projects", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const clientId = req.user.role === "client" ? req.user.id : undefined;
    const projects = await storage.getProjects(clientId);
    res.json(projects);
  });

  app.post("/api/projects", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const project = await storage.createProject(req.body);
    res.status(201).json(project);
  });

  app.get("/api/projects/:id/patterns", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const patterns = await storage.getPatterns(Number(req.params.id));
    res.json(patterns);
  });

  app.post("/api/projects/:id/patterns", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const pattern = await storage.createPattern({
      ...req.body,
      projectId: Number(req.params.id),
    });
    res.status(201).json(pattern);
  });

  app.get("/api/projects/:id/briefings", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const briefings = await storage.getBriefings(Number(req.params.id));
    res.json(briefings);
  });

  app.post("/api/projects/:id/briefings", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const briefing = await storage.createBriefing({
      ...req.body,
      projectId: Number(req.params.id),
    });
    res.status(201).json(briefing);
  });

  app.get("/api/projects/:id/references", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const references = await storage.getReferences(Number(req.params.id));
    res.json(references);
  });

  app.post("/api/projects/:id/references", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const reference = await storage.createReference({
      ...req.body,
      projectId: Number(req.params.id),
    });
    res.status(201).json(reference);
  });

  const httpServer = createServer(app);
  return httpServer;
}
