'use client';

import { ScrollArea, ScrollBar } from "@/components/utils/ScrollArea";
import { MyPageResult, MyPageResultContent, MyPageResultType } from "@/constants/my-page/datagrid";
import { findSolveHistoryByUserId } from "@/service/toeic/actions";
import { handleError } from "@/service/utils/error";
import { useEffect, useState } from "react";


const ResultContainer = () => {

    const [selectedTab, setSelectedTab] = useState(MyPageResult[0].id);
    const [isClient, setIsClient] = useState(false);
    const [solveHistory, setSolveHistory] = useState<[string, number][]>([]);

    useEffect(() => {
        setIsClient(true);
        handleSolveHistory(2);
    }, []);

    const handleSolveHistory = async (id: number) => {
        setSelectedTab(id);

        console.log('selectedTab: ', id);
        const response = await findSolveHistoryByUserId(id);

        if (response.message === 'SUCCESS') {
            setSolveHistory(response.data);
            console.log(JSON.stringify(response.data));
        } else {
            handleError(response.message);
        }

    }

    return (<>
        <nav className="w-full">
            <ul className="w-full flex flex-row gap-x-3">
                {MyPageResult.map((item,index) => {

                    return (
                        <li
                            key={item.id}
                            onClick={(event) => handleSolveHistory(index+1)}
                            className={`${selectedTab === item.id ? 'bg-black text-white' : 'bg-white text-black'} shadow-md border-slate-100 border-2 font-medium  rounded-full w-auto h-[50px] text-[14px] p-3 hover:bg-slate-50 hover:text-black`}
                        >
                            {item.title}
                        </li>);
                }
                )}
            </ul>
        </nav>
        <div className="mt-5" />
        <div
            className="w-[500px] justify-between rounded-lg py-2 text-black flex flex-row border-slate-100 border-2 pr-10 shadow-md"
        >
            <p className="w-[10%] text-center font-medium text-[14px]">번호</p>
            <p className="w-[80%] text-center font-medium text-[14px]">풀이 날짜</p>
            <p className="w-[10%] text-start font-medium text-[14px]">점수</p>
        </div>

        {isClient &&
            <div
                className="overflow-y-auto w-[500px] rounded-lg h-[400px] scroll-area shadow-md border-2 border-slate-100 flex justify-center items-start">
                <table
                    className="text-gray-900 w-full ">
                    <thead
                        className="sticky top-0 z-10"
                    >
                        <tr className="bg-white text-black ">

                        </tr>
                    </thead>
                    {solveHistory.length === 0 ?
                        <tbody className="flex flex-row items-center justify-center h-[50px]">
                            <tr className="text-blue-500 font-medium">
                                <td>문제 풀이 내역이 없습니다.</td>
                                </tr>
                        </tbody>
                        :
                        solveHistory.map((item, index) => (
                            <tbody
                                key={index}
                                className=""
                            >
                                <tr
                                    key={index} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} `}>
                                    <td className="w-[10%] text-center font-medium text-[14px] py-3">{index + 1}</td>
                                    <td className="w-[80%] text-center font-medium text-[14px] py-3">{item[0].slice(0, 10)}</td>
                                    <td className="w-[10%] text-start text-blue-500 text-[14px] font-semibold py-3">{item[1]}</td>
                                </tr>

                            </tbody>
                        ))
                    }

                </table>
            </div>

        }

    </>);
}
export default ResultContainer;