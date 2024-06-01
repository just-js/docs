package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"io"
	"bytes"
)

func lineCounter(r io.Reader) (int, error) {
    buf := make([]byte, 2*1024*1024)
    count := 0
    lineSep := []byte{'\n'}
    for {
        c, err := r.Read(buf)
        count += bytes.Count(buf[:c], lineSep)
        switch {
        case err == io.EOF:
            return count, nil
        case err != nil:
            return count, err
        }
    }
}

// GOAMD64=v2 go build count.go

func main() {
	filename := "test.log"
	file, err := os.Open(filename)
	if err != nil {
		log.Fatalf("Error counting lines: %v", err)
	}
	lineCount, err := lineCounter(bufio.NewReader(file))
	if err != nil {
		log.Fatalf("Error counting lines: %v", err)
	}
	fmt.Printf("The file has %d lines\n", lineCount)
}
