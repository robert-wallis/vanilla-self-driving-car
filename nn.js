class NeuralNetwork {
    constructor(neuronCounts) {
        this.layers = [];
        for (let i = 0; i < neuronCounts.length - 1; i++) {
            this.layers.push(new NNLayer(neuronCounts[i], neuronCounts[i + 1]));
        }
    }

    feedForward(givenInputs) {
        return this.layers.reduce(
            (outputs, layer) => layer.feedForward(outputs),
            givenInputs
        );
    }
}

class NNLayer {
    constructor(inputCount = 5, outputCount = 5) {
        this.inputs = new Float32Array(inputCount);
        this.outputs = new Float32Array(outputCount);
        this.biases = new Float32Array(outputCount);

        this.weights = [];
        for (let i = 0; i < inputCount; i++) {
            this.weights[i] = new Float32Array(outputCount);
        }
        NNLayer.#randomize(this);
    }

    static #randomize(layer) {
        for (let i = 0; i < layer.inputs.length; i++) {
            for (let o = 0; o < layer.outputs.length; o++) {
                layer.weights[i][o] = Math.random() * 2 - 1; // [-1.0, 1.0]
            }
        }
        layer.biases = layer.biases.map(_ => Math.random() * 2 - 1);
    }

    feedForward(givenInputs) {
        for (let i = 0; i < this.inputs.length; i++) {
            this.inputs[i] = givenInputs[i];
        }
        for (let o = 0; o < this.outputs.length; o++) {
            let sum = 0.0;
            for (let i = 0; i < this.inputs.length; i++) {
                sum += this.inputs[i] * this.weights[i][o];
            }
            // if the input is large enough, then activate the output
            this.outputs[o] = sum > this.biases[o] ? 1.0 : 0.0;
        }
        return this.outputs;
    }
}