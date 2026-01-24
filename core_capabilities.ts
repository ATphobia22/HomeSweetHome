
import { CapabilityType, CapabilityProvider } from './types';

export class CapabilityRegistry {
  private providers = new Map<string, CapabilityProvider>();

  register(provider: CapabilityProvider) {
    this.providers.set(provider.id, provider);
  }

  getByType(type: CapabilityType): CapabilityProvider[] {
    return [...this.providers.values()].filter(p => p.type === type);
  }

  listAll(): CapabilityProvider[] {
    return [...this.providers.values()];
  }
}
