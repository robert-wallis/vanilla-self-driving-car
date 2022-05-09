function labelInputSave(name, value) {
	let label = document.getElementById(name + "Label")
	if (label) {
		label.innerHTML = value;
	}
	let input = document.getElementById(name + "Input")
	if (input.type === 'checkbox') {
		input.checked = value;
	} else {
		if (input.value !== value) {
			input.value = value;
		}
	}
	localStorage.setItem(name, value);
}

function labelInputLoad(name, defaultValue) {
	let value = localStorage.getItem(name);
	if (value === null) {
		value = defaultValue;
	} else {
		value = JSON.parse(value);
	}
	let label = document.getElementById(name + "Label")
	if (label) {
		label.innerHTML = value;
	}
	let input = document.getElementById(name + "Input")
	if (input.type === 'checkbox') {
		input.checked = value;
	} else {
		if (input.value !== value) {
			input.value = value;
		}
	}
	return value;
}