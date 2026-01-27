/* cloud_api.js - Wrapped to avoid global namespace pollution */
(function () {
    const APP_ID = "sankeymatic";
    const API_BASE = window.datavizApiUrl || "https://api.dataviz.jp";

    class CloudApi {
        static async getAuthToken() {
            if (!window.datavizSupabase) throw new Error("Supabase client not initialized");
            const { data: { session } } = await window.datavizSupabase.auth.getSession();
            if (!session?.access_token) throw new Error("Not authenticated");
            return session.access_token;
        }

        static blobToBase64(blob) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        }

        static async saveProject(name, data, thumbnailInput) {
            const token = await this.getAuthToken();
            let thumbnail = null;

            if (thumbnailInput) {
                if (typeof thumbnailInput === 'string') {
                    thumbnail = thumbnailInput;
                } else {
                    thumbnail = await this.blobToBase64(thumbnailInput);
                }
            }

            const payload = {
                name: name,
                app_name: APP_ID,
                data: data,
                thumbnail: thumbnail
            };

            const response = await fetch(`${API_BASE}/api/projects`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`保存失敗: ${response.status} ${errText}`);
            }

            return await response.json();
        }

        static async loadProject(id) {
            const token = await this.getAuthToken();
            const response = await fetch(`${API_BASE}/api/projects/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("読込失敗");
            return await response.json();
        }

        static async listProjects() {
            const token = await this.getAuthToken();
            const response = await fetch(`${API_BASE}/api/projects?app=${APP_ID}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error("一覧取得失敗: " + errText);
            }
            const data = await response.json();
            return data.projects || [];
        }

        static async deleteProject(id) {
            const token = await this.getAuthToken();
            const response = await fetch(`${API_BASE}/api/projects/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("削除失敗");
        }

        static async getProjectThumbnail(projectId) {
            const token = await this.getAuthToken();
            const response = await fetch(`${API_BASE}/api/projects/${projectId}/thumbnail`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 404) return null;
            if (!response.ok) throw new Error("Thumbnail fetch failed");

            return await response.blob();
        }
    }

    // Global UI handling for Cloud Operations
    window.CloudUI = {
        // --- TOAST UI ---
        showToast: (message, type = 'info') => {
            // Use Tool Header Toast if available
            if (window.toolHeaderInstance && typeof window.toolHeaderInstance.showMessage === 'function') {
                window.toolHeaderInstance.showMessage(message, type, 5000);
                return;
            }

            let toastContainer = document.getElementById('cloud-toast-container');
            if (!toastContainer) {
                toastContainer = document.createElement('div');
                toastContainer.id = 'cloud-toast-container';
                toastContainer.style.cssText = "position: fixed; bottom: 20px; right: 20px; z-index: 10000; display: flex; flex-direction: column; gap: 10px; pointer-events: none;";
                document.body.appendChild(toastContainer);
            }

            const toast = document.createElement('div');
            toast.textContent = message;
            const bg = type === 'success' ? '#4caf50' : (type === 'error' ? '#f44336' : '#333');
            toast.style.cssText = `
                background: ${bg};
                color: white;
                padding: 12px 24px;
                border-radius: 4px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                font-size: 14px;
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.3s, transform 0.3s;
                min-width: 200px;
                text-align: center;
                pointer-events: auto;
            `;

            toastContainer.appendChild(toast);

            // Animate in
            requestAnimationFrame(() => {
                toast.style.opacity = '1';
                toast.style.transform = 'translateY(0)';
            });

            // Remove after 3 seconds
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    toast.remove();
                    if (toastContainer.childNodes.length === 0) {
                        toastContainer.remove();
                    }
                }, 300);
            }, 3000);
        },

        // --- SAVE UI ---
        openSaveModal: (currentData, thumbnailInput) => {
            window.CloudUI.pendingSaveData = currentData;
            window.CloudUI.pendingThumbnail = thumbnailInput;

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
                        await CloudApi.saveProject(name, window.CloudUI.pendingSaveData, window.CloudUI.pendingThumbnail);
                        window.CloudUI.showToast("保存しました。", "success");
                        modal.close();
                    } catch (e) {
                        window.CloudUI.showToast(`保存エラー: ${e.message}`, "error");
                    } finally {
                        btn.disabled = false;
                        btn.textContent = originalText;
                    }
                };
            }

            // Preview Thumbnail
            const previewDiv = modal.querySelector('#cloud-save-preview');
            const previewImg = modal.querySelector('#cloud-save-thumb-preview');

            if (thumbnailInput) {
                if (typeof thumbnailInput === 'string') {
                    // Assume Data URL
                    previewImg.src = thumbnailInput;
                } else {
                    // Assume Blob/File
                    const url = URL.createObjectURL(thumbnailInput);
                    previewImg.src = url;
                }
                previewDiv.style.display = 'block';
            } else {
                previewDiv.style.display = 'none';
            }

            // Reset input
            const nameInput = modal.querySelector('#cloud-project-name');
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;

            if (nameInput) nameInput.value = `${formattedDate}`;

            modal.showModal();
        },

        // --- LOAD UI ---
        openLoadModal: async (onLoadCallback) => {
            let modal = document.getElementById('cloud-load-modal');
            if (!modal) {
                modal = document.createElement('dialog');
                modal.id = 'cloud-load-modal';
                modal.className = 'cloud-modal';
                modal.style.maxWidth = "800px";
                modal.style.width = "90%";
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

                // Render Grid
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

                // Load Thumbnails
                projects.forEach(async (p) => {
                    if (!p.thumbnail_path) {
                        const loadingEl = document.getElementById(`loading-${p.id}`);
                        if (loadingEl) loadingEl.textContent = 'No Image';
                        return;
                    }

                    try {
                        const blob = await CloudApi.getProjectThumbnail(p.id);

                        const imgEl = document.getElementById(`thumb-${p.id}`);
                        const loadingEl = document.getElementById(`loading-${p.id}`);

                        if (blob) {
                            const url = URL.createObjectURL(blob);
                            if (imgEl && loadingEl) {
                                imgEl.src = url;
                                imgEl.style.display = 'block';
                                loadingEl.style.display = 'none';
                            }
                        } else {
                            if (loadingEl) loadingEl.textContent = 'No Image';
                        }
                    } catch (err) {
                        console.warn(`Thumbnail load failed ${p.id}`, err);
                        const loadingEl = document.getElementById(`loading-${p.id}`);
                        if (loadingEl) loadingEl.textContent = 'Err';
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

                            // Handling data structure flexibility
                            let actualData = projectData;
                            if (projectData.data && !projectData.flows && !projectData.settings) {
                                actualData = projectData.data;
                            }
                            if (typeof actualData === 'string' && actualData.trim().startsWith('{')) {
                                try { actualData = JSON.parse(actualData); } catch (e) { }
                            }

                            modal.close();
                            if (onLoadCallback) onLoadCallback(actualData);
                        } catch (err) {
                            window.CloudUI.showToast("読み込みエラー: " + err.message, "error");
                            btn.disabled = false;
                            btn.textContent = originalText;
                        }
                    } else if (e.target.classList.contains('delete-btn')) {
                        if (!confirm("本当に削除しますか？")) return;
                        const id = e.target.dataset.id;
                        try {
                            await CloudApi.deleteProject(id);
                            window.CloudUI.openLoadModal(onLoadCallback);
                        } catch (err) {
                            window.CloudUI.showToast("削除エラー: " + err.message, "error");
                        }
                    }
                };

            } catch (e) {
                listContainer.innerHTML = `<p style="color: red;">一覧取得エラー: ${e.message}</p>`;
            }
        }
    };
    // Expose CloudApi for auto-loading from sankeymatic.js
    window.CloudApi = CloudApi;
})();
