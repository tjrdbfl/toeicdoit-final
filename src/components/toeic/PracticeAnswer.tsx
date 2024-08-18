'use client';

import SubmitButton from "@/components/button/SubmitBtn";
import { ScrollArea, ScrollBar } from "@/components/utils/ScrollArea";
import { PG } from "@/constants/enums/PG";
import { ExamPart, allParts } from "@/constants/toeic/exam";
import { submitAnswer, submitExamAnswer } from "@/service/toeic/actions";
import { classifyPart } from "@/service/toeic/items";
import { useExamAnswerStore, useNumberOfQuestionStore, useResultStore } from "@/store/toeic/store";
import { usePracticeTimerStore } from "@/store/toeic/timer";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

const PracticeAnswer = ({
    part, label, count, id,type,name
}: {
    id: number,
    part: number,
    label: string,
    count: number,
    type:string,
    name:string
}) => {

    const option1: string[] = ['a', 'b', 'c', 'd'];
    const option2: string[] = ['a', 'b', 'c'];
    const [select, setSelect] = useState<{ [key: number]: boolean }>({});
    const { answers, setAnswer } = useExamAnswerStore();
    const { timeElapsed } = usePracticeTimerStore();
    
    let initialAnswers: boolean[] = [];
    for (let i = 1; i <= count; i++) {
        initialAnswers[i] = false;
    }
    
    const [questionNumbers, setQuestionNumbers] = useState<{ [key: number]: boolean }>(initialAnswers);
    
    const handleSelect = (questionId: number, value: string) => {
        setAnswer(questionId, value, classifyPart(questionId));
        setSelect((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: value !== ''
        }));
        setQuestionNumbers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: value !== ''
        }));
        if(value!=='' && !questionNumbers[questionId]){
            useNumberOfQuestionStore.setState({ count: Object.values(questionNumbers).filter(answer => answer === true).length + 1 });
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        formData.append('selections', JSON.stringify(answers));

        const response = await submitExamAnswer(3, timeElapsed, formData);

        if (response.message === 'SUCCESS' && response.data !== undefined) {
            useResultStore.setState(
                {
                    name: name,
                    type: type,
                    BarData: response.data.barData,
                    score: response.data.score,
                    lc_score: response.data.lcScore,
                    rc_score: response.data.rcScore,
                    timeElapsed: response.data.timeElapsed,
                    toeicId:id,
                    take: true
                });

            console.log('userResultStore : ', name);
            if (name !== '') {
                window.location.replace(`${PG.SCORE}`);
            }
        } else {
            alert(response.message);
        }
    };

    return (
        <div className="bg-white border-slate-200 border-2 shadow-lg rounded-lg w-[190px] h-[650px] m-5 lg:mr-[25%]">
            <div className="w-full p-2">
                <div className="bg-white border-slate-200 border-2 text-black font-medium text-center py-1 shadow-md rounded-md w-full">
                    {label}
                </div>
            </div>

            <form onSubmit={handleSubmit} method="POST">
                <ul className="mt-2 m-2 p-2 border-slate-200 border-2 w-[170px] h-[530px] rounded-lg shadow-md">
                    <ScrollArea className="transition-opacity duration-200 text-black w-full h-full">
                        {Array.from({ length: count }, (_, index) => index + 1).map((questionNumber) => (
                            <li
                                key={`question-li-${questionNumber}`}
                                className="flex flex-row gap-x-2 border-slate-200 items-center border-2 mr-4 w-[150px]"
                            >
                                <Link
                                    href={`/${type==='part'?'part':'level'}/${id}?page=${questionNumber}`}
                                    key={`question-${questionNumber}`}
                                    className={`text-black hover:text-zinc-500 hover:underline font-semibold w-[40px] border-slate-100 border-r-2 py-1 px-2 bg-blue-50`}
                                >
                                    {questionNumber}
                                </Link>
                                <div key={`radio-group-${questionNumber}`} className="flex flex-row gap-x-2 py-1">
                                    {(part === 2 ? option2 : option1).map((option) => (
                                        <div key={`radio-fragment-${questionNumber}-${option}`} className="relative">
                                            <input
                                                id={`${questionNumber}-${option}`}
                                                type='radio'
                                                name={`${questionNumber}`}
                                                value={option}
                                                onChange={() => handleSelect(questionNumber, option)}
                                                className="hidden"
                                            />
                                             <label
                                                        htmlFor={`${questionNumber}-${option}`}
                                                        className={`text-black w-4 h-4 text-[14px] rounded-full ring-1 ring-black flex items-center justify-center cursor-pointer 
                                                            hover:bg-blue-50 hover:ring-2 hover:ring-blue-600 
                                                            ${answers[questionNumber - 1]?.answer === option ? 'bg-blue-200' : 'bg-white'}`}
                                                >
                                                {option.toUpperCase()}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </li>
                        ))}
                        <ScrollBar />
                    </ScrollArea>
                </ul>
                <div className="mx-10 mt-3">
                    <button 
                    className="w-full h-auto py-[2.5%] flex text-center items-center text-white shadow-xl rounded-lg bg-black justify-center text-[15px] font-semibold hover:bg-zinc-700"
                    >제출하기</button>
                </div>
            </form>
        </div>
    );
}

export default PracticeAnswer;

