import React, { useState, useRef } from "react";
import * as tf from "@tensorflow/tfjs";

const ModelPredictor = () => {
	const [prediction, setPrediction] = useState("");
	const imageRef = useRef();

	const loadModelAndPredict = async () => {
		const model = await tf.loadLayersModel("/model/model.json");

		// Preprocess the image
		const tensor = tf.browser
			.fromPixels(imageRef.current)
			.resizeNearestNeighbor([224, 224]) // or 96x96 depending on your training
			.toFloat()
			.expandDims();

		// Predict
		const predictions = model.predict(tensor);
		predictions.array().then((result) => {
			console.log(result);
			const predictedIndex = result[0].indexOf(Math.max(...result[0]));
			const labels = [
				"Tshirt",
				"dress",
				"hoodie",
				"jackets",
				"jeans",
				"kurta",
				"saree",
				"shirt",
				"shorts",
				"skirt",
			];
			setPrediction(labels[predictedIndex]);
		});
	};

	return (
		<div>
			<input
				type="file"
				accept="image/*"
				onChange={(e) => {
					const file = e.target.files[0];
					const reader = new FileReader();
					reader.onload = () => {
						const img = new Image();
						img.src = reader.result;
						img.onload = () => {
							imageRef.current.src = reader.result;
						};
					};
					reader.readAsDataURL(file);
				}}
			/>
			<img ref={imageRef} alt="" style={{ display: "none" }} />
			<button onClick={loadModelAndPredict}>Predict</button>
			<h3>Prediction: {prediction}</h3>
		</div>
	);
};

export default ModelPredictor;
