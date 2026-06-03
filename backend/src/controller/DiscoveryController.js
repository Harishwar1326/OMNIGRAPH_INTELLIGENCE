import { DiscoveryService } from '../service/DiscoveryService.js';

const discoveryService = new DiscoveryService();

export async function discover(req, res, next) {
  try {
    const result = await discoveryService.discover();
    res.json(result);
  } catch (err) {
    next(err);
  }
}
