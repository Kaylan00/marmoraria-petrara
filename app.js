
// === tweaks-panel.jsx ===
// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;width:100%;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null ? keyOrEdits : {
      [keyOrEdits]: val
    };
    setValues(prev => ({
      ...prev,
      ...edits
    }));
    window.parent.postMessage({
      type: '__edit_mode_set_keys',
      edits
    }, '*');
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({
  title = 'Tweaks',
  children
}) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({
    x: 16,
    y: 16
  });
  const PAD = 16;
  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth,
      h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y))
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);
  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);
  React.useEffect(() => {
    const onMsg = e => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({
      type: '__edit_mode_available'
    }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({
      type: '__edit_mode_dismissed'
    }, '*');
  };
  const onDragStart = e => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX,
      sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = ev => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy)
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, __TWEAKS_STYLE), /*#__PURE__*/React.createElement("div", {
    ref: dragRef,
    className: "twk-panel",
    "data-noncommentable": "",
    style: {
      right: offsetRef.current.x,
      bottom: offsetRef.current.y
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-hd",
    onMouseDown: onDragStart
  }, /*#__PURE__*/React.createElement("b", null, title), /*#__PURE__*/React.createElement("button", {
    className: "twk-x",
    "aria-label": "Close tweaks",
    onMouseDown: e => e.stopPropagation(),
    onClick: dismiss
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "twk-body"
  }, children)));
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "twk-sect"
  }, label), children);
}
function TweakRow({
  label,
  value,
  children,
  inline = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: inline ? 'twk-row twk-row-h' : 'twk-row'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label), value != null && /*#__PURE__*/React.createElement("span", {
    className: "twk-val"
  }, value)), children);
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label,
    value: `${value}${unit}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "twk-slider",
    min: min,
    max: max,
    step: step,
    value: value,
    onChange: e => onChange(Number(e.target.value))
  }));
}
function TweakToggle({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "twk-toggle",
    "data-on": value ? '1' : '0',
    role: "switch",
    "aria-checked": !!value,
    onClick: () => onChange(!value)
  }, /*#__PURE__*/React.createElement("i", null)));
}
function TweakRadio({
  label,
  value,
  options,
  onChange
}) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  const opts = options.map(o => typeof o === 'object' ? o : {
    value: o,
    label: o
  });
  const idx = Math.max(0, opts.findIndex(o => o.value === value));
  const n = opts.length;

  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;
  const segAt = clientX => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor((clientX - r.left - 2) / inner * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };
  const onPointerDown = e => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = ev => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    role: "radiogroup",
    onPointerDown: onPointerDown,
    className: dragging ? 'twk-seg dragging' : 'twk-seg'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-seg-thumb",
    style: {
      left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
      width: `calc((100% - 4px) / ${n})`
    }
  }), opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.value,
    type: "button",
    role: "radio",
    "aria-checked": o.value === value
  }, o.label))));
}
function TweakSelect({
  label,
  value,
  options,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("select", {
    className: "twk-field",
    value: value,
    onChange: e => onChange(e.target.value)
  }, options.map(o => {
    const v = typeof o === 'object' ? o.value : o;
    const l = typeof o === 'object' ? o.label : o;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })));
}
function TweakText({
  label,
  value,
  placeholder,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("input", {
    className: "twk-field",
    type: "text",
    value: value,
    placeholder: placeholder,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakNumber({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange
}) {
  const clamp = n => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({
    x: 0,
    val: 0
  });
  const onScrubStart = e => {
    e.preventDefault();
    startRef.current = {
      x: e.clientX,
      val: value
    };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = ev => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "twk-num-lbl",
    onPointerDown: onScrubStart
  }, label), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value,
    min: min,
    max: max,
    step: step,
    onChange: e => onChange(clamp(Number(e.target.value)))
  }), unit && /*#__PURE__*/React.createElement("span", {
    className: "twk-num-unit"
  }, unit));
}
function TweakColor({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("input", {
    type: "color",
    className: "twk-swatch",
    value: value,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakButton({
  label,
  onClick,
  secondary = false
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: secondary ? 'twk-btn secondary' : 'twk-btn',
    onClick: onClick
  }, label);
}
Object.assign(window, {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRow,
  TweakSlider,
  TweakToggle,
  TweakRadio,
  TweakSelect,
  TweakText,
  TweakNumber,
  TweakColor,
  TweakButton
});

// === shared.jsx ===
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// shared.jsx — common components: Logo, Header, Footer, Icons, Modal, FAB

const {
  useState,
  useEffect,
  useRef
} = React;

// ────────────────────────────────────────────────────────────────────────
// Icons
// ────────────────────────────────────────────────────────────────────────
const Icon = {
  Pin: p => /*#__PURE__*/React.createElement("svg", _extends({
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "10",
    r: "3"
  })),
  Whats: p => /*#__PURE__*/React.createElement("svg", _extends({
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.7-1-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.7.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .1.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3z M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3C8.6 21.5 10.3 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z"
  })),
  Phone: p => /*#__PURE__*/React.createElement("svg", _extends({
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.85.57 2.81.7a2 2 0 0 1 1.72 2.03Z"
  })),
  Mail: p => /*#__PURE__*/React.createElement("svg", _extends({
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("rect", {
    width: "20",
    height: "16",
    x: "2",
    y: "4",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m22 7-10 5L2 7"
  })),
  Clock: p => /*#__PURE__*/React.createElement("svg", _extends({
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "12 6 12 12 16 14"
  })),
  Fb: p => /*#__PURE__*/React.createElement("svg", _extends({
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.3.2 2.3.2v2.5h-1.3c-1.3 0-1.7.8-1.7 1.6V12h2.9l-.5 2.9h-2.4v7A10 10 0 0 0 22 12z"
  })),
  Ig: p => /*#__PURE__*/React.createElement("svg", _extends({
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("rect", {
    width: "20",
    height: "20",
    x: "2",
    y: "2",
    rx: "5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "17.5",
    x2: "17.51",
    y1: "6.5",
    y2: "6.5"
  })),
  Pin2: p => /*#__PURE__*/React.createElement("svg", _extends({
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M12 0C5.4 0 0 5.4 0 12c0 5 3 9.4 7.4 11.2-.1-.9-.2-2.4 0-3.5l1.6-6.6s-.4-.8-.4-2c0-1.9 1.1-3.3 2.5-3.3 1.2 0 1.7.9 1.7 2 0 1.2-.8 3-1.2 4.7-.3 1.4.7 2.5 2.1 2.5 2.5 0 4.4-2.6 4.4-6.4 0-3.4-2.4-5.7-5.9-5.7-4 0-6.4 3-6.4 6.1 0 1.2.5 2.5 1.1 3.2.1.1.1.2.1.4l-.4 1.5c-.1.2-.2.3-.5.2-1.7-.8-2.7-3.2-2.7-5.2 0-4.2 3.1-8.1 8.8-8.1 4.6 0 8.2 3.3 8.2 7.7 0 4.6-2.9 8.3-6.9 8.3-1.4 0-2.6-.7-3.1-1.5l-.8 3.2c-.3 1.1-1.1 2.6-1.6 3.4 1.2.4 2.5.6 3.8.6 6.6 0 12-5.4 12-12C24 5.4 18.6 0 12 0z"
  })),
  Arrow: p => /*#__PURE__*/React.createElement("svg", _extends({
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("line", {
    x1: "5",
    y1: "12",
    x2: "19",
    y2: "12"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "12 5 19 12 12 19"
  })),
  Up: p => /*#__PURE__*/React.createElement("svg", _extends({
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("polyline", {
    points: "18 15 12 9 6 15"
  })),
  X: p => /*#__PURE__*/React.createElement("svg", _extends({
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  })),
  Chev: p => /*#__PURE__*/React.createElement("svg", _extends({
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("polyline", {
    points: "9 18 15 12 9 6"
  })),
  Check: p => /*#__PURE__*/React.createElement("svg", _extends({
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("polyline", {
    points: "20 6 9 17 4 12"
  }))
};

// ────────────────────────────────────────────────────────────────────────
// Logo glyph: stylized "P" arch (mármore-inspired)
// ────────────────────────────────────────────────────────────────────────
function LogoGlyph({
  size = 44,
  color
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size * 0.74,
    viewBox: "0 0 44 32",
    fill: "none",
    style: {
      color: color || "currentColor"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 30 L10 6 L14 6 L14 30",
    stroke: "currentColor",
    strokeWidth: "1.4",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M22 30 L22 2 L30 18",
    stroke: "currentColor",
    strokeWidth: "1.4",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M30 18 L38 2 L38 30",
    stroke: "currentColor",
    strokeWidth: "1.4",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14 12 L22 12",
    stroke: "currentColor",
    strokeWidth: "1.4",
    strokeLinecap: "round",
    opacity: "0.7"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "22",
    cy: "12",
    r: "1.6",
    fill: "currentColor"
  }));
}
function Logo({
  light = false
}) {
  return /*#__PURE__*/React.createElement("a", {
    href: "index.html",
    className: "logo",
    "aria-label": "Petrara \u2014 in\xEDcio"
  }, /*#__PURE__*/React.createElement(LogoGlyph, {
    color: "var(--accent)"
  }), /*#__PURE__*/React.createElement("div", {
    className: "logo-mark"
  }, "PETRARA"), /*#__PURE__*/React.createElement("div", {
    className: "logo-sub"
  }, "M\xE1rmores & Granitos"));
}

// ────────────────────────────────────────────────────────────────────────
// Topbar
// ────────────────────────────────────────────────────────────────────────
function Topbar() {
  return /*#__PURE__*/React.createElement("div", {
    className: "topbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container topbar-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "topbar-info"
  }, /*#__PURE__*/React.createElement("span", {
    className: "topbar-item"
  }, /*#__PURE__*/React.createElement(Icon.Pin, null), " Av. Faria Lima, 2840 \u2014 Itaim Bibi, S\xE3o Paulo \u2014 SP, 04538-132")), /*#__PURE__*/React.createElement("div", {
    className: "topbar-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "topbar-item"
  }, /*#__PURE__*/React.createElement(Icon.Whats, null), " WhatsApp: (11) 94512-8800"), /*#__PURE__*/React.createElement("span", {
    className: "topbar-item"
  }, /*#__PURE__*/React.createElement(Icon.Phone, null), " Telefone: (11) 3045-2200"), /*#__PURE__*/React.createElement("span", {
    className: "topbar-item"
  }, "Siga-nos:"), /*#__PURE__*/React.createElement("div", {
    className: "topbar-socials"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    "aria-label": "Facebook"
  }, /*#__PURE__*/React.createElement(Icon.Fb, null)), /*#__PURE__*/React.createElement("a", {
    href: "#",
    "aria-label": "Instagram"
  }, /*#__PURE__*/React.createElement(Icon.Ig, null)), /*#__PURE__*/React.createElement("a", {
    href: "#",
    "aria-label": "Pinterest"
  }, /*#__PURE__*/React.createElement(Icon.Pin2, null))))));
}

// ────────────────────────────────────────────────────────────────────────
// Header (sticky w/ scroll state)
// ────────────────────────────────────────────────────────────────────────
function Header({
  active = "home",
  transparent = false,
  onCTAClick
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, {
      passive: true
    });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);
  const isTransparent = transparent && !scrolled;
  const close = () => setMenuOpen(false);
  return /*#__PURE__*/React.createElement("header", {
    className: `header ${scrolled ? "is-scrolled" : ""} ${isTransparent ? "is-transparent" : ""}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "container header-inner"
  }, /*#__PURE__*/React.createElement(Logo, null), /*#__PURE__*/React.createElement("nav", {
    className: "nav"
  }, /*#__PURE__*/React.createElement("a", {
    href: "index.html",
    className: `nav-link ${active === "home" ? "is-active" : ""}`
  }, "Home"), /*#__PURE__*/React.createElement("a", {
    href: "index.html#sobre",
    className: "nav-link"
  }, "Sobre"), /*#__PURE__*/React.createElement("a", {
    href: "index.html#servicos",
    className: "nav-link"
  }, "Servi\xE7os"), /*#__PURE__*/React.createElement("a", {
    href: "produto.html",
    className: `nav-link ${active === "produto" ? "is-active" : ""}`
  }, "Produtos"), /*#__PURE__*/React.createElement("a", {
    href: "portfolio.html",
    className: `nav-link ${active === "portfolio" ? "is-active" : ""}`
  }, "Portf\xF3lio"), /*#__PURE__*/React.createElement("a", {
    href: "index.html#depoimentos",
    className: "nav-link"
  }, "Depoimentos"), /*#__PURE__*/React.createElement("a", {
    href: "index.html#blog",
    className: "nav-link"
  }, "Blog")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline btn-sm header-cta",
    onClick: onCTAClick
  }, "Solicitar Or\xE7amento"), /*#__PURE__*/React.createElement("button", {
    className: `hamburger ${menuOpen ? "is-open" : ""}`,
    onClick: () => setMenuOpen(v => !v),
    "aria-label": "Menu",
    "aria-expanded": menuOpen
  }, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null))), /*#__PURE__*/React.createElement("div", {
    className: `mobile-drawer ${menuOpen ? "is-open" : ""}`,
    onClick: close
  }, /*#__PURE__*/React.createElement("div", {
    className: "mobile-drawer-inner",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "mobile-drawer-head"
  }, /*#__PURE__*/React.createElement(Logo, null), /*#__PURE__*/React.createElement("button", {
    className: "mobile-drawer-close",
    onClick: close,
    "aria-label": "Fechar"
  }, "\xD7")), /*#__PURE__*/React.createElement("nav", {
    className: "mobile-nav"
  }, /*#__PURE__*/React.createElement("a", {
    href: "index.html",
    onClick: close
  }, "Home"), /*#__PURE__*/React.createElement("a", {
    href: "index.html#sobre",
    onClick: close
  }, "Sobre"), /*#__PURE__*/React.createElement("a", {
    href: "index.html#servicos",
    onClick: close
  }, "Servi\xE7os"), /*#__PURE__*/React.createElement("a", {
    href: "produto.html",
    onClick: close
  }, "Produtos"), /*#__PURE__*/React.createElement("a", {
    href: "portfolio.html",
    onClick: close
  }, "Portf\xF3lio"), /*#__PURE__*/React.createElement("a", {
    href: "index.html#depoimentos",
    onClick: close
  }, "Depoimentos"), /*#__PURE__*/React.createElement("a", {
    href: "index.html#blog",
    onClick: close
  }, "Blog")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary mobile-drawer-cta",
    onClick: () => {
      close();
      onCTAClick && onCTAClick();
    }
  }, "Solicitar Or\xE7amento"), /*#__PURE__*/React.createElement("div", {
    className: "mobile-drawer-contact"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Icon.Whats, null), " (11) 94512-8800"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Icon.Phone, null), " (11) 3045-2200"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Icon.Pin, null), " Av. Faria Lima, 2840 \u2014 S\xE3o Paulo")))));
}

