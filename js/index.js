// import styles to convert to css by webpack
import "../scss/index.scss";
// import data
import data from "./data";
// Initialize page
let currentPage = 1;
// Count pages of data
let countOfPages = data.length / 10;
// Get current data from all data
let currentData = data.slice(currentPage - 1, currentPage * 10);

// Get table
const table = document.querySelector(".table__body");
// Get edit
const edit = document.querySelector(".edit");
// Get edit inputs
const firstNameEditInput = document.querySelector(".edit-firstName__input");
const lastNameEditInput = document.querySelector(".edit-lastName__input");
const aboutEditInput = document.querySelector(".edit-about__input");
const eyeColorEditInput = document.querySelector(".edit-eyeColor__input");
// Get list of pages
const listOfPages = document.querySelector(".page-list");
// Get visibility switchers
const firstNameSwitcher = document.querySelector(".switcher__firstName");
const lastNameSwitcher = document.querySelector(".switcher__lastName");
const aboutSwitcher = document.querySelector(".switcher__about");
const eyeColorSwitcher = document.querySelector(".switcher__eyeColor");

// Create table column from input text & className of this column
const createTableColumn = (innerText, className) => {
    const column = document.createElement("td");
    column.classList.add("table__column");
    column.classList.add(className);
    column.innerText = innerText;
    return column;
};

// Mount event listener on cross on alert
const mountCrossListener = () => {
    const cross = document.querySelector(".alert__cross");
    cross.addEventListener("click", (event) => {
        // when click on cross hide element
        event.target.parentNode.classList.toggle("hidden");
    });
};

// Create table row from all params of this row
const createTableRow = ({ id, firstName, lastName, about, eyeColor }) => {
    const tableRow = document.createElement("tr");
    tableRow.classList.add("table__row");
    tableRow.appendChild(
        createTableColumn(firstName, "table__column_firstName")
    );
    tableRow.appendChild(createTableColumn(lastName, "table__column_lastName"));
    tableRow.appendChild(createTableColumn(about, "table__column_about"));
    tableRow.appendChild(createTableColumn(eyeColor, "table__column_eyeColor"));
    return tableRow;
};

// Function that colorize eye column and delete text from there
const colorizeEyeColorColumn = () => {
    const rows = document.querySelectorAll(".table__column_eyeColor");
    // get all rows and for each change styles
    rows.forEach((row) => {
        row.style.background = row.innerText;
        row.dataset.color = row.innerText;
        row.innerHTML = "";
    });
};

// Function that init table
const initTable = (currentData, table) => {
    currentData.map(
        ({ id, name: { firstName, lastName }, about, eyeColor }) => {
            table.appendChild(
                createTableRow({ id, firstName, lastName, about, eyeColor })
            );
        }
    );
};

// Function that sorts column, with Buble sort algo
// if you want to sort by numbers or smth like that just change the predicate
function sortColumn(columnName, isAscending) {
    let rows = document.querySelectorAll(".table__row");
    for (let i = 0; i < rows.length; ++i) {
        for (let j = 0; j < rows.length - i - 1; ++j) {
            // get two elements j and j + 1
            const col1 = rows[j].querySelector(`.table__column_${columnName}`);
            const col2 = rows[j + 1].querySelector(
                `.table__column_${columnName}`
            );
            // create predicate: 1) check if we need to sort by asceding and if this is eyeColor column we need to compare values from dataset convert it to lower case and then compare first letter
            //                   2) check if we need to sort by asceding and in other way compare text content values convert it to lower case and then compare first letter
            const predicate =
                columnName === "eyeColor"
                    ? !isAscending
                        ? col1.dataset.color.toLowerCase()[0] >=
                          col2.dataset.color.toLowerCase()[0]
                        : col1.dataset.color.toLowerCase()[0] <=
                          col2.dataset.color.toLowerCase()[0]
                    : !isAscending
                    ? col1.textContent.toLowerCase()[0] >=
                      col2.textContent.toLowerCase()[0]
                    : col1.textContent.toLowerCase()[0] <=
                      col2.textContent.toLowerCase()[0];
            // if predicate is true change j row  with j + 1 row in places
            if (predicate) {
                rows[j].parentNode.insertBefore(rows[j + 1], rows[j]);
                rows = document.querySelectorAll(".table__row");
            }
        }
    }
}

// Function that mount sort listeners to headers of columns
const mountSortListener = (element, name) => {
    element.addEventListener("click", () => {
        // check if we need to sort asceding
        const isAscending = element.classList.contains("ascending");
        // sort
        sortColumn(name, isAscending);
        // toggle to sort in other way
        element.classList.toggle("ascending");
    });
};

// Mounting to all columns
const tableHeaderFirstName = document.querySelector(".table__header_firstName");
mountSortListener(tableHeaderFirstName, "firstName");

