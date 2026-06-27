export async function buildCommand(options: {
  name?: string
  version?: string
  env?: string
}): Promise<void> {
  console.log('[Pavilion] Building...')
  console.log('[Pavilion] ', JSON.stringify(options, null, 2))
}
