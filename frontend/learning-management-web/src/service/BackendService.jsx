import axios from "axios";

const BASE_APP_URL = import.meta.env.VITE_BASE_URL_LMS;

class BackendService {
  login(userName, password) {
    return axios.post(
      `${BASE_APP_URL}/oauth/token?client_id=dynamo-oauth2-client&client_secret=karthik&grant_type=password&username=${userName}&password=${password}`
    );
  }

  getCourses() {
    return axios.get(`${BASE_APP_URL}/api/courses`);
  }
  updateCourse(data, courseId) {
    return axios.put(`${BASE_APP_URL}/api/courses/${courseId}`, data);
  }
  createCourse(data) {
    return axios.post(`${BASE_APP_URL}/api/courses`, data);
  }
  deleteCoure(courseId) {
    return axios.delete(`${BASE_APP_URL}/api/courses/${courseId}`);
  }
  fetchTopics(id) {
    return axios.get(`${BASE_APP_URL}/api/courses/course/${id}`);
  }
  fetchTopic(id) {
    return axios.get(`${BASE_APP_URL}/api/topics/${id}`);
  }
  createTopic(data) {
    return axios.post(`${BASE_APP_URL}/api/topics`, data);
  }

  updateTopic(data, id) {
    return axios.put(`${BASE_APP_URL}/api/topics/${id}`, data);
  }
  deleteTopic(id) {
    return axios.delete(`${BASE_APP_URL}/api/topics/${id}`);
  }

  fetchAllLearners() {
    return axios.get(`${BASE_APP_URL}/api/users/learners`);
  }

  enrollCourse(courseId, userId) {
    return axios.post(`${BASE_APP_URL}/api/courses/${courseId}/${userId}`);
  }

  addUsers(email) {
    return axios.post(`${BASE_APP_URL}/api/users/user/${email}`);
  }

  askAi(input) {
    return axios.get(`${BASE_APP_URL}/api/chat?prompt=${input}`);
  }

  fetchMyEnrolledCourses(id)
  {
    return axios.get(`${BASE_APP_URL}/api/courses/${id}/enrolled`);
  }
  fetchAllCoursesForLearners(id){
    return axios.get(`${BASE_APP_URL}/api/courses/all-course/${id}`);
  }
    
}

export default new BackendService();
