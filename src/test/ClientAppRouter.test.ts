import { expect } from 'chai';
import { randomUUID } from 'crypto';
import supertest from 'supertest';

import { App } from '../main/app.js';
import { ClientApp, GroupSummary } from '../main/schema/Response.js';
import { ClientAppSeed } from './seed/ClientAppSeed.js';

describe('ClientAppRouter', () => {
    const app = new App();

    beforeEach(async () => await app.start());
    afterEach(async () => await app.stop());

    describe('Post /:group/:id', () => {
        it('Has status: 201', async () => {
            const request = supertest(app.httpServer.callback());
            const uuid = randomUUID();

            await request.post(`/test/${uuid}`).send({ meta: {} }).expect(201);
        });

        it('Returns correct response body', async () => {
            const uuid = randomUUID();
            const request = supertest(app.httpServer.callback());

            const res = await request.post(`/test/${uuid}`).send({ meta: {} });

            expect(res.body).to.have.keys([
                'createdAt',
                'updatedAt',
                'id',
                'group',
                'meta',
            ]);

            expect(res.body.createdAt).to.be.a('number');
            expect(res.body.updatedAt).to.be.a('number');
            expect(res.body.meta).to.be.a('object');
            expect(res.body.group).to.equal('test');
            expect(res.body.id).to.equal(uuid);
        });

        it('Meta data updated in place', async () => {
            const uuid = randomUUID();
            const request = supertest(app.httpServer.callback());

            const route = `/test/${uuid}`;

            const res = await request.post(route).send({ meta: {} });
            expect(res.body.meta).to.be.an('object');
            expect(res.body.meta).to.deep.equal({});

            const res2 = await request
                .post(route)
                .send({ meta: { test: 123 } });
            expect(res2.body.meta).to.deep.equal({ test: 123 });

            const res3 = await request.post(route).send({ meta: {} });
            expect(res3.body.meta).to.be.an('object');
            expect(res3.body.meta).to.deep.equal({});
        });

        it('Updates existing document with new date if already existing.', async () => {
            const uuid = randomUUID();
            const request = supertest(app.httpServer.callback());

            const res = await request.post(`/test/${uuid}`).send({ meta: {} });

            const firstResId = res.body.id;
            const firstResUpdateTime = res.body.updatedAt;

            const res2 = await request.post(`/test/${uuid}`).send({ meta: {} });

            expect(res2.body.id).to.equal(firstResId);
            expect(res2.body.updatedAt).not.to.equal(firstResUpdateTime);
            expect(res2.body.updatedAt).to.be.greaterThan(firstResUpdateTime);
        });

        it('Responds 400 on bad id', async () => {
            const request = supertest(app.httpServer.callback());

            const res = await request
                .post(`/test/whatIsThis?`)
                .send({ meta: {} })
                .expect(400);

            expect(res.body.message).to.equal(
                'Invalid request parameters:\n    - /id must match format "uuid"'
            );
        });

        it('Responds 404 on bad route', async () => {
            const request = supertest(app.httpServer.callback());

            const res = await request
                .post(`/test/test/threeTimesATester`)
                .send({ meta: {} })
                .expect(404);

            expect(res.body.message).to.equal('Route not found');
        });
    });

    describe('Get /', () => {
        const seed = new ClientAppSeed();
        beforeEach(async () => await seed.run());
        afterEach(async () => await seed.clear());

        it('Responds with 200', async () => {
            const request = supertest(app.httpServer.callback());
            await request.get('/').expect(200);
        });

        it('Responds with correctly formatted response', async () => {
            const request = supertest(app.httpServer.callback());
            const res = await request.get('/').expect(200);

            expect(res.body.length).to.equal(6);
            res.body.forEach((element: GroupSummary) => {
                expect(element).to.have.keys([
                    'instances',
                    'group',
                    'latestUpdatedAt',
                    'createdAt',
                ]);
            });
        });

        it('Correctly counts the number of instances in a group', async () => {
            const request = supertest(app.httpServer.callback());

            await seed.upsertSingle('newGroup', randomUUID(), {});
            const res = await request.get('/');

            let newInstance = res.body.find(
                (el: GroupSummary) => el.group === 'newGroup'
            );

            expect(newInstance.instances).to.equal(1);

            await seed.upsertSingle('newGroup', randomUUID(), {});
            const res2 = await request.get('/');

            newInstance = res2.body.find(
                (el: GroupSummary) => el.group === 'newGroup'
            );

            expect(newInstance.instances).to.equal(2);
        });

        it('Correctly identifies the latest update time', async () => {
            const request = supertest(app.httpServer.callback());

            const res = await request.get('/');
            const initialTime = res.body[0].latestUpdatedAt;

            await seed.upsertSingle(res.body[0].group, randomUUID(), {});

            const res2 = await request.get('/');
            const newInstance = res2.body.find(
                (el: GroupSummary) => el.group === res.body[0].group
            );
            const newTime = newInstance.latestUpdatedAt;

            expect(initialTime).to.be.lessThan(newTime);
        });

        it('Responds with empty array if no groups', async () => {
            const request = supertest(app.httpServer.callback());
            seed.clear();

            const res = await request.get('/');
            expect(res.body.length).to.equal(0);
        });

        it('Responds with 404 on invalid path', async () => {
            const request = supertest(app.httpServer.callback());
            seed.clear();

            await request.get('/test/howdy').expect(404);
        });
    });

    describe('GET /:group', () => {
        const seed = new ClientAppSeed();
        beforeEach(async () => await seed.run());
        afterEach(async () => await seed.clear());

        it('Responds with 200', async () => {
            const request = supertest(app.httpServer.callback());
            await request.get('/particle-accelerator').expect(200);
        });

        it('Responds with list of client app instances', async () => {
            const request = supertest(app.httpServer.callback());
            const res = await request.get('/particle-accelerator');

            expect(res.body.length).to.equal(2);
            expect(res.body[0]).to.have.keys([
                'createdAt',
                'updatedAt',
                'id',
                'group',
                'meta',
            ]);
        });

        it('Includes correct instances for the group', async () => {
            const request = supertest(app.httpServer.callback());
            const res = await request.get('/particle-accelerator');

            res.body.forEach((instance: ClientApp) => {
                expect(instance.group).to.equal('particle-accelerator');
            });
        });

        it('Responds with empty list if no instances', async () => {
            const request = supertest(app.httpServer.callback());
            seed.clear();
            const res = await request.get('/particle-accelerator');

            expect(res.body.length).to.equal(0);
        });
    });

    describe('Delete /:group/:id', () => {
        const seed = new ClientAppSeed();
        beforeEach(async () => await seed.run());
        afterEach(async () => await seed.clear());

        it('Responds with 204', async () => {
            const request = supertest(app.httpServer.callback());
            const group = await request.get('/particle-accelerator');

            const toDelete = group.body[0];

            await request
                .delete(`/${toDelete.group}/${toDelete.id}`)
                .expect(204);
        });

        it('Removes an instance', async () => {
            const request = supertest(app.httpServer.callback());
            const group = await request.get('/particle-accelerator');

            const toDelete = group.body[0];

            await request
                .delete(`/${toDelete.group}/${toDelete.id}`)
                .expect(204);

            const updatedGroup = await request.get('/particle-accelerator');

            const instance = updatedGroup.body.find(
                (el: ClientApp) => el.id === toDelete.id
            );

            expect(instance).to.equal(undefined);
        });

        it('Responds with 404 if not found but valid id', async () => {
            const request = supertest(app.httpServer.callback());

            await request
                .delete(`/particle-accelerator/${randomUUID()}`)
                .expect(404);
        });

        it('Responds with 404 if unknown group/group empty', async () => {
            const request = supertest(app.httpServer.callback());

            await request
                .delete(`/hello-there-test-group/${randomUUID()}`)
                .expect(404);
        });
    });
});
