import { BiCategoryAlt } from 'react-icons/bi';
import { ChangeEvent } from 'react';
import { useDelay } from '../../hooks/useDelay';
import { Box, Flex, Divider, Button } from '@chakra-ui/react';
import { FormInput } from '../inputs/FormInput';
import { Input } from '@chakra-ui/react';
import { ItemColorSelect } from '../inputs/ItemColorSelect';
import { RenderTag } from '../RenderTag';
import { useCategories } from '../../hooks/useCategories';
import { useObject } from '../../hooks/useObject';
import { Category, PartialBy } from 'shared';

export const NewCategory = ({ onSubmit = () => {} }: { onSubmit?: (category: Category) => void }) => {
	const catCtx = useCategories();

	const { value: category, update } = useObject<PartialBy<Category, 'id'>>();

	const updateinfo = (e: ChangeEvent<HTMLInputElement>) => {
		update({ [e.target.name]: e.target.value });
	};

	const { fn: setNewFolderColor } = useDelay(updateinfo, 15);

	const postCategory = async () => {
		const newCategory = await catCtx.PostCategory(category);

		if (!newCategory) {
			return;
		}

		onSubmit?.(newCategory!);
	};

	return (
		<>
			<Box>
				<Flex alignContent={'center'} alignItems={'center'} justifyContent={'space-between'}>
					<FormInput
						HelperText={'what is the category name?'}
						labelText={'Category Name'}
						errorMessage={'invalid category name'}>
						<Input
							placeholder='Default Category Name'
							value={category.name}
							name='name'
							maxLength={15}
							onChange={updateinfo}
							mt={1}
							justifySelf={'right'}
						/>
					</FormInput>
					<ItemColorSelect
						HelperText={'Color Code'}
						name='color'
						labelText={'Category Color'}
						pl={3}
						onChange={setNewFolderColor}
					/>
				</Flex>

				<Divider pt={3} mb={3} />
				<Flex justifyContent={'center'} m={'auto'} pt={2} mb={4}>
					{category && (
						<RenderTag color={category.color} size='lg'>
							{category.name}
						</RenderTag>
					)}
				</Flex>

				<Flex mb={2} justifyContent={'center'}>
					<Button onClick={postCategory} rightIcon={<BiCategoryAlt />} colorScheme={'whatsapp'}>
						Add Category
					</Button>
				</Flex>
			</Box>
		</>
	);
};
