// ======================================================
// Guild Site v1.1.0
// JSON 기반
// ======================================================

let guilds = [];

// 페이지가 열리면 실행
document.addEventListener("DOMContentLoaded", () => {

    loadGuilds();

    document
        .getElementById("search")
        .addEventListener("input", searchGuild);

});


// ======================================================
// JSON 불러오기
// ======================================================

async function loadGuilds() {

    try{

        const response = await fetch("data/guilds.json");

        guilds = await response.json();

        renderGuilds(guilds);

    }

    catch(error){

        console.error("guilds.json 로딩 실패");

        console.error(error);

    }

}


// ======================================================
// 카드 출력
// ======================================================

function renderGuilds(data){

    const featured =
        document.getElementById("featuredGuilds");

    const normal =
        document.getElementById("guildContainer");

    featured.innerHTML="";
    normal.innerHTML="";

    data.forEach(guild=>{

        const card=createGuildCard(guild);

        if(guild.featured){

            featured.appendChild(card);

        }else{

            normal.appendChild(card);

        }

    });

}


// ======================================================
// 카드 생성
// ======================================================

function createGuildCard(guild){

    const card=document.createElement("div");

    card.className="guild-card";

    card.innerHTML=`

    <div class="ribbon-container">

        ${createRibbon(guild.ribbons)}

    </div>

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


// ======================================================
// 리본 생성
// ======================================================

function createRibbon(ribbons){

    if(!ribbons) return "";

    let html="";

    ribbons.forEach(text=>{

        let css="";

        if(text.startsWith("HOT")) css="hot";

        else if(text.startsWith("NEW")) css="new";

        else if(text.startsWith("RANK")) css="rank";

        else if(text.startsWith("BEST")) css="best";

        else if(text.startsWith("모집")) css="recruit";

        else css="event";

        html+=`

        <div class="ribbon ${css}">

            ${text}

        </div>

        `;

    });

    return html;

}


// ======================================================
// 검색
// ======================================================

function searchGuild(){

    const keyword=this.value.toLowerCase();

    const result=guilds.filter(guild=>{

        return guild.name.toLowerCase().includes(keyword);

    });

    renderGuilds(result);

}
