'use client';

import SubmitButton from "@/components/button/SubmitBtn";
import { ScrollArea, ScrollBar } from "@/components/utils/ScrollArea";
import { PG } from "@/constants/enums/PG";
import { ExamPart, allParts } from "@/constants/toeic/exam";
import { submitAnswer, submitExamAnswer } from "@/service/toeic/actions";
import { classifyPart } from "@/service/toeic/items";
import { useExamAnswerStore, useNumberOfQuestionStore, useResultStore, useTakeStore } from "@/store/toeic/store";
import { useExamTimerStore } from "@/store/toeic/timer";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";

const ExamAnswer = ({ toeicId, name }: { toeicId: number, name: string }) => {
    const [selectedTab, setSelectedTab] = useState(allParts[0].label);
    const option1: string[] = ['a', 'b', 'c', 'd'];
    const option2: string[] = ['a', 'b', 'c'];
    const { answers, setAnswer } = useExamAnswerStore();
    const { takes } = useTakeStore();

    let initialAnswers: boolean[] = [];
    for (let i = 1; i <= 200; i++) {
        initialAnswers[i] = false;
    }
    const [questionNumbers, setQuestionNumbers] = useState<{ [key: string]: number[] }>({});
    const [select, setSelect] = useState<{ [key: number]: boolean }>({});

    const partRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const router = useRouter();
    const { timeElapsed } = useExamTimerStore();
    const { setTake } = useTakeStore();
    const { take } = useResultStore();

    useEffect(() => {
        const numbers: { [key: string]: number[] } = {};
        let questionNumber = 1;
        allParts.forEach(part => {
            numbers[part.label] = Array.from({ length: part.question }, () => questionNumber++);
        });
        setQuestionNumbers(numbers);
    }, []);


    const handleSelect = (questionId: number, value: string) => {
        setAnswer(questionId, value, classifyPart(questionId));
        console.log('questionId: ' + questionId);
        console.log('part: ', classifyPart(questionId));
        setSelect((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: value !== ''
        }));

        console.log('selections: ' + JSON.stringify(answers));
        if (value !== '' && !select[questionId]) {
            useNumberOfQuestionStore.setState({ count: Object.values(select).filter(answer => answer === true).length + 1 });
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        formData.append('selections', JSON.stringify(answers));

        const response = await submitExamAnswer(1, timeElapsed, formData);

        if (response.message === 'SUCCESS' && response.data !== undefined) {
            useResultStore.setState(
                {
                    name: name,
                    type: 'exam',
                    BarData: response.data.barData,
                    score: response.data.score,
                    lc_score: response.data.lcScore,
                    rc_score: response.data.rcScore,
                    timeElapsed: response.data.timeElapsed,
                    lcAllScore:response.data.lcAllScore,
                    rcAllScore:response.data.rcAllScore,
                    toeicId: toeicId,
                    take: true
                });

            setTake(toeicId, true);

            console.log('userResultStore : ', name);
            if (name !== '') {
                window.location.replace(`${PG.SCORE}`);
            }
        } else {
            alert(response.message);
        }

    };

    const handleTabClick = (label: string) => {
        setSelectedTab(label);
        const partRef = partRefs.current[label];
        if (partRef) {
            partRef.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const setPartRef = useCallback((label: string) => (el: HTMLDivElement | null) => {
        partRefs.current[label] = el;
    }, []);

    return (
        <div className="bg-white border-slate-200 border-2 shadow-lg rounded-lg w-[230px] h-[670px] top-32 fixed right-0 mr-5 lg:mr-[25%]">
            <nav className="p-2 flex justify-center">
                <ul className="flex">
                    {allParts.map((item) => (
                        <li
                            key={item.label}
                            onClick={() => handleTabClick(item.label)}
                            className={`cursor-pointer relative text-[14px] font-semibold bg-white border-slate-100 border-2 p-1 shadow-md
                            ${item.label === selectedTab
                                    ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-blue-600 after:transition-all after:duration-200"
                                    : "text-black"
                                }`}
                        >
                            {item.label}
                        </li>
                    ))}
                </ul>
            </nav>

            <form onSubmit={handleSubmit} method="POST">
                <ul className="mx-2 p-2 border-slate-200 border-2 h-[550px] rounded-lg shadow-md">
                    <ScrollArea className="transition-opacity duration-200 text-black w-full h-full">
                        {allParts.map((part: ExamPart) => (
                            <div
                                key={part.label}
                                ref={setPartRef(part.label)}
                                className="">
                                {questionNumbers[part.label]?.map((questionNumber) => (
                                    <li
                                        key={`question-li-${part.label}-${questionNumber}`}
                                        className="flex flex-row gap-x-2 border-slate-200 items-center border-2 mr-4"
                                    >
                                        <div
                                            key={`question-${part.label}-${questionNumber}`}
                                            className={`text-black text-[14px] font-semibold w-[52px] border-slate-200 border-r-2 py-1 px-2 bg-blue-50`}
                                        >
                                            {questionNumber}
                                        </div>
                                        <div key={`radio-group-${part.label}-${questionNumber}`} className="flex flex-row gap-x-2 py-1">
                                            {(part.label === 'P2' ? option2 : option1).map((option) => (
                                                <div key={`radio-fragment-${part.label}-${questionNumber}-${option}`} className="relative">
                                                    <input
                                                        id={`${questionNumber}-${option}`}
                                                        type='radio'
                                                        name={`${part.label}-${questionNumber}`}
                                                        value={option}
                                                        onChange={() => handleSelect(questionNumber, option)}
                                                        className="hidden"
                                                        disabled={takes[toeicId].take}
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
                            </div>
                        ))}
                        <ScrollBar />
                    </ScrollArea>
                </ul>
                <div className="mx-10 mt-5">
                    {take ? <button type="button"
                        className="form_submit_btn"
                        onClick={() => {
                            useResultStore.setState({
                                type: '',
                                BarData: [],
                                score: 0,
                                lc_score: 0,
                                rc_score: 0,
                                timeElapsed: 0,
                                toeicId: 0,
                                name: '',
                                take: false,
                                rcAllScore:0,
                                lcAllScore:0
                            });
                            router.push(`${PG.EXAM}`);
                        }}
                    >
                        제출하기
                    </button> : <SubmitButton label={"제출하기"} />}
                </div>
            </form>
        </div>
    );
}

export default ExamAnswer;

