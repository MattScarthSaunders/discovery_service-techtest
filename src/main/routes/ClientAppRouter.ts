import { BodyParam, Get, PathParam, Post, Router } from '@ubio/framework';
import { dep } from 'mesh-ioc';

import { ClientAppsRepo } from '../repositories/ClientAppsRepo.js';
import { ClientAppResponse, GroupSummaryResponse } from '../schema/Response.js';

export class ClientAppRouter extends Router {
    @dep() groups!: ClientAppsRepo;

    @Post({
        path: '/{group}/{id}',
        responses: {
            201: {
                schema: ClientAppResponse.schema,
            },
        },
    })
    async postInstance(
        @PathParam('group', { schema: { type: 'string' } }) group: string,
        @PathParam('id', { schema: { type: 'string', format: 'uuid' } })
        id: string,
        @BodyParam('meta', { schema: { type: 'object' } })
        meta: { [key: string]: any }
    ) {
        const res = await this.groups.upsertAppInstance(group, id, meta);
        this.ctx.status = 201;
        return res;
    }

    @Get({
        path: '/',
        responses: {
            200: {
                schema: GroupSummaryResponse.schema,
            },
        },
    })
    async getGroupSummary() {
        return this.groups.getGroups();
    }
}
