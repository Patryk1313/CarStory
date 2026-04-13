const appData = {
    car: {
        name: "SEAT IBIZA",
        year: "2007",
        engine: "1.9 TDI",
    },
    statuses: [
        {
            kind: "oil",
            theme: "blue",
            label: "OLEJ SILNIKOWY",
            mileage: "208,223",
            unit: "k",
            nextMileage: "245k",
            progress: 78,
        },
        {
            kind: "timing",
            theme: "orange",
            label: "PASEK ROZRZĄDU",
            mileage: "208,223",
            unit: "k",
            nextMileage: "500k",
            progress: 36,
        },
    ],
    history: [
        {
            id: "history-oil-service-2023-10-12",
            date: "2023-10-12",
            mileage: 198500,
            title: "Pełny serwis i wymiana oleju",
            description:
                "Wymiana oleju silnikowego, filtra oleju, filtra kabinowego. Sprawdzenie klocków hamulcowych i płynów.",
            cost: 1350,
            createdAt: Date.parse("2023-10-12T12:00:00"),
        },
        {
            id: "history-brake-pads-2023-08-05",
            date: "2023-08-05",
            mileage: 192200,
            title: "Wymiana klocków hamulcowych",
            description: "",
            cost: 740,
            createdAt: Date.parse("2023-08-05T12:00:00"),
        },
        {
            id: "history-timing-belt-2023-01-22",
            date: "2023-01-22",
            mileage: 165000,
            title: "Pasek rozrządu i pompa wody",
            description:
                "Duży serwis. Wymiana zestawu paska rozrządu, pompy wody i pasków osprzętu.",
            cost: 3400,
            createdAt: Date.parse("2023-01-22T12:00:00"),
        },
    ],
    todos: [
        {
            id: "todo-cabin-filter",
            text: "Wymienić filtr kabinowy",
        },
        {
            id: "todo-coolant",
            text: "Sprawdzić poziom płynu chłodniczego",
        },
        {
            id: "todo-tires",
            text: "Skontrolować ciśnienie i stan opon",
        },
    ],
};

const TODO_STORAGE_KEY = "car-info-todos";
const HISTORY_STORAGE_KEY = "car-info-history";
const HISTORY_FIREBASE_SEEDED_KEY = "car-info-history-seeded-v1";
const FIREBASE_CAR_DOC_ID = "seat-ibiza-2007-1-9-tdi";
const POLISH_MONTHS = [
    "Sty",
    "Lut",
    "Mar",
    "Kwi",
    "Maj",
    "Cze",
    "Lip",
    "Sie",
    "Wrz",
    "Paź",
    "Lis",
    "Gru",
];

const carName = document.getElementById("car-name");
const carYear = document.getElementById("car-year");
const carEngine = document.getElementById("car-engine");
const dashboardView = document.getElementById("dashboard-view");
const historyView = document.getElementById("history-view");
const statusGrid = document.getElementById("status-grid");
const historyTitle = document.getElementById("history-title");
const historyPageHeading = document.getElementById("history-page-heading");
const openHistoryViewButton = document.getElementById("open-history-view-button");
const timeline = document.getElementById("timeline");
const historyPageList = document.getElementById("history-page-list");
const historyPageEmpty = document.getElementById("history-page-empty");
const historyCount = document.getElementById("history-count");
const toast = document.getElementById("toast");
const navDashboard = document.getElementById("nav-dashboard");
const navHistory = document.getElementById("nav-history");
const openEntrySheetButton = document.getElementById("open-entry-sheet-button");
const openEntrySheetHistoryButton = document.getElementById(
    "open-entry-sheet-history-button",
);
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const todoCount = document.getElementById("todo-count");
const todoEmpty = document.getElementById("todo-empty");
const entrySheet = document.getElementById("entry-sheet");
const entrySheetTitle = document.getElementById("entry-sheet-title");
const entrySheetSubtitle = document.getElementById("entry-sheet-subtitle");
const closeEntrySheetButton = document.getElementById(
    "close-entry-sheet-button",
);
const serviceEntryForm = document.getElementById("service-entry-form");
const serviceFormSubmitButton = document.getElementById(
    "service-form-submit-button",
);
const entryDateInput = document.getElementById("entry-date");
const entryMileageInput = document.getElementById("entry-mileage");
const entryTitleInput = document.getElementById("entry-title");
const entryDescriptionInput = document.getElementById("entry-description");
const entryCostInput = document.getElementById("entry-cost");

