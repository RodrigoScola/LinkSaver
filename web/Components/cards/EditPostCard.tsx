import { Box, Heading, Input } from '@chakra-ui/react';
import { FormInput } from '../inputs/FormInput';
import { SelectCategory, SelectedCategories } from './SelectCategory';
import { Category, Post } from 'shared';
import { ChangeEvent } from 'react';

export const EditPostCard = ({
	onCategoryChange: onCategoryChange = () => {},
	categories,
	post,
	onChange = () => {},
}: {
	post: Post;
	onChange(e?: ChangeEvent<HTMLInputElement>): void;
	onCategoryChange: (e: SelectedCategories[]) => void;
	categories: Category[];
}) => {
	return (
		<Box pb={3}>
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
		</Box>
	);
};
