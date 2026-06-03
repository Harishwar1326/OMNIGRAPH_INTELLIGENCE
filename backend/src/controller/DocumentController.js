import { GraphRepository } from '../graph/GraphRepository.js';
import fs from 'fs/promises';
import path from 'path';
import { config } from '../config/index.js';

const graphRepo = new GraphRepository();

export async function getDocuments(req, res, next) {
  try {
     // For hackathon, just list files in upload dir or query Neo4j
     const session = (graphRepo.useMemory() ? 
       { run: async () => ({ records: [] }), close: async () => {} } : 
       null); 
     
     // Let's just list from Neo4j
     if (graphRepo.useMemory()) {
       const s = await import('../graph/InMemoryStore.js').then(m => m.getInMemoryStore());
       return res.json([...s.documents.values()]);
     }

     const driver = await import('../config/neo4j.js').then(m => m.getDriver());
     const sess = driver.session();
     try {
       const result = await sess.run('MATCH (d:Document) RETURN d.filename AS filename, d.uploadedAt AS uploadedAt ORDER BY d.uploadedAt DESC');
       res.json(result.records.map(r => ({
         filename: r.get('filename'),
         uploadedAt: r.get('uploadedAt')
       })));
     } finally {
       await sess.close();
     }
  } catch (err) {
    next(err);
  }
}

export async function deleteDocument(req, res, next) {
  const { filename } = req.body;
  if (!filename) return res.status(400).json({ error: 'Filename is required' });

  try {
    console.log(`[OMNIGRAPH] Attempting to delete document: ${filename}`);
    await graphRepo.deleteDocument(filename);
    
    // Also delete physical file if exists
    try {
      const filePath = path.join(config.upload.dir, filename);
      console.log(`[OMNIGRAPH] Deleting file: ${filePath}`);
      await fs.unlink(filePath);
    } catch (err) {
      console.warn(`[OMNIGRAPH] File deletion skipped or failed: ${err.message}`);
    }

    console.log(`[OMNIGRAPH] Deletion successful for: ${filename}`);
    res.json({ success: true, message: `Document ${filename} and its graph data deleted.` });
  } catch (err) {
    console.error(`[OMNIGRAPH] Deletion failed for ${filename}:`, err);
    next(err);
  }
}
