import { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTrash,
  faEdit,
  faStar,
  faArchive,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Task.module.css";
import TaskModal from "../TaskModal/TaskModal";
import useTasks from "../../hooks/useTasks";
import Toast from "../../utils/Toast";
import ConfirmBox from "../../utils/ConfirmBox/ConfirmBox";

const Task = ({ task }) => {
  const [showModal, setShowModal] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const { getTasks } = useTasks();
  const [isCompleted, setIsCompleted] = useState(task.completion_status);
  const [isStarred, setIsStarred] = useState(task.starred_status);
  const [isArchived, setIsArchived] = useState(task.archived_status);
  const [showConfirm, setShowConfirm] = useState(false);

  const deleteTask = async () => {
    try {
      await axiosPrivate.delete(`/tasks/${task.id}`);
      getTasks();
      Toast.success("Task deleted successfully!");
    } catch (error) {
      console.error("Failed to delete task", error);
      Toast.error("Error: could not delete task");
    }
  };

  const toggleCompleteTask = async (newStatus) => {
    try {
      await axiosPrivate.put(`/tasks/${task.id}/complete`, {
        isCompleted: newStatus,
      });
      setIsCompleted(newStatus);
      getTasks();
      Toast.success(
        `Task ${newStatus ? "completed" : "uncompleted"} successfully!`
      );
    } catch (error) {
      console.error("Failed to mark task as completed", error);
      Toast.error(
        `Error: could not ${isCompleted ? "uncomplete" : "complete"} task`
      );
    }
  };

  const toggleStarTask = async (newStatus) => {
    try {
      await axiosPrivate.put(`/tasks/${task.id}/star`, {
        isStarred: newStatus,
      });
      setIsStarred(newStatus);
      getTasks();
      Toast.success(
        `Task ${newStatus ? "starred" : "unstarred"} successfully!`
      );
    } catch (error) {
      console.error("Failed to mark task as starred", error);
      Toast.error(`Error: could not ${isStarred ? "unstar" : "star"} task`);
    }
  };

  const toggleArchiveTask = async (newStatus) => {
    try {
      await axiosPrivate.put(`/tasks/${task.id}/archive`, {
        isArchived: newStatus,
      });
      getTasks();
      setIsArchived(newStatus);
      Toast.success(
        `Task ${newStatus ? "archived" : "unarchived"} successfully!`
      );
    } catch (error) {
      console.error("Failed to update archive status", error);
      Toast.error("Failed to update archive status");
    }
  };

  return (
    <li className={styles.listItem}>
      <div className={styles.infoContainer}>
        <div className={styles.taskDetails}>
          <p className={styles.taskTilte}>{task.title}</p>
          <div className={styles.statusGroup}>
            <p
              className={`${styles.taskStatus} ${
                task.completion_status
                  ? styles.taskStatusCompleted
                  : styles.taskStatusPending
              }`}
            >
              {task.completion_status ? "completed" : "pending"}
            </p>
            {task.due_date && (
              <p className={styles.taskDueDate}>
                <FontAwesomeIcon icon={faCalendar} />
                {new Date(task.due_date).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <button
          className={styles.editBtn}
          title="Edit task"
          onClick={() => setShowModal(true)}
        >
          <FontAwesomeIcon icon={faEdit} />
        </button>
        <button
          className={styles.deleteBtn}
          title="Delete task"
          onClick={() => setShowConfirm(true)}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
        <button
          className={`${styles.completeBtn} ${isCompleted ? styles.completed : ""}`}
          title="Complete/Uncomplete task"
          onClick={() => toggleCompleteTask(!isCompleted)}
        >
          <FontAwesomeIcon icon={faCheck} />
        </button>
        <button
          className={`${styles.starBtn} ${isStarred ? styles.starred : ""}`}
          title="Star/Unstar task"
          onClick={() => toggleStarTask(!isStarred)}
        >
          <FontAwesomeIcon icon={faStar} />
        </button>
        <button
          className={`${styles.archiveBtn} ${
            task.archived_status ? styles.archived : ""
          }`}
          title="Archive/Unarchive task"
          onClick={() => toggleArchiveTask(!isArchived)}
        >
          <FontAwesomeIcon icon={faArchive} />
        </button>
      </div>
      {showModal && (
        <TaskModal
          mode={"edit"}
          setShowModal={setShowModal}
          getTasks={getTasks}
          task={task}
        />
      )}

      <ConfirmBox
        isVisible={showConfirm}
        message="Are you sure you want to delete this task?"
        onConfirm={deleteTask}
        onCancel={() => setShowConfirm(false)}
      />
    </li>
  );
};

export default Task;
