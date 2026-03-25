async function exportModel() {
    if (!model) {
        log("❌ Train or load model first!");
        return;
    }

    await model.save('downloads://my-model');
    log("📥 Model downloaded successfully!");
}