// ────────────────────────────────────────────────────────────────────────
// Footer
// ────────────────────────────────────────────────────────────────────────
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    className: "footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "footer-grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Logo, null), /*#__PURE__*/React.createElement("p", {
    className: "footer-blurb"
  }, "Tudo o que voc\xEA procura em pedras de qualidade, seja em m\xE1rmore, granito, quartzo ou quartzito \u2014 com curadoria e instala\xE7\xE3o assinadas."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: ".2em",
      textTransform: "uppercase",
      color: "rgba(255,255,255,.85)",
      marginBottom: 14
    }
  }, "Siga-nos nas redes"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10
    }
  }, ["Fb", "Ig", "Pin2"].map(k => {
    const I = Icon[k];
    return /*#__PURE__*/React.createElement("a", {
      key: k,
      href: "#",
      style: {
        width: 36,
        height: 36,
        border: "1px solid rgba(255,255,255,.18)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: "rgba(255,255,255,.7)",
        borderRadius: "50%"
      }
    }, /*#__PURE__*/React.createElement(I, null));
  })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "Nossos Servi\xE7os"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Instala\xE7\xE3o")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Escadas")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Pias & Lavat\xF3rios")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Balc\xF5es & Mesas")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Lavat\xF3rios Esculpidos")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Soleiras & Peitoris")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "Institucional"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "index.html"
  }, "Home")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Sobre")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "portfolio.html"
  }, "Portf\xF3lio")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Blog")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Pol\xEDtica de privacidade")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Termos de uso")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "Atendimento"), /*#__PURE__*/React.createElement("div", {
    className: "footer-contact"
  }, /*#__PURE__*/React.createElement("div", {
    className: "footer-contact-row"
  }, /*#__PURE__*/React.createElement(Icon.Phone, null), /*#__PURE__*/React.createElement("span", null, "(11) 3045-2200")), /*#__PURE__*/React.createElement("div", {
    className: "footer-contact-row"
  }, /*#__PURE__*/React.createElement(Icon.Whats, null), /*#__PURE__*/React.createElement("span", null, "(11) 94512-8800")), /*#__PURE__*/React.createElement("div", {
    className: "footer-contact-row"
  }, /*#__PURE__*/React.createElement(Icon.Mail, null), /*#__PURE__*/React.createElement("span", null, "contato@petrara.com.br")), /*#__PURE__*/React.createElement("div", {
    className: "footer-contact-row"
  }, /*#__PURE__*/React.createElement(Icon.Pin, null), /*#__PURE__*/React.createElement("span", null, "Av. Faria Lima, 2840", /*#__PURE__*/React.createElement("br", null), "Itaim Bibi, S\xE3o Paulo \u2014 SP")), /*#__PURE__*/React.createElement("div", {
    className: "footer-contact-row"
  }, /*#__PURE__*/React.createElement(Icon.Clock, null), /*#__PURE__*/React.createElement("span", null, "Seg a Sex: 8h \xE0s 18h", /*#__PURE__*/React.createElement("br", null), "S\xE1bado: 8h \xE0s 14h"))))), /*#__PURE__*/React.createElement("div", {
    className: "footer-bar"
  }, /*#__PURE__*/React.createElement("div", null, "\xA9 2026 Petrara \u2014 M\xE1rmores & Granitos. Todos os direitos reservados."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", null, "Curadoria de pedras desde 2008"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "rgba(255,255,255,.35)"
    }
  }, "Desenvolvido por Kaylan Argollo")))));
}

