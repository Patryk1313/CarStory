const appData = {
    car: {
        name: "SEAT IBIZA",
        year: "2007",
        engine: "1.9 TDI"
    },
    statuses: [
        {
            kind: "oil",
            theme: "blue",
            label: "OLEJ SILNIKOWY",
            mileage: "208,223",
            unit: "k",
            nextMileage: "245k",
            progress: 78
        },
        {
            kind: "timing",
            theme: "orange",
            label: "PASEK ROZRZĄDU",
            mileage: "208,223",
            unit: "k",
            nextMileage: "500k",
            progress: 36
        }
    ],
    history: [
        {
            title: "Pełny serwis i wymiana oleju",
            meta: "12 Paź 2023 • 198,500 km",
            description: "Wymiana oleju silnikowego, filtra oleju, filtra kabinowego. Sprawdzenie klocków hamulcowych i płynów.",
            price: "1350 zł"
        },
        {
            title: "Wymiana klocków hamulcowych",
            meta: "05 Sie 2023 • 192,200 km",
            description: "",
            price: "740 zł"
        },
        {
            title: "Pasek rozrządu i pompa wody",
            meta: "22 Sty 2023 • 165,000 km",
            description: "Duży serwis. Wymiana zestawu paska rozrządu, pompy wody i pasków osprzętu.",
            price: "3400 zł"
        }
    ]
};

const carName = document.getElementById("car-name");
const carYear = document.getElementById("car-year");
const carEngine = document.getElementById("car-engine");
const statusGrid = document.getElementById("status-grid");
const timeline = document.getElementById("timeline");
const toast = document.getElementById("toast");

let toastTimeoutId = 0;

function renderHeader() {
    carName.textContent = appData.car.name;
    carYear.textContent = appData.car.year;
    carEngine.textContent = appData.car.engine;
    document.title = `${appData.car.name} - Car Info`;
}

function renderStatuses() {
    statusGrid.innerHTML = appData.statuses.map((item) => `
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
    `).join("");
}

function renderTimeline() {
    timeline.innerHTML = appData.history.map((entry) => `
        <li class="timeline-item">
            <div class="timeline-item__top">
                <h3 class="timeline-item__title">${entry.title}</h3>
                <span class="price-badge">${entry.price.replace(" ", "<br>")}</span>
            </div>
            <p class="timeline-item__meta">${entry.meta}</p>
            ${entry.description ? `<p class="timeline-item__description">${entry.description}</p>` : ""}
        </li>
    `).join("");
}

function showToast(message) {
    window.clearTimeout(toastTimeoutId);
    toast.textContent = message;
    toast.classList.add("toast--visible");

    toastTimeoutId = window.setTimeout(() => {
        toast.classList.remove("toast--visible");
    }, 2200);
}

function setupPlaceholderActions() {
    document.querySelectorAll("[data-placeholder]").forEach((button) => {
        button.addEventListener("click", () => {
            showToast(button.dataset.placeholder || "Ta sekcja jest w przygotowaniu");
        });
    });

    document.querySelectorAll(".nav-item").forEach((button) => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".nav-item").forEach((item) => {
                item.classList.remove("nav-item--active");
                item.removeAttribute("aria-current");
            });

            button.classList.add("nav-item--active");
            button.setAttribute("aria-current", "page");
        });
    });
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
    renderTimeline();
    setupPlaceholderActions();
}

init();