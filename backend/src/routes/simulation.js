import { Router } from 'express';
import * as ctrl from '../simulation/controller/SimulationController.js';

const router = Router();

router.get('/types', ctrl.getSimulationTypes);
router.post('/run', ctrl.runSimulation);
router.post('/predict-future', ctrl.predictFuture);
router.post('/report', ctrl.generateReport);

export default router;
