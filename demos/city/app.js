(() => {
  'use strict';
      const VERSION = 1;
      const MAX_POINTS = 900;
      const SHARE_POINTS = 180;
      const RECENT_KEY = 'neon-trace-cities-v1';
      const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const ACHIEVEMENTS = [
        { id: 'first-road', name: '第一条道路', hint: '完成第一次拖动铺路' },
        { id: 'first-loop', name: '第一条环线', hint: '让道路回到出发附近' },
        { id: 'commercial', name: '商业街区', hint: '让街区开始聚集' },
        { id: 'first-landmark', name: '第一座地标', hint: '点击城市中的一个位置' },
        { id: 'three-landmarks', name: '城市坐标', hint: '点亮三座地标' }
      ];

      const canvas = document.getElementById('city-canvas');
      const ctx = canvas.getContext('2d');
      const poster = document.getElementById('poster-canvas');
      const posterCtx = poster.getContext('2d');
      const welcome = document.getElementById('welcome');
      const hud = document.getElementById('hud');
      const hint = document.getElementById('hint');
      const result = document.getElementById('result');
      const pauseButton = document.getElementById('pause-button');
      const pauseIndicator = document.getElementById('pause-indicator');
      const achievementEl = document.getElementById('achievement');
      const achievementText = document.getElementById('achievement-text');
      const liveStatus = document.getElementById('live-status');
      const customPanel = document.getElementById('custom-panel');
      const customButton = document.getElementById('custom-button');
      const achievementPanel = document.getElementById('achievement-panel');
      const achievementButton = document.getElementById('achievement-button');
      const achievementClose = document.getElementById('achievement-close');
      const achievementList = document.getElementById('achievement-list');
      const achievementCount = document.getElementById('achievement-count');
      const districtStyleInput = document.getElementById('district-style');
      const trafficInput = document.getElementById('traffic-density');
      const crowdInput = document.getElementById('crowd-density');
      const trafficValue = document.getElementById('traffic-value');
      const crowdValue = document.getElementById('crowd-value');
      const cityNameInput = document.getElementById('city-name-input');

      const ui = {
        cityName: document.getElementById('city-name'),
        cityCode: document.getElementById('city-code'),
        roadCount: document.getElementById('road-count'),
        blockCount: document.getElementById('block-count'),
        landmarkCount: document.getElementById('landmark-count'),
        resultCode: document.getElementById('result-code'),
        resultRoads: document.getElementById('result-roads'),
        resultBlocks: document.getElementById('result-blocks'),
        resultLandmarks: document.getElementById('result-landmarks'),
        resultSummary: document.getElementById('result-summary'),
        shareFallback: document.getElementById('share-fallback'),
        shareUrl: document.getElementById('share-url'),
        recent: document.getElementById('recent'),
        recentList: document.getElementById('recent-list'),
        recentClear: document.getElementById('recent-clear')
      };

      let viewport = { width: innerWidth, height: innerHeight, dpr: 1 };
      let mode = 'welcome';
      let pointer = { active: false, id: null, downX: 0, downY: 0, moved: false, lastTime: 0, lastX: 0, lastY: 0, reanchor: false, startPointCount: 0 };
      let achievementQueue = [];
      let achievementTimer = 0;
      let hintTimer = 0;
      let frame = 0;
      let resizeFrame = 0;
      let resizeTimer = 0;
      let lastHudUpdate = 0;
      let paused = false;
      let pausedAt = 0;
      let zoom = 1;
      let districtCache = { stamp: '', cells: [], map: new Map() };

      const DISTRICT_STYLE = {
        core:        { name: '核心区', code: 'CORE', rgb: '245,215,110', color: '#f5d76e' },
        commercial:  { name: '商业区', code: 'COM',  rgb: '242,97,168',  color: '#f261a8' },
        residential: { name: '居住区', code: 'RES',  rgb: '95,166,255',  color: '#5fa6ff' },
        park:        { name: '公园区', code: 'PARK', rgb: '105,224,156', color: '#69e09c' }
      };

      function freshState(seed = secureSeed()) {
        return {
          version: VERSION,
          seed,
          points: [],
          landmarks: [],
          history: [],
          achievements: [],
          createdAt: Date.now(),
          strokes: 0,
          blocks: 0,
          name: makeCityName(seed),
          custom: { district: 'auto', traffic: 1, crowd: 1 }
        };
      }

      let state = freshState();

      function secureSeed() {
        const data = new Uint32Array(1);
        if (crypto && crypto.getRandomValues) crypto.getRandomValues(data);
        else data[0] = Math.floor(Math.random() * 4294967295);
        return data[0] || 1;
      }

      function mulberry32(seed) {
        return function() {
          let t = seed += 0x6D2B79F5;
          t = Math.imul(t ^ t >>> 15, t | 1);
          t ^= t + Math.imul(t ^ t >>> 7, t | 61);
          return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
      }

      function hashRand(index, salt = 0) {
        let x = (state.seed ^ Math.imul(index + 1, 0x9E3779B1) ^ Math.imul(salt + 11, 0x85EBCA6B)) >>> 0;
        x ^= x >>> 16; x = Math.imul(x, 0x7FEB352D); x ^= x >>> 15; x = Math.imul(x, 0x846CA68B); x ^= x >>> 16;
        return (x >>> 0) / 4294967295;
      }

      function makeCityName(seed) {
        const a = ['未眠', '回声', '折光', '潮汐', '临界', '微光', '零点', '偏航', '夜行', '雾港'];
        const b = ['区', '港', '环线', '新城', '街', '岛', '站', '湾'];
        const rand = mulberry32(seed);
        return a[Math.floor(rand() * a.length)] + b[Math.floor(rand() * b.length)];
      }

      function cityCode() { return String(state.seed % 10000).padStart(4, '0'); }
      function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
      function distance(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
      function quantize(v) { return Math.round(clamp(v, 0, 1) * 999); }

      function resize() {
        // CSS owns the canvas display size. Keeping stale inline pixel sizes here
        // leaves black bands when Chrome/Safari switches to fullscreen.
        canvas.style.removeProperty('width');
        canvas.style.removeProperty('height');
        const bounds = canvas.getBoundingClientRect();
        viewport.width = Math.max(1, bounds.width || document.documentElement.clientWidth || innerWidth);
        viewport.height = Math.max(1, bounds.height || document.documentElement.clientHeight || innerHeight);
        viewport.dpr = Math.min(devicePixelRatio || 1, 2);
        const pixelWidth = Math.round(viewport.width * viewport.dpr);
        const pixelHeight = Math.round(viewport.height * viewport.dpr);
        if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
        if (canvas.height !== pixelHeight) canvas.height = pixelHeight;
        ctx.setTransform(viewport.dpr, 0, 0, viewport.dpr, 0, 0);
        if (pointer.active) pointer.reanchor = true;
      }

      function scheduleResize() {
        // Fullscreen transitions can report an intermediate viewport for one frame.
        // Sync now, after layout settles, and once more after the browser chrome moves.
        resize();
        cancelAnimationFrame(resizeFrame);
        clearTimeout(resizeTimer);
        resizeFrame = requestAnimationFrame(() => {
          resizeFrame = requestAnimationFrame(resize);
        });
        resizeTimer = setTimeout(resize, 160);
      }

      function pxPoint(point, width = viewport.width, height = viewport.height) {
        return { x: point.x * width, y: point.y * height };
      }

      function worldPointFromClient(clientX, clientY) {
        const centerX = viewport.width / 2;
        const centerY = viewport.height / 2;
        return {
          x: (clientX - centerX) / zoom + centerX,
          y: (clientY - centerY) / zoom + centerY
        };
      }

      function setZoom(nextZoom) {
        zoom = clamp(nextZoom, 1, 2.4);
        document.getElementById('zoom-level').textContent = `${Math.round(zoom * 100)}%`;
      }

      function updateCustomUI() {
        const custom = state.custom || { district: 'auto', traffic: 1, crowd: 1 };
        districtStyleInput.value = custom.district;
        trafficInput.value = Math.round(custom.traffic * 100);
        crowdInput.value = Math.round(custom.crowd * 100);
        trafficValue.textContent = `${trafficInput.value}%`;
        crowdValue.textContent = `${crowdInput.value}%`;
      }

      function setCustomPanel(open) {
        customPanel.hidden = !open;
        customButton.setAttribute('aria-expanded', String(open));
        if (open) setAchievementPanel(false);
      }

      function setAchievementPanel(open) {
        achievementPanel.hidden = !open;
        achievementButton.setAttribute('aria-expanded', String(open));
        if (open) setCustomPanel(false);
      }

      function renderAchievements() {
        if (!achievementList) return;
        const unlocked = new Set(state.achievements);
        const unlockedCount = ACHIEVEMENTS.reduce((count, item) => count + (unlocked.has(item.id) ? 1 : 0), 0);
        achievementCount.textContent = `${unlockedCount} / ${ACHIEVEMENTS.length}`;
        achievementList.textContent = '';
        ACHIEVEMENTS.forEach(item => {
          const isUnlocked = unlocked.has(item.id);
          const row = document.createElement('li');
          row.className = 'achievement-item' + (isUnlocked ? ' is-unlocked' : '');
          const mark = document.createElement('span');
          mark.className = 'achievement-item__mark';
          mark.textContent = isUnlocked ? '✓' : '·';
          const copy = document.createElement('div');
          const name = document.createElement('div');
          name.className = 'achievement-item__name';
          name.textContent = item.name;
          const hintText = document.createElement('div');
          hintText.className = 'achievement-item__hint';
          hintText.textContent = item.hint;
          copy.append(name, hintText);
          row.append(mark, copy);
          achievementList.appendChild(row);
        });
      }

      function updateCustomSetting() {
        state.custom = {
          district: districtStyleInput.value,
          traffic: Number(trafficInput.value) / 100,
          crowd: Number(crowdInput.value) / 100
        };
        trafficValue.textContent = `${trafficInput.value}%`;
        crowdValue.textContent = `${crowdInput.value}%`;
        districtCache.stamp = '';
        liveStatus.textContent = '城市自定义设置已更新';
      }

      function addPoint(clientX, clientY, isBreak = false, force = false) {
        if (mode !== 'explore' || paused) return;
        const now = performance.now();
        const world = worldPointFromClient(clientX, clientY);
        const x = clamp(world.x / viewport.width, 0, 1);
        const y = clamp(world.y / viewport.height, 0, 1);
        const previous = pointer.reanchor ? null : state.points[state.points.length - 1];
        const previousPx = previous ? pxPoint(previous) : null;
        const dist = previousPx ? Math.hypot(world.x - previousPx.x, world.y - previousPx.y) : 99;
        const dt = Math.max(8, now - (pointer.lastTime || now - 16));
        if (!force && !isBreak && dist < 4) return;

        // A browser can deliver one pointer event far away while fullscreen or
        // browser chrome is settling. Start a fresh segment instead of drawing
        // a giant diagonal across the map.
        const teleport = previous && dist > Math.max(180, Math.min(viewport.width, viewport.height) * .42);
        const segmentBreak = isBreak || pointer.reanchor || teleport;
        const speed = segmentBreak ? 0 : clamp(dist / dt / 1.4, 0, 1);
        const hold = !segmentBreak && dt > 90 ? clamp((dt - 90) / 500, 0, 1) : 0;
        state.points.push({ x, y, speed: +speed.toFixed(3), b: segmentBreak ? 1 : 0, hold: +hold.toFixed(2) });
        pointer.reanchor = false;

        // A stroke only becomes a road after it contains movement. A tap may place
        // a landmark, but it must not inflate the road counter.
        if (!isBreak && previous && previous.b) state.strokes += 1;
        if (state.points.length > MAX_POINTS) {
          const kept = state.points.filter((_, i) => i === 0 || i === state.points.length - 1 || i % 2 === 0 || state.points[i].b);
          state.points = kept.slice(-MAX_POINTS);
        }

        pointer.lastTime = now;
        pointer.lastX = clientX;
        pointer.lastY = clientY;
        calculateBlocks();
        checkAchievements();
        fadeHint();
      }

      function addLandmark(clientX, clientY) {
        if (mode !== 'explore' || paused || state.landmarks.length >= 24) return;
        const world = worldPointFromClient(clientX, clientY);
        const x = clamp(world.x / viewport.width, .035, .965);
        const y = clamp(world.y / viewport.height, .07, .95);
        const density = densityAt(x, y);
        const types = density > 4 ? ['tower', 'spire', 'gate'] : ['beacon', 'dome', 'tower'];
        const type = types[Math.floor(hashRand(state.landmarks.length, 72) * types.length)];
        state.landmarks.push({ x: +x.toFixed(4), y: +y.toFixed(4), type });
        state.history.push({ type: 'landmark' });
        if (state.landmarks.length === 1) queueAchievement('第一座地标已点亮', 'first-landmark');
        if (state.landmarks.length >= 3) queueAchievement('三座地标连成城市坐标', 'three-landmarks');
        updateHud();
      }

      function densityAt(x, y) {
        let count = 0;
        for (let i = 0; i < state.points.length; i += 3) {
          const p = state.points[i];
          if (!p.b && Math.hypot(p.x - x, p.y - y) < .075) count++;
        }
        return count;
      }

      function calculateBlocks() {
        const bins = new Map();
        for (const p of state.points) {
          if (p.b) continue;
          const key = Math.floor(p.x * 14) + ':' + Math.floor(p.y * 10);
          bins.set(key, (bins.get(key) || 0) + 1);
        }
        state.blocks = [...bins.values()].filter(v => v >= 3).length;
      }

      function hasLoop() {
        let start = null;
        let length = 0;
        for (const p of state.points) {
          if (p.b) { start = p; length = 0; continue; }
          if (!start) start = p;
          length++;
          if (length > 18 && Math.hypot(p.x - start.x, p.y - start.y) < .045) return true;
        }
        return false;
      }

      function checkAchievements() {
        if (state.strokes >= 1 && state.points.length >= 3) queueAchievement('第一条道路开始发光', 'first-road');
        if (state.blocks >= 6) queueAchievement('首个商业街区形成', 'commercial');
        if (state.points.length > 25 && hasLoop()) queueAchievement('城市的第一条环线闭合', 'first-loop');
        updateHudThrottled();
      }

      function queueAchievement(text, id) {
        if (state.achievements.includes(id) || achievementQueue.some(item => item.id === id)) return;
        state.achievements.push(id);
        renderAchievements();
        achievementQueue.push({ text, id });
        if (!achievementTimer) showNextAchievement();
      }

      function showNextAchievement() {
        const next = achievementQueue.shift();
        if (!next) { achievementTimer = 0; return; }
        achievementText.textContent = next.text;
        hint.hidden = true;
        achievementEl.classList.add('is-visible');
        liveStatus.textContent = '成就：' + next.text;
        achievementTimer = setTimeout(() => {
          achievementEl.classList.remove('is-visible');
          achievementTimer = setTimeout(showNextAchievement, 220);
        }, 1800);
      }

      function fadeHint() {
        clearTimeout(hintTimer);
        hintTimer = setTimeout(() => hint.classList.add('is-faded'), 2400);
      }

      function updateHudThrottled() {
        const now = performance.now();
        if (now - lastHudUpdate > 120) { updateHud(); lastHudUpdate = now; }
      }

      function updateHud() {
        ui.cityName.textContent = state.name;
        ui.cityCode.textContent = cityCode();
        ui.roadCount.textContent = state.strokes;
        ui.blockCount.textContent = state.blocks;
        ui.landmarkCount.textContent = state.landmarks.length;
        renderAchievements();
        const undoButton = document.getElementById('undo-button');
        if (undoButton) undoButton.disabled = !state.history.length;
      }

      function startExploring() {
        const customName = cityNameInput.value.trim().replace(/[<>]/g, '').slice(0, 18);
        if (customName) state.name = customName;
        cityNameInput.value = state.name;
        mode = 'explore';
        paused = false;
        pausedAt = 0;
        pauseButton.textContent = '暂停';
        pauseButton.setAttribute('aria-pressed', 'false');
        pauseIndicator.hidden = true;
        welcome.hidden = true;
        result.hidden = true;
        hud.hidden = false;
        setAchievementPanel(false);
        setCustomPanel(false);
        updateCustomUI();
        hint.hidden = false;
        hint.classList.remove('is-faded');
        updateHud();
        fadeHint();
      }

      function resetCity() {
        state = freshState();
        setZoom(1);
        location.hash = '';
        ui.shareFallback.hidden = true;
        startExploring();
      }

      function returnHome() {
        if (mode !== 'explore') return;
        const hasContent = state.points.length > 0 || state.landmarks.length > 0;
        if (hasContent) {
          saveRecent();
          liveStatus.textContent = '城市已保存，已返回主页';
        } else {
          liveStatus.textContent = '已返回主页，空城市未保存';
        }
        mode = 'welcome';
        paused = false;
        pausedAt = 0;
        pointer.active = false;
        pointer.id = null;
        canvas.classList.remove('is-drawing');
        welcome.hidden = false;
        hud.hidden = true;
        hint.hidden = true;
        pauseIndicator.hidden = true;
        setAchievementPanel(false);
        setCustomPanel(false);
        ui.shareFallback.hidden = true;
        renderRecent();
        state = freshState();
        districtCache.stamp = '';
        updateCustomUI();
        document.getElementById('start-button').innerHTML = '开始漫游 <span class="arrow">↗</span>';
        cityNameInput.value = '';
        document.querySelector('.intro').innerHTML = '拖动，会铺成道路。转弯，会点亮街区。停留，会让建筑生长。<strong>没有倒计时，直到你决定封城。</strong>';
        try { history.replaceState(null, '', location.href.split('#')[0]); } catch (_) { location.hash = ''; }
      }

      function undoLastStroke() {
        if (mode !== 'explore' || paused) return;
        const action = state.history.pop();
        if (!action) return;
        if (action.type === 'landmark') {
          state.landmarks.pop();
          // A tap starts with a break point so the next road cannot connect to it.
          // Remove that placeholder together with the landmark it created.
          if (state.points.length && state.points[state.points.length - 1].b) state.points.pop();
          liveStatus.textContent = '已撤回上一座地标';
        } else {
          let start = -1;
          for (let i = state.points.length - 1; i >= 0; i--) {
            if (state.points[i].b) { start = i; break; }
          }
          if (start < 0) return;
          state.points.splice(start);
          state.strokes = 0;
          let segmentLength = 0;
          for (const point of state.points) {
            if (point.b) {
              if (segmentLength > 1) state.strokes++;
              segmentLength = 1;
            } else segmentLength++;
          }
          if (segmentLength > 1) state.strokes++;
          liveStatus.textContent = '已撤回上一条道路';
        }
        districtCache.stamp = '';
        calculateBlocks();
        updateHud();
      }

      function onPointerDown(event) {
        if (mode !== 'explore' || paused) return;
        pointer.active = true;
        pointer.id = event.pointerId;
        pointer.downX = event.clientX;
        pointer.downY = event.clientY;
        pointer.lastTime = performance.now();
        pointer.moved = false;
        pointer.startPointCount = state.points.length;
        canvas.classList.add('is-drawing');
        try { canvas.setPointerCapture?.(event.pointerId); } catch (_) {}
        addPoint(event.clientX, event.clientY, true, true);
      }

      function onPointerMove(event) {
        if (mode !== 'explore' || paused) return;
        if (!pointer.active) return;
        if (pointer.active && pointer.id !== event.pointerId) return;
        if (pointer.active && Math.hypot(event.clientX - pointer.downX, event.clientY - pointer.downY) > 8) pointer.moved = true;
        addPoint(event.clientX, event.clientY);
      }

      function onPointerUp(event) {
        if (!pointer.active || pointer.id !== event.pointerId) return;
        if (!pointer.moved) addLandmark(event.clientX, event.clientY);
        else if (state.points.length > pointer.startPointCount + 1) state.history.push({ type: 'road' });
        pointer.active = false;
        pointer.id = null;
        canvas.classList.remove('is-drawing');
        try { canvas.releasePointerCapture(event.pointerId); } catch (_) {}
        updateHud();
      }

      function drawBackground(target, width, height, time, posterMode = false) {
        target.fillStyle = '#05070b';
        target.fillRect(0, 0, width, height);

        const glow = target.createRadialGradient(width * .68, height * .42, 0, width * .68, height * .42, width * .72);
        glow.addColorStop(0, 'rgba(21,54,64,.24)');
        glow.addColorStop(.45, 'rgba(10,23,34,.14)');
        glow.addColorStop(1, 'rgba(5,7,11,0)');
        target.fillStyle = glow;
        target.fillRect(0, 0, width, height);

        target.save();
        target.strokeStyle = 'rgba(122,159,178,.055)';
        target.lineWidth = 1;
        const grid = Math.max(32, Math.min(width, height) / 14);
        const offset = posterMode ? 0 : (time * .002) % grid;
        for (let x = -grid + offset; x < width + grid; x += grid) {
          target.beginPath(); target.moveTo(x, 0); target.lineTo(x, height); target.stroke();
        }
        for (let y = -grid + offset; y < height + grid; y += grid) {
          target.beginPath(); target.moveTo(0, y); target.lineTo(width, y); target.stroke();
        }
        target.restore();

        const stars = posterMode ? 90 : Math.min(120, Math.round(width * height / 14000));
        for (let i = 0; i < stars; i++) {
          const x = hashRand(i, 900) * width;
          const y = hashRand(i, 901) * height;
          const alpha = .08 + hashRand(i, 902) * .16;
          target.fillStyle = `rgba(140,190,208,${alpha})`;
          target.fillRect(x, y, 1, 1);
        }
      }

      function splitSegments() {
        const segments = [];
        let segment = [];
        for (const p of state.points) {
          if (p.b) {
            if (segment.length > 1) segments.push(segment);
            segment = [p];
          } else segment.push(p);
        }
        if (segment.length > 1) segments.push(segment);
        return segments;
      }

      function getDistricts() {
        const stamp = `${state.seed}:${state.points.length}`;
        if (districtCache.stamp === stamp) return districtCache;

        const columns = 6;
        const rows = 4;
        const grouped = new Map();
        for (const point of state.points) {
          if (point.b) continue;
          const gx = clamp(Math.floor(point.x * columns), 0, columns - 1);
          const gy = clamp(Math.floor(point.y * rows), 0, rows - 1);
          const key = `${gx}:${gy}`;
          const cell = grouped.get(key) || { key, gx, gy, count: 0, speed: 0, hold: 0, cx: 0, cy: 0 };
          cell.count++;
          cell.speed += point.speed || 0;
          cell.hold += point.hold || 0;
          cell.cx += point.x;
          cell.cy += point.y;
          grouped.set(key, cell);
        }

        const cells = [...grouped.values()]
          .filter(cell => cell.count >= 3)
          .map(cell => ({ ...cell, cx: cell.cx / cell.count, cy: cell.cy / cell.count, speed: cell.speed / cell.count, hold: cell.hold / cell.count }))
          .sort((a, b) => b.count - a.count);

        const core = cells[0];
        // Even a short first road is a valid core district. Leaving its type
        // undefined makes drawDistricts() crash before the road layer renders.
        if (core) core.type = 'core';

        // Pick spatially separated anchors, then assign nearby cells to the same
        // anchor. This creates contiguous districts instead of a checkerboard.
        const secondaryCells = cells.slice(core ? 1 : 0);
        const anchors = [];
        while (anchors.length < Math.min(3, secondaryCells.length)) {
          let best = null;
          let bestDistance = -1;
          for (const cell of secondaryCells) {
            if (anchors.includes(cell)) continue;
            const references = anchors.length ? anchors : core ? [core] : [];
            const nearest = references.length
              ? Math.min(...references.map(anchor => Math.hypot(cell.cx - anchor.cx, cell.cy - anchor.cy)))
              : 1;
            if (nearest > bestDistance) { best = cell; bestDistance = nearest; }
          }
          if (!best) break;
          anchors.push(best);
        }

        const secondaryTypes = ['commercial', 'residential', 'park'];
        const offset = Math.floor(hashRand(0, 433) * secondaryTypes.length);
        anchors.forEach((anchor, index) => anchor.anchorType = secondaryTypes[(index + offset) % secondaryTypes.length]);
        secondaryCells.forEach(cell => {
          const nearest = anchors.reduce((winner, anchor) => {
            const d = Math.hypot(cell.cx - anchor.cx, cell.cy - anchor.cy);
            return !winner || d < winner.distance ? { anchor, distance: d } : winner;
          }, null);
          cell.type = nearest?.anchor.anchorType || 'residential';
        });
        if (state.custom?.district && state.custom.district !== 'auto') {
          const customType = state.custom.district;
          const variants = Object.keys(DISTRICT_STYLE).filter(type => type !== customType);
          cells.forEach((cell, index) => {
            // Keep the chosen style dominant, but seed occasional pocket
            // districts so the map still feels like a lived-in city.
            const mix = hashRand(index + cell.gx * 7 + cell.gy * 13, 504) < .22;
            cell.type = mix ? variants[Math.floor(hashRand(index, 505) * variants.length)] : customType;
          });
        } else {
          // Auto districts also get a few interleaved pockets instead of hard
          // color borders. A nearby cell supplies the alternate neighborhood.
          cells.forEach((cell, index) => {
            if (hashRand(index + cell.gx * 7 + cell.gy * 13, 506) >= .16) return;
            const nearby = cells
              .filter(other => other !== cell && other.type !== cell.type)
              .sort((a, b) => Math.hypot(a.gx - cell.gx, a.gy - cell.gy) - Math.hypot(b.gx - cell.gx, b.gy - cell.gy))[0];
            if (nearby) cell.type = nearby.type;
          });
        }

        const map = new Map(cells.map(cell => [cell.key, cell]));
        districtCache = { stamp, cells, map, columns, rows };
        return districtCache;
      }

      function drawDistricts(target, width, height, posterMode = false) {
        const districts = getDistricts();
        if (!districts.cells.length) return;
        const cellWidth = width / districts.columns;
        const cellHeight = height / districts.rows;
        const unit = clamp(Math.min(width, height) / 760, .7, 1.8);
        const labelled = new Set();

        target.save();
        for (const cell of districts.cells.slice(0, 18)) {
          const style = DISTRICT_STYLE[cell.type] || DISTRICT_STYLE.residential;
          const centerX = cell.cx * width;
          const centerY = cell.cy * height;
          const zoneWidth = cellWidth * (.72 + Math.min(cell.count, 24) / 100);
          const zoneHeight = cellHeight * (.62 + Math.min(cell.count, 24) / 110);
          const gradient = target.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(zoneWidth, zoneHeight) * .68);
          gradient.addColorStop(0, `rgba(${style.rgb},${posterMode ? .1 : .075})`);
          gradient.addColorStop(.62, `rgba(${style.rgb},.035)`);
          gradient.addColorStop(1, `rgba(${style.rgb},0)`);
          target.fillStyle = gradient;
          target.fillRect(centerX - zoneWidth * .7, centerY - zoneHeight * .7, zoneWidth * 1.4, zoneHeight * 1.4);

          if (!labelled.has(cell.type) && cell.count >= 5) {
            labelled.add(cell.type);
            target.setLineDash([]);
            const labelX = centerX - zoneWidth / 2 + 7 * unit;
            const labelY = centerY - zoneHeight / 2 + 13 * unit;
            target.strokeStyle = `rgba(${style.rgb},.65)`;
            target.lineWidth = Math.max(.8, unit);
            target.beginPath();
            target.moveTo(labelX, labelY + 4 * unit);
            target.lineTo(labelX + 12 * unit, labelY + 4 * unit);
            target.stroke();
            target.fillStyle = `rgba(${style.rgb},${posterMode ? .82 : .7})`;
            target.font = `600 ${Math.max(8, 9 * unit)}px ui-monospace, monospace`;
            target.fillText(`${style.code} / ${style.name}`, labelX + 16 * unit, labelY + 7 * unit);
          }
        }
        target.restore();
      }

      function drawRoads(target, width, height, time, posterMode = false) {
        const segments = splitSegments();
        const scale = Math.min(width / 1200, height / 900);
        target.save();
        target.lineCap = 'round';
        target.lineJoin = 'round';

        for (let pass = 0; pass < 3; pass++) {
          for (let s = 0; s < segments.length; s++) {
            const segment = segments[s];
            if (segment.length < 2) continue;
            for (let i = 1; i < segment.length; i++) {
              const from = pxPoint(segment[i - 1], width, height);
              const to = pxPoint(segment[i], width, height);
              const speed = clamp(((segment[i - 1].speed || 0) + (segment[i].speed || 0)) / 2, 0, 1);
              target.beginPath();
              target.moveTo(from.x, from.y);
              target.lineTo(to.x, to.y);
              if (pass === 0) {
                target.strokeStyle = `rgba(34,203,211,${.065 + speed * .07})`;
                target.lineWidth = Math.max((5 + speed * 4.2) * scale, 4.2);
                target.shadowColor = '#34dce0';
                target.shadowBlur = (posterMode ? 11 : 7) + speed * 3;
              } else if (pass === 1) {
                target.strokeStyle = `rgba(63,220,222,${.38 + speed * .18})`;
                target.lineWidth = Math.max((1.65 + speed * 1.2) * scale, 1.45);
                target.shadowBlur = 2.5;
              } else {
                target.strokeStyle = `rgba(205,255,250,${.68 + speed * .18})`;
                target.lineWidth = Math.max((.55 + speed * .28) * scale, .5);
                target.shadowBlur = 0;
              }
              target.stroke();
            }
          }
        }

        target.setLineDash([3 * Math.max(scale, .7), 12 * Math.max(scale, .7)]);
        target.lineDashOffset = posterMode || reducedMotion ? 0 : -time * .012;
        target.strokeStyle = 'rgba(245,215,110,.34)';
        target.lineWidth = Math.max(.55, scale * .7);
        for (const segment of segments) {
          if (segment.length < 8) continue;
          target.beginPath();
          segment.forEach((p, i) => {
            const point = pxPoint(p, width, height);
            if (i === 0) target.moveTo(point.x, point.y); else target.lineTo(point.x, point.y);
          });
          target.stroke();
        }
        target.restore();
      }

      function drawCars(target, width, height, time, posterMode = false) {
        const segments = splitSegments();
        const unit = clamp(Math.min(width, height) / 760, .65, 1.8);
        const carColors = ['#f5d76e', '#57e6e6', '#f261a8'];
        let carIndex = 0;

        target.save();
        target.lineCap = 'round';
        for (let s = 0; s < segments.length; s++) {
          const segment = segments[s];
          if (segment.length < 7) continue;
          const traffic = state.custom?.traffic ?? 1;
          const count = Math.min(12, Math.max(0, Math.round(segment.length / 12 * traffic)));
          for (let c = 0; c < count; c++) {
            const seedIndex = s * 17 + c;
            const raw = posterMode || reducedMotion
              ? hashRand(seedIndex, 611)
              : (time * (.000018 + hashRand(seedIndex, 612) * .000012) + hashRand(seedIndex, 611)) % 1;
            const position = raw * (segment.length - 2) + 1;
            const index = Math.floor(position);
            const fraction = position - index;
            const from = pxPoint(segment[index], width, height);
            const to = pxPoint(segment[index + 1], width, height);
            const x = from.x + (to.x - from.x) * fraction;
            const y = from.y + (to.y - from.y) * fraction;
            const angle = Math.atan2(to.y - from.y, to.x - from.x);
            const color = carColors[carIndex % carColors.length];
            const length = (8 + hashRand(seedIndex, 613) * 4) * unit;
            const breadth = (3.2 + hashRand(seedIndex, 614) * 1.4) * unit;

            target.save();
            target.translate(x, y);
            target.rotate(angle);
            target.shadowColor = color;
            target.shadowBlur = 6 * unit;
            target.fillStyle = 'rgba(8,15,21,.96)';
            target.strokeStyle = color;
            target.lineWidth = Math.max(.65, .75 * unit);
            target.beginPath();
            target.roundRect(-length / 2, -breadth / 2, length, breadth, breadth * .45);
            target.fill();
            target.stroke();
            target.shadowBlur = 0;
            target.fillStyle = color;
            target.globalAlpha = .8;
            target.fillRect(length * .2, -breadth * .27, Math.max(1, unit), Math.max(1, breadth * .22));
            target.globalAlpha = .55;
            target.fillRect(-length * .35, -breadth * .27, Math.max(1, unit), Math.max(1, breadth * .22));
            target.restore();
            carIndex++;
          }
        }
        target.restore();
      }

      function drawFoodStreets(target, width, height, time, posterMode = false) {
        const candidates = buildingCandidates().filter(item => item.type === 'commercial');
        const unit = clamp(Math.min(width, height) / 760, .6, 1.8);
        const occupied = [];
        target.save();
        for (let i = 0; i < candidates.length; i += 1) {
          const item = candidates[i];
          if (i % 2 === 1 && hashRand(item.index, 721) < .35) continue;
          const p = pxPoint(item.p, width, height);
          const prev = pxPoint(item.prev, width, height);
          const angle = Math.atan2(p.y - prev.y, p.x - prev.x);
          const normal = angle + Math.PI / 2;
          const distanceFromRoad = (13 + (i % 3) * 5) * unit * (item.side || 1);
          const x = p.x + Math.cos(normal) * distanceFromRoad;
          const y = p.y + Math.sin(normal) * distanceFromRoad;
          const size = (4.5 + (i % 3) * .8) * unit;
          if (occupied.some(point => Math.hypot(x - point.x, y - point.y) < size * 2.2)) continue;
          occupied.push({ x, y });

          target.save();
          target.translate(x, y);
          target.rotate(angle);
          target.shadowColor = '#f261a8';
          target.shadowBlur = 5 * unit;
          target.fillStyle = 'rgba(34,14,28,.95)';
          target.strokeStyle = 'rgba(242,97,168,.82)';
          target.lineWidth = Math.max(.55, .65 * unit);
          target.fillRect(-size, -size * .58, size * 2, size * 1.16);
          target.strokeRect(-size, -size * .58, size * 2, size * 1.16);
          target.shadowBlur = 0;
          target.fillStyle = `rgba(245,215,110,${posterMode || reducedMotion ? .85 : .55 + Math.sin(time * .004 + i) * .18})`;
          target.fillRect(-size * .52, -size * .16, Math.max(1, unit), Math.max(1, unit * .65));
          target.fillRect(size * .14, -size * .16, Math.max(1, unit), Math.max(1, unit * .65));
          target.restore();
        }
        if (candidates.length >= 4) {
          const first = candidates[0];
          const p = pxPoint(first.p, width, height);
          target.fillStyle = 'rgba(242,97,168,.72)';
          target.font = `600 ${Math.max(8, 9 * unit)}px ui-monospace, monospace`;
          target.fillText('FOOD / 美食街', p.x + 10 * unit, p.y - 13 * unit);
        }
        target.restore();
      }

      function drawCrowds(target, width, height, time, posterMode = false) {
        const candidates = buildingCandidates();
        const crowd = state.custom?.crowd ?? 1;
        const anchors = state.landmarks.map((landmark, index) => ({
          point: pxPoint(landmark, width, height), seed: index * 31 + 9, amount: Math.round(7 * crowd)
        }));
        candidates.filter((_, index) => index % 5 === 0).slice(0, Math.round(35 * crowd)).forEach((item, index) => {
          const amountByType = { commercial: 5, core: 3, residential: 2, park: 2 };
          anchors.push({ point: pxPoint(item.p, width, height), seed: index * 47 + 71, amount: Math.round((amountByType[item.type] || 2) * crowd) });
        });
        splitSegments().forEach((segment, segmentIndex) => {
          for (let i = 5; i < segment.length; i += 22) {
            anchors.push({ point: pxPoint(segment[i], width, height), seed: segmentIndex * 97 + i + 101, amount: Math.round(2 * crowd) });
          }
        });
        const unit = clamp(Math.min(width, height) / 760, .7, 1.8);
        target.save();
        anchors.forEach((anchor, anchorIndex) => {
          for (let i = 0; i < anchor.amount; i++) {
            const r = (8 + hashRand(anchor.seed + i, 731) * 20) * unit;
            const baseAngle = hashRand(anchor.seed + i, 732) * Math.PI * 2;
            const drift = posterMode || reducedMotion ? 0 : Math.sin(time * .0015 + anchor.seed + i) * 4 * unit;
            const x = anchor.point.x + Math.cos(baseAngle) * r + drift;
            const y = anchor.point.y + Math.sin(baseAngle) * r;
            const color = i % 3 === 0 ? '#f5d76e' : i % 3 === 1 ? '#57e6e6' : '#f4f7fb';
            target.fillStyle = color;
            target.globalAlpha = posterMode ? .82 : .68;
            target.shadowColor = color;
            target.shadowBlur = 4 * unit;
            target.beginPath();
            target.arc(x, y, (1.5 + hashRand(anchor.seed + i, 733) * .95) * unit, 0, Math.PI * 2);
            target.fill();
          }
        });
        target.restore();
      }

      function buildingCandidates() {
        const candidates = [];
        const districts = getDistricts();
        const step = state.points.length > 650 ? 4 : state.points.length > 320 ? 3 : 2;
        for (let i = 2; i < state.points.length; i += step) {
          const p = state.points[i];
          if (p.b) continue;
          const prev = state.points[Math.max(0, i - 1)];
          if (prev.b) continue;
          const gx = clamp(Math.floor(p.x * districts.columns), 0, districts.columns - 1);
          const gy = clamp(Math.floor(p.y * districts.rows), 0, districts.rows - 1);
          const district = districts.map.get(`${gx}:${gy}`);
          const type = district?.type || 'residential';
          candidates.push({ p, prev, index: i, side: -1, row: 0, type, district });
          candidates.push({ p, prev, index: i, side: 1, row: 0, type, district });
          // A second, slightly wider row keeps long stretches from feeling empty.
          // It applies to every district, with the same deterministic seed.
          if (hashRand(i, 330) > (type === 'core' ? .3 : .52)) {
            candidates.push({ p, prev, index: i, side: hashRand(i, 331) > .5 ? -1 : 1, row: 1, type, district });
          }
        }
        return candidates.slice(-420);
      }

      function drawBuildings(target, width, height, time, posterMode = false) {
        const candidates = buildingCandidates();
        const unit = clamp(Math.min(width, height) / 760, .62, 1.8);
        const placed = [];
        const snap = Math.max(2.5, unit * 3.2);
        target.save();
        for (const item of candidates) {
          const p = pxPoint(item.p, width, height);
          const prev = pxPoint(item.prev, width, height);
          const roadAngle = Math.atan2(p.y - prev.y, p.x - prev.x);
          const normalAngle = roadAngle + Math.PI / 2;
          const offset = (10 + hashRand(item.index + item.side, 19) * 16 + item.row * 15) * unit * item.side;
          const bx = Math.round((p.x + Math.cos(normalAngle) * offset) / snap) * snap;
          const by = Math.round((p.y + Math.sin(normalAngle) * offset) / snap) * snap;
          const style = DISTRICT_STYLE[item.type] || DISTRICT_STYLE.residential;
          const density = item.district?.count || 4;
          const pulse = posterMode || reducedMotion ? 1 : .72 + Math.sin(time * .002 + item.index) * .14;

          target.save();
          target.translate(bx, by);
          target.rotate(roadAngle);

          if (item.type === 'park') {
            const plotW = [18, 22, 26][Math.floor(hashRand(item.index, 340) * 3)] * unit;
            const plotH = [12, 15, 18][Math.floor(hashRand(item.index, 341) * 3)] * unit;
            const radius = Math.max(plotW, plotH) * .5 + 1.5 * unit;
            if (placed.some(building => Math.hypot(bx - building.x, by - building.y) < radius + building.radius)) {
              target.restore();
              continue;
            }
            placed.push({ x: bx, y: by, radius });
            target.fillStyle = 'rgba(24,54,43,.62)';
            target.strokeStyle = `rgba(${style.rgb},.32)`;
            target.lineWidth = Math.max(.65, unit * .6);
            target.beginPath();
            target.roundRect(-plotW / 2, -plotH / 2, plotW, plotH, 3 * unit);
            target.fill(); target.stroke();
            for (let tree = 0; tree < 3; tree++) {
              const tx = (-5 + tree * 5 + hashRand(item.index + tree, 342) * 2) * unit;
              const ty = (-2 + hashRand(item.index + tree, 343) * 5) * unit;
              target.beginPath();
              target.arc(tx, ty, (1.8 + hashRand(item.index + tree, 344) * 1.2) * unit, 0, Math.PI * 2);
              target.fillStyle = `rgba(${style.rgb},${.4 + pulse * .2})`;
              target.shadowColor = style.color;
              target.shadowBlur = 5 * unit;
              target.fill();
            }
            target.restore();
            continue;
          }

          const widthSets = item.type === 'core' ? [14, 18, 22] : item.type === 'commercial' ? [12, 16, 20] : [10, 13, 17];
          const heightSets = item.type === 'core' ? [18, 24, 30] : item.type === 'commercial' ? [14, 19, 24] : [11, 15, 20];
          const w = widthSets[Math.floor(hashRand(item.index + item.side, 20) * widthSets.length)] * unit;
          const h = heightSets[Math.floor(hashRand(item.index + item.side, 21) * heightSets.length)] * unit;
          const radius = Math.max(w, h) * .5 + 1.5 * unit;
          if (placed.some(building => Math.hypot(bx - building.x, by - building.y) < radius + building.radius)) {
            target.restore();
            continue;
          }
          placed.push({ x: bx, y: by, radius });

          target.shadowColor = style.color;
          target.shadowBlur = (item.type === 'core' ? 7 : 3.5) * unit;
          target.fillStyle = `rgba(${style.rgb},.12)`;
          target.fillRect(-w / 2 - 1.5 * unit, -h / 2 - 1.5 * unit, w + 3 * unit, h + 3 * unit);
          target.shadowBlur = 0;

          // Buildings are drawn as flat footprints from above. The old angled
          // side/top faces read like a 3D perspective view and made the map feel
          // tilted, especially on short, dense roads.
          target.beginPath();
          target.rect(-w / 2, -h / 2, w, h);
          target.fillStyle = item.type === 'residential' ? 'rgba(12,24,38,.96)' : 'rgba(13,17,27,.96)';
          target.fill();
          target.strokeStyle = `rgba(${style.rgb},${.5 + pulse * .18})`;
          target.lineWidth = Math.max(.85, unit * .72);
          target.stroke();

          // A simple inset roof line gives each footprint a readable shape
          // without introducing a horizon or vanishing-point cue.
          target.beginPath();
          target.rect(-w / 2 + 2 * unit, -h / 2 + 2 * unit, w - 4 * unit, h - 4 * unit);
          target.strokeStyle = `rgba(${style.rgb},.18)`;
          target.lineWidth = Math.max(.55, unit * .45);
          target.stroke();

          const windowColor = item.type === 'residential' && hashRand(item.index, 24) > .45 ? '245,215,110' : style.rgb;
          const windowStep = item.type === 'core' ? 5 : 6;
          target.fillStyle = `rgba(${windowColor},${.45 + pulse * .3})`;
          for (let wy = -h / 2 + 4 * unit; wy < h / 2 - 2 * unit; wy += windowStep * unit) {
            for (let wx = -w / 2 + 3 * unit; wx < w / 2 - 1 * unit; wx += 5 * unit) {
              if (hashRand(Math.round(wx * 7 + wy * 11) + item.index, 25) > .28) {
                target.fillRect(wx, wy, Math.max(1.2, unit * 1.35), Math.max(.9, unit));
              }
            }
          }
          target.restore();
        }
        target.restore();
      }

      function drawLandmarks(target, width, height, time, posterMode = false) {
        const unit = clamp(Math.min(width, height) / 760, .72, 2);
        state.landmarks.forEach((landmark, i) => {
          const p = pxPoint(landmark, width, height);
          const color = i % 3 === 1 ? '#f261a8' : i % 3 === 2 ? '#f5d76e' : '#57e6e6';
          const pulse = posterMode || reducedMotion ? 1 : 1 + Math.sin(time * .003 + i) * .12;
          target.save();
          target.translate(p.x, p.y);
          target.shadowColor = color;
          target.shadowBlur = 18 * pulse;
          target.strokeStyle = color;
          target.fillStyle = 'rgba(6,12,18,.94)';
          target.lineWidth = Math.max(1.1, unit);
          if (landmark.type === 'tower') {
            target.beginPath(); target.moveTo(-7 * unit, 8 * unit); target.lineTo(-3 * unit, -13 * unit); target.lineTo(0, -20 * unit); target.lineTo(3 * unit, -13 * unit); target.lineTo(7 * unit, 8 * unit); target.closePath(); target.fill(); target.stroke();
            target.beginPath(); target.moveTo(0, -20 * unit); target.lineTo(0, -27 * unit); target.stroke();
          } else if (landmark.type === 'spire') {
            target.beginPath(); target.arc(0, 0, 9 * unit, 0, Math.PI * 2); target.fill(); target.stroke();
            target.beginPath(); target.moveTo(0, -17 * unit); target.lineTo(0, 17 * unit); target.moveTo(-17 * unit, 0); target.lineTo(17 * unit, 0); target.stroke();
          } else if (landmark.type === 'gate') {
            target.strokeRect(-10 * unit, -10 * unit, 20 * unit, 20 * unit);
            target.strokeRect(-5 * unit, -5 * unit, 10 * unit, 15 * unit);
          } else if (landmark.type === 'dome') {
            target.beginPath(); target.arc(0, 3 * unit, 11 * unit, Math.PI, Math.PI * 2); target.lineTo(11 * unit, 9 * unit); target.lineTo(-11 * unit, 9 * unit); target.closePath(); target.fill(); target.stroke();
          } else {
            target.beginPath(); target.arc(0, 0, 7 * unit * pulse, 0, Math.PI * 2); target.fill(); target.stroke();
            target.beginPath(); target.arc(0, 0, 14 * unit * pulse, 0, Math.PI * 2); target.globalAlpha = .35; target.stroke();
          }
          target.restore();
        });
      }

      function renderScene(target, width, height, time, posterMode = false) {
        target.save();
        drawBackground(target, width, height, time, posterMode);
        drawDistricts(target, width, height, posterMode);
        drawBuildings(target, width, height, time, posterMode);
        drawFoodStreets(target, width, height, time, posterMode);
        drawRoads(target, width, height, time, posterMode);
        drawCars(target, width, height, time, posterMode);
        drawCrowds(target, width, height, time, posterMode);
        drawLandmarks(target, width, height, time, posterMode);
        target.restore();
      }

      function animate(time) {
        ctx.setTransform(viewport.dpr, 0, 0, viewport.dpr, 0, 0);
        ctx.translate(viewport.width / 2, viewport.height / 2);
        ctx.scale(zoom, zoom);
        ctx.translate(-viewport.width / 2, -viewport.height / 2);
        renderScene(ctx, viewport.width, viewport.height, paused ? pausedAt : time, false);
        frame = requestAnimationFrame(animate);
      }

      function togglePause() {
        if (mode !== 'explore') return;
        paused = !paused;
        pointer.active = false;
        pointer.id = null;
        canvas.classList.remove('is-drawing');
        if (paused) {
          pausedAt = performance.now();
          pauseButton.textContent = '继续';
          pauseButton.setAttribute('aria-pressed', 'true');
          pauseIndicator.hidden = false;
          hint.hidden = true;
          liveStatus.textContent = '城市已暂停生长';
        } else {
          pauseButton.textContent = '暂停';
          pauseButton.setAttribute('aria-pressed', 'false');
          pauseIndicator.hidden = true;
          hint.hidden = false;
          hint.textContent = '按住鼠标或屏幕拖动来铺路';
          hint.classList.remove('is-faded');
          pointer.lastTime = performance.now();
          fadeHint();
          liveStatus.textContent = '城市继续生长';
        }
      }

      function drawPoster() {
        const width = poster.width;
        const height = poster.height;
        renderScene(posterCtx, width, height, 0, true);
        const shade = posterCtx.createLinearGradient(0, 0, 0, height);
        shade.addColorStop(0, 'rgba(5,7,11,.7)');
        shade.addColorStop(.25, 'rgba(5,7,11,0)');
        shade.addColorStop(.72, 'rgba(5,7,11,.05)');
        shade.addColorStop(1, 'rgba(5,7,11,.9)');
        posterCtx.fillStyle = shade;
        posterCtx.fillRect(0, 0, width, height);

        posterCtx.fillStyle = '#57e6e6';
        posterCtx.font = '600 22px ui-monospace, monospace';
        posterCtx.letterSpacing = '5px';
        posterCtx.fillText('NEON TRACE CITY / ' + cityCode(), 64, 76);

        posterCtx.fillStyle = '#f4f7fb';
        posterCtx.font = '700 88px system-ui, sans-serif';
        posterCtx.fillText(state.name, 62, 1320);
        posterCtx.fillStyle = '#8290a3';
        posterCtx.font = '500 24px system-ui, sans-serif';
        posterCtx.fillText(`${state.strokes} 条道路   ${state.blocks} 个街区   ${state.landmarks.length} 座地标`, 66, 1380);
        posterCtx.fillStyle = 'rgba(87,230,230,.75)';
        posterCtx.fillRect(65, 1417, 180, 2);
        posterCtx.fillStyle = '#68768a';
        posterCtx.font = '500 19px ui-monospace, monospace';
        posterCtx.fillText(new Date(state.createdAt).toLocaleDateString('zh-CN') + ' · 每一条路，都由你亲手点亮', 65, 1460);
      }

      function sealCity() {
        if (mode !== 'explore') return;
        if (state.points.length < 4 && state.landmarks.length === 0) {
          queueAchievement('先走几步，让城市开始生长', 'empty-reminder-' + Date.now());
          return;
        }
        mode = 'result';
        paused = false;
        pauseIndicator.hidden = true;
        pointer.active = false;
        pointer.id = null;
        canvas.classList.remove('is-drawing');
        hud.hidden = true;
        hint.hidden = true;
        result.hidden = false;
        setAchievementPanel(false);
        setCustomPanel(false);
        calculateBlocks();
        drawPoster();
        updateResult();
        const share = makeShareUrl();
        try { history.replaceState(null, '', share); } catch (_) { location.hash = share.split('#')[1] || ''; }
        saveRecent();
      }

      function cityPersonality() {
        if (state.landmarks.length >= 5) return '你偏爱在路的尽头留下坐标。这是一座会把远方变成目的地的城。';
        if (hasLoop()) return '你绕回了出发的地方，但城市已经不同。这是一座擅长重逢的城。';
        if (state.blocks >= 16) return '密集的转弯让灯光聚拢。这是一座越夜越热闹的城。';
        if (state.strokes >= 8) return '你留下许多彼此独立的方向。这是一座允许迷路的城。';
        return '每一条路都来自一次犹豫或一次决定。现在，它们有了灯光。';
      }

      function updateResult() {
        ui.resultCode.textContent = cityCode();
        ui.resultRoads.textContent = state.strokes;
        ui.resultBlocks.textContent = state.blocks;
        ui.resultLandmarks.textContent = state.landmarks.length;
        ui.resultSummary.textContent = cityPersonality();
      }

      function samplePoints(points, max) {
        if (points.length <= max) return points;
        const breaks = new Set(points.map((p, i) => p.b ? i : -1).filter(i => i >= 0));
        const picked = [];
        const step = (points.length - 1) / (max - 1);
        for (let i = 0; i < max; i++) picked.push(Math.round(i * step));
        breaks.forEach(i => picked.push(i));
        return [...new Set(picked)].sort((a,b) => a-b).slice(0, max + 20).map(i => points[i]);
      }

      function serializeState() {
        const points = samplePoints(state.points, SHARE_POINTS).map(p => [quantize(p.x), quantize(p.y), Math.round((p.speed || 0) * 99), p.b ? 1 : 0, Math.round((p.hold || 0) * 9)]);
        const landmarks = state.landmarks.map(l => [quantize(l.x), quantize(l.y), ['tower','spire','gate','beacon','dome'].indexOf(l.type)]);
        const history = state.history.map(item => item.type === 'landmark' ? { type: 'landmark' } : { type: 'road' });
        const compact = { v: VERSION, s: state.seed, p: points, l: landmarks, h: history, a: state.achievements, t: state.createdAt, n: state.name, c: state.custom };
        const text = JSON.stringify(compact);
        const bytes = new TextEncoder().encode(text);
        let binary = '';
        bytes.forEach(byte => binary += String.fromCharCode(byte));
        return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
      }

      function deserializeState(encoded) {
        try {
          const normalized = encoded.replace(/-/g, '+').replace(/_/g, '/');
          const binary = atob(normalized + '='.repeat((4 - normalized.length % 4) % 4));
          const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
          const data = JSON.parse(new TextDecoder().decode(bytes));
          if (data.v !== VERSION || !Number.isFinite(data.s) || !Array.isArray(data.p)) return null;
          const restored = freshState(data.s >>> 0);
          restored.points = data.p.slice(0, 220).map(p => ({ x: p[0] / 999, y: p[1] / 999, speed: (p[2] || 0) / 99, b: p[3] ? 1 : 0, hold: (p[4] || 0) / 9 }));
          restored.landmarks = Array.isArray(data.l) ? data.l.slice(0, 24).map(l => ({ x: l[0] / 999, y: l[1] / 999, type: ['tower','spire','gate','beacon','dome'][l[2]] || 'beacon' })) : [];
          restored.history = Array.isArray(data.h)
            ? data.h.slice(0, 80).filter(item => item && (item.type === 'road' || item.type === 'landmark')).map(item => ({ type: item.type }))
            : null;
          restored.achievements = Array.isArray(data.a) ? data.a.filter(a => typeof a === 'string').slice(0, 10) : [];
          restored.createdAt = Number.isFinite(data.t) ? data.t : Date.now();
          restored.name = typeof data.n === 'string' && data.n.length < 20 ? data.n : makeCityName(restored.seed);
          if (data.c && typeof data.c === 'object') {
            const traffic = Number(data.c.traffic);
            const crowd = Number(data.c.crowd);
            restored.custom = {
              district: ['auto', 'core', 'commercial', 'residential', 'park'].includes(data.c.district) ? data.c.district : 'auto',
              traffic: clamp(Number.isFinite(traffic) ? traffic : 1, 0, 2),
              crowd: clamp(Number.isFinite(crowd) ? crowd : 1, 0, 2)
            };
          }
          let segmentLength = 0;
          restored.strokes = 0;
          for (const point of restored.points) {
            if (point.b) {
              if (segmentLength > 1) restored.strokes++;
              segmentLength = 1;
            } else {
              segmentLength++;
            }
          }
          if (segmentLength > 1) restored.strokes++;
          if (!restored.history) {
            restored.history = [...Array(restored.strokes)].map(() => ({ type: 'road' }));
            restored.history.push(...restored.landmarks.map(() => ({ type: 'landmark' })));
          }
          state = restored;
          calculateBlocks();
          return restored;
        } catch (_) { return null; }
      }

      function makeShareUrl() {
        const base = location.href.split('#')[0];
        return base + '#city=' + serializeState();
      }

      function showShareLink() {
        const url = makeShareUrl();
        ui.shareUrl.value = url;
        ui.shareFallback.hidden = false;
        ui.shareUrl.focus();
        ui.shareUrl.select();
        liveStatus.textContent = '分享链接已显示，请长按或选中复制';
      }

      async function savePoster() {
        drawPoster();
        const data = poster.toDataURL('image/png');
        const bridge = window.xhs && window.xhs.miniTool;
        if (!bridge || typeof bridge.saveImageToPhotosAlbum !== 'function') {
          liveStatus.textContent = '请在小红书小工具容器中保存海报';
          alert('当前预览环境无法保存到相册，请在小红书小工具中打开后重试。');
          return;
        }
        const button = document.getElementById('download-button');
        button.disabled = true;
        button.textContent = '正在保存…';
        try {
          let filePath = data;
          if (typeof bridge.writeTempFile === 'function') {
            const temp = await bridge.writeTempFile({ data });
            if (temp && temp.filePath) filePath = temp.filePath;
          }
          await bridge.saveImageToPhotosAlbum({ filePath });
          button.textContent = '已保存到相册';
          liveStatus.textContent = '城市海报已保存到相册';
        } catch (_) {
          button.textContent = '保存失败，请重试';
          liveStatus.textContent = '海报保存失败';
        } finally {
          button.disabled = false;
          setTimeout(() => { button.textContent = '保存海报到相册'; }, 1800);
        }
      }

      function getRecent() {
        try {
          const data = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
          return Array.isArray(data) ? data.slice(0, 5) : [];
        } catch (_) { return []; }
      }

      function saveRecent() {
        try {
          const item = { name: state.name, code: cityCode(), hash: 'city=' + serializeState(), createdAt: state.createdAt };
          const recent = getRecent().filter(city => city.hash !== item.hash);
          localStorage.setItem(RECENT_KEY, JSON.stringify([item, ...recent].slice(0, 5)));
          renderRecent();
        } catch (_) {}
      }

      function setRecent(recent) {
        try {
          if (recent.length) localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, 5)));
          else localStorage.removeItem(RECENT_KEY);
        } catch (_) {}
        renderRecent();
      }

      function deleteRecent(hash) {
        setRecent(getRecent().filter(city => city.hash !== hash));
        liveStatus.textContent = '已删除一条历史城市记录';
      }

      function clearRecent() {
        if (!getRecent().length) return;
        if (!confirm('清空全部历史城市记录？此操作无法撤销。')) return;
        setRecent([]);
        liveStatus.textContent = '历史城市记录已清空';
      }

      function renderRecent() {
        const recent = getRecent();
        ui.recentList.textContent = '';
        ui.recent.hidden = recent.length === 0;
        recent.forEach(city => {
          const item = document.createElement('div');
          item.className = 'recent-city';

          const openButton = document.createElement('button');
          openButton.className = 'recent-city__open';
          openButton.type = 'button';
          openButton.textContent = `${city.name} / ${city.code}`;
          openButton.addEventListener('click', () => {
            if (deserializeState(city.hash.replace(/^city=/, ''))) {
              cityNameInput.value = state.name;
              history.replaceState(null, '', location.href.split('#')[0] + '#' + city.hash);
              startExploring();
            }
          });

          const deleteButton = document.createElement('button');
          deleteButton.className = 'recent-city__delete';
          deleteButton.type = 'button';
          deleteButton.textContent = '×';
          deleteButton.setAttribute('aria-label', `删除${city.name}的记录`);
          deleteButton.title = '删除这条记录';
          deleteButton.addEventListener('click', () => deleteRecent(city.hash));

          item.append(openButton, deleteButton);
          ui.recentList.appendChild(item);
        });
      }

      function restoreFromHash() {
        const match = location.hash.match(/^#city=([A-Za-z0-9_-]+)$/);
        if (!match) return false;
        if (!deserializeState(match[1])) return false;
        cityNameInput.value = state.name;
        document.getElementById('start-button').innerHTML = `进入${state.name} <span class="arrow">↗</span>`;
        document.querySelector('.intro').innerHTML = `你收到了一座由轨迹生成的城市。<strong>进入后可以沿着原来的灯光继续生长。</strong>`;
        return true;
      }

      document.getElementById('start-button').addEventListener('click', startExploring);
      document.getElementById('zoom-out').addEventListener('click', () => setZoom(zoom - .2));
      document.getElementById('zoom-in').addEventListener('click', () => setZoom(zoom + .2));
      customButton.addEventListener('click', () => setCustomPanel(customPanel.hidden));
      document.getElementById('custom-close').addEventListener('click', () => setCustomPanel(false));
      achievementButton.addEventListener('click', () => setAchievementPanel(achievementPanel.hidden));
      achievementClose.addEventListener('click', () => setAchievementPanel(false));
      districtStyleInput.addEventListener('change', updateCustomSetting);
      trafficInput.addEventListener('input', updateCustomSetting);
      crowdInput.addEventListener('input', updateCustomSetting);
      document.getElementById('undo-button').addEventListener('click', undoLastStroke);
      document.getElementById('restart-button-hud').addEventListener('click', resetCity);
      document.getElementById('save-home-button').addEventListener('click', returnHome);
      pauseButton.addEventListener('click', togglePause);
      document.getElementById('seal-button').addEventListener('click', sealCity);
      document.getElementById('restart-button').addEventListener('click', resetCity);
      document.getElementById('download-button').addEventListener('click', savePoster);
      document.getElementById('share-button').addEventListener('click', showShareLink);
      ui.recentClear.addEventListener('click', clearRecent);
      canvas.addEventListener('pointerdown', onPointerDown);
      canvas.addEventListener('pointermove', onPointerMove);
      canvas.addEventListener('pointerup', onPointerUp);
      canvas.addEventListener('pointercancel', onPointerUp);
      canvas.addEventListener('contextmenu', event => event.preventDefault());
      addEventListener('resize', scheduleResize, { passive: true });
      if (window.visualViewport) window.visualViewport.addEventListener('resize', scheduleResize, { passive: true });
      if ('ResizeObserver' in window) new ResizeObserver(scheduleResize).observe(document.documentElement);
      addEventListener('hashchange', () => {
        const match = location.hash.match(/^#city=([A-Za-z0-9_-]+)$/);
        if (match && deserializeState(match[1])) { updateHud(); if (mode === 'result') { drawPoster(); updateResult(); } }
      });

      resize();
      updateCustomUI();
      renderRecent();
      restoreFromHash();
      updateHud();
      frame = requestAnimationFrame(animate);
    })();
