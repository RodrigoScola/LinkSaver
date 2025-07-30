import { createContext, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCategories } from '../store/category/CategorySlice';
import { selectNewPost, updateData } from '../store/newPost/newPostSlice';

import { useErrorMessage } from '../hooks/useErrorMessage';

import { selectFolder } from '../store/folder/FolderSlice';
import { useUsers } from '../hooks/useUser';
export const NewPostContext = createContext();
export const NewPostProvider = ({ children }) => {
	const postInformation = useSelector(selectNewPost);
	const allCategories = useSelector(selectCategories);
	const dispatch = useDispatch();
	const folders = useSelector(selectFolder);
	const errors = useErrorMessage([]);
	const [{ id: userid }] = useUsers();

	useEffect(() => {
		if (userid) {
			dispatch(
				updateData({
					type: 'post',
					user_id: userid,
					userId: userid,
				})
			);
		}
	}, [userid]);

	const canSubmit = useMemo(() => {
		let hasError = false;
		if (postInformation.title == '') {
			hasError = true;
		}
		return !hasError;
	}, [postInformation]);

	useEffect(() => {
		if (postInformation) {
			const { title, categories } = postInformation;
			if (title == '') {
				errors.add('title', 'title cannot be null');
			} else {
				errors.remove('title');
			}
			if (categories.length > 3) {
				errors.add('categories', 'you cannot have more than 3 categories');
			}
			if (categories.length <= 3) {
				errors.remove('categories');
			}
		}
	}, [postInformation]);

	const changeTitle = useCallback((newTitle) => {
		dispatch(
			updateData({
				title: newTitle,
			})
		);
	}, []);
	const changeUrl = useCallback((newUrl) => {
		dispatch(
			updateData({
				post_url: newUrl,
			})
		);
	}, []);

	const setCategories = useCallback((ids = []) => {
		const cats = ids.reduce((all, id) => {
			all.push(id);
			return all;
		}, []);
		dispatch(updateData({ type: 'post', categories: cats }));
	}, []);

	const setFolder = useCallback(
		(id) => {
			if (typeof id == 'number') {
				dispatch(updateData({ type: 'post', folder: id }));
			}
		},
		[dispatch]
	);
	return (
		<NewPostContext.Provider
			value={{
				...postInformation,
				canSubmit,
				changeTitle,
				changeUrl,
				setFolder,
				setCategories,
				get folder() {
					return folders[postInformation.folder];
				},
				errors: errors.errors,
			}}>
			{children}
		</NewPostContext.Provider>
	);
};
