import { VERSION_STORAGE_KEY } from '../consts/localStorage.ts'

type VersionMigration = {
  version: string
  migrate: () => void
}

export const versionMigrations: VersionMigration[] = [
  {
    version: '0.1.0',
    migrate: () => {
      console.log('Running migration for version 0.1.0')
    },
  },
]

function normalizeVersion(version: string): string {
  return version.startsWith('v') ? version.slice(1) : version
}

function compareVersions(a: string, b: string): number {
  const aParts = normalizeVersion(a).split('.').map((part) => Number(part) || 0)
  const bParts = normalizeVersion(b).split('.').map((part) => Number(part) || 0)
  const maxLength = Math.max(aParts.length, bParts.length)

  for (let index = 0; index < maxLength; index += 1) {
    const aPart = aParts[index] ?? 0
    const bPart = bParts[index] ?? 0

    if (aPart > bPart) return 1
    if (aPart < bPart) return -1
  }

  return 0
}

export function runVersionMigrations(newVersion: string): void {
  const normalizedNewVersion = normalizeVersion(newVersion)
  const previousVersion = localStorage.getItem(VERSION_STORAGE_KEY)

  if (previousVersion && compareVersions(previousVersion, normalizedNewVersion) === 0) {
    return
  }

  const migrationsToRun = [...versionMigrations]
    .sort((a, b) => compareVersions(a.version, b.version))
    .filter(({ version }) => {
      if (!previousVersion) {
        return compareVersions(version, normalizedNewVersion) <= 0
      }

      return compareVersions(version, previousVersion) > 0
    })

  for (const migration of migrationsToRun) {
    migration.migrate()
  }

  localStorage.setItem(VERSION_STORAGE_KEY, normalizedNewVersion)
}
