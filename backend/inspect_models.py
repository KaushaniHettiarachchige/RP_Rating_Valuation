import tensorflow as tf
sat_model = tf.keras.models.load_model("models/sat_model.keras")
print("Satellite Model Input Shape:", sat_model.input_shape)
st_model = tf.keras.models.load_model("models/street_model.keras")
print("Street Model Input Shape:", st_model.input_shape)
