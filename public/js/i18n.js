/**
 * Site-wide ES/EN toggle. Persists preference in localStorage;
 * broadcasts CustomEvent("rioysol:langchange", { detail: { lang } }) on change.
 */

(function () {
  var STORAGE_KEY = "rioysol-lang";

  /** @typedef {"en"|"es"} Lang */

  var MESSAGES = {
    en: {
      brandLocation: "Rio y Sol, Iquitos, Peru",
      langSwitcherAria: "Language",
      sliderSectionAria: "Featured scenes from the project",
      menuAboutAria: "About our conservation strategy",
      homeTaglineHtml:
        'River conservation on a living <br>stretch of the&nbsp;Amazon.',
      docTitleHome: "Rio y Sol",
      metaDescHome:
        "Rio y Sol protects a stretch of river near Iquitos, Peru: habitat, wildlife, and the people who care for it.",

      aboutSkip: "Skip to main content",
      aboutBackAria: "Back to Rio y Sol home",
      aboutBrandShort: "Rio y Sol",
      aboutHeaderTag: "Iquitos corridor · Amazonas · Loreto",
      docTitleAbout: "How we work · Rio y Sol",
      metaDescAbout:
        "Straightforward outline of Rio y Sol’s river conservation approach in Iquitos, Peru: landscape, community, wildlife, and long-term stewardship.",

      about_kicker: "Riparian stewardship · non-extractive landscape work",
      about_title: "How we protect this stretch of river",
      about_lede:
        "Rio y Sol works on a priority reach of the Amazon in Iquitos, Peru: water, forest, wildlife, and the people who live with all three. The program is built for the long term: local leadership, steady learning, and field measurements that track real change on the ground.",

      about_s1_h2: "1. Problem framing & landscape diagnostics",
      about_s1_p1_html:
        "Upstream pressures, weak enforcement, informal clearing, trash in the water, and a hotter, less predictable climate all hit this corridor at once. Single-lever projects (a park alone, a village plan alone, cleanups alone) usually stall once the rest of the system pushes back. We use a <strong>ridge-to-reef analog</strong> for freshwater: <strong>catchment-aware</strong>, corridor-wide, explicit about tenure and politics, and framed around the river as a full socio-ecological corridor.",
      about_s1_p2_html:
        "<strong>Landscape diagnostics</strong> combine mapping, threat triage, seasonal hydrology, and field checks. We prioritize places where <strong>keystone habitat patches</strong>, flagship species, and community needs overlap, and we tie every spatial layer to what people observe and report on the ground.",

      about_s2_h2: "2. Theory of change & programmatic pillars",
      about_s2_p1_html:
        "Our <strong>theory of change</strong> is straightforward: lasting gains need <em>stewardship capacity</em>, <em>incentive alignment</em>, and <em>accountable monitoring</em> moving together. Patrols and planting need policy and finance that reward good outcomes; monitoring needs a path from data to action.",
      about_s2_p2_html:
        "<strong>Community co-governance pathways</strong> (clear forums, clear roles, rights-holders and stakeholders named) sit next to <strong>nature-based solutions (NbS)</strong> chosen for shade, banks, filtration, and carbon on functional grounds. A practical <strong>MEAL</strong> stack (<strong>monitoring, evaluation, accountability, and learning</strong>) stays light: simple indicators first; deeper tools when they answer a concrete management question.",

      about_s3_h2: "3. Biodiversity, flagship species, & trophic signaling",
      about_s3_p1_html:
        "We track a <strong>surrogate species ladder</strong> (herons, otters, turtles, others) as <strong>trophic signaling</strong> for how the system is doing. Methods stay modest where they must (transects, structured observation). The goal is defensible trends over time and clear links to habitat condition.",
      about_s3_p2_html:
        "Restoration targets <strong>structural heterogeneity</strong> and native mixes aligned with <strong>flood-pulse</strong> dynamics and diverse, resilient planting palettes.",

      about_s4_h2: "4. Pollution abatement & materials stewardship",
      about_s4_p1_html:
        "Plastic here is a <strong>waste-systems problem with a watershed footprint</strong>: schools and river users, low-tech capture where crews can sustain it, and dialogue with vendors and haulers at chokepoints. Rules on dumping and harmful burning stay clear; outreach respects people’s time and dignity.",
      about_s4_p2_html:
        "<strong>Circular-economy pilots</strong> start when supply, labor, and buyers already align. Pilot design stays cautious because under-resourced recycling projects erode trust quickly.",

      about_s5_h2: "5. Climate resilience, hydrosocial risk, & equitable adaptation",
      about_s5_p1_html:
        "Climate information supports planning together with local judgment. We lead with <strong>no-regrets measures</strong>: shade and banks that buffer heat and surge, livelihood options aligned with keeping forest on the landscape. Programs budget for operation and maintenance before scale-up.",

      about_s6_h2: "6. Institutional positioning, partnerships, & finance readiness",
      about_s6_p1_html:
        "Partners include government, NGOs, universities, and sometimes business when values and deliverables line up. <strong>Due diligence firebreaks</strong> screen relationships that would cost community trust.",
      about_s6_p2_html:
        "<strong>Blended capital</strong> matches instrument to reality: grants for public-good layers, patient capital where revenue is plausible, catalytic funds to de-risk community enterprises. Any carbon-related work would use methods and benefit-sharing that hold up to scrutiny.",

      about_s7_h2: "7. Safeguarding, inclusion, & grievance sensitivity",
      about_s7_p1_html:
        "Safeguarding is daily practice: referrals people can use, procurement that screens known bad actors, and training schedules that fit caregivers and literacy levels. <strong>Grievance responsiveness</strong> is active and visible; timely, transparent handling of concerns protects the program’s legitimacy.",

      about_s8_h2: "8. Roadmap, KPIs, & adaptive management loops",
      about_s8_p1_html:
        "The roadmap phases in work: stabilize local stewardship, test connectivity where it matters, lock monitoring baselines, then expand, with explicit <strong>stop rules</strong> if indicators trend wrong. <strong>KPIs</strong> pair ecology with governance: attendance, budgets, dispute handling, and field outcomes read together.",
      about_s8_p2_html:
        "Quarterly <strong>learning retrospectives</strong> and annual plan reviews track shifts in climate, tenure, or health. Funds emphasize maintenance, candid reporting, and long-horizon trends tied to the river.",

      about_footer_contact_html:
        '<strong>Contact.</strong> For partnerships, research collaboration, or media inquiries:',
      about_footer_return_html: "← Return to the Rio y Sol experience",

      slideAltTpl:
        "Photograph from the Rio y Sol river conservation project near Iquitos, Peru ({{n}} of {{total}})",
    },
    es: {
      brandLocation: "Rio y Sol, Iquitos, Perú",
      langSwitcherAria: "Idioma",
      sliderSectionAria: "Escenas destacadas del proyecto",
      menuAboutAria: "Sobre nuestra estrategia de conservación",
      homeTaglineHtml:
        'Conservación fluvial en un tramo vivo del&nbsp;Amazonas.',
      docTitleHome: "Rio y Sol",
      metaDescHome:
        "Rio y Sol protege un tramo del río cerca de Iquitos, Perú: hábitat, fauna y las personas que lo cuidan.",

      aboutSkip: "Ir al contenido principal",
      aboutBackAria: "Volver al inicio de Rio y Sol",
      aboutBrandShort: "Rio y Sol",
      aboutHeaderTag: "Corredor de Iquitos · Amazonas · Loreto",
      docTitleAbout: "Cómo trabajamos · Rio y Sol",
      metaDescAbout:
        "Resumen claro del enfoque de conservación fluvial de Rio y Sol en Iquitos, Perú: paisaje, comunidad, fauna y custodia de largo plazo.",

      about_kicker: "Custodia ribereña · trabajo de paisaje no extractivo",
      about_title: "Cómo protegemos este tramo del río",
      about_lede:
        "Rio y Sol trabaja en un tramo prioritario del Amazonas en Iquitos, Perú: agua, bosque, fauna y las comunidades que conviven con los tres. El programa está pensado para el largo plazo: liderazgo local, aprendizaje continuo y mediciones de campo que muestran cambios reales en el terreno.",

      about_s1_h2: "1. Planteamiento del problema y diagnóstico del paisaje",
      about_s1_p1_html:
        "Las presiones aguas arriba, la debilidad institucional, la deforestación informal, los residuos en el agua y un clima más caliente y variable golpean a la vez este corredor. Proyectos con una sola palanca (solo un área protegida, solo un plan comunitario, solo limpiezas) suelen frenarse cuando el resto del sistema reacciona. Usamos una <strong>analogía de cuenca a costa</strong> aplicada al agua dulce: <strong>mirada hidrológica de cuenca</strong>, trabajo a escala del corredor, explícita sobre tenencia y gobernanza y centrada en el río como corredor socioecológico pleno.",
      about_s1_p2_html:
        "Los <strong>diagnósticos de paisaje</strong> combinan cartografía, triaje de amenazas, hidrología estacional y verificación en campo. Priorizamos lugares donde se cruzan <strong>parches de hábitat clave</strong>, especies bandera y necesidades locales, y relacionamos cada capa espacial con lo que la gente observa y reporta en el territorio.",

      about_s2_h2: "2. Marco de teoría del cambio y pilares programáticos",
      about_s2_p1_html:
        "Nuestra <strong>teoría del cambio</strong> es directa: logros duraderos requieren <em>capacidad de custodia</em>, <em>coherencia de incentivos</em> y <em>rendición de cuentas en monitoreo</em> trabajando al mismo tiempo. Las rondas y la forestación necesitan política y financiamiento que premien resultados positivos; el monitoreo necesita una ruta de datos a decisión.",
      about_s2_p2_html:
        "Las <strong>vías de cogobernanza comunitaria</strong> (foros claros, roles claros, titulares y actores reconocidos) conviven con <strong>soluciones basadas en la naturaleza (SbN)</strong> elegidas por sombra, ribereños, retención y carbono desde criterios funcionales. Un conjunto práctico de <strong>MEAL</strong> (<strong>monitoreo, evaluación, rendición de cuentas y aprendizaje</strong>) se mantiene liviano: indicadores simples primero y herramientas más densas cuando responden a una pregunta concreta de gestión.",

      about_s3_h2: "3. Biodiversidad, especies bandera y señales tróficas",
      about_s3_p1_html:
        "Seguimos una <strong>escala de especies sustitutas</strong> (garzas, nutrias, tortugas u otras) como <strong>señalización trófica</strong> del estado del sistema. Los métodos siguen siendo modestos donde hace falta (transectos, observación estructurada). La meta son tendencias defendibles en el tiempo y vínculos claros con la condición del hábitat.",
      about_s3_p2_html:
        "La restauración apunta a <strong>heterogeneidad estructural</strong> y mezclas nativas alineadas con la dinámica del <strong>pulso de crecida</strong> y paletas de siembra diversas y resilientes.",

      about_s4_h2: "4. Reducción de contaminación y gestión responsable de materiales",
      about_s4_p1_html:
        "Aquí los plásticos son un <strong>problema de sistemas de residuos con huella en la cuenca</strong>: escuelas y usuarios del río, captación de baja tecnología donde los equipos la pueden sostener, y diálogo con expendios y transportistas en los puntos de estrangulación. Las normas sobre vertidos y quemas perjudiciales siguen claras; la comunicación respeta tiempo y dignidad de las personas.",
      about_s4_p2_html:
        "Las <strong>pruebas piloto de economía circular</strong> arrancan cuando oferta de material, trabajo y mercado ya se alinean. El diseño sigue cauteloso: proyectos de reciclaje sin recursos erosionan rápido la confianza.",

      about_s5_h2: "5. Resiliencia climática, riesgo hidrosocial y adaptación equitativa",
      about_s5_p1_html:
        "La información climática sirve para planificar junto con el criterio local. Arrancamos con <strong>medidas sin arrependimiento</strong>: sombra y ribereños que amortiguan olas de calor y crecidas, opciones de medios de vida coherentes con mantener bosque en el paisaje. Los programas presupuestan operación y mantenimiento antes de escalar.",

      about_s6_h2: "6. Ubicación institucional, alianzas y preparación financiera",
      about_s6_p1_html:
        "Hay alianzas con Estado, OSC, universidades y a veces empresa cuando valores y compromisos encajan. Unos <strong>filtros rigurosos de debida diligencia</strong> evitan relaciones que dañarían la confianza comunitaria.",
      about_s6_p2_html:
        "El <strong>capital combinado</strong> empareja instrumento y realidad: donaciones para capas de bien público; capital paciente donde hay ingreso plausible; fondos catalíticos para de-riesgar emprendimientos locales. Todo trabajo relacionado al carbono usaría métodos y reparto de beneficios que resisten auditoría.",

      about_s7_h2: "7. Salvaguardas, inclusión y sensibilidad a quejas",
      about_s7_p1_html:
        "Las salvaguardias son práctica diaria: derivaciones utilizables por la comunidad, compras que filtran actores de alto riesgo y calendarios de formación compatibles con cuidados y nivel de alfabetización. Una <strong>respuesta efectiva a quejas</strong> es visible y activa; atender con transparencia y rapidez protege la legitimidad del programa.",

      about_s8_h2: "8. Hoja de ruta, KPI y ciclos de gestión adaptativa",
      about_s8_p1_html:
        "La ruta ordena las fases: estabilizar la custodia local, probar conectividad donde importa, fijar líneas base de monitoreo y luego escalar con <strong>reglas claras de detención</strong> si los indicadores van al revés. Los <strong>KPI</strong> aparean ecología y gobernanza: participación en acuerdos, presupuesto, tratamiento de conflictos y resultados en campo se leen juntos.",
      about_s8_p2_html:
        "Las <strong>retrospectivas de aprendizaje trimestrales</strong> y revisiones anuales del plan incorporan cambios en clima, tenencia o salud comunitaria. Los fondos destacan mantenimiento, reportes francos y tendencias de largo plazo ancladas al río.",

      about_footer_contact_html:
        "<strong>Contacto.</strong> Para alianzas, colaboración con investigadores o consultas de prensa:",
      about_footer_return_html: "← Volver a la experiencia Rio y Sol",

      slideAltTpl:
        "Fotografía del proyecto de conservación fluvial Rio y Sol cerca de Iquitos, Perú ({{n}} de {{total}})",
    },
  };

  function normalizeLang(raw) {
    return raw === "es" ? "es" : "en";
  }

  function readStoredLang() {
    try {
      return normalizeLang(localStorage.getItem(STORAGE_KEY));
    } catch (_) {
      return "en";
    }
  }

  /** @returns {Lang} */
  function getLang() {
    return window.__rioYsolLangCached != null ? window.__rioYsolLangCached : readStoredLang();
  }

  function setLang(lang) {
    lang = normalizeLang(lang);
    window.__rioYsolLangCached = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (_) {
      /* ignore */
    }
    applyDocumentLang(lang);
    applyMessages(lang);
    updateLangButtons(lang);
    dispatchChange(lang);
  }

  function applyDocumentLang(lang) {
    document.documentElement.lang = lang === "es" ? "es" : "en";
  }

  function t(lang, key) {
    var table = MESSAGES[lang];
    var tableEn = MESSAGES.en;
    if (table && table[key] !== undefined && table[key] !== "") return table[key];
    if (tableEn && tableEn[key] !== undefined) return tableEn[key];
    return key;
  }

  function interpolate(tpl, vars) {
    return tpl.replace(/\{\{(\w+)\}\}/g, function (_, k) {
      return vars[k] != null ? String(vars[k]) : "";
    });
  }

  function applyMessages(lang) {
    lang = normalizeLang(lang);
    applyDocumentLang(lang);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (!key) return;
      var val = t(lang, key);
      el.textContent = val;
    });

    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-html");
      if (!key) return;
      var val = t(lang, key);
      el.innerHTML = val;
    });

    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria");
      if (!key) return;
      el.setAttribute("aria-label", t(lang, key));
    });

    var path = typeof location !== "undefined" ? location.pathname : "/";
    var isAbout = /about\.html$/.test(path) || path.indexOf("/about") !== -1;
    document.title = t(lang, isAbout ? "docTitleAbout" : "docTitleHome");
    var meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", t(lang, isAbout ? "metaDescAbout" : "metaDescHome"));
    }

    /** Expose helpers for Slider */
    window.RioYSolI18n = window.RioYSolI18n || {};
    window.RioYSolI18n.getLang = getLang;
    window.RioYSolI18n.t = function (key) {
      return t(getLang(), key);
    };
    window.RioYSolI18n.slideAlt = function (idx, total) {
      return interpolate(t(getLang(), "slideAltTpl"), {
        n: idx + 1,
        total: total,
      });
    };
  }

  function dispatchChange(lang) {
    window.dispatchEvent(
      new CustomEvent("rioysol:langchange", {
        detail: { lang: normalizeLang(lang) },
      })
    );
  }

  function updateLangButtons(lang) {
    lang = normalizeLang(lang);
    document.querySelectorAll(".lang-toggle").forEach(function (group) {
      group.querySelectorAll("[data-lang]").forEach(function (btn) {
        var btnLang = normalizeLang(btn.getAttribute("data-lang"));
        btn.classList.toggle("is-active", btnLang === lang);
        btn.setAttribute("aria-pressed", btnLang === lang ? "true" : "false");
      });
    });
  }

  function bindControls() {
    document.querySelectorAll(".lang-toggle").forEach(function (group) {
      group.addEventListener("click", function (e) {
        var target = /** @type {Element} */ e.target.closest("[data-lang]");
        if (!target || !group.contains(target)) return;
        var langAttr = target.getAttribute("data-lang");
        setLang(langAttr || "en");
      });
      group.querySelectorAll("[data-lang]").forEach(function (btn) {
        btn.setAttribute("type", "button");
      });
    });
  }

  function initEarly() {
    var lang = readStoredLang();
    window.__rioYsolLangCached = lang;
    applyDocumentLang(lang);
    window.RioYSolI18n = window.RioYSolI18n || {};
    window.RioYSolI18n.getLang = getLang;
    window.RioYSolI18n.setLang = setLang;
    window.RioYSolI18n.t = function (key) {
      return t(getLang(), key);
    };
    window.RioYSolI18n.slideAlt = function (idx, total) {
      return interpolate(t(getLang(), "slideAltTpl"), {
        n: idx + 1,
        total: total,
      });
    };
  }

  /** Run after DOM is ready */
  function initDom() {
    var lang = getLang();
    applyMessages(lang);
    updateLangButtons(lang);
    bindControls();
  }

  initEarly();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDom);
  } else {
    initDom();
  }
})();
