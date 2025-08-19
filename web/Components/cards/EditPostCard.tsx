import { Box, Heading, Input, FormControl } from '@chakra-ui/react';
import { FormInput } from '../inputs/FormInput';
import { SelectCategory, SelectedCategories } from './SelectCategory';
import { Category, Folder, Post } from 'shared';
import { ChangeEvent } from 'react';
import { SelectFolder } from './SelectFolder';

export const EditPostCard = ({
	onCategoryChange: onCategoryChange = () => {},
	categories,
	post,
	baseFolders,
	defaultSelectedFolder,
	onFolderChange = () => {},
	OnSubmit = () => {},
	onChange = () => {},
}: {
	post: Post;
	onChange(e?: ChangeEvent<HTMLInputElement>): void;
	onCategoryChange: (e: SelectedCategories[]) => void;
	defaultSelectedFolder?: Folder;

	baseFolders: Folder[];

	OnSubmit: () => void;

	onFolderChange?: (folder: Folder) => void;

	categories: Category[];
}) => {
	return (
		<FormControl onSubmit={OnSubmit} pb={3}>
			<FormInput width={'full'} labelText={'post title'}>
				<Input width={'full'} onChange={onChange} defaultValue={post.title} name='title' />
			</FormInput>
			<FormInput width={'full'} labelText={'post url'}>
				<Input
					width={'full'}
					onChange={onChange}
					defaultValue={post.post_url ?? ''}
					name='post_url'
				/>
			</FormInput>

			<Heading py={3} size={'lg'}>
				Categories
			</Heading>

			<SelectCategory
				onCategoryChange={onCategoryChange}
				name={'updatePost' + post.id}
				defaultSelected={true}
				baseCategories={categories.map((f) => ({ ...f, isSelected: true }))}
			/>

			<Heading pb={3} size={'lg'}>
				Folder
			</Heading>

			<SelectFolder
				baseFolders={baseFolders}
				onChange={onFolderChange}
				defaultSelected={defaultSelectedFolder}
			/>
		</FormControl>
	);
};
