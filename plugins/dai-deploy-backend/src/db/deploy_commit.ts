import { Knex } from 'knex';

export class DeployCommit {
    constructor(private readonly db: Knex) {}

    // Get the commitId for the given component
    async getCommitId(component: string): Promise<string | undefined> {
        const row = await this.db('digitalai_deploy_gitops').where({ component_name: component }).first();
        return row?.commit_id;
    }

    // Set the commitId for the given component
    async setCommitId(component: string, commitId: string): Promise<void> {
        const exists = await this.db('digitalai_deploy_gitops').where({ component_name: component }).first();

        if (exists) {
            await this.db('digitalai_deploy_gitops')
                .update({ commit_id: commitId, updated_at: this.db.fn.now() })
                .where({ component_name: component });
        } else {
            await this.db('digitalai_deploy_gitops').insert({ component_name: component, commit_id: commitId });
        }
    }
}

