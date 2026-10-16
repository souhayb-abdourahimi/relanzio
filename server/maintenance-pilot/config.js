export function pilotConfig(env = process.env) {
  return Object.freeze({ visible: env.MAINTENANCE_PILOT_VISIBLE === 'true', payments: env.MAINTENANCE_PILOT_PAYMENTS_ENABLED === 'true',
    personalData: false, sends: false, livePayments: false,
    publicationApproved: env.MAINTENANCE_PILOT_PUBLICATION_APPROVED === 'true',
    operators: new Set((env.MAINTENANCE_PILOT_OPERATOR_IDS || '').split(',').map(x=>x.trim()).filter(Boolean)),
    testKey: env.MAINTENANCE_PILOT_STRIPE_TEST_KEY || '', webhookSecret: env.MAINTENANCE_PILOT_STRIPE_TEST_WEBHOOK_SECRET || '',
    origin: env.APP_URL || 'http://localhost:5173',
    identity: { name:env.VITE_LEGAL_NAME || '', registration:env.VITE_LEGAL_REGISTRATION || '', email:env.VITE_LEGAL_EMAIL || '' }
  });
}
export function problem(code, status=400) { return Object.assign(new Error(code), {code,status}); }
