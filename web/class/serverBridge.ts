import axiosBase, { AxiosRequestConfig } from 'axios';
import formatter from '../utils/formatting/formatting';
import { type } from 'os';

const url =
	process.env.NODE_ENV == 'development'
		? 'http://localhost:3001'
		: 'https://linksaver-server-lrtx.onrender.com';

const axios = axiosBase.create({
	baseURL: url,
});

class GetData {
	baseURL = url;
	ax = axios;

	async delete(url: string) {
		return (await this.ax.delete(url)).data;
	}
	async post(url: string, content: object) {
		try {
			return (await this.ax.post(url, content)).data;
		} catch (err) {
			console.error(err);
			return {};
		}
	}
	async update<T>(url: string, content: object): Promise<T> {
		return (await this.ax.put(url, content)).data;
	}

	async get(url: string, options?: AxiosRequestConfig<any> | undefined) {
		const data = await (await this.ax.get(url, options)).data;
		return data;
	}
}

export const getData = new GetData();

export default axios;
