import { toHankaku } from "./kana.js";

const DTMF = {
	"1": [ 697, 1209 ],
	"2": [ 697, 1336 ],
	"3": [ 697, 1477 ],
	"A": [ 697, 1633 ],
	"4": [ 770, 1209 ],
	"5": [ 770, 1336 ],
	"6": [ 770, 1477 ],
	"B": [ 770, 1633 ],
	"7": [ 852, 1209 ],
	"8": [ 852, 1336 ],
	"9": [ 852, 1477 ],
	"C": [ 852, 1633 ],
	"*": [ 941, 1209 ],
	"0": [ 941, 1336 ],
	"#": [ 941, 1477 ],
	"D": [ 941, 1633 ]
}

const POKEBELL = [
	"ｱｲｳｴｵABCDE",
	"ｶｷｸｹｵFGHIJ",
	"ｻｼｽｾｿKLMNO",
	"ﾀﾁﾂﾃﾄPQRST",
	"ﾅﾆﾇﾈﾉUVWXY",
	"ﾊﾋﾌﾍﾎZ?!-/",
	"ﾏﾐﾑﾒﾓ¥& ☎ ",
	"ﾔ(ﾕ)ﾖ*# ♥ ",
	"ﾗﾘﾙﾚﾛ12345",
	"ﾜｦﾝﾞﾟ67890"
]
const toPokebell = function(c) {
	for (let i = 0; i < POKEBELL.length; i++) {
		const row = POKEBELL[i]
		const n = row.indexOf(c)
		if (n >= 0)
			return "" + ((i + 1) % 10) + "" + ((n + 1) % 10)
	}
	return ""
}

// console.log(toHankaku("あいうえお"))
const getPokebellCode = function(s) {
	if (toHankaku) {
		s = toHankaku(s)
	}
	console.log(s)
	const res = []
	for (const c of s) {
		res.push(toPokebell(c))
	}
	return res.join("")
}

class Pokebell {
	static getCode(s) {
		return getPokebellCode(s);
	}
};

export { Pokebell };
