let currentDay = 1;
let actionCount = 0;
let isMedicinePhase = false;

const flowerObj = document.getElementById("flower-object");
const windowZone = document.getElementById("window-zone");
const dialogueBox = document.getElementById("dialogue-box");
const dayIndicator = document.getElementById("day-indicator");
const actionPanel = document.getElementById("action-panel");
const avatarImg = document.getElementById("avatar-img");
const avatarSpeech = document.getElementById("avatar-speech");
const nightScreen = document.getElementById("night-screen");
const nightText = document.getElementById("night-text");
const endingScreen = document.getElementById("ending-screen");
const endingText = document.getElementById("ending-text");

function startGame() {
    document.getElementById("start-screen").style.display = "none";
    initDay();
}

function initDay() {
    actionCount = 0;
    isMedicinePhase = false;
    dayIndicator.innerText = `DAY ${currentDay} / 3`;

    if (currentDay === 1) {
        flowerObj.innerText = "🌱";
        setAvatar("🧐", "아직은 씨앗이라 조심스럽군.");
        dialogueBox.innerText = "DAY 1: 씨앗을 심었다. 물을 주고 창가로 드래그해 햇빛을 쬐어주자.";
    } else if (currentDay === 2) {
        flowerObj.innerText = "🌿";
        setAvatar("✨", "오, 싹이 텄어! 제법 그럴듯한데?");
        dialogueBox.innerText = "DAY 2: 싹이 텄다! 관리를 소홀히 하면 안 된다.";
    } else if (currentDay === 3) {
        flowerObj.innerText = "🌸";
        setAvatar("😳", "꽃봉오리야... 조금만 더 힘내자.");
        dialogueBox.innerText = "DAY 3: 마지막 날이다. 독초 함정을 조심하며 탕약을 만들자.";
    }
    renderDefaultControls();
}

function setAvatar(emoji, text) {
    avatarImg.innerText = emoji;
    avatarSpeech.innerText = text;
}

function renderDefaultControls() {
    actionPanel.innerHTML = `
        <button class="game-btn" onclick="doAction('water')">💧 물 주기</button>
        <button class="game-btn" onclick="openMedicineMenu()">🧪 탕약 만들기</button>
    `;
}

// 물 주기 액션
function doAction(type) {
    if (isMedicinePhase) return;
    if (type === 'water') {
        setAvatar("💧", "촉촉하게 물을 주었다.");
        dialogueBox.innerText = "졸졸졸... 물을 주어 흙이 촉촉해졌다.";
        actionCount++;
        checkDayProgress();
    }
}

// 드래그 앤 드롭으로 창가에 갖다 놨을 때 햇빛 주기 처리
let isDragging = false;
let offsetX, offsetY;

flowerObj.addEventListener('mousedown', startDrag);
flowerObj.addEventListener('touchstart', startDrag, {passive: false});

function startDrag(e) {
    if (isMedicinePhase) return;
    isDragging = true;
    let clientX = e.clientX || e.touches[0].clientX;
    let clientY = e.clientY || e.touches[0].clientY;
    let rect = flowerObj.getBoundingClientRect();
    offsetX = clientX - rect.left;
    offsetY = clientY - rect.top;
}

document.addEventListener('mousemove', drag);
document.addEventListener('touchmove', drag, {passive: false});

function drag(e) {
    if (!isDragging) return;
    e.preventDefault();
    let clientX = e.clientX || e.touches[0].clientX;
    let clientY = e.clientY || e.touches[0].clientY;
    
    let containerRect = document.getElementById("room-area").getBoundingClientRect();
    
    flowerObj.style.position = 'absolute';
    flowerObj.style.left = (clientX - containerRect.left - offsetX) + 'px';
    flowerObj.style.top = (clientY - containerRect.top - offsetY) + 'px';
}

document.addEventListener('mouseup', endDrag);
document.addEventListener('touchend', endDrag);

function endDrag(e) {
    if (!isDragging) return;
    isDragging = false;

    // 창가 영역(window-zone)에 들어갔는지 체크
    let flowerRect = flowerObj.getBoundingClientRect();
    let windowRect = windowZone.getBoundingClientRect();

    if (flowerRect.left >= windowRect.left - 20 && flowerRect.right <= windowRect.right + 20) {
        // 햇빛 주기 성공!
        setAvatar("☀️", "따스한 햇빛을 듬뿍 먹는 중!");
        dialogueBox.innerText = "창가에 두어 햇빛을 쬐었다! 광합성 완료 ☀️";
        actionCount++;
        
        // 원위치로 살짝 돌려놓기
        flowerObj.style.left = 'auto';
        flowerObj.style.top = 'auto';
        checkDayProgress();
    } else {
        // 창가가 아니면 제자리로 복귀
        flowerObj.style.left = 'auto';
        flowerObj.style.top = 'auto';
        setAvatar("🤔", "여긴 햇빛이 잘 안 드는데...");
    }
}