let toastTimeoutId = 0;
let currentView = "dashboard";
let editingHistoryEntryId = null;
let hasShownHistorySyncError = false;
let historyUnsubscribe = null;
let todos = loadTodos();
let historyEntries = loadHistoryCache();

function renderHeader() {
    carName.textContent = appData.car.name;
    carYear.textContent = appData.car.year;
    carEngine.textContent = appData.car.engine;
    document.title = `${appData.car.name} - Car Info`;
}

function renderStatuses() {
    statusGrid.innerHTML = appData.statuses
        .map(
            (item) => `
        <article class="status-card status-card--${item.theme}">
            <div class="status-card__top">
                <span class="status-card__icon" aria-hidden="true">${getStatusIcon(item.kind)}</span>
                <p class="status-card__label">${item.label}</p>
            </div>
            <div class="status-card__value">
                <span class="status-card__value-number">${item.mileage}</span>
                <span class="status-card__value-unit">${item.unit}</span>
            </div>
            <div class="status-card__next">
                <span class="status-card__next-label">Następny<br>przy</span>
                <span class="status-card__next-badge">${item.nextMileage}</span>
            </div>
            <div class="status-card__progress" aria-hidden="true">
                <div class="status-card__progress-bar" style="width: ${item.progress}%"></div>
            </div>
        </article>
    `,
        )
        .join("");
}

function renderTimeline() {
    const previewEntries = historyEntries.slice(0, 3);

    if (!previewEntries.length) {
        timeline.innerHTML = `
            <li class="timeline-item">
                <p class="timeline-item__description">Brak wpisów w historii serwisowej.</p>
            </li>
        `;
        return;
    }

    timeline.innerHTML = previewEntries
        .map(
            (entry) => `
        <li class="timeline-item">
            <div class="timeline-item__top">
                <h3 class="timeline-item__title">${escapeHtml(entry.title)}</h3>
                <span class="price-badge">${formatCost(entry.cost)}<br>zł</span>
            </div>
            <p class="timeline-item__meta">${escapeHtml(formatHistoryMeta(entry))}</p>
            ${entry.description ? `<p class="timeline-item__description">${escapeHtml(entry.description)}</p>` : ""}
        </li>
    `,
        )
        .join("");
}

function renderHistoryPage() {
    historyCount.textContent = getCountLabel(historyEntries.length, [
        "wpis",
        "wpisy",
        "wpisów",
    ]);
    historyPageEmpty.hidden = historyEntries.length !== 0;
    historyPageList.hidden = historyEntries.length === 0;

    historyPageList.innerHTML = historyEntries
        .map(
            (entry) => `
        <li>
            <article class="history-entry-card">
                <div class="history-entry-card__top">
                    <div class="history-entry-card__main">
                        <p class="history-entry-card__meta">${escapeHtml(formatHistoryMeta(entry))}</p>
                        <h3 class="history-entry-card__title">${escapeHtml(entry.title)}</h3>
                    </div>
                    <span class="price-badge">${formatCost(entry.cost)}<br>zł</span>
                </div>
                ${entry.description ? `<p class="history-entry-card__description">${escapeHtml(entry.description)}</p>` : ""}
                <div class="history-entry-card__actions">
                    <button class="history-action history-action--edit" type="button" data-history-action="edit" data-history-id="${entry.id}">Edytuj</button>
                    <button class="history-action history-action--delete" type="button" data-history-action="delete" data-history-id="${entry.id}">Usuń</button>
                </div>
            </article>
        </li>
    `,
        )
        .join("");
}

