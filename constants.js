// constants.js: Reference file with several values used in sankeymatic.js
/* eslint-disable no-unused-vars */

// skmSettings = Settings required to render a diagram.
// Format = field_name: [data type, initial value, allowed values]
window.skmSettings
  = new Map([
    ['size_w', ['whole', 600, [40]]],
    ['size_h', ['whole', 600, [40]]],
    ['margin_l', ['contained', 12, [0, 'w']]],
    ['margin_r', ['contained', 12, [0, 'w']]],
    ['margin_t', ['contained', 18, [0, 'h']]],
    ['margin_b', ['contained', 20, [0, 'h']]],
    ['bg_color', ['color', '#ffffff', []]],
    ['bg_transparent', ['yn', 'n', []]],
    ['node_w', ['contained', 9, [0, 'w']]],
    ['node_h', ['whole', 50, [0, 100]]],
    ['node_spacing', ['whole', 85, [0, 100]]],
    ['node_border', ['contained', 0, [0, 'w']]],
    ['node_theme', ['radio', 'none', ['a', 'b', 'c', 'd', 'none']]],
    ['node_color', ['color', '#888888', []]],
    ['node_opacity', ['decimal', 1.0, []]],
    ['flow_curvature', ['decimal', 0.5, []]],
    ['flow_inheritfrom', ['radio', 'none', ['source', 'target', 'outside-in', 'none']]],
    ['flow_color', ['color', '#999999', []]],
    ['flow_opacity', ['decimal', 0.45, []]],
    ['layout_order', ['radio', 'automatic', ['automatic', 'exact']]],
    ['layout_justifyorigins', ['yn', 'n', []]],
    ['layout_justifyends', ['yn', 'n', []]],
    ['layout_reversegraph', ['yn', 'n', []]],
    ['layout_attachincompletesto', ['radio', 'nearest', ['leading', 'nearest', 'trailing']]],
    ['labels_color', ['color', '#000000', []]],
    ['labels_highlight', ['decimal', 0.55, []]],
    ['labels_fontface', ['radio', 'sans-serif', ['monospace', 'sans-serif', 'serif']]],
    ['labelname_appears', ['yn', 'y', []]],
    ['labelname_size', ['whole', 16, [6]]],
    ['labelname_weight', ['radio', '400', ['100', '400', '700']]],
    ['labelvalue_appears', ['yn', 'y', []]],
    ['labelvalue_fullprecision', ['yn', 'y', []]],
    ['labelposition_first', ['radio', 'before', ['before', 'after']]],
    ['labelposition_breakpoint', ['breakpoint', 9999, [2]]],
    ['value_format', ['list', ',.', [',.', '.,', ' .', ' ,', 'X.', 'X,']]],
    ['value_prefix', ['text', '', [0, 99]]],
    ['value_suffix', ['text', '', [0, 99]]],
    ['themeoffset_a', ['whole', 9, [0, 9]]],
    ['themeoffset_b', ['whole', 0, [0, 9]]],
    ['themeoffset_c', ['whole', 0, [0, 7]]],
    ['themeoffset_d', ['whole', 0, [0, 11]]],
    ['meta_mentionsankeymatic', ['yn', 'y', []]],
    ['meta_listimbalances', ['yn', 'y', []]],
    // 'internal' settings are never exported, but can be imported:
    ['internal_iterations', ['whole', 25, [0, 50]]],
    ['internal_revealshadows', ['yn', 'n', []]],
  ]);

