
import { CapabilityRegistry } from '../core_capabilities';
import { VisionLens } from '../lens_vision';
import { WebGuideLens } from '../lens_web_guide';
import { BioSensoryLens } from '../lens_bio_sensory';
import { DevOpsLens } from '../lens_dev_ops';
import { blocks, BlockContext } from '../lcod_blocks';
import { CapabilityProvider } from '../types';

class EpicenterEngine {
  private registry: CapabilityRegistry;
  private visionLens: VisionLens;
  private webGuideLens: WebGuideLens;
  private bioSensoryLens: BioSensoryLens;
  private devOpsLens: DevOpsLens;
  private blockContext: BlockContext;

  constructor() {
    this.registry = new CapabilityRegistry();

    // Register internal providers
    this.registry.register({
      id: 'gemini-vision-v3',
      type: 'vision',
      version: '3.0-pro',
      health: async () => 'ok'
    } as CapabilityProvider);

    this.registry.register({
      id: 'google-search-grounding',
      type: 'web_intel',
      version: '4.0-flash',
      health: async () => 'ok'
    } as CapabilityProvider);

    this.registry.register({
      id: 'god1-bio-sacred-link',
      type: 'bio_sensory',
      version: '1.0-alpha',
      health: async () => 'ok'
    } as CapabilityProvider);

    this.registry.register({
      id: 'sovereign-devops-monitor',
      type: 'dev_ops',
      version: '1.2.0',
      health: async () => 'ok'
    } as CapabilityProvider);

    this.visionLens = new VisionLens(this.registry);
    this.webGuideLens = new WebGuideLens(this.registry);
    this.bioSensoryLens = new BioSensoryLens(this.registry);
    this.devOpsLens = new DevOpsLens(this.registry);

    this.blockContext = {
      visionLens: this.visionLens,
      webGuideLens: this.webGuideLens,
      bioSensoryLens: this.bioSensoryLens,
      devOpsLens: this.devOpsLens
    };
  }

  async runBlock(blockId: string, inputs: any) {
    const block = blocks.find(b => b.id === blockId);
    if (!block) throw new Error(`Block not found: ${blockId}`);
    return block.handler(inputs, this.blockContext);
  }

  getBlocks() {
    return blocks;
  }
}

export const epicenterEngine = new EpicenterEngine();
