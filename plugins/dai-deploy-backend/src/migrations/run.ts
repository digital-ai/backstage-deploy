import { resolvePackagePath } from '@backstage/backend-plugin-api';
import { Knex } from 'knex';

export async function applyDatabaseMigrations(knex: Knex): Promise<void> {
    const migrationsDir = resolvePackagePath(
        '@digital-ai/plugin-dai-deploy-backend',
        'migrations',
    );

    try {
        console.log('Applying migrations from:', migrationsDir);
        await knex.migrate.latest({
            directory: migrationsDir,
        });
        console.log('Migrations applied successfully.');
    } catch (error) {
        console.error('Error applying migrations:', error);
    }
}
