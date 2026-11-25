// const, dom, status
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
    draftCompleted: false,
};

function isExpired(task){
    return !task.completed && new Date(task.dueDate) < new Date();
}


// Randering
function renderTasks(){
    const items = elements.mainMemoList.querySelectorAll(".memo-list__item");

    items.forEach((item, index) => {
        const task = state.tasks[index];
        const checkbox = item.querySelector(".memo-list__checkbox");
        const line = item.querySelector(".memo-list__line");

        item.classList.remove("memo-list__item--done", "memo-list__item--expired");

        if (!task){
            checkbox.textContent = "";
            line.textContent = "";
            return;
        }

        line.textContent = `${formatDueShort(task.dueDate)} ${task.title}`;

        if(task.completed) {
            checkbox.textContent = "\u2713";
            item.classList.add("memo-list__item--done");
        } else if (isExpired(task)){
            checkbox.textContent = "";
            item.classList.add("memo-list__item--expired");
        } else{
            checkbox.textContent = "";
        }
    });
}
function renderTargetStatus(){
    const targetBtn = elements.memoTargetBin;
    targetBtn.classList.remove("memo-sheet__target--done", "memo-sheet__target--expired");

    if (state.mode === "CREATE"){
        if (state.draftCompleted){
            targetBtn.classList.add("memo-sheet__target--done");
        }
        return;
    }

    const currentTask = state.tasks.find((t) => t.id === state.selectedId);
    if (!currentTask) return;

    if (currentTask.completed){
        targetBtn.classList.add("memo-sheet__target--done");
    } else if (isExpired(currentTask)){
        targetBtn.classList.add("memo-sheet__target--expired");
    }
}


function render(){
    const isSheetOpen = state.mode !== "CLOSED";
    elements.memoSheet.classList.toggle("is-hidden", !isSheetOpen);
    elements.clearAllBtn.classList.toggle("is-hidden", state.tasks.length === 0);
    renderTasks();

    if (isSheetOpen){
        renderTargetStatus();
    }
}


// drop box setting and due management
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

function formatDate(date){
    const year = elements.dueYear.value;
    const month = String(elements.dueMonth.value).padStart(2,"0");
    const day = String(elements.dueDay.value).padStart(2,"0");
    const hour = String(elements.dueHour.value).padStart(2,"0");
    const minute = String(elements.dueMinute.value).padStart(2,"0");

    return `${year}-${month}-${day}T${hour}:${minute}`;
}

function formatDueShort(dueDate){
    const [date, time] = dueDate.split('T');
    const [year, month, day] = date.split('-');
    return `~${year.slice(2)}/${month}/${day} ${time}`
}

function setDueDate(dueDate){
    const [date, time] = dueDate.split("T");
    const [year, month, day] = date.split('-');
    const [hour, minute] = time.split(':');

    elements.dueYear.value = String(Number(year));
    elements.dueMonth.value = String(Number(month));
    elements.dueDay.value = String(Number(day));
    elements.dueHour.value = String(Number(hour));
    elements.dueMinute.value = String(Number(minute));
}


// data save/load
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


// open/save/edit
function openCreateSheet(){
    if (state.tasks.length >= MAX_Tasks){
        elements.limitNotice.classList.remove("is-hidden");
        return;
    }
    state.mode = "CREATE";
    state.selectedId = null;
    state.draftCompleted = false;

    elements.taskTitle.value = "";
    elements.taskContent.value = "";

    render();
    elements.taskTitle.focus();
}

function openDetailTask(task){
    state.mode = "DETAIL";
    state.selectedId = task.id;

    elements.taskTitle.value = task.title;
    elements.taskContent.value = task.content;
    setDueDate(task.dueDate);

    render();
}

function saveNewTask(){
    const title = elements.taskTitle.value.trim();
    if (!title) return;

    const newTask = {
        id: Date.now(),
        title,
        dueDate: formatDate(),
        content: elements.taskContent.value.trim(),
        completed: state.draftCompleted,
    }

    state.tasks.push(newTask);
    saveTask();
}

function updateTask(){
    const target = state.tasks.find((t) => t.id === state.selectedId);
    if (!target) return;

    const title = elements.taskTitle.value.trim();
    if (title){
        target.title = title;
    }
    target.dueDate = formatDate();
    target.content = elements.taskContent.value.trim();

    saveTask()
}

// event trigger
elements.mainMemoList.addEventListener("click", (e) => {
    const item = e.target.closest(".memo-list__item");
    if (!item) return;

    const index = Number(item.dataset.index);
    const existingTask = state.tasks[index];

    if (e.target.closest(".memo-list__checkbox")){
        if (existingTask){
            existingTask.completed = !existingTask.completed;
            saveTask();
            render();
        }
        return;
    }
    if (existingTask) {
        openDetailTask(existingTask);
    } else {
        openCreateSheet(existingTask);
    }
});

elements.memoPad.addEventListener("click", (e) => {
    if (e.target.closest(".memo-list__item")) return;
    if (e.target.closest("#clearAllBtn")) return;

    if(state.mode !== "CLOSED"){
        if(state.mode === "CREATE"){
            saveNewTask();
        } else if(state.mode === "DETAIL") {
            updateTask();
        }
        state.mode = "CLOSED";
        state.selectedId = null;
        render();
    }
});

elements.memoTargetBin.addEventListener("click", (e) => {
    if (state.mode === "CREATE"){
        state.draftCompleted = !state.draftCompleted;
        renderTargetStatus();
        return;
    }

    const currentTask = state.tasks.find((t) => t.id === state.selectedId);
    if (!currentTask) return;

    currentTask.completed = !currentTask.completed;
    saveTask();
    render();
})

// main
initDataSelects();
render();
