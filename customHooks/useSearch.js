export const useSearch = () => {
    const handleSearch = (tasks,input) => {
        const query = input.toLowerCase()
        const filteredTasks = tasks.filter(task => task.title.toLowerCase().includes(query) || task.description.toLowerCase().includes(query));

        return filteredTasks

    }

    return handleSearch
}