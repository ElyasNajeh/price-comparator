export function renderLoading() {

    const resultsGrid = document.getElementById("resultsGrid");


    resultsGrid.innerHTML = `

        <div class="loading-state">

            <div class="spinner"></div>

            <p>

                Searching products...

            </p>

        </div>

    `;
}