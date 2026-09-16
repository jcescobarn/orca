import type { ClaudeManagedAccount } from '../../shared/managed-account-types'

/** Thrown when a worktree launch names a Claude account pin that cannot be honored. */
export class ClaudeAccountPinError extends Error {}

/**
 * Resolves the CLAUDE_CONFIG_DIR override for pinning one managed Claude account to a
 * single worktree launch, independent of the globally active account (`ClaudeAccountSelection`).
 * Callers must gate on `accountId` being present — this always returns a concrete patch or throws.
 *
 * WSL-homed accounts are not supported yet: `managedAuthPath` here is a host path, and the
 * account's Linux auth path needs a WSL-aware spawn this call site does not have.
 */
export function resolveClaudeAccountPinEnvPatch(
  accountId: string,
  accounts: readonly ClaudeManagedAccount[]
): { CLAUDE_CONFIG_DIR: string } {
  const account = accounts.find((entry) => entry.id === accountId)
  if (!account) {
    throw new ClaudeAccountPinError(`Unknown Claude account "${accountId}".`)
  }
  if (account.managedAuthRuntime === 'wsl') {
    throw new ClaudeAccountPinError(
      `Claude account "${account.email}" is WSL-managed; pinning a WSL account to a worktree launch isn't supported yet.`
    )
  }
  return { CLAUDE_CONFIG_DIR: account.managedAuthPath }
}
