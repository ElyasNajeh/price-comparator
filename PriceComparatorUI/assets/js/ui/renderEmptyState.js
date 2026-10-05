export function renderEmptyState(
    title = "Start with a product search",
    message = "Results from available stores will appear here.",
    variant = "default",
) {
    const resultsGrid = document.getElementById("resultsGrid");
    const state = document.createElement("div");
    state.className = `empty-state empty-state--${variant}`;

    const icon = document.createElement("span");
    icon.className = "empty-state-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = variant === "error" ? "!" : "⌕";

    const heading = document.createElement("h3");
    heading.textContent = title;

    const description = document.createElement("p");
    description.textContent = message;

    state.append(icon, heading, description);
    resultsGrid.replaceChildren(state);
}
