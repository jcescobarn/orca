import { applyClaudeAccountPinEnvPatch } from '../../../shared/claude-account-worktree-pin'
import type { ClaudeManagedAccount } from '../../../shared/managed-account-types'
import type { TuiAgent } from '../../../shared/tui-agent'

/**
 * Pins `claudeAccountId` into `env` for a `claude` launch; no-op for every other agent or
 * when no account id was picked. Throws `ClaudeAccountPinError` for an unknown/WSL account.
 */
export function pinClaudeAccountEnv(
  agent: TuiAgent,
  env: Record<string, string>,
  claudeAccountId: string | undefined,
  accounts: readonly ClaudeManagedAccount[] | undefined
): void {
  if (agent === 'claude' && claudeAccountId) {
    applyClaudeAccountPinEnvPatch(env, claudeAccountId, accounts ?? [])
  }
}