// ────────────────────────────────────────────────────────────────────────
// Floating action: WhatsApp + Back-to-top
// ────────────────────────────────────────────────────────────────────────
function Floaters() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, {
      passive: true
    });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const goWhats = () => {
    const msg = encodeURIComponent("Olá! Vim pelo site da Petrara e gostaria de um orçamento.");
    window.open(`https://wa.me/5511945128800?text=${msg}`, "_blank", "noopener");
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "fab-whats",
    onClick: goWhats
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      height: 28,
      borderRadius: "50%",
      background: "rgba(255,255,255,.18)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon.Whats, null)), "Fale Conosco"), /*#__PURE__*/React.createElement("button", {
    className: `fab-back ${show ? "is-visible" : ""}`,
    onClick: () => window.scrollTo({
      top: 0,
      behavior: "smooth"
    }),
    "aria-label": "Voltar ao topo"
  }, /*#__PURE__*/React.createElement(Icon.Up, null)));
}

// ────────────────────────────────────────────────────────────────────────
// Modal: multi-step quote
// ────────────────────────────────────────────────────────────────────────
function QuoteModal({
  open,
  onClose
}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    type: null,
    space: null,
    stone: null,
    area: "",
    name: "",
    email: "",
    phone: "",
    notes: ""
  });
  const total = 4;
  useEffect(() => {
    if (open) {
      setStep(0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  useEffect(() => {
    const onKey = e => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  const setF = (k, v) => setForm(f => ({
    ...f,
    [k]: v
  }));
  const next = () => setStep(s => Math.min(s + 1, total - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));
  const stepValid = (() => {
    if (step === 0) return !!form.type;
    if (step === 1) return !!form.space && !!form.stone;
    if (step === 2) return form.area.trim().length > 0;
    return form.name && form.email && form.phone;
  })();
  return /*#__PURE__*/React.createElement("div", {
    className: `modal-back ${open ? "is-open" : ""}`,
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-side"
  }, /*#__PURE__*/React.createElement("span", {
    className: "modal-steps-pill"
  }, "Etapa ", step + 1, " de ", total), /*#__PURE__*/React.createElement("h3", null, "Vamos desenhar o seu projeto."), /*#__PURE__*/React.createElement("p", null, "Em at\xE9 24h um especialista retorna com a curadoria de pedras e estimativa para a sua obra."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 28,
      paddingTop: 24,
      borderTop: "1px solid rgba(255,255,255,.14)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      fontSize: 12,
      color: "rgba(255,255,255,.78)",
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement(Icon.Whats, null), " Resposta em at\xE9 24h"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      fontSize: 12,
      color: "rgba(255,255,255,.78)"
    }
  }, /*#__PURE__*/React.createElement(Icon.Check, null), " Consultoria sem custo"))), /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, /*#__PURE__*/React.createElement("button", {
    className: "modal-close",
    onClick: onClose,
    "aria-label": "Fechar"
  }, /*#__PURE__*/React.createElement(Icon.X, null)), /*#__PURE__*/React.createElement("div", {
    className: "modal-progress"
  }, Array.from({
    length: total
  }).map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: `modal-progress-step ${i <= step ? "is-done" : ""}`
  }))), step === 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "modal-step-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "step-no"
  }, "\u2014 Tipo de obra"), /*#__PURE__*/React.createElement("span", {
    className: "step-count"
  }, "01 / 04")), /*#__PURE__*/React.createElement("h4", null, "O que voc\xEA est\xE1 construindo?"), /*#__PURE__*/React.createElement("p", {
    className: "modal-step-sub"
  }, "Selecione a categoria que mais se aproxima do seu projeto."), /*#__PURE__*/React.createElement("div", {
    className: "modal-fields"
  }, /*#__PURE__*/React.createElement("div", {
    className: "choice-grid"
  }, [{
    k: "residencial",
    t: "Residencial",
    s: "Casa, apartamento, reforma"
  }, {
    k: "comercial",
    t: "Comercial",
    s: "Loja, escritório, hotelaria"
  }, {
    k: "arquiteto",
    t: "Para Arquiteto",
    s: "Projeto assinado"
  }, {
    k: "outro",
    t: "Outro",
    s: "Conte mais nas observações"
  }].map(o => /*#__PURE__*/React.createElement("button", {
    key: o.k,
    className: `choice ${form.type === o.k ? "is-on" : ""}`,
    onClick: () => setF("type", o.k)
  }, /*#__PURE__*/React.createElement("div", {
    className: "choice-title"
  }, o.t), /*#__PURE__*/React.createElement("div", {
    className: "choice-sub"
  }, o.s)))))), step === 1 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "modal-step-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "step-no"
  }, "\u2014 Ambiente & pedra"), /*#__PURE__*/React.createElement("span", {
    className: "step-count"
  }, "02 / 04")), /*#__PURE__*/React.createElement("h4", null, "Onde a pedra entra?"), /*#__PURE__*/React.createElement("p", {
    className: "modal-step-sub"
  }, "Voc\xEA pode ajustar depois \u2014 isso ajuda a curadoria inicial."), /*#__PURE__*/React.createElement("div", {
    className: "modal-fields"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "Ambiente"), /*#__PURE__*/React.createElement("div", {
    className: "choice-grid"
  }, ["Cozinha", "Banheiro", "Sala/Living", "Fachada"].map(s => /*#__PURE__*/React.createElement("button", {
    key: s,
    className: `choice ${form.space === s ? "is-on" : ""}`,
    onClick: () => setF("space", s)
  }, /*#__PURE__*/React.createElement("div", {
    className: "choice-title"
  }, s))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "Tipo de pedra"), /*#__PURE__*/React.createElement("div", {
    className: "choice-grid"
  }, ["Mármore", "Granito", "Quartzito", "Ainda não sei"].map(s => /*#__PURE__*/React.createElement("button", {
    key: s,
    className: `choice ${form.stone === s ? "is-on" : ""}`,
    onClick: () => setF("stone", s)
  }, /*#__PURE__*/React.createElement("div", {
    className: "choice-title"
  }, s))))))), step === 2 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "modal-step-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "step-no"
  }, "\u2014 Dimens\xF5es"), /*#__PURE__*/React.createElement("span", {
    className: "step-count"
  }, "03 / 04")), /*#__PURE__*/React.createElement("h4", null, "Tamanho aproximado"), /*#__PURE__*/React.createElement("p", {
    className: "modal-step-sub"
  }, "Sem precis\xE3o \u2014 uma estimativa em metros lineares ou m\xB2 j\xE1 basta."), /*#__PURE__*/React.createElement("div", {
    className: "modal-fields"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "\xC1rea aproximada"), /*#__PURE__*/React.createElement("input", {
    className: "field-input",
    value: form.area,
    onChange: e => setF("area", e.target.value),
    placeholder: "Ex.: 6 m\xB2 de bancada + 2 m de soleira"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "Observa\xE7\xF5es (opcional)"), /*#__PURE__*/React.createElement("textarea", {
    className: "field-textarea",
    value: form.notes,
    onChange: e => setF("notes", e.target.value),
    placeholder: "Acabamento desejado, prazo, refer\xEAncias..."
  })))), step === 3 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "modal-step-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "step-no"
  }, "\u2014 Seus dados"), /*#__PURE__*/React.createElement("span", {
    className: "step-count"
  }, "04 / 04")), /*#__PURE__*/React.createElement("h4", null, "Como falamos com voc\xEA?"), /*#__PURE__*/React.createElement("p", {
    className: "modal-step-sub"
  }, "Os dados servem apenas para retornar com a proposta."), /*#__PURE__*/React.createElement("div", {
    className: "modal-fields"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "Nome completo"), /*#__PURE__*/React.createElement("input", {
    className: "field-input",
    value: form.name,
    onChange: e => setF("name", e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "E-mail"), /*#__PURE__*/React.createElement("input", {
    className: "field-input",
    type: "email",
    value: form.email,
    onChange: e => setF("email", e.target.value)
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "Telefone"), /*#__PURE__*/React.createElement("input", {
    className: "field-input",
    value: form.phone,
    onChange: e => setF("phone", e.target.value),
    placeholder: "(11) 90000-0000"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "modal-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "link-btn",
    onClick: prev,
    disabled: step === 0
  }, "\u2039 Voltar"), step < total - 1 ? /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    onClick: next,
    disabled: !stepValid
  }, "Continuar ", /*#__PURE__*/React.createElement(Icon.Arrow, null)) : /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    onClick: () => {
      alert("Pedido enviado! Retornaremos em até 24h.");
      onClose();
    },
    disabled: !stepValid
  }, "Enviar solicita\xE7\xE3o ", /*#__PURE__*/React.createElement(Icon.Arrow, null))))));
}

