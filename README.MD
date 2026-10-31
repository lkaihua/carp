# Carp

Turn a folder into a website for browsing photos, videos, music, and other files.

## Requirements

- Go 1.24+, Node.js and npm
- For `task start-dev`: [Task](https://taskfile.dev/) and [Air](https://github.com/air-verse/air)
- For protobuf generation: `protoc`, `protoc-gen-go`, and the frontend npm packages

Install the frontend once with `cd frontend && npm ci`. Install Air with `task install-air`, and ensure the Go binary directory (usually `~/go/bin`) is on your `PATH`.

## Work on a folder

From the repository root:

```sh
task start-dev                              # share example_root
task start-dev DIR="/path/to/my photos"     # share another folder
```

Open **http://localhost:5173/**. This starts Air for Go reloads, Vite for React reloads, and a protobuf watcher. Editing a `.proto` file regenerates both Go and TypeScript types; Air and Vite then pick up the generated changes. Ctrl+C stops all three. This command uses Bash.

You can also start the backend and frontend separately:

```sh
cd backend
go run ./src/main -d "/path/to/my photos"
```

```sh
cd frontend
npm run dev
```

Vite forwards shared folder content, server info, and QR requests to Go on port 8100.

## Run a share server

Build the frontend with `cd frontend && npm run build`, then start Go from `backend`:

```sh
go run ./src/main -d "/path/to/my photos" -fd ../frontend/dist
```

This serves the app and shared files from Go on **http://localhost:8100/**. Other devices on your network can use the printed LAN address or QR code. Pass `-p 8000` to use another port. Only share a folder you intend other users on the network to read; Carp has no authentication.

## Page URLs and shared content

`/~/...` is a React page for browsing a path inside the shared folder. For example, open `/~/photos/` to browse a `photos` folder. This URL returns the app, including on a direct visit or reload when Go serves the built frontend with `-fd`.

`/api/share/...` is the Go route for that same path's content. A directory URL such as `/api/share/photos/` returns a JSON listing; a file URL such as `/api/share/photos/cat.jpg` returns the file bytes. React requests this route while the address bar stays on `/~/photos/`. In development, Vite proxies `/api/` to Go. Previously, `/~/` also served JSON and files; callers of those URLs need to use `/api/share/` now.

`/api/info/` returns server details as JSON. `/api/qr/?url=...` returns a QR code image for the supplied URL. API endpoint bases begin with `/api/` and end in `/`; Go redirects a request missing the final slash. Vite proxies `/api/` to Go in development. These replace the older `/info/` and `/qr/` URLs.

## Checks and shared types

Run `go test ./...` from `backend`. Run `npm test`, `npm run typecheck`, and `npm run build` from `frontend`. To regenerate shared types once, run `task proto` from the repository root. To watch for schema changes without starting the app, run `task --watch proto`.

Air watches and restarts the Go process. Task watches `.proto` files and runs the generator. Vite manages frontend reloads.
