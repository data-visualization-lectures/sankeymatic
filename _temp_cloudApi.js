const APP_NAME = 'rawgraphs';
const BUCKET_NAME = 'user_projects';

// Helper to get configuration and session purely for Raw Fetch
async function getSupabaseConfig() {
    // 1. Get the Global Instance (managed by dataviz-auth-client.js)
    const globalAuthClient = window.supabase;
    if (!globalAuthClient || !globalAuthClient.auth) {
        throw new Error("認証クライアントが読み込まれていません。ページをリロードしてください。");
    }

    // 2. Verify Session
    const { data: { session }, error: sessionError } = await globalAuthClient.auth.getSession();
    if (sessionError || !session || !session.user) {
        console.warn("Session check failed:", sessionError);
        throw new Error("ログインしてください。");
    }

    // 3. Prepare Configuration
    const DEFAULT_URL = "https://vebhoeiltxspsurqoxvl.supabase.co";
    // Need explicit key for query param usage
    const globalKey = globalAuthClient.supabaseKey;
    // Updated to the correct key verified by direct browser access
    const DEFAULT_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlYmhvZWlsdHhzcHN1cnFveHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNTY4MjMsImV4cCI6MjA4MDYzMjgyM30.5uf-D07Hb0JxL39X9yQ20P-5gFc1CRMdKWhDySrNZ0E";

    const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || DEFAULT_URL;
    const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || globalKey || DEFAULT_KEY;

    if (!supabaseKey) {
        throw new Error("Supabase API Key is missing.");
    }

    return {
        supabaseUrl,
        supabaseKey: supabaseKey.trim(),
        accessToken: session.access_token,
        user: session.user
    };
}

