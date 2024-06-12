import { Loop } from 'lib/loop.js'
import { Timer } from 'lib/timer.js'
import { FileReader } from 'lib/files.js'

const loop = new Loop()

let running = []
let queued = []

let timer

function read_file (file_name, cb) {
  const reader = new FileReader(file_name)
  if (running.length === max_running) {
    queued.push({ reader, cb })
  } else {
    reader.read()
    running.push({ reader, cb })
  }
  if (!timer) timer = new Timer(loop, 1, () => {})
}

const start = Date.now()
const N = 50000
let count = 0
const max_running = 100

for (let i = 0; i < N; i++) {
	read_file('lipsum.txt', data => {
		if (data.length != 1336) throw new Error(`wrong size ${data.length} !== 1336`)
		count++
		if (count == N) {
			const end = Date.now()
			console.log(`time: ${end - start}`)
		}
	})
}

while (loop.poll() > 0) {
  running = running.filter(({ reader, cb }) => {
    const done = reader.poll() === 0
    if (done) {
      cb(reader.slice())
      if (queued.length) {
        const { reader, cb } = queued.shift()
        reader.read()
        running.push({ reader, cb })
      }
      return false
    }
    return true
  })
/*
  queued = queued.filter(({ reader, cb }) => {
    if (running.length < 100) {
      reader.read()
      running.push({ reader, cb })
      return false
    }
    return true
  })
*/
  if (!(running.length + queued.length)) {
    console.log('done')
    timer.close()
  }
  console.log(`${running.length} : ${queued.length}`)
}
