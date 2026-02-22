import { useState } from "react";
import { useCookies } from "react-cookie";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useTasks from "../../hooks/useTasks";
import styles from "./TaskModal.module.css";
import Modal from "../../utils/Modal/Modal";
import Toast from "../../utils/Toast";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TaskModal = ({ mode, setShowModal, task }) => {
  const [cookies] = useCookies(null);
  const axiosPrivate = useAxiosPrivate();
  const { getTasks } = useTasks();

  const editMode = mode === "edit";

  const [data, setData] = useState({
    user_email: editMode ? task.user_email : cookies.email,
    title: editMode ? task.title : "",
    due_date: editMode && task.due_date ? task.due_date.split('T')[0] : "",
    completionStatus: editMode ? task.completion_status : false,
    starredStatus: editMode ? task.starred_status : false,
    date: editMode ? task.date : new Date(),
  });

  const [error, setError] = useState("");

  const validateTitle = () => {
    if (!data.title || !data.title.trim()) {
      setError("Task title cannot be empty");
      return false;
    }
    setError("");
    return true;
  };

  const postData = async (e) => {
    e.preventDefault();
    if (!validateTitle()) return;

    const payload = {
      ...data,
      due_date: data.due_date === "" ? null : data.due_date,
    };

    try {
      const response = await axiosPrivate.post(`/tasks`, payload, {
        headers: { "Content-type": "application/json" },
      });
      if (response.status === 201) {
        setShowModal(false);
        Toast.success("Task created successfully!");
      }
      getTasks();
    } catch (error) {
      Toast.error("Error: could not create task");
    }
  };

  const editData = async (e) => {
    e.preventDefault();
    if (!validateTitle()) return;

    const payload = {
      ...data,
      due_date: data.due_date === "" ? null : data.due_date,
    };

    try {
      const response = await axiosPrivate.put(`/tasks/${task.id}`, payload, {
        headers: { "Content-type": "application/json" },
      });

      if (response.status === 200) {
        Toast.success("Task updated successfully!");
      }
      setShowModal(false);
      getTasks();
    } catch (error) {
      Toast.error("Error: could not edit task");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((data) => ({
      ...data,
      [name]: value,
    }));
    if (error) setError("");
  };

  return (
    <Modal>
      <div className={styles.formTitleContainer}>
        <h3>{editMode ? "Edit task" : "New task"}</h3>
        <button onClick={() => setShowModal(false)}>
          <FontAwesomeIcon icon={faClose} />
        </button>
      </div>
      <form>
        <label className={styles.inputGroup}>
          <span>Task Title</span>
          <input
            type="text"
            required
            maxLength={30}
            placeholder="What needs to be done?"
            name="title"
            value={data.title}
            onChange={handleChange}
          />
        </label>
        <label className={styles.inputGroup}>
          <span>Due Date (Optional)</span>
          <input
            type="date"
            name="due_date"
            value={data.due_date || ""}
            onChange={handleChange}
          />
        </label>
        {error && <p className={styles.validationError}>{error}</p>}
        <input
          className={mode}
          type="submit"
          value={editMode ? "Save changes" : "Add task"}
          onClick={editMode ? editData : postData}
        />
      </form>
    </Modal>
  );
};

export default TaskModal;
