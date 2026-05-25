// DesignCalc Hub - Client side Application Logic

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initAspectRatioCalc();
  initPxRemConverter();
  initColorContrastChecker();
  initGridLayoutCalc();
  initStandardCalculator();
});

/* ==========================================================
   GLOBAL UTILITIES
   ========================================================== */

// Clipboard copy helper
function copyToClipboard(text, successMessage = "클립보드에 복사되었습니다!") {
  navigator.clipboard.writeText(text).then(() => {
    showToast(successMessage);
  }).catch(err => {
    console.error('클립보드 복사 실패:', err);
    showToast('복사에 실패했습니다. 수동으로 복사해주세요.', true);
  });
}

// Toast notification display
function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  
  if (isError) {
    toast.style.borderColor = 'var(--accent-rose)';
    toast.style.color = 'var(--accent-rose)';
    toast.style.boxShadow = '0 8px 24px var(--accent-rose-glow)';
  } else {
    toast.style.borderColor = 'var(--accent-emerald)';
    toast.style.color = 'var(--accent-emerald)';
    toast.style.boxShadow = '0 8px 24px var(--accent-emerald-glow)';
  }
  
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

// Greatest Common Divisor helper for Aspect Ratio
function getGCD(a, b) {
  a = Math.round(a);
  b = Math.round(b);
  return b ? getGCD(b, a % b) : a;
}


/* ==========================================================
   TAB ROUTER / NAVIGATION
   ========================================================== */
function initTabs() {
  const navItems = document.querySelectorAll('.nav-item');
  const panels = document.querySelectorAll('.tab-panel');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const tabId = item.getAttribute('data-tab');
      
      // Deactivate current active tab
      document.querySelector('.nav-item.active').classList.remove('active');
      document.querySelector('.tab-panel.active').classList.remove('active');
      
      // Activate clicked tab
      item.classList.add('active');
      const targetPanel = document.getElementById(tabId);
      targetPanel.classList.add('active');
      
      // Trigger grid layout refresh if grid tab is clicked
      if (tabId === 'grid') {
        setTimeout(calculateGrid, 50);
      }
    });
  });
}


/* ==========================================================
   TAB 1: ASPECT RATIO CALCULATOR LOGIC
   ========================================================== */
function initAspectRatioCalc() {
  const widthInput = document.getElementById('ar-width');
  const heightInput = document.getElementById('ar-height');
  const presetSelect = document.getElementById('ar-preset');
  const lockBtn = document.getElementById('ar-lock-btn');
  const ratioLabel = document.getElementById('ar-ratio-value');
  const previewBox = document.getElementById('ar-preview-box');
  const previewDim = document.getElementById('ar-preview-dim');
  const previewRatio = document.getElementById('ar-preview-ratio');
  const presetChips = document.querySelectorAll('.chip');

  let isLocked = true;
  let lockedRatio = 16 / 9; // default 1920 / 1080

  // Handle ratio locking toggle
  lockBtn.addEventListener('click', () => {
    isLocked = !isLocked;
    if (isLocked) {
      lockBtn.classList.add('locked');
      const w = parseFloat(widthInput.value) || 1920;
      const h = parseFloat(heightInput.value) || 1080;
      lockedRatio = w / h;
      lockBtn.querySelector('#lock-icon-locked').style.display = 'block';
      lockBtn.querySelector('#lock-icon-unlocked').style.display = 'none';
    } else {
      lockBtn.classList.remove('locked');
      lockBtn.querySelector('#lock-icon-locked').style.display = 'none';
      lockBtn.querySelector('#lock-icon-unlocked').style.display = 'block';
    }
  });

  // Calculate and update view
  function updateAspectRatio(triggerSource) {
    const w = parseFloat(widthInput.value) || 0;
    const h = parseFloat(heightInput.value) || 0;

    if (w <= 0 || h <= 0) return;

    // 1. Calculate display ratio
    const gcd = getGCD(w, h);
    const simplifiedW = Math.round(w / gcd);
    const simplifiedH = Math.round(h / gcd);
    const floatRatio = (w / h).toFixed(2);
    
    ratioLabel.textContent = `${simplifiedW}:${simplifiedH} (${floatRatio}:1)`;
    
    // 2. Update visual preview sizing
    previewBox.style.aspectRatio = `${w} / ${h}`;
    previewDim.textContent = `${Math.round(w)} x ${Math.round(h)}`;
    previewRatio.textContent = `${simplifiedW}:${simplifiedH}`;

    // 3. Keep lock ratio updated if this wasn't a child recalculation
    if (!triggerSource && isLocked) {
      lockedRatio = w / h;
    }
  }

  // Width input change handler
  widthInput.addEventListener('input', () => {
    const w = parseFloat(widthInput.value) || 0;
    if (isLocked && w > 0) {
      heightInput.value = Math.round(w / lockedRatio);
    }
    updateAspectRatio(true);
  });

  // Height input change handler
  heightInput.addEventListener('input', () => {
    const h = parseFloat(heightInput.value) || 0;
    if (isLocked && h > 0) {
      widthInput.value = Math.round(h * lockedRatio);
    }
    updateAspectRatio(true);
  });

  // Preset dropdown selector handler
  presetSelect.addEventListener('change', () => {
    const val = presetSelect.value;
    if (val === 'custom') return;

    const parts = val.split(':');
    const pw = parseFloat(parts[0]);
    const ph = parseFloat(parts[1]);

    lockedRatio = pw / ph;
    
    // Maintain current width, recalculate height
    const currentW = parseFloat(widthInput.value) || 1920;
    widthInput.value = Math.round(currentW);
    heightInput.value = Math.round(currentW / lockedRatio);
    
    updateAspectRatio(true);
  });

  // Recommended specs chips click handler
  presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const w = parseInt(chip.getAttribute('data-w'));
      const h = parseInt(chip.getAttribute('data-h'));
      
      presetSelect.value = 'custom';
      widthInput.value = w;
      heightInput.value = h;
      lockedRatio = w / h;
      
      updateAspectRatio(true);
    });
  });

  // Initial call
  updateAspectRatio();
}


