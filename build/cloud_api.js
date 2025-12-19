/* cloud_api.js - Wrapped to avoid global namespace pollution */
(function () {
    const APP_ID = "sankeymatic";
    const BUCKET_NAME = "user_projects";
    const TABLE_NAME = "projects";

    class CloudApi {
        static async saveProject(name, data, thumbnailBlob) {
            if (!window.supabase) throw new Error("Supabase client not initialized");

            const { data: { user } } = await window.supabase.auth.getUser();
            if (!user) {
                alert("ログインしてください。");
                throw new Error("Not authenticated");
            }

            const uuid = crypto.randomUUID();
            const jsonPath = `${user.id}/${uuid}.json`;
            const thumbPath = thumbnailBlob ? `${user.id}/${uuid}.png` : null;
            const now = new Date().toISOString();

            // 1. Upload JSON to Storage
            const { error: jsonError } = await window.supabase.storage
                .from(BUCKET_NAME)
                .upload(jsonPath, JSON.stringify(data), {
                    contentType: 'application/json',
                    upsert: true
                });

            if (jsonError) {
                console.error("JSON Upload Error:", jsonError);
                throw new Error("保存に失敗しました (JSON Upload)");
            }

            // 2. Upload Thumbnail to Storage (if valid)
            if (thumbnailBlob && thumbPath) {
                const { error: thumbError } = await window.supabase.storage
                    .from(BUCKET_NAME)
                    .upload(thumbPath, thumbnailBlob, {
                        contentType: 'image/png',
                        upsert: true
                    });
                if (thumbError) {
                    console.warn("Thumbnail Upload Warning:", thumbError);
                    // Continue even if thumbnail fails
                }
            }

            // 3. Save Metadata to DB
            const { error: dbError } = await window.supabase
                .from(TABLE_NAME)
                .insert({
                    id: uuid,
                    user_id: user.id,
                    name: name,
                    app_name: APP_ID,
                    storage_path: jsonPath,
                    thumbnail_path: thumbPath,
                    // If your DB has JSONB data column, you could populate it, but reference uses storage logic
                    // data: data, 
                    created_at: now,
                    updated_at: now
                });

            if (dbError) {
                // Cleanup storage if DB fails? For now just throw.
                console.error("DB Insert Error:", dbError);
                throw new Error("保存に失敗しました (DB Insert)");
            }
        }

        static async loadProject(id) {
            // 1. Get path from DB
            const { data: row, error: dbError } = await window.supabase
                .from(TABLE_NAME)
                .select('storage_path')
                .eq('id', id)
                .single();

            if (dbError || !row) {
                throw new Error("プロジェクト情報が見つかりません");
            }

            // 2. Download JSON from Storage
            const { data: blob, error: storageError } = await window.supabase.storage
                .from(BUCKET_NAME)
                .download(row.storage_path);

            if (storageError) {
                throw new Error("データの読み込みに失敗しました");
            }

            return JSON.parse(await blob.text());
        }

        static async listProjects() {
            const { data, error } = await window.supabase
                .from(TABLE_NAME)
                .select('*')
                .eq('app_name', APP_ID)
                .order('updated_at', { ascending: false });

            if (error) {
                console.error("List Projects Error:", error);
                throw new Error("一覧の取得に失敗しました");
            }
            return data;
        }

        static async deleteProject(id) {
            // 1. Get paths to delete files later
            const { data: row } = await window.supabase
                .from(TABLE_NAME)
                .select('storage_path, thumbnail_path')
                .eq('id', id)
                .single();

            // 2. Delete from DB
            const { error: dbError } = await window.supabase
                .from(TABLE_NAME)
                .delete()
                .eq('id', id);

            if (dbError) {
                throw new Error("削除に失敗しました");
            }

            // 3. Delete files from Storage (Best effort)
            if (row) {
                const paths = [row.storage_path];
                if (row.thumbnail_path) paths.push(row.thumbnail_path);
                // remove takes an array of file names
                await window.supabase.storage.from(BUCKET_NAME).remove(paths);
            }
        }
    }

    // Global UI handling for Cloud Operations
    window.CloudUI = {
        // --- SAVE UI ---
        openSaveModal: (currentData, thumbnailBlob) => {
            window.CloudUI.pendingSaveData = currentData;
            window.CloudUI.pendingThumbnail = thumbnailBlob;

            let modal = document.getElementById('cloud-save-modal');
            if (!modal) {
                modal = document.createElement('dialog');
                modal.id = 'cloud-save-modal';
                modal.className = 'cloud-modal';
                modal.innerHTML = `
        <form method="dialog">
          <h3>クラウドに保存</h3>
          <p>プロジェクト名を入力してください:</p>
          <input type="text" id="cloud-project-name" required placeholder="Project Name" style="width: 100%; padding: 5px; margin-bottom: 10px;">
          
          <div id="cloud-save-preview" style="margin-bottom: 15px; text-align: center; display: none;">
            <p style="margin:0 0 5px 0; font-size:0.9em; color:#666;">サムネイルプレビュー</p>
            <img id="cloud-save-thumb-preview" style="max-width: 100%; max-height: 150px; border: 1px solid #ccc; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          </div>

          <div style="text-align: right;">
            <button type="button" onclick="document.getElementById('cloud-save-modal').close()">キャンセル</button>
            <button type="button" id="cloud-save-confirm-btn" style="background: #036; color: white;">保存</button>
          </div>
        </form>
      `;
                document.body.appendChild(modal);

                modal.querySelector('#cloud-save-confirm-btn').onclick = async () => {
                    const nameInput = modal.querySelector('#cloud-project-name');
                    const name = nameInput.value.trim();
                    if (!name) {
                        alert("プロジェクト名を入力してください。");
                        return;
                    }

                    const btn = modal.querySelector('#cloud-save-confirm-btn');
                    const originalText = btn.textContent;
                    btn.disabled = true;
                    btn.textContent = "保存中...";

                    try {
                        // Pass thumbnail if available
                        await CloudApi.saveProject(name, window.CloudUI.pendingSaveData, window.CloudUI.pendingThumbnail);
                        alert("保存しました。");
                        modal.close();
                    } catch (e) {
                        alert(`保存エラー: ${e.message}`);
                    } finally {
                        btn.disabled = false;
                        btn.textContent = originalText;
                    }
                };
            }

            // Setup Preview
            const previewDiv = modal.querySelector('#cloud-save-preview');
            const previewImg = modal.querySelector('#cloud-save-thumb-preview');
            if (thumbnailBlob) {
                const url = URL.createObjectURL(thumbnailBlob);
                previewImg.src = url;
                previewDiv.style.display = 'block';
            } else {
                previewDiv.style.display = 'none';
            }

            // Reset input
            const nameInput = modal.querySelector('#cloud-project-name');
            if (nameInput) nameInput.value = `Project ${new Date().toLocaleString()}`;

            modal.showModal();
        },

        // --- LOAD UI ---
        openLoadModal: async (onLoadCallback) => {
            let modal = document.getElementById('cloud-load-modal');
            if (!modal) {
                modal = document.createElement('dialog');
                modal.id = 'cloud-load-modal';
                modal.className = 'cloud-modal';
                modal.style.maxWidth = "800px"; // Wider for grid
                modal.style.width = "90%";
                // Basic structure, content populated dynamically
                modal.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ccc; padding-bottom: 10px; margin-bottom: 10px;">
            <h3 style="margin: 0;">プロジェクトを開く</h3>
            <button type="button" onclick="document.getElementById('cloud-load-modal').close()">閉じる</button>
        </div>
        <div id="cloud-project-list" style="max-height: 500px; overflow-y: auto;">
          <p>読み込み中...</p>
        </div>
      `;
                document.body.appendChild(modal);
            }

            modal.showModal();
            const listContainer = modal.querySelector('#cloud-project-list');
            listContainer.innerHTML = '<p>読み込み中...</p>';

            try {
                const projects = await CloudApi.listProjects();
                if (!projects || projects.length === 0) {
                    listContainer.innerHTML = '<p>保存されたプロジェクトはありません。</p>';
                    return;
                }

                // Render Grid Layout
                let html = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px;">';

                projects.forEach(p => {
                    const dateStr = new Date(p.updated_at).toLocaleString();
                    html += `
          <div class="project-card" style="border: 1px solid #ccc; border-radius: 6px; overflow: hidden; display: flex; flex-direction: column; background: #fff;">
            <div style="position: relative; width: 100%; padding-top: 56.25%; /* 16:9 Aspect Ratio */ background: #f0f0f0;">
                <div style="position: absolute; top:0; left:0; right:0; bottom:0; display: flex; align-items: center; justify-content: center;">
                    <img id="thumb-${p.id}" style="max-width: 100%; max-height: 100%; display: none; object-fit: contain;" alt="${p.name}">
                    <span id="loading-${p.id}" style="color: #999; font-size: 0.8em;">Loading...</span>
                </div>
            </div>
            <div style="padding: 10px; flex-grow: 1; display: flex; flex-direction: column;">
                <div style="font-weight: bold; margin-bottom: 5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${p.name}">${p.name}</div>
                <div style="font-size: 0.8em; color: #666; margin-bottom: 10px;">${dateStr}</div>
                <div style="margin-top: auto; display: flex; justify-content: space-between;">
                    <button class="load-btn" data-id="${p.id}" style="flex: 1; margin-right: 5px;">開く</button>
                    <button class="delete-btn" data-id="${p.id}" style="color: red; padding: 5px 10px;">削除</button>
                </div>
            </div>
          </div>
        `;
                });
                html += '</div>';
                listContainer.innerHTML = html;

                // Start fetching thumbnails
                projects.forEach(async (p) => {
                    if (!p.thumbnail_path) {
                        const loadingEl = document.getElementById(`loading-${p.id}`);
                        if (loadingEl) loadingEl.textContent = 'No Image';
                        return;
                    }

                    try {
                        // Using Supabase client directly to download from Storage
                        if (window.supabase) {
                            const { data, error } = await window.supabase.storage
                                .from('user_projects')
                                .download(p.thumbnail_path);

                            if (error) throw error;

                            const url = URL.createObjectURL(data);
                            const imgEl = document.getElementById(`thumb-${p.id}`);
                            const loadingEl = document.getElementById(`loading-${p.id}`);

                            if (imgEl && loadingEl) {
                                imgEl.src = url;
                                imgEl.style.display = 'block';
                                loadingEl.style.display = 'none';
                            }
                        }
                    } catch (err) {
                        console.warn(`Failed to load thumbnail for ${p.id}`, err);
                        const loadingEl = document.getElementById(`loading-${p.id}`);
                        if (loadingEl) loadingEl.textContent = 'Error';
                    }
                });

                // Event delegation
                listContainer.onclick = async (e) => {
                    if (e.target.classList.contains('load-btn')) {
                        const id = e.target.dataset.id;
                        const btn = e.target;
                        const originalText = btn.textContent;
                        btn.disabled = true;
                        btn.textContent = "取得中...";
                        try {
                            const projectData = await CloudApi.loadProject(id);
                            // Handle potentially wrapped data
                            let actualData = projectData;
                            // The API response depends on how backend handles `data` field in DB + Storage.
                            // Assuming `projectData` is the JSON content of the file or the record.
                            if (projectData.data && !projectData.flows && !projectData.settings) {
                                // Wrapped in 'data' key?
                                actualData = projectData.data;
                            }
                            // Double parsing if it was double stringified
                            if (typeof actualData === 'string' && actualData.trim().startsWith('{')) {
                                try { actualData = JSON.parse(actualData); } catch (e) { }
                            }

                            modal.close();
                            if (onLoadCallback) onLoadCallback(actualData);

                        } catch (err) {
                            alert("読み込みエラー: " + err.message);
                            btn.disabled = false;
                            btn.textContent = originalText;
                        }
                    } else if (e.target.classList.contains('delete-btn')) {
                        if (!confirm("本当に削除しますか？")) return;
                        const id = e.target.dataset.id;
                        try {
                            await CloudApi.deleteProject(id);
                            // Reload list
                            window.CloudUI.openLoadModal(onLoadCallback);
                        } catch (err) {
                            alert("削除エラー: " + err.message);
                        }
                    }
                };

            } catch (e) {
                listContainer.innerHTML = `<p style="color: red;">一覧取得エラー: ${e.message}</p>`;
            }
        }
    };
})();
