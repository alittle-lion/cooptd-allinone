// ======================================================
// Guild Site v2.0 (FINAL FIX)
// ======================================================

let guilds = [];
let currentCategory = "ALL";
let currentKeyword = "";

// -----------------------------
// 초기 로드
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {

    loadGuilds();

    const searchInput = document.getElementById("search");
    if (searchInput) {
        searchInput.addEventListener("input", searchGuild);
    }

    const modal = document.getElementById("guildModal");

    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target.id === "guildModal") {
                closeModal();
            }
        });
    }

    // 기본 활성 버튼 (ALL)
    const allBtn = document.querySelector('.category-btn[data-category="ALL"]');
    if (allBtn) setActiveCategory(allBtn);
});


// -----------------------------
// JSON 로드
// -----------------------------
async function loadGuilds() {

    try {
        const response = await fetch("data/guilds.json");
        guilds = await response.json();

        applyFilters();

    } catch (error) {
        console.error("guilds.json 로딩 실패", error);
    }
}


// ======================================================
// 렌더링
// ======================================================
function renderGuilds(data) {

    const featured = document.getElementById("featuredGuilds");
    const normal = document.getElementById("guildContainer");

    if (!featured || !normal) return;

    featured.innerHTML = "";
    normal.innerHTML = "";

    data.forEach(guild => {

        const card = createGuildCard(guild);

        const cats = normalizeCategory(guild.category);

        // HOT 포함이면 추천
        if (cats.includes("HOT")) {
            featured.appendChild(card);
        } else {
            normal.appendChild(card);
        }
    });
}


// ======================================================
// 카드 생성
// ======================================================
function createGuildCard(guild) {

    const card = document.createElement("div");
    card.className = "guild-card";

    const cats = normalizeCategory(guild.category);

    card.innerHTML = `
        <div class="guild-image">
            <img src="${guild.image || ""}" alt="${guild.name || ""}">
        </div>

        <div class="guild-content">

            <div class="guild-top-row">
                <div class="guild-name">${guild.name || "이름 없음"}</div>

                <div class="guild-member">
                    👥 ${guild.members || 0} / ${guild.capacity || 0}
                </div>
            </div>

            <div class="guild-description">
                ${guild.description || ""}
            </div>

			<div class="guild-badges">

				${guild.rank ? `<span class="badge rank">RANK #${guild.rank}</span>` : ""}

				${cats.map(cat => {

					if (cat === "RANK") {
						return `<span class="badge rank">${cat}</span>`;
					}	

					if (cat === "HOT") {
						return `<span class="badge hot">${cat}</span>`;
					}

					if (cat === "NEW") {
						return `<span class="badge new">${cat}</span>`;
					}

					if (cat === "모집중") {
						return `<span class="badge recruit">${cat}</span>`;
					}
	
					if (cat === "모집중단") {
						return `<span class="badge closed">${cat}</span>`;
					}

					return `<span class="badge status">${cat}</span>`;
				}).join("")}

			</div>

        </div>

        <div class="guild-footer">

            <a href="${guild.link || "#"}" target="_blank" class="footer-btn left">
                문의하기
            </a>

            <button class="footer-btn right">
                가입조건
            </button>

        </div>
    `;

    // 안전 이벤트 바인딩
    const btn = card.querySelector(".footer-btn.right");
    if (btn) {
        btn.addEventListener("click", () => openModal(guild));
    }

    return card;
}


// ======================================================
// 검색
// ======================================================
function searchGuild() {

    currentKeyword = this.value.toLowerCase().trim();
    applyFilters();
}


// ======================================================
// 카테고리 필터
// ======================================================
function filterCategory(category, el) {

    currentCategory = category;
    setActiveCategory(el);

    applyFilters();
}


// ======================================================
// 통합 필터
// ======================================================
function applyFilters() {

    let result = guilds;

    // 카테고리
    if (currentCategory !== "ALL") {
        result = result.filter(guild =>
            normalizeCategory(guild.category).includes(currentCategory)
        );
    }

    // 검색
    if (currentKeyword) {
        result = result.filter(guild =>
            (guild.name || "").toLowerCase().includes(currentKeyword) ||
            (guild.leader || "").toLowerCase().includes(currentKeyword)
        );
    }

    renderGuilds(result);
}


// ======================================================
// 카테고리 정규화 (핵심)
// ======================================================
function normalizeCategory(category) {

    if (!category) return [];

    if (Array.isArray(category)) {
        return category;
    }

    return [category];
}


// ======================================================
// ACTIVE UI
// ======================================================
function setActiveCategory(activeBtn) {

    const buttons = document.querySelectorAll(".category-btn");

    buttons.forEach(btn => btn.classList.remove("active"));

    if (activeBtn) {
        activeBtn.classList.add("active");
    }
}


// ======================================================
// MODAL
// ======================================================
function openModal(guild) {

    const modal = document.getElementById("guildModal");
    if (!modal) return;

    modal.classList.add("show");

    document.getElementById("modalBanner").src =
        guild.banner || guild.image || "";

    document.getElementById("modalName").textContent =
        guild.name || "";

    document.getElementById("modalLeader").textContent =
        guild.leader || "미등록";

    document.getElementById("modalManager").textContent =
        guild.manager || "미등록";

    document.getElementById("modalMembers").textContent =
        `${guild.members || 0} / ${guild.capacity || 0}`;

    document.getElementById("modalStatus").textContent =
        guild.status || "미정";

    // 가입조건 출력
    const condition = document.getElementById("modalCondition");
    condition.innerHTML = "";

    if (Array.isArray(guild.condition)) {

        guild.condition.forEach(item => {

            const li = document.createElement("li");
            li.textContent = item;
            condition.appendChild(li);

        });

    } else {

        const li = document.createElement("li");
        li.textContent = guild.condition || "조건 없음";
        condition.appendChild(li);

    }

    document.getElementById("modalLink").href =
        guild.link || "#";
}


// 닫기
function closeModal() {
    const modal = document.getElementById("guildModal");
    if (modal) modal.classList.remove("show");
}
