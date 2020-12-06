class FFT {
  constructor() {
    if (!navigator.mediaDevices.getUserMedia) {
      alert('getUserMedia not supported')
      return
    }
  }
  async init(fftsize) {
    const audio = new (window.AudioContext || window.webkitAudioContext)()
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const source = audio.createMediaStreamSource(stream)
    const analyser = audio.createAnalyser() // FFT
    analyser.minDecibels = -90
    analyser.maxDecibels = -10
    analyser.smoothingTimeConstant = 0 // 0-.999 0.85 ふわっとなる
    analyser.fftSize = 1 << fftsize // min:32==1<<5 max:32768==1<<15
    source.connect(analyser)
    this.analyser = analyser

    console.log("audio.sampleRate: ", audio.sampleRate); // 44100, 48kHz, 96kHzなど、デバイスの設定による
    this.resolution = audio.sampleRate / analyser.fftSize;
    console.log("resolution: ", this.resolution + "Hz"); // 分解能

    const buflen = analyser.frequencyBinCount;
    this.buf = new Uint8Array(buflen);
  }
  getFreqs() {
    this.analyser.getByteFrequencyData(this.buf)
    return this.buf
  }
  getScale() {
    this.analyser.getByteFrequencyData(this.buf)
    const formant = this.getFormant(this.buf)
    if (formant.length == 0)
      return null
    /*
    let s = "" + formant.length + ": "
    for (let i = 0; i < Math.min(formant.length, 5); i++) {
      const f = formant[i]
//      s += f[0] + "(" + f[1] + ") "
      s += f[0] + " "
    }
    if (this.bks != s) {
      //console.log(s)
      this.bks = s
    }
    */
    return this.getScaleFromFreq(formant[0][0])
  }
  getFormant(buf) {
    const thr = 50
    const formant = []

    let state = 0 // 0:<thr, 1:increse, 2:decrese (push formant when 1 -> 2)
    let bkn = 0
    for (let i = 0; i < buf.length; i++) {
      const n = buf[i]
      if (state == 0) {
        if (n >= thr) {
          state = 1
        }
      } else if (state == 1) {
        if (n < bkn) {
          formant.push([i - 1, bkn])
          if (n < thr)
            state = 0
          else
            state = 2
        }
      } else if (state == 2) {
        if (n > bkn) {
          state = 1
        } else if (n < thr)
          state = 0
      }
      bkn = n
    }
    formant.sort((a, b) => b[1] - a[1])
    for (let i = 0; i < formant.length; i++) {
      formant[i][0] *= this.resolution
    }
    return formant
  }
  getScaleFromFreq(freq, detail) {
    let d = 12 * Math.log2(freq / 440) % 12
    if (d <= -0.5)
      d += 12
    const d1 = Math.round(d)
    const d2 = d - d1
    //console.log(freq, d2, d1, d2)
    let scale = [ "ラ", "ラ#", "シ", "ド", "ド#", "レ", "レ#", "ミ", "ファ", "ファ#", "ソ", "ソ#", "ラ" ][d1]
    if (detail)
      scale += " " + (d2 >= 0 ? "+" : "") + d2.toFixed(1)
    return scale
  }
}

export { FFT };
