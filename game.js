let currentDay = 1;
let actionCount = 0;
let isMedicinePhase = false;

const flowerObj = document.getElementById("flower-object");
const dialogueBox = document.getElementById("dialogue-box");
const dayIndicator = document.getElementById("day-indicator");
const actionPanel = document.getElementById("action-panel");
const characterBubble = document.getElementById("character-bubble");
const characterContainer = document.getElementById("character-avatar-container");
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

    // 화분 위치 원복
    flowerObj.style.left = "20px";
    flowerObj.style.top = "auto";
    flowerObj.style.bottom = "15px";

    if (currentDay === 1) {
        flowerObj.innerText = "🌱";
        setComment("아직은 씨앗이군. 조심스럽게 다루자.");
        dialogueBox.innerText = "DAY 1: 씨앗을 심었다. 물을 주고 창가로 끌어가 햇빛을 쬐어주자.";
    } else if (currentDay === 2) {
        flowerObj.innerText = "🌿";
        setComment("오, 싹이 제법 자랐어!");
        dialogueBox.innerText = "DAY 2: 싹이 텄다! 빼먹지 말고 관리하자.";
    } else if (currentDay === 3) {
        flowerObj.innerText = "🌸";
        setComment("꽃봉오리야... 마지막까지 방심 금물.");
        dialogueBox.innerText = "DAY 3: 마지막 날! 독초 함정을 조심하며 탕약을 만들자.";
    }
    renderDefaultControls();
}

function setComment(text) {
    characterBubble.innerText = text;
}

function renderDefaultControls() {
    actionPanel.innerHTML = `
        <button class="game-btn" onclick="doAction('water')">💧 물 주기</button>
        <button class="game-btn" onclick="openMedicineMenu()">🧪 탕약 만들기</button>
    `;
}

function doAction(type) {
    if (isMedicinePhase) return;
    if (type === 'water') {
        setComment("촉촉하게 물 주기 완료!");
        dialogueBox.innerText = "졸졸졸... 화분에 물을 주어 흙이 촉촉해졌다.";
        actionCount++;
        checkDayProgress();
    }
}

// 📱 스마트폰 터치 & 마우스 드래그 완벽 대응 로직
let isDragging = false;
let startX, startY, initialLeft, initialTop;

flowerObj.addEventListener('pointerdown', startDrag);

function startDrag(e) {
    if (isMedicinePhase) return;
    isDragging = true;
    flowerObj.setPointerCapture(e.pointerId);
    
    let rect = flowerObj.getBoundingClientRect();
    let parentRect = document.getElementById("room-area").getBoundingClientRect();
    
    startX = e.clientX;
    startY = e.clientY;
    initialLeft = rect.left - parentRect.left;
    initialTop = rect.top - parentRect.top;
}

flowerObj.addEventListener('pointermove', drag);
function drag(e) {
    if (!isDragging) return;
    e.preventDefault();
    
    let dx = e.clientX - startX;
    let dy = e.clientY - startY;
    
    flowerObj.style.bottom = "auto";
    flowerObj.style.left = (initialLeft + dx) + 'px';
    flowerObj.style.top = (initialTop + dy) + 'px';
}

flowerObj.addEventListener('pointerup', endDrag);
flowerObj.addEventListener('pointercancel', endDrag);

function endDrag(e) {
    if (!isDragging) return;
    isDragging = false;

    let flowerRect = flowerObj.getBoundingClientRect();
    let roomRect = document.getElementById("room-area").getBoundingClientRect();
    
    // 오른쪽 창가 존 영역에 도달했는지 판정 (오른쪽 35% 구간)
    let windowZoneThreshold = roomRect.right - (roomRect.width * 0.4);

    if (flowerRect.left >= windowZoneThreshold) {
        // 햇빛 주기 성공! 캐릭터가 꽃쪽으로 이동하며 감탄
        setComment("햇빛 듬뿍! 광합성 굿 ☀️");
        dialogueBox.innerText = "창가에 두어 따스한 햇빛을 쬐었다!";
        actionCount++;
        
        // 화분 위치 제자리 복귀
        flowerObj.style.left = "20px";
        flowerObj.style.top = "auto";
        flowerObj.style.bottom = "15px";
        
        // 캐릭터가 잠시 꽃 쪽으로 다가가는 모션 연출
        characterContainer.style.right = "120px";
        setTimeout(() => { characterContainer.style.right = "40px"; }, 1000);

        checkDayProgress();
    } else {
        // 창가가 아니면 제자리로 복귀
        setComment("여긴 그늘인데... 창가로 가져가야 해.");
        flowerObj.style.left = "20px";
        flowerObj.style.top = "auto";
        flowerObj.style.bottom = "15px";
    }
}

// 탕약 미니게임
function openMedicineMenu() {
    isMedicinePhase = true;
    setComment("비율을 조심하자...");
    
    if (currentDay === 1) {
        dialogueBox.innerText = "DAY 1 탕약: [1] 약초 ➡️ [2] 잎";
        actionPanel.innerHTML = `
            <button class="game-btn" onclick="selectMedicine('herb1', 1)">🌿 약초</button>
            <button class="game-btn" onclick="selectMedicine('leaf1', 1)">🍃 잎</button>
        `;
    } else if (currentDay === 2) {
        dialogueBox.innerText = "DAY 2 탕약: [1] 약초 ➡️ [2] 꽃잎";
        actionPanel.innerHTML = `
            <button class="game-btn" onclick="selectMedicine('herb2', 2)">🌿 약초</button>
            <button class="game-btn" onclick="selectMedicine('petal2', 2)">🌸 꽃잎</button>
        `;
    } else if (currentDay === 3) {
        dialogueBox.innerText = "DAY 3 최종 탕약: 독초가 섞여 있다! 조심해!";
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
            setComment("억! 독초였다니보기?! 😱");
            dialogueBox.innerText = "☠️ 독초를 넣었다! 꽃이 잠시 시들었다... 정신 차리자!";
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
    setComment("완벽해! 잘 자라는군.");
    dialogueBox.innerText = "🧪 탕약 완성 및 투입 성공!";
    actionCount++;
    isMedicinePhase = false;
    renderDefaultControls();
    checkDayProgress();
}

function failMedicine(msg) {
    step = 0;
    setComment("어라...? 실패다.");
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
    setComment("드디어 형님께 드릴 꽃이 피었다... 😊");
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