/* ==========================================================
   TAB 2: PX TO REM CONVERTER LOGIC
   ========================================================== */
function initPxRemConverter() {
  const baseSizeInput = document.getElementById('base-font-size');
  const pxInput = document.getElementById('px-input');
  const remInput = document.getElementById('rem-input');
  const cssVarsCode = document.getElementById('css-vars-code');
  const copyCssBtn = document.getElementById('copy-css-btn');
  const tableBody = document.getElementById('quick-rem-table-body');

  let lastEdited = 'px'; // tracks which field user edited to keep synced on base font change

  function syncConversion() {
    const base = parseFloat(baseSizeInput.value) || 16;
    if (base <= 0) return;

    if (lastEdited === 'px') {
      const px = parseFloat(pxInput.value) || 0;
      const remVal = px / base;
      // Round to 4 decimal places unless integer
      remInput.value = parseFloat(remVal.toFixed(4));
    } else {
      const rem = parseFloat(remInput.value) || 0;
      const pxVal = rem * base;
      pxInput.value = parseFloat(pxVal.toFixed(2));
    }

    updateCssCodeOutput();
  }

  // Variable output updater
  function updateCssCodeOutput() {
    const px = pxInput.value || 0;
    const rem = remInput.value || 0;
    cssVarsCode.textContent = `/* CSS Variables Output */
:root {
  --font-size-custom: ${rem}rem; /* ${px}px */
}`;
  }

  // Populate reference chart table
  function populateQuickTable() {
    const base = parseFloat(baseSizeInput.value) || 16;
    const standardPixels = [10, 12, 13, 14, 15, 16, 18, 20, 24, 28, 32, 40, 48, 64];
    
    // Description recommendations
    const recommendations = {
      10: "초소형 캡션, 저작권 문구 (Mini)",
      12: "부가 정보, 캡션 텍스트 (Caption)",
      13: "메타데이터, 모바일 보조 문구",
      14: "부본문, 테이블 데이터, 작은 본문",
      15: "일반 서브 본문, 리스트 문장",
      16: "표준 본문 텍스트, 메인 글자 (Body)",
      18: "강조 본문, 작은 헤드라인 (Lead)",
      20: "서브 섹션 타이틀, 카드 헤더",
      24: "섹션 대제목, 중형 헤드라인",
      28: "서브 페이지 메인 타이틀",
      32: "메인 페이지 헤드라인 (H1)",
      40: "대형 프로모션 배너 타이틀",
      48: "초대형 디스플레이 히어로 타이틀",
      64: "특수 랜딩페이지 볼드 그래픽 텍스트"
    };

    tableBody.innerHTML = '';

    standardPixels.forEach(px => {
      const rem = parseFloat((px / base).toFixed(4));
      const rec = recommendations[px] || "사용자 지정 요소";
      
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${px}px</strong></td>
        <td><code>${rem}rem</code></td>
        <td><span class="table-rec-tag" style="color: var(--text-secondary);">${rec}</span></td>
        <td>
          <button class="table-copy-icon" data-copy="${rem}rem" title="${rem}rem 복사">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
          </button>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    // Rebind newly created table copy button clicks
    tableBody.querySelectorAll('.table-copy-icon').forEach(btn => {
      btn.addEventListener('click', () => {
        const copyText = btn.getAttribute('data-copy');
        copyToClipboard(copyText, `"${copyText}" 가 복사되었습니다.`);
      });
    });
  }

  // Event listeners
  pxInput.addEventListener('input', () => {
    lastEdited = 'px';
    syncConversion();
  });

  remInput.addEventListener('input', () => {
    lastEdited = 'rem';
    syncConversion();
  });

  baseSizeInput.addEventListener('input', () => {
    // Recalculate and update both table and input
    syncConversion();
    populateQuickTable();
  });

  // Codeblock Copy handler
  copyCssBtn.addEventListener('click', () => {
    const text = cssVarsCode.textContent;
    copyToClipboard(text, "CSS 변수 코드가 복사되었습니다!");
  });

  // Initialization
  syncConversion();
  populateQuickTable();
}


/* ==========================================================
   TAB 3: WCAG COLOR CONTRAST CHECKER LOGIC
   ========================================================== */
function initColorContrastChecker() {
  const fgPicker = document.getElementById('fg-color-picker');
  const fgHexInput = document.getElementById('fg-hex-input');
  const bgPicker = document.getElementById('bg-color-picker');
  const bgHexInput = document.getElementById('bg-hex-input');
  
  const scoreDisplay = document.getElementById('contrast-ratio-score');
  const previewWindow = document.getElementById('contrast-preview-window');
  const tipsBox = document.getElementById('contrast-tips');

  const compAANormal = document.getElementById('comp-aa-normal');
  const compAALarge = document.getElementById('comp-aa-large');
  const compAAANormal = document.getElementById('comp-aaa-normal');
  const compAAALarge = document.getElementById('comp-aaa-large');

  // Convert Hex to RGB
  function hexToRgb(hex) {
    // Remove leading hash
    hex = hex.replace(/^#/, '');
    
    // Handle shorthand 3-char hex (e.g. "FFF" -> "FFFFFF")
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }
    
    if (hex.length !== 6) return null;
    
    const num = parseInt(hex, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  }

  // Compute Relative Luminance according to WCAG 2.1 Formula
  function getLuminance(r, g, b) {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  // Calculate contrast ratio
  function calculateContrast() {
    const fgHex = fgHexInput.value;
    const bgHex = bgHexInput.value;

    const fgRgb = hexToRgb(fgHex);
    const bgRgb = hexToRgb(bgHex);

    if (!fgRgb || !bgRgb) {
      scoreDisplay.textContent = "Error";
      return;
    }

    const l1 = getLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
    const l2 = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);

    const brightest = Math.max(l1, l2);
    const darkest = Math.min(l1, l2);
    
    const ratio = (brightest + 0.05) / (darkest + 0.05);
    const roundedRatio = Math.round(ratio * 100) / 100;

    // 1. Display score
    scoreDisplay.textContent = roundedRatio.toFixed(2);

    // 2. Validate compliance standards
    updateComplianceBadge(compAANormal, roundedRatio >= 4.5);
    updateComplianceBadge(compAALarge, roundedRatio >= 3.0);
    updateComplianceBadge(compAAANormal, roundedRatio >= 7.0);
    updateComplianceBadge(compAAALarge, roundedRatio >= 4.5);

    // 3. Update Preview styling
    previewWindow.style.color = fgHex;
    previewWindow.style.backgroundColor = bgHex;

    // 4. Update helper optimization tips text
    let tipText = "";
    if (roundedRatio < 3.0) {
      tipText = "대비율이 3.0:1 미만으로 매우 낮습니다. 글자나 배경을 대비가 큰 색상으로 조정하십시오. (웹 접근성 기준 미달)";
    } else if (roundedRatio >= 3.0 && roundedRatio < 4.5) {
      tipText = "대비율 3.0:1 이상으로 큰 텍스트(18pt 이상) 기준인 AA등급은 통과하나, 본문 텍스트 가독성(AA 4.5:1)에는 충분하지 않습니다. 텍스트를 조금 더 진하게 처리해 보세요.";
    } else if (roundedRatio >= 4.5 && roundedRatio < 7.0) {
      tipText = "대비율 4.5:1 이상으로 웹 콘텐츠 접근성(WCAG) AA 본문 텍스트 지침을 준수합니다. 대부분의 디지털 인터페이스 환경에서 쾌적하게 잘 보입니다.";
    } else {
      tipText = "대비율이 7.0:1을 초과하는 최적의 색 조합입니다. 최고 난이도의 접근성 표준인 AAA 본문 가독성 기준을 충족하므로 누구든지 편안하게 글을 읽을 수 있습니다.";
    }
    tipsBox.textContent = tipText;
  }

  function updateComplianceBadge(badgeElement, isPass) {
    const statusTag = badgeElement.querySelector('.comp-status');
    if (isPass) {
      statusTag.textContent = "통과";
      statusTag.className = "comp-status pass";
    } else {
      statusTag.textContent = "미달";
      statusTag.className = "comp-status fail";
    }
  }

  // Hex Text input validators and synchronizers
  function sanitizeHexInput(element, syncPicker) {
    let val = element.value.trim();
    if (!val.startsWith('#')) {
      val = '#' + val;
    }
    
    // Check regex pattern match
    const isValid = /^#[0-9A-F]{6}$/i.test(val) || /^#[0-9A-F]{3}$/i.test(val);
    if (isValid) {
      element.value = val;
      syncPicker.value = val.length === 4 
        ? '#' + val[1] + val[1] + val[2] + val[2] + val[3] + val[3] 
        : val;
      calculateContrast();
    }
  }

  // Synchronizers: picker change updates input, input keypress checks validity
  fgPicker.addEventListener('input', () => {
    fgHexInput.value = fgPicker.value.toUpperCase();
    calculateContrast();
  });

  bgPicker.addEventListener('input', () => {
    bgHexInput.value = bgPicker.value.toUpperCase();
    calculateContrast();
  });

  fgHexInput.addEventListener('input', () => {
    sanitizeHexInput(fgHexInput, fgPicker);
  });

  bgHexInput.addEventListener('input', () => {
    sanitizeHexInput(bgHexInput, bgPicker);
  });

  fgHexInput.addEventListener('blur', () => {
    if (!fgHexInput.value.startsWith('#')) fgHexInput.value = '#' + fgHexInput.value;
    if (fgHexInput.value.length !== 4 && fgHexInput.value.length !== 7) {
      fgHexInput.value = fgPicker.value.toUpperCase();
    }
  });

  bgHexInput.addEventListener('blur', () => {
    if (!bgHexInput.value.startsWith('#')) bgHexInput.value = '#' + bgHexInput.value;
    if (bgHexInput.value.length !== 4 && bgHexInput.value.length !== 7) {
      bgHexInput.value = bgPicker.value.toUpperCase();
    }
  });

  // Initial Calculation
  calculateContrast();
}


/* ==========================================================
   TAB 4: GRID LAYOUT CALCULATOR LOGIC
   ========================================================== */
let calculateGrid; // expose function to tab routing

function initGridLayoutCalc() {
  const gridWidthInput = document.getElementById('grid-width');
  const gridColsInput = document.getElementById('grid-cols');
  const gridGutterInput = document.getElementById('grid-gutter');
  const gridMarginInput = document.getElementById('grid-margin');
  
  const colWidthResult = document.getElementById('grid-col-width-result');
  const contentWidthResult = document.getElementById('grid-content-width-result');
  const gridCssCode = document.getElementById('grid-css-code');
  const copyGridBtn = document.getElementById('copy-grid-btn');
  const visualTrack = document.getElementById('grid-visual-track');

  calculateGrid = function() {
    const W = parseInt(gridWidthInput.value) || 1200;
    const N = parseInt(gridColsInput.value) || 12;
    const g = parseInt(gridGutterInput.value) || 0;
    const m = parseInt(gridMarginInput.value) || 0;

    if (W <= 0 || N <= 0) return;

    // Content area = W - 2*margins
    const contentW = W - (2 * m);
    contentWidthResult.textContent = `${contentW} px`;

    // Formula: Total width of N columns = ContentW - (N - 1) * gutter
    const totalGutterW = (N - 1) * g;
    const remainingW = contentW - totalGutterW;
    const colW = remainingW / N;

    if (colW < 0) {
      colWidthResult.textContent = "오류 (거터/여백 과다)";
      colWidthResult.style.color = "var(--accent-rose)";
      visualTrack.innerHTML = '<div style="color:var(--accent-rose); width:100%; display:flex; align-items:center; justify-content:center; font-size:0.9rem;">너비가 부족하여 그리드를 생성할 수 없습니다.</div>';
      return;
    }

    colWidthResult.style.color = "var(--accent-emerald)";
    colWidthResult.textContent = `${colW.toFixed(2)} px`;

    // 1. Generate clean CSS Grid rule block
    gridCssCode.textContent = `/* CSS Grid Generated Layout */
.grid-container {
  display: grid;
  grid-template-columns: repeat(${N}, 1fr);
  gap: ${g}px;
  max-width: ${W}px;
  padding: 0 ${m}px;
  margin: 0 auto;
}`;

    // 2. Render visual mock column blocks inside preview
    visualTrack.innerHTML = '';
    
    // Left margin track block
    if (m > 0) {
      const ml = document.createElement('div');
      ml.className = 'grid-preview-margin-left';
      ml.style.width = `${(m / W) * 100}%`;
      ml.title = `여백: ${m}px`;
      visualTrack.appendChild(ml);
    }

    // Append columns & gutters
    for (let i = 0; i < N; i++) {
      const col = document.createElement('div');
      col.className = 'grid-preview-col';
      col.style.flexGrow = colW.toString();
      col.title = `컬럼 ${i+1}: ${colW.toFixed(1)}px`;
      visualTrack.appendChild(col);

      if (i < N - 1 && g > 0) {
        const gutter = document.createElement('div');
        gutter.className = 'grid-preview-gutter';
        gutter.style.width = `${(g / W) * 100}%`;
        gutter.title = `거터: ${g}px`;
        visualTrack.appendChild(gutter);
      }
    }

    // Right margin track block
    if (m > 0) {
      const mr = document.createElement('div');
      mr.className = 'grid-preview-margin-right';
      mr.style.width = `${(m / W) * 100}%`;
      mr.title = `여백: ${m}px`;
      visualTrack.appendChild(mr);
    }
  };

  // Attach input listeners
  [gridWidthInput, gridColsInput, gridGutterInput, gridMarginInput].forEach(inp => {
    inp.addEventListener('input', calculateGrid);
  });

  // Copy CSS Grid code handler
  copyGridBtn.addEventListener('click', () => {
    copyToClipboard(gridCssCode.textContent, "그리드 CSS 코드가 클립보드에 복사되었습니다!");
  });

  // Initial Calculation
  calculateGrid();
}


/* ==========================================================
   TAB 5: STANDARD MATH DESIGN CALCULATOR LOGIC
   ========================================================== */
function initStandardCalculator() {
  const calcScreen = document.getElementById('calc-screen');
  const calcHistory = document.getElementById('calc-history');
  const calcKeys = document.querySelectorAll('.calc-key');

  let currentInput = "0";
  let fullExpression = "";
  let displayExpression = ""; // readable operators like × / ÷ for UX
  let resetOnNextKey = false;

  // Safe Math evaluator helper
  function evaluateExpression(expr) {
    // Remove standard percentage and format correctly
    // Regex matches numbers followed by % (e.g. 50% -> 50/100)
    let parsedExpr = expr.replace(/(\d+(\.\d+)?)%/g, '($1/100)');
    
    // Restrict input chars to absolute safety (digits, basic math, dots, parentheses)
    const sanitized = parsedExpr.replace(/[^0-9+\-*/().%]/g, '');

    try {
      // Safe function evaluation context
      const result = Function('"use strict";return (' + sanitized + ')')();
      
      if (result === undefined || Number.isNaN(result) || !Number.isFinite(result)) {
        return "Error";
      }

      // Check float precision and round to max 8 decimal places
      return parseFloat((Math.round(result * 100000000) / 100000000).toString());
    } catch (err) {
      return "Error";
    }
  }

  function handleCalcKeyPress(value) {
    if (value === 'C') {
      currentInput = "0";
      fullExpression = "";
      displayExpression = "";
      calcScreen.textContent = "0";
      calcHistory.textContent = "";
      resetOnNextKey = false;
      return;
    }

    if (value === 'backspace') {
      if (resetOnNextKey) {
        currentInput = "0";
        fullExpression = "";
        displayExpression = "";
        calcScreen.textContent = "0";
        calcHistory.textContent = "";
        resetOnNextKey = false;
        return;
      }
      
      if (fullExpression.length > 0) {
        fullExpression = fullExpression.slice(0, -1);
        displayExpression = displayExpression.slice(0, -1);
      }
      
      calcScreen.textContent = formatDisplay(fullExpression) || "0";
      return;
    }

    if (value === '=') {
      if (!fullExpression) return;
      
      calcHistory.textContent = displayExpression + " =";
      const result = evaluateExpression(fullExpression);
      
      calcScreen.textContent = result;
      fullExpression = result.toString();
      displayExpression = result.toString();
      resetOnNextKey = true;
      return;
    }

    // Handles standard operators
    const isOperator = ['+', '-', '*', '/'].includes(value);
    
    if (isOperator) {
      if (resetOnNextKey) {
        resetOnNextKey = false;
      }
      
      let operatorChar = value;
      if (value === '*') operatorChar = ' × ';
      if (value === '/') operatorChar = ' ÷ ';
      if (value === '+') operatorChar = ' + ';
      if (value === '-') operatorChar = ' - ';

      // Prevent consecutive operators, replace last one
      if (/[+\-*/]\s*$/.test(fullExpression)) {
        fullExpression = fullExpression.replace(/[+\-*/]\s*$/, value);
        displayExpression = displayExpression.replace(/\s*[+−×÷]\s*$/, operatorChar);
      } else {
        fullExpression += value;
        displayExpression += operatorChar;
      }
      
      calcScreen.textContent = formatDisplay(fullExpression);
      return;
    }

    // Number clicks, dots, percent, parenthesis
    if (resetOnNextKey) {
      fullExpression = "";
      displayExpression = "";
      resetOnNextKey = false;
    }

    let charToAppend = value;
    let displayChar = value;
    
    if (value === '%') {
      charToAppend = '%';
      displayChar = '%';
    }

    fullExpression += charToAppend;
    displayExpression += displayChar;
    
    calcScreen.textContent = formatDisplay(fullExpression);
  }

  // Format operators for screen presentation
  function formatDisplay(expr) {
    return expr
      .replace(/\*/g, ' × ')
      .replace(/\//g, ' ÷ ')
      .replace(/\+/g, ' + ')
      .replace(/-/g, ' - ');
  }

  // Attach button click events
  calcKeys.forEach(key => {
    key.addEventListener('click', () => {
      const val = key.getAttribute('data-val');
      handleCalcKeyPress(val);
    });
  });

  // Physical Keyboard Hooks
  window.addEventListener('keydown', (e) => {
    // Only capture keyboard if the design-calculator tab is currently active
    const activeTab = document.querySelector('.nav-item.active');
    if (!activeTab || activeTab.getAttribute('data-tab') !== 'standard-calc') {
      return;
    }

    let key = e.key;
    
    if (key >= '0' && key <= '9') {
      handleCalcKeyPress(key);
    } else if (key === '.') {
      handleCalcKeyPress('.');
    } else if (key === '+') {
      handleCalcKeyPress('+');
    } else if (key === '-') {
      handleCalcKeyPress('-');
    } else if (key === '*') {
      handleCalcKeyPress('*');
    } else if (key === '/') {
      e.preventDefault(); // prevent scroll/shortcuts
      handleCalcKeyPress('/');
    } else if (key === '%') {
      handleCalcKeyPress('%');
    } else if (key === '(' || key === ')') {
      handleCalcKeyPress(key);
    } else if (key === 'Enter' || key === '=') {
      e.preventDefault();
      handleCalcKeyPress('=');
    } else if (key === 'Backspace') {
      handleCalcKeyPress('backspace');
    } else if (key === 'Escape') {
      handleCalcKeyPress('C');
    }
  });
}
