import { ColorFormat } from './ColorFormat';
import { ObjectFormat } from './ObjectFormat';
import { StringFormatting } from './stringFormatting';
import { UrlFormatting } from './UrlFormatting';
import { EmailFormatting } from './EmailFormatting';
class Format {
	color = new ColorFormat();
	obj = new ObjectFormat();
	url = UrlFormatting;
	email = new EmailFormatting();
	str = new StringFormatting();
	/**
	 *
	 *
	 * @param {string} name
	 * @param {{letterCount: number}} [options={ letterCount: 6}]
	 * @returns {string}
	 * @memberof Format
	 */
	initials(name, options = { letterCount: 6 }) {
		if (!name) {
			return '';
		}

		return name.split(' ').map((word) => word.slice(0, options.letterCount))[0];
	}
}

const formatter = new Format();
export default formatter;
