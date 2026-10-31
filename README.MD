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

Vite forwards folder, server info, and QR requests to Go on port 8100.

## Run a share server

Build the frontend with `cd frontend && npm run build`, then start Go from `backend`:

```sh
go run ./src/main -d "/path/to/my photos" -fd ../frontend/dist
```

This serves the app and shared files from Go on **http://localhost:8100/**. Other devices on your network can use the printed LAN address or QR code. Pass `-p 8000` to use another port. Only share a folder you intend other users on the network to read; Carp has no authentication.

## Checks and shared types

Run `go test ./...` from `backend`. Run `npm test`, `npm run typecheck`, and `npm run build` from `frontend`. To regenerate shared types once, run `task proto` from the repository root. To watch for schema changes without starting the app, run `task --watch proto`.

Air watches and restarts the Go process. Task watches `.proto` files and runs the generator. Vite manages frontend reloads.
