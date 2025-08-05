# Backend

This is the backend package for carp.

Backend uses `go`.

- `task` for task management. See `Taskfile.yml`
- `air` for dev server. see `.air.toml`


## Folder

- `/backend/proto`: the protobuf definition for types. This generates the definition for backend (`/backend/src/packages/types/proto/`) and frontend (`/frontend/src/types/proto`)
- `/backend/src/main`: contains the entrance file `main.go`. 
- `/backend/src/packages`: the modules 
- `/backend/scripts`: the script for dev. 
