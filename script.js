const STORAGE_KEY = "todo_memo_v1";
const MAX_Tasks = 7;

//data structure
const elements = {
    memoPad: document.querySelector('.memo-pad'),
    mainMemoList: document.getElementById('mainMemoList'),
    limitNotice: document.getElementById('limitNotice'),
    clearAllBtn: document.getElementById('clearAllBtn'),
    memoSheet: document.getElementById('memoSheet'),
    taskTitle: document.getElementById('taskTitle'),
    dueYear: document.getElementById('dueYear'),
    dueMonth: document.getElementById('dueMonth'),
    dueDay: document.getElementById('dueDay'),
    dueHour: document.getElementById('dueHour'),
    dueMinute: document.getElementById('dueMinute'),
    taskContent: document.getElementById('taskContent'),
    memoTargetBin: document.getElementById('memoTargetBtn'),
    deleteItemBtn: document.getElementById('deleteItemBtn'),
};

const state = {
    tasks: loadTasks(),
    mode: "CLOSED",
    selectedId: null,
};

function loadTasks() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch{
        return [];
    }
}

function saveTask() {
    try{
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
    } catch{

    }
}

//drop box setting
function fillSelect(selectEl, start, end, term = 1){
    selectEl.innerHTML = "";
    for(let i = start; i <= end; i+= term){
        const option = document.createElement("option");
        option.value = String(i);
        option.textContent = String(i);
        selectEl.appendChild(option);
    }
}

function initDataSelects(){
    fillSelect(elements.dueYear,2026, 2028);
    fillSelect(elements.dueMonth,1, 12);
    fillSelect(elements.dueDay,1, 31);
    fillSelect(elements.dueHour,0, 23);
    fillSelect(elements.dueMinute,0, 59 , 5);
}

initDataSelects();

function render(){
    const isSheetOpen = state.mode !== "CLOSED";
    elements.memoSheet.classList.toggle("is-hidden", !isSheetOpen);
    elements.clearAllBtn.classList.toggle("is-hidden", state.tasks.length === 0);
}

function openCreateSheet(){
    if (state.tasks.length >= MAX_Tasks){
        elements.limitNotice.classList.remove("is-hidden");
        return;
    }
    state.mode = "CREATE";
    state.selectedId = null;

    elements.taskTitle.value = "";
    elements.taskContent.value = "";

    render();
    elements.taskTitle.focus();
}

elements.mainMemoList.addEventListener("click", (e) => {
    const item = e.target.closest(".memo-list__item");
    if (!item) return;

    const index = Number(item.dataset.index);
    const existingTask = state.tasks[index];

    if (!existingTask) {
        openCreateSheet();
    }
});

elements.memoPad.addEventListener("click", (e) => {
    if(e.target.closest(".memo-list__item")) return;
    if (e.target.closest("#clearAllBtn")) return;

    if(state.mode !== "CLOSED"){
        state.mode = "CLOSED";
        state.selectedId = null;
        render();
    }
})

render();
