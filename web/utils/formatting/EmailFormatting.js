export class EmailFormatting {
	/**
	 * @description validates if a string is an valid email
	 *
	 * @param {string} email
	 * @returns {boolean}  {boolean}
	 * @memberof EmailFormatting
	 */
	isEmailValid(email) {
		var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		if (email.match(validRegex)) {
			return true;
		}
		return false;
	}
}
export const { isEmailValid } = new EmailFormatting();
