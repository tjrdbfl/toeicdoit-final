import CustomPagination from "@/components/common/CustomPagination";
import PracticeAnswer from "@/components/toeic/PracticeAnswer";
import QuestionCard from "@/components/toeic/QuestionCard";
import ToeicControl from "@/components/toeic/ToeicControl";
import ToeicHeader from "@/components/toeic/ToeicHeader";
import { AuthorizeHeader, CommonHeader } from "@/config/headers";
import { SERVER, SERVER_API } from "@/constants/enums/API";
import { ERROR } from "@/constants/enums/ERROR";
import { PG } from "@/constants/enums/PG";
import { ToeicProblemType } from "@/types/ToeicData";
import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";


export default async function PartPracticePage({ params,searchParams }: {
    params: {
        id: number;
    },
    searchParams:{
        page?: string;
    }
}) {
    let toeic: ToeicProblemType[]=[];

    const currentPage = Number(searchParams.page) || 1;
    const name=cookies().get('name')?.value;

    try {
        const accessToken=cookies().get('accessToken')?.value;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${SERVER.TOEIC}/${SERVER_API.TOEIC}/part/${params.id}`, {
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
        console.log('Failed to get notice: ', ERROR.SERVER_ERROR);
    }
    
    return (<>
        <div className="total_padding">
            <ToeicHeader label={`토익두잇 파트 ${params.id} 연습문제`} />
        </div>

        <ToeicControl sound={'https://kr.object.ncloudstorage.com/toeicdoit/%EC%9D%8C%EC%9B%90%ED%8C%8C%EC%9D%BC/%ED%8C%8C%ED%8A%B8%EB%B3%84%20%EC%9D%8C%EC%9B%90.mp3'} numberOfQuestions={toeic.length} type={"practice"} toeicId={0} />
        
        <div className="flex flex-row items-start justify-center gap-x-16 mt-5">
            <div className="px:px-[10%] md:w-[500px] lg:px-[23%] lg:w-[800px] xl:px-[25%] xl:w-[900px] 2xl:px-[27%] 2xl:w-[900px] flex flex-col mt-5">
                <div className="flex flex-row w-full gap-x-5 justify-between">
                    <div className="flex flex-col">
                    <QuestionCard
                            id={currentPage}
                            toeic={toeic[currentPage-1]} />
                        <div className="mt-5 flex w-full justify-start">
                            <CustomPagination totalPages={toeic.length} type={"single"} page={currentPage} />
                        </div>
                        <Link 
                        href={PG.PART}
                        className="mt-10 text-blue-600 underline text-lg w-[200px] font-semibold hover:text-blue-400 flex flex-row gap-x-2"
                        >
                       <Image loading="lazy" 
                       src={"/svgs/icons/arrow-back-icon.svg"} 
                       alt={"arrow-back"}
                       width={20}
                       height={20}
                       />
                        이전으로 돌아가기
                        </Link>
                    </div>
                </div>
            </div>
            <PracticeAnswer
                type='part'
                id={params.id}
                part={params.id}
                label={`Part ${params.id}`}
                count={toeic.length} 
                name={name===undefined? '':name} />

        </div>
    </>);
}