const tableHeaderLastName = document.querySelector(".table__header_lastName");
mountSortListener(tableHeaderLastName, "lastName");

const tableHeaderAbout = document.querySelector(".table__header_about");
mountSortListener(tableHeaderAbout, "about");

const tableHeaderEyeColor = document.querySelector(".table__header_eyeColor");
mountSortListener(tableHeaderEyeColor, "eyeColor");

// Function that mount all rows to catch click on it to edit
const mountRowsToEdit = () => {
    const rows = document.querySelectorAll(".table__row");
    rows.forEach((row) => {
        row.addEventListener("click", (event) => {
            const currentNode = event.target.parentNode;
            // clear active from all other rows
            rows.forEach((row) =>
                currentNode !== row ? row.classList.remove("active") : null
            );
            // chose this one
            currentNode.classList.toggle("active");
            // get styles to edit to make it visible
            edit.style.visibility = currentNode.classList.contains("active")
                ? "visible"
                : "hidden";
            edit.style.opacity = currentNode.classList.contains("active")
                ? "1"
                : "0";
            // push it to place where rows placed
            edit.style.top =
                currentNode.getBoundingClientRect().top +
                window.pageYOffset +
                "px";
            // mount values
            firstNameEditInput.value = currentNode.querySelector(
                ".table__column_firstName"
            ).innerText;
            lastNameEditInput.value = currentNode.querySelector(
                ".table__column_lastName"
            ).innerText;
            aboutEditInput.value = currentNode.querySelector(
                ".table__column_about"
            ).innerText;
            eyeColorEditInput.value = currentNode.querySelector(
                ".table__column_eyeColor"
            ).innerText;
        });
    });
};

// Function that mount all inputs to change input event
const mountChangeFormListener = (element, name) => {
    element.addEventListener("input", (event) => {
        const currentRow = document
            .querySelector(".active")
            .querySelector(`.table__column_${name}`);
        currentRow.innerText = event.target.value;
    });
};

const changeData = (
    table,
    tableHeaderFirstName,
    tableHeaderLastName,
    tableHeaderAbout,
    tableHeaderEyeColor,
    currentData
) => {
    // clear table
    table.innerHTML = "";
    // push new data to table
    currentData.map(
        ({ id, name: { firstName, lastName }, about, eyeColor }) => {
            table.appendChild(
                createTableRow({
                    id,
                    firstName,
                    lastName,
                    about,
                    eyeColor,
                })
            );
        }
    );
    // again colorize columns
    colorizeEyeColorColumn();
    // again mount rows to edit
    mountRowsToEdit();
    // make table headers visible
    tableHeaderFirstName.classList.remove("hidden");
    tableHeaderLastName.classList.remove("hidden");
    tableHeaderAbout.classList.remove("hidden");
    tableHeaderEyeColor.classList.remove("hidden");
};
// Make array with pagination, then create there <li> elements and mount on this elements event listeners that change data when they clicked
const makePagination = (countOfPages) => {
    Array(countOfPages)
        .fill(0)
        .map((item, index) => {
            const listItem = document.createElement("li");
            listItem.classList.add("page-list__item");
            listItem.innerText = index + 1;
            listItem.addEventListener("click", (event) => {
                document
                    .querySelectorAll(".pageActive")
                    .forEach((item) => item.classList.remove("pageActive"));
                event.target.classList.toggle("pageActive");
                const newData = data.slice(
                    (event.target.innerText - 1) * 10,
                    event.target.innerText * 10
                );
                changeData(
                    table,
                    tableHeaderFirstName,
                    tableHeaderLastName,
                    tableHeaderAbout,
                    tableHeaderEyeColor,
                    newData
                );
            });
            return listItem;
        })
        .map((item) => listOfPages.appendChild(item));
};

// Function that mount column visibility listeners
const mountColumnVisibilityListener = (element, name) => {
    element.addEventListener("click", (event) => {
        const rows = document.querySelectorAll(`.table__column_${name}`);
        document
            .querySelector(`.table__header_${name}`)
            .classList.toggle("hidden");
        rows.forEach((item) => item.classList.toggle("hidden"));
    });
};

const initApp = () => {
    initTable(currentData, table);
    mountCrossListener();
    colorizeEyeColorColumn();
    mountRowsToEdit();
    mountChangeFormListener(firstNameEditInput, "firstName");
    mountChangeFormListener(lastNameEditInput, "lastName");
    mountChangeFormListener(aboutEditInput, "about");
    mountChangeFormListener(eyeColorEditInput, "eyeColor");
    makePagination(countOfPages);
    mountColumnVisibilityListener(firstNameSwitcher, "firstName");
    mountColumnVisibilityListener(lastNameSwitcher, "lastName");
    mountColumnVisibilityListener(aboutSwitcher, "about");
    mountColumnVisibilityListener(eyeColorSwitcher, "eyeColor");
};

initApp();
