import { DatabaseQuery } from 'src/types/storageType';
import { PrivateItemContextMaker } from './contextItems/PrivateItemContext';
import { UserInstance } from '../Roles/User';
import { ItemContextMaker } from './contextItems/ItemContext';

const contexts = {
    seller_funds_history: () => {
        return new PrivateItemContextMaker();
    },
    orders: () => {
        return new PrivateItemContextMaker();
    },
} as const;

export class DashboardContextFactory {
    static fromRequest<T extends keyof typeof contexts>(
        name: T,
        context: DatabaseQuery<T>,
        req: { user: UserInstance },
    ) {
        if (!(name in contexts)) {
            throw new Error('Context item not found');
        }
        if (req.user.type === 'api') {
            return new ItemContextMaker(context);
        }

        if (!(name in contexts)) {
            throw new Error('Context item not found');
        }
        const item = contexts[name]();

        if (
            item instanceof PrivateItemContextMaker &&
            PrivateItemContextMaker.IsContextName(name)
        ) {
            //@ts-expect-error idk rodrigo do futuro
            item.init({ name, query: context });

            //TODO: isso ta pq todo mundo eh admin agr
            //if (!req.user.type || req.user.type === 'admin') {
            item.SetMarketplace(req.user.marketplaceId);
            //}

            if (!req.user.isAdmin) item.SetSeller(req.user.sellerId);
        }
        return item;
    }
}
