import { get } from 'http';
import { OmitBy, PostCategories } from 'shared';
import { getData } from '../class/serverBridge';

export function useNewPostCategories() {
	function createPostCategory(cat: OmitBy<PostCategories, 'id'>) {
		return getData.post(`/postCategories/`, cat);
	}

	return {
		create: createPostCategory,
	};
}
