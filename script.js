const STORAGE_KEY = "todo_memo_v1";
const MAX_Tasks = 7;

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
    todoContent: document.getElementById('taskContent'),
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
function fillSelect(selectEl, start, end){
    selectEl.innerHTML = "";
    for(let i = start; i <= end; i++){
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
    fillSelect(elements.dueMinute,0, 59);
}

initDataSelects();