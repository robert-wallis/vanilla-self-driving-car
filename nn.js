class NeuralNetwork {
    constructor(neuronCounts) {
        this.layers = [];
        for (let i = 0; i < neuronCounts.length - 1; i++) {
            const inputCount = neuronCounts[i];
            let outputCount = neuronCounts[i + 1];
            if (typeof outputCount !== 'number') {
                outputCount = outputCount.length;
            }
            this.layers.push(new NNLayer(inputCount, outputCount));
        }

        let outputCount = neuronCounts[neuronCounts.length - 1];
        if (typeof outputCount !== 'number') {
            this.labels = outputCount;
            outputCount = outputCount.length;
        } else {
            this.labels = new Array(outputCount);
        }
        this.outputs = new Float32Array(outputCount);
    }

    feedForward(givenInputs) {
        this.outputs = this.layers.reduce(
            (outputs, layer) => layer.feedForward(outputs),
            givenInputs
        );
        return this.outputs;
    }
}

class NNLayer {
    constructor(inputCount, outputCount) {
        this.inputs = new Float32Array(inputCount);
        this.biases = new Float32Array(outputCount);

        this.weights = [];
        for (let i = 0; i < inputCount; i++) {
            this.weights[i] = new Float32Array(outputCount);
        }
        NNLayer.#randomize(this);
    }

    static #randomize(layer) {
        for (let i = 0; i < layer.inputs.length; i++) {
            for (let o = 0; o < layer.biases.length; o++) {
                layer.weights[i][o] = Math.random() * 2 - 1; // [-1.0, 1.0]
            }
        }
        layer.biases = layer.biases.map(_ => Math.random() * 2 - 1);
    }

    feedForward(givenInputs) {
        let outputs = new Float32Array(this.biases.length);
        for (let i = 0; i < this.inputs.length; i++) {
            this.inputs[i] = givenInputs[i];
        }
        for (let o = 0; o < this.biases.length; o++) {
            let sum = 0.0;
            for (let i = 0; i < this.inputs.length; i++) {
                sum += this.inputs[i] * this.weights[i][o];
            }
            // if the input is large enough, then activate the output
            outputs[o] = sum > this.biases[o] ? 1.0 : 0.0;
        }
        return outputs;
    }
}