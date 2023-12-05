(function (w, d) {
  zaraz.debug = (dj = "") => {
    document.cookie = `zarazDebug=${dj}; path=/`;
    location.reload();
  };
  window.zaraz._al = function (cy, cz, cA) {
    w.zaraz.listeners.push({ item: cy, type: cz, callback: cA });
    cy.addEventListener(cz, cA);
  };
  zaraz.preview = (cB = "") => {
    document.cookie = `zarazPreview=${cB}; path=/`;
    location.reload();
  };
  zaraz.i = function (cF) {
    const cG = d.createElement("div");
    cG.innerHTML = unescape(cF);
    const cH = cG.querySelectorAll("script");
    for (let cI = 0; cI < cH.length; cI++) {
      const cJ = d.createElement("script");
      cH[cI].innerHTML && (cJ.innerHTML = cH[cI].innerHTML);
      for (const cK of cH[cI].attributes) cJ.setAttribute(cK.name, cK.value);
      d.head.appendChild(cJ);
      cH[cI].remove();
    }
    d.body.appendChild(cG);
  };
  zaraz.f = async function (dg, dh) {
    const di = { credentials: "include", keepalive: !0, mode: "no-cors" };
    if (dh) {
      di.method = "POST";
      di.body = new URLSearchParams(dh);
      di.headers = { "Content-Type": "application/x-www-form-urlencoded" };
    }
    return await fetch(dg, di);
  };
  window.zaraz._p = async (bv) =>
    new Promise((bw) => {
      if (bv) {
        bv.e &&
          bv.e.forEach((bx) => {
            try {
              new Function(bx)();
            } catch (by) {
              console.error(`Error executing script: ${bx}\n`, by);
            }
          });
        Promise.allSettled((bv.f || []).map((bz) => fetch(bz[0], bz[1])));
      }
      bw();
    });
  zaraz.pageVariables = {};
  zaraz.__zcl = zaraz.__zcl || {};
  zaraz.track = async function (cL, cM, cN) {
    return new Promise((cO, cP) => {
      const cQ = { name: cL, data: {} };
      for (const cR of [localStorage, sessionStorage])
        Object.keys(cR || {})
          .filter((cT) => cT.startsWith("_zaraz_"))
          .forEach((cS) => {
            try {
              cQ.data[cS.slice(7)] = JSON.parse(cR.getItem(cS));
            } catch {
              cQ.data[cS.slice(7)] = cR.getItem(cS);
            }
          });
      Object.keys(zaraz.pageVariables).forEach(
        (cU) => (cQ.data[cU] = JSON.parse(zaraz.pageVariables[cU]))
      );
      Object.keys(zaraz.__zcl).forEach(
        (cV) => (cQ.data[`__zcl_${cV}`] = zaraz.__zcl[cV])
      );
      cQ.data.__zarazMCListeners = zaraz.__zarazMCListeners;
      //
      cQ.data = { ...cQ.data, ...cM };
      cQ.zarazData = zarazData;
      fetch("/cdn-cgi/zaraz/t", {
        credentials: "include",
        keepalive: !0,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cQ),
      })
        .catch(() => {
          //
          return fetch("/cdn-cgi/zaraz/t", {
            credentials: "include",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cQ),
          });
        })
        .then(function (cX) {
          zarazData._let = new Date().getTime();
          cX.ok || cP();
          return 204 !== cX.status && cX.json();
        })
        .then(async (cW) => {
          await zaraz._p(cW);
          "function" == typeof cN && cN();
        })
        .finally(() => cO());
    });
  };
  zaraz.set = function (cY, cZ, c$) {
    try {
      cZ = JSON.stringify(cZ);
    } catch (da) {
      return;
    }
    prefixedKey = "_zaraz_" + cY;
    sessionStorage && sessionStorage.removeItem(prefixedKey);
    localStorage && localStorage.removeItem(prefixedKey);
    delete zaraz.pageVariables[cY];
    if (void 0 !== cZ) {
      c$ && "session" == c$.scope
        ? sessionStorage && sessionStorage.setItem(prefixedKey, cZ)
        : c$ && "page" == c$.scope
        ? (zaraz.pageVariables[cY] = cZ)
        : localStorage && localStorage.setItem(prefixedKey, cZ);
      zaraz.__watchVar = { key: cY, value: cZ };
    }
  };
  for (const { m: db, a: dc } of zarazData.q.filter(({ m: dd }) =>
    ["debug", "set"].includes(dd)
  ))
    zaraz[db](...dc);
  for (const { m: de, a: df } of zaraz.q) zaraz[de](...df);
  delete zaraz.q;
  delete zarazData.q;
  zaraz.fulfilTrigger = function (bY, bZ, b$, ca) {
    zaraz.__zarazTriggerMap || (zaraz.__zarazTriggerMap = {});
    zaraz.__zarazTriggerMap[bY] || (zaraz.__zarazTriggerMap[bY] = "");
    zaraz.__zarazTriggerMap[bY] += "*" + bZ + "*";
    zaraz.track(
      "__zarazEmpty",
      { ...b$, __zarazClientTriggers: zaraz.__zarazTriggerMap[bY] },
      ca
    );
  };
  window.dataLayer = w.dataLayer || [];
  zaraz._processDataLayer = (dI) => {
    for (const dJ of Object.entries(dI))
      zaraz.set(dJ[0], dJ[1], { scope: "page" });
    if (dI.event) {
      if (
        zarazData.dataLayerIgnore &&
        zarazData.dataLayerIgnore.includes(dI.event)
      )
        return;
      let dK = {};
      for (let dL of dataLayer.slice(0, dataLayer.indexOf(dI) + 1))
        dK = { ...dK, ...dL };
      delete dK.event;
      dI.event.startsWith("gtm.") || zaraz.track(dI.event, dK);
    }
  };
  const dH = w.dataLayer.push;
  Object.defineProperty(w.dataLayer, "push", {
    configurable: !0,
    enumerable: !1,
    writable: !0,
    value: function (...dM) {
      let dN = dH.apply(this, dM);
      zaraz._processDataLayer(dM[0]);
      return dN;
    },
  });
  dataLayer.forEach((dO) => zaraz._processDataLayer(dO));
  zaraz._cts = () => {
    zaraz._timeouts && zaraz._timeouts.forEach((bB) => clearTimeout(bB));
    zaraz._timeouts = [];
  };
  zaraz._rl = function () {
    w.zaraz.listeners &&
      w.zaraz.listeners.forEach((bC) =>
        bC.item.removeEventListener(bC.type, bC.callback)
      );
    window.zaraz.listeners = [];
  };
  history.pushState = function () {
    try {
      zaraz._rl();
      zaraz._cts && zaraz._cts();
    } finally {
      History.prototype.pushState.apply(history, arguments);
      setTimeout(() => {
        zarazData.l = d.location.href;
        zarazData.t = d.title;
        zaraz.pageVariables = {};
        zaraz.__zarazMCListeners = {};
        zaraz.track("__zarazSPA");
      }, 100);
    }
  };
  history.replaceState = function () {
    try {
      zaraz._rl();
      zaraz._cts && zaraz._cts();
    } finally {
      History.prototype.replaceState.apply(history, arguments);
      setTimeout(() => {
        zarazData.l = d.location.href;
        zarazData.t = d.title;
        zaraz.pageVariables = {};
        zaraz.track("__zarazSPA");
      }, 100);
    }
  };
  zaraz._c = (fU) => {
    const { event: fV, ...fW } = fU;
    zaraz.track(fV, { ...fW, __zarazClientEvent: !0 });
  };
  zaraz._syncedAttributes = [
    "altKey",
    "clientX",
    "clientY",
    "pageX",
    "pageY",
    "button",
  ];
  zaraz.__zcl.track = !0;
  d.addEventListener("visibilitychange", (fX) => {
    zaraz._c(
      {
        event: "visibilityChange",
        visibilityChange: [
          { state: d.visibilityState, timestamp: new Date().getTime() },
        ],
      },
      1
    );
  });
  zaraz.__zcl.visibilityChange = !0;
  zaraz.__zarazMCListeners = {
    "google-analytics_v4_20ac": ["visibilityChange"],
  };
  zaraz._p({
    e: [
      '(function(w,d){w.zarazData.executed.push("Pageview");})(window,document)',
      'x=new XMLHttpRequest,x.withCredentials=!0,x.open("POST","https://stats.g.doubleclick.net/g/collect?t=dc&aip=1&_r=3&v=1&_v=j86&tid=G-SEKJ4E9T4H&cid=12967726-1fa7-45fb-b60f-7fc91a56fcf0&_u=KGDAAEADQAAAAC%7E&z=163548438",!0),x.onreadystatechange=function(){if (4 == x.readyState) {const domain = x.responseText.trim();if (domain.startsWith("1g") && domain.length > 2) {fetch("https://www.google.com/ads/ga-audiences?t=sr&aip=1&_r=4&v=1&_v=j86&tid=G-SEKJ4E9T4H&cid=12967726-1fa7-45fb-b60f-7fc91a56fcf0&_u=KGDAAEADQAAAAC%7E&z=163548438&slf_rd=1".replace("www.google.com", "www.google."+domain.slice(2)));}}},x.send();',
    ],
    f: [
      [
        "https://www.google.com/ads/ga-audiences?t=sr&aip=1&_r=4&v=1&_v=j86&tid=G-SEKJ4E9T4H&cid=12967726-1fa7-45fb-b60f-7fc91a56fcf0&_u=KGDAAEADQAAAAC%7E&z=163548438&slf_rd=1",
        {},
      ],
    ],
  });
})(window, document);
