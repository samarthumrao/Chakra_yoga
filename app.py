import mediapipe as mp
print(f"DEBUG: dir(mp): {dir(mp)}")
try:
    print(f"DEBUG: mp.solutions: {mp.solutions}")
except AttributeError:
    print("DEBUG: mp.solutions NOT FOUND")
import cv2
import time
from sklearn import svm
import pickle
import os
from random import sample
import array
from flask import Flask, Response, jsonify, request
from flask_cors import CORS
import threading

app = Flask(__name__)
CORS(app)

# Global variables
current_pose_index = 0
current_pose_list = [] # List of image paths
current_pose_numbers = [] # List of pose IDs
avg_pose_percent_array = [0,0,0,0,0]
timer_started = False
start_pose_time = 0
time_per_pose = 15

# Load model
filename = 'pose_classifier.pkl'
loaded_model = pickle.load(open(filename,'rb'))

# Calibration data
pose_callibrations = [[0, 12.63, 6.11], [1, 14.53, 6.44], [2, 63.1, 16.15], [3, 41.65, 14.75], [4, 37.21, 12.87], [5, 59.04, 16.88], 
						[6, 7.07, 4.02], [7, 54.59, 16.19], [8, 48.21, 14.51], [9, 29.25, 9.6], [10, 44.97, 14.56], [11, 28.53, 13.21], 
						[12, 35.89, 10.71], [13, 23.11, 9.39], [14, 37.74, 12.01], [15, 26.93, 9.38], [16, 24.76, 9.59], [17, 50.48, 14.41], 
						[18, 38.0, 12.19], [19, 17.19, 6.94], [20, 23.64, 8.16], [21, 32.98, 10.69], [22, 51.73, 15.75], [23, 26.41, 8.27], 
						[24, 12.07, 7.26], [25, 18.62, 6.94], [26, 56.31, 14.99], [27, 26.09, 11.28], [28, 36.57, 13.04], [29, 28.97, 12.2], 
						[30, 36.74, 11.78], [31, 48.68, 15.13], [32, 31.01, 10.13], [33, 34.47, 12.09], [34, 7.36, 2.91], [35, 28.1, 11.1], 
						[36, 34.58, 12.27], [37, 38.97, 13.2], [38, 46.86, 14.45], [39, 38.62, 11.95], [40, 27.0, 9.57], [41, 3.04, 1.53], 
						[42, 44.36, 14.09], [43, 3.34, 1.64], [44, 50.94, 15.01], [45, 20.29, 10.08], [46, 14.83, 6.11], [47, 14.91, 6.39], 
						[48, 34.02, 13.87], [49, 15.9, 7.69], [50, 29.25, 10.35], [51, 26.16, 10.94], [52, 24.88, 9.8], [53, 9.95, 4.75], 
						[54, 48.77, 16.33], [55, 21.29, 7.68], [56, 56.69, 16.57], [57, 51.2, 15.7], [58, 25.36, 10.12], [59, 15.56, 5.54], 
						[60, 47.75, 14.22], [61, 15.33, 6.43], [62, 10.25, 5.79], [63, 35.89, 11.01], [64, 40.87, 13.11], [65, 33.13, 11.26], 
						[66, 25.33, 9.26], [67, 4.13, 1.74], [68, 55.61, 15.74], [69, 31.14, 10.4], [70, 9.68, 4.8], [71, 54.95, 16.32], 
						[72, 17.88, 6.98], [73, 46.57, 13.71], [74, 36.82, 11.81], [75, 57.09, 16.23], [76, 32.81, 10.88], [77, 11.8, 5.56], 
						[78, 39.38, 13.58], [79, 19.7, 7.48], [80, 38.37, 12.8], [81, 2.16, 0.64]]

# Prepare DrawingSpec
mp_drawing = mp.solutions.drawing_utils 
drawing_spec = mp_drawing.DrawingSpec(thickness=1, circle_radius=3)
mp_pose = mp.solutions.pose

def get_pose_name(classifier):
    pose_list_file = "pose_list.txt"
    with open(pose_list_file) as f:
        poses = f.readlines()
    if 0 <= classifier < len(poses):
        return poses[classifier].strip()
    return "Unknown"

def example_pose_image(pose):
    example_images = 'example_poses'
    target_pose = ''
    for root, dirs, files in os.walk(example_images):
        find_pose = str(pose) + '.jpg'
        for file in files:
            if file == find_pose:
                target_pose = example_images + "/" + find_pose
    return target_pose

def pose_difficulty_selecter(difficulty, poses_to_select):
    pose_difficulty = "pose_difficulty_list.txt"
    pose_image_links = []
    pose_numbers = []
    with open(pose_difficulty) as f:
        pose_diff_list=[]
        for line in f:
            if line[0] != '#':
                pose_diff_list.append(line.split())
        
        if difficulty < len(pose_diff_list):
            selected_poses = sample(pose_diff_list[difficulty], min(len(pose_diff_list[difficulty]), poses_to_select))
            for pose in selected_poses:
                pose_image_links.append(example_pose_image(pose))
                pose_numbers.append(pose)
    return pose_image_links, pose_numbers

def get_pose_from_landmarks(landmarks_to_save, pose):
    prediction = loaded_model.predict_proba([landmarks_to_save])
    pose_probability = prediction[0][pose]
    pose_probability = int(100*pose_probability)
    return pose_probability

def calculate_score(current_pose_percentage):
    # Simplified scoring for display
    if current_pose_percentage < 10: return 'D'
    if current_pose_percentage < 30: return 'C'
    if current_pose_percentage < 50: return 'B'
    if current_pose_percentage < 70: return 'A'
    return 'S'

# Initialize default poses
current_pose_list, current_pose_numbers = pose_difficulty_selecter(0, 7)

