import { GraphRepository } from '../graph/GraphRepository.js';

const graphRepo = new GraphRepository();

export async function getGraph(req, res, next) {
  try {
    const graph = await graphRepo.getFullGraph();
    res.json(graph);
  } catch (err) {
    next(err);
  }
}

export async function getNodes(req, res, next) {
  try {
    const nodes = await graphRepo.getNodes();
    res.json({ nodes });
  } catch (err) {
    next(err);
  }
}

export async function getRelationships(req, res, next) {
  try {
    const relationships = await graphRepo.getRelationships();
    res.json({ relationships });
  } catch (err) {
    next(err);
  }
}

export async function getStats(req, res, next) {
  try {
    const stats = await graphRepo.getStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
}
