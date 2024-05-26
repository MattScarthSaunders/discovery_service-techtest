import { expect } from 'chai';
import supertest from 'supertest';

import { App } from '../main/app.js';
import { InstanceCleanupService } from '../main/services/InstanceCleanupService.js';
import { ClientAppSeed } from './seed/ClientAppSeed.js';

describe('InstanceCleanupService', () => {
    const app = new App();
    app.mesh.service(ClientAppSeed);
    const seed = app.mesh.resolve(ClientAppSeed);
    const cleanupService = app.mesh.resolve(InstanceCleanupService);

    beforeEach(async () => {
        await app.start();
        await seed.run();
    });

    afterEach(async () => {
        await seed.clear();
        await app.stop();
    });

    it('Deletes expired instances', async () => {
        const request = supertest(app.httpServer.callback());
        const res = await request.get('/');

        expect(res.body.length).to.equal(6);

        await cleanupService.deleteExpiredInstances();

        const res2 = await request.get('/');
        expect(res2.body.length).to.equal(0);
    });

    it('Deletes ONLY expired instances', async () => {
        const request = supertest(app.httpServer.callback());
        const res = await request.get('/particle-accelerator');

        expect(res.body.length).to.equal(2);

        await request
            .post(`/${res.body[0].group}/${res.body[0].id}`)
            .expect(201)
            .send({ meta: {} });
        await cleanupService.deleteExpiredInstances();

        const res2 = await request.get('/particle-accelerator');
        expect(res2.body.length).to.equal(1);
    });
});
