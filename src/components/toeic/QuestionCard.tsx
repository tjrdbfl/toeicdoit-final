import { ToeicProblemType } from "@/types/ToeicData";
import Image from "next/image";
import { FC } from "react";
import ToeicModalBtn from "./ToeicModalBtn";
import { splitStringToList } from "@/service/utils/utils";


interface QuestionCardProps {
    id: number,
    toeic: ToeicProblemType;
}
const QuestionCard: FC<QuestionCardProps> = ({
    id, toeic
}) => {

    const questions:string[]=splitStringToList(toeic.question);
    return (<>
        <div
            key={id}
            className="flex flex-col justify-center">
            <div className="flex flex-row gap-x-2 w-[450px] xl:w-[630px]">
                <h1
                    key="level practice number"
                    className="text-black text-lg text-nowrap font-medium "
                >{id} . </h1>
                <div className="flex flex-col">
                {toeic?.question !== '' && questions.map((str)=>(
                    <h2
                    key="level practice question"
                    className="text-black text-lg items-start font-medium ">
                    {str}
                </h2>
                ))}
                </div>
               
            </div>
            <div
                key="level practice image"
                className="mt-3">
                {toeic?.image !== '' &&
                    <div className="2xl:mx-0 mb-5 object-fill w-[550px] xl:w-[600px]">
                        <Image 
                            src={toeic?.image}
                            alt={"level practice image"}
                            width={450}
                            height={400}
                            priority={true}
                            className={`${toeic?.part==="1" ? "w-[400px] h-[250px]":""}`}
                        />
                    </div>
                }
            </div>

            <div className="lg:mx-12 xl:mx-0">
                <div className="flex items-start mb-4">
                    <div
                        className={`ms-2 text-[18px] font-medium flex flex-row justify-start limited-width-text ${toeic?.take && toeic?.answer === 'a' ? 'text-red-500' : 'text-gray-900 '}`}>
                        {toeic.option.choice1}
                    </div>
                </div>

                <div className="flex items-start mb-4">

                    <div
                        className={`ms-2 text-[18px] font-medium flex flex-row justify-start limited-width-text ${toeic?.take && toeic?.answer === 'b' ? 'text-red-500' : 'text-gray-900 '}`}>
                        {toeic.option.choice2}
                    </div>
                </div>

                <div className="flex items-start mb-4">
                    <div
                        className={`ms-2 text-[18px] font-medium flex flex-row justify-start limited-width-text ${toeic?.take && toeic?.answer === 'c' ? 'text-red-500' : 'text-gray-900 '}`}>
                        {toeic.option.choice3}
                    </div>
                </div>

                {toeic.option.choice4 !== '' && <div className="flex items-start mb-4">
                    <div
                        className={`ms-2 text-[18px] font-medium flex flex-row justify-start limited-width-text ${toeic?.take && toeic?.answer === 'd' ? 'text-red-500' : 'text-gray-900 '}`}>
                        {toeic?.option.choice4}
                    </div>
                </div>}
            </div>

            {toeic?.take && <>
                <ToeicModalBtn
                    id={toeic.id}
                    label={"해설 보기"}
                    toeic={toeic}
                />
            </>}
        </div>
    </>);
}
export default QuestionCard;