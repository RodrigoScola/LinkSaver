import { createContext, useContext } from 'react';
import { Interaction, NewInteraction } from 'shared';
import { useObject } from './useObject';
const { getData } = require('../class/serverBridge');

type InteractionsContextType = {
	GetPostInteractionOfUser: (postId: number, userId: number) => Promise<Interaction | null>;
	AddLike: (postId: number, userId: number) => Promise<void>;
	RemoveLike: (interactionId: number) => Promise<void>;
};

const InteractionsContext = createContext<InteractionsContextType | null>(null);

export const InteractionsProvider = ({ children }: { children: React.ReactNode }) => {
	async function GetPostInteractionOfUser(postId: number, userId: number): Promise<Interaction> {
		const interaction = await getData.get(`/interactions/?postId=${postId}&userId=${userId}`);

		return interaction.find(Boolean) || null;
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

	async function RemoveLike(interactionId: number) {
		if (!interactionId) {
			console.error('invalid interactionId');
			return;
		}
		await getData.delete(`interactions/${interactionId}`);
	}
	return (
		<InteractionsContext.Provider
			value={{
				RemoveLike,
				AddLike,
				GetPostInteractionOfUser,
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
