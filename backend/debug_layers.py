import tensorflow as tf
model = tf.keras.models.load_model("models/sat_model.keras")
for layer in model.layers:
    print(layer.__class__.__name__, layer.name)
    if "Rescaling" in layer.__class__.__name__:
        print(f"  scale: {layer.scale}, offset: {layer.offset}")