export async function getProjects() {
    console.log("Fetching projects via Raw Fetch...");
    try {
        const { supabaseUrl, supabaseKey } = await getSupabaseConfig();

        // Construct URL with API Key in query param to bypass header stripping
        const endpoint = `${supabaseUrl}/rest/v1/projects?select=id,name,created_at,updated_at,thumbnail_path&app_name=eq.${APP_NAME}&order=updated_at.desc&apikey=${supabaseKey}`;

        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                // Rely ONLY on query param for DB access (RLS disabled)
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error("Supabase getProjects error:", errorBody);
            throw new Error(`Server responded with ${response.status}: ${errorBody}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("getProjects exception:", error);
        throw error;
    }
}

export async function saveProject(projectData, projectName, thumbnailBlob = null) {
    console.log("Saving project via Raw Fetch (Storage + DB)...");
    try {
        const { supabaseUrl, supabaseKey, accessToken, user } = await getSupabaseConfig();

        // Use native crypto.randomUUID()
        const id = projectData.id || crypto.randomUUID();
        const now = new Date().toISOString();
        const jsonFilePath = `${user.id}/${id}.json`;
        const thumbFilePath = `${user.id}/${id}.png`;

        // 1. Upload JSON to Storage
        console.log("Uploading JSON to Storage:", jsonFilePath);
        const jsonStorageEndpoint = `${supabaseUrl}/storage/v1/object/${BUCKET_NAME}/${jsonFilePath}?apikey=${supabaseKey}`;

        const jsonResponse = await fetch(jsonStorageEndpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'x-upsert': 'true' // Allow overwriting
            },
            body: JSON.stringify(projectData)
        });

        if (!jsonResponse.ok) {
            const errorBody = await jsonResponse.text();
            console.error("Supabase Storage JSON upload error:", errorBody);
            throw new Error(`Storage upload failed with ${jsonResponse.status}: ${errorBody}`);
        }

        // 2. Upload Thumbnail to Storage (if provided)
        if (thumbnailBlob) {
            console.log("Uploading Thumbnail to Storage:", thumbFilePath);
            const thumbStorageEndpoint = `${supabaseUrl}/storage/v1/object/${BUCKET_NAME}/${thumbFilePath}?apikey=${supabaseKey}`;
            const thumbResponse = await fetch(thumbStorageEndpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'image/png', // Explicitly set for PNG
                    'x-upsert': 'true'
                },
                body: thumbnailBlob
            });

            if (!thumbResponse.ok) {
                // Non-fatal error for thumbnail? Or fatal? Let's make it warnings for now to avoid blocking Save if image fails.
                const errorBody = await thumbResponse.text();
                console.warn("Supabase Storage Thumbnail upload error:", errorBody);
                // proceeding...
            }
        }

        // 3. Insert/Update Metadata in DB
        console.log("Saving Metadata to DB...");
        const payload = {
            id,
            user_id: user.id,
            name: projectName || projectData.name || 'Untitled Project', // Use provided name
            storage_path: jsonFilePath, // Storing path instead of data
            thumbnail_path: thumbnailBlob ? thumbFilePath : null,
            app_name: APP_NAME,
            created_at: projectData.created_at || now,
            updated_at: now
        };

        const dbEndpoint = `${supabaseUrl}/rest/v1/projects?apikey=${supabaseKey}`;

        const dbResponse = await fetch(dbEndpoint, {
            method: 'POST',
            headers: {
                // DB access via Anon Key (RLS disabled)
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates,return=representation'
            },
            body: JSON.stringify(payload)
        });

        if (!dbResponse.ok) {
            const errorBody = await dbResponse.text();
            console.error("Supabase DB save error:", errorBody);
            throw new Error(`DB save failed with ${dbResponse.status}: ${errorBody}`);
        }

        const data = await dbResponse.json();
        return data && data.length > 0 ? data[0] : null;

    } catch (error) {
        console.error("saveProject exception:", error);
        throw error;
    }
}

export async function updateProject(projectId, projectData, projectName, thumbnailBlob) {
    return saveProject({ ...projectData, id: projectId }, projectName, thumbnailBlob);
}

export async function deleteProject(projectId) {
    console.log("Deleting project via Raw Fetch (DB + Storage)...", projectId);
    try {
        const { supabaseUrl, supabaseKey, accessToken } = await getSupabaseConfig();

        // 1. Get storage_path and thumbnail_path from DB first
        const fetchEndpoint = `${supabaseUrl}/rest/v1/projects?select=storage_path,thumbnail_path&id=eq.${projectId}&apikey=${supabaseKey}`;
        const fetchRes = await fetch(fetchEndpoint, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        let storagePath = null;
        let thumbnailPath = null;
        if (fetchRes.ok) {
            const rows = await fetchRes.json();
            if (rows.length > 0) {
                storagePath = rows[0].storage_path;
                thumbnailPath = rows[0].thumbnail_path;
            }
        }

        // 2. Delete from DB
        const dbEndpoint = `${supabaseUrl}/rest/v1/projects?id=eq.${projectId}&apikey=${supabaseKey}`;
        const dbResponse = await fetch(dbEndpoint, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!dbResponse.ok) {
            throw new Error(`DB delete failed with ${dbResponse.status}`);
        }

        // 3. Delete from Storage 
        const pathsToDelete = [];
        if (storagePath) pathsToDelete.push(storagePath);
        if (thumbnailPath) pathsToDelete.push(thumbnailPath);

        for (const path of pathsToDelete) {
            console.log("Deleting from Storage:", path);
            const storageEndpoint = `${supabaseUrl}/storage/v1/object/${BUCKET_NAME}/${path}?apikey=${supabaseKey}`;

            const storageResponse = await fetch(storageEndpoint, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!storageResponse.ok) {
                console.warn(`Storage delete failed for ${path} (non-fatal):`, await storageResponse.text());
            }
        }

        return true;

    } catch (error) {
        console.error("deleteProject exception:", error);
        throw error;
    }
}

export async function checkUserSession() {
    try {
        const globalAuthClient = window.supabase;
        if (!globalAuthClient) return null;
        const { data } = await globalAuthClient.auth.getSession();
        return data.session?.user || null;
    } catch {
        return null;
    }
}

export async function loadThumbnail(path) {
    console.log("Loading thumbnail...", path);
    if (!path) return null;

    try {
        const { supabaseUrl, supabaseKey, accessToken } = await getSupabaseConfig();
        const storageEndpoint = `${supabaseUrl}/storage/v1/object/${BUCKET_NAME}/${path}?apikey=${supabaseKey}`;

        const storageResponse = await fetch(storageEndpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!storageResponse.ok) {
            // If 404, just return null (no image)
            if (storageResponse.status === 404) return null;
            throw new Error(`Thumbnail load failed: ${storageResponse.status}`);
        }

        const blob = await storageResponse.blob();
        return URL.createObjectURL(blob);

    } catch (err) {
        console.warn("loadThumbnail error:", err);
        return null;
    }
}

export async function loadProject(projectId) {
    console.log("Loading project via Raw Fetch (Storage)...", projectId);
    try {
        const { supabaseUrl, supabaseKey, accessToken } = await getSupabaseConfig();

        // 1. Get storage_path from DB
        const dbEndpoint = `${supabaseUrl}/rest/v1/projects?select=storage_path&id=eq.${projectId}&apikey=${supabaseKey}`;
        const dbResponse = await fetch(dbEndpoint, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!dbResponse.ok) {
            throw new Error(`DB load failed with ${dbResponse.status}`);
        }

        const rows = await dbResponse.json();
        if (!rows.length) throw new Error("Project not found in DB");

        const storagePath = rows[0].storage_path;

        // 2. Download from Storage
        // Use GET /storage/v1/object/{bucket}/{path} for public, but for private we need Auth.
        // For private download, the endpoint is same but with Auth header.

        const storageEndpoint = `${supabaseUrl}/storage/v1/object/${BUCKET_NAME}/${storagePath}?apikey=${supabaseKey}`;

        const storageResponse = await fetch(storageEndpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!storageResponse.ok) {
            const errorBody = await storageResponse.text();
            console.error("Supabase loadProject storage error:", errorBody);
            throw new Error(`Storage download failed with ${storageResponse.status}: ${errorBody}`);
        }

        const json = await storageResponse.json();
        return json;

    } catch (error) {
        console.error("loadProject exception:", error);
        throw error;
    }
}

export async function fetchProjectFromAuthApi(projectId) {
    const endpoint = `https://auth.dataviz.jp/api/projects/${projectId}`;
    console.log(`Fetching project from Auth API: ${endpoint}`);

    const response = await fetch(endpoint, {
        method: 'GET',
        credentials: 'include', // Important: Include cookies for auth
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to load project: ${response.status}`);
    }
    return await response.json();
}

