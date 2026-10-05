export function renderLoading() {
    const resultsGrid = document.getElementById("resultsGrid");
    const loadingState = document.createElement("div");
    loadingState.className = "loading-state";
    loadingState.setAttribute("role", "status");

    const spinner = document.createElement("span");
    spinner.className = "spinner";
    spinner.setAttribute("aria-hidden", "true");

    const message = document.createElement("p");
    message.textContent = "Checking available stores…";

    loadingState.append(spinner, message);
    resultsGrid.replaceChildren(loadingState);
}
