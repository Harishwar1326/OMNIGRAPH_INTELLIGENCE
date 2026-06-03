import { Router } from 'express';
import multer from 'multer';
import { config } from '../config/index.js';
import * as uploadCtrl from '../controller/UploadController.js';
import * as graphCtrl from '../controller/GraphController.js';
import * as chatCtrl from '../controller/ChatController.js';
import * as discoveryCtrl from '../controller/DiscoveryController.js';
import * as docCtrl from '../controller/DocumentController.js';
import * as authCtrl from '../controller/AuthController.js';
import simulationRoutes from './simulation.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.upload.maxSizeMb * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'application/pdf',
      'text/plain',
      'text/csv',
      'application/vnd.ms-excel', // Some OS report csv as this
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only PDF, TXT, and CSV files are allowed'));
  },
});

// Auth Routes
router.post('/auth/register', authCtrl.register);
router.post('/auth/login', authCtrl.login);

// Existing Routes
router.post('/upload', upload.single('file'), uploadCtrl.uploadPdf);
router.post('/extract', uploadCtrl.extractText);
router.get('/graph', graphCtrl.getGraph);
router.get('/graph/nodes', graphCtrl.getNodes);
router.get('/graph/relationships', graphCtrl.getRelationships);
router.get('/stats', graphCtrl.getStats);
router.get('/documents', docCtrl.getDocuments);
router.post('/documents/delete', docCtrl.deleteDocument);
router.post('/chat', chatCtrl.chat);
router.get('/discover', discoveryCtrl.discover);
router.use('/simulation', simulationRoutes);

export default router;