// ────────────────────────────────────────────────────────────────────────
// Reveal-on-scroll hook
// ────────────────────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach(el => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: "0px 0px -40px 0px"
    });
    els.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        el.classList.add("is-in");
      } else {
        io.observe(el);
      }
    });
    return () => io.disconnect();
  }, []);
}

// ────────────────────────────────────────────────────────────────────────
// Newsletter
// ────────────────────────────────────────────────────────────────────────
function Newsletter() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  return /*#__PURE__*/React.createElement("div", {
    className: "container",
    style: {
      position: "relative",
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "newsletter"
  }, /*#__PURE__*/React.createElement("div", {
    className: "newsletter-label"
  }, "Cadastre-se e fique por dentro das novidades."), /*#__PURE__*/React.createElement("form", {
    className: "newsletter-form",
    onSubmit: e => {
      e.preventDefault();
      alert("Inscrito! Obrigado.");
      setEmail("");
      setName("");
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: name,
    onChange: e => setName(e.target.value),
    placeholder: "Seu nome"
  }), /*#__PURE__*/React.createElement("input", {
    value: email,
    onChange: e => setEmail(e.target.value),
    placeholder: "Seu melhor e-mail",
    type: "email"
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    type: "submit"
  }, "Cadastrar"))));
}

// expose globals
Object.assign(window, {
  Icon,
  Logo,
  LogoGlyph,
  Topbar,
  Header,
  Footer,
  Floaters,
  QuoteModal,
  Newsletter,
  useReveal
});

