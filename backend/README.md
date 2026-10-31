# Backend

This is the backend package for carp.

Backend uses Go.

- From the repository root, `task start-dev DIR="/path/to/folder"` starts Air, Vite, and protobuf watching together.
- From this directory, `go run ./src/main -d "/path/to/folder"` starts only Go. Frontend needs to be run separately
- For a release, build the frontend and pass `-fd ../frontend/dist` for a single server.

## Folder

- `/backend/proto`: the protobuf definition for types. This generates the definition for backend (`/backend/src/packages/types/proto/`) and frontend (`/frontend/src/types/proto`)
- `/backend/src/main`: contains the entrance file `main.go`.
- `/backend/src/packages`: the modules
- `/backend/scripts`: the script for dev.
