const { log } = reqlib("/utils/log");

class Infobox {
	constructor(options) {
		if (!options || !options.width) return new Error("You must specify the box width");

		this.width = options.width;
		this.innerWidth = this.width - 2;
		this.padding = options.padding || 2;
		this.paddingHeight =
			typeof options.paddingHeight == "number" ? options.paddingHeight : parseInt(this.padding / 2);
		this.innerContentWidth = this.innerWidth - this.padding * 2;
	}
	begin() {
		log(`╭${"─".repeat(this.innerWidth)}╮`);
		for (let i = 0; i < this.paddingHeight; i++) {
			log(`│${" ".repeat(this.innerWidth)}│`);
		}
		return this;
	}
	add(txt) {
		let padding = " ".repeat(this.padding);
		log(`│${padding}${txt}${" ".repeat(this.innerContentWidth - txt.length)}${padding}│`);
		return this;
	}
	finish() {
		for (let i = 0; i < this.paddingHeight; i++) {
			log(`│${" ".repeat(this.innerWidth)}│`);
		}
		log(`╰${"─".repeat(this.innerWidth)}╯`);
		return this;
	}
}

module.exports = Infobox;