function renderTodos() {
    if (!todoCount || !todoEmpty || !todoList) {
        return;
    }

    const openCount = todos.filter((item) => !item.completed).length;

    todoCount.textContent = getTodoSummary(openCount, todos.length);
    todoEmpty.hidden = todos.length !== 0;

    todoList.innerHTML = todos
        .map(
            (item) => `
        <li class="todo-item${item.completed ? " todo-item--done" : ""}" data-id="${item.id}">
            <label class="todo-toggle" aria-label="Oznacz zadanie jako wykonane">
                <input class="todo-checkbox" type="checkbox" ${item.completed ? "checked" : ""}>
                <span class="todo-toggle-ui" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                        <path d="M5 12.5 9.5 17 19 7.5" />
                    </svg>
                </span>
            </label>
            <p class="todo-text">${escapeHtml(item.text)}</p>
            <button class="todo-delete" type="button" aria-label="Usuń zadanie">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 6 18 18" />
                    <path d="m18 6-12 12" />
                </svg>
            </button>
        </li>
    `,
        )
        .join("");
}

function showToast(message) {
    window.clearTimeout(toastTimeoutId);
    toast.textContent = message;
    toast.classList.add("toast--visible");

    toastTimeoutId = window.setTimeout(() => {
        toast.classList.remove("toast--visible");
    }, 2600);
}

function setupPlaceholderActions() {
    document.querySelectorAll("[data-placeholder]").forEach((button) => {
        button.addEventListener("click", () => {
            showToast(
                button.dataset.placeholder || "Ta sekcja jest w przygotowaniu",
            );
        });
    });
}

function setupNavigation() {
    navDashboard.addEventListener("click", () => {
        setActiveView("dashboard");
    });

    navHistory.addEventListener("click", () => {
        setActiveView("history");
    });

    openHistoryViewButton.addEventListener("click", () => {
        setActiveView("history");
    });
}

function setActiveView(viewName) {
    currentView = viewName;

    dashboardView.hidden = viewName !== "dashboard";
    historyView.hidden = viewName !== "history";

    navDashboard.classList.toggle("nav-item--active", viewName === "dashboard");
    navHistory.classList.toggle("nav-item--active", viewName === "history");

    navDashboard.toggleAttribute("aria-current", viewName === "dashboard");
    navHistory.toggleAttribute("aria-current", viewName === "history");

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function setupTodoActions() {
    if (!todoForm || !todoInput || !todoList) {
        return;
    }

    todoForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const value = normalizeText(todoInput.value, 80);

        if (!value) {
            showToast("Wpisz zadanie do listy.");
            todoInput.focus();
            return;
        }

        todos = [
            {
                id: createTodoId(),
                text: value,
                completed: false,
            },
            ...todos,
        ];

        saveTodos();
        renderTodos();
        todoForm.reset();
        todoInput.focus();
        showToast("Dodano nowe zadanie.");
    });

    todoList.addEventListener("change", (event) => {
        if (!event.target.classList.contains("todo-checkbox")) {
            return;
        }

        const item = event.target.closest(".todo-item");

        if (!item) {
            return;
        }

        todos = todos.map((entry) =>
            entry.id === item.dataset.id
                ? { ...entry, completed: event.target.checked }
                : entry,
        );

        saveTodos();
        renderTodos();
    });

    todoList.addEventListener("click", (event) => {
        const deleteButton = event.target.closest(".todo-delete");

        if (!deleteButton) {
            return;
        }

        const item = deleteButton.closest(".todo-item");

        if (!item) {
            return;
        }

        todos = todos.filter((entry) => entry.id !== item.dataset.id);
        saveTodos();
        renderTodos();
        showToast("Usunięto zadanie.");
    });
}

function setupHistoryActions() {
    historyPageList.addEventListener("click", async (event) => {
        const actionButton = event.target.closest("[data-history-action]");

        if (!actionButton) {
            return;
        }

        const entry = historyEntries.find(
            (item) => item.id === actionButton.dataset.historyId,
        );

        if (!entry) {
            return;
        }

        if (actionButton.dataset.historyAction === "edit") {
            openEntrySheet(entry);
            return;
        }

        if (!window.confirm(`Usunąć wpis "${entry.title}" z historii?`)) {
            return;
        }

        actionButton.disabled = true;
        const savedTo = await deleteHistoryEntry(entry.id);
        renderTimeline();
        renderHistoryPage();

        if (savedTo === "firebase") {
            showToast("Usunięto wpis z historii serwisowej.");
        } else {
            showToast("Usunięto wpis lokalnie. Firebase nie odpowiedział.");
        }
    });
}

