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

    static feedForward(layer, givenInputs) {
        for (let i = 0; i < layer.inputs.length; i++) {
            layer.inputs[i] = givenInputs[i];
        }
        for (let o = 0; o < layer.outputs.length; o++) {
            let sum = 0.0;
            for (let i = 0; i < layer.inputs.length; i++) {
                sum += layer.inputs[i] * layer.weight[i][o];
            }
            // if the input is large enough, then activate the output
            layer.outputs[o] = sum > layer.biases[o] ? 1.0 : 0.0;
        }
        return layer.outputs;
    }
}