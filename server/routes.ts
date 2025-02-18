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

  // Adicionar esta nova rota junto com as outras rotas de patterns
  app.get("/api/patterns/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const [pattern] = await storage.getPatterns(Number(req.params.id));
    if (!pattern) return res.sendStatus(404);
    res.json(pattern);
  });

  // Approval system endpoints
  app.get("/api/approval-stages", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const stages = await storage.getApprovalStages();
    res.json(stages);
  });

  app.get("/api/patterns/:id/approvals", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const approvals = await storage.getPatternApprovals(Number(req.params.id));
    res.json(approvals);
  });

  app.post("/api/patterns/:id/approve", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { stageId, status, comments } = req.body;

    const approval = await storage.createApprovalHistory({
      patternId: Number(req.params.id),
      stageId,
      approvedBy: req.user.id,
      status,
      comments,
    });

    // Se aprovado, atualiza o estágio atual do padrão
    if (status === "approved") {
      const stages = await storage.getApprovalStages();
      const currentStageIndex = stages.findIndex(s => s.id === stageId);
      const nextStage = stages[currentStageIndex + 1];

      if (nextStage) {
        await storage.updatePatternStage(Number(req.params.id), nextStage.id);
      }
    }

    res.status(201).json(approval);
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