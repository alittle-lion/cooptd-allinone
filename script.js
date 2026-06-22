// ======================================================
// Guild Site v2.0 (Category + Modal System)
// ======================================================

let guilds = [];

// ------------------------------
// 초기 로드
// ------------------------------
document.addEventListener("DOMContentLoaded", () => {
    loadGuilds();

    document.getElementById("search")
        .addEventListener("input", searchGuild);

    // 모달 배경 클릭 닫기
    document.getElementById("guildModal")
        .addEventListener("click", (e) => {
            if (e.target.id === "guildModal") {
                closeModal();
            }
        });
});


// ------------------------------
// JSON 로드
// ------------------------------
async function loadGuilds() {
    try {
        const response = await fetch("data/guilds.json");
        guilds = await response.json();

        renderGuilds(guilds);

    } catch (error) {
        console.error("guilds.json 로딩 실패", error);
    }
}


// ------------------------------
// 렌더링 (HOT = 추천 영역)
// ------------------------------
function renderGuilds(data) {

    const featured = document.getElementById("featuredGuilds");
    const normal = document.getElementById("guildContainer");

    featured.innerHTML = "";
    normal.innerHTML = "";

    data.forEach(guild => {

        const card = createGuildCard(guild);

        if (guild.category === "HOT") {
            featured.appendChild(card);
        } else {
            normal.appendChild(card);
        }
    });
}


// ------------------------------
// 카드 생성 (리본 제거 + 모달 연결)
// ------------------------------
function createGuildCard(guild) {

    const card = document.createElement("div");
    card.className = "guild-card";

    card.innerHTML = `
        <div class="guild-image">
            <img src="${guild.image}" alt="${guild.name}">
        </div>

        <div class="guild-content">

            <div class="guild-name">
                ${guild.name}
            </div>

            <div class="guild-description">
                ${guild.description}
            </div>

            <div class="guild-info">
                👥 ${guild.members} / ${guild.capacity}
            </div>

            <div class="guild-category">
                🏷 ${guild.category}
            </div>

        </div>

        <button class="condition-btn" onclick='openModal(${JSON.stringify(guild)})'>
            가입조건
        </button>

        <div class="guild-footer">
            <a href="${guild.link}" target="_blank" class="join-btn">
                문의하기
            </a>
        </div>
    `;

    return card;
}


// ------------------------------
// 검색 (길드명 + 운영진)
// ------------------------------
function searchGuild() {

    const keyword = this.value.toLowerCase().trim();

    const result = guilds.filter(guild => {

        return (
            guild.name.toLowerCase().includes(keyword) ||
            guild.leader.toLowerCase().includes(keyword)
        );
    });

    renderGuilds(result);
}


// ------------------------------
// 카테고리 필터
// ------------------------------
function filterCategory(category) {

    if (category === "ALL") {
        renderGuilds(guilds);
        return;
    }

    const filtered = guilds.filter(guild =>
        guild.category === category
    );

    renderGuilds(filtered);
}


// ======================================================
// MODAL SYSTEM
// ======================================================


// ------------------------------
// 모달 열기
// ------------------------------
function openModal(guild) {

    const modal = document.getElementById("guildModal");

    modal.classList.remove("hidden");

    document.getElementById("modalBanner").src =
        guild.banner || guild.image;

    document.getElementById("modalName").textContent =
        guild.name;

    document.getElementById("modalDescription").textContent =
        guild.description;

    document.getElementById("modalLeader").textContent =
        guild.leader;

    document.getElementById("modalMembers").textContent =
        `${guild.members} / ${guild.capacity}`;

    document.getElementById("modalCondition").textContent =
        guild.condition;

    document.getElementById("modalLink").href =
        guild.link;
}


// ------------------------------
// 모달 닫기
// ------------------------------
function closeModal() {
    document.getElementById("guildModal").classList.add("hidden");
}
