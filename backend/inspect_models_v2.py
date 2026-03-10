import tensorflow as tf
def inspect(name, path):
    model = tf.keras.models.load_model(path)
    print(f"--- {name} ---")
    print(f"Input Shape: {model.input_shape}")
    for layer in model.layers:
        if "rescaling" in layer.name.lower():
            print(f"Found Rescaling layer: {layer.name}, scale: {layer.scale}, offset: {layer.offset}")

inspect("Satellite", "models/sat_model.keras")
inspect("Street", "models/street_model.keras")
