/* Vista de cliente: entra na mesa com campo de visao de quem esta sentado e deixa olhar ao redor. */
(function () {
  var banner = document.createElement("div");
  banner.id = "sentar-banner";
  banner.textContent = "Vista de cliente: voce entrou na mesa. Arraste para olhar o salao dos dois lados.";
  var css=document.createElement("style");
  css.textContent="#sentar-banner{position:fixed;left:12px;bottom:18px;z-index:50;max-width:280px;background:rgba(0,0,0,.72);color:#fff;font:13px/1.35 Arial,sans-serif;padding:10px 12px;border-radius:8px;pointer-events:none}";
  document.head.appendChild(css);
  document.body.appendChild(banner);

  function findTour() {
    var viewer = document.getElementById("viewer");
    if (!viewer) return null;
    var stack = [viewer];
    var seen = 0;
    while (stack.length && seen < 400) {
      var node = stack.pop();
      seen++;
      if (!node) continue;
      if (node.data && node.data.tour) return node.data.tour;
      if (node.get && typeof node.get === "function") {
        try {
          var data = node.get("data");
          if (data && data.tour) return data.tour;
        } catch (e) {}
      }
      if (node.childNodes) {
        for (var i = 0; i < node.childNodes.length; i++) stack.push(node.childNodes[i]);
      }
    }
    return null;
  }

  function applySeated() {
    var tour = findTour();
    if (!tour || !tour.getMainViewer) return false;
    var viewer = tour.getMainViewer();
    if (!viewer || !viewer.get) return false;
    var player = viewer.get("player") || viewer;
    var media = player.get && player.get("media");
    var camera = media && media.get && media.get("camera");
    if (!camera || !camera.set) return false;
    camera.set("pitch", -3);
    camera.set("hfov", 76);
    return true;
  }

  var tries = 0;
  var timer = setInterval(function () {
    tries++;
    if (applySeated() || tries > 40) clearInterval(timer);
  }, 500);
})();
