import { VERSION_STORAGE_KEY } from '../consts/localStorage.ts'

type VersionMigration = {
  version: string
  migrate: () => void
}

function moveLocalStorageItem(oldKey: string, newKey: string): void {
  const item = localStorage.getItem(oldKey)

  if (item === null) {
    return
  }

  localStorage.setItem(newKey, item)
  localStorage.removeItem(oldKey)
}

export const versionMigrations: VersionMigration[] = [
  {
    version: '0.1.0',
    migrate: () => {
      console.log('Running migration for version 0.1.0')
    },
  },
  {
    version: '0.2.0',
    migrate: () => {
      moveLocalStorageItem('version', 'verby_version')
      moveLocalStorageItem('settings', 'verby_settings')
      moveLocalStorageItem('current-lesson', 'verby_current_lesson')
      moveLocalStorageItem('ESP-marked-verbs', 'verby_ESP_marked_verbs')
      moveLocalStorageItem('GER-marked-verbs', 'verby_GER_marked_verbs')
      moveLocalStorageItem('ENG-marked-verbs', 'verby_ENG_marked_verbs')
      moveLocalStorageItem('ITA-marked-verbs', 'verby_ITA_marked_verbs')
      moveLocalStorageItem('FRA-marked-verbs', 'verby_FRA_marked_verbs')
      moveLocalStorageItem('RUS-marked-verbs', 'verby_RUS_marked_verbs')
      moveLocalStorageItem('ESP-library', 'verby_ESP_library')
      moveLocalStorageItem('GER-library', 'verby_GER_library')
      moveLocalStorageItem('ENG-library', 'verby_ENG_library')
      moveLocalStorageItem('ITA-library', 'verby_ITA_library')
      moveLocalStorageItem('FRA-library', 'verby_FRA_library')
      moveLocalStorageItem('RUS-library', 'verby_RUS_library')
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

      return (
        compareVersions(version, previousVersion) > 0 &&
        compareVersions(version, normalizedNewVersion) <= 0
      )
    })

  for (const migration of migrationsToRun) {
    migration.migrate()
  }

  localStorage.setItem(VERSION_STORAGE_KEY, normalizedNewVersion)
}
