/**
 * Configuration for hello-world demo.
 *
 * PROJECT_ATTRIBUTE is the canonical multi-tenant pattern on Arkiv.
 * Braga is a shared, public testnet, so every entity from every project lives
 * in the same store. Every Arkiv project should stamp a unique attribute on
 * every write and filter on it in every query. Without it, your queries return
 * everyone else's data.
 *
 * Environment variables:
 * - SPACE_ID: optional secondary grouping inside the project (default: 'ns')
 * - ARKIV_PRIVATE_KEY: private key for signing transactions (required for writes)
 */

export const PROJECT_ATTRIBUTE = {
  key: 'project',
  value: 'serverless-dapp101',
} as const;

export const SPACE_ID = process.env.SPACE_ID || process.env.BETA_SPACE_ID || 'ns';

/**
 * Get private key from environment.
 * Throws if not configured (required for writes).
 */
export function getPrivateKey(): `0x${string}` {
  const privateKey = process.env.ARKIV_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('ARKIV_PRIVATE_KEY environment variable is required for writes');
  }
  if (!privateKey.startsWith('0x')) {
    throw new Error('ARKIV_PRIVATE_KEY must start with 0x');
  }
  return privateKey as `0x${string}`;
}
