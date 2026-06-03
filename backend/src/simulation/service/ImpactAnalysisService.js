export class ImpactAnalysisService {
  analyze(baseline, simulated, type, source, target) {
    const teams = [];
    const projects = [];
    const risks = [];
    let degree = 'LOW';

    // Simple rule-based logic for hackathon
    if (type === 'TEAM_RESTRUCTURE') {
      teams.push(source, target);
      risks.push({ level: 'MEDIUM', message: 'Operational disruption during transition' });
      degree = 'MEDIUM';
    } else if (type === 'DEPARTMENT_MERGER') {
      teams.push(source, target);
      risks.push({ level: 'HIGH', message: 'Culture clash and duplicate roles' });
      degree = 'HIGH';
    } else if (type === 'VENDOR_REPLACEMENT') {
      risks.push({ level: 'MEDIUM', message: 'Integration compatibility risks' });
    }

    // Attempt to find influenced projects by checking connections in the graph
    baseline.edges.forEach(edge => {
      const sourceNode = baseline.nodes.find(n => n.id === edge.source);
      const targetNode = baseline.nodes.find(n => n.id === edge.target);
      
      if (sourceNode?.label === source || targetNode?.label === source) {
        if (sourceNode?.type === 'Project') projects.push(sourceNode.label);
        if (targetNode?.type === 'Project') projects.push(targetNode.label);
      }
    });

    const uniqueProjects = [...new Set(projects)];
    
    return {
      teams,
      projects: uniqueProjects,
      risks,
      costEstimate: this.calculateCost(degree),
      changes: simulated.changes || []
    };
  }

  calculateCost(degree) {
    switch (degree) {
      case 'HIGH': return '$50,000';
      case 'MEDIUM': return '$10,000';
      default: return '$1,000';
    }
  }
}
