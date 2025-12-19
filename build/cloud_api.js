/* cloud_api.js - Wrapped to avoid global namespace pollution */
(function () {
    const API_BASE = "https://api.dataviz.jp";
    const APP_ID = "sankeymatic";

    class CloudApi {
        static async getAuthToken() {
            if (!window.supabase) return null;
            const { data } = await window.supabase.auth.getSession();
            return data?.session?.access_token;
        }

        static async request(endpoint, options = {}) {
            const token = await this.getAuthToken();
            if (!token) {
                alert("ログインしてください。");
                throw new Error("Not authenticated");
            }

            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                ...options.headers,
            };

            const response = await fetch(`${API_BASE}${endpoint}`, {
                ...options,
                headers,
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || `API Error: ${response.status}`);
            }

            return response.json();
        }

        static async listProjects() {
            // API仕様に合わせてクエリパラメータを設定
            return this.request(`/api/projects?app=${APP_ID}`);
        }

        static async loadProject(id) {
            return this.request(`/api/projects/${id}`);
        }

        static async saveProject(name, data) {
            return this.request("/api/projects", {
                method: "POST",
                body: JSON.stringify({
                    name,
                    app_name: APP_ID,
                    data,
                }),
            });
        }

        static async deleteProject(id) {
            return this.request(`/api/projects/${id}`, {
                method: "DELETE",
            });
        }
    }

    // Global UI handling for Cloud Operations
    window.CloudUI = {
        // --- SAVE UI ---
        openSaveModal: (currentData) => {
            // データ収集ロジックは呼び出し元からデータを受け取る形にする
            window.CloudUI.pendingSaveData = currentData;

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
                        await CloudApi.saveProject(name, window.CloudUI.pendingSaveData);
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
                // Basic structure, content populated dynamically
                modal.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ccc; padding-bottom: 10px; margin-bottom: 10px;">
            <h3 style="margin: 0;">プロジェクトを開く</h3>
            <button type="button" onclick="document.getElementById('cloud-load-modal').close()">閉じる</button>
        </div>
        <div id="cloud-project-list" style="max-height: 300px; overflow-y: auto;">
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

                let html = '<table style="width: 100%; border-collapse: collapse;">';
                html += '<tr style="background: #eee; text-align: left;"><th>プロジェクト名</th><th>更新日時</th><th>操作</th></tr>';

                projects.forEach(p => {
                    const dateStr = new Date(p.updated_at).toLocaleString();
                    html += `
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 8px;">${p.name}</td>
            <td style="padding: 8px;">${dateStr}</td>
            <td style="padding: 8px; text-align: right;">
              <button class="load-btn" data-id="${p.id}" style="margin-right: 5px;">開く</button>
              <button class="delete-btn" data-id="${p.id}" style="color: red;">削除</button>
            </td>
          </tr>
        `;
                });
                html += '</table>';
                listContainer.innerHTML = html;

                // Event delegation
                listContainer.onclick = async (e) => {
                    if (e.target.classList.contains('load-btn')) {
                        const id = e.target.dataset.id;
                        e.target.disabled = true;
                        e.target.textContent = "取得中...";
                        try {
                            const projectData = await CloudApi.loadProject(id);
                            let actualData = projectData;
                            // Unwrapping logic if needed
                            if (projectData.data && !projectData.flows) {
                                actualData = projectData.data;
                            }

                            modal.close();
                            if (onLoadCallback) onLoadCallback(actualData);

                        } catch (err) {
                            alert("読み込みエラー: " + err.message);
                            e.target.disabled = false;
                            e.target.textContent = "開く";
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
