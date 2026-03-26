import path from 'path';
import fs from 'fs';

export const getPath = (folder: string) => {
    // When running in dev (tsx), __dirname is .../server/utils
    // When running in prod (dist/server.cjs), __dirname is .../server/dist (shimmed) or the file location

    // We want to find the project root relative to this file.
    // In dev: ../../ (up from utils, up from server) -> no, wait. server root is ../
    // server/utils/paths.ts -> server/

    // In prod: dist/server.cjs (bundled). The shimmed __dirname usually points to dist/.
    // So we need to go up one level to find 'public' or 'views' IF they are copied to dist/.. (project root)
    // OR if we copy them INTO dist, we look in current.

    // STRATEGY: Look in multiple places.
    const candidates = [
        path.join(__dirname, '..', folder),       // Dev: utils/.. -> server/folder
        path.join(__dirname, '..', '..', folder), // Some nested structures
        path.join(process.cwd(), folder),         // Fallback to CWD
        path.join(__dirname, folder)              // If copied next to the script
    ];

    for (const p of candidates) {
        if (fs.existsSync(p)) return p;
    }

    // If not found, default to a reasonable guess (better than crashing usually, but might crash later)
    return path.join(process.cwd(), folder);
};
