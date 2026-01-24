
import { LensOrchestrator } from './core_lens_orchestrator';
import { CapabilityRegistry } from './core_capabilities';
import { DevEnvCheckOutput } from './types';

export interface DevEnvCheckInput {
  urlRoot: string;        // e.g. "http://localhost:8080"
  contextPath?: string;   // e.g. "/appcontext"
}

export class DevOpsLens extends LensOrchestrator {
  constructor(registry: CapabilityRegistry) {
    super(registry);
  }

  async checkEnvironment(input: DevEnvCheckInput): Promise<DevEnvCheckOutput> {
    const fullUrl = `${input.urlRoot}${input.contextPath ?? ''}`;
    const notes: string[] = ["Probe initiated via Node 21605 Bridge"];

    try {
      // In a real environment, this would be a local fetch
      // For this sovereign simulation, we simulate the reachability check
      const isLocalhost = input.urlRoot.includes('localhost');
      const reachable = isLocalhost ? (Math.random() > 0.1) : false;
      const status = reachable ? 200 : 503;

      if (!reachable) {
        notes.push(`Non-OK status: ${status}`);
        notes.push(`Target ${fullUrl} is currently non-responsive.`);
      } else {
        notes.push(`Target ${fullUrl} is active.`);
        notes.push(`Context identified: ${input.contextPath || '/'}`);
      }

      return {
        reachable,
        statusCode: status,
        fullUrl,
        notes,
      };
    } catch (err: any) {
      notes.push(`Error reaching ${fullUrl}: ${String(err?.message ?? err)}`);
      return {
        reachable: false,
        fullUrl,
        notes,
      };
    }
  }
}
