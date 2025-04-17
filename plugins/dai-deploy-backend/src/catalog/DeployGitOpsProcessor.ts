import {CatalogProcessor} from '@backstage/plugin-catalog-node';
import {LocationSpec} from '@backstage/plugin-catalog-common';
import {Entity} from "@backstage/catalog-model";
import {DeployCommit} from "../db/deploy_commit";

async function getLatestCommitShaFromGitHub(owner: string, repo: string, path: string,branch: string): Promise<string | undefined> {

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits?path=${path}&sha=${branch}`;
    console.log(apiUrl)
    const response = await fetch(apiUrl, {
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            // Optional: Add Authorization header for higher rate limit
            'Authorization': `Bearer <githubtoken>`,
        },
    });

    if (!response.ok) {
        console.error('Failed to fetch commits', await response.text());
        return undefined;
    }

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
        return data[0].sha; // Most recent commit SHA
    }

    return undefined;
}

export class DeployGitOpsProcessor implements CatalogProcessor {

    constructor(private readonly commitService: DeployCommit) {}



    getProcessorName(): string {
        return 'DeployGitOpsProcessor';
    }



    async preProcessEntity(
        _entity: Entity,
        _location: LocationSpec,
    ): Promise<Entity> {

        // Log only for kind 'Component' AND location type 'url'
        if (_entity.kind === 'Component' && _location.type === 'url') {
            console.log('🔍 GitOps Candidate Component Entity:', JSON.stringify(_entity, null, 2));
            console.log('🌍 Source Location:', JSON.stringify(_location, null, 2));

            const annotations = _entity.metadata?.annotations;
            if (annotations) {
                const deployYamlUrl = annotations['dai-deploy-yaml/managed-by-location'];
                if (deployYamlUrl) {
                    console.log(`Found deploy YAML annotation: ${deployYamlUrl}`);
                    const [type, value] = deployYamlUrl.split(/:(.+)/);
                    console.log("Type:", type);   // => 'url'
                    console.log("Value:", value); // => 'https://github.com
                    const url = value
                    const repoMatch = url.match(/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)/);
                    if (repoMatch) {
                        const [, owner, repo, branch, path] = repoMatch;
                        const latestSha = await getLatestCommitShaFromGitHub(owner, repo, path,branch);

                        if (latestSha) {
                            console.log(`🔢 Latest commit SHA for ${path}: ${latestSha}`);
                            console.log("Validate against the db");
                            const previousSha = await this.commitService.getCommitId(_entity.metadata.name)
                            if (previousSha === latestSha) {
                                console.log(`No change since last deploy for ${_entity.metadata.name}`);
                                return _entity;
                            }

                            // Trigger deploy here
                            await this.commitService.setCommitId(_entity.metadata.name, latestSha);

                            // Trigger deployment logic here using xl-cli scaffolder action
                            console.log(`Triggering deployment for ${_entity.metadata.name} at ${latestSha}`);

                        }
                    }
                }
            }
        }

        return _entity;
    }




}
