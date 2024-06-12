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
	runs := 40000000
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
		usr_pc := float64(stat.UTime - last_usr) / elapsed.Seconds()
		sys_pc := float64(stat.STime - last_sys) / elapsed.Seconds()
		tot_pc := usr_pc + sys_pc
		last_usr = stat.UTime
		last_sys = stat.STime
		rate := uint32(float64(runs) / elapsed.Seconds())
		rate_pc := uint32(float64(rate) / (tot_pc / 100.0))
		ns_iter := float64(elapsed.Nanoseconds()) / float64(runs)
		fmt.Printf("%s%-20s %stime%s %8d %srate%s %10d %srate/core%s %10d %sns/iter%s %12.2f %srss%s %8d %susr%s %6.2f %ssys%s %6.2f %stot%s %6.2f\n", AM, "bytes.Count", AY, AD, elapsed.Milliseconds(), AY, AD, rate, AM, AD, rate_pc, AG, AD, ns_iter, AG, AD, rss, AG, AD, usr_pc, AR, AD, sys_pc, AY, AD, tot_pc)
	}
}
