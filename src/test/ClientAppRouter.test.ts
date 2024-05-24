import supertest from 'supertest';
import { expect } from 'chai';
import { App } from '../main/app.js';
import { randomUUID } from 'crypto';

describe('ClientAppRouter', () => {
    const app = new App();

    beforeEach(async () => await app.start());
    afterEach(async () => await app.stop());

    describe('Post /:group/:id', () => {
        it('Has status: 201', async () => {
            const uuid = randomUUID();
            const request = supertest(app.httpServer.callback());

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
            const route = `/test/${uuid}`;

            const request = supertest(app.httpServer.callback());

            const res = await request.post(route).send({ meta: {} });
            expect(res.body.meta).to.be.a('object');
            expect(res.body.meta).to.be.empty;

            const res2 = await request
                .post(route)
                .send({ meta: { test: 123 } });
            expect(res2.body.meta).to.deep.equal({ test: 123 });

            const res3 = await request.post(route).send({ meta: {} });
            expect(res3.body.meta).to.be.a('object');
            expect(res3.body.meta).to.be.empty;
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
});
