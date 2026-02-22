import { useTaskContext } from "../context/TaskProvider";
import useAxiosPrivate from "./useAxiosPrivate";
import { useCookies } from "react-cookie";
import { useNavigate, useLocation } from "react-router-dom";

const useTasks = () => {
  const { tasks, setTasks, isLoading, setLoading, error, setError, taskCounts, searchQuery, setSearchQuery } = useTaskContext();
  const axiosPrivate = useAxiosPrivate();
  const [cookies] = useCookies(['email']);
  const email = cookies.email;
  const navigate = useNavigate();
  const location = useLocation();

  const getTasks = async () => {
    try {
      const response = await axiosPrivate.get(`/tasks/${email}`);
      setTasks(response.data);
      if (response.status === 404) {
        setTasks([]);
      }
    } catch (error) {
      console.error('Failed to fetch tasks', error);
      navigate('/login', { state: { from: location }, replace: true });
    }
  };

  return {
    tasks,
    isLoading,
    error,
    taskCounts,
    searchQuery,
    getTasks,
    setLoading,
    setError,
    setSearchQuery
  };
};

export default useTasks;