// 탕약 미니게임
function openMedicineMenu() {
    isMedicinePhase = true;
    setAvatar("🧪", "비율을 신중하게 맞춰야 해...");
    
    if (currentDay === 1) {
        dialogueBox.innerText = "DAY 1 탕약 제조: [1] 약초 ➡️ [2] 잎";
        actionPanel.innerHTML = `
            <button class="game-btn" onclick="selectMedicine('herb1', 1)">🌿 약초</button>
            <button class="game-btn" onclick="selectMedicine('leaf1', 1)">🍃 잎</button>
        `;
    } else if (currentDay === 2) {
        dialogueBox.innerText = "DAY 2 탕약 제조: [1] 약초 ➡️ [2] 꽃잎";
        actionPanel.innerHTML = `
            <button class="game-btn" onclick="selectMedicine('herb2', 2)">🌿 약초</button>
            <button class="game-btn" onclick="selectMedicine('petal2', 2)">🌸 꽃잎</button>
        `;
    } else if (currentDay === 3) {
        dialogueBox.innerText = "DAY 3 최종 탕약: 엇... 독초가 섞여 있다!";
        actionPanel.innerHTML = `
            <button class="game-btn" onclick="selectMedicine('herb3', 3)">🌿 안전 약초</button>
            <button class="game-btn danger-btn" onclick="selectMedicine('poison3', 3)">☠️ 수상한 독초</button>
        `;
    }
}

let step = 0;
function selectMedicine(choice, day) {
    if (day === 1) {
        if (choice === 'herb1') { step = 1; dialogueBox.innerText = "약초 투입! 다음은 잎."; }
        else if (choice === 'leaf1' && step === 1) { successMedicine(); }
        else { failMedicine("비율 실패! 궁원치: …… (당황)"); }
    } else if (day === 2) {
        if (choice === 'herb2') { step = 1; dialogueBox.innerText = "약초 통과! 다음은 꽃잎."; }
        else if (choice === 'petal2' && step === 1) { successMedicine(); }
        else { failMedicine("실수했다! 궁원치: ……음?"); }
    } else if (day === 3) {
        if (choice === 'poison3') {
            flowerObj.innerText = "💀";
            setAvatar("😱", "……윽! 독초였다니?!");
            dialogueBox.innerText = "☠️ 독초를 넣었다! 꽃이 시들었다... 정신 차리고 다시!";
            setTimeout(() => {
                flowerObj.innerText = "🌸";
                openMedicineMenu();
            }, 2000);
        } else if (choice === 'herb3') {
            successMedicine();
        } else {
            failMedicine("잘못된 선택이다!");
        }
    }
}

function successMedicine() {
    step = 0;
    setAvatar("✨", "탕약 완성! 잘 자라거라.");
    dialogueBox.innerText = "🧪 탕약 완성 및 투입 성공!";
    actionCount++;
    isMedicinePhase = false;
    renderDefaultControls();
    checkDayProgress();
}

function failMedicine(msg) {
    step = 0;
    dialogueBox.innerText = `${msg} 다시 도전하자.`;
    setTimeout(() => openMedicineMenu(), 1500);
}

function checkDayProgress() {
    if (actionCount >= 2) {
        nightText.innerText = `DAY ${currentDay}의 관리를 마쳤습니다. 잠에 듭니다...`;
        nightScreen.style.display = "flex";
    }
}

function nextDay() {
    nightScreen.style.display = "none";
    currentDay++;
    if (currentDay <= 3) {
        initDay();
    } else {
        triggerEnding();
    }
}

function triggerEnding() {
    flowerObj.innerText = "🌺";
    setAvatar("😊", "드디어 피웠구나...");
    endingScreen.style.display = "flex";
    endingText.innerHTML = `
        <strong>궁원치의 비밀 화원 — COMPLETE</strong><br><br>
        3일간 정성껏 키운 꽃이 만개했다!<br>
        궁원치는 미소를 지으며 꽃을 꺾어 들고 형님에게 향한다.
    `;
}

function resetGame() {
    currentDay = 1;
    endingScreen.style.display = "none";
    initDay();
}
