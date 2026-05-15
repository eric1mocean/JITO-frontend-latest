import { useState } from "react";
import { useEffect } from "react";
import data from "../data.json";
import { useSearch } from "./useSearch";

const LOCKED_STATUS_VALUES = [3, 5];

export const usefetchTasks = () => {
    const [dataOfCols, setDataOfCols] = useState({});
    const [tasks, setTasks] = useState([]); 
    const handleSearch = useSearch();
    const fetchAfterSearch = (input) => {
        
        if (input.length) {
          const filteredTasks = handleSearch(tasks,input);
          setTasks(filteredTasks);
          updateColumns(filteredTasks);
        }
        else {
          setTasks(data);
          updateColumns(data);
        }
    }
    const updateColumns = (taskList) => {
    const filtered = {
      Open: taskList.filter(x => x.status === 0),
      Pending: taskList.filter(x => x.status === 1),
      InProgress: taskList.filter(x => x.status === 2),
      Completed: taskList.filter(x => x.status === 3)
    };
    setDataOfCols(filtered);
  };

    const fetchTasks = async() => {
        console.log(data);
        setTasks(data);
        updateColumns(data);
    }
    const handleRefresh = (newTask) => {
        setTasks(newTask);
        updateColumns(newTask);
    }
    const changeStatus = (task, newStatus) => {
    if (LOCKED_STATUS_VALUES.includes(task.status)) {
      return;
    }

    const updated = tasks.map(t =>
      t.id === task.id ? { ...t, status: newStatus } : t
    );
    setTasks(updated);
    updateColumns(updated);
  };
  const addTask = (titleInput, descInput, statusInput) => {
    if (!titleInput.trim()) return;

    const newTask = {
      id: tasks.length + 1,
      title: titleInput.trim(),
      description: descInput.trim(),
      deadline: new Date().toISOString(),
      status: statusInput,
      assignees: []
    };

    const updated = [...tasks, newTask];
    setTasks(updated);
    updateColumns(updated);

    
  };
  useEffect (()=>{
    fetchTasks();
  },[])

  return {
    dataOfCols, handleRefresh, changeStatus, addTask, tasks
  }

}