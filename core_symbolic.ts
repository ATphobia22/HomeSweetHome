
import { QueryIntent } from './types';

export function parseSymbolicQuery(input: string): QueryIntent {
  const redacted = input.includes('***');

  const wildcardTerms = Array.from(input.matchAll(/(\w+)\s*\*\b/g)).map(m => m[1]);

  const mustIncludeTags = Array.from(input.matchAll(/✳️\s*([\w-]+)/g)).map(m => m[1]);

  return { raw: input, wildcardTerms, redacted, mustIncludeTags };
}
