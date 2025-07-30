import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addFolder, getFolder, selectFolder } from '../store/folder/FolderSlice';
import _ from 'lodash';

export const useFolder = (initialPosts = []) => {
	const [pi, setPostIds] = useState([]);
	const currentPosts = useSelector(selectFolder);
	const dispatch = useDispatch();
	const postIds = useMemo(() => {
		return pi;
	}, [pi]);

	const posts = useMemo(() => {
		return postIds.map((id) => currentPosts[id]);
	}, [postIds]);

	useEffect(() => {
		if (initialPosts.length > 0) {
			initialPosts.forEach((post) => {
				if (typeof post == 'number') {
					dispatch(getFolder(post));
					pid(post);
				} else {
					if (post.type == 'folders') {
						newFolder(post);
					}
				}
			});
		}
	}, [initialPosts]);

	const pid = useCallback((id) => setPostIds([...pi, id]), [setPostIds, pi]);

	const newFolder = useCallback(
		(post) => {
			if (!postIds.includes(post.id)) {
				pid(post.id);
			}
			if (!currentPosts[post.id]) {
				dispatch(addFolder(post));
			}
		},
		[dispatch, pid]
	);
	const nfolder = useMemo(() => {
		return _.uniqBy(
			Object.values(posts).sort((a, b) => b.id - a.id),
			'id'
		);
	}, [posts]);
	return {
		folder: nfolder,
		get size() {
			return posts.length;
		},
		newFolder,
	};
};
