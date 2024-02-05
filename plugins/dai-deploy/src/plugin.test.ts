import { daiDeployPlugin } from './plugin';

describe('dai-deploy', () => {
  it('should export plugin', () => {
    expect(daiDeployPlugin).toBeDefined();
  });
});
