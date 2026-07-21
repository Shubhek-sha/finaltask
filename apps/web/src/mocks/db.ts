import type { Organization, Role, User } from "@forge/types";

interface Identifiable {
  id: string;
}

class Collection<T extends Identifiable> {
  private table = new Map<string, T>();

  seed(records: T[]): void {
    this.table.clear();
    for (const record of records) this.table.set(record.id, record);
  }

  list(): T[] {
    return Array.from(this.table.values());
  }

  get(id: string): T | undefined {
    return this.table.get(id);
  }

  find(predicate: (record: T) => boolean): T | undefined {
    return this.list().find(predicate);
  }

  filter(predicate: (record: T) => boolean): T[] {
    return this.list().filter(predicate);
  }

  create(record: T): T {
    this.table.set(record.id, record);
    return record;
  }

  update(id: string, patch: Partial<T>): T | undefined {
    const existing = this.table.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...patch };
    this.table.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.table.delete(id);
  }

  clear(): void {
    this.table.clear();
  }
}

export function createCollection<T extends Identifiable>(): Collection<T> {
  return new Collection<T>();
}

/**
 * The mock layer's entire "database" — see ARCHITECTURE.md §3. In-memory
 * only, reseeded fresh on every page load / test run (see fixtures/seed.ts)
 * rather than mirrored to localStorage, so demo data stays deterministic.
 */
export const db = {
  organizations: createCollection<Organization>(),
  roles: createCollection<Role>(),
  users: createCollection<User>(),
};

