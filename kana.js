// hiragana2katakana
const hiragana2katakana = function(s) {
	return s.replace(/[ぁ-ん]/g, function(s) {
		return String.fromCharCode(s.charCodeAt(0) + 0x60)
	})
}
const katakana2hiraana = function(s) {
	return s.replace(/[ア-ン]/g, function(s) {
		return String.fromCharCode(s.charCodeAt(0) - 0x60)
	})
}
// hankaku, half kana
const HALF_KANA_ZEN = "￥。「」、。ヲァィゥェォャュョッーアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン゛゜"
const HALF_KANA = "\¥｡｢｣､｡ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝﾞﾟ" // 	FORI=#A0TO#DF:?CHR$(I);:NEXT
const fromHankakuSJIS = function(c) {
	if (c >= 0xa0 && c <= 0xdf) {
		c = HALF_KANA.charCodeAt(c - 0xa0)
	}
	return c
}
const DAKU_KANA = "ガギグゲゴザジズゼゾダヂヅデドバビブベボ"
const DAKU_HALF_KANA = "ｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾊﾋﾌﾍﾎ"
const HANDAKU_KANA = "パピプペポ"
const HANDAKU_HALF_KANA = "ﾊﾋﾌﾍﾎ"
const getHankakuSJIS = function(c) {
	var n = HALF_KANA.indexOf(c)
	if (n >= 0) {
		return n + 0xa0
	} else {
		var n = c.charCodeAt(0)
		if (n >= '！'.charCodeAt(0) && n <= '～'.charCodeAt(0)) {
			return n - 0xfee0
		}
		if (n == '　'.charCodeAt(0)) {
			return 0x20
		}
		if (n < 0x100)
			return c.charCodeAt(0);
		return 0
	}
}
const toHankakuSJIS = function(c) { // ret array
	c = hiragana2katakana(c)
	var n = DAKU_KANA.indexOf(c)
	if (n >= 0) {
		return [ getHankakuSJIS(DAKU_HALF_KANA.charAt(n)), getHankakuSJIS("ﾞ") ]
	}
	var n = HANDAKU_KANA.indexOf(c)
	if (n >= 0) {
		return [ getHankakuSJIS(HANDAKU_HALF_KANA.charAt(n)), getHankakuSJIS("ﾟ") ]
	}
	var n = HALF_KANA_ZEN.indexOf(c)
	if (n >= 0) {
		return [ getHankakuSJIS(HALF_KANA.charAt(n)) ]
	}
	return [ getHankakuSJIS(c) ]
}
const toHankaku = function(s) {
	s = hiragana2katakana(s)
	const res = []
	for (const c of s) {
		const han = toHankakuSJIS(c)
		for (let c2 of han) {
			if (c2 >= 0xa0) {
				c2 += -0xa0 + 0xff60
			}
			res.push(String.fromCharCode(c2))
		}
	}
	return res.join("")
}

export { toHankaku };
