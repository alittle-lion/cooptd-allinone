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

        ${createRibbon(guild)}

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

function createRibbon(guild){

    let html="";

    // HOT
    if(guild.isHot){

        html+=`
        <div class="ribbon hot">
            🔥 HOT
        </div>`;
    }

    // NEW
    if(guild.isNew){

        html+=`
        <div class="ribbon new">
            🆕 NEW
        </div>`;
    }

    // RANK
    if(guild.rank){

        html+=`
        <div class="ribbon rank">
            👑 RANK #${guild.rank}
        </div>`;
    }

    // 모집중
    if(guild.status==="recruit"){

        html+=`
        <div class="ribbon recruit">
            🟢 모집중
        </div>`;
    }

    // 마감
    if(guild.status==="closed"){

        html+=`
        <div class="ribbon closed">
            🔒 모집마감
        </div>`;
    }

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
