// ======================================================
// Guild Site v2.0 (Fixed + Array Safe)
// ======================================================

let guilds = [];
let currentCategory = "ALL";
let currentKeyword = "";

// -----------------------------
// 초기 로드
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {

    loadGuilds();

    document.getElementById("search")
        .addEventListener("input", searchGuild);

    const modal = document.getElementById("guildModal");

    modal.addEventListener("click", (e) => {
        if (e.target.id === "guildModal") {
            closeModal();
        }
    });

    // 기본 카테고리 active (ALL 기준)
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

    featured.innerHTML = "";
    normal.innerHTML = "";

    data.forEach(guild => {

        const card = createGuildCard(guild);

        const cats = Array.isArray(guild.category)
            ? guild.category
            : [guild.category];

        // HOT이면 추천
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

    const cats = Array.isArray(guild.category)
        ? guild.category
        : [guild.category];

    card.innerHTML = `
        <div class="guild-image">
            <img src="${guild.image}" alt="${guild.name}">
        </div>

        <div class="guild-content">

            <div class="guild-top-row">
                <div class="guild-name">${guild.name}</div>

                <div class="guild-member">
                    👥 ${guild.members} / ${guild.capacity}
                </div>
            </div>

            <div class="guild-description">
                ${guild.description}
            </div>

            <div class="guild-badges">

                ${guild.rank ? `<span class="badge rank">RANK #${guild.rank}</span>` : ""}

                ${cats.map(cat =>
                    `<span class="badge status">${cat}</span>`
                ).join("")}

            </div>

        </div>

        <div class="guild-footer">

            <a href="${guild.link}" target="_blank" class="footer-btn left">
                문의하기
            </a>

            <button class="footer-btn right">
                가입조건
            </button>

        </div>
    `;

    // 🔥 안전한 이벤트 방식 (JSON stringify 제거)
    const modalBtn = card.querySelector(".footer-btn.right");
    modalBtn.addEventListener("click", () => openModal(guild));

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
// 카테고리 필터 (배열 대응)
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

    // 카테고리 필터
    if (currentCategory !== "ALL") {

        result = result.filter(guild => {

            const cats = Array.isArray(guild.category)
                ? guild.category
                : [guild.category];

            return cats.includes(currentCategory);
        });
    }

    // 검색 필터
    if (currentKeyword) {

        result = result.filter(guild =>
            guild.name.toLowerCase().includes(currentKeyword) ||
            (guild.leader &&
                guild.leader.toLowerCase().includes(currentKeyword))
        );
    }

    renderGuilds(result);
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

// 열기
function openModal(guild) {

    const modal = document.getElementById("guildModal");

    modal.classList.add("show"); // 🔥 hidden → show 통일

    document.getElementById("modalBanner").src =
        guild.banner || guild.image;

    document.getElementById("modalName").textContent =
        guild.name;

    document.getElementById("modalDescription").textContent =
        guild.description;

    document.getElementById("modalLeader").textContent =
        guild.leader || "미등록";

    document.getElementById("modalMembers").textContent =
        `${guild.members} / ${guild.capacity}`;

    document.getElementById("modalCondition").textContent =
        guild.condition || "조건 없음";
}


// 닫기
function closeModal() {
    document.getElementById("guildModal").classList.remove("show");
}
