import tensorflow as tf
from keras.layers import Activation, Dense, Flatten, Dropout
from keras.layers.convolutional import Conv2D
from keras.layers.pooling import MaxPool2D
from keras.models import Sequential
from keras.optimizers import RMSprop


def lenet(width, height, channels, output):
    model = Sequential()

    model.add(Conv2D(filters=32, kernel_size=(5, 5), strides=(2, 2), input_shape=(width, height, channels)))
    model.add(Activation('relu'))
    model.add(Conv2D(filters=32, kernel_size=(5, 5), strides=(2, 2), input_shape=(width, height, channels)))
    model.add(Activation('relu'))

    model.add(MaxPool2D(pool_size=(2, 2)))

    model.add(Dropout(0.25))

    model.add(Conv2D(filters=64, kernel_size=(3, 3), strides=(2, 2)))
    model.add(Activation('relu'))
    model.add(Conv2D(filters=64, kernel_size=(3, 3), strides=(2, 2)))
    model.add(Activation('relu'))

    model.add(MaxPool2D(pool_size=(2, 2)))

    model.add(Dropout(0.25))

    model.add(Flatten())
    model.add(Dense(256))
    model.add(Activation('relu'))
    model.add(Dropout(0.25))
    model.add(Dense(output))
    model.add(Activation('softmax'))

    return model


def load_model():
    image_w, image_h = 128, 128
    model = lenet(image_w, image_h, 3, 10)

    # load weights into new model
    model.load_weights("./model/epochs-20-model-20180313.h5")

    # Define the optimizer
    optimizer = RMSprop(lr=0.001, rho=0.9, epsilon=1e-08, decay=0.0)
    # Compile the model
    model.compile(optimizer=optimizer, loss="categorical_crossentropy", metrics=["accuracy"])

    graph = tf.get_default_graph()

    return model, graph