// === home-sections.jsx ===
// home-sections.jsx — Home page sections

const {
  useState: useS,
  useEffect: useE,
  useRef: useR
} = React;

// Hero photos — Unsplash
const HERO_SLIDES = [{
  img: "assets/stones/01-calacatta.svg",
  eyebrow: "Design",
  title: "Transforme seus espaços",
  sub: "Curadoria de mármores e granitos para projetos que pedem permanência e sofisticação."
}, {
  img: "assets/stones/02-carrara.svg",
  eyebrow: "Cozinhas",
  title: "Bancadas que duram décadas",
  sub: "Pedras selecionadas em chapas inteiras — você escolhe a sua antes de cortar."
}, {
  img: "assets/stones/03-nero.svg",
  eyebrow: "Banheiros",
  title: "Lavatórios assinados",
  sub: "Esculpidos em peça única, com acabamentos sob medida."
}];

// ────────────────── HERO ──────────────────
function HeroFull({
  onCTA
}) {
  const [i, setI] = useS(0);
  useE(() => {
    const t = setInterval(() => setI(v => (v + 1) % HERO_SLIDES.length), 6500);
    return () => clearInterval(t);
  }, []);
  const s = HERO_SLIDES[i];
  return /*#__PURE__*/React.createElement("section", {
    className: "hero hero-full"
  }, HERO_SLIDES.map((sl, idx) => /*#__PURE__*/React.createElement("div", {
    key: idx,
    className: `hero-bg ${idx === i ? "is-on" : ""}`,
    style: {
      backgroundImage: `url(${sl.img})`
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "hero-overlay"
  }), /*#__PURE__*/React.createElement("div", {
    className: "container hero-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow eyebrow-light"
  }, "\u2014 ", s.eyebrow), /*#__PURE__*/React.createElement("h1", {
    className: "title-display hero-title"
  }, s.title), /*#__PURE__*/React.createElement("p", {
    className: "hero-sub"
  }, s.sub), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: onCTA
  }, "Solicitar Or\xE7amento")), /*#__PURE__*/React.createElement("button", {
    className: "hero-arrow hero-arrow-prev",
    onClick: () => setI(v => (v - 1 + HERO_SLIDES.length) % HERO_SLIDES.length),
    "aria-label": "Anterior"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "15 18 9 12 15 6"
  }))), /*#__PURE__*/React.createElement("button", {
    className: "hero-arrow hero-arrow-next",
    onClick: () => setI(v => (v + 1) % HERO_SLIDES.length),
    "aria-label": "Pr\xF3ximo"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "9 18 15 12 9 6"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "hero-dots"
  }, HERO_SLIDES.map((_, idx) => /*#__PURE__*/React.createElement("button", {
    key: idx,
    className: `hero-dot ${idx === i ? "is-on" : ""}`,
    onClick: () => setI(idx),
    "aria-label": `Slide ${idx + 1}`
  }))), /*#__PURE__*/React.createElement("div", {
    className: "hero-stripe"
  }));
}
function HeroSplit({
  onCTA
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "hero hero-split"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container hero-split-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-split-text"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "\u2014 Design"), /*#__PURE__*/React.createElement("h1", {
    className: "title-display hero-split-title"
  }, "Transforme", /*#__PURE__*/React.createElement("br", null), "seus espa\xE7os", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: "italic",
      color: "var(--accent)"
    }
  }, "com perman\xEAncia.")), /*#__PURE__*/React.createElement("p", {
    className: "hero-split-sub"
  }, "Mais de 18 anos selecionando pedras nobres em chapas inteiras \u2014 cada bancada, escada e revestimento parte de um bloco que voc\xEA escolhe."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      marginTop: 28
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: onCTA
  }, "Solicitar Or\xE7amento"), /*#__PURE__*/React.createElement("a", {
    className: "btn btn-outline",
    href: "portfolio.html"
  }, "Ver portf\xF3lio")), /*#__PURE__*/React.createElement("div", {
    className: "hero-split-stats"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "+1.200"), /*#__PURE__*/React.createElement("span", null, "obras entregues")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "18"), /*#__PURE__*/React.createElement("span", null, "anos de marmoraria")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "40+"), /*#__PURE__*/React.createElement("span", null, "pedras em estoque")))), /*#__PURE__*/React.createElement("div", {
    className: "hero-split-visual"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/stones/04-verde.svg",
    alt: "Cozinha em m\xE1rmore"
  }), /*#__PURE__*/React.createElement("div", {
    className: "hero-split-tag"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-split-tag-no"
  }, "01"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "hero-split-tag-t"
  }, "Calacatta Oro"), /*#__PURE__*/React.createElement("div", {
    className: "hero-split-tag-s"
  }, "It\xE1lia \xB7 3cm \xB7 polido"))))), /*#__PURE__*/React.createElement("div", {
    className: "hero-stripe"
  }));
}
function HeroEditorial({
  onCTA
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "hero hero-editorial"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container hero-edit-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-edit-mosaic"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-edit-mblock m1"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/stones/05-travertino.svg",
    alt: ""
  })), /*#__PURE__*/React.createElement("div", {
    className: "hero-edit-mblock m2"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/stones/06-graniteBrn.svg",
    alt: ""
  })), /*#__PURE__*/React.createElement("div", {
    className: "hero-edit-mblock m3"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/stones/07-onyxAmber.svg",
    alt: ""
  }))), /*#__PURE__*/React.createElement("div", {
    className: "hero-edit-text"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "\u2014 Petrara \xB7 est. 2008"), /*#__PURE__*/React.createElement("h1", {
    className: "title-display hero-edit-title"
  }, "Pedra \xE9 mat\xE9ria", /*#__PURE__*/React.createElement("br", null), "que n\xE3o envelhece."), /*#__PURE__*/React.createElement("p", {
    className: "hero-edit-sub"
  }, "Trabalhamos com m\xE1rmores, granitos e quartzitos selecionados na pedreira \u2014 cada projeto \xE9 assinado da escolha da chapa \xE0 instala\xE7\xE3o."), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: onCTA
  }, "Solicitar Or\xE7amento"))), /*#__PURE__*/React.createElement("div", {
    className: "hero-stripe"
  }));
}