function setupServiceEntryActions() {
    [openEntrySheetButton, openEntrySheetHistoryButton].forEach((button) => {
        button.addEventListener("click", () => {
            openEntrySheet();
        });
    });

    closeEntrySheetButton.addEventListener("click", () => {
        closeEntrySheet({ reset: true });
    });

    document.querySelectorAll("[data-close-entry-sheet]").forEach((button) => {
        button.addEventListener("click", () => {
            closeEntrySheet({ reset: true });
        });
    });

    serviceEntryForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!serviceEntryForm.reportValidity()) {
            return;
        }

        const title = normalizeText(entryTitleInput.value, 80);
        const description = normalizeText(entryDescriptionInput.value, 280);
        const mileage = Number(entryMileageInput.value);
        const cost = roundCurrency(Number(entryCostInput.value));
        const date = normalizeIsoDate(entryDateInput.value);
        const existingEntry = historyEntries.find(
            (entry) => entry.id === editingHistoryEntryId,
        );

        if (!date) {
            showToast("Podaj prawidłową datę.");
            entryDateInput.focus();
            return;
        }

        if (!title) {
            showToast("Wpisz tytuł serwisu.");
            entryTitleInput.focus();
            return;
        }

        if (!description) {
            showToast("Dodaj opis wykonanych prac.");
            entryDescriptionInput.focus();
            return;
        }

        if (!Number.isFinite(mileage) || mileage < 0) {
            showToast("Podaj prawidłowy stan licznika.");
            entryMileageInput.focus();
            return;
        }

        if (!Number.isFinite(cost) || cost < 0) {
            showToast("Podaj prawidłowy koszt.");
            entryCostInput.focus();
            return;
        }

        const entry = {
            id: editingHistoryEntryId || createHistoryEntryId(),
            date,
            mileage: Math.round(mileage),
            title,
            description,
            cost,
            createdAt: existingEntry?.createdAt || Date.now(),
            updatedAt: Date.now(),
        };

        setServiceFormBusy(true);
        const savedTo = await saveHistoryEntry(entry);
        setServiceFormBusy(false);
        renderTimeline();
        renderHistoryPage();
        closeEntrySheet({ reset: true });
        focusCurrentHistoryArea();

        if (savedTo === "firebase") {
            showToast(
                existingEntry
                    ? "Zapisano zmiany w historii serwisowej."
                    : "Dodano wpis do historii serwisowej.",
            );
        } else {
            showToast(
                existingEntry
                    ? "Zapisano zmiany lokalnie. Firebase nie odpowiedział."
                    : "Dodano wpis lokalnie. Firebase nie odpowiedział.",
            );
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !entrySheet.hidden) {
            closeEntrySheet({ reset: true });
        }
    });
}

function openEntrySheet(entry = null) {
    editingHistoryEntryId = entry ? entry.id : null;
    syncEntrySheetCopy();

    if (entry) {
        entryDateInput.value = entry.date;
        entryMileageInput.value = String(entry.mileage);
        entryTitleInput.value = entry.title;
        entryDescriptionInput.value = entry.description;
        entryCostInput.value = String(entry.cost);
    } else {
        resetServiceEntryFormFields();
    }

    entrySheet.hidden = false;
    document.body.classList.add("sheet-open");

    window.requestAnimationFrame(() => {
        entryTitleInput.focus();
    });
}

function closeEntrySheet({ reset = false } = {}) {
    entrySheet.hidden = true;
    document.body.classList.remove("sheet-open");

    if (reset) {
        editingHistoryEntryId = null;
        resetServiceEntryFormFields();
        syncEntrySheetCopy();
        setServiceFormBusy(false);
    }
}

function resetServiceEntryFormFields() {
    serviceEntryForm.reset();
    entryDateInput.value = getTodayIsoDate();
}

