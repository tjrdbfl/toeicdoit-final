'use server';

import { AuthorizeHeader, CommonHeader } from "@/config/headers";
import { ITEMS_PER_PAGE, ResultChartData, ToeicProblemType } from "@/types/ToeicData";
import { redirect } from "next/navigation";
import { checkTokenExist } from "../utils/token";
import { ERROR } from "@/constants/enums/ERROR";
import { cookies } from "next/headers";
import { MessageData } from "@/types/MessengerData";

export async function fetchQuestions({ 
    pageParam = 1, level
}:{
    pageParam:number,level:number
}) {

    console.log('page: ', pageParam);
    console.log('level: ', level);

    let questions: ToeicProblemType[] = [];

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/toeic?level=${level}&page=${pageParam}`, {
            method: 'GET',
            headers: CommonHeader,
            next: { revalidate: 60 }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch question');
        }

        const data = await response.json();

        if (data && data.success) {
            questions = data.questions;
        } else {
            console.error('Failed to get response data', data.message);
        }

        const nextPage = data.questions.length === ITEMS_PER_PAGE ? pageParam + 1 : null;

        return {
            data: questions,
            currentPage: pageParam,
            nextPage: nextPage,
        };

    } catch (err) {
        console.log('Failed to get level: ', err);
        return {
            data: questions,
            currentPage: pageParam,
            nextPage: null,
        };
    }
}

export async function submitAnswer(type:string,formData: FormData){
    
    console.log('submitAnswer');
    const selections=JSON.parse(formData.get('selections') as string);
    const level=formData.get('level');
    const take=JSON.parse(formData.get('take') as string);

    const userAnswer=Object.keys(selections).map(key=>({
        id:parseInt(key),
        answer:selections[key]
    }))
    console.log("selections: " + JSON.stringify(userAnswer));
    console.log("level: "+level);
    console.log("take: "+take);

    if(take){
        redirect('/score');
    }

    try{
        const response=await fetch(`${process.env.NEXT_PUBLIC_BASIC_URL}/api/level`,{
            method:'POST',
            headers:CommonHeader,
            body:JSON.stringify({
                level:Number(level),
                userAnswer:userAnswer,
                type:type
            }),
            cache:"no-store"
        })

        if(!response.ok){
            throw new Error('Failed to submit selection');
        }

        const data=await response.json();

        if(data.status===200){
            redirect('/result');
        }

        alert('답안 제출에 오류가 생겼습니다. 다시 제출해주세요.');
        redirect('/result');
    }catch(err){
        console.error('Error submitting selections:', err);
    }
}

export async function submitExamAnswer(toeicId:number,time:number,formData: FormData){
    
    console.log('submitExamAnswer: '+time);

    const checkResposnse = await checkTokenExist();

    console.log('checkResposnse: ' + checkResposnse?.message);

    if (checkResposnse?.message === 'LOGOUT') {
        return { message: ERROR.INVALID_MEMBER };
    } else if (checkResposnse?.status === 500 || checkResposnse?.status === 401) {
        return { message: ERROR.INVALID_MEMBER };
    } else {
        const selections=JSON.parse(formData.get('selections') as string);
      
        if(selections?.length===0){
            return {message:'답안을 선택해주세요.'};
        }else{
            try{
                const userId=cookies().get('userId')?.value;
                const accessToken=cookies().get('accessToken')?.value;
                const name=cookies().get('name')?.value;
    

                console.log('time: '+time);
                console.log('toeicId: '+toeicId);

                const response=await fetch(`${process.env.NEXT_PUBLIC_TOEIC_API_URL}/api/toeic/exam/save`,{
                    method:'POST',
                    headers:AuthorizeHeader(accessToken),
                    body:JSON.stringify({
                        userId:1,
                        timeElapsed:time,
                        toeicCategoryId:toeicId,
                        data:selections,
                    }),
                    cache:"no-store"
                })
        
                console.log('response submitAnswer status: ',response.status);
                
                if (response.status === 200) {
                    const result:MessageData=await response.json();

                    console.log('submitAnswer: '+JSON.stringify(result.data));
                    return {message:'SUCCESS',data:result.data as ResultChartData,name:name};
                }else{
                    return {message:ERROR.SERVER_ERROR};
                }
            
            }catch(err){
                console.log(err);
                return {message:ERROR.SERVER_ERROR};
            }   
        }
       
    }
       
}

export async function findSolveHistoryByUserId(selected:number){
    console.log('findSolveHistoryByUserId: '+selected);

    const checkResposnse = await checkTokenExist();

    console.log('checkResposnse: ' + checkResposnse?.message);

    if (checkResposnse?.message === 'LOGOUT') {
        return { message: ERROR.INVALID_MEMBER };
    } else if (checkResposnse?.status === 500 || checkResposnse?.status === 401) {
        return { message: ERROR.INVALID_MEMBER };
    } else {
        const userId=cookies().get('userId')?.value;
        const accessToken=cookies().get('accessToken')?.value;
                
        if(userId===undefined || accessToken===undefined){
            return {message:ERROR.INVALID_MEMBER};
        }else{
            const type=selected===1? 1:selected===2? 3:selected===3? 4:2;
            
            try{
                const response=await fetch(`${process.env.NEXT_PUBLIC_TOEIC_API_URL}/api/toeic/exam/user/score/${1}/${type}`,{
                    method:'GET',
                   headers:AuthorizeHeader(accessToken),
                   cache:'no-store'
                });
    
                console.log('findSolveHistoryByUserId: '+response.status);
               
                if(response.status===200){
                    const result=await response.json();
                    console.log('findSolveHistoryByUserId: '+result);
                    return {message:'SUCCESS',data:result};
                }else{
                    return {message:ERROR.SERVER_ERROR};     
                }
            }catch(err){
                return {message:ERROR.SERVER_ERROR};
            }
                
        }
    }
}