'use server';

import CloseBtn from "@/components/button/CloseBtn";
import SubmitButton from "@/components/button/SubmitBtn";
import ToeicSubmitBtn from "@/components/button/ToeicSubmitBtn";
import CustomPagination from "@/components/common/CustomPagination";
import LinkIcon from "@/components/common/LinkIcon";
import ToeicAnswer from "@/components/toeic/ToeicAnswer";
import { AuthorizeHeader, CommonHeader } from "@/config/headers";
import { SERVER, SERVER_API } from "@/constants/enums/API";
import { ERROR } from "@/constants/enums/ERROR";
import { PG } from "@/constants/enums/PG";
import { splitStringToList } from "@/service/utils/utils";

import { OptionData,ToeicProblemType } from "@/types/ToeicData";
import { cookies } from "next/headers";

export default async function LevelTestPage({ searchParams }: {
    searchParams: { page: number }
}) {

    let toeic:ToeicProblemType[]=[]

    const currentPage = searchParams.page ===undefined? 1: Number(searchParams.page);
    const name=cookies().get('name')?.value;

    try {
        const accessToken=cookies().get('accessToken')?.value;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${SERVER.TOEIC}/${SERVER_API.TOEIC}/test`, {
            method: 'GET',
            headers: AuthorizeHeader(accessToken),
            cache: 'no-store'
        })

        if (response.status === 200) {
            const data = await response.json() as ToeicProblemType[];       
            toeic = data;
        }
        else {
            throw new Error(ERROR.SERVER_ERROR);
        }
    } catch (err) {
        console.log('Failed to get level: ',err);
    }

    const questions:string[]=splitStringToList(toeic[currentPage-1].question);
   
    return (<>
        <audio
            //autoPlay
            src={toeic[0].toeicCategory.sound}
            preload='none'
            className="hidden"
        />
        <div className="bg-white w-screen h-screen">
            <div className="flex flex-row w-full p-3">
                <CloseBtn url={`${PG.LEVEL_TEST}`} />
            </div>
            <div className="w-full flex justify-center items-center px-10">
                <div className="flex flex-col w-[768px] h-screen mt-16">
                    <div className="p-2">
                        <div className="flex flex-row gap-x-2 items-center">
                            <LinkIcon size={30} />
                            <h1 className="text-black font-semibold text-2xl">토익두잇 레벨테스트</h1>
                        </div>
                        <div className="flex flex-col gap-y-7 mt-5">
                            <div className="text-black font-medium text-xl mt-2">Question {currentPage} .</div>
                            <div className="flex flex-col gap-y-2">
                            {questions.map((qu,index)=>(
                                <p 
                                key={index}
                                className="text-black font-medium text-lg">{qu}</p>
                            ))}
                            </div>
                           
                            <ToeicAnswer op={toeic[currentPage-1].option} page={currentPage}/>
                        </div>

                        <div className="mt-5">
                            <div className="w-full flex justify-end">
                                {currentPage === toeic.length &&
                                    <ToeicSubmitBtn />
                                }
                            </div>
                        </div>

                    </div>
                    <div className="mt-5 flex w-full justify-end">
                        <CustomPagination totalPages={toeic.length} type={"single"} page={currentPage} />
                    </div>
                </div>

            </div>

        </div>
    </>);
}