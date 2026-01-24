
import { LensOrchestrator } from './core_lens_orchestrator';
import { CapabilityRegistry } from './core_capabilities';
import { parseSymbolicQuery } from './core_symbolic';
import { WebInsight, QueryIntent } from './types';
import { gemini } from './services/gemini';

export class WebGuideLens extends LensOrchestrator {
  constructor(registry: CapabilityRegistry) {
    super(registry);
  }

  async search(query: string): Promise<{ intent: QueryIntent; insights: WebInsight[] }> {
    const intent = parseSymbolicQuery(query);

    const webProviders = this.getProviders('web_intel');
    const provider = webProviders[0];
    if (!provider) throw new Error('No web_intel provider registered');

    const result = await gemini.runGroundedSearch(intent.raw);

    const insights: WebInsight[] = result.sources.map(s => ({
      source: provider.id,
      url: s.web.uri,
      title: s.web.title,
      summary: result.text.substring(0, 200) + '...'
    }));

    return { intent, insights };
  }
}
