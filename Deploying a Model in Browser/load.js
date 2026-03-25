async function loadModel() {
    showLoader(true);
    log("Loading model...");

    try {
        model = await tf.loadLayersModel('localstorage://my-model');

        const pred = model.predict(tf.tensor2d([5],[1,1]));
        const val = await pred.data();

        showLoader(false);
        log("🔄 Loaded Prediction: " + val[0].toFixed(2));

    } catch {
        showLoader(false);
        log("❌ No model found. Train first.");
    }
}