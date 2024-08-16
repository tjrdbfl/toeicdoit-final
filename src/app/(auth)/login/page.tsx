'use client';
import GoogleAuthBtn from "@/components/button/GoogleAuthBtn";
import RegisterBtn from "@/components/auth/RegisterBtn";
import LoginForm from "@/templates/auth/LoginForm";
import Link from "next/link";
import { PG } from "@/constants/enums/PG";
import { ERROR } from "@/constants/enums/ERROR";
import { getUserInfoInCookie, setCookie } from "@/service/utils/token";
import { useRouter } from "next/router";
import { useEffect } from "react";


export default function LoginPage() {
    const router=useRouter();

    const handleCookie=async()=>{
        const response=await setCookie();
       
        console.log('setCookie: '+response.status);
        
        if(response.status===200){
            const response=await getUserInfoInCookie();

            console.log(JSON.stringify(response));
            router.push('/');   
        }else{
            alert(ERROR.SERVER_ERROR);
            router.push(`${PG.LOGIN}`);
        }
    }

    useEffect(()=>{
        handleCookie();
    },[]);

    return (<>
        <div className="form w-[500px] p-10">
            <p className="form_title">로그인</p>
            <LoginForm/>
            <GoogleAuthBtn />
            <Link
            href={`${PG.LOGIN}/modify`}
            className="text-zinc-700 underline"
            >비밀번호 변경</Link>
            <div className="mt-5"/>
            <p className="text-black">아직 계정이 없으신가요?</p>
            <RegisterBtn />
        </div>
    </>);
}