def generate_frames():
    global current_pose_index, timer_started, start_pose_time, avg_pose_percent_array
    
    cap = cv2.VideoCapture(0)
    prev_frame_time = 0
    
    with mp_pose.Pose(static_image_mode=False, min_detection_confidence=0.1, model_complexity=1) as pose:
        while True:
            success, image = cap.read()
            if not success:
                break

            new_frame_time = time.time()
            results = pose.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
            pose_landmarks = results.pose_landmarks

            image_hight, image_width, _ = image.shape
            
            # Overlay logic
            if current_pose_index < len(current_pose_list):
                try:
                    img_path = current_pose_list[current_pose_index]
                    if os.path.exists(img_path):
                        img = cv2.imread(img_path)
                        ratio = img.shape[0]/img.shape[1]
                        example_width = 200
                        example_height = int((200 * ratio))
                        img = cv2.resize(img,(example_width,example_height),interpolation = cv2.INTER_AREA)
                        x_offset = image.shape[1] - example_width
                        y_offset = image.shape[0]-example_height
                        
                        # Draw background for overlay
                        cv2.rectangle(image,((image.shape[1]-220),0), (image_width,image_hight),(0,0,0),-1)
                        image[y_offset:image.shape[0], x_offset:image.shape[1]] = img[0:image.shape[0]-y_offset, 0:image.shape[1]-x_offset]
                except Exception as e:
                    print(f"Error loading overlay: {e}")

            if results.pose_landmarks:
                mp_drawing.draw_landmarks(
                    image=image,
                    landmark_list=results.pose_landmarks,
                    connections=mp_pose.POSE_CONNECTIONS,
                    landmark_drawing_spec=drawing_spec,
                    connection_drawing_spec=drawing_spec)

                # Logic for pose scoring
                if current_pose_index < len(current_pose_numbers):
                    desired_pose = int(current_pose_numbers[current_pose_index])
                    
                    # Extract landmarks
                    landmarks_to_save = []
                    plm = [[lmk.x, lmk.y, lmk.z] for lmk in pose_landmarks.landmark]
                    body_part = 0
                    for _ in results.pose_landmarks.landmark:
                        if (body_part > 10 and body_part < 17) or (body_part > 22):
                            landmarks_to_save.extend([plm[body_part][0], plm[body_part][1], plm[body_part][2]])
                        body_part += 1
                    
                    pose_percent = get_pose_from_landmarks(landmarks_to_save, desired_pose)
                    avg_pose_percent_array.pop(0)
                    avg_pose_percent_array.append(pose_percent)
                    avg_percent = sum(avg_pose_percent_array) / len(avg_pose_percent_array)
                    
                    # Timer logic
                    if avg_percent > pose_callibrations[desired_pose][2] and not timer_started:
                        start_pose_time = time.time()
                        timer_started = True
                    
                    time_remaining = time_per_pose
                    if timer_started:
                        time_remaining = time_per_pose - (time.time() - start_pose_time)
                        if time_remaining < 0:
                            if current_pose_index < len(current_pose_list) - 1:
                                current_pose_index += 1
                            else:
                                current_pose_index = 0
                            timer_started = False
                            time.sleep(1)

                    # Text overlays
                    pose_name_str = get_pose_name(desired_pose)
                    cv2.putText(image, f"#{desired_pose}: {pose_name_str}", (x_offset + 20, y_offset - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1, cv2.LINE_AA)
                    cv2.putText(image, f"Score: {int(avg_percent)}%", (x_offset + 20, y_offset - 145), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1, cv2.LINE_AA)
                    
                    if timer_started:
                        cv2.putText(image, f"Time: {int(time_remaining)}", (x_offset + 20, y_offset - 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 1, cv2.LINE_AA)
                    else:
                        cv2.putText(image, "Ready", (x_offset + 20, y_offset - 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 1, cv2.LINE_AA)

            ret, buffer = cv2.imencode('.jpg', image)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/api/tracks', methods=['GET'])
def get_tracks():
    tracks = [
        {"id": 0, "name": "Beginners Track", "description": "Start your yoga journey here."},
        {"id": 1, "name": "Power Yoga Track", "description": "Build strength and endurance."},
        {"id": 2, "name": "Immunity Booster Track", "description": "Boost your immune system."},
        {"id": 3, "name": "Yoga in Pregnancy Track", "description": "Safe poses for pregnancy."},
        {"id": 4, "name": "Cardiovascular Yoga Track", "description": "Improve heart health."},
        {"id": 5, "name": "Yoga for Migraine Track", "description": "Relief from migraines."},
        {"id": 6, "name": "Yoga for Asthma Track", "description": "Breathing exercises for asthma."}
    ]
    return jsonify(tracks)

@app.route('/api/start_track/<int:track_id>', methods=['POST'])
def start_track(track_id):
    global current_pose_list, current_pose_numbers, current_pose_index, timer_started
    current_pose_list, current_pose_numbers = pose_difficulty_selecter(track_id, 7)
    current_pose_index = 0
    timer_started = False
    
    # Get details for the selected poses
    poses_details = []
    for i, pose_num in enumerate(current_pose_numbers):
        poses_details.append({
            "id": pose_num,
            "name": get_pose_name(int(pose_num)),
            "image": f"/poses/{pose_num}.jpg"
        })
        
    return jsonify({"status": "success", "poses": poses_details})

@app.route('/api/set_pose/<int:index>', methods=['POST'])
def set_pose(index):
    global current_pose_index, timer_started
    if 0 <= index < len(current_pose_list):
        current_pose_index = index
        timer_started = False
        return jsonify({"status": "success"})
    return jsonify({"status": "error", "message": "Invalid index"}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
