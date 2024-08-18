'use client';
import { useExamCautionModalStore, useExamRetakeModalStore } from "@/store/toeic/store";
import Checkbox from "@mui/material/Checkbox";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ModalCheckBox=({id}:{id:number})=>{
    const [checked,setChecked]=useState<boolean>(false);
    const router=useRouter();
    const {toggle,toggleModal}=useExamCautionModalStore();
    const {show,setShow}=useExamRetakeModalStore();

    const handleClick = () => {
      console.log('Router navigation with id:', id); 
      setChecked(!checked);
      router.push(`/exam/${id}`);
      if(show){
        setShow();
      }
      if(toggle){
        toggleModal();
      }
      
      };

    return(<>
     <Checkbox
                    checked={checked}
                    onClick={handleClick}
                    inputProps={{ 'aria-label': 'controlled' }}
                    sx={{
                        color: '#e2e8f0',
                        '&.Mui-checked': {
                            color: '#5AB2FF',
                        },
                    }}
                    size='medium'
        />
    </>);
}
export default ModalCheckBox;