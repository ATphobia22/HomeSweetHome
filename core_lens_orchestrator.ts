
import { CapabilityRegistry } from './core_capabilities';
import { CapabilityType, CapabilityProvider } from './types';

export class LensOrchestrator {
  constructor(protected registry: CapabilityRegistry) {}

  protected getProviders(type: CapabilityType): CapabilityProvider[] {
    return this.registry.getByType(type);
  }
}
