/**
 * @param {import('knex').Knex} knex
 */

exports.up =  async function up(knex) {
    await knex.schema.createTable('digitalai_deploy_gitops', table => {
        table.string('component_name').primary(); // Unique key for the component
        table.string('git_url').notNullable(); // URL of the git repository
        table.string('branch').notNullable(); // Branch of the git repository
        table.string('commit_id').notNullable(); // Commit ID of the git repository
        table.string('deploy_application').notNullable(); // Commit message of the git repository
        table.timestamp('updated_at').defaultTo(knex.fn.now()); // When was it last updated
    });
}

exports.down = async function down(knex) {
    await knex.schema.dropTable('digitalai_deploy_gitops');
}
