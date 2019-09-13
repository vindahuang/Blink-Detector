import cv2
import dlib
import tensorflow as tf
import numpy as np
import os
# from keras.models import load_model
from scipy.spatial import distance as dist
from imutils import face_utils
from flask import Flask, jsonify, request
import imageio

UPLOAD_FOLDER = 'path(?)'

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024

predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")
face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_alt.xml')

def detect(img, cascade = face_cascade , minimumFeatureSize=(20, 20)):
	if cascade.empty():
		raise (Exception("There was a problem loading your Haar Cascade xml file."))
	rects = cascade.detectMultiScale(img, scaleFactor=1.3, minNeighbors=1, minSize=minimumFeatureSize)
	
	if len(rects) == 0:
		return []

	rects[:, 2:] += rects[:, :2]

	return rects

def cropEyes(frame):
	
	gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
	
	te = detect(gray, minimumFeatureSize=(80, 80))

	if len(te) == 0:
		return None
	elif len(te) > 1:
		face = te[0]
	elif len(te) == 1:
		[face] = te

	face_rect = dlib.rectangle(left = int(face[0]), top = int(face[1]),
								right = int(face[2]), bottom = int(face[3]))
	
	shape = predictor(gray, face_rect)
	shape = face_utils.shape_to_np(shape)

	(rStart, rEnd) = face_utils.FACIAL_LANDMARKS_IDXS["left_eye"]
	(lStart, lEnd) = face_utils.FACIAL_LANDMARKS_IDXS["right_eye"]

	leftEye = shape[lStart:lEnd]
	rightEye = shape[rStart:rEnd]

	l_uppery = min(leftEye[1:3,1])
	l_lowy = max(leftEye[4:,1])
	l_dify = abs(l_uppery - l_lowy)

	lw = (leftEye[3][0] - leftEye[0][0])

	minxl = (leftEye[0][0] - ((34-lw)/2))
	maxxl = (leftEye[3][0] + ((34-lw)/2)) 
	minyl = (l_uppery - ((26-l_dify)/2))
	maxyl = (l_lowy + ((26-l_dify)/2))
	
	left_eye_rect = np.rint([minxl, minyl, maxxl, maxyl])
	left_eye_rect = left_eye_rect.astype(int)
	left_eye_image = gray[(left_eye_rect[1]):left_eye_rect[3], (left_eye_rect[0]):left_eye_rect[2]]
	
	r_uppery = min(rightEye[1:3,1])
	r_lowy = max(rightEye[4:,1])
	r_dify = abs(r_uppery - r_lowy)
	rw = (rightEye[3][0] - rightEye[0][0])
	minxr = (rightEye[0][0]-((34-rw)/2))
	maxxr = (rightEye[3][0] + ((34-rw)/2))
	minyr = (r_uppery - ((26-r_dify)/2))
	maxyr = (r_lowy + ((26-r_dify)/2))
	right_eye_rect = np.rint([minxr, minyr, maxxr, maxyr])
	right_eye_rect = right_eye_rect.astype(int)
	right_eye_image = gray[right_eye_rect[1]:right_eye_rect[3], right_eye_rect[0]:right_eye_rect[2]]

	if 0 in left_eye_image.shape or 0 in right_eye_image.shape:
		return None
	left_eye_image = cv2.resize(left_eye_image, (34, 26))
	right_eye_image = cv2.resize(right_eye_image, (34, 26))
	right_eye_image = cv2.flip(right_eye_image, 1)
	return left_eye_image, right_eye_image 

def cnnPreprocess(img):
	img = img.astype('float32')
	img /= 255
	img = np.expand_dims(img, axis=2)
	img = np.expand_dims(img, axis=0)
	return img

@app.route('/', methods=['POST'])
def jalan() :
	print("Filename: ", request.files["image"].filename)
	image = request.files["image"]
	image.save(image.filename)
	img = cv2.imread(image.filename)
	cv2.imshow('gambar',image)
	cv2.waitKey(0)
	os.remove(os.path.join(os.getcwd(), image.filename))
	# video = request.files["video"]
	# video.save(video.filename)
	# camera = cv2.VideoCapture(video.filename)
	# # camera = imageio.get_reader(video.filename)
	# print("Camera: ", camera)
	# model = tf.keras.models.load_model('blinkModel.hdf5')
	# graph = tf.get_default_graph()
	# close_counter = blinks = mem_counter= 0
	# state = ''
	# while (camera.isOpened()):
	# # for frame in camera :
	# 	ret, frame = camera.read()
	# 	if frame is None:
	# 		break
	# 	eyes = cropEyes(frame)
	# 	if eyes is None:
	# 		continue
	# 	else:
	# 		left_eye,right_eye = eyes
			
	# 	prediction = (model.predict(cnnPreprocess(left_eye)) + model.predict(cnnPreprocess(right_eye)))/2.0
		
	# 	print(prediction)

	# 	if prediction >= 0.4 :
	# 		state = 'open'
	# 		close_counter = 0
	# 	else:
	# 		state = 'close'
	# 		close_counter += 1
			
	# 	if state == 'open' and mem_counter > 1:
	# 		blinks += 1
	# 	mem_counter = close_counter 
			
	# 	# cv2.putText(frame, "Blinks: {}".format(blinks), (10, 30),
	# 	# cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
	# 	# cv2.putText(frame, "State: {}".format(state), (300, 30),
	# 	# cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
				
					
	# 	# cv2.imshow('blinks', frame)

	# 	# cv2.waitKey(0)
	# 	if  blinks > 0 :
	# 		break
	# camera.release()
	# # print(os.path.join(os.getcwd(), video.filename))
	# os.remove(os.path.join(os.getcwd(), video.filename))
	return 'success'
				
	# 			# jalan()
if(__name__) == "__main__":
	app.run()