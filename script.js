// ======================================================
// Guild Site v2.1 FIXED FULL VERSION
// ======================================================

let guilds = [];
let currentCategory = "ALL";
let currentKeyword = "";

// ======================================================
// INIT
// ======================================================

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

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeModal();
        }
    });

    // 기본 ALL 버튼 활성화
    const allBtn = document.querySelector('.category-btn[data-category="ALL"]');
    if (allBtn) setActiveCategory(allBtn);
});


// ======================================================
// LOAD JSON
// ======================================================

async function loadGuilds() {

    try {

        const response = await fetch("data/guilds.json");

        if (!response.ok) throw new Error("JSON 로딩 실패");

        guilds = await response.json();

        applyFilters();

    } catch (err) {
        console.error("guilds.json 로딩 실패", err);
    }
}


// ======================================================
// RENDER
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

        if (cats.includes("HOT")) {
            featured.appendChild(card);
        } else {
            normal.appendChild(card);
        }
    });
}


// ======================================================
// CREATE CARD
// ======================================================

function createGuildCard(guild) {

    const card = document.createElement("div");
    card.className = "guild-card";

    const cats = normalizeCategory(guild.category);

    card.innerHTML = `
        <div class="guild-image">
            <img src="${guild.image || guild.banner || ""}" alt="${guild.name || ""}">
        </div>

        <div class="guild-content">

            <div class="guild-top-row">
                <div class="guild-name">${guild.name || "이름 없음"}</div>
                <div class="guild-member">👥 ${guild.members || 0} / ${guild.capacity || 0}</div>
            </div>

            <div class="guild-description">
                ${guild.description || ""}
            </div>

            <div class="guild-badges">

                ${guild.rank ? `<span class="badge rank">RANK #${guild.rank}</span>` : ""}

                ${cats.map(cat => {

                    switch (cat) {
                        case "RANK":
                            return `<span class="badge rank">RANK</span>`;
                        case "HOT":
                            return `<span class="badge hot">HOT</span>`;
                        case "NEW":
                            return `<span class="badge new">NEW</span>`;
                        case "recruit":
                        case "모집중":
                            return `<span class="badge recruit">모집중</span>`;
                        case "closed":
                        case "모집중단":
                            return `<span class="badge closed">모집중단</span>`;
                        default:
                            return `<span class="badge status">${cat}</span>`;
                    }

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

    const btn = card.querySelector(".footer-btn.right");

    if (btn) {
        btn.addEventListener("click", () => openModal(guild));
    }

    return card;
}


// ======================================================
// SEARCH
// ======================================================

function searchGuild() {
    currentKeyword = this.value.toLowerCase().trim();
    applyFilters();
}


// ======================================================
// CATEGORY FILTER
// ======================================================

function filterCategory(category, el) {

    currentCategory = category;

    setActiveCategory(el);

    applyFilters();
}


// ======================================================
// APPLY FILTERS
// ======================================================

function applyFilters() {

    let result = [...guilds];

    // category filter
    if (currentCategory !== "ALL") {

        result = result.filter(guild => {

            const cats = normalizeCategory(guild.category);

            switch (currentCategory) {

                case "RANK":
                    return guild.rank != null;

                case "recruit":
                    return cats.includes("recruit") || cats.includes("모집중");

                case "closed":
                    return cats.includes("closed") || cats.includes("모집중단");

                default:
                    return cats.includes(currentCategory);
            }
        });
    }

    // search filter
    if (currentKeyword) {

        result = result.filter(guild => {

            return (
                (guild.name || "").toLowerCase().includes(currentKeyword) ||
                (guild.leader || "").toLowerCase().includes(currentKeyword) ||
                ((guild.manager || guild.officers?.join(" ") || "").toLowerCase().includes(currentKeyword))
            );
        });
    }

    renderGuilds(result);
}


// ======================================================
// NORMALIZE CATEGORY
// ======================================================

function normalizeCategory(category) {

    if (!category) return [];
    if (Array.isArray(category)) return category;

    return [category];
}


// ======================================================
// ACTIVE BUTTON
// ======================================================

function setActiveCategory(activeBtn) {

    document.querySelectorAll(".category-btn")
        .forEach(btn => btn.classList.remove("active"));

    if (activeBtn) activeBtn.classList.add("active");
}


// ======================================================
// MODAL OPEN
// ======================================================

function openModal(guild) {

    const modal = document.getElementById("guildModal");
    if (!modal) return;

    modal.classList.add("show");
    document.body.style.overflow = "hidden";

    const banner = document.getElementById("modalBanner");
    if (banner) {
        banner.src = guild.banner || guild.image || "";
        banner.alt = guild.name || "";
    }

    const name = document.getElementById("modalName");
    if (name) name.textContent = guild.name || "이름 없음";

    const leader = document.getElementById("modalLeader");
    if (leader) leader.textContent = guild.leader || "미등록";

    const manager = document.getElementById("modalManager");
    if (manager) {
        manager.textContent = Array.isArray(guild.officers)
            ? guild.officers.join(", ")
            : (guild.manager || "미등록");
    }

    const members = document.getElementById("modalMembers");
    if (members) {
        members.textContent = `${guild.members || 0} / ${guild.capacity || 0}`;
    }

    const status = document.getElementById("modalStatus");
    if (status) {

        if (guild.status) {
            status.textContent = guild.status;
        } else {
            const cats = normalizeCategory(guild.category);

            if (cats.includes("recruit") || cats.includes("모집중")) {
                status.textContent = "모집중";
            } else if (cats.includes("closed") || cats.includes("모집중단")) {
                status.textContent = "모집중단";
            } else {
                status.textContent = "-";
            }
        }
    }

    const condition = document.getElementById("modalCondition");

    if (condition) {

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
    }

    const link = document.getElementById("modalLink");

    if (link) {

        link.href = guild.link || "#";

        if (!guild.link) {
            link.classList.add("disabled");
            link.textContent = "문의 불가";
        } else {
            link.classList.remove("disabled");
            link.textContent = "문의하기";
        }
    }
}


// ======================================================
// MODAL CLOSE
// ======================================================

function closeModal() {

    const modal = document.getElementById("guildModal");

    if (!modal) return;

    modal.classList.remove("show");
    document.body.style.overflow = "";
}
