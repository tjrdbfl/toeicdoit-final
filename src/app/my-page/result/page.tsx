import LineChart from "@/components/chart/LineChart";
import MyPageHeader from "@/components/my-page/MyPageHeader";
import { AuthorizeHeader } from "@/config/headers";
import { SERVER, SERVER_API } from "@/constants/enums/API";
import { ERROR } from "@/constants/enums/ERROR";
import ResultContainer from "@/templates/my-page/ResultContainer";
import { MessageData } from "@/types/MessengerData";
import { LineResultData } from "@/types/ToeicData";
import { cookies } from "next/headers";


export default async function ResultPage(){
    let data:number[][]=[];
    let data1:number[]=[];
    let data2:number[]=[];
    let data3:number[]=[];
    let data4:number[]=[];
    
    try{
        const userId=cookies().get('userId')?.value;
        const accessToken=cookies().get('accessToken')?.value;
        const response=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${SERVER.TOEIC}/${SERVER_API.TOEIC}/recent/${userId}`,{
            method:'GET',
            cache:'no-store',
            headers:AuthorizeHeader(accessToken)
        })

       
        if(response.status===200){
            const result:MessageData=await response.json();
            const resultData=result.data as LineResultData;

            if(result.state){
                data1=resultData.recentResults.exam;
                data2=resultData.recentResults.level;
                data3=resultData.recentResults.part;
                data4=resultData.recentResults.test;
                data=[data1,data2,data3,data4];

            }else{
                throw new Error(ERROR.SERVER_ERROR);
            }
            
        }else{
            throw new Error(ERROR.SERVER_ERROR);
        }

    }catch(err){
        throw new Error(ERROR.SERVER_ERROR);
    }
    
                    
    return (<>
        <div className="px-[5%] mt-10 lg:mt-20">

            <MyPageHeader label={"학업 성취도"}/>
            <div className="mt-2 lg:mt-5"/>
            <div className="bg-blue-50 shadow-md rounded-2xl border-slate-200 border-2 w-full p-2">
            <div className="w-full h-[400px] bg-white p-5 rounded-xl shadow-lg border-slate-200 border-2 flex items-center justify-center">
                <LineChart label={["1회차", "2회차", "3회차", "4회차", "5회차", "6회차", "7회차"] } data={data}  />
            </div>
            </div>
                
            
            <div className="mt-10"/>
            <MyPageHeader label={"문제 풀이 기록"}/>
            <div className="mt-2 lg:mt-5"/>
            <ResultContainer/>
        </div>


    </>);
}

