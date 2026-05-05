const formEl = document.getElementById("ask-form");
const inputEl = document.getElementById("input-text");
const submitBtnEl = document.getElementById("submit-btn");
const statusEl = document.getElementById("status");
const resultSectionEl = document.getElementById("result-section");
const resultWithoutEl = document.getElementById("result-without");
const resultWithEl = document.getElementById("result-with");

function toDisplayText(payload) {
	if (typeof payload === "string") {
		return payload;
	}

	if (payload && typeof payload === "object") {
		if (typeof payload.text === "string") {
			return payload.text;
		}

		if (typeof payload.response === "string") {
			return payload.response;
		}

		return JSON.stringify(payload, null, 2);
	}

	return String(payload ?? "");
}

formEl.addEventListener("submit", async (event) => {
	event.preventDefault();

	const text = inputEl.value.trim();
	if (!text) {
		statusEl.textContent = "Please enter some text.";
		resultSectionEl.hidden = true;
		return;
	}

	statusEl.textContent = "Submitting...";
	submitBtnEl.disabled = true;
	resultSectionEl.hidden = true;

	try {
		const encodedText = encodeURIComponent(text);
		const [withoutResponse, withResponse] = await Promise.all([
			fetch(`/ask_without?text=${encodedText}`),
			fetch(`/ask_with?text=${encodedText}`),
		]);

		if (!withoutResponse.ok) {
			throw new Error(`ask_without failed with status ${withoutResponse.status}`);
		}

		if (!withResponse.ok) {
			throw new Error(`ask_with failed with status ${withResponse.status}`);
		}

		const withoutToolPayload = await withoutResponse.json();
		const withToolPayload = await withResponse.json();
		const withoutToolText = toDisplayText(withoutToolPayload);
		const withToolText = toDisplayText(withToolPayload);

		resultWithoutEl.textContent = withoutToolText;
		resultWithEl.textContent = withToolText;
		resultSectionEl.hidden = false;
		statusEl.textContent = "";
	} catch (error) {
		statusEl.textContent = `Unable to get response: ${error.message}`;
		resultSectionEl.hidden = true;
	} finally {
		submitBtnEl.disabled = false;
	}
});
