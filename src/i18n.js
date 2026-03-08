// i18n.js: Lightweight internationalization for SankeyMATIC
// Supports Japanese (ja) and English (en)

const translations = {
  ja: {
    // === Section headings ===
    'section.input': 'インプット',
    'section.nodes': 'ノード',
    'section.flows': 'フロー',
    'section.labels': 'ラベル & 単位',
    'section.layout': 'レイアウト・オプション',
    'section.debug': 'デバッグ用ツール',
    'section.diagram': 'ダイアグラムのサイズ & 背景',
    'section.about': 'このダイアグラムについて',

    // === Buttons ===
    'btn.preview': '表示する',
    'btn.save': '保存する \u25BC',
    'btn.load': '\u25C4 読み込む',
    'btn.resetNodes': 'すべてのノードの配置をリセット',

    // === Input section ===
    'input.arrange': 'ダイアグラムをアレンジ（並び順）:',
    'input.auto': 'ツールにおまかせする',
    'input.exact': 'インプットの順序をそのまま使用する',
    'input.dragHint': 'ドラッグしてノードを移動することができます。',

    // === Node labels ===
    'label.height': '高さ:',
    'label.spacing': '間隔:',
    'label.width': '幅:',
    'label.border': '囲み罫:',
    'label.opacity': '透明度:',
    'label.nodeColor': 'ノード色（初期値）:',
    'label.useColor': '使用色',
    'label.singleColor': '一色:',

    // === Flow labels ===
    'label.curvature': '曲がり具合:',
    'label.flowColor': 'フロー色（初期値）:',
    'radio.flowSource': 'それぞれのフローのソース',
    'radio.flowTarget': 'それぞれのフローのターゲット',
    'radio.flowOutside': '最も外側のノード',

    // === Labels & Units ===
    'label.showLabels': 'データに含まれるラベルを表示',
    'label.showLabelsNote': '（独自のテキストを適用するには非表示にします）',
    'label.showTotals': 'ラベルの一部としてノードの合計を表示',
    'label.showZeros': '末尾のゼロを表示',
    'label.showZerosNote': '（通貨に最適）',
    'label.size': 'サイズ:',
    'label.highlight': 'ハイライト:',
    'label.max': '最大',
    'label.min': '最小',
    'label.placement': '配置:',
    'label.firstLabel': '最初の',
    'label.labelsTo': 'ラベルを:',
    'label.beforeNode': 'ノードの前に',
    'label.afterNode': 'ノードの後に',
    'label.placeAt': '置く。',
    'label.breakpoint': '設定した位置から始まるラベルを反対側に配置する:',
    'label.font': '書体:',
    'label.sansSerif': 'サンセリフ',
    'label.serif': 'セリフ',
    'label.mono': 'モノ',
    'label.style': 'スタイル:',
    'label.light': '細字',
    'label.bold': '太字',
    'label.units': '単位:',
    'label.prefix': '接頭語 =',
    'label.suffix': '接尾語 =',
    'label.numberFormat': '数字のフォーマット:',

    // === Layout Options ===
    'layout.note': '注: これらのオプションは、ノードの列が 3 つ以上ある図にのみ適用されます。',
    'layout.justifyOrigins': 'すべてのフローの<strong>起点</strong>を<br /><strong>左端</strong>に配置します',
    'layout.justifyEnds': 'すべてのフローの<strong>終点</strong>を<br /><strong>右端</strong>に配置します',
    'layout.reverse': '<strong>グラフを反転します</strong>（右から左への流れ）',
    'layout.scale': 'ダイアグラムのスケール',
    'layout.scaleCompare1': 'ダイアグラム<em>同士</em>を公平に比較するには:',
    'layout.scaleCompare2': '1) それぞれに同じ単位を使用し、',
    'layout.scaleCompare3': '2) ダイアグラムのスケールを可能な限り一致させます。',
    'debug.iterations': 'レイアウトの反復回数:',
    'debug.shadows': 'シャドウ・ノードを明らかにする',

    // === Diagram Size & Background ===
    'diagram.width': '横幅:',
    'diagram.height': '縦幅:',
    'diagram.bgColor': '背景色:',
    'diagram.transparent': '透過',
    'diagram.margin': 'マージン:',
    'diagram.left': '左',
    'diagram.right': '右',
    'diagram.top': '上',
    'diagram.bottom': '下',

    // === Export ===
    'export.label': 'Export:',
    'export.options': 'オプション',
    'export.or': 'もしくは',

    // === Messages area ===
    'about.imbalanceTitle': 'トータル・インプット \u2260 トータル・アウトプットではない場合:',
    'about.attachIncomplete': '不完全なフロー・グループを以下にアタッチします:',
    'about.leading': '先頭のノード',
    'about.trailing': '末端のノード',
    'about.nearest': 'フロー・グループの中心に最も近い方の端',
    'about.listImbalances': '不均衡なノードをすべてリストする',

    // === Title attributes ===
    'title.diagramInputs': '図の入力データ',
    'title.singleNodeColor': '単一ノードの色',
    'title.rotateLeft': 'テーマカラーを左に回転',
    'title.rotateRight': 'テーマカラーを右に回転',
    'title.singleFlowColor': '単一フローの色',
    'title.saveDiagram': '現在のダイアグラムと設定をローカルテキストファイルに保存',
    'title.loadDiagram': 'テキストファイルからダイアグラム定義を読み込む',
    'title.diagramWidth': '図の横幅（ピクセル）',
    'title.diagramHeight': '図の縦幅（ピクセル）',
    'title.pngOption': '別の解像度を選択',
    'title.saveSvg': 'SVGファイルとしてダイアグラムを保存',
    'title.saveJson': 'JSONファイルとしてダイアグラムと設定を保存',

    // === Dynamic messages (sankeymatic.js) ===
    'msg.sampleNotFound': 'リクエストされたサンプルダイアグラム {value} が見つかりません。',
    'msg.replaceConfirm': 'はい \'{name}\'と置き換えてください',
    'msg.invalidSettingValue': '{name} の値が無効です',
    'msg.invalidSettingName': '有効な設定名ではありません',
    'msg.invalidAmount': '金額が有効な10進数ではありません',
    'msg.amountPositive': '金額は0より大きい必要があります',
    'msg.invalidFormat': 'フロー、ノード、設定のいずれのフォーマットにも一致しません',
    'msg.imported': '<strong>{fileName}</strong> をインポートしました。',
    'msg.noFlows': 'フローのリストを入力してください &mdash; 1行に1つ。詳しくは<a href="/manual/" target="_blank">マニュアル</a>をご覧ください。',
    'msg.summary': '<strong>{nodeCount} ノード</strong> 間に <strong>{flowCount} フロー</strong>  ',
    'msg.totalEqual': 'トータル・インプット = トータル・アウトプット = ',
    'msg.totalInputs': 'トータル・インプット:',
    'msg.totalOutputs': 'トータル・アウトプット:',
    'msg.flowsFrom': '{sum} from {count} Flows: {breakdown}',
    'msg.perPixel': ' per pixel ',
    'msg.loadingProject': 'プロジェクトを読み込み中...',
    'msg.autoLoadFailed': 'プロジェクトの自動読み込みに失敗しました: ',
    'msg.tableIn': 'Total In',
    'msg.tableOut': 'Total Out',
    'msg.tableDiff': 'Difference',
    'msg.scaleInfo': '<strong>{unitsPerPixel}</strong> per pixel ({total}/{pixels}px)',

    // === Header (main.js) ===
    'header.sampleData': 'サンプルデータ',
    'header.sample.simple': 'シンプル',
    'header.sample.financial': '決算',
    'header.sample.jobSearch': '就職・転職活動',
    'header.sample.election': '選好投票',
    'header.sample.budget': '予算',
    'header.saveProject': 'プロジェクトの保存',
    'header.loadProject': 'プロジェクトの読込',
    'header.saving': 'プロジェクトを保存しています...',
    'header.loading': 'プロジェクトを読み込んでいます...',
    'header.sampleLoading': 'サンプル ({type}) を読み込んでいます...',
    'header.sampleLoaded': 'サンプルデータ ({type}) が読み込まれました！',
    'header.sampleFailed': 'サンプルデータ ({type}) の読み込みに失敗しました。',
    'header.saveFailed': '保存失敗:',
    'header.loadFailed': '読み込み失敗:',

    // === Textarea default content ===
    'sample.defaultInput': '// こんな風に、ノード間のフローを記述してください:\n// Source [AMOUNT] Target\n\nWages [1500] Budget\nOther [250] Budget\n\nBudget [450] Taxes\nBudget [420] Housing\nBudget [400] Food\nBudget [295] Transportation\nBudget [25] Savings\n\n// こんな風に、ノードの色指定が可能です\n:Budget #708090\n\n// 特定のフローへの色指定も可能です\nBudget [160] Other Necessities #0F0\n\n// 以下のコントロールを使用して、\n// 図の外観をカスタマイズ可能です',
  },

  en: {
    // === Section headings ===
    'section.input': 'Inputs',
    'section.nodes': 'Nodes',
    'section.flows': 'Flows',
    'section.labels': 'Labels & Units',
    'section.layout': 'Layout Options',
    'section.debug': 'Debug Tools',
    'section.diagram': 'Diagram Size & Background',
    'section.about': 'About This Diagram',

    // === Buttons ===
    'btn.preview': 'Preview',
    'btn.save': 'Save \u25BC',
    'btn.load': '\u25C4 Load',
    'btn.resetNodes': 'Reset all node positions',

    // === Input section ===
    'input.arrange': 'Arrange the diagram (ordering):',
    'input.auto': 'Automatic',
    'input.exact': 'Use the exact input order',
    'input.dragHint': 'Drag to move nodes.',

    // === Node labels ===
    'label.height': 'Height:',
    'label.spacing': 'Spacing:',
    'label.width': 'Width:',
    'label.border': 'Border:',
    'label.opacity': 'Opacity:',
    'label.nodeColor': 'Node Color (default):',
    'label.useColor': 'Color',
    'label.singleColor': 'Single:',

    // === Flow labels ===
    'label.curvature': 'Curvature:',
    'label.flowColor': 'Flow Color (default):',
    'radio.flowSource': 'Source of each flow',
    'radio.flowTarget': 'Target of each flow',
    'radio.flowOutside': 'Outermost node',

    // === Labels & Units ===
    'label.showLabels': 'Show labels from data',
    'label.showLabelsNote': '(hide to apply your own text)',
    'label.showTotals': 'Show node totals as part of labels',
    'label.showZeros': 'Show trailing zeros',
    'label.showZerosNote': '(best for currency)',
    'label.size': 'Size:',
    'label.highlight': 'Highlight:',
    'label.max': 'Max',
    'label.min': 'Min',
    'label.placement': 'Placement:',
    'label.firstLabel': 'First',
    'label.labelsTo': 'labels:',
    'label.beforeNode': 'Before node',
    'label.afterNode': 'After node',
    'label.placeAt': '.',
    'label.breakpoint': 'Place labels on the opposite side starting at:',
    'label.font': 'Font:',
    'label.sansSerif': 'Sans-serif',
    'label.serif': 'Serif',
    'label.mono': 'Mono',
    'label.style': 'Style:',
    'label.light': 'Light',
    'label.bold': 'Bold',
    'label.units': 'Units:',
    'label.prefix': 'Prefix =',
    'label.suffix': 'Suffix =',
    'label.numberFormat': 'Number format:',

    // === Layout Options ===
    'layout.note': 'Note: These options only apply to diagrams with 3 or more columns of nodes.',
    'layout.justifyOrigins': 'Justify all flow <strong>origins</strong> to the<br /><strong>left</strong> edge',
    'layout.justifyEnds': 'Justify all flow <strong>endpoints</strong> to the<br /><strong>right</strong> edge',
    'layout.reverse': '<strong>Reverse the graph</strong> (right-to-left flow)',
    'layout.scale': 'Diagram Scale',
    'layout.scaleCompare1': 'To compare diagrams fairly:',
    'layout.scaleCompare2': '1) Use the same units for each, and',
    'layout.scaleCompare3': '2) Match the diagram scale as closely as possible.',
    'debug.iterations': 'Layout iterations:',
    'debug.shadows': 'Reveal shadow nodes',

    // === Diagram Size & Background ===
    'diagram.width': 'Width:',
    'diagram.height': 'Height:',
    'diagram.bgColor': 'Background:',
    'diagram.transparent': 'Transparent',
    'diagram.margin': 'Margin:',
    'diagram.left': 'L',
    'diagram.right': 'R',
    'diagram.top': 'T',
    'diagram.bottom': 'B',

    // === Export ===
    'export.label': 'Export:',
    'export.options': 'Options',
    'export.or': 'or',

    // === Messages area ===
    'about.imbalanceTitle': 'When Total Inputs \u2260 Total Outputs:',
    'about.attachIncomplete': 'Attach incomplete flow groups to:',
    'about.leading': 'Leading node',
    'about.trailing': 'Trailing node',
    'about.nearest': 'Nearest end to flow group center',
    'about.listImbalances': 'List all imbalanced nodes',

    // === Title attributes ===
    'title.diagramInputs': 'Diagram Inputs',
    'title.singleNodeColor': 'Single Node Color',
    'title.rotateLeft': 'Rotate theme colors left',
    'title.rotateRight': 'Rotate theme colors right',
    'title.singleFlowColor': 'Single Flow Color',
    'title.saveDiagram': 'Save the current diagram and settings to a local text file',
    'title.loadDiagram': 'Load a diagram definition from a text file',
    'title.diagramWidth': 'Diagram Width in pixels',
    'title.diagramHeight': 'Diagram Height in pixels',
    'title.pngOption': 'Select to choose another resolution',
    'title.saveSvg': 'Save this diagram as a Scalable Vector Graphics file',
    'title.saveJson': 'Save this diagram and settings as a JSON file',

    // === Dynamic messages (sankeymatic.js) ===
    'msg.sampleNotFound': 'Requested sample diagram {value} not found.',
    'msg.replaceConfirm': 'Yes, replace with \'{name}\'',
    'msg.invalidSettingValue': 'Invalid value for <strong>{name}</strong>',
    'msg.invalidSettingName': 'Not a valid setting name',
    'msg.invalidAmount': 'The Amount is not a valid decimal number',
    'msg.amountPositive': 'Amounts must be greater than 0',
    'msg.invalidFormat': 'Does not match the format of a Flow or Node or Setting',
    'msg.imported': 'Imported <strong>{fileName}</strong>.',
    'msg.noFlows': 'Enter a list of Flows &mdash; one per line. See the <a href="/manual/" target="_blank">Manual</a> for more help.',
    'msg.summary': '<strong>{nodeCount} Nodes</strong> and <strong>{flowCount} Flows</strong>  ',
    'msg.totalEqual': 'Total Inputs = Total Outputs = ',
    'msg.totalInputs': 'Total Inputs:',
    'msg.totalOutputs': 'Total Outputs:',
    'msg.flowsFrom': '{sum} from {count} Flows: {breakdown}',
    'msg.perPixel': ' per pixel ',
    'msg.loadingProject': 'Loading Project...',
    'msg.autoLoadFailed': 'Failed to auto-load project: ',
    'msg.tableIn': 'Total In',
    'msg.tableOut': 'Total Out',
    'msg.tableDiff': 'Difference',
    'msg.scaleInfo': '<strong>{unitsPerPixel}</strong> per pixel ({total}/{pixels}px)',

    // === Header (main.js) ===
    'header.sampleData': 'Sample Data',
    'header.sample.simple': 'Simple',
    'header.sample.financial': 'Financial Results',
    'header.sample.jobSearch': 'Job Search',
    'header.sample.election': 'Ranked Election',
    'header.sample.budget': 'Budget',
    'header.saveProject': 'Save Project',
    'header.loadProject': 'Load Project',
    'header.saving': 'Saving project...',
    'header.loading': 'Loading project...',
    'header.sampleLoading': 'Loading sample ({type})...',
    'header.sampleLoaded': 'Sample ({type}) loaded!',
    'header.sampleFailed': 'Failed to load sample ({type}).',
    'header.saveFailed': 'Save failed:',
    'header.loadFailed': 'Load failed:',

    // === Textarea default content ===
    'sample.defaultInput': '// Enter Flows between Nodes, like this:\n// Source [AMOUNT] Target\n\nWages [1500] Budget\nOther [250] Budget\n\nBudget [450] Taxes\nBudget [420] Housing\nBudget [400] Food\nBudget [295] Transportation\nBudget [25] Savings\n\n// You can set a Node\'s color, like this:\n:Budget #708090\n\n// ...or a color for a single Flow:\nBudget [160] Other Necessities #0F0\n\n// Use the controls below to customize\n// your diagram\'s appearance...',
  },
};