function syncEntrySheetCopy() {
    const isEditing = Boolean(editingHistoryEntryId);

    entrySheetTitle.textContent = isEditing
        ? "Edytuj wpis serwisowy"
        : "Dodaj wpis serwisowy";
    entrySheetSubtitle.textContent = isEditing
        ? "Zmień dane wpisu i zapisz poprawki w historii serwisowej auta."
        : "Wpis zostanie dodany do historii serwisowej auta.";
    serviceFormSubmitButton.textContent = isEditing
        ? "Zapisz zmiany"
        : "Zapisz wpis";
}

function setServiceFormBusy(isBusy) {
    serviceFormSubmitButton.disabled = isBusy;
    serviceFormSubmitButton.textContent = isBusy
        ? "Zapisywanie..."
        : editingHistoryEntryId
          ? "Zapisz zmiany"
          : "Zapisz wpis";
}

function focusCurrentHistoryArea() {
    const target = currentView === "history" ? historyPageHeading : historyTitle;

    target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function loadHistoryCache() {
    const fallbackHistory = appData.history
        .map((entry) => normalizeHistoryEntry(entry))
        .filter(Boolean);

    try {
        const storedHistory = window.localStorage.getItem(HISTORY_STORAGE_KEY);

        if (!storedHistory) {
            return sortHistoryEntries(fallbackHistory);
        }

        const parsedHistory = JSON.parse(storedHistory);

        if (!Array.isArray(parsedHistory)) {
            return sortHistoryEntries(fallbackHistory);
        }

        const normalizedHistory = parsedHistory
            .map((entry) => normalizeHistoryEntry(entry))
            .filter(Boolean);

        return normalizedHistory.length
            ? sortHistoryEntries(normalizedHistory)
            : sortHistoryEntries(fallbackHistory);
    } catch (error) {
        console.error("Unable to load service history cache.", error);
        return sortHistoryEntries(fallbackHistory);
    }
}

function saveHistoryCache() {
    try {
        window.localStorage.setItem(
            HISTORY_STORAGE_KEY,
            JSON.stringify(historyEntries),
        );
    } catch (error) {
        console.error("Unable to save service history cache.", error);
    }
}

function getHistoryCollection() {
    const firebaseState = window.carInfoFirebase;

    if (!firebaseState || !firebaseState.db) {
        return null;
    }

    return firebaseState.db
        .collection("cars")
        .doc(FIREBASE_CAR_DOC_ID)
        .collection("serviceHistory");
}

function syncHistoryWithFirebase() {
    const historyCollection = getHistoryCollection();

    if (!historyCollection) {
        return;
    }

    historyUnsubscribe = historyCollection.onSnapshot(
        async (snapshot) => {
            if (snapshot.empty) {
                const alreadySeeded =
                    window.localStorage.getItem(HISTORY_FIREBASE_SEEDED_KEY) ===
                    "1";

                if (!alreadySeeded && historyEntries.length) {
                    const seeded = await seedHistoryInFirebase(
                        historyCollection,
                        historyEntries,
                    );

                    if (seeded) {
                        window.localStorage.setItem(
                            HISTORY_FIREBASE_SEEDED_KEY,
                            "1",
                        );
                    }

                    return;
                }

                historyEntries = [];
                saveHistoryCache();
                renderTimeline();
                renderHistoryPage();
                return;
            }

            window.localStorage.setItem(HISTORY_FIREBASE_SEEDED_KEY, "1");

            const remoteEntries = snapshot.docs
                .map((documentSnapshot) =>
                    normalizeHistoryEntry({
                        id: documentSnapshot.id,
                        ...documentSnapshot.data(),
                    }),
                )
                .filter(Boolean);

            historyEntries = sortHistoryEntries(remoteEntries);
            saveHistoryCache();
            renderTimeline();
            renderHistoryPage();
        },
        (error) => {
            console.error("Unable to sync service history from Firebase.", error);

            if (!hasShownHistorySyncError) {
                showToast("Firebase niedostępny. Historia działa lokalnie.");
                hasShownHistorySyncError = true;
            }
        },
    );
}

async function seedHistoryInFirebase(historyCollection, entries) {
    try {
        const firebaseState = window.carInfoFirebase;
        const batch = firebaseState.db.batch();

        entries.forEach((entry) => {
            batch.set(historyCollection.doc(entry.id), serializeHistoryEntry(entry));
        });

        await batch.commit();
        return true;
    } catch (error) {
        console.error("Unable to seed service history in Firebase.", error);
        return false;
    }
}

async function saveHistoryEntry(entry) {
    const normalizedEntry = normalizeHistoryEntry(entry);
    const historyCollection = getHistoryCollection();

    if (!normalizedEntry) {
        return "local";
    }

    if (historyCollection) {
        try {
            await historyCollection
                .doc(normalizedEntry.id)
                .set(serializeHistoryEntry(normalizedEntry));
            window.localStorage.setItem(HISTORY_FIREBASE_SEEDED_KEY, "1");
            mergeHistoryEntry(normalizedEntry);
            saveHistoryCache();
            return "firebase";
        } catch (error) {
            console.error("Unable to save service history entry to Firebase.", error);
        }
    }

    mergeHistoryEntry(normalizedEntry);
    saveHistoryCache();
    return "local";
}

async function deleteHistoryEntry(entryId) {
    const historyCollection = getHistoryCollection();

    if (historyCollection) {
        try {
            await historyCollection.doc(entryId).delete();
            removeHistoryEntry(entryId);
            saveHistoryCache();
            return "firebase";
        } catch (error) {
            console.error(
                "Unable to delete service history entry from Firebase.",
                error,
            );
        }
    }

    removeHistoryEntry(entryId);
    saveHistoryCache();
    return "local";
}

function mergeHistoryEntry(entry) {
    historyEntries = sortHistoryEntries([
        entry,
        ...historyEntries.filter((item) => item.id !== entry.id),
    ]);
}

function removeHistoryEntry(entryId) {
    historyEntries = historyEntries.filter((entry) => entry.id !== entryId);
}

function serializeHistoryEntry(entry) {
    return {
        date: entry.date,
        mileage: entry.mileage,
        title: entry.title,
        description: entry.description,
        cost: entry.cost,
        createdAt: entry.createdAt || Date.now(),
        updatedAt: entry.updatedAt || Date.now(),
    };
}

function normalizeHistoryEntry(entry) {
    if (!entry || typeof entry !== "object") {
        return null;
    }

    const date = normalizeIsoDate(entry.date);
    const title = normalizeText(entry.title, 80);
    const description = normalizeText(entry.description, 280);
    const mileage = Number(entry.mileage);
    const cost = roundCurrency(Number(entry.cost));
    const createdAt = Number(entry.createdAt);
    const updatedAt = Number(entry.updatedAt);

    if (
        !date ||
        !title ||
        !Number.isFinite(mileage) ||
        mileage < 0 ||
        !Number.isFinite(cost) ||
        cost < 0
    ) {
        return null;
    }

    return {
        id:
            typeof entry.id === "string" && entry.id
                ? entry.id
                : createHistoryEntryId(),
        date,
        mileage: Math.round(mileage),
        title,
        description,
        cost,
        createdAt: Number.isFinite(createdAt)
            ? createdAt
            : Date.parse(`${date}T12:00:00`),
        updatedAt: Number.isFinite(updatedAt)
            ? updatedAt
            : Number.isFinite(createdAt)
              ? createdAt
              : Date.parse(`${date}T12:00:00`),
    };
}

function sortHistoryEntries(entries) {
    return [...entries].sort((leftEntry, rightEntry) => {
        const leftDate = Date.parse(`${leftEntry.date}T00:00:00`);
        const rightDate = Date.parse(`${rightEntry.date}T00:00:00`);

        if (rightDate !== leftDate) {
            return rightDate - leftDate;
        }

        return (rightEntry.createdAt || 0) - (leftEntry.createdAt || 0);
    });
}

function loadTodos() {
    try {
        const storedTodos = window.localStorage.getItem(TODO_STORAGE_KEY);

        if (!storedTodos) {
            return appData.todos.map((item) => ({ ...item, completed: false }));
        }

        const parsedTodos = JSON.parse(storedTodos);

        if (!Array.isArray(parsedTodos)) {
            return appData.todos.map((item) => ({ ...item, completed: false }));
        }

        return parsedTodos
            .filter(
                (item) =>
                    item &&
                    typeof item.id === "string" &&
                    typeof item.text === "string",
            )
            .map((item) => ({
                id: item.id,
                text: normalizeText(item.text, 80),
                completed: Boolean(item.completed),
            }))
            .filter((item) => item.text.length > 0);
    } catch (error) {
        console.error("Unable to load todo list.", error);
        return appData.todos.map((item) => ({ ...item, completed: false }));
    }
}

function saveTodos() {
    try {
        window.localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
        console.error("Unable to save todo list.", error);
    }
}

function createTodoId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
        return window.crypto.randomUUID();
    }

    return `todo-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createHistoryEntryId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
        return window.crypto.randomUUID();
    }

    return `history-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getTodoSummary(openCount, totalCount) {
    if (totalCount === 0) {
        return "0 zadań";
    }

    if (openCount === 0) {
        return "Gotowe";
    }

    if (openCount === 1) {
        return "1 otwarte";
    }

    return `${openCount} otwarte`;
}

