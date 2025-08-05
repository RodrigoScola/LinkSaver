import { Box, Input, InputGroupProps, useColorMode } from '@chakra-ui/react';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { InputGroup, InputLeftElement } from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons';
import { useSearch } from '../../context/SearchContext';
import { useQuery } from '@tanstack/react-query';
import { getData } from '../../class/serverBridge';
import { query } from 'express';

const sliceName = 'categorySearch';

let timer: NodeJS.Timeout | null = null;

//TODO: TEST THIS OUT

export const SearchInput = ({
	type = 'categories',
	onResult = () => {},
	name = '',
	...props
}: {
	type?: string;
	name: string;
	onResult: (result: any) => any;
} & InputGroupProps) => {
	const { colorMode } = useColorMode();

	const [searchTerm, setSearchTerm] = useState('');

	function getUrl() {
		const query = new URLSearchParams();

		//TODO: FIX THIS BECAUSE THIS DOESNT WORK
		query.set('s', searchTerm);

		return `${type}?${query.toString()}`;
	}

	const searchContext = useQuery({
		queryKey: [sliceName],
		queryFn: () => getData.get(getUrl()),
		refetchOnWindowFocus: false,
		enabled: false,
	});

	const searchInput = useRef<HTMLInputElement | null>(null);
	const sc = useSearch();

	const updateSearchTerm = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		if (!searchInput.current) {
			console.error(`could not locate search input`);
			return;
		}

		sc.UpdateSearchData({
			name: sliceName,
			term: searchInput.current.value,
			results: sc.getSearch(sliceName).results,
		});

		if (timer) {
			clearTimeout(timer);
		}

		timer = setTimeout(() => setSearchTerm(searchInput.current?.value || ''), 500);
	}, []);

	useEffect(() => {}, [searchTerm, type]);

	useEffect(() => {
		try {
			if (!searchContext.data) {
				return;
			}
			if (!Array.isArray(searchContext.data)) {
				return;
			}

			sc.UpdateSearchData({
				name: sliceName,
				results: searchContext.data,
				term: sc.getSearch(sliceName).term,
			});

			onResult(searchContext.data);
		} catch (err) {
			console.error(err);
		}
	}, [searchContext.data]);

	return (
		<>
			<InputGroup display={'flex'} alignItems={'baseline'} {...props}>
				<Input
					borderColor={colorMode == 'dark' ? 'whiteAlpha.400' : 'blackAlpha.700'}
					rounded={'3xl'}
					ref={searchInput}
					name={name}
					onChange={updateSearchTerm}
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