let currentLang = 'ja';

/** Detect language from localStorage or browser setting */
export function detectLanguage() {
  const saved = localStorage.getItem('sankeymatic_lang');
  if (saved && (saved === 'ja' || saved === 'en')) {
    currentLang = saved;
  } else {
    const browserLang = navigator.language || navigator.userLanguage || 'ja';
    currentLang = browserLang.startsWith('ja') ? 'ja' : 'en';
  }
  document.documentElement.lang = currentLang === 'ja' ? 'ja' : 'en-US';
  return currentLang;
}

/** Get current language */
export function getLang() { return currentLang; }

/** Set language and save to localStorage */
export function setLang(lang) {
  currentLang = (lang === 'ja') ? 'ja' : 'en';
  localStorage.setItem('sankeymatic_lang', currentLang);
  document.documentElement.lang = currentLang === 'ja' ? 'ja' : 'en-US';
}

/** Translate function: t('key', { param: value }) */
export function t(key, params = {}) {
  let text = translations[currentLang]?.[key]
    ?? translations['ja']?.[key]
    ?? key;
  for (const [k, v] of Object.entries(params)) {
    text = text.replaceAll(`{${k}}`, v);
  }
  return text;
}

/** Translate all DOM elements with data-i18n attributes */
export function translateDOM() {
  // textContent
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  // innerHTML (for text containing HTML tags)
  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  // title attribute
  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    el.title = t(el.dataset.i18nTitle);
  });
  // placeholder attribute
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  // value attribute (for textarea default content)
  document.querySelectorAll('[data-i18n-value]').forEach((el) => {
    el.value = t(el.dataset.i18nValue);
  });
}

// =========================================================================
// Auto-initialize on module evaluation.
// This runs when i18n.js is first imported, BEFORE any other module
// in the dependency chain (constants.js, sankeymatic.js) is evaluated.
// Since main.js imports i18n.js first, this guarantees window.t is
// available when sankeymatic.js IIFE executes.
// =========================================================================
detectLanguage();
window.t = t;

// Module scripts are deferred (run after DOM parsing), so DOM is ready here.
// Translate DOM immediately so that sankeymatic.js sees translated values
// (e.g. textarea content) when it calls process_sankey().
translateDOM();
