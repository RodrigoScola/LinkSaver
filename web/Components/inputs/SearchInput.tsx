import { Box, Input, InputGroupProps, useBoolean, useColorMode } from '@chakra-ui/react';
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useDispatch, useSelector } from 'react-redux';
import {
	addSearchInput,
	selectSearch,
	updateSearchData,
	updateSearchResults,
} from '../../store/search/SearchSlice';
import { InputGroup, InputLeftElement } from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons';
import { add_categories } from '../../store/category/CategorySlice';
import { obj } from '../../utils/formatting/ObjectFormat';

const sliceterm = 'categorySearch';

let timer: NodeJS.Timeout | null = null;

export const SearchInput = ({ type = 'categories', params = {}, onResult = () => { }, ...props }: {

	type: 'categories',

	params: Record<string, any>,
	onResult: (result: any) => any



} & InputGroupProps) => {
	const { colorMode } = useColorMode();
	const [searchTerm, setSearchTerm] = useState('');
	const { data, setUrl } = useFetch('');
	const dispatch = useDispatch();
	const term = useSelector(selectSearch);
	const [__, setErrMessage] = useState('');
	const [_, setVisited] = useBoolean(false);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const items = useMemo(() => term[sliceterm], [term]);
	useEffect(() => {
		dispatch(addSearchInput(sliceterm));
	}, [dispatch]);

	const OnResultCb = useCallback((result: any) => onResult(result), [onResult]);

	const nparams = useMemo(() => params, [params]);
	const handleChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {

			if (!inputRef.current) return

			dispatch(
				updateSearchData({
					name: sliceterm,
					term: inputRef.current.value,
				})
			);
			if (timer) {
				clearTimeout(timer);
			}

			timer = setTimeout(() => setSearchTerm(inputRef.current?.value || ''), 500);
		},
		[dispatch]
	);
	useEffect(() => {
		if (searchTerm) {
			setUrl(
				type +
				'/' +
				obj.toQuery({
					s: searchTerm,
					...nparams,
				})
			);
		}
	}, [searchTerm, type, setUrl, nparams]);
	useEffect(() => {
		try {
			if (!data) {
				return
			}
			if (!Array.isArray(data) || (data as Array<any>).length == 0) {

				setErrMessage('No results found');
				return
			}
			setErrMessage('');
			dispatch(
				updateSearchResults({
					name: sliceterm,
					results: data,
				})
			);
			if (type == 'categories') {
				dispatch(add_categories(data));
			}

		} catch (err) {
			if (err && typeof err === 'object' && 'message' in err && typeof err.message === 'string') {
				setErrMessage(err.message);
			}
		}
	}, [data, dispatch, type]);

	const results = useMemo(() => {
		if (!items) return [];
		return obj.toArr(items.results);
	}, [items]);

	useEffect(() => {
		if (results) OnResultCb(results);

	}, [results]);

	return (
		<>
			<InputGroup display={'flex'} alignItems={'baseline'} {...props}>
				<Input
					borderColor={colorMode == 'dark' ? 'whiteAlpha.400' : 'blackAlpha.700'}
					rounded={'3xl'}
					onFocus={setVisited.on}
					ref={inputRef}
					onChange={handleChange}
				/>
				{/* {errMesage !== "" ? errMesage : null} */}
				<InputLeftElement
					// out={"2px solid"}
					position={'absolute'}
					pointerEvents='none'>
					<Search2Icon color={colorMode == 'dark' ? 'whiteAlpha.400' : 'blackAlpha.700'} />
					<Box
						h={'24px'}
						background={'whiteAlpha.400'}
						position={'relative'}
						left={'6px'}
						width={'2px'}></Box>
				</InputLeftElement>
			</InputGroup>
		</>
	);
};
