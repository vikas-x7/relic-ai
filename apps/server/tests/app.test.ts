import { describe, expect, it } from '@jest/globals';
import { createApp } from '@/app';

describe('app', () => {
  it('GET /api/health returns ok', async () => {
    const app = createApp();
    const res = await app.request('/api/health');
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ status: 'ok' });
  });
});
