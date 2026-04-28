import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as sorobanReadApi from '../../app/lib/soroban-read-api';
import { predinexReadApi } from '../../app/lib/adapters/predinex-read-api';

describe('predinexReadApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uses Soroban read layer for getPool (canonical target-chain read path)', async () => {
    const mockPool = {
      id: 1,
      title: 'Test Pool',
      description: 'Test Description',
      creator: 'G...test',
      outcomeA: 'Yes',
      outcomeB: 'No',
      totalA: 1000000,
      totalB: 2000000,
      settled: false,
      expiry: 12345,
      status: 'active' as const,
    };

    const mockGetPool = vi.spyOn(sorobanReadApi, 'getPoolFromSoroban').mockResolvedValue({
      pool: mockPool,
    });

    const result = await predinexReadApi.getPool(1);

    expect(mockGetPool).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockPool);
  });

  it('uses Soroban read layer for getUserBet (canonical target-chain read path)', async () => {
    const mockBet = {
      amountA: 1000000,
      amountB: 0,
      totalBet: 1000000,
    };

    const mockGetUserBet = vi.spyOn(sorobanReadApi, 'getUserBetFromSoroban').mockResolvedValue({
      bet: mockBet,
    });

    const result = await predinexReadApi.getUserBet(1, 'G...user');

    expect(mockGetUserBet).toHaveBeenCalledWith(1, 'G...user');
    expect(result).toEqual(mockBet);
  });

  it('uses Soroban read layer for getPoolCount (canonical target-chain read path)', async () => {
    const mockGetPoolCount = vi.spyOn(sorobanReadApi, 'getPoolCountFromSoroban').mockResolvedValue(42);

    const result = await predinexReadApi.getPoolCount();

    expect(mockGetPoolCount).toHaveBeenCalled();
    expect(result).toBe(42);
  });

  it('handles pool not found from Soroban (returns null)', async () => {
    vi.spyOn(sorobanReadApi, 'getPoolFromSoroban').mockResolvedValue({
      pool: null,
    });

    const result = await predinexReadApi.getPool(999);

    expect(result).toBeNull();
  });

  it('handles Soroban read errors gracefully', async () => {
    vi.spyOn(sorobanReadApi, 'getPoolFromSoroban').mockResolvedValue({
      pool: null,
      error: 'RPC connection failed',
    });

    const result = await predinexReadApi.getPool(1);

    expect(result).toBeNull();
  });
});
