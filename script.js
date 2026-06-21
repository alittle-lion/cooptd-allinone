// ===========================================
// 협동 디펜스 길드 홍보 사이트
// ===========================================

const guilds = [

    {
        name: "Knight",

        description: "매일 활발하게 플레이하는 친목 길드",

        image: "images/guild1.jpg",

        members: "48 / 50",

        featured: true,

        ribbons: [
            "HOT",
            "NEW",
            "RANK #1"
        ],

        link: "https://open.kakao.com/"
    },

    {
        name: "Guardian",

        description: "뉴비 환영! 같이 성장하는 길드",

        image: "images/guild2.jpg",

        members: "39 / 50",

        featured: true,

        ribbons: [
            "모집중"
        ],

        link: "https://open.kakao.com/"
    },

    {
        name: "Legend",

        description: "랭커 중심 공략 길드",

        image: "images/guild3.jpg",

        members: "50 / 50",

        featured: false,

        ribbons: [
            "BEST",
            "RANK #2"
        ],

        link: "https://open.kakao.com/"
    }

];

// ===============================

const featuredContainer =
document.getElementById("featuredGuilds");

const guildContainer =
document.getElementById("guildContainer");

const search =
document.getElementById("search");

// ===============================

createGuilds(guilds);

// ===============================

search.addEventListener("input", function(){

    const keyword =
    this.value.toLowerCase();

    const result = guilds.filter(guild =>

        guild.name.toLowerCase().includes(keyword)

    );

    createGuilds(result);

});

// ===============================

function createGuilds(list){

    featuredContainer.innerHTML = "";

    guildContainer.innerHTML = "";

    list.forEach(guild=>{

        const card =
        createCard(guild);

        if(guild.featured){

            featuredContainer.appendChild(card);

        }

        else{

            guildContainer.appendChild(card);

        }

    });

}

// ===============================

function createCard(guild){

    const card =
    document.createElement("div");

    card.className =
    "guild-card";

    card.innerHTML = `

        <div class="ribbon-container">

            ${createRibbons(guild.ribbons)}

        </div>

        <div class="guild-image">

            <img src="${guild.image}">

        </div>

        <div class="guild-content">

            <div class="guild-name">

                ${guild.name}

            </div>

            <div class="guild-description">

                ${guild.description}

            </div>

            <div class="guild-info">

                👥 ${guild.members}

            </div>

        </div>

        <div class="guild-footer">

            <a
                href="${guild.link}"
                target="_blank"
                class="join-btn">

                가입하기

            </a>

        </div>

    `;

    return card;

}

// ===============================

function createRibbons(ribbons){

    let html = "";

    ribbons.forEach(text=>{

        let css = "";

        if(text.includes("HOT"))

            css="hot";

        else if(text.includes("NEW"))

            css="new";

        else if(text.includes("RANK"))

            css="rank";

        else if(text.includes("BEST"))

            css="best";

        else if(text.includes("모집"))

            css="recruit";

        else

            css="event";

        html += `

            <div class="ribbon ${css}">

                ${text}

            </div>

        `;

    });

    return html;

}
