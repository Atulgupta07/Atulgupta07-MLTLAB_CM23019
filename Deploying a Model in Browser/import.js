async function importModel() {
    const files = document.getElementById('upload').files;

    if (files.length < 2) {
        log("❌ Please upload model.json & weights.bin");
        return;
    }

    showLoader(true);
    log("Importing model...");

    model = await tf.loadLayersModel(
        tf.io.browserFiles([files[0], files[1]])
    );

    const pred = model.predict(tf.tensor2d([5],[1,1]));
    const val = await pred.data();

    showLoader(false);
    log("📤 Imported Prediction: " + val[0].toFixed(2));
}