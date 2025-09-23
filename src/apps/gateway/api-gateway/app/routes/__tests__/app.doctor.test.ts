// <!-- BEGIN RBP GENERATED: doctor-cleanup-v1 -->
import { describe, it, expect } from '@jest/globals'
import * as route from '../app.doctor'

// Minimal loader invocation test to ensure 200 and marker

describe('GET /app/doctor', () => {
  it('returns 200 and embed marker', async () => {
  const req = new Request('http://localhost/app/doctor')
    const res = await route.loader({ request: req, params: {}, context: {} } as any)
    expect(res.status).toBe(200)
    const text = await (res as Response).text()
    expect(text).toContain('data-testid="doctor-embed-ok"')
  })
})
// <!-- END RBP GENERATED: doctor-cleanup-v1 -->
