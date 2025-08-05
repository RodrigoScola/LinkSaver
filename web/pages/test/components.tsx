import { Nav } from '../../Components/Nav';
import { RenderFolders } from '../../Components/postTypes/renderFolders';
import { NewCategory } from '../../Components/forms/NewCategory';
import { NewPostForm } from '../../Components/forms/newPostForm';
import { SearchInput } from '../../Components/inputs/SearchInput';
import { TagInput } from '../../Components/inputs/TagInput/TagInput';
import { EditPostCard } from '../../Components/cards/EditPostCard';
import { PostCard } from '../../Components/cards/PostCard';
import { SelectCategory } from '../../Components/cards/SelectCategory';
import { SelectFolder } from '../../Components/cards/SelectFolder';
import { NewFolderCard } from '../../Components/cards/newFolderCard';
import { Box, Center, Divider, Flex, GridItem, Heading, Input } from '@chakra-ui/react';
import { LikeButton } from '../../Components/Buttons/LikeButton';
import { LogoutButton } from '../../Components/Buttons/LogoutButton';
import { IconButton } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { DeleteButton } from '../../Components/Buttons/DeleteButton';
import { SocialLoginCard } from '../../Components/cards/SocialLoginCard';
import { PostProvider } from '../../context/PostContext';
import { RenderCategories } from '../../Components/postTypes/RenderCategories';
import { FormInput } from '../../Components/inputs/FormInput';
import { ColorInput } from '../../Components/inputs/ColorInput';
import { NewPostProvider } from '../../context/newPostContext';
import { FolderListInput } from '../../Components/List/FolderListInput';
export default function TESTCOMPONENTS() {
	const textSize = ['4xl', '3xl', '2xl', 'lg', 'md', 'sm', 'xs'];

	return <></>;
	// return (
	// 	<Box>
	// 		<Center>
	// 			<Box width={'full'}>
	// 				<Heading>Text</Heading>
	// 				<Divider />
	// 				{textSize.map((size) => (
	// 					<Heading key={`text_size-${size}`} size={size}>
	// 						{size}
	// 					</Heading>
	// 				))}
	// 			</Box>
	// 		</Center>
	// 		<Center pt={4}>
	// 			<Box width={'full'}>
	// 				<Heading>Buttons</Heading>
	// 				<Divider />
	// 				<Center>
	// 					<LogoutButton />
	// 					<LikeButton isDisabled={false} />
	// 					<LikeButton isDisabled={true} testing={true} />
	// 					<IconButton icon={<CheckIcon />} background={'whatsapp.600'} />
	// 					<DeleteButton />
	// 				</Center>
	// 				<Box m={'auto'}>
	// 					<SocialLoginCard />
	// 				</Box>
	// 			</Box>
	// 		</Center>
	// 		<Center pt={4}>
	// 			<Box width={'full'}>
	// 				<Heading>Inputs</Heading>
	// 				<Divider />
	// 				<Center flexDir={'column'}>
	// 					<FormInput>
	// 						<Input />
	// 					</FormInput>
	// 					<FormInput>
	// 						<ColorInput />
	// 					</FormInput>
	// 					<FormInput>
	// 						<Input type={'password'} />
	// 					</FormInput>
	// 					<SearchInput />
	// 					<FormInput>
	// 						<FolderListInput
	// 							folders={[
	// 								{ name: 'printer', id: 3 },
	// 								{
	// 									name: 'asdf',
	// 									id: 1,
	// 								},
	// 								{
	// 									name: 'lorem ipsum my name jeff',
	// 									id: 2,
	// 								},
	// 							]}
	// 						/>
	// 					</FormInput>
	// 				</Center>
	// 				<Box m={'auto'}></Box>
	// 			</Box>
	// 		</Center>
	// 		<Center>
	// 			<Box>
	// 				<Heading>Tags</Heading>
	// 				<Divider py={3} />
	// 				<Box>
	// 					<RenderCategories
	// 						categories={[
	// 							{ cat_name: 'js', cat_color: '#043d02' },
	// 							{
	// 								cat_name: 'css',
	// 								cat_color: '#043da2',
	// 							},
	// 						]}
	// 					/>
	// 					<Box p={4}></Box>
	// 					<TagInput
	// 						name={'tagIn'}
	// 						totalTags={[
	// 							{ id: 1, cat_name: 'js', cat_color: '#043d02' },
	// 							{ id: 2, cat_name: 'css', cat_color: '#043da2' },
	// 						]}
	// 					/>
	// 				</Box>
	// 			</Box>
	// 		</Center>
	// 		<Center pt={4}>
	// 			<Box width={'full'}>
	// 				<Heading>Posts</Heading>
	// 				<Divider />
	// 				<Center>
	// 					<Box w={'full'}>
	// 						<GridItem>
	// 							<PostProvider
	// 								post={{
	// 									title: 'this is the title',
	// 								}}>
	// 								<PostCard />
	// 							</PostProvider>
	// 							<PostProvider
	// 								post={{
	// 									title: 'title and image ',
	// 									preview: {
	// 										images: [
	// 											'https://i.ytimg.com/vi/xkZbCKb5J3c/maxresdefault.jpg',
	// 										],
	// 									},
	// 									categories: [1, 64],
	// 								}}>
	// 								<PostCard />
	// 							</PostProvider>
	// 							<PostProvider
	// 								post={{
	// 									title: 'title and icon',
	// 									preview: {
	// 										images: ['https://app.supabase.com/img/supabase-logo.svg'],
	// 									},
	// 								}}>
	// 								<PostCard />
	// 							</PostProvider>
	// 						</GridItem>
	// 					</Box>
	// 				</Center>
	// 			</Box>
	// 		</Center>
	// 		<Center pt={4}>
	// 			<Box width={'full'}>
	// 				<Heading>Components</Heading>
	// 				<Divider />
	// 				<Center>
	// 					<Box w={'full'}>
	// 						<Heading>Edit Post</Heading>
	// 						<Flex justifyContent={'space-around'}>
	// 							<EditPostCard />
	// 						</Flex>
	// 						<Heading>Select Folder</Heading>
	// 						<GridItem>
	// 							<SelectFolder />
	// 						</GridItem>
	// 						<GridItem>
	// 							<Heading>Select Category</Heading>
	// 							<SelectCategory />
	// 						</GridItem>
	// 						<Box>
	// 							<RenderFolders
	// 								folders={[
	// 									{
	// 										name: 'endi',
	// 										color: '#a43d02',
	// 										user_id: '5f015936-ce92-4468-82db-2139dab84c54',
	// 									},
	// 									{ name: 'lorem ipsum m', color: '#ff00ff' },
	// 									{
	// 										name: 'uppasdf',
	// 										color: '#043da2',
	// 										user_id: '5f015936-ce92-4468-82db-2139dab84c54',
	// 									},
	// 								]}
	// 							/>
	// 						</Box>
	// 						<Box maxW={400}>
	// 							<NewFolderCard name={'scsc'} color={'#ff00ff'} />
	// 						</Box>
	// 					</Box>
	// 				</Center>
	// 			</Box>
	// 		</Center>
	// 		<Center>
	// 			<Box>
	// 				<NewPostProvider>
	// 					<NewPostForm />
	// 				</NewPostProvider>
	// 			</Box>
	// 			<Box>
	// 				<NewCategory />
	// 			</Box>
	// 			<Box>
	// 				<NewFolder />
	// 			</Box>
	// 		</Center>
	// 		<Box>
	// 			<Nav />
	// 		</Box>
	// 	</Box>
	// );
}
