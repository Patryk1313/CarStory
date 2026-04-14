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
            nextMileage: "245,000",
            progress: 78,
        },
        {
            kind: "timing",
            theme: "orange",
            label: "NAPĘD ROZRZĄDU",
            mileage: "208,223",
            unit: "k",
            nextMileage: "500,000",
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
const LEGACY_HISTORY_STORAGE_KEY = "car-info-history";
const LEGACY_HISTORY_FIREBASE_SEEDED_KEY = "car-info-history-seeded-v1";
const LEGACY_PROFILE_STORAGE_KEY = "car-info-profile";
const HISTORY_STORAGE_PREFIX = "car-info-history-v2";
const HISTORY_FIREBASE_SEEDED_PREFIX = "car-info-history-seeded-v2";
const PROFILE_STORAGE_PREFIX = "car-info-profile-v2";
const FIREBASE_CAR_DOC_ID = "seat-ibiza-2007-1-9-tdi";
const BACKUP_SCHEMA_VERSION = 1;
const DEFAULT_MAINTENANCE_INTERVALS = {
    oil: {
        mileage: 10000,
        months: 12,
    },
    timing: {
        mileage: 60000,
        months: 60,
    },
};
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
const profileView = document.getElementById("profile-view");
const settingsView = document.getElementById("settings-view");
const statusGrid = document.getElementById("status-grid");
const historyTitle = document.getElementById("history-title");
const historyPageHeading = document.getElementById("history-page-heading");
const openHistoryViewButton = document.getElementById(
    "open-history-view-button",
);
const openSettingsViewButton = document.getElementById(
    "open-settings-view-button",
);
const closeSettingsViewButton = document.getElementById(
    "close-settings-view-button",
);
const timeline = document.getElementById("timeline");
const historyPageList = document.getElementById("history-page-list");
const historyPageEmpty = document.getElementById("history-page-empty");
const historyCount = document.getElementById("history-count");
const toast = document.getElementById("toast");
const authStatusText = document.getElementById("auth-status-text");
const authUserHint = document.getElementById("auth-user-hint");
const authCardEyebrow = document.getElementById("auth-card-eyebrow");
const authForm = document.getElementById("auth-form");
const authEmailInput = document.getElementById("auth-email-input");
const authPasswordInput = document.getElementById("auth-password-input");
const authSignInButton = document.getElementById("auth-sign-in-button");
const authRegisterButton = document.getElementById("auth-register-button");
const authSignOutButton = document.getElementById("auth-sign-out-button");
const authModal = document.getElementById("auth-modal");
const openAuthModalButton = document.getElementById("open-auth-modal-button");
const closeAuthModalButton = document.getElementById("close-auth-modal-button");
const profileVehiclesCard = document.getElementById("profile-vehicles-card");
const profileVehiclesCount = document.getElementById("profile-vehicles-count");
const profileVehiclesTotal = document.getElementById("profile-vehicles-total");
const profileVehiclesEmpty = document.getElementById("profile-vehicles-empty");
const profileVehiclesList = document.getElementById("profile-vehicles-list");
const vehicleFormDropdown = document.getElementById("vehicle-form-dropdown");
const vehicleForm = document.getElementById("vehicle-form");
const vehicleTypeInput = document.getElementById("vehicle-type");
const vehicleNameInput = document.getElementById("vehicle-name");
const vehicleYearInput = document.getElementById("vehicle-year");
const vehicleEngineInput = document.getElementById("vehicle-engine");
const vehicleMileageInput = document.getElementById("vehicle-mileage");
const vehicleOilMileageInput = document.getElementById("vehicle-oil-mileage");
const vehicleOilDateInput = document.getElementById("vehicle-oil-date");
const vehicleTimingMileageInput = document.getElementById(
    "vehicle-timing-mileage",
);
const vehicleTimingDateInput = document.getElementById("vehicle-timing-date");
const vehicleSubmitButton = document.getElementById("vehicle-submit-button");
const settingsIntervalEmpty = document.getElementById(
    "settings-interval-empty",
);
const settingsIntervalForm = document.getElementById("settings-interval-form");
const settingsOilIntervalKmInput = document.getElementById(
    "settings-oil-interval-km",
);
const settingsOilIntervalMonthsInput = document.getElementById(
    "settings-oil-interval-months",
);
const settingsTimingIntervalKmInput = document.getElementById(
    "settings-timing-interval-km",
);
const settingsTimingIntervalMonthsInput = document.getElementById(
    "settings-timing-interval-months",
);
const settingsIntervalSubmitButton = document.getElementById(
    "settings-interval-submit-button",
);
const settingsSignOutButton = document.getElementById(
    "settings-sign-out-button",
);
const settingsExportButton = document.getElementById("settings-export-button");
const settingsImportButton = document.getElementById("settings-import-button");
const settingsImportInput = document.getElementById("settings-import-input");
const navDashboard = document.getElementById("nav-dashboard");
const navHistory = document.getElementById("nav-history");
const navProfile = document.getElementById("nav-profile");
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
const maintenanceSheet = document.getElementById("maintenance-sheet");
const maintenanceSheetTitle = document.getElementById(
    "maintenance-sheet-title",
);
const maintenanceSheetSubtitle = document.getElementById(
    "maintenance-sheet-subtitle",
);
const closeMaintenanceSheetButton = document.getElementById(
    "close-maintenance-sheet-button",
);
const maintenanceForm = document.getElementById("maintenance-form");
const maintenanceMileageInput = document.getElementById("maintenance-mileage");
const maintenanceDateInput = document.getElementById("maintenance-date");
const maintenanceFormSubmitButton = document.getElementById(
    "maintenance-form-submit-button",
);

let toastTimeoutId = 0;
let currentView = "dashboard";
let editingHistoryEntryId = null;
let editingMaintenanceKind = "";
let currentUser = null;
let authReady = false;
let authBusy = false;
let profileSyncMode = "local";
let previousMainView = "dashboard";
let hasShownHistorySyncError = false;
let hasShownProfileSyncError = false;
let historyUnsubscribe = null;
let profileUnsubscribe = null;
let profileSyncRevision = 0;
let settingsIntervalBusy = false;
let settingsSyncBusy = false;
let settingsBackupBusy = false;
let todos = loadTodos();
let profileSettings = loadProfileSettings();
let historyEntries = loadHistoryCache();

function renderHeader() {
    const selectedVehicle = getSelectedVehicle();

    if (selectedVehicle.isPlaceholder) {
        carName.textContent = selectedVehicle.name;
        carYear.textContent = "Pojazdy";
        carEngine.textContent = "Brak aktywnego pojazdu";
        document.title = "Car Info";
        return;
    }

    carName.textContent = selectedVehicle.name;
    carYear.textContent = selectedVehicle.year || selectedVehicle.type;
    carEngine.textContent = selectedVehicle.engine || selectedVehicle.type;
    document.title = `${selectedVehicle.name} - Car Info`;
}

function renderStatuses() {
    const selectedVehicle = getSelectedVehicle();

    if (selectedVehicle.isPlaceholder) {
        statusGrid.innerHTML = `
            <article class="status-card status-card--blue">
                <div class="status-card__top">
                    <span class="status-card__icon" aria-hidden="true">+</span>
                    <p class="status-card__label">Brak aktywnego pojazdu</p>
                </div>
                <div class="status-card__value">
                    <span class="status-card__value-number">Dodaj</span>
                    <span class="status-card__value-unit">auto</span>
                </div>
                <div class="status-card__next">
                    <span class="status-card__next-label">Przejdź do<br>Pojazdów</span>
                    <span class="status-card__next-badge">Teraz</span>
                </div>
            </article>
        `;
        return;
    }

    const vehicleMileage = Number.isFinite(selectedVehicle.mileage)
        ? selectedVehicle.mileage
        : getDefaultVehicleMileage();

    statusGrid.innerHTML = appData.statuses
        .map((item) => {
            const statusPresentation = getStatusPresentation(
                item,
                selectedVehicle,
                vehicleMileage,
            );

            return `
        <button
            class="status-card status-card--interactive status-card--${item.theme}"
            type="button"
            data-maintenance-kind="${item.kind}"
            aria-label="Zaktualizuj dane serwisowe: ${escapeHtml(item.label)}"
        >
            <div class="status-card__top">
                ${getStatusIcon(item.kind)}
                <p class="status-card__label">${item.label}</p>
            </div>
            <div class="status-card__value">
                <span class="status-card__value-label">ostatnia wymiana</span>
                <span class="status-card__value-number">${statusPresentation.valueMileageLabel}</span>
                <span class="status-card__value-unit">km</span>
            </div>
            <div class="status-card__next">
                <span class="status-card__next-label">Następny przy</span>
                <div class="status-card__next-copy">
                    <span class="status-card__next-badge">${getStatusNextMileageMarkup(statusPresentation.nextMileageLabel)}</span>
                    ${statusPresentation.nextDateLabel ? `<span class="status-card__next-date">${statusPresentation.nextDateLabel}</span>` : ""}
                </div>
            </div>
        </button>
    `;
        })
        .join("");
}

function getStatusPresentation(item, vehicle, currentMileage) {
    if (item.kind === "oil") {
        const oilStatus = getOilStatusPresentation(vehicle, currentMileage);

        if (oilStatus) {
            return oilStatus;
        }
    }

    if (item.kind === "timing") {
        const timingStatus = getTimingStatusPresentation(
            vehicle,
            currentMileage,
        );

        if (timingStatus) {
            return timingStatus;
        }
    }

    return {
        valueMileageLabel: formatMileage(currentMileage),
        nextMileageLabel: item.nextMileage,
        nextDateLabel: "",
        progress: item.progress,
    };
}

function getStatusNextMileageMarkup(nextMileageLabel) {
    const label = normalizeText(String(nextMileageLabel || ""), 24).replace(
        /\s*km$/i,
        "",
    );

    if (!label) {
        return '<span class="status-card__next-mileage">Brak danych</span>';
    }

    return `
        <span class="status-card__next-mileage">${escapeHtml(label)}</span>
        <span class="status-card__next-unit">km</span>
    `;
}

function getMaintenanceIntervalKeys(kind) {
    if (kind === "oil") {
        return {
            mileageKey: "oilChangeIntervalKm",
            monthsKey: "oilChangeIntervalMonths",
        };
    }

    if (kind === "timing") {
        return {
            mileageKey: "timingDriveIntervalKm",
            monthsKey: "timingDriveIntervalMonths",
        };
    }

    return null;
}

function getMaintenanceIntervalDefaults(kind) {
    return (
        DEFAULT_MAINTENANCE_INTERVALS[kind] || DEFAULT_MAINTENANCE_INTERVALS.oil
    );
}

function getVehicleMaintenanceInterval(vehicle, kind) {
    const intervalKeys = getMaintenanceIntervalKeys(kind);
    const defaults = getMaintenanceIntervalDefaults(kind);

    if (!intervalKeys || !vehicle || typeof vehicle !== "object") {
        return defaults;
    }

    const mileage = Number(vehicle[intervalKeys.mileageKey]);
    const months = Number(vehicle[intervalKeys.monthsKey]);

    return {
        mileage:
            Number.isFinite(mileage) && mileage > 0
                ? Math.round(mileage)
                : defaults.mileage,
        months:
            Number.isFinite(months) && months > 0
                ? Math.round(months)
                : defaults.months,
    };
}

function getOilStatusPresentation(vehicle, currentMileage) {
    const interval = getVehicleMaintenanceInterval(vehicle, "oil");

    return getMaintenanceStatusPresentation({
        currentMileage,
        lastMileage: vehicle.oilChangeMileage,
        lastDate: vehicle.oilChangeDate,
        intervalMileage: interval.mileage,
        intervalMonths: interval.months,
    });
}

function getTimingStatusPresentation(vehicle, currentMileage) {
    const interval = getVehicleMaintenanceInterval(vehicle, "timing");

    return getMaintenanceStatusPresentation({
        currentMileage,
        lastMileage: vehicle.timingDriveMileage,
        lastDate: vehicle.timingDriveDate,
        intervalMileage: interval.mileage,
        intervalMonths: interval.months,
    });
}

function getMaintenanceStatusPresentation({
    currentMileage,
    lastMileage,
    lastDate,
    intervalMileage,
    intervalMonths,
}) {
    const normalizedLastMileage = Number(lastMileage);
    const normalizedLastDate = normalizeIsoDate(lastDate);

    if (
        !Number.isFinite(normalizedLastMileage) ||
        normalizedLastMileage < 0 ||
        !normalizedLastDate ||
        !Number.isFinite(intervalMileage) ||
        intervalMileage <= 0 ||
        !Number.isFinite(intervalMonths) ||
        intervalMonths <= 0
    ) {
        return null;
    }

    const nextMileage = normalizedLastMileage + intervalMileage;
    const nextDate = addMonthsToIsoDate(normalizedLastDate, intervalMonths);

    return {
        valueMileageLabel: formatMileage(normalizedLastMileage),
        nextMileageLabel: formatMileage(nextMileage),
        nextDateLabel: formatNumericDate(nextDate),
        progress: getMileageProgress(
            currentMileage,
            normalizedLastMileage,
            intervalMileage,
        ),
    };
}

function getMileageProgress(currentMileage, lastMileage, intervalMileage) {
    if (
        !Number.isFinite(currentMileage) ||
        !Number.isFinite(lastMileage) ||
        !Number.isFinite(intervalMileage) ||
        intervalMileage <= 0
    ) {
        return 0;
    }

    const traveledDistance = Math.max(currentMileage - lastMileage, 0);
    const progress = (traveledDistance / intervalMileage) * 100;

    return Math.min(Math.max(progress, 0), 100);
}

function addMonthsToIsoDate(value, monthsToAdd) {
    const [year, month, day] = value.split("-").map(Number);
    const nextDate = new Date(year, month - 1 + monthsToAdd, day);
    const nextMonth = String(nextDate.getMonth() + 1).padStart(2, "0");
    const nextDay = String(nextDate.getDate()).padStart(2, "0");

    return `${nextDate.getFullYear()}-${nextMonth}-${nextDay}`;
}

function getMaintenanceEditorConfig(kind) {
    if (kind === "oil") {
        return {
            title: "Olej silnikowy",
            subtitle:
                "Zapisz przebieg i datę ostatniej wymiany oleju. Kolejny termin przeliczy się automatycznie.",
            mileageKey: "oilChangeMileage",
            dateKey: "oilChangeDate",
            submitLabel: "Zapisz wymianę oleju",
            successToast: "Zaktualizowano wymianę oleju.",
            localToast: "Zaktualizowano wymianę oleju lokalnie.",
        };
    }

    if (kind === "timing") {
        return {
            title: "Napęd rozrządu",
            subtitle:
                "Zapisz przebieg i datę wymiany napędu rozrządu. Kolejny termin przeliczy się automatycznie.",
            mileageKey: "timingDriveMileage",
            dateKey: "timingDriveDate",
            submitLabel: "Zapisz wymianę rozrządu",
            successToast: "Zaktualizowano wymianę rozrządu.",
            localToast: "Zaktualizowano wymianę rozrządu lokalnie.",
        };
    }

    return null;
}

function syncMaintenanceSheetCopy() {
    if (!maintenanceSheetTitle || !maintenanceSheetSubtitle) {
        return;
    }

    const config = getMaintenanceEditorConfig(editingMaintenanceKind);

    maintenanceSheetTitle.textContent = config
        ? config.title
        : "Aktualizuj serwis";
    maintenanceSheetSubtitle.textContent = config
        ? config.subtitle
        : "Zapisz przebieg i datę ostatniej wymiany. Następny termin przeliczy się automatycznie.";
}

function setMaintenanceFormBusy(isBusy) {
    if (!maintenanceFormSubmitButton) {
        return;
    }

    const config = getMaintenanceEditorConfig(editingMaintenanceKind);

    maintenanceFormSubmitButton.disabled = isBusy;
    maintenanceFormSubmitButton.textContent = isBusy
        ? "Zapisywanie..."
        : config?.submitLabel || "Zapisz zmiany";
}

function syncSheetOpenState() {
    const hasOpenSheet =
        Boolean(entrySheet && !entrySheet.hidden) ||
        Boolean(maintenanceSheet && !maintenanceSheet.hidden);

    document.body.classList.toggle("sheet-open", hasOpenSheet);
}

function openMaintenanceSheet(kind) {
    const config = getMaintenanceEditorConfig(kind);

    if (!maintenanceSheet || !config || !hasActiveVehicle()) {
        return;
    }

    const selectedVehicle = getSelectedVehicle();

    editingMaintenanceKind = kind;
    syncMaintenanceSheetCopy();
    setMaintenanceFormBusy(false);
    maintenanceMileageInput.value = Number.isFinite(
        selectedVehicle[config.mileageKey],
    )
        ? String(selectedVehicle[config.mileageKey])
        : "";
    maintenanceDateInput.value = selectedVehicle[config.dateKey] || "";
    maintenanceSheet.hidden = false;
    syncSheetOpenState();

    window.requestAnimationFrame(() => {
        maintenanceMileageInput?.focus();
    });
}

function closeMaintenanceSheet({ reset = false } = {}) {
    if (!maintenanceSheet) {
        return;
    }

    maintenanceSheet.hidden = true;
    syncSheetOpenState();

    if (reset) {
        editingMaintenanceKind = "";
        maintenanceForm?.reset();
        syncMaintenanceSheetCopy();
        setMaintenanceFormBusy(false);
    }
}

function renderTimeline() {
    if (!hasActiveVehicle()) {
        timeline.innerHTML = `
            <li class="timeline-item">
                <p class="timeline-item__description">Dodaj pojazd w sekcji Pojazdy, aby rozpocząć historię serwisową.</p>
            </li>
        `;
        return;
    }

    const timelineEntries = historyEntries;

    if (!timelineEntries.length) {
        timeline.innerHTML = `
            <li class="timeline-item">
                <p class="timeline-item__description">Brak wpisów w historii serwisowej.</p>
            </li>
        `;
        return;
    }

    timeline.innerHTML = timelineEntries
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
    const hasVehicle = hasActiveVehicle();

    historyCount.textContent = hasVehicle
        ? getCountLabel(historyEntries.length, ["wpis", "wpisy", "wpisów"])
        : "0 wpisów";
    historyPageEmpty.textContent = hasVehicle
        ? "Brak wpisów w historii serwisowej."
        : "Dodaj pojazd w sekcji Pojazdy, aby rozpocząć historię serwisową.";
    historyPageEmpty.hidden = hasVehicle ? historyEntries.length !== 0 : false;
    historyPageList.hidden = !hasVehicle || historyEntries.length === 0;

    if (!hasVehicle) {
        historyPageList.innerHTML = "";
        renderProfileSummary();
        return;
    }

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

    renderProfileSummary();
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

function renderProfileSummary() {
    const selectedVehicle = getSelectedVehicle();
    const vehicles = getProfileVehicles();

    renderVehicleManager(vehicles, selectedVehicle.id);
    renderSettingsView();
}

function renderSettingsView() {
    if (!settingsView) {
        return;
    }

    const selectedVehicle = getSelectedVehicle();
    const hasVehicle = hasActiveVehicle();
    const oilInterval = getVehicleMaintenanceInterval(selectedVehicle, "oil");
    const timingInterval = getVehicleMaintenanceInterval(
        selectedVehicle,
        "timing",
    );

    if (settingsIntervalEmpty) {
        settingsIntervalEmpty.hidden = hasVehicle;
    }

    if (settingsIntervalForm) {
        settingsIntervalForm.hidden = !hasVehicle;
    }

    if (settingsOilIntervalKmInput) {
        settingsOilIntervalKmInput.value = hasVehicle
            ? String(oilInterval.mileage)
            : "";
    }

    if (settingsOilIntervalMonthsInput) {
        settingsOilIntervalMonthsInput.value = hasVehicle
            ? String(oilInterval.months)
            : "";
    }

    if (settingsTimingIntervalKmInput) {
        settingsTimingIntervalKmInput.value = hasVehicle
            ? String(timingInterval.mileage)
            : "";
    }

    if (settingsTimingIntervalMonthsInput) {
        settingsTimingIntervalMonthsInput.value = hasVehicle
            ? String(timingInterval.months)
            : "";
    }

    if (settingsIntervalSubmitButton) {
        settingsIntervalSubmitButton.disabled =
            !hasVehicle || settingsIntervalBusy;
        settingsIntervalSubmitButton.textContent = settingsIntervalBusy
            ? "Zapisywanie..."
            : "Zapisz interwały";
    }

    if (settingsSignOutButton) {
        settingsSignOutButton.hidden = !currentUser;
        settingsSignOutButton.disabled = authBusy || settingsSyncBusy;
    }

    if (settingsExportButton) {
        settingsExportButton.disabled = settingsBackupBusy;
        settingsExportButton.textContent = settingsBackupBusy
            ? "Przetwarzanie..."
            : "Eksportuj kopię";
    }

    if (settingsImportButton) {
        settingsImportButton.disabled = settingsBackupBusy;
        settingsImportButton.textContent = settingsBackupBusy
            ? "Przetwarzanie..."
            : "Importuj kopię";
    }
}

function setSettingsIntervalBusy(isBusy) {
    settingsIntervalBusy = isBusy;
    renderSettingsView();
}

function setSettingsSyncBusy(isBusy) {
    settingsSyncBusy = isBusy;
    renderSettingsView();
}

function setSettingsBackupBusy(isBusy) {
    settingsBackupBusy = isBusy;
    renderSettingsView();
}

function openSettingsView() {
    setActiveView("settings");
}

function closeSettingsView() {
    setActiveView(previousMainView || "dashboard");
}

function renderVehicleManager(vehicles, selectedVehicleId) {
    if (
        !profileVehiclesCount ||
        !profileVehiclesTotal ||
        !profileVehiclesEmpty ||
        !profileVehiclesList
    ) {
        return;
    }

    const vehicleCountLabel = getCountLabel(vehicles.length, [
        "pojazd",
        "pojazdy",
        "pojazdów",
    ]);
    const activeVehicle =
        vehicles.find((vehicle) => vehicle.id === selectedVehicleId) ||
        vehicles[0] ||
        null;

    profileVehiclesCount.textContent = vehicleCountLabel;
    profileVehiclesTotal.textContent = vehicles.length
        ? vehicles.length === 1
            ? `Aktywny pojazd: ${activeVehicle?.name || vehicles[0].name}.`
            : `Aktywny pojazd: ${activeVehicle?.name || vehicles[0].name}. Dotknij innego pojazdu na liście, aby go przełączyć.`
        : "Nie masz jeszcze dodanych pojazdów.";
    profileVehiclesEmpty.hidden = vehicles.length !== 0;
    profileVehiclesList.hidden = vehicles.length === 0;

    profileVehiclesList.innerHTML = vehicles
        .map(
            (vehicle) => `
                <li>
                    <article class="vehicle-item${
                        vehicle.id === selectedVehicleId
                            ? " vehicle-item--active"
                            : ""
                    }">
                        <button
                            class="vehicle-item__select"
                            type="button"
                            data-vehicle-action="select"
                            data-vehicle-id="${escapeHtml(vehicle.id)}"
                            aria-pressed="${vehicle.id === selectedVehicleId ? "true" : "false"}"
                        >
                            <span class="vehicle-item__indicator" aria-hidden="true"></span>
                            <div class="vehicle-item__main">
                                <div class="vehicle-item__heading">
                                    <h3 class="vehicle-item__title">${escapeHtml(vehicle.name)}</h3>
                                    ${vehicle.id === selectedVehicleId ? '<span class="vehicle-item__badge">Aktywne</span>' : ""}
                                </div>
                                <p class="vehicle-item__meta">${escapeHtml(formatVehicleMeta(vehicle))}</p>
                                <p class="vehicle-item__secondary">${escapeHtml(formatMileage(vehicle.mileage))} km</p>
                            </div>
                        </button>
                        <button class="vehicle-item__delete" type="button" data-vehicle-action="delete" data-vehicle-id="${escapeHtml(vehicle.id)}">
                            Usuń
                        </button>
                    </article>
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

function openAuthModal() {
    if (!authModal) {
        return;
    }

    authModal.hidden = false;
    document.body.classList.add("auth-modal-open");

    window.requestAnimationFrame(() => {
        authEmailInput?.focus();
    });
}

function closeAuthModal() {
    if (!authModal) {
        return;
    }

    authModal.hidden = true;
    document.body.classList.remove("auth-modal-open");
    clearAuthPasswordField();
}

function updateAuthUi() {
    const firebaseState = window.carInfoFirebase;
    const authAvailable = Boolean(firebaseState && firebaseState.auth);
    const isAuthenticated = Boolean(currentUser);

    updateProfileViewState({
        isAuthenticated,
        authAvailable,
    });

    if (
        !authStatusText ||
        !authUserHint ||
        !authSignInButton ||
        !authRegisterButton ||
        !authSignOutButton
    ) {
        renderSettingsView();
        return;
    }

    if (!authAvailable) {
        authStatusText.textContent =
            "Firebase Auth nie jest dostępny. Pojazdy i historia działają tylko lokalnie.";
        authUserHint.textContent = "";
        if (authForm) {
            authForm.hidden = true;
        }
        authSignOutButton.hidden = true;
        renderSettingsView();
        return;
    }

    authSignInButton.disabled = authBusy;
    authRegisterButton.disabled = authBusy;
    authSignOutButton.disabled = authBusy;
    if (authEmailInput) {
        authEmailInput.disabled = authBusy || Boolean(currentUser);
    }
    if (authPasswordInput) {
        authPasswordInput.disabled = authBusy || Boolean(currentUser);
    }

    if (!authReady) {
        authStatusText.textContent = "Sprawdzanie sesji użytkownika...";
        authUserHint.textContent = "";
        if (authForm) {
            authForm.hidden = false;
        }
        if (authCardEyebrow) {
            authCardEyebrow.textContent = "Logowanie";
        }
        authSignInButton.textContent = "Ładowanie...";
        authRegisterButton.textContent = "Tworzenie...";
        authSignOutButton.hidden = true;
        renderSettingsView();
        return;
    }

    if (isAuthenticated) {
        closeAuthModal();
        authStatusText.textContent =
            "Pojazdy i historia serwisowa są synchronizowane z Firebase dla zalogowanego użytkownika.";
        authUserHint.textContent = currentUser.email
            ? `Zalogowano jako ${currentUser.email}`
            : `Zalogowano. UID: ${currentUser.uid}`;
        if (authForm) {
            authForm.hidden = true;
        }
        if (authCardEyebrow) {
            authCardEyebrow.textContent = "Konto";
        }
        authSignOutButton.hidden = true;
        renderSettingsView();
        return;
    }

    authStatusText.textContent =
        "Zaloguj się, aby synchronizować pojazdy i historię serwisową w Firebase.";
    authUserHint.textContent =
        "Po zalogowaniu zsynchronizujesz listę pojazdów i historię serwisową między urządzeniami.";
    if (authForm) {
        authForm.hidden = false;
    }
    if (authCardEyebrow) {
        authCardEyebrow.textContent = "Logowanie";
    }
    authSignInButton.textContent = authBusy ? "Logowanie..." : "Zaloguj";
    authRegisterButton.textContent = authBusy ? "Tworzenie..." : "Utwórz konto";
    authSignOutButton.hidden = true;
    renderSettingsView();
}

function updateProfileViewState({ isAuthenticated, authAvailable }) {
    profileView?.classList.toggle("profile-view--guest", !isAuthenticated);
    profileView?.classList.toggle(
        "profile-view--authenticated",
        isAuthenticated,
    );

    if (profileVehiclesCard) {
        profileVehiclesCard.hidden = false;
    }

    if (openAuthModalButton) {
        openAuthModalButton.hidden = isAuthenticated;
        openAuthModalButton.disabled = !authAvailable;
        openAuthModalButton.textContent = authAvailable
            ? "Zaloguj do Firebase"
            : "Firebase niedostępny";
    }

    if (!authAvailable && authCardEyebrow) {
        authCardEyebrow.textContent = "Firebase Auth";
    }
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
    [
        [navDashboard, "dashboard"],
        [navHistory, "history"],
        [navProfile, "profile"],
        [openHistoryViewButton, "history"],
        [openSettingsViewButton, "settings"],
    ].forEach(([button, view]) => {
        button?.addEventListener("click", () => {
            setActiveView(view);
        });
    });

    closeSettingsViewButton?.addEventListener("click", () => {
        closeSettingsView();
    });
}

function setupMaintenanceActions() {
    statusGrid?.addEventListener("click", (event) => {
        const maintenanceCard = event.target.closest("[data-maintenance-kind]");

        if (!maintenanceCard) {
            return;
        }

        openMaintenanceSheet(maintenanceCard.dataset.maintenanceKind);
    });

    closeMaintenanceSheetButton?.addEventListener("click", () => {
        closeMaintenanceSheet({ reset: true });
    });

    document
        .querySelectorAll("[data-close-maintenance-sheet]")
        .forEach((button) => {
            button.addEventListener("click", () => {
                closeMaintenanceSheet({ reset: true });
            });
        });

    maintenanceForm?.addEventListener("submit", async (event) => {
        event.preventDefault();

        const config = getMaintenanceEditorConfig(editingMaintenanceKind);

        if (!config || !hasActiveVehicle()) {
            return;
        }

        if (!maintenanceForm.reportValidity()) {
            return;
        }

        const mileage = Number(maintenanceMileageInput?.value || 0);
        const date = normalizeIsoDate(maintenanceDateInput?.value || "");

        if (!Number.isFinite(mileage) || mileage < 0) {
            showToast("Podaj prawidłowy przebieg wymiany.");
            maintenanceMileageInput?.focus();
            return;
        }

        if (!date) {
            showToast("Podaj prawidłową datę wymiany.");
            maintenanceDateInput?.focus();
            return;
        }

        const selectedVehicleId = getSelectedVehicleId();
        const nextVehicles = getProfileVehicles().map((vehicle) =>
            vehicle.id === selectedVehicleId
                ? {
                      ...vehicle,
                      [config.mileageKey]: Math.round(mileage),
                      [config.dateKey]: date,
                  }
                : vehicle,
        );

        setMaintenanceFormBusy(true);

        const savedTo = await persistProfileSettings({
            ...profileSettings,
            vehicles: nextVehicles,
            updatedAt: Date.now(),
        });

        setMaintenanceFormBusy(false);
        closeMaintenanceSheet({ reset: true });
        showToast(
            savedTo === "firebase" ? config.successToast : config.localToast,
        );
    });

    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            maintenanceSheet &&
            !maintenanceSheet.hidden
        ) {
            closeMaintenanceSheet({ reset: true });
        }
    });
}

function setupAuthActions() {
    openAuthModalButton?.addEventListener("click", () => {
        openAuthModal();
    });

    closeAuthModalButton?.addEventListener("click", () => {
        closeAuthModal();
    });

    document.querySelectorAll("[data-close-auth-modal]").forEach((button) => {
        button.addEventListener("click", () => {
            closeAuthModal();
        });
    });

    authForm?.addEventListener("submit", async (event) => {
        event.preventDefault();
        await signInWithEmailPassword();
    });

    authRegisterButton?.addEventListener("click", async () => {
        await registerWithEmailPassword();
    });

    authSignOutButton?.addEventListener("click", async () => {
        await signOutFromFirebase();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && authModal && !authModal.hidden) {
            closeAuthModal();
        }
    });
}

function setupFirebaseAuth() {
    const firebaseState = window.carInfoFirebase;

    if (
        !firebaseState ||
        !firebaseState.auth ||
        typeof firebase.auth !== "function"
    ) {
        authReady = true;
        updateAuthUi();
        return;
    }

    firebaseState.auth.onAuthStateChanged((user) => {
        currentUser = user;
        profileSettings = loadProfileSettings();
        historyEntries = loadHistoryCache();
        authReady = true;
        authBusy = false;
        hasShownHistorySyncError = false;
        hasShownProfileSyncError = false;
        updateAuthUi();
        refreshVehicleContext();
        restartHistorySync();
        restartProfileSync();
    });
}

function setupVehicleActions() {
    profileVehiclesList?.addEventListener("click", async (event) => {
        const actionButton = event.target.closest("[data-vehicle-action]");

        if (!actionButton) {
            return;
        }

        const vehicleId = actionButton.dataset.vehicleId;

        if (!vehicleId) {
            return;
        }

        if (actionButton.dataset.vehicleAction === "select") {
            await changeSelectedVehicle(vehicleId);
            return;
        }

        await deleteVehicleProfile(vehicleId);
    });

    vehicleForm?.addEventListener("submit", async (event) => {
        event.preventDefault();
        await addVehicleProfile();
    });
}

function setupSettingsActions() {
    settingsIntervalForm?.addEventListener("submit", async (event) => {
        event.preventDefault();
        await saveSettingsIntervals();
    });

    settingsSignOutButton?.addEventListener("click", async () => {
        await signOutFromFirebase();
    });

    settingsExportButton?.addEventListener("click", () => {
        try {
            setSettingsBackupBusy(true);
            downloadBackupSnapshot(createBackupSnapshot());
            showToast("Wyeksportowano kopię danych.");
        } catch (error) {
            console.error("Unable to export backup snapshot.", error);
            showToast("Nie udało się wyeksportować kopii danych.");
        } finally {
            setSettingsBackupBusy(false);
        }
    });

    settingsImportButton?.addEventListener("click", () => {
        settingsImportInput?.click();
    });

    settingsImportInput?.addEventListener("change", async (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        await importBackupFile(file);
        event.target.value = "";
    });
}

async function saveSettingsIntervals() {
    if (!hasActiveVehicle() || !settingsIntervalForm) {
        return;
    }

    if (!settingsIntervalForm.reportValidity()) {
        return;
    }

    const oilIntervalKm = Number(settingsOilIntervalKmInput?.value || 0);
    const oilIntervalMonths = Number(
        settingsOilIntervalMonthsInput?.value || 0,
    );
    const timingIntervalKm = Number(settingsTimingIntervalKmInput?.value || 0);
    const timingIntervalMonths = Number(
        settingsTimingIntervalMonthsInput?.value || 0,
    );

    if (!Number.isFinite(oilIntervalKm) || oilIntervalKm <= 0) {
        showToast("Podaj prawidłowy interwał km dla oleju.");
        settingsOilIntervalKmInput?.focus();
        return;
    }

    if (!Number.isFinite(oilIntervalMonths) || oilIntervalMonths <= 0) {
        showToast("Podaj prawidłowy interwał miesięcy dla oleju.");
        settingsOilIntervalMonthsInput?.focus();
        return;
    }

    if (!Number.isFinite(timingIntervalKm) || timingIntervalKm <= 0) {
        showToast("Podaj prawidłowy interwał km dla rozrządu.");
        settingsTimingIntervalKmInput?.focus();
        return;
    }

    if (!Number.isFinite(timingIntervalMonths) || timingIntervalMonths <= 0) {
        showToast("Podaj prawidłowy interwał miesięcy dla rozrządu.");
        settingsTimingIntervalMonthsInput?.focus();
        return;
    }

    const selectedVehicleId = getSelectedVehicleId();
    const nextVehicles = getProfileVehicles().map((vehicle) =>
        vehicle.id === selectedVehicleId
            ? {
                  ...vehicle,
                  oilChangeIntervalKm: Math.round(oilIntervalKm),
                  oilChangeIntervalMonths: Math.round(oilIntervalMonths),
                  timingDriveIntervalKm: Math.round(timingIntervalKm),
                  timingDriveIntervalMonths: Math.round(timingIntervalMonths),
              }
            : vehicle,
    );

    setSettingsIntervalBusy(true);

    const savedTo = await persistProfileSettings({
        ...profileSettings,
        vehicles: nextVehicles,
        updatedAt: Date.now(),
    });

    setSettingsIntervalBusy(false);
    showToast(
        savedTo === "firebase"
            ? "Zapisano interwały serwisowe."
            : "Zapisano interwały lokalnie.",
    );
}

async function changeSelectedVehicle(vehicleId) {
    const vehicles = getProfileVehicles();

    if (
        !vehicleId ||
        !vehicles.some((vehicle) => vehicle.id === vehicleId) ||
        vehicleId === profileSettings.selectedVehicleId
    ) {
        return;
    }

    profileSettings = normalizeProfileSettings({
        ...profileSettings,
        selectedVehicleId: vehicleId,
        updatedAt: Date.now(),
    });
    historyEntries = loadHistoryCache();
    refreshVehicleContext();

    const savedTo = await persistProfileSettings(profileSettings);
    restartHistorySync();
    showToast(
        savedTo === "firebase"
            ? "Zmieniono aktywny pojazd."
            : "Zmieniono aktywny pojazd lokalnie.",
    );
}

async function addVehicleProfile() {
    const vehicleDraft = readVehicleFormValues();

    if (!vehicleDraft) {
        return;
    }

    const vehicles = getProfileVehicles();
    const vehicleId = ensureUniqueVehicleId(
        vehicles,
        createVehicleProfileId(vehicleDraft.name, vehicleDraft.year),
    );
    const vehicle = normalizeVehicleProfile({
        ...vehicleDraft,
        id: vehicleId,
    });

    if (!vehicle) {
        showToast("Nie udało się dodać pojazdu.");
        return;
    }

    profileSettings = normalizeProfileSettings({
        ...profileSettings,
        vehicles: [...vehicles, vehicle],
        selectedVehicleId: vehicle.id,
        updatedAt: Date.now(),
    });
    historyEntries = loadHistoryCache();
    refreshVehicleContext();

    const savedTo = await persistProfileSettings(profileSettings);
    restartHistorySync();
    vehicleForm.reset();
    if (vehicleTypeInput) {
        vehicleTypeInput.value = "Auto";
    }
    if (vehicleFormDropdown) {
        vehicleFormDropdown.open = false;
    }
    showToast(
        savedTo === "firebase"
            ? "Dodano nowy pojazd."
            : "Dodano pojazd lokalnie.",
    );
}

async function deleteVehicleProfile(vehicleId) {
    const vehicles = getProfileVehicles();
    const vehicle = vehicles.find((item) => item.id === vehicleId);

    if (!vehicle) {
        return;
    }

    if (!window.confirm(`Usunąć pojazd "${vehicle.name}"?`)) {
        return;
    }

    const remainingVehicles = vehicles.filter((item) => item.id !== vehicleId);
    const nextSelectedVehicleId =
        profileSettings.selectedVehicleId === vehicleId
            ? remainingVehicles[0]?.id || ""
            : profileSettings.selectedVehicleId;

    profileSettings = normalizeProfileSettings({
        ...profileSettings,
        vehicles: remainingVehicles,
        selectedVehicleId: nextSelectedVehicleId,
        updatedAt: Date.now(),
    });
    historyEntries = loadHistoryCache();
    refreshVehicleContext();

    const savedTo = await persistProfileSettings(profileSettings);
    restartHistorySync();
    showToast(
        savedTo === "firebase"
            ? remainingVehicles.length
                ? "Usunięto pojazd."
                : "Usunięto ostatni pojazd."
            : remainingVehicles.length
              ? "Usunięto pojazd lokalnie."
              : "Usunięto ostatni pojazd lokalnie.",
    );
}

async function signInWithEmailPassword() {
    const firebaseState = window.carInfoFirebase;
    const credentials = getAuthCredentials();

    if (
        !firebaseState ||
        !firebaseState.auth ||
        typeof firebase.auth !== "function"
    ) {
        showToast("Firebase Auth nie jest dostępny.");
        return false;
    }

    if (!credentials) {
        return false;
    }

    authBusy = true;
    updateAuthUi();

    try {
        await firebaseState.auth.signInWithEmailAndPassword(
            credentials.email,
            credentials.password,
        );
        clearAuthPasswordField();
        return true;
    } catch (error) {
        console.error("Unable to sign in with email and password.", error);
        showToast(getFirebaseAuthErrorMessage(error));
        return false;
    } finally {
        authBusy = false;
        updateAuthUi();
    }
}

async function registerWithEmailPassword() {
    const firebaseState = window.carInfoFirebase;
    const credentials = getAuthCredentials();

    if (
        !firebaseState ||
        !firebaseState.auth ||
        typeof firebase.auth !== "function"
    ) {
        showToast("Firebase Auth nie jest dostępny.");
        return false;
    }

    if (!credentials) {
        return false;
    }

    authBusy = true;
    updateAuthUi();

    try {
        await firebaseState.auth.createUserWithEmailAndPassword(
            credentials.email,
            credentials.password,
        );
        clearAuthPasswordField();
        showToast("Konto email/hasło zostało utworzone.");
        return true;
    } catch (error) {
        console.error("Unable to create email and password account.", error);
        showToast(getFirebaseAuthErrorMessage(error));
        return false;
    } finally {
        authBusy = false;
        updateAuthUi();
    }
}

async function signOutFromFirebase() {
    const firebaseState = window.carInfoFirebase;

    if (!firebaseState || !firebaseState.auth) {
        return;
    }

    authBusy = true;
    updateAuthUi();

    try {
        await firebaseState.auth.signOut();
        showToast("Wylogowano z Firebase.");
    } catch (error) {
        console.error("Unable to sign out from Firebase.", error);
        showToast("Nie udało się wylogować.");
    } finally {
        authBusy = false;
        updateAuthUi();
    }
}

function requireAuthenticatedHistoryAccess() {
    const firebaseState = window.carInfoFirebase;

    if (!firebaseState || !firebaseState.auth) {
        return true;
    }

    if (currentUser && hasActiveVehicle()) {
        return true;
    }

    if (currentUser && !hasActiveVehicle()) {
        showToast(
            "Dodaj pojazd w sekcji Pojazdy, aby prowadzić historię serwisową.",
        );
        setActiveView("profile");
        if (vehicleFormDropdown) {
            vehicleFormDropdown.open = true;
        }
        vehicleNameInput?.focus();
        return false;
    }

    showToast("Zaloguj się do Firebase, aby edytować historię.");
    openAuthModal();
    return false;
}

function stopActiveSyncListeners() {
    if (typeof historyUnsubscribe === "function") {
        historyUnsubscribe();
        historyUnsubscribe = null;
    }

    if (typeof profileUnsubscribe === "function") {
        profileUnsubscribe();
        profileUnsubscribe = null;
    }
}

async function syncCurrentStateToFirebase() {
    const firebaseState = window.carInfoFirebase;
    const userDocument = getUserDocument();
    const vehicleCollection = getVehicleCollection();

    if (!firebaseState?.db || !firebaseState?.auth) {
        profileSyncMode = "local";
        renderProfileSummary();
        return "local";
    }

    if (!currentUser || !userDocument || !vehicleCollection) {
        profileSyncMode = "guest";
        renderProfileSummary();
        return "guest";
    }

    const vehicleIds = new Set(
        getProfileVehicles().map((vehicle) => vehicle.id),
    );

    setSettingsSyncBusy(true);
    profileSyncMode = "syncing";
    renderProfileSummary();

    try {
        const synced = await writeProfileSettingsToFirebase(profileSettings, {
            historyByVehicleId: normalizeHistoryStorageState(
                getHistoryStorageState(),
                vehicleIds,
            ),
        });

        if (synced) {
            hasShownProfileSyncError = false;
            hasShownHistorySyncError = false;
            profileSyncMode = "firebase";
            renderProfileSummary();
            return "firebase";
        }

        profileSyncMode = "error";
        renderProfileSummary();
        return "error";
    } finally {
        setSettingsSyncBusy(false);
    }
}

function restartHistorySync() {
    if (typeof historyUnsubscribe === "function") {
        historyUnsubscribe();
        historyUnsubscribe = null;
    }

    if (!currentUser) {
        renderTimeline();
        renderHistoryPage();
        return;
    }

    syncHistoryWithFirebase();
}

function restartProfileSync() {
    profileSyncRevision += 1;

    if (typeof profileUnsubscribe === "function") {
        profileUnsubscribe();
        profileUnsubscribe = null;
    }

    const firebaseState = window.carInfoFirebase;

    if (!firebaseState || !firebaseState.auth || !firebaseState.db) {
        profileSyncMode = "local";
        renderProfileSummary();
        return;
    }

    if (!currentUser) {
        profileSyncMode = "guest";
        renderProfileSummary();
        return;
    }

    profileSyncMode = "syncing";
    renderProfileSummary();
    void syncProfileWithFirebase(profileSyncRevision);
}

function refreshVehicleContext({ restartHistory = false } = {}) {
    historyEntries = loadHistoryCache();
    renderHeader();
    renderStatuses();
    renderTimeline();
    renderHistoryPage();

    if (restartHistory) {
        restartHistorySync();
    }
}

function setActiveView(viewName) {
    if (viewName === "settings") {
        previousMainView =
            currentView === "settings" ? previousMainView : currentView;
    } else {
        previousMainView = viewName;
    }

    currentView = viewName;

    dashboardView.hidden = viewName !== "dashboard";
    historyView.hidden = viewName !== "history";
    profileView.hidden = viewName !== "profile";
    settingsView.hidden = viewName !== "settings";

    navDashboard.classList.toggle("nav-item--active", viewName === "dashboard");
    navHistory.classList.toggle("nav-item--active", viewName === "history");
    navProfile.classList.toggle("nav-item--active", viewName === "profile");

    navDashboard.toggleAttribute("aria-current", viewName === "dashboard");
    navHistory.toggleAttribute("aria-current", viewName === "history");
    navProfile.toggleAttribute("aria-current", viewName === "profile");

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
            if (!requireAuthenticatedHistoryAccess()) {
                return;
            }

            openEntrySheet(entry);
            return;
        }

        if (!requireAuthenticatedHistoryAccess()) {
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
    [openEntrySheetButton, openEntrySheetHistoryButton]
        .filter(Boolean)
        .forEach((button) => {
        button.addEventListener("click", () => {
            if (!requireAuthenticatedHistoryAccess()) {
                return;
            }

            openEntrySheet();
        });
        });

    if (!closeEntrySheetButton || !serviceEntryForm) {
        return;
    }

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

        if (!requireAuthenticatedHistoryAccess()) {
            return;
        }

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
    syncSheetOpenState();

    window.requestAnimationFrame(() => {
        entryTitleInput.focus();
    });
}

function closeEntrySheet({ reset = false } = {}) {
    entrySheet.hidden = true;
    syncSheetOpenState();

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
    const target =
        currentView === "history" ? historyPageHeading : historyTitle;

    target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function loadHistoryCache() {
    const selectedVehicleId = getSelectedVehicleId();

    if (!selectedVehicleId) {
        return [];
    }

    const fallbackHistory = appData.history
        .map((entry) => normalizeHistoryEntry(entry))
        .filter(Boolean);
    const fallbackEntries =
        shouldUseDemoData() && selectedVehicleId === FIREBASE_CAR_DOC_ID
            ? fallbackHistory
            : [];

    try {
        const historyState = getHistoryStorageState();
        const vehicleHistory = Array.isArray(historyState[selectedVehicleId])
            ? historyState[selectedVehicleId]
            : [];
        const normalizedHistory = vehicleHistory
            .map((entry) => normalizeHistoryEntry(entry))
            .filter(Boolean);

        return normalizedHistory.length
            ? sortHistoryEntries(normalizedHistory)
            : sortHistoryEntries(fallbackEntries);
    } catch (error) {
        console.error("Unable to load service history cache.", error);
        return sortHistoryEntries(fallbackEntries);
    }
}

function saveHistoryCache() {
    try {
        const selectedVehicleId = getSelectedVehicleId();

        if (!selectedVehicleId) {
            return;
        }

        const historyState = getHistoryStorageState();

        historyState[selectedVehicleId] = historyEntries;
        writeHistoryStorageState(historyState);
    } catch (error) {
        console.error("Unable to save service history cache.", error);
    }
}

function getHistoryCollection() {
    return getHistoryCollectionForVehicle(getSelectedVehicleId());
}

function getHistoryCollectionForVehicle(vehicleId) {
    const vehicleDocument = getVehicleDocument(vehicleId);

    if (!vehicleDocument) {
        return null;
    }

    return vehicleDocument.collection("serviceHistory");
}

function getVehicleCollection() {
    const userDocument = getUserDocument();

    if (!userDocument) {
        return null;
    }

    return userDocument.collection("vehicles");
}

function getVehicleDocument(vehicleId) {
    const vehicleCollection = getVehicleCollection();

    if (!vehicleCollection || !vehicleId) {
        return null;
    }

    return vehicleCollection.doc(vehicleId);
}

function getUserDocument() {
    const firebaseState = window.carInfoFirebase;

    if (!firebaseState || !firebaseState.db || !currentUser) {
        return null;
    }

    return firebaseState.db.collection("users").doc(currentUser.uid);
}

function getLegacyProfileDocument() {
    const firebaseState = window.carInfoFirebase;

    if (!firebaseState || !firebaseState.db || !currentUser) {
        return null;
    }

    return firebaseState.db
        .collection("cars")
        .doc(FIREBASE_CAR_DOC_ID)
        .collection("profiles")
        .doc(currentUser.uid);
}

function getLegacyHistoryCollection(vehicleId) {
    const firebaseState = window.carInfoFirebase;

    if (!firebaseState || !firebaseState.db || !vehicleId) {
        return null;
    }

    return firebaseState.db
        .collection("cars")
        .doc(vehicleId)
        .collection("serviceHistory");
}

async function syncProfileWithFirebase(syncRevision = profileSyncRevision) {
    const userDocument = getUserDocument();
    const vehicleCollection = getVehicleCollection();

    if (!userDocument || !vehicleCollection || !currentUser) {
        return;
    }

    await ensureRemoteProfileData();

    if (syncRevision !== profileSyncRevision || !currentUser) {
        return;
    }

    let remoteProfileDocument = normalizeRemoteProfileDocument(null);
    let remoteVehicles = null;

    const applyRemoteProfileState = () => {
        if (!Array.isArray(remoteVehicles)) {
            return;
        }

        profileSettings = normalizeProfileSettings({
            vehicles: remoteVehicles,
            selectedVehicleId: remoteProfileDocument.selectedVehicleId,
            updatedAt: remoteProfileDocument.updatedAt,
        });
        saveProfileSettings();
        hasShownProfileSyncError = false;
        profileSyncMode = "firebase";
        refreshVehicleContext({ restartHistory: true });
    };

    const handleProfileSyncError = (error) => {
        console.error("Unable to sync profile settings from Firebase.", error);
        profileSyncMode = "error";
        renderProfileSummary();

        if (!hasShownProfileSyncError) {
            showToast(
                "Dane pojazdów działają z pamięci urządzenia. Synchronizacja z Firebase nie odpowiedziała.",
            );
            hasShownProfileSyncError = true;
        }
    };

    const userUnsubscribe = userDocument.onSnapshot((documentSnapshot) => {
        remoteProfileDocument = normalizeRemoteProfileDocument(
            documentSnapshot.exists ? documentSnapshot.data() : null,
        );
        applyRemoteProfileState();
    }, handleProfileSyncError);

    const vehicleUnsubscribe = vehicleCollection.onSnapshot((snapshot) => {
        remoteVehicles = snapshot.docs
            .map((documentSnapshot) =>
                normalizeVehicleProfile({
                    id: documentSnapshot.id,
                    ...documentSnapshot.data(),
                }),
            )
            .filter(Boolean);
        applyRemoteProfileState();
    }, handleProfileSyncError);

    profileUnsubscribe = () => {
        userUnsubscribe();
        vehicleUnsubscribe();
    };
}

function normalizeRemoteProfileDocument(profile) {
    const updatedAt = Number(profile?.updatedAt);

    return {
        selectedVehicleId:
            typeof profile?.selectedVehicleId === "string"
                ? profile.selectedVehicleId
                : "",
        updatedAt: Number.isFinite(updatedAt) ? updatedAt : 0,
    };
}

async function ensureRemoteProfileData() {
    const userDocument = getUserDocument();
    const vehicleCollection = getVehicleCollection();

    if (!userDocument || !vehicleCollection || !currentUser) {
        return false;
    }

    try {
        const [userSnapshot, vehiclePreviewSnapshot] = await Promise.all([
            userDocument.get(),
            vehicleCollection.limit(1).get(),
        ]);

        if (!vehiclePreviewSnapshot.empty) {
            if (!userSnapshot.exists) {
                await userDocument.set(
                    serializeProfileSettings(
                        createEmptyProfileSettings(),
                        vehiclePreviewSnapshot.docs[0].id,
                    ),
                    {
                        merge: true,
                    },
                );
            }

            return true;
        }

        const migrated = await migrateLegacyFirebaseData();

        if (migrated) {
            return true;
        }

        if (hasProfileContent(profileSettings)) {
            return await writeProfileSettingsToFirebase(profileSettings);
        }
    } catch (error) {
        console.error(
            "Unable to initialize Firebase vehicle structure.",
            error,
        );
    }

    return false;
}

async function persistProfileSettings(profile) {
    profileSettings = normalizeProfileSettings(profile);
    saveProfileSettings();
    refreshVehicleContext();

    const userDocument = getUserDocument();
    const vehicleCollection = getVehicleCollection();
    const firebaseState = window.carInfoFirebase;

    if (!userDocument || !vehicleCollection || !currentUser) {
        profileSyncMode =
            firebaseState && firebaseState.auth && firebaseState.db
                ? "guest"
                : "local";
        renderProfileSummary();
        return profileSyncMode;
    }

    profileSyncMode = "syncing";
    renderProfileSummary();

    const synced = await writeProfileSettingsToFirebase(profileSettings);

    if (synced) {
        hasShownProfileSyncError = false;
        profileSyncMode = "firebase";
        renderProfileSummary();
        return "firebase";
    }

    profileSyncMode = "error";
    renderProfileSummary();
    return "error";
}

async function writeProfileSettingsToFirebase(
    profile,
    { historyByVehicleId = null } = {},
) {
    const firebaseState = window.carInfoFirebase;
    const userDocument = getUserDocument();
    const vehicleCollection = getVehicleCollection();

    if (
        !firebaseState?.db ||
        !userDocument ||
        !vehicleCollection ||
        !currentUser
    ) {
        return false;
    }

    try {
        const normalizedProfile = normalizeProfileSettings(profile);
        const remoteVehicleSnapshot = await vehicleCollection.get();
        const nextVehicleIds = new Set(
            normalizedProfile.vehicles.map((vehicle) => vehicle.id),
        );
        const removedVehicleIds = remoteVehicleSnapshot.docs
            .map((documentSnapshot) => documentSnapshot.id)
            .filter((vehicleId) => !nextVehicleIds.has(vehicleId));

        for (const vehicleId of removedVehicleIds) {
            const deleted = await deleteVehicleFromFirebase(vehicleId);

            if (!deleted) {
                return false;
            }
        }

        const batch = firebaseState.db.batch();

        batch.set(userDocument, serializeProfileSettings(normalizedProfile), {
            merge: true,
        });

        normalizedProfile.vehicles.forEach((vehicle) => {
            const serializedVehicle = serializeVehicleProfileRecord(vehicle);

            if (!serializedVehicle) {
                return;
            }

            batch.set(vehicleCollection.doc(vehicle.id), serializedVehicle, {
                merge: true,
            });
        });

        await batch.commit();

        if (historyByVehicleId) {
            const historyWritten =
                await writeHistoryEntriesToFirebase(historyByVehicleId);

            if (!historyWritten) {
                return false;
            }
        }

        return true;
    } catch (error) {
        console.error("Unable to save profile settings to Firebase.", error);
        return false;
    }
}

async function migrateLegacyFirebaseData() {
    const legacyProfileDocument = getLegacyProfileDocument();

    if (!legacyProfileDocument || !currentUser) {
        return false;
    }

    try {
        const legacyProfileSnapshot = await legacyProfileDocument.get();

        if (!legacyProfileSnapshot.exists) {
            return false;
        }

        const legacyProfile = normalizeProfileSettings(
            legacyProfileSnapshot.data(),
        );

        if (!hasProfileContent(legacyProfile)) {
            return false;
        }

        const historyByVehicleId = await readLegacyHistoryEntries(
            legacyProfile.vehicles.map((vehicle) => vehicle.id),
        );

        return await writeProfileSettingsToFirebase(legacyProfile, {
            historyByVehicleId,
        });
    } catch (error) {
        console.error("Unable to migrate legacy Firebase vehicle data.", error);
        return false;
    }
}

async function readLegacyHistoryEntries(vehicleIds) {
    const historyByVehicleId = {};

    await Promise.all(
        vehicleIds.map(async (vehicleId) => {
            const legacyHistoryCollection =
                getLegacyHistoryCollection(vehicleId);

            if (!legacyHistoryCollection) {
                historyByVehicleId[vehicleId] = [];
                return;
            }

            try {
                const snapshot = await legacyHistoryCollection.get();

                historyByVehicleId[vehicleId] = snapshot.docs
                    .map((documentSnapshot) =>
                        normalizeHistoryEntry({
                            id: documentSnapshot.id,
                            ...documentSnapshot.data(),
                        }),
                    )
                    .filter(Boolean);
            } catch (error) {
                console.error(
                    `Unable to read legacy service history for vehicle ${vehicleId}.`,
                    error,
                );
                historyByVehicleId[vehicleId] = [];
            }
        }),
    );

    return historyByVehicleId;
}

async function writeHistoryEntriesToFirebase(historyByVehicleId) {
    const firebaseState = window.carInfoFirebase;

    if (!firebaseState?.db || !currentUser) {
        return false;
    }

    try {
        const batch = firebaseState.db.batch();
        let hasWrites = false;

        Object.entries(historyByVehicleId).forEach(([vehicleId, entries]) => {
            const historyCollection = getHistoryCollectionForVehicle(vehicleId);

            if (!historyCollection || !Array.isArray(entries)) {
                return;
            }

            entries.forEach((entry) => {
                const normalizedEntry = normalizeHistoryEntry(entry);

                if (!normalizedEntry) {
                    return;
                }

                batch.set(
                    historyCollection.doc(normalizedEntry.id),
                    serializeHistoryEntry(normalizedEntry),
                    {
                        merge: true,
                    },
                );
                hasWrites = true;
            });
        });

        if (!hasWrites) {
            return true;
        }

        await batch.commit();
        return true;
    } catch (error) {
        console.error(
            "Unable to write migrated service history to Firebase.",
            error,
        );
        return false;
    }
}

async function deleteVehicleFromFirebase(vehicleId) {
    const firebaseState = window.carInfoFirebase;
    const vehicleDocument = getVehicleDocument(vehicleId);
    const historyCollection = getHistoryCollectionForVehicle(vehicleId);

    if (!firebaseState?.db || !vehicleDocument || !historyCollection) {
        return false;
    }

    try {
        const historySnapshot = await historyCollection.get();
        const batch = firebaseState.db.batch();

        historySnapshot.docs.forEach((documentSnapshot) => {
            batch.delete(documentSnapshot.ref);
        });
        batch.delete(vehicleDocument);
        await batch.commit();
        return true;
    } catch (error) {
        console.error(`Unable to delete Firebase vehicle ${vehicleId}.`, error);
        return false;
    }
}

function syncHistoryWithFirebase() {
    const historyCollection = getHistoryCollection();
    const selectedVehicleId = getSelectedVehicleId();

    if (!historyCollection || !currentUser) {
        return;
    }

    historyUnsubscribe = historyCollection.onSnapshot(
        async (snapshot) => {
            if (snapshot.empty) {
                const alreadySeeded = isHistorySeeded(selectedVehicleId);

                if (!alreadySeeded && historyEntries.length) {
                    const seeded = await seedHistoryInFirebase(
                        historyCollection,
                        historyEntries,
                    );

                    if (seeded) {
                        markHistorySeeded(selectedVehicleId);
                    }

                    return;
                }

                historyEntries = [];
                saveHistoryCache();
                renderTimeline();
                renderHistoryPage();
                return;
            }

            markHistorySeeded(selectedVehicleId);

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
            console.error(
                "Unable to sync service history from Firebase.",
                error,
            );

            if (!hasShownHistorySyncError) {
                showToast(
                    error && error.code === "permission-denied"
                        ? "Brak dostępu do Firestore. Sprawdź reguły dla zalogowanego użytkownika."
                        : "Firebase niedostępny. Historia działa lokalnie.",
                );
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
            batch.set(
                historyCollection.doc(entry.id),
                serializeHistoryEntry(entry),
            );
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
    const selectedVehicleId = getSelectedVehicleId();

    if (!normalizedEntry) {
        return "local";
    }

    if (historyCollection && currentUser) {
        try {
            await historyCollection
                .doc(normalizedEntry.id)
                .set(serializeHistoryEntry(normalizedEntry));
            markHistorySeeded(selectedVehicleId);
            mergeHistoryEntry(normalizedEntry);
            saveHistoryCache();
            return "firebase";
        } catch (error) {
            console.error(
                "Unable to save service history entry to Firebase.",
                error,
            );
        }
    }

    mergeHistoryEntry(normalizedEntry);
    saveHistoryCache();
    return "local";
}

async function deleteHistoryEntry(entryId) {
    const historyCollection = getHistoryCollection();

    if (historyCollection && currentUser) {
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
        ownerUid: currentUser?.uid || null,
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

function createDefaultTodoList() {
    return appData.todos.map((item) => ({ ...item, completed: false }));
}

function normalizeTodoEntries(entries) {
    if (!Array.isArray(entries)) {
        return [];
    }

    return entries
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
}

function loadTodos() {
    try {
        const storedTodos = window.localStorage.getItem(TODO_STORAGE_KEY);

        if (!storedTodos) {
            return createDefaultTodoList();
        }

        const parsedTodos = JSON.parse(storedTodos);
        const normalizedTodos = normalizeTodoEntries(parsedTodos);

        return normalizedTodos.length
            ? normalizedTodos
            : createDefaultTodoList();
    } catch (error) {
        console.error("Unable to load todo list.", error);
        return createDefaultTodoList();
    }
}

function loadProfileSettings() {
    const defaultProfile = createEmptyProfileSettings();

    try {
        const storedProfile = readScopedStorageValue(
            getProfileStorageKey(),
            LEGACY_PROFILE_STORAGE_KEY,
        );

        if (!storedProfile) {
            return defaultProfile;
        }

        const parsedProfile = JSON.parse(storedProfile);

        if (!parsedProfile || typeof parsedProfile !== "object") {
            return defaultProfile;
        }

        return normalizeProfileSettings(parsedProfile);
    } catch (error) {
        console.error("Unable to load profile settings.", error);
        return defaultProfile;
    }
}

function saveProfileSettings() {
    try {
        window.localStorage.setItem(
            getProfileStorageKey(),
            JSON.stringify(normalizeProfileSettings(profileSettings)),
        );
    } catch (error) {
        console.error("Unable to save profile settings.", error);
    }
}

function saveTodos() {
    try {
        window.localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
        console.error("Unable to save todo list.", error);
    }
}

function createBackupSnapshot() {
    return {
        schemaVersion: BACKUP_SCHEMA_VERSION,
        exportedAt: new Date().toISOString(),
        storageScope: getCurrentStorageScope(),
        profile: normalizeProfileSettings(profileSettings),
        historyByVehicleId: normalizeHistoryStorageState(
            getHistoryStorageState(),
        ),
        todos: normalizeTodoEntries(todos),
    };
}

function downloadBackupSnapshot(snapshot) {
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
        type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");

    downloadLink.href = url;
    downloadLink.download = `car-info-backup-${getTodayIsoDate()}.json`;
    document.body.append(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    window.URL.revokeObjectURL(url);
}

function normalizeBackupSnapshot(snapshot) {
    if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot)) {
        return null;
    }

    if (!snapshot.profile || typeof snapshot.profile !== "object") {
        return null;
    }

    const normalizedProfile = normalizeProfileSettings(snapshot.profile);
    const vehicleIds = new Set(
        normalizedProfile.vehicles.map((vehicle) => vehicle.id),
    );

    return {
        profile: normalizedProfile,
        historyByVehicleId: normalizeHistoryStorageState(
            snapshot.historyByVehicleId,
            vehicleIds,
        ),
        todos: normalizeTodoEntries(snapshot.todos),
    };
}

async function importBackupFile(file) {
    setSettingsBackupBusy(true);
    let restartSyncAfterImport = false;

    try {
        const rawText = await file.text();
        const parsedBackup = JSON.parse(rawText);
        const importedBackup = normalizeBackupSnapshot(parsedBackup);

        if (!importedBackup) {
            showToast("Plik kopii danych ma nieprawidłowy format.");
            return;
        }

        if (
            !window.confirm(
                "Import zastąpi lokalne pojazdy, historię i listę zadań dla bieżącego profilu. Kontynuować?",
            )
        ) {
            return;
        }

        const shouldSyncToFirebase = Boolean(
            currentUser &&
            window.carInfoFirebase?.db &&
            window.carInfoFirebase?.auth,
        );

        if (shouldSyncToFirebase) {
            stopActiveSyncListeners();
            restartSyncAfterImport = true;
        }

        profileSettings = importedBackup.profile;
        todos = importedBackup.todos;
        saveProfileSettings();
        saveTodos();
        writeHistoryStorageState(importedBackup.historyByVehicleId);
        historyEntries = loadHistoryCache();

        renderTodos();
        refreshVehicleContext();

        if (shouldSyncToFirebase) {
            const synced = await syncCurrentStateToFirebase();

            showToast(
                synced === "firebase"
                    ? "Zaimportowano kopię i zsynchronizowano dane z Firebase."
                    : "Zaimportowano kopię lokalnie. Synchronizacja z Firebase nie odpowiedziała.",
            );
            return;
        }

        showToast("Zaimportowano kopię danych.");
    } catch (error) {
        console.error("Unable to import backup snapshot.", error);
        showToast("Nie udało się zaimportować kopii danych.");
    } finally {
        if (restartSyncAfterImport) {
            restartProfileSync();
            restartHistorySync();
        }

        setSettingsBackupBusy(false);
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

function getFirebaseAuthErrorMessage(error) {
    if (!error || typeof error.code !== "string") {
        return "Logowanie email/hasło nie powiodło się.";
    }

    if (error.code === "auth/operation-not-allowed") {
        return "Włącz Email/Password w Firebase Authentication.";
    }

    if (error.code === "auth/invalid-email") {
        return "Podaj poprawny adres email.";
    }

    if (error.code === "auth/missing-password") {
        return "Wpisz hasło.";
    }

    if (error.code === "auth/weak-password") {
        return "Hasło musi mieć co najmniej 6 znaków.";
    }

    if (error.code === "auth/email-already-in-use") {
        return "To konto już istnieje. Zaloguj się tym emailem.";
    }

    if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
    ) {
        return "Nieprawidłowy email lub hasło.";
    }

    if (error.code === "auth/too-many-requests") {
        return "Zbyt wiele prób logowania. Spróbuj ponownie później.";
    }

    return "Logowanie email/hasło nie powiodło się.";
}

function getAuthCredentials() {
    const email = normalizeText(authEmailInput?.value || "", 120).toLowerCase();
    const password = authPasswordInput?.value || "";

    if (!email) {
        showToast("Wpisz adres email.");
        authEmailInput?.focus();
        return null;
    }

    if (!password) {
        showToast("Wpisz hasło.");
        authPasswordInput?.focus();
        return null;
    }

    if (password.length < 6) {
        showToast("Hasło musi mieć co najmniej 6 znaków.");
        authPasswordInput?.focus();
        return null;
    }

    return { email, password };
}

function clearAuthPasswordField() {
    if (authPasswordInput) {
        authPasswordInput.value = "";
    }
}

function getCurrentStorageScope() {
    return currentUser?.uid ? `user:${currentUser.uid}` : "guest";
}

function getScopedStorageKey(prefix) {
    return `${prefix}:${getCurrentStorageScope()}`;
}

function getProfileStorageKey() {
    return getScopedStorageKey(PROFILE_STORAGE_PREFIX);
}

function getHistoryStorageKey() {
    return getScopedStorageKey(HISTORY_STORAGE_PREFIX);
}

function getHistorySeedStorageKey() {
    return getScopedStorageKey(HISTORY_FIREBASE_SEEDED_PREFIX);
}

function readScopedStorageValue(scopedKey, legacyKey) {
    const scopedValue = window.localStorage.getItem(scopedKey);

    if (scopedValue !== null) {
        return scopedValue;
    }

    if (!currentUser && legacyKey) {
        return window.localStorage.getItem(legacyKey);
    }

    return null;
}

function getHistoryStorageState() {
    try {
        const storedHistory = readScopedStorageValue(
            getHistoryStorageKey(),
            LEGACY_HISTORY_STORAGE_KEY,
        );

        if (!storedHistory) {
            return {};
        }

        const parsedHistory = JSON.parse(storedHistory);

        if (Array.isArray(parsedHistory)) {
            return {
                [FIREBASE_CAR_DOC_ID]: parsedHistory,
            };
        }

        return parsedHistory && typeof parsedHistory === "object"
            ? parsedHistory
            : {};
    } catch (error) {
        console.error("Unable to read service history storage state.", error);
        return {};
    }
}

function normalizeHistoryStorageState(historyState, allowedVehicleIds = null) {
    if (
        !historyState ||
        typeof historyState !== "object" ||
        Array.isArray(historyState)
    ) {
        return {};
    }

    const normalizedState = {};
    const allowedIds =
        allowedVehicleIds instanceof Set ? allowedVehicleIds : null;

    Object.entries(historyState).forEach(([vehicleId, entries]) => {
        const normalizedVehicleId = normalizeVehicleReferenceId(vehicleId);

        if (!normalizedVehicleId) {
            return;
        }

        if (allowedIds && !allowedIds.has(normalizedVehicleId)) {
            return;
        }

        if (!Array.isArray(entries)) {
            normalizedState[normalizedVehicleId] = [];
            return;
        }

        normalizedState[normalizedVehicleId] = sortHistoryEntries(
            entries
                .map((entry) => normalizeHistoryEntry(entry))
                .filter(Boolean),
        );
    });

    return normalizedState;
}

function writeHistoryStorageState(historyState) {
    try {
        window.localStorage.setItem(
            getHistoryStorageKey(),
            JSON.stringify(normalizeHistoryStorageState(historyState)),
        );
    } catch (error) {
        console.error("Unable to write service history storage state.", error);
    }
}

function getHistorySeedState() {
    try {
        const storedSeedState = readScopedStorageValue(
            getHistorySeedStorageKey(),
            LEGACY_HISTORY_FIREBASE_SEEDED_KEY,
        );

        if (!storedSeedState) {
            return {};
        }

        if (storedSeedState === "1") {
            return {
                [FIREBASE_CAR_DOC_ID]: true,
            };
        }

        const parsedSeedState = JSON.parse(storedSeedState);

        return parsedSeedState && typeof parsedSeedState === "object"
            ? parsedSeedState
            : {};
    } catch (error) {
        console.error("Unable to read Firebase seed state.", error);
        return {};
    }
}

function isHistorySeeded(vehicleId) {
    return Boolean(getHistorySeedState()[vehicleId]);
}

function markHistorySeeded(vehicleId) {
    if (!vehicleId) {
        return;
    }

    const seedState = getHistorySeedState();

    seedState[vehicleId] = true;
    window.localStorage.setItem(
        getHistorySeedStorageKey(),
        JSON.stringify(seedState),
    );
}

function createEmptyProfileSettings() {
    const defaultVehicles = shouldUseDemoData()
        ? [createDefaultVehicleProfile()]
        : [];

    return {
        vehicles: defaultVehicles,
        selectedVehicleId: defaultVehicles[0]?.id || "",
        updatedAt: 0,
    };
}

function normalizeProfileSettings(profile) {
    const emptyProfile = createEmptyProfileSettings();

    if (!profile || typeof profile !== "object") {
        return emptyProfile;
    }

    const updatedAt = Number(profile.updatedAt);
    const fallbackVehicles = emptyProfile.vehicles;
    const vehicles = Array.isArray(profile.vehicles)
        ? profile.vehicles
              .map((vehicle) => normalizeVehicleProfile(vehicle))
              .filter(Boolean)
        : fallbackVehicles;
    const normalizedVehicles = vehicles.length ? vehicles : fallbackVehicles;
    const selectedVehicleId =
        typeof profile.selectedVehicleId === "string" &&
        normalizedVehicles.some(
            (vehicle) => vehicle.id === profile.selectedVehicleId,
        )
            ? profile.selectedVehicleId
            : normalizedVehicles[0]?.id || "";

    return {
        vehicles: normalizedVehicles,
        selectedVehicleId,
        updatedAt: Number.isFinite(updatedAt) ? updatedAt : 0,
    };
}

function serializeProfileSettings(profile, selectedVehicleFallback = "") {
    const normalizedProfile = normalizeProfileSettings(profile);
    const selectedVehicleId =
        normalizedProfile.selectedVehicleId ||
        (typeof selectedVehicleFallback === "string"
            ? selectedVehicleFallback
            : "");

    return {
        selectedVehicleId,
        updatedAt: Date.now(),
        schemaVersion: 2,
    };
}

function serializeVehicleProfileRecord(vehicle) {
    const normalizedVehicle = normalizeVehicleProfile(vehicle);

    if (!normalizedVehicle) {
        return null;
    }

    const { id, ...vehicleData } = normalizedVehicle;

    return {
        ...vehicleData,
        updatedAt: Date.now(),
    };
}

function hasProfileContent(profile) {
    const normalizedProfile = normalizeProfileSettings(profile);

    return normalizedProfile.vehicles.length > 0;
}

function createDefaultVehicleProfile() {
    return {
        id: FIREBASE_CAR_DOC_ID,
        type: "Auto",
        name: appData.car.name,
        year: appData.car.year,
        engine: appData.car.engine,
        mileage: getDefaultVehicleMileage(),
        oilChangeMileage: 198500,
        oilChangeDate: "2023-10-12",
        oilChangeIntervalKm: DEFAULT_MAINTENANCE_INTERVALS.oil.mileage,
        oilChangeIntervalMonths: DEFAULT_MAINTENANCE_INTERVALS.oil.months,
        timingDriveMileage: 165000,
        timingDriveDate: "2023-01-22",
        timingDriveIntervalKm: DEFAULT_MAINTENANCE_INTERVALS.timing.mileage,
        timingDriveIntervalMonths: DEFAULT_MAINTENANCE_INTERVALS.timing.months,
    };
}

function getDefaultVehicleMileage() {
    return (
        Number(
            String(appData.statuses[0]?.mileage || "0").replace(/[^\d]/g, ""),
        ) || 0
    );
}

function shouldUseDemoData() {
    return !currentUser;
}

function createEmptyVehiclePlaceholder() {
    return {
        id: "",
        type: "Profil",
        name: "Dodaj pierwszy pojazd",
        year: "",
        engine: "Brak aktywnego pojazdu",
        mileage: 0,
        isPlaceholder: true,
    };
}

function normalizeVehicleProfile(vehicle) {
    if (!vehicle || typeof vehicle !== "object") {
        return null;
    }

    const oilInterval = getVehicleMaintenanceInterval(vehicle, "oil");
    const timingInterval = getVehicleMaintenanceInterval(vehicle, "timing");

    const type =
        normalizeText(vehicle.type || "Auto", 20) === "Motocykl"
            ? "Motocykl"
            : "Auto";
    const name = normalizeText(vehicle.name, 60);
    const year = normalizeText(vehicle.year, 4);
    const engine = normalizeText(vehicle.engine, 40);
    const mileage = Number(vehicle.mileage);
    const oilChangeMileage = Number(vehicle.oilChangeMileage);
    const timingDriveMileage = Number(vehicle.timingDriveMileage);
    const oilChangeDate = normalizeIsoDate(vehicle.oilChangeDate);
    const timingDriveDate = normalizeIsoDate(vehicle.timingDriveDate);

    if (!name) {
        return null;
    }

    return {
        id: sanitizeVehicleId(vehicle.id || createVehicleProfileId(name, year)),
        type,
        name,
        year,
        engine,
        mileage:
            Number.isFinite(mileage) && mileage >= 0 ? Math.round(mileage) : 0,
        oilChangeMileage:
            Number.isFinite(oilChangeMileage) && oilChangeMileage >= 0
                ? Math.round(oilChangeMileage)
                : null,
        oilChangeDate,
        oilChangeIntervalKm: oilInterval.mileage,
        oilChangeIntervalMonths: oilInterval.months,
        timingDriveMileage:
            Number.isFinite(timingDriveMileage) && timingDriveMileage >= 0
                ? Math.round(timingDriveMileage)
                : null,
        timingDriveDate,
        timingDriveIntervalKm: timingInterval.mileage,
        timingDriveIntervalMonths: timingInterval.months,
    };
}

function normalizeVehicleReferenceId(value) {
    return String(value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 64);
}

function sanitizeVehicleId(value) {
    const slug = normalizeVehicleReferenceId(value);

    if (slug) {
        return slug;
    }

    return `vehicle-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function createVehicleProfileId(name, year) {
    return sanitizeVehicleId(`${name}-${year || "vehicle"}`);
}

function ensureUniqueVehicleId(vehicles, baseId) {
    let candidateId = sanitizeVehicleId(baseId);
    let index = 2;

    while (vehicles.some((vehicle) => vehicle.id === candidateId)) {
        candidateId = `${baseId}-${index}`;
        index += 1;
    }

    return sanitizeVehicleId(candidateId);
}

function getProfileVehicles() {
    return Array.isArray(profileSettings?.vehicles) &&
        profileSettings.vehicles.length
        ? profileSettings.vehicles
        : createEmptyProfileSettings().vehicles;
}

function getSelectedVehicle() {
    const vehicles = getProfileVehicles();

    return (
        vehicles.find(
            (vehicle) => vehicle.id === profileSettings.selectedVehicleId,
        ) ||
        vehicles[0] ||
        createEmptyVehiclePlaceholder()
    );
}

function getSelectedVehicleId() {
    const selectedVehicle = getSelectedVehicle();

    return selectedVehicle.isPlaceholder ? "" : selectedVehicle.id;
}

function hasActiveVehicle() {
    return Boolean(getSelectedVehicleId());
}

function formatVehicleMeta(vehicle) {
    return [vehicle.type, vehicle.year, vehicle.engine || vehicle.name]
        .filter(Boolean)
        .join(" • ");
}

function formatVehicleServiceLine(label, mileage, date) {
    const parts = [];

    if (Number.isFinite(mileage)) {
        parts.push(`${formatMileage(mileage)} km`);
    }

    if (date) {
        parts.push(formatShortDate(date));
    }

    return parts.length
        ? `${label}: ${parts.join(" • ")}`
        : `${label}: brak danych`;
}

function readVehicleFormValues() {
    const type = normalizeText(vehicleTypeInput?.value || "Auto", 20) || "Auto";
    const name = normalizeText(vehicleNameInput?.value || "", 60);
    const year = normalizeText(vehicleYearInput?.value || "", 4);
    const engine = normalizeText(vehicleEngineInput?.value || "", 40);
    const mileage = Number(vehicleMileageInput?.value || 0);
    const oilChangeMileageRaw = vehicleOilMileageInput?.value || "";
    const oilChangeDate = normalizeIsoDate(vehicleOilDateInput?.value || "");
    const timingDriveMileageRaw = vehicleTimingMileageInput?.value || "";
    const timingDriveDate = normalizeIsoDate(
        vehicleTimingDateInput?.value || "",
    );
    const oilChangeMileage = Number(oilChangeMileageRaw);
    const timingDriveMileage = Number(timingDriveMileageRaw);

    if (!name) {
        showToast("Wpisz nazwę pojazdu.");
        vehicleNameInput?.focus();
        return null;
    }

    if (!year) {
        showToast("Wpisz rok pojazdu.");
        vehicleYearInput?.focus();
        return null;
    }

    if (!engine) {
        showToast("Wpisz silnik lub opis pojazdu.");
        vehicleEngineInput?.focus();
        return null;
    }

    if (!Number.isFinite(mileage) || mileage < 0) {
        showToast("Podaj prawidłowy przebieg pojazdu.");
        vehicleMileageInput?.focus();
        return null;
    }

    if (!oilChangeMileageRaw) {
        showToast("Podaj przebieg ostatniej wymiany oleju.");
        vehicleOilMileageInput?.focus();
        return null;
    }

    if (!oilChangeDate) {
        showToast("Podaj datę ostatniej wymiany oleju.");
        vehicleOilDateInput?.focus();
        return null;
    }

    if (!Number.isFinite(oilChangeMileage) || oilChangeMileage < 0) {
        showToast("Podaj prawidłowy przebieg dla wymiany oleju.");
        vehicleOilMileageInput?.focus();
        return null;
    }

    if (!timingDriveMileageRaw) {
        showToast("Podaj przebieg dla napędu rozrządu.");
        vehicleTimingMileageInput?.focus();
        return null;
    }

    if (!timingDriveDate) {
        showToast("Podaj datę wymiany napędu rozrządu.");
        vehicleTimingDateInput?.focus();
        return null;
    }

    if (!Number.isFinite(timingDriveMileage) || timingDriveMileage < 0) {
        showToast("Podaj prawidłowy przebieg dla napędu rozrządu.");
        vehicleTimingMileageInput?.focus();
        return null;
    }

    return {
        type: type === "Motocykl" ? "Motocykl" : "Auto",
        name,
        year,
        engine,
        mileage: Math.round(mileage),
        oilChangeMileage: oilChangeMileageRaw
            ? Math.round(oilChangeMileage)
            : null,
        oilChangeDate,
        timingDriveMileage: timingDriveMileageRaw
            ? Math.round(timingDriveMileage)
            : null,
        timingDriveDate,
    };
}

function getCountLabel(count, labels) {
    if (count === 1) {
        return `1 ${labels[0]}`;
    }

    const lastTwoDigits = count % 100;
    const lastDigit = count % 10;

    if (
        lastDigit >= 2 &&
        lastDigit <= 4 &&
        !(lastTwoDigits >= 12 && lastTwoDigits <= 14)
    ) {
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

function formatNumericDate(value) {
    const [year, month, day] = value.split("-").map(Number);

    return `${String(day).padStart(2, "0")}.${String(month).padStart(2, "0")}.${year}`;
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
            <span class="status-card__icon status-card__icon--image" aria-hidden="true">
                <img class="status-card__icon-image" src="assets/icons/status/engine-oil.png" alt="" />
            </span>
        `;
    }

    return `
        <span class="status-card__icon status-card__icon--image" aria-hidden="true">
            <img class="status-card__icon-image" src="assets/icons/status/timing-belt.png" alt="" />
        </span>
    `;
}

function init() {
    renderHeader();
    renderStatuses();
    renderTodos();
    renderTimeline();
    renderHistoryPage();
    renderProfileSummary();
    resetServiceEntryFormFields();
    syncEntrySheetCopy();
    updateAuthUi();
    setActiveView("dashboard");
    setupPlaceholderActions();
    setupAuthActions();
    setupFirebaseAuth();
    setupNavigation();
    setupMaintenanceActions();
    setupVehicleActions();
    setupSettingsActions();
    setupTodoActions();
    setupHistoryActions();
    setupServiceEntryActions();
}

init();
