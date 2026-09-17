import { describe, expect, it } from 'vitest'
import type { ClaudeManagedAccount } from './managed-account-types'
import {
  ClaudeAccountPinError,
  resolveClaudeAccountPinEnvPatch
} from './claude-account-worktree-pin'

function account(overrides: Partial<ClaudeManagedAccount> = {}): ClaudeManagedAccount {
  return {
    id: 'acct-1',
    email: 'one@example.com',
    managedAuthPath: '/managed/claude-accounts/acct-1',
    authMethod: 'subscription-oauth',
    createdAt: 0,
    updatedAt: 0,
    lastAuthenticatedAt: 0,
    ...overrides
  }
}

describe('resolveClaudeAccountPinEnvPatch', () => {
  it('returns the CLAUDE_CONFIG_DIR patch for a known host account', () => {
    const accounts = [account(), account({ id: 'acct-2', managedAuthPath: '/managed/acct-2' })]
    expect(resolveClaudeAccountPinEnvPatch('acct-2', accounts)).toEqual({
      CLAUDE_CONFIG_DIR: '/managed/acct-2'
    })
  })

  it('throws for an unknown account id', () => {
    expect(() => resolveClaudeAccountPinEnvPatch('missing', [account()])).toThrow(
      ClaudeAccountPinError
    )
  })

  it('throws for a WSL-managed account', () => {
    const accounts = [account({ managedAuthRuntime: 'wsl' })]
    expect(() => resolveClaudeAccountPinEnvPatch('acct-1', accounts)).toThrow(/WSL-managed/)
  })
})