// Some reusable regular expressions to be precompiled:
window.reWholeNumber = /^\d+$/;
window.reDecimal = /^\d(?:.\d+)?$/;
window.reCommentLine = /^(?:'|\/\/)/; // Line starts with // or '
window.reYesNo = /^(?:y|yes|n|no)/i; // = Y/y/Yes/YES/etc. or N/n/No/NO/etc.
window.reYes = /^(?:y|yes)/i;        // = Y/y/Yes/YES/etc.

// Settings Notes:
//   * We look for settings & move lines FIRST.
//   * If they prove valid, we apply them to the UI and convert them to
//     COMMENTS in the input (with a checkmark to indicate success).
//   * The idea here is to avoid having input text conflicting with
//     the UI controls. Since any valid setting line is immediately
//     applied and disappears, we can't have a conflict.
//
// reSettingsValue:
// One to two words, followed by a value made up of letters,
// numbers, decimals and/or dashes.
// ex. "node theme a", "flow inheritfrom outside-in"
window.reSettingsValue = /^((?:\w+\s*){1,2}) (#?[\w.-]+)$/;

// reSettingsText:
// One to two words followed by a quoted string (possibly empty):
// ex: "value prefix ''", "suffix 'M'"
// If the raw string contains a single quote, it will be doubled here.
window.reSettingsText = /^((?:\w+\s*){1,2}) '(.*)'$/;
window.reMoveLine = /^move (.+) (-?\d(?:.\d+)?), (-?\d(?:.\d+)?)$/;

window.sourceHeaderPrefix = '// SankeyMATIC diagram inputs -';
window.sourceURLLine = '// https://sankeymatic.com/build/';
window.userDataMarker = '// === Nodes and Flows ===';
window.movesMarker = '// === Moved Nodes ===';
window.settingsMarker = '// === Settings ===';
window.settingsAppliedPrefix = '// \u2713 '; // u2713 = a little check mark

window.reNodeLine = /^:(.+) #([a-f0-9]{0,6})?(\.\d{1,4})?\s*(>>|<<)*\s*(>>|<<)*$/i;
window.reFlowLine = /^(.+)\[([\d\s.+-]+)\](.+)$/;
window.reFlowTargetWithSuffix = /^(.+)\s+(#\S+)$/;

window.reColorPlusOpacity = /^#([a-f0-9]{3,6})?(\.\d{1,4})?$/i;
window.reBareColor = /^(?:[a-f0-9]{3}|[a-f0-9]{6})$/i;
window.reRGBColor = /^#(?:[a-f0-9]{3}|[a-f0-9]{6})$/i;
window.colorGray60 = '#999';

window.userInputsField = 'flows_in';

// Some prime constants for enum values:
window.IN = 13;
window.OUT = 17;
window.BEFORE = 19;
window.AFTER = 23;

// fontMetrics = measurements relating to labels & their highlights
window.fontMetrics
  = {
  firefox: {
    'sans-serif': {
      dy: 0.35, top: 0.55, bot: 0.25, inner: 0.35, outer: 0.35,
      marginRight: 1.4, marginAdjLeft: 0,
    },
    monospace: {
      dy: 0.31, top: 0.3, bot: 0.25, inner: 0.35, outer: 0.35,
      marginRight: 1.48, marginAdjLeft: -0.08,
    },
    '*': {
      dy: 0.31, top: 0.3, bot: 0.25, inner: 0.35, outer: 0.35,
      marginRight: 1.35, marginAdjLeft: -0.05,
    },
  },
  '*': {
    monospace: {
      dy: 0.28, top: 0.3, bot: 0.3, inner: 0.35, outer: 0.38,
      marginRight: 1.45, marginAdjLeft: 0,
    },
    '*': {
      dy: 0.29, top: 0.3, bot: 0.3, inner: 0.35, outer: 0.38,
      marginRight: 1.35, marginAdjLeft: 0,
    },
  },
};

// highlightStyles = settings relating to label highlight appearance
window.highlightStyles
  = {
  // When text is dark-on-light:
  dark: {
    orig: { fill: '#fff', stroke: 'none', stroke_width: 0, stroke_opacity: 0 },
    hover: { fill: '#ffb', stroke: '#440', stroke_width: 1, stroke_opacity: 0.7 },
  },
  // When text is light-on-dark:
  light: {
    orig: { fill: '#000', stroke: 'none', stroke_width: 0, stroke_opacity: 0 },
    hover: { fill: '#603', stroke: '#fff', stroke_width: 1.7, stroke_opacity: 0.9 },
  },
};

// sampleDiagramRecipes = preset diagrams of various types.
window.sampleDiagramRecipes
  = new Map([
    // The initial diagram loaded on the page:
    ['default_budget', {
      name: 'Basic Budget',
      flows: "// Enter Flows between Nodes, like this:\n//         Source [AMOUNT] Target\n\nWages [1500] Budget\nOther [250] Budget\n\nBudget [450] Taxes\nBudget [420] Housing\nBudget [400] Food\nBudget [295] Transportation\nBudget [25] Savings\n\n// You can set a Node's color, like this:\n:Budget #708090\n//            ...or a color for a single Flow:\nBudget [160] Other Necessities #0F0\n\n// Use the controls below to customize\n// your diagram's appearance...",
      settings: {
        size_w: 600,
        node_w: 9,
        node_h: 50,
        node_spacing: 85,
        node_theme: 'a',
        flow_inheritfrom: 'outside-in',
        layout_justifyends: 'n',
        layout_order: 'automatic',
        labelname_size: 16,
        value_prefix: '',
      },
    }],

    // Ranked-choice election:
    ['election', {
      name: 'Ranked Election',
      flows: '// Sample Ranked Election diagram\n\nGH - Round 1 [300000] GH - Round 2\nEF - Round 1 [220000] EF - Round 2\nCD - Round 1 [200000] CD - Round 2\nAB - Round 1 [10000] GH - Round 2\nAB - Round 1 [25000] EF - Round 2\nAB - Round 1 [20000] CD - Round 2\n\nGH - Round 2 [310000] GH - Round 3\nEF - Round 2 [245000] EF - Round 3\nCD - Round 2 [50000] GH - Round 3\nCD - Round 2 [95000] EF - Round 3\n\n// This line sets a custom gray color:\n:No further votes #555 <<\nAB - Round 1 [20000] No further votes\nCD - Round 2 [75000] No further votes',
      settings: {
        size_w: 700,
        node_w: 9,
        node_h: 76,
        node_spacing: 85,
        node_theme: 'a',
        flow_inheritfrom: 'source',
        layout_justifyends: 'n',
        layout_order: 'exact',
        labelname_size: 14,
        value_prefix: '',
      },
    }],

    // Sample job-hunt flow:
    ['job_search', {
      name: 'Job Search',
      flows: '// Sample Job Search diagram:\n\nApplications [4] Interview\nApplications [9] Rejected\nApplications [4] No Answer\n\nInterview [2] 2nd Interview\nInterview [2] No Offer\n\n2nd Interview [2] Offer\n\nOffer [1] Accepted\nOffer [1] Declined',
      settings: {
        size_w: 700,
        node_w: 5,
        node_h: 50,
        node_spacing: 50,
        node_theme: 'a',
        flow_inheritfrom: 'target',
        layout_justifyends: 'n',
        layout_order: 'automatic',
        labelname_size: 14,
        value_prefix: '',
      },
    }],

    // Sample quarterly financial results:
    ['financial_results', {
      name: 'Financial Results',
      flows: 'Division A [900] Revenue\nDivision B [750] Revenue\nDivision C [150] Revenue\n\nRevenue [1000] Gross Profit\n\nGross Profit [350] Operating Profit\nGross Profit [650] Operating Expenses\n\nOperating Profit [260] Net Profit\nOperating Profit [90] Tax\n\nOperating Expenses [640] S G & Admin\nOperating Expenses [10] Amortization\n\nRevenue [800] Cost of Sales\n\n// Profit - blue\n:Gross Profit #48e <<\n:Operating Profit #48e <<\n:Net Profit #48e <<\n\n// Expenses - rust\n:Operating Expenses #d74 <<\n:Tax #d74 <<\n:S G & Admin #d74 <<\n:Amortization #d74 <<\n\n// Cost - grayish-gold\n:Cost of Sales #e6cc91 <<\n\n// main Revenue node: dark grey\n:Revenue #444',
      settings: {
        size_w: 1000,
        node_w: 5,
        node_h: 70,
        node_spacing: 70,
        node_theme: 'none',
        flow_inheritfrom: 'none',
        layout_justifyends: 'y',
        layout_order: 'automatic',
        labelname_size: 13,
        value_prefix: '$',
      },
    }],

    // The most basic diagram:
    ['simple_start', {
      name: 'Start Simple',
      flows: 'a [1] b\na [1] c',
      settings: {
        size_w: 600,
        node_w: 12,
        node_h: 50,
        node_spacing: 80,
        node_theme: 'none',
        flow_inheritfrom: 'none',
        layout_justifyends: 'n',
        layout_order: 'automatic',
        labelname_size: 15,
        value_prefix: '',
      },
    }],
  ]);
