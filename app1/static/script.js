const formEl = document.getElementById("classify-form");
const inputEl = document.getElementById("input-text");
const submitBtnEl = document.getElementById("submit-btn");
const statusEl = document.getElementById("status");
const resultSectionEl = document.getElementById("result-section");
const resultEl = document.getElementById("result");

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
		const response = await fetch(`/classify?text=${encodeURIComponent(text)}`);
		if (!response.ok) {
			throw new Error(`Request failed with status ${response.status}`);
		}

		const modelResponse = await response.json();
		resultEl.textContent = modelResponse;
		resultSectionEl.hidden = false;
		statusEl.textContent = "";
	} catch (error) {
		statusEl.textContent = `Unable to get response: ${error.message}`;
		resultSectionEl.hidden = true;
	} finally {
		submitBtnEl.disabled = false;
	}
});
