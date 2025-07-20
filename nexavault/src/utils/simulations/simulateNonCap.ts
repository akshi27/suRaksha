// utils/simulations/simulateNonCap.ts

/**
 * Simulates an access test for non-capsulized panel based on keyword logic.
 * Keywords: 'give' (allow access), 'deny' (block access)
 */

const SIMULATION_KEY = 'noncap-sim-token'; // can be set via devtool or test function

/**
 * Sets the simulation mode — either "give" or "deny"
 */
export function setSimulateAccessKeyword(keyword: 'give' | 'deny') {
  localStorage.setItem(SIMULATION_KEY, keyword);
}

/**
 * Returns whether access should be granted after face scan
 */
export function shouldAllowNonCapAccess(): boolean {
  const keyword = localStorage.getItem(SIMULATION_KEY);
  return keyword === 'give';
}
