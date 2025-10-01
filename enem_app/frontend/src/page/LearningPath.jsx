import { useEffect, useState } from "react";
import LessonCircle from "../components/LessonCircle";
import Navbar from "../components/NavBar";

export default function LearningPath(){
    const [lessons, setLessons] = useState([])

    useEffect(() => {
        setLessons([
            {id: 1, percentage: 20},
            {id: 2, percentage: 50},
            {id: 3, percentage: 32},
            {id: 4, percentage: 99},
            {id: 5, percentage: 100}
        ]);
    }, [])

    return(
        <>
            < Navbar />
            { lessons.map((lesson) => (
                <LessonCircle key={lesson.id} porcentagem={lesson.percentage} />
            ))}
        </> 
    )
}