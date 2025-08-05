import { Box, Input } from '@chakra-ui/react';
import { FormInput } from '../inputs/FormInput';
import { SelectCategory } from './SelectCategory';
import { SelectFolder } from './SelectFolder';
import { Category, Folder, Post } from 'shared';
import { title } from 'process';
import { ChangeEvent } from 'react';
import folders from '../../pages/folders';

export const EditPostCard = ({
	onCategoryChange: onCategoryChange = () => {},
	categories,
	post,
	onChange = () => {},
}: {
	post: Post;
	onChange(e?: ChangeEvent<HTMLInputElement>): void;
	onCategoryChange: (e: Category[]) => void;
	categories: Category[];
}) => {
	return (
		<Box>
			<FormInput width={'full'} labelText={'post title'}>
				<Input width={'full'} onChange={onChange} defaultValue={title} name='title' />
			</FormInput>
			<FormInput width={'full'} labelText={'post url'}>
				<Input
					width={'full'}
					onChange={onChange}
					defaultValue={post.post_url ?? ''}
					name='post_url'
				/>
			</FormInput>

			<SelectCategory
				onCategoryChange={onCategoryChange}
				name={'updatePost' + post.id}
				defaultSelected={true}
				baseCategories={categories.map((f) => ({ ...f, isSelected: true }))}
			/>
		</Box>
	);
};
