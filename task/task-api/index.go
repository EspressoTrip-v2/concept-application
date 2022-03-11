package main

import (
	"log"
	"os"
)

func envCheck() {
	if os.Getenv("RABBIT_URI") == "" {
		log.Fatalln("RABBIT_URI must be defined")
	}
}

func main() {
	envCheck()
	Start()
}