// ────────────────── ABOUT ──────────────────
function About({
  onCTA
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "section-pad section-about",
    id: "sobre"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container about-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "about-text reveal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "\u2014 Sobre N\xF3s"), /*#__PURE__*/React.createElement("h2", {
    className: "title-section"
  }, "Especialistas em projetos profissionais de m\xE1rmores e granitos."), /*#__PURE__*/React.createElement("p", null, "A Petrara nasceu em 2008 da obsess\xE3o por mat\xE9ria-prima bem escolhida. Selecionamos chapas em pedreiras nacionais e importadas, mantendo um estoque curado de mais de quarenta pedras \u2014 todas dispon\xEDveis para visita antes do corte."), /*#__PURE__*/React.createElement("p", null, "Cada projeto \xE9 tratado como pe\xE7a \xFAnica. Da medi\xE7\xE3o em obra ao acabamento, o trabalho \xE9 assinado por uma equipe que entende que pedra n\xE3o tem segunda chance."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      marginTop: 30
    }
  }, /*#__PURE__*/React.createElement("a", {
    className: "btn btn-outline",
    href: "#"
  }, "Saiba Mais"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: onCTA
  }, "Solicitar Or\xE7amento"))), /*#__PURE__*/React.createElement("div", {
    className: "about-visual reveal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "about-img-a"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/stones/08-patagonia.svg",
    alt: "Cozinha com m\xE1rmore"
  })), /*#__PURE__*/React.createElement("div", {
    className: "about-img-b"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/stones/09-bege.svg",
    alt: "Banheiro com m\xE1rmore"
  })), /*#__PURE__*/React.createElement("div", {
    className: "about-quote"
  }, /*#__PURE__*/React.createElement("div", {
    className: "about-quote-mark"
  }, "\u201C"), /*#__PURE__*/React.createElement("p", null, "Cada chapa \xE9 \xFAnica.", /*#__PURE__*/React.createElement("br", null), "Por isso, cada projeto tamb\xE9m."), /*#__PURE__*/React.createElement("span", null, "\u2014 Helena Castro, fundadora")))));
}

// ────────────────── SERVICES (carousel) ──────────────────
const SERVICES = [{
  name: "Instalação",
  img: "assets/stones/10-graniteGry.svg"
}, {
  name: "Escadas",
  img: "assets/stones/11-rosaPort.svg"
}, {
  name: "Pias & Lavatórios",
  img: "assets/stones/12-azulMacaub.svg"
}, {
  name: "Balcões & Mesas",
  img: "assets/stones/01-calacatta.svg"
}, {
  name: "Lavatórios Esculpidos",
  img: "assets/stones/02-carrara.svg"
}, {
  name: "Soleiras & Peitoris",
  img: "assets/stones/03-nero.svg"
}];
function Services() {
  return /*#__PURE__*/React.createElement("section", {
    className: "section-pad section-services",
    id: "servicos"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container center-head reveal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "\u2014 Nossos Servi\xE7os"), /*#__PURE__*/React.createElement("h2", {
    className: "title-section"
  }, "Estamos sempre dispon\xEDveis,", /*#__PURE__*/React.createElement("br", null), "atendendo em diversos canais."), /*#__PURE__*/React.createElement("p", null, "Da especifica\xE7\xE3o ao p\xF3s-venda \u2014 uma equipe dedicada acompanha cada etapa do projeto.")), /*#__PURE__*/React.createElement("div", {
    className: "services-strip reveal"
  }, SERVICES.map((s, i) => /*#__PURE__*/React.createElement("a", {
    key: i,
    className: "service-tile",
    href: "produto.html",
    style: {
      backgroundImage: `url(${s.img})`
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "service-tile-overlay"
  }), /*#__PURE__*/React.createElement("div", {
    className: "service-tile-label"
  }, /*#__PURE__*/React.createElement("span", {
    className: "service-tile-no"
  }, "0", i + 1), /*#__PURE__*/React.createElement("span", {
    className: "service-tile-name"
  }, s.name))))));
}

