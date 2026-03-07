import { jsx as x } from "react/jsx-runtime";
import { useState as he, useMemo as ye } from "react";
import "chartjs-adapter-dayjs-3";
import { Chart as j, CategoryScale as U, LinearScale as K, LogarithmicScale as ve, PointElement as xe, LineElement as Ce, BarElement as Q, Title as q, Tooltip as J, Legend as Y, Filler as Ae } from "chart.js";
import { Chart as X } from "react-chartjs-2";
import Ie from "chartjs-plugin-annotation";
import Le from "chartjs-plugin-datalabels";
import Se from "chartjs-plugin-stacked100";
import Be from "chartjs-plugin-trendline";
import De from "clsx";
var d = /* @__PURE__ */ ((e) => (e.Line = "Line", e.Bar = "Bar", e.HorizontalBar = "HorizontalBar", e.Pie = "Pie", e.Histogram = "Histogram", e.Area = "Area", e))(d || {});
const we = {
  axisLabel: "#666666",
  axisLine: "#e0e0e0",
  crosshair: "#000000",
  primary: "#1d4aff"
};
function ke() {
  return we;
}
function T(e, o = !1) {
  return e === "success" ? o ? "#00b300" : "#00ff00" : e === "warning" ? o ? "#ccaa00" : "#ffcc00" : e === "danger" ? o ? "#cc0000" : "#ff0000" : o ? "#0000aa" : "#0000ff";
}
function V(e, o = 1) {
  const t = parseInt(e.slice(1, 3), 16), l = parseInt(e.slice(3, 5), 16), a = parseInt(e.slice(5, 7), 16);
  return `rgba(${t}, ${l}, ${a}, ${o})`;
}
function F(e, o) {
  let t = !1;
  e[0] == "#" && (e = e.slice(1), t = !0);
  const l = parseInt(e, 16);
  let a = (l >> 16) + o;
  a > 255 ? a = 255 : a < 0 && (a = 0);
  let n = (l >> 8 & 255) + o;
  n > 255 ? n = 255 : n < 0 && (n = 0);
  let s = (l & 255) + o;
  return s > 255 ? s = 255 : s < 0 && (s = 0), (t ? "#" : "") + (s | n << 8 | a << 16).toString(16);
}
j.register(
  U,
  K,
  ve,
  xe,
  Ce,
  Q,
  q,
  J,
  Y,
  Ae,
  Se,
  Ie,
  Be,
  Le
);
const B = /* @__PURE__ */ new Map(), Pe = [10, 10], G = 1e-10;
function Re(e) {
  if (!e) return e;
  if (B.has(e)) return B.get(e);
  if (e.startsWith("var(--")) {
    const o = e.replace("var(", "").replace(")", ""), t = getComputedStyle(document.documentElement).getPropertyValue(o);
    return B.set(e, t), t;
  }
  return B.set(e, e), e;
}
function Ee(e, o) {
  if (typeof document > "u") return;
  const t = 8, l = -22.5, a = document.createElement("canvas");
  a.width = 1, a.height = t * 2;
  const n = a.getContext("2d");
  if (!n) return;
  n.fillStyle = e, n.fillRect(0, 0, a.width, a.height), n.fillStyle = o ? "rgba(35, 36, 41, 0.5)" : "rgba(255, 255, 255, 0.5)", n.fillRect(0, t, 1, 2 * t);
  const s = n.createPattern(a, "repeat");
  if (!s) return;
  const u = Math.cos(l), c = Math.sin(l);
  return s.setTransform(new DOMMatrix([u, c, -c, u, 0, 0])), s;
}
const Fe = ({
  datasets: e,
  labels: o,
  type: t,
  isInProgress: l = !1,
  isDarkModeOn: a = !1,
  isArea: n = !1,
  incompletenessOffsetFromEnd: s = -1,
  showValuesOnSeries: u,
  showPercentStackView: c,
  supportsPercentStackView: C,
  showPercentView: D,
  hideXAxis: A,
  hideYAxis: h,
  yAxisScaleType: ee,
  showMultipleYAxes: re = !1,
  legend: te = { display: !1 },
  goalLines: ae = [],
  isStacked: w = !0,
  showTrendLines: oe = !1,
  datalabelFormatter: O,
  className: ne
}) => {
  const ie = e, [Me] = he(null), se = !1, y = ke(), I = t === d.HorizontalBar;
  if (t === d.Pie)
    throw new Error("PieChart is not supported in this basic LineGraph SDK wrapper yet.");
  const b = [d.Bar, d.HorizontalBar, d.Histogram].includes(t), k = [d.Bar].includes(t), P = !!C && !!c, R = ee === "log10", le = b && w && se;
  function ce(r, i) {
    const p = !!r.compare && r.compare_label === "previous", fe = !r.compare || r.compare_label !== "previous", _ = r.data.length + s, W = r?.status ? T(r.status) : I ? r.backgroundColor || y.primary : r.borderColor || y.primary, m = p ? `${W}80` : W, pe = r?.status ? T(r.status, !0) : m;
    let N;
    k ? N = m : n && (N = V(m, P ? 1 : 0.5));
    let f = r.data;
    if (R && Array.isArray(f) && (f = f.map((g) => g === 0 ? G : g)), D && Array.isArray(f)) {
      const g = r.count || 1;
      f = f.map((H) => typeof H == "number" ? H / g * 100 : H);
    }
    const Z = t === d.Line && l && fe, z = Z && n, me = z ? Ee(V(m, 0.5), a) : void 0, ge = Z ? (g) => g.p1DataIndex >= _ ? Pe : void 0 : void 0, be = z ? (g) => g.p1DataIndex >= _ ? me : void 0 : void 0;
    return {
      borderColor: m,
      hoverBorderColor: k ? F(m, -20) : pe,
      hoverBackgroundColor: k ? F(m, -20) : void 0,
      fill: n ? "origin" : !1,
      backgroundColor: N,
      segment: {
        borderDash: ge,
        backgroundColor: be
      },
      borderWidth: b ? 0 : 2,
      pointRadius: Array.isArray(f) && f.length === 1 ? 4 : 0,
      hitRadius: Array.isArray(f) && f.length === 1 ? 8 : 0,
      order: 1,
      ...t === d.Histogram ? { barPercentage: 1 } : {},
      ...r,
      data: f,
      hoverBorderWidth: b ? 0 : 2,
      hoverBorderRadius: b ? 0 : 2,
      type: I ? "bar" : t.toLowerCase(),
      yAxisID: t === d.Line && re && i > 0 && !r.yAxisID ? `y${i}` : r.yAxisID ? r.yAxisID : "y",
      ...oe ? {
        trendlineLinear: {
          colorMin: m,
          colorMax: m,
          lineStyle: "dotted",
          width: 2
        }
      } : {}
    };
  }
  const $ = ie.map(ce);
  let v = Number.NEGATIVE_INFINITY;
  for (const r of $)
    if (Array.isArray(r.data))
      for (const i of r.data) {
        const p = Number(i);
        !p || p === G || Number.isNaN(p) || p > v && (v = p);
      }
  const E = v < 2 ? 2 : v < 5 ? 1 : 0, de = ae.filter(
    (r) => r.displayIfCrossed !== !1 || r.value >= v
  ), L = {
    color: y.axisLabel,
    font: {
      family: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", "Roboto", Helvetica, Arial, sans-serif',
      size: 12,
      weight: "normal"
    }
  }, S = {
    color: y.axisLine,
    tickColor: y.axisLine,
    tickBorderDash: [4, 2]
  }, M = {
    responsive: !0,
    maintainAspectRatio: !1,
    elements: {
      line: { tension: 0 }
    },
    interaction: {
      includeInvisible: !0
    },
    plugins: {
      stacked100: { enable: P, precision: 1 },
      datalabels: {
        color: "white",
        anchor: (r) => {
          const i = r.dataset?.data[r.dataIndex];
          return typeof i != "number" || i > 0 ? "end" : "start";
        },
        backgroundColor: (r) => r.dataset?.borderColor || "black",
        display: (r) => {
          const i = r.dataset?.data[r.dataIndex];
          return u === !0 && typeof i == "number" && i !== 0 ? "auto" : !1;
        },
        formatter: (r, i) => O ? O(r, i.datasetIndex) : String(r) + (P ? "%" : ""),
        borderWidth: 2,
        borderRadius: 4,
        borderColor: "white"
      },
      legend: te,
      annotation: {
        annotations: de.reduce((r, i, p) => (r[`line-${p}`] = {
          type: "line",
          yMin: i.value,
          yMax: i.value,
          borderWidth: 2,
          borderDash: [6, 6],
          borderColor: Re(i.borderColor),
          label: {
            content: i.label,
            display: i.displayLabel ?? !0,
            position: i.position ?? "end"
          }
        }, r), {})
      },
      tooltip: {
        enabled: !0,
        mode: "nearest",
        axis: I ? "y" : "x",
        intersect: le
      }
    },
    hover: {
      mode: b ? "point" : "nearest",
      axis: I ? "y" : "x",
      intersect: !1
    }
  };
  t === d.Bar ? M.scales = {
    x: {
      display: !A,
      beginAtZero: !0,
      stacked: w,
      ticks: { ...L, precision: E },
      grid: S
    },
    y: {
      display: !h,
      beginAtZero: !0,
      stacked: w,
      ticks: { ...L, precision: E },
      grid: S
    }
  } : t === d.Line && (M.scales = {
    x: {
      display: !A,
      beginAtZero: !0,
      ticks: { ...L },
      grid: { ...S, drawOnChartArea: !1 }
    },
    y: {
      display: !h,
      beginAtZero: !0,
      type: R ? "logarithmic" : "linear",
      stacked: c || n,
      ticks: { ...L, precision: R ? void 0 : E },
      grid: S
    }
  });
  const ue = {
    labels: o,
    datasets: $
  };
  return /* @__PURE__ */ x("div", { className: De("LineGraph w-full grow relative overflow-hidden", ne), style: { minHeight: "300px" }, children: /* @__PURE__ */ x(X, { type: b ? "bar" : t.toLowerCase(), data: ue, options: M }) });
};
j.register(
  U,
  K,
  Q,
  q,
  J,
  Y
);
const Ge = ({
  steps: e,
  className: o,
  backgroundColor: t = "rgba(29, 74, 255, 0.7)",
  borderColor: l = "rgba(29, 74, 255, 1)"
}) => {
  const a = ye(() => {
    const s = e.map((c) => c.count);
    return {
      labels: e.map((c) => c.name),
      datasets: [
        {
          label: "Users",
          data: s,
          backgroundColor: t,
          borderColor: l,
          borderWidth: 1,
          borderRadius: 4,
          barPercentage: 0.8
        }
      ]
    };
  }, [e, t, l]), n = {
    responsive: !0,
    maintainAspectRatio: !1,
    indexAxis: "y",
    // Horizontal bars representation for standard Funnels
    plugins: {
      legend: { display: !1 },
      tooltip: {
        callbacks: {
          label: (s) => {
            const u = s.dataIndex, c = s.parsed.x, C = u > 0 ? e[u - 1].count : c, D = u > 0 ? C - c : 0, A = u > 0 ? (D / C * 100).toFixed(1) + "%" : "";
            let h = `Count: ${c}`;
            return u > 0 && (h += ` (${A} dropoff from previous)`), h;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: !0,
        grid: { display: !0 }
      },
      y: {
        grid: { display: !1 }
      }
    }
  };
  return !e || e.length === 0 ? /* @__PURE__ */ x("div", { className: "p-4 text-center text-gray-500", children: "No funnel data available" }) : /* @__PURE__ */ x("div", { className: o || "", style: { minHeight: "300px", width: "100%" }, children: /* @__PURE__ */ x(X, { type: "bar", data: a, options: n }) });
};
function je(e) {
  if (!e?.results || !Array.isArray(e.results))
    return { labels: [], datasets: [] };
  const o = e.results, t = o.length > 0 ? o[0].labels || o[0].days || [] : [], l = o.map((a, n) => ({
    id: a.action?.id || n,
    label: a.action?.name || a.label || `Series ${n + 1}`,
    data: a.data || [],
    count: a.aggregated_value || a.count
    // Map other useful properties...
  }));
  return { labels: t, datasets: l };
}
export {
  Ge as FunnelChart,
  d as GraphType,
  Fe as LineGraph,
  je as mapQueryResponseToDataset
};
