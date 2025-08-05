import { MdOutlineNewLabel } from 'react-icons/md';
import { Flex, Button, Box, Heading, FlexProps } from '@chakra-ui/react';
import { NewCategory } from '../forms/NewCategory';
import { SearchInput } from '../inputs/SearchInput';
import { AddIcon } from '@chakra-ui/icons';
import { TagInput } from '../inputs/TagInput/TagInput';
import { useCallback, useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { PopoverElement } from '../ui/popover/PopoverElement';
import { getData } from '../../class/serverBridge';
import { RenderTag } from '../RenderTag';
import { TagInputProvider } from '../../context/TagInputContext';
import { Category } from 'shared';

export type SelectedCategories = Category & { isSelected: boolean };

type SelectCategoryProps = {
	baseCategories: Category[];
	onCategoryChange: (cats: Category[]) => void;
	name: string;
	defaultSelected: boolean;
} & FlexProps;

export const SelectCategory = ({
	baseCategories,
	onCategoryChange: onCategoryChange = () => {},

	name = 'newPostForm',
	defaultSelected = false,
	...props
}: SelectCategoryProps) => {
	const [results, setResults] = useState([]);

	const newItem = useCallback(
		(category: Category) => {
			//TODO: handle new category creation to add the

			setPopularCategories((prev) => ({
				...prev,
				[category.id]: {
					...category,
					isSelected: true,
				} as SelectedCategories,
			}));
		},
		[
			name,
			// setStackCats
		]
	);

	const [popularCategories, setPopularCategories] = useState<Record<number, SelectedCategories>>(
		baseCategories.reduce((all: Record<number, SelectedCategories>, category) => {
			all[category.id] = {
				...category,
				isSelected: true,
			} as SelectedCategories;

			return all;
		}, {})
	);

	return (
		<Flex alignItems={'center'} wrap={'wrap'} {...props}>
			<TagInputProvider name={name} defaultSelected={defaultSelected}>
				<PopoverElement
					onOpen={async () => {
						if (Object.values(popularCategories).length == 0) {
							const data = (await getData.get(`/categories/?limit=5`)) as Category &
								{ isSelected?: boolean }[];

							let obj: Record<number, SelectedCategories> = {};

							console.log('this is the data', data);

							for (const cat of data) {
								if (!cat) continue;
								cat.isSelected = false;
							}

							//@ts-expect-error idk
							setResults(data);
						}
					}}
					triggerElement={
						<Button
							borderRadius={'50%'}
							position={'relative'}
							height={'40px'}
							width={'25px'}
							variant={'outline'}>
							<AddIcon boxSize={3} />
						</Button>
					}
					headerElement={<Heading size={'md'}>Categories</Heading>}>
					<Box>
						{Object.values(popularCategories)?.map((category, ind) => {
							return (
								<RenderTag
									m={1}
									key={'stack cat' + category.id}
									onClick={() => {
										setPopularCategories([{ ...category, isSelected: true }]);
									}}
									text={category.name}
									color={category.color}
								/>
							);
						})}
					</Box>
					<Box>
						<SearchInput
							type={'categories'}
							name={'categorySearch'}
							onResult={(res) => {
								console.log(`setting the result on input`);
								console.log(res);
								setResults(res);
							}}
						/>
						{results?.map((category: SelectedCategories, ind) => {
							return (
								<RenderTag
									m={1}
									key={'stack cat' + category.id}
									onClick={() => {
										setPopularCategories({ [category.id]: category });
									}}
									text={category.name}
									color={category.color}
								/>
							);
						})}
					</Box>
					<PopoverElement
						style={{
							padding: '1em',
							marginRight: '1em',
						}}
						headerElement={<Heading size={'md'}>New Category</Heading>}
						triggerStyle={{
							display: 'flex',
							justifyContent: 'center',
							width: 'full',
						}}
						triggerElement={
							<Button
								leftIcon={<MdOutlineNewLabel />}
								size={'sm'}
								colorScheme={'yellow'}
								mt={4}>
								Add New
							</Button>
						}>
						<NewCategory onSubmit={(item) => newItem(item)} />
					</PopoverElement>
				</PopoverElement>
				<TagInput
					display={'flex'}
					maxW={'fit-content'}
					wrap={'wrap'}
					gap={2}
					onSelectChange={onCategoryChange}
					name={name}
					totalTags={Object.values(popularCategories)}
				/>
			</TagInputProvider>
		</Flex>
	);
};
