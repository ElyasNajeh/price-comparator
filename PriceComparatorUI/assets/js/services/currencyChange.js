export async function getExchangeRate(from, to) {
    if (from === to) {
        return 1;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 6000);

    try {
        const response = await fetch(
            `https://api.frankfurter.dev/v2/rate/${encodeURIComponent(from)}/${encodeURIComponent(to)}`,
            { signal: controller.signal },
        );

        if (!response.ok) {
            throw new Error("Currency conversion is currently unavailable.");
        }

        const data = await response.json();
        const rate = Number(data.rate);
        if (!Number.isFinite(rate) || rate <= 0) {
            throw new Error("The currency service returned an invalid rate.");
        }

        return rate;
    } finally {
        window.clearTimeout(timeout);
    }
}
