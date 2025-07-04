export const register = () => {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    require('@repo/observability/instrumentation')
  }
} 