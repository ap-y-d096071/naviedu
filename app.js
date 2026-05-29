/* ============================================================
   나비 나침반 · Nabi Compass — Onboarding flow controller
   No build step, no dependencies. Pure vanilla JS.
   ============================================================ */

(() => {
  'use strict';

  /* ----------------------------------------------------------
     State
  ---------------------------------------------------------- */
  const STORE_KEY = 'nabi-compass-v1';
  const state = loadState() || {
    role: null,
    interests: [],
    partner: null,
    question: '',
    streak: 1,
    points: 40,
    completed: false,
  };
  function loadState() { try { return JSON.parse(localStorage.getItem(STORE_KEY)); } catch { return null; } }
  function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch {} }

  let index = 0;

  const stage = document.getElementById('stage');
  const progressFill = document.getElementById('progressFill');
  const progressLabel = document.getElementById('progressLabel');
  const backBtn = document.getElementById('backBtn');
  const skipBtn = document.getElementById('skipBtn');

  /* ----------------------------------------------------------
     Butterfly SVG — the volumetric "Nabi" guide
  ---------------------------------------------------------- */
  function nabi(size = 200, withFloat = true) {
    return `
    <div class="nabi-wrap">
      <svg class="nabi ${withFloat ? 'nabi-float' : ''}" width="${size}" height="${size}" viewBox="0 0 200 200" role="img" aria-label="나비 가이드 캐릭터">
        <defs>
          <radialGradient id="wingG" cx="38%" cy="32%" r="78%">
            <stop offset="0%" stop-color="#ffe3f0"/>
            <stop offset="52%" stop-color="#ff8fc4"/>
            <stop offset="100%" stop-color="#ff4f9e"/>
          </radialGradient>
          <radialGradient id="wingG2" cx="40%" cy="35%" r="80%">
            <stop offset="0%" stop-color="#fff6c2"/>
            <stop offset="55%" stop-color="#ffe35e"/>
            <stop offset="100%" stop-color="#f4cf00"/>
          </radialGradient>
          <radialGradient id="bodyG" cx="40%" cy="28%" r="85%">
            <stop offset="0%" stop-color="#fffae0"/>
            <stop offset="58%" stop-color="#ffe35e"/>
            <stop offset="100%" stop-color="#f4c700"/>
          </radialGradient>
          <radialGradient id="cheek" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ff9ecb"/><stop offset="100%" stop-color="#ff6db2"/>
          </radialGradient>
          <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#ff4f9e" flood-opacity="0.30"/>
          </filter>
        </defs>

        <!-- Left wings (plump & rounded) -->
        <g class="nabi-wing-l" filter="url(#soft)">
          <path d="M98 112 C 52 58, 10 64, 12 102 C 14 136, 60 138, 98 118 Z" fill="url(#wingG)"/>
          <path d="M98 120 C 62 128, 26 148, 36 180 C 46 208, 94 170, 98 134 Z" fill="url(#wingG2)"/>
          <circle cx="46" cy="92" r="11" fill="#fff" opacity=".75"/>
          <circle cx="40" cy="106" r="6" fill="#fff" opacity=".6"/>
          <path d="M58 162 c -4 -7 -13 -7 -13 1 c 0 6 8 10 13 14 c 5 -4 13 -8 13 -14 c 0 -8 -9 -8 -13 -1 z" fill="#ff6db2"/>
        </g>
        <!-- Right wings -->
        <g class="nabi-wing-r" filter="url(#soft)">
          <path d="M102 112 C 148 58, 190 64, 188 102 C 186 136, 140 138, 102 118 Z" fill="url(#wingG)"/>
          <path d="M102 120 C 138 128, 174 148, 164 180 C 154 208, 106 170, 102 134 Z" fill="url(#wingG2)"/>
          <circle cx="154" cy="92" r="11" fill="#fff" opacity=".75"/>
          <circle cx="160" cy="106" r="6" fill="#fff" opacity=".6"/>
          <path d="M142 162 c -4 -7 -13 -7 -13 1 c 0 6 8 10 13 14 c 5 -4 13 -8 13 -14 c 0 -8 -9 -8 -13 -1 z" fill="#ff6db2"/>
        </g>

        <!-- Chubby body + big round head -->
        <ellipse cx="100" cy="146" rx="15" ry="20" fill="url(#bodyG)" filter="url(#soft)"/>
        <circle cx="100" cy="112" r="33" fill="url(#bodyG)" filter="url(#soft)"/>

        <!-- Antennae with heart tips -->
        <path d="M86 84 C 78 60, 66 54, 64 42" stroke="#f4c700" stroke-width="5" fill="none" stroke-linecap="round"/>
        <path d="M114 84 C 122 60, 134 54, 136 42" stroke="#f4c700" stroke-width="5" fill="none" stroke-linecap="round"/>
        <path d="M64 42 c -3 -5 -10 -5 -10 1 c 0 5 6 8 10 11 c 4 -3 10 -6 10 -11 c 0 -6 -7 -6 -10 -1 z" fill="#ff6db2"/>
        <path d="M136 42 c -3 -5 -10 -5 -10 1 c 0 5 6 8 10 11 c 4 -3 10 -6 10 -11 c 0 -6 -7 -6 -10 -1 z" fill="#ff6db2"/>

        <!-- Face : big sparkly eyes -->
        <ellipse cx="88" cy="112" rx="8.5" ry="10.5" fill="#3a2230"/>
        <ellipse cx="112" cy="112" rx="8.5" ry="10.5" fill="#3a2230"/>
        <circle cx="91" cy="108" r="3.4" fill="#fff"/>
        <circle cx="115" cy="108" r="3.4" fill="#fff"/>
        <circle cx="85.5" cy="116" r="1.8" fill="#fff" opacity=".9"/>
        <circle cx="109.5" cy="116" r="1.8" fill="#fff" opacity=".9"/>
        <!-- Blush -->
        <ellipse cx="76" cy="124" rx="8" ry="5.5" fill="url(#cheek)" opacity=".85"/>
        <ellipse cx="124" cy="124" rx="8" ry="5.5" fill="url(#cheek)" opacity=".85"/>
        <!-- Happy open smile -->
        <path d="M92 126 Q 100 137 108 126 Q 100 132 92 126 Z" fill="#ff6db2"/>
        <path d="M92 126 Q 100 137 108 126" stroke="#3a2230" stroke-width="3" fill="none" stroke-linecap="round"/>
      </svg>
    </div>`;
  }

  function speech(html) {
    return `<p class="speech">${html}</p>`;
  }

  /* decorative floating dots */
  function deco() {
    const c = ['#138Bff', '#f4f000', '#ff6db2'];
    let s = '<div class="dots-deco" aria-hidden="true">';
    for (let i = 0; i < 7; i++) {
      const sz = 8 + Math.random() * 22;
      s += `<span style="width:${sz}px;height:${sz}px;left:${Math.random()*90}%;top:${Math.random()*88}%;background:${c[i%3]};opacity:${.12+Math.random()*.2}"></span>`;
    }
    return s + '</div>';
  }

  /* ----------------------------------------------------------
     Screen definitions (9 screens)
  ---------------------------------------------------------- */
  const screens = [

    /* 1 — Welcome -------------------------------------------------- */
    {
      skippable: true,
      render: () => `
        ${deco()}
        <div class="spacer"></div>
        ${nabi(220)}
        <div style="text-align:center">
          <span class="eyebrow" style="align-self:center">🧭 AI 진로 탐색 항해</span>
          <h1 class="title">반가워요! 저는 <span class="hl">나비</span>예요 🦋<br/>함께 진로를 항해해 볼까요?</h1>
          <p class="subtitle">카드를 고르고, 드래그하고, 던지면서<br/>나만의 진로 나침반을 만들어요.</p>
        </div>
        <div class="spacer"></div>
        <div class="cta-dock">
          <button class="btn btn--primary" data-next>✨ 항해 시작하기</button>
        </div>`
    },

    /* 2 — Role selection ------------------------------------------ */
    {
      render: () => `
        <span class="eyebrow">STEP 1 · 역할 선택</span>
        <h2 class="title">당신은 누구인가요?</h2>
        <p class="subtitle">역할에 맞춰 <span style="color:var(--blue);font-weight:700">맞춤형 경험</span>을 준비할게요.</p>
        <div class="card-list" id="roleList">
          ${roleCard('student','🎒','학생','나의 진로와 적성을 탐색해요')}
          ${roleCard('teacher','🧑‍🏫','교사','학생들의 항해를 안내해요')}
          ${roleCard('parent','👨‍👩‍👧','학부모','아이의 성장을 함께 응원해요')}
        </div>
        <div class="spacer"></div>
        <div class="cta-dock">
          <button class="btn btn--primary" data-next disabled id="roleNext">다음</button>
        </div>`,
      mount(el) {
        el.querySelectorAll('.opt-card').forEach(c => c.addEventListener('click', () => {
          el.querySelectorAll('.opt-card').forEach(x => x.classList.remove('is-selected'));
          c.classList.add('is-selected');
          state.role = c.dataset.value; save();
          el.querySelector('#roleNext').disabled = false;
        }));
        if (state.role) {
          const sel = el.querySelector(`[data-value="${state.role}"]`);
          if (sel) { sel.classList.add('is-selected'); el.querySelector('#roleNext').disabled = false; }
        }
      }
    },

    /* 3 — Value / how it works ------------------------------------ */
    {
      render: () => `
        <span class="eyebrow">STEP 2 · 이렇게 도와드려요</span>
        <h2 class="title">나비와 함께라면<br/>진로 탐색이 <span class="hl-pink">게임처럼</span> 즐거워요</h2>
        <div style="margin-top:14px">
          ${feature('🃏','진로 카드 던지기','관심사를 드래그해 담으면 AI가 맞춤 카드를 발급해요.')}
          ${feature('🪜','사다리 오르기','단계를 오를수록 나에게 꼭 맞는 진로가 또렷해져요.')}
          ${feature('🤖','AI 파트너','코치·분석가·멘토 중 내 스타일의 파트너를 골라요.')}
          ${feature('🏅','성취 뱃지','마일스톤을 달성하면 축하와 뱃지로 보상받아요.')}
        </div>
        <div class="nabi-wrap" style="margin-top:6px">${nabi(120)}</div>
        <div class="spacer"></div>
        <div class="cta-dock">
          <button class="btn btn--primary" data-next>좋아요, 계속할게요</button>
        </div>`
    },

    /* 4 — Interest defining (DRAG & DROP) ------------------------- */
    {
      render: () => `
        <span class="eyebrow">STEP 3 · 관심사 정의</span>
        <h2 class="title">관심 카드를 <span class="hl">바구니</span>로<br/>드래그해 던져 보세요 🃏</h2>
        <p class="dnd-hint">최소 2개 이상 담으면 AI 카드가 발급돼요. (탭으로도 담겨요)</p>
        <div class="chip-tray" id="chipTray">
          ${interestChips()}
        </div>
        <div class="basket" id="basket">
          <div class="basket__head">
            <h4>🧺 내 관심 바구니</h4>
            <span class="basket__count" id="basketCount">0개</span>
          </div>
          <div class="basket__items" id="basketItems"></div>
          <p class="basket__empty" id="basketEmpty">여기로 카드를 끌어다 놓으세요</p>
        </div>
        <div class="spacer"></div>
        <div class="cta-dock">
          <button class="btn btn--primary" data-next disabled id="intNext">다음</button>
        </div>`,
      mount: mountInterests
    },

    /* 5 — AI partner selection ------------------------------------ */
    {
      render: () => `
        <span class="eyebrow">STEP 4 · AI 파트너 선택</span>
        <h2 class="title">어떤 <span class="hl">AI 파트너</span>와<br/>항해할까요?</h2>
        <p class="subtitle">학습 스타일에 맞는 동반자를 골라요.</p>
        <div class="card-list" id="partnerList">
          ${roleCard('coach','🤗','다정한 코치','따뜻한 응원과 동기부여로 이끌어요')}
          ${roleCard('analyst','📊','논리적 분석가','데이터와 근거로 길을 보여줘요')}
          ${roleCard('mentor','🧭','든든한 멘토','경험에서 우러난 조언을 전해요')}
        </div>
        <div class="spacer"></div>
        <div class="cta-dock">
          <button class="btn btn--primary" data-next disabled id="pNext">다음</button>
        </div>`,
      mount(el) {
        el.querySelectorAll('.opt-card').forEach(c => c.addEventListener('click', () => {
          el.querySelectorAll('.opt-card').forEach(x => x.classList.remove('is-selected'));
          c.classList.add('is-selected');
          state.partner = c.dataset.value; save();
          el.querySelector('#pNext').disabled = false;
        }));
        if (state.partner) {
          const sel = el.querySelector(`[data-value="${state.partner}"]`);
          if (sel) { sel.classList.add('is-selected'); el.querySelector('#pNext').disabled = false; }
        }
      }
    },

    /* 6 — First personal question (Aha! input) -------------------- */
    {
      render: () => `
        <span class="eyebrow">STEP 5 · 첫 번째 질문</span>
        ${nabi(120)}
        ${speech('진로에 대해 가장 <b>궁금한 점</b>을<br/>편하게 적어주세요. 제가 길을 찾아볼게요!')}
        <textarea class="q-input" id="qInput" rows="3" placeholder="예) 데이터를 다루는 직업이 궁금해요. 어떤 진로가 있을까요?">${escapeHtml(state.question)}</textarea>
        <div class="q-suggest" id="qSuggest">
          <button>🎨 좋아하는 일로 먹고살 수 있을까요?</button>
          <button>🔬 이과 진로가 궁금해요</button>
          <button>💼 요즘 뜨는 직업이 뭐예요?</button>
        </div>
        <div class="spacer"></div>
        <div class="cta-dock">
          <button class="btn btn--primary" data-next disabled id="qNext">🔍 AI에게 물어보기</button>
        </div>`,
      mount(el) {
        const input = el.querySelector('#qInput');
        const next = el.querySelector('#qNext');
        const sync = () => { state.question = input.value.trim(); next.disabled = state.question.length < 4; save(); };
        input.addEventListener('input', sync);
        el.querySelectorAll('#qSuggest button').forEach(b =>
          b.addEventListener('click', () => { input.value = b.textContent.replace(/^\S+\s/, ''); sync(); input.focus(); }));
        sync();
      }
    },

    /* 7 — Milestone celebration (badge) --------------------------- */
    {
      render: () => `
        ${deco()}
        <div class="badge-stage">
          <span class="eyebrow" style="align-self:center">🎉 마일스톤 달성</span>
          <div class="badge">
            <div class="badge__rays"></div>
            <div class="badge__disc"><span class="badge__emoji">🦋</span></div>
            <div class="badge__ribbon">첫 항해자 뱃지 · First Explorer</div>
          </div>
          <h2 class="title" style="margin-top:14px">온보딩 완료! 🎊<br/><span class="hl">첫 항해자</span> 뱃지를 획득했어요</h2>
          <p class="subtitle">${state.role ? roleLabel(state.role)+'으로서 ' : ''}진로 항해의 첫 발을 내디뎠어요.<br/>이제 나비가 만든 AI 진로 카드를 확인해볼까요?</p>
        </div>
        <div class="spacer"></div>
        <div class="cta-dock">
          <button class="btn btn--primary" data-next>🃏 내 AI 진로 카드 보기</button>
        </div>`,
      mount() { fireConfetti(); }
    },

    /* 8 — Data guide preview (Aha! value) ------------------------- */
    {
      render: () => {
        const recs = buildRecommendations();
        return `
        <span class="eyebrow">STEP 6 · AI 진로 가이드</span>
        <h2 class="title">나비가 분석한<br/><span class="hl">맞춤 진로 추천</span> 🧭</h2>
        <p class="subtitle">${state.interests.length ? '“'+state.interests.slice(0,3).join(', ')+'”' : '선택한 관심사'} 기반 적합도 미리보기</p>
        <div class="preview-card">
          <div class="preview-card__head">
            <div class="preview-card__avatar">${partnerEmoji()}</div>
            <div>
              <h4>${partnerLabel()}의 분석</h4>
              <span>${state.question ? '“'+truncate(state.question,22)+'”에 대한 답' : '관심사 기반 추천'}</span>
            </div>
          </div>
          ${recs.map(r => barRow(r.label, r.pct, r.color)).join('')}
          <div class="insight">💡 <b>${recs[0].label}</b> 적합도가 가장 높아요! 전체 가이드에서 추천 학과·로드맵·롤모델까지 확인할 수 있어요.</div>
        </div>
        <div class="spacer"></div>
        <div class="cta-dock">
          <button class="btn btn--primary" data-next>🚀 나의 항해 시작하기</button>
        </div>`;
      },
      mount(el) {
        requestAnimationFrame(() => el.querySelectorAll('.bar-row__fill').forEach(f => { f.style.width = f.dataset.pct + '%'; }));
      }
    },

    /* 9 — Retention hub ------------------------------------------- */
    {
      render: () => `
        <span class="eyebrow">🏠 나의 항해 본부</span>
        <h2 class="title">매일 들러서<br/><span class="hl-pink">진로 나침반</span>을 채워요</h2>
        <div class="hub-grid">
          <div class="hub-card">
            <div class="hub-card__k">🔥 연속 출석</div>
            <div class="hub-card__v">${state.streak}<small>일</small></div>
          </div>
          <div class="hub-card">
            <div class="hub-card__k">⭐ 항해 포인트</div>
            <div class="hub-card__v">${state.points}<small>P</small></div>
          </div>

          <div class="hub-card hub-card--wide">
            <div class="hub-card__k">📅 이번 주 출석</div>
            <div class="streak-dots">
              ${['월','화','수','목','금','토','일'].map((d,i)=>`<i class="${i< state.streak ? 'on':''}">${i<state.streak?'🔥':d}</i>`).join('')}
            </div>
          </div>

          <div class="hub-card hub-card--wide">
            <div class="hub-card__k" style="margin-bottom:8px">🎯 오늘의 챌린지</div>
            ${challenge('🃏','진로 카드 1장 더 뽑기','+20P', false)}
            ${challenge('📝','오늘의 진로 질문 답하기','+15P', false)}
            ${challenge('✅','온보딩 완료','달성!', true)}
          </div>

          <div class="hub-card hub-card--wide">
            <div class="hub-card__k" style="margin-bottom:10px">🏅 뱃지 컬렉션</div>
            <div class="badge-shelf">
              <i title="첫 항해자">🦋</i>
              <i class="locked" title="7일 연속">🔥</i>
              <i class="locked" title="카드 마스터">🃏</i>
              <i class="locked" title="질문왕">💬</i>
              <i class="locked" title="항해 완주">🏆</i>
            </div>
          </div>

          <div class="hub-card hub-card--wide">
            <div class="hub-card__k" style="margin-bottom:6px">🏆 이번 주 리더보드</div>
            ${lbRow(1,'🥇','별빛항해자',320,false)}
            ${lbRow(2,'🥈','꿈꾸는고래',280,false)}
            ${lbRow(3,'🥉','나 ('+(roleLabel(state.role)||'항해자')+')',state.points,true)}
            ${lbRow(4,'4','코드여행자',30,false)}
          </div>
        </div>
        <div class="spacer"></div>
        <div class="cta-dock">
          <button class="btn btn--ghost" id="restartBtn">↺ 온보딩 다시 체험하기</button>
        </div>`,
      mount(el) {
        el.querySelector('#restartBtn').addEventListener('click', () => {
          Object.assign(state, { role:null, interests:[], partner:null, question:'', completed:false });
          save(); index = 0; render(-1);
        });
        if (!state.completed) { state.completed = true; state.points += 0; save(); }
      }
    },
  ];

  /* ----------------------------------------------------------
     Small render helpers
  ---------------------------------------------------------- */
  function roleCard(value, emoji, title, desc) {
    return `<button class="opt-card" data-value="${value}">
      <span class="opt-card__emoji">${emoji}</span>
      <span class="opt-card__body"><h3>${title}</h3><p>${desc}</p></span>
      <span class="opt-card__check">✓</span>
    </button>`;
  }
  function feature(ic, h, p) {
    return `<div class="feature"><div class="feature__ic">${ic}</div><div><h4>${h}</h4><p>${p}</p></div></div>`;
  }
  const INTERESTS = [
    ['🎨','예술·디자인'],['💻','코딩·IT'],['🔬','과학·실험'],['📈','경제·경영'],
    ['🩺','의료·바이오'],['🌍','환경·지구'],['🎮','게임·콘텐츠'],['📚','교육·인문'],
    ['🎬','영상·미디어'],['🤖','AI·로봇'],['⚖️','법·정치'],['🍳','요리·푸드'],
  ];
  function interestChips() {
    return INTERESTS.map(([e,l]) =>
      `<button class="chip" draggable="true" data-emoji="${e}" data-label="${l}">${l}</button>`).join('');
  }
  function barRow(label, pct, color) {
    return `<div class="bar-row">
      <span class="bar-row__label">${label}</span>
      <span class="bar-row__track"><span class="bar-row__fill" data-pct="${pct}" style="background:${color}"></span></span>
      <span class="bar-row__pct">${pct}%</span>
    </div>`;
  }
  function challenge(ic, h, tag, done) {
    return `<div class="challenge"><div class="challenge__ic">${ic}</div>
      <div class="challenge__b"><h5>${h}</h5><p>${done?'완료한 챌린지':'완료하고 포인트 받기'}</p></div>
      <button class="challenge__go ${done?'done':''}">${tag}</button></div>`;
  }
  function lbRow(rank, medal, name, pts, me) {
    return `<div class="lb-row ${me?'me':''}">
      <span class="lb-rank ${rank<=3?'top':''}">${medal}</span>
      <span class="lb-name">${name}</span>
      <span class="lb-pts">${pts}P</span></div>`;
  }

  /* ----------------------------------------------------------
     Interests drag & drop
  ---------------------------------------------------------- */
  function mountInterests(el) {
    const tray = el.querySelector('#chipTray');
    const basket = el.querySelector('#basket');
    const items = el.querySelector('#basketItems');
    const empty = el.querySelector('#basketEmpty');
    const count = el.querySelector('#basketCount');
    const next = el.querySelector('#intNext');

    const refresh = () => {
      const n = state.interests.length;
      count.textContent = n + '개';
      empty.style.display = n ? 'none' : 'block';
      next.disabled = n < 2;
      save();
    };

    const addInterest = (label, emoji) => {
      if (state.interests.includes(label)) return;
      state.interests.push(label);
      const chip = document.createElement('button');
      chip.className = 'chip';
      chip.dataset.emoji = emoji; chip.dataset.label = label;
      chip.textContent = label;
      chip.title = '탭하면 다시 빼요';
      chip.addEventListener('click', () => {
        state.interests = state.interests.filter(i => i !== label);
        chip.remove();
        const orig = tray.querySelector(`.chip[data-label="${CSS.escape(label)}"]`);
        if (orig) orig.classList.remove('is-dropped');
        refresh();
      });
      items.appendChild(chip);
      const orig = tray.querySelector(`.chip[data-label="${CSS.escape(label)}"]`);
      if (orig) orig.classList.add('is-dropped');
      refresh();
    };

    // tap or drag from tray
    tray.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => addInterest(chip.dataset.label, chip.dataset.emoji));
      chip.addEventListener('dragstart', e => {
        chip.classList.add('dragging');
        e.dataTransfer.setData('text/plain', JSON.stringify({ l: chip.dataset.label, e: chip.dataset.emoji }));
      });
      chip.addEventListener('dragend', () => chip.classList.remove('dragging'));
    });

    basket.addEventListener('dragover', e => { e.preventDefault(); basket.classList.add('is-over'); });
    basket.addEventListener('dragleave', () => basket.classList.remove('is-over'));
    basket.addEventListener('drop', e => {
      e.preventDefault(); basket.classList.remove('is-over');
      try { const d = JSON.parse(e.dataTransfer.getData('text/plain')); addInterest(d.l, d.e); } catch {}
    });

    // restore previously chosen
    state.interests.slice().forEach(l => {
      const found = INTERESTS.find(([,lab]) => lab === l);
      if (found) { state.interests = state.interests.filter(x => x !== l); addInterest(l, found[0]); }
    });
    refresh();
  }

  /* ----------------------------------------------------------
     Recommendation engine (lightweight, deterministic)
  ---------------------------------------------------------- */
  const MAP = {
    '코딩·IT':['소프트웨어 개발',96],'AI·로봇':['AI 엔지니어',94],'게임·콘텐츠':['게임 기획자',90],
    '과학·실험':['연구원',88],'의료·바이오':['바이오 연구원',92],'예술·디자인':['UX 디자이너',89],
    '경제·경영':['데이터 애널리스트',87],'환경·지구':['환경 컨설턴트',85],'교육·인문':['에듀테크 기획',84],
    '영상·미디어':['콘텐츠 PD',86],'법·정치':['정책 분석가',83],'요리·푸드':['푸드 스타일리스트',82],
  };
  const COLORS = ['linear-gradient(90deg,#138Bff,#7bc0ff)','linear-gradient(90deg,#ff6db2,#ffa8d2)','linear-gradient(90deg,#23b39c,#5fd8c6)'];
  function buildRecommendations() {
    let recs = state.interests.map(i => MAP[i]).filter(Boolean)
      .map((r,idx) => ({ label: r[0], pct: r[1] }));
    if (recs.length < 3) {
      const fallback = [['미래 융합 진로',81],['창의 콘텐츠 기획',78],['데이터 기반 직군',75]];
      fallback.forEach(f => { if (recs.length < 3) recs.push({ label: f[0], pct: f[1] }); });
    }
    recs = recs.slice(0,3).sort((a,b)=>b.pct-a.pct);
    return recs.map((r,i) => ({ ...r, color: COLORS[i] }));
  }

  /* ----------------------------------------------------------
     Label helpers
  ---------------------------------------------------------- */
  function roleLabel(r){ return ({student:'학생',teacher:'교사',parent:'학부모'})[r] || ''; }
  function partnerLabel(){ return ({coach:'다정한 코치',analyst:'논리적 분석가',mentor:'든든한 멘토'})[state.partner] || 'AI 파트너'; }
  function partnerEmoji(){ return ({coach:'🤗',analyst:'📊',mentor:'🧭'})[state.partner] || '🦋'; }
  function escapeHtml(s){ return (s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function truncate(s,n){ return s.length>n ? s.slice(0,n)+'…' : s; }

  /* ----------------------------------------------------------
     Navigation / rendering
  ---------------------------------------------------------- */
  function render(prevIndex) {
    const def = screens[index];
    const screen = document.createElement('section');
    screen.className = 'screen';
    screen.innerHTML = def.render();

    // remove old
    const old = stage.querySelector('.screen');
    if (old) {
      old.classList.add(prevIndex < index ? 'is-left' : '');
      old.classList.remove('is-active');
      setTimeout(() => old.remove(), 440);
    }
    stage.appendChild(screen);
    requestAnimationFrame(() => screen.classList.add('is-active'));
    if (def.mount) def.mount(screen);

    // wire next buttons
    screen.querySelectorAll('[data-next]').forEach(b => b.addEventListener('click', go.bind(null, 1)));

    updateChrome();
    stage.scrollTop = 0;
  }

  function updateChrome() {
    const n = index + 1;
    progressFill.style.width = (n / screens.length * 100) + '%';
    progressLabel.textContent = `${n} / ${screens.length}`;
    document.querySelector('.progress').setAttribute('aria-valuenow', n);
    backBtn.hidden = index === 0;
    // hide skip once past onboarding into the hub, and on celebration
    skipBtn.style.visibility = (index >= screens.length - 1) ? 'hidden' : 'visible';
  }

  function go(dir) {
    const prev = index;
    index = Math.min(screens.length - 1, Math.max(0, index + dir));
    if (index !== prev) render(prev);
  }

  backBtn.addEventListener('click', () => go(-1));
  skipBtn.addEventListener('click', () => { index = screens.length - 1; render(0); });
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
  });

  /* ----------------------------------------------------------
     Confetti
  ---------------------------------------------------------- */
  function fireConfetti() {
    const canvas = document.getElementById('confetti');
    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width; canvas.height = rect.height;
    const colors = ['#138Bff', '#f4f000', '#ff6db2', '#23b39c', '#ffffff'];
    const N = 140;
    const parts = Array.from({ length: N }, () => ({
      x: canvas.width / 2 + (Math.random() - .5) * 80,
      y: canvas.height / 3,
      vx: (Math.random() - .5) * 9,
      vy: Math.random() * -12 - 4,
      g: .35 + Math.random() * .2,
      size: 5 + Math.random() * 7,
      color: colors[(Math.random() * colors.length) | 0],
      rot: Math.random() * Math.PI, vr: (Math.random() - .5) * .3,
      life: 1,
    }));
    let frame = 0;
    (function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      parts.forEach(p => {
        p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= .008;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * .6);
        ctx.restore();
      });
      frame++;
      if (frame < 200) requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    })();
  }

  /* ----------------------------------------------------------
     Boot
  ---------------------------------------------------------- */
  render(-1);
})();
