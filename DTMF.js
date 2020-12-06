const FREQ_DTMF = { // 14 patterns
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
};

/*
信号送出時間 50ms以上 (0.05sec)
ミニマムポーズ 隣接する信号間の休止時間の最小値。30ms以上 (0.03sec)
周期 信号送出時間とミニマムポーズの和。120ms以上
*/

let audio;
let gain;
let onodes = [];
const startDTMF = async (dtmf, len = .2) => {
	/*
	if (audio) {
		await audio.close()
	}
	*/
	if (!audio) {
		const AudioContext = window.AudioContext || window.webkitAudioContext;
		audio = new AudioContext();

		gain = audio.createGain();
		gain.connect(audio.destination);
		gain.gain.value = 0.2;
	}
	for (const o of onodes) {
		o.disconnect();
	}
	onodes = [];
	for (let i = 0; i < dtmf.length; i++) {
		const c = dtmf.charAt(i);
		const tone = FREQ_DTMF[c];
		if (tone) {
			const start = audio.currentTime;
			for (const t of tone) {
				const node = audio.createOscillator();
				node.frequency.value = t;
				node.connect(gain);
				node.start(start + i * len);
				node.stop(start + (i + .5) * len);
				onodes.push(node);
			}
		}
	}
};

class DTMF {
	static play(code, len) {
		startDTMF(code, len);
	}
	static decode(freq1, freq2) {
		let diff = 60;
		let num = null;
		if (freq1 > freq2) {
			const tmp = freq1;
			freq1 = freq2;
			freq2 = tmp;
		}
		for (const val in FREQ_DTMF) {
			const fr = FREQ_DTMF[val];
			const n = Math.abs(fr[0] - freq1) + Math.abs(fr[1] - freq2);
			if (n < diff) {
				diff = n;
				num = val;
			}
		}
		return num;
	}
}

export { DTMF };
