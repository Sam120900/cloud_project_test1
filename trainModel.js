const tf = require("@tensorflow/tfjs");

async function trainModel(data) {
  // Assume data is an array of objects with numeric properties
  // Convert data to tensors
  const xs = data.map((item) => [
    item.dimension1,
    item.dimension2,
    item.dimension3,
    item.dimension4,
  ]);
  const ys = data.map((item) => item.target); // Assume there's a target property for the label

  const inputTensor = tf.tensor2d(xs);
  const labelTensor = tf.tensor2d(ys, [ys.length, 1]);

  // Create a simple linear regression model
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [4] }));

  // Prepare the model for training
  model.compile({
    optimizer: tf.train.sgd(0.1), // Learning rate
    loss: tf.losses.meanSquaredError,
  });

  // Train the model
  await model.fit(inputTensor, labelTensor, {
    epochs: 10, // Number of training epochs
  });

  return model;
}

module.exports = trainModel;