// ────────────────── DIFFERENTIALS ──────────────────
const DIFFS = [{
  t: "Profissionais Capacitados",
  d: "Equipe formada por marmoristas e instaladores com mais de uma década de obra fina.",
  i: "users",
  img: "assets/stones/01-calacatta.svg"
}, {
  t: "Serviços Ricos em Acabamentos",
  d: "Polido, levigado, escovado, flameado — escolhemos junto com o arquiteto.",
  i: "tools",
  img: "assets/stones/05-travertino.svg"
}, {
  t: "Produtos de Alta Qualidade",
  d: "Estoque curado de pedras nacionais e importadas, em chapas inteiras.",
  i: "diamond",
  img: "assets/stones/03-nero.svg"
}, {
  t: "Trabalho Garantido",
  d: "Garantia formal de instalação e suporte por toda a vida útil do projeto.",
  i: "shield",
  img: "assets/stones/06-graniteBrn.svg"
}, {
  t: "Visita Técnica",
  d: "Medição em obra com tecnologia de gabaritos digitais — sem retrabalho.",
  i: "compass",
  img: "assets/stones/04-verde.svg"
}, {
  t: "Departamento de Projetos",
  d: "Trabalho próximo a arquitetos: do briefing ao desenho de paginação.",
  i: "drafting",
  img: "assets/stones/12-azulMacaub.svg"
}, {
  t: "Consultoria Gratuita",
  d: "Curadoria de pedras compatível com o orçamento e o uso final do ambiente.",
  i: "chat",
  img: "assets/stones/07-onyxAmber.svg"
}];
function DiffIcon({
  k
}) {
  const props = {
    width: 30,
    height: 30,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
  if (k === "users") return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
    d: "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "8.5",
    cy: "7",
    r: "4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M22 21v-2a4 4 0 0 0-3-3.87"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 3.13a4 4 0 0 1 0 7.75"
  }));
  if (k === "tools") return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
    d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
  }));
  if (k === "diamond") return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
    d: "M6 3h12l4 6-10 13L2 9z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M11 3 8 9l4 13 4-13-3-6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M2 9h20"
  }));
  if (k === "shield") return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
    d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "9 12 11 14 15 10"
  }));
  if (k === "compass") return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), /*#__PURE__*/React.createElement("polygon", {
    points: "16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"
  }));
  if (k === "drafting") return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
    d: "M12 3v17"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 7h14"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 21l7-4 7 4"
  }));
  if (k === "chat") return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
    d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
  }));
  return null;
}
function Differentials() {
  return /*#__PURE__*/React.createElement("section", {
    className: "section-pad section-diffs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "diff-bg"
  }), /*#__PURE__*/React.createElement("div", {
    className: "container center-head reveal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "\u2014 Nossos Diferenciais"), /*#__PURE__*/React.createElement("h2", {
    className: "title-section"
  }, "Por que nos escolher?"), /*#__PURE__*/React.createElement("p", null, "Realizamos servi\xE7os ricos em detalhes e cheios de capricho, mantendo-nos sempre atualizados \xE0s tend\xEAncias do mercado.")), /*#__PURE__*/React.createElement("div", {
    className: "container diff-grid reveal"
  }, DIFFS.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "diff-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "diff-card-bg",
    style: {
      backgroundImage: `url(${d.img})`
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "diff-card-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "diff-icon-wrap"
  }, /*#__PURE__*/React.createElement("span", {
    className: "diff-icon-front"
  }, /*#__PURE__*/React.createElement(DiffIcon, {
    k: d.i
  })), /*#__PURE__*/React.createElement("span", {
    className: "diff-icon-back"
  }, /*#__PURE__*/React.createElement(DiffIcon, {
    k: d.i
  }))), /*#__PURE__*/React.createElement("h3", {
    className: "diff-t"
  }, d.t), /*#__PURE__*/React.createElement("p", {
    className: "diff-d"
  }, d.d))))));
}

// ────────────────── PORTFOLIO grid (preview) ──────────────────
const PORTFOLIO_IMGS = ["assets/stones/04-verde.svg", "assets/stones/05-travertino.svg", "assets/stones/06-graniteBrn.svg", "assets/stones/07-onyxAmber.svg", "assets/stones/08-patagonia.svg", "assets/stones/09-bege.svg", "assets/stones/10-graniteGry.svg", "assets/stones/11-rosaPort.svg"];
function PortfolioGrid() {
  return /*#__PURE__*/React.createElement("section", {
    className: "section-pad section-portfolio",
    id: "portfolio"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container center-head reveal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "\u2014 Portf\xF3lio"), /*#__PURE__*/React.createElement("h2", {
    className: "title-section"
  }, "Confira alguns dos", /*#__PURE__*/React.createElement("br", null), "nossos trabalhos.")), /*#__PURE__*/React.createElement("div", {
    className: "container portfolio-grid reveal"
  }, PORTFOLIO_IMGS.map((src, i) => /*#__PURE__*/React.createElement("a", {
    key: i,
    className: "portfolio-cell",
    href: "portfolio.html",
    style: {
      backgroundImage: `url(${src})`
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "portfolio-cell-overlay"
  }, /*#__PURE__*/React.createElement("span", null, "Ver projeto"), /*#__PURE__*/React.createElement(Icon.Arrow, null))))), /*#__PURE__*/React.createElement("div", {
    className: "container",
    style: {
      textAlign: "center",
      marginTop: 50
    }
  }, /*#__PURE__*/React.createElement("a", {
    className: "btn btn-outline",
    href: "portfolio.html"
  }, "Ver portf\xF3lio completo")));
}

