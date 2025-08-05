import { createContext, useContext } from 'react';
import { NewInteraction, PostInteraction } from 'shared';
import { useObject } from './useObject';
const { getData } = require('../class/serverBridge');

type InteractionsContextType = {
	GetPostInteraction: (postId: number) => Promise<PostInteraction>;
	GetPostInteractionOfUser: (postId: number, userId: number) => Promise<PostInteraction>;
	AddLike: (postId: number, userId: number) => Promise<void>;
};

const InteractionsContext = createContext<InteractionsContextType | null>(null);

export const InteractionsProvider = ({ children }: { children: React.ReactNode }) => {
	const interactions = useObject<Record<number, PostInteraction>>();

	async function GetPostInteraction(postId: number): Promise<PostInteraction> {
		if (postId in interactions.value) {
			return interactions.value[postId];
		}

		const interaction = await getData.get(`/posts/${postId}/interactions`);

		if (interaction) {
			interactions.update({ [postId]: interaction });
			return interaction;
		}

		return interaction;
	}
	async function GetPostInteractionOfUser(postId: number, userId: number): Promise<PostInteraction> {
		if (postId in interactions.value) {
			return interactions.value[postId];
		}

		const interaction = await getData.get(`/posts/${postId}/interactions/?userId=${userId}`);

		if (interaction) {
			interactions.update({ [postId]: interaction });
			return interaction;
		}

		return interaction;
	}

	async function AddLike(postId: number, userId: number) {
		//todo: make an interactions thing
		await getData.post('interactions', {
			postId: postId,
			status: 'public',
			userId,
			type: 'like',
		} as NewInteraction);
		//TODO: update the interactions
	}
	return (
		<InteractionsContext.Provider
			value={{
				AddLike,
				GetPostInteractionOfUser,
				GetPostInteraction,
			}}>
			{children}
		</InteractionsContext.Provider>
	);
};

export const useInteraction = () => {
	const ctx = useContext(InteractionsContext);
	if (!ctx) {
		throw new Error(`invalid interaction context`);
	}
	return ctx;
};
