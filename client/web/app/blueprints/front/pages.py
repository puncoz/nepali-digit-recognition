import base64
import os
import re
import sys

import numpy as np
from flask_cors import cross_origin
from flask import render_template, request
from keras.preprocessing.image import load_img

from . import front

sys.path.append(os.path.abspath("./model"))
from model.load import load_model


@front.route('/')
def homepage():
    """
    Render the index page / homepage
    """

    return render_template('front/modules/home/index.html', title="Welcome")


@front.route('/predict', methods=['GET', 'POST'])
@cross_origin(origin='*')
def predict():
    """
    Predicting requested image
    """

    # get data from drawing canvas and save as image
    parse_image(request.get_data())

    # read parsed image back in 8-bit, black and white mode (L)
    # x = imread('output.png')
    # x = np.invert(x)
    # x = imresize(x, (128, 128))

    lenet, graph = load_model()

    test_img = load_img('output.png', target_size=(128, 128))
    test_img = np.array(test_img) / 255
    test_img = np.expand_dims(test_img, axis=0)
    prediction = lenet.predict(test_img)
    return np.array_str(np.argmax(prediction, axis=1))

    # reshape image data for use in neural network
    # x = x.reshape(1, 128, 128, 3)
    # with graph.as_default():
    #     out = lenet.predict(x)
    #     print(out)
    #     print(np.argmax(out, axis=1))
    #     response = np.array_str(np.argmax(out, axis=1))
    #     return response


def parse_image(img_data):
    # parse canvas bytes and save as output.png
    img_string = re.search(b'base64,(.*)', img_data).group(1)
    with open('output.png', 'wb') as output:
        output.write(base64.decodebytes(img_string))
