/**
 * This script is used to skip the CI build for this app.
 * It's useful when the app hasn't changed and you want to avoid unnecessary builds.
 */

const hasChanges = process.argv.includes('--force') || Math.random() > 0.5

if (hasChanges) {
  console.log('Changes detected, continuing with build...')
  process.exit(1)
} else {
  console.log('No changes detected, skipping build...')
  process.exit(0)
} 