import { v4 as uuidv4 } from 'uuid';
import { GraphRepository } from '../graph/GraphRepository.js';
import { DocumentService } from './DocumentService.js';
import { ExtractionService } from './ExtractionService.js';

export class PipelineService {
  constructor() {
    this.documentService = new DocumentService();
    this.extractionService = new ExtractionService();
    this.graphRepo = new GraphRepository();
  }

  async processText(text, metadata = {}) {
    const documentId = metadata.documentId || uuidv4();
    const { entities, relationships, topics, concepts } =
      await this.extractionService.extractAll(text);

    if (metadata.filename) {
      await this.graphRepo.saveDocument({
        id: documentId,
        filename: metadata.filename,
        uploadedAt: new Date().toISOString(),
      });
    }

    const sourceDoc = metadata.filename || documentId;
    await this.graphRepo.saveEntities(entities, sourceDoc);
    await this.graphRepo.saveRelationships(relationships, sourceDoc);

    return {
      documentId,
      filename: metadata.filename,
      textLength: text.length,
      entities,
      relationships,
      topics: topics || [],
      concepts: concepts || [],
      stats: {
        entityCount: entities.length,
        relationshipCount: relationships.length,
        topicCount: (topics || []).length,
        conceptCount: (concepts || []).length,
      },
    };
  }

  async processPdf(file) {
    const text = await this.documentService.extractTextFromFile(file);
    if (!text?.trim()) {
      throw new Error('Could not extract text from file. The file may be empty.');
    }
    const { filename } = await this.documentService.saveFile(file);
    return this.processText(text, { filename, documentId: uuidv4() });
  }
}
