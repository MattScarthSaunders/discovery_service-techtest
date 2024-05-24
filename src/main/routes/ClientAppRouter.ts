import { Router, Post, BodyParam, PathParam } from '@ubio/framework';
import { dep } from 'mesh-ioc';
import { GroupsRepo } from '../repositories/GroupsRepo.js';
import { ClientAppResponse } from '../schema/Response.js';

export class ClientAppRouter extends Router {
    @dep() groups!: GroupsRepo;

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
}
