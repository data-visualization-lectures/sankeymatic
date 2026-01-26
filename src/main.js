import './build.css';
import './main.css';
import './nav.css';

// Scripts
import './project_id_rescue.js';
import './constants.js';

import './sankeymatic.js';


// =========================================================================
// Dataviz Tool Header Integration
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const toolHeader = document.querySelector('dataviz-tool-header');

  if (toolHeader) {
    // Helper function to show messages
    const showMessage = (message, type = 'info', duration = 3000) => {
      toolHeader.showMessage(message, type, duration);
    };

    // Original functions that need to be wrapped
    const originalSaveCloudProjectUI = window.saveCloudProjectUI;
    const originalLoadCloudProjectUI = window.loadCloudProjectUI;
    const originalReplaceGraph = window.replaceGraph; // For sample diagrams

    // Wrapped functions to use the new toast UI
    const handleSaveProject = async () => {
      showMessage('プロジェクトを保存しています...', 'info');
      try {
        await originalSaveCloudProjectUI(); // Execute original save logic
        showMessage('プロジェクトが正常に保存されました！', 'success');
      } catch (error) {
        console.error('保存失敗:', error);
        showMessage('プロジェクトの保存に失敗しました。', 'error', 5000);
      }
    };

    const handleLoadProject = async () => {
      showMessage('プロジェクトを読み込んでいます...', 'info');
      try {
        await originalLoadCloudProjectUI(); // Execute original load logic
        showMessage('プロジェクトが正常に読み込まれました！', 'success');
      } catch (error) {
        console.error('読み込み失敗:', error);
        showMessage('プロジェクトの読み込みに失敗しました。', 'error', 5000);
      }
    };

    const handleLoadSample = (graphType) => {
      showMessage(`サンプル (${graphType}) を読み込んでいます...`, 'info');
      try {
        originalReplaceGraph(graphType); // Execute original sample load logic
        showMessage(`サンプル (${graphType}) が読み込まれました！`, 'success');
      } catch (error) {
        console.error('サンプル読み込み失敗:', error);
        showMessage(`サンプル (${graphType}) の読み込みに失敗しました。`, 'error', 5000);
      }
    };


    toolHeader.setConfig({
      logoUrl: '/i/SKM-trsp-300.png', // Use the existing logo for SankeyMATIC
      buttons: [
        {
          label: 'プロジェクトを保存',
          action: handleSaveProject
        },
        {
          label: 'プロジェクトを読み込む',
          action: handleLoadProject
        },
        {
          label: 'サンプル: シンプル',
          action: () => handleLoadSample('simple_start')
        },
        {
          label: 'サンプル: 決算',
          action: () => handleLoadSample('financial_results')
        },
        {
          label: 'ヘルプ',
          type: 'link',
          href: '/manual/' // Assuming /manual/ is the help page
        }
      ]
    });
  }
});
