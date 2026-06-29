// ======================================================
// Gem Simulator v1.0
// ======================================================

// -----------------------------
// 전역 변수
// -----------------------------

let gems = [];

const statistics = {
    total: 0,
    C: 0,
    B: 0,
    A: 0,
    S: 0,
    SS: 0
};

// -----------------------------
// DOM
// -----------------------------

const resultGrid = document.getElementById("resultGrid");

const modal = document.getElementById("gemModal");
const closeModal = document.getElementById("closeModal");

const modalName = document.getElementById("modalName");
const modalGrade = document.getElementById("modalGrade");
const modalType = document.getElementById("modalType");
const modalEffect = document.getElementById("modalEffect");

// -----------------------------
// JSON 불러오기
// -----------------------------

document.addEventListener("DOMContentLoaded", async () => {

    await loadGems();

});

// -----------------------------

async function loadGems() {

    try {

        const response = await fetch("gems.json");

        gems = await response.json();

        console.log("보석 로드 완료", gems);

    }

    catch (error) {

        console.error("gems.json 로드 실패");

        console.error(error);

    }

}

// ======================================================
// 확률
// ======================================================

const normalRates = [

    { grade: "C", chance: 60.0 },
    { grade: "B", chance: 30.0 },
    { grade: "A", chance: 9.0 },
    { grade: "S", chance: 0.9 },
    { grade: "SS", chance: 0.1 }

];

const royalRates = [

    { grade: "A", chance: 90.0 },
    { grade: "S", chance: 9.0 },
    { grade: "SS", chance: 1.0 }

];

// ======================================================
// 등급 결정
// ======================================================

function getRandomGrade(rateTable) {

    const random = Math.random() * 100;

    let cumulative = 0;

    for (const item of rateTable) {

        cumulative += item.chance;

        if (random <= cumulative) {

            return item.grade;

        }

    }

    return rateTable[0].grade;

}

// ======================================================
// 보석 선택
// ======================================================

function getRandomGem(rateTable) {

    const grade = getRandomGrade(rateTable);

    const candidates = gems.filter(gem => gem.grade === grade);

    if (candidates.length === 0) {

        return {

            name: "등록되지 않은 보석",

            grade: grade,

            type: "-",

            effect: [

                "해당 등급의 보석이 없습니다."

            ]

        };

    }

    const randomIndex = Math.floor(

        Math.random() * candidates.length

    );

    return candidates[randomIndex];

}

// ======================================================
// 뽑기
// ======================================================

function draw(rateTable, count) {

    const results = [];

    for (let i = 0; i < count; i++) {

        const gem = getRandomGem(rateTable);

        results.push(gem);

        statistics.total++;
        statistics[gem.grade]++;

    }

    renderResults(results);

    updateStatistics();

}

// ======================================================
// 결과 출력
// ======================================================

function renderResults(results) {

    resultGrid.innerHTML = "";

    if (results.length === 1) {

        resultGrid.style.gridTemplateColumns = "1fr";

    }

    else {

        resultGrid.style.gridTemplateColumns = "repeat(5,1fr)";

    }

    results.forEach(gem => {

        const card = document.createElement("div");

        card.className = `result-card grade-${gem.grade}`;

        card.innerHTML = `

            <div class="grade">

                ${gem.grade}

            </div>

            <div class="name">

                ${gem.name}

            </div>

        `;

        card.addEventListener("click", () => {

            openGemModal(gem);

        });

        resultGrid.appendChild(card);

    });

}

// -----------------------------
// 보석 상세창
// -----------------------------

function openGemModal(gem) {

    modalName.textContent = gem.name;

    modalGrade.textContent = gem.grade;

    modalType.textContent =
        gem.type === "special"
            ? "특수 보석"
            : "일반 보석";

    modalEffect.innerHTML = "";

    if (Array.isArray(gem.effect)) {

        gem.effect.forEach(effect => {

            const li = document.createElement("li");

            li.textContent = effect;

            modalEffect.appendChild(li);

        });

    }

    modal.style.display = "flex";

}

// -----------------------------
// 상세창 닫기
// -----------------------------

closeModal.addEventListener("click", () => {

    modal.style.display = "none";

});

window.addEventListener("click", (event) => {

    if (event.target === modal) {

        modal.style.display = "none";

    }

});

// ======================================================
// 통계
// ======================================================

function updateStatistics() {

    document.getElementById("totalDraws").textContent =
        statistics.total;

    updateGrade("C");
    updateGrade("B");
    updateGrade("A");
    updateGrade("S");
    updateGrade("SS");

}

function updateGrade(grade) {

    const count = statistics[grade];

    document.getElementById("count" + grade).textContent =
        count;

    let percent = 0;

    if (statistics.total > 0) {

        percent =
            (count / statistics.total * 100).toFixed(2);

    }

    document.getElementById("rate" + grade).textContent =
        percent + "%";

}

// ======================================================
// 버튼
// ======================================================

document.getElementById("normal1").addEventListener("click", () => {

    draw(normalRates, 1);

});

document.getElementById("normal10").addEventListener("click", () => {

    draw(normalRates, 10);

});

document.getElementById("royal1").addEventListener("click", () => {

    draw(royalRates, 1);

});

document.getElementById("royal10").addEventListener("click", () => {

    draw(royalRates, 10);

});

// ======================================================
// 초기 통계 표시
// ======================================================

updateStatistics();

// ======================================================
// 개발용 콘솔
// ======================================================

console.log("Gem Simulator Ready");
