export async function spellCheck(text) {
    if (text.length < 4 || !/[a-z]/i.test(text)) {
        return text;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 4000);

    try {
        const response = await fetch("https://api.languagetool.org/v2/check", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ text, language: "en-US" }),
            signal: controller.signal,
        });

        if (!response.ok) {
            return text;
        }

        const data = await response.json();
        const matches = Array.isArray(data.matches) ? [...data.matches].reverse() : [];
        let corrected = text;

        for (const match of matches) {
            const replacement = match?.replacements?.[0]?.value;
            if (typeof replacement !== "string") {
                continue;
            }

            corrected = `${corrected.slice(0, match.offset)}${replacement}${corrected.slice(
                match.offset + match.length,
            )}`;
        }

        if (corrected !== text && window.confirm(`Did you mean “${corrected}”?`)) {
            return corrected;
        }
    } catch {
        // Spelling assistance is optional; searches continue with the original text.
    } finally {
        window.clearTimeout(timeout);
    }

    return text;
}
