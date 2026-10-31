// Package routes defines Carp's URL prefixes. Each API endpoint base begins
// with APIPrefix and ends in /, so Go can redirect a missing trailing slash.
package routes

const (
	// APIPrefix groups all backend routes and is the one prefix Vite proxies.
	APIPrefix = "/api/"
	// ShareAPIPrefix returns a directory listing or the bytes of a shared file.
	ShareAPIPrefix = APIPrefix + "share/"
	// SharePagePrefix serves the React page for a path in the shared folder.
	SharePagePrefix = "/~/"
	// InfoAPIPrefix returns details about the running share server.
	InfoAPIPrefix = APIPrefix + "info/"
	// QRAPIPrefix generates a QR image for a URL passed in the url query parameter.
	QRAPIPrefix = APIPrefix + "qr/"
)