// ────────────────── TESTIMONIALS ──────────────────
const TESTS = [{
  q: "A curadoria foi cirúrgica. Visitei o galpão, escolhi a chapa exata e recebi a bancada como vi no dia.",
  n: "Renata Salgado",
  r: "Arquiteta — Studio Bossa"
}, {
  q: "Equipe pontual, instalação impecável, acabamento que segue impecável depois de quatro anos de uso pesado.",
  n: "André Mancini",
  r: "Cliente residencial — Pinheiros"
}, {
  q: "Trabalho com a Petrara em todos os meus projetos hoteleiros desde 2019. Não há substituto.",
  n: "Júlia Tavares",
  r: "Arquiteta de hotelaria"
}];
function Testimonials() {
  const [i, setI] = useS(0);
  return /*#__PURE__*/React.createElement("section", {
    className: "section-pad section-tests",
    id: "depoimentos"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container center-head reveal",
    style: {
      marginBottom: 36
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow eyebrow-light"
  }, "\u2014 Depoimentos"), /*#__PURE__*/React.createElement("h2", {
    className: "title-section",
    style: {
      color: "#fff"
    }
  }, "O que dizem os nossos clientes.")), /*#__PURE__*/React.createElement("div", {
    className: "container tests-stage reveal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tests-quote-mark"
  }, "\u201C"), /*#__PURE__*/React.createElement("p", {
    className: "tests-q"
  }, TESTS[i].q), /*#__PURE__*/React.createElement("div", {
    className: "tests-meta"
  }, /*#__PURE__*/React.createElement("strong", null, TESTS[i].n), /*#__PURE__*/React.createElement("span", null, TESTS[i].r)), /*#__PURE__*/React.createElement("div", {
    className: "tests-dots"
  }, TESTS.map((_, idx) => /*#__PURE__*/React.createElement("button", {
    key: idx,
    className: `tests-dot ${idx === i ? "is-on" : ""}`,
    onClick: () => setI(idx),
    "aria-label": `${idx + 1}`
  })))));
}

// ────────────────── BLOG ──────────────────
const POSTS = [{
  tag: "Cozinhas",
  t: "Como escolher o mármore certo para a sua cozinha",
  d: "Os mármores são uma das pedras mais importantes na hora de remodelar ou construir uma cozinha. Eles não apenas...",
  img: "assets/stones/12-azulMacaub.svg"
}, {
  tag: "Banheiros",
  t: "Granito ou quartzito: o que faz mais sentido no banheiro?",
  d: "Cada pedra confere elegância e sofisticação ao espaço. Seja para revestimento de pisos, paredes, mas...",
  img: "assets/stones/01-calacatta.svg"
}, {
  tag: "Materiais",
  t: "Quartzito Calacatta: o luxo do mármore com a dureza do granito",
  d: "Em bancadas de cozinha, pisos ou banheiros, pode adicionar um toque de elegância e sofisticação. No...",
  img: "assets/stones/02-carrara.svg"
}];
function Blog() {
  return /*#__PURE__*/React.createElement("section", {
    className: "section-pad section-blog",
    id: "blog"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container center-head reveal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "\u2014 Conte\xFAdo"), /*#__PURE__*/React.createElement("h2", {
    className: "title-section"
  }, "No nosso blog")), /*#__PURE__*/React.createElement("div", {
    className: "container blog-grid reveal"
  }, POSTS.map((p, i) => /*#__PURE__*/React.createElement("article", {
    key: i,
    className: "blog-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "blog-img",
    style: {
      backgroundImage: `url(${p.img})`
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "blog-body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "blog-tag"
  }, "\u2014 ", p.tag), /*#__PURE__*/React.createElement("h3", {
    className: "blog-t"
  }, p.t), /*#__PURE__*/React.createElement("p", {
    className: "blog-d"
  }, p.d), /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "blog-link"
  }, "Ver postagem ", /*#__PURE__*/React.createElement(Icon.Arrow, null)))))));
}
Object.assign(window, {
  HeroFull,
  HeroSplit,
  HeroEditorial,
  About,
  Services,
  Differentials,
  PortfolioGrid,
  Testimonials,
  Blog
});

// === app ===
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "moss",
  "typepair": "tech",
  "hero": "full"
} /*EDITMODE-END*/;
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [modalOpen, setModalOpen] = React.useState(false);
  React.useEffect(() => {
    document.documentElement.setAttribute("data-palette", t.palette);
    document.documentElement.setAttribute("data-typepair", t.typepair);
  }, [t.palette, t.typepair]);
  useReveal();
  const Hero = t.hero === "split" ? HeroSplit : t.hero === "editorial" ? HeroEditorial : HeroFull;
  const heroTransparent = t.hero === "full";
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Topbar, null), /*#__PURE__*/React.createElement(Header, {
    active: "home",
    transparent: heroTransparent,
    onCTAClick: () => setModalOpen(true)
  }), /*#__PURE__*/React.createElement(Hero, {
    onCTA: () => setModalOpen(true)
  }), /*#__PURE__*/React.createElement(About, {
    onCTA: () => setModalOpen(true)
  }), /*#__PURE__*/React.createElement(Services, null), /*#__PURE__*/React.createElement(Differentials, null), /*#__PURE__*/React.createElement(PortfolioGrid, null), /*#__PURE__*/React.createElement(Testimonials, null), /*#__PURE__*/React.createElement(Blog, null), /*#__PURE__*/React.createElement(Newsletter, null), /*#__PURE__*/React.createElement(Footer, null), /*#__PURE__*/React.createElement(Floaters, null), /*#__PURE__*/React.createElement(QuoteModal, {
    open: modalOpen,
    onClose: () => setModalOpen(false)
  }), /*#__PURE__*/React.createElement(TweaksPanel, {
    title: "Tweaks"
  }, /*#__PURE__*/React.createElement(TweakSection, {
    label: "Identidade visual"
  }), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Paleta",
    value: t.palette,
    options: [{
      value: "travertino",
      label: "Travertino"
    }, {
      value: "onyx",
      label: "Onyx"
    }, {
      value: "moss",
      label: "Musgo"
    }],
    onChange: v => setTweak("palette", v)
  }), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Fontes",
    value: t.typepair,
    options: [{
      value: "default",
      label: "Cormorant + Inter"
    }, {
      value: "modern",
      label: "Playfair + Manrope"
    }, {
      value: "condensed",
      label: "Bodoni + DM Sans"
    }, {
      value: "tech",
      label: "Space Grotesk + JetBrains Mono"
    }],
    onChange: v => setTweak("typepair", v)
  }), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Hero"
  }), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Layout do hero",
    value: t.hero,
    options: [{
      value: "full",
      label: "Full"
    }, {
      value: "split",
      label: "Split"
    }, {
      value: "editorial",
      label: "Edit."
    }],
    onChange: v => setTweak("hero", v)
  }), /*#__PURE__*/React.createElement(TweakSection, {
    label: "A\xE7\xF5es"
  }), /*#__PURE__*/React.createElement(TweakButton, {
    label: "Abrir modal de or\xE7amento",
    onClick: () => setModalOpen(true)
  })));
}
ReactDOM.createRoot(document.getElementById("app")).render(/*#__PURE__*/React.createElement(App, null));