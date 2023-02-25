function randomInteger(max) {
	return Math.floor(Math.random() * (max + 1))
}
function randomRgb() {
	let r = randomInteger(255)
	let g = randomInteger(255)
	let b = randomInteger(255)
	return [r, g, b]
}
export class ColorFormat {
	lighten = (color, mag) => {
		color = this.formatColor(color)
		const nmag = Math.abs(mag)

		return this.#newShade(color, nmag)
	}
	darken = (color, mag) => {
		color = this.formatColor(color)
		const nmag = Math.abs(mag)
		return this.#newShade(color, mag * -1)
	}
	colorCode(str) {
		return this.formatColor(str).slice(1)
	}
	formatColor(str = "") {
		if (str.length < 6) {
			str += "0".repeat(6 - str.length)
		}
		let nstr = str.replace(/\W/g, "").slice(0, 6)
		if (nstr.length < 6) {
			nstr += "0".repeat(6 - nstr.length)
		}
		return "#" + nstr
	}

	randomHex() {
		const [r, g, b] = randomRgb()
		let hr = r.toString(16).padStart(2, "0")
		let hg = g.toString(16).padStart(2, "0")
		let hb = b.toString(16).padStart(2, "0")
		return "#" + hr + hg + hb
	}
	get shadows() {
		return {
			right: `inset -3px 3px`,
			left: `inset 3px -3px`,
		}
	}

	#newShade = (hexColor, magnitude) => {
		hexColor = hexColor.replace(`#`, ``)
		if (hexColor.length !== 6) return hexColor
		const decimalColor = parseInt(hexColor, 16)
		let r = (decimalColor >> 16) + magnitude
		r > 255 && (r = 255)
		r < 0 && (r = 0)
		let g = (decimalColor & 0x0000ff) + magnitude
		g > 255 && (g = 255)
		g < 0 && (g = 0)
		let b = ((decimalColor >> 8) & 0x00ff) + magnitude
		b > 255 && (b = 255)
		b < 0 && (b = 0)
		return `#${(g | (b << 8) | (r << 16)).toString(16)}`
	}
}
export const color = new ColorFormat()
