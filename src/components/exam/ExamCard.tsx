import {

  ToeicProblemType,
} from "@/types/ToeicData";
import Image from "next/image";
import { FC } from "react";
import dynamic from 'next/dynamic';
import { useResultStore, useTakeStore } from "@/store/toeic/store";

const ToeicModalBtn = dynamic(() => import('../toeic/ToeicModalBtn'), { ssr: false });

interface ExamCardProps {
  toeic: ToeicProblemType;
  toeicId:number;
}
const ExamCard: FC<ExamCardProps> = ({toeic,toeicId}) => {

  const {take}=useResultStore();

  return (
    <>
      <div key={toeic.id} className={`flex flex-col justify-center mx-3 ${toeic.part==="3" || toeic.part==="4" ?'mr-20':''}`}>
        <div className="flex flex-row gap-x-2 mb-5 md:mx-6 lg:mx-12 xl:mx-0">
          <h1
            key="level practice number"
            className="text-black text-nowrap font-medium"
          >
            {toeic.id} .{" "}
          </h1>
          {toeic.question !== "" && (
            <h2
              key="level practice question"
              className="text-black items-start font-medium"
            >
              {toeic.question}
            </h2>
          )}
        </div>
        <div key="level practice ">
          {toeic.image !== "" && (
            <Image 
              src={`${toeic.image}`}
              alt={"level practice image"}
              width={300}
              height={300}
              priority={true}
              className={`justify-center ${(toeic.part==="1" || toeic.part==="3" || toeic.part==="4") ? 'w-[300px] h-[200px]' : toeic.part==="6" ? 'w-[550px] h-[300px]':'w-[550px] h-[600px]'} `}
            />
          )}
        </div>

        <div className="md:mx-6 lg:mx-12 xl:mx-0 mt-4">
          <div className="flex items-start mb-3">
            <div
              className={`text-[15px] font-medium flex flex-row justify-start limited-width-text ${
                toeic.take && toeic.answer === "A" ? "text-red-500" : "text-gray-900 "
              }`}
            >
              <p className="text-nowrap mr-2">(a)</p>
              {toeic.option.choice1}
            </div>
          </div>

          <div className="flex items-start mb-3">
            <div
              className={`text-[15px] font-medium flex flex-row justify-start limited-width-text ${
                toeic.take && toeic.answer === "B" ? "text-red-500" : "text-gray-900 "
              }`}
            >
              <p className="text-nowrap mr-2">(b)</p>
              {toeic.option.choice2}
            </div>
          </div>

          <div className="flex items-start mb-3">
            <div
              className={`text-[15px] font-medium flex flex-row justify-start limited-width-text ${
                toeic.take && toeic.answer === "C" ? "text-red-500" : "text-gray-900 "
              }`}
            >
              <p className="text-nowrap mr-2">(c)</p>
              {toeic.option.choice3}
            </div>
          </div>

          {toeic.option.choice4 !== "" && (
            <div className="flex items-start">
              <div
                className={`text-[15px] font-medium flex flex-row justify-start limited-width-text ${
                  toeic.take && toeic.answer === "D" ? "text-red-500" : "text-gray-900 "
                }`}
              >
                <p className="text-nowrap mr-2">(d)</p>
                {toeic.option.choice4}
              </div>
            </div>
          )}
        </div>

        {take && (
           <ToeicModalBtn
           id={toeic.id}
           label={"해설 보기"}
           toeic={toeic}
         />
        )}
      </div>
    </>
  );
};
export default ExamCard;