function getCountLabel(count, labels) {
    if (count === 1) {
        return `1 ${labels[0]}`;
    }

    const lastTwoDigits = count % 100;
    const lastDigit = count % 10;

    if (lastDigit >= 2 && lastDigit <= 4 && !(lastTwoDigits >= 12 && lastTwoDigits <= 14)) {
        return `${count} ${labels[1]}`;
    }

    return `${count} ${labels[2]}`;
}

function normalizeText(value, maxLength) {
    if (typeof value !== "string") {
        return "";
    }

    return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function normalizeIsoDate(value) {
    return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
        ? value
        : "";
}

function formatHistoryMeta(entry) {
    return `${formatShortDate(entry.date)} • ${formatMileage(entry.mileage)} km`;
}

function formatShortDate(value) {
    const [year, month, day] = value.split("-").map(Number);

    return `${String(day).padStart(2, "0")} ${POLISH_MONTHS[month - 1]} ${year}`;
}

function formatMileage(value) {
    return new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 0,
    }).format(Math.round(value));
}

function formatCost(value) {
    return Number.isInteger(value)
        ? String(value)
        : value.toFixed(2).replace(".", ",");
}

function roundCurrency(value) {
    return Math.round(value * 100) / 100;
}

function getTodayIsoDate() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${now.getFullYear()}-${month}-${day}`;
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function getStatusIcon(kind) {
    if (kind === "oil") {
        return `
            <svg viewBox="0 0 24 24">
                <path d="M4.5 13.5h12.75a2.25 2.25 0 0 0 0-4.5H13V7.25A2.25 2.25 0 0 0 10.75 5H8.5" />
                <path d="M5 9h2.5" />
                <path d="M7 13.5v2.25A1.25 1.25 0 0 0 8.25 17h5.5A1.25 1.25 0 0 0 15 15.75V13.5" />
                <path d="M18 9.75c.83.9 1.5 1.88 1.5 2.78a1.5 1.5 0 1 1-3 0c0-.9.67-1.88 1.5-2.78Z" />
            </svg>
        `;
    }

    return `
        <svg viewBox="0 0 24 24">
            <path d="M12 4v3" />
            <path d="M12 17v3" />
            <path d="M4 12h3" />
            <path d="M17 12h3" />
            <path d="m6.35 6.35 2.1 2.1" />
            <path d="m15.55 15.55 2.1 2.1" />
            <path d="m17.65 6.35-2.1 2.1" />
            <path d="m8.45 15.55-2.1 2.1" />
            <circle cx="12" cy="12" r="3.25" />
        </svg>
    `;
}

function init() {
    renderHeader();
    renderStatuses();
    renderTodos();
    renderTimeline();
    renderHistoryPage();
    resetServiceEntryFormFields();
    syncEntrySheetCopy();
    setActiveView("dashboard");
    setupPlaceholderActions();
    setupNavigation();
    setupTodoActions();
    setupHistoryActions();
    setupServiceEntryActions();
    syncHistoryWithFirebase();
}

init();
