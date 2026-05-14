export function renderEmptyState(message) {

    const resultsGrid = document.getElementById("resultsGrid");


    resultsGrid.innerHTML = `

        <div class="empty-state">

            <h3>

                ${message}

            </h3>

        </div>

    `;
}