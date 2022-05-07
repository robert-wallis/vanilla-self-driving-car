class NNVisualizer {
	constructor(nn) {
		this.nn = nn;
		this.nodeSize = 30;
	}

	update(ctx, rect) {
		this.drawInputLayers(ctx, {
			x: rect.x,
			y: rect.y,
			width: rect.width - this.nodeSize,
			height: rect.height,
		});
		this.drawOutputs(ctx, {
			x: rect.x + rect.width - this.nodeSize,
			y: rect.y,
			width: this.nodeSize,
			height: rect.height,
		});
	}

	drawInputLayers(ctx, rect) {
		const layerCount = this.nn.layers.length;
		const layerWidth = rect.width / layerCount;

		for (let i = 0; i < layerCount; i++) {
			const layer = this.nn.layers[i];
			const layerX = lerp(rect.x, rect.x + rect.width, i / layerCount);
			const layerRect = {
				x: layerX,
				y: rect.y,
				width: layerWidth,
				height: rect.height
			};
			this.drawInputLayer(ctx, layer, layerRect);
		}
	}

	drawInputLayer(ctx, layer, rect) {
		const radius = this.nodeSize * 0.5;

		for (let i = 0; i < layer.weights.length; i++) {
			for (let o = 0; o < layer.weights[i].length; o++) {
				const value = layer.weights[i][o];
				const xInput = rect.x + radius;
				const xBias = rect.x + rect.width - radius;
				const yInput = lerp(rect.y + radius, rect.y + rect.height - radius, i / (layer.inputs.length - 1));
				const yBias = lerp(rect.y + radius, rect.y + rect.height - radius, o / (layer.biases.length - 1));
				ctx.beginPath();
				ctx.moveTo(xInput, yInput);
				ctx.lineTo(xBias, yBias);
				ctx.lineWidth = 2;
				ctx.strokeStyle = oneOneToColor(value);
				ctx.stroke();
			}
		}

		for (let i = 0; i < layer.inputs.length; i++) {
			const input = layer.inputs[i];
			const x = rect.x + radius;
			const y = lerp(rect.y + radius, rect.y + rect.height - radius, i / (layer.inputs.length - 1));
			this.#drawNode(ctx, x, y, percentToColor(input), i, input.toFixed(2));
		}

		for (let i = 0; i < layer.biases.length; i++) {
			const bias = layer.biases[i];
			const x = rect.x + rect.width - radius;
			const y = lerp(rect.y + radius, rect.y + rect.height - radius, i / (layer.biases.length - 1));
			this.#drawNode(ctx, x, y, oneOneToColor(bias), i, bias.toFixed(2));
		}
	}

	drawOutputs(ctx, rect) {
		const radius = this.nodeSize * 0.5;
		const outputsLength = this.nn.outputs.length;
		for (let i = 0; i < outputsLength; i++) {
			const output = this.nn.outputs[i];
			const x = rect.x + rect.width - radius;
			const y = lerp(rect.y + radius, rect.y + rect.height - radius, i / (outputsLength - 1));
			this.#drawNode(ctx, x, y, percentToColor(output), this.nn.labels[i], output.toFixed(2));
		}
	}

	#drawNode(ctx, x, y, color, label, subscript) {
		const radius = this.nodeSize * 0.5;
		ctx.beginPath()
		ctx.arc(x, y, radius, 0, Math.PI * 2);
		ctx.fillStyle = color;
		ctx.fill();

		if (label != null) {
			ctx.fillStyle = 'black';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'alphabetic';
			const fontSize = this.nodeSize * 0.8;
			ctx.font = fontSize + 'px sans-serif';
			ctx.fillText(label, x, y + (fontSize * 0.3), this.nodeSize);
		}

		if (subscript != null) {
			// subscript value
			ctx.fillStyle = 'white';
			ctx.font = '10px sans-serif';
			ctx.fillText(subscript, x, y + this.nodeSize);
		}
	}
}

function oneOneToColor(value) {
	return percentToColor((value + 1.0) * 0.5);
}

function percentToColor(value) {
	const r = Math.floor((value) * 100);
	const g = 20;
	const b = Math.floor((1 - value) * 100);
	return 'rgb(' + r + '% ' + g + '% ' + b + '%)';
}