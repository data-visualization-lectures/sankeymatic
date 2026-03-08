import './build.css';
import './main.css';
import './nav.css';

// i18n - must be imported first; auto-initializes detectLanguage(), window.t, translateDOM()
import { t, getLang, setLang } from './i18n.js';

// Scripts
import './project_id_rescue.js';
import './constants.js';

import './sankeymatic.js';
import logoImage from '../i/SKM-trsp-300.png';


// =========================================================================
// Dataviz Tool Header Integration
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const toolHeader = document.querySelector('dataviz-tool-header');

  if (toolHeader) {
    window.toolHeaderInstance = toolHeader; // Globalize toolHeader instance

    // Helper function to show messages
    const showMessage = (message, type = 'info', duration = 3000) => {
      toolHeader.showMessage(message, type, duration);
    };

    // Original functions that need to be wrapped (originalReplaceGraph is removed)
    const originalSaveCloudProjectUI = window.saveCloudProjectUI;
    const originalLoadCloudProjectUI = window.loadCloudProjectUI;

    // Wrapped functions to use the new toast UI
    const handleSaveProject = async () => {
      showMessage(t('header.saving'), 'info');
      try {
        await originalSaveCloudProjectUI(); // Execute original save logic
        // No success/error toast here, assuming CloudUI handles its own feedback
      } catch (error) {
        console.error(t('header.saveFailed'), error);
        // No error toast here, assuming CloudUI handles its own feedback
      }
    };

    const handleLoadProject = async () => {
      showMessage(t('header.loading'), 'info');
      try {
        await originalLoadCloudProjectUI(); // Execute original load logic
        // No success/error toast here, assuming CloudUI handles its own feedback
      } catch (error) {
        console.error(t('header.loadFailed'), error);
        // No error toast here, assuming CloudUI handles its own feedback
      }
    };

    const handleLoadSample = (graphType) => {
      showMessage(t('header.sampleLoading', { type: graphType }), 'info');
      try {
        const savedRecipe = window.sampleDiagramRecipes.get(graphType); // Access global sampleDiagramRecipes
        if (!savedRecipe) {
          throw new Error(`Sample diagram '${graphType}' not found.`);
        }

        // Update any settings which accompanied the stored diagram:
        Object.entries(savedRecipe.settings).forEach(([fld, newVal]) => {
          const fldData = window.skmSettings.get(fld); // Access global skmSettings
          // Use window.settingIsValid and window.setValueOnPage
          const [validSetting, finalValue] = window.settingIsValid(fldData, newVal, {});
          if (validSetting) { window.setValueOnPage(fld, fldData[0], finalValue); }
        });

        // First, verify that the flow input field is visible.
        const flowsPanel = 'input_options';
        // Check if the element exists before toggling
        const flowsPanelEl = document.getElementById(flowsPanel);
        if (flowsPanelEl && flowsPanelEl.style.display === 'none') {
          window.togglePanel(flowsPanel); // Access global togglePanel
        }

        // Then select all the existing input text...
        const flowsEl = document.getElementById(window.userInputsField); // Access global userInputsField
        if (!flowsEl) {
          throw new Error(`Flows input element '${window.userInputsField}' not found.`);
        }
        flowsEl.focus();
        flowsEl.select();
        // ... then replace it with the new content.
        flowsEl.setRangeText(savedRecipe.flows, 0, flowsEl.selectionEnd, 'start');
        flowsEl.blur(); // Un-focus the input field

        // Take away any remembered moves ... & immediately draw the new diagram::
        window.resetMovesAndRender(); // Access global resetMovesAndRender

        showMessage(t('header.sampleLoaded', { type: graphType }), 'success');
      } catch (error) {
        console.error('Sample load failed:', error);
        showMessage(t('header.sampleFailed', { type: graphType }), 'error', 5000);
      }
    };

    const currentLang = getLang();

    toolHeader.setConfig({
      backgroundColor: '#035', // Dark blue from original SankeyMATIC header
      logo: {
        type: 'image-and-text',
        src: logoImage, // Use imported image variable
        text: 'SankeyMATIC',
        alt: 'SankeyMATIC logo',
        textClass: 'font-bold text-lg', // Example Tailwind classes for the text
        imgClass: 'mr-2' // Example Tailwind class for image spacing
      },
      buttons: [
        {
          label: t('header.sampleData'), // Dropdown button for samples
          type: 'dropdown',
          align: 'left',
          items: [
            {
              label: t('header.sample.simple'),
              action: () => handleLoadSample('simple_start')
            },
            {
              label: t('header.sample.financial'),
              action: () => handleLoadSample('financial_results')
            },
            {
              label: t('header.sample.jobSearch'),
              action: () => handleLoadSample('job_search')
            },
            {
              label: t('header.sample.election'),
              action: () => handleLoadSample('election')
            },
            {
              label: t('header.sample.budget'),
              action: () => handleLoadSample('default_budget')
            }
          ]
        },
        {
          label: t('header.saveProject'),
          action: handleSaveProject,
          align: 'right'
        },
        {
          label: t('header.loadProject'),
          action: handleLoadProject,
          align: 'right'
        },
        {
          label: currentLang === 'ja' ? 'English' : '日本語',
          action: () => {
            setLang(currentLang === 'ja' ? 'en' : 'ja');
            location.reload();
          },
          align: 'right'
        }
      ]
    });
  }
});
