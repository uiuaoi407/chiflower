let currentDay = 1;
let actionCount = 0; // 오늘 해야 할 관리 횟수 체크
let isMedicinePhase = false;

const flowerDisplay = document.getElementById("flower-display");
const dialogueBox = document.getElementById("dialogue-box");
const dayIndicator = document.getElementById("day-indicator");
const actionPanel = document.getElementById("action-panel");
const nightScreen = document.getElementById("night-screen");
const nightText = document.getElementById("night-text");
const endingScreen = document.getElementById("ending-screen");
const endingText = document.getElementById("ending-text");

// 게임 시작
function startGame() {
    document.getElementById("start-screen").style.display = "none";
    initDay();
}

function initDay() {
    actionCount = 0;
    isMedicinePhase = false;
    dayIndicator.innerText = `DAY ${currentDay} / 3`;

    if (currentDay === 1) {
        flowerDisplay.innerText = "🌱";
        dialogueBox.innerText = "DAY 1: 이름 모를 씨앗을 심었다. 물과 햇빛을 주고 정성껏 탕약을 만들어 먹이자.";
    } else if (currentDay === 2) {
        flowerDisplay.innerText = "🌿";
        dialogueBox.innerText = "DAY 2: 싹이 텄다! 조금 자라났다. 재료가 조금 더 까다로워진다... 실수하면 안 된다.";
    } else if (currentDay === 3) {
        flowerDisplay.innerText = "🌸";
        dialogueBox.innerText = "DAY 3: 꽃봉오리가 맺혔다! 마지막 탕약만 성공하면 만개한다. 독초를 조심하자.";
    }

    renderDefaultControls();
}

// 기본 버튼 패널 렌더링
function renderDefaultControls() {
    actionPanel.innerHTML = `
        <button class="game-btn" onclick="doAction('water')">💧 물 주기</button>
        <button class="game-btn" onclick="doAction('sun')">☀️ 햇빛 주기</button>
        <button class="game-btn" onclick="openMedicineMenu()">🧪 탕약 만들기</button>
    `;
}

// 물이나 햇빛 주기 액션
function doAction(type) {
    if (isMedicinePhase) return;

    if (type === 'water') {
        dialogueBox.innerText = currentDay === 1 ? "졸졸졸... 물을 주었다. 씨앗이 촉촉해진다." : "시원하게 물을 뿌려주었다. 잎이 싱그러워진다.";
    } else if (type === 'sun') {
        dialogueBox.innerText = "따스한 햇빛을 쬐어주었다. 광합성 뿜뿜!";
    }

    actionCount++;
    checkDayProgress();
}

// 탕약 만들기 메뉴 열기 (미니게임 시작)
function openMedicineMenu() {
    isMedicinePhase = true;
    
    if (currentDay === 1) {
        dialogueBox.innerText = "DAY 1 탕약 제조: 순서대로 골라보자.\n[1] 약초 ➡️ [2] 잎";
        actionPanel.innerHTML = `
            <button class="game-btn" onclick="selectMedicine('herb1', 1)">🌿 약초</button>
            <button class="game-btn" onclick="selectMedicine('leaf1', 1)">🍃 잎</button>
            <button class="game-btn danger-btn" onclick="selectMedicine('poison1', 1)">☠️ 독초(?)</button>
        `;
    } else if (currentDay === 2) {
        dialogueBox.innerText = "DAY 2 탕약 제조: 재료가 늘었다!\n[1] 약초 ➡️ [2] 잎 ➡️ [3] 꽃잎";
        actionPanel.innerHTML = `
            <button class="game-btn" onclick="selectMedicine('herb2', 2)">🌿 약초</button>
            <button class="game-btn" onclick="selectMedicine('petal2', 2)">🌸 꽃잎</button>
            <button class="game-btn danger-btn" onclick="selectMedicine('poison2', 2)">☠️ 독초</button>
        `;
    } else if (currentDay === 3) {
        dialogueBox.innerText = "DAY 3 최종 탕약: 엇... 독초가 섞여 있다! 무엇을 넣어야 안전하지?!";
        actionPanel.innerHTML = `
            <button class="game-btn" onclick="selectMedicine('herb3', 3)">🌿 안전 약초</button>
            <button class="game-btn danger-btn" onclick="selectMedicine('poison3', 3)">☠️ 수상한 독초</button>
            <button class="game-btn" onclick="selectMedicine('petal3', 3)">🌸 꽃잎</button>
        `;
    }
}

