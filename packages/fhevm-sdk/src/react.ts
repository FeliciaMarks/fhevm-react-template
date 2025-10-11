/**
 * @fhevm/sdk/react - React hooks and components for FHEVM
 *
 * @example
 * ```tsx
 * import { useFhevm, useContract } from '@fhevm/sdk/react';
 *
 * function MyComponent() {
 *   const { client, encrypt8 } = useFhevm({
 *     network: { chainId: 11155111, rpcUrl: '...' },
 *     autoInit: true
 *   });
 *
 *   return <div>FHEVM Ready</div>;
 * }
 * ```
 */

// Re-export core functionality
export * from './index';

// React-specific exports
export { useFhevm } from './react/hooks/useFhevm';
export type { UseFhevmOptions, UseFhevmReturn } from './react/hooks/useFhevm';

export { useContract } from './react/hooks/useContract';
export type { UseContractOptions, UseContractReturn } from './react/hooks/useContract';
