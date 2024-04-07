import axios, { AxiosRequestConfig } from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
interface TaskProp {
    completed: boolean,
    description: string,
    createdAt: string,
}

export default function DisplayTasks() {
    const [tasks, setTasks] = useState<Array<TaskProp>>([])
    const navigate = useNavigate()
    const getTasks = async ()=>{
        const config: AxiosRequestConfig = {
            withCredentials: true,
            // credentials: 'include',
            withXSRFToken: true,
            headers: {
                Accept: 'application/json'
            },
        }
        axios.get('http://localhost:5000/tasks', config).
        then(response =>{
            console.log('response', response)
            setTasks(response.data.tasks)
        }).catch((err) => {
            console.log('error in getting tasks', err)
            navigate('/login')
        })
    }

    useEffect(() => {
        getTasks()

    }, [])
    return (
        <div className="w-full max-w-md p-4 bg-white border border-gray-300 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">

            <div className="flow-root">
                <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                    {
                        tasks.map(item => {
                            return <Tasks key={item.createdAt} task={item}/>
                        })
                    }
                </ul></div></div>)
}

export function Tasks({task}: {task: TaskProp}) {
    const createdAt = new Date(task.createdAt)
    return (<>
        <li  className="py-3 sm:py-4">
            <div className="flex items-center">
                {/* <div className="flex-shrink-0">
                        <img className="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-1.jpg" alt="Neil image">
                    </div> */}
                <div className="flex-1 min-w-0 ms-4">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                        {/* Neil Sims */}{task.description}
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                        {/* email@windster.com */}{createdAt.toUTCString()}
                    </p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                    {/* $320 */}{task.completed.toString()}
                </div>
            </div>
        </li>
    </>)
}