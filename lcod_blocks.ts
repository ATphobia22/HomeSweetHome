
import { VisionLens } from './lens_vision';
import { WebGuideLens } from './lens_web_guide';
import { BioSensoryLens } from './lens_bio_sensory';
import { DevOpsLens } from './lens_dev_ops';
import { gitOrchestrator } from './services/git_orchestrator';

export type BlockContext = {
  visionLens: VisionLens;
  webGuideLens: WebGuideLens;
  bioSensoryLens: BioSensoryLens;
  devOpsLens: DevOpsLens;
};

export type BlockDefinition = {
  id: string;
  name: string;
  icon: string;
  inputs: Record<string, string>;
  outputs: Record<string, string>;
  handler: (inputs: any, ctx: BlockContext) => Promise<any>;
};

export const blocks: BlockDefinition[] = [
  {
    id: 'LCOD.GIT_ROCKET_LAUNCH',
    name: 'Git Rocket Launch – The Sync Cycle',
    icon: 'fa-rocket',
    inputs: { tenants: 'array', mock_mode: 'boolean' },
    outputs: { git_registry_updated: 'boolean', atlassian_apps_discovered: 'boolean', sync_cycles_scheduled: 'boolean' },
    handler: async (inputs, ctx) => {
      const tenantId = inputs.tenants?.[0] || 'Node-21605';
      
      // Piece 1: Registry Discovery
      const registry = gitOrchestrator.mockDiscoverRepos(tenantId);
      
      // Piece 2: Atlassian App Siphon
      const apps = gitOrchestrator.getAtlassianApps();
      
      // Piece 3: Sync Engine Planning
      const plan = gitOrchestrator.buildSyncPlan(tenantId, registry, apps);
      
      // Piece 4: Execution
      const syncResult = await gitOrchestrator.executeSync(plan);

      return {
        git_registry_updated: true,
        atlassian_apps_discovered: true,
        sync_cycles_scheduled: true,
        registry,
        discovered_apps: apps,
        syncResult
      };
    },
  },
  {
    id: 'lcod.dev_env.check',
    name: 'Dev Environment Check',
    icon: 'fa-server',
    inputs: { urlRoot: 'string', contextPath: 'string' },
    outputs: { reachable: 'boolean', statusCode: 'number', fullUrl: 'string', notes: 'array' },
    handler: async (inputs, ctx) => {
      return ctx.devOpsLens.checkEnvironment({
        urlRoot: inputs.urlRoot || 'http://localhost:8080',
        contextPath: inputs.contextPath || '/appcontext'
      });
    },
  },
  {
    id: 'bio_acoustic_belief_siphon',
    name: 'Bio-Acoustic Belief Siphon',
    icon: 'fa-om',
    inputs: { signal: 'string', focus: 'string' },
    outputs: { beliefs: 'string', odor_spectra: 'array', node: 'string' },
    handler: async (inputs, ctx) => {
      const res = await ctx.bioSensoryLens.synthesize({
        signalType: 'god1',
        payload: `Focus: ${inputs.focus}, Signal: ${inputs.signal}`
      });
      return { 
        beliefs: res.beliefSystem, 
        odor_spectra: res.odorSpectra,
        acoustic: res.acousticPatterns,
        node: res.orchestrationNode
      };
    },
  },
  {
    id: 'neural_brushstroke_engine',
    name: 'Neural Brushstroke Engine',
    icon: 'fa-brush',
    inputs: { imageUrl: 'string', style: 'string' },
    outputs: { ac_layers: 'array', composite: 'string' },
    handler: async (inputs, ctx) => {
      const res = await ctx.visionLens.analyze({
        imageUrl: inputs.imageUrl,
        context: { mode: 'brushstroke', style: inputs.style },
      });
      return { 
        ac_layers: res.acParametrization, 
        summary: res.summary,
        entities: res.entities
      };
    },
  },
  {
    id: 'visual_intelligence_lens',
    name: 'Spatial Alpha Lens',
    icon: 'fa-eye',
    inputs: { imageUrl: 'string', context: 'object' },
    outputs: { entities: 'array', summary: 'string' },
    handler: async (inputs, ctx) => {
      const res = await ctx.visionLens.analyze({
        imageUrl: inputs.imageUrl,
        context: inputs.context,
      });
      return { entities: res.entities, summary: res.summary };
    },
  },
  {
    id: 'cyber_web_guide',
    name: 'Grounded Web Guide',
    icon: 'fa-globe',
    inputs: { query: 'string' },
    outputs: { intent: 'object', insights: 'array' },
    handler: async (inputs, ctx) => {
      return ctx.webGuideLens.search(inputs.query);
    },
  },
];
