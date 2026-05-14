export function renderEmptyState() {

    const resultsGrid = document.getElementById("resultsGrid");


    resultsGrid.innerHTML = `

        <div class="empty-state">

            <h3>

                Start Searching

            </h3>

            <p>

                Search for any product to compare prices
                across different stores.

            </p>

        </div>

    `;
}