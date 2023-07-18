package utils

import (
	"log"
	"net"
)

func GetOutboundIPAddress() string {
	ip := getOutboundIP()
	if ip != nil {
		return ip.String()
	} else {
		log.Println("[ERROR] It seems the local network is not working. Please check the net connection!")
		return "localhost"
	}
}

// Get preferred outbound ip of this machine
func getOutboundIP() net.IP {
	conn, err := net.Dial("udp", "8.8.8.8:80")
	if err != nil {
		log.Println(err)
		return nil
	}
	defer conn.Close()

	localAddr := conn.LocalAddr().(*net.UDPAddr)

	return localAddr.IP
}
