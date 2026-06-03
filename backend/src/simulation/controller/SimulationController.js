import { SimulationService } from '../service/SimulationService.js';

const simulationService = new SimulationService();

export async function runSimulation(req, res, next) {
  try {
    const result = await simulationService.run(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function predictFuture(req, res, next) {
  try {
    const result = await simulationService.predictFuture(req.body.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getSimulationTypes(req, res, next) {
  try {
    const types = [
      { id: 'TEAM_RESTRUCTURE', name: 'Team Restructuring' },
      { id: 'POLICY_CHANGE', name: 'Policy Change' },
      { id: 'RESOURCE_ALLOCATION', name: 'Resource Allocation' },
      { id: 'VENDOR_REPLACEMENT', name: 'Vendor Replacement' },
      { id: 'DEPARTMENT_MERGER', name: 'Department Merger' },
    ];
    res.json(types);
  } catch (err) {
    next(err);
  }
}

export async function generateReport(req, res, next) {
  try {
    const report = await simulationService.generateReport(req.body);
    res.json(report);
  } catch (err) {
    next(err);
  }
}
