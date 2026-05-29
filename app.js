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
          ${feature('🃏','AI 진로 탐색 카드','질문 1개로 관련 학과·직업·오늘의 행동까지 한 장에 정리해요.')}
          ${feature('🪜','질문 사다리 프로젝트','막연한 고민을 탐구 가능한 프로젝트 주제로 키워요.')}
          ${feature('🦋','나비 궤적 포트폴리오','질문·근거·성찰의 성장 과정을 차곡차곡 기록해요.')}
          ${feature('🏫','학교·지역 데이터','공공데이터로 진로를 학교 활동·지역 자원과 연결해요.')}
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

    /* 7 — AI 진로 탐색 카드 (AI 답변 생성 시뮬레이션) ------------------ */
    {
      render: () => `
        <span class="eyebrow">STEP 6 · AI 진로 탐색 카드</span>
        <div class="ai-head">
          ${nabi(78)}
          ${speech(`${partnerLabel()}가 <b>공공데이터</b>로<br/>네 고민을 카드로 정리하고 있어!`)}
        </div>
        <div class="ai-loader" id="aiLoader">
          <div class="ai-step"><i>🔑</i><span>질문에서 관심 키워드 추출</span><em>⏳</em></div>
          <div class="ai-step"><i>🏷️</i><span>진로 불안 유형 분류</span><em>⏳</em></div>
          <div class="ai-step"><i>📚</i><span>공공데이터 근거 검색 (RAG)</span><em>⏳</em></div>
          <div class="ai-step"><i>🧮</i><span>트렌드 면역 점수 계산</span><em>⏳</em></div>
          <div class="ai-step"><i>🃏</i><span>AI 진로 탐색 카드 생성</span><em>⏳</em></div>
        </div>
        <div class="ai-result" id="aiResult" hidden>
          ${careerCardHtml()}
        </div>
        <div class="spacer"></div>
        <div class="cta-dock" id="aiDock" hidden>
          <button class="btn btn--primary" data-next>🪜 이 고민으로 프로젝트 시작하기</button>
        </div>`,
      mount(el) {
        const steps = [...el.querySelectorAll('.ai-step')];
        let i = 0;
        const finish = () => {
          if (!el.isConnected) return;
          const loader = el.querySelector('#aiLoader');
          loader.classList.add('fade');
          setTimeout(() => {
            if (!el.isConnected) return;
            loader.hidden = true;
            const r = el.querySelector('#aiResult');
            r.hidden = false; r.classList.add('reveal');
            el.querySelector('#aiDock').hidden = false;
            r.querySelectorAll('.imm__fl').forEach(f => f.style.width = f.dataset.pct + '%');
          }, 380);
        };
        const step = () => {
          if (!el.isConnected) return;
          if (i > 0) {
            const p = steps[i - 1];
            p.classList.remove('active'); p.classList.add('done');
            p.querySelector('em').textContent = '✓';
          }
          if (i < steps.length) { steps[i].classList.add('active'); i++; setTimeout(step, 560); }
          else finish();
        };
        setTimeout(step, 420);
      }
    },

    /* 8 — 질문 사다리 프로젝트 보드 (사다리 오르기 게이미피케이션) --------- */
    {
      render: () => {
        const L = questionLadder();
        return `
        <span class="eyebrow">STEP 7 · 질문 사다리 🪜</span>
        <h2 class="title">막연한 질문을<br/><span class="hl">탐구 프로젝트</span>로 키워요</h2>
        <p class="subtitle">한 칸씩 오르며 질문이 깊어져요. 나비를 정상까지 올려보세요!</p>
        <div class="ladder">
          ${L.map((r, idx) => `
            <div class="rung ${idx === 0 ? 'reached' : ''}" data-i="${idx}">
              <span class="rung__nabi">${idx === 0 ? '🦋' : ''}</span>
              <div class="rung__body"><span class="rung__step">${r.step}</span><span class="rung__q">${r.q}</span></div>
            </div>`).reverse().join('')}
        </div>
        <div class="spacer"></div>
        <div class="cta-dock">
          <button class="btn btn--primary" id="climbBtn">⬆️ 한 칸 오르기 (1/5)</button>
          <button class="btn btn--primary" data-next id="ladderNext" hidden>🎉 프로젝트 주제 완성! 다음</button>
        </div>`;
      },
      mount(el) {
        const total = questionLadder().length;
        let cur = 0;
        const climb = el.querySelector('#climbBtn');
        climb.addEventListener('click', () => {
          if (cur >= total - 1) return;
          el.querySelector(`.rung[data-i="${cur}"] .rung__nabi`).textContent = '';
          cur++;
          const next = el.querySelector(`.rung[data-i="${cur}"]`);
          next.classList.add('reached');
          next.querySelector('.rung__nabi').textContent = '🦋';
          next.scrollIntoView({ block: 'center', behavior: 'smooth' });
          climb.textContent = `⬆️ 한 칸 오르기 (${cur + 1}/${total})`;
          if (cur >= total - 1) {
            climb.hidden = true;
            el.querySelector('#ladderNext').hidden = false;
            state.points += 10; save();
            fireConfetti();
          }
        });
      }
    },

    /* 9 — Milestone celebration (badge) --------------------------- */
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
          <p class="subtitle">${state.role ? roleLabel(state.role)+'으로서 ' : ''}첫 AI 진로 카드와 프로젝트 주제까지 완성했어요!<br/>이제 공공데이터 가이드로 나의 항해를 시작해요.</p>
        </div>
        <div class="spacer"></div>
        <div class="cta-dock">
          <button class="btn btn--primary" data-next>📊 공공데이터 가이드 보기</button>
        </div>`,
      mount() { fireConfetti(); }
    },

    /* 8 — Data guide preview (Aha! value) ------------------------- */
    {
      render: () => {
        const recs = buildRecommendations();
        return `
        <span class="eyebrow">STEP 8 · 학교·지역 데이터 가이드</span>
        <h2 class="title">공공데이터로 분석한<br/><span class="hl">맞춤 진로 적합도</span> 🧭</h2>
        <p class="subtitle">${state.interests.length ? '“'+state.interests.slice(0,3).join(', ')+'”' : '선택한 관심사'} · 대학알리미·워크넷 학과/직업 데이터 기반</p>
        <div class="preview-card">
          <div class="preview-card__head">
            <div class="preview-card__avatar">${partnerEmoji()}</div>
            <div>
              <h4>${partnerLabel()}의 분석</h4>
              <span>${state.question ? '“'+truncate(state.question,22)+'”에 대한 답' : '관심사 기반 추천'}</span>
            </div>
          </div>
          ${recs.map(r => barRow(r.label, r.pct, r.color)).join('')}
          <div class="insight">💡 <b>${recs[0].label}</b> 적합도가 가장 높아요! 교육청 대시보드에서는 이 데이터가 지역별 진로교육 수요로 모여요. <span style="color:var(--ink-soft)">출처 · 대학알리미, 워크넷 (공공데이터포털)</span></div>
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
            <div class="hub-card__k" style="margin-bottom:10px">🧭 나비 나침반 전체 기능 <small style="font-weight:400;color:var(--ink-soft)">· 탭하면 열려요</small></div>
            <div class="svc-grid">
              ${svcTile('card','🃏','AI 진로 탐색 카드')}
              ${svcTile('ladder','🪜','질문 사다리 보드')}
              ${svcTile('portfolio','🦋','나비 궤적 포트폴리오')}
              ${svcTile('immunity','🛡️','트렌드 면역 점수')}
              ${svcTile(roleSvc().key, roleSvc().emoji, roleSvc().label)}
              ${svcTile('log','🔍','AI 사용 투명성 로그')}
            </div>
          </div>

          <div class="hub-card hub-card--wide">
            <div class="hub-card__k" style="margin-bottom:8px">🎯 오늘의 챌린지</div>
            ${challenge('🃏','진로 카드 1장 더 뽑기','+20P', false, 'card')}
            ${challenge('📝','질문 사다리로 프로젝트 만들기','+15P', false, 'ladder')}
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
        el.querySelectorAll('[data-svc]').forEach(t =>
          t.addEventListener('click', () => { const c = svcContent(t.dataset.svc); if (c) openModal(c.title, c.html); }));
        if (!state.completed) { state.completed = true; save(); }
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
  function challenge(ic, h, tag, done, svc) {
    return `<div class="challenge"${svc?` data-svc="${svc}"`:''} ${svc?'style="cursor:pointer"':''}><div class="challenge__ic">${ic}</div>
      <div class="challenge__b"><h5>${h}</h5><p>${done?'완료한 챌린지':'완료하고 포인트 받기'}</p></div>
      <button class="challenge__go ${done?'done':''}">${tag}</button></div>`;
  }
  function svcTile(key, emoji, label) {
    return `<button class="svc-tile" data-svc="${key}"><span class="svc-tile__ic">${emoji}</span><span class="svc-tile__l">${label}</span></button>`;
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

  /* ============================================================
     AI 진로 탐색 카드 — 지식 베이스 & 시뮬레이션 생성기
     (실제 AI 호출 없이, 기획 문서 구조를 따른 규칙 기반 생성)
  ============================================================ */
  const DOMAINS = {
    design: { topic:'디자인·콘텐츠', emoji:'🎨',
      majors:['시각디자인학과','산업디자인학과','UX·서비스디자인학과'],
      jobs:['UX 디자이너','브랜드 경험 디자이너','콘텐츠 서비스 기획자'],
      skills:['문제정의','사용자 공감','기획력','시각적 의사소통'],
      activity:'디자인 동아리에서 우리 학교 앱·포스터를 다시 디자인하고, 친구 3명을 인터뷰해 탐구보고서로 정리해 보세요.',
      actions:['관심 서비스 1개의 화면을 캡처해 "불편한 점 3가지" 적어보기','AI 이미지 도구로 같은 주제를 만들어 보고 한계 찾기','내 결과물에 "왜 이렇게 디자인했는지" 한 문단 쓰기'],
      immunity:{auto:68, scale:86, comp:90}, kw:['디자인','그림','예술','미술','드로잉','ux','ui','브랜드','콘텐츠','패션'] },
    ai: { topic:'AI·데이터', emoji:'🤖',
      majors:['인공지능학과','데이터사이언스학과','컴퓨터공학과'],
      jobs:['AI 엔지니어','데이터 분석가','MLOps 개발자'],
      skills:['데이터 해석','문제정의','논리적 사고','협업'],
      activity:'공공데이터포털에서 관심 주제 데이터를 받아 파이썬으로 그래프를 만들고, 발견한 인사이트를 발표해 보세요.',
      actions:['공공데이터포털에서 관심 주제 데이터셋 1개 찾아보기','오늘 배운 개념을 AI에게 질문하고 내 말로 다시 정리하기','간단한 표 1개를 만들어 패턴 1가지 찾기'],
      immunity:{auto:38, scale:95, comp:92}, kw:['ai','인공지능','데이터','코딩','개발','프로그래밍','it','로봇','머신','소프트웨어','컴퓨터'] },
    bio: { topic:'의료·바이오', emoji:'🧬',
      majors:['생명공학과','간호학과','보건의료·바이오학과'],
      jobs:['바이오 연구원','보건의료 데이터 분석가','임상시험 코디네이터'],
      skills:['탐구 설계','데이터 해석','윤리적 판단','꼼꼼함'],
      activity:'과학 탐구 동아리에서 관심 건강 주제로 가설을 세우고 간단한 자료조사 보고서를 써보세요.',
      actions:['관심 의료·바이오 뉴스 1개 읽고 핵심 3줄 요약','"이 기술의 이점/위험" 비교 표 만들기','관련 학과 커리큘럼 1개 찾아보기'],
      immunity:{auto:45, scale:82, comp:88}, kw:['의료','바이오','생명','간호','의사','약','건강','생물','병원'] },
    game: { topic:'게임·미디어', emoji:'🎮',
      majors:['게임공학과','영상·미디어학과','콘텐츠학과'],
      jobs:['게임 기획자','콘텐츠 PD','인터랙티브 미디어 디자이너'],
      skills:['스토리 기획','사용자 경험','협업','기획력'],
      activity:'팀을 만들어 간단한 게임·영상 기획안을 쓰고, 종이 프로토타입으로 친구들에게 테스트해 보세요.',
      actions:['좋아하는 콘텐츠가 "왜 재미있는지" 3가지 분석','5분짜리 기획 아이디어 한 장으로 정리','AI로 초안 만들고 내가 바꾼 부분 표시하기'],
      immunity:{auto:55, scale:90, comp:85}, kw:['게임','영상','미디어','콘텐츠','웹툰','애니','유튜브','방송'] },
    biz: { topic:'경제·경영', emoji:'📈',
      majors:['경영학과','경제학과','데이터경영·마케팅학과'],
      jobs:['데이터 애널리스트','마케팅 기획자','창업가'],
      skills:['데이터 해석','문제정의','설득력','기획력'],
      activity:'학교 축제·동아리 운영을 "작은 창업"처럼 기획하고, 결과를 수치로 정리해 발표해 보세요.',
      actions:['관심 브랜드가 "어떻게 돈을 버는지" 설명해보기','용돈·시간 사용을 1주일 기록해 패턴 찾기','관심 분야 시장 뉴스 1개 요약'],
      immunity:{auto:50, scale:88, comp:84}, kw:['경제','경영','창업','마케팅','비즈니스','주식','회사','경영자','사업'] },
    edu: { topic:'교육·인문', emoji:'📚',
      majors:['교육학과','심리학과','국어국문·언어학과'],
      jobs:['교사·에듀테크 기획자','상담사','콘텐츠 작가'],
      skills:['공감','설명력','문제정의','글쓰기'],
      activity:'친구에게 어려운 개념을 쉽게 설명하는 "5분 미니 수업"을 만들고 피드백을 받아보세요.',
      actions:['내가 잘 아는 것을 한 문단으로 쉽게 설명해보기','관심 사회문제 1개에 대한 내 생각 3줄 쓰기','관련 직업인 인터뷰·영상 1개 찾아보기'],
      immunity:{auto:48, scale:80, comp:86}, kw:['교육','인문','심리','상담','선생','교사','글쓰기','언어','역사','사회','문학'] },
    env: { topic:'환경·지구', emoji:'🌍',
      majors:['환경공학과','지구환경과학과','에너지공학과'],
      jobs:['환경 컨설턴트','기후·에너지 데이터 분석가','ESG 기획자'],
      skills:['데이터 해석','문제정의','시스템 사고','협업'],
      activity:'우리 학교·동네의 환경 문제 1개를 정해 데이터로 측정하고 개선 캠페인을 기획해 보세요.',
      actions:['관심 환경 이슈의 원인-결과 정리','우리 학교에서 줄일 수 있는 자원 1가지 찾기','관련 공공데이터·뉴스 1개 요약'],
      immunity:{auto:42, scale:84, comp:87}, kw:['환경','지구','기후','에너지','생태','탄소','esg','지속가능'] },
  };
  const DEFAULT_DOMAIN = { topic:'미래 융합 진로', emoji:'🧭',
    majors:['자유전공·융합학부','데이터·인문 융합과정','관심 분야 연계 학과'],
    jobs:['융합형 기획자','문제 해결 전문가','데이터 기반 의사결정가'],
    skills:['문제정의','데이터 해석','기획력','의사소통'],
    activity:'관심 주제 1개를 정해 "질문 → 자료조사 → 작은 결과물"로 이어지는 미니 프로젝트를 만들어 보세요.',
    actions:['지금 가장 궁금한 진로 질문 1개를 구체적으로 적기','관련 학과·직업 1개씩 찾아보기','오늘 10분 동안 할 수 있는 작은 탐구 실천하기'],
    immunity:{auto:50, scale:85, comp:86} };
  const INTEREST_DOMAIN = {
    '예술·디자인':'design','코딩·IT':'ai','AI·로봇':'ai','과학·실험':'bio','의료·바이오':'bio',
    '게임·콘텐츠':'game','영상·미디어':'game','경제·경영':'biz','교육·인문':'edu','환경·지구':'env','법·정치':'edu','요리·푸드':'biz',
  };

  function resolveDomain() {
    const q = (state.question || '').toLowerCase();
    for (const d of Object.values(DOMAINS)) if (d.kw.some(k => q.includes(k))) return d;
    for (const it of state.interests) { const key = INTEREST_DOMAIN[it]; if (DOMAINS[key]) return DOMAINS[key]; }
    return DEFAULT_DOMAIN;
  }
  function detectAnxiety() {
    const q = state.question || '';
    const ql = q.toLowerCase();
    if (/(대체|없어|사라|뺏|위협|줄어|불필요)/.test(q) && /(ai|인공지능|자동|로봇)/.test(ql))
      return ['기술 변화 불안', '빠른 AI·산업 변화 속에서 "지금 배우는 게 의미 있을까" 하는 마음'];
    if (/(성적|등급|점수|내신|수능|모의고사)/.test(q))
      return ['성적 불안', '성적만을 기준으로 진로를 좁히게 될까 하는 마음'];
    if (/(학과|전공|진학|대학|계열)/.test(q))
      return ['학과 선택 불안', '어떤 학과·계열이 나에게 맞을지 확신이 서지 않는 마음'];
    if (/(자격증|스펙|취업|취직|먹고살|돈벌)/.test(q))
      return ['취업·자격 불안', '"이걸로 먹고살 수 있을까" 하는 현실적인 마음'];
    return ['진로 방향 불안', '정보는 많은데 무엇을 기준으로 선택할지 모르겠는 마음'];
  }
  function careerData() {
    const d = resolveDomain();
    const [atype, adesc] = detectAnxiety();
    const q = state.question || `${d.topic} 분야가 궁금해요`;
    const summary = `“${truncate(q, 38)}” — ${d.topic} 분야에서 무엇을 기준으로 준비할지 고민하고 있어요.`;
    return { d, atype, adesc, q, summary };
  }
  function immBar(label, pct) {
    return `<div class="imm"><span class="imm__l">${label}</span><span class="imm__tr"><span class="imm__fl" data-pct="${pct}"></span></span><b>${pct}</b></div>`;
  }
  function careerCardHtml() {
    const { d, atype, adesc, summary } = careerData();
    const chip = (t, cls='') => `<span class="ai-chip ${cls}">${t}</span>`;
    const im = d.immunity;
    return `
    <div class="ai-card">
      <div class="ai-card__top"><span class="ai-card__badge">🃏 AI 진로 탐색 카드</span><span class="ai-card__tag">공공데이터 기반</span></div>
      <div class="ai-field"><h5>💭 고민 요약</h5><p>${summary}</p></div>
      <div class="ai-field"><h5>🏷️ 불안 유형</h5><p><b style="color:var(--blue)">${atype}</b> · ${adesc}</p></div>
      <div class="ai-2col">
        <div class="ai-field"><h5>🎓 관련 학과</h5><div class="ai-chips">${d.majors.map(m=>chip(m)).join('')}</div></div>
        <div class="ai-field"><h5>💼 관련 직업</h5><div class="ai-chips">${d.jobs.map(j=>chip(j,'pink')).join('')}</div></div>
      </div>
      <div class="ai-field"><h5>🌟 마스터리 역량</h5><div class="ai-chips">${d.skills.map(s=>chip(s,'yellow')).join('')}</div></div>
      <div class="ai-field"><h5>🛡️ 트렌드 면역 점수 <small>높을수록 AI 시대에 강해요</small></h5>
        ${immBar('자동화 안정성', 100 - im.auto)}${immBar('확장 가능성', im.scale)}${immBar('역량 성장성', im.comp)}
      </div>
      <div class="ai-field"><h5>🏫 학교에서 할 활동</h5><p>${d.activity}</p></div>
      <div class="ai-field"><h5>✅ 오늘의 행동 3가지</h5><ul class="ai-todo">${d.actions.map(a=>`<li>${a}</li>`).join('')}</ul></div>
      <div class="ai-src">📚 출처 · 대학알리미 학과정보, 워크넷 직업분류·전망, KNOW 재직자조사, 학교알리미 상담·특색사업 <span>(공공데이터포털)</span></div>
    </div>`;
  }
  function questionLadder() {
    const t = resolveDomain().topic;
    return [
      { step:'1단계 · 사실 질문',  q:`AI는 ${t} 분야의 일을 정말 대체할까?` },
      { step:'2단계 · 비교 질문',  q:`${t}에서 AI가 대체하기 쉬운 일과 어려운 일은 무엇일까?` },
      { step:'3단계 · 원인 질문',  q:`왜 ${t}의 문제정의·기획은 자동화되기 어려울까?` },
      { step:'4단계 · 비판 질문',  q:`"AI를 잘 쓰는 사람이 곧 좋은 ${t} 전문가"라는 말은 맞을까?` },
      { step:'5단계 · 프로젝트 질문', q:`고등학생이 AI 시대 ${t} 역량을 증명하려면 어떤 프로젝트를 만들 수 있을까?` },
    ];
  }

  /* ============================================================
     서비스 상세 (모달) — 기획 문서의 메인/서브 서비스 구현
  ============================================================ */
  function roleSvc() {
    if (state.role === 'teacher') return { key:'teacher', emoji:'🧑‍🏫', label:'교사용 상담 요약 카드' };
    if (state.role === 'parent')  return { key:'parent',  emoji:'👨‍👩‍👧', label:'학부모 설명 카드' };
    return { key:'recovery', emoji:'🌱', label:'학습 회복 체크인' };
  }
  function kvTable(rows) {
    return `<table class="kv">${rows.map(([k,v]) =>
      `<tr><th>${k}</th><td>${v}</td></tr>`).join('')}</table>`;
  }
  function modalNote(html){ return `<p class="modal-note">${html}</p>`; }

  function svcContent(key) {
    const { d, atype, summary } = careerData();
    switch (key) {
      case 'card':
        return { title:'🃏 AI 진로 탐색 카드', html: careerCardHtml() };
      case 'ladder': {
        const L = questionLadder();
        const mastery = ['문제 발견','질문 생성','자료 조사','가설 설정','분석·제작','발표','피드백','회고','포트폴리오 저장'];
        return { title:'🪜 질문 사다리 프로젝트 보드', html:
          `<div class="ladder ladder--static">${L.map((r,i)=>`<div class="rung reached" data-i="${i}"><div class="rung__body"><span class="rung__step">${r.step}</span><span class="rung__q">${r.q}</span></div></div>`).reverse().join('')}</div>
           ${modalNote('막연한 질문을 탐구 가능한 <b>프로젝트 주제</b>로 키워요. 이후 마스터리 역량을 단계별로 기록해요.')}
           <div class="mastery">${mastery.map(m=>`<span>${m}</span>`).join('<i>→</i>')}</div>` };
      }
      case 'portfolio': {
        const rows = [
          ['🌱 나의 첫 질문', state.question ? `“${escapeHtml(state.question)}”` : '아직 기록된 질문이 없어요'],
          ['🪜 질문 변화 과정', `사실 → 비교 → 원인 → 비판 → 프로젝트 질문 (${d.topic})`],
          ['📚 탐구 근거', '대학알리미·워크넷·KNOW 등 공공데이터 카드 1건'],
          ['🎯 프로젝트 결과물', `${d.topic} 미니 프로젝트 (기획 단계)`],
          ['💬 피드백', 'AI·교사·동료 피드백 기록'],
          ['🪞 성장 성찰', '내가 직접 판단한 부분과 다음 목표'],
          ['🔍 AI 사용 로그', '사용 목적·수정 여부·출처 확인 자동 기록'],
        ];
        return { title:'🦋 나비 궤적 포트폴리오', html:
          kvTable(rows) + modalNote('결과물이 아니라 <b>질문·근거·실패·수정·성찰의 과정</b>을 기록하는 과정 중심 포트폴리오예요.') };
      }
      case 'immunity': {
        const im = d.immunity;
        return { title:'🛡️ 트렌드 면역 점수', html:
          `<p class="modal-lead"><b>${d.jobs[0]}</b> 기준 · AI 자동화 시대에 얼마나 강한 진로인지 점수화해요.</p>
           <div class="imm-box">${immBar('자동화 안정성', 100-im.auto)}${immBar('확장 가능성', im.scale)}${immBar('역량 성장성', im.comp)}</div>
           ${modalNote('워크넷 직업전망·KNOW 재직자조사 기반의 <b>설명 가능한 점수</b>로, 진로 불안을 구체적인 준비 방향으로 바꿔줘요.')}` };
      }
      case 'teacher':
        return { title:'🧑‍🏫 교사용 상담 요약 카드', html:
          kvTable([
            ['학생 고민 요약', summary],
            ['불안 유형', `<b>${atype}</b>`],
            ['추천 상담 질문', '“그 고민을 느낀 구체적인 순간이 있었니?”'],
            ['지도 포인트', '진로·학습·정서 코칭 방향 제시'],
            ['관련 활동', '학교 특색사업·동아리·탐구활동 연결'],
            ['교사 승인', 'AI 결과를 교사가 수정·승인'],
          ]) + modalNote('교사를 대체하지 않고, <b>상담 준비 시간을 줄이고</b> 학생을 더 깊이 이해하도록 돕는 AI예요.') };
      case 'parent':
        return { title:'👨‍👩‍👧 학부모 설명 카드', html:
          kvTable([
            ['자녀 관심 분야', d.topic],
            ['쉬운 설명', '단순 제작보다 문제 발견·기획력이 중요해지고 있어요'],
            ['가정에서 도울 점', '결과보다 <b>과정</b>에 대해 질문해 주세요'],
            ['피해야 할 말', '“그거 해서 뭐 먹고살래?”'],
            ['추천 대화', '“그 일을 하려면 무엇부터 해보고 싶어?”'],
          ]) + modalNote('자녀의 관심 분야를 <b>쉬운 언어</b>로 이해하도록 돕는 가정용 가이드예요.') };
      case 'recovery':
        return { title:'🌱 학습 회복 체크인', html:
          kvTable([
            ['발표 실패', '다음에는 무엇을 바꿀 수 있을까?'],
            ['팀 갈등', '상대 입장에서 어려웠던 점은 무엇일까?'],
            ['성적 불안', '지금 통제 가능한 행동은 무엇일까?'],
            ['AI 의존', '이번 과제에서 내가 직접 판단한 부분은 어디일까?'],
            ['무기력', '오늘 10분 안에 할 수 있는 가장 작은 행동은?'],
          ]) + modalNote('심리 진단이 아니라 <b>학습 회복 지원</b>이에요. 위험 신호가 감지되면 교사·상담교사·전문기관 연계로 전환해요.') };
      case 'log':
        return { title:'🔍 AI 사용 투명성 로그', html:
          kvTable([
            ['사용한 AI', 'ChatGPT, Gemini, NotebookLM'],
            ['사용 목적', '자료 요약, 질문 생성, 글 피드백'],
            ['그대로 사용?', '아니오 — 내가 수정함'],
            ['출처 확인?', '확인함'],
            ['개인정보 입력?', '입력하지 않음'],
            ['내가 판단한 부분', '결론과 사례는 직접 작성'],
            ['교사 확인', '승인 / 보완 필요'],
          ]) + modalNote('AI를 금지하지 않고 <b>책임 있게 썼는지 기록</b>해요. AI 윤리교육·수행평가 공정성에 대응해요.') };
    }
    return null;
  }

  /* 모달 ------------------------------------------------------- */
  function openModal(title, html) {
    const wrap = document.createElement('div');
    wrap.className = 'modal';
    wrap.innerHTML =
      `<div class="modal__sheet" role="dialog" aria-label="${title}">
        <div class="modal__bar"><h3>${title}</h3><button class="modal__x" aria-label="닫기">✕</button></div>
        <div class="modal__body">${html}</div>
      </div>`;
    document.getElementById('device').appendChild(wrap);
    void wrap.offsetHeight; // force reflow so the closed state is committed before transitioning
    wrap.classList.add('open');
    setTimeout(() => wrap.querySelectorAll('.imm__fl').forEach(f => f.style.width = f.dataset.pct + '%'), 60);
    const close = () => { wrap.classList.remove('open'); setTimeout(() => wrap.remove(), 260); };
    wrap.querySelector('.modal__x').addEventListener('click', close);
    wrap.addEventListener('click', e => { if (e.target === wrap) close(); });
  }

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
