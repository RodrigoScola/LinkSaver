const postsColumns = {
	id: 0,
	createdAt: Date.now(),
	title: '',
	categories: [],
	user_id: '',
	post_url: '',
	status: '',
	likes: '',
	extended: {
		id: 0,
		created_at: Date.now(),
		likes: 0,
		preview: {},
	},
	getColumns: () => {
		return Object.keys(postsColumns).concat(Object.keys(postsColumns.extended));
	},
};

export function getColumns(type: string): string[] {
	switch (type) {
		case 'posts':
			return [''];

		default:
			return [''];
	}
}
