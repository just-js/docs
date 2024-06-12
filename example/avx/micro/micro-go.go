package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strconv"
	"bytes"
	"time"
	"github.com/prometheus/procfs"
	"gopkg.ilharper.com/x/isatty"
)

func read_file (filename string, buf []byte) (int, error) {
	file, err := os.Open(filename)
	if err != nil {
		return 0, err
	}
	r := bufio.NewReader(file)
	c, err := r.Read(buf)
	file.Close()
	return c, nil
}

func to_size_string (size uint64) (string) {
	if (size < 1000) {
		return fmt.Sprintf("%12d Bps", size)
	}
	if (size < 1000 * 1000) {
		return fmt.Sprintf("% 7.2f KBps", float64(size) / 1000)
	}
	if (size < 1000 * 1000 * 1000) {
		return fmt.Sprintf("% 7.2f MBps", float64(size) / (1000 * 1000))
	}
	return fmt.Sprintf("% 7.2f GBps", float64(size) / (1000 * 1000 * 1000))
}

func main() {
	AD := "\033[0;0m"
	AR := "\033[0;31m"
	AG := "\033[0;32m"
	AY := "\033[0;33m"
	AM := "\033[0;35m"
	if (!isatty.Isatty(os.Stdout.Fd())) {
		AD = ""
		AR = ""
		AG = ""
		AY = ""
		AM = ""
	}
	runs := 10000
	if (len(os.Args) > 1) {
		v, err := strconv.Atoi(os.Args[1])
		if err != nil {
			log.Fatalf("Error: %v", err)
		}
		runs = v
	}
	filename := "/dev/shm/test.log"
	if (len(os.Args) > 2) {
		filename = os.Args[2]
	}
	buf := make([]byte, 2*1024*1024)
	size, err := read_file(filename, buf)
	if err != nil {
		log.Fatalf("Error: %v", err)
	}
	lineSep := []byte{'\n'}

	p, err := procfs.Self()
	if err != nil {
		log.Fatalf("could not get process: %s", err)
	}	
	expected := bytes.Count(buf[:size], lineSep)
	fmt.Printf("bytes %d\n", size)
	fmt.Printf("lines %d\n", expected)
	last_usr := uint(0)
	last_sys := uint(0)
	seconds := float64(0)

	for seconds < 1.0 {
		runs *= 2
		start := time.Now()
		for i := 1; i < runs; i++ {
			if(bytes.Count(buf[:size], lineSep) != expected) {
				log.Fatalf("Error: %v", err)
			}
		}
		elapsed := time.Since(start)
		seconds = elapsed.Seconds()
	}
	stat, err := p.Stat()
	if err != nil {
		log.Fatalf("could not get process stat: %s", err)
	}
	last_usr = stat.UTime
	last_sys = stat.STime
	for j := 1; j < 10; j++ {
		start := time.Now()
		for i := 1; i < runs; i++ {
			if(bytes.Count(buf[:size], lineSep) != expected) {
				log.Fatalf("Error: %v", err)
			}
		}
		elapsed := time.Since(start)
		stat, err := p.Stat()
		if err != nil {
			log.Fatalf("could not get process stat: %s", err)
		}
		rss := uint32(float32(stat.ResidentMemory()) / 1024)
		seconds = elapsed.Seconds()
		usr_pc := float64(stat.UTime - last_usr) / seconds
		sys_pc := float64(stat.STime - last_sys) / seconds
		tot_pc := usr_pc + sys_pc
		last_usr = stat.UTime
		last_sys = stat.STime
		rate := uint32(float64(runs) / seconds)
		rate_pc := uint32(float64(rate) / (tot_pc / 100.0))
		ns_iter := float64(elapsed.Nanoseconds()) / float64(runs)
		fmt.Printf("%s%-20s %stime%s %8d %srate%s %10d %srate/core%s %10d %sns/iter%s %12.2f %srss%s %8d %susr%s %6.2f %ssys%s %6.2f %stot%s %6.2f %sthru%s %s\n", AM, "bytes.Count", AY, AD, elapsed.Milliseconds(), AY, AD, rate, AM, AD, rate_pc, AG, AD, ns_iter, AG, AD, rss, AG, AD, usr_pc, AR, AD, sys_pc, AY, AD, tot_pc, AG, AD, to_size_string(uint64(size) * uint64(rate_pc)))
	}
}
