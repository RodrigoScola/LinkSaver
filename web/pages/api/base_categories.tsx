import path from 'path';

import { promises as fs } from 'fs';

export default async function handler(_: any, res: any) {
	const jsonDirectory = path.join(process.cwd(), 'base_data');
	//Read the json data file data.json
	const fileContents = await fs.readFile(jsonDirectory + '/index.json', 'utf-8');
	//Return the content of the data file in json format
	res.status(200).json(fileContents);
}