// 탕약 재료 선택 로직 (함정 포함)
let step = 0;
function selectMedicine(choice, day) {
    if (day === 1) {
        if (choice === 'herb1') { step = 1; dialogueBox.innerText = "약초 투입 완료! 다음은 잎을 넣자."; }
        else if (choice === 'leaf1' && step === 1) {
            successMedicine();
        } else {
            failMedicine("비율을 잘못 맞췄다... 궁원치: „ „ „ (당황)");
        }
    } else if (day === 2) {
        if (choice === 'herb2') { step = 1; dialogueBox.innerText = "1단계 약초 통과! 다음은 꽃잎."; }
        else if (choice === 'petal2' && step === 1) { successMedicine(); }
        else { failMedicine("엉뚱한 재료를 넣었다! 궁원치: ……음?"); }
    } else if (day === 3) {
        // DAY 3 함정 발동 지점 ㅋㅋ
        if (choice === 'poison3') {
            flowerDisplay.innerText = "💀";
            dialogueBox.innerText = "☠️ 독초를 넣었습니다!\n궁원치: …… (꽃이 시들며 동공 지진 발생)";
            setTimeout(() => {
                dialogueBox.innerText = "아차차, 실수다! 정신을 차리고 탕약을 다시 만든다.";
                openMedicineMenu(); // 게임오버 안 시키고 다시 기회 줌!
            }, 2500);
        } else if (choice === 'herb3') {
            successMedicine();
        } else {
            failMedicine("잘못된 조합이다! 궁원치: ……레시피가 잘못됐나?");
        }
    }
}

function successMedicine() {
    step = 0;
    dialogueBox.innerText = "🧪 탕약 완성! 꽃에게 먹였다. 무럭무럭 자라나는 중!";
    actionCount++;
    isMedicinePhase = false;
    renderDefaultControls();
    checkDayProgress();
}

function failMedicine(msg) {
    step = 0;
    dialogueBox.innerText = `${msg} 다시 시도하자.`;
    setTimeout(() => openMedicineMenu(), 1500);
}

// 하루 할 일을 다 채웠는지 확인
function checkDayProgress() {
    if (actionCount >= 2) { // 물/햇빛 혹은 탕약 등 2가지 이상 행동 완료 시 밤으로 넘어갈 준비
        nightText.innerText = `DAY ${currentDay}의 일과를 무사히 마쳤습니다. 잠에 듭니다...`;
        nightScreen.style.display = "flex";
    }
}

// 다음 날로 넘어가기
function nextDay() {
    nightScreen.style.display = "none";
    currentDay++;

    if (currentDay <= 3) {
        initDay();
    } else {
        triggerEnding();
    }
}

// 감동의 엔딩 연출
function triggerEnding() {
    flowerDisplay.innerText = "🌺";
    endingScreen.style.display = "flex";
    endingText.innerHTML = `
        <strong>궁원치의 비밀 화원 — COMPLETE</strong><br><br>
        3일간의 정성 끝에 마침내 화려한 꽃이 만개했다!<br>
        궁원치는 가만히 꽃을 바라보다 살짝 미소 짓는다.<br>
        이윽고 꽃을 정성껏 꺾어 들고 형님(운지우)에게 건네러 발걸음을 옮긴다.
    `;
}

// 게임 리셋
function resetGame() {
    currentDay = 1;
    endingScreen.style.display = "none";
    initDay();
}